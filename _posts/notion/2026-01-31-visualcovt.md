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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=94e11061763b85849aa3f80a91285487a5e31d99ab79074b9d99b4182aad1734&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=fd4aab36a7103c43c58dc50cf13e581f2d38b919d6abc183de1381392f694834&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=9ebc0da2cd3e672cd9e4bb80ecdd1f450d4b0c7d3179fbe79cbfd838ace8d202&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=a83f12bf81ed8c35abad3de23fe6c965cedefe8bc0367131b6a63fd74a3eff0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662YTRHBNK%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFge%2Bn9s8YvuyYeHD3G7CSEbTC13mTb60vPZKAH4wxDCAiEAt5cs6YE5qWNdqHOsQaLb5LVZKlrPSTkDi8CRvA2xG98qiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFwDdZGeaAAtmM439SrcA0gl1oqrsKIejTabSvwgNWH%2B3%2B%2B5srDBchtmrudIrHsbiuJu8N5hRTqdmMxYHzD6NZvYz4JUVTLnzqtfuHrBoZqBdSu4G%2Bfr8%2Fxuzm6MT2SkHTE7fSKTY0XZzHYlKvcOY8rS3LzRVlIjFQdBLuee5R5iTl3uR90n%2Fy3zKog2dhbwJVWTseIDaH%2FBnJSN0c0A52Tog%2BwgT29bh%2Fh2C%2B%2FJEBsmIpFO4MtO1Zu9%2FOHBcHPOmh%2FPG%2FrG%2F%2BM%2FQzp9AL1jE%2BLFiD3HEhSH4MteKLGtvYu0%2FlSLUzNkTljx9FxJChwgj5gMIvCbLrK9bUjuCQBlXJ9drZuJNNpzoeYmXR1qr%2FxGeRM48MiwoJ%2BQavmFGMNl3YSKFRBdDEobNbDDvShYTA0mc5S5LTq2Gz5MYQZzF2mSbxFmSpTFxi5T25yuTPXCAZN2563TqNMEA3PUmYXVIMpxBc7ex9FUiWGDGC5GyPftTbnmAwEihPhcbkoLNZxQuPOpX47lYWZ2eAEVPVtMUolGAiHQFQfUSRkAsVuyj55UB0NwF5TjOhq5Vk04kq90DL%2BCP1pKriczx%2BD%2Fi%2BvZ6eVmHT1uEnRGD%2Bds5eyoKIamwrqhqZBOPyYfCus2d65Z61lonuZu3Dq7QHq1MJ%2FM6cwGOqUB03508YiEscPP6TSAjaTUat8JKpPaP%2BWXUzxojqGwtDQMf%2BtHmC5pvrK2h4L5MUxJTMNLoJTBFYpbAF7dKGXKvEkGkSFCR95FGF14pOEYDBLB4Xw8MX%2BbJh2poRvqsOwAqOQ31ts%2B31Rynr5JSQZt1yBr%2BO24qDcd2u5Mvp4OrAPIEPHIpGulG2nlQuDA2fScDAySbEIGVSIjGhMMLwVooP8Wlz1r&X-Amz-Signature=8f9f921909481a156bd858299eb00128054da982c9d8edee79f0ceaadb64f748&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664TRRFCOV%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031611Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4qoiyFZ0Sg0ajgVK275b3zZQv81qth98CFoPTCRO8TQIgIeMlkFJEWK8vPPuyu2yoSwSQWJx4VAJGCTi9p9xkT%2FYqiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBDo7ZHo%2BNG5PCD8eCrcAzO9Vd3xj0XopPo8BWLoMmscutmVgccPDJTxmpDVoCIAbkSri8yAdSOOJUuF27zAB24E8PAcfTg9TSKcGMnmdgDzOKFCcggLDFgoxjMfOWgRHjrUp9Xi7xtBxvDRnNQ9zIUJlG6LOMA8P7pVH6mqWDaVDrDHh9GKTQ9H0za6yf3yVEQ94VF5g%2FieLBDUqTwG795R9BtbVc1wY8g2CC%2FKtQ0UuEP5ftDRC5IW%2BMHyMiqZRkMdU3nwYGn3b1lqSn0ZllSR8Hmdq7Hc174r0d6jvRtBz79BDSvyfoI4%2FR25SWFDzOF9CYWo6%2Bsb6u8Fx70FbiwftzSMefdKo2chfPqiskJrXUa0%2FfKCd%2FirmV2eMP46EJX0ROD4TcPwCzlf1NCQEhT3M3T945mm05V2SEWCtj8ebofCUyHLuLtjLXNpZf2d3vHI%2Ft0bz57m0OmzwXigzsnbPp9NkK9tykncN5DP2fAHBG5NJeAvpwBlwkXw8VfsU1OLUouBoXQC7zGPETUaHCH0in63IQsPMer4tk%2FUkofU862RdKWdSHWSlhDivBi1lvM75D5LGE8cbciwrwvjXB46NdJ9AICQ%2F4Qf3vLpgHoaVswOkTLFEskdPfxwtQWsek9PVxHCZu4R0jE4MI3M6cwGOqUB3QPaWYq1hyeDwuHJZ7pxzDHyb%2BeHtIPgvGWM%2BAsReFwlombds09Mg5DxN2hNyj%2FbaVSPglD807%2BeZ68ICOn5Jt2iqsqVs8yPEyPpjDbiqRfD7RLLClkXMSNGyuWtV2tVSsp4y1P2aqR2Dk0u71IQAdTErbvtmzqM1TMZz058yb6I0V019%2F3TiSUfmT6%2FZ6tJZUkDpPSjsSB6VRsozjwSu0SQobAa&X-Amz-Signature=23d9aface5063e2132c987bcee2c3dad97749a31f5f9ba67d7c3e5a4553ac8fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664IFA2FMG%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDOQMua6oCrIMbFbgpEMcqLA6gJa0WtRDC25Xl4RKt%2FJgIhAJl0%2FdrMBzaPPhdhpOy%2BfOdhmOBaZjWrJ7BBl1zZiLk9KogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxCxlcCyFBt3vTAco8q3ANbjaYehY8QzwVqxN87gzPSaMmNfc%2FvalITpfEQfpV1wMzMsV4ergsq6r3Jh8bS173k%2B9xaPEiPbkLrfE1LVWlVIaz1vGStZarvAGoK2Moh8rZTPvr6B72jlGOmlOsFV%2BXIHryw1wm0PtdYLgvbWrg7thQkdevL6ZDNAvk7gLsj9qb1BkkgNoE8QeQgmrYScT0jjrOqaHFUjQWOB0lH8KfGqn8O1PblBUPT64bqzLu4hpltF99ig3wjn2YIArFKcORVAttjVVYGBXjkihZmOkmKhpcEi28O%2B0L4%2Fh%2F%2FWb87Bymh4hMtSAZnHdt%2BdgL6ZYebEsPE%2Bb0j7J1geCm5L3F0OZ4cYvZ2gM7vB9xSA3wPFtHKqgUpeIYheF46pY90vNZXVtUPBCX7eQBUHhrEqOH%2B8k8DmvAI2eO7CfMCE%2F%2FdG%2FjHX8HHL1iNSnj8FJFMcazZR8q4caQb%2FbOR8wVau7S9Gt1eOIjBz3CLwQwYRWJWaudIlqvyoUQfe7D5gzmdT1c43Y7z8YdurNHONSSoPy1O%2B0FAgweUoRau24q8vPmkUj%2F0VohzSCZA2EHASMsg%2FkMpAqQz8p1mxeYjIB9bf6jnAa2CigWVbGytfpaHT2MMiY%2F%2FZAQMfxWelFd%2FtTCvzOnMBjqkAff0BqR1xk7GBimXTBBV7123ethppigdx2dQWhQsdago9tRhEaiH5KIuis5aeL4B0FZjTYnzUA%2FlvcRLZf7XtL3tG3qab4Cmqz%2B%2FfmehBZCVsKJqbgTW%2FjfpPWb49mR7xRUAnbg6o6ghSkdEN8zZRKhUXFvtlQOiygyLllgS4whbR0CPvn%2Bk5%2F9b5TPSB1S1pDJiJ%2B6l8jG4W1Y8BqTFIYmThavx&X-Amz-Signature=66af89ecc7a4f6873a4974972ecbb26d786d4240b1d23746b1e807d75798a623&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZUWQ64I%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCe9wBgxCeHkZgnvSfHj6mAszevUSMDIPYSbZXTk4Q8WAIgImx6emOybLazDwK%2BIvMvqS2%2BLgVfD9AVJn9CD0PkWmQqiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAYAIu%2BNk%2BxYxY8MJSrcA5kgt1Hf0YUhm05gHJEEqu1dYgd5Yb2TEs9aDAn9UDsvpBcfmIrTcJjbkRvJryeFg618%2FPMMcgl1R6d8QmClYlo5N6vIOq6Osriw6f6F0LaIGXu41ZQDZGIWEv8UhjEVJ6Y0xBgu6tBYXs54nSztjd7aJLGsqc54kpulzfrAjYZ4BZlJw%2BX2Vaga0aayz9CjyBgbRbz90uy5SxOS9ZpUqfP%2Bzl2gh3mYepq7djixVPyZRTot8uV7yiOVrnNEZFDYOxusOlqN8N8XyR%2FNCyfCzfiUM5hD00EVzC66eF4Lpvcx0HVWz0fT1k4eyvIHbSg1oZAiGc8p24%2F3SvTzQYaE0WHvsNmrfMwoB9ZYxcqZx1E7RvzbzwPRxxHN9owfFcB7ar%2BIcYCtxBaV1zOmOcSd%2F2opgjm9CUcDqETDpv7ixqAVupgDgFxRVn6v%2FTAXc%2BMx8cxOIEC%2B2c3XwrUnHR5A4579U07tWEtxWv4WNMquHDkoDMQoz0AQqP%2Fv7bHfciCqmSYb%2BMBjcQr5aQO3kzcR8BrfCqICPXJBU2zcBdUXbiQpfCDzusqWU5ktyfguNvsKINxbJgsxLTA68G5vS68R0GqY5IoVaU%2BjECMahlEoL0LNc0lfAZWlSUTtEb6uMKzM6cwGOqUBIE%2FgmSVPUFotKk5nhV5u3JyjsaVgfe14pCwPfNid%2FGZ%2BzYz6WwVTMkDm4Pv162X52x7Ct67ARrBTKsk2X0wKF9gDGiCVAqg3dn%2FL4rLsVXDsGe6Q2SEvqP4lw1VAy7Swk14AUp8SjbmBcp%2BRm5jWtgS6mKxidxMjnSHojmHwswetveP752TdsPQlDqX8xziTjAgv1NnEE3iOO8lyLkZmpNy56hzf&X-Amz-Signature=dd1bc30ca596a21e5b16f51722e7e8edb0c3a34ea7d3869749b25f8d8fc560f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=eeecab365c510b231900e57da3b71e440726302f4c99a9797f5cd8d171e21a51&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=52b6771eb7bc15d8cfc387864a9b3b58f439a0540a1e3211f2ac116146d0929a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VH262WC7%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031635Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBp3%2BLDM6gZjOhV4NNmcAkEJLyFNGUzQKI16Qfp5ssIJAiB4s7qF0BS29f6lnRcIa5GB9UYaMm9ckAB4IHOzxoTFxiqIBAi7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMa%2F00leiG%2FWWWVfH2KtwDal80CeZMGM06hLcChA04YW%2Fe91C%2BdgJRoV7ErRZECCW7XIymldZgPh%2Biip8pAobB3rOBRUMT8dZwisied6PM3z%2Fy6rQ0tj5RdcBTKnfavyBP59LhYTzCkibufZ%2Bsbr4ZlJhpOdmbwdVBeh4EU6XVv6WWgND2FtTLIbSztPe6aChCl1oxyEjzfi1N1udm6ohjtHj5sqAlSXpThN6h6pSGXJRyxON0HGOzNejcuDR5UAPl84MdkVpd1tr2tQrOURIV1LmcuQj5S%2F5Ujo9nyupgjXL9T7NKKrTaK83gcKkNFTJCHu4xnZSy6KiAwfcv%2F%2FGVwQf20CO9puUExY88QHh8lhvX%2FvxCtDuexhjSu%2FmobvmS1sXqPTYYpXvP8efolvmOpoFMv%2BAkD6nZZ8E8RHg6wWyiKCmR4JjVrMro1hMGouqVELn%2FrVeLERyxS6OZ%2F7uGTNNKEp3jUcU9T%2FH5Z3cp27XvQLDeoJ3L%2B%2FT6td46vTHpvXbRJPshfMGX7ILG%2BcaLAEHuWjT1yhfCzAaVnv%2BVYDwFnWFNtgIcfx%2BlCiKjwHBE8OfO235uq1Z9aJEcC%2BQPvLqJ1Ek1JlA24NSLeTOPnpkG9CJj687nwSkHb95PEgBApwl%2B0l8wa7Hks5gw7svpzAY6pgF4Prd0LAdv%2B95ysG%2F2fLOXcIAW8TCm%2Bre2TbHzcsbrwDMuS%2FR9sNh5x1UviIdbwxIHULZynfXx%2FH%2FlTyNUmgxly8L00Ut8YDQ3mNMG1q36QLzQGmZ6eQkg19bqf3lYmF2KsXEGHIZeab68uKs7JPCrAz%2B6LvDC3Cm79tzHpL3KHtOtHWp49%2BqDOXuE52cKZmGHnipEOOazxW%2BcW8s6mD%2BOS1Ju0y%2BX&X-Amz-Signature=2257f9e842f582039f123fb20f2338f4ed94589417ea5757c951c7a0caafd328&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=eadd48a64331dff2651c752fb4e9258aa4896eb2ffb4e12d58f31e3fb8e5aca9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LA5WF2X%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031635Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQChp2rMHXlfPqTzsbwNaENBqZZAhX4LQMzyzV4BhaPUjgIgeECmzJxSrMo6zDz%2FaicEAxNCWt9o8LxFhD02OK0ytSYqiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBixqsX23Q3o3qoJuyrcA6uqxfQx3r8DmwdaB7HCa9dw0wQU52b5TB4p9pD%2Fxd7WvFMR4thNdDc8CFrrgJqHQar0uE7%2F%2F8RakR1jNqjc2LKI57nwuJCUymM21CYo%2BycZzGYOIZn7JzQipiMJhgOtI%2BLDeLi7%2FOGjYcsbljCKi%2F4L0%2Bvj1oqKAevZbhyNPop0t65XOJulEE9bDG3JQVYQ%2BdEZxbYicormbkkCIICDjGUb8R%2BtDIZcW4jRYKryd%2BtU8rZAwjcO4ta8tE1M8sgU1h78dxtprgubiRdUcKfq91D%2F%2BzBqHQrKOUHFtZDoQEYDX29LgmQ%2FbuZk91zKBMhcS8jotWumcvu%2Bk4r8elwnHIrnGD%2BZAbAkKzr1gMPifNLtouTF8eAPidkn3xIP7tlPHq90di3pAAfFpQI7czs12KVR9MMexdt3Fd%2FMcJhcL6KVWjc16nI4ze4cneNWQGTfv2LhpCcZcZJsZV2JgaeXolb0o1lKlrJMZduPsHdYE3hRduNxprz8T6m5%2FGj2xKwRERH1TvFbeZ3ELKWriejSf%2BptMrsO70wQ3AMYjIgMt%2Fe8uJqc4MwCa0MP8aPOQj%2FuwUdBHb0cHEnvubBLBdY%2Fkc39jTqdraIPahkQDMxof%2B5F2ECF%2BxOpSF6qE6fOMMPM6cwGOqUB21H43FZCQdfPrdwPDRZ2XVD86uNwUURCUZ4OUIuI%2FEKVJ0%2FEilVMVUxKGNMp%2Fhy4s2oRHNLzx5kOcT3iTbCfjEJha47c1kvf5QqGE61B48u%2BEyustDqutv7%2F6F4r7gowszsg0ibRsXygp%2FLCtkLH3u%2BTd9GQYGdNyJNl4d%2B3SuuC1HrNMeTjwr9jydJm655YnHcfVSgcKxe2HlDfdmijHHPfDMyU&X-Amz-Signature=59c86939c1d4e6b9f68946c8c4ad7a0edb7195d25ef295a0ca903f994f46adca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRVI5WPW%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCr0yGHpLJnDXhym%2B0QN1GKxy%2F0fwWVjCb3nWfQhrRMVAIgZb3d2N2hXkkVl72FaoeMEZpBtXsZM5ko9uiIWTp1EYMqiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOedoTtxX%2Bb%2Fg4P5ayrcA7wl8N2%2Bv1iY7sVN8s%2FMOWJyusXYjLTgOlqco3w2qUC7MLaeViaGLu1fZdz%2BhloBI6E%2FfBtVsBcv9yNzSdUb1MxlaVcuWX5%2B%2F9bsxr9M%2FjYDX71nfT%2BU5fGrWVaS6t0HUuV6Q4an7MQfbXRONTJAm2tGHeOxa17XGr1L3oxV0PDLAgJ0BfQ7nyP4izrjXbs08KNLtvNVNxaRRfJha5CuEygfknJm%2FJzsC7zemZ%2BrK2h1luYjdTbk2X8lO%2FDBTGZ8wXCKWoky7QQdIjUqxZQO3CnNJRiQi0FdcVG9BsQlrCQxA2%2Bl661MdqwAr8s2LBHFL93lB7ju3BxVgoC27XGy2bBiqmVB1Qo6Q7MhUTXOLwxbE1FM6%2FibskIEE6rEDDdYlz4qtNyJLfpuUMr403cddYMqMXBmx%2FgBxBAi%2BeSs0ztpe4prywsVQAn2Cws6oi2IRami%2FEkzP7p7m3VQAB0rdcWRQV2MdmTGsioQI%2FteoP2rCcIziPEjkwLwHRtspAH4IyMvFYW7YGFRwim4NmbRXc7dFnKcUWH0lrGHW8WXuRluSOFMuy5UW6IN5KMIBDZvknULC1w%2FC6ErxP55QLJnE0kaht8XU97bxInGkDHtSqDxhQ5duD5F7S8lrhxMMP3L6cwGOqUBzErcZxQP66Y%2BJCa3tih09zMjjJMkhS32%2FPR3HmOxusz%2Fa%2BOD2%2FVzbO5Kt3kr6WeV6xbFDjivAd7N1LgslfGi%2Bu5fbK4iu5e4RHiBAwm%2BaYkAuy7N1OjXtIqrZB5BLZfUJc7QEFQHLWdQDTMmB6ysGnZn%2BB7l5OdQtKamG%2BNwVuW1HO2B32X3DP0%2BnwuTUoKcDKXHQgJVU1ag6c9Fwsk3j4a559Mj&X-Amz-Signature=b5e3aee409f7eed8d993e05ea354781791d0055d7d2537a8aaf593cadd82a11c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46663YH62CH%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFi%2FGeVSMHx3fIkFntOWsMkJ2m7D4refELI1wJBQpHD1AiEAhhAozshcaaQBnUkAptj4Rku7OpunFbbqeNiXuo9DgZkqiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBuql9RlZafupZIFcircA%2FIdMF7Sp%2F183eWNhVerv3%2FldtV4aJUYIFR0W7f0venoMOfh%2FlILVkP7Twu71%2FCCqSzicL6Ltx%2FN%2BysjovqBTCJsp73azqzaFoFZGuov6s3ixXYscit7iGuzMBcPrea1GNe2GtNM4YsYALtrRC2UW2PcK9PzCFM58vtWIvMRTKXeV284XaE0PysmDJ3yxxLbt%2BO6xE6V8RezxaX3OkjF7N%2F6PV18eUigrqmA5XKEM0oKwQizCYzqsa2Y3cdskZUeGQZM%2BP46%2B9nBNJab52SFqAWvomcIojVmmUQ1t1va0XaaZYv0F2wOpg5F7IjOnGN3LE%2FJbLtIp2lliHVq72dP41M5DqNMmXq6ogHqzSX07EzuArphKMtjAzEurL1sHYn2ZJMxCEfa1LmZ5jYI8pM%2FEasXE8%2F%2FMrIKSIFAiNoHZS5%2Fi59Xlxy1OVxICoHXPg1M1TNRiwMhvWtsJvRA6bcQwqQWfXjfqfstELbpmxt0ijSh4GCVMdAo%2Fs%2F4hNrhSiWRSAAUA9UUFL%2Bs3dNoJhx8BTcBHHHzYdZI4kxkE%2BMqeUjhCJeBDcKtX8Jp5n6oq1f4EpFY0BlxMzmmb9hLGoLlD9HjOsfld%2F8P0nQLcIMleDj8E7mOzENHgBuwvTy%2FMJ3M6cwGOqUBtjuXi4t3PW1kioour8z0lWpdFVxJ%2F1XfSGearBCoXcaemAglm0Z5gxevd2WKw%2B26fiMzLZckgXsQEFRKSoMkmPynXWZKp3QfJlDeNvGtrSwyf%2F%2B%2FMBG2tyrwnJ2w%2F1WJPKn3UMNtvjwO4NlsvwMVCPdNhp5BBawyAPtRI6Yp3Bx7SYCRjq2qUL0qlIPBzSqOrtaY88gs%2FdmqRmw%2B0Q8F%2BVF2hlDY&X-Amz-Signature=ab875307631fc1ff9a25444ad97186b9ffd82b70d62a9ec94cfef6d98d6d905c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666KRWWOXK%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQ6dCxgp19xCJu82216XkXco11j1g2TMJXeK9ohJhfwwIgf8dVZv5ubbdQoa8qCtHxe3RRblgALQPsPe9cirJNjo8qiAQIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIoWrZ9fHxyu5yEeCSrcA1s3y6ay1B2OJ7UKU4QBsSCXTP4k11E5K79h4aT7%2BilHrvwLrreczl9uwZ8HaM8wImGTA7MRvJ9dMwoDJtEM%2Fuo0ljELBunjWFo9TR5wCcdxCxzkuySwumEB7VDYWM4L%2Bnf0w4RGATgVib4Rk%2BUFvEvZZr%2BrwKPn4cpMn%2B1aLDi3eGkHRwNzyjKLzMm3WpCfky3%2FOtQo2wBTWvL7YT0vXn6Hlj151VxKz4lt2LPLhTxgUzy%2F%2BZta6khyZHkp7v%2FBXn8uyO9xbb7%2F61QMbTmLwxWaMzxvKK%2Bvd0VGVDREdpu%2F5GYWY0yDSAOzBGqJT2SUETZkTDyPF8WYI%2FoTIT2BVHh9xvZcBxft5SJ%2FJmo4ODJ5tL44AAAahMm0oSfurm3c8XZf%2FA8Va%2BkTw5%2B4Un5eb6bLKINKC%2FQdyi7p6d4G5sZpQpBa2XPkVfI5eCt0yot1jIPvMJOpwggUy5541oQnobK13K9rdobFFIUZswKXQQP%2FYWLK9EB44cxGqnOVG4BXss5CmsFleVD5wALH7GpnlIUnU2UIjNCtvFoy23lxhQBk2FIIa6QD7KXUhdSPzVZwklF%2Bj67t0DZ%2FVov8rvx5MPvku2%2BW1qULUreJHbJaUOGtE40mPx4iQ0TfdIddMKzM6cwGOqUBWhsb1Mb6QCWr9Tx0Wct%2FoCZH0HWTho5UQvYgM4GCHR82jtKyGRYeBbj14%2FM0syCnN%2FyTUmmQAPijxO8%2FsigeEMXVWy9BAszfle0MP3aNy2ClW3toZ0dXDD9XupZooJhgrF904AAyndXh5f98HlypEueID7NqZc0pH%2F8l4M3aCxm4Dn0h%2FzN0syyDYpdYoX2yccfRxyV8eBSqFMGMAVSOB33VUamp&X-Amz-Signature=1538e72b6fde5fd503044b07abfb91715c4628290c279c0f8482e18281125394&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=839e1f018a8c882ac8d2e1e1d12a53effb145a1ff482374d7d0645e25c76cfe7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBGJU6HZ%2F20260222%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260222T031547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC2ctyyAJIzIvMCjSlfP2xCeSk2Y3H4Emw6mthXzvffAQIhAIEo22hL3H4MiSz8hOuV%2Be33jZk6u5zJt7jhXdf0QKfGKogECLv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxvA%2BpGDOmCLsxsNhkq3APxbrxqO%2Fq4jQQn6XccMqx0GHGAl5atctLoq2FfjcZ92ktzhjIN9ZG9Qzq7R4vGkzRBOMlJNBAW%2FWRGEGhY0OvUlmGGjmHGL%2FS%2Bqks1QIeqi5OdAeH%2BP3rFhsDOUxaSfv9QSEaioH%2B5B78idSsxL6yYoIZIf7ib3LkxOjy%2F5U8Uw9elzryEGGqLZ8m61gkCSbIYy6FzIJ5vD6UreJ%2F%2BXS95nLZwNYFEWYlFirBEWhZwfogiC7opbcFuQ%2Fl%2B%2FmC4eCEaftO2ZRypue0jcpoucY3L7HHIae%2FJukrCU%2FACl1pVnMYA9AtLbKPFohiBXLvskG%2Bv5cv9RIu7mOKQXFuEInvv3YBwPspwdDj7Vntf%2B0DWbSX1qzPRm5KFn29PIOfKuRnh5aQQxyvwCBnWZ9wJ9V%2FZdPJigkkqZMRU26%2F9YyKZwZCSSfZhc3C1hO1SRcojjAwWPsgDh7DiUNs2et6FUAazpVKWT%2F%2FWFeAQ6ZihXtUzJAT%2FWp%2FCzjcBhDXBzIdXh2fmF8Mzmj1ZMHclard0i2V26vv6%2Fll6XM6uOrRbORXoEVe9TYPzRwfC7gr7qbvI1JYkBrtsVllUmGMqYMCjXCd%2BeCsi8UTEoy9pYM4XY17Oq5CjiZTKpEAnqUCnjDC%2FzOnMBjqkAf%2FFUsdRwwuaSUkRL2yK2NSGxyQbYRUDFanydpDaioscEC2rLEulTzjNU4AhkgKrA3r4bGxnmA6AB1J7YTEWQOSI0D2g%2BD%2B73MMt%2BWJopfhNj3DjzVx7IrzTcmzItpNYWqsq88%2Fr5ZPP6QCooCDO9GyMWMfJ4W66voQQolHT%2BmtvS1CWKactTIAteK95NZt5mFbZnozTpu0gZUiLcmPPz5wDO3xx&X-Amz-Signature=6b65de8c8f943e1b1c28ead206fdf45b1117b72fb93a1642a2d0af28fb2c494f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

