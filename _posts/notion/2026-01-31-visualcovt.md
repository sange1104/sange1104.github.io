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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=92858c1f0f659af038296b6f1e54dc4eacba649b0e3bb5d46fa281884e024c7a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=7f7a3d396e38ba6a4e6f0db1bc4059dde2941a6cb342784ab3cb8c023b33670d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=ddc40d6aaf6cdde97e2ce1c049590610efa298522b7054bdb8766f0443234d16&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=7093da74198c1f193b23228e49c9c1a45d9d40dc7d7585ec58e3c342b155b123&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U5AIHNAX%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIGsAjXgMWlvMcfqt%2FUz%2FKrzdeDViGQYrLEwnMLUldxuDAiEAtCZqSVEoy7F0IxurlSQtqF2srrhBeveuymYwdMEmqjAqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL6T6WNkO908quQblSrcA7ttBEb91%2Fvxo2hU1b%2BIkaIRAXvdipGZDWN8JXr8T7TrrdoH6%2FMctjBbQ3t%2FCPlbllqzJUbFEl7TcDni353%2BrH3m4%2BIUL7Z8iKkIOl%2Br2A%2BioIRp98F4VzpjkvAteJVKAB3NFEWhMh%2F56s5w%2BprfTr2MgetRJuflrdMDw%2BPXi5pLgBVAZdstSalZnVPUR9HJHq0dIF7%2BGNkezqVnzH%2B%2FAaZU6ortMDsc0jdq48uqqrAFNHlp4oksdPqnnc3b7m%2FzUdbBWgVAm4gcDwDnMw4a8FspljKts8kB9UDAfF7G2xkfRAqIXlBapKQxJOp43RoSvy5jaoy2vZvYRWfOmx3vQIY1kSp4sR6fZW6N0EZbfxLatKpB4daD8GcSLKfMczzJSeq7sr2Gl0kWeWqOsKkqHodXCD4AJLjAY%2BGFXidKsBKnezv%2FblERO5NK5JUmgR6MUtMjw4FYXTw6Cbcih13uwm6HdfBhmWxmgoMuHXVG8totvDJB7yO1CZ0DPlxE7DXLvSBxhZaq6rFE4qr4L03jyaKmQPN606Kh%2BlI9XC3acFewmf22amZDq4%2FLRltfODmc0usbXf4YVmY07q4%2FSIB6h5iv0JrvWUQq1t9bnulwbENrcz%2FPTJwnLZm22EwcMJW6hs8GOqUB1mgNBrlv8HShb8H9yctECYRf0H%2FIeRzcxEBroX0V82BXDI%2BwPPqL%2FLZotEvlMVI8FN3m0UoLNxcgu7pyCXen52dtTtKNi542WBFjSurhdxzcjTcvvsAEeeZn5W9fDkEPSr8GNc1PhEsjzLm99Jrbhqn%2BOFYX0XutMS7vSMSQa8qr%2BsNRBWV6Bq5e3y8R1FbmwnTMWvwj89Y%2FGlhyOH4SFAJqa7q0&X-Amz-Signature=02f23550c311e3a9c517a30ce1259d1f40198da0b03bb0287b586ac66337d8aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TEE4NFWI%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJGMEQCIDLOPuR21ecgZIpqlfb%2F8tFxGqJRBftuL1j2UICWHwdhAiA%2BT8%2FfRItrwlP1LvOsfJR7Z4GRxLkAaiq%2F3wOua1ou9yqIBAjM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhFy5vsCWts3b3RzAKtwDBQcA7xdKAtHcLK0ja13atUOXEjSSzLBvrGAR9O8mxKj6YW5CMyWGDIiP%2F6g3QmjpQU6D6Xd653ZGtRWvYNr3h2d%2Bu9t9LgO7tWrt2qh2tuLmCcEY%2BA0yUClT8w8XJmMzCnO2W4G0DwZe61CJ6HzFg0MKO%2B8cVS08k8ds84vEKbSAtMV9yrG3zcccN9EOZusIVkr7erLxTOGR6nBsXsriRI%2BtwJUpqkuajcYedWUJrxP2PrC%2B%2FniDMpXOmDnG%2B6Kn2K0uG35A3fJacK9UEJKb5cgpb43g6uS2adducAu4Uux99KKNklwvxi%2BC%2F0AQD6RxGPCWaEBePUBLcge80JtcOeNieVrAu97clVIeza9aKpf8rWhsgOA97aAFOmtAyIZzbkmqtnsOuIyqacpf3nz3s%2BHttPdR7gPss1jlnpik3B%2F8Ayy2XBaMxu5EY41OyunYTFP7G4iNaiaywONQlRQU73LQFMuaqij%2Fm9hp9%2FYxU8RNYpF75crc3z%2FSTbgrdnii8%2BKhpRsA9W2ZVpzVirE6rzvlNQVr2DvncqSAABlKK5z1uWbzOxBmwOEqndywuEjEguDV944jj09OVJ0%2F43z8C7jwU3k3SyQTz1FUg6uOAUkZ%2BHLPY0vfkVnI4PIw8byGzwY6pgFijHQvuy7W%2BQ8O06uvYN%2B763JX21kIdZUT6YQpaZH%2FXlRZGOvqB1JirNLV%2BM0HSnV8EyHJy4V4SId20LicswIpHX1uIm3UI16o11dOXj271rHU%2FhVFxuLfC53PSS%2FVg5n%2B5b8D%2FNslqDXkKRw7oxSvEQWm9eHYemdTjrYe9SBGC96aAAfKArYC0w8RPKEQvzmAYdZp9AMixSGSGycor27JymxHMZoP&X-Amz-Signature=72e1f18412e7584d468a5504c20e58a167e668fa489bac517447c869b83c3549&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FV4FMMG%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034710Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIFdAet5vjRmeYQzhSrphVz3VZaGcJo8fEfy1M0OnnTi5AiEA6cR8mLTEWHxU5lnBp3NT1aZaFWARhs1spzqCJdNXv1oqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK6FOauODhHGwA%2FK0CrcAzqiSsVG2L3P%2F02zR3LaOil62DNp5aXV1fv02HrYeLkHqMznet5PAFCHmPz7FGdxmSQwLFJtarURxaeBYuNEJIcrcowa8qCWw4WB0JDEq6FeqQEwERbkzDWKU8jOt2eDsYGArEXy%2FfMj3yKNMJOs2hrpFjoFrrAfoouQNThMOaBFXVyZ0yhPv2RoFpoQuBpR3fwqRfrlf1n3AQO%2FqACZZCvtgFgBQbRBdTj0NuI4mDbvvEpt%2BjXsweT%2BrVk62caYbOugqcB0XZA9B8OcZ14GI7USac1b4lzBBpZjhwwr%2BpdWobNXJzZ2K1l66aYZ%2BhzR6I%2FvyPhVquZ%2BIVzyhbu9AKwsglrgfCom40s9C%2BMEfC9effMj8wR%2FCz11VL4rX35fgHGb92eyLbay6%2FnuHk370fPzrRGI2AdD%2BhFVrH0tjnPK1kj799rdAD8WRbXqrD476cSioHh6M1l6kzJ26hFDp5WCTQaMd8rQR9WMsPdtAMfFTFrDUdwoS9b1mvUwGus5jIGrRoEyw2%2FyVz0M720CylzdPYkTLJo79XrmCve%2BSFW3yUgCWLde1dKXDK14FNtJVMj7syblh0harGLyhMxuJccloq%2B1fz0cSVRsK%2BdtIMH6TwBb5Z5BslSESyEPMKq8hs8GOqUB5YlP2gboz7j3E2JhSYDRmFMHwpoPY%2BbA3f%2FjG2jeM8WbuPaZxQG6grZrXTrh8SvbBnLKOLExj8HAN0dxuaLMkkJ3vVNAZoqwD3h4eCQehcbKle1Wk1GTfQBufCFgGuHGP%2BNfFp7JjSesO88PPqA5kcrP%2FZ5WBIm1xxzS50SfhsiGW2mpwUek0w9G6WwvE1HhaECgikH3K6PWNAcSBSj6HlEt04hC&X-Amz-Signature=e8cc0785c7cbf6a630b214f470e869a4ca7dfe244ec0e35a7f881a444d97820c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q6OVDCBD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034710Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDqEGzEAeRsifzhTuSnAdffSFv2r3nuV2e1zseMj824fgIgfgWh0iPjqcj0s9sVbzwEva9eQPhlWjpzT%2BJVD9c0nkgqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDATuOqr%2BRL0xBYV30ircAwyuea3zfn0bYG7Mc8jbwQ7FDuja4k02OCd6MHnRD0YenS0ufXyKGwHg36okw%2BFSbRUL%2B%2Br1%2FemNmM%2B9Ug3pzIveLeAcDDEzVewj%2F21TxvIp0yP1jUzwDwxPv82o4dNS%2BNJd%2F%2FikiTXMY%2FPCtC2OteHoWLoodZirLQ0eeHIFgXsYw%2Bjw69BmZdfzCH2MpzIQmddhN09w4WbpBW%2FQHNlthNYfkhut3FxYoSSsMtJfPIBgeCGsKFoFu61jXFq8TEpyJoWslCGNtzHr7tHAS%2BgCnUVV3zg1gKYwqxCYER0f2o2OZXf4%2FsPu%2F0mfxyCTVaY2XvGrVJlS%2BPdpCT9HqtoYP%2BCak3cLXQDzIb7rdRBvqWTi%2BkHQlCvkPx17n1k72sQXFAx2kOSRhinBrlyRepRytDNkcEM%2Bn3O6QQBVrPS%2BownUYYT8w3dvAnrMAXqXeI4wiZrpaP77NmxF2tGvYUHuPbx4cogHyC2DWwtGyxl0Jp%2BpY9EEYNrH0mht2MvjEQ%2FfDi%2Ba125eGnNCkbuIJrGWls3Q0g6EEihsz2cjUdb8gi8zeS8NM18J3oSPQ5BrOxkCNwp88bIiTWYOm9t5sW4yE9SJihyHUH3xickrAQ1a%2By8t%2FNjZl4CFiWge387jMOy8hs8GOqUBTWzaC5vuuk2Liil5e%2F7aQErvEpkQT2uds2ct%2BMd2JaVC9rKJcJdFiualzwfxLvszomaZAei6LXz10NzvlmYCPMdcM2vzNQ0XC0XoFBHOCs8guCllKW6X8cWClAR5eplHBnPw7cS9%2BdfxXLCc7OzE4%2Bt5JhGLgdARhNHMLKV7hx6J1ltfqddejPdIvdE%2FGfnLvK5GSvVELYbbtUxaHX5paKb0M%2FTV&X-Amz-Signature=2c6a7446175dbc862466f4096d1c1b1ad25ab1ae73032fa0120f12f3bd3d7850&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=c63fc4d8650b1921c98fafdf62b3fd997c46970445b4f7538531b97a8341d755&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=bf4b1c69d49c8c502ad0828b855c323f6a05e4fe4a1cabb2e85073750f3c8069&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RIXD3P3V%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034714Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDv3fnyeQL3BoD9IRAfZoIpp%2F490h6811MpR8apgp2KAgIge30uAD0fr88QWe1Xjy7tAY4vBIzyh04uc2tpbqPmwmgqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOXv%2BQWTZ%2Bw8Qrme2yrcAyLiBE2tG97Qi%2BeiXnnfmr7s2i%2FQp%2FzJPJuZppn8ITVQxK1l4llAG6Aer6olDtHSayeOyD0D77VTvek6jJs1zH3Qz9Vy8F8193KS7kigRo051Oq%2BUIlPdHlKA2h6ohGTkYdaS5GI1fdN6LiM2uCxVhJMxc2VAJK2MazkiiWRzL6bqqi6MWbNSNB0TaSOG6D%2B9py9Hjpqk0yhE9csSmHAQkl2G3v26YkQQR5%2FimAmZKvCvNntA9A8Crgm4j8Tc9jrVgzhlkJ5dabc7U5ZXOZ99O67x0s5GgJLIziiMbsrRhO6LBUFU1pfhQcWgBi7m47hugBbmb6QqSkm2MRTah8sGv3RVW%2BCmNL3cWqOty%2FtoVQxOENf7UBQQOAKovl6DFZSuBbiAUPwIqa9TVGlXIBvfOEuwp49OPElKiSXtNJ5Z0jpE%2FmmMO0N7Mk%2Fnx1cGHURXK9%2FDpl8dm0iFiwn0U7Sjt%2BO4OzJkWsGhuMqdsJt1EpJk%2BXf3bMRKtsRNFHbCSTvo6rGKsHejo9drY5IhZCWeVUFFnkLCPdYWSB%2FHho5Jtg4UFhwWANqEON%2BeaXr8hlZEMGeB4ZY6wGK%2FO%2B7Af%2BCOLCCmDA9k9lMz%2FN9536QP8pgphkHiRBsdEKLEYOyMM67hs8GOqUBCdt%2B1cBhrnHRsQR6HtNd6w75eyCQVPHh%2BAmuGdR2Hiz9Fs%2BHO5L2E%2FHGH0ZlUWI0HkPvkWV4k8LZKJcWlr1u9dE%2FAwie4%2Fxog0sde5eBlwfGNwY3IJn4h9v5MmsGKnEGDbh36B2k7MxOwolrFu45ThhD4kTM%2BsMGejxYe9gHNbto%2FeT6r1mk7qu5lPyz2VCvNfDhPayxCulsHzGljQ1lQFlOCVSY&X-Amz-Signature=68c037c8570013db38ed64a4f31306337b48c37b4b79c0ace67f5a17e63eef11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=fa37cf70b331338345089196ef794570811017317e8d4a282d228ac30f29203d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ZN7DUSS%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034714Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDz%2BQLqgz4HFVoAVqN85ilV0ZUsJFedB0qZRRVipnyXBAIgIR1njdXyEq3BGadtANrfmrlWalesjWLHydlIsvniXWYqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM463pz0qMVZ7rf2UircA0D6yTEW04vpCBKKG2JpAnSI13tbAzgcSJepIB2Fx1vHeg3qn%2FJGzFRp7ZZjDjDGJ1HDRVi6kTujtgqgkscG1D%2F%2BtKP%2BJKZUrn0gggA0DUiksNO2GNSI3X9y88lHfRGeT8P6bYX%2B0NygR%2BLr0hOqxOn5IVYUiQV9KlhnfmLf58dbZfRXcb3GLBV4UxlgxasgZSCbaVs%2F7uvrsfKlPpttMRJgE%2BMIBsvahybS%2BGFHG1lvUC7MZEofB5YivqDkXD9FdRAcl3t5vncoVLe%2B3eSrjPT%2BPRJLftEl1yoBxCl0TqQFexf7OgskycqAiXJa4B60w6yCuK1zJsSsk0DRFoAtHO7SDVhhuu0aHcEfCd0Pyblo07p4LFSvqk3%2BsWYqY4d6BQouO5AZHPUBvhP38MYg4M9P4DT18qxsP%2B1bYavopoc1rpZLNHtjt5ob9S5ICWRsGd%2BIPRMtvrw%2FGlxX0xIR4s3R4vutHNFrF6D%2Fix7J57X1JvIKtAwIKKqA301hja5kx8yNdd66nz8ktDqiOKNxdaCmlCZpRFNM6KRodl5YmAbXk9cpWiz%2FOsbjVnqs%2FiFFnah916LYh5EIZa5N1be%2FEVkXrUKzhSwCiyC6%2FtRCWfBdUGP9qo7w4pxQsgSYMMm7hs8GOqUBozIahThNdUDedgPJHRFLwPgmdmaB6lTUQMiwU7lzY9cPRbB6bnuHEfgJY04ct%2BFSid59yM1Ch4uocVFeCByjeFm5%2BqjhsuvTjPt4EmLQ4QUTC9RmnoFehSffAMPamQUWsesFSsyaPI7%2FCSw3t9%2BkUtDOoOlHc0yi7zcNCEv5WJIZRJI6aljzlr%2BZ14bMHgsHWnPg97aZO7e5s7rrGpPNUHzJkjzp&X-Amz-Signature=cc162946206b4c6945d38b415314de4c1dbc7d47806e08d7c4f6382e0d3e4cac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666ATFP4IL%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034715Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIEgPBsroLsyUJwfe%2FPBHXX0e%2Bj%2BO3ywcZg0sCMlotT40AiEAnF66%2BYAFGjPMxKVpOE3B3vKnJlsZH%2FsCjO%2BtEF1Af7YqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB5EX4UlL0tSSBSyQCrcAweY9wgcgH3PKrB9Ur5XsdQT8R3NUXpVwQ%2FnuUC5mI%2BkTUn3I8sZx2yp9ws2iAKzT4I3qKWEfNWgtVAbdyfog5tvVqFfESiek5GvqXmUnp74w%2F4277bD9pchRGfxWuGYyiwS0YoweS%2Bxq4CDpfuNEz%2FQXGWMlp3Dm3tb%2FyGbY50Xt7iLsz4Xta%2F3nDCBFZ%2BCoxH%2B9IlSndpUsTeizfsCsXr84hFymG2dFnJn1rzH6%2BhouFxJF5X1KMTgfYnFVQoBIMYn8HTAg8WN3TmyBaUxcahIJLlGRDuXUKmuEzAEoAvUAz9pd9XxXv3hv%2Bw%2FTtvB%2F%2FrvEZ8xasBE6asVgI6Zwtb53Iy6dopo5VH3A5VUCp0MeEovL0WPYk2ptsTfvYLKqwWepvSGJhrPU14EMMMaAQWvk4cP0nSDpOr1%2BYqgj%2F%2BkIkwmFjxfslCNOv%2FaJrTXYQoe1mTElw3F49GXjh8a9kckCjDvr0oMzq506D%2FExt8nCWOBitLmwLcSwO3oUMIf3KrQeOTY3rXL0V57TGrp6dGGWm%2Ba4%2FjMwhr7Q2d%2BH4DJAh1yTsYEhVxfPpNW8kzqO2tIIP9K51zMEN2eBoXe9CcVbgl0jP0qrXQ50mHLYbk3E7GXPskQH3snauc6MLu8hs8GOqUBiBa%2F3VBbg%2Fj9qt6uQKBpwE4bJYRMkRFJRHAO6%2BRnLdjhJguGp5fH167QrXtMsNvIpXgrMwPaZPlWxFU6ad4TPrX8ikrYgtp%2BfvgKf3jpFfOeBXQ9LtpYnCXGBbscBIBMHN3KZ5hS0%2B0OF6yz%2FgxJ76aGpFiBkfUDX3nt3zOM%2Fb99TzRea%2FyDcZ%2Fv3dpHVnfXwwUJZkcWmK8CKMis38jTiePqoDy3&X-Amz-Signature=6104c86bdd0aa686d37a105b042454eb40d2d39c2f10ee492fdb91f593c647d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UAXLBRYI%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034715Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJIMEYCIQCISOTDR1UIiRZoxwLrpD%2FD%2BeaiDEzpoVYSRWn%2BFov9nwIhANZoN3mWwfErCSv%2BkEVlJQ7l1JkP9KvC1NhdRGf%2FbEiQKogECMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw5PZNv%2BAerqhPzxaAq3AMU8r4BnG%2FKw04s1fn9fVayXmgD%2F0bXgMYhvgswi6nMO5TcVHdpFdYzCXcJN1rYoZcdmmDR7M3bV9ZJn0KFGn2PTCwxj5UK%2FkZgTJ6Ut1x3qnWlIHYaviB6FVO%2Faoi5ajoRHscYte5GqlLrHeo%2BHyzqwLFw3%2BTIpU40uGX3dqtlMyQV1btQIutzLJgb4qZGLyXB8VE8vBfdD7xcXMPQGqt5pZoDySEkZ9FXsG%2BJnbrPqPzTLEG1Rpj0h42XWyn%2BcpfGiZ9MRWqm98CIqtqVCkcbLCr0RvuEm9pasLsQN2P2%2FQwAboJfnZgZe5QRppgURylwUzZbIWcrVxA7JHowlU3p2%2FV4W%2BoOEIfR6vh5QfliptWMGaVcCQjsgA0EpFQ2h1wzgcZH7drIvjYoN%2F%2BXHA6HxMt9ORwfxnSvCwP1MHleCPxJdg1ehbNj0bDazj6uwRL4H3GD%2BUk9srz2WoXwIHbwaPNTwWQ1B%2BkYsMhVuxOf%2BMK1wynuZdhKxetHpkpwDQFXx1mZYiA3bskzHI4Tz%2FeUQmcXtZDYt3qIz4UtOrrMTDzZLD5yD5WyfM%2Fgi7MGt2VurUrJhlLJw2%2B4TriPTh9A0SxJS5FkTjz7ZYQWnrKcjTCpk9Pk7rxV96u1sDDjuYbPBjqkARcdbx9yGSyeDRxgvZr8YnLRCGs77GuY7d3ZqkOCtNUwwKg9R6IxayqIquSEWteKlAwcSDHiPdlYXMa3zfEgqPLlsSkf475lSoEKIModu0LbSjV%2BlYWWZJB4vA%2FH6RtqfUIs5Hz%2F%2Frj6R0HhDee7FBcNH0fCA%2Fu%2F%2FevEj4zpY%2B1FCmGs%2BsXayuclpSQEqmgie5kwAtPgYJQ4ef1yENz07IDU7eNa&X-Amz-Signature=63437951fc03b33093640f23afb09d12cad33f545b2437439ca6ebcd0162e81a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVI26LK3%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIAWQ%2BAbwb4wrABrW6bdebNUpvR48zbHJJNVv8DSjj9AyAiEAlBQa5UG2qlvTcGwy26vCVfQ%2FaT%2FGTtu4qfWY%2FKkfa7MqiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKzZrtH7hAU6ZiqEcCrcAxOLEAWxwrCWoC%2Bm%2FcMdrl3b7%2F5a9H7TGfmzSv0tVykBQPrVT%2BMU8%2Fsty0PV9b9l%2B1uBBIcZnU%2FMAskxuA8ZTtUUwDqNP9n34CO9ecBSawHnsx%2BA0BhjBJgxi2cl%2FK82KhL2kWg6S0Iot4eZ3QSpEqrtNmthcMqX%2FLXEIzFsDyN61fPUskJYtRUhLF8Iz2Q4Toci9026b4Pu%2B9V1nvp9FbIhkTf6HV9FjkA1SIRnWSN7nUqyyIVPV2HWUvOvcN2iktw9A2yONOR2c%2Bk%2BwsyC5Il9gnMkKT7ZdALZuYJ%2FoN5eLjHzBReaG%2BoUxVI3jchIVpTTkJSGA1E40A0e1uZvy3RUWIoKwwJhbrv2qNpYxlSaDrSM9oF1uBF0ZlPXbof5JMP78kFEl2sCGvrhDT%2FYjdl2iuTkpG1aZlyfmhRW0RXLvofRUZWU%2FjkR5Tuo%2Fs5wS%2BRx6KOaHjJkU6M2CW5zI4DGytr5sBeoyGHqcG0sTdqAW5ydlfm0QxO%2FHf5WuiCi3ENtBZXEHQfmMqj1cqgBaWHOCNBGrbUK2XqAovNzKOfxCZjLmpKOIMNXhGLo0bQFytlJrzZDYiYtSvcboa%2BSxMURRY5xnysRsda6SGIPA157ETX3qOUqt4Fq0D5sMNO8hs8GOqUBS2x4d%2F2jRy7Gyk%2BR8ZyPwVWywB08DXmyHcplQ%2BsOsSn9COqZDRvvr5SFfQYjRW4vSnryDrIhrhZGsv7vHw1Tg95KHrZ4Ui2m%2FsCi%2BMBq1YvhHx%2BB4CAB%2FfAifW7HOe6dOHUmT7I%2F1t9r9cA%2FqwQ%2Btb3yD4KhORqs5ZRavsV6vwg4bDFBlowLaGqok%2B50rBM8mxhCebXUCrz7itp%2FiPmu5yf4RQId&X-Amz-Signature=1930e7a9797fac53917bdf578ce9959105459fd407ad8378d9781440d8834d1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=f1dfce3344b6864ccf86778a4983f8b308f996893187a4de87d5f743d0ca2d1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663PTVTYSD%2F20260417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260417T034650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAMaCXVzLXdlc3QtMiJHMEUCIQDbBum8mDgmZD2YrcaBXgG%2BVxYyT5jfSq1Qv5lfWBbBWwIgHDcHysc7974jyqZ3Fz5qo4Swmoo7bwBBcbbHO7q6Yp4qiAQIzP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDByFlKTHU%2Fmnp%2BR%2BeyrcA6yPYe0SBNkoKB%2FRcbCuirLepmDrMpRyPv38WAex5ZD%2F8HbtFHR6lD9imoo%2BtOid1s76znxCTppBkkdqE6O2CyrFj1%2BMxRsHms85JRY6vc86BQToV51%2Fus3nMZ9NvWefBqau223y2iUliC2B0jHaf9KW02XtF0IowCcHdvf%2BeyZHrtb8mUduASN7LPKssnHc5Oe20DJ1xK9BgUSVAhT6d4AVZDEY8S%2F5QTic6evBHtsO2aMRmYJRKoqzRB3Z03oq9UUsCdKMK23zx2fbWYtv%2FZS4vSJz8hZ6s2kb9r3gG9PV4FUihjrgFQaqVOsC5rICP4ZNC8HwORWyFZS4em3660zrOKkCjUiS6rGGH6i%2BacdbCw4Cqcw82FR7tlOsUR%2Bob3yntp0rkYkhAsWaQqeSOFf7RYucoz2as0VjlvgBUFDT7Wf4JGGLLGYbkqmaKPCwBMcdSFh8VVB8jvLioWwA7FSH9xoHaL0HAU43ZMimBMwHMXDshSM8LK4t%2BE3YIytucTaseK1wRc1a%2FMVrUd%2BSISThnElfnREAJLCescKkLsSwZLeoAoOaCGhIc%2FTSA1LlTqeSSs%2BSliP2UNfFXYqn1Sf7Pi6LsFl1BPWOewVlNPIiK7f2Z5PvG2bM22V1MJW6hs8GOqUBI85ceKYnBvXzu6qXINllMyaGXhhsV4N8jTD85bk4pa1L%2F4bRtx4BeUkc9I6d%2FCkWPk5eTpchVUtQpZQ5ztTUDaEPP2rxgag34aA1Binq9alRUTCWwlEE6K3Urt3zjH%2BMUFuwQFr6gljmgj06Pd8Lri1bfxp4OXVm27n2l1fC6Rd4xij3xgWXLmIaWVH%2BCr1VH82YWnb055K6xxuBTIRFZEOT68cx&X-Amz-Signature=9cad038ce6b196579071f2387332538120e010e56fc0e5a926587457925b84f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

