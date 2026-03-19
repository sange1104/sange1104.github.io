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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032156Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=7d2de66d52b26a868d268d968bf4ecfa07397bf707336c296772a44121aad9d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032156Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=309c16bb65caf96dcb2d64606ec3cf95e051dcb6cff7299ca25807796e6f374b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032156Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=726ebf7a12ce97698ca2186be603d8f13b2a10ade6286afed22d663b5793103c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=57bf235c47713ec703e83097ac4901121dbcd5755aea8af299b602e317636852&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSXCLEFB%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCID6%2FYqpWVIhVJaZOcaILOM9MlRnBbfxXQ5zz9BP3lR%2B9AiEA6lBFTrtbEmMbr9Y%2FxdpuGfnejhBjARa94zaD06Qu7k4q%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDEVhseNJK0UApNWDjCrcA1z2UYvirbevIbhoPQENZRejz%2Bfwawp9%2Bp%2BYMds8Cf3DoImWLQwIPWVQjFyu3C1%2BIHYLrHYNaBriISp520OZLPFYS9re2Rj%2BZg5dSs%2FMSY18JyvUVp1iSwmwbNyzh3Jh5g2YRFd9Djbu4EZYOHNWjtxHNG4ms2CT9RlzYMYPiuhWW20BCcy0eRBeGnXn%2FkirW7BEE3TcIE5qqU3X9ciMkm46l71Zo%2Ftt%2FT2%2BzE77AAVHAYQfWlpe11Cf2hkejvXvmujT11VgFZxzRhG5aezJlKWEM8ocr7bsbF1MYUXVasPs6def%2Bj2rrqBI9ujNNC0PuReGf4z2cztenXr67f8v3Ch6O4LV3k4lGIrStzDP3BNgclx98sk6ykfhFoXG3GjLFqFVQDo9q3tjdpctlDRNd%2FqGpAFq460wnxKhoCD9gIiZmfFi8A%2BZBwVaRXQKp%2BrxCQodMX2DG%2BffPVB42dq7rvk7koC9pEm0iQjjG%2FOIflXqyreBZF4J4aSfVT0bC0ptv7Nw4awo8RZ9D0%2FwtzbAjgfUu7LKESSm5n5mAcsgCnXkFzHREecAn4qU4sqs5Ai4lLeR%2FxmA1idfmyh%2FLYldSve3Q1eRLv1Xv8%2FEoDFHG2sAvjpOMh%2B1hPcyNSDEMNnG7c0GOqUBPh4W8%2FRrQHkukKI3qfKjWKroiBWYnM2X0txIEdCeog0IGcGryYXdlSl939cXOLb%2FUC7I5NS2akSHIXtVxITh%2FGZJ%2FXjAjXgFHwVvNORBcv6CNjj%2BA8i8MhdLjt64rLTyqgeTeIqLFRk%2FUEwaOxQTpdYoS%2BVYGjIHERR2jmOi5ipC2ZRimk4%2FuCGU5%2BamS3fqKEWsAgx6AxiQKTja6OJ3JimvyGc3&X-Amz-Signature=965a76a1486074a1f9ba79dded043c6862c9205b793bf05f00fc02fbee1ccc36&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XH5NG7KS%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJGMEQCIC%2BZi3Gs0IMloRPRFsZwBlDhA7ql6GOzb0rc6DczcPcAAiAQIhNR3k%2B6q4cNoaM0gDzhjUwOu6iOOFX4rNL788Cgair%2FAwgUEAAaDDYzNzQyMzE4MzgwNSIMz489hdJafGIzF2mrKtwD6kczuwrE06Fk987KYdbDciJcD3VggNywh79wwzbC0Bicfd6wgLVt3pqmFYve68Gr6wg5js%2FK2jjTg%2FQsX4BAtZOFqlRyWVS2c4yQZM2aEZtxCF2MA9LQ21dxGRCQPHSwLW3Qi7XovX7TQu2vH%2BXHG70FDoNqqjV8dARVwD7Afp2rlRxDW2YyXXa1u6BHsC2CQ%2FFurQltdjoZ11O0xEEH8K2rHZ0liPAnhwbk9jr%2BfmsIhgcqI%2Bgnudl1quaMDZJoF7e99ex2QBlTRwd7DuQGUIOJVIKPx%2FXRfKkYnuIdwKUm%2FbPrk533%2BOLIrYvLfXorhs%2Bhw8TYKIYTTBXDbqX4vjWhhV4QCsc6Z%2BoPVq3QMQ5nuFgAjJmyx9PPJdRGYtjBlMp9gpUIvH0zpRhuD4c%2FWl2a4qiKYRBogGB1hZdQi32ope5KxPEULfn%2B4SCh%2B7V1IJn6bUScLmU4OzQ9sfc%2BTKRoroSlu25jsbYX0jdfs2s4DLCoP3mlNcMRPuv50KB435ef%2FvCj3WJmwrMeqnaN7pSM%2FdqjCE1kyUxWwaH8RdxiF03kI%2BRF8xTzJ8ZMB0v%2BlJOeLVxvXG8k5tWZTPGK7V%2F29bzVsn8IHGr7tqE3XnwaMA1ain%2FFpTJwJbww%2FcbtzQY6pgH3zr40Lfl%2FySkEo35%2BqbahVB%2FHmdHVTCUhPmpdgEVtEIXLwlNKrYk0gxH3Y2%2FIafMyhUShGi2aRkYW9r6TvMAFqBNKBM%2Bo7AyrCkWKasRcZew%2FsgC3kXalW9owEL2Wm%2FUbjL6GNMQBafITmOncRBhHMuzequCQeAriXIH7d9JNGbwE%2F%2BeIRSYmNSlk1gyxkFiaayGtXEQKoPNr83Q3sTj79r6T5bpB&X-Amz-Signature=4516528fcf750f21df2932b54a745d6742340717c74ad5fea74068623e16d7e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667SC4SRTE%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJGMEQCIHnusbCWbpE%2FIPSrCaejQYnm0XhrsEFQ%2BBOVUNTualFTAiA3myWzyb0QSnaRUI5DiE%2F5Htsmi2SJk9%2BZw1CJ%2Fc35ACr%2FAwgUEAAaDDYzNzQyMzE4MzgwNSIMi09jSCvTOhCkAiPUKtwDP4T8HFW%2Fod1orE65rrpdNZoiMEweZaAcms%2BQMAHJTvQtLYPlNXolFxPfPRp7ITBBdrdd62Cm6HnQe8djwOnZM0bI1qHAICmYRz%2B0awhUqr%2BkURoJ%2BrE%2Bp6KGKbrRjXtUNRPlmxajRHtoo6rUaVu1i8mEf2Ca%2FjGYHd0%2Bh5OWa9qXHKGiXoGhgDkRSH2G75D9dT8H4ULPKXfisqBBccVEyzcWlX0sVcFrNxZmTG2%2BvDJxAiwnQliEpDUDDutr%2BPoR4pEn9y6QrByYtZiWP6AaCNcjY%2BJcdd2%2Bmt%2FLYz2OKJvLL%2FCqTIzm4GFTbf5LV%2BwlwSBn6XP%2FqDnJHjhDl1wJyxGHkw90eYYCljziTqVWker65RuB71Rm2%2FyE6j84E338MLntJr%2BU8v15QPSi8mBwiStkqeMvZTXypSF%2FhXZALKHUoOB%2FrqzJU%2BvO5fxfFiH1N%2BZUD13OQdBqSVn%2Fe8j%2BYJ1j0aN403r6T8LpAEb26jQcKVtSOjzOy2giG5iV6oCqspNxbHhMZEiIHvCto%2BqTKsRJTqBH%2BWSnK2jhWW64hVxWAQ%2Ftko4pvkBIlOith%2BN%2BAKA%2Fhfv1C1%2B%2B0Qamb9WQJIysd3XWh0XlHwoPLzKYdwEKeT27dzYXgd%2FBiZQwp8ftzQY6pgGL39MaxkEebteMFfAYdHgSm2W57f8BLAvELCmVreRD3LwQrFKdu3T0bBWxDOeOdMnoMA9m1hUKIgdFqg%2Fuai1seOX5%2BtyxgTKplc0lmWyH%2FKUTdD4ctmsC%2BUwLRnvoGzlhzOzB5fBMvDr9EzjqcWJHDcKJ9gIhsQc2HLWQl4jkFs95jkNot%2BqIkq8BEbYvzxmhj4IjAQfDAuBv0ZqNuJ6jMx4baoBr&X-Amz-Signature=214993d4939c56484abe3e79b29f1e720b8b051b13e7beb1f274f2209d01f2e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635HR4IZW%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJIMEYCIQDARYksKCrxjzA8ncHB8DOlluVzHMkkuIlnT70Q1LItSwIhALuMUcQbNleRUZ5Xe8xW0VpGWuKBY%2Fh88xkQbhtx%2Fa6DKv8DCBQQABoMNjM3NDIzMTgzODA1Igwknr00l6uXTJ5BjEMq3AOcn%2F%2F6vqi0pZvzmRPn%2BkqqvqxcejiGCL%2FLV7cXHgZpo8oVzd5%2FyKpqB0QSufTlX6U9ucUhMU1KGVTeWLFmJsO54x%2FAuR4FOUN1gf9fcH40Y3DSVZfS2Q4S0KCFXlRyfrnPrUYwyYYZ91tZ4uCRPdjDZM7gW3XF7%2Fv8tH032uhr8dfO0b0tcVAq0fQifVmh1mQyC6FielFUnIBQJd4IXmrF94Z%2FwYu%2FLouLMJCGIWYo4HtaHVcfp87t0gv%2BlPZYttyVH3xWjnxXj7uiQuSZcxW4y2XHGc7bnqgI7Rv%2BLKiLTYKc5ejVAwBQGlqz890LzZJ%2FuINgklwDpKYBeD0MxSXeIJdtBReuCL3SycvAvYuEHDbKFqO3mTp%2Boc%2FN8UEExX0c1HIcUhfh0Vtv67438JT%2FOu5tq4PNQ9x67foxdbWvXk6169SZwBGcbycuA2CpOAGJHovGaE3t7MUabkUlZnD1gafUSxlPsXExqCHik0TVL7NwQMkDqqXXb2LMAcprfvlxZxSGU6%2F4k6ng0YnjwjE26dGGxtlFCBSy%2BPPd%2B9XMoXV9VvOqwWdnhqVa9%2B%2FIP%2FBjQ6o073aGthWY1I35JA6dKZbZzEKHEEJ70EmEnOBcffFEZ7DYhQ0nu1xFFDDCxu3NBjqkAUVRBZRCWhKzvTN3XGwfIVd%2FJEIzdV2fWJseAhwS%2F6scvdborpWhQExippvLxe5h27AguqotcjXLlO5pyOj%2FWRSvV%2F3SXHBzJYD%2BmoqhlkSOMoLjaWj5x05a%2FFbKd%2FuhlLUknALErdjcJUVmUh6eXJHd7hL72pa%2FE11IXPk2o02vdNeAq%2BTgVs63v7OlYL6OLGU%2FZYMgLtwExkrtGc0NrdFHGVab&X-Amz-Signature=bcf58614f5f9f9a385c2666276c4e68f43eebc0a0612115b52ec03d0e9471958&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=68613fb060bcace2e6fd2a943f0227089add73c3850792930f990e6d486ec364&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=1706ea4a5e19cef2dbfd5dfd62b0ac2884e60265c57939a262b09871e78e871b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TILK24GY%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJIMEYCIQDFTWiDcvWrSYQ6xeUpXP%2BvdKaFpsk%2F39yibxUhv6cNyAIhAP5yx90BB1tuZIwkWCV7Elzf50swLjiBk8kWhpPzbb%2B9Kv8DCBQQABoMNjM3NDIzMTgzODA1IgxayJiZYjmTntdCBmMq3ANsnvG2xUcLwgSPeeQp2ncBtDMEkRP3VU5CxPoNGp6NVSTB2OeWgYowuoGYRct9%2Bh1j7XStV%2FAX2QuWWVnKRjYF20tGj%2F7TAKrjmvtNN3XXVCTrmPwCAJyxYPznXeESKVaITV4ozUGkyrjU0WpeMvxTIUxoXUvR6Jz%2B3XD2fV%2B3NwD94locXOiL67QXH4wOn%2FWlX4%2Fn7uHRomx37ba5%2Bpb73DqArS7SaSCANBnpI7%2FYQVmPy4GWVZ%2Fuh87QOfIsQc1fOJrVUzmkJWnPCAiwAyYSNP7iJyEWjcbx%2FdMB1AiBT%2BiOO2zTou%2BXWazGX3EWcJ%2FKUK0xc%2Fe2ae75B83R0wBd%2FFEWaHiXjeYrom6PLHSn7cJHQUZAr1E%2FqBzpVj46wf%2B8rfNxdpPSDNwhVpIQPe9TkmEgIJH2xg97Q2ZCrS4g95EYcA8oXmDdOUiwS3nk2fPMwkvV5l%2BAWlSE7msu4HegQeSrBBIq97kjJfa22woEssGCmNHJPE%2BN1Kut4SrrIrJJNNvzYw1cxPMY2xqNyDYPNNDqoxCAGpI5Y%2F0OpxKPwOwuo%2BzIB3VmNTTQozTmu0ZlxOgJpJH%2BqkbEcJ%2F0XjZNPeGII8UeMCRnv21oVxfmnLU3io6aeRLA5Z%2BcxTCIx%2B3NBjqkARzJg7wBoXgYLdho2TxU4ghNAcXvdoSwJMoaaEGF2ceaJVLboF54tyouLf%2Bn3VYRAmBS9Crm3WSdMxHVCh0iByzyR13gKHjqN77l%2B52o7rYeunTiU%2FBjKYyefVNBriqZ4oc4TKKnXLTvmJFQsW%2BUbPfBmdCg1SgipNP7GAG2zTj73ZZbNIqZJYJaZ3t%2BSFYm%2BADJKxe0ma8NYdbDZLo0N6OLEyfn&X-Amz-Signature=a219e926510de4d3aac2847c0600702615c94d05450622de78a854faed0f78fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032158Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=bf6348f9287e0a85ad05fdce181a14b3bb8a8a2fe3a664cb450892dc31406e0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TMG6YMFS%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCID2b89UqP%2Bzd6RrhI9HEEQsbxwfcpC4jUwLckSUjCuApAiEAtmlNgUi7D5WbTonJYHjlDyNFm0FVstYJfo8BxTvfUy0q%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDAI4nQhP1H7lelCqtSrcA%2BRhSRRHfstYs%2B2ooQQoHTM2oVxl3YLY2c5Xft08scAKYQWxUWKHwL33iSC5709rkUoSuRyz1Q%2BqP2X9i843nUoQp94hTonEF5qVygEKTY148uvc6IZLOZyrbXGurEGfgCj0q3AVp3ubDZbNEnjL8tyhm91J61lmcY2B4CupFaTkpM8xKzPULQinT0%2BOhZxKu%2Bp%2FdzhpoPXwWxUpWNUdfEppY7XyBX1lffz8EG5asAUd7eCCK8km9vud4mFfBGzcCO034TWKZjLGNj0SAyUt81mwH2JVM19O9c%2BypAh8lElKYpSrRYComxFe5RaPk5GqAlTO4t2jZyQikZYpj3quWtnyoFpqoVfvMWlde0tjb%2FP%2BmUq%2BYPqkoujijMcgoXTlF1qG9pTFNzCckIcNVJB2q7VDG6e3vli4JFL%2FzEGKANmTm%2Foi1tJoUfpEa7en5JtagKTsAxgTpujivI1riIUDJD6CsHFrzYY%2Flj9Hkv01ZicUgdWA1H3D%2Boisosr3IJMuHS63Q2%2BAMeswsZi6Ghzos1AbtbsDtwBvYN87hJd%2FoKSH7CikETF9U7WA4w%2FIUt435bYB6EW6wsWu0eqPv1qD5UTmVX12xyRxiacn%2BhQoq7RKfYroL8LcPHqUHPnzMJDH7c0GOqUB7riPzPLhAXDLxPlqKWQq%2FintzEXOltj%2BCNBEPgYBIOOW5gbcp6D5nQreocE22HcPMvkEy79etyOTh66Fu1O04gI4PmoTBqH8HKO9WZUovnnoDBgH30vdwdr8Ns6QpBqPQztP6njkwbFgnL8jGYgQmgxLOnNq%2FtjnBiPlgR8cuomVlVZzuO9Gpv8yt%2BKW96R0n2ScPA1ZnzeGozMY%2Bv1LSMK%2BqsEx&X-Amz-Signature=add41e2ca2c71252f8c99330c3f6f3f0eff72b78ed0b6a3e4511163f6969d3f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZL7B42W%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032251Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIBcVoTpAQ5z2MHjCEf8mFDDAAkhFPXV7XplcOHmqKCyAAiEA%2FF%2F%2Bj7DXcWxscyRQwhMiyTV%2FZv7FK6xubextL5aTu8sq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDILikpko1sthw3LWWircA%2FCpmn56br2FBGEWc8sxh937iMNiOcmrH2ScN8NTyuwtdNZQwnO8ipIKwjIz61sR3ABSMO1yoU2qA2ZzW6ikRREE8H%2BJrMp2hDrWwWno0uqkBP7TZ7krQrMsqPkz62nPdVI%2BJVePTKEB9hAu0HH1gWTuMFtBFUE1JaABFq%2FRF0otSTfnmWqrqlizlUIuh%2FSGVDJ2BJHG%2B7l1nu7aeVuyjaXic6ow2ljtAoVuZ1oy4Ml7%2BcRVMQZ6ex7NoShF3V0x30fRJ%2BDflYOAA7%2BZE0y7hXnqKPKtMIzoTWtFpqOdyvfZyhPed9ETq9zI2eLXE3Rq4bvKFSGVH3fv5rLE38nyMQLCnbkENlEt73y6snM1Ta%2Fa26wu51bUHqr9oGtJizeq%2FzBheNKg5dTQYXODFIn1GojGOYqt8tASoOyQXTV6fIuKwJSqURmIdxnNO2vTo6bGhgdawTpFMGZj2AegU2C0DG4ii0bRuvyDoOPcjwTpF5c1fpEnFYq%2BeKa9d4%2B6%2BrZVeczKu%2FhI%2FU%2FR%2BZC55D0gAQr1sSkhUPRnwZUPZGCGKSp0RSf2D1Q3O%2BvtNaFFOYpQr%2BQ0c1pzMgAPe0jdHYwLs1982lqnBQEe5QsI6DKNL21BaAJFyPwxRo7gIeaSMLTH7c0GOqUB74IqV8tZLu0vScMzrw2gJsw%2FHbPxYfQx4N7Th1wskBgpg09EOvYauCNUKRO9VteqI%2Fdj1kTMivGIgW6pBPY5HpGQTAK8dlEkT8AyyfI7hW8erTQl4r5s26qc0lpBRy%2F3fmEUyfhI5kPcuesA5H36bBhVX34N7ZQToUGHapFbQcwp8ub4fFAQKrUUN%2BYYTdVNYm2oNqR%2FuTKep0BY%2BvcLo2Ta13wo&X-Amz-Signature=bb5d9a657ba1dd11724d51303dab1559b09759260b0788b1aa2c0a8495552c51&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUUQDW2M%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032251Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJIMEYCIQDxfFhGPVCqEDkNRhW4Jhd9k6IOs7p1UDv3wekkNv6nsgIhAO0LVV1KMjFWTAopRzhl5tgvECGkKj8jot%2B1O3BbS0V6Kv8DCBQQABoMNjM3NDIzMTgzODA1IgyhhDm%2BoO7ws7%2BRrAcq3AMIvmY%2BsAoIzBVJ4shn0GcFMr7pmdxu%2Bf%2BJdfBLiyE2WfWF4bqYKWP1DUaE%2BRchqW2Kh9dFGmIU3%2BFetzYZbYb4wKtr62yPGfjnpSIADxQZDTyGoUIJgN2agfM6PKtW%2FhwYUSOHBNQKq2uHatC%2B46o81sC9SEbq%2B2MwCH6T%2BJwkQuskP8DIN%2BqHJGz1JhD19Pa6wqA1pU8e9TvC7OHvwVKZJree9PFzCU%2FMFRxtSkG8U7nXHYUJxkia%2FFtK5%2Fwldo%2Bm9hakc1DlUVgo4vh6Mf4b36jUo4RZXk%2BTl%2FUJCqItiO0yuWcqHTVRTUqctjsubxVN58tC8s0dJ%2FIrM%2Bu1doLyvyP3omjCchfHFhwScPF4FX1RVH%2B9TkW76NhRnuHbNMsnqhpADmLJ%2Fm537Oe85zaIVayyGrwaySr80D4U4gxJ9BvJ%2FJxAJlgjfKJiydcrF%2BShY%2BCLqcA9N4lkAVkiRse7tY33EQ0gRrEDwaSng9NkcTkRAEyBs6SoMXQi%2FxzcP%2FFRyGIPpvOM%2FMA6ccimgBJMghfmL%2BPYD4y0Fb8iMYM7iLsuRgK24g055Fgi3BVDmOevf5U953SxypPDouaFfEYDY%2BPpErEqzimNTn78FmaOSr1Z4hu7c%2FrHtq8C%2FTDPx%2B3NBjqkASn8IH%2FrNB%2BJbfV9ueE43jbvyD1%2BwlyXt%2FXPnedkSXYWoE4qqBUI8Z6a1cMfv9bGnNICYBP7xyluXVosSovWCYl2r1%2B501FnwsGMnSAOe5zkm5xjA7zmilOhDoGbvVYqkPN37wR9qX%2FEIYDnnCelQzmO0nYvhukRtpsqO3oIUkGLh1kEQGWWesJxDvBDOy8OZEC4jGUcLeWYJAtheYDvRkF2QlFK&X-Amz-Signature=cd16a7cac9e23a72d1e239621cfa32c329285a55206f05bc3042c223fa8a1dbc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667AHVA7HG%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032252Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJGMEQCIHafvofpeZj%2BGRn5pCCzCxqrFU5EnptL0XV0HFFM7dtYAiBd9jF13Q6c3D6BVyw5l3XbBjHWwHjtnrOeDDcS6e%2BbCyr%2FAwgUEAAaDDYzNzQyMzE4MzgwNSIMuMPSLsVV7vRYnErCKtwDLrB8YHKnVdhuf6mxYSxv3Y2XYyTuNqXqvD7O4gMqsEDjY2X7%2B3so%2FiLiIvkO6HorDYc%2FUjgkOpcTp0BnfAeDefWwLMa%2BdwBE%2BgiLQBTBPSDwWPVQ70rjxcmobdhDmVg%2BF6LQowFYNsg6cgV6%2BdNY0hFHnpjPxnsih%2Bqk42uT%2F%2BDITmi2yhWPIzuiUtm7cPruqn5XRnXcCM3p2%2Fc3aFJhQrx7hS7Mz1diuaDUp%2FfHx2zQt24mK5ktjk0xl0oGacn9Wt2djNA%2B69eijQrqMCXtcHeuSaux7kVL6NgRcaNyNAE%2BzbaTFtp0xKX06sWbTsYjxOnDTdE4I3tyhv8CpIG6p4wOzn7ffgi%2BqC6R%2B1%2Ft9VgUq0pNxNl061AHCC6gP36%2BSTt45MmJy7XadliRHGkTFnvM6HTxg2P%2FzoL6%2ByLtAILeakVj44IHHTWoty6LWfTrM6hlzMPhUvZE%2BP3XYDR6Ac5VHDLSVeWVkFnYWBk3vfgRqj12hCzq0L%2BhXyjYWDf7hVAdVg%2BF7V72MLkvGI01jAbCKToZQrLnWqO3f%2Bo0c0npOjj6IXm%2Bsdvp0RJwu74X4GYRzL26UJnGQV5DAqamJM4cOZ6OXHcEbSWD2rDYB%2B%2Fkck5BXF8eAHmGKxUw%2B8ftzQY6pgE5brFV0eqxp93ZuOIFZXaGgjo1cLpeBUXBeLRzWSNeWjy7ZLYXiKUmxbkH2Y2a8Cc%2F6dsmN8kvS9X%2FLxyQ432TnOG6nnDNivPAGLvZ8i9ECa2lCqrUPs9ZAPHmILDZdb0yh9BQlNrDZR%2BJ%2BLg%2FW6E53czczjd%2FVmTvspCcBcoHl32kEJW785l%2BE4oYPAOFpisVo7GPWZCXnpfliR36sdj2ooIzqkmf&X-Amz-Signature=ec07eec7cdb926576cae9dd2643c532351fa45b5f1afae7595e06ec83eb95f9a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032158Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=34742151f4107b61f0ae3adb850a58ed502045cde6f7130cddd9aebcd2e978cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3YDR6RC%2F20260319%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260319T032158Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIHPKy4Z6xHT8vQldwrZJEquE770UllpuQqJdw4brJcuzAiEA4OMsOojOAd3oVRsuH0FXXhrFvS0DH0IzteZa2M8O3eUq%2FwMIFBAAGgw2Mzc0MjMxODM4MDUiDNWzpoqB2A1S9E%2B7vyrcA2FCnr1fDBhQl%2BZt4sRDf8pwBzE1u%2BQQRqEg%2BgheknvZI2BIcix23epxM8AjX9iQrGe37GVT3AWQfEpb6KOfB28BN2quQ%2F%2BZeTFlrL6F5wOadPIxLQjduFECFvsX%2FWdvvRAcYxHvtlZr8LBRQ%2Bf%2BLkoxPNeptehj4edCKCRQAWNRxkPQmHM3lRysrf1CtQ6FF%2B8NIwLit54D6Pg%2B0w7td1R83JvdY1bGhNhQl4JP38jYPSNXVlRqksKbYOOJh1%2BaLfC7SfL8t7vEbtWes1SaPkhuxFk9xqFd8tNYnI1DP%2BktwaqInkT0ueQgnJTyZcqKBoe7a4oibEChZuO9jbscsVMMlWZI7uJlhfURHiMHLtJYMUe515pOrjJs%2BxD%2F0dPEXsN6kTFEAc5H3amRemLqSUhoVG9pZa76ar%2BnTl2peV6C%2FM1f1Cm%2FOyG4opgepQov8lLq78dEZu%2BRbtkvT4%2BdaSeIqTMPx3zTHpYSat9hA0BsoJucwvZFT%2F1VLfQpVjzF36oyHkyaoTYJtIVzxpA6OTUG7CSn1QM1M7VJnf91V99Y%2B%2F8eVwMiMaqvcq%2FdlFLhW1ZhobI1OxIB2uGXgW3ty1Nt8Ve5Dl6FtR9Fo8j0LHOlrHpdFb7bEVUlmf9wMMHH7c0GOqUBTpmQIbD02z2vqqh80wRjskAF609t98P4NKej4CwcEypHWFzUDa%2FQ3%2FwmcX%2BC0KWv%2BZKQNnWqhKwTspsP8%2FsSt2kKJC8qTGDpKRRs0mfaH519dkmx7cq%2FJqQ7PYlYSjCt1BKeEj3Ut7u7YXDYG%2BKpLvyd3iwX7uRYdvcmgi08or6CmC%2FAMxMAUd7XDsSHcI3iQ6J87ZuCQ9QX0%2FK%2BAL%2FQ3JqDTEut&X-Amz-Signature=710fe01ca09d10e8a0ff50b918465938c529f00bbde4042323549bdb19f65a1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

