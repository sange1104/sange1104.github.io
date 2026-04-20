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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=a8c9f23ba9a262b97c65487ebd406b681b54967537fc82b6ee919fa85fb8ed7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=76d021608246ac5d06ec4a475970be38e870a7301fad12ed7632a1fb4a144917&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=9c567dd600506bb3badfa2932f38d87c47df029c284ae36b4e61c0be8ac74e5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=0db0445af9659ff218e2d469142e9f34d1337c61607d516dcdf1e5f86df1af4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ZHQP5T6%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIF%2FLbJlYvFYT%2FPuT3z5xBOScLAtaT7glPuiB%2BCZqLQTsAiEA5CgDPt%2Bz9nB9enJ%2F%2BeEY0zR8jw6ZMiYPvx7O%2B0v8sssq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDF%2FwoV3Cr6as7%2BVisCrcA8fM7%2F5jO4OqpDLpGS%2F7HjvNd0Rb5GehXtCjxXtZ1zxjVmKDtOT7%2F3kl99bV1Hjq3m8wcUx%2Fm9O3ZxG9irxYLA3CwSAR6pPF2Y08TEojPU5VAqvCIqmVabpFfCeds5f7y%2BGCLjzzC9WRKPInmbMl3MCiaa9vUnrXKxtzES858z4x%2FAfrgQRJCtPTgKTIn8FuvkTYs5FLImm7eYYjLcUy9Qm44HLth8B7kWO37D51qpxoQEisH6TILh2x0X5Olo0p1axVhqGmhYKZRJfi6vR0z%2FsLeqnL0P7xRV4ngREQagoed9yNYNJcmE7weAvvlgDclQa%2FigdXv4edDq9BCzh%2FCK7AEdxwqZuIMehhBRTpqZXaJOT%2BbJ%2BdYbI1mB%2FwTyUbhcguye%2BQg%2BIt41E3Tc%2FCXSvU5uER75cUBLqI1pFWRbbCzNHSbuW1QO2PbtdS%2BhciseuvunZAEiNRPXsdXavPV566XMYq7tOWAX7TTkPKcLooj%2F56R0xd8KMBrsfNCOsBXBkQI2p3YkXLINbzQD7sMwgciDSVhV7mN5RTreqbi1XIbJlnJOmowRFJrQFGrLrkShyD29v7n51VhXLe7H9H%2Bqy4LjjR%2B9HddUygdSqXi5htTNpNMzNDMWdl%2F%2BtQMPOWls8GOqUB%2FzqDLLMTfX6pjRZA3k6%2F2%2B3aKHbL6C8QJTfPNXDENQ2oukrjPG9ukA%2Fs%2B%2FoHzcS2RqF48wsSE4uLYZUP12USvFxneGoxYa7r77hdvUS%2BudR8qpJHjmCk9sN5iyFDg8deO3ZFdHyFp3pOZTy%2BqUelq0PAV4g4lijpvwcSBBwk9Q%2FABldPdrDfP2XRbu968WI6l20FoREJ899EH69nxYytd2IF6%2FLf&X-Amz-Signature=3ff6ccf813279fa928b244267d77e8b27cfeceef8c7a354e0a3ecb595aa533e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662FISDAPS%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQDtXPSkXOBY1CCFz6dCZIDLSLwirUFqKEnR6IQRqOgh%2FgIhAMPPfDHyC%2BKDHs8Zfia2lA7358ei5KswdPG4rRUDl6h%2BKv8DCBMQABoMNjM3NDIzMTgzODA1Igx1JaNoJ4BBzXmyy%2BIq3APbeJP8%2BAjTlClA8IwADfB7pRv6TrzbMiVm1rOBcYwEFZR1RGhHlsKWIfohDcOb3rGlY71excFeU0z4eM55D6yLqVZt%2BshHq%2BSSDTeUg1tBdLw4G5fL3uxzUY3jz%2BePyAx4twj1%2B2jqTGdt7hPuQEhlY40zmpO3N0s2lZYACVQ3sZzm%2BzMaqNgnFq%2BMcDZp1%2FO%2FYJ%2BwFKOxdCfHYLyWvz3Hro6WE%2BRYUNbjSgsgETHy6yh%2FxOpDoeR735LZ8pYgxpPTCf6yOG5ObNPY1zUjaWQt4Snhx0bCsWA2mHld1wj5HHoFI95%2BrFuF77ANbdd7zce62vWnmzSnExSQgpAD6LCXxYm2QPpzu5pEWUYb1KycM6VJjpsoMKFoMWOQmV4LB4SBnK9bKGrZZRShbioXVCXxamF3zdzD17YywjY%2BDHFmLa0QAUIdgDSWE1dobH6unVmlFPLSc39zwJggUVZEgeZ4aPv0dvA42AF8GpzKMFM5tYbZPoaN6qOhINKavGrIvqZ249evncHqdfqzvDF9jIT7EoA2OtvsER3n4yCDo0WV6vQvVT8IIdtora4GnASnzLPN%2BokTwlK%2FKIs%2F%2Bzu%2F4oAGf3AAY6rozl0ZBB6NxF6r6zH9aKxJ2fpsdyfIbzD4lpbPBjqkAeQmKImpcR2DAVc5jnrJ69dm8WIJr0s0dQOCxkCudOyjyDNf3rvFn2EGd1iBC7RFFj4MU1%2FEBz7bg17OP1qbBv4JM1Gj4SBzyiQj71HKrj6MOePAkXRmNvQGBWVREdpd3rN9wasIXluYYaGnRoqbClfWDAjpdPccJnxs9Nx6fHJPj%2FUTLsVl%2F1AC5pxRPQY61kSW2YtDFeO%2BJbcowmAlqiDe8YK6&X-Amz-Signature=cdb67ea55adf53d49965958926a9200d09302be19dedf99785bb750f987be0cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666TTWKS4I%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIQDstGaejubDTC2QJjAvUFG3TZGQdDuiLgX09NUV9L8QTwIgTy9ZnZofyblbwgzWZYwhpogZGwMl3UHLSOnul9Gg4LUq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDLbktSUA5wABrurBTircAx1SMc0QbUkSzLeeBoKjGBQUckuNX1adCqF3FqxyaKqfbgscWE%2FIFZ560q4%2FSBZBMF7VE%2FFyW0ywAePlJePLfigupDvfEjDQgv4gtocwofLiRPBxRoW6vFLXa02TU3DsBLLM1%2FEQTKNwp3Qz%2B9hmvCPTGeaMugOx%2BpaewDaZpRY%2BL8XDig2y8XG6dTeYsboKIiJ2Io5tH9D0zInXabNlbxNY6R4d9E3rHMmeTlVcJzN7L9ZBXke0K%2FTO3ZbPMNwGzf8p0E1yRdDRsiFU9uvH96IMXz3FhKiEYuTXDpF52u9WG3Wdhy%2FIajz8gcLwuVJQYxqn6keSX49CHn7JXmnatAjjVcdST%2Fi29CiMLN0L6KUQ5NWuWh6WX2Win83siiY7yJObGiYkRBpncRE4gzCCHLknJoUzIgHfvgbIBaeO518hivtmwoLPrKtCSDIuROBab91bP%2FsD2FKtGt62zHdBZZ7kkZksv1DObrtNnk7jd5QvibC2FRo%2F%2FloBPJbwKSTQRxE61w8D9CNg7dqcZSRjJNs7Mnt7chmOAacIWymokGpxOMaWovYjXbkmOCeS9EhNVQGVmOzBD1LAUv06WzqNPksXr%2Fxix0Vs5DDYeUORMNsxoefUKcPubHoDgci2MIuXls8GOqUBOpgvRtwl4B5JpFgt4wf9lg%2BDkpYVpAGBDUvspBDM%2F7DfktHTEFRWCnuTlf8qaoSKN1giqR9Lctt5cnoHyji6mpUp2drxvRd5sHiWGFpBtXTH9qoxhSztTjFzZh4ycATRnZomKArJOgeuV53oE3%2FUsCHOcfT6HuJQMs0Su%2FeMN%2FA%2FYdbXmBh2K0vCZyZz%2F7Sp3l4hXncUM0tHVRRILxolAa8mrc3v&X-Amz-Signature=b3ba0d8e6abd2954df7c0b300c7868160b6f8a587ab9a823296cee6e707599e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664XZDOK4M%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIQD%2FnNCuqkVTmeYnThCX0%2FHIlihgm%2B49XfwUguIb5kD%2F2AIgDjvPrbq6j2972LnlVEvLMtzN9DXaQQ8F2mp7w%2BcWVnsq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDB5ggSwsQxxI5YmQfCrcAy%2F3cFQMH%2BcCRgtda3w9GC3dpTIWpQqJyMWf8F6sF0ms672YenHv60FEIcvWCkbzJV3YFt8jFVTh0FOP7K3%2FHmwNlFBIldNZr%2F1Zj17pteCctwLm8%2BluwvZ79deqU%2Fvv0TST5w7S9XB8bFPzKMrLudZDac6AqG9iCEjqC3AFIs9b93RPp87JHjLJIRUgb2CeglI79v%2FzLYbYN8I8uzL8kC3jFYRCOEFoRe4Cw6c9pINg6XjB1xKutt9kYXDI1ufm5wLTLy7Vn88MED1B%2FoNfHelZapN%2Bx8OVXzaZZBwEREco3mAG911a24xZNtU2SjFMoBcI4M7D5hIdNY31Vswe8IaWpY2ud8LmVf1vGcn76BKKA6bTFb%2F8owjdbw%2F0Z7ETMCYfpv0blSHFxrO6Ysk%2B1j8ruXuJqU9gIPZfFBq%2FF6Gqzyfb%2Bb0lp24NTay3bh8U3vXCt%2FkAPh9ciTUxDrakEqB3ye43NokRB0u1muo1lMu7vzOfbmdmt9JMxW6OaNuQxZK3P8gotBcuN1f%2BTjLRr8NqhgM%2FgcrLM89Luc14hvkLzHG7feaV3oWD8OenFskPk3bq%2FM8Sqb66SenzbwePtrw27XRsV3c051qMdrz2LIxOal%2F4MyOf0VSpm%2BotMNuXls8GOqUBIwVBXyiy1u7zk7jWdzRSMDjigP9kySygEQpFIAA%2FD6LBRfY6YnzxQZh7E85umZ4exrlKPgu%2BbdVvFsOBhAbMma6zJZKZtry51o1u3ynEkErvkZD3UIn%2BWijH%2FoEjW4uGuoN8zR1cewn0JZjHWR8VN1urqoURACEAp5UlNo%2Bi4QPUbbpBGnVlq%2FQH3AKUNkjBtrefb%2FAU4wclA1o2jQsdyLl6EnJw&X-Amz-Signature=21b1911b9e283517bff5deb3c441a12804bcb2a2258ed5042efbd497c5a556af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=30de53c39da234758cf4ee7796e9d8240ada24879b36962cd9620da5fed522f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=6d8544d9dd9eb44a2ffc1051fb40ef7cc98e13607003f2961e834f5d68a31f2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VFNTMTP%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQCN1oHalXBTci3HAiULvsQYmq%2FfYs4gSuWmYN%2B6yqHK%2BQIhAIpCD0kEmAbwAPIc7LdZlUXo7pnjmeYj6uecJ2H6egCZKv8DCBMQABoMNjM3NDIzMTgzODA1IgzLNuYIrNPyZPgFPUMq3AMhSx%2B2oTHyvStVCZf%2B2TBAZdx3rztaEcRSOsDQZgwqkjSMK%2Fo%2BdewicbTNx6cdPbCTzDInu6cFa8nqMZHYgfTttEfwQoADgbVBEd%2BlGrDenV60By0igeXlq6pxhJgEt%2BWjz5PxMoRjfiJAYYTT5FdSvRQZXJ1lrqIod5%2BXrPxx7yacSyPhmdphhjw%2ByDhvZOHE6a9MWfUCWxNa7Z23K%2FTFvGIBAbNecTaEk%2BjrGZwGtFBxtt0jnVPY8XeBjgWHgRzqeZ8wtKfFe17NeuHisJTDXktNZw%2Bqtm3igK8jpmWLf78oIkqmbp66AUvuuhRFkHCsa3nfvnxEr3F53VDc%2BEBMKunUYc6WGYwI%2FcaZGIBBNbTXIJKRPjt7v4NrVRqqeWfIOFZSGad5v52ct8RJKaCmiBmK%2BVVt%2F7rK9JYTGU06AdB6LDdLU0FbiooCKpSLDHkp3JnM1ryk9o3ZXwUXoZPIO8bC7OcrFkmJNhGrQ53MeevC%2Bp4C%2BrgVaFVx%2BLEHL%2FPvRGKk4%2F2mvZOQL%2FQyALM61ELPmQm84XFZLuDVkkuZXyTIwugyS2dlUWDa%2B4S7Nr8bb5GYc0LEf8E30uMjwXMNGYQVBCYW7bKhYHm3DVpd%2FHffUkMGxrpBK96EQDDRlpbPBjqkAV9VnzVCSDS%2BzzOWD4saB5vO7hlKDcEaSNr1nUKmjoHHUi1z5gx4yHqbUsDLIggEREPJ0se5wtSlQQR0ZfFMRocVwHj6lnZmxKSUEY0qrHD%2Fut%2Fjw08yO6b8Aec2M2KgS2pnI0j9AZZWkZbFSYCvDP8V6kfpcGRDGYVAO8C5cigg9xGiLWHrBxl2J8C5WJrgzoLfqmtluCK3KhEmDoRE6BxmYCG4&X-Amz-Signature=a7bda87653a63ada8388a727ad67efd4b83318042caa47d937730eb988f0bc6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=3f615713043833a4db28add6293e9ea18e329c12175bd4b1d8a3d9ac21e7de8a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SM2FOJU%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJIMEYCIQCELEhnx5yzdT%2FbphMFVSfcumlzgUAsE8lB2LjzvrK1SwIhAJkyo03vtL707fJ46t%2B4OzBlgifJXJCTYFtwITOcXENHKv8DCBMQABoMNjM3NDIzMTgzODA1Igxb%2FuYIsn4togF7WhYq3AP7i%2Bjvfq%2FiERIkqCQl2lUbM8vYYVOgZSYLZ9X3t4zghioNR3G29M2b%2BLFQKczIfJmyVNZq3sinc%2FgJpkLVTDYN95Q5%2FucBLNgZApwlYLVZr%2FMDmrb3Nz8xF%2F05jMs9N6lz%2BypuwdG1PZSLWtZKIsCCFLBnSThcC84un%2BYpCDnCa0k7Dq83RUKdGRXJD8TFnL2aW3FZS9vbRBLuhEhGsh1hmsdTidrVy0Wk6amM0Xzlz9JUcISr%2FQN%2FlxbVb0GGbjplnLkgrLBoMBMNNtVr2zmfdgfmiFHCYdiDI8%2Feci9Q5s5cXtN5K4gGPwvkwZDQNA06q%2FF3MWn0NKhvuQdstoNsFnauyl4BYx9cSvSxcaiAF%2BCUnpQQm7aizhoeCFOqE9UfHvv5zEnXtuOzwDfMVgKsWjlf2NO3nqqxHepEzkxSiOtMtwc32pFLY0XD9SY2TyTY%2FUq9dZazwpcSV67Mr7BLV8l0Qgb07aAwpD0BLk8Rgxtfy6MLYwJIr6idFDEe%2FFDJIrUDYFLjkFQTbPABoauB7xmWRkL1MwKcGoMP6iR3wt807Oh6E9ajR5RvOaDWl258YzrtopNkRSwiFpErIxbp9eoAjIS93Pr0B5K1P9pEF4ruXut%2BXS%2FpOBedDTD3lpbPBjqkATWu7e7JQO0j9Wb5NLot%2BfPLufwO1BSyystxmdOuyIHpiv4lz7Xk%2Bmob89hUOeDz4AIHFUjC2kxvhp5QMxXv69HpbwIg2UHrYnhNf0riCAysRbWLrxXOhFuQCFmMyKWd6i6ekKV%2FBU3KZnu1Iv%2BdDgctTwsYcbkO0jdRbYtzr2DgvFlcl%2BxEwne8VUgGzvmT1dPWC36mLsbYrPbHr2o7e0dS0vfQ&X-Amz-Signature=2cf5b05ddbd004466f2f7b99ea2727128117df5c284f011ff678220717f23b17&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URT4BHYC%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIAKm6aBk2uLeX7%2Fw%2FIebr6ivaf0qpCMVEQhwAQXJvSXMAiEA57fUKH7SI6%2FmAA2%2BxHfVaeZjiA2qEiUPjauWO6mDC1kq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDLdLwYoBPIrSRALOhyrcA3ji1WiGZl6Hg%2BJOgqw0nwVd%2Fr%2Fq%2FhAcG4ikqGn3qU8fQljfNuDWZVvPFNQIL8q%2BrCZeOAdu%2FS8MdG6vEDkUmOyEecdGYZL6bA5F2YSBfZtkWxfgu%2B0P3xG1YK4tVrzLwkpNSYFxy9UKy%2FiIVNVYlvNfe36%2FElkTNd8PZ5bWcJ83evH4ArOtSP4oZe5OQbZ4H0DLYca9Pflo0%2B1QzPbBtZCEO0O%2BQhjs%2BToTyGpxe%2ByZizxx1Jy2wwRmvccVozRiHKYRNpxDAbYx%2BoIZIG959d3pwZ8B6G07mf3uhTMiWynTPN2PIQQEjWXjhagznxRiPqWr6zFT3Hw1iUqXjFN4xfk0qPf547jEleoFObXBrYvNbIbE%2BwCMeiP0PmN2b00QuYuzTn5RW44gGxZQElyGkGNW5ZOAlwb55%2BW2I6Yd2IwzXUgTPl9fgNdK816AbYG%2B4XPIXRcqPCqtBMoO8wQx0YblXBBa1cbzYdVU8mYfHCYuoe5r%2BoMrySCv0yjRQhjPz4622L%2BrQ4WUje4U9kc7esS8NOCvWpDd5tgSM%2FBXxk7RlFRXiO1RduNAlpHuMUE%2F65jkd1ntGvu0DR9xyAEPpPdhwPGYJnT0fTfsvGT4VGLavI7M9%2FCeMIrrCm%2BCMIqYls8GOqUBSiStQkSE3rZahmv%2BihodLbHloD8f7Hf6h5p6fVXiqYXMuHn1H%2F%2BE5%2Fu14%2FrA8ICtzr9NKhvaLNCFaIiMXsSF1FQvbjQYWR%2BMQedbnI%2B%2BF7AWlZ1XpF5RmKVkPIYtOYDbnpo%2BcskOpfcpfAAsdZNm7RnigkmvVn6Qz31k9C5gNH9Pd3jnJXqm0%2BPdmGcRcx3ish1YdcNemfPgVVB56uXXNqvQcOeh&X-Amz-Signature=b290850e80607c61ceb7df4c3b41e6991112bb251694c387b959167f2973365a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QRLHJVBX%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIFu0kjjl9eL0y8qEVunc%2FPOal3tg35jCxBxr6rhiSpvwAiEA5pO%2F%2B1kzqZ4eiwZHFAk24VWIrrtSEK6cUq6vm7wlNbQq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDMKVBkZ3UNs0iFbynSrcA44SF6HpywXPIN0Fbre0Jg9o8CgA8lsfv1ZbsZJTZLJMHgjrB0v6ibXdkknQGWc2w2KQbXjrAv9Q9gOUqV%2FlB1%2BTwXyVGmRgLsF8oiFEPq3jwbuolMbN%2FCFVdN8HDQQ5TaAPJxDv2D58kRCBcHVKi2OhtdiJDXyDNtVHFz2hJEwZ2WAiHInv0fkHfWljgQdbxHDM6bqwWpuVrEb9DVQdS5BfHWXxhy7EVt8IymDrhKGuhay0zIe4EoBEpwifxrP44WUNJBgoNDvMyabAxJNaxtraW52zfMrK92PNupDr3%2BjLu99H%2FcisU1oArmdC4%2B%2FOzuofj3p3UeB1SaI1Cg4avksXKxQDWzJBxe1N497rF%2FO1y1RdRfwscXIuvkEwEKowaAz%2FoOy7pROiBQCMOknHJmtj1gAuTIxEQ8zU4AuFcINsH3udjLVMY9EgpxZPo3vk67sAFVsEfhhy2V1uivYkocDvC94QK4qicqCfaItYu24gHLQKC9Nu1ii1nDRfFbxhnEsiv3EXFaMe%2FInmlyexRO5lraElK0m%2F4k4mqVe4dqdWcoYqXH9VWR3FyU%2BIb1MKQn07n7Ym2zIvcP2bQYD3iYtx7HEnQ6UHShVd4jhHqWTbjIycrHmK6ccgVfXiMPCYls8GOqUBcTTvX5HfbCsQ%2Fjco5OlHenxq4z2K3sVHg87IMts8vX93tk14B3Rou3qqWzSRYpc2y842aLRP22iR4MDqbSaKCcSjfS63Etw4CiQRLcBu8vpFwnNgCgfn22%2Fs4tyA8Za7iq2bzLOQqdkEtcPhYcl9sBoH3G2XKTuActry70tuyO30dZAdOiXRtFmE4%2BvRLdMZm%2BKjxaOEXKblLx03V7nOtVpfYvTS&X-Amz-Signature=c19112cff09185dce31c44eb1f9aaf74fd78126ba621daff3dd505b526a30ec5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CJ2UNI3%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJHMEUCIHjP8jccW5ovzIEIyhtUDbLf0LHmoEfJzxANplOpXbobAiEAuvMp3pJ2ewNCCyw83H3Sbp0RzAyTT%2Fc5FFig6WkpcpUq%2FwMIExAAGgw2Mzc0MjMxODM4MDUiDAIa6LZJ0QKDWsOkGSrcA5f9UD1Mr0nAnwcHjQAUiOFkXehXvmv5NyNAeelZdye6gPVThxd2ufp98WF49QEfoms%2BYd%2Fkz46hHDdSWeDfBXgLswjcdweh%2FXEA2cLOJ818karVtgtVKOcwh6z6cpzxLuJHfLde8H3e%2F%2F8THziyofiGjtjMx70XQZrFVVOg4ClgS4BYWGC3HcCiW6IUZRrRHOnPTyWgYBBtx8Vxk2NNLB1svVGmqaj6OXwt51XL%2Bmz%2BRew2IHgZjiwIBlJzRyJdoX%2Bdl%2FdnYgIKLM6jnEeIDIocOML4cuI4oAOBkZpQohxxj22njC9qSiB7UVdRxPSHfe4iJhk4CPeL0NU9ML2n5L8C6brLaN%2FsUAWBaWoY4eqqC80cPWd5fqxsJKkUwmLcFghtEyjudF8wypJ6zM3FmAws0g%2FIrFzAlPfnRtnpH%2Be%2BgJ9hoVr06sy%2FvfAZyL6PaDHbWgPCBcPIafNyAR%2FPK4%2BRA5ngzybwGYNj0hrrK%2FxRkn%2B0AlcScMmNaWTCPSuYL256AVp7NJcbWZUVnbHYLAACqLdnnOjIP7DWyAu0xceSWYufm6uL612rwMLQr15fgHjOrpxRnQ4cFOtq9S0KBWJKE5e2E0YbhtP3uHFAQ1oOd5iJj3okuL9XT415MMCYls8GOqUBtiE0h5WhfJvh6VL%2FYTiorYjLX853ckPDTo9%2BLSw8KTZSNxKEw7Z7fnXIbrQHVOvvQVZ0GJqoQCbZ5UfFc4h3J4Aur9pBHcPvbcSVxIu2ZJEgvHipnpvgHuBOvjFY5OJR%2FM1crCyWsFf4tXJ6DBqrrGluCweRHZiXFXrvqG3c5rMt1vxWkPP7F7DOfasajGT0IGSqOTCaZeV9V4s%2BDI%2BAgIT1ARlX&X-Amz-Signature=45cd759ceac86fbd9eca93b9cd90b79d461b36657f0df7b1eca13241086da2c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=28951ad369744cb20341832668f92961dd4a5bf87b10e4573f495d3d945bef92&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3HFPL6U%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T035204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEoaCXVzLXdlc3QtMiJGMEQCIEndpPyoECwdmYZc6SPyYeXh9CEysTlmMqvhrMAD7MRbAiAD8cKnFeLHyNLzxQYjKvMbaZAsZnybTdE%2BOJfx4HSsMyr%2FAwgTEAAaDDYzNzQyMzE4MzgwNSIMM1XnVsD4tLLCWLs0KtwDf437iaoUO3bpoOEM38gvQUGJ6Q7JfKA15fFrNMkalhRE1a7WxwhnVfoPpJscq32IUk4%2BsA9BxnYSWlMmahFAPYGwYgh4paf5Iwk%2FD5oerHBgcJKJM11pDe6vtQapLzeKWrZO9MC6f22lEsJBnENx%2FM7TUWaNTCmE27kQJ5uZ1WQnLQNc9n52XPRDr7eWEJNMgW9WfP5sk9DC%2BfYk%2Bn%2B8E9Sof1GiJp1rHppUDOb0taKUxMTcyxYwvj%2FPsRifDFr7FiPm6%2Ft2cw2kmaDT7AMjmACqp%2BvBgOY7d57GTKWptp%2B0o7T%2B17MLch5Masgp53S%2BDqzWlfQMGf9Q2TiaYsIKt9PGI75Kamd9nTFyMCWQWkFiGnot6J61JpBSHGlLxGuBksgfVWRDxqvyeQ0ixeOItPM9wat4gob%2BZSOFkFpyL37zyTzvGnZ3BDlZLYteH6RS9crei1UtQcIwIV2jFhK6WBhlqfKbukGnHDsW2k5N3uvyGWHvd1Pvkz9MKpTT30WMKMKA7YuNzyB1w6GMFDXA03q3TE%2FC7%2F%2BMmV9ZCyGmLLRFvMqNeKxBgXX8oy3r7htNcqJCvembWPZZR9JOB1do6uDz4sxjGjlxkSv9qWUAQadeCMizeh2jZT1MWy0w0peWzwY6pgEECBkBPW5ZYl2BeVIjXnCP0PhKPgpfxCHFJxuhz4BshhAYzq2oU7y%2BxqvLNWTgBCIQEqIzbp2GemIsYrvJvPe8AGn8%2FEUERGXwrSspX5MCVEGWD3Wr6XjViAEQxUEMUf9Zvaz8P7958JXWEVs2gZ36ea%2FzdWRQ0%2FEmFCugqQ56SQWOPh3G3hIs9Nj1sihpLBgeevef4WtsMVEmAJzy8k%2F3Fr6xNWir&X-Amz-Signature=c816c01a68240bcb9079aab4c500c3249b3738cbb0ff17772b3b524cd116a126&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

