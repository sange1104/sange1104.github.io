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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667K6VNOA5%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIGQGS2JlKuXx3ZrngxD0JTQ3OLh%2BDH1Kk6HJizGxHyMvAiAw0jTqVFhJu6tnQ0hd%2BZliGmVGgpiYNv7ANDdahs62pyr%2FAwg9EAAaDDYzNzQyMzE4MzgwNSIMaSshaSqT2GPcleMxKtwD%2B%2Bc0EbP815dm0CPiinvJQ%2FaJwfPxhCw7NyfpJRm0%2BJCGxD2uy4Q5z6A9WCIMfbW9cBled%2Bhs%2FUpNUoqF98%2B9ZwmX42EjqiqBJOBzyc2JbLLo2%2BrtRuBX4fUD0ZlG6UYp7a6X7XYUcYzV9mE3soBJVflU7Pxyw9tn8IVDwMos2SE10ayZLO1Q4tyGShHDoaxYIFf4san7oxajrJco%2F7%2F1e64j6%2FaORsqTc8xu5vCNi%2FQTet%2Bdw6fAscXPtBf19gE%2FM0Pvhfm57Rj9AoxVcZuaM6zYtZ2ybe39qL8VE5Foz7FE9jSilz3k2DFGlUdT99CuEX8lq55iG1TuY4nm46fBMIr8B6PfPCYjpppFSjJMRZ1aMpPO5BFImmvWiW4gNN5yslv803o66CPB09HNNSyGEBcuhUZ5ht%2BXxmzkcjy1RHy%2F3XB%2FrkzJezNNqmbifOb7uDcvHCkQIkhWxu9MDXuakBXXpP6NEPKpZDKMDHLhdnplUKCKxZoRfMS%2BdUfAVyxN8XbYL%2F8rVFJe0hoFKK4N%2Fju%2FWu%2F4MHofd2Jzv8PtqDA6G5WsyC82TRnkK7w6QpyVRVDsrNznDQo9cCzJ4MZH5Q7rDYME%2FqPoAUXO9N9SsCsofChuuLb4fBRriqYwzeWP0AY6pgHszENqE2wTsgg%2BZFeGCCOhX038Az4zudOyAs86KOXvtO%2BpTFa3wL6sgQEnU5XSD%2FDhqLddz0IhsVWvTJjsoYHM9faKIZiy6gLGXYuJ19IbT0dVNLsAnq%2F8prbOUrTZQxb%2BGCSyU7zIS1m6wjzkWoSA3uOw%2FiCQ2%2BkASAZbnfnsnqdJW4ICV5agXVCGUZgbb%2Bt05IbR1Hu5DX%2BAS15wLiEUdORIy%2BZK&X-Amz-Signature=e4aac8a589fad10c09bdbfdd778dbc6af42b4b7e2c3963b84acc5cc5edc8e262&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WJBEMFKF%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041158Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIH4D3fXvNK58CeaFNFGa%2BvRLkOijuokPmsG1dNKyq1ydAiA9gD%2FkOGoOIHxnOAsoc6tCTrdtcz7QmsSWju1fwUQCXyr%2FAwg8EAAaDDYzNzQyMzE4MzgwNSIMWsuDoe7TsGLiAl0tKtwDVGqqtWn7CSRIlqP4mNq8GdfExU4nIBAfMvmvOxBILoiZZyaYC3RYY4rUSZN6qNif6VMZKvQpuusFTIdJLNuv8wIXsAR2Zauqrk8wKgeCKzrschLl%2FpP8IdkBp88DrvuwvmxVAbRiczKPb2RekcBTjr210azasUfUWCRTMWYDQpjKDm9IJmFV6aKCMmDgRigobYaHqZdZBZ1R2YCMFAxwRzsvDLYrIc5qBvWYfHdPdatDAglMa5XtKEqe3JpO9A9M%2BaRc5r%2BcqW%2FIQTPZCUv9oh2vHqpC4x9oqlWjIxUZsJGv%2B6XxYUCVuIY%2B8GmjOWlxnBJD1AlrlQOkF1gWPOXIAO1H0g2nAv9MVsTkYrqIdpDYWVqUDCPwkfMlF8SmVzYd1ia2tFg%2F173epPef91hrmMyhAgAHI0Zgdg523tti1dMpLbsbl2%2B7AMHwbCtWXayqaWp36EjUDRsDX6jR7VFxfo3R5yPGHS1yRjglDzhBqM8fQA6%2BT%2B9DLRQnJ6G%2Fj9AMIrfb9qHlV2QIfTpgVyU3n5hFxRen5CnaswtjjRZMKLXIvEKda1W1QCw1W3hOudcnffmN%2F0tUogiN5r%2B7Sx6vYY8tQlhuKiwyO%2BowgoCUk%2FqIRoh7gWru3ecGnOMws92P0AY6pgFE87dcAyEmINCwpjcJCoexKuvnluzj0rzAqCpIWKBB04WNqVNEx%2F8%2FKe1vPRMtWoCG%2FpG0mEQuW%2FJn5yxGKhsJgEetFnXsmHtC%2B87MsvOBdWKEzsSeaAxIBknyrGk1sk%2Bb999QnR%2FvkBUsrHvjhzt4AxU1IG2pcPcQpM9DNR46S4dJdrOqElTlJ4VzlsfXSRLduQ6D2zmtEIuH0dcv5ADAhNf5VrrQ&X-Amz-Signature=b79e20b4b6057e4d21ea1a71d2d88440b3b0679d293af81f957923f2ff22b98b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662KLGP3ND%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIE6bJcs01XqwPAVZBaAoI%2Faqf%2FE6NxxGLfITu0d%2F3BxwAiAuY9AdJL9d24yYXBjw6rym6JyY97CAvEY%2B1HYlThBWRCr%2FAwg9EAAaDDYzNzQyMzE4MzgwNSIMNoHWktdLbr8LPgBtKtwDgGrqGN70Rrkqf2XZ9DbY7npyCVxbY38LyR9e1Ywgb%2BUQmzFZUT%2ButG%2BEciwH75%2Fs2hDyvZ0Azg596BN%2FGKBXlEc%2BM91SxXxu1drCyU3jvyOZvvYfw2pcaUZL7AmyBwZX2%2FkRV2WRRoD9MtP%2BvfLZ7sWUHJ2SVMeYfY1hgHJFZBFxW70bsY31TaI3jf5vQhrErzuQjhpGexUSvQxeuMqgIj9dE1xIi7AsCcXf%2FXvGMewNAb3GGqRABNHPE7Pq1I%2BJsNKepSww7UvChHr9gICQf0C68SNjuNX1lUgdPY%2Fb1LGJ9bU55yWRwqUONGrPVxVD5D99yomIjTTPCImm5CMr6tLPV6YDpARuLxGsRQfFCZEQaFZvU2CsP%2FSQNN51gragd9KqqWkEG5%2BEemRTiv6Wy1hQNUWQtKXl%2FZZ8EMgloXjw7mO%2B6UoqV9W0A1NL2c6utDBnKff1dvpLtnFBw9B9HN9fHD6qJv23m0PWSdx%2B53wygnGL2%2FCAF%2BvoDr1ilk7ZFad%2BpCY%2FcD%2BtoU%2FisPJ3o2FwZNDppUYqmnFiXATLrw8NGfRwA10C7zZtW9fhesX1JkuZTLaL34VzbC%2FTpW68xPGQYaQ47pp4vPHqGvBO0vfec1Rb2KMtwHxhzH0w1d%2BP0AY6pgHyQXQ85KYn%2FYRgRBTHPKsW6XUOU0WuyHd0s0rPjdI89mXvamQPpYWfX%2BOm83RnEt1lWsfcZaQNKN9dzh%2BXbCzQNI0gNHgHSRmm%2Fnada6xXMHj4xiVGMIhfCbpRtUyjcmrxJe4Zh5ZkfAgP6SaSP5i78anZ5WDwTYPuyGwcWarI5yyIHn%2F3r3HisXbeqs4iou189HzJNjwX5A%2Fk6bLd4P4D7b3%2BL3PR&X-Amz-Signature=fe473f90dae6d898fa98de711b8b23e7275e0bb78b542bfb7194115820e6cc50&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665NGTFILV%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041203Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQC4grMMBwiSvkJYaZjAzjHBSCu3xRowfLQZPC3Q%2BnPKfQIhAOahrGx9T0AQheZIpibfYt775Q5qL96z0D3fSF45yHuZKv8DCDwQABoMNjM3NDIzMTgzODA1Igz6gONs9Dqs%2FV01cpwq3AMj9afecCnWq6Nxhl0BT6HHhaKYJP4B0XBDr0YC87GiF%2Bhpr7oVHZG2sI94x7pEVM7Utj8ZtGuputkKdkH5MQ7jWNeu%2FYgv29LJlZijPZZ6PH5Fr%2BP2n8gcsAnsIyArDLfl%2BKQ8%2BfJpOMUEcRLl28XBTBgg80YpVqI07blFu%2BZ5cHXRe3FbN6sjvMV4iEAZafHY0VeJ4OLDvMAHVXaxE%2BvxWW3Pa%2BMpMZy%2BpbVR8Bm%2BMPcjuMCkICqG8BUcCctqTkxtHtKHTO3ynR8rBYwAqLXg7l0Cd5NXZdHCtr9tACLH%2FJjb9vRsfyNzVYDNwJRYJ%2F%2BlrIK4%2BFW6LrwteKtnJe3a%2B7jeV0NvbfBR4IMq1LOjB%2F5r3SrPcBUZgdw9h5h7PMMRG%2FQ7HFyhPQoUg79%2BbU8Vz5vl5FozIPPr%2BGowh3MNu0FO2%2FDMrIliJFo8tO1TFwBu119hh2i06P2hX6FGSSr2panwlhvGxcifgsxwTRxbp7c0L2%2FX9Bs2QCFACWR2VvF%2FIfSWsUG57%2FTIx6E%2BlOaky21ml3nvqlgBn6%2Ff3vKjBciDQDCcdFtyxDJlCHfiPU6ppkHBrOcQvZcpVmW8J6FWggMVGmLr7Rx7aNoO4NuCstIohuScft1xjNgLUjD23Y%2FQBjqkAWhVe61MC%2Bmz%2BdxxSXlw7eml9M7I44OYHvE4o7NPFwZvAzDkEcw%2Fhhm%2BKw0HIzCqFuk7phN%2FDr%2FKMOvbZrdcj0M4kP%2B6vBtDFAE%2BbxJezoAVFdXJBHmIktrlhICCZwj2HdoXGjBo%2FfauNj%2BgQuulJ1IziKoBZe6IbBuPQx2IZztLh0tx8YGGW7yQDlwr58bL%2F4YrLk0cxEOXNrrw6V%2BYrCjOshX5&X-Amz-Signature=36e475dd74a4130f793125c31b1ad9b9fc016e13c9ce3f2712bc72ac65c14fc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662GMBYHVB%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQCepDAG0NZ3XQkb9v65CfOFLdiyZ9g48PvDXizCFW0%2FjgIhAPVP62zisGUti6IsfFtzvSXhkwBB%2Fzh0RVKC%2B07vIsv5Kv8DCD0QABoMNjM3NDIzMTgzODA1IgykfJbE2NdRspTJIZAq3APu95Be9XV2re89OWfB0ssoglj1Qt0q1VPl9DYo1cZuDJgjtpL0KGFUI%2FYziPf6CtWmYBpyc7R9alPR3Uz%2B2LLQ1EqWVtCjn4TUHeayhpK%2Fi%2B40Q%2BBbyY7%2FjH6thviriEE%2BoLSnmMKrPB3hrpYhbdaN5uPaOPXyylLYRnA%2FLNaXEmnoi%2BtrPYoQlertl%2FsX%2BTipjJgObHL%2BzC6DkSRRHfoViSFuiQDEMSKK3eQTlNBeQZX59vVpwv7Ju1t243ZDh91Y4Bxyj4JFH96tZALl8PBFWfkdljSVnq3WlpagRnJqj6ntRrTy88a2TkeDx%2Fu3EslUio7oyaL2u0Iumr06Ibk%2FkfrTLdf4PDMON1m%2Fgg%2BKpeXOQJZVf2bYEoGV9Gw0CGVZcUGkVoA%2FZmcuYwAe%2FZTUrx%2F5JWZrXs2wcazHAQ%2BwRN%2BG8TOJZiTc%2F6es9JZkzIuDJ7G00trzXrGHErZKLVapq%2Be8CYx%2FvB%2FPq7MVeHK%2F3gBvjXKBJ9tMBaB3YNrK3N5h%2B%2Fqc8waj8pePpCH2MDafRVjoqJ%2FGwmFj%2FfU1Qj60ENBYwij1pliYC%2B27ViqJcLXYSN7AvY4EASKH3xYTfxzF0d%2BRVwNNwyeaAO8U54BIWUlO7yG2EklEpmTYSTD73o%2FQBjqkARkSOOz8r1jz8nCuEndMMhaa8gtwcMSZyWegyGMjnoAxC8g7wvbRhpECmynxqnxlYfrNAls7OCdV7BLzfUw7sEBpmWz%2FPVGe4%2F%2FWm7wwwUzrVMR0NFit5cYJpA0W1EAvF9etn%2FIXhILGnqQu1ChNVO3Qe3gMR7m92zJUIi50GmPa3ma0XRzYmuFc%2FnvSwfMrcZQIxJVbgt7NaDM2DKKvzpkzWDAV&X-Amz-Signature=2e1431eb10f904e73ec4bb63ae15ca41bc4e484bb0c65edcd0358c08a20a2a19&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666UVRTCRD%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIQD5aOJevGyLDB579xGzflGaVMIfXTH68TWQ1c8gSeKu2gIgCGvWCU5KcK4VRtb1L9Z%2BPqmCnc7mGWKRGoo%2F%2BKCszx4q%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDLONb5b4KmoVe9yGjSrcAw%2F08hkuGGCK0m04uO3Pu7bpKtaaAyI3mrGFHlPimiidHhnz%2FpcWWIm%2FsjH3dpy2jZLWPrw3Mwq2z4RXA3%2FhZg%2BuwZiLGmAzcbdrnAOsAp4PZlXvyqc4KdbGV5S3X3RqlTbhnC%2FmLh5UdbMsS3nvNXsP4JxegE%2F8v16XYKNprKiEADPp0UNJhgeFJr7ht4iQDneuN7TqtwoCWYVFmYpoU9lQ96VuI4RWL4K3DAcX5nRvTC2yKjt7n4FIj7qyXyVGcgf3VkJMNecWlq%2BwrV48o65Yk%2B4nIhxSGTjv42yki%2FS2r%2F3fydNuYLHX%2Bw4WdlvMvi78e5YuxjivUQf%2Bhpl8za9NFHGltXmZ%2B7b%2FfqZEEnR0kyV%2BFM0qifPXKTC51HCwdidZuiwtXfyWYzrrQoZ5Kio0USeGxdIlOnq1ubC9kzWto3y516wxVMGVgUPoJXorU8d%2FgjRz8%2Bkh%2FxlBdINXLdCtWvACUpVFAam2zu7ktIWYKIIChRtmS9W1JoSXcVHO1lzdTdLz6NXWRFhoD37GFBX8c6Z8SDL2O264mw8wIiOszN6R4Orj3KMufJIVOUY62rN6y9A7yRI87MB2GsXVue0REfE%2BgwIj7GSBgMfNf47ln9V9LdO90VWZl3viMILjj9AGOqUB9SkSzdbM8YaaNdYsVjF%2Bi9KvBx%2B7IS2zS8mARNkHbw7bUqyaBhBz6LvqkuB6I3WAkj1llsWLIjq%2FQAjnNaUUk0dRmobaqwwYJs3TX0oROR640WIF%2FYD9Vpm1OGCMLzpUy5RsLQKiFct%2BB1bmjcwOSnUTKb4%2FST7r1X08nWYcb7qI528o0J%2BSIBfRwmWLM2J%2FwU0b0TdUzcFOgg0Ly3KDMTUgXVq4&X-Amz-Signature=d5f7d6eb54465d9e467fef003b6c43b3dc809ecdf2acb52d3ff12b0c3719c849&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKC22OGS%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIBAvvA8pvzfakbbj89Plutsi%2B6XH24shVEzKPzKUK9ubAiA%2F6kSuqeUUVrkd%2B5HCNJFZwKaGAEYr4WLv1XeEJJsMySr%2FAwg9EAAaDDYzNzQyMzE4MzgwNSIMd2tpCoidWYCNHxfyKtwDAXaLOyL%2FCdi%2FPtQnnQCByw3jVV%2B5KwKZaNqKlaU08RoWFaALry2X5TmoK%2FY1GrZrMvHaJMzqDwmluznMJFcD9JuRDGeKQ%2BwSJhyrseLpFs1J63mE%2B7%2BZhoj2EWtCpfX0TTlJNc2q3vowhn2uQSbuvv9uWgvqBOx8qZh84I07ijccqr8XnxAqHU1dh51fHwaNYNThn77KNJ2RhSehm4K6q%2B%2Bzum%2BQmhOp%2Fyzd9yo4BlfZ5%2F%2BQkTSkxpushFqlVBPCrtr1mcFuwMT%2FHk4V%2BTvQ1pV6EOdz9Q06Ah6EUSidBj%2F%2FF8jr1D4kUdEZYqBuWDIseKrTLRKF3vEdHyqaRfVyvZRVWf3cILQpfcUC7QG7%2FPoK9vay6nba48QDFw58R1bkQ2Jy2Khw%2BwLB8UqhnzdiuvKQ%2FP0%2FjLUBn9Eq3aiqEfNHWBaii4d5aROgeSsCQplN%2BaThD0N4Mb04XQV7q0kxbSLYKmAG1QVKEC2b8GjX4LSoVrIosRVPlbaRz6ohpqBE90MBh0gBk8AjFSJZPhGVFFv3Ld%2BsmNbYqGQl1oxVL%2FaKmYnr5%2BQBnmtTNDp2AL4MDxymyg8csjh3nPUMQGaDgzBV2KbmkzHHXBQeOqirRxXOoLwH%2B7dVc3HwWWEwut6P0AY6pgE%2F4rzH9zo6ktx27YUGK5y%2B7vuXQu1%2BWyExpT9ZkuZj62HL5J7Nn4nzJOihnk68AA1XprM7eSXZfoA6K3Xssd1ETKjKPguvPQd0GbypFuU7xEaZhfay8hSMli355LHsHB%2BYXH%2F6Y4Saxw06GAr4%2FN1I9pKoFWPSv%2F6tWcomXCArQPU1Bd6Ya8LbaKUbcD6al26R2qrlU6bxJqNqO2vwaNw7gX8yB%2Fmj&X-Amz-Signature=2ada8c08034e1d8c331422ba516104614d8c040c520a18bae8e34bd901686388&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4IFUG42%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIFdRJzMPEKxl1ZOmahLvWBOfscUXt5K8RefEvmFxalWcAiAoNfkODZ1WUjmUa%2F13p8gRju%2BvfzdLk1jzmnEElkVzVCr%2FAwg9EAAaDDYzNzQyMzE4MzgwNSIM1HJ3i5mcBiZuNqfUKtwDrEUazzUrnb7sXBEXrEbg0X5NQ23blB2bpMb5soJo1NJ1SgrSql80hHmzos05lNWcDM9pSdgYfXLNqPELtt1lxKl00ApxqPLZyXRBtGzCvncKAQK5fZyX6zd7Yelc3HGRljlGgmr22iGvOfnI2QtuF4yNwMSMSTVT%2BPi9bHZa8Fhks5bxdyhfKpu2x5Lu4ALs2oQivcJtz5XRZf%2FJduSaO%2BsMjqn4S4ikBRvSx%2FeKW%2Bx524pwU0IdbcThClUyJ%2BpS4WwY1ZuPNPvxYvnoSDYBV9VxyCldY1OTjWoUVw%2BumNQqJBZ4fwkqeG3sQnZhl4M0McbUAWsVQrEb1622Ge113hZDJTq%2BWkLB3dL9PmyF8LcOdPiPrFh0dj2a%2FB6RnIfzY1%2FcuyNN%2FUJCWAS9pHGpCmIV7Eg6%2BNofZURH0tZJoyhzwdcSMgJzCSijVjP6LoYJRcSisiih1APeHYUHdqiaKsnidVQF5dnPebRIz2GK%2FSchmEZDrdO51rvM4O7LBazgYwjxnRkjneXX3hfc3%2Fswd4lHPcW068mrCGIPzpBZvRwlAAl%2BbWkQBSGwMz%2BM%2ByZh8Pbm6zXet%2F8YWzMKBMbRvGxb6v0ej1uR3xlmtV0OlCqvxSNnF%2Fo%2B4vNHqI0whOCP0AY6pgEtarX7%2F4uyZ8YRr0YstKyO90epC%2FVv2l4Ew%2BHKcNUx3lp82nUW7ou1t7mjnYzpelNJSCzw5wm4AJ%2FtVNEw0zFbZOyb%2Bp9A7jmujWjc%2BxX%2FIxzKg0%2B7EMsmSF3CYhElKj5Q5tBCcWQ9NmMh9DBxphQHBs7ge7Ug4dc8q0XnfL%2BH13ALAeBd8UqX5yY%2BscwhcWMh0nih0PfZpxKfMWFquq%2FDFS5xV0yb&X-Amz-Signature=7d91ce168f44e4e59250e0eee9110e39e901854e9229b6dc07cecd79af75194d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TYK6YLFW%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQDO4oFubkoUxTMrLyddOEkTc7XxqaYi2h0Z7ZajT5oy6gIhAKO8OoksOHRDjBBgWOfZ77swaAEc%2B3fAbx7eoSkK8DSwKv8DCD0QABoMNjM3NDIzMTgzODA1IgwICmg95Q5qF8iqHYQq3AMUL%2BZhjCtkkinZfBmEBG0dyio2%2Bmov2bxH%2FiNOacs0F80qcqZspDM5MZP5%2BpUGInUr5XvJiS0RB%2FwY8jlfjJ8KR4GyUuYl795ALjA0pLDi0IWvk2ZNTP4tOo54nXoAaPyXvhYvRXKMMoISWZeml4Z253sLOp2pqUerARhVQ71FuOcX4maDCsB4ulGC3dgA3L1q3rU7bB%2FpRCq2AUrgWuR0mWjUwhKLXVePpWVfmtKDN6uSJDo2fISnn4YNmOHm3iBa%2F0eKMAMR51ctSR2EoqU%2B8lKIcdG%2FQ2PiaZLHCM663yaeZemBJhrcdg2of65xxTdv0D5cgKhRVoa1uraUacZBhpFqMTUP2MuPN1pC%2FAeGW3NHixo%2BXZ0%2BVc3YCTEiRopjiBTx4elQnd2RJxwjadBizXv76SEK3BOOqhiDEDX9lrHcfcVUxo9dw6bTLjI3ib3TFJUzrQoigxMIZbxCuGLOSH0iIYworQlGrbA3%2Fhl2zOun9c36hyOAr8s6PRstCj%2BO57yN3PwAbI48h1lx8QhlnD0o0UmfjI640IKIXPjnco2tX3CvWRPlXfQWYmC0tVDuHQVIWXR6Lw1ekhSlD55jfWuwAnuXE%2FVqRqMnSytT4Cj5s2orWvOFvLl52jCK3o%2FQBjqkAXWUxPli5azbK1QX649l0QM3gQd9s0EuL8N8KrMD5Kk5jSeok2gbiMF9b0zJD6gxUcfo3lkqj8MABbv0%2BUJhnm%2BTGeOo41JywAr30hNhy%2BI02Z9BS969G%2BqFX7M8HR5k86DvcSasobeIJuIQq34BNP8gVieEehu5LmEpu6%2FNXmCtQzRPSWGDIpSy4%2BtmMJ95K0CZYsOYwdSlN1NuK6g7MslrnCAV&X-Amz-Signature=81f231b55bc4529ea99bb2f0dc3e4b822eafb73b827d5d38594acfbecbd67438&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MODMZSR%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041208Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQCCJi4LWoIwrQIxejrTiiswQ%2BgWd1zgz4LDj2npUZu1%2FAIhAPcc4XC576Tcb6UdapXiIedHRfcAyi2hv8nrcDbNtsTjKv8DCDwQABoMNjM3NDIzMTgzODA1IgxYDdwzUcGAcnlSM24q3APdL%2B6jxMUqs4efdCx5mNYHnE6TvBWAAhtVxTBrgyDAYFjZNM%2BTrUXVLB0SiOfMJyaZo5F7xj%2FBa1QDQvmF9JIWiZL6AvGVgAEwQ0OnVnDtyIfYZ8%2BFuQe7JYM0aVQmL2tM6M%2FK5a5mbSgIenhilIKaWoLrJ3Umyf06rySk8%2Ft2yGS6TWbZ5Ji7BYDImvkjprloLeOU%2F9SfEO%2BSFy3c5WSTS3jiU2PWnQ0Jp4S7WHFyp5ngXWYuEUkJc%2FdRM%2FtpIEp87e16K%2BuW1rtFNSS0%2FfEcSsk00I2IX8m2fNmZ8RlDU8xeMf3sYFvbZMHo3oj7aqK%2FCIiYoREUJ%2Bst7KQgpVCzTHVk9QDoXx8bXWnY%2F7EPejz6SC72OSEI%2FFNXf%2FfU8w5LKv6tqdHe1sgdioHEMHiMnp9bW10qpWhs0JUvSNJj97pbamiOnO8Mr6is7FQWkY3PmhjQkrqmlkUeggxIn7NwP8Pu%2FvcZmHQUbqMI1u%2Fvj5vQegBlqcwsF8EVbunQ%2FMfkNLj3PBztKUSC5J8faFXpUssHcAjpnSq2BUJaryzqe1Lr7X4ukv%2BU123LlOcZfPMQvUPpbI7diOVZKpCn8njko4mvxgvmNwkNT5tmfkQYenAJQKhjHBQEBln%2FhzC03Y%2FQBjqkAYaW2si3JZURw7r4jyyx00Q38E01VtNJ7HA8JHGctqiLmQzrgeW9Ktgt1gBNjMmAtkVoBKGIXo4rEBYGO7DbUKEPo%2BplI%2BQ4fTBxvJRWnQWhhtM%2Fee2lgEW5qqIzU16F%2B1queK%2FL7tfiSOVjYlGQw6RFuODOaogOzFvWjnBFLrrtm6KEKlAWKYnKjPhjZ5OHHlEguljPUQxeWVuEH1hLTSdGHf0e&X-Amz-Signature=2a2f959ac99adca5ae879969a51eeaadebb4d506acece00032d215feb0d1fd58&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNN35UHA%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIEwBtiM4hadInqCneBMWyYp3yozzyJnkA1OLRN7tCfp6AiEA1CAgRZnERzbCsymAithP2VYzBGysceVFDvU0MabaO3wq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDEkH753RbJyebMpfjCrcAxOVU%2BkWdB39VMDTYnyiWNu8Pj3lBI7pt2zblhUk0c%2F7owAdiSqm5XwlAevJopZNK3afZTCbhuxU0bLaXgJuJKzug85KFdORPlRPIEL%2Fi3U9bs67W3%2B9fAR83DJGe72zBk6yN8Lrj%2F%2F6O3Mwds%2BS4aJIsYJa2Z79Bv4E5e1rdOGZoAbGc6ilLGL7amSW9pFayc2EGe6G2Fz8%2FH2dPHM1%2BabB0UVXSpJHvS4XqoOKgvgd8fnlitky4paH0g3IK54EJJQWUiCUHmzc7IOMVvh56DZOC0CvBIeoZvGk1nkYUs1meXu4%2BlCJ9ZYcBOi6M4o6SM5WSkDPu%2B9f80l5W84nuVcOqGcM0%2B0XAPoZvbQ3PEgdX8Ye0h2NEc%2F8hopSq37uPSQ%2FsUaWgjYsHcsnIUhVwRQ6%2FWfZfHZTiGktzbYZ8qQaOU1FYfn%2FdUqEMCuhQQ%2F%2Fx%2F%2BgLQGbRE%2F8jrLpEueLWMUTCqyLasw400CvIzQC6lEX6oA241AG3lIQHawexhIvRGCIaETE%2BDwTn08E%2Fx52gN6KGS1e7UwqkMMq%2FwhTh27ZAAY1hguRdmU1CttYd5AqvXwdEXm0lIYalCPGsMr0I62g%2BnGC%2Ft1OKkajQly%2BmUu%2FILmCxACzHeF6zgvkMPvej9AGOqUBCyYig27hgDA0gcJqtU5rq86dGkCvPoEeBkYS2065lvpHPPeKwm6jS1JK%2FH1mH3iYtFxKpvrv5wBrYuzM4DeRKsdJhPU29QWBsp5x6KWWeQYM2auhmfbO7TxKlt6T%2F0S5WhxI0mOpYyWX9mRFLscgUqzaAYStyZI1Xse9VulkAhu1%2FoLAiZW9aDSdfkLafnpfAQW9xm0jhOTpjO6OayV%2FU%2Bt0oVmD&X-Amz-Signature=ef6d1b24d0ad9dd3b453327bf4a064ce4f0439b769ff0d6eabd83a3c0caad8fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQQLE772%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIQDyf8GGcbnxg6znlYS6AWlTBePPnz1KoXnKh2GZ7nwd%2BQIgLATVQ%2FhT2eR8gfZFWJzI6aSfeApuIJB6sS0u3YyPSg4q%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDBhcNFUkKKfrvCj4yyrcA1Z5WvvRhlgodgvjsFFQQrTDRXPXTn6XybA2FKM3Ao%2Bx551UGVqDcCnQByQz2T7NwdjZPuxnvxf2kPfdxcUu4gQc0%2BEX7OwAfWFi2FfdoiaE4ICqkbKBLN8EGiyrtnhim4%2FC5Z7zEJMrvTk2l%2Bfv3kcvByDQvDz9r%2BEShMLvLH1KY%2BuQ%2FUO4A86OK%2FhfmEIodXI7OF6ERZhdy9K4rIScnP1QSm2%2FM9nS3Hq9qTjkDQe3kFvXiFfnLxbmnKs5GRPl45WMyLkoPZa8SChj8uQTSne6kk3raBzJek5oXhqJ88K9QppfRYMaSWo4tC2H2SiwvcvlfPZxNyeTr%2FPe5HUPxZDt5%2BEOEq713QDrFtepjEzWSnNZLbYGQsSAFFDIEHsaMLbKLh4iZzyO%2BVjgj5IdwjaxASJgKZb2Iig%2FLWXwxf7W0GasEnjBRyysNgDeYV2UYVkw9mJcKjMgypEiieoEDKtLc7AV9klsiiNpiGNEElt7XWlgoWOTaQP6TFdodpgSnsYBuuUjxZjRkXxj84vUxc5j1a1fZx36y9VKg0vOSWyiCLCcv9MAX6cNyM%2BHJJiZcI0KXBpSQjbUCklYbPPxVf9wbZAvEpNnX9%2BoT7fEYeEdcFSBtPX%2Fg70qeipZMJ7ej9AGOqUBmiSA9oNyz0%2B7Ixvid8dCt5WrZKM2XsUkcmEyYXN8G6RCFfthjkMTX4c9HQgFoDL0uzRseR6cawDteJzENOpsx1HBNmlBuYExxqh%2Bir0a%2Bryjkt5nWSxYz3REe6hR4uQ0KPt%2F7kTzgYt1AXRMKQfqMoF1V6Kev4%2Bgq0vm8gJaIMQ%2FHCGMcpU5zNRwj8ds5Z6mSWKdm%2B0ITGFM2PMwG3nxog64J%2FMk&X-Amz-Signature=f4ec8b9a9ffac59434d5f54be62b1b141666ee51e61b7d320a87e055af42505e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJE5GQEE%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041210Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIEAztMD7FdaLzJV%2ByOKAhRKKWBNwlZxpbeFko5h2OuixAiBPsNMmCTFHWWqFhJIJTnY0vfTWTKSzrXDRd%2FAl0MbOsir%2FAwg8EAAaDDYzNzQyMzE4MzgwNSIM0shFfqsyKrFYdb5HKtwDqMPTulR2BQzzbnQTd1RikI705Si5OjsPwmVMTZh62IaqQwrhEVGrL7BUBrUwpnZMlq7U6hwQVh2FEIsLRiWVI38mLXGM94H8hKh7o0g5tpo4czFhGO7BEHIHVU4GZyIsfUT7KchpY1MfcM%2F5UeTwIYypgETOHntQbuQduZSgAmzR%2BSKkdClK3x%2BpC%2BmL0x8oa9dixADW5jROFNSviQKCHElDL5XbgVHoHgmLCTHjWdhgncxywL%2BGNknTBXdF3a5oh2Pd3G0trnliqfnRmESmQT4vYyz29ochTssxnpx7QHjr2l2PDliuXpCQA1ueLzBN2%2BRYH8yE%2FNV5xcf7EFXp%2BiWDX5BoLK1HWgPFIQqp8X8V6mJFf%2F7MD6mo0oAL5r1exvbgq3T1tHKcjwfhfaTBxRcKXanrYSNdcTqmHu5K5FulZU8a7LwxKfuPp36x7CVysQo%2BKBQrV%2BOoZv5nil4cK7FCyaSQb1MpjKPYSzxtI41kcjDWqqwBYgmews7Smsr3c2fJj8qv8kgcPUagdBWY%2FdINOpEFDnQfSnWFz97yCBlvGiFR3K2lEoX7MG98PtkRsiVDBdVis7STAzj1s9r%2BXPfzC981q5MxcMqTxVRWam37qaPD07398SXdT74wk92P0AY6pgHgez2UeyQpbs5eQuq8bWSYbsr1kCZ%2BHDywCd%2Bz9EUT7mmh5hBKOqhLUnRZMC1UfLb7f5ZI6gSDcMnz3lOOT%2F4B8Enjjj9cN2FRmEj6gbmho99RhyrLKbABU0P63J%2FYqBcSj7W29W8yC4x7u4n453wo%2FBU9AoPt2o4RgVH8v6Shcj9JFfFXcQYnr7lx5jwRIv5iJhv0KGjqDZPR5CwzghKfFajQyZZB&X-Amz-Signature=009065622cfe98fe6b0d10e1681a2cb3119a5402eeeb74450628a0d3e5e0922e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJE5GQEE%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041210Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIEAztMD7FdaLzJV%2ByOKAhRKKWBNwlZxpbeFko5h2OuixAiBPsNMmCTFHWWqFhJIJTnY0vfTWTKSzrXDRd%2FAl0MbOsir%2FAwg8EAAaDDYzNzQyMzE4MzgwNSIM0shFfqsyKrFYdb5HKtwDqMPTulR2BQzzbnQTd1RikI705Si5OjsPwmVMTZh62IaqQwrhEVGrL7BUBrUwpnZMlq7U6hwQVh2FEIsLRiWVI38mLXGM94H8hKh7o0g5tpo4czFhGO7BEHIHVU4GZyIsfUT7KchpY1MfcM%2F5UeTwIYypgETOHntQbuQduZSgAmzR%2BSKkdClK3x%2BpC%2BmL0x8oa9dixADW5jROFNSviQKCHElDL5XbgVHoHgmLCTHjWdhgncxywL%2BGNknTBXdF3a5oh2Pd3G0trnliqfnRmESmQT4vYyz29ochTssxnpx7QHjr2l2PDliuXpCQA1ueLzBN2%2BRYH8yE%2FNV5xcf7EFXp%2BiWDX5BoLK1HWgPFIQqp8X8V6mJFf%2F7MD6mo0oAL5r1exvbgq3T1tHKcjwfhfaTBxRcKXanrYSNdcTqmHu5K5FulZU8a7LwxKfuPp36x7CVysQo%2BKBQrV%2BOoZv5nil4cK7FCyaSQb1MpjKPYSzxtI41kcjDWqqwBYgmews7Smsr3c2fJj8qv8kgcPUagdBWY%2FdINOpEFDnQfSnWFz97yCBlvGiFR3K2lEoX7MG98PtkRsiVDBdVis7STAzj1s9r%2BXPfzC981q5MxcMqTxVRWam37qaPD07398SXdT74wk92P0AY6pgHgez2UeyQpbs5eQuq8bWSYbsr1kCZ%2BHDywCd%2Bz9EUT7mmh5hBKOqhLUnRZMC1UfLb7f5ZI6gSDcMnz3lOOT%2F4B8Enjjj9cN2FRmEj6gbmho99RhyrLKbABU0P63J%2FYqBcSj7W29W8yC4x7u4n453wo%2FBU9AoPt2o4RgVH8v6Shcj9JFfFXcQYnr7lx5jwRIv5iJhv0KGjqDZPR5CwzghKfFajQyZZB&X-Amz-Signature=a9cbbdc51d79f12c38521a8c7970932552c34ceb0cdf76d7541dd444def295f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
