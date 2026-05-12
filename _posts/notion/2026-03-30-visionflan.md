---
title: "Vision-Flan: Scaling Human-Labeled Tasks in Visual Instruction Tuning"
date: 2026-03-30
categories: [paper-review, vision-language]
tags: [mllm, vision-language]
---

- ACL Findings, 2024
- Virginia Tech, Washington U, Michigan U, 홍콩과기대, meta

[https://github.com/VT-NLP/Vision-Flan](https://github.com/VT-NLP/Vision-Flan)


### Abstract

- VLM 발전, 여전히 두가지 큰 문제가 있음
    1. **task 다양성 부족** - pretraining, instruction tuning 모두 특정 task에 치우침
    2. **gpt-4 synthetic data의 오류/편향**
        - 자동 생성 데이터라서 noisy, bias 존재

    → 일반화 약함, hallucination 발생, catastrophic forgetting (기존 능력 망가짐)

- 해결방법
    1. **데이터셋: vision-flan 데이터셋 구축**
        - 약 187개 task, 166만 샘플, human-curated instruction
    2. **학습방식 - 두 단계 학습**
        - stage 1: vision-flan으로 학습 → capability learning / 개념 이해
        - stage 2: gpt-4 데이터로 추가학습 → format alignment / 표현을 다듬기
- gpt 데이터는 vlm 능력을 키우기 보다는 출력 스타일을 사람처럼 맞춤 → alignment 용도
- gpt 데이터는 많이 필요 없음, 1000개 정도면 충분
- instruction tuning의 핵심은 llm이 이미지 피처를 이해하게 만드는 것

### Introduction

- 기존 VLM 구성 요소
    - bridging module (이미지 인코더 ↔ llm 연결)
    - 대규모 이미지-텍스트 데이터 → 사전학습용
    - GPT-4 기반 instruction 데이터 → instruction tuning용
        - 사람이 원하는 스타일로 답하도록 alignment
    - 구조
        - 입력 → encoder → bridging → llm → 답변
- <u>**문제 1: pretraining 데이터가 너무 단순함**</u>
    - 이미지 캡셔닝 중심 - 다양성 부족
    - → 다른 task에 대한 일반화가 약함
    - ex. llava의 경우 ocr 성능이 낮은데, text detection 학습 안함
    - 이 문제를 해결하기 위해서 instruction tuning으로 task의 다양성을 개선하려고 시도한 연구들
        - 하지만 여전히 task의 coverage가 부족함..
- <u>**문제 2: gpt 기반 데이터의 구조적 한계**</u>
    - 합성 데이터라서 생기는 문제점
    - gpt 데이터 만드는 방식은 주로
        - 기존 캡션을 gpt로 변형 (대화, vqa, 설명..)
    - 문제점
        - task의 다양성이 부족함 → 결국 같은 source에서 변형한 것들
        - spurious pattern * object들이 함께 나오는 패턴이 있음
            - cup - 테이블이 항상 같이 나오는 패턴
        - long-form output 문제
            - 쓸데없이 길고 비슷한 패턴

        → hallucination 증가, catastrophic forgetting 발생 (기본 task 성능 감소)

- 해결방법

    _**“GPT로 데이터 만들지 말고 진짜 task를 모아라”**_

    - **Vision-FLAN이라는 데이터 제시함**
        - 가장 다양한 유형을 포함한 academic dataset 기반 visual instruction dataset임
        - 187개 task
        - 여러 유형 포함
            - perception
            - domain-specific
            - reasoning

            → 진짜 task 다양성 확보하기 위함

        - 기존 데이터셋은 caption을 gpt로 변형한것에 그쳤다면, vision-flan은 처음부터 다양한 task를 고려함 + expert-written instruction임
    - 2단계 학습 구조
        - <u>**stage 1: 능력 학습**</u>
            - LLaVA 모델을 vision-flan으로 finetuning함 → **Vision-FLAN Base**
            - 정확하지만 답이 짧고 딱딱함
        - <u>**stage 2: 스타일 정렬**</u>
            - Vision-FLAN Base를 gpt-4로 만든 소량의 데이터를 사용해서 **Vision-FLAN Chat**을 만듦
            - 사람처럼 자연스럽게 답하도록 조정
    - 결과
        - hallucination, catastrophic forgetting 위험은 적고 성능은 높임
    - key insights
        1. **human-labeled task 수가 올라갈 수록 성능은 높아짐**
        2. **gpt 데이터는 성능을 거의 올리지 않음 → 능력 향상에는 별 도움 안됌**
        3. **gpt 데이터는 조금만 필요함 (약 1000개), 너무 많으면 hallucination랑 bias 증가함**
        4. **instruction tuning의 본질은 llm이 visual feature를 이해하게 만드는 것**
            - bridging 모듈은 거의 사전학습 단계에서 다 학습 → instruction tuning은 이해 능력을 강화하는 것이 목적임

### Vision-FLAN


2.1. Collection pipeline

- annotator 선정: 21명 중 2번의 training-test 과정을 거쳐 7명의 컴퓨터공학 대학원생이 선정됨
1. **기존 데이터셋 수집 및 전처리**
    - 두 연구자가 고품질 vision-language 데이터셋 선정
<details>
<summary>예시</summary>

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667NG6UFS2%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCNeOHFpojmDCK5vXYdyx4yMTb655mnWw6eilC4PBMCqwIgIbQJtxFeUPGKOZLJc77C14Osf1m2WbPeh60EHJ0EQygq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDHwX4r9hLbSKkh3kxyrcA6pz9ULYEM7U4%2BiLLhlkHvjM6qmfoCJNltwBdXZtqX43YLz3%2FtbsBnD72UQSgTJsu2OcatKL2pA1Fse1xq26aPe7Qq7JlzDlfHHQ8J%2B55UPCgG9oFWtRxdE8eQ%2B3egwDUMUOhkf8F%2BZ2JcvcTXIq4tB9yxKkq8T3MckXjVcaOB1c2VjdGLai6%2FG2JmyUWKM8yNpP6VWWCCeNqy0kxYNnM89ME1KccJTTpdorbPDzwnaxSuFDmi9qYwknMdZjt1lvYJsfGVDApde8di%2BIFesEHLn9iOZW0qatZ4yFmHgOJh76A6kxlaTqE%2FwLODmrTO4%2FwxRRqbEFJDrBa47k86IpdGQ5bDfzwUYbd5uDWYpvwzMFgr9hQDIOPrv8B%2BcVRlUdZgznyz7iiwZPVE76i%2Bwf1T8Cv0gF5hxfyXYnGwhBBbRZjOXZ6YLDPEMfXqRnXL1YSE7q1GxysGoWc8PyuxKXZ6Y%2BpOykybKuyQBoqY8O4%2F4mtp8s02DyKzPvTXRQFHvGfsRv5rhML0Sotkc013n2mNp4TFIYKaEpYr5ghRnppd2%2F8g0fDmdaZH%2Bd7HWEIOwK5so4FRvu%2Fqb%2BL6%2BwXTfv95Zu5wS2rC%2B3wfq1geMWCfCyjV%2Fc8zMveEcX20rQMIGkitAGOqUBrm3Xa1FPVlb%2F3z5%2FKox1PzXTS1nwvx6JTSZJBDSxAh%2FbXAYUzlzwb1ldLSeXmzU3n%2BxfTVUfA4S9fl068S%2Fznh6XdD6WxiCsb32LSCGJ%2B8bUur%2Fc8LfBY%2FF8c3SvcxBkqc5eals3weyZpSs%2FNyfAzqOTz8cCKqA9Kw6Z%2BOtXAnUejLwrn%2BJ3E6gTk92ADvB7U7SKpRPQB5varb%2BD66mD1JFS1WgH&X-Amz-Signature=2e204b085a0994bbbedefc1b222424c3c479d7832d3966b57d0a4f328ec967fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


</details>

    - 7명의 annotator들에게 분배해서 각각 다운로드하고 전처리함
    - 각 데이터 샘플 구조: image, instruction, text input (필요시), target output
2. **새로운 task 생성**
    - 여러 annotation 결합: 캡션 + 지식 → 합친 output
    - task 단순화: object detection → 이 이미지에 나타난 object 선택 문제
    - 새로운 task에 대해서 20개의 샘플을 사람이 직접 풀어보고, 정답과 일치하면 taks를 유효하다고 판단함
3. **instruction 및 output template 개선**
    - 기존에 있던 task는 annotator가 instruction 작성
    - 새로운 task는 annotator와 연구자가 함께 작성함
    - 연구자가 랜덤으로 할당되어 검토, 피드백 후 반복 수정
4. **task 품질 검증**
    - 두 명의 연구자가 instruction이 자연스럽고 명확한지, 다른 task와 중복되지 않는지 품질 검증함
- 결과적으로,
    - 총 187개의 task
    - 각 task 당 최대 10,000개의 샘플
    - <u>_총 1,664,261개 데이터 구성_</u>

2.2. Comparison with Existing Datasets

- _Vision-FLAN이 기존 데이터 대비 무엇이 더 나은가?_

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SFUKPFVH%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIAOb9stPL41agAIv%2BrLMi%2BDGA4%2BDF5snmLnSFadnF4r1AiEA3Euu9fD2nyW8%2FkDUlUkTH9U9gw0CBLZJbtqlvvfEQK8q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDNsDth3pShLqCfdreyrcA4%2BA4eKm6YhPs6tGScnlSDb5h6a%2BLBW8sPekocV5goMIZV4oBszRhxx0x8O3Om2oNjD8jVC0HMui8hHoGbu7Ao1RK6O5rNCND%2FvbQn762ZPb6D7eMELuYc9MzIIaXvsWEU9skp1gwM6qXrfqL8wcAEdrxPPeGwYFDBUE7dYokcMqnKHvjBy%2FGOCCsKSfP1PLpTjzrR6rNPu%2BwmWDdPkdbUQJGLdslW80viyZSR15gDN%2BanWy3cw%2BmjQfQKsBkXwW%2BOgY9kDErNWv6ktcNU5hLPMx6eWFSoLFS5kfxWJ3jkRazidJ352uaMZl4EqdYNibQilpFmwRp2aPXxus6yJYLARYK5D%2FwZDEY5Dl0EoAvJrsg9vGgyzWYcRnwPLOZOJV2pHgRnFkoS7Gl7bSn1lNlN4GIQQGKgwNWDteGJjZ%2BJ2V6Nz0jWtCWBOvcr9HsKbveQqSW7k%2FQ8DSdGEWMiWuk0MAgbjyP59GAW72lQEUisbwGEQURU32zinoN%2BKrzW7ULG5iYaW8mWbNaIuZiL%2FV9dWTxQS8gzsi5PsaZ3%2BCMGG6AHsQgkKws%2FAgWZcpNQ5MkcPATMKTR7g5llZQ7uiS0OwkFwMDchcvKVh31Kr2x5J6%2FyKYHMljIlcNayu0MPukitAGOqUBGrUnKl%2FOKf3YLKs4QKx4N4Paywh732ae8x6OaA9AG8s3PbRzXa4t7fGNAyvW89e9DGc6HN5j4HuAgYHlZC2VijeknLkcM3xMOx4gV52LnPtwClp8za9WoWYHWmzBHVgOg8YRkk5PuqX8U3OUX1FQZlFGF4mIgVTag8ynpVin%2Btk2CrutbdJIoFao%2F2YP8Vl3ZtUjua%2Fi7TkA%2F8EI4VS%2BBCcA8Jfx&X-Amz-Signature=e9a69218bacd0de25c7a716a0b77db1272a16c6317a4230d773853d9392dcb73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 기존 데이터 (대부분 GPT 기반 생성 데이터)
    - task의 다양성이 좁고, 대부분 합성 데이터 중심
    - VL-Qwen: 사람이 만든 데이터셋, 하지만 **비공개**
    - MultiInstruct: 공개 데이터기반, task 수가 29개고 특정 task에 치우침
        - visual grounding 중심임
        - 일부 정보가 부족 - region-specific 정보 없음
- 하지만 Vision-FLAN은,
    - task 수가 엄청 많음- multiinstruct 대비 약 3배
    - task 종류가 다양함
    - figure 2를 보면..
        - 우선 vision-flan은 크게 3가지 종류로 나뉘어짐
            - question-answering, generation, classification
        - classification의 경우 general / vehicle model… → 단순 vs 세밀함 모두 있음

### Vision-FLAN Finetuning


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LCGQSDE%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040438Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIFT11mkvkFJ6aAcOlH4Zd52z%2FxU9nEn2XLOvG8OJOHUqAiEAyI5EbCaT%2Bhk9CTYfPyfV3LmT4iXB7uiKv4Ruol79A%2BYq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDKAtcELqbJCTcFPuHCrcA9q6C3cCrr93Wdw2gFT6mQy60se1K848DzzZlRbxusubya8eyvvVW4vSeE5gknsUOMPF01w8SAfF71xdk1sfLBbjbXm7wadhcmrD9e0oWjhXQDSXcRDObyp1F3Y6tLEDn50ReZNZRGUVMGyYsTiDg%2F7wD7LqwVoSz26eppiYldZp0WHDzc6SHfZX06CLlvlVR9xfQQafXirj1dX1tft0uBEeymvJkT9d4%2BQIFL89cQKzXGVMl7gmY0qVFTMD%2F%2F8BG7rAfZd6opqPCpg4CYq4hn3c818zOGON%2Fq4xsxtMGY8XBkeT4vYIbzWn1tlXD0609r6Z%2FkHi7ewVAXL5vgqn3ymC31SgJM6BrE%2Fo1%2FXh7HgfhOsMkHm1YBuDMzV8j0FDIXGFEwZa7Y3YBGkYRjOskVET61%2FOhESGfoO213eOSKQVyubsb5QCiJ6cgXKMiH8DXlRw1yDVdMzuagdWU2cjb3hSQpN%2F4fdWS0%2FWW83pPlpo8CDjGEOlrWuXReyW4fXGVIHN1ZA5bVk%2FBVSgQvNpVTZ87BlhiHP%2FvnL0nreBvUXhJJx0U%2BV8RyhdbXO2yDER1%2Fc4uApYzCb3BY1PlSec2Qkpi1VDWDrkHA7dAws96ZgVqYy6%2BrU9RIozmLDxMPybitAGOqUB0ErnNccSHLaC%2FfixIbLiWnZ6bheKED9qv%2F0mTWCVnE4HyJi%2B2XDtdo0EDWet9kuZtqHp%2Fo5mrZeWrLUn2Eay9NnFcliTbaENLqsqwh%2BPu6iY7NM56SDCdsHHhLuvbb%2BVKG%2B5k4UPDo8u45N%2B8op4hYAgKmHUeoca3ziqKHJYlAbfs8GKPip59tou0GrxNq2ysW7jX1l9iaiYVGyjX%2Fg8oU3xCfOz&X-Amz-Signature=6e6304f0135195983bb3ce858c6c8260963924bc8a6b11291d5b31dc30c90dad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모델 구조
    - llava와 동일한 구조 사용
    - vision encoder, llm, 2개의 mlp
- 두 단계 visual instruction tuning
    - **stage 1: 능력 학습**
        - 데이터: vision-flan (187개 task 전체)
        - 학습 대상 모듈: mlps, llm
        - instruction tuning 안 된 LLaVA 모델을 initial 모델로 사용함
        - 학습 결과 모델: Vision-FLAN-Base
        - 목적: 다양한 task 수행 능력 확보
        - academic dataset이라서 출력이 짧고 단순함
    - **stage 2: 출력 정렬**
        - 데이터: 소량의 gpt-4 생성 데이터
        - 학습 대상 모듈: mlps, llm
        - Vision-FLAN-Base에서 finetuning
        - 목적: 사람 선호 형태로 답변 생성
- implementation details
    - 구조: llava
        - vicuna-13b v1.5, clip vit-l (336px), mlp 2 layers
    - stage 1: lr 2e-5, bs 16, epoch 1
    - stage 2: lr 1e-5, bs 8, steps 128
        - <u>**llava dataset에서 1000개 랜덤 샘플링함**</u>

### Experimental Setup

- 평가 데이터셋
    - 객관식 - MMbench, MME, MMMU
    - 자유 생성 - MM-Vet, LLaVA-Bench
    - hallucination 평가 - POPE
    - catastrophic forgetting 평가 - CIFAR-10, CIFAR-100, MNIST, miniImageNet
- 평가 방식
    - 공식 벤치마크인 MMbench, MME, MM-Vet, LLaVA-Bench, POPE, MMMU
        - 공식 평가 코드 사용
    - 아닌 경우
        - CIFAR-10, CIFAR-100, MNIST, miniImageNet
        - Vicuna 1.5 13B를 사용해 평가 수행
        - 4개 데이터셋 평균 성능을 **CF 컬럼**으로 보고
- 베이스라인 모델
    - BLIP-2, InstructBLIP, Shikra, LLaVA, Qwen-VL, Qwen-VL-Chat, LLaVA 1.5

### Results and Analysis

- 메인 실험 결과

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5X6RV2Z%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040450Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIBtZ15mDiqBdLBro%2Bj1IVbWzXDbXfSiNajKp96UKWc8ZAiAd8t0iZx7Pe6Mh%2F%2FJxGjXo1XME2RalwWw6mBLw%2BzSBFSr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMHpWCAHMcQe6QAVIjKtwD%2F2KZ1no6G4uwyyMaedrDLxl0vw70P0OE%2Foycr7oDQmnGP9CeZWAsHc%2Fj54XJTOCcqXK2NESVWhvTvgyAT5vplvcQT43zQCcKuFqetBqPKhLEubqdBwloHNzHg4tqIekQTCLTrRf6%2BrdWfnDGIGKesEMXS42n8pf%2B8artCAlpqvLdSRIdb78PhQnPdbdxaOPis96%2ByQvUzYZLxG1Wcah3jOKhtdiapJ59Jx8kIG9k3btdYHS1pN%2FrYBl9kDV%2FVJOqutbKkE4WXsaOD1yQGTMkC8NjL325YmmJ3vNcjR6fjK%2BVIX%2Bqc95ywTJ%2F%2BXijk0aBen3Kf0ya8CezXPiBtEFBp3pVMJvoNXyX7LPww9HDZbUbjnNQkywVMEwlUoPHyEhHJ6dmR1RcSgNBxPaV%2FXIXUIAsQtQCG7BBlwUo9X%2BYE9bGk6PH6NI7bMlWXvnwaG88U2UAtantQojh3%2B2skfiSvYRMd3WB%2BHRFcBqpQMqXxBw%2BRUakPAvBDKMDYaySGvk7PZToD9tvqKkjmJozscq4RGLTkvGd88DDjIGPgB3Y%2F8E6Wfq7L5rLQbTgFm8Dsh%2BWnW7KvXm5SaCL7TQFPmved9X77Dk0825k9MHBgbmqwbsJpnLYiHDPmWhS2aMw0Z%2BK0AY6pgH4dQruTCjK0N3y5mZ6Zw5P%2BCqdXwvj7QVTV0D5kD%2FXYiG4PTHqFOxKdr9E4diwtmEW30XpD%2FCM9BO0l%2Bi5kjePzScShmkeKQw9k8Z8%2F7PA6K7IUDVsrpO6fqAY2qNIrOR%2F4blkLJOwAmnagIE84L9ot51b9%2BSgQuFuZB%2BP4cuqMsVVN8SXlrQSpZO0G7eOcV%2FrcXjQd2NjSyJSFcwr1i%2FeiwM%2B3RRx&X-Amz-Signature=534ebd20fc2e365d82549a711748b4c144e8be055e2fdb145b7927845ce7e51f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - VISION-FLAN BASE 성능
        - mm-bench 등에서 sota 달성
        - llava-bench에서 성능이 낮음 → **academic 데이터로 학습해서 모델이 짧게 답하는 경향을 학습, 사람 선호 스타일과 불일치**
    - VISION-FLAN CHAT 성능
        - llava-bench에서 성능 크게 향상
        - 동시에 hallucination, forgetting 낮음
        - chat 데이터에서는 성능이 향상되었지만 일부 벤치마크 성능은 떨어짐
            - gpt 데이터가 bias를 유입하고, hallucination이 증가해서 그렇다고 함… 이후 study에서 보여줄 것
- **Human-labeled and GPT-4 합성 데이터의 효과**
    - task 수 증가 vs 성능
        - task 수가 증가할 수록 모든 벤치마크에서 성능이 증가함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UUIZ4MPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040451Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCWawUJYd08GNnJTrKNMBtY5uGqyTvbFLVJkKpi64U%2BzQIhAILDgOH%2FVZ21eVWUuaBAPlR3PEaoXn8IVf1%2Fg%2BPeq5crKv8DCCQQABoMNjM3NDIzMTgzODA1IgzKDfyHt%2FSImuVPyowq3AOltOhcMnRbXYXfKvjoPB9v2ZBxR7iuJNSolL%2F%2B66xBdEsh8lDXVOqsJ6vLQN%2FhuuFRJwfZcAI%2Fp%2F3rzLflqc1Z7JFhoibitON24H0S2a1qhII76K6Bq4VNcp5L3uekXV7wg3jxy6iGtWR5i55DAVDOxR0vcun9MA30n0XRmYl2i4xqzCAgb0Z%2Bg8ymrVQtcMeE1QHuxQ3JhWHnI4vcrLS2RMlWpmV4p3K46g7APhdoaWI2o0PyGliVuiRjLfNSfnpQbRltmHJBDIRTxVeCT%2BsBfKdBVo6YL%2Bu%2Bm%2FbHtj9hhdql4kfEaVbSr4qzf94Hk%2BaTFd8avF9J9gNLpMaFgYy5q5pBYqqShEg0jDSMqLHp4MOmamGJerziAHauVhNiC0rd3oOqonn8ffywseefHNvQ8Onbh1e0g1vd7hzgfrUMO2OIXhW6ZJ%2BTQyNX6pgmYEL%2FPq0XMsSRgOYu7Ot6OXcT3aBy3XZ5QnaTDvJGpa%2BlA5zO1XjiCc0lHgp8Cxh9fnFOmSTFv5z4EzIEszhNK4Z5DW0luV0tTmzLH1LgB9cCGbWraMZnOwYNC5zTh8v18KJKlkfMJFl0D%2FeG82oQVA2%2FNTBEy7WrnYUzw%2Fh9DJdq9MqUgR2uTr30F5UOpTDUoYrQBjqkAeNC6Pgq7mCNMVfhlwKKNXQp%2BmO5qrtEDdCwrWkRuG3sToAyiwZMkl2eTx%2FvC0%2BsXbscWZ8MeDJGwexsRQvb0081PwKogQ1lYBxOlmlYMIDlpOIWawONGk28eWtOy2Rz%2BvEVIbmMlUtk4Mi5SmZgSHxx3%2FAmif6b%2FAhoozSlrP5t6A2WGoLgwdtkWtNWnHsYJgcZmv9vmpp%2FY46Ne5m2u4MCTwOo&X-Amz-Signature=8a1de7ee7943b19141d374c520c6c84257e2f597bb771b2cd739382413de581b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPEUALML%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040451Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQDYDvMWZucH1MXXoQwgumhFUFSXOBWVxPZffFEd5nF%2BZQIhAPSPZ23Z80rrTc1a1NSEKgsJs25HimihgTGEPwmUxLBsKv8DCCQQABoMNjM3NDIzMTgzODA1IgxRcfLLPCogMNVB%2Fmwq3AMFQSQ27XWnFIo88LztLO%2BtnYD3XHamct8yuN%2BJPhXt%2B21eA3nf8TiFFt7a3b6XPN%2BtAWPT6ghWB9s28q6SyNPO3CCYKf9GdGtwzkNz7q8TwJwisJ0iIU5%2BO3NY78W6wgIv6Ln3nx%2BOShtsl9dutMQHsRocssYrvAjOmWrknIss0llE5Yjik%2Fqn3%2FsOvgubXpmn0fhrOL83cYBYXZD0C7iO0vJPCuzqLY7netKRud6xyHy43OC4Ga8r%2FVuljidNhrGq5hdi4WvKNePZ7xivckhH5Jxk8dHghDqEynzeZt5ljCA2cNMbIcEdQMVxf7McOsOhI5Ek6r9kBrW7YdPDvqWtebw6UmmHUxfuC1BCavYDMK7aZdavWLz4QwN9nl8TbbWRP3LEupGEq99XlDFo2tyyEZLN78Jvq6K3mxo%2BKiRbu7QDjL37UjbMcPn5NjZ0MF272NTYsiMBzTo0pQqf1uRLQJ24u5zDR2A6EhUhdHH%2BQGZ90r6V7QzafPrARw5boMlk1xbLyGSzPXnq%2FhUukop51d8jFGQbdnudFhcFBAAActZ1PfTrIXNohyOcPFlZZO4s2r22dzFUNPtJCfez1Kcyf0PQCZnhSkUMLWpDwfjoqIavZarpWGHJxeP5MjDWoIrQBjqkAfKGyapxGNYnasU53hS42Uyq1l6Hn5VaL5Oq6dAjYdwPGVtXmIAaw8j7TMlDm2P%2B%2BTV4hOGOOGFT0hz%2BLMWGjhtS%2FeFFZxfmoyt35Tfhe18SySr24rX8bV4c17W%2FUO6seUOJ796N6AhFA6fnAhftg7%2FyN8ftFFR7mfb%2BA5Lx9kXGaoh9y5vT0WyMCZr4OcCvgJ3swjeM0rNuZA97XzFWqkXogvHw&X-Amz-Signature=cc78445b9142070da490b253ef7154b56bf6d3127b9b27282b9a5402065b302d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TF45FM7P%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040451Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCtdTilv6y2enUyfWR3X3a4BtCbUo99RqrtVRan2j0XlAIgNil4z8u0Vr2bLd9Go2UT7q%2FEiB6d%2B4AwHfgPK0tD3VYq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIlbOk0MQ6BEdacKnyrcAwDcODTvXQceIxSNQ2waTAIE21rOkZtP%2F0%2FfZYz6Acv6r1m3t33ZqxwOUpspxc9Uy8KLwcphGiv%2FsheJ9F1q9iiZxiUyTyVpnsDSlu%2BoDSIgJtkR0tV5fgpQVmc02htyKausCs5s3l211OdZ%2BMSwutVoH6uXyGm9SUHyGJNkXabc9kYTnStYUGe6SaZRByrFDx1pzlapBs1%2FdK3l7Vfm1g5k6j209whg7vNZiHE%2BcxcOCR%2B7%2BHSFozts%2FCpRCgUg3PPMNzYfZcWfnKTUibbM%2FgemxljH6%2BQL%2BjWR6Iyr1tRD3AIPrkhzUPJ1VrolHSXlYX3YH5qoCtGTiIvzY2C%2BMzEuAau9l1T9EfIQg%2FOnJ6GvaVc72RPoDOJVErK78huJY5xWgSzEi6dueNjI6yqP8fV6A2GiR5pB0bLaMmeh%2F41FdHBfWGt0PcXa6ox%2BLzdGqzsQ8S2bl6AFDEtPF%2B8xU7yVil%2FjfYYdJI83qpu8ckN8ow12G%2FUPxPGASzhdvN6OVru0ZWqRCRT1MnDGUGnmrbph2lgTVI65YslsWto8UEkdA8TmiNwq%2Bt4W55aPEwHGVMOu2gaq7g9XExaduWzzsuHJgMXPbGQf54P%2F9PHDIMHQalJwdx7yZe8tRxjpMO2eitAGOqUBpHJepbYS2C5faqVu3R5DNZh8GvIeC9XME9hCfbggOQUubiOPYn4LHQ2PL4eiVKSGJdNFOl7CbOz56dlgje6NwxxlddZSmEgAQcYaSIsyMMnU4x1DLs2xmTEMOCW%2Fpd8f%2B%2FAVWsInTXb0Pxmk2E62xEMm3Xk4hIdtgWsAdNKHOjuYh%2B9GmngE4%2BcbvkeIfG4AgUX5Td0iRMmN4QwJ83%2FK%2BbaE9Te2&X-Amz-Signature=a32bc0476b33616b21002f7d44816779ec67a2e28a6d26c12bacf1b977b949fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZNJIYYIA%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040452Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIA8Rmo%2FfOxTa%2FlqRB3rvwEOtsflk6EVf37O%2B6VALXHYOAiEA40U8%2F9JRgGytPEH99LsSjo1BCDfuAz%2FbU5PHKayF%2BXgq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDKnC06vcZm9qSXJtpyrcA2KbP7Pyq%2F%2BfFI6FPPWOIN8I2JkZ3oOb0Zr1ucrT77vLQ4Aqs8nGTyfWHg7ck0S9lkF7%2Fx8Q7Ouh0CSKkG0FmQ%2FJUZIOI0WJScMtJ1Jw8CxSwLCyraA8ipZpNGSNIQGbYj%2FZ17Hhr8GXwezCJRpl1%2FpGeqjry2pfIM54OPP4bHb0XL04zseBfWL32cibic2iP7RFgzdtSBVrewtu6S6PHmdUs%2BJeDa7TblrQQ1FfmcjwqdM%2Fuc9A4Ctky0DP6q%2BJZfD562MzLzyYiQ0tTeq2%2FSbMh0osaBNCNtt%2FyrqzmYhZtqxQQkfIcPEf%2BS%2B%2F2utc6aB2%2FgXX%2FNIYzc7E%2Fcg47pbvDlwWA2hjMdf2hdaapL70dbsG%2BXmmtXWG3HwY4I4RLXpjleU6WiiDXxfr1wNy2jkqU6%2BAurn8NE7ahWnu2VIcaAPXbAS3SR1EIKU4DGLZgvJjo9Vxa3FQKhykGwWT8t5v%2FV4MA1CCkXykFDaMhfjUIQ2xA5%2BPhyTn2iSRqTnhGBXGTuDGz7xQos7E6FpXpkaD3KE9CSpU7NhzvwWy3BeZI13zF1CvDw8p9iMyhF%2B7ngedyiJFOOVOSZ0F54R4Jlwf5W3m6fo8N8fP5pyqpHPs9QqdSBZXFPVVUcLbMJChitAGOqUBtFMWCtFxDixDaAXsMzTMSDmVtjnD11qPWEsiRPnuR%2Bs5tSF7JtnlqUsLTKgmEsFXy5gdPIESRTmgHuRM2kFuRmOORmKPNEQFQlXecKEEiuFk%2BlERJrL9UbG6oN17XCq0z000eYkbejgLY8GiOyC35zDcLdsAOproaN%2FY0IYXmFD2hjhm13cE3ix06p50QYgHp0Nup2YVGSPBRENN0L7h%2BLCy9GNS&X-Amz-Signature=42f67b3d7cbee45c124013e87163defb62a1079b62acf48f69a25196c0291a1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663LDKV7MF%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040452Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIA%2BR1CpOujSB%2Bfd2ALzLKb1tP5Qw8Ag%2FMUjH0GUqvv5uAiAGmr28FFTcp1EEBRrwSRdyW%2FOeD0d%2FFaG83%2FuaNfgnNCr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMFAjja77YjCmV%2BQXkKtwD1O1VRRVo%2BUSt0bniYwnYs0PTj35LDq0xRRtASyR%2B0mRmKTrwFXweEUILAnZXGIrqft1R%2FMh7edkteKx%2Bov1fg4H2gdNXnOJrHLK8xibBodmjirsNRvbMYLDFhx41iKjl7l8UpQ00QI78iSgdveG8vcQhpV%2BA7uUpK1u9SIIkrBoeJ%2FPWed1KRwHRVRyuVsfdsgVL7Qbxl%2FGm0%2FZmx3abLobrojb%2BWfd3vdjPNEbq4COAnQUR9ajeHBzcKMRSBBRU4AaOn793iugggSBWmnkAVL7OEwTRIQSixCaaZvysqIjakaHoDwFKxtKDvmqWiIRXV7WQrebjU0MFn57W88i71KZTq%2BALpebtucLl3ZzcK29uR1q3SUsOBKZs5nj9zqCjWTNnCIMMoEJeyfAY7w%2BXGFYFPEPYXHpz6yU%2BJQT5Q5kiM7yH6terbW4dV0vG0azIbLsXcoHKN%2FxSNRdNudyRg95VhnIjk4RpuovSMZu7Ewj6l8tcJOeVy5UXbBfBWsk1Kv37ETpLJB461dCm5sOxY4jCN%2BTmNwGVlzRc11OLd9lTRnhtk8u5wSy%2FjypqC33bsw%2FQ%2BN8%2BALrvI7jhM8ysa0f2I108J%2FnAKo9bRCJA8jXAwRzJLXJPCigTgW4wwqOK0AY6pgHtBSx%2FDFqqMFJYjklyOwtxuKmMEIjDOgEDQmULb0xM7AWqq6OUHC9AJf9E7SQqwtnr9UWqnNEHbSMWAvnGsYY8Nuf9KRLwqmdXGbJMILkLN9J08GOnGIjrq7zU3Q8%2FmghhVceJozG0m5SKEwn4Ajrf%2F1aglEC3nloLqmHie7JeKCQik9ZhykOqSO2OiQ6YiArk0bh%2FF8O3796IQX0fZ7ATAfYii9Ic&X-Amz-Signature=3fa6cd490032bcf46d90384e5243e8721628c6c4f49dc78e5d5ca5178d2638b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIYTT6IQ%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040453Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQD8uc8DNImyRRXj47d%2B12ekJ0YPfUaRI5pf%2BCy1pfDItwIgEpnNmnOgOdMbDGAwx63tRhXrRX0zTCUKTScV4o6Cop8q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDO%2BV9oD5IMyIyt8RqSrcA7wPzTlR1AaBnTVAkmyU604FpCJ%2B%2FtEnO6CWw63oTid5q45%2FfeakstXdBFAUmRO3hEHIQChfsfhRDPrsbP5nHKhqRnyoYEYH00wfS6Ldpz9II4%2BCAJej74xkLPDKXeuKE9n3My%2FFeW20ke5vuHVRHdunEllYmnIQ1pjpNAlo6tBBSNlPNgP7L8vdZZ76ifpUC5xlwsm%2Bmp5RaMCcL0B9xhab2SxiEvsUEcv4HzmuATQLs2rRiyiwGiaRQevQTzjJaK2PPDEVOXF1m5rUtVQR2R7bwu2%2Beji4B4bAn3XmhlFBYIqCzUAZMNbqtrFSOUDftkWfAfn9Qwg%2BoqcObn6eufL4W7GNWkXG1eVPelfJlA1ywIlQ204bTjGFHQdJPg5cUful5FeGa81odaqkAIA%2FCKRVSH1UWoTY0ApDVP5oRoVXvUj2H2AYxgsXJojZy%2BaQ3ZL4W0YQNuxi9BpyaD%2FMuea6NOq6623Mh4ZlK%2FPH90Ntrt5ApJ8hrrBkCEf0NMIShU6pCxTt1lQ4t44NZJvQ9NmRaggRf12YH57HRC%2BPpXnknKuZCWP6be%2FrVBvbJrctehRdzTvpNJQisOhXZ1EOC17xqGIrxs59a%2Fs06JmOHjTtV164JW%2BD%2F2r4ORHzMKGkitAGOqUBq77gYvJc02bqjiBy72iEoj9CtwBleZGDjIOvlrLmdujUIPH3unGlrrHI2SKZPwETt7bMZVLyfTZxVXECNLg5afxe6aReWDmThy46PIkeUhBmon0saKXtzTdlDa4Vj16o8wmx73uwSmVTmHU3jPiic8mnQ%2BLhzgb05iJWY3elHKwtD6DoyKaFfRN1xtM7bOitX5NQgrTZNUNlzvcS%2Fw9dwb9%2FkgXA&X-Amz-Signature=91ff637bd3d81726969fc9c49b57a03318f2886683c24f61c2c745a173b12cce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XONKULCZ%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040454Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCFbKYr9v1qczXnCq0B8Z83WL0k7IWhPWL1opnXHAHlKgIgPa56c5RbxocuFosbDO6DXkDbdnakkkV9ZZ9tpyEtvVQq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF6afyJ1qYCDk6%2FV9SrcA4NZrVN8EA5uCCme4E2CgTo1yjE%2FK2q8oqGP2D3j%2BtkCIeHIaIbYwwGWe3lPJwt%2BYFzHYuLx8WqHwoJy1pAqqPLXgvFZhKUnx6E4RbQjBZVdulWHaIOxG1AladcPWDMXwi89bNOzaDRJgXyw5dLXWWt46pXfsxXzTJVB1C5rQs7%2BFlvwJcp%2BvhgplwX9%2BTNS6DIlH5vfNaE7WtfcKLsbxDbMNzNqD1cpH0DHUbur08RMzs27lnz404X08H9mUcj%2FRiswFARod9EjEo68kd%2FzVn8p%2FVi%2BwouzE%2B03AL48xRVcacXwe3o0WAh6OGkkjvU4KedH5gjMCsSwWBBO6xMzywJ6XsTNehecRA7HKqQwT2Q9o8yjf2czWlr%2FEdIh5sP3u9Ixok9HY93cWj8nZZJ%2BegIWRYiPO%2FUXszV5eRwQZLxB5RCyLwi4NrOVeado4IIRC1TGckPJDN0sF9HRDVI4ORY20M3szyN4ShdosMJMSNGngEyqcAJHVfACuADJtm2Vn%2FI13Pzi%2BK10ig%2BRsekc8689NNDc0gT0iFIrRRfTMMLgfT0dgLYV9n%2B1nL0MtCmpIXG8I%2Fqnd4n1WxhyNmB7g4luDpU1FJTIa2XDaXVw2ZrCaXi0VZzNOSqc7K38MJSiitAGOqUBpeQLQNWGq4QfHobunwbSvFqLTE2ZO1KoCiB4Sk4Ox1zwKmOfHtbbGBdHbV2SIT37RHWyOWXziF2p69Bj4XF8AuIVyPulN6PG9Yoi9en8Xct3FABaX2VOkYTif31MMR1Cn81gg3yQPvzfUhSI5ibtOcE7JLxnGdswJATjihZdVOK9B4iTAS%2FKLFkFfMfYG%2BWwPQ4P9WlMj7ZnsAcvt4kxry7XBbpZ&X-Amz-Signature=55d5a284f1b75e8450e3f4ff2d19edfe96adb358c3bbac9e7b91a93d41d7d4af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZMABCGEG%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040454Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIBpaXt0cruFBxG8vA1yf2GZ9Bk6ACi5buI5Fqm211p4FAiEAlYvyuGH0%2FAZUPhkg1wHXJgUfZ1dzirS9CUtoDxNxRrIq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDPY04u%2BryzxCG5w18CrcAxKYo3OBZAMr4r44XCJ6F5PuBR8AZReDx%2FLxI4Lpu%2BTOUux%2FV8dlcseJOCg7iEpeb821nuqT7FZrYm7SQywHzCslsLMv9a2CE86kcQNwpMBPEJMYJ%2BPzMryDEjFc5t9oAOP5fTzJ%2BWAovLl6AAeeghktKKkT2344oXuCb4yz1DyvnglrmcKEQGIs55nnxhaU49ZusbsnTqJL1whqnLOPsrAUIid%2FWbo7n5CaOm5XbmotM4uEF9A%2BNBTxAHEvJBeCtkqRdnmbuLb4NPiemqi2xL%2Fz%2Bustppf6eVy9U8qVF6qf3towUetRTJbUYXWBbDwOZvIhzx7I4J%2FKxKAlENia6cw4%2BsckIu7VepAahXvjEJ%2FqLgryuPKBVBGtn27gehaOtNKzrl8chlB2z8HaB9p3bsmXiB1nV6xPfBNnLVJ%2FQtON9zChjwoalMzb8JnJ5iQiz5ts9XlkHyckj4j0csiCiswWTqSzuUw69tIay3bQVbcM8hviraS6mEDOsuapwdue7IZwBhjLAoVSh%2FgfzqKCpGjNc4tk9bL2h7XcjB%2B1jvTC64NgYUBG292T3LJTEpTwMBDYza0wMsblFc39iX7Rq93yDqmimlhjIH1VfT2CZQnm%2BkJpbaGKekSkmOwhMJWiitAGOqUB2QsQ6aqIoxXJ3rDzr8rIGjFDXu1rcLtGJp7ZnrMLvj9WJTJ%2Bq1pbEBS%2FL4VRq2CsK9eBNVDx%2Fdrz2mZDxrmgPKHx5JW3tdqSM2XPFzJmrHr2QurL4JQIFdb7is9S3AotdWaNMUjqQNhCzobvDslR5LcWvl6KPKQRegXpJflFAHzTIop%2BR4wETSH44t61qybXbv%2B3zOHL5%2Bz%2BPzIValde20mPFHAH&X-Amz-Signature=2343dab94cf73905076b77a40222a5921e9187a67f986db6e205521da9d48aca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWFPB2I5%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040455Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIDa2N%2BpxGA3b%2Bg990p0%2BrKmvV6gO6vHd%2Bm22xT0y3XqUAiEA%2BO1fXjoYfYGNyqGpJGp3YTbWKU00yxXX7n%2BurxdhCNoq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDO2OWiB5CN2Qz%2FKqUCrcA9oFKJqmuA%2BPzQNEoC8UHneehuj9HWD0zQxM9yhQJEGC8tcq1aHk6z9eUxZS9k4pT7Fz8YSbIBjGCk1SRyx6Ci%2BgSfhwNFK53qtjI3%2B7GsAigvLYGEHHAVDqnwd76AfeV35ZvLxWZQYtjUJUwINRAFClxg27v2CFOsbsEVoxuDlVdmp5wH2TktujX31kTi5nRWWzbDjmlKNem69wiZqiFlRzWWKDKzvh1i4wEPDEvRRnuERquiD5kob9T0%2FCteYgkkBXVCR82il41A4vCWZa9ZiRenQtvPnSmE8FEss3Be9ZFtP5eg%2FW7qcFTUUlu3rK%2BZeA2lIUFe3CrK54APO5%2FnBZWoftL9EGa%2BMQvVza7s3OyiNbn8ECRr3Lnyh6OwtVDwmaaLreRCI7J36jY%2Fp0mYGEKwf3RyuP8eoIM%2B%2F%2Bks9jrv%2BA7xtQYEV8mVahGSC8KpadxvrPcqRqDbENhega71hLSqj%2BIbIvhoPeabbcJo41O2wzIx4P%2FLgfHs2%2Ft82uMQlQwewmEjIa1OGdbCI5UGvD0APrUhc5%2F9J5jNWYsBhs6Xe1gzhYFig2iiwf5wXm3GKs8DZzjir%2BABuLe1IjvzH5LvQSNDn1gBtD8McPUZqQhaXXfpAJEB5oVS16MIWfitAGOqUB25HAKi0ffKr0sswbqW5Apwo66cgZaVfCw0HQySE71%2Be41Io6zQmETxKjJTzIPb%2FGPN97D4nyiPdscfY1KtgryC%2Bnktv9llNZlFokWeqXGDtthnZQLDyA%2FKj85%2B5ScoAqQlJi1nTDysdL4MS7CPiN10hok9KdrZ2c4vVkdnYhvXLnq5tyf4nT%2FqVSwVza73bvMz0JKtQMdaKQU7tykndaUYpTP2x3&X-Amz-Signature=88f53dbd80a61e5f55374f0b49ce01cf8c5d6ea4224d8a9a77411f041e86439e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWFPB2I5%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040455Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIDa2N%2BpxGA3b%2Bg990p0%2BrKmvV6gO6vHd%2Bm22xT0y3XqUAiEA%2BO1fXjoYfYGNyqGpJGp3YTbWKU00yxXX7n%2BurxdhCNoq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDO2OWiB5CN2Qz%2FKqUCrcA9oFKJqmuA%2BPzQNEoC8UHneehuj9HWD0zQxM9yhQJEGC8tcq1aHk6z9eUxZS9k4pT7Fz8YSbIBjGCk1SRyx6Ci%2BgSfhwNFK53qtjI3%2B7GsAigvLYGEHHAVDqnwd76AfeV35ZvLxWZQYtjUJUwINRAFClxg27v2CFOsbsEVoxuDlVdmp5wH2TktujX31kTi5nRWWzbDjmlKNem69wiZqiFlRzWWKDKzvh1i4wEPDEvRRnuERquiD5kob9T0%2FCteYgkkBXVCR82il41A4vCWZa9ZiRenQtvPnSmE8FEss3Be9ZFtP5eg%2FW7qcFTUUlu3rK%2BZeA2lIUFe3CrK54APO5%2FnBZWoftL9EGa%2BMQvVza7s3OyiNbn8ECRr3Lnyh6OwtVDwmaaLreRCI7J36jY%2Fp0mYGEKwf3RyuP8eoIM%2B%2F%2Bks9jrv%2BA7xtQYEV8mVahGSC8KpadxvrPcqRqDbENhega71hLSqj%2BIbIvhoPeabbcJo41O2wzIx4P%2FLgfHs2%2Ft82uMQlQwewmEjIa1OGdbCI5UGvD0APrUhc5%2F9J5jNWYsBhs6Xe1gzhYFig2iiwf5wXm3GKs8DZzjir%2BABuLe1IjvzH5LvQSNDn1gBtD8McPUZqQhaXXfpAJEB5oVS16MIWfitAGOqUB25HAKi0ffKr0sswbqW5Apwo66cgZaVfCw0HQySE71%2Be41Io6zQmETxKjJTzIPb%2FGPN97D4nyiPdscfY1KtgryC%2Bnktv9llNZlFokWeqXGDtthnZQLDyA%2FKj85%2B5ScoAqQlJi1nTDysdL4MS7CPiN10hok9KdrZ2c4vVkdnYhvXLnq5tyf4nT%2FqVSwVza73bvMz0JKtQMdaKQU7tykndaUYpTP2x3&X-Amz-Signature=2c38b024f0913d9f2fb9fd49e48ee57b967393db8546ea938da92b794bd08c22&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instruction tuning된 mlp를 제거하고 pretraining mlp로 교체함
    - 성능이 90% 이상 유지됨 → 큰 차이는 아님

    → visual instruction tuning의 본질은 mlp가 아니라 llm이 visual feature를 이해하게 만드는 것임 


### Related Work

- instruction tuning
    - nlp에서 시작 → vision-language로 확장
    - multiInstruct
        - 최초의 human-labeled 멀티모달 instruction 데이터
    - llava
    - 이후 확장 연구 - 3d, multi-image, video로 확장
    - 혼합 데이터 방식
- 성능 개선을 위한 여러 시도들
    - 데이터 생성 다양화
    - bias/robustness 개선
    - visual grounding 강화
    - ocr 관련 개선
    - scaling 연구
    - gpt-4”v” 활용
- 본 연구의 차별점: human-labeled task 확장에 집중 / task 다양성을 늘림

### Conclusion

- VISION-FLAN 구축
    - 187개 task, 166만개 데이터, 모두 academic 기반 + expert instruction
- two-stage 적용 시 여러 벤치마크에서 sota 달성함
- human-labeled data vs gpt 데이터의 역할을 분석함

### Limitations

- 모든 task가 영어
- 모든 task가 단일 이미지 기반
- gpt-4 기반 데이터하고만 비교하고, 더 최신 gpt-4v 데이터는 고려 안함
- 모델 구조 제한 - llava만 사용해 봄
