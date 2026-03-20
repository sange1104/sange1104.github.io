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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031139Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=4521e0f8789b9757c17e97189540bf12e97b47df4a83a971f41d03e75af4164c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031139Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=0d09745c21b99c8e45975473a55d23fd4c4779bd9324a1084c22897acc127447&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031139Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=9f20c9de915866a61e45e27aeb0e18f9c59689aedb70219d770401887f04bba6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031139Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=bd17cff17b28f564a4aabe6fbbf5ce7c0f00d8e38827df7f22fe34f040bfb348&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QV36E22%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIQDFW2MEIrvMoUWzTmy5l4%2B9%2BlHstNv4a%2Bf6xPfsr7kPPwIgVU87nHYt8CXX3%2FMv9Om5TsxjrlE5nsfTeX0qRwqhahYq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDKAgHq3h4dDiYgHLyrcAydyxIi0hUIL18tYONheGwZUVHV%2FpZiKLPy66m8ELvcqBAn5hG%2B83Y7%2B9Erufw%2Byqbbe25BQgVhvidv%2FxjZYt637f0wfE0dW%2FTbh619dFjRb3vVqcQ8LXRkBDi4d63qFlH2eFhk7ExtQEWw9KND9%2FUFTsgjsa4pXyTM02lTIV4EAhYJ8yICcCG%2Bk8IvFD%2FASI2g9EA2DW6rEmKR%2BnjMryBVxp8ljZPZXwkTBIV7WfEwQoD8uUVe3WLY78Niw3CRwxq%2FpBdI1lUwyshH3bXxtRho5%2B7oDZkimGRZTzhfm9tWPa6W22yEeSI7PRRhnyNNTtsbBhrqy%2BTsjSN1%2Fnku93pINGibJh6ajyWE02lLwaQwpBJvEG6moFxdAb1WLY8Bpa53DFT13UUcrvVqEdecJu9rJ%2FBB3kXez9PPqBvOCvnLehJPJVoeQwRFdaASzrdSw2%2FAZ1vacuDtixx57KC0VwO%2FlNXwas%2BhNtg5JI0RDvjqsziju%2BRm8AMxTY3KadeFIe7PSpGtPdPy51QFpcrVc%2FDNLcVKZnnv7dznZ%2BN7EX8lIK9BjUPKrHjxqJoaAoALf1QKeOcgk%2FoJgKDv%2FFyLLBY%2Fsd5g7%2F1RFEWSwtjHXheE3fanfgtJ2JScsNhxyMNe38s0GOqUBBG5sul8vGakrIrAhweAY1Y5%2B%2FSILySgls48FYqD4jAc9%2F5webieRT1ycsYWc3QGsnirOCAsuxnYddDwhoUfAG2ZBSug%2Fwy%2FIk%2BscOSYsIBRsX4RLE48qEKFACFRd%2BPznT26lzS2PnxkaPO0kE2PHvpnXbD6O97Oqq%2FhsKGkaBaYTJE5HpuggLGPKTTU00AjtqxEcaaqNiu57qKghTQ5EiDjG0w5F&X-Amz-Signature=ebc486c61b698682951f09bb1032bb0c048f1472b10b168a5f66482434d9f3d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QOQLRX6A%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031208Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJIMEYCIQD0KYCm48OjtYczrcy%2FzmwlsVz%2FA9ECtssagKv2C7l6NAIhAJ3KYwYEzU%2BTTjf8dhLV%2FlqjmtLK%2BT1SH92%2F3y8S%2BkDbKv8DCCoQABoMNjM3NDIzMTgzODA1IgwkaN6Ow1kqAcv4kKwq3AOXZGWasD4iXupfqEM0IyqnVtb12DW3CPgA5AgdwL3lRvB6jr0uwRMe8QJheiPzaXdgxOatQszWWWdpZNYffdz0W1lxhsPcZiozCSs74Wvg8TokWwpTF1%2Fiej1WWPhJFp0fNsOlzSDg%2FIh8cptOBhLleEvCc5zWS%2BbsmYGXl3FQVltiwGdWfmAnjCSMM%2Bup3g82MyXFC1yPlyIL9Y32cMP1MvKf0Y8%2Bd%2ByfBDGWBSx5he08JB7%2FV8GbuYoXg%2BTnVDVaBt%2BoqX6U%2BJ8P%2FkwuvcYaTW%2FImjKDrfLnw6x%2FZeLjMRwYzQiA9qM8rTjtjq0Mzpp8ixU07HcBzXC9I2fZuLemrhIWXotqhvuibs3t8ZpqpCREJ9WqSGuV8TElLc9xe8hpXhr9xk2cxSMTXDr8k47Dl4RliqanAR7FHmIw5AgiV6SmFQlw8YMRpKm9Ni2aehYebwlUFW1aY2iWVqTnZ91Z07b00Wlo9lkEPkXh2oYhvzn6kiPVtH7YNKsekyo18p099T3gPXbFEIwhe%2BwoADI1lx978UQEVMmq5iZrcCjChV9Km%2BwClWufc3Su%2FCExcU2IolV8qrG4c6M0d%2BMNVS78fFq4tv9JfySD5oLR6txjE8fqyHzxFdyXDw%2BkYTDkt%2FLNBjqkAQWoX4afJQnpvmvC7hRTbTHwi%2FOsolV9a4kODDksuK0LJKggpZJXXeGJAqXOBH6sUMVFTfPUDDU%2BUtoqS2JV0PNeNfxBxY%2Ff%2Fybg9hkWYoLnhc4G3P1f8WzI%2F8DizdvxUuDbVaC%2FtP6OcWwe5Zk22WHhHUmwHl0pS%2B864gCS51gEp3XOaVsxSRh%2BSeSnB%2FMvt%2B2r%2BUlbG6vSLzGBPcjMaRFBoxD%2F&X-Amz-Signature=2709f603db13b3e77df62151e5b09321db252bcdef8741b780e4a827fd2a92d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QSVQZFJ%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJIMEYCIQD7tID1qDrHIOzBfHmV2ZvoNVJur3PYtqE9TF00UPsY%2FwIhAIEIZuGjRaX%2BnJ%2BZ1Zw9Okrmd66vgB8LPKkVpvzIb3uKKv8DCCoQABoMNjM3NDIzMTgzODA1IgzHHu%2Bpp5ES0QsbE78q3ANVlufTrIT%2BlLGirzysuYRX%2Bgz7QK%2BtN%2BKsyD3vrVVQo9u8Tjt8vLm52HY%2BTlNLICswTVi8DbR0W29mQ3Y5ity7BVAXrRW5SJp%2FmQecnuOgkP5O1cQNn3TizjC391YK1%2FHiZJBaJ1OVcHIyKdWH4ZdDDTyEdpezjVD0Q2xSNi7ehW8a%2BQs5bsYolLZoer6JhLV8%2Fj5H9ew6XIJE4N%2Fns%2FKMYpCPU%2F%2Fsm7fjHpRlurRHhe%2FpWRlqlGt%2FYbpRpJM7H2d71su1NiO8qt0f61uZiWEQk4D3J508qJhvZTGgQlWm90jIA98E0eoMptKxHE39ylq%2B5nC2cZp7wMLjJ9QLtyeS1K2sFWEsRaiZ0%2BGdpTYk04BQIiR%2BQwPjUHoEZBS2QJUet4E9N93coOL3KY6KsXiyS38URXhr54O6LWlokoExt0gho3SIPwX4YqxIWxCYwcLhAjG6EfJ8IjuJw%2Bdi9zNGq8RsVlWBv%2FeLSsKTIX5uIUQyY%2FxKez0DU89QZjR9HfCGDuUigN1asneKI7fBUdpp5owtHB4JnySTKjJXZc%2FBSfT%2Fz2R%2B%2BTHW13E1oFmsMfe%2BC8oRgx84crfCdbYR8%2BGvDViyedpWRA8CZmvoZ1j9q08inpqx6rAj7h3WbTDLt%2FLNBjqkAfYgFbCqrdReUCZ5i7VsXTusF6nkVgclcnEDr%2BpWpxKxBguyrS7QpyPPcjB2JRPVXkEEhxFkCJY33FM9PXJgna5AF5k22IpiB8%2BaAeWyAkdtlZV%2BG4FeSUtcULljKh%2FA1C10xNZs66NyC%2FLMX165nelTheALHNgzNfOBEdzJ74kXDkBnibakYE0ses6tzuWZvM8zTU073gDGY9PP0pJmHkNj23GD&X-Amz-Signature=c67a2186443518d7ee788edad7d38fecb964df8a1a9985b72534f08606543242&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HT6TYY3%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIQC9BFMAmFSaLAfqPGUy1TsbnMLOdZzdpmENZpObJ%2BVflgIgId0z1awyS4vT3dlxzsG%2BMTLIc2krpiV%2F3L9cBfPOCtQq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDPf76GxM7nJZ0Yrg7yrcA3PeVEGLv0MfIEY%2FQyTuci9C3z7vtblSXRlcwXumUC5tslMqtEDWSsNoC8980e3OxGZhFzdFSWy2w0j4aOwnc34ln8lxJgbTo%2B9ftfAkMpJbj2kadlCBrF%2FIjviplQC1hIjwGWoaXKvWYO4x6bjGuwBWVSwns9jyUo2mFifIgimag9qswpOvRi1h3YXQvyvJDvt8mKKIPge%2F%2FSiE6qKaKc5F45UWCZcuK16fakE4yFEK0%2Fu17%2BxI%2Fog95yradn%2FqC%2FOpeY6CEwulUwxx4%2FdANbs9Jq67hzlvXYweNtFe3yVjj1xWVIoUtejYYTxQvEJN5grbpPSL6rX2ksWDvi2ZAoi%2FteTWlgYpxh%2BqOvmPiphfF37iPYsC%2BAv52BeD4BNopfMPZ%2B8kFKIJeunZv3VS5oABMREGRg56wPXDK87Eo5%2B4VcT9UkOrveyuwOShgXp7mzZa0N%2BJTXqzVR%2BihcpGA3r%2FyLZK2C6%2FMW0W6rTVfEHyW04CGEc16xg%2Bawoygwcn%2B3EzWBexRMpX%2FHY29MBSOEY%2FDZ8K4da9OnDE06z4VvzTHPxFkl0h9dzOZiVxOxxVVPj9dN1PYtqraTvXSrNEZUgZ8c2UyFqb2VauazCLaJC2VyUHOtHJPbOJ%2FSYeMKy38s0GOqUBVPmPCiQ3CUuJw%2FAgQ0559F%2FH5zxRXO0xpfzDOqOd2KXrqOO%2FHox1MKU%2BZGjNTKjxrSva%2F4%2BCLOlOfz2O%2BJ42JA1DGXS2L8r6x0Z2at4Z8l0OwRYKfBmzfe%2Fzm1ranCFI9KbVCPEmkXHuM4c%2BnmA21vVo2x%2FZqabr%2FoLDCEMyIfCif0%2B1NsWLTWXMm7sYUYG2tI8CAXlV77JOuEQA6PhpgO8FhYrB&X-Amz-Signature=b1d29fce66dc46b33009c24152c06226fa71b0b50778960f1a85a7e2607fd973&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031139Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=8e77f01d1457accdcd6a18d4ea434e1414e0577c19c1c3830e6319ecfb37086e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=2a49d08dbee21b021a350ab117e1d0e918c68ec6471145d0b05b88de305d289d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662QJTPWY5%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIETjPT2%2BNxg2zElTD4nBChgkscH281IreMgVHNOhW9BAAiEA8h31VPm4r7yv8M%2Bgdr7ZDKWm6v%2FCuyVyrHwn12IqZAoq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDGj6U%2FZ2%2BJiEiULFRSrcAxpjnRliJzTQs4M%2Btd9zMU4OsaCQ%2FvFlNs5dQyYQ7bav2nvJt95G%2B7hkZTQFm3eGXpb98W1b7S3cmohvGnKFuwWTSCvsoG7SUB6joSKyQMB36YbsCpgVEGp0bIiSEGcmGA%2FZcXrr4iFaIxhyU7ocV0LsdnZI%2BcRY%2FO%2BFaf2%2Fdj%2FyHIaCcvkRSyQ37NTtmFH3iDcS%2BFxF6nykcJXofIEla7MZVFe1ln6VElN7zlMtGoGrT4SO2YDjvr3tosH1T1VNhkolzTZrEE%2Fg5d6HVfL0A4Hmc0nrZ3TbQTecNzoF1AGIgfnMydwo4NQGuJ2KzO2EIR2ChKnEqG31Tbj7P%2F2sUexZVsWCVM9K63528I%2Bwje6fCO6Ck9h0ttivnUGybqidtO68gff5vjZ%2BrzmB1laIamZ7q08%2BLjDUTqskn%2BoaIsu7zlBwBfPrJ%2FYjDUsTG5LeqEVKH%2BHPAt6z347ic6tQfxswbrK%2FquTvzSfGLurvvpaJI%2FyMegkkLfPS84UV3qCrZ4Uqm84AKEBQFoEsHi3mGXCq6woIhQc2vVr8xAoLpRwBzOG7E32pJ9qRO9LwejhAK5VN1arbDiTQVqGwlQLmmu6kFG8%2F1VtMcnMJqKSfremKDX6mPOXalpOkpFyNMPK38s0GOqUB0EDmQN%2BT3Ga1mpVvgi%2Bl75wb5DxaNfHiX7WESTH5iPABYSrAHBs5d2gHP%2BkHe6Pcj7hy2re4O6QYZHih7agrManllET17HOgFiqRNolk0kL0agWeFX1qRsBTVLWAlW6S%2Bj2f1iUYmY901%2FG1g9yjVYl9lozKjbClV%2FWRH85%2Ba6KAUIkXXFr9oHp8iNF1USE7prp5KufBBgyAxvnJYLFauF0GeYlS&X-Amz-Signature=3dfaafdfb514c8fadb4ab14ce6b037fa0a3c3e767b49796273f09eca48242087&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=e6daf6861d711db1fc5a36c0f24d8c69528d326d8050d0cb53d1ff691673917f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RW33APMW%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031232Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIEQshVxh4Te867wROZ3U6Mhy78FK%2FkKkLWWfGvgSPpzRAiEA5LKENK%2FEIoXlUaeJ2q%2BstmCkJ1PTHpG1md6bpjxE0fAq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDKHKnrzOBQxmi%2F%2BXYCrcA7br95jMF1kb%2B4TsMTxMafR9u4n2N6cYKZSgsjZxOHioksZyxZiBm6o3eWAe%2BKXAuEHTTrUk0r7EO%2Bs6oyk0pdYtBUgy%2BBLxyw2WNF0vI1BvxnJGZhlsKfgyRa1kPIkWNbivhheEI2T8KNeyppT96o5X32OCj2K1dgKbzy6xkOZ5nKIVXhKGjkQqhZdMR8LbEfpFP0D0fPLnD4sqwA%2Fen7jC3wEpWMevBL8t0d6OnGzsR%2BCK5DJbrBxP3ylbDfNslqqtEWOleJtmuC9KDYzQ1o1YVxdkzVRElQtRwlicK9TAq5sxmlhc2sH94a%2F%2FJIPgL3VvydDfWSRJYAQdP1g6RN6fNA%2FFQdOrNbBhHaF3RoT615avzsLScUeyj5jPWDuMBY%2FFB3dWFtykvPhlh1T%2Btw3dA4K%2Bjo1Qu1FqW2O%2BZnY%2FATMCkPkNI6Um2vqwOVoVN6E78nz8ZmtkOZAflSDUIuBVblIZGeBLRpCfouPtOecPAWly5UDmaQlP9DfRz47OngTskIlM5gPcdM0cRcrfuk8xXV%2BPCdtDY4m4lttorsavFq8JIVw4jTa5EJVjI9Gk8avoW8ExbsxW4sOKfXqHa7s379nLi8c0es7qLloVWpYBu7DgJUuQj994jTpUMM248s0GOqUBdoh9zpKPHNhzdO8UzjS76Tot46kPPs74JBDgFW1s1%2BOiGON2UKlrJBs8jvpFNEwHp9gsa9obOwKsCkbDs6VfGVZKN3sMW%2BuOKk0mA06Z4GURX9kZ2nGtXuGopYG1kyvzvpsQtGvNBslOzg3S7AZyiFaT82xjSl0O0%2BJb%2BAJPjX2xfD%2BRDcI7wp%2BhQpc9LepLaJ%2BfGZtngJv6GdOHiSvOH24Y%2FC08&X-Amz-Signature=446508b4d527a6b566a5102de58af9c009df267460f3d9fc96426845b0b56e7c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46667Y3NZRT%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJIMEYCIQCANnf3sTRTBbCwYquaEXHwOoV1jhXFoLjww79AVSEpVgIhAJzZhhmLoDDr%2FYi26M3VOi1%2FX3Ojfwt4ls%2FyH09Lll52Kv8DCCoQABoMNjM3NDIzMTgzODA1Igx3k%2F%2FLz0FXIW8sSwMq3AMRjgGMhuq1De1aeZYPqxRoRSrCMvsjBpkt22zw7nEsqt9iBUw4baugujxtu9JT38r9GDUCZ0PXzd78IwmyrJStIIo93IYFMP8HW0x49GHrfIiGuViM7kmsulohNVvVUicQaTSzYu04ipL6K3efcXIuaGjHFAO609dO5lkdmXD9ozcBFa3B0Qyk3RGAQR2SXwvFHcuuixdEtkghdo4Gs263GtSQDQEhM%2BXFnm0GHV6DBk49R6C7UtSDtavhBzmcke1W3IN1qSV%2BHdXTk%2FE2GUMx3fyJ2KnKGOAOjW85eubBee7xY%2Bjp5lXqLKtxzrWHrEAgj1MpW0m0ZLmW7Na3Q6L4YN1FCNGG2TM8tT%2F56qnVluf9O45QCorJ2c%2FJVheNCPK6BGtygsnpjSLjr9tkxYgQ575IVxpKvp3e5XFGlfH0MutUXJObqa7X01EHdqcWd51FMXp7qC0U0PG%2BZsmK%2FbrfvjJ52BO1%2BdRApkuaSdhFddDfi5VBttR%2FbXuhWEiLRP9fXS3287T%2FqBKca6Kd4v3us5os3Lc2spKj5FiqtfTesQI3dypt4Xshj6t%2BKeUrq3O337%2FooemKI13EbRmnAYrH6IDIbcxS8VHY7w%2BMFzwai5mF%2FYPIp%2B%2FjlUhMgzDwuPLNBjqkAZYbVZVU%2F92K5T8ribvI4iJmhqcM3fd3lcuSUTc2IMd3pgAdJIbynnX3vYBri4qWv9ORaeG1MEzh5GLxzWCTVlb%2BgO3jYU98mgAZTTGPZvBNiWXyJtc9N4ZhPxk5vQfEQI%2BefYjol%2Fb8b9%2B0CCN4gXCfTmyufg7rArmwk8XB06kWqP2gpujmdvLSLNjc455kTAq6s4dhE%2Fme2H7j4OeHhN5ze9xj&X-Amz-Signature=ebe57f0cc381ff57dd17a9e3fa67faa34dab3a54a883c9c510f81780f051e3fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VZB5BBI2%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIQDHUCX4dZgYWOqo60HZx4uzrrKWby2BOwxbGDvG%2F1vRyAIgErTwYib5BUA45yABVcGS4asTXjoy9Yxe6JMkv8K3CWcq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDEO4gb9vBujWHEZ8AircA%2FEbl7kBeqR6XWOUT3M0nZHTH9ATZGg7YNaB26PjWyQVAmN14FKoQlC3WOosC5kMwiJJAC9qwMfXYSaccfbPvOeBqx16v%2B9NG%2BZ6%2FDXKC4%2BbNajE7fhN1Mjz4PSQDpk5SQxWbc55FbzHj%2Fel9ct8r080uIT04NfcMBg%2BaGA%2BoZ6QFK0933cuBI%2BuZOsQPXzI2kprRM5Y%2FAvclRPgD%2FQcZNn648CT8eUXBqBt%2FuqKyEdNSAgJJ3b%2FwRZPlso%2FdZpnJq1Rb3aliImYTbCc%2Fi7wKTBTmW1f%2BjwoS2KKa47I%2Bgj5t4RvSZck2Cwo9O8nzb%2F2Ei55EtJM3DvLt%2BRUC6vopfvYvE0QDgOC21Tn8GOyd1B3MTJjaIGW8OWIpSRnLGeGyX7a2G5lFeABuhJ10MnmV1cqvwD4zs1YVFCmcS7fTERK3%2FLDA0pd9wA0sirFYjjC8zyv5yFcgaAfiYCDu2%2BsmwsfKkKiZrz7P9p7sJOsdmSR179iQJTs1LJpprA0uvTb8%2FI1rODSFdblVR%2B1sMq5%2FBZm1UQyT8IiqQh3H7i9E%2F4AY2GjNf8DYa4qax%2FwFO3EtJtWgS2asf6RlIygfpvgJP5ZxZ6Vp7vLPpC%2F18dvHmLsynqCzOY4tXxwOPnRMMi48s0GOqUBWvgHSYwQsZt%2Bz3LJ9eS2pUNp2lFHkK1zEj9HsaZ3x6oI1lUrrp%2F%2FhY82bHASy79o%2BWaq8JN0bbUY8lk1ERMbso%2FXQ1gTpxpICQY07GZrfsPbK4iVUpxaMcDWnCa2HhN89Zaj%2ByFiVA2fXwU4uiJNKUsQgMUYqEZVYHP9clwDpmPcLALYA%2FuOtm9h%2FSpIrSE92MNwvtrJyH2Pae2viXNyVyf65qqr&X-Amz-Signature=f0859184c419e596f5d3037b610a3d7cd91b15bbc3268a120845483be08a2ea0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXHSLAHP%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJIMEYCIQDA%2F5v0RYFxjzeWleCXJxTxYA9XY7rxNbDbWDdMGYZPqAIhAL48FznBkdOtCgxtVRGhA0fpZRwapDv95OGWtJ7sRsojKv8DCCoQABoMNjM3NDIzMTgzODA1IgxYMOan%2BrbhQbX159sq3ANKz0z4S0o5bFnaLupTfLkQuZSVsEJyxMK%2BkfUAS0NoLnOT1OGpoS%2FmAIDZqjx6othzB0mEVc%2BRoSCk%2BAtirqOTcgAcOlznDmh0w0d3nYcHik1v44fctaqIjSIkvMgyalOTW5uhLaFiiM8uyJ7yk2fhfMaZu%2F70wl0A4RdqPZcfj3Tc0X6gm2VgS2%2Bj%2F75NIJJkY8Sqvx7vvJLLKDj%2F8v8e7D3nBN8ioW1gGypvg4YtXKGvnaftt8WO8pT05HDm9kbVHCOxc1L44Ba%2FIhH7b2FImncOzXvEV%2BE8kZdjdLvn6AS9FvkdcaeiwVxSqH%2BLjADWnTlvD6Qs6yzedooZNxxK5AasDauCm59BLU%2Bhc%2FCqNyn1gb9RZuCmBduZQQGvbXGaqllFE4dDjH1TcwE1rp542tCWDCil6tlK1c32o2OqE%2FS9BVy3o8fYrqoWRR3tfk5oANZ4IwZWCddCqa1PPqTHuZRSL43mp6Jz2Xg4VrBJ4LYZYqGyQJJrFg7O%2F9pKBaWpifB8%2FzGW%2F%2F8skH0aioYa32GS0EIOcOYNrKqO3HdDLi9giPhJFHAdP30KUVIbREKkTwycpYDX6RHqpiQOwFGonw7ihumomzYGKHBpbpCDoe3LuVwMLiX6pUm52zD8t%2FLNBjqkARpre%2FX9BgiL9iZwel%2BxkiHpr1innhyfIbTQ0dbvcd3rHSKvVj9hskeXgYoaSCErVEr81%2FBZ1KlIPVTCW7%2B8drAEVAtzjuKbP6LgWaPFBsqFhTjWSpUUaJjjb22uvzGZnvI8%2Fx2HWias4IMsqoOE%2FxNc4vD9Svkxl%2FYg0TSCIonYkO3l2hoNKZ2eHbsrN9gIc6jKAEX95ZvMuH2OLjfgXXta9CZc&X-Amz-Signature=3a44e35293fc2e62d9e7b3f9341e5bb0b934e7fafd8d5529c6d791c06905f2f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=aa7687c0e707a326773faa9039017fa4c32a4fbcade9ffbd559b453881f05686&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QLY4TRD%2F20260320%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260320T031140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCXVzLXdlc3QtMiJHMEUCIHKBX6J38OBGD4AV0gOP5pyitji5jv%2FloFq7r%2FmWedNSAiEAw5ddvZAYbEgQzC%2B1oLrHepb6y%2F%2B%2B7b9BGK7ijQXS1osq%2FwMIKhAAGgw2Mzc0MjMxODM4MDUiDDwXsVCy4DyI5%2FZGpCrcA7NcXeUhKXKeH7i1Liew%2B%2BmwjS%2F9UcqCJI21Rqcw%2BqX3ov0ubpr7v%2BOwJBDbt8r0Ogu1R4rKz5XJiPsO7w7zJB9Ce7nKTtcYbEKa4%2FHvfX78nZ5kvZCmBQQ5EfS3NG7tJgCDHTU%2FQtcv4Hb62sFLMp9EcDJIloa3CiFS6GaXw%2BfoEZad4lsJvmoSwAr8ADtmARoy01XjECPhaYVDEYL5SXpx81Awgsyksr3JTyF2JRAIgo04YqhKthfHF8aIqpP2VhHsiZ%2F%2BcyHy53e4XHGvXZBhXSh71Ir3GGIWmSZ4B7BV%2F794rvx2jgHc%2BsUH2m8IeF2vbekMFBy05NWbk088aCMm%2BQ6jLQrlevDqmeJBBCAEdTfzIHLCXh3ytj4ZsXqqSY1uY7NDlC5hHLnTEom5Jy8i3aaJS6LAFhflzN3icsUWU4%2FjPdIhdorrDBOp8Y2XKhS4Q4f4gMc%2BhI76JerKgZSWIYhpsD0GRvMXMqCe6dNfvqerU5faFt%2BnV1on1Fb11QfXutKbmb85u98EOIOQ1BmvJbNo9noDgYuh7eLRFyJ5K2B01w9dBQVnDelzikggF3HshUyccAm4qT54QiB2M3gT8uIHeqSuT5nYDpCB3W5lSfaFtGJCYcm%2BslqOMI%2B58s0GOqUBEl1GzMzLEdOizVCg4CH0R0k8ZcIKSU54wAJGnQRMSliL9p6fPgmF%2B03dxfT3CsuI%2BWA%2FPjGFx2mRZW2HI10sdwdukA8B6mzw8OVZNZ%2FUBNPWWoL9FTiGMTaZoFlWtiezXLJBGfZQt7A6WbLWVRPJyxXraNSoe9Rj7jzg29czK4yIGUOHwiwYQkxSg7Pe27QxMVttUKHhWFMR9zwlZQAJMtG7mHIb&X-Amz-Signature=e606dc85869c74a1b5c22ddda5eeef9f4f3547b68f904697cf24835eacbdad7c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

