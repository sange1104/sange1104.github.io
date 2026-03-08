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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=358c1e3c523e278d071010b183de3d970886078ed2cbf1697cbbae889655b504&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=ed59c02709073188a66d780cf5a22407fccf084018f99a29faeafa9a55cca576&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=80ed95f8e8a443073b5bd0e971f0f7a9b2e988de458b62f6c4657e619c3f901a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=822f2a0c58d5c072485bf28d3b54bc6e1e3aca3c4705909cec496206d4fc7561&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2LUB5OG%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCICyZeNIjVs42rVrPV34%2BPgJYdr5%2FQl%2BqvwVEZlosBXg%2FAiEAxGwxSCv%2BEIsoec7%2BWEf1I9gpgeh4C8MEvTo9ebpaes4q%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDNJ0m2ZGhDOFLiHF8ircA%2BQPVtNY%2FTi3McuDHp%2Fr2CiXxVkKu0jMgiGEgW0R2pqXjqqgIDfL7sW%2BHN2xwn6CtKHqawJnIOVATLx0gOk5A61RBtGVB5S81FZ3NAX8UFW78SNF5DEsUymrhbcnx1X%2BSaf0KGUTUBJqK804q2PSlRRmuYncLoxHcUxVN9y8K9RsxcVJ9vRNm3UNRCVfYKpwEzMKQ2FBzygKRq1Js3VBXeej9Sa7dxkXtwz%2Bk6CKe4SCWleLj26zUeOLmWmQXMBHl2A30x9%2BKsK76P9qRI9xqn1whrhKIQnI2%2BcUs7yv0g%2B85SzuGGj0HDeamwu2%2BPQnqj0ssaZ0hn4hllZbDpOOY88T6ld5y3ehatmVbwxICML3hzwu%2Bo5x2y6gm0KTHSqrJgewKL5FXtjg27Qoz49aItp8nRuXkVpUbNdP03m%2BOzcnckSMdbwC7yzohLTlDhQJ%2BLQSfBXMEIU3jvrulOQCKoIkxyfloBCrWwluvC8h%2Fbrs6Ffp%2B036BdxSfO3k7kjGnaZ1pwzrg3buHd6HAxDUUyMxH0QunenhjtuSI0Fmt15hr6bVYZb5EHqjL7SmU1muM%2F4mSe3S1M15tf6OXebSyGrpkiYQeskfp1G8Z49PGLkZBAeECjndGMRot%2FbEMOfCs80GOqUB0rhfWcWU%2Fk47%2F9zvbfgCLs03U0xxu8Hmt3JIPBiQekSx2D80wcXUdhrtiS8lhrgdjnUlf%2BtwTI9xB086xVy4nQszJ2Pq1KBlpJtDB6Bz6AQKTml53UdYBW3XOP839IcRDFO3iRHjxi6xix14HyKLMlrcicBHQDBAv183KpBCssc1JqSQzN8cz%2Bw1npwco6w1iU4FTKV6RQ%2FTTBZNFWBpQFvgPwvf&X-Amz-Signature=bb30b5f4416956ec2b7dcb3ab00c993887749550096cc2e61ac47ead9451b168&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YUJU6KFZ%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031309Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIDnoqpJL2BXRdEhN5wmWOgJfpZwsX7X2uwkc0RNUm4jGAiA4209j0wchy%2BE9gdy2zHyE0NbWO0RvZ%2BvfyQpqjugIUyr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIM3xhqIeZkx9J%2FpId4KtwDVT0ItbGmWPEfhVxXL%2B0T86vK57UQzSyesODeHIiC4oYsqp04nU8d0jD6p1CnAzdcGjlU16ap5%2BuPeIH2OB2ItWNa3Af22ImzOSbw9NRX8XhZaASMZrfOZfbb49c1glzvErY0Kfw8lW0eFs%2F%2BEqRPqGyfM%2BbBCDc%2BZzlXaMqKPQ1%2Foz2sBI%2BXgYh%2FarkLRzZlZ4PTdfRpQemDDjBTac1O%2F5R1yMnyRA61JoMsLd0f%2B5bjQoy3vTW6WY6bLf38yusxRG0HtmA9uXsEFgjpXhurqH73JALQDfXY8q8BOi%2FVec4ddAwVnJ3vxoVdLMU1pu8tyjqdQ2F%2BtTUaDr5uNtbwQgTqrpmnZIpz9RxHzepWYP5jHKaxBDmRgZLe%2BUs4vRZgHn11%2F5WgHKeLV8SXw8lyy4y%2BJpuc23rjJb8Qb1Ug2DSW6L4QetknbhFYpnLKEGyJ6bp371JfP7p3ynA79zFr%2FehMAv2iutOsZeFgaKZntH65T4pUt8Rs0flktchYTxPDu5mZPW0TdkPYds3y%2F9cLBP1fVldR5C5TPKLK3LR9VW79grs%2Bv8UnGtPV26uyYtIDZRbAbSrvA5ZcESvI6T%2B7lzF3eUeOQt22t4nBwn5C17GKDoLD7LbVmLKSi3EwqcKzzQY6pgFuf3LKM3xN5gE0u6iXaeikOBCOs3xU0RtbB8E8LoHeuWxL7gMYXTa1iBECvDRlJgWrTP4KSTnVTj7EI5fuv1cHpEfba0fHnSZ4XcHHosjDaoKhS%2Bc0Ys9F%2F4dp0Zj54fFoLYpWdchSK7o0uW5S2dWH4FgWU18oodC5N1L6gMVQLMeUfIP7oRI4IJyVweaZf0g0OdStLEunznc5kIeYUmUOidjdHpRc&X-Amz-Signature=a7510f8644a2729ae2b228e91c776890a4d811788bd23aa8c04ed0b560731d80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665E3NU5H2%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031316Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQC2nsA0ZY7ACY7yrg69tcUdtSB08YlAINboXn2q0gbBhwIhAKR7NL2Se7FaH6Ikn%2FeoK%2BTbciKtpBcenzRG3cwSNRhzKv8DCAwQABoMNjM3NDIzMTgzODA1IgyxL7FexeNXXVc%2F8ZQq3ANAHm0D9HoB5ttaIT0j9NcoEDjh3FTe%2FzFep2kO1Y4Gc5PRKN1gAktwy2frBqI7iiU84M7QV4Q4Q4t8ugAHXMgV8%2FwnG1R4ClrYyfLVs7rFqwpTAGisUPl9ti5Wsg2GujeFbTnjtFmAb5D41R7%2F2YUNU%2BvigUB34gpsOoTwMqs79NGwK%2BfiAAs3gVTr5CHihxj69ZVmKL9PCpuLTWWlCkmsJWkFj3rEMKbRZ5i1VfykEirgc61KYqNj1doP2nIWr51UUJMLt%2FoSI8N%2B6YyEuAj%2BAhfZIi0Bf7LQXkWGylc4lUXeVIRkI00jHj5G354ifXWhRSS5r7Vxv25rmq5MNkFCW%2FkPJsHL0KJmERoF86bN8dDfPav76c8uFRmNhomxHnQWQgTeiO00opPSmFdsdaUrHi2c45A8T%2Fzoxi9%2FFbpeRV21VbPqU9TmiQcsOCgJNacqqarpC%2BTKwL2LKaYc0AmO2Guyf%2BYg5%2FUG2AQp8BhfusTx8FKvkvKhkhMeeHL7q1RCNxrQtYEFythvCImmAaiDE6FR48DTkMZ%2FGLky7BgE7dH3rOcyBMiF46rLihZPE9kiFfRkIk3Jk5q3LwufBOGEctIiyjH9h9XNKbyxsTv%2FSbjatmInemjLDzurhjCEw7PNBjqkAakUkVZvJEtTfX2RjVUaBmOj04jit9cEuLSiH5uKOrp6p8zPb5pN5SvLbROTs0egjfLWBI2Mr7A6zlPnrl6NjAJg7cHSbT1pJyGTbOm0lGD7mBeIYBvC3FZ1p0G4Z%2BXFZp%2BOu%2FH4oarI5Wb6zDTpOhNVXPjUbVV%2F03al6JWIjK4Kd38wmQyXa%2BfUUEy8siJD9pSIaC8OfXAFYc0vekU3CA%2FdYhwt&X-Amz-Signature=8489ab584abbddf901b16911e17e0d6a84cebf35099c06898ea5b3e4c2b73006&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664CD2ZNZW%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCICZjGSzjEcOfDTrMqtF5lcPVaqP4gFq5tKp%2BuPLEZ6mQAiAKXp10QdFkFVPQAUlhOK4inIs%2FEbMN8XwfHGcpauZ%2F%2BCr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMHX6kMXbHmnmDoO7uKtwD8QpIuqrdUYHA31yat%2B4pDkwMK7rsnxTa2PonVWtZftLtg4eKhGuvlw3BKjgaknqnCr2e5DhvzsCyRZdy4YdcHrmIy%2BWTaHp7IbAH3RKKJ2RtT%2BeNqxksDkaaYTGahESpotp2KVJL2OVfjJhKrhJ9RPlU8QWYt2rGA0afexGOAPkLreiMChrnMxhH%2FBEU58%2FN8P6zHjGYtOD0Dhk2lHXzwICD00NJnrJuNeH%2BKtZfoRKoAFU2pnKBev2ij27Fhg%2FSz5YTLNbx4zbmqLvhwvgu5CgYqJFQy4RhOyH2I6W7W1JCCrN6fOsbdfJAIodAhrD4Cy1tJxlfwkeGDK4uZ%2FerHwU3M6EuHqviSH%2BwpFupXTM35l2veCkVCeBQeq18iDIKoVMIyYOtQKxOA3ZMJI8oLu9sGzOVXiY7YT52K8eGqwvjw2ZNNCoSgHLHLcDQ8QeFVvVgMhRZeejzUjbuyCwVIfX4kgPGxRpf%2FGyXTqgmLbJdArhVbRducV9KToStZPGC1CD0lFHzTIrHYeR50caao0N8Y7t5m09uSix5JOLuc0bcZuyujJvIlLtVARfkNxi6jVVbmhH0IfpHBK07%2BEdaGHM16eaE9Z95uI3%2Fn2Qru4ZsaLA8VGpBI%2Bvv3QEwhsOzzQY6pgGpIcIInRjRV2F5mcq0dE0XHT6y8jIht2eOhIWOO8zLCE0NSCCtJ83UoJEBG9avL%2BPXyRtZvr2GMFqQgkA%2BfzWSh94CN9HIEIRnopBoFXh2F6hfyoT1A0OWyfSf93jUDtAxswfQ5caK0aXqusnPyyMo%2BRHP4MEbmmzWB2UJcK9j7lwDlW%2BQQNCP9Y34dR%2Bg4MigjSp6fgcQZkim9iPYlFN%2Bqk8z2J6z&X-Amz-Signature=c62fc9e4ebb8f7bbef7a0c5ccea286fc94730236af822c10ceac9ba083432f21&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=0114f25a4738b8bc28ab189906d83bf780da451be3a03317f95bab9b8e96bb0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=c71be96bd07e817f50f3ec5278e34c4854ba37d7cd51ca5cfd2eef3ca51b4c45&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QRJ7J6LW%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDxEJYLAh8NTyBx6m145rhewnCvsBIsDBQSmDzTz9b61gIgX2gjd2eStWjoENYXTPdFg5c9zCEM2mQGANjPwOuvvCkq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDB2zc17Eq9MON9JRDircAwn500ZQnUTCrwEq6PqixN4aQf%2FmTy2U0J8k0eolDtFS6YlUHOXbGKuHqUHKvGiF%2FuUmSdHMzOvCH4V6PmlzWSZbhZySO0IacnkY21eGvyVSA5WCSrShDkC7%2F0AkSe6N7p2kF5ha4Pymbxavy1uC8QtrpoxFyANXQ3Jc%2B%2FvrvvtSxAVIYTw1dnsNkOtyKL%2FkeY1CwJospUT0oHBwnDowhzFETlbk8WJMEVHWGlTokNYO09HU38BaVuYjnRiMobmex07kUPNPE19RZb%2FyqJiyPcG4ayiUS5Wid0Qey4rRjckg80%2FMOxdrgGkRPvhWlCmhzatACX7Bc7c6VrvrUZYSXlF7ZDlXB5yE93Qs%2BEyxw6y5H2VVcIbap%2BOf5v0qkCS%2BDDwFAvMVwRYXSddlrhgdoda3T1wCGxVdo3jFzFcfrwxZ%2BESqMASdeuurvpWXj9Ql977Stbn6XIXyhFfP2OtAk1DLlt7P%2FLj1wt4ZrEBZ8fmoyxsMAEjjirPdrSwvzzQfp%2F%2BnfsWZz1b%2Fel69l7E%2FW3h%2BM9iOz2%2FuIVXKTeJRRM7FbmerEiK2ORL9QA%2BYnZtGk1nodJmHDKFjrgAMPoeTXb%2F5WGDO3Ye8%2FQjMMAQ%2B1DNwPr1UyRvZ8JeL%2F2f0MILCs80GOqUBfcf0amJ1URHW%2FNduoCD%2Bu%2B4mpAeZ2R%2B91bceHyiU%2FqGb14IwFErWVYpJGpfuZBlAgDB3jC3J815SV1a27XiGzpzgMptz4fqkmFA%2BP8ukXKBOUeIq2W6dH%2FjoMBjwGxohC9tdnnnvrxTxQ8KruGEJThwOOVxaArOHGVgFLRM1BhjTCskEoHTnMONB442cGF0gauRXBI6ZIROkBSD7DddDBSokL4zE&X-Amz-Signature=ef436cd033925869e5df92ccf8c473c9de5de53d66b840cbb3221a7a1a641473&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=b7c230f6ce4154de621f48a472a230b499b9b161b77037d504358f79d65df50d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466526O5OJJ%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIFnnDEyylJLc5JeeQV4Qw3CQ04SENJJqePtuHoA5XkBtAiAAvzOVNsNqgiQhj4FiWaQ4vKX3c4Ga9%2FYsotdlZYKNYyr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMkSRIbHKpH9k8WAdFKtwD%2FyIUg8imKyOnFSKVMDItS8pnq1uGW5QQ85MowzigJqmXBRdnIz72yWKAw5LsyP6iJ3erCMGBvorTo7MpfRWr%2BSnuXzftfbkxzQ%2B7g9v57f4xE25cn8cC7IaG1RejrHIiUVWjug3oW6AIrmVPDU%2B7%2FFuhIPB5Z7nrsp7mwn63lXArUw8mY8CIYMo9n8qnuYwpNvM5W%2F8ZMY8gQvC6fXVj9zy%2BB3x3eZ%2BNwglW5PJJ8n0aNyPb14XN7WWTNQK9p46XJZ9oscjceY1vGtq7uuKryI0IrouUmbXB3gt7kKSbmPaeIijTJ%2Fu8sfRm%2BbQ5i%2BoDgzlXirGbfdy7uv5CqbNnDXtk2L2Oxb%2FBAm8Q3SHP12Nsm7HCTMh5RNkLXT1SI42iOQneufDbKl11WEJEQKPBYg%2B7srqc2zRTfd0INXiPgJ33y65NYLb0p7ppDpyHi376DO5zYQySeIGEdFwMLbJqf91wOdIiCvD0WrCcswXkhjKoo%2BVmuOcS%2FtqJ1Gv4A2wBRLNKiJqXVrvkPI8yU3G%2B74mvAFL%2B%2BucxRxK7AhDuHt0umFpQ4J%2BC9%2BfacS%2FibFJ6MqjN9nYXjZ3B1MKUVzq%2Fg3AHSw2%2FbVj2dvmwpZbzMiW3qD4c5QkEKxlii4EwhMOzzQY6pgFDSvqjiOwaZ%2Bu0sBqBZVVmhyUSTTLpvrxTGrA2p7ONMSduERksoc79wto4VKq96tjXp1K7tlw8sA12h%2FjlneMQtBVVQNITi%2BevjkR%2B4fj1FKOK6cHV98llxdCxwUt5I9kYglyV848nDCZpbI4jCikCb44Q0ZuDrpc9uW4Gk3Lg6rHxWXMQ89p5aivA%2F4ZYoouEPpJVzMQ1TkV8gSbw28zQ%2FahJwbAe&X-Amz-Signature=ede959a5c63543bf7a0ce72f1f7431f91e23d1987ba06a3e3bcad80e0541a884&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IZFCKWK%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCQtLUcANJWD3R72Ch%2FoIlI0zB9mAmA0wKFdlg29jmqpwIgNK%2Bhjr2Odrpy7ePYxLjsRDf7sYlvP9BEZWNMCDRRYHkq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDEBmKNa%2BBplWEhAl%2FCrcA4l4XA1tkGA%2BQVIcFTiBBfgI8hx6kI78revJOsHyQK54zDAnihH6wMg3uVkbktQh9IUerI5HnBkM7%2BraDE%2Bi0zEtrfyFhbCScRz%2F6L28yKD%2BhWVFK7EKKN3k7EEfu5YWkw5y2e71sYRdlmB1sjBgMSdGCsxNBdEMbC7AVmfc7SqobmqrlT%2Fz0qAIiI0QjH%2BekcOpQ2owWSRC6z84hqxkrHsTL301rvyw6DqhOwsjV3ICq%2BC9HkO3biwXon6X%2Bubi17WcvJJd9lpIKWI5KTHmyIOx4deDFjRdXrXhlJefJLIrqFEeeOmjKDpvLmfafjt1yh8pGUXd%2B5FJtFc8bCE%2Br74%2FzACGtM2ll267Y57gVT%2FH6%2Bb6Fs%2F8QiE1UrbJ1WxU0cgZUtzIMHIIc%2FUheDRVWNB5S6opK%2BPli3zb03MWiRqVGmiJPp74MnBqwx9qS48DjCk8zte535j7q7gVCkVNHBUSVqBbbiYgbII1NMfaxRxk01aKrmWFkr5NtAcgDvORofOZYrAEwZ16m6RMwMlrLDljQwWpTnBZpVqNosJvZ2LEvGj7fIO0KFTt5emsdj6rGVdsJBRLQBOvkLrLjcPvSPQN68z79zKvUIVrzFzQWFMlsmg0oveBoycKenvLMM3Cs80GOqUBrpiPTgNbX4bzfdwOpwt%2F6QCYRtPonnW%2B3%2BdmPv7kb98%2F4IJE4asZYdA%2BsRtJiXJ9gCtQc8tIJOI4Xlw%2BcVkOAZVuHPQ%2BS7FD16b%2F0YgCExPIJK86zDmgowUbmUxDZpk48hsqYE4Zm3uyWXFL%2F7yXakxTUHS4dGUpOZqaN9LwePU4FolVkVKe91Q6YK2YUQLh49a6t7MSDZu9mfRp3WWaPdZ02lQH&X-Amz-Signature=90a6a2a5adc692d20784e276d398024c30cc79b19107805c44cb51860b86911e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZTNPXAP%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCID78bN8l63rxUNVYD6sWGevmG8g4ECfnaScbZxmS8EQCAiEA5DVuYDIfU7lq50r8HbvkuS1GqRM9MxCzjEfU5P36kkoq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDLc7EKX%2F8X6tDa5NcyrcA7CfrfivaqEjf8ooE%2FbeK10qvMscPOXyYIT66YNUzQYli7bi7vyGiLIOP3KN4qQw%2FUH7APnfsJIGgfKWp7m%2FezU%2BGbu2lH8zv7kZ2%2FrDRj8%2BNOMEVxNsjmobxPXNBt2LrNotADkrGAnILlz7ltpAEwVbnvAHvSdtHA1cs%2FjZ0J2R26CzwXnK5Opof%2BhgC9ZOlEOeYV3xImv0P60ucf4Q%2BVcJLbTH5sqZuvSPyzCFV2xvypYQnsWTDZW8LkrwK7tbwN1c2CDUxj2KpLbhrVuRppXKRY03KridAWUg1uy8qEo7%2Bb9UWTV4%2FjhfJdjpISt2SmRPd4edeVZlD8agkhIC1enWEDMJ5Wbv2KPHVjHIokNGo6J%2FU0axeb%2BTgV7XMjkXQdc3oSM01jnefhgjDocbTCU%2FcuDJLaoE7CYrKsynBdXPVn4HZA0GlF8r8LZS%2BoxoQWVrWu46oYVhmPDykphIHwyqnATwfuJ4cg1o%2BBEguLA83p%2FfC7efFcEuqapnzFiUxW5dOlDi0gGoUjOrGrkiSh7o1mr%2Btw74at3cb%2F14m3yN%2FF03yep0o1EkYAxhxtAYpWt1ANg5sjYGJZYZvgptwR%2Bxq0q18CqKmbIFoMpBJu%2BAFr2fqYuOJjHf%2BvQYMN3Cs80GOqUBWcWfe7w8ewOV%2FQdM%2BrUkVDYKxfuq2N5xNsID37tUGpXmhZT0LU9LWce1ibWxaQWVGzYJTLBtJ36bpvOyFbz4zQeNBGfCM9R%2BwqB%2BSd16lqswx3nZmJs4KN7ZuVNdmdLLoaHVpV4WvL2ioQMHtqBGMKeWCERGR9w%2F1P%2F%2Bvr5etdE5gcVvbnltemXhSQs2gICGwWqKMQRcFZt95hv0RMy9xV%2Buuzzp&X-Amz-Signature=ab493056566388b00d14264a32f2aebb9e072a97dcd948a1acc929c70f73b032&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMUB6SCC%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGUC0qq1B3%2F%2FHbe4Y3ahmjiYv8pecGUjzNr0RovBqDT4AiAMgSrQfX5kxGJQhzmcGV7y8%2B8SBEPN3cn0U2qWpQATvyr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMx8mc%2F8tNE1JQ7O7aKtwDXHsS%2F99VVkgyGOArYUJqw8%2FDw8DCsCKFkQ8Hn5Dw5hl3UMw6rNIjB1IU0pUIzl%2FFd3rCJSA5QtEaQr%2Bugkh9XNSBYAWqbsWbzdqJkpgt0wRE0tS%2BJi9xU8syAb0sbigEe5M7CnP4IGMPEWHaQfIxsoy54t5WFP5Q4Dv6osxAoEx9mfaXK9XKMImNMNFrSW7dTB3Mj0ytK6reOk8XcAzzENafgdgtDo63%2Bdi6NRlwSkDe97h3Pa%2BH%2Bp3t4oIRyaH665fYShv6Quw4xIW5kbs8Rp2%2B8UMLIFZO2hQE2y5XPmEEUNjrS0oN5c5FYN3UnhLlydXSWx4kgX%2FAZ%2B%2Bp%2BcHBDD2PXU6YhCQp1Zup5fjtr9wAQMaEAy6E2sHEwiSHpPjsnru7%2F8aScTiIsZlLTyG6iXxZxk5IXqSaTCP0rWGILSEkL6u7ZY%2BRk1cU7Smjxh%2FYnldWpGg%2F1bQWZ9QIoEYnUZIloqf3Z9yq8%2Bffc5VdgHu8m6dT%2BZ%2BneeUQvjwYviGw2Qy6P53kZn8FbN0Nqeal9Sc7Aj9iDWxA69oK95LM3jn2lfzxHHw%2FtNVXhO98xxfUfPIkeomUGc2HAuaqnc0rEQ6N4Kt5HskWMhwgM8FYh6jPUVhZzmfGRitO0Jwwl8KzzQY6pgEsqpf1ishJXqk7qtAMq8uk28sIUgTqws8pXqXeyMiwhFl5e0livPW9mBCjeoEQeCPi4s2%2BI84poC3JQi2pSJ82F2EDRzSW6SsPFdzxTsl2ULrFipMuni59xV3QkkNQudnSlfJ9slfAkOPOjL1V4SrZEs5e%2Bk6eJVjm05mQx%2BTE3Wo7w4lyISqwjdyIpoQZl5fgFPEE5EGxM0XZyevjB1WkeukBhgiP&X-Amz-Signature=38afa174826b985c273fb45cababb7f605e1fc6627b2722b5798445108e3cae7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=1f5168c4c78320c126e09a828e19b93b09cb2bf87e14d76dd8b0b602a7282baf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675MG77QV%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIGT2doOL2Wi05%2FTWc6IxQaJTBV7iu8FiEc76e7fU1HY0AiBSTvFlZXwf50%2FxWuXSc52cnyuyaHgkX5qgac66b69faSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMIBNGOrfPydfNgtEHKtwDtLl15sX1uXi0Sn%2BzDPdVistApfILYXhdLfIQ0bAylhacFC5rSefO6f0dyO%2FYy2Qf94MeSqqv36z2VCDwstcnSuWqznVmMj9J6qUYluQStqTYKK%2BJ%2BG%2BqTuHPktK8%2BV7KF75ll1%2Bn75ogSkB55z2K1uvIyn%2F8I15eyPeg%2BSdCgFRVY7x20lv7vpaRPPWY4JgxxLGAUpxr%2BwziJCy4jKvKEkFL3e25G7vfz5DDnTgEJIfTwKqBbYo%2F0ddsYhhG9GkIHH%2Bp0AirhZL36qL2g8U20Vc7wPhfnekvEwAKtXx5EVXfrj97AWyJZelHo8uCH%2FI1muKcpUSy0BgnTegszMH5YL7Yjq%2BU6pn%2FxnUWXBqC6OYj5ceH6FTYisrbu6DmfvVlxxFXhCT37ND%2B%2BapIDEZUeEGmJxByHtLU03mvOrD3n0Vga3cHRWhBXlwSK2%2FeojC0Em0nNB7nLyl8GWIVr3XdweS6wvYTkW5QoHDMTZK0kfuaH3TP50OTxIBdQ1CnjfPaOIe32P5yRnniBFvS27WWwS8Flw0V3w0o4NakEfo5euUC4fHL5sLLVjVNtsixD1f3O4TLHFdWR4DwJScnrOfxUhJVSIZm7ngRxcpq695u5tdM9ermTE1hX%2FLEzs8w%2FMKzzQY6pgFfUydrj2vPi36u%2Banux8JgWGZY%2BiOj1LNIWXgvMUtMkZkUWUTv4uY5GjEGM2gI7BDfN0yB5Mb5gWYzVd7QAYldmhz5M6nC2q6ocWVkFEHtQitSgB1am0cqUWl4CWq16gJBmAxBTVuhdxN4MZ%2FCeqy%2FD%2BLOa3vesxxpg6v%2BgzS8NZWKnidHvq8WHvjBuqRvL7ErC9dfNjd%2BDVCAo0lEb1kwYQisSAvO&X-Amz-Signature=050dbc8fcf2c0e9aff9ed78531322bfe968a8c2f2cf269c98c47521d40886a81&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

