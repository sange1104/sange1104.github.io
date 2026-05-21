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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WGQHMDLN%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIA4AIf7LP0IwfGz7Tj0Dp9xZXHS50bKp3IlHr4%2FUEvHDAiBb1yf5SnjYBtaiwVz4W7iujANBsFFcrH6%2FEroXfnGTEiqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGz8rhrGS1Ar44oCyKtwDC6WOoEn%2FbI8BsRJufB6VpCI23GXlX0oWxdMmtiY%2Fqi6n%2BKl2MI0GG1fI0LCqm260Ap2a0SyDk7S9cfhFtTLJ3PcX%2FsXA6ajvIfhwlfuS%2Fb8onJaoA%2FWPi9GZ5lhrngPrKncb00%2F%2FAnb8Kv7B5qCe0uFsgGxz9gofRZAt32ndHfP9%2FgYkgho4DsWpA8B1MUw%2FxOJq9xUc0hUHPQoSWjdGF%2BdGvWkVrJ%2BbTbKniONzjk83BeZf5I3pj1BS6YpK5pl8wqNADOZ1TAnnzMgIvhxfZkMVzm68rY6l%2BiOlkfCFmJNSmsrGnlskgYl5KK49Q%2F9d0Gj5UBa1dl8qu1S%2F79bq512i53jWwha1cjwYNJ8bRIdSUoVMXCc9sacwq5pOkIDEG2ksuE7f6th9DvaeOS9tNwrFHWi7zlYlF7XJQ9s4bGR6lsuTIWdiByf5d%2BdU5FUVtnPnJnvrT1x6N2usdo2xo80btbB6Lk6DGw4O7tBVYrXVTTwGJIMw%2Bc%2BqPGrSqZYfaVWXKHXipWdJrhBa6BjUJyBtOkENuwf1xx%2BgnNk81LrdX3qwE3ow4BlOFU1X59BPkJDadKuc25kG0VyQd%2B8m8Uf3%2FPXmhpn6kW6%2BO0oL42Gzp5ny4c26whj4Ovww7uS50AY6pgEf8QjZKWt6p28R43oeUnEpLwHveMPZH%2B4K%2BFit%2FtZKtN%2BU7jGNZoNOurvmT1EFXyPEs7MT7pEzS4BjIkxYPUfEQYzRxvNQV8RyG6nBA3f4t8bFnKqH4gGAI68O%2FKC3nLnq2aKD6nFOhhLwkUX0UAWXEyHA7GzRUtoVIlfI2yHdTddQVyC7xgrtsIcf5wep%2FUdSyTvEyvfmW7qipz6TdEBkY0Sko43O&X-Amz-Signature=594b29cd0f49ee791ef95ea24ab055275f67d7e0b84a87e5f9fce59b73c10f28&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PZRE6ED%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIGgvkCjFtol47xOM9kb5wuaxWEmnPnjMtd4VQMGy%2FCbJAiEAxV9X84%2FxW6IKOGR0oDPZI2KJGdKFiM58Njfz%2B%2B2vYasqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJP7SCD2sXeU7MHGMSrcA%2BBCtUanmc%2FPJqQnj89omh5f0q%2BQ1S%2FPnx8h5Kdd4AJN8ymR3mQ94uOweA7UOgAF9N3SDkj3yG0ehZhg6zpV%2B1lxCIMS%2BDvzr9SlrrWwOX8NW3Dyctt5mWQcwDtzhtsbvazZGEct2ZNXP51V5%2BD0ZcJkqhznmC4FblYLth%2BrxuvmQJfap2RruUdVX4aczb5AhzyYhCtI3r6MAkPBycTALQWfjRtA4ImJNnqWNnxocsPPOzXQh8ZlM6G2uq2mH5eD3rRgFx4uIEAQk10ezEz2E5UQ6Mw5YmMfjqbWbiqYlL1ePQ9N%2BQnnW6dVqTVHK24VHHUNzB9qAoxgTokT2njofJI8JKsb8fiWgUdSmrgkO4NMq4sN36BxXIDSOYTVlYUhvbblPEQRmkOmk6yJ2757%2F0kGaSdr6bPW1eRC29nPzwDvqs9gaINhPFUPb9h2H9gfzfV%2Bvyip%2FL3OziGZmGHrEZHyJVfNiQSIPOTFqb2zVqukvmlSfmTEFutpR4BB%2Fu8Zfz7%2B81zSQXPkcpl8I%2FUY5o%2BKe6Y6vTavH80pX3YFaDMdccwUV%2FWh9G%2B9tVBW%2F0oBrp0Qh3n3xXUmZ0FySupWwHkYxIJV2RLrhzZji6mgmzvbAsOgTjc2CdKLcMVUMKrjudAGOqUBhMq23X1N7y6ORZxKIPZSMkvXcQexrq4F7lP2nF3SYuFHDVeY8bd%2By4WMV4wD9JRhrOJSV2%2BkyKzUXDRde1gJ3VvkC9BAfbO3%2BV0Et2tsU6B0gfSV9L8gbqYnXrCIOb0Y1mZ8I4yLIdrdKUJAZj%2Fxsx09PsmVFoJLJFYU5uSYQcebayJGC9FgDm2v0ii31XNVlCMPmRwE0IeHqDyDMlzGbhc9l5x0&X-Amz-Signature=d194b1660d1ce4e81140ae30fc2c8fe972a2fb0e705eac4a44234fbbcada02a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SEDXWOSN%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDQaCXVzLXdlc3QtMiJIMEYCIQDmRedpbEADy8kDzdTbZBA0tPpzYPaUJ0jyq1%2F9oQTrQAIhALIOjo2PH8tIhp3F5BH%2FRVvQiF5z7e3uOtsH4kGSotB%2BKogECP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz1IEKpHXqPmpwOGssq3APIsQHANm3BpDyVlhjRbBAhgo1UusjdNbVKmU%2FAcKoAWpx2%2BBL8Lwt%2FyvRbF3oAXinRcUI7%2FQdxaQ5iXq5IDcOu4KoPZJoB4yTyonOPwEBhE3hPoG7Awjq5vBGjN1f7Xy64ZERHJkox45ciYD2F%2BMghAlaI0OTFTCVPRL7lcikgq1UNzKHoIlx1wPwMmencFiXGRx%2BArlpZj3KWsxqbQHa%2F1tYbL8UCCuj4lr6KS411gn7NgNox5uvhQszfZILr%2FjbyeBvPfnOIsQOPRlngMKawZJ8cqIoK9Pd8qWhJ%2FxvPfyt6UN%2B%2BAvLJiNrXsN1yB%2FBX8zhyjAR9%2Flfg4kgbBnKjrxj3i%2Fty5Qm1xjfPLgQYJeuJMbhe5zwocf1yiEUESh6NjM95ZiZapcpwWgCTcS06kNkZ0BsfRA4QhaekZusUaquy9g2IFkxiFtyjax%2B7mT1V8igc96OOYEhMesGuE4lbNkR2CZ9%2BSV%2F7qB0PaRbIOLsx6pU%2FtagM%2FeYUrBLHa3D4WaDjmPKaLfWn63qNpRr74GTwrVZHmw%2FbhxiYn9eKECoGNZSBaTRRQG9Ex2l4lrTvPDd9qTtCn8WeE3nN0yrCbDqyircv%2FRhmD98S0I9SSfbdfkLJG8Ef2WbbWDCGjLrQBjqkAVG9cY62x7Ua8oqytFDg2TLkbgIBVR6BZIC0B4jl%2BiE43tKOhC%2Bojb7qbBIV8exGqwu7ZvSf73%2BCKCeENMFAT5vWZBxgQAHTfcD%2Fazz%2B02krz1z%2F0b%2BqZnELPP%2FIKorQHl1srbdEOnjTV7%2FMLkykD2qk4CBfYOSEyfYM09rRS6sj5KLY8EojAU7ls6bQVBQRBKE2Q0n4BsyCVsAakCF9V9tQkUjn&X-Amz-Signature=0f88e47e09992868c34dbe80bcb21fa06f7ad6b545bcc5f4177b4bc11148e457&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SEWIQRY6%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJIMEYCIQD5k0OPxDf6nLLK1QXayMn%2F3v5KcHbpTwhh77Hx7TuY%2BAIhAM4sAd1ptX8We4Twia5LC1zbzNZK2YM6wu7P7X6wJhIVKogECPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgypugAvfem8YEpC6Zkq3AMRvW5P0pFU3B%2B6BE9kGwukuOdu8u4U7Th2f%2BFIDCNiJ3g%2BS57aQMIAWIe7BiWVaI4wWIMqGK9KyuO7PaoEfleIOpYky61Iy7s%2Fbg2KsQh2Jk8rYLqnQ7Xmf9ry0nEyBQHYPqW4KvGs76uK3MbD3oyKNP%2FRzJNWksD8lBTQGwUNtLSOfoN4MRKXlgU0%2B5YWt2X3nVZq583L7tLiPhmsbP66tmI8afG0cW%2F0lPphEGS7SepVVcqW6KLtb6CcCxdWVgHATdat0pSmK8UaGOuzldDa2%2FUGH0WwZQ5Wg5fmpRnMCMjAlEhm82PnCYyh4Nmhkcl%2FW1FrEFOOaSO%2BLNlzF6JQGKVRv75TzA8F6oW1Wo5H6%2FUwvsly8BbFrmfkWOAyCopiq4BWvfElkt96ei2zgAjGinSnbfJc6R925Qtdl2bxShN9zLViXQ3fHxiGL0VFD1CK9yf%2Fa0lrjo6Afnb5bv2R8ls%2BJddgaSS2CgG1A6308oQ3FEjmCHzF66W74CEQFwQFwJ3bU1rnWMrrtckGwtcQAGtrrVApsY7yM2QU7Uz0sEbZNyxi%2B%2FHSk3W3j072ZcJPxh5Zf7BrHvSO4Rpbec2%2FKDCKdQxGNtZlVsTHeeTFOHhwudzxp2RrOXd7VjCg4bnQBjqkAUDM%2FSvCYtkxhkona6vojrdDZiM3oRbSoTKkj7sL%2BeWBjROrkkpFkq1CvTiTYQRNgVu%2F9SBSibvAdSg6KwGLdQ3GC3moetASA7l80%2FezKEQBxqmKhw2%2FU61XN41CbIlXiz8Zxt71YhjwlZTjPo64Kg09bcNp9%2Fx6j0JL3O0SvLoYSFTy6vYWveesDLLeJFqKGcOyvlmnwHHfNEaitWJ82n6vf7Nj&X-Amz-Signature=da514f1c0c1954eb96d6631307483802ce0f34f3c21dbbde72333ad8d8e8d3e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U2IFHB5R%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044338Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIDtWiGz3hb189CqwN2vnfQYJzReqjMO5omzeKbC%2BnBEkAiAei6HonqFurBE5b30wlFi18dZzcOYG0PwOQbt%2BgMCFOSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMK5TQmI0Ntd2mEyasKtwDqE%2BFnkzYZgHQPbUG4NqNXWtw%2BNspF0jA4ybxkyJVuLq6m689tBBgBRo%2Bdh2BDBL8Ii%2BavRCnI47fnieMAtDeLOhv8oJwz%2FMJsh7OYBI8gAdaFvgoNMHg3G0zEXeNVi3Om0x4wgHADFR16wipZz8TRpdJ36HBnHDz3XYOpiE4CAAATOb%2BatgY6AwygzwhDqfGGOU4h08OIjcCpT1%2BxvoIotk5UnKl0DAEjH1%2BRjvMheKx1LU2eS5tCBJHMvK6zRB8t3IixFaLm9%2BxSAxitjWzZhEybyj2PX%2BmUlN9GmshyF98uf6qpevmvIncbmSiGsgNcIug31QMgj1PaOXlNjHeWPkb29RpoWwsG0fLqLk6veog7AYsWlarbV4FrxPPExqmMXitxbw5R6ZgfK44HG6lTlmb%2B1D%2BEpQaprauk1skukRkblCOXdS4qjVsSt1D95x71VejnDpLIduiwxbRYUoXNOCwKIPXGu8z0dC2lEvAugaT%2BEcKYKzs9s3owx6OgufHExEddwppa9HLXSEWevT1QAfDspUhxDlBAUP%2FhkiM0sOyJ0ojQ45fJxFxU5zxl%2FJBzN3MpOiSlssIfCwJZ17%2BYI2uH7mlv5NWQtUpxlpKQvDeTHJNZ4Vdndh94NswmuK50AY6pgH9fNHl%2BwnV%2BP5mlPO8lYwDed8QhcUtK9YqA5%2BS7PiKvb2y6q9Oix51l6xZM0NCoNjefHRySJBFatyuXO1W6dD2FwV%2Bimk3qZb9wcx6x3%2BE3CFErtOjEcObQrQ5bvSyD%2BHUo6FDW2qc4q5aawv58VZ8fLpRhpymkCZiVT6FE9XaS139v5zzUi9dG4TrIPlpUfCfJGOjI2CWTLfaf860ObNHKwvPgvQl&X-Amz-Signature=a7537b26b0b563ac60b8ce7118bce77218bb80d383ecc9e8f55f5455c6ccda8e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JS6DJLW%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCICycUIpXNJQQbmo5LZgX0mhGImoeAZqThy7YTcIgQezkAiATGrULNJaoS9bckx7RMKx52Ot1MTOAz8dlzyQthyJ6UiqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMC1PfxHaOLCspliUdKtwDN6%2BLDe4yqMJEmh5wODA8BR%2BOmQsb8cj8ntA%2FKkELyI2acO7T6YmrUKn04cNEbOi9WJlb4j%2F1VRKaxB%2FBvXGApc67Wqec%2F%2BNntikJRdKh1Ax9eiDZ4WUXbpE7SBNNRFa86pO2Lpgy%2FWYAewDbJc7yb1YwSEED%2BycvajkZCwqANaz6tSOkczXPdG6YuTE0UIOrKN2yvao%2Fd%2BJenV4V8CH9wID%2B%2BZI1adkx1FTMCO6GSgfQq99ojZ1eXaoi04mPc3wJPu55vjw%2F%2F4%2BKo0YrLIKPPS7tC92ej5%2FrK3xaLPZFbyx5vWGnDvtWzla0F3cOqJxZhbBU4A%2B50GtBEFc2jpQMinxapQ%2Fc0ONPuApK7P0y9tj97NSI8SnRg%2FnP6mUOAqI3DLbRwBcibkKQXFoW4OtG7QpE7unaKWgEUepLrAd2Yig1s3pAR%2FLu7UKZh0T83NtNK1TBfdfBGUV5uahmzxw2mIQhUfWR8dJPuFF2KnjTUvxasAtQyphuS21upTWo4ExhQKj6EDpWTqfVADwjjgmQIDdW6xDcWACu4BWEmC0R83cJd%2BHCcHmWuY9E7FFPrG7e036N2%2BrqZvAkNmiR6myQGn7wTQ97ZJhQnZuu2vNiL1byw9Hg6nwa5WgWssEwj%2BK50AY6pgGmsGlgnaPwd38V7WFQFicmXNDUR9265OOzMkoqNIpn0oXJsrIiu4sZZom%2BXl9azCUptXB3Q1EEnivTXC%2B2nFHKKhqAnI9UJVc0pVmakBYa3M6x08aB%2FdnWccCSs59lcH2wuYQ5raKv6VFeKYEaTuj1qn6fX3WORdaLhtSL6W%2FdsPgycBjp1F%2B6nQBhEB0ItDEWU6BigaRfH6%2FM7qWXUC0RDrmaff7d&X-Amz-Signature=e2a8ee6011cd903d80d6188ce8bccf460a2dc3116786bfd061e706ed1db20466&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UQCQM3HG%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJIMEYCIQDHMnSjG7CFk%2BNZYjYLV4UuL6M%2BO1jtyScD%2FjHHrWl6DwIhANnn7Wj2SyikXUsfzUdyCkF1t6CwVLrHeGB6zVA28IBEKogECPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwOzp0t6xLBf0A0Ehgq3APCBBW15MZ4ZHCH8LBClQjWCBPYKpBOOLSeZMIaGoYmZiqkD7VVLeFMsmyWQwpFv75ABAPnkv7BIPXoELu0A4sY%2BFcd5fUtTiXYC77cM8cX9aW6uSTOkekiHVmtTZx1TJlYcy6DbiPRnk07E%2FLMi6BTyts6BM%2FSlkVggx5AYv7GH460XkJ7iqpaMjHi37zCmRKVuQPl4E6DwBO%2FFcFPQVTXITN49A6WAACaPcvNhb9V%2F6JgkEMQKZFYOTZ21GE%2FCNX4PsDu09kWSUWFW2IgaVVYRi3Ol6AP9oAGvO5iG2JR12NfvGIiszc%2BYONi8lxoWEb1UpZJd9Kr4OnDNFUY75Z7RJky7Q2%2Fo78ym4woE3LTEJ56V9KxTX%2Fk6chhAdwFDzrNGXgvN4xhPixfHw%2BIRjD3Ju1kBsUT4I3JBuOXHTUle%2BqGxcEeHtaKayxM%2BcvQp6tC5BVBWwQzqUd3Q8ZeMIgESO7gXhSQGRlGwGBdZIvLUFtGY22dhZy%2BKmJI654MT0dfZ3x5kfjG5BlQWWEibPKHoIvG4Y01DL8mHlhY%2FpNjp%2FSa4tw7%2Fpuahm52tqJZw5S6i8s%2Fh6RiZSY0N5hVZZaODM%2BXhqC25Jjz3w7nKPscUzlfy9JV6ppZ8yizHDD947nQBjqkAdUybDDDISLh%2F6r3khaStxzdQR8D1zrdla4HRBrxpM4fPcGdXTaaNo%2BuVGcRtEhG6iguptErOhvCTqWy2Jo4XpiZRO%2BCiN03zWLeI4QPuoOf4DBdhX1xSaZMr3PhDORqnJqvx2uCTz945NWNFHrPTZ%2FzZe5Jpo1CD7MAhiKICZgcJooSIZ8JKycpUOa%2Bo9KHh94mb95vm1Sg2RG3WSn0vLzRpDeJ&X-Amz-Signature=76413cb17f3800325de77b443fe670cec1416948bf8b6847800efa78a787ecb5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q5LDIO3%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIHNXMK4aE3ZvA5gGaa%2FO1xb4uu%2F6dJUe%2BrfJ1MSHbW3NAiEA29DLR4blpbkRC2Q2ICTulS8Q8ICTgnoOCkuwg9%2FYZ1oqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF%2BDSKBvlmg%2F6oajeCrcA9tppc%2BUXqkmjrvthwFLwzGS8Bj5VywoO7gSbBK3%2FYc9bSCCmRoXCPVqOkKt5ADrweL8yqNk3PaqoLdA%2Bgm40ohpevvkDFAHOwg5Xwq0zrj5KxLLKDNdBeNMtQxaS7BXaFtbZJBBEFOqnRzqQ6VDS4BE71nLkSokAidCMPpQmWKtP8ly87sr38macE%2BzGnpkhwk4VzgDh3U9MvCaMLu2aaohxWXdh0QaKNBPnLQ%2BaeVG9TvCr82tz9RaWqvpFyvKQ3ZEpDSoFFmfvtsfYozhkV36cZaq%2BdCL1vggWtnm7Ud%2FthO7m00d98S2XgVlStDhqGipaP3%2BU045qBUEKo%2FhFLakoVVMtIvHHUQ26ACpqYHiXkmkiTJk7SNTaJzYwrn9wRmVKofqXGlxU6KqnHTzgUy4WQvjAdyY51uHt4w0duhiXhUV%2BtdY0C6Z154ILyi2F1sj6nYzQd4pcM%2FVvJuJKzn%2F2TOPTyoiaxCpM5Oq%2FdboMi8fNxYWI99UyK1l11hOUIPxS2y39pJIpZ%2Fp98lUpmdOpkLcbZ2U2UVm0OoC%2FGGib%2FXZ49FcfzSIwLbJuaWrBXfY8tqFas2EhKJ7UFRX%2BGOHMsXcvaRiTb3D1HNdA8P3%2FBhhM6yyML2HUO7GMMXkudAGOqUBBuy%2FmpENLHiajSlMDJ6q9eQVd1XoQGRNFoKsLOz2wCQj4v4w%2BnMtQC8N1VKT6dJzy9wtZa2G3ClcmQ9Kl%2BB5ZjLMV5JWVBxK5CZpugEPuyNAjfPRMEoLABMWK9ecKPBQjfFCXYD16PKu6ff0XRVDccqrZzYBaWXN%2BENUtC1mOT6wTxkL8VdGHP%2FKeBildLAeOTq8gkbaDpWGcm%2BGrC2l8MPlnAcr&X-Amz-Signature=86af5a96275992c4701f6ef33e426f5b5b86a635ee067ac30ef6a7c3c7339ad0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWF7OHBH%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIGaal1d6sEdx6%2B9WsZRUkp6MoAo8cRjOClX1o2retOuTAiBUfpZPNxqgC7OLKMpoBNGhmbP2q90UpFqfZNPyuDwCJSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFDFZH4pW4DcQ5Yr8KtwDcCTY7cFpYQnnvCLdY%2FeQWlk8cZfvlcl0FX%2FfzPxRh64QM2NO68qiNKxKZ4CDOKS0dTF6rwwQxaL01lV0Vo5qMeAmYBdavVSvZ96jyDus6Vipy2S9LMPRFvkUcNK2P9FCkKtiP1WXnqV22ixSQndw%2FtzhiAb8D9Dd41EOtHOcHDmbIUpuyidNobsYHQqlAv33PsoOGNQyvTgBCDgTEfUYycb2WNHFGozeU6SzQwymSS%2FFr0X77F6HN6aJBGwgnU74thXEF%2Bbnnz6UMU%2B6bjNS%2BZ5h0jX9W0aeLDfSDQFhieYhDMK1U%2FZKSbr62HShA82WkLTjuzcESaB8m6framnu7jc5q6U6MWRMnYkIYdwTLVOytXAEisgJshj8sOVHsz3VdtvU2p1fRtmz90Ks%2Fn8IHUWH%2Fu4C4gcR4D%2B%2FOf97QIpXH917eCmv24CnUyozWfqnZGjWCOQ%2BXXciQeONhMLDCaaCo2f50bekKd2e0Jg5UwkYGkWt7YnGXbThyi7IazPAHu0xPWy3OWr1vvOS1EbDd1t9SNJ18wIY344Eru0cHBjHErVl%2Biq%2BN1zRFBp457UMWGRv62Z%2BRnr4AoHYz0ltU2%2FivmRq2OUBE5qTJyOwymTuuctIRC12NQcP5a8wyeK50AY6pgEf2cKeR4%2Bwx67fIka17Kw%2FOYsnu4VHMP3eJ0zXQmUWuiZ9yT3OaMw%2BFY3Wi7K5sf9dvwA56kUUlBnJUxUrvsZB37tU1tDFyaSHMPPaFKtkIBBRaA4Y2SoHb3PJYVPnsav18O%2BQGq%2BSqkH%2FZPrz1PQTrE0myewf0%2B4BqFsLdags341tgncw6X0oSeY8wsDcFOZEKx9Em3LkxTBmcKzR1eSB8dKQoe6E&X-Amz-Signature=eebc18cc861ac515176bd72c4796025864c422de40c769c0a0e648e6e7a0b428&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y4626FVT%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIG7g8O8zYasau1OIdjkXaKT%2FldH%2B3jUA2iGTlehHIpgQAiBItkE%2FTvC6QzB1R%2Bgc6IzVQ15hYEO0qmY5EBtj2aVg7iqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMI2Wosyc%2FFKAdG%2BqNKtwDrGTINon%2Fkog%2FeypegdtBn5pIl1WYj1%2Flu5WAaCVzlJi1QuWZCxFS%2BWGJddKVujOy9pOPIfwwvhMYVmRB0D9EAuP9xrsyeT3%2F08O7bvPSTMDaLaXbVCzw9OTxsU98i6C4KQNND6PqGXHR8kArwFcqtKsYKYOuVpR%2BFebSVi%2BTxKk3Z4WDiQ9rI3fKChMXDM8UnHPr6JHQ%2BGssjFTCnudzt1tIS559ZM7KM%2BzVu%2FChXB8K6Xni8LE6zky1AHzXGwbuhh7PfW97NLh3qAMo7mqT4W1VWu6RZviwRfzDSduRze1FEHOzMwLEqoMFuHwS5RYeyhEozkgbV3HW3GV5qgYn5Vw%2F0abf7iiIOsr6N%2Bb%2B%2BBZrpZNJf0lBmv2ye2Xgrwy98Zs%2B35sezRKKuvlW8v2wU0Hw3t8Hf3N5MuSFkw8Ha7WzZUGchh9U%2FLG4dBxj5CB9NP2qje4DaZKffB35dDvDYRvl5iL5ifJt8aXxrDsXnAEWE02riUa3kPikXA5fjF1NASx%2B6bPppEgdV7Kwlp%2BU0neNnPu58l1mfKpcNatu2UV7jMppzrJ0o8CEQ2t1okxDoRjOUMBKTqgUcOa5Pi6mdY8L5WFDsy29H3qEcvVtOVSQeEnFZWRUPrNYy14w5OK50AY6pgGYz6qj5Os6dTsQtlwI9d%2BgS1wu61QKN4gVuk5KdE%2FM2bef7WoA7qH4oCZyXiW5NvfpQkhGSLASbOll0aYE1%2F1fSq2JaPwY7lEe6WcyXKBW3SnZbOYKfece6zkW7Hnk2UARM5LZO7bsLqW%2BJy%2B4Q5YjfPHexrHE6kM8DM1C7alif8IjH8F1Dv0orSYGMy4lwg4f4kvUjdVkQ1U0SWgO1TJTiebeIGxf&X-Amz-Signature=8493d3ffa2a1d5ae04033d11c1146236323eb6dc81f9e85453434b84980a83d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Z4LI73H%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044343Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIBrSdHU%2Br%2BptUWImL6VHexiGFY1Viq8FkBmPZbRugzpcAiA5o4Qua40NxDEh4Qh6x%2Fg%2B1ntoh7KC6QdqtsZbKhLWRiqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMS5gyKqoGeh3cR0T5KtwD3%2Bwn%2Fa3WGev4IbGzMJQWlSy7LHcxun3sVWKmIKGlYHbl0kxjX4G7UlC7KWj8NFfqmzB0QIIUD4S85lZJp4nRlayvDkr4pQ5g4F51gaWEwW%2B5rimQKkb58xWUOD4sMICTZrjowbxUzBu6777ymgho6MmrVfG1063Z4FMZ1W43nbqWkpTCYNj5hMEb4PPyPqfzvcKxCVvSMCuOGRWnR%2FXUy8MUgpYrszxwzBLQNaiMW8ee3Klx3x4isZJ8BlR%2F7BW8jhcnhlV4rnQ5fyRUVTy1oLeSLLEo%2FZmOm5MToS6r5YzeGxoop2G%2FEQw8XRTTUPDHiG%2BSx%2BOBzrGs3u6pXDnacniMzghcvZOM58M9GeKOm5pj1%2FDoR%2BmE4%2Bg4iSyFeQwuuyftpSfMQ%2BuuMaU%2F%2BcVWj%2FjMArHNRb%2FjwziwVLQ7AeA3DYeHy%2FoQSZVo9vMyU6VSh0WFzjSDfNmc%2Bxmzja%2FhBHSaytQM5HyD1vqgNmOwNnGUreiXbwBWQBAF%2B73n%2FT2WcV2TkbUtqkUdZ7TU6zHv%2BxaROh3wjWo1CDVboWv%2BP2EldtAQ1IUdwcVzfdlZw%2BlqWkGjd2MQ8gcRPLUGDdWRD43cmRC%2BkPIgxCt9GUNHOwEWUVkgZtBXp9EcB1wwt%2BK50AY6pgGw8vzhrEt0%2F8%2Bc5kF8AaPwL59GGNKK1YRLYY3P93sg5KsOgnNvz9WeZX4JkQnCtTzoou8f1wH1T5Kr1R%2BjZB6y1shGLwP6OqnUgoKb35wmi2LsBQAKQ6Y2%2F52USTyuxEwPd73u9zdIXTP%2FIGjZXSiYrA%2Fp5Fza%2BO2X8gfYJfhsKLlXANkOPFfSQThaQJBWTQEqy83hS0%2BFXbCGSg78B6RHecEdrA4X&X-Amz-Signature=590a5b34175b691205006f0f795ecfe04f57bde9d2581058019e1afd9607f608&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ZUBEWST%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIA%2BpwNpRcgtjNuJPuLXwLw53K5CYjlBhBd%2BtsyfupkcvAiAId9wVA5PLtLo2meA%2FPIELuNcEDrima8wwFo0SzZFxnCqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMifEsbj2xlUBWoG9yKtwDUpOj2bVZ6nfGNFzorKgI%2FOsY0yTqu7zAIScUIDixLm0GHZ%2Fle96peNByuxB9e3lTPzc899uziHKZ4zWzAZyBjbhorEe3RiGVHPBb13Xa4gTxtVGngfFDfq7e4yBzV6Oqf9HlpGhzHMGZgNaD%2BSVC1mj1jEy4FKYfIrplVQmUgAtOU5E0A4DvuDrHJDrYnkahR4cE1U0Tq6sFONrUSkw%2Ft9mNrIH5Gn0BVPHxEk8SZo%2B0dMZnyn5%2FWfMsGG3wxN1D54keUK4S7OMxaZQamSPVO9HXDD7RvTfP%2FpyRwtUbNi4%2B0hjnoDZetxIvSfyDkHderW2vBPfbPDWWFUSLqPSRtL3UYymOHH6Srbd0mm2fdfTBCGtlmzKFv93icreAad8va3qERbbOwUo%2B%2BhS7B%2FyxkT39s06IhxepFVx3IEnQc%2FAi00dt2v5L4YOID4Cd5ekdxAQC2HGb%2B6dzcdPF%2BYKrCvoprorXruWZXm3sDlr%2BqUsmSS%2BwPw%2BbeooM60pDT8%2FCO%2Fia8pnQgtWq5pTIKYIYrpeN%2BbXSI4EKdaw5xRbjtXCm430USOfMctlLRUt%2BmNieBSUffYMljoyTQqLAbeUEvhjGDf0SLeW5p12QLpAMfRChSL1K4HnfzIjlJo0w%2FOG50AY6pgFO4mW9BF%2Bn52As6SolGnqNMbj3CeJCpH2ZCLfxq23miYQlC2HYSlJ9%2Fr%2FuryWVAVgW%2B4YmLPmVqEhyHpQXx%2BK4nR%2FqHwDyENFfI5FtwCKQaTr8nFI6UmUBGsF4P5esYtVnlaEIMzgS4bvC%2FsNtge%2FWXoGfjRWzzyK8QX5IkL%2BeIExPGMb1kV27iUn2%2FcYgIrAz7Ysn9u%2B5DS0jKq1VZVyoMo3AYfbk&X-Amz-Signature=94f0b7b010c15c71dc4262265638469c9d789ef0834b067aa8c491b510456685&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46652XCQ3FU%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIEtqxQ4Rvrnn4ZJ0zBWKqQCf%2Bm9Y07Di9wfJRry5iBJUAiEA1Oc9sHjp%2FU81g6h0x8Pju7UY79k9Y49024RjSPNYiiYqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDc6uxoMjkTMcplZRircAzv712%2FYpArG2JLYLK%2BwShR2dTjxfrq770Rj6Ztipcbybmlo0oY5KIYAp8cr0gBMUrsvpVOrPmDowc%2FGPvCPNw14czXh%2FYaXfzy0JrN0OjugrtJ4x56KZoyNqVZsgg0UcHKXJS3Jkxd1rCNfm4%2FrPu1Dk9641c3F3CST49K7xqxd7RnaZB7e8pQcXL8oD078eW2ojBN5pELTKT1GuACJPzYMewy7KV7GTfMN1upV6pqzsQf97ECVTOv7MW%2BHUjE7LnFfFORiZ26gUkJKrul0K6sDLklAmNbRPFZtNdUEyytC1AjLU%2BllRNO%2BPqe414xm05EbOV7RUv%2FXARwrVhCxuQy0ogVFZuGV5EpfNd71hwPiJQDYKL8bvSWZYNd7%2Bb5OmPUdcMiSCNQCLWMSyDq8hFpwuyXfXKqaHSTWE2sqnKsYqY29RAKbOcDen9YdkNcGBLIIHS9UlT4ez%2F%2FrhJdpInhKG5Vsk%2FzHB8FYHvuoPbzx%2BMYWhoAWDj7PyzMpNyKc3a7gwgQz1%2B6TKl5%2BkohaYIx4DatDEmmDdat4YMx9LIh3jeKjLj8i93C5c0IqS78GochGLsCkDXgnS1cJUXlChG8qyko7Ip6ATiUl8iw6sjPMWUx3g9L%2BjP2bCT9wMLvjudAGOqUBooW7HZNaX4ovu32pZOxL2PdeU2pwhftnchx9RL44XqhMFRsdrfaozgmI%2BABaPB%2BW5yqYO7cyJ00G97YOobvwMdrWi2YDTPA2atzA1PmHEHDyFrdTu%2BIkrf7hpai2B%2Fli9DCueg%2B%2F6S6eVuHUe5gy3xe%2FmE7Di5%2Bi5UKG977hnLqTRctM6jFaqsEwVCxhfnwQUe%2FO3cIrqS2AvoEEi54iNVvU0Nkf&X-Amz-Signature=49dc46065940c105314a53e4ba2097865f93e98d61959949239a1b40ff210507&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46652XCQ3FU%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIEtqxQ4Rvrnn4ZJ0zBWKqQCf%2Bm9Y07Di9wfJRry5iBJUAiEA1Oc9sHjp%2FU81g6h0x8Pju7UY79k9Y49024RjSPNYiiYqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDc6uxoMjkTMcplZRircAzv712%2FYpArG2JLYLK%2BwShR2dTjxfrq770Rj6Ztipcbybmlo0oY5KIYAp8cr0gBMUrsvpVOrPmDowc%2FGPvCPNw14czXh%2FYaXfzy0JrN0OjugrtJ4x56KZoyNqVZsgg0UcHKXJS3Jkxd1rCNfm4%2FrPu1Dk9641c3F3CST49K7xqxd7RnaZB7e8pQcXL8oD078eW2ojBN5pELTKT1GuACJPzYMewy7KV7GTfMN1upV6pqzsQf97ECVTOv7MW%2BHUjE7LnFfFORiZ26gUkJKrul0K6sDLklAmNbRPFZtNdUEyytC1AjLU%2BllRNO%2BPqe414xm05EbOV7RUv%2FXARwrVhCxuQy0ogVFZuGV5EpfNd71hwPiJQDYKL8bvSWZYNd7%2Bb5OmPUdcMiSCNQCLWMSyDq8hFpwuyXfXKqaHSTWE2sqnKsYqY29RAKbOcDen9YdkNcGBLIIHS9UlT4ez%2F%2FrhJdpInhKG5Vsk%2FzHB8FYHvuoPbzx%2BMYWhoAWDj7PyzMpNyKc3a7gwgQz1%2B6TKl5%2BkohaYIx4DatDEmmDdat4YMx9LIh3jeKjLj8i93C5c0IqS78GochGLsCkDXgnS1cJUXlChG8qyko7Ip6ATiUl8iw6sjPMWUx3g9L%2BjP2bCT9wMLvjudAGOqUBooW7HZNaX4ovu32pZOxL2PdeU2pwhftnchx9RL44XqhMFRsdrfaozgmI%2BABaPB%2BW5yqYO7cyJ00G97YOobvwMdrWi2YDTPA2atzA1PmHEHDyFrdTu%2BIkrf7hpai2B%2Fli9DCueg%2B%2F6S6eVuHUe5gy3xe%2FmE7Di5%2Bi5UKG977hnLqTRctM6jFaqsEwVCxhfnwQUe%2FO3cIrqS2AvoEEi54iNVvU0Nkf&X-Amz-Signature=758585c0ff4bcac594d5a11724060e566ac67a00411e78f639d6ec7e99ab0543&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
