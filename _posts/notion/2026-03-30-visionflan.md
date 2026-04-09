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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666K2YY3S2%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032648Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQDLf%2BfkdFnaQ2Po3bov2CfCV8xl4y37eqA%2BG4YfYQo7AgIhAK7hr56LlmJr16wZWf9N8d3qnbeqCKVSSrNFu41r9IFQKv8DCAwQABoMNjM3NDIzMTgzODA1IgzS%2BtlgOxR53uNAyAcq3AP%2FOvFw8PCG%2FpfV2W9Qhw9AlsAlz%2Fos98O%2BNbvRRTy4NVAdRkG0v%2BU1AnZ8V8ztLOYj18Fr36onknGgW%2BSnLc6xUckqYWOkCF2hBslBMsJetgBSw5qxjXt5ueY%2FCXlktGv3XJwRfBVLtKj8JiqdDSs21PUpotdTc1f0gMtlkpiJucY00yuve4%2Fiu8%2Byd2FdsJpwNHCCavOUS6U7zXQwQIaHsR6T91nCJoIJG1ISLpRJCouNsRLBqnG3mY30dUoNmfYNARsYmXxjlvU9n5B41bh2qqd96k0aN9BNgXCUcio%2BPqVlzD6l%2BmY4bdrmNcwnvQ1PzZ3v3G8fVIlPHoNk1cTOCwSQDfFF8PkeqCRnp0L%2BbMLKKY%2FdlcquTjsQTtw19gEuD7CZ2QMYxFy2WNvrM10XBdaEQB6zbQs%2BXuoP1ZZtBPVQrP0zJQgLXhhRC2HJNeAYHruHhSBr8G6zGVmINbSswwSt8gZloRQg2k9kU5hJdbLnKacRT55apt1amrET3YtEIRboCjF1q2tLRZGADdKDw2qNmSFByd6tN4m2WHlTHD2kJmWnSZas4PzH%2B02cYNhTUF5GYJ4O6Gq8za8yOJuqXW2yP%2BlTDRg72zY85%2FuywrZ1sWQM8%2FYleZekwTDCstzOBjqkATpwbLHaEh7Z8FdY7W96vthWRU42rG8ixcnVA5QBt8s6QOj9nA61qeWsl6phJh99Cnka6zFUT7oatf3EZEyaSkb6PBbDimf6DnOBLsHG3pIA61G8Z4uAm9IRlR6tO9rY8EfaRH9Af7U7m52cl7bm%2BoSdlvLeZa5D%2F7k5JKdJLLPXU64SIKqFK4Etgccy9kVBzfE5UAmFEDlgaih0lYnRC4EXHezf&X-Amz-Signature=adefeed18b2dcda0e000be413be75fcb330813fd66a094793671bb21295ca600&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOWOOYXC%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032649Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIF%2ByaeNXmxapIYMl6UllZMOa9AXD4y7V213rBtOLKj4rAiAJypRoZpLIcFh3xIIGAGfaU8Gk9NlNa5MKd0LV9VH26Cr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMnZtXsluUO6Mlq8aJKtwDW32fnY1Hg9LcLH8ulkIIz1dtLbBiaTwG5eyIg9zWIq4LS%2FtJoZRua5kC4unP9JirVqKCRn%2FOd%2FAzM4aWi5ouSnScaaJXKGM30tbTJDik%2FqYeRZF4m5iCe7tfD7ekEb%2FpnKN5tJ%2BgdVfla85tKX%2Bpj5m2ziG67bcmkfbCZqVDsrQLk8%2FGDfHK8eOLQ3B%2FPfk0N4ju6az%2Fr%2FWdM56FM7zHhU%2ByDsPCTpawXnSKrvFyJGq4Vy%2FGTAZjv5lu0kn9ikhSHa8JvXtWw%2Bfnkf3Dgx82eyTDMp9rQhIjXPtTsxIqhlAlk7S1OMIyBPvs25dZsXVbYXG27qin4w1TVzR5N92YaaqMZXcYesHmP8%2BdcaZ2pNcuunvdzdA72a8G3Ze%2Bv6UHIwzfSPDRBKPdJ0O4NtBiaEoXfNlxWPySfUP5dDSsXObBG2WcKO4R1r3%2Fp2WjAqQyMbgnpCFPzbqIb42YcT9z%2FXVh%2Fpe3wCyXDlfVSuVdU4O4VOjYgNh3z1V6OkLRKi7e3se3%2F%2BHJL1SQ%2F1wBpY7xiB9ZcBu5D5tJa600OE8aDiEkzp%2Baa02py5YAHns5UzZdp9GvYUGdiPlke0Lo7ZAWU3EL9NvzM7IhE%2BG4OuANZskA%2BpVOm7FwGxizYuww1bLczgY6pgEdbD3qGJBrYL9KqMEBTQXZhV3f9v7b0K6R%2FBqrOayvePPoP8Qqrr%2FsvdqPgXgFbtdsRrUSWDRK2CDjY7IHiOhawgStD1ibw6j8hzC8LySg%2FS0ryfj4%2BixD6JzmQXdtf7zR8D04xUU4t5YiBfbXjc6iX6h9z0gIUqzjWrMp9P0yN9CqEMGGaryqMfUbHNspQKIAGBFBLUIZgEKInb9aRsPS81NHfePP&X-Amz-Signature=dcda4ec3cbc87484d2d80a55bd7e0bcb4af7266c282122f37c87092f610d76d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U7H4GMVC%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032639Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQDOm5NXxNpwzJoP%2BvDMF7FPUArqaCzOQBX9h1zNj023xQIhAKVyzH%2FD09Tt0%2F9IuHRR7ATOTgmHGnizrML38%2FxwQevZKv8DCAwQABoMNjM3NDIzMTgzODA1IgxotyeqLLhMtYH1nVIq3AM5s8E%2F4v3brQi%2BSBLIfWThssLU0hkfkeWGpzP0opYdmcRltyzQn%2BIJ0YKtXUVkJGHHpfsxAI83NglqDZyMV%2BiO4vn7b4Rme0AU%2Fd%2Fq9I8Hqw2pv6cW7bHOaqRuko30s0BZdOim1%2F1LW0oa%2F9YRq2N8ylLo0BfE6jikJBAt3huzVGIOcjS4GmL7tm9UqtJ%2BS%2BYvoieWLClKUtw4qdEscgtQoUpBtrJihgXWagEZaQr0MmBJ6Tcrpqxr9w%2F9BcY3LD4ThMn7cTTfoQD6IifLuEMYRScFGdXUZzo1UMJOwcjIwwm3AOQxGFyO33GIOM5vd9J5zu9p3katFi7mbV0RIridI6zO4F5sF5vxjdn0sTOIGlQYXq%2BEw8ik0bihk4rq%2FhJL%2FMBKxcShNY4RM6q1CO%2FLuAKyPjXQ8fcZSXkOQgh9rGN72pWBb2Go1%2FoD%2FcdZ2Pgyz8XWgu6ZHFuLlT%2F%2B4rNv0S%2B6TL6qJRLKb2ejIL9t40Y132ZeGEEGCpmeJttdEOP43w07pEMSzqW%2BlVeog1tCQe2U5HiGpOZK73PcYmpmJB%2F5HVVI6eM%2BaG%2BFZyOGY%2BHz3R4ShmaKmCAsccBgORJ4Sg5MMf0xyf7XteQymptqwCsySXbYyd6jZZiEATCQtNzOBjqkAXDdSI9ZoT7nYRIOX7kbZvV8gTg81zZPTjLr6Lvy%2BqhOnOz9SAJ7l88B1xS5XkQ91FqX14ofMQAxEChHtrxwuvXpdqenD%2F%2BMJ9wKgpZX%2FFbrOWCOspkThu5wLCE6iHLBli8FpEf6kT4D6c0CtIjlE2tO9Z07GRY6o15j9B3xZrbVeaeQQFuqcM8Okdr1Ya1J3H6l7dnhGhrSMC4i3Y4B3ZgeouRv&X-Amz-Signature=306e177f73e38cdd98daaa1b7308283e581bd123512a21b51c13d8aa59a9cddf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ZVDUQEI%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIF67ieupen7JMpKgfckThRBtCvhkHwcswcfgQyvk3%2F7eAiAGdxMK1OnHw9dWvG15HMhdh3hKALvUU2UhT0otMsxERir%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMNPvmZTbIsO3zl4bTKtwD3qgUEeBj11Q8PdYwe%2Bxvu9gCWlCyk7H9hMhfYwvjNfqi05FX4TLZB5HfLvq3%2FNWV6tybSIl9iQ6FgR5tJcS0%2BAIgqpAhT85rj2Yn39uXNEVP7BeHfBtvDqB8awTih7IFVv7btqWc%2B3bkLoUD9Anm2EjYAw6qshaAbV2PBo7EHJ8nXom809bFxq615OOMR3IweCPfu5v4QtLRowUWgKJlzNvw6n6ewc5KmQlPJN0A7k9qWExZ2FgmB7FoXtpbC2cZM7lVu5Wj9vdHsYPETkCGeriHjvRPealpArh4vGQaFWiCdnEPIua3cHmtt4DC09qPONaV87FmoJXbK1DoOtVj9sYhldzSS2dmViZ6yzgPw4nFgf%2F5se5UVNAB8600nExE%2F7%2FBL%2FXwETUohqLMlBmNOqffgpoHvDAjCcNYLXZ4qTuYDlfsvnbrWY6xuKGeNbnM6pCJ2Li2h918Uqty%2BHnpd62r%2BCbNYqqrjMv1U0XgzgzC%2B%2BFG8Zk%2FC5jrd4%2FXDzYDNuqFstaD3GSqtv0kIK5jeNFb9ET8B8o1P%2BG0naN6IDrhXo0QVc1Kp09XcC%2FOapAdvWtR5gUfq%2BQRxngaNDOwGU8kGKXYIOLw6GK4bynJ8Z%2FCK1kNdt2%2BmntbWkgw47LczgY6pgFA4yjkniu0h0G9lwfobqhWi846T4ZpRsLpMPYaUNYBS3UD07ua8BAMGnGgnAcgtmZP8s8cSjhK%2FDJ5N7dBDvnu6gVlLZRpQgKd9hW2tj64PwoHBTvi8YKcMwcGnJ9S%2Fnidx3A0Ymznn0k5KJu92f4QT1FT3WkpQuw%2Bvk7MBFB6BpbBHIY6uXh6tmyNy9We5YnQZbCWhJd0Dz4F0R9e%2BgTyOWIuNoqq&X-Amz-Signature=8b12e9793433743a71ed183a12f24e167196a48527b8905437c101503de84127&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TXEQY74D%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIDdKOupoplTgbbcgZHLP4iz2YanNFae6ty4%2F0yUWrvhuAiAfRP%2FeLcu%2FrG6xLRsYxeijKz7%2F5XKUnRVMBVJcRvr7xCr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIM6GTRC8cvQLqS0Er2KtwDsQnMgAYOALhNPLmlsWx6wteD7g%2BLV6qWQfud4oU0sc0EITEIn8%2B1XfSv8yPeUxkjjmZGQ8DN0e%2BHc39DzQWFgTeFYNRxie7Yqo%2Brwe2NbpyJJphCA3bZN6cVMVXJqPwDy5Ioi%2B%2BfXvFqgUhtBcI0IS4sYcmstRUX0H0iNLM5QZR2TRD5Ohs0fyPGV4SjovuER5%2BFbfREGolrCeWPMyHiaSm7wX0RgULB6B%2FYlIQmu9nLdVbpw%2F%2BnuDRk6STSa4jXUHtIrzY0xnDxA5pwWXPES07HdkLcgMVFQsw39O9KT%2BRmVJeXdYfp50RBa90ztjFBiLMxWhk2B7NKNbgaWquAu76Kz%2BY3IBpJBqVACrEzoKq1HkDwXAx02VQRayoZRFrT7Hlt282y%2BYcVs1gXUGcZfdYGehHaltBp5a7cDw%2BpKspoiSzxdYCLMT7gt4E8TfHlTtTizT6Xnhuz1wSRym1Uqb6fw2HlGDyxFbXuRJV%2BgGHvTC92tQhDNmti7Ep6gcaOm%2FUCKyKTTJHLC1SAMyy%2F5GIwWi4ZxKdMipy2NQ4MsGDV19hb1d3SoIHrur1MRgzjX%2Fl%2BocTkn2L2zSa89migafvmohnocuqJWu2mbQMYfRgmvK0IC8fa6Ns2kEQw37PczgY6pgGwb%2F6H3RVsu%2FxK4%2FXgFAFRqDC%2F82P68UjiEstP8CqTBOFaGu70J6t3tZBOUwBL7huJ9oQzhkr7DSQFDz03BJKfPR63se5puIe%2FAlig4ndPBQltcQJXyGyp3NsFX%2FXjwyET1LYb0c6XGeqhWdfhg93SpJJNFJlSgbHtgoAR4Nq8mVbyW4iqtG1m9HMziCB2snxmGUGkQTiy57VjgFeJbtljKTE6P11x&X-Amz-Signature=d8e32ffca9bb381002696e56b4aa6f83dbe2915158bc0111f1790b4a27e67917&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YND6DEGM%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIF8yDAiiMUcmHWMzpjBdmV81aXkQA8%2BlcTtzKnBktS4mAiEA5E%2FVk1bLxq9X6lXFaH8Ulxdlivby%2FbmgWrUkV%2FMrhEkq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDGEnSAc1LCpwfwlu%2FircA%2FANbYZJlevRZd8jtKSY%2BCloZH2e0wNjAH%2BpQ3XAe%2BLhOuKGyS3UQ%2BENFfZVID7NRgjAKdFsloUUne9COyS015HvGrHRufXj8ibWGGOislHpk%2F8gZyphyyAib4UK4cjOcK9vq%2BmCttRlAdYQfRtdWwschNsE9J8GBiWXXWkAKxSOiPa9Wt2y7IhR4l%2FzZfeRepUZ0n66Bax5Kx3dM%2BWEvpmOyvXtdm3uU878t%2FG9VKAGTcS%2BB7L7yPV5U2ZJWswl6uuI6eEKh4OmbUBrr32ujKp%2BGtVHealWP3ZQ2UIVGrUDlLSlIZaQE77hNPRB4QRZaMTpoTuD28FLYJvH%2FNn%2FqAGHWmmCIIb8BuYAhdctcj4vik1HnjXDEh3HbxlAyeC33o7DVmsfOoq82sX0tmQBvg8r10BB1rNysIY4ydGRgEcraZ%2BSYDu1BtZU9UDHbaGUTKlgO6pMdx0%2B1qb5sAEE8mKC%2B40zUnNIviQq0HiVL0peksFDrSG5C5PYdo5mASRQxapFvB2yrUTRdWtr7hfpaKmIoaS04OLsDb8T77zgryE4f6OqBhkJLkepteoYh16xX78wxIDW8J7OOQDoFVOCqIvA%2BfAveBI1BF8ScCAYmk1v1LABFnYvspslSJsdMPez3M4GOqUBTtHNbf2WfMhhNQUwMuhXHCpofhVZNm4fexTjkaKhQ3xz6EvsnCdeLX%2FpxZp%2Fy0i4OOgkKj5VpPLExm%2FGwl1cDvgDtIwkWhBRDz%2BKF2SPpKJFLG4RSBlzx%2BbmusqT%2Bat%2BEsNfQMiTh8SmHGKppv%2FbIyQFLAwdnV%2FWKXLo%2BMRr7nD6mS13mVjO4x191x9Km6a7DPbT3Il%2FVH%2BBwsA96iUsMAjp7vNF&X-Amz-Signature=0ebb84bcb6f4e87fa747bcecf969ec1ed23748d0bd2ccaba991659df1dbb5a23&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WUOXW3CM%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDTODmALpIm5rfPsIpyX5jLKWSGuoVb8jNwdeG7g%2BZORAIgVELMc81uC%2F4Ap93dNafwQ6N6Yap96SmDd3BLxdMAVhkq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDG3fQHqhveXzkswwdCrcA0%2BPq1YdJ0Ry8AyvrAx9el56EiLf%2F1Wt8HseeRczzUW7KkkKFjiDMBWKk%2BiSU56U5HtSxLJBpeGGndOImQI1ZNeLKv3e904JNbj5zWK%2FC6OXrZUCQ1%2FVDQ2tZcv1S83E6KuT1DTpjIjNOG%2Bd%2BJMFLAp5fcWdeCMLyn6y7lW8ud%2Bq2KMA0g2vAY2xTOHKpj433%2Fe6neuIc3vZYsdbuSbZj05Y94L8cmb8GsugH2rSsKUPa%2FLxtaBdstYJI8sI4x1JfyLZVeDNJzTzweOtKaLO%2BmETmXF3jgbzDOFXsb8jJvgQO5z6MuHc%2BY1YNpd1C9ja81rAV3u9jUTUFaeC4ze9kuL0LQuB616dZI1%2BCDK2ZF4gBFbOUAgJ3RD1I4jWu6TWV1Ytiy9mS5TicalIKOxOqgOR%2B4AUu2lRmx9NUtJtUbR7Kmv28CvoEmZMRoMMew481LDibNC%2BjUvTV%2Fj0eRS%2BLtl4aOwpT75i0HpAV5WciU2dA%2FhEIiNxYhIIErZR4kGRuLVR3aLAOGHbyL8I4IDfQtD8rP1MbVfWlzQfvVyVnRVnbcOjOtmzJ%2BGnR6pwduebkixqVEUqxHs%2BY3HPJrUXb%2FeOf1LikgqOcmrsRo3P1OKqJ3eun%2B0WL0sfamT2MI603M4GOqUBeOW3LA4KfhcFUurxyIgutep4kTjynM1TLCkGgqW1yKr4uxhdsv2KlJOKtSa0O4sxf2UVLmqz8KRfB%2FxCutMVAFMffHNLaxMcN%2Bp%2FOLNeRUJwwF4cXiBrw%2BT8rJfi88f2B3xf92wGj3D6sfaz1LWzw%2F51NWKPWOCtgKl52spmwhw77e0oqE9fuD01oVTFS9ZaSv63GsvPk2dJ61yYHxBoSpD5mRVx&X-Amz-Signature=06cc06e303f3f35a4564b6d1759a944a8d7685e8c20de4b09dd0b786a312ecec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OELENIT%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDfPA24rA2eSv2JNDP72YGkq4zxhk%2Fc5h0XO3UsYX4SXwIgImXEjGo%2FB1i5Rr8bEwlfrAdF2Eohn0YQR2gbTAp8FaIq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDHvCb%2B3K0%2BCFlcFVAircA4ArixgwkI5mEoAXMlBAg5UQpIW2cgDet0U4azjjUpeNeOWDajvuK0UgsXihzwNr%2FnXkXAkZ8EdhbtGvHoCRCf0kebujdVxrbuJUC4NPfmhgf3ghb7kWbzhPmLsy7RNJ6sVoMNscIP7OXgap5rc0FRV9Hj40ksYqGrcNAylMQxFfV3NdgKKZ2ElOT7ZJLmIbdN7F657DrrnX8tQcjdeSzs233BS8u4EFmoV382SAPgCd%2B7ewnqJmCq84csAoBEN%2FB9CilStvjsTEsFDY6K27AfcS8KS%2BJ4W%2BQ53DbbHQQbyqCfEOhLaT%2B7r9WyNXEf2LNTL%2BwF45GXQ%2BykMhZoYokPG0aA7h64d0fl1%2FIED4gz2Ht1yoFkV0dOjsred7ThjwF7EdnEGXB9047%2FVSK%2F7%2F%2Foz26nhzalINdZ%2FOziC57MG0BCcnbvgE4uIiuj%2FpOchEbv2foBa0M5sKTmbckx%2FfPsrulvKZyOdWWOVpnO5R2YDFTHO1x2QCKmvqFlB7TfK5cMs9yNe20mPaLtoojkWciDGr1Rec3IwUdi9r%2FcJz3jSChAn%2F%2F1v627I9ulntc7yzjbXBQJoqsP0e2xBABa2HaSopKVjqmpORvKTnLGNUXKMkE5eBJHJfmg6VmkvFMNix3M4GOqUBMcV3D9DlMaqw4%2BEWe3SvDSk3HQbynXe46gLXXopwI%2BwAeo91nOnY4RvriOFJ0n1pmW4tRwfL4zQ0d13kmzWLv4l8iLSbKoh%2Bmzw0oKoTjt6ZSxvRoIoqg9v7IR0jmiVMW2gtFQcCbl8fqglSgjbdO%2BlArJVt4Nsk31m26KmVbo7hHxjXRFoh1AAbXkIixd%2BUnuAc9cl94VZnUjB13FHcEFo0jZrU&X-Amz-Signature=4007d1016cb758f0782952a7baaa30f14d1f084a45a664cfa4b4fcb49d6fa4aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHFYGDYF%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032702Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGsxEPVUOXWmbkdC3U0fpou6loD9QittkxzkBxzPSYKAAiA1TbSMCUSRPTdI4h0c8IuecFFpEDgTgmRCPvNsOjk3hCr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMJmQ424UcHn181QYXKtwDDFyFRm9P2wZXj5Ubxfb3enpusAmW%2B9z%2BxSmCZb22rBvLkgcVzuyVAzkI150b%2BCEgja9Zqk2haUHrCHftJBPeqVdWwDpUDfTKdiQANJZgWG06V0sXKWIt3M1jehsVVTuT3Y%2FUpQB0Urftnax5OZc%2B%2BZ3%2BrW1Yyt8zaB7MoAzntfilASzdyzMq66C2fCSgnysan%2BhVcJ3RH6N1EhcXTyLYjuh13Celts6lNAZXQw%2BM1bQrpV%2BQmmpnc0ky2%2Fhm%2BphBaxi6kxV1luSTMEgyNFfz%2B2kwhqGPNqKeFUcmcBr5lJ6BukJ%2Fiy0SDDsGHZmhbqVjyVvVBQRhU%2F%2F2b2vBMSA0ua1%2BXVl%2F0p%2FX0b7vBDJBVD9lllRwvKu9ddRyLfIuzuYPfP9XJiCkSvhOpnb1rN5ZXzgGHNnbW6XpBIJyxDn95tB0iD4fOFb9mAtJr3KhjJqWkpQWlelTZSwza%2FdkOrtEenCWuEePQ%2BlI0bmdBF4jiajaq4nbQBSakw7jvK8YRHpkDKANKanIqoq5Vm%2FHzegFgF%2BexDcbpFN0EDXzx0zPkoBlq7qPaIz3ynD9KtBVOU1gq%2BC5qByi3FnYm%2FdeXFyzBlO%2BXLvNsBpD%2Fd2RSLKQ4INQI77XTvjgLITKb3AwqLHczgY6pgEeYgrK%2FzQmHFxZh%2BgMEjLMEuushwghNuqiPtXxwFZjTpCbUcRKYKJwMscVV6yuE3EWnmPAwTQIEQCLzD7xU4GN0zjKIhNDkJnf%2BT3vg6Tth6IPqJXG9tTUntdPpOkGF%2FuSLd7Kt0ooCL%2FoJR9m0PnKck%2F1haur5s51e6d5JIIqYtl9HUEE5YRquVI3hl8cDRZz1z2%2FS9nT%2FRPPG8kYDz3QtCVU6ANs&X-Amz-Signature=f778213a37789856001c99ba02cbd412d0515079b263943f1390356022068617&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QTVYRHB%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032703Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCpj2a05144yBJEfsL6lcH%2B0jmYDanqMZXbDv1LfehlEAIgLeqwWKMekwQ6a0RiOfDPpXtmdaylKVgqhmfNcD38su4q%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDFlN6JeBfPK2N9lRMCrcAwGbpjLdyXPXzOzsaxS%2FfhweszPy3L%2FkDi03yiu53zgH5MkGPOxFbrey8L1qXUDoloogjjq6uo2VeRHp3cwCHyM54bw3fgWsxvj9GlVW%2FNA3Y9BdgzrgkW0jJxWa1G5av0NWMI2SM4W6Gtg%2B6jAwnLCJmRi6iy9pEMFTH8IawAhJiipGYUzVxBJX6j8odXjMmFQqJ3XHGkQ4uG2ddfKf06%2B9J24WAKVnGAtTL7ih4svsBsI2hynNatG5YZeG%2B4T8pvhlfLdKG%2FF9VwSeIX%2Bza2PhOjZyRlQdppLyVXAzhXisupJmTrQf1sFu6ER20DYHt5FERwkFR4CBPqybIzttWWHfacgXghBV4P7MTa54aXwcF1xE2Fd3Av7qMmGUm%2BQxCLYlbqso06c4Cyr%2F%2Fq637y47xCfbkts1sULZSRF62f0X6GrU4ucNNeLLNa4SoY%2BWoEEOfps4eHK61tkuPIQUEGjHg1vO3GUjZwVGsg364VkimJqo8U2rlu%2BhYtDQhUYKoaRdZI7GiIPPzStpUsFDXlaeeKSripB4PgF%2FGc2FbXzVVfSoOCsibqj3mQYRsnmRDTw%2BoRtmxjbqjXhKcmXrxSVEtq0GtDROeYo4YdFC9ZpEsXg60KoKCTYRMWwfMIqz3M4GOqUBAmKlzBCetbllyyUL4DS7%2BK8fdDEN3nvaqr1ce3RsiKN9jQIS53SA1TyIzkDLkUdcWPhhzVybM41z9vea%2FLFiF8G%2BWVfhUluIJ1XwLp5xarPWumWoQhnPvJ0K8%2Bva9EFpq%2FRAWqq4lcMqFoVuGAknR%2Bc1h44AbH%2FH6JmJeyaczpfcSPY5llFum2rvg6e22IuygyiJbi5wXBw7B9lxT3MgEXIHLOgg&X-Amz-Signature=14d487fba22664ed5bcf0abf54e420dc2d77b1beae87118fc1ae3996544df961&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662NSXP2LJ%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032703Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIC1Y1BudIbMujxhspW0fEnbRDo0BDVpQTx1fB7Y1mjfLAiAENQBcqgcEfwqhTL3J6HudcOH5ycCUOdyBtm5pvpUFqCr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIM3iJ0gPSeSlbaOQijKtwDAFMzq2HqctM%2FFAqjH0HO%2Fzg0nh87oZYAaLKKWSYVURA7xo1LnEjVVKrkVyrAH3QOslU5wk%2BgNoBu36XCOpDMrqCXLijj2mQsWy7dSw%2FscREyPLFJIuv2T3%2FeRp%2FN%2Bl6NZKCJ9fDL6njRBd4L0Z1wRx0ZpBA%2FOfVDyp6gIqC8Wj0rfL3w3B1Bkdcr3dj0pS87D1be%2Fx%2Bwdx9OhoTxqqAt9OkNUBtsI%2FZASlBZIR3U6gG0LLgMDb%2FA1CE%2F%2BHVO7gyWqxW9gut8PKsPxg%2F0Q7KSy9Bwgv2R0WfLBHiu%2B0QPqjS8FwBcZLJ6B9uw7Avf0YZrkZDJSbAtqYxb2zIkkiJXD6EnsteiJ4T%2BRCD%2BT7Cr%2FA0TEz7ziQmRjyMIxtxV4AtcyPM5Bl7tGV9uTyAk73sgq6%2Bt%2FpyYyfg8s1i3eb62aMnkfP%2FjuGk8rD8vrEv7WoJTI99XM83CmixXcb3bzSgOEm4xHbCYWLnhWIbmsCumxlLO57ZEoyMFZNTaDS%2BDppTvLBvtcvlnokutCYCyZuqVKMKhiK%2BbSZ4kuljGIIGu7Cqg%2BS8WfcXBla0o9sftbuNV%2Ffrr%2Fv0piw%2FmUraixirL3WMD0ibjrMutckoCtNh5ZrZyP9Q%2BGBjGh6%2Fg%2FMowmLLczgY6pgE8n144GNmwUtaSKJfcb2TSRuJa457Ye0oyRQBYG9Vf9aq5omAw%2BhejoSdhgYJLBMvLnXZId1XpdxpmgcTLP2J9bsFRchC%2FXJ6efX88GYfx2R7GJY%2Bpq2P8BiYsjqXvSmt8diVAbpm3ovmYvDpgwfnVQ6yvLfUychDyiyLR8I4Zsq9nF0L2hdIBOOuf4qQeTyNsRS1Ax7EnSmygANEIF9PYA8ujF8Oz&X-Amz-Signature=4537ff326e4d26ee199b694a62f4ed8195380cbc1de5adbefe57c905a0da3691&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QTVYRHB%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032703Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCpj2a05144yBJEfsL6lcH%2B0jmYDanqMZXbDv1LfehlEAIgLeqwWKMekwQ6a0RiOfDPpXtmdaylKVgqhmfNcD38su4q%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDFlN6JeBfPK2N9lRMCrcAwGbpjLdyXPXzOzsaxS%2FfhweszPy3L%2FkDi03yiu53zgH5MkGPOxFbrey8L1qXUDoloogjjq6uo2VeRHp3cwCHyM54bw3fgWsxvj9GlVW%2FNA3Y9BdgzrgkW0jJxWa1G5av0NWMI2SM4W6Gtg%2B6jAwnLCJmRi6iy9pEMFTH8IawAhJiipGYUzVxBJX6j8odXjMmFQqJ3XHGkQ4uG2ddfKf06%2B9J24WAKVnGAtTL7ih4svsBsI2hynNatG5YZeG%2B4T8pvhlfLdKG%2FF9VwSeIX%2Bza2PhOjZyRlQdppLyVXAzhXisupJmTrQf1sFu6ER20DYHt5FERwkFR4CBPqybIzttWWHfacgXghBV4P7MTa54aXwcF1xE2Fd3Av7qMmGUm%2BQxCLYlbqso06c4Cyr%2F%2Fq637y47xCfbkts1sULZSRF62f0X6GrU4ucNNeLLNa4SoY%2BWoEEOfps4eHK61tkuPIQUEGjHg1vO3GUjZwVGsg364VkimJqo8U2rlu%2BhYtDQhUYKoaRdZI7GiIPPzStpUsFDXlaeeKSripB4PgF%2FGc2FbXzVVfSoOCsibqj3mQYRsnmRDTw%2BoRtmxjbqjXhKcmXrxSVEtq0GtDROeYo4YdFC9ZpEsXg60KoKCTYRMWwfMIqz3M4GOqUBAmKlzBCetbllyyUL4DS7%2BK8fdDEN3nvaqr1ce3RsiKN9jQIS53SA1TyIzkDLkUdcWPhhzVybM41z9vea%2FLFiF8G%2BWVfhUluIJ1XwLp5xarPWumWoQhnPvJ0K8%2Bva9EFpq%2FRAWqq4lcMqFoVuGAknR%2Bc1h44AbH%2FH6JmJeyaczpfcSPY5llFum2rvg6e22IuygyiJbi5wXBw7B9lxT3MgEXIHLOgg&X-Amz-Signature=b6be737901155b5f32621fa8856b80f5f9a4a249b14079e5419c9370de380a4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7CWR4Z3%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCz7jlxLI92Ub8%2FW047IyGBq4DwDqKD45xRUun21mBqSwIgXsFwmyCb4Kl9rFMHEC%2BJqEkwO%2BK8X%2BnFW0FLVJ1u3jUq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDGEHMzrg%2B69JRPMvwCrcA23Kmp4xmcaS%2Bj6FYgIJofXHyl%2BEb4nqtfoxDnCciGrqVJ3Le2wGTG0nWQK8aZO6gYsCZz1fsj%2FON%2BjMbiLchMbK7FX4vJp0Kd00PfeABNlOnCn483ltduTl0XdDJMf4n1tMqSyflFmYitU0D5S%2FKX7kcAA8NXMgrReSw20tJLAp%2FHFfTnQlEXeflPp3BktsEsxnWE4rx3TsmQy4jpd1ETAaGc5dZhvLXFupWkNMo0S9p%2BYFdDEvQ9K50sZ7l3jGP0ZQ6EFHoyMtgQqN3Oz887kzyGi2ht0v%2Fks79N8jfX2qOx3WuAh9bIU9Q3oTstXCHiv1KlhmhpYGZfjF9dnpTVrpy8vjnMqFIvF49o%2BdhYKJKK7VJRgrDpBsiFBHPLRJwd0439xjEcSkeKX0mV%2Fda7xPTn%2F0dQjav5wRB522TYJTM1z3rxfFyE818O8vbflyoKMbBwJM7ULVRLfO1Ti4CND01rYuNUbtMlkAVJdYczAPQ%2B8eJK8v3iOIzVhJxuCK%2BaKym3YQixmGzK2usR0ADbbjHKS9ut0ByJx59pYM8Jujto%2FzdItcC%2BroFVsXKxHcmJhAUVIUXj4hvXnm93SKjObPsLQeIlrOR%2B8fcpvbH9KcUSV9aIMoeBhDy3AhMMCz3M4GOqUBW%2BNuxsqgRMtRA4UkkU5cm%2BFhewpLWUo07HVVb1SE9eLqWKd7aYpEeROPwcNJHUaEwqq0S0G7TVj9XmzMTGieF%2F3gJ2liyTeMPrdcCh5E30EHniH2A4luF1cQZ%2F2WK3SwW7qaYd1K5pOJRLxFeEuE4S%2BD7ptPFvMuSLlFaTYel83LS98f%2FlOKHaAQ8n3pajz4Pu2VNrjmVSYKPkMV2CSKfRWAO%2Fh5&X-Amz-Signature=463532e9529b0339989c3b4d4daa74ae45246e39598183a4133a6eee50766398&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7CWR4Z3%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCz7jlxLI92Ub8%2FW047IyGBq4DwDqKD45xRUun21mBqSwIgXsFwmyCb4Kl9rFMHEC%2BJqEkwO%2BK8X%2BnFW0FLVJ1u3jUq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDGEHMzrg%2B69JRPMvwCrcA23Kmp4xmcaS%2Bj6FYgIJofXHyl%2BEb4nqtfoxDnCciGrqVJ3Le2wGTG0nWQK8aZO6gYsCZz1fsj%2FON%2BjMbiLchMbK7FX4vJp0Kd00PfeABNlOnCn483ltduTl0XdDJMf4n1tMqSyflFmYitU0D5S%2FKX7kcAA8NXMgrReSw20tJLAp%2FHFfTnQlEXeflPp3BktsEsxnWE4rx3TsmQy4jpd1ETAaGc5dZhvLXFupWkNMo0S9p%2BYFdDEvQ9K50sZ7l3jGP0ZQ6EFHoyMtgQqN3Oz887kzyGi2ht0v%2Fks79N8jfX2qOx3WuAh9bIU9Q3oTstXCHiv1KlhmhpYGZfjF9dnpTVrpy8vjnMqFIvF49o%2BdhYKJKK7VJRgrDpBsiFBHPLRJwd0439xjEcSkeKX0mV%2Fda7xPTn%2F0dQjav5wRB522TYJTM1z3rxfFyE818O8vbflyoKMbBwJM7ULVRLfO1Ti4CND01rYuNUbtMlkAVJdYczAPQ%2B8eJK8v3iOIzVhJxuCK%2BaKym3YQixmGzK2usR0ADbbjHKS9ut0ByJx59pYM8Jujto%2FzdItcC%2BroFVsXKxHcmJhAUVIUXj4hvXnm93SKjObPsLQeIlrOR%2B8fcpvbH9KcUSV9aIMoeBhDy3AhMMCz3M4GOqUBW%2BNuxsqgRMtRA4UkkU5cm%2BFhewpLWUo07HVVb1SE9eLqWKd7aYpEeROPwcNJHUaEwqq0S0G7TVj9XmzMTGieF%2F3gJ2liyTeMPrdcCh5E30EHniH2A4luF1cQZ%2F2WK3SwW7qaYd1K5pOJRLxFeEuE4S%2BD7ptPFvMuSLlFaTYel83LS98f%2FlOKHaAQ8n3pajz4Pu2VNrjmVSYKPkMV2CSKfRWAO%2Fh5&X-Amz-Signature=47ad1e3908d9eb507ce3c2386b48eac733e239a8dee6882394877a121763eee5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
