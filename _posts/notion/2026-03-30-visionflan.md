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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TK2QO6IX%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAhmbTg%2FuzPfX4%2BqGjwAkJrEE7F0%2BxerryjroBg%2B98QvAiAq6I7mdXxpn6fv0lSn59EyrEwFkoR3xReu%2F%2FDRIkKKJyqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5J4ccx%2Fwi4XqdEqLKtwDG176SfzV4pERWYZ3vFzZguYqmt6izwqWDq25FTkKhsnK42R%2Frvq7KYlagkYIJlnt5EVmEfQDGmE4cwgm0Dx0ujsmGHJYHUfT0vmdqu6XN2gdTTOKkQDBJcQnsDSsaGMEpB4JFsJRfdl8apn%2Fo99F8WwwGJwIaXoLDMrRUlm9NlzR5cuFjveQffbnHkz%2F43uWg7XOpHOY6fkLfDGOLahL9oiDCywNulFeQ%2B4XdXS%2F4wR6XJjKbLkvrhxRESqEJJWy742P8XrH4LYx3%2BQCcVhUIqGCbw%2Bv35x%2BYWEQ3tf5mBLhHJiLjQB1kOVVUes2QsV7TJ5jey2%2FaZDrP5V3Zylr97LCI8iNpgbY8tkhD9o334HAL71553sf7cEBLq9%2FImLGYEEzmI0saJR4kvF6AZVAS1uoRRpfk7L5ejX3jkgG4KZsU9NQCfK5hqLPVAkZnLFbmu9xt7hcrQuJsiBroLhRg7T1sohVyJvXiMm7IkO6k4pq68CGpVN7c8bNB8OAEbI%2BWZkApOukpRfyqoPQY8wFDewk6gstxmbdg%2BvZfkq%2FOwGaMEmHWAV7JUui1sVsGPMlxaHI9sn27rGDpe1RwXH77lhVRsA7qK8GsM8vDRecjSgZjCi7mI8WPiGEhnAw%2FPbqzwY6pgFW6g2J5mgbh%2FG0hs2sP4MMBvkU%2FbnROyR6LeErYxoh6yw%2BPpeA8TN%2ByiH%2FELuqDxG19B3pzbg0pyfE55ImWc%2BYLNE5aauoUQ56g4Gv3DRSx5KlqmGrqM87Sq%2FeOdr%2BaQwAcINM%2FAwGuAQIqXFra1DgbbkTbtTamR3r3qwshKQZUSbXRO7omdop6TC10Qa2cYYhClZM11mSL5qj39Nm3BOONGzsofO%2B&X-Amz-Signature=bad82f29b4039dcf3e5f4ebb682c66c87a699d0f49396296667da1dead17392c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662KQRZY3N%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDFT8AzKg5nzQaA3CH9J4SCJ%2FhziM5TmUbqO8OgKIpv%2BgIgYkoNksoV1gzK2RrjL6gBMJHLfi8vIWmfQHrP6hhoS2IqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF0H8%2BKUETJOlEBzaircA2aHhnMDi3JvZT50CFjfKvQPoglV2uwlQvI3lv5K06yTDY%2FnSNTZccuUW7Exp%2B8dGSNc%2FVPxujreP4E2rFn8Tq8AvwjEoMpVQuHMep2qow%2Fz29PxGiApqo%2FRdfVywu3y9EmjiC7t%2BZFc0WKhR2ck9XEaNANc1klUzwH7ifgOfBmdx8kSClG8ME7WwlPYQFJkesS901Cm6ivvEDglXvKLlmKATZ2DUVUZCLcS4gKSP4a42ciGoFrqDG0Ycw8%2BoR7eL3GDgbj6SydrIQso58HrBp95pH85Kf01B6FBUd1xD1oZjEbBDmeBuWgR%2BirWUbmSuUyO31Tp9Oj%2BHBKs29GcGPCOxtbzbgTxgGRmvQJ3Q%2BoBYvFFzeGiMSbfZADg2HWkV9jdbvSQwiIOAj7RtIk5pj4i%2B1Iug6foWQmBuKa8JcuPSdFOzGouXOxMGMtoT2J1iSPXvhQUKuH40tlMLHFsUK3kr%2Fs675pAQ9me5MpH9cQ67YDSq81fNw4dEWnEgO%2F7pr9kaPdxpCDFmeE0SFsxhYh3L0WlIiZgK0pFm6iiHmGsPGaVudeVsUO2bDGb%2FuaASLnw8n%2Fis72ipnVIi%2FRnmEoE%2FZwfz0MPp1zA2IdlJteDgf7jvTUEirzHxdT%2FMI746s8GOqUBlUT75yqGNQNd3serLU17BCIsB8ViAiWW4lo2Cy5HyTq%2FU2rDII3%2BSTk1dMVd2P8XMR8g%2FXi%2BdXiKpedHapbYHqdQqnp3Ve37VjsbzVSgPiisf10sqn6isV7WzXa26ziqCmV%2BzTLOiFhhYf05ja%2BVa54MTy7CHzsQ7UH1N2awHaubqe2u4k2n16DpC3a46kmmtbSx%2B1AX4syysId16kevKzM1OLNV&X-Amz-Signature=8b044282195743905cf655442544f2af54ef5768313a56bc6783262e8a14c654&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666KAJK3N4%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDnhTYaG%2FjTR751VwClNHWWYISBw7viN7MeAF2LjuzOXwIgT4IwZRZkSoIWMGr8Znp470zAmK9Cl4FzyR11720G1N0qiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPi1gO0I4OXbtUzHzSrcA5Yx1e31B5QlG4HlV3CTLrklDs59QrTuY4USuKcro8SEj84lwsjMJpYXyJoFR45jN6sqbXucF%2F6HfFo7rPPFVMcCefLzd2WCQ7b1nILE1xkotgLGNO%2BOSeFzJnVT2hIBIKJMg5jmWdhmsbMl15KYg2mNSqAzChGOBGPoQuMhesz6t4b7uqTcXxCJoGcUCb0oS8pfhQzPTHpQI71%2F9%2F3vepi3YmNWccdENyjski%2FGUbH78KxWKnC5wLveTd721GVyurhzISZUd0nZ2TzZaUjGYcMp5noGIAWhDYAwdRoQyeRoRQkn0Y%2BiUVSvm6IpQi8Hlz972u2aqb5paJP0nf2U9CXOZBf5mKk0NYgztmgHQQSFEIPJDCT3BdU5nqmrdXme9OfTcY29Iso2msDYgkvFZmsRozHP3FTb13mfpr2R5nVy4pAcuAcfVv4nv%2BXydvbys0xgXq%2F8l5Y0wSu6p%2BV3kZI3R5N1kRX1JHNeOrwGMF3sMRD0DnDPnhNNC3U9fUqeXx5HWtH%2BZg90pARyYOSQ5U7idHeoyz%2BBuW7pS8kv3G5eeDT9RlRAXv%2Fc5W5gNTTnx26kEPXWASs17Y8qbIfMNb7MHCi3ZO%2FGxXaCEmvtRZHG3CZNwnd%2B9U108wtFMIr36s8GOqUBGHJrtZ50mVFkg2UWQgbznyi8%2BlGDJH%2B89pTxhhXSpK4BCt2SAQA3NM0Ign0iCReRq1GZ8x%2BPykV4Gh28TEdLeTsmBvhvsLm1tOEFP0GoxPQ5ULcH20YQNRnVaTsIS57lwzxXuQTXTUT1UvoXqUnvK4U4QLVH7oP9PB1I3O4sQpSPIqTy6MY38QGDbIoUotOY5NebfwOpcZ7glX7vxNZSTFHaCzYf&X-Amz-Signature=6f0852194a341ecfeaa6c297dee428bde4ecc60080703ccdfb32541ba5d253ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642PRV4QE%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040357Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEkOz1cOhF2LwXrm9RjlMoMbSbQ9uHtkq%2FT9nap1PXaeAiBgMxtFdFDfCJpt%2BGjVzeaRcCX15G%2FJ31CxgZ8JMv28AyqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMaigAVCAJCG2j47eRKtwDQ%2FShC3tBpyTGjxhN0OgZhG56%2BFlH%2BokvQP468V%2FBJDQbv2PPnBUzIXkIyFyH%2BLQ8BhWkMR6OJVsJHiibbODYQzOPTiSLPtL81Ssm%2Fr8Uvlsre8IIcOmhiQeqd1z3ilv6syEfYWDl2DrjTJPGO6kXlgeJpXKYgnw0fjB7RL74hf1kUfXDeCDw8d6X01qhM7CfTCbdnKE9E2amjMJi1asyg488tH%2BrDh6wqDgL%2B0YC9zbDk5GgJUwZhxNjZ56pnOyRD7xe4IduALKzjCws3OFER4zCHeEvGtcMZFVyx4qIEEPbYjntYmNjbYKi1LOu9OtTYEX3xSkTicTSxyhUmb5O58byEgPTwOXO%2Fg7yyJZG%2BpMOX4gaTUhrTJsyabOH9%2Fv5FdwOyJWhTzx7IW8pcaxKBtFcQVGZmtF%2FDvwZuQrN7m%2BQbw3%2F3VXVVIL8mLJQvNvba1B54%2BDC2H0Th7YY47OeFBWqV8NFpErLJ7Gp7eEgIh4JLZRZRSVYn1snO0dMMbQx0rElm6k1pyJm4cQBBQp7Nbwcm%2F4kUum7hLVXsoNxciodMyxdY0wIn87HmXVytQfa0wUFaM3X5NIKMlhUeoCZbZGiQk1ZsPhs4dRldeLdmRnSkuTOdnh3MpaGzjUw7%2FjqzwY6pgE9E7JtonYYUM9Zk7dtFLNWfvXsVuFw0j%2Bv1jRxYCTrrNU7MRVzUwrNjHrbgKGvMtydLnsaGkdqRegvOWa0gpbbPYOfyBzSu9u4TOCF0sYgEv86SLd8Pg8AFJju6mauAWN2mc9nH0Y8lJcnPOomNcsxSuB3r4s9cNIYkFIr4NySENpdBSzUDzLIplphMOOS7d0B4VMH%2FZiopLmUFuvxnV97Akbu9GLV&X-Amz-Signature=3af1635610f88866d7b4fddb26f69ab726c0aceec20b351ef7c608c9aa8dead7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VS2DQKEG%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD8u9qU%2F8ZY4bSo0FloRorrNBwqrd3vXiZMD0u8lfUe0QIhAI15vejP%2BbxZu3l94kJb9Q1qtxvpWvBl8z63uzF7isU1KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwf5hupSe9yA5lIqQAq3AMEEv6q5amCvw3ZXUMEqD%2FrQ83BE%2FX7cQ%2FgmUHaI82%2Fq6%2FdLWIBck5m1V0HKNGcWk23TtEO5mnoH6vzkNrWk7OsEYIhY92Z5FDkh4cTahFmP98MEg6hryjPadwhfDRWj9zUgKjo0neqi4QG1JOUSTOXxGm5SpHQ9pXFtxWm7R7ciWrdvgch1jP97UWKAxXRBmhbnZzKcgOEzsUFCpv8pRqkkiHEcjGwgeaeVi40kBBbzBtSf1%2Fi9QOl%2Bk1dU5ti3LljlvQHNFJ9wEwjjrjQe7FXZ35T4VE8I7ldIdQghKzOEm3APKMAilyGnKe7%2B7PRVgPxUhIdbym2BFWxiUNyVhgU8wB4XTEYAc7LoLxqF6hftqKCcWbudIJcCiZ%2BgxA5lYCw%2Bfdmn9UIDLQoj%2BCna0O5HWlToC6kMPxdZsf6BwJOJ%2B7A9mYICBu%2FvTsqhdr05Fjm1ENrnxaPUMEXz3d%2BMWFWaY4CZZ6KtQODwcGkasW9Fqfft94JPdKUF3VDTh1kQ5yZHvMIGCQlGnOec0ZQY%2BaeqIN9Jp%2B6N2e5%2BkbYqTTNSMw2Od9CCGT3IzUVTq%2F%2F%2Bys7SQsG1by1s8IX%2FVJU6GtXOD61kvjVyXuS6jORqMa6AiLwq47w29VW6kElWDDD%2BOrPBjqkAdV1tGfJRuf4%2BVP74Fb81e4rBtcR7wh7pvwJtcl%2BoajwWz%2BbYiN9rBtn4dYaO5I5LvV5jfLTBCkzn5MGQ47b%2BACT%2BxwtY7yOBRHdBwuSyYoiRuhaKHBBBxTxAe%2Bt28JG%2BKMpFVWJ81w2qnocu4wQGhjjjhJ0uGV%2FrJ0QkCj9yl6eAE%2FQ2qmJL5aybVoNVpqIgbTMyBeA0Jl%2BpUfCIscbgOGKKIm2&X-Amz-Signature=cdd1331f3f355c82cfff0b5651f1ff3ce39ceba4d97012716fd254be54ccba93&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QLVZDOAN%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCvblmMd0HXL3cFTkwyRhUMCq%2FEvFG0azzAp%2BQrla6VZwIhAK62exdcMHRg%2BA2iPgFb%2BgKu2w6zfsKbtxts6zhGe3IFKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzH4F27845O41HmzK0q3ANepum1ietw3s4PdFFjJlafi4ZGgVvW4R%2BZZC5iiY3bW5oKdL1MhmBrFPo3wO8BrNWeShRGz1mSJeZNpHPLIQVBllWs%2F0g0o2MGSQHmqMFyOdrTY78jmzc6QLXfYQ8tXAOYkeJGMgSlkxep495JjWfQQklbKSeHjvet6JlhV8Dz3P2DNCzPd78dFThIo770K%2FqguppPmDLnQmiEXAEZh5qbUcBZIX4akmhPJjLtNkyN6TBniBgR%2FRexU%2FpVE%2FgLkQI6krEQZnq0AQw%2FMsmijvADEHcsEko9uUM54SJEpF7vD2r3zZtf6mpOSo2ojlGJLOeUXPPZ3W0nmKtJb3k%2BBlUMW%2Fg2o1HhXWBxHTCrsdYRI3btGgShFDKKyuTOk1jarESh7VvxiVXjN8MXf4tEz1H3khx5u88ZJanCbkuuuzJwwkLiNKccFAqcn%2FKfZBWoATEpe%2FwwCWcLRvvJ1NvFHExgFBN5CMmaEawt1AomdktJe4BXtoAeKzi6a5pZbXNPYzCltfi8dPBbLVNeJBNEgE6TvbqFDFKts%2BpuY2k5kqQwB%2BjAz27rTU%2FbkNXCD0BkGcvi2JIfZo6FF0xTC3PRjmOQwDhFKsYgrDC1%2F2WE3qY04RQicM7ny1MHEtZQdzCI%2BerPBjqkAX1QfvonFImavOAqJkqUrK8swjMB9Tcn1PIVyPiMW14Dr9s%2BbGIte07RD44EemJCuSrR7W%2Fo1o7PeltIsT4Or5zkCvqKl7jdUr4Th4nqZR8t14huflSzjaqsbOG%2F%2FJCSlHwsbFaqyBi87v30DLSrZ1ECqsbd1xLoc6lETfxKiPdxT0t6fgCyWcMFn34IZayZRGqoMXxcGee8r8EPQJhBXkNV9SX7&X-Amz-Signature=9f40cdb9e58bd596693985747423c281df946e2efe327f168b2d34282099f66a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667HCNS6TV%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF%2FWpV%2FcN5XU%2BQ8sFpf4nPVWPNoJbof%2B5%2BMzSsGiDxU4AiEAmtM2%2FD%2FBFlNaoexoNSBsx7u0BfbZWEvvWkBKStzKV8oqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCKMPlM%2Bx7bRV1uw8yrcAyO%2BUECeepbUpPcbqsbIhoATIBKGHPU3PXlKHrIwkKmvrXRvYmBW%2B%2FWuK7vLEwS3fzra4Y4BBooeZx5blmE2FPQpj%2FZAfknaJAmh5%2FrptoGgmFEqtPpJ36GupMxYeWp9Kl2NVMg1hbzFwJpExii0%2FU7z8hnErOCuTYPRQKYnYpsTxgf7uU37LdND%2Bo4OQwH5hNGt6Iit9PLxHzV9qHar3odAORBk6PgWG2M7OfGI%2B%2BE6WPku9IFMvXtbwt1pZWcTpBb932dazbS4JukwmZygvuX%2BhkCbLkAsWMZqY5zNIIr3BgVhC6DUzn0sofV%2FDCH1pf1%2B6E0aK2BnVADgHjhW2%2FpaihtFD0j%2BaqnCFPrdm7KxW8%2FVcRM1d%2Fynl4fOx5eGk11p%2FZ%2F3qb6RXhUc%2BspYZX3C9bqDrVc62dbu8giQmMHvEFVXk1t%2FogtVm6QuLsIcxfDiNmmJUryQJoHB6YmNU9keOhgYWo%2BHCH6MHzaep4X8w9iWr%2BJLMn%2BrVIp98zBZwLSm8%2Bc51gLIJZi3oJ784f%2BBmLH6f6OHD9ExAjxH6xf%2FqDAsinEedRZpiM7kKz%2BlydhgphcPJ1qi6HBJGxvezQGNQ3KQfWJfMTxkNm0n0z0PaZGpIG7u2WUvXANtMPX26s8GOqUBQxs6W5KZhTlFrcyTJbuCNWBO1qvJ63oB5DXxpssXA0%2Bd0kCqSbwlb%2B4cpIBenSKvv4zjopvcWil6RvktjJyuc6mLyqmy9ah3kIWeedwfyacLtUq69wNEHtG8DtFomUUeHSUPoxpxC7U6CEMAA3wVb546IN9zmw815qoQINyT9KvRTsiPMkbJTfHLpJ2ar5s6j6sORN0fK%2BaZMp650uJGN6xYfGVP&X-Amz-Signature=7168cab979543b9d2f1a170f3b6298f67842ea8b2b8590b123113529a50afe0a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665TRQRNCH%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCO3SGAQb%2B1ZMDfEh5SWD2lAwcDpmSv3kTFopuBBiG2SgIgUaMvRpsq%2Bn%2Fa8sd%2BujyZS9o%2FXYoA%2Bis8sR%2FqvXYen6AqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP8inWhUD5RPKG5VRCrcAy71KOCQQG%2BShouLMfF0QqWwr9AQRYLrlX%2Bj2kwcogMJcJN7NijMpppTq6yKShYFlqieW%2BDm9%2F0dwRRRfYbUl%2FDteq8zm%2Fq7%2FLfH6H6PHPbIXJoVAfpMOU6LetsBhnCz9L1VlSa91Uh6PviXvspXAhogjvNzkvfWug1Jcq8t%2BkqsPV3qTP0lIZsBP%2F5y3vbPaEBgmXu6X46GPasaHbqq8Lrdp5L2zu5Jta8mEnDUMD94gJE6Rv3DqD8iO7oaiSEwPtGX5FOAF%2F3PSIwllvpsN0h%2BBvsavx8IS7xp50c%2FPwCUZ90PzFE18yMU05CMyVmtm32RMX8fwAXfpbJcSslCiRicgqD6Ao1rxkm4b87JZA1XYOy4a6H2rOSDR%2FX%2FVN8rXwKo27%2B6Tv05wn5UQ6uIsFFlj9TENe5rIyYKHROMiZnLHB0viLMORGpp98a2yi0H2Xjb9HdOROOegXXlJmLGwOvx50q29UqJ3Y1wTb3pMd%2BOMDbVWOUEgjJxd8KcTOyDz6%2B35UnpQgkUKL3tXThCALT0THCDqHi%2BfP1vhjCzkUMZR%2BIejTAC171uIXU2AC0pMafmURBhnneUMI76GMoo5EXR6nlwQzhBdEQCEYAgoBJ7NWlnyRmzRgFjghNuMML46s8GOqUBPHHJbDXRo5lTbIpFFH8IHOupoft62%2BiD7qQ9qG8WJ9fn15PaoZrAZhuWdKhDNejJAWXg%2BoM8%2FjBzn9IRcPXSr6Het1%2F3iOlYFvshFlhEc3lWgkvLGOLw%2B6uk3me%2FbqHXb6n2TOSypIrd2dd0uBwWkxBZhtGJyce%2FsklgQoLrt3cvkC8gQeE65egRiCwPtC6ZqwBOrSZ%2B5WyMn1q9%2B1tr6qYxC1QX&X-Amz-Signature=8f4929dd07dd6ce62a430863c2d23949559b8c5cb9bdcf91f23342969bb4ed5b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRCG6SW%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFQ%2FWfeACwuwP1P1kNJgJGq3o9EhA%2FERRdeR8SPKAdSJAiBM6VpMTkOzjU8c7%2FsvrTwZBvWNG5v3wBCgzeK6pmJkoyqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5z6P0n%2Bpo8gaGg3CKtwDt%2BkZTgbWSU0LpdxDmlblt7%2Fgxq1Vc9W%2Bbl538uAhsI4OwSzjYKVYcSe9V8672sKRiFMDRJLw5uZokkh6ZNaAPSKWfXCKY%2BjEv86WSX8I%2BO98uz97fXLlMtPt6K%2B%2FgVwJmTklgbTBNmj%2Bt3z1sU%2B%2BQB1jUKBHuraKb1zIm4sKUlmxHSREU5EAQn5aK7BNs7xDs13XUyf%2BcPi8%2FynqsClAYxYhdXaryJJKSmT%2FD1Drzhvf7kZHQ1VQlZBfmWp9VbVrVPJK3MUclNVI%2FvqQr%2FRdrbWtir%2BsMnjwHqJzvEhEIsk%2BcSVCmJJKPErNbZ36sDGkdcS2lyTtWiLlYFr41tG29%2F3olRXds%2Fy697x7EeiabgQHxwRxAELtfroqdWlW2MUTpGfmvCN4kKhvbntViXOiCjI1%2FPmi79jOt4GO5oh7ZPdShWgO9ZNGdeYmuc13eDVGzmPNaXXnyO5O2ZEtiOrsEoYAu4Y%2BGpzromA%2F9xF57uYrYmfJnsxSGIzuntkvAfAjUIPZ9ZLAFPV8hPesWBP4NaGWygTQNSWSdix1K1z43dvOoj%2FmCKfXmDnaS%2BhEme%2FauMnmfjiKQCoKmR0a8gyAtN%2F367%2B4M7CXh0SfTqC4%2FQEZyVWN%2B53jLfDrxx8wv%2FfqzwY6pgFKbJ%2B%2BsJVNzqteyGRQYTAl5sZH3Nkice3yTBt88VwdmMPnjdNiUwTt72k8ebv2p851LhPnSuYvUfQC7p3dLyxmrzVuUvWmPE1Ic35aKHqx%2BekAgQCm6zkYheK05lrM01DjAbtZaFM0ElFFX5ZlA6J6fUCE67Z2WCGSWK96Xhc%2B4QsTNPFfdVb9QjHHV7qyidvJ4pQtG3tGZ9TKRQ5FHyJhA6KFWdc4&X-Amz-Signature=b7ea51d4af31f03b896c3974cb7c1cd25d54d087d8e4e74220b9b13275832173&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UEHR3ERJ%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040401Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFfVKCq%2FGSCglc5sj3uW9%2FSYSTynNgtMHOoeQsyZtmCnAiEA%2BeLxQZwkCZRO7za7HhZF812jYVuclShhgCDhR5EbONkqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOcU30JrCxuynNgkDircA%2F%2F9CqXYhk6WWZXkEIuSdwNpt8pfeCfG4uHrT3Q%2BYoh0MIj9S7o4k3%2BWacJ5pc5S39XdHJ491QX99D%2FixpbNlU4ytfI%2F1nDKo1b4quJKD%2BF4QuWCjm4DaDCCqI%2FgerqIlkt1a%2BZL6nmemvFmCv7yV7r5THvIQZH2khlfzOcgl02ZLyGdRuGaBMbfqCwnqYXmv%2FjP99wuTyWeDmp1073%2FT8C8Znh7GhZV5Qe5SIsdRNt%2Blk0La6FOipSLOVQunFTal0BsHwF6onoTaUghUWFK6itx44ZxFm6irkUfpNOa7x5Cmuz4ynGm%2FzQevz%2BAIMukRanjMqpXUNw5SC7v73IA0R8EZh4wPc%2Ftqq8l%2B1UljmpS%2BxWrt5HGwbewnY7pUUciAAd7unMhwv0SwsL8YyTRv2l57mSmIxcWqcxskJfjpzaY6KVZF4rNzjpBomH4FcmNOfNoYNyhBVKe3k1ZqSAni2BXqMNBtt32VmzbV31ETdsTvKhe9Fhrdddh4juMy0u9UTInUmsMNWG%2BuD4jrFqjnfD%2FlsijCsFdlPcW3ZHt6B9X9eDZKuabVBFC3ARpBJbfFJzQiWAGv3oIZqwRVkLUrWLr4oXXFD8KCq%2B3v2qd7A4rOl2Yhp%2Bk8mw11zo2MKP56s8GOqUB%2BLTnltrzqJHKXSA0Xg1R3mQs00tevuNS2WXs9iSSO859Ex5di%2BaCpzqL4C9SfcqgAfH7uxGrIcA3Q7kV%2BBxB4MD4ye8PjEFRye3NCQznyMzl8F39ZCSb1dYuBkPQvn7dO5GsZhEQdsXOwDjlLFLF52zO9aDM2gUpTX7mPJnVlS6e9zyREBhVkO37Q059XBPNBpSrkYVoNqfKEoAawrqLLiCGLMer&X-Amz-Signature=f06bd49b2eabb088c97e50f7f75d3885efa7141b004bfbb52b6c0a346e7c2f01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662RW7SYKX%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040401Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDsSdQmvMV%2FkPng%2FGccD3JevmE6x0RKnUCISrNAUsNrMQIhAJwdOz%2FE3jQWyWjSEKWkzOzf%2Fh93iuxXJa7kaeCzxCd4KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyV8aO1Rai5TRP5JDoq3APSi0eiyxaT6IDz2MDmzBgs9EZ7xosoOQ6QZRGPxcex73CivgowAwzo014kpQ7whUPOyiZtPMJxwyXonMUvbxpqQ3Nb3p5Bta2gbDOqZ3JMgtRfQZUWFOesA2y9K3gWq706lH%2FZzxaAYB5qmcpWTwk3StK8kxJoOa%2BpOb35u6a0MstpdJUicxeAmGhyZaot92Z4RM8BeqUuKfs3b0lg0G3gBv%2B5vDB9cfHI4GXyFHzNQveroZpIXr%2B3i56qV9SxrgcV%2B5zJnK%2FAtoR5URVvnwl9Tc0U8qoKYWFxcuI2PsUNNCXmZ8DLuC9r0Ch0OVGNK2TEcj%2BARS5WK7n4ukuCHQYoiLssvAmOApmBvs6mXeaVairN3%2Fs3mONILzHsGfUWlspxfkQ6bokS967%2Fr%2FOnVXvW5lhHcOlHfjQlDY6VMxArRVRnPrUavtsgqLiuocQbNfKNsWaAHxZQHvgTNaeJue8JOeMiHolklMjUCTmJRhPkraWCjSH89i94ZNTbrjk6o9H5iUajuDo1eCBE0OjWEWtUfdQg2xRSq2c5UH1g%2Bzhv0Vzmg%2B%2FBLheDtvkTtxr8XAJDSHLHR5woGFq6Sc6V9L8C5AFxgyvwZjWkQOsMj9PArAkLeGFn7k94jrwzlzDI9urPBjqkAQpkYq3VVCCClrOaF9aj%2FCy%2BwSB70dMjHZA4PR6mKyObM2L3XCqiOcHZSMvmBQs9zKQBgyic%2FxlVcxUYQP%2BmYlcRtHbJA1fXcpyDdzkE3kMhqnECTfdKKs1zjbl0eSUBCA43DnW%2BFwb2hahUkHWSPgOSGtbuB5ChqJE6dBMwIHRSffKGOtWv6v%2F2w8Hw0husLcrRxFMV1FJDc95kf%2F1qy2alfbHl&X-Amz-Signature=a24669a3c22a2b5c148076528d1cc11920408eb6b7f32f49f5ebd59b72b9d1d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46662VF6N7R%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC%2BViovHrcGUFPD%2B0%2FlSsayUmut%2FidiUn4J%2Fkp4FvwK%2FAIgeaK%2FNULAA4O9ot%2Bsn5zF8ttnbwgPXV2buo6Ef7d4rcIqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHHrb%2FJad2zNo%2F39xSrcA3C87XdWQqBdnum3i1OXFLhWcBDqo06fBy%2BercmY7W4%2B5yTH%2B8RV%2Fe9JC7FLQHOGbIMWgdJ%2BiBE4yS503UPxGt7akStrZXo2%2Fgk2bsGF5LbbJqIT2r%2BMLf%2FxleqKhpbu7Y%2BNidunnFXol4y5%2Fzk93WjrGfCf%2BtmGmzayfY6uya4BfH0Nd%2BODqFkiM%2FlLYEUFKPLKugXYqZPSbIAfY1UHZrI20kreUOEYxYI1veGJns%2BpxiLzVFHDKymqgb98xifuZfPYFy3q3%2FbiLOwh16t0q0SLFQiJWUya0qkmU1TdnU5UMicofJ2k8oIFXjP1gRnPWYdie%2B072kvqBlGPXwLhpIJylvueQdw4wNzWTZ1X0GRYKPsa3Atndn9YS3wPPkyUKtxkp82aJKnETb6XazVwWNQ6aC6v%2FUwB9o%2B%2B67Zk9Rz%2BHUmPaUwF60ShUKrXVtKgYTsfCHUuf0CiOqIaKwvnfwEI6mswrYkEdFybaglgVEZb%2B5d884sXD2RDQ5Y3cGXP6S2oH%2B%2BkEN9WXTYRFhcyVgOc%2BJiGqixE%2F5ss5gmvC5fo5B%2FpCrupc%2FIcuV28YWDJ3Sh6%2Fhy%2FY2f73aFKQVqordDZE8clgk%2BweejfttPOlYMPDHMS4RUyVNeNzTQYMJT36s8GOqUB0HWG3LMA620BWRzZnxoiLKF%2BFy7GEMp38ArvsXU8mwfTR9U%2F%2BVPPBMgjZlYLbkFxd02Og7yhDAye2idsq%2BZ7aDIyAolnegOfNBfYgHHC%2Fyu4OkizGkCXMlsPEC%2F9bfFynTVcThhTKTx%2FhrH4lTC48YOhNk35VL0teNPt4ZiDKBOhJl%2BSfvwMxUGkndTWj55wUcj6cbv40XKv28Bi8NiFDQYCenfl&X-Amz-Signature=7c0d758af305634bf94fd3972843828ba95d3a95625e6f3e679cd8de8381d2e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIYVNWXO%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040403Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBERitBbS6Q3jB5rZMPYPkEIaJRtkppe83aPtPoDKNJPAiEAsatDoIssZLN1Z6nfbT3AsnruaKYu5fcj6JFSSwVJy2sqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFpMVlGgFfNc1pGpyCrcA9d4AojipoZdyhJgPwkDYIY2iSqh%2B5%2BJuT0rusid4ZpcDNWyB4oWWu5dosoTqam7F21EjJqMcvzk0fsJYMDbqigeB0cA6sDGccf%2Bm8m7tCV6jmvIDHSSGPpuFivPHsWhqNAZSJz%2FbooGFrzsfHPCEnqEUMb2VpXZRO%2BGi7Qq7wHZiddpr4kwnvcHMxKbBFn46oElU1ng4DkQTzVRJR4Nzbv5YoNcGfJniad1JgSE9yITnAfXflH0JQsE%2F%2FHAfk8Tju4e1V8taucYb6oRtlv4yJjzokXuG45GTMzctvakgrmtAJCfGGoz%2FVDTekAwZmYG7inAM%2FcOD9PiX1jYL9WmWgCdIoOxvXJJH63LBufUeVXZhzF6VzDNqMGYsh8ppLQ6dwhXfWxkv19q9dRqE8g5sx1CPsZi1cssRg8L8MurpJInKrkUOea1jWXhUR7Klj2%2Bets6MGd6pl%2FMpDj3WjadlRpO%2BMj2%2BN57iZQAwAhJAstaIbuG9jIpNy6XbonyMRE4MGsfd1O6OvXTYvqC9V5ilPu2%2FPgSJ2aMBfbJiPVPSBF2Qz2zm0utEZmqTnYo14xp3s%2BrdIO7wxHWlS01jPqmkl2KF9xGoevALZ29qH9vtUadvU1M3Oti1UBxvbqXMP326s8GOqUBlkPiXBk5fm9mO3NDiJySyj%2BJnxCiN870tsgOmX70iddWeLq3YlosDN%2FO7qQFRNrM7C0vb6Ks7wJCtaxj8uei5k2gRDK6H%2F7HEli2OGpyJ27ibq6P8P%2BScD3TF7mwbrLEn7OTQZJq0xu8W0rf2AqXwbZmryXN42H7YP5i9I0bbXiO7sK8Yav1Vl1yBIV8Mg4bqI7NMgtt4l%2B%2FcKwF2VGlTGnLzxYP&X-Amz-Signature=aba5f7a3ddbf77811136863aec4b96dad838e732722df064db4c7fcf673e1c6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIYVNWXO%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040403Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBERitBbS6Q3jB5rZMPYPkEIaJRtkppe83aPtPoDKNJPAiEAsatDoIssZLN1Z6nfbT3AsnruaKYu5fcj6JFSSwVJy2sqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFpMVlGgFfNc1pGpyCrcA9d4AojipoZdyhJgPwkDYIY2iSqh%2B5%2BJuT0rusid4ZpcDNWyB4oWWu5dosoTqam7F21EjJqMcvzk0fsJYMDbqigeB0cA6sDGccf%2Bm8m7tCV6jmvIDHSSGPpuFivPHsWhqNAZSJz%2FbooGFrzsfHPCEnqEUMb2VpXZRO%2BGi7Qq7wHZiddpr4kwnvcHMxKbBFn46oElU1ng4DkQTzVRJR4Nzbv5YoNcGfJniad1JgSE9yITnAfXflH0JQsE%2F%2FHAfk8Tju4e1V8taucYb6oRtlv4yJjzokXuG45GTMzctvakgrmtAJCfGGoz%2FVDTekAwZmYG7inAM%2FcOD9PiX1jYL9WmWgCdIoOxvXJJH63LBufUeVXZhzF6VzDNqMGYsh8ppLQ6dwhXfWxkv19q9dRqE8g5sx1CPsZi1cssRg8L8MurpJInKrkUOea1jWXhUR7Klj2%2Bets6MGd6pl%2FMpDj3WjadlRpO%2BMj2%2BN57iZQAwAhJAstaIbuG9jIpNy6XbonyMRE4MGsfd1O6OvXTYvqC9V5ilPu2%2FPgSJ2aMBfbJiPVPSBF2Qz2zm0utEZmqTnYo14xp3s%2BrdIO7wxHWlS01jPqmkl2KF9xGoevALZ29qH9vtUadvU1M3Oti1UBxvbqXMP326s8GOqUBlkPiXBk5fm9mO3NDiJySyj%2BJnxCiN870tsgOmX70iddWeLq3YlosDN%2FO7qQFRNrM7C0vb6Ks7wJCtaxj8uei5k2gRDK6H%2F7HEli2OGpyJ27ibq6P8P%2BScD3TF7mwbrLEn7OTQZJq0xu8W0rf2AqXwbZmryXN42H7YP5i9I0bbXiO7sK8Yav1Vl1yBIV8Mg4bqI7NMgtt4l%2B%2FcKwF2VGlTGnLzxYP&X-Amz-Signature=9556dcb6e626704ae8007dc58838b27a739d967a5d6c189b4c7ffa501b0079ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
