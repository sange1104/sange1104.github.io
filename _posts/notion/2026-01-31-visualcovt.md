---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [paper-review, vision-language]
tags: [mllm, vision-language]
---


[bookmark](https://wakalsprojectpage.github.io/covt-website/)


## Abstract

- VLM의 한계를 극복하기 위한 Chain-of-visual-thought (COVT)라는 새로운 프레임워크를 제안함
- 문제점: 기존 VLM은 언어적 추론에는 뛰어나지만, **공간적 추론이나 기하학적 인식과 같이 밀도 높은** **시각적 지각이 필요한 작업에서는 어려움을 겪음**
    - 시각적 정보를 <u>제한적인 텍스트 토큰</u>으로만 처리하려 하기 때문임
- 해결책: VLM이 단순히 단어로만 추론하는 것이 아니라, **연속적인 시각 토큰**을 통해 **시각적으로 사고할 수 있게 하는 COVT 프레임워크**를 도입함
    - 이 시각 토큰들은 2D 외형, 3D 기하학, 공간 배치, 가장자리 구조 등 **풍부한 시각적 신호**를 압축하여담고 있음
    - 약 20개의 적은 토큰 예산으로 **가벼운 비전 전문가 모델의 지식을 distill**해서 학습함
    - 추론 시에는 이 **연속적인 시각 토큰 공간에서 직접 사고**하며, 필요에 따라 이를 시각화하여 모델이 무엇을 보고 있는지 **해석할** 수 있음
- 성과: qwen2.5-vl, llava와 같은 강력한 vlm에 covt를 적용했을 때, 10개 이상의 다양한 perception 벤치마크에서 성능이 향상됨

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=53888799db177f5e4170b7462d71dfd1ae93dcb3fefe4fcfc326892bee69dc25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Introduction

- VLM의 성공 - 시각적 입력을 **언어 중심의 토큰 공간**으로 projection함
    - llm이 가진 강력한 구성력과 논리적 추론 능력을 그대로 상속받아 **자연어를 통한 멀티모달 상호작용**이 가능해졌음
- 텍스트 기반 추론의 한계
    - 기존의 텍스트 기반 cot는 논리/수학 문제에서는 효과적이지만, 시각적 추론에서는 근본적인 한계가 있음
    - 연속적인 시각 정보를 discrete한 텍스트 토큰으로 변환하는 과정에서 <u>세밀한 지각 정보가 손실</u>되기 때문임 - boundaries, layout, depth, geometry …
        - 현재 VLM은 perception이 많은 counting 등의 task는 어려워함
    - 텍스트로만 시각적 관계를 설명하게 하면, 오히려 모델의 시각적 추론 성능이 저하되는 현상이 발생하기도 함
        - qwen3-vl-thinking < qwen3-vl-instruct

        ⇒ **시각적 정보는 내재적으로 연속적이고 고차원인데, 현재 모델들은 language token을 통해서 추론을 하기 때문에 복잡한 인지 추론 능력이 떨어짐** 

- 기존 해결책
    - **외부 비전 도구**를 사용하는 방식 - **계산 비용이 높고 도구의 성능에 결과가 제한된다**는 단점이 잇음
    - 또는 사고 과정에서 이미지를 생성하거나 cropping할 수 있음
        - 이것도 역시 이미지를 text space에 project하는 방법임
    - 본 연구는 이러한 한계를 극복하기 위해, ‘_**vlm이 모든 것을 단어로 번역하지 않고 인간처럼 시각적으로 사고할 수는 없을까?’**_라는 질문을 던짐

    → 외부 도구 없이 <u>모델 내부에서 시각적 신호를 직접 처리</u>하는 COVT를 제안함

- 동작 원리
    - **연속적 시각 토큰**을 도입하여 VLM이 **시각적 단서 - 2D 외형, 3D 기하학, 공간 배치 등 -를 직접 추론**에 활용하도록 함
    - 학습 과정에서 모델은 **가벼운 시각 전문가 모델들의 지식을 distill**해서, 추론 과정 중 이 **시각 토큰들을 예측하고 생성**하도록 훈련됨
    - 전문가 모델 통합
        - task-oriented experts
            - SAM(객체 분할), DepthAnything(깊이), PIDINet(윤곽선)
            - prompt level에서 정렬
        - representation-based expert
            - DINO(의미적 특징)
            - feature space에서 정렬됨
        - 이해, 생성, 추론, 효율적 추론의 4단계 점진적 학습을 통해 모델이 시각적 사고를 익히도록 함
    - 추론 과정
        - 추론 시 모델은 텍스트 / 시각 토큰이 섞인 covt를 형성함
            - 의미론적으로 일관되고 perceptually 근거가 있는 답변을 생성하게 됨
        - 모델 내부에서 이 과정이 처리되지만, 필요하다면 **생성된 시각토큰을 디코더에 넣어서 이미지로 (마스크, 깊이 맵 등) 변환**할 수 있음
        - 이를 통해 사용자는 모델이 무엇을 보고 어떻게 생각했는지 눈으로 직접 확인할 수 있음
- 다양한 벤치마크에서 뛰어난 성능을 보였음
    - cv-bench, depth 관련 task 등
    - 압축된 시각적 사고가 더 정밀하고 근거 있는 멀티모달 지능을 가능하게 함을 증명함
- contribution 요약
    1. **연속적 시각 토큰을 통한 추론 프레임워크 covt 제안**
    2. **효과적인 시각 토큰 정렬 전략 및 4단계 학습 파이프라인 제안**
    3. 다양한 벤치마크에서의 **성능 향상** 및 **모델의 해석 가능성** 입증

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=fad289d2117b876593a5147df80e85344ff79f3fb49c9f6eb40f1730ccb9e202&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=c83d48a1045d6fdfde8751ebb27d4a340f3d29a19798a856d58028b7f457f64f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

1. **Tool-augmented reasoning**
    - VLM이 외부의 전문 시각 도구를 호출하여 문제를 해결하는 방식
    - 모델이 스스로 해결하기 어려운 시각적 작업을 외부의 전문 모델에 위임하여 처리함
    - 한계점
        - 외부 모델 실행하는 계산 비용
        - 사용하는 외부 도구의 성능에 따라 최종 성능이 종속됨
2. **Text space reasoning**
    - llm에서 큰 성공을 거둔 cot를 시각적 모달리티로 확장하려는 시도들
    - 이미지 → **캡션**으로 변환하거나, **텍스트 논리**를 통해 이미지를 해석하려고 함
    - 한계점
        - 연속적인 시각 정보를 discrete한 텍스트로 변환하는 과정에서 본질적으로 정보 손실
        - visual cot : 이미지에 대한 텍스트 해석에 의존하여 추론이 텍스트 공간에 한정됨
        - MCoT: 보조 이미지를 생성하거나 편집하여 추론하지만, 계산 비용이 많이 들고 유연성이 부족함
        - VChain: 이미지/텍스트를 번갈아서 사용하지만, 여전히 이미지를 텍스트 공간으로 projection하여 시각 정보가 손실됨
    - covt는 연속적인 “시각 토큰”을 사용하여 3d 인식 / 밀도 높은 시각 정보를 직접 추론에 활용함
3. **Latent space reasoning**
    - 텍스트와 같은 명시적인 토큰 대신, **모델 내부의 잠재 표현**을 사용하여 추론하는 방식
    - 복잡한 다단계 작업 시, 연속적인 latent 임베딩이 명시적인 텍스트 cot보다 효율적일 수 있다는 점에서 착안
    - coconut & ccot: llm에서 추론 과정을 연속적인 토큰으로 압축하여 효율성을 높임
    - aurora: depth, detection 신호의 잠재 표현 (vq-vae latents)를 사용해서 시각적 추론을 강화함
    - mirage: 시각적 추론을 위해 latent imagination을 활용함
    - covt는 이러한 연구들을 확장하여, **tool-use의 개념을 잠재 공간에 직접 내재화**했음
        - perceptual experts와 <u>정렬된 시각적 사고 토큰을 모델 내부에서 생성</u>하며 마치 도구를 쓴 것처럼 정밀하게 사고함

## Method


### **3.1. Preamble**

- 기존 VLM의 한계점
    1. Text-only cot는 error를 누적함 → <u>**초기 단계에서 오류가 발생하면 뒤로 갈수록 오류가 누적되는 문제**</u>
        - 최종적으로 틀린 결과를 도출하게 됨
        - 오류가 퍼지기 전에 시각 정보를 정확하게 포착할 수 있는 **짧고 효율적인 추론 방식**이 필요함
    2. 텍스트 중심 학습 신호의 한계
        - <u>**모델을 학습할 때 정답 supervision이 주로 텍스트로만 주어지는 것에 대한 문제**</u>
        - 텍스트 형식의 정답만 맞추면 되기 때문에, 이미지 내의 edge, depth, region 같은 낮은 수준의 세밀한 시각적 단서를 깊게 파악할 동기가 부족함
        - vlm 자체가 이미지에서 **정밀한 시각 정보를 추출하는 능력**을 갖춰야 하며, 이 정보는 추후 vision decoder를 통해 시각화될 수 있어야 함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=9cc04b62d5438469acb8691a3636b288938df3bbf8c3e27a56d77dd70b1f4643&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YT45XC6A%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043709Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIBNS8E8hiYAviQ7WbFYg9t4H68VQtdaraRX64R0v5KdFAiAcIRWB7RMpo1Icw%2Bm1ynYmL87qzbfm1CqS2ueKfjg6xCqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM6W9TvwZ5YcCqjQGYKtwDhs8IwWsRU0uNP3k8bHVpnAcRS%2BSgaMpi6NLdprIQBoJaFZ2iXaLHi5m4iyczTPmFTIj3n7svnKGRiMzsSAr%2BngBbeSeMMYMHIkmiwrYDwG%2BBxTgAZ%2F1a0u8zmgeate9bclPvsa0BZAx4lGQXJELDEI8EQoYzLafKzf3oMLq1lk%2BjMoOPMUz%2FLgfNFBqvSlTgZ86T%2BTTC6PdrEwZI%2ByM0%2F2hMOF49c64R7Nrh%2F1yFwgSbVZY9MRZcWrMshC5zEQfbCYtiYd449fZZuEzncKEu62gFIXGquYIiS2Ky09KNL91ItthZWgk0tLJMVJzJvo6QZw7zml%2By%2FwzOSpE%2BqCozepLrebVB7HmLN4m7nDdk9k3n2bjqvXtbhjIneoSV2jZKsmhtjPxgf2xw8KZKdIrNTj%2BDVfKU60HoBvQB5Ok4cx9D1msqtskQefyVUuQ3PMHoA5Qw6w6KbxwbFmg7ODRMi9OKNXk4P0CN%2FJiTzQubvlsbpoi2c3LMXCUEMxD420JGq7gWZAu%2FCx8kCrgRr%2B%2BEWUA9BdON73O%2Bknr9dHmunVF1EiqPt1AU8UWv7BriZqnizUm04PjmjKC8BHsCFSjucg6VJ0YBzLJUsN9Tg2ptxhIhZ0eL4adYkwnx5J4w99m00AY6pgE7P6v%2BHKHaqi6y1YVlpg%2B73ixKLehXAxhJjBZ%2FOFBmO4ZK11tvOP4W2c75qnGw4ShkGjJrcYPOqCPfuTZWepbUwnM%2FTlDDMceqZEnhpCD0WtTsZtGlRNDvpX8xrOqJnqcQ8P4zb0uWJOor6LQlDhe%2BbGYisYa6lkH6KMTXZMxPZ93rxyw05RpcpW%2Bvj6QJPjl%2FHiTepkb%2Fv832JHwA%2B8zmX%2FS4rGuc&X-Amz-Signature=86e567a4584400e477b4a9da6b35f573553ef2fc444807e3102bcc2f1f4829d6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 예측해야 할 토큰 y_i의 범위가 텍스트 뿐만 아니라 시각 토큰까지 포함하도록 확장
    - 답변을 생성하기 전에 <think> 태그를 열고, 그 안에서 시각적 사고를 수행함
        - 여기서 ‘이미지의 깊이 정보는…’이라고 생각하며 텍스트 대신 **압축된 시각 토큰**을 생성함
- **vision experts를 통한 knowledge distillation**
    - vlm이 생성한 시각 토큰이 **실제로 유의미한 시각 정보를 담으려면** supervision이 필요함
    - 이를 위해 4가지 가벼운 vision expert의 지식을 distill하여 학습함
        1. <u>**segmentation tokens - 객체 분할**</u>
            - SAM (segment anything model)
            - VLM이 생성한 8개의 토큰을 SAM 디코더에 넣으면 마스크 이미지가 복원되도록 학습함
        2. <u>**depth tokens - 깊이 인식**</u>
            - 픽셀 수준의 깊이 정보 (3d 공간 관계) 파악
            - DepthAnything v2
            - vlm이 생성한 4개의 토큰을 사용하여 depth map을 재구성하도록 학습함
        3. <u>**edge tokens - 구조 인식**</u>
            - 객체의 경계선 및 기하학적 구조 파악
            - PIDINet
            - 4개의 토큰을 사용해서 edge map을 그려내도록 학습
        4. <u>**DINO tokens - 의미 인식 (semantic)**</u>
            - 이미지의 의미론적 특징 파악
            - DINO v2
            - 생성된 4개의 토큰이 DINOv2가 추출한 패치 특징과 일치하도록 학습
- **추론과 시각화**
    - latent space 추론
        - 실제 사용 시에는 매번 이미지를 생성 x
        - 연속적인 시각 토큰 상태에서 바로 사고를 진행함
        - 이를 통해 계산 비용을 줄임
    - 해석 가능성
        - 필요하다면, 생성된 시각 토큰을 디코더에 통과시켜 사람이 볼 수 있는 이미지로 변환하여 보여줄 수 있음

### **3.3. CoVT tokens**

- **Token selection based on core perception ability**
    - <u>**token selection**</u>: covt 프레임워크가 어떤 종류의 시각적 능력을 학습할 것인가?
    - vlm의 핵심적인 지각 능력을 4가지로 분류하고, 각 능력에 맞는 전문가 모델을 선정해서 시각 토큰을 학습시킴
    1. **instance recognition**
        - 객체의 위치와 모양 파악
        - <u>**SAM**</u> → segmentation tokens
    2. **2d and 3d spatial relationship**
        - 픽셀 수준의 깊이 정보 파악
        - <u>**depthAnything v2**</u> → depth tokens
    3. **structure detection**
        - geometry-level details
        - 객체의 구조적 단서 및 경계선 감지
        - <u>**PIDINet**</u> → edge tokens
    4. **deep mining of semantic information**
        - 이미지의 의미론적 패치 표현 학습
        - <u>**DINO v2**</u> → DINO tokens
- **Tokens alignment based on granularity of visual models**
    - token alignment: vision experts와 어떻게 연결할 것인가?
    - 모든 vision 모델이 동일한 방식으로 작동하지 않기 때문에, 모델의 성격에 따라 2가지 다른 정렬 방식을 사용함
        - <u>**fine-grained task-oriented**</u>: SAM, DepthAnything, PIDINet
            - vlm이 생성한 시각 토큰을 프롬프트 공간으로 project해서 전문가 모델의 decoder와 정렬함
        - <u>**representation-based**</u>: DINO v2
            - 덜 세밀하지만 전반적인 특징을 담고 있음
            - feature space에서 전문가 모델의 encoder 출력값과 직접 정렬함

    ### (1) Segmentation tokens

    - 8개의 토큰 사용 → linear layer → cross attention → T_sam
        - T_sam은 SAM 디코더가 이해할 수 있는 프롬프트 형태
            - sam 디코더의 마스크 프롬프트 역할을 함
        - 입력: 8개의 T_sam, 이미지를 sam encoder에 넣은 이미지 임베딩
        - 출력: 8개의 예측 마스크 생성

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W74AVHAW%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIC6DlY7%2BndLvFrvsa%2BTv72VkVyJ9fYJ2NXCS%2BSZ3%2FIFkAiEA5QFR%2B33H4wtyKwgBxJoGvJUBH1gkbnmcJGkRniZZYf0qiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDlcXxUc2Oo%2F3R1JOSrcAzfPTnRS77A2P9qaVbinxc%2FVwi%2FzVFAQ8oVp3FZ5bQ6vt2VwAVSxQZEHQXJVod%2BvVi0kjIsF4BWxnRyzmjAD7qfIkLRfOr1EGHg6uvqr2inZGqQg%2B5uwtJZHormmMUFRac2FkdgeYD5j%2FGq7%2FCNryFWqjr1TcQYwEkATxsoduzjh17XbbYA1zrhKrqZkkEYNIN5qD8uHfCPtOFUMG7K%2B5bMBT58d9udibGNL8babXYvV4p%2F2%2BSg9AfmEWsOPZp3YhXC7QzP2oHY0i6aBm6gwlxbvDpNDloFdIOIAVc%2BuxV%2BVjY1awU3KOE50HmPMghcClRg5vJYxgNgRSxpTw%2FFXZ7t3VNPhiGqBaRcHHvhI%2FYtszJCnmjYsiOXLRotsexHGCIEPdO1Ne3R5F3FIp9mfx1mpq21CbnYuAewPfKT5rhJgBFEXUTsDq6iib%2B3JKJcTIF6TWA7406ndBk0asriNcq1J70wVuS73k2VFP7X%2FYtoMpC7%2F3jHorXg%2BS8YH04JomvIDNzgVTW5snRcSHq%2F3DENSmR8YnsN4DpX9min9YBJgmy88dEksnisNTx3u3WqVKllxt3Cm1vn3ZtcnYjHOQkGBlwqMxtWRSYqNR7Orvh3tEl0eVThEGu2boC0JMPfZtNAGOqUBEuqnMVDLQz2CIYeUDlL14ryGBoYiLH5PSm7POdNjuwg%2B2JylanZrskm282%2BlYXv6LiTaiEHKa5pFrjvGGx5SZmvoQNhgfpZmwF6M3QWWaPJTcl3y8pUXAJBZeSZCDtGlbbh4ajSUD5klHrp5Z62e0g4rgJVXs4bMA71DDWe6sn1GwhJ2I5IoYO0DVI0wbvd14m%2Fg9NPrHg2%2B4vf%2Bqmx%2FiDH3e4hU&X-Amz-Signature=ef826e64e956dd145b90cf4e273ebf48b29a4be2fbd5e362224b68c36b5b7be9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 예측한 마스크와 gt 마스크를 매칭 - dice loss, focal loss
        - gt 마스크: 풀로 sam을 돌려서 여러개의 마스크를 얻은 다음, 품질 높은 8개를 gt로 선정
        - 8개의 pair가 순서가 다를 수 있기 때문에 헝가리안 매칭 알고리즘을 사용
            - 8개의 예측값과 8개의 정답 사이의 모든 조합에 대해 비용을 계산
            - 전체 비용이 가장 적게 드는 최적의 1:1 짝꿍(Pair)을 찾아줌
            - ex. "예측 1번은 정답 3번이랑 짝, 예측 2번은 정답 5번이랑 짝..." 이런 식으로 매칭을 확정
    - loss function
        - **dice loss**: 마스크의 겹치는 영역 (iou)를 최소화
        - **focal loss**: 픽셀 단위의 분류 오차를 최소

    ### (2) Depth tokens

    - 4개의 토큰 → 4개의 프롬프트로 작동
    - depthanything 인코더에서 추출한 dense 피처와 batch matrix multiplication을 통해 depth map D를 재구성함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665G46WMXN%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHdLqvsAm4EsrOefYjf1yd2WJY4jShteMepI1hSM2qNsAiAmfN9Ax0blIbNl9vIzsXySh5NIixcOjHEohelNxLLm2CqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXDZ3v45LMaGiq9zVKtwDAjwxLFPUY9sf0uCUqxcGqEzMMEx37vAplmYpXmRTWSb0arJpENsWLH6CElzTSuwxq9EeTfjkOc7RJNw2tyI%2BBTak3Wey5Ps%2Ft4pBgGhRDQD72KnK2XdtH7MMy2LdzgIIG2d4%2FYiJoO7a4SYswrpPyWEtDb1L5tkADHp%2B5rUI1jOck6gBTQDqLNZoQzRI%2FiueWTtau9AN6nMO%2FyB5rZFCnZj2zyKWHKs5sLTts4f0GGS3Kz3na9avC88ADSqVMR2iXOlfG0hJ6UACx3d%2FtSFN62on%2B0M6SilqYDcVKiRHenzJaWPSGhpq5ObDVpg7f4Se%2F8FvMELmp4T4YD53oIUGyFVr%2F7ykODl8sOsEDybGd49lTY5wByWxJD41gis9nezhMcTBwDIQUGLY9eM6eYTciDODlgB9h3dCAebUmSfpeG2qrpiPfGaAxiYRz5s9hsNvvgSG05t%2B5k4JStS98RyswZfL%2BOuMzAxeNGIl2wYD5cOy%2FYHhsJDRHO219LIhb7EcFkgpdD44JWC8S%2BUcCuOnoHxfAXwBlzeJMGH5M1Txh001f%2BVrr1KPc8YeT7fyaVLXEt9xsgu6AsbNeWsoqbdkh6MzPpwbIRvNvRmQpYagi7PGcSJSBFLmuMWxSt0wy9u00AY6pgEkNo8hHlgJlinKKRNNLFbDPKlZ0E3y%2B%2BR4cOoycDVJ4DJSYiKbWyWWGbkVjM8akRrpWiL2hM7JJ4fz5YQP8CJDBZgRQp6Nxg%2FXijAReNQg%2FfnpzUKQhfkzRK5CPm0tB6fpztdOGDUXoBLxbDXChdF4oPHsqfDR085H4o4r98snKc%2B%2FazUsaLL4mmxla6iFsmIoEeXklXtF92PMCrw9Cs4qzdb1CP%2FA&X-Amz-Signature=ed0a11c535671f8437333936dedfeed306b53f880c5e80748cbc74e22b9ea63c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YEYIDTSE%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043713Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQDDdiQhLdyzNmXD2oJRbKddFQsqYG6AXdfQUdIXhleF4QIhAOkREveMFyjhVa%2FDXC7cR2DPO4Q3pzIvSUvj7IljxD9bKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxszsG%2B%2FW2bTyqxaNIq3AM1gHgfHhWIj6wdto8kakNHp716IV3ue2C%2BmTVqDg1fcH6RNcjmOh6IEuW4fB4Af4xxy6w3N87h8hh7Liap2KjGvqRiXpYboWNu6aY4JrdkRZyOG3N1uEjcD5V4%2BbzRfeX69k%2FbbSkuO%2BUv9z5VHE4b0BUkXQKOG2%2F%2F5m8aUyth%2BHgc3v4bpKgvhKmxeYCShB1mQGtSs3ycr4cXPXvpnE4BJZ8Uhmb5n%2BFrzDXUUWq9cuw5ebwHkOTRUezWqjKvv0pnjqccf9yu9plT%2Flg%2BuXpAlxsHplzvSvxVOJnkMQOG%2FPBwy4oR%2FUx4A8SckJyajT%2BPkiW0uCK5vruod4izZ0v7IdQdjxZzDKaEfKC8LL9mjGhtWCNr8X2VUqVCTuqvDeyrPieHG5OnZZ6fV4yVnVNqMMktf2RPICQng%2B1vDTax%2FHzi46VjR0RncScC5PgHy4WnXRbPAPeLe4L5SYjjWZjt2CYY10KhKPMWOfSKKn8hfb6y2vLXP%2BO5LtjKC8QrGUb90ze9onGJIoVwOeRoEE6QA1p3iErFc4aJbZwSLG7YlbSU%2F2jhvkYa5c309L%2BRwqxUyxodS8UL%2FP1IBYHmAAEn5X8r9ouYlkeDPTlu9oxc8zY75uVwDismQen5fTDq2rTQBjqkAcF1QDSxK2UYvQqQ%2BQjUwRI1BoYlLC7bDGqmwKaitrWLKtJepx0c35zoxazQIdBq566Lyhax043QHkJCYKjzaBb7OQ%2FhfL%2FOhIUEUaQT5oLRCidUV8cbeB%2Bq3IcVcVJ14%2FVmRzo7UMzvLMsnTaNLahjxzB18L0KHSNGuA5ixGi7VY0v5XnREi9oNvSIfm83H31py8YU6JnEENX8xFz0k1nxNGzOF&X-Amz-Signature=fa0a9f3799bc1e01e218cfc476426cd927606be410501a977460ea371c733a0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - **L1 reconstruction loss**를 통해서 최적화

    ### (3) Edge tokens

    - 생성된 4개의 토큰은 각각 PIDINet의 특징 맵에 적용되는 1x1 convolutional kernel로 활용됨
    - 토큰 자체가 필터 역할을 해서 edge map을 그려냄
    - 마찬가지로 4개의 edge map 평균을 예측 edge map으로 사용
    - 마찬가지로 **L1 reconstruction loss**를 통해서 최적화

    ### (4) DINO tokens

    - 4개의 토큰을 DINOv2가 추출한 patch level feature와 모양이 같아지도록 projection함
    - **mse loss**를 통해서 dino feature과 직접 같아지도록 학습함

### **3.4. CoVT Training**


**training loss**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=40272fb5d50243fe57d6a5a3e82de9a7fd557afa90fe1bc954ef1854ecbc0fbe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- ce loss: vlm이 텍스트를 올바르게 생성했는지 측정하는 기본 손실
- γ,λ : visual loss에 대한 하이퍼파라미터, 실험에서는 모두 1로 설정함

→ text도 잘 생성하고, visual token도 잘 생성하게 됨


**training data**

- 시각 토큰을 점진적으로 익히도록 4단계 커리큘럼을 도입함
- 갑자기 어려운 task을 시키면 기존 언어 능력을 까먹거나 학습이 불안정해지는 것을 방지하기 위함임
1. **이해 - comprehension stage**
    - 모델에게 시각 토큰의 기본적인 의미를 가르침
    - <image> 태그 바로 뒤에 시각 토큰을 삽입하여, 모델이 이미지 입력과 시각 토큰을 연관짓도록 함
    - 입력에 정답 gt visual 토큰을 넣어서 visual token에 대해 이해하도록
2. **생성 - generation stage**
    - 모델이 시각 토큰을 “정확하게 생성”하도록 학습
    - 질문과 답변을 수정해서 모델이 명시적으로 시각 토큰을 출력하도록 유도함
    - 질문-"이미지의 깊이 맵은 무엇인가?", 답변-`<depth tokens>`
3. **추론 - reasoning stage**
    - 시각 토큰을 사용해서 복잡한 문제를 풀도록 함
    - <think> 안에서 시각 토큰을 생성하고, 이를 근거로 최종 <answer>를 출력하는 전체 사고과정을 학습함
4. **효율적 추론 - efficient reasoning stage**
    - 모델이 고정된 패턴에 얽매이지 않고 유연하게 사고하도록 함
    - <u>시각 토큰의 일부 유형을 무작위로 제거하여 학습함</u>
    - ex. 어떨 때는 깊이 token 없이 seg token으로만 추론하도록..
    - 주어진 정보만으로 효율적으로 답을 찾는 법을 학습함
- 데이터셋
    - vision-centric data: llava-onevision 데이터셋 중 시각 중심 서브셋
    - spatial perception data: 공간 지각 능력을 키우기 위한 tallyqa (숫자 세기), ade20k-depth (깊이 인식)

## Experiments


**Experiment Details**

- 메인 베이스라인: qwen2.5-vl-7b
    - lora 사용 adaptation
    - rank 16, alpha 32
- learning rate: lora 5e-5, projection modeul 1e-5
- 학습 step
    - 1단계 (Comprehension): 4,000 steps
    - 2단계 (Generation): 3,000 steps
    - 3단계 (Reasoning): 3,000 steps
    - 4단계 (Efficient Reasoning): 5,000 steps
- a100 1장 or a6000 4장
- 배치 크기 4

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=c4764fb1fe5e3ed9564e5f338eceb37cd5bef21e4a2c71f9672a8f5be0e34bd7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


**Model Evaluation**

- 모든 평가는 VLMEvalKit를 통해서 평가되었음
    - VLMEvalKit: 오픈소스 평가 툴킷
- vision-centric benchmark
    - main 평가를 CV-Bench로 하였음
    - 하위 항목 중 count, depth, distance task를 중점적으로 보았음
    - **BLINK, RealWorldQA, MME-RealWorld:** 현실 세계의 복잡한 이미지 이해 능력 평가
    - **MMStar:** 이 벤치마크에서는 '대략적 인식(Coarse)', '세밀한 인식(Fine-grained)', '인스턴스 추론'과 같은 서브셋만 골라서 평가함
- non-vision-centric benchmark
    - 시각 능력만 키우다가 기존의 일반적인 언어 능력이나 지식을 까먹지 않았는지 확인
        - ocrbench, mme, wemath, hallusionBench 등

**Quantitative Results**

- 베이스라인 모델과의 비교
    - covt를 적용하니까 일관되게 성능이 높아짐
    - cvbench의 경우 5.5% 성능 향상
    - subtask의 경우 depth task에서는 무려 14% 성능이 향상됨
- 토큰 수가 많아질 수록 성능이 올라감
    - 1가지 token: seg
    - 3가지 token: seg + depth + dino
    - 4가지 token: seg + depth + dino + edge
        - 특히 depth, distnace 추론 능력이 극대화 됨
        - 각 토큰들이 서로 겹치는 정보를 주는게 아니라 상호 보완적인 정보를 제공하여 시너지를 냄
- 다른 베이스라인에도 적용해서 결과 봄- llava-v1.5-13b

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46645V3JJCK%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCICfS25KOpvRivc72bhvdI%2BTqHYedcPQcdIyVWDFYvaHbAiABtgMBnMfVq2inwpyYRtRmgVzqw9xc0H1BPlJnWgIw2SqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKbZX2c8Wbil3q1NZKtwD58uV8OHEwsUUm0LaOLbV2uAqHidc0AjE1r9fbqoChW52xae4zZRIMKwCtRO4t1ofKjibXbLw1kP3428i42tWR9x1VEymsQyeDbFsnnWV%2BGaN%2Fz%2F1kyjVf4jmL1l%2FBY6mgL4jNaBUEThTdxjibqky%2BnDcJ9EwFJM%2F5zGEwPv4QNTIShXhTWPxrkQ8R2mwzqotgPes92TSg%2FGAmE5PjxHwD6zhaIgzXhb3rt3VpZB9o84MMmyaiPjyLHAiGqjif46m914x1Dz3cZdkIUZp9O%2Bh%2BV8vLikMFfXwlMOKr%2Bb0sii%2F3h%2BnKizoV4UqMbH91hyGaTWakECRt0mDF2R27XlFZd7K6YC9fde2NqWYx7IWfCGjp9FEvGF2LU5ZlFmTIvKTRc7ZFf5%2FDadIA1FODWd%2Fx6bDQtbHgTMq7KQsbsNbztth%2FRYDgKVYBq%2FFj2EqkNX4yoqmGBfxVIkA6ZFLFzG1tIqL3Q4B4hOdmVRamKPoOPfQ768DvNhf2jJuBL1VQRXsqrS1q4OTsMb%2BrZDhPibtl1UbU7lrYnCvqXwsfbzHj64AXFx3d%2BXbhYMRXtyoD11u1W%2Ff8EL1WrfqbvacOOiQMV%2BuLSf0uObq8vsovNstdcmpao2cLXtbeqGl7yswwty00AY6pgFio%2FVp2Q3UFfa7QVRzpqV1Gm01jTsfz8R5EQ00CDKxYhyAUE7ibILtGol2SgXMl4BsPjljyNfAJ6zfnO7Cp8rMZXa%2BYH7riuqw2iMF1p55TzdN%2BzoTCb0d%2B0XytEYyFpHYVKpPEfedY4q2%2BrXdqieW6IA%2BTKOrFA5iC78aXsP0xMxdEuXTfOFdmN9KHg324M4FGCQdqWm%2FFsdkjBpGsjAlKtMLbIRt&X-Amz-Signature=cf078df23d96e5d8edecae69773f5fa5d69d7f95b19047e6b863b0e3a2f122d6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=cd5f44dbfc167f01f98fa3862e609d9fa17a76c6f90fe0ba8cac5facaeb988ed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YJI7YQMC%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIGTshWj8HY8Ueg5NZqulVboSWRpKO%2FUd4eisn0%2FWWkl0AiEAoBq6Q5P%2B%2Fvpo2lswtsivba3sq8x6w4FowRi80HzjzTYqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDORGpgjGkxQIxtNV5yrcA7nfj8oK29jTuK%2Bh2U4cUnsHjhk2xLzFpa2Xn3x1LbhuCNWRDG%2B%2FuZ%2F%2BE9cIBoXEBPyNd4%2FvqEWfugtgBLDm8Ncer09uKyN6TVKoUAH1ULHOPudox%2FbqSs5BS%2FV4TA28f5%2BqIAmvnOTccL%2BaDMOf2XUoFbRWzfxWZi%2B2fXyR9dJYmcHcHwerLXSCLpKBPtXF1vCLG27Tz5xdJALddVqVfvkzYsFI8j%2Beeu6G5xaCfd1GuizrPqAzhygGtgSf8O8r%2BTmiIURs3LZ5hUgkkhB4u4QrVp2T8%2FnCP%2Fj0bFOXKRad48f0z9xwbxBZYvZpa0XqzxHB2wOvGlnQz65t80zZtAOPwfogB9nXE9g8CxKa%2BV8xRHGDsLnzO8MPyZZ4yn4CLaA1rZevQPB0xWpr32f05s2rzWUph5R2b8pMHFSm2KgcwrHXY9KbAFf6RQ4E5XXMBex9aTzNGCb4fQjCvuuAceca2G3OP%2Byh%2FFzuRz%2Btj%2FJzyCPvMDzLcAyV1KU575Dm2w8U1HsFKQUueM0K2mPJdk5KmZI5sWlVmMVfxYB%2F8SEhT15MpC%2B3WQsMSIaCusCVaLMRExfDqmChooMfQsRPej%2FfpjjTlds7gcyQXspRwFfvO%2BThD6LpQ8XX1G1iMN%2FctNAGOqUBRRh7MozyAFMFV8iTo4I8SRikngZEr9%2Fl81vxLaEmAHQERhJ6aNntRnf5VqPWBz%2F25XEtPrjX9GPl55V5mDJj5NsXXEJpqYr%2BqruFwIPzDWT%2BDvxaV1hii6LMlUaiOPKXCic6iM3irDJFATmhonPLO9xztzcPpFVKqGfyaKnL7UNrpRJOZVFnEUQopceIfoXKM%2BYMJA4KWUgCZuF4RE61%2Bg2hI2y8&X-Amz-Signature=4f0e566379ee490ccc4a83220ddc1293f21f699e558a60335c4c3ef69aa8d72b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663DFXEOFL%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIDZtT0fNTb4wlQGN%2BCKxloQmpvLIj%2FT21F1kCjtFGRC8AiEA7z%2F%2FBvFjfu2TgH5zdDqKQ4u%2BSnTHvG7K70sfjogPsewqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNiJgVBHJYZQMtw9uircA2rgDNfKEnAlGL%2BYYcMyGiAfswCvpPOrWA8k%2F8wLGO%2BbnM9DjWmXZ0vU8Scvdzhd3oDoNL2cGCocykWEkhymx1%2BtAmKTx8HnRqtvwYeDrLyAP8JnqRPpOJCI90Z%2B7KJAqY1P8X2EU%2ByWhIES9GxkKqwfWhz%2FNsCaJomlU6IDFKTTtzqYRMj4OhGndCssvSrQbo9NAB%2BAZg1GrI8Z21ttKDHvzog2fLSa705MBnczkKLg%2FlzCbAezg%2B0rnIGw1raD0uNF0OGTYKKpoas15j3Qgi9SLP9qdpr6qvfb6D4VPi%2FPSjBlX0smOz1HRZJgQ9kP9%2B9%2FOzBmZBVQDnWi4VOSXiC03AsPf%2Bh9XSlTzb8RMfEyRz8PxFarICT3GMXcioPMA7nmH0W%2BkDapEiUokU8FwbSIE%2BctwNEvq1iR1billzc1lpH1GM46FoddFB%2B2JPzbllRwtRaYJlGhaJyRQ00Xbp95f1U0MRk%2Flaw%2B1Bq4OBgqYKzvIDeONWfKkzAbTwNoYe0t5zPoZKuMD9wRE6CAUIiGbV1DsFgCfSvkAlKzqmMNCm01ys0Tyvb%2BVixjy%2B%2FNtkn5%2FUvmIRYzrJDio2OdmhLKg%2Bgh67H3qHpqX1C2vsyPe4ZgI8cCyq39wmi3MLrctNAGOqUB9mD3XndXFOxPPm0fdbERoJDrD8pwH8P4iA5T0dSj0qWmYI%2BJTfsColu8A7DcpF0iTmXkgL6smyUZBm1mVRhiQWneI2sz5lnUneNS1u3pLmiDl0eft9yiDxzeAqTqEFLQ3%2FUdBZWAUEkB1tjbe666xAhkb%2BUksIo8xo9%2ByMP8NsJN4pxyJ6iRQxX6LLjKWchaGxzHvPG9eYPbnXrHVH70YAwL9%2Frk&X-Amz-Signature=181fcacce4380b862351b92f7bfd18eb31ec35de8f96a1e3dd3b55e7c097caf8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664LUI2U3%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQDr13U2quk%2B4cXXia1LHQ%2F%2BemEmYo441kA9aOu%2BR%2Fpv5wIhAPuZSudhbM0JUR5nRi%2Fyw9zBXmWN0gm2rSFC9%2BDvoQphKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyyiM30IiSFj2h5cssq3AP7I92RcocZ%2FjMoJnAQTtPstX0wzO5J%2Bbxgc1KFHXAcSvXxVUhFUdDyarqsQxWt5Ww49PHOlOpy17HMQ482iTUZuS6tG9z4KxfVEE%2FPAy6x3fDiOot90Nps%2Blp2SnTiljoq5sU2FdWjHJPN61FHwgnvYJbb9baay%2Bbi6Y9WkUhE7TZ%2BxocoI%2FZ%2BQ8s1RhT4kxvD0UP07T%2BspEztiq8PPcw70yhDqBlPjpYJt053PrL4IvJ7DneLxPvuD6m7sXQUQQPUy6C3syDYbZbdotb2a9Zv8HyBokB63HKOCUz5sO3KVbZHpiuILHxE%2F1jqvOYpAJG%2BxdLOk5buD%2FF3LvFBeUT4o%2BT8NO6kkVk3bGu5xZGbyEOL12xcIxVK%2Bhnf3gSuMyJLH4ggJaxwt4luTGpt1g%2B9aCTflmjG0pFFZneiiEaOfQpiJCa5XSPx6BAbzPPiS%2FkKTuRidZtU%2BRHONCTEyChEIdojudtCVVhqqoVs5QBlhsKfSjhN5Lljbbd5iv0FyiZ3Ff47Yo5BGwq7Q6dVarHXLBHZBZLzD1B957y5tRV6LBYuIsMHmLUaLYodc6o8M6einqUuCaads5ky77ZY0x77pscWK2iTevK4oEWMzZzvBE9A3miCnFkiuOA6FjCQ27TQBjqkAcefG%2FjEdVmwqza3QB0AinPzXLxuwlPeQOIplaOOoOahEHQplQH9yw5qtDJW9qbnMPF9azNKh322Pw%2FnIIDu7q0NVDKU9ZC37my2jQ7sDKT8G9fpdhk3U7kmZ3JWxseP5NCKD99uKbWL95hRt3ZEn1rky86HfSUQoLQyyCXDa%2BxWvmKfu4BjRwP0rkG%2BloLsVd1VSutb0%2FG5wkLIECP6VFteNDAg&X-Amz-Signature=061471691e2a14b8415f4f3b5d58bac72e5113a0fbda2d979e5f4a74338e90b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OQZ36GM%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCICqktMS7dbN6LzgWqPoUdfcic5z2R9zWhR8AwzjGLh33AiA%2FQVd6sYL9B97wMoArZGZF3xrruu26n8tZ9KQGK3xx5yqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKU5wXuB1VSEOsoMHKtwDuAfWuIQKCpoWE%2FkcyPee%2FIjpIDuBjGOhXIS4Eyx0uCTZe2In6qiOLWnqh4w4MaQ9KO3b4LCnTY5up%2BkglghNj9YYLCopc8HiX2%2B4N6%2FIulslLy%2B3wneanEJDD1l2Zizq0jNp%2B9xruMZWwnmjoQjYFJJ%2FOW1BNFgTsosLWreIOK3jJyx74hyl46WMz%2BoU76%2Fen6VJco8OGed%2BTqHxCd8aCSYwAsknCNLOfAxyyDUo7sNv7dMxszPYJXShbjBM9pEejqO8dqyPKmK2mtvlmJnoBhvT%2FUsGfSSDG8RrSPe%2FdElU3L2iPfGxNw%2BuWYFKecdTSbWMxHVmLEKXXjG5HSxk85ADHjwhV6E2Fh2uCvGjDXGlpt2FxkI2SmqcuX2GFXKbDBlVHkGksjqK8ePJOlxoXYX37g6Yy%2FY6PFdqw5jPCmjEjVzRdl427YsVc7cnPA6OTPmjOIKhHlOq%2BMZHD1VXdXK1oFVtqfBH0Gs6kTTgvtsY7ICoqvxDXlg%2Bua%2BO%2BKMCH8q3DYBE8rTLWnERi7Zm7U3H1GxHbU%2FHHEXEm%2FcPoVUUOfimv6c%2FDNyHRGH7jKYJsOE5SOXExw1mzpv1GZMTyWAvrcYWg1UFcrjDy%2B805ccB9F%2B%2BDg6z9FrMMGYwtdu00AY6pgFlSuKHzWYyK3UJMEXN4SxbKlOIGntgD4nl14DrcswKOYOJShSNRfHn%2BG%2Fz2qDONgmShoBKdlVa530gaTjFM%2BFom7Si5BMgJqhxBpXknXBCfrIHydrCUqHYfit%2F%2Ft6pxKXY4FlychXQJn0xFHDNjJDEAMSMEdYUrRcooLMMOmPoMyQPBZnl8Bi6ALMEdJ4b%2Bgr%2B6V32wTe9VzswhlbixeR8mUwalFxU&X-Amz-Signature=7e202bdb04eac8fb7b1e0dbdd9ed23bfeeb6fd60600b6045499de827a6dcec9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=03f599c6066cb4762c67e7c0e4b8b2a6716c2f41a5088437c835f9dfcb11d4eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXIKCPJ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIHBi65vN0PiRISGLwiWZJLNpI8oNQbK5Rjh8zTdkbfk6AiAqXkeUynjNHrWIsJSaBbe9VPiTTBm%2B2q7sIVBSW4hexyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXD5uPR1IF7bS0AzaKtwDI%2BfuWRYR6jNOrgHP8y2UgPPZEvmCBWBEAIIQWCf6s2KjpAB0BPjr%2BFgAjG9OPduZ%2BfSTWdGRxU7F0s8kCSbadEMJPan9dRMudMZBXZN8mbvXiNnnTH9gXeI1O3RcmVD3Gg2LbbULuFYZRUKGeux7URyQcmN7Y3%2FmBlS64nT6laFrSgbyfEQodLXebGkz7an8OzLptnGEawuU2pnek8hsghDC57EqEyKJr0yPvDNsXzLZTD4E3CoXTgOtxrxO4CpH24DfJbGnAQq5pKPFjsV2ME70nRzArUsDkxLc2sr1e75PcLq6HJKRdCfa3rd4NvsQxMewDfgqn3T1cVvMGWpjh8%2FWRhWZf33aOebEnkfxHONCuL47TBa0X1CxsOuQsCjBsEFgxWDyx1qYMUk6nrJFViST6BFNX%2BMfrTR14B0%2BRnNJ83X9tlS5WPlu59MEodR5%2FXVAyauOdnKZ2k3lbKXJqs11TTDOcpDBF2ZPOVklEuOIJK4pUK6WD3wwhcrS%2BuVRCNpB3963DPGCRQUDQaR9WVLwhz%2F48noGcJcrMGhzmANkTgxncn5TPY8%2BRq3gON9EjMnC7qszudNaZXXc%2FKXHJgwOzZcE4V7DxXeAVg%2FErszZYrRBR%2F7gJ0aMjlEwyty00AY6pgH1zhcRMStN1%2FhPIbhZotL9OUNrzyPaaLbgx1RbhZgsDgfqedtmedt4Ye1hBqRP9R84gZrT%2FV0EfdsWDYyF8jvv6YwHFr%2FQv7MsEEkMKFsyZ160NRqD14icVsGtXKm5yS%2Fj74SaU9otcjAHb7SvTVqgxjVb95c0JpQlSs36h1RxQ1eIOrQzMUaxVSol45DoXp49%2FXhG4wn56%2Bl3Jwnra1CQ%2BplLNfoW&X-Amz-Signature=adaae2afab9f98c05b728eec2e7abd04cf88f3ea85b9ce2b19d7b6b13069f16a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

