---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [blog]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=7487dbcccb1e28362c2415f44a6bc891eabced99c7281e3b399af9d2d89cffa8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=80814ab61e5139a122004eb5b46beae23691147bf92eebbb944a97026d9c3c3d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=8e456acab682b91aee52f76daf1c203537bdc7b6dfd630d157895c86a3d4b2ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=1efd3e55f9f188f1f72e10ed6770b79b7cdc0ce24cc0ba33f37a967711f71884&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662O3RRFUD%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024804Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBLiJUtHh%2FZPZvgUETQHXB4E3apj5oOvKiKtEo7zwoY8AiEA4%2Bb4OL9KV9hgh%2BKA4JVMq6vjtwccRICnFsnuIvzCHc4qiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDe2oyKIH770wiAMQyrcA22Gm4LcRbRAovf03AnnKK4fbDSvfEQxXtW71JVEmYU0B5rpptkBHdF%2FUdnvsOrJOWo2NVsGJtzWc5Hjbp2%2BsDNGFHiXzPoIT5nkHkS2nrq8mH3BWhUsFmh7K3MFJVuiYKyAREu%2Fi8TbuXdz9sNqvH6wUNMbRt9kVa1SgL%2BWoEWCHajX1oYhToS%2BJS8jvVAp0Nxly6kdGLkzZtAnSsGD4C2KA%2BnF%2FkrqG42O4aSSA1Foi6oaowc1WQc3HyW3PR696Mp7oqTI%2B8KG1gQFJ24fP2JFyiHhZiDXYwN8vguCPSC%2FAVNoV3ABcffoAp7n68Kz%2BoWQTHpgUYmqc7OQjvn536r%2FkeAxVVogz3wctzhNi1VpuUNtXqCBLxpJR9HcBy418tVEZgMlDEJCtF9TQNZWItCJd4S9OAYGOIv3jmh6wLDTg6EQ2RAnDpTGsGHQWSgREfZd3xxKkYQBzbI7u10t%2FQxtUEshiBdz67wcBRuBLUFjh0tAARyQiRrRzPqL7W5aPRd2Jdrd2LALWxs1XZ112SdHHWJycFcxyD4zeAcLe4JvNgrDwXriGcSumRLij4Zd8II%2FbzJ0%2FDkb200K4z8Lj%2FItVEEBedpwlvZOb8bI%2FUNGN4tsG7uBtt2HC3w4MJy648wGOqUBZTGLuuN0PJrMMQtLFx0tc5pq4ztNIwk57HJ7OXJuYLp50FE8pdmA8rdgogNsyZI4FOKqhvzLtHPgn4bn7q%2F%2BqOFV0MVQaMXyTiQL2Yih3Ub7HBaE%2BUIRBGJ47nEClpdU2oEJ9ImSFtRynDxU2YCAZtUEFiaSQtswAObKQhpVwmSh62IC0qNvNsptORJeqWdXhzErcm%2FAAJ1gTWR4fzFnf3n94CNw&X-Amz-Signature=81545b6012b8abe5cd81646e041d71c8112103ff34f54807113929c79dd1164b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466242EIDTE%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024813Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC6vund0rFsu4cAJig3QxG2JRZ0t9mlxckLbTG6NdR7GgIhAOCllNuEI0Dk0o3i0xzfFw9%2FpefvIgN0d47acjhJk%2FVtKogECKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igws6CT0XCLm9cMIs70q3AOLtaJmb%2BwCZwO7MFclfJM6jxMCKZjfSWuVwfPE2hQbTXEs2jX%2Fh3dZjDtiDUjlbasXTe%2BeuLqbdG8GGNeUE76obO%2BQQRPQmzeawWo9uOYim39oCgvd6O%2FqIs36W7lbogIwA6gBv%2B9qyf9MGUaSUZTwfzGfs7X3lPNeEBEzYL2IbLvu1PyEbA3gp6wcND9w%2BrYdBE1yt13bYjSBBWbmYuyE0lw22tWDogcz0xhZ6ubyovss%2FJMLbNS8zdr%2F%2BMDgo93Fz7rp2CXGaPpw1vQ74%2FDoztKSwDJNlRYYRH%2BL4v7hZxKCS%2F0Kmk7J33NQ0UivV%2BXrxmnRX2csrOQE4xIuC5LnHFOspmeqi3KNzPT7kEOhTDIKTS9pWr6FYxxxEMCT9sBT4RWhvA7zT8b8iSiL31z5nsZ4OcydmLkYVb0xjnCE0DZsMO%2BYazI9O1S68dCYd8UEQxeQLV%2FJ2p12s6FA46Xf5O4wqZVq5xeKxNx9eenD39Vx69HkOReAmTxGzUMV2y4dyQv0SdSGrI4OT%2F%2Fkgrt33j76aOYUxwNT%2FGCzM%2B31gFtoQmQ6ME0MHvwlxAREZhqRxBSElI9NHKL1zvtWFsyBjYdiSRsiP1DWczL0XF7D5o9fjPpU7RWGc07d8jC%2Fv%2BPMBjqkAbPVwlD55XclwXo83irXXXeL9tlDs%2B4emS02llMx629eCSJRx8vMjWRWMka9BR8wXc4x2AIfVI%2BFpSQRMpzFFlWRzBc0QeHrT1jJ2ovdmWmY9WXIwET4IRM1DJ4oANTuc8X%2BElzlVlVjEJ7E0H%2B4vWICQIBxUUYvm%2FNnp2YVnC52leZVAyUt%2F2pVyZHHq18Pf7jShNERE%2B33l0CvlwamGN5PdDK3&X-Amz-Signature=30696e4a145f2488291a04cfc58c1d4b8781eb81a5aa2a2142dcd8e8587aa14c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665A52WK7H%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBKZyksWO3PYw8gYiyEH78hJCWdw67xBbZbC32hui%2BddAiBu%2Bq3oYXgAayZYVEoekRTwgnWJ4SE3l1y5cCdnGo9mVSqIBAig%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMIxd1hIb1FokUtofYKtwDtu120L8CgXzGVrWTWnlLkMillEPjeNZAE9uEZr792s%2BZnnFcj7Oid0GVq3V9N0ezK2Prn6WQhduFciCL1zRchuHnyJUmMo8dbnGzodoBundnCje34RpW7QUfq0so263MyXhp4jCkwCy4Kk5idRe9YefV%2B%2BDqcHkmyElyO3i38si5KP7a4jQHCtHrhhqp6Q%2FkMjxYfOfZRF4uqCh7YHq1wBC1gcgpGbb0%2FSKjrSnx08xrJcxzZNhuirsWz8urr%2BNbu7mZWubZnhhU8%2BYnZZ4778dwI2CQvb0RAtxMQr9fyw2nG2E64dgDXpafFcdEDIoC36YhSDd47gfujMIYH%2FLgNqHNFGdchact6IL6V3jcDgo18XfuGfsUtNhg5%2FtX1rVJGACJV0fmUISLOPc3gXcw84Vg3aX6Otr0I3brEI%2BcWMh61Z2gUhgUFPVgdVVugYlD9pL34DJxJMliXfpjNzpG1e7bPSc9a0Lf9lZjf2WTU8NQjs6BcWeic5c%2BlinDWzJmGp%2BPEu4PZqL7KOWspxjSHzH2brlB7aiMxI0Ex0tLdX2DQ%2FddSC8VGHBBT%2FnQfAQ47G0FVeN%2B998T3YkrAopTBOBbyJAj7GQh4CkeZXXbk2EKhfALD8jNGbdHkZAw48PjzAY6pgE06alGFzQxCk6z%2BSifLt4QHqjyUhOeMayREs4cUWuD%2F9NSjbdvrTnx1NFw0AgQpMN0xVK31edtiVcBdUc5laOMcaB8Hd2fUsJEQJUz9vMV5HpIsFvJWyNM5cb2wEGWmfKE2dTeDZ8oTtpTjKmDPSHp%2FcZPzxl5yh3L5BVFrpFw5I5Yn2RfSKuD36zYvvTe%2F6ZpvqJUgE12jRqiOW%2Bv%2BJpdZjnX8yGS&X-Amz-Signature=a545d660dfb7ee95c4b578ce672ebe332064c84b04006bb717085f325eb860ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673SWYN63%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAZAhXT753Sjmv9ZjB4VPci80jdDCD9WE6Ji7hs%2Fm5QDAiEA%2FvbsZD0pRqiwxgAsiEMppJPy6K6Vy2y4vfrShB%2BpaUIqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF2z4VjeO1UawY19uSrcAz3PBg8abTMdUEF9t7I6nbzqbI6KA6qkLo%2FhUUEVKC9eFWCKot6sXcPkEBifOjEl%2FCJsFOKdvo17gHk5P%2B%2BBmYubo%2Br%2FAnXy56WysmjPgf1FmjrhTutAMh%2BzYEvgpk0AgJJ7jEYScg6%2Bc7vvjYNzUpWYX3s5eFGYODGyGtUcPpPUfvDXNdMnmcLSkoltce8izkRMK4%2FYchcO7ihOOqsLiLRfZBT4W0YfcrM1VfFeiwDE98Z5L5GfWSCBdMi5DsvYi7xUtNwx%2Fl1Dv4fS%2F68AI0C4ulq2zdk6C5scoQnxKJgPWYvhclyILkQ%2BiTUVWy0AVc5acPhNzhS06pfHJXeDjhxLdIH2g352MvUTexO%2BgA9NpYS9g0DzmewSC1%2BGueuY%2FgLbcgyTSlcR268nSzY%2FYL4jECXRgvphRxEax2q8a%2BGLKsh2n0T9KlJYsXaO740wlvnNneCinByI0pruVgZTAJONikFQ4o2w6oernEY7Z%2FO0hwF%2FpaIT7K2ODrwq%2F%2B45h1ESXeYBa6aOYvZxj%2Bex18RtsLqOI6cc%2Fb%2FG8wtb7rvcdiCqrOsnKSQo9JLvXlULmVeVdKAv918qCYoBbIocAoo9UryXr%2Bc6QOn0Zm1yOPijRfSMVzurezPkWhBqML%2B848wGOqUBcfPusmOJExbqUCsWHJqWJUPxZQQousR5J6NbvP6qkOrZWMSZ5HLeeIW%2FaUpZHhVCl7%2B7Tr3OnIg6ywUBm2iNcjYgatNZT0J%2BjnZ3EoV8ctih49R%2FC%2FLd8fBJ23OYUy8ekJrgkNDW6%2FNrusTHFh3dFTBUA1%2Fxwhij8zI92LerAUb2YE2kwrs9pRGmOSml%2Bl%2F%2FD1JjxaOGtt%2Fz9kd6t4GmKklHHHM5&X-Amz-Signature=bc4e888f8a7837d811b293e116c386a146b8638af868414863433cc47c325c12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=c8e881335e18e89cca3a5cf6eb658b78275bb80cab2573b32c97518e3b8ab861&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024749Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=b775b47dd4a994c1701dcd2aff65ad5f81ade6eb2fc95ed1088781a777c1ea9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBCY2HP2%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024818Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDXUqKf0rlaLSodBM6PQ6Xro2giuJHze8hcWTp7hAafXAIgVYH7BoZKIm%2BZVNfMshHWFCE40UTe18XR6i3MofJL%2F%2FoqiAQIoP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJjKMGisSixX%2Fd6S1yrcAxi7LcuY%2Fpw7YwiHHAYG7k5VljbHipJOSxgdCkE7kKkkErDbTkG2fxEu0bLx8%2FiApn0FWD3jBNKsR17CsZGA7uiJNbmAX%2FtLr6DYq4gFsjOhDv7qvyJfkAnJTj4SiWeksVDyx7YwteLuzIphWc4x%2BOKkw7ODZW5mzQEPMWCzciUo6AFEsqJd0nJziDyfgpWc5gQDi5pT21VbEOzgqTqlvSeARFU%2BXrtiBMAjUc9C18NkaMjjgpaxiSo1zusUXewcDz59Sq%2BtydXqQ70YLLMZAIUppbJw%2FTPD4UzNzNvKK2B5nWctxMalYbWXVV%2B2Xm4C5Bue%2F66dI6wdregUkudOUNKKPorVqeZeYH95RN5%2FNA%2FBAQh5bNjhyFky6zaZPuHPkkXYH9QPkzvc5ZwOJrC7%2B6ilqrxf7VdDHXlcIdmgOhYF57vT4QWhhuKS9dYxmoKsWr69416bWBA5AQwDTjw5PfRfTMtOl2eXlyVGahR0dvS2U9Pm5%2Fge95X09HtNAdTMsZDNcrxQexYaicOURg26w0UNb6raxuYBJfeYkWz%2B1tUMlpKoGn9o%2Bg7meTa194bdMbmH6okJSjocpwy9QpNXZl1Ihn3VNii1Re6VOkXDaS6zQTvdvDLmsIZYQJQAMOfA48wGOqUBGIj8eqt97RP6iKjz92WAwYnGbqKWoRE%2F4enhEumUZZhNGhW6ebxwHwSD9a77F%2FA%2BDasDTgMhxkm41P6yeDWtPWwIm7VfvCvAVPkMe%2FACqGOA1KVfXJYNANCPiT2WYSslj2t9EYJZ3PXc0RnbZ4TRWCMiJbNT6Vz8nqc7PrgJvHWM7I9%2Bz3pepPGrRaayrK%2Bq6iQefU92mnXINQyU%2BkSD3cLexdRw&X-Amz-Signature=eba923a5ce1017d7fb4a7ddde5c405964cfceb3ba95bda93654dce3e9e450cf0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024749Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=53921bcdcc0d9f7377f15a107606398942cebf775931221609fc8cb8a3a5ebe5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOXSTIPH%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024819Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCbLiEG3LxG9Su4Xi32df0XVKbqY2AZE6z5tkGbceD%2FuwIgcNc9uXFBL9WnA6jNzzGS7Lx%2FtwJtZfNztDOkPve2PcMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE2MOzPe9golL27SyCrcA3Iz%2BuCV7leYCEDrAjbg4edIyds5IEGnPTGIJIPu1vSP68k%2BUBVlGfAISENp9oCjDmfgL2CXAM9U%2Fivc%2B0KK02RJfzM6Iwrsy4rfQqlkPkFP7bRQ8jhJVXHesQlUgNipDUhyT2VlghXfl137deSOCdo%2Bbfqfd3IT5rAsC7sfCyfBH%2BzbxiFbKqeHaYULoZw8f1wriMwRE9%2FvnApcAoJUT9uTjpPzmWNad8hW2JZppgTwvG2z%2FO3tr25uzd2YCXubrqmxnZVGVGZR2CPhT9biGrMUw24u8rgkmm%2F7VE%2Bxm%2B10mHudB021wpa%2B4e6knC0wbjH9anoCsKVPhKgYAt09zGa0ZWDAMJqscjot9G6ngBJQnMx6rQMK9K2ARJee6TyNnjrRJK4NdrfbFh5vkV%2BEoGYC9GlUxLP3BdATdaTiGKmcJmvkORy8SBPyL%2BuzYH1Mjn3jzjQWz2z99WS5c0HTNFioeVn%2BYPxc0uZtfhuh2Dc4PL8UtTYtXKpaAAZt6DBlxBGCmftG1T4SKh2kxyl44i1gvk6e7q4yL28XD1ZRRI8AKWpDCi3unoyfCfAl8yPJQw0An61vw%2F2fcED%2FjTAr7Y924fsMnr7%2BKd0P3VbtjSSropBs%2Fi3XP5pfA%2FJoMJi948wGOqUBYLy4pwJecrKNplZL56unyf15%2FwogkRG35F6WMh5ALTih4qLTWpIDiRUpMbX5cuOlQZozEO6oMLvHs3JpGNM4W7iF%2FQhZGZDQoTi3%2B7GvIkKhasc0F8GFleub6aatLr5%2BBBPLxWWOKaig%2F6P4o3s7k20MSHlEVXYV2R06tFaiDSWxqJbPmwfjDW3noR7Ea5GYMILKVghlqT6omTQqcvaFUMdh79nH&X-Amz-Signature=21c15be3d5149f5c4fec3c7b353de519ffa3b52fd162283e9dd57b0b0fe78fe5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VGWTWASP%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG9CIduRVlMAMRQCw2nE87nTf8g3J8yaBwwoIGRbLdE4AiEAlOlA44l8irGoxX1E0vZJ0cSvBxwmnYECt9mmNBlZCqwqiAQIoP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDrZl5uwK9f0%2F%2BnmMircAzOAwmd%2B1xPFO7b4eLBe1mm6UnlZvHH4O10cRbh7%2Bze12kmbZUZkuur9lwKnAtbyZiLCplpkLGAkHDvWyOQPBXa6kqi5fV13mA5lD8Na1ALgc0XYT2%2B%2Bg%2FTC1xybHFka8cO%2FodmHEDCBAbH11Z1jOP%2Fllwz7RUnlcyfnU%2Buae2%2F81yK74vzRzD9AlJzLa69QQOpgAikdBKoCoJFrLg9b2u%2FF3UmCUxv%2FO6o2xKRo6H256CdfP15I5aoBV3L%2FV2kgAUadrXDyENCql3av0lWVS2yaZfo8q5HkVUGy6V1ZBcC63HnXzv2moROF2IFY31Xt2I3gZF%2BooVQhOlG2rP%2Btkl9XIAVbb2nsrpyn5LcY%2FK6YbuYu7Lyjjfzy1VBy2AWyNC6gE%2BkKYrGogRZ2rqEGVukvfAxTrQnMsdYbyuZx9qUeLvP5B3Mei82uO27UHALiaWXuESj0ePemosDaZz%2FyrLBTz%2F164KaQjY5dpzPG8CnCbO5vrmJbfWk0FZv5a6WG9wLYs7TCo%2B%2BKcl1wci1G1lSWdqrx3WzYErOg8xmKgrMqfSOaCB1fVvUt2hMOYf%2BFRJQGyyweZbKz6Ze%2BS%2FseAlm0ZOQQ2GM1OiBaBGR6hFAtspvlhLWg0Gz0BuwTMPHB48wGOqUBVcL2odtSYVl%2BvfOTKeFE6%2Fd192XT7CgdbNs92Udj5V0ug0ikQMHQwEGLmK%2BvhqQTksP8Ff7LmRN5J6npo8r%2BZ1QybkIDYhPvmhZiu9vWj9jUHMHquwFiD9z6vaQHgIhtITh6%2BNpan7GlfrweDwmGZH11mpKyK%2BZlGRdituBOK4GzDe9wYH5PeM0Zl1myrYuXekfA40VEKQ%2BKS8TmrDGKQgBhYq85&X-Amz-Signature=26633186e292a5b9e6e523306f4d66f9f20c65c90863187c410e4714b35e8139&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XCPLM62F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024821Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDE8XX4rQm7KGyPf6wdJ7TBf0HsuD%2BsqqPsy5uguzH6CQIhAO6kLgJdsgz2QjeemR75KEzvXvXbFEVJxpDvAnp1XN1lKogECJ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy7E81ZYDaz%2B1%2Bq6RIq3AMCPQCRCYdD%2FWAoKA2Twv31gjnE8nGT8f0PYbYQ34U7rBUrJcb5pUj0QIKafQYBaE9na3TTF1isep7vX1VjKdPoeLQLtYuvxu0WOwRMKLjZoXexjnbsnoOwGtXpVyoVEkCPR2QK4CaxBJoXBvamp%2BV%2FFMF2OK%2FmhCqPypF9MlYlWeCR4RsadQrpfAR3qWa%2Fsbb4HjN8s8%2FF%2BK%2FWoU%2BJRywUToP6yZHdRnTsw5tZqgwutZc3jGNEeZPeFAodFOT4M6Sy4fDkCnapITj0nNjOR3G%2BPYBCdUC%2F9WnlibQQpTtAn1BsDdklRzOMU%2FzlKOF23dM%2FO7qQWRAfs5ZLbfF5aJCwtY49DZTdpOd%2Bg3I50OeGaqPs5XvcFA1w5rxB%2F6p7rkBA0%2FzQy6tEBll3jRjioq0HWFoFIcL9ehQyxmwYeyFzxpqJitc0mPAB74GEnh6xjU%2BsmoXkgBXgK%2FPFlE%2BcnDlSkjSL%2Bov5c0Kdg5ogfh%2FWWj1ftaHA1Or1OVScIDQiNhd2rr4dwJNDq8NfqxAbgFlsdSgy99sGi9rDgtN6xg6uSUKklzhuw7DPzOfHaispbNdPL%2B0SOaLKjk1wIW8BnuoY1FeFrzmqiTOjSp3qkk2AQr5IyskjGPKIfx9j%2BzDRuuPMBjqkAeuAkAaoTA2D0f%2BfkBgrjsjNmYuG5z5Hh%2FeqFcYYkdFoGrLQwgwkfZysDlfhkR3QfmQRSBLbjZoqPwepSH2mNGnX%2FFr2jwTZDXONZ%2BKl92SnMbJWKjf5AxVs3yeKY3pUxY4OSwcA%2Fet9oEmyk%2FWm78hLxmeqLP%2Fm1ULUo%2BhVqefDDerVCJ42KzXN2WBfT1yam%2Fy1%2F5QySUOpXdIev5TmNRmCg3Fy&X-Amz-Signature=d4f6b88c067b13d2f2be929b928b605e1bd9f13259f97c64c3fa3b619e74c053&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662RXLTMIK%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024821Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNW0qK4mrKxPAm5%2FpmkAr53oEsB0RsqLEuN87dc%2Bt2%2BAIhAPmbEFM4x2jQ%2BIw0OSdvlECPYy1yVyTg0%2BT9IDbyGSHjKogECJ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy3petA%2FWaanEYkFXAq3ANBhavbcHGYpj4%2B%2BKHb5xgX1HaseUtKXv5TQox2k8c0WbomeLZ%2BEf0a%2F7CO6jRopJ0JfqgHp%2FI4qMbR7OcJGn4smoA%2BpwTgrWvdYu%2F3Rw1BE4mArkkrqQw6g4H9Nf30yNVk9QpLh%2B5866R2IFuLdbGjQwwCyTg38DXv1HhJq%2F2dNp7sspdseB0bQylQ6T55lYi7ok9zkTw4SBIm0oZzmnonWQZB5lrVd0ZrPSKemdbNVpEDZjV7J%2FvZxyj32lX7uE7NQBkCZQRbUb5rQU4LMRuj5vtXaxpJmtsmQP%2B3X9JvjbxMG73VgQq86jsp%2BN%2B8WDlGNYMXH6GHnmzyeLTl4PTPeqjP5h8UVfTRZK8GT11ftL0h4oLg1q9As%2BwKiwXXa4oFruUuv%2FPMHOgayLTv%2BHnDcaa1jrqOaYIGfR4uFs2jV6HPFNJPUhgVfkdPaXczX7%2B4z3WBVsm2cIDqmVYUUnth5TzQVD9B8EbcBPW7hz5cb7luhzfCyyvpGSApJaflht0ZL8AU%2FbM%2F6J97OdlMbng9w9L6xIUaxPemY1Fq%2Fx%2FrEj%2FoPLU300UjQkyV%2B5e3GJ3PeuThYr4BJmSlPHBp6BB%2FDFnY2XZjMXu7egysLv5Uf9LB%2BzuotaEQWvtGZjDIt%2BPMBjqkAcikE5TuAZYxLY9H1823fwHrOGXUr%2BotOIfGqien1pYdSo%2B7dv%2B2zI8RzaU1p160LCkVGJP%2FQecL5jW1obmAeLH6Qiv1ftCvQJox9%2B5OjhIxdDMFReliJaPrLHKwveBpkotNP1t2Ak4Y%2BbosgIkHU3A5TyORjcRoeWyDlfxr2VaQ8LG1%2Ft7ZbZgiAoHQGrw7nAlJV3NfQIYGp9X2HvsOsOzq23e2&X-Amz-Signature=601b68c51aa940a5eade3c115edc393949e2d5508e2d88a373a726b15a1b735c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024749Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=2d35d0383bb83a19273248fb1227a97239cc68da9e89266c37315f3d8a1850cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466423UAB6F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024749Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDgAsXOJUKSyt%2Brp9bb3DyNcnHmPLXokIxMEtQCgKsWAIgEq8DJ%2F8iAZLTOjO9D56hLxXOMbAl%2FwHZbVxsUtqLVSMqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOe3btKHnuPoxHE3TCrcAznFLvyfvX1GmnHGbcexsnq1HoLZD6OpAElGXqW7q7JOEhOorSLmlvbbYY%2BUbiLnMNFSZZDSls7OM7Mx5GOHmvOgqkVba3xLPqmpPqzUL9NSLzR057pXCSNyGMa32sZ%2Blt8kWZwUDTRE%2BiWkCcTAdFZm7EUX9eaTVCBHQlUKbs7wqIDzxaodxJL53TX4mu3f9TzEbQorO3uhmV6cBTw24kwEhUsimbu0U6UkB98h4qAdFnqEcx9Gg%2FEn4bL3Qz2lOV%2BpxWsiIpeTmk0AuVZ1F5OBr1OER6jpMGLj9cPTuL0yFWAcNPSu2Y4NYEVVfm%2FWoIhfu%2FI4KSH3FrMsMA%2B0%2FZO6zA28hizJhfZl4IC3d438RnVj7cGjNwjtUU6eVVCNPLSwyqGIR1T52ElLDCSxBvOhYUY9ogXU1Xkf7%2FDs8htYdDm199Ws1SnMw%2BUhbRl8r%2FDkiH4wN8A0O2Sxr3qv5zVJmXca%2FlGFv4yKWevBF3YGrUis8ZZZG%2BjcMoRyWEbEdkDNiucck8742%2FWeX3t%2Bp7UwruNtT8UqpIQO0DrTSxvKDogd%2BQR%2FzbZb11izI6tP2TeJW%2F5vrrGPsw3Mc7KOrItBCPhktbMLrSPBxSJQzL1sF2S0W6froChwiVhHMOu748wGOqUBx0fhaLajkwTVkIiElxNxRNFBmR6%2F30bSzwZ%2FLi9AfsJHiaTkLOnkoQvIhiEpDhW0deu1nXFttg8mekmjiak96DtKwX7wWpmw7lScHDMnJori%2FdKp1tb9tPee8uLZ6Y%2Bjd3L8lgMkvLAgoDnLr1tBubMAuzzLFIY0WkE6eZXw%2F7Ybmn1YcFoBcWtgWe67sZBfmQcuZ925mSRw%2FziU8yjsEg2KbSex&X-Amz-Signature=b9edb08f1d3f65309d067c6d99373f40399a46c2ff2e2a273539fcdaadc03753&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

