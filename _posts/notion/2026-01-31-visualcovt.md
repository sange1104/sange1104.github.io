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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043646Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=801308617709380e8d125621eb1f1a93fe21a98bd8a28210e8519d1983b02d55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043646Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=10e3e9be76291d0b56eaaa1213f4ef0b556fefad724857225b5b25db8d143d07&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043646Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=2d703f5ffcb9f3b0a466343824eb888a458a1eb87489084fc8e89c6813ac7438&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043646Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=631c020790fe39f09e76021617fc1fdf4eec044baddeb54bbdaf0eb975079950&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q4JW3AP6%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043654Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIDA%2FJ1SOabx7m9cGCI9ZoX%2FqxzEL5sauYDFPUT1M0VIZAiEA7D01%2BPc0B8hf%2FtNJQRofDTifLxOM4AdNKnxaJyeQxlUq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDFKz%2FHgpyzTPCK6sISrcA8fNLYCuTj2HwQNhvSWFz1KFTlyIAWW6hiaBcQvA4RsJ3trlmRTnjP17ETA8KyhYHAlUgc3T3GVjYDt%2B3D8d80E0Fq2ZqLxWOiVABNZU6TMgx%2FcEB5%2FxqT0nxsTazodHCxhw82MxBFOy8C%2BZfWyU2DkThQk8mIasbGKt%2BzqvUUb74q6K5kGP1%2F9yr0v6jiT9N2q55jsihJmjY%2B7G2iv%2Bq0WMwf%2Flr%2BulgndSyBSuH80M%2BDEGpCTwe8DwVzbj7T2YZ7muR9UWAOclEZBpC45aK3JyXRDaetUVmjdZF5b%2FUohJJWQh%2Fnj5BCDSTVIoCZBffmg5ZRpu4VPqx1OdOjDPvdNcf78HB59%2FfoMNIRkydZGIl4Exyjl1WTkAjeDh8KjWOQpb7eIe3Cd3zYK8fREfABC870hO5BVrsQw%2BEGRDvhmvXYHyPZh%2Bjc0AXl22MzVL7ZLBrJA8u0wkK1cz8A0Z7gvh5z5RVdct2w%2FYfOkeP5iR6j7GCZ%2FUe%2BJMmhaOrmPGdiYG2UfeOiAfjrlDKStXzOVGZMRAjyaWkGIEeM%2FHiaAU%2BI2Xl0d8TNngTBOcdV7TS%2BYxfMhCy2KR15vlMR9LXbBq0M1%2FFNZ%2BC73MSgR9JqJrOAlT88dSFXIPe2ekMNywv9AGOqUBKK1MFLLr%2F3JtqS7ycXdt5FNuZowOs8cAsVhJ2QgfyvWeV8RfVBxmxNkt1k7GDkrq%2FPImUE6a33AL%2FZGzvAzdKxsO2xlzCGgyRJj95TRs6d6jv%2B6DUzaJr8Cg2a9zGjObQUPYOOcy1aNIyIuPkjEBWCkpunqNUO3pbE4u6xToQrUzaqoOXT5M%2BVTf7NU0cOSktkqr%2BuMsH3FRTF6Or2eSRuyksv0f&X-Amz-Signature=aeeb9c78eb43daa61558d0d3396d0495c607d97852b9861442752f782c136cf4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46654CXU72V%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043709Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIQCTUwrQvWBa1cPRitdLi8iUMgGx8%2Bc41MvEnr0%2Fw3eV%2FwIgbAhpkKi1k2ma6l5dcm5bJ%2FYKylPKL1HR%2F0QpDNrzuoIq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDDc0k7irrQMr73cnVircA1x%2BrazTBTPpJ8QhRwUT8wXFIdBDvzpsoVOWTY7p1ckmvtH%2Bf87Kv5u6VigT5uLmbBS5ntaXgsnKKlgytIQuh8ilrv3SNytzTte5uQ%2FNwT0lfJ3tF3%2FdneKKrslovh0o0UpWfF3nYAZKRKAT%2BkiL8zQECKMGG3fyxP%2FzuFZfuEoHZhDyYX4BlaZVMABmtn09hWtWENZN9XI1YuJq93JOamOalcwUQlUUode808rO1xpLcbz8ooKg8YcCdeiBtrAPicu%2BTLbWlqIPIgnLdbJ5lRKHiTRnQXiQV%2FQoiFjbRdfJqXRLft6UseLQzsYgQ7tPvb0OBBc4JLsHjhgBiLXQPBsRBOBOAFCufv1Hw9WmgZIsqtuQ781ti4SLFefz3TjRL8uTYFoXDRyeR2acgOtCQk67i%2BurvPK9T%2FZnucm%2Br3Rek01HjiCGA22tHPCwUgHXXCYxJZeiejP0zcYFDMt1E8RIhG%2F%2BIlLurNIxdQwRdE8bx4w1DDrFUdpF7KcYjilG8KSOZgjMCYIT0FMvNfYR8TIavHDRNN0j7xHd4%2FLUktxbyMDV9z0g763b6YG94mBNeI5fz4qlOrI6pu2T6pyIA8aZJdsDj90xiRl%2FmHsu6yrbV1pV3TAkwaJ9Xa33MNuxv9AGOqUBM1r3d1F3PjMTcEVwYQRKyTkwEFtoH7StZ3Kuwpom4GtHTIJMEBaqF3WTziPh9zG4e0sHVzUUc240R6epsZENrOqs2Maw4wR8brpYnA28dO7PulmyDJwtcpV%2Bck1DUEYUx6KgiYsIXECXfcA4Ju1SO%2BCfxQ61rTI%2BaJ5JolqCb7UKb2QtEoj1EkPTVRbGXi81diTzXGwGhaK4PQMKiYXJEJwiek77&X-Amz-Signature=1a99704387a9a0825cb7139e29c8b47db243fef42e56b27ef102180de457a38e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZNZ4MHJ%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043710Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIBzNDtrmlKFNv0xlCxz3GqmBD6h0psNHYD4lhYTw73rjAiEAnHV%2BJr%2FnJh34y7chguIFbLqqmvMh3oBJN4iop3kjsngq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDERRiE863fFUmZphEircA7LhCPaGQSYcTwPx8L1V5Xk6p36znC%2FJl9gnPQOvC3PlmPuKEMGvfSYcKsLoxQvQZ9QBC77JNOSIWf%2BhBlutNEyIlpftz0tKXDJZTdEqOovYj9uoNYfJtPK5%2F5VPNDk6SAUVTgowT0EzxJboOT5bq7NLoswNhLHSP2mqEeHY1ETwMfOmRUkW2Sq540G6R3u4qXmAFBxqstht0YFDE6lFoeeFqyVL%2BwauJCkPNi68jlRVWw3RYgHHr0E%2FJ8aqjh4uWSOmMVnacl4mLQ%2FgJfp9AmoaRkhJekrH5Ftt1aUA6q%2BCiaZK6SdslRZASUjAM4OUQWnNBRzUC6C4T0N6FUsGgQ4yztuu8t0Fza6e5HPyMZ0ZVo3duVf8sPbAoe21bEWj7PpGflJurGTPreUPCgtKu173RwvnVN3Fi4Yx7VvSCsA6mUzkhpvz380AlOUGon6OREEG1TGU6rVRv%2FdQIfhI30%2FFOoJFvwZfytVnq2c9PSKyJDgmIvLOXx0REBxuSJfHXwWsJLRhDgbLSqBFhq8VyWKQn3CDjIOMYCJ4flw1G4Atgc7%2BEmLANk5LtllQHM5FVPSQxFxDvy1BcWP1RXNxlCFdJh8nzmcGn9ar35IhNYw1ob%2B2ZNrEjjCPTDF%2BMNuwv9AGOqUBc%2Bq9RNJWt1tlHHiU3nE97Jm7%2FiV3BhfcQEzng6AT61t9cdbF3XKpi8jawck3nH1pH9OqiMefpAVgLonEWlZRDVmVBD54HiV2Z5GIdBY%2FLN9j119UNnoEAWRbKGUwUCJ7FECNeIHUHB39ZtF%2B7dzSQe4szJTQR5mlrUrVYcjxCsYFcnTkqYI2Rr%2B9JloGR4NAoBasfRTV%2BDBGM5SaSK2vIOA0DhLZ&X-Amz-Signature=2b9b171fa09d2b9a8222bb8275c4821a722afd4f2093a032b2faa98b1e4eac40&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QMWNEYLW%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043710Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIQCBeIH248aE5gfU06WFKl9ZSiDdVpSjpNRV6Pd4qhFnbwIgVq%2Bh4g0a8Lz4oZJ%2F5A%2F3kCd7LnK3RBUiOxhzmWlo7iAq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDMEfFur2hY7IvnCtyyrcA39RJ59ghFwBNZIQgoLJspZHwkbtvB9a8%2FmF4mQ26H0VQuShveOyjOMVuQHFk%2FYegnL0yAMkFEt177Vkz0EtxAcswQotJHgNTbPg4rCeynyv0fj0uePJTvu%2BS6%2BLydBF1oVwh%2FloeHPXns1yIB1M0iriL4c7ArOR0qghGX4vBUIHqmOjMxSgsebPlsJTDBfb5gQB28gk8pElcGH8WjZh8E0%2B5vbQGA0sP%2FYTYw2jkPhs7MT0UotpepjBDCiS1%2B2%2Ftbb6HR7pt38mfuem%2FAb9TLpSCl4IPmuCxilD%2FXJthacip3rGmagrzplUWUteJJsFcJdl%2BvPowhxyz9YbK1DfWye%2Fk1XVAWG06DhSggDFg3N4JYkPYXZvuDY3HvbCV%2BgQv4Ez2455dSGdZuXZfHILWaGWbqheh6kaLJfQ30rNqWIrnUZtgzeQyJ6pD%2B%2B9X%2BXcUlBGYlOiVVO2%2BY2%2BrkHLW34C4LETJtgWokn7HwnZXc2NVq7N4gY5UU9aIkkq78naHDsRsUUKIdBqJzfNDof%2BtXh1wFglltN7INeXvT6LslXD8heMJRjVcft5R83NOEw25O8h4sV%2BZnjheMoSASYrWiXofzCFvKW0Fcil72jF0dp8NZf8XVH%2FeatUwdqnMPywv9AGOqUBHq3D8NqCGDW3MXY6RQFvf1siuWjxitgJtO9JnFyzBI4%2BawgInx1sjN8c9%2Fa3h5iXyX7OlL3baACNsfiCq3xN3w9JjqxzHZFUhr91HKq5I1n%2B8MPiHqb3jl%2FJrKVnL1qGUaWepRKjqnSkzLpT5snN3INfjao9aNq7VFPxcsmJrFd6aT7pWvt%2B1m1q2eUXVFWBA1p3LxlXULLjsVCTeyjH6Pn1qy8s&X-Amz-Signature=fc1f8e09217ff0c22c7116ae2dc397dc59c2c44c7e7c8078745624bdff114d7b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043646Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=a0d73ee81c58a4442ea84531b832eabe024cb2bbac7df6dbcbb98993e9d646d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043647Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=f9ea3a1011dbc30681c8c377abf81cf65f3fec9165d6478d93a5d7806768941e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZXHNQATJ%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043714Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJIMEYCIQDP2xa%2FMdCHSCjZF8er32u%2BkCWseKR%2BXglMhR4XjszyKQIhAPDHFQ%2FteHWC%2FOQcAi1WZQJGZogpe9wNPrXZkfeIiKGOKv8DCBUQABoMNjM3NDIzMTgzODA1Igx3Ys2cZFE6H2lGH9Qq3AMtVuAcXwMw3xVzbKgUvJ5QMyluK0yHzYTEHE4yqXqoaxUmemVmTnZN%2BQ1ZtP%2FSQ5XdVwfIu%2Bsk3BfYyPFOEb4nIXN7SjpNKsXJnmWANTNL1VCB%2BPVhjMRpb9MxkxG%2FdSW3%2FVlM%2Fvd2fp6WNP1J5VTt%2BmCVt5VSat0BGXwuDsCZj5ZjxAOXqfW4tGtVD7lwxRpO52Z%2F%2BkyEhV5m6Iyqs40GJax6GJr%2FexT0ds0vfCdkbdPDer3K6ddtYaLcQcprbpobGVFFjvTsgqs2dRixDTxUL5V50%2B48lxPqQPbSvrPIHsdPVrL%2BV5r3k9sigXSZdSVUl4I%2BfdXDShL5Vp%2Fmp1OKXtR6VwaSqX4JdanKk4ygsAKChBsXF%2FnHDJ9gn7zW7sjmBEgTl6SoSpq7q%2B8mrIiPXy4f5%2FB7xtVvvQDeBOnOUK2j5xH0uCKY69ZIJLGfo9EiYKIzKJnZVvrFKF91LQyzuxsRL9VOJ57EgzjvDzD7ojTINL0I5S%2FgKiBiYa6s2LFsG%2F70Fo0LOEW0FQdVTe04KrqKt4wn%2BmcEJFKvD1Q77hrXU9UAV1XC%2Bl4%2FIIuZQAps5CB9MpRwD12sH1uaaRbFsyVjYAYgw%2BdXY0pFQGI8Kn1nJ2S5o3qzsXsYFTCpsr%2FQBjqkAaEosEpV7bnxKUOHfzLl%2BBO21BRx5IS4mEiQSr2QvNhXPOS8UHfz77gE6dd6glnRDcFL1trIQkADqExJi4aSpyaMG0wAcSqBz%2FjnLRfg9aCXb4NyagXr5uANbJNqsgTdgttZZz16payda%2B46IDIlxrXo5GL0ijNDeadScPyOt%2BbCaMvkNjzH9z2UqbUaqX7%2BnuJLkEImOm%2FzmNAspOve3U4yRHrC&X-Amz-Signature=1e6c3ee5b61b7e686a8b96f6707caf3edeb257d059997fb12238b126e935cdb4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043647Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=d019eb96f575e64c9533b521d2e36659e2dd1489da60efa7c48af51cdda1fc9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QYFQRDC%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043715Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIQDh30duiCBb8hPsv7xKuXUwc%2B%2BDmFbNo2X%2BRlqLAchs4gIgfdoa9TeOfjCpXJilBijgHsKIn5vVHyT9teSO%2FCiGxvYq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDABgqLWCEguZpdFk9CrcA51MnBZxyCq7n6HiJYQurWL%2FP%2F46dFscbBtjfJTOUPIbw%2BXfi0PLO0Rdq1yOEu0%2FW4nB3nsuvxfo2bHeRAue9lCB1XbxKm%2BX3xoQDWTJlwPumKl1RisNhuREir3abc0G2ZkUKQz4%2BkjfyAwpkTjAJKT9ub0xcwLKHQroXLKVo5Fp%2FPJbZmg0yeUQv%2FUVmZOKKAlVQM21diVUkkXhLGfX1O4EBrwJxriznysUjOMDsue5O9ZKBB2ZIzu3lz0R4wQXvk%2B40yeuAs1ZkpwUyCi5rbeRoJ0GQ8DGTWbRDxTZWM43ZFkbwBBSJJPzGRb67%2FgJXFi%2FXtONhhfF9JxpGvNZUzvFDHmtQV0Zdq57yzUbHBHVE9GtWFTOUo3boPOYxwJFUNysGsmEon%2B42QvbEObLcXDaJe8Mu2z5C1w3%2B1Y3UUXq5wUuMZWeBe1BC9VfrXACfqixuejNfDR2kTGXIAN7G0N3atZggzded6E2BVwGDHxJnOeOT8vRon1X8vnruVYLSBAJ2Bh33BDkEzebm3lZGjgodO7xaYH%2BN7YRmj%2FQonQzGCwVVUBHXHFXBQv8y8snWao38ivVq1vKMOrC0AWzhyPBrTPn%2BF3gUePVnJOY1HZrY7J0SW3tCa0tjydHMNuxv9AGOqUBFGBplHPpGNe3OS80dN33Xt18D7g4FwW2FTdqtabP5y0lmAlXlU9Sa1fNjFFXbcC6GagnrBW4ABYq0s6fF0GVofpMsXK8Ji4COhBFFx2grk1YxtksC7DuICSMK9xVeIdvSNvNFod%2B7Q20BbifcdU0nZYVk2dmloHMjASqKtzgR2ntMx7aWmnP%2BBY8oU9SMv0vInSJqtJ6w%2FkpnH3jTziqRNGMHH4Y&X-Amz-Signature=298be28cef3a7fec9742089f8436c551328ab46a2ec3c61b793b1d6c5c27be3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJN47OQH%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043715Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJHMEUCIFDxH3%2Bv6LamsCknZyOC3lBG4KDHLQ2wAFoFNnR%2F6KywAiEA59op8hmR3fFp3OOUJFKGEICXG8KkuVUbAddmULGNPzQq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDPdmZZehDWslgAYGZyrcA7JqaafXRN%2FeuYIYu4Vzs%2FrfpBn9Xhw4vqhlIjKfxbFMjJaCHCbkBYob45HXG9AknjzJehASPBif9VJmARypzqTKN%2BmurPXT%2F5KQhKScOXdrfxZetE3kIjkFfaLjfjvAuCjVXhWnvdTrrcokf8x58RUt4xemOLJ7GovwUWp6zkuy1JzTonv2bbyFvA%2FSncZgGZTtdNGBdBpNt0WwCFhQop9AUZizHLVCgWC5dYTbwXZ8awntihra8uP%2FgdHW%2BrhVsubM%2BKPHFQqrLDOYkN1GpOe3RabPVJOM4iaGQ3lz4af3Fek0wL%2BaljshoK69aYPUNOaDiFuMzhXsvPirjYmVx3wAnQhoNePsWDZXt3GAjyirytfPfXkxXu2f8pmIQPeLb4IvTzPRCvKN1dcA3B4ngFvWSQivIMVP3DPz8wHoOTicqHJA0fpxADdWy2UsxL36dE%2BbsBvL54FeCAfjcx9sbuj0Dhhhl6EGJjv%2FM1zUdVsI0r3m0%2FuyzYV9YoqbtHhPEwuUMBDTy8aC7459TtFj1B%2BEuLNzfR4S83fEVQRaph22c2bXDUGvM006tH%2FDojjecxxC%2FZ1%2Bs%2BJg78SRVquW4VfRFS5C9yErB3egDX3K0yZZWWWFfwvu%2BVWMmF2sMMmyv9AGOqUBVo6Zwr6MhfU8iDQveExG%2BbDq%2B7aDUo4VNbC%2FdPRIk9a14xEXzRNjSZv3NasaDtayfPMf4ylDCZVGu%2FCLnbib720OdP0ai4FMJVwEm4Vkb3w2hpkh7rI2Bq2ke8YHMbCYNCJdI7w0VvnK5Mn4%2FgUhBaMQQgxIhdzR7mv%2BuC9xVs18Me%2FSl4Ojp%2FvDjoVvz46TudJ4GIkU5qPOXl1ygSjDroGaQmhE&X-Amz-Signature=f91e39c435497d4f1c4524cf20dadcb902c8a60a6d13744b3f0f4480ceb93ab2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LNCRRU7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043715Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIAKZKERU2%2BiU8H5PU6DiAKTTgdNgTeGumfGlNGiDTMYiAiEArqTAVvDoNTYIRTT7F7fPTXcUu%2Bb9BmLBQa%2BnMnW9Cnoq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDKNfl%2BCSWO4q1OF3MircAwbFC6KZAAweyCUqSaGVoiAMbdBME2dEIc%2F5xJoS%2FdyPe3d1Yq53L3%2Bu%2Fp2%2FHWxphuKFmLhsvVjcLNbKV6%2BAu5tldjd8bROExPwh0siowdJAVwunvufA3pj9CvhOCxZyKg1KYwmdDQ81UNcmKBNSy5c6opVcc%2Fepu%2FCMUJD3YcopcVKZ9oo16RxF6JSRaIlC5zy%2Bdm0jcvalfS%2FhvnDaglGcL3T4DyDRdEmnhO2xu4dxO2NhXAeBqtRMllBuRF3aCw32Iy4%2F49CooHMcDXlQQzfBvN6yIPGdd363O5cGyd%2B0alJDQDG49P0Qe5nr1MpcXQKNtk3BOxegd%2FLJq%2BqjfAX5FR79tUAl2KlPaHX2G8YO6iv0udzz9D95WhcLL5dzCP7sSVeUKx%2FOGjY%2BmtsF9s%2BSq1SwD8MTCRyQGWVDg6TTwSJXZKd4VtQbzRJeaSWDLUnx55fhrrL%2B364Z%2FaLa1vlSayZ6FpA2j2jMAqfQpzMqd5YCaYnMfCQDbeuLlcioEZtEdWOSxlUdIeOt1cGfwvuHLiWUcbotR1gc58UUXSH76w1vEkcd4obHGs8UcHjCk23Tcu8su48ntnUHveeHbtgagn8aKBJOOHLEKduJ3WwnB9H1MJyN9%2BSEmt1SMO2xv9AGOqUBN980ezcpo4dQtQRdkMfYiYdRzJ4tCCi8h7NA5Vd%2Fm7vlGL2CPJkCFP7txN1pdeSN%2FinoA3y4n6PrlZI%2F1Ppu40vS%2F3E5c8cKNuxHLzDMZreA11oFV54DMp7sV39qI5g4Vcs7QhcnOkT7ryTdf3yz%2B1hvyAPGxnSMIGdju3vbKInyt0ZcugO4foAwU0wgbHg9LbN6ifXPBPcwlP%2FPcUDyxNDvqOJw&X-Amz-Signature=ffcb0b93c961858cb37ac8fbe46fda0828fcca749ea7114f809b3cdb601036bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466732OXU2Z%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIQC93nSrkIMbNKmp0JyVZRAaswMiLC4kMZGMlRioVrCeBgIgRZK2HdNe3ADCOdYRRVdW4lcyAqbD5rPmZWMWo2OeTWsq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDLDzCiHzxYCZgcQJxSrcA8FgslSCqzgfxXDGFNZhYzv%2BwAnq84z6PT6VxC0buwvi5u5gLtuC3mZgGQEZGl5YyTL52D1cMuTktGmyt9I11DRaB%2F3R476nTGvKe6wagIdE8hT85NfR3rCBWr%2FVBbwqlNh0hXEUUEJ2qcRNjg1TRnVuxU3TNIenVTVnMaaMVhC3XU8CVaG9ldi5RIweSCNLqPwx2HrmemG2Kydm8etCj0vfLv3zuUdWzFzVz4nVGi1mpM6K%2Bqzo4esPBt5iapqB117beZhFnVWYjM9kfaa4sejMpDu7bff72Uq2rRZ2Mb%2FVH4Qf3m46oD7KaH5iMDJMzM9d8G%2BFNdmYftbOzAL1CP6buHzSVmOPkg8DrVTRcHLpBMF6Gq5bmG8kg2HDMNsPMyv0tQLzRRZWvYpgXtSei%2BSt2rEKKqbSLjQNzMbF24AYgAIA62qcasyq6OfTS1HbjN4Ho4JamevGqbNt98WbWgA50i2fV6JqY%2F%2BIkBfRQ51%2Fvd4CyEedoAp32W1wgT0Rr2c3cIFHb3HaJ2rsFp%2FMKRkikdJxeWCu3F8eocc1w0%2Fz8dWJHV7GOEVCGkDlcRgu1Ov%2FQrVXDfcNN2Baj%2FjHyI0Zzvfk8EU5C%2B2p1p4F6KXFeqwqmRNg%2FnYuMa6gMNOwv9AGOqUBLN3Im1lFpfmo7wrBdcVu%2ByeQX%2F%2FGUvDaskLpdpK3buht6%2FsvyF15mQVReYrt9eIAII%2FiImLx93Xgi5ZPWm%2FTmvPtEn0g%2BEQkU1o6Q5WAkt1O2n9SNWocXbsm1w80ottd2%2F%2B85eGEBOLIsa8gUs7EddyAu4ypPS%2FWDxpHCqyf9IlQzcORYtv5eJFIixNCfIctGsIWOgmWiykJMEirTkxwpydlDBsB&X-Amz-Signature=4aa5afe6fbb812752cd97a0c8f330c95cc5be95122c511edc7b28f3a85a3cc61&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043647Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=e946d88da4dd0ed99c5eb01c8165b2771ebb60cd55867593976d03143b0c891f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQPVDV7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043647Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQCbHGXaPU8iNoLGdNuB1Y1ZtauvwhnDSk%2Fl8RE7WJO0VwIhAKxa3NlOkw0WSaQHHCAsPcPNqaGcpOELXeVKCD9GXWC7Kv8DCBUQABoMNjM3NDIzMTgzODA1Igy9BRxkRQKoIHOQV6gq3AOfzpbHHoqedpH3LxPJFF28DkdOmkqymX%2BNdZra8P7ra8fLRU3V8%2Bx67aa%2Ftf5w7AfEoPHuAVJGx6lK4pnXC3YaCx9oLA3mklwfmDgWqWgKNgWUJu%2FE9mZFkYU7cJTXbrSR6PnnYTUuXAjlzATzX0cF6l9k98aL89Z0bRDxrcoq0Z%2BTx3fraikZPtg2CB9yA8sC5uy3C3%2FoV8H2XCfrqP3AspxXuWYOY2jQr6VgJeAnEkICB3KMcZm%2F5OAWv74buaGpUH6H0%2F3UkCeV1GRT9%2B4mXEwx%2B6H%2BGZZ6KaniC3u3BF22GbINi%2FQs46dhGiHwhTzysCZcU%2FNiHl8jB2dthfX9rlOM%2BzQ%2BocfPw1qO33pxx%2FXrkvfVqSO7WPQi4u8Z866x7%2Fu3Ove4%2F18N50oUpQ2JSXVYGaspjGPiPY81pCOH%2ByfjYIYFINdogw2hoSDNO93xsWsyjGntP8ylmaYzk1BRA93Oa3wxeukOW5cg7IvVmZqUxXlJKOVv7bUiYqzqzpd%2BkHpKLuRxQ1CJAwDSOSLd2f4C52vRg1huQqP3y6PF8lSPm4ErkOcQy045QCVFOYYfolySOsC0mHYDuITmOyuhZ0e113mmlxmfPrt4VjSzaMX047azvh2awnVCYzCmsb%2FQBjqkAYVRSL6z3n1G0ySX%2FN5AJe0kmv7T5%2FaUPPGBTZKPnMvTZqYsngiFpPBlA1Txq6wJxrEOpCjuqM9EGXhlRJHm%2BWQoq3bmzE4SogPsdAKLgS86TTs0hzc77O%2BA7LgmlP2NUxx9uO2j3oY2CXc3IakVNbzL5pveNjKY4ln1BvWiT0KMEshtQpjjLyAPpv9D25rGon3F8vNOnd26g%2FQ59XCgIsXIN79T&X-Amz-Signature=7391a26db95030785e5da01e1d132b6c123da439d45213a631af4dfa164ebf25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

