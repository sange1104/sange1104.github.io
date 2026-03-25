---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [paper-review]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=9c4791bb0eb79ea63c9a7ebc4702ebbd43365c03bf3583905f1e1f9869bcd17f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=562b7e16e55d0ea6fe748e36019ddebae004485433f3dd16097b4869d727b5c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=e5cce386b99e5f099cb04c91c41bca00ae7383d607d27e818b6cf9bbf3e102ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=efa13e88bf8205ac1351e6902b09d68b23b89e337c3762cd0b17ba4dd88d9352&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TGXNPRUR%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032015Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDzyWo1i3nwu%2Fe82FVsTZgoy8xXGd28fhZHyUSVI4bKZAiEAnl4PNZsACghhdBXiJntx5PxDYZPwVgCXw%2BHc39EKx1YqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFxOMFrSIdW3m55lqircA93TksdJ0w56R2An2MQ2sF1OFgloYEOYxlO3ymr1Vo%2BxmRGO4nbsl14lf8B5yH1xbEilGcI1M4%2F01%2FTJTAr1P6PpnvKrSSB%2FHpwmMxgkmZEEf5bwL8b2WeIksqPcBADlJ0seFJCtCO%2BDDS7LOmDflBtRc6ZcounG4uwvdFHTtFKcRI2CR2xrU3Ee2RxqeghqQFgMDkKRL79cCiDG6E23iO%2FH9U5X5DG%2Far1OSsj%2BB0z%2FKIJv9DE4vX%2Fr4IN6gsq2bnLK3sesJNBbXw5vzWroSh0bBfnlP71%2FAAEZp2YVnRagIv5ZiDw7C9onbcfSEt8qhic0E85udPPsgoXBG4yFEnGLZuV4Jamv4Uf0K9bx9IPOOypENd7NZ%2FGb%2F34NLtWr4NLWh%2FLd%2FvrlUxo02vJvOcMH0D70SAK9KJVCLQpn7pekmGGNTlg%2Bt24RCxCUOVkR1gEnUlktPfCR1rO3a74PLh1jcc%2B1ADOpWmoIYpKO%2F97BsREOk03%2FWiL%2FBmMNAGwr1194bIomAhJpSa3iR%2B45RnJPsGQin%2BbP91taJwKmO2lWxGMdJJclVEHs6qQFwOkLV2kVxI5bHKNbsjQQVxxifwkoGAEbShsjivxrB%2FVD5gDIg%2F9aX7wsE%2FfPYy9iMLOmjc4GOqUBYbRe6THAEhmqlt%2BszZypoV%2B6yA1BkMdW4uQI3tliR%2FwOMuEvL8ZTqmZLs3vHTSW7UfCAXUoSVPxAqnz2bgMpJVP3ULYdudqRMPem0mYFE%2FdMathX5eghPJTq0rwsg%2BWAeEcUnvg0pvxl2HBV7tS96ojyD90xPKKbUVqRbZHEzc32XtVVpT9j1BAe7tPnUzmCeKSotCV%2FEIeB16X70uKofAjtu%2Flx&X-Amz-Signature=a7faf35a9817707f6fb0568c7e2f7880a676291f34949027ec0de5eb977acbc1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R6RIYG4F%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDyvaPXL2KVlMXSPBdfogw1p0lmXDX9vBhm594wKi4dXAiEA5e79VAGw%2Bw483A08ZUm7FNsE2n0NUpE31867BwZ9q8EqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGDqYGIcUtNIL2urDSrcA%2BUUvY%2Fye9zHE4m0oEn7IIKIGidk7V7Y3OWi8CrIk8Y3sb1Phx67TXzUr8O%2FI73AmJlklBXD8t62He8Z%2Bl8l%2FbQMRZ7glltjK0ZAaVgqa0h5QdoLigoSm%2Fg8XQplUWVxzeyiXuCcsvwewlzFUdkWDaGPoPXQIznBAg6B6D49%2F%2F%2Bzhuwi8ccgvindMFhfn15rHwMbPUjSGFMcdBn61CyM%2B%2BehfPmoTfQ9urO8btNx27035w7e1N9e%2FDS2EI7x9XmWeuibv7ZEf%2BpLzLIN0YJaj4wLq9H65M1asOYggw7TCnha7SWGBw3iZ9TYc%2Fj45psMZe5KM%2BiLRTgvFZjZGa7iQ4MUEiWA%2FVLoPUncZnPUBRvOT5C1Yj3A%2BcTds%2Ff%2Bgji6b7F38beKH%2BoyKZC8Yt%2BHITAOET70auGR%2BjudcIGpya36eEflHru6wqDV9N1fEuWZJ8fghatOiH8g984rIYgTnSWpRtTW9hq6wYt67EMxcHJ6z0ZGbUf6UlchuZCFK5Iq75aBPMZnyQap8svpOhnpBh5Ogv7aEk8MgwItD0UcDEpQD%2Bg7i3MTpsOywCse849toYPWoAYuIDLyPoDTOtkfL%2BomOSx0C6NX0y33gO2ZtN7cP8YDk3pGxqs7r60GMPGljc4GOqUBT5XHVl0nWmfyaV4oxHI9LW9kyRPa18tx4hACag8g6%2BBtg1%2BFPi7LeF4LzrNGKaecXLD3Qdt%2F8ckFBkr0X1u1WwqHQmKA7ow3hVT4dFST2TI5rq8UlosBfoAKr%2FwX6LefgVUM%2Ba3Uo4jjCbtsOqgXwPhu1ZZWBGsE8e4kgfmDEmFo0F034h%2F0SpcoHO%2F8JEmbREOQow4EC4atyThp25Srg0c6qlAA&X-Amz-Signature=a3f0aff8ed925c6c9c9840a60a94a7fb00db4dbde8d48f48e121c45637695b33&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RFTYWIK3%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8bmtv9IFPLzrv58olwEmZpsRPWP8nrNc3eQkHkkgewQIgRQ5JjPXOT%2BZaE1zlX98QchnlpQB805f5GkEvlKs9ZKUqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDESPWRjK10vEVcK6WCrcA2pqwVyZP9PJvRBM5I5uT4Wk8lzS7AhGKXG%2BZKoAYIBmv0Wb2BYsYuUUsSfn0asBeb7j%2BPay9nzhLGJ4%2BdJ%2F8lL6omlGTUARa8YpNyAgHjjq6PWT8D3Nch9g6HWDRiYlQfKB3%2FC0%2BK%2FrInQ3cqNPB5buVDyzStUdj5IOIw14SHjD24UAKId1pvC5myOcVTToke0fwOdlLBrTI4znFffNc8zE08CImrY%2FpJoY86VjvKI3ZzjXH0tXl3t4Zkb5V7e6vILyqZALVpKBw%2BRkiS3lCAQ%2B3UYVYGQrau1Z4ExR9JQB1%2FJ1RKaVeJhl6KlHrzaHPlmDDQ9EAFXjsR3nYagebXo%2BZOg83XslvEFjgWwWlZ%2BB8ZBSTI5lPsDA2eJfJl0rFK8Yyrk%2FF3iKoDs9IUQsG6AUANNd7Qh9U91lpfJhGAo9uaY%2BY7n15LwUCgGYd7Hj5jhVhHvuYJf9YyweVubREHWLWz%2Bp0uHZpF5O1NRhy7B5nuJEixdg%2B9HcjaTNaaHEzZxnzmjoPRhKBhLBmhWoEIG1Bdmqxmc%2Bdf4zBse5dmnesOISOk35qMFRjEMu4iljv6Aj6BS1sniq6c1nRhpklNy4uYYhhbRhnMk0Dtq67xDRaYZSLGETmo58CnHNMMekjc4GOqUBSIAfU%2BXCs1lwIUuwwBOr9rD9WERW2FmMofojKiDWx65UbG9wsrRz%2B2zf7QEroeLqFgEUfrxvvEK0J8ANenqP2jnCVlQOzw48H%2BJixqiZtoBjzNiy0QJLQL0mdD%2FSfLUyzyunScqtiIhruvoefO0WYHgBDvJyU6DheQnQRj7SQN4cO72fcL2CymErlcZ8YVnu2TCCyvoVPRGhNTuo1a3RNv1CVnJl&X-Amz-Signature=5a8d60e7c63949e178ba37300e796e390463e0a4f3a1872ec58f4d21ccc22297&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664VDMQ5BG%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032029Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF4WlShc1k82qZMZhno9gUrLIhLfZBXXfeDi4%2BrZD8A3AiB5lfE3R9r6Yu%2BNGcoFxLYLAbBCoBKvt0XYQ392P71IIiqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIME6XbFQaw8BCVt%2BUmKtwDaDVmiPIgKEjA26XA8wFs5tulF%2BtRnYmVcTsWycH4FXRbVDJzWF8j1AMUGh3TDun5qQCJ30MhiXpQ97WzqIUw%2BoZK2Q%2B%2FrZyKpPS9wpgXuB%2F6hzXRnFugJWL0O0LB5lqFhRx25rHRdjqSkmvXNMH%2FiZmEra0RAQjcJsMBh%2BNquuUc2BcevZwCmfFaIdYUIOjMzBaWRMDDo0Su0FxPI7PkYvoeQK4lYZVGeYlFPpx7qUzjsqN6OOjatMkZ95IVhhvM9vClOTliA2IJensZaSNf0BonRsPgpi34mhRwRo8fwl2r9QOZwElUEl2kR4LVcwNwwvVq1d9cDhwrQU0P1PmbWPcsuqtAczlJES3%2BnRl3OZV4Qq1ammPG9Hee%2BPMzYAaTzZac5k3E09%2FNef5GxPRzt81TV1ybe6Fl4pbcug6lVhtvW8h5xXzndP7NkYSezJaBFuusjwRCNePqXfrSSOyHjuur9H8bMJaTeTQhEmgFZM2J0Bz3FqWuIUcUECZcxj%2BMgqST9FYUVu%2F63hzN%2Bm40jetGKPgqm07qeNjQdWgGG17kuSwcNPMpcCoE57hwjB2JQ%2BG9V1M%2FZl%2Fh1tdv53OICnAHvzuPwjvwqC8lr9ru%2BnbdFB3AvL%2BFgWWxeb8w%2FqSNzgY6pgEIbfjX9C59kwGtsGR%2BRtLq8QQcp%2Fnv6u0JZnVBFiiPc5Nqj3nzVZ6SH3oehIXCq9DpwKnkGt9r2BP3SkOXW4oKLVoHmjOePXJRU%2Fk5qfuSi1%2FJK0sSYXKXOWipf%2BsZNwRjWvAfxzHmlbVjDff4jFRCJyP5NuNSUjxfAFfgxmM2GKSklx6ded4iyf3waoG%2BOjPFyXWgd1Q%2FA4kf%2FBpu6227ghgdI3wU&X-Amz-Signature=cc706aaee03e470063031b2975d45948fd5c4d8083d914b1df086603553c1c35&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=ba9fd5af77585d5378bf888543ec3643fce8237c4f0929dd276a44f5676c1c93&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=67608fcc8fda36dfca2fdb38d1a0d36366b3eb4d4a16c27e5b68aecb49410e66&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665RGNN55K%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032037Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBppbVBmOWurRrpXn%2BeNuMeLxEvR0CBPbhk5SQKYcvANAiEA7Qfm02%2Bq5fBebmcPIN2%2F%2FhrJQLjHdfsl%2BDLHQjg3OKQqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEDyW2kq51gm7pN0rSrcAxVzpI7GP46uQs%2BQOkJ4jcLHsMRTKdyIIjT7xR2TJgYatYPj8n%2BOnwrz6BtSbhjx9mCVoJUvevEJ1UlFBWJfdcyeCTNC5IS3D%2B8LpJ3qIenXYab0m%2BUwcyhmCQ8ZQL3cJEsPHi9CGv3r7G7%2FDOLFhS20ugjGdA9vA6qAvehGjltoh7cNxeNdGJzhf2A%2BdBqwqxiCnpJVZ3LoHPZd%2BOUYW3fRaLGwQ3GPKJt4rEi65g95gNTqAQ443%2B%2B9EB3VKOCmzlPk4okGG6xR6bEIE1vZqIqdqQpVHo6eRntiWx%2FWIY3QcppmTrEi5Y1JfSyPTRzCVf4uywd4WkmVcyK8zXsWZhqQ0g9lS3Ux6URzq34iSjBI%2FrJNl8WC%2B0VHVbc1%2F1Mkfu0J0b64z3UrxooE8JKO9q8lHtJlD5XT60qUXHOnmWG1F004KNkCsw164b56Fl6edDIOp%2FXWSPGYqKZmQbtWeT1tAbvec20I1oNsiN2rURagcpNTmJvMtziKR8yMQ1RqKb7mnoWNo9NVwKeAnTZxQQ%2BNI3x9IObNi4JGIqPMSHEiAlL0WbOkH4GrZLDyz43sN1KJKJC9RMwrJgwKqPmJEcQSYs9FMPrCUIdQ1d1lRTJFcP62xMH72npd59mDMNykjc4GOqUB8E30h1huSWIlgXcwDUJnlJejvfpVlo8bjnzD2aJ%2FC9dMGLI8zjJancPrMFrw4SuC9KjtGjEiozVFq9RW1iJxcRpoa40ktOXQaDtTwS8YMuk2lc1CgMTl7fs76yBOhF6rgNF%2F7E%2Bup1DuZUu%2FUzyUnIK6rW9r8W%2B%2BNnWUgo6XAy3e7bMmbrUgrULaXzjjgVA4npYENSZa6Xt5RnhidXZ9Yx%2BbGOUa&X-Amz-Signature=774851f84db24485014e2525ed4ed0f9d075df8fd10e9062fde8917cdb62d7dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=a26d6127753b92e9cb4d494fda01753421d0ffb17b9115213795f8fdc569efda&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U4LNTN7V%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032037Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEA1tb5ve1YdvwAJU48dbqEo2rPcN6LuYtn1kSDPEwDEAiBRl%2Bx7rckotx4T%2FBPnuboUeX1mgjR%2FeWFbN0wMhT1pWiqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtww8pgxHhwxxbQ6tKtwDE7dVXqEt08qG1%2BSR6E%2FPGU1GKgFEx%2B2pqISOJvQJlodYNx6No%2Fs2Hd7%2BSGLDptLZpD65nwPoOPr8uvICtbjWau2y09DQ0tlFOfV65oPEDqxOTvCQqcH7ugeGbxKwwbHWNJYxTgFaAr3uJzn980TJLCrsuodX0ycq1dS%2BIn%2FpIigN4kS%2BiobaYOZ5ajXTHcMM1i5C5VR0Q20cqBPDUWabTs9y8QKX9Grd2mrmoT%2FqzkmT%2BtQlppbCT%2BDvV5sLS9xxBipGN1iKySdP5q7m%2BIEGZW8DNMcAHM4XKzhbXoAcOIAFQbiXBzqx4wdPiEKvcT3hfh%2BfuU%2B0emgA1BQzmavPtbaeQk3Xt3bKR8vvPE0sFl7z2%2FLdkJBLgICxATBP9heILUmpkCn3sKtRv1kCJ4xzfjplewkDl6Bu61aUMisUPLhU%2Bu7jmcfAbxupneA1UD1yjGwbnnPjnjGwttpXHiWq3KVQffyb9eyBIoj6DrOkKYUBjD6av60kq%2BngB5w1L4TUz%2Fb0uqmH4XmPRRKNGVKp4vzg9P5MaOgEzis92U6iOcLkWdYsoaDi66AbkdWO4Gaj5cy3f4Dt%2B3ygLXJefaFXAZGoFoXMZWZ2Rwsimy8FXEZByluvttg9NXSBb%2F4wyKWNzgY6pgEHMFq8aadcYNGmlF3HmuXI%2BxuVsfHKfHdeuHHmW7bjUuDdlzNRgxdjldIUHDMH0dpN9v5YasDpAtLLRF%2FmsNvQzzLcSHm%2F77cTkkOHzZwDyiISVbGPc%2Bb9J3RHMZWy4XRZSiScExOeu%2FNN%2FJkJY7Kqm6NR1O3%2BzgjjfGb9ulZu92W%2FEuqMZCXmKnthfqG8ewknBWXNgvw%2FFznImrWFricpJN5BD3jJ&X-Amz-Signature=3e7f1695ee75d0a71b81664dcf57d0c0df48aef1f5f5def4bfb9595d674528a3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662FOBDXV5%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032037Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEMelrIAGCRA4h%2B%2F%2BkP9ZYuF%2Fcm72CXlRl5KII%2F%2B4%2Fk5AiAbuzdYMQxbywATAM2zRzjDy1T2Ruj1erz2aEqTK93cDSqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYCF%2Bwuv7POQWUGg%2FKtwD7tNX%2F%2Fnn1npoGLYcR3cdSuRwUZejXO6832zSqpvnKAH7NkNCHmXcyPidUOXaUMk1r2jsAxLdc00znTxR74YK109%2F9N%2BUxGVaiVbCDePek0pHzr1NLtnggGmgtZoZjAHF2nXT5xRtiDRy8VsWNpS54S36woh6ccbXF%2FqV4Ma7YWMROiypW3R7JbSb0D%2Favd0wd8tTNFqAv7Jph2CcZRDB%2FEIjWXDj%2BtsyHBPupivlU40iDSJDLlNAa%2FYZ%2FlqAdt9s7kwXY%2BSA7qgJ9PR24bHX9JpMpitlkQBHxhYxEHSTSDeJulqLE6drQgi2X2ufMkPTev7Vojkv13MW9u8WpHNoiP50ZBtKTkBRRrURHxjolSS582gk%2FxT%2BuQU%2ByVfWK4%2B5DZSm51kwM64ghg8NyirB9oJV%2F3SPBikjddPzL1Gpu4VKZe8mdTTPPAu%2Ffub%2FxTSirCPIcgF3VcSE7sM8dgfMm2LD4fxkVBi6yImWpFhx8nBwrYHgypFcf9nzvAHO4wNrPlSPvHdj4nFOmcJLtxbIVw84i0J6%2FLr%2BS7rUKXcQAg%2BVns1%2Bq7AtX0hsWj7xp6021qy5bMYsGpoRi7KDSnfAFjKdM7llB%2B4GEZ7hE5ZMzH%2B5NmwuTNurjA3jjgQws6aNzgY6pgFTh%2FhJyikXqcn6tcu%2BkUJYxvsvBMYuOTJG2EJJXrjtmB7%2Fz%2Fmh2ybKg8%2BTpgqygHzt%2FGcJci9JM39WekfsLDMNiOiYXybG0BAiOAMOEcbxc618xYRLZKOsXOwY3UieBMrwzFMhnXrYbZEUKQwku3%2B3FvTLzapl1bvgFbazc6ok1fkES76jvVb4kwisf7J38PYV40pZazCFF8KorXezbo%2BHsEZW3iu1&X-Amz-Signature=7f37c313852e1abf6ba33ef1c93158e0ce770ab43df65a6dc75991d8ee51233c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SDKMXYN%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032039Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC5mxYdTTJ9sMT7USR%2FP7zAzQEg%2BNkvtmkluxDfElyvjwIgTmnrIrauO%2F99eO1Ld%2FCzc5f2NlU%2B%2F0gRdXgOW35axksqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIIlYwrH2x7%2FgRJYGircA3hAoIzhnnXeovN8qT71syiBVSqmZ6hnd0IFvInzitbHTB6tBKVsDp66fqU8xy4rAgrqEN4FCWDashkjSt6zjaxnPLCulKcYIBtxR2X0cbnvWwYvsuJ4%2BO8cR681%2FWSQR9zNyJnZBrdLbIoU%2FGheq8mLXkXmQacdej1rtwG2DUvtYOF1qzhG9fYBssfkmZMpkzoGD%2BGTX6BSimmFXoynDfjJolDZ0N7JQbJ0C2ICqFGj76Ryvnt9sSybXAcsluc5qLLBblKYZyFZPDsLJbeO11f5RxhDqjQ18ylXLevE5L0Bbn1oVtKvEG9nqCsDT%2FpOcZnPX5lBbxpTisZt%2FH05URWkGxiZ3Pja0rkHgE5QE0xLoZKzW3s0SUA9gKkNom0VdtrGhWer%2BpgphQ9xWjtx%2BIOTZjYFMKgkZVOXbqTKrm%2BHwL44zVz1Tj6wbMLUqe53Fq2Dfek4caJn7V4DwrYV%2Bp9%2F5g1xqvCgCR89ekJ0fz8%2BLpFsvCN%2FzeBptOvg%2BoWnxipMVXqtaoBMEwxMSBJj4bVQeM6bhs2QHYsTzcJKe5%2BNKBTiA219wUvgvg9ZxDTzu3jYm0yjpjLNonWruWBkFND6rXbSr3et%2B6UFxIsYHk91qR58oPFVaOWKaULFMNWljc4GOqUBIZw5lQKNXEMrmESI18jv0PV91KYAB9aL%2BPxtKHNEsGpbwsiscyN%2FApu7u0CknTpL4aS5xnP3QoyxLyjtch2QUm0OiZNMp5s1NEc2tK9GG57CCu8Q%2BYmklxswI59P%2B8t%2FW5jt%2B3NEaHl3Yu3CHBhiV9TnfhBGyVWv1BvFUmFyeLMNj3RIfTCv4E3YhPjPv%2BeI%2BK4OF41NsDm7TjIGBmka7vA%2FUfd%2F&X-Amz-Signature=1c4b7246797fe385f8335c0f142c8d4b13d228b9b5fc6db0e0b2d7d0b3805d94&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667QWJ4HLB%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T032039Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE3kaL8G1k53nPEQ5andWUnpFf98Tb5d8VkvWQGs4QWRAiEAkefv9n4HAE%2FNaihAr8cMmcmcXgajM%2BdJ%2FUccGWTQNHwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGjhRAOynsldDhFV7SrcA5pHvatF7xn%2BaEgVD5lvJkc%2BM5EQnPHVe5UmIovJ%2FHdgxIBiQhdsMyxjKXYJFCM%2BA3WdEJvL63x2xUnmUT9TdOir%2BCWGNj0ABVpKIRoOj1VDE8wP9tF%2Bb0W9ZReyZ3f1rUxBoVEO1uJ1KwDuqClgECnaZp5VuWbGglYjpIwtEiYqq6mn2c%2BJDxg6M8NVCbOxG5bVMyNijJ8OHuINy4VQpcerwPcAVhvEoyjzcOStG7fUfbEWkHSI5b%2BvoqpYDdT5EOG7NOvBY5H2fV%2FYgsDlIC7Jyo7jiP4CwWP2xTEeqKbrBtKfdOLnm2xIGEXLCW3tgIs%2BmQ%2BTM9nyAqOoBM%2BACWcQ0iDoGFxiZrIdiwKPDF9qCba%2FbTTx3Efv3PIDN3N%2Fwi%2BbtXO1omavCBZC83SVMHtqgIUQv6wmpE6PW94Bmig4YeAccqJP2xkgsxNq8lWdQZOCW8HAMx75yOEhllK%2F6CMdkOg86KwYuNkYT2btuWvrreG9qcI66DrMVKkO%2BaYDIrdIlJ19kfdhKQ%2FZ8q009k5FQ1q%2BNNgvlV8vQyyzEijQpf1FaQLtER573qtN0D3UFiqVEdUBF0pweLp8ljYB5Ijz8M7tvaUBYUS73SV8jj3rXe%2FPt%2FM3B9amDgpEMMukjc4GOqUBCkdGHvbOwuhyS4MOKMaZ5yVfIgmDRRiWEpLpc9OlGWSOHyMg203tJ7FYYhrQEsorEt92gEPuuDala9UZoa6TmlMwlvrpC%2BC9EVYQaTCQzz5EfcXpijkY%2FZyUJguO0ywwaXuPak6mPXnWMBUiQKp2hFRd%2B8SzKnaSC3MQ3fEYIrFZ5KWym3tTcxr8lqwCupLthg0smYZCROqUR0bYBUggZGgUFx8C&X-Amz-Signature=fb9cbbe82da25f5dafb9db28595f102990e7cc59f18d3dc6d67128debd8553ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=0a6aead4273ad9f5c4c3cdd62a65e415de24dcdb9cdf13bfe99be65ca603dd44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5ZFGYZE%2F20260325%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260325T031955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVNBZA4iSYJDWYcJyFkjb4Q23IR0jaQmIWfeGyumhRmQIgQhznu4VY1lcwqkVEPkzPz9Hle9M9yK3snxCM2CUtBQwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMckedhmMj4c%2BJflnircA26S0gTCfWTNytTm1ZOKIcNNq2LafsIaJlXMv0shW7DTTt7uVsWIuvnR5SwaBiXyby64ORDKF%2FnSCWxN0zz9U6N%2FaulUj2XFGN86tL671QwykcjBWwE0EU1wD0XRg4TrHViFu881OE4jtSxmAy%2FrADoc8C3edR8xOJF7%2BgGDNO4j1UBZ%2FHQ7IjDaP0ajOqOHG7NhYD6kmFIN91VPuKGgQfQRIVRQJ1Vyv%2Bz%2Bv2dKwY1j7rtBp4XDJtC2eF7LSwU9XaBRPh1Oep%2BOM5gmIBtpgU6XUS4FqXQm2X8GumfD8nJr31xG4kIi1keUjamVTthOcoo86juQAi3M%2BwsFCmPW0rLCfiD4%2FP%2BP6Ru4Z9HiLcDGO1PId8vyY0%2BhXk%2B13KxxZYguoercMgwVfy80RclVRcD1fC7nuepq7AgDLED8m0gIcLiW9tANEg7ZSN7TlAyuNUrPHkh8WPUpTqc1nARKtziZTyeRWk2WgRj%2FitcOK4iihysfCW3J%2BibI553zg%2B4t7wIwDr1Wo3trN%2Fjl25CMTmrxB5H1Ut4rI7opJvKwHglg%2BVk2n5h9obi24t37yDwPhC9G%2Fk5nUQtGUHiEu6MKoZOBgQwcqkFB7NRcsqvCblSZfF0oc%2FG8KbkVngxBMOekjc4GOqUBm266XR9TVe%2Bv5svxuRRSZVb4Di%2F4ssLpxFDoJLYYv3G3VwN4aYZuGHHoksAGacpKEEHE4KASv%2F6jt5beUrtvC45VglJtzJN9Ijm08svwo9Nba1cPBH93bqjCi6Q5KpAKvy3h0fJBBPeSZ7%2BChbjka%2BNNMwsYwHSFXQ8V9Dt6Yni2UBBxt91JjbcX7kYTGm5wlBLDWo5YS4WPtmc0PT4Ook09fNW4&X-Amz-Signature=d0b6b520f907c876351fe9db2969b3f7b62e0437cafc51d8a9a1aed869dfcbe0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

