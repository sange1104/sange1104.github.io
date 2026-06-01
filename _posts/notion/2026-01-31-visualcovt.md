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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=fe7d15e969779f8b16516d4ed894e00cd1fb598216493f2d4894d008d49b6a78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=1def43de31dd03d481ed8619df315b4773c7106bd19650f661238969999b71b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=4f23e04ded737e26f257eec3a154185ea8d78bebb702a0f18457303d8e9120ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=01bb15f3fa9215575e9392cd719f3646d5bc2b307f98e1b2f15329c6bd3be21d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MPMCGEV%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQCd0qbHt%2FBrln2O%2BJx7EAaPDD%2FS08XcLeUj9G%2BdOKNlwwIgZll%2BrUwG%2BzlWwtO3B5jVQRjYw2qrAPFlnpO9OcxZbBIq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDKorXM%2Fck4SAGyHvOyrcA4IbP%2BC1yRjAfPfu%2FtBBuIWrOe8qeOD2vUY2isX4FxB3DfvVyPux37mOWUvymz%2Fc3ltk9iLMprRGz7tPZRuV0DWAtKLMEkOG4yz7KsBKWudp6ewEIfOyHEgnp2juHQ%2BlrJ06GOjbxG1yW0ZrkP1MR9vurHrVNBIHB4bEmKoB35T6RcK0dGsZn8InNXUvpVwHMuBtbmRZ7823m5%2BzXMAtg%2BpKx4EYj7JjuLnSq4BEFr%2By6fhMt0WXnFDZSj%2F6W9qqIHX9uUOG%2BMuDwj5pvfI9iBt77GFRbjcFV%2BE5Q4MhHea4E2WsfkFnn36rvFTqPIHcrK4rBJIY9B7WTNgNhYXu9nfNo3ikMFjRb2YCqU5QjNUIaJrxN14rtqaFzytTW9NlLv4LeG5W%2FV0qN9hMh8ldHZqvb3iUeDsiaCH0Ho9PEgOwd3m2BrSICfVxSHttIJ9IoWh%2FPN1PNmxUtw%2BQSPdlJ3sm9gPtDoI8bjlMCXnuMuX%2FyY585B183W2lqEr9rpKveqsZ73nKj87rxWDLiFdi9iuEYWgsOGNzesVZqvi4uEM%2FlFYmlltldzf5iHbX1JcP%2FjJ8hUFLaZq%2Bvfj8RNk%2BP7yy%2FJ0N62oUMxOnW8wVGNMiUzpwkqeRpGWGGO3GMJan89AGOqUBsaTO0KHC7We7yr6mdsNMVyr%2BLDnom156csWydDer2B%2FeLNQDH69kOww0LwMTTSxpvZuWW7ryDnaQJ5LENnSuE3Nevi3mUVCrOmol7TmzechH9qVueRWcoaefvSbUiJEgGJrFIvIPWNGQyaEaHo1zRvc0xs1mUx1HooCLcNjzjkF33WNMAlibF5ox1O40ggaIBhNZBQItmfkmsXXrj6llUwShXvpe&X-Amz-Signature=6838bd9d833f3be894079f2b9fd17773a8ed686d4cbf36b6480c9a661c2d6d71&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YROFGFWY%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051718Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIFeun5qQ5xOMNIGoO6gUTi9BHl0VtXMLx99jkdXGrGEFAiEA7ulAMhk2OFg0ZMxabK%2F2RA5qyrZqgMtZ%2BbPPu1hbheMq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDF1%2BGY0m5qcrcqy8mSrcAxuIEe7STF%2F2v0ovtDDZ9aHhK7uz4wgEwkrEoYWpLriOh7VvWWSfJ4woeTXRgP7Bo%2F6FuA4bM7sR5iXe9nLm%2Fijkp95w7%2FxNvunHoH9j7aEXnm%2BQclL2o8b6gVdWadjnzl7gsMdY4%2F%2FfbelOWTvuXf8QYHAFdqWcSDc1NlwdG1B564qUA62vVNzqkwcbLi3%2Fvksr110fCbMiaNgVRShmiTRuOCDQrZi%2ByJ2JyhhgWIndzBhJL2wHo4LBFJuxNkz%2FzSr%2Bn1bOCL91UaZfrX83bbGGlZiOA%2FmBGlCL%2Bcgx6DIvFFG3O0qzAd9aK6iIhchW%2F5DvTROi6T%2Fey8CJpPx%2BE3GlOhlsfUPXMwW0EMJO95kLRu4kqCugIGw%2BRcxQ2o6ghNnwEnVdjyBR3mM35j33VEvJ%2BTEyy72I2aJuwgQaqBdBum6lJJYMik05CjiVBomIckCzr%2FW5CNEXDl3kXP6DEIxdANxLjckalgDSKPawOZyOf5zdG%2FDGqLYHzScuyut74IbZ2IztB0l3CZHCkr8tr1mEA8lIUctB36CMq%2B3M2TQHpOsIPxrGGmwf%2BAMYnOPr5T6al%2FCJrLVWpSuodTe9noTGZnWSWn4NpV8OvbpxOFByJV%2FquV7IXslGpzhiMK6m89AGOqUBjUyY9GqieLWGytp61ldqpqc8t9pA5WZwN3sDytzHZ6PrZ4AcFuHn1dnIfIGJ%2FWzvbNG%2Bmt%2FRe4GGi1byB0Pdiet486R1KqLuDF5Um69%2BvDlhbLaKYLESIWKvpeLre8ytou6jj%2Bte4S8NVEbfYbNDlrrS9AswFDoLODAUcuxv4mxB2cfVKI3c%2FwdwNDMRCnWNHtp4RF82lW7CBLpe4HlGK1sHJ5eX&X-Amz-Signature=bb48ad06eea9d9764ed6e31c62c6fc4a7353dec5228d679d3f1431c03f42b4ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YWIQS722%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051719Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCICFH1lzWj26cr3qMmed%2FMGDdCL2PtRUfr8bGvhLkRZkzAiEAox%2F42F8DEVX0Bn5AGT%2FVoCf8zCytkqIKHoNVcx4y42oq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBHHo4e9%2FFHubCGCoSrcA4oaQo357bMAZg3hMuPVJzkfIHPJ0ie44jw26ism4qoXfuq6QF5SPlhMxfcPzassKwE3q5cT2Yw2zQ7r%2BOTxDV6IGLZaiVYmGLeV6U3nK9bEEThuLqt1rggLaXMNjDJ5z8725krh%2B5oFSwJr3bfZHcDqrhFxIBIxHX2TH9%2FCFEtMj0npnHKwuAscuYwr4SOk6SjY%2FQAxz3udaTH0kyF1MW8GtizFU5giUqCfxIjv8WP8sO%2F9nTsH7qu0oc9adrXqPPxvwTz22fY0GmrMPi%2FDX6vV1nHC3WGVdIKK5Hp35SlyjDfomsGVXPkMn64d4ff4MjswTrmC%2FgA8GlcrnXBuzCP6qkIwb8Ua11FwK2dnfXHD9dEQlaAeg1zEwRq3%2FuMBhd0TrjnOYmOalU3VJC6A0Yu6rcxykrPt%2Fp06tver1Y3plaNlbB6mMTc74j48V18Dk2jtBndmd2DRuaDVwW9P7c2ZOAzXe9v1z0MVZXLnhsTfNhpjieiO3DwfaM9Khuuu2fhqvYdo4N4ZEpYE7YgYU9vt3q643Y9E6U8%2B4dZoZQ5FnbL4sIq%2Bpf2wcomWPNUXKqqZBTJchUsoTIhK50Q7OKs0MixPL9zDagmr1g5yCjAB4m28M0oO1Td9K49hMOqk89AGOqUB6BcsfTWs27JreHN0ncT%2BufDICXpp%2F6JRLt%2B32GD2Ev%2FR64JLaDFhUWaK9tKDzKPyI5t8gQhk1dP0GgdpbnSI7547HJ0lvxHQqI7bn0JG3ZqAMKF2mimE2OaU2KA%2F%2Fu0TVwo6Bx8%2FVPnt8tUjrpftoSZvcFFVHd7mcGNbhQui3grecmfZbrSvg60AXdFoPGmWHN7zTS%2FVdwA7kU65dbKf9QVtXict&X-Amz-Signature=eed05ca033b6706f72b2ad8f5d23576790ea13061d284c4a3600e5e8fb8f3278&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666D3V3NTX%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051719Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIGEvWh1%2FX%2FnDCsluSG5iRH3eA8MLrCsUOb%2FXqAtX43DgAiB6eJhzAmn7Rif2ISbmNAix7Ca208onmav7L3fKTuXseir%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMl%2Ff0UoA9wJBPZspNKtwDYBZ1XIAzwMJnMRoN4hYHBnh5jkcjzc8yYuI6I9pxXE4l14jCDo0r7qfYftn4fbBYS1sYrZHzy1punksgB3jdXlWqSepou4FBNjqkUcvbCVOAYEo6WR7FF37yqQblKvT2mwSl818PSmlNFjuy%2FDE4DvCq7niCdAxyS701fyDDnmYbnmDzGA6OpUhFz5YjOLJv2fVecMplgthL7dATnAmUe9XeXmHZZLOZGMcXGVCZBt%2BbcmkSTvTVmIPyeQj9cNWOgtoDR7RISrOJLnbsu8%2BKvbE%2BUsZdYAzf1mUBLm0dqSZIurvE6%2FkIvMTMS7dbvV8eNXgjPgTknMQruJgb4dWg3Uuem7jpVhAKjIOaXy5v0rjzQd9Pnj9aMxqcokWHWlmM6PSy9Vj3xiWePFbhN1ogmdlqQ3JIFRx%2BhmvVDNFz9R7ZBCSkFURfVOzBnyIez3Ds4K4nnVM2juGkeDUT5YBYlQII%2BTaTU8k5Lpm59H8EFVyHq7JhBugbNPNSWRfxpVw6KAc%2BIa%2BeqGmw48dcsvqj2TABvWniNqu4J9brdb9bDT7lnDZ7Nzq4tOTZ26pALVJwMqUwWtpt7eU4TQih8apPSO8Z8UGuNL%2BCbDT%2B%2BDDTfF%2BvqehKXWV%2FOeLsJjww36Tz0AY6pgFy5tDq%2FhTjCa8Lcih7aHmvXl7JIzKbZeTzYc4aHYrYhj7Gl6kNHVgDVMrreHS1LQFTJ%2FAnOxEi5YxXL%2FneTyVR0m%2FCSvepEm7EPiSkDT5LU9Ye8K%2BZaWNRMJjglqeeik8Jnpcp6clNpnkmrBCMeY6jxkkf3DFjKSgFQ19GpnPgZ%2FxsqoElav3kBIhi5K5rIO0Nnd1LL8Z19vrlwOP2fbIqmNWXW%2FCa&X-Amz-Signature=f3cd119cec9026af94983c2fa0c864ecb48dcec6a63e22a70b2862d53cfbd34e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=b348b3512b2a33d7dc051b37e5aebcf9ff92c017fa3167048c2dd91ab4ee3fe8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=c77928a84b3d0e33594a71e5304c88ced878fe84630755fe34888781d365e27d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GYE6PS7%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051722Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQC%2Bx0KDEOJMPnow3I7fUTdM7DihYe3WhZ11xDHLffxOvgIhAJOkbVf6iqf7uF694TMYU%2Fjo2RsxsY1pe13qW%2B%2BT1%2F71Kv8DCAIQABoMNjM3NDIzMTgzODA1Igz5dURnEOqyI8GaQzgq3APhDtFIeDM3abEKTH0SfkOSxOem4SBO3GFNmgdKkLJ2UeAuts82ZxOvN%2FNTfla1OsXvo63vX%2BJ%2FaWMKrbjjdhE%2FKX4ECTIA1Iw3Ek%2FdfFVSAM0BNgkKa9NwKTccE7rFVXpYWYUlIQ0qCP%2FdKI1Uu2D2Wo2sGJmbkiaKssB4E%2Fn3PzI7zixI8sCTnwFvyRU6gO39obp6BONh%2BbiFAcLpFqObxZkVgwGt%2BNt%2Bf6E%2BFH3Q21ruDQFo138CVYRNXbQmQKo%2F5TM%2BuACSQIV%2FtZb86MNrmDrfNP3YaUK19X1QdY6C5W3UjHnlu%2Bep9AQEqY%2Br3shnkN12ehikQ5kRjgY%2BIXyySySwffeyNQxg01utaq5RonrPIRtU73Z38zK2r%2Brvr5eUBzk6cdm%2Fg76bh7tBWBMwzbZ12kOs5tn4k4h9TCcR1ULcVGefhTyWFhcDj7HCePFsQMWKYB1Rs2%2FkGo06lK4HYM%2BGAjVh71ynI7oNARJlNBu9dmOJNzcy1ivDnd8FMb2J6Q0X3%2BHvYOuHxAVm3pUg5C%2Bvhh3gIA7AfP98f5ORP6gyr5zFPfrtppbgFVXotYJmyOgP%2BsXzB93k%2B8QTk%2FxR8lnznyFqaylNf2Wb7O1z7GL9OMexhjgUGFTPrzCBp%2FPQBjqkAST2yrOOx8aIvRbP7bK1fMOVFIrzbRjZEx%2BRVW5u4fOkpWOLbDWNxq7mtp6x4ZJ0vF2bFZvNUSrhsWiTdWYuwd8F%2FbI982kxxfCQ3znQ%2Fl43Ma0zGTWbENMOacGCuNEpPQeV0R5M6Fqzb%2FPJ7UhPXonMZy2rv4eAh4C78NMODIQzSSe0DlixMsgHjD%2F8zFMZOGISC5KuUavrFSQgiM6nHPx30t9b&X-Amz-Signature=a3b75c294c6abeff1cc2668b7b657df139a58ace89aba0f7cd8a7dba1bb2ce4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=59e95a4a976f231cfa29f8e51d36a15e99c4f40111ab383e9ade1a4b4570865a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YREZPOEO%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051725Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIH5xkZr2aAjqq6eI67BqD7xi52ZkuIdJv%2BJELJNSjSgxAiAU1JlT%2BqqTmB%2B%2B7jTnw7K7k0f5JMbLNuU54gXjM7N6zyr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMZ26mH6smgVBluMrUKtwDBfQoQqbCNu3JMFmnhWHhBy6FNpunMUn%2FfKAsu3j8cYRUjWf6eCiVoJEsJrF47XbVQ7yfMXdR%2FuNCrRaqvajyMOqD2r9WYr3x4UBd8R5w%2BpSEc%2FRN7wTq31SlfBMzETaozIlwFNJt2wbgRQOzcrEPd0jeVjNJt%2F3eui3oiF4dAQxaPN%2FFeL0a9RILVWAk6s0PMjKoVmUEeVrMwJNFOKcra7eFWLeBkbWTvCFFPR0BmLOuZpT5AASzYTuR8Vmm0KT4tGNQ%2BdsS41PjV57mKKzmSA%2F%2B52o3Cq9ZudPwsN%2B25JnG3oi%2B8y2fYq2rrbtEaMja8eQlS2Hq9hI1REBFsS98rVY6JlB14s2mEjvHrNZXiSH1%2F%2F7AJSG1IEDQ9eDIID%2FYA%2Bgu9H8glMB5ToVKeHajO%2FwDBltGp%2BwVcSOZxkyKSKLFt1DaqNzRz6J1WsZZY5YFvwDsYRzlYmXV%2BceUCZ7iqQyyeVAHPtVFPASlAHrT4oeuFxwjlN5kyAuki9kzaUQaZLUsYLqbQ0Py5ZwJN%2FPYQaqQrIcwychtazYbczego0pBvw8R6vK4Jk0UnSPGTfMzmmTLJbl9IAAZrcOtQc%2Bst2y60bX1PTdFc%2BnyBe%2F%2B3KHSzjqMoljRoYZmpPow6qbz0AY6pgEHVF8KhEtTR%2FrpMKWfApR%2FYJgv1MldV%2FzQTHxkNUT8ycQK6RPR4UPgOdhsabfM7BKBZZZQL6DhG0AZAZ7zWCwtrVPsLwS3ssERe1G2n%2BPtHas8AtiQSIZc68nrn2A9paJqrABjGjD%2BeuXj3yPBCKSNY0AKTnbymVyzsFx5NpmK6Q1GHFfkxs3AaVfoza1Db3SwMRUlvHfhw2IxtmOepqxA7Zczyych&X-Amz-Signature=e5e7ebd716fc84f282d221e87950ee3fb7b45b0b0573704279dcf260505667eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WOFH2BKN%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDscFGg5MRPE0kj6BeiEii3ShrIldHcQrtszw8xSCNtjQIhANaxctsPKkqY5fgiq71j1mGTgjZIDOnGmGXHkUBk%2BhvyKv8DCAIQABoMNjM3NDIzMTgzODA1IgzrJ%2B0AIEBV6BalFZEq3APbegpFLbrRadOe6yWizRlJdLyT92U%2BtKSi85jOF8qtaTrVeQAudGaR%2Fp0DIInuUzB4V3vs3lSBpOZ8r1pzuKqu4wyBwMzlMDnG%2B1Ap%2BdqeZ9o9QOCPz6FhySDS2S7tCCv4nKhhjRYb3H61SiG4Y5grzUE7nkneK%2Fz37lfnFo%2FPXve6My2zlYJR4Dds4hgG4c9sVEKkbRh07BUOuBya1BdnimCVr%2F1P8SnehoW0Id%2FTNTonsvjsVeV9yN4uWAJY4z67eeRFgWoM8BsLNmglb0bHCtEXuBW4WEm%2FhG61Ut3RoAJW%2BRoJvapxHK8jz5SuZLo3rRqARyYFk251FKW1bczSeSzLvRj3CMOFQRj0UTB2TQE0141i57GNI%2Br4%2Fb%2F5MsB7ZZRXwAnNGRQfEK0eAqvwaNADGu5Vhv7FQgq2aegpMCCvvZW8%2BSu%2FqAYL%2Fs6kTQlNo0ZB2DHaWrMo7K%2FLVtQN80Cb8Y9%2BMd8xWzI0PfyydUs1dVNSxuyM4fkMAQ0PlJapRTUGYMFG7hgPjvyqMbrvEo2p4%2FRI58JugFTOSVseFIX1npH8e7PqmB5pXQin%2F%2BgsbNq04%2B86XiPdl%2FLZyJ7q1w1XlK5L795IQC7G36%2FiGiDoTUe8vae5Tp4RzTDRpfPQBjqkATg4BxgPVfQK6IYhGoh7rwhRev49xBkOpwWqkVHukXfjo7s0vlMLBZtAGAKlfONaHzFVKZLQ5Rqexf7TTGlaVjOis0HxbAmScFMqrDAF9ngswkGmbaYP9f5VkBDSrh4NJUXdK5ykJYcenVXGGfkT%2BSJ9IClb9Xg0Q0ezCnVMCnPuWXKvROBdi8FVVvPX%2Fbl2IZl7DeG2N%2FuxiuzKJQqmqxGZxo2r&X-Amz-Signature=174868003dd83a89e01d843e643a869e7b3a924a536ca7321731562409c09b72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T5SXSZWP%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIESn5dhOJdf4JFveH6%2Fdqg0ndOUR87qBwfkyq5KJzdNsAiBaUphR7bmITnoMdJRyTZA8n8L6vQ417qCu1tUBaVd0Byr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMUq%2B7e4iSLM7jTYqnKtwD73GFLt%2FYQsEmT%2FMJsYmVnFQPr8tXxYUWaxfiukyZl7%2FjF1q5ygb6bVRCYRGAo4AjQWv%2BzY%2FfKNjrBJkW01Jq0Wmd0DRsGCeF33SpX0jq4P8c4tt9%2BqKMLz5nyPuxhxPUwIwYOZAdd%2B89d%2BjoqiXx3tZQIeUAau%2BKMLOV9J02xtBgrVWJSHlCDRqSt7ue8WRNVkN67vBQ9a22Iz5qHOydTmzaSFtDSRS%2FoAJw7WtPyv8oN6EiC9%2Bki2En%2FlIbC29PwDnZKMLyTnI0MIzwKrbqWsxibPtwJg3f%2Fgp4XD3g393%2FQ2tU0BUPsvXA0lSoDBmUrXoQP5Y9i49f%2BzUlxJC%2BDKeiV9Q1VoTX7w7RMW3HWbHh5JAYRm0yHv%2Bs27GCcz2G60EDymRdfRUVuQqQ3HkVltVdk9FMHae5gKdLOft685y%2BV2shXJ1oyrykee4DTbMonvHZxE00hV%2FXi5%2BJFwMD7%2FOBqMFOtO9fWv4YogqVr4nPVQTxFQnE2REbnLYq1grikTSIjoWJRmlRbUvn0StAz%2BBCphzjpINvgC0MU%2B5eP3DWh6iYhxDA35ivowMZlYtTgGigQaNfjRTlQ7JQGhHXhBp7TV0GoWqtF4fRrPxyREYzoF%2BdE9gZDPi9k%2BYwrqbz0AY6pgGnHpfY997T%2BKb3j1jLWeC54bIKRigEJBKzLxlHla0np4VFwXpKo7MzV6gVuh1GunRXyS4jcaUDVRExsC%2FiQTBh9Fu20SgTq0wErd5Bjzq%2BaaMOrBLVgckMGwArhiOS%2F9i0H5Ep52tKq%2BqllzB3%2BsQxNDynCCFFAM7ulkrWWrxOZzE0BXkyPCrbEMkGimEgzvKi%2Bq6Ju9i5P%2BKCz6nMWnQ37OymHW6y&X-Amz-Signature=3ee2b2d20dadaf220ebb0609d804452024545018be417eccc8a4bf3eba58562e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664LSSO3PQ%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051727Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIG3cioiQLpqUJpzBAa88dR4lpiWHvo1AepLnHUOLbt2hAiBInMio8%2FAVvGdA2D7aA6E4VXNKjLBmPiHSlcY%2BYt2Acyr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMSzDcSuz1Ij%2FnP12%2FKtwD%2Bn390okp4%2BPzglN%2BP1uS%2F%2BmwfgFt%2BSWDiu4%2FOEf%2FDwCyyrLpX4%2FR0Eu58x1lmPAo8IZRFphihENfJ%2BxnnKVQyJKqgnX4B%2Bsw7oDIdPC5CrvpTJFc%2FhyZAFC%2B8wqXaf4lVHIvFcdnylIi9%2FSQjq3mRHEugaDd9Spka8i5NgVjSwdKOpDeh5ZSKFr0aec4%2BeFJ%2BzSyQ3zej0BQ2sCTJrX0PiyYuNafVwOoT%2FxSOPj9q26iMtctPVvW7UAojmb9ueCwrvAYViRENJHKUyQHPlqcuQ3oKFaXDhvnA4BkW9lPDYE6BwNCKAiERBWk5oDKzg1KmB2OF2Vn3lmjDm9pu74%2BdOC3BhIXST%2B4TeXNCNymG%2Bvs3z7pSblT7iUtNJH591YR%2BGLzRUFt8eg0niMIs5g8poUmA%2BalGkUfiUVD%2BosoqpDKJzraWxKKBIY5fRb2u7di8M3TpV%2BGzhIo4fs11n%2FabH8diXKN5ZRQeo68bCfA3NIJOp2t%2BdBPm8CiGnrELbNmV7OSzjI1wwJOtQ0dVxr8derNYjZVLRpJm6nTCCMNAhrzhHk3Q8sLDyIvWwLVFAuVfHwVBfk5DzMSl8PTcUiFsWdB0Hhv7LeYFMkQLqwJTvbr8QevtTPMK8Z4b3wwlKXz0AY6pgGD74Z%2BzxpDztPABrr9O6YUVsaGon2pHplBV89QD5kZ2OwIULJl9XKW1szhaIvCktlQeqwZ1g6j0sfJ1n1ekx%2FdBxteDBz%2F5QEVN8JcDePW3oAbb3Q5IMBNeBdVMDAI2PqgsnQMqST43qnbHYG1IPhXKYwj6COCggSHrywD%2FnDE09nX5%2F7r9W8COhRfClr65%2F1%2FHiimT0ZVBarEGPVMip5WsFkI6k5m&X-Amz-Signature=2f433d2aafc0fa42e4f9cbd1237cac12ae531dcf50efc85a32ce324de64894f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=55e6ecf4f5e7561813a342f5f10340188055ca2d8a66ca01f694b5ba502a9a95&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZE6WKG2%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051707Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQDRz%2Ba8BMI5VlK3QL39FU4uOErQVPRD6ONBgF6pgMjRWAIgEkYuYmDElPY9LcwT9XS6ZzDJHDzt845U9Qm%2Fd4BAHfkq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBueIyJGBqh7RgjX3ircA3ybTTcs0CCPpKkzA0BQeAzMOjO%2FTIO0Ey9T0IlF8MCyb51dO8AIjPPO1PWaWz8hb%2Fes4CtT6VNHadFFrTUEaxipugsKb8%2F4kbm2zzizLBAB%2FxTfl8Ggf3FRklW8ArpaSDd6mjL2wNSkAynvpwUI6glA%2FokAvLM3%2BsdI1QpdYBtqaGHjxq4oSy03C2uhc2fCYXzuEf2yKpG4vzdbttEuIeVnVM1Snkq2uLymzPkwIgq58QSbRJ8v9e2CFZynX8BrJObKN%2F5aiXRfXvT5biVZa5krgHhsMQbOsZZtVHz3nic8wan%2FvXxOI%2FwtVpySByu2gMziddu5jO8HMptzlWNtYZQTcwGsSSidewrKHPpZeMbcPemdUOzEk3G33HBZGV%2Fl2vUUzWZAPNeR43erBIAamH6O4V%2FqPhaedlUhV%2FbnMPQZbxEBHToV%2BNMItHLZb8YFXKlh7J7gbjjhsC2%2BiGTWqtpkI0NekoFnGSDETiT%2Fq%2BVFfYA7AuuinbbIoPL4wh7mmxxzmaxzfMmBtjbOz4jnlmMc4StKbj6KzC%2BdzQ%2BXoBeUZaGrSAivw5UJU0eA7GEfqEhfZlZusUWWfGhFpDxhQvSetbBRe14kh2oZ72MKVu6mtNg30HN5AAxg%2B7h6MJ%2Bn89AGOqUBFXNEdNd6l%2Fvk%2BZEDUqUJJBey8Jqhc%2FCWxg9jJXo6lSjKuqOhLu8NFzDacS7kO8PkQNKuyrsKax6MFAuuF4dgiXqsjI%2BOvK2mqPG7iJzo3aCvACzzPOOdnEK5M%2BXRO%2B1RTJz7i2HnL3sr0E6zier497vcqB3jPmox2Yo1wziC9fUADvLdxktK8QQloOEo%2BW6XAQkC0fA36XqjIcILw%2BvMLhv85XE2&X-Amz-Signature=fa620769e340af33d50e42480963929669e0d0c360f175334b6fcbed6bb206de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

