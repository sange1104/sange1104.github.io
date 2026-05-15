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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=d1c3f14b41aa397dfed7d651c4ec28adcd86d69728731fdad757c95962158d98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=f310e1f400d6b9d5eea29cb777bf450ddac64bc3c5e28501d1179bfbe25b5e58&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=371c2a1750fcc819df21c9d4ce96e07ef8d6472c57621db53b216045feaa2650&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=5c725d0669fb5f90f8ad6c246aa0f3cd80692b95c5791a6494e13f2d68816acf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R4ZOIDAZ%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041845Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrPsxnAtCDUAam9AggHOpjO%2F6NVLsNbZLgCe0w1VTN%2FAIgMWoRhTQ7xvZQF06Kujo2oOeEg6JkEXEviVCRHvlgykkq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJf0W7umB%2FkUjdwyqyrcA%2FdDcshwwkUxtGbFM96aHewA8grYU81ij7mxgO6QMUSd0cXtGX0QBE4hZvOvBTSIVJyVDHsKClgaePsUBV%2BPj9h5mdzqu6Qtz9DSwh7Vlisf3hfS9644V2kummUTSdhMDhxFcZWmdTdCjexXziThyZGaqU1i3kuwBxH12ibndvl4pJSlfjvsbeLY6uzjWarFlvD0J6c0LUXGndI8r97kq9f747dMc461nHh9Sui7Nzp3hoYjGwJFN%2BkmxV1AgPFsozf%2BGphAss63dbnLskkBxwQFLTXUpPDjOQCehbhvzSaMPXFK9kG2cINPjYfqNxYXOOdpfZG8QzBj28UxKD8SQCPPIicKTiR8YJSFGxuVdg3Am3OfZ3vontFpN9lnFJs4Nh5fsyWXpNzQok16vp5d0%2ByCiwShRXdNBuul4AJ2cnB3iRW0AJWfwqNGlzgoAmjtpggFzoY7HieoK12MpNMOhEx36evupVD0mTzIz48ZBN74waFfTckSlMUAGMGFV%2F3am14%2BDn9%2BMHW2HcJAKqOaVAUTO9BpzNJ0sKi%2FN4rMTpb2ef0nafTpvBbpDx5wyuJ9NqtgogHkR4QIoCfjIAdyIOCFVbtfMxxVcOm5lTIeR7PGDknOKzVa%2B9VFuiOBMJOUmtAGOqUBCYfTdC%2FuDBLmaj9Wm2BiA%2FFh99Tk2jzhpaMfKjOcV%2BzSFspuedyQMmyxYnAdpZ3ily6qQzHB9qMSZbtMzriY3ntHPyZNuQh5qHn9Yl5PcwjQOhMJce4ivaF2tZaj3wx%2FlIGtJWuPyY%2F4QG4zpLO75R0TSEmxb8mUKBonwkdOtLouKwh7jcIzMRQpnn566VERxiyzyt3JbYf1jI%2FlP20edZ41edpd&X-Amz-Signature=a34a229691b6148899de1abb440fbad60fa8e34d262e4b8cb2eeec5ebdb91653&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665M5FPHWZ%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC6ScoaZ0uNlt24yIW2dlCIpwcy3wUNYF%2Bs8OEsM%2BMJcgIhAJ1znMQS19RZlCxDL7k2Nf9Fd8DGP1oZB4aEKQjWsBy%2FKv8DCGwQABoMNjM3NDIzMTgzODA1IgwwIiOSGr9PlRpnvc0q3APrhJC1DphMoLf6%2BmlzyMmrogoMzI8FAiIfsPeMKiJSxpEp5ZWZ0NSSn2h0TWCTISXFp1w5ON68AhKhUwx0fznVpAw1Rqp1rgs59M%2Bf9J%2B5h7CZznAbJNj99PbVgpfNINqXteorWY8lWEGPeZZkdbv%2FWWSAiRCvUJCAa6e97h9A7A5cE00DxXFpgxd2cHa78GaaZJDZhwaO%2BteDq9HFc1ROOayKNppkrIz%2B95sX5%2BX0sVNWUWjRGKjURIXytt9%2Bd5tL0Cf8YR2ZPRwjOxswR8LfP46BKi9cyjqDcWFmLLCz6Cy0pp1fYBiNm54iGr5m3nISDvFnZeWyV1%2FxnoNlF2hUOqYnZbbgZUj%2BVpSIgWqboO13xCUnIU9kW3KAB0MDMW61T3Hpil2YFHg7FXKyvI3r2QllQtaAGWk7D3HkB%2B1EFomIbt2adMdmtAGdnCueIHwfk6UHaGiEhwwXfe5DBpk4Vt4%2BGtKQZ%2FlX6s6SsqSVo0oPwh9d9xGWacIKxj8W3aADsBfnHBMdarZjswQd2yy2Evmk71KGTogt6p9fqX4KEjB7cJXhO27%2BDJ6f7mvw%2Bv3%2FlFMUwt2qwguD%2F1hoGdXNSDvWosNeBI1twhEk5bcBFQ1FFOU3Z9CiTMK3lzCXlZrQBjqkARxcNj5p%2BjReoAA18q7EE8VkqcuZ7VCS%2BC4AvMsSBFffT0JW7Y9D0bkaGmiljE5pECTjc6BQNevWJ5UL%2BvFwfbo05hAOZqnUWDl2uqlUBEHVGxwbCp36rsWn9Ft4a%2F1g%2BC5kf80nzRJ0yYz6rIdr3O3C%2FCiW1l1t1GhUUx7aUMp1Az%2BsfzWhzxil452kvR%2FXD5BZTNYj4Yt%2BfpEfRZ39kjpHrczU&X-Amz-Signature=94ebbf2b97ee1a517d87aea0f5a0370d2d179181d5d14a845e1c907460d02f17&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SR4DJTV6%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041854Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIElvdnj3FCxCTvLkKy48swjefYz10cbymKUtAZ%2FXU71KAiBHd2xmpmpvXFrRSvD2x5XX6Jo%2FSU6x2SJP5X6PH%2B%2Bo0Cr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMNQWHfXqe7AmKMqXWKtwDzit9WY93%2BXuRUEgYQBxpBcgRNc1UATgi9hFDGjXzWL36v8jwBgJJJJlZd%2FnLU1mfg1tkwTlCd6aCmfZ6fGvCxlV1amTE9TEyZLB5X57IAjVROKcJhMtjTzBe8qTcYgUi9o4VXu9HHQc9isyEetK56n0STPUfjf6o8MPoVEmx7NG%2Fu7BnjJfynaHPDDlfkp9MingqjObym6R1hVoLucLYBzu3Vo7gMtvqX17ssS4rpXZ4FE6A12K1%2F3qYLyz3GgIBx52VnIJOACovDEZ%2BbETIm2q2WMFC3bz0bZv2vhy7%2BVk6OMPDTFFgcDzrLlEoG3GgN%2B9xsiGwP3n0bpY9ka6QMt3uUKxDJ1rSdQuZaLSAvVuNwLzCdvpxgaB9vUlDSSmJoDfSu%2BgbT2SNi3J81Xh%2BHeLLS2I6aw0c7L7DM8IaXN8uPqac3T53mvWN0l89VnnIWNQLLXjiSQuhp2OnWmbCphJJ%2Bn9QHVqpwM5yu7eBxvExoiqXtZVUPrmX4XNhyaJEfg4%2BEmQggJUj0%2F6lZVTQqxNzbJGsE3%2BHq9UIoX%2BLUERD%2FqE1XeiNDryGrioM1fpduUHss3uLU1OQQmFXxORR%2F29acY7qgVZq3baIsnRqrHd%2F44iet31CYJ9yrugwupSa0AY6pgG73guS44VXL8rkGHHm9Yyu4nSmfcq5i89Tf%2F5UDmBpRqa3XOLcO3lDHuxxvHpXGJ6Wo37Ymv%2BrjUHruZHgOsM2XnWcXKMPMU3mhUnWNbQ5gC7ge%2Fs4o6fovQ5jkLsjugp9MhWWT8E39aQxG%2FTRjVJLssfj7Lit0rQa2jubLWtaYj%2FEU0I2B33NuTAXAObkwCMSgSKXg6D3XcQWBcFkFvp3bWta8Npy&X-Amz-Signature=969cb01c0a057ce57fecc0b5cd84ca235295a6751473ffdad7240cfbb80b81d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XELQGZ2A%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041854Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmHqjaKlvvcVn5PCfks1Z84J5jUjYt3BAsnblfJsUCqAIhAL4whAKOUtwylOxLI3aAO%2BAO60m0Ur8k%2BcoqgI%2F3vNmzKv8DCGwQABoMNjM3NDIzMTgzODA1Igzk%2B4FTvvKsjhUnkHwq3ANgEsSoqKHUdoS0fHJ5CwrxQkWMD483zq2GeHgWHVaCn8wfpx%2F5N0qZOcstddgNdYRqiuRuAIwCC55qFcjCwOZ8ZskhB%2Bw5juyK%2BXnYi1lSvYdaYfz%2Bghs7HtFKfUzp6CQicf%2F%2Bp%2BDYfKJo6V4k4f31xsFyEHvWmo0lw9APNo4Qp580%2FnFHn1pRgw2a7tYsLUDixcMnH3EndmCxIB56g0KFkdwDVYG%2FcNpQoP7TgRMyPm4GGHu1ittrwUPhznYMhRfZLCnAX4KU8j3h%2FYODsihONWFafLJPkeGXYUBo59%2Fu0jEyOVfgEaYaPQ09FVYErbHqcbBLseo6L6uzCWVfCwiMKIZK82tILHYbRLPOlaxDY7QygOzhttTTuYOjbTGUhQiMv12dl6N3g8QG0Utt0yt0AD7l83NpXAResqAUCS9ZIc8jh%2BT6rhx2dqHENnqS7G4A%2FgvD0rpobpoXTY7vxY9qrT16KRu9hnhDS7Ax7HZ%2F1gCly9ObqBx2Py73Fkfd3qavHQ33c4zbDsZRaiu3FchmTRxKK%2FP%2FrTnlB5R8Wt7xjTEQIQodldP6SPUWlxQ%2BLEVs4u40FYdneW0kN3M5RS%2BsoGkaHpyP%2FjzQ3ECrzONaS%2FSW9YkkkJuAoNN6FDC6lJrQBjqkAdUhtpWnFzZq9Aykiw%2FmkHVH7MfP9fYeVyHsQ%2FWD4oXbR6Lr26uJCuUeynfPoyvDp6V1CpaMRy9XNUfCiwiZX2D5LLLWDnNECq%2Brs9w4j5rAfTMs269FMxDHYbnDdze65Y9qXxJuQMDs%2FCamNjm84TTl4bumh%2BV5dkhCxa2LFk%2FOGkD8%2Bnta5wmG46qN%2Bv9Uwa%2BxD2M1C0clReYk32EjPbIgE88c&X-Amz-Signature=57589d262321ed286f818d6fe1baebf1600fc6a9fd7f2b0ec12307bfadfc16a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=39bc5d09b617b4a0df0fc8917b46477051f9bfa37b8fc52eee3b82bbd201bb14&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=e05be9e287e4ba04aa739b8eb6522331662797b274c9eadd6f9af38668ae4ecd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WATC2ODG%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICT5eMKZ7l2Ut26P6zOYZt8sO8gro5CAkTzfh5vvvoimAiEA5jBKLUiYFAjd8YpmRGuoLe2q4FM5o0iu2RUoI5p2cXwq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDIjvL3f2vmXKgMsXlCrcA%2Bd8nkY3rLbL2VSZl7B%2FPN0zgnd7v67F64oEUL49FJAopzfskF%2Fd8SykCrNY3A2r0jcapc7G79HzjDJEolWi6MrRgxFeISEh0yLNpRm9V3%2BLZ8GVfaVguHqxPLCFJR3vYlxLs1%2Bi7gQz2ek1s08%2F0yPQN6%2FHsWyYwonfhKq1kYjZe3LPhQpj%2FnTtp5RiWWMP7cbhWeJ589QPPU3yWNnTbTbi0szzNVZdAsE4GrtqpM52eoiUJxKLCbGDTRDDn%2F8vNqj0fZbCNSPv8CDbyOUq6LZkvXDSN%2Bf%2FEtzw9%2FWlSGzo8eBLPGJBk%2FuQqmlN7rJXtzj3r330p750JcA6xISmmrFZnVzk%2BeYWVrPUIIs3Algv2ukJh5TANYYnwsHd2UUtXopduA1n5COdqZGJtlM%2FJbPtZJ1SRv5vzIWPUuS913Y8XPkWJQgYZevv9OAYh8sIyP0WmiPeldePEq3YfuSuI%2F5D2CAYb4mfKS54Ya%2BlGyPtH%2BXc%2FDEic53YlUPnWXUnFsbRqaFEL9xB2Dsk9vWhmXRn8FEwm7wt52N7vQoLxpPrdBC3%2BUjo93cIz9FfAMMgaoEe50xj5b%2FiVsTBGjO13B%2FSH%2FOpEOZpLCPiZhiMlc1iI2f3ww%2BBOXTGoj3xMNOWmtAGOqUBq8jXi0N%2B2VfFot%2F4J9W4LUnW%2FMYwoL9HcDnIM6PZp%2FqMiF1bhV0bhWGgw3Y%2BU8FES5Ui%2FS%2BvF5NDv3ia8XU1krIDwma7BncdO2O11cdpWmVvbokmenrJ6eJ0WEaJIPEy%2B9NIdW8WTyGLLs6ztVYhvdpgQ6COgWJez3E7wxwWRvYaaSaKO6XQaf%2BkvyBTm4M51T3TwNskp4bVUakyqqApNDjmdWdH&X-Amz-Signature=2e8c1e9cdf305166f1ade7739f185b604b3003d85751817fcb389c0eea74559f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=ffc6475c8d5e19b4016d64dca981a485f74ab809b70b15d675407aaac7a099c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665EO7LNCL%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDFGRTQHm41JRuF0PD0l89I%2BrWzS0VhasvOA8c7lfVORwIgf24Aazwrzuc%2Ft%2Big3SCx%2FeDlHmq8nOIkKW3s23u8MiEq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDP5yZ7LAGWwLpGhgwyrcA53lDcrbCYHEN%2F4f6jP2VjCFiIiTCtBcU6tnRmENCfSg9OrCYss4C27tTG32LAx%2BQ0CvvopqyUX5%2B%2FO8oLYQ2rfokLoWWOKPzID3TpQWYW4T4EjnRtcVg5UYulehBmZ5RbSv8tQ1H1JjT78rrBPHzV1YUy85ortH2BGg0K3Mn%2BSmF0iX3mqpS9PJ0FC16hP%2BIyJYWL3AnlcgM3t0VhZ2xjQlCi8IHpuuyC81hFrcOW0AlU4gsvFvG14RXyqK9zeBFl9cqJZfPcWsn14WE%2BivKm1SaBswLAOCgt6neBeYzyHKuU0sbnsafBWBItpspS7u0fVGKzkavYOYesJSRncI%2FHzVGz97RDnFvIw1iuD%2F1rVAdxITgTmFUspFtr4JtZGF7vHvbDZdYXQ7%2BGchfGSv3zzxnZGkxEcAIZwC37ek3NLVeTB9dtdHQpui%2Bs2J%2FMr%2BgBLz16yY%2BCTouScsyU%2BjR0dIzB8IV5wERsOUf%2BjXX5%2BpVMe24XFWBS0CMzvbHemOof3hpx%2FORQu3OPybPfev7Ej%2BP2qSc8NC%2FqBDq%2BboYkqFWyM6XuequBSYwPlgZDdGBFF9E%2FgFGcHZpG83rzl3xfUnfmf1X%2Busjm%2FpbP2CXSGA%2FHYhUdRUUNdp6VG1MOaVmtAGOqUBwZO5ZizIIn07XsaejjrpGVHKJ2UOJPq25TAcnO%2BF%2Fx%2B1k%2Fmi%2BWkxICa035MMJKMGiO39oJ5UHsfBI165PFGVvuUIqdrJvHSt5JrxBNMQZ3903%2Ft83g9fvilZOwc3sMHfOCz4FwR5qN6K1ibBRbfYMZ8ARMPy%2FwlXec%2B%2BxbgD%2FNo8dWxykrF%2B3S32YT1zEc%2Fh6DyM8b9MUciWKZcejaMhyms5EIwa&X-Amz-Signature=52d793e1b6f92166a21c6257a518c151a6ddad8e5ca52fc40fc9b3e5fc917c20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665RE7II2N%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC3YLCJFPaxSRe%2FnFK04j99CswplcxG%2B0opLhPaNNaFIQIhAIYgQobUmNBNTL2t6r4AI2c3HrXQ1L8q7ljYIyGDf%2FP3Kv8DCGwQABoMNjM3NDIzMTgzODA1IgwJ1kEHO4VD%2BRBF7ooq3AN1RZ1lBfuqNua3h7zarC9r%2BGs9ZB6LK8jRYkHfOxOcFqA6Z%2F8AJmvMHqhsiZCRBZZz5P%2BYyl6cLCw8YYL0goZEW5j1tByMHDB6OjescSj%2BudeCoiUPH53uSjzrSfT3ZjUXmi2LfntQ%2Bc%2BfsUAR4ZKJjSZ9T5VmhL0AKk8L8QRi9bDUJDxp1MYmdxQpVULISJ5Z164a%2BFJ09z542huogigDUFnshQgK4T5aXb2KJzZkBuPMSjsI7kFJuZqSDOzqyawU%2FOwTvXyLYVKozOUt%2F%2FXed49GJBPW1h4fmfdQiUnSjvaVIkeeaSawlbwuppj0Hza8WzuiF1CDfjraFZKj97ZHFFYVimdFCne000Tb05k6uj1jp6NB8MvQkCsjRPIzHZqEU2jmyybhAYMfBYrjXH9nk5RAI8ZUP9pypOXbsE1paJvPq371XRzOB7wc6XMPxLAXLAwprNAyJ7f8Wu2nalGuRsZ1Z%2BLPMAmCAfGW3v8QaaoopAZO7r7TbPRk1ytN%2FyqTArXOqQXDVm5oCJNY3JV841lFQ9Wb6H4Ut9CbF83ca2eL5JjsbDxxOrfO8J56JGwFpk%2F%2F9c2%2FCowrMSjlGl5rINc%2FiAxW79rtG9APRVDNLvpncBtLeHZnVxVfkTDRlprQBjqkAd9Rpk3nKRzobESQq%2B8EbgxezgkinMMrbLN6MOn5NopibLNGiv5Ks8xQig%2F8PhM%2FQWgY4vwe4fwvAf6loHE8OyB8OvF3wKFVol7cPJssD%2FjH46Dy0LFvidA2fpYeissPIrITOscDff%2BswDpyHKzmyBchXxIuiZaYLW1z5aIaY4LqwO6Nst6gQfG8i%2FECQtUr5IQdtkwP4opM12Ma%2F1WICuj0nU5R&X-Amz-Signature=05f14d775dc24bc8d67fed1e1ea1c1c7f6de466863c73399d5c569dc091ae00d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RRYCW4GP%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGtDOeKvHykigunq4K3bilD2UpubQxOKcAKcAn4PAQzYAiAn4uqj%2BswlC4AZBG2Di4ZVChJnJ3mtl%2FiS%2FXXssStYuyr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMpWhNa%2B3lg%2B0RmaFQKtwDYcLfh3oCF2Kds%2F2yK8ejDkf%2B3NzPMzmfdTBalip685Mlb6CswXkY32gAw1v%2BcNmBHO3KG7T6JJgBHjBSdFJ%2BmmguBvBFoxMhsYgkd2nex8vJNh%2Fh4nR%2Bo%2FW2PLqatEel65bQNtaRwee6O46fzDBW79hXQN9eE3iXqg13YPPHVH6F1d%2BCdN2EltF%2FER0i94hf9srrxgZ35rCRuB2%2FRew9LCoJfy3hsNgE44C0yTBs5NmF2WRFgdt%2B9pLz2IePH83j5Z0gzZsC329u9fEHRfSggYJr0SY1s1PxKcMYHqjxeglIn2pTrSHbnyM2emHZKbqfWSbW9X3PnETBmCY%2B2Ar1U1SitO8JqkIMCV68zXXWohCrtBCstlBWH8hAQBHEjcU%2FBrnd6QUdSTPFR2xM6wpKYNl72HMPb2z1Ka1qqSZG3GR5DjbCvVfIqHzoBpoGaAc9JVf7QtOJeuI0BJ5%2BSGsH8uUawuz%2B%2B1DTuh7TFOaBxT9AQDu9FOw3t1kL1Fd8EOvGb%2F4vMoaNlmhpQTG%2F4sUCbmi55aKc7mV%2BZF8Ra20Z4o5pvKtyo%2FteI%2B%2BXcSNqwZud8C9r0Rt5ovBhB0cqG4qXJDDNZnBu4FLSyozcWIqqcevSAcfDjvrdePrz0zYwmpWa0AY6pgEv048d0L04d7eqkrR3Nl%2F%2BmjY1tQjnWBS4W9S%2F150Q8f2Rhax%2F2dtrvjFkdhwQ08dj7Ej1CkjidBmTq9vb0MEGY6BfoWvq1XM%2FZ8KOMxM2uYeKqu%2Fxug%2B6yld6wCYBDTdmyRm4LI93nsM8FebrQNTwJKJBMOTOR%2B%2FOz0IXytXDt256t6%2BM%2B8DsPDuvWVzyVXMUOd4mOyYCuf08KXooUMrYlNjGsoxV&X-Amz-Signature=5442b38ef4ea183418acbf515f031da3a5bb7c3c30ec00e40fe810f27310ee1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46625GT45HL%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCBff0nSzZeURpHy91G%2FF3BHO5OV%2Fi%2F7Jh3AR9ndXrrEgIhAJOIq0%2BTNaN68v6q%2FMRyd16g8ZJowP2YV0OqH0hU4IXXKv8DCGwQABoMNjM3NDIzMTgzODA1IgzvnOdinOOiFEk3b2Uq3APc3XJTEWvXCk0aRmhaZdR8NjhSFITR3%2B2VJD9Fy9hO0OzPmDDyR6Blvoh9uwHhyYaZd6plclDxc5ajEiZiQ8088JY3ziPjgut5yuNz03WjLZ9yxtlZQbXLgMYsB2wd7V8aXMIMBhqv%2B%2FUAvPyx2GDfmVqMEvNTtM3w9zhS6vfjD%2BXlMj9meNq2ItcxKn5SFbSd495OPOQy2ge%2FdPenLRnIMf%2FKFKUvfhTHuULgCI8S0ivPpL1ROHapptL5A4FKxFOUmEm9EmUjMhLP4FTb9FKZYyoP%2FdYjvKxKSapSrmnbiPpJZQs91Ehjm%2Fp%2BylLb2wmzXmIWxW1c1y12u3d9jP1lGihZK94rQTGGSfEa8Ww%2BRAessT6emQ5jyyZXmFx2iFoNLIjxuP5kzpiLuYCOXqNvz1VyR9s3W%2BaiQlFUDIAi2YnUDhnlcjq59%2BBvhUA5VuckApo6aKD0EsgigMGh76dbv8g8vWuIf9TF8RDmePXLjtaW4y5GeHuorpBtT0hihp0MyA3ONhQQuvdz%2BpEjkkF9LQDpQxREEjGi3PmOIhElZI0WjNaDXDh6bPL3rEwnsowh5TAw5LUcuPPPy588dNWMkvlmS5cqqPN2wdbN5mJ6O7cPbqy2GAISDGgYFzCNlJrQBjqkAamJPhTaJ2NILA196WWXmOvpOySWjFmpWI7KQSWiIHID%2BJqNHR0wxIiKeZI7y%2Ff%2BJ2PUQyJrUbh1CIye5utcJRf%2BOIMPQ3Iexwp0pvcLRYXVYPIgLdTeCsb9Vl62jZuEt1aYThSmA3SZF1cxX8pMsvKZFyDuLuwfqCW7F9Xf3Ge0DMk64RfW8JyjeDB9Au5bpEACTNlHEmrjnUjfedLS9EzIgmYG&X-Amz-Signature=53c6b69e3b5801f4b35c715b7f4317ce9822cce097823189952b90d67e544e91&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=fa87ab9742a1ca589e3ea485e3d51fae5d917e07b1964f9e9f7cd06fe2f5c6e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3F5JKJS%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9oCwv2ZoupHwoqQy5gG8wN2%2BBO0cH0w0d4UdUbrfFUAiEAh7ScVf0sIJDbbBUJ286zyoaW9JzVO9WelxY%2FQN%2FiF7gq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJ5zm%2BVtNO1sZ8rd4yrcA63HoVZfe6XsG8J4AP%2Fs8GSTSrTlgowInYHQwlUNhXlQgJ6hnp58LhfJBdRsWWXaFmS8Y0JJHPClWl%2Ftr0GnpoL0ljhIBuiioZZ5FFyrQIwuh0f6ePC%2Bl9mxTQGNp0hK0IlnkdVJt6rTj3rZNZVFfdYLqAIOpPK3j0A5UrvaU1%2FEPS1ImI7tnjQzM%2BKvPBuiL%2FYM9zvj32H%2B4PLVlEuDjAof4yPlTI6jOhby3sGsmuNAlsnnDxDgpK45JdJO1r%2BzxdsWAdviEK%2BXIUXIhILyT%2F7gysNIPltW8wwcGkqLHyJ7bcZZs%2B01HecdApJbB90zQQBDOW9Xezm6NJgJf4qNSYRNU5fpwWqnLEOx87ssGdDeWQR1FW9lxJoI5uKwwieSXWhW23OKzybBevRcVYggbVSnWq2Qln%2BtKoI7F98WrGczut%2BR%2FBDP4ZE446ODYTuftRT1y0Zz9ESP7jbvagTrFrKqctFGwWg8JchXXnT6zuyXjdqP6QfSxn3pDkzy8zZ0Why69agaSPvUDNKjg6X%2BQdXeMEA5APHiplMriB%2FDPZNtuaBdwLQDkxOVtdOqRf3n4CmSzf8KHBcPKAkNjtTRgei1OwU6nmm%2BtEKs%2FclRswMzarn6bYn7YxJ7A7YRMPaTmtAGOqUBwhqyI6atuoGjwWmr1jqDt74d0Zw%2BmaSX9sMNth4OoapPbZvY227h1peEQzSkOfPvWiq%2FEoZ5j%2FYy5PmwauGDmZ%2F7ZPEPRKVS2uvfmncvXcG5wlnLv3Tnoc9hCDT%2B%2BzjUeoA%2F9WFAQaXt4EwAya9yH8LoAcNYv3qF1hbCZhb%2BEsojXzqgmEw5zEy%2Bq7Xli3blZWmnhnRNIjn92xmKVlMc%2Fost3eOl&X-Amz-Signature=bda2b00a562d249a06ddc4d444bfd9b7d1b0d2b07e16f358df6cdd693c7c7ca2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

