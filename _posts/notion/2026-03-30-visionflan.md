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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SAZPORC2%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIEBklAZPOURp1r18i%2BG4bCY2APYDp%2B00rwqYabpVysZ%2FAiEAuU39ygtYYoWeY9PkKpGbnkfY6EMMIsK5ndobavI31JEqiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPIbBvfV9sKWrGu3SCrcAywEN0HMU3AKdbpnNVcAUDgubxuuTyCWDs%2BwQJtxzPEozcuaQzGCM2bWiktfKXdVe2qpTfa7C1OUpxdCuCS00q%2FU0l7%2FLN1ngaUEyiico9Jl%2FGCYxTtXarjpDF4bG2oDXiLnLSklbkUkbpD%2BFP0MAi37N08YPugtpAntMQ46YgqE2tez2y04Mds%2FMj4jRn1qBBCpOZYHIvnVB7ko6BKIuWIGBiG9WvgIhPBq6h0u%2BI32TuS6W%2BricqTlETEqUCUBeXOhKGUWX3Rn7%2B1AqsHkLwZ52HI1fIn3nenptcMb4%2BfyuGnOWA8XsecXZ2QobeBfkLyCY0pSliiYWalNcX3tOpv2LVC3J%2B8ugAM9JbAy3UACE%2FvWrdtyd1%2FeziR8SgFFI8l7SrEFku4WIz%2BPQ%2BxVovbNDHp8CLddXHS8ieQT%2BAucg63OOq%2BjOfFZAwPb8MLffAhDqUOQ%2B7THiDBIxb8zdRFpMTASw3qiykogHX3D5iZKlpxZ9Xs3zVOvJerZ76wfh10w6vMTDEhtDb2dOTax4JTdhFwgUJqRJ3KqThkXDa7KU%2F699UiiC1kPMOl6VaZUaHrmrtbih%2BLYLXzM9q83N70FPjJJBPt7AP3PrIWbN3e09LeGCRlcWRKzwHKYMPzekM8GOqUBf%2FU%2FmqC9D2hnMP1crklD8PuCDHUDivasewTKmdin6m9%2BuyHeSo09QPH3EN3ARgawrpR1gcULBzWyqrYMSQT%2F7WDd8WvnuEOcgxEP7HjiV0ungsKI%2By9kcyPxkoep5kxmCtuej%2FQDFpIwRJVR1YoZjeMpdGR1CblNQJeZS8o5fpCg6orlmC%2FTS0XOjku%2FHvdHOVWErB1%2B06brmsFEPVhvou4tu9yY&X-Amz-Signature=200c2ee611d15b656f76397a1c9594622795b066fca5be3fe4a9d33c5284efbe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGK72GFL%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIQDBLcuCG3o%2FJtMOss84sVJna20DiME43jqk5AhOchcpqQIgX2RDeERtYItXWNqfvFUuxWXxJmHqPhudV6gPOnVVPtsqiAQI%2Bv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKLXlMyKdDUJqJuBsircA6BihCzpQaYpIeBKVSSk43QvKft6OpFgz%2FP9R7hdOC9TSlF1izdMrbXoToge%2Bqc4%2BSzwA9JuMPxbTMwML%2BGG1Bkzt%2FP9ePH%2F5mMskA%2BH9eJosh%2FpmUMUzGQO2db0v7vLxFlAVXTYYQpouYHpP1E7EtijRiR8iF5KItByS8%2BD9dIU1NUla37C6Rar56I0WgqFTsQQ4nGL4oSoKRki%2FWTPQ8SobRtP0Kx%2FQ7qqOYDnCtcnk%2FpZ39I0nbWTq4bQa79XW3ww%2B%2FFgGvQUimabFNOA6OMtKS31iHplT2DkAtThUiPF6tfPZrKJnmKF%2BRSnZ08d1fpUr9NSgNdULHlwfeC2zY9%2FrXIH754%2BcDG%2BtAoIY5uhVzf6T1JkZMKWo9f94E39rEoQyPzmEJH%2BN8z4rJ3%2BiWR4nEBUekZvlWInlhw5thqqM%2BGCBNily6OMxkhaAgd0S9p%2FoT3XNRriDHUfleWk2zzD0v8RL2749gSjiAh1mzQP%2BCZFZXcB7ViXTyD2kNqbKUS7a2bIFkbgxx9PNfudUaqghNiW3oMJcQ%2F%2F%2BZxzu1mStyjh3iJs2QO%2FIpxnY7IAhkrejWqWUtVg2%2BlDYK%2FpJFLdy0CSXshSiD5EpoMST%2BZwGlxxJbVQ%2BMgV9nLdMJ7ckM8GOqUBBtzDtVx6kcTFcIAcR0WZqKh3XtKZ4Gg8IGn190VoLyMalD3RDMbYrdmJUtpNHsoV%2FiJL1w0picL5yYhgsrtEOApQScQDbEGaM%2By2JGUvm2XXnnhvGXpjKmsqTaSVnCJE0G8%2FnNyUtIhHMIgQktpj1jxIDyE0vaHNOE0m2JXnspJY2gzXq6yxsCkdIA0bnp8IYGxE2%2B0mlsu6x1ibqpaegMFeg8ah&X-Amz-Signature=37ae433fa3d5d7266aa2364988f86cfbe5ccb363fd2b1c6ff34dbb8b6385d130&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666E6JLQJP%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIDPn90dbqr47UPbSEkjaj78FjOoJ98Jbhi95VwE0VS%2BkAiEA59fVLVZOEHqr1WLCoP%2B991H%2BaF0laMGdqq5jGxIIuzoqiAQI%2Bv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIqA9h2J82HzgjpO3SrcA8mFwl8lU2wxvGmlxoPcmBvXm%2BfntX9TWoVMGsD6XuDcHCU26rXe0HJvoy%2BeRB1uLJ%2BJJV3rl9T%2BEJBWRrWqBtmB3mML1ZIlMBHwi9Zj6T9iYBRwdEOgVEh3x3IWA%2BwK%2B06GUhRzGDovxvxxxVKorF7pOlFxf2DD3Ja6rdzCvUFPvns92Q0jWaDPgfINMBhcocnZl81kUJ9ckeVfEUWqvqvik40J964WSU9XKWCpq8X6a6le7IejONYB41aaBlYZPN7%2BGYBvvhjc0sjwM6nBiHrX7%2B0P8jRqMIFByuYJSZ%2BTHCPJ9e9A1yJye1yJjtKB9AWK094oROczb%2FERqWCKZkMrT%2FiFBob6uYBfzwYyrtt8T7sG0TO%2F8NygtE3GVDToKs7KEDDDGFSZ8%2B9J0n0fpHwE6QgNoyugQFuHOKSq2O7fzllgAR0K6fe08kRqTgtnQu8ZhWS47jXbn2Qi1Bu1U7dgwxckyKqi5yDP7IQ09qXc8EJk2y20AWXUBGnpwRIcdqdt82p8CV9BV37AE6OkJU5qKomYOEc8F0A3qM71o6niXbVn8pTrRb8nsfVyTjq2gaFKE%2Bydobc47O27Q%2Bye6Fyoo3L3TzwB8S7c8pbpjLd5B8eU0q%2BjD8Iw73nlML%2FdkM8GOqUBQgaNMKPMpTb2zESUA5%2BHAoGyQHS9eo6CUGbYhxAwUl2Q8ev1L9RlH1Fz7nExDEvGHWanfwHfqE6qib%2BxD8Djwt9cfhBk7mc%2Bwwh4BOkzvCq2OmvFz6FJ%2BCzNt4kpv6HlcI8ReBBPwoliHilyci2bq8xr%2BtiLds5eZLj3ouyO56yYLahN4q9PCwiaPnl%2B45pwIROvhirmzDZoy4szqdSMEF2ZnRZe&X-Amz-Signature=19ee761dae2e71277d8adae60ffdcdab07c80c8cc4506bffd8be20d366e1a4c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2GVRVIN%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIQClRu3B2RljpmBsuDDwZIQtlegnknCVyWNd9%2BVGiunvkAIgYuzyT%2B0eUkLBrjt2HKInpgO3G5UI2bNymmQ2%2FALgmfgqiAQI%2Bv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI7SaeIuiEpVxdDZASrcA05h1JcNcXFn9Sjz2kkWj6%2BAlqfkLFmORnLGvvxns1zvzImnuRIhzKEc4c19e3pD8PJHkTsPgELD4MVK9rpexrej2MOovpwo%2B6MW6C7B%2B9gxFOhFN6BRy4833ZGc0yEDAeAtkQqSbYgCfDTPKrWI%2Fg48rE0vrjgAEUzLXZ4pc172QvewdnjMnSS0Ty1cRuXpuKRxe3J58M1150viswwzdHHsjFF3M8kqwYfglXaWQ9y2FsEEnYGkO0ewjLGYUYLLnZSs6YseVUuoZmn1yaeuwNQCUMJqQwAaPiM5B%2F9aUTUzoCsoOv%2B7dKpdL1QHPwCRFmLWIkxOq4VlESFLPTehxOesl%2B8%2Fb1nCcC%2FdhJoJMdhh0QCYhyQgOjIZhdlFVg0JBOIf3L6RgVwDIDxXbPOxyMO1dPlCwHqq5FjQaYReRPHobex8ZVNFCJci4247%2B3Tih0WsgQ0jGuuKc1q8eN7cnNnbf5Td6k6klE8hjZj47TnnFO5H6OVf0pVdsuXOZmBejO%2Be5lL96gABRqx7oDrupXLOfOyu52XzRXzO3ZuxH86S3BepHf%2B33Xe8A2HOcmBaFOY2U99BhGi6tD7nh8c46FRl8aswEjnYLMhMSy04ZKRIeQZYWdTOT1qSyceQMI%2FfkM8GOqUB757PWLezrTPbQYKIQbWqiU88ojsVRwIik2mlnhTYCWp2rWtVcSMUm1kpxHYAqjukHXgf4i11FpH2ySmEweSvhqn4yNhx%2FxRI4SVVVFNigXLmck9rV3ONjVcSX9B5BBxC61HAkEzX8oQv5v0BXHRZ39sL%2BeRGgU7vfuYm0ErCFy6gLFcT2gXeWP3CIat90kEF2Zd0Q8D7F54Zi4cPu3cep0sPRm17&X-Amz-Signature=cd18887f51412f7b55af195452d0162a6946213aaa4b0c20aa4847bb942ea7d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z2BFM7KG%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD%2BbP8G1IHaYzQLFel3RmpRMc6a86PECXrxUALGvH3lTwIhAK8mslbrY%2FKsr7t8qxM31MGPDUJHWXAaDPIUAhTOy%2FIYKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyrHrE8mc%2BRLlG2Ojgq3APk9%2BQPumBs7BnWvlN7227KgmBotAjEnA%2FCNV5jiFhxDG%2BDq8kOHSYBb5uM6TtOnUV4E6vzuxvw6LBmdfa4QNyelsrK%2FJy2TxJyAvgGxBBs5%2F99VOeV3E1Dj2JgDG908pEDX0PHSlq7RlsxHOf%2F9FBSpYtb9dcQNGPPKef82TaBJAbJ51kFurbITR3vEmyM5O6AUjeTaiVPOMREmjRbfhlGDG%2FOrZjMHHh2tFdxHSAmqtW%2F%2FHk4tbdBVEETDDs05%2FHVMrXDP%2FB8ZziB2wEudCYLfpp9C3VRC4pXF1eVS%2FbmT3fiu%2FFyJH%2FX5gjv9ihSopWHX7slqsmW5KJpq%2BbtV7BnM8OSeiWqd0%2FVDbpJHK6wHaBceTA2VFFqlq4I8Ah9it3fgCuHpgtokwm%2BepRHCc1FsV1WI9ypQ2WfYNSIndtJxp4iVdb5ZJTO%2BhqPZsFu7wBARqDE8sdPVg%2BGBvW70Nqaw7GEK4MsKuuJM7%2BwFo%2FYPqH%2BuFzf7Yuu8KWzMpXiDPDRtQmA3LLsLiOJ3ByiRjUnJAxHgPdvQV6t32wFhbVEmV80DISbunWMy26Xz8xncfucTb2DieCsMCefydmbN%2BWV4sKgxa8k0IFZVIdk6Em08e2iQXk6dsdaSylGQjDa3ZDPBjqkASx%2FmKjS4NylFfGADm1S2X9usUb6u9ycIhJVN3BTS5rbACJHzUOMeb4CICLHmjtw60EH9Bgrfa6%2FK7RrswDNLq4JtYx%2FwZiayI0KxwuUrBkHjt%2Fx6a1gnuJPo7dl26AC7%2FppRRMP%2F3JNk6lMIuVXoETdHem4yfiVpv7Or0JxTB5ik5Ta20tbDTefNWGLDcrph9%2FC59SLpy82hW2MojMkIM69rVb6&X-Amz-Signature=f6f8b81b8fdf223ec60c058fd01af8c299be980a6f73a2df1b3e3cacc2e93ba7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662OXZEEYR%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIQCbuGZGuSu0C%2B%2BA92QcDsipROu0odvrtJTkPLPLuoQx3AIgXuVhviHdDQk7feNHNaKrAYd9pPSc2eSxX0gl7BZ6RfcqiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF5%2BxXMHcWnOgvLxMircA1eKfRbPS6fZQfEhrJXXPMMqU9p%2Bq0agEsVbYJ0ihGOKyfXSbz4DSOLvwvi7P3MtKdm3vuftExFjzhT8%2BYZ1xA1lZg%2BeemnfBOWR23jEz%2BkDea50Kdm2pX62UwEwJTqn4CixyUYIYC5x9TDQwfNpnrOq4s1F6uBCsGVPY7%2FemLp%2FvckyUhr2i2sp77B4DJFRmoPrO1n0WLrCtiRYD8LDOWqDt9jHWq97JP42TLRO5aO7q9w5bGZ87Xo9CCrOlByk4HvFHylQuQK%2BdYd%2BVtTdNzgJzoA9mfjC4qJcqMsZQ97RNeDDbOM1Or14Bko5Gy4%2FGmF1AuIk%2BJnDfYflUHBPBalUp1CdL%2BxeQwKOWnTCGXpVjooNP5broNDsrPYozLswWVDwds8WuM5AXQYKuAfAT8L4WE%2BFftHXUVJ1HRPaa3JToY47MQXWx6kxt2ocJSvcNXTCw9Xf5nlAwKjijTlTl7kNRJMr%2FOZpzGMtt9HvHxJ4oPuY9OJI4HFRi3FMfZ3Oy8s8Iap%2BHxPq6leD1zqQOM2w%2BT8dJHoMooeNPNnQlk6g9TRwuNlJmxPKijmnEWB4vPGvbIPLvo8AgsoYjAMxoKJtpIFyQULw%2BVQGlQoVCZW5k3jSjH4577%2FuGT7JMPLdkM8GOqUBlCs1hv3gAvCqkPmM6fUPTH6FAtOfRKPq5%2ByFBNes6nKgMsJnuSKTxlv2XNuJLidL%2B%2BddxHklFPFlg%2FT3abnbEYSMX8yFCyYqpCPKVr8%2B0EG9wzPrp67ANqc6E4TAfj0j%2BMUU5uLLSZ7PVw8RRqYqe8bsmQFutX4wirayTT6ns2xDx0S%2BUVK9E7N16gV1qBKgl%2Bw9YrWvKmUdq%2FspZPjbaQYj9fg5&X-Amz-Signature=b890c0ec6eb0eacb6db6797d86333bdaa9797bfee9985cfa7f92c771c5c62b0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666376YZNB%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJGMEQCIHtiqs5fRCuTIJm0C7ALla6WDNt5VoTPr7TIAlEvMinGAiBdUpEvOYUfB0ZvpNDwnMmGJHgdxnGTSSXinkudKD4EuiqIBAj6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJRFvY5Hp8NfUY5fuKtwDO8J491xxPhehwWM1NK7YaEZzlhhNyAQatBM%2BrwvsxbmEa8DnSNy7igPm3d6pEnRHhFoLRJ2CgXOk7TQXVdpEo9Cwug92lzgNOp2xeCAfXexAmJ8%2BvcG%2FUfOuuHIqgikHtZMART31A8A2xgb0rUlMRFxARfnOYzkITPot7aUoX7uQkMiXMuM7z2E%2B6sElBO16efb7G8BPHqSQSx3Pf3%2FxiEEWAsmAVqe7XMXxFEZGlCZFK1p1R8Fio0DOrtNla1d%2FFVEf2gqAGvoxOOSXMnGwjgZ0hoyd%2BUo%2FeJSNPdz70%2B%2BQkDHYEM9l29ijKQHPOrEqkK8yS8FjYUxGmp%2FhnNZtt2z9L912O1aiB%2BiXIer2OMkDmCZt8mi%2ByuNw4ssrbrugxmNZrcX5QEcshF6A0DC6ybFZSFYeKAhsYjCxB57CWEIObuSlZtv7qa8JKFCnLNE5BAXuLbrw4nyLaIoNcIxxJk%2B2UonoblY8mzGBjo9x1J3L6kR4k33%2F6jYAbCnIei3y%2Bwfgk6h7kotMbWs7y7Wn87ym7lswnHjCwLz26VAyTorV6%2FifmmCPqokQQfwE1AamRer4hxoQ%2FdA%2F72W6XhupxyA22D%2BFV1NID9ZcVq5QSqVBxZ7T3mK1GdduaD8w39yQzwY6pgGmG3WdYd%2FK0IdYvMHjiEr%2F9oGPexprKQmablxL7%2BNnFHikqRa1kTWnvseWsXlL49Djz3eWD8pY9hN9s1fOP8Eiehy1HxZB%2BSR%2Fr%2Bv92kkFu2cXMU%2FenmQt%2FauPcqv9T84p7xp%2BNIWpZQtcyDAu1qHinpkYi8lZcHvwgXDN4y7nbF3hjI8x09MbPpvXcYAJDdU2CdBHgeAEZZhvYZsqfClgaxtGydin&X-Amz-Signature=0d225b1438d151d7310708cdb7163c5915da62e70b3bb9d4d79cb62a51b115c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664GP7U666%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034926Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIFB02YDhGPuGplBLdG%2B5%2FKD6YtRZy%2BksyKF3uF7WMUDlAiEAj0z6ZxigtKnJLDfKYaWKv%2BRnDdQottq%2FJuZ%2BdEZbih8qiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPc%2FHMe2XWW1565LWyrcA%2FdkvAm8HmrIAECGzQxM1xthzevsRrBbXBnuarsCrXhgwk1dWFbJ2E2zl97TZK3TyLoTDs6%2FNJJFgFVjZ6LooigmitIxZZCqoWqxprngsvF8rWscmDNFA8ZXEurzCjPt9jkqXsJB3UyoxxfNo0yPwz4GCOYedMqMWmfQGrLGMeTOgtIsj3En11pFzSN9zyRqgX4tkXJPQW6iySpzlWOoeth6ppJShVASH%2BC3hJJTgF6eI69xwzxXNMhWDpMP07jDWCkKOSG1D0Z1ZnxHyG3sen2LOgcycXlrx%2FM5W8fHNHFZFB%2FaY8%2FBuL%2FFDUYo7ockPJp7hR9ODL%2FBlVoErsncwduzHw7khset9xASBkWsglhysrlL8NyuHLmnd1a8%2F%2FbsA9V7LlrbRlh5qBj5zNkOjEFj%2BkgxgGqlRmLsRkWG0fHrZ9qkR%2BSf%2FWqyGfH%2FOi4SU3CVr7Tt%2Fnr2ay3SDcNUXFxDtyr%2BTfk02tifEH05JSDASk2xjNcx2099x06yQbH9bnt2lp9qXcfS9UQmELZWHks268Y%2BE3O4DUkNbLVmsl6Xaf2n1HGgqjrRhEKXXXgMG9U%2FnKs%2BlSpiPltEgLHdO8GVuDE1npK5ADJW%2BDcVwOMFt9QkaaqYZIT4kPkVMJLfkM8GOqUBBhVpH7XlPYB0dLLVbsqJ64NLeyXO5phTTZEZwNfmTXu7GHuNy6SwnwpA6azgctS4XfE86mGKCSGJgZRP1Xb9Cf1gfGmciukSI18C7F8l56y5MUjp5foPnQfeThC1aC1nZP%2FRNi9rRy4MWr%2FaC2uph4CANprUiCRy6BWa8kipcnLZYO0Mf0%2FwZVqIGnfX7BXNIJj0cpnYSoMZxCeho%2Fnp11M1F%2FZZ&X-Amz-Signature=f8b421a6d77da852f61a214a6f911420b0b0fa162dc315c983923521c493d942&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNNJNYGX%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034926Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIQC40SBd0F0MQgY4sfro1MN%2BidS5qi6fg8Hn66UxPYv3uwIgP6FyPjqPaUCBvBhKFkd1KiAwEn3lEWTy5VWaPTUs%2F6gqiAQI%2Bv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHoljZZ%2B3l2o8sp5jCrcAzpHEeYlapZa9CAVcTr98ywtbbFejwnElTtNen7saZCk0UZBqG8H19O18AmuBaTDRQ%2F5zNEf0MK8LNjZfDhPUwUtJ1VzZjBzKPuRSaftFOVtHbgZ%2FARgjXO30g6M9bAH2eYbCAtnp3ZjTlVA2n8JM1XcJQXVnXW3xIyseX8iouuEgc2rO0pMw7YCnyjbUe4yH5CIfw7veiiRPJhfkvRJ5AZeuG7QQzAeEPRAL7wJWLW31JIrbvK%2FNvqvIlTwt60%2Bdrj%2BejjCALfwsHJtTAb5%2B7BIJvZhP8iodReZxAqPrdhZU3SBGRwi9jRZX9BgSi8LFan4Y%2BQ%2FXN54xjaaxcMFCyI4UCRsG%2BPsz3J%2Be0TYeIb%2Bx6joCfSFFKpcgWtkSnLuArnb193cvWKNO2%2F04SK5GYW4A%2BQCyN8sWuRoCJxxQQUUDCgRDXRcNMMxHOtv3AkWQbcjvyhHEun70gPcQamgjybKzlZBB0rHiKSpW26Pd%2FNb7OIaHte2xHcXkAO7GAXohxrmc1yUvilu58yaEtL8nfAx7G%2BZHEREC%2Fvvrip05ALREwajKEyHGbxLaMFnPEBMhHJOI8aY1w1ofHshVQPXXvu50zl2gAHuqS4yKG4591TivPlIBb%2Bl2o7XE1HMMJPdkM8GOqUBrmkmlztG4uKu2x5DBy1iTbVBSgAtUgdx94bO1TpZa4P4vUm0xyUqtMQzGj1coXOgeslFgz3AS4Q0U1rUmsYf6rFolWMwFGv9lkhS5Rq9q7ISot5NDBnwzRKbDBLdvrylTTJcgnaYR2B8wc24HNxbeVjq0qsiGZQ5WhGbAdEmdJBkwVu%2F7XCrgXCtJw%2BI7uzi65%2FCCd52PHqAvYLILEpq3PGKbgji&X-Amz-Signature=0eafb923a4b6adc417679b8157ff3e2eea33a349b2c76af877a176b731d81ff9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZK3YNGF%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIQDSN9Ad5gWprunQsTHxk9QJH%2BJtmB4fHHxUaDpv%2BTahYwIgBpTRTvAEBRD0l%2Bg%2BjSId%2Fk1zyeH9xm7KHZo%2BaQyg8JQqiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJoJR38wvzBEYkfnkSrcA7CPfHzLf97mOsB%2BXkhcN1RNpqBil8jUw%2F7zD%2F1T00Te%2Fmv1prV7oUTtNVTdMufrbQm7eAz4BG9CsiNPJVYuqTeasi5XBbQBjTUOFeq7FLvC23TjMs0ORW4oGO04meGqJQLICQyP2CA4%2FZ9lfm2lCtxO%2F%2BUNISSB8LGDmG28wPcY4PKqX%2FXqfr255CsXm6L8Rl3m58yDcX%2Fw2TJXHJrdKvG4xmnlONwHenGSX3%2BwspdSNXJ5%2BiNPncPtJXrOfRc2hBIFH4XFSLn87ohr4wXLsQWYKT31akZTC66oJRovabkFk3W9przGjye786wIpxqn3SyqkCCclMv180AmfXU%2FTmmQ8KPjJMw9aaZQAmqcUz9YoY9C1Lks%2BlcJ1jKA8eqJ8WS0Y23ePS3x7DC1bYSDINETmT7zunxsqGUCW0i0EpfK%2B4TO9%2BFA2FIhJguww5sbt1nXWi6a%2FDsrZdzw9KNXwEiMojSZwbprkjvIyIfATRUpkjn1r8%2Bx%2F8Rj4E8DBKj3tf5FkCG8gy0AJn5%2ByPwidoOBYCbq%2Frz3pq4vXi1WOQmzrk2s7vHv8jNn3H6xBeU%2Bxi%2FiNLmEr13LQkx%2FakGsnHTsVeIRXqWku%2B0njHo1FkNXvCKWcnLNtllKDzxgMMDdkM8GOqUBasSlA0Mjif%2B0UBN1m06yMZ3Vk5kG9c4jf5Gy7fHMWY1OyN7KzGQ2HliL5pG1%2FG2bXA%2FjwmL2zmpw3NHqMnfOZVwhvouuhDhs%2F2KQSSgyxm5APsiSfnLF3wuI8FDGyrG8fiiXM2WzHSWP1iuc%2F196jK%2BGdkQRXZ5uzyQqlpynmlMo3k7bj5C4jhtcF8%2FKQLpQp6Xg16seBMUawUQk199B%2FsPAK6oR&X-Amz-Signature=ace377c15a33607b74f282e049f3300be0d762728444588b335715d54f69c2df&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663TCQEY2I%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJGMEQCIH%2FrnbblUtLHBmRgGTDJ1Ed0M4auIkz3oSgkMQi4nxYuAiAERK%2FS6o7lqTf%2Bes8RJzj9reyP6K7Dbv7WrcIXO3rBSyqIBAj7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMW5aY%2BCYX951vHAm8KtwDNGw0zBsToHstD3yCDjKuo9uwUPQTR7sKpAgOLbT21SlWVwoz1pKwmAXippDqV7en%2FspBa6bKbplC8L%2FX7mLI4eV8lU6KO1Y1vGFs5ZVUl5pLK0tttpQ%2BSjGP0dZg9tSa7yZU4enh4Q2oYvGf4eYor7caI5%2B1L2a4eHq1y2so59nXe3isXCbf9SkFL6Xw3Yu4H%2B1GNsFDGZbOS1IuFiNjDmi3SH9X1CvOZ8Zl3enHlltCXwxqzFLlG1B0Tnh%2BGolRBozLobA3viffhDkzTilu7MMF6u4eXy%2Be0TBeEzHlOnT%2BQSaRBl7xxI0kuadd8KvN5RzW%2FtbVJh0BFARz2%2FHsRommVPR73KzsppgolPQNup1VzDNogYg%2B7FzEEsb3oAnOReiXyU%2F7UgPXSzu5gm82IyIIgz5WSUpyqeU2mEjgaYhj18NyZ24TSe92%2FGwsJqVwQXNg039Ak45s5%2FDfOBqgsf4KqxCt8f0wGPP5UnTMi8NwSDKvdkBO983YNhFSD49uyEuON3PavAHzCdDAFk0YShpUs1GLQQDKDblsPrYWKzhcCQVuveMJ8bMVl68XySHXCdunpm1mWJtkN5yAh%2B%2BCf6ttwHxwhjWcyn3hH26%2FT9MeA1EMw%2F8SRc6Z0a0w8d2QzwY6pgEkrcINtPOZmRrCQM1VbMWTsn4lEolRiv0YBRGfpWVi%2Fwrv%2BeYobx%2F573eOFEa3BAae7IMVFWt3IRPf7IwLyt2ilM5SSdyE%2BMHHHM3j3cKD0xIbRKYbr%2BeERmg52PqkJM7NQjEPNUgBZCm%2FGbodTsmnFlhzMMwI7FjzTjVleWYY55qCeMGLxbxSrcv5UXg%2F%2BwHX%2FiFIY4KEGqTQTsjGECP0IEQbAz4R&X-Amz-Signature=bf76b49ce5b7772d655dbb2dea922f23a0f753ad60b9e072dc236f41240e9f75&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5I62WC3%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJGMEQCIBoomb4%2Ff%2FhRctjAcQnclQwe5y6HLf1B8dxmF7k6T8dbAiA2d7Q%2BNhEGCTsoNP17MZlEdvP1PZSHkW84DGuUbosPNCqIBAj6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMWV298Lp9%2BFPjlwi%2FKtwDZW0ystv8J4bperAQ26BcRwvRkPWsL5zwA3gOHhUwgAdxEvcx4A8ZTdJp7%2B6%2BfPEwhTV08GLeMfE7myJEHctHdBHByYw0l6%2BzgbR57l8DJAeynp2LUUpwUf2%2FE%2FmnN3EbOS8oUR6soPlHqOzuLlKgejlFNPwu2j%2FJi2sh0bWuEKg5sNJs5dP2ul4KZMZ6rPxPmMLFKIUUdlauSVijcvJZE0Ihn03VHzdUPX4w%2Fmoq3Rp0kKsVyt8WSFL1giDJU5ODbBB0bv2LOgND78zFGvqWgytiYyOGWpiqpxfkjaIA6ralX3%2Br7dSZPndeuqMdlmbXnfskIM7B4Li%2BjnfcSXPEgRAJnLwcn53kMwKSWzgaY1%2BYMzrHiVZEiWKmh%2BPLF%2Baj5SW2IWVOHoKfi0bOBKrFjb4o5a9gslE2ttFHByQTJLRMAZfK54F1ckLtjv%2FXRAPAEp8iot1fbx%2Fwekb9KrN2Fz1oKbFyQzqHsfo7SacF5DpVunHMgtKfc5qwO%2Br7DcTBqv67QerKYezjYnM7cumdMgGaZCrKtDb6WLNBwdxyC2tbO%2Fr%2BK4z1R1BlvT2M6sOOL7glLg2DdFAqJ81cVfg1C2OnnQrA3Q3DhQ5Lcg9bJOky0wkWODAnXBDK5REwv9yQzwY6pgFBNfQkvNGuhE3Zr5XISs0EiclDpMaXo92xJzb42s2wIkQ2DrzxtSscpZPWUs9XXfyLQVL5QJ3tmk3cq32Lsg3ETfZ7%2BzuncQn%2FcVZypxAOU8TDRcvVSZw5qmkpDRucShdjOdioOC62z0rnZf8oHXom8Np6oiqH23aggOwwnYf%2FayqAPsXCRCYwHwb%2BNakLs7zY1OjYSc4cNpAQGQ39tgI2yclSNTCh&X-Amz-Signature=3aa57e81abd3cfbd3a654d1ed22da263fa3d6e8406ded85268f880a8a689dddd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4D2PVON%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIHyPsDmv%2Bag7%2BVPYEn3XyV4D1TmvnLXLTjqy6lQU9mjgAiEAiF5Il231xAyXR%2BXIZJfaIUH15fZwFCJ%2B7S40VA%2BX278qiAQI%2Bv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOABaV7QkXAe7eRd%2FircA1Pcj0wqzQZkfIghgCodzeT5dfdIgTzlB6HAPzvt9%2B9LPJOkx7tW9H6rJ1nRjsWs10KwsXeGh0DiHs%2BWbKXhGLn5%2F6X7l2ZtbvWVw4RETZUzjMeCKiOq7v6kL1VvgbkEeckbQgxseqcRzkdW4WjRnfSnWilbpEMzEVYz0Ae9YQtRG0B0t%2FDwUaVVLht6Qvn%2BYHTJ8CC6zFLsiJxAH0TiTy%2B4VHSyqjVJnGOApYcDLUDwl6UU4vETTiBfS%2Fgx9gmTc8SC12ib13hGnS3XCzW3NNwCdTcRFm0WFbHhceL%2FSrJlTl7KVmA28h2D4rco6KnVy8jqbPmvlI2Q6qiK1Rkn3nB4LwxL85sDe6XMxhEPmIxKdKMydK9yWW3ceCMQGHnPQMLYcIzEUKu6suJDYWemHbECug3l%2FWaFlrtGmNeNvKvrqH3yUCmTDsWo31N9uxOezcVa0lrJ%2FaX50eyqhAFti9UhfEcWgi5QiowcoYPdijSjxb%2FEXfYDdxDAT7MsjfxUWcpT3C3rljAVvHqqEYbbFuLMr4Dw4y0jQMIOI7aFbepKARFiRFbRBiWaH%2FXhCq3DZiIpybt%2FO4XLGoMPnt%2FM6uRwJtxq2H%2FebvOlsYuB2rJrGxEfb8N29CS%2FXF8jMIrekM8GOqUBbInDOpIapp5KFr5zlNU9E7sAxQtMGbMENtIdhDqFqMhiglunNSmXEUySkzFnla1CiCOx4Ca8HxoUoi%2F431d3wvJc6NHpOkJq80QLlTi10nDgwvw3D30tL%2BEgeo65Em9%2BsVzbpt9nbBufLxg2try4cRoy7G1ShPWt450wnrO60lyBdqrir5Be84wnKDNv3KdqbJdEtLbj4WqweS7wmBiLrT6VhjXb&X-Amz-Signature=d8a1a37bd5bb0218901595d2ef61920d2ca0533825e13582fec2d2ee3a175477&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4D2PVON%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T034929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIHyPsDmv%2Bag7%2BVPYEn3XyV4D1TmvnLXLTjqy6lQU9mjgAiEAiF5Il231xAyXR%2BXIZJfaIUH15fZwFCJ%2B7S40VA%2BX278qiAQI%2Bv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOABaV7QkXAe7eRd%2FircA1Pcj0wqzQZkfIghgCodzeT5dfdIgTzlB6HAPzvt9%2B9LPJOkx7tW9H6rJ1nRjsWs10KwsXeGh0DiHs%2BWbKXhGLn5%2F6X7l2ZtbvWVw4RETZUzjMeCKiOq7v6kL1VvgbkEeckbQgxseqcRzkdW4WjRnfSnWilbpEMzEVYz0Ae9YQtRG0B0t%2FDwUaVVLht6Qvn%2BYHTJ8CC6zFLsiJxAH0TiTy%2B4VHSyqjVJnGOApYcDLUDwl6UU4vETTiBfS%2Fgx9gmTc8SC12ib13hGnS3XCzW3NNwCdTcRFm0WFbHhceL%2FSrJlTl7KVmA28h2D4rco6KnVy8jqbPmvlI2Q6qiK1Rkn3nB4LwxL85sDe6XMxhEPmIxKdKMydK9yWW3ceCMQGHnPQMLYcIzEUKu6suJDYWemHbECug3l%2FWaFlrtGmNeNvKvrqH3yUCmTDsWo31N9uxOezcVa0lrJ%2FaX50eyqhAFti9UhfEcWgi5QiowcoYPdijSjxb%2FEXfYDdxDAT7MsjfxUWcpT3C3rljAVvHqqEYbbFuLMr4Dw4y0jQMIOI7aFbepKARFiRFbRBiWaH%2FXhCq3DZiIpybt%2FO4XLGoMPnt%2FM6uRwJtxq2H%2FebvOlsYuB2rJrGxEfb8N29CS%2FXF8jMIrekM8GOqUBbInDOpIapp5KFr5zlNU9E7sAxQtMGbMENtIdhDqFqMhiglunNSmXEUySkzFnla1CiCOx4Ca8HxoUoi%2F431d3wvJc6NHpOkJq80QLlTi10nDgwvw3D30tL%2BEgeo65Em9%2BsVzbpt9nbBufLxg2try4cRoy7G1ShPWt450wnrO60lyBdqrir5Be84wnKDNv3KdqbJdEtLbj4WqweS7wmBiLrT6VhjXb&X-Amz-Signature=b83eb59da0cd2c06676162817b2f15d3402e36f99c3df36b031cc15740806c73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
