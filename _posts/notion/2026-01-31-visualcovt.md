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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031459Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=21690ff006c574456badd33d3979d48ff71532309c6a0158d00f68036b93c332&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031459Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=31cccf4000f128bf07947abd7d94b4acf881cfdab1be75ca1fbfb686a8847f2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031459Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=1b842e91af529a36f2d00077de8c07fb1e5ba811e0efa5f00a72ea8e5b182b06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=746961ee912951217526f87609fed6d17847be1e6764988fdbea90cd845b6fb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VIHQ4TKY%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDJ8w62wpRD%2FECVEUouwV%2FIlKE%2Fz37bjtouZkiLkdZ%2FtAIhAPaKPbiPTOFHyn%2BqyZZQx9xjdVQzhkBIJeOTosFCKIfrKv8DCHQQABoMNjM3NDIzMTgzODA1IgwZ37BFJV%2BL1gexT2kq3AMLxObodEIICnIwuJyOC9TKlJX3rWfaNcaKYtTcrSq%2FNeAwCcnN0cBl9u%2FKyCTa1bllrCzWOiPfv7hxEcLR9xe2CMUbTlvAhceed%2FJRvS4wRDQrE%2BeNntuKhDl6Rno5qhS9P%2Fqo7f%2BT3Q7vXK%2B1SWVOy7182iUj7t0d0Nd7BtDe%2BdgwyMZ7x3uJ%2Bi290GB3mJa4hY2W%2FvCzp4vi6ndjPP2ulicQDsUlHTw8hRnHvFyGCq7VRhXid9pbBNd9ugfCeLjmrpzPVf1vxzU%2FHcA4EIUDUyVcd1dMgJ4mCOcOT%2FV12tC%2B3DBJ%2B8p8pCjuE2HB1brfCuq7D0RyFpcEekWotqc1xDmzjRCoxx3jypsUeQydZ5ZH1pmCNUZx8miWqCqrvhF%2FDQA0F2jKa4hUk%2FdCZCJSEuyGRHNBclv5fue0pvjxIadQUDd0vIW1i3BnUUyddxDEWtRJ5GSXyITDwmbJT0r1Iine2lEjo6p7C%2FHbD%2Fk1819hxf3H3uKf1k%2BQztv6LTFgv%2FcMaarWQI9AyU1t%2B37Glno8wCEYzfNnmP2Ywl2WQdrIZasYA5phX7p7ZhSQLNAj7RIp9n4EHwq6Qa4bv58QUOxH2W%2FkXCa%2B4IM6MKDZ7j3dDXMfzCq%2FQ8LJkTD28dnMBjqkAXbBra9QiLIQcoOcaHPJ8iPHLQcu5%2B8FMYgNf5LijixJyupReddWymfmzrKNwfeiRludPB5FHKzY96rvEC4bBadSaMxLCszfQRj8wZihAUwJJsLnJbw1mQa4snIahEY6bPPmLVPmR%2FEBEtV9itILULw1BOLGDzOlqrHKAwphFX9l9f7TliZsRaKJzQah7nvdeP%2FAD8nGg858rch4%2Fu6PU%2BDFK6Wt&X-Amz-Signature=75fe5b06cce1bb6d175a8ffa76171ef8b4341d1212c7853355bc4a3565adc4e9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666YZQAPEW%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031526Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2B6AFgiBo4HO3kKkwmBfcNOuX%2BF%2FK%2F55UIhZXXPQK5nQIhAP9VNMa4nzeMCIkTKgJChq%2FB8DxQVuBPMehZBP7k7HYIKv8DCHQQABoMNjM3NDIzMTgzODA1Igy6b8tJac9cNMopY7kq3AN1zbuUo2PbGW9bm%2BGJSLuEDFrVCzSFr%2FqeSVwcq%2BfNx85L%2Fq6oC3jlifGFheJa04lbzkiUC7gaJQxCUMaN85zqaLeS9%2Bo5e8ylwzMAnIkyBIJPAEgE%2BNTtlXdzZGFvzXLz%2FFVsMqlUcR%2FDxHNua3OGfZjGmJBfXJ5pYV0MYJc8FsujZdR8DIwTHQp2cc6fOR9ICaruA9R7LdS68aTz%2FZnokLpX5i4GF1X%2F2tJLF9Y1tH6phDLUWYxymufNEBh9vkumeuwpyNh64YQ4VJo0nynOiZ5D0821U2ACPUbvD0MmCrIyF5rDjvkvgq9%2FDCrn6k9IjbtGjTEQwSSrfE12ap%2FEqVyzksw8le%2FV%2FTKg1n%2FhGjdIHZJkMH8DLkUt%2BdIZ6bUAO0E66GzRGzF8jNYuxzUPnCOcUbYcDzul1G%2BV0xFH9WhUFUzRt15VX7BIqvNc03bhZjE8nzLyLFuIP2fQIW01s2GjXgStz%2BwYqlCvAAB4dkTqA2AowxyKfmsc%2FSrpucKK2%2FXKWWL63qa5Yhesrw8NBojR7pXatVl8jLY4y6ElIOUTjh6nJTlnUKPwijEf8%2FY9oOxADSMtQGRjyD2cQSJMeyRsZ7kzwcwdAlubyc7j2Cku5lH%2BQt0Q9TfZkjC28dnMBjqkAa%2B9%2F6BNnWwia5ABzuA0ntx7FWcMnyF0EYlm364aL3otHEvvRNDgWQQRAJSAN86czZHLj4EWULEQkIZgX0Fd2QAUB3CqQ%2BVatqIbq9dhF2g74ORjGDxBrNFJfZKKoKkwuKTmdK%2B3Oj9sWCj28rLtNU%2FQy4a2K%2FGi1CDYGMeIMmiPFmB9U1c7dTkQ9vVQmBHzlTUs%2FSnDae9zwbIgY2A27PjMVC%2FQ&X-Amz-Signature=3c4b80b6106f3440662b51b005cbe5f59a6290e5b27919ebdf38f7ea5b322254&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z2F62RTF%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031528Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEnyyf%2FLeFp3QCZpakmm9NnuyVLzIjTZPVfv1D31GGKrAiASL8f892ajpXfSgNtqFIQbU23w%2FOE3kz5M5eOdrs6WOir%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMHNsTHtWJXy9AZSnAKtwDlFLWd5qpbrITg6G6PyJsh7MaUH5ga3VATC9Skm4oTbwxGBVjAqRGsUXVjyyDoCcc%2FM6R1A3tjyKjG1reUf8lz6tFSpqc5xNp4OgkJiK91u2QVMJ%2F3kHt6hhZIRgm3DJiHT5i5QkLDjKpA%2FAjp0aaYwTxY5Rw7j%2B7OMhNT5StpIhwCIaD8qbxDhLvQSvgqYq6j1AJUyfhnnsrp6ho90zDV1mY7grL%2B8Yo8PKkLIix10Bj1wr%2F6KxHnYMHlAMhlB%2B0SohVCEg7GH0kUyH222bu1BYDWNUoSEEFa7Bpop6gFr8wf4%2FPUpbf4Xn7WHm9eBtQFZ9rVPnL7EP%2BORYvHUl1kPqgPO1ZFatXIoNWK40V24pGDBvY8leAzjJeRG11U%2FoQg1vbKFnR6DkwrjeNEUS8d7eWmB4nXzYmN6ZO6quMCD9%2Botd1x9UkXEA0jQ1Zp1HITULJOLx7ed%2Fao0VofNu9SUDwEcYWKaSkkQdJ2bsil2wDmFuu9qnhkeSQsD%2BqcV3dK8bAnvnNWYJxy4P17WxS1Bf%2ByzEGKo1iO6%2Bc%2BJQcXDKNs9Bfz5G7mXeC6eIk6lVniFOLCdCJN%2By2cO5gGgxpt8TZhhosRIjebPdS%2Bd3ANiK833615Lcyf1%2B8jsowqvLZzAY6pgESTPr1cl5BJ0MLYKUh4wnyQxdSneMelcGfBGkUQ6kWwRvoZKouRIREOsdqYBqw3AMNIqdr7vCse%2B7Ea5EItN4I8xXw9dSWAPU%2B70fnG0OkcarwOONwjFkfl6Kc60AUqxcUOFnZFouxrK56%2BiIXz9gP1V4S2qRVkY11GMMnZhKp2tT6iHf5pMD4iGVIaZyfihRI1KGKQP5S%2BinErox5vQOespSNhhMD&X-Amz-Signature=355c925221907711775fa371fca9a9507679a2300a6399d6a911d9e11f53fb5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46623QS7F4O%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031530Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC1T2ZxrFIwmy6WEmXGssJ%2FA%2Fj7ORL8yEANveLQcronRAIhAPjAA2xjGxDerKsTqeFYXiospPaEvLcEe6dT5dyoN2XbKv8DCHQQABoMNjM3NDIzMTgzODA1IgwB3j72hfAkYmuyJ5sq3AOq8u%2BA8MpgL0G1AZI5D16iWXRe5z32rDN7OJkb0cwJWcjzWuFczVfJrM3FqZLPKzFNd5Wh%2FJNg3bp%2FYi80s5BLvJAbymilNa5Fh1NkHklfhJMH5Tg1OnQCKQrSTHOCMcjfB1QlfDo6%2FpnGC35spqYJqb8s%2FXoS7rORnhBShhsPU391wmU42cXybcPg8365uZx3qnXCk26JoeIffeHAQOYSrKYtoV7LioWLq5SCPoql3Vr29FcUXRXyi2uHa3Pm4T6A21pAdB3FjePs3sE2GIjCDUzZ66Kb%2FN%2FrozREmR37EpOcMvkdfhqjv5O5krtdhQTAosPx%2FgrpBtlsFjlVFXNs67Qeme498%2F09f1CATqYRNTuJ8Q3hXjFtp%2FFPiMo8NnpoJRqYz7oBe4Pe9a9Ix2F8ZQiGQtZTJ7%2FaJO03i5UJ5lV5fpHxeoafcmklyFKvS8Md6uqS95gLlda6rqLNAMq52eJhWk%2BFTwqU0T8yxFWKF282ZT%2FuzXxFncHPx5xeDHCHFjuD7PNoo54oxSbs6LIyG%2BY599a1jy2%2BahaaolKynsGB3toxoRrqFPwLOlyiFRBEW4GywxeftZfpHLJ2qZMLfSC5xUZ7H1CMN1aHcP%2F5PT5IXqRpbQwY061LXjCO8tnMBjqkAbum2hlc96KbMUZANnX%2BEGqhjsR%2BeAU6PQbizlRluMdgmnSSESEktP%2B5CP%2BZrim5z%2BtnckKBEp7fAvGx6NVjHT%2BoV5E9L%2F6ap%2FEkEEfsPIJKKQDEkOFJIjn4Av621t537hQ9KJl%2BfAb%2FBRbfhfFeve1v%2FXMVlxTDy9JG5nYPoOtCdcgUY3TIo2PjPQt%2B7FjvoH%2FQhOhmzrvoLKsiYgxHZwkPg4zZ&X-Amz-Signature=2aac6a7692908735bc136a7a47d8d61050d31e3a38de81924f45491a1c3461e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=a43574972a668a28e9625e3c086f272ac950f826629e5ce830adc17b837fb2c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=911a2cd9653735459501c082d5419191454a547e4f17ad90af80ca26754d1456&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZMRWVQS%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEoMBvfPHi4XWEFGLfFXqwPLi5cNidcFn3MevQ9yBl9uAiBXBHg%2Btde3fLmGUAxhcmUqNB7lRGhrA3vHDm375KPEaSr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIM9ikgaaDnJe6iCULqKtwDUykfsVTUMwxjG%2BmPrNk7ksRFCvKRjtjJiMW5tyIuoueF4CMeix3fllgIsSfAK7GMh%2Fu3Kzg5VlpG1303Z%2B%2Fwor84b2%2FBytEfthPYdZ%2Bnsn%2FGcubOOfGW0NDSRRdblgMAfekvkILC4ccuYlk63RZXzDDu9hxATkljCqyTZysz23qUbOezJ35eLCcccLV5ZsSK9aVCKsInzOz5SOli98CWkFxLDtKHislEub%2FxkAJuSoZbm0J2wdfgzbsfVdr6eaKLrn3cyfUI5uXmDaWyFR%2FpqnqZUU4MuANSpOdzKAi%2Bv83PYFds3ZMwmUxdN%2FkAR1DXgGzWL2ZrYIs8elzwlSXyOUQxFtKwCeKEre1kxRfPsx5HBB2ViRt8fnxDCqZHPFOSpMJoXv4BKfroibnRIiAs7C7bHUYbQv%2B%2BJpotR3TyeYHstuC395Ex01kTDf499Uny%2BccvnyaBbeTV6vGiFNMoucjBKo9fq6xIVq9f4m1gQO12cT800NS70fNbf3CZ1qGDBMO%2FseaLGKtqbwFGRDOowb5TVzh5oVOIflM4dpTUerL0oMlXQ2eyGnir3zHwLP178%2FZBFDhMF4O9p34bzigILYGjAHAsZqKlCucSoRslLUi1LOA4HzQ6mQCiLzwwu%2FLZzAY6pgFO%2FtcVxTiNOX4pVFXcFkbkVrsJVObEyZbHwcD%2B7wpJyy34D4tqgZKk46h1eEsEI0PEpPxLVpfGKz7aa3rE3dlzfL2%2Fv4Vgl34Ufclgpdo%2B4%2FTo6BDsAqDIqVuIWrDu7T0y6ycT%2Fv2242%2Fawgcr6hIccOSaks7f2s14GOUw%2BWUoXNz%2FerzdJZ9tWDcXLg3FMA7XTcNMvYpmWZYdetO35zw6gvkhMqfR&X-Amz-Signature=8f7358feb8853aedcb6100a7c237c56579813acd4c791b7f48767f090785348a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=c61e86377415535a703987d0333d1a40a5ee037cc4abcef3a858c01fed0541fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V4IPTRCW%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICoBOahWYEavOyylbv3UrM5Q48LfoNW%2FSk%2Flk2KtJaggAiAIV0c4BO6zJDY29uebzavtGtgUnTyuY2yv0qHbLuts%2Fyr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMNzAjZ1TTDN7PdVHIKtwDwkNNqJJ4clsoL585O6zmpB1nae1xPnHu%2BTlvMBi4DoXddS253FzzI6QOYSFOr2ru9vQDyKlsU9Nq59%2BXrtBzdQWlTTiMcuPEw132s9rpYKna5N6ZqXWcsbvRW402jlY93e6BewxtBMQTN95krU%2FsImd0L68VqM3zMkbFNHNYq7igjEOcCfX7IljHwabe6%2B6iXo03zTYz1y3a23gl3ZKG1%2BBR5juRQJ53OYQDmTjgAs6yjCM%2BLXxVhM84H6Rc%2FWwJ0RzP5TuzFTJuyWoU6lIcQ3P613JGrneaYUSg9YMP84DYed5%2BV0WKqG3ea61hg5tz36SQUPnG51fLvG1Fj3i2gHiv4pXKrP7hOIG8EYFrV7FbwLltaCfg%2FQ6Q%2Bmd1dACZ%2FtpgbmTuYQTSjp6KeyKOoA92Gt%2BQZmgxcQAtRPVn472l8dzGjK3EY9wKBmKQgIp97yXBwzxLR0YuhGanZ7sz5V1rP9fxNuc8tVG8KJ4Mc2n46OmCJyh4LvuEuF4BM19fGF1e6kc68Z4uFNbAMj1K1Ct%2FJy4HGEmxb4Sk%2BTxORPtykYof6%2BimSdsfuSzQy7tDgNv6RIa59CuOf9TOfmFq2iA7bgJA4tJRHuoIbgAzBl0MlWnj4RhPmw8IQ5gwtfHZzAY6pgGsqDy%2Fy%2BI5k2jLqpmD1qsTV934udXzPjstjePLSTmWcgXvUHRFvpWZE0pKdaz%2B1M9d80ARK02S3YSygb8wdjbVukwTq2Ni46%2BS6Y39NB7hT13PFIlC5Fs7mYtQlN9yolvtzvnlJeyIFQYgjUr8X8jIisFkuXEXZqVPJ2hsbEPm2Vw0fj%2BoCR7ElLOrueCYa2BsFoQCAlTyephhpmxZtBFCzWoQDsQs&X-Amz-Signature=cb57c36664b2abf6aaf1bb91da7ce0d1562b618c6cecb24bd5da3392d336db7d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SG6YFLTQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGt%2FF9m7RQmIFKfyUzPkzh6XiIPDf9qaJmDIY3ZsEB0%2BAiEAignZUsRacB0u90beztGohNG2KiwBUrzZz8cyFGkaLPEq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDHZfQy72JDxNaolASyrcA8fhkY2B66krSSjxJsh9QetXfUjeIgTwNsqZZ2H40aCXT4iFqQMjhbXatPzgAq96IiIoavKcpdl7bFTUxri%2FSZq%2FkseykKxUioYsqxYWIY22E%2FBp2RjGyq%2Fa3Eb1wtZkjFHGLAtYezhgndPDk13WanMEGZjqLZNVZ%2BBKWuKQcLAdSssCwR1P8d%2F6%2B731OMtdfXnXX6IgsWuJd8UrtIb0%2BqjSG1X2dvbYAeUOIbk%2BSqZLfl4CDTCyZHiB%2F%2BKlsKOEGmOW1IKhmjGY7Kb50bvJ5TpG0h9fonjbNgGybwGRUsd8lbtyId9SXtc45hOar7Aue%2Frlqv8GidRI7fqEGg6creUkNjBXLACl9hBIcFgd364IgYEbYm26C0SnSL%2F%2BdIwhQkt5Uxn3S9g3BX0zz1U1OKLR01UCxbo%2FNv5RFQ5%2FUm40ZT0OFoKOmA5jG6XbX9XKIAO71Oyh2IP201b22Gw4B2Mus%2BhmOninXKJ2zrANgGAszMfFIpyyL51xVOHpifAENDvkjiRnlXnOOUzZ2nDAECuHTa3kfZaJXIvjtNvH2aPmpu0W6Bb06ioiBT4KupwqoNv8qliildfvmYQ3SmkpIMhY3bHF3xGCr3Pm%2FNt8eL%2BXpYrruQNw0JlXqqFTMPfx2cwGOqUBLoKMx8%2BDwJ69Rmlbe7XrOJ20uhdHf0zjp7aqHCTeOpWlt6dSqvZU%2BCokLtF2zoSBc%2F7wA4OOQVb62BqXSHJCkn3D0uQaSgD9MwVydZ8vwczmxwfYPTad6HbOAS5yMDyrMEpcp4qpjdGiBwIxAgY0EKeg8ie4Tf8jfeJgU7uK%2B2EJZyysc426r3WF9I2phBv%2FFwOJpt0OvzbOQaKuYwVABFKO5JJJ&X-Amz-Signature=4cf25e959e7a70cce2716ffa4a56eabd49f92a265ec369faa285d6b0891ae0af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SP7WKIWA%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDa1eAQmOdt6c6c7Kx2TewiTJNUjpbX3FOI5Xc0XbGn3AiEAzELaO675iabJbFIicRISYGZqd1QpIKCl2nSZTqztTU8q%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDLME71F6B5gXIVKUoircA6fsRdl6uBW8N4eX2Hrr2HWSWewsJn8hoBg8Zabr4VryzxBMQ5fhFE3xQAJ3U0my3DbDw7bLJtnIPefc3FVMPhJcIk%2BQb18VRwvAeAKzoYTQnyM8%2FPWAf9zm71M%2Bhswja3lywuxiP3fzv%2FXASTbgYRXggpGhx9s%2BTTCIhwa9tflDN5%2BcSCHAwY8GfM8KK6cTvb%2BV%2B4kgwZGCE62%2Fx21BGQsOEhkosu2y3N2s25NQEueRIZ%2FRwi7x6H4gA9wfLDLQob%2FKHInl8U%2Bepb7tu7B9i4F0dGq9r44H7YU8ddJhOklsdPevfmnvMTBjgwgQjCJ0ys98AZmxAe1qp1ZJ71BHeq3A4ccPBtjHBYaEy5bGY8wi%2FsxUfE6xX8Zqg9Vx9hImKs6FANua1%2BMiWgQ8xC4IfRHfvEg01A%2FQytuF9taePp2ZKShcpNLjnd6Oc9rFD7qWCYWjaWXgLcrbqUPV5Z%2FhQ6TpcK1RDXFxHAFuyyGY3YLBkrUPbRP7iso%2BwZBjmQdeti%2FxrkTznAnBYgq%2FKxai%2Bc9TSPMaHs%2BEUT%2Bs9OpuFP9cDkZ8zp6UPeRF4EAeY8Sc1gNraORm1A0MPU5dOFYWnE6FOLPoi%2FVdulKYUGd210HszEvlgdoqfDxEI73DMPTx2cwGOqUBAysZ7gxe2M%2F8LxWyBv5rIho%2ByQfDOx3Wmq8YBvNMl1vagAikKym3UHztns1ZDE1F0Q7v7mk6yc1%2BnRta9EJRgCg1bncEdKPrZE7BrUXGQxeCUjvV%2F9Y9fUtCGQf7MminLt7fdOs73NCoRNrFJqtfZ%2FWlFs5J%2Fnh%2FAwyjCu2qaubzCThZ92howMrd9kEIdfr03dV7JP58Iszzcnjzg2Xo9Pre%2FJuM&X-Amz-Signature=88d7387f5a678efd13691d3b35cc64801b4dd41e5de4349f6dbdd6dacaa9b2f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZQ6IQIR%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEO2dwQanbWPMGPRC7fKyuQBIi5enBBRef0%2BoLqQsdrCAiEA6sninU6Z511p2SbrmoQzMtsnQSlJDYcSX84EuSC%2BYXgq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDFQSOyAT%2FzgilIK0pCrcA2c78Ha3Id%2BWIa7wfX9fWAPERcY5xaZr%2BSd3aJtEph6LoyUSbw%2FuVQPXgLbKIgtC5FewAsK3Zl7r3h1Fax5hS5V7xOVyPobzSjbzgqzw%2Fi8KPdylcSPwUv%2BQM5m%2BgPsEnw4ytIFz4Bli3XLWEAjETYVSeEVrSszdXX9y9utVlJRKAwlVqJsKGlvT2kSfo0s64bAltWMnwhwB%2Bb3swckHjsdWAu5nZ5xtGXdVhso7NNYYGRRvInDZN%2BJkt89rjBy%2FroGF%2Bh9k52lCQYSuS8G482GE1OdSu5F3coBDbIz3DxIp%2Bt2vhVxL%2BpDG2KZnICJC%2FBpDcXg5CF4BaslpFJflyZXwBkpNNW%2BuoyUjQxEo8au61ioJDdwt0EAUfHeKFt7OYR4TdDc4V%2B7ymXFWDDhDZpJEeUnwhvCo34KRFE1%2FVnmJw5wOceUJ%2FgTv%2FZ2qusEaFkBw3KiaGWU55KGipHVYqKqnr8tLv9bAul6gkfI6DdfEtotB1%2FWi5VhVPF%2Bw1RZvQPj%2FiMH7ujea5%2FQYUnfeUH8cag%2FhNW3bB4VOzeMp7fgS08M1yx77N%2BiogRQolg%2B45wTMfsnpx6Srep19ek832THJTfnkCFWqFjfMol1JjoyZb5Fb0ubFB9KKlrrwMPjw2cwGOqUB7KF82X%2FoR6WAyKXTk1ZkodlPt7vh9ftc7QBHpB6262CnJITWqn%2Fa5QiNppA%2F%2Ffyq0VoHqzPuCMoW4HB7El941NvdT%2FnQpF3myyxSc7b2NgfcDwWcEht%2FtmAUrXCAnIHR9XmVGZvc2dJuVbdK0qOMPkpjAYhRCALSAiTi8FRLwPh2iK5b2RRUIIWLQgDZJpsBHw32Bmr48iP6qI9EUcFTxAQ8Jf9V&X-Amz-Signature=7d387cfc726d413f0438b95c5a601223c98d1e8d530dd4b43e2bb50ea55316df&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=891420e4335464b041deeb4631ce844afd0da4641cca5cfe97fa1473563477b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZELR4FPQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQQ%2FD1%2By0%2BvyENCu3w3m094V%2B2WHTU837AHMIMU%2FLzVwIgXHOSM9Q7GHAgcSOEbHsrGgkMgOE78xpM4bllKhhJsSAq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDIXUcL0AHrcm2bcLKyrcA1M8hr6K2SHRpYAMFSkllGoJRBdyGmdPFC8TaN4Q9ulh4y7Nt37VJh6BRD3WNzqFXKzmSoDA6UBEWyI4ynrdQK1xIJzu%2F81vju5K4Rmhp%2B7h73KrtR8rEXJO%2F0fVE2L1%2FgEPAwyAPH4rr7tYLV63Gu30hpmqH3ZNUD1rCtwjkZj3V%2B0sbRX4OIo4L6XAQIsnSuS6OYdLDVdeTTh0jMKeQVzq%2Bg7121QUwYXV5kreFs6bCICAykpK8%2BU029RjxQDGGwigegr9v08OseWlWmlVQHlZ2QgD4P1I4kdQjOQCbp8eSMQSJgbI3Lt1t3Tx6IOmLZ8fAZQA8GeEDxd%2Byj2uE29io5T9x8kO45vxYymnFJwyYDk43KvajR5b3liBTzHqEMzBf84UPLpzL%2FEhszMA%2FHuexAY%2BEaUKeIwV5up8NDkGQ27hd4Xs%2FJ5HF2XlyEiXaprr0DlKEBgDE5ADZtjWnKPn2U%2FY1QzX6T67zQzS0sHtUczkv6AHk5pPi1Gqbuvd6%2FzFTUsoUd%2Br8IuOp2XshEQgWAL%2B8RfMuYqXt4Ff59dMTkbw13NBd9nM8WqB333VoFc3o7lwczp65eWBlRwnpXqgnUoAI11ARilVJ3RRllcrfa1tPlHHgeMe0zs3MKzy2cwGOqUB9w%2BuFn6vV09oTjAr3B5KHEoi2tIgl%2BZUyQGnSeZQZFxqOPZF2sBHZjwEcqlST9HuGufc1z2NF3o%2FLoVEk2pQFe3qvP62nhp5kg5P6VpbPHZ5fcIU4IJ7jtRaSswzVXIcBZrMMss02H5HrCwt0guPKwBcojaGY3TB13UGsBsJD61lAkJy0jRMoe5HSI4of0GYkMJtG8eO4rtxON%2B4O9qmx24%2BYIpi&X-Amz-Signature=3e243a710980f40ea1663aea219a3cdc93d13d5ebd10afe793f076aec3c4a344&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

