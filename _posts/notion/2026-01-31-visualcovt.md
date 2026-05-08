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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035508Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=373265603b6416c8a7221d89850be8390749a6a2250c06d990102cf9bcf24d1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035508Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=23393e45bab410d65f5426be27ac89a6d178473ac010decba1d0063b9088f3f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035508Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=2a4d62f802cff43615a3a982cb752bc279a2afe6e7bd42eb003eeab574c937db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=3a75fc37784f2ff52b850c6bfc2c09e9d5a6c9de5b2617b88c1cabfdfa05a04c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RN6VH5SY%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA6S24XnlXxysk4QPJtg2SYNhsjBosTn%2BrKv1EN1KhYPAiAa2vMqGGMC31ua01wxOYdqWDaKAnAVZt97Xng13a%2BtiSqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMG1UYolpD5TytCtDHKtwDSqI618RWvXmXXPTTiDU8Ha3apJ0FI1YUDsBrIa%2BfgF6yl4a2mb7yhadHLF%2FpFUn9fBiWZjdbqAPKVqsSf1U6wlgpoRHkAmp1Z8UxOFBz826waeUIJ5AKJqUV5TJTTHeikp5V9AyL%2Bju3V0DJQSS0IfYM30hgOOKPyjdf5O9Hisq9M54ztvOPnyB%2BGnfv5BpewuB6WwrmKAfUyb9%2BZkg5e%2Bv8FUxpPabWXAY1S5gxHWUrIspJoFHZLSVc6KcwQ9IwThdgbHwz5fNFSGQBXypGxQ7KFp5IKlsnHxml%2FWk6YCoL5gLEX%2BbmXLXIkWgoBanqubjOAeofd2vsuyysoYeMsVe7XICF3%2Bm39VsGe8uTv5Hg4NQVD5W96juNHQDiVPGolOAhjw6j05zB1QqBzgsHtmRPk%2Ft80EBFiskZSVryzSJWffL0T9FaBBjobgCA63SO%2BrGxP0PGqU8mVVsf%2F8WuJzatVZSeHafxtSARgf0SEZcV4SrHBF5VL%2FXSPGx4vzv11eGTh4P9ZXVOgCyAYJAaeot4S6NTCBxF0VHPxZF5f4aticMwQyCsMhEdvZxJJvDWXi0VN8MVEoFvsGm9VOKp0T4tcmoxQ%2BK69RRh2SkD%2B0gVTcaUPRzPa%2Bx9zbwwhZr1zwY6pgFuLD9BspI%2BZdEhvNhAZh%2BAx4uV%2BufCL19kf18%2B6t4qtsIFb70VIwLuC5f7V3m9C8QlypuL2bip%2F21XCpyLquFIpu8G11pbP6LChcNNlyG107pddqGoyX%2BgOgVIsLbQs0ED2G3gyERObHiR5IiMZrci0POPrvv4zBlCxgyp6CjmGlltF9ln33nFvXG6zP63JVnnfZnBtlCk5KE9cg2tA6JURYUYKkFY&X-Amz-Signature=b0b07ffb47a4bfe28d87a0a2258a3a9db470837263297ab6bbc9ef4cff20fc44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VSCGPZT%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035528Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIApIxW59W4DEl3X90LcXDObfcA58m5UJp4sBWQ2%2FQ%2FV3AiEAnDrhwy0%2FE1eKwEDYsKOdafKrBDCMlULlHLUbcdojk%2FcqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCwWD8RTu%2FPCGbk1oCrcA14js2hoc3RUYDu%2B1qfoxNKGkYODni03o10ItX0YZC98fcZ4vQZI0sQSebhd4SVyV6piDK3Y0mqFYogGAs3uMT6CBmYzcjsJPanACd5EfvrKRWiYhnvBBJMyi7IH6r9W%2ByNVfcDApEEfmP%2BHgDI%2BSWCyM0nnSNBDDocRfgcEBM7yDueJhhsb3090yG5qLt81J5cezeKFPylLt6W3uSJ%2FDhr9T4ihUDXAKKQ5VnqAYmLDaOxrEoljumMlMbsmVjMQS7AUBSZtORHxil7KBFgo97XN5AZsaGipiiXgN%2Brrvmim7BAcEigAT5925QZFbFfXqfLD9PArTrpiSbdjXV80dSFmG2MI%2BsO4GZEgUwFmeGIk42Rv9iJT%2B3B2wzfYVhtJlPGHoMRD11LATVytDuRPaxLTvbfP7PlI6h3BTEIZMSl%2FJtAY8oeSWJlutLnyRQ0dMITLtKcEDAhSXm0D%2Bwn0zuAUuF5%2Fd1XpYvwlYRTLPWD2Ke%2F7vm0%2BEP0%2Fn1LdcRRTCUUviZEO58%2FMPhvmRi8NmVQHWqkwz2PKmzc60cJ31Q%2BkrEtf1nRXTj9%2B20CCu4BDwVEcpEMfsYS70HUmkzdrNCVcIicIZPZYm3uj1s9RoenkiyOdygXCaUYWscJkMNib9c8GOqUBv5OR04jzQbdRYXACTveOJb0B3CzfTOdnCI1r6nDVo5Z97xbi%2BSNaJ1tyOS6f8RF3rIk2Gahqfr5uE2lxE8y3BRH4rGNKJZ5oG7gDAtVHNu1VLRs9k5UQOi%2F4bOurtYjziFu7RHBQBefOG54Cvc7uz%2FwwPJ9og73ubReAC86%2FOX8gH3DRPX%2FoNLSV9xzRNl7aJK4682sAVLzzJ3AO5405aUT9IBvN&X-Amz-Signature=a8f9e8a6d931fe80996d5ca92c055bad1108f10f77a45843d1f13ecfc0dd20f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QOCDJ2BZ%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035529Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDmEFansPtSIMo%2BA2PloL5uKsTpecSvvwJI%2BJAth1c%2BwIgTi9HhcQD2RGQVt5YiF%2B41tlNZCTETDn1LJ1%2Fy3u8MSsqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNlyRwLJcTLSDEjR7yrcAwqosqGBhKk%2BS7EQQo1tHXEIbwx60D9nb6XOlKCLQfGCjSG%2BdNenZhwmMDSdr4YnIIJCWW5rbJDhEPS1BgPK2NYsjiZhqFBAEAJEsWOgFcZLYz88MBcqgNNnnOI3%2FhYKQAYcwNSeEb8mzgVGzCRtODiHs2lxuUfF0mIwrfzdrctIyw%2F%2FY3xN6kVQufC%2BekFhAU%2FhbmPgQfNJNqMx1W3c2tCAPumi1CWzUhkTTFOAalfeBklfYNp%2BZSX%2BgFlHlgYG%2F95jwt64sP3SBWMEzI5KVHY3EOUv%2BGkvMj9lRNu40lEzHMGSl%2Bo3ep%2BO2TEhF7vz93GkgeW6HQiV90y%2BYTz%2FKr3nMl9EaR%2FfzAOrTWcWWlhROpLJDZ5cf%2BKtstLTr7k4peZvwYLe5WiFTVZtIGSm1ClajY0N%2BFBHBSplwF2lkf5Gw7hmL%2F%2Fa9mR09GwnaY%2BzPc5gvqfIxbgnCs1PHq1MPwZJWEAYn9ZhkRWr%2FMPZbpWiHFKToIvKz3XUqtQLRWp8tlp3dPv9NiSPdllbPOxGbrOx6NFxJyi8JGZGKi0jtwPn2yOgS9Cs3%2BRfVJII2N23ma4dnh6%2BDpb7kAhZYHCXxPa6jUJ3ZIkOdOhyuP8dnnt7swSkeY7Z1e%2FZUxTUMICc9c8GOqUBw0y6voOt6YAQutxcvuU6HrEogUQnJAHEUF6f6d00x%2F5dMNrOvpxq2wQX3R5KlpuhQSIPaX0Y2TijI%2FTmgdn40m1aL%2FDVVf528dfqmA8hJL1CS0qGPjVtWp8qe9a2RKy1O4Pb%2FIR4ky%2Bk1TyqU7D1qyZAywdE276hLsqfEblQfKwxCXhpnpOWiELEHdGY%2FAKXGFhj2%2BzryebM9Esa19R5jJ1TbXkd&X-Amz-Signature=1ba08a8836e4720ce9c343d89982c3313f68d4c124bcf94db0d9983357dc698c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSIS7ZSF%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035529Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDetyohtbow%2BtBLRd7hSnHaqebpEVdvV8fIG9%2FxeZkDRAiEAtBa%2FQeKhBoE8Uc8ffGP7sYCkYq3lTbjoPKdxOe9to4cqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCT3B4hbDPSfLAFIXircA3Q49YQyLTsE57YEI71DiztWEHG6mfqkZsbpy6Hrts%2F82fMxUpNPvv9vPlxNSh7o9HyfKcfuRFYFP8WIcEutS4WGraBaabpbszLsYQL4YhMjEG7BkkOOHBYlrI3LzpNdJzfc95lc8NGtfKC35E59ne%2Fy3AXiCT5hnFq0%2FjwfYRFSHFR9LhIndixQTfTU0Y%2FYhWfv2Y3HadYX09xpQyL7bys1ZEBBcUn7c8Sfm8HhstLFKdVNitHXtwhGpif93DFQ2kPF9EYqqWzfKn3O%2FHdhhdAmWTowjy04F7vywmXnSr%2F6cYeZrVUOUGDzwp8iL0zgLEo7Re9TCnNXjZzPGPtWoMYtviCKOikEysedsG1gwAe6peodJev9rmsVtjK3iDQ73tNfZgns6dYxs3ELOkfaYCcCF5HIYsE4k9yH43C8mqiQwZcMMCJAT5BI%2BNx39W6fhVuSkpsbw5QInOlkh76HekZOMaPu355mIyAGX9VLDvoHgRl%2FuUgZggoC8jT1jcgbeCpulSLaZgwzJPq6tJFQrCmZPIProVB3UK2dOuBg42mDHwAi%2BDYR55SoJaKxsedllV2WjWZT%2ByFmHAF4lLSpiwhVgMrhnTkPo%2FNKaXg7FgP83I3WEaPjn95j736mMOqb9c8GOqUBPok3kaRshQfNbxJJifpX4yMmBzR1U%2BUYvEilO2uK%2FXzlXAWwci6GEMTi3n0YvEMDqBE%2BmbRSI7yqRzsVHVila%2FEdW%2FiCh5%2F8201jzeeeNXZuNVHgYyTSBMW5tDN4Ts%2Frg39Vcj2sUugEjt2MFalXvYYnvNg7uvCcIWzwEYtTD0%2FPARqX%2FdZfx8FNyUklEO3XwCnhgKs%2FiihXyERezzUXCt9EkW9r&X-Amz-Signature=a0e6211867d4aa301aa602e23e148cb6ac96766a366a5ed1446f42f15297af87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=13be3e78e40851ae32dd87683d03c2bc8e69139ea0ecd1c43e5c8bae4e1db107&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=4516d131c6383fa7749646bff43f8a8b6e0a024c8b975dd866867d77289639e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TLUIIJVD%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD5nvjE%2FIi7bnVxOfYlujCHHlpiJnKDPnV%2BZWXYnUO4uQIgNdep16a8YB7oC1BXRBLX6wqNK6fQA1l6Yj0qXvC0pWcqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKczndBPeZSUjiCpFCrcA5PXA2kTf0faUQs8%2Blg%2BcPevv4Pw0Esbq8KaASBXwhR0VXc2PWUG%2FOCBuDZQje5Ht3vC6HolUWTTqUMftknpa2YG5C%2B6HNuJnpCz42HogMGm5SJbJMS%2F1Eb%2B9nJrbFzZJkz3yG2Z3cAUhY6csn5nM322vrOX7%2FQYPjpQwxw%2FuhpDyfY6EgokpGZNC%2BTl7wNRJwSYi3eCzvGkVmByMje%2FTFqVJNhwPLzRPVV%2Fgdat%2Bu0wlbae1pWGGPtcca1Olp8p5dlysGo02XkLdZ4LJXs6tuUYqxbGCWGxNUdlaxXCFvN3FFR%2FGLLt1QhovgbjFjDy5yIwaetIiU%2BRerJ5SDZNngIwLeAidwEXk8XhqGE%2FvL3DDdWkH1Dml9GXOLXRdFRQhQGrj5RVNWmknu88cBWDZ7bwgJ4XUaJZ4DvgsZMR9py5Zle8iKBNC4KK6fBu2MGAW2OAo0YOCMS9kEzHuqj%2BCBd8ig894JeBuZafHQwNGs573Dcqs%2Bi9O9yujB6%2FwaAEIjrWJyNGEikQ547cUcfD9oyWeTbwf8hHActO2QoaVSASs4qLs0W1Cs9uKjQInYj%2BL81v4w0EP7J7zQ8EiCpfQY%2F0RM0L1Y5PLnNx%2BuKyOEQiVACGjufGYK3SaLUiMI%2Bm9c8GOqUBnahAHDai1cMu%2BOH0au9VrKrKOhNrGabS%2BRwLKmkQmU6jVZWricPlXdKG7mL9mwcE1QmcblEAjf4JuAPjC%2FDSOzi5EUQjjpSdS60UfDK8qOMJRfQt%2BAhFfsXtTBnQKIMFw%2BeCnye267EbMaIn5X8HvsmoIIL%2Bv1iR0CYD5VVaVP9HwpZ8AqRgtyyQ5fpiI4dAy2dCiRoNw5tpIFk9PHsH0wSJw1nl&X-Amz-Signature=9cd47fca0fc9e9845aeba1a3f3a2cde1ae3fa95d1e52a7bf9a9f810190ba23ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=db573cea58a9eac9e57fa5bb71d94ea50be7fdd79cd7503da45e0e50a23b3835&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SDRT4FS2%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDhOQqENzmi9NkHJVZGSiWXAXAe%2FkKzkZn42J9CeBiRPwIhAMNTCfUSn7Ag38iT1ED8KAWzhscoSqAzTvyoF8IbAt9VKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwlWsOARUFuQ2yknc0q3AMv9QQBL8puOHtHEZKEWx%2BI%2Fx9CmobbqgIk9PFel77PXyXsd5XjhV5LKspRrTj1BgzD1Oru7a3k2c12osH66O3XOhCqy92GvExRcKPvZp%2FTVBuV6X2JHKwoDCikfame%2FpoZkDpX2wq85%2BlURk0m0JMG3z0mVoIkQeydpADezm1DOQcWlUAYHMMBw1o1hmMxhxLb5QnMPwrmMCRAXsWskm3A2L%2FKOnO%2B2qxHPY4WQ8Ni8SxtsfgSTRq26m2dYIErUXCofsdQUn6caLzZf0qvvLFukFOWKBbuhqdGi7SM4hE18kWPPkuCnPbb9i3riS%2B8I1BNc0sWkxGkCAaRkkCSK81ubT5pxsxgi7j1opal7%2BsUSERG8Oh1OPOvH%2F7H0Z72FOaw7g9IS%2FUb91V6U88%2F29BmXUNFSpkKctIrurwWRPZvboC7VlUlC%2FduRu6DSJMf1yfqG9eT8m0ZXbPgNJ78kd4lD%2FmWBia8E0F26tMcYVevo50idRcDSsv2NRo1IvSgkeZOHPHwXW%2Bu3l8KZMVFtt28kjiOKCSOR4kXzkYSp4%2BFdinFd5x%2FhodU7%2Fe6uZgAJS%2FvKZXrYW3o%2B3BEhgOlr0%2F5gFYTIykIFbS%2Brd9Cb54mCACh%2Fh6h%2BXCgJ4GfQjDDm%2FXPBjqkASQpR%2BKdDzXD3wcS7MdLnE7Mt%2BT%2BD8Ozt7%2FBe4b7putB3PHHrL9EMX0Jc3hI0bMwiw3mo0%2BvKfy0apnM2%2BGx6Y3Slsy2Bd6LQAiVLu3jvosZni4qyHNlI5v1pGPADcXYwsMC4XxRa%2B8Ltpp1CKz4tGbCXWba3LpRPo299L1cftv1SyjIx24sJo3uwzEPKi1yxDGzUAWalpx4APb3KIPxPDulPnpk&X-Amz-Signature=b77feb5c471299d4c0467253488c712e732f55061e8cabe338561dec2778cd24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YFRHQOFJ%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035538Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFDY1ux04euQDWWvZCN3M03VccB%2Fnpu9I1ejctmrJbD%2FAiAI2LsBNc2LJ6igwO85qKXyyBxSc1lbGL4YY3lCBNdodiqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM65OIVXQgg9d1kweiKtwDGRC3Q8ZsbV0vvv4j2xVZgcniuXUya%2B%2FUEaFA20Y5fsn4Mx1NIRvWvkOpsvIJ5jNWX4%2BM45PEAA9Ek3U%2B6hfnm6EVuNRH0C8PJSHZdGr5uN%2B6XvRb%2FHaqOQcXSoMS689gPqQF8TK3kumwx2XiE1X9kZa7bWrL5yB%2BuyGT0MRLB7JpjXSxCSzHGEMwZ57QQyWjypNL4bnDZd5Ry%2Fv91Ia1yNf8SEwi6cby5iAy6YhaU8ep05Vpexg8ng%2FXnpbU0k9TW6bTbm9E5LxbxyLv3ddajqkLxUDw8wiFk2rfCWwTU1Hm5U6eqdIvQHJp%2BxqNMAFGWLhIQozoLZ6PBfzyt7AjwvKqYdztaSRmoDLlRpi4ZTc2HJ0DQAmmolzR8mFcNApN0lmxKuKvQ2nvC0%2FAJuEcKLWKHxAT8Q%2BmTJQgkXIJEZXY86mD8XEjG2SbxSVDVG2AmhZ1pa%2B4ZNsZS8flozSoRl9nSS2bJwwZTqwFX2RNgylV2aKrKF731TLDmSWRrsr4CxzSF4D6lvzJ27zxq0mv8MCZlV5E9Ik2xxESuhlSqcSbrzu2NwH0L8WLSXUhoXmiO9Hei2THhD65txP%2FP%2BuIutwerU5t%2F4S0AE54wTBZzAKrs79xi13ydIO8GyMw2Jr1zwY6pgFc7P6uJsPYf5ebzyf%2B3cKTQUdZz99fe2eUE6QPFBNhYjontQUSCk7ZxK4ZekYDhkgXDI%2BclKx6qABm5uuAVVuCC%2FYwELpolwGxBwGys2ZLkZYLqyzD06qbnGTVob9N%2FgphLcCut6U%2BIUPttGBHzn0Iw1gFeXP19wVqukW0ouZpg1MMyhfnGWz9TIodlJqMsCR3vFetgtMt8n6pr%2FBe24je1U8MCSXw&X-Amz-Signature=53711f0f3d276de3efad0ebfd1b7ee62c900db9e9ab2604de2e8e9ab71cc542f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663DEMJWRZ%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035538Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGT%2F83yYG%2BhlGbvlHbYKI0PTSIuBWnO95PkDpEfTWjhZAiBShqxPopY%2FkirIdNPK1kyp7WFRp67u0CDY0td8qO02ySqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhwBu3BpYna0GlounKtwDTA1Eq2J0IJcqVc%2B0Vexryb%2F1mITME%2FHoxcZsBSjVaOzkq4u%2F30ep%2BDquxUazYJwe%2BmLKdTdfbF7r%2FSDNWp1OZWqMTxe%2BDfoBzxYZ%2F53%2FnDd5MTmU0t4YspDY6BtS3PmmxhCw%2F6qqPvkviFBR2Hh3pObHDn%2FfLbF4mYnI%2Fm1FeP6DrG2c1ekxCQqhZm1TH5JG9fOc9w1%2BxaINEBvE%2FjPEo7JhqsEXVRbqvMdMf%2B%2BJlxfmNhMEjjPIHQ14CJ%2B6ZQF9uSE0FwcYrdLRF0VamsVPsAfgm5eJT2sz9yxxl%2FPzw5sqR9X33h%2BB4EgO2k%2B0kcnk4K7TGiL5dzs10JyKD0RLHDuZjzoKIpup9Dagx%2FWfvOoZtbYPNGcPFDGhte2Cn6nsUhB3iZQhjEeCpOhyeWf9H3rioZS4wMoGZU1LlU0OVMU9WLO4XZIsLaGNHdw0LjL7Or%2F55lS6peRlx%2BVBajRqplLIpT7l8l%2Bty%2FTMm7GwEN9BADK4x9hUb8VFf2v8JzQdR76v5FNU0w4d6BvYrAdF2SCFY4V0A2VG3Bhz3Ti2wP91yqMrdg5Ofkzh29Z3S%2BTlksc4IKhnhI0IAhqn15AW%2BGH4Ot5N6MI5bJiqFtSjjUl8uDiG4ZIh4ot5Mpcw75n1zwY6pgEZcgfBf0XvzoReH66XzoStZulPvQfZZrZvxClwVgzOZtuWafVxYPfhERZV45H%2Fcq%2FHG%2BDRDJUryRt86DG2PdmE9xqIUqrPQRkNXn8n18n3zlzK6IfDhaULhu%2FVFFl0gELRZjuaicf8LOGEB%2BlDOKpVq0C8lLTi%2FvC5qvwOChxr0j9M5iWbsW3nKvxgidiquSDIEBzhTcA7nAT9pdF47tF3QbErTy73&X-Amz-Signature=2097d3edc9e28761752b218f31dd0190671feabb58b50c24ccd879547ac19367&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663CZN7AUW%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035538Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDdB2XZvTnLtggQIAdVS9n7y7fTEBQTg3l9olbL62rS9AiEAmcsvmTRVwdKenpYK8lioF9wYnHh5GybHWCs5oeAfq8IqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDID068TLrFwq%2BV0lRSrcAwitSuh1wAZ7ccTDvQKxzsfFFo%2FW6RUdoMJkbhvDdAjNME0bUMzglMC63YhSG7OyojLDjSqawVm6n4KeMTlKdDDSwaaZOKoENXIVDPm8W3Y1Ud9nqh9mshYLVt6CDDWop1Jm5URPHeUcPwfLIfW%2BPEVCqmfmenoI7AMLeTLdOEFfUdS%2Bb7GpXlq5ltfxUJvPzv2kZZ8TYko2ypJ6%2BN%2BopTP2a0nk7d%2F0WFahUm8BcJgMufinfKNOWIEHMjSl3uAaUTficSDWUeEWMqbacump9fi7ON9d1gIkAgOBwe6WvlEZh5HpTxtsmPl%2F28GiqbloruZuJKgvyg7Kw929PMhJk07eNS7LluBeVEiJxqekzOc4cLMfUf2NMN%2BYOPOU61%2Bm3b3WWme4W0eXMCvbJGPdP%2Bn9w6ry%2Bouiz9LfUZfVdAV%2F%2FyHpuQFALIFLWSqkKhn4NCiEdJGZ5INP2iUhNbPdIz42nDvXix1cZoJ%2F2EVs2gSy5WcvyQnFNM6Mftm7x%2BWGEjbXPDk4BFquPv%2B3LTwXG5R6uFC5A2a%2B8J4kO8UWdr%2Fkhy7lTCV2C0B6k5kxn%2BGIB%2F5lQ6Vr0N6mykcX%2FvNZ3TgyAC6e1OUjaG9hybnNthY4rAx6w9tfKj6BhlBWMNyq9c8GOqUBMSgp7Qa%2BhvXAJ1BAkM9GS77z6YgcT3fM13VDhiS1IjmumCcgSkb19%2FX7jJE08tiGX4tGCKEDzlHLXykofv7q%2B3IKw3SJknOBRpDpNRVg2nTa04WrACZ8b0OGjYMbQ024swDnjowQwnHOOAfzir6ioleDm0ThxkIn%2FENcmLMbX7hj1VNHtYa9zUkSQapVFGIOydylY2v4RGK3c5nAsC59xqKQBLpK&X-Amz-Signature=994a1230710f83117a31b9a2c5dd67fcf9d5557fe6b3e5423f275e6d3acbed1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=d4b5971936ae0ffdfe013001b95ddb69c6fdad6d6774c6460e56a5b744cbec87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUXWVKKP%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDGjL1Ui92%2Bof%2Ft8lJpRFw13iuqxOOKNrrRaY7w6yufZAiBE7G5orCDHn9quQzL6QJZZxzBxMN159GNibSh0GUIgrCqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJfJUZLUQHZMbc5w0KtwDY5jemESBRxFKNi2603zslSlMF5jItdxcHmdVROg8voI2mk3T9UoON8WFa31UhzyIKG3fiKgUXIOIZy8cnaLTsmo83FZ60IEHaypoUnmMb8hofL94RGxbAFfUVOUl3dlJ4q6qDz1ghyKKbHnwQ8USb%2FNw6GfDaEc0p5gEXqQ7SX0sHCs4sV30%2Bz6FMVPZkKVom2KPzew4QFmE7cKPoZF8z6ihADzI09aEKc%2FAvJHrAKwxEI%2ByeeGqof5cDeEDcHXpSEgXVArgaQJYpZkokqQkaP9d3620tSxzmonDT7VTKghJkqUbs%2B2p%2Fgcbeh3pNwe5GKX4luClahrfKAiOK0uFbq0aj0VV8RRXRMy%2B0rCt86OiuH1yPD9LBCeEEqeg3FAreQMdafErd8Sh4sDZciVwpPqMgQDR5T4iFO6gfZnZZ4qw1ZbqYVzsyzQ3ufD2Z271HB4LkOWc1UTQk69A5tnHkT3IZM5i%2Fb6IITiCcYSizvQjJXMz6TPcIH3WN%2FCyt%2FIqU1aUu0hNtJjUtUcngrtcpkbmtJHMtFPjUSqgVP7lI1nzm8RGgZ0yTdLahcAaSctE6q6N1cx1r%2BFH%2FKuxXlGGxeHdc40c5U3P52yO2sWPCqSJoQQole69of4HBycwxJr1zwY6pgHu7gGwxCcu01WxOjqZpdAFhf8vNtTCmuQKTlnh6tY%2FqyNG3jVzMmD4sUKRVBjcLdpiffQRWa2gxVle0XzMXMf1AbG9qRHjC%2BIVSJpBj2aeoyTOEyedv6r0B3Q4jC6oMYzaDMHKKYYEFbV3zpVc4ZIisPjtCwYSbj3uyX%2BsnhnjYqEOa1wOoGwXgW3xBvbHQyJ1ly8R3TX181y6oxq4V9RACUftJ%2F%2BX&X-Amz-Signature=5b5fd46a016999a8a5cacbb01a8e96e823fd1a4ddc4146600360450df00447b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

