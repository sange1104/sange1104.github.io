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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041042Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=e4935ef69123d82fd6c86960b0a381084f84d0fd6dbf80b8e47940a7d65713fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041042Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=4f4dc88b25c4f449337b986aff2117bda45a194f04e7ea503cda1bc90fc75735&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041042Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=9af4e8702db389f287901def11cacdf2b2230cf771d7752f962af9e8f9470a58&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041042Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=d900034ace8288631ed3969097d602856b5f15d7ad1288879da5ac119732c636&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667KRLWOHM%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041052Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQfbcydgTnmcgZFdz%2FxPItyjYgwGdelSaTpWcX%2F57TugIgA07ZIfm%2B%2Ba%2BslbNksfb8yu61tu0KhoV3GMHAlw0Il4Uq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDGsYWwOWJl%2BbQ9R6ySrcAz3JySkuDpQtlTBvr1eGOTxeLUO%2Bm2O85SBSjHoct6WCWDlhTxRv3OWlgXSG1Fo96GwrVCkO0JOimZyEcsarWB94kaXu7hDO9l8xlQQ9wwp9IP0GjFHChGSh6Zbu7hbpUWAlCN1CQs8gaL0rQ1oSTdg0THxcS%2BiFNh2FMya9fAx%2BoWKfatrQR4lBo8VZh8XbKUfPCjJIQtoiNY%2Fh2wwLPdDokBPXrl0tPG8dlL4v7yDDKKXZZPCrPECdnE2OVrCz3J9crWil6kYBDTt1a0LEuvDE%2FdLlaDysBKkcuF9i2YwgSnNtGr0kYGXZ0Erq%2Bol0evHRFrASBGcL5Lty%2FVL90nfkO9RvEjb8q3dapjU95cP0dsiiRGMcAWi1x40yk%2F%2F1TaEhWGU%2BKAaHmcmqhsMDILImQJUQ4Vdz5%2BBma1%2BQ9%2F4XtM0Rb9zRsDnQUNe0Z0aDGuQvod%2B25%2FqMUDRwAEyKnOs8wBmHH1UQfiGXbBUSevttzQQDwTClMQcn6oVhl0tSq6TXGoIEJ6njMLz%2Bito47HEwBekvPra6DisI%2B7YlOemohRbw8q%2BXFRqcQgXuVu4P8MxuNuyR7mmakcKG0d3BCTEPscrYVXYZXCHlCd5tAu19rRDT7ronyt3s%2Bd4yMOH22s8GOqUBuWDMlbvs7u4AcKBONNSAeFz0wyeg2%2BKDe50%2BG944a7IkW%2B9aXwO9L6Rtj5Ug%2BdmlmTIkLidAo%2FjcPIJ4AOK6aPZ1CX3Vz%2BbT5UBcXhN2MVbrUdBVBC2U%2Fw%2BH77j2uGcJvu4O0hW2q5JVMbZb%2F74GU1bJlIQlYQ%2FbE2L9MKE19xoNWJ6lpJf0wb43PwrGjlCka2Lzp%2F%2FMxVwt0BwntJYX8JBgvkEw&X-Amz-Signature=a78408bc80bdbcbbdbb40fe4af76dd5711b8397150a95e7562f5a501e071ff81&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XK2OX2CT%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041100Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDlNxGDE1RlJPWjjlk%2FzrfHQ%2BTsepdtkjwOTgUL%2FLyJPAIhAI7oql2bVfmbmb3oNX7htrzAdYBOHbh7uivMoYcBFM7lKv8DCEwQABoMNjM3NDIzMTgzODA1IgxlGob8bcgSGF9iHtwq3ANI3QHcsuBi8Z%2BuxMSFsi5RzXQijR0GYe5ZMqOh4fgPfLAw%2B%2BkFLLiMWQbU6%2FSIDDpKuDLIzbCDsSIGZ6qkRgDZZrdWn4S81YU1isdg8%2FIdGgntyMYeNDz2FkoSbWHfw3kh3IS09F3qt6X1UNjfXUbwotB004KUEiRBKsCLSU1ffkZLyuZC8kK51ETHuilGtsutV39vJyR4H3HsyFFrcwLoabLJaOPJw1Y4%2BMdnaNJRjexk5RXAenUF1PvpKIiywL570lm6XlLizfGob5STd3bjJ7Pd2KDwoAGZkiqCX7vyx7bz3LvoMsoaP4%2FY%2B77wCArjmYaNtjTcW78Ej1pZSyr1IPjiOK6s4Xk5dkU8UUxz0OqDmRoeqRZfy5i9lFHn8G0BqzXTiatNDFLV1o2tSNfQoCv4dqMhodK0fTraHv6TrEn%2FcMXUOJ%2F9v%2FlPICKNhsyc9cuBBa8bYC67lO5PzGwjDYizy%2BnOPJ%2BvIyvVe5E8ZOUCfsuJQ0a99fU6BDPOVNBDPAjxez3cuRqRB80bQ3jcZc4a%2FVIMl0CweYB6FDfEo4H3dgAgaMAx29Oc6Tu2VODUFMH7QTcx4JDMyd8aN2LsZVp5Uqizl8n7F4tMDrWmVYJ9fWRaDmgLzEarZzDj9drPBjqkAVJhMi7m7Bh4h84nzUfa8O9CN5egNHcStQv4auDatvMY%2FZuN%2F1dZGwmCM33TcjEgwct%2BdTNzo6TTU6FDgrS74TEFZLl7FNNaZ304w6YX3lIPnmsIVLvF9g4wNN9HmhF3vwLZXnD6ai6u0GVYtGzCBJ0KH4bPEHge9dfFcDwVdnVZUtNSpm93%2FYjOqy2KHgveTo12SqgvhfNzdKcT387BobKKvJPK&X-Amz-Signature=7db019c34997b576cd67f383e8905473d51b7af871774b46ea3d6a35be2278fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XA2CTYUA%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041100Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDKhoh3G%2FnGsQQMleRHnq3gYe5GVAwectTiYvNVDcdF%2FwIhAPJIAaL8LlBc5mskWwSh9%2FxiirvW21TfUM%2Fv682OtZmHKv8DCEwQABoMNjM3NDIzMTgzODA1IgxWvlUr4WAYZJN2s7Iq3APQv7iMVGwljp%2Fql9uIIkh2vgijeSThwgl1sQaI6k7Qi28KHgItTB3d1cWRNjDD4%2F1Y%2BQJDknr1YxOTkAxoW7yYDmMH469gjGcZfC2o0Bc0D6acJnbd%2BhocWuqN6zgfgy16JK1ULJ9vxiI8yDnK3qo8Nme%2B3q5OWGil91xK4LqbI%2B0bQlwxJjCYsh%2BmOPakasWg9gVY9wYjhdjLcW4CaptOMIaUuSp80lpiCCYxkpYGI4L4VDQM%2B9UjW%2F1PwVPi16g1rUHeTXjLEjoPE5TYSb5xK2t2JGVBgZg0r8WVPu1sQ7aNnHCETVn1ZIUS6lcYsopaEU5L02FBNJHSD20yg2te15ETW6LGmHz1B347THHuFEEHNbVpcyu%2FstoufRuM7tLkxLtncqzOG9S6nMh8qBFs0Ukn8IKuf6RLPaYltgX2KwvDrgQk9Q8OAfUgVHO7gn73o2frbzk3AhvZcd4N0rBG0HDARfW%2F%2FRLTT8i9zVGu%2FQwD1nS6TOVjOrs79gWX1UDsLga1f4uMTRkOR1PRijKVfp9TxJZtudfWRoOPYVg08nX6BrRadvwZ7PVh6SnkJmmQNXej%2FwZc66POBGcXTUYsgYoYCUECVjelS%2FVWuy4qGngJRq7yV%2Fq4eFpDZDDJ9trPBjqkAQkGsNvOEPE4gt52fHrEFYwJsX%2FGPAr3e0vmr9uprak4yErQdfkYnACt8RgLq%2FrNxkbBDIf39uiY%2BiLFZa%2BrP3GkzIGvn3sQCJqKKMOxcr4%2F61sASE4w87jz3ymENo9PJTn89Z%2B6VHHOj4SXbRnf6PK7ZfY3591hR4RFNcHxr5SUTRuTSX0VuGdFu8D%2FafFYdscp4WIg3KTUgy6MTqT285XOttZy&X-Amz-Signature=875b5918c1cd547b3fc02de80c87bb51007d79b93c225cf2ddd228553e49ccc2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VMZI44IT%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041100Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDs%2Bv9l%2B%2FQI5rpdZElV7L3ebKUOQUaFpOCo42%2Bw3OuvygIgbHKKDS5SolpLLn35vrgrJz0cg3%2F1kC%2F5gvIREU5y7IIq%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDHPQiGJQoBA%2B0A44nyrcA%2FmnaIgabGqut5crq8szHaVlp6p%2BB7PYJt4Azz4uTMtaRq9bwikBsIBxzNzqG%2F9QdzTcjK91oyFIXKUQa%2BLgYiXdfwV3hRI5sRzPXV11Zv5IcF%2FKql9yuowdzWTt2LSg7xAjaUi2hgKIZN7vCDgGxWP8ysri70j6gZ0wFtOx3Nr%2B9UBMwtB%2B%2BXOD5%2BKn1Y1JRVolfgi7hRgMF0X8v7B2WUfva7RKKAovZmi4fWI8Q%2F2pRLNOUpc4b%2F9bM581A0emXPU5KFDY5PVsYsEgT9L1y2vovWQOBtTqORAimCYYCzvTiKvsg43ijfuIDnCZ2KQaFQhol%2Bp8TcQUxcIfVt%2B%2B3hZyk9gx6dYfCABo4sIFQKzRaFuLYS4Zd1Dm2RbHVGIztP4XzDLpyomgvH5DNHkR9NyWVhQcpHkBiPnlihLQNwimq5Ww%2FPxXMfZOWebgZ5CYJ6guDo8ebt17XThhAlNbNy1bk2JnbL4QaAbUca1CZ43cx0ljmT5sObbadC1seRmpFjfx2lDsZWZI8mL%2FEEuIqwCMxSVmkOvF1mMfUqKRWUd6%2BYeeX%2BbAWrejnFqiZbedJZKPhovD4TdjCdBz4plbHTXlBymzLiK%2FOJz9GrWY6jXY4LLNhpnhcE8TOFeoMNH32s8GOqUBcSUJ0whZypdODY%2F1sE2euPJg1OpIo7L%2Bh8XrIZiTV%2BjzeMN2GaxDWjabu%2BkhIhYdqe3Ztbxbb6rpacgl0%2F%2FrTuYbpmj1%2BDl4NPpmG2Y4OO1eV9VOixsGRcCM%2BUnQsLCmBubrg2u5WDDuCex9tT3q2dUJD%2BDatWpGHBN%2FRSN04MlHUvh9YJZyn9WrJWGe4zW1XbuB3lLlpB6QShbWd9lEEunLpJui&X-Amz-Signature=fc2e9121b08373a25f4224536ddd57c9fd7a60addbdeab199986f3decf8a850b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041042Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=00ab6db4c754dc801e0e67d875f4a926a4e85dd784c5a5cbd9f8840b3aec7f2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=ab9977a4da2bcfa2b93ef3fe84f9c901000a0e00ff4f4a05a4135abf48a9c2bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCBXCYN6%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNESOLsCsDaqinbA%2FjpNWfrSl3dPwrOkWIYDn%2Fv1oGBgIhAJeRqGeB%2Bqgb4E0IUEyUNWef3%2FSzIc0zK289b%2FGCSSy7Kv8DCEwQABoMNjM3NDIzMTgzODA1Igyt5wEHhHiu91BYOLgq3APuJ42pvJRRXWIZ09fSTvIS1YAxE%2Fku6NGX9rqgtCEK2gtc47fee%2BreSYSvcx6dNZ9gpcMi34O5j8eae1GgYG9RvKOE2OAWPWmvsope7gk0QYq7yqJtUNb6AJK%2BPcXW7XNmuI1yOFW2bfkdcfzm4nxw7DGH9HVYUjlxGm5XGwukK0QwKcl9ZqAXc3cOH7CnPZeTCTGxW8HGHV33KYBAwopuT44pTcLQJ06kFZelCvEaanOsc%2FGWebo6ltbzOIWgNvEZVaZvmSjrvBAblm4H7PN7RgkSdy8v72v986lZucmemKg3C6mx9OVcZKdpGKf9tWK26s566Qni1A3h9gbDKd5AjtRwPvxEivcYBii1pOgzlqN8p%2BihMkB0lt2r684lA6dsX9ry2QyZPM8NtKhQ85fkah%2BKWjPoKilI9pMnOkSThut%2B21802hYlcU9xbTiyqtWoyawylVJ4xJUPJ5%2BfmdaQzyxao19Eg3UKhD4Fma1r%2BZJsUMec8l4seadI7RWiItQscT8A5XYqAIdukdl9kgy%2FufcVW6oiYCy5eqb9UM2gX3Aa3hn855M2D%2FcoD9%2BI%2Bi%2FgvvaRD8s8yGcloOYwrF6%2Fl4NoqRkBtT6e6TtpQoJNLHOCH9UNtrXxbuTrJDCi%2FtrPBjqkAT9rDuMK6Ts2k%2F3ZcHkQRkRwXKqMVyzt3aUGsDzC%2BUjeMglndCuuNouYnrLSbBEnWnR6mDuW7ZwPuDucd5R3%2BeC3YxwbxLQfl8ld2ogAeTN5cJdy1P2Ys24wY024fqHvlP%2FUmntOfVA%2F2ydDx6TJlma1qc%2FtKOyySUfNS6WgPHbG%2BVldPk0xaL6GopZ2vnTkXdJnNOmygRFLwRl1UsAezjuNMjOQ&X-Amz-Signature=04a69f5b43dc05ceee463fdb754a61847f508000618ac78a6a29d993d5ab60f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=5c4d0e693679e53028acc5c05f51825da9dbc938ffa570f786063da2bea43e74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WCLEVYBA%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA2Cwko7Q0f0kOs%2FenfM3YqslnO5DZlYNXzuJ%2Bg2xLwGAiAzWocrd3H2Sb9vLE7prjZfQ85Bq8UwvY6Uzwz%2BPNQAsCr%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMdl3NphLMdmePSZnAKtwDTEtzrNk5po%2FDIsFQ8PlK5yMJ1Omexbw2MlWAsUlPDlfq3f6hTHw%2FDnKiHYifv3Ad7f4JsYBXN1D8vQATQ5qI4SDOy4NkWw1ThbdrKcwpSf2IiQOreLJX%2FdwhhI3jjrexGUppMKZOvW9ALHajKFLQkcyYmH0UJNGSEtQwfvjQk7P3lecg1c6DvAppB%2FP0uMLi56v99G9SR7qhVpEMuDnWXXRZNApvL%2F7uRRSMNwCSLThW6i95Jcoojh1gBmdLzsfXoinCTQsj2RvEJ%2F6%2F3ypoCcnwTDwKIi%2Fo5x8nFhRUDDSL20y4PGJEE11xJGiwOhOAkyoyVTt7jU7fJAJre15s3CoQo%2Bd1JegtsZCNSBaSGg3Di8SL9zlv4vbX2dQzND3DT35XDa4b2mTAC5E4ithDaFcuBM9WgHlCJEyMNJh4XfTjKaur6WbfW1psOba3nUlJK%2B1EXr6wOFW07XHQ%2BnXJYysvwxl%2F%2FWGgIfDP6JPCTHD63Ut7LFcobKQMqFcZ9%2B78dew%2Fa73YKOd45%2Fqdir77b%2Fi%2Fx%2FqnAT81mY0fYKOSqWp8FnT0o5bGHURsI9Lm4ul4JITmrgSnb%2FqHWlEu6zTt3Sv6u2bi%2FGXidlY4zSwKAHddUkUEJ%2B3zaEbzBlMw8vXazwY6pgE8P%2BzPNKPyJZ3TfMtNVgu%2BunUL9kuPATj1Yt%2BOHGDX5%2Fr6cQyrCWadaS6t%2BfHmSvlcVY3CGLuFDv0%2Fp6OT5%2BZG89GBOeZg%2BECsC8vnK9K0E15tLyD4iv0k5%2BLoSK%2B5Tq9mI2WsZKnzWeY4IFZ4SXWKn9rTs5D6ZOUOuttKWGseGJscJ%2FjIM0jHIM3vFXxrDM9UM5gwlct6cOQSBoNqlFiw9ofOGKIg&X-Amz-Signature=dfd94e795567f9b9dc2b77ff0431d4dbaba866ce8ef5526f931cc3010845178b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QVHLOJ42%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCm3FVjIDTvWMJrRK02y5AxSoYePFFyl7Wyw8NSX%2FwcmgIhAJL2UAw%2FiX2bdTi8hagDiEZzIH3xWdjCwIXsH671%2B1P5Kv8DCEwQABoMNjM3NDIzMTgzODA1IgyHieYjWOZMImNErMAq3ANFNEdKK22PWMvgzPF7IIB0fKSZ7zEFFGzIpNDLzvCSTpczmyiyGumhjJLLEJPCj2DcJYB071HbnOSIH4Ag1dnbYiU6Vl0iPk7LpM5%2FRGgmc4mrP1uGRy0oFNV%2F8El5cjBGzxdd%2BlNlhaNzwhpsrdmBehcplSEDNsFOf5KW%2BtTOBkJyZsHbSzmfuzsLo%2Bzb82pUqHMCoitdyXDB8v0hnVvH2aVc8D6SJLr1Oy2tANa%2F9f5qCheKgOAFGN8abok8LsDlFow3SKXgK43%2F%2BjtYGSHOhZldBA%2Fs%2FAvk44nUkNOUIlx9TeqwORnfFC1QagwEXnr9Dc%2FrnXaNnP8SPxISpJuE%2BBMOYtmaFSGebltoooFQx2g5RhdrHiv7wTYkPmJRT3NXHK55etHjXyHpa0XFV%2Bm4L%2Bx1azt%2FWKSiQbjcDyr5mpBS%2BX2gsEwuZCtbc6luV%2FeDoBmZhoUqgATBvPFqMJFSAfxXnMu7DMocqEcczeIKXpst8DRkBQ9HbCRleVG02cCOFjW8c3OAJEiEoBmppJSOW5%2B5hJE1KVle%2Br%2BJj7sPx2M1%2FjJU13lKVG21VNJOhAFDoVgZegTv%2B0K3OcnBUh83ZTRhMQUU1tAZssQ927rCOQyLQnY7Qa6TM8joVzCe9trPBjqkAXmL1TSjXYHNKSKLs7Y1z8bgIt6MtbZxzCIsz919kVN0R7uQVCGfG7riraAsPKLFETSo0xPmNK54H4Eiq3Vk3nXdx9v6reweItJxZJ8%2BpKMfstz0z%2FDjq3WL9daBgrEo2JNXESJjAqneQNMym4xZWcNdr7iTbE91Scm9aL1SCIxqazjhq84%2FkK2SHq0Cfx1QeyB%2Bf28RTL1rBQXNqhg62P6ZF1e0&X-Amz-Signature=0bcf331cd19c672ea270296b72aa59ce1e50ecf42b1bf9253007d053417c0be0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XUT3GFXE%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD3ilVxC8w%2B0e03VstvTTmJRFeMmY%2FvSXPBYWl%2FexhcDAIhAM10PD74sHET%2FpMNqIcx9CcTCQ8%2Fj4QoXh3v0BTyUb5kKv8DCEwQABoMNjM3NDIzMTgzODA1IgyoVKZJ0HwsnfNXqTAq3ANZJTVJHdiiyMNdr8QW1VBIE61SHWDx%2F%2Fv1JSGFl6T0w%2BZ6%2FwFzlg8YB3d12QTXncN8t9vU5aQRZrcrMK63evsG6cEUQLQGNStJfTarAlTWjPAICcQr6IJxWIaFCeT%2FrBFjpf4AFMlcRwQWFRf30NaNzLK7fTjWO5WsqK%2F8xU%2FMZIOWK5WlkFOZl%2BOkvH21KOOO1KYi0imkg3cDMgPLEHDC%2FSMkaw9Jf4TExjZVTV6zvWeKrcdUAHB0v436GTqPfHsna3bgRMf50yEOPm01EWjoKOfntLn2RNpylHDKxSFtn06%2BDuxyaB0GqmX4wcCsihPL2XS%2Fm1sNKkWHw3flBo3cOo1Uuf105c2hKdGwUnufzY%2FIEKjpgsyHgmNuEKA2GasQbBEAChKHSxscqN%2F5ys8cWGluW1tZRF5SoDwi3Qeu6Psb3dkqHMFp4Sh2FkKLrB%2FRUqvDEQi4l6jv1RX5sBKR3mMw18RK6bT7mj4zr2FKX4xsqyC8crazhnH4ZH89TKXQeKm2brEXQnq%2Bnw%2F4zFzTQ%2FtQ4g4SMb%2F4QJKfcIjw8x8csr%2BISE439nDDV7NcTCMS4zR5qevCFlTn%2BYPWSaHeTyYiQ8TjeC4m8paByWDcVQXx2PbafCZozHWcyjCm9trPBjqkAZ7IA6XPRy%2B%2FyYNNT6WUq8e6pf1dIaFHaavBrQ4NPF04inXr8OsgyaebEFpz%2FEG1iQuSHP81jdP0BPlfOjvUpu5tEbps1NQOBMkXj8BJ33YwqV5vj3ql6RHL9%2BaWEtbKlQ6wT4IbTu1V2OphLc4EnTLBRwk%2F%2BDP%2BRuIEJbHYyCwax1uNB%2Fc7gNtK%2FLMuYeDysoTFVAJ14Rkg1ZIIPjjUiSO3Pbwc&X-Amz-Signature=381a5a811685be7baa4d66ab3a571e8f7bd86f7be76e595e61c28c3e94cd0c60&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634QQFYTB%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCPF5FSqm7P1x75TOBSsjeayJAdX4QdxzN582FXbGx3BQIhANxz8w5pb%2BUsp6deXXXTQNMr8TD7gYRUVDvpT4xe8AwmKv8DCEwQABoMNjM3NDIzMTgzODA1IgxlNDJ1MDMwaSUctH4q3AM6GgwKjBYJHfgAGtPe4DDs%2FolOluvRiScWyWs4yZzsGZoTow%2Bp9HuVvLr6jMiNGs2S1d8S1WWfxHKt62FegBcQiIDNZZXt%2FaaFo6f44At%2BKRpqBxQgVKumkvpjCCBlgfolB2O0GPWC9qrxPLAZpXchWKnMdIq749S7pmg3%2Fw1eUwhywUiyGecqOm1egiUWESU3rlGwf7r8bJaQY8ppbpYSXNxU1s7pXHm%2BGEdADmvb7QLq%2FPZU0XMA%2Bbehay7FxCVugNp2xr0MQdJbzU9QHQGl0ADZwHN3JNDMf8mT8ttFrjctwLOrnUPhjC%2FX6ADe%2FF2OLvir5WNrYsISRl9w%2FscfiQcV5pKkoZlI%2F9%2FS2Lg6zBy6UuV2gF13pQQw8mbNUgHtKz5bTbZjAwW%2BCQMKVS6ifaaSmiVqVAoJeGeoGQsgBqrHKPrKDPnwT2TrHCgsTTJu1bVO0VI7anxuu%2FHtbr8oSYOmr16jWFFXtWACJWAPS%2FOlXW%2FmnbWJhqYf8XjpF91JWGnSpqYzWaAzcPbS42lGyk4X4tAH5WenIJ48zkiTkBGqsDZXqJmXuoN5bhpJNL%2BqfKvKO5K6Vrrsbuql0ZhEGw1CIFG%2FTKlDtjKcdRzz7wyCmAWHqSIU%2B8oK9TCL99rPBjqkAcTkMd2%2Bx28zWyhpqRyjbA5KKZHrTx1Q09zJR902Vp%2BjMDZUqHbPP6mq9WOMAADGfLEzosBHa5VnnkE3dy4ZbhVgfwwi6AHL7lPOU57vp5SKaEOmY4%2FD2yhBdUQh3x5rI3dwU6URRsxM%2FSTY4oqWNpyJg2ZPE14BoioD5bJmg%2FlfustRL9yIz0JL7Q2HF2KXl%2FMmXp3JoZaf7bBGW6FSZ4vagdTK&X-Amz-Signature=a171ef99b6299dd0813617003d4bf987bdddc2c3230cb225c5b7a701e71f2fa9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=dd575541a6357a6e3eff342170ea1758fe3f8e402c3d81fd782130ca4fa528b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JZB5FUR%2F20260503%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260503T041043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDzkqcAbmn23Uh%2Fc75GWZHbWmRlgG15rW9dkuUCjhai%2BQIgViryEj9Qz8DCld1QDDlXgYKb60xcDqBc7aC8eQKmZZ0q%2FwMITBAAGgw2Mzc0MjMxODM4MDUiDIbaVGDbz%2B%2B5mEQbYircA2K47xjFXW37S5etXaicZ9HPQHVZvg%2FVktqakddwvDTzQBs624Y5E9I4pX5ODwJy%2BPGV7gsniPx3q3PJsc%2FUZyu6eeuWeq8krZXvNXm3w5rx9oq5D%2BH6%2Ft6NSTKytbo1qPcJVlayAUhPwhN4MeVAFV0NcD3bF0W%2Bx4gc6F9fxR1OXu4TIpz8elKBQG8nJyig8c2fEvmj4s4DNzF2uyivuUSTlFRfYY4u04b%2BFQJmsWmFkPKXaSiSRDosoS623e6F6mlC0eMf49Oh93iVvwOl3x%2FBbpJ5DGPV60TejWBl5jVtXf0yF40ymGil92w9BdXL03zUwx62gK1rP6yqdPUYUjG6YiAV2R17J7rcExNWYIHZ7hrVgEtUqEQN4dGWUQ9Z63ENcNHYDmepKv6k0pnjQoCCjNr%2FwLukWPqWoDWDcacCzVBMMPxl1uQgmNmOgPWgaAGSFwDC7%2Fe4qFJoaMeS8NvIRIEOs2JTLbdZIFkRe2tGw6mWikNUaVCl3nw65GQQ28j2JuC%2BhuOwE6SPfItDEEqyjxcG8zX7kkP9233LIy4NVI%2Bez9TEFVtJ5HAi%2BmbV%2FGT92jl9eENMg1rdSFUm6K63Fa1b95Bjo4xWVhGPn0bhUlyB9gOKLFSgTopTMM712s8GOqUB97IlKqhzQrfrBhbWtOiFGUpDlU9zmsW1WAU%2Bb9B0zm6gI%2BnRJ%2FMuGOOp5veeH6NGZHM9uakYQHloMTX5d8rT7x5hma8pglsEwof3GiQMt%2FBljtKpItFKjGd2WlEGKi8wsbSAh56gshOBOw5TJ5aorlpZSd3SZFwbMH%2F0oya%2BYZ1%2FtS7ws2fG%2BbJ5jVeu0ki9cQcEicXD3SodrunNB%2FqpRRMBRd2k&X-Amz-Signature=df38d0b6330df63a59484a356a10074c1e4e8435ebbfb2ab51734a55247f17b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

