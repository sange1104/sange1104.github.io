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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=f7a93140666ff3803c55a67fc6317b6c2fe2064a3e221f623f6e9cffdfbed5cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=2a2ef58d20a79a1304c72873fbd7e73f486806aa160fd6abe87eac21639ae6b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=cfd9a3480af88bf7e0830792cc06f993df790acf0fedb16463d682fbaa699873&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=c333023a18dadcc74f5492cdc48ac0f854e58996247cd4186d51927cf0fc97e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XEVI7ME5%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031844Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDpcTRGF0UFwrQCfJr1G2cb%2BGZphQZpLKgm6f9xd0mUWQIhAKB6orNwM3DVmk9XIG7gQv2FejKJCG9m%2FnDCetxf59stKogECJD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxhSLj%2BayhBFACR8Tkq3AMHXSumzHQ%2B2dmELyaJjINcQCVTpxvIbKNKrCgzJSYZyGfndHfFMDOO4LLiOQf%2F1mUCZNLbmrEOYfdHE4ZDTUX8g%2FPN3%2FJAr7KKhwgYe2hSB%2FpdWQo9Ry6RSkH%2BYa1EK3xPAbioa%2FsDMIigDZFL%2BcY3Di9DF%2Foax9yC6tPIylnKGiyeZHEQfagshFEjIVu5jy7LJiGTkMcyG8vwACxD2Nh3cI0PaluFUJ1YaqZyfWyQY01hdfW5sTsSuuTYJ5oHIJV0qaHq1bMW0yTMDhEjCI0E7dcHc9bcSSWKLm4pVzdKiB50f7v0Yg%2BKMmjsNxMQL3kLdiRKkhm7p%2FSHyvr2jzUi%2FzetPPuyYYH%2BQRe2jt3qH3phwVXFCoAcIjMGqU1HKv1T5d%2BdV5RVZg%2Fx%2B6sn9SxG20QR3fumlwMFZifAfEYs5HH2Y1Z1S%2BBURVamDNHP5rn0n0xuJg2XZpFGnJWQvN9hXsRRYmsnHs5EErQbG%2FsK33qInE10Op7jaqCfdrkpUvQbXAwZL4vJPfF4UlGuyvl6Bq%2BhtH%2FDKQne0HW6HQjLd%2BEuUMbEyJPzxJ5NXrJAQ9%2FIkxYAJ8Z9Gh%2FGEXoOAek%2FqYasnep%2FxWApoQ2%2FM%2Bs1U1TkxnJ9bGGDauu1TzC2tpjNBjqkARGybt3eGqRC5fk86LaKhdo%2BwrmYEY3IHxGcHQ4OGgCFgquaPaaN5elCtH8BBOMcFk4neSokJnhe7%2B7hknUlqp80YorSXJGMwBzxZ8AoXSe92MR%2FzqwGQJYT5naZqZj420YmkTsX33Q2NTlt17rTqjEUhDJQQeHGhY3yUqNteesTFJFdO%2FS%2Fs9zLScDoT5oa7H6KAZeWadmNPwuaOQsYUYMXvGFa&X-Amz-Signature=549ddf195a4313774ae7e7e81aaae907349fe51a5054af2fd08eccf54cebb625&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RGZBRIZN%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDlG7K%2BUZR0IOsdMshVriQvUtU5fhcJxfgQ8lNu23kFuwIgC6c%2B%2BTGIsbC7gnshuGs1l31HV2Ig%2F5rib1VjNVXAXCcqiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOIVdk3h7%2B%2FATg%2B1%2BCrcA3sFqOX96B874sJvA3K5soUxI6e6fFTDaMFZD%2BC%2B7pnjX6BDQkfNYKQ7pb%2F7I92Pg1n7F2QUe%2BJGHcT3qiYxiZCpg0t%2Fihi3WxSQILBo4MKtarn3T3bcaRO9BOci4Br7AreRthaBiFFuIPD8dTaxgfWLJkN4fYQa%2FYyNvV0ZCF2iIzRUllNkArsCJbEJfoXdHg7064FY%2FMga5KPxcEU4oINTnE0nPfNrK4Aw%2BNKxl9MyMe%2FSl%2BYTRJUniBR6xr%2FcVpnhLlJeb3CwhXsf3C5D3Oyx2uYHBqxgaZuBJp%2F825%2FTqQBS%2FzLyxOVliSQ3qHJmspg6o8IqjvI6p2E%2BzrHKDFPlt%2B6WAec6eISAm69h9Jck72xoBPTNX6uvIHqRAiAfAA%2Ffm%2BMMQ8KC0GzcvLNuBTI4MrrB92yQrOBVJKk3%2FbQ7pf6hJYZKE5qiXU%2BTcmfOAGFzLD8m60swZrzZEZ4suPO8ijzVdgefutOERbo2OtHJDmMN6v56qsl1zBuCCWz5PYMz%2F0LUVy4vD69RoU3YtvRSAp%2FAzMV7YxW6%2Bi4%2BGPS71geUXnSiV6yXJP2CT3laK68ccCfXi6YzwD5taEh5qnfHrsKWEtAkr7WjOZp4JqMY1u9hu6bhjliBoJOTML%2B2mM0GOqUByfG8NBCFJOCoHlsdWe%2BYEHszDhz5TjXRngkPNxJwQUzM3fXm%2FaMCcZLqsL9alUV1F6nqkOfjcKkCuF9QWgLAFaJ65OvfybdqBxrHil2JO1uVDRmTNvneHYCLCQd8TA4w%2B5HFMmbdikQY5JpZQ3MybynnJMXHZfhxhwpLowi3nUNCP%2BiBcmvyWyAg4osBhDImPV6QP%2B4tItZ%2Bm6%2BrWe1CwiaN2EJ2&X-Amz-Signature=1de891a4546b18c72a35d46cc5c4f0b515c428915f3d7675bd9e7e68ce647295&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662CDXJ2EV%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031856Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCW5El2iSDVk%2FHkDoUyapx9oS8vK8mB0vBrSY1Kk9NPVwIgP0FtKwihIMKGZlOlG%2B8N1MROVoRFK9RJGjITmET71f4qiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF4GUTMbBa19I7ltZSrcA%2BMIMR589%2FwLPK7xMoukv7C5UFgQiQ%2BO8MaONV0F3bpyelvkl2rNkubf7Djj8Am3w9m%2FXE0Ah1D7RLv5AvRDDnZOMtkBrhEWGpr3RSiIO7zT7UWDvkGgWG6i9fgMZrPWiUzONWJwAdW9%2FThLcm5tD9cUauPzcAZbvOpSgy28sgJSkMP%2BuU0Qb%2BC0vWeFsHIutDT8YvP18AGLZIVdUENzJQ7%2BWhWgGkCH5Ze6qupjNfr5pDnaFHVcFdobZo3Kx2MjHNcIxwa45ON5LN06aRhVeeJQFFVgPdmdbxO3QyDY%2FuAVTu8FpaAWlVYci1rr7OBmt0eVX3mF%2FpUUEpIILwbx1Kff6ZMNhFtqjP5TAGqeoOHRuPyrG8V13wSG1vjoo51P%2FePH7ClckCCCX6kODgf11gIP77GKGDkldTfOkwqECsXCpkKWqqn8zEDMR59inWUtvtRxESI5nwHDviYkZakGGv%2FlAJi0QqSm7G2HMFNs34EtZSNs%2BJ1pFdciGnuc%2BlFYwOEYQCY51zBy4Oir2a4yBum0VNl8USXIo94j3fug0t5uVeFHIWN%2Fnj7I%2BLquxAU79%2B4zl3VXsqOPe43bFPWqXDfmBOCAX5y9EF13WL75phaBtBtYjvha7VeH0Fv%2FMJK1mM0GOqUBcRNH4Qb1JYcr%2Ft4068MnGk03bH0jO1F8Lq6lrDFs9lUvKUUHqV2efgePW64yQFRiELfEFV6txugQfQpP8hU8m4nUQtc2tPoe3GKDBsAXYDcQyc3CT4ck4r7K%2Fur7i594nFnqJ2y35J8BBsiFngLa7YmEmCSlAi6kXDjQTjPL5wtU%2BivIDM6lGav1A8ksez2eoKAkgKRRCOTsQzk9b8%2F2ubc7PQ2y&X-Amz-Signature=3ffd083336b06776d21a7d02f26dc4173b54f4f0b7f288c41b3d316a0aea6727&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664EYPRHZ4%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031856Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC%2FyG7oMuqlythM5DXLxO3KPR8R1OAbVQ7k7FKZNksyDAiEA%2Fo%2Bt2hNkKXtLJxBYDuWeZ%2FN0qQrQO0vX6N3tMtG2T%2FQqiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHpxhXkMqk7R38aVVSrcAz6SY3WwF%2BMC5AslkSpfHZ5NPHduzBGGE7VvCr5czMRo2n2cns%2F9i7pnmDZvpl9TzLfbiEdW%2FCcgAN0lueswobQW1sRVQunZAW6e4iJRAjwgWuT67sP9yHTxdUpUjhE2an0gKAb7sBYLZlAvzjCTzJYAxVVUBNLb622I6vXUDi8S2FjsVdKAgWVhPNFbpU2r%2BnEkyDarw89IT8l1oYGdGjgZKtR4VQthtAmX4NvOx4KaiNcAcz3SSCR02TocdgaKK%2FkzuFPkqA%2B%2FcOwWyfzOlZ7QJzbbfSIj8GIjk1dVZH96rFdK1LhDRhga5%2FNv4hntllAH00dmi3cO3ONsnTanQxHAqSm%2FjixezYCNNn4%2B3ZR2HfM8NoneIbaNqzcfWERMWXVc2S3V6%2FAV3ymJNfjSgAF3TsnRFW8Zh%2BoPybxOJLOr1h7wymXzXpS281Za3szdhp0%2B%2BZivL14MVEf2PIN6Pf0C4hNfrQhOcUUvqTxwjOjhKOkb5guESAOcj442NqAaNO%2BU2s8zJ4P2KXr1I1e3%2BOOO8GBNLJD5NddZW0NdX7ee16G4mL3XMw7ihNslSrTt%2F6XO3TsFGjogkc1LksVy81k7HgwovvjL3b8n%2B1f1Dkievf%2F0kVFOH8ngj4Q2MMK2mM0GOqUBLQigO5CvNteomtSLF%2BXhnM3Z%2FnYUPgsmHbbnjbsTIoTpWguxzU4R9IQ6ertgvd6L51Zs3ttZUrkh%2FD4rw2p1ZQ4b8%2Fk19dRK0QwC66l5sEasJB%2FvQviZUqCDWI6B43Y4AcYoMb6Hk1IcwqpbTJppqtzrSZgk3dl%2F5%2FYl3nK7EeHcpSHNt67DGJUl%2FMRHpfLavLFDk6i0I17ahDLx%2F%2FYt3FHgnb%2Bg&X-Amz-Signature=82a1c202266627776f8049ed34010fd21adc815e1e149c359ab4eea919d767f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=239c92a72986eb46f4774ae74639a6b28f6f8ffdb7e8244a5d0c1dac99be2647&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=076c550624109f573478534906e16fc23a84bdb07ddf01d926a77aad405ffc17&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNYUVQD5%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDaV7Zaw%2Bd8cKieRKpN2trLNHLo2sFjKkjSNjEucU5ReAIhAKK7gaK6ACSV4sesmTiD%2FVQcAJp%2BMaKifZS%2BG6jUK%2BGoKogECJD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyb61J8qblpVanPq7Iq3APzM%2BVFkYbd9XYHk%2ByTIEUbBJy%2FO92qnYdXNDTyXOwMhHyHZwiU9b1ZIrUvZZcpxAQYwHIoikq4MCXSWTcYTr1POZ95WdqSTpny8YEyVpNeTVjWXJxJa5hpmZU0vii4RIBEsqAr9J02M3ziBZApchtWYY8hwnARLppD8uozH05hKtE325mtHe5U2nfJjxt5OzwOQvTWSTRqYIu24NrPQv1SZVE0Y7NtEIgR9f6hKMCU2I1hiuRWcgODVsreEZQ7VffpzvUKbJej4Z4FyLcGFTaQFXXH%2FdaCoN1QyoGXyBebqsaMpmcexHwvZbZYf1iF9PFSoR50qfqd0pmcwQ58DjR9WrLLROBRAXo0hiJ3UdIEbPVFofFmjnj7mB3vx5cTCg%2B5QeJsCQk2xJsfqD5K2WOy3JZJ05hm6Gn%2BSIGsND%2FuyG5zrAG10LPO3ELxZav20zCzEYR2M45cvpw0p72Q7gJ1SNVwav1Kgks%2FFoVgzdYtFyeZ5RUASIFgHRtAJAYiom01NP%2F1W4ErZOVoPS86ISCshyIulW5eUW5qLIHdhJzVR%2FZdS3F6zPyenNaoLvhDuf%2F1KoDKUxnGilSUj1PsJc%2FWrEzXhMLH9oMh4wa7o%2F7B0SAjHzZSD319xXVLtDC3tZjNBjqkAc%2FiuggRfzAanBk5D6T9fk0UpfqMYpKcvprlQGHA126Bo7RhB%2B7xR6Ev%2BpZPNeq%2F4BI%2B%2FcsRgOAAYiA6AoGvPSQYPx0xwq9XvC%2FPvYBOHuASaq8qHkDAnFdw8oRKhEGO5ir1uOVzUX6OCcPrqj3zqktHhJSUUqH70dR6MEhP3h6X6QtZ5cHtFclbgY679dF7cOwk3y10oX6CyfWfIRb%2FKSy6htbF&X-Amz-Signature=d6d7b61b85f70e4819906b6daa6147fd83e23fd2db34acbef607771412436158&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=851f04a7b2a3598a9cd401d3e7b66caf4953ebad90ad9646eaab27409a157ee1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666GNFDAZU%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHlTCbrwywGnGuogsUwq0Zt9yf1ixcesbH5Yb6M8QxlhAiEA8bLEPxwrzG6l0dUdKSGj5t7gWpF03ZcbXPLNkCdN3dEqiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIC6NVac3rlBWi4OYircA2g%2BtJ5dQB9YW2NM9DDNQiwRPugw5gXk6N78r0aRTfBZ85dnPvADVM8j4YPnpNIaFw%2BsmSFkUnwBLpLDX0CKNDmqKjmrepcq81hRPIOPiIjcK5z1%2BvlQag%2Fbe5RG7hp8%2BqJZYDoYY5u4NPIUmQXmxt3MEMyMIJUrZbbdZdg%2Fny%2Bv8yYbXkLiqOpiz2K5m7eKjQPITBImdOSL%2Br2mTvWyk1%2FoXMmdOcE%2F1rV8evhE9eCsZ%2FT0Pp6RTGoK85x4Q5c294wbc6Dq6AOmsLu%2FrIZy1EmjspPzW6nsDEnrtVzfSCo5Ojtum17%2FPC1dDyDeRdoIFQcFGyGzEI27ywoVJS8P69vWIwXRjZyw%2F6TFOLUECYjtyoww9VP1woxHCuSLgH4KUnD%2FfH4y9BcAduSWqsDuNd4cdtphJ%2BSo%2B7xN5Fe8pwyE9tFvNVbiSLJszzaT%2FpOqOhpta0dBlNEfgC2%2FFxhjcwDBsGqg%2F6ScD%2FGfHzo5tKUn0cNMrPECaGRRNLmqpyK%2FTSsxBXDxP2uZGure0QwStMSx%2BePBQLXSiWI627Is1PuoyE8Z4fdYu3%2FeIZNe6q%2BxUBD9aJHipSsY45MCsAEw6RwvdsRnPR2eafBfhAmMQENX1%2FiTIpN4qfl2Z8FsMMG2mM0GOqUB%2FtJciWO4Gc0QXNmHpMl41I8psQVNBcE2HJgMKjBBlnrSv9LP7UUgbdL7zhtOzywGfQklUQrq0ptq6zF1lyHTZh4KEgiehA3umUuxWL7WBmd2ssBVc4n1xE8TLqy5jWkR3zevIqxgbV0klnayQllBGe5W7lNbR6caw8nIVGrRb0n1ZBSHCRjQcIZLuHBfuZ%2F%2F%2BPLdix9m2JjvdmX8x%2BE8YPGpQDxz&X-Amz-Signature=36b3fe23823442cddb86cce9796c953b7769ccb07490c380635fecd578eb2cc9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MKAODFP%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGzXyVkxTJNhKtvOxNAZYxW4WuOs0Kh8aN%2FxV3Ge%2FgBdAiEA6bq45%2FGndlhCHfzFG1jmpMtpDQ4%2BzcjdPnrqM6BJ3TwqiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBtqdVhA6%2BQz77l%2FpSrcAxlrqJHCm08GWGNq4jfwJIQ%2FoQ4z5h%2BKt4R7J%2FBbkCs2%2FVCweBgSAspCvjRiy5P6PuxdjMWifmJu18WId%2FnZmDkzz9RQkyEF1xintDtAMkTB9PiAnRBQXQCTO8Q7b39DaGurQNm%2FfrrNYVTTfpp%2BOeEueQPhvKBhBzJJi2YDW78G4SiSC5%2BwZPY2mwGEeHd3BahZjVkPoJK9U1KG0X6TWFYNUkSpKBxYj8PSEKxDqtlrZ%2BIK8qOs4r2zbOsMdqISB7lc7HBzKL6ttSUTTYj5Zch0Wevqa6UIIopDuRqCEzrMMtBYVCbDAc88%2BVy06%2FC2E1AtlgfYDoCNCJ%2FjOe6Y%2FL2kJYWXXG%2FrrCHFGp2jCad62vNqGWLbQdVzXfvwQuVBrP3gqJQMM9Pyhbw8Aj3Bl9sLPBxvLiy5CmqRL8XNI9AKtQEWUBdB%2FvAg4gnCkKHHE3YwFBAUQoZ12q1NXcSdkQE2qbceGYvXXgef%2F48GSCn3tkb%2F8JpwxQ%2BFjzzAMmwJhmPpt0yKUVW5VLuIIiGANl9xnlXOfqhpWFKeZj9kw9I4lKOd5DwsW2%2FSNCyb5kFJdxK0hHBhCC8sH0rHIa7tdlufe1oV35OwgbMjGUkQKHCgbSvSrg7XRpvPk3kZMNG1mM0GOqUBou2ScgooVtYIdjTD9BmtcLFjpCS88skY35hTk3IqXSJbMQVbuxzC5NNWBVfpwR6PaETDqSJbb1eSGtY%2FLQSm92lRvVpiX9aB6pNVUjlzLOaVu%2F1jblqBxb%2Bjl6u7Fh9jAaYJ8g2pd1zyEHV9EFaKgYPxGrAX8giEwxONt7HneGTePq%2BtA3MvzSkjAeuXvcIR5l0mrzOYOXmxlfavboCmi2cr%2BGLp&X-Amz-Signature=de4d4b90f6fb48c709d7c9d6a70de8860b42eef847a121aa6370a81699c0781f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SIU7SU4B%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031923Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1N3GOo%2FuozOaunUuGdK7T6EW%2F0JqeHmckTEkaksS01AiBruumTktl3UO9Ndq9ekErnKjhhN%2Bbw4ei0GoGzFadFMSqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMj29xl5OMA1ypzPpXKtwDO58QfU%2BofPqKkvwsTdfqiv1CJJ9SLJ4MoilwmsRmHkTIGjAIQAde%2FVWV2MwLPVFjzoXYXUAl52dI1pkM2bFJUeachAWlgvgA6JKK2RTUS9FOFWhVSMFZu1lNGGaCNpQvB%2Fbn0Ko%2FgCo2vkSNWD3a7k5VNdcno3yuTiNnvLUxNBDSjYY%2Fovd0I5KePNCG95pH67ZTlWXxyFPPm1X3uiPxedRMRNFfBCwBlgzw9ghQami%2BHcG4kTob2qhSJQJyXCynTdZfjN9l64vQyjp59gpVjuXFCfwxXod2XNsEGwiv1fv5VLMG%2B9YNs9K0G%2Bo8piRlLW0IbYat37yDW5Yzau9vkdWsliHAKl3jHSi68KvJa4ryf6%2FU9ASe9X5lZcwT%2FzbUdN%2FSxGOCi6c5l4L6cDKJme3c0hfA%2BhgmvySzc78mwjLI2PsRj1%2BhiiN480HiHvgxetxvKxNNMrTyqWOWpN4vqLFg5RSOe8lfhWzCId1KC%2BTNXcIl7uUKqM%2FzSsUVrDEScM66Q53DLgkxC3jxSzCLwz5zDFqGdN%2FofksYUSMKq%2BknSzghvhoPAXEOICnOI6raZX%2FcPVU6CYG1i1KOZnKLBkKfuERj1mi2pckbFEjIw%2FrBYVkEd7ktY%2F%2F9YdYw8rWYzQY6pgHZ9C%2BP6gnlmBpQuvayS6geqxsEtOyK0ud9SyRFF7L%2BLbjdj4BAiKIg38CTWZ3RHWbhlWTZ2xQiu1QcDfFbPywl246VacTs3ZRD47ZoZIMJfSZDRKJHDUnSOK1%2BxeIJ10ICkM6hpUJX%2FkbooloZ8ET8PcuOOW5IIJteb0Lx6IT8hKcMvpRhJCnOFlEn7zDmD8hWx8mUt9ddXZZ%2BUzllY0C8dMttYhkL&X-Amz-Signature=4d016ece40b84ac78030f35fb73e40cd443d31bdbf7c227b4f62207c29900c8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TT3VXMAY%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031924Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFtw%2F%2FAwTOKBB4R3sQQnA9Y2ELI3PhdeZLhU3fB%2FgeXVAiEAn8ICBWAmPl9h9O97DFHv7gCbn7PV3R6Ltuf%2B3YaAbIEqiAQIkP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMvjHWpzXSHX9s8NLircAyzGmtj0mEoOSaudZwIiOQLFdKkZqYGlT5BIoLbUPV7FUxBH7XEr08X141My%2Bv3sQHgCjjzdbbFouDzsFUsjz8kmqHLOqji3a%2BH1nkugSiP2yHc%2FhdWaOPgd93GixTBcB6jBI%2BAS0ASodyuu6tPsRX2aHGoXOxOT7EujQNDBmONCwJcW%2FrBe4XomSGJopzCqLL6ORV0bltMJbkSXJNt2%2BsgPTqI3eqQDGgnWk1aHCoie6TqZwo5TtvvI6NYacsEYSmj%2BLSZF%2BOS8yaPLyXT7uwnn%2FJ7jJvS49Q7PAeOJiESjxK8UmAWoi5UrZi%2FlkY6NoWsywKLPZN4xymZgIJajESOBSsX8jaV5jgSuJeJ6LNIRMCQQJlP8s%2Fkf%2Boh0ZiV9uYGlk6CvuC3h5O0xSZiWjyWSXD1yK0HWn6TXQRoYvtLb4Ys7TjIlvjGW4BPCcMl%2BWkLv2CDNvHWwFEgWc%2BmFlwHU8iZRDMB3J%2F4B4XsXpy8CYhxtB1zQAZNdcKjIU2uOIaIW1IvN7EBVfDJoP%2F%2BFucKe%2Fd3uO6BDM%2FDfxApQqCPe3deV%2BGYQOg59p3RLWj60hlib77rhG7DjyFB3Cl85oBzTDsfr2IjXvhUe3o8rLi%2Fiwf7mPujlkLEmEJGuMPG1mM0GOqUBI6OFK6xw4w%2F7XOOKNWvKGpo3pxPy9bvCs3qlVQy3ppRjNWcBqH%2BV8RHZPcxuB9vWnAuSOTwM0LB8yF2sSHS2%2FnGyDPbVBrj%2BW6bv3GdQyyMm5VFRT2L15km4tX4OaTV%2B8ArP%2FTth9q1cxpExhI0NSHmwfEAcffq8oAZg1sim%2Bp0xuK2irH8cC2pNmgaVQmYOV%2BmWVFfeb3Y0%2FxSbD4SYsfQQQHh%2B&X-Amz-Signature=7735f64b2d6ee522c66e8e698b7fc5c6632e4c5c1bf39d56d12af4e0a599c288&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=5bbdc09902110b269d9f9dbbf82cacbde8cf38a4a57ac39f0783495b523191e9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2MK4O3L%2F20260303%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260303T031816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG0%2FogPx7qMWavv3mkmUulqnt9ds%2BQw8iIL83Ba%2FKMXIAiBTd%2B%2FFrffL8pBnTqlMbPbUXIbqqUb9s7%2BT3ofVyyn6zCqIBAiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2YJj1Yq64boRPoK7KtwDfj5J815xLEN%2FtKn55Q1LBHykLb%2FPgEv4n%2Bi2TUlkUSgf5NlzZc5ltVJQ9E6wsfZG1Q6%2FvdFiTaPm1Lhr9U3Jw1h55kOXqLenuWrE1ha6WsVNjLhwuXTtj%2FgQo9E1S0w%2F0JwPZhFX6rhHBwDt5dWpxLAh0qOTez44uU6OI67Mw75oRY5S3%2Bkx737nrs9nTn63JqUAvLL56Oh0Zr6YOoMIqeG5ek%2FSFxlwBUsnFw1Q%2FLU2Wy6MdknPQs1qn8sL7rIVAsKPs3zw7rMssNC6yt62Qql%2F5J4AjRyFwYGCVzVSfRjlQ9xxS0yM9ukBQqui18gSl5pF1lJR2KiOQ6KDjqpSOG7eY7LsTb8PEPY9uthWckM8gz9bpPurvx79ck9CQeiFBYg9EUIYEOKkzN4smiq0jFtUgSw%2F0KVh6TMA%2BXYYWHB19DXpEBkQG%2BeTU%2FgVMnxd9x5XxuJhqktDQL942r8qXCNHAC7Ph2KYLw5E%2Fh92OylwlY8KP%2BTzHZh8mSinO2fIMB6l2S7PW2X3cAW%2FL5VDAV%2BjXab6FMGvqxdkIX2xMz9Szm3W3gwuUb6hKqnjznmLRWtGe7gdXLOjH0E5HXuue7gbf8eM9vLOpgt5A0EkVpnVkGyWpSLtgVspGD4wiLaYzQY6pgE0sJEB7riD48q36%2BeP%2BUOui06aZXxp%2BBWAkBTfilrDieDfj8r9zi3QRN1Bn1zsC4MAl1%2BmKMC4unRqmIJcgB1zjvBW3ZFL%2B%2B0IIBEcFzjKjMO4kDGELA7PiPEuED072X8ZOj%2BNWtDTIbvVNXgTtQU5YEWQlzpJM%2FpOBnUnl7Q%2BcEt%2FkmTOMO%2FUcXJSGp3BLtEw9l3u%2FBiB1gvG4kIVY0jtmckCLEIO&X-Amz-Signature=89ceb2f55e82f04bb0a11c8d1ba27a4e058a2727518d670e06e8cb5edfb854b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

