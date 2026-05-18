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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=8a6e000d0ef772e90d4cafdc60fed7e2d687d55219ab24b5df92193f3b19c3d6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=28cc5991275019e97239df114239779bf1d49d608238d3dec2802a21a473ff7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=8c1b2b7541e243729d8529c8931ddab847a316355da8e6d82337698b1438cb74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=0b6218b97c4143b2b2f038c8248d352dad443b2007d05d24a2d13c43389fac2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663T35Q676%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEZFr%2FGQhpjeEJkZe%2BQONVEgJJ6MUUFzA2lanMYIs7cQAiEAmM%2BMwupyOOPGdzelNIy0wXLFZmmCU545fttvqxzoRpcqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJXChuoBSlVKUckxySrcA%2FJSjq%2BkEh88ZEJmtaR0omBU4WEnMvVVuiJVed2fzKQCWutua5ovLKwHTyQ6NaZQl6x47wXrJ4gNWvGCvRD%2Fi%2FA%2B5sdtAiBoSF2Wf3O%2FMdftQgpCCLRtaKK2SO9IbP66u7Tu%2BuGfYDTsO6bJP7qZDS6omZQ5TWXSqWLmDmXZ59zOm5AB08x1fg%2F6%2F2XAi4olPPBbmU%2FVo2U9D96NopxD8lCO%2FY2r8HFfirioKMrjqJ1c7aCKmYRKswCYZzz3umuPFuZwZmbFpnlIAaYGE6S%2BSRPcagNcmH4LQJBMoIv9KzTSV%2FSJwYTqg2f5OdKm%2BadxJylP1%2Bb9GW06ah%2BDmZoFWKkbh83nUduu9yoNRA%2FEQ1dCWn9A2saVJIyOv4XJ6JR0k7ODTgGQz5yQcgaEeCyH5JbcK65jx1JVjJGZLtTUd0kEhNfqs9YoqdJY6w%2FkFUTuObi%2Bixf7pXqfsoWMRbWRufj6O%2FJfhbhbKr%2BjmBU9y6Aacr%2FhqRj60qbk%2Bl%2BjwGmBwce0YL5pUmc03rPGVusneaMSL%2BMha%2Be1M1e5PsPlu31eGQRDSuGd68pi4r2hRyHys3b%2Blp0%2Fk5hPd4i4wATnW8Bw6kg6lK887Mn94%2B0N8rV40Z0L8E1OGmhNF38KMMCFqtAGOqUB0mQd71SHLrqmiNy5lWbS6bsmb%2BL%2BY7xrY7arLxiGKHquOdY05iIYXTRG7HUX9k8GcTCm5YYum8dP3XQpz2NSkHPUA2ZemYQ3DFe%2BdwsLD0ekmsVF1%2BLo8GKVoyoXsllRCLakPK9jD757L1hfmPa0noeVgYS54iZlpcCj%2FPyuddZACpvHRzzss5%2FpjwBFrFKESy%2BICoQZG4dCAwG3JSelmtV%2FtsV7&X-Amz-Signature=82a9deab412abb5e46e625fcf1ee94feeb562168659ea4c88c48bcd2bf5e3510&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466524LKQMF%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044437Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID8A9Ctzmhq2llAstEAB4mqfedT9nIUjuq%2BtsMBiDot%2FAiEAtYCXiRUGFU9Y2S1yW28gNXq%2BrnPpLsIwodD7ZEKnMNAqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJGiuNiMpV0DkaQf2yrcA3OjcqQZMXg76u8Kxw7jTT%2FT9if%2Fg7oFXVHXqJJOtg7E8UdRi8vzhKBhvahzy9II0NmQw47WgioQRT5pOOVrKV7tPcNT9BSBg5womkeLW8GKPDarBSAcMDLDrEBs2EzUmTTeVzwmJ3OciZNRhsS9kRC25NcPJUVv9Kxy9%2F2CJ8ELzgZnZrLb9XmsjfPzTI3EgAEFpzKBqRcCcxDgDH5%2FaxqCIrrH22a7htDxXBbqMOsAZITMyrpQr4Oqu2QQf3IPbiUhveIbGi0Ltp3gmcujae3B3j4C705%2FcrFMFUnmkt5R1xVp%2BMEsjdrx0%2BEFC6mvd7L3Q1Il1%2FMq39RaT2BtLC%2B8k291RNd4C9IkTb1iyuFcZUZ4qZ%2F43agLn5AV75e9buibc2ZcWarSM4M9kzKfaOZGS%2BaV%2B4MozF2j117ZPGyUr3S5pnjtcA2oq90M3J9NL1lSu58U6inxLJzUHwtjdrbrmeVcjc59mdO384LjITADQqN%2FeNQJ1%2F9r6AdIeUQf003JgjcolTg2GgrixsqwjFtevhWrBXvNkkm3D4tXwrSV5Pm0D8ypcUiVouSRVs5kPwm2uhqnOGl2U7gky%2BDQC%2BXdEQWZxE5xz%2F6l7PxAPac7Vcj9PZVcavW4R%2FFVMIqFqtAGOqUB8LR34JtBOuFoyAL9avmC4CpMklB0NvwYkSQuWgzxnfKWZIpUuid2RwsLWTMyhxdpninY%2FhBstg19k6jDL8jaZVAva0HM8PsECgS7L8gn5cjB8MU3F6jlgpzI10Cn%2FF%2BASvFBnMTjC3f%2BvPgNIzEfmjscgUHRXHcqIqX5YrfAKMoz9CIYjzJT89qREcOQkoqR%2FcJuEbMgqzauWTZa%2BVNhxs9ZWVu3&X-Amz-Signature=8155fa69a4013c7c0dbcfb16e25546bfbe73f046e6feabdd675a5258f6e7d209&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLVW4WUS%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044437Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIQDWpWtxyDRo4XwTpwxX1TVmi1PpbmRNhdCpuaGwY2K%2FOQIfZe%2FhtlNJo0qpQeKgfz5jGHKfG8X9jXO2%2FSfHQrkn1iqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMEPdsg1y8b5rpXjauKtwDRxUnOd0M%2Frn5eBWsTvlrm4qoKDsTDu8KVMJD7OO2waRYxKN0jtK3kZzCG%2FlUhGGlt7HTfFLevCINx0Oq3Qp6%2Bvql%2BubDaYiegZl1pJcz%2Bq5SBlZSF6CgdYKEiHSs%2FPwZ83uy4uG1%2F8lJtDhcdvSWBGU6m9pEXX1mmUSDfwUpdtRkq6iYgG%2BQ9hpC7%2FCmGeW%2BJHjvYgYiTok5fWu0mx%2BAI0AbKOds2PKVD78Xbjkz3l4Q8jxS8s19T%2FTZ9HlfWpvF0W0UuOOAZCuBs%2F2pxY1%2B%2BYLtDO0coEQhqSrBXBUgrjfkWxRtpRRzDFFfnN7U6f20sHjfpGYp4ryzWqKYei2iE06tUobcNw3h45DgVmzZKetxSGC1LrWUUCwZBA64OE0GctrFhyqxAexv%2B4dH7KZsGQZWjhtLMmR1ItuKgRJfcWQku66VDlyKo%2BtzbWTsoRDVvKp1XoS0i7PhvZVGA6c9e0%2BDgNUIIpHmWPP5OrNIKXxGBy%2Fu%2B9FKHjrGgcjHfIodBP3QzrWVzxAbZiCPs2lZt0phWuxeBVz6w7ySxUhMZ5SEYKy7Rjyaq0s9Nf2OSSjmFF%2FdsUmzG%2B6aMJdxVXKKMunBWNxmytyzp8PMiOJGoxtl%2F2jDgLhlNJfllzsw7YSq0AY6pgGFsIBJm2lPgsBNp%2BjVLoxeNCxh6GIaIDC4aHP1XiXKZtYrmzuHLrnIzFbh9WZRg1nf%2BaIDMdet74glks0fd21No1WWGsXH7H8a%2BU5eSQVXk2laE%2FDFcrb58nHOFyJtTjjmjqY33UV2Nt2ry1ZsWw%2F%2BWpzhl6ZksV7bYJcslAcpq%2FAGn384mF1eIdqTMlcBKBGDOl36beQCI7SJWweYNaqIwm5EC3xq&X-Amz-Signature=5fe5f77a829b617f8ac97fb962ada132c3821515cbd7c598a4753da85387177c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SRQTP66H%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044438Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICMsx1vACtjE%2FpCmNVB5OPtR7gIeAFiPaEBInSTeNby3AiEA5m3R9Z8%2BRjtJiD1zloOJ4xKFKinmC71k6DHQ6XvaMtIqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLGRe5IPAaVgD5u79ircA0WD%2F1sMj6aNfFYzlqWbkDQzZPRpVZmcFOZaaVUv54MK%2F4hWHCnyYQgv5BcSk3fuaQOp2OQaDH7f5Ly343gnyDifmMOiXKx9D2WuTjgLeeBRiNNw7MzLqRzPTPpuFZLfKgoSrNd31q0j2ePBcdo8W2fSWCeZLAiwiyoIg2ocvk7Fu3avJptwKhRSh5owO07lB9IgJr4Cu5fb%2FY2finTZWB3yxH5Sv3HB03HV4sMcO63MR0iPTUHbFfLX7kAi3HaTDAoHbrICMhMXoVzR7CsG1tqmyWZpT1tFDO1%2F9oaoCz2mmRPeK5Oen64kNKa8kQtD1Q64YzRriALbh%2F8AfGZD%2FwZrJfOaLphQp%2FTU%2Fqo%2Bkm73NWjRZOvm3hFtLZ%2BrX8nlCQepe3ybaRYVn8fWedIwheO20CXfeSDN8eKqBgUbaTjv0CqwHo1zM%2B%2F%2FhpdDpcGMuFnC1ZBzS9YM17Kyp1BiG20OnKl62iiwCFe%2FYyMv%2Bc8UJ4FJTeggB%2FtkUZI0ZMe9O81XHZDRLCDJ%2FxZCn%2FgN%2FtZ17Sq7SAlz456SSEI7p8pZs7T1FsNoBhQayRLjC%2F6QtfB0dtfv02vWMtA0pQHXbORMsebdWNKexGfIE8erNzN2HbCWBp38uXAK11aGMIyFqtAGOqUBAKPUM71LCBoH2n3dQBE3uisMJZRiG7iaSINXg8Vsh4L6iQybjRfIiVWq7f7jCznW8o%2FbAI7KdpBzwoOOVGM2z6YnTXhluqFYbURqFsD1Nxw7T3Jp0BrMjdBblJpv2HJvV5Io95YOZZrSDQolUsy9%2FGt2Ihyep5CWbFsS6Th6Y6xrvecsKcdK%2BU4R020gmGhK306FgpJ1ObxWMWhWFDUqbelK2Dka&X-Amz-Signature=8afd4711d8dd2d0b577b33ff6b348ece5263cd37e2f1f69ed2376423fcd13a2f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=58d0e2893b45f20a7966e1d2dc9554dfd4074dcc270e2831e98904969794bac5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=889fc08199dd808f76f33a821128f9f8474946bb0b031fa5f02a1041a96154f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VHHEEIFK%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044441Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID6DWaiw9%2FfVkfOCaoghmb271YJsMcagpNeke5%2FRjND%2BAiAmeXSf1y1idTIKv1jL%2BiizTOo%2FLFSScd021s7KV%2FaZkCqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHkkCLGcG16FxXU%2FkKtwDGniNIDTaqmSjB1RrvKQJxR5Rijqrf3IANVRJ8Ee6O1x3YNXQsCvI%2B6t3fQvFgxOMFlvAr2tAvgGuz5RrZTUcnrz6WFrNKjUBKXEUgIg2HpFjstNec2xTZRDk%2Bf9p%2FIb0m9SG%2BlBF%2Fbse1WcHjr7a6tbo6HpVIJqOwJaBCcJ7BCq%2Fg%2FtlT5eFkAHP6eTuYUwdjPdmo23nic5eQj5xkZIpU7K2ssxm8PmM%2BW3AJPMK28wPuO%2Fk6CNB9mHI1OS7gR9QjtEpHfsKfrpobpNEGkqabNk7s1CO%2FsaBdpeIspYxyWsz8oKzLJv1PLKPOxWRHMuCNhUhBeU8owx6L3EmZctqCvMfx2t%2BKtpmVcVLb2xUZLC8zR7JZsNpITQqAKp%2BMEsxM1G4w8BIoSWQDAw01gg3J%2FyFkJvODGB2HlnzY7gKl5qJ7GZIMCHHm5T%2FQdodsnp2Zvm%2Bi2dsg6EGmATuwmffYh5RWk3qKNIHcYpVLGM0rMfcjELoegfdFIBiItzO8392Wv5bkueE9QG99kT7A5VNQq0Zb5CopqRLe9sPFjUmRF%2BRfJ50mivL3zqeW%2BkV8%2BIiqxSkR1vARyd3jrymWA5WsNSheXKvG39IEPyvto4pODJlxeuRUKPb2tUU2%2BcwzYWq0AY6pgHjMh3cXuO9WKFF2Xbej1QoezgAlZ%2FBQssnrsM0w7jBxPuPQyR5GrRpzBNKZEYP7jw4RQjym2Jl%2B6CA6PjrNnRk0DScFtJ1Y%2FmLss3zzXPX9jDcW0sqnZKboPHGq7voeErKaCuVaiXFuGZXHDcFYnzQF1T9SntGZwic6U4OYisbwdRBTLg939ibTWY%2B0FU2oDHYAY0XYlTJyBI63TgiWUfDSD2f610r&X-Amz-Signature=220a3c5159841d9f95280ee8347eb415da8a092d77db36e1820bc08aac9c993f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=a59d539f8bb0b89f751241a0d9210815595a1e05db294df7e06227b616e0ff9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6OXJMR%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHsAJzKYynut18AXHhM5hEM0MI2FJ%2FTeCe7bvquqOxpNAiAm1V6JIOJ%2BZTd%2B%2FbJmbCz14dmcIuBeqpoveyATerFNISqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMo0QYjGANq9PpCk9nKtwD2i9Y2aRpIyCxvL83Qh1%2F9EBq8DZeJdiTy1qV5BoiOBSknNGjxFd3LsjmpNDZTtE59ydjlmNxtBC0iEns0ohIhcsItubRhNsxY57QnTWbIdr2mE%2BXWsdCUCSdcGHrJgsafoJcqJH4qn3sCDtOanbZvwyCBET7LH6Dt1IPmhfG5hvjnHt3PbrDM5nkhaPc7cBu%2BcvPEhW%2B2H71hjFX%2BIfqgivU5691fivmm270UryCXN5vLAVNp%2Bcca4CUCVrr%2FUUZSt8n3pt%2FV06v5vpa0V0RAO9hn8W%2B4J%2B1Ggp1wb6%2FBbhy8ufcqEE%2F2NCSq656DJe6jCzUxk4i1v5XeQj2GPNNwP%2B20MuRSWicbJC4PHi8PBULNg0b%2FQJk5WNp8zavtkSH9R%2BvgPl%2FbotHMktJSszqcBr3dyOzdMkC9K48O%2BOL6IWsWEnrJM6BtcbbU3RBe9%2F4xLGvn3rxT697oFEI4ZFK%2Buif1Ol76hhOs81zruDB0yuozbepSA5TalZHctHfiGYrEqcmPWpL%2FScJWGPn02j2uttcfWw7Iq8M7za1X3PSESnpRKm8dqjHM169M6ef7h%2FEMHj82%2FIT4zLy3yEfTeI8a5DqTvtddAg%2FhFCr2J4%2BrdDhdqbLzW9%2FTLQsLKIw%2F4Wq0AY6pgFxbE6d9m7m3kYzGnQiEaFSvTcxgl7hsLywEBEyyBHR59zpznySKjml5PJz2bnuXx2VNq%2Frn3MKuBd9qDFH8LsjlWANMaqqN%2FwknizGJwTRS6L723zLMmZjRxqf%2BQ90xxoNRdeVAFr%2BiP6PLH59Af0KztRTzY8Gp07kbbv39Z%2BZSw1O3aDRbV25zTHU7fBOhmqFBegR%2Bz7CChoAmcyvCGM4KycN6lxc&X-Amz-Signature=0705436f36969d8908b32dbf0c536d306ee29b2760315ebc821f57be4bbd8b24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665O4SHEZG%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAgt%2BjYDMcM31eEfEMuHNwQsqEKyhl67GoKgQU87QW0RAiEA9tz5dvmm4%2FB7%2F4K2zj%2BzJN4Kz81qzYwkAonaSu2%2FaHgqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLs3OuLXp8rBsgn7xCrcA9PGzqwMaR8CcJEtPy5mwdwEIhNrSNVOBmtHu4A8fQaz2YH1KclaC2pwDlkqy9S7zJxt0qMXPGzZwXv39Tj8ftoRsXxQu0YHzmWnJQ%2FYCz3ctUQgGbKVTViV4IyZ24WD5DAS6uczxqhDkpV57Xk6Jpj7NDaP9q3eC0Re8aSDDvwsztWz08pvLOfX%2F%2BAFEov0EDC9yDidT0R0xsl6YWSVmEput556RxHY55%2FNXuxnEnnJfBxJQ1X6fHHgJ602MVP5ufP%2FooT2S%2B%2FIHHkQdwSH%2FhA35djG5RBhnkQadLid8bVHuUh0BzSv7sKjMuKapI1fX6T3jWz10FB6WO0auwbXwMqYAJ3UPgMF3VyNAr5wYNfyowILgxK1CCbI9lj7GKUA8GPpo0iPR%2BWOMqDv8NYeX%2BffmeBw1dHfKQmGiPXkKp%2BlBRu7gzTBbZWJkIjeD1vw1sF6sUNj82akphx8UEvxxN4f4yXHhK3am6ltDE0V63CrOVyfQa2XeskUP2wQ3hAlqYs%2BUY2laQsyWfcwhzlOHNwUpiWO12%2FGd9yDqhMBGXg%2BeM87avJ5emS2p%2BwBgTKPVdVTW%2FmqlUIPkQMC5ZFyevre%2BnGUfSrLtx8OGB2kf%2FHlAB2KWWDP6vS2dhFuMJmFqtAGOqUBrPwBpQL2FjJMHf5czhX0oWO7PE0kFFMLVjq9C0vSRh%2BD57mMNyGDkCeZELbYADkDC22HiOJ1x63%2BBA7fEqPVbWSiTSMvGSWSV5%2B3etjNh4%2BRwT9qozaa%2BDthA%2BZE%2FUbUPmXJ8xf2VHASF1YeXIbsPe3AQGsYHdL6hAfw2lzjNRVsGBTDpp24nKDVX9gA13P9OPr5ay2w4OWEcUpmyWYQyBpYKMLU&X-Amz-Signature=4776ad66b6d0bc6af700a2a236b6b94fb4229e443ecea1c2dcb744453a3a60ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466767SXM4B%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDf1fCSVQLvFulNhR4WsGVNfn3n3zvdRdKTgYpW1X%2BMaQIgSIoMXE3fBpQfxe%2Ft2Ct4gadbFKB0BDZbvtYHdv2qc2EqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDN3v7K0WC4hYOs%2BzaircA02NhLSTIAfhskYYYKoYErHJhcUZ5s%2BIureS7eentejl6Y1P7QConQEUXNlko5vMDEOSBKNbHevmM430ElJQhpnu0VQDxh1Amu0z1TvoGGzbmCJ8vEqfXqXEEm5FuXh1Gn4c8LMWLj4PtV8JXuiaYYg52qHFbhzVL%2BL5pj5Smja%2BEkPJ8lOW1wL2PibW%2BScpDJX19pV%2FGSDzOYoYTH2hURhf8SuyHoTBTKTbz%2BOm4tWc2rZF1kmEJkGzyRHhzlyqCTucakftGk0p%2Fwyo6d1YOpi%2FySpEzy6GMyG54qvpzIzKHHIuUxdN0v6um7hnFCzUolaHQ6csDN3VxRqHcuPWDVV%2B3v2%2BGZb4dvhiam0A45KROPkoeBHCv0TefLk%2BugkTOdwax%2FI1EWiRjVoXWGnCKPP23wfcvR1HZcrg%2Ffnb%2BjxHfpNL1oA8gI%2FCPMnVGctxaNU%2BtfoVpcc11P32%2B51vc9Cp7JWoFShSaSkO5F02kIuPT9C7M5%2Fw1xaPkpgQMm4KZ%2F6RXBxD2YNkN%2F02jH1Lxgnn6Vr2zKati%2BxAZtHha7mwlegNJ64JrjaBlsUqSJ0%2FFdomgOubpilBQmIsTGuK7Xwpr1co0Ovps2dR1KFpU%2B8BrP%2BvSrDak%2BVCzlKmMKKFqtAGOqUBI8asJKtnFsc92Tfzu0euck2eTZFwtL%2FvR1BLFJ%2FLvS8MEQo6xbetjoLLd5whFqrZJ08B78NXgaIeArHaLeJNdHb%2BDIsrWBNUiWXeMldD%2BVEkyYWZc65clFR3qj8KB5jkcC7KBZbyxaRmUpGXk93O00zxFKPKA0sg5gCniH2mFv40QEG0FmBmYp9vFfjw1qagYrGlcVpjLEKHEvo%2FBpmlEIm20D6D&X-Amz-Signature=566da5f38b0b2fd6f222568846da2ab038c9d3dcb6fe626d9ad94f91517281cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662RWLFY6R%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC%2FgAgXo9tcBgMpW7hATnZLj2pUj%2Bz4tS3jcB83b6sbUgIgLg27feJooZ6AdDzMWKzGw660mhnDgJw41DoevbqJTYoqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEwKfEccTkSIBuEQtyrcA2pBw%2F%2FHbGsFoJPV5MyEhpWEOvPISOdE1%2FLBnWxF88tuls18E%2BflnZSVaRHxYwZKgu5mnGA2k%2Fd7tqmgc4GlxyF7sqIEJ2rsmRSIfvIirQXlu%2FkNxIfTP5RmWQQAtq1WH66uJ8dkWF3%2BfeDfWhnZtTEwFEU7vp9x1BaG%2Fpk7C1uYWgRct1ZHo6xHYwwnaOls%2BEQ%2Bx%2FdQalqGhmriE6LGHw%2FgnXx7Nr3M8WKltJM4TGV1c3cK%2BZ%2BQRGfxrzMM4kTPWwHpdM4CzXCRQIpdTpUMJ9cO%2B5%2BOCbv9i%2FSWKQDGent%2B0qPLH8UYennqalZSwAZaM8K1oeu0n8hyDzYfbtP%2F%2Ft9dtvtwajRwpQ9vXC3FPoHXtlsNVUfMaJdcMg0r4QTi5syllnA0yDJ2HuH8%2F77pbfR2pAExp8mYONkTRVKNZh%2BbF3Kc5LiE1o2aJemRJz7qoKFESusSu8juYKAcnV8qvE0vk0RrDmssqkyYRYUJLv%2BtcnCUINXt5JsDzbwhO8NFDUTLOtCqRbl7f4RRfCqrKdyqKCyRSeFVUi%2BBvyR1KVtv%2BCjb%2Bdw54a1ywBSdzCTHLVzQKvsui%2BLhgdAnKqyY94ihQPqq%2Fxl6ZeiOOhRsLMv0io3EWuZddy50HfL9MPCFqtAGOqUBL2I9gwjYv3M%2BNKRRXt4S0ZXCBIGu1GOXH8AC%2Bl5tFdT%2Bk38N3Oa%2BI%2B1RRk6kHsz5VKCJi3S1qpbfexn4pM0bp6g3YkLdQpVdyEPIJxx3cFbVQpDjkrbjYQUACcdwdL71mdu37PUigbX9glYHjYoj6pmsrxFAu1tMXDiZmHGrh1Z169JCymK5OnXjB2LtOcPNLF1hAM0y0XO6asF0fi2UGasF23W1&X-Amz-Signature=780dfeabae1017bbfdf0a111281897ef15ce7d1bd3f35307f54c41fb748712cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=ba3dacca96223e22d0e789433e57d973b0f2ab179b94b771b0a7cb4f9e750525&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LLS5SPX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBvA0EkYa2q4Lo51qqmqDq2CSNF7NSnwcbxqdFDINFabAiEAqueggv3z1i%2F0W%2BNbJJSKwz67hvewnleERsehgEpdt1AqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIHxmhBrDZ4vu0I%2B4ircAzqDb8UWfNYf%2BYBc6A5vCP9wOnEALpP0PZ4Bm5s2kZPl0wFIbSN8j5DSrBjxW%2B%2BWWtZp%2BmylAm6il60%2Bn1qr%2Bh7BJuxrXb0huGz3ZK4f3%2BAYxTo0TIs%2FWgJoA9M6sFHcKs80Zczr%2BnStTCWQWQWGpKk9BiGBiLkXAkEMeNoIm%2B8nLcrEumZODtn5qUWhwAcKmm9r7Yc134Q1M3ZIZXn9lIeQKsjbniUm%2Ftx%2BRjLcTaxQ7ndYM%2BhV1FN9wydlcQHixG4vs6I5NgjaBMV6sCEFDkSUfuSlYAz1KO56xNoM%2BVUVHqipYKzz4ILk2tUL5ZVrPwLRpfjfKDwAULDeHFc8o0z0MgtkSMZlBw7x7lmILkbvBYx9100ZkzxWQjpKevXnTiC5DAXoeD7kv9tnAsbzzSS3d3bpRnEQ0YUVHOBIQ1%2Fv%2FYtZ9l4AQ8QI47W1PFSNOZhZrql8eOqd%2BdFGoaS6anOErwlEu2FOec0hknu1tl%2FmxKAaRKPhNVtkfljqJdet2JK6nPcGFEtfX0FEyTEQIq2BXci9SCd8mWiNnhQs5iJmZPtUrML6EGo2AK%2Fyeh9qK37sNa6bEeS6JfdE3lcw8wBwvJoxNMkC9epfgQbFo0f%2Bp6yPqVPyS%2Frh%2BFb7MLiHqtAGOqUB7XxQfcpEvNZNuxgG86i5z5wk8rLDfGMI0B9R9ggxfyzb9tZDycLXrvQSk%2BGpOGDkkcv38fjwLMZMA5IabF2vyxqAdc8hE%2FN62ZfJW4meu8Zy6vMaEu%2FJj6VPHObMZCBFssNwfwZua9ATz9Mh9tMllGkxp6jRGLTYvidtwcD6KxXal4a2EXORZs4qIBVKR1TqrQhlJjItPgnwZhhrx5cqEj73l8nv&X-Amz-Signature=198651746e241a0c53bd70e7cbb11618aaf3d5b1c6184c3000ea988efefabbc2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

