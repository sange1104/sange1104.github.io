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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=a44309fb1d13001c513bcc911711f251b4c0022d0ddfb2b37c20f105f5b0d5cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=92d7f02ed8029c6c76927c8c0ccaf2d03b131638783c0be4fe503fef51c8f193&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=e0396e1bce9651f615408bc2cbe3900ab0d853276a359db45351ed4357410d28&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=229ec54f44bb5e79f43f79082d2e923907b21abf87aca0d2b57c8a9d3a64fca6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663CCJCR64%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031535Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEvTjX4xE9hrm5I08oVAG%2F7wnF46NNM%2FU38C6Du3WpzVAiBb9B9gO02ljMWe%2BjanpO%2B2AkDNtjxN6cJF1Vi7MS3ofCqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2Fqu7PhUpEkxWHKlkKtwDwGwFBw%2F5TqbqmRI9oRilcvsra7wDPSEzBxDY%2FwqgincmIW3KR%2BvDQgHzybLPxOrfRAeQUwfV1AlATsx0xJAdbVoND%2BVuF1Xh7%2BZLOBT9ghSaguHSjS4CDhGwjMMV3IoB9slLvOuvXy1t0m97ezEXZxQpYT30S9IHBrAotuoNhSdXrItFghxeHAtFB0qV%2BpDKCutP%2B8rOP9yGqzgzYMC9Ca3xUHaI%2FD9VHchGSCaBZXIVFgqK%2Fkiv9TEfw1YGQzkVw0xlfyHhgecPquejDALTbNSPbINzhj8%2FYzRdAFAqEUSBVuqy46OVGmB1P5L7U%2FZ9b207bvAXxrxXSkIb5AmzsBQmEuR5kmk3PWaKX%2FAMpesw8y7bcC6KMuioKnTYzEL7fPW8BKtv6vWFX4cmt%2B8rh4iZacjPj9%2BdyvmDoXDoWbhQgya1DVxPqAOA3CnG6jTHvWbSbwwCVFfn4Go0yVh8wKMI62CoYOumw5M%2Fb7W5rmAHV%2BfL890O8pF79dyA1QdFmLlmQjmgFyj3J69kh0T4d0%2BA96r9W1yKvMZ1LUNSd3tWOCIe%2B8ajfcsKF9QuCEm1UQNGzQUpfpXKuIMUqQItC%2FwxlKolTsva05i78vr5tzVt4RFCyO%2BQ%2BU5Lc4Qw5PSHzgY6pgETjS3m03iglI5xlkGAYmVprg9Ax8v3dhDLqKfCt0koUHDaPd71%2Be5gWZbgEl7cS%2Fzd3M3Jnt%2B6ut85Zm49qsGs25Fl2qOftKyLxDh%2FWeNgQ6iwuRIJcKUh8NEB77ZdPEnSHjnapJTzfvTTtp9M6eaMBP3d2wxvy2gX7K9seT3P03KTN3FDalVomjSsKI8QMnF86DYMz%2B3DXk0G6wSWA0gvDNcHkbD7&X-Amz-Signature=4151c83f494e1014df3791380d600a6b43b4c48abc37c0375faa2e684e730023&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZGYZZMBY%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDb7S4GNK1DMgG4oUeiPRdxnh1N%2FlGnwEEZbLHwvlqFVAIgfvbl9lxBbWYptBxBXjTdYLYDrYUK1InpZ7WfSY0gvXYqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNCPrKhOTAZdm8%2BEbCrcAxXYCgnSEAZke4U4SSgL3tmpvG54joatMMsfD0vq5vYXH2wbm%2BQbkvK5kUCVmH2WE93ti2O6pqSci7s99WHWPHjE07yAlzzNJ0pItjnqlaST1ErvPT0RVkak9u7LEFUj6FzVWnEgHVkc2ta5uuSJ52WpEvdIZIGIwKM9kbxhd7YUHy41a7BGvwlimPmfrk04MM3%2FJCX%2BDrqnrFYXgKkrXF4qU5gXNFgjduSARil31CP6GQLPtHBv%2BKEbZaXVuKnffDE15UfT1iUb46PQDtB18nuUW0ZCps4ha8nkX7AVeb7CZjqOf2gX5JCkEcp6YT8fEVvhWtN7m7m5nkM1tLHDSPvwGSFtFZA2G7UZ7qYvEvMvrwbGFF91tu%2FMRXqdoZStJVEN9lB%2BC%2FwXzQLO7aL00l3CzeeyMZguYoAnEMN5fBZiY8NEkoWnSUfaPkBkAE6qXIZ4PH%2Bb1GqFDgZiKuH7WY3lzN1tjrbwaBi94NhlVQicvQkFD6nSK8vz2FEmw8ZmICqjpjckZkAXPHWctswnHtsun5b1hq8eexcksrruBpJ2CpFNmr9eY8C7gPmvAlG%2FdCocQ%2BzomqBm%2BDpaus0WqW%2FWlSeRKGY2nZIHc%2FxX%2FBRvU%2FizwuLvvii5ELO1MPzyh84GOqUB7TFWbkekwKJ3aRq3LwVhPV5yDqWhX6nAuVG2nal4qRWSzKxdp9ZE6nQHH0udiZaKzYOUxE9WZh%2F39aePpkdk51jnGJJuhCUZW92l7La73avGNamTyD%2FvyacBb8KishMQoIT4kPg2RyrXyUm49Pw1Oo%2BxjfUbzVCFGlZIPque3w2VvvihQPICyh%2B4HIo%2BNJh6irl9Yd8X980r%2BM7Px3rJuF1z%2F11c&X-Amz-Signature=9b6b960f4d41a8023737588adbe19672a059c76a3e5fb87e52bf6067324c965d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667TRIZ77U%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031549Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF8LKRyN81RGxU7Uhy5MwFigfcJUfQQph%2B7AbbaRCPOwAiA9Hg4MnOCBbcyvgGnlZyZCf1rC5tVOfe1EwW9ShUYZziqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMbi%2Fk2Ude9VrJbouJKtwDdxtUYmDWZTfQasAPBjXp9QxJ5fW%2FF%2BDHvG%2FFPFxCK9ijdcimoV4Xgr31Qc9pccbAHYEoseruLXO93iiYdRjnLhZmpGjWOWRM15Tncw7SOR0%2BFlPuLp%2BIlYLBP4C8FT018%2BGZhD0Kc2qmJP%2FFngTkQgDhD5H0KH88BeFHPoi9yYpeV8K%2BzKVW101F7zAbr5R7GZnjqwNVBIFGjt%2BTtf16ZU4foRwvQlo%2BhzgCoDS1T2A7HP3pFl942aNN9S%2BfqxDYHiuxt84kCvk6VtggccWlqx6gP6mGaiP0vPYGkO3d%2Fniz4J4%2B%2BS6ZPtCh45lrrt%2BsfmP3dlGJJuecX0G6pX2BF16%2F0e8UcLlQ3rKHIX3txw6Vtn6A3gBQoZWLMyb4paPr240Fs%2FD4REQtXbZTd7NFUkD9M9tkSqcjmPxBnS%2Bver%2FKHjTgh1GvXyt%2B%2FCMsx%2BvlGBQ%2FTMdVlTAuMNz6Tws7K%2BcyxnEVyM%2FR6NHnQjweOelMVoymMCaz7CPS6bHWkx8CJVAVhe6t7jQWcsX%2B84qMLo2vy8OdnTQiRwnsuXlyHjAdxZ7trvNXQus4NUPJDm4fXsCpgNmQe1cxlavFgrAzttsPCn1BLi8S4UBA42%2FCZ%2FrbOxthWuD0Vnwa6iowtPSHzgY6pgEhf8ecE09DBmrk09lM%2FyKGbodQQlNVx144j3BLP3HP6x%2FgvQxuei%2F%2FzLFoDUYTH7aLgo9RK0RmU8qt4yN3enviNyXT5cbjswdXK%2BPZ0p83C6Z7af5wy62JVfjHySX7SvWhaBFYMhyqwnGHu%2F3ehnRiowkVdcY5QQW9PhVThUxhb9tayj4xrDx6GBCvuIjdsTCP2JqdIkKbFUPenK7%2B13W1VTDnOqtY&X-Amz-Signature=120633af9c734572becfcc1c6ce6d71eba80cbd4052f362df4ffc5ef5ed49473&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XW6LYEIG%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031550Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDSKthQWYQ%2FsxgPTGGfBedOxJYzB6eWCS6f0N2fZMEysgIgGouanUiPG9njD8oAA9X3V5mSCnPUYwJZCXjy%2FI%2FqL18qiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKV5EytsO%2F9Px9lRuSrcA%2B2p4eDW4WVrLckmZmTdedCLBjhDTa21fgT%2F%2FMUkbq5aZItn3LbFVoREj8z2GUizxEco2Y4lSS7AZN8QbUCsGYEcn98eSy0y5RDTgUWrTDF5rxhF%2BSNxrpsLyTnQTz3KKdhMKv7AVQseOOQlCbK1f8o3OJLfR31ACYspntLXV9is1AS9HGW1ldNfrzv3OPgNaPwkFmPdcwdJ1aITTQsMJjECStRdaxhUJ8po5Ei6thUShTCOvfldtjLUx6WszmNx8j2NyJOjJIrU3ohdO5B0c%2B1bqSTUOcC%2B8lc2XmBoUBDIp5yU1zBElF4Emohkzx7vdRswhu%2BuMnnECSoqq5s6DSWBU%2BwxAtF5%2B3YLmPllJZnGSqNury43t2sKtxMWs0g9aT97TV2bRc3rBWzW2SHdKAKori10P64PwXzrzzlPj6USfEN7mdMe97Npdwjvkf3YdywErmwzIQgx4jbocZSAp2FzgS%2BDyuAeb5kIRLKYFoQEak4fJ3wOcr%2BoKvcqMmbk6uYIuNrCif3tE14pLl9JGFgmY%2FrrAj21%2Fer5%2Be%2BbuPA%2F5xY6jovUjmUJWKSjxquP6AyeoAloRu1stS7xa4xT6YGyQ1RZUceOjf893sOhxPZ473mLe7LgmQNumonaMMryh84GOqUBiKxcAA0hHDVknCbtSnP8TPH1VWARco3NydLsa5puoj4ay%2FUrP4EUesB1dbVfEUp1lQ4TCgiVmlGHaYyBOMC3LJ70RF7zbSEfgXfx8940s0LGbjH0Z9g09Jqy1jQgYP9Av%2B%2FiYD033MXXTodj4WMg%2BfxxTuA5vLLsUOaXbZmBsAl04lSySD4M6sV6zmEeV%2FNvxI%2BZKKqw%2BRscsvaYPUKhkc4aar8N&X-Amz-Signature=79c09bf42a5306989f8a0a104eb7760152d886d31a564b45e9669dcef8c85d6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=c69b4a67ccd82f4b84d51d9e88daa3a738239ff89361eee89f9b027a102161da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=62da88766d25175bf95574ac06f2bb2b234c53ee6e4b305bb13555e97d02d28c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WLPUKO7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031557Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFyD8Q5koxcIvTBFvUXcU5DpZcVuzOFbUOdopgGrCfd3AiEAl0ekgUIQ3aP9AWDwwXLsseFiLtCpUyNPButx%2BQevYiAqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFqenxqKpsZJchYaUircA4cVtxB9dXI9bGtGg7tXM9c6dQ785Rc2TTMTxd4jr3x84tv80C4DICuz1TdLdHW3DyX21Y41iEZnynAGnOhY8xLjrTbxKsoCAM3OMhq%2BmQ%2Bc5sxhXonariK3HywQhyg5qT4FcdnAQfe1lMEoZ1BBzLSqqXHwECrIBAaoJAUTCysqxbcPZ9izADFCiDUxlnW%2FBVyaYXfyjuOQpgYJQdblg1LtOvL0DOTZl7d9kEegqSTxaD0uJlTge775FzG5I2Vk%2FM1dmsxLKYuVGRSX9qUgaGwtolyMp4RWe3wj8IU5VsMmlfk4T2cCCpvwJmILJpTyT53MVUKMDAlVOnQ9iuTSwSqMJmPxIUvBLq6Dp99PdUwECMtgHSzGLPvr0Y%2Fx7aEoh3AdO3J9lsWUPoNBfm0i8qsPXALkzpRDAxsN0k51EpdQxiI5yK1k%2FR7SufkQ%2FOQCoHFjq9SqhYPiWZ3dbsPFDWLW9ZSV2R64PN8NVoG56V4kAXMnDInPDBwLy5r5TDWniD%2BqeqXyBHRwtqyp4QVcL4Or%2FA12TCwrCrIilod8pluKnhgZbGeVZ1fqJmcXAVvzbHNVj17edXw1pAW6NaAoKgIumIFCGK%2Fw78nDvlTiRcASTkJkDf5lSG53ts2oMLP0h84GOqUBg85Y9JzGNE94DygGyhFLDnVpitErU6fS%2FpYQ%2BYJt6%2Foo0seOYYlgu%2ByU86%2By528zer%2FFVdJYIABLW7Vm38MMPaLDfXa39ijo7dZcQJedVEe2Yx34gOK0SP2dymOWw4Qs5rqRCqGaKRZ29zKjlu%2BX4GBUK4JFO3YwZUJtYBAoxP3N1yrsW70sYmiTPbZFoH9k78YTgG1lobEfRfTMstL311qPrRaH&X-Amz-Signature=9fae98d0833b7e213cb96295d0a1f8d93f6bf8f920d2b72ea23a4ba73dd81430&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=f7c666fa633bd9a11ff25f5adf8c4fab9bfbfa1712065bf1bd0a7048d9086055&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YH4NYRE%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031557Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCFRUs61eErtcQcY5IFmk8oEV2zc4YZ4OL8kgZw7%2FsV6AIgWEPEPJOUIRhNasn2LtvEAwiMuDJmszmuyAAlSe9%2Fe%2FsqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB2nBAafe31jfLsC8SrcA1P7uxiCgqWtWSrKkxBbTa72DmORNt8MhfoO1NYGVl7pGHP5Bob7JJmf0TCo0tpaY6%2FmquEQXp8X4u89e2nu%2FC2FNvU2mNUROH8qS%2F3zyeOOFtub0q2l0mWyMPjSEPz0KXF86CzN8RaokAyFY4uEgLMGHaspU3fcODqHJRAPeogMfZ9k5VrWt7s6ma%2BJwfc%2BomfxTeH49JuM%2B6v%2FgEUc8vLp5pPfzxTKHFvTFZSVcETt7TVHqGyQ9AEhC6c0pvnyEQK%2BjtoRxTTw%2F49QbXCnuxjrUq3Tyr50hHJND2cMxTe%2BXtvgK37IUUpmTKYJiltKG6z%2BsiGTFzOqpj%2BP%2FYh0EeaPEtffjWPrfZv%2BZiVRu50awNrEVeBba6P%2Biuh2Ka45blEF7RwCg%2BTyxp9fjUSyOsM5%2BYM1GZODk3XLXW7V2sQKd90DYtxakSXriNuxigDp%2BL93JGMwhzMFaCqvQ%2FYBmJu9Nj2QWjEIKL6ZMp6zjyf09K4U%2B7AlVzHnguItg6bfliYEkP9%2FaXW7QAazNo9v8FMy%2B0shV%2BHfMKRNbJqKlQDjKqAmLJLNrYnd%2B5Wx3UstFGX%2BZcJteyvdRU%2B3AMc9%2BUmR9tsnp%2BAShObI0xYI%2Bl9vtGbGGws5ZL2Dzbk%2FMLzyh84GOqUBSddBFh5IAWkVSO7giKRONCFqgOuXUdpPpPWQ8yG4ZMfY%2Fz5G1nR%2F9ryIfrmvTewWdfCh%2FQT3fZUF5BFkU5PHRhznXgQIapc0EcQWoctvRxtUDWnqoFNsKAd79axAhyDeJxzj79aBPdY0zj%2BAtGoK73S1dfrya0imj5t5ff%2B7GMms7wcs9raMPFydOTqwp0VQhS4TVSHQW5XpAkbi6AUabWlHFcgk&X-Amz-Signature=d8a4ce3b5f7cb7505022447724012761107927221c34deee8b66768c0474cbe3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46657LT7DQQ%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEgVAV3zqI2ZV7IUaOPDCdaz52vZRVxsEs4DAljdjfoGAiEA%2F0hgxzVCU0gze5erfvGcOYeWf8JdnwrZZf7AXo5hpTIqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNhOkzJ%2FVjtr2RjSCCrcA0uUgKWJI97ycluuEWulM978DZU2rgFZeNS%2FPv08qMZkebKNnKOF1ZxPRwj0Vouonkms3bNbia9NBAID5GgeECSvJ27z5RA5LMGDiNjnALamSTsGj6u32DZGB5NNdoWYYJcJlw4lIJ2No8DfDA1I5yBdGytM4yBOvZTWYsmO6TwY5xeiQ4dHQDXK4eP6BTIwrtYPNoZ%2BcX2ZUepo1UjhrLSO5Ce6nTOyx6JrDmadTvnW2cgiDya38hwBz5sQv850aLvNYSEzGpndc%2FqSaifPFgtt%2Fcwu7GnoTB%2FpYHxVBFdXUHVjyxhzy1SVhdtT6L%2F5%2BqC139iyStQjuhsagTJqODdrYIhnwUn6BIpbDFg%2FPI%2B4daMIoUl8Ol5U6q8ZYXMUjp3xE17xqJZtgCoMejIJ0DyUBmFhlBSexBHcZCxpqILlbKyOF0dIrOIucZodEufx4pGXF1mSdOzo3ahkTy21aNZj0u8muohJyPBc9ebD0GE6tfXf7bHNhf%2FRnVJlpSvpEfHu5yuLzUA9VIgAtlzg5yiZo2foYhvo1eTybc%2F7Y8LgEbLrqeRz8RKHKP1rVMSTCI2hO2S3PtIZCZrZ5XzYSQXIExYKWhAOtyj84OpMEHm33o11K%2FEmMWkD%2Fw%2BwMPvyh84GOqUBvzVDHi0wxBbAuDIHcXzBw7Z5e8cmhrl2xVL2mMcyPp6se5%2BuZRf0G7MlRB8XtmAxc7p7N1T%2B0T1v%2BXB6LM2FATEaw0PSLtOTBj8Wx1vZ%2F2m4JBM97h%2FO2CDKEmOrQgfulbREuHoiGs3fRDhHJobfaNxKlJ8vxelr3NAAia6Qmf%2BCY4oIEhC2qSPKntEXmXkL1KX3NLnwomhlugWyCl7zxpnrRWvf&X-Amz-Signature=bb7432b625f4c2ab8dae42fd8fda3eb94f9c3682211cb4568d675f8c7202865e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XZKOJLLH%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031559Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB7C4q6YwoRPP8kZ62nNBAnAo4O%2BwKuqeQ7Y4K1qnq8YAiBqLWBPEyFzptEupPff2%2FS67B9X6DKoozrDWGK4Hh8fuyqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM1rniZbbw65KM1eIgKtwDVDYY7XOaOox%2FFNjee31TkFWBbyGFyFjG1mFN1AcBHEOtjdK96XEWg3LdiEAAD21KfnsO%2B1FhHmYt43JNxN%2BTzniRBmag0cQGZggbwq5FpZLjfzK52EBE6J7RDHi%2Bx4k1t1l1ZqSby8w6dQP6uhjeof4vJxZfFUGJacGgLpMFR7EhvrdjMrilCyJ6qZvVTG60b9%2FOEJuM6PrhLvAJjhw63c47LJ6j%2BfJs1Uvx8WC1olAPBykh%2FUBuhLvs7ci3Jif5U42cVOg%2Bbicr4TpZiz7DlAFWXI4lQn7TxtW7mPUY6kMcKHVok5R7rMilN5OrePbw%2BYyP0BuXRvgQ5MES%2BJW40V%2FCCD81cwgxpNCEG5MHXX38DzffntDpHzwoz3DdQap60TrFE3ODF0cCEwIEW6UCJ5koSd7H0neJT16Nzl9FR0usXNjxWOLb5cNQNRDKnT02cbaHZOLd0mfsOeMn5Y%2FAkIxSHocrRcKnrW7reMp5ujbxOe0Y74w5blX5IgYw9jpndnAOKDYvb6IjluhzCiXbo2z4G37%2BYyKVfk3OhIaznAeYMwMvQNlwyAJDGI1s3I3vR4oOiLoP2VSFudvarCDcL6LP%2Foy7fenPjRRzRtBadCdU45%2BXkhfRtPR7irIwmfOHzgY6pgGfBqbUX8y4zomC%2BWTxA%2BPbEFAHBT0ujnCXgZ828rPqpaZPrEvdIDVrJhDn2BTiUHptvZ8E233w1sL%2FZdO9t%2BvCtjgQ4Mk9XK5IGVT%2FosvQDJPO4h5dDM0dkVdmjzAJrsHpbtOO9sgZyajsCLcn3LlPlQGAYRw2MnPhi3VcvCchxfErMH5rRPzSMWy6jKWDhsiMvZLKArM07JGKR9neHyaAt8%2BM9C8t&X-Amz-Signature=903ce967d67e473d8082e015f01fdd203cdbf62dab2a9b3e8b6ff1ddbac3f928&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VDDVV3P%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031559Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCqYbqWfcNaJHjJ%2Bp97Jtr952bViTbNtUH7KUUc37P%2F3AIhANngmMwkzvptyYEIQgzcsMrTccG%2BALb7sEW9EUnbdcY3KogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzQWYPG5tlyabXNi2wq3APMjmGjSlQpzyPjd2%2BHXqjkP4Nut5LXjam65rGFVMLhzK0P8FgYyQxOuqxqB6FPVk%2Fdsqq01PC6dFRo5oOt4%2FYSuavoOHxLMtvLEC9o39U9Rrfsd2%2FvNc6yPAMTuY45qxCfaEPLzZyQ0BlMaT8%2FjXyPFKx781q36MPVmhrZH1iRZ06jEONAWJzRY3hWYGRE4I%2Fgld0vP3t151n5JV9w6Bg098QI69LO2rbcYeiMDPe2iCDzZRUF2JQIx3Zmdf3m1TvXNw6u3s5XGu5iTk0Pz6FbPb9p8UFgsAnk0DjJvyGZZDOyf1AA5eQ7lvzK2RgQ4ffDVmSpYyEnLVZScIbeQl%2B8lZ5GsgtF2flzdFAaGASGaz%2FI%2FgL1Lnkn7AgZqnQNOlXDirq8SHxQ2QQn4JPn0DJILAOU4ANxzdqNvjf0LoE8mvj3Q060V0xfrnnJF0OI8diiYdH%2BxLcwwAS%2FfjcvabEbI8FVq2MH0Am%2FCLlMvcr1HZ8Gvk%2BVvDtuX2Md%2BNCcc58PZo6b81n5hRygTfiBfcf7RoBwRVyGpigEFgG2%2BjSX%2FnPvFUkqRHS2iZIfm2%2BNzy8okqd1KzYV3zS8b9QtidvroYptKQpaTpU7N%2ByOsqOjvpxn%2BI4R33GC%2BqM0eTCE9IfOBjqkAcHCp55J2xkR0Dm93X5b7YrGazjdrdWkvquWqXEVkzrleemI1jmDVe9%2Bs%2BFwZCZcrmW8WBK7CNlELry%2F9NUTSW6wTvyFYbOD9uzcqs3SUn8sRfkajTvnJmK2ztzImFXeOIYzGYdB9Jz3atpsZPxvXphCwqWmilG%2F5cL%2FZLdJKuuVq%2FCaBvdNxZVX5LWDLR7NYKrg7B88xMMyIoND0iNmz6fq8frL&X-Amz-Signature=f804efc6cba51a6560438d64e370746e8745d8eb35d728e2ec562f3b41d9332a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=980e9440abe63c9c5a0f7c6371eb0509b84312b329869ea06e77b3e2d1536853&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHE2YAP7%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXwQ7plFDEFLXiPsCan1T%2BqyycEwzmj5eQ1pMpDhNm1wIhAJUH5vvdRgH9QmZD8K%2Bupc1i%2FqniPF76HfAcEoFtjw7bKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOjRNO8F6qAyE0688q3APbrqF3ecWgbRgSW9LPA3laLotcz2JS%2F1In3smcTVa3MtXkVc4ly1KoUyW76ntWu1ecEmF2XrekFXTIdYTYTr317AmEAXrfC4tsGyMTS1Vz%2FUgPsTfnIYMaKnEb5iat23FBVh66zJIGdgbPjgysGfROijDOLVXEBGGHS4jgSgfqsZzoVL275kREmNfgKpxclgWEzct96cLINMibqg25%2F8hUcKDTXK3G%2B2tCp9etqW1P4LkxISILV%2BVptXhZoRqYvr42gKBukzAQu2QhnPstB5vTCexkgzFiMHtegZuexEB9ryGhvny7zWJIC98brYOIZpYLC4IJp%2Fm0o1e2SqS73Wk3obZwk8EcVe8pkPoB3utrRJQWkCy8Hd%2FJY4DoFV3GlfM5CWLQZDTQRs209md%2FFOrOeiCSo8hRq0kb8d%2BtyKeqUH2StjRQYI0oZJQZFwJ7YEO%2FteSdP4hsMwfJLQ0k%2FCoqhGtwmJwAhqPKOUFWMiyhHifHvDIooWNOZKo7GUFwIetFMzaoSwegOIUeM8%2FY%2BtxMPVaRathFG2WVd9cxz7sKD4BvvUmCCIvfPCEquny11uyG2s%2Fot7iGUraC0Qxl9rRRkh%2FaRsB5D%2FIvEz9C1kP1b08k%2BWOYwJGpO6KG%2FjCO84fOBjqkAdrs2J%2ByIF5%2BWOMkCmoOFvLNvqfq8q%2FiU8Kz4akJb95SJF4GY%2FQS%2F7%2FExDjNtWyeN7M0h2PKxDA2yaOux2eh7gRlpGS0t1XI5tisYbSpa%2B1FI2jRQnjKyEQuwyaL7VwYS232j8E046lh6yobnHhEn7NDa75b%2F3zxcpISXhaplf3XGjTJz7KrTOxzg%2Fy53026%2Fud%2BjKJVQlmx1PRVW25RNnU%2BRoVr&X-Amz-Signature=281c1a957a645fd9d9fdb09fbf527735e7a82e68b14744c0f9dbaf66891c9c24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

