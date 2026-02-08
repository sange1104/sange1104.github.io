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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=4a6d559ddf76adeed819fb035b5e8daa4aabd1444056140d381c48d12c7eaf0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=7f1f9ad367c113d76fe9088d44a75d2172408d397fb972428aabc6b5f5daeeb2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=655a96dd27bea7fee32f1c87d5beaabc3dd2b5b91587882d7f6948bc44d68b2b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=dd18c35692a7b6f41baadaf450a54d90d14db698f640c5d8fa6ebd66d044feab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UYAA32QR%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033357Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIApg%2BvXJ0%2BSFvhdyVFa1udWr7aRWZxrewA8xFAlp%2FCKMAiAt7GqwaQfL5I6IMk9rpeNLNi%2F8npnvBppLS40JBs%2BChir%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMUDtM%2BKnLWfO0RbaaKtwDmkhD9gnlWoaeqkih5tW0LrULONSvZ3O2MaqWpKfcWVGdScJYAzs0IZnVehh4pxu0QX5LC4SCj%2FIfJYEbbRZXVMP4rIqFSdN1UCsCPwdrRswdvBha6S5PBQ%2BVLmcnV1DmxQk89fJ6ZNCIFep0Xg7OhlfbLqqFJhOWbMOScpfDgNyoq96I1KJ3%2BDxnMhgVQ1OfB9hELMqu70h29pY%2BJGqh2G0Vtt1e%2BDl9ZAn3x1fPLCZ7mCBjO29FfCqHJjimTD7LfAb7bx2HMKmohXR8vwizvg2xIO6so6MNrxkjSnCWsa5KJ3I2rQ8uSQO1GbuARI6oxcK3BDXx161w2HHoPD%2BX73vkLjW3tIFO7NTL8euJj4wBAv0FFr4vG%2Fxd%2BOvUHRbPJYfq2CyKZPg1Z3V5Icmt2xaenjQ%2BwPR41yvKeqNh1gaXq5mvdcAbomOOm%2F0joexW%2BIEok3wJnpwi%2Be0zO%2BtagJ1NEMpWRzcFG5jhgm954UjG3B%2F%2FmNPCANOIISw%2FVkAGp8AASLjv6hnDMOvItD%2B0ebxLxQJCi7ea14zfpAdODPMLZF3RWwvALBCk99gB9hw4toRZFg8agVjSuzGifbY4P8RcVrEdh65mrqO7%2Bpa8S0xSCAC9b8%2FdJWA7HogwveqfzAY6pgEVhxEhptySfXCCG0lN%2FGc3uXxh7Ynda%2FZvtE5ER9CM6eEaDxPar8FmbFeNM89jtdijxdht%2BkD5brISH9LE33dcHHFGAm8BrNYkz32ahdXWn0QCOz6gpPNTjc7HyEP%2F8baqDkcdmxLsOom8yzKCsWM3i0gbksPh3Gc%2FV%2BvVwliIhs32rVhfUAssiL1eTS5UEPjRCliMsiOh5WgULqXRtHGqA51r%2F%2FA6&X-Amz-Signature=709ab2f781c34ef95833e3340195e42dcd65d875d1e286df142dabe9b63671b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UQYX2TTW%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033406Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGVOABUDt4aHTXrLzeW5M%2BpOnSswuk6isGuEHajF5Bs8AiEA3jIU4e0shakuhdQgU16K127kYIOzYvGOKMiDuigKEsQq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDDxiN%2Fi7hIBx4WyQ%2FyrcAypcrZmJF4crCLRcpmnKDLiffbzVUTENqzXKCJKWLBXzCxn%2FZjAzxAKYPALqyaCl3swGdktPQ6mLTsuwq4IJrv07Wj%2FDzLGgefSphZQWWZke5ymzWrBumzNq1vN8ZnlsfwfXxSbiFZvcAqaqMovrIQ9gMgkkFmE5X2jKS1PQdrRjvW5PGuG5Bv%2FYv9M5o6A3kLt3Nb9J5uu99D7X2LPW9Y1DWx1Y00vW7%2BVwfOc4NDX98PdHZku%2FyXfeWyl5ZXTksI5hdnZDO3bSLvNge4NmrrkjzvBUnGYbVdKLAesJ33eFwJnk93Q%2B%2F8pGDYaeW3qp7j8Q2W7PrzXn5yLbYowFkpgF8Vt9cYQ%2BaMi2lgy%2B62lqfmXbJBLnrL0%2FUWDX5bXboJVfQ1LRnMwbJtNRGZvBCXb1vZfX%2BsDoZm5HCwVAocixBksJyf4EItDxWbTRVUVgmkrF5y5O4wOcw7v39a7v3a%2Fcb5D2MwtEhe8EnyKHKkG7%2BgJytYbfUDtN3ylzGQUGY8uiBB3bHianlJsk0dsJYxljqpccK6l6JJH78d7X%2BTzwGZfMw7vA7yDEH2Ql1Br17zjM8XaDVwo72GA4uArRLozd7PFG6wIBrEskt%2FLg9B6gHG9JaADW8JurxJoSMMfqn8wGOqUBjhTmA8tvaZTAuLJQsSMnfm%2FHlF%2FArk%2B48WzZK9KW3w2I5jv7pzqROjSp0VggB68Ewy6%2F2uQv49lfu4wV1SHTxBE5SKDJFuansmrr63xoi2tYiZlftHtHi5pKK9tdCRRcnvR3dfnwbdX4cT4sBXTZOjThagzw3dkjTmlNqLA%2BjqEmxHawGhQerg6RUh2UQxWCGX99UlcoedLGRSbpICJzs5QqAvp4&X-Amz-Signature=9fa5bf19988ac26a2164f71db10875ae160491235aabb3b5aebced90a3c73240&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RVDYRRE%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033408Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVD3mWMt7ynw87dybd%2BX%2FiO80Xj47NeRDYrxEXY6MZuQIgPh%2FVMbqnmlCWOPjyInMHdCK8HjO90M37Az5PiR%2BltaEq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDEJfneBZk58OMSU%2BFircAwSn2al%2FSAhdtNlwLqF27To3RFOalL2Axgh1%2BgtzCa3WNb4mMsHpl9GnFtvyWP5%2BUVDM5N5t0RMvd8UEJSiY4AHyk3nJOHRJFqq8giJ9sU1YNN3d5WQw1GgnzlLdMYBUTi%2F369q1BlZBmZ6NW5yY1m62uZRmdXM6UzK%2ByEwm1r3Yqc9GUjEaeW3PB5Nom%2B8NnUvclukYNqEy7Pm99Os1nOOIz1oz%2FzgnrGMivv7pqCQMIiDiOep40de0ut6%2Bw4Egej4IxfzNwGK9VVTu6Fkfx6BBp3AzkWWyT8lIt2g8TRwNGIt75pQiwZoemED8Xv%2FE3w92tAA4%2BKtNYdWqm7lVPeoDxftUPqvd9q3OAms%2BS0XYInlYlSUJNDEzVmYKw%2Bf9TlYItEV0lsWqqYd9SCB9b2WZo0BeXTLOxuqtaQw9RmIXwsdKbXks9A5T9wELw%2B%2FqY6r0Mj6mWc2zrmipPvcfv%2BuxQb1q8p%2FptB3h%2Bc6%2BPvO5mqBEAJcegpCsjB0HIUHQLulyGEBFUcs%2FLPXzdDs4bm7JhucvjJMdQESFLIKgxuwRoqulw7bTEtuytF8tiYa6Ngwsv9lvaYrnMEHARCayGOihvsz4gApZKZs6WiRU9kYA0WfE6RQhwXqYQFi8MIvrn8wGOqUBCHWiFHqhHl4aYRJm610Sqi3N0zbb9tWfiLb2MdxflTQjw8SvS88DqO11HBxiy6U9wFITpAR7ARUxwQcwCatMMYift9EFqF2IpG2I6IXS7CRlRckYYeE3HJL3N0byRM1O%2FuoYHyh0P4cWb%2BHQxVubFkrqx99ni0rf7A2J12n4pXw7gSYIilUPFfP8mqyM2wgHGOZH5Uf07QvNf30O0jT%2B9cL0ttFv&X-Amz-Signature=4aa13a30b0376abe2ffd519b65ba53b316a64eca87217b2dcc7fd04d1e87157a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQQO34YM%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033408Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDZgi4cWiSg%2FxSNJdiVafs%2F3zj9UuKMSxtIs5APiNxBVAIgQgTbxKNhi9Lp0PmeGVjBLU03357ZtwiuylV2zawTbfsq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDKLAmutWrIgQtxqmASrcA8SvXQHSAvOPcFz9LWhORm7OgGwA5jtBs5BLaZPP9RdgKgq1qGScn3nZPPAiW0Yl8tKSioLPsjFjTWJr1t8NHL%2F6l1ha6K5LBRQwpRsaR2g1EBcYH8fQHyrTHt0rbJ6gYYrIx8FlY6uWISUIZ9kSqJ5Ma9jVo%2BAQIplN%2F9QJhbPRoutA2%2BMbUUeTCQPt7VjcP33V6ERXN76j2f1kCeXMeYVG5GAXShi%2Fo%2Fxc1P6jlSQbU5wmc78Qwt%2FNaEroS5cZE%2FRlg%2BMeFE9JwsS2XzhBPic3M%2B8%2BvPBkFXjlP%2BmhTyes%2BwhwHiO8lF%2Ftk02s5Nl%2BywL7ihPBcsUgvBMJJEFGehayEHPc0Yz9Ngor%2B2PMVjksU93aMgiZiadKFciPPhbhoi1nMJ48Ex1Lf6w%2B8f54Mdr5POjyY1Oz6HS2MFtc0qYPweD2oT4dE0Qw8WIxv8kwriLH%2FuCRps4yUnYAKaPCpwlo8P4w8%2B9rScJlW7xwefjMWKMG4FRQFisvzCg53MMJ4XhyqFFB1g5zQ6Qq78%2FeKxxv3o9hM1g8LkB23jXFzwNcbTuv5U34zJGMP0cXpj052PWo9%2F9FMFam%2BeJWr5Whd8IouFkFQ3g5Cq5X0gXoYvelWOP0oAEMN%2Fs74%2BY%2FMMbqn8wGOqUB1s%2FtF11L%2Fv9RaBW74Gmy2Qhf854SoZIti0AFZfbeJkLgn6%2BO7gB5IxY3sQRLJJEIvNtKE75Nxy%2Fg%2B25tjZHNycrdUgDApJwjmKqhR0yJ2dXKSJR9MgRa%2Byy0dbyEVcUXplPvKpdlDXphh2j3f6CnDatgALa93PV11C8afH1uqRDb37fX9damrVrOCEQYAvzE1TrPezxHxlM8C8b4FePdKIk8WzbX&X-Amz-Signature=eaa4acb0565468094f4808ab7740773aca4dcf67e393fd598165e6072dac6f20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=c7471dc57844ef5b6b2b4adeae93378325f8aca2a90790ab624d80472b37e3e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=55ac624ddf4cb93a2c5b8d80fea85eb7bbeb98a1b7ba6250356b1dad1daccdda&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VONABZRG%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033417Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG1eNO8rJ2A9sn34y3xQNtDnarSIMOqB%2BK71CVijVs8CAiEAtBYAQqF7sE9MpsSJegC0GGP103iO9PdNJ7SYAOc95h4q%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDISRqJTm1DpsHeI%2FuCrcA9FwleAWFzSqVaAluPBdMCwDuGiSYYe%2FUXGMMhuBqblKkuZ3UATK%2FkaZYZtqj872mqB5sNQF1HuPml2JlGLG%2BFBp38dEMnrs31K8kERjQGRBPK3QmQcm92AUwJmf9GaJh%2Ba8dcngYjucScik5%2FaRgWGKlrQ%2BaI0y1cYaYOUmIxTaeY05Me7hsgxNxxm6K6t0jggY6yVgP0WuK5%2F5N%2BDibGmiB5cLVRKPB67m98MkqNhKLyK5mbtwNGKQljztha3CNACDUPO%2BV%2BFjAw3I24kfarB7xRy6NuP4tVT0iW9DWWST1g9FqMzma3ziNW34t7J%2FKk4eiLIdqtUdIjGyPZKAA%2FaAJMGFP56RIMCSAla81iFCyY19ECB%2F6aA8n1Y0JZrZba2Wtek76mayoUqm%2FB%2BY0F94qyPmWZGbwqMzbeMzbPBizl7ZzBXQAL8c4DE6UTZs5SBVMPPBO69rcp6ZawwzT4Asp359Olrh1hS0QcG5JxqNYbonk6BaKYu6vIdoiWJQHAjxkvjUxOGccNOoebJtbV3xsaqt30lNg28%2FJhamekeO3abg0MSXpmDcjc7bnf3VuqTVYfTwFGZNFlbLhvdSY5PSxG7lVoOdGUIdijBOEdu%2Fqg6wYP21kI8XBtRcMN3qn8wGOqUB9UeDF%2BfB3I%2BKRZlEZdOepMv3iO1AJ6Hv%2Bmh6oUyyjfMjPc4KQKRWXMmZYLxKPivzlMwqIrjspX5nz%2BxF2lxyRsUGrK9o1VLYgN3D6L2S8hRAaPPv1Vl8%2BY%2FMj8TOw0w3jno2wfcW1Qitytq2IvaWHgG36xQQmmTl2qO7VlnVGY8Ja3MOQ%2B7EykYjumknDJHhv6lblWG9GQVjmy80jpueO%2F%2BRJyZj&X-Amz-Signature=002246ce239024d30ad80d390329afce02861c64767e330c5ca119b10bae3795&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=e0813e128fc8ce55d2d4dc7e393103dc8ea2aa90e410751b04f7f0469b1de2b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RLUPHEH6%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033418Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQChnH21jBt84HdxXEs8NmMUMFP3YPh3mx2De6y5pW0zWAIgd362igvYTHps1tm%2B36PP1zgQ5Clh%2B2jeUZrQhHadqRYq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDKTHmmHkuda4pOL2%2FSrcAxowZYEtTEUCTbIniP4FiCuM1lZHWDHhucxZcuCsqrlQN3Er8in0VtfKg%2B%2BP85cInZWNl8lsKih85NM9g2P4A7GaZ4be9dHg50Ps7TN5j7H69H29LJvFGyIAHIeSwADObdXzySJDnRYRRngBczn33aHwsyPh%2F%2FFWAX%2Bn9OdnET9jv%2FEDlcE7fB35zyBN8l%2BLRONloeD55BzGc0N2W%2B9A2Kqy4AQpOQPyq54eDlPryXzA%2FhZxrSEry8Zb0WGbagnL2lglWrkcR%2B9yj3J23334Wr%2BRLLv0KDDzy6o5pngX4805TFtFoVa%2B86r%2BguvhznWcxsNL1bXAlbzWFIVQ4UxvuFJzLmhsHLAphIKEUHLqlYYkK6zgm%2FMvqyR4rUbVDXTOsYU3SPeXkUA3VK3NNm%2BT9HtDEZzHQzCX1Q2DpmP7MdbXarig8XAtKzfUfYuFi1nwtZFt5LuEc0Xd%2FpA3Gehg8MGzMxUInfl8%2B237fg545rNkaRVkK6SxywvSYzempH5INPEwrAhkEhzJpRlSBy%2F5t59iTJe8QNfaNtVBUj6MGMm6YiohKKOJHeesbEV7L8%2FNC6G72SHMPXdN4qGo5qhmDd2oorRmVDCeRsBVA%2BOPlqqrLfdADCez9Yz6iRW4MJ7qn8wGOqUBGxbMNeqbM7Sq9Hc230DnTJcE5874fv5Pdwd9x9FHLwNG3UvHMnT458jizpaUlAEawRA4YXqGa%2F1skRcWJIgUFc6r8IfNTGYOROafSzAaKsCRnPJUzEddcjcZOyAfDCRPxYBMU0F%2FRQTBmjelN6S0HsuNGlt4utSh9pX%2BAnaYgqu4eSP27xqDJDLlqVp6ccE1Uo7%2BMwt3N1euLTD3Q9z5qN3MaEw9&X-Amz-Signature=2bfe69b94a48f94e5590dff3c5c72bd17835fd7704452cc2d0b179aae5fec4f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QAN3U7JF%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHB%2BuiUUw4lqqAgwfApQt0kChNjz2f8iHeejsGUcZFxyAiEA4ogyaO9lFadigcL7cX1Dq5ev4JPhKJR8x7s8tMm5tpkq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDA6cfLxjUNWdARZscircAxjpAA0iorZrAvHDV8TGAYVj9XZIIVOeD4MbY0iGzMIXxDQADsvylFV8S02mvTJPZn6lJA7RvozL1z%2FrC9p6P3zICOT96RHkv%2BW8WMsajYLI6T%2BIwVCs7vogwsltT1TBqgpyKAUyQOskLUbvuGDB4%2B5oodIzmqD%2B%2FbA5CYnAgJRpSY8p1acS7DtME%2BaRTutSXlnz5aaFmOr19I6YtCmsSB9HffmJSs4haypF12NEw2gnCqwSmRkkak3qJ7X5TqUJnQQqxhSmnAms1eqAFmxd3XUhqbdy0n8LRRsd3sIgByopXFl39TJLGzFMWns8hXoQp3l%2BqyLdT0putj5%2FI7PDQT3oaZpFc1N2zfNUx7Df8VvYV1VFJMOdG3h%2FfYoKeUHhou85xvkArl9zFlA1pxIom%2B5%2BeDt6wcV%2FD9HAHiDCZB54aEUVq7ynId9EyCQjngQdHkEtUdo%2B77Erm0WSTrsukm4LHUn5EJu57jQD7QqIkFYNh%2FEuHVjb2edXnHw2hFZh723NxKI5RBkHEyLgp2ijlRggHs2mz8MzS5AwCIZniSHTdzxfIanUZiYUmga8K%2Bnu%2FmAFkDKefs8KpEGw67ExGz0eWp4rl3j75puoK367nIt4UsI7glXPryoJrX1%2BMP%2Fpn8wGOqUB%2FuQd7Do61HL8nL8j%2FYviFYXXaIUglQZ52Od%2F9hlEOjYoKq1Ivo4k8I4z%2FL87z8XDQV34MsoAnb1UC0IqPz0rixFi1j47rngVltq5WfP6a7s2Bs0o53uL9l1pq%2BowHe%2BzQQ95V1MlGOmGq87iQyr0VhdAZAHDykGMuDNiWMCkoX0BGrfY6dRfackYucNDuGHvxkF%2F3r3nS6YlUYQ%2FHgOwri8T9u0J&X-Amz-Signature=2e4cf8c94b477fa9a1ad22b1e74cb97bc7199cdaa21b8295d09a58773a37ec6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHE2UNTU%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDSCcaNOPY1YeB55SQqwgX5PRp4fZd6ijhSIAKW53FS9AIgCQFCZkecDRMVkvMoRSvVlqLZ1B3gUtsobQYcpBva9Xoq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDCYYVnxXKB2HdXYjKCrcAyff0GN8cG%2BqeoB402aCH%2BdXGMZwYY8H8MksPutkfSjMiXRynbW84KKH%2BzNbwddTJQ2q%2FSBmKrryg7JJbeSoSIfBykkg9t5Coxb1RQpb715aGMcftrR1j3BsOSH7ytkeHfBmDgqstFYEySj0n%2FXMUflOqQarLE4m58DWNCb4bkWqxCGzLe2jqsQGDeik7AlVmUTAtbSFgPTd%2BAv0%2F%2FHMhDDROb9N1EMweGbBDiv2RGklwWpLSh7zZsymKn0nzkjZZsluwcTtZ2eG%2FC5iYW%2FzOywes1AULlaP%2FQXdbtnVSaO87lKiImNQQbZieusQUn6KB6Ld3AD%2Bl%2BUBGJ%2F0OItAnNNdQYFaUGIF3rITfpkr2Y2jkoJ6aGlEYWWtKsRqZAOc%2BogT%2FNxaFWdqtaDPAofRdmNkKLMWyacOCQvVSLoe4%2B5%2BI5LAalelu6%2BO2yBKJ69blsHI1p8svJVyQW%2BOye7ur%2BCbWqnEw8okW0jQhWqk9Z7Uimx8KfXfgnhBzdB2JEEtuYORS0LXctBn1iyI9MrPENwkFokjetbqwGXoz7NcjDVs0Bra0k7qCjDtycXHRdoq4JYmC0NIm5Aist%2FE1mNubNw%2FAdYM57wMlbc46NKH1M0l%2FWFsCXfh1F8fHVNoMLTqn8wGOqUBwZYgOTHV0NzqnJanliTUe87udaPxtjC3Vw28vZHYul3VuGxOEutyh9ZNvzJrHFVGdBe67WRXn6pY8oTZH4kTOrGYZlMWVB8Z48hi1OonMhSBdLJivwVgMJ8f3UZp1JYAH7O95r6ZCOkweN7rKc7k%2BehWhlevHaPsZY3Dx7UZIqbEFc1UY5TCQuxjFp%2FYY6j3%2F9epkHVO5yYRZvmoGygthhn0IbCX&X-Amz-Signature=1b84d6a86ed451f4ed354f394edb1091dbb67c811ab981bb26bfe38b927437bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W7CYGSML%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033421Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCWjaiZrgOUPKelItNeK0u3Azo3BQVtl9yrJ6zaIuIeXwIhAIWGkqSxexO14pJB59NVTZqPg4Dj4Q9ULzDuDB0NYjxvKv8DCGwQABoMNjM3NDIzMTgzODA1IgxE%2Fowhhq4Bv7Q770Qq3APQpqc%2FUBxMtCcVXncJIaGoSSUgDI9FYthb3dxbMReB%2F4wjnrl%2BQl5ACcua0vnf%2BbMCkPGDz4RXpHbLaX8rnM7GFBD0UCsnvArfS7sg4BsmaOgwydAAUk41OFP%2BjQqTBWAUVftau4uSBUBfdIdB5M8bC8IHjMGuQuc7azIYaTbnem8PVCtwur3L5cbIG4N19a8PTLEMNQqBPr4M58rEyH235mvGfV3y00srMaxDcwfZaAbqwstxSLzThp6F119IQlCEgtKV3nG4ZTTJupxoon8%2BZS1KOYL0xb1h%2Bd9B%2Bg7C5luIMPw4fagayPDG05KuwrJSXQi4Sgp0q1nij5Wt0wMCM%2BW8caDKWaA6EE6mE5gL340YddDG1Zwx6xvOovOPqBfhzEKRW%2FMGK77zUXqmk27cGGqABZzZWB121R3SIxcktEUyQBvkP9%2B7rTTmlCYdBFjW2xrmcQdYaBLeR9d5TsxjMIOHHhIGmiSZYZw6EuM9X7wGZdPvwhnqFYIDWxGKSndsTf%2BOuL%2BpJY9ZPWzqkypELJ%2BkktleBYpM3ckgIfTYGayURdbzcMgkpATIhiNESK4e%2BwanGSjkTX9iZXeO9qTALNifkZhKiL7uyNCxtAxXIln%2FiDzrI%2FWuUeWW4DCP6p%2FMBjqkAfr%2B7neLgEmt1h075BevGZd0xPeHgvCV2kY4QyKwcfAENOflTzplCkfi%2FKnRlKt%2BZFX7ts%2BHyJm9Ov%2FFTyfe9oIY3Rp4ehlumd0rvwYmXdtpP8NvQ0TAFLAPXRildcoPuHLLGZ%2FwMgQUvY0heYWALdyGjhyzrNhPF5yejYDlx6MnBCEd28y91OiXEHg8OF47%2BT0vEm%2BGVoRci%2BzHoelWjtsSqOtU&X-Amz-Signature=ae46388622e51ed3740ba13d7a82ba10226cb179e9142aea0905784e383ad433&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=37fa9acac8c77d68ee1b24299a982501e9e4e7e95b8f0b8b4ab08e050cbd46af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HK7TG2%2F20260208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260208T033348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW8EVBZV2GIvVnvykbxi7HBtIiFvDM3H4cevTLyz3O4gIhAOUwMRZDqetrHX5F5IEwZs2PAUtPqn7PJQlB%2BTtVotxzKv8DCGwQABoMNjM3NDIzMTgzODA1IgwBTAKYThX8EMTVNF8q3AP1nwW7tyT2%2BJSpm9A1wUaFQ9E8ASuGWcPyM8mcH6VsLqPKI40iMmHrc70p2CBPbCxCTk%2F6qll%2FUStjxTxs5q3BIEJqysc%2BfJJ2sbOps%2B6SCJOuCiZsm0ZDwQHZQ0%2B0tQ5icV%2B2k4EGEgfU7A1x5xWoooF1KCTZs7uePAk8D2UH3TlPyxzs9%2FhHr18kmoudEeZC%2B40y%2BDHLMcok6SMfMciLxumoBFoHesd%2FqlOVBEcR8JySONG3WjjCQVKxAAD0%2F16dULadotGHX4SLpnz60ifXRcpWFsg295MVtugnjIX9UjzTmWX4d2qq2PsAcLl%2FlPxP9pjn%2FYr%2B5vUdbfpMcCms31jhtopHBoiLOwzSFijQBBypJkQH21CTucOzIY6a%2B5qxnjIzuh%2ByBrOvGNDYA8uClHv23PaiJt6DXND1hufxDGQX9pIYWQIdoFQ%2F7%2FiFaiNuk0MXZBKebeS9NzryoQqeXSGefDpi8w3e9yLgFByP5yihxCFuMRgLxHFeQB10UE06TlD9GlOAeXtkSUVDc%2BVtMtP6pFlwM50E0BXgCLbtnLnbOVC7fcEf%2FDgaFgT%2BtQNmmOqB1Exa6bzePjesaFO6VzOyQPYtcuYELuH5NA0dbD1Ojzg7T%2FYc7J6RxTCN65%2FMBjqkAfWqiUGIUYX5uVfgN7b8vndFh%2Br9Qh8qsW6%2FUE8Ncdwjj78ArC2IwXi%2FSLvgRCgBBwGWe80ypEtzmjNw2UOifLLQdlUc8DIJlr7dSHXrtSfiS2WqjB%2FFAXx79HGUI1hoH32UpNnumM1NO6y7sNqQ8VxPusRTwtSYinwkL5Iuc9r5WUC1zDFEjz31ajf5zQT6%2BywURY3KE5eBlt7WQeaP8%2BMThiR%2F&X-Amz-Signature=f687b433e718f87298839f6061e6bfc4fc412ffd8c6de87d75ec85442a19771a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

