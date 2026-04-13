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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WN7FDW6Y%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035138Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICtidBzQpYGnhJGdmhvt1We%2BlGNpUQbIsBAWcroT5rObAiEA5%2Fzv9GQSjZHUQ%2B1CKl8lKYjzfL6NTEZJGpB5yj9Xgysq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDK480k0Ii1FqC0emPCrcAyayukrND%2FqKYz5HskG6M1h2F15n4spSiLWWUAVztZabKKZaRBV%2FJ9HnNx9IIY608emSlCBoGU8mADXfILwAQdHXlEJNtDCUXFUGyPqt3t5t6qR1AjXX9huhirlJ85xhqiH7LhdhYHXCObclOLJvl9ZuSIEZKg4Mk%2BPakGz3aiHsjsJS2dZczTH3G1HYPB1swX6V8g%2BmroZ3929t4Odxt3rRpXe9qc%2F7q%2BkgJfl77YTEmsV5QWGrjvX84WVhVvsggVnFGKqoMgHQ0QyAqEhVg4fBMvxvZ5mzx1B8JXpveMYdqSLFlgjlhpuy%2Bke0UDbeZC%2B3TPzn0HnxGWGXZezS1G7JuIvkJYqVLBwqQEc%2BTU7hCd3Kg%2BJvIjhvZOi16q9NNn9me9TPKSCwdVsHOs6QfCq3tjr%2FxC2PTEMZUPzXcZLPk9TEmcfwnMkBiZcfL7bprKDncXgWqISuY%2Fo4Wu5AqawNA74us2ZbDzD81sR6C6%2FGyjOHq9g%2BIgwkCwDi1OoxqUpQxxNcTonx4szp5rhVgvKn18pd5Lo8r9JcfG4JjuPc5hT4Vs4kDX4mV7VA0CD36xD49jpTLmcUIyQlb9F3IQ62GEoEgIsubphDdYAV0MZVzUjg7CpLOXifDskXMK6w8c4GOqUBgiBhnCNZoGBuSr2mepApSSP5Fzzt3BsXODHDnmdBKtT72LUSAcpKQsQChmA7aHjR%2BLXYLxwf%2F2QRvCObJPxveBTF25yikhtWT2ZpUT%2F7AEblwFV4tUbi%2FcK4xkv7nXGhAbQQYaV2iYw%2BLj2yDpSJj%2BtOE9N%2FsDMSnt%2BRtIz%2BqIi%2BnoZR1kkZEH6tZ0Vtu3TicNBdTS7%2FQZg2sAiblHNka6MT%2F1Zp&X-Amz-Signature=8e864adeb08a23b60cf856cbe1519f8af7400a93615f35ff3db41c5905ba733f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663LXQYLWA%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035141Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC0mV87a6GjyQc93JAp8Rk0NVK4ahgHELzH7hWwZ7vJhQIgFqlfryM1HWiBgIOu2Eic1teDi2KUs8PwxmAAHSK%2FtuQq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDEF099quAArl7uuhaSrcA0XhSnaFiwxJ4u0H5%2BWbX1RQiUvLtCgK2x8xF8z4goByQmVS3QdZMFel0xnGX13sdOKIQ3AvGXIOUsGonUP0G5AmSg9hoPJvMRa6YBFJfLUP7B54is824omHxmXNaXCMSV%2Brb9LCLFe%2BhSpuykcT0taUuw6JXugdC5R1c2iIfX568R6CeHnWzC6CVWaXWinYB97JCVdwSneRjcM6us0UnRIG7GLW7unD3jpZw6h427zWl3u9SNKxVOabSLMyUByG4PgsXQspwnVjtgjTs4%2FwwHRRCfJvKcQkc%2FYbhLEOBo0fX3GnUumbOhWBrzQwNAuy2bCY%2Fvrg%2F7JAGeG%2BQtyRmCi5LIlZBx5VYQ7IkDAzrLwMaIkQk4mt6XwEEFs0JPVoUvEtjapEDnquGhQOqWV1qa2yC47qy%2BO9nWcDwFXfyPxBz8eDB3XUOqXyUylV2zPgBquGraeUd6StH4QgAY68dXyr5sB%2FHhObqpJdx%2B7yITi2fCZceINBjfJe0eunnHbR8N4bckhn7lh%2BzpaK%2FGxzQn2eFsoGCwfz5NnNDEnw5Cbn%2B4S6Qizty9R1YMkycG8zkyYvnTg6v3cuCv6WuJ9e3aKhJh0Fd7gVdWJcoIutO0aNYsI59s427Y9IX%2FquMIOw8c4GOqUBjXibOnWDmg0l5qAxtn3g%2FmfXROdtquhNvUOzM8EP0Z8fEys%2B4MoC6gTd7Zg2DrhtD7Sq25LLvwpOKDVtJ%2FrgLjyWxIFosqIggq0aKrUMP%2FFu%2Fu73gDCSCRo9YPdpzWrr3rM4z2EPYYUcImzrbXwf7U2aYrOQM8cajkkFMEoowY%2FAsC5sDerXRhngiCQXWDbR3qaCw2ir88TrfYqI6DSb7vSB1KIB&X-Amz-Signature=b927d219a809b3f9bebfacd9f854ea15dff3264b6af070f458c58d2fa3587e1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIEQEP3K%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBAtaJWj%2FC4KBVe3goFDRAuKIbUQqXYU73vwR1KXZnmuAiB7BbDIiWiwRuJyHH4Ucy81eDXKuLsPR9goy6PTMqujSCr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMFst76gBm1bEDu0YRKtwD%2FybHeEfswzTZ8U%2FtbFOVHUv%2BtX9VJ17adn7BYauFTgxwz%2BJHOfzLBaXUoEgbxDOJeJ7678RlmPqvHcTZj2bjPJ3GuBuJQ1ZFL8UO0WOG3npQkJtQlmyDYbLmUdy%2BhIMSlW6ru5WcWoxpNIj%2F30gFFqpXnYLk176FAnb4uYGf2fTRqgHZVma66AzB3XjyZF0EpbEUxH%2BN30XLMPL5aADSfUcEhl0aHIYvu6yQjKHjS2m2rzs1fRNOsJwSyreWJNm2bBf79KCOyUGwKqJtww228nev2NC9S55CX0WnRAwuGFFZNEkAaVzaIR0CkwwGlkF9eY3%2BrqGCZ1mhbKDy1QDTY00ky1zzyR4j9j3pqL3SbyXR2a3VbPCNOA1IK5G6rAI3veAq8Wh4CAA56vVaM%2B%2Fgt8Djoa6bowQi1f%2BSi1lROALjGbY5urCm5uNv1TqZSEyOUxOpidbBRgL3n0%2BnkQyWRQtJ9yizL%2F9a1Gtk%2BaqckBXl7eaviC4OrGTFAqc1nGaTiSOA1DGpvg7KikEoV45x7jbu7175x%2FSL1Q23UmSWXkXDx5rRG43EPv738iDOYFOVgMm37JKNuBBqmwn6k6quh4aO%2F2Kht5wYIiTlU17GWZezpIYqEmCzuejb2ukw4bLxzgY6pgHzv9mWfp79CND4XKToTPtCD1FMApTdy0KCEnmRXWNnFRP8w3H0r%2FkYvOrKsutw1u1pRwqV9jbaPj3qvVZ0zbky%2BE4BC13LRNNpp%2FMBj6Kq7vmhoifYomIVSf2O5Zdnf%2FiXDARlirtpuexYYPZ2vfBAWbvcnQVWwwtyU0v4or0%2B1xZ8d5HyOXwnuEUxFiBycAIJtMoBX1C544xZ%2BYWW1lg3Lsz47HLk&X-Amz-Signature=c0a3cf935a88f7da7e0a43ab81d8c46ad12d6664a72ad7acfb0f2b5f05237ca9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666GG7RHDL%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID%2BnMqoIC6e8JufzSrtlyeGuuN8cstOQMqBx5Tz%2FMyfIAiEA3ulYVHgeySCaeZVMF9%2Fmm%2ByJcCHqs48h6sVjWSsf6Aoq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDGaD%2FUUmRo3I28XsPircA%2BhKkVepz6hFcY9BSUC7Ye2srj4YW0%2BXYpi%2Bflp9BdDBwwODehOKA1BQX9Qcg69Nt9xTGlAdfxYQKn6UvJjC8xaZJssZRlI0iedU0b7d9GJycDclL8YIbwGmtIM38KbFi9ZkNl%2B4DVe%2Fic2qBEIUkBRrEqUrqT5ay2iJzpE2Ms%2F7gLNqwd3T1Y3yKcwfXLAY0HEnM7wXVkEIW56G0y%2BMQX5rQEDWC4R52gZ0i7SiDnxwT1UBHaMa5d8Qc4LbKPMJl63TUq%2FWV%2FogOwbBi0yGKYNnTjdfWxj0YKWFonjLiKlAfhkDzark%2BmexnaefjJEnU4a6uGyehiAZOORa4oesipEjfNVlLUSZHHpG2a%2FFm0Ra9GTWllxr0rtq5VfyuQqxgUnWPpMHJ5yBuiQM%2Fqp%2BROy7fbP77rLk%2FIjQfjbLl02izmY3wHPawh7ZWMkDK%2BsEjlg%2BG1bDYgPJ2mned8C6vf6CQ8MqmVwHQVLMCt%2FvwmDh93LORLCE2OqDww0XGJSBXnPdU8wuYPnWdZU2tNxdZbxAmMaiuNuUuvY4EEc%2FyFKUkumzcBOSa18T3Nul336VJinVn203QfsG%2BtvpZCSkrTGmBmSdLXDJJzI7CEYQz3YGpQHXhzbACIxYlf7fMPWw8c4GOqUBrOzMcGqBiC%2BNV9J79GTW4vGD5hG1riFKPoyjWQYeeuiG4p0TusSPcYNX56oppMSC3qe%2BgY9jMe4jN7%2FdQ%2Benjjn730b0VmtL5TREhSJyhdMp4dFq1r02ohXHKaiBp2g9F6jb6SkHxtB4CqvC01zBIsnEenJyuxWVGd3o6QxumICb0sNmVuHzegO%2Bm6%2FgjTm3bOc8O9XoW1m4ObvKjKIDtIFC%2BzSX&X-Amz-Signature=2d80613cd6eb053fda49073e55741d5a4fa639b19b2a1f88357ba880300d559a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y5YUBIRW%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDaBuoblx8YHXBCx0vgVxk3%2B8YvXPszH3fIRoKIZSIDggIgWvi4XqVC7y1SRbjGCutEgrGpK7Sh7g4uMgzlD7Oof0Eq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDK9sDXTFY8QkNiaT0CrcAxeq9CdW0VWR04N%2FREkVhwHiiQbAqo4sMvyK6DwRa%2FNlMDJHXBR45CdSdZjsa5VyXoEw3A0pa9F4EmnIa1OyeGglcioq1MKSvr7q2FkmZjHg%2BI61hpps0O7nOGGjflGGKHTEApm6M0SJjIp7KqMbogaH%2F4a7M5oM3cKas8m4h76ZR%2FXlcB1KLEzNtJknPoOXlBqZqFHHxBPD7Tw0beugfKhuZALgusexVUNsCIyjMAr%2FPMOPcWtxz5%2FrhrDkeFVOcIaK6os05F5zOsJkjg7gQwYpeF2ZoA1ljpUK%2FiDWp21IN2PcM3gz2em2%2BBHES%2FtamVGijzjiVGfrEXsOUghomQeWbbUdAJpSsE4X2c9vipVgTXdSCLrLgxYD8SArJBmT%2Fary0VnEr2vKqePsPpsZ16%2BLKGpnzqAOfX%2FodAyFnkwcwPA2xt%2FbF1E7893%2BZcTqVovaGUo%2BYovNLQTUjZ%2F0yeDXdN4%2Fh0Oavp53c7%2B745Uw12fou9C9aVbLrDRF%2B4JQ8nkzm4HZOgbvwbULIeEJrqgIpRs43sPXqqYCFrb5qwBVeTbX9ovxeDplJkYMO0FmeLicsaxK4NjXM6JVQYjLNhbtDa65MtXmNNEziX28w9%2BimoEba2CYgrLNC0Z%2FMMmy8c4GOqUBuhOQKjzty%2F2SCbcP7gkSSeRXi2rTWgpPtOQkvLKlNi%2F18lQ6IUDgcEgkput54hW1Lh2JNfuizdixThboq4cwvh7B9jQOCQvby0PFUNNylp7u%2BfJSviKPTPqeNMD85XjTWTK%2BjHAJ04I1toM2F786bS4iQthhCKVJFw3YIsW%2BRLCL6rKN6odsF%2BA3HtAvkNFDEuKSPogNceVXZ%2BBoGq2RZnDFsi7%2B&X-Amz-Signature=5d94b363ed1015651950014efe2a786a5e8b0c2d28a9907c289b7ba946f46741&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TYIS37UQ%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBAj5x2pu15wAP%2BrGXeNtjJs%2F8Cy70puUXaMq3rwXP4GAiBIAsppPVL%2FkgiGjLrmhsCjY6Y0tudbyBjeFU9buSPi%2FSr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMsQOoAuGJn7%2B5H06EKtwDE8YwsJ6aukmWsVQYH2alnZTgd1v9s6OrMmtC5V4r136VBOX1CNomv6LUABHFcBubZmuWwms%2BPw3MSlSylgA0Ct4uU2PPZkpssbnzSJLr8ZuinkHbarPnTH3Iy40WpdCn1IXwI6e5voK4zzVnhdyWVfQh%2BWQqpuL56CaxH6Dl5rkUaez2dUh%2Bn7YC7%2F%2FN4AvYelQo%2FXIrdKol%2BP%2F2Z02AVkdajKS4g4wu%2B7CXssnPLpCAiDEnZPrITvSv356QX32wXrG5TxMoZ4f0HEUCwY5LXN21g0212oC2TwIZDc5EfRr8LvouIHwtCD%2F92%2BVPg5soozpwVUgrz0O1WlFQWIt8O3hMGjKXKDwkJHVGaa8IiuqiLZTvopyWWs3vQENBQrQzhdRiw61EyzYrC4gXe60Dn4tmBXp6gGBc8xlBhlU5HpPDIZw9DPxynEaL05C5jovY%2B%2BIozGxUP1aJ5Q3MT3m%2F63pxnw9TGsuJggxyBHwq0bL30iEcznUa9kt2o9k2mbs0UwSmAu7tLJPbfN1cNHJapoYb9LQJ34gOfXEcCzbQnnnwpLHpE9DiAnVqwWp0OrQ6b0iHRe2fEuYLKcxSa7hEFNvScNxk9OmCes6spqG%2Buadsx8P6B%2BiLtEFPYW0wj7DxzgY6pgFsJ6NJz4F5QGwM%2FFs5lr2GZm0KGd%2B0RcX0hyd4vYeeKrn34IE6puxQa0ZqEJHpoCT0oRKe2WmOvhNXeJ1dKXSTFvkZRlQhc3hR3FbEVz7w5RSvda9vIj6M5tdoxfAh21zIbuLSurxEpDSaxn%2FCVztTR80GO0wlTY9%2BRNcVDOeO%2FLPN%2ByPoaVTIq87ld8MiJcKKwZn4JFnl9uoSGtST3l7vfjkAln9X&X-Amz-Signature=5a01267de4354a3ff5bd8a44625c144e2bcdf3758871a5ce3cce26f96dc6b031&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSKYPCKJ%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICgesuZLgqfQDNbien0DXqu5N27mZOjkGrnR2Vu8756IAiAqDLsFrbwgTeBUjaP3EekmDlopceW7VnS85ON0BfAUAyr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIM5Vqf4QD4bqNzmMFIKtwDHddlQF3X7OG4Up2Z0qZxpQH7kJ%2F3dTnuTKdoIWk6FAjXcqf8MvZ3JgO3ntQKjmclXxiQZG434CGGIoRY2mBes4kJ688av7IGzESnDvLF3Y04Nu1EPl3ndqY9SzZsk%2BU%2BSJMSlRL9v%2Bng%2BBH1rPmo2BGcs1EIcVdU9ULthG%2BLgY0cRQPalvl%2FlOialXb%2FDfneg24nUvqx4FBJPygYOLRVhngaJ6l1VVuH9uY6RdWF7mMbT%2FKhcqjbUyFmbnBf2VPRaVIvGAC2EUdY1CXCrTNOc25oiuKwswrKsRRyrBYVZ8sCCzrPpV2%2FgZr3Yt30I2aOuDdVjxNgIZvZlCIlwIW4Tjb3rMVJJD4yiJ41AMEr%2Bxyg8OvM0T2wJDA2BMN7A1gLCDvqpNStDmeQS04Bsj6r%2FIcUrPa%2BGBDtH43tyAxJzHnHphB38HjXxsh0BVWH8I5cr0SREo4zDnjvdMDZ5Ni6VdYCyytq7NsxDd%2F3qFEYVR7g4Z6ITW6CPPrYbxjMJj4By80s7QqvFG99JhKwGjX1G7pWeMYoW1Kz8ycC1fF6Aba5ffuLJ8UeiIkhpsYYefIOU8en4H9NGc%2F8MfXydO%2FaXwCB5naKCM%2FkUZazfRT0lI8w3HgNRd%2BWkB53vNUwn7LxzgY6pgF3L8jwJuuDXx5qL1lA6llHojgbPW6Bkc6OHJJh8HDbxXvCQ7PGvJ1A5U9YUJTD5o6fLSlo98VllkfElML5%2BJCnPKcybu3%2BRnhALdbL8waaRRv%2BANsox0brZFxGFV9M%2F%2FFWKZFNPqKB3k%2FwVInNHueYrQWIjFd6S46upZCCu8JjpEUzF%2FtuGEjzpIAVDNYFY24in597HK78%2F2cswaol6TTkEx%2Fm9hx%2F&X-Amz-Signature=ec1eb8c21a44d110b61db1de50364db95591fcd33956252fc3fb3d6c2e693de4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZDS42IAT%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICVVlPZfkjKxAW9DfNdTWCNLguKf0pvwU%2F3Yumd31Tf0AiEApQyDh9IdtAHrDhuvZukrJAXjn3yviIjYOCy1esdNLxIq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDMESX2s03gYiTAdRvircAzATGIG67FW2f0e5zVEoUsRokeBvq8rVMLAJK7p7IX7Pi0OuEjpEupxSQGceW0BgjArcrtZHWwoiLdY59LKLGrYEvXGNVRAFfTClgAcbhPxgr0aTQuK07h7ZGITTiUTLR6fP68C%2BCw1eOlKoYnGHzY9MRk6rLhhIzkJ3ouLAdPxKW%2Bmghou0YNUwtMtW37OtyUxLrHNuMKsONaZ5JFV7cC9Y9Mc3rRmMbCgsvnaRz4jzHwC89WhzzRz5ZlUNk%2BgP5%2BE3FzWAGv8HlW83F4thY0VeBLXM%2ByFkxkKWpxntnHGXiqj5R8Phd9aFqgAI33XyTG%2B2ZyWoqUpIjjRenBMcoymztYIsskGOxcCwPcHQnNsMhdnopwJdAPTAnP4ZqPJd0xn5PBZgIPlPSVdlcraVgw5kvD2lAaYw%2FyU84EJv133GcoWgTQVlxKqD15bPRZ3wzk6RBF%2BzmoBQjBuOkj2ONZdTQ0ORboNCX%2FDkd8lOi%2BQgXbSOqWxnBGfUf2Q%2FrZoycZ9LqFFIqVPRiBgJsXZHdX19uhNK7Ux59yChYABs19qqI2aVpnvT4h2hmc%2BchpEdd5%2BdGQyJfwGHSEFG1tA8QSEOI0xR78E1IQS4GnvPxlloNYoFHQ9O%2Fy7Yio%2BSMISy8c4GOqUBOu38XPm1%2BG2LykMxSq1Hr5shqjMu2TuPDrRb43hud%2FTeLhFT840DvMmkt90uc5x6chk7Ur8ei5iATp8L%2FdJUWPPrQitLEODmKALFtlKXtpIYtXWe2skYXg9z0b3kwBP2GmEeaXQPSnM35Eip6ynurarsqwsfG%2FubnTY%2BGRX9Ln5nSa2EldNtzoBAqYRf4RzRM23Y06aESkGHT%2FbV%2FtjDq6jachAi&X-Amz-Signature=cfb35e5efaea467f1e75290d5025414366888bad81ae2de9f2e03936a768f8ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466THYMQRBN%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCAf074JY4D83fZKta1vcU%2Fdr%2BHuYXSJnbsvPImL8MtygIhAJictVd5Elv1ccC%2Bizm%2F5LueBxGFQC6Cr1RRGhkSDy83Kv8DCGwQABoMNjM3NDIzMTgzODA1IgzC0cJX%2B0Q7OuAWlWMq3APIvpNiPjv5V1TeBJMUAFG4CNPEbqj7BctaEtbYo4E7luZTLKzK7is4l7eicHIIeoJb%2FlmXe7z2BlUJLfGWvKAvpYOmVyUAZv%2BXN1V0YZQXdmH0mj25QyGCWjQrgG2G6axBE6UFq0qfMFdsdZmuGWSKazCuXwyV7AgYbZVtBAQP6J9tvflZikBciXF0r2NvVSsT0uduSyAOvprUwJgC2z2mCKRHoF717bh3O4Kk2UVNVSVWaPkfrVFT4Z9GaaGgE8nm04Ilk8t3MgsJbnfJ83JobApDxN3vi0MwkRCpsyY1%2FzuXhnn9HvqokmmGmr87IdwGEcDWJHeTteGf6SY19AYsQluVpJC%2B6TBPlZ1nCGbqmkwKdtKTYhh7k3N2WqSxLHGM95%2FV9Q916HY816HMy4gf3Hn6Ye5MzmLexHIBQDYdxmy1PcC8yy3DbDQ0fu2MAsnAcp1DGEmFXlwJ9sU9DDFskvd8jLJRP2i0ON3HUehAgMZDatwR21m1vNVoEONW2BL%2FTplPGLKYJ9iovibfhxrHcabd1MWVa32PyJJ0bPUnAKU64Y%2B0qz%2BH8SbUkkdlDoTMO9XFl%2FMi5wr6IV4z0QsnBgOd%2FehAZF0YmHBYbXvf5IA3q9PqcrP%2FaGL1wTDJsvHOBjqkATYd%2Bvlak9MqZaoVAFdV7tuB0kiJfSEL%2FAMmuOIy7hntU94LPk%2BJtDKtyEMWDegSqXMFVv7%2BQfWMVTIc7%2F3Eu%2FGCULqkBldCuaJH3oLos0AtDI0hYFww34d14G6SQfGOOF%2F698oniFMHs7WyES4P398P3G89BywKAkJWzXcDYLrAUa74wuSN%2FBP5HNAeGXXGxHEb8oBVJHr8x3IurbVuo9eCneTM&X-Amz-Signature=5100f24d135c0a406c9b501e2db131b4609ee1e60248c8399423208beb50f0f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAR43SYG%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035149Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC9%2FSCWEHKqWV91K5U14TEP%2BLg05Hj0GeY9vfx%2BLnBO4wIhAPe4WXOfkO%2BBiIqRapI91WHZ2X4NhO8kU1WNvT1y6m7fKv8DCGwQABoMNjM3NDIzMTgzODA1IgzkgGaD5DJQVaitLkAq3AMbmm4v%2B8O%2BD0tLShbXhpbEOtIYHXfaU4OGmDpCLJBe8gg%2BtlD8wgLZVrNJOOoTgoXnsDVkMVFi%2Bsqnmte%2BuLLJsh1RHlc1OMdxP3H8Vz1T8I%2BRGH9ETHvAaPCx3eCaoKkWKmy%2FkFn0LAKb4RFHIIvKr4jyLmQ6zA%2FGSZxNYMaKdPTBm0k7QOuKYW4NQzobdNHtP2h5UpW4YDS2aBDmF24xty8XjTwITUlC%2ButW3tmXcTiu4uMW3RO%2FoJlPzQy5BFPTpqveyKX%2BxR5czQC3R0tT4FqLr57CQaV9qmD3NyolZdmPrJXHvcYeGqLsjkVHuLoyVMjDBcZRQmlwujH6aAjTr16cou2yKkAAt4tsG0m%2Fz%2BuBgUH%2FsIKpbg0Ekq5%2F23dsjAbcHlqd7k01QvSPY9B5YPJrYH%2B4Cb3bLYVxMKTJIoX0R5bsc%2FBno5RPgfNwjf656X1jPi3OVtPPcaFlju%2BTNBGvB3syPPeO88YIEyHgzbh9yka7r7yEZ0qv50IxAA5XQgn7lxkH0ZiIPO7o%2BgpaajCZb4Y1U%2BivHGPzCg3XagVVzP%2FENk7haneTE0JWAHMoQ%2FMoB9o%2FyJqCduOilmmIMR%2BWC17GBLDzPyPnr3x3EYXy4PKcaP6qGC1vjzC5rvHOBjqkAYGNuWo2c9HFxUU4VWJbiYlP1Dm3LsztACsnwUW2KojheqL96DpAVxb%2BpsHsdarkOZ%2F1TqGiqVMZ08LYRujamVOsYVnRqQdxZ04%2FBgt848YyoQ%2BLvdxoRJmkj3830SxKC0Zimq%2B5a7ocqGfFBVEXs3nLMBS6qMzfWL%2BUmKj8G3GDCMUvoIkyXEcLY4cFuOo6bixi2VfPFC0%2BKiPuS6l9URcm70Sf&X-Amz-Signature=61e8e860d67c7fc581c5792aaf32a77dc72e0d87e402784a54ee1be45b0a6cff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3EGK2JR%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035149Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDJ6ez%2FDBKi7dDd%2FTXlIAyqUjuBjctMlaz%2FdsBEAVa4yAiEAsCZrDjFAsLzJDWEO9CZ4xqajAKWtWWzWqxeKcXbC67gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDLkuVeJWW9DfnES7uCrcA5YvqyOZGtOPVIBBm25GX4jDnNNmZIDJxFvMD1fAVV7hgNacywxlimExOSctJA54iyt3wncCUTa2sd2TU5zlp0ENiecA7%2Fy%2BL96PcMBHaeLW4BZO0WV%2FqBWZtu2ira3AJuFwNoU7adOzU4yjCHKJEtbVGZRD4rbd0qR%2BWBBardx33dCnZQEDOikwFB58YLAcE4QR5QBsk2SqBofE11fNlAa7iGWmBmgE1z4hsj4%2FtirwVuDZZsWipqX5kX5U%2BiXw5ZAPv3Ct52u%2FmfF5Oi9Aokb72jYgRYyIX9vmzeTbdT1dF6E0CUjBGNxL%2BUO4iEi%2BDGUY8keO4ini6JW0uOhKK1mifHr2jfsR77CXxJoxaH4u7RDP%2FTCNnMSP2ZUEt0OreSHRHvRGISfjwgRyPb4yiikdsTMoeoi%2F0vyVTygql6uCgwoWjsXRjfi1sZ10TlBO244mX2QpwEJHqj2LwwUnkGcM%2BmmO6FUhUzFU9jpyYRk5jdGa28pdA5%2FzoRsytj075qbOid4DU%2Baryr0Pn3IYBay1mUsw4l%2FhUW3hdcAuzNfXk29ZjVIeOC8SjHiGnUQtG9qbHKmN5282DzQ%2FDlCT6rdU5whfSYmdXvgvDQknx04966Be%2FIyCMNsTsVPpMNmx8c4GOqUB357%2BCpkLcTYYHi4K9OYMyQnKg7kMpQrfXlrtgHYKzPdvPIKPt1Y6ol1S7PHyrtmzNzse9OD9iYFpGag9t9cGE0wil09byl9KYkUY8J1yG8ykDZeV81xT5lKWEvg7f3oMv%2F19CSNz8fTSrmwKuwxH9CDYRHbMpcUtyuv15a954OEiGbnDi%2FHRTqe7imqkIkmcnkjv%2BZ8hewG4%2Fq781t1NQ1ahG0fy&X-Amz-Signature=9532d78d60e40e87f3a96275e8b5d59ddccf02e7d2a1661bba9dfdbbdccbf5de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466672EAX6P%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDr6YmSo%2BHACgGzr2nLOUhbfVmdvOlp4Ii7d7112xf0XAiEA5rEJYv63cyDLFEAaICySkPtYcFeP1eclpNsajQywKb8q%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDFcy0DGNflMu%2Byi1rCrcA0gBh8d9%2BMC2pAEHq2NdCYmd0FKxUCmNL1BJcspoWQQ8JfrEsm%2Fbc%2FgMaApY%2BfPXZuWOVXOx4TVP9NFFhR7MD6Yhz4TRkZC0QR1%2F%2BvBZVNpTGv7qPOrJumYqDzuxrqdcHsG40nCOpGVEdP4OeNt9xG1oInEAfUvL7SEmFeT6CNiM5HTi86MaGb9F6hRz8zfLgH5Lh0wUsodPTcnnVWb74NL4cMCxBiUFqtEkLkUBCf%2F3NL6BYPU9wzC3WSH%2FJZ5jsOdycBF6vb2ZxyUo0T%2BrVltzvob%2Bmj16e52U7O6%2BIq5vgLht70RrkBsniJ32ddoJE1AuZAzpK5LuOm8mlozzyrkFF3HcDFJjLEyDCRz3uPU%2FGzEqipoz3i%2FLl5vqUjuHYfLR8mY%2B4%2BSooJWWtXhwjUY%2BycRGyQDbz2W6i9GOx802u6BprcKEHAziqQqrocL%2FSo%2BIC6ogpI8hDC80rKaZzZzcZm0Ivb%2Fk%2Bxp2Pukk7LTFvakof8wqwt%2FCpRn8E%2BoDE7Kw9cZijXxdAd0%2FE3cPK%2FIFLgdDddhZZXp%2FWsNniBZkJlBGrQgzvuqsTDa9VZ%2Bw7%2F3jZewsRgL6eJy1VPqH1FJDWYQetHN54NH2aGyaf%2Fo8Q9vyIfPgewFD0DYWMPKw8c4GOqUB%2F12SS7sDYs6ERTGUOhv%2FhguzG82v7V0Wf5kChflrqxTtxgCJ5nLUJK9YqlZQrcMfezEunRlM0hTMjG9dONNCFyE8Fvwk9wSFHO9XizE54570fK5Y9LRqN0zZZf0kzui3yU4PSKti7wQQUKWr55EXLtf3cp3r8u3ObTLglFB0XTfAUrjK2cckAjGrwytaWqGyikRf25Gcrvsr1ubqh8jJEBpt42Q8&X-Amz-Signature=c8bd0724aed9f070d508e8ac5d80df88fa3b8f7c7945f5b5027889f7b2c174bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667O6XA4Z3%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBhULooeqjIxhCiHEurt44fIoQyKe9S%2B%2B03qd%2F1HAPzKAiAku9L5%2BkImviWiE9GiCjbM5g3Xn%2BwTEGflk3vUAw%2BWSCr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIM5EMZYuAPv%2Bra7shDKtwDlhby7Vc5SFwvueBHXbwh0dmvRydhTTZjnrAxsOaay9cUvekg7o60cmTyw9Pl7kP8NorEmYfjvd021vXoL%2Fb6I6YfABNYmN1edQtQslWcv8hHLRVZ8DDiNSfYpzhnXb2RwFrxVtOa2jCpAn9MjqlwrRKjR7%2FMIkKBfPEdy9kTA1Dfh7HoMdtn2CAUBnAMhZgdVyU8B6F9PF%2FYJndebZPjRGbeY%2Bskp%2Frzn7znUxJIjk94Dyds9hnfvopVnMZW7FqIXrEGikRASvd63MFlJj9sXf1ANtFr7cOkiJm3D%2B9wJZihDIULa%2B5bERHoLF0RsfnDy5ftiMJ1i1sTfZ7FpTtDx69ti%2F4VHSDP2CANsdyTlm6CgWq85ZqNvxUP1rtwoyl9EDWLR%2BrfWC%2Fpy63M0AjIdagfgEf1SilsanCNxwcEZHY8%2Bni01DuTCpzxGVslk%2FkBUqYPKWZa20TT%2FZWyTDI3lGVtYPdlTw4B46DFtpda70Jd9OQ%2BK5gMguZG7j7%2BW1DJiXpiWqdnK72HUb6Utr3GEttyeMeKDpS0BBos3nBR7pHVh1Sttxi1TlWkQbbrjhRdwzDhTllQ6iBw8JRB2NMys6e5u2wbI6vPcUHqG6OxEojdH9fwajyaxDX1c%2BowsrLxzgY6pgF%2BQ48WpTp7DaCZAp%2Bnj8wZ9Q1vRnlylcA7ZLdn73lcaRNFFRIHLiS21%2B413Uk%2FB9%2BmjKyZRPHNgbgTA%2BBac5s%2FY5m%2F0Es1QUdSxQVrZkEx1Gye5yq%2FogTgW%2FJgE50gHLy4A0B2PeVGKNqlu6YfD%2BRZVj5RJhbQ%2B3q7ZEcm9MdC4mSNiNPDqBtOFNR4u43zspXv68aTGM6E5QqznAODJcpV5q4UCXH4&X-Amz-Signature=693f1f869e2870187a438174076baeec31e0a2a65bf231a07d1a7d98f4ca3f6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667O6XA4Z3%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBhULooeqjIxhCiHEurt44fIoQyKe9S%2B%2B03qd%2F1HAPzKAiAku9L5%2BkImviWiE9GiCjbM5g3Xn%2BwTEGflk3vUAw%2BWSCr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIM5EMZYuAPv%2Bra7shDKtwDlhby7Vc5SFwvueBHXbwh0dmvRydhTTZjnrAxsOaay9cUvekg7o60cmTyw9Pl7kP8NorEmYfjvd021vXoL%2Fb6I6YfABNYmN1edQtQslWcv8hHLRVZ8DDiNSfYpzhnXb2RwFrxVtOa2jCpAn9MjqlwrRKjR7%2FMIkKBfPEdy9kTA1Dfh7HoMdtn2CAUBnAMhZgdVyU8B6F9PF%2FYJndebZPjRGbeY%2Bskp%2Frzn7znUxJIjk94Dyds9hnfvopVnMZW7FqIXrEGikRASvd63MFlJj9sXf1ANtFr7cOkiJm3D%2B9wJZihDIULa%2B5bERHoLF0RsfnDy5ftiMJ1i1sTfZ7FpTtDx69ti%2F4VHSDP2CANsdyTlm6CgWq85ZqNvxUP1rtwoyl9EDWLR%2BrfWC%2Fpy63M0AjIdagfgEf1SilsanCNxwcEZHY8%2Bni01DuTCpzxGVslk%2FkBUqYPKWZa20TT%2FZWyTDI3lGVtYPdlTw4B46DFtpda70Jd9OQ%2BK5gMguZG7j7%2BW1DJiXpiWqdnK72HUb6Utr3GEttyeMeKDpS0BBos3nBR7pHVh1Sttxi1TlWkQbbrjhRdwzDhTllQ6iBw8JRB2NMys6e5u2wbI6vPcUHqG6OxEojdH9fwajyaxDX1c%2BowsrLxzgY6pgF%2BQ48WpTp7DaCZAp%2Bnj8wZ9Q1vRnlylcA7ZLdn73lcaRNFFRIHLiS21%2B413Uk%2FB9%2BmjKyZRPHNgbgTA%2BBac5s%2FY5m%2F0Es1QUdSxQVrZkEx1Gye5yq%2FogTgW%2FJgE50gHLy4A0B2PeVGKNqlu6YfD%2BRZVj5RJhbQ%2B3q7ZEcm9MdC4mSNiNPDqBtOFNR4u43zspXv68aTGM6E5QqznAODJcpV5q4UCXH4&X-Amz-Signature=266ed7291c835d75f9a00b9e984ffb2dc9ba527a08fae38b607b47aac70a6be0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
