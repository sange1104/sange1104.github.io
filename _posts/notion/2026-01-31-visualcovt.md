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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=b9aa21b9de26ff020d09db8fd89b33172c0a9500fd39f9f9897d52af6d0cf7df&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=05afdbfeace82e1b7799e29d951d4d9e07d74510cfa2c42ed083b46ff933c589&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=fa64890f174d4a64ba0b8d3b78262eb83c447d61b57adb471ead95d36947a92b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=9cfc7e160155e8654cb1ebdb1057694347ea9b41f74c5bc5a1cbc0b36535ff32&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RWXVF76K%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051715Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIGeI0W4gyZrUF4BI1vo17arQs2NlffdfMTkB%2Bh8KkaKbAiEAl82tYykQpUPTCaNPQlvTxZ4jkPOxj5s6bHIMXLzfYtIq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDH3T6vhTsG%2BdrsUjMSrcAx1MDId%2BWecqRg%2BAlGLHbTY%2F5o5MrqPRNb5gngGgY%2BZ5t%2FDGsMZFMQcRHS4xbrk3L5XhU%2BUsnnXL7IaRwvjAvju79vvNmRV%2BCPxP5XBcwrx0NW0tldnExnS%2FgVVsfyGNoueNt2wJcbE3Dbs4ITAC4py39j2ZI0S0TP6Tz%2FoduN02Y58hauiU0%2Fbj41tmwnS2CEEgSNJN2FivLxxzUld3w7VS9X3WQR2wokhMx%2B%2FfRnU9pm0dlq9%2FmBNrB%2F1Mnc5a1YQF5PGydq9kXh7doJege3v3YxhfAjOhHulpfwzjZl3ba3npzCRzuZhMGT8dhC7xEoLWXSAqm206LDq3ZObv36EJEqlo5%2BxVHwcCh8dl%2FmXa57TWLXKoI5EqeG6F56RuNgIzy%2FTwzAHQfgM%2BBMeGunt9PWlZzisXSbC6d2tgUNXJO6A2hGsmr9wJ1DN4Eg4Jmmzp0eNbpNas6txiPHlC9dTHh3PHBPRK92P0xfqmQhsLDpva7YTczILzPZdG%2B96TUN4Lxjntss%2Fl8XQb91BvdTqv5kEs7zSWP0hjf0OBCq%2FIZYO29KO3pPhENp%2FquTtqTEQ3%2FCLRTpux19QkA5ppH3gaBVFR8nfqo7D9tF%2FNRjxmcNHtiaVpCQtqgMS%2BMKXD%2FtAGOqUBZgj2aJXAm2fu3gR1NSMYeFYRJlkP8d5bLzNk8dE7ApZzztmpf7d6DLHIIdMZZl%2BcCFHiS2ZVhFPtf4LvuB19ll5f0gpNYy8AAGh0LBtitZ7zOaXNHMHDqUun8WLtPK8clxOofnzxksa42C6Qk517pCf9r4Eh4Nb5lKg59%2FEUslAnwqqvERcI0HQm4pY5%2Fj%2B2GBMlIIXAtvMxGJd9JXqxSgVvn1Gi&X-Amz-Signature=49b36a9661ed7cfb7aa47fb168f6a0b7e2390ac3c6dabdf5fa45f3d3fe21e199&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XAHBGGFS%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051721Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCzJk9IW2RkSe7dvjuQ3ZF6TgR8fQtR6awX5nBoigz4dQIgNdGYHhtlh0C4wmEMdqlDrbMK4i33exdETyJ7WNmG3qkq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDIEr21%2BYglu9Qzpa7SrcAyoJHRhiAK4KgoW8Jz8u%2Ffen6dJh1vTLlAO6H1AWKcwV5%2Bj97dgBnsJOntXsRC%2BmmarP8cge0ZWs6xn%2BPOUnh9FRvwC7NAEUbJHFtZe8MaZfpWPYsYC349jQvytgFFRLjgFWiXsV99bwdub%2FRGZ7nzpRZXHiHuu%2FKAU4%2FV%2FFtehJ252w2YQvM6lgAPpREha6AhZkd7QXSB1odBeaXF%2BXbt9sVMOIl%2BWe1IHk0Arc9zozUD3cGHyQSNFJljpUaGz%2BtytudscgrWZY4qlBlOe1AqIspB09Rr6fyrw6PaY3GEC7zGhBdLHgysru4lsGdzvs9jtJK4rAy%2B7CKTVVNRRgcoGVBNrW4rUd4hxIxY7%2FrPAulYe17AcmKk%2BCliRm1vTOqNZOp5G7ATqwaVBv0pIvR4t4q3dgnYkuH2TDhGG2BQ0EjQg6PrOdZzxjSbrGDGZvM1M3c17u2Yen38nXren5xoV1jOFVBGsb9Z1NuGiSJ0XmJKkrAhRDOsXOpl5M%2BGzPKCNxqe9Td5omOlvSpG08EHA9WHO5MCBpFLQQSSwMMy%2BKvH3vpF06g83RHyoysWg2Byg4deeVFXl9uVMdX2To3CEw2sEF6YLE5soZU5qky68JDNHD2XvH%2FXfnLeanMM%2FE%2FtAGOqUBgS0RrYDkUtk1p4dI6DRy2YXIa8YzxkZeWZqhZ%2Bq6lzD09CI9btxHVIgPJMwVEruiwWPWHEjGNIKolI4R4sYWwlYboBS7LEeMEqOamIf4fUSxzWY7ri2RTZLve7nSkXXH%2F7XZ4hSoqmYnNfDo6ZqpzclRF7GZp3GicluAtKqsLR6rrdcOo12OUk1Mto819Y6hH%2F9h8wfV8H0%2FW06fgCYUNM6twU8h&X-Amz-Signature=74315c16edd18d827b00b045f08e377a328ec186dc099e6f03dc5e26ff66f0a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46655FG56IB%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIDHbzQ%2B4sTkWSgI49bfvVyYdUVqbY9lb%2FxDFbtCEfZyVAiEAng8dBJVkCYwapH%2FLkrZ4BsnwQDD7ZK2jNbqO6z3lIvoq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDNNfFsOPtNR9gG2NlSrcA8WCwcNtCR8U4vuntURcGi2CBG6aq4STDN7DZt3Gg3J%2Bqg9B%2FfLgw2yw7ndv%2F8Cq1hJyWShGylQclkD60Ffn%2BdF6SObxOE3Q2jSaATE9vS3y8R2ZstJdCYBDPCCeHpXFsDSjdxyrnaabWQpV%2B56jRbqhSqIr2469nord5kdOQRJyKmyLEuEswJEWDOo%2Fp2RV4Iu12ZB38ovDQlKWdb4WfyF%2FvlHQlXv1ZnySS7LoBSgOLc38NdHXe09fyNsprR0ZNLOeWQVfWcEmOA%2Begq1u1r0XQ64ZyKbMxuiYhu3dbv2ENzzeyf8w9tQMtZQwcc8YXrNoAymquwY3KwUmdkA%2F0%2FckLfoWTNvsuQKnICHP%2BAcRM%2F6oIKpk9B3CQFCcNLb2Vm80vwb%2Bwg39btxRftXyOj9Zeugefqg3LNCq55N6NqzNczEtmdCEz3GB5WQ9dl0sZSrgRGzb7aQuKgYN%2BJDVRILx8d2j%2Fp7zS2xI7dhS95gKn6%2F80ikxZMPvrWRXbiSwmCoAZ5x0h0XTqGrVuCtdvcVnkgFaLMgVcrpJHJo50c0FpggwgC3b9k5gh8c8gYy3%2B6%2BwFp6wojWGRd5skmLf9dFk35%2FluXi6%2FGH4tguuu6iU7dlr7VfRHyJQbKlFMLvE%2FtAGOqUBQO2VsR442Umeq5yE8o%2Bf7pGMXS4Pq%2BV9JeGyKQM6kdZXMRMzpbWWNHAvJeYMo9oDckrlvq714sDdR%2BXUpGe3znvielU4u8TSGDvcLKoWLzC0nddYBEkJA7hodftqcVseISXUH8Bb4%2Fn51N70GuZn%2FJL%2FmN2RZ%2Fgi5hS0tra7MVlmXQsGRiSfs1%2FyiI%2B5o02hB6gZweq6nunrerz0MxB8zPZ1%2FCuU&X-Amz-Signature=259c3d0540d9304d023f7f0511fa23ae50b0f9ba3888ffecfd8b8a69ab109f86&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ZEUR4SV%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCICp6EjPSQN%2BRyxh%2BlvUCv%2FNSSoBMFfmrmsj4ICo%2FGcvaAiEA5ptUzkSoU%2BeJUfjYVNzIktwNgs7nmptz2GfIfAHAsxYq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDJTflW8h%2BVLsTM1EBircA9eQNWWkHyDo2iDkrhXEH8TLXwjH5%2BtgXhaUV%2BmR0M0jBpEL7OPpULCF%2FsNu4VAoLvUaC%2F1gU%2FrCddMHlJ53Y4rXOlskkTTnUb0iMtggBz5JBTaY00x%2FUPOQht5wzdJ%2FWjigX1LEG5U4R7KjnvZCth%2B4cGD%2BI%2FQAZ7FIZehwhjZGL8D0hYiV%2Bd55hEAr7qvyMG3wID433aoOVagJfj833AYxW2ldR0TkUp728HNKBKVEWByE7GvwybDLNFsmzp2Jc9hKrrbbCGAzpetvdImYF2BBhVQf%2FSPomEVXFqauBFgUgvwMoXWWP4t72Qf8Pq5NGpyBQqLVcJ4PR07HTQlumsn57vIrFaOPYjOqknASKxFuTDwKVxX90RqldPwKgciZFmMfFD3XFPK4qAy5B6FraINJz71hMg2rFY%2BbX%2F3Euci6EFAWC6GTSoG7CURv2isQ4jBapdY2vgmJYeYhxR4IAKvqClT95LYv0CH39Lo9IGtbrz0DZhcXNz2vbQlhTZueZaB6vTiiX7Dap5D3OxL%2By9CwvxtBs%2BmotyNryXHlXQtvIW%2Bscd57UUXknj8MdUzkn7OiAPKPJkGQHmdo6%2FE9jFuzKTPDjJ8bRiULBI5zkKWDg6paO6BcQJkCg7nWMOfC%2FtAGOqUBoJ8v3SCk2HujznyUcvTXZ3yF5eMod41pSN1QAGBv8s%2BqKEVhFcpyGGzV52j0ekt5EYmuvHyQZAeMztxmkYdgqsag5E6ssvSzNSMiQbN3grQM6KsWv7AomJoMOYYceenKGWIGHckiX4aXWcFCG1pQZOjCRw%2BbK99dsmvObuTNPPtPSB5clXZSieSMIw0OX68P%2BodTVRtcF0xoV0QJhDv7Ngs4d6KH&X-Amz-Signature=9526e179781ca7be0c61c60b2b62e82423d95caf5821affb83bb6042c2cbbd0d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=2efb6d326f152fd6d0d5abf4a0c756b9bca9fb52cc3696b7953f80cc2e2ca8bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=d3c87c1fbde8f7e319b2350667a45e87b8b63b752c5b9d4954b8ef03ed74b88c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VQC6UVTT%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQC3vK5KTS9jI5FeBDPN4Db3dVMkaYu5dDcjo8EEW7blsgIgJekJZgT%2F9ZK4yHrleCcivun24cMDKwvaxzzuGqAJei4q%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDJsbtOjz0xKZZHqqayrcAyRe7xgRVPXy2L1Q3liIYec%2BVnbyUwCblxKmUOWbTFCEC2c9R4R1YpYQwIGkQARXHeML%2FlzY%2BjbQ63KuSCE8PiTmDtUIrBL808GzaSA2xv5ssRGMxcbkkWWAAMQEbhCJv%2Bz3SdEnwZ9OM79bQ%2BiMDkMc7%2Bvt7uSbVxA5Jy93eyPHQXpEMcZH8LPi8Pxx61%2FDf833VIj8vssd5IjtXC6lmGUz8tLWdS5sb3iulnPiZBuMOr7mOJgIEV574ih4%2FD6K7zmdYDKiROcFocvskcBc9KeA5%2BpniStzQ2llCtygBDqYi9269NC2A9YkJ1ml4NQLHTMQFpxSG1HgyKKsZArpjmUOLn3lvAc2WNeVtlo5e1j7hBjMPlVlJ%2BckTPipnDCXUVRLeumUrqt58RdbkkJ%2B3yyv7AtklInHKONGjxN1nPcZmlj486TeoAHr%2B1LXp01LHsun8fyP0YoZWkCnAsF%2Buvn5AOOT8YywVJyL6k%2F8rsrPF2gs254g57t2cJmIvzkpoZgwSKWU2ZPgPZgzDCdMf%2Fy%2BZOjz7ijmwSOuqJ53IM3KfI2q%2FpcJaQAFQ6Jz73YS6Ab5eTSjitatT7yaxRsl0lVqS4wcz4%2BMVS%2FBtISCZ56EoAe30w2Nnbs51iqhMMrD%2FtAGOqUBKZ0EMjPqpAvDNOpZhFHe%2FQm8oCH0HQNXoOIxGrIpQrdJaXDebvdLtrLjiw2InGi8qbAxgUts%2FeHTnrtq90tWuldsIfia0jYfDTQJ%2FbKGRiHYh3tekFFCON5JHsRqnU4kbxB7zDW9FoJv6%2BvxxbB7ItblD4LWZFQcdcTCh7I4cpB78a5CIkWG9rzQ%2BSMsGInzio%2Bwwsh%2Fc1nt4rPog0no5obL0Vsv&X-Amz-Signature=0fbbfaff0482058abedc52fab0e29608c833bdb30e7aead1f8a4a10d21a66431&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=c5c86e3e4c760e92080542e06273a1a7f76c8f8206160db5f567fc632107e781&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YIFQQO3%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQDMJ2kgRTRhMRlFTIMy6bRGMNcRLigja13Ks7GZU9zLwwIhAMPYwjbHq1AHLzngxVAS1EzK%2FRFs7rYVeKlINjl%2BKiKgKv8DCDUQABoMNjM3NDIzMTgzODA1IgywJSnN4TUsSMayhjsq3ANKlhHNFgBgEyHK4UQQFTJceqhO3QqSZAq81dFbrLy%2FkV8EfJGVD2S4DvFP3NE0%2B1YTgA2Dqqbu2UiNCFH1JzoDwzSUwLDwkyjiR%2F%2FMv9FUozNvKfygYsJBjXac311kCYXefm8LDd1%2BdgI1vg%2FRdavWNHr5bINP6K1%2BbFgWer%2BdqQTlCEEEoEUQRqnbsGfJwfFKYX2IWc%2BdtrOYFbw13ErFI43ZzzdTwpWtrJNIaG9dhcZ1Yr3YcHgsZ1c2ZNpNfd71o2cTXxvwGROnVSfMyicDnVPGNiH8PFBpMyPB2SB%2F2jTPCTJdw7AGbVc3BtikbalymJN%2F25weTQgCPMfnAOWdKJTuzMgOw4XsH%2Fx4jEdEByOkQb%2BHdUEuZHR%2FTrztdwwWxTNY%2BRhSJqwipdSgs16jd0BoBcghluOub4WqTiSR7%2FDknFt3zyA7kNRVFxwbmDOBmzhqBE5iu6%2FSKCYWs%2Fg1Z75JekULJzwkOKRREmu5gh%2FX66o3%2BMEaqUjGeJqPPQCw4kIsUn1dwry4aclOJyrVca69B5BvrUsxmrmViKg1s3mgASwouBwf6GqzLy0j5z25kAHaL3WKnCutsSgsG7GzNN0EGFu%2FJVpcwWJuaoR3vVP5lWliOzVLB8WMEjCGxP7QBjqkAZR%2FUuxyMSfvlzgt%2Be%2FsfmOYX8BdWO8XsfJ%2Fat0nXg%2BGMU%2FmktoWGrj%2BQ4%2BUe6kIRw8k57G0H2gd2MS4ELO%2BkE0GZZHEVRnVt1IGCmwc9deweYxJbk12cwRfkQ6q5Rc0DZ1GZKaBhVkPQ%2By7nmaLEB7ZbGPvbkTuTtVX8kuQkBLZwu0zb9o%2FRjL4V5hrZkqCiZHYilJoa6RkQfIeCp080qqoX0Bu&X-Amz-Signature=c19338d9b0542fd50bc89613ee926a15b1b59a57c0beb1f18a3a5c1770a7294d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667M5OW5WB%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQDJMJpAnWHogAqdMsyOlLEDKVdi4rtLITFIPN7Gz8S0qgIhAIo%2BzFFURmo0172b6%2FR3ytrmO%2FomQTuINu1Tg41C5gO9Kv8DCDUQABoMNjM3NDIzMTgzODA1IgzogV4pPP8n6Zd5QdAq3AMjXnnBxxJKWwUOgQ95oI69CDCI7k31msPudnxWjp40J2XDIahQ5%2BldoLfFgTJ%2Bt0gTPDn%2B2IoE6nW0tFMLy%2BadirMGllX613%2B5ncDObzYSxD%2F21O%2B9ph7%2FgqkOdhgHARmOMF3U80Mg9lgDktP1PG8zMXdAZCFRiAp9r1S0Jr0MtXQT%2BwMqq7MaH046ibsMzDyrO7ojZ%2B7kDXwhKzF89uuxtm4XPLxi%2BWcjR%2F14ZQeQvKluMYpaWhJhryHxJZFetiS73ORikvIUUovHvDH0YEsxxelYFNA37txyEYno2C2Hj4ULJAG6fuZ4Mb3T3%2FMJjVOs90FWN21WSQaoVPS9Rx0KLntD0Yt923XDc0mJ5Xt%2FnFhzvbQY9d07v1RZ%2Bt1yhEzMiY9MYIDV6aDnIFiOTGzRlbLnVOgHgMmYNYNngtKi2fdZZgoP0KCgsH0yrmS9h%2BaO%2BSFMlBqedQZoFGAYUPAQxV0lule0jJzTAcGR9ArAPphdii5UlDz1SQpJMuowdzTVxpnyHaFhENkXMyeBGb%2FGIuitD7ddmJIWbdo4OzUy6G86xk6NX9SXPp6ATnbdGVlVLVa68eaIB4IPeF84PoDF6vGbkEPawKXX%2BpmPk8ROZJ3PI%2Fsq4328l%2F0jkDDmwv7QBjqkATue9gI03QlVl1W%2FbCEmBbgJIFO6CLBTdOupfz%2BMY3LpMTctsjlreCp6DkeKb5PILjcfK3Whix2LorNP2oSN5fQNnQEXMh7D75rNPc91BZSBzcgIgi3YBXKgrmx5vuwGa7uxsMBDcZNaBiCkHKpCy4MKXbDNevDw%2BCid2RORx47Kyhvh%2FQgo8m%2BAHhGtzjG8%2Bp8bO1hzlgjko7zfTPbZmSfZjEg%2B&X-Amz-Signature=b46c565d06ee9f55b0ef7f02fdb1b603573edec473997a83510dc7429096a292&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V56N4PT7%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQDyvSfybcLQuWcRXAwpRxHGiXyqHFof2pc%2BISNTCb910gIhAJY2lqm9ztGYbwI4dtydhRzCMZ6eO8EW0FbroIzqQWWAKv8DCDUQABoMNjM3NDIzMTgzODA1Igwsd2a3Sx2ykLo%2FJj8q3APEah1tjZBMEjKDWazghALBgqITKYODSPehzE87GLLUm8Dblm11dVBaZvRQGe7q5Labeqnv1WmNPCt8m%2BjUHCH%2BPGhe2ikiPsaol%2BRUvN%2Bgh618sTCjtyM7wAfffkctWaAsl%2BAH51rDlazYnrAVUUew%2Bi9ZNdMUwHKJblfyl5nwbU3w8%2BDWo3IcTDGHaNFohv%2B1PDsJgC%2F6DCWt%2FEIeT0Cvsykp5%2FtOd2vL5A1ty1vghpdhUWSQcFfGC3DXtlH0%2B8TBAYe4k5bvTTH2eVmb2FSNLyPJ5IooV3H6Pg62CIn6qAGCCxxgEhpQ56lZUkuuj7AMxQDMD%2FPz24BatCvM8T3amFd4bR5q0nfdWt0Zo08eM9FV%2ByJpzRIIBBPyHjX1XYj%2F6nAp7rTbGOY4hAKJINjbrO1VHYvGG%2Fpee%2BJF%2B7fv2uKULN55j1OVUnJ1P0SFPMFHTMNqS3EJ%2BuS6aQc2K6QcG%2BTukOTR4OXjbAeTZgjtxhHWb%2FHKEJkisJO1ov8ZFNFYw8HrQkex%2BppHrWSTHvUcEMxFGcxDlrgiyEZmuM7J%2FYZOjjrhn6TYgPnWGSi17D%2BAqf8TGjSU92XOT2NQqc7xDSknmKpTi7Jl8fO1qwoeInmTpoDDDEbEmU%2BPNjDswv7QBjqkAW%2BUVTUF0QjrZn5HfvfEMn3AwKpjSF96YI6lzNGKcoz%2BCol%2FUYcV7IsqwpoOTaBZp9z84DuAR8RR0IvNnokGeIylN8gGfwnfNcuBzd8xu7Bujmm8jcRzxbSE2v3uI7brgNz2X%2BgFl5IE1q6dbDsAaXi%2F5kbtNdq04rBWohpubKafiBFU%2BpA%2Bjhf5GbV3hVK8J0AtSd8%2B3mGPHCMY%2Fipn0QE8S650&X-Amz-Signature=ba2f3b7555d97514233301b20b24a4b7b1c011f3a0d43c437d7d82853e8c4369&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNZLDHR4%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIGBt2AIFjgBr7z6stH5hQGbCj4mvIWBhRPVsw9Pb6cf3AiEAwr3Pn4dOCSIgRvyDb7F1qSqk7x7jZ7Qcrxrn0tXyfNMq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDEy6n2QO980rkrCS1yrcA8FT4gaiCcNWtHLHzuCA8diUAhu%2F8LJXNBIxicNnp96TKQ4U%2Fsra2Srf%2BTN1YfiQY5J7bXxlI46T4cnxsEnG3NQu4nTcwLtzu4OAHiwrVxYPhqo4RZimQyXFu2DMyur3AXKhCCAVM5oC4GZJGlomjjkrk7Wv%2F0RTdn%2BF6ZXY12x4lTTqr4uKiB%2BdfcLhOHuZmYUN7GYffFYqiqfw3fEGhHJLzmUXcj5sE%2BHxhUMETFg4k0IsiqT0shnWA3skODPMVDvYtikjQJN5I%2FF2vIdDzpf3abuoESLaiXTssbQNVkOSniyD7Djz%2F11yW0A%2B6yl6oEx6OJ0q%2FvOMJ8XmEOQLiBPU2RGEtvCEa4d4BcFFvFTe0HhyqD4TvvrZHwgMlDMkSd7qufh8SsZUal17H2blooImWp%2Fofo7qhzmyzOHNKpXZjC4KIsu2kCUyE75S5D%2By0W9j%2BFPobGjoNf8e7hY%2FMouYgpjcOcXbu85VQxingPbqhhLZaYLYkzjkbz0PI3TwRwr84Vuggm7FdSl2ZaZ08lynJHxS4uK37oBAUCo%2BjSuBanEPqgWG%2Bp1bAB%2BR9TW%2BhVMhzCPz5YT7pkEiMuADd%2B6vpKlSBAPnhshyMnmHof3gh6lgPA3C3NH3VJ4LMLDC%2FtAGOqUByHcXUDxg6%2BRnTE4yRPFpkMQyx12F32%2BlAeFGxCdieKC%2FH8%2F90KHiAhFlmBk3Pt4ovFht%2F8gMLfSRYAXOVo8zdeDwEBcMjCEtV9TiPEUIA2wlvNfPd77WYlQ7J2JTvUjLvZ8CqRhgSzDq0P3WMyX5JJ8MYz11rG9OIsJm4mYkSRLF3%2FlC%2FGaLCKZ10NjB30qdiVOWuRHhgFtMjkzMf3fSbYaBXyVJ&X-Amz-Signature=300fc487aa1fe68d277dc81805ffdcb1b0d93b4cbd35cf583dbff168d4393d69&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=6aed39f1ceef609faa00cce72fec95d9f189e0286f73ec7423a2a53038a128da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGLGBEFC%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCPURWLd89ywxarBJBduswNQrOMj1n6fNt0DRpm0sBm2AIhAJcsto43gBLMpjbdua0cz9XwmbfT1CbXi%2FUi1DQqmcF%2BKv8DCDUQABoMNjM3NDIzMTgzODA1Igxnhcn7XiMctfsFyVcq3ANJZiBhyH7DARXbmMoRXW4NDjFNqZM6Aukp8KWVeYsqccgyLzXq0KR3EoL%2FhH4GRE7TcJNju%2Blkj%2Boej31fW%2FHMqpvUk2ScmNJ7pO6COJ2fLybdWFuXlIdKG%2BfzT4c3KvC1hxKpmGrTy5MZrSGl53wNuCYbPT9d7qGbJKeNeExoy83FL3D4CHtRjzCFPZzJEDxXMmYKxd2TG0TXuNuIjArlBIwQY8Toz%2Fo8TUImju9qXlAUSBfcP6imesyPr7NVMX6zphV742dkbgsfhtTuiIqsIcYmJWz2J7x9ZvIVNTkHoA5HytPcD7y%2FKnYpydx%2Fw9CPRhVyykiSDxQQQ1DvicT%2FxKEAcRJ9z9E9bmrim6b0Qum4%2FDDkJ65UTfmeYX8YIoObpng6QTCqhffGdyedf4EVm%2F5ipxJI3BNoAg9ANF5XRyGWyBf8y0c74NHedkXCZQZxfhIE%2FW8bSrrH%2FunQB0MPGGcp09YjPjoIVTfTuCjqBEluNRgK%2F4od55IXwEnYEuzdIQiog0K1tC7vNBSJZntatBU6ZqKKVKSq%2BQsEi%2BK6Y9cXNjOX4PnzLzvXbhYmSQZeRMjSeISIfcqF1qr5oCIGTjgxDFULoG0ivigMooMVXy%2FdGJW6fBRQaVVIUjDHwv7QBjqkARL355u4rNlGAfPYsL11qxg7RsDa96QNZ1Uiu%2BFnkVlaMUHPx%2FAndw2DP6j6doleOuk7oxMI0A4Qx4XV4QKXXCb0juSF0CvXDluKRgT93YNVMpabUQRt2KXI%2FjuvRxwYpwzM2gFs8jp7XEgB%2Fj2G0b7a1YwhR6fFTGX28YybJ9TLU3LKElMOnzLuchLo7YfklVJ8XlDtgcWJEz7gRC%2F2j8yDDsHs&X-Amz-Signature=9a566185b58237d1ae2d64720a9b374a5caf274b10508b5a71349ab64d642a20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

