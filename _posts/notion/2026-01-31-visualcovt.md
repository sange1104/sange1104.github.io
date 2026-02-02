---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [blog]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7ACRS5%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCPCPAs%2F0mEtEgxxT077cT8zgl0%2BLVlVH%2F40Hy4wvsnpwIhAImBFp%2BHFDbbaAyHB%2BSsWTCy9K0LE%2Fnt63RFpcT1tAErKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzG2dUeptuErIv%2F9YMq3AN5DW2xb5%2BMNMlSMmAF7jCVZddytoQ0r3TdkpEC2%2FO28UNoQc%2FWNIXfwAcyi93QA%2Fa%2FclNYe52n%2BhfKUGZNuy4WSrxonZ0uDtOHkj0CdkWAWPiFZL%2BcOwSSqcc32mVBFuoUP7JAuN24M4%2BYNmDb9foOyG1SyaW1l9Pmf8hpPG107NdF1I7brIV6L3xjha2BoKNkjkJNz%2FEatYX05uFfJkvuxL3FlTFgLgZ27RhrgdqyqvNpBPFo4QKDjKkYUAReqqMAJWZjOjrBO8wwJzFi6B%2BhoQYRlIyoGatXkuIv9An%2BG6Pl9%2BVm7u4N3nGplTWCvi4zCDiyoK5ekHfExeoXCjhfenlsOLbo42sVW4hp6uVzbaYP%2FFJCG4gFHpxTKruGrEipEla0Wdcn7QPyo57rgcGap1h6g7SQh8f9WvYkhY%2FB0bKJGqj7RXVGWdhUz0keHvoHONAhK%2BdVLL8%2FgtIyh%2BP557rQynrPTbGpbQMd%2B5uFANSh%2F3XDoUtMTXX1063TImpkrdOQphfvKzrLfk2KDsgJoPlOiKY0%2BCZMY%2BNP4cgcVZ%2FE3pnVT5aqSs4SCp2uyfmtskE%2BqqZ%2FTrNn5ZSDpkHjOlTqsk2u6EGvfK5ebGI2ZriBv%2BZeSzs1BNEVaTCZiIDMBjqkAZqTYogeGBBcwRBXLW49Mo4EN07I7HOIFYtTx4U%2Bji6OM5YR9iXQpNXxb8NhbJne%2FETdaDyW300eJjHArUeIQskU9GuNE6bZIRCIKJ%2B90xzo%2B26Qu%2F3bUzle4ziJAccvrP8uBOXfN6iC4F1ft9BODhmEMsDV8pjuNWbYFXjNIrSaK2Iz82rCZGDuOExgXwWHvNPpiUY%2BOvS9qaMWypfArbWubAVw&X-Amz-Signature=7930919c90b457967f237b97733c5769bff14857c29e26cbca21a94238e95e23&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7ACRS5%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCPCPAs%2F0mEtEgxxT077cT8zgl0%2BLVlVH%2F40Hy4wvsnpwIhAImBFp%2BHFDbbaAyHB%2BSsWTCy9K0LE%2Fnt63RFpcT1tAErKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzG2dUeptuErIv%2F9YMq3AN5DW2xb5%2BMNMlSMmAF7jCVZddytoQ0r3TdkpEC2%2FO28UNoQc%2FWNIXfwAcyi93QA%2Fa%2FclNYe52n%2BhfKUGZNuy4WSrxonZ0uDtOHkj0CdkWAWPiFZL%2BcOwSSqcc32mVBFuoUP7JAuN24M4%2BYNmDb9foOyG1SyaW1l9Pmf8hpPG107NdF1I7brIV6L3xjha2BoKNkjkJNz%2FEatYX05uFfJkvuxL3FlTFgLgZ27RhrgdqyqvNpBPFo4QKDjKkYUAReqqMAJWZjOjrBO8wwJzFi6B%2BhoQYRlIyoGatXkuIv9An%2BG6Pl9%2BVm7u4N3nGplTWCvi4zCDiyoK5ekHfExeoXCjhfenlsOLbo42sVW4hp6uVzbaYP%2FFJCG4gFHpxTKruGrEipEla0Wdcn7QPyo57rgcGap1h6g7SQh8f9WvYkhY%2FB0bKJGqj7RXVGWdhUz0keHvoHONAhK%2BdVLL8%2FgtIyh%2BP557rQynrPTbGpbQMd%2B5uFANSh%2F3XDoUtMTXX1063TImpkrdOQphfvKzrLfk2KDsgJoPlOiKY0%2BCZMY%2BNP4cgcVZ%2FE3pnVT5aqSs4SCp2uyfmtskE%2BqqZ%2FTrNn5ZSDpkHjOlTqsk2u6EGvfK5ebGI2ZriBv%2BZeSzs1BNEVaTCZiIDMBjqkAZqTYogeGBBcwRBXLW49Mo4EN07I7HOIFYtTx4U%2Bji6OM5YR9iXQpNXxb8NhbJne%2FETdaDyW300eJjHArUeIQskU9GuNE6bZIRCIKJ%2B90xzo%2B26Qu%2F3bUzle4ziJAccvrP8uBOXfN6iC4F1ft9BODhmEMsDV8pjuNWbYFXjNIrSaK2Iz82rCZGDuOExgXwWHvNPpiUY%2BOvS9qaMWypfArbWubAVw&X-Amz-Signature=99c79656c3e11bc7491d442b63761135e010bc923b52062eda990f3bbd8f28f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7ACRS5%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCPCPAs%2F0mEtEgxxT077cT8zgl0%2BLVlVH%2F40Hy4wvsnpwIhAImBFp%2BHFDbbaAyHB%2BSsWTCy9K0LE%2Fnt63RFpcT1tAErKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzG2dUeptuErIv%2F9YMq3AN5DW2xb5%2BMNMlSMmAF7jCVZddytoQ0r3TdkpEC2%2FO28UNoQc%2FWNIXfwAcyi93QA%2Fa%2FclNYe52n%2BhfKUGZNuy4WSrxonZ0uDtOHkj0CdkWAWPiFZL%2BcOwSSqcc32mVBFuoUP7JAuN24M4%2BYNmDb9foOyG1SyaW1l9Pmf8hpPG107NdF1I7brIV6L3xjha2BoKNkjkJNz%2FEatYX05uFfJkvuxL3FlTFgLgZ27RhrgdqyqvNpBPFo4QKDjKkYUAReqqMAJWZjOjrBO8wwJzFi6B%2BhoQYRlIyoGatXkuIv9An%2BG6Pl9%2BVm7u4N3nGplTWCvi4zCDiyoK5ekHfExeoXCjhfenlsOLbo42sVW4hp6uVzbaYP%2FFJCG4gFHpxTKruGrEipEla0Wdcn7QPyo57rgcGap1h6g7SQh8f9WvYkhY%2FB0bKJGqj7RXVGWdhUz0keHvoHONAhK%2BdVLL8%2FgtIyh%2BP557rQynrPTbGpbQMd%2B5uFANSh%2F3XDoUtMTXX1063TImpkrdOQphfvKzrLfk2KDsgJoPlOiKY0%2BCZMY%2BNP4cgcVZ%2FE3pnVT5aqSs4SCp2uyfmtskE%2BqqZ%2FTrNn5ZSDpkHjOlTqsk2u6EGvfK5ebGI2ZriBv%2BZeSzs1BNEVaTCZiIDMBjqkAZqTYogeGBBcwRBXLW49Mo4EN07I7HOIFYtTx4U%2Bji6OM5YR9iXQpNXxb8NhbJne%2FETdaDyW300eJjHArUeIQskU9GuNE6bZIRCIKJ%2B90xzo%2B26Qu%2F3bUzle4ziJAccvrP8uBOXfN6iC4F1ft9BODhmEMsDV8pjuNWbYFXjNIrSaK2Iz82rCZGDuOExgXwWHvNPpiUY%2BOvS9qaMWypfArbWubAVw&X-Amz-Signature=cad723e95edba219fda697662545309bbb7ae436291f4bb807325890d89cd3f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7ACRS5%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCPCPAs%2F0mEtEgxxT077cT8zgl0%2BLVlVH%2F40Hy4wvsnpwIhAImBFp%2BHFDbbaAyHB%2BSsWTCy9K0LE%2Fnt63RFpcT1tAErKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzG2dUeptuErIv%2F9YMq3AN5DW2xb5%2BMNMlSMmAF7jCVZddytoQ0r3TdkpEC2%2FO28UNoQc%2FWNIXfwAcyi93QA%2Fa%2FclNYe52n%2BhfKUGZNuy4WSrxonZ0uDtOHkj0CdkWAWPiFZL%2BcOwSSqcc32mVBFuoUP7JAuN24M4%2BYNmDb9foOyG1SyaW1l9Pmf8hpPG107NdF1I7brIV6L3xjha2BoKNkjkJNz%2FEatYX05uFfJkvuxL3FlTFgLgZ27RhrgdqyqvNpBPFo4QKDjKkYUAReqqMAJWZjOjrBO8wwJzFi6B%2BhoQYRlIyoGatXkuIv9An%2BG6Pl9%2BVm7u4N3nGplTWCvi4zCDiyoK5ekHfExeoXCjhfenlsOLbo42sVW4hp6uVzbaYP%2FFJCG4gFHpxTKruGrEipEla0Wdcn7QPyo57rgcGap1h6g7SQh8f9WvYkhY%2FB0bKJGqj7RXVGWdhUz0keHvoHONAhK%2BdVLL8%2FgtIyh%2BP557rQynrPTbGpbQMd%2B5uFANSh%2F3XDoUtMTXX1063TImpkrdOQphfvKzrLfk2KDsgJoPlOiKY0%2BCZMY%2BNP4cgcVZ%2FE3pnVT5aqSs4SCp2uyfmtskE%2BqqZ%2FTrNn5ZSDpkHjOlTqsk2u6EGvfK5ebGI2ZriBv%2BZeSzs1BNEVaTCZiIDMBjqkAZqTYogeGBBcwRBXLW49Mo4EN07I7HOIFYtTx4U%2Bji6OM5YR9iXQpNXxb8NhbJne%2FETdaDyW300eJjHArUeIQskU9GuNE6bZIRCIKJ%2B90xzo%2B26Qu%2F3bUzle4ziJAccvrP8uBOXfN6iC4F1ft9BODhmEMsDV8pjuNWbYFXjNIrSaK2Iz82rCZGDuOExgXwWHvNPpiUY%2BOvS9qaMWypfArbWubAVw&X-Amz-Signature=4506e96709f022e6a75b2db60666292404892f5b78ea2e1713f9aa7d6bb7c8b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665QPNK2LB%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031835Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQD%2Bge30T7dmNwG6iPpva9ezIdRhvocPNkxgw6oZlZGmFAIgAyU5v7RJJSP9zCnH1410hmH9bprXVnVBQ1mWCWMV74UqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDO5NjEVoDRaxlEwhcircA23ujA%2Bf0M1TRPtHKsW5mXAG9yKgNB77rMe8Mqeim6GMI6xgkFB61JW3ivz8FeNNmfIIKr9GMKpRvUCceln3vnZH%2FgKEX5knSvoPWu%2FRwfkJrav2ZVw2xFdOl44OeFJ2NG1mdwhiFn%2BlRsvsyEqwV0JkYybR4DqmLc5UhvT6%2FHhAa9RfOthbHdBg6Q6uOLUdazWaAWMewOfvLbkuJm%2FPXBiIk7CbQnPN7rt4vkfQJ6UWgBvAWKSdCiTv15%2FqS%2BLTan%2Bxz7UhL3fufPhcDJekLwbfYmtji1CfD%2FbfFXKbj6%2FT8qXrBFgtQhclEfTbYUj9d8pCIdLA9bT1k4B7hIA8py0oKfUnhJRu%2BpYiIBiRYBRdTLNXotz8PQ8aImi2rzgGkSavA2rA2xBC7LMGpdrBmREeTedzLWXiwcvjZJL%2FzALK%2BdsYsU6F9MqTdKSzkPvB8bl9x3a1q%2FBBZkCmDDZZl21ZedX5%2Fd6hWzMmqEr6DFbYF56V05uftiNwFjxUAFt9AjzAzM9KaMPpXHp%2FhYQCy8NWtwf1IFxQy6Om5ZAx5DYdrxBspIza9%2BBrcQ5oNAt0j1xe422vdjmZdwKlSJcLug4HvuRqPL3BdtQ9CdLZatC1ByLTQ4oLGL9z0RhiMNuGgMwGOqUBMy6UAEare2AygVz9wFxfC7tTTmGxR1%2BCAufop8sjX6oEHEkqc%2BhVib5vrakD3S1Ks890LoJi7wwnCrDl%2F0rzKc%2FzsqUD6wxMpCawy2%2B2wCUP3OkvkuN6V9uRVdes52qz8GGW%2BsneBSEbyB%2FZSoogBMG65eJpLkAlA%2F1k3n0PLYQx4nha4mekD06BTzohFkiw56fs1OTg5gV6p8x9Ape%2BnUdulAOh&X-Amz-Signature=5be439adc07aee443dcd5b176bf0a97c3170e990306462fe912e8e489b3f3097&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665KCGMRXD%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031843Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQDmeo4aDHiObwJuJlSpwSVv3XxvZpGxCrT10Wu%2F7HbVHAIhAIcbh%2BTU2njZ5zY9XAVVyiNufQnba2SO%2Bt8G5%2FdznjJNKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwAR1hsOxwkoHrGFasq3AMNhul7RQnoBDZzVvXkjPbUwrAhM5SuM9AwFb3XF5Y3wvn3pJgfAetHB1S42F8IuTPjEbWXaXU%2BiG4sa7DXybQfSnSEIY8LOc5%2BksyPMfJC1A3Bs0E7GtZRm72qX%2FYBLDMwlTD0qS1lGzSe4ZFYWo0zP4NmECyNMJu7VH%2BBVZbSxnIo2uzWD6mlarsQn9MFPhiVKzzPhgGCC9dvRPXBH%2FMH9qKTIbzm7cjVEjnzBPoS9WT%2FNSoY9mpKdU2T2%2F1vr6449i%2FqMFLHoUoGc3nHMdrZdB9FzSRQBd5LFQwIkqu3moDP4I5KDe4vmYOZ1ofC2R2iOECLtrsTODD%2F8tOnPD8X2%2FBxkvxYYE7OV%2FdTGE2CycT4iVS5BAvhn0kApJyBj5zU99RNTbsZ1FWxCyEoja3yEVbxR9Pgy%2BPTqApNDvzn3ogsvnPFJL3oO5jLrdmHWpmuiE8dAkcpAoCK7QnfFKTmHviUO3XpgJtt9QYt5vyilDxJ9wuOQkexsKutBcf%2BvmoH6PHpsqBSAIIbAURyZFid01HqnnpoeNzsATsbzSpegdHVMwu%2Fy3e86yZnfWXDm794WLy7PaVmSMhBaBzr59kvZ1Sf%2BzBWvVCgSvJyQC4tbkq8o%2FbGUNwuDxyQtDCIh4DMBjqkAdKuKP3faWFyseNYfAx0QL6XBci1i2Wg5YAYRt6eiIlhYtDZiTd8ziEC%2Bk1lVXzQc3nHWdKe%2BHkpLuQYY9Gz1i9AJs2TqZAhTEuAKPiyNDgYhvrKmy3aLAp%2FMLbFYcK%2Ft7Cpjjj52d9Ohqe0U%2BMru2lusicQnyTfZDQHFtMsKMo0b70zb%2BHS1%2Fia%2FMAEZT4MvTkarXEra%2Fe7HleHyPpRr2zwDQ70&X-Amz-Signature=f6b53ca00ae4c01f73ca4798fe072693434791a2d6b36f17ef14ea713372799e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SRZ2WLFL%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031845Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCr1bYopALpeeW1sNMZJcb%2Bimrf9inx0BpV5qM7e6k8uwIhAIsSc1RMqgWoGr22uKbC%2FvvI1UU59XGwyRFPkXcwNG7dKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxy690P88K9L2iI4f4q3APXB14Jc5NnrNpueN6sFhrCwRvXrrfBf5fSELybZRKHz5Nna5q8%2FAR60UqzU1OgsGqrVJGqQysFMTaoJHnwleFaSerPZfpemIZqvIZgP%2FCvV386gEZYgiwgicG1v%2B9nxyd7yvOXqbpExYZPIzq6v%2FpQBMVRnQacxwhNSvflCItb%2BfFZOaeHYrWK%2B9bs6%2FBayOFbydO%2BEP7UUh3EVZ5YaoxuBvd2Xn1AoTaIYl8qilJTInAM3SMN06vgN5fGGYpiPsWzOS0KClubtvNDTn%2Fsxl6Hc1i4XEWJjorfC5jcitXAsu2fJohSKhhglr9SIM%2FZTeg6RHLmvC5LL2BbJws042%2B9ST74JeG7f02LTQkVW12qpUgskuzsmzL6HymOTcjP14jBUsiG2YcM39M4Q45g%2FVDTgfFWzplqKSXcs%2Bp6kJSeBMdq68rlkawnehjqdXV4l2IsxEOP3YXJfQDCkDazmDiYgkgpm%2FpkQdFwDihQ8txhO6h0Z2ZfTXSBCJSJCfy9EYr%2Bume%2BFyyI8jR2Imx%2BGn5v4mCxOD91p4Aao3tgD3XIhqO7HIrJEEfZ99iyf3kXvY9Afh9KbVgW2r25Qj%2FK%2FcpgcAQ4XFTYkNDGB6kvcxc4HkxbZD%2B%2Bqb2rDeDeHDDehoDMBjqkAU1%2B6AwW2zqS2%2B9Fv1Zj2ZcT5bnPsFyJ5QJZgJTOs7cq9Hw%2F4bd4wqPXubIE7G7DxLGYhfj2FxZy7XwAC0BPNiqu0AGkdJoWfrqZyR7s1%2BDxLpE%2Fv0jFctmbuhQilBW%2FxPyn6DbPzRv5ziFdNZfV6Txi1MYvvHkt%2F5RqaCkIkpi8HwO8y%2ByEm1%2ByTnhnF0Dl83Znd%2BMY2r6515mI4fyPOMFzCRUm&X-Amz-Signature=92fe0526521f7ad9014397cf0f1a1941ba0577a24371ac8586988f325c409855&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VOZGB5OW%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031849Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIBeX8FBv%2BmV%2FvMjgaKbPEnYsHa0KMI1FbRzcf0Or9mchAiA7QIO8CHUjLdmvJcgLjkAYy2%2FS%2B4dN9Irxut%2F4Ro9XriqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzVex9b6K%2FD7lZizkKtwDML9r3M7%2F4cmxazEiZ8zpsV83tOKzH9H5tnWhr%2FJ8RovivOZfiAkUfqz3ZJz0bqpHu2bqf3hDdE5Bkb7EJg%2BYzxSCuI0j4XZULzaNORzKNljG%2FuJHr54SIKro6b00FaOD7wtuuW6gwECPWn42AffjRZgrGkdbAUN4qhBGcmcbzVR6i9U9%2F%2B6G7zVTXLScNVhhHZCDzKPaE%2FHcbwjuxtwkVR8NVj7bs72nE6biCzrYQiuLMNJzDU2MDx6%2FYhuLB%2Brra9Vc6DI%2BoyhM7mxX3234SNme9MND2cJwMo9YxD%2F8H%2BKTr8ZQ%2BexI74VprahnNltHhpH2rCvuj5lRvHFMNanEL8QRKUgFCU%2BJT%2BtWCvczTMTxvT8xjChNsn07garS%2Fkr0GdXLIGu4hehJ4LPsnBz2tK1wtXTFuL7C%2BhJBvp4jwXb9VbalDVb8mrxpBINEgAF43cmCKs2MCsKp%2BGC6H14ivrtav2%2F%2BNXdIGQsXRpkjadqL5BPA4FSzZsKfj7X640fYR1wiht6gbmMxemT8pslljN70NS8AKaMZY74buCYdrQ0n0b4p9Pl4HK12jlFfvndzAixymkws2HK98pfjWzGmczi4Azg4aeNx5H7IdbrG4WK0n9aBTEtwRHjaGMowhIiAzAY6pgHIlig8PYVHRYcouxFCh252wI0m%2FB3H6PQm460XbjvVFer1PUtXg%2B38auM0pzuuLPgPo2iX4OmhUfE3Cud5LLfzk7P8zOYjNFtGZKDbjL3ddmNmrCOtQrKQOvtzwWPBMwhtpuSyk1BuuvbaT6N0AjbwCeNZRVdFRoyL4z4bbxwDyZXrGlR0jjeai3Mg98UEEryibhqWBZiK4C7Sq1ulhyrU2r%2Fu9%2B%2BY&X-Amz-Signature=9a5d71678f80af1b8258959c4ffc1d7634f6f9d04c167fac9b9b5c17eb242ddd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7ACRS5%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCPCPAs%2F0mEtEgxxT077cT8zgl0%2BLVlVH%2F40Hy4wvsnpwIhAImBFp%2BHFDbbaAyHB%2BSsWTCy9K0LE%2Fnt63RFpcT1tAErKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzG2dUeptuErIv%2F9YMq3AN5DW2xb5%2BMNMlSMmAF7jCVZddytoQ0r3TdkpEC2%2FO28UNoQc%2FWNIXfwAcyi93QA%2Fa%2FclNYe52n%2BhfKUGZNuy4WSrxonZ0uDtOHkj0CdkWAWPiFZL%2BcOwSSqcc32mVBFuoUP7JAuN24M4%2BYNmDb9foOyG1SyaW1l9Pmf8hpPG107NdF1I7brIV6L3xjha2BoKNkjkJNz%2FEatYX05uFfJkvuxL3FlTFgLgZ27RhrgdqyqvNpBPFo4QKDjKkYUAReqqMAJWZjOjrBO8wwJzFi6B%2BhoQYRlIyoGatXkuIv9An%2BG6Pl9%2BVm7u4N3nGplTWCvi4zCDiyoK5ekHfExeoXCjhfenlsOLbo42sVW4hp6uVzbaYP%2FFJCG4gFHpxTKruGrEipEla0Wdcn7QPyo57rgcGap1h6g7SQh8f9WvYkhY%2FB0bKJGqj7RXVGWdhUz0keHvoHONAhK%2BdVLL8%2FgtIyh%2BP557rQynrPTbGpbQMd%2B5uFANSh%2F3XDoUtMTXX1063TImpkrdOQphfvKzrLfk2KDsgJoPlOiKY0%2BCZMY%2BNP4cgcVZ%2FE3pnVT5aqSs4SCp2uyfmtskE%2BqqZ%2FTrNn5ZSDpkHjOlTqsk2u6EGvfK5ebGI2ZriBv%2BZeSzs1BNEVaTCZiIDMBjqkAZqTYogeGBBcwRBXLW49Mo4EN07I7HOIFYtTx4U%2Bji6OM5YR9iXQpNXxb8NhbJne%2FETdaDyW300eJjHArUeIQskU9GuNE6bZIRCIKJ%2B90xzo%2B26Qu%2F3bUzle4ziJAccvrP8uBOXfN6iC4F1ft9BODhmEMsDV8pjuNWbYFXjNIrSaK2Iz82rCZGDuOExgXwWHvNPpiUY%2BOvS9qaMWypfArbWubAVw&X-Amz-Signature=13f7fdabf2e5ed09d7915140689882ba7da306f7b72ed93ae3e30d17aed2016c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7ACRS5%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCPCPAs%2F0mEtEgxxT077cT8zgl0%2BLVlVH%2F40Hy4wvsnpwIhAImBFp%2BHFDbbaAyHB%2BSsWTCy9K0LE%2Fnt63RFpcT1tAErKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzG2dUeptuErIv%2F9YMq3AN5DW2xb5%2BMNMlSMmAF7jCVZddytoQ0r3TdkpEC2%2FO28UNoQc%2FWNIXfwAcyi93QA%2Fa%2FclNYe52n%2BhfKUGZNuy4WSrxonZ0uDtOHkj0CdkWAWPiFZL%2BcOwSSqcc32mVBFuoUP7JAuN24M4%2BYNmDb9foOyG1SyaW1l9Pmf8hpPG107NdF1I7brIV6L3xjha2BoKNkjkJNz%2FEatYX05uFfJkvuxL3FlTFgLgZ27RhrgdqyqvNpBPFo4QKDjKkYUAReqqMAJWZjOjrBO8wwJzFi6B%2BhoQYRlIyoGatXkuIv9An%2BG6Pl9%2BVm7u4N3nGplTWCvi4zCDiyoK5ekHfExeoXCjhfenlsOLbo42sVW4hp6uVzbaYP%2FFJCG4gFHpxTKruGrEipEla0Wdcn7QPyo57rgcGap1h6g7SQh8f9WvYkhY%2FB0bKJGqj7RXVGWdhUz0keHvoHONAhK%2BdVLL8%2FgtIyh%2BP557rQynrPTbGpbQMd%2B5uFANSh%2F3XDoUtMTXX1063TImpkrdOQphfvKzrLfk2KDsgJoPlOiKY0%2BCZMY%2BNP4cgcVZ%2FE3pnVT5aqSs4SCp2uyfmtskE%2BqqZ%2FTrNn5ZSDpkHjOlTqsk2u6EGvfK5ebGI2ZriBv%2BZeSzs1BNEVaTCZiIDMBjqkAZqTYogeGBBcwRBXLW49Mo4EN07I7HOIFYtTx4U%2Bji6OM5YR9iXQpNXxb8NhbJne%2FETdaDyW300eJjHArUeIQskU9GuNE6bZIRCIKJ%2B90xzo%2B26Qu%2F3bUzle4ziJAccvrP8uBOXfN6iC4F1ft9BODhmEMsDV8pjuNWbYFXjNIrSaK2Iz82rCZGDuOExgXwWHvNPpiUY%2BOvS9qaMWypfArbWubAVw&X-Amz-Signature=f09c0e1a65b9096da6eead70e067a341f90fd49155335c8c5c1d38f45e169c76&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SX7AKBXH%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQCn17Sw8EhjzN8ie0hmjCKqy5GauEDC9Kdx7rED0rPyFwIgYeK6X%2FNQlQrerjy80mZH663%2B9%2FJ1bOHN7R0vDBbDB1wqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEGM1eDmekRvBj6oZCrcA6ecdkFFN95ZX7d1fitCmi0Kbejz3qZDwec4pLjRmgPF8VkyMGNCBrGYhm8NyCeD9FcpmjtRv7Xf0S0Jhq0zKIddGDPDz8wr9%2FzsuSlTMFdK%2Fex3bvRk07RokIosyI5eoJy9XCEJTMHyF2g%2BE9f9AiNGezcGocohQwjsgxxQWrQ0rFV5BZc4hEwdQdieg5nQGyEq4vgF8r0B0t54V4XFeK3xl5aUs0eOsejfyRi2vnczOmvSuDAKy4NROdoOzxwNjziDEcZa9X2khFeW43hlOUBnLKX%2BsF982D7ZGDw3o7KmQrXpeip%2FOrp5MEB6efdQl4%2B19pUDB%2F1s10odt5E3GpHYNomqX0BI3m8jKIqPIcN6c6QG%2Fz8YznGHV1qytwyQQZ4JhmePFhRgL%2B0cySFxzc4xs6xTcsMwpRLcvz%2BIa2Cn0ZH47ivytn7O26iiVgN7937omQ%2BsVjO1mvSY4lp3orz0Txx8yUV5Zt%2FmQzBAyGsliyQmb5%2FZNE2wROAd1jq6ripwoFjXFmkqsvOrpLGixnGze%2FfG8YD6pUI%2FCz9GUfMZseT%2FhpEP%2F8z3EGQuRv35xpoGR5o70HH2eaiED64dkaqMGLxRaHr2xUFw6ZlpTM21zm3I%2FUDo8JCxZzgeMNuGgMwGOqUBC4wjrz3pl5UFi3Ke%2F4P7OdF%2BmTE7%2B9Jd4Z5IWzcpWwPBpffl4M9uJy8eEx4r0U4I%2FbkTMM1BipC7ueMt9PrGhsBE3WI5rcqRp30zIbuAjYjCWoZw1D9%2B%2BU9MTRkRz4lsIMZc1VyTJrrat8gJQv3WP%2Bvuy6ZHjHzvIoz9sSxuEMjU6HVFEMXF3TrOfizr1J0HJHu7MrigIcry8cYHUXj%2FWxzU41IU&X-Amz-Signature=ade71a0bb3f57cf00a221e4ce7d5c0a3fc22827297ef511bdf77e44b42b3d23a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7ACRS5%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031818Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCPCPAs%2F0mEtEgxxT077cT8zgl0%2BLVlVH%2F40Hy4wvsnpwIhAImBFp%2BHFDbbaAyHB%2BSsWTCy9K0LE%2Fnt63RFpcT1tAErKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzG2dUeptuErIv%2F9YMq3AN5DW2xb5%2BMNMlSMmAF7jCVZddytoQ0r3TdkpEC2%2FO28UNoQc%2FWNIXfwAcyi93QA%2Fa%2FclNYe52n%2BhfKUGZNuy4WSrxonZ0uDtOHkj0CdkWAWPiFZL%2BcOwSSqcc32mVBFuoUP7JAuN24M4%2BYNmDb9foOyG1SyaW1l9Pmf8hpPG107NdF1I7brIV6L3xjha2BoKNkjkJNz%2FEatYX05uFfJkvuxL3FlTFgLgZ27RhrgdqyqvNpBPFo4QKDjKkYUAReqqMAJWZjOjrBO8wwJzFi6B%2BhoQYRlIyoGatXkuIv9An%2BG6Pl9%2BVm7u4N3nGplTWCvi4zCDiyoK5ekHfExeoXCjhfenlsOLbo42sVW4hp6uVzbaYP%2FFJCG4gFHpxTKruGrEipEla0Wdcn7QPyo57rgcGap1h6g7SQh8f9WvYkhY%2FB0bKJGqj7RXVGWdhUz0keHvoHONAhK%2BdVLL8%2FgtIyh%2BP557rQynrPTbGpbQMd%2B5uFANSh%2F3XDoUtMTXX1063TImpkrdOQphfvKzrLfk2KDsgJoPlOiKY0%2BCZMY%2BNP4cgcVZ%2FE3pnVT5aqSs4SCp2uyfmtskE%2BqqZ%2FTrNn5ZSDpkHjOlTqsk2u6EGvfK5ebGI2ZriBv%2BZeSzs1BNEVaTCZiIDMBjqkAZqTYogeGBBcwRBXLW49Mo4EN07I7HOIFYtTx4U%2Bji6OM5YR9iXQpNXxb8NhbJne%2FETdaDyW300eJjHArUeIQskU9GuNE6bZIRCIKJ%2B90xzo%2B26Qu%2F3bUzle4ziJAccvrP8uBOXfN6iC4F1ft9BODhmEMsDV8pjuNWbYFXjNIrSaK2Iz82rCZGDuOExgXwWHvNPpiUY%2BOvS9qaMWypfArbWubAVw&X-Amz-Signature=44a3ffb93856b64cfa139bc01c95803e9f72473376ec2c65ceccff13f913d871&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QKCV5LAS%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031854Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQDpfyl%2FT1hK753sSj8HDu3Wd%2FKD9QEnWuX9%2BdL0jWNRYAIhAKv5H1RQTE0diD256wd7lMxHuGwxEWTmbnb9XLog5DJWKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzZlP80zESepK1KKb8q3ANk85kmc7JMqhgkkgeRMdXQFSpmXMyite51f95Rnx5WPrvtZD5KZfcLIQGNHfwwIxAQHf8fRs5z49ddeL06kS40L0SGTzFLO9Vv0RlNjudJXeJDWnD3%2B6u%2BSvU528%2FElRQhNhfrx3UZJL4d3h0s7X9VIrdRybBQG6PF1nOpcs02szqeXgDAnUeP%2Bdbkw2rLxiiZS00vkzlO8KwMJ9gc2WeYw5waPG7Ans7cqxwYGvfj7e5TRvFB9tchrkwW%2FHVbUALaer%2Bieu%2BoLh4ppd30mEh%2BRzL3r%2BQWVG0l8NozQS5AasP7L3TA4Hk%2BbKm1hqD%2B43rzQiGO%2FRZlSfThnXu69Aasiu2SATZfwCUacGqFkEJ%2BbUH6WpJNHPGIzjsSk9ZZj1b5i7uOyfhN1exO9pdIxPkkEGbctrMZh0NF9BhjQdMdSsMxLCFcAN7GwfSyb74oa74l0g59y40aMi%2FGG0dT%2Fu8f15GS1l4Ucri6%2BYMFlZCMXm1FWDLWL0P5Lld2G762Z%2Fyc2DtjMGecILBHu%2BiUELTGGoIqlTfyO0upxygcsb2d%2FVZs5qr6eI88XOvCPqntQyU0jeistR1F0qlQst08PjPkco87yn56v8nkhITZaccw3kk6kNU6laTeRQaxczCziIDMBjqkAcp9cta5C%2BR4x2Uz2Qx4usnqyh%2FVZG6DFUY9f0IwkL7bUH4cileiikqa3qyfgNt8goNc2tV%2FVYtbRhZb%2BSpbFAyH2BFra7rV5lETP7VzX7n%2BYu%2B%2BEGsbJ3zGY%2BPpaDP1zUgWD2Ey%2BIxdjqcJmuANl%2BUGTvMdjTdZHQgzd4l3%2FFgQFpEVDhIz3%2Bv9eAYFgMa2X%2BgBxleObTiFypi9StDi4wHZA9gT&X-Amz-Signature=7a15a4af58eee19be02b9db2b7f35b632b06073c539dd5eeb275e02931fae978&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWBFLXIX%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031854Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQCZh22ifI0Ji0Oy%2Fqb6u%2BHLun1gzBKMenUsaNx7Akl64wIgAl1EcmFtiYaKzMhBJ9crD7iIBmMRXyciGb49%2Fpe3B5MqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDElj0AwN8wv1PGOkEyrcA2caRcUvAGE%2BImeUWnp8CUCXRjnLBgj%2FAunUZnXKE%2FwznpewN453xYcS9%2F1eSctRGf%2FXy9QFDbiz%2Fu1UJ5LQTwO%2Fi%2B23hH1JfqaMbGa8%2BDVSBdRsaJ0KL%2FHFBvwjfVmObHxpNZ7QU1ffG9vHgfNAVyUZzMa%2FRcdX3tMsBlOXSoBrUUeDm%2FxnOVfqIEY9tj1hydsFUMgVyeOzLzpepu6ek2Vm%2B5WUbuw8IlcHEieQBybFOmO%2FBCO%2F67ehFrRLxr7%2Bj6OvXGEAMnQtmLrOUEigCtvUsQo6lmOecez%2FdOHHzTrnoG1d5RanQvCqT2WRqNOWEKBxUGFIr80Rbi2ToONpBzvYRh6vjQVucEWEc2UXZRPGo0VbRJTJZLgt%2FLM07eBbYINN1WtjUrlMfsASpO2g0i5LVxMesegTefoeqEbLNoOHt2f6us7LTnxZfEig48ccU0Pm2%2Bt3wHYF9iUdM5qYuoBnY4YX5%2BLIkV%2BWeG3dpHWdnYS%2F98l%2BKK0dQUyk49VXPgF0HXf2TrPU4j%2Fw38u4zgTZHMdDclIhgoneavyT3rPKUv8oi23RVTrtpAcHmQwe63hJ864WP%2BJeBSutrcFWi7Gq%2BNGISF%2BinPLwC9eCkJrWmXIYb%2Fy9IlVPOG04MM2HgMwGOqUByRD0HNt5U74BFHwxUdihV5ZUWNVs035lfeidwco0NuAk8YmWhJZ9YysEoGI6GGORu6U1YEuQDKsD%2Bz%2Fy8B7TDgjPZpm6IS%2FAY69KnvKKSm50dnRkikFzYunCHpTttuiNwOgM0SDrPx0QnNr7bKFCGZUjI%2BM5imVho5qk6H0drMBGvnidg5y4cq%2FVoepo%2Bi21alG%2BGBDKiZwIA23wgZlZZxDzQt6B&X-Amz-Signature=cd857f67d72d0d5eb4ae9f76e1f90d24d96cecd424ad52d819d0f426da160ac6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBDVP443%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031855Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIHvGOdOf%2FteTWIRWjxzYNnRqy%2F1jSKE4WBOUE%2Fxq93bAAiAm8jmQm2OKbBNPTdpsSRNjupsbpQ7DWqH%2FSnB%2FykcxjiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoSX90vahzsa6usC4KtwD63RqSdTcDiTa%2FLG3GtM6wzt%2Fr2LmofgC7fW2aCB0hKoBq3wx5%2Bsjh%2BYOMGYIKPXj0ujZ045eoRyVRXXLrYIJxxydnCtjDlK3%2FSTkbQtBXMiCyfE6QHGuIgdaT9%2BVjo7BqU8J%2BsJFoZQS59%2FWtPkmhbpMNWG7dDGVxWru31paUNQRz3C%2BciB5OLbiXG7wgY8zo5w7zWoyPnlD%2F0M2L5BMLTQeQ5X8nMfVUIoUg9zDt64Z9yxMRZ1trpZJGHc91olQZaIN1q82CaRd4HKLpZ17CxnnIJJ%2BtntYYAWO8xjKtLW7ndoE%2Ffjo3FuQzFcZmQUcxg4h2yK0D1duwopylX8hnzqchZsmhjE%2BigvOvDDhTrWPk8D8x22noXGeqjSC6KdHLwKzU%2BDr%2B06Q3rcLLsgPmw9tgBhaoAC0tQ7AqCSdsjBO1RFcvmGi2alEhD%2BQGoOsCP9%2FmIX5Sv1Vm5AHbddqpKUsXZzhxWITxNaWnxAGCYQXlxCeCqcj06TC443Swl%2FaBovIqLw2GnaVKRSrj5%2F3pDxwWPsxSpr8Fx7KCutmxSwtMvzQfVktUuLZRfXB1IlVJupoua6KiZI4LdNEVWV1PEqc7seuBmAtEp0H%2B99JeGySQmfCPxJjDriv6NcwhIeAzAY6pgFQl%2BBoBckbApCCTdf5avTqgKf0QsxSbuZ4%2FMdUJiuOxZEs4kL8V0dAiMUivRKhwX2ZbX2%2F53R3IyFb32HlVUJ7eBhgpJBWD9mM6cel0lqbaBQm2%2FimESwECuCNklUQawXHFejQjsLW9FRw68UcCqh8K7YjYebBzWGjG7poFJe%2FW14VpIwj7MrSH9u803hEr%2FAGCnbcyNecy9GgHqFF9CRFFsjeFrou&X-Amz-Signature=a3e0ecc794b3e2cac7a232b002f05b23a31c0daed61b779e54c4301fa11e8add&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIDMV5SD%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031855Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIEFCcA6YRp%2BbbCwOvRpbLk1WuFQEyNk1oL3mSZgJ0DRzAiAwn1RCfPHlvhUAb%2FTSP1neDdEwQ1H719SaaP1cDd%2BcVSqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKRyvvTdIH5kYVd6KKtwDo03uEtf6caWtWOLQHA%2BVEDJXtx91KpwqhmS6Rkm6w2kBDY7H3kN84lfcLfOlTjEpiz0XUyUaiMIZ%2BjVytfycbtOmA0HEXPfvKFrjHL4h1JHbRTY%2BMXt0gBn%2Fjqn2krmCDOj3ZJ0JS2TCiK0NsofovmWYdBTTJwMxzNu8jIxFcc4gENLQ2gtPOzFNP6OHq0iBshQPZDUlB14NCVylh7J4zTySVg%2BkWCNHLKF4fV5IMBA0uY%2FoFNstQ6jERl8VfJZDP2nhh9UVXcG7Q3YaBM3ToRTkI9dAiDtTpVBIqrOw5%2Fh0ELhLFqASLCTXI7TL5MQaNyk6LgZ8YrleY0bwoUVrGqbX%2B1SIHD1BmKP1UfuAV9POEyJdEVPhAPY65kUjLV7SjLPlNgmUDNTrUEU8G47g1esJbs7VYgmDT%2Brb2vLpdhvfC41AD4NJXxr69w5OZYfJT7ZIRigNfXHs2C2AN6vgLTirRm4jpwFMq4Z6f5jbdvp%2FRI23gROPldJTrvVB8FWPWBbvGJO8eWvjhp72TCt9hI%2FlWetE7GAPrpYuZnk2pKMsn9PfyaRIFCgqbkWdGFlQE9mVO8q3t6Cp9Q%2Fq5YIuCnl19APgPYMPQuZaO%2B0ghjC3Fmq4Yt2r0sGUeEgwh4iAzAY6pgFXBM0UxuoxY%2FmRVsKCuLmmZ3RW5eCgatm%2BUqUgZ36DpASvWmGVq5uW4sj5Eel9Al01IMBchtLQCmkvx2Vbd7mb66%2Fejd6vWZbwg%2BFZtpH7LgpWzrGl9SyezsnFAEHA57PjS4IFY72udvQ5vCHCwZ7JNSgNcggJMUfH48Wtu92E%2Fc%2BQApp6K4qrAMqUF1rMLGfcxLUnzXHJtgS1rbtGYsItweHMueaH&X-Amz-Signature=d46b45889d382f52e9c177d92cf94f70680b0bc44d3be592088972184a2a6704&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표
