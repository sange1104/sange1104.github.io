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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SL7PJ7KT%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040040Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGNPvBMKSK9%2BjSsraTcva%2FEysDAt9BdkaBS6hKLRfNNBAiEA8MEmAH1DSmhKtGrco2KTIyvaoq8xMHP%2BJCJoiB3K74sqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEb23WVjuxSeH7e3eyrcA5MAFwy5TS2DXKVYs7J%2F8SOqWvwSSY1oj5iWbkNVj1fP4xgVljIxO%2FKdq%2BvZ97sW%2FKJMcqIHaGmspW6UoM0Me8jUsSkoNiuw6c%2F6Nx%2BisZ88XLzikw%2FxKwomQkWBTkroCmnU4eNOQIHCOox8m7q3%2FPrNuwDzwNBh8IAwwlNer96L82VmNA5Xh%2FWoB5eWsU6Y%2BbPofy8oFJD7z6U8APj3nXh%2BQQU8vBNl6qvDk653TnWF%2FNDX1DqO4e%2FsNM3563bPqgxqr%2BxYXwvHtOw7Z0zHKTabs5wfpUIwlEwLPBQaMIRkjEsPaw6L%2FVRE9e%2FNePfjoFhEUwi6oEmhsJiIbFZhooc0c9mF5j%2BOngH4ljbApgSe%2BqSQukFyt0iX5oZjuFxO1OYxSHKpLLybqJwvYWkvp%2B%2FWKOndr%2FjFI1PRSEWGLyI%2BRD6J8xZtYGyc5M1LEkLh4mrH1XoXORuoihTJHk2dscHA%2BNBtQ%2BWWn7ETFQBM0NZCrzC0jq6d36aYNhpcOEqJifsgMrdgyYI85KMmn2wq4p2sysDX0iHqjGOqOg%2FNMdOMHIKTyPEuLxz5T3SYBvixt4IOCPfg7YqQn%2Fb64%2Be%2BuWcTwbuIddv3BnFMtsEZ5kuv%2B4Dn6daRfvTgC2F9MJbEn9AGOqUBImV%2Fz7%2BGJN54F26q0FHYG5zCqVaR9n%2B0mM0Jx6JoGSamnuIda2CbQmqmpgDAhxmUg7pIuT%2FBVf9k0qLI9qB8OKAbVALFJiQo9arujmM9QzMeUcJYzK4Zdeh5ag9%2BBtILBQ%2BCydkRwUTUmWv7kGYsowfLkH3Gnz%2B0LfGQRtgSqbCl%2BMIu5kfzI8XYcZNtNnRHJ4zb%2F1b9Pf3WNkuk5bpDsIeE1jfs&X-Amz-Signature=021494874c6b3996c7b392794f78e34a0c5a9db1e489ee31b7892e06d0e48fe3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDM4EWVU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC5i2BloMMQsF4FGjAb3qFoAGigWhnApQJFOzp511StrwIgGgeeH%2BDXOYeKNLFTdxCjISykqb4GR3aHt%2FsQ6qM6XYkqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK6gXogDu5V28q98vSrcAxQPxXckxPjJ0m9FZUZ9Z9A6Sw%2FC0wQiUM45CzHxeVYCxowP9c3w5FQ42t1GjePqSw%2BBMTWZGsVufyjADyZO8QXQn770mAywgIA4KRwwjUS0pv2iwlCdXkIL8chPkBNJsOCDXIvrZGBNbJsxCrEODO2R4DkMmiy2DSGVTqbZflcNo4hiWBCjoLujm4YW0DiyhwYXa99i6Vo3frhyWx8%2FtivhcMPyHxRRw2dwtC%2FSZvlzrmPxNiQPdwtNpNvHQBClwmQx%2FSNGr34eu0XEchTgXDhujKubYp7bcIOPs8wIS0fjkxqQenIKP%2BR%2BsVGOwqBsYJGRslSVCGXZ3vL2eSB287qt%2BKIuMBP66RI0eYUfBqGznkmRqiXSG%2B2%2BPu1p76GadSPIivhZfb8yMF8gDaZF4Brh3JGHX8XWduWhSk60NcqwNXo%2BrvLmWVeTHWFN5QSuauE5mxTtExaYEyK%2FYOGfGvjsM70Rape%2BYWRYmDf5sdOyKbKI6nmP7AD6lKw%2FQg2SP2SqYTPDRKuFUu0lWS%2BCGka5oUyzjpyq9uSs84HC1CirMY19y9woqx0uInQJHxl%2Fzf%2BvQJ4XN4wzn2GisLB6SdK7HuIuozTYBU7hW%2BOcc2yuf53iA7QKT4iTnvX6MPLDn9AGOqUB0sVyVCE0wdOOurJ3tQKS1kgxbK1lQLYCnf3gJulJekzXMRosFkTjxQwU%2Brlq01RtBJIHbjgOIXduNxKb4xsdzl3y2rSaBS4fVc2uxLSZsWMRd73MEtVi69unOlQwjLtFf7Bq1r7vzKjQuFfsT31nf5V%2B7Cpqr%2FmvEKjzGYU3gR4qgCqZTY9xniXH%2F%2Bop1h0XMtPsbNXr1zAxRNdMRghxdm5equaV&X-Amz-Signature=021e6cd6d460f0e2b69016765582c793c292fe77a0ae2fa52f11f4490adc92c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667IWPPTBD%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040033Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFYtmLKq98OnlCXxGO94iVR8DdyRRYH3eJpjbmjzNmexAiEAwoyGhqg1l8k43cPKOzB2CZvtSEZgYX%2Fmkrkk%2FA6%2B9vsqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI%2FdSyroOm9jX7rR9ircA%2FRJ0%2FctMUhfmfjdUPyHcvtPoeFLR23cIWdhpctxLEPg8Y6eoZ5D%2Bq6LzFBH882HEoOVMTtxTTuSQ6cfVavQ%2FOWsI5e6DfsHeDiMIkhC6WTpqkhEcOHE6u43dGrXvO0i8bb6CMjD1vXhNfT52VDv8GodRz63bCW6Unc%2BhmIPJfQo%2FOX60uUjI6HRUeOL4ak4Y%2Ff7szIco4pdSCiucClO0g6n9Z7gNd9N9ffS6%2BWyI%2BeWcD%2F4vocWKOYSgGkV23U%2F37tS4HFRMqP1DgqRc1ctjhi2LhAAe3nkW1fTwQ7%2FqAVs4Rdx%2Bwn4q32s%2FTxlM%2F07HVfvdJ1C9s0iRRwkUUrgbVmVoGmNNSTs9ocm2YUMUA1Fgj55oxp6CzCZZa85BDRwb%2BtxHZLSnQLDUh93cuE6OTagg2IdUshTjOvJ%2FSPpUx8gqJ8PrMrtfuN80lhzU%2B2%2FJBFqfT%2FFsQIgKcP5K9%2B9FNyOY%2FeTLzkxIksFEI8O46QS5hg1288dJJPI1L908puf9BRmAGhh39LQbvY4VmOi4QsoAo8SVCp91uyXjgt%2B1V%2F6F0wJJ05oSS%2FTaBX8FfuCWHeQ76qFBVhtOaxH0nWKxo23%2B0xt4XLT8IRxfZsw%2F1bcW1X%2FnH4dKd1lgWsLMOnCn9AGOqUB3qVNN%2FNIIm0eg4kppVdh8JyxiZHoyDf%2FwerqaaMmXOx7bN2JiRaEtch9kv0B8PYzMCICzgiPfOHAWa9STQEvXonpHLCpRwBaFdEwdy2gVXKniqnDjju4gW0I59LSqRKSGoU4jMISJieNkll7lSx3ZbpgYH5wcCKs5UxM0pDXOqexojhQGvUxQ1YAW2GtXgx7u6SGeZwh66klv%2F5yUpMS4uysCMJH&X-Amz-Signature=82ca999451013815cc1bbf95214e70085dce0190affc3c98ed83ed7a0fa5980b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLFJBXU7%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040049Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCdNWPScBX24dKqxlwooK3oNRrVH9J19cBZK514GymdygIhANJH4tG%2FGKNjh1bwVMZwew4dyi70MdZ%2B5d0GEYL9Bf%2FPKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxMKP7Jd9X6baOZdekq3AP0%2F5wnKroN5c3hiSqgHiiZe6spJxqcWiSnKlpKdbus1%2FhYapKJ9bxSsJN8XUZCCrX2uJyAVsltK6G71lKIefxRbIDjy6sYtPdmj7dvmIpiAFJGY1sfXRnaHR33X2J1JwZSh2Ty2gJx0EUPC1XayCkf9UG5I1aB26QjMX2pDzuIyhbhnwFMIDiWpTaGFrncn94pCCB2cSSoWtWR8pVz4%2B%2FElwKQ8dqjGFBcnBy3uRI9RlCydblhbMtuSWO%2B%2B03NFfKBrHfasukBFRNdnWyTfhVUsC2N3SeVjQAV42nDjm4qEs5QSRaVzdFOp64BdzUN6jAZEkLmvDv2WvdKgKV2%2FbhlvH%2B%2BQJsEqavydoWr67D5trkIUjcNZUHfCKl6AZ0iG6IXnd3rzbBeP6V6KcQ0RoS5y2X0xNKzExQrhWRHQeGDzWTISVAz4VXg70wC9hDM22R%2BHHal%2FttnQyoLtTcR5%2Bz4fm8L7eCugj0IygEIEKyHq5AlnFFZf2j1LmclfKNqtP57SJogOi%2BiuAMR9KdxDLJH7ia7WLmGMJc0CZYvJgjiI%2Bx%2F3ys%2BnuFMb1VKllfDsKJR%2F0LwiMbGPOijoPxt6ZiNE5bG5x1NCCyBGIjkN%2B1lZ8ldj8kdhgLbzY%2BNqDDQw5%2FQBjqkAaKae9N6bW6ZmOjdmSPq1YZ1z1xwK0eDjO4IG3Jhyslqq60lmWLQsbVuvcnMCEyyvIWtcwumAs5nQtQ1ziwUsJ9YK2HGbzLP46LVXnAcE0AniElDO%2F38MEptKtqoztLS6CE6JRJtyalaMZk5PERoZV%2ByvAvVmxFGIYB84VBfAIirzB3gYMQ9dEEa%2B7Kk0YF9O0JXE9zBQa1sUKqqqMR4UULO75Ve&X-Amz-Signature=b534d110b2f9962d9d44b53df3431c3c955b1a7060ccf08f86d793082e493548&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHKNTC3E%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040050Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDsunjeCYbH41jAMFu8vCmMR0XdlPuJV8Smn4WMGFDtbQIgF%2Blq7WiKCRy4o0z%2FrflATJ46BP4QK5YzFkFWCnvkL4MqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBCj1F%2Bl39iSYyxE0SrcA9Jt0%2FKwlsczIzzNdDUBM7Fbhm%2FUnKuS6LUp50D%2FwHgbI%2FkKCFPwIoDqxYYHk6eFh1dNaMtcvSgWWVTfXSdzPq%2BFT%2BPu6rjfKMrIAcOdP%2BOzAH93%2FAKjtadIzKByFFIOV156to92oHuEc59CSDV5ADxWvd4ptg2WYH%2FsALTJr3TgrHH0aesCv%2Fsu2Zfg7lQHEFDanr%2B4ynMOX%2FsPtzdcTT4cOU4zWvPPZn%2BbCbQhYSIPNXCZphnHdQCc0BObNFPb7Z6rzEIi0dtuzyteuk%2FQdp9xvl6T3EwjMSzSq3yCEFdpNRvorFWPy4daaCr9egl%2F3eCiYI%2FKejNaTZCdpaKdctjtw6jZWdlUBkE3Q%2Fn46PRuJ5LDxqqCyQkyQaqcJTwybTyhyzp0%2BHYDT64wXY4vyvWpsAszchDf3Rcos%2FLorUqWYVNRJ6lWjnqakMvxMwmRbTUcrnrwD2y83SHzbKhlPBRDDwP8Hz09i2KIaljEb3B90%2BBFUhvrzRw55KBJ1nd6N%2BKnXMUFTYfIIW1OdKflA%2BbrBjADT%2BI6khqBQpC4oVyonpFGLkGBynxnm231xRNdP1e6805QDhJnPy0uOhqJJdy%2FMA1fk8HjjHBbN06TpCqZ4ODBDoKYN8hhEo0kML%2FEn9AGOqUBI1jlXXBgkaWIXrFkGRzO8aY4L4iDCZYV4tXDiJNyy4vNAOUAnXCHHclOj%2BysH3w9jHWW%2FyLjltcNvs1je1EhGD%2BiG%2FaDkCFpXHALq3P7LZbHOQzEK1UABnlYSOhrhM6YQUdG0p346mfgVZJ8i2ha%2FrLVUDeiw8V7uZk1OcDli4dEO4kYa8zDezXuD5vabPotrqaI27Eqd1JBDNQIXrmNOs6Txktx&X-Amz-Signature=a92cf4d5418f11c3bdb2628b76e023f3385a34942195dad29328e694bedb84c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ROLLJBEA%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040050Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtem%2BPNHc7qru1vKQ1ojrJ6DUqCCNOJ23Nl7rP%2BZl6EAiBRdX8ywen2a4HJlHkk7C0nzCId2Eu6Dm%2ByIFZ7kMRxmCqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMlBd2BZ3MGh5Sdw9EKtwDVk29wCGSYhD4w2z2cfJ0HHIw7DxMsEAS4NKiRy3W9NrRpLoOOjEoTSjw1EBbL%2FdonF6XpClyCjsTlBUXQv7d%2BJEFT5FB4c3oauHlOCU7y8WMTfRITT9Nm6k%2BtqojU7cbTldEOu2bxOfV52cEodhbh3uouSdFfOTy4xrZ8CqDLBPFWAGZ8NbBsN6TmTCLtXeZWIaRdBXtiTdVqFICccPiAhngX%2FLrxxVgeDcdtC8lYcdFZ3uDnfl2bNZYLYxeunjukvkoiSyOvbLCoPW7atRxhjoO3Py9WiHl4Z6KaE9YQNpCuKxBRlPHz%2FK%2FFyoNy9Ao5h831SxmwNk9CgEtcLAnsfSXnuMftWLGQ%2FbBwqZJjH1jdCT1dZX3jNFonfEp3sV32FgZtgoxNhx0bA%2FUXSo5TBLjxc13c5S%2Fw7Eja5ygLkqcF6RTh4MD%2FIQQ%2FULhIblHVgmWhmdgEjau9fWSUvGYed1z58Jdmx%2FfDh1Bf6miivgxnlbFkTB%2Ff0pbjMQwbojGbokdyyxZGlBvYPwA47sOp%2FxJys5q3mhrUwn%2FsKPDtm6r%2FZMzA8Wizsz0BZ9cwwlgemYIrPFy3e929jhNOSqgLQThfR6m9WMi5jXKFettpgfYd%2FwWO%2F4jfNqRXGkwwsOf0AY6pgFqoqCxQBrBngZS7Qr%2FqeuhZFIFkB6zApSdERlRSQg8SuW9Oiwd310UqtNQcUW44lydFArA9csOjPbkdtxuUeReh2ZxE5jT11s6j9pwx%2FXL4vc92UsjVyclipE8Jvc9J00EzmvfyEvCu%2FC5QiMI72UI1OYKOj22Jp6MjfqRRHp5PpB6twctdEhl2wp4L%2FqZ5th1v72koCvGPkuqLVW9b62Jman3gkZK&X-Amz-Signature=f603e9c3d15238720e54718a909b63cdf31f38620495aa9b2dccbb2d74543979&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z7UC4HAN%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040051Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCaXuW8GfYdn0VmR5hgQJd%2BmJMYx9VGjBPAgVLpRUXFkgIgYZ7wJkxdvROUyZkNF09hZfYSUjs7YI6oCw5tFwa0fuQqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIW%2FvYvDYtVa9eU13ircA5utjfTcz%2FZH4kPgcqio7QsBbRmgbeCOdH1ANg5KX9hoUb0ng5WGD51v4F6K04wwihJ2%2FTbt6DwOurLnG%2F%2BEp84WFkKi1CnjGHg7uCzPQo5icmgxG%2FE9ihBZqenCs2bW0F6%2FuMffnAtZGSq1u1RWRZIIJFI22rM%2B8Af%2BsFJcsTstOkzz4Vro9IBEx0T5KR2gDOFx2Onah5rCp23fcTAE5ImjIRNVw%2BF6wSYBX6hEckbdsGedLlTa%2BcAXdudZbX6UrWRFlVGad1vAiYQUu%2B3JaVRAPuVB%2BcQfB5dnfPGtSAxgYVB2QPuiXpuCp0yVhNFcH6i4CV1ZxN9QTEkO%2BS%2Fz7UBd4abNJZimK%2FQICYh11Omrv5VOyq7KoSygaIhvn%2BSgQ9JoV0mkQku%2FFxO1sL08n7GCEbmHyZSSMWvbal71yxqvkgfEazNFmZo8NEVubmNZyCYJn5kFCa3f8QSIR0d%2F2jQlm5Vr1eP0fsnNSqQsudT0OchL1MNWaqCK7fd8i1AwvohAYBNGkBu56sduqf82R8YSiYGUtD5q2zVWsTufQWfX%2FRAXWot%2FzRzhZ0pNMDx6pDyTlxnQheJlEJbiapjDQVkJvFGfumtKwPWnYSqaeGilhVxhao6U2pUVAVOIMLzEn9AGOqUBalGihUGrPj7rxtRr94O6mTdwzZg0VKT73Mws3FVVzgzUGGZeti4k0kAYhFFk0ouGtumiiUvAqvZWRkSKzSXqGmFGaUXeNwP81q9mw6sbWFUY1qm9BvHspGkla5WAIwQPRe8fId0GWiQI36o2r0xuetU%2FCD9N7gHYXO4sQDqRfapdaYSk2GPKMMaD%2BStpFswxlxeAtNE9do46xQq4ru5b8z%2FuRc6%2F&X-Amz-Signature=c211f92f9cda8eb0e22d6417eb5b1662b68d60f67975249fa5493125e2131e68&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VEVBYNU4%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040051Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD9N43lOiW7cqlOGEAwmLW%2FRAFFZDaIug0lt%2FbIyeOw5AIhAKvtIAH5TrSzuXarFaQ4z7mT1VlOypikNhwza6yJXuEkKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxZ2cN5bzSFAVUaLMUq3APXMfyMX0vtJFaCCwhSMkOrX0fibOPEW9q4RGeLm0n1q0vgszQKdmuHhVV0tuixEWyWgUxSgA%2BqbODC2oPQnmVshbxuuhfnSwp%2FPh2%2FnBVpw%2BltL5ok5r24tiO00w24ojAZR4BDw7fpSEmpgIbI0byBLZRTMRR54S0iy0U7nuLS%2BIU19o%2BGuwCPL0ClEKQhMLpYwMrnp9HRmvGvk7UdzbRfOscQ821jiJcCNzdRvwwqgdr0gRvQ4YUpjE%2F%2FxuW1C9yPhd%2FoIs%2FTZLoNfpvJwnq079O1zpqQ34ATMNv8eVnUi2Y6faqDfiH3n2iOYenCgO0H6NON%2B9j%2FELoSf2XLdzliUG2ovc83mQ9soOqZCS2OBj%2BPVZwg62yXW%2F0HeJIKiC7FadOsHBF0gCiiGEfcX5JvdvP6PELBdFXccHMqdpXgi0S3B%2BmrCfnO8w%2BsQE9YFS90zxVo%2FRUPIhAuzGGBe3Ml2vTg3lR4%2BAx5EfixXlpfyEaM1IbdPyjLeEkLGQtibyNlz9aipwiodjKAzFK03JtLLXJT1Gv4HpCkTcPIldYTaJXZc3u%2BWfIhnYLBpWi%2FwT8qLClnu3OKCIWfGUH3lB2gzfldVBqp%2BFweMJqlIa3LYz3F6CT6Mfia0lMdBjCYxJ%2FQBjqkAW9%2FIAg7i2w9suucrymie9leb4xcfRrfhs5oCQgLBU3QbcgEA3FkEYEUwnyu897IoG2TnLPpC7qQCRqtLpjZcjwITU1uTdPxcL2UBswf55VRvSWV8LHRgvz6PHzDhXoET6EStiB2Bm4u1V5nkFtZfNwiaJSX6EtD0bgww6qBuJVHsDF4SBn9vnJDrJyGdK85pKRRKC7Sy8XJdR8p3QDNamCMiKd9&X-Amz-Signature=0659890305285a38f46ec4901aaf6dc11f8736f51df9d51bbe350947229f09c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T5RT4Y5R%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB8bnxn0a1ksr%2BrZN3%2BoVp9CsU7kldIWUyo8NzGd3Me8AiA%2Fjg3hIcChkTF8HT70JBdj2OSazf8N7oftmcWlYQwBXSqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5al4QXwsv0XgUPrRKtwDw4l9HIdl%2BsBs9LKCWf7BDmrY6YaHtOtY2TlxLNWNfp6DLx5%2FCsRgoyGmrg5YP8CLV%2BQK1WjVwCglXF539wGU11on1ED%2Fquzj0nMo3tQSpSN8sv03PUpAuQzpGlZHjbQt6RisIcnnGZWfskv66gCHanegeuZTJGRQVcqlxZqLJyFjMH5Z6rg8dTqhKO8wa%2BIV6eFbLin%2FwR9knzgggVYjEYwozCt6xN%2FgT0%2BaBJ8mrjoKlt739gop7BEdbnTIl%2BFZ%2BsvSxE3kVercirSjzTYnTcg7ZGz%2BRMtOZIkaAmHRcTgPDgUjaN4kmf6s0tBlD33b65%2BsjvbZntyaQcvbJJxu0l0tWPdMqAVep7MSYL0D7feUYWz%2FymVa334qSeUqYL9afthVkPKICb7b1ADB591riJFaZOuMt891Guq5X0egFNRftRXGX6xM%2FINS1VB21oB68uA2U7LXL7hGfFK8Jc%2F%2FWVjiWD0V2QLFlJwDpmYx0ZpuY8hn3WtHcRwr9DHtQr%2BA2Qz3qUve7eqA%2F4BU7b%2Fngj37M0P80xd0blECYndM%2FNQHwrvcp4w21f%2B9WdyUozgcaQ%2FAlMCQZq3P7VnUcLMRUoH84oEGJzUQnMMjA3a9CiQfTWbJaGyA4R4AwXkwtMOf0AY6pgFdfiGTGWOPBvQpDjWsy1H1YjYirUVic3sZBGG%2B3FCDOwl8%2B3Y21slfzV0ykb3ZdxNwcjkfI%2BOhzcSkASb2lrjV03b7ZxObkVKwDyAKcV5izPjMJc5T%2F%2Bynzi0T3M6zj1EVPw1BU8UIweZrTDr39xBFVsTgHivQSirdLV%2FPAOhyMY6k9Q2UGU9aPCjIheG3Y%2BoaG9Ho%2BEGSOHk4ujXIaXbL49IcZqNa&X-Amz-Signature=9675c9748a2ffee8cbd05f4d21ca855be9f1c1e1b554df87b21e670246b3780c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RTGMBF7S%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC1zlsaUKTSeRu5MyoGVaEUpCYLP4jSIqv0xVvNwmXrmAiBP4aViHx9XeIvj%2FKhQ1KyN%2B%2B0IsY4f0T%2Brtzv3PebSfSqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpf0nL1FYpPPfOaI5KtwDYOFKGtefNgDnXK6iM8eqTCUkgzPyGGZx%2FWaEzBuZonGNykj%2Bj%2B%2FUdnWoNbVv7AzXj0xCfZB6592kmJlBdIkAEEYPlZQDf%2Fv2QgX%2BJ5fkdugtpbCIgULSXovmR6OIeXpm2LTRDCs2ocpRRLgAFnpXKau0CG%2FkteBHYASLCcF4tk68R2aru9gn%2FcEffr0WFu1lGO%2FYr65fMFLajFANLkhNADXRaRNlY0bmOverSoEOnUu9V0hGruqarqFDsYO9HlLonI%2FqkpneOmyZpWQFhMZEXOtyAQfXOjkYqlAmAoQ%2FNotHaYlqU29Y0q%2FXhCNB5LGQo%2Bt5a%2FlewQsZDXvSKOsYKRCj5eYqi%2FgJi%2B1Q1Pmm6GYK5wUOSJYK1lGOOdCBZauX3HbHNDB%2F5D%2BBPM4Xi65AI9K7bCpxjgt4JA45dkG6ddeZbQI%2FjMPYqsHmCqkyj2duGzXBHHqr54H1zBBotqQixmcscCnWtE8UfWpUfmdMx9GPK%2FMM%2FUCSe04g2V0JnsKI7BMVRep%2Fdy7uTXWrgB0Mo3x2c8eHHRBJhJ9dP93bGQ9qW3ykvRM9Bm6bCGeEC6bam%2FgkGCWSLP6OChVnfFG5GSzvN0kTnzhzmX9pUluzODWpstZ0trhEuivxbqEwucOf0AY6pgEnf%2BuhP3xdU3iEfhDAhUJy4VY0SYws68mCd%2FFvdXSB%2B2OPeY3uERv993G4cWixjw19dTEJ4bEQdDqV1GaPblzDOiepbgkDcl3LyZzYCO4168B%2BzgIUFAFe618p1HRiCdK1FtMzBLLRozK2hoJ5xDYIoxayNb%2FWMXJ9ECTyZdWrAvo7f2LptoFAKc681q4CDnLFeczSA3pzlB0HDs%2B8FZIkBD05mIQs&X-Amz-Signature=713c26c11c279df5048ff0150417f5638e665bc819d2f4f2726dd4e8f12b10d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QMJAN5JF%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICnWLmU9862i4qyta%2FyBckAJ00198vXJP%2FE8XyY8iigcAiA071%2F16XreNipQ7wEu9m2gcOQ%2F3jWE8VxKrFGHivOLmyqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoqqZYIQNwDESWZkjKtwDTcNMIFko%2Fnh%2FoTZ64Ag9nwDdvIrFyHA%2BlwTjIwrPKtfk5aZIqcqYMAEj89O8Oo8mvHseDEh%2FdzgAWZS9ocQIIYgR2qyVKth0zROrFMLXsbieTXblDe6cTVfJ%2F9S3Zz%2FwHQoBjiZzXs6TK3nupkhmnolSZZlF%2FEUSSB2yUPDK%2BFLrj%2Fg%2FDfbXCmGubxxijN4%2BTMgw1A5baNuuU3cVzrH6nHgJ%2FYPitjr37P%2B1c8KbdOQcMdi3W%2B2mziATx0Ovr0rE62t%2Fba3gGMY6FW49lg3C7cYdRYj9MRqY496n%2B0NdIBeTfGAUPGRtUAxMMOfIzK%2Fy5X8v46jFXr4R154kTTlQcXhLUUAje5g40sS9%2BuN%2FZz58E9yL2VT3AM3wTmI72xG5lQC9Zso8XPTIbWrBHYV3a4grmZIgCTf7STqQpSQ31BAhmbVAwTDYcOqyV0Nn7T3f%2BJ1h66%2F9HJnS0iKmQh05J0qmBm1F8zFfcPpa95lW5BrtRUe18lpL6HcL9z42mnrrVBiO1q5fZgaCEV2xG9cQ9CcH18isBmYHB7SW7ajmdHHFmhU7ksGpYUt3tjtkOIGLTRkQx1j0RGDLYjAzDxujC0NfG6BMc6qPeg39LRezdVNQh1FEzQlqBbPlvSEwocOf0AY6pgFEoveq7aWdByYr%2FcrZLaz60LLVDZaEonXA8RIZTY2gDT2NwEhUUIY1TnXHkSHxZiFwaFJkBV%2BDBqjTTlSr0ZNZ%2FE5HXfvxc0ijeAickq6ifCjkfRmKDsu6VqqVoYO0AXXWEN6r1JKrYfqt8DvnNxjifz7sgiPjUeErNT87QuyvB0QxNpLngWGB5NLQe0n70GsHL8sjBg%2BmFfnz1ABQNPRTNHpVOnXi&X-Amz-Signature=c22f1e413241fc901244ef76624beeed45e6357d3f3999063c2feb5d1fc5f324&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMS72KXN%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAxQiT509%2Fj80diHxJpWFQZsY5CJc6Hd9zOoCZ2hS62ZAiAKkSFEyqHbhwC7D72xnWIGz7SO5losuaPEZzi8NUW5VSqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM6fEKOo%2B1kiaRZU13KtwDru1cX0LsqR8Aq%2BVT%2BaZQubU%2BQJxbnf0%2BLSkrw5CP7lgqkLs9QrKCCYCwfvMSFbGZ%2BbSEndVdlc0bYoMj%2FVevZuT3kT0KF29ZdgdbEF%2BzEH%2FDHtdPe%2F50xGU3ypPdlZs3yy53h5CUIyO9wFtLX6OmsOTOw6djH35OjtO%2FqMsiMBBy1rGVZwS%2BEkkOonDw3N%2F62QwMHLOTODmN59Mc2qieubeCf5eA%2FMHn45qkSR0cBQHvK%2FV7qIxkkRcuWGYRV0GiyrFnbuL7wyOOSq07zrrfuKOw8n0bN3l3zJ62tSWYejOCl7urhT3YQN4nEn07nRiYSwIE%2FbPvx8bFfgbrvty0E3jhOXhVfxpslef2EWItp2icxs1ZTPQTwMuI3202ln0r00ocygXFnAgtIYT%2BrphuSfj1Ee2YQ0hF%2BzFc0Eb92Qvmu56UayBL%2B%2FZmVw6Ki52Nx5bJkLRY%2BmYXK2QZpb2beufJWvz0PkuI%2Fm6cyHzL2ElQTOEkd%2Fd1nGXULyCRgmzfmudo1g9eLWIhWCx1%2F9fL9asCQF%2BnABaqiTodx1T4UwovlUibUWAnIM9L%2F%2FlM%2FygcDJgD4%2Bkq3S%2BgZcgcTymfnW%2FZXGe9Py24NY6opqEsBj93MHkrjaeD8c66VIgwlcOf0AY6pgHsJn4Z80dTEL7aUvRuoWQhfVeJiA%2BObaFez2COiuh0DkUVbp5z%2F3VIaZyke9zCjBfP16uYY%2FXKu7lLD7PnjDBiKVjabrN%2FCGRJdghH4QcrxmADI3i%2BRkZdUdp0VA5SnVqprvw574nNjBi%2FhjR0MkyDEKd2HE8qRPK4RVwCW1R1VN7upxSWTR8LbjvTULbzZkLRDDLQAFEnhkDvquXO5AGNvOnOxOFK&X-Amz-Signature=a356d27830836af1e2f81fc4e56ac7623f0861c0aa86914b11ba6286d59533aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673O2KUMM%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC9sGZ8QwXpI5HxU9LVd8X34AGlkhYAYCmKyMW6EwuOswIhANeVEKvVDwbyAjq2GWuDvQQdlkuU2gEagNqYi9O3iH7PKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzpiBoHXc%2BicLFafJcq3AOIgqTO8CZACgQV3%2B5cE57hzmMBqbXVbakMaLzlYmv0LPad332MAqdXanRwavqUJqNKt%2FIR63zg6TuvRvLSjnxYiEUxHfhzmarSFk8zs53S4lYsdREzrFr4iUUc8EyefZXRhBEet%2BADcMHyzXUlCk5HdYyFzNkcxIn7MDUz17BPoxWwrWUao8vOfHdzzQmY85yPxKtenRqgKC5%2F3B3j9PrSvmXwJNRycHSFycY67YFCYF9J%2F7s%2FDvXzC97pcNYIHMvyhsgG91iwqfWuljFfPnCk4ciPSk%2FVMmJyRNp2956bAvY%2BMXpu96Ty0gl6yVQT47Dc5ZhU8%2F%2FTsWCyv0m9g8QMCuIjqedlYKukyf%2Fth7a6tUONqPVj8xf7KXMLcB%2Bcsjr5SKUwSgZf9vg%2BsJrrWRhHGhINfo4CIEL6iP1uNrcFE%2BnKU%2Fw9JyA9p2jwNhQg3cB%2FJgfSbb7sFHHviYhGsws3qw4MyyfBFPgVA0TAZ8w7%2BJeGQcPeeBi9AIh17nK38by%2Fppvql7%2FoFWGIobAWdCimAkaT3XD9EphM648OyhT4641mBK%2F81E4vwgQGQ1iKryw0hJRdT72YOOLxfoHt6U169aJ43dqdA94%2FnNtf%2BISxK23ItXOcuQVNDYIZ4DCJw5%2FQBjqkAa2UuvlFrxJskoUh4b6w3%2Bra%2BoXma%2FCrzDtfuep%2Bdd0Gt7vFXbC0r5%2BgMJDPee5e9lmCUF5ptQcH%2FSQ8hNWKpwMaY1mno2mO%2Bkql6ca9F85TYsMbjEASQBcz97WZk64ZyNNDLb8qXqneiKP4BMHy7kAbZx89K7wzr0ZFVYBx0HZOwVcmnSnbsHtSgv%2F15Vp6DHfEqZMyXyTH4DV0AUufFoxsky%2BY&X-Amz-Signature=1d6e9883e3d84e9c1b53efbb5d848821940413bba9e5a7396bdfc76a00e06c97&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673O2KUMM%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC9sGZ8QwXpI5HxU9LVd8X34AGlkhYAYCmKyMW6EwuOswIhANeVEKvVDwbyAjq2GWuDvQQdlkuU2gEagNqYi9O3iH7PKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzpiBoHXc%2BicLFafJcq3AOIgqTO8CZACgQV3%2B5cE57hzmMBqbXVbakMaLzlYmv0LPad332MAqdXanRwavqUJqNKt%2FIR63zg6TuvRvLSjnxYiEUxHfhzmarSFk8zs53S4lYsdREzrFr4iUUc8EyefZXRhBEet%2BADcMHyzXUlCk5HdYyFzNkcxIn7MDUz17BPoxWwrWUao8vOfHdzzQmY85yPxKtenRqgKC5%2F3B3j9PrSvmXwJNRycHSFycY67YFCYF9J%2F7s%2FDvXzC97pcNYIHMvyhsgG91iwqfWuljFfPnCk4ciPSk%2FVMmJyRNp2956bAvY%2BMXpu96Ty0gl6yVQT47Dc5ZhU8%2F%2FTsWCyv0m9g8QMCuIjqedlYKukyf%2Fth7a6tUONqPVj8xf7KXMLcB%2Bcsjr5SKUwSgZf9vg%2BsJrrWRhHGhINfo4CIEL6iP1uNrcFE%2BnKU%2Fw9JyA9p2jwNhQg3cB%2FJgfSbb7sFHHviYhGsws3qw4MyyfBFPgVA0TAZ8w7%2BJeGQcPeeBi9AIh17nK38by%2Fppvql7%2FoFWGIobAWdCimAkaT3XD9EphM648OyhT4641mBK%2F81E4vwgQGQ1iKryw0hJRdT72YOOLxfoHt6U169aJ43dqdA94%2FnNtf%2BISxK23ItXOcuQVNDYIZ4DCJw5%2FQBjqkAa2UuvlFrxJskoUh4b6w3%2Bra%2BoXma%2FCrzDtfuep%2Bdd0Gt7vFXbC0r5%2BgMJDPee5e9lmCUF5ptQcH%2FSQ8hNWKpwMaY1mno2mO%2Bkql6ca9F85TYsMbjEASQBcz97WZk64ZyNNDLb8qXqneiKP4BMHy7kAbZx89K7wzr0ZFVYBx0HZOwVcmnSnbsHtSgv%2F15Vp6DHfEqZMyXyTH4DV0AUufFoxsky%2BY&X-Amz-Signature=1b53d07c7a365d57ca426d4679e7d60796f44494f7a16b7b2c51d953b942c750&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
