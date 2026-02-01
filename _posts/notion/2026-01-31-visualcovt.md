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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TTZVLKUS%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQbrKcp75ACq6eZUL2TSLOH0XeT8uokfbUKjlIFr%2FfZQIhAKD4d%2BncdhLwbhKQrKrQJ5y9JuJRTAzF6yuRIdPjm8vnKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIaamsAS12aNmnc3Uq3ANs%2Bj%2BDi7BZFPCa9w%2B0n9b2TX%2BWWXWINZ81Rl7rCNbCV7jlyu3LUYwUzAXXD41LiiLmi%2Be%2BJTU6bBmsBj4s9NSgBEohPcX9vqV3CGhr3MUojvCEyYS2UjN1DuevTFGkiu66Vk%2BOl1BjQ4N%2FR7zLjvmLMHKg2e%2ByE878vq9k9YbS7S2fj%2FBTOj2o%2Bnd6MNh7Gc2jZmgoN%2BwGKs1WjGwHcJ3hDbRPZtuCDx5kYRf44W5FaiRaxacDNB3%2F4lD2YlA52ELo%2Bnc2KEgnj1SJVrZiT4V0Xyo28j1KoOtPqoSDYuURRUzN%2FnXAacT5s1QUioMPc8Jp0vD8FjQ74sHmPR%2F3B02qA%2FK5IlnDgHJZBlR3icYoOU74H8Jd6tkw7%2B7qZGS59Jt4rP4Cs6fBwqxhR3O3bsa3fAx1ssss4BqEirSxiscXsMqFjnr3AvpmaTvDMZMdHn1hdj2o8DeYCHS1PKdz33mcb4mkJDIz5luLuJk%2BB3goyOiKTKgRKJxDAk3PStaQib1gTVOtJ9F%2Bftu%2FGBujwRkg%2FAVeRe2%2BPxucYm8%2BvXCO2cz9LiCf8nj%2FZ36f92gMi8DHXFjUjYkzy0RefpgDDTuar5%2FjJi97Rwt%2BSUpIitGE5ji7PXDty23jN9pA9jCr8vnLBjqkATOrqEtdUpUjY2yRe0pY7wWdts7S4rKjmP90ZIX1Kff3gEqsFlZZo5PItq3dBVC1D5HXxn%2F%2BI2m%2BWaasoawj6Gi4VdB7Hkc3fKnh5zGjKELWmA6eoLmJ%2Brw0H2QkSHu976U8Z%2BuyNFvpUicz7MGziAFipUxfoyHp48lTXTpDhHbIWFxmk6qrcmrXotXKLnzpnnUJqUMdFyxRNfZSt8c7Qz6slztF&X-Amz-Signature=7802e32f5c905522cb75879aeb0e8d86ec1d137b0a6ac4caf8a33804686feb2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TTZVLKUS%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQbrKcp75ACq6eZUL2TSLOH0XeT8uokfbUKjlIFr%2FfZQIhAKD4d%2BncdhLwbhKQrKrQJ5y9JuJRTAzF6yuRIdPjm8vnKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIaamsAS12aNmnc3Uq3ANs%2Bj%2BDi7BZFPCa9w%2B0n9b2TX%2BWWXWINZ81Rl7rCNbCV7jlyu3LUYwUzAXXD41LiiLmi%2Be%2BJTU6bBmsBj4s9NSgBEohPcX9vqV3CGhr3MUojvCEyYS2UjN1DuevTFGkiu66Vk%2BOl1BjQ4N%2FR7zLjvmLMHKg2e%2ByE878vq9k9YbS7S2fj%2FBTOj2o%2Bnd6MNh7Gc2jZmgoN%2BwGKs1WjGwHcJ3hDbRPZtuCDx5kYRf44W5FaiRaxacDNB3%2F4lD2YlA52ELo%2Bnc2KEgnj1SJVrZiT4V0Xyo28j1KoOtPqoSDYuURRUzN%2FnXAacT5s1QUioMPc8Jp0vD8FjQ74sHmPR%2F3B02qA%2FK5IlnDgHJZBlR3icYoOU74H8Jd6tkw7%2B7qZGS59Jt4rP4Cs6fBwqxhR3O3bsa3fAx1ssss4BqEirSxiscXsMqFjnr3AvpmaTvDMZMdHn1hdj2o8DeYCHS1PKdz33mcb4mkJDIz5luLuJk%2BB3goyOiKTKgRKJxDAk3PStaQib1gTVOtJ9F%2Bftu%2FGBujwRkg%2FAVeRe2%2BPxucYm8%2BvXCO2cz9LiCf8nj%2FZ36f92gMi8DHXFjUjYkzy0RefpgDDTuar5%2FjJi97Rwt%2BSUpIitGE5ji7PXDty23jN9pA9jCr8vnLBjqkATOrqEtdUpUjY2yRe0pY7wWdts7S4rKjmP90ZIX1Kff3gEqsFlZZo5PItq3dBVC1D5HXxn%2F%2BI2m%2BWaasoawj6Gi4VdB7Hkc3fKnh5zGjKELWmA6eoLmJ%2Brw0H2QkSHu976U8Z%2BuyNFvpUicz7MGziAFipUxfoyHp48lTXTpDhHbIWFxmk6qrcmrXotXKLnzpnnUJqUMdFyxRNfZSt8c7Qz6slztF&X-Amz-Signature=b60ff0c80a9ad64e66d5dc9ea8baf61d12b4b124feeab46ee7fc81846b310150&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TTZVLKUS%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQbrKcp75ACq6eZUL2TSLOH0XeT8uokfbUKjlIFr%2FfZQIhAKD4d%2BncdhLwbhKQrKrQJ5y9JuJRTAzF6yuRIdPjm8vnKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIaamsAS12aNmnc3Uq3ANs%2Bj%2BDi7BZFPCa9w%2B0n9b2TX%2BWWXWINZ81Rl7rCNbCV7jlyu3LUYwUzAXXD41LiiLmi%2Be%2BJTU6bBmsBj4s9NSgBEohPcX9vqV3CGhr3MUojvCEyYS2UjN1DuevTFGkiu66Vk%2BOl1BjQ4N%2FR7zLjvmLMHKg2e%2ByE878vq9k9YbS7S2fj%2FBTOj2o%2Bnd6MNh7Gc2jZmgoN%2BwGKs1WjGwHcJ3hDbRPZtuCDx5kYRf44W5FaiRaxacDNB3%2F4lD2YlA52ELo%2Bnc2KEgnj1SJVrZiT4V0Xyo28j1KoOtPqoSDYuURRUzN%2FnXAacT5s1QUioMPc8Jp0vD8FjQ74sHmPR%2F3B02qA%2FK5IlnDgHJZBlR3icYoOU74H8Jd6tkw7%2B7qZGS59Jt4rP4Cs6fBwqxhR3O3bsa3fAx1ssss4BqEirSxiscXsMqFjnr3AvpmaTvDMZMdHn1hdj2o8DeYCHS1PKdz33mcb4mkJDIz5luLuJk%2BB3goyOiKTKgRKJxDAk3PStaQib1gTVOtJ9F%2Bftu%2FGBujwRkg%2FAVeRe2%2BPxucYm8%2BvXCO2cz9LiCf8nj%2FZ36f92gMi8DHXFjUjYkzy0RefpgDDTuar5%2FjJi97Rwt%2BSUpIitGE5ji7PXDty23jN9pA9jCr8vnLBjqkATOrqEtdUpUjY2yRe0pY7wWdts7S4rKjmP90ZIX1Kff3gEqsFlZZo5PItq3dBVC1D5HXxn%2F%2BI2m%2BWaasoawj6Gi4VdB7Hkc3fKnh5zGjKELWmA6eoLmJ%2Brw0H2QkSHu976U8Z%2BuyNFvpUicz7MGziAFipUxfoyHp48lTXTpDhHbIWFxmk6qrcmrXotXKLnzpnnUJqUMdFyxRNfZSt8c7Qz6slztF&X-Amz-Signature=a83326cc4e77c7a405056bd17c420e6327aa108f6ae3ae56587c73f11ef5c950&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TTZVLKUS%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQbrKcp75ACq6eZUL2TSLOH0XeT8uokfbUKjlIFr%2FfZQIhAKD4d%2BncdhLwbhKQrKrQJ5y9JuJRTAzF6yuRIdPjm8vnKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIaamsAS12aNmnc3Uq3ANs%2Bj%2BDi7BZFPCa9w%2B0n9b2TX%2BWWXWINZ81Rl7rCNbCV7jlyu3LUYwUzAXXD41LiiLmi%2Be%2BJTU6bBmsBj4s9NSgBEohPcX9vqV3CGhr3MUojvCEyYS2UjN1DuevTFGkiu66Vk%2BOl1BjQ4N%2FR7zLjvmLMHKg2e%2ByE878vq9k9YbS7S2fj%2FBTOj2o%2Bnd6MNh7Gc2jZmgoN%2BwGKs1WjGwHcJ3hDbRPZtuCDx5kYRf44W5FaiRaxacDNB3%2F4lD2YlA52ELo%2Bnc2KEgnj1SJVrZiT4V0Xyo28j1KoOtPqoSDYuURRUzN%2FnXAacT5s1QUioMPc8Jp0vD8FjQ74sHmPR%2F3B02qA%2FK5IlnDgHJZBlR3icYoOU74H8Jd6tkw7%2B7qZGS59Jt4rP4Cs6fBwqxhR3O3bsa3fAx1ssss4BqEirSxiscXsMqFjnr3AvpmaTvDMZMdHn1hdj2o8DeYCHS1PKdz33mcb4mkJDIz5luLuJk%2BB3goyOiKTKgRKJxDAk3PStaQib1gTVOtJ9F%2Bftu%2FGBujwRkg%2FAVeRe2%2BPxucYm8%2BvXCO2cz9LiCf8nj%2FZ36f92gMi8DHXFjUjYkzy0RefpgDDTuar5%2FjJi97Rwt%2BSUpIitGE5ji7PXDty23jN9pA9jCr8vnLBjqkATOrqEtdUpUjY2yRe0pY7wWdts7S4rKjmP90ZIX1Kff3gEqsFlZZo5PItq3dBVC1D5HXxn%2F%2BI2m%2BWaasoawj6Gi4VdB7Hkc3fKnh5zGjKELWmA6eoLmJ%2Brw0H2QkSHu976U8Z%2BuyNFvpUicz7MGziAFipUxfoyHp48lTXTpDhHbIWFxmk6qrcmrXotXKLnzpnnUJqUMdFyxRNfZSt8c7Qz6slztF&X-Amz-Signature=988d84264da7151e465a07f703e2c527226b018c6dcde2e89905d3f9d3447991&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YEAF22ZX%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023338Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCKH4rRseF4tk4tT5T00A%2FOVE2FzkB19cbyAp%2BVbBQCHgIhALfxP2gZdeh%2FXnsYyH%2BiUxQedyiat4HJn8mFEYKMF117KogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy8Grw4jE3VXE60R5sq3AMwNRVi1sA7IuKlR1uYg2wUFJZoPs%2B1sU4dYScs%2F4cllFXibBE4DNWVZ0sF862IAPcmXQUeNzMp%2F7TzOXn253JtqAsKbXIWv%2FL7CwXQZrOR6smjRYoXEYH6KFiLaWzvDKC8ljmbdL7fcyctGEZzEJujpsfg1Yj9%2FikQe7oi7oXgh8xZW%2FU7WYZi5ah6YCqumDCGDqAsynD%2FODo2efmSuyUqWJ%2Fz9PHQrBDLVwdKa%2BErqSIX%2F0oYh9OQAEpLWUk%2FgaKiWYmKuqb5E307tf6JC1ex9OkjmK9uhZSZdZrQlPpcJRiam5pacippkbu3uP%2FsyqSsKXnKspETLWkJTwGtw%2FwUFXtKOl%2FpSgiyx7GzmM%2B4aNmcZ11p2CoWFTTMKuN13amBRzbmEnmuJR40VXQpqnFlzs1PgmhkK05CIMvs7IouF5iocImnXXDeI0JvYe0yPKhIs%2FD%2FAzgYCsYJqsNaDAl7xsP95B3%2BJJX%2BlXx0569Txzqbd2cVN5hbqW2GgAArImV%2FM92ZivKjq08l5Lyuyl7nMURZhiZei%2BzKET3YaD2R2FVdRBqeDHVwoxO7HMqZnamAl8UFNdIb6c1Zvfn8cIWkwb4DuwG8y1Wx0elMhdC5NGTYdefar17e1VLAkjDV8fnLBjqkAZo9F12O6fdw%2Bt1%2BsMYeTSiHt2c6crLsZAWwK%2Fjks%2FWBpBMZoZSwaAG4SQAUMzkmbLZMKuqPdriiK3ZxMk24b19MNY8ULT6P7vBu9XN2WUuRL76KtApjXh5Hv4mPNZGVCn1WjaXLlHl3rquNxFxu8hwqzYwihiZX%2FTe4Z%2B4kEt2VeAjwJJ0Ib3e5VYyrVaLCs7oSlAciibSpxbpCiLGWObkifys6&X-Amz-Signature=0682a0165a8c9ddd488922a00e4e67e385dff2cbd117a2bf1c6128ea5e3a9fbc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGVMVOHE%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCo9sdeBV6gtaVi09Pi9%2BNmhg3ZMlF7o7yhz37cX2vnhwIgZ%2Bp7sMd0Sl2nue94rvnplpL%2FZKgoMeUWUBvpFgW5i2YqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCfrvC%2F2opoVhw9n8CrcAyE6dFEDEpZra7coUJnAkSho9gkR0s6UGmg9OsINrd4CSoiWEEkzcu66JomytCGfyeMLK09y1AGM%2FUP2cfknchFRJ5OzBZ8bEMb7vvI8BCyuBrfJfnqQ099LNvYgC8eMEhbWS9%2BwBrsDUb7UCNVbDMvFwP8HWLuCFtCHWI9fWSX%2F%2FCJTuyglGuZ2O7kNzCvuDjlUDZxIixQd5KDNNWpUwTx8rmzbi21I17raYIiD8vPdTo5LiDc%2F1IEOHm6OokcD2r9yGDBcpDGCIeEDMWmnw%2F4LTPGyVZzpJivUTHczL7NQjGu3K27DnGNxsavcq0YaGO1C992AVKph3JdcbEUGyuDJT9zboBGVXq7xRM18mxJ7jsLCEieHFE5aU1GmUc5co1XAAnXZdWL4jMs6F93%2Bn0FIjHjnLijR%2BQnw6QzFoPGNuo9lzt1QAp97Xki3W8e9J8sRdnB47seA7UAxAkqoI9VmvORp52Buv5G25pGHWT%2FUyEHVrt1YLKRI8HAHjd8HLVY9FSG1mCIS5PpKmHvuvdxM%2BbCLvEP%2FAHaF4VpJLOUv3nsPioBaUGnBgQa4fEVyulesTSIqmAZGF2E%2FI0jIpHDXxaOqJrpmJBwI1PEONy%2BxWsRonK9IpdwbBClmMKfy%2BcsGOqUB%2FHs8OF6vAmhP81ZxHPeCLs4YknxLM2y76H5BUUFAoJN6VTmP5IsjuoxnlYceO3OC%2BhTSoUuW%2FEsy4%2FtPETPXcJ9nAEMXUycCe%2B6kEsFep6pLQNB5zu2kpeF4U%2B7Sl%2BLzuVNoYHxTVjTzuKlAiHydzgXOdSYkqEXIvqfUNzq5tkog6h20GqyYxra7whv9l0US9RpRVdielFUQyL68vFY9aYRVLyIz&X-Amz-Signature=9e50d893e185942cc15b2415610538b0192441c55fd9b445779e969528a664af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWQORQTR%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDE8rOTH%2BjZ96zhj%2FjTB5e2hKzJ%2Fa3Bv%2FLDKrfysSnl3AiBTutQYubi82iAeQxHhCnISpy9QdAYWohvP8BVd1S4BmyqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMV2cD96NUFLGJ4oAUKtwD5gUIpiG7JVYh8dd%2FY2Dh14xwOPuKAfiAQ3F91pfXtISEZ1Z6S%2Fkwd1ncjQ3lX8HDhdDECxLXENp6XGQc4xU5zsP3dbCr0eT4YMCUOA0i1uRZe%2BIjV2TldFO9ZimciR0z5BfJt0OvpBEhhH5Z6eyv3CeEcsBTgRsGDd6uWehP1FTNVL78rIMdrKQx9Sr4y2KvjyqczXOPIVpL9eCS3MrICtYx10H%2F9Xv%2F%2B1egLbwekZYhQ6eQr2PBkHBqH2KOAIgARmEkjm1jKtkURdsmwhLc3uhLEEgN85gKn1bx48L9qnIegTjMSYpLoh2bOTy4CjpGl376syJ80pcAMABNBMuScQykpoq5t1M%2FOmLcfNhSjJXio%2B5MmuYYM3ZFbHVReHvAw7r60%2FaDe23ABd8O%2F2UvHwVn5jqpj1oAFMtvbZr8oCTkFnzOaPQse7dzekvovn9vtK5xLVrpq3NEi4qtdSFiXKVcy%2FpgWqZt1%2BN7Uk2g1oRtTMm49PYB9C%2FG20R%2FOq8IwBeMyeofB3%2FseYSlqohH4JCVZA8gtEM%2FAylB4teJ%2Bm1qZKWO%2FR8dE7R9uolr1ZxayUH5Yha5DYHCqtqDVqxU55RB5EdX1yI%2FaZFhaA8CtZrw4vHC7Ux6p5KKq8AwifL5ywY6pgE%2B1JnCdG%2BK9H344rsGBzayQSptd8sTwgDtLntggagW%2BGOIU2lHPWabwa0u2RYrRvmpM1cGYkKrI9IGFeTB5eFSz5ZJYMEFRfbvNiFVado%2Fm1Gx1BYdw1M%2Fw0ISuFEpHhsbSQjPKa2Cg9wn3G%2FfpITfVqoICpIVc1GWx54yCj5U32YIluAx%2BkntJlRf1XN7bahbG7Ba5LKTU6Hzh0dcj9e5ZQCzD26P&X-Amz-Signature=618f2d61b42cd1e8286be2c6556965dd4f4ddd354b42f12040101697f5c2bbd4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UVS7T2O4%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCCWUULrTA2LGTiR2tl6n0XBF0Gkwv9UPTjs7a4ilfF1gIhANO5HHm9n%2B25%2BhpUCeH%2BGAcuSJnsPl1sAPyp%2Bfs4nka%2BKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyCqj2MMoNJmPt4%2B%2Boq3ANEFxDF64%2BEpAmFtllMw%2FqN%2FGbps9ekO0uMES1nKD5xabrrUoLscCGXsblgxAVCCvvHaDyZQLxPY0Ebb%2B0%2FQ0DmHhw76jefA9nI3xSAjyibI9%2FTQaFr7KvHtkhzXNCVBWvY9Co18Uey0xzUaW%2Bcw1EuCXrI1ZUPsRCOK02bg4BIk87s01%2Bf2jwOoPwYUJi9dpjWIkrvopVpjqminqwjp0I1gG4ptk6XK1mSwkPJYjuuCz%2FFarXjTYaM%2BTp9cU4CVPIizzT2yBegDNyI9zOBJtvwqbRY%2B061vVVSByuk1XFPX4APgXiM%2BbwyIpy6%2FU3QR%2B5tehGTMJ%2FiINyfhicT5OB7zMBTKFN16%2BpmfLrgCxCYQyq9%2BktxLTGh71AfCGMnIwQUolRoEmKQZZz2sxctfFRooYOljMrms5kEybIwDZa5WZx6WIYL9%2FotsIYpOZsGV%2B1Sa%2FEoTXk9YLAeC9dv3YCGemQF0ebzSvHsXsc5mvWsU6gjKCv02Sp4ebaewymEOtCjlCFKyxe7H%2BFLOxJCwo02fK6RDQLioDXrgE6Uz5ksb6zrz1jQ8WPF1wSZ3houppYscUDG9oK2EEcOyOr93hTyKTqqH2mYZiIKqu0YJsNxxJFDfuvsxhsoiEO1NTDZ8vnLBjqkAXp8F0L24sd1VJcDEhJOmZSdUxj%2FLSNgtoQm06g1z4c55upT0BGJXNh%2BmsdAh95wlM%2BVp6ttVBcI28bFqHyFLJrfRTKm7kvsIdioDw81VyMZL4XP9BtSaT8LeOEHWBG52zzcnLCMS0Ms%2B4FLtp2opRM8Anqr4VAmuUc6xKJ%2Fh9PGNtkQR9S2ujbwZZmARRbck9T2xiOnWoUhFUU90icMOlguKIDt&X-Amz-Signature=b45d58c2bf1ce7e570a7cbba4624f5e985689ee87c3ab79407a6fcc382825d1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TTZVLKUS%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQbrKcp75ACq6eZUL2TSLOH0XeT8uokfbUKjlIFr%2FfZQIhAKD4d%2BncdhLwbhKQrKrQJ5y9JuJRTAzF6yuRIdPjm8vnKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIaamsAS12aNmnc3Uq3ANs%2Bj%2BDi7BZFPCa9w%2B0n9b2TX%2BWWXWINZ81Rl7rCNbCV7jlyu3LUYwUzAXXD41LiiLmi%2Be%2BJTU6bBmsBj4s9NSgBEohPcX9vqV3CGhr3MUojvCEyYS2UjN1DuevTFGkiu66Vk%2BOl1BjQ4N%2FR7zLjvmLMHKg2e%2ByE878vq9k9YbS7S2fj%2FBTOj2o%2Bnd6MNh7Gc2jZmgoN%2BwGKs1WjGwHcJ3hDbRPZtuCDx5kYRf44W5FaiRaxacDNB3%2F4lD2YlA52ELo%2Bnc2KEgnj1SJVrZiT4V0Xyo28j1KoOtPqoSDYuURRUzN%2FnXAacT5s1QUioMPc8Jp0vD8FjQ74sHmPR%2F3B02qA%2FK5IlnDgHJZBlR3icYoOU74H8Jd6tkw7%2B7qZGS59Jt4rP4Cs6fBwqxhR3O3bsa3fAx1ssss4BqEirSxiscXsMqFjnr3AvpmaTvDMZMdHn1hdj2o8DeYCHS1PKdz33mcb4mkJDIz5luLuJk%2BB3goyOiKTKgRKJxDAk3PStaQib1gTVOtJ9F%2Bftu%2FGBujwRkg%2FAVeRe2%2BPxucYm8%2BvXCO2cz9LiCf8nj%2FZ36f92gMi8DHXFjUjYkzy0RefpgDDTuar5%2FjJi97Rwt%2BSUpIitGE5ji7PXDty23jN9pA9jCr8vnLBjqkATOrqEtdUpUjY2yRe0pY7wWdts7S4rKjmP90ZIX1Kff3gEqsFlZZo5PItq3dBVC1D5HXxn%2F%2BI2m%2BWaasoawj6Gi4VdB7Hkc3fKnh5zGjKELWmA6eoLmJ%2Brw0H2QkSHu976U8Z%2BuyNFvpUicz7MGziAFipUxfoyHp48lTXTpDhHbIWFxmk6qrcmrXotXKLnzpnnUJqUMdFyxRNfZSt8c7Qz6slztF&X-Amz-Signature=c36973b4d71428b017c93a966d5fb5d42f15a4ff47c3d0dad4d0ec8ccbe720e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TTZVLKUS%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQbrKcp75ACq6eZUL2TSLOH0XeT8uokfbUKjlIFr%2FfZQIhAKD4d%2BncdhLwbhKQrKrQJ5y9JuJRTAzF6yuRIdPjm8vnKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIaamsAS12aNmnc3Uq3ANs%2Bj%2BDi7BZFPCa9w%2B0n9b2TX%2BWWXWINZ81Rl7rCNbCV7jlyu3LUYwUzAXXD41LiiLmi%2Be%2BJTU6bBmsBj4s9NSgBEohPcX9vqV3CGhr3MUojvCEyYS2UjN1DuevTFGkiu66Vk%2BOl1BjQ4N%2FR7zLjvmLMHKg2e%2ByE878vq9k9YbS7S2fj%2FBTOj2o%2Bnd6MNh7Gc2jZmgoN%2BwGKs1WjGwHcJ3hDbRPZtuCDx5kYRf44W5FaiRaxacDNB3%2F4lD2YlA52ELo%2Bnc2KEgnj1SJVrZiT4V0Xyo28j1KoOtPqoSDYuURRUzN%2FnXAacT5s1QUioMPc8Jp0vD8FjQ74sHmPR%2F3B02qA%2FK5IlnDgHJZBlR3icYoOU74H8Jd6tkw7%2B7qZGS59Jt4rP4Cs6fBwqxhR3O3bsa3fAx1ssss4BqEirSxiscXsMqFjnr3AvpmaTvDMZMdHn1hdj2o8DeYCHS1PKdz33mcb4mkJDIz5luLuJk%2BB3goyOiKTKgRKJxDAk3PStaQib1gTVOtJ9F%2Bftu%2FGBujwRkg%2FAVeRe2%2BPxucYm8%2BvXCO2cz9LiCf8nj%2FZ36f92gMi8DHXFjUjYkzy0RefpgDDTuar5%2FjJi97Rwt%2BSUpIitGE5ji7PXDty23jN9pA9jCr8vnLBjqkATOrqEtdUpUjY2yRe0pY7wWdts7S4rKjmP90ZIX1Kff3gEqsFlZZo5PItq3dBVC1D5HXxn%2F%2BI2m%2BWaasoawj6Gi4VdB7Hkc3fKnh5zGjKELWmA6eoLmJ%2Brw0H2QkSHu976U8Z%2BuyNFvpUicz7MGziAFipUxfoyHp48lTXTpDhHbIWFxmk6qrcmrXotXKLnzpnnUJqUMdFyxRNfZSt8c7Qz6slztF&X-Amz-Signature=8029ad4fa9f7f10ac67de1547e1fde580d2139c00ef6967e2b6dc0427a25f052&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZXXOTCPD%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCSOVcRc%2BIF03kVS%2F3fzTwfhP4lt79iB7LDJKrB8Y22zwIgT%2BGslKjQt0w8dUXlbTl7VAipgmFWf21ZrTHsuFc4yBgqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH8Otg54kn%2FelEtXQyrcA1TPxR9hCj%2BiEkIg06XboXfWyym037ZR3wCy0raduYv8BIMBKT%2BFRxcw7Iwcl2OPAKH0PSjrthc8Epalx5GUgqfMsrI2mVIubEFS%2B0KrgYA516433%2BS%2BOX1uAPulvFcdS%2BItjO0HDS%2BeRUsn4VOUcoWi3vy%2FdaxT6JCLUih9zjOr%2BQ8nEma3HtuaoazFAgsaddZjFmjpbRsDqhLW1nileelfl5LmJMfDAYAyTaAxlX45N%2BM2lRsuHXHD6wa07sbKlKUmMYUrtZySt%2F%2BTLsCQ3oQt%2FxuEti4Ruu3YxXx8xr1DWrQijJl7fFPIJSlLgPWiw%2FEJrZELpuSsKNkZf9aK0hxzjO6D7qB0TfEAsdYDQS9IoJ80ITbEuzoEfH3eRklbuYlK1yi3Pddmurm0MLpHq5UmZ37me%2BAXFaj0TLbIO2g2bdU%2FenMkxlFDvgzQyQBIW04P%2Brebtrde1FWT0qmvNZs3cPaWwqHIdYI8v9Kvjg1yDFzaI1QEPhB3dPaOIkiV1xiLbiJSbXW1SXslVz82DzD1msbwsiGw68PHXU3C%2BLhsArv0UXqvh6KuNk6XJesGGBMTGl20cxlhFAy%2BCHJMAF1VjMPK0JFLB6O%2BcsTbzKgc6bC3UEOsZuEVm7D7MKzy%2BcsGOqUBEa1ODFGfuxl2biyzLeKLXkc2RVWXKL0C55lbwbUEb5zY8MbmWqmam6TqjLUW8OaF5R7Y%2FanUcz5cnPdChxkFrntzW7XWadyfmRco146gzoav4Ur4pN1COez95iCPxq7ZkyDN6uaV%2BJa5VKGyIoV7PbEG8zTiMe1TDcdpcjpZJGI%2FAV5gaTZNrR%2BLQi2WzWD9aFW6oI5U0EvTYTOksRUDiiealwCp&X-Amz-Signature=f82c34fc47074fe44e2f4097e9518c3b439aa55d10cc65d6a66b16755e184b74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TTZVLKUS%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQbrKcp75ACq6eZUL2TSLOH0XeT8uokfbUKjlIFr%2FfZQIhAKD4d%2BncdhLwbhKQrKrQJ5y9JuJRTAzF6yuRIdPjm8vnKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwIaamsAS12aNmnc3Uq3ANs%2Bj%2BDi7BZFPCa9w%2B0n9b2TX%2BWWXWINZ81Rl7rCNbCV7jlyu3LUYwUzAXXD41LiiLmi%2Be%2BJTU6bBmsBj4s9NSgBEohPcX9vqV3CGhr3MUojvCEyYS2UjN1DuevTFGkiu66Vk%2BOl1BjQ4N%2FR7zLjvmLMHKg2e%2ByE878vq9k9YbS7S2fj%2FBTOj2o%2Bnd6MNh7Gc2jZmgoN%2BwGKs1WjGwHcJ3hDbRPZtuCDx5kYRf44W5FaiRaxacDNB3%2F4lD2YlA52ELo%2Bnc2KEgnj1SJVrZiT4V0Xyo28j1KoOtPqoSDYuURRUzN%2FnXAacT5s1QUioMPc8Jp0vD8FjQ74sHmPR%2F3B02qA%2FK5IlnDgHJZBlR3icYoOU74H8Jd6tkw7%2B7qZGS59Jt4rP4Cs6fBwqxhR3O3bsa3fAx1ssss4BqEirSxiscXsMqFjnr3AvpmaTvDMZMdHn1hdj2o8DeYCHS1PKdz33mcb4mkJDIz5luLuJk%2BB3goyOiKTKgRKJxDAk3PStaQib1gTVOtJ9F%2Bftu%2FGBujwRkg%2FAVeRe2%2BPxucYm8%2BvXCO2cz9LiCf8nj%2FZ36f92gMi8DHXFjUjYkzy0RefpgDDTuar5%2FjJi97Rwt%2BSUpIitGE5ji7PXDty23jN9pA9jCr8vnLBjqkATOrqEtdUpUjY2yRe0pY7wWdts7S4rKjmP90ZIX1Kff3gEqsFlZZo5PItq3dBVC1D5HXxn%2F%2BI2m%2BWaasoawj6Gi4VdB7Hkc3fKnh5zGjKELWmA6eoLmJ%2Brw0H2QkSHu976U8Z%2BuyNFvpUicz7MGziAFipUxfoyHp48lTXTpDhHbIWFxmk6qrcmrXotXKLnzpnnUJqUMdFyxRNfZSt8c7Qz6slztF&X-Amz-Signature=ddad8989ceedb0e763c55258241274060a654fa2a7df6333904a56cb229ff21e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SLLH7XF%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDQ3BhsdcPeX8yuUTTAZP3u93VIRKDZxjQ3OsJXmUno4AiEAzp264yGyvP3CKaGIG7aUS%2FYQhKDGYjFex6O8aqM7CgsqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPKJVpt6uBHaAaqDFSrcA2yti0CwSMDGsLyPIsDAIXqH%2FtcJlCEw5UM%2FyMJhBd%2BXJ%2FiYfq6m8wu1t5b5CFyjJ3iDmi7jkjkCAVbYu9iaCyAZvJXWBRc5E82FAyvVosvWNRR%2FJm9M8yyEO43VkPrvdSeeVmr4%2FruzJjA%2FFQHde1XBLfZc1ll1ly6RDpJufAoKPyiYHupvinSpDik258aJDLcU9Wk6asxNbb6dnPL96fZiISdrAENSR2JzmLhvo7Y9QL6WmKrDBY0RV4yqokIGSZrGMJsb4xrAw05rl9qIL%2F6bf0GXhHUp2odOLrFe4Pl5Ty6eBOeSom3ppSwXoQ62MTCKL6j3AvxMHILmQiJIk3hv5rJv097qgET7jW5y4yn0AgT1208iBjst9XjXRGi9v9CNtxtuSfpUVMZFQ%2FgPcUVISnj4tdoi521juk1liIAJMk89UDAgcxG9j1%2FFiPV2qQHpbKmeTLTirHiumcnHytOfB92vz%2FAx7XPZSoBz924zsckOvVaIZdAsRHy7%2BqMEXEuxqeJONMGDo8KLuLDDlPxjoKdfZHSWTUDuBuMzsknyDPwqgz4%2F%2Bj9vSalsoQ6h1ffBaY94l3eJ%2Bn5GthivQ3fY1bnWJ4o8n9cszyps2vqHdia9rI4w%2BFFlb93jMLjy%2BcsGOqUBAiRaFJcHq1NeAWjO%2FbvtCNSFc5JZY%2FyMbFNzJqA3gP668g7GzwDomTlfEGUFRahS8zaCniY40cSwt744%2FsryR6ldKh5rvk7hL%2BIqdkOOcZ4aTY6Pkg5hc7tU9ZPPabcOV7v5SLRT1yHh3F84WG1Nozv5ULTBvsB8cdbpKdo4ug0uxjJWJpvHoFsQIc1%2BkXf1cuCgq%2Fc7V0h32Pnd%2FCUincNiCyzX&X-Amz-Signature=5a4668f893ccdeb203cf3d0001298c7bd35bfeb071b9e7f2e905e735076b6f66&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T76CBNZ7%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA8pAim1FJMKUwPwwa4ucL2FGquAhh5eNJF3VTvI4eVxAiAl0QjouhLosfuqnXmyJFQitXZxeB%2FjxnMIwmAWdWCTTyqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNezWQCkrod1LWWOlKtwDHnQ5g0yPNLEuWViPYY9wpwO9yRFqXKUBwK6pXqlFmBSYgiYfMvVn%2FLvfnqzl7wUtlt2Kj4oAocEr1coukLYU3oA9zxGp1uF6SV5vwDYTe864G%2BNPzEe6dU6hLFWGJbtXJj2E%2FUIjYVEu5vBqFuA1mHrVNeCb3vjHGL10RrP50uEoPjjmeWuRNDoQJK2OsoHiPLp92jIVGub1oy2A0Y5l8seH%2BtD4ZQ7H5ZF8HOOsqoCPVmSkhGq39CoEwy7jikz%2F3O1GYXeNHEUd2ul%2Bokk2W8c6H7SO3YskluhboY%2F9vNDC9XZSbiwd8GNgCNvXiw23wKQ3yo7rG0ufzy4P6zaWIt5%2B5k%2BNh6fIcd5U3%2FIDPQudqlR%2Fnn%2F8RWEbNMAlgkDR1f2P8jBVbyI3eiDy46%2Fm5axfpUFKRgEu6qNe5%2B0hEHEov4sHwxLnrk2E5cDy7wl%2Bwj5swe9TBy7z9Mm7FVH0G0KDwz2QI5k18m%2F5OMiD3obq02pYE%2FrhgRJa%2BTvu8Fo2%2Bi3aCI8oejiBJhHUIL08uyVSI1CykfNxjr%2FglSLnsukRJD1YiPw4S9ROeo74Vlj8%2B9DoWcL7bNzHxS1qeuUJIeQBHfvhsRxT%2BmDyArHBPOybtaDbg6ijlrN1MgswgPL5ywY6pgEO24ZgBobSqxNWYhNXtlNxzMva1IIRc4SR%2FqiIh5EGdR6qqrqno%2BMzVkkgXgqQQ5%2F2rG04UjYcqM%2Fp6v7HwukFFalC3xcDuzKdGs7vqFRKv%2Btucy4t%2BiGjbuzIVYLsiry6DIZcYppYKVpWX%2B%2FC8TyF4c3c6fpC9tX3kgvR%2Fibkp2DwiuRptiQ1ZK1aWvN3qHB5TpLC4x%2BpI93eu8aWVpowhH%2FoqVpm&X-Amz-Signature=fad8210842d62ab19228b0db600bbff4c313e611f7808037e9c3dd74e8b01fd2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663GIFPFO4%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDutl7K5q1ms1hfanU5d%2BL1iUn4YcqyEQQOj6Jgt%2FtrDwIhAO4QK%2Br0Z75cAMZPqGPufiETzaYcPjQMoAguIUhr6A%2FMKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy%2BZmz1WsQziOvnk3kq3AO4FEEJtVwB5cDBKiH6nPPZ8IgJKHtA1irSSqPYyiyVHX5J1MfQtAyARp%2BixS0AIOHJ9FcyBerqmbdOMZhWjlmW0yx6SpJlO%2B4atKIXRnUKdPjutT%2BtztJjFeHie9vtodabp0I%2FP9C5YY4RDNd2gFggO%2Fmg0ku%2BpS71V%2BucBrx7EKEfI2OgebKZWUxrRG%2F9DLLqkCPUE3WWVm1doLODoM1zPnwPv%2ByTuDyYrxSVBozK573c383XvvbR%2FxAsrkQKzGuEiwqk4xM2dyHPy8AFjVvBecITqhS8nPt7qVDT3I6TuJfnx9gFqf0eXnFYEsMJfNDy4z86mhSDwWMpbYz0T%2BeKdEcjtg33y7JqyTUC%2BNm0xBx4fWRq5YWfsMjsDr92v9L9CtkhGzCZROWh2kAU98Ujc4CxWnNEwe6IPJErH6eR4tcBhYkjCxJy1KnOEHfDi5Z%2BU0wNycgXL%2FOpRJlsSatkuQiJvBGb6V6E6fRogs4CPhEkx6g8NWWlaII%2FEiGQg4vzXvEtnAm2pLMSQ5Gl8cWsVEwkp2P9znmcCMp%2FeIkIkp%2BZyUne4Bjz2%2FeKlcCMmTqN%2FRxThPA6EOmr1zzn4BJuUW0FUKrAmowBcZ%2FIISOGmJtVC6Np%2F%2Bp4Q6f3UjD48fnLBjqkASzluO7dAePlNN1xdd1kEGkS0rEi1N0g7DmfYJBvj1%2BiHEfi7oINjh4IsCtr1M0f3020t1Y1%2FHAwI2wa9ZA5EDwvWj8HV6URbRlOmPlKknWUgRQQ5JZ8Hw3nVYWy%2BvQGw%2FrbUQo0YoezbgD9a55g%2FFZS3YOum6M%2FVp7XSh%2BkbTmA6533Eb8yQ7YnKpmwm0XzaKKZTS0Wx9twW1GIk93XA1YARWCH&X-Amz-Signature=8b0f5be124b973ae480a2147c7114d22415e20263d3fff981c3f97c413769fe3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635Q65HWT%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2FCYFeuYbHv3C4dkTmHZZhE8EMhX%2BAOKmM3frFjdCZMAIhALEgl8OgXaQwo%2Fc59Hwftq2O5cBxAb%2BPiRyadrBNi6%2FMKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgycLbOUH9zzlkeLcjcq3ANNMHGQVdxvzeKFQc2sAvm6nBMmIsfwtAV%2FPYgKyGYtsm%2BqWj8kFz5eaCCvzh10pg014%2FSNCrl7OYZqRxLo8knHv9LG6AmtNzO8xthhoh2igsPF6uhyG4ZBZoyOXRfVpQzkzhIkBPR8Mszf6deQTTBg%2FhGC5gxbWN9MAU6XtrvlZvPvvyH%2FRV6OYbHyoWU1hhbNv1vqYefRGVDqKo7RQBrL267kfExUulImtKh%2F82mkjPAdPQnzdKJtJVCnKJ975Z%2F17zqeqqkXNmwqJepwWcEawV%2FYElqgcUAktP0OPugSFz5pTXfp%2BzOo4mBTYNKJg3x3XtS1SsMfJN%2BLAEQjvthCQkLW4f5ZTblqjp7TmjuVYZdc%2Bu%2BE0DVOwJUuNXPY%2BBEVrj5%2FJyCGSiVuhofdGJesPHWe6ohXNIPUre7tvcHRtucd7O9l6NCB%2F6OAoaK3OSkuUnz6MCfmHPQ92DZaanqXyZTT3W8IeETvXDM3zGdcZSImzGvGhVqyr7tWlPrV5Y05cQXFbMvRYJViMO%2F5MmEm0jnh5he2xm5dywg9H0Pp76piHP5WMsuvgNY2g1Uvs3Hqm2CvZTgEZamFSh9zM7xRFTyYTIIxN63fpRfB4dvMbHlXNJVi8gxBNgiZDDC58vnLBjqkAS4eMfTG1KyBeczXx3YlhQnko%2Bilqg2k82QMRAJDPUm%2B6D%2B%2BGAAsSn%2FPD6Jt4537V1VMP%2Fa4gJ2EpcgVedWXl1Ln4SN7qH8XGaIMSrTCwor9UHrBgmIjisJ9oslPldOnhxjGlGSPKF7WUPfPOb7M%2FBK1E5H5iLF9PSHEtLgMDmkQSilTsZ2Qnsf1yEVJ4t9ph%2BjWwFp5nJ3XiJ0iwyscde2AeMcz&X-Amz-Signature=e4d67ade2ee7243eaea9df171eac32af8a30bee33a82b9075938b776fa694c58&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표
