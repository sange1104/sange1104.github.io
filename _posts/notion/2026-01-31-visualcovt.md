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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=390ef4409fe87fd8bc15b4e80289097e9251dbd191336731f84bb7304107c2f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=9b5e28bd52d44b1e7ed78d36a462b4357700252fa1b14c33debda777ff8e9af3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=68ba238cda23f8f4ad34ef913f78e5f5f559c3eee070886915ac338deaca5912&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=31ae4c1badb6be3b792ccaca7a0237231e2647a73af2358d09fb6cc961be6a0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WYMVOE3Q%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032808Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAPKjbi3NkVOXHscDi%2F6eeiaGlSW2EbV4N37MqLOw8geAiEAnichOBaqAylSxQMNHB7jA8kCEzCRk8vn5CS0rFRjlF0qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB98TbgTOF%2BYjwF3OSrcAxw1%2F425u6vFjkhX1uZ5dMFI5PRujJf44Hfi%2BgK%2Fj4%2BLNpb84YicyypbN9d4YmhtviWdSq6sjiw7wUAzIcqmJNyAqM7G71zHCB8MRZaCQ5KLADtBHLx3oJOTUtpBdZOdZ3gsb7InpcxzTH9EUYdAqSeaZBlON%2Fa2PT0INyxdPtQtwpyRiX22XbZ0Gom94spsF4PsQmHmj9whbiV5r4AL8ecOtVgxe%2FviOakN%2FiKmUMjqpmkUAv3ewK9u%2BKDopuTy33F10f2mjWhJj3dudb0mo2jLBukvPHoMX5I4L0gO0BwbXVpO3C%2FalzU4X7H5PVkA6zAVl2loNy1JoJP1507UJpKP7ca5LB6rMZZpuekZQqvPQHDLXtzkh5roWmwPEf7fwWbW%2BDcD2yUWiF5xdDHhvQiQKnKqVG93v12W6hir1v9XJ8wP%2FS1LN5WMInyfTT2UhM2u9SQLFk7IYTYCYwA97FY1DyQl0Cdj%2Bz4CrGUO6T%2BhWHm4bEFFWd1xIEMASHfIpXcaWMWb8Fv4k0ghFmZFIrSL%2FeXJLZusTHSOgsDI%2FJ%2Fr%2BulxLzG3CF5XKhFTdQCAIUQM4%2FXuUcb8B3OLs9O2WI7Yw0pHyIhgUcKUQ6HmGvBq%2Bxp9MzJ12tLVY724MMLJks4GOqUBYtrrZ8paztajzm7FQ0r7sdc%2Fk%2BWg14S5OCDUzJLA%2Fi7XzU2MePDdi4IgXtg6meKOJna58cTaXT3KoGlAbwTStQpuMnKl%2BDkUtePkSVOlavMdqNI1pkpeT3DkeZNQvq5%2BglGPX%2BtisZfBW4W2nGh7n4m%2FY%2FzbKultmsyG8i5MxI3icRPjFoVZrUGozQHHi0f7wUM8FsR7vvdhIf%2BwSTzTGipz10qi&X-Amz-Signature=19cd694decf68dcb7a877b397141acd8a587fa850a7289778cf7ccb05b26a053&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665KAGJZTK%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCaIl10xDewSsjJWRRRqnpy2nBk7Udniw7eQMoqO%2B%2FkyAIhAIwCgaTycegwpt8tJ9vjI6AIbVtMoVtxiYJOlEYHuOfcKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw5OdSUnbkXWaY5Dssq3AN12x5AEBQXNjh8kET7Gx%2F39wtZ44DMQV74TEsx4t8YmpuyuZV%2FItnFGjNu5YN%2FY2FPxmdQ%2F2HDkkGWNidxG6zSSAqMyqdO8YM6iOaRxo13qTR%2FPVpLT25iC0r9aiHKQ27vQ9GraHZnPIl4iFfYmDuJ2DX6o%2FxXky2vsQIBIQC31PM55kbbhtKQ38DGJg%2Fx1B4DZ0BtBeDMQzWinJ%2BWDan5bIkyhVeMOBcbtGlGrcTFtZBHRc16%2Fv2bSmypLCCaFUSYCpI3eAY4zaioULn0qrkudJ9Zen8rTq7D8mjzeY4%2FkDMDr5XaQ09fEqs1OgEiMvP%2BhFg9eK83mhj9EhFE4M5bFaoe3uhTfn%2BUdKmL4rgvhLfuwYQtk%2BRz01jDDyJphu6C2%2FpolNXKD2wbDma2FQ7Wj9f5j4KB8V%2BSJniGv6vjoIB663N%2FXbXLcFkt0EHCDM5cBayFyfUe%2F9d0rXONfKD28PZSvGtrwY65uIMc%2B5gBfpsuSlhKX4t9Eh38DMAPyoXE9YW%2FvpM4c%2BE3TWFjFhgAiVfHNUdzqT8H5wnf6S5KVm6cyzJpO%2FEN9ks6OpIrYDhlO6JWnhMUTTHTlcUdNmUXzKNYhxo%2FQ%2B3jfN60iv4PcSlYd8lok2%2Fz6vWX2TCGypLOBjqkAWl56Z%2FK2OP9t3PZCxw2vP4%2Bm9YDNFSNFXSr0xF4JqrHCII8OZqYtWhhxUN7QlJSd0SPMcmD7NHd3AqIVb8m8q0wTo20TYnNYCTDFV0CpZJVsCw7Uv9mAI0fGOydKfIZu2rOljL43AqZlrlDc3VFWDXqDjmOYrLiPh32Rp29exnRVyXygpbHXBBPFwlg0D7M8e48wALb%2BOoVVzslT5GX53j3%2FhA6&X-Amz-Signature=a05509b38a6c3d0d36177624056678284abbb3c3c5a830120d3d0fd484538522&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VNSW7TRK%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032821Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCPUbrnxnrBP6AcZgc1s8RpcjG%2BBYYF2A3P62EEA8MpqAIhAPq9MjoLGHWEnkJhOgjB3%2BaUtQr7C1bKX%2B8QlA0T2cEhKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzNWAA9j2kVJDDpmNcq3APU9Qv8A0sbTWuRICFLz4FEKqqoHL5BR%2FmLtlKii3GizgpOCa7m8cwOtyKnxxMBfqfKuJ7LRImb2fbrX0UWsk9803vGpM01KdtlUYvbvHV7hxXPqNukYsi5Tu%2BdFnYEGKOTz0n6h5zo%2BUYwMKxLD2O%2FD3vkONfoKdOFVhFMKMauljobkPNs24ttJZQi7mX8%2BS44VgakhlZnsfhQCLeY5lkoOuy8w%2Boun4%2BK0YYi09NFfgYaNOps9uwqNPFq63ZakPzZMUDra0D1m2bxu656rYJhw30qbWFpV1ta820nK8%2FVJjJ8AxFWkBqOSCVn%2FMCYkMjK%2FIGS4z930eYXBzp9ClERBp%2B2BtlwYhX16f5uE7wXni4kXiv1Juc77quc1ElJ5yWzOlNOgYDLxG36pkV6bnvgLEmRu%2BtEKyeVtx3nnViureda18D1wr3LsWcrH%2Fjkmwvjn3ErITEx7xR5O6ZscUcEVVth0rGUvs8OYt4X4b6UxrqlRCG2iKSzMFjFsGqCHxi52tD5GLpwDiMtZ7jhEVQAGgs6sW8RMdEG17ouoDaDDwCM95kcl0DRCJ5ErbF7JlFmhjabBX%2B8sZQgeLGVY%2FfoD5pclGxfApvwmQ7jMUMW2H4Ank1Ly5JJIbdOsTCByZLOBjqkAVYvRO3G8vw74nzeDAjRHCGTv996VRlQwdxx9wQq3abOgtlUCKxUIpgtKzjgMbvm6aQsdsfqFCDuTmK7V%2FvnwKxfl99f2vQvuuIcLNbrbVHH9W%2F%2FwJd93tz27wos3Nv%2BgbNDg6NtMG2EAu%2FcTJjFlflcXG28W93vns7c4kndge7zENJ3DZ44MoYZqvUC6Oji%2B8NuZBh4zZJdr%2B9hshWxsov5PdXj&X-Amz-Signature=2295b44da76c88b961a8e6a5330e602d9fca97181a37f137afdd7132a47eb92c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7JE33TP%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032821Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDcnEBAQ7SEv6O5OijwVcPSbrOvVHcmr7JiD4nIrGDSJAiA3DXpA7FhfNaFVBB2hVhg2taRub2xduo465yWkt55X5iqIBAi8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMfwCwVZ%2BVoiICFFC%2BKtwDxhrwj0sWhXLcn82gvRGqO8JORUCON%2BcnDaWuFy0b9G8wOu1jTAvUFdw4AnPnZQeVv9KHGyN7rN3rPOAsv3%2BWpgSa12zszffNyTefbqtL6UnjArT11mzsHq6wuagfayzf8OQXEVKQ5%2FK6kWUttcWDa0ls8JVgTF3zw7bCvjuwg8%2FkA2Rw%2FOqj9B2P5RPYhfAyEzGEpTNwDYOp8zIgLnzThh4h9gfZrjlNqRDXKnFrWuIlsIa7QhouaMV8w36QZpy5nHG3LRQd%2F3XrgcBORf5bxE9lCe4jlUSmyWamQXa1ccuGqa4ByNx3JrPLjf63crneVvPfWe6hPMGsQjOZxvxmG4kboQY64T7fwRPwEkD6wvTAtaAUXVoDEolKPdLkcWW1QmIRG2uRDQJs7Hq0YJzD18Qrrnz35T2%2FZ5zrWTMbHDSKAvoaAscRF43Hf9Sc%2Feymp8Vkyv9yaii%2FAKWAnhdfQLNzycFb6gsvcRDbf85ho%2BmUwQuOKhxjVn3vqTs97dwRX4cqBuPjOOYwNrE1sPnyiDqu1RZtZ4uWrlcOv621PMH%2Fayeg25jOQtN%2BmJKl4PXzF3pQrmetvf2zJgB5bePT77u55u5xh36XUPtpknD5TlmFpKwfsX%2BGFK4bU7Mwo8qSzgY6pgH4TzCECitKj%2FLNiaMBqoFm6mN4wuSA0U8Z%2FBe%2FPNgTl8JVt8bNVfK7zFedWdIKRoKwvINTqzrcllPUn4O%2B67QyQjy%2BbiJ2iN8G0sNAQp%2BMb1HeRzmJ%2FrNNJlP9ZqRf2R7eL7NcLDAvk7ojKIswjbbX%2F18aIGFhEUdM1mhw7IZ0zMH9HNfO2R771wEwCfeVZZvRQhTKUr7BpNt%2B%2BmiCBJzSjIYO9sFj&X-Amz-Signature=ae50d2c0c94b305e8f178d1527bbc396848c662191b70e5c26f123a3288dd57c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=d0f622f4604a7928d79f2f19ef2819c0fb72e24aee000abbeaf8d999f8c9def1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=acae3383a6485a889352d8c8a1a35c6a29462a7c299f6cb8381361f312ee6518&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664D5DSC4P%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032835Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDtaWUASrQ%2BowRozTBqFvdSqDUxrwIeXO%2B2A5CihBMfWAIgZTHx1X5z%2BM2CtzXe7eT6Pb3pQZEiuEK%2Ftu1rHWWNpnAqiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMO6GkDmRsNlprqb5CrcA%2B4PUlUr3BzxUYKDcZkLlVSNYXxM1%2B80Px4iX6UHdbKn9Oyzqcdyha9kipQJwuVhCDtFRy8g%2FSV3qZ23Seha5qXO1npb4fgMJtvc9yXO16EbvJZYUhAtFnIA0yy1QnSmnB%2FEA2GJOviBqus6qdk5XxwDWbdJqTWhQW3%2B7me3WV6hAa8qUJ818uoTWyYz7Bgl%2FR06E6mBMg4WikPozn3XE%2Bf8iU61RDh6i%2FzPlE%2Fbk5Pyca4sN9MpGEBiJktud4pG1eFThnmjG33oPDJdZnR1uQQOB%2BSuH9hCKpMEwFmbOk0R%2BmvoQkPFroRofJ5XaV7yytQeeXBTHuEC7x%2BdRnK%2FJgW0CH7Qe2o00zdS0XIKyjLTmnSTr9iV%2F1%2FdZfneSujOtffmIWrzLPkcmvumViS95zDuRHDVlbgcd2NMX39QZ7ZbCykCrldF3x72riZRmevJzydbXgAEH69jXozo14wNjzEIky%2BoueiWmLlnZtUhW6PrnylB8L3pVNngTtSP79NgdvccGxM12%2B3XH3AiI4RsM1ms9O10crNh0wBeewNrSWCE7ufzOciLOr42mWu%2BmVtQaPs4AfY%2F267%2BYjjmYtGIXmJ72RSnmeLQh0R1%2F6L0%2B4UNKcXtdYYhVchSvGCuMPXIks4GOqUB9WlhGz13hd%2BHuvBO0oL0VK8u7tLgyYP%2BLa7r3aAQwaVDkuVNOThlfX72IhhmCdmA6wIptNUOaxSd7wGwAO8URoCHhYXYQrm6C19chocUTR36SNK0vH%2FRPWESP7PlLp2sCvPoe1t62AmTzvb5a%2B3cV%2F%2BVaUkMtedaBgg4kQCGxujmVw4MkHtlkRkpwpAcIfvdre6At%2FQG0E4G66PGm5B0JUihLJU5&X-Amz-Signature=0c735d14924e87581b52a18b8ad5f36eb58855b4d9bd3dfa5074d365ba5fca22&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=b08d1ef9cfa6669fe27d6756bc2c979f161397348b06d91b8f73063e879c2f5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UH6SVUBD%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032838Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDrk1kTmUyFGlN6vRiefgscHmvkURQBw6Oe4s6n92cq1AIhAI0WLtgx7A15tlMhQKT75sNlHMg%2FQi7Q93OfmFDWlJVlKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgykuHS4%2FRe51YoHvfYq3AOr8ik6SYKW4OLHzpaewORiEOMwaTpsglng5fD0uBiUA0fi9aajMkkloPsfoYNJ4XTK4gmEtT3oGyFiED11yyoL%2F8yy1nnmtGNRpq70W6Sh6Zf4CfS2Sc1NxP2uPuKISJN%2Bn7o3POH0bqAQLf5a6vR4kTZ3hDhthch6vkybL3rNQsJlknMW%2BH0KupXZrkxZ4ktDObdmo6MoNXr4676xSyE7DhTFKu6P9PULJvGdEI6IBb9NA7LgywvNPrAprTS5whisUgKJbE7R%2B4eAy1IcwEa8zcRoD8p4eBztCw13ChtF3dUCd0PFdKNLtYuMMXz9l0tFa9sNAoLwZVq7z1Y0l9XPfb0WQ8KPfEODb5SMURUZIZuNc4%2BR44vEe5iDeeb0jGfQcCFI2P1SFujs4PWO6xjaOoplpoSFiAW6J%2BIGMeb%2FGPhV8S3G4B7q1JuvDm0rONlNKUlDrCR68SDRbzGqJs3hTVfIDtuLhjgStoCTvmDKhbC0VY56mB%2BAPOYYawT62koNr2iddt4hfzYegWHwvdMCZjpe8Y9VtHt%2FkeleFOSDijIfI1gLHQcKOvQ32Jsz4Zx5bPhGlh4toiuZNbAGMekjugOnhDfaIdRRgyDeZuO8wCjtEcp3%2FOi%2Bx%2FdQcDD0yJLOBjqkAY87w%2FY7E3NLFkW%2FuXvalVwI%2BU8NEzC5qMmfoCledDGgT4KFOEthoQIBXYokE4Z5n1rBEeUbMpMGOZJK%2BKgjN0HLZBqLQLCHXtgMvublmFhUyWleRrW71Br1bPYizplAsn19pN0D9xxWKzMHFBPqLMxrRXegcqRSA%2BTlSLxBEbI%2BkKpRkDuu1XXFQ2mmWArmudvn5LkMsF3vUeE8gh0vnwfkvvhb&X-Amz-Signature=1eeb76879f70d693b79f3e548b1db44ec54b199b89db711c7af92e2810ab958b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QKYGZJDU%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCsw%2B8Dc7o%2FYcTMHZwAiGUpXRKXj0FXcL9SXEW%2BExqSTQIgK6POlEGF5o3oh7%2B1c9rP%2FJrF8GtCSAqY5diIPj4A070qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDO8OrVC700l8Wc34eyrcA0jAYZ0cxF9eAiWp4sVOIdF0sjcRDALsj%2BC2xTxsg3uFvBMu0eYLTLmm3ieGoG67IRotSA%2BX1JauTSGfqjlJituxuYLUxwRPqLUJCgYHuVbzPkLuY14G%2BYq24JxrWTkVV44Gd5rlqMgJpyXyjN5%2BdBSsN78kqCdsHYbjuOOOSySMlZVsxuR2T03n2%2FORp3v%2Bks0Ykh8lGoARcfKpzcQkFKA6Y9nr9LBLV6FCNb2sZOqzRo8UdiKwlY5ZqcXQUYB2PU9%2B0X0pLPUqTS6wU5XCUuDHYujh1eLHkAU0ebBOxJN5i10mcvdmiyVwS8D1zu3iciSf%2FPgVzlf5B6u3WYIM1kyj5EjzHx%2FjOBhcGNsH3LOVJKCOP003cvcqzCM%2BSz%2F%2F1U%2FXxoQtiXE6r9h1j4GQJRBPhg0hZfvjpr1jppofsxnk1EpLRRdlJ1%2BKjku6D5WSVr29h5blb%2B9t0seqPSuNMTpBEADj4dun9T7rJy4K%2B8fqTm720PjRFfjZlYVcxA3i0CbEauafofMIvK40iSYxu30KCLB4jm7XMRLh6w4Xjr4357t7bG9LXeTPoWIipj3Udzg28go31lMtC%2Bu14QfRXc%2B0xhs5gPhWzod0BzDoGvwrzigYd4wAUBJ6AmZbMIPJks4GOqUBm2IWbN9GDEsE6g1gy7GO%2Fxi44F0BR49IMv7W2p8vHp6O2LZDKVx8oG%2BNaRANM1SuvNJbtO7AwO5RewnunNuvdSoRBKczPzIevRC9vT%2BUYUmmx2vMaTaNPW33orGTydcyrzQmKOOh0y6OSTcI9bF%2FlqEruEXoyr6o0N%2BhoOD2CFWX1ItdyAVQbcTZK%2Bk5fWyBeUxyyBoax%2FLRpzIa5v%2BZc38jIbmN&X-Amz-Signature=860e9858862f29e565a96a4b4edc6e8f17da04ae967d7db093b14072d0baf43b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZSRVY54%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF727%2BKttB8THpzhBTFsLaxoYuDD%2BEUd80rq%2Bx5CP%2FZdAiBNL3%2FIiow2CunBDQbAq6I7qlfjUnm%2FNNksEhfWuims8CqIBAi8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYyjqQ%2BjxBEJJbdwtKtwD20pJjE9NKClRYKv9CGaagN7txmJdkO1JlvTN%2Fe50hXPbly%2FfYZsNhVA6gxz%2BuwoMwlSi6u5NYZ6IDiRjn%2BjtgdflI%2Bic9Tzaei%2B1RoM3PfOJd2DmDM9hFWVX%2BobptesGz7D8busSsjSEvYyXDS83%2ByMvsyIHamgz%2BKwkCiLniQjcopOHMBdF9vVfGHCubyU9GeO5lDsna%2Frcl1B1UHxRdezrW7RSV%2F8sH6a%2FsgIPs3TL%2F3R%2BBT3fmeeB7UFwkkyQP%2FTMdXJrsXcgzM%2F6vVOQOKWIp%2B0rvZ23dGzE11qlQx%2F31fPCBv6B%2FEOliT5EfUuE%2FYBCKK4l%2FLa9lT5uKUPhz%2B0AwNre7jDuPdabMqZ78O%2FAf5eUAGNsLTQIZDXa%2FapoACfHfZzzueoHc07pAy1WMepcS8kB3CPRCuet22YDqpk03Bb%2BorjFOk1L57%2FpySQjJZQPnLYCJ3dxb7kZaIsBN8MlvCl%2B3EG5FylJulUbvwA8IApG%2FZit7Hl6LTt%2FAMKCUQj6UOkS2%2BH5A%2BHGEmcM2eAhZ7%2FUhwkdUIyHOGs%2BDu90pzbvf17flKM9rjez6HhnT4rBvuLM2G%2BVmZzlPUJ5xFSsdjdgrMii8fYkBdbs8Tpnr3eYXoPzFzlEuj8wxciSzgY6pgGx6SIKjbn3Yo5JiJO2hvvCqui2aA7yx5w%2BZiio3H5iWGsVfwbdq6dbp7aZQgjrHqAfo7lfmYuKk3cRahCXy2wpZoYC%2BJRf6BBUBlR2mv%2FGrdvCXN7z8oyHq98uEC%2FInMOT7Oy%2B%2BrbaTfEKUD4ZONdHkQOuJ4MX7Yi6p6s1s%2FuNzeNiHOV0HCP71hf%2BDuJ0ZS%2B9RQKxuNSLwRYxZKi1JHMQfp2C8EWX&X-Amz-Signature=aa1d97e3e4b18d53a0d4d7e38a5aa95fbb6d7ac56381747d70ebf8740990eef1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664EB2GURM%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDYcV3g0VDq%2Bxh1puFhOTjP74IoLCzBqGujkdsd0j7r8wIhAPDi8W7uQ2eR1bI7EAiibgETv6g1no4PkLECzZUHu%2BFXKogECLz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzBP7t3Hw8xpJ4AcBMq3ANVMqRUOrXyM727vNezPPRMnVt4ldMda0TUxqkk3Bcpcx9d1JtU2KdGbByrJR0x7qWlsAnfK66QJNnlAKMTtVL%2BSeTjL4N%2FbPNRn%2F4Z6%2FNVdlsGbUHaT9sFvQPd%2FGqtKm%2FuPq%2FRIFbiTdWh2ktOpSsof8izJwB3%2FABBiesLg%2BH3cZ9XM6eYKj0EmzZ4LL00a8l8zuBXzM2MOayS3Vd5l5TquYjwO1UktMbbE5We%2B%2B23vl7WuBuFu9I0AcrZIvwSrZ%2BbytnNcMG2pn2FG0XZbxzl%2Bz%2FPnMhp7%2FO6ICR5PaufERJcLtBvePJX%2BRgnoJBPv5Cu9wLtm%2FJJuN4MAZuVDUVkJNwIvXaLKRZqp9wa%2F76OUQFi7gWew%2FQNfDqUtR3laOaY9IWdGK404hYHWsWIq6VP9SaJFrY4mOqSCIUA2ioIetgxgea5vnBEhsBxj2RDwN8D5q003EPBXe5rlF06y%2BO%2FbDA%2FK9sDiaYnRNWDDPwmoHWAn62zwDtyOahSVc4Gb3EiRY7IOCTSILIw91Bj3umJHjq%2Fa97hArVS%2BIEN32Pby3exCqDumIdAOyea9cLjTHaNcofbE%2F5ndiaLRMy%2F%2BY8LolmGHr7KBaA5dgtnO%2BhOWL8Xyssu9FlfUInejDCsyZLOBjqkATup%2FWa%2FUtNpQRbst0GFX1vr7wqYsEvbf214aSywzJ%2BQrp13HjQhKj%2BgoxKpnaRh5NQjazMqpJWiKyGSFfWZRpPaZMIWFoyvZmDUamuc8Uvh4gijNqa4t0XMzPdZcBy4wSmVZssBUw0ntdin0nFNCRxJFsC%2F2M6pU%2BcUE1R7jFJu%2BUr4I5LNoIx%2BbMRRRngB52aGELIYjW2%2FX0H2U6J4wDl4sinS&X-Amz-Signature=7e5001fe0f99b52bce68ae1484c893984eb740d13648b65039988c6388a3d1ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=5f5af87e342f6a7e4204dd376ee6c33e5f11459fe623e2fb4566a137282e36f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UJOVM2M2%2F20260326%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260326T032802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFzoWxx%2B0tzwgdJBiGJCJeOlnG6e0i9DhCyqciFSL9sfAiEAhgcuyXsG2JWCnOOIKiwQakWup%2F7BSmtBJGPZpaYGU74qiAQIvP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCigOXeEPW%2BSQqQozSrcAzsxCjWgNF%2B3X3SVcRTbgkr1jNyG7%2F0FNzSX8PF%2BslNvROjhKtNAC7qR1qgeWJY8WyE%2BxQ68gOHzrqNmuH%2BoMyILL600jsGiDy94bEfYqcZxQWBRMMd9jkcokKxmf6sGWwqT5%2B2SPcRy%2Fb6sV4lz3pcLjAFhfe2liU5Yiyc7693K88ogOItxBGQq2p7cRKvH0m%2FKXRIjl87%2Bh%2BiUd7WGnnPkQRaCoOCHXpC1%2F7a564hZDo6v3WlTlDJGeVt3t2qB0S3ehu9DzrSh7SCgpMuLRcJ90Ik0gEgjc%2BH87CV0IlKCQ4efAs4d1G4xQ0r1GuaKidn6f5NvWKkJVRtloHpzMAbONB%2F2OjeIUr7xrqv0v7CEMeMi7DU41w1XVr6LtDzeWWhaEjdYTGTi0%2F9XP8ZoKSNC4hoNCWS%2Bp4%2BpOD5Q4CnHJZ9yxMePX71dNzYgqv8KssR164WQLA5eEEtEO8%2B2j7aXnXPYNxC7DLjrpCF1EEjzoop6JokpAklBUgbJUfY42PdSWvY42OX1AOl9efstRAuC6%2Faa38O8KpFeQqmO1DoE0Vk6AJ8h9EOkKN%2B9jTDwATeHk04CZ3KUORBLmcVIEX8fsqne3TwEXDM2RoJJ3g%2BAqMbL0zs%2BTB60djPxMMfJks4GOqUBbyg2dNp0aAsiCda7lx4JCG3YcCzKRXU1ROu8WLtOllLMVWeDffjZJvUnRs6ONu19WOghIafWO7%2Bt6xDQyLOUw2NN9xKK0bIcwP5ef1YAq6JwCnVMKWvN2wWPOKnoc3Vxg3Bxc8%2FbcpUqyNPEeBDCfxjr6%2BpixDui%2FMrQTxJrTzl6RrCenfdMI66CnW6pBdfcnG%2BBQdySwdkjAJ3Ioe8gvHzducRo&X-Amz-Signature=8a02dc43f270997a269c77df25f25e2694261c955848aa44fac97fbd2f9a0731&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

