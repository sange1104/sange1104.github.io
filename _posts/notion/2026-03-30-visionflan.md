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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MVKTQPJ%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDFjKeadcuYXkRkzBRxechsjaSeDTqotGFPAUSXagBtcgIgaknNMRNSg4xMRG3lz7RwkQiah2nx%2BdgEq05QlTXhm68q%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDLfUtG4Ck8rAcSAvLSrcAybmhrUPUzld6wW7WnKhteHiLh3Vw6%2BaqxkPno73dGACtvqyxuXolWrt0Aj%2BMLklbY5UhKrWDrkdVwdBDYZwcghQBaMwTmbRYsQitBXTdXzG7p102gtbIx3leB1Krhhajxp7aT8w6iZJX7hypkXGY9LRE0WI1Shi2boVlovBhdnB62q%2ByDBfSVPwmw%2Fbf1Bzw2Fa%2BYIOymol75kDj5xmwRdVKsnWvQLMWabIv0cKO3inxK9zpEhcFCVS6MTdNU6dIqH8cdDIFl4OHL6A1IJb59r%2BZlBRI5Hi9%2BkNF0SA1qP5Rr1sAwzljv2rWmnq9AGi7xmD2KtnNs9BGjW%2BzsMfGcgm%2B%2F%2F4QA7otJ2gDHo9QKpPOTRkJkX%2FFYFyb7b0U5huB2cSx2IUcgihfav434vu7D2MHhlEpDaUGYnC65o8BZP82wbEqeezhKO74%2FiLaYqXVOoLQ8AB2FgPzBCHbSbrSkb4QI9Z0St1NO3%2BJsJoubVX8bq27Bd6F3xJq9TEr8Z9CqcJ0FZkFBwMTnQyUGWojIjYL8WF5tpXmKuLdtU4kswUxl8q8KF2K%2Bf%2FOnp2jBnSMHtYZAo1MGq8ptKbZtUkUCEDL%2FoCeOvjiHFSgZ8G3XsnvXsiX9eEKS%2Bbz5ArMMqUmtAGOqUBEwquV5xe5TAlG6CRSAzB9MrVCbHxCR25XweLOGXq7JHuvdrkN%2BPeFt3RkwNDkYA1qXdH8lpiUeDn09aNGAUEauUz5D%2BmK647GilPieffM%2BLOXFpbt7oS09kA0W2wuDmKTX2By%2B7mkAZwCSuNtMWTeBEs3t5vurgAa6A9wVeSBfg7ajIkyEA3mWpyDeznlqh2SeUkQ9zJnGOPFP3KVKVQuI5zehoC&X-Amz-Signature=c346adb268fa9c937401b0356fac6e043c395cec27c6ff8c9f98ce9c54cb1148&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QBOKARR6%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHcxgQ9myiDRi6GSwQBHDUA0hN17T7dH%2F4JFcxWmYc%2BCAiB8EBs%2B%2FbEpfiGtkFHAkAfq6dLd4U15KeuYl6CwRZDoEyr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMwDqb7fepqBq1Jdd4KtwDFh3smDzEvALzH4DWoNr5GPVuQ8Rs%2FALTUzRtKOdLco44QKrvsw2iBpJNkQB3HYTWbquuZTUR%2BuQHQ2h1QA6ENznvU0QWyFX5bP7qYcu%2BgJWGzY3%2BwpOzhuWSPTPFaI85cIwhQJp0HC1p83xisMpTwLA5OFt9dWXLVeJntdd%2FMDJAScZSHQ6YKDc9YFi%2BOCh6bQJBKfPTNC7uBTxmKNWIXrcqihCVgLhGAc5QALgtKat2QBtvc7kTe8XXWEMWTrJvwaAscr73P4zv030awtMEh4yWgpDOHY089b1FDm3MWMX49XVaTZ6nv2gDKLGnlfIhHekD1%2BrL6K%2Fd1ttr2D%2FQehMKQlzPY%2BkK3YlXZKO59bM4re6K%2FHJJHMau%2FharpywqhqOWOH2BsngeJ5dZxgbeIk08xyptpMOHj1dgk3p0X%2FTUCsuC29XsGHZP9EWdDbpMsIx%2BsWsZd%2BNSXkeOvmzddx5BrvIWFsosVyRmCwaE8por5XAqlDK6q87quNIcPcqXuILW7CqRyOrziaDBXpLC5G9IxL0DfQgkAKLdRrSd7D1HYFvy5rB8lePTpVutH5Eo1lMvE8HkHB4lwEQ36jnUN5XO5sNFfXocxZ%2BR82rmhCE41Q1Hi0MS5JA3OiUwzZWa0AY6pgF1l2eUVW6NkyRM3dkI8kls1dQ1cM4Vgfun1nMZ7opVTjPOOnjardLnqnGOZjWA2JvFWkQo8BwaZ7JQBfleXduB5im%2FZww9xzEgYuuGyd8RiJph9NaNzx7MSIIDaYYPwnGusUjRXwIyfIvCg4hqmU374%2BGu23qwBkYvaPBJMnsXQ3TyxqgC5YitwUc2T5q0wJOuxkwwClJCtif4UvDKg8Au8pqy0s6E&X-Amz-Signature=65b495cf016e0d200b19e7178ba1f8f1c7884f3d692b194ac1f0218165501997&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W5QGVIRJ%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041654Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDubZA1qxmh2NclA8cQ%2BFrTOr5MsBvwxEeFmxgD6g0VdQIhAJiKpD3GLRfCSGkmKbGDZwuXOc%2FJHCnYwBvhJ5rVRbKXKv8DCGwQABoMNjM3NDIzMTgzODA1Igzkh1UnzgLTTo0W4wgq3AOEi9NadlyIhmWFLLYt5%2BL61NQzpO4bQbDQuMwzw987Y6XiK5U5rVhqSEPNaT9AzUbUCn7XDQiNGnLH46jKzT6jsl3Or8BCqih53y2PJllgR0%2F8%2BndClAvYKkz9Sz9w%2BsaTX9pgG8vsYVVKhMTaRTgED4LclXP2j7cseE%2F%2B%2BwtFilThjHY2ljCHIzawqxyoAom%2Bgvkl2QDbZ3zabOfdp6wFCR%2BpQYg274c6phVhDS99wU%2BY07r7PZK4LhDwGlgNgoa7Br5Il%2BA44Ib%2F5%2BIUF4Gz1vWfPnaIMkPcARnfaHWcPQ%2BDPBBVokGDzhnmQ4uu6xohygqgo%2FiISv6z1VaHob3gd1D%2FlRmDEAYK976iCnfaXGSnrIC9QWK2DGuttd9tL32e0xBo4OdcKuycXUU9CkGCvGllPXdHWcD3WndR8QQXLP2wZEhPT3qlU6MYvNrp2qhRRWwZwczBz3H%2BUTKL38ZCLCLniBNeNB%2B7RK9T5bi0asScOkirDuQPwlMvOuttzu08wcKgF%2FIGVaOyRWK3LmhpyCILbLa2j8rdktcM%2FHY8DQ%2BiFBA7adQotB%2BthtG22c97yq3AxdzllWJZTT03VO6kzj57wQw8jK965lm9a3w%2FLc23d8sAkvNP2MxOATCAlprQBjqkAWnuztSAT36s3KgZEQKfojfYQZhHuOv0BRb44cRtpAvWRV38nMG1zEA%2FRHJMV9STwP6%2BDnctg3Mjk23cBXQV92c3EjmaHlKO8XHPCqPiSr%2FVAmkkL4MBgPallqEOmoLQoCBhMPSIi8tH%2B12bjN2CJs2JJQG3jIR1csXGMtlJnPpTeM%2FDUPxRaedJEPCe1Nga1RhuRaWSicYRZXba0t11FVTIanvg&X-Amz-Signature=9c128afb123650ac8b045b400b1481975130da90ebe24e416ad340271f21dc02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663J2Y6BAD%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCrTjkNqQPE7Qg%2BbU0v2PQA3p0MIMjQCgqPUXOeAFKB5gIgLePdWEuSJUlhKurwruI3pkJfao5QHn5HuSLni7Blcdgq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDG5BCEKMei7zphtNYircA%2Bnk6Ht5MQ18fbn58sHAOF%2BbXIx7Bdt3Qv%2BYaxxvVYZFnD%2FpXgwmvcokNWX3x7IGDPxWibU%2Fjn1suqvg8wdyXgmJBEayuSMaIE31cqECGzsYCSYfodjkNb8htg%2FPlf2nClnd1by2TQwLIufxjlrtOySvhz0H2sFWVYqIUzKVo03JxTyAtFY4vZc8TSfz5ngGhw1R9gvqXQAEofFyEC3vWoIgNYHDdP7c%2FdOO6LaOE4aH7efQXV7z4k15dKafsI%2BC6kLopp8vZXNOIUDxXlvRdEKtFLL6tJd3RIXs01uflUZi17WXcPxs%2FNLXIaaganwHGZu0DRFeCKPZn1zj9r4TbPIfMhU%2B8N%2B8jOWaIaxhgIozLNVt8S5lWcwmGNlaT%2BiZ1ONyY%2Bm%2B6EVrulUY8zfOndNBPa2WLmwGZv0Zi8oMTRbmXpxUHWpLbEw9nmIGemDms54sLD%2BvKpNN064hNXh%2F7%2BM0evMZPA0I3VEIItt6UrvRDYwDONZIIYcj4eQycjeLhw%2FaUV9CoFI%2BZ2kgSJdkhkGZFJxBYdoVdI7het8HOw4%2F9OIEkX6bIECRLkMFRqTrRqwIxUjOYPaoKUGMtfvMSCR1x69l43Cribx8f7aqk0ELhGVxMLelLxshssX9MNSWmtAGOqUBUvbfgzsHrr4wAw%2Fkb3mRopycJ0b3x%2FiLokyEqDH9VkaCx8zS38Lxf87xfntWe8W0EBd4juCuCi1yfSxGC9GQuw%2B36th25ZR9Rt4cA7RvMyWt4WLpDQ2WxIvTm09Ync1ixDt2J544ULZ3aVz0lCmQGwXpFD9Wq65%2Fotw55RggSmW%2F7AmgLLJ3Yt9HzX8MRgq50rpfk66JLOZm%2Fi1z7MI7xLmCoOv9&X-Amz-Signature=11eb031249dfa8ad5dcebbf608f09af997fa656894644f1b34a8a1e8b982762b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YHG73S3T%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH7GM4h7Kge%2BUhMBX37pGAjUXkemVz%2BM%2FE1JsItAb%2F0nAiBpRFoGnzfObRjoC5OT2%2FCEFkBu2ScQ720f08hKKeQp5yr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMsGOWHdLfH342iLBAKtwDw8ZajE6Bg%2Bvz7tmjY9SwruXTMrAkOKZ2aK9fZG8wKx2zLyEUTvuJOc7BQwGX1VvrvGYw7aDqk0JyMVNZLGJV45QwNYFeGbTMtq%2BVia2ugUYeW%2FWW%2FgfZvFXOWozqXQQnYfFhRlldc113vb1kaH%2FlAYfm%2BpJ9H%2FCNcql%2BeF2RBZ%2BfpJCD8Ygka2bUWcYSXPLgPi8V%2Fb6CtSNDGWii%2FFNQ6KsaGY%2BqxBMSohdv9sQLM%2Bt5vKE6i7dbq%2BntKZDxutYoBoDEIZMdtIV4vHPppo1zNxq50vca0v%2F%2FnsLm27Et2DpvZegq4TUvlst86eDWfn5ljFoH9YCbKlRRqkM5LkfIuf3xXp2hIAw4%2B9npSGineQA5ZF41HFmlHYnAipwVJmU0SIXfx3SsrVrJlge9XLunlIVkfm4XKhVqhR5F8XNnP9QEd67wXxSmUbmi2Uz9%2BH9yxxr4wUv6Ak2a%2FtiMQGWynj9hwKn%2FAbORgfNx%2FJWpg7Sq9zbq78dS5SwUGOMQqJkmlUYRkUQw6JiAPFBa5g0%2F%2B8Jn8Zl35XgMY1hp676nVKcHGC8P7Y397t6CpZXS%2ByVrinEHB8feNar%2BP8Sk%2Bc7YdkWJtOPdnOlIUyhr9qsE9FP6K6%2FGes8cERqvgjww7ZSa0AY6pgFO%2Faat6sOh%2BCqn20%2BbBMSG%2B7HHyt0tN5P%2B4DHpNCH15ijrj6qf2xXLr6C62SZlc0mhPMdOgZ5eTZGdSrTbu%2Bt9wVL%2BYoeLrsic2fL4R6YpkVMgGnqjnO9Ubp4AoxygQ%2Bdb6nPg9umNL1XbVKN9cpXoYqzryd7umbH2SruHGNBSeEDvXpPvrsv%2Fih802oiP8elmD470MpCLVWb61uThtXyzauV5d6QS&X-Amz-Signature=8526283bd51b1eb7cf1a746a7f054493c6d9aa06bd04384501ece1676807f8c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46622RCXVVJ%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCa6D4hR6vSRV9ZIHRaurKzYwYuyU1UoCxKMxpErJ5DawIhALHSORYpTUrgExh0rM4JS%2FYKzZ4mpGoEIy6LPLhEx4wWKv8DCG0QABoMNjM3NDIzMTgzODA1IgxXuNECtM8hDJ186aQq3APVCm9oakKQam6r%2FtCnKds0JtjK%2FFkuoeBW5%2FrkLB19bOy3fysTa%2Bkk%2BXTwNfAC8VhgIY2AwShdRjFtduq%2FV3JN6loG8dK5S5l%2FunvSLrboJkO6%2FEpJZtdX2e%2FcDaFJxyBTDmQHMi33nZJWQpfa9kREaFvk3iAS%2BwWy%2B%2FLHx7nFMZczmR2o%2FQ8P8lHmJl8TMnpwLXHB%2BuA45AlkLmkGiF8VebM7aqnaLuay9dywarq8rhmdVc2i9C%2Fcdoq%2Bdz3BO5XYVVv24SU24AZJNk1bZ4jybgaVzi1Iyrb8Q%2F7SEqHIeMOsQJSY27%2BI1LKcdNiHj4kWWW00sYbLQlIonqROceK8YiXLwNltDDLf3%2BVq4hHZEHMTrLC5QaVaUPOtPXpE5CbHSv%2F2x5KTK4XAGxzHFIEDtn8W1e%2B%2F34kevWUS8RTwFC4crFTK6CMUw2fuazXuXOyZV66gnv2tdmx%2BsapPfMxn3iAfkvoII9xRSWnRyLBlBcpRRwKxrKr4mt2mh7IUFry0fxNKdxZ86LEXtpNttZ8C7WbfyEBdeWw%2F6O1ErHloIYUH61re5LUYObhoQAuh1tFU4XpO3PLIxltUHRyStGQxMBb841nvOowuRFTmtr8Dc9r7Fy44Y1SSZZfe1zC2pJrQBjqkASoxEEusBMYG6vX%2B0DSrnzgG7AAuFCQKLiK0vsNs%2Fi4pNFnwJyUQMvxL1qHWovlzXfEqciFZst0GHreONtLoc6BqK3LhC6StQHNVLvgqae3d3KLkkbzfMpZ0CDsA7MPKD2X%2Fk%2FJijYUTjt%2BLx3O3qqwbpGCH2EyeH1nClmmgVbaP33Camlo7JgdI3eU1z9DDVTDjm4X8fD%2BmF1MCeaeJ9rpdrYjP&X-Amz-Signature=bd1e75e61c620102a095f5a7f743fb021e5fef153f2a6aa8928c3efb70f950e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666OQ7KBKI%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDWlZ2WjSbczBx6yUtjaxIIFiTBIBfqArXqmLf8qi1vtgIgUjU7mHI2jXVDHls3qUwMQbseVKInJfQNu5wGfWYsLlAq%2FwMIbRAAGgw2Mzc0MjMxODM4MDUiDMBnV6u5ovaIv%2Bo5fCrcAyJFTLM%2BNgf2HhrcZvmX5oY80FzBlcdculGZx1%2BCS7VTTbkOGq6Mqhh6u4Gb5a2RN82Pl4y%2Facgmt9L5brv2lf4IfqVajIjgGE5nKNjRVUgiNz8mZOGzLi4KXjcp4D2SrGLIGH7oRFyABqR%2Fs0YlgJu3hUbN0LWslNmWGmAC1rhfMOBOWolIBQkrCDdjiUERuP1NIYlmuPqFMQjbdzJQGVjgRKxZSiV59RAC0FLETYLMwZF3tuH%2BCW%2FtVQMJO8Z%2BkFCstGgzEnLGpCc4ABLv6hYL92bmlNJpAAHeaIH9%2FLY8%2BODum86zwgjh2IDNv7mSApFirGrkMGT%2B%2F7hZlGX%2BT3hIBXFyBVA8d3fMbUMJPh%2Bpeobf787lvsZu4ilggzSr08%2BVYPVE4s9IHrDbENpUjnqNxl3cue0HWzEH%2BGDGNuOn%2BUgy4RHj5Rilr68cgY4%2Bc%2B4XYrTCxc%2BTcm3mvbSwSimyUJoKg3cg7Xko13nXwab56YtVZ7Ris21sAE8exD8BYka9%2FCE0sfY5z%2F5YQTorWGT1IhMCYElCIZ8I3Rw1Pfg4lq96jy9RSFu4qwxUXIU3x8bPl1KNHBR2IkOgXessgvo2AK%2BqdbMTJIQ8YripZhDXJyWOTLSS%2BrQ0HWrVMJitmtAGOqUBbOo8gDCarERTz0xcJjkV7q7I1lhTtxAF2PwJtmiS93LGU%2B8DJKo0bL2gheQKMfoA4XdLmefMeYggIfZRo4CU8vnaDQL0K%2FnE6WrOfia2A5M%2B21e4VY%2BpEaTW0T8QSZHKq%2FsP2xImc33IyYpDvVJrCX7cQRs%2FSGCajOVKsZl9LLyQ4eBGRQ4EoOnth5ezaQlmUbpjxG7%2Fizj3iHxGKQ2QitAQ6lFj&X-Amz-Signature=796053ee5496c7d31fdf3a1a3d25cb31c6be5b5d21f6ef7f50bb7f8d59a67bc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667CDMXUB2%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBQjTsU%2FOS%2Ff3vihNLsA%2BcVUp%2Fdrs64Au3ZbTFBK1t%2BzAiEAvvZxYKJEu45YN0%2FX52kmeO8fBt3H4rBEjB%2BJFrc2UJoq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDLDQgUChNngLRxhHpSrcA280fWVcjsnmgzkl4jj2%2BP3FluMVcxAoBCb6G9IJY%2B93qpXPALnDoApN5kt4eHTQf7mlaDg3zMSw00pwhRU3fq%2BdhR3hYjjTG2hMglvHxEWxYOL47IZczCclCjWWhKLxps18ZH2mh9GuCXFQFVPhR1HkK5aFqX3QBOY%2BTHRpjUXD2S8Xu2SJOhAOy86hUS55YlyjhGWTMkIx%2FpCMaACzwNMxzYrwo7MSKwiOK8%2Bz%2Blq4ZShbD0x6bhC2NT8Pt2MCALB%2BXPZLHHePMGB%2FES5K0yHu8Q54NvDxPOmPWjPJitqWdRldPta9nw6SBkDqGjZjTLNggSO4aYBOoo%2BuURh1PYjD9Wtku9VEoL5jKNlbzKYPbxvb31IlQHu5f47I0w%2B5abIuilbmPwsOTX1BegTRPbYtGYGiwhncRlqV1EXSvlN5AXfFSUcAOm0I7W9xO5qw4iii6QuvGZVXD772XvWg2qH8DazR4VMDJDJcrl8uYh%2F9OqtXATPOhZYVRVqxH5Hcx33p1jrbp73asMRx76X%2B3eUfogcFrpOc%2FgTksxmt0f92YYOKQs4D31%2B8c1ERlnKy5RxzEO%2FJUV6GAce06YPFF5Vk73jFBD8v8pos7kJNfW8ipfwsFluKQpWn%2FeEqMISUmtAGOqUBP%2F4ODISqnKHIny1IOcHhlZ%2BOGOeO6KqU3OVuo0WZbONDibUwfsRiQwB0Hm3k7Y310fvLwS%2Bv2xoF7sh2b09ZWkalpW%2B6HtHutn4uwPTvBZ03uBJdjMTOkRFnIK%2BwsR%2B8qtmgM8mETxAVyzSb1p6Y%2F64Oz8VjJ%2BwirOXmiMVuKX%2BOmmc1WcZMpyeMC58eNkJ9pFjPVxH%2FVw8oKBnfKGoSh1mU4a3f&X-Amz-Signature=e411c6f96b2e58750f851610060ff632747f3daab4ca22f686f3e9e57daf7667&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665X4HEGHL%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCg5JwHZ5nuM47gEYu1u14WskZpzk2B7pQUfhXgLvQ1DQIhAIvvlKPcifLken2AQgI6yDZsPepYrn%2FEGlbQ%2BibNZ6KCKv8DCGwQABoMNjM3NDIzMTgzODA1IgwIHV%2FhklJaxGwYcpoq3AP9jWIH7cxnW49NQP0mIIC6%2FWOGurW8bVB9Qb8R6hNpvO%2BTyC0gHwTBJy%2Bm%2FHzbqvRR%2Bfm3fipdHwTpbk6Beq8KwPtfal7Aj397Zsbb8QQaPD9MGw4NYOH0vyIYFwjR52KB6MpxDfZ9RN8Rj4lfUswJacpCpti5mNFzwgIn%2FEYLKw5xHFZc4vAzpyMwkaHR71WZBJZnLzAIDFG1rtmkrncQ4MGZSLWs4wHzos3tOKBQUtFnzNw1WVWEK6GOjOosNEoJ9t9E39%2FiHHnMxnSjsUx6tJB8QvdXPw%2FpStaIyNTiw50io3Rchghrh9l3jXFoVaf10VfsQyFnPrkspg8lSpk9EhlLTonxmRSxr1LOGj%2FFqV2V2%2FjYYyIcVqSv1jshLCv62P8%2FN3k3XJ%2BfO37RTSgWFEcqtOGaUf99hHWpE%2FbekLp8OXkw%2BP9BuwyBLH0iaU5av7M9SoNcZvTWonHg%2BGVZxQ6ylCWFbtaBMnt1fZ6eLqwgDQ9hNiKu92u5tzCr0MqNYYpgIjd%2FA3I7t7MCW3o%2BHf%2BzZ9hQl%2FtAhNm8xZ%2F2FaTz4k4JVn8Geex6Fx%2BuhOAhx6%2B008qbyQMF%2B3JjNIIm0Dehnw8QQo07wLbzAos59yRcln%2FsP%2BDHZ6UjNDDKlZrQBjqkAWGbWNZGvsPFhOETyjUVesREQs7wm20px7OT9wpZkoc7z9VRXH04CFvRjm1Z3bXQ%2BYHHLTGNefqtir6XhiwP7N622oFk5yauTZ4sLhOwRB00qwfI6grED419rZ%2B%2BmYFzyWHOhEbRcpkNzqRpDhDfzQI5lEHPlbYuQAKCzVR7Wo47hW1rb7V%2FHoT8m8mgavbiJboZnYWbYDIEKGo55C5pbfbwyfHs&X-Amz-Signature=248432153f17140752324b714ab663a8b40b9a4a193db65ac7c4ce0d1a0743c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662RXW2UAP%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA0KjaWaz1VI530U5tEMT87hf9psLSr8Mc8iXmdH6FjqAiEAtySUBfIVlB2FujTntYFHKHygJqO%2BoA1hO8iQW%2Fy5tBAq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDEMk%2F2y6HOBPf%2FcyXyrcA32khCRRXDfl1DOem9%2B%2FkqaQAWzBDf4wN0WUr9940wi8QZNqMFKE4JddXaagHvO%2BqtBhfh3YbENVXrizQYf820Q6lhY2HiLjRN27K6McducDhiSML%2F9EMeR9DSraqHzgKGqNK6rYmcLLFJu2%2BYY%2ByI3N5WiZpUahNLlIYvTJX5u%2F%2FmqNCyNOJGwlc7BF9%2F7D%2B%2BCReu5312sOgY615FUEqvRO5ZNDq%2F1amuVHgou8K1ieHD54qqaNvalddBFZTYyOYTTmmZHDWN3zTmLkr5ruA54dL03XaiSFZTcIj1UpIXeS%2BD0GyQDfcU0qCjNWMpBhMjlfw8z3iG4wHvg%2BqgBl8OwnsuIZIR4j5M3darB4Mz%2FtncVnXIJ4N5d9xn1gkwUVlNN8aEPBXDrbKvO%2Bhkabvrwttil74R5JLJagzCGHXe2iOLBeI0mL3VR6z17cVMSBtlfpBpVYZm%2FMJveJtUBogogQ3XdC3XyibMAyw1u7zi0DE%2Blw8ov4lp0fyiLekvCPhEmpefU4jQIEkbdv90Lv2Y1MCKEdd%2FEVl8pOCeUXACKByJVsH5AmYjZ37DxAfNNvddbnehUwE01BYoW94YFrthkjYkXx2%2BymRCbOVXv2gC06c0UEcigbE2WLg9FlMJeVmtAGOqUBLbCY6%2F4W%2BJQX8PSPvxjJ37tcp9Lt79MWsAilI%2FO2vxDo5u93tRdfH3JMiv83x6ixBYtH9WzSGpWZVhTtLdjjDFojCJ7sS%2B6FjW6TudGlLQARRcLTRJ62ERQfGsx3KSIMLx57xIwpydRFq7mTbdJr5Mi3CbQc8LvFKC818oo9hOLsp4fuDGHevTCSW4ommvoTVxiJb30os%2BsqXoyzigP9%2BGf%2FPkW0&X-Amz-Signature=89d21484ae27672bef01b2ae233317c03ad1c453e6745adace73b768d9e86f98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X3WQMSR7%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC3B8EYeN0c%2Fgzf8rmT7lRzNTwNCt0G9aE5KMAhHYSEtgIhAN2QiCDDfKqMgketOGx4f%2FI4tQWTX4xQMepNtA7LLDaRKv8DCGwQABoMNjM3NDIzMTgzODA1IgyDph3LpAtOmnbRPQYq3APaW0KUyUBT3CN5tLZ51H3D%2Fo70kollz6Jkw%2BTpvVmgzoZ6173svcsAulh1YX%2Fr6bYgOTDZSbD4q6A03HeZycCnYDYbZQSxJi%2FJ8gOnmZ3JnSpC0AUjjoh8kBwPp5iukRL6NJN17lbSTXpPGwiT9abd0bzd7sqWTn3zEOJ7wgSx44HGXXtDaxYu27AyDzVctDx4vMPwwFKcVDcfxpbTqsoj%2F3FKEJtGT579Mtvc6V8%2Fza2jM7CPlmkmt%2BDSczFf%2BW8nXN%2FrvehvuVIbyqDRngHJ8aa7MpUyjqxTjkkQTxbMYQITefZpl4KIqTjWwwG6nZ2uVK2IM%2BLCF6msJyW3LND0X4Qr0CAtZuzUpU%2BIKLOd7Yc714W5fYUfk7mRuQeJ0HSweoFzC1O3xrfa4Six%2FGuTV54fYaWWeakcFsBFfHR3FYVB0SGAVgHL1HdIictbY4oNFdAgcyk3u%2Bv27VyO8tVKXY8B3MkRiOxQgAODWnzmQtJfqu63I4yFfqOGxrKiNQjadNPF4QtgYXuWve5gwnL3b6jTPpBknYMigXz3ukEa58YKJLUitKB0OR47xhjkiIrJy4G7PAG6A2WMZGP2oHaMcvMoCXsay0plCf7Ew6f4VQXccAU7VeA%2FxCNp3zDYlJrQBjqkAa3LPtBqFBE%2FJOskJiyAknh91JdJDhZO1uHP8SVupZIZ9E63TtAMQgZW9Git9SQU7iwsR8KP%2FhqPMrTpMR8A6Ka48p9KG6yoC6Mwf%2FhHLTS%2FV4Zkl4yI1V5QtOjBeVy0RvTjhhjKeV1Je2spWErDdPs34Q2OXKCCUB1eSXGqec7A2DnjAxddQcmaM8nNE2CZ9NTfqx9ExJnf406lvURVfVOxiS9x&X-Amz-Signature=0b16dd6b7957edd6a4733ea2dc7bbcdaa2acbebffa33f842d15f07893dc840f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S7TRBWD7%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCF0nrBBy6okqzy3nkBD8jGoTElNNFiKjZvf3k%2Bf9NfGAIgGZ%2BTjP0nc0mwEoyeVE388qTz7isUlUP7dYtzypTnezsq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDP3NlHM8P%2BegjzUcfyrcA1iR56pyUMAc4a9hF8RfG5L9CT8bsWEhkyj3TiS8JQf2RxiR2SoeRNS5zlkjEgHfZ79FLl338ULQiEVaZe3nnWUp7C9bQB4r2rs6feoEqRLn41UzW9FJwr%2F6xXQD6LJAC2fa6R40%2BWKky%2FZPebhu3%2BPjwD1px%2FRWhrhAWIGjxAfUzuDHfmdK2MCjXCsI3DePmkcZ1BLXo1yoeKOoIvHZmaFyZx9iIaqfqAxjNZpblGTEYO7lqWVUrKvcuT1TAG559DHC632PEFokjwkDa3cm6%2FR1asfBp5fZkY1S1NwZE6k1QUS5fs62yn%2FI3biQvIhCy9z7bsVTSwXVOH2SrGL3AwKfHceplkQ%2FhvAMHdx2iQUP488p8EczUA1aoKgxFGAnGIRqT2w2m8gdw11%2FjcbrROtrTZnzy6DEfjd6b8zuTmzYRDk6wfCwzExNxOLoE7a2WBxz4QDF7%2FOiHrOOoZel%2Fw0MyG64oEQ5g72J1FV6BPG5I510MeRzRPQb2oy5lB5PTvmOmxI73R9cAeGjKe%2FzemcVv5r0vuMc0XbHhdGc05b1lRBRZDIi9XlBIDdyIexibYDtHxoUsDqbl%2B4h%2FQdbXygo%2BRnI227%2FaFkkeo4KZqh1hGOgB2hlXsWxwDwNMJeVmtAGOqUBPq6vqojtvPXNguex22%2FwLL2scTygXVXbTu75YVW528DQw6dTchVIqf4xPbo7zBi3vBtz0E%2BdiPE1aSp27Em%2B9UBrJRQCLuvjjIdBic%2BqG%2FMADU29HKeg5piAWiZ9f7V3CckWNxJoSHHP8xJ%2FB4MPzKgxPaqwi69nskfcONHHZV7tLf8r7jiqgpdb%2FaeQPFE3n144FiCw9QYnvXe24cYx%2FZmjc6WS&X-Amz-Signature=01cbd233bc5bc84a43d56eb541f7cc31e2b13ade9c1271d9d4971bc38d2cd14a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667243HVMK%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD3OVIevzS9geRBk1ViX9U7Ljf7e27eBIPtEaLFPGj1FwIhAOMstGDbsad8nGwvpSuP4aWdQ2xyttWs07S%2BulMk2s30Kv8DCGwQABoMNjM3NDIzMTgzODA1IgxFtjOwNeo4cL7dF4sq3APdwl0zQnDPMtSjJj7dPdJw5cHyNdOtDmMozvZeQOwGAnjriFLuxE9PVmDMKsbC%2FX55H0z9B0mqw1uUigL0v%2FVcD6FufHuRpZ2%2BamlG3gMtYI1JO5LrdR0n9Fx9VvDn9NTcf4qIulHqf12o9hHnTIQDecbGi7SdQnXRJ%2BRh7TOkTytexdpdjFz5hc7FUU7ina0DfVDIgR3GdTIDaW6VN59Bt%2B16B3yxn%2FtFB4pbmh7dFVPU5OgUSHwQzGkMGB354sG%2Fb5pDQQMnpFN%2BTpSmWEnm6qZNBw0HAtKy2IRc8az8WsokbbHdNZHsCy%2FKXbizmHDMwTWFKfm0isvHw7G2E8zthwZQ9CsFbCG8CDaUN%2FDVOKpBLDv0xfvQsJD5qFyaXv8VOmq8n870bGAsXR2Oe3UWkw52fQ0qAPU8KM5dHepG8zq7MPoNot9OvOnCeHpZLXhGg%2FPv79jgsdumfDmnpAm627vPUsGaO4P82B7sw89y1sE0MoBr9wrx4m8rwgeqr6U5lhrklWAS3KEBSCaNJ%2BAgtorR0TrbspQ6%2BigEpxbJg1WKoqc0vYOUydxbIMNVWLGZuQ2ufTQz40YkQTND%2BmTA5M2L1IlGJSvJeRxfjuqBbLP4a4beZ84QTwucvTDak5rQBjqkAXG%2ButG%2FZMa1LY0ig9Vmw8wNT3LiQcevIMdYd%2BHbF7sWiYiTnnJgdDowsaacBfdFf1HO6iasV3WCoG1EdzPYPh1SIDOS74uQEOmrBuV2UG9ER4rmaQ9BMtFG6IQBDCKAaJmVeZCiKwVM6UWk5Wdgx%2F4384VUze4V%2B0SM%2B1X7VPlKs19L2n4OVGHR4BqsTtHoWyA2Qp3cw3BtJ%2B%2BJfe8rnnP9qOHs&X-Amz-Signature=1610c0ce0d5bd51797e7a897a27aad3901ba83aaad569534e75469cbc201c4cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667243HVMK%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD3OVIevzS9geRBk1ViX9U7Ljf7e27eBIPtEaLFPGj1FwIhAOMstGDbsad8nGwvpSuP4aWdQ2xyttWs07S%2BulMk2s30Kv8DCGwQABoMNjM3NDIzMTgzODA1IgxFtjOwNeo4cL7dF4sq3APdwl0zQnDPMtSjJj7dPdJw5cHyNdOtDmMozvZeQOwGAnjriFLuxE9PVmDMKsbC%2FX55H0z9B0mqw1uUigL0v%2FVcD6FufHuRpZ2%2BamlG3gMtYI1JO5LrdR0n9Fx9VvDn9NTcf4qIulHqf12o9hHnTIQDecbGi7SdQnXRJ%2BRh7TOkTytexdpdjFz5hc7FUU7ina0DfVDIgR3GdTIDaW6VN59Bt%2B16B3yxn%2FtFB4pbmh7dFVPU5OgUSHwQzGkMGB354sG%2Fb5pDQQMnpFN%2BTpSmWEnm6qZNBw0HAtKy2IRc8az8WsokbbHdNZHsCy%2FKXbizmHDMwTWFKfm0isvHw7G2E8zthwZQ9CsFbCG8CDaUN%2FDVOKpBLDv0xfvQsJD5qFyaXv8VOmq8n870bGAsXR2Oe3UWkw52fQ0qAPU8KM5dHepG8zq7MPoNot9OvOnCeHpZLXhGg%2FPv79jgsdumfDmnpAm627vPUsGaO4P82B7sw89y1sE0MoBr9wrx4m8rwgeqr6U5lhrklWAS3KEBSCaNJ%2BAgtorR0TrbspQ6%2BigEpxbJg1WKoqc0vYOUydxbIMNVWLGZuQ2ufTQz40YkQTND%2BmTA5M2L1IlGJSvJeRxfjuqBbLP4a4beZ84QTwucvTDak5rQBjqkAXG%2ButG%2FZMa1LY0ig9Vmw8wNT3LiQcevIMdYd%2BHbF7sWiYiTnnJgdDowsaacBfdFf1HO6iasV3WCoG1EdzPYPh1SIDOS74uQEOmrBuV2UG9ER4rmaQ9BMtFG6IQBDCKAaJmVeZCiKwVM6UWk5Wdgx%2F4384VUze4V%2B0SM%2B1X7VPlKs19L2n4OVGHR4BqsTtHoWyA2Qp3cw3BtJ%2B%2BJfe8rnnP9qOHs&X-Amz-Signature=27155d147b4159ac8d408b6b800173bfc39ebf53cd0f6ce0422c51b4a5d5bee0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
