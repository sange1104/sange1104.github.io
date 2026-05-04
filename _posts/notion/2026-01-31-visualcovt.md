---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [paper-review, vision-language]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=43f980e475fef59c797b5891a803348bc16f0a526af2754c175f2df2c7066cc1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=808f638dac63c83cff9295cb1cf6160103ae1d58f9edc2f9bc94e3fb6a7c0e14&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=de32325f069643f79649dc45188cf288290071ff5b41aac61f9795db7adfe637&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=01565bd6a72d89bcd2a7750d8f57c480b4b45b54badc3d2a3edbf571309ac708&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QC4PV6TK%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050804Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFo%2FwKiQYK0L5F0DExWNqJKu8my2DGXM5gKVaJn%2BiYksAiAbYk7XmsqWAWhpOmS%2BgeB6Gvu0LrVSxEmRcpGqeGPzvSr%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIMElG4Sed1nfoyc0%2FCKtwDiO8K%2F1wrxe84KWok%2FdCvk6MFsMOMfgNvtCYQSXIgISpyUbYG6zKIHnUtnufdYQ5wfKtNwtkWF%2F7F7j9PmZPClkAVB3pEF7dj0GB3WSSipFnuaTvLF9dvRtuG7FmFmNuYee5m%2FT8%2BSdRO%2BrVYDngH0A%2B0AQcmHTXOQ4MZsHLsRdV3uf0TkJaSMzlIS22Tyfc%2BgXpnuRsTnUJNhoP%2F4r%2BnzznH%2Bw87g7m%2FreGsFclj5eR8RXTa1N5eR4fzztJGj64%2FaGf38LGkSZU8KJGqTuoE9nzIJV4sM6mZj4%2FRLs%2BPSjcU4elzMriaeRCRRR9%2BbDSoR9iH6FsP7mBnMSdHob9R1KnTPGfKQM2cUXslCaGaanGfRvJyHocIEeqyxRWYvEI03kg3RYUF7PAtM0qrfQiGOi9RHhzG%2FdrfIvy4Lb3Xz5W9FeEkIPPXmdOHiZ9%2FFXLPDgb3Yc1JCS9xZVxU28fXzhh%2BLIoeEsSKxIlPaLPYG9J02u4SWW61w%2BsgpKe39uLpiolG%2F3BwEswbm1I%2Bi4k5%2Byms5RvWako4uH83Sqbq8ZGqxD0kYKexaQKiw2v4n%2Faz1w6XjJueUyA44u%2Fcyrs8EozGGZmtFZ%2BMLY8KCplpWlOqGGXmMfhpaxLSBIkwwcbgzwY6pgGGvgkIPmCf2YdzDOf0fYBtbnINXIzN3OgcWwE9M7lLUuUs4v6MBDWj%2Bu6QdDqnHCuzpZGa9U5sSYS41vhc8FPw66g1uYQhTxs9s6Oquo0QU2QN%2BlquV5fh%2BC43hIe8cTXZYjuA9qx3fl0mxxawkfTgvfOzdI4A5X8BAMJv0oiH%2FxQa6cFc4MuynpUOEwMB5ZkI3z%2Bzf%2BGS6doeqrno0GxGYDnpZQsr&X-Amz-Signature=848f1ab73d181b0bad7f8d8106742949cee43c6480f9e8363f2726e4b2808046&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ4WCPER%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050811Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDZKioE8Wt7ClZSAmEWmrAgrnOsTpDHKtyoSqN4OPtSfgIhAN%2F7gtcNd1Y%2FXqe%2FuxnGTLjczFED%2FEVg23JRB6W1XgzKKv8DCGYQABoMNjM3NDIzMTgzODA1IgxeY9lknN8341Q6T4cq3APQF0QhxrCudIJCmNgFIY6N20hULLY4dui0AWcE6sG8iPpiPikKGgXO%2FRZ6djl8vsbxB4xbSINq0dIrwx3GhjWwATPTYRtAE8XctiaZeAhoA%2F%2BX3e08eWMqQezJ8ojO7Y02njjbSSyVjZdayHV9hHpf4XewNCuAgle4bobbBFWovuSXhBz60%2B83TeA7HX5Iv2RllFxH8CHygZviL3u1DoWMK2U9CfqBJQxw8A327ayi3yo279VNZcT16EdSiN%2FOxpID9FSnIOxPELxxZCEcRsbqTAV6uz5QsFKQWBP4cU5KmJKKw%2Fhab7WOLUddEfOnU2x5h5nMPiUUiUtkwYi2VYFkEQpLm6w%2Bo9%2FTubaWkPvMM7%2FxKy2zXwi%2BeaQjjMRjrT2brGvVSJwl9rg23qcHNIwfPAiSHfxBX7LMwRHyR2rNKP2GDeLIAnk9inybQOuzqrmrAw8GyXU6DLtiFb89K%2FM%2B0ESbnGgqgqsjzi%2FMUeW75bmEWz3c3tTtnOyqQ%2Fz9FEAchBAt3l0%2Fb1ZvoZjtxpKxYUJ73NXXmCxjXHJazKZlPMN3HGoU%2FP5yOxxjuSFbsqjbDQ8WjABEPCveRzStNTvhFtVz2oHoM0%2FEXkGUFif1eQ7GyonO590wNoipyTCByODPBjqkAe1hEIH6%2FQ%2BMpwnBQxBcKuj64rgVSOJoESgu5UKDxRHpatQf3jqiItLphqqXnEd2d%2BixpdzI8sJE1bZSUk4msoCUYkfL5slxhPCr1QAyQO3BAiMK4JE10aiu9M24UBkBp8MFIeQb3uagqek6XUq9da0WPjp%2B65rt65qYF%2Bs82XyM8aEhUkhta8p1OLSIq2UuqtGw5ctYOT2B90S51fEl%2F8VYsdxa&X-Amz-Signature=fb3d016bda399bad7dfe3577c7a9e84f435363c3b1da3b957ca6ce5d2f6d1ec9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UO54WNQ%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050812Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDoMhX3Il02pYU19HIClwV9J0ExmqdA39CFKE17tNRqOQIhANLC5peH%2Fl7CDcbVCuSD6m4u%2FkHKfKqeToogINkFxl0OKv8DCGYQABoMNjM3NDIzMTgzODA1IgzqrigOF%2BtBW%2FtFQwUq3AMinkbJbqPYWq2bcjGkeaCHcKyTWoz0cwq4vhhJjQ4d5H57ASkxKOxxAqf4pjmHui1tto%2FMEuJgMMFCa0jUcpmoNonGr5cMZ7H3RaHGKvsIbC%2FkBnL1d2XpE643NLVt76dARKISP42qx%2B8pbKlmi3Ffp3m%2BFNBduHKjAzhCk1greXdmgfz1TmdfPPqUe8jGgZm6I3H4%2FM6M2u1OOsid5rciueKtCRo3yLn%2BnGXoKi1kAWTbFSgf1Ch29Q4UBBLgiZ3fnr3IdzLP3wW9Ete7D6Y508dkPXB3SVqgfAcY7ko0wm6c0n8ObkTV7eAMW8PE2BHA3Wa4HzNlQE5MwEIvCmHAgycw4OPW3v4UEZvKPMynODmL2bcSatnjbUxWVwBBIdItuTvMjevB%2B3s4Nlvk8T2eGywWbjEaVwOAKODvJ7rqsmD6n%2F0FkNWnyM809wA0KwL5Kc4GCj4rMD2AijcxlPef8bYg%2BiZf5jhqUx%2BxkxHF5peglFAVXPXZQvegBRajj95VFaKxzHrefnLyTxlUWtNm5nNzAkEDN0LuPoe%2Bhhn7v8QWi4O23Fv2SV3LeWTUBId%2BaFjNpz48%2BGx8h5EW3b1LNLCnqRt8T%2Fjriccg9JekTke6Ogq9a4CbPrHd%2BDDTxeDPBjqkAZmdEPx4h4whAGHa7wNQuEOav05zcBbE1t8uGMNafIKq2Qa%2FB4tttl4vdfgi8oxltm6s3smjxG1WJKDTs2nOoGx%2B09ytTl46O5kYedofgV9U3nr4iwpA2Vm35iXPb16iAUygE3Jm6y6pqeX92b2F0gFOrtb4H0k9GEIM45yvE2EhQEqbEs0cJxrF6L0GxCQ2314U8V3Kwvfp5ZdudEZSVIp9s%2F8J&X-Amz-Signature=91f07c5990104109d1350def37b5e0ad05bb0a79cda92e1b5b075bab0d9a8d11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIX4ZLCZ%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050812Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAb3duI18UKgglwBFT2ZaaClUsTFMcB4QSfVpVavOnsPAiEAnKajbjabcv8bjADsf7BQeuYELmBfUYTMClHv4PXEdS8q%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDO5JUWUtmsH8Y%2B72SircA5cxFwf1NqlXYHLAwWXT4mZ0AjXpZd4arGS4lIJcMvsbEKMGTGwZ4TJW6qUsPvJlDP%2FfYewQ14G%2BXszNrMYMaMkTF58LufydvCEznCqr8IfU9xVQFUvfL93P%2BHs7t8IIgD8C0QS7zAaZfkgQkgK9lLIHj%2F0GzjO2ofrXs4V2JWNQDN244cH%2Fa28ejgkVpU%2FuwAbLoZ%2Fkfl39uOHoqCz3ndftHpWgkNRzXM98qubnTHIoQGHjmUj%2B%2FA3DfnVSTAmd7cykFTWOSMJnGMxyD9KlYM2a2kTXQ6NAj8cHCQs92yhI%2B6bJM%2BtAobAVz2kuD38b89QtMiv90D7GXea8kuVcNOjqZSbv8hVoWx9fYdbs5ZpgeVi%2B7nSenjMOd42oNYg51wxx6kmPjwXPc7%2Fp2CxcalcJ27eKYqr1rm7%2Fs6f%2F7wvjyvERpZ2jlXeVzE90gSduQlwJuwSg127cTauwt7uk%2FubalYjeVhRqTUE7pqssGDywchhttyZ5bHc7O6O4pXG%2BVxxvwClv68vGYc0%2B32fAmAel3HXz2RI%2BCICumMdjm%2F%2Bgreeje3f%2FmuOKb%2FLLmqZKMLQIZlcGHMCNOwa%2Bn%2BKJPyp1WTiduAC4EMOzJSN82mSTXw0g9ej%2BNe0Bdyu8MJbG4M8GOqUBl%2BlTuLA25Xpu3r03S7ZyWcX2ige1fLOwZl4rqnaf6pt8YddHKiM8EQH3ka8w88%2BfAB5waElveT1PnVqI2TAJfFgR%2FuAqSW2L8iq2HLxwjEUPHtNvl%2Bq%2B7CIhIkXfnU%2BsN0RsVbkDCB1uxQrb5MsRlzQ%2FMxDD94h0cEYdxHjvIRrNddZX2XLMEZejrUIXh4NIyTR785v%2BEHuyuGrJ76T362e4Ulww&X-Amz-Signature=15cdea0c3ba642d98d1b0b9a914d80e84e03215fb7668bf46474865fd3e01eb6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=3594a8ff9a4a15196b4acf19ceb570b695a72fd186fda80a9ffa7d0c2c7fe8b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=b797751ae4cc004c68fbf680b8f30f10d0f241e87e31335c13a9900a72db0545&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLIBXUWH%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB7dD0CWLj5G%2Fk2VG1BOJ40oeFjJhgALTBL4PGuEPyA%2BAiAgrrrPlAARfyYGFIwNSI3%2BnvS06dcyuzT4FSAaq21L9Cr%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIMgLQmTfuKDHqcZ8kTKtwD01hqdt3sMga2HdYw9Yj1AlHqvJmo%2BksGqzWK%2FQJGT07lIyFfDeO7RgMfI01fA%2BKVKmD1v%2FeviAaIorh4h3psimR6mrynmRGRNukxJiZIqJ8ACg8BekktDDkTmxdfHCIK5s2iki1eGuzsZ29mXSVba42aC32l53wSDHFH6vpoHu%2FFTBRgt5ZU1SkM0NGgYFRPNDYEtOzJeujnhFvwcTRFNRxN0DRgQX%2F8wO4bp3oD4%2FOogzdl5e6hErkByWWIu%2BvQMDn%2FZYKECFAowQDQ6su5LynXzYlLd3ojqs%2BqiQu0I1AxLC3oLtcPb%2FukQsj1Y2BpDY%2FLjauJzA6szpvmPVILzKKPz95pGzoGNR5DJpLlqhR0cwNP4cpCTbjvxEy0VmbzMnsGy%2BX70TpCbLBhTEH8IGb6CjR%2FWDZU6812Gf98%2F3NLbEqnadI%2Bm%2Bmb1zx33iF5eVdiKhWMQUEfVz4gH%2FxxNRAdfBchMOajnOsABCUZL5hRpCX91L0bDSIhTTdNizZBVX3zD6vBIzIF8YPz04iWm2ik%2FMzgMVj1EOPD3rvNS6s5Sg3GBKOcI78V8jNwfQd3%2FHhido%2Fp4qEctk%2FBrvI4i1YeGdyaTyZVI%2B2TadRIy2eb1KyDt7nAB%2F%2BBd3Uw4sbgzwY6pgEGQZxTQwgidgkQPs6UYNQSFTrM3EMngNTlvNcRw3bpYeQn8QSzg8tkm5wXPZK4yfB0WZ92e8N1x%2BAvADq4nJOa%2B5cnPIM3sKJbZ%2FbwInjUMlAwix9xC6kv1q8TgDEHGX0VU0eDZkTS0NdzJ9hEwtURQFMLLecI1eMUe8ubUj1TzeqiRb3yaaDnB5pCnpAsz80ZMg1Zkdt378B8w1zG8S6vsxn1Hc0G&X-Amz-Signature=47c8006938c710ac1274c62bf0609d4fd469fba29dae7737fd6f23efe20e5fb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=52b191601bad292370afd3d88af0b66712accda688bfed4488fde80fbf8ef468&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SLEALGI7%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBgzrWpBzIjnygmBIaeHR2K3N3ZSGU%2FciQlW9E9%2Bh1IpAiEAsBE1rzzkSWBoT3Ecf4WN0H3RUOpXlif50vNgbZB4%2B8Iq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDIrL1X%2FCvziVg48WQyrcA0copJom3qjJ7XZrtFzoCg4HulwYshWK7Hn%2Fl3OsXYLpgDa8IVpuep%2FjirNNAbeSJLz8EAYPLr4D3ZOVmk46YTZolxdGpY5lKzSk1aLqo1HY5rBQanNYPdfe6jta97dPX7d4p0v%2BG8XwAbWyNyhpdJJU50sbepiX0DdUSEAB7FX5m0BrSZwZcIGflmCDXiW%2BdQW2%2FTwtk0BfqafLlshZOavd2qrozfMZFoOmSPt0Pi7tm8yN3xwy%2FJWx%2Bv9%2FUfvweQWeYxGZzBm4eUBqifSzhgMdeKWd5iGwQHmAxkw2TVk85vwcUt%2F%2FawPcjHnOdCAVcU2QCdfo3m87aupgT3VmuLfn3R4ViAR67F%2BLNmKSlxGtVj%2BQU05LFjMK%2Bup%2FqrN%2BLXGFzbR6LryLdfoZl6OW498oGpjK%2BYuDalH4mmhzKIbZspkIlk5xVG%2Bty3FLcVQCT0HPXP7vEKKzq2LZZzUb1Boox0EcashzQzpOeEY1hgm%2BFRcE5KKt6sn51gpuYQ6vSDmAf7gh%2FOmbSnpV7NmazrpkDuTS1ujb9sr%2FuPhDACh0y9Ac26EClgTciE0EwI6xkyrzyyqdVzLjRkN3UZg3JP%2B9RsdgQdFYVf7WrtVnXcgHE1nqyHk%2FrujcutccMOLF4M8GOqUBhOphZn%2BNCY9Ygy%2BLVMTtQJepKG%2Bzo%2Bpy0bFHbsMPtM3lK4oc2yEAWcl%2FdyJotgfwYW0N%2FaypTLrH7R%2FJIChotn6pzMU7cMX5vxKNwgWj4%2BoRH2FSet9eqDugs5v4HLvETcdio5ixQmNhC%2BNlyJg4KBfYa9YtF7H%2BpBkliYYyTMX7lpiSDLvCfMSW5azoCzpiDYjYh%2Bbn0jt153HJ%2BdbSSKj5NHWb&X-Amz-Signature=4d50b7672137958dd83de964d8b36f22697875f7aff6e9bd4c0236e576c5ce6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRHH5LNH%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCyVhzK3nOkMctI8%2FjbMPYwfkblqr8Zw9KhKtX3fnihSgIgMjSGl2cHdPGWMIIXbhHaPvUgJxVMM19p90AP%2BKxkM54q%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDO7nSev1yd%2BXWRacGSrcA0i8mCDVAsUokouPM3lxIwDT6M6g9KaIkoZRCgdc29iptn2gfUAGLgsiOJYpO4Vo3RbdVwfCYYdTHEJP1VLelvX5HBUKPA%2BrF9GmAG3zyCuP%2BCAV9xeE0t%2BZd%2FCfo7QtydyaeWAMVq1pxJ3zU4tI%2FRy3dSdyZrS4UA4ntCv7DdwPZ6pYlSjDtAkZvcH0JS6BQ%2FKxnoJ607kqcb9wOvpWx5d%2FwkJ4fP30dysffY8%2Bu3eOlHPPvHFrq3%2F6UdnxrdbS2VCXlu%2BJGiKqbFNoc6F19Xu5aQBlzdq1h6ioq8HzgRXPNow2AFezhzpFIGpiRr2ceN8uRuEl3OHLJhASNEYyV1chOj%2BSjLBAL5Q4vRJDCZuw8SKF%2BVzeJV2HbParJxMrghXrtiO6l9Fn69BjlC6YMxeUrVeuGJMKjAcr3J35%2BO6dY%2FKjS7e4VWvqZeLwBTGHYqqxGWqCxKD5%2FzHV802X1zLsi12mp%2F2ltJ4cR29NZqO4tYTp6czP3M5TngCgteFEtHl7%2F2tUGJRugii2jWDFJoHQ8K3Rvnuq%2FQrgvDDjLY4crkeRmSazycVc5TCJzTVM8LtTVQKA%2BA2XUZJrqjMsfEd0ilsA4T7sdk02sIRuHEsN5J%2Fp7YLx2A3j%2BiV9MNnK4M8GOqUBvPvDub9oWQs1mqNPYjeRqp%2BIrUe1WAZRKquoLNZ2kbtJqDC7IkhBeBGnPGoGkGPwu8Ks0ErBGoaw%2B0Ce5e%2B18Sx%2FVqYR2JEu8rZKhP8TQ3%2FfRLK8k9fpFK3Kw2%2FIlVgPXgN475GNq4LonK598Oa3XLu5nLx6NlmHjQExePi92sQS5Ib8D1HOQnvTOKN1RYCVtR%2F5FK3xwWh6Ihu8kpojV5NoDiyE&X-Amz-Signature=33ada97a728dd7c2228da8e3b872058c1e24bd2e5097428af4428409cd72b787&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RPGYJBAS%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCPbsM0gBQMsQCMojzuf697F3Spx7pzCpWSVUojGGZT3wIgPCSXG5qeo0qOGWvygeZNVk7NLBY2jbmDMPEsqmW87woq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDCoUPRzVgmCiAs8SsyrcA5v6aqKkPeLVnKcuVDPkIxxxY%2Fgl0xiKylP6DVRwjLxdSxLujRJiGc16PIEXq1NWFqWuVP2NIeoMnTU7KaT570Rs1VIedDLIE8P3Gmy%2BAOr6BttYOdAMeR8Fr%2F7fCRZEDdRx2PbgF6KT649fgW2NW8N9N3pio1Sf3jCVMD8th7QTNxOty%2FNgP3MflvUB0CxLanfScmj2CqbKCEmw8WKjzLRFnFpsyJEHNQv7OZUH8J5%2B1uGY%2BzYUXqIIOpBemyS0DVryKJS0HNtQeNaiXN2Ffa9l3iHymY8VEmFABl3tumkKBAy2YVzVI3I%2F09BdNsCO6dDXPLKX1njtu6sr7wqn1jFI60UkW5FPGlZ1StrnTAXGz0IflZg2jyVb5gaKC9DCjt1giH7O6HL5fivviK2xzFmK5tRcCG9qv5%2BGINsJUuTufzyC7XzoG5N8aD2rwWqRBhnZnWO8ac7ZzKbDjxl9nkFK3cqzah6jG7rwzSnRl1%2B5bnEGRPAPFlCDIXX5Gt45%2BgspPl17oAXEwdA9AyMm3zFVtGT%2FhZpnR8i521EEt8tiJs93Z9kCVeYZx8xVseXJhgEMeaG2UJHzNYYmo51WQ9keJYTbU3y41WqeN0ryT58dHhGEH1SUR%2BN2BmdaMJbI4M8GOqUBfKCfmdUV4bFxPM1dsqMI5HJd6OeVntKTzq%2FumcsLZ4BJf8XasI50%2FVL2aD%2FoCVrHKCcbIPKifddiEuXUBt4PlAecTTw0FUwqmhUlculdru2OrV0EQ0s5dk3oB%2FgHoBrLD0cccuiVqakMWGqTtHm%2FtQqYQN2HuVNZp9LHKi8x2x0nuXImdKLfxje0CnXfmgkIRxPUOc3fhJaUyYlH9cg6t8L6X3Ag&X-Amz-Signature=42450fb9c2a4b21074d50da50781dc05b466e3ad1fef796b2be447d2f4371794&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663KBY426E%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD3%2BFaWdujupi%2BAvjdBv6qiTjbS7ZuWFV4IyGoGIA5FxwIhAOxo5sIGeZRU7jwSqdW0EcVuDnPkQ19DDVvqUCR%2Fny8zKv8DCGYQABoMNjM3NDIzMTgzODA1IgxRMhTnLToFpYuzWnkq3APSNiu2x1t%2FJ8IHwd4hnyPEWsBglR4NT%2B1vutCclv1UTQx61%2Bo426Hp1xVvJh%2Bzprxtp2I0H5jNq78b7vYllP%2B6gsrP5haO7jCvbyv2LCHrNtZru8WLStkTm%2BSG46SWIqTZkcof9dDF3kmnTFXq2ZoUkBeCICgwgVs3lb762N848bj%2BdCJX6F2yGmHT85CDQuVjcMZnhpKeyfTSpuagg342CDcYajibfKVgBMmEOURpyeGbKAwyY1GSPPqpwgYy4IjFGNv13PdHHAH2N%2B8GpNxL0ofaNAHLzeueWpRnf2ivpjrtS8FyB7GrvHcIIgR41vROIoER6iMPeMiqj6tCJaxaQoBGEiL%2BvG6Mp7bzPEfqIP%2BJxgYS0PaPsFVTit17a485kevS7db7mZ6%2FFGN8HlXP9M3GGnvPsEDaWfXRlPkN3lL38uHN9qXkmxwXxIYSlAuG%2Fy%2FnUNODaJkwiLZg7M7kz3GB8rUVJwD5af5zRJlwzpt2SInNtm6AMjYKCUe6Rc9Y4WzE0q4nltlRRhwHaLnew3Q%2FDhzgNVF1SdsivYUMuc101ppYMRC6XsRSQBS4LZHJEYtuIy1dTGt0jn6TB3rhcUT7X9EAhFsiJmn9LF8TF52wCHpdE2a3eJHkSTDYx%2BDPBjqkAdLZd57b58VhUQ9dbDcnH76VUs0%2FND2h%2BxYMYGsh32y8OQ88%2BJKQSHV4riDyub%2BqyoHQu4GnkF2GCP2N4JK89sXAhubGUwalitikXbDWP6WQeRsR8zAwIRqNfItvB9aNOa%2B7KWKmiNF6XtLCa9WTsdT9LzG0hBZSrdPD06SMNPbn7qGLeYEQiY8ATttT2QHPi7Rbt4znbOmit5rdK6mS00l5SzB4&X-Amz-Signature=9e190d8bca2be7c8baa63df2d4ebdddbb9a75bc9d4fe6efc40216313c7ba213d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=0a67d24fe4054afcaa948550f74d09cd2e305c216951051dfb3a2c0538d0af0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7C4WBG5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCiaJU%2Fs2BlAFsxaeKjFVKKTBgWeZ7JRvTzX%2FJL5ANtnQIhALwKbYy1ENY7sP3DTtut0pcJsuu78kU46v9rqpEzqbFlKv8DCGYQABoMNjM3NDIzMTgzODA1IgzC1gfWkev1L1RkLMYq3AOBCNlrouvPWBa%2FoHdZyu3%2Fq4Y6RC9zrV1e7TJqCcK8C3XRuo2VrRsl7yrMcUR2Ury0VpBtkuGJb%2BR0bdenWCuNNS4VffPAImfvAW7EzaID87pF6GAmuereuJxnHsXIQpXc9U1nS5NBZdIgz0itaSaYBwfxcHlTGLURBOWS5jClbOESPANYGp47J9eSOhuJGn2gUrfdTryV6mkxB4TM%2FqeB8103LaLixlLUilOlRhdeaZbN9CVh9rgtTztlSab3RWGGIaaKXd4t%2B0u3UCCa3ZSKUQSGhM2JgmMSBdkKHK6CsZ%2FOEe8z8euTIM8nhK54iM3iI7uSXyQvAAw%2Fhxo19RLGIMOc4lix0KlwvgXG9g3%2BgExDtAGLbG08ckDwlg9BIoovSfYQLeaohhVDBWeklxLr%2ByOGWHivkRCCyqB%2F7iC2bo4WS40A77vpgeh8m4CrGd1gMTxWo8BBwwoQYyDMltUD9VR%2BPlw2XYDMROAp5IPqqIJ9QX9HZAimg2bvTlpfInDK7B6LS3EH%2FWIcyD3DtDk4AzwT%2BkjjJWFbpfrpCj0bpeTCwvid3DmlvM3g1o47lFWvGrbS%2FvA9wVuENYZQiuZYO%2B9vUi98vCTu3Fj1aKO0dxIpyL3Znx856RKkPzCryODPBjqkAVZQ5b4rgVaQUnT4jG%2FH4JCLXtOs%2Bi2sv2w1gq4KVvJB3cAc8TcDYuEmDYId3A8%2BS6KzQSh9LNf3kCH0hdfk4ZkdhwnZMec9roz1i4NC%2FY1hJnzTdQzaRWuHQe2vHOGCsolRwz8eE9WIowUXt4RFfMr7LzLh6SyA6X0woHzCOlrxt%2BUEZlHL3q1kjseAR889Hs1pNxxWvIL8cID%2Brzl%2B0sYCfvN6&X-Amz-Signature=0682bc0236f004a9cdbe231bfd41da35e9330b3f1682bf05187c5e30897f4df8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

