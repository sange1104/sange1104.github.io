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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WFET4GXU%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033653Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIAl0975Gttm6DlCj2rRw84q6Pt5X7EDso5zjMPcXJ%2BNRAiEArMBq8lbgA%2BfPGVkh9Z2cXN8lfS8RkuTC5q%2FtjOcOs6kq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDPhUgbBKx33HO6I5myrcA8W2gNhuaBs5vIZ88RxdFSf%2BbU3udGugNvFu1RTzErF3Fu3T22G95DCN01Oe9dahS85aYukg%2BTvlCudiMkkoImyw3q7YnSlrdvFOhjVh%2Bj8sry63kLNd3rldC7qLYOWdW80VYKJTk0hc3U4hKF%2BTL9hIjv0Qq%2B1iE7TxuJ4Uo6hM86Cdzbr%2BZGfi61LydQqZfNJqEyHl04zFDrQwMnVDmeJt1%2FDMPp7xJ1RmmtUf7a%2FIj1ld1g3MuSehhmpQtYp7ahCuDRhoEOMXEbqc9h0GSnj01fEuNOTeTu4E7d3FGezbVZJkzzFu6yLorxTFd5fUAwpVcC7b4xLBv48bw0sSIfWHOLfimgFEEb2ChwLBjTY2PA3OFq5FgRtWJbMxi20dV7jBXz6oKxx%2BHsJX5JZdCGq5Y1KJi9VqlYzuNhTMzU3kUeN25ABWc%2BtLSOZwsYIXyehqBq7lBcqPzrTP2mV0sPZiZQO7OfyAxnZrmCgPFdguu8C8dvupLFkqBKn9EIv%2F462LzCfSE9sAEtfIMf9DqN%2B5DMppAUQ0PPKSmxn5dLCXXj3uAcGTsK%2BEuQA1aQyXoLL7YurJUe8syVuiUOQWgs5vhmi6FgTR5PI7Q77gUpaLGR6QQloL6Me9couhMN3Jp84GOqUBUx5ks7og4lrEhB1XKVJJVmRybVLurDV0xF2c2BtvE6kyzFjrUcZsHk2toqkH7n2K%2FQkOptQh8hNOVHsaxemtS8UIwik4WTj90xFdscMIpHfQKOZ%2FaWWBy%2BDrHNXdk2ZQyo5azAq9UEptOZenfHg0NmmO0WZQ3vj5Jl%2Fk7iLFk55eP%2BvkLP2rDXiUWH2dE0JE%2Ft4lE3c1M2AQZj7HwGdwqGYaGkXI&X-Amz-Signature=6824d797ba1b16a8a4d808345cf27bbc244e86863518cad209c3dcf55ea97d53&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U4LC2OWN%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQCyLoDqn6ClMH9QODRGKPPuC3HnZ3wvYcwW8Wvn1EPmAAIgVOL9mQ8jP2np%2BxSqHAt0bdLqTgIiHiOwgY68Yzmjt8cq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDNXPX1s6CQrCeIhsmCrcA4evE9jp%2FpUhYCBsVDnhy2qIhysbVCiz4TDgak%2BZrbNZtlwefPr%2Bt6ROvp5Qu13ZIVxdSjRz6OTl5sh0YDhllH0%2BoD%2BsVuduqcVvfm1qudRHoWA8HkMMK5QhDi4mLdC55ZbHF8G1eTVyV77Y6ibmRCSqFIiZuAclJhcr%2F54DRvmv%2BvFPeNaDgcb5rCm7WfF6LDHWlbjaldo03WTsgM9q1CgqVaK4rfFp3dDlRRKlziJvJ0HTwK22qO6wPA81u0pS1nXtzQ6LhrmPU4VVtCTaUlQqIHTdEGavQP2YpGyJYORfK4UXXPAClAfHZN0Vm8x4Hzz8uUd0%2F3FbsQhVSam1KTe2lZ6rnoY20XqsN7E3%2Fn6JTmjolx2lE6wUghgXJALBA2wqi%2BCXkStu2EWDjPqnS8hS2caCKSQp%2BX8XKf8h5F%2Fda%2F9ZvpAZO8nvIikO0BZVL9RPGyVevX0pPuLrlgJsrpG2AxV2EdPyVtPphEvj5Os1hTbLpcGWlez1WG2EOrhef2kcbH1ktWaUEQR0ilui93203Hna8zxJYxPFdh9iTwzL0RGuPQWTg26N6M1ilPNiEW14eWO01WAwNdWICu3j9NYOgwITZXSgRbSsfJnblCj24L1LuFvUncHx20jNMKTHp84GOqUByjNsM8tG7r3VbzLPiO2T5GbOQJNTj6mfFLdOp8kR1iBW0SO2Zm6AjHv5DaojRoSuSfjXXcI2t%2FekILzj%2FuHZpVfE2jxv31w2Ri14%2BWDvlr%2FUJgCGZzpzB8tjDHXBy05gsqS5M5f%2FILnEEM8QkYulYz%2BEbJlJBIg%2FdlzQuGR5alVzCuA%2BiJGfI%2B1188Skcd9SRx9pOepVMFYIeMhre9VQyrhHTmsp&X-Amz-Signature=e930939476ff69d6c905bf736b1a8fac358708b6cf238216d6222db0211933e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMW72XVY%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCKeYW7S3LA5bfcZL3JouWRHd8bC5ldVTsEjT2eLJ3XvAIhAOMmKi%2Be%2BoIfTlLraB2rKDeWA0dLUi4BrrfyCLwiJwVQKv8DCBwQABoMNjM3NDIzMTgzODA1Igz2ygXcyhQHqd6OL6Mq3APtO4R9v0gFiI09RQPs%2FdHEOm%2BncK5qSiO1Scm8yAGvD4jGExrIY00bJGtavht%2BwH%2BTh6YnP6KeNcT4GZ1u4U9LKIbPhXLLiImrph1Ehv339QVn5L6f8y78pVWQq%2FytPB6exZhXMYhO7RpXZ0x34BXG0xz9TPtuZHM95Zc3Mi%2BUyYtz34o4yCio2cVP2METuj4QspD8evivXq7Kl7fsSum9hRIuS5TlqztKB%2F0SOZr9R3%2FB8XAMFqpGYp%2FqgFhnuOVPA8G1UekYOijUWjQ%2By9o5c%2BI%2BxCebWuuMPq0jm9I5Yw6FYQv1jkqD9E4OJGBxcgEI4469FQ9S3pQlzIKIq7yykBIOdov3ix3hbUDl5tdy%2FYYAvreM%2Bw6vS%2BY8Y4EyuXRlaijICAl5dG4WnuDG8mpJvTywctVlBfkd9Qt4LNITf%2BLBVO6Pd%2FZ30jms7CO7zBppGylIU%2FYVEwYC%2BQ0jGAvxVz57wYxMwlSYwhevOQKCigY9KB3xlFIy3oMZ%2BmGtB7TaoiKSt%2B346cviKZkTnz%2BHYfR5u2d8N36GA8VDoPZMk4HMdNNoG82UN7yfczsTyTJC9eCAqToahWqmq9AJFrGzZP1ICk2yFM95OEi5CH9qkg4uPxE34a9HIzpvYjCS16fOBjqkAbQXgzN3%2FVone6ZBd4jG256cMcU3NNEJNBqoBMN9KMagpz1IsqWoODctFFHY3Eh8CJyb72clOWtXPj6MSo2OYYTDwIb8qD1xE5oe%2FHf1tZwWG0D%2F70ZqRXAM2m7SsdqKocYszhneD1i5R4xo7k7%2F1GEL0B33FbKvJq2DG6rtzzq2GpvBmjTI2mNH4as2t7jVB6Q11euACB1UoW21aIxMIA%2BOFz5Y&X-Amz-Signature=e3d2ea4a90cc9958fd26665ab5f35a4fde1cd402c2c11d2a94c74aa0e12831af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665K4QAZVP%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033702Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQDMWhLxPxYEnwELF0Id0p3Ap4p23F2SRHm1LqxJTO3gdAIgBLd2bUzrAJmEfeb%2FpXa2%2BB92u7OsJat9fFMRxi9IdVgq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDA3S%2B5l6C0Guh%2Bkc%2FyrcA8X68Q6cgkBWTFzLfFoZnBiReWTLkiJlEX11JsxD043kl5WKh1h1Qilm9ASPChsA9kk8w8M48ChG5cGTVcHMc8KJF848kLTgyj9YbZiBga1Z0qiFv7Px2ZXeY5cppwGOFHGAtjK%2BhO6N1JwBGIZFqdoLYtJHALIaKaFtvoZOX6eC9uEUEQ49qsI3K4CaiMD%2BYTKg%2BsV8CwdnbXLaUVwd%2F4Whqg%2BkpgRTu6qOK%2Fz%2Bym4RMmlyEFXlFOakYH7%2B3TAYipni6HIaHycb0rv0Zus4nexOv0wQeAExr55h3qiEvv%2FKxhYYklP9WWIxgzL6XvxKT0S1Uvg7iKDcSO%2BQKNyjl1KAxoZ%2BNVlDhcrehrt%2FlNrAY0ikA%2Bl9EuJFpDH%2FZLtm%2BTLLsKpsMiyCrmJho7PMpYO%2FU7gyRRvpgSKenROwUiTsh7KHuPCxIQeZGwJUewbGHTOatgfuVkWvppquDJgzAE9ccm4y96fpYUKu2zxyCiHcKA8D%2BFXPU%2FMeBrMzE%2BzydSFsrr1eGnB9dw0uUEmrcXrypRexvFOcbglerZ778u50YrjKFRGPBfkVU1c6Z7GhXwO1B5hBBzE%2F7yp2QdHiqfbSE5G%2B2cRanIyluq8Qyama8xjgA7pjCjpqB9RWMLnJp84GOqUBbZ9j0GLYK0GlBsA7sTHNMkmEftGWJ4N6dIk7xUrDvKDnd3ZU1aC15%2BGhMBBC5i7U5lItzpKyYfkIJR4ew5CWKt%2FD64tdhKGoWOFQSGrN4SbnjBkPyN4Ml29p3ru%2BPh56Kzs2O64Ye3JdxDQUSiqxP1Jt7rX%2FdWjtCmCpiEUnqyeFE8C9YhpSCtoq9e2PFvLBOvhUYMriUIaWFJiQ5xqgEmgOefqR&X-Amz-Signature=41a3119383ce6aa53b9e7617668a05a8ef8949533a5f7cef14bcf303d16bfd3f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667DMT4JDX%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQD6c3ltE%2BJovJKBtkLSXGjo8Q3t3cktZk%2FO4rzPHOmakAIhAP4Nw%2F%2BWA6d1rEADETnWyBQyZkRGDmRbU%2BDDONJr7VfUKv8DCBwQABoMNjM3NDIzMTgzODA1Igx4Ip8fWeEmK4fO4s0q3AMUX9zS2V1xwp0PM9rzZ3eIzpoGHm%2FghfAfjtJZW1a75op13XiciAhEQaWSoWX19Iu27RTvKb3%2BisTLaZEU1KovQadCCZsdYgU%2FTVwqMAZqIno0sYUY3xXwmhEF8U6XZEN8HeYjfx1fcsIWWSYxkZM2NPmrEMvn%2FBmCYPGvm3G%2FetIVmchgNuIdMGYxod5Qx13ZNX5rzp2uSP56hLtjm%2BHOO3zKpfduvZoT7bT5T9Jt1dW1GvcL6TqxyA4ZG4r3MM8%2FqLXxjrBztd3S9iqfomAKcCHWPcU%2BxHFDMWR6m2%2FY%2FZZGZzgSIoD8OjuC7U8piRFcdtbq1n%2FhVvx%2B3vWW4Hk9OxGkHvcyaHWEF22UjLFO8I8Lll0PAqYzf%2FXIi8NEZfUSK5vcPL80L85YCWV8Q8z8g0JC1qQj6hfonCS9yaZMTeKdyZXOrI9Os7%2FY76y4qWiWFC%2BSvyRRC2%2BXs0rwIB1nxZm3W2Nom7KDqtvrVGohCv%2BHC8OY69vrVGdIJvvOyjdlCDOuTHm%2B5U66%2B0hoc68Jny56WQiJL%2F4%2FRFMkCINLIqCxRsOaMT0cop7k98h1hT1jqD1wS4gHI2%2FdHHL89o0c7Fp6kMBEHuacKgvM5Xc%2Bf%2Fwkk1wOi27PKsNWSDDwx6fOBjqkASfX7fGgHG0StD%2F0dBDPT5RehziR6dUwSiOE1DXQTX2yDEBszCOW3ygR2u9%2ByMtnPqhTiJiJbAQbZol9v%2B3ncv0RCE%2Fz%2BIEiGu5F4rRXNC6PvfPpvu7Iq8HfQ7%2BHqmI4gO8uUtQISgfajwoCeud6v97PnV%2FeUB%2BPILhjXv%2Bz0QoKmIiQcL1wzygyMo6CUT1JEydGLd420s1qNVXXXTQVCCgqosV0&X-Amz-Signature=e836fe7d229d9c080a8c33d8aadfee5a77eeac2bc93c4b402820982e868f12a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ZCEXM5M%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033710Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQD0Kv1DpRHF0Ey7K27wn3pERqax%2BcN1mNEY9XVqnkW0YgIhANbGTMSf9bNQ7UEyuaZh54TF3rXqfn4%2BSjt1PLMSIxG2Kv8DCBwQABoMNjM3NDIzMTgzODA1IgyUvi2p3vUCgKEXO%2FIq3AMyZlzr9zeBuHn9oSUpa9YZg4SHSkquE56EhYfOtRo9fkK8c2KAXG9uRE6Fq318oX8vzCExvwNbllCpuME%2F1jBZ0y0oRL6Gm3MGAQV4WJHfwtfzC2uHbeO1w5Wd89Oa7U%2FKOwnpI2bz4eLz5TUwFdKRDMDyTYvksWWIvxR%2BZXSLYIoqCaEvZ%2Bxn3n9H9qV97gDgrIyR9C2vgpLHYYMXYrfEwwojBn2o1BmqhiXQ2WMmMcSS%2Fbs32jjo14NaOMLHFPlEx9jEIzmbalPYoZRm9IUJPozz4sxuacwxVWAGRMwHXShyGlciRAJbjQfupQ7SD5sCSBmfZpapqFEWifjoCDcECXpF9lzOpbqaq0n0HdU%2BJqf2c%2B8trmXoBbaanvZrzDZjTshk7PMMlP6%2BK6TA7caRrDOiJ88yg5YoQHury7srgHz6rggInfPbhZccb%2FcPiTjru63NsEc0553htPNRjpwDhQVK%2F3CORi6P7GfjXEjF%2By9gMfAQHfa6gJGgXd67yT93DM8dGaBHC8kSvk1HU%2Ffm27IvSj6hVnLYQFwliTNIEJAcIz%2B%2Fs%2BKIuqbKBKD4jDCMCedPOGZ3GUlzG7whhkspoDiEZZ58VJOJwLeAocKw8VfULWzJ2lsSswTtYjC2yafOBjqkAQLQX1PXL0Kyz9dGynFNdR2vdUZThk1xG66pHeUAdM9OSD%2BvIOoX10hRvYQxY3qwS9KJpAd%2BzXQgUs9aGo2mn4ftlrpT28MUXXQajMb8H%2BMYjlJsnhgLKvP0QnmLKvjZHoRAVqBjP5jHOUj8NmUPejPUOcAOyp0yvhEOnSchr%2B3wcYKfOaVlTfy7J8uj8DBzq7UPHJl3z9HUC65UpNZeYDnb0z%2B%2F&X-Amz-Signature=640266eb3a4c8892e97aaed8abe5d077e59e089b2c09a23b72a794d0f854aba1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ZNEPJUH%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQDRr9P%2Bd7UGJXiHAM3xWy46%2BKRo80dWVjpzPgPsuISZqgIgdyZwVmH%2B1hdieEQ5Rio2pyGJLfr0pz0zHV8iajymAzMq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDPNLzWX68A3IkGy52CrcAyhmyRggIS1Ev8%2FThCsSOrRUGkldyGx%2BMntwiQeNZuJfNFeKWjjAhStsU2TV9aKfYXu%2BarmCILOKutVnrZ7VgD5OLTZBwtQ6l4tyFNeVhnKzEEoWPsLao%2BrpIMs35ezaBGXFCtW5ysXAYMR1t%2Fo0KhUtlGzJkYa4woGAO2N4NIyMhSLPc%2Fn%2BpLaxLaXdzWt%2Bbb6qJiAZD7yhkaQ4Ndh9OFkwfLK985fDAJ4sIrG1bgxQxU0xsVLCXJtac32o6k4lMlcHDfVkpRi89DEPHv9forBnYCxJUQ4KixmrFh8TnPa7WP5UuR%2FPe94PkDJWyXVk7BeQSApm1o%2BeowC19hYb2Mmg%2BYOdB2B3NKpTR6Waq9jPlD3TnNAIa5i%2BurWk%2FwNBwrISgrqYUnZB8vHO9j8D95a4g8vrWwAn6sSK3Iij0xixA5UAEeuHws%2FXZZ1lhSXJ%2Bpg2mFhOX6LgJP7at30pHhrVHYSCqZk6GgK5vBTy6BxK7BtE2Q0VS1vyYJ5rRrVNWe%2BodSG3316s1oNrHl0JXCU3%2FTdxdPXSxlmzFOrDSxcmcgO4SDE9LPCX9aIW7nj9e18QTa44fnsq3BpRqJleRovcdvJkF28nxeBuf6fIg5rUQc%2B2Sxw9Ghqq%2BFj4MM%2FJp84GOqUBWPTk6GNC6W17gZO5j8Kv3IYOd9nzYJXoieE5k51H6K68gkTB2Rghv%2BAk0YSoEK6Ck6aYcDajuEmycJlgi8GnhY3zQXvTTY1tZNPMWonIjlzhB%2BuaSt33yn8P9zmdrCOZLgIuVUCvUoLre3cBQC7JX6NiR38ay8918zCrWHLkRhSk1aLAe4gMbujlALjt1W11eHiLtTbx9DkRenMdcozxba46XovM&X-Amz-Signature=44e5223e7e90b9d0f5b81b56f46604c2855a8011afb0b714ed21c859f42326a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SXNX23GC%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQDoRE9AzmpzR7bUEtcFaaQTGJhJKOZ9C9Dp6d%2BDDvEgzwIhAMy%2BzLVkrX9w0ghM1BxIqBpWFNlOcYKIjdXmV584yOuYKv8DCBwQABoMNjM3NDIzMTgzODA1IgyiUQdQgvTH4Rmk%2FCsq3AMsuzgmHiBCwdfXLfoXyvBQQZC8vEKTaBG4%2FDpcCbm6G%2FHVjpQVY6VM1HQZQow5jFt7u%2Bpl7PiesNfg3Rmeq%2F%2FCXcbTdoHbSw0DhxBd4%2FGkEluxnMs58rNIUIvLEVqCi%2Bp8DCE%2BBmlQ2gIW9P%2FWpWhRKaayDDOSj2%2B%2BREd81UuLLLMMKzDAoopByM2iSlkr7DWDV%2FK6joAknajSAdYQEujWS6bYkc8DNRmHmTo2e5LkwJfa5wIQkK2iUUYbWg%2B4obuVr1tF1M70jTXKBmGFg8pLiDUIm%2B55VoaAPJCg9Wwt%2Faz5qKT1No%2Bru1Oy95WE9jAA74dJdiiK3iVCA5CdAIx5aYChZu59QFFy8ksQXmKYfYUPsiVoRLsu8UZ56eV76bVSQADnx5FipwmRKiOiet2IBXnvr5N%2F46SIZwUfRuIHEwVvmqgHW%2BBfDkvo43ATjUTlK91Cqjqwijs2%2FIcDC1Hpn2RWym5th4Tr3a1v%2B8JW8T3H2JHIr0Bo2Py5%2B2SU%2FTH4t7MCaXK1EfDRPiMzNji8gUzAKxILzLYCvbNdWqC9eyeaDHAqZ4YxyBcsnGyNuag%2B62ZM2O7vUJJis514XcqOi03mYH9XD5GcF1s6SvzVZR5roocjY%2B5dK68zuzDCx6fOBjqkAaddsuGYxtd9xamuKNVw687eWfBmdwX7VqQcWrov6duWR%2F5J%2F4qFHhPvrZe76GgWxviJBqCP7t5S0KlIhR7dNhEOKv44HdZdJzW6aCRw%2F2inF%2FDdQEJv0N6XowtAdv%2BIixX2eqjowvg%2BBkbXJwjMHFexWBJdOkiiMIHvBJhgKVWzIQlsQH6YZCa4Bt8MTsgjOJn%2Bo7iUPCk69hWEV6sxcxoArUWk&X-Amz-Signature=87c08778d06a3216b4dfb319a552bc8b0e9f9382f4d96aa908d7197a39c1cd8c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNPTTKDU%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCICS3m3pDrOfX0QnGc7K18DkzhR9GKJNTQHi2jgToHxh6AiBLIC6Xq0XDbEfJdCNIcRf5iieaqD6N%2FelMyVw2VRLrYSr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMUjck%2B35nXA%2FjsnPnKtwDvYWPn%2Bpn4dxez79RbqXG%2F4TwrREyAkZ0nDlcTE9QV5rwjOsa8UGz7M9D2UIuOMduSmR7dJOYqjFAlx0e9zhSS4lvWoV4HwIO111YfftDqMrhjxSLm5m7Rh0la2nTOthX%2FLW0OZdEnJcxrSeZDauw2P%2FNCCnM6Fcyy2BU5AZ6o3Bjhpmz0V5NwmU5L86NCmnJkLVWWIEgKCA5kDw9X3fUeYaDphQ644zz9yamnMYmGYedbcqGs2hh%2B5KkQrlSgKcxW4Abogz83TQupIE9VeD6nu1FhDTUOIjNXGBv%2Bw75wkc0iATaV5cG9hm%2B80R%2FEDok%2F%2Bf21EdlQUUcTJOVIOPKh8PTuYoQ%2BP2sgpip86NWlsha5gypLjLxLZTWT5neqnz74hucd3oW9SZvxFuaD16MIEh%2BZQ%2FTM4gju0s%2BJsyArgYfuCcq9tJVz4t3Urc6BRd62IR71lfMzlxSh9tKN6eWHmYWg5FHOtMeIUFMLQNYe2jqZxMEJuQyodpZkRDOhD0TaHn0LO3SEZz3LwahKjeN51XNEksEmEE8HiNWnM9HpfVkN1u6KNexfk8YpAxBs8L34fPZa5Crq0vm49Es%2BefLYSfpnFhy%2FiOjbjyJbotHWt0DLRzBzMy5jmh4FIcwwcenzgY6pgHlcLqnJ6BvQWdvghMnW2cNayVHtK4UQ0MiNR6rdXlhHvn1US8Wq9MWGmEtRCeE6d6vXCXGaz5hJRNELi7L4Z5UipVTsM%2Bev6MwNbFRrgIlm%2FFE9BZlcYVZZGU9tJXcsanZFeHZZpRoX8r%2BDJeKYd84VnCGHVb9BNAcHQcrrJGDx0gJIM0AAKRzDYoxyp%2BFKa73sIE3dCHTgqMh9LHwv8gsqHOxcOn6&X-Amz-Signature=f7fe6492f1c66b6842df5634a74ee91e7869e0be761317fbac27f2cb7fc50f34&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YH63DY34%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033713Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIAC1BuKyTNvRmh%2FzTlhvkzkkT8RLOqKzNlxKKD%2FUlxhyAiB5T2DzH65G6TgmKw86QNbnHKBr7PtQ8EFUB0u9jE9yDSr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMRcObZ8wG2CPn4oNiKtwD%2FjTQX0gveaEB2G17PeAT3JUrF8Ui5Ei%2B7pX9yxU8bBY8nHaVog0vgQJoHfsAfZN2g%2BU4SiUxTQhTUR4Mia9UlE0Bf1dpZQPYCFOhZ8t8%2BtPY8%2Bs5RjrDmC0rKQj8t0oMvC9Shxz0bgIxf%2FWOz242qFKEF6ynOdX03Xca5k0ItXAxRojHZgQ0kErWtcocRj6UFFEQiyhDYXX8K2ev6NfmsDKJO1%2B3i266dmho31L9LqtGsSEP1Z3V0qaVz6LTsVadgJ8knhQWQu7gswlv1c3HKOYTl3I%2Fde%2Fs9wSNmCDW10cvqmmXhCn0XzC86%2FbgFWbqFNUGXnrM%2F%2F3Wou14LeunUEnaCekWyypor6%2FI5twNJHaXEtMt3ZOoH6ll7Zml%2FB0%2F7Xya7WUN3CU1Yesjki7vbNs%2B%2Bjt2vCIbtK%2B8HrXDI7Hl%2B4BYeUXVK9Osdp8T2xlKWivZjEVM3DKfSvyTiFNQ7EFdnCZOFOrSxxz05wT0FKmL23y02kXPct3M0YejVrnTJ1swJd1ZmRLWDahuIwt8joV2cYOVjdIHtbLWfrsvbEZf3to0sL1LsrEoN9fwE8e%2B%2Bi15c5rSMcwJOn2e6thRE20PSfBJsoiecIDolPZ0Owto0baa2koloiSNoWYw28enzgY6pgHj0hWJMXO0C%2BOl4atwgdIgBXQuj7cYp3HDTtNCw%2FbMF8ZK8VI%2Fhn7o4NfT%2Bx%2B07ykff1hgz0mOQ1j4ci%2FMpTP%2BIh7uRwxlpAbCEob4MBiy40x4yuDh4H2id7agluZDuo5GU9ESrrAp%2Fszq3QrB4tXBjd7v7lObax0vUjg2zhqpwpHwPKE%2BzSCigdwdzuI3K5fNneJ7CIScGS8Rtow4t8SDU%2BYkD8kg&X-Amz-Signature=64cc81fd2a18b97259f0ceae429ae947a5bb4dd34751f6d29f2b1fecd2d2ff92&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZFCEOJA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033714Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQDixNc6yFSXLEjXv8A6ztF34ehWlhus%2F7FLJA4IrY%2BDQQIgThnFkrL50frpS8ta5mtyVUCnvsDnAQ%2FqWf7hRCrfjosq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDIhgqKbxrtkPZ4WbKSrcA0szI3DkZeoMnSM2YR7LRmObu6NsSv87V2qr%2FRQSzT8uVbR3eyS9q%2B83dDft25VujNbmVGKS2GFUsDAsG9fN2M%2BwpESsZ991%2Futnr6eskUiyzECvpDfV33NrVUu7HgZX4z4nkuYVuUUanR8DXodnKepGp08O6RCRdZ2MFalGA%2BLpbprGfUe6eJlcgvzB8oA1kcgmOADn3Wr0AiHlIVJBVRrctJf7JZZFUKSTyKbIZnGH2kzmxEfgDZgFwTlBB%2BbK0KLRcoogqwJ7Vwl9ajrZfe0PGmzGDbYzAAtKKW0iuOFf%2FRfE2S9YTspEad7gV7OKX4nSJ%2B%2FVrYzr8Zpx6eugEKkipwIATWpDI41O1t3pgKfOzN%2Fgla69uoiTioVLKj7%2Bc7l%2BcMQygVkmYKrTap6wdtwjg4PtllDgdPHrfzvX9Ok72M5TPyB%2FYzkIuXSIwdHXcSXKTFbtqY4k4D5pQ7Yx4HYyI7MgigFbxL2oX%2FXSL6a790MNv0iuqsk3O8UX%2F11Dio4eNofAtf%2F3oR3FJRdGEJPffRtOp0MHUNyEwUT2OX83HQYbWAqnYQgxuQ8HnhCNlC5WQljmTAcZwRV8oARXvmQCXfxaEiYTSVqicfuEjlGo%2F96cOo4xmOoqVuWlMITIp84GOqUBe63STcV2zupB%2B9c%2B8hDXBgwth0VPrngg8coP0y%2BMEa389SfdbyMK8Svh0I1r%2Fs81L8ABMvnhrWx%2FxSEBthmsgZpHb0GNZMYdmG1%2BEOMDDDjXqN1xCaXSVcY9UA2PUrDs3FrC7vRfZQhuil1nVFI8Wdb3m1CA0y3i6YYPBqToZpUD%2FJiKlMMUb1x9cxHV8z5RchAMimkfhXuRBTvgyIIF6Y32roKt&X-Amz-Signature=f099eee007b2624d0f21ba48791001afbba8fa10c48d142fe9f0189f7b986cc5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46652ZMELTW%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033715Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIFlPHOIGC4w9x6cf%2B2Z%2BKj3DOjqUdpr6iXOtMK0KOYVfAiEAkDhReES48AeXuPSFbfahMVQRWES8GXVoSSP9aJbJGIoq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDBc8srYMoHUcLCLJzCrcAw5XrlkjDS4%2B4T2xh0FAVIR%2FfSbhSMPosNrTetWRuuir%2B4DbPaOQzOZpgRu72zmVpRAsbs22GtSehCaa9H46BU3Uw55xzL2i00Z1jyO9R3IbQyywpX%2BeD1%2BdiWUqgGtZha9scl%2FnGCXcTAWf%2BbjZfDpRN8OYWrygecc4aRABYtp2je4T4058HQ1B3sMdSovp6F7HTQ9hBdoI5cD9san2xwqThiyJ5HCz4Ml1cKhzgD9X%2BfrAyMyekzPc7x49YMvqMqZih23rPkafWn%2FJM3UhwkNOpnwFIefWbeezQP7%2BaOYFAZhWI%2FLxcq18c3qJXIVqo1B63a4O%2F%2BwWcjLxlBILkLxztkoPVFwv4GfnuhlaSVEGo8CcFoYhGARPC%2FLz4OCUYrlj1VnZYYvncdWAuvzmHjSLi%2BaRYw6vhftPhRw0cFf7j2UWiIGP2YWI0eQZ1q9CTGXfCpIGcUiPEbE68gpH3pR8En4LvUIwwMltSbpEpaUcEo9e69aFmDR40iSVdhrB%2BPWDRoMa9gto%2BiAl0cGW6IUjcd%2B20EaHCDW9zH2UNGb6SKuDkAZt6j1yCmmHZb9elfwbJ3fKOAnbec0MzIHr5jiQV4u6EpZteObmF4G5%2BSodhot38wRZeN9159buMO%2FIp84GOqUBFcR1OgypsDBpoDjP9aFGfmTjKEPv8tpCKD%2FdpclcWnH%2B24Bxxq4FkIVddbKMufGTFHvgmtrbEe7uwWekgr8yRKFLNneOhcfP%2F8vY8giyw9lHgJ1FkhKHAuivIcjQQJ1EO07NkgrDZwr6VH2pP2is3S4rmJcK9RWtmhbu7OVxY1v6qnI1VmnRoXLWejQPzbX3rSK3%2B%2BdZHvAscEH4o4VU6pVYhJeo&X-Amz-Signature=f51d9ab5e8467c7f33c44af026be0289fbbf27bbf82fd2c1199b9dc84bd403f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664S6GMYA5%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQDX9Xcjkt4p%2FEIsRr1f1EiYMLXwoNwMuQfkRbgNkJnW%2FQIhAI1oQD0LENbcLD%2BJbr9FkU9oDu%2B9%2F2Mp%2Bk0t%2BYAdHP8AKv8DCBwQABoMNjM3NDIzMTgzODA1IgzsCkLNJGnTdU4IXvcq3ANZulGDzM1FTg6nPnv%2Bh9IUVthstwymTsZxVcDHqZFY6%2FzNdKFWnnfEluheaeIl1WuIUXviZnXBVEadbs%2BeKQjc4l1xlxyHMZP9dp88MZQtadZ0lpaMS6EFp1WAKm9Rm8lydx4YLDkjK0CNRa57XT1i8U0qSRXk%2F2G%2B1iS7DDwAKaRLki74UUdHFIWygq0d1Ga3XU0WzlgEBKtseUcxZbL8peRbibWjh%2BxmGWNb%2Bb9LY1tsGnCm6r8aPhvxKo0pgKn6O9Fg3qwdFlbEriu7LpBM0KKOb4%2BoP97SbIIcAe0XBGMIfn8Mg7lVjDS8GnZ8%2FZcfhkqd9Jru7QRoHfxUkbEVgHzQWsw5wQtC3zY47N%2BpURKEPaOUy%2Finctt7Omk5aspNDUCTbwfhdK2r6BcQs91PcyonhMvfFEKMadqIGiJrH0Y49m3pG67SaWg0wt5owPuZNfI2kxIqpL3fFMxss9tp8QqUCVGYB9oOJYZuOh97oray9kMm28w3efbWGdiRW8gkarHdh335tZ%2FofrqHT1Ik1xs8yRwRqMaQoQnMSrlosQ0rGtCY%2FkzyK85F8Bj7v2dvF%2FHfMarzYEs6cGJrdl8Gt1fi7mSacBP8qEHzCy23RbWkUpKAAPK5fYdT7jCGyKfOBjqkAQF0coIvGNx9m0WOSx7OyEcZ6h%2FujlBEEfLVmgRgSwlmLj0ziaFNynG2k3M5pibiS8z0%2FeDNJO4ayvnxKMFQ%2F0nS%2FAKH1bdr89mpuDoPieXT75w4FyX5l3mXp8zqR8ut89Pcm4hmyDblhlcNOsm1M%2BQZarM%2BsFuKjOcUKiI9gg2%2Bbj8ePvyPZrc4cQF42mzfGXMhh%2BeOApkourtBpQ9alXUNS9ze&X-Amz-Signature=6ffc09dca949b927dc18c515a40ce157a92a7247c9cfa454b6a622a1516e881f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664S6GMYA5%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T033717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQDX9Xcjkt4p%2FEIsRr1f1EiYMLXwoNwMuQfkRbgNkJnW%2FQIhAI1oQD0LENbcLD%2BJbr9FkU9oDu%2B9%2F2Mp%2Bk0t%2BYAdHP8AKv8DCBwQABoMNjM3NDIzMTgzODA1IgzsCkLNJGnTdU4IXvcq3ANZulGDzM1FTg6nPnv%2Bh9IUVthstwymTsZxVcDHqZFY6%2FzNdKFWnnfEluheaeIl1WuIUXviZnXBVEadbs%2BeKQjc4l1xlxyHMZP9dp88MZQtadZ0lpaMS6EFp1WAKm9Rm8lydx4YLDkjK0CNRa57XT1i8U0qSRXk%2F2G%2B1iS7DDwAKaRLki74UUdHFIWygq0d1Ga3XU0WzlgEBKtseUcxZbL8peRbibWjh%2BxmGWNb%2Bb9LY1tsGnCm6r8aPhvxKo0pgKn6O9Fg3qwdFlbEriu7LpBM0KKOb4%2BoP97SbIIcAe0XBGMIfn8Mg7lVjDS8GnZ8%2FZcfhkqd9Jru7QRoHfxUkbEVgHzQWsw5wQtC3zY47N%2BpURKEPaOUy%2Finctt7Omk5aspNDUCTbwfhdK2r6BcQs91PcyonhMvfFEKMadqIGiJrH0Y49m3pG67SaWg0wt5owPuZNfI2kxIqpL3fFMxss9tp8QqUCVGYB9oOJYZuOh97oray9kMm28w3efbWGdiRW8gkarHdh335tZ%2FofrqHT1Ik1xs8yRwRqMaQoQnMSrlosQ0rGtCY%2FkzyK85F8Bj7v2dvF%2FHfMarzYEs6cGJrdl8Gt1fi7mSacBP8qEHzCy23RbWkUpKAAPK5fYdT7jCGyKfOBjqkAQF0coIvGNx9m0WOSx7OyEcZ6h%2FujlBEEfLVmgRgSwlmLj0ziaFNynG2k3M5pibiS8z0%2FeDNJO4ayvnxKMFQ%2F0nS%2FAKH1bdr89mpuDoPieXT75w4FyX5l3mXp8zqR8ut89Pcm4hmyDblhlcNOsm1M%2BQZarM%2BsFuKjOcUKiI9gg2%2Bbj8ePvyPZrc4cQF42mzfGXMhh%2BeOApkourtBpQ9alXUNS9ze&X-Amz-Signature=faccbd09bda3f3ab0f0ea66d00b1715579d70c264efd16de4855acdf12c68e1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
