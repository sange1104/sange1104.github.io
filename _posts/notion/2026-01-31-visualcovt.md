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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=e2b8300fb734f108cd7517bd42c6640bddc9e2604b23454e127140e3aa212042&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=fa074bfbcf6d08990819d10b64f94539209a1843719bbb27fe5a080063ce8b21&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=25b71012ca32c36ab73ca1bb237a36246a161aa54883556afb1d4c998f269184&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=6b06c7131cd705141e040488eec1f94a9011c033d715ea0c79189580d8c6936c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WI5M4ZGC%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIEEIcg3Zc8qtnl07NpuS36DW3kTkX4kA%2BiGmzkcbSvAzAiEAsOaZJdI8vSQuYRab1ruLPGCWBHSLoeaZTPgudxW3heoqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG2t7c5SLLpKCRF6sircA8QgUB9fdNcl0FC0LaMic02%2FMvDeTobNqExNF7CAIUyDtSFF50X0Ro74DcCFq9AVjmn943N%2BqGePvLus8V20r1LL113lGug2JtHqhMwBoHnCMDfBgcRDbhwe%2B76JAsKacNwvh6VQu8v0bmqGF6Vl%2FRThdDe6tswtNk15Fplxy8jykZkcErcwm61EnqMmAcVXxZipKurGHnAJChnqubQNiksxJux9k419QvUnKpYnjpRJcWD%2BTjaPU1qBeAn8AqSLU5xHuvX%2FnhoVr%2Bn%2BVLa2XvuIw%2FKT2cKLYVpOgkWV9j%2FQXjl3CHPa6lP7PyUIHHFe2fNqqVfd22bbfyMMH9QwVI3BKF%2F6bcMd3RB4HVQeItrHrBv62fWiQeRi86F8LZj54vZJ3fDUH8lgIo2GDXtKkf9oLDl5Z2A1xnYtixDmc2UWk9bNuTnpaW1OteD8kXCcWE1WrknFEKDscckk6uy%2FzRw0yAutluufCN51t8n75nWCIXwshfpqQEqV6fgyzdvHmD%2F7K4gTnQ%2BQ9%2BQDr1SjU4VvCNeGRlV5RF0eHkxeLm8%2FSZR16TCdFxcir6AWJFuMDqcQ78USeOLgO2QEMOQAZcJDp3L%2Fr0BAX1qx9Xagyjs7XKpto2VXmkcReEscMKHwls4GOqUBgJYVXTRpFK8CGzXMdK4yTj2%2BhBWJaxGokVWnYy7Z0g0xh9H55b4%2BrWi2wrZ4tJ7wuI4bgHpyPtCNogbnk8vVB4j38%2FwzKb4hcv7B1ccRnvSLWcd6b1%2FoPVjp%2BgoeuOe9TYNCrQA913qwtaiO8S8rCyEIbSJ8Fl%2BKCMTFIKgDGYnuP3I2b%2Fr%2FyQtb8tznq%2BK4P6hYf%2FAYnwE0VZk2SZro48Yh9KLs&X-Amz-Signature=6883ee145c1936aa32f769a7ae9d1e3406070d48d9f728ecf1bc975773754def&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46665KPGBHI%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJGMEQCIDnYQ45jIId1dN4csTPzhAzUAwf8w%2F5%2FBfIDK1McgJnPAiA9msbvEU26golD3mYpCLtvj19ZQhq7ATxv9IMErhvNTCqIBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM4cmeWElZ%2Bwe1d%2FR4KtwDS1%2FVmHFxG88ov97swpvhsKZLqHmyj0%2BTt8A2TdzJ11ecWXMGX01g0Sh0xRg0Br6ScyVhcCdg3xGYOE9e7qZhOIzW4HOCsnpPKFH57MN0W7DFLNYOeSmf5x%2B%2FyzbpHhzrlIADXg%2F8fwAmAI0OfCSzjmfbR9MX30kMF71L%2B382B08j6M2Ce%2FHxEGXTDOHNc1UMIAUaaT6UYVYVec3WmiLjZAlegAe9XwmRFp7wPCAwNd4eUlfoZDSLrMabdOMi5lcg57F78ccp9Jx115bDEQWmKrVePWFqC2UxsyeQpxsWjHFPpIX3jVscL6ONJDkDCsQfGrIa7xkMj74%2Fb8dyhCAHqdTOrLOiw8c%2FVz2%2FlW3OnUKKaJ7dLq459iyDeUbLWxAFZP0DGbJ4N6hn4wMSGhIYtIA%2B2qqr%2FFieGB%2Bxyuj8N%2B4PHxtLarQ9DJmnOYfgJz9xgQVjR56jWgCYxs1wV2wHXRaRJRbeG7Dlo%2FHUHr5LCsFgINDsegCu56T1EcOIJ3gh0PcaHHKqnhqEXmYc735ahW9jZ9azxNhpg8Bs79YGyNYVWE1itIF0BItHPt%2FklO7J4fqxfuqp2PwLiT4j%2F1L7lkB3mv8IMa%2Bkt83uQLyAAJATH1ZwNma69HlZbKAwpOqWzgY6pgG5XjoR6%2FqaZJba4FhrNVKJelmlWdcWvmVmPei4fp7mjPzsa8yS63lGMpmJJn%2FfTDLC4Jwu4nKxsLnO2uIZPP%2FixKBReyoCxZMmXSyXuuekjDNZuiQUwxcwhQpRTfoqgtc0BkBJ2tpsnQue%2B8fuC7w%2F9qKNwtJwaB4ZsYXiKCL0oQbbs3jRtj%2FUL8IcBeY7gG6kS8rVOTIL%2FrLPiqfh5FaREIilP0pe&X-Amz-Signature=17c53a5a03cda7687674d3c0a7a3ecadcfb4263ffb6ff2a0421cfee155a2124a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RGDTKYXB%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJIMEYCIQD5dzvqdsy0OS1fsAQynkTu9xoZA%2BjgGqKbJk9m2vuGZwIhAId4jJMqso6DfwcJ0WyyauhGlwR7n2jssspKzhPD%2FeF%2BKogECND%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxCLOa2%2Fvx3tBc7BZ8q3AM%2F1Oc51eot%2BpK8Vzkx9OGEBoUD8JI2OyXjEPbP0NM%2FtThfq9bROPVG%2Fz8gBHBSruqG5AXBKiQdrua6SvDF8snxgnOp4ZCDEnAEJGIvsy87pYXK8HHEMpkLANeDo2gOQ14sphiYMIImkLPyLmJkbUNar5i%2BzjN1SK%2B5MK8BXa0Sm4DuoKpvXPV5AVArk7RphdtStopvabELaGv24FKE07m0UgVJO2hPlnCwZ3fFWc9Gjwzt0tmFfWWA7LRUVSeRHnlvySbS0NyTRaPtFRXL0J364ZqHoCddeVLBA7w%2Fp2V20RWXK6dtHQxWWCDphSaEj5p6AJ5NkzK84qK5jHxF8IbuWGK%2FW8U8QQ%2BUhG6rxiIWJ87%2BrPojHRo%2FFvf%2FuEB64yZ%2FNi58JZZ2XAA8eV6z4%2BJcBZhUsGcVwW%2FkiwGxKGQFotQvKdc07jIpYdvFOztZlilWP1vYtw3MpZ9ks5FPc1lX3XTn8M6w6EluffBEw%2FF119t0gVU0l0ITUSOpmQWUl3XheHyEwECIqcqhy1HNpWTZNAA%2Bfu0CraldSH%2Bze2dwyEaGRUc4uSKwowu8iYs4cIJzFWTSlyzL%2FcdO5SOn%2BtExnPo9%2FXJS1OswUwJ0corPdA5jHG5uURR6MbR2pzDr75bOBjqkAQIMBOLrzydXEI7FcOjtka%2BUbEOyT5KAxnqibGZgnRRaLIUbktGCLbWJYs1HhBhlZuP3F1QSVvErVFZT2bXorC2Tdl1RHDbbB%2BBCf2Mq%2Fq7QWSFBigSXpBu2gbbSrNs7v34RvCDCqBC3O9ZrIrmBC5Fi6LGl9OKKHtq00ihnOFQOiMTSTTU3kJ56%2FZOqa1kJY%2FF8oDlaa3tb73phVUP3vGsvZzO8&X-Amz-Signature=073cd3e94d91002a0d3ccb8d3d56331d15a129a1f8adecae9bcb706ef241f2fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ULULYM2F%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIDmA3LNhLMxbZysZEayulZdqTBndpu9kNkQGinRdLkpmAiEAl6zQhVi2gicG8hfHz4fXevTt%2FpO78NFIluYonL5pXN4qiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGchSf%2BAhgBkxbuFkircA9dRT7aoQLMRTvydRObKTO3korAFXhVT3rcmW9PxLTAOBlARttH%2FoWBNCjKSkBIjmBvAH%2FM%2BkuL8bPB%2FbznHZuy2nznK6ATwOjwZWFkH98N7Loo95WzNhkwjtCBrypuzZM%2FTIH502Ew6uQTV0%2B4V3%2B6YaLxOJj26%2BS6ZcwQVbOIrJw8VqfA%2BX5w5QrlBfG8tjV9urohHdzcK2n%2FStza%2F5h%2FWSeXMuj7KtkjlpuYyE2Dy%2BFO3Vad%2FhHNH7aRBOp1rYCpILC0xHtG6Wi0B8u9QeqGzog%2F8ayRY%2Bvz0VFfpCsoMLmZPzJyo3BWChMDr8LD8hUvbPWjEM1z5539uzL3mtUJ7ieBQJHZ%2FIKOAKTF0dpZsaH0d%2BjSSyCynz2IOPpuDe1Vp4MLbSGZCexza5T6Be8svmKa3lF6dok4O7g4oa7Q4PkuqaKWZne5MlUrZzsiPrtjuizzruu2aX0R2CO35IGdhFsxyPTpT4uBfbq%2B6CsJP4v5nzYOhv26kg5V%2FC4hAphASTBEYSjk1Gm0eTgU%2FWosKMb7XHPLHJXbixzsTdgU9or3ade7eDDCdg2owEiF5Sz2K20uNMxgRJZG9Y66Pu%2B0XieXFyP9aEM%2BTGEUWYVlflp9L2jHMexbbvKSYMNjsls4GOqUBWrJxMOIimPBWs1pSRzNEs5se%2FOj6d7mnTi%2BzOFZnXs0wpOlUu45CWeS%2B3Vmu7vHyu85B4MGQr5%2F7h3CRxP54UU4sM3u8LTxaT1asj%2FLWJ3FnDoCAjRbbC8gg3DlpMVnlqOOFNVSWnm9XTIZKPjHZ2dRI%2B%2Bp9ict5f54V3UVF2GG4whwIl1AZPVjwU6EIBSPnxqosYyBJAn4glKjGcpW6fNyY%2FRVP&X-Amz-Signature=79cdc0c754f74ace497d0b4466fb5198c9e20c1b2dd32fe477ce154cdb82f1f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=050be5436125f2d76cae052890f95b1532d8e83b5d763e16ab76ae722cb0065c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=66bed348698d28b469a5d8d99d7f2598c19e66b8206e0676a8f91875bc0e1546&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WJCZEVDW%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJIMEYCIQCu9jrmSjKGUmDSyUabDXDofNbYmZF%2B7mWfIWgGWAWIVgIhAKTiOnAbwk4H4uNHHXvVb2f69KG5Nti98A6VCMhICPSQKogECND%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzJcZUGRMZUWHfFA4Uq3AMZK%2BUaVkgSOU0ovW91b3wHXSTdBFe%2B413FJvCvR9pqmgav2ghDCgRKul9hjVTufDBT59LLUoZo1K%2FmdxmjJW7t58ZDuVNbx3VuxtiGGHuZ1OfiTX23AEucTzhVjN8o%2FmOmMfpnOLlbhrwkXs5o%2Byon4tb74qY%2FDLZbtuILVBux5qsixgBhOhk3wfvHlv%2BM%2Bf1WwDv4DwCG%2FYocHZotqisuYVjOlt5MBH6%2BpIXjAeqs6sq7yvmM0iHLX7ib2psYzO84GOYMRHhZ90Lbf2CRPz78QkmwsQ34iQIwQgh7OLXf4xjSk6rMjmXyIrWYeNaSj%2BMpj6GfOv61q1yxycz3eG5GwS33VhO1zPFFkPNF9vo2clNUUlmASSjO2GCALOhBoTJTvnnIOjelWBJgs7vUDqsmTGY9z874lukbp2%2FBBitRPqRyxtxcU%2BacWqh9u%2B%2Boha21Gz%2Fxos6r2fsr9Wct3I41HyK4iguBP6v51xwLf77L91qKYIBoc3fmehEawUfcOJVBCBSeKcUYxwwO7vJ76Z1zlKajPYuVTiuo9R8Yd6hZvC9ljvRbK%2BP4%2Fpo0gSRyXsYkJ2iig3D4LTG4CONiF6JPob5zMlWR1dvdQXKDBYN5F%2FBYg5pzyQhiM0RAuDCW85bOBjqkAa6ubRsKKm4GOHWpVpPj6AqyUm3VWSp8B138kj8d67btpzyB%2Bse07kRFZnwhcex9D0ecywT6rHOUvXp7Oz9h9j0ulJHxLjgd5nSRwh9crNAO7WltAfau2xP6HfZ%2BtApX3pt8XJY3uaYCPaY2QguMzMHlX41pqbDbqMOXc0u%2Bm45Z7qA%2B4aCrf0r4%2BVaFQMMKDc%2BqZ50jcR6V8S5AnyPu7A%2FyJjX6&X-Amz-Signature=ae597700d1c2bbc89f66df7f4ed97b59d2fdf9793940245b532de6b52f4d6822&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=8a5648bfdbdf004cdeb44d0419178a9cb25c41ef1d170e2a91c48443121e955e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q44WQYXF%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIHtHjATbrFrtiWtehkuL7E6lfMhimZnQY9yQn1NTdHBkAiEA%2FzOJxJcIz2wBedIaccC9cBo04zCH7kdSSI6ABGn8AYEqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIPjfOaJfJg434iAByrcA7Hs3ek%2FSuHnte0IPjCOIFCip1OfZungPh%2FlR3nWqD7m612ughrhqMWuHXxM2I9cLtkQCJV7ebLNk113C1lUWmj5IMse4EGY0yz%2BO%2BODbsq8MKaviZ0hzJQlUu%2FhD5qobo0XRW9JiwwONEZo2RKaZG0zu0onW9iEMbOu0X%2BEL1Y0cMWVqaZRxnNYdJ6sCdU0kC1tFK5Cwu0U6oqnzezLFQEE4acKVU7Ww4xmImPmVt6bBevvajQfhqLiFz%2BVccnga3SglEK9sDKOEpW8hecys8Af%2BkeWj%2F8faU0UvCZhaSF%2BpVmV2eGl6rYTZvU3dzu3nzFy49%2BA7%2Fc6BjJ1AuvLXGXTRrq9kgs1KNKa3Iznj4JiqeVkGBzYiXeTNo81iQH3ZzOirKAGeRnl0UD%2BAtH5O4uGdMpBtcfh0YugEDIoQaqqFmpv9aHCPJnZolpNj2Q8I90lozM0EfUJfgoMTH1aUjqe8nuAjFhoIabPoOM7k5j4gT5AH4%2Fok%2Be6tkVJKNerl5MLsU0fMzvzf2mIVlMedGIu%2FXScRXSXMsZ4Ghry0GTYDBvf%2FF1xryhEv7EDWauxvJJOjUlZQ1WEpuB1YKEDimYTCjFwzCDys2j0S1Rfjf0fgvbzJlNNX4UFefjQMMPols4GOqUBMcf58p0BcA6sjV1ozsCx7fGQ9fFlniSvri42%2Fw3mXCT3IGvznoujA3mAQIvOjTxPUHJSqZQfSN%2Bcj%2BIATEp5h285aXA6lasHtSPc2dC1YEs4rYWBnBCxWBzyECtG0EuXXYpdxKyNVv8bHRxe%2B%2FqC2xvdw8Uf4oiZZVIbiAdQ2I2ZWr3zo7YGjUkAs1TvKuqJKysFAOuLui6nY5PX1tkvrAQK7sZA&X-Amz-Signature=faeff8af85541db7e60adbc22ba2a5b986d6d810c2da6519bf53a7048643d280&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675ZZGSSY%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIQCJA6UubVNKgiriODbf1eI1HDvn0GwsWJcRDZeLA9ZlowIgX3aRArVjD9CnWHN8zyafWhy%2FPb6fUGs1FU%2B3I38pxrcqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKeqK9YIyN7CAM4yQCrcA1qnBiJu2HIlAVpGJZ55YsZwW8bmTMOgaREOZJfLeCzdnE6eJNWdPGwvcwGwKFwGJQOp6%2FKQFc9N72i6cdMHzBbLvZ9zcNuJeZH4JVrO6ye0nA%2BwaJEbIR3Dm2Zgxm683MCIF1rVPza%2BAaM0ZdFY64WUTEGfJVYIlFdWVQqXmTE4zP7uFSNPeLDWYyETm3ZiZSergrX10Vl66Cc5%2BYLgvNaAHeDRiHXVlV2BAj9J8E8CVvUl8xvBT0EOnIXu%2FwBSJBsGG6%2F4DP4KVSc0A2dIpoJ%2Bg6LIKL7uvNXCcZ5ZQ2xQMGdpLEHZ9CL1jm6UWQLD2rihLcw3pTRGKyzJoeXSL%2Fd6SfAw48API%2BiduBNmA%2FXzILfjpV7lX3fgmah6k6S2lNzqN0UuVZC0sfiYj0%2FBUtr7QTUUnasXD8ezlqpxXSs%2Fiq%2FFDl7msmpQL0o2698%2FNZWefoPkG6woo8hkhG5hNlcsotnSBkob2NxlSsF1rM3WSHBawwPgwdnZ89IRLOxlvbUql%2FXQvcQsUZmQb0v5gt0h%2F%2FFk7%2FQgQolWkVEpfu8lCr4SEREJlQscLmQHmLbGCOyH4i%2F62xKzacNLSs%2BHf5gP9FT5YK49R3sPNKLruFEOjZmQJHoDynYbIpwoMMnvls4GOqUBlZ0y79cMFHUNKOyWHPuHI%2F7ubMMUwa%2BgAYCmDP8oN4zfQ5HixrHwmg5TUFz5%2Fx9S15wvDB7i3E2cgVvmfdn%2BMwUHAMKfKLyQEtPv2OrjQOZHJ1nMlVAJdwxdZoZh8SOTUH6sg6l6Q572wy6Q33nnjG5qTNLELIhqTquHP0NtND%2BBVWp6VKIALuFQrnROlbOEQHta6NYJaic7J5I1KuyJ2bBZaIlT&X-Amz-Signature=bf3a51cb58930a3e999e85fb38760f838046148f3157e1e6354d555da1bd760b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GGWYBQJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIESJPhXcavwMI3DTSFLlxhpc5AOMdCLoKv5lOPOJn%2FM9AiEA1Kgf0ApMf2VaVhjdsaj2DwsjnvnD4N0k27rWkOS6cU0qiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAn1BFiOR5JPapV1EircAwvUU9Oz%2BS%2FIplqFWM4mBUjJ%2FKKh7wCuv%2BJNXb26WCZlneDCoxaaHk1nQXq0ws%2Fl4g6b8lFvuOBh9mv%2Fx9EZr1I11raiXGSj02vKJ7pc5f5yHLa0Rt%2FjiMQTtO4rgfkwIhPPG91CBe%2Bq4XFGRRw6H0SqxkcUhZj4MqNhfsngjXy2jbE%2BvBWbc%2Bm5d9exwP%2BV4vRLhnrY17P%2BWcCADWCnpP%2BeOFILk0LZTfaNrlhBgenVdHodlBkzUW179MAB3%2B3Cp10T908%2BVQMnNZU3A0wCjDryVYYz5LJAIj2q4VVCwXcmd8c0It%2BevGZz7wxq4OIRpy6lgiQA6YxMm1%2Fb%2FjB%2BbbEQX1a9I1t%2FpFOVQp%2BpdA3lejAz51idavWxvyV3tBbxBG8Z4BudF28TVfimOPF%2FYw%2FFDk8ztevV%2FntHjF4RmPPNWORWtwkqnrSTTViQeVJvqJpMWSfWtkjWj%2BHUKpnS2lA0enRJNwoqh7yAEDwH5IcHP6yVKT1pVPr%2FZFzmbwiNARcjJKrkyekKCfKx7T28uyxG405L8gJG6vSZAMsge35r9Bh%2FAn%2Bj3URAaoWWrejZqcod%2Bi88axc8TSJQflWZ0AvHTo%2Bg7ihTKzkpQrS3zMWfK50v%2F85YA5U%2B%2BV64MKXrls4GOqUBIhswxLddvfnpJMID4Kd8TxzLQ0Po5tXZ99q8TLP9l9LgSfXE6tgWv3hLxcyRavxPKJIJcYIf70hTapMcI30enbwD%2FH4NYOHA%2Bul0AYr4WJL7%2FtP5eF3uGBpizD%2BiqPvhaCh4UbjfqYVWvXRYO3bbTaC84dbY6x64a0wP2XTdy%2FAHMhwjBEBJrGSFc4AdCQsxVujMdjZEKP5HRgMm3xP070kSGsdi&X-Amz-Signature=898a0cb1ab38e8309e937587657d3bf4dc6d6ac8fdde032a301590f52d047e9e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WBJDG6RC%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIQDhoUlK%2BoUdIvuH2FwgC88Z8GIoINJ0YD1SS6j5VUsGVwIgDhbvYURMirGhVfj68EhIbSYpGf3IRmUB2qw9R62cSRsqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE0vR9eCqiueMA9lTSrcA7dr9B8QAWMCzF8B0ufVIo%2BRgoFmQzU5qOZ3SCDFwj5vP4ERPhj2xMuijioUbaaJAjmAKuwK6sPZuss0UhR0N7gtkPn7WmrJ5Q4LmmjH72CbBe3mjurAzHdN%2By%2Ba5381MIdsE2QIlgYrfW6%2FzBWI%2F9Xrabjgv6vmsWHZ3fLadVjaZqmIr5ohyr6cdr3ZNuHc43jDI45bBbEVkhZy0phOcMyEFAiXJIepxWU%2B9VKFlan6kZtDdBiiN5zJFYxyjPr6auhEmkkMomtUeppSUzLJ%2B8vYhMVMgIU3LRaD%2F9GxNVVFdvJJvo8taM0%2BzNrW6kWbPix7P9mBViqEv9MWdVcEyF8tiaTP4TYsQXtLnmsamM3gNwN2GMo1QHh9SUUe3PFKjnCTwcb0R1Oxw%2B7bh7q6%2B%2BkkvQIL2y5tnsWNYm9RfDGMk%2FioLOsLkIy8hqunb99TUVum%2FxHfldS%2F7AOOCL5gBN3ekqV785XJ5%2Ffu8d9%2Blrzg6Y6N8%2B2YrncvBFpm8Q3B35%2BwdcFYy6FfNWKwfwHPqYaPSKSppNM9ojbCawUaFPkbpN8%2F%2BEBd9pylLsqNOiw%2FzcCVa9YGpwPnz7LhPKDnOaX%2BjbykcxeKA184dQ2GCPWRXr9abfnOBT6Ru7AzMPLuls4GOqUBki307gV9lBN6O1UMnvnKBAAxX5sZI69UcaFUXM3%2Fq2OyjZM5jVcRIgBQAajJoGuHbP5BNEdGWv%2Fx5Pi8fJBCW%2F3l1riv01qe6BR1juOx5%2FftPTyfKordjfQSOVbwEysuoefbv64YgdcDeoxttXxtuBGdHI8IDUmJewlRQm61hv75igmKvoRH5NNPAVm9dySVfVogoNcKP8%2FlRolOayht6LYhbDda&X-Amz-Signature=5a9637868b86de42a14647f01a1864b7359b04f100896091c7877a6ca24d8714&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=e4b3fd8148cc96682e1e6eeae7c60c990da275066a22f6a141c9da1c9816bda8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLQIIRSJ%2F20260327%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260327T033056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAcaCXVzLXdlc3QtMiJHMEUCIAO2FWnq4ve22iJO4POTndDQKfZAANxNFjfkmm6scfnkAiEAi18aKKgYOo75AAk3vXY%2FaqQyKj74pc6ddsx5rrtDOEAqiAQI0P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBAIhnqZQyXUgO7xaircAwxQ%2Frj95ZzGX46kgVtX2G%2BK4tKyvLGYscag0EJlYRvn%2FV8zE42phTJluUqnx5gQtrHQoBvWg2LvhCBoAaK6aFjK3hZOp7e1WlZduWzSB6JjcSqrR%2FRBo4jtTkdBCfiKwLbineOoC5iuUZdZvM6Gek6rpV1%2BkZgZ%2BGtNlZgxzM9e9f5elBSbd9oPwkb7G5tPMh7kjGdUETeUpQUAVDMJ2rD38MuHbVPbVUulhJzKwpcOTV1rqVgI5pkoxh0Wn88LdcGbiFddCRWFrsgltm40DCBpFZ8vmCeH9nnkV%2BveNVW7lrqq%2F0lV%2ByvKRnK0U%2BRmhukttPhWYDjREtklANCw3QB0anNgNBVcBHq0%2FKOzeUl3xQ%2BAuxqw7d1rYUCiD9p7ZNaCkuFiAziBFicVYyWM8osmf8ei%2FFt39Gsqsl9yqwUjbWQUNX%2BzQrh9a471m7saJSNJ5FKFbEB1V58KjaGdfZPtvb4eCL8r5KZBjZSpdJuElOlB2g2lMN6eaI3pbGKyxcD25MMywhxcTKfCHET1dBcIO8XNGkeGBipWMVe25ICKytoUxMFiZUIV93sLNT0hMq7yuRgQmve7X0F9oF2bV5Bo1%2FOvte5fb8na1eo0emcgdbwWufcrkzamTX%2FeMPPuls4GOqUBwDC3O4p5rgZc7dgzmpgtRDF5SQUM5olm3ILZ2oHyJqEI9e8Kj%2FGotTqt8%2FQ89e3%2Fvr7OsJqD9OpZatpHq95g8tnMRZwiRJakzAQ5Zgpodaa6P8FUz%2Fz7rsV1kRzpnBHIUPAHluLBLkFEpkpP7xvjSFpTFPw8UXPHKvnxUvxZVMmR7jJrZxlgbdjcIQAZOzAjyF%2BOad%2FK4lQQ9jwHw4O7GXP09dHX&X-Amz-Signature=6af1dff0ee23a44176386a3436da09a60419f688dd8e3737c5634d0759684441&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

