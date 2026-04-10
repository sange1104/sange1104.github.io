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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=70ca0e45a3730e6072da65e637c4e522ce82bb005f2bcd3d85ff5e0f2b506bbb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=4b5741465ca9af1f9273c01f80f6f39a7e5dd0d26d7337433a623f09eee4b55a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=47d88f6349011c32f1bd25dd86dc7cd7f1d2b85912d37b61435e9c9d166a5d2b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=f4587f5e0cab50b88cb25f3b72070216ce8a703c7d5511029ffacbecd65ef91f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663U4VLBUO%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCICwxUEi4VoPBSK8W1Ma3P4mhGPi%2Bdlme5D6uyeVXcc%2BYAiAMX1euAHABKas1k1TSxiEp4QI5pDRpQXKjmqud4q2%2BqSr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMU419abff3PmamHZmKtwDlTAiKsewmHXR7OiUll091XQWne%2BFb7GLo7Lh0CLxx30u7yTpP2vtfyQS3UUa7SB77yeDumwsCnLHAvbBFJsdUAy8%2BSB0tCRrzv8WLuxQTgXhkSfdfzgCKz6uiqDTrnJFnUsG6ZIAZ4jcCXbGaTGLKpaYHCCLxxHg%2B7A6pvrFTcXz95%2B5LnWKbbTVEJYpWP3Plg9J%2F2JzrmOHsSQMLSB8NK42nUeOAwipQo5jlC%2FgSCKkjiI70wZ551JDuEnz3WbVdoBtlgVhlfVb%2F2aLh3GhmXfa7kyJPEqVn9pTXmisjkWbrCI0ydY9yGDLiEAAEXmBrsglCAlUv3hSHKZzh2LTlawcx8vg69M8qUT6AH5SYQH%2FJRA9MwDNgD%2FBdQZ%2B9XkSg1%2FSdpHB%2BNyoRNSJAebwM%2BZI8la4TTw%2BDD5ZKG709IjBqmPzeV%2Bho53o2FvenBcShs8yK9xBAjmxoGqKCfZcKUO6SJhGTmUGzfN6iyoNHzfOq79K4ZGrkqYjWEiTCgQHltWnLqr7M5BX8j7MeGLgHB17D4uQ9FxyW7ZFObFI47HWS4WtTYnBmM%2BjKasMR%2FD7NdaEYzUthiTEfr%2BUNKjZ1B%2B%2BIbIimMeGJskriD5S6MfZdTjzCE681TW42h4wq8fhzgY6pgFwHn3NHHI8gfsG36vEKsrCy7ZVUUBcC8qs86SqdyVOTkj8AtXyXTsqmIMyA8tTGgTOhVrgTDdVxGjSEcDcwtHwqY3X%2FGuMZaEvo%2FoJQTPnfX0sa6X98SEPeIiVoDJFdfDitQcLV8GdsfoXJ8afNpOhhQ6TafqGY%2FgHkfKu1CanJ%2FV9WRDuARgA9sihJDbXHfdHEFqh8GwCAWmNfoJfXiMPiUD%2BQNSB&X-Amz-Signature=b67bfe876a11f5b4ee0fbec3eecddddc76219cdc9a6d48699d105a56ba407f0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466STZPWBG2%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034255Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIGxNTkp4qMn%2F00WzzBOZWhLaYpCjNt4DwR46imkG8UdIAiB2gJF65xu4UCNN9DUVjPVAPJ8ex3BmnCszAlCZ%2BGrenCr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIM8cpYEs%2FnOhQVVz9MKtwDMaquX%2FxAJI%2BX%2FoeWZepQhsGM3hsT7Bjt4NIWZxPnvCuZoodneSkWJb%2BgOxBd0pYElgEFv9tXttRIEXvq1SjCMT5b4zgufTxCHVCprIAaakqOELrohHyuR68Y0%2Fy9o1bqgjvpwCfU%2BKZC5BBL6Yk2ga%2FlOf1y8Bzs9iEqT3JQRnZveaRuROPSW9pbIolI6XXqRT6WzxxS48MQvd16Bg7fZw7hL8xfQ8NGAuUdfv3VDkN73ZgIhMQYE3siQArJk23A0uYzMTZG8acwaijTX93qcyNOdfxMNb197PBUyjhLK0K1IeaTdZWcohr%2FXZRB56yE3SZD7K8RXXMJ3PWn%2BTZmWDu8YSrwOwK7fJe1z1pmNInmJCcqRY5oOqk7H%2BDbbYsH5JEaU2e0loUw0t8UqhnX%2BujKclhIX7et%2FOds7SEvHJJ5E%2BquKK62jvYAFaMhHsNEpGgY9rILz2qCG7DkaTyj55GijXTB5hkC%2FKPxpfH5jWWizrkzYX1JzLLiGyyk51n6r1v49SgPKA6LoPhgzaCeIqb1eG1RVfjM7enFM3PXuS7xbLYCQxEWUSyintfHiyLn09KaNG%2Fn9YrSmkzOuc7UYrnUkbXhCsiTRmwBvuoHl9Io4Ncpy61glk%2BG838wgMXhzgY6pgFfxxsVU5QNsvlxOIQ%2B1rCxz4zgqQ1HcCUBVratl%2BerjOL2x4BCHYgqioZhWYC2Li69l4O9z6pP3wi3dtIjiEtDSDJufxUKnLCCLurn3ajZRux7SLy1A6bp4bh9G0oA8EWO%2BQvdZmWG5bp3EIkFBeT2ipS5jMOSoU8Zsr8LB6GuQrC07i0ucREc4QZmhhQezGYbjCmWiZcunr9EWjkETM8jmFKeWCCM&X-Amz-Signature=b5e135ecab3bdcbef2740d42b174dd743059a64fc5071107cace17c9af911248&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667E4C6L22%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034257Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIDZqowHZ6JttDjtuwIpAmzZNwLdqqnRaFB7P%2B09sMbn%2BAiA59UdcVxgDacSb2r%2B%2FpM%2BRpH1SE2xRae3B3%2BNJVZZVfSr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMiSWkfYJUj93im2GiKtwDgsDXusqH7tPRsqWox5o1tE5GDamFza3tSzutVGC0zVU3LFxb%2F%2F4t1YzJTyw131zWoDQfZMKDpBZ42%2BvzGxAwHXpHywUgODJXFaL3mCniefuVVLf5XP140pDmXU4ugMU%2BLTKg4SqG98sSc8lgkZjhOf2%2Bjs9YUaSaRz9vPdulrB0t%2B%2BR4tJclMA8dMD%2BSC2PpufrSJZkljrvBAh14GlgOsvwsd4bWRYJ3UHEHwvJ5Cnj6mFIijgJRYNICsLRRP8pZjrDYI5e%2F%2B758QleS4bz8nPAdQGj%2F9GoZeaUTmU3CnA%2FDx5uTjiIHSCpW94LqcJVS4m1O3aNthXV3CO9CZcu2uNFxtmaS7i%2FDsF6Wh5KweI2oibCMCfTyN0hhYadwlpqE75pU1q5kWOodRRGoo4XgjlXckK95Mrxdoj3FgcCujxXQsIhk3OmO%2BPKSfki20zUb6qat8IjkMMJfMIHe3fhlshNpTba1DW53dRiYUcsx6MzYfrsLRAD0O52P1BRbF5mG8saOsTWzphKDan%2FC3ysOQrfZwcAFayVNKdcgZOJ4dnq7MaAKIYcEaIE%2BSs10wZNyI4ZDuWgb9vHMbSKy92OfRhOvlH9BkjU4CGucx3CoU2QFipYsAMBqF1bH0vEwj8ThzgY6pgEHGUXxq64LcoWUMn%2FnVu6gdfDSKx7wU%2FHstKyAuWuKHdZ1WXmls5DaORQT98E60ZrrF0l4tbQwj1XS5CHNnUxcsQTxPoubxBzig6TZ13tJL3PJDbIegSjfqnC6vXsuFHP7kRxG7SwkHBtF4rwlo69kC5%2FjRhNyjMqH%2FIKLS74AcLoRW%2B%2BMkYM8ADWPwoQi06mEP1aXZxuJy4p9nsfkB41KNfUOn%2F4w&X-Amz-Signature=aa6e02934a2fb927bffb0b77d4f6aebf5b2cf9c995e92ec1e740b058b57ca50f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634T3ZAED%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034258Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDt6jOA%2FS1jW7yum%2F60z3fiqEvNDMsdEXO64x9IHXnh7wIgHR8V2%2FVKrLqkcDVqGq2xLQyO3SAlIsOCn0fzkmAdwlUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDKdZh%2Fu3ruMW2TtpyircA4IJu26brgGClWytrxObW3itSyRDJ3mktaHO75SftgTwVswPHqK3mlHn2lWbQMz93OLWAkiKjQfR6rrUiJLLJZ%2FJ%2FEj6LaEjN02tk9I8FHveEusObUlELz9iriy2q9Tqu3yLbuJnzmAmDpTB339ZloQ6vHDGtc%2FKH539Wimj8RCgQnzi7rzb7%2B4J7XdMXoyz%2BcxNf4vgXV9P4UZal0Phpl66c3aKBJ2fx3voZk0RaY6B7mxZcnMWhWRgdkwDMKooiPl03as9d2j2q6ITDAIpKgRYmips%2FkiZIMlD%2F%2BsiyS5TnKm%2BGGT3RSoTP3Ba424mHyIIkPS3FXvCNcc0JbEZEIhsKdcUuFyID%2FHexkHWdnyXTSkiS6%2BM7HdEcCrE9vlVJ7Sp6HmOBDN4pvN1FoIUPTBMDAklcoF9Uw2mfSBU6DR7pa4FZQ4A5m01U7%2BzBINJrWsD1VxvH6rBtsGGlSpI%2F7k5YOp0RDuoz7ytAZueaaYrh%2BDd4PMQj2%2FisSEGmpj3rqM1SgegaOJW3FnSXPFiMfbpNajs%2FngfdrOl%2FQAWEJOTWRLq5jIZYVu3I8NPulzHMuZCaV2lQ00IZwfU%2BMWXMyuQt69Qm7xErLsCrxTDN774AfpU3%2BoZ9FliigxBMLvG4c4GOqUBTtXJ0ptMgYAvJbegh9GvlUixe0YTGY6ia4R3D0p7VaLJ1SRp68YuiDfKLOca%2F5WsP7O0IdZTg9JE%2Fc80HRrWsCO8pFgfuktH3fUI6mZcCakJuNe939ci5uJxkXmZHYQazJn1yuwmUS1k045VK4WMqA%2BWyVZnSmtMJj%2BCNojEw%2FAfaBwl18SIdXawMJI%2BP5X6vM1ce3chIbBeKjQ%2F3Ud8R2XpDh%2FB&X-Amz-Signature=239c7b54da27836fc5843b995628f4446add69dce3fb2b3fc4ebe73c87804ac1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=f84c52a1e81ff1b348ff5627beb9fc8b1837e0e64457b54da1d5f540018b2f96&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=fc2670fcf8efeec7e0b916db52b13c172cba07f04fa08c3aa1428c53fd4d28ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FBWOBTU%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034313Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCxmUJrsdDOrUIdcUvLVp6sxowwHIe6wl1h6KVRTCmRwwIgBD2%2BH9yzOYhzpwp6uXdyEgA0LbeILLu77Xs760mKQcwq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDAlscBSigANLhuKfJyrcA9gMzHz7Y2AJAbBOX9DFALM8NWSx2w5JXNBSwjJD7mTL3pwB%2FzNsAah81Spe3bn2cBF5gRMaoR6LUyDNz%2FulD2n7mGsGIk5EuaP%2BZbe9R0KU%2Fbi4cl%2BVDyY2MXXk5smjgM%2F%2Baw1gP6iiFBp3CLtudcxN7h%2FY%2FjnUeZt860zgk7AwEjaf8qvh1WLd2vM%2FHRMxxEmHDpZe3eJTGV%2Bm0Pa6%2BlYt%2F1CMgv17PXiQBNsaarHwCzg8jnIshwxfYCIc6JEJVwc%2BKJNez1A4Zs%2BFGnwXbX%2FvL6ipWr%2B2SPRVjr2y2xKs4Rk2KPzSY1uB0hjU7%2BZ5q3hQO0hEVHPlBa46OEAaQWc%2F39imgRfVGX9YttXdCcAdFFvtqmPYmsND0maHSyZYn0sL91Ly1qSCQkU%2BcCn9GlupJpgMNIsFSw7bqvMMoiqbkn0R7QfvAmLh796kF4d3aLGb20CSCaRXxh5aHQKq8riOCES2DPhjspeG6TRtaPaB%2Bs6jCuteVwKX%2Ff8ziU7F19oWq5jI6c9%2FXlW1wFGI73p46M2nQXKBySXw3eqvFNtIJDBSFVOWNTCCC3D9MJ7wo5DpWnorOygVch%2BvO2joZeKNbL95DRRQghUu0DOgLff6IejFoCbyKgL7TYn1MKLH4c4GOqUBGTK1PbhbbkX6uqTP1H5kjlV24ozqxoqV6W920drbzEfdjmLgXSLCukMH6GrbKgcLrJuCd2i0WKyL4%2FY5Q%2BwJRRkQ5Qe4%2B2dX%2BUnMF%2BGK3AQNJBPtIep0F9Ov9YpdcvTrhMaVDbtl4cmo4Bnl3dKwo8cJabyzP0hFuy8WTUByNyUwsQBV7Iysfib289xnxK9LWvl1nZZ2Q6Pi8bGUiHlNJmkUz0NY&X-Amz-Signature=a20cbc511c0cfa9e7c73b8cab08c04fd4b394d38437d9ec0f508d488f45db74d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=7dc338aee7735f1f0480e6187ec9e46472fc80e95f06dec2a1fadbb245d13878&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663KQ5LIZN%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034313Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIH1nZqrA85b9jH7kmBHZt2ilwKuIdfayOFHnmveDZpFVAiEAzumVcBjb2%2Bu%2F4XnNy%2BfXiesK2yp7oNqi7e30LUYPp6Aq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDC09zwlRnq2CM7xz6SrcAzuODzJ814F3UOcpb8jEOrc7q5mYXEEKVzpBOLssrd8Zg82285GJbW%2FRtLtF02kVlmh1UEsc0vGelc3fMUFpzWjmiyQGEdNvaSA5Hd8GWxan%2F45jktN8smdSzNHIAAj7Ef1C6QeYTnCXcnQbhIClQUBibFRqCglsKZavExfJjuzhbQVpmVV8wlg6ni%2BmRPa645pb6%2FJ%2F7oC1VPJoNPii02Eo2GXQ6Z0vtrCvHhR%2FwrIvVhKvTqW8cMS%2FdFiMs45I0UfVALWbx3%2Bl1KUZzvsjkdQBfpqHNchJTMcanSLetYjyGyKPH3hj%2FFXX%2BfY9HnbjXRbOWcUH6liB9nTTaukMACneJkJVbyvat8WmjCdDrDYwHSW4Cm3kQr629ylzqwpgutEzuXjBxYP4GZFX8Wj6Rk%2Fd450NbqZcKWSUU3EnRJnNLGUrirObMQTXboeBMjWZGyFdhoTi1bP3nrrjoVAW3bCl3ii98ESQd9A4JNazxxrPtb536UHmXQNF4AYSRRO8b6Fge6R%2BYXtztS%2BSmTJoVll%2B4X9pt2RIn5hdKOXuNojf0TU%2BEmSuRUxwQLF9YMdMrrF6xQImz%2FbP9LH0KOVnuPkJxoqoy8tETFsYqO3%2Bmxx4wm2llxDOefGbZyfNMPvF4c4GOqUBl9mkPmzNmWmenw6wRcC73cBJxuedk%2BLjbc5kRoWH%2FIV2%2B5UdjAQZQ75DQGDBhtDTW6BlC2EXt1e3cmllQB9hscjpvmfCKm2KIj4f0t1jrSmxlH8q1i7T7vYVpzkV04pjq2u7W3shu3xQv0Nqb3772oQeFHTEBFhvvoCcE8N%2FOOac9dkoRBocB3S7DfPyIIQ8FckACuUVhvEHwJRDXRkUECPgUb32&X-Amz-Signature=7a92556c06661500dfc6f6fc4a9e74eb720fc4cbcbdd45d75cb8031cf2e7a4cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WCFP26S6%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034314Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIECCkhJ2npBT00J%2FBvZErN%2FUT%2BFskisSPCx%2B7hj6QerFAiEA2RPPE5hKBlvkpIbQelyIF7tZNcEC5arlozVVCxZj1R8q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDDFXUGPFzVi8SobsYyrcA6WfSFkbSyAfrPKAl7DPJFoA1iovrcfGBqH2c3iNZYq1xzr36YA81kPIWjfh8ebwfuycjT7tLz6lTDIkg2ik9eMbfc3%2FHap8eCXuzNx%2FOi8yS0Nv7lsnH0FBkqv7MVLrsKMe%2FXkknj1Gl5TCO%2BqaXzMuQVaSpj%2FYmoRijZFzWDfmF76Oo0yL7%2F6FCT%2BETPULYwrBs96BY22UK523XQbkPKPwfx%2FABB9I2r2xJRoq6w3ilya7PILCTEec04vx1s04Bs0TB3Izz4h6epjZBBytuadWFZS87J3U5OL7gOv3U2L%2FaDKU9bzEcfLszJAefSHkt7Vk6b8go%2FraUzpS2lviRt%2BpzgzBaRWkypxNPIaOECYPniR%2BtwikAK9gZ6GOHFrVl8R%2FXhYYmw3JF5L9P%2FKUN61QrgtpyhVEB2gyeKSY53J0sAIB1uatdJ3Nq9iPp2Rijo2%2FIjKy2GE9FimuDmObH7BN5LAKFmpKQ1gmo1kWkI1%2B7snuj5rCkqwfUPp8AXKGbrdLM%2FCABFx5svRuop5iKZ%2BfdpLQnZn2cWmgk3IubWeM699n%2BpJQvq1UGtPE6KeCUICof358e1DnO6Kq6Ie3LPSrzNApIrURi7RAvccA9aJtZQ%2F5Ks8dqmOCvboGMJ%2FE4c4GOqUBN7SWNEJvkkET3WdRuPaLUXwcjQcfO9aLZXHbjxUvmFKv%2FhHU2I5OZWToeMk5rMvQHpak%2FykncF8hkC1FG2k%2FWMAeSQUCoHMP7sFbJiJlIoDTpSB0gBfyV3zO5EDydyp4XcQPqz04LRgT61oqQpgovgjAcS4wV%2BxAXEGrW6oQLjnLmBDjUSF7sbA3ih61yAAcsj0hlMmBE5Hk7W7YdzyRqd4LY9Gb&X-Amz-Signature=7814151b715091ee225fee6c19cc69b7987c9c8c07e60ea9eb44e57c942d072b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662QPZKLR5%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQD2%2Fr2QrOChTsh8NnF1ZMJuFDGlQ%2F%2FT79tsTKFeNYpURgIgBvOgIlheRO4031gEylE%2F8nnJhnhG9n7Ki29HLvRSHhMq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDIqqJi9sFf%2FDWnJT%2FyrcAxjVj3%2FOSrf8ATneZpRbgPfnUI5TlTYj4U4qN6OOGfcJlJ4gSg%2F3KQr8xMi%2FnndrdYZVBylc6vbJTPFrlF23EcwavOwdRiL3eATKm1b49gbR8iPh4UZLwuRJlaJRst15E17HZvaTYo3Aksq9bxpIU3QilV%2FF3Kq1aiH3frwdzyrxz40Zsj5m8duGwAg3sVRESJhSFvMjATHrkzJFLNeKBotXBMd%2B8AAI8UXG5VIG%2FvPUMAE6sUGVCT3Vcs32xh37AY5AqYNBfAeRyUvBX0UkyAmQrKkMqPMRfvO%2BMil8L3zUA2j2Y%2FwKKFnoByxDSgc3bhKFgXq0NGvwEjmKd4yufWLUMFf4oG4v2CALJ82%2BI%2F6JagZ9TNcIOkcjiRoJj9O3Vy0fDEpqRNJlQ%2F9LpHEoAie6GR5DC4vc7tZXVGGxPIzj3YXB%2BJ7acFnV7IEpAXB2IWsYs0jYOwJnJaBa%2Ff6r49jmkjGJkb9uufWB70ZMCUbSFyqAU1PyzWg%2Frg9hYiNznQ18ueQQEkG1DYVp%2B7%2Fk%2FMtOFNwzKCENbdt%2B19E77eFgS87w%2FV9wivZrGDPq3us%2Fhs09NFkZ%2FmRpwTsrxjMyVucmjHCON8nU6d1fFJGTjOKwliDJC%2Fpp8J75KcvnMKHH4c4GOqUB3%2BxKK8s9qAGyr8yjrQiDDgBHaiuaYkpIC%2BM7%2BK%2BU%2FAzXVeiMV374pGcc9Dph3bWuWgAWa1LIxVwMTncXlGUUvGo4TjCeY9UqW5VsHgqS8zpw9gU6VWYTOUtdWqa6xBp8ek%2B0pzgxDILV4fSdhHbWZnL5VpwA4IYEftJI2iNUJgZVVFAvKj%2BagwD%2F2TTNDXblUzTqZ57K%2FuXKxpk5%2F1Eyj9Hk7OxR&X-Amz-Signature=898d85e5fb143fc528d719a53f3ed2a0ec25398cf31ecaa8f8c6502816f435b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46677FUW5TD%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIFJpP%2BizGf9J6wg0bQNKGT93WsxoygGzhBkgmugLOcmRAiAU0t0wf6LsfP8QKdQPpFh94lTBIoJZJNkiHrsKkaf6USr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMQ0QiT7i4LOWv024ZKtwD6HLPejN%2FUxHTfwfAj4Rv8%2BbRHWNLilGuB7OdEzNrBLS%2F3AjxYJ%2FPjKv%2BtE3uFBXYJNO8znfm7p6Iy%2F6eApxxhe1Q%2BhCa115uOQWG%2F3FyMeV9McfNwar%2FR9tMS9WTviX7lKJjCoAZgNLS6SKLo8pnQi4jeINtwBlU4yPWAIfQaVOD1PFRGYcdbBTQfvyRK7SIgFK3Zbr2BLfg7DR1ZIO5w59y%2B0Rp2yo6Qsrhxky%2B6U2%2Bh3FfXhadoh6MVhN5Cy3fstQilvq%2BeRKHw2GhvNXmkJ52fH2U7xo2nauQwcG7Avv3UPIGj%2BDMuK%2BU73FZEkZ65P2E1ac6IFRGbDD4qjwk3%2FHUkNaeCQDm9opcOEmRQQX%2FsjVMfHxWxOSj9%2FjMbah%2BgkzcnVyGKDz2CoUys14kqEiEzuw6iiQ19q4Fc%2FhPANpOCthgwq%2FYTs%2Bv%2BcT7SaeMyz2Pk44d2Flvux5qEvjeIAMXl%2BD9%2FVOPXFH7EgltDZ70KSK5IVczXAEPCI96T1VrW%2BkMUDmyDwVrLQ8uMSqBadTmju6egaD58bLJhtJJJ6oLbJoFWoa8iE0yMMwyHuOTc3KThkpjhZIjZ2E7ukl4uRxr9vOoQXQ8bP68RZ2GJZOyDr7yNwtXhzLtUjgwqsThzgY6pgE9XGPErb17PKkCTxHFZsR%2F1QfVyKdqqmEUskyjFOooFPTanB4DWMXVHN2otmqQkYr4VfWnLgBdNXgR4U60f1zU6aTDzzugC6eeI2RrPTKSi5cidvuEZdPE6YkpicQnaCWbWA98mczjLdBx8uDFr4CnaxrUmCeHoa%2FkRYs6sX3W9noMqkMKHYYnmUAcG5pY2lwPf%2FHv3qy3PXlOg5qqO7hyWuswKq9D&X-Amz-Signature=e29e32e487a6dd2a727c53a8803181567653d2dd2faccdeaf81fc77c11bc1b01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=d5218643fe9466fc6f1bb7fdcda8ff89f6b57462667d42506b9139b2b6c487ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKVJDBKC%2F20260410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260410T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCd2o170wCkEp5tgBQQq6qxRqRNcCE2RnmGb1LP%2BOk3JwIhAIbN6MfVMJTa%2FnjVfTLyDgSzBeQbp76fIJu6c3dQ8WHGKv8DCCQQABoMNjM3NDIzMTgzODA1IgzMIRggf2po%2B5qj6ZEq3AOO555441hEqe5hrDmxkJMpatgc9oMcJ5NaO4BGILqX6tU72plpdJk5cmLReL8GCXVJ4kOeq7imlcero6K2wR6K3T%2BzAPrMnEWIfennlmoTe0qmqReWAkO1%2FMYHwdpkgiDM4vxRuxf2En5OykROUtgE8XL7lGlOZ6igQJq8u61yP9gtdCGsjxKwtScxzWJlqGSzHqHP8zoTq74aUExg%2BjAp%2FVnXvcsTX0og64gZb2W4oy9gnr06uU3w4mul5JvzCCQtRriqtPr%2BaV36seLbJsB6IBz7ag9eqMLqq%2BlUvpygDounW7ySxt8mQ5hJ1Zo2egzPqQpaOWvpYwJ2bG4s003Rjaa%2FFPfJNkTyO4b0V3u19f%2B2uiK73p650BicpDbYeJiujh8oTSEh7IYrpSMwH9e3Kxl2KY0zaAgFPNv%2FnmtSN9Aq5rdxwucojLDyguXKUpVl3oyyokydbf%2BAXaXUnoxYxoNJxmr%2Bsonfwpk7tTjBxHwJPR4mivx1RJ%2F87cEPAJfpN5rzvZtw4TiKybJC8WpW%2Bv2gfgPcx72ZXwUvSHGlbmvgDuJr%2FBB5WsZRfiNqaZUf%2BV4LPEWdO514PBwIyyIw77vLEPmFYmqHB6W7Ph1pob7SfzY3rb7X55T4fjDpxuHOBjqkAajQUWEQz04qfXkws6vIizkF695BM28Q4teGCCQQ3ztBryLFgEO2tS4o1DFe4O7PVqvUj6lE2sIPcbDlR5HEApcNYUcQ7%2B1ezZBTioAlQkV41LgReilItF2B2FYWFYCSzyi4%2FF8qoKK%2F9oajZHmVJPrPjDIqKCeBLLS2vIIMU6aP95JdRHtoq1Hzlf742SKhQMTZz5xwd6ITYyTv6RRLSmz7X4R2&X-Amz-Signature=4ab8b1b51cd0e00c28d9b340c4fa8ef60ddff40f3dbcc85706561fd07d22a5ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

