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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=4c4338600a2a75673b7e5c82392e2be76c593a0fd49ca6ba3b0dc579d49f8442&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=f6fb9eef9de4e22828e3f6826bd29acb7a6e7094d20d724ee51e383aeee81d3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=fe649dfb97cd015e1d384c30893eb7a5e43e003f00514e6bfa3dd6ec317c7664&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=aa9a190f6b93e3fb96a503c491fc46e1f52ca043babfb129859f29559af36d79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XTNMTWHP%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFaqEZ6wm%2BS%2F2vKtG4qyMCmC2r0TbyWQUD9XNZr%2BJbKpAiAsZ1iT%2B%2Fd6bU3BhhJeA8%2FavfdivXE1UmIUrfUxCkvUFSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzcxCKYdiI2hzcQy6KtwDz9s6U4rDspCEY0sNAXw9WOwvjxJv%2BsYSW2NNE6DIwavVftVisgJu3VBiAN%2Bg868kOFIhmmp4u7myQEsRA0q%2BLEeqpvS64eq1%2FjJK%2BhVhvi8WHNt5ICq9KrPOwXBQE%2FREAYo3e8HMqHb1SMpynnrn1XpqrhD9g8sRGKVeS1RAg%2BeXYKaQT03A5djnS0HGxFpBbPq0pkCvnZ2j9s9UA%2BXwVAx%2FDTZW8imcISnP9arKjQVr9Bs7fm8XUcEG9qPzAhWGOAVFdvaDW7hyJ0kbPZmlIa6kft1kaUkscUU%2FRSK5hlkUnw%2BYPF1hi2aUKUhcTp4mR%2B6zvZ9v9u9rjZOLpBhK6TsV9xHO51OfchhNGiEHzI2A6wA9jo0ZWGxwAf94DO20DX%2FmgM97wwnBtucS1uYrVfjwnh4CJKaSCcly5vgxtTv5yxS8mr3fhtwDLvI9yIOsS9cuIKzs%2FYJ%2F%2BqXi1QDmNQAkUu2Vbl7uwyWAl3QNqWuWgK1mNlfWSM1Dpg8etRzrN4eZKSvqaZM98xRZCWWzv4xEohvjQFELHohhSp5jJHnLmFSWdn5zHVfw4BDT7ki2EO7ftlWXhKztsCc%2FCG9QhUsSw1nYDD5WPMH8biT%2F1P9TdKtJX%2BAVHrbkxAMwmbjNzQY6pgGtBg6XSW2BaMKAKT%2BjAcNeNHjHTRRXT1Mp1oqZuHBLhbgAsNsB7xksLVkDEBIJHc8KKB1Z6HajvdEd3otARBZy0jJksPXgPQhWODmccBgd%2F61DXEZVk%2BUdp%2Bu7WedYGOBSjLbdrybtf3J%2FXEGzJPUotJxNk0q9pfw7dXkErp4%2FkKPe2%2FS%2Bbx%2BljMw33TailtrSnA4Mthk9weYE%2BZ9XdluORsdcFeWN&X-Amz-Signature=207b1ab83ff97a7705f9aec3e3192adf980ff34247c16de0a753ef45a6fa5009&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QYPYNSGP%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDl1mPxKtd35CQ2XLSO6o8%2B%2BcSGEHxEaENSN0rtuPtEBwIhAN0n9OFM5w5jEnGhWVeO2ufs93UBzn6l5nzcxqiwt6kWKogECIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzciyXNNteR12pmaeUq3ANEU3ClTLyd9sD32vEfY8mBGPaKy%2BnXNTH6oDCKjwZINMnvkcpYUui%2BpL3in56XYk9hXf0JYT3bosPmJWtxCz1ZPxBGT4lUl%2FEFlFw3BfU%2BRe52IXa8IyKFCcu6eUcX6piLfaJ47k79Nx1WJfS6m1jiaWLyZyGYreWVhnh2Uhg%2FBj4awL8d1djfJTIVrXkVo7dcQZBvkhymxI5WDawe1HGsy9V1VJsPXQAT4ySROBg9E1QPJkOfmulS9xUrfJU9G8UL2brwWNRtg128ORK4FODv3li%2BeHcb4J4PMxyJ7zgfGhR6H1al6TrszATr%2Fj3qYgMCdj1sxRhkKkl3WwacFmSwriKccyACjEKRdbVp%2BdHVURrpbITeEY2K%2FtsJxhPCsCj2cHc2t6RMbjLEGD2UXsZRhdPzU9oPCLs9nT1fE7igIawdVOf6J4NH0rfG6N%2BA0zoNoO4rZk3w9pHI%2FyX%2Bz4z7aoSy0OFyOnCNqWCsnZoDAsyB3449772Ozr2IDEmLA6pPXcNkl6JVsf0k0uxRXlddlfvXHfa25csrN30WLnYOGy9W%2Bn12uXyWugzOzx1VFoTzcDkY9iOY76o7NpqBOW3%2FiaNuWSUHz8PVrzedhkGkl4oRbXDxO2qIm6DWNDDlt83NBjqkAblTwrZojX3iNYCNIc4IqfCeGLWRt2CHEIvF7cEH20KBMd7uCaoQK7H3b4KcWFsRZMlAGQu0SiCDBrJVo2rEhM6pgMbl4b2bSBfSoGlTVcD2Gk4FQhB2hG76WYr5Z9TcqxFP8vjDKX9UQPh%2F%2B1ILXCjMo4B7ayYho72FdK3mylbnsgbCHgIlEbN0vazNzDsOC8qEy2Z1wgq19SHuWr6S4tj%2BTMH1&X-Amz-Signature=e658eed23e8f01a526c6c0e99c2afa6007a43ddaae75b6737c3c0ce329b48e1f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XXSSRR2W%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID5hXx6S0etZ%2BCa2y7wBXS3G4bwP9pNh630QnWFVUiw%2FAiEAmTaSiiLMX9qg%2FQJUJkJwGpqN%2BAEVLNPGSM%2B47N1lUtAqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH5wXeFHzX%2FbEmwrrCrcA1iXwObKaJDQHlCLGznjVq96QF9Nx%2FXZoMEQH14MGSe9rgReeAbMnNmhNXtJ4%2B0Fj0y%2FUM6ozaZKqifSyWvZ9gRrKvSUUwN%2FZSkFIY0BgbLRgvKSEiGmMz%2FeX236nLgNWoMK9cbN0dhNdB4%2FYJA65MroJXs2Bf5JL3q%2BYBJK1hfRkiIpyj2ucParuz%2B7%2BqOPMDPzZvNPpqpE%2Bpr4N1t4DOtEKbqwECJ9pg08jqaLT8t1nYf9k4T3vpEOhSx5vKHpuS7%2Bj%2F9meTYOjp%2FuLdKFA6siqqNoobDu4UYah9p1%2BmxEl3GPfgoPjt%2FHLl%2BnFzjKABNggprpy5mcyy7RhC8yx%2BcUn7gkEnDI%2F9c3iKhhc52KMaLXZ8IfX4YZYLQRhP9TVrWki42CrJij0lH5aupRkhH%2BqpZ7gETA2dt7Fei3DQ%2Bll4QkRBHevwEXv1Xbud%2FoCOq54RhSEkHA2PnZuEKruyfrSnn2uQrGVVPEGtJOhdD5%2BGFdCvBFEOBuZWblSe4NfTX1J3DyyeAaI3vOSMJ%2Fp0xWsk2rsUjzkXCtbTa0SFk3Go3aKPSnkuLp2Vp5vwmGhfvRK2qwm24PyFtuuEbDJutD1heXwzqawE5WMTamya9AlCb3HXeh713HCukOMJa5zc0GOqUBWKoaYBAiZ457miD3s6aSzv3ppLXrE%2BxibhLpif%2BDGV27osRmGX8nsbTcOI6SuRZU8s%2F8JuxbRphqZ1nvhu6A%2BDyB6UyxHOU6MH94lpoO4cpdkHN%2BFeDjLASsgOJme9nkZANEzPq8rYrWdQBLxU2JazqPrM%2BHtYBaz0BGnLIEmkKHxPv%2BCLIt4G6WmghaJ7y%2FFMtzWHnyIahExMdoGqBdHeb1sNqk&X-Amz-Signature=1fb40034ee2f849ab448df55032597ddccb19bf30cf35e57d58af05d60a3f08f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZDZHD4GV%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDCSSYnmqN4fL%2BaTe8GtPf5g14JKGbZHOngxXrQQbseXQIgfAkmJp1EZjPurDh5np7TySXF7v9eEPYNt2NWZeN1xngqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLibdVLNyfyB%2FO3mGSrcA35bCBHZgVzGgtp97Dw6YAYbldO4sq4hiFv7aK4WCQM2TGnZ8s8jlak4DFWeKWT8%2FQqs2bBnYElJyeO46%2F4avPFMYHaEpr63FWt54BAGUUXRd3rwC9Sd4u9WPfiV%2BdYCSlH2BdWtJWo2r%2FCeRRn7vacdmEBVMEJdpV8QZDcJ3F0eeKYOMbWqxGtW66JAIZQsSkdJBfTqmctMtYDYrN4SL5bVZ0myYVubUTouRVdLsKlq4%2BT2PCwc6JFRY%2FL8vy3fsr83tstd%2FEzYfnDLIFx9UZvZvQaV%2FCFSQzJVJrh1JSxGJKA7Ywej%2FjnLOG1xzrhLJYuOkym0%2BSgjIjt71NuxYvcWHLEtpJYnFuOo%2BF6GI8y%2BTqCsGhO2%2BwLPQ4k08%2FBnYo9ybK7DdHSQrzEXm7yCOPo7rvmEVI79WtSus%2FjI1JJa8Lt%2F2RO5mZxNu8PqWTYovdkBtO6lOJRu%2FtQ7l2dXRLca3Jxca0o3M%2BhAFpd%2Bm3B89WGQULHObjxGXscajtW0y9bVxwbWNKZ%2BQtmEEWOvYQIyjP1%2BO51T%2FuG7ekM%2Fd09sdF%2FVu0LBpqQExYQy4%2FbmQMkrkZJbV11Iw9cJeprc2K2ppkucWqvvjYKTQQKWz0o%2F8ccCGg0tYFDG8jFZMIy4zc0GOqUBQS%2FdIp8OJn3Iz0fTgRyb%2Be%2F8EWAbNf4cKZo7o9pQpsFUFNl8Zvgwqm9v10bkESMEo6ZXw4iSplUY5tLsyskaYnRXm1a1uqCoi64HuTEzJMtMTUVQ2L1JVzmnT%2Fl99COpJ6X9ajDWQVBDbn1DVKQlAWFDy%2BXDt%2BjdRLPy%2B1JZkvo1hyR73wRg13vegtYeaq8vZ42qoM7Zro8vStCrjA4rC%2BQIqXcI&X-Amz-Signature=2454af2d07304c313161332e293a5efab0b3c75ecf078a1b7acb4bc25bcc8729&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=f6f3fa1ebaa0dde88968f03ffdabc02811015e80c989e9c91d23933ba9a5c225&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=036a395d1ea67016201c75170880aa9ddeec7598d747051951e4540ccf24bc97&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LCE5MVS%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025431Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIATDehyLiCaFg1zmHnlyW4uucN2iFxn704pfP%2Fkw5QXjAiEA63Qt8Je7gdp5cLPDOwLUQLxJwoGJQGEtDGmpfv1%2Bh%2BkqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG5p4qnpnHUUhtbDoyrcA4gCI1SnTAG8UlXRJLh1bXUI1WN2J2KnJ%2BB8MTiduJqfkejWP7zZEeUgGwWOIn2qYzIhbEBdwOIp8O%2FPNWcp%2B3LN%2Fah1Kx3pP1jT6vw1impCdoH3z8KoQD7HOWp1%2Fx98TZ7EDAOtjAjrm4nGvVRrmN80e42iswCi3myMYNZZbKRq7hng%2B8FEgXE5PuonRzev8r4p1BNTO4ZvlD9cbrCiMdLqzAHlIT98cZSP7mhFHNr5MlBjwBiIGlFOnlCYtTWmQhpg86oITlFvtq%2FwgVjua%2B5hpfFWRXID0yaA6CaM%2BlFRPvh2%2F1n8lHFKsbs1%2FsVjxm7U7EGPT0yj3Fr8wxw1Y2cU3tHVfldcUFzIz1Wd2JXs9L6kTWFdNA7rF7sZ6lnXL1iGuzhxOEts0tN5tFw7p7IfKBPCBs8VzuKtD4T3sVbxCqRwaaCKNifY61Ivmwb4As3MCifgyk4xsUuAD%2FKiZfOFsM%2FSSpkq35DTi%2FTUB2K8WV1iWVCj%2ByZUuLQ%2Fk6DlpFiCdptwn4s0QF5dlj136etG4Y%2BA%2BZtPQVAfNjB9eb28aSFhPDID68Nn4cF2MuvgtJzQ7sizTtCqR96NQYym8kUnz76d3PcDia4lGHBX%2BFmnR%2FLGsbEvLt3x%2BESZMLe4zc0GOqUBZYf6UpQLvUu7NIB9mJbmMBhbyHVq9Mp04fM%2FAY%2B%2FfwcHkOOKzlQx9UbORnF6HoCUp1tuFX3xjxtpgCN%2FtyANvtCCb4zDDU7oAp8AKNoLBAt2wehvFVKTcIbA7jPw74HZL1gS%2BF0qaulp30gdsnYIHop2FC8cCo3A3O6Qg0i%2FFORZ0BUMRR%2BB5x31XUDZxYew9JWOPqewg3QY9BCiQLnSMP3Zs8nD&X-Amz-Signature=627a70b6763f83436be3555f8cf7a46b7597b6ff4b92ad30a309f5e98e78f942&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=8d5a9d92b961b544e54a4a67a7288242f516389a119abb6f9d886c622145c076&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XN3HUKUR%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025434Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD1Mj%2BmRkMRGUp3BTF1C5G6A%2BPnWPEveR4x4fBDUzP9EAIhALaijoPtM%2FQru3cc1a0mwIUlkKbW9rVDn%2BzZEGcJg6e7KogECIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyzNuNtFbUcnPQdJOwq3AOLWGL17UtPKecHJmdiSUpF1Ax%2F460BKQ1Wy2rvZrxGklX1WB53Kelv4yULa9sWduIfdBU%2BHrE%2Be3LN1HYbEmRpkbgzKK8NuTMmNxQjSgkOOcVMu0xvuuOe%2BLncFF5HeqyohYf6GBndGIJFZ8WTPWisOau%2FqgFc7KiZsxXaFF%2BL%2BzXwtOuo9T8gEgVFU%2FPzRGn%2B8Y5i2cwDCzEaHV4ut%2FrTWHwFHPZbAoyCreYZ4i2Dx%2BpALyPzlL6LHpAFKPJFAGhF4IU6juqsOAJB0zUKvjBH2YJS3UMXRBazEbYEgFXhOfqXOfw3ufJmhGKdtnRphQhRa0%2FMGJfA1meAcFE4lNGUeehOzX3R3Wbge4X0Q6qWEzTsIN%2FCsWXvOq06oekaZnLfZ6U4Bqflo4UG1MvTus3NoyJTho1mRthCv9hFjffZ%2Fdp5gzBxHD5cz3f%2BqZobaBcRduya%2FbdmFdRLXZjAPG2H%2FnXRHA8REEFizBndgSMxe7SZtrzvNnJ9JXG%2Fm2kL9wx0QiqHDwPx7K2jaxtuGpf3OdoysT1UYxCGdEvB3Yy%2FpDtPUv2AqxjZKAkCxqlzaMhMV75UM2xpWmJkTT3HZtVdOYOcp9SGZ%2BHrafT4A%2B%2BewYpe1vuuOuCTt7SKMjCguc3NBjqkAc02WfTmeEMxH%2FAlWvH0HuuFbrvQoUIMYCLIJSOaEFUX5RzZlRMKeui1hJ%2BUFl9kciAM1OfYnDdYmcLhkmc1707lQcTm2cCjOhbaXte4u%2FTSGwcKeA%2FY83X1YcdMCUp9Tkb0VDH%2FG714QcuSsFGKY2hRSyL5eQLTyDmLAgwJ5LFA5buuceGdrNk8mI6ptebdLmDV2DWEGfhBlsqKXy8IODJ8KmtT&X-Amz-Signature=0768e83ffda43e5af5e3843df86203d26b0dec3550d0a080f2f6fcb256dbca06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HIEMZBQ%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025435Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHsdDxe6VXwcWWkCqf3ODjumePBCzOOyVXceiSNFP2KsAiAcOdhNTNUmF%2BhMf4FqNVA1DB88vUVEhzo%2BRemQQNFiriqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMerv2eLIFCft%2B2EQrKtwDtznxgX2a2PKJ89461qVjrzokJ%2FjCYc1MpnS0ihhK7B4hWB1ATF0MvXNDeankEOw2MsBJOMk7w7jnKrTKjZxYn2Kdw4JrBCn3B0KSLYFm2CPwcZo4FxkuC%2BAqm7R%2F7Q6TRd9BXojhIeBnkVIoLuRxwk6e%2Bv9D1cvA8330TA85hYPbq8rENAXma3B8lnfIkf4efxOsTS%2B9bBuZV%2B%2F0AQgM6gK2BR%2B%2FT%2F7WafFO533Q1fk7HnlMQxP4mzfK973arkygaZL2USQrXvzdyap5zeOcAlwwsDlLOpX2hgt1YFZHLI2In%2F%2B05bv6ZYaD6srSgVZZJqNZPsalo%2Fn0JmuGvnct%2FQ5jQdwTAr3IkzKKBfxNahMa6n%2Bxo4lUrJq5J5Q97jaWNBD9fix%2Fmk8suYnWXqvVcFPiKzxFsJvuMIxOeAMQ9tNcpW%2BdwzPCGVtwemtmMbjkKgWoALNoStPNNdNh4A%2B14VE0c9IqCP%2BKCFh6%2BjwzVROgbDIwrR8CxlKGGk0LXk%2BLRIohpO4Epg9a1ShX9hCuZ4sJsdd6P%2BItWn5rLQDVJSmwXUNjUrAaJZnuA9kU6fcQvFL2p67UXdx6fZ26AEghvyOYbyiDyjS5Jv8pIj8h5X9M5oRs6roCp4QpS2swqLjNzQY6pgEH9u3ijjLVQu%2FQspbbCwtydnyJ3brNwTSV3hBwBmYDK5VwrBlBNGq6ROp9aCM4v%2F5OnekkaYDCupclgl7JSe736oRgT2Yv0891FvSHBBVtrANwPCQ8ZyMPuA3%2FEysrzkmJaQ59PdbH1SoqEK%2FPBiWwGgYrI%2Byj2AmaIQLoS2B5YoW4%2BdVRRsGnt5tQbhnWBOLBzitc4ZlDPq5XTuR18%2FS8MYWK1Asp&X-Amz-Signature=aa110563460a1507354a813e1f0cfeef6ab635c47a5832f062cb7897c46c1e57&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667SYBFBUM%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025435Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF88ws3Kk%2Fuj3zwSPcDo%2FMfrnZgXU1KH8D1ipCVCw9PGAiEA8nHbKbjKxiiRUMfIkY2IKaAC9L%2FWPf9KeZ%2BAIXIXehYqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFAKyrwh9BtcNKtCUyrcA%2B4qND7wqo6vI%2FnBIv9jjU9qEDWpTglX9NmCqQXDpTdcFl9Mj7prdegqePuGZawvPcq7bspP1WnD8ZY215Ki%2FJTKXNIOGU3iat5aSMNsCmeGc5XbRua5XQb%2FkEFHfWj9ULGX22%2FI%2F9Ch9vQiQ0z%2BKhhW%2FKATG%2Bw9e825LDCigFhkpyqerSPP%2Bjj5VUjRKxzumnfzf3hIuiSVKwFBOMb7da4FPoudvc1%2BP9TlQS3T6%2F%2B0WHZsXX%2B8tnI0bahppsacxG%2FZ2hoQ3jWGkSspPR7D96TXdSFF4BlO1ZpZvgAenV3ls%2FpdvUvmIk5t3Em5A5bCmguLGN8XWBrhPt8omM2Gu%2F%2Bsxge09MJvu2LfIxq7andlNKkjX2RvcF1DiMVDZR7S6EcFuK5X%2Fj1%2BJ5TlOmCdl%2FexV2Ah64GZ7TyVYEofMNGCS8KA2xNJU0AduouCpSTN9ks42gRVwqWSo73sECQWp%2BdDykddQljHBHNUAiY1ICpHtqqdOiR1Uz2r6TnaK8MBVqzzWnG0%2FJJ5YV7uOs53dZMTK%2FfSUoE57lGY4FBrHU1tKF2NLB2i%2BbzoKNkpr5mqTGI3g4CkXXyjEG0UgTtkaxowiXrVWfRu7zuDsu62e%2BmHyHurNU%2B0SYobeU8UMMu3zc0GOqUB06nkMtD1IdWRKlCysCiNZK5AtQ%2FPIQ%2Bi8ycxjYkwjEwp0QX1SJVKHZZh6RJtM2MEwVcjtoCAtWCDR%2F7oRNZWgTHvKKNCZBvmeAjRNeFB8TQM4WiGifzzfwv0mTfDO6TtJZETwEfgIZacHaoSeO%2BGMyx%2FJz2TrRQ8I4OFs3J81QsfUIf%2FT6385VsnEGvnNEA%2BHGJEKylZD7zfQcc3p9plt8VD5ccV&X-Amz-Signature=c5d0a6518ebc7d672359cf48a58c86b48755cc90b01cf98917fa64549939ac4a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UCVLXPU%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025435Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGewQueF5%2B8WzLVd1uJP9V1IgyhImY%2BsahAlLZfl8COCAiEAoQpSj58cYznlXBhwJSnENssL22pckyxqaupf%2FMpXCQIqiAQIgv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMKDYK9ByUzDh5xrjircA33y3yFEfyszStJrEsdKUsXNfdMCuiKX%2FJH1T8Zbpe5mT1grrGX4CkETlyz6mYbIbeuhuZ4vFsDEiwzI7czxzvo348%2BcfkEOZZB2yI5YJifY30Ry0gl9lMqbsf2Vhe0hr5Z56uF6AUjpHIV1Zh6x8uUPbV8bnNnu8Y%2FJgn6lH4EYvT6Y1LkHUpHti9miACTobqOxD0enfeKot0tUnTny7NziinAPP9w5XCU3rHNpIkrXHmngafo8Rwlj2q2QIzBCAU%2BM9vUc1IpzVRvLOnEPgb3jdylo1zPRTLD1%2B9RBmnCXv7GfA%2BkCjcn5GnhURoBioYB4EEFBDsn7JHTXcp4fKH%2BhkROAXAPLeYnnrGPzBSPvf4mhGsqNHl1j%2F60U2x5l192dJJP5Lq2cmZhFXfDLQsNlN8ZfgoHDT5Xpvns7CebFtRPu4TRR079yWmxiwhi0hsTqGd6qFCyTJfXo9R1nLqf%2B8o87noYW77Hm0K8h5V9qIB8FYVedMzLI203kwHOOtEiP%2BjJuvprAz2KssBDBpCiPah38z9qtOFu7itQX4KXb7o2w%2BCYy93%2FSHGMIpIOW6eDFmAEh16AI8ceEz2p6%2FqiSV7Io1Vjca8gPu6KojDgkUyZjYxUhfqSsZY2IMO63zc0GOqUBi6ADjiEk0feoTPqmFLbDKB7h6%2Bq6XpO6ru9TO841qNIhU6wa6hGHqtsBkj6g7dN0E8hqJ66ZrNa1nq%2BZjuSoBxe8I7UCjO57GaWTE4Tu%2BnrVLR1Y1weAWH9KNQ11XiIT2wOBcZXsHdtomqaBScSG2ujevET1ovfCkjz5bj%2BAeKlcQGxuDwlPgdVGuodRQlIzFeDqX6e2Np%2BbYFoMZCBNIMf9Xzxi&X-Amz-Signature=0b37494b545b7a63039d2c5b72c8329b337b171d78393197d470c23f3b0cd2f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=16157741c3e2b326d087fb7f66f36bc96afa349331e01da559a2224f770f07a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZZHVOBA%2F20260313%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260313T025346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2BFHk%2FbZwF3roEMEG%2F1Sgx2I%2Ffdg3vlfVlcAwOx9qN0AiBjNl6WpZVUCMnPTcFVQkx9Og2aPDe87%2BNhEJa7bh8%2BYSqIBAiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSXJwrlT8nS9H9CILKtwDtqLW5edrxad4kJFu83LyVyvz63r2Rxzpr9O9WIV0eNqyuhS8O9yEcAyXIwVXA4RuZm59Yc9FdZQKzyNsIRwM2HoNGXLyk%2BWOq5t2zx3MYzFSSwKLf2V8mDvQ2kCpXkbXueRgYTqh%2ByIOeJHRFtD9J3iy4R2YUf72iwfxzIvNowonkmmG5W70t1RlOBHGq0f%2FtQOTX1Ri7cAsY%2FVe44q4CQD3pISCzCkhhrNczkbsbrHbMyRtXlss23vF7akgZ4Xrzf5nFQUPfbCsFq1Ya7c9m9I2g7MMLSLkTIJCH6mOPCWImoaZktxwFb01F2cDKBp9ElWRLiLUUf4s%2Bb1mxw1NTWGfsSe1ajZP8SmFb4sto6TwttguXWUqRMtuc2H88%2BEjRrW2D98dTEzKJhWlebsh74plikO6xYUfe284tcElgQlrCZKJ%2Fc84ZwLG3zeCe5F%2Fz1aER%2B8RJjYH52aAAE%2FFy4%2BjaimGQYHhXb4D4FKuqGyqZGE%2FvtU%2FXCEeRfax7JA3TC9ZI77QZOLGRURQCR9NYhlzRlEOTTjoQgX3dc0dTDE94dz05BlzQIQAEMaIy1lsVUY%2Bd3VUyxQ7gqiQYTr3XwtaOO7I%2FklpytMiwekm93A0v3bta5gVgG90E0UwybfNzQY6pgE6OtY5t7FPt%2B8mKStNp9UyHI0HNin%2B%2BMb7FjkrZEagnuIJcSdGD4e9kk2%2BTOkq1EHZKU4kflLkzUWcP4tTDxywNlgz7j6363m956yEK%2BiF8VL3BSq9%2FPot9u5lRKcdHlIdWShrRcUDLKy9Bn4JMqI5PMHYGBJS3Dr9EYMwf7gwaU3gwnS2yZZigikOUZDBy77HBeJnNrQlUHJADThvNxjGrE5V9FRP&X-Amz-Signature=dbd005b98b77af77d50bbb8af541a0e370435dd0134ee1e3f9c648619dfdc845&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

