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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=45a6328388a4293101e0598e6e436a201db0109b8f30506c9026bfec8eb748fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=cbb1d3d95b236bd182b243fb5202ede0795d942665ee9391f5d2e88fae030239&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=63e812968dd57a2a14488b9068c0d0c7d87c45845cadbbb5cf7cb444c2150bbe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=88527f15e45e3b6343fe7580157c4942ab351a30b9b9b59f6bca825fc708435d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663WQL6RCV%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDRDK5FpjBOKcYd9TPQ5D7s9jVEfL8FOKRNheRvKH%2FS%2BwIhANp35PypKGr1%2Bf5W46PsL7qqTnvvaP95lGTa%2Fjr6vhkZKv8DCGsQABoMNjM3NDIzMTgzODA1IgzFVLUsX2p7DHkRg68q3AOKR6AIArTJo79zJMo7OtcAdA%2FSrZ%2F5jWxamNjjcHX0yolP%2BufltV9q5IDHZ3jjqTFk0HLeprOPTEbfXcod4wwiuHlPPRwHsxUY6H3%2B0St8cV%2BqN5%2FE3GrQEDRdo4%2BRUH2uuoxbXPsX4QCTOq6KePpL0H92wWnrF1MDTHkUSJLTDA2DqHKWsTcHVytZ6iqDua8SpTR3uGC9mJ43LYo8LTXcUY1eSIinaZEWrbIJappxDCQyFZaja1iGMiGvvqJ0mFNWEi0%2BGAc3rabh0UWFxWiL0EiuA%2FoVSpczKD5X0eRM1gmMV44IlrWYETRKQXkGPe%2FM%2FFdJmInvpa4ghYtFVx2SgzRa1vM9qlGiwHCkJM5Eu5Q9brXr2tQ%2Buinko5MHCICVab8L8gza%2BaWuQGn01KG6VFdf%2BKWPckN2MrOnSHRKWz9L8HPfwalWqx5OLwKUiuX%2BS3tJVI%2FSOrqcAqUZElbmlBQmV54uidpBjJax8dkdimaCnXld%2BNsg7Z26M%2BF9PlnFFVUq01aEuM5f4h6ViBNgB4jqe3kkAXNqoH%2BXiIGIE5CStJoCHWKfjx9LGj5Ubq1SHLICZ7HfDC5mJsL9Ml8Hm46ZVF8TI5F3QaRRpiImJy4T%2FAEPhbYHIxR5VDCYs8jNBjqkAelRVzvfi5bX43KVy1CKmVJdAyTvmZD%2Fa2qAoXaOfaGPXm1Wp1LRlF11g9wG4k3e6taWIcmv%2B8t5SEwRUBr1pMWNAf34z8q09baZgFzvFDZROaTJGlFsvn0JMAGWftaBJg2uCc%2B2MX8pW%2FOvsY0kw3aP7ApvqG7WiHVuXbDa0SUhJagv5veExLju1tPowEfdnn9lpBJ7LW1tVNKRkEITRIfRuGsw&X-Amz-Signature=ec0f541459abf20e029c915c1ae80458eb0d7eeb0620de4bdfc55ac30c2a4360&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S6YB7HKM%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031310Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF%2BVcgtk8cLQC5xChr6NhOV4fglfLKRzwWbcvxwo6ZvlAiBpXOeUQ8eaw4jGi%2F8HnBuoUCgW5p72gcUGCkXyJbA9wSr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMFU1qyggdtjJIZ9maKtwD1jhB1sLNdWDJYbFfvxyE9khubrfpQkd403HTpRy2sxJJQZiimFJQi6OJeH9tfr5f%2FO7Tkr4q5OOYfCrtl2NueXzxPBB1X3J2Y0QHA6nz5sd4wlOXU3wf3v5wDGIzOuJZ6CeNsGEcXN1cLYlgmKpfc2tgoLQ4C8g5ST0rk66%2BlugFv5rSDpec9u0Ny%2BkIi6IDL4XPpG8WU3JlS%2FcoTY%2FRmAcNSqHUB2O0D9tVDjBR5lUANNaqQPfkU7QMkzzIGTh%2Fe9oBUbJVz2CxCgBNrSuHhJ3fXLZeqx5qM%2BigWJvw1gokVPwFeG9D6IJ4adlURqP6RPA2DObMZFOWZwxmy8FUgidTFtEbAHu8attu4ZllJkCmlghCB0y3yZjkmaSaD%2FImzliamgWFeh7teGz3x93dQ1ggDUS7BgtPuPhOcuprvpH2ErTz9THnQ1QGPjeoTdlaizD%2FKjlfL42P4H4Uf4od69KUiJeaOoiWs4lQr1OuHpXKHVxc5ETpxWhEW9yiOsB58%2BXcECAejbTrz%2FvtcN8diS1U%2F%2FZ0q7cqMb2GUrQPqz7ebupWUu3L68wKaWeFhfkxAiM2oa7fqJ5Acvn7rKkHIzlsJCTei44RMDR3KVu%2B9v7VupkVihJ64fwlafsw7LLIzQY6pgGhbc423hX2nPFeT4lS9HF7wxnvKtAwKKnxfc83hKBJqMGq2tMzbFQHhlFjXVnw4ERaU4QvrocsB7NBM1hiKrWMcZ6CxSiUtaXpkCoADZZN%2FsHnmaYHsbEUkAdyBVGAFUHgH%2BGoqe8OMZhcGjZyu8nb%2B6YmiBptTtcodyJJ8odO2o2QAQA00lmMofEFEsjmh5ocJTkszRgDxAmocjMPdRX0vE4r7Sss&X-Amz-Signature=be78d550c1ca416baeb200d74d9a81ae001612823225a8579823fe65afef132a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U5FJWUUG%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031311Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAYlz4S8NCwYE8iHv9UuiGFGx1N8by%2FpqyrCb30qV2LaAiAUzGDlgmCRRsoA081H6CAE4zk%2FLXumWdl%2F4EIVlvc0uSr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMIA8Pudok0D6tycjVKtwD8dpBDaOgOzqpf%2BFrjHT%2BDGN2SYwDFN3xcSSGMhetYfd9b%2FuPltkfIaj19RWa2pwgMZ%2Bk%2B2%2BEzA7gRED68MP8YN89BB7oHFeHYaggQSCxt9bn11tqNlTdl9v0HlNfV2g2vsFlvrwzHc6jrU%2B%2FmgzWt3hc%2B2Sjs7SGCuigHjTZGttVHmbTS%2FBpPBjAHJvK952wgxiQPHTVotABOEBWGoYoyP8Vi53fbygJpBvHHLlJsAYLZYJZhbolZx3EdoHW%2B%2B%2Fs%2BXUlc273Ignqt8YHnc1DhVoZ3LMeRnq5Cn1bU%2BZUqyq8NIuTN929geXXXIA2v1xltPqpJvJblPZua7Y8LTaEbTbNNxFPycmckhyGMxAhRTiY49GJbl01X6W5ZgEc4%2FX0f%2F0vKRhTND%2BSli2DOYkIZBIkuaxqEP8RQ%2FAq%2BVd8qxd10M431s9VJ1dXCeZD3GybJWApp6CtuflFO1sCJnTB%2FKDr8GgUthswPhr9b%2BozBBjVMMPB7lJMMSnyBEeqpsk%2F19Q1sFyfKQV9j1VMpF2NADzecjmpxNn08s%2F2YMwMfMKDXkPTCrrumbc%2BQ1fL%2B9dTFOMA8hxPm9hF62zwAS4j13nJoTeJqYG3rE6vsvUdwBFBEwuufxf5hh1ed90wxLLIzQY6pgF%2FKsqILgLArhIfxMXYs8FqqLGMg5seUtayuYhJIRXvQqwU27Cxhe2aoONExjJKkkmVJdrZ%2F%2BaLGBv6bjhNNxAxBaELDXgpweFNikOfXrMd0yWHPlSZIq5h0X%2BnG1EmMzvvA%2B9%2F9QAKUkGaoe5G3BdAkEaXbeJhtYvgpMobEwdR3FrZ8rEX9IPDNl2rvVr4c58ERw%2FS4U27l7KORBuMabMKZ%2BE0yyZ2&X-Amz-Signature=f4f5d2a44d363aaec3bc871247a0e66a3dd7245a5c99a6af2876713bcd3dc375&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666UNEBLJJ%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031312Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDy8B1UxnU4PwXCeATc0T2QOhKDkNmjXmBtO8Pkz%2BQ2ggIhANJv7NeAag9rEYf0kS6IuGXZfiSCfSg6D6dWVkFTyRefKv8DCGsQABoMNjM3NDIzMTgzODA1Igxb8PnpUyrhpbNgzpoq3AN0twU4CbhsqJtXrCIKOOIgR%2BUftHCpOD6eq3d15ao%2F%2FgpAyDsCkZNA8%2BS%2FWUoKYDr5YbP7FRpxnSTbOsTuHxOA8tKs2VCcpzDz03VPzL%2FOpJagnSG9LrZBxgYXaXecMoTjfUkc7pHywzuMPdLPQFRnyVPKDzWC%2FZaOodDbCNIp3ugkkwvpiYaqcHxG2hQJ217w6ephByp8CZUvsgtEV9V%2BcIAqrk5%2FGPrj%2BtMWhvEQOsQF6X50EgmpOrOIXbzM%2FX6ZM8WqgVDpX9UHWSFz%2FaOQMkkUF12aMw99nmHtfis2Krqp4MnJ0yfs2B4OCRBnkvFt9p7jGCmw8F5tqUSuKWkC6uWQHZC2m8E3uE%2BnJlsmWBnK2Prg0g7RD0pCskGVx3nQQRSOA6i0KZUiTqI0FMed90fcGxZBU5qfRcob4CwwADIaJydBwpNERxa8U6i3T3ZBBArO8AEpQD9vd3jBrwNLYgkBicBzblMqs8k7hTY2lvg2bAI9yaBniJvyqD4d%2FKR8tNU6fGf0YcmbJ4N%2BDGBHCx21vYoD51gqcyaOX11KvFCwIpqSEMOWgUdwZA%2F0g%2FRDUOJ1CYqUHYh4uiTxMnJr6TRqWmkMbpQ91xbNi61nDFaP0C8l3lcUzKZPATCmssjNBjqkAXJkH5NnBK00A26DIGA7jqTcegx%2Fi6KGiB6DTle6kx9yKCvuYJbownnN8MpvRoVjhmm8aIxOzPS5vZyomC6SGaAxYUICMbaYWHjaTTLU2oDpCJ%2FEQUZeve08jhSi7kkYTadnD9zaOLpBKq8%2BVdS2zVmUgI0Ag1aPZgHLWmiU7O1HxlGDT8VSTD2YQclG6HLh%2Bakqo6SG3iPq9JzcL9V5K%2Bt1w2Lc&X-Amz-Signature=1cd79876b0c85bc1689d603e0d570a62ac965dde1778ba73c30c1c49d75dda29&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=c29fb73973a34c78c3ea534c8976e9dc027aaa8168c8311e5428fc7851b97ae5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=acf7afd33972b891a9a3d30bba2c6abddb43c6f2d1d1212a1b5952d927b4bcb0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RLFYS657%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFFGuc%2BFKJM1FPPHenfaSUke8bqnU8a7bsToXbHVSkDQAiEAnYKE%2BjMCc8KUd4cNzJ7a9sywccbwao2sdYQBXetDDoUq%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDIQoe4SrjnQmvZfLHSrcA1YfbnbO9m9xGY60ery4cPVg4DOQYxQWBHcmkJUHF9ulskKPdlOnxdIX9xXY7HHmGtdBGP1sAi1FwGe78yooxVjYKhfXSQwSnT7PbJEyx58QjAW7%2FKaaZt8S1aCGosjtmNqkWeM8TNpiuqmQiLY42NiCyo9WGhHAgjgqZpJuDebuaIwyjba2tUS3cj5AzcnQPiKQQ7jhlIssyYFFVzjsuyweoHtnkkAgJ%2BHxC0x4OJqaKungnj%2BpP95jVIBwRp02kIPOugl5aBtx9W2Ug0VgzLllJBcieEw4n5MZMTo6n%2F42fPyfBoAqg00x8WsS3jVxSJFqu4GaSlbTybcgKl7f2ffR%2FTg1p9yDwLsqyrkR5mip9k%2BEusmiio4qCn0Wfx1Wc0HCFsHCaXYlJjKwW9IJorA3XX5xrNJQz5P3vHXwzi%2FpLvWGxN41IgKLpdtZsSRe70rUvAAlXCYNiYlDgzFcwtVC%2BbI9kCjwlA4q0hAxa6flHvkoDkumIccSLRFt2sD13gfcQnBKwXxN71%2B3UMUQhbVtKdX%2FM6Q0Y0emHUhh2%2BT2vHAvrIBAiGAmvAM%2F6q2Da7T8NDQ%2BeMrb8j2Jgz%2FWISp9JBUeB6W4tb%2FcDLVa4PR9VOiavwi7om%2BKnfeJMJizyM0GOqUBO5W42viUZYIk0Oc7NPNyu%2BlPKjdpUXoOOsjSxgXtie1ajnFyaQO2U2NI77ljmIbe0Mtj4EmkUuLJWmEXheL5%2B%2F%2FSkIYS8VFtVQ%2FNXQHRNNYJ25Z3ZOahMXK5cQgEFDZvBsG8fOvRr6zU16TYQYho3dP1awMX8NA2wV4HYqJIurI0ZEIeKNDzJubL0klGc9JSXT941xnS9swiw07kdtV873pnYF%2By&X-Amz-Signature=6197916dc6bdc00bb9e2ad81fd6c51d9545ce4b1e8c55992661ef53eef326b10&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=498128bcae650143426919bc09adca8d713cccd2091144e9a2adeae73ce86b1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V7HLLJCX%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCqDnOi2di6K5rqDgXFY%2B2zr9a6XEnc8tAgBTZvh3GsWAIhANMo0uGqT4fXyPsfxmZj50mUF9RwCJMTXWAlqhCsOXlRKv8DCGsQABoMNjM3NDIzMTgzODA1Igym6%2Ff4PNskYpSkVsgq3AM129XenyDp7XLc%2F24N9vVWf8GsRVFtMaMtanx%2B5SXV8KajnP%2Fm%2BdqyQZj%2FHKoqDPxi4tExb36VYV8qh%2BWdibICpJSmr0JqaLg82A5I3TbHZT1TxMMdaRo5IMlVlkljhzs7r2qXiKXMbGGa7HWW4quNuo9oD1aDHVmwrF7Itpv8H9gqbLKzM00uMaTraWp2KC271gQJAGSr6kaQHvv69DlVozCIw3WglWPBgvFLU3jNHkZa4XjWX2WLBHUBpu3aEwjXfHBpGOA9lyjAJCyNnwT65rA%2FKKu5SbMwGvreDAL7VwViONkCZowTnBUDUVnqTpwoYfrH%2B%2Br2uoX7huF0Rnjj%2Be9M6gtdugG1EemNe4vLEetQ1bkk6fVGeFW96Bcrc0BfHM0UAz0YN4psewqZ%2BFK74EzXedKGQ6wytEsIi%2FwL3of8OSXGYcJehAHA%2Fy%2B9oqjoLMMIctcvqOSRFzx7gJOUD0byQueHfIcOaSwmlr%2B4GMSRCCIGaJYnFPF4E%2F60o%2BnfIT1koVC9S%2Bu18cnKcsqBLMLHIyo3XsP9F0OrQTl8Xa%2FZxmeHFY5LB%2BfO%2FxooKRGo1mdhIZfYIbNYKtFaIwM%2FWfZBYMv7JMkIIsuvCjeT3Efn2vZ%2FPGkt3UNgcjD0scjNBjqkAc2DD85bzD0D7T83VW04ayPfgz%2F5FOEZfzhvIap0AfMNkKLw%2BpLBbLGmkjv%2Fg%2BLgM%2FxoI1FBjzenkP5JJGSUl%2FzSOwBlYLqmZl1bdnSSVswkKD3VCRSAYkH%2FrM0GplU9L1DgiqUy%2BUHDCiCIUKbvGmrj%2FAMoFOeH76w7Q2SW5KQV%2F2q6GG67jJ0CWFEsFAhYnAR7DjGeXXU%2F2XOZ39eHBGFreUOy&X-Amz-Signature=f0d4bb5e4d37eb2b1d3978b442da69329c618f26696c303997c168cee481d49c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4NZ4MDN%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031320Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAWfpNcXsYevDJ6RzxrlNx9QXNMofit54OAbuVxYeYaRAiBvvmAUBPsJVkuksbEKO73fbdStuNnzDVUPn5JTl0uAkir%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMB4XAhJG2Ldk%2FpvZqKtwDe1ksNKHHpeL7rx5i%2FIRzjromg1n59tMDh%2Fv4SqogboN9A3KdYtv7ccnUktXyesEtlyIheHnJoJliw82mpnWkBSZ74dnXM0JAcHa%2BJd1IgqcPKT8oZbqZG3XX9mkrITevFFmUXRdTL0CnW80kSorHJM2QuBz8PlsPe9LUOu3jUzrgU6QLeWaKtrwWoEtoT58jAhGNm%2FGkp5MOYKQi8XAceuSkFYlevfkxFUXYmylyfoZreFo2iGJH%2FF7ELrtpEQSz6AkfVFeGBK%2FnXJ1ZVtDoM0YF9%2BGXOryeaTJOilLaYg9FYWruTGYVGQ1o4MzBC6mm7Sh3ngleXCCA6gHOWrIf0PIWN4f95CKiq13SOKrCB41RynINEr5lH9%2FhTy6lecmvqsIu4iW%2FOVsuK0QO3%2FUTSeh%2Fsd0at3s%2B1B8rSyOjofm25ISEha4fiPjbjXSPmHwt%2FtI%2BukMNQ9LqdOg9kC6xiPTejjqBBCyovn%2FkO1%2FMXJk2jhLjkw21TiUuHcABIFGlyL5VA3yONU%2FGSxW0JLbbWk96re6KlmaB%2BbpH%2FTvggvjj%2BAWGEjTVORGnYWV0ST%2FoetBnpO1HG2bdJObYgPvef2CkUkCCmNGKyYlZbjBgqgWFldRUdXlcHRu90YQwt7LIzQY6pgH6o7FKQf6WlCL4sxvvD38cbAnFM6iQ7QCw9N%2Byo19BFqOoy5zwfIF2fdr8puf40RHb4IiLrRxPzBz%2BUXtpzUfu7KDWy1g4mm9w1A8hGJiQxx0VKHngLlOx%2Bc77X45FVFfKznvHxsAOoxScDXrAKDOxKwAZX1HeQMvDijK2Jb4dLTnvjh4RXB2PxADlHHPqCrNQ3iSbBeyB%2B0k3eNg3hzKm%2BLb7cpJ0&X-Amz-Signature=2912dc1f03d215c6faf60fde4a205fac803f3a433367185f8caff55c5b41a09b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QQT6XVE%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031325Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHR35CyU7WTAtVbxiw9%2BTxXTD282SYPAmyRxvExee%2BWxAiEA6Vmt6XSklNJzKDRrksYKSalAnXVxYtd4rswYFBo87vgq%2FwMIaxAAGgw2Mzc0MjMxODM4MDUiDCX8XK0tKGk0zKYHIircAz36douim7qkSqfLVZcJygUPO%2FCpvcz9jdZFcJ3dhSgEGifM59riiyLQC%2B26vLUPo93DsiFEYdl5j0Vw4ISvPsJkxL5E9lUf54RbhtBNGkBkXO4wVuvFbkVPeV7aX3Kda9ANcJkxpDmri58V8abqj8tsjMeZJfY%2BHal%2FVorTX9qo7WV9DrHtJ1yL7ME8YIVLaV3y82NJslvmrkxJeAyXQc%2BiTHlJE4FKR4k7%2BTlfGfUhRlSbWOnnrZH3creitWIusctk5n3AUyJtiAFDqR1KhkICmkCaNKyYyxJeJ5%2B9kMTZgApFUCh%2F21BA2niLvN2D1sxtymmklXtLm1S6HzNkQ3Pg5Ywneev5LtW71TC%2Bp282ZsaFo%2FIATsUO46WnA7Nbo8PsemqHvqJNDWJ7MtiQKC5fu50AOsbAP7AWNJLRs63KdVcfFFs7Psmn3pbmoNh2zcaJoa6ssdwNcccCpXjZSn4g5dIe1bVafHjnv9NVmv2bApsSoJwYf%2Fv7MZGd5JMKJb8JQc4KNpSMJt7TMfbWx5JAYDNlzS0uPTbwS665LkNzWGLrWHXrCgU%2F7MTjwN3b71VkAk9yk8YSKckFhkSVXIPoP5jF2XsLDGixorh%2F2eWdR2ANiKXsF9ruwc8RMJuzyM0GOqUBBYzLwijvvBLg2Kt8FPQqiW3zepSs0di%2BYKsrRSyrffaFfUuFxtcINJpZDaDKQU%2Fpbcew0b3s7r8NpISGXcuXn4%2BwViFLbsMRd3JbfSZDBp1JLP81Q1OufX7GVd%2FvMbacukDatNj2YZwffnMRBLtFFxfwlSwo5Knd0qdAJUkuBlrKqTjNoqy4e%2B4LQpAdo4onoeKIqpruH5Esq%2BFupZJwLtNNCh5p&X-Amz-Signature=125b351ceb38f732a548337cda8a099a2c8d1fc95bd35f4844e4283175c47002&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z2J2N67H%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031325Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCYkLtyL53TDCdnzU3IC7RbpL1JArCKV66z1knnhwlzMwIhAM2v3a0%2Fdtxi%2FDShnN%2FDU2U3%2FFTH42PcgPjXj0%2Be2UieKv8DCGsQABoMNjM3NDIzMTgzODA1IgwLhu%2F%2FrG2lyGloj38q3AOluvluZlDWm%2Bsy1g8yTfd5Td7nK4WCeynSN7iak6SHAoohmlVjNdOoTNGoFv6j12n584e0ejGiWsgwZHS4iGmx89nYNVe0JuprrznoIL7j0tdHMPHVYEg6AqMfzSXBlCB83C%2Fsf6clD%2FdJecl3viwN%2Fjw4OSUDwWwERMc7rxYgeN52gducbDh5OnT4UL8ndAitqN5AGGWphTosuUnk9uYG02nRBApgZqo9zgjkO30tteSziMcKTRgv3G7%2F5ldKGc3SZi5anuCV71qtAbwWSjCEI2xUUyn5SRihsVkayafGXbcOfubg21KGTNKm%2FwmbU6PGaqFInCsFc1UD7vBS6hWtE%2Bpwp6zkCIy2oTTAGsh%2FmYrgKV5MkTYjPqvVHqw6d2dL7ZJLHZeSdBeb2KvPgjCGtnKopf2fCYXMbKg2aXqkH75N2rCUMlYPw2gUrRTdh1SBZFhOeVXanneIWVSUajtgoce8cepNmqiN3z2sftusD5xgLDOc2W%2FjmsFFr%2FIGIcIbF%2FFFWihLwZ31XvBlDalAtHY%2BfAU4eVrAOzDPpOnF8ZRH6X7KLdNfQHFg33drYF36PWFMrefvFFODTWc9bNckXcKNJB3eUPEdNRxsJF42gogmt4RBMm67IBcABzD0scjNBjqkAQ6Iuudcwm53lMYD1HLqK7oSIbPstGfPxWuSDZmB25BJjFJhJyln1uAAzc7deBgmuwxIdqxS32eca7oiXsSdgiK9dKgB2bL9qIkCKKdXw285F0vpRxaHc7Du%2FKekLOgugjs8yGXeuqKqFeYYNwEW0TFDd7X0MWyykys%2Fp3A2t9T27WCGkn2GfRDJziiiP87RXkx0PQakrmoqhGQQAjsQ8ot539JC&X-Amz-Signature=1e1641b9a3b62823df3d565c9d941146297fd21f2635ad81ecdad0df9a45e5be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=c40e8d72c0153c8c6d7615aa37bf4400baf574b125d22371059aeb752ea6cbd2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3BNGJW%2F20260312%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260312T031238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeLUY6unf8iqNion8%2F5W%2FWZseD%2BQeSQER7MPvi3N3tEAiBsYmqYNneTydaWG%2BLiDwabB%2BDLnHMZwPnZH4vR2ffAqyr%2FAwhrEAAaDDYzNzQyMzE4MzgwNSIMyVbVrNTvEc%2B%2Fx3CiKtwDA4M49L6SmdrZIvLwLTtwdbyfDpKvWhp3Mkkl%2BAXkANDm3%2BbmKVPm9Er33bSNekuLHK8tWILGcBnISu9MWqDiYyb2jxX%2BgIAj9F%2F6ahSQzOiHuT1kJGBri%2BpMlykAjEqHOVQbuidY5sdVTAFwpYKxQzM4FluErAhcd%2BbD66l5TEzvnnHnRweziuEtG%2FxUT2SBPFz2Bsc65LLLeTKLOKAUSOHgE8nZ9SHX5kFKx4IycWsjdbAjCuuxdbCTZTeWPD24r3esUqvOJIH2IgQv%2FDXEQcMn9Xui72kJKv%2FXYNtVQpgbcAn9oT9vQ4I9voJU26BlPQOS0pXDxCF2XY1Oe%2Fb%2F4zUMpJqNR%2B3LGMEcRdq2mGVwNJv3nVfTripWi4QgNIgP29MViD6zDm6YA6qnBEXJyoiD%2BKh5MKI8T9C2JqSv9Qs0gR6YlI3uqVduQKTlzgZl6uW1793y1vHVPymH7BuVC60o5Zw8lr2io7tLsuz%2Fo%2B%2FtG2kwvvDE1MlBMCN2a%2F0AiikTbtnlqxTVOW7qQ%2BhwWBycW3tvdYctWP0tWPbPg%2FfjocqmB8tLCTzkiWP6xRay46Y4eK0u3%2BCnHcwBgX2VBgpkWoMzEpJ8a%2B%2BbjG9AQgETsGX55aRE9ShMn5cw67HIzQY6pgHr7U%2Bma0LtlLpUKDY%2BxXs8VByWcNOLwazeo6koGj3DUetJTSnktWV40UFtzeATYzC09rkLvFC7%2F4Y5GvbQalpwji%2BAZFHMyajDq3X6JywFGZMhESkEBhOz7hUl3YTyHMNdWdI4jlgIRAuYWFpIh1FMiE9LqSYOKEsna%2ByrHIDcgZqB6hlhVNnJhgCO7%2BOTe8y387hs9e%2BCh4YMkcQzFOggbdcLHL6t&X-Amz-Signature=154f8da340c866d3bebd5a77af6bdeaee4a821b3d4b79cfd7cc1aeeb5f1ac598&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

