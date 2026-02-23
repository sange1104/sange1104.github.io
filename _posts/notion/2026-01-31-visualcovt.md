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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=c4f9a44aea04631ab29162a44445adf9711b234d50fd344000cb9934801ee1b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=bfb4db696a2661cb79b07f262dece50bf09e44374942465cc548cb57396c89c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=7b3a70c59c9c8590450999727f4989321ef618df4f8ae698a5b1fe676491adc8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=2d0c7e8397895e100fe2e6475088d381f07e129e7de2fd2ada0ceb8f808c5606&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QNBVPZPD%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032014Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIEqdrApvV9oLht2uxQiZexeFl%2BcErhU58%2Babp8duHcZBAiBZ5SdPPKiYg49iW52dWIIT%2BLneFgJ3%2Bp5lPnWeFLEzNCqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMUtUzhnKC0qbiXxIJKtwDXghFVWMGyXCHVXYwu%2FfOQXfG674HNczl9QEiigRnJFSv%2B%2BK%2BoynQCEvGovgObsmNauozagQ%2Bm2%2BOgb21j7%2FKJ4sX%2BVpjXj6OIsZ6ahT0hETo9n0kWe0vkthI36hhCbTlxK0nu75HhG4f7fLcExbYq1Xw0SmLAgPhQgeb9a9m8%2BWok7Bq%2FAoTAA8iD6nIV7CAfUEL1zCjrhVJN2pUXrpmEuA2KxiL35WJtCEU%2BtTiYN7dMekkg8jmprk3wUFaJDriASQPni%2BBBqo6Dr4GZTELQXsy6Cy4EQzIGIjHcMU6PyMhTGWPIbstOs0UFZx0ao9%2FxnQBRPIYSBVYiGvokj6ExdzX09WOme6iCjqTEziegHmk%2FArJ5wOCg3RjxylOYVtt71uf77k3IHAuB9ifybNmpz6jvk%2BRiYfgRYXrN74u23HnhqPLLG60CghZqTsiT99MELn93wwqXG%2B5iFKNkJTuG9tpzvSxFq1DhzTXljL7ykjF3DpOjbMSK2Lkx82Rmhdj2gW6pSqNrjJPwtP8J9l7PEntt9gqAmp0aObzD1HhxVxKnSIuZ0JuMLl22J%2F3btB6tGGLQkLiajAHT7yASIjZXUdS%2F%2B%2BKKPHNVnMcpy0OWKCzBnW5%2FQqnyaQiHmIwm%2BzuzAY6pgFuq%2BJCRpEom7zORAsd9vtuKXd2btxBOPqsSEateJFpQL%2BlifL3IgHN0uw50jtNaOP%2FandTaB4MhA5ntFZbumvwJXYN4GHNb0QsAHe2K%2F9uebMChrlfYgFgX58KZuyuGgxe2Cqx958dlxeMN5iQJHtu2PWpMuQjUh8rzGcnKRvGO8%2BctWufPUhRTMDQU8LNQumnpO%2Bj0CFHoX2vKKDgrCRfBsjHSrpt&X-Amz-Signature=790a50e10f72fb807eb69f3fea398215d335b986f69b9a7940a228e65d3293db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QB2RU5AU%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032025Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJIMEYCIQCCGTMrrlZUy%2FUWsTQ4ujAxMz29G0lAcGhiYDadg7LH6wIhAOKPsznEPhP2V7jniGuJH46TFz7LsoiRtn4WcR6Mnuk8KogECNP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxRUX1q8ZIZlOgJ1Coq3APn45EWLt9OOobkccdcSN51e4z54JdTmAoOIir%2B%2BrnIFqKCEzDYApUALjwBwfCCqa03fchzD5%2Bo%2B7wMfug9N5GCZ9SNnBzc2grhnkh%2F1oPXm8NPdWauGyaduzCmnWWiR27t7mSARb0Z%2BMCVeLtB3GDnWWZ1EEqll2HW06YYOcuhYvkUCo6SNrprAWjv%2B1tUUVCUStrGjNJEcCEH4smiIqgxxQrNOI1BVsJnqqcGwCQ5ZxlXJ%2FHeVoa7eInLjfjtFMHTh%2BbJhnQIx%2Bm%2BkNKqjTRqq4jXUXJ%2FXTaEaGN0jjKp1kX4zSq0coYrcDQLowdNg2PneMD4SbLnEo9ASW4uqW8UvG5en8afp2LsVjGWs6g9O%2F5JXQmsu49JfGD506h%2B55Vx4Nxpd43vhmDXyBXNA5Dxh2zEcDaDDyDsmORvjV9QADyH8LQxOHtwN5RZsvu0S98RUP1DCYB2C6dL%2BT6jHvOAT9kMAclcqPDu3jEsbWM009xCLv8DzkYUpttkaDI8uQJP4Fhw426z48cG%2FarN1B%2BCD06HR1XARO7T4BETLmt5a9j3NFTTPD%2FXk6IfPRIL8hQ8T8VjgppR8cZItueEbWeIT7q75GgCepPe2XOTq5cvlI1afrP7qAxbBE4OdjDW7O7MBjqkAYqWTOdoXqtvJJ9WaIlFQpHNmwnmD12eAynKZnoOJq2R%2Fo1h0iZz%2Bj1tipHcZiO9p81FSkaV3vOQImVUOQlGGC0xWoIyTswIMs8B%2Fr%2FI9GsO39MoP8zlWiQoCr3zvo1edXFFjFeCEBnbKv2vj5yksNZsM2%2B50D0NZJqWxHp0Kh62OJLFY5mnwPNsO1ABWPliHMyQMadyAVpx4mPt36ucw3hvYB55&X-Amz-Signature=c9e15a49bc5a1e5c49051ba664e4595570d6b6492566feeb49e75ed943078d5b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667J7KM4BO%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJHMEUCIAOdSSzuNznD%2FqxC%2B3zhoUmqKZN6Q4%2Fxpt4wSGWkMmqeAiEAkaWo%2F%2B5CH6N%2BjOt5OI8ut6gdp6j2QjSmdVsqnz6jOGQqiAQI0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP974P%2FAwwO4RlrVlSrcA1Es874d42%2BtOSExtlamlBPVvX9Bglcnh7bHS7sccrnl1J4m%2BG2A5bQwLPumA%2BeQ0BOCXaLIaBhTpjHLL5dU6avFdq1DlCZFsl3RlOR4uDboyAwyCylkI%2FWnX78IkXWNar02xZgUS38yQdYKbTMmbvWLWBsdKQrGysUYVUYfLmpfamAt2rVvAat2ZslBzKl3o19trL116lalVBZsE07gzKgI478bHehU6gbNqO5OOhEFpifapz4xAowZ8Vrz0qfWTaKGMLKUXSyNi1xCgk5ybVLgE9z0IYJR46Z2vn%2FC0A2XxqGSXI7ylsHKEtpKRMRm%2B1EpMsbMUNyOns1nrt2P9iShWi2WpWhqIqqbf%2BOVqtOuAf9h5HdSvjxp7v2tZA7StYQJsvQivsWVUyEnRZTCRyWeFskhRLuZmxy9dOlVdW%2BmT7DsofL8UZJUkdQGbypjCuHrlExyljGjNiNByo7G1KXxPQP%2BtFWHr5ip8oJvFpmDdkKjfiQM7AU%2FP0QJquMTJ0Kkeq90C7UACQaI5BBazI1BGwhioNH8EKPwDlJ37wwshWyhQ8NZfT7MoHJ6tLgmlijweu8dmARTC5N4CqrrGhg9kV88Q74qtOFJnGrsNTwXf7siYElOgtxmalpvMPjs7swGOqUBRF%2Brdni2PUT%2FEdbf%2FzcnxnGiIpCY658npYgVHDVlAh8OODcAxynLqaU%2B9%2BV%2F%2BnQfB5ivpbOZsm8SHrW6VmNg5aP3plNjtEhg7V5fmXmgDEOURu97T0l6igj%2FSNTrM9L7v%2BdyVv0jInuuiQV6npCyCRdJEW36mkJIPmc3ZyMmipGVeyLUy3XrtAFxCdq6Q3E82ZrZtF1N30%2FQk9jgq0ZjOFhyPMlh&X-Amz-Signature=604e98b83befd5feeb053fe3adebbc195ec2b4a8882950862901272240877362&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QB2RU5AU%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032029Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJIMEYCIQCCGTMrrlZUy%2FUWsTQ4ujAxMz29G0lAcGhiYDadg7LH6wIhAOKPsznEPhP2V7jniGuJH46TFz7LsoiRtn4WcR6Mnuk8KogECNP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxRUX1q8ZIZlOgJ1Coq3APn45EWLt9OOobkccdcSN51e4z54JdTmAoOIir%2B%2BrnIFqKCEzDYApUALjwBwfCCqa03fchzD5%2Bo%2B7wMfug9N5GCZ9SNnBzc2grhnkh%2F1oPXm8NPdWauGyaduzCmnWWiR27t7mSARb0Z%2BMCVeLtB3GDnWWZ1EEqll2HW06YYOcuhYvkUCo6SNrprAWjv%2B1tUUVCUStrGjNJEcCEH4smiIqgxxQrNOI1BVsJnqqcGwCQ5ZxlXJ%2FHeVoa7eInLjfjtFMHTh%2BbJhnQIx%2Bm%2BkNKqjTRqq4jXUXJ%2FXTaEaGN0jjKp1kX4zSq0coYrcDQLowdNg2PneMD4SbLnEo9ASW4uqW8UvG5en8afp2LsVjGWs6g9O%2F5JXQmsu49JfGD506h%2B55Vx4Nxpd43vhmDXyBXNA5Dxh2zEcDaDDyDsmORvjV9QADyH8LQxOHtwN5RZsvu0S98RUP1DCYB2C6dL%2BT6jHvOAT9kMAclcqPDu3jEsbWM009xCLv8DzkYUpttkaDI8uQJP4Fhw426z48cG%2FarN1B%2BCD06HR1XARO7T4BETLmt5a9j3NFTTPD%2FXk6IfPRIL8hQ8T8VjgppR8cZItueEbWeIT7q75GgCepPe2XOTq5cvlI1afrP7qAxbBE4OdjDW7O7MBjqkAYqWTOdoXqtvJJ9WaIlFQpHNmwnmD12eAynKZnoOJq2R%2Fo1h0iZz%2Bj1tipHcZiO9p81FSkaV3vOQImVUOQlGGC0xWoIyTswIMs8B%2Fr%2FI9GsO39MoP8zlWiQoCr3zvo1edXFFjFeCEBnbKv2vj5yksNZsM2%2B50D0NZJqWxHp0Kh62OJLFY5mnwPNsO1ABWPliHMyQMadyAVpx4mPt36ucw3hvYB55&X-Amz-Signature=f28a0a59426183d67e5d9e1844fa56fac28f499e5879fcabd78e0cb18fe71021&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=b653eaecc4f5dac410e08d00a5b91acfe238cbca8384b9bbe7c3c3d8e59c99a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=0dfdb80a4ecb5367ce9bcb38e130d4de53558a4a5b1c8968eec88c208585ac7b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQLRRMYG%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032038Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJHMEUCIAxGJ6Smbcm0%2B9jtOp18WjWj%2BWXFESceBT7RjnVNBV%2BrAiEAorKAcMqdGL0wrF2vLXbgMyFjqwPBpm9G63V551N5ZFYqiAQI0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEk%2FneuQ3K0cmGtpayrcA3KNfUow%2BPcC4kGQJzgl0Sp16x03hAjlnVoKYXX2esdi9A1orTMSNLqxvG6hJ8BClLgLbmlEUFaMHTPNcZPByc0hJEBd8COYCDbk46uk%2F5MbVWbnOLosJJcqnMhg1xYSQzBo7Z4GG0jLz8WgawE%2BKBMMAZZ87up5bWtagMDWHtF12J1gZpwnYaiGjJc9G3iPM2tfpaUiezIcMzX2dRqJqjhKoQ%2FUyv0WBg%2FnWPZ4lPqPdaLl%2FsbGj6TEvP9CL7NIbDoBBzBKUL%2Fs0zCfw%2BHSHSufj2xVquymPbO7v%2B2UX%2F2%2Fzn6qizg%2Br%2B2wp5yQ9w0HlL4jQ0v2jqSG%2FFp7n3156aPab3K3oZa6LNezQ3u6J%2Fnh4UOZkue9G0M1ONNkTO71gDK45eC0x2MxaQrFGDOPf4RRz3cWNUtVeat7n1c%2B41fuavDT2QcH%2FAWQmrfLsJJTiWB3ld0qp1JrVYeY6RROPR729y1Lx%2FXNUeuY19R3bppn1E4ijJHikRKZhByQr2iWd7iZTDGfG%2BtLEzRPY%2BfdBGsP9YhKWBquw1b91MVkw0PswbvGo3cU97cpth8%2Bayd7OF9gLyakh4Fs%2BPcIDk1zABxtq4I8WG8g2kUpNSsmZh2WMGqDRDTu%2Fi%2BOxLRGMOfs7swGOqUBBqNRvYJWbMQT2ncGKRdGNH91gvLbtL6mF36CjtmZ5sJC0cbuYCrstmA0tweDqbenEtniCX4u5kVBQjBGln4CFFcABx%2FkXb4hNT9nDptVfA95tjgxWj5XcQaerrcqzWnWRBDtwvLmzlLplRvux4hrcggqWmlZFGJkLpoPPiqYafenSdB%2FuGBKbcj2cYwoRJegiRwet%2FLY3lr3VU5TC%2FW6sxPQJvep&X-Amz-Signature=18ff8de713990d81a8419cf69097b2b5169aaa65ac2b34e8c0185f9a9084d328&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=5e2ef64f936b2f098749db7235b6394a91d577732bc0a642e21156ed863e5c92&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSQPSU4A%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032038Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJHMEUCIFK66DYOBjv%2Bp%2FXz4VtKqBRXzWrMUlJki98CiUx76EcKAiEA%2FSrJOWEd%2BQGCC6jQSE4zanwEUZBBhnTw5MQ%2FJTSg3BYqiAQI0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPfMD7oZfTOBNrGM4ircA5gyO8tj9hlglrprlIFqFTTFv05p3pyuEZEFwaaZ6kJXFZKz6m5zWI%2BcGDySQ%2BY7BQY2WtcfMAJ69BgO6%2BTP3RN2cnpP7fH5Xw3SZsyqhp5frXPdHHRkQsHr2TcLuUOKwLa5S9pnNdIwGF8eoC71XDivfHME%2B%2BEcbGQJMBIkgKjQaFXY4L2XNg7x4cVjvxoaclGTbjj8PRpIuj%2F%2FP8E1SiVbm61MIaUCf5elWeR3kC1joxxr%2FSGEnsa4Czd6VBPgrXk3LgAInAsYJof8eXtgige%2BWTmBZHnCmQgAxzXIgAZHl%2BYIenjrTwwBAdqdrlYwHsxJ2JOzuqJgYF9lBcX9jipo5CrODzujPeqs6GcLMhCKJ6uHtSsFvB5QdXqqid61rY7tnLZOd3ANpmIxp5CuXLkjpf4Fl8infySAtUyPDlQq1oA4z9%2BCpDIAQfyEqaUQXr6WZ2cOA8frnILVn%2F%2F8TqYYRyhtEH1mecYZhqdkrwZsLbkG3egVHzgfbGxiPog8AJ00dBsEUy1%2FmyJp5OwWNHubUwyy9D897YAbXwtNcM7PtzfJE0qg4S5gCKws7idxacivuGtLiP9yCOb%2Fb%2BDiKorWqs4mGHSJxvZYmRX8dIulK9%2FNn0KOc8NKiiOiMOnr7swGOqUBYMHCYDzjrxtDvJTAsBmObTEBcV1RrF11JEgn%2B%2BBa36cFDlyrxtAGTJ3dTnp26FO0RMuzCIA4gR6n3dtaD5xhRPMAPCItvmvyABNUCrNuq31nIaYTQlho5R%2BszpmkQJOyKwQ343HY9RNIj1tP%2BziutvnRiDEnUKcGDzOuG8fRIs2eP50y%2F9scPFPnjZ3bDEsHat%2F%2FDJtRG3pmH2jTu4S8QOfPg7q8&X-Amz-Signature=e37cff0df06c05bd434fdd7072eabf88c1dcba73b58bfc29e0889c5155325bdb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZJNKGY6%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032040Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJIMEYCIQC1FkWSPn5OErCjdlb2zmuX6ISvULjYXCV9sJt%2FPzvDDgIhAK6%2BOnZIpco5qTYzRTZH3hjCoYjm7kCY4xMQqVWCwRONKogECNP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxzfB6eMl8g1AYOajsq3APLtfj91PHnO2ElhqXVeZbRnMDXyOLctdb84%2FNncDRb5M1uKpGWwKC12JK4%2FMidNfbuqiQZck2IRlcwxE%2FDd3YXYUAjd0RV5yklnxfAwDI%2FbfqAVBcjx5QJ5jp657%2BJJ%2BwWHDrhEyRXXz6kz4%2BqGh3lkPotNz2ZFb3M0o2J2RZfRv%2Br0gwRn2FjZejvIdW5EjulNaNutiZzeCP%2FWGmsBseEuiSNiaKYe%2BKRP0oob5Npqy6gGWESSBlD3Ckge%2FBkqOFwvxNw5LY8nt4fJtojj96ayTRIdTcZErwwtwMxTLeUkt%2FrrV4hWM8Rr%2BC%2FqdwAd3JK9DavYhwc0M7aLWfRfcQnXy7PukBa8uGskQsz8hk2nuIpze0CuvMxM7WwwBgOTP4%2B2YU0Ju284Uf3GMKnAwlJcTaSUZCv3j%2BA%2F1s1v0kNFRZOpB4M0H%2FEWmImx9Yn7JchGzMG5Lt9K%2Bl%2BqKFJ23s8MbzgQ6IhM60N4E7RbhYrukohrTzz0%2Btc3HrxWPaHCzOp7nEGdLkUyxqf994B%2B%2BItiffkJqNHt5EaGEu2Zkg%2B4%2BRTPpdU2OBcFTG62kZkRdyZ37iogD%2BnSzsJDDZ4Cvwsi8aWqTwD3jKvxRnFU56OjPaOWKqNpfSQhXl9MTDJ7O7MBjqkAcDvHnRZPlio3E%2Bw7Tev2XsTdH6CFzAKetKPMLuQPZiLCsokLAO4ter1mnItNAOoL2%2B36RkzCdx0xh9q9q0OrPlMLIlhFGkXW%2FeQ%2Bzwmwx0nNfXRNDndsLza01TMmncJXDKO8wJ2cf9iMAJOYTQ0t90OL5mEC0n%2BJoRH0lZPVIZc3DjwCiIY2kwAUlulR8yNceAhpDd1UxOZ84zk19CtVdemrr06&X-Amz-Signature=9e5a7065975772cc6dce58f7c2a9c915b3478a99e8b4cd931a4027c419ac6733&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTYVV5RP%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032040Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIFsGlVxK6Y%2Fbxto1%2FHI%2BSK3QzZGxeDNSLlDWeR5WBAP2AiBRsFCwht42mIGGC9FaKQCc%2F8BHU1awFVoHD2MbsUpIoiqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMV5OW1SMmMHGO60qhKtwD1%2FIXaRfgOQc4U5ZCNdcXpP%2BgmDrAnGSobh5hhIiHBuSHEY5dKEPDMCtxDiqwDVLBShmw2LAylBBE3JLcaHC%2BO%2FSlK5wpyWeK3GdpZ10lkOTS4R7GNOXebaLArGOrtv3GOwsGoDubT6%2F6cRI3gz%2FdIgpaIM8jbMIT5WWl%2BEOh7CaKbFYH%2F070dst43gvinN704lDayaVqKyb5%2B2RVHB8ZE5fAJZZ3dl5C4k1D0uDZN22%2BzgKqGDAJ9DcPU5%2B7t0lYuA4FXOrU1hdtcrlBItzIVWQnygRDSsEjDsuDGYop4MBZKJwvqI5qJburUxjeTjUUGCr7xO79of4Cqtagf%2FkUos56Rl8TshIAYGuZo%2FblB3nVBzRvXOOOI%2FYS4312TI6CRTgarN%2BlyeUca%2BWhykbELQW7fInHpjsTkde1%2FeFVrzvTYxXGN5y2DeCxa911VgJ%2FpjmxjhCrEi398XLEpA%2F3%2Fz%2BUTGgDlUO0LRnHqvS1%2BfLhyFCQj5CD5kcx8LLSqvp3lsNjhN0tPjlshOyOdJmnTIaj0O5p1%2BVp7nNw5x9NTHj3fGbGODIeaXht1qOUYYN9m7UK89sUAKinfnJLIKGSOY9ewO0tgRQw2Y81ZWNI9ZHIIoZgO3PCtQv3eA0wzuzuzAY6pgEyvvsqtqILGHeeOk6J%2BktL4cPqgy0Lk2bRo%2F48t9DXuNVsNL68cIXhC18vyjk9Mg74j8zlJs%2FQSHOA4uP4X998BfgQXHaRthocEjzAzQRAYYp%2FFw5GiCYAvx7m7i1bpRP8kzUaG%2BZj0FyXP%2FFzfxJxrY%2BwO7eMxBTgjIpltZf5cpY297ZWj1eJAI3GvY1ViZIobHpNbIbTWf9qMW3gYE8ysjz5Ghi1&X-Amz-Signature=4cc0be282c1ff5200924db8ed2b287e268f51a026065741b4e07153f0d135821&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666L6BIUKV%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T032041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJHMEUCIEp0C0Kve33PGNL8ZYTuVtvx8UCOQAW%2FoEC1oUE6XbTWAiEApqDhrctJzWCH14878mR26hqm6%2Fcbct6cVJRz8vFj2yQqiAQI0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCRadG7pPMAu1osTTSrcA8G3atT8Lwi32z3GQQa6Rh228w4z91UXHg8oFpU5SrEcrr4uVltaiS7RSo4OKDpDu51SwA5Lzfth7YqF%2BLi4qvkD1J8ApEQmCsO7jt4d1N2auKaOBjnF9SRXSQSSegOgVqjDA0rXNeDC13s4jKtP8xPyvp3pimCeYcHamSFAxw4MBJMno63Ile%2BX1DCPSsYh1hKbiHgueoTvYoKZG4wIjiXeBgGBohS5v0uJ8gj85Yet%2FzqgJwiqWGwDPeJWJS6YzQSgr%2F%2F1iZmQtaPwSWuNrbEW78O5XMzVsd8zGPBKZ43vzaKJ5pZ85grLd%2BLN1myW%2B%2B6lyW3MsKTxGf%2BEP54d%2F12o9vMvNMjSu02DhcaXL%2FTOEcQNrAfqZGvm9g7L%2B4RK1rDJIfCb7CArMFVXpd4sHcKpuPiP%2Fct9e1XSlL8To%2BBQaNjkNn%2FqM43muMsFxXMyTVyVfjCrXItcH%2FxcFxyMp3nu%2BqP4jtxXomNStH0rdbYe7Z2bb50vVdkf7qC4%2Bol3CH5UP15BNseuiRz0AddDnlaS%2Fc1Z5uZBvgoni3lxMT8pC7R0umoZ%2FR8mZt1UuBaoihz%2FEFDXgUvrStfzO%2FVOHOdOKgaVg8217hvg0QAJRD9UaRsYx93MZVrWufnGMNPr7swGOqUBnuXpXjJzytoIEmNBFGvenrCgSU2epjYv4l8aoRZdQ2EhudL6ZrvcBJ%2BQ%2FMncB0jc2Eo4MwnLTlwq99M%2Flo4l7E3bBNulkBiWgfmvBWU%2F6I%2Fb2LnIfOjIwQXOSRVOA9tNe3hIO%2BcRSHyuUZdiUq3QwoOlI2MWOOO3KUcEmgmr35byyFhqHbLuu2qsoDE9SzLj9P1%2FLnN6v5Ctw%2Fak20qNbnSuKxve&X-Amz-Signature=127f53b4775e02ff2df099f1418888dcf4066bd28345ce21c2f9a0368d1a1d7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=4fbaa0c157cceb06002d14d83e8029e925a99fee3407b7aca0b8a71ba3b7eaa1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XNYKSP7U%2F20260223%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260223T031958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAoaCXVzLXdlc3QtMiJGMEQCIAvPmgfqFYcPXPM3x39Aybn3CQEIUysEqVjbWf4LWv99AiB%2BpkFZTVpECgWMKh%2BzTIgW39nkED6T1qtuKUwyVPLBgyqIBAjT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFRM%2Br9vW53fNN3JlKtwDXTjOS57EshASdnxU%2Bxe0awaXwAE5La5hWkT2pRC%2BC3nUq%2F5U6yalYcvc78jkHoZB0rkEOUv5k28C7U9qzkCPL2wZiYYgWSB0cu4EY%2BBGjXrjx5Bze%2FzzBr3L81qzXoJno5jNBZOy4w00gT43O5qef1DKMwWIkgOMwlCZnpzX3BBj9GUqOJtSQ1SXVMPVvFZCGnHzNEbDaiFeWbTfOMJMbveRpF6WMZnyrdI7cxthlBrcbTJgtfc4u99covUTuB0WycdWDpcaKsohlOulhcxIQ%2BuvMJ2zei2%2BsboBSAVjq%2BQTgWwGbX0k47u192fhULGkU3C%2BSlL%2FHCwZl0lB1SCf%2BWM%2BfX2YqHz%2BLz3LmdcXW5P%2Brm2XAyxe1Yi%2FkQFuZXwMGurfOwMN2HCwh0mVW1ryy57wB9JF0FLbUOxaIPrW%2Bwf93wK91zRCHYEeo6OujqWgGeM7A8RTus9YG7IAhA06nW2EoSfIImIEz9R0nPycFQ%2B3DhfP0TgsnIOH9AqCyShMisRlww3SA%2FjCj1qnepu89fiSDWdj%2B1GzlwTa97Iv5Rbz6oZmg0bC4yfaCl%2Fj19aGBdqofCZ%2BhqKqcc218WWTVOShcumhRyKHnVZJDWgr6XaxOTyocbUDJUXvJ9EwzevuzAY6pgEjsCc6yR9PNltwRNLkxOon5mRu%2BQuTLwlUL5SPUpMtPzqo6gNj5K7ycj51r93EnhxiIyVHvz40xAC%2FT8FSF8VH9IpxFpFpxfhoFQesVTA95xpzMW7ldRXhWobYcsMo1nq7EE8GK3WYHVFCdowb4w7hV%2F1j15cj9oD5mYKGc1NWiDOw0LIfYFfArq3pvdmg%2FZsSBCm9BE%2BnUa9LarFFNs1ZNTukB6rp&X-Amz-Signature=4a2ddf71c36155a0b56f3c4af40dfa69c17e235b84402fe4ada5d5f200db50e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

