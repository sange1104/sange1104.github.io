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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034823Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=33b20c08fa48068853fef598c09c697876346855c958618d8d88a1623c9ed0fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034823Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=e7714a7f93a9eb9954e1eaa565613b4cecc3b2b442082badf9eed4b22c80a7b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034823Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=ece7cabf72a0b600fc29694ff1a2720e39ba2e22b8752560b30441036b5a5cfb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=7281ea8ae20d41dffc245d0ee14b36ccd12b8914e17be9091336b59ea747c82a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SC7J2G44%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034849Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDffHObUuJzFeWKNwX%2Fp%2F6zN1surgY3fOGmume6Ld14sAIgfDX83HLeYF5pocMn6rp9S6WfnZt5NDVUeXVJf7877pIq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDJ%2Bnn10SbAk0A7S5DyrcA1pWoSkkPwdIDfUpsz%2FhWzgyq79rM6YEWg0OEPN1lMgmExm4o%2BKogQC5UIh46ujM2rC0jD6xs6J%2B0ClIhsHz5mxwKaLBvs4Wxii4I3oXqQhr82%2BHQbRSuBsOofxKjRz%2BogW2PlxdI11hyDfHqLBgEsvZ8XKoEODCEiT59mR%2FPHCCvH%2B%2BdMAjEs%2Bykkpzbb8FLozIs4FpDDpmVjZjngeJqHxTndRY35A%2FL6Dd5aYV3VlN8YBnbFXgjublMC0%2BLSuAHiCycmNlNzKBoYk%2BKuMIrOp8dAF0MGpGIZXv69cDqb8Q7dIjISWHStN1nZ8yKQhctMTpJhyKRy0hrqiRbUNCKh3Qs0uBJkKcX%2FwMAYZlTv5XjoXaklgI%2ByknFU6Ds4z6B0tettjnTbzmJjhOt3UA6BTpJAe8ZNATQdZnbr5V24ldBMq2XY8XdByAl2v16TvRH9VVGcqUe8ltJxjme1siv4RMShLo4LXqMCh79KXZJxWy3c1OboWjrPGvIJAOslpnf5gSx9cQ5H3cocjIZebnyUSql%2BnX8wAG8Rlq3oeX8SvSQOiBmkG6Ukco0v8gWKcxYvfjsNZILxGEvG%2FhpPsXSdG6HjRZIgitdUMN0X2p8xQ8l%2BzxKiDJfWtzpIkJMKWhss4GOqUBHqn2Uh2lFUS1QpV%2FP1SZH5QdB8pzzd8xEGXp%2FbuCmId%2FTiOfTJ42ngTBOZcuTYW0PytjSwYI94uYgiF5jK0GMXOfRMDfA3wZ%2BbGQ3iqbynXY7Ucwzgl8%2FcLW8oegasofRxqYjpaY9f5glz24do1z4X6IG8dqRhZHHlWM4IkHBkaOT2OBKykR5dTY%2FJb%2FmqvMasoT789duD0MefNh49YmzbgR77l7&X-Amz-Signature=fd0f9a7197a7764b49e7bb6f2470330e0042b1cdce9d15fd81aa75dd49b429c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46652MFVTZV%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034857Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGwU9KKTLmc2VFxo8eIwyHWO0Xdg98ft1P6K1%2Fe8cqAqAiBNLn0H603yEkTbU7syy39Vdtj4PpX5YwDq0JwuEiB40Sr%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMbviE3vo5FdK%2B20icKtwDVlM8m16Pr2IG%2FENeWSOcgegIrB4xr0ku1I5oTwSG664cB3AKeuipd1bbtnjPKfNnAkV32gMOX1FxOfCSfAOj4mfk%2FzSaBFzMZBxoRoBJqCUKa0eKPE%2BGUivVDowGKQcD6fxEZxX7JfjlqLrZbK4wOhfet9UCLrZvSrFhR2y1DSFaF6BwvTTNp9T8%2Fzul4NsdvCijl6ANDmWJpcTpnRtAcNG2JzVz2osehXdfKAWEZzcFs4zyyTd%2BzPo818WZ8rQxKkT7xEyfUPyDqRD25S54cBfw5oXTeb1Nbb9ah1vOnBF576MLTflWUPHCG93QDzrryKi0%2Bq8%2BXBaoMRrmeqLhg%2FzlPB%2FBZaJXAgd%2Flmrts6fVPVWVFMUlYKmSylok0lVO6Yl%2F0Ki58IrV%2FKbzwftUlyxcVwXZ4q%2FKxhDr%2BE09no9dCUNkKWcLHQQEAsll%2FG4IZCqLvZ6sI27HfdPegTWwlrgeUs9roB3btC3z8MezkwWJOAh4fPPvLJQ8cQCvqsbqF3BPp%2BAhblpxgFPr2hCaLfgjxTDfEEkQxc0JbymMzJfGHGDEvJoZcLjHgdX4SxWnjOPwlIVd%2Fb%2BiaKBBBm%2BmU7KG4C3S5%2BuOjB3luDnvjDzx34yDJq3pRITgSAYwnqKyzgY6pgF%2FJ1Ne%2FwNrNl9e3Y%2BVvmTfQph8KxpSHkwJ%2Fbl3T4%2FrbQYa30NSF5Z%2FjdvqGhCrQLFzjGs3MmEaJfsxz2qXXYWM92BsmSSshdYTZd4mLuczEvES9HbTILsl3zI3OEfvLGVbE19tRtPvzO1%2FMJhDo%2FaG8xZfuAeVHmJtS463ZzXbE54CsLaoGmflv7k8HsJSjP7Kqo%2FR%2F0RMCwmkauWrJFfD%2B3S5jRjG&X-Amz-Signature=721d6caf7be750701bdc8c2bc10b3301584e6500a5e5c1e84b27522e8c551a62&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFJXCTQO%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDHoUcr2JXJAvXDDPc6KvWqD1PXLYdTDEaD6YaxhDAEeAiEA%2Biju32SZ1D9C55Hz%2BgA3%2FpP7RFETTGFgUqPAUL1MVrMq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDP6kVapeqtpSsy8WBSrcA1mXdMihtVnbxAncE1etWt2A0%2Br55tl%2BO2ft4go%2B3f%2FHTog2%2B1CcYW7PwHhHe9%2Bpk%2B3kuuyYV7sUmFVyMm3QI9ZNvTMukS2Yum%2FMUMTr43sVNu6p4J%2FDWgZERNYCxzqGWT3mNS8p%2FtG9WtZYoF5%2Flc3IACI4KHN25PoI5sLAJ%2FAztdpYrup4%2BeHr%2FwnSZBQn%2BJxYTdQeYATWF5VAF8vu0wjsKpqSSsKWz5oO1HFNGb3KBw9U8KNtZGrCWOaXuuDWT2YD3tnqDcVdqHjwZH%2FYNmSUTyl7QQXlBjR%2FKsIxLrx6jlhzkY4yUszajwG19ebxomlkcKnlhHNZg7ZR1HtEBy4sCQwi6HfJoym6PPY8%2BR232ZLDVdd6Y44g5iOIKgO0csD%2BzaNDIC8gyF8YIS43nQdS77u%2FB%2BfBA1ThunvhUlct5fXGOUYB%2BwxYLHlJixDUEZ9DZqQh%2B%2BMYSRXG%2FYGNEfjRNxvQ69rVoO4g3S3kTca20pJuCg4f5NUMG%2Bcvq2is0jZKDtZZUtBor344duPczfJ7Mn27HJjcqDpA2Mi2LwWy7c6UZDvdunl0jSdov0vjTF2hd%2FI4yh%2BCAuecNLQeEwZ3BnTpd6HHIz4FZ%2FDapp%2BxVCNKm%2F67s2fdwvqdMIOjss4GOqUBZUZLYIi6R2lsncy2OTea8UpZDw56CTxsTPC%2FXgyAe2ThLTXcfhYERe%2BGOMkYcwdZIqabGz6sWOlbfMA%2BK9QlpvTlhUEEs%2FG%2B6ra9HGH45AgQzmrPVKJWIEVsmsuyxpfOzkWg2C91CLClSgR%2BjrWvNqeVHMwZL1tY2nKPwILalGKwfRAbu769t4Tc7fbSl%2FPiWIvKqLiIwwhqGPV%2BIwzDAHpR5S%2F9&X-Amz-Signature=89d32c365878bce3dd9a3d557b31899001bb54eeacaf1c801b927ca6af9f022b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2NBYL5N%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF8keNgilAaC8BjOwz%2Fr%2Bfa1LAJfXsfi0tz9msdriyuiAiEAq0CS7YWqs2EMJ9fL%2BACWQ2mnhAPvoYYd2Tj8WYLAs%2FYq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDLusnJyx%2BGpMudNtDircAxQ2WuKcx42utPyxuresp%2Bk7ChAAV9Oy3JYam%2F6BdWYbexPpVNZt4%2FERR%2FPl%2FL%2FL0gKC5ovq22h7FpsGBq2HwXvoNzkWbwEMRW43MKJuN9jbjOFH4vs%2BRSQdQzIVPIp1Inh6jSOSMOWUbURL75P6bB44qZ1Q9c2xVJHUaWC5lGKbd%2FzQy%2BLJmU5u%2BM43pJuLN3GxYuQomlr%2BQBhvJTP3ZJRS1YXwUVHGtQktxXkX3ZK8EU7TNHtczdJp79EV0Y9Xs52jjqDL7%2Ftx2YwU7D3QZcCfsk%2BZwZgA%2BGnRRygNlmhwhbhYgWuE65hIv8gIRb2FWwF3zlpBnTlNsTLgYzna6hzJJV%2FRf12vGDxpFj8uPZTGbqBFiuP%2ButXretyjYF9cKfCPraDydBJSfD0BblvQVplBqEY6ER%2BH4qglCwB0gvEEUVmJv5IpUSzZ7SpLHDNfthhmVYCRDqjUKGZNTxPxrJ7ZGDsHkjsXdudL%2B6yAJZVLw7Zm%2BcqCynlawsiI0Xc%2Bttxzh5k9rp59qXAVKurzoxHTAW4qzEX%2Fx9kejpOxXNHU%2B0uxaTuq1M2pfa4ZbUgT1LC1SjPGh6sZy9YkkGN067fNWgvkRD%2Bp%2FnNN8p68Fjl4S3P6s4diFNjpxC6FMNShss4GOqUBu%2BLrYlnqWiZQnTnTsIUTckMXlOztwVzsK3MuN5nphRQSkJXRbHzyMxXnoIFsNLYG%2BVmFJMEqtwI9O%2B4WNwtJfI8PU2SpYyyT0XUYXzdrOdrmuFCJ7LUDGI2FK%2F9h9uaTCGANM8r53Ll76T7cNOZFKhK6fkSMlfav2l%2B5M5vocLdfdEHfv66g3CYhGtc2oLJRCjVtysC1ur1MsKVNj42ByqTZ2Y3V&X-Amz-Signature=eda9848ee55c7207a5d3ac5ab23acb1283d82d27a8aa57c1b1577b0756602ce7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=d9d57ce4e84ad73b33259f9636215bd5b2b3f9b3a6cf479e0f878669f0eeb080&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034825Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=679c32e44fed0df56e0760629524e89e255f4a3960527ffd8cbad2cd6dc30fac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4X75SJL%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034909Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2B1KzN4VL7ZD4nljYE4DVfSPQBwYoiNeAreBpLsYjqMQIhAMAY540MmtCRwXUv2IdXNAYjiEdxgTlygGfnjYVDBx1CKv8DCE0QABoMNjM3NDIzMTgzODA1Igz3nWnWROnLq3b0JWAq3ANUXTpMd2QgllZh2%2B3JL9kggazKIBxdrewE2ivAVSFm%2Bse2zZWnxaHHNBPxRItW%2BSgWsmFhwoaFBvAgSKFy2ThvnlFSE3XzJJRn%2BgwPUzeVHngI5iwDE2ceoNjKaB078uiuecUOIspfbKrSrKibXsrB8R0zSJY1Bjr2uiXw9X80F%2B4a2IfypL784f7fbMSByVDsTGLsAH3MxnET%2BSPCwbhZudqgAFR9j7RNqNzaYocZB%2FykSxsVWBPS1y5t%2B7Ruusmta%2BldIGY%2FStxP%2BVZPt0NoQqKxngLZw%2FUp9kiY6AAhDPQq%2BoiNPR5mZ8Be15xUg6ITq6nHgtXB1jF06bFZg%2BowwlF4NgnyiKDBq%2F%2BaH6ZhP%2BgLaQNGDQXKRj3egLRkpJqLydcfIKkBLfxiWc9Hqjc5D%2BFg%2BaIl3xeDhwnGQEg87ovbcNV3lvtGCzAELk20yRo%2FrgKcQXdagtBL%2F%2BadxyRRf3zyIuOesIDo3SgmTzhtfHDtAe%2FNkxBmXtk4bCjnonBVdx0pdN77d62AHvIj307V3HMchZnuKHHatssxoFgBFX%2FfErtSpxFwkm2AYodPOcF1EFkvitkg9EbBwbmvNn7ntalB%2FXJyyys0dkyM4UtQ%2BA6LPL1zHtPugabCgjDQobLOBjqkAdvm41nS8JuZZOiUl%2FuFoHDeIIqwnLAGtgeOh5RiN33RdXHfaj4u447XaGWXdfZdPXlhMJJZzPbfll8kArfd2CjY4wDJz6jMTLdaqrkPNlaLQX6kNNsomYng2J2yyYXdxBeEfGBom6JG%2FY%2FNcmqrCnAZ0Mx5W4ml0ceBNP8RuMKNQqx0VFhHuQCmNZAl1w1bktMMhaELyDlwZRurKugb5iIW%2BHSs&X-Amz-Signature=a2a0be01998870aa36a62bd13c07ac9d5dee82f518ac7be4ff90dd1e3e5f6a9d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034826Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=373c205f76eaea8028a0290c28b8670838a9c0e65c65748c5a4a4e748b927db9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642NCRSLW%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034909Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEUeroBZ3W0C4IZVLAS%2FqpPLthK7oyM3x1dX1yBYIIMhAiBY9j6FFjbYFeyASV%2B7mpOawIFNgZjMiwM9VkoE1cJBTir%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMmTOZhP0y%2BDFDu20YKtwD8OL3Uxu6I4SuJJBp0EheTr%2FBHH%2FoUKunBKliCA6QY3jwIqVMP2%2BoI6yYeMBBWj3LpldInD5xpytTbnAwXITZ3AotpNluXISoXe9xc2eJHQ2AWQaMn4YCX0hlcxJUwKOV32htz7LEiwZDZQJeM7nYV%2BN6UuTjvmgrCMobKpq4a%2By7za7mA1sg9CNeMEAGecIOYDVwfZ%2F8IIbOvLwPWb%2F6oESw1wGcos7GPsrkOl66eXdOsAQloyPmVBEZzq7PXpVZvuT4Q%2F5f3xAmOvFDtcsMIXCA1JKxCf9hy%2BgmOsvXzEinTd01YcImXMxHexsZJjnaBFBbucMkoppWWgdiB1aplNUnpOMNjieci9dE%2BZpJIQlarshgn2jjxB5w7r2lnuMZciuz%2Bu2WhU6efok5eJK0PBnWEUTlTJC8tKHjudI6XvF2vWaHND1eVtodvyQ6uZKbLa%2FnFI56a7LJyr3jBoUEcWberbEQbKu%2F1THynVZffr1VgUdUUZZfiChDhS3Z132oXPXf0rug5%2BwTjJx76UKRw93Cmgq4s1E%2BZjN7rAQ2Wyb5aG6MH3pqME0iRIhJt3LFIBX3BJkG%2FKeMQJeCmm4hUFdNnISCj5z0e3xykEdC9%2F7TVYt17MaVuja%2Fy0kw95%2ByzgY6pgFFBZeBFOjUM2lGYE60%2Bpsv4OOq8ST7EKBGfYPyQFf1vfnc04LGbw7ltUxSLjRUXNctnt%2BGgIH5kOXbWi6ChFm7FIa4r3DoiVz5hgI6Dl2TLPy3DBsrM8ntBmSx10xwL%2F0UF2NDaqHeIJYdHXHeG30PoxrmcsdbtpsHhgYeJ6Lnd%2FzH1P8HNuQIX0TIpq2MDNHVJowZ%2BrpczONurWnr1qf5T2xMNJrv&X-Amz-Signature=31b9a168fb44fc0d07852ce2483d3ccf128b31c575ed9640ff106eae1b8ad48c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SHNAUQE2%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034909Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFvLpRkQeNkYzy5%2BS05IkfVlzGwU9JYB0v0UvFrgTsMEAiEAq8Reym%2FYXY0PEMHSYUgtis2dx8UMv37PJRkcrDfr338q%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDHrzMNG02pFfQIgNISrcAz%2BmwZlPcz9N5Z5aVNurQVgQIQ1Y76IEH1IRmyrgYm%2BaWEBXR%2B9TjyGFcph8sRVxr1g9GBIJ9mXP51gr3SSljz0MJfkOYV%2BS%2Bv0hZFINpVkatwx8nWjW5N%2BZ%2FzNIGbaEI0JV48Q%2F7Qkm1NL3yX5m6RJCPuEMVGBiHlefhXnHh6HzWw1OmL2gWf2F7qrDTZXOnznjLKNzYy0srhUHQSAMTfZ%2FgPXIdc%2FqGfBB3EhpuVjiQ82LvS83aQ1Bd7lUFGoOliNmTI6reCqOJLwcpIVmXTvEDnBa%2FsL7Gf2h3utqc%2BtFVi1bSkCHM8N06V6NrWG4ioGdQc3JObdBRHP%2BMux3QWrOncwUSWvRvrySGGDxpATb6obvd%2ByVOUhe7Q1tEycbnq%2F8kov4yUdpXo2KmeidWCV88G2C4JAt1PEtq0RxGYyRBAYhhf5m7O4Uo3EdpeHUOqAweRb9kRZ%2F%2Fsc2bo9w0ZJL9cHtnDBG3CxuVOCI0lb7F3orI7pbXx421HKQa0lBOPtQXkhExsTKT45tKRHVnr6S0ik7t3N3%2B46cQdvRgt3XufN4QxFxuQ5ewk%2FZJb%2BBx4ls8no17EGS3h3wvXzu%2Bujgnd2AXHfs5%2B0qwGkHrsDvHc%2FwRh7MAy%2B1JULnML2hss4GOqUBOk6I6TC3kCbsO9Xm%2BWY9TO8904ybIlJMWrSXKfF7PkHypIxU21cRWd8J78c%2BAO7b705gzo7gI64DNS73K2kWalxe14HItnmuWXHRe2TghsoFrZm7iqXYtXah%2B61UuzquPPMHgi1yR2jiabYiTlqV3fJ013mejx%2BTVmwLeVLxChhBGnS0jsfDTi%2BF%2F5JEbVgVchNOgtFRFqzGpCP5Rj%2B6JbjlCh7y&X-Amz-Signature=2da29add47ee0b3fdc386bb24626f45006fd574b6c25e2827fb2acdf4344654a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXIWOWQS%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIH%2Fl7B6N2ZTTHlKe72z6NRZi4OF4AV2GSpeZpN5Gu4h6AiEArKGyLxKSltIMKtcSRBSZjMVu6Lorqv7IPmTd6gsR90oq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDJjyahGolZPp%2Bg8tuCrcA9H%2BweQA%2F5qq40iYSEeCcG%2Fp3hNiC9hmISeR9MjUEl%2BPfLbsClcDaHVeI35ryHHp69Q8Yys0GalDXjrVpGc%2BjC4FZf6cftiF1LxFcqG92682uhfHs%2Bo9%2Brp84gCTaUrHJwwN5gWn1zk3W%2BSwaNt0u609pv2Aqano6ZvfUDuCTy8jwwKApedTEEPP1YbnDKp49CGNAhT32mByT3LE1WprUqhqCxpWjKNzf3cMBcEbnHtOb18kDite0G4I704UGx1pU7sEcVQWyMpvEooXyf9xWELSH8Zl9CIU8%2FJctKIP5BR95tTclNBp%2FZqkbdD5WX8Cwi%2FzlPB1ZFwX%2BTl1qhN0C0xNsZoNKJu7VM5J7X3ZziJosOs9c83gxpxmSwUFatTW%2FBrYwondu6oUKmzLtJXZ5DUgcUqpE1fGIq5OvSKP%2FdJnB1M%2BoFA%2Bkyq%2Bl3BUk4R6uEtUxnzOamjM4aiheojtGNjQRME7zYSamvyb%2FpVQ3%2BaGBOS%2B2NSUiXE01MxtGNnmduwGjT9CkhZRnHS8ZtWFCNadfG6NZriiqdlPNrZxxHnA4CTpnFQjEdyfP39krNo2KuLOvyJAz4X%2BpDt%2BrZbtQZrg4iub732a5MiomcP%2BvtAY5jjxD%2BNV%2BRp8xfm9MKShss4GOqUB1LiZERz0nCniP4IDpSvTBES1yfDRLOq7%2FSmSJR9eEfB8iNUmR9HlC8UqPe9bqsrzUPb1zpzDeh7jOID4ctmbJuRH74eOq%2Fsd6ZHD97IH9LERCokLdSa95aY6Rcl79rGYCikRJ3jlO0vUgiIm%2B2dgIFBPqVUcm1%2F4mKnEVpbV3aLhQls8KN8fn3CraHLWmhtwq29rxXA9rcgdm%2B7t3zJE9FbeUvUP&X-Amz-Signature=bd37dc0e7d5e0b1ff652139bdfe1426cf99cc6f7d23018e62f84fff159a5ac5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FX66O5C%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034913Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAypY%2FPzipjQ%2FB27s1%2Fk2B2OQ7eK6SuLXNkeMCFCekkKAiEAq1nQQskYL%2FfYM0rEzSoY4JsmmFE6h3mjtRTFSin3o8Yq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDNBsCsAhL0YwTQWgJircA7gLkERHatpqN1QNV%2B5J2VYYDQ7BsZrgd7BG%2Bgg6QQF%2FtBeNlztRnHvyaSm4yDLeIhLThbFGNFlkjTe54W4z7bRorKsF1qe9VK3T5QV0Wm2NkD5uf3bhCA%2F19ThCYdllxr7MwB65WpTIeLG72vD1jbjSQLlLrbrGwaHDl67ZWL6XedXhCUAy7ipRX6uOIRjoznvkL0uTq9qeXYCZMEiQjg1BJIobCMFjg8hIXyBAbPzGvt3j66DPEPiZvOMiabTJ8pu99j8kbIk9WFpmufwQ%2FoVltCC2JWxXZFyCRQIcmfNnCZ7osHVW2gaAhub25ou%2FyHrs1WTooPr%2FuvtSMWHyjO%2BaeG9JAqS7GxE0V9BAqAM9IGeznGlK4U570fMXMUFdmlhldd0%2FKsjr8tTY%2FyGt7vEAeefOgNqzNsAdLHivaDB2GdZ5GNGFBFrTQcRGoTVT9HW8mckR%2B2mpHnV0z7DgBdRrNhD%2FwPeDfoysfQO4Gc52vFcRIVboRw0SXNDC8wIlAnZfcgqFQQIQZ1VzFwn6L778hUpENMnLxOFjaqZFVgu9yiSnpgP5nJnSOdpSXSSfEYnwPsYzCQMrTHyEKAgWY9id7HeGo9bfJ4dAaQfm55TY9HK8EMroPgQpLYOnMPKhss4GOqUBaT%2Fj3uIVqqvoD9VxYO5s5TPzKYtRU3k7nblxwuE23GXFAgybRERKgd6MFECBJJQ3nk%2F4YJAhn5N7bibdqjCUhrgt5S%2BL5uGjUqCAlHSLa0wNrML96wzrP36mtP8Oph4IOaSkbJwltejRHOujN%2FP3lq3VKap2J1l9tXgtmhfZw5fh%2B4wqiEQa8b%2BVZGgao%2Fksgma5hrmMfLkzwcce%2FkXgDUO9mkEa&X-Amz-Signature=557e32fee684815de4c36245aea40aecd3943e658b09202449a3d6bf47db6816&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034826Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=e31a36c48a9cabed0e303b118467b371c22bc0226a8e0a744af03c3d81690a35&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPXMR3NK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034827Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFyUU1yyx15m%2BX99EU2jbhPtYzqCVpXokGxNRL7D4R1AIhAOrTeeyKF5W6hi58sFJ7xp8oCk9KPANIp2HkDjjDpctzKv8DCEwQABoMNjM3NDIzMTgzODA1IgxrWRF9DIlER6YaZIoq3APw1Z%2B9FewYjl5AsmuwsKQwoKRc8HxYt03a3OznAiD5Hxq%2BIjpx4byHAoRcdpK8NlJi13%2FA3K9jIlFPgjo8f0YALXBh1%2Fr3CE2FgSWT4k%2B5lmCljZt5XAxAg3YL9Xrtf4T4FxhejkEIXQ20Zjhz%2BNeaym2hYk5k6byggQoUnHIGJN8JIVpg6CzpNTPIkaMmcbcXYzLkQOF1dY1mn%2BI2wjwfZHP8%2F0UT1k7HqB0XsepuZveQTxw3XHOk%2B2ev%2F7s2HDcv0GozSpRhIYM8D%2FCEoGk1lvulGO7RlfkOWtqmkk%2FAxjDXSmRQ%2BTQmiaJAjJFbPD2%2FJSPBAyo0MKJZ1sR9y6qzj8XwU22R5%2F3KRT9U%2BtrN3vWdhYnrEpl6UeM7X6NItlANEa9S3GUwNTkpvZfGjPwWaGhceCueHakESWa%2Bo8j7n0Sm%2FvcitgJBqWzUyZ9be%2FcmMCk218MRXLnPhcOjRNQgQCHmx6xvhy5qCA%2FgOWMkXYmvQnHECci1ooLLjPeA50yVKCYyYxPqpNk5UGOXB0fwjIt7Hc%2FuZUEXsGJldo3LVpWAIcu3bZKyJ%2BGIkgyCWlIfuziEiVS%2BVyPyw0mMN8yS20mamRNss0bZBBULDJ5Wkzwd%2FF6%2BfuNa8AZN2TDYobLOBjqkAUP7LZg%2Fbuj5cr6Vsscu87j5%2FaDGM%2BRfLjUisogAMrhPiSNTAnpmjRkpdGWPWa82nbDXAOlJg%2Fvogai83XAQ2jlle9y9ZF4%2BvrepylZPyZEA%2BV8C51nJ%2FxmRIme47eOeWinUqhrmVuMcF4ckjseYqu6V5dqAZvdhT7kPbXiU2bXa3i4VbXKC1ZYTogRypRVOLbYJ6TXeN4ke67w5arbu38%2FQ4%2B3r&X-Amz-Signature=4955b93fa6f557031833c06081b980130f66e0f047d7b6c006aabe95b536d368&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

