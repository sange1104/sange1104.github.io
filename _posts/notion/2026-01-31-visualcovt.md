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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=914ccad603a9947775d36f31d056efcb8a0b34aede3b7c025afb56e9a0421c6e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=a24ef8564fab7833ee027febb1aee2388158fb386f4c9adf2c5f4fa03f31c8d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=8da0ebb61adfe4d8c1b03374a8b1ec9bd2d9890c46bfcada6a025f9c7d769edb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=e34c837b03ac62bdcb0385937068124f4737f7d3da819f1a31c705c8e1ac267c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YKANWCMS%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031642Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC03Ov%2FzsrXV3zfOz6wiy2hz46ZHAkTXb9LyLdW62dEQAiEA8OQQmYggOaUG3eixAFlEaARxf8AbC8thQSl9VCblWEMq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDERcGKKsiRxUKmIMTCrcA%2B43vr5ter1wZ2bhqkNYiqY4HshU0Lww7zcHgxcURa0uucOAPO1wXteaIMTdVzXkyjaLRNEqTFeHnU3ioVUCR7EZZcuMzNPVsf4wxMqA9oiizi2i9Y1nBTHE4rc2FalVvLi2MQddfu%2FSftLxS7CYq5QICXtMokhfn8PflGm9E85xSk6RtUHlGaWzb%2FNz07%2FBm6eAQf0zWut8DDu%2F3yswmXBuacJgbRRZPsbWvViecbOxS5gYcvp9Vnl699D%2FQ1F3wtGPC2Dn7HtEFzVaa1G9iW7X8ebSawF2QpaPGITRGVw2MQXQMh1I%2Bkq1d78veN0cnGpJ1qPD0SjJ0hbKpDHFV6Gv9yFDLK3OTMURkIGVL7zMa6UX8wFpxmBQshAUQtzuGjV64Nr0gnWbp8W2URsH9Bo1FRqu21%2B0%2F4oTABGbvWSAM6Z%2FQdHQWlmxtL%2FinmLEqgpwNKxXWDTZvAAy%2BcLLkaHp8pK%2FzPFfC%2BOF2OGCMwrSOUAuKc3OJLXY%2FoY8eJs7LhADa%2Bn8q%2F4f3oSPJEvpdFw8rxtyEexxv9FOUsxw%2F74Er633KJVuPLhE8xCLNxKXWec0QouWSjwyAj5dPZ9yafQkL7EgJI2GfRv4R6bsvXMwY7swzuL14fUdw0BOMNuf1MwGOqUBPOceW4MWHKYT%2FrZB%2Bm7My6IrAR1cvAPNXCTbwqiMmXkz9K7touPjkHUO0UKpxrcDHDHhdPzIMBxPJrnl3N3OhIZNNsAEFhrfAyC6mDUlEJk6rVsyL1MtRXfOM3HMJtM0S39vnAgFmdzz1FQgXNnSqLo4UTU7DkWBcVdQhjijSE8rjQ%2B7sxpE5%2F9rO1L4bn0QopjxtW%2F73qF2miS441Lk9SGCkZK5&X-Amz-Signature=c0e0ed0f69a1a792bc55bb79b552b393075be7ef5073e2060b9e56d19d440c6d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46677CXKDD5%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCyQofxtrQX8dgGQudWQlhtaj%2BSIaQS1egIHG7KNczu9gIhAMyyeU%2BfYUsZohvrUd4T9QzSFlCd3dnokMew%2FFvS3qxnKv8DCFoQABoMNjM3NDIzMTgzODA1IgzI%2Fqhr83CWYMSEBdUq3ANDQxNOB2ozoqIGWbQGaHHR5hytKAWzU%2Fh0pfB2jfrI8D42UY8vcqy5lhE4ajcp7uwz%2BZurhXYwNwKdP50j0nzoXJWH5OeRe9Ln1oADCHBD%2BQS8E8nYFioQrP7Vazrc7a0eybUQWSkr%2BJh84vFeV3CMly7PaHb%2F0ilPwSMQ5kwPi%2F8pc7aNL1mCWJgOZLHBDiEyaqYdkXB%2BNZBagbzJwuYaPZAiS1M7kdxxuuT6SCO0KQC8LErgplVQqvRQ14sY4cFGV%2BOO4%2B888nrDjzIzZRPEteU02YXW6dxuQeMfylKYJTMkyfZ4IXk2bk8auxY9jyfJvU25NeKm0R1DKbbzBCIAm26AVsG0LIKGcSJcr0O5bQzYXsjcG%2FGrZcSDKqo09xLgtG6beExnkckSV7xQvjAoREuB62gSq3Um6GhACKlFPoVu0vuTT7kIEjunvYifW6ttIiZXMu6eG3zlQoWu8buBG53JvMGC3EqBO%2FcAWg919KtQqyQYBVqaeeqblx0R7%2BezW2fVsn6b5FRyRzQgYPIn9jHmS8izyLwkruGDSocDI%2FDYIHrDKpnZzmTF%2Fp97WyscDG8BIIGLn5%2Fu%2BmFUMKViUiLXAhtldObGdlzkDzGSGws1Khdf0L5OsxwkLTCzn9TMBjqkAYzMZWY%2BM4okg9vR06s2xu7XuX8D2hOk3QRXlqdREZBYksRvGmJLMELKApEGeI3o%2BGKb9BM6OBQFxSGE838Vv8dYavBn9cOL%2Bm%2BDH9fSpnU1mm3YXAy5OTYeMmWQjA8X5xzAmf4mLyk93yqaAVKsqJruEAt3FGb5AzzILRCjrhh%2ByIBeOAZFkPHaqfb5io%2F0XHVdHC2MvP8R%2BQLAj3Ab0G1fFxux&X-Amz-Signature=5a9f64a5b3c1dc7a91803d14821602f1173cb2d6fc7b71f876a2a452452ca8ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YW235WOR%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCi347TNHoPkuzohnD5Dl0pSIhSkZZGJQz0wz8c7NIrXwIhAIbjQYwOofO0SIbxomf6uaN%2BP6mhpuP%2FVDHCAlfhSNGZKv8DCFoQABoMNjM3NDIzMTgzODA1IgyL3DyyDCvmqHVw3EMq3AOnjh%2BOtQvtkGA52oBWgapXiFGEIPVsi8AIxZ0FI%2FfqB%2BebN5m43socEHfZnS%2F9LMkvW1%2FQK1OEfesHejOtUxK8zysuh8acIqc%2FSlxpEmZAUDgFzOzZRrlb1L9ZnVQmALQrlBLSsxhWorYHnV%2BQHCr3OZqulKfGgkGtfeGbkvPUoFX7skFWZHpLYbprxlOGKlfYMqzNrqhg%2B7nX2uFRsh7M8bkl3VKvz2a5iWzmiP211bjRsmt2Yy%2FVlf8XP6vWrEpepniynmyUneHQ43RlRkuqk1IflXikaDXzFKlhdRhDz%2BS3KIDaekGl572TNcXuagHvAM%2BcKkdeYVoPIVTSmdKdZfh5mvCbiNxbIwH945Z71IZo3%2F37IHQuwfshU3Ojjs1yN%2FN44ng5Srz5a9SncdOCKxqCy6D2MFZu0ggCW5Qh530lERjq4TShUMY1Hrzm9soINXW9HUDjW2XcHxPwbowsVYsc%2FAPJKDArDJEgnNx%2FL%2B1XsOQrzzCW1jootDim5C%2FA3owgh7vM8QJF7CiswzOUSOT7DBY7fPzzJvuFqY%2BZIrzDCo5jkMFwXFIhxPPj6EGwSAcw5qrJdWGfZ5OY%2FUgWef5dxkbTuT1klGY2dnkxmYZx%2BYVFnCNdGbZQmjCooNTMBjqkAWz9vJTcRX3hEa0P%2F5VlbiLqUwF%2Bq%2BTBAGwYmEJagG5A4a0IB5UpiKcOy%2BC18vpx7cTgHGAjlR3%2B%2F%2FLsrxpbIKrDq6gVW9z%2BWaxIwGryqxNsFi03DkI7di0I%2FLytFKkr3mhmJPfrlq6EHmpYLWDduta0fj9gJVaTJ7%2FYT6pHg7bJfUmzJoHduNvcN2%2BM%2Blxkm4aBJt9h3TQIoMWvvsRiLD1c0%2BCJ&X-Amz-Signature=8b0a6c66109c167189498cc41836af06a11b8839a547bc7fa1aa8a560063d219&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WTFTXPQ%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCNyvZ1acuHsZu9D1Liw38MA8CODSU7MmTSGVvFzCfenwIhAJ%2BKJF1w4gqypM806bU4qSdBigpTJZunQSAAlTPDsQLrKv8DCFoQABoMNjM3NDIzMTgzODA1Igx0kqgwlSWw2dTnlE8q3AMGdYoJ44NH8QxZBmBEdweGkrRUWloyIkLi3pOAIrT0h2pxtu%2BMYfI5fozRr60ReiFMsxpuU2wQvpGr2YDv%2BuEXZfi2W5aIXA6YhHMDWPZvQ7NZnY90pDKW1C1pFsrWjwD0PKksLqFzkzi8rGC%2F%2FP3%2BuAbo%2FwrdEJbQVQScNyHfYYB6hH6lIP5Vu6tI%2FsiSXGeeZX3ercIFRAhlwpVQSNh38m7nC%2ByQ%2BWurdR%2FN4t%2FCoXCaFaX7gqTnbHki7oJhbbbua%2FrE8fxMN9BCPxV6yNVJ84OaxnPDowul53BFeP0h3ERFjtsLj0sGKFOX%2FD0aKTHHRAnLkk45Y63k2E%2BHtDQq81PHWPHEuALbw%2Fl7B4L%2FRt4Tq%2Ff71Y08PCX0ueoiQqigzJ%2BIPHPxRS0wG7mMZIph%2FkBQ7WKiasX%2BuieRT%2BMo6ksBZw9OXajGEAlDGmdtnaBNh8VkJUGe7yQgo4%2F%2FTUeMiVsl%2B11mrdqtucKrstKP8xNoBGOmz0RbbPAl0kGQGMpeSug2Yl3U8s2G%2BPdNptl15R31VPQEfSrePjeaK%2BPvNWDe%2FIOfKByPuTcjzlkKKtG5TZWcLBu4EF5pWq27jwsprXyZiK%2FG2FpIfim0O9R%2BMdlAkGHUPCxPORP2pjCEn9TMBjqkAaoank4XuXMmMjidzRQ6fz7elKZS4iIxg5YJvJ3l30jQcB7pv07dcoxNSPWQukTWVF9ruMg1jATVnsuBoDXLIPAKGRuje9kz3WJARg%2B%2B3O%2BHIboJspZKI3L06gqXv8J9vDWRNUn5%2BjML6ShE6IjHEd%2FTVadXnYsl3yRTpVw7k%2B8Tt%2B6Zr1KefBRWyuUUT%2BX5f5bMt3UAPgdPiZMacyWiWUT0EbXx&X-Amz-Signature=f6d793c6455de51fbb293e17aaa4ef105942445f50c15485534604c48f76af44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=c9ce38f04c55fa67794fbb82d417019e41fbdae2ccf3936b145a0ed5367b93c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=d3f5730d363d468511fe8b432a5d790946cdd4138038661bbf726f51e0839236&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SOGQYC37%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDeRgRsPSvdpjkF14RcewGnxUslmSq%2B1ohY3w3MfBaUPAiEA%2B2N6Q0l4MaR9nnYMR%2BEdTF%2FuAMNXveIOEYS%2FpEQNCpAq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDOewDDsNiWqK1KQySSrcA0ul6GtdtytwTnG6DwEmZQNHHTBjqqWyXyYOox3g4RY%2FH0I%2FeDqjmpPfE7a2%2BCtPNfl9Mux4oTRSXjsY8W02C3Lbj9BPI7N72U%2FwFKg5ro%2Fdfjv0FTx%2FkVgCaG7SM4IwkSxJxSCk40YCP9zNKE%2FM0pRRULtNM9NKQIbXK64ezFCkpCltfQ8ZjA74x5uKymv2q4NA%2BOnfzyUMglHAODDkzhTkarFs%2BLa9Pc%2BvFJOjiK2hoGXaMXZYr3meK3WuQQ%2FvdgIf4iSuIF2vLfCBmeIymHDIyWZprBuyG0Xn7bZ3WtXRb9fIKJNyuw8v7pGu59Gu6WvUn4d%2FpKecfMMukmLrCd3IP3pUGrlFKSPaK%2BGwQDbw1SBCc9It3OwVGYIeyDoun9WbaYxwHHFjVR8MP2kULG44qk84zsOfO4KPxsq81QjmjvyLZpFWqmuY1fw0Z7oqRf0nU2gT2l7PfzoRt0BF%2B5ky%2FBF8%2FUk0BXcYJ%2FoUWNSUiWodezU7EjsN7FdIgMhDyBKOqHa7Qtx7da6ZsIhHjOCbgeGjnD2yFx5A%2F35S%2BcA32k7jKBBNIb1rTHjcu6CX9EIFkv6KClFvKkntyikRyGBYsvjoeheUJnRoglPX6xHPUAyez5K6FpqgzyU6MPee1MwGOqUBuJaC5kiMGEuspR64xml8niEO8%2FZM%2ByVJAEAaqpGwnpIcW0KmnSCwwW%2Bq%2FB6ax82yBwKSQCZtiV%2BN%2Bb26ssHPIV8nWvgD3wQGagk1mTjUaZB0uBUSzcLwJQV6lqBxIp9fZ3kU0yUxifd2VHTLUzXgzKQ1tcrrO1yxuIcu75vFYjHlrGgO53LdjYwuyVWT0OWERMu5g9zRjx273f6JDz5PhMQHUGSJ&X-Amz-Signature=e1569c59813ea33a47da9b42c4c34e6b5133ed6fb2a67fcaab9810be402593ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=584d6f12b9185f28e4145b0cd14aab0a315ad9a8f30420b24836b3d29d483eb9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UIUZSYAJ%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGbTz%2FTQuNIqbOK%2Bt6SKbyEq5FHhiS6I6kdZiU4dvQ1hAiB6Ec2vKJ7smh0AYBzaJGuWNTQXKebkisOXt6hulQR9cyr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIMznY7hdCWVM1uMlg3KtwDMnriYmCt3hxbdb%2FN%2FcAyH7YD3jpOEJZFNjhWlmHi8sWLYG93i9TuM81E2SYi6H2y0dm4qSSCD3sG0n1Rf4hUXffaRlrASuHuW7Z%2FY4YDQaIr9Ew5%2FEJn88oFKjpxgKbRIplk4WodPZcFJ36hl%2BMZvbkfaHd2bhn%2F8GpcwWb3c9xw09P%2BDehjHtAaGoJ3cPGPIvqo7IBYXEGSlc8Kd7N%2Fu9YuOCnsXuE%2FcUf%2FJ7Q5TaBmmlKMn%2BY7CAGzuHn%2Fy3TzzQCZ6ApuhCKdISuJAsFaMRIXS6EprTV9bq3qmrm1vQYaf5ejmdhQio%2BGSUlEJbA8qfiHIgFv%2FON1OQr7VMRGQwHKxPEK%2FjwHmQaKRfUXKKwgF56T3Jz17AuzfPctCD2up%2FWD2j2lwFE2GpHZOdSqTpzFEksy1KLGQhJoyDXO6V24Ga34bVTzLlvzPCCkr%2FXrjao4jMX8q6I8L%2FRMCwUS%2Bb6B1uCkAXg561VA3p6K8hgB3HsRkfR3qWuuzfHplRHEYHqPKJ%2Fm9vPEK%2Fpf0i6K2TG9QXtnd%2BL8LGb3O7X%2FjiMFH4ZkFTukZ7gh9ZiPgWwWNVPyv4mbWYTuz%2Bfo8%2FrBhQG9lGtv0nIK5jaM88eq0EPfTXKLYQCUZHVaAD0wwJ%2FUzAY6pgHRssNww86QCfk7xt%2FN0K9x5VIY%2F7p9PCe4CDPv6dy6Bs33mzrNYhuC4rnXMCJ5ELli9DY50zE9Qq5Pn2EZk17GBhrtgqZy2nYASaJ45j73408QaKEmCSJNE3yh%2BNDPbNXTaSojbNzByQZLea95r4DOpYegKHQ3hrD1Jp8ir0nfZnCIdi7mpZ8ksEjVM6ArkmQBtk9L7AEnZX4FnX86dzE%2BeXEO7izn&X-Amz-Signature=3deb9701e307ed73cddd89527122eddc5c9e45cdb10caf2f11b18e4694fa7d02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QMXGYITR%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAcEIFNvKwvERbBiCqNW7Qvhu%2Fhn0il9Xeipm5NpLeWGAiEAn0ZIUFA%2BR8m7dj03CKRaBwtE%2Bzt73xaH80L3FyJHG2gq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDF6qpSWnvW5OPqiF6CrcA51dCoDRlHovsdpIQ67Pop8KMUMcqP2WmWU2WBQ3EC4eKbdq9gPcTCbFMRlXbWGJc6GTCKf9y3hspd38mNi11T70BJOs%2BqqELKK98M%2FrZM5TYueSPpDtwcjvgD5CvQhEFkikzqbOq2u5G%2BNPYc23cnQEG2uQVWm3gUq6LkaSGnHL%2BT5RbK1CRAdB4PWfwALvdbkZS2zRQsDoUzRIMcJbBaHzLcO7oLjNMXCBGpyBuBQN%2BLH3ViwY5RGJEYtRMoGbkP9zpod9X8csmk6FIcfdUnj4YdT6fz74%2FbUcxe8GXMXzUyxyB0FTstjOZ4trdZtZqGVe9mtrdxRF7zZiyY51%2F11yxUU2E%2F%2BUbKVtUzYmUeD%2FhPTad%2B7GbFOgN1nRLD39Om77RDwIdsfFf5d0bXeqU4z4iGq%2FnTOSTBZSZrd%2FLUcKzYt1c70ptTETUHMuKzAvuSWwOOPuQ0AtXAFoUcS09GuBNVMZZ%2F23Ev7LRB8y5vVsaULGZAFpUokxxAow%2FaD4tbM%2FQmEVEW%2B57P6cc1vhcjnenINEGDxBCNF2kXwOj1P8YYnZXWMseZtY8lYzTxXUt0Q%2BSe2uEppAxr%2FyuCpM5iXqD7X9iiOEvwoYVY2MSSAKv6SsPAqaPVny5TQ6MMuf1MwGOqUB2ftBZeSDrfPInT23FC8%2B%2FUvfJAEcy9rRWYiFF7Ei9FQfGrNnGOiybnVQ39AF3iJXSi6vdI7qykpVfdCoTwfVkzQpFgQ%2FxyJb07tYq3ZqCN7P9ym0z7scgqxBEpePt1u1%2Fs0M%2BcgqNAGORIcFQgFf0LF9uTesDoaN9f6%2BA6UO3chzjRCfDL1jdzjNOsGInFd0xn8z9QPOB%2BNL3pILFRgAd%2FuG6YOe&X-Amz-Signature=c16d61020f31e75765ea7d3ef212cc6c79a3c148f0b262a9cb5bf9932ad725f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y6I7HVTC%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD7rKOVAiRxVnYhQrX3v61hmIlpOH1BlQLqQUfqPjzJIAIhAOji7fQGcSCQ68LN0pNUCDtR%2FTHSsuykNC7qzBGsAuWPKv8DCFoQABoMNjM3NDIzMTgzODA1IgwWfucX2k351SzM7zUq3APtEMSOS4K0wXdYvckrjWqqzWIHixSxPDmQp3oy9PTWqMFCBwqlhbB5Utk6%2B7tpmBadwvT%2F96b3LfmR6Tn2kFsfA3pGRj0la8HDYbTIe8s15eJ9FW1kw%2BEHvDdllOf8wTZYpRHmyR8xD7R4tQDVuyvmwqjwSOb0qxFXSACe0BtfSc%2BnqCcE6Jgmy1zVlSkh6Xe%2FTaR8CugM0s74UMJQr2uuRw94BuDs8B8fu%2BliumVdErWUVL8lUnyWlZb9%2FXIrTWQLU05whaQmkvPbRMXv6bL4DuyTPUnn08xdVozAxg8eA6yQ%2FRNKrQKYYdMbNIqHQTFar8ulEkfZC3kyXrAiYq%2Bq28DpFq8gIlUBsATuTnMtE%2B5skwCicHk7%2BVIjAu7o%2BBYyDgg0icyQxY7geDW7%2B8cY7%2BsKfB88utwnttyPXbBNL0xQBcsLzRW46BtOSQfJ6QkcYEn1Mw6JavdZfNT9AmhtviJvdQS25QQxTxA%2Ft4qGUq138BVucTkZl8WuCzwrKwcb6BRiVLXvcRhCAHK%2BpQ8snexViI8gRg1iIL9DPIFk9cTru0G6AZsz28DaYRwakUO2nqUbEz3o1RUdDA5ItU1ZdHS6Z9zh4P1xgNncjhsjcRBTFPQagdweXNNpHDDUn9TMBjqkAYUkLOZvo20qsI54umDAnokKGwxyqhhnJ%2BBytxbMeZOwdTJyAgZO8cz20GpKrjqHcmDFCVFcN%2Fy8o5k4zbmmNuhGozkNozmuDUKtM7iAPTpRf1SElAIyGwAY9ZAXecICw%2FCiJiUd24QSiOgzrQmAS1Iw%2FdYHivZb%2BGjBY547X8LEbMqDRz%2FEg%2Fam4eYNa4uvndmubLjmAjncgym7SyDQMyWI5TO9&X-Amz-Signature=4c15143df4e84d2d792af14cfe7c7bc1171b8efaa520896e1c3dfdeb2e41ee2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YBFFHM6H%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF%2BlBC30gyvfzFDt30oIm45AcBwcniOtjqVEpL95I6x8AiBFQ5Qc0Zf3OgbeExMhuk6uodCN1WS0FHSSajh7xG0%2BbCr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIM2BZgvoG9iCgdqIVqKtwDHn289JLZ5I0Uqpvwc1FsyWrGym%2FzN94srlGkfFAjU1QhjA9g2jslZXOu5sq919t4UrHY0OfioFCX6FkaRYIlJ7RD7xepiIsqxGRvlzvBbAnODGbw%2FVTa6vIbIIMKe0GPZaaEcBgOQ4KcXuQYZDGQ4EJnhw8tB3%2Blb7zp9QywaSjWJfdTwlV34BXcU3kIXyMU3HqbXTuhnp1MTyB2Iiot9kryfMQmUu1DJTIK%2Bmh0s8QaCdaW2TSPmbLRV5gqTFI5L4LH5GsiH4QqTHRbnVQ46wlC8d7OapXHe9NBJR7J9xjtje1VqXM9QvC6jGAZuUeMPHbePia5ZgGArrz8m5sg0wzfOJoFQRdgGQzBNlv%2FF3uyR6dZ8JRzz9HKKHSS9X99oia3tqfPdKpteeRWVfSrBY82veqxP%2Flj4LJLgzHGS4Xs7UzxK6Uq9%2Bq3cPohdyo4dojyMVKDxsUmS6jrMCci1%2Bp0amXbpVtrhYkCM5HOgYa2xUP4LulzMXIp1%2BULWDv02%2B%2F1RmD6eXUGSWPXTC6mjfkvRmE2bP%2BHHVmfS2sv4D72qi6hskyQiFzDbPN64VkrjVnJyl2Upien%2FJuiKLH5kcWCTyKvukUJFJrTgM0fHyAJ1VH5MAjcVFY3Gh0w0Z%2FUzAY6pgFctCNQBF8mPtlQuJeqMMJoagCkk%2FWSvTdIaNIwbUOHb1I6jfpm%2FKgBstZG8vm%2BRoriuDmQoazuMDiQJzvtqEKyWmhWInKc8OWpbuvHanCLMIyvha%2Fv9t6Mmwbst39dUZ8VyiEnQXNonqbQPpUH8dnIOFkA6EU8ZCdFqQQjbWjd6O3YEWPNB0RPkHga7K7w7mk9bSQiZDVnX0y7%2Bf7upwDab1KF18Sz&X-Amz-Signature=8dfd54b72a03ab9355145d60ebf5cbc083653059145f08ad88cb9db76de7ab5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=03fe933c2cbf642f400a980e682cb6805ba2d426967b4dcc55d8b5ae10efa49d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466426BEDX2%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNRE1TvmW30%2FMizLmlo5bp3zW04jBJcxzi4ogfqfLtTgIhAMbLyFSd5KQW2P0safEOlz0UA5%2BZT98WlV2kyQWhcHdTKv8DCFoQABoMNjM3NDIzMTgzODA1IgwbxK%2FMOi%2BJst1AbBsq3AM%2FCxO7TX6HvIdAYAdupTCd2WljqU2Ux%2Bc3Ce0xe5jVQGVVAxMEhI7BmSJURassTd9W4e6h9QqQKCjDSJVrgj41%2B9zCYO9NUbwcYz3zPRgNS4yBZNIeUAVOmoO1b%2FIU9wLZcpp2dhcSIj8XfnUr5mnDbA64PCaMnoGisox7XMrUz4eOlmZVO3g3N7vnZzFYoN%2BFVTZ6vfVhxKZnIzXueekbumBHSqKM8N5QmJL6Od1CRDxA4wLeHxmRCXFHQzGiOV%2B6pKkI7aNNZQlmc8wmeN2ESBBLh9OaMWQTI4X0q5R4%2Bs9tsmARWAmgcs%2Bq3zM5dZo9zk3dq6f5oS7DP%2BbSrpDrUOxiscDOL3ayfZlaY0%2B69pSGqZmgzV0wssao8lnzAKLPABCvVsT1dBXjS29sHbkcU4uoP7LFXFYeQb2uFJgz3Xyj6PEtN1lz8XJU68IrVgtMBfyPaPNS1txklRCBQw%2FsqrF%2BZeirZ8qi1NE1IDb2AD2F0yVd13t0m7xVwdIMySUUrWrvNDHPHH2V2RsvmS%2FNNo1DUTydjM1rdPudLja0AR0vsY7thHrgg7mhaoqx4SBshKjPiNv80Fe%2FTEUqoJ09s0C61Xm63f%2F3agMyOP8yEL0MTWwo0SeW1Bf1jjCyoNTMBjqkATSXFX1BJmsWxFOoJR8BaT1fsG7LFwdd9%2FVNQTKstAhUXz9M1EExvq1pWinr3X9nu4uEK7OwBgS73XsOeOeXHIa%2F9uklnoagOmJnj8XJNspYalWWBPcMNwgs0cIRRzaRt0QWFzy8py%2B6GMyLC%2FAQDXtT3zUEXQrLFeJI%2FhZzdGex4oUz2%2BiEb1ySQxitODcZX5qmCFYTIP%2FVyFfKLmOQnCKTWeoD&X-Amz-Signature=a183ac70e41b5c825662ed4bcb4eab7702901d1131eef113504d50c7c9e1690a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

