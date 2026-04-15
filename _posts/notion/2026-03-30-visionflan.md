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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WYHJKLV%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033822Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCTNQMPQGuFWRPgi%2FQT9s8fHOW816C9lZB6YaFxdzKixgIgPU6zZ3p788pxMU5Jvol0XzsNuXk63EjEtKEbPjj0H9oqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD3GHWapFscUySfCUSrcA9%2Bm4aNHkhqOUv85syiM0iL3TVlvA%2FQltW9CLNI6QBEYrON3nKdmAA9SR0sNJl2tbos7huwWDKSuK08hCZsTB%2Ful3WiWV7iemYtcsUgWdw6RP4skQyGpVAcX%2FG3Dgq%2Bi2xhQizYAlYaWO%2FLSfF%2Bp3DSdx%2F3IsTGb36F%2BAKtOKcCatwECLbs4WEd2Srg3N2joQ0v8Ht3IyieDj9VlQuFYbWv%2BnmsPk9fznpIBB7AXUM4vBTw%2F3KY1UKgtqGqBk83yowIO9FCVUCM3cUbulfoTCYshHNXp7VZenwDZioliR25sHuKwTU8qJ7rk43kqwrU7PEPZhwcaPEOBv%2BQWm%2Bg2fyUALyD%2FZV41VmkEnYzOuJG0f%2FTEjWXafnTsjCL8OXDi1uVSiiMvfRMiGE9YyO5uI3eOLL4ygKLUUoNKFD5KWSSJa9c%2BLDa1KSFFHZQncCYIf2sd8b3o4fJTI3xbZnZHr%2FDJhYnnytxG5gScG4PF3QuBRs0sQQewPN%2FGSKJwF7TSuSaBKG37X5Jofw5uZZ1kRWrFqsKVUCkBYzRbYaRg2QA9HBavBsT%2FQk9PubiP%2B80jCSlGnxp03RB%2FmLkbFY4XGSL%2BAKl6t3FbsgpxKOkYKIBtTBKjacBWFOINs83dMKzi%2B84GOqUB%2F5QZNly1pf5iywLOGqpaY7hwugXDyuUHv6wJl2ODH%2FN3coLh4B7M485pAjxbY0sFxo5ny2PLeaQ9TTPgOmeS%2F879EnTcemTOZ9KEVEz%2BlY8olpB9dL5jje1Ix5CFi4U40cFMB4KY5q3F%2FPFQKE3%2BWtg6P3uzbNuKERyk2bl6gRnb0UAmqh50Iq0uuz88kV9B1h3ioiTteAmLyQ0D0rEfE%2F%2FKU76d&X-Amz-Signature=92568d7907ae9353267b8dd2379594229b442b9010236d2f1fd46cfc267582b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YPSHF44F%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033823Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCKY3hvhQ%2FhX9W1V%2BLRa8GqDEFIJEF8osbggHCJYUrmHwIgUh1SmBdZv3RDgPWIheKxZTrQSvRQowg4hlgR%2FWO66qUqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHEVdV2pqv%2Bd2ea5wCrcAwQErzLSVIbGFVws8xqmjyp0W98ZS2BBo%2F9uW5rZD1CYVjl%2B6SRrcl32xP6wvd1nG2OVxB1blLttPBxLTOPh8L8ZiK%2FIMmqsypx6V8yZxCtHb9Hw1gdoU3hK6zvmUlv4AqwZ2CJrQdgvVl%2Fk3sXI1y2dyQQnjPsI198SdeXVyVyfyV78EI%2FWEn6kPF7wWqr4Baq45TAqgxzIOOx%2ByOR3IYMwtfUk34hSRbHfNoh5UcCwoI0r26LCkdBleHHegGc8LQq2DbFQunjJ3uznbOoTn0yn9W40vTNiw%2BspDFejyCoI3LO0OOYoZVpIHFOEXvK1h3rqHK1F%2F6IjJTq9H5LMo3dccMfwiVsS7iciLN2WoRWBOlgMHv3JqmSi4FDU4D4KLZgqrMHEqr%2F6FI8o49udL0p986W9kryF4V77xEL4sGmfDLBPfXilDymxXnQYED1Rko9n%2FYxTUOd6A49kxUG7%2FnV68eGD0DGv7KEQ3VZnbZOpu7zVxxe5O4yLhmBQeSpJBv75m3jdE25pbl%2BUikeNOvi5Ujx9gGWqhdsv3LhxDnSYwyzV3IvYCL0VFPvWV9AM1%2FE8C9f8ZLk0p5YgWLfUNvjOd7uZ1NUpg3zCAI0rWpFmWcb9%2BUD8eoz3NVMvMMvk%2B84GOqUBSJDHcc6In6bZjkHa4b8Cmo5SuP1XjYzES703Yl3P14hCm4nJTPF90K4wuy4SRlBCPZ5OJRlAEu02f9fapEZJCTRsPGZqOKwQNfbsVjLmfbNBJOQEAMCVrP7kMFenApeEHA8X86k2M6YXrd1yUHknmnLikLn2Ty4Yg1tqfwY2Pd2pRKBnbSKUz0T7ilS5eHMSXSZt1vWV9y72mzS4zLZfauOHFAAv&X-Amz-Signature=4b465aaab736056a362554219eef352f997de92fa56648ef458383225a070464&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B7SCZOD%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG84J6NvkvoMen2fcwrLZgEAAaOmnzgJ9mu6AAudZLVcAiBAjFY8ZzRkcIVuZdaCi5JNNm28W73ihDxBnJPxwbaVfCqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMA5pFYWSd0QIyPecRKtwD4sc4eSXha0hknlLbKg4NnPdFZVEShMadOvGoirS3VWEsmHNVQkXuEafe4j02EqTkNyjGKcL1TRhGPcvy9O8bprlQmzcDviKC19Uf7SgpyqVfNa1iXn03hIy9lLsnhAVFTSFlGSUcpmlC1mGVJXraHqfc828UA%2Fzv4wyLkmAAuhZmXlm1hkW1lodzrO4hqcXMh9xdMgBpGhdysQFLS7HfyaUkLmoA1aVrW3qMs9YPPQDGzWQMTwFAy7FWN33lnJOv%2BsqtF4W9D6W5iF9d5o5k2I2%2FBGA3LClGoHjenurCNmBoi7vNNsw97q9r08oGd%2Bdp7ftCmxVumg61mD%2FzEFSE%2F1i9ExkL0oHj23a8u0t5yKJmPd239yf%2B%2B1nsuQL1Y0T8A2puXFkM%2Br62iylgFScyQEmhFWCBu9Q1j64rqgNltLYhNSCoF%2BXuMOQltgz3rjfE5CDl4cGC3Y4aZx4qxmHMoalN5%2B0eYRN8EDyS1VrReKLAhZ%2FTJin%2Bc7%2FFQLtPgUySOJ3MT%2FzL8rbyA6lA6UV5hF9X7dfTewCtiU8PFiZ6O6oXetB1s72MSeEJOLyuqLScs%2BwuPwe5SKIPfxorOjAGWxl3H0kjWI6%2BGEM3SzRwR6GMJuOw77gq77a2u3wws%2BP7zgY6pgHaOsXTepujPuYREGQrwD4fg0JGXGo5AJrcEHFiiOzFnoPm2Pq1PWsUTBvyGq%2BHC5mSt8sXNyZ9RO1R9OzrcyHpWgVtm8Y7HEEyGPmCUeS3QU5NHVamWtdKVRykn910ckNkGEnuZG3lacWZnjm765%2F9V7%2FJ2cYfFN4SV57YJpcUMouqIFfUMYnCvODo0307KAvX2utNTjfVDzYBQs4Oa57g%2Bv2X17gC&X-Amz-Signature=bd4333c118c4e9cc8d008a85b7ae170c56e42ba5a710bbf4bb981983a0fbb07a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46624X2BMTP%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033831Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGGDbmcbFeLOKWcv8E2zDOyhlqYmUQEHN415jbphZyM8AiEAsRVQqJYnP%2B3t7Y5421dU0%2FfyO4UlfwnujoNelJtTiK0qiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB%2Fc9e1JHRzslnDrVircA3XBBuJgTFLGdtia3JE6vI%2BuQ%2F5M17WWtkclmqtVZVPmQRXoJDt8KTvjN%2FUPLhpegbKsQvQnhonm5%2BrdAnyti5wp9Cn4%2Fj5r7pXnBVzUAt067LDWE6qn%2FqPkuMfF8XrxXP7bSZFYU3z%2B8i1BO33Isj3JMdrGmtX6lAZyNu%2FY2QiuHwklesday8XUFiRCf6xTiVkdS3MR28UE7qrGiLF5y4%2F0Ittwa4QNWMmSpoID%2Fc%2BpnViw8r%2Fb7SsfnnmQf5ybOBsZBSife5oCEqXOS99fOOveYZ%2Be3GlBtwh%2BlBNxEhWY%2BkgyAsSEM%2FFR4g8JrEGFxAK6t4TVw5E83YoNmTncDBapeTT4zuJOWP%2B%2BkeqdQ1yqd014wSWMVGIZj%2F8xPaGmLaVmu3gG20iJku%2FX0TW4LgOpbOKz4%2BEurHZMIEz5ZKIGLntgsljjAZ1CD%2FVEquhdox471tSLTmzunGkYT1IBq5AylwZHVJcPnlnUzWsbiuFuWGf4gRViOgC6xeLws89Z5j7pciLGgqFwcYfWRdnH19Z%2Bn3dbNkrZ9t61jC4MWzFClPQENDpib%2FTfQZHx7CnW2vFrSekbMwIheXoSRFMlKgY2aleHX5y%2FaEGutkf8fdJ3KDZ2cBPGOpZjwu35MNni%2B84GOqUB0Zo2NtxAV8wQWhto%2F0oGgL9kNOiSXqJaqMI14hyN4KlJxW60T6p0uvTKi7U69dny78W5UjSs2NHICidNOU9KhWnT2D7unUOcUhSSh1XKwS9BWm%2B1IW0uv6Exnvfyxwwh6A%2BPKDZZ53Mlqq8bGCDdtmd9bB%2B5R1r91gFu9SMrji%2Fxblxcz5I5yYFqKvYMpLilxP767dFVGnzLUMFpnMCPcfFWNYR9&X-Amz-Signature=5122d92fe241d43ceb10e84f8527166c0949799cd31b689d09748b597a9d370d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LDF4BE3%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033835Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBjIS2byQKSe6s0w4roiTVhDbMbqmgWFXlkDq2P%2FsssGAiAbCCdi%2FDEB6fI%2FbfNTEPNY%2FJk697RkWBNNky4zU6t4aSqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMcenO%2B%2FmIlP86%2FB4OKtwDtWdXL%2B07LskKcWjYCr%2BLA%2Bn1wfdSwJzGf0qHfJZhpXONCSu8lDJCAeOxUNdxtt53bEmxVXtmcjmMgomFb5K4wFM1HhT2l%2B%2Flm4CkCUtRefcEnXtSYV%2FMuH3Ujp58UTA7XwJd9ov%2FW2GC7F8UDd%2FeEIq0A%2F%2FBBoh9gDh0F9haiD5fuD3yxx1%2BynmTe%2FBwN8aM4rbaSvHwN02J7o9Ad8zQeOF1p9fbA1t84zR%2Fdp%2FYgA%2ByQ6EY%2Fk%2Bm0jP95NbmLZKSC7ZqTqhx3%2F9mOOkFn0BZBEJaCAVRKfnlJn9AHhQ96U9JHkUdt0AH%2BsUpgFB8oCb6MKJKW81BSRLuKGGww9TTRvk6jQTL2z9ywzXXyF%2BQPmj0pqTkCTmLcso1wv4%2F0q7FCmOhqBW3Oy3NdgsHQ%2BW7%2B1iEJroI24tkqTt83IN3Fr2n5EhM85Lo64y%2B2tQsnmZBVat3E8vSSs8fWjM26NzQ%2BUhZ6W4ozI%2FkjtCA7nd6uUlnel2SaPL7lqh9%2FllAdnP7SY9qr%2FNVz2twHi8ImDCQ0sn2b0uUDy%2FFLOs1zQVgHd2Z8LNOjW9ouZ0B2bDFn7I%2BI5P64Lybx6IT4w7B1JEgCxJa%2BJy3hleQR5QwPFN6o0Fx16M3CXYldTC6z6gw8uP7zgY6pgHfou5I99hmNjbFOsNp2x%2FdCPvmzmsRbgct1lm211YU2UwloRqVhFTSEnqSsOEMl0tKCESFWfj0YGCIeatSOwA%2BlXeYgDp5Wz%2FOZfP7SPR3D7E7IGDV3CwkhJ816DLJ9WWj1FVCFv9ZU7S7P%2BCFOki6qns8owx8WaSkpsQ3puNPuzKvN7KB%2B4akxYd1OJua8Yf8HgE4llAQsr4GeE0mRYntw4gvOXXc&X-Amz-Signature=6f391ba9b55d7994a143820eb10f21ff94b0d9a6029cdc52bb411cf5d17f9cab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RMV5AF7%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033835Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDAU%2BSMMd3YrgVSsKl9PPv7H46KJU%2B44CmgI7G0iPb6FAiEA01cYszuiz5v9uruybayK6boIWlZoOgGB4qXWsVlasbkqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFwMljr2J0iPUrqcfCrcA1Fj8L8BHi91LfasJ%2BIYNaHUevlMJN%2Fb8ZZVvoyQYSJmv8X8ksmRMBKUsVjVesrhlPj48JPgy7Vsz5ZVfq1AwOXPAD6A%2BRAjxpScsT5p0DwisM18rBtWDR5KlOI4dJoWz%2FOIhba%2FGt9cbRlqn0jw0w3DDuV1OKmxyfm4MYR5pNSo8M6SDEQNVYaLU4vD%2B2nYVqijOR4mnJD2dCedJ2PtSriEZAYjyN9Ua%2F%2FyfKyhszZj%2FDc%2BXipnjy33H5EEtF3V7XIRFaEgw63PJM9PzESqfWXVRXrw4cwg9%2FAVGkYTsmAqf2KQMRX7GL%2Fnyo5qT3Gb4FBnxTLMNMkWYyO3R%2F3q%2Br2vsRbmbviAjkbRc5uCUK6NuKgZ4BJVZXoaTiOU45F5GHzmzZidlB8M%2FPXoKGiVFfM0QEQ20KkbnF0wMYuoV0L2VO8jsOXspEyltBO2c%2FYEBJdEkQ%2BxBgNYQ0wUePaJNBLVdR2%2FFRje6lFiBoWl7BCogdLL2hw0zqY%2B7itTVBTAnFne6n9YmnyGvAwYZMVNmDibU5RtXzsckqtqMdBdAVgCT%2BnCX9tiSPntIQFUGHQvA3QyVIZmSoC3V4DCLzAOG7EG5dlDjxA%2BzxETLJPH4Nn2SacImsvOEe72JXSyMLLk%2B84GOqUBQE1EfvBVIpxW0xD4tHvhRmJ9zwyj%2F7Fvuojn0VwZD9nGlzwkyvSs%2BHVZRRSqF2AqfHKA9p3tE8LBnaIpCJgS2tP8uoYM3CPCs2knUREhS0pvJPv6lRr5cb9H2GJJrtC9AYyoLfhzAawU8lquCaEoKoxhqfGoG51Xxe%2Bn6%2Fp95vR%2BRv%2BIDg0WEKihiRpn1b%2Fz15T%2BlkBf8Lfl4IBnGKz811jBFEun&X-Amz-Signature=575634eb3dc71de7f2240c6d8976de2287fbee904b728f94b79980aa9659b26f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XN25LZBZ%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033835Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAzhF5QV73U%2BUhp61pSWyKc324XYh0bMOr%2BhV%2F7uHEwYAiEAp1o%2Bv%2BNvxNEmqYt6AwDmcIcQT79PeGjCTydDKn6fdRMqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBY%2BUV0Hlmww12AjgSrcAzYuJ7E8%2Bo4uZE5JHHr9Nw1cSCvtk1ScGvLYSDAO05NMPKsEU%2FlFg381ffDxh%2F%2BfVkeclUixZ3QAGb1pD2w5lDx47MzpGG4qgfuP6WpSMy1v5NV8KKVJQ5%2BVCd02cVvTqQDqWswRtftdoGuEgZBySOsE8Wm3u%2BSa%2BHP6fdfdZ6bkZUWTKtfF%2Fgr7hSIUVPm8sOxwG7hcQKPe47Zade02JGt6%2BNO0VI%2BXdnsFxg3XNBGuQk3nI23b4qiVdKmA4uumhT7PGDl2HNVwWX7jwGF8CDfTrZc089C4BnJw%2BKsbdszHFAolkbQP1B00rUX%2BR20zVBHfQm79hLK7RcVILA9iLWvvu2CyWK5r8hOKS1whbPwpuI3yecKSF41eWvF2FHARR2W5R%2FDCdM6xRKaWMDVxZZGSn4Abz4QuQFUrllxZR5HLLvJGrpWewg%2FlKOr1%2FA7htZ%2BVBzL1rebg9RZg5ZAurn4xIsg%2Fw9u7%2Bi%2Bc4Wwjbl0J5lUoIbIc%2FLkRHQ%2Fe61pszOQLGnd%2FhykWYh6CmxSg3Zp0iwOikM6UVQJEQ%2BVclCv7eHT8H1g94MhRVy4GOr43cohZ7WXQrIb1DrgFWwPmp8puhEYjfH5V7o%2Bc5e36H%2F%2F4wNcSyTVdz%2Bly%2F4BvMLrj%2B84GOqUBM7AGcOHfBgRRnwa4%2FTJZ8p2mm%2BeeRj8RtaCPaOGekc67EvaKirUF0cf3%2BRGk3MfS7SKvh4nMmZHKfDx2h0O6%2BHLyJ1mNlzgPC3KPuU11S5xtVrg9TUr2g4ksN%2FFMFz5zWJMWY9WF5PHJriDTYmULUlc6%2BqOGiUWPM0MXdWHoIk5ULoDiLteN5plt%2FkFyVSy%2FZm4AmZbCQ9ZTWtRxka9ZqYa76Kyf&X-Amz-Signature=237078be27141131e1168c387d8658d353615d4ffb882d03cd29a333760f303a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MEGBUZR%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033836Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE2I2cm6mYSoxC8MiVT0uzN0TWqyyOLIQyajSd5bSVEgAiBI68H8jsh2Hzx6xBp9Gfhfgmu6BPG7M71qpG2SkE%2F%2BXSqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMx6sORw%2Bpo8ul7AbJKtwDcrggplP3yjskQUOy3mP1jhqrmqA22lSgVAY%2FT0JGRV30aqPadh4LTpZnZ2AabzvJuRWVxKd7NncWY5uojUKNFH67JnTeWg7gkea%2Fgt5QcdQTDnelC055nmHMclPolHzk8LlnBWkCqptMNE2CIkpYcn3dty59bFMdiE85W1LZaPMN4Ufs7DlTF5m4auVY2LNxdEBjWw%2FW6GgdPJ9Y9RuuibooD%2B064Fp251Tj5eTfAKY2UWjzestjwj7KItbsaBivsOOMVmdTUgcaci6VhgMkebf2paIgvhlobCNw6j6WSiUIK4p2CpZSGgg%2BI87ZKB71RYuxHQP3AjafC0V9lZes%2BRNq96D%2Bw2F4%2BHxvizzH80z7WlgPR3haeVnQJQD%2B7AKi21UC0U9DwIZaas%2B%2By8K3yYHzoO9EcTp1rY7CEPf6WX3vM9jzgnH38ELVM7sPG8350lMu8I6diMoioImzwthF6E9GmbZOqwKTh0S5adAILWrApTAl1viIXT%2BPzjnp5ylMrfQKiUpI0jJGRpJdKhcIqxjoyHTgGCyf7a11ukhkPrvTb4RtTxUiH4uDGohSVCBRio6ntCcVRp7FqOCzhNImM39pJFKIQ16g5dtcSYPFI%2BEdOC3Z1wynGLiT4g4wvOP7zgY6pgGDuQ6kqoLLC12J766Vbug4cQ6QgkLBUTSotriflGYuLmMsshQtowiiUan0N523dlQ4wPqJphDeKMB6Q6rc7exrC5u0%2FOtlPmDQuiUxEK8DeaFPvr5r%2FV9rrsHulSbiNJRcU0Hn%2BNUdfOsP27v029ZdaO5iLNPfv3OK0J8qU1mTOLyOf3m1jNbA0H2SMWLSVXNi0csCMdLGkVns3qs2%2BDQVXzaPorA1&X-Amz-Signature=06bd9b72864b895e6ab7e5fd8ef8fad9881be2f46db21c5bc62ac0aa97949f38&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662ISDRY42%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033836Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAPwN1bMJFljR05RkrsL4lp8V%2B%2B9pAWN%2F7xBQcKoLPNqAiEArGtTCXDTC%2B0%2B0XraStzsYi00oAhliulpioKm2glP%2BLkqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMfXUPhziS%2FbARuh6SrcAxPO5DMbKd4Mu94LAk%2Bi3zVoII8Hniq4u39%2Ba4%2FVWv9q6EIyzXBWtH%2FcDuQGyRO4EMtZvdJaISTLffYgTsbsvcgfkqjFLRVoD8p1YydPQVTD%2BKnSrNyacSrDZMaE1BI2E8HgnHmTqkiCAabpMcQsCq31a%2FB2Pvq%2B5brBobr6RVPgAIxUIOdExLAZuZMXzZnFNm6yAcknqNspExJlpkhj4bgMNoakNxhSNODHGNZqc%2FkAV6SAu24RizWV2Q1nqSbc1G5XbqOw8VdWbzuzrNehvTjlr2hKWofinIgyNZr8SKk9k6BKS8hignqeyGXpeUJyVdfxDMHH%2Fn5yk98sAVDAJ1%2FOwVIylFv74pzn26F2tmQUcr8lbZ9paYoCD3hFgFcpe3TJZL3U8nZvCfMFrvelbu26aFWJaxZrQrL8wYolbj8PSggIcRwsd6i1EnW2QCEJ1A%2FoGUe6DPlx6FbWYNdBEQNCbALxgnWYoy40Mgiy9p00TZJYX1g2FdLQ814SAkSheZ4vA4KoOeYa8GGJqQfzZNBVXe47XXgdhmkI2fKHXNMAwZfSHLBc8dFX3078iTA00qtvo1a2O%2FARh723CQItZ7sI%2FuiEFBZokGsfh0n2Kkk5R%2Bizj8uUqX2ISDSLMKbj%2B84GOqUBCmn50ZKN3kgKUic0f1RfSpjz9FC87ns6lsiOV2VzxYCPEVnuoqyiAdL0MAhaT53TEYWAJxIsQdP%2FaKW7vtjOm0c4IRVE7LgNTHdKQJv8ri18HwCDMoKRMIZdAEbFpWvtQ1Ze06wTUQF7hHqyagpKal0h7PtuWg0C94OjeGuAOAMSYMB%2BkKfGiKCV61fPOeFX%2BZ29%2BcH3AmawIyOfCFDHZGakwsXO&X-Amz-Signature=f8de0d2704b25148001cbae9de417c7491560f414d1782dc116c6875fd402e91&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RLEDPFC4%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033836Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFHovWV3fPK9CZqQnsLSH2AinxCJof4djDkIWnjkx%2FPYAiEAsRE9rp9hnZAjcvkmyfsdA5y3xmfeagMjgXOZeZjS%2BsEqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGHyHxavfPAEkcHrFyrcA3jh5fLeGU3VM6NZbiNDaAiTviuMI3xSZqi2R8oQKA5BoKLl4Z6JY9oCSMqAWxp3dUcwIDIJXYDXIPS3yaB1fjeQ5X%2BuZdLMmhK7ppSmcFfPZ063BM1nVQdt%2FnOLMYQtNLCXndDKMkjTiUwrUWada1pWTADky%2FUynhxNaQvCZQ7f77Ymyc4lDMGAL9oQwjtkDcU3lgNAffeeJ2qrO%2F71eMaIrjBqc8khO2VZaQ0BNJsSkDPHPsYZDiCaZAX01czkxJoG%2FcEJU%2Fip80ZLGIQoxY3NRLeq8a%2BpZ21onDguM4GTVO1kGX42fROvZU%2BsuVCFmoqmjGFQit%2BPz03YcTPDDtpIDzRjW%2B%2Bl6aptzcgLTE6O8yhGwKkB7yUWOA9f6PLD53gDTqPwzJyW4g2X59juLldS3qtM3Hwx11%2BTZOkHWH3stFfFNUuqLkO1RKb7tcILusmH%2BKMZWOlQ75X3vNjJkrwNAz2aPxLytctvhW1GCCAtmE1Mce2h%2FIHEK7UDmP8%2BMLkgvBHoZw3Ak7rd8OakXV8EcfvcFCt14A9qdFIHfHq687QHglA51XuteG5ePTJOjrLOPHE0A8By%2BWihCUxq84KNOZkntKBiz5y8gvhJjstClEJOgXgQWxmS5%2Bu9MITj%2B84GOqUB2NjqXEnCl94cCfbxoFWhMnKrqtLd17UODtFtUprbYicy7W%2FbrFMCbNjlT3moKpGhOwNS1%2F1qReIpr0M7IaU%2BYip0MhuHPA5ruWnf%2FWTVYfVyk1QhUgRkB4zeCVL2QskVliiLfu5%2BQ6ljN7dn9KOlwRECVMhHfHBKOUwRXvMlxpHOvbC4r%2F5Wmu3Albha26N4REICoDYbFOG6zeG0CPE7tQHWEiPG&X-Amz-Signature=7a2230e1451a74306092d43152618222d2a42300e57fc01aa68329c0b613ba36&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MJRRWTC%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDvAglBo%2BMpdA5ffG2DjGOMSLVZInUmwZ07NNZy%2Fl6QRgIhAPWStuZScs2UDRsF5a7hzGcMnAO7S0Lw%2Bl4i1C%2FZiSgZKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzqFeTBACkyXRBK7fAq3ANaoxWpmaUvnE2KNxqLmPJ1NSbY%2BnHd4wvbab0LXBVHdbo5yc8Y3LROTeJ%2FElzfe8NAyhJmAFcPpCQrJcVveQeMQObFwtoCCGJuUbh%2F2O1caJN3l9OZi2v%2FgcUdSr%2B8eT0clUu4eQKJUk9Hda2s2vHgvuOerT76zdsr5lJH5bzZTPlnKUE%2BVNJR6Fv5noYV7fAn%2FKaAXSCy5k1V%2BlYFgqTXZETW%2B6klCiqQ8vutBtRXWoxqX4HViUpXlGnlF4jQDw46oD5m8GmeFpFjIdtRASqpo50iz2opjnfr2XuexONr91FQzFSXy0ImH7s4YAT%2BA6WoJmKAx5XjjZcUyWDRPMLrniOzSvFovapBr5Z3IZ97tN3BzYQAQwFMrETM5XOllRrfbfUQO55%2F4erZPR3AXZejntHmbSjs14j73DeVmDBNzulbZewlc4UiKrWMpvWPsN6dF0oVLDqSJKfgkdA4vohCgkLc%2FkFJpqjVec%2BwANZsVNIKz6gjiU15cFRcCThhf5dpE68kLzTUpeN3kjFxgGJKuzbL%2B5%2Bt%2B6qPYtUR8Yq2XIs2oBingbcHbFf9vZxfSUD8nmSZMCEdKe15%2FLbgf1ntxxJtT%2Bz3U0g5uBmCsZhSP2aGNa9JBh%2F%2FoTIYdzC54%2FvOBjqkAdhZR8CyVKd5sIg74kb9%2Fvy%2Fv%2Bu9la4qzZoC3ANKengz2gwjrToqnyGSbHpP3aDu2m7FoOW7a%2FzJNRg9Hu%2BuXfOYksMHxZamTR%2FrT9ZD4cdlETORNyOVkXq7WlmCAf7TAeSNeBf3XkM3jELcArhmlKRfY0u9DKAxFVObg37OxE67Dq4JpnJkJTzpe2Do5%2FHUAunXL6i6%2Biv4MUbd23lQ5qMFpt8l&X-Amz-Signature=04a5f316eb1065544d2deb06b78f2cc8e52b6c3d1593dc1ba3a7dc875f196d33&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZWZIMAV%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033838Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHit7Cb3WtZQ8GEgOQChipjgblSYC%2FsaSAXhPPTT7bGcAiEAvRM%2FE8JFCAAttbZJelFXERG5Pm2ZtxLayHieIhSM76gqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKYtF%2F%2FuPbgFvQNj9yrcA1VjrsGGxyfXk39HKqZeuSxoQ3iyv0gNpTTyHSAMcUJK41V9Hgf%2FeVwxQ3CTgz8qGBnLspCJa2fad0toUWJT0H%2F%2FOPFIKDGnardst6ZhQyYaiH2RxnRMTOo4anFAy6S14salW%2BkVzIJOsjw4pJM7dyOT9nzK%2F9IYwsnuV52fY8tkXb7OU2Qm%2BCH1zlpWj9HV20xD7vt6QMVUfRXZkhMAvL5dJWsOf2DMU7auV3JETn3UcqkW5Ffc%2F8eWcMKqkz9t1up2jkwIV6K6yxWn2vGbLzwzQ5dtl307NQMJ2XHL0F7nopLaE%2F44Bc7hAL87dmWGiL2AtA5uLsvJFN%2B8du0v5W77P11eSy2zYZ9r1RirwHKzTPRFwp6rI6JMlyWJ5Yy0jext0ExTw7OZLOh5RoEx7vsQgZL3DZ1k6fURuXLXJd7eMyZZhge9X0b%2FFd%2BciSOpJbTkDK4%2BsVxF%2FrLpQEM3AeWSvpW1ljHBryiP0vUJcN1X%2BkwEWnnxEutofe3Er7oOIJUv1j9jrhXjCi1nxMy3zDTuYvqN%2BcSlFj%2BJeOMsDP5U5nM9OqlsfaT9Ujd%2BKSpSYD7SMjDnGpXgE3DkxHNDdgfThjdylzneK8ZR64KwQcKqBgRSvxxPcDq4%2FgD6MOHh%2B84GOqUBEDZz0Ch%2FAnMjRhfQQhlaQR8UjoKbZjN5CIQw6uc%2BQggmMlhq75QYneOhXcI%2BerdqZtStydn3edWA0gUEpq4u2ii1Xcp0pmDXq5eAohrkXCHwVIwBIc8NH%2B3iuGq9bf96cBD8chaLC0P2yL1SSqaGZs1lggvM48cdQs6X%2BA%2F9Thwq%2B%2BYsHgIzXHaRuuC9JMmsjsYSCYPLUgA%2Fak9cclTq97UxIYuN&X-Amz-Signature=ce41807a297a33101f262da08a00b2b269c3c3ec41d92666cef2a542801826fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GAFHW2H%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033839Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDAY8WR040EKsZ1JpmsoLLeHaqj0ttF26H%2BNxpuFebJ4AiBGByL0n%2B7pRbd55WlaKY5dNv%2BZjtFN3dMyIGTcpCR6uiqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOJPvc85xQRWf%2B%2FMHKtwDmj5vAM6CjhSYTj9Fk7vBosIP5k0Sv1T1ruDej9zckR%2FA8Z2%2BPuwjr4rs%2Feb2%2B5EaHRgzNE65H%2FRnUhMDjaKv5V%2BrpbYkOJypukEs4ww%2BgzDqet1I7WQZXSQFlCmXNHkoSkUISyogNvnFHs2grLxWM8l6KefPSpAIDk2u5lKXIi2yBZiTusX8aDWpEh%2FIojlXN0OcgSVz9vjzm3hetnMnGMp4BbSQk9qAWKsys72qJjsADWHYNnZIr5XcBbNyXca7VSYZXnyuyjPmwAsmn3sR%2F8r9Dg6fMjQhThr4TziS7Oa8SyLU80Xt24iV6CvpZEnbguaHLdphm4Uo23TDzKAoyRRbYdfBEl0KdkhiUbHmacq4w94kdH09ZiU5xIBwFUZq9YUqhXMXVR9vWGrxf5q%2BxEBk1BY1dYMVO%2B1D%2BMxXIAMu5BupoL%2BOOj%2BFo%2FvmOXSLZoJxN28Xo9mWNvFcICXRVX6hC6zTIJuj5VOR78mki%2F4JdhZFW5rKINlVROYxeSYHhw0T4o9FAhvZJ%2BrLy9E%2F6E4dfuc9%2FWfpzUDmAUXaKPBqEHoqqSVBrLkQ8fZuNPByuhV5EqPsPWd4yLleYf4%2FEhwyAlUBgC3XQaslf2XGDBrNXA83sOJCk3XLw8Aw3eP7zgY6pgG6DfsrGTxmVUzuzoYRYEaLPpXcF9QIdaVUwBSXzxcW0v3xRyRWtHCyeqcNqiPMIkPMg4zSDJx4j9yJrXqXj9QXPl6uQCBdTAuTUqzFk37yjal05JlO7qCWfny9Ko05aNAGTnbGw%2BXW53sTqul7rgvd71AEum3PXMBuLBjPQB9TaQWTkbK25P97BySgkOKLSg9dBnc%2Fi4UdcTPkFBmB5oSoaChAEDUf&X-Amz-Signature=48b5f88b1696effce05afa49758788c9184a4dae80b46de9e1e85646152064d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GAFHW2H%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T033839Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDAY8WR040EKsZ1JpmsoLLeHaqj0ttF26H%2BNxpuFebJ4AiBGByL0n%2B7pRbd55WlaKY5dNv%2BZjtFN3dMyIGTcpCR6uiqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOJPvc85xQRWf%2B%2FMHKtwDmj5vAM6CjhSYTj9Fk7vBosIP5k0Sv1T1ruDej9zckR%2FA8Z2%2BPuwjr4rs%2Feb2%2B5EaHRgzNE65H%2FRnUhMDjaKv5V%2BrpbYkOJypukEs4ww%2BgzDqet1I7WQZXSQFlCmXNHkoSkUISyogNvnFHs2grLxWM8l6KefPSpAIDk2u5lKXIi2yBZiTusX8aDWpEh%2FIojlXN0OcgSVz9vjzm3hetnMnGMp4BbSQk9qAWKsys72qJjsADWHYNnZIr5XcBbNyXca7VSYZXnyuyjPmwAsmn3sR%2F8r9Dg6fMjQhThr4TziS7Oa8SyLU80Xt24iV6CvpZEnbguaHLdphm4Uo23TDzKAoyRRbYdfBEl0KdkhiUbHmacq4w94kdH09ZiU5xIBwFUZq9YUqhXMXVR9vWGrxf5q%2BxEBk1BY1dYMVO%2B1D%2BMxXIAMu5BupoL%2BOOj%2BFo%2FvmOXSLZoJxN28Xo9mWNvFcICXRVX6hC6zTIJuj5VOR78mki%2F4JdhZFW5rKINlVROYxeSYHhw0T4o9FAhvZJ%2BrLy9E%2F6E4dfuc9%2FWfpzUDmAUXaKPBqEHoqqSVBrLkQ8fZuNPByuhV5EqPsPWd4yLleYf4%2FEhwyAlUBgC3XQaslf2XGDBrNXA83sOJCk3XLw8Aw3eP7zgY6pgG6DfsrGTxmVUzuzoYRYEaLPpXcF9QIdaVUwBSXzxcW0v3xRyRWtHCyeqcNqiPMIkPMg4zSDJx4j9yJrXqXj9QXPl6uQCBdTAuTUqzFk37yjal05JlO7qCWfny9Ko05aNAGTnbGw%2BXW53sTqul7rgvd71AEum3PXMBuLBjPQB9TaQWTkbK25P97BySgkOKLSg9dBnc%2Fi4UdcTPkFBmB5oSoaChAEDUf&X-Amz-Signature=74537f0b361d43bae96b098b1d0d269b581b99c16b1fab973d2499efa3b34086&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
