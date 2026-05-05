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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=329bbd6ec80128663a264228bfd84f7329e413f295d1be7a5e1da71126e22b1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=c301861580244a932fdd0761bbe529e30bf93a03e559104f8691842d18f9534a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=74f2a89a521f9f41082294d5a867bfae85a6c11b63bd7265a07ff0ebcd6a2586&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=3e0a6a37525186ecf6afc653b6c254fc72f3b0c813a56d4f9647012eef2ecc28&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46624WUM3GB%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDMQ7pJe7DiJsP1RruVpq7bB%2BaD0TI3Yk68tM6A1ps4hwIhAPiWFWkkl5V%2BYC%2FiG%2BDa9gyD4ucarjY7hbH%2F4FC7TOmEKv8DCH0QABoMNjM3NDIzMTgzODA1Igz6tRWiEbvARmcqCJoq3AM%2FB8lP1HtF3%2B0UmpYm3u5KGwLhWgLKUNoJJZdyuRTixqlb6v1c5eS8USui2OGezh7fylozI3RHo%2BP9Op2DV1%2BWbAqNIjsdn7xBPRStWl7x4b9uhVPKuY1JVIKMEXnkWOGxrUQ3YyCjVzJc9ZOxpXtAjKykQ7VQ4Xz0%2B%2BtdhdOtbi83LWfr9%2FNQmWeOkdKbNkwW7KYi4oAm6EMs3N3ky959SSBhLFDjd29w4lBQN6%2FxqlNmbtVK%2BkbwJ7q1kF0SKoUmTCIbx3AafRm0L4mjKu771MY61NMmUdulN4PtiwE%2BQKht3s2LaXA8emxJBCjNQXn3kcx7oKfz8ABxca9uoTrUpqaY2YOyXDG8hCNPhBqZDD9bYk06LDSch3y1YSB8qvY3UX19OnqVLQvKzLjt2%2FpgVTPHosbshqG6NJk%2BzuE9V9vGupb5xB0yKK8qS3iac45w5uz1FJ%2BP2VnMWbANYwELPo0cDVIbVJlirtxkOzoDoYsyLMpO0UvJP9gDX8a7QEMxA2s0O9Yk85mkBWwdbYjWE%2BstecNoYs1T7FANqYwohTZ3H4w9xzJYZDH18fk%2FU%2FsUwgbc1WGe%2BKZFk%2FXsYva4GxQ4qMDcDVbLbh32K6gQzv2X9dJ9PUrJQdLz1DD3z%2BXPBjqkAedw1s6hF6Pkbv07gUvTYud3SNfayRD9G5uV5B%2B2err1QKtS%2BGhX6%2Bp35JVgJVCeRG8qjrHQn7aYvz6ckCXD2bhpRZ%2FQWal2pk6E%2FSaP7DwIQhtimcn%2Fxsis95vz5nvV2pOrHLFm8odiZcwEClMAv370P4GgMguKI73xfJpvoHZSj4To6111IuphfhzA8iTEUdu2P8xrZIw56mmb0j%2BljPwuIoLy&X-Amz-Signature=3acd12f464ce624624b2933312f0681ef3ae53b8c0365ec9a08ee5104d7835ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YUGOFK66%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDIPICWoeSXoobpU%2BEcL%2By9%2BSyTpK0JVfOmm3yu7fW1hQIgA3Ryg6KNVZ5tKQwJu120xOHButZwSnPSv%2B%2By9G%2BovMIq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDO4tjV9XLvYyuDO6KircA8Me6UJAj5wtD5SaIR0UjJQ3KAMHqWauE%2FnI%2FJCMAX6Suu01vTHviD%2Bhky4JfoCrI%2BXzuLu%2FqNJBcIEry8IcVIwp1GCo9WOIf3SPqI%2Fvc7kM1tm%2B6M9HEZUf6pM%2FFFOSDH8p%2Fa5B8LmZH2tI2QkdoHHy38GE6wK91h0D1TXEgb3SLv51PbTUIQn%2Fn95fbGiPBl8dhkvETRfkcvlJ6prp1jGBP5zNcZlwSPt8ZRdP69ZkvKmpuC6YIZMK4z1GMx7hsTMOeUyOq4WIqZ4ojw9a6EcutfvnHMyrBMAB10F8XqQCjviT5Mu17C8QEBb%2FimarKeli6S%2BEBHvBSLtV9Pca%2B8MQq%2FPFSUOg2ayynGR%2BxKfWv%2B2ABs%2B4ElvInbRHDszMDBQljN0atRL1YPPhIP8tnwtKQZussr6bhmNxlXk2h%2BTonT2PQq8Bp0kA98NnqjOlK4dYgNDTsNLDwOoQo5%2BBhHxKPIEaOjyhhFs%2FpREi3XSRkUMrkBdFqo3K3QvwhjL9KNen4oJ9YH5QVB9tcqe%2Fr3qn34dFj8wRgzUaW16%2FzWp03F5xEiuNY%2B7DiRNXnDprzW67FCA6oqpJkiVWLvu59XTRAmGOfiIUZBL%2FwOFYumi%2FczKqyHsQU7kBIaSMMLSm5c8GOqUB7zY8dIMQ7jPS6KF7UTKlLmBywc2NeHNJYdMewRL%2FxA5OOMDpObJtGFqdyT8Kw0UZ%2BLZ4JyYRuXbpdMX%2B88AcTL6oQTHTFf1u3ofy9v7z1nV6O%2FunANCOPq7ghzpqXEJ%2FIvyU0E2prbQoFvBSn7V1dm1Tqa8f9WzwEE0iIjC99uQ%2BIXLFm9gs2MQfJmlLRdQbKuvQb8AiorcER0qUPS%2FvNkhHKmAs&X-Amz-Signature=2298933e918dca46ddf0206dc46bd722f9bb5ee4a755e505905c94015eda3c9a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46644D6FO4W%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD1a60t7svZja4VxEgoGzmOE4PByPJk1O9zhgW6wkKL0QIgLp0xhk6K%2BDkHiQhr8QJVdaKvhZTKC5b7KekjjEdLJQQq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDITFK2MiZpSRljUUaircA%2BkCUVYSlO9EbQW7si%2B34J4FRSPbU5B6Is8bX7ofecm4MeUJS0nzbrUEDXQMBtvVNqC65ELhM4Bcgml2lzwayPPiwWR1vpijJMsnbPJIOWY0S84Y%2F4VkwpAo%2F0wHgScppZBFCOWGSKTySbiCF9WdjMlHmM3ehCC9RktMNSMURNVYSBTHLJ%2Bx6INEHKKJtr3ev18vsMV4ly7eVZm0G57F9IO%2B21ENoiWymhcn%2B5Z12aO9UtycEgMYPowAGEIpj2gf%2B3h%2B2P%2F6BaiN3STQRO1JucV962oNdYDkJT7aeLZwOIBAIe1pq2aCpYFPlXNQMbJX11DCWCBT0bHBWG70VLwTMd1IrwtqVg3E9Y%2FR0toH8%2BiltZw8Jwf11Pnb0VCsMExuTrFXLcSOBHApIwcI6JYDD5xP248BcCfSt7I4lspr9slQWOKWPyckPejDICHo3NSt1wzveAkva7%2FBu5Gv%2FSUqr6mK5WGDz%2BU1WrZhJbRJUtotS3qry%2FVJYnTEjxhoiU5NSvTyZG1ZxDGbLb6GUUEIvooC2orYtsBuTcqSB1%2BdRyhrSNiW4B1gdwPkqTMGNkBA%2BAyDIVsbOeOF12SkF4DazG3O1wGBFf1hCfmLfbQ7g3qEKTVkU6l91l4FAuz6ML%2Bo5c8GOqUB5hoXr4RWFEBP0YHRmCWyuaceTYmE90LTb2bG9Gf%2F%2BC9MFuqSMLbwLNDnp7y890CJzekNMavObzhZbVB4K1fNy5nfpQ1t9ypowp0EDkVrKtdSk%2B6faxMftpsWKUCAUpIz9zW9qrOo64PcTl8cwp9%2BbhKZkZnat3JmYaZGO6O9NZIQ8VvD%2BhMVNI8tvyNKLht3aWW4skZ6wOgweEPXo%2ByzMQ%2FO4bg9&X-Amz-Signature=69c0dd027fe9ef95cc171ac409598478a7cb48b12ebe0b53befd9c9739c81ffb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FIO4JIM%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC1aE7LlRjlt%2FiTAuAEK0hzoeVHkJz6PPv6YY8YCY%2FivwIgJR5wpMDp9qhs2C49jTW0fkfDAPI1EIvC1H9oAzZQpkkq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDIPjruivevni%2BqRejircA%2Fj9HuYJMrT8J%2BE56739j0UFD6XDmSBoM0pA94p9YD3jXQFkCYg%2B%2BWTta3aIDR4TrHvlJUJG5ehYtR9TvX2DNIjVjjHZcKRt2CBcN5ITN7siRzFiIqFL5yOWy15SjyoHBzUxnA3Fzop9SxiweovhN33WjUzC6%2FYIbb6WxPfFV7icJQnK1GSt%2Bdr1PuFW03ZU4HhyAAR1jaqbiSrkuBmKg%2BEULIt12oz0ks1fl4eFkAvhcpFp7dD8XdHxCbTdsqgSBJkpnJE4XP9TzcBfevHo7xm7CiVpCj4Mcy1J1Y9xiTKFw9XxRbSEOPCgwHBqy%2FcfFLdajMaupg0J4VbqB07KLsowHjbzjItSm7Ja%2BlYwyr1o4RQKvZONgB%2Bbzt%2FXIIiYGvHunG%2F9zdgmy2%2F3pAfY6zWnEJlK%2Faa1mPjIF9KjajUTBx37dJbpLdchhpQonPrbRbbP6F%2FaL2oD%2FQGemM9ZqxUaQ1C4JarU199ysAAWv3%2BNOX5VT5R12HiXbn8QfFlqkFGlgSG86vpwxBSztsMOeRJN2ll7FGGsnmheT26JMUGiZgqJGYrzR4cHYDvH4i0kZqf0xd8dmV8lm%2BFY0hM%2BqEXZLCGg04KMG3Od3xR09MZ5I4UzU5MWl2q1yWCAMPem5c8GOqUBzpAfIvr%2FnKqDv3RKV7VPqojzPWxDXLPJJsKm0h1nUhwkUw0HHHkR7pa%2FGXBL0S7t6ySb62bDUN7ZJYlQjrsvkjwqsIpWjngAPvO%2FfD8SwQmBSJwiALCCMYAVaBhrdzoD4MzSTtS3Brgia9CBEkJMvQE1vY4EUREm%2B07d6Er0NKwQTyiN1aoIBtaJH7i1s5vh%2BwsrJyUFIpSvCYUyCztO%2F0OLnsUu&X-Amz-Signature=3f47a83d22a73032f13697273368e723486c9582571ec3d52be7b90aab5906e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=30a1ff40f53a0f529658c602ee1e597e1e38442ba128054dc6045136c4bc16f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=c4086463a740675b503ae18e5807ce2116f2906349a8b87f9f5c6105efa6900d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TIWIYWW6%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFcJji2%2FNAJNTgGwCV3PByEPcTfmJ6MqOKrBqOqH2Q2pAiAEkBpKcYLVprhYvpbFRQMVm2i58%2BUJ%2F16OscPAGh4IGyr%2FAwh9EAAaDDYzNzQyMzE4MzgwNSIMieDAcd97eTzw56TiKtwDiFjZQ%2FdQ2ouvhKBESjTn91c6frFlqgMrT3ctUF2YRnHxc1LJx4mQDHQyPuMGRnzqnCqHOJ3dESBYEWArlHwmORUvxdnF0%2FJhUZ06z0RqeK1ZpkSoWkl7JUmYQ7azfPYl8%2FrmYUAnnTYzhYwW8TxsbvR36JBgfVcjxImwKsX6%2F4Zd%2FZJjPSjZ1uZF1omEIO8znjcebq0P5b46rpNYLQ1T7P1%2Bwpd24o4k1EjZAX8IavQ351fsmHKWvYrYBpQFkOEkzWXIf%2BN1cHs2GcjFgzh6%2F76N7%2BfGSmFNNOiZL%2FpHkjNxE2KzG%2BbOaCiVdKGkUjLJJ1iXQQssHMc2SXed4gQ4V6hpmtMPP6ui9oOHmR%2FAKKv%2Bgq3TGubgr4SqTNrKwPK9pJ3dxYImwc9wd6BgGaRV2TMMHl8IlulIV5zKzwiUiXLIAEKarPeFzJ8Ed5qbLDGliEDZBVskvdwd36cFri03CmjYquRXm0aZJtgf%2Bx7zyIS0tanDLOtjE18PzHuuaiKsf6JmKfDl0LkbTeOwlGiaY0OX1vUxKRgj998BY%2BOlEbZ%2FrIhYYOvVpmBT0W6ZGYBdDF3gpiUukgUd33OxpjBIEBnKjXaGsniktWsP6CK2LFw9%2FlKcS1RC5d8dK6kwh8vlzwY6pgFxTLEs62WbeEY%2FTWmlN%2Fv0l9p49oG89GzNkICg9Cuhh4nQQHDoEbJTC8bANMYfy9%2FD1Gee4L8bOnKWKRdSe7tqaZKVm2rpbUnk%2Brh%2BSYicZnm1n%2FJwby3828QnH0gRx2VWhPk1eEcRPfoZ0v1b6hr8Y8TNlm0t6NQQiRhx6CyuEtV%2FJT88XOUkpl9n5NAnthm8EQJRVuTXgg5o4I%2B0mT4I%2FEkYQl6D&X-Amz-Signature=8150f27ece8975b16eccd1bf81afb57a3c2395070ee601e4fe124d3cd724734f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=3aa665bf6486f143e288fa9061b9b7fa6cf68ca8130386f425871124d3c77c02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SYCXOJU5%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDVovNJa%2FwEzqnLPMie9R8JdjCqBish7eGb2YtlFX0JeAiEA0RB3tTtx7rDWECbwEYth%2B9i%2F8v0jIHg9nVjgJ2h5nusq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDA3p1J8gDYMKmtkBoyrcA973VlRzFSjVmzGFbUkeDoTn29uRtxibDx72ZTk3nQrmBIJtzn1BqvuUuZ50M4aygqYE7oJq7AQVBRuggcjXCTbY3kkTiDBQNpRnLqZQ7ekgqoikyi1e%2F8rpr%2B3bqFro92P3CH5Uz%2F7zcnmBDJ4mIv6mmvg01NeU6xi32PSsPjhokstiwMNob%2FHyVbgWXZMn4eFh%2FdjCfYbc38jFf%2Fz1tiGdIgvgX6pEZYJDemx7VpwudF7lp8YOfj9h2Ap7Q1bOm98JPbAK2wO5%2BJ6QM29jxwKK5GV%2F2%2FfEVxlrX3IrjWpqyvLMbq9E5VFfK%2B1xcNI0Tj%2BjM%2Bvi55nX%2BZ4ZNLscmebcr9ZeX5h58TVUgO82mp%2FKxurPcrC%2F%2BVHArtUwHlLesv7BijEWK7Dme1BPiRMDoG2GL%2FML%2FxIXuq8cXygApSrMvOiwH0Z6YAble6eCsmFnIu3pcRdTpLtYs76J1PmDDly6EJfpAthHObnxP5zEGkYlZ3TvwtdU3DvOtC90GZ9h9ZXVB9M1UUMb%2F8kdqjE4m6FRA97rTru8Ev7yHlWXIbYuLJU9X3bXZiAEyn8MC6TDa1KYdq81GncUmKKaxw%2BSGfaSMhY3O7P4bnGYbFU7IAc85tsuzRpyP%2BmkvsuWMJOu5c8GOqUBiMv%2FBS3yM10PwGfALq9%2B3a5vR6M4hCLYq0Nchex8OKK9g941ebxvnnK%2BpvRDhtf2RUnQKWup25bSmA9e6fblf7aIC7b0%2F5ADGP8Xj4%2FdljNjJw2c7V8MkWsbZInuVNZPYQws%2Bwrr05CESZ6SBcHjElwXE74m22MQMM3lZGZ4YlQzvMXpRa2qHO52iIR7SkMHkOdaAoNKFFj28gupLKXY6dkKyKg%2B&X-Amz-Signature=bff95f8733d6811d3c9969c9b84653e150a6e20bf03436e3a7a4b532ed3ceb12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UX7MCYZG%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC1Fyo87MOf9i4lyEhK7sVM4WPjGYpQB5F1aXqpdSFxxQIhAJWRkDeJvdbRwmaCoOc7gYp3WMJ7sOZpyOlMyvUPW9OpKv8DCHsQABoMNjM3NDIzMTgzODA1Igw%2FaZUPm4cloVTY5iUq3APYINcxygdPbF47Z9IvC%2F0xdvlmuUh%2BWKXrt0HRTdS%2BQPadxWxhvgTJ4MyUs3Bn8SkMH3qyGTkxUdfuc4Cp8T3A7fCOTIDAqMaf68wok4m3c85HpOodgT2CsqnEj9L0nDBnDWmAZftUJUD96KfwmFhVgbdr%2B61XImzTmFDcgbEyr2uAhw9VOo4O%2FKmGlwKE2Q%2BARls270LLellME%2FDlHzDpvYY%2FP1d21sprc%2BbNwZomM8F6HKH72LsGMF%2F8r%2FXDRgCEnNY7n4Y7hgTxMQ%2BEuYLi9syyH5twQU%2BonqZAxZ5U6EONbtFexrG1W6G2KRNGtFpGMxpucU7oBAfMiLTWzKeIjeaW6DhwjX0c1fi8TiXkpW2GuUyXontAjLBs9VZROsUCWc0JYzPH8lYjS53vzTzeoG6IOJpjdKjdMVvn38hzqLFF60IgA4Bxki7NBWAakQYG2Daz0jSWk2xyZtNehrM7WBBHFs5amQ2vm%2BofOAdIGbTgDbqs3FmVPra4v7e0i28fX4smJRATdLLOZfJTJFHee5L7aHxQw6m3nz6Y8u8GxzbNCUhKyBYNvObP0sTTavaB7LVN6dbIu4xjjQXXbq6SX%2BwYcM67xeWRFoVCxrjGsIKF1Eu5AhRVAM3kdTC2p%2BXPBjqkAWO0bgepHMV5LUiG4PBlWZxameEC4Cuk3nGWz5AgAaQ%2Bs5LhNsFo4nkDaD2ngzlH4BHWvXsKc7p8%2FYeIJldCdFYnHv6pTnDPCEJzhNvRqgPltQ0IK6SXImI4E7Y5u%2BmT%2F5oFuo%2FvnDB7loeR8CWekwl7UZ%2BmBVgV%2BMm0IlNkm9Ro%2FGu487C4bImzXWFbV9Ob%2FYSNN4UDYlNH9zfBoaiKAgeFGy7L&X-Amz-Signature=fd4ab92f711e50b448b59198e41e796722689c22073bb98f6788e72de311dfb6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNR5MGQY%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHBlBwtbIN2KYdiLfUqnLgs4DDs%2F3LPDNfr1OxDDmkHfAiAf6uXz9vkN0OT2R3Xq0zpZmze0Y9vbWExzofob%2BGFqnCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMk6vvn6Lwj73L7HTaKtwDMD2LnlJQ9iWaZrFBHQev1tW73Rrtel%2FSdzlTBZ%2BLYujuqqVpe4Yb9SuzmtCUcDms%2BtFL2Jpwt6sH9QK4MyNxK78GvoXgUKOsCncj8i5k5JXXHfjLJw34FRLNbIpgjAV%2B82dBZ%2F1PGkajzPeG4j%2BPeL%2Fk3ZQtoFPKORdzi1IsVCfw4INGSSj%2FWerEU7X%2FybWzWegkq26UPmX0sYz2aMMf8oOwO%2FOrv%2B46hYQJRnmKBkBCvIsoD0pivWfjhkrVH782sn166Nqs0jeL9DRgVPI%2F4R%2B7D5snPqcXbZNfilv8ZbOb9ss9ByYiMEUfNLd7O3OHVqsCLXjeawRMkhJPTljK1FIwiwKFmY5nqvnDDzfDKJ33hFgz89n0kGWif3SzpTofHAMclbWaR1wYCC9sr3x%2FvcmB2TSXyssng8Ue%2FxmEEHqvKSxYlF9gk9JwULazJh%2F9K9BO2xedSK7DTC9a7UDFIS8Qk%2Ba1%2B1Pxjwu0hyRQj2qu%2BLKW%2Fd2SyiHf0jikrKT36zcvXHpN9jt7KWzB53ba7EnfK7YH4UMGA2ZIz90gMA54e6pCzjzNrOyxd%2BKcbJdQ6%2FgBhKD0ihGPQfXV1WCB18csIg8TZq%2BKj%2BhQ194ok7EYJfyXHXFiCN9633kw6qflzwY6pgErD94r17hCsFcBH%2BUTb6r4Y5SE3NuP1FLaMGdqrNUVaTD4wSOuA6u%2FWzzZGejCzneoBOIu6WgEMOiYH096p9w672veCB449177GXYV5a4tsbpzPqgITy54RKrGkD8mUtCawOoRbmkaWmrOkNAmbDJrpycHnsE%2BDfw%2B8sshR0s6b8vNEhHa9ZnaBzqSaNkauQZysse9rx7NjsKFVXDg8gESe0G8FuFu&X-Amz-Signature=272c32d972ec464cf329cae7784749b63d2f64eba4d70902ea3bcd8aedfd245c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2P332ZO%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFfXNWGYsDtvlbJPFdHXlh11PPA5Joaz3GQVgPuK068HAiEA2stE97BHJvVjg7e4FyEysXWbopowHVP4l7BLNpMQTFcq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDGnaiuN%2Br1mZ8H8q%2BCrcA4anis16%2BByP0yxeVWx2UNdFTr2USfpHEEl%2Fk0ExTzkjjxXz3JwnUka0grXLD0B346%2FkQmZFWPXAWTmYsfMEw7TDuKXROnT298X4tsUw1F0oOB1yM4zvHZxkjwh01zLiPx8GV9aphjbOyZk5x7MlvCmsPwCRzL6Nyod2Lbm6XYGf67c7bwI7MKWzN7BEz1s3IgVaQTytQHIcs9JDe%2FBTEqPVZP9zhai1apxBfB8wuJLpXfXs0tosxescWScdhSKI9uxBsfQn%2BCvST%2FqJ9Eu70i9es9zlxKFRF84X%2BlYofA74isCtTybOl0GrYzfmwDm73rubDG6vOa4Wk1xUcTkBwuC3W845xh%2F682XK6eIHCEX3PrfycyMz8Agisdsx3DzDILXkPezv4nqSWlO68nx5HvTXut%2FlaTPOusbcAzjI8Hds0gaaQnYhkt7T1jFRU8bMP6UbT1hrWZEMLQtkDrx3dGyagJ5UQYG4tXcjZEroVHq%2BhhVW5yzH5FgBCVLzbLktnTa%2Fcs8zfzfqa1jOpo%2B9kE8I8fiwfd0RdDM1pFidhqyk%2FK62qKdb5lR5gvg%2FfWFthv%2BRpstubjStBXLpJnFVa19HD2InCC1gx4iwwcP1thRehSVnX%2FBkV7ffsLetMNSm5c8GOqUByCA6WTyxZU%2Fb681j60iSwTK2aD4qdur98kKNqyse%2F5oUnONJ%2Ffp8bpw82ZI8bxrZfSmagLlBI5FFh16QZbBSA2XflNj84wWeUGTwKMmStC8lvXNdLk3fWvSE%2BKIBHbheTEv0oLnwrJhHCbDL%2FTP7nszeL0JY2h%2FTCoQJrhgetuHuDNaxRegQThoJ9g2y4BHnefNbz02KxX7su2ZiKu0ThjPhTCHQ&X-Amz-Signature=0bb89f09725a276f592ca6edcbef10b25f009623a3bfa83156714f864aaed45a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=fdb388b285d352834fb94469d65a32b67ba93f1c12765d291977bd4d6277a169&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U2LMTGA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T035132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAFOwx27eOfdvHW%2FwD%2BMKmb3AkmVLYEEgllTGJOjQSL9AiAH8Gckb%2FWfO2pcrC2wrd4Hvltrv%2BSgXDwCZXN8q3cjhCr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIMu7nCQPsz7oECBanhKtwDhFWmJ5svJWUqENRagBK8Lq3kEqPQMSpOPZipyo53KSRO8XcVS5qn3vByvXQLum3rV7PNXACEhw%2F8tMDxccbRqE8RtPFx9e7DlUznZkLVjthPPrPxXpqHSoYu3tPS%2BELF%2BxbeiW6MKYHFM5sznlSbLm63Y98umkKHrFa48ME%2FHBOJqzXb5X%2FwIZiJBPlkBu2UqgM%2BaR7BdTgkC87zYar22%2BOgnheO8IxAG07DRqxSI6z1iJFrIoxb6EJGp7gEw2ikkeID5UnYArIlHwaT5hXZ4OleDGlJPw4Nbsq3dyK8hbF02i3U8kMOVzm9QXUXM3pNohIYFhz9ptcdwxnBfjeQk6kGOSK1GxwSchFOyXvR3Zbli6qrn%2FN%2FD%2F8a6sRtn9ksZzpClHvNHWwkkQ5N5HeAX3wlNafD3GWoyzuIR2TlAvVMGqd0oq6CDMV3HhN1eYdiLbbCvGzWrOVfKqWNcWhWadQKl1p%2F2oAT6%2FLpvyAGJl%2Fc4zb%2B2xnpFZUxR4G1%2FQVQy2Ay9lYDXlhhUgw%2BrfBE%2FNKrTG8fluGWZ86tmy85W2udi7cbvzf8UfC2eb8AGSEinHyNrz%2BGU7AbT5C%2F7MVKfKZeckyeNdy0lqPAbD1o9EQLYtu4LTCGCrvB3kcwoablzwY6pgGvC38JH8LUDBYIfOTLVvWDUlTlzSQZ8e4rnzesSN%2BUSi1dPsOoFuZUhbO5EpnXMGf9knzLKq7OrhxOL9NYpVs32onNyVnch9t97lo3RdMhSMuetYllkqTwzrK5EdDXAGTca3F2C8f5iGLwgpQwqUKQvPwGivaLVZMshWpcRosSZ9Dtwf5dSctVzYNty1TfiEqPndQYhYYpxs15fYQiwhVt358o1Hdh&X-Amz-Signature=c39f2287080547a3abcfedb9157917a85c902fc1ace030be2b601403f13f63f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

