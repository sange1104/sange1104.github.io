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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664TWWW6BF%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNvQz2TOUsOTs4Vbbhaezz1dGAys0dSP6DxqNSTzV%2FNAIhAPXyOtDbCYGoxEAZlUPWFhMZaXbawv6vBr6vO3bY7hxaKv8DCGYQABoMNjM3NDIzMTgzODA1IgxM48SizbyuJMj15Esq3AOfHc65dLRraCTM8jHJBX2%2BQEsO1HYYCSqYkV2FFSMwYRIZKtFdbBudIkSs8PE3WwmS9RvEHpm814NZymnU%2FJuKvSNIsBh32kpQ5KGvK6OkWRoznkIGBEFn8z6KcJi%2Fhh3mEo8dXKmB%2BSxeuarlWkQukgrB2kIG5%2BApxuLygK9387Eyv8B4sB7MjI65%2B7A0YZ0Un0GiN8%2FP8r66iIeJw7Rk5wFlipSy7D4zfV6x8tyPRegibboP6QpbD9rR%2B3ed58EhiBhLLL3VdMUS%2Bj3gbDrp%2FiURAtmhYiZiooep7moGsASGKueDUz9b9OTZX9hF7QflSdaQNNgCQutxZMIavV2aIfbY9ZoSY8vuSWVUpPYRgU2DfJhRE0yiRi%2BxW3OI%2FCDfy5FWdqqhKyzGv0u1r%2FgN3HpR7ANgyss2sqIfQZpdZxUlyxokjFovjPDNPT3WDGVJVRnKRgDm9f9VPa%2B4EcV1FUMPJzRG%2BvQrIXXr9OtHCpwplwfJcMZoXlVB%2FlOw8pKABRoQPs%2F62vUnU%2F23%2F7m8WMV8VuGw3DhOTL81zPx%2B1KxXtzKtaFGy%2F2oY47BA7C2E0OePL7FBdTqyNdm9RXdiYMuG8hpi0ttsvNxzTQTSwKdyu%2FHTohjtNqONljCyx%2BDPBjqkAVcV5Mc0ZkHFM8M5AYh%2ByY%2Bl53HkjyMQ34MNrsO0ck8wVeTY3mZhIwQO9mn3qTZDkHR2h3gFDG36OgYHhoYM2iEaGmyDgotKSWfoAX00UOWfP7s3mDfp5gP4789%2FDRFxLj%2B1EVXyhdGVf4JtyIu8XFrXCPGHJXLkVj1mzxrPsUarVf7Gsc%2F7Q5J6FlvUDYSKCA%2FNSSDqtqkRAlT131LoQ7C3Fe3f&X-Amz-Signature=deef628b10cda0fec3478e951302bcd3fcd42e2d375c0f35e83e1953be580520&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TGSBFTVL%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050631Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD30rS4Cj50bSGYPhnOw2sEiq5IAI1D7JCPXH2DuqJ3xQIhANNMLY5etCQaKD59eLkoLm%2FiYk4YWcuOex1N4klGov%2F6Kv8DCGYQABoMNjM3NDIzMTgzODA1IgwPiQeggHJIKn464NYq3APX44vRpRG3xfXWq6ujZ9VS4cdd1xcJ6WyP%2FF1VPSabkZsy9GWMpxfUFJYUFd%2BqJT8aQvjsqsHw2iG1KrN6WHPSXNsOqx0UyXN4KrL7pgKTPMrs3jT3ZNC7lO4GyX6eOyMAFbgddjIaRu%2F1rmoukzUFR29%2BF3URG0aBylA5pOduBLiJUdMaSARr5Np0UNleTcPemewFCKAl%2BMnd0pO74xyERF35R%2Bdsl8r2s7rgfpEkdXk%2FkJJWm9SzzE6UbPGWVvdrAzRQJ7uunN2GIRuIkI3xbPQfPvTfJQNkisE7Ku3C4K7DePZrsla2RDbsIKpLQsPjIvet47OA5mECh3rCo9ESB88%2FRjYjxXQGAke%2FbEX6oOhmuexeSDkGTkaCKC3caOGr9hHH8AQQxE%2BjmyLuHtKxAtKmo9hbqrQHcgPDf1%2B7999ilUnFlzK6068%2FiCcjymLjXOQNGEGruUV72FUdCcAZQjFyuV66ukp6A45QhajarLSxCATHmAUB8JCW11F0gt7JhN4zIKTbns5E6SUKP8H61fhior2CTPMe50bFsZEqWzQctcLWG8QKc6Eq%2BC5cmUFBD5Hqq%2BKpYsh9d39YxWGFF4e79vB2Vn64Sk4UH%2F0Rw9sPb2Y8Exrgza02sjDBxeDPBjqkAaQQdHm%2F%2FHZ0zauHTvggqgAZFMRtcYPR2hFvN2RiAeYojLaLLbn7QXwbsZReISIM7UuZaOSUqsZFMZgyNIFug2wtwUJoMHoNIlRMLOucIVWox4nDgW9E4DFNync92U5s3zIr6KxxPMhQx%2B6ocJ%2BH1x0qkYUHETkqyZ4Qp5TAII05illgMAoNWP6tAJqaaK9LhflWzNxD8%2BWZUwGu4QO%2FcTOB3Unz&X-Amz-Signature=c02a5054bf6a93c7a4ea1e0507ad0c877ec15ed6e4eeac7ba434e8f9c218cc3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666JLNFJTU%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGF4dJ2sEgNTwVyPCxi6%2FpDjcrJd3SkePVfZ9NlaA8aUAiBRM5ge1j1KxZ%2FLAavqO%2FipBMckmAU1TTsopsPf9fVoxCr%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIMft2Mv0zFPoJeYuUgKtwDfEVRHqCcInND%2B5pVU%2BLJwszLODZVXCCQD9BZGedAIK8ZgdDllGId3ixf50CsMBAdZc1xju0R1VsTkIb3sqx0AeF%2BZ5mDwu36LnjFbADo5yypetWXqOCvnVytPy05EA6S7AsIiLCmw54ABXudocvt98smIZr2qH01cfeZXXOsv62xWVaHPTmE4IgJJLzqdMKMyXJCfVPprjDjPEEaZLQr%2BIdCfuXM8CXL0QnKnnDFsv3dLd%2B958lm%2BO7oj%2BxyLXXx62Yd%2FG2DNQQJuukQQAWlYl2u1ONF%2BbJ0r9sXcsnFHxvIuaA%2BuJihh5J%2FU9T4IpEdR2CqQmFnbZgZEKcqt4MkoTTbKyAfvkNiJlZFXPbT%2FchYU%2B8F3M2GQyAXq7ddTP1ct0NRfEV7yhjuhFkAQnfhLWm99l62lpkFcDjsf8eZn40DvC6NBg2UOsRXpQd2LBc7dhFD7VdmFyilYgZ436O61838DhBv2N0SUHnvvaO6Tb9MoHm0jlmdypFNY8FVthje2U2lbLVPvDtV3O6eOzsEnn8e0bDvVEvBsX9qN1ZB3cHD69dqWe9xvn7UfwXo8O0YR0VHprKj9fXnTLRZVUH1x18CdgHVmMs%2Ffw1pVIEwq0GMqiHM0ypREEvA5WgwscXgzwY6pgGCOVcX79vbCnNCnSStmSiUsRZke218xwQohCV%2Fwb8qWODiSsFybJW9iZA2BvX6Q54mycWTl2Qrdjl3%2FYaqcIh6X0MX%2B2ODFRyDKCsEYkMsLgNv2qsLVDC%2BM8LDlETd%2BZRR1gdSX1xUclGbcfjAl6Dx1g1q1JSGBSuGhkX%2BmUJAxCJ7Ob3cnT6%2Fvqy1gyZV7yC1Ffo9OgtDH%2FfQcqoFX9t69NiZHsFQ&X-Amz-Signature=247509f168632767e9198ffbf69085b34db8ae613c427da4ff954d9f4e53bc44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663XFOHWTV%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDnZnZyG4GQGYDYixPZgMUe5QSMaDumH77A%2FkOUOlzldQIgFXbgBxj1enKp2zhZxCwsktfBSL9ap7fxR%2FbzYYDKRnoq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDAebz9oosVuYg9Og%2FSrcAwGrthBz%2FhTjfutPKHYXskWUkMqcBaEn8dp5%2Bxt9sCv7Xa6VWApmYFL1BPmc0YIZwihsBWV9NMvIVx2EtUmpHOcXXlqe%2Fpb3no8kRu%2Bug4JXw9J4KTBrp%2FIO3ZgK%2BIKbPeE33fe3Ae7xfCHSproAid3pLj9d%2BbGZNqFHcZOFVrRcOqqdIHqc7DZhKbIIK%2FrnWBg4V9Zs83rX6S1T0dgOp5%2BPfgJ0rFmfL%2BAWNPs0XOxn%2Br1WZ%2F2tK6k7tLch2kDMdPNBoRAeOVpbqGNbE6kGZe1d%2BQKQjJN2EAybRgqOmrp73OhMTxTzZ1RoTpWmmpbaBltL63z5XdhcjWzN9PBNOD6t%2BNz9z13uMz%2BIN54gCCz0RFBvwPjxUzRsTMKYtHYMwnIhEiPfNR7%2FAfxE91F%2Bg3MXACfS20YwNvwDOpwfBZrJn8YZTJ7HJZ4h%2FmpIBX03wboewWOmn0aIuwN3t20J9t31ftb1%2BzAoDUzsQrLauS3R6P2vXtqq%2FaPAGG7lfr0T1vPlmlufKismO6kBuTp%2BmUMM7%2BBMk8uY2Ya1I0MyFAn68zRSsAP4H3HsZ8URCy8Xhg2JAELiKDrcIF0kc7lrUYh7y7WoUSfPXGQVrLGPng9XwqbvJQwQNqy6pQnTMKfH4M8GOqUB3mmfba8bNrUEQLAYKArtGIOAGdNwcYl7etZi33cL7d3neHDf1IhBo21lGlq%2FZHaihBq%2FSV4dTRnu6R5uakLuo7oc9PwCusGPnqYkILbTNavfAiMThup0BpZoqfJUaH2WhFDTZkTgvNrnWaXnvXxnWxMP8W4AnJ%2FvPm2qspW7rZKM02QYda2jjBlPCmct48zPBLXKKagMheQpj96OQ3E%2Fo1%2Fky6RL&X-Amz-Signature=a61500c9b986608b6c562d3a09e907fd5d334ec571ca42ab5755a81f9b584292&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XL4V7DSE%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICxylt2TGqWI6hxFuhPEreYr3qGC0Lgi9zoeCfK9qd2iAiEA8aHfIQUKvsOGcB464%2FoHFanbfXisV1vRuHsDJVf0Jvoq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDD%2BjV%2Bni1S0MEZ0hWSrcA4ILweHL9VdHwOPimv1DRj6tRSP%2B3VQJ9HvMDOtSKe5WkdweC3ux7Lmpmf%2BdsnWYdeHdjamgJa4CYshKbjRHn7eMmhK%2B%2Fm0H6XXLzTkSNG%2BeVc%2B8I7Rm8q%2BMRms2Y6rP3zlnhXojm5kYFfBIxC5z0I%2BlfW7J96%2FTBnVd2F9g%2BLpjSSHtLRHROuY0RIlxPgbqpbt7QGH2GR3x5ftm%2FuPeXuwe0A9LBWvLTkl9yvs%2FaDrwcO5cvMA8TArZuugmX%2FilXzPYWSjUhBwieaM7Lj0TeCBdiubyeoWbNMtVZnTlyYLLfHWwGEvxANDzH0oUPbIeXmnDoFa49uCXIWeJ%2BTqgpsZWdombBRM4c%2BVwbrsT2%2FvDX9KJyfu7kb2QYO325AKzGRrdfEJ%2FIIFKOKgj%2BOznKUQsxEz2C4xatrjqV6hcR15h1kYNTCd%2FqeKT6YpWTWoUNHFjb5Db2SweLEXTl%2BWR4RDtePixvrIyUd2yu87kURvMSzqlnycfpkEae7u5b3QujVlHybPXDTpFf1oM4IVT%2FiTNvx6p%2B4tDc0WWGqc12a%2BfZVDThQeoC3Qf2JtdnuvEkpIJmKd%2B4MuTDgkJ6KHulEuJbFOpUEYd8C4mKt2dmh44egz3Vq4brGFcRSynMITI4M8GOqUB3LKvIrlYsnD%2FQNC8%2FXHDIrUFzADJrIe21y0WWP4BIKiG8WGSTq8%2F8PjgO6j%2B8%2F024dFRwqcytJEaXLPS7K5wWyljtsY%2Bwl4Md7G3C5uJGtcdgtRoW0Xrw0gZwvtfYWzt22zcNR6VxId2D3sMXMY%2Bau1ezyVu52EXgcOygRGp0t%2FW%2Fb2gerqxBEU%2Fk%2BS7ueCmAA%2FqeklP2NJj58f9WAMUqY6oubXo&X-Amz-Signature=499a89f7790e868c7736476e9c065a89eb52ea10eaa682bebff5384d360d9b47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVD5SNC3%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDL7WR2ltoGqZaq9UdlBJnvC8EGBogtxrMLFTVnWS%2BTYgIhAJdfDw%2FcNPRCE%2BqkwxYHiaCtMLKu5yhe1k8r2EfEeutHKv8DCGYQABoMNjM3NDIzMTgzODA1Igxqb3MdkgeJHCaoAmYq3AOmeqz0dIiMF42lazxj9mvdry6bl5xnZTCSL0I3s5F3EYLnNyWYvKN1ZFqIpr2q9n37wysV7OWUV6jstsUyUV7ZTG%2BQFzhKqud6EK60v2DMDMCiEUBmZp4ldKy0ao5GAMNuY7IpnD0DaDo7JYdQv5eGjx3JtebLMbyOF8dKgsmfTaMZY3WE6GgIaH0%2B3sGkVNWWFo2clIO3A%2Bfn7pSsAydS1OUYNy7uIChlRHjZJDYcargrz06z0BcE5PProma81pCGz6fUDY22%2Bx0rvsVVInZKzJ0RKrTBrLzzg0QrXDb5Gn3rw%2BIzFDLrKsAopTO%2B%2BQbZ5ytW3VclTw4vmaM0B3c%2F6VuEIrxQbHY5HU6tD4my%2Byx7p47YTCOs%2FSbvrB3H2gYtiurH9fHHcHw8W7udfpnQrycmJpyJTpw8I%2BSkXD8PGz8OJRKAFSCQ3gcbZcFQ%2BciLk2aejNtjQBcxhkcSTjt9sulf%2F8hQqb9PbovikOmbjU3uf32fNN8N6LeaxalbwB97kkN9OAnXEhTFNUqG4vganmZTTPo6mmgpMqXhwtY02%2BkqT25PZkFNDl8GoEcUvKAyYOgRQnL7Oq9lKGafqPWbqLak6d%2FAuKs%2BV0SlLncfG3ej9whXRUM86%2F7%2FtzDkxuDPBjqkARCj9YNieQDFdH6%2B%2BT%2FiOkwxeyCykrfWkwHwEa%2BSicNrPddTqMohmsVI9qr%2BOyQilvfZYrXtu95lCwMvq9gsET3mdtPK3ogsJyZIcEge4SdzBGcHDo7n49i3yF2arH9MfoRHc9HXDHfaPA17mqI6U1nNBma8OmnhdONkd%2F0EkUP9dXJneK5f4LrqW%2BQctAzRlY96nnY2To6fShAFvXzJkY0D3X4r&X-Amz-Signature=cb87efeb4b74fa9213799af7c6fda993ac59cf4edbefb61b881d94670acf794b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TUANKK26%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHGVjVfpoMFYRQfA1lJWT6l4AXOFQBxhO4P%2FQtSVYov%2BAiBBLVuX%2FXO%2FnemCzBR9UIQxtduqFytGOaLKvK66eyW0Hir%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIM9hEjp2bgs1Aw53xbKtwDN%2B3dqi5a2Zud7sk2X7XynNwchkIIYeg7Qj5w3sbDuAOdDoCHqQaF2UHeZfsvNUkq3EJWYMLM4qJczijZU3IsK2ny1mcbL7HgfEs0cGWtbOIwBOTNpfhpy3kDVPK%2BroAB8mwciPFoP1jfGO0UlzdPejMnxZoj2qG95%2BrNvxjChI6usL0hbBorekWq5RpmeAnvfHoW1zYHKNaV8thhaF5iJVdzPb0pHC1MZ1nBkU5DuU7E4M7rWLnc6Wzta0Uv96CCk%2BhzetSmQ0WnGnxexj28cGSNiJrnB8%2BsX2lj8fSS0RKmqu6muwfl7fLWr4enF%2Fcea4fK6GMkzWjpB0AJlxn4Swz6GvigyIMe6Kfr4FZc4WLMrHwodGCyt9BfRJtC8R2mp737TQtFSmAopHGh%2F7b2DVRr39jmUdVmu7zMymbDOyiQBDkJqBmNcTYGzT3n1l9tbEKBDt0XCPdJv3sLz9RHJyGMVd3nTUFOhJZJ2l9u70elEUeQobs8n%2FeBfIcLVcrrDgI7p2iAX047b28aCH1YgyEB%2BbNj2OHKwunyWh9KQFsfpSw%2BWA6VjyxXkhSAsfsexaRaoJqYPLECwbIEMpEeW4JInnM7tcWDUDcJaZR3r90taqH%2BBRjBm7dEYqQw9MXgzwY6pgGhXTGI6IVoKOoTSz%2BipSwm3QHOL0k6rO6iL8IPeXyeTN7jJwKWqGygmGun8wbxqNTH3sWnBxP8RZIPyeg%2Bt%2BkR07%2BAWU%2BtzPU1s8EB7wF71qY%2FeLUXk%2FE84LYQ0TAiu0XMyHIZokrgO2sO46q6OW9%2Fnqsasv13vftpTFFDdon7tjRXQAqtKwnO1n1xMXkkglEhfctI2ml8zjUdr1rErydCzm8retDn&X-Amz-Signature=0ba978ef237713e2e92369f0561b3acf4c64fe5d3789b2081678c68040d4aa43&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663EHMQGUW%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDpvQqJijnwXv2L7ojRcqT%2Fz%2BOWcGDCUZKsH2hjp%2FNFZAIgTFS7FOGLiCRM%2BFW7%2FOHy2intWcAkhCbPMZNUoIG0KnEq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDF0LOny8rZS69o8i%2BSrcA3vxe3O9w9eHS2ZOgl%2FpRPg0MdEnkOufud42nDfLWYBp8DaJtmShW0WPa4u%2FU0SXUu9Ns2%2Bmf%2Fk6eRNaZib71VKeIxcdNzgx2bsBikv0JAHXGu%2BtG9z4UefqHDVA8m64Usxbd%2FAwl7hSpaGudt2jDZB6uuY%2Flnj1Mg7uFfGrm7M5pMhaRXjOnZc4Nbw8oiVcyeHOSWCZ%2F4yFXA6laSO%2BgsTEP3n8I68dl%2Benbn6xjZuDLYr6DcT%2BIHPJwe%2BZ2Cc%2F8JnM3jlsjVQ0%2BAD4THbhyYgYEnKewkHVnHo9wJSZ3skGjzJJvjBpPvUncSP8DC%2FOClizVWs%2B2IfkyxjMgNDWfcPjZbD8rXGWIsME9uGoO42n899u%2FDexajK7JUekMLqPxRPqdZ7lvZd%2BOKapZCdvLu93n5EGSrlTpHJOlf%2FRHop2Y4kygG8yLTlG2WASvs0yNfchIYO%2FEM8oarg8uPdk6Tp%2Bou1z%2F4nXh03yYth%2BtvPkmwDQ6yUQGGi2N75Qq8QubM4NdE86DNZ84CJpsCLN1fKY9geHCKqfL%2BA6o7bcsMk1MCTCivabCQcxRvVhYvSdVoNq7u%2BnlrWjA49dTMy1RpK5NY2%2BoQR0yxWMc5KlcbJhCF3qkeHFEy3qddHnMLnG4M8GOqUBug%2Fw1YcZo5GA8ikU7cAp8yLDJXXnTgy%2BveE8alxC6ZQWfqyT%2FGV6ZCahibbySGWC3YGptkZuSKSk6S7f6hxow%2FtBdcNpFJfLxDNKSCBERvAKEdIc3DF9BMSG6BpyA5NbRnBdKht3LXMtZ4qnqtDh%2FbZFpbgPLB8RgRjCER6eZ0JYGJXxXS0jI%2BZuedtK6SkmjeFucFiO7%2BGaYgq6xqaxc9t2dbBs&X-Amz-Signature=a9f5e44c1ee49bbc2463763b5ed960c98f744b40242e5bc42e6b273936447013&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TMZFJ7IF%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRXHBAaIxRtYq4noJ7emob49%2Bq7uQbs%2FmbshslJtqO3wIhAP1nQERbks33v4%2FMEpfAPiaaR5KoYCG1igrjudFe%2BpijKv8DCGYQABoMNjM3NDIzMTgzODA1IgxcDPPvGBSLN671EBgq3AMIpOF0oHlM3DMNrOKuwSTAFL%2B%2F1GhoAZCavDcUvuyX3jjmABgIRBxfEX%2Fyd0T9tJ5MDhENiIVGX4slEQBOfV2He1ZJONp5hxX6xdjb%2FscKwDjeSkie3ZWRIJP7ix9secB%2FG50nrnIHize4z4ESA2HHiPTGqZkqEqAdgwj2SKxf0VI9FHJ6o%2FNMJwTqhmRjQneOyh1ce8z4OqC9iHG%2B45pbw85hL%2FRLO0xDBIFi6FE3fwkNL6NxUrWPs3S%2Fp%2B%2B404KMQ2Km%2BrGSjw1emMI5owdoPdotjdd1bbrqsWgcsTIF26yJa7RX0jY8ROUscgZtbiq%2FuVIu6wlXJnREtmxpeoMm7PrK96bEKnLlpWSW4GtAYSZb%2FFnBi%2BiSh5wb%2BmD2Hj7%2BNrB%2FqrSYNLt8QgFblC0jPZSK4a9%2FIYcYVS%2FEAFhpKlRPw3J2SigfgFg%2BZAjXe7LDdKswxlUK5NH%2F8uJMS%2FS6g44xMd6R8Jz57Q3E5b2O3Ta56C1Z%2BOm4d0FYmLnd4%2FZ3vNuw1kSzUDW%2FYXl7YvI2SXgZ9R65xbgLReEZ4ZqaPstQZUJaBKglSmeN2xMAr6Kj2AJwKQsjjMZgem4FN1GWEoed5wP0jkDcvE4gDE%2F9BB9CelagCFcIy0VSwjDIx%2BDPBjqkAcFJYQytdaZUQx6M7r0zm7BmHmO7pw8Fc0r7tVMqWqO4XyVUDT8LPb0KWXPv8cJD6tq4jbH2mEawz2TQt3t2I7k9Ayy1t4u3%2FQHLjkQiVdFCu%2BxaqvAp1%2B8E9F5UUnxYeXUkIrl%2FzLqCLNHrTs2nK7mf9hdR%2F8HIoFfqPS%2FxcjyrbJWCQ8IWt8PODP6080vyfi99Xs5l8G1cbh0unV8JO57Mr2pe&X-Amz-Signature=8765910fa8256cf13778582182dc214f2dab4591733de1cc709242a5b4f4474d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YFKOVNV2%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQZbkSCGLZiw6fJxn7xhqq9SB5bMgd1Rvtpzb0iHjdjwIgQGSOiNJFFiZwNb7bl4Kfb74JPjE%2BI%2FCkjSWvBb32OUoq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDIUcvOuq2WVt4RlH2SrcA7HxyyosaUqYXGdbVj3%2F85W0GKGqcbrfWuO4Hx1%2FdTMBfUkupRuWEFHCIQutmK47AMFIYwycuRihZI6L%2B2lyOFif3%2BiobzG0XqcbwoEbS8I3bErlQfrpW%2BBT5R3S%2FLXi09IbMLUfQd4vFfensaYxy4MLPA1LIwM%2FaS7eTjU1H92Js8fjrXS%2BxLxiPhdyETPDWiNWT9XoQoLpvf0R08LekZZONsgYO9jiQHtb8q1ttCESxdZbp60NX1rFVLaCb5YOqVMOGkvsESBff0MlfWtTJ%2FM1DBVRYe9dHQujxoZLjneBKdoJaUOyHME%2FJcALeQJIaEL%2Fq7jQ%2FXY7IRW9Ht2qdEWe9wjDd5SmTMQNIYPMVyyV8n468j%2BstSWPgalyJG7dC75WkZZrj9dNMOKLNpwX4OutbV3t9TB8bL3lAjsshUOMfv24IGpQHHbtGQI4pxgQkmAKzjUWNfDnwepuL9Oh3Ckju7qDFi1MJSV9BYnlb%2B%2BvkzbfWr5GWwGwhUtN80o3sldNcsOepcLMoAJtykhe23m8sM95ygNuqqERvggt8CC06y19ZTqg22uKpozKYCCynX9jg2HoLaXPOsXDsauzXyT6d17YmCk7WivOv3nhKcJTNUiYGvgM1w1utomkMIPI4M8GOqUBfNWPtO5v6OFZx950eGeOBy6PTfHNOHjdWF8rfNtk43XujPh1KYxUIbYMhwYzsXjA9nwFk%2FdviL9C%2B7caSAlMh7ABo4hfq8BKyIcd9%2FEMKcdNvrkKwcVL6Cc5XYtc%2BEBD%2F5OYYaG4sJFem1V06McnD4WlD6sUt7SZhzu6MXX%2BDt81NABLYKkHDau44M4SrsZxZUJA34sWnflOlPy3M8NHdyx%2BHUqI&X-Amz-Signature=f893c3ad2a706589aba18eff422c6f114e9f6d98ed02cf128b25978b9df9154d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46637MKTLJG%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050644Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHmCQk7lQlb%2BgjM44Dtljsq8E9NloT1XWd40pTNMOgP7AiEAsyPAu31XSKXJA3LEgBrsSFGAeFNmMh%2BEE5tdBQhNTokq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDCHMmRT5tKtmFZcdQircA%2F9QYv9TRN5TrXW%2BBA7Cgp8IrtOit3sIoK4%2BaM0eIaJt8WA2kKEytpeMZRm6lpJskRBSqgYOWwCUhX9d2puwWu5sGaRQAebyrp6CRiI4w6Gk2u%2FWr9zgHHSeWLEA2K6vsxF7bgxgePuENzy9%2Bz219tn8ykcRlyPRgt6bfXplpyySdY8TCu%2FzVSgJfBLu1Yo2La18PokUxgQULx2SnPgZw2UWK9CClgwjRE0Zpgy7qyuCXBQqbNof%2FMOfvRHMKv%2FPxF5n6J%2B2RrCryimq5sYrLgngCsqVWcpKYh90coSv9gtcB4xQCX0swBZvbpHoDyOwpfvNdcGGmixgHnnatSYgp5UEFc3%2BQPdh8CTcbhskWablMw26gldWU5PDsI%2Bmj6DctJGLxnn9vOVqct8lePM%2Fq2oPSnTs6kwd3MRUBYPDf08mCaelfLmRPMzx6PEyar%2FtGFLbKSu%2B9VTx0hWR1kvXTcandIv4qpge5iZuIJsORXgQAouNbgTgAtY6c2wuoOMWPFIs3yyEYi91OLw%2BU58u6z5pzZPBPvx5zD9sws7IognY7SUFUjIHFLDmEoRjGeYDFOVjho0OUVuMrJLS%2FRjUaw3YtOzsuL8e28SxCz5t8hzvFZHa7pBPxnPAN3NLMOPF4M8GOqUB8EIY0lJ1EcFe1xQSFoebegcmzz3otMvnHtOhB5B%2Bn%2FcCl0Oo54ti%2Fs2h46jMJUvYVCULmsr8QHIg5HMqnK0vwrGJohtQd49UydMAbTyh3ObzqPFOmjSBA8iNa5Y9WGoTK%2B3ntTblqHSi7KiReMp0TJNQXDc%2F1ld398eUbTWHi7qjH%2BhfKif%2FTOQjeprYBMj8q4LK9iYdyI7%2BYyBlb1%2Fo3vvG1r40&X-Amz-Signature=a2cb4b62e5b751c37a82e5487058c2e5d1e118959243728aeeb1fe6847f0a42c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXUJPJDU%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050645Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDJZYnjhMYeIOAmy%2FgBTQp8A0Pbtpc9PQqUgrECGU14wAIgMocCYyj1y3KXmtGmfrZJpoJrkqkOHbXGSgvRwxjg53Iq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDLXgwcOlBTI3DKo5HyrcA8af5fbNB%2Bs%2F5jCDctMTRCiEnT8Ki6XJno8bOSyfcT%2BLqnP07lTVbcOTXDHmyWDB5jLBhkvXWX6xRPpbOS%2BPVpVMJOtp7b3c%2FmN3Ne7VmktOEjKg1e6ljfNYwkhmmxbRN4kYrXHKX3RcLESnuOdzpQWo5kxKSnp29Gdn5e5ZQER7TTJi1WbRyfxLJYSrY%2FnrRXIwmFlnVAG3DaQXz%2B%2BJQoPGw3Ykm%2BNOoeSGDu8PWHEvqBNNV6ophKXj6ywEYfMq0gC6vDHvaBsLJ3MCqHnyLi13Xn%2BBhqwTGBEl9rzkAtDs5pDA5J9vxX3%2BTp0%2FZbXu7CI0P4YHEe9%2Bu%2Bk%2FRJuupx6SMFR8%2FYXhH2czxzzi7SoJ4%2B6pcAzVB1CmEZomgI2YTBefwQwlJnUZtBMSmitCLx5%2Fsn7WKw%2FIVywEdKKKpYxp2WEYMRtWafwGNBwZ3fVE2BNe%2BaRkNZxS3UiVY%2F8zrJ2xFe68OBpp3owHTqw6Zu%2B9akHbnwremljmQbzoYZGhH2q1k9o6CPPH3fCX3WdwoRBaBTvXnDDkbY54VosgzF49KwWCZm4rhmdVJxHTHeaejNLENLpRvLYyEFp0F58mkGLOTzjKFZvIOt0QP1Pr7O6fkf7LD8qgnftGFCp8MLjF4M8GOqUBZxdf3cTjAoBB%2BSFOjMAn7I0MvUc4SyAHC1SHEndqdX396lNhXc7lPR4r%2BaUwYohuxjGvjX9yl8mBmx8Ef1jgxoSUWwWeN2%2BpEv7TVPL3by9xZw%2BurhZF9WYUehhK0hrHx33P%2FOgWUV8FzmN8VZsB80wwvJZyhBHNkXfsnOitSbaS%2BoIv%2FVHk68Ekru8rNQQMuk58gErqLIG7bQm0Szvb38jPGw1B&X-Amz-Signature=95a6f1859d4b67f5c703d06807f8197de5c24cfd66f98eff2d57e7c388f4ee37&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWWJ5MM3%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050645Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA5xW3Yk%2F0dYe%2B1rbHtWL1FLp%2Ft%2FLFZComEoPytnQmGTAiEAqjLYiD5XHggx4faJbcLALP3O3qIzf8vfuJIXtobb5CQq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDDxwuTYfKmTXTM3b6SrcAynp1nK4RGXoNNkDa9l1Dm%2FqShNWYzJEExmWmIFPPbctezrxe23zlzGKmoWhRaimcSdHi4zsupcAhLQm%2BVbuZgzy%2BfYhAN2ns0VTgEBxF8zhPeuYkoCyhT9618p5H7rYNoYPBeV8KGgiL6ASl3gh%2B4oTtWMs0i4KhqrsfU0NTDGeKaGFwNcKIhSjoB1SG4RO%2Fycb0H00MN0irQkitXcpX4IoDCXQN7VuPKIx9dC6d76WK%2FXY3IOg2nlcEhWI4AUZWEhsloKwkrLEBDniAnZGhsLDBP2k8XkJIy3r%2F0dY%2BA2htL4lUzCMGkhtoUDYZyNtzpIsWcGKmSPvz2lM9lTbjJCzH%2BhLnvTnEnOvQT4HUPEcKcMICmrn85L%2FcOVraTzouNzDQZc1LtNAEAQSiJSEjNXWZ3CwFLAh2%2Ba0V6g0TyiTE9LEi2fe5lQbAgtDDnCQwT1xHQtkksisYhhzlKq%2FCIFe%2BkrzAvyasAyVzp9NHlnMuqTIFXvCv5s9bNDcDDYNUAmxiRJgMeOt2%2F7k0PzUBWflFSLiBtzkWbMBqKr0q7Y0SbxxKMTMmot841Z5QNQoJpEUXk44alXEinj0TLmFsiKE3k%2FzcVR8CUu0odpH414zSgf0vIZ3OJSHEY9eMJnI4M8GOqUBVegB01N5LMlKkNu%2BH1K%2BS3iS5TVbS%2F%2BOZcmQ9Twjgi%2BXjW9nQIq3xPNYjSgG2XdpJH4sAkyGt9bVwRJHyv9RsE9pp%2BKKxZtPSXY%2FIllPnjLTnlz5D7cIHmbSgR%2BdLxa1On1Cm9C7yll%2Beu%2FCl4NPeZqkp%2FYy2eUVW2wse%2BQv6%2BJqtxXhe5v4ErIsHYapDaZ%2Fkk4V%2BWI3vkMwN6FNC%2F9aFIQAH6oB&X-Amz-Signature=186e0dbfae03874fb772481ef92e0e852cadde935e2783dbc6360606eeaaed67&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWWJ5MM3%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050645Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA5xW3Yk%2F0dYe%2B1rbHtWL1FLp%2Ft%2FLFZComEoPytnQmGTAiEAqjLYiD5XHggx4faJbcLALP3O3qIzf8vfuJIXtobb5CQq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDDxwuTYfKmTXTM3b6SrcAynp1nK4RGXoNNkDa9l1Dm%2FqShNWYzJEExmWmIFPPbctezrxe23zlzGKmoWhRaimcSdHi4zsupcAhLQm%2BVbuZgzy%2BfYhAN2ns0VTgEBxF8zhPeuYkoCyhT9618p5H7rYNoYPBeV8KGgiL6ASl3gh%2B4oTtWMs0i4KhqrsfU0NTDGeKaGFwNcKIhSjoB1SG4RO%2Fycb0H00MN0irQkitXcpX4IoDCXQN7VuPKIx9dC6d76WK%2FXY3IOg2nlcEhWI4AUZWEhsloKwkrLEBDniAnZGhsLDBP2k8XkJIy3r%2F0dY%2BA2htL4lUzCMGkhtoUDYZyNtzpIsWcGKmSPvz2lM9lTbjJCzH%2BhLnvTnEnOvQT4HUPEcKcMICmrn85L%2FcOVraTzouNzDQZc1LtNAEAQSiJSEjNXWZ3CwFLAh2%2Ba0V6g0TyiTE9LEi2fe5lQbAgtDDnCQwT1xHQtkksisYhhzlKq%2FCIFe%2BkrzAvyasAyVzp9NHlnMuqTIFXvCv5s9bNDcDDYNUAmxiRJgMeOt2%2F7k0PzUBWflFSLiBtzkWbMBqKr0q7Y0SbxxKMTMmot841Z5QNQoJpEUXk44alXEinj0TLmFsiKE3k%2FzcVR8CUu0odpH414zSgf0vIZ3OJSHEY9eMJnI4M8GOqUBVegB01N5LMlKkNu%2BH1K%2BS3iS5TVbS%2F%2BOZcmQ9Twjgi%2BXjW9nQIq3xPNYjSgG2XdpJH4sAkyGt9bVwRJHyv9RsE9pp%2BKKxZtPSXY%2FIllPnjLTnlz5D7cIHmbSgR%2BdLxa1On1Cm9C7yll%2Beu%2FCl4NPeZqkp%2FYy2eUVW2wse%2BQv6%2BJqtxXhe5v4ErIsHYapDaZ%2Fkk4V%2BWI3vkMwN6FNC%2F9aFIQAH6oB&X-Amz-Signature=72a30d943689780ce80fc04c584d6ea0357d8556f9302d282dbdbb5348900f27&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
