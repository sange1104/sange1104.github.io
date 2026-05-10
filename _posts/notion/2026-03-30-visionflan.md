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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664GFZ3BBT%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041419Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQCtgkiueZzZ3eZFvoaNMeJY97GgsiUZLw2Aj587g3Ld0gIhAO5bn6rh19hDZKsTQxGjgqCqoWfwKSQ61KuTtF35kRSwKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxXFpyydK%2Ftlcc%2Fk4kq3APgqtjsQvWVwVOplvvAmLmB5O4Rw5QzIF8xNDQyMl8WgvMo%2Bis3Bz2x1XxFBY8PppAIjz%2BLxnM%2FiBvYG0h%2FzTIhwq%2BN42aXVdIVCe9ihI8%2Bs0Io%2Bo7YhlGVY6f0xxoqF0nc%2F2hO8brBeHpSFX7tQc39JhVB6Oc5k9YJFoDGMMqrOHRicnfb718%2BuZIaN9HyH3D98gzYi3ZUOXPCF2ZLUCNEMRlAWkdFcdtqU2172Gtvezsq8aZUInQZSW70iSb8yLImx7%2FxDcBwKzLomgS6MAcq3LGQA%2F1a6y5T4wHBpFRdSdWfYYGTX%2FcpJGsolfupllt3z1wfY%2FVtwVjTaBIWqFf5k0%2FYqo7QS4dkGfSyq0kwCZDdVrBUnuuBmqqeZ6FCqFiHsbdD0qW3SsS3QJNKBzs%2BO5actetxaBDKc%2Fd3%2BWImeVJL4mZl21DO1ct6dVTOfovn3DQnaxrk8mKM2ZpKvkP6C2WeS7KTaCmjACQsKgoAkLlxL9je0to6QgtwFxXly9bC2cbjPwb6h7IDH82Weql1BMNefQ9vnAawhlYy2m7iuqLyQFvAmZJq1LthBVFMuiTh6kbdQs3QEeFXH%2FBgIyMLTKFQTVJTCfUjrN1Qi9MKdJpKibMJvX2aPreFrDCt4f%2FPBjqkAaqdLTZgHqGNFyrRzzYVh8ijnaapkh1XFGkqTYsbS4ILwN4WmnYCUgn%2FMiwYPx1QVclmkB7RWnXosflSdz8qGkfKlzsETdV8Nhgnx5NYhOi7FPttpvYUGVj2hc%2BXOliZi1f%2Fp7jw3tOCrghUcXb5N24pKznWv2wyyN5otN6hoAhj5ZiunpP%2BPVwrqivTh4IgOaJJqit1dmheqYdj%2BdDNGhuHmMo8&X-Amz-Signature=5803cd4b835330f3a42e34dcc70484b79338138ceb74c3355414e3315e1dc186&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RPVM2C6Y%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIH%2B56ogaDaEq8%2Bs8tLD3i4LGN%2FFPmYZ0L6kQb5hAgyBzAiEA1d4KN383egCNllWvbaRr0L3AExkHTm2020Zx42KMhVYqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNlwwJhZXzDcgk8rBSrcA00zjseUhnb%2BsYydqn5mdABlzLQRB30m10lMhlZuO5E9NzrAsL%2FX%2BVmXxU2j%2Bxu9Co%2BISAIbKLvlkuxC5aDZ%2Fgrm4kPDvCd7RjSjuhVMRPgY8bWPGMl81TOXLAe7JRQTHP7MXkAr%2Fj%2BPJRIaRSTHVXHI4ceB%2Ffa8MtBdYtW3dbVOcXiinmwLUkCyjZ7EDCO9vhwX%2BaZ424pSXVSp6jzIrRcFhUjiabEagXf%2FVaX5%2FH8%2BIIpKSNViLUVUnseIdC11F4G1mQsFKv5CwHtI%2FGIbHWWqkg3j%2Ftj5%2BE%2Bu4ET11hngYHoEA44VwkxlHh%2FMUVx4TflbUORRinCH0K%2FHVg9ELgHstuowdOtsaxjHIohK4YBxyJ5Nvpik%2BdQrr3FV%2FD%2BsEUo8vQ1IBhpu0ZvU%2BJIyBzNI7mRlBFu4exzrM0mO2egYmWTmPUDhniIB4x6nS3s%2FCDNVl3ftGdKXfp0gzG86Hz%2BSjRXlnJGw9N8WDSD8X4m6irwBnlvQNaGBQT0kM4sLe782kDvRQ0%2FU1qKOOKsVhr1MMaDnUlje5btUHfqHHdVylv3V%2FtCE4qNQ%2B0BQnYySUxAkTC5vd9fyJEP4ZGwdK3dC6B%2FOEIlEnhu5Hy9DvWOxRAk%2Fxa2KKvWu3TTcMPje%2F88GOqUB8ANZ5COlW99WcTDCVOT4kNmapEeksQC5krkFz8zT4LhqE02wYuUy%2FpuEvVuCjVf%2BRYsZ%2B2pox1USBcngR73qm6YLg99mMFF3l40aY9U8XK5RB1l0XMIYkNxYmNsieAEDfLivhQB2jLrWUglLaNzdFPc%2BEHuysqcKjdwOj2Iv5fX24BWKaoAivPeCe40G7fFK4But%2FpT6M4IxT6og%2Bv147Zmx8F2%2F&X-Amz-Signature=edbe387934607e0418b8ef2c9f6517876ac4775e92527da0929955e3e90a07b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664GJ2I7LY%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041409Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIDClaNCbxjupLUYwgWnSaXKA3PREOZL5XmAVdrECdW62AiA7F0S5I4m9wngx76OGtLReqq5kdpRoFwz1ulF2PHn5jCqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM7rn9XM5FMty%2B7rQhKtwDu4epDEhtLKukwibjYXAVhNxwR2kDgAVbvvH7xcPW71Cp%2BmyBtR8gCarEifLLmmhY7WyS1I5decW6ukRt5bNOSPGGukOVN0noU%2Bl2hw7tHE7HvUVPj5MXyKUbNQH6Z%2FjXcWnEt8XTI7FNBeVZdCEqwLWEluaOTTZZaM4QJdrlN0%2Bps8BO%2B%2BiAE%2FhRH9kQcFWHQQFAivJ4xSZ6Y0PXmoEon9%2FAyWBXQN87JweUa7NuZaUzgh4HhMlrJteofxBsr7NIVi6OD4kcLzqklU1Hp8BOeYJXRY3YKWbQDdGyNo4jJjKlKHGyOfFKN8s%2Bex1azZYssSAyg%2FrV5b2VZhmPHhnr4L4XG84yZB5XUe9glipT4i62P2SXM1yAOy8i2%2BbHCFG26ePNA9sFIH9NJDPzvwpluEVOaoWC%2FNm7yu26Mjsz8tBDjaGkzFaKBhNmC7aNWHZB14Cyq9fbxYipobl2USGL2F3BiT3JPl1RJBQUIE%2FheWS%2F%2BvGWfkU8bXAPcnu4fxEbicawj%2Bz%2Fny5O26SR8%2Bu5TLGfS2DxvOHfBGmtjcgIW9tiYWuFxFUyX8xlozbGORQojDPb5Y6QAPW55g67LBWUdYCMnfRa9wv751lGpcmGevr4nGzZcxWZDv75Hoswud%2F%2FzwY6pgHw1EYYpgL71v%2FH9z%2FT8i09TqrSlTrMCfmMUDs9OIzz%2BrRAFOtnz%2BmdP1DphOz7NT18LVT4XJdlhgZhUqJPy%2FMbtoy1fyun96Q4VUjhVlFpr0u4wIq8BgGRMbuho11f3LQt71QL2oIBH%2BqQgaIGjdm8A%2BOchud10hpM78RAbvZvyWAtfWtxZlNM2FbKGGXh080yc7%2BGXphtW5qQ1F1VbIx4WcS98o32&X-Amz-Signature=474a3b1f65c880805e48945517b47cc2f4146d8e5195354538f3b1bceb0f072d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WFM6QB6F%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQCM0zgNpEEAcDPSROesxb%2BgC%2B2ebb9DxHuVfTJZ8Ewy8AIgSnhc%2F3%2FgSH%2BLEJ2XPGhlyC62rD1gcz6dZDz4p9wMRTwqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA3Q9VsUPuBNkcPqjSrcA5XLLflxXD1iThs6OYmPhWAHKSgmjGEognAj%2Bb8iwVKYhjEUzBVIiY8uvatmHEoXvAXZexqZxHJ6K0kwSFVtgjuTWEnoB1YcZqIPcuc974T6bolFIfKILs%2FAqlzONWYha0lZucmMEUQrf9sWMJCV%2BYu%2Bnx2PUvqOPLWTPBnoliRjPFdxR9GnBzsI3A5AF6iaI0TmBKo8j%2BzwHnRf39m0DdRVrc1YmaOgCAbv9Frv0aquyZ4izXLuPGe1chovP68tFWYC9EBBzJIAGkaMXqowEIaNk8STGsxG7xMwn5gsXdh7afihu%2BfNFzuQ0wa8XhXXZMnl9xWFdoltXX2DW0sPK0FLa5MB0mX9n8vt6mbStGHLhXto9EnKWxnQK%2Byo9PIG2FjwmQDvtvTXzDJGL9CEvDVFn7yPok00coL9dR8AcuHhBd%2Fgi84l38FcgKk%2B6V71lmyMqQ3vT2VD0Gvrgy4i%2BpzJsyhbjkJw5ERqTTKEVyg26yLXDr2byJjVDsRjGUbReNckddWWxKIC7alI4bEDgOc08S7iRMFgdOozNdgi0xHQ9U%2Fb7OeiMocOjCgSPllCS6lruGGcT3NJcZYLlWr2VuS%2FpN1raxv8DSTjopPb9cU3f9FPvr%2F00X%2BT1yKRML%2Fr%2F88GOqUBHVYTdpfts7ZUTqunGYtCUpMBEvOPGcFIOis8jdDr6K7hQNzf3LMwkaV9oMbe%2FREQ4fjjhiCQLTbdwQf6LggKC5JDyehkAMG1NVn3mF9CJiRHzrKus8%2BEbkxOkNTharuxPMumOz3k4Xe1wWViv9vahEQvTKKaYv6lYYXjvTtmH3eJci5RyygJDsnmdbEHoMBe15bST0NOntBDMCkTnAA5e16orHT1&X-Amz-Signature=9420659024a8ede1aaa0b57c3bef3ca23e1b543608832a17aa4de6c824732e71&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WX3ZGLBQ%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041425Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIBsjHXd3zVauz6y%2Flv7ffxh2ZTNkQMk8OcpS%2FYBzDjO1AiEAjPZDu8ybTJb1cW7L9D5IpEOikcy8%2B8nTeR4GgxHH460qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJaK6qOqwehnMqGboircA8KhEDnosJbMo20hZ7cL4chOEoPw19OHuHXcJPD6Uk5V1SBr9O9t%2FPUNyTN%2BHuW2j%2FcT5xvEdDGe7jtenAl3bJAHmUr5FdgyufSYnZUv65CJtHaX1KUyf89zUKOz8i9mF6LuWcPlrHrFnfIAdaJtNQTWyKB0vmmPLuHSl1mfS%2B0pUAk0xyHXDcd5xOaLHS0P0NXFLFIi9y2S2ueTvazQrVhmrIvvIVPydQzukeqetQ0z1QW9CpqSp0xM4oh8tzBbeoX0%2FdfDxR3%2BXLsfM%2BDBflukwmb3hjMMoV2YiLx8u11%2B8DC6SddIXPBKqFHedGhEI6F0Zlq4KFxGFtCXQ1d3BoUiXHtECrAQmcQZyBxSW%2Fv6bCCL5i369BipSXbA%2BGY6YsSyybyVU8Jcc4gQRW9Rl9GP2EwcUZ%2FYx6zpPtqLbi4cSIxhtDCcLxZC1NQFQeGtk55%2Baa%2Bf0ALAhHMuPV%2BkeUnSitd1ePw4B8TTK7x8mVF77YzgcuUBxr6E7mpi1nJ%2F0bIHk6gpElEv%2BYFYHMEXHlNc8upU9calG8P%2BE1K9jTkPtNaloMcFZVnUDhpBFDtGoPFnS2XqXGTYk6Kkf7A1hNIZnvRQ6TJSPAPFosc%2FQtVAr9jN8np%2FsJnDpqVQMKvf%2F88GOqUBXljAOgZkPu4b285qk%2B7BEFsMOnzqR2RFFPWzid7Dki48VPFqk7YYUBA%2BkSpiPYnpDpnSlRfgsc944gw4YPsam6Fmz2aVem%2FNSEjrwoaNn9O%2BpNAIyIOc%2F7PubY4NRECe79FV8kjgp6jyiENJPFzwE8ajgNQcVDzs%2BmjQ3wULf45GqqIugyAztb2G4YyUEZVKu5S8sUHT9PVxl3s%2BAIODxnvGROBN&X-Amz-Signature=850559ee0094866ee5e7514e02c7f4154697980caaa5f1d13b8662936a4ef60d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XAGRSDU%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQCwXNIBBhGzcwKKhe6Y9QdKieG4VFVXf54Z2bATkH4rUAIhAL8%2FQW3pW%2BDvnNCUQFlsBFlLDrKSw%2BthB6DHfVxRx7AzKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx5EaWdhF39wvdn2PAq3AOncOBbZN6NBK9AsB%2BzMWXV7WkHJLmKNM1kVbCQfPnhzzjVqQ9IXxE9z01dNljT1w%2FAhl3eBARa4FXAAPZv3%2Bvu5ksD1QUYW203jtvUcMuG8jckyaW%2BiaEjMRp4le%2BoDRn5o4j2SsKhTBlff3FTAUfzkyC313Yy1N0MTkYuzOSt2LpNSnlinFHoKq%2FxywyZTru52p1FIQRdaUygW79Rw1kzqB%2B6gLNuP5lsbXDvstkgYrVbU1Ul3Y0hy9BaJKNO1DV20R%2FERa5qHzmR47Fum45TjP%2FpHi2Dn%2FWQT%2FDYplVKE0r9p8nAMeemL64fmJ71KIwWCeRigfjIR5m9PY4sBTYKjB74UmBvDoC2tVMTL%2FfvyEkt9776LfiT3yA%2FJfSH1FKogxGiKIKlGtJXlitzFh3po2XTxYoJeV6BAeNUoKzg7hTSe6e0HfjT27pKzzLLA9O0Ygx9Tkp849E1gbFJr%2FgEiIS22YAmsdRce%2BvcXh%2BEuEqC9HGi2HbdfHsVj2EKnrLtw5N%2FkC42axnJ%2FQIK1MA8HrVfYT15MQE2p3av77dIVOCIIjd2b0092JLwmJpeMgCZ3BTfKvYZkMVaL1bXj7GLozPgh8pbmcI9h%2FY6j5dNijJsLuhLcbXMQlb2KDDY4f%2FPBjqkAdpPY19UMwg1%2F7t4K%2B87n9HSXtYu3GKk%2FECpsZiY%2BONSPEhjAp8K8TZ%2B9RROV9%2F4yF9BV2MbXVbIwF1ln6vd8nN0oGg0UOeNwDSAnYvWDYOfjoWkJun437ZuNYchOzVEFipfoA8teP%2BV2muzs6R3KE5RK9qeA9sqABBWN6cqs2UkwVbGn0ZS%2BBHDKbuxVcf%2F%2BNduUg7wOQ%2BBZXpTlPMCxt86Gqg4&X-Amz-Signature=3fc0eea3ba8560a5eca759f61db4620f05a1ea91aa3ca42c4058e4304f93c125&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UYOW6TE7%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIATEaIExrDYv72O9BeDlba%2FoA3fUI5rq9M%2FL3snwMZOgAiEAl7FyYtpqniWNli3k5RBQBE9JH7gTdP9LhPV1YPG4JyoqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHmZYbdUfn7iv%2BllaircA1aOGJK%2FgbgW%2Fq3YHJy5F1C8%2B60gnPEFLt1n3dTXhR02pJng95B5N74HzLvB6aNwuENjLXhiBZNAQVX26G1VTyjnZ41bAeJwyyXKeBwVffEwlgvQs82ZEtRAjz7fN%2BaekjEu%2B4R04cbEnzKnHuUNtarW%2BpeyRy4sKCnb4fKCEq8GJI2a0kzBgZfwk0HKa1%2BAnq32exVkCzeLMyAdSG5uOPjuhTrE%2FDuv2Sw%2F0yJ45aBf1YTcrXEyywlFlE2d1QWf8oYcrJCkuGZ6E%2B63YVS%2FzpIaoFszqHkSKK1KQy6MwBgMVS2JpxbrmvauCTvEVwOnRyL05biA8UaYUjxYc81ZILWIYs3uaRfp8ynoAjT9MS%2BIQctW1XKdCCvWCTck%2B7UQ2voexfx2luZ6av%2BEpovL0%2FveNMQsgEScOBktUsiyQizz3P89ElCN9t4P2ndS1fhUDCdmOj2K4U0T1IafxGT0dCgL3XjqfSRtotTJQPbY9R6GPbEUAHAmbUC%2FnYscdZOiymsmK5gX7%2BmAN3XsGNpRFn3HtoqVMSLC5iOXIEDXsq%2BSh%2B4hz%2FVFjNXK2Jr4z%2By6j1XTmhoXKdQUWHOLSTOH6C510tgspa82HqZ8L8uo5MUFPtDpvHUxBpGFx0trMKLg%2F88GOqUBy0TRtsnQelDzNyK%2BoiDgW5h182dX8Rk4NFwvyFYEd3YxeHrNuLRiFlHoU9%2FFeMDgWNY%2FjKBbPgE6AG8ecVotEwPPBJ8YARTkXlrzvQf09WSZEWRvqROnmEeazi9pD3u9xXUMWIMhVFvIbb9xrN8HEOX%2FcmFsjilJArqm9J4eDc3NOoKGM8Xg6%2Fg7G%2BIOqhKeWsUI7fSKbjCT8j6cka6rQK6qohQn&X-Amz-Signature=8b9609eabfaf2aef0155211e3072511fd260cc2ab7f9ed7a66d29333d93022ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663CEPIO2Y%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIHttqAl97PQLcTeU8rkCiopMpBRxhpInekU%2FXqJ4FZnQAiANN92u5yQS1xTCAVMP%2FqSouB3dfYwgBOcTR2PkkUN2CiqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2BSI84GTMMW14hef3KtwD3jgpS1Yrcf4ZubSN0PuEEnp6niAlw%2B7GNUk1Dp9OXXbIjjuQxt4L3ZWL9A9BXdO0Xy1jhVKyYL8d7g1XC0Y4ui6z%2BBgJl4F6GcXc%2Fx%2BiOA8A9FyYs0v%2F1S43jGlcfYFUub8cHUqaF%2BqxdDMtFO6NKpZER2CkUVbiAGKnv%2F%2F3Nj8wpu5jU7tSnEtHLMyGG5O14qU%2B53jmPNBGhRT18oYLn1vSiyUkT7ZjRLoBEjy5PkOymUSaiW%2F997GqmJtQ%2FAJBUHhnOgVttz6h6bXgUVzJY5yRQNVndhB1WU9Q14gibkfARTae09Ko86IMg6FC%2FmJRg8aAaqJeE7iA6A9Y4mhcwPCXfGv%2FDgLYoecB0NqHsHYDnOvvktnniSHEiGR1FbgdVPwl0a%2FmPgL2Z%2B6O9Ib9991xI0nTDtFv%2Fx6CasGE8NAv2KDgM0vMDBxeD7ca4O4PkzsUd9566Sv%2BW6K9t8VabMjhHxZ3u68FdLHpv1W3WAK2SDXuA0EyrlwwVwlljOhkjKXG%2FbaT%2BjBv5iLzRxoI42HZza4qeHsgXBqa%2BVuq%2Be5%2FPzvxYVWQZXlzdVwUWixGZjVLvh7F6P8lksmqg%2FDeZp6%2BGozlhPyyOpdG4qjr9sZpDlKwO4CWWmgQyE8wuN%2F%2FzwY6pgEs8VFGIhHrKGEcxWGjuw8Rx9IiI%2BVO%2Buy3SsrGxjR9PVR9t%2B6sUmXDRaQEok0ZS8woEX09v3PQZ2AISEQlUNZ64pbUG0%2F396fVH8aZCiF4%2B2EX5Xq%2BCtONev84DcFw%2B6QPjwPoyIBZwBzVNNrtuLgmljHUhtI9gdqOgg0%2BuiG7fY07eOw%2BkYeHaDJjKZey6pdjGGsHseb4ujbC6Aj%2Fatkk3FWtkK%2Fk&X-Amz-Signature=997edd10ae83a7f600a4d9402d5c6c16a760d2a78ca9d2c92e3dfe26110baf1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SATGPOEN%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQClstRGjbL5xukVmaPVvaOFt7WCBYIUOuKmZn7Lrx5MPAIhAJuocNed8hCcO8qN1cTvRM56rfx80j0EHD5jKEAqkG6TKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzZIhGA%2Bxp%2BeZSwTA4q3ANEv9%2BwHVK9SzfWhd80%2BW8QXYVJohVB1Rn1uvIxvEAE0vQHI85uPII0gKBc%2FPaeewJoAoQ9xMh2V%2Fn5Uv5F8jiuejcc7UWwGxsLJyjaJwqpxz4jA57vE%2FGAYMwWt75Kn7M3mWLDmsTKKX%2F5Dn7BH%2FG8JWVw%2B5bxHr8XnQmEatHlB3wOchK1cVDU2qGXvRIsrUq1sGT63Fw7i6ozpR7kv%2BRa3BsfP0yzwseCPi5UHOc%2BxguzpbY7uMeOPgMYge3Md55y%2BHof1zBc1Ig6SzM7y9cwUczDsw37gbARmLecXNuAHLqiL5KSFq4ulG6RLKk0C7JtL%2BDEoESsYyH6jE1ggsuQQewPG2h1YgNfg28m4JNoTewCI12LJntOvYuwuMHldmb%2BkEc00p%2Fqw9W2XOS%2B3cQlqAaOl4%2FiV6V5Bu524BuGjefQApX%2Bef%2F72NxT9rdi58zeF624ro5J77pcwvb1dzrFV6BleqhGm%2Fi8T05d7kHh5vSGHM%2F4sCFZzOCoVGXcmSHrFRog3q0BZKyuX%2FCnNQX%2BxWcDoNNWPymvlXtqN8ZfEj1YUgy4SYnRnn5rneFDw0%2BxnFMyEoQRtojLXuqhc3LTYzOdN09OvJ%2B8TVs4EjNCAXBSFN97u70586RTBTDW3%2F%2FPBjqkARiNIyDnJ4KxeNevOKwjb0lXeLYnqDnWp9JBDFobOHkNC4cfDF0Qgkct3VVlaQhEqB31BzCzkq%2BEfk3M6tysBH3eZYZglWT6Ln3GoIXxrbxOK4i3IQNuduppzQYVUNYI%2BMi56aSo1YLWKV9%2FUEZEmJPzaBTIfpSChl4JLYQjt3VkXuD1WxySKaP%2B0kmLuHQW5DMccvfs6dyhIo0b%2BBti7%2Fj9xzUM&X-Amz-Signature=78441d822e4109e508b7ae2ca0c65b7c67ff49210b6c4b6b9b95f626ba39d609&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RAUWUBUU%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIF9vAbfAmayJZphkV%2FumE8Qs%2FIiCySmoY%2B8gw5rRnTEzAiEApMLtkmfAhby0EBneZA%2FWgUHKjSTvaJnl88IeNTQxKwcqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJOxPm7xV%2FCggADWOCrcA1slYz%2Fvlh4UyjhlqTWslVOTdfVUONBjEqWU6Vot3ZUpj4zIpaeqb3q2UVhsQUtuW%2F4IIM1HI6fSDM6ZSyxo2lS4iq6WVrOAHq9J%2Fj7txLPyl3TGCdiCnVzmW4IIiQGhytFIhOgeNqe2mS%2BNC7d7Oc8AvVhLnO27coG2s1XegWQwUPv0M0mnvyZPwvCsKu28d6Qdu61ovCS1IBGDpBPzTgzytlCfcREy6BvPtlp7PEFS%2Byma%2BF%2FEty%2BDt7mFyXMuLpMY2iPT7RHDjj1J3Coy3UPWrwwTY2PvSrd6lV3nkBKSPtcjRnXsU5riI6KqWYLiiVonjJz0IAebELvFV28VR22zWKJ%2BbZY6ZmxoU0yuZCEmyGegVHNIEWRaD1Mj7pbLM1JXizmnJDgNvYtekqeOqjq9yuqgS4%2BfwpMjwOfiaeHslYY0iCZb8%2F6%2FqJORmMfpK8oT9llO%2BT7oLBouwWJo8DJP%2B0SczCgvBCe2rjzglJGNFFGpG4bzJ4GP9CDBsygrsZ8KzUWwPAz60m7rgi9MZbSGwRdcUPBpDmPQsNpPwL8mZv1gG0eB%2BPKUE9w8ML8iHfj%2FcdDdQr8txUDlQ239X1L8RIU%2BEg8sjW98DD31KU7mcmtPlVLds7wGbO5%2BMNjf%2F88GOqUBmQfk3MMTwHy2NG8mJunD1X8oMyXmL%2FcctvmSNxBMCUDCuYbq%2FEFZfXXlW3u3T%2FNimn53eaYLqJA2wT6bK5%2FuYmwNu2UF1%2BBjZdH57cFAWml0%2F5s6ZckQtN1e2WkCBVufdPUaMLl%2FMvoXzXFXJrVLzicuxxExVLeu6pPlegCgP6VgLMq1DRXRHt5r9vw6JonA%2Fe1dd0VfjtnZNye3WpUYUrgkSW84&X-Amz-Signature=092409aa1255515d50601eb9f52f5ae56579d6b26c7857638bba23eaf122bcfa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCAZPXF5%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDDgjG7ilqSCntrNln%2Bk0ngWDevpfzm6QgLRSCaVpwI7wIgAQ3Be4PbyGe%2Brm4KZ4jTaOahlZ%2FgZ9koUVkMUj25jDUqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL26R5KBKhALWokrXCrcA2%2FPKAkGtyhfAYt3JjTKhfrSNxD71qTUAu%2Bp%2Bm4jUzz5KIEjcV2CjT0llXVFvPYDpQZSILYkka2JmnKa7ctEulYBfy%2F9SgwPGFERkl8Arvr%2FIOfzn66lt9pX6WhmWsz9JOW6grM95iwDVU27Ur52C2B1SdAVTax7JQWoBeFY045khYu97Dz80wgdtjaDYNgpBKgtg%2FlAdzSh8SVtrlUG7guOnjG3WJppraXwujiO1ogUsTolJ1D0OWFvdzawuv1K%2FBrEO%2FzifOpS%2B4AdImgBYco0qiZCjEJqkria6IdfoyZ7lVjGuHIGEZ3eMr1vDSfSXv1YDz%2FBRRBCL3TGSm9fZZM%2BCjRbbfTa1uvr2zJC2Yw4%2F2F53i1biGBM%2FIOa1uyYi1LNtfN1L2vzFX4PLvdvhJ%2BpvR86r%2ByY4xoni3AyEH%2FZCRe%2FggkcgxzdSE12cVPcz7ATdFzu0tJ8nKYtTHqR1NsjOOgjREmzfisYU7yFyFOKUdij09NZymnKl3ZLE%2BY4LHH0y9391u7dpqP%2BX0%2BjDIN81HeyAxr%2FTJOjbv9nAz7q7awIdQawgruWkxxS52G4FbbZYq8IdtOWr0FCIM0jfHBgmP896rAYHF6658rplrir7ZrrpIutXLGWZJ%2FBMPLe%2F88GOqUBOt%2BhAuljS%2B11A3S16nQH45g%2FCs7651sduNlIvKUI%2F7BeM98ix3m7%2FqYrTE9peG0GL%2BS3uc3PGp8DuMu4zpyIXzFoR155r51y7emEwMBroD4p8QK%2FlLndd4VyrhHBD%2BST%2BsofQ1xf1wdWriQt7ejgfRLfHYbI3H2oG94s2VBB0L8%2BML0i0dZbfG11qbtW%2FUmRWCUjnVwaturQGolENHyJkXX%2FLibw&X-Amz-Signature=defa547319c154e082e5755faa01ac33089a049fabb9136792d601082da2db63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666OVIBC5D%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQC9qiWlB5bYAN3um3Ps8Waoq5otYCrzJx%2BbOrUSCJzHCQIgBO4Zie8XV6ULrW%2BZqKNY%2Ba4IhRxZH38s2ncnmwhaMyYqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHCId7X%2FzHaS7gLU9yrcA4JM5N5ySsd%2FPWw498xDJ2l7DL2tR93rQ0B0bYrsPhCjnaLL4J60JXuhoqtFjeMv9ZRfzHdBCq0Q78hru5JP5HDNSx%2B2rzBfaM7HntCI5x4T4Hal3O%2BO0uG75Aj6GE%2B0f209HRUx5CL0jcurNTDAe4a%2BkPKOVVZwcYIa4pnqDG7MHlXMJ40XL9sMAl7uPxzE8e9BosiYu0oRIbjmhKBPQGGrgc%2FLe7ljB6bKUQfWHhVK3exHLPxv7AgM8hCGhZwcDrXVSzAMKlmaksLU8eGEvAQs6UdVopvK3x5o6NxiljaekCywaMK9QXLyG6C6WMq5sPq%2FmS1GxorIFLMYe%2FJHez2s6cncxTOt5prOAsq5x2ZBicGdT7LlTXDT%2F6Sf%2BGurqPsdYmBroWZTsap7luN6cBUyA6WK7VKUUoIICxDFGU2sThHREbfvBXSbZj%2Fijy5Q6Cj%2F5yoHzWr2l20zxUNugaSaE%2B53pURjSWG%2FNQ16NdtPlyX9M2xblwnvm9k%2FDAuZQmLYXEmygUjVaP62EOM6%2BqrF1iU8Uf5edspcxnOMeMvK6PW%2F%2F69XkxZBB4CC2ETnUNrZBwpZ%2F7t02egqscoCkl1V8TsAUEQ%2Bq8s%2FZKGlNrHhYwbhgGfMhgKfB9AMMKjf%2F88GOqUB9mPoxAwuMERlFJSk%2F59wU2mf6uFEgY1uezYWy4Ydw%2BNyvbHbELJFma3ZGIRb3crAh86NFru56ncOa8c3tKSc5HZVl4YDwVbP5hDfcsqbL3hCr%2F%2BcLEE%2BaQKZilx4yDuests7WU6ABN7rSCSFd5xamtDgH73u8rH7YSWJA1bzCbEUHKnOvD8Soiqc4AujqeIEyIg98p9tmYoHcVqaruDPjOFi09wS&X-Amz-Signature=e77bbe1c38542753bd241aea96fa85b714818d98bf8a6d6f1fb667c21957718b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WP2KNZFI%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041431Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDFPlNfTSgZZ5cxwwVNn4xwFdMVvTEm1ljFRo5%2B%2FQLR7QIgLxdiLBWWJkjCIZ9KfeScElzHfsN6paA7JSiwxO6%2BHwUqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAlr0ewILJ%2Fa9MagyyrcA5BUH7QFoEF%2BGIicv0G6RkM6gnsFTeBNbv5JteNkpHHCYm2dm1BPRbkZNR9wGH51V8ViANI2AINQQHK%2BtHpRxb2fI23yuOEr%2BDWTBZaMWSxXHbb05zcHUt5sSEDSjRZ6wh9iKZWwHr7gJfRWP%2BAeQGe1R37GHcyCGkM8Kem0j1L1BMqcGAXgYjhW4W6Z0bA%2BqrazA7rllbR0Ic1Bn3jDO4ZjCNkYjKnF5fUgrTxDbQteS1gBM7nWXMaCbnuIfpLMs01fSGNcSHq%2FkVFhVs7hRVkdwZoncZYpDx0QHM9rhnTvkt5hdA1i449OLf9FXyV%2FJqa9BKSNjFlQsBuYN84Jga3zsrhdv8W%2FWNmyUk1QPjqcRAiRHNWkm01cTfIIYpL%2FC4EtMS1e35Vte3gedUHVy2adHzRMfox7NoBBnGd4BlB2ZNFZFVLVoBHrZZB4m3HzrXi345YatrbUYab6nKJtkFOr89SM6htDTDU%2F01u%2BZImaHf7VUQF2%2FfxI27RHuJt2MaukvVCwIlCRA%2FlTHOU%2FJtck1mbHx4c8v3kOmrHIHQPIYP6qOmF29%2FeFtAu8aEWWF0GImeGsA6piSxhOx21Njn7irEpQRKX6xOsyWv4bPwqPxPAPckeErRKN822hMNjf%2F88GOqUBsUflQE3CGDKiuZao5j6IUb7euQTJ0n%2F%2BTO5372guaNRtZkXkXkvsyXpTyJrZVD18a%2B1t7BJgo8z1xF5jOnqfGPyoO5i4u3kbNtXRUaa4cUrwNzyKiyyyyLlA2L2KcDhhBqutpd9MkDQ6sADqCoD56NCdagOQhbCdW1ugeXJwhA%2BosfVrlK0LsyPiFh3j4bkz%2FKKZrD8g2gU0gozOUDms5tXrH9ko&X-Amz-Signature=8a0245e3a537e235875b93e2093b16e301bf5acd979e3ebe67502b8126daa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WP2KNZFI%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041431Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDFPlNfTSgZZ5cxwwVNn4xwFdMVvTEm1ljFRo5%2B%2FQLR7QIgLxdiLBWWJkjCIZ9KfeScElzHfsN6paA7JSiwxO6%2BHwUqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAlr0ewILJ%2Fa9MagyyrcA5BUH7QFoEF%2BGIicv0G6RkM6gnsFTeBNbv5JteNkpHHCYm2dm1BPRbkZNR9wGH51V8ViANI2AINQQHK%2BtHpRxb2fI23yuOEr%2BDWTBZaMWSxXHbb05zcHUt5sSEDSjRZ6wh9iKZWwHr7gJfRWP%2BAeQGe1R37GHcyCGkM8Kem0j1L1BMqcGAXgYjhW4W6Z0bA%2BqrazA7rllbR0Ic1Bn3jDO4ZjCNkYjKnF5fUgrTxDbQteS1gBM7nWXMaCbnuIfpLMs01fSGNcSHq%2FkVFhVs7hRVkdwZoncZYpDx0QHM9rhnTvkt5hdA1i449OLf9FXyV%2FJqa9BKSNjFlQsBuYN84Jga3zsrhdv8W%2FWNmyUk1QPjqcRAiRHNWkm01cTfIIYpL%2FC4EtMS1e35Vte3gedUHVy2adHzRMfox7NoBBnGd4BlB2ZNFZFVLVoBHrZZB4m3HzrXi345YatrbUYab6nKJtkFOr89SM6htDTDU%2F01u%2BZImaHf7VUQF2%2FfxI27RHuJt2MaukvVCwIlCRA%2FlTHOU%2FJtck1mbHx4c8v3kOmrHIHQPIYP6qOmF29%2FeFtAu8aEWWF0GImeGsA6piSxhOx21Njn7irEpQRKX6xOsyWv4bPwqPxPAPckeErRKN822hMNjf%2F88GOqUBsUflQE3CGDKiuZao5j6IUb7euQTJ0n%2F%2BTO5372guaNRtZkXkXkvsyXpTyJrZVD18a%2B1t7BJgo8z1xF5jOnqfGPyoO5i4u3kbNtXRUaa4cUrwNzyKiyyyyLlA2L2KcDhhBqutpd9MkDQ6sADqCoD56NCdagOQhbCdW1ugeXJwhA%2BosfVrlK0LsyPiFh3j4bkz%2FKKZrD8g2gU0gozOUDms5tXrH9ko&X-Amz-Signature=9e0e56ed515af898a8290f57f4b31fbc1a9121ee3d0c09c7fe4269dae13609fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
