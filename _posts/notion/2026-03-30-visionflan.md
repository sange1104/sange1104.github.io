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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WE3MYY3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHwaCXVzLXdlc3QtMiJIMEYCIQCx4p6zs3%2BXRSsNcwBNDqWFaCyMuIl272r%2BToepvKlJ5wIhAMmJgVrkcLOA%2F%2BywmR8OI8btBFgSTqrTclF7yTSAkWcKKv8DCEQQABoMNjM3NDIzMTgzODA1IgzplXM8z74Pjqv5Gcoq3AN61bBVkMPmFWMpmlrhyh8ABIDl5lXC%2BzuEg1akZ%2B%2FHoluLbaXZwAYi5faCx04QQOj%2FkXwgi6VeD8oHFN5btIVx9OkqN6vxowCkoskEB27Kb47%2BkgYopl6EDRf5lqME98p5e5aJcuYj5eIpQJkMrMFlW8xWfCFgCeHnWmFg215Db8McUzcw2zhb6hZdIEian3P%2Fu36XjYeeCsbx4casTXJj5rTZF4%2Fgd5UyTi8eRIbAOZlSJpNte%2FYoJCGwfqcapFskqc2dTxZdsd6JYS1GB8OXxe9G1WyclJ8CGBaHoCkTkYEwkqgmhZceIWSAxgIxrf%2FOrRdQYBhUYSb7X44iN3W8vriz6UoulpPulyQ83LKygsdqJHvU%2FORn2RvDdIhaon7vtv31yC59nf80x0HvvtE0jZfvj9ZgXAQO5gYEXZOt5FcQ8m1ku%2FM8jd7V0N89J2Nn6TeNrXu%2FmZNJhk2xwpITBG4YjZlDBvXbr%2FH1TQk0ZJMre4FqQFUIzx2wFNg%2BhX7sZUVqDLkDXYplvYvqDK4Dbjo7So8Og%2FUPfsZ%2FQEWoU3glYjt%2BVBqjvVMuVsFWPy6GKks5MAEzeURcumcAZ7%2FeRZ%2BEvadrkxtHGt9ftk4D%2BojQJEBF9Q%2Bl1ORMNDCd%2FKDPBjqkAcRMUj6Xf4u2aTHo5CS7%2ButOHumkt8gsF1HfVcFyMITXX2XG3kkgZ38sNPruYKU3fHbDn9xwD180uA1sCv%2BIvK9Uezme%2BSXIxG6wLIQlM2Vlwkdt5vArzilnHkuXy6TTwFKoG180o9YjXLaio0VX5SHXsqAgHKxW69wsL%2BMUw1PW5J5p1%2FoJ4A5fTAHjEu8IPQTKOWiJlNzzkeQUuOO8mmHKk%2F6k&X-Amz-Signature=1760b3b3c8da3dc998464f5e3c2797039f8035efbb8322b6810d879253bf9068&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662MW34EXD%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQDsROeTIXG%2FeTkQBBSCQWc2fWCi7BCvARAWPHjCgLgZ4gIgb91voIxsAVGMsk3qjFzi7CgPqPzoS615%2Bg%2B5FYJUx70q%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDHUGrZrXtFr0X3m3vyrcAwZ15We0%2FJq%2Fwr1TbmIQYPnE8zOF%2FYWO9%2B%2B33Pii6Nhf701lpvIxyuzLeThfuwI51lV9cFQx9yuFy3JXaV6xmnMVKWtwLFy7kXKzqC9RqHFKsK8KBAOYMDmRYtIN3krhnMHrPLIX2K97NkUbYvBe8V1LamFUAWnX7mIZiqyHpdtPCM%2Bak9ZSSy21VwbBZCVioE%2F2KZeLGOf8JPi%2Fg3UpMZe3dlXK6FkXRonS4SVuv5CHK9vjxgsKzgqFgRdaMML3lxcXkxMcddKgPMeiEk88DXzgIK80TcWwIgIwH9M%2BY4Yyrzfurk%2Bg9%2BGtjObXaLL%2BfuS1bqLI2KLTXNyfzwLDbeno%2BjrzHlTUH00hCzDaB%2B5qsZpWk5Eu3BKUEFoj9VDeYIunpEBoNlIJ3YawyEV9%2BKD%2FCJ3S%2F%2Fknb80rkRpl2iZKeDGvWvo0fiObfcnSYokobsZbTBeswrGkCIvIMrt9CQNLlgVQ1YQHiYDTrfPYnYpvdjC6IhzhPWkPIB%2BWj1wQlMndR%2Bg7be3yPYDa%2FJR8kzAQP9BzgWmMiElciz8qzoxh2bs3%2Bcesr0sboKFiF5V6iIxBEtuBST%2BbCHaMMjAphQVULazZk8VUlLbQsTkbW9Efjs%2FdoukvrUzw0ADTMMz5oM8GOqUB3Pymu8417J6ugKXNKdPSRsSER1VVupQxkIiX9H2IRPLFU3iqYervzoUxuVSbxskWZlHjEneGNX8fIDLHI%2Bizgbmr19Y%2FRvJthleioQmm%2Fp6%2FYIP09tBW18NuzLWInvM9EByrj5aZHV7mKyPI4EnjGpY84NvMe7Eu1IUQEOAknc4wiWlkE3ct0JRIHt%2FQvs70B7SaiPDDRrh%2B7tMwM9UtCaqWwQT9&X-Amz-Signature=c245d2ec3651b0ea34df8a807bf9e290ed0cabb4095c2e68469a23f7099c3c8a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GF6YMFY%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034100Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQC9BaCq9zqHrOYamgG8g6yvmS5x2yOXCQiUQUBt8VKNnAIgUOTzHO%2Fx%2BdnPwGsKDDZErMIxg2UNBbSEd7KWjpUVKn8q%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDN4MWX5zkGEPZYiTpyrcAyjIOQL3I%2Bn0sYejUC7LRQ2nLV1rfM6Zb8Z%2BS5geAO3alwwB3Nsta8DZ0kUr6SVTNYpylu9u5%2FJosl5Sw54hO0xITTNipqm7CsNLZ0r0f8Xr%2F5iOO%2B%2BgED3UAgMy9T8sKTCq5PvYREsJf1JSf9KoSCGmJaPYXnHKVy9cOX%2FLGllDlvJzWIMrBwxQcTdOLS9wJXDzdFVgU0mYwWdg7rQykWTpa9L80posNcmhQ%2F%2BfYqZGiKUhUBAIcV0zXBuyN7v9BMGgNPFRJBCQweglINCyiEqNtMD4j1jGRJ2VA5FtqI7NAX0cWN5qoRStGt0Ad9WtEwMGM93tCa%2B%2BLOeAoSL4kUuB3sF%2Fwg9%2BOA%2Bqq4vJRIrZbmVocLoctyThMbiDQr15uWwu769hgiCwbqKBl0z3h%2BuKVN1sM151UYN6pFDpOfFOotiWvmn8e4AdTAUUED7HrE4kcng19b5ntAPmsNn9u4zXA1e53zDfvLOZ6ByvGMhwsQg6%2B64%2Ff2q%2BMQTQb1BXp7LmUPzFsh9Vs5z8MZC2YC1xzjfs2h%2BCu1H43qP8gVGCt955%2FMQR%2BM%2F6E2IFB%2Br9qwp7lwPzXzRXcaSAeSSk3tPoBCIA88YagKx6j%2B%2F3g%2B3wTnd92NoSPqLuLaq4MIH7oM8GOqUBG6IYNzJkdfOL9ACXEWiVC%2Fh2kpjldxqG2d3Cf9jBRNNDpJOG2J74VmMS9YhilPb0rKaMiUeaERByyvMvIjopTyQv6k61WAN0B7PlA4DMf4c5PcCw%2FRgbEU0yUe%2FRt6fVmU%2Bmo7tSjZZoPIjUCOM0Nd%2B3xpxMZiv2q91iPuLEyGdKBq7wXPD%2Ftk2hkrHgZZGG63ctsw8paV4LomGh%2F6MwiZ6BdC9C&X-Amz-Signature=2995ec393ec7c010296c9d92f0296ae14e800dd3c164b2e7721c5c616554f150&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOWS5FCZ%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIAfRqIhe%2FSubrJZm06zsXH4JNL2eCihUVjGVJn7NBLAAAiEAvjMmH12Br5l9rDOxnZvTjjTewFO7JiZq%2FoguxuSCwIgq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDBK7PmjwQgNYCxn6CSrcA1QPTN9kHhSNLkI0xN%2BSmg0FfOw1Y%2B6yJtpSrUZxeUayxYfa4ZX%2BNq91M6eL3Bvmt%2FgXXXAfYq8S8eqTAtHKyK33m%2BOCXVBAJZEb3Wh6%2BYTK1%2BkvRlCS2%2BnHZGVY%2F45Ujvjr319bNL6678pk8f5BNzmu%2B2fxQWFjv%2FvNllJ2pX4nFLRxmnch50zlrtaFuCzgVHnO82cnb1chlJR1u2TzhLQJfs6XbObgvjjiGL0rdqAvQya3rd4DALkxmzTKBwTgRS%2F2aIZo2RsE%2BwbA7fwfVmLezU6uMKkfQXTV9nvIEjdQ2PGeYRm%2BcH5mIO1uS2tchTCkDNYvkDqyCFXyKwVGeJ8iKdUr%2FXbxDZo0aOYCHDRy4zaSdMI8UZnHkAUDXno%2B69M4Ty7i38s%2BLlSuZvsiW9xRmXRBYCFsF1xeS%2F%2FqmHSiGXel5TS77uwoaD%2FVmMCcljcGrpsEpQmn1PHo61vcPl0%2FVtPyOvtFrmAJClcuBlAfnNf3bTVR%2B3cqJKXxAc5jBIW4CF13u%2Bi%2FL%2BbxZdPmf%2BUUMqsOc1xXB%2F1BG9PCy%2F5l%2Bv2Vq%2FUYrDnXppG5KtBPSet7TFUHOAMb511c7U9qwwfbtCEDSNISCEGgt3%2BtsgEHEyYsmqzL9Ybj5k1VMLD5oM8GOqUBFxcTVMatQWNHOisRPEaeN3mM0gPc1XzPb72ePT%2FC07VnLkl4JD5LFj%2FTJ%2BatEvPEpB0XcoQTUNGdnG2S2%2BLrmUA88zKjRgGvWKT1a6f2bGMHkHikxjG4S5NQLh3oxtR5VQ8E7bbXCAtu8yPwvJnZwHSVK56d793IszBodvH1q7GtF4jTfu%2B8VRWM2FaG1hmt7u2RZMuyuInNkplqJsFayvC7%2FZJl&X-Amz-Signature=c4585753c9a756ee4e6c662f798ce06148bfbda912a94425f67528b8df344124&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QI3YCCE4%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQC7TQIKxIluYFOROW9gQHtV5xhruJ9wyn5ggxwqXugpHQIgQ4bjgGUVVFGZvF1kpGPJfz3XpzgYt1fUHdYvq%2Fud3Dcq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDIYBxTX8KIYAl9NCoircA4GgHG9voRrGZqehIdLLpZ0uvOF0nFI%2FAxlS808KHJQQ76sKIdsUAyjhEKCwSpBOKsDgMOHNm2KuMLnxPrlWOkOyo%2BD8YXgcRKcyhteo2YnLywkQIdeYDRIMMUj35ccsSrfMmwf%2BaJSri%2BNeR1UMEjuO%2BbTxUKdgUecloC6z4ZS1dwAE2HXerGvS7zUpHDtwr7ECWy7LGzzJE9hsM3tAIGgJRmbMyNA2qRuYebjtg5NUjYd%2BDmDbaCMqK9%2BttobL5mibiEvNYHfm3A9XO2BW36nv22S9sqzvP03%2BgTpRq1gpMfm2v7KjmGouh2INdkoRfLy5Fp9A3qq7gjT3Bm2d2rDWZPJVNm7jVdrb%2Bm%2FJrjF0n8x7sXwJnhIhXaZddxKO%2BPv32Ccx8Dt4jC%2FbFw8pWa63H14ro%2Fu%2Bk4XiABWP2mFl8y7H3NTEvBiEUELlOIeCnBGpzS04WSd6sDfI9E9D%2BjSp6OWEkmWlU%2FELZAn0bBBCgT0A8PS%2FMthcNh%2F24bM4lCPNoEtkGXbFRdjzoYrrNHG02fuVKUExsI2WQQu7DiesxoCkuoOw0Rqjjx6LLbP%2Bn5ftM3eXi6u8TaQ%2BH4qOUMb7A8bFBDLwOghWo9%2BB03zoS8N8hKiI7f4AjUKbMJb7oM8GOqUBrsprdNO1OPrvNAH01DFhXsQDk9OZBs%2FSAMsaTdHrhoPXi3fPNzWJrSrFYoRAQ%2FfmXx%2FuPbti6i8o%2Btvk1rEPHB6f1vqsIs55RFIcZf8G7WTPdro6jdEoq4k6X4gxRMGTKfcc4xsXKtL6JYXznGRQZFpaPSLKgqwhJDzndl5kNZgWGZOZ95pTyPm57sJgjT0fHafhfGU6WOxNdB1zQaS2XiPDPPue&X-Amz-Signature=5e8b9f9f8d9c6f1eee5d82ef73b9cf7cf55623a58e700369f113dddb0bb2956a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3XWQK67%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQD8WSH4bDw6TB%2FwbVJ8cMVqu1Px19xEMan09b6%2FULiRiQIgc9hcjcQSRe4WqK08wXkNuWyzcjMXe%2BJ0LLFbksVI8%2BUq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDIMKhZo9gZJRwB4v9yrcA%2FdMBoy%2BcSfChYD0Ld1qyqr%2FZ5YS1G4N%2BjvtUjwn7tqkTUFtIn1ppJw7H8GPCD%2FVzR9NFdz%2FoIrlYDjWYPdG6p%2FDldWf2hmZdF4%2B9%2FVfP8NFbT%2FIaJf%2BXLsBUCtyTn%2BSjz7lQx1YJbdr8%2BRk1yWdjrFV2kHI9mbZv19JUoylA%2BF8RQZCDY3MC%2FGNRC%2BQSFzsNDXzSPQI%2FP427Mai%2BRZ8KgWua1pIDi7%2B7PYHn8rh8SQSp2UtNxfDfV%2BXhNTDe4OGXG%2FQny9BYhZLJEaJFPZzV%2Fd9iysZZ6KBa8oDKl%2FxZDCosICHXG7B7U%2BviJMahjIJoVT1VKBbN92TCaxJk1640TR%2FI6lt%2BIftztGy%2BtucOUUdmrZzSnamBVnup6yLaUoAxWWuzqFByQ%2FHSW3lDGM6C392U%2FcMhoj%2FXaOdKqYJn%2BllUuoSTNo3q%2FI2398Jhc8zuu0mrSRCJ07XFRNEU0Bc2TNeCnm00Ksulr6kcVXkmLU%2BRDP9C9pI%2Bp2jPbAYqirJVnFWJ8mflI0a9sUMuA%2BdD97LfQdYw09nFAnIYR3sg5KeSWHZuUHXN9eOpiQxmDCXiTywevuKR6aN%2F%2BUTloLm6DQtez2jxStBGkm912ut854kU8vqvpOPD63UVPx%2BMID7oM8GOqUBJG%2FNYY9AvhKECQmBHy%2BqFpOje7GJPPGct7dH7lWsh4uWW4u8My1gQw8W3HI8OF%2F3ZdBC7HnPwDBFQWuWFBSwCRlSY7KPUwNUJPbkDKJb0dNXDO3kAmc24l%2Foe7tlQhGfm0dc3KW1Bz0cQP3EeavqXhvVfvxqbPfBVvMs7kbIk8QBgCdUkh2UsmWthaFYpH7W5vqJHO5MVbbJ5JRBKeMqbayArEQQ&X-Amz-Signature=05d88829148d26f6b9a49b7b51c276b94350250c51cd36431979b049fe776b74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663742PK24%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHwaCXVzLXdlc3QtMiJIMEYCIQDPsDt6VC8KLfjWKNnHh0Nj3hM7CS0u0BMYNBvbYedplQIhAMq4WrBnz8j1SCtE424FSRDyEsnlo6DG0fah%2BddQtaWWKv8DCEQQABoMNjM3NDIzMTgzODA1IgyP6Oav2tU9C%2BZ5zlAq3AP1Edh8TfQNQIkgAFG2f27M9JlFd2tik0QRq%2BuRb0mjDg%2B4Hc3sK6L8p8C%2Fo71otojm5M7b7SsFy2eMIrWRpkyimXugKXrqI08nIV9z5mSg2H3xsRo6kar%2BaxyJQdDZ77kGnLqCNkpbx72lxXVQwJ7iOnFvqGNiE%2F2%2BvTxFyRwE0h8H6puVIOaDQRs3lFLOOwnd8QOh1zI1hXiHF%2BomR2MuZTZ276fcvG6RaWxX9W4pn029uHlErfWP8C1mynTkP5VXLWyZS%2FPfoiOpvp7kPIfSUmocbQfwbM4dYJix27dSJ7%2FU5U92wfzE0RcTE2fhktoAyTu2R8%2Bl%2BeiTMEeHaglAFLj2EFAAI473t9d7h30rmOSe5b90HSK3Zwiihh5390WhaMh6MvWUziP%2B28X6yQzu6FsNvgX4IWzvjJ%2ByKSlN%2BFLIdtLZVsA7hVDSdVXcf7KMPYbWjtMY7QdKyZcixXY8ZFm%2Bm%2B%2BfF0jdCc1cB3ykfwbKQTzWZeC0fZTsL9sm8yk70MZD5%2BdESmiFsaV6UA729jMyTWBqUHvnekISUcFxBNM5NJ28CZ7wUZoOOO8nwGFLk8fUDXz2CONtckebbUpfufuPZljZOSdBnLrd4F8Ium%2BPE5AbR1dfDVAeFjD3%2B6DPBjqkAecXVgJTzACaJYlsDRGHofjQEL1WYKXZYVJn0jlnxNIDPeWtktD2bIPkxPhEEkJ95vztiq6AiU9rIvkiICMc79G0ResTibd%2BlFTwOC1OShnpLvm64TSEhERxAurC931ONtPaSMyaRcyR%2BksODSftp2h8CX%2BjPmQ%2FHr0ryHWG1FDSvhEtE3HG158Tf10aEtSDDQeUyfbCmDajt7hwfbk3HUxrw2YV&X-Amz-Signature=b0b3d08bae3c7d47ec950264eded4b4c909ca27b10a5909eea666826f1abb673&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UT3YR2IA%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034113Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIFluZo0B2z3%2FqV%2FQF12TXiOoRKKHLaKkCh6qEk8239xVAiEA9kG8YS2np78wifj3uNibmbNFmL5yAsslXQUvLMabyB4q%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDOIqF%2FiS4kF6aGWptyrcAxXffA46pg5BLa0L7yxCWytav%2F1Lj7ia6zCNu%2F6fgGHgChoCnTL5EtuVVkggxh8sSAeerQacsb4He8vO7hNlYCkvxO2TOaeexLGFFrV071p6jGFcU1oqwMKT5G3Zyu6z7TtLXe1WHSU%2FFvKaK9HU09wlTa1XOwdsa%2FPR6cUc2VqWmZz%2FcPzr61OoLcdNZtYleKWx%2BHcu5Cfp8C2wcLQWUlXmcVvGkqVuio4Wt3Tb2w7uLcoE5ACBqNhEX%2FfpKXOQ9jk%2BjrdZA%2FTAWh6aPeMuSH2iKyhA1geTd4%2FYs8OtUltU8KAbOoXMfRrxPubVa4mLawWyanugk6uDTeeZTgmhu96odwkvUZIf9G1Ix6dbOCRM3IwonVZF3MAAANJaVYZYVZGrxiuE%2FkF%2Bk0jZqCmjjDlhHbC1H31McKgocrbpuqOF7SU7wJLeMXZkGsasYiPfnz6v%2FWLiQ566zQIQIaJYFSEU0zWu2nPDcJK4v4t7xy%2FtrQN7VlYbL03%2F6ClUAAW%2BjuYRykpC%2Fok6vwDniJ3eSAoxadlrJnd7UyIno7E6XtwzVbAKFKfqCk87PkDxxojFR63VMdNKNvjV0SokoFUycirx8%2BYwroUcv6K4XYhYZoIQo6m7jRYSxdgCw9rIMID7oM8GOqUBSnb9c7WNRvtwICd0OXtz6R94VpbCdp%2BS63c2n35JktmNhOgjULBu%2BC4kKFSC3WMCr2G0P%2BxJiyreAe7GPp4iGBiWFLCBRLI3XeHixUdWSDgL07eUayjozpoAjqiZO23FrTZlUNAZXHdf0y7qdNsEISc5h%2FNmeZ8ZrMFlnzW22s4WOQC3zEwKvXT4zg2QsKKS5EOMkbLOhSDXGB1cNCxFEB3Km8jB&X-Amz-Signature=7f5279643b0e8279e30e17ccf230ee82d6d266efba6b7eb4b86a93ce00b5adfc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SIU2UJWP%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034114Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJIMEYCIQCE8nvHvSRBftnK3yPLEMMbJZTjaZTW5K66WGffYIcIVQIhAMTILT3h71ZjM3L7x0CVYRARsqplnphngy6saeTTcKiGKv8DCEQQABoMNjM3NDIzMTgzODA1Igw2Tf483ghm3ASQFTcq3AOqFddp8dY1vGYnKhlHNuAG%2BBCwGolhULOgfNk7IBxHdU4zQmZ%2FaEiikIvIfcFJM0b0H3trAUj1S3F0bRzARfb03L52xVIIABd0aYhuiuYRWpcsgC8HagXehIZrudQKrKNhLl6sWVBIkTxM%2B7ze7fHgR2Wv2uI3sYsljhguuqJvcbAAsUajTHYUx9f4oQtIcYBx%2F0zFGCdibD5Bh2ojHGE0Gtq4XzqLK9%2BsyOPALgGlcItTUslLKcmYzISHvHjo8XYqW3AbBb4SHnfM4gr4K%2BdSl57LqJGESAYZY%2FGPc27ZXntdpP7tVhbmQDIArKZv6WxYc8kGc0oVgQURYioYl76R2kEgrXUlVOda%2Fksxkis6s%2F%2Bs4cQghFajXvfAxRpTDyKNk9yzTlCnq%2FSqHhq08Qbbsgww3du8M3v%2Bqx013C3wrLgsZRu8DqGAyiIoPVE%2FsJwej0k0L4P%2Fqqf0A2HI6mBmN1s6xy0eePtqvx5B02EeqAeX%2BWo%2Fw9mDv1uDS2kHy%2FPjIrwA9tkrcBRl%2Bzlw5HuBzdNQ3%2BhWZ2JkT2dn8MAlSIVI8vOMQhi0MpcPs9pbWQOabbf4zUiM3X6IPXC1tuVk9d6pOB1bC6Lg9yt3NOyqTu56RDinipKk9%2BK2RzDE%2BqDPBjqkAceksZwuvKuvaeJfNOihg4D404WS0CREizMVDcOKP%2FVPJ%2B1%2FuquUhNlz6xc8gVQnDC60KFw9wSh%2FFMCGXzXm97xTccPoMSaRYwupiKqpXBUGxSzGXF05TTv87wZFlL5Ui1066%2BTxFyMnoMusSJdJHMmVhW0FHeysoJTdbufF0dnmanARmwou%2BB5bTC1c%2F1bORRfbD3puMVUC4x0qO2WKNGMjB5hI&X-Amz-Signature=07a2c718c6611615bd7fe4c3c8a1e8741ce16e6e2ba4435d13aed487862574bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VZUMPKD%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJIMEYCIQDxz5XaBwri3oQ5EDZATcp3hr57znCPqdyLPQHHWQRa7gIhAKxx7u3xYvgSCmvAA6UUafoYRH6b20pR%2BJaCO2YlP9PlKv8DCEQQABoMNjM3NDIzMTgzODA1IgwiJGeLfTgMhe8NRE8q3AOo6tMNlBzNW8ifgMWkJ77v9rLCNuV8zbybg%2FXIZKnPkv6RnXPX7V4UjCjUhqr6gtjWOv6VwnNtN%2B%2BqrUBsKkLIdghTumaKITAETmdBfuHpPIaAb6DcJxc1KEvlrF7wwWxC0c8Bepwr3YYTKs8RkJbMSegsQvPuiWf0jnDGSGgG5j1H66sjYm9HA1ncXTT5f5EvwivEcNcCoenmEcS2TiPo4Bhh8CLtPfuVBziI%2Bm6JK%2FP9zflJtApwWAYMlTv2JiSLsXj%2B3ZJVOtuHiNtrAC9wpynvtfcmQnuuOtIB9eX2tyi6rhxFD4ttB36Q2a1RDZk4W%2FW%2FOzmQDseWSQ0n6f2pBP%2BcfeSQVIHXTo9x5cWXX%2FPEEpAnfSNOedEDLIgzSZEC7s347sh0PwDDxUso0AF29bsLU8xdLqwRymEHK1W36VcqiA6K77C9fvnKDii7V4tnyChY7GsBn71psWvsezRboxsC53oHJEOsggQfVC%2Bjbr4boUWWCeA7vFTTVoFKLB4Tw4ZIWJ1Sb0sRaf0uedRZ8%2BX7Mn4MHQkoazRr6RxCcX1Bnvjo%2BlHgg8jKRi%2FmKlkR7ia25ndgbgc9BEln8nks5A9tVQsnMGCRm2A3%2FO6EZqNMqNym0JYojUuqvzCD%2BqDPBjqkAfHyB6ZvcuzZowbo0mj5FT9TIEpkRFYP6ktxdabpO5Jiu6hKHRIb6zy470l7cNppoHKOweIvI5m%2FlzAuP%2FanF0qcNwV%2BJFjEvRkP6qR0Skcj5SwMW7zGbIEa1%2Fehdj8Jp%2FyrPbhw30ywMnYec%2Fsz8a8KpDvLcQyASUHHcnC8Z6nlR%2B9PPpDz5dOfFjYgBseOkbm1JTcRnJsIzKwPlQQVXjR89PK4&X-Amz-Signature=ddd8dda5ac6c9e07789765db6be794f0ee0df8d8be81d2118bb216ec3198b9d8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665TXN7U6R%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIDnkrgDPGCcUoCS0DH4YBlWQkBzslxslRFL9SM5MxSS6AiEArm2ZKmczpUUFzfkIzTDW%2BTQCNzbXUAZAusSMtZnzxakq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDMxC5A%2B71OymKNoeySrcA9zNeM1V30QXqRIeu%2BxyikDUzASWxLHOL7OcDuWKm6cYQFShC3HDNGErV9frMvgdAgvL6TirDHtSOTXOTgfAu8SzJtA38oZouzrkQ3OUbrEe3RmgVhUWRuaHvcRbKOcY%2FnfWv6w%2BPslMWVIze%2FgZVYXWa18uyv5sNs9XIeoRdm2MZ89P8Gox72gpcqmUbRSupFS4kBoeAdC%2F0vi4ctMQk%2Fr4Fv4Cy6NY3582ls3SsSaeonwtb5Rh9qPx%2Flj2mBFsDkIMRfW%2FSmPX7lA4iadSsAII9BA5SII%2BhzTCGfDdS171rxL2Nv2hzZ8tJiqRKsSSLynJNZ2zUy8zxwz3OtDDDWsGVoL5laCFkPPmLcaAmjsfK0JfPP0%2BTNeyiDZu3FVjCZch6ApjLymG3koM%2FqGHOrrT5SOKh1dmcIIU%2FAxjZ%2FSAB6TuLB3aLnhR6qyCSZfHts00V%2Bw7a3dBvefh8fCnrryoUuI2cTCyDnVpg4JNaS5v%2Fib7NXn%2BW4aZECuO52A7pP8yzmCLt4AFPwCJlsiz8n3NVIxfGnlH%2BUtkOA3IYnsPUfg4iEEl7343AGzhcwrmRRG6oG26LukhIPzG7%2FaFtOZv1akn1BrhPPDRoOQ8E1Y75oydaL6V7u9AxLnVMMT6oM8GOqUBhyxdpLGjEu5q28BiExuYesphJWxXUFEm3pHcz%2F9aNstuzk16rlsBIzNs35tBVzMUo3uZlBFby%2Fn5rk5PadF7HLFtf0VadM3qgfip203sEQoGEE6hxSgFOSEfrqfmr5RX30aj3zI3C7rRL0S6n%2F8TfGDokZdKMFc%2FSPPm54rxg0UQIDQbUzPzT4qTJtWw%2FnFl2V4E3cCe7rXP5J%2FN%2FHbRyFwOxP%2BO&X-Amz-Signature=63cd19b336c4df809d45086ecd345cadcebec7545ce5560c17f9f0e4c43619d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TGAZ22GC%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQCdicrLh%2BnBgl9mFmQuw0VES7JAzONFbaSLcmnAGfl3LQIgSSGps3njxCc%2FUywYb9hGbeef8ntsaNfy9gc7CoQoO1Aq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDKl3vNO6fDYanUZ8RSrcA%2FKbL5k49G3gnz07p1Fy3cegw3QGS0vEKgnxxMTzddhPo%2BIlfOMg28PgLvork5f0TorbNSGzCsKCjq2f9DFlvmV9V9C6DkPtTaGdAc%2BqB2cQrOulhad2O5K0W6YRxDQmmVlJ%2BhAQ%2BjBVly8S7f3XTCcxMCG5QMCuGrjCYq51K1o485e7lcMPQZ8gbkoCf7GRamOoomYGpZmtuD6Cg9g0yexglYiejfGdO7B4U0dFhvEA96Z5QqTsKw84EOTQEnfFA%2FOa5O21aTXJWkpDaJdTRN2y%2FOnJMsgX1sZQceHjMaRWNKS8JZt8g%2Ff6yOFHWQxWzdRlzia0BUHB3s8Mk7NXnf5euaOuT26dzzHa8s5t71tcuD6iotePoD0pbznlaFCWFJbXEtM5FJCZwyBZIWpn%2BdG3rkVJ7FwWsxMWYvJo0PiyTnSpPe3HpjdzFXq8hIIwju3wxuLezU6tEKJe1QBewC%2FX3t7iXtnswZbT1oyTB9DfANwV2ntUx8bgAHyyLhRsJdmLmbBi%2FeJbZNpEit%2FPVRwVs9uILVT2fOUTujujnC6oR8Yhjpq7RoGQ%2FiE752RculrJVCH6tSA3xWSFqrG4h%2Fwmw%2FimH%2FxTTBIUHdhmHaADFXjakLPeCV4FQmgNMNj6oM8GOqUB9K5%2Bz798FrcwVbuHcm7adFMuLjDI3CjwHP8hYUZUMbgmbQJ1xNNMGmfpHsOhzNVImXen2kUC%2FYGvUOZ2ANMcmJQbpafjKmuJPZa%2FWS3wxZfWnLASczQdnKv80Hv4RetfL3TDSa1kNdLEPDfEK9p16KXMtYdY3YG6Dch964J5e7ZzqPsNrd0Se4WQN0jCZQZM%2BshTfOVmV5Cqkx7NkedPa4ffVS%2Bm&X-Amz-Signature=17109baed616692d6f82f25fa7aea3d324991327cb1841e26126f911a4d179a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XUDBT2VH%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHwaCXVzLXdlc3QtMiJHMEUCIDaEfD1dEM6T2KVM7iAT%2Bx1e7tMCoKw%2FRxy4IPEiD3I5AiEA8XnFEGzkXt062asfn%2FEO2eiMtoI%2B77fXsgaPXY1NtsMq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDEQ33t0PSBOVpbqy6yrcAxsO88MR82V%2Bs9UCefclSXINPr9EQKg9z9ZOeN7l8N0%2FdcJvsnlYkcb0DPrYu8cQSIczPfsAaKnN33pNLBe7DDZFyCnFWZfPF91yYWlV4f%2BsmCsM4QZf7qu6r4UeutulI20EMUwu%2B2ZkLQJmh9%2BeHncIQr%2BEz3Iuwc7IcNCNIdJ9A2MiIRyn60JObCUVqoH8PIeEY8ZVeFgWzzcttqzdwj%2BOg8f7fjxIx11BsJc5EZYYQUal2pFVaWs4uC5OVoU7h16cMtmm8XoTtvvXpehC2o2VNuHyT3pKqpK%2FtcPDnbLlA8TLuWUwJKBla7%2BOCt5N4%2Bb45eBjM53dTJB1dbxdN9mcEVeE5Vni6EHKSrrIuZy4JL9htu9T6DIGCyGE%2F9CYpxUSl3KkLn2ANsJE8lv5QWhsqjzacnC0of192nXkFXilWojOlgn1ymatYfS%2FGRvRC989E7AAIfNRN8Mg0dZsdpmQyvi0PoD3c2SwM%2BmOqnrzpg7BwjC4ba50GEh7JY3KJZCczsfV0BZVDjHDd9iZdN7odZqgNnst81RrdcTuZLgSFTxGFPORvbd2Qcp7D0xvZxH%2BoyiVpPzQ9gjwzXq8fZmAGKJRxZTxFX6iGFqS%2BVHvqpbl9A0FIJo7JfCuMLn8oM8GOqUBWLAbKAEQBwmZs%2Fdeb3X9NakL0cJE6Zd%2BujoSUXr06qEEYGQMAUJpVTSclXBPHDmXb0XHNMReRCoX3YGSLRsQ1s6JK4kkdy27VJsWVVYIvSrBOH0hKyq%2BtU5AU06iTvBRZLnTBRbAeEqPNFjqAs0WU6Q%2BEUF1NAk7p%2FzrItX4G8t2bbH3Lo29F%2Fyx63CtmEeB2oGbDbYkPDC5z1MsumUjPyMiOkOD&X-Amz-Signature=29a43a4ed18c7aed784bee2c6aa9e3d930766a2215d72aab49fa804a4ba48e05&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XUDBT2VH%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHwaCXVzLXdlc3QtMiJHMEUCIDaEfD1dEM6T2KVM7iAT%2Bx1e7tMCoKw%2FRxy4IPEiD3I5AiEA8XnFEGzkXt062asfn%2FEO2eiMtoI%2B77fXsgaPXY1NtsMq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDEQ33t0PSBOVpbqy6yrcAxsO88MR82V%2Bs9UCefclSXINPr9EQKg9z9ZOeN7l8N0%2FdcJvsnlYkcb0DPrYu8cQSIczPfsAaKnN33pNLBe7DDZFyCnFWZfPF91yYWlV4f%2BsmCsM4QZf7qu6r4UeutulI20EMUwu%2B2ZkLQJmh9%2BeHncIQr%2BEz3Iuwc7IcNCNIdJ9A2MiIRyn60JObCUVqoH8PIeEY8ZVeFgWzzcttqzdwj%2BOg8f7fjxIx11BsJc5EZYYQUal2pFVaWs4uC5OVoU7h16cMtmm8XoTtvvXpehC2o2VNuHyT3pKqpK%2FtcPDnbLlA8TLuWUwJKBla7%2BOCt5N4%2Bb45eBjM53dTJB1dbxdN9mcEVeE5Vni6EHKSrrIuZy4JL9htu9T6DIGCyGE%2F9CYpxUSl3KkLn2ANsJE8lv5QWhsqjzacnC0of192nXkFXilWojOlgn1ymatYfS%2FGRvRC989E7AAIfNRN8Mg0dZsdpmQyvi0PoD3c2SwM%2BmOqnrzpg7BwjC4ba50GEh7JY3KJZCczsfV0BZVDjHDd9iZdN7odZqgNnst81RrdcTuZLgSFTxGFPORvbd2Qcp7D0xvZxH%2BoyiVpPzQ9gjwzXq8fZmAGKJRxZTxFX6iGFqS%2BVHvqpbl9A0FIJo7JfCuMLn8oM8GOqUBWLAbKAEQBwmZs%2Fdeb3X9NakL0cJE6Zd%2BujoSUXr06qEEYGQMAUJpVTSclXBPHDmXb0XHNMReRCoX3YGSLRsQ1s6JK4kkdy27VJsWVVYIvSrBOH0hKyq%2BtU5AU06iTvBRZLnTBRbAeEqPNFjqAs0WU6Q%2BEUF1NAk7p%2FzrItX4G8t2bbH3Lo29F%2Fyx63CtmEeB2oGbDbYkPDC5z1MsumUjPyMiOkOD&X-Amz-Signature=341cc3572e65ecbf2b5d11b04769500c730853b172a00aa4fa020600c94e1c56&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
