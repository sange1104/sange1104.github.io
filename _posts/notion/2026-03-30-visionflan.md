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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUZCEZEF%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDR8zaBWqgDNt3cNy%2FfuG4hV%2BTIu2%2Bj79vE1euBntIWjAiEAyx5DEafLId%2FI%2BlXoe8CDFN2ifNlo%2F7yvbubtmOzXJ8cqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDO8heZDcxWxxJsuRpircAwG0R1E20K8h%2FmgMfJzDpEcXqNFpd6vAdMZoUDjTtNfg%2B%2FLhr80%2FCLyylGDT1riWQ5%2BpoCn%2BeuDugNqHK%2Bmjzfjukeb9igSo98WLTUn6qx%2F4wzMwkqEZIS3KEkY%2FV6OVJWD8WguyEGPhIAT3D3fbbK3LLOlFDPf1BpHw9bk9CKGXvwPay%2F2LtsoevE8cRc29Zz9OvR3GfxUAJ%2F%2FcXHESca%2BsmWE1TtoPFwWWqACB%2BCGaNbzgZI7Qrkn3xmTppNEicEuUEz%2BldRcOttp1Vd2t70RlEs4cXj6YMOITEuFLnjqWnPwH5tAOs9n1sUuWxnYWtjkIWxCAUuf%2Bq6h09K5WpVtVNlpxycMRc2052JO9ciJTKFHgkSpSDZQf%2BG%2BAV9oDHwcOydHxb6CbivwybVf2UIt3L2ku6bNg3OVeysuVAWHBc8ug8tIiiJl%2By5k%2F%2FWBxEL%2BHD2du3Qzd0Bp4loiXTbFs1xry8SIQJ6V%2FyNsTQ3Xl1EmbPEpwtICRJ7tohd08xO4PMOsIE0o6FR3njiBuDfQ62nBqCGJFPDUL4aRRhFIFuhO5S0c5JTyZWZJmAAI6an38sVmNJPLAhQ8ANQemeWay2cYGYoxV0DGIaziKibq4qy8VfLwN2I5a9I%2FkMMWGqtAGOqUBDHQWGSeOPi132C5hZGSybq2ogviv2F9iic4GaYdUJSz5esDPOZM7QgpbwWR6haQelByNA3M2IVovTjGn0xBALXUZWqkaJKzFdb4OaLfCV0Hl%2Fgf4uBCNje1TYyrwQjHakxufgtFuyHj%2B2PCpM%2FprSEji6%2FuwPcufXlHEghv8t7YsMf2iNVBn4izEapujYhvLxII%2F0dWJrnFKCNphSdIDGwDd0m12&X-Amz-Signature=90020ecf21ef1db30c7d513054d15c80efcaba91f46055ea4991dfc4c06c5fc5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664SKODXGL%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044218Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICvUrKjlIyctCxNTQUL%2FNh%2FyU1XmVcj%2BpSc2FXKX2mQ4AiEA5HX8fW7B555%2BsKZrVhojkGJ8jfsiHzYyzJMopwX1G58qiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLNn029FeA%2B83b4NEircAzUspJvTyHITTwwfCPpY5xwtq%2FiOpsHaNkxQ%2FalNdon8ROhKsLCRXhd0LtPAdil6%2FmakiyO562jd6d5e9b1tnDSdn0sr%2FFfIbYHguz9aVKZp%2BeFnaaCmHLyARzdVm5c7jaOibVA8tVevzV1CEOyoHEzcDulmf15Wt%2FoVoywsi6d6myoM0EcEkDM3kIG5E%2F0IU7Cd5Ost%2F98PwMhkAtzbMM9UUXq%2BpcED0RlUJZh%2FO5Dwvz6ObDW6corxRHvNWg85VZw4PGgdINwpjtUzzCO%2FAYArty67K9ckkyRqAASZwoZLx33y%2F%2Bb67IcJ5%2Fs7xzR1guJgV%2FXyvWtf6kExnUDwDiG4Upw9kw1zr%2FYXWlIOGE1E%2FINQTN1lebkci7TOZcb053ttuyveQG0blpmdqTmzvnEhXtxXGbDZstb46tfQMbysLk9AWevH6Ymn6GJPC4JaPKc29h%2BXzRdzsuqY1Ne%2BPz1LDd7uMAhlQ89eV0jff2gupDYItEEwyCajJSVnYFtd0DoGgTP9gcUazwKeOZh4J6PEsdhcT1K87bAW%2BhSE4t%2BYAQmXD9xgMxqDKchZpeeDzeHgj5gfXgIx7UtfWHOat%2BPhYjq6eUXp9VSvwra%2BCGur8kmVsd00cb8R58IWMMuhqtAGOqUB%2FwQDUi1xb9Zo2YER1Gsgek6a1t%2FwNtx8ItplAKOh1KdjjLOPlFmqN4C5MSLCM%2B1KCqhzSWQ%2B%2BDs3%2FffSt3x6U5O5x1VNGm32yAcNpmslUvCDSds%2FaN13a%2BYSDM1XdG2MxgyD87IDNmtQBu0e1O7PazWdnVEqiPPAPpXYd%2FBy1UIT5iyCxXP1Do1AcpuqMep%2BDw3h93tf4%2BWape%2BS49x%2B4KJNAp%2BC&X-Amz-Signature=07814e1c1a5892644b69543ccf7b700468dc00c83d50581ff6684ebf962922d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKXDLHIA%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044159Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBXhSrMU2zZ7eHzs44owj6hMVWrp06wQ7jEPp1cQgJbbAiEA4a5dy%2FgyIeo3opA4i46a44CvQBSjyx%2FLAXR2QbA5aeEqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC8vDz9gie9HK1X22CrcA2L5nZManJTpEcW7qcR6%2BzVY0Y0N7nkTUrb9DmEB2a8L0KbX%2FqSqDxpCu6afKw3Zl3%2BkuKQmQ2O0TI%2FL%2FyYFIbuV2b3xyN6ca6c2zHtZwXQMcm0R15QhUP0bByD5vZ%2FSCZomfUJgOB%2BVcu5qbBR9sh2SLN4RRjdr%2B9Ku0gKa%2BLMwsP%2F1PBlv1uJ07ePnNYubtTbe6HGC5KSKLvp7srSmAx%2FUpP0mpddaGNqb1Zvpy%2BQVhSKstWFSGWrgVfPJR%2FVx1Fdq73%2FGzXeT75IHEQ6w0bkgDVnv8HGCVwToxywts%2BTfskzVgXasD1su891nAVJG8kYjFyj%2FL3ymE%2FB60Cwf5aN0KzcgVwjoJDCSU5YuMtKZA0cl1HrWoeCk6ftHok1nTTFIR6bwHlxDiIBipv1Eqsm0IwfB90QXUh6W8ly7gpnVFsMULxZap4OWBho5USEyW7pgRqmJc8g4Ji0AG1W3eR66RIDCjYYTlcnHXLo6AFEiL7P64siJSN5rusv9NUMc7jwgiB%2FIgIuh8KfO2%2F02mn2gGJFtyzbX00k70hd%2FxXN8UksrOUQCxNoTQzN7rZx%2Bi2iofBqUHXuW4%2FlHc6JEaKIC2ClKFbVfDQ5gvU4HWDFucRa4LyGt%2FkWsv4%2BlMJiwqtAGOqUBtJKFR6PTjq2lac7v%2B1Hb0%2Fr%2B%2FxUXuuRrOtCgdwr7rd5Z5bonMRPr89ZuPkqBBqwViu4tfZYalZXCn5UoVM%2BRT%2FoQf8AU%2F0sPwPffCmFwoFaK%2FwpsdehFF%2F4gEJuKcwl6NEfzgpmLIcUvIErdnp3afArZ0Uy4V8MiOdl9IqCA6lFqKZu9Z2FAdqu5QEE3z%2FUlxhMk7B3DMbkO0y4Xv5TYHsEVzB9c&X-Amz-Signature=6f878931e1de4ec5f13059992e56aebd77c6b12bbf4acf067dba736bb6dcd71b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKVK3LXV%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGKD9Nb2rVVZVCzwVpVDtnyizCgeBVTn1vkizzvV5t8DAiAfCwY%2B9DDzTcaIr76D5A7IR6EmhFPOI5owY9L1WGzN4yqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMixr0vuO6t9FbDYNtKtwDVXJZ%2BQL9wdFUYyLPxyn1AOh2mwQL%2BMjJIIY5To9fcdiBLVLlnSvE168IYHSNcGdyP1pXgc3APvbTNRcyR1WrTXDphbO%2FQEx98%2FFXBc%2FMSH6rc%2B7QrYQfcCY3ygoKs%2FMz4hwERCH%2BjNAuQrX90urLpBZ1nUcruJQA%2BDYdtZ6HfNmCHhgN15%2BODY3v4tO2ZYIM%2Fi7FHhRq2RNddYPeO%2Bvfsg1%2B2vwYuCZiaiehP1gN3JHQ5nYxuf5az4Vsz0%2FMciG918tmYdaSaqhcF75ifzdcinUHdF6yAnxV%2FyBZg1cqnn9iwOekxoI47i2V8wAuP8GhpICWXM3Ahi9kOhCKqFvpB%2FX7kZFl92M%2FxE%2FNFpZU0QydPtWknVSHGwUeBpt6tC45fEHUMV4ts8UolJP%2FVTAtQLbohj72W9fydjxcA2fb12nrMvcKplAR9vFerpL1LXUndtH1HrR%2FNgTCXv5CLIfNUZZxmUaUT1mhbsCtC8KsK6daIWetIPJveOIh2Urc31hfQL5D3Ilb63%2FWWRFFZg8jYHEsUToUnR%2F5eN%2Bbssqvmz05D7lABiNATThusDtBMDggRgDOUVzUgn0JKX5MspkcU%2F6a9FClfgy8fwL1Wbjk8ZEwMuijdAKHsTT%2Fs2ow%2BoSq0AY6pgH9YZHGVHVp7ldtjYUUHdnySazoWBT5JLkk342gJGmMSpyIhPbwW%2BvPmgth34cgQHnFWOWhSco0De5g32CtRM6A9haAqNLEH9QR7RdwEtJ0wUipytZuJVw5rnHrbYIrwP0fcZMbEpYTvKbCvkI%2BZkxDPujicHtgiu7HW8UNcKn9fysg7t%2B%2BUZv734NaMb938cJHfvuENGI8MpUNJ9%2BWa305RuosWV2C&X-Amz-Signature=0cd27fefec8d6b1cd8392e2dbc9581ea7bd141625ae5c038cd9d46773f534927&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VTAE4CFR%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEiXylDOLAJyCAk2Ezo%2FP04G3GRg7bPx1MMMAsEE85oqAiEAw7V2WNVR59k7ohAtTb6MaZz3usbSWOjpCKg78TJHkMcqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBfZ7KpiI%2FTQTU%2Fp4yrcA%2BpNaZGVfiaYXb08OaoCPJ%2BL5HV8fHPGdCtrRvbO1jX9iinjfrFAD18yU8GYxqFXmBGNCzXsRSZFn0z%2BC%2BBy0GiE0iFaNY%2Fs5LQwacqcX3V6Y9vmzSm3MW%2FzA1WQIFSs%2BbN%2B3xROt07g2h8K0lRI0j96S5dWgXKsZp1sH0egfsd4Hv7IN%2F3DRfUappciGWVD1vPC7SJrBP7BzHnRZu%2FTL96mAD9ExD8pb1wcuoSB3mFRlb4tSk5U%2FVuM0dkre2rbmB9c%2BueBtE%2BiEvzmz5Hi4KbxM73t8d%2Brb5uVeuCWMwsRY%2B5xQe8YNHl2E%2BFmcb%2BWmUxX1wUd9HEGkwUUx4g5Qq54AItVV2FL6zr6i7RZhkJpwEyn5m%2BQu59zIjsuKu2Ki6QywKtolQzG5k6hjljuWwNLA3lwgHNN35qHnQAz1nlECnyCml7%2B%2Fxa2vIQHdNzWHGgCgKfrMVeeXHgIP8P4TbHmPrpihjm52Vx%2BoIoXIiRWGZMi0ujZPcFKnm4TCxO46LGxwt7o%2FT%2Fe5vlntKEdqBH0jCYcq32JDGVGkYup2Nr9HnWOzpfp%2F1AIi9L0JllqWwiabETUKOui%2FjvBv%2B1lS0Meb5EptGuz%2FPzvhZKyulEvshP%2FY92JFVH4YcdTMOuFqtAGOqUBWr1s9%2BgbSGMbJL0big8iWDsXqs2DFHO6r6sLO0Uj0hvu%2FpS6NitR8LhlkDBJDaNRM1LUvT%2FI7Hxcxwq9CaQNxOqDjbkA5eOHPtlRbslz5h4PHSlrBZaHltTSRyj4BvV4uNpQta4e%2F1kH4mwEqnJhBarVMFHKKJOkZ%2B3ug1vRENGvQfqZhcysi%2B0Fp%2F2fHe6ynxGlUv%2Ft8gN8zLSXmkbqh5ZB2JVo&X-Amz-Signature=81499aceca1af98304ba16cb724d4344bc104d9bf29aefcaab0617f7de87dc72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWG4ELTQ%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCwJkPdcCYFwPY9JKerUcVfvEPwo%2FVNY%2F70FKiEFrgC2AIgTcad%2BhRuFB%2BdAaWP%2BbKc79K27io8nXjNNphSODnG9SYqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBnNN0OCZMnV8gjKuyrcA9CXey8FE%2FEQPtcV8nWKJbFNcqFux%2FAO3n19bQ9dpIoCT5Wsf7gpFZYd8y4Qv1il%2BuV3ZfL58Dhb%2FcLamwHuGIRDQpVS1hljar%2FharDvAM7d2VdtIQF3fVEQQ1bHfGo1StamE6sWks%2FIdiHn4ijVJZQ8QeHWP72APQGZ4%2B8z8CF143qYa%2Fw%2By8IoOi%2FoBtU7826IScvD4Y5dXaIw1fcx8N4UG55E%2Fk3rIedDBg2Mb7pinKSjO3jleKOMnfex0FeGGnckzZNrYpQgPKuKucS500GYQmkklp%2Fnv8uE89Quly6wmk8MLrIh3%2BYWSo7JbIAnwdnmCH%2BQ7itNz0KBGD6TCWYosuxlb6tWEKH7prkgo6hQrRwU%2Befawc89HOJzvEh3iGoKAPvvSoceKml9oFxhRKvRFp0xUWEWYzJo4JeY6h4FruBOas8Onr3%2BnN2s1KcvK%2FxmaEmA0D8AYN4LdjPAMQL58%2BAv0ppv%2BcHeRXWm5tCL34xJHIxsYjUd1Ub4Wt97StLfSGI1VLQKD74nbi56sVbBSE5cveya1OVGDd82ajmSf5i8rh7XL16f7feEK48jMR7BGhmZ96Cfzsib9dgRDtXBOej1RylkBrCt86Dtg2MlV%2FmXh6sNbxlYi2niMI6GqtAGOqUBB8w9Q3k0nSQ62gJsVr6yO6dNvPgdKLBl8eydbfU6FXkrHB6BWeEWTZcTBlL5iVY53flkheMiu%2FwXVzMZkn8Ccs80DlNiN6Ri3WjEwlCbJ%2FMRoXKES8FoufrrMDg5bQN0FpnYqGzbAKMSJSQ0GyCiiyqTmRQT827ZaX8u5%2BqkYzggrC%2BHMIfcWZh2VsYOmMkqgWDnevVL6Sj1E6mxzkOCGKxvVAu5&X-Amz-Signature=cb77698930f5bc7ce8c545b81e021d0200ffadf3a9f72d1f2f161abacfe2624e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNFANRYT%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGS7Dn7zLc3URXZPmcJShNTaRYZv2Rh7o5qmAIPe3iGnAiBTlO5jdObCrQdKZTQIrasJjlH8xaXYNVq2gj9MHrJpiyqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM4HJ3cCp3Ls9HDaOhKtwDQ1iKNAlw%2Ff5DheMbC7Le6bkuFaxNjtyeAdfSep2mqUQleifL3ps1pDpVL3xq7zeVoffjkUV%2BK3I7uvDMd7%2F%2BCPkJTwF%2F9P54ZsPTQPBXTmxKUbSSQIp4BWoKW0U8OvV%2Bg9DIn8Q9pUthDismB3XadwqK51YqIPUmvqVfBFyc%2F398HwHuaasin1dvZvSW9C911KkfFGAMpsZQtejHcHqhrScxW%2BrVaPlw87w6zXH38Mav0tp4UpQnio1volHYZRDJbVjosuiyKmSPDqGZKWcX3QhnJ1JXri%2BgSRTCX8iAI7XPgALXqxDzkn6fGf38WkslGucxmIpxgOoXp7uIMLKTjI97L2RIx%2FCorfqd1nD%2FTSwqRLYoHPOkTWtyr8rMS0WZ67sqcoZYeklK495%2BwmRukbovAq37uMBIPYzekggkCd492QY0qDGhULvMvUjHycuDblf7hy%2BdiWRon6K5Uevm%2BnE3m08jYnZStTWXmA%2B2lzHibqaEd2ysmh1gXoWMKz5YMWmkjg076%2F5rHT1KWcGcDODe563XsUwWibM7FFkqn4TZhMoShYc5QYDAwg%2Bb%2FGkmHjjzCpCAjfGw5cHeQyrfsSIjkAlTkB0gIfccs2E4OqOU3VUToO5%2Bh5tqc8Uwt4eq0AY6pgFqHaiN2KonjEwuTzPDC%2FPu8F5A3SNY4RntijXx9vrUByVL14mbRQ82YEeOxXI8GQ3cf5R%2BHE8fD1j6JSAyJAfOpmhrWMAiOTIr4FOQcOWcd8M0Khh1jrZ1yquydpG9167vvr6kdDerhYCkE6HpSET7IGuG6N9AA8dPvPfLB3lmrnHxbMaqE6sYOqx6oYoVa53GcICGoWRCRsD70pnqewnOQJBBXZFm&X-Amz-Signature=673947cb0ddcc47a24f10693363d56421e38a9148f90e06863de5b0ac1f682bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZQF5GRX2%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBqWk6p0%2BjSLn0lbsrErVL1lfoVcREU0KbqUFScWT1KAAiEAi6IR%2FIQEuRQX1H7YXIjFws1xCp9NNsXRVT75fyQC5ZMqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNG2vdJdyfHzn%2FxiNSrcA6qoQ7WiJpepjcVDFV63BUCk%2FltkuAGNoNgRmR%2BouUeEJRnhf38btqtFKTpS59vwAPPEDvDIDGp2UYJeqYhC8jxzfL0SMivOdrd58wqMxtrnWPZfuDQ0Cw4yH7SWNc6I5Qq66K%2BdW%2BionYavDTVvPx0ouU0lQN5%2Bwvc7aHwWcikfMIupi5tBvlxydllEt02KW3Wst6eilkAZtWvVqW0mIg0VJKKS50SBK%2BONNG%2FkvDa%2BGJmOnCQeghhmtPl0kMEtMHRjP1Y81jDL9v8vYVaGzSasAlowmHG1GLLMi24LMaEO1MVtW4kRv040%2BEUqvWdiYtqxrhHd6sGJQpo1bcGVYcVg1zmFQdXl%2F3TuOeaouNV3sQWI2Cm4dg7pY2BWqaSx2FY%2B6TFSqKrHWrU9NhHzgmRhnA1Dt1kJMKniOtKCurI17AdjBVNDh4izQWfL68bzEnNPSC18hm0p5H6NK4x%2FD2xmDNlDzWNTlCASH24Lt2SS2xhsVEnATfPY1311tTRKtDsHdbUj9zkJKL%2Fkp3OUz9%2F7K9sq93Lx%2FUh%2FNSV%2FbsGUcG092vTkq1es4J0%2BaJe1%2BvJeb3fHpxfabtX5%2FvC04Stkd4eyRXtoMO7ywvuBVovj1w9bWNaU%2F9NG%2BavnMNWGqtAGOqUBYtkE80x7oHtrSSiouKRBlqSfb7KPHet3TBKVm57qJ2TKofUOvGJVHENtGziCVCSDy3g8%2BljYm1JoLurFfSGqo4VdRkt5zJacL83sV0tAgZ84e9AWkUs%2FBdXtYGSjTsl5WRrJPngvsDEEeSuoWNW%2FBE%2BkxI5dCbQV4oE0GWe5%2BCN6ase9Z5fgLK6KXe3jakv%2F88lmnK3PYFtq7K0Pc4SIbrIC9J6M&X-Amz-Signature=aa658a5e7f8283b0036cc8b0d22868bb508b5932e6f6d16061eb88883b0bbd4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665TSWRE3G%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044229Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFaeuqQUc7gULDumJHrKSTYKMARVFl%2FAnjVSZV5xNDJ%2BAiEAgs%2BUQQkmuxY9kX27kknYo%2B%2FvDPoQQ7XnibaOZwQ2PB8qiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCZ9iuZS2%2B9fdWsR9yrcAzlld94F9n6rWbu7H43pGSokObb4YcKs4VxjzwPPC1JA5MVYKVkkFIt6qz3tQc9lmuOFhrko3M%2Fuy78iSeZxv%2FfDKemHnuo7N2g7G3xIGFAiXWM4n7mUhauUrN7AQeAuEp6x%2BDKiPa2mGLsXQFoXMbQZR%2Fw08j8kLMHrSMKbAdi527LhL%2FJfWgSXjxrpyhEzWJf4hglLIBrScmEcBf0rl3rO1g%2FXFGw1Tkpv9yqNtXItKygP5MWSs4E8zegDJa5gDSuAaOmcyZgBw%2FtD27JwS3fFtc7%2FiCk5bid3C6IlNrpK%2FAHmIqmxm5gR5KOlhGuOgUO6rE1VEfsBUacy9treovvLN7wcEM5cnNRLOaRzi0Xz5%2BgLLw7%2BQ7fMIZm24U%2B077AoyOiSEomrSxfFvE6nP%2FDJWQhNl0VcL3EosP55iytsPASlsYy0EarjJ2YrQeWHqUGlSzjzkMmbZuBiVrSN8P0ZKsyne8dtnXNpBbv2LmMVi4yXLb2mTZJRv94W8%2BqtME%2BMMkxW%2B1wtT966l1c7TMZsJAB%2FcpF4LKX2d2xzCs%2BVrmG60vmIGLz%2By9Sygu4paMbIvsN0yY7j2%2FeE34LfesIdvR8Iq1RsKGuHXu5IjdzR4hi%2BHeYXHVPD3zNoMLGHqtAGOqUB5b%2FQxvVz0F09UiJWTNPVx8mQCQ6ScOTI8VSfPlac8AM8BcdLv7SXc29grCok1MeuYBI6tCQ8GuX8R7v6FZo2jhCEyMtG8vegVr0E0mlrKnSpYTexA4lSGBIf7afu9FwAjoRWBCLHyEMxAfTuYo0%2Be5yGMj%2F1lOuS3TqPwMj1fdDZzK5LAJJIpdLDZ1C4h3YFgR7CqfxUdhoTERMM0oenAq6Jo7tF&X-Amz-Signature=0f5a3b33a5bc4e8c3a6fa8b5554ce996a88e00c93864c1a5eaede8051c7a28d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665LLWZOQQ%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044229Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDvf%2BSx8BsR3z%2BYT57uU3qN4CcbV1XiUivFeDAxNZmIBAiEAr0Jzf6%2Bs1gttywSDheYOK5XoDTKqBsNAEo6iIL1P74YqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH8J21vHdiegDuVTIyrcA%2BHaaWt0eQA8VCmBo8E%2Bu0xzwPzaHhsgm%2ByrZ5lZFp8UBomQJjj%2FpdFaWElIM%2FwI9Kj1IRCgOH%2B9Zd7fJPPQdor0W5HvfSvryi9umgpSJ7hu%2FOL7PuP3IhrueTg5Wi%2FdZQq8WjYs1cW26O5awbKer%2Fn9%2FtBQW6ctvCBV1s%2FZwmczUCXRQl3RvtMU8o1NXxlOUL%2FJVS7uM604MJebYhLUsl%2FGMrq7wvqD%2FXKEYYPX%2Fcij66EPeNJqyjuGEvFr%2FbZI4abDY%2BRIkHl5akBCVKlBJH2%2FO9pML7iRntKNdmQv8p56qwVvSOFiJAptCF7ZXoni7TSpyyjIz6CRyHW5qV23CObRYrsKNX1eHeHLnOFNtWKCpL1rVtX3Orxp1ajEfFXN7nbYQhJ0XPQ3ni7vWFvCjukUwI4AgBex1tgWkLfRZ32M7r8CtaxL3j8Q%2FkNNKxIPJ5t%2F65OB3qQauRhYgB9ruA2gG%2FjV6q65patfTMl3sNotKyWJGloKzJG3B1Jc33NOjXvz7TjZFbgWpXjXuF%2BBvDNvbcuwuWXiuN1wPb6nX%2BmG1SjimtJwfLk%2BUn2BCAzVnLklqIE0OCISaRQetQ0nV4Gak9AxMVNZ9BlXh%2F3dvEYBNEgIJGuef2PwX24jMPeGqtAGOqUBmXACstqBl4CIq5g7WRd90bpdCnTFZN%2FZXt2fbbgAqL7aZ5WHbrkzj%2Fh9xmWDbYmF5pDjKItPXbPmZThP0mygYQktuhGio79atxOJDfnoNa79Xz8i1O3vf7MvBTzlwuq1z%2FFnnuJW6CFwNSemdJ9BL5YREcXSIRVBrPIPU02cya%2BRUX5qklUih%2Bl9XRRp%2FCmyI9SQ1bXaAvRMFU3bJzMRcxTSaGCD&X-Amz-Signature=1cb6f2ab60d67a3f783bed39200329016d9a16b3acf5209020c3cee29b90b05d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665H7LI4JM%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGao0dBP%2B0hxouW7hJCzM7eMVsh2yf4gOimnYuMg7ZosAiAna833B5OE318tXiu9ei7ci6zxL2iWFa%2Bl5MuG47qtjyqIBAi2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMeKdY%2F7H2sHmfo0erKtwDBQSYgWWyXqudR9R26sOrmt42coGJYpBANTXpE5L5LwOnq0cort0QZ7dB7BsKXV8PhAD5n1v9RDVeVFR3L62apIbaG4YJb6vAnw9yFvV7B7rx%2B%2Fe9i35RZSXMwyHbkziRpY4JNNr7r7qFT95wpvBQ%2F6uOKnVkkWuUbz4HzYuvCGhcBXc0kfbrI8C9o14EY9H5DO7NDn%2BVUO11%2BugiY%2FPm513DuoT90CXoWi%2Fy0DWhH%2F4rzKaTtESckcoXB9VRJAeAMwS%2B7OZ4mcJsQhX2eu3U9Jl%2B0b2LwkEZo%2BrQgozubIAN7x9MderQOTTui3juS%2Fmi1ZQ5yWQqLzkAyP%2Fs9vKblI2NKjQm0ldNUwlmjYwoSETywJJooHwQ1b5lhORsiUBUF7HRPAUfJu0NEhgTG59EdlIWyZxAZhiPO3c6NBHnh1GjwFkSkzONPIvl9RFc1f2HxjVsMqBttF7WNGb5D5Shu8Kty%2FU7lGMTf%2F%2F9HwloOhA2a0mwpUv6%2FalUsiH%2FXHGiACfF3ep2py3g4jFSupHG6Zofvr2xoKwNWPt3SRd56XDO%2BtqU09oNNDyea3iDAqLF4dN7y4RhYXrjnr0RXa2%2BMKKwCjuqe64e91k5TGdK%2FgrXuSqQsUj86nDQk30wuKyq0AY6pgHCkZSqbI7Bt62BR2vLAOBRQzhgrlfz41IFyVXMrY7b4LIWFJe9eXlIdcV56t2LRtNl%2FSPoS4eJqqpBTimax4ZXvdmd6bmneAUeajkjykb39Tu6XR4u7a0LIubSCYt0gIG%2BIIrh1DY3P5VCMS%2BAxDKWp1jMPseJKf1yXjmNV%2FyUyLZlhRQIseo1TrK%2BpeUVQMWHxV762LYls4F4f9QWwzm28%2Fm%2B06cz&X-Amz-Signature=4b3b7e3c3b784235170800328d7b26944820a7677028dae9cd255e27e5363321&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UOAOIVLH%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDw5shwsEOeF0owO%2FLbEDja6q%2BN5C3RwlWbdjhX6edcQAiBpa1DkqCFcfc0MwTteJQnhZl%2BU9I90Ao7s1XTaRpHxXSqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMH6syoA4Y%2F8ryGu7fKtwDHOS1TeFaKALXUz%2F0B8Kwj3WshBGg9H6c1lBjlJkQRhVGN3Zivn3bXdRf5YhSwODOCnHPCqFKCIrdkz841NrPvVhzaPdFZWPx6gDKcz9jaK3V4cJmUcJtS0Ofg12%2FuhWkVij7HyuERPc64wEa18DfagY6oI9MPi46mBZU6QtmxfizAhiE0ITAOHI22lrjbrH7s0ONUAqX7PVueyuPJku0JUSwEjCAg0TwU7gEvGbZu%2BEhq9aRMrgdH1TIfZREweOZEz48HNq5u5w3Fk8%2Fk3OeA12lPzUvXDaqYs1ujEauxnUwijz5LS7V6o1M7pm7%2BcjjawAcMdPE%2F4U1qxk7pl9zQPOF6lgBGHzU9gLkaVEmYWS51UbScOOo7aGqNZhHMFqIgUyQ4PvCAkinw%2BzfwIKTl1XT%2B03WRr5BSr6QyewzPtvoDzMEHIt57HtpK6HSDEtFbaEbEGXNJVln90gPAic%2FkIcudk0oY9quxNgti%2B6a9vB8ya85GxvxrqA6k3ko8RZkF0MvcsTG6bwg8XsD4j57Bjt0XFR24L5GfrYqdBgKEOu3EGYIAYISmHy%2BJYhy%2BopiRsEOGxDin417SsLyhRcheh4tQg4ebRO6dMkUk6nmd0PoWZ43%2B%2FcRmcsJz9swooaq0AY6pgH6wQMt6ed%2F5U6xPQQkiLmAXcRq3ZLiY2E%2BVIu8BeN2J2ueLgNEqrg9fjdgHJE4MgxW0J6JbQfM6lDqVzPa7vtlO%2BMEbAnI81e9aE3Q%2FxMBfhlMeSgQYcig1XW%2FYgWRPsyWCUKaj%2B4ih0MRPfD%2FSdTB0H1nb7HVtYO84U16hrMSK9kjfQF80XtQ3QVQtJICbpg2NwXuL1vf5sZwjnZm13BcCph%2Fr5Kd&X-Amz-Signature=b19a885de5cc6e056be846c684589d0314044b5d0a7ab5ad5faf68a2bb43d3ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YQDVBUFN%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCyp6g992d4m7lSPQ%2BCF3jNaH9ZsVODV2%2BLZt2kxtl7PQIgOehSWj5TXHhdQu9X4hCVC%2BidPMbJ6hzejh5hygTe5EcqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ6ep1GCUPrLv0nnCyrcAyClctxhnpeX24L88DG%2BB9GBh%2FFVGGxV9u9phptH5Iem2X0vM9qIUfOJTcncqXBD%2FWbSIrV9RdaYMH5hUW2lFCajV1SVA63zmTIDHpiUBOarFakU2KqkeiMuTqJ7z8XyNC3WtM%2FMwm6mfML%2BI%2BtppiVJ4SuA%2FDl2CXbEqhF8yDPDWpRvNPSBKju3iSyl0c2aD4cz4FG0yOGcnoqkWQvmqsQua1ukgve5rOxKb3EZXmhs%2Bs%2BUuaHchSnqMqohrftIY5KRnd%2FiCIMW6sqKFndfe8mAVIlm1Y9G3O%2FuG0vSNmzB36igp9Qmil76KC%2BVxiLRZMjIQjV4wGOZRx6VgIgd6M78AVvg7EVrwX4nO0lYKt8TxS%2FzvFJU%2BqpjMmjFTGZGzXBGdgB0wmUHu9E7rc%2Bw%2Fz1umbyrpNRvWLswqjdaLcs%2BrM2q6QSuvYuCOqt%2F53Ul8TGEQMNie0lF4qtOaYvoiHLOaZ5Xm2FaufvTw3x%2BNkAYicBIWMr4wHBLEv77Hkdq3xlIniBDmLEAw7XE1RcCv7a%2F6LAVEA6Jeoh81Ms8HYOyS0Y7%2BIgAtey1EgB2aY7tNgS31bbVCE41gOqwoANaUOZOSLyEk1UxBWW6QOTAgj%2Fc50YHyikXOhQXmoAAMNCLqtAGOqUBYKjYAXShIrcHraEDzgZsTf%2BVULkC69W1puT2zMsiQUZofQrIKOVIZUgWNuo7oAoGTnIi3uOcj6hm4d%2Bq11%2FyaMhOWJtcHWNj3y42mVZm%2B2dQ35sF166vvsVSDPHIDu8YdKKMUrPf7%2FK3oCRZL35B%2B2o%2BIv2%2BhL2lfKt3VyGV65ixroYgPKN0cqVauSkFLXlkN%2B9dqlvXrQFwNfaxV92IhTFZpMxJ&X-Amz-Signature=11b28108fec91ef11e6ec6eff0917f1a28d1eceeb32d7c813628eeb17102aa6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YQDVBUFN%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCyp6g992d4m7lSPQ%2BCF3jNaH9ZsVODV2%2BLZt2kxtl7PQIgOehSWj5TXHhdQu9X4hCVC%2BidPMbJ6hzejh5hygTe5EcqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ6ep1GCUPrLv0nnCyrcAyClctxhnpeX24L88DG%2BB9GBh%2FFVGGxV9u9phptH5Iem2X0vM9qIUfOJTcncqXBD%2FWbSIrV9RdaYMH5hUW2lFCajV1SVA63zmTIDHpiUBOarFakU2KqkeiMuTqJ7z8XyNC3WtM%2FMwm6mfML%2BI%2BtppiVJ4SuA%2FDl2CXbEqhF8yDPDWpRvNPSBKju3iSyl0c2aD4cz4FG0yOGcnoqkWQvmqsQua1ukgve5rOxKb3EZXmhs%2Bs%2BUuaHchSnqMqohrftIY5KRnd%2FiCIMW6sqKFndfe8mAVIlm1Y9G3O%2FuG0vSNmzB36igp9Qmil76KC%2BVxiLRZMjIQjV4wGOZRx6VgIgd6M78AVvg7EVrwX4nO0lYKt8TxS%2FzvFJU%2BqpjMmjFTGZGzXBGdgB0wmUHu9E7rc%2Bw%2Fz1umbyrpNRvWLswqjdaLcs%2BrM2q6QSuvYuCOqt%2F53Ul8TGEQMNie0lF4qtOaYvoiHLOaZ5Xm2FaufvTw3x%2BNkAYicBIWMr4wHBLEv77Hkdq3xlIniBDmLEAw7XE1RcCv7a%2F6LAVEA6Jeoh81Ms8HYOyS0Y7%2BIgAtey1EgB2aY7tNgS31bbVCE41gOqwoANaUOZOSLyEk1UxBWW6QOTAgj%2Fc50YHyikXOhQXmoAAMNCLqtAGOqUBYKjYAXShIrcHraEDzgZsTf%2BVULkC69W1puT2zMsiQUZofQrIKOVIZUgWNuo7oAoGTnIi3uOcj6hm4d%2Bq11%2FyaMhOWJtcHWNj3y42mVZm%2B2dQ35sF166vvsVSDPHIDu8YdKKMUrPf7%2FK3oCRZL35B%2B2o%2BIv2%2BhL2lfKt3VyGV65ixroYgPKN0cqVauSkFLXlkN%2B9dqlvXrQFwNfaxV92IhTFZpMxJ&X-Amz-Signature=9b9ba2437cd175778f4f5b29c50718790bcd4b4ee9f0f6ce44c10e9f3384f545&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
