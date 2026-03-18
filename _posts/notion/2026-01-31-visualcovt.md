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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=60b805cc075ab6e8a9a03fda8db3101a82500dc0d133a5fa8c08b3114b5bf06b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=60ad866713b6cc52e5caaa3cac9e0541a5955f5e5a3234bf61ef36cb35a11980&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=d0b482c521f5c0062fb46211099060a86e501be474a88b34f30393a9f4ec9cd6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=b27129510303d6e7bdb46b73ff1f112683bf9f2695ec829b037d072e3ea5be5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JI3EKGO%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIDiLWxR4tcChMlAuT65CwIPmXL2HF8zbuc7X%2B%2BzouYOAAiEAmzVOs4WvBZA6ma9XxszaBW4bxnN2mJYhm9MYRF7NkPYqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCap%2FiXROADf9IMBIircAzDeu%2F4TrHpjhnIuXMlVn8HtW9WiYDUiSS%2Br9MijuvEXIRHx30R%2FRqgDq6hpYwt26LLkSgNZTroR%2B%2FMufQXGVvIQI6ZJTZxnWlGlMWqcY1bEiJYtmusPvMXZoUDvdDfzGqQbt7ffxl9i%2FWECMEDognkNxTYFXD31TCNilHZQsaFfWmzRmcO%2BFpTZxOAOxFRPRa285IjIjUQkAB5dUknaBDAJMBYuy%2BUpALtOLs57kv5ItGGND4A6yMuVzSXLuSRmktZnZZuXmaY31PWJHpCClkh4MIznNfMUllgwj9ylGutLSL%2BRtTP50iZWtnllWsZ%2BngeRvioK0eYtKSjGVUS0k0r944L%2BU1B%2BezOgxMWMxwZKE%2BG6JCohg%2F%2FDRNgeEsbDrOvIQ6UoT4hMNhCnyLoO9qbqMkO0ZbuKUQqbRSMrT5D85ZZEuCxZ6MG9GkSI1fGlJJeiTf5zwoNGncLUuRyVArB0VdnzIxijVt2mDy21sasxqRWp%2Bum1rFCqnVMJYbnLhY4VsMHjkRB6UT7o8L2aVSVPNfO4Ig5Az6bxsU6QZmt2aOU1GEIGvEPKYOYhdXSl%2F1JxCIK0RJ2dYLs%2FkymCB9RGArGT3B1Pl3c8G8Oqne6Ua2HmJjxXo9n8qeuzMMyl6M0GOqUBBTG4%2BYiMs368tUTqLkBFd5aCZ0k7c9yj3BQPOmf2hfkMZ2ZSZlXAUQv%2BV3fZnu5d66LFvN8kjncIS72%2FMGuR1Rmhs%2Br6cV1mVcEuEnFVK%2FpffYHsNsxIdzqICxhXSBAS9gjy1bR5G59zzJEpwSOvfVf%2FJhyZF6uQMopOF5hh1B0EPXt1uN3s2dDt%2Bl0nJFcjINvkftDfezioON3UfUePNDo2duIQ&X-Amz-Signature=a59b437009b80e317b17957bc79cd082024d5b3c9c7f976943f5727668415b3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46636QTFYQD%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIGm5pETZ5cr9FFe7swygRJGlflPz5RjYvKNH%2F%2FWc%2BrclAiB2ncBn9%2BC3u5SEHo5w3IBZ%2F44eBg8htA2ZhXRCKC6JNCqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFenjMcJzFC7D2gYLKtwDCXguoVKXpYUPCvwTXozVIeIqcqZS7nQguUXrOTuZQb2JOKiAz4gq33oi4wz3bJ484MIehUBEIoF7%2FYNla8AsDJ6FvJMIn017RdfGnqyaN63njG6b3O2zNLLoSZHzj4EC5%2FDCPD7NFneGs78DVvRS58qr6li%2BRmMIktcxriPp2NZd4DvVhwFQUkxBtzNMBtL72f5BUa4vje9NqTdnicna%2BeVQ5lKIZmK33KmoQ5lIrQC0bXIGgO9ilaw8Z528zbkLLQzJvCPChLntufvOl95nyCs%2BEqI%2FdRDsF1tfrpNqMrqr2EhbjXWQOwEZl2CsEsc%2B5CzangQWCbHUcikRAJn1hN%2FJaU5kC2xXsYi9ww4C2R2cYrBUnqCsGkXRunn%2Fps4PeQmZvrlhAnoY%2F6iDTtJTt3OPdESWyX%2B5uYY7vTf4LV%2FtJ7ZWzWm9piB%2BESxUHkPSzCfOzacWHhAl6wloeiWwM5f6CYa21c9h6S87spEHFs2c2WkpH4ib8ruexE%2Fv7moCinWufSKP4NO14gx3jGvEbtf8QcTTzVaoq%2BhLI016kOd6EmX8VnXJt2CzQSXw8tb4CjTbOE8hjtsE0iBW%2BuzWikOhQfXOr%2Bvu12ktGoqVWpBXET5BHpLZwJDLu9Iwo6bozQY6pgGgR6jEE9pcaXocnS%2B2t0KDb5PM53gHzOaj45jID3dx5osWFUhvv29eOjo5nTi32%2F5HxXo2TemuumkhfDiZIXgkmIRS%2FbGPqktSPJpPHtjJEEn2GQuaqHgFnxeKWeBE02rl8d2oaW3oh2qhqWi57wtqbYd9tqKapfVbUc7w1TwxaJYQMM8A5s39LugX9uz2BaYxEv%2BrD0y5%2BSoeMTYMBTaXzkqf7jzT&X-Amz-Signature=7302974233cc0a0a7617526a060949bd877cb8031df97ba3b51b3f77d79cb394&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UEAGGFBS%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032133Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIBvZBHdCm0IoUQ8Xr7Mbtdk%2F%2BupuNS5%2BuOQ%2BpLmHEm%2BUAiEA4yOFIk2OxZomynDdIIW6fcGX5T0nSWTyk7I5FA9ZVP0qiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOxCYXpIxBTO25iAnCrcA3TyUm8QFn%2Fq6pLfZXuy%2FNM0C5EAgM2j97dS3zoWwmcKesC4LuflfaHXyuSYsM34Ju%2FbwbUZSkhiP7vPXyJ8WvuIhzI5NLoUIlXLzHMMOrTNTxb7BN32q5y5ZVEe4Jn4VK0Yf%2Bs%2FbfIBcWWWzvsI4ik0n6tpBnrVaULkaDaCX99x8Ex6MtpD2wOHd2VQw%2F1ulGeb8yHepY2gbanOW6jXQxKkY2yOjHKHg98WiGHvqf72pe7wVtSz5S%2BdnDbwCiGk0IpZsc7AzLP1UMr0xRNs%2Fv6o7kTpPiRbaowvYLDTJcRa6a%2BDrNtd9noYnh6tZauv1RavNVgqUk%2B8CpNMZX42YF2huZ7Qcy%2FT7DjyKsrVLFBpFhe%2BKqZ3oZzP9XttCIGK5LXfpBomNzI11wUwI9aWhn89YwgSE97xaLt06XGt8xOKjIqbEm2k5CWaVoeRzZOhf2Zl4zaWPN2h0QWGp11cqqvjuWux%2FXYcvHFiEaZUMiqlpkJMhKZI4kNBj5q3A1F6iQceMpuaijbjwYVKH1OytOAt2hoj6XsAXrFuEbK9PjTzZeXECbdeyEv2SEDrOliE5v5US7NcGR6qMm4HcL%2BVyZtkkFhV8E6FbzOcacw%2Fll3YLuHvopfl%2BLxh6PTNMKCn6M0GOqUBjtjsvf7d4YjUAwW9p9MdHhGmlWiIkD5%2B1ptNT57VysS2OzYpjSM%2BDPyCh1KbmWF4lJU6bE1MN0btDnNYsCeHEx6rE1P7qbHLE4QXJ9Ovc2qPLYuYflbJqZrs2e%2BXkdhpJ00lge7ToJuht5UMaGnPmfCjVPFNWGJ7gN1R5JadVo6ztZeJJWRLHCuQ4GzEoOZhXw0MqT%2FfX7yjG9o%2FRKNffQWcjVXh&X-Amz-Signature=be944a8796f441c45424e4bec323ae415c363552ea69b3871378a7be0052bd34&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WX4AJIHZ%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032133Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQD4YnQrOjxMFsGHsP1k88LMOjS%2BGFb7M5tKPDg6t2wPDgIgEscJzSrY0ylYHD%2BKllp6mq%2BoARYlXFJ%2B6G5zz1psJBkqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG5M7NG%2Fn9wmKCeFYircA9ax8sQfoF8oQeNnGlvw%2BPvdjlK6D%2B4STxmaHDi1prO9vnbP5vRHJe%2FYcmix6eWSOQTDjSscqoVGEttx3v4wgAKrykOlAD6%2F6i2Hx%2B8nBaKasHEfA%2Fnc%2FQy%2BrUCs4L5iUwyM5ol66crf48kwEBo4V8Lq%2BNsMYAjiH5zIJgmN%2FeVf3akUpug45jpAbyIgP1%2FLrd8nh36CWME32kCmRv0EF%2BvkvIMMFcOPl6QX7o9vz1zE21CSQeGgOUMHKZIhbjAa8GNcruFTN0sBhu3LkLxovqgZ2krODNeMn3pNOy6%2F0XS4j2d7Hotzxbpa8hFPgkiFP%2BHFODDK%2BhdhS58Wq2SdD4jo2xQ%2FNGzj2MhORZrz4AMGIpz9e7y1Z33dA0%2BrUKlkw9jUIBb3ijXpf3mFS%2FMHfjcRNvAbdQY6S3qoQa1%2FDGnL76lXHFGKFQz6D0iOlTJUbr7B7KjcAkT9ynp7ctLPPTtXFv8d0D1KJw3Gnru1y5WoyL09emHMOZarTLQDwc0BTq9Cxe4kn%2BO2c%2FMCA8kgvQhHjIVf7WqHXwW8wlE8YjTuLQOwxciyLPXUgZUYTGm2BotVBUsA3bdd0MyB5pTZahd1LqK0o5I1PXDi9Z4qaUatugOn1bpRcV8ocAxVMKal6M0GOqUBsnycZ3dRug2%2BUJTB4%2B5RgthrVkxsgSfxyu5osKxIPC7zD3EZqwgyc3R9tr8nQKIRmzTD2Xw5D2BHDIG2MrDACqLQ%2Bq1uZQe4bZjORMXm0HWASLlO%2Fi%2BBkaWB0knQQl4qUQAn%2FlDCzr0NHm3Hc4VnZA17qRDh3o1DJjJk9aQq329XHGW5j7%2FiZYXnWDrhVH94wsXvxJg5OseCA%2FESDrkcqaXbqeyB&X-Amz-Signature=465e1077acca1f5e02b260c7ffb694524be63652ca3189a4b33af4541b0e2649&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=ced65e5254971ac545220e0215ea9b76594844f08b119964b6544bd9ff1586c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=c0ad8d8c185e8dd9d17ecd87008fffd63efa540163c96e14c982475a1a083c63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VTQZHQUA%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIG0wj3hN78Ascn07WKdpsS1jwt6nVZqykeXV7nEFz3ggAiEAt4bZ6%2FPJsPUYy0pKMkUFYzEOQkPpHImpGvfhHSEMO1cqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBeYm9JfgXfNhVwMNircA9DvF9rAT%2FFvMSQJIK%2FH0x%2B4MD1lxF4fUiTM%2Fr7foPI5zsKtZKOmnwGv3Z763JCg1J%2FEAN1lGsXtJyi%2FYzjdjxErXuDxQQebAAX7FKfag7Mlt7sazLbHDYtAHGNrFTpK93wFXsqP42R6QDbpTZc%2BqYgf7ilPveLyf2rzHIiyYuv5l%2B%2FcinmtuwMnZyXkPdDQJOr7INHvGUDc%2F440fSjw36y0C0fnHSAJ4LRIVdHICQGUvh8Btz3U3eSMGzUflWN7Hc0ExXC3KeVlBu%2BMIO88X%2FBBSuDWUKeOcADAFDJjhAoTCOcP65orBcoMxojActYlFUjwFf28d0niCiEWwTKPYF%2BfV1khX2VVDa%2FB28o6jO2K8fnv0PnRzkF4IbAvxddm4QbhqVP2Pc7KKD6hT4IHFNqpXcOX83Nv7lO1Lbte2gOo8TsEdkJb9MI36adQDKaNdiEBglwQ%2B34mc%2BrVLH897nBBs5Lp5boBjS%2FLJ33xuYJ7G8W100m67sba%2FZBRzYOZI5LS2etktvUpHL%2F2tvndJyfoX94CbdjsA16%2BgcU%2FuGJQoqONQzQOQJpLpw73UQ6aYlX4ciGfIDdj%2B7laZLSlg427wtzQRTTYjwkUmFh6LoihX4Hx%2BbB0NcRO7pyNMJGm6M0GOqUBm%2FjXGMIiiApwTEVKbKrFZr1xaeBQhBaupTR%2FWlogevoFK%2BkQ072f7HcH6GYMaMtNof7fzOz1Ac%2FBHojJemXihQLNZbTMvcqoDs827lGhzxdFCG4HL1xTl95acouGDD31ku3WCBgXq4Z20XDtm2lFQI2sJ9H%2FZmnYKSqgbq0MhZu1eR%2F47T4QrVCERYrtJvyqILdiEyqCU1376apEnS0mnckxJbBL&X-Amz-Signature=7a082a25ac931818fb644f579ca872078a2c8a29a38f37bfd5395b5dce4320aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=6e2aee2deda6663cd42159943e502c8385350b914572d496db178bb0c4c5ab1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OMANBZE%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIFShUDDG8DMiUddLdyva%2FFX3GqaZqwa%2BDobpKcqf3kyuAiBlByUHdAyzvmh8GOsMwd1eHlRTCmjWDJlT%2B%2FrWTwpAviqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMTknz4eC7huI3zGRXKtwDzjpePxJ3lH4hw63jCR31nRN3fmKNjSzj1G5KQQJYVojEaVPrEAl8atlJAT5baXnGydhDN2PfdMO40KUuhV68BjI5iBJGnxYjKWqza2uGZkDDve%2FhKruGy0wHqcABa4%2FOdRNhaUu2TtQgS7pfd%2BuAVJq8Ljf5UYoJTqcnbJ41zOCXtQODZ0usHgIpZqE%2B%2BNrrKLdys%2BTexG%2BY2O1D1tOkYpgE%2B4h4SeZYaInXW8whFJx%2B5owZ3JnXu4u5IFRf1V%2FAgVTmGqdXmLYlewp6HffMgKTZk4ex2kPJk7HkfIxm63Q1t7%2BL%2FCI2c9J9WY1LU%2FBYl14otGF8GPSVrTdOlZkLUuWaMFJ6lUKYCbwT9Ufc8lJ58uvrGJhH8tDser%2FC9dU4VOgpHhEOPtLLGWuxpxk3%2FeO%2B0p7AjZRs688exqwmX4pTyuFSDIR4kl5SaSGIwmYHX0ipps3YSnfl4X0RkpicIS8y5GpKvkMA1C1RROllGDc3k5TKpxoDseqR%2FLFTkscGh9yZ20VptfkTRLM372lklkFVjTjaH91N2W84ai3AwSeghEEyqxRjcHubM%2BJ9w1VB9VeuU7W1RtJhuwVV6ge19y8BTmFcftvcFAa50r5Uuovd0XVKn96pH8lg2I0wt6bozQY6pgEIH6Dq8WnShCk5y79zYPZwMar%2BzDuZetJ%2Fm9iRi6unFWJjQa29WMFoBr6EewR9sxUFmNtLothzIxAG9ldXvxcwE3rm5lm6rx20sFg8MFVpu2FIfgeUsAfEIrUybA2K%2Bj5EatSH1U4LJP7%2FLz8v6tW7Rweds3VqVfkle5cRQFLI9a00Os2MV0Gu3fF9zzJ0xiFH7nTECtZzknPZiPY7MpX7YWoud5za&X-Amz-Signature=d9e7f4978c733c294dd0d776a22197f8b9e71e7b44f57957fd5c78f28257e0f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZBEBGJN7%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQCHIp217D9gVTdmXfy250F6rJivDlA5ZPbAjt%2F9Dgk28QIgJEGsnNsbSF0ZbNzGn21JdJM0lIqoCRF1w0NsY%2BXVDdIqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNHwzCBMw3%2F%2F6s2WOCrcA%2F2BChb5C%2F2TLMYhtU42dwwN26WeCXf1zhQ4eaSnqNsdF9Uw2GKeYX0PgKrAkJ2L6lCUXYI8NxV%2F4Vv7%2Fdn5Sc2uXEzci55%2B5PpCWjxSdmaEuoUwU8lHIAlNgpaAEwaETljwwjIettwSrx2%2BkcGs4t%2Bnerw5e%2BwRX15v4W0vKuSsEu7I3p8krg1gURIKD%2BGbRhyYmRbAwmORxKxQfwd8zNsOt24JYTWt%2Fc2arofj2typ7HhevDJ5LiYrhqkfC5pNJqPKrLp41vnRJzz4BzPyudNokGvc7ouy81JhZ%2FePO27sFg6hP44rsnAOdMcg%2B%2FNSW33TIkflXCljKV6JjhNPPgytIfxH1oGbfP5hvrd%2F7KE93frXZQyfob%2BnunlZCB5nLCnERe5tklbMEY8VKK7PfHeAWzTfM0KJsegvpEAyPyZY6JLoktb1C4WDhsM%2Bj05gUl9Sqz4NisK9jUNBn%2Fhc4rM2nNi3haJPZ96mAEKW91FrtxCikZSNTbjSrU9vlFcNvBXh5pQ%2FVMkUwfVrziai21VTMk9xSvyQtASYh%2BXR%2FmajDmu7oR7WEVPw%2FIGAVWoeJqZgRQJOOhtcP0DqLrmbJhfgZPAlQmGw8yBCsOZ6K8h0uE3SQ%2FDf%2ByR7zcFUMKGm6M0GOqUBIr4fL7%2Fg0PK88Gtg95l2FZ6GiihzDYMIa5vN64CvGvFoxsgWfwGEkmsRAn33HItS7y3MrCM9OjPIzrl8ii83GOGksXMBRHm4KFyFzr%2FHE7NonOIeemNb5jt3D%2FGV4aABs6Fl%2BDnqWv%2FiK9%2BsA1kY9l8p%2FFJ1d9MTjeLtPvqUmGJDzOF%2BEX7R1Oj6I0ZSIn0Csno1dYZP1jhL4rnuWkzwSTTiYF6v&X-Amz-Signature=30d60740b77c8076806a13b81a70f843fb34c83dadbcbe6ea4bb48722738d6bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWKPKZWI%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQCJWvjUZYkGIj7lGSYftWoGVt3SfqxThxOo3UitIZ8bsQIgVXt4BolanxBox8WEv1vh43UO83kPw6Xy37y2Rn0An9YqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH%2BakBiDKeSOqrXZ4SrcA6R0JDZXpX6Z8HfCGIb8pPT4A1GLX4IpUvwCmjWwqDSJJU6GvFDayEF4aHbeekcPh08B4x4n2NZGT4d0zLLBDv4kcD%2FbXcLHK5awLQ4Lz7SRswOWDa%2FK9D48Nuq75JCO8%2FgNHRlt1eAkYiiNw8cWAkqVuCpBzHDXWZpv4EbptPQaTVidJreWBACmLnUzND1v2zoJPFnrLBHxV%2Fr918DYl3N9d2FBpcDHuiwBvFHJRfklW9km%2FGoi0SBGp73rjmNJxtWym3BINJG6TtejbDe8Yv3QepCPjgYoypoVgeCmvHzM%2BQDbLVZEVJ5h%2BcmI1OfXupK4kAGGHcVs0WAKIeWC%2BEQ5APTwOYjdCbq3IA3JNrxlHnnRQNfEdN9nOqPNc4JTzuqYQOsysuVYfvV%2B5PmB5Iw99ckqPzQK7E9BldjEgZ4hm8NtEU%2BsQAqWMu%2FEd40oNYKp4vdd0zU80Xg%2BDtpmHJmxtVqb5fUASjhrIS4pUAz%2Fw2%2Bx8roFmvgaTAbHjlwf%2B0TLweddecWelEeJqEahBhbn2ZHSwkLk83UZUpPczabaaKXEZr0vP5ACsbMmlI%2BONtufPWbh6%2FuzSHyYD9h56TormmOemm5OMIsB0iccjcJTqo1%2F4gVC0AezZMHwML6n6M0GOqUBd%2FNZ3tjnpN9AXQi8l2QEK5ik4R2jkXfI8Yy0zFOUq3nT1GY2oF0FN2BSbyaLlqGgUo8rGjXnfj2ZudYp9MaUGxDUZLQzCh6fEYQWRjPLx0s9hVzT9I6NbkJp9j%2FHzUNZ4BYYvR9B5JsdaUus43WE0PaJwRtXr4mieZlHu3XiAIUA7%2BZItCtNfeiOVPZjdYqQsHrQMTBu%2BhI2UYRfLpVZXp0LnjbF&X-Amz-Signature=e35fd07f6d45a2b16db06353c23df84b4fa03bca9568f6ec38ba00a017d3c5b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZMVTMLEX%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIFBgyieIwRUoqapWHROhs6grbVdoaI%2BuEMURV5vG90jAAiAvHM7M3UuLzaqwTc8Cfz3oGh1aemh2cRcZazZ16a%2FLyyqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMknO9k9l8RR0BAWWMKtwDuPOQaQRSQQXgZF5XvCIarNaqZROdOFn1LHj0hmmtsrK6HE405JsjKVbfhf6RAh209TTmhjVjrfKEhhMVMe%2BKsQPv507lzxfq%2FOh%2FNKq8Wb4ulpcwzmBapIxYEoWgNlqcgY3%2FG%2FAPmZ3uhAZyfkjofea7H0uIAeOlpxGyqmqNAm0416ko%2FFV1wsVwyzFND7WRrqb5%2BivEOLbJqFPmqQ%2FmoVyJyeg%2FWw5mHU8VNHdu5coeoXwW1I21bbgwcoCHXKs8oMaO5WqKCtBbslROIXvJ5S8PvxdXeERWCCD8Y%2FFl8p55%2F50F3Rh9aZfVIiydeL7obdp5zpkHvyv51QC4bIoOPFE0ir94FhGdWxnBRxkCj%2B%2F6p7Y3gq7puPgaKjLpibnCQ4cSks5JdDtA%2FbbNN2cN8rVaDynNBnnE1nlqhoRtZWdGYPFyTqX6nag3fPbMETK02hgnq3A0ZIVzJsnmjQtjbljagX%2Bek36qtV53jQzcCUn%2BVUxlH2H17NYt7S0StnSVfzlCxIw%2FKUiXa327RSyLFPuuaBzSDnODTtL%2FNnWskAJM5ujEQOUpvuDfwR07AB7L8IrBX%2F%2FJcvDx6IPWdreC0x%2Bp6t8b%2FhphXAdbi5TPN4d9KfzMXnmoFBhMrdgw0afozQY6pgF80An8quXe9XLbDZYHqZUxhV2dzftIYac8iNVkz%2Fe74iVyPcjcGxENH0oJLpjyXuAA7cG7%2BhEuqFrX9okkyznjr%2BS43cueEwfMYjxROhcWTjlK31pkCM%2BOgA6egH8GbutQouklyPTnr%2FHrAcV4x63qP3%2BpDnY16FfMZRe3Q1dTKT2hkGThxZnIusddkBo7pivh1mJWKiodpGl7DnD%2FcBaye55qwLRT&X-Amz-Signature=5615c0bcb94e31be07f02f071c7d712d2e9e4da3eac17e2797ee454e68604ce0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=46589d1dc12a7462c92d5d97379b28631d68cb5d852f1fed4ff5015e2d13541d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626HI7M7S%2F20260318%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260318T032111Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFRkeLGTFMpbj5OzgizK5i0vvaLQ2OjcpkFoyEnOqyq1AiEA1eJ%2BHHmGWcIJ9k65bSHmrbZIeUekW6QmengbrrGx5oAqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FLJGq7S6000%2BDWOircA54CQnhEtQejbDM1a5PARd6YNKaQaAwX0CZxvvXKDdj9ac%2BFk0wNawUDPBjFVd0xSCJYfbJYD46hCRIntMJJw6jlKX5Ikkih2Re8JbjV1mI9d8ahnbfZdytg37513kMLByxxBFLuny2BpEP3MZw%2BmbhkpEyxS81mjnshOeV%2F8vszojJhhx%2FhKu2%2BMqZHxO5duWuRioitgnQvtospLKBFVe%2B2dOBnVQgtWF5cxMT%2FmM5bbOyZ213uYW%2B57gI1iM38YxM1Y9cSUDQQhd%2Bivn4GMQuXjeCGGh58sqI%2BeZrR4FnK%2Bzt6D2kCBGuuUZx6wUlP7LEKDTUkayynCaIWIjg2MlIRnkWuOHxY%2Br59MBBi%2B8iro0lsD7TSVClyWRtXcCbNf43YleCD1dAFwX5eGRrIkeglaKfn45vm%2FXjt61o5couEEk7hoADT%2Fbo0sHZ7cxXms00WyurNulc%2FuLv7qDhRfeXn%2FQgrICOfhqG3ssJfh4EUDlBsYrXqgrQ875RWZHpFXoewRukm2QwORxGuC4BVOEWmmecjZc71RMOZLgBsU7mZsUWXrdpDhH84tqQwIsNdJ3Y18yZl%2F7zWxXzSPykRsefr8KYnCnCpVsw%2BKQRONMCN8j6NkkPDhNBq1kyuMJun6M0GOqUBnQCkKyIWxC2dajK5XRrrGejHbpt7bcPJPMRFH31L6SUULQPNyFrWcLOTV%2BzbyslqctYIOgUbRN0d79ICWXQmcXHZir%2BkVhWgjL0HN4dfkmuGorMG00ZN6VaVSwp0ILqi%2B83ONBEc37ZFI8%2Fj1sDxNir%2Fz9cHHn3iKedFDgk8TWiwEXKoneN6uwJJIJUrDPL%2FumTnr20e4uHNWq0AS79op5nRDW4m&X-Amz-Signature=408f450234b38b9ce97566b9073967632849ffe030205eaff58666361fd2ce5d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

