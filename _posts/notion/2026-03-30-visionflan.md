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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666ANZ5OWB%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIDyDOICdTR77H0p1PdWNkwaH3qLTQn1uY3fF7G8vUQ84AiBXfihQDsdZr911Fcc3bC1LmELsoZwAadSTD6IVchJwUSqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5cE9B5%2BEW4RLUxm6KtwDI3RNSrwwZxdyc%2FqJ7OLilmMTnMpQojTX3GcTpZk3tsddA6PRnDXvF7myZN6UPTXxEuzBbYgGCKG%2FtJqDkA4FKsWoly7pJobZqhv%2BPJLkhrslmgfTaxPvgI2QKA%2FhrT4YIvxTvVW8NIKx15mxIg99Z8qWNlKLmx1kXOGbtzhb5MVuDfkHNI%2B2fvg5Uyg0gKjD3QYWsbcK2m0htN4ExG%2FOj5ZxtbxZUeEu%2BDujeJtLfS6hrnfHq8BigKqY1W8iFuu2QhiveZgf%2FZ0q1MLKbYjGCjNz1paFxvQ5ONMVj46Yq2HE1%2BndFIBmz274GFX%2BEH0vQzky59eWWbeqLZu3z4D%2FA3Q2c3VJ86I8Z%2F%2FJNbT2RN%2F2t2GMJZMQN7%2BfVnac73cT8ktxeJj7oauBSE0wnDEOpwBcAbq6NNZE1OTsX9Ta9Pf8hmQNqfTGe7W%2FIxog4g9mDehzrfCXXvRzwUZMW3n7zLWRH7ZkLuRFdb4HmVc7oZrEGQ2iEaGA0pFTk52vr6kqY4FhkC99BaLWi1JPryn3pP%2FoHKWgl%2FLRvVaFNUTUzO4gQlPiTgtN%2Bek%2FFEINJbUqB71q%2F87f9i4r%2FZcJR%2FIV7FOS%2FsYJWt7NP9mZeFFQF97hvg7elJoc1svJq38wmIvXzgY6pgF6JSjmY1EXNzry1a1nnc%2F%2B9%2BKOp3AaaHSHgwh2J710UJdQljqZLhEAwpm%2BDO7Flck2J9%2FoNJSPUrwAzJ%2FAcuzehyk35yywhouFiv0e%2FMP3vLr%2F0xP1O3H4hUPzJ57ugtYezNcX16Crrxxi9aUCSox8baAk2w3CVp8CWXbGhYa1afiWYfW%2BzmEiLE0tK56ErhVfcK1zMRqxJevCdoZhDu%2BQFgjT0jLG&X-Amz-Signature=a9d642e5e18514536b05ac8810aa6fdfca9eb124569030263869475376c7c471&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466USUCF3VJ%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033121Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDNtr%2BV8zkFXgjm8Q0YTyf9cLDeRaa76ALc%2Br9U9CwlKAIgdiqbbf4oYJ0%2BKKVEympHSyDxRfSnFtFeOiKUzKC5oEYqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDComl76MuGM2BWUloircA31G%2F7M%2BYi%2FCM0HAhdtRlXyr%2BbRBVamINQhBwo67T7S8kDoIG0%2FaEEcyxb39bRic27IGSDmMByH4nNiBMgUrRX0Vdu5YS6CmWMbYvDOw2cN5HLaqFvH5iq6pV9YmEUjaZQTA8u858hNrc9VdalQnvS6h4xaeJgf5rdjE6w1xxlGhqwNKY%2FWB%2BlUq4vrCRWEIgWLeEQ%2BHxg5ekWBkM7%2FyUtDFH%2FsVmKLYxuic1BBo7etbD2hzNY7V2E0rdwJHN%2FL7Jos9WhZh%2BXzncKIfG%2FLkP572HymqWw8JOEGcWmi2chgUndC6qY1mSbjZLGmAgx9bMQo8msuGNGeFOX7uv9mSk8ZWMBhROhgYn9q9jDdOHYy7C3k%2BbvSF%2BcvmU9OjerFBAj%2FOneLpn9zP3fQG3EFhU4EpJ9FI5YzOSc%2FOKsdLDbMm2eFpdbiQ%2F2p712vI6n4YgL%2FGKAQ8Cq0ExYVNO7kFpCQN10y3%2BCHw8X9aiGGa2TMimq8E1hniUKLnNLKlMj7inErkO8CPLAtFn2z3YQsRTfNaDoEV2sBQmy%2BKhlbCNb48SrthtDLb8k0yE9q9EhWLoKn9f2zJTk2%2BK2Y7z05n5uEi5NufRdv3vCoykvbNIAow49JVUDcAee74i4i5MLuI184GOqUBz1oQjsmNSvDRVEoDmqlFyKxV293qYkU7qR8DdLZL4%2F%2FK8kl3zk4K9%2B37kk9NRVrDQ%2F6y3pS%2FgOY4gvDDCOVGtVs4l5sHcbkNeGPsuNQRJAtsoRcPJr9Pr1dKrCK1tlRWd1SU6GLvU2UpYLrlO7SyQOt%2F%2FEyKNUbEUf5vzi1G90yqf2QHFsa5euaSJZtRREg%2FJ3UuznwxhCL%2FWjjrKE6g4eHqT81i&X-Amz-Signature=710a9fb839938f1aeb1d191f5d7389e4e03ecd970dc3819e6107b4281f573b88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667PREGZPC%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIBJzZWCjts7zsXmmg4W5LTE%2B1dHMWNBuU0UZRyNTyfwAAiATDkPe5rH0Eynyc1FAmIc2PFUtdT77IarNcHOOf0I0lSqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMfB7GJKXvaKo9NBJEKtwDDrFkXQVwuhLotzKKQPDb2RL9SS6PPdEHVkR2Ckyb2ZMX%2Fcvx15hMcfQ23e7lcSffDMsNKSthR%2BlJQo7rWMTw0UTr25S7VE6hIsJQz8VFoozh%2FPHBFf448rg9OyL6DlLnbKF1KaeuZJLju1M3wlj0pazcB4dfvi7toqVHEEt%2FzXp5%2B2IFB1HCkxAhuUGpL9dm5L8HJe9ozgpi%2FgIA2TT1B5nHmu9pS%2FSxxrRTylIOKZJPHTd1SCGzCCOCKLSDEdlZrhNSiXwlF6MP%2F46ltyi8bdJFWJsI9y32pdyRg31wRVh98YSgNXN%2F7ez86b%2BpJy9lT0gsYyAUBfsO%2BIiLy36Mws%2FKXjcbBeApq4yaH9lUSbXfaPTsvgNKcAZ6p00mIWU5Rcn%2FdRA%2FC3R7PMopDBoZbc3dQV81MfVpw%2B0TJg4AxP7g6a0%2FJnEN%2FNcUW8G4v0QFCmQxUm%2FoD0ZrhlE0%2FL3PWZKyA%2BnJ1iUNkV9WHSPhgDn00m13ZGGMk3eRcndvLll%2F%2BD4IDTlpXWAihUcUv76%2BJoKnQ%2FBer8Fa1Plca5HY7ebBBC%2Fm5pD6pjp6aXC9Frdgs%2F%2BLrlZjb2JdDrBrA9hIfiF8GPzK5HjTIgbykYtErcyOj03zEJsCpMFviyIwvIjXzgY6pgFNqbnyEMCMJtOMt29JxN1vAn4md%2BEmA9d7Kx63aN0qCHNO8h9A7MCQhHAI%2FG3RG%2BW6vDijRc8dfJXxC4Wp3990GNzS4nRboB1d1aQEK3Vn6mAN1g6CAC8faFlahLDe763EyxEuukFc5YDKJX6NcmJqTU5ApY6V5DQXitICZpXeo%2BMqwCTozdCu1B%2BRJgrzV8iA6YTzWqaQ%2F%2F9%2BroPpwevBaw7sKduK&X-Amz-Signature=046c40f19beedd7f2747286bf22b243d3a74c3b760abf56e8c467aee5ba9c17a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RGHI2HMP%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIEy4ZLVoC17OmxcnBC9%2F%2Bv0b1zOLockHwI5OqYajfKWUAiEAsgZnIx1DlBNFaVzgXfZOYqE%2FGCJqZpP9mI4cNEQRtB4qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFt517c990YPJRsP3yrcAwTGhni5%2B54qL6ejS%2F99QNYFSqWk7yE8k3upH9baWxtF7IfX059iVyMXmzaN257cg4LvWhjU0OCxF1aomydNWs4tz5qDdQGSSQO2EUNzjh5jMNpe59npcJGQzpgwfUqJGe61rkHe9YIRfMGE9jIYNaV66VsM%2BNe7qZNVsCisYVVOhI84vZF%2FHKcYjrkBlRPEzHkpJifFccELGB7msugLw6Zst0MeIa7VhLCA%2BJIosEIClZeLIuTyxsPZTpXNonKlpscC4qigQZ%2FT8OQBA8FFsgo2GsTi3xfQw0VTs%2FUagltiRLGZDjexTkTTkbXAuOK0XC%2B4fayF0w2lDLEJoYB3%2B6TH7GFpfauLBs3jVwvqw%2BH6MY1gjpv7C1HtV0JuKVx0JpIy9ef0qebci3w5g6yAbLMjQgicfVqGjIgdjhck7F6y%2BxMVV8i%2F9Sduuuif8IEYZ6MHKSUmejGv1tHi5bGyHMeorQpKrv3672SbjcO3HlMy5r4K15IquNeV%2BDk5wpPNRYUlK6uoTiFXwONwiIVamf66udWOORyf322dvwPTmg4Njq4TB1V789C0yMp0DzxjoS%2BeuE8V%2FqWI2Pii9CnnSHguRRtsrXJdriV%2FulSnjvt88JmPNtAYcZd96UNLMLWH184GOqUBiZqhW%2B7zX2YpkxExec7xK7ydbjX5RsG%2Frx5bsMmzz92g%2Fo8Ngb%2BXSIGRMRM7Xd6Cf%2FYvcM1SPtycc%2Fnk5A4g6g2tyPUzg7BnANvdsnRMNBjWMJzDeGMtKHmDE0uvjMfehrRob1zY8dOH5R%2BE%2FMIsLfoumceX7jDOtmfTkq0%2F46xWZvIDvMOplqATqEyERJ%2BQxMPxCqCwFXHWpvlOIwAfXjH0T7vE&X-Amz-Signature=9724167a100478ae1ec3e119df5205c86191c63c20662b9a52e3e41cb09a5f33&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YLWXWAK3%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIBZKkJIAmvT1Ke9JBash2yztCL7eKXd480h1gra65HFmAiEA8zdG1UDUlt%2BpkcUCEfomyj40qXEqzdDVy0p0wE%2FLPWEqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDb4QBTHjPYvUXf0QSrcA0yy27KC3%2BVfrkSYYpkaVwoeDJUJuRwR8Jtqrt5jVOynMgPSKD58BZnsHhIZFwGGR%2BfR0R%2FkEYPoSSTglmMpXI6ntURawQjOQgAJUBowoiFWTcec9s3WTarKzSoKS4ufs%2BbIlYQmMQFeil2lpUBOMZRWljUBLxvsZHQHvvP6HxcuXh34%2Fb%2FY6%2FF9rQAD2T%2Bdz5NBHcWMn4N6JMJQ%2B%2B1rDMupYJx2%2BHWb%2BlGtG7Z9JNLmwO5ILLYUmv8kq%2BGzFWbQ0qs%2FWXZU%2FYsOGIEEcrkB1wY5B4N%2BOljnNTg7AC7gYV%2Bq7aKmWzEdYRN55k%2BbgHOHLs01rIitV64GL3AcbJWBmJ0kRM3AXHIOQRb%2BNXNEzEWgVYZHVaLjRT8frb1js7n11bNqOXp9lCXAAjnc52kwt5GyTa0nwwADuJY3ZnHZSXWJ4Fv6vjmA8GDWhGRuJbahVmtL38kcTedeKETGz%2BujT%2FPaqC%2BG7MnY29Pn7WXPZ%2B6kvS%2F9O9C6D9jYXmeCwjV%2Bpp4Ug3cjUZURt%2FZIWGq69BsLv2%2BHR4fFA1OaZcQJngikhGBoCrdM7Rw%2FOPP%2BCBxvCYAYx7q%2B%2FBbI0WFmPdFFpiaTfcyu6WodCvN5C8RCdDx6ycOcEhOY5%2Bxi6BJSMM6I184GOqUB0ouXJ1Rlv9e5MlH%2FEYxnN0Y36YjhJotS%2Bha63b0hi4Zwc6CsYq1409KXsO0VZbME8INIsuN82WDqqyttAvNiBQRXE58WD7FUZy63Z4%2BHB935RJVXjfcOmN8VqV63UlBP%2BGPA%2F4yJ%2FqbBG5WMEb%2FfvwI6n6Glt7KhjfbstwasB01pUT1ynaKI8JH9QSdhUZKLATlJwU8yHsY2hG31LmpNpx4bHSue&X-Amz-Signature=3e5897f5117896e26d6d9426bb15d35bb06b86a235e8df3bf84482bde83cfab1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOS3L4E4%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQC%2BweRxJu%2BbiUd1VYmvE3tSGfgvz0vjbFDG0oJbMgg2jwIhANudhyASNqUJObMOFemF%2BCqw6Vvkj1KKNcCfLpJdqFBNKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwC%2Bw1of9H8g5q8pp0q3APTvtcRP4eaQ0vyka8moE4bRJMs93%2FVM3%2FMPxBYjzGBIyLBe5YZpBxLkgOk4U4rXvG39DmWYD8BmxDHbEpivtMDN%2BK839Cd1uPzTUcMHwfVmM6wGORNgKYHhduRL8MeX3Tv%2BTcd6C%2FMSFvh8nsCPIJKGS3NjKfj%2BLhCPQKnXSk5e7kE5n6C%2FE08PC7riN0ftU2ONV4k0W%2Bm4jsN6A5jThdC8KL8M3nYTgvGny63f6H8wMiycT%2Bxs3HZe6AlHQHR4W9x0dM8S%2FNzDzMR0N%2By%2Flt6CxYT%2BfWxzp02JlClVrViqczRFp6aixcPLe3IrGwnDrxMT5duC%2Bv37triCkjkGmWfT9T6z9RuiKoMozyiD4EW%2FApmrkvArEjx1oDDoqrFnYx7QUxiHKWPAwxSbaNeOunk8YgYR9h1%2FfJubLqUmq1ZU8o4HOL0SuDWvtx7i%2Bw1bxfIbBl%2Bm5WSwqgBpXgoBzRfxgRib8SwxOgSUTY4IF7h4bsSxBViKJ3b5KXtcuoztZKBkSkQh5FwykYMUgrj1jiJ6eO03F4Mtx9QRS42h91Bms1mNALLtGD94wuJ4kAriVKHt5IYb2A7RUsPh56VSB4wc5fuaP4uCQI9M9yZha%2BSRHB%2F%2B9%2B9RATdfVYv6zCJitfOBjqkAcAtO4B8nP7fcqiTOAEyqG0%2FuhPLI9R5v0tjTMslZAyu%2FHYQTUWqGSWuk6ttpLF22mHR01vWxg3esabruPY7yjGQnByy4UuoNBg7%2FHBkBRwfOaklvo0pBEmJqKPB9F7AOapPRjBjTTFbFLLbeT980RMIf2Yw%2BpbfXQV6eyXsR0T9q14yDvMnLUrmo22e%2BJl85m0rpK80Dnx6UwF54NZCfwXp1951&X-Amz-Signature=7b2ad37c51d6c2734bec10f8ba495557b608a9fb4d4da34e2e0c433240e142ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667Y672KXU%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQDafhmyKQPGqTS7ZJ7XX8SZc60uOWK0pp2zqZ0hcCvCGgIhAIbeJ3oFtBzHyWNA6oPxpZBbQYbhmL8RCmsBGZj5%2F3DIKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyVVVDLd7ZlEQZ5V2sq3APmJwDzI8sidiVLkieUv4loRajXza%2FlqVxpSQ51%2FhTf%2B%2Fqg3DAwezCQmBBLwz76etI0Tcs5x3fegDmXkRfuHC4OLB%2Fw68PoVoBynK7MsjeTDQS2lB5DZo9L0bWbAthBLytV%2BMdXShTm6D7mBmDn8%2BNqLaR1XN4%2BaxTVQ%2BicwI1Sbl8wZaC19A%2F36%2B40OsC%2F0%2FyBscScJlLtdA5dMcEP3UuwK15F8VpzeQv091gLkAUJxyLkPbgGCWtRQktBIw%2BFD1jCK%2FOY%2F5MUu2DeRluCWAHbfS%2BlCKZuDHj5YoBrdZf0PRYQh6NzL7SZOIgqbY65n1QOfy9q29aNprAT4MFjBDEb0BLIVnI2ViYTn73bXHDHe48pNbdOccbHiwsEhwq8J4VT996vJmW7XKkfYkZME5QuTm0EI7PJg9BeuEx1kMJNOUpnqyDFHK5nIc%2BP57oKBFaJlwcz%2FN9n%2FGQNRODHyP0ShxMxLHvIgeWTOE0pOQn%2BUfvma2DGtfl2JLfWfjZ3aouB3C2E0CV1zokWy5xI8yx5hKnfHOPGa4xPfE5b%2BlAlUm1coRFZlQl2Km2dwefZtfzkO6JVxda4WBjHc4AKHI9IB4mGlqtN8W398K8Km3%2FVo21VFgQKFweiKIIWITD3h9fOBjqkAUza4VXSK%2F1vG1KKjvURgn2M%2FDKf4ng%2FjdTg16bI%2F6qTAe%2FUId23CFk6J5en%2FYb11BO0qYBHq%2FxPRIbzzKitqRnMsI0I6Z2Y39n45cwcYFkpjjfuTATfNutCjrzmtClVONPYsOAoyKn4jo2r8KM8VfwqZKlmIgBGgMDIxVfzQ0q3%2FWKXVnTdbyzOXSUaRRsbfRLkgrldkW32IzgTqPJg3HomGDTZ&X-Amz-Signature=3d65278a2d5089c4120e98e4bf62b42bea37c98c4eb7264f8e2e61fcf4d727d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663WHBECHH%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIBk4xvPOdAV%2FglHtyI1NHfB0XlFgtPsKfOL3smKIgSGZAiEAxxQadoCQoOiQYtkU0Anp9y7f2kQZ3gaGJSKx7IU35YEqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOzpldGBrU9cIPnNHCrcA3GzzZ%2BmE5W0WRrPOOzH7dlbZbd%2Bv%2BQWPveF6D3KmhWXMCsXUBwDe6k0oEl1kX3U%2B8fZSUmbaMyqa38Uqk%2BEB1LQ15m5cgMaE1o%2BEudSfJmjbVdg0H9wOb%2B7lye9Yg03%2FC2kRNDx8b9GDjJGRxgJ4B3g0YhgkbqzEY0mk5%2FNXDP%2BKgNAqr9cfjBFgVpMWvhXefXb9G03jYDjn7U1%2FZ%2BWf8%2BKHymFl0Io1c52gZIv8KHi0vjdzKZ6IzWEucb1BjouPPee5I1JXD2wfEXhzXs1Kbadib7DK0NTMVVw6WuE%2BdzUA5TL53Xl7gbL%2BddqGcEdoytKxeBwjJp3y1s5qNbWxW0soFxFIwRmc2WeZ%2FRH%2FEfm9MTxmyJTH4ceaUVkNSYwdSn3JIdG7KwSop%2BJJQzKOqZL9CwGNpqneKTbqYH3os4NbIGCzr3uvG9PRxp7oFL4Vobb6exI06DSEjtPwg7LpYYAguyFf4iA3Oh%2BIDCkLAhPvB0qi98uexBKE0MS7DcnWfiACMjH%2Fcyc7nYDKK7DRiRW1axQ9gSKdDKZXjBJYiTQv5yv503enefN2fdTSqYcJBjCMvJtDSV48JzobbDEJXLfjawiVeblW%2BCJGwuNUAkWoa8TK12LbKuXRRSaMOaJ184GOqUBVT%2Fhsk8gJZv7GM%2FyddqbxivlE%2B215B%2Fe7Q3vcFQul%2FEnXNY%2F1HO2CHQxbO4xNlHfpeeV3DsggYWtzbWfBVd%2BWAqxFsFiZZ1Myz%2BSQ3w0fhQ7V%2BbgSwD6suHU0IYzuBPGGqEj6%2BgOciyBu%2BnDtp65QOSoKISpowpKO5iClnc2bjtXxUhwBW1CemdaSIFyvkUhjFJghjVmh0S6q42gJUxIgsZKL5m%2B&X-Amz-Signature=271f5332db1fd7f16fae213f1f7408e0e5dbda08fbff8bf040ad12624ec6a3fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZQY6QVND%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIF5C69pVRCQvAhvhSyheCN2VV1YCpdT6CLXff3rL1dW2AiEAqSzQ4cRlLNGQps6rD8U7kXyFZmP3KMsL1RXuepvBNy4qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKFcnOGVYhQaDsmD7CrcA8sazEu2Enz2seRS%2FisVwmZnr%2Bu3MdGVcKWzw00auIyjUyXDoaXSflsKiG40NhQYIJUTgEQgKweXKoEnnHaJUYSJ3135nl0F1SJpii3HGprofxsKjGdSZqhTAONWD9201MLu7ZhYyPPgJ%2FbYYh1JNMvPDXptaViVper4vbCRSWypBV6wpypUi6xwoDoh9QQEFHgP5gQ5tChZHm5s4ZO2fN1K%2Bds28%2BLm3nMaN9H0%2Fx0%2BTDiyeRt%2BqMapRysyY7UQ7X5X3ZhteufmykZ8EFljC3qDoEie37niL%2FZPdI3x%2F8g%2Fr1C23ZMKLvbvGpEvWHcv4L82p0x2aNZ2KE6zc%2Fcrg3BBfkmn1XzJXtPQX56B%2F58b4Kow3I1FU0Uwp7bkRxa3NfSxXQOedf%2BGmFc%2BmuZusNrS25OBvYZQ2PQXi8Phbs2TpHHUvSEApOEb8FrINShZWyO3rHh3Q2JzfEv5hZAHgdhi4cfhBXA2GgM%2FYyoZ433RqzWKFSx8nWUQVp%2F7k4uPYOYyX3Dj1%2Fai4erT60imtDPqJ6kYZA1qLgdSgdIMiSr4rPadFZKDW0%2FOpGiiuEz8pMKQGCE%2BKnrsLbegP6KwD%2B1JpvsVIrcHuxt2yPNvaqzzJ71tnypqWNMHJSnuMJ2I184GOqUBYVkxzkN4dM4Qct3YGHMCFxm82hmt1hc2t8M6Ckk6IBWC7nEF9TvixRAAa5MbrBUPj41aX9RvL4xbBSfDPkARlok5MbsoQixquzvEGsGs7WKneoAhU3DOvgNowD41cm3AE070Xgp4zP5D%2B78j%2FTZu3u6Hq21KxpIe4gL06E8XQKevUGobkaDRvO%2FFXZleFtPupUnyDZcL7oas5WE%2FwAYtKhFANwEJ&X-Amz-Signature=163d57ff2411c0ec7e3ca664394ef0365e5558b31e6732c96690edc44a9b8ba8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YBEEPIXH%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033133Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDZITh5rL%2B%2FVrVS0WHbxq4%2FbDLUqfUwZKUpLnFRYPEZcQIgNT%2F625ONJNKk8i97wZEpsJI%2Fxa1nD%2B9xsbZWU2ZFVY8qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDN1hi%2FeBsRJpQLvhLSrcA%2BNEnoT2Kbm7vFOUTO7k2LEmIvkQ0XEuxIrHisWoA5%2FgnwghqpMzXpbssbTFSS%2F9m%2FY5QjV1juz%2FAHQ0rc6cdpoJS76K2rwVfqEtyEqYTd5xKmfN8odeB2O7yih1CxQwEzi2RX8DZ%2BMm93F4Kq%2FxdmglkJiKhRyuXEu%2Bhxn2pWpe9AM5Jdy9DiZU7MraqDiQ4UtbtKbWHJmRTwejrkEStI22pxasyDFCYNb3Y38qbQRlh0D4cvq8KJBkQvFJcgihisAg9ZrT6l70oBYmbQLYm8lntMChfiuUZa9beoMCa3mxhI8Ne0CJnaELEI2HZUr6Xet24xMZxC2O8tsLEYr%2F26lHiUyOLk0dIWbdKAr3Wa3NGUvlGxXv4OX%2FllDZNOp%2BBBRAYP2sr0bMdifAdPQ4gTEOgISsi42QWGwzYFnpsyfdRpKtMcm8XtkZBvl%2B1QXlHsN5gPArgc81M9lIrMzCK21sLDa%2FR0A05gVolOj%2F0myefPr8mvrjAV3vevbUuFKMa0bXq4HfHWezIEUCUf7Tc9kqsW8xXWBh45TaUTnF8QgEoaIxaCb%2FsL8wW6JjJljmlln0rr6%2B0Njg0iGe%2Bz3M5rLwvVBzMlssU0HmFNARckjjVUBUltklg0rEO8oWMMCI184GOqUBJCafRSsUNxFgFSR8Dp4AdpKlsAIJ1cjfWpOs9PvcVCz%2FRoTl7I3%2Fjn6mGvXqV7fhNWP%2Bt2MTNc5eH5AbS%2FMXry%2BrrYoLwmAO0hZyHLAxm6PqCW5nDqXtG65rcUUTy7tzst63Bgd8O2MUTTmObeDzmKnmcqlCXmj6%2B9FNqSXn%2FwFMOEFg4Qmio9A8DC8fLAoAWsx88yHrw%2FBB7qfgw9A6VpyVPEUS&X-Amz-Signature=b7b0760ae503995fe8fd190c9a2c2f4f7295f7cc35e13d41fb00e01245a7f656&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZFDTOT2%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033134Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQDFNCHueyJsW7zbzkwm%2B%2FQagcCAh%2BpzI6VuYE1tbvnC1QIhALTwOAAlneCyqKdn9Sq%2FIJpwMjZhKzB4OyGKHdlVBIM%2BKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwHxEsVmdjxXLy4rWsq3APSSvKtMWzk4eYEtBWBdPj93ZW2P9bhXZOqIdVLnITBF5QYQOKvzUzMbMStP73Yn2tilDlDFTb9zMB2Ex61rp94z3w0lf32xa7BUEY4JPMIk6JF79%2FMpnGI9IncysUbnaiyWZoSq%2FvO5Mk6dCi5ns2Vl7V1GJKn8Mph3Hx8waA0f1dgRw%2BOC0apiP2pPL%2FGuJ%2BmlSTLKZwFmTnFtDNUKmRPJd1cxmnOkn23ALA8NR2Nv875c6k0LZvlmcfW98%2BSRivNs%2Bl22iiGH4hgzlMxHMjQyabVwf1EwlaXP%2FB%2FGvIEC%2Fd8U3B0VyXqq0lU4NkzzoYgpjfBw0VhtD1GCAzxbtEqfwitOTU9rFeNLzVjZSuij%2BAysFjb3uV4HZkbcjivLheNbF%2BCfCIxG2vLuaBU9okmNVGfWhp5LT%2B02RCy%2Bt6zWYFSNeBG8dXiObXv%2FD1ZzQKqbIzKlCVjzTqK4qrYN%2FKbd8iws%2BQ7VNoN0oger8wZgLS7ZtEcDizmlIs8GPJRn5vk%2Beyg%2BYt64p0bwt9uP7%2BXfpMDWZH0UVKOvF5zWOCIQC4UfSOn65uJNBY%2FtuCl%2FQSimh%2B%2FF6n364uBnhtvP6f27e11ZaSYp7SBwjqGJi%2F5%2FkCOsXivRFzM9ZqdUjCyi9fOBjqkAXPfS%2Bc0ku5DUgvX2qmID5iZ3KJ75kkl6dz66zPgZFITP23bsDOQh4CIa9wCVIneT%2BT6uW9xe%2BOTKH7cab8hSeVIdOlIzFhkfZ%2B67YteWeYDk%2BGJ%2FRleoXgzjNX2yXlxEIL%2FJ%2FVilAAiUjz84vNqIM0ylYGLF3qxEzlVDF%2BcF%2Bw3ljfCoxqI%2Fn2cbLQx8DwCUSUrg2EUMwafePMcQSYtnUpsfIoZ&X-Amz-Signature=b5fdc2f0e5333ba5d189e2217a4351fc31af618b4b710464a5e0c544dfe3416c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3MOAS2F%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIFqBqRWagMxdYMavAuFpPajiRcPC5Dsw%2FjS1HafG%2Bz39AiEApvb23tp2Lky530ZmLDLWgpmqHH4jQJSUrN2%2BPbgUPnAqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC4stvsdWjzAROnMYSrcA1hrJcHTjepjdc1oFyIscv3MD6RokhN321JhuGcYK83upXejCaG9GUx1BPL3dETmPFU7js20LF88GfULbNztNVjwgIqjfvgsDGYuFxQfbXVAXfXv3cMNDHTofLQVI07QTX0PIq%2Ffh6fYskRw%2Bat3olruOpQ3WPE1RiN5QGxV8ypi8r5gH5u6jqB2A2xCCi0Ot9yhSfZm7nvikXk6sKDJ0eH9Bs6EFRVRjJI8EAPjYxZmTf1Kr41nP%2B3fkc79yiqpEqWw3ZORLN3C%2Fbn5kUA%2BU%2FuPqDMesEi32LGNCuAtuw21%2Bnx%2ByGXVjCpy1Lk%2FSAbQkl9vEeaYJsa7QH2HKIul4im5pMbOFDqTg6fuURgTBQkNkyECTAcRc%2F8hnY31Jj4ve%2Bc8ePnuq7chll0srNq1P32wgOrZN2a14Ttl%2Fa8DuTb5OCfV%2BEez4gf%2B3MROTMBTijc92naXg8g33dSTo8l%2FhyLuFMaYY4OJyF3wz%2F6KDCeUSaxIblhMUY2Z96A2rmMn%2BJVhXuTR2vb5s5ZRn2Ecy2JUxYx65lAlNQTKXmi7MSNHoRHvpysbRXtqI%2ByuQiEt%2BzqLKgG1PTlZE6rI%2BXVPgNGr2bILTgc%2FWBrTakv1Io2RlNIdr2u9l%2FiXUcCpMPSI184GOqUBxtPAzA%2BvMRYXtg7MeQLZHaM7mEy3P9TMT27JfKIIhOgJL7FqrjzMILPRqXIKp%2B4sRZPILF%2FJlJ07ni8S3n3260HNtYKmrr%2BsmI4bIt01HZzfUPVfi2sak1lAUwiVs0tPOl32dXZ5NibrwF01pYlhkYCmtPWVdNWAa0tZ%2B0WamfIme97zVc%2BVYummp53uRvYWglmVwD7XaYhChIShU1381Wh0qDqa&X-Amz-Signature=68cc9ca1feb18285e3fbc7f5b2d9ff121905a86ea9fe04815e51d6a1c06ee9ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TUBFELUS%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033138Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIHVj9PwM%2BR5wF%2BeJ2pv724E52Cdc5wYnxzOdIVocSdE%2FAiEAx30P8B1EieUvEjY85Xjk2WmCYBeKyUOpya%2Bjs4rTg0oqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPz3eysh7VlVVCwK%2FyrcA8kI7gI8SmJmX5ZiMNiqKagG2qDZRYjeNP6My0g2shE%2FQzX%2BW%2F4xbMYmHmJ42%2Fzfy1H2LzyY7XnTdQmh6v2Z1%2FoivK8Pn2AzF7C8kOGu8yLza%2BpJHp4q%2F4SlmDXY%2BwCwotW%2BXBvJ6ebSTS%2B8S2%2FDI3xtdd1CN36DKOHI64dbf9rNvkC%2FctAJ297LNO2tuNhNFGy2SbkjkXvJmzzsxAYr1397EeaYUaOQMBes6YP8xSlJGtHDTtLvqVYjocS7qcgzrnIWFBp%2F8SujxQ0aZHCWW1CPyDFnjAJRQ8qbkaspSjTaksXYntkEhNc1NYFoq3mnvqIDaJgaCvezUQL5jHGnczwqbhIQ5JbbdgOjzBB%2Fs8JnT0miF0o0icid7hMuvg2tNH%2Bk6aZhEVj9D3IoaXIb%2B5Zwkgko%2F2cQxP2TxPL1s4ykbqhDk7KD5OSMaQg4arb%2BMtDkeK2q8457jCI7p9iUQitEaZBeKwHEUple1E316BiCCha0F6I0rcER2SCtN3U%2BtG6gIPDJ6QesTVKIBDNy3nSJIA8NA6H9K77NXxoUe746hrYMzMqtWr7TZx1PTrUgWH%2FD0ikIjfe0iv%2F7GnnkF5CufjaQb7WWqVm5Qe3n5SRRyN4CWx%2BfnrhF8FlwMLuI184GOqUBxQoOB2r%2BAZ1Nct%2FEoKYJjmIkpU%2FxtU4xtRofj36Nzs6HxrCCz49om3Uyak6Ncijhrp3XDFLP%2FmFxHkXvRE4XAvZ9xPClc7rfEeD2BVfWPN1xf53gSXXV1wuGmR4BVkOG1L7EoGnRXadhj58fUdpVwgPPHAUE6kV1rbjFBHCwvYa3rfGN86zewSvXCiKnkHJO87%2BFBR%2F%2BQ7sJZVlSVD427m9EdQDM&X-Amz-Signature=06f1a72afcf6103304c18d049902ffe4287a2166eaf65254efb76ceb07fefc8e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TUBFELUS%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T033138Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIHVj9PwM%2BR5wF%2BeJ2pv724E52Cdc5wYnxzOdIVocSdE%2FAiEAx30P8B1EieUvEjY85Xjk2WmCYBeKyUOpya%2Bjs4rTg0oqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPz3eysh7VlVVCwK%2FyrcA8kI7gI8SmJmX5ZiMNiqKagG2qDZRYjeNP6My0g2shE%2FQzX%2BW%2F4xbMYmHmJ42%2Fzfy1H2LzyY7XnTdQmh6v2Z1%2FoivK8Pn2AzF7C8kOGu8yLza%2BpJHp4q%2F4SlmDXY%2BwCwotW%2BXBvJ6ebSTS%2B8S2%2FDI3xtdd1CN36DKOHI64dbf9rNvkC%2FctAJ297LNO2tuNhNFGy2SbkjkXvJmzzsxAYr1397EeaYUaOQMBes6YP8xSlJGtHDTtLvqVYjocS7qcgzrnIWFBp%2F8SujxQ0aZHCWW1CPyDFnjAJRQ8qbkaspSjTaksXYntkEhNc1NYFoq3mnvqIDaJgaCvezUQL5jHGnczwqbhIQ5JbbdgOjzBB%2Fs8JnT0miF0o0icid7hMuvg2tNH%2Bk6aZhEVj9D3IoaXIb%2B5Zwkgko%2F2cQxP2TxPL1s4ykbqhDk7KD5OSMaQg4arb%2BMtDkeK2q8457jCI7p9iUQitEaZBeKwHEUple1E316BiCCha0F6I0rcER2SCtN3U%2BtG6gIPDJ6QesTVKIBDNy3nSJIA8NA6H9K77NXxoUe746hrYMzMqtWr7TZx1PTrUgWH%2FD0ikIjfe0iv%2F7GnnkF5CufjaQb7WWqVm5Qe3n5SRRyN4CWx%2BfnrhF8FlwMLuI184GOqUBxQoOB2r%2BAZ1Nct%2FEoKYJjmIkpU%2FxtU4xtRofj36Nzs6HxrCCz49om3Uyak6Ncijhrp3XDFLP%2FmFxHkXvRE4XAvZ9xPClc7rfEeD2BVfWPN1xf53gSXXV1wuGmR4BVkOG1L7EoGnRXadhj58fUdpVwgPPHAUE6kV1rbjFBHCwvYa3rfGN86zewSvXCiKnkHJO87%2BFBR%2F%2BQ7sJZVlSVD427m9EdQDM&X-Amz-Signature=1a7a40579f2b535a8f781bb580252fd9f5d958c0b0937a2a17194e9048a539eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
