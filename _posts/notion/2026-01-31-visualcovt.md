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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=783ddf1b38ea367c30f96618d146086c92f318b35d1b0c605c3fe8827bc3e820&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=f2e6cc2f84b93449b9e27115884107ab88912b4be2fb4dbb5d0c8640e9a714ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=be9601321e5652596faa422fc4f89c782c161e1c179bd7549c983aaf6756fca5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=95fba93bd33f2408bdabf3df7b874712f701468f8b3a367d9302bfb29dc6343f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V5NX4PJS%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041606Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDIhz6rlKrumcttzO2LsxpOYNo3Iy%2B%2FytiEFBDqUkqwpwIgHMCLcW4SwHNoRWxxWMKj60GMKQFEqFePI%2Bty4zhvTikq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDCWkPLzPeydud2IaHSrcA%2FQTPrt0qiPCXOHDS8DV8ViN536JSq202XBN5jGoCOhiitkcq4Da%2FVpyMJHTzfO2bWfC6TSOLRi03xWm0BDecDn163WJKq6kOhfXe6Xgd7ONGs3m6SmDtv540B4gSepTjwskf8AC5nTmprZ5r%2FqVEjUOLlhtCP%2FpbRa4HbqyZYI7JbbHRIgK4CYOoMWZdWC%2Bzt4%2BF4nBzEqiiquxzgWJURtBBJp0i6vFh2GXOTCm12RCwmFyZRNX%2B4zjfRcXYZpIFCBYvbnnghxqEAknFLtZsUmNx4BImAUb6M8jhP97bY5ZGQZ6Y6LOlSl%2B8w93druiwKjrA8RdEEMBB2gxluRJk6I1jYZV%2Fc5pfhmmIqSd69sUA7Avi3XcxUzfMCT07txuA2zbstf%2F2MiAO2cOH2zwlvrkU1xTeKCEdBG7tThj812a86aCKGUe%2FJhlpLdPXwG11rsKDmqqcOEzwD1O4bbfYSNMS0umj90sXy8oqM9hmtxtEXVcYWs9%2Ffbkx9EyaOueTyo7tkTX38%2BTW7%2Fkq67HfBuXtre3Aae9OFuzAh4VGkEA2MjMVCjl4oROrAbCiPKQlJYjjQqyf9q%2FeA%2B4DPoCLaesd6jYzZWgpFw5NduOtnvUAHgvWwUtLcE3bN7jMJO60M8GOqUBKvP0zNumSvdEJLRZuqFuQ4eCPko88tpQ3Ci%2Br11u05SzAOcqxYUCkDu3hnD921qRWByrzdcp2OssoY%2FbImSOG%2B%2BcatlXEPQPES0aTxN9JHHW1ClXxrLy6RcTsgyKTlvbMjDv%2ByXujocxDHCzuh5%2BkhMvwAytaYbGPTeWfQm%2F4qOP52fE4y0q5PDdkh6QwlGj%2BBYVY9zYyXia45bkE8pV52cFoaY5&X-Amz-Signature=ace697beaa82d8e2b12dcca59d4f8ab784d0265badeade39b575ed51e3ee0b71&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663DFGNEK7%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041614Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQC%2F61WBlCka01kXOj20H0eIh5wYf2hlCQllqzqu%2BxpcewIgfo8GxfL%2F6clkiRlYh3%2BAnOldWZkza%2FvjodB1B88noLYq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDPj12QgYeFSfZIz6ZSrcAyImwQO0gPhMJ%2B8K6i2HI6GXy1RmvOxn8y5ZOtZfSqqQTrtzkCfcWeBe%2BjyuvHBsDAV03Q6mF%2BOKuaRawqBjIzgGIqFeMaxPdoljO8CCgl0a2n3dfHbH3X5K0q0%2F2JZ%2FS7vRxIszBJJHmTzR9ChldDgZwES5xK5qj2GX56DBaq6Mfh%2Bd0dus2SjMfKT81%2BhNFZo2PUn8T6bO%2BcJWAsr5X4O3XjnGZWsfDk85GUwnCGNBtI10wxebqen5d%2FHn0%2BFBpOamSB%2F8BN7UH0ANsWoDBkfU9Z4Ipg1XsqtD40wpfap%2FRcEsudigedNMgbINCJvRdrP3xKeZ0Scp3Gh%2FnqqR4rYyeKNgQiOjCn62SOw%2BKuju%2BzyglfFh8bTl9jorB9OBwlEk3DYB%2BzsxYItNbfRKW2CtB1Bwr0F6qU3xDQ%2BBolWHPblR1AyTwKip8Sf%2FuM%2BwQSYS9hGVuGTWReqoTaL2P%2Bg52%2FLlDhoj6Z%2BExixhJNfsFPOC0FtuFsZGXEzrKm8P%2Bf09RZ510H3XEXcJ%2FNp%2BSC255gOUhRaUg3kmf%2FRXcTnhDCNitsYkdMFQbkOX9%2Frdt4nibYdKV3GuxHmt%2FQU%2FIlDP7PtUtOMrgnRJOrY1iewoTPTsr1yTXz80iB3pMKG60M8GOqUBwtx7PliapPnOxvmA7iC4aEVcX32tWvkLvejkk2cMlw75sitnDRXU36VRgSAEeu2t5JV7KOFKRsNA5aOAyDZq6WECJD5AT%2BB68M9BfemEkv94HzUPf%2Bl0iSTOp6%2F5LFvQVRM8V3kOJwWNHtiOYS0cKxSQGgtjUJuOwR%2B5ENLV0XLDGw4b0T9tSEN7P5HmnkBS7mnGMctwzru%2FQiXspMrww99hwgpb&X-Amz-Signature=6343f36c0db8d8a64ac9055af30ff8cb28aa3b387cd3d06f31b2fc8c0d98580c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HVWM6ZJ%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIF5nOBH8Bx5taLHh%2B1QnqcFnzZrfatWDggnRMCJTKSXDAiBDz5899DUrS1fSXHBdz%2BriyG2kaQkhS09O3M8xpLY%2FMyr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMoocypAvJKsiyN1VXKtwDq5y2YIsrC4x3DXunJRFZi9NM%2B6s2U1j2vvSPXq5D8mU0%2Bi1KeXyw7p%2BXxDNHSZ8xpz2CV777QhduhokI36dC7ed2Pxf3G4ZtLq7m%2FOhH1agiP0qirh0eoVvIXILjDYz2ZF%2Fxp0Xrsunq4Z2ZwGGXjXIZWa72oSlzVONMVtrSq2Vjp3KDt5HiMzuCoYVaaX0OmNx71U6BTaJOJqQFgj7Rfw%2B1ntitFa2mBng1qXeSGR8JEuCO4iMeuG1jsmYOQW9Hb1bGmvEe9Aw0ZIlCIS0ctrp8M9Xd0QkfSdxN2FZJEHeVIlAk7VxYBd0Hgs9qlH3uUq2XoqXUtVVkiEhMg94JZmHfJpOGYyblc9c30opOY0yEVXDM7Jqf%2BGKYmLjTiE97dHKtO8lLM94SeqqbGwMiMGeiBOQNBx%2FWAwaKEpj%2FEQ7lbSGGHFYJNhftEUvT2jHA%2BZmQpocdSGgoUOIk7HH5sBsHO575oqcqP1jdVMKI7K4Czz2Y8jSf6n053yL04%2FPjK%2Bn8zx8%2FiE%2FQFqvQAncRU1OrW6HPc0Hd%2FXCVZB%2BeKeCtzJWyFTh9k%2BJ4f42%2FJJKNpHm6RmU0tJDQmO8caIf8iUJRfIndmmu2dQU%2BREBP%2BY%2B12w8DlsfjDAeHmqQwlbvQzwY6pgGSWHO4mYLI2v%2FywA4FLYpfG8PM8AaIvkTyMRnl7crlzHut%2BrO%2BK07Xrl3%2FD0Ka%2BoqwZudHGPwJX3S5MQ8izzRccixB74lTnvpJKFAJa4NW99xhcWK7W3EKgyC3E4shtVPEYC4yuzId%2BoIZpGr1tfTSd98cjW0gzx5BqHLzZxpPSgkMiwYqsBFjKxNR8mkC%2FlMX1Jlo1Wdympws5XKjqnLVKPlflSv0&X-Amz-Signature=577367579ea04a5b01e8a296b4741f0357e96874a85ce037a21f5fca155f9186&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VF72HA6I%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJFMEMCH1S5xOx6CUMR7m%2B8GrPsCe4HjFdrA82UrYYaAF71YWgCIDXJbhdPCfRRmpdoaxz6YQnEBHZJ0BrXQcFBX4TUHxOFKv8DCBwQABoMNjM3NDIzMTgzODA1IgwxVWXEtUl%2BNI8UeiYq3AObPstW98KpJxluIwLRodK8PJuX3D4cteLUZIwCSMJMM109UguRq2A5gGnKG%2F4NlYkEse4wHOhtYApINWG43okiwr1XQuyJ%2F%2FzWE4yVIXpwt8B2ObQQ%2FDV0ienOC2KsPkyxNo3Gsj62stU%2Bif8yRGP1rR4HX7Pq2s8AMpj%2Fgdj%2Be3FoByy4DCLDkXrUesupGB6NNCO4yUZO3uegMo2IZrAa%2FdlDiEvkhftvbQ%2FK%2BanAdwq8A%2FFsM3SmtgobdWkob7GkDA%2B5ugLcTu6JRiWy%2FzedDgD0N1gX%2Fr1QKCTvnyShruFQv88asOZ0j8TRtfQ%2F44pymBXF8sks3j0jRfl5S1MhH4fV%2FFo8LwKNvWIMo3uMC149rivhJxHXFcDKOwSFBMq39iXxkXJvAs37rXOGXnHtuUqAXhO8MhKXiHVdb2J59R05LfRj3xzKYAUGD3x6UoG0RlbR7NOObHpgKSgDJ1s1HypUBpyl%2BP5ELAjfveSPmAQHjPxlq9XoiLgu8GnU9fn0UzdSP46YoPn7U%2B6%2BhJVU0LmGSp9fzZjgp8xnnvNtzeVvt%2FE%2BXW3PdXYTGiIxsSiQ1c0Fqy0E%2Fkz8vOPS2XUfXgz5BAx6RRBmUegjNk3Q6fVbKPj1ShOCPPX4SDCgutDPBjqnAepOEZA3j3SIZgLrtZZ8sKiEx6qyLnA5IsGVLPPlYgBuqnSF8Ipe9PgGLtV3krzFrBLwlnzhVo0NN7X1Xh160p3tMzqSTcARA0fYKPc447joUcwSqj9r7bFXu3ek16PnWWz6wiNe2vYfW974C8InZgYsii9yZrpkFYPc80zlrhJ3UQk55mvRWs1DUCIGbreWpNtDSuOD9RDoTXW2svNDbSV4Hhz0mML3&X-Amz-Signature=1df3f9893c58fbf87784218617bc5e9ee0b08110f31d0607fc43c448dc57210c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=5e5405c1949f3ad988f384ffad37267e893512ec8238b1ebde0a441619f8c1c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=29a3f6fac6bb47b3a9e2080586eb54d1eb85a0d96ca601a39382d3755e73a6c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHC3C2LC%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041618Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCujPgg96nI3rcLTXGNaxhwvMz%2Fs1LDvYJ2eV9TmpKo1QIhAJLQH4JsHdgr%2BCAd%2FtKFYWddT1vw8DJiA%2BB8hDg1w0m7Kv8DCB0QABoMNjM3NDIzMTgzODA1IgxNjIYp0bkXL1Dr5Zoq3ANyxS2j6OQQ7qkedrw3CxP0JfVg51KDrFW6qXDcBfixsQF5k0u5DHNcYk6FZTPPi%2Fz8zkaZ2GhVGOsUCisdB%2BvKYwrG59XqCl3Ll7s%2Fvw61av%2B8VshMIAN9o7Qz7YGrihZ6tTWuv%2Fb4IYyMPf2UEn0hd1hzWO3CC40lNHxATuW%2FhgNQ6mZ1tDFpcL2zGZ4CyD6JvNJRoycCCX%2FGPPWPQwR1lNWrOmL2OrIxbN29wflRtH18tYsto9UU6Qg7y3wF30sw1XN431FL1ncZ6smmJNgU69rzltPaXtAKzmjYGMxjPVObyUtEqdkL1x5SE4wy7O%2F5ExbM7yE2PjUx%2FPXkMPCFi%2BMT3fzcn7pTg3oC6%2FpsJsFi7zhWEu0UKuqwvdd1PMrtUzfqlH7txou8gw1QJv2qep5%2BiR4YlyjXohUDpZjGFaJ5kyG5l8eVd7Dl%2BQF%2B%2FnLi1HwiTi0cQMuPDtkz7LsT564TDuwrdTGBJ%2FQijD8dF5ngb6kh2Siw2pJVtYcBo%2BhR3DBuWLX%2BzTZ0n%2F%2BRhgzKgFEAczvczhCcxQlH3GWWWUa69YDZldJElZuFFONSE4s7YVsIXn6J2bKlmZGX6w3WjeTn3bGGjhmhJ%2BbPGyfdef92pgP7KPf22eFd%2FjDMu9DPBjqkAeLgwF1IPNu65H7b5P62E4AFYmYzZX5g62UmDiiMY%2Fyh5rqXqF0eMRaZ1ODgFO%2B5FvU%2BZbpnopI1kUrEXkaXdw3SOf69lbVejGOJriMqJSwU%2B5mJ40uHsQnY9vzFIOgKEZMs6gtAt2h%2FESrFgB8qY4GlK8lg5%2FqvEJLxdltZpN1Aul%2BHzzrR4uq6WHVKqCHq1HkrV6hxWwHPQZLNlwgbBgeFFvmC&X-Amz-Signature=c4de2d01c5b5707770d7dd1d61746f75c02fbcbac5153b691d87487bd65a9d03&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=fff1897d477af5e8d98dfbd9dd5a194099358c4a96add104254a7a74ca363a66&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46646HM5LVC%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041618Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIDLv21MFu0vBwur%2FMaSNGMYg70EBB5isESATHVsFh17oAiBJhhCdYMWTAp1t231%2FFRSwxuVrQLZ24lV%2FY9Sw0ezmkir%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMNRChMVbzgZknNx1oKtwD6Dw%2Fm9cHGJCaQchlBkxzcj2ic2RD15nhxJTO8DcgBjH7KqnbUK8rRgY0bhbQRMj5GDqN8CZxPVmkplQwTNy5P6qBgsGmlWseR%2FFORM7XDKRNvVovr1UAPyHtgwxfMHKB4%2FzIOr%2BlCo%2FgrtI26VXAGUXblY8SttX2m9e038ohuSMiDTpd5qn2tjMPUOF5YQlWv2yEGFEYZ79j5HXzxmg2GMdwOVi3LSGgNKgv6%2Fr%2BI1w3c1hdiWMX%2BaXiC9%2BCA9wXfRig4S%2B7hB3vsvLFTMA%2BWurwpEf32KqBXID6y%2BxPUT%2BA1hOn7HFUhAMEXZNP2CEFbOJ526ILC7bTMgky9hKVURkKZNS2Q9DaPQOPm0XHfsrWd8kGGHsf2WJ%2BHg%2BGTdrgQLSHxrJtpRi4WqZcxxZRn%2BNJSVrz3OkMLp%2BramSLPC%2FqGTJLHVBo31s%2Bju7nyF9PFOn4RckzSAEFuwcRs5VPoYF3ArMP8kBbRV5WKJVYocmQ6AX8OXhRQ317U66N30spwIGPUc9JGz5KkxpWe9EUATzWl1CGlPKs9Cp%2FdO0louV3LlG5%2Bd6FVtO7RkKcaZZysuTToYZXAFOqiRiqbK9v1qn8%2FBZcN1TzQ87qCsYRAeNLYR1hJvBC%2Fg0ZneQwpLrQzwY6pgGXkGHkcvAKTUsPTpe7mMIj0z2WGaHs%2BJ5C7uJHurIG8MpdZAk2JWrS%2Bgv6vVvheR1spttu0DpNXOuCBgbHEKU0PXyutwBYvEzX6aDHu2LlNWwGH9h7OEbHwGDJsctfSrQubRF5u7KrGw6ZOu4MeKFv5WMxVGaxrzI0P2PyaamNORXJraZTL1oIBq7bOBSOMRekdONkE%2Fw%2FRI5RFXYFd8X5Z28R53Ru&X-Amz-Signature=483ec3d2f12ee1f5a2c1cbde1c4767eeaebdc83fb9804dd249d2d673b79e8d86&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JJK7QLU%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDsjs6mjNNAbqJ9fNH2eVHmgwC07dBbxv2ZqIUBFxtyEQIhAK5E3UizeMyfVoF8vgcfpHv%2B69PrMGWwKKmhs9QzR3gJKv8DCB0QABoMNjM3NDIzMTgzODA1IgxhmBl%2B6iI5whwCDtIq3APC9bI1ddlODcduGAmvQpSGp7XG4PqyRSNLHF0Pv1lmj7BN9zMoLteEwi8FVcgkKk%2F6uCJcjQOOf%2BUS8IOs86UDU04SxoOwi6NjzArUXHChEHPdlBqZHgTwOjUmRM6B13wtGtl2FXDDHS7Qi5vwvuBIY4nm4CTIllqM2jJL6M2vaeLH%2BPD3JvvdvdgITWG6Qes%2Bzbr18TisqCEsbxx2mafBRtIb07DeKZd2flJ1rostqOsBkDs7IWK%2BddccXiXVZ4wZlDlrIs4YZZpajys9TLpAgfdIe6ReglmIcr4aIak1pkP7k09GB8e%2BxxbKoY2BzFSpWhIN7Kr8Eylw09FGEJ9w0UVXc6K5rmtN3%2B854lw7f0SX9piG3miz8Vg58bIozrEcOXgP5BNLHyRP7%2BNl4DL%2FnfF%2Bd4kxutg74BqQr2U1hBxerzB%2FIbH%2BDIu%2FQ6qIHStn7r1jDavmrOwns48FjQTXoBiVBVHAHj60vcwdcrczNyowyzgNUwLqVPw0Pyn834NNOvLPivRY5AeIRY6%2FtAe0k9W3Ykez288OgjxQppZVdumzg%2FSl6jZvjmSJU6p8tdccLnHkgpIGAcjXY5YCSGX%2FPHzldKwDKp1hE8Or7SpEUYD0VuhIGCYhQ41HZTCpudDPBjqkAamAxKqNSLrglJhXDS3R2v9nuJJe2PzY%2FSki170poaEq%2F%2BNmUV%2FiTWnLfHxvIOsEj05RC1TC2pWkB36e%2Fqxy02WC0fh8%2Fksyc5B01a%2FJz4TpyTzErnLyr%2BOQxXsoVyoHQmo9EAD4%2FgvpI%2BrW14YZzyA5ylA6qmQaMgGq2b5PyJyNWez5YSr1WADM8hI8p7TLBIy8eF8p0pLwhq5ncv9RLgxmtjtF&X-Amz-Signature=397826f8d10808d2093ef3ab7a68201542e183be5c1e5e3d33c81940ffbdc72d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YNFPXUPA%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIGpLgeXOriMVUmhxSHLg5bYy19aDiRe%2BGTvRmrrCKuKxAiEAlQgJln2BIIXjQs4RtS0u57pdNzxu5JrHuv9%2Fe99ajz8q%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDJniMjZdGgudnb2bUircA6j2mycGZNIFeUDkQhnpIi2l7iCTmiHB72QQ9%2FVMiL8P8UN6CYIHcR4eIoYgWOeIZ0GqnqSeKfjT1V0RGZIQQL3HGGPRqdRqyKv96i%2BKkXdzrX6E0%2FqEHkYSYoNALxs8akcE4lfr8lsjyNwZvXKX9CZ%2BzwOrNZUIrxI47uWLV%2FTYfXe%2BgDfjLcGEtueOGYcLymXL3hxEwI0Y8qqT9m8a0YyTAlQpsuvVJR8tOc3tlB%2FV4N1oShSoLYHfin0JsO25tYsWCl9UZkafOmJmv9ph42bJryHnbOxdOSJCALgRMSqi4DqeCGdYTgzTMTyzQVwJhVxlbl%2BZq6QBsk99iIhP7lQqemP6A5jTInoo%2FNZygio4E0nOSP%2BsjF%2FF9%2FqvOHg1A%2B0sFTIlmiXyTf%2FdmAeyuRRsr9hIPU2ZZoX8FpPaWXMBEDfKzjpdjOHqt6AGMlavcphbRG4IGIYbifHBBoWIYc3t526iLlojOdCgoCMJILjxUB7sxUnHzQKJNIPZsLZfjC%2FSBIUNx5haaoSa%2FGsnpR3AzvTpDgQs9Lxw62a4pkdM6sWqSu95UQKYK372Im2vXLI%2Fb0aSZyqc3gZAmLbQla3Hp%2FGlhPBekFTJ6xxjK0vXieJkeBUIH90Sp4DKMPW50M8GOqUBh0P0O5m955R5A6E%2FH1jFRhj9Obe%2F2AYnKxBvkEk4OjLP%2FDLfFAmwySmW8q7eIh8KR9GetcxhgRpWMh3I%2BIMhL%2Fl95HDGtXxerNDJZtqji%2FosVih7u%2Fs19hsRqqdQtLFqzEbc1%2BT62P%2B2hQQ2XPut9%2FWZBgK8W1gxcIm0VvGOcxb7f1oQVknl97p2C3%2Bkh8bHCLtAsNLSeJb5aUD4%2B2ukVxkw46Uw&X-Amz-Signature=53f6dab68a5278f4e645f318ec8e96c3b06a7e026c095c4ab6298bb74a2b8c06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466353AL3BH%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCMlrRPTkeWOFFrkuiSX60F5iQrzM2ObVjqOuVTI%2BKfHAIgWFhDKoeQteqtkC8m5HbwOlnu6oXTFzV0Nk7IKBFpRkcq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDBH6zrJor5Z6QzQGOircAwnXi2aAXKnyyOM%2B6lrLOFtXpEG1xAGvOItMqtMqRHE7uP2cRkvcJagSET2S98uMi1u0Jodyw2z8J6Ll56Lpj630FEDubhruNCOERGHVCCSQn%2FQEYnkApuoqkfgab%2BTD%2BAiHRy06%2Bo0qpemGuMInl%2Bte07grpLEaBuei0u5lUoPlDEC2ncLY7ecnSUO%2FVo%2F1lK2ijJJhge1Sa3vzHr0QUlzRn5Fnh%2Bk1dgDWcafhjhiWF26qw4m9fMU97yRPSI1eC%2FyU%2BwarX%2BPxBlliYXcPpMVe57bZwyfPGkcJPk55tLmO5RChEZ09wCMyKSXmfciQmtQM4F3UC1bTygsAaQJdIFBTN%2FeycRDVwko7mH0CR%2FmoiMfaGr%2B7sBwlLqhJuQPmwfsk8%2FBvdzI0zYfwesx7MQqdQ%2FORJz1Cq0M1iYKsY98DwBZ%2Bi6YyUyuQk6ybLgYQcd2aQws5dYKPZVF%2F48ZOHJ0KcUf950m3PjnnQRO0XA3PU5Q8v0oJ6mTWci9jBrvj%2FwrcDBoWR8TRkJZy8HBaPneSRRvLARVywtHCacKqY8HoGfTVAo5R%2ByqahXVWTn0rg9QFbdWyOA43ru8nybQf7Mfz%2FSfI2NGgyZBkCCX7ea2ksU5CBdwONJFNVmXDMPy60M8GOqUBic3km1WHffx1bcP%2B38ICDgOl8CCErIQYeMai3YldG0kA5H3cvo671DqNCz9PwDNmL18MHnuP78%2FfCk17%2FbpIQYC12gdHyEY3Th43ejbaj3%2B0%2FBYHe%2FDO40bX08u4pRkZrxJPzZKaSXT9FQV7Ed15boVE2khslmGs0gXDmu385Yf2Hrt%2BVaPKDiyjt5zmVb8U5pT43Dtvcs5viqPmCcy2nSIu0bJ7&X-Amz-Signature=ab9dbb5d1514ca72d73ee21cb6f8c4266a229571e8faab24bcad4d862e3bdb0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=24abc76a473302498d17cd4a280a5c13ee17aeb2d8a594f5460317730ad6e4aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCWIGDDN%2F20260501%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260501T041558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCrfGIhWZmeTEfyCu9A0oUS6P%2BR00Mqg9hyjAb%2BFjqSGwIhALvjYY9dR%2B%2BEBgF5%2FmTgffZVp8voeJrKgmOtzfqTWTahKv8DCB0QABoMNjM3NDIzMTgzODA1Igx0QiuxsyuOGjRAuW8q3APHuyDKRef2dnCARuyBErJ8hQEJLnf0C0WsPUexyBkecx7ebr0PZ2BUigst5JL%2FxBacZYGo44ZzptJn2UR1ZRefH7i4VhM9unlmh3BoDx4WD%2BsMVi%2BwsdzfZYcoSIueLUiQAV1ocGQ99%2FLhwEgN92xT2QhPJQtYr%2BYFSrApJclRAsxmHfl1XzFnEWgzl5j3KbWJX4J65Y0iGlpjlgBjgygOnNQSiEoXds5LSoubikNGcNXXDcudzQl3N%2F163wAd2B3HzmnhRIjGQ8E6dbUy3nIx9oT5oPXeX3SYuX4r62RdLB0%2Bw%2BmrOgiup3XnI6uIig2rGsb8wrVvR5cFRnfa9Bdk3Vet7oX1XTPh3cgvmBwmeL1SWcvI%2BCSMCRIMaxX6lCZd7LJ8hefkZvWpTYDg8VQvNUPQqtUpEmrEdBGAyHfCHazw2A4WaAgqgJLmmTYLFHAJzOzH7myaOOjxboROdUoAhP%2F%2B13%2B4nEEPfSZttYyLZlb%2FuWmQ0LSJB2LmmkPZ5021e2hha7dfjgFb99FcAhtjlrcaTST%2Bu1jEvHVrIa69VCVjcKSoPKtMohnPRuknelZXfcnx4tbrY0od1vL7rNauzDwko8ay6%2FvnNGnbksfYDBp6%2FFOl%2B2L%2FHPQVETDjzdDPBjqkAcaPSVU2Bq0aOrVquMr%2B2G3EaGpDYbwzP137GWluAuoC%2Fw4xD3BsAuCaajVYAbhYF2QY8n5ZKZ0NspMNrgHGtXzi3FZUFeWNsCdk%2BjkQ1AmCxzQrjrEZ1QExnJ%2BaRcbUSGkVK0lXs8yetywox4%2FXfMQsIDG3trw0zkK7OrFS5RdIs17xBbT0UWYkFJV4sK7L0hJXiqbmE%2BCLeiIO5%2B4spZnmGV92&X-Amz-Signature=97217dc115a559b8c36bd474546fe5f2cd404c59be7e7f756ffc8bfe13870a4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

