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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=ed33af94b6d7f23744721d33013200716125367ae4c2509984c8a26a72eba072&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=1cdef1494adc12aa9bc40cd56f98d39dee2dafe43955ba75c6899ed3d57c4573&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=8cf711656cad5d17f1e0f2272b3078ddb8cbcd8839c658dad33312ddfce678ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=ec909b404fda45946c236ca9191ed46b43e20afcdcbf0e63afb9f93c2e40b27a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TDMICTQQ%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034052Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIFWvLqHi%2BpCBCu5RYJP%2Bg%2F51X3RmjiRGZHuPwABo%2FWP3AiBhCAkD3%2FDX8Rbi%2BvjI7nOw57s9G09o0ydbLnaI3%2BXjtir%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIM8pEr2SuD3W8Pxvy1KtwDt4%2BgWGNcr8HilxCRSx%2FZKc4OZqxLtrviiLpFF%2FYED39CpdayQpPkC0NptUvh1Npu4uoKdAR6JTT94FYu3X3eyCn%2FiJDp7Cey4ChScgzM0lVCK4cfBSJ%2B3dvJn7BM8GY62gYw%2Fc6XCWcoRHSEeSwZzDqhP%2FuCyEmRVJ%2FJ0NceawGfKtWIX5Nij9wvKcSq%2F5S06EPS8Yser9rUF4shPj7jrn80b6Jhbg15w8oOSRklV39LjE%2FOyQAVaK3vW6Uzd5P0pxbL96QDFtHSRoR27xRMFhouc0I7YDuwKmiOwQRfWnZuFsrapq2xWdjkhMRr0SatqplqXyZR4f2D9yX8ph9%2FRqhPbivKyZ5mnKZUFFB4LeeWoGI08NPYdLWmMqql%2BSKC3EmWLOH5nNAP1Evyh6t5WP2ChuxDU%2BUH1ty%2Flu%2BYZh0zCLA84czJQek0q2C7Rxn1S6RG1ePW72PqHC0WUGmuKOvkdwZqgqgWArFU5WXAf5F%2B3zXpKG8DhBl9uwqvWS0wcJOyZmynmi%2FKbvb3GdoIybctOihn4FGV%2FH%2BLjhiBNo6Tbm5NYrggcjosg32mlIulPAcDA8tUGEDgAz3LVV0q9hBseNxTLJtwiwCylaJoB5%2FX3vGNCxov2C3gY4Aw9MinzgY6pgEEvqYhCnj%2BEMsttDew0CchyAVojhiU2IZ39kG2Lx1sWpuFhQvz%2B8%2FIjy5UVy1RgqYBdyWdUu4tcpRuE3o5ZlD%2BNu2qwNxQ0p%2BAFSzGrk%2BgMzUcQDAdUyeMLlBFpLFJQdid3GMtHOsUzczl0BFT4lj%2BWf3i5i3IU2hvdFgFKsrkl0OufYSFtnrrqkQ6%2B142qtF0Y36gNDYiRtm%2BEZgmfExcDRXLQmtM&X-Amz-Signature=12e5f7363423e95d43e85aa34a11e09b996e0775a12d0c5c2043e5f1387efe25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4DHZ3NB%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIALiSjUkG4bz7FsGewU8Lb1tltifJqkzlG1eH03GG91WAiBXt1OJHG7JLH8Jdk5qijSFqoIiF2FtfkpVaX5gkUVqTir%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMhua76bqnmkEooro6KtwDAtEyhX%2Bz4wwYoYdR9%2B729794S4tj1DKvrxGpqtX2rm4q%2FgeKtu8el419IN5h%2FJUlgpHQ%2FQa9zKeZGC2Q3RViMRlsxiDKpbyvkKPZPPKYcgzGLLevVlfV4UmUuo8R4eIEccCh0T4acisn7VFNbiBNOqZ4kDvLgn5PwnyuxBti9wVZx0A0EyA1JXasuxop6C8Fyxr5VvpBo4qbeeTzgQO0FWNeFyiNXgUK9yBFxfiymfkNqvaVOyBRrfJHp3LL0EZFVV5jsU6ACqL3GYuEHZsuTk6Ep8%2F4QI%2Bh6XTX2qONgD%2Fpjn3yw9Q5aZc7WJqBFJQBOL8mi1ZuGPmjartYd%2B2OJeUuFFjRPdsMXTBmL4valg%2B7qCKN59BTmE5x0wKn%2BYfdQ3hMmN%2BD4Pavu1p38izYBSNprFozZeE73%2BOrsZRx017BSj3L2fOhMtLgBrsD%2BhL%2BPnDnJFmpjICSGWb4JvHBmAdDAfqNVRQUBJdNZQUNr6hd7VSNty8G9JbzVlV6veS3V3ufBKzf3RwCAF2raD7VxBGK6JBp0dpTemduhYJy7nnUhLWXZgUY9Bb0BCU1OXFAL7M86l14NEaYFlcFGC%2Fpxj%2BEGPrW%2FwI21XZGJVhkLXfCI8D5tI3JoxAtwJ0wvsinzgY6pgEWTDAEcbf2S0xpsoPOTRd%2B86r7hqOPyizxOtmcFya5RyYYKCfkbNeN1OzMiFpBg32Q9h6dj7EjBjhTuDI8i1i8INBc2rOOYGW6VD2YWJQyZC9LJrXDAkcED0%2Bc7BOu4Xue3wP%2Ffe%2B1r4dIUbN3VuxiGUlhQ2D%2B18iBiKVWuynRuVUa9nbcjVQT3XVTGtz0mvKVCnLbuL4PUimPNNrU7VPhpZ%2BW%2Feb9&X-Amz-Signature=358589e622f3258782e8646fc37c3e62366bf5e72e34ab4e4d6f1645a0f4b66b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662NNM5FE2%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIFN5PuaStUwLG%2Bg%2FbnAjywaLmmFFZe25alejixKGK8mcAiAy1%2B2hKTSPLciLSSXuwNvUBB%2FR3Ma6iceBUK1BlwtYzSr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMM8%2B2Rfrr4Fr3eOfqKtwDaCcgcH9XWVdo2pBUQvY6%2FIPAV%2FH84Co80ycjBBxgsWq%2BQeLcw8ZazkSxWeHSnB%2FOVal6eObbhLc2d9jkDAnvLiRq%2BQeN0ykA9SC9oR0V3G4huxX0qKbu1DDK8Kq51gHE4MBXgKRHITcCMtccmgBP2z5MAOKIWG8UWnUD4%2Fp5j9tw3ceVkVe0X1fKGB%2FgD83vSQ5C9C8%2Ft20oS61VhedpxmokZ8b46cIZwzTCdKq9AUe%2FsO5n7a6VMzn%2FmpAhTedZXHjCGuyJwpdwXb37aC%2F5drrfWaTt0vn%2B%2B5romHG5zI6OEiLtbdaCr%2Ffs32YwfVe0SI36q8yvK7GdgILl6OMLXfabScHiuj%2BupKqfTPsfht%2FjDP1S0GgzPcUNLIqKk8CYfViocV1DsC3cBqMfROf34cwjQhlKIdx9c%2FtFS8%2FoUjwhdUsV8RU3el5XDPdoL%2BcDHrQomWhFlwvLGGqYjJb9Qs5wUiGa2irrkdfmcqmSmaB%2BG52uSALZhmdr2htK0%2Fobg2R9l0z7%2BVEjT4nLZ9UZbnWiyV5kPJntbAXhe1zXFVZPDdh2tt%2FuJkNOpYUEV28m5MM4G91oa5Jnu8u8HuIKEv2fdDnW0XLhokvFgyzeml7wenYiciz8Qlq1VHsw0tqnzgY6pgFAuskWoRpKi0XaPOB1UBEmhULYIMVEjLL%2FFMOiqo3xB0mGE5DeKJdNw2DkY18ye8uNNv4DOhBOPSK14%2F34VocoOyESH9%2BpI7AfYIurwX7TvVTB1%2FQVYbubNsXDnjVxk5dhi7z%2BYjqbiI3d%2FWA7vqB9muhePI5SE0sx55OPZQtSMGsITjB5%2FpOTuo9414MSsOkZnkCmxc6ib2y7mKnVX%2FbB8WJchPXB&X-Amz-Signature=67cfcb84bf3b40c472362b37d9b9ea194993bd4b27582cfc02c7e199095bd0ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QS4RSDG3%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQDiisPZMKb%2FFdW7FFFmnBNYpLWU99zHueIrRxBYPqvRkwIgOyMP3QSjoJw0GzEHvmx2FtgaW7%2F7dQ1QYe3zG1vy0O8q%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDKen2VIlrUa66oSQRircA5ylWkj64CJ%2Bc0bCM0U0zerTim%2BfjkJYhC1SkROhtGPkWsBwxRrom0DKwVtz6FI0ZLwrYDhvTVL0Q53OSbLwVmcTVVIpb8wgjvCAD%2BARHVeP68%2FBMKdSMpbg%2F3sdUTCrtlHSODaKTGIe%2FJiqh5V6HH%2Fs%2BOQljvKtupTW7pqOz5HpEKzAud0GO%2BfygpKqUiDsiK36Lf2pP4ixI1Yd%2F3Wm29x2WQ0o5av8s2kbnhJZM%2BQuYo2%2BYafUbKiZ1K%2BxdjtuYPiJhb6anEEj0%2FUupSvASw%2BtIJwTP0FbwL2VmzcxJ%2BGU8E0mFqfa%2BLIdOhFriIkaAHKEpWJijH5yjy5ue4OaH8auoO5CUAMZ22UPFrD%2Fhkhv2Yw%2FeLzWFTpdQjd843cKUi8Dwrj925cAbngUYGZifKDmJsnFA94Jh6LnUOWQP%2F%2Fu0%2F6obUGrAJMLouOdyRnPbmnbT4n5dxAL6%2BLvLnQGv3n4q%2BNnZptOcUhrVdQS0mE4HiA0qx2LqHUjy2a%2BUuKGgBwCa4oJmXGeoWTIlW2FMXbWuFjb7iCZ4y9JmgNNhh2MEBrsEP2CKcu0OZ2c5oROzDD0QK8wI7J4wKULmbVZHXghpmgUZOnueDctJjRM4CCPkB6%2Fs5774I3AYaBLMJ7Jp84GOqUBkTxAIuS%2BM0OMLerVSLL3OzrE%2FN9vIjr47zb2Dz0qU4J3bmnVFbr1AU%2BHrI8%2FIVkcRMCSkwVlCJjAFbuth2OWzFJcoB2p%2B9LoXpOpG1IjCxnAUyIpzLZg2ktOL0%2F%2BYUyqYE9sCoA2GmJVkKGf0XDTPbtC%2BBKqDmkUD%2Bsdn%2BEyKHZOA%2F1O6CXzxaV9cuxvWfJ3pw%2B%2FHPJre7zxj0MdY%2BFhqy4oxYDp&X-Amz-Signature=301bf302362507642a54bf7b0817f1ab50dc0fd731478c7e8041fb0eb93535c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=8d6c0f6b76662b78abc7a88d627e172edf7672c27d014a62c433d29fb75d6acd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=5911b6f41a8b16119c89a29981dab1e5fb3bedc955f0f0020cbb794c6fcedc46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VABIIVA2%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034122Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQCEbo8TIeXHnbkTSrWYcRq4Im07EiTblxlj%2FKhFeYd3vwIgPzaMJxehSs3ElscnJA9wibncWRCEFSNVAWccOAGvFD8q%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDHabmapV7qXaKVOsVSrcAyEP9vBSJFc51w4X8Q4Co3gVXrYpPErJ%2BH6lkviqi5facwkqPv6TdehobS%2F872Qo5m1WdKXakAZV8ANEUGshYLFg1VbgQo5CTJcn5Wq81C%2B5wXuirCQypkTsd8HWjodzMPazwaUdH1cqO1Om%2BYq9%2B1aice71HXblvrqzLM8ZYTCY1DR82Tk52aFxCSluX3ynCLfOtH%2BH85mN8URJpIGy6xSY9Q3V5YxQnv8sCQlHnojLHJ7jwcv56ukhA9vyYIpDeZ7s9%2BuJAxC7nYfwJkrzbcu67zszUrFZTm%2FQk3NHaRu0dKSw1DCqKXIBmCvZNWOI91ZwKX9eArhraKLp0HpMDCkiwsbcs%2BF6M17J2YmzD%2BVSkpMPkYI6%2FV02mDttHeIx1tQIKJa4IwVuxqvPYZmzkWwVWw6Sj9jMN8nuguottDHLJoW8cXGmtQpVMuxuiNbAkWwwQfl3MEUySsqg1T8%2FTQyu4JKIJr6mZoMBo9D68%2B5t0ymjLP2Fyfkc%2B%2BtQt8sz4rZfQztEWFTtZg4VIF%2BcwPQwqCkfT0TP2D1gN6B28Jaq1h0vm0ALDkwXxw8KkeIaIxNkByE%2FxV1LejMbgXe6rIvsUg66mle6ZOj92WHDO4c6xlnK6NGROp%2BMRD0zMM7Ip84GOqUB5l2NQsci0seSDZUFxfVAk4Qzm1S9OKj6Dvwz5iLetzYnfQnj%2Fsr%2BS%2F0LQzAuFw9ZqJId3Qr3ZbHXEuP5l6wy8ztaW94lq7%2Fc24xiNlntp%2Bk8%2BAN%2Bwu1alD386JwH%2BbHPpvPj6UOF2j4AuNkepseDZH7u%2FdvpqxhN9nJtpbhJuMKhxVilYFUWf2HpAOLNI2pAkKl49XpD8%2FOjh2F5nsCj9KrIhxqf&X-Amz-Signature=004b885c7d3fcf711af043ff70a9da97806a3c1c654520504f5b22de2a914e43&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=ae211462bb0ec8057d03ba2a2733c437751d3717e08a7d0062ba2ce42d62a486&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662QW77OL6%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034122Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQDtVWFupiaVEHM9gT2E2MNo9Tt11TJlnwG2Cs8W%2BhRUcwIgSMoIr0Nanl1xXoiVEgExj6LHft9kBvoY1KK28AVuPB8q%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDDxLndRMfSd018rAMircA%2F9irGsvk9IaxD54AsYYhIgYz2Sp2jE91gveLEtElkK%2FnWB%2BOC5dHxRIYHfJgPkIuj8ouDUKXSNYBn1Ai2EP4JgPNePHGGDxgllw0gijeH3vCNJz6BH4RbhBGAKjAiOzah66Lv6ZLv4UucBCWu%2BgBOiGlvsjMpcbUQ1iBxqs267yMQS9VpRUDKqI%2BZkC5cp9TQ8mJaBv0W9kTh%2BrkPay%2BLGHqSxmJdiuab08cpCOAl29QrixM84K9Z9XpGfhoNvLzMJepU94imccWze9TMr1FM%2F3767YGyE96D6foMCkqszaCcQs5eDzc3PqNj8JeeRLc6CsgXk4ZknSIjXaqMOjvBTFs3W2MsHtqmzxCSDPfYolPfhDG2rRjJOfUYp9vclLscMRQlPj7Xet9rKr%2FR1fA7tjcAUl4StRuGrIU4N4oqcQOe6ev9qAzYN22bBupFJEnUoX5qhf9U684Ob6iBvwlv5%2B6Qz4xIHETj0VDBMpGB7VTUJDbFq2D0fwKPb1fSt8wofzkyaRXdEyVLLpc7dTf%2BlJ6QE%2BjeDhD8O732HX8XGI1rlMdTHuNGg1K4rj8Uk87gmkR2ieM9Vv6CwvVilCX97AInyDgLoQAbX1yuph1626FIxGcV07Sl96%2BEyzMKfHp84GOqUBYtMYqRHu6ls9eL%2FQiUF85peuKB%2FZ%2BsU%2Bp0O1Ys%2Fu6eNlDDAGlPLJrM6YgehTu%2FK7PBLZNucZTnWY45Vu116TF11IcaICl3AivI3g%2BeB46Uwjgp9Rq5MgjDDWkYZHKSqvhVv%2BL2UT%2BYO%2BA9Cde1Qk3p%2FTWbUXXs7WEcKgnszfsO1A8S9RGOD1G6u0n%2BsFOIIga0hY%2Fy3UXAUhicVmuYDN9xuzhIaQ&X-Amz-Signature=523757af700de0c005ac747f9996785ffd786d06abd80c799ffb118a1eae663d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VD4TZZOZ%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034125Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQCgdfFDqeG3dsYwf5JzDLqhOF8yfkLuGkDnr9s1VvjOqAIgM2aIa%2BjpVBrQZZiCRU8B9k%2B5VgqlxyMkr0owD5hId94q%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDCFmd%2BnyU9UQGqffRyrcAxy8WGwfILqzL5n02u%2FMWKByI2JGFH0rW3229ONNmTH1i%2BVZ5qKfLmluBJVEgwOdoglrvg2w%2BL%2Bomwo1VFSdeazFVuhYVs6RPsvofm2RyoqgR9ZWIFY3aueZ%2FNTbriVP0vY8GbOoLF3W6xIx7e%2FMUbJ7mfM5UnHvtTKUUKQtUy7r0EJHERWDr%2FrJdrpawLeTas6cOCAuwxjqYWmypHRkYhpKbsPFTh2bg%2FzWQP0hsCQXIooJd%2ByKGis6kI7H4dYsAl6glkpq3Yo27rL3D%2BJfCBxZ9ojE%2FUoKcQgXUonynWrngP14qgA3xR1a2f2YtyfLZF1dPLQrobrv3%2B2n84Tta08sPctUDbkXykZCMfkRGW0HLX%2FfPoxiExn5N5B%2B%2FqT6q4wb3xdl0k38WwRC2WhH%2FehB0N8WCPofrs4%2Fxj4f%2BODaayWBjs9MOmyW%2BUy34x13p41ixniA6WYBNQoTTeN8vW2StIjSuXOFUmF4XvpqNIhPsLq74lWEwgt6do14oYK%2F4hFW%2FASVYob7o44AmB5yW4shHD1D6jwx%2BofzbklGkWcMFhmg5gEws6jfwz2ll12VIWd6260JYQwb6Wzgec%2BUkiPRyIM%2BGWoqCK48GYMeCtGazS6%2F6gMqZ9taBhwaMOLHp84GOqUBnEjzJspxEJkQ4UtpwJGFDEwmyuA7O5ZDzOTJo6DbwZYu9MYgIphALWc01PDrHl57%2Bfd%2Fqq36qXXFWmvi1BUkRkToheWy8J1c14O6rnn4JHERe9FW8OJgQvBpSThUNLSoJROURSfSpzQTyloDhQ6c7jZD%2F364pjDP2TWxITj1cKQM0Pld7pc6QGREeGiAL9NKGSLztRXGBa0D0vRWgnGXk6%2Fgb7%2FP&X-Amz-Signature=9c2f322dac17f008c014b3fa2822630a01d470470c6b6e6db9fd96fe9b8a59f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UH6II37Y%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034126Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIFyQamVwne5AaOGL0dXh4Cp6050e2R5rCQqd%2BL3%2FZHUjAiAH6tH0F%2B2LLHu57t0ncPyyhPGK4XgxEqE0UV%2Bp10eApyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMcuig9LhGKNZ%2F87FtKtwD3RgTQT9FvyXeDAU5bUypGWYIFrWrUU5i0CnQwnqqBWXpmrIpkqnVaHUnd40xnnuw093qhdKa04visLg0blvSFVvv7DQHqHC3iM8tjLsiyG%2BO80cD8PtsqTqK6d9SWe0eS3k5IwP9wnrEsfilbD254s0OCBL%2FZ6uYhwGh4i%2FoN42o8VhMm86UcdCmTluHU%2Be7noDjvf1z9eHaJ37XyYmOoGh36CNG2BN55Y%2F6g6B27iIa1%2BWWDsZofihF0sBJLab5z%2BVVfbQxCvrfbh82UMED2DEzwB8ZUt1q0i5X9pXEaOhOvmvztvwMAWgJU5CbsogWat1OOX04xZ%2BVHd1%2FQ9e6MRCioGPAovp5qmsaWaxX669jbbF6Ar%2FhkUSr1f73Tp0es8fVnOnUu1oEFlUAyVGQkQ%2BLRBWwiF6dpK5M4wwY5JKTXY5lHiPm%2FieCGesOW5PZW6Jw1Y%2FrqDQCw%2BKBa24BH6WE%2BmaFvUWgSEVva0%2FGearw%2BTlZbQ5tFH3SHwsPsXAYBkZem7GUgMIe5Ug2zBtPY8M7eDtJhDOAZQ06kHkBruq22giCvxxiFZdv2kUO28%2BtRZdqZn4gsfdqgo72eaaY5NQy%2F6yT%2BbDckH8%2BhT%2BxW5pzX9t9LHTf%2B7LDtHow5cenzgY6pgEx6OZaNkLAjlX8%2BP2jfBHX48XKb%2FkS30A6Chg5eIRJ9QaWcV2IfpL%2BUzAjwht78yOWnWq8NDOoJ42LvaPkSyKMPaG9iURXlkoCL1Kt3t3iQPYn1cUb5wBh3lyj8jXzpX75mOG3Gnr631u9Q6nbGMgm6Q5zZrBk%2BzXGccjbRa2KwEl18QD5g%2Fezi6hukDaJpinmBhfePDjwZtk72pelXstQs3lbmSX9&X-Amz-Signature=ee588a76efd6d30fbee173bf2110a0a5d9d73b0000b55d2215b5473123fcbc46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSKMSX4B%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034126Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQDk3m%2BG%2F%2B3LsCLVXjzV4px9Ee%2Fd5RcNfXIYSVFyNKCgnAIgJqGZVsVVmFI68kdLXfCFMC8se1Y6oTUQ9xVsSVDBDdkq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDEq%2FtxVCTImrf1092ircA%2BKGxRC6oQXedOFDWo7AqATu5yQgk2P%2BjEEuG5uL6K5OzwSvYyrZE9TQ19ab4YkyjgafchnMkpi7aCEgagXYP8z1d4h%2BAIzJKpq2nyGIr7co%2F%2FF1TjLbkfrBYxkxYgoeT7Dr3Ts8OHb8b8vHbyLRJiqcEU9hixF0zZpcqzT%2BTvhedEVWpUdrpLrZf5V%2FOqi8KPb4h4INUG3T0evrtf6f6XdCxhJ3XrsI6I1llEfigu1tT1mXB4gm0MA4ZfiWwbdnM1gkBSMgSGKoudCqntZxsfvl9A63cofz%2BO%2FhnHFbJS%2Bgf58zY6ZCE%2B%2BJCCSYfmNoNeb3YcL63x3JhzQwP8g5AhHLysihyZROfuzN3xchSvy66%2FWtFpERv4gxG8n47zzDLssWRvL%2FdSI%2BsVIRNy%2FcEJZ6wa%2B6TwgEtfp6RifYgV%2FegB5H9scxXRSrUdg%2FrNYnCRfSiAH1y0cRHmt03z2%2FzGGMyq1Y0os0vXWHhYt8ddvAgHQxEhXbLSMaEF4czIVJrVOgHKs6aY9SEWXg41NSe3BTSZMi2T6%2B0DjBDHdGyax7f8FeS6PTl3pLLL9B2yq%2BCvoNNfMoi0tuJ%2FhqWxU46%2BRmiiqdRdmvlBlo0WyCNrmWSqhGFQ6obUxivQBEMJ3Jp84GOqUB9VHNz0qaeuWdSuGhu396DLmhb32X1SIqxV46CUtji%2F%2BwPaGcJuCsboXWfxpq1XyeIPRlTSz1aCrqvrS3rr10LJnABlg7R1E5ONqHX3Z%2BV1o0btK48aRygjaap5n306G1CkfyFTKMWiLfQZfKAASFOY6nnueR2JiQkJHwZFD3y4WkEE4AH7j%2BprkUmha6d7EM3yIgY%2Fh4Lt5FqliSXkuOB820Ebxz&X-Amz-Signature=f1151abe4a358aa612b7380026594f36c614fb994a79ddb94b3fa47b158a245a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=ef4f5c3e970fa5b6d20a37a0361e73987c12d6815db7fa6e508bf21129b26d41&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L5PSBGA%2F20260330%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260330T034041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIA%2FCyMz7j%2FniUydYum9%2B%2Bg6%2Bj3KyJQLkvYbThZIKy%2BjUAiACliYXvNnIe%2B45q9w8YNp3d95vVxjAyu9W%2F47ELEaWDyr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMyOQacOicnshnnSDIKtwDy9%2FlAYHGOUZCllC8Mm6wwZJq1zra7zft8ETZBJPWssKV80JFKYHdvZCEzxug554tG%2B62ZXqF9fXzAiWMxFm%2FcLfVlUQiWOzOUAxBREsRkpTllLA6lGQ8FJAsxjK0YDJDKktYbHznPW%2F6%2BUm5G9NWgC5249ktwRVHPUdqBqSEnm3I5%2BYVUpmUSTQw3xZwGXTVZrw05hcYhzCKJf2c6vCqMfmzDvu29%2BTzRIoqXxJf5a1tOGJSxa0dH4DviOmYYurwgcl9Q1oPD%2FJb9%2BMt9SGDGQXy1u5GkCBHqMPIjJjJj%2BQY2fKWc58Z2IsH%2B7DwLmPeHXA8diiXzNhnj%2FF2o7%2BF7%2BqRnZzcQP%2F3pQK%2FhEx%2FV0H8wI9ij%2FDuAAfbJUa9sdZsuhCfRq%2Fxg%2Fze80B41zms%2Fpn4tny2EUQPLHWPcG5NUE0Ct0n8pRB2arV62BM1Ub5z9eiVkQh85oGpoPh%2FvhWENHIzDiomoPJads09TPfSdKZ0mXFt4xwJ7R28Q0FCIcQbtGXYBjM48dQyschJFvDYQqoc7TByfzkzSBMaUGeBLZYtgVAi3R%2B%2B69VdqFIks747PeYMvgqMY1sT5yqnaJOMhtmgyk3qz4ujdcFJTaqgabqu3G7weoDqrneN8fEw5cenzgY6pgH91yzg9FK8H8FIlqsaxseZUpQImvsNKfMwMncPMDpF2y0n8sPGXr%2BTmyaJpaEdvqj7AaXIIX2U9%2BW0GmSUSjg1vc%2BgGflwsDNAO9gJ7%2BVrdfzFKhkIDkdpkRP0CAghowwHS8aQnxe6dThjA79ZMSFPnHoRgVTWyPowWmyWokqAgBZMRwBH0TPE%2B7ZsHaQsV%2FnVT5SN0Jz8pvenONXDvd2G9z7nAXt5&X-Amz-Signature=567970f613ceb24c04662300ec7d99dcb62070691aa3aa4bdfbe7bff71c260e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

