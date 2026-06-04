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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q3EC3N4Q%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050416Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC3gZfe44b%2BLQodhrQIA%2FaC7pPMSYa%2Br9Xo1wShNusMxwIgXl%2FR8JSahGDLb3ZrCHpyB3juIXC5I58HqZecuAS5TMoq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDENRvhWtspYrj3ywcCrcAwuI36UI1SF2jiHMA5UMHL6bZaBknWZI8p7mEPjtu579MDCo7ZI2L4OBrrbdCUV8sziQy0TifJieo9EJpTrRP6HpOq1%2B6zcBmQL3hFaS%2FIxlSwinpC%2FIbiCJwZLdQGuubzwRXms%2F0bWCK1wYiSvgFBIiff0EZrADcooaCu7ljuCFUNYxCOIfhQxmnzRIq2w18NS0jH8oUjUSjn644We1q7cHaU9T1EZnQlyEABeZKJfjLYy938hEp5fiB1nENlcDWJKI0CXlDJiNZPPHidDcRqpijKWKDvAL4TkPFNTyfP60qW40XTbUKSS3hFCyHUHVMCOW6C%2B2Sw720mIwFmFSKuyw%2BmpT1SabZA0sor8SvX2%2Fhrg%2BTe2bcCmaCJmgRpCwxzevtTS9CYNhrSe%2FQ%2Fm1shBWOXKSjJoqR%2FMu0eGVsCYG7d1kTijAEs4Lli%2Fk5Ytpg83FoiQzIr8yw3qC0q0yYL5U7spl%2F%2BWPYgwoxa1LUNobjN1iigNC9q%2FOdWXPKDGmhOXD3aJEvMNcczPPH8wQIoSCGT5QzyskODIPdwuGXDk7Bjvnenp%2BYchlG4cx6twS4Ahh1jCbG8VPkePH9hBiLc1qaYNarw7GHtsH1Ic5sZe%2F%2B4BhAX6WZzHZVKHCMNmChNEGOqUBbCayhOPcmJdnEx7BsUELaz4EusjrLeiRW7fMWjH0IOYyDfukXYfpgW0fnfKinvKpg6I06BVqWgz69qBHa4iFf9SH3DWBErU%2FrD7ULn7BJ%2B%2FfAwuWT9St%2BKORLhaurfor%2BcfIuggdJOWIypMVnmqmSs%2Ba3X0KE%2FSzFisF10u9XLyH%2BQ7RQSOIL8%2BHu1BR8WCksi27qcvgUCz252ftnWvxgV12dHnu&X-Amz-Signature=61d680f5ab7fa6a3b24fdafea8ca3c7412664bb5963df45485968a28adef979c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SOKT7T4Q%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDBKlbOSRY3aPdeu%2FuiXJkq9FTrU53k2Eug9uCGfKYJFAiA5qaApZyLXcjSmNPGcRhn9pfu4Jxokkax6sY3o4ruAGyr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIMRcyjrX%2FHfQ0QQT3kKtwDP2klu1nXRhBKpUbfV68u6B0H%2FQlgeL6uURqth6BX0IxrWzDgasH9vwr8ZlhAlIjBhSLydx%2BJmDoNGpELHkiy4BZOhj0Bm7oOfB6FZ00uE1BTJ0mmhIttvFLa4%2B8c8xuNygAOT1dcWi4OFePLsId%2FVk%2FB6ijKas%2BZIf%2B31qI5gaa%2FzVypc4dC1bUtuZcU4zj9PEOFRGz4RLHSEopS3api1E8Qc2hn1exuNcaew%2F0msVUV9jpEsYZ775DY%2BT71NK57gDtQYtj5nDX6X7qWEh0JmQDoyLjPerI1A6KKZbwZtQIoG2d%2Fsdr%2BNV3TDVor1MBdNPPyoWxEZPd43%2FqY3PovX9Z7Ayi8w3v5ZUiIT9w9PxggWMwRb0RKkWGMaT0VYDsFzyctmPnr5sZ4nZXFBAdtsqiOPSpw6VdRRm%2BNoWGgi9RuzLS0vZxNLTYxJn4A7ZwWJdv%2FWqvNIMcQMQoElBd5SHI2bA%2BgUfLqvK%2FYbe506XMBIfPpoFEtewAddEbK5UJB8BLVgyMKk09dCIsVFBQLpytj59kRaZLFLeLMp63lMilAMF9c9Rp4vUUtkB4SUOWIsxxli2cvmHfhhof%2FM8gNWmdA5Bl%2FSJ92pffz1OxhCE9YyQ3yL%2B9OCeSRkHMwj4SE0QY6pgEcFpT%2B7z0WglNtLlMng2HGU8FPMI3ZiYwd10P41ystQvl2jefF7Do0I0ZDg3VT2Wcnh%2BZKmyydOWOK4GVSPjaTjIuqI2wFOzLkZwTlsJu1%2BU9OCGPETyrgTtt9bXlxsd0Z1rlgyLBPlLdQpIYYQTNgVlRHMH6uX7uUb79hnlyo5M%2BvuFPCOV9%2Bw%2FW2W53faTwIiEqENZ%2FDQRrAK4HXaWAeFpGPfFee&X-Amz-Signature=48f07b8f20be95f6b5976569f7ebeafd2aeb26d572a021852096c46748974b12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667XUUSOPU%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050408Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCOvieXYmU1uEGGigtahngzoiVN0hPLuFh%2BrP9ViCaRNQIhALlsKaEl2KyXZyRR8vIr94jFYB7tGOORbjb7rI4msTBpKv8DCE4QABoMNjM3NDIzMTgzODA1IgwKKoBZqQU3yEJZwdMq3AMBDxJKXX0QQpWmKG6HwHWhUmfuPkw13k1RYqfD3cFNFTIerZJaYnMhZNQ4qljCbrwSdubQv2K%2FT6aM9rxeJjjy90qGWK2Zv72rYR9HaKrzxmczxRDWypEMVn7TsFCuHELRUxHVBgd1A%2FKpAYa6ZB27Z1VMpFXgQL3nliLgFVOKuTDMGuPwXrFyYhmVAl55jTDAMXx0fd3ZT%2FZ9CAxJR9z6PSRzi0PtORZjPgJwJRtoBet9QzTEU%2B9Qjwket2HrWbfsrgt4CD704XPA8EcUKKTcLLsqfgbV9BBQvSu%2BhQdq%2FpoALiVZnAsL2ZKjZs9rO7Uxb8nkwtdK6v5jYypTvkIBiuc8oWmoorBf1X1t3Rc7wCNePDzhrW05PHJVf%2FqjWpP6eX0d7%2FIvqIXivenlhRQ8kr9DH517vl2BI2Yf%2FzWthg4Z3YJU5OaRj0LWSeSj%2FJhHy5PdyBfh9vdXzaDR%2FrQRGd0bIspuWDvdtJTuYx8FLmRgSc9%2F8%2F0f6DfOReuMGkUPVmchotQWmzNxEmsqrAhYQARcQYWl6Ey%2BpYkah0PZgD6DGSPwpb0QRrwchf1izDQ1RgEnOFdOLw%2BCvlGNtoDTgt7d6V9%2Bo4HU6WXdo6KfphqUoDndhR86D9RDnzDZgoTRBjqkATlkrCLOMucOtqJAJDxNSSb6cCUaPqiG2H7%2FGvuqPWcaVIzKffHqXLm1cygS22A0KKsMNsvwZ3X44tFb6BN14QyUbqcSBeXh2BJQM91ix2FEQXIl2hoNIpAKpIyMawi8pcheuwtS%2BVEsCesZ9dIJxeDPH0CN7n7LVXi7vxsWjRMbaavHpTamHj1glmXm0jxeF9%2FoqggpZYM4dtJChq1Ak6bEW4XG&X-Amz-Signature=61300271eab14e54bb8d036d635b2f30b9d58495a75ecc35b0458bc386ae4051&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZSUHRVSA%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICZENa%2BaLihvtH3BSe6s8K%2FP%2FPb3rWY%2FKRAeydhafZ1kAiEA%2FfhKbncDsAxgl7eSKM66yHiziwp04xmtZVgRtdGBZSkq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDA7%2FFL2AQcahSGj5DCrcA1wi0m8kRkTj2eF1aiLTfugETM3WPUmupr77dsXD5AyuLwM2UYaLCwEuwEm2TuYr0UdflYqwOvYJ2f6kr%2B1VwR65yuVmahsJ2JFUKPJorvDrqYJlzKDtTBeDh%2BrA1W91qbHqnCHFpkUm0HtJJn7PVJj0QdVI2MFMwD2aq5hfJyr%2FCjpBaAe7m%2Fc7AfCnCVLxTP%2FFnjW1JLRRjZT%2BORvN2DwYBCA5THwWxt66zfK0wPkyHui8Se4DVbnxwEGt2W6rn0hzM87dIkdBx0im9sulL3s90Q%2FgKJqhEtzS75KLXJQf52Q%2F9By9RyC3zruBbGI17wLktQJZHiSvZQGbuP8d0DOWGPYTbPSO0qKMtCV7ugurAubxld%2FvxYDRMPe4YPQYqIpWjQtOOG27bj%2Bkz6%2BfLRYtyPELCqlNkNRC9mDTSxbJuA%2FRTwq01doaJDeqHGywERoFAxGYaUjkv0zvsTtUMkhWVAFT9DAmFm424OtLjh1xklnWdWDRxK%2BUweRyn5cT2XXgDv%2FF%2BhQzgLpJmFTxj8XLT80fuyjG%2FlgOfMH0fWLh4znGT4BXi21CWnIkCmi7akkP4hWr%2FUlnk1bRHfhhaUbKfG2IuhGvnQQ9pDFcj5tTuGADSuKMmJe25noVMMKDhNEGOqUBbdAE2lfcmlNrz0ApP86vyKTzKlKcYVB5UqY01hnX5guHTbAh9iyO3vz%2BsWKguGreAUxoyTffTdU0ayTlkjTQqrbMMt4rE1xYDpDH2N76DG2zLP6KYSxYw4DwPCIjasosNUSBuoB6GAqYE%2FHwOjhTYej5M7cOHIKN5LE30xCnk7Fj6jHo60u90Bs%2BWpLu2K%2B39OWEfrh%2FCLh7fMixoZMa%2F0YwpzO2&X-Amz-Signature=59a055e881d25b5a7253a530bb8130e51968ce34423a437cfb72b532dd074f31&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQJ7L7ZD%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFIV0JNCqhgsa0G8doSh546NI%2FOjTfuw%2F2tstsPsVi8XAiA%2Be7pptt3kZ4HfWPHvgFNZDKeCAy%2BZ9n2q86MV%2Fbsznir%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIMGYjglvLUTV%2FJg9DwKtwD%2Bah3OYdvO4Kha9LqGzvER2yh98RHtO%2BCruyf1im1pc1JIPHvPDbQIij2O9I89xl14WydzmLdpn7WuONNp%2F%2FWm222lwUEy2bTmXF%2BqdX9XQ2q0DtNQi%2BeYJfhdJkoY8m9lKTqI8yUiiIB%2F0WdVfpz3Kx6VaNWQ%2FnMGmKHoCVHXHJcSVCa1PXLGdpVc0uqixXTsA9RYiBra%2Bdc1oHveXj9htgTGbQP26l5WdKFEDVxj0Qr8NrQcIFrMfddM4MCZFVOoCw5j50uv1AqI%2FnGWU6%2F%2BlhVdfgfxZhbRwiQabLTwUmgJsEtLk%2FL70jVph6YD9S4CucI%2Fi0bwNwPw1Y%2B5s22zP1QVN5U6mauucW3Th8SGPV05TH%2BE%2BluFvZWPZTt%2FQITiR3oiTwMsDTqiX3E08Dphn%2FhbygSnRSl7skDy1deQ1Z%2Bkeoe66%2BtJoiJDLC%2B4WvFPnWcy14e4gxmR7NHMtn%2BBPkmf35qXhjicvnyDD9ctJZeLalmsGKZIIQxA8VAadG8wlqHBR%2B2zw1fl1zCVE2HqFZdLb7mcvI9hc0MrAquYigIgUtbAyusJZHhhp2v%2B5fwif8ngUpgmhOJg%2BL6E0%2Bc6Er3PBwCQW6FiO6APz%2B8URgM36bha6UggfGfm3kwsoSE0QY6pgFF4BBxUHTgZUxFCbpefiuZedZFBET4mo6tuznP8zUOzhqis%2B6rmCMEJg8jJgwShwqsqa5bDEmHpFGu3PWhx4e9cv7976TDzerLLqmj7tQojSe6YbtnuRslsVbfx1D884uOCbXuBaltBoshNmexLGKs8iwPLwCYUIdJBIYHDZxgV2F9bDlhosnRk2FLJzV0PzFtliOm5zc7oeIz9ixafSMpwk665QNU&X-Amz-Signature=3989f06b9403510f533c40348ec65dc58b20a5300c881846ad384772ac095032&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIX5K4QN%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDJsZtc9EvILauSMDi8%2FGrZbnGNBPMfLgqRyrzfsYseXwIhAKhgIdnHTWmXEScyxii1%2FrvwstSu6i%2FOitw3dV2F1yzgKv8DCE4QABoMNjM3NDIzMTgzODA1IgzJNGV6tmvC8Qs29Vsq3AOgjERGhRVTlIyLleDJaCi2EGPu7reHBWh%2Fzh8xuhnR6IBOrJnTTzAzLIJZ%2BqecV5K5cwVdAMu7ew0Bz5cieksePb2w6abE3FC90RYXbacGnK0TmIOcRJTPl%2F9itPzzC0RRuT4jtqifwR2yGqZS087ci8aWJckt%2F%2FZbKUybJZXfnOfHPjImYjptk3Zp8CD1g9dagoamlCUJVGnuoVELF5o0D5qeTogOSfYxUfC6gv%2BTKirjqUVvPovcjzjWeqF3xE5h8%2FkHsrAuU2KOhwYL9L7k6PDJlQj3erl6oPk8iTwwiOQiooHHTlqDgi0OPOFRqumqxNtrl%2FIv4Kp6xp50MnKeFN4OkW4OoEn6Tf33uPVFpeW%2Bsq8DNybjwl1LMGdwEtn%2FOxThzmv6E1w%2BM5jMU8RJ4ULpJe67T4hRUNV9FfUVYTlO0h4%2BPG%2BkMeP%2F6WRhXDTpSITK3r4EkOoG58d83Dc59PtCf%2BEwrAfXQNXDo7aeporuATQIyzeaqC54ClpFwuFGApHhjfrlciw3SSBDj%2FB3a6HvZ6zZnQ46kuRKJzex%2FzroeNB50ZTwdxzm4pgUmEND3lyBIV%2BjnpsAAbl8PyvZGP7yjgArnDAqIeFIUH5LuBVtum5IkNOM4kTjdzDMgoTRBjqkAS0Y00AioNyfYst1WkqZDFTJv5FrKCLcWyJAWcbHDfSQ8Wa%2BL8D9SvuDIfErlQ9OLAeV04ukhCvmkA67f6iHQGkC7d0WfFuIC8ifcL8uolJE8ecDyLMJuyxdap3dKfIGxwbIBudLJ7Yw8Lg4jkRzcfcE67T6lTpH1jI8qFGp16iClMH%2B3OyTfC10IzRUJCpTfTn976rwuNxvJoorbcof8NDXvt4i&X-Amz-Signature=0641daa5f3166549f25daa18fdeeafbeadf0712c60bce093309ee47d181d79fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665WJKCJKF%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD07C8CHPF7s8%2FMIQdz2qUBBh%2FCTGt%2Fp%2FGIOERLoNQaoQIgFdgOeIm9VswR9v6059JyzbK1CwqZgLsfGWGXiIOnDRkq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDCvOcg1iH7MP01E%2FzyrcA6SLi7WbDa147IK5qiR6tAQF46cdFf%2Fd7TqiPIQuN%2BFhGtJsqF4pCR7n5G7iuYRovMK0FylJpOpguraNpudZzSLYnp21IkHbd14fdIEh5exU8Z40F8In6n2SR6%2FdGsnkt%2Fp%2FadKCOAKlPwJ52GFfFVijzSu0tzA1yZQffRGgHGi2FSa7x170gltNoYO%2FqNqO7Q%2FAEi1GPgN8TUmO8tAIOH%2FP1z9vy8Q0E0JyY8Bfi0ZOg4kfk6avgqHbDQJvBTrC99Dn2K%2BnQA0f6jgnNVj7%2Fxl2sJtxtVom1XaiivyAYW2tctWi1F1QEGlhkMhA8ZC1I4MAsPyCwxccP7Ip67rExJOuhTP6dgeR6UPZnPPANNiI6yEh2GlFM3KOnG4RvQDLPKAA0oeui4ZgB48HPkoVFE5%2BR6bfGCEbJQA%2F1%2BVzNVlUwiyggealEW1nonzkc1G5sRmFMp7srNv4CDip1V%2F%2FogapUtROKRLiM%2BdyblVFYgDTkA8BvBzhfYHWdkXsRg4fXLt8OuOkyaUyJQMTN6gRINE95bsmb0rlz5LC8O%2FgB7aWB0GwGewxy1RG4KU4Jqpc6KvkvEAP4bw%2BOwNdMwzfnJ77M5DGVvAlS7EbQ6bd7TEvw6WYtR9ySaOt5xIQMNODhNEGOqUB38ADcN7wXk3tcGsT%2BfntPzpPC0ZEvo4BELe3aLfSVYy6nsvnb4cZfwB676i45OsX0LOZcr5cx9RX5yIuz6MyFteIvkOwQlu1SF3e74IlcbPScTO4UBkkU0yu03SIkjN6%2BrEZgenhf6OELfW%2F5CnRGFpP2oG8DoohJedLf%2BHVJHTO%2Fx%2FxG9f2AU7Vm4DiZCwB%2F6FzHr3wHt%2Fcsk1BS7iOLk%2B%2Bk%2FDD&X-Amz-Signature=9ac00bb42a1fbdd20ec747ecf3bfaad371a05baf4b13f8a31a0176ddcd9ca4c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664JDJS7YO%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEKxeFXyh1Wldg6CfUnf8Gr8qfT%2FBYuUeEEz6HGPS2l0AiBZZ8o4cYKgodpvJRrZMr%2B1S3c9xxhPHhylZl9ffcO83Cr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIMvvmagQn4E8A4OS54KtwDxGo%2B%2FTgoG0hGrg4tIysEdVb9uN9DcOzaXQ%2FYRcevQO6TIobiTryogLUxZPcrcGax2pbAkNSl%2BYnxkx9NvMeX%2FhKpJHjLEoWizTg2WxE5Kvb37Kiz8%2B4vPJSy%2BdwEm2l064wvgaEiHrCasUwhs%2BWTwv6hvZ9WLIJirKf%2Fa3pW3Lv9u8lsZKwx3mNJCP%2BiRS65VAkdDNdGcXEDrktoggW6BFgqOs8cRtOBLAznUZQj1xe86Mx8XS4asf2tlzGKGiSHBzaLQHloGZek5X0mchVcCI2bNFqhFXnGb%2FOhYTpMJQ047s35lMqdkKJLh9hm%2Bv55duwSmfnHXsenGB6J9Db2ZbdxnUYb19Q6O6j1qWNXhqmoGgXcutljXHiMr4N8VbgZbI8rDLcY%2BgBtjDCbT9iQnvqbFcE5cluVB93e85GoefMMA6ZvIF6Sem%2BQHG4yVpbkxzDdSatCFZRS%2BMQHc%2FB9%2BFMaqGg%2BrY9AhP%2BD%2FtaRw7XhlTtFEAmFyeAo4ZtifBVpySq87jn%2BKGmQYSUyejaOJjqdgHnW55MUtu0pDnlP%2B36wQKW4GuL8%2BjzChfuR1EV%2FBY6qaJAaEbQryvfzvQ1ST3I6nfqy7QiM1f5ydsaJ%2Fzf5ZSrbAtQWasRgsLkw24SE0QY6pgElDRHU3bajjHI1ZHHg18hP0jNo0tW5iheKOJHMH2hUMnDQDVDa8CmNM17BO3hjBVVR0BWlX9phoA%2FGdD1eqUCfAlGYY7sityYwzB49jaXFdyty%2FRAyeYh3SXemPkPySatpawg6qESMs39eXBuKwPXu7GpodvrTLqyAUY0YKXwvc%2B55Yi3jm1LfHtZvnWHt1saTS%2BYFH3600HrjrtaYXvJG3vbm1eBh&X-Amz-Signature=929593b0c85c04f474fd462db642383152be9a4a2f380fb617eb30d2ad46c30a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RWULKXUN%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCWMOe6yEEm14RyKLTLFTUvRJY3RH1OIjUWFZAZKoulJAIhAPFrHD9JiNLLQ9ClPcF7qejD9heDASUmEPjj1ODowBwRKv8DCE4QABoMNjM3NDIzMTgzODA1IgyuwuICwLl%2Fg1ZbNzwq3ANRrEs3ueVxIdvqQ9X%2Fqp5LxV%2Bo3iM4KNzM5V22u2xNFXieGOOczRcs%2FHERoch7zklxG6yg2eDQJzaOnbigvy8yzLGtTTJpwyf3yxm0PiXeWwboI9DxYTChBA4OgXLOLUcvPYONJHkH4FT1qFMWF5jglo4NfUVeFYnxdN7TRx18x0Tqk6IiQcuDwrdtMjUlTQrQNHCa8Fz30HcrPTEXMUidQlxhlHw2xw3sDyKhoKXDGXgIeYFRXd9Qz%2BWoI1wsnTR0aM%2FanFnl6xrva86oK20nt%2BXuFvshzcOE3fpywa06bvARhvvUNZLNcuZJD2YLSpWHnKwFjPSROiz4t9cC5NPt0hjG4vvB%2BKHnObiFpua1yXbeNvqWkgrJthEIIMPZ0O3J1pzVH5PC4mL19tFdbJd7egaJspI%2BJ%2F1OlhflbxV%2BJTFdnLcAb0hCD9qh%2FJH883ivx6McaDTq97qjOVJBZlJk5hthHeOOzgegCI5KWV0bTcMirwoF0SnN0D9EZvY65r93fW1ABp34iMS9ASWpxBkE%2B7K5JriP%2F8TrgOIM7yd4jilRQX5irbdYncDR%2BIPKP8xEUxqVL1ZIVbl0J6lWH%2BkCr52XXIJzLrGwCwt1zwJAi1DrA%2BlcycIG6gc3zjC4goTRBjqkASeWJrmiUKmWydx6A4Viw%2F%2FD27CaRluXQP2Kt2E0qHQPLzBIPVrywGE0CJjaAwrRmE48waTZcBPL7D%2F9JDvb7BEn8deQgdnqCgGO%2F9EFIyX1XetE7poERvpkWGJGBg0ypi4drUNtnq3x01t%2F%2FwCYAvxkJmEDDWu9O0e9AHsc%2BtPqKdIoti7eKQWCDAyuwl%2BUvWcpme4w2PdVyPImpTfOUKcUuJcx&X-Amz-Signature=69d82afc44efa41a29445a060013f1e8082c62c5656da19f493dcc39c90806ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UEYC52AN%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050431Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDFhMGw1t10SQKEU9bLzJv2SZ4Jms1EzS%2BXn%2BrhNzTQXAIhAMyGVvhRKBZFTbCZQfpSWTAM%2FQVbpdvCPnv1aqcxMWrbKv8DCE4QABoMNjM3NDIzMTgzODA1Igwpaz%2F97x2qUU0Z6FIq3APUzr1D%2FUC6mhrF%2FvNVzskugR7mJ32MctDYTIzHUIDUkEWgQ8BrAs%2FqGkEe%2BBPYy4DAsPZcCfsB1TcSXNobhwOr7cSk2Eac6gxtzlz56E8l3gxcmRYxNoJEM1xIcrxcR82YfJXffBUXKUMNJfCcCoeOQL0C6F5SZ%2BizxWUFfIdzwNLMyhrg%2B6FY7LMmK%2FDM8JI4485PlWSj91bAOWEzmZu5Kg2Zpf%2F%2BzOUPudQ%2BxeJ7i8sjq8rm0kEKZ60ePrEiseiZZ06mR1PqUSdcwMwYeLZUabEMK1xMld1D%2F4O9bKhVmaf52CwTJ7sub2NZD04QuIAZZzcId0nE%2FiAhtb3yyefCxBZyk6%2BnEURtVrPDwfmh9dIcDIgviezzAFimcQGuGYpbzrOjSqdir0If2MfB58PdTpQ%2FV3VoY9snXFeMPIjkwqh7hBC5jBX9QzGtLFEdvsB0B5bo6VMmrOsdvjo1CZGULrU7R5WT4oKKHRIdwdJKyIHqRctHyF%2BvMKKwLnwAgS4dLYG3GtjeoaF7UVPzv5ZfR%2FurzPSj8hWd%2F8OR%2FEizWBOGrDUNmzPwxWYPZcwZ53BZDppOlBsXrlwZNB%2B3EQ3Xp31hV%2FTQ%2FzKFSP%2FYAhmUtbPp51Rs3Hx9%2By29IDDyhITRBjqkAcm89AwVmXjhXRUm6l234e%2FM9wgqopNU6pKzt5xGXSDtTgtrZe2dMo5H6eJj5DI0tK19SLpYOD6rZ0AUGlh3R%2BnbCmAvIzK6p9PNnAqPvTWw6QlYTAcDqmerHLIm1v62v%2FhC9oOMS8zG1cze8jqEKoktMb0mBVslvLHNxWRBl4AIyaYqfuW7%2BmRSj5qSG03nCcAXhXCZU6Oioh7wy1mwLu%2Bb4SvI&X-Amz-Signature=b5b7034a227ba985faab46e01931636c33cce3028cdab1e71af7fecd94796df0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665N26EXK6%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050432Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQNlQNYQB7tDaiCT1hkB53%2FsWit36kH6iYB5OJ0NHlRwIgZ7M251ssldug5Kw6ELcH4NGznkIynKTVDabHH5T1Qv8q%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDBcONGLaoJL22wwVLyrcAz%2BuPH1ItmpJC4kWALqEbSzkgDuXBxr9%2FvPQ4k%2FopfA%2FIawljQDeTVJQYz2c%2F0Y%2B7JYndHLnkIFeVDkZoU79TtSIk6KtFTMlbPOBlOkd0wbfH7NeXGqu5wwBaX%2F7j4DjPVx0KRfRgIRvAQAI6gIx0xCKQImwbM4a6SlHe32OE8F3peBBXHZyL9JZ1Mknt%2FT2bw4ZMO4YVTL8ss1yxoYSAXlcgOCEQilMowDIrGg6tvtN9qvy7coGi5jZqa7YI1%2B2FwJe5PLNmcPABoubtsULrj7sv7VXTW8Wfp6eU7PzY709f5MQVUckTxfo%2Fu%2BNVfg%2FdaFT9gnzI7RBajlXAIfxDq4DptRU8OK%2B2YZ4B15qcVhkCVxtmTpPjtJKoGA6g%2BPu8Za9lmzeVg%2FRc1%2B58pNweXYxgzotPfeliIU%2Fk4nGE9diXAQD5uNlUTOirqc2fZiuiOmIFSil4tGMYNpii0JGBZgbHO6z52Q6ufdTQleKnfWsZWM5cN3rgZq9%2F6Xs7kO0lDf76IwdmnXx2UC1cc9qGQLI8GBLRjE6bPGLRVgQGdsBRU3ukUYWyUw1rdvg0xoJ2lIiWqkWmDdj5Z%2F5qM8N%2BeH1uOSkQPkMXqmEpu0isVt9QQwsQm7XC6UGEHzdMMCDhNEGOqUBa3aW7oq4FTyFsuq3toPyqm7oeAvL6iE%2Fkp1EhmDua%2BVlZCmYSn85mdjeuCbYo0CzPa4sgAWcBviKItCQUzynsMYBxnFWKo5ALtSEvnD%2F2mploD3nwm3w5IpHHd2%2FQaYwuJdJjC3opwh44I8YGE0qCv6V74l9mbz86v%2FVo2MO4nlT%2BkbN9rgLXTkEkace8kj5smYaD%2BbxqQVwgu4DB6CdB%2FFu3AWV&X-Amz-Signature=473579d9fe0a96d8779499112e5565ee995854c47bf0194b6fc104db5318d1cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YKWP7TKT%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGN4ZfjZPqX0Vhgvi8T0X9mh70i2axgr1Y7Hw6hlPRm8AiEA4PaAD4bsTko0pjIxYGpzLXILJFo2qDwStg9M3RDfoWcq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDHKT%2B8ZbT78WlFECOircA6%2B%2FICYke10eMIEBj9ycjtLFBPJQ2bKmApltdxJQBi%2BOlFp9Z%2FPcpERVQQEYjb2FaPJv%2BkwItk9CTxs9y95tK1r3Tg6K%2F1JrtgnKZBM%2FCJMey8iVHiEV%2F5JP0J8AuA6TqPVg%2FiGenRWSMooCMt6M41oXH%2BPLWfC18ZK0TsUcsnbLwYjcb4RNWtDgu%2B4LgmjUtFI0r4X4o1Mgg3uFftibQ22U9XNnngNhlGwCsFABlsp%2Brbuo4d5MrA1gpvAaxQEn3rLQrNcozmzQRmFAelrGZCdFXXpbAuVOGhGggg6dsTe2IlUwXGU8puLza3aMLJk8mUpMOaK%2Fcbc7l%2FEZMkE6FZeAstKUZdcCNOWgiLSeaEI44csDXRaiZR%2F1Cd2KDbeBES69H5GfvwdNzUvrwd3dKf%2F8j%2B4LG%2BtZCogUagPkF6ofzo%2F90TOgquKOcOSguI4eObWY0UbXgXi3rcddK4LdYdyK6d3GsCnoKaBWeOzcwI%2BoORUw%2FN6QA9lD9d5O10Q76XYHpAzZe%2FyOatve8aO8j1HtOKz4j3kimhnMaO2TPHyHuz718BdiOEJy5mVggW0Xjsc7frg3bNPVLElQzvP0RDvQTAB3uFL5%2FqW%2F656LS3P01M8DHgf0XCHf6afMMMWEhNEGOqUB%2F6szORrGdYp5p9KHRDz6qB0aya7Lh5ougOjKeg82zd6q5tmrW%2BpcUdMWCvLk%2BdksKBRC3LBYg0dPmbHo6plvolsz9aJ4Msi%2BxxfG06nogpyArMsr6uF2N6rMhbJXnR4Jbd%2Fiq4VrDe7EUBuHMmMCrr1yY5RU7DxxHfMFy%2BxPXfKelyXaqoj1mHLzldqPpctSKbS4fi8BbWOKndHIkkkZPB6lHSuY&X-Amz-Signature=6fa0f4cc52e8a897cfdf3bd8818587821ccf96aada4ecd4b7fb818216af9bcc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RHIVPIAH%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050434Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGRcTImZquuw%2BE%2FH1a8rrEHLAGD%2F%2FAF3wgZknNBlijO9AiEA%2BL6LKh7Z8Lzb0D1HGeh9L7l3%2BrA%2BVpL%2BpeC1ZqH4wqoq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDLx7yoZt9JijuOByXircA1LYQein3YaKEVbm6USQ69FHNHdiL0RpIHKRb1KvJZlwg%2Bqr5fdHHRsxA6DaLEqFXSmxMabFhgd9iVpnGX60P10H4t2ZsujejdIGaPo79wxq%2BCUNaDwWM3P44Q49aVjXs5x46zfpypKk6tu0Rgt7hK8Xy%2BUdavZYvNj9bd4OXUct4JJsJyjLUNjX2vRhrlz67fSIe4h1xAq4ETRVYoeN9bI%2Flz69KiEQQRW8qU%2B4eJF6KSaKk8pvnP03EQvOtyG3gVl5H7KDibnlADYBlefcQBbtfQE98WOLFLoUp%2Fp5ErTsSjWF3y3wqrzc6T6Z04JbVxOhkLZwGteg10eB0zCkoR2Mw9X2DmWhzEGC6nFEylvzW07SsOQl5veKBAR8aVkWSWVT3Eho3HwDlN8GZM6yU20V9P44Zu3cWHvUE766mGjsIcizCgqQtgKyuXYc4WjktCVkHDCYXn%2F5hQ7FIsXfQNis703sXSI2bJVBfA9lWoPW2exfRRcDKah9%2BEvRE3mIOF0Ts1OagOlOKlhrEW6kaYvahkGB46MVQJrcS%2B4RZRBKq1Yammty7B6HveEHCTVe1yEMaEwsfjxHaelkJoqVK03PmQeq9FWsLk0mu0v0PyAeYozKYjekMgf36dUNMKGFhNEGOqUBxU4RnaYCpknJrPQyFDf1Dn4LWH%2F6oBedHH%2FqEFLL%2FL%2Bv22H2gnWBknLyXuUFBcab3U9P2nCaNlVkSdUZz%2Bmrljd1ruslIaKa0YqO2sCck8s3kr16DB96b028OrIR%2FjiYS1JtDZ8rzGC2G5U%2BNMBv%2BVUriXUKLuOA0ZqF7Tbo683pgDBYQefxd8DqOV%2FPMNq7%2BfLJW8ocwNfaDHPRLzMp8Mu7uC5e&X-Amz-Signature=8b36ea70ed862aaf18a035e7afeb9ccbcdb2ab6da916302085fe8e94a22a7b1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RHIVPIAH%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050434Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGRcTImZquuw%2BE%2FH1a8rrEHLAGD%2F%2FAF3wgZknNBlijO9AiEA%2BL6LKh7Z8Lzb0D1HGeh9L7l3%2BrA%2BVpL%2BpeC1ZqH4wqoq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDLx7yoZt9JijuOByXircA1LYQein3YaKEVbm6USQ69FHNHdiL0RpIHKRb1KvJZlwg%2Bqr5fdHHRsxA6DaLEqFXSmxMabFhgd9iVpnGX60P10H4t2ZsujejdIGaPo79wxq%2BCUNaDwWM3P44Q49aVjXs5x46zfpypKk6tu0Rgt7hK8Xy%2BUdavZYvNj9bd4OXUct4JJsJyjLUNjX2vRhrlz67fSIe4h1xAq4ETRVYoeN9bI%2Flz69KiEQQRW8qU%2B4eJF6KSaKk8pvnP03EQvOtyG3gVl5H7KDibnlADYBlefcQBbtfQE98WOLFLoUp%2Fp5ErTsSjWF3y3wqrzc6T6Z04JbVxOhkLZwGteg10eB0zCkoR2Mw9X2DmWhzEGC6nFEylvzW07SsOQl5veKBAR8aVkWSWVT3Eho3HwDlN8GZM6yU20V9P44Zu3cWHvUE766mGjsIcizCgqQtgKyuXYc4WjktCVkHDCYXn%2F5hQ7FIsXfQNis703sXSI2bJVBfA9lWoPW2exfRRcDKah9%2BEvRE3mIOF0Ts1OagOlOKlhrEW6kaYvahkGB46MVQJrcS%2B4RZRBKq1Yammty7B6HveEHCTVe1yEMaEwsfjxHaelkJoqVK03PmQeq9FWsLk0mu0v0PyAeYozKYjekMgf36dUNMKGFhNEGOqUBxU4RnaYCpknJrPQyFDf1Dn4LWH%2F6oBedHH%2FqEFLL%2FL%2Bv22H2gnWBknLyXuUFBcab3U9P2nCaNlVkSdUZz%2Bmrljd1ruslIaKa0YqO2sCck8s3kr16DB96b028OrIR%2FjiYS1JtDZ8rzGC2G5U%2BNMBv%2BVUriXUKLuOA0ZqF7Tbo683pgDBYQefxd8DqOV%2FPMNq7%2BfLJW8ocwNfaDHPRLzMp8Mu7uC5e&X-Amz-Signature=b16f5955699e7de913d053a8207b883f534a0067d3e4219232843f5e93f55a91&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
