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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032822Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=9ed56ea748f8a64f7e7d6e7806b8d185134d7c83e9831c2a72123e2743b16c5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032822Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=91deee05a9478fb6d4d9d00f549fa49bb7eadefe37f74dd6469be31c75e46dbf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032822Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=10f2a4f88c40b4870944d3845237c6db89d7fe49b4a286c0f118626f9e62c831&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=d3ef35cd74cc6bae241993b6aa82f98412d68a6b1f76a928b29e116a4c5e3753&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SDD2PUMQ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032838Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE99GlBuVGxKW8zMxEOfsSQrXGvSHSHvWtm%2FjFBQyqbrAiBrhtuNH%2BuFJpfh77%2FitPf7MHyQHwE06Km%2Fl3TTZfAhgir%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMk1U8dFl1DkA61M3OKtwDqYyyh6uE38hHBywqUe9XldptGvHL%2B1jSodbC5pt4piTJbLVyJz7vnmWGfNAqH9wGWMV4TK%2Fh%2F7ORK7TDs%2FnfyMhd8uqCQrTU1zpNKC4hSvKq7HRH%2BKfBxRLF5Lclb%2FdluNj85sNB50Zpu4Yjo6JikOWXEfPMREKMQLe%2FuoGZApmKL%2B1Xy2Z0T4MCO4eMbRWv5vEAXgGSi3haLBvtS6K9wj04K1Qx0F%2FqDzQqM3zy8w9He6Pu3PzsmRw7RjTH9Z5o3YNku809QXt53w3fj2%2FpluY2y0VBO2OKYzF4QfNRzRUuXq5WldUxgqXNQqCDr7tuSvhoL45CGtJQdetjdBnRHmhJ8PXXIm%2FnmtqxnS6tHPxJu%2FJYlo5Gve9es%2B7PaE%2B8YTqg7K5CFp9mAxX6jhg493ST3Aq3bMPsKLpHxDTU74jVQV6OrLtfGq%2BbfryvALHPJULyhtKgdFpXg16qwaKHkUVklydfyvr%2B76Ev4cH2%2BKpzcpSfwlgQnfj4KzTWztwT6M4vyaqKIExjfcSWCufqkhsEdP8v1FfNSq15C6cdvOCqePVYzP8Z41nd6H4Eb%2BFIH%2Bgi4qgiSyQ%2BBp%2Bl4xiSBdmz4tqUU0alQs7u7hPWd02el%2BNlO9bQo7V3JVMwt663zgY6pgGnFzAsSGstW43CrTEO25Oy00KKzTce2GFK36c%2FDwU%2BxjVlkWCQebd%2B4DgMN56CAVVyKFltqKH8w2vJmumcdPUcRGlqGNhfB2uTH4J2%2BemFUrJOcSfE5GgtyiwLFCAStb4qdDb83rNMqRgeTMVWKQEe2QGyMGSJFw1KaYnmgggtRzeVfKifS1azDs%2FARaTvUB5QltW4bBFk5wYWWvQ5%2FYb0pGTKSxXO&X-Amz-Signature=b66f3553a9c761fdf998f58f68c204b0d6c06d9a681e42647716dc097491372d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YT3LEEVJ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032850Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDoCwqkq4sIgiixWbQBKnF3WhSrfsLMO1wD5OLULLGrrAIgJDJntcFjGAC%2BigD6rSWhH3MUf1CUU4H1wqU7aO8QBX8q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDN5xqf6XKRIID9%2FrDCrcA4fwsBP1ZlTODFFIsJHwW%2F%2F1GjTgcrInztpng1IZtgXfPIzklD%2BTonXfSkrh3GeECSHLbZh9aH15NUMCkQGJUJzKdtnkUdbGPfRbDuVcyeCncvxfu72xoFJvf2NKMWuDOopYHauM8GSBiwh0BSOjjZm9FaDSBhbmjqwuzNSwpGAoiev3nBKFphMy1Um0ytV1jk0VQpc5UflTHUt1taXkRQtU7PrDqXjS0zZnJ7mfaJC7ze9N6Uda%2BbHsT1%2BS6W3t1InQRsn3tXSvQP6y6fGFpZlhUG%2FR5WIX6pp4Rwviwf%2BdjADLGPbymXCQS%2BbQBBoIr49CjalRet18%2FcN1JY07Y3L%2BRUbXdUw1PMIetsw8vSDzsResAC1k8pqC8h0B48FMhd8GX0nWs0Pg%2BAmABK%2BS%2BSiZpYZ5vgywc5%2BrmqXWFbSFT9HXxTYTS%2F47GrfSayM510qiU6g8KVj1eXvRfzwTqVF5A%2B%2BYUd5zl7%2FLovDycqTVB14C9TeKkFjvLWAr6lJOlX4j5D0A9l8pmYHPPsBVEOTPUDpQzkMppTkXMvcuR88d79q4eln0FWzdE9LbY%2BtAzxeXTjgw%2BHAeyOwdnhUS3oron45cbec0gfthrZUowNssgM%2BWZfsCqm2aBKrJMOWvt84GOqUBhTQXCs6nSo6F7JQJXAXrBuh36or9H7NgZB78rakA1Zbk3hdmg5LAsTTIWlywzy9e8arJCWbyeFj3S2%2BeCbelYFAs74lZ8ccCG0YlylreidkNKo4ReQPyHifYrI%2Fv%2BPzgsTpW71KUrSHR5ghCDdyvbHdBKWSYUJ%2BDAD6xQTf16PMh1STipdz2Es0mXLmgtiowQYhhdKLf3MWcPGFWkmEVo6Er%2BoMm&X-Amz-Signature=7fc206abb7d620537ad36c6e4e4e93f864485703a3cf2113237549c0a15c269a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673ZQCOMQ%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDFw0n6LYs38EtrTGmJlhaV%2Fd8gR4T28mFmB%2FOU0GK5agIgGN0PbqjgBMVtVJ%2FqRC%2B7YIL%2Fr7s1t7OYhPlqlHsNrucq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDAEAAlDaij50ibGiGSrcAx2Gg3gkhxnE2R%2BbO7SWB6KTiz61t%2FLkN33H3LcscgNMUetOE%2F9kDKQHm6P8czBjqKqSs08pjSzJzeny8JKNWUlLDbkkZfuGS0vB8pR8jSHV63I6XCdsNSkLDNQUrLOH%2BEpfnEaV6lyQJRrkeuCcXV0x4IgkU0pmRhtBDli45aHXRl5%2FyaL16twbae%2FJVe0KSs1OXl3sr%2BZriS35HtQXZhNUoSCB%2B14sgGQ2fQUBhSoqRzvnnVoHzSVNgZgfjqtd%2BDVfXScz8XBlSH4NbZlhw4vFWqeWk6kK4yYUdmzVgLIUHn758fxc5t2V4%2FqAoh%2F1NYZwTv%2BCfnVCTsXeJgISIvP71rdfUqVQbhhIaVQ2EUOLrak35cX04JBY5YshJJztOUFHv21XDC5DSb24t%2BWYqscNcWfPxw157d2veG0rMb8K%2FCB5nsKKx6cXzax3RyiW3IqjKqYATl%2FV7zaocaUrLD5TGpydU0%2Fyq%2Fb2qzSYMxEYbyPQcWXW46n2H1zfC8qHG3X7HVNEIpwbCc8E9mqIpXbaeheRCI4w4W%2FVaty9wE%2B5YH%2FSGoTMhwzIqXLTOn9c28oez%2B7oQZ%2BI%2BOvIRzdk6R8Ft65sRmvQNMcT3GhGZZOOkdGViE7IauKj65pkMIyxt84GOqUBcKmUB9HKpt%2Fam6ZGpVT%2BZW2hnmxFDVQ%2FxVXZSQdO23qYI7W37Wtn7I8IBq6xLUZwTWVKf5ISxGa65oyq98vnkQikJoJtLKXq%2FwHftQ17iQYEwgdeq35hoPeIXFLY13vU%2FAtXbcYpG57FZcyMpGKDe14js2G6RE1EuI3GkFAtVqhcxwODtlQDljqcwJHeKpw9NdZvRHCP3zeuxIg76r1hKFYCrEJJ&X-Amz-Signature=9349a8870ae688f2690cb3e48e569eb7be992c84c561bb1c34b7e367b6179c4a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46657Z64OZB%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC%2BMQfG7K7aZ7egQTrN0GL6Vum7%2FpUawnyDJJPgUF82UAiEAlUBTPJTgA%2BMLk5Bp86TYKdQI5Pqi2iNt9Tt%2FT1e2ZOUq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDIK84YbkiecqHdqDTSrcA0Fb6n5lam1Ql9b5i3d6LrbcYPMzDObInQ60l8Nw%2F1b5l%2BA9qjh2cU%2BLMcTgvTPM%2BVIJmkK5HY%2Bo6UxBlSL0BHuotZVqCs4%2BVDqoQwzg9i3Tm6CzZog%2FKV62t0PZZ%2B838BoTXJPGRP9dtyjxMio8PLW42HIO68YYBnzyv0vxPsSzKUU15ZxaD2RhEN1QcMK%2BXXFgJqJ1F00Fv7znvjrm3JPXGjMRwnmdYjrAcnihVsMLH7yvrWcmP9GgVMIOz8dGNhkMY0tHzH3TllskxibxJkfTX9l2jg10nZ2Xe7tLMnegwfHCIgj3u0sYVEwXNS1zCtGftTMqhKemdfM%2BNp68wM2wBBjjSKA11Xs9IwWMPAtLeK7kuNxQIY3jyeIO9bEkBWj4SU8L0JrlkcbRD2gsUjvA4RmJrMiOnnpnmUqPn44pWWsxa2THYrwD5HCfUQ6sVTAqfAeOeYJ%2FcCYkYbuHudgBpvzMh75f%2FQxdvnVGKeOz%2F2pxbH0p6xMMWg4hm9ZTKYVD8I5DMgO10I0piCPivljFACPYOCOUuSR4T%2FiAe5DTkbPCh2Npu3cYD0YACea%2BU3jeT5P9Nz0xZYLnIsd%2FpIEFgXBY9bQkNmLmdS3EbbQXRW9gI0ySVAU0267xMP2ut84GOqUB26IjIBEIH37PnVWUA5quq5b0FkkKLuKP8VW8vod2zRw067bU%2FYxIosgX2gdOMdWkkSuKaqCwzAGCNJlRhR9ocG03%2Boy%2FR5zlBXQO17SFmKyAuE%2BHdy5nTABNjmzXAHel4mRzXC5crBlb0JTYghoTEtZGfuptjvWTEw%2BeOgzXR3p2iWu7XJ1K6RP8iSf3cK5pFt%2BjnXfH5CiDLpzJiHw%2BTxsNstMj&X-Amz-Signature=a7027406e7089b11bfa83bea73238ec54467c39000e571022b2c8febedeaff9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=c23cd0051d931bc4c002553b04172c51d8c57d80e8497f4672871949bee1441f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=4a7df118f277fcf233300aa8f088a18b4a53611ee371296adfd388364ca08af1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XDANUWSE%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGv%2FA9ji6w4eRcZEbMFW7tTIsSpYP0IXFmVx10aW%2Bti5AiEAtKz9iSfP%2BJw4HmQ5EJw45hFv118PEFRuw5hel5PA12sq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDG2Mk%2BQD5YzJZ1%2FrISrcAydz0oiX5j8u%2BJ%2FJFXqdH2e3xZHgalgJ99KOer%2FEVaA7cQtIBCzVV5hiN6d20kT73swkhDMWz0Xocz%2BWX4iUpnMtqNjCeVb1C27WRljD9fZjd92jZbunSiLTxiVbshGWztr3ftPJwEMFw6GnIWaLCYi%2FZy8wna%2Fn9EThOPyqedsJRL4OsVBzJTc1TuiH8xwLU9DO2K7dzsDRSGW9UjiZqvrbxc6WgNCrsdxhhcLt48dpr0TNg4MGHztCOvdNXoN4eowThW4tS97ggfGSmaqSRJHYuslfhLcG0oXETMdr92HspQ5ZbyRvUgnUREtKNMH51mnXFjw72ROW8U3HPNMl9ZjwJnOt3OXNOsv1iWG%2BNv7iujAhy5FKEWfxMBPG5krzsuR4OOS9vAXylm46YYGmp5QoH1fW1zx1wEA1ERWNJ78yj8HXaB8A6bHCgAVzVj1gSRPg9o5UsF%2F%2BW30%2ByMF52d2ccsgNt4WY%2BUR3W1%2BdbvJntzsLUscCfdVnd4gtg3twp0OL4MV3GWQ9CY5O0IUqMomALeTWEjgCpYRh2BBZPAf9XdCwXRolnrXc%2FjVF%2BwTauH5O3lLiZdy2Rq1YZ8asjbvNJI9Ua6uHysGPkvoz7ZWrVnPpSUdj7ru584doMNGtt84GOqUBNmQJuIWshfl%2BiQ0sdNVIJjLBsL1UhJiISr9d8rWr0VvkbrpmiMkUjEd6QIC7%2BwbSuiVqT8LiZ1%2FI1FqbojO45snYwvKKPOQ6obWI62X5vS6jdcubMygpoEmCYynGoP9GYuu8P0B%2FH3PyT4JHBOhe7cjk3Dink5WdEg0AC39aJ9SAwHlZuxtwk9ETnbPONRY6b1YBRNAxUSZAM%2BrxTZeQkKCmqjfq&X-Amz-Signature=213e0c08ec24352a431d4793c1900c1d2a12a88b5934e0fa471b246334d8337c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=63f81807b69d0b85af8f48724f07f2623e96221d5a5be8ebb5f423e290e30a98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZRK2PFP%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDqA4TaRuOot5fytB6Ryvg8zX7zCWHiLIQJuZvku3cH%2BAIgAbH1zDv79sKXWw29Z8Qg17F%2BWlTyCJ4E3Z1HzbWHbmQq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDGEWT6UTHrw0lhZQrircAy9BHRBHURtFwnQmzKsrg55zA%2BJrHDbmlikqjpBNJbKtACtY9RevgWpB4vOQwbrDrUOVOKXAiOwincdiCZonN89Svlu69H5mVEhWCt5M%2Fr74lDoHJ9ttRX%2Bzf4gQp0TJm%2BV%2FcShwfzfOLLWRpb%2BOyFfKXLYMaif2JGftTloa%2FgdI4GGq5k7E77DExP4B6xIaF6zcBH%2FsZk9NsvJBEt9ESfRQIYn%2BWRodZ4L5yfNQ%2B%2FyaBoS%2BsIHW%2BpPSu34w8HEwVXxp%2B7Pys73Lh0E1kKYAojtUKHWW8AZJSpZypsIo7%2BMd7Bpk2RhVsKF1KOZx72DzgtK%2FIDE9aUKGkIUCYoH3Ht02FJSSoML1tg4JI%2Fhvl3xrU3v0i27%2FCh8XhQEgEqNF2gPekT90EA2su4sEjMjEalFtIBNZPPvcg6IaWUuzGrlowIXWrZN0JqO5w2u6uWTjhozSt6ra3Xj0TipP%2B%2BnIK%2BxG9qjh31uMvWksrOMpkAxyOZUdESmAsnmGwFGLuThMsmaiKbXCF0q35fLoKYLI2oELyW48JpvcIh7enmv2jZXwHVvRS93WSIT%2FAekSOeGzBsPh2xj8Ms%2Fn6%2BTtt5AHK2nyZfFNy6IBzkj778cbAc0AVrPXFbC6yyURrEIyMIOwt84GOqUBeFklSI9EK8ubyD3cm4ltzYcOYL9EHRpIREa%2Bqax6TBcdUAFaQiUB%2FWof8wp%2BV7qvP2fCaIvKQcyT2KZyC3ACaSbzc54uCuTbwRmW5OQtmcY3kfB3CRAewFrJWZEPfGVMhB1o2Je5OSxqHiQAXeCK%2BLZCHZVCzzoO6AMgQW8C0ry30vuRCKxl0b8lUXx8kZV5ni4a5GuT3l2lhUA%2BbaHiSxjEsBy5&X-Amz-Signature=e70308b2fb63d8b5757cbc210c8da04dbca5e974459d1ae60c8b004232983c6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RP4ROCXM%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDU6xj4YEMVstkqlzY4jC9e5SIteQGGiN0xVqkbOFBSpAiBdi9%2FBU8LjynELVRh0ZnEMA1AdPGyMvPeNmQW54z2LlCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMWq0kWqdydOnwaPiHKtwDHwrXrCBdJmRYx1EoKDFhqTvhY6iDB2Iu%2BoB%2Fo%2BdVu%2FX0e7lcVro74ZX894kqXw4qb2s5KosIhMFnosMCwwXjcUoj5PIClY5viIpB9q%2BTYrpkKScKwweaFafzYTU8SyGWX3O%2FypxmBtUdrYbl9q6f5NIEws5CoTZVJR%2B%2BojNBB3HohmKbuPR4PPULnckXEUtt%2FiFZNv3GnvUYZx8KEW8E1c%2BoocFwjroNX5iFs6AvkVQ%2BhE9wWluLOB%2BpcxfF17b4vI0rMb7wgbW8a9EWVJhoLrCjlRLEZ8cS98h9WunBDiaXQy2wATSwi%2BWPxUavmJyUnyp%2BtAzcwhMcpW8VbOw1p9XvmpGcnJp4zsEWrtxlVDIt457d1%2B%2F%2BnC1aFksEfixYpE97v8JVfrvKJGf56mjUjl4EmTSKrwqAznqrMYA6hpfx6P5FdDJzHFkGSv7hI1sNE1YDwa2QRj6uwVDkx23%2BBZbJnc88Lc30bsET2yCRao8L7jaCi7HmCt4VHBhmcr08tEiyAQP2UgcSWytCiWkS6idh4zUh%2Fi90il43jwNpCT%2F1v15M0pBVSh49M%2FviYBxwyd2GXr0ZadgehmM6SLE4sC1MISsp4ps8GSiwx2TpIZGz39AIgvY937OVUrcwtK63zgY6pgHEQDIeM5t%2Bpgb0%2FcsqYSUIyJ5%2FR8hQF1FjPJYkIX8HYubu7K1g2N%2Fm8yk0e%2B6ow2Iumb%2BVMlBQ%2BVyr8R5kv3rKm9vQtHdiIjdiXn3afFXbnYtz2UHBrM%2BidkLjpUzodJXuPYL%2BmWbPuMVRLkivOj8T20aRSu4YQO15NvMFnLzDP2Ru9bF5pX1oeVkehKbtzFBZUTgKQWFVRwvZEPpYZi%2BTARtw8gq%2F&X-Amz-Signature=d07357597b4d75ec0459f6071bd472df7f4b7e38386876a8874578b961862362&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UF5NFK2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB4lrqHbQai2M4d6qeEAYLhu5ehQcjZ0O%2BdVVjy%2FryM8AiBUHevPghVDT7%2BSwFYCA4dg19R2c3I518bHEYRtkpIvQCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMy5IXiFM9FELWDQn7KtwDhNxb%2FpNuHsVVuRu%2BUGwUmTebz4%2F72SAHQDufw9XpWSx7D3tUMER5uQ97FV8YrfSMZFg%2Bd%2Beu2J1NZ1%2BlxhqlYfTHz%2FQ7CWY9xSRlIIpFZ84DsdUdYBnN%2BNy12dFlkPkwJp34g5LGDV39%2FSwIPh4X23W%2BSkf8p8kSZDaVWcpoShbczPyALoMSLsZzfbmZZdzQTliyxEZu3p3vLHMaHVOmLgHeO1dAKcPL0xbetWmECmHpkpiGQ4RXk%2BHVW0Jek2kG7ya7vFK58uUgJtJb%2Fn3r2ZaYQK3qqQa0NNCCyG1dRc%2BGmy5m4Mr%2FEwSBL1tzFCTuqWhHPteG3aWbNz0pl8P2oRpqEbfQCkdm2tVF763kR6KLyb3jYHlqcqds4do8YTKV8SVrIpBBgjPQww%2B8TbDd1XaTVI%2FjxK%2BGJAU0Rb5ziLOJMEc8LOpy1%2FDBliPIYoMwDlTNy%2Fu9hQ1Q3%2FymFChXRBvNQH8UY7%2FLRQNxbWQGwyVHROZ3cpJdXLmNQRfTZJGBs93saArZ2lkSqtDUfwahEv9ukO1OLpFZcirZkLHmrQx%2FIabFbtY%2F8lXtA%2FfB6p41OjE2hYlYuvFNTZs2mWukAQXKMZe8DL4KluzKwm3zqU1YzhZPwu6NzaM0NUUw4q23zgY6pgHW45J4LvrJ9OP5S97SzCzDF%2FdK2%2BLC8zKnEwoFij%2FKy746v1rw8vNUrkJhJ%2BPsd9E1Frdm3t8m1PpuqUiN07G7GnJ8xma0yhW59S0tTVE7sLEDoxgG5T%2FIyVir%2BZ%2F2C%2BnCl%2BsLyuNPJu%2FfbaViwhdeKL2hVqcKx6H3cMzhoO%2BNddjtkY3dHucpuTT18cj6rV9dA6pRwfrsgDkRdXCLkp46o7nedzkN&X-Amz-Signature=6b27d6a9d837ea50191ea19bf456f91b93f1b8ae335d5a327bebd96ab313a782&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664FKSYROV%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCu7LfbmiMgJoHQB%2BZvSWyzOK5vMsiDbP%2BNRt4A%2BQm8FgIgRAZSSp%2FIHGgcykq0wPyKxB7av%2BEMfnhfDBALADWvzkIq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDBNsxJUkycZUvU9gSSrcA9vfZSaUu5DAlhbaiYobbHGnFkFe88PZrQ%2FaMI1GA5GZU%2FB%2FJP1h9MQiaC8BLhKeH6bETWjzZdUTnpcriz3xTp2tJrtFSzSanQYsjm2ZqDsP4YTw0Gij7K%2BuAJa%2BsdsXEgVgKVpk2Tz63eZNQvo6bZkNKD%2BVTMKJ%2BupFybXLmNxxoEtK9gK99Azn%2F8l1jnun6CwhYUhzF8XDOo71vMtlMlV2p8kGukFDhSxcscT88thiU%2B4Ds3mB95K8K2DeKzslLVEKWTbinFQXLW31oKQUX8%2B93JdxHTEdTTepUyMcJuw749bBBJ2EGDtnfyp1%2Boo%2FJIgYWLIEjYqEpFBq2HVzi1gR87WlVlT%2BYhBrkQWsyB80RvpIdwhTci42ZJnbWpA9ctpzLJPjj6Bu%2B0dRytN4AV8UHGU2noPzI5aWE19ZE8Z3Bd8P7R4kZ6hmOotardn77UFaRx%2BgysR12jyTFEvADFKm59kkzwpLZrwPPII%2BGSqqzZ0cceGgnlEiQ423R7taIzuDu%2BsjjbQJq5RIVjnQ8vJWFAO6mPpdOCN6f6XXC7ft%2BWAnN%2FvdUBwy55N%2FBgU7G4uh98wF%2BG3ujEse75FNDxGnBEV6V9c9EJSUwwopu4BadA6XJNzLVMEkAkLJMLCvt84GOqUBd08FnwiNYwkhEocPPtf%2B9R8qO7ytqKAvIQWt1y7WndsLluf1fv0b4OgHSwTeY8beYsBTzzbUpCO2E6XD05IWMzi7dVSk2ZQWSiVs5TcNr%2ByXuPlnriDOa0SS94BvVtual7yKpbliJ9GVhwhNLl4u7F1jT08r4PxmtmmTgwvCvVtSQ5pahFr3O1MM%2B06dIqcXVyKxFhb8XgrUIK%2FMT9SWULv9eIgb&X-Amz-Signature=27f1892a289af9f2aea479ddae1bc8bf1aee26ef253a7938af252c3ebf2fdca8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=6006360425d7377e60411180526ac5fba3039fbde665f66727fdd5faabd49902&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WC4PHTO2%2F20260402%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260402T032824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFkYEYefqRfpx3%2Fr5fzsWqAxaDqimKKGxXeS2fh6PNxZAiAw1rpM1YI%2BNJTqshaQT1EXjZfYkdQ7tOa6Yttis0FJhCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMmlFTp%2Bb9UlpXI3anKtwD1ySVsYw3qjPon1LOJaFgNe2PtIgfGUtUW8ucAAyiD11UHG3Mwi5TQ1IkngeO3eDSVx5dusxt2%2Fk0r%2FULy42pF8Aflz1DceO8U%2FKRD1de0e1SfoidVuWs25w1l0KGvIwPwWKUaIeZs22BzJXR525iEpzH6t5EAD9vmNc03FWIEr4dCQrBlzFwyV1cWnHkyhaTevXjWvAHvLtPWGcJMc9XLEcGdRRg6Af4srrMKcplSUBxWQMYO8DjIXu%2F93yDuCEjnPM9T2mm3ribgvyXmWQatnktaAodqmF2jwV7%2FJ%2B%2FY4jWdE7kAxvoSJUF8FP2dGeFO50oNfXV79nFgCOW1qgjstiN3zp6vYGO9O1vCrgrTRIwZHB7d0fArWTH0%2B1fIQwBrK92GBLRedf9msBH1oWA0Ngu6mPbgyhQZrJeYVdl%2BZ%2FSTZ%2B%2F%2BbA69SHOXI8kzNDbuOaukterKIaWZ6jzjbQnt%2BH6dg1N5DlEP%2BOd%2B2TKZ1HouVGX6WBtWDvw3SK9XKsY3eottG69EXxp7poq9jmjchYFW%2Bi6kHTn4QiVU1jArTPf18vu3EzRr0DoGMFs8FL9pgmWUKlrfRRyH1pYFkyz94Iek4dxfp9NWM%2FL2%2FhCFy%2F6liicINd4wODZBaEwrq%2B3zgY6pgE07ieyGCLa3Wg%2BiIVYogZVCCKzqiM9f8fl9OfsysEU0V9W4miHri0ZoeqMpIBeqUbG4ljxhySGr4m%2Fis2xyBMa7LzVFC3FxF4sbLPff0p9m%2FGodDQ18ul0mSceeyvQ9vnuxGxUGDmkqoCklzLcTXSgIlP9vuFZygCzolu2ZESUlTSyqH2kKhzyMjnAjlNY40k4OYTghC%2BHSBpUP8SpDHby%2FU%2FZ9zFH&X-Amz-Signature=6df4e2ae1432fb535858c622a43b7f273441dc3b39be1dbf828f25dbff276a49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

