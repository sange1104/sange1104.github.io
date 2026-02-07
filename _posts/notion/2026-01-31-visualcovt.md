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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=609d45d21a991913a936569cb52a60d123f568b3af5efa0212e49842725dd6a3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=87da330495f60bc3d6b68e24eaeca0379a19c201bdca953b0899e8f67795fea8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=4c318ae1b7c8a8f0bdf20d1690c42458fb69c4e1fbd235b1e7383ad521f276d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=2d17c5f1f2fadf6e403e2f311c04638205262f7930d8d393652662236a7371cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ABLZMIQ%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024935Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDMVg4IN%2FMkMZLjMIHmpoZVpQRXGufEIukk02ADX3bfQwIhAI3ZRxFbBHmPkK1WH8kAsT9aYP10qYaCRnJWNDWBJZzkKv8DCFQQABoMNjM3NDIzMTgzODA1Igxm%2FdP1YCziRFr2iqcq3AN7P1aCr5Zn0gf0SrTBSbDaDpwAo1aqPYxKrp%2FavtB3WzJhmD4A9LcG0LdrTBoioVAujPVDKABzHiBWm6d1Ahfqf0nEu7ZOBR0tTf5JDHFkz3rlzasiFCQhu5b8XPRoS5bSUNfIF7KyBrC8taHtMLyKNZfiLRfInHj1h7RNKpLB3ppLPfxsev0wXSb%2Bi9LPH5nVGi3XK10Ydtt9iYnkywbobhYMNi7DSu05yAwbHk66nyqr5OrP5Bvk5dJno%2FeDz7l4Y2Hb0gDTLIVDTXQnocJEgvUZnVsQltCk4CTKUc7B5%2B0dHdmbUN3IakM9HndZkPxQ%2F5JtXe%2BTHbVX58AUOsEjfL7SPQK436J8rQNLXDO8sUB25Ner%2FBVUH8pfta1QGjJ5kUt5o4I%2BLMUqXc89WtQbaiLdxKGoOgNbKmjKFeQnwu2lT04QoEm10p9sGhpUxt8FEH1UEJIMWfS3uIvgqGJnGVr7fHdVrjaQjiG73ta1EPFCdJIGC3EMm7yqBQ%2F8U43ra0Z6vQ2ino4qnFRqnWpUGYq5%2BNQi1uxuQqhAuqqGZKPmj4GOmd1rMBgBLBNBZoQtovDXN3rT5i167VflGSBo6GRY6Mf0zmzl2q0U5OUMgRfSFhX38RWr57QeCzDCxJrMBjqkAavqXVEzICxGrlscfYkqpux4%2Fz0Zmn6HufNPnyN7Y%2BquE%2BUCEnQ06nbJaTY9Q58id7GXewo3GAuDseW7yxma%2FKWt7178ROU9Ac%2BgI1tdkf0oeyJQKBWDgT774wH8upLSZdw77Suht8yFEgjV17ahHvVnDmU2rw4%2FoZJKSnJMOp882TYlIB0CqdwjSiFKQBfk%2BTY3OE4if7eO%2FTYraCm4XDtYUb91&X-Amz-Signature=735d07929a1f6fed434af1d2493ea0914ac40ac30b762311c6335175c8672acb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VXAKJRAY%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWYlm7%2ByQ8S7VczuCqg6z6Vj20IxOiKS7A0Wv5HuWmTAIhAPcKOuwdAZDp3xJt7iKyXPOKHpMIK2aNnwveQ8i3wYT3Kv8DCFQQABoMNjM3NDIzMTgzODA1IgwZ1bllBTR3DNoaWoEq3AMx0OXYfjXJf9aUlf%2B9PpxPn0iicZ%2BvhIRsfMejAyuaZDmoXUezY7Tx4gMWG3VjoGHmG9QLkSeG%2FpVX4rmDd%2BnzxvcsvTE%2BSg9Os8nwBMfnU6Ram%2FKQ7AGPM4k0D9JKaFoc3pc6hQbwZPc76wIEQ09YONhVNycVL3mrWMERuljEqF8pqCLtAB2wJ0mLIXMwo56GziJbgzYOXE8xfOnlFTRXiJZuu1JQObKtaed0bX%2F7fwjJxxuT763MHXK9s5LeKhe04qAiiTYrqlis7XDBkaTNCs0NlNPqTYRYPRUFBfzVGdiqXrHw5BYQ%2FXhMnvmQFIfwllO2ibv%2FBCmHKf3zmxe2M5hqrHXBwp821KricqOwEJpQRbllCvfsIdk52v51NZ1iKoKLL%2FFmO3QFy36cFK4grqGwjfEeTzGqoaiyjnB%2B7j4MM46v1tCbTw%2FScuHlnFISTQlMHlh%2FopJtrO84em%2FfTheMDsPiFGStb66s0g%2FwuUShiC63NWIyo7AcIWQIQhqvsO2EpnF4%2F%2FPRK9694l8LFV%2BwO94kAfJY3GLaa0r56Yxo4AE96aU0DuC3cc5fQb%2Fp871tSSEy28rHUx8OCqKfoC8RzB0H1WjGZlq39wMgEPaOaR8KyG036oEw2DCVxJrMBjqkAbCSsWzSiLtc4TLDRX%2F0oTTGCBhZpSCSqyJwOXe90JDsIypPm%2F8tpiqU8GkuFCVZgsM18XlrXslWDUIOzqNcFS0GTGNXs%2FalG9g7QlljkbQCz0iAHvAzv9RATn%2FOH5MB75Ulq3ilTG9y%2FzNtfS5rBAKGyJe20k6EKPNWtwVTbUxh%2FicFpAF967zp72lgG9w2bwPnmlLeAA3R6hzQwH5zYnc8z0rI&X-Amz-Signature=2c9615ef214ceca2a2a8dc9f41422a1160725dd739d3eeba815027868ee68569&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R3E7E3T5%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025002Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCv2asW7v1MxsJj9E4reC8iGGovCTkTorD8w%2B8Hf6tX%2BwIgDOA6Uku%2Fep7UaSWbV1QX%2Fj5Om6yv8WTinCjsfCifZWYq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDNP8PBhLxDKbVhrYxircA1pb0GjuUWfOLYS%2Fuc69i0wpvO6tjomUcAlNl94KMubSL%2Fd%2BYHkK1j51e%2FB3d8yqFomeOl6U2NHoaRrhVfc3FuDEXuPrJ1qw2622teUM0%2F%2B4cNwHRGE5pG4IVXdYTN7iXwE0GJhuhrzMR0pzbmKX8cEDNpNsntHXeCoKU2AUjX3mAJWBe4dNxVpSI0BtPvBmTc0WhWSgSmBvtKZA1xCeRcM96uxM3Hg%2B7THjd%2FPkg1O8kQ79Z3smkotlnOv6CjnlUElTrhr38Y4zPnaOAXJhJXtV9go%2FUMWqoH6MyBzgxjusbhLKJpsgEI3xOHyyqB0QHnj0q8TN94H2Mhfb1SgiTJUCm7oZny1%2F4Q83lDvKphJEtZOceeJ3SNDTnfPOBUHY54Hav3OieTmx7GNf1bCcSw5GHkswbaYYXAqE5%2FlWNbHdF0SldOTabsKb%2F3PD%2F%2BujXFhYaJ6deGYJaUocwO3upofxflxppFKg1H1%2FmAJCx5VK21F%2Fbkku02g2Wrb0sfAXLiyEDUjXupWOO%2F9dFqn14EXvhDCOF5t5%2BeWpllAM1cRXgE2fBnPp4%2ByCK3cqY3Ludc%2BhSYjs87be6qfB1HOddcySfCG5y3MI%2BTrP7zRlJaFROm6dGrlb%2F4WE6SF1MKjEmswGOqUBaFa5Hue5CHxjzAQPzmlBOrLxYYZLpRAoiGKze5Xe3ZJ%2BqpL64iJRCMZDh2X5XJJn57Si8dsDsf2iJkFU0sn6hxgf4Xy6Ed8mlPnqPd7v%2FZoeVhL7JixXbUAiE5I3xnwRbwU%2BjMg5ND5eqCCBrUEQ0GRQuWGVa03SHXPfWJgwQDbO9ohQTqAsXUOSnKXk%2BQUHZJQ3GHWJ7sF69SZmFGXxP8yst%2BhV&X-Amz-Signature=458defcca5d93e7fe4e658b9c7c3843c98fbb6fd44eb0638c7e04acc5b7aae08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BVHZQ4O%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025003Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCgOob8ZEsg6Ab%2BQ%2BzBrF%2BdDpmcG8%2FgupwqjeTzyuk%2F8QIhALAq4kiFt%2FLnNwexbJ87Xs6X9cJAmFwDeozs5qFt5JKOKv8DCFMQABoMNjM3NDIzMTgzODA1Igzqg92pzTHAo4C68qYq3APAbjoiQ3EcZ6ytt1ro1sdx9biHLStyr8oDRI9qWSQyYUiGda7T5O7zIqXztRtr%2FrNYq%2B%2FpC191mM33qBcvp2AzgzbVi3lbR6jy2pUkmLlyLnOE9cDa5b%2BNI10EoPBEQH%2BLQ1zpxbnHYPmcr6vJRvZGdKHHj1TJFZvyhGKT8G%2Bb%2FPBsTZXj0oXuDy7ArEiOo1vTzIYnTL%2Bqfz9qbPtEnd55pWfCp%2BIvvFBj4zm1oJqqJ1ajtcEg2Rpt%2FgDLZ5FS20n1p890E2YR5YQyn03%2FwVS6zvs6bBRu7JR89s7EVU%2BoUy2xWl64q7iSWzeY0xWzmQTLmR1uQz3eUMkPpB2AqYgBK2vS60kw50E%2BRsipT%2BfL9uFFaYthT%2FcuJ7oXOyDIloGwXMCvWGEXtRQXG7%2FhSYOtAk0EPEW%2FXN2DMsXU8gJ26jAbVcCnuTPtBm6V4EneHErtHg8Gz9eACyHazvk61dEmJMqvgalzJvUjGHpNHokS61c0d7kkx22h7X2lC%2FaD6reVVH6Lg4jbolae%2BPxbqzQHkWTmsXwduDoiVsnUobhStnTUhv%2Fgs0JCEY8kp3yQKUs9XvvKGySBrdMSEspfhQYQs309uSir8m42XBlryU9RWE9vX0dh%2B8xmlegdbTDkxJrMBjqkAV50wXBiI%2BzQqR3sZtalcDAUawH363Ly09jtgt9FlwVfMSgt4%2BDYnVH4Qp5ULTfUzOJqY0CHDws3FMSccgwIaOwHpsxTAh5S%2BGWudcd0MVV3Hp2EYSrD1xyD4qsGoSHu8XmKhd0KfKycK8ek0KOu%2B%2BYOXHD9Y0BqX3fg4JQU%2FlkaZl%2BvarQjiDJAKCwXI66X58vQ4JSzyNIlNYI%2Fp4iFLndXBdb0&X-Amz-Signature=afc733bd7d108030ab8bd6581af73d8af24cef338141870b5049a3b264aa6254&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=6dc22dea53a1567f3511a77f1975cf952cf026134841ced7314d80c2aabee06e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=554e3eb2e5dd0236719f082979e921063462d5bfcf78a783025fd0dffc336152&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBIPQHRO%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025018Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDkUToy06r1bAKEL0FfpIiKmG1oCI9vlOH19CFBgo4aLgIgb%2F%2F8P3dkjL4iv42fYUEfUOxWsLzVdM62IQscrCg6WhMq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDF227S%2Bwd9miISJ3gSrcAyYC6igUBbbnSc%2FdM4mxG1HMeIFUAPFcU36iWMsp92WEywnVzX0rBJ5nK84Bm6Zu3cnTNK3kKCgIR8lb7KLiRF2ItsVgR73VCEojnjKiNLtDeE8KY%2BM1c1GdPMWBsq4jxTGHS2SAAyne8Jf5n6ILZqByiFanripYS8kARv9RWsyU2UFMj3Vrh%2BUSXkcOJswvpT6973QEYSITm9Cey1GMyN9NcfhfNIfmfeLCoV5pL4OD1Rxfyu96DLbJF07fRv54XGbl4pve80gb8UFW5LGYM1%2B%2BMi238Ko4B5etd6YNkWzlrDisPNh6LuKxQZ1xsdeutxV25hmvaYYiBrs5xqkKiOd73pqHuE3uEltXVn7HBp8C%2FIrHz1dxMbFEvnbaARtW6wVm2Ij06rGrJL%2BUp8I%2B%2BmnTqMt%2B7EVepCvjKxKKHzvN%2BU5tCyF4UWtW2f6y3p0J4qDK16xvVjGT5uPnuQdCvjdCVxO0eYR9pvooT%2BrhXYC76Asch0gSejXdEbXDwPamQwg7MRjeRA5UbOUctowdt6tS8vJuwq65U6skFV%2FprI%2Fk%2FwFzJbb7kUXxj6zH6Z9%2Bm9194JGe7aCuVce0dsFK7pQh2anI9JhSkRbgnKuFJCT7YiCeFU60bwFhZWGlMInEmswGOqUBRgssI%2BRabYBAkdhpzDxsXLWWHrAZvFM4brIJ0SBxTYQoHR%2FS0q102Ko6HDF0j67HZNzaV7hzJ8v2ZhWHPhRzs3EBObbuL%2FXQcCMurpqOF3C1OBvSmGXkpFht3AZ5Te8kPi1j43sw6o40gd39pOOcwEcxyhD8yOcPL%2F72jtkuEDAV3ZmaPwlGotYC13R379byVwR9LYgRBjWoLY7OUZp5PLqW8Fhq&X-Amz-Signature=e0d837178287b3758d738f788a3e828c1d02061e86ff7c6c0335ef4320e59600&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=e918eddf91bc56a0cff2cbd7a55d3db0d4c0b1cc94c479b2c82452e4311531a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667K4DCL5E%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025019Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDhMWLpIlyjkGmzAByrTd8AA6IrSc9927XXmT1mgpKPPgIgQHviXCZvn2ny34CXJ3YARzw4yFAxrm5Y9G3Xamh16%2F0q%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDAhsTMsC5idCWAI2uSrcA5bPTd5thYRawhrVE4Dml6YPoWNxmgF%2BO5OdyB6rSUkBQxo7UtNLGy1vdBfkWjGJ%2FMBmz%2F5PKr2Olku5oChCbcemrvQs9e5GgrlmpN7Q%2BYwBxLXEZVOMJBY0EHNoRognXyIWA%2BTmr1GQGm%2Fls7xdNNI199HKsJVDIv7w7T%2FLSb2cUjVtKcovh%2FJOxI7xANpP39ZURGIJZ7gy7Hu3mTA%2BUtR9K2%2BhIGck%2B3Defg6iYFA0Utx%2B1cZW7mBEmdMJ7v06pfyzkGZCm4DIqaGJLgWsRSEqyTmw5Rr%2B2%2B7tHeaoB8JVTGoVuclfdlltC7MIdL8B0eKU%2BosN94dgjrD7T6ba0rqRUsLPSH2KYCP8BgZmNM%2F6n3pjlQCbjYwIoVfNgSQt%2FnpCvd4UEiBR%2BgiiAycxOOqJ3ZcD6rxSVaMEj6l1V%2F%2FZCVwhQN5oTRphxLX%2F016Y8k9x2LzMwhbhsNMy6E%2BVpXCJE%2BWVP57VmacRQ20bSdBbXfyTdXcCGwG3jIDkOrzvMzfuERuDdJHcUFtyFodsO%2Bhl%2Fd4C8zAamwF5BkC%2FBV7YgYWexGifgAC13p6pEUceFftF5zg0nuJKJDY6AOa1dqw92h10GAsVKQUGkriM3kWdiUGSaFQJIVix6IanMOzDmswGOqUBrpNFh%2BcnxaxJyGVn5mWjixaDZ%2FnrCnqpfC0ymcdYCIFmG%2BucYmk%2Bdv1ob%2FrxlwHTCmUgB%2BPN37Pgatrd1gLeedpIKtvmgudUq9bmFyl%2BwWL1zcLYoxspzdKLJ0DTEMeTI3HXZQMCuCk6Jp9%2FNaKi4LqlpSPl3DMqwEJVofZZ516ZruSp65DcXFwBqNA66d3WYIyv2RY2QStvw%2BJrpftfCEVe78%2BZ&X-Amz-Signature=b2fe2fe4a0df25441a00f95f674c0b4b7b4402025e56dfe6e372fe91285f0a32&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UFWD5345%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025019Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD0Q%2F2QsI7HsgHFBZBI27Cc5Vsj9JY2pJ2RLlNaIAO7%2BwIhAJS%2B1yJ%2FLdCJdkM%2BQiN5jTPsjBdawij0ZyAoq4K%2Bsb%2B%2FKv8DCFMQABoMNjM3NDIzMTgzODA1IgwcRt9wgJ3BJh9PHb8q3AMLmBHSeKoAG8PBJbMWvpXBkZG95tJsNFGfV2IJhP8xbgMtChMSdGH62156nt7qRSxZFlWDPXVycjpKD%2BaKzNrVvFVjmipHAgwkgyZJm5LTdj%2B7z4iIMz8uRsxiCOo30GUeVFtx9BX3PwpvJCo4bHcBlxIEMuqDJV6bbEjrVOes%2FdbKCSAFmAV%2Be0yV%2Fd9aQlnfyZqUsxAOY3RmEkzofjSlWe3PwUwVHohXfhIPAXUzCAftdznb90O6cH3ihqQDzkXCbnyAG8%2BasUxcBzBDop4CAkZINqA8Is5R5kdDC%2FE2ShPv7Fe7HkneyZmPVMfdF1Sd9UARmB9mEOtMCVUlklct4kagqlrEYh%2Bhfuy%2BB1utS%2FtS9bnuehSPM7PnWFWrwuIDfj37mtFqosJP1yVM7QSlzcESv3MIu9%2BittyvWwKhSM6s9Z3gzCX5%2FWJyMKzTgVARanfAmoshGLOryQCnvlcpIF%2Fbhe728OQFVG%2BacK8l5mP44tCBY2wjilkkVDIAUbZ45W92yk9Ji4fbtJkFDtrBtKKCPpDHxJTtbe%2FXH7hz9hH8RR9SWii5vmTDwTZAtnOtbKuVaxLLutd6OFo%2FbSTyhqazoZn%2FjLu%2Fl9F8yirrf%2B09ElBr2XrGnkqINDD6w5rMBjqkARy%2FgP3y1sHHWfnmfuvoY7jTLqFBjEZm6Uv%2F1JyB8PhL8SmWtROotqDP7Aw%2BpM%2B%2FL%2F%2FVFHvK0LQZDwIwS2XyOGsWNkxR22w%2BliZp0MFCnWowfsBS%2F37mCzZ2BZMeeheTIoI0MQ6xQKfAg%2BiB7pCUfWfpe9h9%2F5Md%2B4U6od7LhrdHXoPTXUpzRsHvTd8Psudt3GNswBPgy6PTUXdM9WTfAwZM%2BFJH&X-Amz-Signature=27a1950d4ecebf88dec71ca3bf970d2bf37ebf3161874b5193f36bc47b544635&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAEUUNC7%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025019Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQChiLMFPMzWqvuMz5UUOWqcWXrn8R9QpPBs2h%2F577hd%2FQIgDNZ3NjBLt%2F6f3BbQSY8p%2FO3uWJHI7fSvtXjv%2FdV0cKMq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDD9RegmGNMCVzb8KKircA77CLFQseHMIXmfPAUOOjz%2BZjYEy7JnVowSt1He4fg0cUYmZXY8FqV%2FObn5MvNKOdx8z607ydZdA5AyoEO17ZyVHfcC4AqXqE%2FC5pKOmIV5i1Nc3vgXzmmZISM%2FQS8RPfl7QQUl3rCvjq7%2BwflcVgu9sqkFXZlhCduxo%2B1%2FuNeSuIo6Q1jxrMklvcuKvhm5SantqJ95vUJJp1WExUYW7dBswDzT9Q%2FovzNvt7QivBz88JPs%2F4dh1yx6EW%2B1t355pCx%2FwmTsFdj7miatW6bqJri9bR0AR98KL0Ali2KNShlpxl5D7ouEkH0%2FPYzrS4JpdPGqRlhDrNl7enmK45TIv74RunjRNJwSgb4C4iIlcWQAmZnLp2q337HIbF1iioAlRWfwiwGkZ5pKPGw%2BQfy2NRiPGVPij37Etx5rDCc0tsB%2BJ3dGJ6ZU5HhQkCwJAI%2FUQBhoMoVgZp9woqX3XVtmbK9yM56sWzNn1mW7wloSa8VC5W1bCA1VQJ15x9%2BZcwoBWno0MOWqjK9xJb5Cn2Sbu%2FrP3sCAjqRTNmJqRQVieP9GJEflXybyD%2FX%2FDv4Hy27KY9I7c%2B92E7pAOYkTbPr03WLPmUmNRnNFKdmENH924X9Iahp45tjveSgkv1F9YMMDEmswGOqUBBjFeo%2BW5gm2V5oP7Q2NK2EqlkcK96nSwxwBizg4WpZT8cz%2FhmFobg%2Fpga5%2FcXTXubOAC4wIyAyn470iwMOxuuYeaSLbyXDjW5smi40IYb5xdtx2vyznHd9ov2wMSoV780mnCLA3Vd8qO2vRzPX8HLCl3xBkCsuW2UK3RoLZ6nuBS7KyS7L%2F0REY79fRQnm0I%2BPSzRdLmugHFd%2BB91iK6nzTlwl27&X-Amz-Signature=9a842d06dca13fa2e0253cff0296c3a9455e19f7ba6f28c3845be1c399623b84&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665H5GQT32%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T025023Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCgDyQUw95hlj2v5%2FTOWspMyabvGpmBvWXmglXNokjkhwIgSXVMz4fe1gROyyYKuhLVLnKBiXpTChcMBNRgUwKXLn8q%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDB%2B8Z9tQ9KFrGfp3UircA%2FkluO%2B4aY9Q8c0SXFL65mUbSwagGx5UPfMJwcC0RZ%2BoPt98qcJMQHBIN3dwIKOcdP4OaEENXJbbx%2BaCLT%2FjTRPUUxXz57CvwsvpGILGSv4rQSE3KbcbwZ0Y4PZVhPOsc4Pl2eSlYUC5ouYFowtX0yxE7DsjYQeeOYR6AYl0qs4CylRpCg3iMoj5Qy%2FJ7gUP1zg0RHF8jLnWS3em8jUWymOxyU89jd5HRtoZlm8szO4unxpzCLxYIP02sj7DLCyzL5R5KfhTLMpCL6WPCgMVOf3EcYAXJD1riFHqKPvgXCb1ocpDKSx%2FziDa6lva9HK1TdekBDDlWDxZl7d5yzDNdZRvfpaxt%2FuT6%2F8vLLlaZOmg924Rfhf7%2Bg41%2F%2F2Neu%2BRveaFr7jiAHv%2BtT5sZ3%2BOtqa2n04JBwo89Y30FZLmxNjDUSQ1PNNwi2%2Bcxu4%2BXmWYrK%2BeRE2r7nc9yKHwpvBqoBB0XUq7yT3RBTB7yjYdz49x5r6RilHVgLBWooUoMEZb2LQol34My4zxJino4DZ%2BSN6nZQov1wzkFfbR5XGljnB5ODZg9yW7AKInfIRcWQnXzw8OQDg6PjJrKKK48unZA5nMeaEHHeTvso4sUoKrvlvCfpwOMUZAHuaj8PR4MJbEmswGOqUB4yU43MlC%2FAHna7Jqy40y31gFL9LmFToWYpcBo7qD8ZHKuVgYhy%2Fjj2%2FWAWnMK%2FLg2Wns27LfDW3VSTpTIn0Nq0MXuhiDTCwMmA8odnG4g%2Bkaej0Pa0coXd%2FLc2BKdaxwfVAmniFNxZQui4FRkNUyKnKA5SckQRuly7iYnhxwemnMRhV%2F2meCE%2FFfpv%2BoRd19RPPisrcRw4IePkarA9VKHoYtufQm&X-Amz-Signature=6081aff2239c72112091766d72036da3eb9908e1b9d6acae4a9e3b98f623d14b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=28bedb6a5eedf6b953401e2600b8cc75b85cf1d66e78401026ab6a1c222f3e40&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YYJPPZR%2F20260207%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260207T024920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDx8bEW36bIft2BlwB4aw5RMVH4e1rykNEEL7HQ2nHCCQIgAX46pKaXx6jCyHleGJvh7qqAJHYr7fjEKIFVy2CIWbcq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDHvip4RLTY9a7wJPgircA%2BnNmnRz6aj5aVe566NjBIpxhE1Pz%2F1MQYvrKt6x01AgFJ2LFyZieMukkZdDppPWLlTgnsr36sIRohkV7G2WcCunLwyd4UTjm%2FZIyqpNl5KWhA92Xq1UJmnwYHQwNj%2Fy%2BoHyBJGxNKDg0CjsLrevQ6sVMWLggZ9jybBjt79YFZb6JljuREZyhRcObGNntE0x5i0BMXHOSJlqnobc4K9Dd6PRL%2BANdlshBbqDk7wt9duWG1SV%2FqT52qd3QJSSjZDOOuulkC%2B32anrR9UD67%2Blien9Z%2F9d6IALqIg%2BTkkmrWYZqX4wVkiBkbBUajS%2FmOWC8suXOXndd4GIApAMh3rBHsVK%2F2yKH%2F2MQJIftz%2B7bRAzAHaQXc5WzpbfzeuzL3N%2F9q1Kc%2FsMmLM7M3vN4C9WhenRTStap2i3ZRH4QPklw8bWvFhy6hwxtMo1EwTwsa3JFxlFY1awW9Ppwo1sAPy7VJCc4lrR%2FsRlIFljW0KtCVgBGhQtX1GiYCM%2B%2FEFNdezMz%2B%2FEgcrBBqm0cxl%2BhH341bKk848bD%2FxtkG6fJyA5fqYrnLbSbaiIzk5uHl67OyUMq8uCHw775H5UsFwGMska0ZkLnq%2BaaYTNaB%2FStoIB99tFmxmUGSyaZGa8o7KcMO3DmswGOqUBdku08JjAtReOcdxidK%2BemfKmzXnUxomh7grIFKBGd0FdBedMNFPdhaya%2FUEWIIL9s8A725PdJ67Y4VHxeL16Tqv6N5716m50LbLMOXxqorw9%2FPlBqc%2FJu5ADVrCLxHVWO7LXixkQtIsoyFvZ8OFQOdUV5ftG5bAUEX72n1LyBl18su3JO1BICEaUqraRAIpRbxSks%2F00hRYkKnZzHXQGHgHohAZO&X-Amz-Signature=ffef8505b232823e9005a7fd8ae7b7690351789c3d76a7088e8a6d68b9cf1485&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

