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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=07d91922aeee305629e96a732e55db98a648411918d8c52ba95b852bd99f9573&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=be85f91df4f307c5eb946dbb3460ec5c9fe0263b87d9aaa35a614a97aa09ee47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=3334e44e180555228cdf7bc3ee33f6b8dc96c82672a670aec302ada3a2409e20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=3dd1c75d3c5e927be19fe486f6a6653d05359714907a03c2f7955de5fd37f70f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WWE5QV5G%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDUgvmPPtLipQ4zmJTzRlsTAFE7oTIk1mEt42dKSM%2Fk4AIhAIofIaPfcL0uDqXHCOrEsORAanbBTPHKocnn9PP3UhzeKv8DCH0QABoMNjM3NDIzMTgzODA1IgxVHV3gjVW099OTtbMq3ANna8rbiMfyygZmqCS7FhJE4ZFVZKHI%2BZVTPS8k7bNIFgPqmMI34qKcJhaVqU9noSaUIghWlcoKtdfv3pdupf%2Fl9xhtYKOVAv1n0wuYxSzF2urZqtPZN1NYXYbsH06N3JF%2Bs9VzKmiHqIwH3CZbutHulZ35VeXfE6fXrh%2BTwjQ%2BrBZXUIeoTXFNETLrW1QZ3mbIeqoQZhgcBTilg%2BFS%2FhecGA3QJ2Aj%2FhjZ0qE%2FPwgs7JiwWWsiPQF9Nm3Ts85eFnp%2F9XNT10pdRITdE2mpT3TGTP8AnxNSoMdKRhC4VMH9t9Y8846FSQdZGTWN9GDFGuP9cm8sGR9GICmgx9hr7m6O2YGjSOmoHf8n5lp%2FZwTY6TS47kDG1ECG%2FlkM3LhThHur3xxKsYEcWIXw4ivta1tjcRlNcD5CGTbcK0%2FLDIq1Pl2%2FgPLQ7eOlmi4vYaVvbsT3u4l42rrkAF7PwsrEDebTIpLiNEtwbPW5LrIIsJPb5%2BEmYmPoSHeL0xePKSUaPcmVc7DZNhjfqL47LLXqPOQh4Oh%2FRuBTXUaXzOgLLVQ7tvQS94op0vGY6qCKD8VPo6GBKBBZNQ6MdOsWWE7B9v6P2bvOLHDj00NEqw9xGjmP1RjS%2B64s6jK%2Byk6QDjDQpY7RBjqkAZI6vAVyMgk7O2YIQpGeE2Vkr3GPaEDZqjnCqpIVHgSpEdFunl77a1MNo26pPMaRzrE2G0Fe%2FKsl3gZb5kwVSLuAnZQudWO62YFmdtc5VZpVgUWc8gLw69PNkVacsewQLVTI4KdjpGOkqOdbJWFvBpYZp033qfnHoC2D5YEWA4kbY90krwnR%2BnjEnmZiT%2BYBfgh5%2BkmyZLutzVQ2cYbg%2BZo9HZYr&X-Amz-Signature=da3aa0a8a7a21c25ac1069078b754b2364bb078205a8771c3477920f3c6dbd9e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46653XQVLCJ%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042147Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDggXgSeGgarL5GJFsVXaDPKegcl7bJe%2BbJvG2rn%2B7higIhAOxmqqvXBRYkUENtbghibL%2BGlvL15P3OUkq2aDjUgNpoKv8DCHwQABoMNjM3NDIzMTgzODA1IgzMLmXsCJaILlfxNfYq3AMlC7yWruVR8uEw4s0Tv0ZBdCSk4CfE9whohtvxMXSdMMGmkhi9R8gI67jKcSpHa7HWpjEJmVO6y%2BIxGOh5pfUjHDdis2FQdEMZujxl%2B3LhaJ%2FqKAp0TLztckFvp%2BDgf9c%2FHWrvrIbeut3x2WpaqxL2qzyZM9B7icU3M4a3PtQlRRVu%2FTdFEchFds%2FZmKaxmZeTv%2BwVIQWLS3htakUGnNc4YpqcvDrJNHiWyHSKH4dL7zj%2FfRBaGHeF1tbXgy5HyKinKzl0C0uW7i1HLXi8rrjt6SMLXxUQouw4ojHkmASCcujCyUg%2BdQPBAYwW2Uw4laSBK%2FXj7EakH%2BD95rgzAOBAIVxNM3vVy4bVcr%2FOeWW6oMGaqwGzd7AUxuX2qlRNE86yPl%2FEmKJXDKbIy08yANhu4HbzaCOAbj%2BtcH8lVE1NFz0sbQTRPDQZfnTuKAU9AcO2fJUt3qt1KoQ9RG5KQW2WGzjJVzRBwT6YZaeHRRDFjtcj33GdphHy3DdKe%2BZyMRAGLzuutIBVOi68XsUP9I4aossktICAhrk5CkCeCXLuZPy1groHk7NuWI4ftg%2F3kxFX9d6HufTgPYFNNpwU6c4pjzOe%2FvmN5ufu%2FmCXGNl0ptmmze9WWLaH%2Fm71MTDjpY7RBjqkAQuBZvx%2FUq0yrcqXuhyQyP7b1iSGI5ZZwcwR1EpfoJHZf%2Bk7kDqckdr9Ty7FzHJ8bb%2BI69fSm0I6M37T%2FnhtE4nQz8VVMA5CXtRJ7kFNWHNVfJ8GK7BhvSFYt3EMo0KtWWMAG8nRVwLCyFO3CVSQ4imZ3day6TXbMT1RE7hE%2BRI51crTLAEHRzR3CcF7%2F%2FJZ%2BxCA8jicIGsoeFdmfNVo7CemBoPH&X-Amz-Signature=3cd094efaa4cd8c6f7a6cd8ac078f72110b71d7ce498930b82f126f254e5b828&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664PLCJHW%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHdEy5jxNZFAsh9byZtswUCFpp2IJxEwwP8487hDs7qwAiAULu9F3crX5BODgbISk%2FQPvT83nQY7Z4l4zTAvN8AEair%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIM9vh5dRk9VrSs4nMHKtwDAhPnktzKN%2BvqPUrf7KUDARLT%2Bnl%2Be4%2B3PS%2FxmEzJb2QkW%2BIf2%2BDN3dXce4HzngJMavh2mastTDhiT%2B9Pr7rkbls24Iq2OXu7qF9Xy7V0%2Fi6FfDdbCOAqrIzRns%2BUGTYKkt1GHDlQc1CjbPb%2BED6ubXH95XeCbn0lwnh1My6eojRIPK0EnE1FILF7wYerlnqdZ0qcoCOm0%2BeMvqjNVhaqdt9NQzFWwRuRQ3hv%2FsPT%2BXWKzAO%2FHhCAySDMoXLkvONAhZcsiiynprW9AQvqZ5WHUZ6IevljvN8uRy9faNUfWSkPa4yN0H%2B%2BboP83LNVbJT1V6xcnfEtneEAJlAtDiQ4QLENoQb2%2BCI2TbbOwPokklAiMd%2BLrsG5zjsP1rJcte0dl8i8DWD5x4JV02yt%2BKI9wq5uYoz%2FJKPewBt%2FYsZ%2FeAeBqITRx5p0ZgqZCTyp5epIbXo%2BBTtJ7kXgOMQwLEMvveYQJ8D1BRfRE%2FX3RDiGS9%2BzbzqMYqUoCWnzYiSoccnQXUAOeSSEQT4FoleYBQmhMcixlhFaVmo5YeetrbO0nTEv%2FPQPkvWwvjB9epLcmXVsMgkbrJkzrklzwD%2B%2BRbI0N%2FhTRzdr%2FSnw2Wa34CELGmUPUtc1u%2Fl3msbP%2B0UwnKSO0QY6pgFeqIJLKKUglvgsaLWgc0rlISMrG%2B4el0U3tt2hYMlxQicbzEn%2BULUyUnAHUwloVVaQvixmuM5bOGiBZxF8FF9x3A6MEgxqGy%2B1Si%2BornNY%2FkyUV3Ua0aMKbpzmg95y%2FGkbkveeVjR%2BvN6KTEPfkpwpfb%2BP6Np%2Fn53yNfPhjTSFQCdtijdy5zvcx2MyEeSon5%2B2sb%2FiiP9IDkbBJswoSLEy30nUTLWn&X-Amz-Signature=f820cdfa30f65bfad46529a9abaf39f24a207783e233074ba6cd421c6d5c3061&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNLGKH35%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCa5Na%2FARW2bRGtLKlB1UNjqiOMXnJHS5M9dGklgPOAEwIgO8mdM5Xu%2FlYd2b%2FnC4x9RrY%2F7h9%2FsFenN0%2BDHDHsGpIq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDOW87NIBJV6Qi3Ok5yrcAxXslBKyjLfHw5aip9l9lcLgh2oxc%2FxkjkmreFDozwnG7lQnlrsFAAurs%2BzsmiJ5%2FLnNSXseye0Xwng%2F7qu7WK%2Fw87r4YdgSc7m9A2AevEaVOykncZibpIgAc%2FyvFjYabzaaqJypKfRHe3rOobBVn9YmWgTirbBT40nTXAl0p7CzpW2g3cCg5VGtK9zqpmULB%2BeIaZ1txTBzh2GLZJntFoDNwiTvlF%2FE24zogm1RMxB9TpOizu46nSzXugVy1cew%2BZPGlpfpe985w2hNVdiZgbRJ1aJkBzvkdHgmZ14hB6SAsksuf%2FV0%2BL2HXOn7OI0E4BtHQC0vjS13OzQwgmYEZTzF%2BW%2FG7rmv8ElvnVPISUa17KJlqfDZZB5lpT%2B6nT2ycV3glkPd7iHvEKOFjQSqnHaAT%2FY%2BBiq4ZeKcVKPNnXBzuVdzc1MSLHwUqvpJwqAY6AE%2FZARZx3r8viAP1NzDRJsWTbttgZp1iDlqqvlG5RtzGo%2Fxq%2FEqFqVHc8p1tCs1%2B70u6M9eGhld%2BTTncPOSluVuhQlXUQ5A5cKhy3T%2F2dlYRlpJc%2B33MP6tExIx3Y9p3HRAOkZV9yI1tS1vaBbKaoP4Ms4EmRu5Yq1CbLChR7qNyf%2BDEM1guW9Oz0%2F9MO%2BjjtEGOqUBeas4D7YQoJOaB9eEVdXGCniMQecIeI96BoUx%2FLpWBwhRHHafYliCBQpGLxVcantRwQFL9PN5knAc%2FRDO4n9hCyY24GzykQGD1JrqQC1ByclGDfn4zLfbHCDkQlBTMM9PC%2B1ntTUZK5IsGJgExeD8A0KC%2BHR5HSFi%2FOsechFnmNoYnnSOP8MOWLrCRc5MZ9g1Mjs8w0fYlRSI58aKVXhnRfB7Epo6&X-Amz-Signature=f5a2b235204f29eebfa36cc76d3a52d9c4d6e2e8e620654f59cdf170c6c2ab0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=7503badb05ceb264e9013167286c872ca2e9d60533faace7aee34021fbf334bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=66ce3a076bc5d898e81159a3c14efedf43492540061d68d05b7be1e3a5428d6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46652LRJ5DS%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDpD0kTzuExTS4Fr4NP7xnXDysjB8SMcsOPPGIkYNf6OwIhAJx%2Bzh5KobzT%2BdcOBwm3EcWROCf%2FzqBbUgUuwGhzD0mXKv8DCHwQABoMNjM3NDIzMTgzODA1Igz21d%2F7Mg3ULMvkm8Uq3ANdIRXJ%2F4UtNet86%2FVyhpq0%2F6i3iw%2BwLd53EEymZoZkyEM%2Bgzo8u5gDh3uPEaa3OhXCnWyZknUucOXGZhk%2BYM904Dtw4qVpkcTcJLUxkr%2Fw9sKFPtMeFdLdxO%2BQAkMfXy%2BmN18ViC96mi3r2BD2RSbLAMfHR%2BkkK55H9IdnNTGe4EyC8i%2Ftp3M0hal5RtUfO%2FHPpVVuxantwtI0q%2BxkZr692J5sx69RDRLcbXrzoTDXj0KoqOt0GrJh2xocVkI7USN60M9qEoLnZGO3koxDem9swh88Wk%2FRxFGCk79LR7B86EjQumu7B1r9z0oiaZvK7Z9rPa3cXfagkao04mcoPs5H%2FM5wVdyMP%2BiMbPtJ%2Fzpdkc%2B9E5Elpa439401OdstnnOvnCqM8k7UtomldR5E41IMuaEqZ4ffNJ3QGwxNBOS6bq5GgyZqFqXbdbU1MYPNWOBELmtlh5o7sW2XV13ax%2BLfDPV04f7SwoyySyY6gF97bdXUOfZL9Uz4%2BJ7rmEkR8J3jNFDxfMKbHX7ypxWTapkwKtwIXB1Yny0vgZ27GwJ4caqQ7nLV7at9EJpqBjFAD8CaWaiuqk9kG38vnCu2bMlK2pKCmoneI%2BbIh7FpxGoX0kPplROpipE5yecydzD9pI7RBjqkARUbyEChoM6X4coGXBYP73xpWGpB9rccPXwZ2qJNw%2BjsDwdUjXD7E%2F8JXSdcC7%2BFWDVryosukKDAI%2F8cpuhELk993M6vVK4jtLVQKf39DPFu%2F%2Fxj8UkWF1%2BfhSIxKSrN6ZwtGd%2FsjhbQWpNhzd6eyhlcsLZnknkmujEFWxOS4ytg5%2BWdR%2FDhuyVSSx%2B%2Fx9H9r5E8hQpdfGhWKfdgNH8A%2BpELQVDO&X-Amz-Signature=a3cacb5fa30398c0e48f4c015e202be2250a4549212c2a8d3cadb919ba7c122a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=5f0d98f3533fb55c16e18b59842364142aa29c320aeba56d07e53833a3f3f1ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W273GKKX%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHsb9xZLaBWZB8zhW8U6A17IJ6DhsvxWjMyRyNWDi0i%2BAiAxYcVW9IaEff84kMxa6a5MOJRCSb8cY%2BI83%2FBB6aJDPSr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMa%2BCsOpnuxGEHnmK1KtwD32bpxiNWFaMRae3RMMIsA3UnNUZH0QHkW68zRGMMBkn7B%2BI2CbAX1io%2FTNW4ZPUvjEctfs8u9ZGSDDUg8%2FHo8RuFkoaZNS63bxc7CAPvF3JFkIINZN%2Ff3IkN4GdalpRdXqjGLKEyY2K6sBL1Lfm8rKoQ%2B35uQd%2BH6oZw7a0H7Rg3Ls9KiEDvwqaolmCouxxb0%2BYGRd9Mk6U2B7adFmYShArBxrFadukOHaMFQSWxSri4i%2FlpeL6CsdkHwLFmFd18UtCpkchBNy4Z9wBzh%2Fbd1Gz4RcI9qDK5KAxhBnj6r5MN7xlDvnkKQ6dCtvcM31X%2FPCP%2FJelXbXzIk4UW1kIRzclA3v3UYB5Qqfhy9J5y4RukSaUNa0r9Ob1WniKAqvEaEsTxOKwj8HxzXoFqbGCi%2Fp0%2FzkQtxCRllrHrr8Fvk1ucA%2BDp94J%2BQoXmG1eJjQ%2BAWD4JKatY23ENULDxj43kxTsznigXU8ihDFT3onApqarOrmf3%2FV%2B%2BFRPUn5%2Bhf7pLeEUF0bGDsGVtd2X38WPOfyfoqKLsKpjkGKW8EgbdFQvgqW1Lsn532k5KMVFtHDgWiXzbBySUZKOHZPU237B8onqJzkOTWVobIrJxG46PZUCSteAYhU1pV7XaqwYw8KKO0QY6pgF%2FclORet8rMQEmb6gNJalIz5sRG%2FYXgbztLC%2BWCTrjArpT%2FFttbcvznadLcDtRBxIto0GVXEReHUptnZ9yzirdnj9mKVHXfDLsl7e9eauTISRN4uthB%2FcC%2BciuUVxD9EMG7yohFNkUypJoEt%2BHcm%2BSPhKMdvg%2F7xi9s5JkAuuzuu%2FpgGCvMZtiixhB4BrthFpA0YHMj3SOtvwp6He2oBONehj73JVB&X-Amz-Signature=6858b3b2fb48dd56fabe31928574c87e86f26e090a3c657d9c2c4ac7b758f147&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664L5XFZGX%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHo%2Bfw%2FcIDw63rI00klHXis%2BhGuqSiNCh4MDmSQWAqbqAiBRR2R%2Fl6K1Ru%2FTGHRnw6Qyzdl%2F7GB5aFMIU2oPuqViMyr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMxtzlSh%2BryMHfq%2BhKKtwDPOYvXS86y4iTvEKAKfXyoukGQq%2FyS4MLd7gPjJm0ucoYju%2F28st6sxIrUvMTsdA83B87%2FbNZdqkGYHSgiRwiL8WziyE5hJa%2FRTeQf0WSCOHCgzh3XOUOmcO7fAi9WbI%2Bph9bzVacz2643crl%2BZQUEeuAMWTUZoPQxRrVyY8YC0RrWT4DE2hkUMljm7YZ9%2FyZDABuFX54OZ6IsnmPkisAOPKQdwhd%2B5wS%2FPcXUDcSODtJwFVPdjeTgdrfH0X%2F%2F2YlMAUU9yUOHf4ZXkUo4ViIraWINxETKgdklSXzHAnNHthyXPivtumOBXuxvQ85KLGy%2FZmqBZ1p0rIdorPT%2BiKLE%2F02nU8rpBDgzSTn0A50BcEttabSlZ9DiuKfBU0C6av1gbDrBBe9LBO%2FtzD%2B3O06CLG%2BHQDuMCr2N6YQxIoKpFquBKHtOOSRJNw%2BU2dOO3ZfKKZa3Z8sreXKyY693Z9Ha7jOQZa1Se%2FHk1km09Jsxvt8zaVElF9U2hLt9ODojV%2FKitjBkLo6w3ymH%2FhXFwZwxYiM2g7ZjSMKCjUoAbng9g1H63HBLpY%2BaN%2F%2FPGlJ8zFSDdxUJzZ7K6jQhaZieaezh%2BrMEioSgwqZILVs8yHXmVbgL%2B6AaZUKqHZK9RYwyaOO0QY6pgHV62h3Cxnu566aee3eqFssxour4N6aBt6z%2BE%2B%2FYs4u7xpSkPwSyzG24UcSDypLnuWrWcNw4X%2BHm3QS1pjLundy%2BIHG5gChibRjLfXAg%2F3iOpgTVBV2zeCTQ4pN8Vd2iTZa3Y7XNFpqRaljJ7%2FGQDjue13hMAjI9BRR87%2BO8cPXKC3Hj9bZHkrgJgr3NuEA3Mv0UFGNm5BmNmVwah79AjWuViJppmzY&X-Amz-Signature=7fc946a047244c1922b7342aa6007e2bda7803a4a426aa78020e52e3b667fa1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VD4FNOS7%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCN7McLboRL1f9F%2FelQLPASPd6h63w62Z4F0BblB4OL1wIhAK1ym%2BV%2BRx%2BboPKPBAV4GLiujt0yJGRwB4oF%2B53iH%2F2RKv8DCHwQABoMNjM3NDIzMTgzODA1IgzmMNSctgaVLXRvUqMq3AP0KUfeNI5FdmlQ9yeswfLbpF2pkNOlY23iFFZQqdce%2FZNrZdouTaloxD3yo%2BeW%2FxOJqsXRoPmbtKLYlvqisUmhNYpFbk3u3GzHI2AgfHBmoAHD%2FrCb1dfeHFqjo2nENuTkWZ66ZApuq2qcA4NEa4oAkk8VMcNT9J65bOmeULCaRhNTiUNfVRdruTN7eSsyFT16qzxNo7VM8MqSm4PgXBkmJDwtx234g0gr%2Bl4YS9pkZRCCVYkvEjHdHs1k3IjQwK4ijkQKlri7Ws%2FsHD1o6xURAeqmdqh2QKFI1kiZCLQEuaY5P2T%2BvcfAZfpZXlCWsuMpj5St9jr3KJlkuHipZQFjAS%2BoWjbiLCnHW1ge%2BKiOK0wUo207uuxHhZcKdZ7laaMfPpAdF%2FoSNgoG287%2FDQzp7uCP42lu2LuM8kdPru%2Bg3%2BSJ6pw8B3PRvAi8DbyXdgzBD1ePdsW7FfpP%2BEGtoQNZTaKXU72jHqVRe74d%2FtcBTXeWoZQ3XL6xJSZ4lLklgCOKGJUoY4RL%2FYZgJru9zVDlgFIemBbIXNioBhA4yp%2FoDkuiUB1%2F%2BwWWqxYAjrdlq8Fi2aWCouQJ5%2FSA5dIu52oVTo2X68DaiXZqqdw7cpKs71HGXP%2BtlE5QeJmvTDDVpI7RBjqkAWxFcxOyYbgoU5GBtvNjM4jl2wnHVTASiWwbIzzkgT6Yfn9%2Bz98fE0%2FJ9DRZwss%2FRruBqSQnNkPIJ08dUQVRIexhCf8waj5xGciKMy%2Ft8m%2Bz3qC2y0NIlt3t9OLVN1%2FlwB88rD6uXNp3aNBtJWqC%2BuvgATnpJ64eyFxc%2BW0SE5W99XKD%2FlB0uzcPDRsB06w39MqcIDvIHQ5zOtwpOPKFiPxmrpgU&X-Amz-Signature=c7994a75db6abc13ab6515a8fa2b8b83b36b29cd5304d3b623244d2ac2abf9ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WDSNJ5B6%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCLgEx9bdtwU5OE6js4VhwD7LfC%2FCxFTqlGmIHTjE%2F0JQIgWOAamOmYPWnNGjh%2BsmFA8dywaW15hNjsbTHPsjPLiaQq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDHsoGrVG8ms6PTQT8ircAxb5LMTocb3u2CRnU0lUZv7T66dpnYZqFxPjdI7rukjqcPzLoSd4q3rMle3SeKJ2L5TfsfIzZLnUPrbCoyRomdr04u0vvesDAJtiIWDttoSyPtXOAZ4YzZ6zzjX9NhoJLFmY7uxctWne9dBbwostU5P4miinQiyo8%2F2aA67%2FOsvyrDx26dL%2BeLHHzDfIXPidn%2FcyU60QlEBuT0lDl%2BlF8Wn1wfbr9imucMc06qFIKaUDKFRMtt39fXkoLApOUS3WHV78MxyzPd2FXWXgN26B4jmq%2F5ZgFYhXyKlM6pRqrc9IYCtO0SnfWfXVNfaOY4u0EKbjPrUdbYM5IOyAuWmUCALIAq60OEIMyKp8b7Jb%2B30Z%2B02lVFNHC9X0ljLyJzm3yEJsuxSb6ekK2GCE8YjHssHlntngLqjKLw8wX%2BGGM5LzJZVhTwM%2FcmOxSYO1mbrvXPZXstFq8FkOEmeTZDqPIDygQwDaC81kvSgFvVuUQvmTMQczVdfHYAsQur45SBBVTFy8og%2FseR7CRQTv1hmWqNjnb%2Ba6d752TP71PPWyFUCVrrc81WxRlXCtXYzteyyQO1DEHvsD1bdqFY96zFqa%2BtYqnD4FNLEBsmEccaHJ4da%2FtRkS5p8ed7oA4haRMNOljtEGOqUBcXsoYDUugCz6rWY6Mymn4%2F9YL2iXGGOgWRtFeUYqL%2FdcC7aNU9VQZ%2F%2FQgHyAehGImj%2BuxtTDo73n3JBLhPv6HYhFp%2B4lZsgykbcPGRa%2Bdi5BL8HogzIdbZyMXyIKfhgCcjzzhhvaayUnRO%2B1KlhPgvbxY34xw19x4Xf3UtohV8g5HZxRwq2MmBlV8em6HMygFav9lIbiVuX8yZao0cxSOvnhgxqn&X-Amz-Signature=78652812c61207d33fd55c27340d2e279234827a20582c84ab863254fecce738&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=e1a0fa09bf013c292d46b88716e39e87d19a107e8d5357cb7145b9984cb6c935&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSQZXE%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T042137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZmTSmYjiQwbu%2F0qWaY8zSoNNDbsfoMAclBnhY0CSGdAiEA0umc0VZCJwFqjBbSdGvNzGwwspHEEWiAkghKcLG1eN0q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDPJmCA5MrqYl0G20SSrcAwW39GGn8PDkI2cqQwKIthFtsNLnTkWVaQbLDAYzLZDboEfQSvVapsLDWBcDGv6d%2Bv1axKZxAX4w2AYPQQeqsTCPtZtaTTyj8VkVqkYmB9hYbGCWqxw4%2B%2FmpU6DjiNHS0mPfxMh1S%2FDkXBPbsSumGe6sYidaIvVg6hs3U8WZYZtSiKgLf9%2F1YnCFAcyBpGrQ5jZ2Eir9HRTaXJHNAft8Tc0osnvzDZ01j48jVJ7s1KJAYl%2FCP%2FR6hmbnKYpJtqP6mbYJuru5HuehQmXIiBcyi0XroTvIZwJVA2Kx4%2F8xejnjtQs2LRV1m68fz4OYzzgiCM8SMdyOQRW1MnZH6JtsGduwQ6nBSPQt5BMlatPGTQY8JCqKo9HmfVxk2o24sPcZo9V0nA2jmAIgblEEAmkIgy64WmWf8St6%2FL2z%2B8IxO6pOAau%2BSZBxqteYCdtFXfoXJkoRsBJaK9dqaxUBo391s0j%2Fwy8uz7ywM2v6kRa%2F7mGSFFaFt2AdnyHPuCo2rj2njP89pl%2BUN8uMAN4lWENosZZlMOC45F00gd13dy%2Fv2Tv7ukybQa1xfkEmTvILhWzLFGrZiGsqdSqwbiM9kkCBuMfxMaInhFQX5Vwfyq4umU60CSxmC0Ndr3egGeAUMLaljtEGOqUBbtYG90vnqGvpJ8h6plMYP7boTx5D7PufSNhR%2B8pC8mWGYO41lRIOVA0TtDGj4CITPCCTIqp1TyUQUYwNN0feU%2BZTgqakTva2UomtsOV8EgIjav9Kb4AQaxVM3vA0r%2FYZRwWd1YTO1dND5MBwa5wGQj5nze6z4aJmzI21Vu8j2Csi6EKF8r16vwuQOVRZ4d8s6njLmdIT9z1Tz2MiKfNiMxZFEWz9&X-Amz-Signature=e24b299b2adb2a9da84af22781f7fd4e69c0b5d527dc1dc04e98878f6d205b48&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

