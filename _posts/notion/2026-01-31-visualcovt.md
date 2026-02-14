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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=74a8b51feea888e13ac25e7a266b70a7c9ca19b3eedbafefdc3f45f0d9997c1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=665c480ea237c72d243ac739f6e6d6f07a382e5caf8bd556fc32f611c4baab81&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=532220508eb111a8bc06bb34c468ee3abf68ed5dfdb212fdbffc07b4c377bc19&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=50d737143256aa2f27bc38cbf581231afd9835175af097ae625b9eb2e21fc197&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666XH5HMKX%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025202Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIGvlM0mlbIOf32GA2KOwDEry%2FJu4Gc7U%2FyVK19p8R85cAiEAzU7yWmtBDXCMYRGexuhTdA%2Fe3lLYiwXpWEPv20itbosqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDESOqs2v4jmHQpliayrcA1w9zIef8ykU5Vwgf7FcCI6vH76WkwZGXv7V0HQG38%2BKfa%2Fun%2BXgQxAaFzy65m1qcU0piQP6Pk2w6uIaP4VXfzrvYAkHyxEuWGTW3UA8683hQPWbfT0BKH5hdKQJHNftj0s2SppaGw5BiD5wof0jyxkOIo%2B4Xyb7HPREJkjLgZB4fz2EeRTt5LF%2BM%2FmZOwKjrhyYkOdMOI1NnRriH7n0YIsY6aeRBXRPmfqtcONBQEhggqJQGPs%2BlEyFShBkHBEV3qncibMDFF1D8HfPF%2FfedqXlI%2FMsXhakN92dccBeRALutHUb5Y9yOqhMYkDKRZhz0d%2BHjK0564ueX2rCO4VewV1%2FfHKsoBmuYVZoMUO3l6H2%2FmFtXbtmdR0d%2BgjsnLHnJZPk1yq6aDYeiITNYM9Q4f4%2FZiT%2FjoCJy%2Flmd%2B9Ih07UF7zzHNb3vKGgd7OFecklsyTfS0Z4QnWjnGYkhs9euBXbyHIMSwr0PEShDVs1k9y2Gj63OJommOMlYUAMNu%2F86bb5B%2Bk%2BwNJcC2KZwmHSG%2F10fQpHnZ%2FKwkrabKy7RchFWKNiSlsUha2HwTOfIe4mBQBuLwAn%2BfZbTGpmc4fYKFumrtED68DSFmPjlRfUug3Qx8geE5VP%2FHF289DpMJnAv8wGOqUB0yKTXKysDsgGAwJKTjyTaQLwjGluOSjYRjg%2B%2BkdeDugBuaovCYGcKgNceTQFnaCaQB5zEREjCjh9WdVPDLkU1PcMjUEMjZsz1Bysd9b2hoah7DkBo%2B52iZz29Zixn%2Fc1tMJMfdtbTe3Ipp1InvdEJ5j0t3QA6EAAMtaYoy%2BSr6Zsl33Cl0YHUIPN5RBeN2BMU3t7Q5ptVKrOcIvQbwk0Yn%2FmE2xR&X-Amz-Signature=bb8d479703a7379b913ea720205134ff9e9990da218fe2ff818629fc4ae2f2f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YD5QFDV3%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025213Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIA%2FVTbO%2B%2BSKAMPkqqYNBlxudn4erZYrH37ialCMIMb4sAiBBZ2cvcrUbOPE1HuZBlAluOG8Jep7M0d2PRBiz%2F0JSMyqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZIHQk%2BpKYuHGqYBgKtwDDtCPaEx0dJbOM%2BXGK9woUCBULtvCF%2FhUSlXCftrNWiWXcX5cYLbc5v0hS0GeN%2B4I8uH%2BrJcd16%2BqzOtX5qb6rbJPxTQ8vABbrOqgGt2N4foStJyNHMpQ9MIfwwhmGuzMRGXWFdCN5dhuWDx5V0GZlHCRn1X8Ec9pJD85h9%2BqbDrr%2FDdl4EmrzbaqdKWToQLRJ4OTHIEBk%2BLM3GqW%2FOfeOdZX62URto1rsK9PbVTDaMC0VAJVFNF1RRJbCZ19xRPe1uFdG6reCnEe3Wd%2Be9IEU5Z4mt3gQA1jNEvY%2FcNTyGKk3wxLsgRmSJ%2B%2B2tlimSretfCoVSvm6mR%2FqPSdC7GY9BZ%2FkSorm20%2BosB7BVirm1BKCgn1WYCMxG6UxZVBZiL5dBfQheRDQzDcWQCexUSEV7EzqOACCdMpjcrdPVQjQrJqIuUWmXQ5c22QIsSo0YE8i%2FVpMRkFlIxxVH3hPS3Sn6%2BNTYxNysyKyg4IfiTZwBLXKxJz%2Fk1015wng%2B%2BTlisfe2ufnwZaFvVfRu8uR0025XQtOJHt5jR2k32Y0FseSGDYCP0t5L0LuBLZqdJdLNQvH4FMgelwpr74k%2B4o%2FZngqC295evT0%2Bj19Gfktq5Tud1Q65ySixSaGUUbI0YwycC%2FzAY6pgEOnFRs2vZDVY3Ai9uWhkamCAhIdaZhamp2AXuu7yEx8SKA3m%2BCOQowsU46rU7drRTYB%2FSfViJ3NQbnAPIkeesO5N%2Fc1wk5FInN8AYQxM%2FQsYXhyH3di%2BdJ0O8EAaugW7MCtiZ%2Bo3BbRno5FHqRqK5wxwGEJS7EmKnJ62kzt9I8frrGOrRMcHyRMCTpby06ITawApmEjCX5l%2B3UJHz%2FFpy%2B%2Fxu%2FqRyQ&X-Amz-Signature=4e48246035bbb8c2d742427ad410df1f332a24513d4959525bac4bb601edbe9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U2KYDLMM%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025216Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJIMEYCIQDZQ7wanTx6ISMbA%2BCy73xJQHNjCdDmXyhgS4WAEZc68AIhAIhtQKf5h%2F1KsH%2BEW2OnNtxbvp5PMiaVPGUQFfgaZeqTKogECPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEsRF9J7%2Bn6g3xOB0q3APMaM4lDCOc8IB7Z8AESptqiESPfx4sOw7Mfd77UZHQPIux1bpgAkod%2BN8kQAt%2FzsjLd%2FQzW5xnCWx0V92F1OTsazJvz5zi0%2B7VcAVng8mX%2BKAaxm15qeFsMNFc4%2B36eOom3AaNJBXxaeg%2ByopTF85PjPlRFO19Sb7TAYgptNwCqJ9KnFxa7IR87XBOkvS78%2F9usMf2rjBNyrB%2FJ6BccbTOSeZjOX07Cb7ErOFAyTNqeR%2FgRIRZSOHhmTJ9Jh4zvnjqNjh5%2FNiL4wMcKxe5wr%2FXVqv9pM9ia34jHqbPlEqja%2Flrm%2FEIhFNsVtXogfwjrILjA2bB%2BmU090r0bqhOplca7k%2Fqn5LbKkkDGL6QmhuKS9MVqITRvEya020pWR%2FRNWHTkl3QWEDj2jUfQlimdZjKLOLrnYi9LWdQQx4lW3TrHqak9LDFxONtUnAyfm7W8Xp0L1ySMTf7b4dMU32CysaJIqAV1%2Fquu4c%2BVcROGeFbZJOhl6BhvVSrf%2Fy2yhhV6gcNfkuxyY2Y9yTps6wjBxd3rIqEqh99rcrBnZZErtp2MHji3%2FL%2FIQVNzTsVbOVpwsbKGxxgM9dATx8mOI9ITQAkM286DAw4%2F6vYuaf8HBrsOgdoQ%2BJvCISEfEMJ%2FjDXwL%2FMBjqkAfSIpsbUBro%2FpYji%2F3Nin%2BiEKnhKlTMqtBUIeb2NuX0AVHNkgGyYIjSCo208izlKPfxWIWfgMr7%2BNmJl3fUKt6z%2BsGJ%2FTc7XalMdIOjf4%2F77BkQnmBzqnGE06myPEuSOl9VvgftwtyTepzGJoYDMg9lFDmkOOiBlUOEMMLdy%2BYHrlN8PExWEBKuGoqB2O5trYktaMcvo%2BzMBO%2BEof6dHi%2FU3w5rm&X-Amz-Signature=807f1c6ce23a6dc7d783d5b355450b1e3f07e0f8fdfdef5dc6b117b979e3ca0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HXQVFPD%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025217Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIGQdWrCLbGJpUhjy46NeBx%2BymKZBsthJz2df4Vl8stZ0AiAc95%2FTXjJfNU3OctySYacaQhRfByFUU7xi1qfmMHE5qCqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMgzsQen9ubMWh4phZKtwDYiyjqrAvJ8K00W7J8ePllysRywsk%2Buj5Q0V25fQVpUOavYSi0mDRn50rkrvLnZhikO63zo5GFLAs08kYP5%2Fv6RtEHX4rtrlV%2B58PKi67BHo2hNyvJy8dxVPMERtK1La1AVDdtgU2gUF6ol%2FETeQ2HfB55dX8PI7aRMuY2R1G63EqFiOspM2SPWXv3%2FqoyNQ1WlFN0X22YxAyx9L3h4evXzDOoiByRchUj6HhGUXC%2BJdB45PoEC8lbdbPZHePeJF2QXb%2FUeQr3iKVgIFImDAc%2FWryAfyiz1CvfqShtetzadQTs1dSYLlIvMCJagUwMUMpdUkAoRDdIyU3Min8bmxSIvSF4bna6otTwibTbMCllRLlaQzQvBwVU18PEqIsWWrES5I76uyTiOgQT6n0kOcFW%2BfCcq3376l6du%2BYVPnYYdKnne5YESYoA%2FGQ7uhzJxYTOH9O%2BvphyDGGz%2FxMTFlEHS4Wd7VPqpwexfhqcQDaLByHUoc92SxHidzWfhn0OoZTvNj9VLb8PJOIFvd0w11FbMFws3cuV3%2B68D9hXqYp2E1yvoyUBSztfB%2FpUVKdxfNlLIHEHe99VdgHJBDWZs54viL9fNqNZH2ExT3l15M4wMWDjZqaqnR5Sj3ERy8whcG%2FzAY6pgGB%2BvcEGJxioZdw%2BUsyaA%2BUTxrEmeiM%2FSIGXkFCIukEP6aU4fDwsrGMzaIBzVArvRIdasac9mtWSWQ6cLpm7qybOjh9VNDrTO9ITsRmt3oGXut8RKoQTWu4nO5Q4lCgiU9qERfZHmUk8CfKQ4EuGMvQqppGZEgyWzhEBae8e0HNldTJFY2%2FDSmnLotMUaqORCP5D%2FyJtK8JYMkiBIfDO2Aqds5640rj&X-Amz-Signature=8bab5632360045618d6f5a2b9e12904bf3bfe31d7e5cf16182510992c0e8405f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=a53a2fb258cbfa07a6d964063a036618f559a38c05274f5dca254c2b37933b75&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=efc3ab97bada1e7a36e27e4f5f6a2011dba87f55c1b5cc508b779e4927c0d13a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBMK6EXE%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIAhePSaAGihbVhuSjgdYRLNP%2BlzzGK2aEaa4wQf%2BWMfkAiBUOXMmv2SFB%2F5XAASFraPPgeLcucbbj6%2FuIjl2tc5uOyqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM9Jv166FueiMED%2Bv2KtwD8oozPTUcRMXuIjj%2FQZofQ4leBPdSe6sBBebxyEX34K3DgX3mof2RLV21hMkW0o1uEG48OhOo678%2B%2FB7DmXcKEhtyllCQbdgMkK1fz%2BeT41fg0qJOoUHpWUuFtCG%2B51KOV4QLRJgWxn65co%2B1EzicVbKzAxzs6xRnO%2Fq%2F5nB7a86%2F3xS%2FF1zp3OmfDOEvfxW3XzLXNgLuyGRF%2F9omrTptu40Kk%2BuX0gcZVrNJKYtR%2BlmOyEAxSHLCPDLC%2B0Y8QH4WmBIRT4CQg2J6VPdBxCrB7WiFRijChnPE%2B8wUaJHZqAZ%2BzmybzRs6Ht2bx1xw5kTbiaKIahYUx9PgdUPFWrQ1BTTQNVyXqeNcyi%2FxqFjphCBQAs7toSC%2BvWREUprI1xhMla3%2FzNTSzzdPA3hgPBoULApM3wVlbhxr18911Wk%2FT%2BfjQayUNQfuaYpWrf7uyStcTUoj1fM7qg6%2FaLjWTKHs8fjFBBJQwCwlTPulpUrn053XM2hOqPf62FxamzlYpKJN0PaIpbbmmqtp5DUSBGbUHAmyBXQIkHFbqQP4Nqyj3K%2F6Sc6RcRxc96wiON%2BHB%2FMrm0GjJTLKzsVcN%2BOnbpYIb3c0yy0PSUuDFuvDAOUMcY8wnzjc7u2riZK%2Bbecw%2B8C%2FzAY6pgGhrORXxDewKVgTezgOIn02DkNSGB411YmLpvdIQZqr8EaGR6jPMB5YG72ogteRcBVlpU2RgDmKf2a0HFkOBbG2kt5YGNJfiDu1sRAF%2FXckHFK%2BsI5bUN2n3jg%2FGt2gWIWkwKITWhsOtgCDIu47rLKnKx%2BEbkQN5zyb1kC0C%2FeToRqgPe%2BxGB8QpvjiiO8%2FW4nJLNIFisax24Ixk6JAdZhWoW74akEy&X-Amz-Signature=6f705d226fce576489332afee6e646dce35881a459dfba9cdfcbbb845462c46f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=374ed359d3e4be3fc0c3638cc7e6b873500dc202bc99957a6562d6aa11d60a2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TFMGCVVY%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQDIZJcQ7%2FyLQ%2F45fJZRYoQA3%2F60R2f0U5RmnLeTejH3XAIgexqoSty191h7vNGEm2SpyZoYI%2By6FLBjHsu8SVju7AcqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIEHwPA5Y4KOpJo5hyrcA1%2BZXIJ1vlqjF31G%2Br%2BVDy8CBcdZgJiz1dMDLYV%2Ba6x60aub%2FL7DoU05E94No4fT4wGk1%2BV5cXbDgukB1%2FNAI88u%2BFbZ17IZOS6zwXInEQAfaTKhBEbOe0g35tUA7L9a9Mldt3JWPwdrahYCRcDSXil9MIpnc7tjcZ8qwfG3CckwkRLop4wFjM5cHj5lFfcaUwhNX0%2FczVnQlnxPXppGiolsG7pATpWWb8YkJTOxkLX%2FscW8Ja7qAxux6BkU9b8FseWBXDgodjqT85N0oCFB1X6IdkuQAmEQyCrZDR4pIAQC%2F9g0l4HNnJtVjQfCR%2BVLkuS8arhVO91iAc2rOmcmJndwmhILEjaTVAILm6e3zfIKS1%2B2otyIouuflBMkcuTzoeDyGc3DuLfIEqpw6VPZ78g0EWYYNpRvgcwOvLUODr8D1Ix7m3QCPw5ERx261RaO0Aam78kwnS17DiRTQ%2FuZR1geyJAQpFnhrumxdJrUFViDkTlwtzstIxkh0nud86kwxviksGtvMoPFG2FXwAdUg4OyzKfrvgsPZ4rqWasuERpwJvKDTKqcNDqEAz4zSiPB%2BQU6M3ERlwodPixEWHUDrfgsgby6Xd8tcqeMt6z06LKEQjEc%2BCREbKWmlUE1MMXAv8wGOqUB%2FoXrqDadUC4rOQ7cjNnpseqPuCWWSX68N%2Bnc4u8K51Vi1DHYUPEmzQEUA%2BuKVPJ8uRT0h04Ts7oXyKSiHb8hdKANzBOg5qJRM4PAoFP1ePAkqtSP0oDlZjdT%2BfsWqmh5fejJuXfYkW%2BP9kNqOBNDDNKWiFdbTCXiF8k55jhktE8AAoaYQ7qswWCoIdCIcUfdGq%2BvQ%2F6xMLQISCofopEkzabBX6V6&X-Amz-Signature=3b78a05696eafbb36e282ff1131e11f15979a2409d5eb857a64c9616b6220c11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664BCERIET%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIEL9JjajJ8BHMMGJwFwvQ0gvR%2Bkkk4sXIZVfQ1poK5gYAiAhN4b5aASw4ScMQWwHF70CfVLUXcIxj0MuC8x1%2BPFcbSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMz6Fwsqq4B02036%2F%2BKtwDUoh7FRnT6OOy0jBLbeMgp%2BuQ7MX1qfo2h%2B4wMIysWTcFY4wUCp4pZPPYHDsS8ufgxoFwIsThpsK3YQLPloUVCsOkIKDrjD7UCHlPPLfAZngpFQ2Fg3u91JqFpbc5%2Bk3vNSzOPyiIODze%2FAI6PSUTzN0sIJX8jlrwRFNYtyEPWB4qjd%2BT8PIuV570AswlsOWWjjLPGSOWstsF2mpj53wx5MhPFIV92rrmgtBUk39VkYxbN5%2BdXKM1cxTGxskQgNfrL54DHRryfyfJAmkdBxpO6ykdG4DH0jxdDb%2BrNK%2BwefCz0%2FVMF4aIG2ZgYWGNk%2FkfeOWkTi7zADUzjIr0RliEeTnu0FyfKCSDQIhMekL8jtgSMcvbAWkCAqqbNXXMM20YoVeA34MMSPzKq%2FZplIGKl6X4%2B3TsuB8WNKL3LzcQVNElTPaEEU0sN2NhYJt13V9qVQelOIYDmNfPQvZd%2BaUUogX5CPne5UXASLIFOV5upMlg4yh9puS8Tc6in5Od2mpN6Y64f7ZXwq2DZB5Ip2r8Y%2F7e47SbngugBJt8JY2PYE52GcfyhdDbMygUY0s51lKbYAhdkSw21ohU62DA8F27wSt3%2BBHiPwPuVjXNerBtWtx7sk8GQVUM03IP%2FswwvcC%2FzAY6pgHgM4ND6n2P7rhRQ%2FJqWq0LiT1pvzk9C%2BQWbA3fMS1XYFq6d9p%2B%2Bu4LnltAUHt1aAuvwKKyPFx4Z8KdRJzLmNvLtPuMZmKg0yezlWvJsSH0k36tLqo%2F2HDSbzFV7aRQML6TCzNW21HfzgxkcGq2UFnkcRrQ%2BTj3X23uY1vRug7Ghu9z48Q%2B0qVw1imbSQyL3rcwe8A5VfrDuMArRgYdi0bgIHIft1GK&X-Amz-Signature=7c24bcd3f8589e60c501a9f23339185540f3c2e65d8fbb29e77f9d8e3c328336&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TTLWBZJG%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025232Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIG7eDsEMnHm55CPHCNc1Op9Tn5LkkMZ4tYnkk7Gs0wP1AiEA3DIU79HLDzFY259cQHxzUi7KcBwRWrs7yUz%2FUdqqNusqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM24cRbzahtXanGQEyrcA%2BH7mg4DEvGirUFeWSwk5gZ1yT%2FrvMOuvDOH5kKyWaHd3ZTCCADVQN3rRSt%2BrYzPwn5%2BBm77j7aSiC4%2FtVlT9EyGkpcoZF%2BuNzLozL8Y8GKaL5dcFZIoxGVEeQ%2BRmhw2OmqCt3xa0FwVWk7qlLf%2Fhxmh8%2Bp304Az2vuSofxNllaTi%2FVaJGG9y%2FUSSTmz9TqEe67s%2BIFQJffRmUD1mXiSNCpGqNQkM1runFcte5cKDMyJox1qmWcTIpU6TfLVFvHuNPI%2F3JZN%2F9DEbHVTWvnSSKMxv%2Fzq2UUsxihEZgeJ2VwJYsOjV5VfjEImzYwybfygMZIWF2qGEtD5VAqYbf7QNDJqAV%2Bt8HZ7d65SVXUTyMYyIrz5Jjoxw7hdpbtwJCdJuQK%2F%2FOJWbeXEvdLq6WEHSWNdhdzVsCV827Zn2vH9Y%2Bd3Wh8kCrh2QXiGfw6hF27y7OPYKljh3H%2BGR%2Fzza2yYRmeiGJE%2BTE2ZgRdAmhm6PauH0MP89%2BNzeZMoCsIQaaI8fVpP1aaWbf1yErtLMsFDVIjGCofZerhGz5i5vQwtHGdFhGYOShH89Np8FeQsJZevPAzVK1G6Cbk1W1ILL0PYbB2iEHgEuft3V1JTg3f96NDkrSEjCRbSm%2FRRH%2BjoMKHBv8wGOqUBwCDEvbKs3hWqdQlTxg1iRWV55dm0CUZqh0IDyjq5QdbHjim9670LmHgjq9gicnoxJ2S2x39LOyFaNOs8MDiibvB8yYekuZTxCrvPITYNPSokLjiHUpPrf2Wu6CxBnqlRGpHeIe6vOda8RcVdPl6JNCfkU%2BMZo%2BNBrmdS4OzmeyY6SNcf%2BOHFhGerj9woC2F%2BT%2B8x1Ik1NUfxuNGjiqaMIti7cgnB&X-Amz-Signature=8c97b65aea8083da2dae942ee3fc3d0cb34746592600cb63c3edf706ddf554a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466452ZBV7W%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIEBzAuXV21Gf5ry1rlD5i8vTQ1zHNUNWBIbVtm0w7B2ZAiEA%2BU96t1AaEeZsApaWDmAw%2BL2CUQ8i9mkGEzxyaWAROYUqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMJu4pLd78x7%2BwqinSrcA2xZ3ITe9seYodpvqOL9Y2z%2FQuQgSk7KHioLd4vF8I128ixdfsuBVUwZPfRVdXfItA%2BUtGALL9HYdcTvtdEySojjY6DBcm6pvCmfcxI6wUPw0IvQCRIZIjzzF4E%2Fdf2lUFkNkBeedHG94WwrHROhBoUDPRc4Dbjiov9cplTUx04i4iMwYtEIYzmFDPhpRGaSMhyhT4TO7LIiUQ1uMMWJyCYTAXbkM8AIl3g0n1mvnicj4h63QD1hv%2FRp3w0nDjDXTKCA%2BUXcff2fwhnhpYMkEeGLm%2B8UrKsKKL6v6DZHsiRtYWFwRqw5%2F6hwJtXG0pumxHzRC76MzEkW3s6cjgF9CsbHiF%2F3FIfJytN%2FwSyeaNkxRnh5wiaHwLV2OW5C1VJqQ6rfnaVOBQYv8nO%2B0BEiQ%2FU3IZgc%2FTJI%2FI7SWg7Ah7cPaxTk5xtcBruO%2F6QkKkEZNYYgTXG5pTPmvP2OfLWFjwZuNrr94Qb9zU8XdxaGugHFWReAz7X9NnyoVfhhoJN3av8WeKphpDZlrPBWXAkAAouK92yUTnIEWTxnrwlkj5%2FrNoQp8WXCOfXd%2FdOCd7XQkcZEH5BnCslA9QtIUbZjKPHOBnvkQXoUpHsgwcIOhg2vL%2FwsuN2w1gJPWHyrMO3Av8wGOqUBguM6gS6EBz3zBb5irX%2Bd%2FkqKaaED4AC2kNhCztfYerrl%2FAQMknhR9YKERZwzNMUKuB7IZv1q12B1SnUpjaeImx%2F%2FsEbYK7kx7EGSIQBQR89DLP2UQlV9W9o8JOatM1%2Fq66zgzxUbqAl1eo%2FPl0TrqSjwr6RkMl4Kl9BvMXTgWPuumod45LqmNavHbBDPrSNTG7dGce1CigMwCEV6NyWKP3ou5xm%2F&X-Amz-Signature=674cd4bc1cfbb036c280a87f08aeb30ad43c0a22eedc3e6cafb236189adac4fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=a718811a9a78f08d6f829fe611d61430f8e153e93ce54fccc559d89a5b51d1e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDSGPCFZ%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIH7%2FRbQkMkA0N2Yym0e%2BUsPi3J9aGl3HvXhMyUIywcVyAiBWqnUJ9oz%2BnH64sTa%2FsxaauIJ7dW1PqTikUL3JFNOGUSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMDaU8COn8EmFC%2BstKKtwDdd6DM50qV9CurRBaX2pjgcWGXD4zqbcK%2FYw2AWHKKFxcj%2BEt%2Fo%2FmLfHF5jHWQr%2BKRnu9c7vIuyrsYS4l2fbES86OOKV%2BvOWd59v9kC8VF2aZiOM5%2B2Bsx%2BrMhbPJOSPlXPpcCK0dR%2Fy41JpShqUg4%2FmPzFNZDQ3nvgSZF86%2FNbQOIKEN135a%2BuqiUs2AiZi1YCYCaPf%2BBAxtHaWbstZvi%2BoLLJGs3HGbGZSPrBug1dEf7vljcc49XgwEvdynda7avUNBZzZJoQD2zN3WD%2F4A1Bys3Ljtb4Hysc7WVHDtFN5veG%2FOXhK7xB0rXQ9HnjhGKg5sju0Vu20a9BYPJ9f63f0%2FCogV%2BVt0THIoaBlVEfDXF5uTYTZxMeKSlMAojHenglsHVNr%2B4v81fFrz%2BUZfFoJ5I2zSD3u25b5vimrgSovUB%2Bj2jw7tZCRdF%2B7YlOmESRXncsc617XlecxKMDEufAMbxQRbqHXJqIeXgjx6EEZyngz%2FluioNuG1xB7L6kWMyO0R59X7jbLOa%2F42bTG%2BA5tLuEnhPFdw9tqr5%2FbBFz0mWAuko4b4H2SSXwuZJ7vAFZozjechQoc92J9WScE1zHgAUPZ9RktcezkQYx5n8Cc7Nyr8i2%2FOsBA7NeIwu8C%2FzAY6pgHCyadWQW39SsE8j6KME%2FHdj6Xrx7CMFNg5LikYGeXBTdRbv22GqyXcYFh5N9bWaMhje0hlRX8OFbZMRijFPQ%2BljbN4HbUabNREuroLgQKY4BTUggzfOCM9YbnZN5w0jL7D3kt3JQ4CDi8P6rifTf6MxP7KIPkkI%2Fcsyn4vcZaOUNzsGP5jbslX53FfT%2BDDOG3lxO5JjouNTRTN0zy9thhTu9JHDxJu&X-Amz-Signature=16db86b2d354b09dd8ff4cc0fd295053039a52c89e124c02d40da57582048811&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

