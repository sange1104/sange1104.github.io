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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=2548297766891a34c5c6b53f11f366c4a4e56fce2ac6acb6da920020c12ed402&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=ae15cc7fb2c206705d8efa4303aa727f49c8ee111d6e8b7d6315091051f39e13&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=52d23314f3e3ece5937364e13c0f67161f0f0451c7aa942cd97f70aaae9ec619&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=975934d8c31df10b09eba65e5ede26c1fbd9cdb32cf48cdc1f3ea89ab8ffb020&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LA3KRMK%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIFaszwk39qMXu8MsPoVwrGrn7OUUQ5tdIC%2F7%2Fju%2FLfFOAiB%2Be2cZmvs35d37bX3zw1H1xnj1YoZtgo843W4q7GUD4SqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoC%2Bzij3m0FViPc8VKtwDRXt0X%2BAPkrdmOXjCTv%2BpbbaqL3S6kPFH7dEs3m1OlWcYYHAQg8VXflzadv8GKO3rsPJ49cu9%2FuP%2B%2BzE%2FMKpoYw3RHCrDsA7Ld0dI9Q26wCyl3vnMxAPnp2sYe1Ldi9relBfECf0d1rH59qEDlCVsW32THxIWmx81%2BgpvNwq%2F2IIWox0tLoR3Aeq5sCinA1gtfdgdVHMAax6KMjK8JN51P8ad8rrH8MoL59NXs2i2NkzE489iXmIQLs6YbJgEnfUF2sAOUSDmEAvxbcBH0Sltl14tXsygzQmHW%2FNN1uHQjwzl6s0HfajutJAducv3vj19De96MrqP7hi0xxvUKWDPc9gGP1oHoF%2BXZHQ6EusVCqBc185JORyxY%2FI9BlBYugFBrg%2Fq26P8DUjZc01j8vwgvUuE9XfxUrv5kOMdivmPb5aejaMuySeBfDjLIgr4sZm41RYQQPXP89bH5F1aI7NJ8pg0h%2F1hdT0XM%2FcznwtORMr9DKgs%2BfQcpTfvrMdKwzbgUvVoUkG1lEgp7WKDXfDiMmHqZtFaP91iqZgs%2BeMCy9h1dYB%2F0C%2BrDwewe5zx%2F53Lv5Vza9QJ9uqQ5USvSSAqyfBErTJPw%2Brcz9VjSuPolx0Th8y8DEunkUH7B6Qwhs%2BozQY6pgHqIhDzWf5pXOMcupS0hPLVBSZRdzE%2B3OvVPMWavFmw1iFWZufYpZ3CGWiVpsryLnwO4CF9BTz7r1PiN9ebXDf8SXaqxpkDW1o%2BfTtPD6%2Bm8b5G46OSPbVqHQTBHdUQRPPwcuUQMM5%2FOBv5caLdf9EMki%2F%2BP0OgarGi8we46FY%2BK4c%2FiNnIe9bSllsb2KtIbRj9e5dY6J4m9zVCwlYExSM2gtyxHpKm&X-Amz-Signature=37f3c54c683e83b9a7dd3613a8c1655435c5cc7e0c23b936ffa29f14ba2c3850&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RPCCOH6L%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025334Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIGSC%2Bcjy0Ha1UFrLpoUUF%2FKxDjvtlKV3dxLvTZEKtREhAiEAhvCR78f2zZxeD8FR5h9voOENFxuu7uX0GN3Cwt0PI5IqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEv5JumOToV8XnHaXCrcA21n4KMj1tJwuchxE9IjBrMSWiXTra5uT4Tq33XMmyOehNM8j9VBIePYIq00WAKy3BYeIjSROPC76gv7NpdQvN8mA2BiAfhSgJXOVN7twLyjqhH5Xh0q1FwaHJbdmLm9JUHHKqlMB9CurlqTOkc1lpspc%2FdK6UrWXCQnvyBkZfMTog7Afy09KR5OqVAkdRe1UB3yM%2BVC8x%2B174nli38tewv%2F5Wm0qZat1hL8sl3mRUPQ8Dk43PI02Bz6uqEd%2Fqv3G8LsKu5GNFI8i6xdkGIQcdqBnqXxqr7bQjt7M5PTNVNtuqCzGbNPI6C9QjWteM9iCL92ve%2FG0PMIW9%2BAk3abWZFRpJRUO9G0b9izXHG3CEZ4uRuQAMdAcbeb0Opi6LDeWC8gJPY6EjppqVjGUIliA13StmaxFKp6LTvdilBxGx8RnrnydSzJYj42rLvNdDv%2FcVnmAhS1tQ52NEXX%2BSOhgpUlZv0RkqBpugFTuZgB38lg4J6FH%2BoWPMzZjDmwsszRZgOwKoJCVLHrbRjDlBsk7584SBPtR1xYKnyOky02ae3hhpByamlbp4ORy%2BOo6Gh8Vwu0XBZMgmKVYWdyBcwebFO5wW0GwowqXcx7sVKU856izuXvo6j1Kl6tJlIVMM7PqM0GOqUBiLWs3omk9ujpr7aWkMjaMX%2F5HOwDeJjJTx00vOxFioYnV3QF6QEFCbW3yjIRR6s%2B7sz8Y1uh9NbUGHofAROyeBWzTTv6pIkuXi22cTbRQGh1ohWHmcaClQNGJ988P3n7sLZjE8PSlRtgWIGwjYZPoH12CaKR8nqW4QvtCC3aQPyuH6DnsnAy1yLc6FuVy6ysZgEl4BLU5o9bIIqf10MYFRIbDuuY&X-Amz-Signature=17389783140543f4ac78365c52f0c4ee14c492004cec07843ba230588b2d5d40&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664EFGY46Q%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJIMEYCIQCGHEnaPJvXoX8rbbDseRV74M%2FxCf%2Fy2RzRNeaMHHThUQIhAO5nR2G7Wb7%2FPyIIw4c5h8VZhZf3PWMGV%2F4QXD2Z28U1KogECNr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzztA0TMz6yfHEnFuAq3AN8UlQhAasqBfi7Jswco4qw2Wej5Gori8RM1G1b0DTLHKyqWvm%2BLLp8w%2FjSSG%2BzdSos3BD9VANopJbHeadKli%2Fo%2F4RlaLWiP%2FV5Y2mSlxPQqi7cZf%2BcOxJfb3LZ5QUs%2FQ%2BPYGup8u6Cuf0iZf3giM1pELbHI1V8MU36i6SVYfQ1MISesxaovjmQiVH3njWXlng3It8Yz%2BxPeynmxuvZNoZY008VTAUCaen3u2oR6BSpyBa6Dl3UBkl1EQ9BnNshpHkMRu2J5WDe8t490CpND1CU%2Fj06qCQsVhWkk0WYIMM2AwcTTFmb%2FsXSn0mjiGRl81LAh11JQuWbPjZLkwMR4FGrig5RR23Uq%2BqSv7ixXw6yUKU1Oq%2BYB1GJMk1yr9xG9ehQBh%2B7e84tdfIgU4nhnlu07S%2B8PJcAR01kBhMCgrv6QRODAtxntSPwGpRglGkX%2Bx%2FRwvXyZynFpajrNN83bgbpEnT%2B4Im8uCOsv2pzVUjjn2lcu8LfXV5JSJ%2Br6lTdP5AhsEg7I282p8wk%2Fc3HudiWhtgOyd%2BMXaIlSAlhxJtS4CqPvV%2FuSja6%2FzDZhrMyOmlbuBsBEOi1mtjibqRaDBHAAvEagPp6EnlIdXOhHiAu29uS6zsZutx1x73qqjDuzqjNBjqkAae42sQW6Dc61H%2BGpcKQ4qGhR7pBuqjg3M875ioQA%2FxF9zJyX%2F2UzRneMKCo7%2BEvJq01ZzKZXdzgqfaIFoab8eSXyZlNzTu0LAC4th3oXLwvhgcDuPog44CAzLtbjO%2FHZApVf1otIVDaDKJPsLMutT4otCqdRpatOpaopG9xAepL0QlNRL1FW6FcoSK1fPso2CgagMLcjDmktrXGFCp7e6pt69E3&X-Amz-Signature=2152f86344820747566a670f89d2c3319b1df00e97071bbe6cd271ed4c9eed20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VYIRK4DJ%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIBk922im%2FEoonGJKsKPOvo%2Fdjw%2Ff3OptDwI6Wi2pEZnVAiEA047ILugYWig6AeAC5uTnaCO3fR5RT8zlAsDc1edyalwqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCTW7HQVgN9MjI7sTyrcA2vMoqufP4076uazMZyIlK1ZFlGMqJQeAuXeOOxxC%2BdKjihb8GS5PnkDm22b7uW8%2BJ4i%2FkQ5MNx6xJ%2BlQBeTYVd7Zuqx%2FcFZrw1kK62ohj3qqSSNp34dyySwsmH8jGxBoemW3ajr7p4JiPzrLkWDa0YjsP3Q6wC71pjnsVaM2EtwZJlyyi4Kzus9FHAxb7IzIK9ZncG%2FOfOZdvXvwsi%2BeYRbI8CvIOSzAOonB8WEUAxfJqFteg6G%2FLPByJnwmg4QsTSoyJJsMzqdv2Eaa%2BJdXiGUFKcPyN21QfTqfOJMhUajkYGT%2BAyZ8O%2BAN5YAhgFcFElEwv4vqTj4JSF5p8lG2%2BgIAr4f9Dea1K3jFs9TrvIBY63eDHMq5gUA2CBf0fxmFjg8ugA5eejExuVbP7XyFweXg5zWDQtDNUF%2F%2FKjzbVXocRdGF3kDhvBrvXQ7zkOSnommW0rgppcP8jtdHb30I2EbeW3OXgmT6sr6WRvkvkP5bbS5jbaEa5Zyz%2BXCLPX7GS8wde6P%2B0lfejzJRJ55rUKgcw7ntxxgzSIBFwJDDliVqWSHjn6M69wKsDIZUEkbOZSahErzrutop%2F1sEcFN4T3gE63iItuhqt1SgMghzF8p6xReTzSePaWn5cfYMK%2FPqM0GOqUB%2Fm60DIYydz9Ap%2F1u%2BCgT2PC7ZBQF2rG5SHPUwDxs5zrVKgSrQ3Al9vG9QEZCdsrdhn9WDQanDOST8EFBJD5NnpFYmJA9xkZU0kzCFvJRWxnEZgW4IxEbr%2FRjo%2BPzje%2F0z4VPl8T4u0kaApesbUC%2FsXPkCZSYbwuI8%2Bk15wwTTARiXI2rh3f3qN9r1kcLJLHPCzWZFvvvfTHnzroEJKfM00hnf8XY&X-Amz-Signature=08b5b7ab80ae18b9fc1afecf695dcc6c6c00b79b60a8c3f9675fca2b062bf922&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=2f0e0b2284e3fa87cd2ad7b7dd6867ee98e83d915219c9e592911af0ffa356cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=bff0be00d2fe36419fdf529a024d409ae4a5929848d63a8ee547c7cf46b4dbad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LNPDUG6%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIGjWUxfENcsrxgXmGXsbj5CpWyFoKEYfRdmY9fKMhLMCAiEA034MxMprLv1iyer7ql4Dn1NAeR7TcvSBUBuSIa4FGPsqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJCs55ckiD3K3txi1CrcA766TBjcITP7DBdqFmeJlX5o3NqphGnCK0imxSRNdwpyoc9DeOv14%2Bbm2fENPTJVjz5SDZ4IaI3r5CbW20bCyvBmnGhpldJ%2FQcNTt9Skio6bbbGDevHqaLp10SzifDgSpIg75t%2FnltZqDRjoV3CF1cgGTV1LVk9uncGcQsyOOeDwV%2BLHGNlytH27m1IEpbUGB4C6Of6oCKJlS%2FVu1N1bb95g7m59yf4N44RdmZqKL58P5W5fU9MgNuHZCoUVFSyV%2FMONdXjTH2O9UWw5TaJBZc%2F5KZ29bvFXoLnqjO2Ku%2Bi3Y24PA9JS9Op0ffX2XT4cBSBzYUtw2H5M7b7oO308phHRt5K9mJGsezu3BeDqQSO0JRBfpeEQnWL1LhFFg1KuZJjl%2Boz3WrTYSqefHSK3JeWZCcUZT9sGzGq0wt0mqTR45VOQpK2W%2FhAI6c1za5Qmwsopnv3kEyTCQWnAUtLdeCxZmd3G1cQP%2Fq1CyFdtrGfheMMrzFfeGfG%2FMgpKSX2wDQy03dd6w%2FrM%2BaxfcbHAwl4NKtmLEfC4IDvcvxjK51jr3sKWkUR9ymxTZHVWdsscKnqXN4VPfTUaCUIfdlbsbC38o4lUxHAjPZN9kRvD10fUNBUZ5lCaGFGVTlBHMNXOqM0GOqUBD4IrQc%2BbfSzsstmo6NXhCcPeAcm9LxMRUwAaiTn9BrVANjAjoeg2kGgIuK60JBVq9vOP%2BRCzr7o3qv2bQT%2FmAdrsT6Q4Di6sOEAs2BU1pezmiXSFgj1%2F3QeBwNr34XtA26lY3txGVu%2By6DzRp29mU%2FLWx4iHRYp89ZgHrKLNw2K3OB1YEdU2GdYSRjSQg6DODCbv6gocpVjQAiRfHWA9f0bVsSab&X-Amz-Signature=7f1bd13d15ef0b8f9ed27ec84c1067dba3b2a2ed89e50e05c977adbb7924b4b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=c666c114c06cbf05f6dc946e128583b37ddd3e3dfa3a9befe3a0191a52b9d816&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QYZT5HY4%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQC73fouLDX9fhK3gDEQz6VxZX%2BOYgdOl8PvrLtGWt5ZhwIgfemdEjG%2Fo5%2FuCtSUL2Qi7Zn0TWsyLNNwOFvYeZe9faIqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP8G9V%2BzL0BPj4wCAyrcAzZBxS8B%2FSGmEPR6dFdaSHPHgsPRXRB%2Fo3obvDQubjliV4JuhXib2yme%2BLzRfTqk8xICZpW8ZfRYPXg%2BD8QMkmLzlH%2Bj%2FGl6tirO4g8etcHChYjAqqRzM6JMLH45D94kY%2FrpEIy6%2F5fNJWAQOD%2FdqBgyxQ3qekWZKkMZZMlMUALjSLBzTVt2i0uEJHs5Rj9pxmL1duiiTxPaj8n9NNfAcNdDQUa2x1iJJbGiJRehKXYESWflx3B9Y3U%2Fm%2Bk2c%2B3xqjkeLALmBdwHPiBGYlKwO2Y2WHznDLXpZWXK7nQG%2FQ6I60aBkRApJ%2Bv6CkBMzXn7tV3nJ4y%2BSudB%2BAG2imZ5QzkHKDnbJL3R5qKDtQc0JA64nmUBj5nX3YsTWooaoij1OCnGFeOSI6ofYq%2F57WT1eW%2Bn4TPUcOfgspviTvsk6jP1bKtVltwspU6yNutlhpnoIZ4VtNSJDvE2uJ%2FIrLFYr0PmVYApnkj9qomjO1FHUNwfoLUHelZ%2Bt7xNHKwJwkkoi3tByRTxvJyFtxgrXHfBQWCG1kVmx8quCve6qgBjwapzNSKR%2BZHYFK9VcXMoHUyg5S1o9dfrg0OdTl5vtmi0ttro2%2F2c712hRhTAmOkWfl9njj0frUr0OrBE2BSMML7OqM0GOqUBmT7DBubMZf9W%2BHyn8gPh1YNP5UoTBnZVf0jXd0Bi1hilVKEklILYu0xWAuAEjHBdTuia9xZXc%2FHDYAzNNyr6WpaTrLfGoYvgNjtmdbR4shySmhL8s3COv3uH73fRsFAAZxYAuvQFTXYhfw2Lk%2BQr2BHG0r6J3bvzEu8UVh9sqtjNTzVbforn0jTawiseIObEDRB07blYOxlntpP7tCeuSYfaceby&X-Amz-Signature=5751dccf72639eaadf08a34a99d2862b129bcd2b500f192399ca1d6d734ed47d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R4JS3OZE%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIFLAvE%2B4iUrkXgq052F2vaEx7fSLMF8Ld61uKR19essRAiA2LTgijz5BdRI%2B56wolf2mcK3SA06oRVhxkTYpCOxDriqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhj4Qxk9wmucqSd2cKtwDqQZehSj%2BOpCus%2ByngR8orRBux5PTEA4FT0kFFIIqvIbW7ulDoPIRozwczecakGlnugxLGciMDRIe9FtK0Prtp0LjWbBHP%2Fv6QouZ%2BTnbcZXS8%2B3BwsowBra3WPG%2BB0VFPWU0rt2qZZKOqwHjxGfDxgm%2Ff1fpwkojrTRPH2eRLuKuA7Z0vnBgofNB9QN48qEmmlt4XIWM2Rbyks7NbltzBV3Pu8bKqtB%2Fzw%2FULutKYJE6ZlZigwv7tZBqxwTLWnd07sg9oWd6vKtzSfllodW%2F5zlHAlt72rSU0HjqqP1OyjeBpX52TC9KQmZ4GuSbnBV1NM49OpSox%2Fi8thBJ5MgQVjdAOutlenXidgA295RWRvtWIxdFCzeLnPsRQS0fpWDpZaHoRsbb%2F29sjT2H5aUs0svXp5mPn%2F8QJyezy5LfIVbNV0Om%2BASulCGj32i3NNR5k%2F8tGOJs%2FVZmWsiz04qkBETYL%2FWLBi1zpszxi2di%2FvdBsXRciZ5g7XfczLTnqcusOcSQRJqJDJX6kihgwPFOJKRvXwBe%2BLCOy3TcRfSzKEUWteB%2Bj3ZKak9Rx%2FUlsqloi%2BUx3W7U9sSgnHN1TKNovZHQAdbFkhwpQbv6yYGmgXtch8SMkt7WroyFELYw4s%2BozQY6pgFcSctZ8uFXp%2FrGOwCmIJq1zRQhpmOYEVMS%2FJd%2BHXGzSBUR9oAK2%2BqrreWHZyvzPsa0OHcp8oIg%2FfhhFxMODiN1pVNF%2F73R4kIGfH8lE54fPxCoJUBiyxzKFQAklDTq45nBrZuZa1XMPQ140xQPPfNwaf7v00NhL9sxNDzHreGSMl1G79jB54ZBo35Fjngbr%2FpzMluu5RjfqrYPkvYur%2FGkhIGrTZgk&X-Amz-Signature=4296ea0a46981732883eb10d54f9a1e551db55031d4e6e6ca3c5322ad5af95ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S7OQGXWR%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJGMEQCIHJwqdw1YjFK%2Bd5SLaYu0EaAu7%2Fro3O6zyP4xLITNIv8AiAPUWPzeBvYRBntzZoY1IiMAu1mdKNxPewG%2F1s%2BLltKfiqIBAja%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMA5ouBTZGelkdBxs3KtwDunf0Idk2y50oV0B5UxaFeYbNsHOw4oNyUA346GavacsnyThUv2oLsXhv1%2B9qddR9ao0sTB2AlTp3vE56l0FKqqK4uZdkWud6FvTOlUjUW2Sg%2FeOyBUjjoJf6b3lac6xGuPaMhcIiYhZPNtQ8F%2FFVaoYPU8uxPjqNqrDQzJVPGW9mqOt7nBBSu0H1aemcAzg9%2FkGqMnwwAf0KUBvAAmjThBVhPg1Myz3hgE5rt2WXkmS1dY6ICoC8fAVhe8gTsEb02RVkEkvXTFiV2tluZLTHB%2BYK7Rq6qM0K8o%2B2jOU0FsI7fcfThpks3MgyYkTNyDAZq1hFWIOedKhlIM77opgjwWW4ZMujd41eZ5EveNpFz65ShnoP3p64CFF5FHjEYSNRCqyDoIZvt4oahyZt%2BWu47rZ0jHktb8Wu0jMkIO%2F%2F0ldF6la%2Fn6rMbbLoXBvdoS2XkQt%2BkLNl7hUmL77ufuB65nUxiiduVCm%2FtUXDLGwffrlGf9Hkx714M8ugEZKStAiOXtxGmn5kNSoVMUmDAhK4x28E4ZWIjl8WelXoQ9%2F6R5H0%2Fnm8J5FMVzSoiRkNqUE6FtPZVU84mjzL0AoDbLUNvLSqMD6PhgCsesAxnhZFAqANsBsQSxO6bjC1etQwx86ozQY6pgFeO%2FMtI8apgzDxYCN198tjvpHPeJj8oM2ThiuLTAHfPRPY2yneD0ZJHA5mChyPK7k7Wr%2BIadIOFOkI8icYO1ADZZ54pYuP2QGPL6hB9l7OqjgBx7vpFwvS8XpaIJMc6%2BcPDk3YN35Uqty5TEH2maPqQHtGzWylor14cezHkjoY%2BNGWw45jCkMHN%2FUvIdyu%2BoRUbv%2FR4AMR1cBfJTkZ7HdDP5LAPnJi&X-Amz-Signature=9183506171320cd2515f02b8f92fe3c86e327bfe141afea15eea5881dddec28d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626WTUUSM%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQCYZqdZoGfZwSLlI%2FYq%2Fb5eZm7b0mIop%2FPOEdGX%2BLpCcgIgTyBVrl8ZZ%2FP%2B1DXTp%2B36eNneG5qNYMBzH6mrTncgcQ8qiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEMJPZlIydS4LuDFVSrcA0yjSOg3FnwiSVfbi73hF1btU%2F0V3yvjXY0A2ZFs2n59Z1znmAX5C%2FZU%2Bm%2FRM9a%2FZsyOadWDhDYGaOfGZvn6PDy0G%2FT7LNPsG14vwzPgnlxyeqClfUTdPf7sjVy7mXmp6XwF5KbS9xQL4FFw%2BRS4njIjHLW6whzfMCSQ4vCMVJtGiWDCDguWi0UjYBSQuL6PWNJTcr0aWa9mXxjEyRXc2Zjzz5zElrXBvZ2icQBiQIANJ5kBzuBxFZ0t0WPUIvFPHA7DEDdJGIQG8B82CHgVmQJfJ50RDO41sY83xeEi7fZ1%2BVjFxncygk38cbZ%2FU0ulL1LrP6tPPUtRXJE0R9nt2uaRJFO4L%2FidXJsaM5q%2BN7iScBtCWs9ljPuvLpZaFxNVhZalp5%2BpSFrXB%2B04iJlG7niB0CFCQr0I4CJ8wFrtvs4FFNHTqdzj%2B3PlM0UAbH2zr8N2YZoCoFhcQmEdOfIlDkkv8y2FCRyQRXzzGOCMNjlTV5U7ZdAxQo7v2l0x2qAIyWDHeNYKg1YtA1AVO2711Xx66VmHAfPG4zBHUfBddkaV3j%2Fux9lkmVZ0L1%2FPsHa4zQS2h5JStcv0QUKSd7QZTD9pFKt6BUZ%2B5o7lQK1uWbjp7E3opy0y5NGLa2rnMP7OqM0GOqUB%2FMP4IhWIVAFzZC5SOXMLEONe%2BVNlY92MtZrGGJ0Isku39%2B9WOzyVSfOEIWHljAz8gUfLqBwAlBdY8VJ1MlonpcBMUfauBCepcDTiRLDxS2GSt8NMiQH0UsLhfm9kuvMdyhIW18fFeice%2F6W9zvM%2FEKgncPsJpeJOYanjxP7WoXa00cJmTyHzPD4tw6xEnirxqx%2BsI1flxMJTV%2FuSHWRJTjnhHeJa&X-Amz-Signature=1bde955381b41b15db8b9c8083491ded89c8e5338c41e2bd1726e45b6444f19f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=522369a348328b57b193d4d58068e16afe121965b81f364f81e2a79e96727ede&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466254ORA7B%2F20260306%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260306T025300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBEaCXVzLXdlc3QtMiJHMEUCIQD6l%2BsqftcY00FIPx9rBsBmsHRzpSBTbP4F8TCo4ua9MAIgNApHGYCshbLyTP69a4qUIcLwCUuhFT8jPxWiF%2FlueUkqiAQI2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGJpZGaFFw0LN%2Bq2BCrcAyAOacPBYuIx7P6ZCnvDrxIlB3PcKWjcgIQvLyyW%2Fie4K6HyUmfQLocHZj1Bcglm%2F53UaUlmxL77%2BPnilHANJn9f1WSNN3m8TlsjinCQYOTgNwJnNOYfUtuKXPVgnmDvU6y%2BPCGWsvZR3O8CnHmH1sJSJb5j4ya8PtG2dTXb5VFp%2BwxXOKV1I%2BW9XxLRL%2BCi5jxr5n0JS9SJEaBnX%2BrX4a0xyeJCfGWTFY3DIKX%2BVLCpSI075acnqhXPqsoY4I%2FXZp2LdSlgomKreyFJVQgDQKYsFWDAhAAcOnHEdlE%2FFQcMgxUVat2f%2FW3iWovQJKHir0vSXyMRgR091yysVnffdr6DaqJMaLWGm1kfRj9UheW0CYjDjbpm1eyFYUT2ZQmlb4lKPM5D%2BsvWnmJkvedT0GCICpBcE3CrBGiXS2iFKo8CVGscW616hlXKDzE01H5DFw4kcCXa%2BVH2uHNk5gvRHd%2FE8%2FPDHZFk2EKWg%2FUOYY1qt9FiUI%2FFUqR5kb5KSA%2F3H0VwrGacYhtAicopBkXuz0iy2Ozh55dYxMjUEP1Uy%2Birw%2FnZwVJJFjI4QyJAKhuHNVDaGXoCQTdOL579IzTuUn0N28qQc6pA5oNGVJS86XBRbW2I70jBO69F%2FOQ9MN7QqM0GOqUBHlg8WWCp8A9Mu1Saa68Pif5PqdPNOF3G8969Eem3O%2FT2bF3Tfix3LtfxbQBw5BwtgRmBvrLlXuWbcojr8R4K3LIOoUqL3cQHott8LYT0lMtSZxNnEB1cTl41XJ43bgH65Pq2XxLPIQaHmyWnb78ECie9WQcMpglVBwpljCNikzjW4h00byrGXnNpsVaGJucaIX8gfzCbCLcoeG5mOooXl5Grq7ES&X-Amz-Signature=1435210f8eb070ea4df059c50b528af539975c04bbe820d3a013d46ee0ae0f3b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

