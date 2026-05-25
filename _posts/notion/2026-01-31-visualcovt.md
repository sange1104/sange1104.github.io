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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=c10a243da260dd947d9dba8270b31f2084c3da485649632c25f6609ce3e14a12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=d14629a3e2786ed55ca266e5a02858f5ffdd00bcbac8ef41a191dc18ff4721e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=c06111293fdd5ef80f9fda120f41f111017e115028a15232761064c459689c76&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=0cba75bb8da0adbc30b42d5c6a6d2ef6f0f509ca64fd2e9f4cd0b9c131407e5b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPVAL2Q5%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICngT1yRKLZ%2F%2BaC5IdUDKtrrhB0SjP4kGP8xYjYeRYRYAiBW554WbiUieWxULKB2exwBxSiYnd%2BYRuBZZN1awibDvSr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIMQipgRAntYX7wGXTVKtwD%2BXO9Kt7ECfu%2BG6SCOJg8MSfhGyGn03YAZbBMvAsdRepWc1pXOS2qXBSW7uxWajlYV2xmRQDEh2QrQfiTvsiQ%2FrS%2FZR8tERbGUHhHq74o8yggajcuRYr3JP9cElocNJUlu5XgHKnHi8BViumpVNRTgeKGP9SU4NyVPSLjITXUKDaQxR3%2BsW9DAGzU%2BMbyb7m%2F4xajvXoljfr4YCJpiRP1Y0rk3CfpYl1CMxc2%2FuMUaQPtv%2BM5e5ynFFb0Gtyi4juI33FqVLkhT%2BsXBw%2FVMRrvSIIEgw8m%2FgKJnTM%2BIRG4WNMpCj4h6GQvmTfVkol1Rk7kaXHUK8MnyTRqG%2B1Sb50OkKaB5ulGFEQ8vGtXDTCS4qKZZBd6pBFEeK%2BBxgIxw2rosmqRjTkSj%2B6iMudZubUNweYOu0vMLLlAJb3mzERNv1QhhRJCG32yomgY4YnK1WkSKYHGdxSvG2NWcrYGTPLc0hXLCKMNMXM17YzQ7u6jk35UuQqYacOER%2FgQVAWAOopUuCWZWn9GKGUjh6dzxq1V2mImvm9qwwrg6OSIIPvsw7oJ1O6g%2BH3oDBg9kBxR5xosayApwiH9W3AmS6yWw9rCh6KQtw6UIi7I%2FjUPyejGzh8au5SZeedl%2BLlf5sMwzLTO0AY6pgFzi7OIc3t5wtMZ2CW7Nk3f%2Fugu4HEx3XJGdECb62vmf37HOcYIIXHIhsrM%2FGxJzU5nbm11NMF6lCW36Apu91HGkYXknWKYZUtYHEmfCoTKoU67FaTey7akhT6UBOpnxMN%2Bs7HYEzko5h2pRZQKwtwbQL%2BmKia35FKBulBNAcKIY%2FAes%2BFl8I4GPrJWUHVEhi6Kl0XJIalE3eBJmsa%2FsmIWu93fXsEE&X-Amz-Signature=3c0dca67d6ea818d81bcbc7f7e63851c03bd93d66a16fb7d0fee5d2840fa8338&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664E26RFSF%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045159Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAgtw0ZigMVq27BcAKqUCkwqU8KrDBLU43RowkIDUkqxAiEAwDyYxVx31BLcbPAOVNI3AzrtYNisNbsCcYgoeDmM9bAq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDKbKVMUbzjsghOvMiSrcA%2FNWI5yctQ84PRs1ZVbnlTJcU5uwsOfTzk3vfbHO6JAZFAdb6OUAco7hAB%2FlNBHb1E6rNCvbByIwRXJxz20e6gNrmtgdmL4BTMgHWnCvlmLTiapH4s1Cj2AOZGc2F6eqscgETmzKm7LbFHgGJwsdZ715lCEcdQAGHNRZ3e7Gqc1VfWTSIZr9G9AnWk%2BBt1gDrfDrE5zdEDRRrt609H9r3642rtjer%2BKnBNOmVawjBc%2Fo8ZEAdBn5zVMnUPodoI5RYUmk3LbIWKVKNmptd0MguUovIfGLMPm4NGbMJi1zAefqS7iQeiv8anRH7Rx9Oz9ISWVkprl659pkE0nCZ1VesyyTJlO%2FgJhjsBHCon9mC%2Bi9b1KKcqOpH4vY5PVUtsA4gBCFT%2F036NMwwVvokgwXcTtck15TBtpzyudJ%2FbcFYty8iSmyPnfRAO%2BefaSEdv3ilF23LL8xuTwGBOhWYUXACkS7JNyUQWV6mImLmPD9oS3KqCD%2Bqc4XvQ8RYdbDAn%2FkPezus7B61mEikm6Q7leREoFyimtrnKdPXgylx%2BKSytfjJfWRlZKQ6j2%2FGIVAQDgg7V6vIGpmpOGBYGJ%2FprOh35LGtIwOYhbS1%2BjX4U8KJddK0SjNRNSRUIWE9S6oMMK0ztAGOqUB0GoEtWQ8b65HjIU%2Bb2EjPFpRzMCu%2BVOACVfYlGCGY1zfAo7ig%2FXZPQ1K9JYbGQXckkCqhryN9rZLwRRnxmHNEvR8gAGTuPUh37icfY%2FyWqJQ8MwWDCJcULPfjULO5ormhfGY%2F1KRP%2BNbwRIkaRu23VuW4qyL1C9n36Wjlgoka%2FoWla3Oz048MQDzpB7iIvolmRnh1TyhKKB4dsTtRhj7XeyHtHiY&X-Amz-Signature=f71d7943412e4c9b461f2604bd94c0ba81fd8ab2cb25c160759073c449bf97c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662PLEX7NH%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045201Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoEE5Y%2FLa1rOg8a6LuzcLREhT6IM6tdpn1LEOTmxb7SAIhAPTjvhQDqhVtfWS1XQ6DK7Qj1yqF6BVPzTeV8GOQMP7xKv8DCFoQABoMNjM3NDIzMTgzODA1IgyYVBRThwSVqvAzTUEq3AMjSRNsUL%2BVskWqLl7NCu8FXYLzNVrW0PckepA09TYakiXISmJ0ZqVlzqfFUSlVYB6ueg8LSgnZh22AIKVGNs6qOFZ2Yv%2F1xQSa8xzx8GMj4%2BA5U%2F2NG9l9hWTED5lgW1WVBNhvMZ%2BLTmwuS0XAFssW1TVYCsHzvpg15iNzuC1evDvW3MwD%2BzM5AoVYfQS5g9VLC0FZfwnp3GOUj0sIJfH%2BxBDI8ROMmT%2FuMq4aIL6MvI0DtoVNxwPpLFbvayPhJ8ndQ2IUuTT3MpfksCic9ONzGpKxbrMfLG6R9lQZOfgknHJCMOlUOWHUTQ2pW0a%2FUDRYk9Q8OQG70T8%2FjDL3WRXVkQzpIydeuJ2X4XMSwIWvq%2FyvEgDDCC8Pq%2F%2BDh51Z9x5Z1Rk%2BQr0w%2BGZ5%2F%2BxutuGe%2BGPopJEptRWD0%2FTVr1Yy%2BvX8LBvXgGDoy4F6Tj6zlyh3F1V8u43%2Fq%2BzxFP3zaBxjAKsmmYLTSYrNEe7fvbcuvu2xvarBWkoWXPxR4Pgd7TR75InvpHyvEzrJNSJrWfz9MZL5r9oei5kfk7%2BmWA%2FiRoXCkiFFGFu9v8TRmNSNkIvbtW%2Bf8gYMeik9xtLZDlhTsGiMMOQmUJuwjA7mSj9cjlpYpO%2FaamlAmIDurjC1s87QBjqkAf%2BRHa6HmrHFoEZQW9A0kES5BD2MZeerhmilZNc1VWL4%2FZOl8k8cfoTjIAGjI3zKs3xVvRsq89Sou1dxzUsKQrdBYbeN6x4Lfzqf269%2FfZFvcqompE9X%2B3nVOFEwoaIO%2Bd3hB5N0xiPjU7gIdn4nDBz55S5TmHrfd29QnnIA%2BwtcG3mwj%2BjOk2k9ODUHB%2F1h9lC9gXeCMmMCS4eVYh4kGvobtujB&X-Amz-Signature=779554029efa3f8b3581734c934098f68c32dfed400d9aaeb84f8f89c2d83fb4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XBUHU662%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045202Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC50qDM2i9EMjHJ%2B9cErjMXqfYAxbeqOqjvD%2BLCnDmQNgIgc%2FP4O3ut8XblDtHQjqny4afwAj%2F%2Fy4rQGQCfFn%2BreF0q%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDCw770%2B63kWS2VnQOircA4TQmA8iwKGo7oQFjoTO906hQt0XmuyJM6ow4k86BzzzOuhgnbPxGcTIfEPL8X2Nm0f4qPrtYvi2WyPIYZMk3EZW96jaeZY8W4EodhCynCuWXeL0%2BE7D9xU%2BS4lA%2BOYDIH0Ohz0ulwU4XzhTnSJCEULQvD5lJYp1Zw4tvanhEEzYAvpPz1vSeAin6YxP7eOktm5JP7r9McWf4JnKMlhW7qEYjmXODb7DkiMchzY9zatjx5kkbpkre8ho6Kz5Cv7MdKE4oedZ7oIkqi99Nopwsqjwsbdfdat715ErZUZh2NXhdOybzXXk6eZSXUzYbmN8tq7SvrOioztfLBcFihZC5Kkg8AqfCM5N6b6wdBa6z87%2Fs9av%2BK1rCM%2Bfg6WWgIxBmoXxkMKXpnPOJKDmMWQT2j32cdDdyqRwD9rtiOx4IzcGc1z333CCC48zeDluO8x5dRDQ%2FxtGg5UxmimJreJKhYCYZzCPBJ%2FrDQQ%2FmlR2iCtxK56VbkUId3xdZ1P7SuSy0Hr1tqQKjvQqLXWM1IhDpTtrWxWfhUqxu%2BJDUKeyk6mRaNT9D8a%2BTl8SEqMji6bKqlMW1O%2F9k8%2FNvGiX20F6tEM84fZecOW1M4KViNCe1jhwLcEPISGR26WWSB1yMOuzztAGOqUBFRT90gkBQggkkR4zrcVH8SzcwZzQC54zzsn1czuMk5%2BoZ%2F%2BBSB4qvHhmiG8vXmzyN%2Be%2FC2JxtsdcrNzK9JObfxJqN3Z%2Foq%2BsXxK4wV5YW30Mesn9D9egqSPS6ntky2H9o5mVykfkaVlXhn3Av2GXzipT7BGae441zpgNmVnV9RKkb0Qh0C%2BefM7loUgqvsd4zih%2B1GsECtBWCZHlv7Up%2BM8xtg3O&X-Amz-Signature=1c7cc97639d0a7d72366734cdeb3d289daa5e7e28a4d17db1513a59043accc30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=5200734c733d0d752b70b039462ef2af6165097eafac381d744bbe0150047a42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=c9ea612cc7b59f81b1de2911e09752678d3b2b5303dec3cd2ebf129d96bf0b0a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UK5OJ7SB%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDMOaMatKdi7cmhDjqJ0pICpMLf7lV1dEknBDnVWRmlOgIhALwZvjDykr1d2m0Wm5N3l1Vh4GsdJlyplVCIQg2daMAAKv8DCFoQABoMNjM3NDIzMTgzODA1IgxRZTrh3SG%2Bi1nXn68q3AOk3UvrCXaDswQA%2FlFptPZb5aaTYSOM56PWsZKNVeovXoNgF16JYz%2FAcF8nQUjoazSHNNk84glGfP6Lo9TqmE5IuEH5WlQfFf%2FSdr%2F8zWF0cnk9sUb59lA1lvDRqw%2BlozsAhdTXnBO7ZF9%2F9N9OFWD2Ur3gNF54uYEPvTHnpm%2FMQ2pAztbi%2BfvBEVN%2FHvhi1cxeb0Q1w%2FvSdGVFaQgPUa8ZhGRR97tXm%2FrHi0m%2FjPAbOmocFDQWTjVb%2BBZPJkOGo%2Fk9eWgHcIrnbdiMM78%2BSpPRHkoSGBZKU6nXN9LjMO9WR6rynzgtih9Lg83Br025y0X0FBLbez%2FINRWEw7%2Fze1m78O%2BmOu30EASrocuW4tVZvE8VYgqO21zYMEk9qQ6pxaT9OM5fkEKYVWj0RoAthw1EpWPcL6ZFCQJEAra9qf1Ga%2FNrQ%2B2T7eM3Baw1BAgr7fUfG5EiyOdIwEA0tDImGx27GoEHHMai9Hj44DpgXTPd3auNHThGWtLoMvPIYUmWWHGDOMWt5IrpE4lgINLyUW9MJzDwBjaRadCv39JeRaJDwbeEZCYokxVGIlLt68MfjQACI1X2NjZC4u0Flh4J54BHGWmohBF057y7Ko7TSb7QjEbKnjMMpo%2BZTP7rFTD1tM7QBjqkAei1dn0jn%2B5UXILSs4%2BSE7gjcxbDiljrDTmHhskQ7ocPuJI8%2BRA0miVn3tZZti%2BEnOMnqZ87nIpUYZ0%2BvQnJKlq14y%2Fex8kyGT%2BbtUSC8OBPn1BOJE5VGsIZRWwH9yts1UgIzmlTnVEijgQsu%2Fp8f7Ip9C1NUeIYVobofPfpPkuyJri%2F%2Bn18u1fA4B%2FRpbNx%2FKWNqMWkgwXYMjxFDi5yw6ebj5IJ&X-Amz-Signature=25724f32544e9b104da188cd24e55ea273ff24eaa114bc5389ae7eca0e1d5ae5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=9e3a21e7c0c97e837721293b679af86c496ea3d40e8d154bcaf1d3a753e30834&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TLAQJFCL%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCorLFZqwxyh2A5yAVbAemBe0mbnFerxAK7WzvzbcPMIgIgFZRbEsE6uI%2BWHee%2FZE3EwvRjsL5d%2BkrEmP833zT6vCMq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDKdc2%2FVJ28OhSIh7ByrcA1B85PlqESPwl5SrmVo8ZS8Pdkvvr%2Bpm31TB%2F1FfJ9pUKzYt%2F02%2F3DMTt%2FJuOaFuqhgVJ535DlEKNjkY7%2FeKa1JxiLOZSZ5aavOyyAx8dPtWYAzcApur6k2fG4ifMR%2FwW75lMo6bgpoUMTlZr9FKmlwauXstTNxXSDBiaYpbaKlvNE9yT9vyw0OuuU0GUQhUXJzFQSmZmgvLxuPNDp6Q%2FrNHQElulzKnF9vxfTMIvWYJZ2eweGP%2B1eQ1QitthluMOHDZL13F%2BI%2FVCiWzx8Nh25U4qtn0iHiZcP9ILmEXsg2Jry%2FrZErFJTxLQzLllLZAbt0vtjcFe4DJWI%2BpLBfQ4joN8Jof2Kz1yyd4%2FYIyYKXM%2BlYD5BgaZgfleaB5Cv70A6rutM2YsvEdvKS2k9pR6yZu9AlNKEJgVCSJgYnJ%2F5POKFPTgbPAuDoIhT7Y%2FoLe2FAhO%2BaoX%2FqE81YVW34Quo7vcOm0g2H5LlC3LM4ImwWdxlUgQ2vB0mqmFjf9DDJeKWfteNpUDFVEU8yy9R05UZiW3oEwHq%2B3Qy2FUkVkMws1POY5PDp4FzTwZvk8bujYUUxssq7rAsANEGaGfZorDQpzD9RENeO2nZaOzcr2T8Zw8swjWD3rV8duBJvFMPu0ztAGOqUBL2tqBOURqBzCUKYJvxviwDqEhKK1UCY3u4r9m%2Fz12LPU1UpiyHONdRNYhsuOBtK2bufdGnJPtGrbJeTvNPKGMZwclAkmjDiUY%2Bq9Sk%2Bm%2BsjHFHQnubXIff7EEgNMrMxFUbX3SKhQEQUR7bvVDuG%2Fc5ITHbY5zPnXzHWp07D2%2BrGy5MSwfPIwBxfsU0moF%2FAckc341N06JNjfEJNOoE48s6yCjwoj&X-Amz-Signature=98a45351e34030f93733b71bd7e6df091ba2c418d6908e9b5418680ca5b55654&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RU3JKM6F%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCP4AgpqbfmYWFFc7%2FmizqtxzVGWX78P%2F45SUjKCeLblAIgN4g4GRZMWEGVuQEn%2BRQmuscuIsqPH2GcKn9liOuJxQIq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDLs0nFK7%2FIJQmxEvaCrcA3x5fUfKO%2BV5QgoejCkph3rvuejhAs%2FC4wFWY0fP%2F6%2BCwHli6ZAANI1olZLQc0w35%2FwIzTmMWJD15U1g3c7hXf6XdIiX5OwV0y8g6oWbJWc3WOo2cIZkMFDFJdi3JPsOqXXCQBxhnj%2FXOp9OxkASabFICOFlTNtKMvGWwaO8YvYZgoWs04rrnFKRGwPcvaXssG53NYEskP4QG5dMo9TyaOrMx1L52SZlkn%2BUsPdoJJdyFAYjBt3%2B46gRItaLCmJ1Zm1QW%2FwCyPvD9K9KFl9BOo1HlpKY%2Bn1tl6FcyJoUtts4zzJBWq4HCQuXi3REwoRsV9MHk%2F7ck6yGmiy0qzkdSzx%2B1SykELRxeijmNgcFBdntA7seWUb8g6CMfb4DSbQZRBAZBHa14yzaYUuy70XVljTNdMbuL9%2FDpnU6O6nOn79tA0Q%2BcTCogpdF2VyDS73zld8Vnlc33wBbzTGelVMwl1BMH3i9aExTZD84E0kz3Ao9YSGiN7Q1HAqT7sLJ3tyBhzmZurOAYkVju8EnHmjIzvFpVQSzeUR5MqDdV7jRHOK4eUiSUfqLpsmVEcAlVo5mT7sOUhl6NNR%2FAIx3%2B1u1HHL5Wo4wduSppOlZIsHWn3duoy5gYyO9ps4N92HPMLG0ztAGOqUBVNqXl0F0jHEr08dVHHgyXcZ6WEzOibLKUlySDN19qZhbbay6PskgOEl1TGA1PaCAECQim9sZjRAVx8gW04QmLG%2FTl1QLFi5IDc1FTH338Q5QIbjHEmwepMNnK%2BHwwtW%2FwpumuWcXtH7ow8EXh4ew6XTiLDWVx4QWryRuHtK4OHlQ2MG3mntpxqHni%2FrWbGAwzOfVTEkAL1xd%2FzqDHCk6i2Z1ufko&X-Amz-Signature=7c140bd249a339c192284019c5f90781b060fa94de28b2386694f477b1e81d4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663T4M4URJ%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHJa%2FyHGnM9usb4l3eNpMfqqYh02LYy633P2EtZRuRcjAiA2NC4uJZO78mKJroDTu59Evcjsn7E%2B9bdtw9pQaTdbECr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIMmeR%2FH8xN3EMlcZE%2BKtwDk3YAr8aumjD%2ByCikgQ5vpvUdH%2Bfkljb2osA56%2FAuOe3YGvxCq2OW90wbUYra9znj1EdKXDnubr9VG%2FCUbqT7oN9ttaT5ZbSlJu8VpRFRxtn75rpIVCThuSNJQq9PeFF8PkpEhtvmkdTJQUlC7FIZB4Wofyic%2BRW%2FDcJZ2tghl5QPStbGOQoIWMVHFA%2FsV3dxnm8JoByRztb3NKs4DSpk14nRL6oXjEoow6vX2eF5QcFHi7CEiC4o0O2S3q8lrn1onZcNxsU8eVubQghRd%2BjZ3wzzHRoKIEdblnGwf841T%2F6MLfuvcBCnnZhYd0VMttKY87US5PtltVFmLcmfcZkFy%2F74xkUoChU9lM68RIUslz1ehICe0uNsu0ziohSFdxp71GSpJkDvKlSm5FrT52nArUHIcRwvZSfoMFWKLk6dYw7B2bnrwjTA7wKsT1QZrS90DvstV4jhxYtZ2UGM72E7A3W%2Bxd%2F5%2FqgR2NR%2B6wBOVcoZSFB5IsMpm2eXlObaOCQosjAV83Thf8HuGWRm%2BVhKz9aI%2FnUx5RQsb%2BmDrs0P3fcRAsHUYRRhJBvYbNnXM8nj%2BVgpSnfNfMo%2BPp%2FjHjjZStomp%2Fj0bmbGaPyR%2FXxPAx2szDGLY8eMxFYY9Ecw7rLO0AY6pgHb%2BBIx1ULwoDrrRDC%2F4mzwUU2tXzUlS%2FjfKGS7Dpho7sBdNvWvO1aV2rBxmUw9se45bNWAqeuKzAw5ePojNWOmVj%2BfiIPUH8Tpcb9N7%2BpD6xXmnntCQ33kxiPkMzYcK2y6VqwgfxLpxgFf704V9%2FwdmR%2FFbDJ6tnR6U78uz0I%2Fok0ZQLZ7Ek965Yrbqo0j%2BpoC4X7bU8y3dKOGagGpG7zB0pgxA9mI&X-Amz-Signature=7616c5ba91f66d3b84515787d079fa898e9fb88da28f43cd142476ff1d0894c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNVLY25F%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICfouW26PY2i3vPl2tjIYFbHhw%2BPFQNLOeinBCbC2xHfAiEAxavVtRNId2S%2FGrsCE6KOoFuNRlIfbLwmEXNT71KywBAq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDClw6Q5v2CR%2FWvEsFircAytcPNmdRTs6jP3e5GqbYJDSrkbMOqGiV7oe6AKAfJNgojfiUvsNTNX1q6xC8FYJTDbNtdH1%2FXdEEI3d5FL4XT28FGyRLQng9hZGVJAfCZcPzGKA1iZ7g%2B564WmTGORHsNOisgTD72oOVLBvlA6iHH0Nnk05FFYTl2xHC%2Fp7Gbx4vuikbMQ1ugxwOAhvyez01436rJnUb9xfuO00rcyG8b%2FTTuXk%2FpxroqBXEf2A7F%2BJnON101p5STkQcUMNMpyKQnWtLsZX8E%2BaKnxou4FvlbWMLuyRvtSx6Go1BR7FH%2F0%2BkYqTE5kR9YIBY2k1gCUu7a3NefJ9G3ivgVIY9IhhePsnPuC17aRUURv%2BAzkZGitPg9hHVP0At6QpLLsw9Wx0dAi9T3wN%2B9WFizKPVUtmrYojHTVxKj6X6q40upoFV5%2BKRn6Rew%2F7E%2Fq7PO00BcZFsAn9nW6LiRdt%2FsrZrnGcVDMVGXkGDYoUAwIa6Pdzz8v4PYiuGUhjfD0Aei2zmC7Lp13qLLPEsFBnA0mWZ52SdCkgAtmQPOZ3Gj3h1NfrtF1cUJKF5LvxdfY0xXevGTDrPOeVQuAhFjuijBSlCL6ghunh3a7M3Yk0jqzv0nWIZ1tqAY%2BJ3ohkSwjwZ%2Fy8MLC0ztAGOqUBRYv1MlotJuQ7IYZ99tZgbfUNvRcRDXk4BhSCPIyQ1CRVXsSZLAcryxxF%2Fyf8fyloE1U2wABCocf%2BEfxuTT%2BewSxWQDegdRzn9d%2BllpFDXOwfIRAS0u%2FQCs2ovU8BG8v2i0lQe%2Fg6JufKjiTATpdNzOkEnlEk09Zk6%2FXF3lXNJzDAeprApimfTm%2BLMKh6I%2F6sLNKSIBa78xrYpdyc51Eg%2FdInopJP&X-Amz-Signature=7f43daae64ee2ed6a33ec69983e7a70c82d4ff8b584abab0fdeb384cdd67ad69&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=f6f32e479e51b2412c24d3c65b410e8e9687e4bd5a51d19257a16dcc6f100419&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TETR7ABR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXvufYh8e1SOaibkyUhDL%2BF1FyCfP7xuupnIXsv%2Bo9ngIhAL2dHuDLO0q3XqjBEQZByzcRqK8PmQNj4hC503KzFVFmKv8DCFoQABoMNjM3NDIzMTgzODA1IgzRtdKoHj84KyRepsAq3ANDnT9xNs1cTX7nGJ1eZmQfvb7C0QmBJD9FJGAqUoXfb4idbX1wH%2F8fP%2FAgaIF6rXLF%2FHgwl4pTywhl7kuZRNaH6%2F%2FUl6eJtTEgCLo4qEBIj0WsqKVyjUn3TNT4HZO5GIEBDD1rfB8TenU8u%2FALvDrHjDpla1lyTzXyraTpBExj4JyIwCWCY8AjYSDWdhGRmKlVpucnC0xm0IJrLvx7Pq3xn7RdxfLVKJ%2FZmb1qOSgriud1zXmkhz4DfQRwQXaUcDpmH%2BOr4QgTm5Pkm8J4rnjHKLeHhHvhKmRq3JvGVJS4jp16Ah3%2FlGGMw%2FGb0k8NsoT5x02EULSh8FvwDS827Ii%2FAhaxe%2BDhITyS1mRRsDbCIdMjjkQw4d6TuemPw14LVNJf5nrTT6Rd6zrCuFM%2BPaiwEMBrZkUZA1Cu0%2BOujO6c0qqjL3i1hsybl1VPzm9LY6yOmBWStes5DBHMKhHS7QIMS7OAfR5TSEIaEC8a603enJLQRd81JOf6woRASusd7gJE3MH5XvjdmmNao39p661ddsJOhzN6D5fbNRRI9IuiQofUwQhiitbksmweKw4Esn9SY3H9%2BVxZPQoexTIkw%2Fpq%2Be4umpLUVz5kClpLDazVz4ogdDdBm1NrycFZRzD7tM7QBjqkAT4xt22sgqk0BmuDIKyRoOS%2FT4CRRDJ3X6ORlH76stFp3JwxAmkiXw5sOqTiNWalnZhoihY%2BG7I3TXhVNM0bzETIGmyv6A4co1ZhuIeh%2BGpAYC%2BkZTT%2Bl128LbhNgg0KJocqZSzrpUVgSOiY4w%2BDzdVRRBwbKiUJxSkKNBldhH94xIYv43ERDOVRtlI0RtoZCbqo%2FBU4KMdhIWG2AezWML5Ko4rS&X-Amz-Signature=0e54a2fe1ee6c31a7bec1854a9769838533e2caf251de781cabfd748a1dba914&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

