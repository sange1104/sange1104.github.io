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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BOSBABD%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRXu5knp1AA7g7Z1iHUvYagf8I5JWj2UwF1nt9NLVNDQIhANkiXa8MNF%2BDRt1bte42o%2BAcfd5zNYBehRV6QyEzkh3AKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbXu%2FkwQapAddaY6Qq3APXJw3EcmNHhgAK57sP0n%2BUcnSrVCJvA8nD0%2FRdfYFsO2odcxiQdl8DHcvKvPPyNiY%2BNgk2pZnFNXOUsYvxNNfM10Vs%2FoZixMhBY%2Fed1qU%2BQ%2BH3sVlaM7fVVx%2BU01QoVw5UERGsyKjZex%2B%2FS4WCWi%2BgniSzx9HpjDuE9bL2d4enY6qmO29V9HnxWLotYMW%2FZQ3iIHayJ7oEIDoq0p4BwaKpP46Du3Y1VvvPti9cHsO%2Fa0SbWX5vOn8hpeXY%2BQczvmu%2BfXVpciq3PPPI1F1fZo5ec2b2Y1kpz1%2F59KcinIjfYVFYbf96ggkthn8H%2FwAz0uESDoKDjgEM7dy9a7FA77TJsimrVIwRjiDcDeqognMmt6p3vwssrOCU78Bk9rt80dcnC2nZww3BPJDDyxadtiHPqqM%2BLvKQtVplhGF9h%2FFrKSNvMPXTLuzIFLaAp3n99iG9Mgum4Lm3AKLcoXm5hNKMjzuIPtBJ3dobFIFmI%2F1dyhpVIbfztBMXckmbXi9RakX888gyJNP2iGSpPqWOeJelARdrJ8btXLcRCtFkJi7GfDkiyawHrpHnopsbMtzaowuKe7FONAYrTPYO2avPnm%2Bkyv%2Fcmi4z0y9kyKS1mYxNdlYydJAntNnfaeGZgDCp%2B%2FfLBjqkAcOX5cimqmXxWw5BCvvUa6aHcvRwZDWRfnanGsrOFNJps6ECcmdMES5RE%2BZUFHhHT2r%2B8x6%2Fon3hDaLhUaqvhqRR3Jt3DfozszMbZGveL5Xvyh9qzPslQ9%2BpeGVFlF93ndNg7CBz78E0WA2pxfiNVwqWAn6Hn3sXz6JXyVCciajMDs5x6VmPdhjSuleRbG%2BveIReqf99hz3IJAElpN2JiGGI3ob4&X-Amz-Signature=597b0836ccd55588dba3b1cbcb66c5299cc596677e9483fb5db36ff949196ddd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BOSBABD%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRXu5knp1AA7g7Z1iHUvYagf8I5JWj2UwF1nt9NLVNDQIhANkiXa8MNF%2BDRt1bte42o%2BAcfd5zNYBehRV6QyEzkh3AKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbXu%2FkwQapAddaY6Qq3APXJw3EcmNHhgAK57sP0n%2BUcnSrVCJvA8nD0%2FRdfYFsO2odcxiQdl8DHcvKvPPyNiY%2BNgk2pZnFNXOUsYvxNNfM10Vs%2FoZixMhBY%2Fed1qU%2BQ%2BH3sVlaM7fVVx%2BU01QoVw5UERGsyKjZex%2B%2FS4WCWi%2BgniSzx9HpjDuE9bL2d4enY6qmO29V9HnxWLotYMW%2FZQ3iIHayJ7oEIDoq0p4BwaKpP46Du3Y1VvvPti9cHsO%2Fa0SbWX5vOn8hpeXY%2BQczvmu%2BfXVpciq3PPPI1F1fZo5ec2b2Y1kpz1%2F59KcinIjfYVFYbf96ggkthn8H%2FwAz0uESDoKDjgEM7dy9a7FA77TJsimrVIwRjiDcDeqognMmt6p3vwssrOCU78Bk9rt80dcnC2nZww3BPJDDyxadtiHPqqM%2BLvKQtVplhGF9h%2FFrKSNvMPXTLuzIFLaAp3n99iG9Mgum4Lm3AKLcoXm5hNKMjzuIPtBJ3dobFIFmI%2F1dyhpVIbfztBMXckmbXi9RakX888gyJNP2iGSpPqWOeJelARdrJ8btXLcRCtFkJi7GfDkiyawHrpHnopsbMtzaowuKe7FONAYrTPYO2avPnm%2Bkyv%2Fcmi4z0y9kyKS1mYxNdlYydJAntNnfaeGZgDCp%2B%2FfLBjqkAcOX5cimqmXxWw5BCvvUa6aHcvRwZDWRfnanGsrOFNJps6ECcmdMES5RE%2BZUFHhHT2r%2B8x6%2Fon3hDaLhUaqvhqRR3Jt3DfozszMbZGveL5Xvyh9qzPslQ9%2BpeGVFlF93ndNg7CBz78E0WA2pxfiNVwqWAn6Hn3sXz6JXyVCciajMDs5x6VmPdhjSuleRbG%2BveIReqf99hz3IJAElpN2JiGGI3ob4&X-Amz-Signature=9a9d18890cd2ea9597152c49670e9bc2ca57f1126afb73472ed4f60bde0ba9b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BOSBABD%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRXu5knp1AA7g7Z1iHUvYagf8I5JWj2UwF1nt9NLVNDQIhANkiXa8MNF%2BDRt1bte42o%2BAcfd5zNYBehRV6QyEzkh3AKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbXu%2FkwQapAddaY6Qq3APXJw3EcmNHhgAK57sP0n%2BUcnSrVCJvA8nD0%2FRdfYFsO2odcxiQdl8DHcvKvPPyNiY%2BNgk2pZnFNXOUsYvxNNfM10Vs%2FoZixMhBY%2Fed1qU%2BQ%2BH3sVlaM7fVVx%2BU01QoVw5UERGsyKjZex%2B%2FS4WCWi%2BgniSzx9HpjDuE9bL2d4enY6qmO29V9HnxWLotYMW%2FZQ3iIHayJ7oEIDoq0p4BwaKpP46Du3Y1VvvPti9cHsO%2Fa0SbWX5vOn8hpeXY%2BQczvmu%2BfXVpciq3PPPI1F1fZo5ec2b2Y1kpz1%2F59KcinIjfYVFYbf96ggkthn8H%2FwAz0uESDoKDjgEM7dy9a7FA77TJsimrVIwRjiDcDeqognMmt6p3vwssrOCU78Bk9rt80dcnC2nZww3BPJDDyxadtiHPqqM%2BLvKQtVplhGF9h%2FFrKSNvMPXTLuzIFLaAp3n99iG9Mgum4Lm3AKLcoXm5hNKMjzuIPtBJ3dobFIFmI%2F1dyhpVIbfztBMXckmbXi9RakX888gyJNP2iGSpPqWOeJelARdrJ8btXLcRCtFkJi7GfDkiyawHrpHnopsbMtzaowuKe7FONAYrTPYO2avPnm%2Bkyv%2Fcmi4z0y9kyKS1mYxNdlYydJAntNnfaeGZgDCp%2B%2FfLBjqkAcOX5cimqmXxWw5BCvvUa6aHcvRwZDWRfnanGsrOFNJps6ECcmdMES5RE%2BZUFHhHT2r%2B8x6%2Fon3hDaLhUaqvhqRR3Jt3DfozszMbZGveL5Xvyh9qzPslQ9%2BpeGVFlF93ndNg7CBz78E0WA2pxfiNVwqWAn6Hn3sXz6JXyVCciajMDs5x6VmPdhjSuleRbG%2BveIReqf99hz3IJAElpN2JiGGI3ob4&X-Amz-Signature=a8384c041395497c1171d847d081d899c890305dbff26d5d74f80e2271f2a511&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BOSBABD%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRXu5knp1AA7g7Z1iHUvYagf8I5JWj2UwF1nt9NLVNDQIhANkiXa8MNF%2BDRt1bte42o%2BAcfd5zNYBehRV6QyEzkh3AKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbXu%2FkwQapAddaY6Qq3APXJw3EcmNHhgAK57sP0n%2BUcnSrVCJvA8nD0%2FRdfYFsO2odcxiQdl8DHcvKvPPyNiY%2BNgk2pZnFNXOUsYvxNNfM10Vs%2FoZixMhBY%2Fed1qU%2BQ%2BH3sVlaM7fVVx%2BU01QoVw5UERGsyKjZex%2B%2FS4WCWi%2BgniSzx9HpjDuE9bL2d4enY6qmO29V9HnxWLotYMW%2FZQ3iIHayJ7oEIDoq0p4BwaKpP46Du3Y1VvvPti9cHsO%2Fa0SbWX5vOn8hpeXY%2BQczvmu%2BfXVpciq3PPPI1F1fZo5ec2b2Y1kpz1%2F59KcinIjfYVFYbf96ggkthn8H%2FwAz0uESDoKDjgEM7dy9a7FA77TJsimrVIwRjiDcDeqognMmt6p3vwssrOCU78Bk9rt80dcnC2nZww3BPJDDyxadtiHPqqM%2BLvKQtVplhGF9h%2FFrKSNvMPXTLuzIFLaAp3n99iG9Mgum4Lm3AKLcoXm5hNKMjzuIPtBJ3dobFIFmI%2F1dyhpVIbfztBMXckmbXi9RakX888gyJNP2iGSpPqWOeJelARdrJ8btXLcRCtFkJi7GfDkiyawHrpHnopsbMtzaowuKe7FONAYrTPYO2avPnm%2Bkyv%2Fcmi4z0y9kyKS1mYxNdlYydJAntNnfaeGZgDCp%2B%2FfLBjqkAcOX5cimqmXxWw5BCvvUa6aHcvRwZDWRfnanGsrOFNJps6ECcmdMES5RE%2BZUFHhHT2r%2B8x6%2Fon3hDaLhUaqvhqRR3Jt3DfozszMbZGveL5Xvyh9qzPslQ9%2BpeGVFlF93ndNg7CBz78E0WA2pxfiNVwqWAn6Hn3sXz6JXyVCciajMDs5x6VmPdhjSuleRbG%2BveIReqf99hz3IJAElpN2JiGGI3ob4&X-Amz-Signature=3e3e92abffdbac72fc819851d9eefe8b2ed686fb9fe4955497715e5261657230&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VPEOTCR5%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140301Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2Fb0FSGotV3w8EFOud%2FGyNOOe83zvnUurWg2Mlm4jGNQIhAPS9X4onuA7AlvbGP5w30JtIFhM1MTmcjtU8rnFAOtF9KogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxM5Yo4nFmDEyaRy88q3APaXdoQycdm%2FyqLlp0046nKJMX7NsFbwuY0MVoUGFsw3vI4Ps%2FhUgYIiBj3AngVpCLGUKrOh3tAzvyFK7CpaitvaF1XUhBkIcNJyLy%2By358e6ID0trhhMGt7bdD32%2FG6gjUdgGwHMDIfxlgWenOb6N9LM5I%2B5S1kYNx1hes4Ij38jayBWmxWj6S%2BEC9R8NvyLze4KpupNHBdMKTdHS1t78egSxLuEFiA%2B%2FRkzvi8LwrDfTpFG3x5hlsUHhxO%2BQuuygrLhfA1%2BsFpSATzEfxTMWj%2F3fGOS%2FZwpKz2ELC%2FUVwjUNG8r%2BlCVfcG5Fpq2SqN816R5v%2BSPZCMNXXtZKXzk1C3EATq%2BswtRRO9YSDb1QT%2FqG2F2iDHtZCN7tjJAR8kBct7lUXauiHyX2egb2SmXcDyyse3FvoJKuy6g%2FZgsiDVyrnGeKSf6xNnRTn6qMLD15VsPwUhGI5gR8wR8pGUQge0fEQyZ6qVZHCAw4hRPz3Bg0QKVM13yRB0LXMv40ABA%2F4C41G5zYyf%2FcgxjWme6Bxj675mHRCTSxieFk%2B8%2B4tCFk%2FeDnroLxvh4WTKj8ZvT7tbbpmfcs6%2FpTjU1EekR9yWIHQLXFmzW4c7VMlBlMfTGFv5hcs%2Bwot%2BZZc7jDV%2B%2FfLBjqkAb9kcutv6%2B6FVOKZQiF4aMjHRPMsluild%2Bl7i1Wpdaup5meOKBVUDdpApCkhMUca%2BOlTcuBCfgYh81USzNZjVNpo3ZT47uSMPTR8YWu%2FbjGlpSCSnqvAX2P%2F0BAcI6NHAuM9GSwBDoroScyjUL3JAKO8mqE459oxtj98QdR4MINMqez%2FC7V0FFWeFZkARAaGOph%2Fo%2B%2F0i3oNEQVs%2Bmi18pNvwA9C&X-Amz-Signature=1059b4bb557ae218352b3d75e3652125dff6dd1747b9987636331d8f51d63231&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXMDNOHQ%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140308Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCliVfj49tGixLvA889eSXylNFZX29J1lAgHsTj7uNzmgIgabvbx3TKGD7xO8ZWPT34r%2BSn2NwsetTBMKDHIbD68wIqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIa5J0whvwkdVi4C6CrcA0JJdb9XREJhT0TDD8gxlzT9VfnxysahUJDE7n7ArkqrYX5wXVGZ7Gg4PkE8w7eMuJrDfv%2FkXjVOVJLuMmIBRGkxuc6KzbG6M3wmlgVo7yfU38lf1XlerVFQ0MWGQHqZDMAi11%2BVFPtT6WwyFRbkjwkdRniMxwzWUcROY2uoqfqeMFCRUqtWb3BmHBZJCWiLdHTdVyN9zzXSHjqtHWUIoJpdK0A%2Bwqu00GINT8OpUVIl8XhgXBZPLCSoTGMmKvDuygWiLVh8nyxrJoX%2F0PK4QNrDtwEuW2896QGlFdyg3DCIU4LCVV8bAYw3kMKw6jHBYjPTiHGNp5BLCnUW6%2BuMb%2FCdNKhlLGLGVP%2FmM5B9LsfM2P0j68dPAOCD3ugGy1l9FEVt%2F2z4aC%2FIZ6Zu9jTitBOuazwYTy5cOOYitvWweQAdlQPqo6LYKW4hI245xTCsM4O2V27zninWryTgbRXN9Oh%2FldM6aRWyC1Zutbl16OYssWDAoRm8K4ZZVj6XxuOjrTYFWuHuoDzcN3cdDWR8%2FDReNZFM5NXT6m99eJ%2BRNtUpngEZC46Sn6gOObbl83CAPndtpmiCK7c7Ta3vzIva5RtpmUSbzQij4mEoLsqPnwX0fOfeEtl7UjAuvoNXMML798sGOqUBitpm4Dhtud%2B%2FgVFwds9M5iWJIry3uONpjPJJozadK3xmpcQDTLi76nxpzUEaduXHsymJYvyHw0rMfJpUZr1c6qxBo63CvOsijFexhTFN%2Fy9eYgmJEv9Wy%2Fq10NPXy5oQrTLqyZJM2nCOY4yDguy1D8pIsteqxlTm9fwK%2Fe2vQZR2GVSU3zwes5z4efE%2FyinzE5eoQYIYFykrbcvC148nNkvIeZDu&X-Amz-Signature=92e2ea75001428e49dd00e475d07443b0b200a43d26bad6a9676cae1f86ffd5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662J2SBL7B%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140309Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID7RbPASZOVfW3KZO5Yi2tSiSMS%2FULEs5yF4MKos2OLeAiEAqcZrPEEibdg%2FzdrYctXHgoMvK%2FRFekuYTsFI18CmW8oqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI7vMkF%2BtQAfZO1r5SrcA5HPLpAvjqxkTES6ztKHPNJomMLCiLCUyiQQ%2FXTHHv9isepW8%2BMDdrPKFSOpDA2CpbSkn4tIYi%2BkVpNaI2yaQbsUZwp925R54S9G0KZTWm4Cznr1ZHiSSOTwR9aKKyCEBbsC8sShvE6DiBVzC%2F5a8kr6xa57Sk8sUDPisr%2F7gxBdgl%2Fpyvr%2BK9JSj5GzAIl01c8m0tgGpc%2FprQJOGeHxE0DmM%2FPmnrk3oOVKiyLqWpiHfzWg0Utv1iJkVbHhhsTwaozOerFfp%2FnU8Ehm6QZkZmCnLAn%2Fe5OdeNc%2F1CG%2BSYNMsWoY0zky5a6truFT0G%2BceVmQII4iQT4homx4xbu4fWs2yfkKe5SZTjvVJGcJCkZX3%2FrwU6vGCm5NyhM8dMiYyfBnb2PJsjgEbFeVlKs3Co0ho%2B%2BhBR8JXH6AUsjaDhVqok%2FIqZqeBhSq2W7nnWzgzr4E02VWCp0VyTbfmL6MgDFj7NW%2B%2FeYmhDQwa95NhL1zPKfyWeYo%2Fho%2BSIRxlJ83wHk%2B3PENDZYVU8cEvOo5IOJay7uY7FXDDi%2F1Rxb6BA79%2B3kAee7oPtBFu4EiceA3CVbSDvx5RYb9bvu%2BWN7RZrO5mAfa3SI5zB1HMj5Um%2BTtXUeDxZAWXICeF81iMIX898sGOqUBNRajU8fdWBPQlK44bLiI0oPkjS%2Bjttz4ob72DGQn5roHyrPk73YPKrbHuNYl%2B%2BUFzGNv7akXcW46y3nSCTK6vmzwzw08ZlBvZ1iEUqxYqnXe9hl57IaPY19Nf2tHxqKj23ULATKtapiJt8wQILQjmi7hUIAXsnl3j7%2FzWQ3BwHzReXyM1WwWeQzzXbdSrTN8sYjbOmr7P6EJkqy4J5wn5Rl0002j&X-Amz-Signature=d6128def67b6147ae7bcb237e28547ae81f1bc06267feef121627636ce2c26c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663J2EBRWS%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140309Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAgx58M00lKatGLRRc798ktHt%2FfvBgUVFzFaDZelPBBeAiEAtnlwmjdlTFdo9k6xWJVyz02TZyg%2BJSTCO2lQtU%2B4DoQqiAQItv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCHtp5Z7ugBh7L7nYCrcA8hjmlsNTYb6KQNxobpMN%2BmAqo2DBXuZGZMhEEpGRZaQTK2ztowiXUR%2FFwkvsxdaR%2FP%2BWENi4%2Bzyj15KmHu4jAcbGepV7AR6Z3yp2h%2F9ui99pk4kQl6oyy88uoOSwJ468JWHUJDSwp%2BCWWckIaWOlcUd5r985IvjDvFqFh35uwHPK5EmJQ8z7BWS8s3BxfmXC2eONs7x4N9RGM16%2BogMyTbiintYQdXgCblQlWpgEG3Cf5lpdSQV3pLxD9LSA6eeq3wLwI1cHV7b9qVdllS%2FuKE7LwA4hLgSTc4SAW8OC82XHej17cIK%2FjuLt5Kx%2FV3G6n7BNr%2BT604RiBgdJJp1ZDekJAsDdKeNegTqccVW0D3hFXzbnEQ4mZTy770cW%2FJSB37SO7NsjVYDPpDmi6rp4UaZ48KJa%2B1bgyAM1UpxZFIp8dz00MSpbO43S0vc2%2FoujCQvLnrcdZfXopvZodjA%2BucGVdlT3QJjpXABYQG1YOohK8aK2Fi7EkDVourVdJSaix%2Bm1Sd2NB9fcQh1sIwHc9EO4BCa5caYhBJSpaHLy4breLoNDKEGUjEhbTau9FEBcYQHKEgZinEQpDu%2FS9wnvxSa5za8CI60bZNrOunqI2KcenHOOeLdp9i%2FL%2F9EMMX898sGOqUB1g8iszZ1GiHCktIPoYjwe9363XxtIoPftsOrzfplp3z6Glg2yWS%2BOnrem6zg%2Fp0CmSa5A7OiltAcYxmTGnkwHuCqv4DCzHdmtKpSLvxgHimIlQ8Tq3Y5Qb3l%2BlC7CJsy63YrUZj7ELYA%2F3q1RLbN0I%2F16CBVjQdfFfRRAxhEN7F%2FQ0y4pyFf6%2BUXkn71dNLsw%2FR0rDwa%2BZEeloXf5VeaQkacvdKU&X-Amz-Signature=354b5b71ba5bcb87120b8df0c7b952a5d6d893c73dde2c2dff4be14123a5977f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BOSBABD%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRXu5knp1AA7g7Z1iHUvYagf8I5JWj2UwF1nt9NLVNDQIhANkiXa8MNF%2BDRt1bte42o%2BAcfd5zNYBehRV6QyEzkh3AKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbXu%2FkwQapAddaY6Qq3APXJw3EcmNHhgAK57sP0n%2BUcnSrVCJvA8nD0%2FRdfYFsO2odcxiQdl8DHcvKvPPyNiY%2BNgk2pZnFNXOUsYvxNNfM10Vs%2FoZixMhBY%2Fed1qU%2BQ%2BH3sVlaM7fVVx%2BU01QoVw5UERGsyKjZex%2B%2FS4WCWi%2BgniSzx9HpjDuE9bL2d4enY6qmO29V9HnxWLotYMW%2FZQ3iIHayJ7oEIDoq0p4BwaKpP46Du3Y1VvvPti9cHsO%2Fa0SbWX5vOn8hpeXY%2BQczvmu%2BfXVpciq3PPPI1F1fZo5ec2b2Y1kpz1%2F59KcinIjfYVFYbf96ggkthn8H%2FwAz0uESDoKDjgEM7dy9a7FA77TJsimrVIwRjiDcDeqognMmt6p3vwssrOCU78Bk9rt80dcnC2nZww3BPJDDyxadtiHPqqM%2BLvKQtVplhGF9h%2FFrKSNvMPXTLuzIFLaAp3n99iG9Mgum4Lm3AKLcoXm5hNKMjzuIPtBJ3dobFIFmI%2F1dyhpVIbfztBMXckmbXi9RakX888gyJNP2iGSpPqWOeJelARdrJ8btXLcRCtFkJi7GfDkiyawHrpHnopsbMtzaowuKe7FONAYrTPYO2avPnm%2Bkyv%2Fcmi4z0y9kyKS1mYxNdlYydJAntNnfaeGZgDCp%2B%2FfLBjqkAcOX5cimqmXxWw5BCvvUa6aHcvRwZDWRfnanGsrOFNJps6ECcmdMES5RE%2BZUFHhHT2r%2B8x6%2Fon3hDaLhUaqvhqRR3Jt3DfozszMbZGveL5Xvyh9qzPslQ9%2BpeGVFlF93ndNg7CBz78E0WA2pxfiNVwqWAn6Hn3sXz6JXyVCciajMDs5x6VmPdhjSuleRbG%2BveIReqf99hz3IJAElpN2JiGGI3ob4&X-Amz-Signature=6019891bf16e6b3e2f7fcda6f4cfafce7cd67dd8cc16509839a8786449aa8a27&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BOSBABD%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRXu5knp1AA7g7Z1iHUvYagf8I5JWj2UwF1nt9NLVNDQIhANkiXa8MNF%2BDRt1bte42o%2BAcfd5zNYBehRV6QyEzkh3AKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbXu%2FkwQapAddaY6Qq3APXJw3EcmNHhgAK57sP0n%2BUcnSrVCJvA8nD0%2FRdfYFsO2odcxiQdl8DHcvKvPPyNiY%2BNgk2pZnFNXOUsYvxNNfM10Vs%2FoZixMhBY%2Fed1qU%2BQ%2BH3sVlaM7fVVx%2BU01QoVw5UERGsyKjZex%2B%2FS4WCWi%2BgniSzx9HpjDuE9bL2d4enY6qmO29V9HnxWLotYMW%2FZQ3iIHayJ7oEIDoq0p4BwaKpP46Du3Y1VvvPti9cHsO%2Fa0SbWX5vOn8hpeXY%2BQczvmu%2BfXVpciq3PPPI1F1fZo5ec2b2Y1kpz1%2F59KcinIjfYVFYbf96ggkthn8H%2FwAz0uESDoKDjgEM7dy9a7FA77TJsimrVIwRjiDcDeqognMmt6p3vwssrOCU78Bk9rt80dcnC2nZww3BPJDDyxadtiHPqqM%2BLvKQtVplhGF9h%2FFrKSNvMPXTLuzIFLaAp3n99iG9Mgum4Lm3AKLcoXm5hNKMjzuIPtBJ3dobFIFmI%2F1dyhpVIbfztBMXckmbXi9RakX888gyJNP2iGSpPqWOeJelARdrJ8btXLcRCtFkJi7GfDkiyawHrpHnopsbMtzaowuKe7FONAYrTPYO2avPnm%2Bkyv%2Fcmi4z0y9kyKS1mYxNdlYydJAntNnfaeGZgDCp%2B%2FfLBjqkAcOX5cimqmXxWw5BCvvUa6aHcvRwZDWRfnanGsrOFNJps6ECcmdMES5RE%2BZUFHhHT2r%2B8x6%2Fon3hDaLhUaqvhqRR3Jt3DfozszMbZGveL5Xvyh9qzPslQ9%2BpeGVFlF93ndNg7CBz78E0WA2pxfiNVwqWAn6Hn3sXz6JXyVCciajMDs5x6VmPdhjSuleRbG%2BveIReqf99hz3IJAElpN2JiGGI3ob4&X-Amz-Signature=755f60f283bdb5eab7c6129cc57524c5291a60695fc63e4197d8b23a85ddbc28&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666OZI4ERL%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140316Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBwh7otq12EUTa1tg2jd7Bu%2FyNtuvTPI%2F%2FFuKjXdq0ryAiBEQNgF8qPGin3l8bIRCo%2FiXuLhAdvnpkxPHmqGXBdn0SqIBAi2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRWH1%2BWRTSV03VGQeKtwDwiuTqWuNiQAJKCpHNsknXFBPwKfw0HFKp1AwaLHqVnndMQ%2BJj1mm7b7aDYGggG8cMzVg6ukqiYoH1MPOyfhv0jLwPTsbBovum7cnlzq8SuWotf4O%2FCRnnaHr2lBjsn7NzCT%2FCrzetk0Dq1LAGw8esKl2y6yrl6REc2BWpjQaYDKC1llqJYmatbGq%2FRBVM35Y4mL1UE6bOus6eahGtQ1dQ3NgtmYVMdRGiRxhAxv6EhvzR8PhyN6CtPxkNCejMS%2BKAN6vGHcrpZUMT4oNFnC5nNh75ATASHPXynNayt6O%2BxHAdS1rJKs%2Fe0qNjk6EklWuWDCdHZFI8OkCPrMC8vWM2p3MCh%2BKXPDuc94j8PehnpkJtXyLVX7yqV7xuIfE%2BdbK0NvzkD2%2FAmWk40o%2BjIe4Nd73sc1IgcOIyRER37TKLnjolRw%2BH4mtt%2Ba4ekCyPjnRUVJnXt3rRINYEzA1gyYirDKiCzn4dKhh3twbeDxzREinWreO3%2FpQy7zIEU3WbhXkEgaizpDV%2B0mV9YofrqkciK3meVo0QntI2Ln636%2B5juk0ZSM%2Fdum7LR1ThdWh9chmP6DL71nUy5RSPEWWVikGrv4MRIzc9wuj7Nui7U%2Bx9Y8P7u7T9Z8dC%2F7yxa4wmPz3ywY6pgF2EBSRIVZGInt7HieYlqk%2BogGlRWWQl9KwvP9IbbduFXwZj46FxKOukYVIHBsaZXr9Fji4oqdsbuwEGJuwXP%2FNBmK%2FQYNzBNgZUYNhi2t3kXUYrztM9JL9twS4TCSmcGb%2BpvgJB14pM%2BNcyRd4QPwYdQ8buCZzPOCeZHFcbULP78ctgaYOmrAol7CCjOcLdqxmqNwyxr%2B1P%2F9VI5kU4af5CCHz2Nvf&X-Amz-Signature=65e4062766b52beb6cf926b67bd8b7d141f4f5ac10d8a028dbf9c4c05dcabedf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BOSBABD%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRXu5knp1AA7g7Z1iHUvYagf8I5JWj2UwF1nt9NLVNDQIhANkiXa8MNF%2BDRt1bte42o%2BAcfd5zNYBehRV6QyEzkh3AKogECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbXu%2FkwQapAddaY6Qq3APXJw3EcmNHhgAK57sP0n%2BUcnSrVCJvA8nD0%2FRdfYFsO2odcxiQdl8DHcvKvPPyNiY%2BNgk2pZnFNXOUsYvxNNfM10Vs%2FoZixMhBY%2Fed1qU%2BQ%2BH3sVlaM7fVVx%2BU01QoVw5UERGsyKjZex%2B%2FS4WCWi%2BgniSzx9HpjDuE9bL2d4enY6qmO29V9HnxWLotYMW%2FZQ3iIHayJ7oEIDoq0p4BwaKpP46Du3Y1VvvPti9cHsO%2Fa0SbWX5vOn8hpeXY%2BQczvmu%2BfXVpciq3PPPI1F1fZo5ec2b2Y1kpz1%2F59KcinIjfYVFYbf96ggkthn8H%2FwAz0uESDoKDjgEM7dy9a7FA77TJsimrVIwRjiDcDeqognMmt6p3vwssrOCU78Bk9rt80dcnC2nZww3BPJDDyxadtiHPqqM%2BLvKQtVplhGF9h%2FFrKSNvMPXTLuzIFLaAp3n99iG9Mgum4Lm3AKLcoXm5hNKMjzuIPtBJ3dobFIFmI%2F1dyhpVIbfztBMXckmbXi9RakX888gyJNP2iGSpPqWOeJelARdrJ8btXLcRCtFkJi7GfDkiyawHrpHnopsbMtzaowuKe7FONAYrTPYO2avPnm%2Bkyv%2Fcmi4z0y9kyKS1mYxNdlYydJAntNnfaeGZgDCp%2B%2FfLBjqkAcOX5cimqmXxWw5BCvvUa6aHcvRwZDWRfnanGsrOFNJps6ECcmdMES5RE%2BZUFHhHT2r%2B8x6%2Fon3hDaLhUaqvhqRR3Jt3DfozszMbZGveL5Xvyh9qzPslQ9%2BpeGVFlF93ndNg7CBz78E0WA2pxfiNVwqWAn6Hn3sXz6JXyVCciajMDs5x6VmPdhjSuleRbG%2BveIReqf99hz3IJAElpN2JiGGI3ob4&X-Amz-Signature=34e52c25d2b629de56a46575a547543f6b2d1260cce6c91b5ed8e62dae9de3c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMBWDBA2%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGPyE3LuPlAzpuMUM2IAiZMRbeOUyyNKuYNp4xrTKqtbAiB5%2BZwV%2BmMrOtxgseuhcOpSIrMkU9J0M1j7ESLC2YMceiqIBAi2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMe%2FroHa0BeNEOoQVxKtwDXIJ5BwBvZmOOdNmmrOng9PgAXTMt%2FR%2BUENsf%2BE6dW7Iam837f8AWIQpyES9NXlUp4G6KAFSkg4vmSRIaqOAoSvU9M%2Bi0nt6hv6P1w2all185AfXEAYK5%2B2Rtlb7D7uxbrMoUeFmNzk6naGcWUHwLTnu1kqZo8%2FFQVrhs2mHc4ARiibhEoHOa%2FAX3FxvBjPOWi5s8fvRZ0bVSoEXpHWE2royTDg4NHEV%2FeikGZlMavvCZWeYM4z6pThopoD3tSGRK6goeihKQyRfBfG%2FfKS%2B9oNKdbJsJTVNJArx3buPpFBD50qCwYs5C%2FV%2Fu0OS4SQADmOEOpfOmZDDBy44DTOiX6HW71kQFOZxouSNZyCP3De7tln2APAUI5X1IJXpH9hjYbmsAM4%2BP8Keo%2Br9%2Bc0QZ1vOcHQ8y4yD3GX5ZDvkmspViMbYjdegyJhq2c4snV5d%2FUxljh2Lx72UpgJ6R4IYWFo7QwNTJTCFaZ9da2Ug33iIDl84Hj6G7M2VIjr3SX8n28K4vzl88c8itCx4gFBJmrXCM8YOhItxwXMpSOA%2B0lBx5aCeV1VYtA9CJfxuLnPF8yHBa4ROOaIrtbBhbcK3jssfecSgQo6er58lgJrOd1zuWHy%2BfNLMNmlXNjoMwrfv3ywY6pgG5jDrSynmeuaw89ojCkrmSMcWW0Gsix3haH8mNVIxMLgJWO%2FOlrqALA42OiQu64Foukat6%2Bk%2FmItmF%2Br5qD5aSb%2FtiK%2Bm9jhkBYSgBROLSkCso%2BzsXVIDrFUSwIlFiXLwzFAa4brR6vcK%2F8jMlO3kdQ8hJvpvVbGeMkMrDyADCI%2B8yLy%2BP2jtdGnV3fHrsomBQGFJZQc08xR%2F99wSsuvj1YZvhKjts&X-Amz-Signature=33d5bd44a9056d0e04d00f1d71090d32e6e24bcb52153dbe09825783f098b07f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WWVJ56PY%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICXEL2isSYU2jOiD7mhWufuGmGF54gx9Ygea2LjFWPXgAiA3ga5rmi9isQI5afoacjTV9JxKcao6rHvsUPYByog4HiqIBAi2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzTDW4blBmZY205WeKtwDO3z5f0lyV4vIad51DP5R4tSsZ1xI6%2BqsXoSx0oyTKfHJiYUqYO2q14kAshHl9Y7a0brIGDMDve1sHKwnSoa1x0MGvMzJceYBUW0xsoFlpKUkeyR5PWjZRou0%2Fta8K1UZldsB2omEOHaQFkGpUu47lDRVTzKY48%2FREuL2ClmG2MGZu0x1%2B0mVnxjJuzRUKOPoKFCH3H79KybiU6kiUWnedp3KzSQUgR6ybSFwv2aNECYgIrZ8RCnpOfc4oA0%2BVPHNYUuP1VDHkQwq6OFN26BX%2FVqBpWdAP8%2BNZeMklj65y3bcK75fTBq4RAXwTN%2FL0OzTlRNRGIiEyWuFPiCL%2FMRo8ezN4M9RuZgIDAB%2FpC%2BGjfCed2HS2Mzd12bmIopKbmDtSWjfdjpyLA77GO1H5sUU9MdYTP98rpnDC3Wc5q%2FyMKQzI0AnW44uTWEuE4t%2FmBbqBLKbbUf9DUl4GdzRtVmcn0vgZSCq8alF6PZigG1Aro%2Fg4g%2BiaQzp4xv3AZElnx%2BMfw7Bru0hU0jRfj2ZwjQvnJqJsnYEMiVDX5PFE5l3aAxS4D2vm1xqD6JhhGADnuEAhEt08rnUPmvgpQyE7dlJSOdYUT6yKIjBJ4IIcGcXdRZMarWggioeZBuMeuow%2FPr3ywY6pgHDtr5VrYM%2B%2Fojhew1l2XG6v97aSFbBZ5XqcaLQ4WHga3Z6X0SNXJRZsLEY72gjjkv2TYa52e%2F0qu59JYUt%2BU6izB2TwOmlOJWz1Tut90PVAg9BLrRwV6v60YFFNwgLFT4TYtJbHb4lLgUd38F15tq4vMKq3Ve%2FlP6eljULVFmuhJ4YeezKfTep3VwtPJZb4bWvUMOGE9eVwdTwZ2o5kYLdvluHNepB&X-Amz-Signature=1edc1910baa71d484680a09c561ca26c469582a3a9e95872f2c55b6e71178d82&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YANGPZBO%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH74a58OngLbSRGA9aVM9WEx1Tuy9EBPwB4T2hR5SfAVAiAJWR%2FNE2IY1rQ4R1D8YfcmNfHoyV4tjPfNzCKbsNlfkiqIBAi2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoLS7MNdQBIflnB40KtwD6biSmOE69CleDnYW79R6NdNPaOp6RCrN5aSzQImwVvfefHww75AlzsKxSpzNsUVTthEC4VQ7lBrntn5pZ2TKSBlzX9vv%2FcjosJXI1Dg3j3al63%2B3l8LPdFasscB5zMW20s55%2B%2FDwpTTcWePWu%2Foy5FSagAFoyb7wXB0NGkiFxoFQ5j2Uy9ENWXkZV%2BsjOrVVcGjNab1LPKB9VWWHhHGG7rDby7nzv81zckpgrUiXCm2NIPW3zFsZ5Qu9q%2FtDEBmkUn1qoDPs2K9gfC0D8MkQpHeP304Bk%2BVe%2BRXTLsFmvYycCyi6uM59mRaf1WxPjNivZTn52NBBG%2B9o8CT0JWo0rdvO2myFSPYTESbbAP9PX7Lj%2F%2Fmimuww08JFCHrNqNw%2BGEkZQvIcRIo9KcnHZEpL471Iarzat%2BDJgHpmyIFpXuOZORWs5wVLZXxJYBmF6bCkcNcd3HJ5l4sK3KkSMYW8ycGTrkt8upjUn1DpUGuPfSBHI%2BEYs%2FDuK550Zgx%2FfAkFLcRvu3tFPvCkuBDoPNwP1Dbb24l0vXuuD21Rrgfnhms2GsttYuBS%2FL%2F2cVqbAFgATIxHcliJ4Sh6mYqWLjrLgEGQAd4oSO%2FO6q49%2BsHMRRBUlRae58axe8Z1pSIwxfz3ywY6pgGbpHCa8%2F3QE37SGELbxfXd2ooOMw7SChPj2F9AShd5Hi4VJx7VZq1h48g0j7gvg7B5ejkUI%2FHLtbv4xWLS8eI8Q7dRL8cYlEpSpsyWxEdWiablSNGJMXxNlac%2FyI2NHPs2GJlbSJf9MI1REM4pNVbhZA7WKw0kEYzrVm2cMYtWPKD53VUQ2heP0RBuN7Ihx8nUYBrWwYrxhix%2FzlteEOIubKl10dxd&X-Amz-Signature=eaf730cf6bf6040f887167a4989af719f5fb05c163b853d78530336b736ebc66&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIDPE2UG%2F20260131%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260131T140318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDL6V2AVNTalmyneEtdDWU280aGXFL3xkNwy1wiBnOgmAiBzeRQEQrYdvjOnwHIA47WmPaJlPbef0VCIG5xxpQkFeiqIBAi2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMcorrX6olpDMEhRI1KtwDK7rFCYjINxCHV34GBdSEJyDpVP%2BVRWaGrs22ifPeSCyOCjPv8wWP6OYppzT6vBsgOixZ3NDaSXQ8e1AY2Wo%2FPmvnGvyEcZXHaOBAFIvWVwOWiiR74VOhhXhUwl5uA5ENWdmdnsrNNEegkjMf0a3LilW0IfXsKnqdAt%2FoJcvhBiWNervu4L9ITeresQPqf1BOun43L4utKmvnACSLg4AB3aU7fCw%2FQDdnh7Fk1eTw7r7afH37xLLPVHUXHQsTtJsTyJvZmLR6AzXMRr8%2BKnIFQ%2BafgiAFViz5GXgtd7P1TU3RwHxtQr6cbOA7iotgytgSYcgtgUoWQv%2F3rn%2BuOqLmus6k6QfJpl%2B6x2F%2BOhnqF4nm9tcbvrKSzm0ATv1luOgLZ7Df7%2FUJOa92Jp25MQlyK%2BvMnP%2BtL%2Bmo9ETlhLFplLo2df7Bgpud7F8jQlRvYvW7yBPjQ%2F3PZtuUflOdg6Qm%2BBt%2F2WAQqPkPBsgW4Yw13WUinJNx6jX0aBScfoUe4KYqzDnM4Wi%2B9OV5i4rUi%2FK2uJe%2FkcU8V8jN6bw%2F56zQyeQLy7HtyXk%2FgJJLiCyifOMjAiyrlXMVWiCFArzZX7TP%2FX9lln5N7L2%2FmNtOvfaI95Ei3Q4HH3hn%2B7nhRbkwgfv3ywY6pgEfe4b8E8S7DBieea4enFv8CyDBXIXW8dlAtVG2O%2FEgzb78kijLoIayrsbp79sWsVRetPNEOjajp8eMiSHpYLfJO5dSOn8IMZh5kGoLtit9wVoYFPHtFBrEFUPpbR8Mi5%2FfeMKXVTK0g%2FKXlVT5FLnp53mvsGMMpmN6mohcZCsYN0IMWjB%2BKlN%2F%2B8V8syHhzoZCqIWHHsnip548SMMVFzIqx%2FfZ%2F5mj&X-Amz-Signature=5795946c1282a2a2b78e66dfa7fecd4c1d4dbda4b0f9e4fec325fb583a50b8ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표
