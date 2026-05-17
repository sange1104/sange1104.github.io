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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SN2L7NJV%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042050Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDM830X%2BJ9nMV2au6Jbdvqld5gsjQ%2BXuZlLsf2Py3bV7AIgVZKRLAPb84fC95rKe9yhFwHtPn7FBX%2Fxpx55%2FJ%2FbyZAqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIdojEm6aGMlB4us9yrcA5mIfYG2xmfJZHKcR%2Bm0mTAi0y1nVyktTD9d1vllzmEISBrKIxpxGaAatSUP%2FypCO9DYCKnErLQbMIwVqd%2FFlWrSC5QcTaS0spoNje3xkYqDpagwHLK%2B9pGiJ4L4Swd%2FqpLSdJO5LuNiU%2FuRMiSiZK0%2BGeRoUbCS%2BkTppUiJRgVA5Z9KDlXURzFkAr3PG5poeSfSDlExo%2Fn%2BICDg%2F%2FwNUwYH7Q2dYdNLZ0K1r0yNUVquNID5RHiSF%2B25Civ9Cj3BuRpSzFoz4MS%2BFtaDa%2B0NTi5xsZgZblQIUQJdzOao1Fn%2BGfsWHCO%2BAPFENweyxgwaMYXzV%2Ft%2FqhuzzsbEYlVNfEyhrhDUxdLCks6vwv%2FtnciEkf1zaub6WnSbb%2F7NgLSlkGs9er0f36XCTxkYi4V5oBdYCzfTq9tSnW12ShFb7lEXyY6JnK0i%2BISsUlPPreRFzQmXBgc8YVkeTW3iUOpIn6E2I8BAcmMO89YHZJHA%2FKQmXWl%2BDfDAakdAcNyM8mEX6odF3EJUtqB4gbv3jrFegmmVTgPaD7cCl03KtcfnWELg0WatQv%2FmBaxkOjwF79kmNbHyfQIRF8LOJaucUTjNas%2BUHy9y7PwvSX4yynAtg3WBybOet0cRuzoMv0JpMMvtpNAGOqUBSeblrE7dZEwXA205Fo6JkaZ3iE2jUaMEZpJGNv21FhluyFWpHd8AS0D9d%2BGl57ihLnKy%2BjXEYSvulgmag4%2BBHBQhPxduheMyiByDe1Ve1ZimOKYwF1Qz66z0dsJsroY9H%2Br1jvhYGMF5NRjK2eg4sZ2dgTQg8Ov6oZc%2BGqD1JmEB5XTKO3SpcZ8uNUd1pkRJDJsYzjrkQIyJtsm1Q3mzesqM6OgD&X-Amz-Signature=1fb2cdd6b861628c7021609de776de66207ec45f599314368ec07eb04c4e85fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RF2MIO4P%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042051Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICXkTeAjYj4Lbul%2FtBtrUU9SW4SKrkOL2T%2Fp4pSGZX9cAiB7IOVB%2BS6ZoVW9rza1LuYn1ft%2BR94AZw3NyNbzUOVDGiqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMCpytFgm5bGrTMTRUKtwD1wSX7EHTPYvxA6r6qiE3hU3j0530pi6NFPMgwHHsAFVlBtK2HrTLBDd9Tj5no7Wpw2UhF7%2B2rVXkkL6jvNxzlrxGay2%2BZodVvvrzT26qznU3ozhw6GgnboFA0679IfJURfC0BxsqDAVzrmZ0%2BhvOK7aB3%2BAxtvwtYXPoX8AIWP3tuvITcM3jv5EaLtBexwQT6szbrCxA29Z3Jcf0fEz2mXWU2upS17SlvaVA1C%2FVvjV4T39On29btuEOIG%2BIs%2FKQJdV8ySeje3NcMt94PdoO3UMHpc1aAi4anwloNCLT%2FNtQLf%2FAl62nHPRBoxgTwZN%2FTocUz5OYwGvTimjmKrPQaj6C63%2BlpKgZRU%2B1fC8fKaNb0vKQCAUKhxU%2BmD1nwh3QqeayxaF4ZSMlJfROwHKOITsMJmG2W3cfACVsjU4X7BcxQzfxXBDCHCyXcln4JALUkgUBtSn4Nkj9WXyTssdOru038yS341kvKvaEbHBBf96gBckjAAx0YtOs53VzKp5zElRL9zi7axqwbqQLpsfM9U0RO2HNLy%2BqCrd10UAACODKOw9KlxDOcmeu8CouiCWbqPCVs9Q%2FVCTEFG4CLz7dSJ54apHJkIrnfcEyIdONK1DUtxK6N%2FU7ZTCKd7EwhoCl0AY6pgFdwXsfROmWfkXaclhc%2ByGAqE5f%2BwY1Mx94Ypeu1QhaMCgD%2Bmdk9eaVGJdJnYEw2fs2LH%2Fdk8gPmQxTCF9hnGRqlDB%2FQ5Dc02fBiEE%2BQHtto4SSAtleHJEpn%2Bv7h8hxnxaXqlFLv1thA0qfCxfxmbGDjVLqV0GCiVHiyhDJwrko8iK%2BUcS4iutOgqtxwUP6z5d%2BRO%2Fu967DoslpdB2mLQJiA%2F7%2B3fsg&X-Amz-Signature=56c153aeda8ad7bc846be854a65b3dd5c175b017d6111989b0391ff64b4f6294&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QC7SD5AY%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042045Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHce%2FPtyVL0EWVErAek6JUcX4ARNkDLJs2VxzEpTgsoaAiA0HsCQelWWHYkhparG1%2BIVlYDAIKjy26JKRju4yS8d%2FiqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMiIj0JXxhtALcd1JYKtwD%2BmlYxWZMJeZVj5hqYzGJACgcMGicZiUc%2FIAiWEV5wDc9u0jYchDFHqrtuoi7eKuy6cInY%2FO6jaQ1VCr7tWfKznIjeTsebETLs%2F%2F6RdTQgRSRPX6q7vauDBYjjEFkWsLqNWi98Mw3GRbzxYv9jPCZwSP%2BHiqZxxR9SQkK1JQDci9WrzUtymu3oZuAPxPNAjD7T3%2FCjXpio8kBFaDMtHi2SO2ezen4oOLltNl3rWFf%2BNn9Dv9aMi0VIUpeUgMWaex7DxNSgZMRSXVJZxxYTpVEgKpqklF6B1KRO0Jp8hKCVlQRqflt309ZfQQyYgvk7NsPbUUIaZmL%2FMBAhh9uNx54wuvIuVOYR4dTZLeoExEY%2FcW6Q6GySNcvT3ZgJEknrNSh8au8UrgLtFf0Qj4R8QFGRW7K42MIGv%2BxVrjvT6MFIUWTYCnsBnqIgCuXzH1%2F2TP6qu%2FPWg581BxSqmprF7QUnRjKBnPjARvYT96IzpHmZP9QfBa51MiWSbYZ4AlAT3dFDUSW0DPpqBbTIWnLRKNk1M4anKn1l6CkNBQsE4ypP3yd%2F%2BCyFFomdgfJ1WNURDjY2isGn%2B3fRkxMOAQd5%2BmlH82mn26zh3vFgWDMhsn%2B6wI49xdADTL9iS4i7b4wh%2B%2Bk0AY6pgHHBleha5rd4qTD0FeNB%2FJ1skfUhFqAvDdaUqdwdAWd%2BVaR9FcpovdSGhygdE%2FgWXk0tjMVpO4PTxtmdDeK7BZYqWUQ8O3LlwnQXoEM6cgDt2EBu7qBBmdN2yHUJnULHxST8Te6srXKBc3O3CHE5K4E4jgUPrGpvtcA25VTeqe7ScMfZUBH%2FakGWMuGTtnnwzuErm%2BgfOiS85nU2O3hJKzbmim%2FpRYI&X-Amz-Signature=9b9a262e68ba0559b871077dbc3759f8045cedbf0c671340055d2e2db1ac08d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZPEWPSS%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDWREWR0SFEwJiL2%2BzsxG0gn7WdEodRzi0HRtt29YI6hAiBs%2BceP%2BjAoweRl1NEYIzcFe1oS9iafXKaenDq7gAoq9iqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM21t2B7E1EKexZUzxKtwDiC8y1PBPZ5Qt455tJunirn3%2B234CrDfMjXlS4LYCeHhrpJGDUjupsbMoN2%2FuYR6hYE9r1Tn3dc7zDbagi3zjc9OPSJbAg6%2Bw5bAzVgYuixFW1ZnVoQScKBM7M1pjvEARwt4qNkFvWdQI8u3Y%2BeIogbpsVaFbXqP73PRMRNj5MKXb2NGHkmb563TOG5%2FAehe1HA6xFTF7gYqFzigKztUmvUQ2bYzzph1a%2BtH6ENCfWS0axK%2BQCrB%2B7U8%2BqOJBR8B6uRX5NTMeB22qrFyu4PhHFX9cAVp5uz6f7UUFq2XqH4Nv%2B9WqP4Abf2bslVd53u2ys%2FhhA26QR5yDxMVPtP4kyUhSx5yb4ePiuUqLFb%2FBrBtdZFT4BUJ9FkFCijRP8B0JbFz6f7M2Ed9J4q1I6Dvum%2F%2FN9880PQA6pWO7zqr7sGdO5iNWAq4CEn6IeRh7MdTdkSB1GtkMYM491F429hm6PO6wJBP6QNXHaUv%2BBkfiCAeZeO3PZw7KeLayqfEsN8O%2BNw58JS2Drsosliub94u2fOhzoVFnQ5QAGIWQ6UgiknSrMaZmmsjb0B0DNGVEB1i9TxvcXtUVXCi3DQD850nulnPMensfmspvDY0jvQqVwkN%2B%2BN251YMz2%2FDe1IYwye%2Bk0AY6pgHPf%2BDtFKUOmHcZpf9yXRaxzdojkDjV0oD5c0T9tuKlYDEMzobOz8MDqAnqp%2BjeV4VayteLn2yUe2plCMhqyksrwmytUd6fmDLuGJYyhAg1tVj%2FIe4yzRJ5ZKIquBZFeKpC%2ForChyLvoK0NGZMBOreAM%2BoUamwKdQQPBOI0I8beV0xuevQJEvkNVYE1ESQcj%2FHQsZYuX6AwMlKvFDTywA1D2fvSUYly&X-Amz-Signature=403d1d1aba31257c5e89270a8a726744e58e405af7004e98612148a780968887&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RF7UY2KB%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FpTkXxsg3YKZE9wHBc%2FJrw22GRMED%2BP51OoJVaJ1UOwIhAM9NNrFTi9UTEfVNm1RWh7%2F2JmS6e%2BIcDbUg%2B2W2dN9mKogECJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxUuYY4iqbhBv0bxKQq3ANZZa9edHOt%2BXzJV5KbnLIK4h45%2BlrgNPWEZVlbfyuFDiS7dga4xNJSFoUc8sQdCA7IhAyAgZsKF7DPSqrKMk1dlqs%2Blqpfl8X%2FPrX3rmCzDbur4Y%2BCgRzczQUfmdv%2FzDGAz%2Fp3Q63dzu8v52EPcjgr7ZBQVYygf4jexEF7KQeSjtjjjONJ3ut4BrRFOdlIWUZ0oEYjcGSUH2H7zFVNA7zzWA99mKnhNye1KInAIK7Yb3tbgcaWcw85lSOo7BL3M37DNKXy1Zo9gpMN548aD1ObD1HEQa0OJuSj35qn4OyJE%2BeSJlQdwsC8lTHGnEoo9cHtfkbbsNH%2B%2FcgMZKREwx8MmPh5RYqUKL5ExSNT%2Bqxeo%2BW4Zw75f4NmYg3nB6JuMpiiHQ9YkYsprI4hdh7DPU8g78apjksjzE%2FItWIWeYUuR0xL5rv%2BgnNcoukLUB0rJy83g9wUkvJoGw4Dg4qJcRe6XM5NtXLefSCjfOftVnoCp%2BShn%2BoiLcgKO03GHS0dMiZsvZmnYhx1nvNA4OIDNPgXRCDL4JYU9QKdnyRbpxVJOH5CwpgfYUxpGKNovV64YZtWG5a9%2BDlgqcrZVVZ%2Fx%2B1Nilshq2PTwvOzFzYZVNg%2Bbc05UeHcB8gWtwzfyDCr7aTQBjqkAUcqjm%2BJWm3s5jOfzo3l0PJ7kDV%2FxTjl0o2xDfOdBvTSsAgNLK7xXLts1A%2BECTJ1ZR7Vm%2BWRTzfUFwSC0jVuNNpIACatoZdcm0%2F7HP7TCZ%2BZQnqRvjPysIxzJn5i4upUaDTfBCUJ495G4V%2FP7eBgL4cThuoAtCpODi8maCOSB5RIGfkF5bRrGlW4HWhp8AYDjCBVNbwjnuayC%2B9Q9JLG28xL6ZLn&X-Amz-Signature=59a907c7fc25dfd3055bd2fa7f01e253229c38841fb414bb76ce1eb2a4c2bea1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XVIIAAEM%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDF2RwT62COlKzuydShiuFduo6n807OjD5DTLajt5vEWQIhAMoBJ70QrnXW15mJosZpDwKDdHOJ10ZKtAwzzhf3hQeTKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzJxWuCifu4FtapLRgq3AMeb9vdRUfIB15v%2FCsxs0lhBpFvQqZ6GXiv6SvdVb%2FeM9SQovh%2F9pHDpOEyy4N8SvPg0%2BmSw7UoUCUrNbH3p5LFbNy6p9zaR%2BeWagcrGSm%2FBNS6fniD7aAyynPfOrttlhEwbFK6n1TOeejEjiCAeJxsWMQh0qJw4IUML2Y%2Br9AfZHersJ5G5TnXUXhtC%2B%2BTz2lzwv%2FeDcUls569SxEU9LagRsnm5q%2Fo09SnYzqcNKj6Ty92fC3IzTsZgfPWNy0GBFVB1CxOQ5r0MV6%2FeAlZ11TRlnLs0uZ6Y5H0oULLJGzyT66hRg09oNDf5GCoQ9Hrg8dUlc3GF7qroXDYrSzvUtcMffCgwdCczRN2MAoj5A1w5INHUa4qRxElMf0ZEWB1PU1prR36M6WZKsJXrz0p9TJjjSCXUtw3k9s3poxxLsnVVMN7M%2FhuGOSNzTXg8f9aNBJJ0EeASTGw69eYfQMFkBpLsXhtCTcRvxWjntOExsCnyRMfKer3dGg0tGTYWTN%2BHz4Yz8wsBbUzGnzcWdzAsiXl2jM7MlqccLyiHApaVXlZ%2B25DX2rHsS%2FwKWspPxxoDXBH6HqARJVawsboobfJCQ7q%2FP1tLgl1EOM2mSdyezKwv45mf9QJiSQk6YuWETCMg6XQBjqkAf%2Bzr%2B250KDHAeJVWpfSsBftH9AqVEOE5HWChRjOo8gbw6sveYjhPrZMo4vHjRAXzNoTlEUEGmqnFE3NevWftHj2UljoUfpV0iYg5kjDxGjMcTz2185kaAkVtCKsFeX7%2B0Av%2Bw4u0jkXuj0MMSOI5GQw8aYclD6DPBxqKaUpHAoQAPOHOjoTSuf0H5NwxlcZmLvQ2Mhz6CIy2fzbKl33X0nwABHn&X-Amz-Signature=5e86ace266d9ff55e0e74d6677c7eed6048a8a52cb28a0d1702cfccf7adbbe87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VYFJJU3Y%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICtWl7II0J%2BwTrI2KZvGOOu1cbSf8VW6hRKbXwyfVfjnAiEAwdnIWf1XFuK7t2AW9XGMfsztTZCvBuC0cK6zclXPoX8qiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH7gB3t8wQvrEPf2YyrcA6Vazv23CC18VpC%2F6pLg%2B6Jf9VxjHtjGulBgzVAzcFj%2Bc5KM205QxPxisoMUsj9IT360WDYkO9cAMFrRkCnQlOFY3vpka%2FVthtEIj2uIL%2BbUTK%2FMDoT6ty7acD6aKWftOFM4yNZoZB22yhd0So9tIWhC4t79V%2Bhva2v86Y4k6D3eyIUcwNjMjQz8uTS%2FjgTmeQ4DWu%2F0tuhLNsxSB0B3wGeu37H1ftajoYKJPUI7v9WTWZLHrQavbrurMS7%2F98VY%2Fmar0sz2lYSFXM03WVhAEXdI6a8uQ%2FeN3y4YFXJlPn52H2m99ttpHbSE7r0W9MwNXA02EXgIr%2F6r58vSJjK2aZmC05kvxjqD3sLdXUVSwjoWsrXWqK7iEC2Eg2iqPqOgc2wmJqSZhhhBa4zViPDgYOWj%2F170YVSJnT8IRnP%2FL6aKsLLQcsdFltSu5fsyKppAjdvpEoJTUQmqFukPkPUtIbOuCRztg%2FNRMs08rBYL6plGHCREMBLTKs1X2f%2Brgtg%2FyScagwfC%2FpS9Xj9XT7osoZap9gvx8mqkJl%2BqVWpGVO2jReF8YIVkxMljj87dTlZSdgG%2B3o0qLOchdqSziL7uGOQG6FvcCSjKwSO2I6agSqQPgNkzxgiU2QOnEZsfMK%2FupNAGOqUBWODvUfdv4kDrQKV0mjHhxRRsMrnvOdcZUCl58SD7DtTkaNEvB2%2BrfpxhOPLmomGWhPz19n7U2LSQlDtbYGRqC2BG9t%2F6LUR7s76HNCGa1rDxZ%2F5MNovf24XW67xTBW%2FoR1MQh33ao%2Bp69VPxaGbEqZCZ68iQAYBf8JYf56Prk%2FqtpIi6yzc3il55oDrK57JPS0eqKTgrtZ%2F2FnCBJ6gPaVKneomZ&X-Amz-Signature=4a502d63b14569476ff959db513896609569aa929d2bce02fed1a742e9031588&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666ATB4D5T%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEqFXiSlJIF7cIFZlLQ2gBSz7OOEiki6lwzS591eZzx9AiAPIAihfx0ztKHEDTrAgPvmHKCSu5KHEo6SRPvBEw7CgyqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMva0FZYmcUzKSJC%2FgKtwDltt%2BR%2Fn4pkiUYPSuzZ9XJlaXuMd4%2FLcGBSBCwbdFZ%2FptlgiT6qOXUxbc7dss8qAoA9xNwcuQRz3W8%2B7dwDU3Zo0zKkg%2BLDfbzsVwi%2F9VP2medu2HCoZX0tAutFB3WLqOrcn14I598S4SLHNu8MLc0Q9ydMRi5fkOIsgVg76a7qTwchY8gtNcUGE2anzpa24jXCLUQtV89QlAe6EUY87GSfrJhnIpC2xiSipOuUgAgwcHvofQw08EsyfznyhkwXX5Iz5pZ7TsUgiiT6xLfmc6VOYgxLYirM%2ByO3KxHEzWYR2TLK28UVxdxrx3AwFZ9LxAExxF3PSS2B7oficF5iDE2JGXFFwQw%2BbBO8m1%2B1Cn%2FUvsd%2F8Mw%2Fy2TW93EevEtsaKICWiuOo69G3LBQgHgrxk1v042gZuhgViK3FlL41Gh2At3hA6LYF9%2F7X1FEkgu05aujuPKpRLEHNzVI22FlF1%2FwgGnYmZATQTo3aFP%2BzLH2p2R%2BlcLiO2rZiOVNTlH4SoEDdZJXP8ffPYBYcf1G6pFspy4%2F0aufjTQjKXUiOQRgEVPdk9CCqy90YbCDqaLzjyWJQ%2Bh3bPyWM52XrVY0HGExnn%2Fv1a%2B4CbNWbTnc3rrl7ZiNG%2FQ9QSB5d5Iz0wo%2B2k0AY6pgH1HPEFtDObYTYUIuvdYs%2FZ%2Fr2GCBr11zkD4WXUQ8E2J0QpBi6NKA7jPztsYmCjQr3CxcXTDoS%2FhaHEpfUG8To4Sa8BBErZS2FaSIeXjIYqe3pMGM0eFY8YVR1L1I3GIHh53x6apSKe1fhNFRyI%2FEHlPXG1p9g44L5jZksVLRqs3dKtgmHkjCS33UlDtzqavc5dLmmaHPLparL35d5fZo%2FTz7f3vS0P&X-Amz-Signature=f09ea55ca1caa32d72475a896ccf0967a760329c5ededad23ac7ca53103476e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAS5CMS4%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDV0lZjQh3t8ScyyXl9k1vRMOu5EHtx9Ikbu9Awbg3wagIhAJJHWFCG5B2Qvs%2Bn5Svjhx2vNj7UTZi151oBt4FFM5b%2FKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igymb2SqrrugWPwQb%2Bcq3AOne83ulQqY%2FO7YNXzb5R%2FauMe1X%2BoyNQcj5z2Lr0UnGlcIcqcC4r6ko%2F6fgAZIwdK51VlhOklo6tLQk6LfGqUgJUYczcAHotLjwbL4a8tbHnD7O6blpe6%2Bzk65AnsNVRJqzn9Zxg4cXi3DpyXPjhV25mCTptffzIzIR1TKA5NAHyltvChEICixp3%2BwV8bBPGTMPDwMbWg5pMMngOYfEjvpi5%2BKDljyaB7jcgOuAmIhMaXSl2conCX4SR7FeQfIK7WHoLdY3Rjv46silptrgHCVZpmJFIev2SYBe7AlH9DMF8KqCUz33ItRZl770IAMIhqlznjj6ljYRLyUj7nqdnVwdBpnUazUiZewCZQdvKl2ohO%2BGdNqiMM0ifi7MXblX9Xynu6OAzjbBS1nHsFWBVk3kB1XMa%2FGJ3%2Ft7hS%2BY0pKpTsJhqxQzTzl8fFmg0hCE6upW0flz5R%2FvK%2BWKxNNCX%2F0nVUutYoBqY8DqNFg9WcE9u9cXC3%2BujyqeQyHY1nn%2FNd42TduFjP1WL5cMKL1KczQ%2Fw7JEqNGb5oCSPQNl8h2%2FRbCFWE36HXuIhMXLXGZ%2BZdXCeT4SuhwaZ7ouK39ie45fVkPB2DJ%2FoK7GqZo52ciscZzMUQsiHiyvgTXDjCu7aTQBjqkAVg%2Bb3XTOXCNmU1ZPhc%2Fe0GGa%2FhSw4aS6x%2F5o%2F%2ByE9ZuD7b99LnoqpmxnoAR3XiuZSaVWvjxPflvR9QgQgqON1Cjf6vmRLcRuMc5HuQf4h5Grd3rijO2b0mTC11RzJxshEGYPplBHhwtTt7mlI%2BDb0wKRzRSEco6L18OpqkXTYtmvpN9Kg9E32TPR%2FLY500JrsZOeFD8BhuEehOGr5ZZKO50oazJ&X-Amz-Signature=96c22eaf2ffdb00919f33cd7cf82e8b05ca8d05bf6a78d0946ba603d92b1608f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634XFZGKU%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIClAvm2%2Bm%2BPf8RAe2i7FL8E4m8eZ6MSFhHGx9555duIwAiEAm236fg1%2B%2BNsOgfmahrwm2NGr9mUrVytW1HjgL16LvawqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIg0t7LLBdm320%2BlxircA2xbXl%2FDWNp1en93m%2FRxHXnAB7%2BYU9DRoVSd%2BOUyMNBpOThoGjpGO1CN8voHdv8qLL6wT0bNiNkrnn8WSaexf%2FhXvB2cDfkyZqC5NR2iO78DioUYyPvKzNFOi16wB7hrs6cDaVV0A1NmHlWCv8Yv0Fh5mCTT3ZITCvDuTUFrm0CS44yRTSanmU0nlHhyLnabVZKydD2oFYt2F0rHCQXrAjcTQQ9n4gVytou4LYVWLNbvCEJy6tTtRvLcJJq3qdoNONWnsaL9geJdi0yCpgLFWCEONd7dB1cKbP8mf64O10ppTpxxTf8CYMMginSE75gStgUP1G6WtMsBtLK8EKz2SIdm9UuX90g116%2B9NSoVaSU2I2NHjkWXKHxKNMAzP6a%2BbfPqTaFrcAxAFK4EYBtK2F2bInicWTlm4yJPASgaVBPQkkzuZX4pRLMs6cbFQnr82xVtt8mW677x6f%2FgfFEFbWCwghRQeBu16X0Pn5zVYcnClA9adT7HYdESgFULK6xwVlLxk0ghlnSqvMDZFeF%2Fs72r3RhUMTqrwwpWxjgUFrXBPZNHj00n%2BZneqXMESNofhna09WvMmr9qMGv9wilV7XbUvrTVX2ghggGom8YIsVF2LId80USh%2FgiC5N6hMOqApdAGOqUBNGKMwy%2B8Ryh5xJsMjBYJdbOb0PM7gVqQnMFLQlVffcWYkI0LhdbIepeqHi4k0zwg98jxC0ZBu%2F%2BEvRUR3c38oUW%2F6c44SC5wJrQZCojKgzvRVBRiRRSaQDmfMRB8clYm%2Bjk%2Fujd%2BtLNcLw1vwPCOqsJb%2FWPvJRpmUkvCKdzakp9ZPQNIefT395Cq1eqLr%2Bygrz9wlb76rC5OkEEqb6p2RYW8n%2Fne&X-Amz-Signature=441471b9e98282a45961bd4e7d51d77515424613194d8db13d6c908245c1bed5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YJX7ZDNP%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH%2FCIA%2BYck4Dd72RRescQQlpuAd4KAtJ7IDbncBouq1aAiB1Mvgvtl9B0gWF9ZFEIMGFCEc%2FqBVA2ZJ8O2sUxLSBbiqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMnzAODep4xOH31VyrKtwDsiYRXSGZWZ1Nm%2BKslJmLFkj%2BzADsdEAX%2By88eTDsMtkzE17s0DAr2SVsvD1fqUD9dXhkJovCYfByW%2Foa1CQ8ZQXUDThkiyCtvS98opSys7SqMu52xmoNfDKGoQAqEs5BzHlBI5q3Fjsm4tnMdd2htUba%2FnzLxnGKfqBRDUUzP3JgMluSvOeLbYP5Wh1Q%2FFbBxf38MFs2bLWU9t4PMlKzcroRjujOk%2BloiJVGZq9cq8ZsZsx0L3sadZ4t0n3PG25R0OFqYTYoiS7TOdVxZTHkXztrQIFwxdKXTuc%2BSJg3T%2BZwbZXZ90w61fM3K0vbVkDeH7Wm2UNjVHd22Xk9vX4Pl0Hjtd1WHI8eEB9QQBM6JxR4fCNsUDAubns4%2FlsWGSuzwfhJOlDgMgZzqZysabioJ2BrvInpzxdmKWEK0OdGG20onMfa%2FTnztuJqTp8I2iHlFPIPz8LFZCoqsFcS8vrRF31bzYcv3lra9L%2BeAaQrsvT0S8HPe0orZ9ZPTpHcEzTBolP%2BOb0VYZsKt0iZ1GuJodlgH2Gf7jebvZjkL7PZCXBI8SFfhYYAknc6ZJRo6YOZdudBE8Z0bZx4YYpdAz8xbFoRDDEwhjOiatM%2Bs%2B2RAfeRI%2FeHxYo1gKGLr6gwiO2k0AY6pgGHC6ygC6C8aW%2B9LYGNzrIPOji8b7K10InzwgB4ta9bwcE1GLobT9P9P3jM7C4qwKYcAlIJnfk%2BhVuM66TvYaTGr%2BuP6rlpF5lcG5%2FIRCHg%2FZMdbyZRaj6OgpnikJ6R1u7r%2FOOdW97BNa%2F1rfRIszTS7YO9FYpup5%2FFheyyxxGN2tIWcj%2BrQmfSFIyU8u3kCx1kErWYMi7CMdNIRZPTQQWz5LhSa7ql&X-Amz-Signature=01b5735c7e10d34871a29958bbfa0ba9cac87446d0da12e228d35f40c4a48e79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662RCUVU3U%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDXbudEKWB52J2BLsJ8AzVZ8%2BIhYujJ%2FO0qetCP251MLQIgR22BnyOojapDjMBZ1oMllFqSCIZsDcrEYNHvuALm7eQqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHI0IkuaSvWBiQxh5SrcA8dRGJIUP1m5pIZRzv5AD55blNnGG40%2F7YTp5uOISoOYlT6EgX%2Fa74l%2B0P%2FabD3vrppfX2fFwBrYSPN6bskJ0k8wPoUe%2BOrQ45ZPC4Cjyx6yeOOW0iys2Bv5XeTrEEJIXmZHHzYeeq4N7VuJi%2Fr6Kz5%2FfKBRqj%2F2SIYWFGubiqW7hY2QdXU%2FMvTAa4Qu7l24hSYt9W3JPd%2BxpsjyYW7CenqPtbvLmK77qT%2BR15s0x5ef49tDPJ9Ntg%2FoCH4pA6jEmqe%2FsITUNfl5LKcNsCj%2F2xfmN%2B5V75Bd38XVZSHbcCmK59JiwdlX0lRYIDVVWARDNmRgDbmG0ST4l%2FXC6D8AezGjz8meYKoHt032YbqZbaY7yZc0ngLy4BOrocqJ8juPEEcNkR4ohpWS2CmnmXbxbA6jGMAMK9QNqb7dEHvEO6tFz2LZJhtTLc6Y%2FPZjXmz7okPVyhAeI%2F95LBbVLwLE%2BpoHQvLPVCiArGmvFQby4mNnNw5gwzonqg4n7D8zrSBFjfyVs1RaJsazuA%2Fn1M8%2BykPWwsuzEeYV7%2B1Yuau2JqE1biC59Sa35cC0qA5IglzTIQBqAnHtkJ5blQXspVhS1bludGqB49AWWgseszvuETjY18hAY1eyfX7mO91zMMXupNAGOqUBQLURHlnu2Oj2ap%2BpwIrXVmrl9EHD7cmDQEOhlIgaA6pXRPs7ku8Tn936aGbGmxZFL0cHLv0UiK4HuYDn1IXoFbeN%2BS59BpE8hDvy5umDYO9OC2wgAaxqkSgnYagzFihuFjirR%2BryEITdHiudkf2o1U%2BiHWCfYkPJ6FaXK%2FfuKjTr2mUMRZemMzoedGsBRCxTEo7GDQmdx4EqP9b6xHLXSvibDw%2B4&X-Amz-Signature=0d79a31eef853e0168c33a50acd8babd82db2aaf423d6c8845c77b206cf9df15&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XAOKCFVL%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFl7Kb1udtmBsX%2BTg9HCZ3BwobAwITd7YuNLRnDsoCsQAiA1PEY80bWctnfLRl0PUNEcWbuCJrwTJSKmU0TXbiIaJiqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMH%2BIftN%2BVyt%2FA5dyIKtwDx%2BasLiu62Y0%2FqBn8QiPanB87PcNVcUmtLobJZbcqeonVvixGJs6CzxMP45g0PsjTv6xHS6vqpivVb%2BXD5KcXWkDVON%2B52v0yRYL2DYXieccSbb%2B%2B0O99gq9LPfccU3kBYHsHk0rx4%2FHlJKfUvAh8FVQxVaPB7mZNp%2F%2BAvD%2F5hAVApsVAIepCXfiPzlAT0ey%2F1OMKX6vSeiznZgEdDc74i46Bo2r4WlWVzESETt0plB70au1HCXnmgS9k1W22qMje%2BEDVwV%2BXyeUdSEHmQP22ICUlGGmPH2QnHgY7QiP%2FfGeBLKEBVWhgnpSS4%2FkDLnyExTK9iEueH3WRKfwQmvJYY%2BFrBvk0HdJJxjq2LzgMEFKjHJS%2FoUdu%2B6aOYnmiLfem74eIh901CGXUd%2FqdOQljRudP8BaeB35vzfT32eb6XAER7AWSNBjmIjnB8zp8b7nGdOrLVFhqmeAMq6EhQrWqrHqFY3aykCv6lvWGVCFjsCpMYFJhM59pnH1StXazAXmlsSwYzPr0Pc0JvFnm%2B6H3SVwaXEXZMW7GiBAAVFjcsUQ0vc89hqEuECcXQ56%2B3Dtaz4KxF%2BfuFAKYaqCjqrPzZAcHkPOoh9EQbrnjZE%2BX%2BcHRQ%2FPfZD1OCzvDrWUw9e6k0AY6pgFdm%2BdYskejh4iEtdyXcOh8acFnBoyso%2Fasepz2QxjE1YaA%2BnuFtDOOpSsog4qtD7jJ37YpXjovFDAydEp%2FYlBGnGFzumPKxzX7QM9s8kZw606a7mZ6EwgDk%2B%2BxPjY1P8GEqB8K0r6wWX49Vzl0bw%2Blp4jtGpTA%2BM4HigUJouYMKCbUXB0edK1Sw70xr%2Bjwo%2Bodp9f9A2bHncgTK4URPfPCSgCCtPEc&X-Amz-Signature=fb62df38978b84bb0330043b3aba1f4e732cbaae7cc5e2129991345fc721de2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XAOKCFVL%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFl7Kb1udtmBsX%2BTg9HCZ3BwobAwITd7YuNLRnDsoCsQAiA1PEY80bWctnfLRl0PUNEcWbuCJrwTJSKmU0TXbiIaJiqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMH%2BIftN%2BVyt%2FA5dyIKtwDx%2BasLiu62Y0%2FqBn8QiPanB87PcNVcUmtLobJZbcqeonVvixGJs6CzxMP45g0PsjTv6xHS6vqpivVb%2BXD5KcXWkDVON%2B52v0yRYL2DYXieccSbb%2B%2B0O99gq9LPfccU3kBYHsHk0rx4%2FHlJKfUvAh8FVQxVaPB7mZNp%2F%2BAvD%2F5hAVApsVAIepCXfiPzlAT0ey%2F1OMKX6vSeiznZgEdDc74i46Bo2r4WlWVzESETt0plB70au1HCXnmgS9k1W22qMje%2BEDVwV%2BXyeUdSEHmQP22ICUlGGmPH2QnHgY7QiP%2FfGeBLKEBVWhgnpSS4%2FkDLnyExTK9iEueH3WRKfwQmvJYY%2BFrBvk0HdJJxjq2LzgMEFKjHJS%2FoUdu%2B6aOYnmiLfem74eIh901CGXUd%2FqdOQljRudP8BaeB35vzfT32eb6XAER7AWSNBjmIjnB8zp8b7nGdOrLVFhqmeAMq6EhQrWqrHqFY3aykCv6lvWGVCFjsCpMYFJhM59pnH1StXazAXmlsSwYzPr0Pc0JvFnm%2B6H3SVwaXEXZMW7GiBAAVFjcsUQ0vc89hqEuECcXQ56%2B3Dtaz4KxF%2BfuFAKYaqCjqrPzZAcHkPOoh9EQbrnjZE%2BX%2BcHRQ%2FPfZD1OCzvDrWUw9e6k0AY6pgFdm%2BdYskejh4iEtdyXcOh8acFnBoyso%2Fasepz2QxjE1YaA%2BnuFtDOOpSsog4qtD7jJ37YpXjovFDAydEp%2FYlBGnGFzumPKxzX7QM9s8kZw606a7mZ6EwgDk%2B%2BxPjY1P8GEqB8K0r6wWX49Vzl0bw%2Blp4jtGpTA%2BM4HigUJouYMKCbUXB0edK1Sw70xr%2Bjwo%2Bodp9f9A2bHncgTK4URPfPCSgCCtPEc&X-Amz-Signature=fa113f895b8877dc18a4945c98aa71c5008aec583e1a581e37045f6adb37492f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
