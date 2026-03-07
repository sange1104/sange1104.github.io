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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=b44b4eef3a2b1f3a10eec85f236cbab9de7829b0f5a75844eecefabebf1dae49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=69a2e4dd1c1ddb7136be2bfbedb7d23724b933f820cb7862cc84e1c0049dd657&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=4c92b55fcadba4354ef0670048ba8a8ee0c05db5a3393bfad757cd1ff7ab2293&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=f35dae0c84fa63273b2f6ee9d5a42ba1ff7c2e4c93750bde7f7e9e8eb886acb9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERYI7NJ%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024529Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJIMEYCIQDR9Fc6c9EJEiNSPCf12gSoKxWYbz7jDH8%2FCGtg8hxklAIhAPI9wsevaENI4N5W1i1Uqs0hgrYXNhqzuotjFBzTpnmaKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw0yLnkJaBhNt93Jxoq3APA4WqswlVSeoYgbPTdP8Xj3lVJpf9Z9dxEqqAebRpFV1ay39Ky5kc2WscDQnEjxvgMfaTwAm6WAW35iRbMtEa0x9Io40ztu3vzyseshXg4wCazcX6kEHsKMytjMkxE77W%2B09NRfr2venAF%2Ba%2BT%2Bo5ha98DHjGO2P3YB54vbj2mmq%2BnSHJZmdTbeD0kUAcL9WpfPZzfcr66kElwa24pTsWQOEJI8szE5CVEh3fbYTX8ZnHVO6%2BAxNxGEpm1mCAbcHwskVI%2Fd%2BviWu7JrgDZDn3mHRcOFGErf1SuQlQ7%2FzYNFYoQ%2BSTRCnucwP9%2FdMxV1VK5%2FE%2F%2BoKJufuAYz2Ho3ppiI71ZwqFxP2d6sta4tj%2Fekj2rkxTPZmhphBODf8zOHWB6RnlM6gMqndetsxBnE4y%2F3jAX9IxBBfGV3Kg81D1UsQ6p61EyYe54%2BBEXr%2F%2BOpwAsyf%2Fx2CsiF6U0N8AOTpPxRmV%2BGkKD0CWjw6LyGTkFqMCQpEzOKrJYfjB97l84xv%2BKuMhEKcZOyTpKBupnKXBXGeS5QxZPUtp6Zy7Ly%2BoiLYPu0uO9tNoe6xJKgB9xghGIsXb%2BRkoeKxUgHh19N4CftOPxKXS3ylu2uD%2FJw6VgNp03mtMn%2F0ijOzTikjDclK7NBjqkAb1UPJ65Hjo6vCcpbANSUDLL9vDsTeOxKPkd7RAIbCZh3xNsyYi%2F%2Fn0w4VjFjTnIQJbIPsTXCf4sBwLxI5Ba3GYbsiizICIeyDk3ZLl2fMnPWwZo2crgTFilL9jVlCNiVIkh%2Bn3NYcylC1ndvX2%2F2ZqiHz2YdAynzXsP3PizNouMML%2BwmDv89d3haI13YpJ%2BQrjR2IV4D0Hjh5k6YZQlOjWHFYmI&X-Amz-Signature=a01dd7d5629f6c5ba7830ce0637a0f9134d1130dcb96c1a03a32f3269d18a6da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZAVINTXQ%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJGMEQCIEweJQgmq3VorAQlB30cZmlBwVlRQzenHnM7gUkPnAbIAiA9dF%2BaImxxbKeqbVsMtSkDhJziQ6dsobf1kkWr2%2BZRfiqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM0oyMPL5qYkmUwRQ3KtwDL3v2915rBiBBJD2XnArG020vfyVD48XWk%2BhtgW2iubgivshfvt9UD0SWQYrDD%2BAh07T3L4gk3x4FifDPqCxM4tXEMnO%2FBDu7wNDzsNxmdRyyE2vO2TLO5U35gjQw3lKZT1HOIsYYa%2B2ZPcUARdpJflGo82fBRL9TGvevzrOG3WuBpSI7z4SZP5X9syt5rkFRq9p2sOqFlU1QTwHZIjyFzeJmLo3uNKJ4ugBIeZL4EkimxRFBStgTap3g5jnfETmS9U2xEIFufMz1ppBt9N9GYwx12dscFfH9RvV%2BUbGDOEQFbXJCf6jSs80379uIUlndo2W4z0qY6%2BEIoR6u927jj5wbY%2FpzNBZ1%2BQiSYOhCh809JSDOyPSztLLM65GTs4WKB4aw27zt%2BKMpi0UO%2FSFLupdllXU2hsfPx60Zlc5iawMJlp3w7WQGcwQ49wpYiwSox3TWI9UV%2B0hvZyAJ7zuwWkV8kbmsMVcgp9Hpg6rurNXDEBhlfIxKt75NXWvsVU6GnHSaARhRW27%2FuriOuNa%2BAi9ah1xUPZDgAaJqXLAhjHIHm7VtuiL4fqMptWv8LQuwHuikBnlWLkTXCiSY6lMof01X3mtZch26RodFR4%2FuW664XoM%2F2SoObRDGNNcw8ZOuzQY6pgFoTo%2B8EkmJd0by6iT6eIVg5c8zl94U5CFnIslOyp9KuliFsGD02qsZvSNmrOMV%2B3BgcH4i%2Fc7ieWBzS390I%2FGGgcv%2FITtJubSUZcLDxhZ%2BtHCNV02BnkMiLo6lr3CtpXttDB5VkCDkB8Z7tZfAOLBaKXmOf2VW2F4%2FLicZmVuMzBiWRIOMBcyvwGct54I0MDDjS2JzcbQYFfbi3ACUZGLaoGEfejE4&X-Amz-Signature=14e74b210942bbb97ae074a88d4b5ff51a69721365ac5df1a00b88e0838f12b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665C525234%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024543Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIF4pJbO%2F2fYhRema8JQo1e9OQscBFz0ibAJnYT4oTWn6AiEAoD6WCip2C7QzbDfrtYsJxDabAXnox6C87CwL2TYr%2BdkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEoojwyAYIr251wARCrcA%2BFlPNPI6vlxSx115JoQdlBIE1YgAnKaUXs0pzjxcGPoXKt%2FmSbCXKMhk2OW8eOV61TjU8yWDwgCT2yYK4sMkyQMBo4wFKLHKgRHsP6U7l37pU8GzEZMhqwePqmNQyQbTutomHMXMNEIlgSP%2FwOFqbFgBa%2F8BgKCxcG5cM5YM%2FYOgqy3BM8nQaPhxd2W5BdzjBwd7el619C5IW3JB1FbuwxrFTamNdTezAWguUpTQNDWz0ZnvXP%2BR4s103vZVftuNFwYbJQLkIYl%2B83o5zz5pPMYpAFX4SeC3xzmgAjkrQlEPPxPDjJ5SkCUYBTR4WKwkUkozXvLn%2BqcM6KyFPxUvNK6RGI99%2Bq8XNDYQMmgtvU87CqEevMzvSeNdcO%2FMJd3KxtAUN8TweFlQslKw6FFwaSlToT9ybwfKr5%2FP4eKykqriR1neCg9Zg1kuZngDxA8sN0qcM1pNdAsGYoY0F5g63MHoDo4lZIPnn1MUO0mkF9n4xlPfpCU%2Bx01yWLGnXnXcAtbZhA0%2BIO8mVTv3PjnJJ%2F7wzuNP%2F00YIITgQ6%2B8B1qLjZHtWStY4ecpWrG%2BLowE6vBQflMfTOA8Db3W5bM6OZ1ulVYlYd3Sjm3f6v21acRO3MEAr8vzi0rAVtOMLqTrs0GOqUB8QLdvHeqUCyb4D9Ngf%2BT3j7AH49N9SFSb3LiD7ksoN30WbJsdHCEd%2BWOQ4%2FZHdQLhvu%2FFxxcjzOO7H2RihUdarTCD%2BL9Nt2PHjSvXxjKCQTyimRMdkzTPaEMKV5MY6CJblfIFypdkIqHnLzikEhaufD%2B%2FBS%2BcnlBNN3rtJfzb9CuWzoLbhRG0KyPwEOqg11fYUYzsGgQlatCze%2BHmSZycXi3dhlI&X-Amz-Signature=0047c72345dfd83baf273628028e6fca21b66e2b2f6f732b789b804989f2230e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A3KR27A%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024543Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIAeDgftp4rPCYxc1HyulnHBqPT2JcIn2mTKnB%2FHBsAslAiEAgLhPou%2By2WHPs40DDOtMCajlf%2FpYQzO7sUvI4wbkQ24qiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMmXTqxAlUx0tK4QUCrcA29Ia1FOpT1eZfQdxL8%2B2HaYBDEAM8q6n5Ok%2FOf%2FkZ%2Fveozs9s%2FeJvjYHP1aL1K8w2cuX2STulwpqqiVp3eqZG2RG2XX6vWgHvXAp1pvmD8iQXKENvdzguajOv%2Bf3ELBSwaAQFPPCcBYu1c1vHvA8GOv3Tj3tVXspTNJnytp%2Bl8gZneYmDftA33kJ0ohSM82NFbMINqcZVXNZGYz%2BZPhMhaH6YUQMGQkpTtqK%2BLbz2XGddTChu87Uu0mKkyDxBSb5GNPXmXEVOHR6f6vcgVHmMwyGrYc7K0Y2goa%2BRkrlQVnpov%2F8G3zPCGE3FgdSCtJanCM3bKxSAXSpWSWk5ygdjjeyCkQjRnCT5A0%2BM%2Bk4NPSPuXmkyvLq2qPgx%2FpWKJWYYqOnmoCWQHwUhHmbspX%2F3vHFnTnu7U%2BYtSOVIOntGu7qvhU6nrLrUMrrucsu6FNAT%2Bgu5fWVPfME%2Fq8HALmShldfiTdBUTtZ0QraKMTKdRLV%2BV6FT%2F%2FYBEIx69I1x7nctrlLmUd1LnHiHcliFqzLu%2BcbH528r1rTx7AEpmp8v9nZIWv1r1HBjKzmEV07s65WchDBFBYXgQGlBMYMY0UakyxERjqjCrvXVjrTIaJgSMGzxyeTV6G5pd5vK%2FJMPGUrs0GOqUBajxpLyjJUsXBhC9Yco99gqEwt1Gmm2V0fCRwoxWxVGWwnO%2FlnrfpLsR0oB1Rfk7MsVeNIT4N2X%2BlJvDOW15LhyRGLjjdUXvBBk4uaMuXXW1BkROX4uVtG6yf%2BfLB8%2BUpWPVV0%2FpOt8U6WwuerLWrB%2FBsRjVHFK4BJ2N%2BHgCXP2WE67SJDQLSAsV5TnhO3TtrF1VDDk8TPe%2F4%2FnjHYguU6O7tvMkn&X-Amz-Signature=fcd04d450665604c3deb3756a569214ba3f08df7fb61e067f577bebd0e6c82b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=f9fc9097a46689c1cba7c4a64a6a80fb3f64b87ec066a4dd7cd36ea20704cede&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=9e50c5cc41b1cc04e06f60643e642fc9bdb3b9a195030ba17a0397a41bf65d42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WNXUTGYP%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQDysVkl0PCvbj3g7QK207OeQXRyNWPNP4b5dv9clCC1HgIgLPCHJWSWW5lnUSiORapInr8ZC6nsE6dxzoUS6ZP9s0YqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB8D%2B12K2E2GYA6TzCrcA3N%2FWqiZYaAtcj4NWtK307hFGyYNK7arNnn2UhvSbkf3KX7B6ItQsXYyIKPKbfzkbiuat2V6zEOpz2sV8VruINmYVMLWGbsRNIOaRQsEshjoBtP2Px8Y6K21AA2QqlND8lcKlIoAwDN%2Bhyd8uZlY5KZS3MTGDhOnEpBIMFciFb2uFcGjfkhpWFaiiSLsO5dqytJC4sZ8FgiGB8nUIa8JLvL4uHL%2BQV6ErnqRgVIKCws%2B6T2yuCpZywnyX8DFXJ9%2FQnvuLRsaZSfShZRv%2B98oc5IgX5sTvmCLTaBPuV6rh4Ub%2BWVd%2F%2FNOc1hiZscXA2qIaXk4QNc2v2vlqjHiguw5Z8VwInGRt89XvjMEYaQ5jYjR3sEfKqSJfJR1d%2BeuupTAnfMUrJX2jfWh8b8FBEvE0JU6OXHExYNdSKiu9MeNmopgnk2ZZMJgvNOTIY5xKFOpTOODrVegkhtEI2t4dUC7D7gZGfzyKRzgvBr5XWZwHFjJkzJPJiuDNMSx9dK2quedunb5FJDH6Aodnzy2hOlwpXgRJs06FTIfsSdVPdYWOop673eSZUdVIWsGFyqVbJztM0HO9gnKbHG8zoR6pVMwBU3SupWlbIsSCFvrgvKI%2FM84NlIm7%2BQrcRgo7yvIMOyUrs0GOqUBAwFZaLfWPvPzBzgHFTELXaMny46TtjHWJxw%2FwJu7ibruBOfgOn6fveApxa0JoeVf1ZUpdNx4PiYgtfLnBtW%2FDN8zhMJ%2FjwycoWIb%2BFLOTG40vym3MjQPtulGn4Dm9SK77z5FqrC6Yx%2BZx1OZokAsxFEDohZg%2FfT7QOcrG6SpvIiLZqNz8s6e45MQwn8tQMo35rl5r2oi2dG8Qa5RDVEC%2BhvBKplb&X-Amz-Signature=3647bc96b185c6836a625a043801f565e1b404f7852525ba9415b3bc8417a46a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=780e3b651d92ab3900e54bc3f558b31464ecfc1024da14997ac073ec37df4b81&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSQDRDTK%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024552Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJGMEQCIAkUUsGLMEbiRxe8xxHgfXy1fEIvEwocaQ3oVjPu2Hx7AiBVDj74V9Mg%2B7r1w%2B6OMGLUMjZSQEXj37tbfNCtu5iXPiqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMto5unXujLXWPpIMHKtwDGE53FCAGeTQVtVNjMlV1IbsYxho81wNXlyQMyqqokFUQ1KOwk5VOXln5NLXnXz5gLXfGO2ZT73%2BxjTEhHx5bEmA%2F6yXonMdZR2bQQjtC2oRSNHdbARCdJa9GLCSDkt3yiQ%2FWiSSldKaUSCdfn%2F2Mx5PIE3V%2Bla%2FRMCuYky%2BlV%2F%2FRGA1LZ7QEmH1ZS1n0B8xnHUoLqO9KSB3oaRULeeB0dmHGrvOpI%2F%2B%2FlSoyJfioKlUe51BoEMUbHKEuqV8lsePnhBgageZFWrnS6m946%2BjzoTdcOERJHi6ON6CVsPNCtixaNbBvEdiEj8QKOfmRP3AL8q9oCJ0G1FEbcnjwtjO8mOWQumjZdFGrX2vRtqot0BAlCiICEEIEWBTLH9iyt0MpG%2BNQfsiDGsZXiweioYhCFUhnQ1p52Y3cCXpzhAv4hv%2BNY9g83jPC9sxGaG42FHKIiFwMdW%2FYIvwYs4O3TYt4mRXAoWiSJh38vjpYCLza7cZ5x9FnxehReTc86pTCeJ6ZT5x6hICZilJhDGFg2OYgUs%2B4mWp8aHxd0tvPtMd5GW%2BnfrqY4K7x4Veyf4e90rQl4f8dsse5bOyKozthPEqplPn1RrtD4%2BMliXRqUQt3A7c6mOtdSvb%2FQjdrpgYwz5OuzQY6pgHVA6YILjhklmbfexE7Dwbkn47Me0%2F%2FcjiBvDwXRiX3Y8n8sZ6DCMtCVnw%2FKQRcnV7uxLFx3KgOOox6MlwKE7v9Awqo9yKaQxM0xZEogaSWWCoUspavRYLpEUpRWxaWDJ5GCxjUkm7U93pknzUE6IUEHGW5xVILdYBH0OhXD5t5H9WM53QM48cJw9MkR9k8ISB0UqFBfAmncsDFMJDqQo8XdGgAeJcp&X-Amz-Signature=145af505e89ccfcf285a9ce9d6349a33ecd2bbba5f508aecdc3b3e13347df95b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WSIWIGWL%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIBrlAUTjtxXf8%2BGv6ElNKOsnKpZJFvpKE8yVBuJYi6yNAiEAskRx6DzF9rky1cDXV01G75x8zqrqWV4kk9PUuKmcUAIqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHLVLasU8ee6WNcInCrcA14FuCUUkW%2Fv6lgDwaW65drrUT4akBwg4YjZh4PPs%2Bd%2BygMrvVUpbCCbyiKqurOO6ThcYEPDsmEL4nsvoUZooRErIUzH8dBwuUOuO3y1ZUsEGUK0szlGb0rd6bJVtaBwvAdnbSsmYuD4PLnC0i2ZveKGWH%2FlsnCPElosfLg4iskyZ3ztj86MZvDd0HOtY%2FK%2BL%2FPImwRbGTeHDpz7cKQ%2F9q7imxh7bOabqRGB9msI4Q%2BXqjiVvIgJ7%2BHP3F5bQHK6oIqXTNoHwxfqYlKBsuzw%2B5DLEVRz38ZcKyp%2BywSxFbLPxL8vcIvR%2B0wW6A9B3M%2BXwvn5hqw72zFIGrKSiUJ7JcHJk4lqPzMS%2FzcRaBbKSVrlhO%2BFh20YjTg410seN3r5jTbxjdpKRb1hmnHrSAh8qZV6%2BqDpwWLxSud5XS4E8whnD2AEcca%2FbZOm5QZzkqLsmPF0s6aD0SEx9rlnQ0Jt4xZ273eXjJeeEa908TMlYymp6yOUVv%2BXRu6%2F3f454lOlnu3A52OFqQLc9UW7LQznBTm5clJ3lLoHdg%2BzecxmqoQ0ITh%2FB59olgdU8bCvm9wdhabGhKw2zEJESV9VTTcCNlEzTXDIv0TcOFP1grK%2FhSxU841Q8Tj7LQOZqxE8MI2Urs0GOqUBfsuVC4zeq7VUxl7OxTMn%2B3TniVJG6sTDHovms%2FKB2KWnD9cDIzoOGJkNiV4rz%2FRS2RmLFPIB4wJH5A6WriNRXlR5Ujyts9E82YqTNm2GQUpWBUSzEKUAZCZ0CDlwe3Vuj%2BXFiZYlSN2XK88Y7Ugnf%2BLsD0Vz3sGpUHkXjT%2F1hQbsvtht3%2BvIAenVitO5pcJzGAlMGS25O3pBu9%2BI9FFH6GcDjByj&X-Amz-Signature=c7bcd73d208418b4a201d92bcf50067e976e62072852ecf0683fb4b89fc86da4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSHJAL3B%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024556Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJIMEYCIQDyuWo2U6jhNzt6Zlx95J2VxVwAIOkYAD1fjjIff7JWKgIhAJrAHeZWBKlkmlHn%2F3DIkkm6VTjJ8ZS59C35Gv1casM2KogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz2SK6Q3gM1%2FMEnw9sq3AO0SYtCzEteQFfilYxXsxxaSGSr68U%2FQPvkAKUUMFjlqemidByxBS0KB8UDD1NrhdeiZuXnbdHFJlgIKRJ11QC5II1vHlsV3SsPzs6iMkQztuZnyXHNis%2F%2F0Wcx28gytkeseNeE0JNR64dzn3kY%2BalyR%2FjKwp%2FolPoE2dm6iKhCq5Zei09LQqFIWtPZbFP3zXBw3H2IVmz2L7Wq%2BnPvxIXp2eGybfOHlAN6NXHR3KrrpAkLLzpI5%2F%2FRt8iZbr4ZzgBNE2k%2BoA9P5YqUq1xsiaZ%2FntMIBBaObbHpN5qQ%2Frjh8pWIGwwEp9IV1VWsKarx8dt8Md%2FqwK%2FrIjTr4FC58wyBAzTzjd8GTrufvqksQNO%2F9qrEJBDmfUnWPz53cy04UupBAPIPr3BaXR%2BP5HMllldSt413Qv3R3NPMMAsxy%2Fb%2BdpvodfF%2F4MhDR8We8lDYwwXrB6oCax2xSWYsixY6wRCsdscZGnbGByKqwSaapYxN62kwYE3SwzzGEIFFvCQSZbBcd3P2DaEJZSHxhNsD4GYakZYm7mxlQGg89QH95SSbBX4O%2FyEzHxCx7NXLBbTrVA0ODdpM1hhP9q4rX3BsN%2BxMy5%2FH9X31Rl6M%2BXXmkyFl4Mgi5Qvq%2BrWHaYXw2TCSlK7NBjqkAfNCYSW%2Bsj4t6C8lsvRxNsYAA9hstFRqORHpZ0xb4uqiRFHkgdhK7WUFjcnai5KYfAlCYZ1c4D2vPhOm0QOAzAR4w5J0AFWkO7o2XSPqkYVG6BWcFrBvNz6muijnJHGVgfrykqWa85azdn3PIU5at5l8coo%2BPSMmFBvCudfffPJlpq%2F1IdKu2F8bvHOO9oDgiJiI90wou%2F19zKaT6f2vm8LNFcBU&X-Amz-Signature=bf99d53c2818c3f5ef3699dc719dc5dac1d19bcb3bfe439c0c9e48eb6194fb8f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MQTRHB3%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024556Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIE983VMFI0SvYwD2xduAO1jpU%2BUtSrKCXsias9GwsRx5AiEA5sv6scUxASFwloxwhxOMTEpyzTwCRtmUUugd6nM2ytkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHRL6RE1cyP756XzcSrcA%2B%2FJzP51Pdp8zMLCaqIUD0%2BsHaPjQ1%2FrSGnj2Q09k%2B7Fwbtgxi8XHG%2BG5kFn6vEANu1MZCjH0XoWb1Gs1zHXckysFLmkSV5eoJ8uCN772l2VUOuxpDaaW5kIilbVXvJoAdTTpB%2ByXkQsQdjyAi6SgiGQJQ%2BnQVUb35Hgetv%2Bxv4fVmoSbup2E9aqbE2AeGQIgbrhQVZ27kEgR23uIYLUG2Lnf%2FTO4SxfKSXTMTx4tqCBxD%2FRF8bG6duSj6FuF5%2F3qLCApDsQn4lJHY73U%2BG%2FopbU4LmB1evuh88fX5%2F4XwAqfruU6iQm%2FIJjD4TzY6Hvl7EtKNB2tuNa0EASN79ZHOE6paZfoesn%2FsQ5TALao2XxCj%2BEmN9q2iqY2T33FW3OgNPp98QydIxeRz%2FQqgWXXqo6DJ9fGp9Yclw9NLpKzRCm7%2BrsXzUxtlcbUBhNhzsqqZulmY4qR%2B4DpKErDllzTNt4w2kDtNnyV6v2nNog9jZ3hsd9E0RA4LdTSPe91BNuA8Wjqp7cnIZQN22p3nlMGs1iZXF%2FAl1BaGBboQNpNKErEOR5gvr0kLA2KdKudwZZOWjmnKM0kVL%2B4jr2fDx0YnYhWZAOBeZGomhPLLu8sRc5aiKT7jAZGv%2Fcq40CMIaUrs0GOqUBpopfJ7eN%2BTmz0awzZ3rWdOrUirBb86vUnF1Mor27XGgLlmnlYUqdHkdVdomllS9mO%2F8OvUbZuDGWqWBxHFawvby4J7bRGOWg%2FHGr%2FXyh75tXKK6y1anFGsDO3RR0gblcJCJjU%2BvtaI8WBjSBJ2OZU8ms88fZre87Atz8toyT5LVvdVzK2yfWp1lftZS8OjoGl6XwyfD901iYu9YpTTGKsuVl8n2m&X-Amz-Signature=6e8c5644a16e4be83193e8e174646f342ced6a6ec2d047be67943b2c41aa3c9a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=da66f9c1f744bdeea3a3b20c41c10227d4e26b99648448a0d1ccb4d192e7a098&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQFFEE4D%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCMjSNO1hHwg1%2B8vbr%2BhejCPkYpbDqYyxNJEhLCYlMN8wIgbzq5RmCls3C6xrNY83ADZoNVSyMAfJuvsyNO19wtTnkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ2zHB%2FNvH3uTUZpFircA4AiwbHD8J8sy6hYIkh8oxFRbXDh5uah1CEzmVT%2FVN%2B3BfnylCgc8lzPVZtHcexFa4BLmJx5bQ1dmJKYVyzGM%2BFn39kDArIL07MkpSj4qJNTTN9qAJ1S%2BwuBDVA7N1dp6aKEBcIb0%2FRwAr6lUdM67YqDEjMWa%2Flwn7MfB3qWgoBRN17QtR%2B%2FIXiJ7ADV3wdmsHjsjHorZ0nEWWgUeohEhS4Zjz3FyyhpsdPabH6sWGi15mCbXX6rhGsR33avpb2ogzkWu14FAZaG0beELUUEOoYk%2F06U7TVawOP72XSZQj6BzhMnsALLZlSkbnsDbxnszt2%2BlNslDPAIja3pWsCIJNmgIeVDOerBqxeLgyRT5cO9DTTxgiMP6ReAiGqcOGOukvQVXywL7Qgv%2FPyas%2FYrRP9ZzTCsHXFkMqtfc8mNCd3nSx3je%2BEjPVuoI183f8wtDalJiJyGmsg0oVARp9oNTXPF1J8TdpTJhKHMQQGxwYnrCIPa8YA%2FhyvUETb9myRPCnEQkIApVSdeixN2CUHeyjcmjCArzAXU7gxMiejFwgwFVQFSy1Rwr8%2FdaidgmYkbvAemSzMCTgjXmSWtXYAyoeT4kYgRTlZ8uLhkdLDxYy5l6dX1Vo%2Ftm16VNvY0MIKUrs0GOqUBNTakWqz7uGJEslwuI12rNvLG3e4jopBPrlI3s0fdW9%2Fx0jTi%2FRCFVzbOnD%2B78smoSUrHx7qeSAOXbOEaywmdutyMiMpBEyiNoAtK2wJygg3RfmqnxZMvhmSWxWW%2BX3Qz9KQCOdeom2YxrpeYfmgC9FGlt%2Fs0NyBdJ8E3LgUWzHZOi9u6xEOCExrZIsv1lv7xlDvsEIMuW4VGgy3i50NvStEhJNZn&X-Amz-Signature=f469e51b73e73d78e176875c8ed2f5b3bb9fd38979746854afb10ba92276e0ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

