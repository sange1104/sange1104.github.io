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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=32a09b279f106deacf9b90a31499b065ae0e6377dbaa9aa227d1346ef7c91463&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=b677344c86e9ff008c5a03d0f49a93c26ee9ec11e18eb53e6ec9c3e9be63cc87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=ffe793dd55be38d690e063057fd7d1937e054e829319f71d159af59e49ac327c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=3b838ab1740ffff7fb599d5e82ddc821bbd9ec12104758ccb8e9e27d9090fe98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635536TBY%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBV0p5WlhZuEHGJGUkVMzRykvclK5HaARztjS4WtlStIAiA%2BhMEpDyxfmaHju9KutC1ketAf45a%2FVME5ZpYD6qsxXir%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMigu4SWFJF7h0SuCOKtwDh4w5ooA4hFGZ%2FesrNpM4ARp3mZYcaWaUKvpAVfMz0OOc3j42RPZF9Bw9Yi2MUUGkMP8AE%2BengWimOisQfY9qt7CGPI%2B9l5uCdOREUnprYaGfO2RP7RvkOVDpUTxRpmKQT7B3%2Bdvq5hcRPUu3TXSyrhJoorh8r0dvKYl%2Fjp5mp%2Bc8MBlUTdq52Sd%2BSpHS%2Bmbth%2B6C6I2p6T0JF1SHcybyOPpL2i1B3pEgIpQobR0Sd%2BebA4TdT3tOEUoUGRJTzng4WTuMu%2FAFQx4sXwUgkV96erwcYSYhhkWIaYedmCSVd7mh6FmYNFUZPB%2FN6nYgrnauBfL4vFh40BldKYkQUZiiwckzPoADaKXXeBN1HnCd6Hj8bhVxRS7mpzOxeADcAXZzaLfuD%2Fh7yVfYL7Bkr%2BIqOiodff4USbQtU7P9KuE%2ByvWY4qL8plqUR8izso2M0S%2FB4hLTu30DyB3BIw8XEux8XWxSTeNr3BypbYUJmEJQAgnJoEoK2W8LxUWRKYC%2FnuM1Ra00DqAAWdQB76cdzzTyHmmjaSkPS6ak0VLcIo08OZP4DnTH8NycUq3EI3qNLd51Q3dBxc3hn%2BNcNbyyhItjxbdPuDYpltto%2B2di2RD6cQfM1HH%2FooibF0Fd%2FRkw6PffzwY6pgFj02Le%2B0giOjqse04Y%2FKUH1ys%2BKZFYl1F1uEQPfv8%2FStc%2BgtCvfPAraMaaANvZAmmTyTmG3Bkc5y%2F%2FmMTxQzCvBVVeDcke1xaEv3irT%2BlX3DoB%2BJ28J9XWyTt2E6aJB5nzp%2BVJ7TswwrW5ksnLB4qNNhkizX5Pgw2bYgGcVgcsc8tjDpGAn6eN%2BmhwGxdFxGnuFVR5VhncMssq3x2P0wjMdb1Ryxzn&X-Amz-Signature=be94f2b55647e2626ce927b2c61a37918207f5966046d8ae92f80845a54f243e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V66FRY36%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040857Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDACuyrt3jsHHAqCLvlhxIrb1WdQlgyammc8cVk3BWpjAiEA0AeAwzYrtpV22ZTP%2B5vKWl7oqMAJ6K%2FMkzuZlGKYYGsq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDIbhVzHgKFlg%2BwnUJircA747OrMRLu045DWiFo0HdOH79UU%2FPwW0RirX1BF15OCJgXa08IZZNX8w0UbqTNsWPGQcsLcqsRhQ%2FtSAUBBaT1ji1Mzqna%2FeZ4sQ%2FcPu0VGUmOQP6Nb9CxOp%2FxfCtEDfgomzM0KI4%2FjnifX%2FDU6s1IWXPPUm4XKPgWAor%2BYe4BKXt4dPCimL6FYID2b3H05FLHDxLxFtLD3RQh6eU3GRmVJ2SHtvdX%2FhStInRWtQt1dvCAr2f%2Fn7KiJCuj132E0HhDH6n%2BdAX0lET%2F%2FaDIkc3I7SYgjSXVorPfTK1Nagl797CFwhuItXBUdOgm3AXPkcYFRvkAoI2%2FpuiZRGV%2BWa3TRGdeK4R6Ewx%2FDq0qGHbWtSSBmVRVOSUNjU2yVvY6SbQidQ2W4DQjVSkhSevBHe5fcn4Jkp5dfeiUh%2F3DqnDfzswmOAT0Vsm56sOXrxsUcG5XIzLuRKOS83rLx85ObL%2FrdUbTQpF4SZkvmP4xWqgv7R%2Bg3RmHKXeQ0v9TIEohx7mvXZhikLlX7xOGA2lJaqTqMVp3Nyy8VD2HkpPRJwDE6kNQkhzvX9J6sLUUIqAwc9lcrqvwRBH%2F%2BCF%2Fo5fIlJHlWpLVivaAgItwiPALt0YpUZwXrBlOCC7M6XazTdMOj3388GOqUB6dvcCHa2aOE2fseeweq9v1xCoqF%2Bz7AE90ZP11gk7EYi%2BFkhESx%2Fyw2jq059u%2FDOLNJSV1xsqyK7GkXPKK2vrZbqRr%2FAECpmeO1b7ivVkT6Oq9%2FS3oyyvQfDXQ0%2Bwv7wV4hVmP1o3YnjVtBKQI21cAL%2BlfAmpFKHZT96TcJF2sLsYRa62wUHMuEsRsIG79%2FQFDtnEBc8inJIz%2FSN5N5coIIRVnTV&X-Amz-Signature=17abf6d3d4d04f964ea6f58097dc8779d8a50eb5a526bc960babe9270e6f8b2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UFG4VWMJ%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICgKun%2F9V%2F3agNEAxe2VcjJUHO5izmfjKT8o12UJn0GzAiEA9yq%2FmhfJOvireqLx6LWVailn96MAd6oI7xedAp5wL0Uq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDBIhOJYCyBKAm4VUOircA236Cd9YSLk3vdKDrm1PHrH2%2BsoYpp9elxi49opGkdY3CNK5sDhr6%2Bu0zLPSZnT%2B7Jm6pPM%2BtYayNyl7lBo%2B1qPeG7OW0bnNK%2FJTDuddZJFrBtcWHTNYXe2ocSX8MPopjntKGKqW6Gem3rkPG4puL%2F4Nmw%2BnSUBSOb9HYNd4DoHoqovYnUaIbmSci3q4k1G5cagPjaJuxFz3Gn%2Bs8Km66TA%2B%2FNozq4pLL9SX6vscfmkqMQEFz6moLlP1G9wXfYo1V9YAli87rZh8kgoDckvAOYwbMBguEEEa%2B36ZKr8mP%2FJzNWCIOUjtr%2BRnoBwoGhLlXSwhfdZIzVmIVzMk105F105vCSC8Kl1zRYLPEMiIaQl9mUkIFcSEXm9Zy4dYERLUnmLRwLQ6h43Be0kPqZL9xk2mqcCerXyy3k6LhbyFB3WjxTOHuoaM5lf7arMO81XKqb4%2BWP%2FxTAoDDDcUp7MC26XZyqoKg3zC80Pv%2FPsGtnT22K54ykhBsx8me%2BMp1q2NwdaJavL6meC6d5DbXLS9rifaCl1spj1bN9KDISzHteZi6R%2BmL9rDtiQ4hgef%2BoHjr2RRIq2Wuficy25Cvi3T0%2B1sOVFymYtoNM5ZRwzE%2BLG%2FjdkHk9iV5soneIncMJj4388GOqUBEBGEXGRe5iWOtEcCxeqjiRIyuVzk3jX8KLO26UpuQQG2FmzNfN%2FzZEa0nd0yaFtrxb%2BxmrMMW75JVWOMzEiDTmy9rUWSLt4OIbLtWxO9iFk4ifHN6CS55cuikOaYlsg%2B8DhfZTVl0RPNodfEWxDMMIi8JyMLQtKEWLjTIs0jeMwb7cJuUOMM%2FzfB8%2BbtUdsXEnyc%2BeKsXLagcCwqCotKj25dgNCk&X-Amz-Signature=69fbe7aa60ca545d8180f2040952c533a257e51190a896b4049801f2340f5c8e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y2VDGRAQ%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDBGq3YlrVwXTWflON9L4sW9vDQFIEt7xmcGdjelKIdAwIgCNKjaHmbm%2FnQ9oS3Wc9vyNJv%2FG4wD9FkiuLBeek1Cbsq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDJHVdEZMdLXsu2%2B1hircA5tKZDWgZP4KC%2FlTTJo%2B4N%2FuUEmQJFuVk5Cz79dpLscswSXl7er%2BZ7g1mNdA94etSH7NbcSVrLrjViutDinWgMe0m8CdBNcNuqS5ch%2F6xyU7BieRXaA4KumSmfWRQ9tT0uZ9gtRZwzR20f8XmS1hUS0jrOWuAhYSXqAF%2BTJx2zYLV4VfvA%2F%2B0kWX8dDIB48X6nbx3uR%2Bh%2BRT9kvSR6NATm%2BwJlj%2BQ65J4XPrxnOIKpoX8vPVo%2FZmnK0GcyP5LsWDMgptsqcOYtQMogHHM4tsNYki80DuIA%2FUo%2B4Hn9IlEqClDPWm%2F3%2BPkU5J0JgHEI85KhtqL7pA0kdOzlfkqZkjtU%2FUdYPde2B01yd3yZVLYGkiKULS4%2BfgYW%2FOQCkDBoRisGqy6fPm%2B5HcQODCi%2FUWRo%2Fg4DxkJREx9V1jQ3gQW20UUftkqws5N3xSRdbd0C3UuNb0EuNUL%2ByyXtirYxaExlR3iBPeRhWwAB52fpQluX3fecK%2BNITCT5Y0qYLN7n5QmRdBLba%2FvOer%2BZCUAgjXrnnZHMDWD1qojIZqU%2FGbHOPHPEhCaLEeAYFUIfxUPVibPVwFWUMkls0YdO%2BBhljbNsDucSMsDalEkJv4ODN3%2F1JWVKJuCB8TSTbDvxXCMMD3388GOqUBF5HPi%2FJ1%2FqB0eL5bFrXSbW9NcHk2LcezexV02GPMXssAXCMz0Rr44DkrwX7pkFbulKUxh1b%2BaMnjEoXiJdEGk%2FF9Ao2iP%2BAWV3YT4ZJMWVTdvduEYIUf1wdp9zj%2FVpIw81KTkWznUujVt2Z%2BWNGw9mKabhnBT%2FJVq6qGb9ChAvS6aqbtPxyMLLnG2FhYkhAExUr9mYT%2BifjQ1N1yA9SfvSzu8rne&X-Amz-Signature=cddc5ea7ae1e79f8d30e1bc8b8de6144c943fb72fa02b0337c33acb13a923dcf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=3f5a591bf51e3f55e6402ee631fb32a14d4c2c0556538b48c7b840bb76a7daa8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=56e091a39a6b99ff2ef3ddfd8a26ee4926a7c34292bc0ae8b8ba0e5fd4f1cc20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466446PU46T%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFRAirKopwrj9XeZu0tSwOoF2RgPZImlSmopFjH5tzGVAiBUGymnKlk6XFr4OtGx7X9CmPNnT7UD7FpBWK8acRFk5ir%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMyL1I4tQdcA7V7pyKKtwDzQdfUcmKQS0K0NFopfJLJOKcpXqWO2OxPxCZ14HkoNjyJqJVBZOcDUQ1S45Uyp16sGKDRrGp4iwETlymNKWbpTMfa2J0e442KX0y%2FwUKFzIOIBKLXIXpBs3u7%2BqniNfPr7qMt7pYoQy3CRn3vQD7bWKmmuMJuApbVR9f5NwfcEaEn4AMqcb2sy97YkRib%2FanvoWn8PtejiTwN7JgiodaahU0lhd%2F20ZdLq48FeiU616lHpeyYRfMuN%2BAa35GE6A0hbwin%2B7CoQ%2BdjRlmC21%2BvXwMj%2FrPbb1y58sUCWkxuzAJstCBKJaUQMtd%2BGPiF4b0q0pnYxtodWCVNiPJK7B19ZMk768SKfYFMGNbkorVXhp0m1S%2BtSagE67%2F64VFU1tbLM1rNqaD202sFlHNrnIQoA3lqCjQ3TMrSGRn3fizFYkkgH%2FMI8s9d40HAHN7%2FEFX7AgzSODydBcBX6gptoFpbXCuX8RlYhapOsfiRfX7zgr6POD5%2Fnu%2BBycB6Y55bQLx2FVtxVq9HhLrZyeC2juRzRe9jVUlj3VAB8t%2Fge%2BXSI4SD41dG2AJWzDlasUNVBVFldrDHXlOVS%2BtNYAdT8mmHfLb3fypheiIn1RzMKB6%2BdzlLoJjtJwZpF52pKow3IXgzwY6pgGkpSQ7XFU3ZbzX%2F1eyWvZ18YhY2J1edImXOsIZRhIMNdf6AfR52bpS00USMMNJOkgFdyJrwy5vHv%2FhiVGx7eoz2cQunb0EpiqwPzeOZ4G4EnH7m8jja0KpxV2MHJ8aBrVsuPqjriZebCOK7nGPCFN9R27hu5Zmv437owfkN8GDFYouMIk178K%2FRODGhZFcpO93KakDoBQ5uBocMhgiQfxhMW%2F107Np&X-Amz-Signature=dad33f9519feb0f660917d4c9272ab7bf07c72b92958f5c4632a8a8934130392&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=214d2e8e6bca013410aba76ab55902c87d53c17830e47a34b7b997d16a416914&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PAHPRXW%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCIEWoCdt9Lmu1S24g9bF8XvahhrpHhRU9ue9ZX%2ByxC%2BwIhANRoVCBSe4BNUzugim9dRclXjy3E8ryT%2Fw0qRGTeT52NKv8DCGMQABoMNjM3NDIzMTgzODA1Igw6uLkSJZLE1udiPQMq3APjMQJlaqCn1FwoS2mHYkTajJ3rHAYiMUhUTbiBPj9bXb3k2El4%2BlDbcQ0DKzJ3WEitzeJuDiUHzzmP1e9xYDLzWxMIAeAm7r%2FAvGLrvAqAU%2F1306LZQ38L%2FX7AkbE1N1SxRVfPYFJdmuLKBhzZslqb6rkIyaWQYKzQuIFV5r68cYV%2B9oKNtEKBYkeo5qDXuosYJLw6f94dK38cpudHgI3X3iXSjkE%2FtsAYM2h5EKn8bYIHimgihyPkFpOBsGzBE9%2Bh6BlzsCNLcVnxo0kKnUEBtIrDDq8p5JRUFAvz8tCOZmC6Z4NJ3oUMMOIcW5eWLZJOrvQ7bftZqVeK5a8Nn7EYjCoZe8D%2B7pU6EYkMH35oSazk34OPYET21DBv4WzoiBcyBuK%2FwT6eVeybQpM2aXQKd%2FG3YrTeTWjaEVslfRy35XreHPt1yVGe6b3DjHOl1UcwQZFe6n7ezwbZUnDhFUIjkhITbJnGF1JUNANtDUz9e4nHoyRHrzNEhGS113qFoa9hsNX8eyQTL9A1%2FVsuYU%2FH8jOGl6d2xkekIbi%2F87gMoinwPAgjYCetSBQjvsOb78bIWtDdUoerX0gTQP7yeY77tjOlydIEdDf2sAH%2FTan5lbdNJCGNm6i3w9JC9DDt9t%2FPBjqkAa0vYW4CcWqeYA9n7RdtwGfPgNi5XTOjBtkBnmONAxAwYLs7R2Ngq1PiogyN1zq3q07bHtwSwyyALx9sPiFv2snTjedFcYB4pBGHOFXVgE6csjJs619%2FUFzUkvdgFIyG8wGBE1MLRYjSZ2qcKdJ4dockMdtXmTbfds6kzigyPCxs1TZasLviQvvFsL%2Bp7MPdOeyd4CM%2BI29yMa3RSkpoWlPpjypi&X-Amz-Signature=f8b2f3afb8d211e0793c790a7b30798846d5b2314709f09e5dfd9dedc50b2e98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z2WI3Y4F%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHcXKgB1z0ETkUOLYjvWwBx%2B%2BF4s0hfn5mHq42eMC5iSAiEAqlimHGwWNa8aGSgBa5I%2FF6nqmHlH%2FrCA3erRsMrPjAQq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDE5NLVxfWDZU27n3CCrcA9UFSFpUIfzsknlBXnLItWBUuXN%2Ftv%2FtGWdDfXHcU5vDI94Z0eVEVbuVmuXjhZ0P5eev6toviS9XH9MfUL2DoqjA5ortrpD13xp3eAwiwv0B5us%2FBs8%2Bcd3DXzWdhQZIIlHXMB%2BVcVkcZeJ6%2BlriPCcBzyrRiml0o8qj14PMyGhN7Obq889FGuKMlY11ylwrY4A6Gd42%2BWqs9sfAPugXDOBIUY2fA8pJZar%2FKiCgihVHe%2BC3FE%2BR9cktFmEjntJj%2F07iu6Jh9DyEMSeC%2FqTxsQae3qMmaMci06XuOqHRq%2Fk%2FuBtuH0bOvvrQjWlFa%2FVqdvWvMNzQ9RkFV%2BUxPuxopRIEAldoQvHuFOSbwiFsrqkvLFMByMkW0ZZH7j2eqQCJ%2FXMD9UlgQ0SO0aRAbuLCmerubQWha%2BY1zXxOYPp2m7YydRYc%2BB%2BF3X29mPiFLc3prlvPNVVC86usR0TbLc71ERf3eeKFd1676UOhtysC%2BWf5LoALhJRqaBzBW5%2Bd8hqbqpOOATMjEQhKrC9UV1CvPZlsVtUZwkuAKHyqtScaR2fQ4qp7mXdpPTuWS%2FYoXds5EpRSi1mGdEkD7RXqvcR0NWxVfLYAUlpzKltcjZrpBY1fOf6gS7iyGuVvq8LkMNb3388GOqUBhf5sXUyoCusU5aWIggCw17XGd3RhBQz31r9v4r5OTVld5Yq%2F4cesB6zxesIgGYmXCTADcyW%2FbEf3KfRgaGFIz5rxKIyZNF62O1OvomaqZ9WVB%2B9NB9tubbiyzs7uJEcn9OJiRridetEJGuQrGnrM82EKL2p3pCdZ%2BaDjX8LnG6kCjtBSJL3CXDiOrz3LSfQucsqrsYTjTgeXnC4iI7flu0vuARWb&X-Amz-Signature=6fa8cd1d119100e1ba9fdbde1739d88f574735dfc2efa90ffe61565b8088100e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UOFNUD5R%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQClFD8sxJYP9AEwuUZDcTPDr9OtfFXr8niOOy7YCjAZzgIhAOsPmn0FnihjhSmhYjxoM6%2FjNN7ToAqAwIkAf1ACtZn2Kv8DCGMQABoMNjM3NDIzMTgzODA1IgyrvEZbzGCWp%2BZis7sq3AO6szZSNl14c9HWOriMdeuOuqAT8tkk4G9rWSwxnelwdsAAis%2BEaJ9KIcPjytEHBFM6KBd74qLl9qUcRgQ6sCF1CFPvO%2FucEQ0XEjchj4ONqQPYdMRM%2BiSMIA840uAejmI%2FtCAdb5aH1xg8uJLXvkgE0tYXeW%2FIzcgJTHZQ4lzdGt0sPQoBwkDZ%2By3uvF91%2F7C125YoAIGKfDFT9WNMWSkJQjRNSgRVqioCSPNEa9VbWNu6%2Fm4ilqmHWg6JyZoSTyNR6a%2B7IEVEQB1a%2FAd45zSWWwYcwRXHTjOaP2vv0bwsm77SJV5lwLvR3KYhfuEMpuEncmRR3aMfYymvkXyefhStIrWIB86jEHPQElLa9Q3wQLF3%2Fr0vms%2FWqjgOAfhPsIM44U%2FvgwNuRudDIUTEJ70viuxqpCjMzfhp%2Fimp9aTUPWEUCb0KrsXfxPG%2F0g9MVo%2BrKmz94EiPLyWucGJYZ8fzbzqKQ2z9nd6DIq72Remx4ZmsQLr6In4%2BOqiC8yuOK4KR2rxfmaOw0r0bibT7VhTRAUlvmDQ3gR0brY1UwXxAB1nk5FkgiwOb7poTBFREcpJspR%2BsiwjMeMtpPW1jVCmX4Dl0cs868onxyzuECevktMVjJtH8Qdk66A1AvDCf99%2FPBjqkAZw5b%2F5Nd3qWnVBGeTj1N2UZ9k6k8iyCs8Txag5A9Jo%2BTWZJELjavkLOJj%2BgEY6zGoOGPU9PMeR68jEAWaBKrm4YwPGNAEQnxy2WOjd7QH8RjhcOiZhh57maPla%2B8vAuytBX8gwy7aRRGmP3cjTuObZ15VkY4AjM62hAsQwLsVlmU8yCTdqPF%2BxEGZBNnwqrihe2Ot1lUEQFUTigQObuyvSwE8lP&X-Amz-Signature=3c13fb90b22e962eca55c5c26410d56f80f16c801d7a66fccae894b30817b53e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MCPGNS3%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF%2FXKNGwxdguU8%2BvQMrD%2Fd%2FH0PROn7a%2Bh4f9zKU5Zo8qAiBCJx%2FtK3VgIBruu8f66%2BdyLVHvDKlukvS0%2FJj%2Bk2kaUyr%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMwQITB741SDbJBEtRKtwDqFFfX9GjLr8Z1husuIYh6oHwWnN70zpVopaMyBCHPEa%2FZFdF47%2Bl8Ogswz9VhHg54gHkw65oveJTPUs8Wls6KutG%2B8xkWa%2FmTd5SzFFCdHMxaMSJxvB3wpAR7k1nxeOkK4GbbSNTeOiCL%2BxeMslDHuNHhOo3HST4wuf0ncoiYGlGNLNdrh0sRzwLCzjkRsk1ATuxzO1HDTm1KWRfqbAyiziAYz6a6UTlYU2aG3oGu31LCQkCME1tumb0fV07nXu9tGmOEhdT5cbcJqyDVL1X0H0JIJL2uYBYp%2Fw5P5hOrlI70OMzh%2F7NaQmbG59QVY2L%2BuxU%2BIGVHB5Rms127kPqoccBBUIVc7uYzt8e0J6edCTH4pU1Y1mBUq%2FsYSRZRLSU0Ih6jt7Z1OxUxI%2FzFg%2FxQ6%2BFy1IOxKn7QWf1tXCA1QleblLcEhWJAbSdd9Xh8zhIMGMVINu2A18vBDw5Uigdr9xYzb7PcOr6TbTJCl5BPkpa2MHEjcc2JlJsGpzpi%2BHPQR%2BiuO1rQsFlLhLngxJxP0hch0vk%2F3AWooxOQElYDfrWcyy%2FBuWaxgwR8Zu2VH9sos8LWOFO7hWTfUoIDlWs27ht5gkHND%2B9ZtdJ%2FKrvtC1JGPow2Uo9IHWogo0wrfffzwY6pgFeniN1PmnQFM85HYA2ao%2BshsbkY5ZWF7UPF5sJ0khztGPwyaVw0vYgjGJqsjgw%2FZ%2FLjY6RaQuXxBKhV%2FqbHSwvHXPelqKxcvXTOUB0CVwaO221a8U4kpQvfMeTmd%2BFEnrh%2B%2F9SFVA6gurc9hyqhf%2FHKnIukYW3wueuk7SP%2BsbiN0vYjW5RP0wv3pKCieOjGhu%2Foy85hq%2FZ5Mr3rz88Puj4FlI3rmj4&X-Amz-Signature=e68dd4aea98a1cef99ff4b20136b1a25713704bee5fc2347fcd8c01f890a2662&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=bf0e5ba61ee2007f409429adcfd0a828b4d3288e095163628fbd69a1a611f8f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GVXBW3Q%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040846Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgpA7cRRxVg0T7%2BdY8q2ViJJhqDzji5Wk4y9eTcn0eggIhAIqpcLKDB4wWcMmDjJg5XuF%2BlM%2F7wcLhEULW4g%2F39GbAKv8DCGQQABoMNjM3NDIzMTgzODA1Igzc%2BNEechoUIyRR6H4q3ANx12y4pUBiAtqtxAVcOV%2Fb5nwLytpgjAcGbKbTwXCFZvRgcxm6wWgtWTj%2FwlA6QY50dCVvZ6TfzvADYQLRmfvfd%2FetewXtKulmfyxYT243%2FiNlIAWRr%2BDpAxVpSbnqrBIKkC%2BXyWjqOFB2e1z4Im%2FaMhAHf3nxyH4bIZNxKOIweK31yvMYZOamgg4jJSuq7blGFbwdbnlAxf7TY4GnxF0JzuVZsPyUHm2OuUwdocbsy9KhYxUaZWYeaGPPVsTdzEyES%2B3OBHX%2FNKvXGF5T1ev89Kva3Ee4G%2BOQIQ7Gw2q%2BiZhq%2B97MwbVAN5s4phZ%2BMctN1VxakCxHY39h536Kf6DkLX7qiYcVCAErFk%2FON%2BimLWA2xcwHK5XRJ2oVj2APm2OX1F%2FRlvPe28eY2y1i9%2FI9f62vSAls8RgQhdncqNEtIHNctfqA2mdYrkj5SA1VhvybpNafQmoOEfzP%2FFhom9YT0n5x2RX%2Bdt8jbEpnc4jdviH0vszVEcxjmVpv4COnFke2IBlKqzcK3Hsk9apaudbgPbB9qQy9h%2FmG%2F5bY9ZST2buOHoNoI6DwFU4GUzib9DKOOdSYdz44AEyshesZ7OZ5XKBbTHWq3bnMCkTuQAb5Ib1wohIIgiXZoZIU6TDHjODPBjqkAX4uU%2BDDJ4H8isa8g5buziD7koUKseQAwxOCzyRoT5gpTSIHuURZrEeophBq3wmCEISH7bQjgmHXWlVTWzInaxED0IBrfxUuAwn4VNvK1xIuQIIELkIaB7NBCG3O614ZoY35PnPl0o2rSuO9qBjaF3g73T0jYRCFDILBIc%2FNgNv9CJRiDSAc7dc4FiPRGHSXgmcyYbYDo%2BNLyWsEUjqZjavULaoC&X-Amz-Signature=3dcbd0ef488217e6d5d12a30b0749bef139a4c3dfb0f6905c7616615b904a492&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

