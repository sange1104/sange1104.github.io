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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=800be852260e040a4560b844eeb0fe64a4b13a5595ae332569dbf7c29d5422d6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=564d24375d927419837104de04c4598b00eecc57956538c48f28f63bb9a970fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=830c62681ebd399af08eff76333930c7c4a19a3e744c8d39fb69e16ce46f1096&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=324215f349d9f4fbfea2e5bbd994c48726fdd9ae0e442d1f8c4817e847ebde42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRWASXO%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIFS7oxJj5BdUTQhyYZ%2By2Bpd8VfkbaPG3TkHa1vgKm%2FWAiEA%2BdAlcKQ2wcM7CvWDYPlRdJDjrPu4zNJ%2Fm23lSwQ97twqiAQI%2Bv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHnP%2FPGcu6cW1sOqaircA%2FF4Uq%2B9%2Fx7lmL9nibHEzuyFUGTbgcWONf0UEASQxkg%2Bi%2BmuMm%2B5i8QMETMkg%2F%2FHeUUjL5OIz2M%2FcZWsCVG7rtbPvT2gZIdodOFAn5EoJB07dqaLRpNHBcKzj9cWeJDgcH9vRfcn1dExlKwHWzhuASuaC8etAC7u2FQ0zTct7kKQPkKvvOOvJAYtCWl3pHR4h1c6s%2BbgnLauw4vB9jxpEp32BzjVhqOghE%2FV1IytM9Mave3DDRjkidv3JDZRzxPavqW8SwMc5L000gEpC3Vn1w3rOoJWt%2FH02alVmqzQYhxlxyqzuA2uGwlaqkwkhKnuowOKlWIuElu9lVuDhT60LzFCstd0ohdVF1WWSxlwaYCrvAVZA%2Fv1XSWkEbOvCc%2Fa22rk6N6TQgAgMJCOTxaWjL4gb0bflDbf7pPTtgDcGS1X3jEqzAaWQ00BRe%2FdVfyrdqsbZl8DGW2B4te4ULttnR07VSvpHB8CkjSWvdV8w4uN6hhMZYWb0v6%2F75h57lSk6iBNxI8xbxvhqLY566kPUzhJJF5doRIz3xLdPaNIkDmku7Y5zDOFy65G%2FYxcMMZENNFfCa%2FCT4ZDswDkz4attHKtOcqgc2n6pKhH8%2BGkda6T5PInkMf9TcZqL0EcMIvekM8GOqUB1l0yfrsOekKcvgQA252oQe1zs8zEKECMYfmKNLfnnQ%2FdIMqWNMZPdKUr7sXk%2FSadI08vDU6ogXPbZI%2Fsx2%2BHmqEcQAqfSYrfUGTu7taUepaBspskzW7EIMG2PSYTdVgk%2FXQ%2F5sBUgySkhWfi4cbZIjMMklKlRxTQUyXa7QUAwZx1WExlNuue%2FOynJEkZVJug9fdrFXoMzV5VV3h8txeWVqpIiwwk&X-Amz-Signature=861ac4fd6d0d547d8386fd728cd4b94ea8fe6b4b0001fc8d97550b3d187a09cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QOMHBJE2%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035114Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJGMEQCICJjZY8Fd%2Fn9nsN215%2BiPWNtzFfv6vWeCClLaGGOhp13AiAkSk7RD10cD6G8FyiNToGwkxE14QDlPRQllNwPGUIGGiqIBAj6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtGCuwnoxBLCvU80cKtwDxzVWInIu60V7TPC0Ri7vei58koQJ80tmJDnMFgY3oOmwQ5csQECD%2FXd7wW3tGlmjGbCBMr%2BBiLKztYn6%2FkLJrvwxCgKksDhr%2BAw9npkBn3%2F8tvBiyFzrigKce33QRWnyppbXdb8MxoNtt5giaxzpeYE1a2hdIQX8QBmLxmqcJ0ypf7v5eMhj84iU41Tkr67t2F4gNCKAnWIEKebyfgWDd8%2Fl2Cn%2FngjNTe9PwmcpfoN27l14ad5rALt4ohJDpohYkr9%2B%2BuLXUEISIB86fe44%2BvT586K9rZA5DkfiqRd535p1NFVax4YqN738T2JAQBKEXMGsyacP13ubO8L5nlt0Pq7Bq%2FFNBZRHkYFMxi3n2SkpmzruYoX4SI5eZPdz6iYwsODhyH1Lj67SpxtUVxUAf7QrkiOFnt1khErI4wD%2Bj338Cgo8ViSBJ6GQRl3JExjB4ChB6bK5XjRTo%2BxBkJnuYYiYVNu%2BM%2BvkLF7%2FA11AwsO5o2UVghOt8osIbS5BhJxKWD3k5oEDLfsK5d7VD1tD34eHPHOrD1hjcDfBC5JgoEmUlve4byNGUybR4GCztgHn9n7tRQTBIvfrChuBwRdwGwbPsnoyeAytTiVKuhkfVV9hTJyorITB2cCOwTswid6QzwY6pgFn4vOdlUD2vKcRb2UyHKEbrtq5ofT8N8KY0xNW%2Fwqdi9ICzMl9dCZryf5osN2O5pQivr%2F9o5sYHBQbQhYLrlveOwq705P1CetKrpeWqjukqb1ddvxaPnmYWLg9PAjG4wcnWIXdDrudbeIG%2BqP6l8K8svNHaekcTreowB4GKkiIm5fjeFYxatLKPro7Ej3CiceJY4AZY7mH5dB1HluZiVLYkVN3Y%2FK5&X-Amz-Signature=e591ea1f7bef390403fe1839c4f99d0c55c6377ac5daabd0863ae56a9dc24db0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SO5CYWLD%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIQDiQBIrZ9s5kg10r961uU5m0c%2B7fjNBLKW9GnoTbDAB%2BgIgOvTXeiPIn2snUHl7Tt%2FoVXx2IbBqmDvfak3%2BT4ZfGY4qiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMdhd9yNieW7mKQDpSrcAzLnTDXRqtsbLjPY0hzO0bQX709sPgo%2Bc%2Beoc562tAnxCg42E5p7PIFir2O3rEL%2Fxo6cmCFFfoxWaf1LlkYMbcCDLoQpSHe7GjFv4upiLOhSLk0kiPFESVq%2BZgTuq2cRdxSNs38z2TScge%2Fbg9f0X1jGd0fK3lCuFyRshIGdZZcZicvpQ%2FMF8yNYZy6RKM7nauzeh8l%2FWPo6Djlu%2FGhUW1CnxIdwmm%2B%2BQaqHZL8AVJ3NT1I%2F%2BfzZQoU6UJvFRwx1Tyb3rStN56an2ssCHjc8RtAIenCElb5vy1FYzD63IdzEdZbCQVCZ9QEVRoGqB3Y5WyzXWd2OoXVFg56UgBvZPMs7KaPQrFyCTK7gl34mXtlDBCZoO5EEUBGDE%2FREJZgOAJkpWLiL4v16PnwyQvTEPE3KS4EnA%2FTGsrzmp4CNywuu2XNuThLOrcwDK%2BAIrD2T3nsIvtT95YsV24Zb9AkF3D7M%2F0qj55Z%2BjWlQtwIgzh7XMkfow2YUT9bMHEW4GFHQ1C9DwTvGqXs2koNcfqhQmDyQP9Mv0ILiVMXjmWgJAuI1NhKtJdTrPrJI2j64J6qLUPWVYoJXYbr5CFGePWCRS4oFT1QHufcLFOf1hhsioaopppvLEPWUX1GdYWKtMKbfkM8GOqUBd79HZNuIUNFFoYhTHTr6bsFp2BGlWfVEl0OppakPhrafNzEgNJ%2FlFJYC1z8jpkfn%2Fi3PnphvnlEE4LB9os5m86%2Bv1%2B0l0N1wNgBX%2BkVWfTgCnF5SPOxW1%2Fo9%2FFHqNjCIpaJH6KEtF27cfS%2FuwM2MWLxeAcC6aVVatC6vQnpVtCdhciiZJYqiSOAdzV1PpPJ7S9NUYeoJoTSisBCCD99e6XPJl14y&X-Amz-Signature=67e46d657defd2a94d68b6298a4e38b1a1325792bf59e4e03ce9f4b9d61cb744&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJ7Z4XR5%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIGXd2axLtjxfdASOUqJ8aBhEPlqHEDBdTLthE9QMm8OCAiEAnva1ykl3YwRGXmg2UDYhboaqRrtWJDAEdS%2BV7R2NfGUqiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLnwKBFpBdee61KVTSrcA8swXahvcUtDp4GFf2k25WMv6lw4qKhISsXu9hGq%2Fvmku3jJRrcfcPscdFeb5iG7Kc3vQSsnkn%2Ba9Et71jDLAaxyzhMRgTbOPl6aZ58C1Xmgewz7PiBsoZWHUfziblCEkmw9fJe%2By%2FVmyhmc7dxNCmRImyYhZ74QO6jCsSOovN%2FoxfZXptXHydD6Dq89PclsTlbmEe7jiEDIDGegud%2FnNwO68fspik1w86UpVYOv9q67spyscNysQUA0lL8CgI6R0RITXzm9waocxYxcHPr0uQq%2FspyoMea3aHCy8OWRFH3yJSAV%2FAmdga%2Fr6z6WLjUDO1yr7RJA%2Fvoen19imtfDD6PQsVz5tqh9JmQqDtneXPWn1SdniH3Fp8jrijBAQWT4ZAckKpsWL5T59pn3zTd194SjJNmM8GqY5go2CAsNdAS4NRx7OU3pgHOtiuH%2FCWhsXTKnqba4ak%2F5oPF%2BTTn3n0KMnYljTinVXj5%2BnhpPpgbMUgUKZRA3LthsY1JPOjpslOtWSmx9%2FcTOro%2BiFvXWq23pYMQ2ONgJ7xHJZZFdvEKzuZyN9jAyElzh0tFt8iXseqFzNWYFFgosrYYteyZAZjFqyzGYNp75dAh8iHIDNhvHSN0fTME36GGnG%2FpZMPzekM8GOqUBTfQF5ATxNKjlPKI8RvQenIDaF9yLKg%2By4Tvow79nnTmioT9bL79jmCwSN0CuRUUOJU1qkZ6cSW7pgIOrX%2FRpReJ6OX99ZFCFxE1lq7I%2F69N18qzKae4qktGayxXgCPuBBf96TRa0rMdCOTFlPBNgC9D8tSz8qwJ10Lv8R6HI0wJgwwAAo4u%2FSVbZ74k2moNjMnr%2B67gA%2Bh4cRrpX7yU7pGYRDD%2Bu&X-Amz-Signature=2bdb00b7e4ca05cc265d15052e66e4828e50dd0c3e3dca4da43e4a336b108bf9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=dcb8b73ea14c4d96bfe25b763486ff8fbb5cd8510426a2300e55863ea4e78eb7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=6727c5be685f49acffda1027c14bd79076dad58da109b604d3a75e5e8ee57971&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665UY5H5O7%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIQCOuHyzM%2B0FsPSEk%2BUkbQ5b9bMGTubqhXy61b1XXNAtYwIgFnrlG15vCy2rXALD3u570DqeMn6OXLErOY7LkbnOtIQqiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFtZ3TMZkDs55tmhZircAyyBEqcmSeYRBwg9zVeP0xaegatuPeeejb%2FXq71ikb7pxiD1ZljaTpTKt%2BZqTUwnFuJfKQ0XIlyEWkaxyAmn3Y64A%2BB%2BBHbk2MkcGRvZDgPQj09wIuDqYozRsdM1NUjVNTGlhHwfKmvfocm%2FkqkXJxl7WAquibJepybKe3bNaS25lTJEH8agZueHAhdXGP7Khi7U%2B%2FuPhLk2db0uvLix%2F%2Fc6lTpQgX3%2BCdf%2Fc0rOLut3poFLNqsEbrL1asYuPlcbSRGt%2BFX%2B8xMfNrSiGKZaO9OiEMTnVaSn%2FcZ6tPecV56QJ7EeTzKlE1J%2FMvKOYjaCFcjq78%2FAOLI19Nv4VZmorkAs3gt4lMoidm4ANplj8DxjZMyYQWEEzwSxcm4qGakSiiRL74CcHxslFeSlB3aVBanD4RIQ3lnP%2FS6jKb6buyos7yk12uukfFJeAZIuKnyaVYHHXCCCFQh6F42BKa4DAT6WPgwdG2Ze3Cl1p1MJnGxhaGeMHD5u83uD4AYJdaR9FgcMOmVLQG87iSbPqKRIC%2F3gweXcbXgm4dT5D4ZgiYBPvk8MNAXSg%2BgB2uqLdpgccTqLkVUfj1mR3jLUgh1d8k6UsZZ0Ed725Fv86u3ypxrI0z2bOGBgpn%2BUd9iqMI%2FfkM8GOqUBBfoLokgbPCATZuZuRrHZygAufo%2Bnnt5KHkw7ysEuOzqp32zyZvig%2BpCsOT6SpMDwCp6MBDuVDClkDN3vNRZbyvXDtHgwqdcvF3lJW2iwTDvJz9RMfbVnvICNDqKilKATJMTGzSuRCFJNJP9IQgIkmDTNrsmjcc3gyZ655XoMxe%2FcI6w13kSG0WeaxCC%2FA6wNnWmW%2B%2BDLJ6pute0TDs8zTVdPwvOS&X-Amz-Signature=4a3a38f42725929cf64cac773d5c077f77027052fe23d563e9247f9defcce634&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=296d02676a2b0207201138681e630ef874624ea4182297f9e66fb0737ddef008&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YGWYWRF%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQCfOtBnpLhnuKPLrF2MEN3Aa6Bl8LpH%2FEHoSt%2BG33WZAQIhAPHezPsoG0fGv9%2BHDwocQ65uMyXEO5PtM3QgLvzWwAYMKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzlGNjB5lYYw9q2KW0q3APgBmKjrW0rdwOyvRk72HnWJfmc8EzCJ1%2BVomsqgO%2BXm%2F3S9NsYdKlRMh%2BohQIqE8REwpbeREu37Ur9n8luV93NrtNs5xo%2Bf7n2CIix7E5qZ5qkVWmC%2BY%2FeV3byOJm6nYwLXQ%2FqaP8IizAYi7HdvqIzDR7UbY6IWbwzcXMRqFdmUkKZ5u0q4lpwrAUbC2OSiH2HL1Egve9KnEBDzKVk1hqvW9IC%2FVaQwxrX%2FVlYGPuS75QQ7ytM9GQa1nGvkuWPK9Bvti7jCPTjryOa74n6671r4z%2BxNYRyBNHD%2Ftn46ZOIs7m29AsCWxtiKZGmDi3%2FT521WEP0m68kViAW0wu7AJ33WfJoVJe%2FMIff9mB%2FssXKBgkXrwushbDe%2BQHsTQIgpxUeHFsOz6%2Bi6EP0tVCC83wIdL3xJtsxxI9MaU%2BMSbG7x7tioMws8D4oTkuSOQ44O5MX4IU7i0MS4GwFy%2FrNEdLnWkxVEa2u5IyvW9iYZwYHBiHjjIuZaEQI0FCb00ZVyotlRxANAyqtSe%2B2DsqpY8oORy5RMs9aPAyGG9hCSkYxS4rhdXhPFqjqSw47jDnCiiGJS%2Brkh8RBXU4RaeO5UZhLy3U1MOCl5P1htZixYEGUizjZnXhk%2BS8wnvpgHjC13JDPBjqkAZWDE0B%2BlC33csdeXbVPim%2BzYDffHEs9LWNbYwpi6lpzDw3TELz4oEkgStapQ%2FoMyzsee%2BEmpjJZsQoW4UBxQMI3ejM71OS0ovnPrpTUysNewF1tQExP9WnBzKgrbmnlDcZDZCAYDEgFHckJvb86ZX%2FPOxtD%2Br3YfVV2zpBgggx8kS5M%2BI1wxgiymrn9z76Z2M%2Bnx05kEN9nUOTHBmCJVuJ3%2Fyvc&X-Amz-Signature=45e140b587976150f5563c04702302fc9d8b2aa1c7608aa033c711d450958c9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJJYNGCR%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQCpMFNfRAFGHe8F%2BoWeUNaJ5zO1lX4YyIivZtFiONHdQAIhAJQZRhlDkpkL%2BC8j3DtsvN0hcmVTGx4jGoBBfWkTEfPfKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxCS3ypyktyj03SNMUq3AO82sEaPwObYEuMhXx3Nsk4lrO%2FNw1olqi%2F7ya76PZDSUpINHweBMk9T4FTo0piuy9H0V2buydIh7wOD2FW6PzBT63iPVmukgWcQL0xuU3kNXmuxZp2RjesU06tP2KZZQLWo6by4B18K0sYVp9OvclUYvMuHmfPsYQVGQ7KNP7sGNl%2BRwk8zy5c8aAHpHG42gC%2Bb5jl0ZoIR2fXwm%2FN21VUvlc5VvRpR7UJISGTyfwNs3Uc5H7IHZ8sB2LrONuDAZrAiqf1PcUK3oelOmB5e9TrgMDtdv3hqnEPVqgOCSkb0hsc01TzhJy%2FCvynxZ4A9uzcn1x2YDNny0xzpjsgPHHyxQ9LbGZM7gtwpuoQ5Qca5ybE1tDKORlGKZYcZZUSMDUePPMq8wdG5YEq6Rdw7B5ltYilkSMX8Et%2FNM%2BRpeP4U1iqPeOvC0YHzB%2BzKkjntQRuKOOpVPjSvOMpXThMOxkL0D8IQznbSE7J0gr4dQku2ye8Np9GPQkudqPN1oaI3w2ebr88GlaxGeS3GO1PbYoAN84pVEy4lW5qVbnnff6umlIF0hhtwD1sW3wVuB%2FZe7TY1sIx4x5oCL%2F7L%2Fyk4oTJ8lvG1MLFpFGsdE%2BeTzPwzpbQ08KHnHg%2Fv%2FcohDCg3ZDPBjqkAVNFS9MxPb0wROcymj2ojbQXzd9NTaHWSp2gkzFcNudNlUTuaYE5l40ZHf4U9juClESftMF0mwlZlVNZl%2Bav48KA8k4M6F%2F1oZl9YJh1EXtwWLn4PkDAUGCFG5RaCeSHFzNWCLwhhbgy5HMkKKRG0DD6QbvA4E%2FXlCeKKBvsY19xayEhGbmj0w5A1BQGtltJ0dh6uHOE2rA3aTt11LUwOwuRZ9XB&X-Amz-Signature=0677b3a0c5cfefa52a25fa00f85a0ab9b03694359a301dd9e69bdd97ebed96b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XCG7TDF5%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIQCZ%2FIJMhdC4b%2Bb2%2BSuGw%2B0fcVJczC5kELAh65ISpqpMTgIgAhhI%2FD42ECspfM5%2FylL9D1lVJAHNI5q1Sw09SOsxafkqiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLLLN%2FVOflM%2Bu6anbSrcA68NCwipq7p5yMve6XtFoIqYNOeJczSrRNcmVzTzMfAy%2Bk5gnUuYvp1xFesfp0rtpuyMwMYyEiKVn5rmsvoHUGJvBLvHj7aOhkDvOLOJou6a0CAz3YvbPg8po%2FJRR3ltLohiwGNgjVFaIfHMKsym9%2FoW0OOxQPxPYgsS3gWMtL8emO69xn5wvhkUi6%2FhXezdMjZqJ4KMhlmm0o9bXoETnwr0AZ0X2NyNWfs5frv9DEiIjXh8BpEKXiPdZbI7znvfw31jlx3XIPNf48KrFkek9jbLZc00gh32bGyf%2BU3lpc9n3Z%2FFPix58BO1QvSnQ9n7Jf5RjTVwyiHAlt1wcTbw5iIjBcv74ieM1ETpD0SFwo3sA03IMK6DHEaaFxrb%2FN0L%2FmMEKbqY2UM5bn6NlEQr2kxIifLrIYNGrtfPqsWOK5sVMZ%2BksOkEnJusumy%2F01P6BaHQDH8Y5ULfPYTvuO1seeMP0iHudrSwCZmb7cjQUhuqEWNVd8AP%2FzUjuigOSx7wo2MgTyRfGh%2FW62GJZNFfvYv9mVKUOpdYd5kIqlDLZtjwTiVh0aQmh9qI01690D8oD1rqPHswzw5bdZB8Hu%2BDZoQs4sRkJwfrfUlCM1vWPU4pwVDWz2zgcgKyQMU7MMrekM8GOqUBxMCGvM4vzHRiLFFX11enDkTQ0BGjhfkrXDvQ8bi%2Fp%2FA5ZxIUsbrEBMSxUld51%2FoKkWWMmqJEV1J3gXpnoqRQz9bah085ai0KIJnDmj5Z0tJuvEIwfLxuwbebCwOK%2FZt14FHW4DATATvLfohiqA6tRuVG3Uq0FLbQVTBp0GknKVCYD4UEChsS8IzeXZfiQcTj54ic5faqeqyGcAgO0doNJE11kNO5&X-Amz-Signature=7465803c9946c1a53307a0328abdcb8df9ee7492d82750c1251ccb78aaabba87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWDYHNGJ%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJHMEUCIBC9hoM75lb0MnYDWzshiPHM%2BELJoqXhFdAC0paQo3luAiEAzn2cvbAZXC7MttCTrdptOKxBxf7Ag3UkYZ4fyStIPZYqiAQI%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE6%2FTI5hrCgArUr3MSrcAzgo4XoEDWQC73t5SM%2BMSZ2hTXToqPNIKADWV9a3fveAhBmcSou%2BVZG1%2BJ2jQbq8CZyzVjiLbhFh0KyCTOGwtCc5dvrgSrqwoTLoSib9WtInIxu0hvLAw8cJCys8ABBkM3tis%2B5YJVWO6s5AtiPcngR2Rfeeu1GBhdNYWF7o4wFu4NNRMobnq%2F6jlaYJ%2Bk3L0fox0A%2FUH%2FFuOStW%2Bxoc%2F7yuMxM%2BegF3ouap8u41AbcQGX%2FddG4HUx5oJ%2FVF%2BZ0sCGOyXW%2BxjJZ7XybBOJpmbA%2BzvdPbZIlc4VCHus6nU9Mko1fGsUot4HNRQh9wPpTGQfVxoitOREbOBumFHufyNeIFCtSDCKLFRlaJfWyy8LPwd6s%2FWzhHFwyBCI8ek81J6WWENpqqF9Z9CDF9qdJ7TEI6FYwdCZZGrge2%2FiGN3XlgGUkjCTxYnHFx0U3OYVWwuCUeKvK8jn5zIRxjSGbiJ2DcMYKtVq9VYA9lkNKx9Y0R6Jkc5iXkIVrmnUsGDysJbg79zBy%2Bgyagw2ieDl%2FEnFP52LsobLWbxUKK9bgu5WPSz%2Bq%2Bvxz%2Foyep%2FbijFDQfSTdz20NvrnkdYLNeP4ZkA8ZPOE49hgrEoLZdSQilAUlBRKFIChb%2BX14A2o13MI%2FfkM8GOqUB1foqRWj7I7mjaFgQWvV37Lx9OFCGz6p7hOxFdEzwKDMkg9wd6JvGbdCLbKhp6UhGrjDsfq6irr0Biva1sxzGti7%2BrC%2FxCEfvzrU41q67TxdFGT7gmlAmq1rdqfZ4V6%2FKyifN9v4xiUnJ6ZcxguwNO6bwCfg6uFpkG2tOY26LYGqpZTVHmPXkn2NuOatq9itBywLpXmVESeQ4YByuMgV141fs8cQV&X-Amz-Signature=d7fdbfd823a6401cdae87f2739b3b7454e214be4ab510b70201b11c087419fa3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=501e96ec1ac640c7f6f8fcce2991c902a2d3102b9e6f518ff856950e23d13122&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLPZYJ6Q%2F20260419%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260419T035101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDIaCXVzLXdlc3QtMiJIMEYCIQD51RskoFSnPlVAQyazaFm8tfsXQbKUkJ5Uy9wcLIKSFgIhAPyqmCC6s%2FKFBwK%2BYGyRmMjLvwGXpVLOa0C1bEr4L5vnKogECPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmuYeYwIfBiztBZiQq3AMD6eCPa4S7mS9jkRPD9eNaMy%2FreoS3md39UD5KbmjXmNdTGNXl7os7j2zt6mPYEKwg7M%2B3LD%2Fi%2FP6xib%2F6BPRYBquWoeFkPlnlFhLs1uJrmiIGWLxTuUb45fOzk6HJP%2FBWyPUuC%2Fc5iBFs7bXkn3fN4RTXoTLKb8rinq3c8nFiFT5iP9y1eYSWcCSTUVirHAknnnVn4plKb1NCjb3nDUcz8e%2F7OfE0uIkugzLrxHiyonjJp2dYZdkncVg3vrga6h%2FaIZn9hucg1V43FPM3P1uxrWRdsH7q70w9fXpI0TTtD3M2QOIs5rBravdP5bkHS8hd1fHbxORrWbSlIpaI8pxeUtwvMlBB3HHufFABMvyP4zdj6L2hU9%2BDgiOuhANUaKZutpD%2B5O%2B2TZokEew1Fycqq8P0CJOXY5TuIk%2B7%2BboORr5SacVYhhYyDgmElG0eTWXqy7GfvCTbP5LzF9ciTJzUk2xy82IiF25zkytA4iqEvoUG2DZMGbmuHbazE04Mup5SRqG%2FYXIRnAiK8c2puCkFMPiGncHMbzmssN9XbX0HSjjp7Gv6FV4GhSKVROVBlztbIAn38p5EJjNUn%2BncK934VJqzPlqv3HCiiQqZd71d9OCNW77DPPcay5s58zCe3JDPBjqkATv7Umfgdq%2FZ3jmlEJXXV%2F27D%2FKppeTY3EdHnTwvCapyBZOoR4FLVJLpSQzunbQQiBPt1t4y3Kur5MmUqJN%2Fz22cBzEPE0lnNgcPfbFgAcwmBCldHxffHrXNnp3aEwMH%2FtgUb9%2FtNmCre3tSZsFpbtmyewh0cKT7InOfw41UhuTehYvDGxJncFF3i%2BkA69CsEK1kDE17%2FcHZcDDDpVlx1t8UdvjJ&X-Amz-Signature=fe39ca0737eb28453de1c046df299631a5fb04b799b7e83f402840afddfadbc7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

