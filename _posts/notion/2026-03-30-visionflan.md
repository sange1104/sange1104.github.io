---
title: "Vision-Flan: Scaling Human-Labeled Tasks in Visual Instruction Tuning"
date: 2026-03-30
categories: [paper-review]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OJJ4UUS%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFdpJ67ZNm781st3ljDNvye76pz07vXEfHvUalKtL0knAiBFWJgauVXv1q8%2Bzh0skvNuaSnM69fBIxMX9kgts8N7Syr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMeTWvW5fb%2FRxYUBG5KtwDoGp38iSsAAyo3i1HxrCckG6S0PSvGs4NWMwZ44t7RdmHoJs6vLZqdZn9M9%2BrfY2rTdjSLw1VuAtGXiV1oGZcAFakWMnvwNJ1wTSfurjrqyI1uNUKY%2FDEx209U7z6HET%2BGTFQFKx1SeOX9gXUttfQhZEC%2Fu2LmCvzj4o%2F%2B%2F%2F8sV%2BTXjzRWGqZ9De8xCaFacsxajjv%2FoBAnLPulKHfEABM1G4oOF4TdUhy0X9aM7MW0iRlNFoQ4GraAjOKuuqO1wzsqxEbcWANjypH1EhGvOnhC3hfbN%2BC9jp1IRiDy3j8ZE6DO1pvbbBsPdZsev%2FGIHvTxWZNEQFwTYifXCRxFmJHv4nSQdhCNlrPiKz2oLn51luEe%2FM3MVfAP4%2FSR4RPNrkAh0qEGqWybSgiLiGb3di3ZdeyD7OfJBHwwsFrREQXwg%2BeewEJoAu4patTZHXaWEUrM9u46V5zd1zG5XK9uTTYB9Xee2FhYOeOvNhr%2Fve7MqBHxSdbtWFBELAHWnupzIAb%2Fopo1%2Fk4GQ9acRK4oAGeJgcMVxw1qKyWmBL1lSGHzjAZGHL35l9lX3g7cAVeRYXH63tZQMLhvb%2FsRItgRKCWzrC5qrRwIbA64Vhifi0MD7dFYHcvWuBXZuOE6lsw0rC3zgY6pgHdU%2BjvauRV0U0LLhN%2F9NeRAo%2Farg6qCmqr9HXrGvYwHcpOX45e%2FY0LIaEnaoLNBuWdeI06l1S5VmSKsR9eIyZLlr6wl9hdhQaR%2FzEBLLT%2FJVI8C0%2BkTYmCbiGf%2BzRXfI4yijdCt477M2haLaajt6TL9cDXktliPjoTsnKZjz%2FhF4s%2FOsojVc9s7U5U2cIYhIb%2BPWgmsnxTTffGnEJBms5WZan3afrd&X-Amz-Signature=75a361c614e5a5d03bbe5a3f940b7e8c0167a5fb64de9500b353dc01e8fdaa13&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMR2LP3N%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDBTTzC8e8ckt5GiYIrzYrGorhl7HVjvuDfLgtvgdeWLgIgXRzcRE%2BvQLu2aSwPFoNw8p8MT0w2JO3GUhJa0k9NlqYq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDKZQzKtIdqYjKUrS9ircA4UNPW4ZQGybc%2BOQO8by76A%2B91hN9N5qs85xkHkuhgiPzDrLUdJdOFGrekGP%2B1Orc3NsB4hEw3aP7F6UaBceqLkFdMOEsZdBv04%2F4RiyuacVCREawr%2BoQfAK3qeC78Ii02t2FLjNBinDSMZhzzQZLS2ToeGsHqPp%2Fh%2BaSzjf1YtWXcg0m9bICzL1CJDC3ZqkLrg%2BbnFv4lSLJPBKiB75X4bg4RH3DflpteNJ9I5rCAl2%2FY1dx6%2FGVGR2wKSTMC9K3YbeYpTelfW8Uu9nkO9d7OqwOzPBom1CcLiog3rYqOoUfSU2CscNrnZWEuHL0W010aP1OutVpkk4pMU2HoHwkKF6xsS2TgZqaIC7sq6a4caZcieGEK59Z25SDTU50ppBu%2FPNTYyGt5%2FHdB%2F%2FolOD7zfAtsjs1OVT6UtDsmrqyzJhApS9Kip4y7ZzmzGHxaDb1LPKd8rebHPQthPEcTlEyO8nrAeA8lb%2FjaCx1KacUl4VzY2853pBlmEidMO5riH5XwfPJi2DotmEQhewe97My98O5bp16oR0H0WvXZTrwQWoLinixXps1FozUPXkCSWAjyZd1ghs5V7wU70VKZLLnM6MqVM%2FX2504zGuctLxF%2BtHyTlCXDiHk77pYwL4MKSvt84GOqUBYRl7ZoV4%2FcQoGomzr06Tk%2B%2FLGrQxShOmiX0meLUP6t%2FMT6d3dMMiDWPMqpUaCpM9Nu5Xl%2BUkomEKxgkNpCOwZNqQnN0M0%2Bgyizd3n0tt%2BiFq8QxRq%2FwMRyFgn3XHj3wSRD8lt7qpvsuowD4OH87Qftt10OB%2BJ5w0P2C1vBOk3D4Ph7eadze%2FZA3mJ5fps%2F61w5%2BnLe9PdXHr0lBVGlyWRMb0x0EM&X-Amz-Signature=bf3d45fc441d114bfd4d79d2e826e24b1e083cd91be680f2b05513e16df338ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QYDEXJSD%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCANg27EG%2F1dbuj5sQizLTNmQR68ZH4qN7V0LiA5iL%2FsgIgZxgc561irz%2B1fowNaiZyAdn7mFxoCT%2FF%2Frvz%2BuLmzX4q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDLkqLpGpiCBRQ7i7lyrcA0f8taadCP77lWgsoSclVf3j9QTBLxZljLhw2VIdJNOjkzpBmwYiUh%2FzMl2lZrALdUSGKREixY11Kd9IMFnnskdLf%2BylUkiD0HGYJDAKCcB0Uae5Z8BgfxE5Oymk2QYR2eKjeKq8pdakI2NUrkbFn9TMoNlgtfzZEjXP3QxHAWfTcX%2FXkYcKlwiu2yiWgVsWzCSwToesqidMdbM5HYN5wBgl3CYRccy4DpbELeV%2FrAMlGQGf6%2BNPoq63JMDiGBqsBFWfX4yvyrBJcRsYAdjJna2Q%2F%2FV3%2B9aEsEuf%2BO%2B%2FCVCrasKVcf4nEOsgZ1UI7PGCOeOBENeWD4MgoAQlC0bycPYJL91e9exw2ZZ9zlE4o8Wf9KNs1JGpxdyX4u39aFYu0zl683WiwtHHrJ%2Fkw4ONIHoe%2BH45CmitFqDRatcx3PuEgVgwTJRzoWJpNkS5YTzcKY34gVrTz05s96JXVPlf%2FAQ02ayjx6DsLblCMwIIGcLbmCzav%2BB9mGd5QSy7sAWrf7sMfF29FEfodoC6kzsTVcGbhMPuchHmLef4GsEUAlLF7qNeNtnD4uY7B%2FeVGe0R7Fc%2B0cWjtYZDc3h0krWlu6AA7xXrGeOs7ti4z9IiPrg3So7AfPm%2Betyy%2BZBXMK6vt84GOqUBeu%2BJOEZuVxXt5skiPNqj1vaGn48iYJoiG%2BEYF2jHiS3RFWA3%2FF%2BQXT0%2BVSflbjk9uswOik0DrXFng0FTkDWc7lewtHB%2FQ6INa%2FjJrd9GvDmKTd4Yg02Bb2xpDPDZDmE8W619XqTEEaAIIcIu8C92A%2F%2FqpRy3u%2BWQIWkXRrZGYAT9WtlM6JUjdWeYb%2Bb8k2suyK4n8AqNRm3xTNus97lHG%2F5eyHMm&X-Amz-Signature=af0e97a191c472437358d0c64e656e7e478b2f6125d52328b73fa5e56668522e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XDVX5UB6%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGD4TCUpXezAQrxZRlH0suFInltmwBEluGLrztxAzD2hAiBlD5pDA3mwaLCWhKyfpyCRvJhrSYAGPFtL5n3qPkPxGir%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMIvBuHWR2Y1Dvo6S6KtwDSKVjpguk0WaKLRKMMc1rCA4RDEu%2FE0mwDtJsCjqoQwAQD6u8zZWriXIDYzyqAJdN18RNBMfVwgJuuMn7cf8PfzRXcWbMLg6PKTzdnH3pDVv36y1KQ24U83n3Ydw%2B%2Boe7hXGFC%2FDrWDqoaz02Wdi35sSYUVRjJb78V2o80llrL8LhftP%2BKCSnJTDNQX%2B7tXeoFuUiRQPI%2BQdv4OB4rT8Rug1g8DmBRXkuDMJ4JmFbMEexvVyU2dE5BKW3Q0ElRDmjH2Ztw8VzOft4odetcWrPsJj%2BZJGcTiARei8tPGZesHQ7Mk9zinmPABf5%2BYqWjV7gE0ZSCLx2iRwgEv01Uyg4WYCSKIGnZeRrh3uqCvtazXXFI0iLEVrf7ebfQ6%2Bk%2BSTZwpVZNpAVjszkfKr69a9c9dG8Cea3NdiVBvEdYRHNJRcpB2s2XLdSKUngGWxeY4SQMJwLClIz8d0y%2F5trHznE2sFo0jMibGBWPyvEdESWCyynn6XMBrp%2FSoBO8wtWTtV1FwSdbQriLb96FjEf%2FsU9LUxtL2aYtqcY77VCSFEGzJW%2BJGACI0oScO71zjqKPDAwSTmp%2BO3eB2bpyV6EsClGZJjZue%2BbjWGok5s0mRsxD95WwXHwP58z06%2BStQkwlq63zgY6pgHhS8828bhaR%2B11Stf9D2SOoMsxqWn%2BnRh7HjUfQPiAxXboZ20zqVKbWi%2FXlsOt60EtsUaHEMQ97EAwoQYCntm8s%2BB7eAl10MmN%2BGWo4hCaEvlJWISo0tAK3ZvoxkSwJUoujOQWns1Fjnntoe0dFPVXXLflThP3eyZ6jnprIuikEViZZYgb0tCXWAdOv7UJmmgsR2jwXg%2FCnmXDVso3feHcqFSVBo48&X-Amz-Signature=634d1e50cf2fe79d14d089aad20d1a4a85905f33f79c8b591174806c54adf8bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RV7ZQNWZ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCpTT9sZDFmsFRjIQsYCBvminj1CA7Lu%2BeV3XRDWardGwIgYzvjRoQBD6N5DrpBgPfyStRglh7NFjRzT1nXSR14HrIq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDDbB%2FY9D0jQG3SEUiSrcA%2F1nf9P7bvk8dEw8VjfpTKvjqv3lYzsJyIVVwNebnbbmAPy7Z%2Bo4BulHvsIm7ez81eOMznWeupU%2FIuhXTjbTy%2F2RFFatclowR2L3%2Ff%2FdJS1wME8f3zS4X39ajN3w99%2FSXSmORsjq1VpzTNsOIychTSGjAPKlBBUUO3iIYB9OOX0OJpC8toDxGah2s64EWbCmlKflWJWixITJNvbXcJrFrFCkWD4JHMTVXQG0oOnAzUvrba5xG15Z%2FM05vRALDOSGphKoRhtxVO5wboFWuUeuNgJQwRi0BJVJFMVUy5fHtVjSCDVFp29b1HxwPhpB8yNNM36LruP%2BvFt2UUoAJ3HhjDAhDQwfWn6u7WHVek6nE2SdDlPRanO77EubxFvzpAf3hyTkPsmkl2chvW80e38%2FvlsLG04QwJyIcQPseiVc7zhb7bgqT8cXY4%2BhhwZ6VFCcueypCTdXokV%2BwRnWj179yB36DLkahr0Kx0guE2A%2FfBkC%2FgQr%2BRE63aZwJ3XCWsrCDX2sryksCtzedchI9neyVQthYs2hZRA7MJQB7sI%2BL79KLxfMHTMv1EDqdnKgcRf3iDRFEVm66VTG9OzlDkaO9PdeKW8%2BlJ4uXLQisgZJydbNspHEb8oGVyJFUjR1MMCvt84GOqUBVoAzBTwo0oYuiMkwqKSS5xkdT5AxgadxfF06ZdslGnYpSFGnwd18O6mOrgfbwSKGBAm8Xk%2Bg3%2BjpxJ3t%2F%2BX2tzMyOYTm2hRW0hHijH6ybjg6LF0juH%2B3O8XNovgl2Ii7%2FzdYfLUSbsOKaDkUAG7JEFEV00F0U54ueXGqe1%2Fg180kB023Yqrglh1TWqZpcdFgNmoAxCw1Gy74b57vPQ8zC5FUch1E&X-Amz-Signature=1b0fafa4a9a47ffbfda04986b9671f58058818db4543d9e2c35a427adbf02a22&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMBWX7UL%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICfk4jcnGbpXkGkwULKM940NwR8WCm86npHBJwJ%2BzBVYAiEAi4IOrHgW60rO6XtvWc662SCSz5zn4nMCdpA7De%2BnrYIq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDBNRC3tuJsFaVOSskyrcAwinUF8iqPsxUsgiajhYgu2byMe6hiitvZnt83Lch0QTBSszR%2BT9rGzFV2hdRyoYtPDqwP6SsVbk2Yk278dbCSBkRawVlCxLc34tHeKNzZSyKnQGdZ%2FMg3e9Sl3tDquzlb5UpNUmAos0M4VpO%2FfDPIa9IAmluKoOZJbJLybrTI82o05l0W8fi%2BhTfhVtieCET3g830PMmnMyc0E2ze0MqmWzfBnsJ%2BNcPtJ8fZnJGhfs9oArKpKLslGBzCyri3cNoS9ILE96NhqKO3wXVnGgAhvrynLfrOmh9F75L0vZdSBDOM5Wh%2FGwTd88AYD2WosOfJa%2BKObaGrjFMAxewvAbN5sjUu3%2FNbE1ndSfTSuWNypVuzF3cbOpWUkWRLxBNZhoYZIfvJWhHLnvZ2iQDKSghH6ayVS0VpibptFATO8xSXD%2Bad%2BSYl3AsZNGqerMx%2BOL%2F1oY0bfyT2j8FRnsE8mq60LF1qTxJKkMMIIfyoG%2BklQPF8ZGQjGRFvzBohNXPUXtI2GwGtl1fhlGS5IIucTjx%2B%2BxTM4MkTlM3%2FQsO%2F%2FfQpsP%2FjSNdVMP6fqLfFsj6LJiZyzPHRBVFUxpe5h9oQLveFtmdLaNUwBeg0geRu%2BLNkfn9wNaY2bU36wt7FzfMJ2vt84GOqUBsFzkdqWpCRyhounqZ7uGQOtB1Sz1aW%2FgpmAdei3FuS8w9GoV5GekNT9IKJSvNr%2BN0c5i329SqB1QPl4WrcK%2FoCLE7unHddD5%2FZ2WVc2ZoBhLnf904S176WL0%2BWysPgCFt7LuzmMTBFlhE8HeA1WxpVnLT1KQp68CPoe4NeG9CfR%2BdTUIQGjT9aldwDy%2FebicbwMo1iChx45FI7%2Bi8E2i5FMmH8H%2B&X-Amz-Signature=91a687b269e3930b9e02b43d2ec3fc0472bed81689654d360ea316f8493764da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WL55SQHV%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032503Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC%2FPH5ocdWbqDcFjNMJMo69ANB74zC5GeqwHnNX%2FTs%2BQQIgKNsALjMafAZ5Ihwo71ZAkL7DMbNVUhKHtCu7we98Vawq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDNr%2FnImeCvdEX9kAeCrcA%2B%2FvvXlei2nPwuOFIrDMVQKTPoK1tOzgz4L4X7r1jRKvZeDsn5g%2BzP%2Fzev9GfazLSocgWStB0q1lQAFlc%2BgdAwUEDDqNpTnDQYgkqpjeyBwsIz0INCPVFdeEYPysZ8nDGvGJpM1qex2xcKNUuqZsJdkbcDgs25ELuEzSU%2FXuJBJ7OsZA8NR4g%2FVgf24reXDK25rPac1LTRMr6nc%2FaZYtD9iw60PmD7swmBRBfuXXzTzqDaGFHMysR6vYXax1xaAK7bQ%2BsG%2FaeG%2B7f2011KwsdcinruyBw2me7Pz6UVxbWdqv2e0UnwrFQLCSZjh5%2B07ImzkWsoXhbVWpLbU42xGdUS6TZd2n9FvLqKVLHq4aHE%2Ff45WgpW4Hcj%2FFiG1ua3dILODj8N9Iuf0v1nKXZUhYCPGAn5hH7Rdy5JsUm3vjzAS6AJBhu5HxVPV76kbKDZlwcOYpgEy2UWpI%2Bv7B3%2B2FabxMXFpYzgouZRDHa7cao4dirTSkl2R27j4m8IXvw%2BQA9o5WsoX9JrzRnkxiA6tWi5IsP48xuY%2B4m38%2BKLNJK%2FRT2a%2BAuTGJ5kpCklzMzoV9YQ3CTVv6bI0iEelsJdfkKzpX6KLr90HH%2Bcj4wjF9PUr3RbPaTznq2xTZhxs%2BMJ2vt84GOqUB9kk8VPwEyIlVEvSL8FXoGRGDWVQuyXybIj8hOJg9r%2B8UNY08v48UJVNljlI6ZwgJu7zlOEEndWuzA%2FmPFwB7AjVLa9wa0NtoyyCCp5dMAWrrI2INKlN5MB0e9wvTMmWs3R8TuGBScwzPm9RZ6HQJVGaKSksiytqUqjdilicu1T8DyJwRdxnWLLXeSxMg5GPtoEurAS1oIN1br%2Blib9PUFij11oHF&X-Amz-Signature=00f0dcbd5604f4552c87829a2bbbc97d5440d0e29718f9dff8715f455fe4cb76&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RNJARMK3%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGwJol6J1gE1uplL9AXswKyHnJl1nJiGIZpsmqKrkwkJAiEAw%2FpPZ4XRM1762nbP0yt1nn5cJhVteU9Ox9a2XcWMd9Iq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDBujF4iMEIBI%2BU4%2BgCrcA5DEX9RjOS8QrLQLDk4ARoRnTN2NHua%2B98dDe2rV8c4Xo71JSCi%2BICMamBHjjnB5%2FNQKJ6QotUogLIFhe0LcUMDjMJ9peePgU%2BxVE1Z7uQmQlxl27i0GzwU1nUataOOOMf8FsEsm%2FD3ynHDIOqCkjDtfPh3hr91XjS8QAj63WlN5hSr59W8DTk%2B4qx%2BzFyLVLzGnyaFxLdbv%2F8JWFrAa6XTuYPHKiPeiVKuJ%2BFMk5%2B0lwRwMDwDS%2FsXUnxVSDnvLsDBCXewM1VXbFu3l%2BNzWaGz0dmvyJppg5bjrXI5TGuBrnrMfos%2FuwKSgFsWl3VFjPk%2FtLLpQTp3QSr6Dr2D4BOKXMI%2FkS%2FdTRBogXFhobMitXJazupxsa9yT83UcIaw%2B8ZGvP%2F%2BbU1UoiGbuuikyIKBydDIEIuUsc0YQ4sq5kc6E%2FEqHe35jXRjj%2BY8ibOre%2BG3l0pWum5edW2ErrhT%2Fn3eHgaSG96NpCZ5%2BOITn0YMVAOZFdYiwMW6RMKmZWUK%2ByRUbtFj119I5n%2B4U7eenM02Onia%2FBQrzpo2tf%2BdXkKJZOSml7QEDFWFLf5vYjfe768UmSRACkeAEHd%2FjwBBSZAHOiUc7DrWc%2BlO6QiNhqwqee%2FzxxjtlRbS2LX5iML%2Bvt84GOqUBlGNx49kQu4mlcFCTvOFHlIovCG1raK4WiNu6vryU3wcg51%2B2O49sqMpFAYHdS3kaVPOpy1yFiCmCU7xYEAywMERyoP6SCrHyIKOjl%2FWDijfPcCLa%2BiVqmaJrZok7DI61fkGox%2F5JOiMkXTRsVDOjqnXWKBOEEaNzDOQIwsILGMzqe5Nb3a0wy8psNEmllQvjhOYFNQ6%2B%2BGuT3EI%2Fj36ohVGRHlsm&X-Amz-Signature=bb650dbf0aa0ec7f617ad19357e671521034c1962e8cc3c6e2a0189ddabbc4ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWB45I4B%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGdMpcpAqV0WFd3%2FWLwgS4becKULSBdVMgoQPC4USxx0AiBP5ORZLg28FT%2F5f%2FS0CiQD3U58z7usfY%2FlZ2AyVzUG3Sr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMRDoXBwxTLVqcUVwvKtwDdfuft7YNAdj25mYwa8C0gHm4AWpFVKDnguCoOULCarZRFrUgoc6TATFz25VBsrun%2BZhu0oCruXhUjHB%2FytxUcIo7ENQGLka%2BhvifZ6%2B1QgQ1ajeip9ewN5fYpn%2FryhsBVGcvQ7BFz62Kdt3r7fn24iIaOZU7etw4VBGTFgZazX%2BHkTzOac6vefXbQhhf8pZBnl4WuPLhxJ1RBeSj8LY5QjAzBDgMcPFJdyT8Vm553O2IVc3IgjjEVxq3mbEVqGlznQWI455jeLlT5r0wPJQMU21J2kPvzo2%2F5nXaGyAYzQrsFKBTd3pJTyJdd92BU39STGdsy4JqEFGd895N8SyiqmBLeWz%2BzWuSAQebj7EgEg2ZunVIjMgBJZ0ZwjDjxX3XeUvUgQP5z78Q1M1OLk74NABtVvaYFi8eDDQU19BvJmSUX%2FGWkn%2Bj9rUQBQP0e2lqhw4vqhvMaAmtevUEQMmYkOBM4rRf14DbOcMH2IUAFVWn98OQKABfDaChaVz0Yc3SuYHCj8c1BJhHIhtAYI5xrx9Nd82pENvO%2BF4pwROqa72bows1R5yLwJaZFGSEEp5XXXwey7Bcpt%2FERwCzfqXYQyCGszwufGbSr9L4aHah3B2VjddgRyfLY2D80CQwtK63zgY6pgGwkoQYIGYyXUaw32vy7RW%2F5xKLgUAQIKZ58oVsWqBSLwHcz2%2BKxgX0nCHIegokMEV8PVwRTaDa9Ge%2Bj7YItIuOQcCGWIyMTMboAm44r%2Fe4nN77jex9Kqg8aKuL3GRvy8PCJhEA%2F8civu8zeYWE8OEUYQ%2FFxDlCRRJB6%2Fo6Gy5DWWJ6c2an2QYz1Ca%2FO7NDSuNnwgmXwPa79tPAfxD4NTlS9fODsCuj&X-Amz-Signature=1940aeb9b21567dfda9283800344b5cd29d8b1e5212c0ee314e84710faed910c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666IJVQUCY%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA03ofN6LarU60uos55KrKzslxWQvoNcO%2BE6UYvoYyNeAiEA1As6i%2FINIvQKnJrqFNUQtQM%2BFc0Q%2FU6MoA1Y3fYGB0Eq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDNlctBZ61jaW9LT3gCrcA%2FFZgeOliCjzG%2FLL%2BFCx86ZPRHg2IJJckrembNDn77mmwfzCEeFNESfPmQNgCiwcAJL%2B3ksD8%2FCF3TT4xH2BNNGTsojWBwaog6F2KkIsmrJB8iTc8B3jYyfTpL8IbpKvSBgl5HkTSFt3ggjDfWGIKReLodBgWfZ9Mql%2BhTIvELOwolIYqVt%2BqwiO8OjQ557GfEzExjf5GYJpsFJsQg1cY626K3Fv6izYtL2zLl3EuygvqZNEy5OvplKqzpmj1yYYaJ6J7xZ7BeqUGjI7oBOn379tmSYrRUrDG2zxNO3CJoq7jK4ycZ7zRTthRPGhSWfAPPMUwR7IZQp%2BNmHdUWs4i92XaGSGTXl8UeQyJVYzx0wAJumidpTgufcISslaGwtG%2Br8OauAeoNwBFE7Qd%2FBALCn5m8WKG8%2Fd6CPzMIEZ378Aj4irKBd2j3fpQgyW6kaS%2BI09M7ulqlB5sUSQ1w7%2FbI8IDQ%2FL1QHTV34Jgj6U1bjHoCKOE1j7aVCLAJKsKzmFc0sX50S2WBmHsqS78Q%2BjWDWo0FQLxGCN6Wepn3XBV9NtOKRMMqwW6Cz5%2BZgo%2BS1GLJAuKnYDYu%2BstRvrKkDwa8JP4%2FHnfHJS51G%2FW8nO6xgBAdjK4I2I2B0FYCgnMP2ut84GOqUBB63Fr0B0go0PUMlPalePIVAn1DpuxX3MPx4Czhqhy0vyVGKwTuFQjDJc20OCCyuEDauXr67inJ7kHjWa8jmJ7YGyniQQi4wnqYuQhKpASHml1tclrSmWUbC1wp3qePE9YKFAOvcj2lpdER065BhCtddE%2BofjNDB2hLIpkruC0efvcWljGJMQ%2F0D5JW%2BDOUQRL08w3AWwLI4bHvVOxZl1jgbstQWc&X-Amz-Signature=52b1c888aefcab056e15442dd62664aaf44c249d6b19b50edc0fa52533cd9715&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXKLXQV2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032512Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC8wjRmGp7w9v1Rs0nHVVP4V102jp9ln5mCtmuGqMmg%2FgIhAO1SH5qNHVPmGPBWVTubb54nZVmFeXvB3LsihwZOzCcxKv8DCGQQABoMNjM3NDIzMTgzODA1IgwVDUlvPnQUKoqm2nsq3ANMI2AzF688eheFNmeq91apMBQx5IvBuO8Ymfn7Vwj2Od8UGifMjMn81HIQH21S1%2F0D6L91Y3iE5TmxbeYa%2BmYJ8IiKAMo8njM%2BU%2BearLJwCCRrDd31zy3X3ayHVM1tBmUjCB1qCjACL7EeIWswciA%2FyXSf3QilLBIFftTOXrl6GLuF3mCe%2FvGmVirg%2BOF%2FJ5PaqZxJb4ftkPZjNs8YFPwy2Lnvwy8fVc8V%2Bt2v%2F5w23eSyFRsRNJ6xImk%2BPOIDy7e%2F4q310bWnPqBwXaI5XstbbjCbpNBLOuo2DeDzBJ2FjLb9XX7ObJpvi8DaWN%2B4%2FtsP24YRv3J1QEVdlFigsUpcCf5sPUjB78qHMQ3p0XBuQioiq%2FZKfxcncJktUNfPleHqFEGJP9%2FINNxqrpHJXTMWDt43xMwx8ZT%2F0doViUma4%2FrQfdGPP%2B8ujLwofBLVcjX8z1oRGw%2FimV5UuVFvj3drHsGnlcLaHbt3TfKG%2BL9XT%2F0DPqkccYhNwgRqaid6X9clv%2BVt88YZrapjaLLRDY7VXVxKsDW71Xh0eLACrOlV5Itwb%2FtFTvlpWDSnZX35pFr0E%2FElprc1T7SssLyGljwhn4m52Utjcajg6eIHHwuqhOBi1HFoNhui3EkdMjDqrrfOBjqkATkB3QO5gPmJo5MI2DLcqL4%2FZDAXBWEtijl1wNoBy5IFr6OmGE4A5%2FQjBr4tHeZp%2FvEXGOhfEKeoJOAvw4C5hAOAyKZy%2Faf14TPwLYHVYxfJrgAiegndPZ6x57MnJHP%2Bw6xvLk3agpE0%2FvYPjpSsWRn8Z9knoYjuaCHxm9EefDntNfpTif1n68C7fQ1IC%2BuPcJaCGEhwDeG4ptChIewGqjsd9yfW&X-Amz-Signature=6f1e5b941cd9bcc903b575746f22a5e8366d01485ba2181eee70bc8da28c9ca2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YT3LEEVJ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032513Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDoCwqkq4sIgiixWbQBKnF3WhSrfsLMO1wD5OLULLGrrAIgJDJntcFjGAC%2BigD6rSWhH3MUf1CUU4H1wqU7aO8QBX8q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDN5xqf6XKRIID9%2FrDCrcA4fwsBP1ZlTODFFIsJHwW%2F%2F1GjTgcrInztpng1IZtgXfPIzklD%2BTonXfSkrh3GeECSHLbZh9aH15NUMCkQGJUJzKdtnkUdbGPfRbDuVcyeCncvxfu72xoFJvf2NKMWuDOopYHauM8GSBiwh0BSOjjZm9FaDSBhbmjqwuzNSwpGAoiev3nBKFphMy1Um0ytV1jk0VQpc5UflTHUt1taXkRQtU7PrDqXjS0zZnJ7mfaJC7ze9N6Uda%2BbHsT1%2BS6W3t1InQRsn3tXSvQP6y6fGFpZlhUG%2FR5WIX6pp4Rwviwf%2BdjADLGPbymXCQS%2BbQBBoIr49CjalRet18%2FcN1JY07Y3L%2BRUbXdUw1PMIetsw8vSDzsResAC1k8pqC8h0B48FMhd8GX0nWs0Pg%2BAmABK%2BS%2BSiZpYZ5vgywc5%2BrmqXWFbSFT9HXxTYTS%2F47GrfSayM510qiU6g8KVj1eXvRfzwTqVF5A%2B%2BYUd5zl7%2FLovDycqTVB14C9TeKkFjvLWAr6lJOlX4j5D0A9l8pmYHPPsBVEOTPUDpQzkMppTkXMvcuR88d79q4eln0FWzdE9LbY%2BtAzxeXTjgw%2BHAeyOwdnhUS3oron45cbec0gfthrZUowNssgM%2BWZfsCqm2aBKrJMOWvt84GOqUBhTQXCs6nSo6F7JQJXAXrBuh36or9H7NgZB78rakA1Zbk3hdmg5LAsTTIWlywzy9e8arJCWbyeFj3S2%2BeCbelYFAs74lZ8ccCG0YlylreidkNKo4ReQPyHifYrI%2Fv%2BPzgsTpW71KUrSHR5ghCDdyvbHdBKWSYUJ%2BDAD6xQTf16PMh1STipdz2Es0mXLmgtiowQYhhdKLf3MWcPGFWkmEVo6Er%2BoMm&X-Amz-Signature=489a9cdf5a273d27c9c160452636c88149a278ac2055a8c5a1fd0fd9864dd467&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QUE2DZL%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHgfW%2BgIcmtQgeQ1Q2cG8kxwaLoaiuJYE08QCiVg3DlPAiBOdZ2FxIcH235VSUSGmSd0iIHNLh%2BJBwrmi0klgr4uNCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMSOVAWXnAHnT6KvFOKtwDHjhtAJiZPGWFF9RUTsIp67Y9Z2JJB%2BfTEau%2B7r6yZMsYW3S0L4Fxyyo3SjmOySt3rPj8YC7Tn%2Fro7L8LIEZoi4xYUG8R%2BgKDN6T6PMcLe4Dqmzw0%2BvqhoTQCYHsOcjv88ZR%2FeF%2Fue%2F%2FHwNnrm%2FVPph%2F0iNSQmCHOIkb2PQBRyVPvLsI3BhRo5LE9uRl5eXGlOp2XNIIu5yLWmK9K9jWtiPqwNKW%2FznZWUSa38dYxlumbdigKF5uzdxL15qdAehbQ6ccmoNcqSC2ChrlZUhlq7HiUSX6vRlNKgd3eiPqBVwwfNMY2IEH2M5yUeAB7iusOxfjYS78A4oPxw2AEbKiQHmJfQNRvhmxC1UkSFRxSxPXzkzHc4tK4npqdBSu6HSfKn4hpXt0ltmIHpgkPK3e6AnxOCMbyL%2BKUCkeimOrnwsUltCuuE532A0vJ3185jQ1CN7wEYx5bAD%2F1CbdPouAaaqx2dU6K2qbyUCtXBcEmUuFoZS9tI2mPO0SyzNOL1o2%2B9o8QIdcLb9Ipkpc5%2BfXIa3y59vUh2MqWdPsMBb8klxOjVlfVK%2BCtWwsIg8lsqqgfToApkc6zyjiflF3pjFokRW5r4u%2BYifneu9tfIsl5GBcpkeZiFh%2B7JqLmLw4w6623zgY6pgGBxxqC1A7Glkj871f9RxSLNU9dJfw1e%2FUPRmPnAIcfqpu%2FDT2kl98jHdtVfrud8ug699h3n4%2BLdJZ3DIY9kz8Jbq6O7hx%2BDyaheTym1n%2B8Cdre18VrUG%2FcHoiQJX49btiBCp9jb7nfNa8sx8ecX9PkMOWdHi4QecU0dBPAfo8l9IYmp8UAiDspb2zZA1no5gfV5AGLqrkdWDdSePMncppF0itHONGC&X-Amz-Signature=56719d79c4c094b0a088fdbe05e31320f6f3aeadf02c27a65ecc241cab949085&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QUE2DZL%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHgfW%2BgIcmtQgeQ1Q2cG8kxwaLoaiuJYE08QCiVg3DlPAiBOdZ2FxIcH235VSUSGmSd0iIHNLh%2BJBwrmi0klgr4uNCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMSOVAWXnAHnT6KvFOKtwDHjhtAJiZPGWFF9RUTsIp67Y9Z2JJB%2BfTEau%2B7r6yZMsYW3S0L4Fxyyo3SjmOySt3rPj8YC7Tn%2Fro7L8LIEZoi4xYUG8R%2BgKDN6T6PMcLe4Dqmzw0%2BvqhoTQCYHsOcjv88ZR%2FeF%2Fue%2F%2FHwNnrm%2FVPph%2F0iNSQmCHOIkb2PQBRyVPvLsI3BhRo5LE9uRl5eXGlOp2XNIIu5yLWmK9K9jWtiPqwNKW%2FznZWUSa38dYxlumbdigKF5uzdxL15qdAehbQ6ccmoNcqSC2ChrlZUhlq7HiUSX6vRlNKgd3eiPqBVwwfNMY2IEH2M5yUeAB7iusOxfjYS78A4oPxw2AEbKiQHmJfQNRvhmxC1UkSFRxSxPXzkzHc4tK4npqdBSu6HSfKn4hpXt0ltmIHpgkPK3e6AnxOCMbyL%2BKUCkeimOrnwsUltCuuE532A0vJ3185jQ1CN7wEYx5bAD%2F1CbdPouAaaqx2dU6K2qbyUCtXBcEmUuFoZS9tI2mPO0SyzNOL1o2%2B9o8QIdcLb9Ipkpc5%2BfXIa3y59vUh2MqWdPsMBb8klxOjVlfVK%2BCtWwsIg8lsqqgfToApkc6zyjiflF3pjFokRW5r4u%2BYifneu9tfIsl5GBcpkeZiFh%2B7JqLmLw4w6623zgY6pgGBxxqC1A7Glkj871f9RxSLNU9dJfw1e%2FUPRmPnAIcfqpu%2FDT2kl98jHdtVfrud8ug699h3n4%2BLdJZ3DIY9kz8Jbq6O7hx%2BDyaheTym1n%2B8Cdre18VrUG%2FcHoiQJX49btiBCp9jb7nfNa8sx8ecX9PkMOWdHi4QecU0dBPAfo8l9IYmp8UAiDspb2zZA1no5gfV5AGLqrkdWDdSePMncppF0itHONGC&X-Amz-Signature=d201306ab336376ac4bfbe7b9e8955cf25761dc58d272d03a3bfcf3b37fdf0cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
