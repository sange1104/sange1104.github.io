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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=a51ae7038c85fb09ab4eac78a05e04052680f30993300aab0e5b8847719ac3ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=fa2083bd157d3939751cdb8c07a4841653b9659fd4ba5779dd882b57b725c451&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=58e45a7d4cd388d72f3f6258fb9d0b8708622e35a79ca1894d6fe9565f4749a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=3b309bedec8d20eea996c39b9f433fefc3380a2ef420a386bbb79e2c79d1d656&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZU5ASES%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIHhHjJZLRgBNMYH3Bl3VAheiHj5Gxo53aHG0Ew99eRMTAiBle4Sye6Xc762AH%2F%2B5MDowfXDa2dZ7dwUWmIP2al3LYir%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMO8tmzzIJJYo0zD5sKtwDPWlvpE05jMSQtWb6rdGMWYiJMSiOS2AZUMucv5LD7aP%2FTkSGYdwMmOHsZGjGc4aeJpgkgdkZZsJbPX%2Fyjt%2FZo6SgJzdazvZW2oPcYOHulyOnfqhygI8w7%2BpWclCyxnPwZmpJAGhF5w2kAnDqvjdw7mRGDVBHOLdGUP7Cwzt%2FgsP4JszuyJE3zuTFM%2BxJT5rZnNEOLi4CsFhoB6drZGpJxLMHUNc3lQyNomeyOeE%2FHXDJvR1%2FQLyshlQcOUa7%2BsA3cqRJrBDFHzhefVXDcGJ83%2FBp8rXYrtYGPU3%2FHBYfpLlbyQO6r2mIO8X6EGCppYymp%2FpOWGxmBVk81hDKA6q7UTbaADo4GdLqkOxl8lCY2QhI3zqJnp4W43VhrvIE99WpGkb9S%2BV5c9CU2rx%2BTiOo9pO0YCKPXyRJji%2Bi0QJ7vOcqYF0oDDjN3YZaOPJIlhCYxbHKswxblXDu5D75rlireIuSbW0fI4RmzQDzjAzl2pKQY7YBE%2BqPUC4Wll%2FT5bUQNb0w3dtLyap7fjP6qQGnlnCL59WQfwZNLor8kg7jQroaAgS%2FrtVRiyIE7ZPh78N8I4WrS9SKkN7wy%2FN03aCD1gOwt8ZSnecLk7ZwNoMry%2FcMTxV0NI%2BkwNbEmSYw2JuizgY6pgEoOFuVEcsP9nDgveSL1KFtcFttygKnMMwd%2BjjEeTg6FxI5VFP0UVFmywAkcWx%2Fwb9ogaFUdOHFf8r7QTdrcQYWZk05VwcKekF1kAmkObF4czHsgvxUmfg2YdL2seFYmIPaiDkiQrl3ablzWpImUz1hzWovqHRcXaVKuajX2ixsp%2BqOKuhlkkduUqf4l1886iPcAFxuuX1uu%2BPPDfPLp%2FIMPT%2BneKBN&X-Amz-Signature=493c431a4d23aced9715d7ab7ac6a87aa02c103cef14e47feb2313cf65ad3145&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GI2L2J6%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033641Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIQCy43bAboC%2BMMwe6V%2B%2Boht190enM%2FhlbIyi04Til7TefAIgF8Ec7BgIO%2BrOS6PIrTng0QvjzcKU2CcUOnJVmaUoRoQq%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDCy09j1%2FzLLooz%2F1eircA1rg3yAJkZn9PXFaH6YJH87XA2oPLVYnJtI2ZbFyQX9IO1NCgzWlGD8HZHwpoE33DjBfu7FePJWLA81HUgcKJdcXJhRGj7zjjUVVZg1XRQqFr%2BxaGKWoicFYoug2poBTf18PrRFRY85V%2FKuILm97ALONe0CVpfbDrg6ddpsNICajQGZ1MtVpuhVU4dFM%2B6L%2B48YGR%2BYHwCbGOCuQyKuHeHXZXcBrCpSIJU7eLkF2X4JWtO2vrJ6TNvTxcKA8DJwdDMIEnxYARPQVH6BwnZNfF%2FHLar4RCFPsTyQUeoCQzz2PsIhJGiuCIjI5kHNGLkJtdo62LRUDErthz%2FaH6Ac5arw4BgpR9ML5tOeihJ0AtQrlho4OfWhMuQtgqtvUsfCPznqIGOLYkz6mSp2%2BbJVGjzrjYAY5gbMeL28qvSv2jAewCHVzG80lCffgo6%2B8XYuNB1PgJAhUm5S9WDkXy8LOhqT6Z64hk6YDXzDF2riG9amAlkC4df2Z4pgWlntaoJvJS6NgFwbYMeLApMEv2oY1aTKxYfS%2FRD1TwmLlB%2B94lJDEH6aZqxdFxo%2FmyHwXJq09jw0%2FmtdtNjcrLNTPli%2FA%2FtrCsNW3UwjEAZug86tk7GhlP02xANqb4JatlN2YMOycos4GOqUBGIF%2F8UPvD3JXXc%2FYtjfLyZ1zqq5zsEp%2FCrASUiX00BijMvVe3MFKQ%2FJAOohU1RRRNffc6Oc6n2aMrUAiyWe0yqsdJQD2EMnRMUVEniCqX9LIhHdGGNVLNdIVjoj1X%2B12H4VfjYVKMrbzmz2s94bPzb8E8bzg3eUf7GDqtL9Aa92urfBPRnCtvSrmO7f5p26CJVQnCVfiiQd7XiebHOYnFI5z6uOE&X-Amz-Signature=788071282f8755ab8ce903bd20772d2100ec83e8479453746e6d6cf1a62a731f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXBAMM3G%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIEkULxZb%2FGfc5Ph5ttZnSZW6uYPCNgYUskOtZBZ4EC22AiEAw1vadOv6awJcfHkqMikocktM%2Bx0tTgaQqBFZJFL5BNUq%2FwMIAxAAGgw2Mzc0MjMxODM4MDUiDJB0T7XI%2FlleZTxffyrcA3gyU%2FhJaipjuElPUc2P%2BkDPufhHSFCvoozq%2FNkQoHL4CbPS3693Kvrc0XuTwmmhpMFDsk1niVNRZJENlW8w0jjegxQX022zeEnEZKREupLGN7fjCQJn%2F5PHaGFMpmRZijpn6wxNYXKFxmv8A6P14qpcl8vue58Rw2Mm%2FFcaYRw4I1XUFeOhcgNpBt5JLL0ZbnF%2BmnSDeC9HwtyXwoHwvTVH1XL1ud7r1vVa9nnYJkq5sK3ArK9HbwgA%2FulwMN1boallevMewhhdwxEjuLjgP%2BISywUnyiQ%2B7Y0S3toUFRpgoXdxJHFq4PWO1l2J1Rb9VlYdNYwImP%2F%2BEz3EPuXGsxKhh7qxQ%2F0zF3cw4rUVqtjnw5SKVClSC76gKe6QjoSrDPyebI6UJyRm9PAEkvnxVw8fMkKyhyu%2BoBDcvjjpgIkyCbKK1Y%2Fo9fSwUDYLCp7wHXAHVKme6blWLyv%2BC2v3gN5h63J%2FXLGxPtXi1k%2FarS%2B%2FPgUnarSaysMj9Mh6so9dYdYfKsgR9XvMuILyI2DhlkjT%2BXOztuUsj%2FGIa8zHYLU8bLz2%2BtE9kwu5xocIbDNY1T1f2XDUngeIizFgVUmUUb0jy4zmh218HijZYNmLzVxEhrXVhF14%2BVbfcKO8MMqbos4GOqUBO7UyIzU9b2RpIWcGAfJqAcwY3nmGKP64NLvqx%2FMmaMDlNEl%2FpT4gei%2FzUsmXP7dtOGw99DZFCdikqInfXghBM0T2xfsht4RB7Eulz1dPXDElGj5wi3WyCr1rF46JmYZHWiVIJw5D7Y1STCM%2F47orEhkuZ5vojbmQ0K5JvCNM7XdYjrZciuWjs%2FPbizcHO60aMyx7VSZ7LoB0ZCk5TJ4n4V0AQ5Ie&X-Amz-Signature=0f0146f3322ee9b4a44b891712f5f6ce266b48eb86066fad2d758b5147394904&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SMKGRLRD%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033644Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIETOGqbkT11PuGpC%2BixZwC0ZDU4o9O6mTNff6mfqfSPRAiBKDv2USIK0O%2FdJxxqgS3xGiQGyWTDj457l6UMwD1eCLSr%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMEPFyYWQFmYsWyuYIKtwD6Z1nGrx7Crb2OxiJbfp1IkgCYv4H5m%2FDNPnVBbipM7xGi9PmH1ujK0B8roZRg7XtVEuSD6ofc7hut2x%2FVXpOnIdEtPPN43zzHpgpiJHSkbtqv5AGUoy47%2FMA02he%2FAhKp5Jk10q0miQOfFEJmyLq%2FZPcClJ9jZY9ape7R%2FlwAOT4hhoE0p9Gcr%2FAzSj6%2BoP1g2xjjCSAsUD%2FWsHFjsakg4PnRIVnSs2CdQxwynmSE5%2BXGDAffRJ%2F%2FzsY%2BxjyzUn611AQsVbM%2BXxj8OIgDC3iN1RF0n680J2xC6FwOtNGZ72rz%2Bqmx533FKDZlei5KUHTqMCZirIVwOFGz6ZfndpOtz%2BPEuLGDV1pU1LjqWWyEgYbW70DMVgl0sczHSbHfvW%2BeZiTKFDY%2BF9k6hTIJN3KElwh17RcPox41uLmtWYncpqUPHWtfAALPM2FL5FMAp84FHpisWLtfappSN86ZHJr6Ob0uiQxqILjqwHwJHa9GSQKi6HZgl55GFlchp81IEBC0xRkAQDO%2BRGbKulPIboVPdxjhlYEPwACSQaeYb2Di5we%2BniKpWl5SEBkmHLSwecGKlswTqOMREwv0as%2FZ08r1b87k2stFOO%2Fk4n6Wzju2q%2BUBvgITp97%2Bke0Z6cwi5yizgY6pgGideM2fQhgDs83WchSHajD2DscwTDuxZwqGtQMqNY1I4GepHuvZ5YfHuvudnFtkeLWPmjCUy888s%2FWPOmgREjyrSYzqYpQymJ4BWMYaA94xbKQrrkfhAKe0d%2FtQillgNC%2BbhkE8aM3u59pmsJz64Bh5nIjmtUJU8mBSESA8PJpFujEtsWp%2BUlGh4eYq6xpSzq5VizdnxkgEn%2FVkxMS2B9Ft2HVdi9b&X-Amz-Signature=abe93735aecc1d2526ba929e5546ca4699469310d8b74b576e2d39b1217ed1dd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=1e0722c870b90e74032fd7aeb40d8923323c8d753d42d0c6900a9e8148810973&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=0d8fccf5bee4e3968b942ffd362b238f790cad608d4b549905327da8f6303bc8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665Q6X7BDB%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIDlGzXKfDgaizOTikrcoG%2F0RLaJeQ7iuMN4LxZOxF3OzAiB2D4YYmfG7t%2FxPU23qWS7xbu1jj3rXbjAeEfcjZOO1KSr%2FAwgEEAAaDDYzNzQyMzE4MzgwNSIMis0Bhw7%2Bc%2BDK3nqYKtwDeQCjs4G%2Fu6zj6OMPtN2QBAODd5GnD%2F5cXr4oUej5XVJljFX5RcqzEE3OyGcTSognZ0oI%2FEW6yKlHBLZf29HJ0HvnoOW4syFY1tOZsBcxtt0Y5uwU0SxzIOC3aoHVhSe0TtA3LPxq4cg5cYY%2BNsqiHxcTxIpsrOe0J2Q%2FjQbjg1wcKWNm3Om%2FLJMAkhXaLuPTjyRBDMoxMCGEkn5uvPF1Md4PhBeZJdRbe0dpVcckQruTKd48TDjngda6%2FFvZ7Rt0%2Fxf8Qe4OtbgQxDK1sW6wYXMAC1nc%2BqO7rFiTD%2BPVJLo4%2FQ1kS5dmJsRvzjzLmm2BzXjwPhxZvG%2FdRAR%2B2becaLbdy1gJ3KEdvZd55%2F6woB5g0MlYjcRjJnT7iSskcPCnF%2Fqcy%2BT2WhlgD5vvaReXADKkCSuzjJ1SNV2E54UmfY2ZG5tFu2FSjBm2vbUP%2Fv3QeHBgoBxrrvyA6wBKYWFP%2BXdTDLqyYH8WgC5QHbxpnV%2FHmxgs0Q5FTK7Hdax2abwRVLvACRcw5veWshwfdWJb8BeTmrHzJtqj8%2FojF9j6RtyA3xxjZg0sPwxi0w2ByYAKpI2JS6OprWQR0A6ZnYydD5PGcIsihDrb7KA%2FWoQVSn0Ev2Cnud9nGERcrfQw5puizgY6pgF3tA8Aj2kFBFrOulMvCAc1Qnyhjdor39eg6rFluRuWgdHoI5NIAcxyZYerdbipWa2NwsThD9wZKJFOLX89vzsRilYW6iPeb2tL9Wmt1pmIE3T%2FEaXg1ZEPVLGljW%2FHYe0rxe8NByNCs%2FtjfheFr%2FHXY%2FyMgrKu18ilvDd7alQcSs8NMsL0Xy5bv%2BF%2BWndvSxP20qc%2Fxu6%2BEhAwZgwqk6%2FjatEwO1tm&X-Amz-Signature=9e9d02ddea90b6649904f9dda0d45241de64936cf3fe2193705b8f79bddcb196&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=f6216cc0916960ff2166266d2f2a5d1a77cb678d2305d3ae8707e3da1f54d3cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SREGUH2C%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJGMEQCIF9LTXQoPY3GBFkDPv9PFCMnDu7xtHDYe9Y7KFDgkfIGAiBIS4p75ZBJLbU%2FoEVSgxtc1tFSu%2F9Z1C7HftksE11qxir%2FAwgDEAAaDDYzNzQyMzE4MzgwNSIMDDYZ2YKFFgNFe7P2KtwDdoRvAWTpW4zj%2F9RhXyhgsvB%2B%2BSu1RwebytCUUIPP03mBNGmQdzsiLxHO2Mm0UOI0Lb13RiBz4GWUHWYA3jTx%2B1DMauYK9ZuWSLO5dtGy1mnadsvZLLp6rfgiqXbQ%2Bi3takfEzDAZv%2F3W959BHY0YDx8Y%2BmPu72%2FXuN9LfdRqUNdyq4GnBDDLiH1tLXnrYN%2FhVEJj7Yt1U3cDU8GY%2BRPz3Qj7q25mSqO%2BlQ5sjMzH%2FCAVFuLXwEzc32%2F1LMN8B%2BIR1w%2Betdi1hq7FbirWKBqGnHTnyhBgcTXA6SLU0r2XEhJhaQVmJG%2B7D6d73g%2BPnWOOrzCwZaxEZk0EGcJsYJR4CjOa2WfAVpZ25B1XoACy7b6Be8z%2Fj7S1kuXvoyC7%2BU03GmMIKn5bc8JpTorZSNoTKl4RDfs%2FaVG%2BCc7ot%2FGEKmdw%2B%2F398zNDDY20q0PXcUZMdg95zHUqx07U4ZdVfaqMxK0KR10r7NibpM5jKydPl69bcVcEXOYIWyl1ZOZn%2FTmMrjbH8FOil9SeZkzEBrEXrxgyPBWxwO82aEM%2B6jFLCXasZiCLDJzXGcLStr2QBSEpYsdZEEBIIqBu4%2F4UqT39yJjw%2B6FWyoodZeVO1mmVE092M3Qb7LjLghVDc3Iw1puizgY6pgGrOS%2BQBcIDnnyXnIUQ%2FEJdq1eB139kGh6VhrO5EYdtaXtZ9oK7rV2k4zaQ3bAULPMolyP1k9ms4XWRqwqE2FWjaQkE7OFh%2BoMuuLcVch98RZcuXUaTdLTt9je%2BtMIcXWRnbDjfKwW7aN8v%2F293PITtwslOo6KZYxvvdJdqT%2BYGqhirxQOiL89knsczWSchvuY2oM8DgZScXOpGExn8RpMMtvmlHL4C&X-Amz-Signature=6515787036d18168931372345fa7420121a3ec42af306acf99cc4c218c2a4233&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIUWW64Q%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJHMEUCIAax8Qe5IIetev0pftYycyOC8KsyXWEBaB2%2BHqE0RRxGAiEA14%2BPN4mxrHx949B62vSKgqHiseTbRUoWSCuR%2FOobdZ0q%2FwMIBBAAGgw2Mzc0MjMxODM4MDUiDAa8MUVrQZiv5ueEnSrcAzdMs5egfgDAheAlniSaxS4i9Xzi%2B2K9XaEkxpKTTLsmym5V7nQnuo36Ai6o4cDGUU0ytMf%2FNUDvjzC7xrcyfYTbV%2B3fX3nhCtDDvcNVrhCxA4SvRnEDtHNqyx70QIjJNs954y9b%2BX03g7jRXWU1JsNARFTtjhVnXNUtm2lMxBIVvu9ozyA7nzhmmhWwD8IuEzBrJQM2htdNqW7%2Fm7cSAstL55KydHzFW2CfQ9xQQx%2BJfPav9fbsRc5gVSCt%2F64SaqIwW2X2J41jeoJpNiCF1tPhI%2B3LdEQQeqWA8KEuUD1bFxNK8wyQKPAq0VVrizNyKesFNsOAVaJncsGFWE7tcyrmRQ%2Flen67xp46vBJH6d%2BxcvYqb%2FshWnLTlzSXPyBkuV21aowiiG6WxVeWxohsrDJgFQMEESyNaOFTuJdhtk3OF5PHRE0GYqVjs8RD8EIJtPk7MTGGinP2eF1a7dLlfblZwRVCyc1ChcbM3zXZZUt4qhJkptXs7J4ae2jitGIDh1kMVAeah8jfOcn6SH2UJ79yJZDvvHkIa1wHKtA4pNuhjrDLIL5CB2dZeW1BayPQZSkgsN6Gc1RWxcrHbsK55J2vvwQKO%2B%2BV6BmBQK4t0ZtgzBH1vWsCl8XNbtojMNibos4GOqUBlLnNR%2BCS9mDnf1ItubN%2FHLM%2FfPJg57M3HlqoIDdiTNK2x3I3OPIdIG%2BoBBfqhQ1%2FvmHDyv6vN1ZzY1s4iFK7FTJ1OXB5WpKwrDXmATIeww5IL63R7wEeKsM0zJA%2FqXKCIoLVSQsAWhD1NmqlhnReGosliC%2FIBpWd%2FTHFZZHy0B8WJ9LHYB6i1Qi823C%2BDnE1IvNRxYZhsHKpIMe%2FPcMLt6e%2FZQXD&X-Amz-Signature=99b067c4aeb4288a1d909b0487a43470eb7d4e03dd8e69c4ed8aa9a20221cf91&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666J4TMS6G%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDrZqOAY%2BZvQr3g059UCbuzfmYn0WpLSlgshHyzAg2wWQIhAIxj2mxXKkZ56uyf4Sd25GzQNek%2F6YtZBcgrJvKkeUgiKv8DCAQQABoMNjM3NDIzMTgzODA1IgxbLP7ZLe%2FRGVqoAnIq3AOC3p3Sl%2Fg2jajqSp7srCpHgYpbejEIMQbsF3UTxXDSWFo4ZVRib%2BgWO1PpQv5wAoZm0RdJgORzuG7T4rHsZpRoRK6L7noFbiVJq7GUmdm1n5qbwU6CEYqX2OIaNWqTNUhGuT0LUSfbhzEucU8SMUsomvfpU1Q%2FUJYe44jWXz39GbfPjWX%2FyEJTnTLVMdo4MCSsUxfo0ppKFAuGzZXStSwHE5GhFSjmjkskA4o8NQjp7vIqqXrt7kJHk8ZnKtsPhCAd6Ms26%2Bw6p4AxPgVVJV%2FHtrYh1fY3IGPC5N7dtjBQiz73l3%2FNizRlGk%2BOEru7zqumafKkAVtrg%2BZQP9xAt0IfKUIKwBGpgCrlSdUDWkJF%2FW2kcKLKyyrojW4CqoC%2B8LGVCOwk96ogJv6uF9yo4kIyTBlwHHqMfixT8IW%2FJklcMEPnlL%2F4uoc0UEvYvsb7F7sxDsQXdsMpTI2pSnCglcmVAoVJnBp%2B2zdKsDN%2FOlYGxNdclKozmVhdy5ZRakSXCgaEXB0c51RlKb6fgzX047v7WF5m7rm1q9sES%2Bz7FDbsfYFWcKR4zW6vH3BVj7EwvBguVFTmHin6dXHkb3lxyh%2FUQYKLQVwTttrzYDLWJpX168Kp9rGE7FpnpZ9ojTCir6LOBjqkAaPwlZs9RH0s97haleeAVBq%2BDKCKdGiEoQQITQ8UWxJCe%2FZRY0p4JbSP%2FuTcw4Dw1YpRiHHqsM78I4INkKVTvOLNrzTo8Yiqbqc6HIQlDUlqizljZ2MoyhIneF0DQR%2BIhtqHsjG6hjBQZeOYNTk2oUw6jGLiwbOwcbStqPHVA3i6AyQx9QQDJMuzfKbzq%2FD5QpLgysvnrR8GQm51mc%2FNTFX%2BEcPx&X-Amz-Signature=109fbb8b73e0f80e8bb9c6e29c63f568e5819ce6e0f8a42f9b0876902c9ba533&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SBOXIP5%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQCJA0uJISHnuiKcHglg6W5HPwxqkL0YNmff28WLs1rBjwIhAKTOzp2RCEusYWVng3RmSRF1hRynOSw2XCE39mknfMnxKv8DCAQQABoMNjM3NDIzMTgzODA1IgxnsAxXVP40C1vmsqkq3AMBY5AYohQ3duT8Yil%2Fcx9Qdt0m3CsCg0%2BWF50WMiVcnqHLwkNlMsfcGZMB4nJ5k6KHC4aYT0Y8Tx%2FvDyAWabObOtpeMpSCfFkG7cbEq5XW0zG%2FPFBeNlMW4P07Lq4O3iqgshqpjYkvOUl0%2F8N%2FZzSZVajvJCaTrdLWxa16vsGHdfG%2Bovz%2BujdW%2F82Tf%2FBo48b35mbneO2oy0WwD4FrKSvDNrYwU5VraoP1Uf25RRGOwVCmlGKbpDQOaEDALei4bLjlLoxWwhfusbeme7hfuyfS%2F7deUEceCQtW%2FImE4bmsM9n6xgFQQlsh4QSh6lIZS6BO904YIL2N5P0sUW7pIkJFeCHhHqlbPFNtdINty4QhZ1zBZYfwG74mz5R1pXe%2F9x9v7zhbUSbh7riROgehEnDTGMLrh%2FEZcOb9NIOD3uDPEcE6jX0uE0cgzHGdOdHCkhnlVFThOVnYYuwBpvaDJ9631CXx8LCMlIRWSb%2Bidika1s6kNxqCqhuUAd1sJ6dTY6eVbi7bBzk6UT8i2gja9P%2FVZ49kbrwys8OM10dHfiKzB1B5Oy4U%2BpI90lZ3pcKgBC6MeA8tgZkBtmJilTK%2BvcnUk1iUyXy8TRRFwPhtwCLqPaIsVdEfskobIurPBDCunKLOBjqkAVTLg1I9Qsgk4Q9Wagqt8HC7C%2FvXdqWb5T5azhbwOlb8wxoHF%2FYqdSKnwntm2wS0HcKI45RYCM%2FzX3IyBNCRa6VUZE3B8y0Ij7r3ANj3QoLSv%2FG2wsvtrsZm8j11VBQP7CXces0%2Bcpw6JQtQGzEWEtKclOPkZ1psDnOenBXcxF%2FpupFMkGFwDw4xcdLEWt7IjY2hm4g3fAQ4e0GMLBtnF%2B09BhQ8&X-Amz-Signature=e45bb2d682e5607d2afb7408379fba4b6622c3b1fc298435e027809377710644&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=90b2065bdb868998245bfe57ce6979cc23187bc243fda9a41f18f9730d45fb86&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCZYRZ2%2F20260329%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260329T033603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDsaCXVzLXdlc3QtMiJIMEYCIQDFe6CO48oTbr%2FVtP1cYalLrmHdQxpUZY402GHnwdrTuAIhAITgkNhr%2F7xtu5YXiSJpvXa39j1%2B4tjvrEmrYvkFbCAMKv8DCAQQABoMNjM3NDIzMTgzODA1IgwSV4XHs3ovFpqNi3Iq3AOid%2BuxV2XgPMganq8e%2F4Wf8vFNAjqOIcNgvUah%2FUv0lbgkq6FRDHQbOrj2imBgPPBCFWf5ymZ3X7KD5K9vtslN%2BuNvq1ciNMFMmCESGsc6W9dzgclz4UD0awOLpjSPdnU2BNzRYfzY9n94QXnKs9tv4rk1cCgX4KGfxIB26Uj34sXFrjeKjY%2F%2FyQDy06P35o80vHNJ%2F4UaMQpBe1j7m2AW4RRsj2oG2m01qbp4RwfCfCKO6ieMqbnxaEvoE%2BEx1Wl0w8ncHifzCBCO79m%2B2LpTh%2BllvYg%2BCkokY5QT%2FkfG2rsI%2BGBqjKxtss0WYkDSxo%2FqQeuHRFUdkKLv3%2FSEyJ0FRT%2BOiz6fVpGIO8mV%2FdNMER0yoIgPzUIgx97EFeHWuhO8kAkSUH%2FPF9jKMxhGiC%2BkPGC8NbyqUy8htVLuJUDNW3dMynDWP81gESYXQxpR8HihlPRgO%2F1tOTE90t1z0E8twCsMGdUkpoYmV1Xrro%2BGVuPxSEZx8YoralTMgE1xqPqw67PjAQOJd4eGIOQWdlem1c6EWfTLGQy33ymsEVTXoh5h6A%2Fr7hxccsOHDUDoU0xfEKhHCg48D%2BafhzodWDqp4u6RrmlGecv2DvzOFXCO%2BVZ4ADhibAPSqWeI3TDfm6LOBjqkAR3l4%2FJw0YMZOEWVluXiV55vZYui5flvwzxHymNQgKP7iMdvEy%2BImXfgpieddZ%2B5vqTUiVZAJ6QbYSzAK%2Fofy67KaW6r02CnuzRislabOY29yQ0cvdP0uRHqAkWxMDZlyryPzyIm%2FKOC9QL7ZsS49fBT35UnJxpWOQY614H6Ws5F3YkFpEC5IyHhSYaT3iXOISuYGih76gBlDH%2BTtjzOEWnMKAE1&X-Amz-Signature=80642812bad14f8204603d9a707431f2a542540f98e93ed8e51d4a5914c77eaa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

