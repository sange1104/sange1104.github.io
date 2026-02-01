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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QG5M7UNY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032813Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXZg9B%2BP63Pa2BkgOKr2yjy6e5IIsU15Jj2YULi2QGSAiEA4StKVVV8m6HoVN2W%2FtEGSPVSY%2BmC2aQp4mTy%2FwNaR4AqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFEf4a2VriU8o%2FI7qyrcA%2BvsGjQicHPJCDKPQ9t8kYtSNVS5RBbcSwb0rrDSzlCtVKaS1x1L05rmot1o%2F52Oad3f4ybrs0mLZMuC4nRZW3ET%2FxihBRczWXppZb4CSEB0w6lm8kj2TSA3%2FjLjYqhJHJBByBdHazRa%2BtZ9xFmzQhpUXF%2B8MnTxSxuWfhcp2KTAd%2FX5bPSRHtB6iI8sqz0obEwfilhkP8vxcosQ9Yj9uuoD9j2QOgHzMK9BhhO7%2FnK27w67gsa%2BP0dPibH3TWSCP%2BHa76rU1VdiKnNGS2bCgC4Zbbh%2Fad5RVYR49ipB4XS%2BEPuEbNDpOfcEFw%2Bp%2FcGVyw44nx12W%2BL9O9lHCoXFYOTDKpSdIY9q2jZZ60fuvHQvFbPMafPAugt1Ztu7BBYABhR8cuD5Zrb%2F9dCef9v%2Fe7XJqoHCIx4XS8o7R0Nz5X4kK9u3LPp%2B5MLYwX4Rekx4IWGTtDPFi2Ko7CITb7CCH0ZdO%2B09YMQCJrZUWXrfeIcpHIAjm4ZNKWqfhgrfzHsvSop9OKgIBdJGnGJ3TGBjNv7Pg0vF7hmpB5rJrJo%2FMQwtrZn1f0EZhxDlTQ6QNfjTTQ1VZqq3leHJeYNMsHyeLKN280bQb1dlSfyqz%2FidJL%2B5Wi%2BlWIKh0Yv%2FKYI1MOHx%2BcsGOqUBM0JKgsRs0fNTUzz6yflG888ioNL6OZtrDB%2BiohOvUWLA0UVyIAalszGs9ombPql8KS1w8yX2D8nm9bcncPPtMxowYVGJjeROpLzm1%2FCcBU0m2a2D%2BVdQYdsU8DJvJTLfdLd3lhQnWvZ6DTsJEJ7aaKUlf8o01x9Q3v5zp7L0JuC1eXB2p%2FfUAISmMcOOXBSmvjJjyvcHvmIF39dN7vSrlsPlOQiU&X-Amz-Signature=8ddb6077d12c83c7a44ba78019da1fff4af55600544552dd4cde7dfcb635c64d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QG5M7UNY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032813Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXZg9B%2BP63Pa2BkgOKr2yjy6e5IIsU15Jj2YULi2QGSAiEA4StKVVV8m6HoVN2W%2FtEGSPVSY%2BmC2aQp4mTy%2FwNaR4AqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFEf4a2VriU8o%2FI7qyrcA%2BvsGjQicHPJCDKPQ9t8kYtSNVS5RBbcSwb0rrDSzlCtVKaS1x1L05rmot1o%2F52Oad3f4ybrs0mLZMuC4nRZW3ET%2FxihBRczWXppZb4CSEB0w6lm8kj2TSA3%2FjLjYqhJHJBByBdHazRa%2BtZ9xFmzQhpUXF%2B8MnTxSxuWfhcp2KTAd%2FX5bPSRHtB6iI8sqz0obEwfilhkP8vxcosQ9Yj9uuoD9j2QOgHzMK9BhhO7%2FnK27w67gsa%2BP0dPibH3TWSCP%2BHa76rU1VdiKnNGS2bCgC4Zbbh%2Fad5RVYR49ipB4XS%2BEPuEbNDpOfcEFw%2Bp%2FcGVyw44nx12W%2BL9O9lHCoXFYOTDKpSdIY9q2jZZ60fuvHQvFbPMafPAugt1Ztu7BBYABhR8cuD5Zrb%2F9dCef9v%2Fe7XJqoHCIx4XS8o7R0Nz5X4kK9u3LPp%2B5MLYwX4Rekx4IWGTtDPFi2Ko7CITb7CCH0ZdO%2B09YMQCJrZUWXrfeIcpHIAjm4ZNKWqfhgrfzHsvSop9OKgIBdJGnGJ3TGBjNv7Pg0vF7hmpB5rJrJo%2FMQwtrZn1f0EZhxDlTQ6QNfjTTQ1VZqq3leHJeYNMsHyeLKN280bQb1dlSfyqz%2FidJL%2B5Wi%2BlWIKh0Yv%2FKYI1MOHx%2BcsGOqUBM0JKgsRs0fNTUzz6yflG888ioNL6OZtrDB%2BiohOvUWLA0UVyIAalszGs9ombPql8KS1w8yX2D8nm9bcncPPtMxowYVGJjeROpLzm1%2FCcBU0m2a2D%2BVdQYdsU8DJvJTLfdLd3lhQnWvZ6DTsJEJ7aaKUlf8o01x9Q3v5zp7L0JuC1eXB2p%2FfUAISmMcOOXBSmvjJjyvcHvmIF39dN7vSrlsPlOQiU&X-Amz-Signature=d0a9513596d1835b1babe38ce1acb7e666548a0d4a16159af392db3ed3b641c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QG5M7UNY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032813Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXZg9B%2BP63Pa2BkgOKr2yjy6e5IIsU15Jj2YULi2QGSAiEA4StKVVV8m6HoVN2W%2FtEGSPVSY%2BmC2aQp4mTy%2FwNaR4AqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFEf4a2VriU8o%2FI7qyrcA%2BvsGjQicHPJCDKPQ9t8kYtSNVS5RBbcSwb0rrDSzlCtVKaS1x1L05rmot1o%2F52Oad3f4ybrs0mLZMuC4nRZW3ET%2FxihBRczWXppZb4CSEB0w6lm8kj2TSA3%2FjLjYqhJHJBByBdHazRa%2BtZ9xFmzQhpUXF%2B8MnTxSxuWfhcp2KTAd%2FX5bPSRHtB6iI8sqz0obEwfilhkP8vxcosQ9Yj9uuoD9j2QOgHzMK9BhhO7%2FnK27w67gsa%2BP0dPibH3TWSCP%2BHa76rU1VdiKnNGS2bCgC4Zbbh%2Fad5RVYR49ipB4XS%2BEPuEbNDpOfcEFw%2Bp%2FcGVyw44nx12W%2BL9O9lHCoXFYOTDKpSdIY9q2jZZ60fuvHQvFbPMafPAugt1Ztu7BBYABhR8cuD5Zrb%2F9dCef9v%2Fe7XJqoHCIx4XS8o7R0Nz5X4kK9u3LPp%2B5MLYwX4Rekx4IWGTtDPFi2Ko7CITb7CCH0ZdO%2B09YMQCJrZUWXrfeIcpHIAjm4ZNKWqfhgrfzHsvSop9OKgIBdJGnGJ3TGBjNv7Pg0vF7hmpB5rJrJo%2FMQwtrZn1f0EZhxDlTQ6QNfjTTQ1VZqq3leHJeYNMsHyeLKN280bQb1dlSfyqz%2FidJL%2B5Wi%2BlWIKh0Yv%2FKYI1MOHx%2BcsGOqUBM0JKgsRs0fNTUzz6yflG888ioNL6OZtrDB%2BiohOvUWLA0UVyIAalszGs9ombPql8KS1w8yX2D8nm9bcncPPtMxowYVGJjeROpLzm1%2FCcBU0m2a2D%2BVdQYdsU8DJvJTLfdLd3lhQnWvZ6DTsJEJ7aaKUlf8o01x9Q3v5zp7L0JuC1eXB2p%2FfUAISmMcOOXBSmvjJjyvcHvmIF39dN7vSrlsPlOQiU&X-Amz-Signature=4a6d61c587c4e2f57190df3fb49ee76a6938b8934ba035b0a8f8a841e2bd7b0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QG5M7UNY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032813Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXZg9B%2BP63Pa2BkgOKr2yjy6e5IIsU15Jj2YULi2QGSAiEA4StKVVV8m6HoVN2W%2FtEGSPVSY%2BmC2aQp4mTy%2FwNaR4AqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFEf4a2VriU8o%2FI7qyrcA%2BvsGjQicHPJCDKPQ9t8kYtSNVS5RBbcSwb0rrDSzlCtVKaS1x1L05rmot1o%2F52Oad3f4ybrs0mLZMuC4nRZW3ET%2FxihBRczWXppZb4CSEB0w6lm8kj2TSA3%2FjLjYqhJHJBByBdHazRa%2BtZ9xFmzQhpUXF%2B8MnTxSxuWfhcp2KTAd%2FX5bPSRHtB6iI8sqz0obEwfilhkP8vxcosQ9Yj9uuoD9j2QOgHzMK9BhhO7%2FnK27w67gsa%2BP0dPibH3TWSCP%2BHa76rU1VdiKnNGS2bCgC4Zbbh%2Fad5RVYR49ipB4XS%2BEPuEbNDpOfcEFw%2Bp%2FcGVyw44nx12W%2BL9O9lHCoXFYOTDKpSdIY9q2jZZ60fuvHQvFbPMafPAugt1Ztu7BBYABhR8cuD5Zrb%2F9dCef9v%2Fe7XJqoHCIx4XS8o7R0Nz5X4kK9u3LPp%2B5MLYwX4Rekx4IWGTtDPFi2Ko7CITb7CCH0ZdO%2B09YMQCJrZUWXrfeIcpHIAjm4ZNKWqfhgrfzHsvSop9OKgIBdJGnGJ3TGBjNv7Pg0vF7hmpB5rJrJo%2FMQwtrZn1f0EZhxDlTQ6QNfjTTQ1VZqq3leHJeYNMsHyeLKN280bQb1dlSfyqz%2FidJL%2B5Wi%2BlWIKh0Yv%2FKYI1MOHx%2BcsGOqUBM0JKgsRs0fNTUzz6yflG888ioNL6OZtrDB%2BiohOvUWLA0UVyIAalszGs9ombPql8KS1w8yX2D8nm9bcncPPtMxowYVGJjeROpLzm1%2FCcBU0m2a2D%2BVdQYdsU8DJvJTLfdLd3lhQnWvZ6DTsJEJ7aaKUlf8o01x9Q3v5zp7L0JuC1eXB2p%2FfUAISmMcOOXBSmvjJjyvcHvmIF39dN7vSrlsPlOQiU&X-Amz-Signature=a09a90e2abee347b3747d39981c24c55c8c896ac561d5a3db53c8be7d9d20133&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665AWGFDSX%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032825Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC47hADFq81M33w0WujkzFjaTCvRu10fv4b7ODpKpNX%2FAiEAqdf0uqLO1eIfnyX1N%2FDnDl8exVTfdKHfshYqWROBELsqiAQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDbPv%2BTRxIX4MU9bEyrcA5MGTLyZMRLs3D1JDBeAKYPUjl6%2BoEZlt21wZlVTDzJcIqXIwHoeIKIbQ2ufy0UzXM5jrmmHryKGuHv8OgcHnoTfgWNV59pfr1X%2FYpgzIWtgGCWTPCkukP7ZOxNbMyAGqh3oqIP4n7U9LjXgAO4eG2J8ZTTCezCTtFhMaylvjAHcfsn0N2PpqoW5laKEWjqm6K6YYor9q2I2FRPwlj7IgH%2FFwoJdS9nROoTTuDBYpx8rvhTiKkwTCjTj%2Bkr3y2GkI8iWksAJCGGGJMD%2Bh%2F5cmPPdisrTmfalB5%2FJdBy6HZ3J1ubF2D2aNvVNZdsPoxeCKq%2FXQoD0BVxuzsBJH3zQFICbzP%2Be4iWVYxNfkiR2SNKg3avhu4shcBtsNpfBdRxKoW5LZlt1Hmr18p77sjDrJ78vJ9fKlQKAHOuaUt5%2FQ%2FXxfngJAdSzXIM47AHsZ0Kx9o2v8d4VW1dNXjQkNbdIYxga7BFSjHSYowQb10YUzLbbs4vKt0DTVQdD0iauMmXmdG5dmFdQRu9nUcywq69A9aiCc%2BVVeYEQs73Wyp8Wft7U6oYhjTOPPd%2Bzfia67V7qC%2FLr0ll%2FtZ5FmeIdtF7JvEy%2Fm9xHVwTxTwp6dQXhX8Mnv9TOgY8cPeMKGBmyMJTZ%2BssGOqUBeEkZyuUWkaRV8pWoyBYmJCbxqem%2FzWQUhxQEKOv46lm1EDn0YQklzAexI%2BOqaw2UPFhdw8ihyX%2BpOmtMtjkhhP3Q7zEaA4za3CJQmeKAbgRwe5r3cSQcS0CzW7YUWsDfCMf9bsrkBcu2yla4UX5rRsbU7c0i6ZH8cWL0p3Tx1MiTxLWqKD%2BEuZzjE1XkrCg%2BpJMNzv4it5Q%2F7qME7n7wd6aAFrE6&X-Amz-Signature=465427736d64e37edc9ff6da8ad4a41930ed36e312aec2f7513a80e8869aaaec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X47M4DG3%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDdR0ndrvJVwSH89XRUzfuRKYm3GyWTXd6JZkEzUzaeDQIhAO2IQQr6%2BtasVqMKNtwrHkcAYMyHBGLm16OWUTSsb%2FW7KogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxH13%2BWxUrJmVP%2BotIq3ANkRUzWPSLAds7DHUkwIM8ovoZ6%2FtMgPG7UeulsgDN6QDNefCPotcTIwoTSeMc014v%2Bhii4SmkaNPehkvGf5bvsC%2BiUP%2B3bFn7sCB3oTEwnhTCioy1kqNwoSsitdtJ1KJ9b04MYgsrxZG3xhC5ZqxVplJ09rjprDdTHxamSVSmsGzjgmExImMYlXcS6NouirhLqBpgTioocZxTzasuY9g01cS%2FbiuVtyWTMr0qB41uEoKCpA7pOscWt1d8C8XYmqsIhDCihB%2BOPujNMKPUL8LbSQySiRYD60cqNAnKhO2o0ymi7wgeIoi7B8RPG8abmwwNX1s4rWSBWqGIEhnxs5s6zn9dOkAO5hKtdtC2SL6fRsFKQkFdlCDOvtK09%2BqyhjPaHSIsC1Kz4H7E2ROBO%2FkeAWJMWOiS4G9M7CPZclvt%2BwhpGI%2BOWCWMY%2FWqxBa6sgMdY2wLgUc33xcOehmAkFWTb%2BouDyoU2%2Bv70m4s7EB%2BL2fqrUcnR%2F1PZwgnVDmJDO4LqGO8dKb5D2xJuiw7MkyDehI6MpPoB6XXC53uePctniOP0FcFvHIjsVoR3f7pXJm%2BHkTsB8W%2By1Boor70UoxqUARmSRZIywQcOMBFzygeufAqy5Wzbdx8CExrfTTD18fnLBjqkAat1BQZf5YSyV79wqMvgGfddxQHvsuaVw31t8gEuRp6tSxmXrUsAvhMspZT0fMjhPRJUW%2FRXhNc5XQcTkNOPbd3qh7tZAUwbiTTTjQ6XHPkneetyBuQNNhnkcI1vncjOOt3KsYo8HfqkQ63nqf7HpuGK5EGmshaP8jmNAv7SlxL7p7Yxnxr20Kpa0QIGKyTeSIqn2Q%2BOGetG1OWXJztr6OIyI4hb&X-Amz-Signature=40bcc6a6e7a8dc500e8c869fb3e5597763fc7fd128b3be2cf8c984c72567f0a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666XROX7VN%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032831Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICMsdg89mOtZBdTK4MCfkuXebdHy%2Bcss7haJ8bMwbYKPAiEAtd3NbqLW3UPTACXcS0HUwaHVUu8qS13IbeZ7WsGhJ5cqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDO%2Bw%2BZyYVHbD0iInJSrcAygy0lYOynbbXv9SLk1RlowDIPxDAJR8wkCdDPd5hswRrFo5cmu%2F1xXlhTxbRxovCQZYOcAydDQv5DB0CEd688oIEPDc7g%2FERJIB%2B1DJz1t%2FMwE%2FJXBBR7bRvILEM4JyEGDrBnvNPpwiBwXkuQW1HjZia20jNtrl25thlFL9hLe8unOpmpCg8B%2BdbBvoH%2BXJxa14jEE2z%2FqljYv%2FbNiWwg5%2F%2Bo7zlPgk%2BfRtCyM%2FZDLxYVWnYrHBcI0xtOY26Z2CPqxPTeoXvIGR49HCet1PrPE9Qo40J1%2Bs2v38tFOvh%2B8iaOLnRoyilStYmDjLDekPpH2tEY561MzejV2PSohKAD7c36qpExC3I2KAnwnCd3nD1INrymhMe5xPB84Ob7mtQPdSw4vfKl6Vw5w6HQFYj%2BYxz53GlydHC33Cdk%2FOoEJTrKp7qvhN9shzkVYU%2BrCFP7QL9FR7pYzlbnhGjxZAmblMvvs55vHZE536gDXocoDjs6KzJtD6GnC6XqeDe3tV7zGvMojbKnH88oP1K04jR6IVGyj0NDg08buvE%2Bz4OscFu1SbzecbC3k7ZY%2FtMTlaz8H2S5PcYgF0eShA56P8ZaAEzVcSpr%2BECQ6cDUdwghNDmPs%2FcncJbdyh232NMLzx%2BcsGOqUB%2FxweSnyNJOYV%2FpKiqnGNx1OPPMg%2Fg1v8NNhRpeXanlZAxHNNbpRU6Wt5qvXz5Bjzzq52vbJUZehiZqnu11FeIE4I%2FzrNsG%2F%2BwxxMCmVC4tUoPbxNBPDl3MgbD50tqDjDaaquh1dyoUgwhEYUz1WBDP5T3mAOKqsmhk1nh6CFjihphfWZ0EVEHG2cYUFPqCtQSSNXHwAGXLfERf36ee9ggkEhMwt3&X-Amz-Signature=d7100f1866307f53cc8333dd7c5bedfcc4c121b20b15e1aee67fcfdf0a079c15&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNVUS7XV%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032831Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDiKJ7lZfZ4VIZ%2FHEdeQJnzjcqpgXZ%2Ft%2FkGru6NtS3OhAiEAyp0r82d2Ksrxi7aGcz%2F94TjB6odmUFI5ImdxGxJ%2BEpMqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSf6TXAcTOv7GJioircAwfcVb9KqeJ%2F0%2F4NWupriUw1nAAEL3V55cwtHA6MT4bQTEPEx%2Fwk%2BdIVS1%2BKfqFY6YUsaO2pGh41tIlJOTbZS7sKZ5O2rR1jT88YVJezNBBiwntItSETyAaCFGJjwEp5h1q4R8OJoGRXa4r12E0suV%2BDF3z03W8xE7jVwawhvjhQq6QY5W%2Ba5NUWsPnpFnlOTBAk05%2FhMbmiWvcHGUc0ZF0OacoSIXkrkHD0iJ5H%2FBohgzlSmBUAav07Yi7ClikXXSJpS%2Fg0KxILd%2Boekgr%2B9rSnu8Uf8jvKWs4hoxYeP4oQZijmtX%2FgU0fZOteRqQleHiw%2FLRtOtKldU4sYiK%2FZdSE2HXP4mqeKxQzWYwgPUZrpuedHObLyr14DYXRUyrM7PIKPlth%2BezF4rKoT3A5f69UZshiYVpKlS7eObj%2BvZlzWVpvpD%2Foqdy4NzdFkBBIFxv%2Bz%2FPvICtZR2huktDYe0FyntJAWO8h%2BHHNH2bOd6EjGmbh%2FEjK%2BtFrBHVFGBEEQlbaVatKtFLEfXM1WJkfaQYs3Udm790Dfg9ISbTGqXDhEUs24VZdnxaOz%2FiKN2bDTRVA%2Fl0uENByu3RGAjWSa2EYd3%2Fa%2Bw6OotPDfZuEpYiI7Xw3GXmqVfygXro8TMMTy%2BcsGOqUBze2pTVa2iSvfUvT2wLYyKKfqbc%2FLirykNMNRxUQYfoefU6%2BMbi29C34TzMnfHEweEW3v13dIvffIuX9YUjlSUaaH19nZAENn%2FuUxHU5kmL1MpRNkB8aehhjjuNapiEBrGLuDbcszdFHhea10yZZWt0E9OiEuOntz2Gg9fdcfNOus7ZxQEtTS%2F7X0QdFc%2FV%2F65dk5UCTlu%2FejOJILsaP%2Bl3LAa7fR&X-Amz-Signature=7c9fd5e5b918e5f5011da8cafb5d14d289605ff35ce3448031578ea0826982af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QG5M7UNY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032813Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXZg9B%2BP63Pa2BkgOKr2yjy6e5IIsU15Jj2YULi2QGSAiEA4StKVVV8m6HoVN2W%2FtEGSPVSY%2BmC2aQp4mTy%2FwNaR4AqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFEf4a2VriU8o%2FI7qyrcA%2BvsGjQicHPJCDKPQ9t8kYtSNVS5RBbcSwb0rrDSzlCtVKaS1x1L05rmot1o%2F52Oad3f4ybrs0mLZMuC4nRZW3ET%2FxihBRczWXppZb4CSEB0w6lm8kj2TSA3%2FjLjYqhJHJBByBdHazRa%2BtZ9xFmzQhpUXF%2B8MnTxSxuWfhcp2KTAd%2FX5bPSRHtB6iI8sqz0obEwfilhkP8vxcosQ9Yj9uuoD9j2QOgHzMK9BhhO7%2FnK27w67gsa%2BP0dPibH3TWSCP%2BHa76rU1VdiKnNGS2bCgC4Zbbh%2Fad5RVYR49ipB4XS%2BEPuEbNDpOfcEFw%2Bp%2FcGVyw44nx12W%2BL9O9lHCoXFYOTDKpSdIY9q2jZZ60fuvHQvFbPMafPAugt1Ztu7BBYABhR8cuD5Zrb%2F9dCef9v%2Fe7XJqoHCIx4XS8o7R0Nz5X4kK9u3LPp%2B5MLYwX4Rekx4IWGTtDPFi2Ko7CITb7CCH0ZdO%2B09YMQCJrZUWXrfeIcpHIAjm4ZNKWqfhgrfzHsvSop9OKgIBdJGnGJ3TGBjNv7Pg0vF7hmpB5rJrJo%2FMQwtrZn1f0EZhxDlTQ6QNfjTTQ1VZqq3leHJeYNMsHyeLKN280bQb1dlSfyqz%2FidJL%2B5Wi%2BlWIKh0Yv%2FKYI1MOHx%2BcsGOqUBM0JKgsRs0fNTUzz6yflG888ioNL6OZtrDB%2BiohOvUWLA0UVyIAalszGs9ombPql8KS1w8yX2D8nm9bcncPPtMxowYVGJjeROpLzm1%2FCcBU0m2a2D%2BVdQYdsU8DJvJTLfdLd3lhQnWvZ6DTsJEJ7aaKUlf8o01x9Q3v5zp7L0JuC1eXB2p%2FfUAISmMcOOXBSmvjJjyvcHvmIF39dN7vSrlsPlOQiU&X-Amz-Signature=1c3d200b58667ef958ba2143316bcb97ee82a45497ea1b9793b5c4cb00ad1827&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QG5M7UNY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032813Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXZg9B%2BP63Pa2BkgOKr2yjy6e5IIsU15Jj2YULi2QGSAiEA4StKVVV8m6HoVN2W%2FtEGSPVSY%2BmC2aQp4mTy%2FwNaR4AqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFEf4a2VriU8o%2FI7qyrcA%2BvsGjQicHPJCDKPQ9t8kYtSNVS5RBbcSwb0rrDSzlCtVKaS1x1L05rmot1o%2F52Oad3f4ybrs0mLZMuC4nRZW3ET%2FxihBRczWXppZb4CSEB0w6lm8kj2TSA3%2FjLjYqhJHJBByBdHazRa%2BtZ9xFmzQhpUXF%2B8MnTxSxuWfhcp2KTAd%2FX5bPSRHtB6iI8sqz0obEwfilhkP8vxcosQ9Yj9uuoD9j2QOgHzMK9BhhO7%2FnK27w67gsa%2BP0dPibH3TWSCP%2BHa76rU1VdiKnNGS2bCgC4Zbbh%2Fad5RVYR49ipB4XS%2BEPuEbNDpOfcEFw%2Bp%2FcGVyw44nx12W%2BL9O9lHCoXFYOTDKpSdIY9q2jZZ60fuvHQvFbPMafPAugt1Ztu7BBYABhR8cuD5Zrb%2F9dCef9v%2Fe7XJqoHCIx4XS8o7R0Nz5X4kK9u3LPp%2B5MLYwX4Rekx4IWGTtDPFi2Ko7CITb7CCH0ZdO%2B09YMQCJrZUWXrfeIcpHIAjm4ZNKWqfhgrfzHsvSop9OKgIBdJGnGJ3TGBjNv7Pg0vF7hmpB5rJrJo%2FMQwtrZn1f0EZhxDlTQ6QNfjTTQ1VZqq3leHJeYNMsHyeLKN280bQb1dlSfyqz%2FidJL%2B5Wi%2BlWIKh0Yv%2FKYI1MOHx%2BcsGOqUBM0JKgsRs0fNTUzz6yflG888ioNL6OZtrDB%2BiohOvUWLA0UVyIAalszGs9ombPql8KS1w8yX2D8nm9bcncPPtMxowYVGJjeROpLzm1%2FCcBU0m2a2D%2BVdQYdsU8DJvJTLfdLd3lhQnWvZ6DTsJEJ7aaKUlf8o01x9Q3v5zp7L0JuC1eXB2p%2FfUAISmMcOOXBSmvjJjyvcHvmIF39dN7vSrlsPlOQiU&X-Amz-Signature=29853646d880790a45f0f035495a5f56a1b024c4d6c142de27da7e243bb34a76&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UVXGXNHO%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032839Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICSJosle3JW%2FMRrFeCSU3DFk6nbZkd4sK7JyPgBtrql%2BAiEA0yGXx6RcFu8pjZ9zOJ3YxfxyGrO75lMYYa0OtmQEmBsqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNTbycwFbj7gujFroSrcA6aiCPVilXsIaAGebE5tYcl4b2200tdo9%2Bs9FZLOGB6ijEkYUif4qvmZkO3eOlTUZ4Oc01wozBhyHdmXFFnNMphuZ8g%2FKXfw0dhBGfb7bT%2F4%2Bb11z%2BfRiMjfMwaTn0jFTHg8rEeipPEwZy4tELvk%2FYrD646bmUpi%2F568f0I4Vxmvd4kunOCwPMglgWJn2pGgqi6pDkzM1%2FdIn4qx57dztBTHcYjCnQ9Zm%2BxGzo8i%2BYpRTcoCVMmlFUSoAcxkjf6ss9A9nHd6DOHuvnHVwDBhob5sBN4d5R%2FVHgPH%2FMxo%2FfchN5CdHMeLgWgey8sui%2F%2BBYUegOOXSSqEf5Ikiq54F5vlkAK1v9ehiN0m7NHxarQXG3mYqYEgptvt91BW9NIEj8PsjMPYjTl02Hd9hy4XTpYyjXzS5JAjBj1lIQ%2FINEe746r%2BjEaGhSz61kgeUTVGkfk1yEiIX%2BZCVSbs92qNUFjYoFJjzFyOIGUoQR7vzKEqJqMG3QaUPhJ2RSASL15Cp7k5fH3kXJsvTzDPNoCoNdD4LfhmQXh3F0dexKvdNq%2BCPvEdidV7LcMHI%2BlZbn%2BzaBdld8cSxefFVWq1m5uNh%2BFRs9Uuaoz0MyPAopI9HBSFbB9aICjoBzMetjsTQMP7x%2BcsGOqUBjiKEq3hBCvLLLDHNayutSs1qg9%2FT1Dq8XDVDvCaiLxolzE7vJeDsVBDj2FY6k1wfgJlt5oF3JnttJXW%2BzRzuhfspBNOj%2BgSEfVVZY8j2%2BI0S%2B6ypsTuE6cUq%2BS0UjkQgVRSAiI8xOx%2BMxcIk0du4IYAUYy%2BGJJjiYlBshpZgh1Q%2BkoyZklGCzwHnVvnsJpe7HXfT37obLd9FF%2FkGciQI3%2ByIYFyp&X-Amz-Signature=cde29b923f7de8548b791f8018b4ff1611032b2ecdfd16adf43be84e1e5ad51f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QG5M7UNY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXZg9B%2BP63Pa2BkgOKr2yjy6e5IIsU15Jj2YULi2QGSAiEA4StKVVV8m6HoVN2W%2FtEGSPVSY%2BmC2aQp4mTy%2FwNaR4AqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFEf4a2VriU8o%2FI7qyrcA%2BvsGjQicHPJCDKPQ9t8kYtSNVS5RBbcSwb0rrDSzlCtVKaS1x1L05rmot1o%2F52Oad3f4ybrs0mLZMuC4nRZW3ET%2FxihBRczWXppZb4CSEB0w6lm8kj2TSA3%2FjLjYqhJHJBByBdHazRa%2BtZ9xFmzQhpUXF%2B8MnTxSxuWfhcp2KTAd%2FX5bPSRHtB6iI8sqz0obEwfilhkP8vxcosQ9Yj9uuoD9j2QOgHzMK9BhhO7%2FnK27w67gsa%2BP0dPibH3TWSCP%2BHa76rU1VdiKnNGS2bCgC4Zbbh%2Fad5RVYR49ipB4XS%2BEPuEbNDpOfcEFw%2Bp%2FcGVyw44nx12W%2BL9O9lHCoXFYOTDKpSdIY9q2jZZ60fuvHQvFbPMafPAugt1Ztu7BBYABhR8cuD5Zrb%2F9dCef9v%2Fe7XJqoHCIx4XS8o7R0Nz5X4kK9u3LPp%2B5MLYwX4Rekx4IWGTtDPFi2Ko7CITb7CCH0ZdO%2B09YMQCJrZUWXrfeIcpHIAjm4ZNKWqfhgrfzHsvSop9OKgIBdJGnGJ3TGBjNv7Pg0vF7hmpB5rJrJo%2FMQwtrZn1f0EZhxDlTQ6QNfjTTQ1VZqq3leHJeYNMsHyeLKN280bQb1dlSfyqz%2FidJL%2B5Wi%2BlWIKh0Yv%2FKYI1MOHx%2BcsGOqUBM0JKgsRs0fNTUzz6yflG888ioNL6OZtrDB%2BiohOvUWLA0UVyIAalszGs9ombPql8KS1w8yX2D8nm9bcncPPtMxowYVGJjeROpLzm1%2FCcBU0m2a2D%2BVdQYdsU8DJvJTLfdLd3lhQnWvZ6DTsJEJ7aaKUlf8o01x9Q3v5zp7L0JuC1eXB2p%2FfUAISmMcOOXBSmvjJjyvcHvmIF39dN7vSrlsPlOQiU&X-Amz-Signature=6ce52c4e3a7e5f26b85b1b3c8467d318bd817440a7717eae1804cf423b43693a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635Q65HWT%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032839Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2FCYFeuYbHv3C4dkTmHZZhE8EMhX%2BAOKmM3frFjdCZMAIhALEgl8OgXaQwo%2Fc59Hwftq2O5cBxAb%2BPiRyadrBNi6%2FMKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgycLbOUH9zzlkeLcjcq3ANNMHGQVdxvzeKFQc2sAvm6nBMmIsfwtAV%2FPYgKyGYtsm%2BqWj8kFz5eaCCvzh10pg014%2FSNCrl7OYZqRxLo8knHv9LG6AmtNzO8xthhoh2igsPF6uhyG4ZBZoyOXRfVpQzkzhIkBPR8Mszf6deQTTBg%2FhGC5gxbWN9MAU6XtrvlZvPvvyH%2FRV6OYbHyoWU1hhbNv1vqYefRGVDqKo7RQBrL267kfExUulImtKh%2F82mkjPAdPQnzdKJtJVCnKJ975Z%2F17zqeqqkXNmwqJepwWcEawV%2FYElqgcUAktP0OPugSFz5pTXfp%2BzOo4mBTYNKJg3x3XtS1SsMfJN%2BLAEQjvthCQkLW4f5ZTblqjp7TmjuVYZdc%2Bu%2BE0DVOwJUuNXPY%2BBEVrj5%2FJyCGSiVuhofdGJesPHWe6ohXNIPUre7tvcHRtucd7O9l6NCB%2F6OAoaK3OSkuUnz6MCfmHPQ92DZaanqXyZTT3W8IeETvXDM3zGdcZSImzGvGhVqyr7tWlPrV5Y05cQXFbMvRYJViMO%2F5MmEm0jnh5he2xm5dywg9H0Pp76piHP5WMsuvgNY2g1Uvs3Hqm2CvZTgEZamFSh9zM7xRFTyYTIIxN63fpRfB4dvMbHlXNJVi8gxBNgiZDDC58vnLBjqkAS4eMfTG1KyBeczXx3YlhQnko%2Bilqg2k82QMRAJDPUm%2B6D%2B%2BGAAsSn%2FPD6Jt4537V1VMP%2Fa4gJ2EpcgVedWXl1Ln4SN7qH8XGaIMSrTCwor9UHrBgmIjisJ9oslPldOnhxjGlGSPKF7WUPfPOb7M%2FBK1E5H5iLF9PSHEtLgMDmkQSilTsZ2Qnsf1yEVJ4t9ph%2BjWwFp5nJ3XiJ0iwyscde2AeMcz&X-Amz-Signature=baf22e0bc00132e5327a0e47821225cefd6c92ae10ddc5a1bfe3e7e486a2a9a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V5SVEBPD%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032840Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDaG8zLHkTKpXV5PUNAFXpNSqtspMgTNdKMicAAPkj11gIhALfVTeDRWz7vOs5fRPBEc6xFg%2FiGCxpzkHE7%2FMvhyp9TKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxGnFBEjN%2BNth7LHUkq3ANRCN5DIDl8kOXMeHIMe6uGQEZ39zrKWm0a%2BxxRipaUk5AusfDMKntZciMRpWX5J43wohhJpzdeuw3lS10ZDjPlLB60SDiPwdF79jHO2biCPFZXfN%2FssJ0SoRXvCPZSw%2B3lL8ad8DpbFxyehnqtyCqffp8iPZyR5mhB54%2BPfd8nCWNhiw8Qdwtasu3phLKOzNP2%2FFtko0KXur%2F8wZIyW5Wk8USSFL3T3E48nUvO5UyXyOMYFVKPxBbfBASMNUh7pJ3arU%2BREzjYMxs07xqkqb7dNpcr%2BGcrYKpbTYaa7URuq%2Fbu0Mln4NGon1BE3XCTG9EW9ZcFm0IdpgsVrR09SsyjV04MlqsS%2FKqTV%2FQ1VbKJNC4gKFeHCDdES7ohwYmbxFehQOnpc7lZB2xHRNX%2FsbazuA6MH02NhnySAtkgFhvHiWRMNcLaFt4pjC5qoklFJ3phoBi9dwVx%2FGEYyP54izqbq5%2BiHD5OtRzwyoYgBXujVb0Rh7n%2FWo0%2BM090YVAMugJXUorhoahf3OWS%2Bf%2FCGMG6q72k4ieNMBBHd%2B6FJFhA61MjZFTcAmxQbcBhijdd8Nm9%2Bfgd5LdprJ%2BIMdOAlgtbQ9yHWRRJQfUTqEq05FG95TKgn%2FofTcx%2FiqCRXjC98fnLBjqkATORgUb%2BIGZ0XHgOfjRfB80cncA%2BEW6LAVePzUTfRyCs1FTnwrh7PlttpdJbeqZb4Vtu91VqNQX3vjPbmLcM1bblGz8N6aVd39QuCuQvHe0RNBR9vm3j%2FtYRdvldIzkwa%2F9nGKnMl%2Fn8saAuf7CYregp7tRmmOmZLKTANdYcwFeFerHhmPQUBzGsAQQiFg0V1%2BChbvJsRu6na8d6VRww1%2B25RSXC&X-Amz-Signature=2b66b5f49e562016a6707bf61fb0da3c776eef28a13da652193a75a3bfdff802&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667KHR2UIY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032840Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAJCn8OHux5Jv2dOm9avXFXsVTIP3pNnF7JgZjRXux76AiEAwnFAfnBbvlNroVZ1bje0DszatbGul2AWT0SvI%2F0I25gqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJkNsnn7YklyCQUgqyrcAzwDwLgrqX26GmSecgdn6yvTJ1Q%2FxVNkhuv87Y8i45KD7N%2FTYd919xbM%2BDQQg22LFP8jOg9sqAaCne5Rlezl9xR8QJ%2B0ZyOw%2B5Yweua7HtVNVQ3GEuLM6bn0Pe9qrVyFy81InP5i1NMr40gxcSEwb19EgJnmgYPR%2B7BYmuBMBJzDp1Wg6BGhh2bnLGmoCiobLLkTxWhZfP2DH1WdqhmSvwAY8tmxVmaq6lNReG0GtcRac8ySJjHEvP8Uj7IBcPwyI6P%2BmE0BjAWRCmplTf5RS5UFRhdXMNEqLJTL0m1zCEo%2F4d9ingXRckxDKfFg1d2%2Bh1f%2BG8yKVnF22kcyTZcTYG%2FVR6PEK7f4pzWRKDN68haGZzwP9QkdphoUg1W%2BLORUyrdLMXxPk64xAsH2uhSLAM53sLJYWqVGqQKiug7pvxccynxGGSIibmKH9NA25dgph%2BpCgLNtNiwoCAK6XhOKNQc%2F0Pbtt5H%2BZNUdw%2FDUTQ9LesQ84%2B%2FTAxi7ptWrt3xW4jHEFeKVd16kBmUWFnoLjHBFg4mbVN7b2JKmhD%2BvzlQJDbUdlIpABwkx2%2FRNdEeVBq2GGJCRi3HYBI2XVEpkcjrN9T9Y4AKoVCKqlANYo24Bwl6uJzm5heP9BahkMIny%2BcsGOqUBWVvVUPZwP7ymSQp76mvInDLOaMxSCVbmFmB8PQSKoQgBMG4C9Y2QsiDNkFMk2JFl34L%2FnxWx56SrRSVaN4cdsgg84MAkxUMz9YiWpEQsGQHcpkWrHXd3WAjFLs%2BN%2BP5n6g4LUX9syjPl%2FJWwYlblkwFI4KGgTWjgwAI2XdrgNgei2OftA2wKDrI7m2mGV%2BUFdwVx9YSlulPej%2FChPE7qiQPrdAK4&X-Amz-Signature=ab255a202ec4973729b067b23c20c990f8f095721ccf991e716b00e02ceea675&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YVKFCIRH%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032840Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBbtlMq5s%2FntdhmE2SrWj9dCx9U0vb5kpFEnlg0nxMgBAiAhernQZf1u15ZqMsgRx9ukCA%2BgvQNvKWzYnNd7T%2B97MCqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMm7SMTgZupEO%2BfkBIKtwDTuD5EdxfawuRD1dXIQP9i87Thayc6lZFuLQrrM2eFzpm7PHnhWywCEsD5hy75CZ7V%2BuLcCUXnjez7Dlm2c%2BHb3Jk80ExfJxI43YU4xH1kFtf1vDSGDxVvtnAoBH71y9Wo1Bg8vMrSZBY7jtAbDLpFD80aZWwVkwkwM8jhkEcBXlDmO0CfxG5jNhXU01yV%2FZUK9rryYxMA1suWUz2X2AjpXK9qgr8FOi4OO1NZBW2bKYkSWt4m81JLRALufl50dWzycOu0Q9sUdhhgJn8NTZL005FEe7D06P6j%2BXGcKGbO26%2BEUHVGD%2BXGzbcB8pYzrDxLuqY5vYkU1k6H6VvwziOR34Lu2GLwMURKzPNpj0POnKjpl7pNcWF1nfvacWN0%2FAqJPlqANAOiMUGX3sv9bYg8xPHbxpN4ZFEg%2Fd4uojvjMSgt%2FwTBkUNl9agWt9DL0gv60uduRM7I0HpGvB%2BmQvjj0co92KtqIwG8Njjb2gyh8H29dqTcwiA4MP1TWD2Moi2ATQbUW6BIMeslrODw01OyTdP1hNgvoE5JZB86FEzORhDaWExORx1xCBSqEBTZtpeXcLrkoC%2BFkgLjUJxVx9n5o60MOvYcrG9jzrN7L7yIygyWjPG9R9mi7Rx6WUw3%2FH5ywY6pgHTt2CJFQr8KBqwXY1N57CeOrcGjEhPgQQSZVlmzEpt%2FG%2BBSbEzvxYny%2FqmG1%2B0y5nlfmyxxJMD6NKvv1sEjcMnc3tc4XC9Hmx4EikJectGNTStuQYQehI3YfXx8lFXIhdE5ofTFuk2ncNmiS9iLcpa2ZK7r9yTOLo6surbJNuVImjmllu3orQNG1%2BKCNMUP8i2mvxcDj9EiYJ9KWh4lYeRyTcEmA2j&X-Amz-Signature=161ba357dbb61d3970e086f74efa04bc7b09205100822d459f0d5e3d10db6f93&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표
