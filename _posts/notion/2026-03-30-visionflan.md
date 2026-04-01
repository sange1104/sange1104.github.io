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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SOAIRPSU%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034421Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCZbs4OR3wtnfoK39KCUZP19q3JEN82VGNrnZ8eA%2F819wIgTCirSZnLfLpZh5Ak80z13rQclQyFTz5zaWxE7rEJR%2FIq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDFlggg9%2Fxs5FjaNWJyrcA%2BpU%2B6ylmSVX7zJh2dKOAl5NAIcG6o04Fy%2FdvRYmcnmBaNlsTfTa4NaM%2FQ9IGyZdVNocC6FJjqRiyA%2Bq%2FxWuDMnEwPYA6SCV%2F3C9z1q4cuj5gNoGkq4X7yMWMKvbW7DtlHjJYUnezsNrnYLKYG6U9f%2FjTOZI3FzCagdl8%2FqK84fOMqeXeunbVsGfGhvNsCwxIZLIquwRHUgo0%2FRGeEQm8fDZZnu0Pmi%2FreDApXMdphyYgBPVy14%2FarGhYQaBQeZO1%2BBZhw80gvSu48uFfrFMxUp28j0nPDYikAHi0wAUXJbYuzDFYZBnJ2b7I3tIigaaOGQTQVzACagdbASr%2BA6tHnId7OKza0CfpR7gQrwmBWBa1q9JJfHRvRzFUTBw3EFbCyd1tX5rrSc6VuPYOMmQcgkQUqZO%2BBgk5cWtHEC9%2FVf7N6KtgK0X5g%2BVZaCZIyuFaQSWjUw99C3fec9wHAtqQLPdjazXGwfsn4NAl45xGkjlvIdnCsifal%2Biy8l6ENSf%2FjjPmnLflWt8jfS1Ce5eEKTctWBLvZrVBz6AtPNoxV%2FnQ4SzhNx5ca5L6DbE0FukBRhlkgBLZhwlqbsJDc%2BtetsHes0vgSJ2RmLrOlwSlS%2FdWQUGVjlMY4uZ6svfMJqgss4GOqUBRaUP%2FECunUpsEujruFNYdj0XRC2s7iXUwqTExa%2B0NVgZn%2FnAZBe%2BUkPerq7OlnmjY%2BUZYtTsgXTToXmQegLCOUEuNc6cKzylZlrdreUj5lqoCttoxXoQvKvUAFM%2B6eiIYdOxCPJMfHqnThmcAN8XR8M2i6jgjD6Emf0H4%2FCE%2BZcrEZ2Yv1vmy6VN5%2FzjzfB5sVV19U8pMF3RM8eHmRwIA9jvuYzy&X-Amz-Signature=efe12c56025780492787cb654d0a72ae91713bd01ed6dd30ac75cf8ceddc9aee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QAW5HB4Y%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDvCSZh%2Br2nBHJIswwZ63IUGEYs9fiX6ly9ToAu9ioKswIhANJd2Uzgi9xDf4ZUwxev4Bts3tV8%2FIdRbtpdbY1PomhWKv8DCE0QABoMNjM3NDIzMTgzODA1IgxFCe1qbhYXjRBksTIq3ANVreH0eTgIhzGOo%2Ft2%2BFzVdbVVh4EW4R5eq%2FzZ%2FsPVbRVdenbDOs7rafzJGLNcghzb71su0RZPHFcQXzEjuOUQMg4KF491lijvZ%2B5A40UmXJLghN%2BnWjRMijw6YrLwOXPjQjsOEY0DlnfFNBIkLM8g7UOXm3BbyJfHmyF8nvQ4RreftU9nCHfTp5MFs26kiOdkJpmbzAGdvV9%2F01DQSUIuuiMjZ4j6kK154IYdNfBOUytqhT1TQcmrHlPu5nRhacDl%2FSW7ft3CWYaKjgB7KuLJMqCEFYfcwKCu5SMxieVnKiMHtZXOB%2BLc51WD1fvP1GV%2FIN88uCyc9aqkq7nJ0nPF14%2BAur9ohA7%2BUr7o2iHmdRZMCnxOflOsQcOGCGSiwD5xR76FnsuLAC74WYxoQL0xNIZuieU1TUFKIpvVmmw02jjXPGZavHtVmDmzcWP7oNQ%2BJ9C88jWwC4kVHbFZO%2FzRL6IOZfHngAt17a71CW93hEPJtkkpQ%2FFvEbuMHCPk3bnt0H0X5XlU4MOqVV19aqSJFffdgKmNKC3W4rfy3f8XOOYre%2BJAI1VCLWxoJpIrAr3eoAeleLBsJUb6clLTezE%2BBTcr%2BreO25jK1mtP3zX1vaX5DbBubEAFIEfYbTDvobLOBjqkAUcrb%2BpO5e8V%2FqilSJTOYBbA0pbGroXU4DfOM7BrSLFLCOudxUMinvK%2F8KQlLTJJVE%2F0%2BfUwxikf7UnPrL8qtJVzLRADLn4ji2IzFijvHijv%2F%2Btf%2Bhmkoc12Frj9jFX0fMAfMMiCJHyA7oPEYxcSMrlqKma2DDnxn0ax7f0US812DZtzTBK50nb6iRE434LHBPcYLyx0KLkRm5llu1WQEEtm3QHn&X-Amz-Signature=76702490aa0e1ff7ee6c04524fbde93cdd010e829cb3f11ac20d6494c98eb12f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663NPE4SUP%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDGKvukHg1zTTarqM3qtLGer6XvK5mNV9R%2FPU%2BHCcn5NgIhAKK7L0vDmntVQr7fYflkkK7CZp0qrqiOKSX13CwiJ0HrKv8DCE0QABoMNjM3NDIzMTgzODA1IgxFh9kVtAIVlCNN34Aq3AMkrgdX%2FxBrUZNHPqRyEs0yRU5yIL7Zg6y9o2uzoa0Ya59aQ6%2FytEJvQuInlgDMg9tPjUfLkbAQKrrs%2FQ8WCR5R%2Fl%2BDmDbWXuGtC47c%2FcubKZ4oRz7K61a5YxBNxTtgXyWCPar7hLmIk43o5U1Izb6JUmkdNCiZYWNUeOYNPICkUopIDrrM%2FPpbK4Y4BPi%2F0xh8RHHO5XtTGgBdTByFMQ5fRSEV7P4Kdygglg0cGDXDg0lGlwllRHeqis3FhZC%2BVQMGPNxqdW4sqMAz0UYabVOSlESllNxpuI8EG4awZiDYigG3ROJuS6RSngXMMjMDOcAwIc0TYXXtppWnNlCBsz%2FwU7pq3W2xyhv0eIBci4kqPlw7fL7X7HGfhtiIaIR9nDzaaiS9%2BCsZJEKoomkvCvDwpuTuBhC7ssvC%2FYAUUhFjXXsbeVX5y%2FL2JN5A2iUtbOKcBkWoZeCbSFKBKBh5WtzzaNy5c4qmLD7DALD9YdCuOZ0c1O%2BTUAA0dAXYrE1Rxmk%2Bm1nPbXLktXQE52%2BXDBPvqfTVdJFaoxTX%2Bv%2FX5Ra%2FCUk6TroJrz9ZBu7nP%2BYtnvkSruPikiaEryZroW%2Bsq7xr7ZBwTeWBgFaSKuusWaQDYkNDfY5ok5TK0Xk6FzDLoLLOBjqkAW22MV4BndROxxJiE65It7bk4pxpBEh0aUpR496TDgtPaxNpf%2Fe58jblXSrptkEXdwLqg7Ait5JXvF42bIHXX%2Fv9hnN3DGGn3z1ggVE7gkv2rNcDo0ArviMvCC3P0aOlj3vwppKvTUyn%2Fu39gH3gSLS%2BKWXJCaXXFku0Zu9YAeXzcp6sK8pXR%2FYGsAhszNZl5svcsuBa0o44qccvyEJemN4KYj3j&X-Amz-Signature=971be109680603f0aad22558581cc53874b14fa5ba1adee3deaee0491fbf9ecb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRPEE3RN%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDob0owpoWvDnP%2Bpxcy7WaQnSKvCPeSPHoPS3TlCK0GRgIgC9i6%2B3i45AcZkeMxy8PZlO6z51rNoU7m0ftvthuWg7Eq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDJJcOJ8h1wPku0OcjSrcA%2BM7rcODxWco2NI1Wc2x5AsqXTliYVqWRsDn9%2FHphfVYXCmyiqFtpffCzBcsuGdEhHhYf90pmGvcsJQVVgPzYDE2p2sXV24YNqEZMh531a0F4tVTPyhRu5cj2ajNQKIFPFnE1SJ1YLFSCDGWW5ZNBpjyv4kFIHe9GXihgeFC5Hy%2BzvwVVL6AwVSv9K6LKxd9rw0bF09uXVVMy0XwuaXm0Q1Nm1it2tgYpg%2FxLSr4rsKbJi46pXMng9UMyR8gIk8hRHEXO5FSlvkWdPZLvu2lJIenmQWHIzXQtSPc%2FBfvqPRiUjS7E4Oo0MYh7cU%2BmL7BjB4qhjEzMZDX2%2FrERLbmbMYAyY7hDDboQVwVWtZLHToLcdEPUhClo%2FXqcIwhu%2B%2BHqSAG34tzR2JlegELjuDgJMtWH%2Fs57z8r25MEpsMdXqLonhAQjJfuViHneUCeIGU29%2BAsBcB%2BAj8SLCi5VUQa4r%2FWgRHQluQSWZpaXf99DZcGU8933fIz%2BtCyu5GdXKNEWE87tsOaATD0hnWL3WiFvuDk%2F4DgGPI%2BigvZjVs42%2Bacf8m8XhwvXn0WP3Pa16Fm8H54WNEYuLWAL8jnV9gthJiquS5KIt3FER9k%2B8dVniAYkd5BdVvtv5%2B7s84oMIehss4GOqUBE7haf8Dnl0A5JkuDIO74dv21uY6ofo9rycHj1H2R1g3TB%2F4kn63ZzpaI4k1%2Fku1QU2VsotU4iHadsYpubddgQXfg8QYqfmxSONKRXaWvcmkNqt4ngXUSP2jWaYgCT8XoXZZKf%2FyiB%2BT0PKKQtPkA8fJGjjpVZd7v0shF39YqK7VyPYzJX%2FBxV5w05KdrQ2MqsO1J7uHGSgOJbXnHNXLDaXrVk77X&X-Amz-Signature=0510b365f6cbf763360c61801f1ad5877ca88086ef348661e272fca0cabbce02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SQHZ2HWA%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDTtxplj%2BOf6baDfQepT94%2Bh7rQ2ZKRquAG4bOuKgg%2BtAIgCEUG2GhOFvwNMmj40baL4BMxhtV4O2Xg7q%2Fmt%2Fkkoy4q%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDOUyW5yFIR9v8r%2BiaCrcA6igwlzNteFyUqC2RwsQll42MOMUVL%2BDEdaThGQIaORFz0HbCZ4%2FYratV7%2FsPJqrZPMRS1do2ztpvZkObMF52bqZUVSxZa6Q0HFTO8lLoO%2BPz9kjIEglBxM69yClFFOqHZYm1zDT7ApqpWTB4BOcGEOrybCACXYlX4mKHzWAfSzJACRt4kdOtoZuzw9lEzbb3UjTgItC6%2F7iUFIehQ%2BfPUdlgZNQ%2B%2FQE7ZXy9C2mpiNhSSLu6fGh0l0rqG7e6wSNMEvO2heU2CZLlURSsJCWxxRxX%2FqBPSA0b6U2LQ54GYfsb7ntfFMG43Cqsp26t6F6M%2BVEaz%2BzNxlgJ7uAFrOF63FIJHl5NaPD0chPfIMD6ROnDuKm%2Bk4z4U7%2BF3c8YOHMGDskRMTMI2fszqKHuyn8cwLDkLv9gUEvJCKzgHzG9MIR0cXK5eesMb0XmWg%2Fku12GDfBiVav2X8zdwdfvxZFEU3QM3f5Tju0tvoqBvLrTN21RH9fq2Cw2mQ%2F%2Bsh%2B4tfzoKe6nWQATy3Wm9pouc02lsv5vlzDlI0rgaW5HQkZ9shCCT9b0PBysCMlS7FfI4LSTS%2FyZHepPvXpYpdnE5BQ5UvmQGZ23KCG%2FhKixD0OdY3QxFhnQl04Ln8ThlDLMPyfss4GOqUBUrbB9d6Ve0AzLmRBRG%2Bx96Zd2EQ1oCdOQ%2F3X9V4RoPR%2BMjBp7KUScIsBOOScUELaH41udKwJHoVsUysVNwkCMhzhoLZL5gpGxqmCFrJz4YjQFK4uHcg%2BknBnDvMA8uG%2FLIsr5o%2FLfcaGMjeaCkXh3R9BVWK3ik9TCRT8dWC6eLJ6Do%2BNobzBHFXdHMtsmUL6bI4tAyusG3jsYDXkKa7thp%2Fy5sih&X-Amz-Signature=585d46e2f56338cd0f7ce5030af1f2dbe6657183d1bf0f68cd9fa5bb258c29e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRUG3KKB%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCnunVAmVpui3w9MA92mZXxz5TclagX%2B0x6HQ7bGLViFwIgPptXxiB1%2BgiJMsW2AFJP7Q5%2FrK21WuVvYrAcMnLzTl0q%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDC5KStrlxuD3t4GPxCrcAyrsanYolu%2BVQhuu0DUMwwvgVcDKGrtzP9eeX%2FaE%2F0p%2FnosmjhgRiTKyCLgBrFggIMN82%2B9e8jL8sTxZ7scnzRsqCGN8Cwshw2%2BmHijIj%2BJfZNPFZ8QsGhtsJLvijFQxqAFISjzJaUV%2BsiFfmyPIssoCYLHMOQ8PmmqXQmB2GEp6oWSEQYGinhPA2f1Gb%2Bnt8AgQZTX8bvXg%2B2gKJz3tnUcRyvcUiuNxh3%2BBaZ6XRKESEsi6ltrqy1MmIYWNER%2BnupFDlysb%2FRXN%2B%2F1EzY6sGsCu9IQiS%2FHuFpuluZsIgbIovrPCrBOkjs6BuZ5Zm9MxaGuo%2B4LBBhM8oPcz3N5pG3aD4X9NOFGz8TGKlUY5BuJZNZU0iLUFNizmKEnUkeu1WeppmMkNjPYLrXfzgDq4p2U5SjZNfYGWPWEPToT%2FuoZGjE0bT%2FcaUZCmcI4KyT%2B8J3945k6HMySSYRVp%2BrNa8KcMMrlNxJYEyt4KmHepTnJYJYTAS8gAqKuxlPVm%2FEFbr2kLpskNnbxfX%2FTJOQEtldpzv9lceyFKez48nsp7xoxk0ierbr%2FCArvF66QQsoKy75SQZ5GxYy5j76qKr%2Fk6%2FDlhqiewEMkw9sDUWSVgoCHCDyWfQAv%2B2KMiZrOjMIajss4GOqUBMWbQpnQ%2Fkva1QMLr5ungO%2FzBQoSuMs5wEc05S72D8rzQp%2FQTA%2BWY6RrLn1MIpxQF6xUWfgSP7%2F8XT6yUS0Q%2BrbY8VMRv4xdfwuktlr6IOKXXDr2GUS2QasqIQhVxIHUj1KDAvz5Xj5AN%2Bj1EQB01I5jszBXQQsYWTCKZ0%2Fab6BA7dAOxz8KBpJHyBGX%2FUbjV1Wnvi5wy3gWG8XHsjRcKD9LblrHE&X-Amz-Signature=ae734e0be6d49b19314206afb4c5532c9907b558e0f734ec8b5185095776e7bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46672HRMWXV%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034434Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBoI5K9R6xEHbsMM34leEUnY4CDateKQod5DcwMb06oWAiAFQTtFccIPwfxOasIM4JhtscIAFV7%2FtplTFIwMGx5V%2Fyr%2FAwhNEAAaDDYzNzQyMzE4MzgwNSIMtxWoO7ZqOQkUavfhKtwDqtVVXsFZpCuznTsXO8XUd0uctZECHLUIDjp6zSst4kygdbsm8lC%2FSEWrCbNmluMZWii4r5Gt96TZFL%2BN%2Btc%2BVEMr8zJI%2FMkjAWMbevPit2Ri2cT2BBPuZYziOfS0oWG34K4oW6XPCOBjwco7mDvXCKQWFKV%2BFZJ0igvTX8P%2BnBQoCUlDMRp7nCXcwfeo564vA3UzVE9eLsZOasAyO0vyPVqU787%2Fcns%2BmpKq22zwEdZOnRve8m4dbGBbdbQwnjn5FgvGxsCaCGBfomSP%2B5TNFsiHz3n2KWVs3uGXLYYJkyA8bKRq8543mvd11wWSZPZ%2FQqCMhtWgjHId5dZzNvuwrGvOJPv7RJcJ%2Fd6AjXePyTcQUMTAqbsRH2Wa%2FOGgPAMaps5ouAtf%2FdCefs2WCj3dySk4TORjKHk8%2F8ZBiE5Cx1vGveBvPsGjeajfjN0xx3UztbIBbmfNXrUe7w2PmtIOxHlsROenhndP6s%2FR93GL5hiVgU6WILIfYBN2m2ebmiMobqIi043gE2Fx2pEzKU%2BRSZGnQI1P2qAxPtGTkUC%2FmlOmc8OfXaZiuibm9nysLHNnOGPlayQEz%2FSKaI5UfBc2HTtJQVwjIV1QrCWgv4ozRduCGUfCkbxnWYypyE0ws6CyzgY6pgGH4dHXr%2B3MyL4%2FsMAe3VTkyQb0%2FGNdgogpCrUJnPqXIB0Z9ouHuYOsoCABSIZW5lU2WxHL1Jd4yYAyoz6mJJkmsjXtcqb9Vw%2BTny51c0WbB%2B0i1cJe4Wg5x5mpZytNSqw8%2Fk6OlTMdjHU9auW0d0OSvqoLram9RJnPSAHNM%2B7HHAWt0jV5HcJMoQc53xyGf4ELMtfxDVUULT%2Bh%2B9UsZJ0OjiXlqvnY&X-Amz-Signature=7084a42374254eddde1483d5ba3c34eaaa57c4e1c84456b58d88165f11ccff4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034436Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=0a0531b62dc61ea1622d6cecbfbab34543caf7f0f6e206bbdf59940dd026a4b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UNKJHF5Y%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034436Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC1f%2F7WnRmTSpt6Z%2B0WrzuN7GGBE7TBhneTeCSwi6YSyAiEAteWmIks2YEVsohz4zOMx8MSAhZew%2B7dzhpcqnHHv0noq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDP6ktM3HNBtCnViN3CrcAx8ZIqTbyPrGJct0Po%2B1FkR2Nkm7vAeTtltE2369sBz6ia2naSVGId92IuUnl1XMC9vrMIdboM%2F2ksTdanJxkS%2Btg41MHMT%2FOXdAAXYLLo0X3VF4XJnfD0vM2kaoaya1AvXpqezdahLbCn6uNxMBhK9PDp4H1gmxA6qaiGHZghkXnvScQ%2B7OZP0Vps%2FLfxsSf%2B%2FNpaWa0kDA5U7H7dp4QrhEwlu3ZrtPPDJ7YPkFNrCoDL968II5vDMcuJjXCbuD8bmstGofHyCWWMSYkvKjdFUPz98y93x4%2BMkQwZ33VCB%2BzoZm1ppqNatcZtmpEbhJnz1ox60Ogz5FploHj8HbZUAjW7Xh89neWxegXz6XLnEMfPXVvRUcCeZ5L4iCWaniLkXUse3E0WQyxslrnto5HdJ0mJioWqoz5xJqEPnOmWdK%2BPbsLxdJd8W6XZGhhN%2BM8JawKJKPyFBoMwcNy3QKZuXVh1ogkiaT28zRq7HPOg1YvrFNBrhi7H83n94Ln7CppDq2k8LOMCzL6VZOdyGqAluHVSaBO4NuMqWLYmTXhjzu0M%2BnMCtqcxWpWPjcSQcBObaER%2Bd6p7GG3XY1ftDs7DUfJMhT0r6wCdM4VPYSGzcPwsh95S6qTmJT0bS2MIqgss4GOqUB1%2FtidWsu4l9m3Qj0SP8l2UA1s0QjNq0ZIjU5xnXbYXpVq7QLpjR6nzE3H6qKt%2BGTvBo6cPUsjlPjue4mSZ9INgiNe3e7vqqJkob%2FS5ZsRZkqXRSnglDiLsEMBWULWaRLdAtd90QEUrS48BEMX4m2FXx3yl76kpvO2nTyzoqHMpIlJVSbpVS%2BuJH%2FZ09E43vnTrCt31IBArKPll92TIB%2BTZU1Iaw2&X-Amz-Signature=4a8ea584ac5d11a66fa168770d36522b411854b5fd68dcde5dad48b414c3d1fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662APJP2P6%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034437Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBRNZv46zVmjCD8DcYPMbEVdAtjfYPKqBGOHor3P9TY2AiA4h59OEZyE4ks5Lho%2Bf0OSPvTp0QTBswKYHzj2s8Ifoyr%2FAwhNEAAaDDYzNzQyMzE4MzgwNSIMoZirgqm4uw862Fc0KtwDqbCD1OpYH4LOi1i3KFB0wLkuoAh1qMvaUdpPBlalEIAmdwuTL4MdxuRe0v7y5nZTFFkc8J9JtawmuJr5rSGbSYqLVeAhtVkElkKJ6c4Za3lB%2BAl7sWcUomr3mEnlP2NPKCs0eod2cOWKf5%2Bb9ZWMjs2%2Bjqr86Sxj7AkM1CJADcVovt9yjjSv01w58mXRE6TL%2BeIFbFwWAOBXvIHKfKq%2Bi7GNlgSuLxWGEgz9eirm31dhpsbLiZL1fviScs8psZU9Dc0sdwVB4Kp4P%2BJm7cYDm9P6OIPFkJDQxI1QRWdHU6h399r0qByzyuzAFJDQ5l2JZNT9LJacG4%2FrzOKMxetd%2BOBgDRPT%2FGpvjH4GMo9ub6KADFNKoLVPjemFx5zVFDxmiYdqvIFHZwoZUsVv0YXu1ieAym%2FqwPSqJmnb49E1%2B1wV45O6vlnKN4PV4IV%2FWSMD1Zucx5zHcLlpehTKi92x2eBoWVMDOsBhveRGC5kr8ealjV9XuqP3AJvoadiKWv0qqkyIus%2FIbYRy3sVfX%2BOuMZ0fUvBD3%2FNu1n8SddU5SQQ%2FrEDkMfKZqOtmJqAs2eRrem9B9mujZt0G%2FdTcUl5ieDvXRYkhZZllhCOKdUhh6kPM419Q7ImQf8bRMU8wzKGyzgY6pgFaO7opBIumG%2B4T%2BNiO7RotNBw5YqNyngP%2BrreFYa%2BfzQPOvFvgu2S9h4IOAEaUguN5dDyZhhmL6m0f4LKpRa41%2B2vWKolshJlUhYxnxhEEK4m%2Bw6dlpjNBfRTGUc8TpzzU%2FhGU882yblqS%2FYeX9dSenbpJbhCSkP4PFADtA458bTbVjL6565b2nPDMo%2Bme9FvBalRd%2FBLbC8PKIUNgTCe5EY7dJUpw&X-Amz-Signature=3f030d84b83247afab9d81457022056243330f88a83d751e6c3734348a92af87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z64DB2NX%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034438Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCpGTZ3k4V7M2%2FuVxRTH%2BgDgeyR8lWA5zqpLiU3CnM9fQIgP5RtUr0zC6eNZcBvg8NxS5CFN0aU8MlZSmuiTcsSbjkq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDNr1h%2BRfYBrcdn8ajyrcA8pO93qKBY4hQQWcJYG%2FSP8B4xjzs%2Fb76Uj9un69XznwpDpMoO3Ou50knraDFcPs3uja%2BD3hqvUZGLE2MXtqSmbom4Sjl4bt7w1WzIf%2FBu29VN0U5xbLL65QUp6cJnuxDshpM8bsSMBjT6HGjj%2FCwEvf354RLnMv34O%2BMJwoOGaYAFhePUl5pX0FCtXJWC2ONdbjgxK3rjq%2FfX0Gp6EA7BihnntGAsTGna19pPodCrdl%2BIXnRaK9GDj1%2BRQ7rft%2FMZ%2F5ZFoZAuDr9vOJIDM5L4lFqQAjBkcI84C0LslGF%2BSy1CzkEIsF5MVDBPrIBpXq360IpIdKS2P1Ww%2FJg4HZBTQxF8ADix6nhN%2FuIGuUD8ekiVWgOMIEW%2F6GIPl%2FFm4tVfFm3zZCrYPWVmN%2BbS3hfBXobjV7P%2FlvPRAjnOS%2BzdNEVOvR2tpCahU2nso4yUIuxQUEE%2FwY733B47GNwpXOiHk%2BsHg%2FKOQH%2B6HwZf5HSMjRByf1yZT7%2B8YVoly2p2MxKFARtlkEqR8v%2FzpPIckyoHNboctHolE6A8XJBXV0SW3PI5pXrptcujAM8GnSxixTLQaQRLRfzafirtrF2%2FK4lJG6SCciJwKt4n66Yt9rEXNd3V%2FJfJ70%2Bmq%2BDB1fMLChss4GOqUBSuMPN77gXKDqGiFrsEGyLZEebuko1mxrutYN3aWVqCqmLRMtXARqvaBqk0Hk3RBopRC5RgjT5coNSq7UtHWuca%2BTr8%2Fu3AlL1I244neWkUowgXgDy05btyI4Ym22J1iZYxybHriKFJRr%2FFiEIlocGGs0ViiZWEcjFfV1X8YVM%2FwBZti3KvkdHa6kNCqBXG00rw9FIceCjkO8hnyhJBoVX7Mkszj2&X-Amz-Signature=02a2ff46fb291119614fa9117e845056586bb888cb968f4b2aed8d922edaada5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TGO6X7XJ%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034439Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFnLi17%2Br8s1TWRgd%2BjqomG1hnAxYHJidF4tOCVCEg8TAiALNQrIQjt2MqiLAb23N0sg9DI5QHFAQS2ogXtMtOFJeSr%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMj0KcCoAVeyznXTvRKtwDVwvLZ8oaqz6Anu0vnm0XvqIjrm4wqGk2icejWOugi0ag6HyEDFIie1DsHO1yA1fxIbSIRXKnzQ%2BzMiFA9baiiWwdocdJAm2pkKb1ZXLZXAqHGaGuLxc9bwXl409NA8BPDy7PJP%2F4o3T6azfjiuZ8XtwvNe8kdivKMSDwWLlfaexdbQZWidigV3bmM3VozDirCTQsa1txVaQXylB%2F7HHaeZDWCKgn8sD9rN2Su3CnxBx%2FsBjFTiEQk%2FvMIjmjKItIMZJWKTuvBHWlkGcxTCAd%2FWYIRZE9SXsFSgVUS7PjM48YxcpHEdhrMaHxqBH3z9qMnbaQnVkj7OpwbtM9s5KFXslxwug8RnNyn0MiJB13khk0nHIMPU7xFMQg22vPbXUnw2cEzyFAroNl1B1rXX1LiCL2T9tTjvAKi6pWhSedrRjinhktpp41YTO9eJ3p1P11m9Z8sHuGzj1TOIdebynf8%2FVVOQxBOV7jo%2BcutTcTmTXjBwTdtqhDE88D%2FQH8C78byYjWLlsF%2FHf3sFkxE%2Bt9735N1zZ%2BmX0JL2gv3WIdT%2Fq4nB4xpxQxjCrvqXYAExlzvrW44DuzcBrvUfa1qTRifvu%2FxPNS1XboXchqqJbcBW6ns8MeuwmJVPN6AbUwiKOyzgY6pgF5IhMNwXbPio33%2BPwPFaoXn2%2FoHgDpgT0Ru%2BXRabMt%2FQCG4S9eXKGYrdrzjdUm8uPwskfrch97Nhr1yseha0a%2BLjIXpJbeui00sGtJFjj63S19ZdnT8THQmMm210DGyLc8NyQG6DgAyV7%2BiRNXXrzXKGIh84Ie6PEAnSDEqNWnMGxEuSC5U%2BMKnKnRqt%2BGEnHssvknRZNxkESZjiGwIjx%2Bt%2BwewjN7&X-Amz-Signature=08d112075287da1757c68c9a88aea8d2568f2e5aff8a345640c673378c38dda1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SSWK7R6%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHYfdk9FZ0aDwxzr9PTZa%2B4CEeU%2B85YPWoSEXL9p0QQIAiBy21XjuQWQwEMrGWY6e2qCGf1w%2FpxA7%2B%2FNqjVZRRlA2yr%2FAwhNEAAaDDYzNzQyMzE4MzgwNSIMHYUIqw3tZ7Atlfg0KtwDidc67sKdFPsKxP%2FPOzlduD9NlABfQSIZMj2ZRzO%2BSqdmAHc91xkFQM95InOjJc7daugA6Tlj8B5lvvHLH%2FCvArpxDUz7qb9tGdrinZXAsUwfxnDtHT7z%2Flrsq4VjjxRdHGgpknIBbOIjOOGdinab7b9ZwIJnPqJ1E6HAOQ%2FkV5gOjWUYO7UhZSNzY432vC%2FFwJaeDx6F95fTRS28jxL39R%2BfPYfrIwWRFHqioekCz6QdKRdiwYFsaj16lGE%2B6HwTuNNk8m%2FkD0%2BCJQovrQerx10DrhGUGDz%2FZj4EtQtgQ8vRcKfg%2FsXb%2BAh2Srcp7hUxTqTqDLPD0JL8fSAtkjL5YNToFDoJT8xAq5kqfrvaDPuKmonjUHXwgqRskJAqg%2BTTqS0m9KHWD6hlrTDWhqQ%2Bc0sruvk9dX%2BPBVDvKjcpt%2BhtVErXySHSTuJxl1zSqN7DA9outYy1LIDMsyhTYjE8i6x2muSVainUALXxP3e3kyntK%2Fi3Vx1qlTedbU7N8ZUrtYSyw2iO2GVxJ07FkKPHArFR3zK6wNSY2endVIeNpbhla0mfnAdmlrO7nmCWSnC3ECXIplPVUhd9AuMCnu2%2F44AUWbAh3DamO8ewpnD3AVJD0vVcD22DZrgj%2BQYw6aKyzgY6pgEvC2NZgXXevPtkHhqSAaRTip88qyQIN292F2eAQogTR2CfOofYKuq%2BqdCzzQWbOZTjYT0I2PlfzPmOFJhnLH3Fb%2FjW%2F223WXRneJpTc9BfDf71YctKQ9PlIdkuU1OqDQA1m14cxoponey8MvHq8H4J5nC9%2FEymHd8JvCi%2BzJ9xfpKyTbJm0wj7h4q9FGJAZCqRipZIToWVpW9pIzE%2BOOLcMVQ432kT&X-Amz-Signature=735d75a786031ae1361d563f3d8a54016ea9dda6d920e68533e644c84e9ba562&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SSWK7R6%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHYfdk9FZ0aDwxzr9PTZa%2B4CEeU%2B85YPWoSEXL9p0QQIAiBy21XjuQWQwEMrGWY6e2qCGf1w%2FpxA7%2B%2FNqjVZRRlA2yr%2FAwhNEAAaDDYzNzQyMzE4MzgwNSIMHYUIqw3tZ7Atlfg0KtwDidc67sKdFPsKxP%2FPOzlduD9NlABfQSIZMj2ZRzO%2BSqdmAHc91xkFQM95InOjJc7daugA6Tlj8B5lvvHLH%2FCvArpxDUz7qb9tGdrinZXAsUwfxnDtHT7z%2Flrsq4VjjxRdHGgpknIBbOIjOOGdinab7b9ZwIJnPqJ1E6HAOQ%2FkV5gOjWUYO7UhZSNzY432vC%2FFwJaeDx6F95fTRS28jxL39R%2BfPYfrIwWRFHqioekCz6QdKRdiwYFsaj16lGE%2B6HwTuNNk8m%2FkD0%2BCJQovrQerx10DrhGUGDz%2FZj4EtQtgQ8vRcKfg%2FsXb%2BAh2Srcp7hUxTqTqDLPD0JL8fSAtkjL5YNToFDoJT8xAq5kqfrvaDPuKmonjUHXwgqRskJAqg%2BTTqS0m9KHWD6hlrTDWhqQ%2Bc0sruvk9dX%2BPBVDvKjcpt%2BhtVErXySHSTuJxl1zSqN7DA9outYy1LIDMsyhTYjE8i6x2muSVainUALXxP3e3kyntK%2Fi3Vx1qlTedbU7N8ZUrtYSyw2iO2GVxJ07FkKPHArFR3zK6wNSY2endVIeNpbhla0mfnAdmlrO7nmCWSnC3ECXIplPVUhd9AuMCnu2%2F44AUWbAh3DamO8ewpnD3AVJD0vVcD22DZrgj%2BQYw6aKyzgY6pgEvC2NZgXXevPtkHhqSAaRTip88qyQIN292F2eAQogTR2CfOofYKuq%2BqdCzzQWbOZTjYT0I2PlfzPmOFJhnLH3Fb%2FjW%2F223WXRneJpTc9BfDf71YctKQ9PlIdkuU1OqDQA1m14cxoponey8MvHq8H4J5nC9%2FEymHd8JvCi%2BzJ9xfpKyTbJm0wj7h4q9FGJAZCqRipZIToWVpW9pIzE%2BOOLcMVQ432kT&X-Amz-Signature=9073d7dd2957c6757c78f6f31b2e718146fc5556fdba39e75fd67c99a052b015&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
