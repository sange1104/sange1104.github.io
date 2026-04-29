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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466USXQEYAZ%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQC%2FqKdKHRZuUnsURSiUm5G3eLZhn0HMNW9BmAN4XQuswwIgPk%2FexD4KNqdGZ7L3TLN%2FVT0wJhpIbPc3fNTQXecBNvYqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBp6XJB508yL6Yb8NCrcA%2BRaEkJBUJp8r0FAHFeCm%2FyzI6gIpzC5lKhco3Q0indHD5%2BaFE0VE4I%2BLVSmqBzDXff7hcC4vqDutJ3gxMoBaG2sErhkid4%2FO5PIaQP%2F%2BgDag70PWR0f7KZXPV%2FPBtFERMVoQDFl5XGkEqm83OjeJ9hLBIguXIUOMZydq5IMIZTc9g1m7t8qV3ro0TnZsnJaw3thxB5ayFj7MPoNqEbmiTzFMdMI8M4bw5u1mgKVX9Nz5beEOnrK5zTzmuyu8txFw8xNkWc507ahUYrdYL4kcuCcc1E%2B3j%2BONnU%2BS%2F%2FJMD0cuo1P12YKk5hiZ%2F%2F%2FbOlFs%2Bm2SAAM3geUCAVgWpfpxn2a8RdgN8%2BxfvmSeWRX71E2Fkmi71%2B4caokTMeGpHJv7kY1pzPEw4ripHuqK1T%2B4ONhBoFIFVc0TvNOxCscfAqO4VCWAKHjxR5H75shjiz82WwNexbxS4m%2FyF7rthGUO9YvxghnPT9HykOApM484e0W6eKBbne%2F0IXaAl%2Baf4rMySX1djKBiOfwlHakLTjPL59tFDgCrs25ZEMthkrZtLNHMYaQ%2BtEpBvKjw2md4Gjv039BCoq0EfSUMOQOR%2FnFlmh4d4sLIaJuHuNegCwQmus9Ncukk48PB5EeauQCMJnsxc8GOqUB3FcN2lruYMqoxU8jiu6CNMMB%2FAb1XsdbVTz9NdXqaBf9nwog%2Bq%2FdEDOf1G5DTgeO0DdEgAVQv%2BBnSP4KKCBTTPuux1LV6Y8b5sgTFllaUtlYcHbTvG2ZK1Xx9KI1I5w4Ywb4UwzqSoVNGBpp1JokG842xRxg2ANgXcuDudhA7Ogf56oX9S%2BvL5%2BxkssTe%2BSlZhGgw3wdFsmbGUJjtWmYiNWvEARl&X-Amz-Signature=135ff06aa3b8e74f073ea2d61da30520b5f3a14d7f8ca0d514c15333568aacf4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662GQZ7RWW%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040138Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJIMEYCIQC8JIxpEGCqXRabEls82fA2rNpWReemvRkSHRz7cI3dGgIhAPCjwX7dCox%2Fv9rpTwBuPCAkZ%2FbiPpukLDdFLWJdPiNHKogECOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxPd9Gbw0Ub1SRCD7cq3APamRmjsmAemr375rEuhyKQljn%2B8hsrCihp4l8%2F91h0O7Ne3LqdMyhToqeoCTwFaWmJFb9gFg4bCxK88Zu4JnbkO7q2T825878dIMGo0r6a09OhoSVOKHg62CMRxjbT4XQ2iS59XN7Bu1HgHUOsnktD2iHkV4CET3Jo6lAg%2B%2FI2yMbrOLtXq5v5psiHvHBTg1qapSM1DWL5nHsii%2FMieXKdvbW4JYaILE6tzeb1HSpt4ExQflrI%2FmyAIEJJpNbZ2LrTULkZq2lPlceTygYh%2BmiA7jb07nMubgdg8TrVylM%2B5mQ%2FmaBb%2FHT%2FGETdBhcunf%2BPFLoinLHVttpBf8w9WdeUJyEETvgYXwGS%2FZjNXXJWGGx1uLoVMQh6zSQq%2B%2BCiOln6nTyNlGa13YYRhxqyq3mlPLvFTVAvCbQ4AVfMoJSVFa4Rbo3GVcILz4VJDuaSs5zUYpMX48w9A2YbYDbAzfXmjOnTASunhiegy%2BIlnHLiMSwDGsJxnlLPbTHMO5yBqBq6LkHrSCf%2BBUrnjA9TDrS%2FIzMNGnF8djgQ6dCW9LGopeMOjR7%2Blc2bWJkUr4g62uN%2Bl0ACgpjiFfr8hG4a8iiPkwEPlSNNaT5Snzv25cdffmlUQETRsVK74tDl9TCV7sXPBjqkAf2Vp6TRUIbwjEA%2FFziy%2B1BwZGcMvj5js3NU9EElPiETuuRxGpmjFC3nWSdGb0AwDAqFSUmHs51U0OwwjYho0gQ%2BbmktxzHETi%2Bk0otrZlv0IJlK3sHZsPHkxguIeIoEoJ%2BMT6QzK0951tRbGkjrhGad8%2FlTQcdywzhCWy7nTWOERwqZk14p5NDCqnsH93w%2Bmuae0ZfsXknYnHqZN3US56xVpI57&X-Amz-Signature=a09d4e1c1141e67b1b6d41e2cf481990d982d743a63866c7ecc5e00f28d973cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QNVVJWJH%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIAjdauaCg%2BZiJiexXwI0luR3RyB8ZdNwsRYfmhLXYONcAiEA9%2BDXd4eotXglu0l21Q81Qh7ZB3am9MWP8WlQm4VuN9oqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE%2FEi2aj%2FKU25PD04ircAzfRdJ1tKTxMeSoPQTynIYJGC8fgmEk6Ymetz2qFWNOjX3osodtjgg9%2BpXecl0cDZMGb6WAR5JYQru%2Fh7qCe3wqqpGAfkyGJdPeNXHwwQ1txV7MmT5nDHxSLnf9A0hyCCVohWKG6Wha0J3Pj84op9lhkXgAiXwEfnjyR8LPoUG%2BdrZ2JvNRkanyUc8h8aRZTmSOrqY9ree7fuRc21cJQlhxdSxrNjeEn2qXtVmnEjGnwHDwHCMzMh5w38Vb5Z%2BCFmyiLmC3mo1vHdJU9wQqaR4q0gfZvJdx4FbDlzaKsBCBeyjd7F2U7fapAeboYZu1VUk%2Bw2wzEHgNZ3J2nvs7FbrtBvJcqvzIiJD1Mb6wnGx6oUfgnIm5ThGAn3a%2FN7npFe7FueprVOKiI7%2FF6P534dLJbADTiw3KXxVXNVKh29VmVkzLTV1Dg%2B1ictGAshvnc8FYiky8wgwYYdEqrC3lim9yzf%2Fa32pXVqSpGMM62weyHOzwkFBFd1cSrz59XVVzqYOd6GRTjdU9bQKFFTq5EV1vcQ%2FFrSgiUJlItHqhaaTdwRyyahcFLUmj538KdY%2BS5yuwHsi5zGz03Dry9VT6Spvm490CWxXySm7QvHQTBduaFC5iz6NKu3u6tAeDHMMTsxc8GOqUBg5sGM4%2BK33Bw2sG8cVzESItkvlwJq5zcy4XK2eSBXAaCzYMY5PJ7KBDx9FQh5vw0spQxp7xwUo2BE4dNh4sThTQVgjpiRY9nxIzILc2iPv1gAqoLfpUqpCC0tM%2BiICrks5tHh21uXMHTP2L9Mp9bIACtItMyNlXcAhOFQ5bnZxqCArfubGRCG17EP84jpvB8RF%2Bgjf81BSVlBdHWHrs3FwBiVok2&X-Amz-Signature=586d0044d879e3cd898549483f4c8768ae26233a1cdd45e04e4056426f1a70fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C655L3U%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIFpPryIo3PpT7xW7dSbyXtQnDwpTsfgKvDfoXb6oaG5oAiBRK%2FsLMmTQnCiGSz5Q11GYQ9QaoaefEQpGpY8%2Fr%2BfVjSqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqnKfR%2FxJBmd45ThrKtwDwXC2%2B03XvdT6uDTgQ9sZ2PaaHmweYl5VZUCVzsl3yuD2aR9w6raWZtqMAp1YVci6PdLZgYgYFh1LHHLhk%2B3TLLdSrWAk%2Fzr2DMo%2Bnh7kmrro7ald3rR8r46sCZPyB8rGGTHgXbPxJEasXmcTSb6vxW4FiRrbFLLfwt%2FA4zEdk8%2FEQGDDHVA52QClJROo21qdu8HM4bN%2FXH4LHtgqQuAhH7x1jTZAZOclBhxSIc4oz58LnytCv5SYVJDmvglAXERMKz8IlpCTO2ti2D3xObX8sl2R0f57RJSXzAp%2Ff0ML2RDQdNm%2BORmv%2FXHRDmovdm8gwzB56nWJIH3HenHteufnf1YV5u%2BQ%2Bs7H4qJjoLUdb%2BSxFwPWuAAgbv29%2FJVjlbKAqNrMYGB2aoOOKCo6OQK%2BQIELez7iZqhGC%2Brjss8UzT7TlQ8H6KdW7DaDx%2FeWFIefIy6YBEbCeG7QjTCdSIEfaW0MqkHRD5poUPqro2NNK%2F9BXiFxn%2BEco6neA1orA134ZO34RxjjwJUtrCQO4PYUPv%2Bu79nYlu1slCTT7nOh1yjTUmdDxvmrCaNPxzPZ3WY2wAhyEpe3mEpnpAj1ECCRfPvWK2l8uGeEZ8biEAjrJrURv%2F7oEqo4DEYo62Mww%2BzFzwY6pgF13tHDt9U7gYpOdV4mQqq7rf5ZAjEyWXt7S%2Bho6XJk5bCXObpDtSBEO9QyuRy2YEtrabgAFbmSc49LH4HuA8Tuk4%2BO%2BnPUbI9KGa8JpMPTcO%2B7ZTZ3vIpqXJ4dMnsTYwvdCF3sBSn15bsZhMhyPgtjoUJ%2B6uO7rBVjxzWwkluOqc3OD5Q9llXGI6lp9EJ28Xwimt%2FAjStVgaROm1qra9YVk8nMAwuz&X-Amz-Signature=b960953b4453a76ecebfd16ca6b5b717c0c54b9d10a582b2d7def08282e8ede1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ISX7HM7%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJIMEYCIQCgb49Eh5smmK0oE1fkgJe8WXqRFq4dZjnpxJzky%2FqcIAIhALXAq6gQaO8QWk%2BVQ0%2BLIjU%2FHudcFtpxgF8HqtNPg12pKogECOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzmaR1GESsKPB3C4lIq3AOllIAluvEvF5n%2FnUFA%2BkbklKK4FXAch3HiJ%2FmztoRByP89eoIYpmOpKkrwF6uxfVabggxAdqSSubnlBhidXqusaBEpj7r23XTAsvNtZyG1rntW5zpyIN%2F5Ih%2BT9q8Z9Dz63qRjbLxz%2FTPlIR1wnlTnSTFOMc%2FwSmvBTwAKpU%2FF8GFtPCm7Cwy7eUKSGFMZ3%2F9x%2BohZvkRr%2BlQsv43IA1%2BZUOjZMcLBunwpre6Bm6qsN1EHJ0j1Sd7p%2BRPVgCeZxv9LRY%2F3XPnsjf5hmRTEIlW%2BfANJQoIiTo7aPwZNC%2FGI0QiuvfX27VusYUcF0gvr2aNjuohxddJXBbFiEYrNZqar1KGTrOvikosgfTSd2%2B46KbWAhFULnMER1Xq3uPPUU%2BFI8v67nmEkTHZ1Vc7QHV%2BbDa2StpFf5aToAtGdWVQSXEpTRCxwNhrxtBb5lxFMO%2FovNJuhNghwvLZPIhn23J%2BCroviEryKYNhBRQh3d%2FWLT6iRCCXPvJtgjJoX8Qg18jJ6u3bfBcBZBh1e7UFZk8y5z5jrKYMGLHHSaFUZhHhgW0fMXCNPWwxfuYTNbSesWjuPnhRUJAquyYb8uspjwyGfusAws3uoaFahvQ1FHF9mRTKKSOiN6Btv4VjjmDD37sXPBjqkAQjhlLEGCuoileUi7vq75dr%2B4zYXU2BWKG5%2Bb8NchsAz%2BIl4Zr8zASPk2RwjJD%2BYHFlbqB97AR5L3OOY1M8SeFouaNUjx0uvls7luxjOVGJuT555UeIW3CCHh%2FbIFQHq7%2BKep4N4IPzXuk%2B21zwyBV7QF7vtQJe9av8bQXjEfSKiysZrXqxhK8mLL0m0XerLZs%2FmZxqJeUdzNSQ7uxzt1H5dskXS&X-Amz-Signature=d2297eb456e938541c6278d0d37c26a627640f6bac07682c8ef0a9dcb00c2a4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TRVH4D5H%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIDTNwJfvAO23JARUYCB%2FhapKqdseP45CYNQJ%2Fi1iNWdvAiBmAmYgqsFO42428ppMMsqDJu79EIJ8g9u2kIrRf5lQNyqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHVY0vQ5BMlTxC7xLKtwDQQCu%2Fop0TAZ4OFIpEXZwXHXoXeNg1tk%2B6cVYpuvFtI8PiaSTESuQINoiXzgHfIm35EBvvQ%2Bngxv5k62Z0z8zMSSDRxNNETEzP6DXt67%2FyxB2xP2EAhpdvIMEFkC9g7FsqmUB5frcYfXe8EKJ2%2Fi3LApP%2BpnHYDXSsYOIICfgmRvTCuyW69Fv2YD819kZeV1Zs99fO%2FQZoZ0b4ZgfT3AV7Kzt7c6LqvKKMZ1KwllrOz1TFYQoOEyOjNmIgRdfELyqvC9hPHEhiseu4rlUtwq6yhTWGZBlvioranxyamUC%2FCclRLt%2FAxSdu1m3pn8DOReWi1yzw0JnFDyUTXDyujeVtV4XuFvFGQP2bXQX1lC4zkv3DEtO3ZzOCalvCrFVX%2BTFOgrRtZKj6MdInP5y0jt4iHgQRjy4acT%2B8tz7vO8PwgxI4eZz94p5%2FYanpt3%2BTavjk433IsmbdWfwAl3usYIvpBUmWK%2FWdgGFf9RBZZGyPwq0jyKkt7lMqWvPf6ovX2XcwITE9ZBPbNJ09SjHkxcjUkdfcn6n%2B%2Bg0ekpl%2Bs57xwOAL62cqESL%2FqNq63gmc%2BFLFboI%2FQwN9xBc3YuiHwHWMuyJMuClWRb5eEZ85yuUsx9%2Bdv4y3of2kxTHffYwx%2B7FzwY6pgGmbYBTd1RECMTTF28oBzaXU1SNPRtuQXWnoCkRn%2BJftYwwxrQWbcm2miCS0SfAlv0%2BNF1u425wWhqBl5TJdv8vIHKxmJdm%2BYgBGw5tHD6Ln7msmvfIQcjdqF2JuL80xnXNjVHhTBBpMns1FuDgXL8CLzei5WdujyhoZoLH1caNnjDfANNLBitQZQ2vON3VmnCM%2BGAojz7IbMlRVb0fFpEBwX8mMZ8C&X-Amz-Signature=98222cbf39d5f8bc3d34d8fa70c4bc19ff10e37671b04ef13e000f27bf5741d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHVOVEGJ%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCH31ElyLc%2FxIS8aoA8no4TtGbFLXoOPIQoC1qyXHtWu4CIQDecwAXZxBP37%2FFLow1NwvYR%2FskmMkZksQRNBPbjcVpDCqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMWt0qFERQ%2FMzKFkdiKtwDT2OE1ruJ3FL6FS0Lp%2BCkLl4rklCU507bl5zEYWdVqzlB3j6iIFDwcFs6%2FK2wunYpKdGlhz4eIWwGTPwUzs6IUql%2F0oWoySXiV0LdmAZD6I70%2FbKZrnz5%2BhEkkYyLxtv0NSxJNg1oRUR6nog0eoIkXSdvLvcslsdl2yzdQhrkO3aFG8M5d25q51YgMU3C1izF6ShkBwOjyXG5UheOzuVcl77lE4FMk3WHbz7ixfj9u5%2BCKJ1rIjQtdcSe9CbNp0oYUAIvTy0iB1K1POIzRAfDsjse3tZyZJkopz4q%2BMhkkWQ79ikX6PXUccbVuDIGsoiao80RKrMr1VPcouvOEweqaM8tM54oDpE535uNOyNXfV56QHg5EwHn2nGhI3OVE9B8VQulApzCVJghaJCtZPW%2BH4yQIdksQeV5AHRIMf4aD0WwGaegW5eJPbMPO96CcILC%2BBXshA%2BIpGgpMuoRdVFGn3z5kKTFb8agxnKGRZHCRUV8eCsx3Y%2F3NOXBZHjd4cahXDT0jROP8KuF4DXGt4GZcxQfSb%2BXG2cF1UaoMd4c3pmbOLU%2FQYelMIDrfmQz%2Fn12eTzDqjDYbarmno%2BBTCrdy5gUoJxyTiuH20wI4fK1sbLP72I7IwNJY3lt4Uswse7FzwY6pgH%2B5j4Zk%2FVoHD0rmrf57%2FawVsUoBXClsaUDwmIsGqvR4EEFGWHQQ4EGsa7BJMjJ8pBXbSJ5XQZeGjmUh1Igu%2FatTUsgSi3EcSBuYAv1NBdC%2BLV41aBabQ7ibiap6OjVFuMtI0qEHukV1vhxrU2VVxdXEYpIJVIXpmiQJxYbAkMg%2F1OEpPeOtJp4IgozIlsYOin90FA7qnur%2BGuQ3MnCcOvvvliNkSMU&X-Amz-Signature=2697aefc2f0472e0d2a9514a40bd58522883d5d203ad1b618060fe2f7bee3349&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664BWT47PE%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIEYJ0rlrFUjuMvKrDnEuU%2FZhT09m%2BfTM9yz64kcHJHD0AiA7hOMlLXkS2iyfgEXaKz5KbGJNipx%2BE3CL8Bn7a8uu8CqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMxOUvxGoEuf4AeSrJKtwDDNV7ygu%2FhzOUf4W6Ia%2Bybm%2Ft25CnHNogh%2BizzoINzyuBsIlkC22fGtdlvbWyrKn3aZdae6OBVMII%2BUjDVzz%2FvzXaLz3GaIcCki%2B8gctwvGPVAYQYlMxDCGnwLiEOpN5X5QzoSYV5N%2BgB8f0gDwnWpelpNSFYj41Bwq1RdiofXnGkoIz9ASF1O3PkfOoqBg492G9ssg8s%2F3QaaTbZfil%2F%2FpvfYVd5WkLT6fxBntn76m%2F8Mj4KfNL%2BnJWyVDJa%2BOSIdjlt7EdbxYhyxTb11yW%2F%2BW62McFlbCLEqmZlEGc9rXXUFQ7gXpYXEs6oAIdPQhxowCs4%2B3ozML6Ji00nbfDu33doB9p84yvfuuSBulnYoldylshLGeVFzLJvy5AcijmlP40lqowoTX8RyljwomjuMVdhj%2BNqP2pvjL4qcn54IapQRfBShnf35HVGibYGCGk5Nmt6v3%2FVpmC10TBcZqMKpUXLn2He3SNycJu%2FfgqG8%2BmLCK%2F%2B5QNVhA2AtPb8VcXOSKnUBY%2FTneP%2FmKjetglSnCCXk8t6mwiXjT9FhSotA%2BEtmcv%2Bt5wAQPn6fx9e7z40IAYM8FGyIwl06eGECW67UCBkoKuGGBCLak%2FrQzm7Y5GmXbXuV3UZhLlN%2Ftsw1e3FzwY6pgGKd2M9D6gc5x6%2FboXVR2cugolruZlZLhPse3fBatRxwGdbYCW2WztnG2KsSvMuMk9PJCjIt8iZ4BAOhr5u3QHNwEzgjRHDhwoN2IR3%2FEkHKsL1bLjIvugV0D9HJaF29gcnGeUNCU1k0groUPR4d9NYSPRlskG0%2FEPop1eI1KaoBuesE%2Fa%2Bv08UUtD%2B1qp8ZTGsPdrgaU96hnyO%2B5Rs5i3FPEpuACoa&X-Amz-Signature=5a98158e0ec830a00f1358d378edd77bd61a87c48e400ae3fed9fb77a86447c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666RXM5SMR%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIHZi4WkCWM8UFugo1SD%2Bof6Ap8BKn5rHOMWCgShv2MoKAiBxmndz%2FVeksPAF09FvYGB%2BrWGJO8K6erX1lfJnYoZcriqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoQxZYlOOM9rhJ524KtwD8NzU%2BpmSLmqgXWKzIweqsOxn1InDJEIiWSRYRA%2BxvoaVGQ%2BTUxRBoPQRPVomFAK%2FYR%2FNA0LWkED9Oo%2BBQl97slGeWUNeeKS%2B6ASdit%2FYvUD5x9dO9RoKIfYgFyF0KsPDUevB%2B7ytFC8dIuSP%2BurMB1AN7eA3dUTDLChXj%2FN%2BQhQNyr7EK0%2FUZJxQZjxh%2BjqD8NNKkha%2BktW3mhPNB%2B8biuxTYm8YysUiONBgA50rC9RlOuNaiOn7e3jkUv9WG3KXoALsWeePhprMQHqVPCWN%2BKa9%2FHOF2nmxs3QE50xNZWv7HuygOzPUtg411Fvyul%2FB9D%2BYovU1%2BUr0wIsgW%2FqCJrvNQUK7iV8D%2F%2F%2BKhrwOHBuT%2F05Ran1WRGYIFKrXsHQJSz7gmMzUSPHJVNWOpGF6weGXB3%2BOIRjSrRNnPIwZUZlNjOqBCktOdvYkOW9VNK9%2BSB4DVG8GJQDotgCZq1g5M6r9aYD3EIDF0q6SDQMwsAf%2FbMfdkaHF1m7QcNBnVnBi7ctBxdwnl8khLq11o26%2FJJqeUs7X0RrhbxP5HG4G46%2B%2BeFEWyJCMBmeFfFgBgQHlDvBwXj7z1%2FQevW400haCkqhPWftAqMTvoGrh4YZVBG4ychzfLSzrlpNx%2FgMwq%2B3FzwY6pgHxO4IDiFz87SoMiYc4VzS7JyXiLf%2F%2FxekgzTkeSnghOdNrRI9EbssOS1cHEa7PelV%2FNMiGfQpYQIgfgGT76WdFcnuDLcsYmiWfan1Xp18TGzVqWfsaY6YiZyyMXHJ2nl6NIbv4IrBVWnJveDI5OtK6OJg4ZS6fVbxw8rbSOtRordepokUXuk02Of%2B9kq6otYwjP0imJjQkbug9%2Fp3SGKAVjppOhOaQ&X-Amz-Signature=ca2902b125e605b5db52e29b6eda413fdcb433a97b186de4c5ccad94076fd3f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELL4AIN%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCBQHn3yxd5DRhygTqp4fLnYQYyysv2bx4TKpvbWEtp%2BAIgQ29Kjd8d%2B8RKpUL4UaS%2BzZRNsZmOzES5n5EEwbeCUrkqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDApsGqiX1%2BXTC%2BJwuircA10k%2B72uTl4stD2GcnivvRQcQ1VNIXN4OtMFLt9%2F%2FDtxUUeoaIRfIOHlxlTmRYDpYT5nXo%2Bw1R6GSOz9ulC9mrAvGJy0NBm2Ur9tkRbZAvLmJUNw4QV8ZZpkEbMLWRngafUG%2BdRwz1BDJNcGvCGiOu48O3jEoD2kTuONWIAYtmIFK9W%2FILclZFOvopqr9fXXad8mJl76pn6%2B8A8uoQ7vA5Gl9QCdneg4L2BW13e9WM%2BL8EkB1hxN%2BgB7qCHThFReH%2BiE7cQrd0WU%2FYvfMeD6TXUJFWPFZwxSr9cySKlAjVXS1zksCk07EQoExCVdpqIx%2Bc%2B4Pmbj3U6E5nyq5FqJMQZFafp%2FCNfhizi9BNYcuwoyMYkN3603YwAqJwWGOfbjejqKVq0GLO0gnrLqHaoQ4o9IckfTfpnx8x6N3zuWHKU2DlaV16XKfPv1jpoVUcrvEyl9rl1HTkaEYLcMwJs1sHHyRU0pTK8gVDHVL0cO3%2BLNgSsV9gX9V2dxabDWhvnvCUvs7abC9SCTKM7FFBVtYzzHfOD7VH2lvKaBnO%2B%2BEYfpbYxhO%2FOuoNgBSC8zFP4Y3BypgteMC5BrHmAriPq7eqPGBqp6lnlO4PNlZfx2Zr91vJBovNjfCm0TRburMOrtxc8GOqUBrpRz53S8%2FyF3y0fb0KrdVRY%2FvyAgTqlfllJnaeTaEww41SOreRmCdSv4FfSUAcQSvaqwtquSXFw%2BrQu4ZnrjRRqUfUhmlFuzrE4eivE%2FluF8HGVnjjHckXFyS1tqLJiMrm9R%2FnqFU6jl6kz8%2FFLPP1GJDkRMfTNZ5l2k5X9Fge%2BUVMQOSSxbaU%2FIds9GIitWL%2BGwA3Bo92cp9ijOXvtzOfZJbnoS&X-Amz-Signature=e12ea36a268f2eee01012b6efcd49af5f5aa459455e8642c923498039705f9e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JXL4NK7%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIBDYqBGtWHast3KAmLtJ50BEfgUNPziac5OmYsaegOAjAiBL%2F39XQHSMrEq1Cr%2FdWK4edRDplur9M2rMbYWnERa98CqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKQLIodMlztKcJfDJKtwDJssnBGyIIRVf7cEOKwkJ1jHRQZnq1uj7zoCfchO%2Fc%2BriN7ObhFWOGo0eP6LoNkZnKSgcWjgzBRv1rh3gCieRfJUdc%2F1Xxdx%2ByoeMK4zyJDXm%2BpQEcaSNuW9QFMfmY8ngUTaVLpzQrKW1fCWYjb1cmL61ims8dbopfGJ2WPkqoormflVRrI4Yquauiiw4jKtJnj5njw7TBSMFi3jTUbii%2FoUVj%2BV3y7zsl1WtGl2T54d1Wet41N4UmFrHj4eGtaLlFckcmg2gvPukxhVJYFT2rjXLDJKQFexOJbWoGapOyPDyaw6rGUSdO6F8cheRDyxlnVCGGAEhRoN3b%2FRLf6Mdxgfk41BrNITrIxfZr00CPfJSRDDGnK%2BwXJ8D8o9450IP3fZBXVD64ivQwqx40Fn1KLxzbCTlJw5Lh%2BEXksGMlK47N51Qc8Ul%2BAW1rT%2BH6SFAe2pMYyYxA02yo5iBsIMVt2toPV%2FeRM9WAM%2BZSmpbLMwZLCpkHE%2F1S09j6yEh2E0xFK1oKBcmXhKl8o2%2BLT9oiO9XbngJwNj6Kp1qzPiJZpTAmIrsx%2BKhOXEeBfjVdNruDv2mfbZcfB3cq7q9RTR4W43f81pOW%2B8EJQbOw%2BzOtMYsRoXASOP95T7li%2FQw9e7FzwY6pgER8HO4%2FeKMvsNxLvIUzIh2xom5bmmXoeUv6lFHgkVOql6A8RtRFSDSkHHtULDNgxEElaqbdxjy%2FWFOXDUt%2FsXrnqVqSENxZ%2FD2V%2Fioc6xqjWrcbKcrLIOEW76IOx9q9QDIjyxnHZQb38qiKfpNFVEl6tNomHjLVEKVYiGa48Xb%2FD4daaPevku0TxGhoQIBa9LttPLWfd9yoLaHYZQIMYFpYrpJNcm7&X-Amz-Signature=144659e4e44c9b0cbcd530653c9951f8677e03df9f3e0d85ec958ce3a7cd1d3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UW4TASHZ%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJIMEYCIQCf1fdtJOU4mjydKXTOIA2tatiJVV%2FKk7mVYT2hIQD8SwIhAIRqGEV5mm15WV3Hbvuar0PZs1%2BH6VcjBXwaQRyJpCKbKogECOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxb%2BoKnB%2BAqQl0hDwcq3AN5DUH4czrb36lkEDjh%2FAF0npHUccEyPC%2F8HImL6pKzijzse7xazlP2o1PRt1n6b7FIZhpXM6UZmQluekilVIpKdC9HqC2gSctRnNm79M3TZ%2BTL25SRIUZDw%2BjjnBeW9MDbCHqL33gmKn%2BpsHni5MgUJLMpqhfgagaJqm5Nblz0%2Bhi%2BRn46DZCa3ptSBwO1CxPUG00fb9Kpbrjm2rqd4hFvWjUbzIVnKRPhQ3lGA4H4UC%2FwvoM4jq7IN%2FqhNqTgRkFToQPbz8r0F%2BD8UMhoXqJQplos%2FfkQvukpQR42tTCt1zlf5Htiuek6BU8a47s1lPGEpVpAnnviRfvpPSN0gY6BFRhKZOHurj%2BGmvtk7p61uEFPrU7T6%2BhqLiyGMGFC3WgCDCCXEthi8VXtgH1kVeU%2FZT5ob4eNRGZekPXlKaRbsCIa73n2UCgi%2BewOCQMdQAVVnT4LYdRoEvk5H8nCVnpttYCoZx%2Bjg3lCWQ%2B6Vc%2Bqnod1HM9MNbNHzhCG4TEd5TFtJQroOmpXySHD1IYxFgjEqOYeKWbIEU%2BJQB9LbR6fcvl5uVrFCYvxL%2BtXPjB1cDi6up4uK2camirsY5k0mXmkGTyjI6djxOnS8Hry6pV5Duqc7%2BkZgmW3H8W%2FXDDp7cXPBjqkAUnwS5X01Fq42q8EwXKpnb7yw4%2BjWcexzrATQg6iLF%2FK3uTUciEjRZQBrrkjAeD148UhTHJ%2F7GcjDejTTtDC6Y%2FaiMAvKaV7934vr5LA3Jzj4BSP38UgcMb5L4NcdoR5CTwyC70r0gsSGWGXwEiAWnf3qgOpJaebx2odj721KbXbPaGM1b%2FHg2aRmhTadKerYik3uZu4a3hw1QVYQ8f4QDJFKLFn&X-Amz-Signature=26061180fecfd1ce367392cac69002af34036b91a002cf0b92428787db79c55f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKGK6ROE%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIHEzQjzbl%2BGR5a0nKfT1cWWdT8AjxC6oqfhMsFRew5dIAiBYAwpWC96HYhtHGuKOUZHwbk%2B08fZ1i9sBWJVo%2BksosSqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKwbB%2BRkmKnfd5eWDKtwD24Z2QyfEVrTa%2FTYnAvr7gwsq0MpQj%2FCocuGZruKj%2FMgN47Fv2qGjixgFBlVzwpXlbro9wk1N3CdVVdsTV%2BDAxLqL4fsHF%2FM7cY%2BxPOknwDzX%2BobblcbrQEvjSraDHwc313E7qVTxu52Mb6g%2BIWijSkzrSqiHFjnoq%2FPEdaOnt7WoPMl6nSOb%2BG0kzX4nWX8A7lB7zz%2FhU9ieOGjKiGlNiwLNBi7%2FPx%2FbCBjGj0HQKkSrhAtLaE8Iq9Kpln%2Bkvwa5Ea0ZrLwiAiuLOT71I1NxkmwSjt98%2Fr4yw8buxEVNiPPeGv5nF9p4Nx%2FBGukffVAzNzxvXR%2BTcZ8aqdkA%2FFIOiUGkQEoTAZpHEzlbRx7bL33uaGIgpSqvN8c6fTkqRjgYXUukcUSUiBisSBAQmKKiYwQLjk1P23f68eVeInI%2FWdM3NhCxmTcYhABz18ZfrRg8H9K%2BuoqvtiQmVPX4fwNBx96E0cUMrWoJLXPt5AvUvXl%2Fk%2FywKh3NxfsXLX6PKI1jqGBqCLpIouQT%2BXX72AjZomWaDQUhSDSFoTpor1eddUVLo6YxJKJngU0kgFm2Jjv6R1PZFST5vkRUxoOLgH%2B7MkzKW2%2FC1rV32H%2FoVsNbV6d026DnKQB7tZSxI80wnezFzwY6pgEW0Ch4c9Mo2ZCh5lkPZuAskEsNqzJqD5OpE9o4Spo6ooYAViwlG0tP4n1mQKHOkxdsCvoZR7Y5egTdnN%2Bojl7ThzlEFtOooU5%2F770R0ozCQ9H9HDR4QJTAmP3fo4qYfUZbFvqtDOdFcPnq4bCV3cz7XBymYNAmq8ElwAnu64vC76KXEAwPyy49K%2F0PWBcpkbrQM7Rxbo8B79LFx0Z2bnk3ijVM758K&X-Amz-Signature=44e408a7c096a4f30edeba7fcc4224933979827b768c4c370f5c3c4f7a6f7306&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKGK6ROE%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCIHEzQjzbl%2BGR5a0nKfT1cWWdT8AjxC6oqfhMsFRew5dIAiBYAwpWC96HYhtHGuKOUZHwbk%2B08fZ1i9sBWJVo%2BksosSqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKwbB%2BRkmKnfd5eWDKtwD24Z2QyfEVrTa%2FTYnAvr7gwsq0MpQj%2FCocuGZruKj%2FMgN47Fv2qGjixgFBlVzwpXlbro9wk1N3CdVVdsTV%2BDAxLqL4fsHF%2FM7cY%2BxPOknwDzX%2BobblcbrQEvjSraDHwc313E7qVTxu52Mb6g%2BIWijSkzrSqiHFjnoq%2FPEdaOnt7WoPMl6nSOb%2BG0kzX4nWX8A7lB7zz%2FhU9ieOGjKiGlNiwLNBi7%2FPx%2FbCBjGj0HQKkSrhAtLaE8Iq9Kpln%2Bkvwa5Ea0ZrLwiAiuLOT71I1NxkmwSjt98%2Fr4yw8buxEVNiPPeGv5nF9p4Nx%2FBGukffVAzNzxvXR%2BTcZ8aqdkA%2FFIOiUGkQEoTAZpHEzlbRx7bL33uaGIgpSqvN8c6fTkqRjgYXUukcUSUiBisSBAQmKKiYwQLjk1P23f68eVeInI%2FWdM3NhCxmTcYhABz18ZfrRg8H9K%2BuoqvtiQmVPX4fwNBx96E0cUMrWoJLXPt5AvUvXl%2Fk%2FywKh3NxfsXLX6PKI1jqGBqCLpIouQT%2BXX72AjZomWaDQUhSDSFoTpor1eddUVLo6YxJKJngU0kgFm2Jjv6R1PZFST5vkRUxoOLgH%2B7MkzKW2%2FC1rV32H%2FoVsNbV6d026DnKQB7tZSxI80wnezFzwY6pgEW0Ch4c9Mo2ZCh5lkPZuAskEsNqzJqD5OpE9o4Spo6ooYAViwlG0tP4n1mQKHOkxdsCvoZR7Y5egTdnN%2Bojl7ThzlEFtOooU5%2F770R0ozCQ9H9HDR4QJTAmP3fo4qYfUZbFvqtDOdFcPnq4bCV3cz7XBymYNAmq8ElwAnu64vC76KXEAwPyy49K%2F0PWBcpkbrQM7Rxbo8B79LFx0Z2bnk3ijVM758K&X-Amz-Signature=d216b0b6c8ed9b3246cfaabde6bbebe71d569772d3737b9256e35134726d141e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
