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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=d4b65ed408a11072c315e57fec0b0892ca98977258547d873d965c0417063709&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=72254e8e4675aef030a7d21dd2b1cf4e4e42072040164a7078b3a6b6b3a294fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=4524ba1fdcc34b9e78d5ef43ff06ecf26681a228bbfa541522b66ad4ad501f22&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030956Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=d9d4157da48bf162c3ed914a0189f0ff1d2ff37243e162a59e9cdd86b83a5beb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RL6OYRJG%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031021Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJIMEYCIQDA51y9HJaOmfVhmH8VYhZvPc4Y80SQtwufiCAK2%2B2YjwIhAKmIwuP8QYFIJYUDNEtI18%2Fdh4LZTRIASksuYyt54ir1Kv8DCCIQABoMNjM3NDIzMTgzODA1Igz79xnDCLLD7YXKS3Eq3APW%2FkOG7hFkhe2UK5LTsDb2DYZjjJi9f9Q7IN1U8i2uS9HuzrmF05qTojHzOgNeqk4gXKW0mYFsGyfgmSR3kyC1SZfClIRXp2vVEVy99ioHO7d5Qf%2FzqSUXRm6Qncy2nhwUhc6b6jE9op500dX4mPkLyUDGMMGMMiIWUi%2F%2Fhs573csULBhalKs0fuTyT5pTH%2F7U9eHBKtmwQe5DWCPwOmnTtmdyciWVbetA7ENkkyNUorz%2BQC84qebAtZaufWt1ydTPgRmuPslIryfgjpHegb9Y3PMJZ1x3eYP8RlJ%2FqvRDfrjkmYMMoevsR7tt85wuI%2FsLhCAmXIEGQh3iAE2uzoCo5i2X%2BFw%2BJYfkWaC9DFbKQIPYzB2D3xGQJk3q6ty2m4U5qvkQ2yLMVobJ3XvlQotVvODa8tiD9BaPBuoOkJvaoB51pmLxGbGG4kuOZR241kfNzhI%2FqYjtVgu4ROe%2FALftsvjLMLU4KqdfQb3r8Oq%2BG8F%2B%2BbbtXoKOyyo6kFA9uwJ83alNsusGKwk%2FR98zcFjdGNhLC0n7eUdb662OTiLJFrDJJPB%2FWvr7Hc29STkT4RyeXSZ622L2HNoRjr1%2FzeCcSFT9drYg%2Fezxs7z%2BhIP6uAWPHgVUpTtb9fScJzDxzo%2FMBjqkAQG8l9zXkcaAwdf5m3wQ2HZGfJM%2BgptyD8W20186%2BNgPwA5eI1hjj3O%2FralqSoRjoKUP%2B40CGfhaTniguXxU2%2FfeDMdntsIL%2BJuvg%2BjARg1fxHQB55iFTXK5u%2BLfv4wno5KTzCwBen8RxgNKBR8vIxHiS7liwbNX9SFnkb4kyROvIFryl%2FYKsoasiHOgqKaIJ045aIOoKpVz2lsbqnwGFpED2vFk&X-Amz-Signature=ba581ce4bff4baff3fe59ce10dc0c4becdb5a34b6fa761731d2afac8b9e125dd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YNZ2GIU%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031031Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIGOxhEoj4L32XwBqnfmmEwj8e8Y6Bpm2nj88ydaaCyT8AiBzkfRtO16P5W1r6PSPK%2BNRfA2dRfnyzdh9S1JqgCczEyr%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIM8P%2BRwoH5v%2FB5QTWJKtwDjqSfEuhcznaNLmWG8vOb2zeIUtt52AtPBCcld%2FYZ3Q6asA1lOGU8YPiibgwh9vO%2B9AdnilG%2FbzZen1giA92%2BmtVudTuab56NCM%2BGuZWdqIPkg6C9AIN47QROWkwdo7rl%2B9k8HPW2u9oFAvtyf8yLsXkDyfCRA%2FBlFh1oLxqR%2B%2BD%2BGMO0lfgRUz8XQBAr0tfYGdEAr2ASTm0rlDSDQABcRhV7fa%2FPj9mIJ8U2P8pnbtDs5Mt2WQmGcfxJd7Ml8Ew89a%2B5eCyWbpFU%2Bjvr4t5hQ64OZu5w9gjNo8N836gDOLjNqUk8V6y9tJrfRkq9rts3sD2I9m71VJNPxE3ShyXtvlmcGBkDq5x93cO7GfRpyEcin%2FB%2BQaQCgMmsCkiGSNLC1QxHHOTwXh8I8nWk6xK5elpaJOma4sY29EOPogE0R%2Fp0kgbhTEEMomXNlx%2FxOWyofKyaeNWeKQQgJKw2uEI6O6OFWlOZDGXql6jn7lAxjCbqXZxlRqIY4MjEvCWMoVtNHKH5v5qZRcnNeEhc1OEPkhmVNw7cmaHjhr2bj4Ri75auZgD9aBEhVXdqlgW1td%2F7CAY7Q63S5YzUWT6J3hwdGsWQSY4%2FMFcIiaznQ0Kk%2FYaVK%2BlOuimO%2B6BkUM8w2s6PzAY6pgFFzRa%2BM3COpfRdIDZ2IOovnRlMN7oHJZh1OWqa9sW3HpOF%2F0gQMk2go1Abjz0%2F%2B%2Bbpxl0dbkg2ZxzCgPUgvo6IrVxu8MaleMl7O5bjUvVqw%2FMzcfv1UJCeFuhJh5qqel1BXSMUavMoFVR8MU9zSHWfKEnacZo%2B%2FV%2Be%2FINy9LSGobw8njO%2FtuNNb0qqH8tlijeivOZElDoNEyUUlg95p%2FBnUL5gWwg8&X-Amz-Signature=4a8109a042fe2dd4bcb2cf4bc642fd51a8d38505d90f23beeba88d79e9ebb149&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466USYIJUR6%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031033Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIHxeKwgJf9i8pMPym67DmZjamYNsbGJW0g0UkbHM9YUhAiEA0kpw64pf1hsl1yq%2BA1OuFgaLJ1rQ%2B3RThFX5kI9lBIEq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDG1DioAR0WPwwT8DCSrcA1IobNkuGDQr9x1YWvQkvifEGVv8tLb6BMlAt8TikLJExfU155ZS3gHtIhe%2BhFxvVseaFUFR08CAI%2F%2BPdj5G6%2Brb%2FQ1FM0JSpB%2BwDKAE4yHTrkonLyPq5fgegP8yUytww7IdKroAn94kzDpkGV%2B2uVctTjeLh30xsjR4mVtDq6L7JEgMpEz27oR8wMV3TY%2BUdpPoWC55aLSRfGJigQYKSRfqLxnAyc6kArSFisvc98IMUZQcsVeyfOK%2F9gt78SYrNO9R%2FxZxmBwubGvH8scjoiUGosP0bFVM4tZMVkelZftJP5rhT0eOQ%2BgRkF3dDyA8H0nwqNPhZsnUaYRadHEWKJBJNmdH33t97pIolNVMH%2B1fCeC8mS5bn15esYrLwJGWyPF79l73yY5hgLmlmhpCugN6eN7BhaMLcpLGgYKtAAs6%2B8clp%2FHmdPMXN3swi0PN%2FVk%2BHE%2Bfsu%2BctOOxHT5Y%2FulwUnIa9B9qT%2Fey4sUM9MQz2ngJoxHHokQqW1zarZb74%2B51DNsRysVLO1nHvhN9BFUfBdkbUzSckeU2uT8OICiMufyM19Qi1KD0oNpdaeKteqnNUrNzvTs3hVfJ70SLAe7TSKoJV3Nlqd2sj0%2FMMU4j%2FoMd%2B%2FVsVo0UzcOTMP6SkMwGOqUB6ZuZJiwIWDltL3wEvdg%2BjGMl9o9DNBTRl9cRO86WZ2hn%2FqjV8CDYuT9UcjH5ufgYJr5qYzzMobZlQ4790dffUk8O9yjTWFhuUlKLsfkF%2BTdNAJNieNgFBGE8%2BBUwrskuTaRbYXdwGfwg4EWHcCcK7rAXAhvZXRekl6XQLEgsgaqRch1etPQH3NkVf8mRxkWVEubE2ubT01A5jUnY%2BND7D3d7a0Rf&X-Amz-Signature=2dfa260bd255c7c2d64e19719beaa54779032840ee0f267628020aaf8046b8cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YNQJV62S%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031037Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIHg8pAJlueQj6o0lyxK2gEDRWEyzur9sHLNeR%2BOgQIctAiEA5TNELPSexwXP%2Ba0GDHoWhHyflt7QFanf8yAjysp1PZsq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHaIzRfsGhvT9VNO%2BCrcA%2BFCZm8%2F%2BiTIP1FgfOBtcuiMabwUW5NYYGJHE4IbIdpQnUzzahULuM%2BDiReJwqsjFr%2BFxanElT3fovIPQqcEFAqSNDzh2%2Bhljx1vQu%2BNVVD9W7XIS%2BOK8pQ98yFpSmvodReFicUlRKrJ2CAzmSAuxYu3wBXPclQAUH1XqpJ4UZBS4cI5yhC%2BFRdDSstBmcBqCaJPo9fJ%2FndDJ7SmriYBQkDn7ufSbMUM522efhF%2BEGIBf135y1qCYGR0CC2gdb%2BPAcafb%2F2hssKzF6r1dCj28XPRKru2B%2FZ6BPWalNh%2FnOXSoP5YMxrCTx3D5NkDYJs9ThRJt66TVRe8AsnryTIraMqcggNzMOM69cZodMwgTfKb%2F%2B7%2BFsMmdgJ%2B41X%2FIMnb8RkwOwlUjxx0IjltrRclvYomJDpFoVEhfW7eRv2QqAcxV0WEM%2F3MyvSszy%2F4kEBiDCYmWgM7PIBq7knSC6cAUsmbll%2BddYMvndcTZ48MTFieQX82%2BX%2BGoHXmjo%2BR5%2Fvq3pIO3xcHwzSTLD5w1TQ3WsCW%2FAhkBVo84wP%2BthbA8KPYCnsRKoBB4cHA6hdSU75h9xA5E%2Ffd%2FsGiXPUEl02Y80ho12ICFCRlLHxZnUc8XyPRZ5OqRuG428DHKg8pMIPPj8wGOqUBqONh4S7w61r6Cucv40coqx2e6SLcbhk4cNpHvnr7dHd8gXbs%2B0VvUsBSahYRH3oQMzq%2BQBtJ1etpvO%2BSR8QY2%2FEOiHw5amDvnUKQ3bRunTTujG%2Bn1uNlGRNDiIk%2FKatet19LqT7Aalk7oxMVypDlRT%2FoafqIbSy1%2FbDOb8Jv7vRHRqpstDfljo4s18WvvdppZJqMXE4inCJaaPsw2GDEHhhJBGIh&X-Amz-Signature=f4c98ce63b48084e7431b5c046a3c8b79b2c7fc497c67fa067768a6bb8814302&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030956Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=e85ea76cc39a72599ef8d4a9b6e0d1d7e0fc1a6b9859e759c174300d7f066bbd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030957Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=49bb5260116a40a3108f9b5b36d271d950c14fa3f3144d2938757e97872fde98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662OSTBHQ3%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCICrEAnU5ti3InbQCHx6ZeohOBlnUNIO0FS3Qo3NGRW8KAiB0vKRkWny0XFUo4AmMLHGMRaxFe1wiXzTddv2hgC1jWir%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIM01xHAM28EQGHMIZzKtwDm4KPey5i5ZJqaDuqvcQzhv9gxXZ8FDlAyVxD0WzSicZU%2FuPuK%2FM4fFRkgvcCB6g0IlIDWqWuuCO%2FgIP%2F6A1F0bmCaX2MYy44NnDCNrc4MwwyNSYjHbcYo6XKvDlL2OTPGj9HonGr7ztH560Y%2FlhF9p%2BL3OoKUe%2FP9W5jPdXfdVat7dwkRKE3kEu4LrjkpF4F2QfWCVXT7%2FGpYo%2BxX8wh%2B8q5m2MQBLdPdHHAIlOEd8hogxBXifrBc0lVVX1DgWIc%2FRFB6oE%2B%2F%2F247%2BG4ClKaehRCDsFbsxJ%2BGX0fD%2BWeWUlPTh2D1ZcptWCQiuwrqBDdnby8PTfxrDCwbmk%2FAiAUjvC2wlh0LzrZqCd5bOUtSpP5qLG5HXUg1mxOewxG5TSTQpkbhyKojWPGDfASRIYDr2pYDPWZM%2FXyDrr3muSRIPM2le5rgbRJdxYeYlQKAAMzXsgYUUM4vjTaGSnYKvjyR9AHaNxjkwPnSM%2BZygSqBEqK6U%2B9XYMv2TPfQ1ny2Us96o%2Fy627BTwlrpNCCh%2F06osZnKM%2Br5mI2Y6AsIv3wCwx3yxPoyvwn3Baobr1ANCUkC%2BGb6lUQiQG%2FtWJA63x99cabaH56BmijWo6xOskgfrNSUOFx20pYeMgxS6gw9c6PzAY6pgEfBu2lHHxkaFr0WDvsZ2%2FJk8lDiMfEg%2Fnflj7Wz9yeNLcdIk4vs3CbUgBkosrzBNvkOOYkSyNRd%2BTsSnYpyuRKHA4c48WilDPYH55t4fa0PsjDN78LxwNOzd5TZLqtPXLYcJklkjPLZLwWW4LOKxBKzfS8e9CGGRd21XRQG2b99EVJRTBmnrxunsN1F5hhnlj%2FV6G0Xm6rmz3g4ISBDuppOeaquloH&X-Amz-Signature=575d51c318fcfe0444e38dfa9b9cb06134b9847a4e8309d1ee672fa8c9889fc4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=1067a2ce3990d9af97dbaa8c37af94b3ea3b6dc18fc169fc8c579bce37df2c06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGRZ4UJB%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCjKEKcfbwOk1m6ZrUvcWSVyW2rcMnuSbsg3HXjmR2PiwIgYvy6c4i7Ehu9UbH5Y1e99Y0oTfiY5604%2BYdzBFhTW4Qq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDJOBpLt%2B2gPQwSU%2BtSrcAwJKsYwNKHZ1f1yP45e539XXyeVSMe9TYGOygtRCi9eYJRqorpKJED5C9N3h0sV%2B%2BRSaKtRt7T6NP72SinjKcMA%2BAOArXe3U9DeIc61ONYZxSreFE8Z3XoVdxNRhQLLCNJyg289qN0uq1zyq4ZM1%2BGIyfzh58svU4gsi5%2FBFhfMp2sMI7n0A2dxtVnO7AMpcrkV8PYQHgnsUL6Wesw5eVf6iseUV5EYXWfEK9mYEgsDQkw8fom2Rs74EdxrkTfz%2B0vLhwxzqGGZTxQr6pfArp5IZu4CShIwaxUyahMuEuglS1k6rjjwEfHHptRAlLY5FVpafMGmh4BE%2B9Eu6vqBvfaBOwOeAKIMlGOwjAXBiFnlZW321jCrN9Daf1v8m4G5R1UarcWEPSPhPLfH5EaE%2Bbd07eyjZJ16u%2BtvGg5S1E4qD874USVK45GiMeY3SS4QG%2B0LFXViVMOzoRXbgJxcHrMSERNnbaaok%2FZ72LF8%2FuzBbKmEKdzzeTOYgTNt5XswME3MxKSge7%2Bngn0eC9%2FRVvjvrLUvrxShku3pGMogRCu5oJznWjSCuR67OLN5c0HIjdCcnMx%2FBtB83fDK9vykAPRch6v2Y%2FXX0Swn1KHjWRX%2Bqql80QPWVnNWh6%2BhzMKOTkMwGOqUBMuA%2BF%2BSxyyWVETkf4KM6SdaZGmipKVVqwSoLV9jFRW%2FpJCEJeGUG%2B35MP4DdtufGjScNCr9aTK2fwPIs%2FdFZ5x3HVUJiDy%2FT0YAxrJkDnxLyh9IPYAKrXqW0uONFIyt7pm4DM1NDw85IPoYr2%2Bc%2F8fMzsJ%2BSBM7zhAcEuijbycXnbzyhMdxOxneAVa9YTnFlQfYFPm9uFmdNzAyuHHH8otC3DBFM&X-Amz-Signature=f771512092e18a1cd6d6a24c811187cd0ec704e4bed26b4a77ada55dec86d155&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T37SJ6VF%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIClwuToVZ82t6XUK7VVAJqET5C4UTQwI5zYzwNcy91NHAiEAta5mhBf1EdZ93Q78hat1ctsw7cATI6%2FPB52b38TbHDQq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDLljP4Hk8JNMkN3sHCrcA%2BCw4nEiGhFoZ8nyj6dwgxk5dhocTpMALM6QhCRu9jo4AzK8oJXJjpjCx2vCmdA6g8zpdnXguXCvBS%2Bzzrp68pHVk%2BENvK2%2FfJkJkQ%2BOSIw3HlF0OJS6AKC%2FIWo%2BLBGL26wPnfx321Ei5xrdxX0lziS%2BqNrg90uNGkXeyFRVR0Du8aed%2FLdc6c1AzfGGWKV3GkeJm00SsTzXf2dtlw9fK6z2VbQC4ASzpTLlWbQ0PnaAS8WkIskWNfAN1zRkuFXwH5Hh%2F10gJIurulwQCa%2BFCLM9FbqZYtaZTYstE6NsrwUUyRGtDeJ1BDYV3%2BE37kDooHYmwf18L%2FrVomJqEn2k6yoyYK2TCwk54icyLpjwmBcP5nuZ8aeRdPkiTDZecrR7VtnGOm92zq6oaoiOZHwBlWyAcYMTmewe9%2FqWZGJHIj2BK5JtuiEkHRe46nRCJdw6lbq0CgEvu4xY4iX%2BoLz91GYxmBX5DbQOUmNOzL1gXHOF4qV7x3s9hHA9yNn9gJyWzVmHlAgsS8Mv%2FpgD78wHP75mcU1For772yi7xK1ER5BeCk4D3bysqYPWlmkZjJFrLVqq7pbLNW84zVHJ0HcxPd4M2gAwzR7MkCKpHQ%2Bp2yBmpYmpJkvhepAuR9RiMMnOj8wGOqUBf8atihV%2FUunzcoXFk3iY4FNv8vzIMVgrLXyaEEV4BNsyRd8mMFg8el2x9dVZQHaBRcr%2BgGRw8SRagpfY8PNH%2FU3gA%2Bo8TYthYiLy2TWs7%2BCYKo8kMptTEI%2FnwV%2FWXuRx6rFZZkmELQJso6ET1zkUNGcOkUBw%2F0ghINO7E00DLxZbRYOE7TbFy%2BNaDBKucInv%2FsFWnx9FqLADubPsbjzp%2FL8LLYlP&X-Amz-Signature=4c2554ac23d70f01bf0cbd51ca33f9848de475676fcb6c0193d406b3f204cc80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667QONFCDY%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIHhRld2c4EUD6F8WnRAQ5Y9MYdPI9hpwWKchnmenjKI6AiBTqfjrcCUFLMj92aGI2avwZKZssU%2B6zKN1018I%2F4HMoSr%2FAwgiEAAaDDYzNzQyMzE4MzgwNSIMWnDUgAHWiMeACRB8KtwDJLnAZWY%2FyXY7xVVwO0ycNxk39hpK80zmjnmJxwlY3%2FR860NcLQ%2FYW8n5sScCC1N0PXF%2Fwsi6ViQYUJsaxzvE3FRUNpWOyFJPNTD2y%2BpsIGYMhPR8yJrkHCPAjQ%2BXBGabFvUpf%2B77yRAsB3WMpCxuZbMks92VWfQyJJL7zqp4JFWdqjcgmFBiaqTBhqgkBtd9dozWccGPBtKem5NqvrVlqZu5WZdMi6ayNg1i%2FcAoWK0mwqfQC8ZcXWVjPfrPIe51kzCjea5x6vX5hLjWVdEgHVtY5T79Nnvwz6keyVgazeVNiV%2BHDe1cIt7pGYcopSMjlhLUL2wK4Kgcs1N2w%2BSnlRpmKg1AKF4bIBezuhLKXzINlidDScdkiyYWDMppVZUmFw8WLITu3nKs2TBPHyD8RhrbSByBucXgE49UEH7Q3cNsvMCJAILO6Nz11DMpq5enxIHgOt6QTrysCGr5htFmSZiRIZCMjUbT9TeamltVlBZLCLFh43zfG12pttE0eT0D0%2FO%2FX8bHoUFJApWvynAaEL%2FGfuaLGXeKa9vUTYo0nFpurCSlGIbIx2rFzxpA4yNdDmc%2B%2BmjIIBMMnLK3OMXe0mFTHhWFWrZS2krZOm6mZmMWC3yKLumNVQVNIT0w4s%2BPzAY6pgGI3aO74jT4C%2FUZqWz2VM1l%2F5m%2Foe5P54TP7EbEhUttQhT1aMLjEQSHegnbwlqh6Z%2BrkHnNZ9GVjyr8ykH3FzuDWhnEh0xCs%2BSx1Iw4qzs%2Bc59iPTcCG4AaqmTNyJa9vjao4dISzN6dJr5SZYDf75SENModCo6DPouh378HmG4cDLxPfjqw5pXJKQYrLNDHccqBKLrgS8ZNYgu5xpzJKRDYSvsn0Ltn&X-Amz-Signature=1bd4733b3b121aa0f56eb5455a14546d0fef0a74616a28ca226b1ae6c1de52bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662WSFY7CH%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T031057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDzb68CuroQtQcjDvspsKJBYFDVHrMUFWk2oKnsV%2B%2BpYAIgFYHlkiQHlZ6jnrUmBRmBcDOyebbLsae3bnUyFxG6BY4q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDDvpYnf7zqWi2VChdircA9AM%2FE%2FB%2BvxAiFMbomHXxlngQrBnWEoRqRdmNUv8aZFpUm8q3DIj9kJDcnGYk2kn2yQTj%2BUFVHql45hRCoutnspCgMmdad7BN9ChplB85Lm0HqA3uEUjfAt9qXGnKo5EtZ%2BegrJRE%2BA2oJ1zSRnNmJjvZxyHjqvv7ZI2oMe984sc3dJh2YSXgVyD855%2BLSxUCPSun0Rz7ByFFetiXiEdrRN71RrY%2FSt04FkYPE0VORfCRTq3pgcL46YkScYLMePYMIAmLy3kVSwQefn76Kf2HYSQtq71InryWwbmdPFGJOw%2FTk8ggJMdmECXUg%2BhubbKlYBmdlFcoWHKbVsfbEmihOnxahb1Cl9DCVz5Oe3u1IzCT0i8i6CLJNHYsfa1ESdfAxcSVTHtbrUvT3Y3lTPftCGiWVxxHxZPbBd4BAtONPOy%2B1ZHt9Xl7M%2BBEJkLAzJujm4Xb0F%2FIaglE4wvKwXrIoh6W%2FBE%2BfPbssqUv0uykTBO4u9byB2K6WvH%2B%2FM3kh1Cba1u7ZRLyJqqnx6DPhDFd00R%2BSoxRl1i%2B%2BVo4GyPZ5ybd5SzaQzTivw2JD7NwdiIhEDGtMP7KNc5XY00xZKOaYyNKwVaZlWgis0x6Yh5btaJIXmxcvZCDqZtVZC4MJmTkMwGOqUBPzs%2F%2Fhs8Y%2FgQOpIgVFhY214t2fHHOYoMq3xnOdIx4nnPleGJ%2FoDHyXspGfA5CnjHQbVmye0jEEJI6L7Wz8yrptzHGI1dqJLAjX9B5EeVcFYH9dzYba0%2B%2FjYw9Xe%2FSqRITZU1qdnzd2os4BqVlN%2B4seYoEie2bfm3NZbNirQUHdfoiu3jOWjseNke8wP7bQ8NJXsLXdxvO67n2Nx%2BsOJXRSs8eMqs&X-Amz-Signature=de0e3d8d341681ecb2e641a469ca6c7749ad7bf5b79847dcb477113aa795812c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=bb75c58ab21af9ec19365fc894e2dd656710186ff3758f0d1a474cbc7a0238f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Y3XMKKN%2F20260205%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260205T030958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJHMEUCIQDGfSwZkSmNfEtj13c%2BBgM%2FkzXxkYXjNcyb7F2Ux4qyuwIgCzOm5z0GAeo%2F8HuIbG5KlCJcjOhTTDpQHdljJWUDCsMq%2FwMIIhAAGgw2Mzc0MjMxODM4MDUiDHsPwKFf0KveM6qY2ircA5FV1nquRluPx7UwWUc8NNqG1PNJcXbjtFHhRTvpiKZOrVsFeD2MxgAEt05l1ljRpWaOpx8Wrxvn1HwMWmqhcLc6ELJGa77i08YeBs7FNmXgArQvBENBmd8ce6Hek%2BKaTsnrJaDabkj%2BnokoCI5FnuyD%2BjNeOZlpKGG%2F%2FoOdaWV8V%2F4Rx8Ot8iyLj85Kn5E2j53bxxyilvVYjPXhnykJDP2tFkuo860djPGBjK4W2rmU9lCGMGh46zuFCAhh2RUWVbzYUd5OYuA3qCe5u2YRo9QAqxJkxNN%2BqZ6vFEmzsI1IkPy7bgj1MjqqnKeYR%2FAFg%2FheAeejf55sQCh%2B0HUYtLkHnBwMv7BkEiJL4T1YXMI7cRKmOnbk1j3Fwcsn3qSmV5j3FfQ3ZyZqzc2loTbBhmEcdGV1FvRY3Rp3MqU80XVjS6%2Bsn0%2BIeev3DZkJ%2Fy%2BqA37%2BubNxXumCYpSjaZZOy35g%2Bm5e9T7TjKfRaMopZR0i9Jq5dS8%2B6ozbKs60%2FqPAVJIov%2BhCe4ypg2eDLgTCFrfLixJ0cNhycAfo7YtvFVbFffaEyCdASukRpe30fOyaYubceZ62RQO54GJYq78AnWPGjib%2BtvApTk9zUGxpVdYYkbu4MMpnYDe4YCxvMPXNj8wGOqUBvhenIdwVxj3usd%2BM37ZsNhlCF3iCBQiCsQrPbHSzzy9Xj80zs%2BdNRsllKNzYM1uAXmNmh7DwTG7sIeoZzKabfDJjpMv5Ic1i5S0S0Qto1CBtIhAFZl0g5mIR%2FnuEu%2B%2BfZaR7wqBWzUo3UcpflzCjeyd6lOko%2BsYMOxTkKQ%2BiEiPcgIR9sB%2Bm9MfM8s9fYSjdxaYYV83%2BVwTm5jzX5cTfZ%2F7avMLl&X-Amz-Signature=a91c451d33f41b3d6dec71588cfdaf0879976f7d4d42615756f57ca6b650d0ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

