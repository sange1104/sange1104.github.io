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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=abe401985e21421002affb4befb47c8371dead2e7f5e11ddb3606fd8d265a206&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=9f332230a7b46be1080e667098d9caa0e226d03984934e947b35c4c13d802651&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=395b8af62adf37f32f239173b67ee79c0c3053f836a0056effc485dea82b0d90&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=479dcdf6a06d866d135b11315ae858d295524ee3277127852e110eaed49942b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q35FGSOS%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033305Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIDaAUPUSStTZkYKoEZz6FqZynGMVwpr3CrT7%2FlRxB%2F6YAiAkvk5EWYfe7MLp7aIa9ggSqrpFccSgy3KWWRY2iCGb0iqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2FTvyHNZjU3S1jqTYKtwDROsPDops2%2FKfE5yTKQ7WKYqNp1XYbUYZG%2BnILmlFEiCe%2BIXRMrdZ%2FFUrjeR6dNQ1cKqjnckwiQCXKc8VBNhkvDuNFJRfDFhbCwKUEwU%2FWUX%2FE%2BxagqHhglCXNv24w%2FxNqdEAk%2BvVy3oldaqrA7wXh1s1lvg30zK8hPFmYpfTWZLf0VeZUQnli8YvVZCXLTevRro2%2BK6t%2B473ifCSrczr9qlkbI8uN1IOKVN2L%2Bx8FT0C14QtTQAJbPPiXpAth7bgQi4K27KHMhhN4SpSwE74B4mVU9adsjI8nfUjFMoPJABYSRum3vnOHGZrWOlEaqXQO1ataSnaC%2BJr9iktj5PSLQrOx7wIScE25gM0WmoJChy%2FuQaKrxDB5oMY6YPs1WiMxjWvyR%2BMUqB0Zpanc5pxJ0pl35ckoylvNKar1Zh0Vw97OtxNWBxH3ZCq7LqbdWAKRpIqW%2FSXsSztJvDaEIE332MvfmyLTn9cgDcuGclt4MjU1YZR%2FeSxg%2B6qMhRBCEmEMhu%2BpE%2BkpD1Z2y8JAWL0BIiTo1S8XovEgsGAYKa7gVoRPjXnpUaEsJTsWeYfKva07d%2BT%2B3EP60q7KGxWNGKH3RIKpeH69MZD9WhP73I4oZh6wbWWooOXu3teJoYww8jRzgY6pgFVAPfe6BHDUINHGOx7vKqbDNL3IFd7tiPy7ZHI4Zk81sPtEk0V2Ks8tKqG9140MhwRPVk6vBSPhOxavA0imqRd%2BCMeeITSENfn1ulwzBnDhNLDCz2qfmEq2i7Ky9F8GzRnJCwUDGBiRaAwwX5l5mpRnDGt%2FosCBz6dQhD7I0NknR%2BJ8YLpo11iw0sJ2FOnZIelXyF5b3Mx0mpQvSAslf3ZbmM43BdZ&X-Amz-Signature=5c995c1d3e58a92826a4ae6bb9cc4648ca99f6a62674d6dc9ee9c5f0dc68ae0a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZLRKXU3%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIH3t6GpgQmaez7wXpxzIVu4goqs9gJVQQgf5qHrMtj6bAiBNm2HeH5S42RHcZ8%2FFN4LJTskJOPvT%2BA%2BOzavtVU8H8iqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMaoqNVJCBxLRjS%2BXdKtwDjtpkHYwBlMX87f1sC0Ox4DdHtIGCxjj4FDGHr36FSpEtvad%2FvZsw9Ex2cWYnRNfkKhUys5RaIecAK8ur4qjuo1S7nMPM6tOrEQEdqYS1CDlZitaSE4fy7Q18V1xquoyr2DagPsN%2BdsOOq4WOJ4CCWSxwdo33Dg1SUfXEE%2FdR1bpw2XJCWpRiD6JcRjQwA0AN8WHtAetH5RL%2FGB%2BgNaZwZ1Yt0lio%2BZrKxPD%2FjmN7FT8HDItMfBSw1zEeLj3a3k7ZSDNABSfMrVFzNpDpOomLyl%2Fe79MYMSKTms71UG7BwGrQkOJrPBkGhSNDBzn0XuuK9R4b9b%2FYiHx468wPq%2FjGAKg8oakVSEEXxHLR5wApxdc4b9KxmXNqvL5bmGATZIfSH7%2F%2FhZV%2F8lqzeH7UgKoMEYhjr0J7U4OuVzs5stmU0AmJsT0nkIaoOB3QSG9c7KagCnW0wL9vcqu460lP6rEH9YXUB8q9S%2BR5cnzFfA3OpVWyNfBPAWND6QVmb1e%2Bz%2B2hrllm9ZSa4PPEYuAItYyZTQKxsHHzHUmFsYR6FmebKR1SIb4XJb8Mw%2B6cXL2lJQm0Bssdk8uN2Rn5lu9r9bodOrPE88%2B6N83s8PF8O%2BMbpqfJXUWzDE2beJEwETww58fRzgY6pgGwrtgeL4Q74SGpBg9zqoCNBiZNmkek10ODtBliZYTMVPgN5TV%2FYLklXmapDJ2xM2AwU9Q9uzdlzHhjVarPJ5%2ByPsEWEuh2CcSdNZNP42bJXmPHPdmkpSDajj4y%2FZH0cOpgK5BoIongegcq9S25%2BtMDxl6ClFTxTz4cmq%2BjzabnWEU9DpP4nSW4%2F0OzapFf5S0Pojlh7cyjuXTzAH1YUHu0h87RYGqO&X-Amz-Signature=7ab86499ee1932dd7afa30fa050ed6b489f7f58bf10b79c6ab669af6f78ca69a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WXQW2UD4%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCIALL%2Fb8FX8SN%2Fs9RonrF%2FDa%2Bp%2BvEKtXq0TfICnIv4y38AiAwkjjdSRXVfLbe9gMVWhnfHCSvJMtau24wjn3qNtj0EiqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqIgeLrUvLyfV1Wg5KtwDOi85TGVsQpk8EGP7IudADVmXmrpzvzXXywygtF41zXVh9uelOumBUFykOqRQQ0l8mJsQZLnlZk9KiczeXNIQ3lNclCTYa6RfrBslf5FhfeCsJWlCAvh2dCU6XI8bCqONn1zy6Vd0F4iepEz1YPJ7oRg7wYj%2BhFVHOHi9CHXhCCpp75edBkakHBUQ305O2mTRKFI55wV7hcwSREaLAjq0GG9FHTzIEDF%2BLvoF7kDjmRY2v6VFySvn7GrmQr2Oc%2FiorEF%2FSSSCdzIsKLaD9%2BHO%2FU%2FVBQNO%2BE0eOx5vPyEvCwzAHh9enyGgUzv9sz41RSwOZnwJaf88i8h3sm0sb8fHBGD7xPkGxKZrXnZrz24yzRsGiuIqLVStRLCTzuCrsdaRe4owhv1ww6tQTV0LRj9nPjyEzWcWoS4xefh9X6%2BQigCWFGN%2FUrNqwbLpHa1bi0mEMT7qeb8uKqcbIDiWww6dULjrxQqfcm9vpA1KlIFSADChVOs52UH2LTTKH%2F1fO%2F0VyBT58kobIlO1lvbJAo8BbVtcBLRFSscJedMwjAMrkE3SdkgNWIOhHHN%2FigcpjRIy8HlooJviC7o42E2voSWCuultBSTvTKHY1hBnW96TkzU9DyVr7XQsMZEp%2BpIwlvTRzgY6pgEFs3AvdxgK2twa5n5bpJedgRHbHUmQXQ8CLCGFbf%2BeSEi5HR2MhedrQloLuJzNjJQv9xUy5CLbjpFudAEH3fgf1HjV6b6piLGvJ%2B9T053jF9UzqX0c8e8BDfcSP4Lg0Eebhk3tUQP3KU56pdtAPIdHZP1O5XrZr2cNa9iccvmWZnKS7EPhjpKGRlaJnIPk%2Fnl8LkSccRZOZH%2Bi%2BCjpd0s9gM9jxR8W&X-Amz-Signature=c33d614982cbe8891728fb0406e3a3790acece88c6043be4c83d61fbba6744b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666GFYVTQA%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCZaeiVdWqWkph%2Fp54xbPEK%2BD8gV1yYrN1cDFslCQGokwIhANDkvqZl8FyHqI8bmtGiRVHoJQ9coU66oODZyGacDhyzKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxSQVPIYryHvQlv1awq3ANuGvXpgedio3KD5UhbiC2poYoSxSXcszAy%2BftbQUmmZbpKQyuV89TGxRh02Ott1ijJISuBXwAhDZSGAahnq81GQuwZW40eSiwfhIC7xNfpHa6iPA74kPygpntp5lvnVKfWM9CbgXJ6p4rSaSaPfws5qVtIKET2EHDY2SaGIEahwgd35JAOuXsQ6zrnOpOR9SPkgKad3fs15OUCW5nkyB4CT0m9JTMO%2Fo75xWuOtsLPG2tLNUHRJz%2BEacFi9cm%2BEoM4KhTgiGcA6d%2BcC5Bdof0uS7hIQYE4hAutZD2Kb5MD8VBbd7E80XLtiveW3%2FJnaOgr5g3CuUUwOG6U1ujgiWAy2S5d5khQUNL0%2FgCU5xGhd8xAYc2Pg7ZWLHxn2A3zU6AJCXrCdlHIOgNoI%2BiLZLyezWp1wx9k1EDDha02iDldFjpwPJpGfpVaUuVTSZc%2BwucCiOZWr61WgqC3jU2NFe%2BCs8wFu4EHeURFvtgkZnoW8%2FFMqu1EqNlo8GWqOKGVSutDhME9EG5irg2KqBAcyVAPn1flO3FDgfuJLG6f9byiMUTzKLxf7ixRuKXTooeWpYOborE%2FJ%2Fk0yhqRgvq6Ihi6wc%2BbM8viest6nuhpafjJOV3Fgp5U4B4X8oiWATDcxtHOBjqkAfANg72d8bGWw4sr1ionKXZPci1wdRy9%2FfdWmZOWCSvk%2B5mu65mxfTbLtYvP3mbvx8d%2F%2FxXdSHsUrPpad9bqkHkrDDNvN0DTGvCuXFIkQQAg7zPWnrf5usNvgoWfuErLpQu6c6tQa1uphF3B5hUpsgosAeE8bO9apmd7NmkMzMF%2FxsubexkS88viGuYdo1CsOMyVeSoueqJfNL4kTnlwBP5YZbyN&X-Amz-Signature=2e6e8c07ea765f28dae0193a7da98dbeb3019873c080293259fe76f888742cac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=2abdb3b999299b779650363b10cb47f2055a7f675fae315db5ba098f0a1e234f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=c6540b55f0aea6a9597885de4deb4900263d2b54feeb20a9225cec970595417e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662LOV4BPO%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIDz9VsDDU3EbATjtIwdgO6b3lN0goh1j1K0KilD7XQG2AiEAroDWX55xjY1%2BjTxTEnHoDYC%2BWqd62YJhNu5wyhYmWv8qiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIFMlyiBMs21acCkzircAzDSOdk2xg%2Bzn9GWWtuvRYrVZzgYsrghNs1d4eZ1%2F6pWtxFioqMWvRv0rV7DQgaQ%2BQYjKAybgTsXChOc8COcnD%2BiJHRxjYIyw6Zmbs4%2FPl%2BKqPI%2B6SWir9D6%2BEWYZd1T4Shikyp%2BHa0NPNiw6rLK87z1SBWlsQgFYJGtz0bGeRmNx4JKLbydCN55ns%2FcPA91czVGMsZfNafgwyEczw6pAmmzjsShp6HVKv%2BI9cKzPt6WuNrOax3myGyxKxBRna4nKIEPMwTKARrjntsVbiIZC6rLTeO3bBWamxRz%2F1TmFsywrfHNSBc4fgqx50T8kq%2FHyzwSv7i976lo%2FD2TrF%2FUHZ%2Bhfyy86K6eylWMCCrgD6pGKe27PyqppHqSHTHVQ7p4N3nWVLpJgt6GCfOvBRrVzWdoOsHifZ6VzdLdvnndsCUj9C3vFO23MbKbLgSp87nbDrehcGXVFFjsltR69i36b1cyWoxguATbm5iZwYkXSH08B0Bhm5Rviqv6n%2FRr2pU65%2FL7%2BRWLZGADzrtTVz9oezF5Iofw266qeu1CtU5Re3Q345Os%2BncgB84ZsqvkmDZI4yq6O7FNc%2FR0gpembDeYpc2sz2jJjYKea15bWiw%2FXElTlkTyDCUgblOytPM2MO%2Fz0c4GOqUBq5wKN2%2FJYCwGKjYSHq07c6c9ReoFl%2BV6LBshjLSH14yasAe8tFvi5aw%2B4DBxCB0Fa%2FNkJesUsFVxXtA0VYD1HTdHcCTYICWfaY8UoZIbjwA9TMwpcChJ1Tn97gBZ5NH%2BDv3aFxzV8ITBkWDLd4sCBWv0pKvK9%2FG3t1yGnQpsQD8qJlygGW7HeeULlV5DVovSNjwy1ErQjR5nv9m5KeRGARrj9FkE&X-Amz-Signature=0a4b7465995da19defe0fe82cf1be5a08e85f1710aa30e242ca85c26e6890ec7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=59994810847ff6f2ee4175c383ac9da7341d85770905407fedf34ab91ba93e4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MKB56RZ%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQDRbPhuWOPFt%2B1bVR%2B3x9g2g3F5kZpDoRZjEnVgRmMRhAIgbrbDhgVV89tXnJ0CTDixopUTR2tneAy4Kqvkh9CSufUqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbRZmUhY36SnvQH9SrcA84B4UBtz9OtB%2FYbNNh0Fohzw6l7HdrRTTZEVr4OiZWB7E3MTDKisuKNmrRqryov4gYy8n7H6fXQh71sbFg0JeFogPRJOFlWZGNQdKjx23T8DqR6SL5BCkPoM%2B4tsZgI5fgwGdNMhYnHpLcBT1qd2Nq6UnLsipzYMXfUSwl%2Bg4R1fEMrks4D%2FRmFTB2ZvWxi7ec8H3%2Bh3LwdA5OrONHDKDAxSxlrqo1bkqvEdQ1tRmHnyNcZS9uk6pPIE3zaKOK8EFqoUpPnt1oBtQ4wt5cmri%2Fq%2BdFOlNFoIbHEZADkVV3hz9JD%2FCWgNaikHjiJuXUhI5NCfF4VmiSiEBSe843nGKnGRx7sbn2KXU%2FC2Fs7ZjYk1KgUYgMWIEiYlukkLS1qfnh2tlGx1dMIBMHvFtX%2FXAUPNASq76tbd5GfG03LW6LWu9rIuYXr5ILoJwKBBTTJIJkzbheQrxDvus3%2BZUFQFxpw1XzDSbVJ%2Bc209wjber%2FVm%2B2pjVIXtar78h2Ib50UJ492b2lZ2skTY4X6b3kjmx0bO07cA3JHUZOuLqzrJu%2BGfepj2KjfGeOesF%2BfHsfOBuFRFmqds9dbNUZkgmv8WGAzXM0PRdylUm%2FAhsc6BydWAW0L%2Bjsti64EKukqMObH0c4GOqUBFrlAzMUrIRrKpebGe88%2BqPX8x%2BxX8%2FjLUAE1zZmgwUvwIeCYFOxLFo9WiLx9Ga%2BKiKlQLbMHmIFovqlXMF4TTGjB%2BL%2BXYtn%2BWCYPZzvLrVdzOcFK815Q2TL%2FUlc8mRd2GXGjSqi6%2BAXkbdlAIESaw8l47kbZSlF9ETUdtiG31ZHUJYgmFPWDHRgrsNtR0BvQNzyHtsDjmq9fq4p3DWIfBYmNxOL5&X-Amz-Signature=cde74d48b37f3c48f4f2799881af0cade9ccb5d009d777abe2fa157963275ba0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665EYS56BU%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIEiJM%2FKsunRsHGXpkRuxBwXi%2FQK%2BRIH%2Bf4hYPSqplFo8AiEA27Z3tCxr6eMM6%2F9Dc8OZQLPqwzDN7Q%2FQi6GCSoZA65oqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEwBqaAFpsICH9%2FDdircA13ffZkmUk0KeyBoLAzRkvHR4MKCKQYKrxru36ckXRiJIA28HNwxV9d6psFbxQZ%2Bkn7m7J05cDFg7GmTOu3aCkAMppdY%2FHHLbf8z6630rezMlGv82XCq0wfrStIS132wI%2F4dqjqHhMbH72JgaOpXHod9jgyBFB0tmjCXoC6CHY76Ndmp5v%2BN6l2lissmKY%2BsydRiEAxxK3vhTQndUBOJIZEO2QMI6iJTrBhL5Mf4ZP0VjYtRwDZIbHW48o7L1OwGBtRBi6Jc9o7jdCVkSLYoH%2BLlw0cCEL3yyUIiypLEQNWOhnq3H8qixS%2FxV4GiopmGS1BMp0ip9LkAds9bMvOZ5pPrR5uZI%2FhehC%2F1fisdiX52Ou8QZAxfh26xXasds9XkvBPl%2BRmyKIgoQn7oSPUv927FAx7pgljsvCpLid6wWwCIND5kdeTBkDzO1bONdpJC%2Bl3c%2FPzeVu6Sn%2Be6VUvZDTAZIv%2FgzPcQ%2BT4pprF0tHXkAdSTW3OMorP5DrUzDer4ZVrlXz8ZGpMtq%2B9x8rH6NRqA5Scz8OF%2BpgyB4ZSYIWtl2ETQD3G%2FofPNe5HZHtVrfnjW2wAIFQoF2dOA43CIKh097w426iRt0me75x0Wt%2BGULKfz%2BDazLimgqXzrMO%2Fz0c4GOqUB2dAmHnz9iyPVPpoiVoFUUAQJtAMgVYguHyoIL%2FA2FL6aEQjPV%2FvU7JYM2UbV1r1thomDh4XrCqefZQM%2F506MBZRaRWd49vuvDpfIYyX6AzLdAob9vK%2BxwB7nxUmEuNA7Ar60k44A%2FJV0Cymel5%2BW%2F2hMReUmuN7HYFZDGZQXediON2dZ434IhZm%2BZ3qQ8YJ2u9Hp6ZideHjMWAJPJckUbmK8IXbI&X-Amz-Signature=5ee40424ae66c6b8a6ef4a164e50beb3aa30cef10766119ab988181a17af2568&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ND4BMCS%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQDin0hmOz7mDyYU%2BvBAFUPPXBCiMxd5BJefNqP8AlJ9TAIgYK5PM3xZckMn8CrsM1gmfx8iu2XUiToVsZbA3zleOcQqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPH%2Fyfx6Svxx08NkuircAy0vgpDLvc93NQRaWozB01Gb2M8WEfRzdtXlzdLI4Iyl2lqPCGsf3lPrIxFSWb7RlPz8JxwfREC3b7JMumbeo22SmQVAJuAxknWje0VcjaH0LqYTvr5QMK3WmUr97fkSmCxh3niIKjGGa8DPDryc6cin1T7C163VsHwUrgNq4drzf%2FQ86cl%2BZwa%2Fj2s2KDMky8RgUxyzFQYxaAyvuQnslvnSJA8jzPZFDUwvubeeSuLWX0TCrW6TKzjpskoIW7wbQIAESojtAFhQnb6HVqS25U5RrOlEEmXGrQeF%2FJUDupY48yrLW9BNCzbJVIs%2F0%2FbwEqSb65i4eaZMZLKq7r4z6caXBEWGbs6%2BIBaHJTNQwxQSHSE4ZV2%2BdbnFR8HLmPb5DUIWapLxpEWc2hkHbsa9qtytk3tKegJ0rGencC4bQ0GQAH8kRV2tjsqIaiBZhkd8261b4YUxThRai8DYv%2B%2Bu7JKEYrbUrbUgVqWI4F%2BCyzD5hG3M7jIEpHnSVyWn3pz09BWo63lHakUcEw34tQLC1cMTm6hgTMKvnnTExp192Qno7r3EmtIik7ygdEWS4uxL2T8RXvG%2BVQZiZpUSywCMRqRH%2Fiu%2FflHqk464rmlJg83iZdMS1yRmnszrZJkWMNvG0c4GOqUBERVFVtGtpzVvjrj%2B4Ucj%2FHLmv7ampg%2Bfe%2FbiFQvrY5ksxA3dQpEaCKeWsFMEE7YgYJ9FKd1tVQwaV%2FmkBOf%2BvP5sGg43qNP7pR8KYhXiz3BVFkBlwOcUPUT9K1%2BtVgL9I3DP0FX%2FGp5DoJhNVnk2aEklZ9LDKwlW3ShnADm08nqdgXIf0bbJjtzcCabNXeZa7LinIfkZKUc9T5hxf76u7gelAAUC&X-Amz-Signature=dbdd89b0c0bc5589b81f36bc497082620ead4d8c1a0bd410251af3b4bd1a56b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R667NGMB%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIBvhxT1fWvjq9EK5E3r6WjLmaegE%2BVWovCWkiqV52rDNAiEAg%2BHPgj7LFvXLj2b5tyc2Hxui2NpxyQE%2FQyNvS6LR0hIqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBsNJ771wzXaWVUiyyrcA4gT%2Fp2viJd%2BiMt8Md%2F6RZEtdBbYhnn8jHoW7oF55clz30B30mOUEeWiUjVkJIxS1N5QwOPyfTQkyq0ZpLrHjyPsVqYzojEgK23mzVgA78jlGpWslJNZwKyGukDUmiudaXTaEgYTQgOg2Yrc3AwXQf3oERrs7VelZhANWH4hcEQln%2B77IPmKKm6psE8HOklIwrwaCRNVsxe0J%2BsVkbmu5ybdmHPqM%2BOXch3pmKxZLnXCDH2scWqTbT03%2B%2BFWwGqnkHo1V1Z1qQYyHaRdrALx%2BKSgju5M4MzhQrZJzpa9s1lco11hZ%2FzzGSZKdbajkKTuV1k5Goscn7Vaxoh6AZXBw1GQdaTfnd6A2rEwYm%2FWLIuHQ2e4qLNv5RnndSVXwfOMxuK8CY0%2FlvpJxrL%2Fywz16wbn6zf7AQ0nA%2Fh669z6j5nbIvvYuDHohmb29zzyC02sSZ%2BGyArp6aIB1EpNZkfZLlfSh2ssMNUBIZoVEkDkedaJkfpgVbnTO3jvj6SaRSf%2BiN9uY%2Fsg86C5wzejR6wMP2XsYOweWCXezgTfzZzebcaesFp2EExz2g1Sq8nfINBrOJMvKDQ7zeplmqTpIvUbN2mkhygoavWPqPZlzkaENFeP93wpujf1WybEmN7AMJH00c4GOqUBWaN2foDa9J09V53n6oYwA5l%2BcTL76FVQAM3y78zNihp5svGb0cLf1EoIFX4x3lw272z7fsEr7E6yrS7%2BgVi6zKpHDL9Nq9N6JkUUWuUj7wham3smW%2B2Yk7zaIU408DocO%2F2RpENbdbYPXLYhNVg7c2Lt5WR3lGRBUH%2B7hjgbeAi7ffTMc6RmHD0fJQHiAXne5joevPQl9ow2S9pSL%2BKbqkSnv3vh&X-Amz-Signature=eb85ca12f6f9a798d803681ee77f17f5419cd57efa0191b25ab4f32adb11ff60&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=81c32f5272b54f0d6835c517e54062abffa0ea3380247d2a0467db5ef3a123e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUXTV7OW%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCICgNkr9FGmu03fDNzIAQ5U9S6IDrVJRNMzA111OqPmCmAiEAv7LHj5Ne%2Ftavlw%2BjKyonTLqQAks5vEE4fxpZUXexxZ4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEzK2jJBkuFGG4ZZ0CrcA8qBQH6iIdWEN33UHx1MtHZZ5WHFb8flisy%2BRHX409BwM36qOET6bpxfKxGwUYedDkzYj%2FkMsZQgKFu6okKxzXqG9C84kT7jB6f%2Bu14kCuTtYB%2FaTpWotCe7smK0hqLGm8kpEpuU%2FNom8qtwrqje4XZNRLHJwN6p4PMCg6UquBgbPF1RRtVde8TxaR4mYYnCgTTWmvok%2FqnT9IJxPocscZmhck6r%2FMzpqMnNstB%2FK2gQLDxsExSNzUitQsaHkFFV01VI4UJmyjSvOVOD9ebIOUyrxd3yY0%2FIxpYa%2F%2B8HDZmzKcXNWn62m8eFL0w4RBtVNczCkJNXKv9jkxiYw48L0KWTvY%2BdG53IoZYi%2FLDf2ZH6u17WGSoDLigO3Qw%2BhrtQjQlRTqxpKSAuUKFn1xBvyutyTMkjlskGZdXDCmN1DIgRGP3Sfgu1vj6E7tzEIzmKEfKmJG5jSsj3I%2FXQK2DzA%2FAmwyIDi2hwblSHcWTuH49ZTmCYiRThO9k5ziFcG05bZ5I1tshu%2FPpmDfMQv5slW8d%2B%2Btq%2BGyJOtlHQMscn9FMNjEI9fUcencQXsZ1k%2BhDsqG0NxTX2t0m1C1HfsD2aVILl0FnLcf8MmG%2BaIh7c4TUge99NZqbdJCJoBVOhMPDI0c4GOqUBT%2Fo%2Fraof26ABGlov7cAHpT%2FZVd3ED8gZ5PnVh7qKchqUGvK8U%2F7kG1q7HDTEVQfp2Lk7kV4hWkNRIlku7fVKqxRRluhlnqA%2FoJ6mw104GpxVvG6Ppc%2FgZJuoO7LtDKCu5s7anB4bioFC2tXTPCK6XG6OBGU4rCYqrTPqJqSKBzEhfI041SBDByJaCoA9yqAWwGKcg0CNrfqfCv99eISIF0fFSAVY&X-Amz-Signature=0cd9b6d00c0b25ae220e3fa2b7f77a189c04bf0172882f1dbeb2ce976f6d8237&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

