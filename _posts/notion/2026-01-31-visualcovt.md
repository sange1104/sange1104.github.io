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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=05e25bd0db7371aab2b2311d219e5a80688dee5ca4925068c96f716b759fa5aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=e0f9b3cdf3e2b8d1dc323b83465f09274836fcda9b7e7434e56ea9fe5e0789ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=392f8f9618cb4d159c906ef59a24f1d3ec6d83ea6d42ca6ec07e2268a0cf0f12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=7a9d9d50e6d4705196454d6f35516b286b1f1ae4dd8729218485d15b5ba30927&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V7FAZDUX%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJGMEQCIGpmexBsCkY1Z9hwcZAiFfcZ0Oas7owHoHnbq8%2BDQjLdAiArhd22%2F3u%2B8T63fqdkNXxObkywqfHu4Bifsb%2FbIRGQZyqIBAjK%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMPg9ISYU0tw7MY8%2BUKtwDpIQ1Kw%2Bu8vtExpsvTJSJZQRlmN2yCJhtrxmwiy1ufCSJysBL0Q8V1g8M%2BCsCJ8i93VANpQgn3DVL0cVd%2ByZDItT34%2F0ESDgoCjTYvFy2x0aSaJCkU7XQDG5WkCpsUftkJqXDnodWImlYoRwJv9%2FjQzNPxGQYQCU%2BtL3oOusnx8EsIuoXTJ0xNV47mBpOnnnc%2FGAHv5iEulADfExfcBfcGW%2F%2B%2BV%2Fgn7TVqVwV%2Bcghnx9tRy0QNHQjxGEf50PBn1M5VnVS219ko57yxaRSWpYBHgEYOaJP3Rpy2W6Fq7rHs4Vzr%2B0ZAYRQFHyf%2F3KXFXu5uANrrLsYBI9zje50Z%2BiWJ70PW5LlozKm4YlWVrt2F9fVZRtM4nB7cOkZHjiO90lN%2BTO7PLaqIRZOSd5go3na22Imw4YtqQ14vMq4cO5RLFrqbX3vmXMtEkeX6zOPMscupxGhsSi1v1XWfqY%2FQwTBmsYWvqo%2FdiiqsIXMqgt3FS2hBVyMDbtPhD8%2BwGblPPMtMtnn6NQh1rMvG7KfEzU9UsxZw3me7jwX8Ggh5NU6eRPMGMuTxMDUEGO7g%2BOt35WHeASKB5tLvJ9PHRCA6xAj4IorYYielGvrDdW3L7xVbn%2Bm9G%2FgZh33wTncpW8wt860zAY6pgFfEFpMNBaE5HFQD4Tp5HpgFBGfk6qnwl9OMJxCYhCiq12h9bNjVMhq7V7JPZcriDLoZIEAEhlx5L2dktR47b1Y6eQBZ1Q0jA8xAIQ8rigkD4g4sl%2Be%2FAlWKOZREDyaacLred%2BgHUgF%2Bg%2FTewQgGnzK0DnnzUtiz1rHjLY4fKuwV2nO5zeryrtnvDlIg%2FcR%2BYp3WOzeg65IOel2C7Va7Mc2ReCBwDAx&X-Amz-Signature=6992813fcb3bc9b22aef9528d8cb24367d0f1a68bca0731c242592220d95da2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ZIMOHVS%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJGMEQCIAIOH7A3EoABFTw49wjQcpN4gwwPxUw70j1radKE9b8pAiAkXjXNRAKd%2BVGit0pOy6QDBLu0V8HtifZMqTW7GSvXFyqIBAjK%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzPSHj4urWQtY7A1wKtwDbipnJ4UTeodlryMXJrIJW31acPmLO5288xEH56C0YJ%2FwfYT6XBWBnYSRgHsMtEsXGBtJcWhxhHxDCVdQsWzJ62tCER16a2yCcp0Mb%2B43rt%2Bk%2F%2BOQhk1BlAeImMghgH1pq9RSmW4v9QAKiawnDGkcrvJE7bdbvT8SNLVU4u5hAsu206nnq2FQEBYr124UH26Obod10zJeZTKKmMd%2FaVO1RhYchJi%2BbvGI9XluU1WCqZyN2NyXBpScoZeJ5BZJqs%2BqzVMt1udTTu2TqlaJm%2Bohy9VQn8OE15HpZbSnxx0w1Ge%2BFg15dO%2BMGFZYwroEkIlmh3tDwm8osL6b%2F0Qi%2F4NndiyUgEH7hCGxgzenVxWwZFgUODgH6d8F%2B%2B5eK4KoLYST9%2BaUowzXditDoMesHgWniP6veJVeZo3sNDAkJE10pVRscHHG6tPPa3HV%2BrlIUu5rc7ruY0FqEx6cbsnqK14F0IyBOQhN8ycPWCn8LvDAxyQzGP9aYD2Plzv5QxqkjkEKgqgl5a4jom192MrGKI26okU%2FlDTjN86PVDSYvPwy6%2B5ZqPILiJtgacz2DjhRDYbCbmEBu8yOTpqPS0Uf5gQAjkYFT8e7SErHQ%2FVN3v37rq6rGRV%2Fn%2FfSohKov1Mw58u0zAY6pgHLfxXBDlWZ0IhevkcgUzHGF8%2BLKjClKpaLfuWrqzie%2BsPaAHGamWTiYoP0M7lk1PhEPGchHhRBthwkTRrLRC6CveUYOqgDI4Lu6a4hFhLW07I1dRHbjh1IrhNFTVkdjACk9tWrFBHioLZRw3DE6m1IrZSo2Sxj9btG5600rTEw8EVVo1RiqQLb2kuLd4SekOiE9hMzeFH7wz37IB%2BcnuJHIvz7Oa6x&X-Amz-Signature=bd315b11e1045d9e2805edd258330eae37d30f34001f047210bf410cb3a15d01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666R34EZT4%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJIMEYCIQCpXuzMqcxCLXWwUxqd8xFLcMSlgTrRjv9btHs1msK1dQIhALuJEnLdIUgZkynHYWKN425F9zE7kOkhbr5HTanvqciFKogECMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyk6zqHy59xRIEgGrsq3AM2yNpwq58Bu9ve4qoZJ%2FxGLA5h4FPH6iQUDKrEFJDld9e9hd5qQ5gORzodPCdXsvUIUk5%2BORCS9avLyu66LoYgCzreCLxzY6jSARF4bZBu%2F3tR3hC5Wjkd4xB2K%2FnE6MxCa0fcJKDFH3xPaw3i9WGBaZ8o1f6DnLmz3CVTNcHWmC%2Bo7P1tFAn%2BJlC9frRxLx2NiNMbmOpi%2F151CUcJGHwIBb%2B9Tkc8X0LVwa9bGcPvgtWYvKvBVoPFAWVrA47qKKDFixck0XG1NYLDOSsfYJwzgaFzMkhg%2BI4NPaY18yaeA8K8CITBnLWmZYNJLlinbdxOIcNWNp5vtLBI3mMEC5ALzBC%2BbXz%2B%2FQrblcZvcHcayQMcbYRpLyFCmNbyhcjO2Dxn8eDzV3x2CZXCFlqGDZ3%2B51z%2FsoftGJZDjytPGeUPvLnTetPoLjJ1gVFD%2FWc84QIyhCHgyxxeIhmRfKv3TjBWmWPdkx5Hy9GrivpQBBAkfB%2F498jm1sGrayATazcpR29DfHSyIR6x4EDwzfujKJxHDT0FR6iDYoaIhqvtXd4uLuWjx523koXQrq8v3rEIORo9tR4ORRW7pav5I0TDH6WrMohyIxITTeqJayWhhzmk5p0EDhizLKtzqGyIAzD10rTMBjqkAd0U8oXof9yQngAjGQvfQMupbrfs9XR2KX5H4sIbpcjvCyR9OdyOHcwXUCErdar01RnRzrnHeooJf5XtGaSYfK0Iot5zWGZuA1WV%2BgCB97sfM5Zahr%2BKoPtRAJrr4IKSBvR1i%2BnhGG%2FKTnZ9t7fEuigDYJLnpWSNggiC75t8Pl5z7NiHRralwJ05TgGbUyeVSDXtkc4B1uEqbVuJEYvpu9WM1m%2BJ&X-Amz-Signature=fd62d36cf2096d673d9fa63925a0bf927b3f38d240c73bebd68756162f806db8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URM7WAP7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032129Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJIMEYCIQDwcKAV0Ze6BH7fAOLAAoa4ERUZHCtsuQw974WlIVmyRAIhAK1Ew82ZW%2FSKolG8afO7naIhAVwnZrd01ua637zp5h8aKogECMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwOOWMFR1ZaOCZ77iEq3APin2ZEbrdjFgHrw5zwoybttFDVn%2BsJAT1PIVDrYIFdi10uFsaUijTt7quCuQxEe3ecZMxUl670VSdCm8tTazlsK2ua2CDpwE4hWdFn2l6FDxx2ozU5ZOaQVSze%2BcMBqNaEcr%2Bc2ZMH3%2BpMnstWOfEfCZoUScTk5eutX11FOEjYAvJc6%2BNFBddBJhGUC%2ByPDCo0p%2Be7wpKIMsCXX%2BZIVuZLVDQTW%2B1jyMyTol%2B5VovODUUi62sNEtjlUIj%2FlNq37yQkmNA9pRh5mpCYGLppINAX%2B%2B8xvk5r7e1WVzfp0QJq9AF1Wq5NqhemBzGhZgVyZoPRvDBj6JsYsDlRLBbjdZ4OrKLqqkVrmaYr3scr1ODzauhUYzFUIriOao18Zt2hPJdURUG3MIK7T67iTFiywK8XmM7FbwRQySiXWVthZukAktTVsopFEOa9QGjMnTz186EeIxYhTdPWj%2B%2BDLKocqVSbxNw7FK7pDoqiabpR3%2BRMyd%2FQCpUegfgI0wMigR9z1uSBxDASIL0i1kjNjraCNrLX9QYfTXhPBvB4nax3KjBOjx7DMAWEht6mNlYkgqHvDkX4zJKJUS%2F4SyEOI3duTvkO78z9F7w0YUIyNEbAnPTG8ZWnb9hQO7SxKS%2FNmzCY07TMBjqkAQawC14%2BVWq8MXajV595tmRbJpl2UTekUwukM2tc24xwtseBrKFKjURo4%2Fo1MP915zgcfxkWDA6%2F3FZfJVj%2BZehfdOF1%2B8nzsIG%2FTXtVGlQybSXunEXUnyZYt8rmIYtyZ9nPtmTD0u6seJJAFZsRe1kwHC1KyMvSR9tcPDvNsB2mNowresUiurPLqVtVvYlQjBXGEdbpcPg0KNx19d%2BrMcqdD0Cj&X-Amz-Signature=3736e530e5312441da39f722074fd7c8f98c629a618f82fc9274eef85309e00c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=2068ba6eae724f701c0d076a8550ec0e203f2d37ada1de85d1b13ef977035e17&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=e30616a4706a56ffc4382b9c7e66ac67c42a8665c65dec8c81da3696d7118b08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFZTJYH6%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032134Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQC4w5DY2awuHEf5uk7bjaLOT3cCWw%2B2fPPWFHR5WTzWLQIgYJo6h8l%2FY06CVc0%2FFrhSPPbomiZlIMZUcuP9zOcZ9coqiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPfJCiHSxjjqVG1V5ircA78QXdOHgB4pfw0G6%2Bz4iMquVO9BBRomlrXRTaTGrmrpfKL%2BGK8ceU7S36K4tU8KEBs%2F%2BbMd%2Fg2%2BYqCv098KTUdjwJ%2FDdrfbyM3fIpZEo5b78KoQ6Oc0%2BHWR8VmwTdRAW17Kn3EllczDtphyEqS9YIdpz07KFcWG52OPlxkJD7%2B9wDE3J78Lb8tSNRJJq0HwKXmklTtBKXZ%2FIUFQH4DrsNoA3KT9UPGhj0085%2FPsbLjJYqNZZiBYyH9wXeHg1QNDh6Ej5GkLaY0%2BIdXjah9x7EA%2B%2FvxR7S0EcFK2xkN7o2lEgcH%2BAs2ASKXzdVUQN0C6GoJgiOowYRyPYhAn%2BvKWz1eSz4f1UXLlBfe1hFNDvp5tVFrnC%2FWJavaA01PmW%2Fu3iDisSCIEQyMBOqca6OdZ3qNUtcK43U6VIReprS9qP1NBSmz6W%2FBxcYMByZ3fj4ttbOLCzoExQCf5jRs%2FeczL0LJXXvNctg%2FlrQrdf%2Bql0ORC6KOghmgVqnFIV0le%2FdlWchdduYFWqO3weLebF7zixgatMhy07AR7AWdXJEKtwH5IfU0Ax8GhZ434LlRh%2BssTU31GXS4axjfv4m%2B%2BxJJE6gtg2QQissthX7CK%2FZgNeTwT%2BPSNmM5SGNn18Ju9MJ%2FMtMwGOqUBskWU%2Fv%2FSajXRRwAPSqw7nWQwZaUTu%2Fpe1wtp4moXE%2Bp%2FVtjud5sJzLuKLi7oBbT4yq4hyyENE8BYxAMzPdjq%2FmAWGHZw4fpTYnJ6uIJEMxYotI81%2F4Tavht7CrofMr1hreTBVFQGe492deTmXdX%2FoeuL6tipWTah2M%2FY0zXDGsPT55vhFZD%2BypZC4Wh7c9T8o%2Ft4OK4JFOOiMVIAE4PwuY8jdTVS&X-Amz-Signature=eedab3a1bb84257715d8c9977bfe2407d05952ce3e3a79031c5d1a554502b0c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=a8a974fcc4207d0c394ff150fb7fc172d2095b5fc6c2b4408aa4c19f802efa63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OPYRKEY%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032134Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJIMEYCIQDRiCJ7JvNha6l5Bn2CzYsvyVusgPZPz6HO%2BbH7D0KeoAIhAIvB3hNJuY%2FFBrGiWoK30cRshFTK1tJmZje%2BCNcAmNsZKogECMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz5QNeYGhGOZdW%2Bltkq3ANZPFhxWsK1B3ynwz6bkflhVchv6tI0W70m9e9ONMJVbyW2egUiZ%2B6IMMecFI5TDiG95kAd%2F4AsOJ61leuXKp%2Fjj1%2BgGD%2BLpF2rRtelDVVACxbDiLgosd6xHssHW%2BFGUOZVtduzr6hhc%2FVD9u0NjXT0TYB13kKyAfrFi4%2Fue7yIcbi94CDleh3Tg%2B7pxRpTe2KX%2BOD6fd%2BQZ8EHWUL3FZb2nDatDBLhf%2BAzuiuA5Xk9XBwtY2gz4SoebqXLbc0X1qfKV22IP8nZwlvlxMFccAIbgr4Y4gFdX0FyDmDKhfbPJDbnv6mLdmQCzpi8uc7vMUXXzazSNh569XfwwuYBDXJPpCTk7BMx89PqFF1orj2ad8GkWlO2s80fXkohRHiPyYIwFh5PH%2BPE%2FuIzlUuzI9rSvJo021M4rhEjtseS0Ol2hza9uJCWfQ0FmQYRClM1%2BZjQqbB%2BW%2B9uaPDgH07FWg5By0b5sZMGStdmA4CXQgTOhm6RFeNOiqKoKzaN1ZSADro%2FCtyn6%2FgKwMtW8m30rHdA833SVYyCNCnNEBRclVOYusDYgaRghw9u6DpjE6rhHMIJqGBK%2Bs832M7FhEdgzL%2FDPbvQabohHv61AUmObMejwO5BM6lvQ52FQG6TIjCuz7TMBjqkAa3frr9aR6nsWH7J7vuo0ekdE6vWuW5MTzIDGsa9a%2Be4%2FRv3nGINjGc2EsQf5SUbxMAD7%2BU3sRS5EZjWB1e2iySwNoQvVIm%2B6o1hUU4SQ8AYW7AL8K9LVC0Yiljy%2FvM5W73DRELELAEllOsavtMMY%2B2x3JGCqe1Two97CZYkQ%2BrzeZrd9RbkueElLI768euuxP%2BOlyH70g0bBTuoVvnuhrlgmEt7&X-Amz-Signature=3371211099befade269c1b5fcfa9ae816a96f20f07755292c3eefb027ddb61c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RRD6WY5K%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIAu9cEnW803pI9V%2F8k%2BZ2ir8G7%2B28Ex6CWKW7YpaG6%2BWAiEA31jio9Hqzw9cQSUQZn2smBRnXLGjubE0B%2BpGPmLW%2FHIqiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNwqxYCH6C6P%2BUW%2B3CrcA2BzTitIDxYYU4F4IKeXBqxjmvcxaLQNlomS6yMPGTd0dqztmFgyQafWOJMt6IcNRvAaESGOrVwo4Pmes%2F9b9hneOdO5MNrNHO6wWUd3TjT%2F72h0nZPrTvv8seoML1MFT039R4rqrMqWgZ6Lk%2B3CJxQPYPxSgVQZ%2FLxQfqOeIC4v%2FE2BsBq4Zz%2B%2FoFnF94bdamCBnNAFxsKIhZH5lV9i5M78%2FWig3OIjb0lV0LtRjRWGfkoS0vdami%2FxSm9DsTg9SDrkbQSFFkRppg31VQbO4c1zpg8mIusmvol%2FikGCMYbqeUiAY%2FJW6UohWg8w%2B7QqOIQaEAexcnWexwym4TlUFMlfiEvIS7kHq%2FRshLzGOtntY%2BNXcYyQcK15T8M2CH5pLVStYLYTjeUTh636%2B9zV7Y%2FUuJsXU30%2F1EVHlPiH1AsTFjzbs7Xny4N%2FZNlm8%2FPF2ul%2BuLrr92MNTfCNek9U0zUGZLjftLOE%2FYZ8zs4C%2FvOM94%2BR05csWvmD1YwqHnKLkC9JJj3Ln4WrQmjAYfChKPDyBB6HL4g3Q5c1aCuSYz7630pwo2jdL%2FhFze4sKEhDuc0pgn5SGI66rR%2FJZkBuTZy1DqxI%2FNvbb6UqraYLHnu%2BCEPaI2eehsMijLgrMNfRtMwGOqUBbFtaoYoSNHRvmxC%2B%2FXI6JfOgZkI5HSg6J3WdxE6Wl4ZGyJeZ%2Ff%2B0XnXLg0brcebjWmXR4pKJXZm66N0N5gBGg74eGfnQTxkg7PP4R02v9FriZ0DEXJzqObIiQX1sYV8XdhmuVeWoQKDIUaLGe7DOBJzBh4nBLVTN0C3%2Bzc5S0lf3wT9qiQ3ol5VXJvCiRYowSkbZ4KRNzkfjfUBte88YSILu8%2Flr&X-Amz-Signature=4a98ef0041175937b7d3b7dcf14af3f5cf351d1d55a091a7e3b74f4ef5ab980f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ST5O33UT%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIEYnf4EcIPk5j4cXT9hE1pFfYrxzsgdDKzTnH%2BOWBr%2FqAiEA77d%2BNLDKJwMDdmPLhZNugXVzMDBhe2Fil0wWZD0tsz4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC2Rss0ovYqrQNQqFircA1DY%2Bfxu40Q%2FqKM61ndGg%2BaXlJP9T9E2yui9dVgmrjj72YM5fdAzy9gdrpU8UTDF2wG44GWbd2S28WCJRFGLcI0qYT3RxWbI9KQBoMw1Y6z1Zb2NtLtZsQJK%2BKaR3W6tA%2F%2Bz6SaDqeC1sUboJQBHRrP6oOsZQIm4zO6%2FBnsaH5mpOIu%2FrUGJg7uzCH6Z6JJQAxTH7w%2FFSsQL3ZUtYs267MVptPYRqYZB08HUygh7x3isJsMsDhXYy0DAqF3Bs8N9wnNQxRRB6QKZhCDe5CIClkJX4NjRd98viNsx9FlVtDuEm0DeZvi%2Fhfhiu17IfT6j6%2F1Z6FiPmcW9XAbISQxF9PDpuAqD9Kd7IVVMWe%2FDU4kU5UWijN6808u7Nn3kTn1J9c8krKGgMf%2BNRZZoFc01XrhNzZ6Cu%2F4owd8fUikjZsknhrocfrH3XSPTBgoXIng3tNzoqcrDxNnl%2FT2yKdpg%2B3BMO3rbvzi4V9rY%2FV30ZdxtphljKd0w%2Bz1zTzEcVSYvHw%2BH8FNiQWFxCeS1d9wsPIL33lGvUSq7aKFRYji%2Bf%2BkQvTiLfGCw0f7GC8GYj51AxcGAmmcoNzoPMCm8tfWrdqDpv1WNWe2Im3GzyjEbLFQafKI%2FIWqvi1JwkCdzMKLOtMwGOqUBoNsD3slE1BvLyeqj5sYNqwZYttnpA8UAlfpx9H%2BDBnmcoGT8jXbO89HhMThrXp6Ls5e3gisTlyd6zumtfo0lMfGUJD24lkeA%2FTcu4SE1NixDcA8qKPRRUKkCd1mXVZjFwtM9nCJO7SzxcOComy9PEI8RNY0%2BO2z2dZQfJRgF67Qs3T4NgZILWh7eV5mCJz%2FvBuZcvEfaSif60KaixZ5hXtWD1JOr&X-Amz-Signature=c7ea1c161676fb8981ca07e5604486332ca97bcdc524be1aa3ec3159d4a51304&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCADCZWC%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032135Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIDZNzV59IqxEhZLr7Qkc4DovlpaP6x9ncPJpUkbAuvDcAiEAgTFHKBhWHgmQpIPnKfywzJ6nq5dGtdEwO0ZP545jUhkqiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHUT1J91AO5%2FwDysDCrcA3nrDVPWgrrYzwqSM1N4Svee7kWjEyb5S5KW8a2F%2B2YDUnLBJCJSQaL2%2FZyNbaDTdVWxHMO8nrQ%2FIpRHveu3C3fplr20PRwo9cTEpcbzK9xE9lYeBS62Pq1JD49B6%2BUoJTM%2Fi0ECLXlHrVBXNR6aT8HbsfqCrZ1ZEnhQ02P2WlwndZynecbMpRanbNShFkm%2FytiMFYpyP2NQwBT3wurzR8hf7Ae8tQ%2B2B3zfGb3GT068IJiNIZ51fep1aVf%2FzQTrEe2KYtchQTlzq3K%2B1R06c3qBi2PIhPumMJ8KmeR1lmMzlazimxvxpaEXILhUDuIcsH%2FJR%2FchAsHBotjRuJHWERLh4KqdzslTCoKX9Z4YDV0aqB%2BN3G%2FCd7vPfQMeTL1bgDvpiw2cp4sQq5TJuHhNH6%2BA9nEuWViiIEQwVCd42OnmBzcyJ9s5hILc9FMhGq3CXKHwBM9PXveeyZt6d%2Bi%2FmXy5lG0UdHSLYWCb5siS4FITE9Con%2F%2F1%2FeXt8LxCxaKSmHI%2BPlbfM%2FSsCr5XdGlcjJ0UASbVAJUTEL2po0nDl6ICfL0tpCHYMiBLnpUVbEWvU70fkttrB0mJrQZAgQy6FxVVvdYgliSGi%2FmPvHTA42ft37U%2Bq1T%2B7QWp9TM8MLXStMwGOqUBqMeDu5dtpWew65uWV0R0KZnv9mkFdAbN1HgU5RLCZa7yDHXB3IxZfkb7r%2BjLIl9Ac3CZrwCXNmdl9X46x7itJ%2BTcyFZ5PmNrxd7Ph3JNSYHlh5jbyVvKSfJif%2Be1iVbUqaMEsv9gzhgq4X6gMkTKtBuUOXcLMGY%2FZEmrFhTW9M%2BaOj6ZNBNlbB8Z6XQQadUMrCI0Ho4nElFfD7iwSQ5Ohq4oCrU0&X-Amz-Signature=9d1c13387ce61761a7d09f9dbdb8b9e525c758e38ff94f4f2b9097b48b864d5d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=60d4f4ba81991b8825ac474605eff6fc0eefbb0143122a267be3e3554b23441b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUYKDOR7%2F20260212%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260212T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAEaCXVzLXdlc3QtMiJHMEUCIQCPQJDgTEBx4zmR4QDQ0DbbKOvrF5ydtORsPZqOZEUYsQIgRLW%2Bn8tS7RPO0GzQeuk%2FmOT2sknlYDrrYHlwLZ8TrL4qiAQIyv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF83xLOutPNIYMBRXyrcA7NJslsA2CZQD%2Bi%2BKGOPXR2e4wFRKGzjcpjPQSFm4cf3e1cckPmqVAuy6%2Fb%2BsSMlCOxnTdIIKZ7x6jLpukY%2Bg8WCgERNvbyIWOjCj0bF7IFSZ2bHpDI87wGY6bI%2FjHDIhIG2Qd%2Bs5k%2BV8QW5W%2BbBUwtxnUGFlfBf9XLpD1M0mbivw4JQqrVjgkN8TSrRYM5H5rQ63nc7wOvyjKDmnDb8ZuuIEAymT8wV2YTsO99xG8uSayDtZ9blxK0HmxQvCoQUeO7OKENCHjoCc08wrBkc7v1jEtLfnzzN0XJecKlcs34IwXF8fVyI9BIOl8pn6UuuKkW3LIzfzl4TfDaJ8flb1mY1sDj1crTG97GRLqwdVTQ4ITTasFsD2MWpRUq873%2Bz8MANDwT8d3xAt%2BmA0Rgz6otto4f%2B6NBzTTJd9iU5uvvYf5R5QaJqLy2%2B3q%2BZ%2BnQvGA0bsfWV1Wb0XqTbn7j0iaiDT0gAJWq5Q%2FLR87fY6L7pN2dZ%2BjUV7%2Fgr%2BJD4zU%2BP0bnLj34AaTOJhY10aauk8UcFzVNeidjtUiyzcLL9F6dqZkZwX7zunCD2qZsiMVg6Cr5FmN2xnpRsB2ihDltkHhExBp2TnOvJKNKEKXKOhA5Xs9K88t4LUUNuzogwMPvStMwGOqUBlzh7ylHhj95lpRuJ5OkjtQ5I2r6NUga3AooN9zaKCcn%2B3fg7G35ZXn1cBI7yRBn%2BA7gOQ2cMDQHL%2BPmouArG5ZSGx419zocPwvxVkXuNunXlHm83hSYyWD29QiKg9%2FegY9w%2BbM7%2FV5MoUsPM2zUMtTgs%2F2jLWWEo5yy7ECKAEWxsUFzBxlUSr0%2F6rRfSl6ny4O1zetZw2BZ%2Bs2aHAIQzlhE4A%2B1E&X-Amz-Signature=6b809b6ef1ba0eae728f3736371bd9d8110dbd52b3f7fc3ed34016e0b32da50b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

