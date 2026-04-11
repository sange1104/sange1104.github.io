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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032054Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=66d53f58a6d3e1c1a981e7fb904ce37488010db7dc2e97d5ac556072c2604d03&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032054Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=2454308945093238cac9d58f9c2d976e16614a6caa1275dc6e90b07019fc2ad3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032054Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=33c1d9f1e9cac9a2f5434c71e06afc35fbec881c468756dac99133374a9565b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=b8842d725a14c29025ec396cf4a45c57282f70fa7109fb0dfaf2424994460339&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667XN2D646%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCICyvW8spq9lIc1DmewZGe5mckizaakOMCRSHl2s46OP3AiEA64rvwDYze8bT3DUwMKlFQjESZeNOMuvKuivPg2FJdokq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDK36BAHgX1OcsPK4fCrcA69qFQaLUVMmLCUWGeEjT3%2Fc%2FDl5yZvgNtXAgcKgLelcZ6qgxGTKfWxO64wgsA1ZRcVUksfx3S5yXx2Y6UkCZaqdbrPh5jcngI1E0Yfe%2FWhUVDd4mwYVNjmWpVTKbpir29yChTCHWpeXcJGY6oHolHK4tKYr0%2FK7LZfgaM0gnVTRfwaWDLZ%2F2tkIwBBgp4%2Fc1WFanw1JBTgj6og0wldprgqtZg2AY3xyr6HfYsQ1LBm73GCx3L%2FhX8xQ1nEtLZj7MV0UrHpqSQdFPf0aLOxeM5hTnz6CXXyKArNR09cIWrlBvB2Yxu4rYatuH9A7giYLFbM693brX4mtbro9QDeA2a0VPQ6Pp2WSWNklmFbH%2B0JDqmeromw1ZihY%2Fi6TZi3a4LCg%2BcbSZ9XCMlmG2a6v%2BqXHom%2FZt4d%2B7QwIxkPJMNZsYp791gjxoXZHurmoFVLljBCdLHJ8vvVrTAkN6zm%2FyM6dDpGqAFtjT4CYYEaYKjoId0KDiHudTDne0WR7ogP3EbAIa12i7rFE%2BK%2BPUK85hM7HI%2BOVR%2B9fgfN3EUNiUHjfbIbERa7Vs%2FcekjrOddGZ4lXkUMdc0W6MwfAPIqPBqCPZprjgayWyJbCAKixtSzrtzwOSFNr%2BuaTQuJEhMLLr5s4GOqUBYALvDtYa06kfVeEtHoKBhwCcGReNcxuX9WflySbREFaa8dBw3qi%2BZa6EUJAJonClxW1R28FxXrSwXFIjEPMlEoXqu3WVCOlYpF6R5CUisoLC1KazNhPcIW3%2BvGgRkF3SMDlsVhQXdrLGTA08H8Rcafvqu5RD2WTvHgxjDeMMHIz9sgQwpgKSsmCmpihrsoxG14zsfY4vJnFYG29swmvRYVQYeIo5&X-Amz-Signature=17f4ec37798879ba065808ab178cab5abef84c9e0057e5b46c6d9a48748994b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RL6EQ4HT%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIGWIQGpfzNXqtS0H%2FF9jvJoh1AFQjXQ0bn2ROloN2ypfAiEAxuHiMoeOKqxKth05gMQAqQvDbvJ%2F4sEo8J%2FzbHjqykIq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDLPl4Ji7fb1DwuuPwircA2Qlk1Nmb13U7Lxuh9avGMCdG8Dq%2BZbRRUB4fbEE%2FNVs8LmOC0s5grbswuq8hU%2BuPeeQf8EjF3O6Fky59GgOwQuq1qivE9IcfOMEwS0xRTSsOsp0TYJyjMETVVMiRpNV4Ei%2Bd6uoKtQP90LfuzB46v39aEj3cv%2B%2BZKXKysGwFVp4eOj1MuNWZe1SrT9qVTyUMhYIa9xrIBkembMWzlUTULqkyKCgczW0duyTjQzg556VulA1ps86qJm5VL0hz22iyQPTxCqnOFboC9ybOH8MW44tBUiUqW8%2BAZ2%2BGURkk1WkAmafEfCDRbSdteiQLkg890jskk%2F%2F8vLVIhFh7eG%2Bfenpp2OXOAwxQtwUu%2F67RcdRFnRVdT%2FE8%2BR%2B2FJlVGlZFLH%2BccAXj2rVzzuO6YuY6r%2F2sF9KQk2MpmQGzgU4B5AfOoJMynBLcyQyuNdCeMkOFMUOLkXXVgyFgom4psieRJEQ37opqsIOrLu%2BiVJ8ao%2FuCg8wwjQwgAtcXB08kubTgT5Fefvug2yH8ovbTQ8OVMSON6b2WBxgIZBrLfmxUotnQX9O3hksiI0gxbNa11ERs4og3sJC6C8nGuH17Va1bDJPlIEIL%2FXaIDRgB4ecLLfaTYo1CRVECMBMhlglMIfq5s4GOqUBX5TfTrttdasjUCZyTadzEh6DYXTimAKRkkF1IxoUq8poey9jef9frWlTn7HKTjDPitYC%2By3rAvY4PpkrwWvKaxVOPAHWSodsGlhERgLiEtX75%2FZ86EhSQQuJzmOF%2FV0Qm8S0nlnjxztaaakyAK4tUMw3uw5HG0AbTsalLrIBu4KRbRnPI5HQn%2FVib01U7tbeCa6lrpJ9J%2BJ6iszj7xyAIGmu53iL&X-Amz-Signature=428769df7d8508419c3dcde00461ccee66054ed37032e6d1496a91718f6a1032&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664XK6L6HX%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032121Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQDjG8Dbtixg6xTb5k5Bti7ry73idKXZQtOfoZc4%2BFbeNwIgVcLgxAc3VKKUZh3gknLi5XA%2BBf9EywPsg0gfyhk5QlEq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDJ2Hp%2BQHi2F1%2BnUkSircAzxgjlWMwZ7MzTZOcUQWA6UGsrt8oUBX7o9HltRHEiVYhvj9tHlSCD6VwqziWeIQV%2F%2BF5oDqmHQg61BBrv5ZPWcQAlCpd2p6Nu%2FcmALXRVllpNqEClBvqRT0L3dLL0AhKEQe%2F40m8wmf4TK2nTbCFxVzRgE6Kn8VED0Bt4Sbnicu0suBi6a9LIJN1%2B9dtyOIsKuRD%2FKrQLO1qGFo%2BjRiRHEmONWzsvFJJnSOwoACBtb8hlUKhS4JUwipD41cn12kLH%2FAimRubkwjGazANcHRksk8YvTS1%2FHCxUkVSBpqqsptHtsbm1dpnY%2BHcOjxhbmNIepI3dRZiiUdV7c40teKuGMo4OI5hbYnoCY5aM620T539xwf5mK2wwLAP%2BqMxo8Rv74a%2BN%2BA00ybAAy%2BLMYA%2FKFOqyEoAL7%2FEfKgyEK2RNXe7TH7p%2Bwbpu2ZmT3jUrE9jquA9xvJqyiPLYALLSGHX2J2KnMZEI1cHKOHMOnfvCHBc1KSYkvd7jrl%2FeTWtFgiYpQWFl1etvOcoUYoYSwpztUINcaSnsdg3qoGxmHzBUtMlfdHNm1fA%2BDFV0xFIwDSgjnAluA1C4NVnh9xajVw9jLKKcvsrewJd2uApBSc88JOfuIj0xu7qGLo4bnIMLzq5s4GOqUBWOse2dN3jz44m3WBTLF2CIjZCHmDN%2Fi5vhbQUtpnqpm0%2B%2BtOZ%2FUF40ftRCIVnikEBrlJRxpEYTL59RhSKliVDSURBU13XsqzD8qmE5Eo71fm0CNUeQ0Oa5uXioDIeeDrQS6%2BvjsevUv6KMAdOW0AhuAfMCEBgKSIlV4mE7IrhL1q6MKSOZu8Uh%2FjWnQL482K9spxTQTv1Rz%2FtbfI4%2BJJZPAMhx06&X-Amz-Signature=ec9e888c1d25a337bca398e83ad2f6156997a9276fea2470df518daf01cf5f0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V5H6IC2E%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032121Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQC8lkYMdtAeKRvTxTvnyg1S2DbDnOKnUrOzOwsjab8u3gIhAKuM%2BiDZDPXYCp09iIpCO5e98wf9RWCBk%2FGtR%2BEq9TwpKv8DCDwQABoMNjM3NDIzMTgzODA1IgxCt0hdZD1HBgCN3OUq3AMmsg5nw3i8dJG6eXn7RPi9dA32y32KXJmchEMbrjGULoupXyfLu9LWpQLq8gysbfwGwVbYPf9eAyfvd4J0WpDLG%2Fmog7AJk2Vizq%2FwdyWyA9TEkXN4d%2FpTN9CVwmTQ4N%2Fm8xEmrN0%2F2oP%2FNoaBpdvN07sQ%2FGB14xW4Ce9bCbO5yRDfWb3cTC9FJyBfiyf0YLYjzH0t1sE9CYV9rO97gRizv%2Bt803eyOGAx9VsUV1uu1DH2MzW%2F2IqhOyiZEeZyflEXT2MuWnkJT30cSpT0w%2B1yaxv1gHNmk%2F2sXpZNMXqhPutFMnpc4IF%2FUSAgpxxUOeX053hlvEYTt85MqPXXEEIXMk%2B2VXLaWLc%2FHkEtMTX%2FMRP4bqBFXN%2B3mhTAPeWq44H%2BnoQzxgRKUl35%2FSKWxu%2Bc8BayuFYMVsnoMlZ9gHio7vSQ3CQK%2BF6PuMjvGe2nRYPMetob618PgLS2sObq%2BncF04KTclEsnPb5BVQ9CWW%2BugonnYPXQCN3q6GLZ4YeeIyOPIkdd4raUhKHRsVFuUzU5oh87XfkC0yHEQTLiDNUII4MDn1fHDxBfM%2FoYEOGERLZQOvfOe9ZNxfkFyVLRmYti%2BaZGI%2BNj2TDJEWf544e9JjiwQN1BzzZx5cLjDCi6ubOBjqkAYP6%2BxtEzYqf0YuytiquZm%2F6b54NaBwK2I4DaKfSGJoM%2F%2B2u7Qr2BxEvD8XXzmXe3cEqLF%2FvC5rmyEkTsCvJU60Rt6SKBO8NZ1GNekqgiAD%2FZyKJ2l9jYUnU6U6eKZPqjFiZi%2BW2xd7FZE9CmG3JrCc5PmuIe1QuCl6rFcB4XJytwLFagvuIS0iA703kAbzfXz9SlNVR05q3NQIbt51EFB%2F8BOos&X-Amz-Signature=23974bcbedb981b9c37e0b064e42166e3c5e34c1b8dd2f9cd298ae8bb145e47f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=6ff0bbbcc3fc6e7e996357ef851bea4ca1b64a2560ba1cbbc0f44352391900dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=07ee850d1b761c5bcad5fbf80553bed3e891ba75105b23e8f8a7615a25995fac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663QWOMLIO%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032126Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIFwDT9m2kMje%2Ff1UXGhjH9HDipBTdd9Wl9guEAXkmDytAiEA27lMfEd6fy4OJD72XIpQ824ebuvtpKGDEruj%2BDjY7ncq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDEI2N9ljBU4ogP44%2FSrcAzL8qZN%2B6Pf92exznJU0wlsV9pXLFlcyV3%2BYIHCc9Tt5f7R2M3eGotAKK%2BRIrG1SItZQtQ3otbELj86AuxBskyKW8bHA30tTaWSEZgCEoQUOV5aykymPUukYvGnboYWJRh%2BnP95%2BibH%2BR3hngBDXJB0jui7c78jWrNHpFGXFNrWZjh64sThGykAfZAdayPoFdJUFy66odB9NvXRQMqmO6lZr2csgxjldORCWSoxovKwMOOtZs7i%2FdTVBKRlrnFYmhbwPWX5l7RSYczd3mw0fKnbn5dyq1eWPt3dbi3MNwkycB3fEbC5Enmcgf1R8VUOcHMazixHqgzKT%2F80lvR5gZIfwrrkQQeRMsNHzWocijLHyhRaayD9rqU1jX2O0pKQ9zuIVR6DrJXG4cafwUaPRIYRbZ1daTj%2FIXbyBK5ZCr6yLpeaJmITJ7H3eBy88ZvB7btm4B%2FkLs6yGH84khyjS%2BbP7yqeXH64zzXxvcye%2ByWYLxoxS1jXiLq3HhozD6QqEAT4KJ4KaivebAIlZE69VWxKhBwJsVKx4phFrXeAvr6zOjMayOVcM76VtI%2FlxEKlbdlKONUOih9EY06ACps0PVkWII1hLosE%2FJzkmJ0KoyKazjgYNqo9w%2FV5OMsHGMK3p5s4GOqUBqA%2BHfw9wvH8pspH2nxpLohtjsuwroiGRo51HHxJs5X32%2FDNCGVXujgCRzIi3ULQHtxG8kgo1zXs9ibJQpeFlgde00LJxB0eorVWnNLf3ubBuDvZVj7zm9DCWk3jgmWg6CH8L8xEGjPvrS%2B7ok2GSmXNB2SvwWv%2F5VUyuiQkK4zq5JEInQXaMyWy%2FFWCy01l7PjuxrWOpHGLUKwUC0a1bgEhscqfE&X-Amz-Signature=e3bad751f5d57043ba7d7da0912c951f972fff287a580a4b53b127f3c95df514&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=33fb428b39ce1f9a15fbcba785a2eb6c9d51deaeae5dac1da9c5fdf40e4297aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZNRAYSET%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIDlGKB3UTAa4J%2FnXsyD5HD6NlLpjDlk%2Fd3dfL%2B1AbloqAiEA6TxD2TOzxt%2FkZXl6WiIgWYrCDTQdi3ewjjQ4gxBo9%2Foq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDKL%2FEp9K3tNGSDwa%2ByrcA%2FvcafnBCOEprCfaSJGyfNADXtIETNx36Bqj4Me8V63Pxz%2Fez4bxi7%2BgY1XT%2BIqf7pDgPkpl012N8GR1ESdiEFn3tg9x6ZupAyJrEH7fv9xtnp3BeeU%2BKJa7Fm5J7kRLatlH8auelrYipvTTxB%2BcKFqICrNWPxe67rXau2Vf4ec5nhAjeI5xc%2F6SxV34mxHKNHJeAaJq4uoGTJxctoU16W5U9qxVM8joJqTawIffJkg%2BSrCFK%2Bu23BejDGT7f5SpQKT0K7tqgdNTWI5r5zz3MTvKh%2B3rDLw8xtDZfSjCf1cQBax6GPd6X1x3dZHpwBGe5%2BKVCEwK3i3eOfcd3vSSitJUvswjNOTpeeWUXy6bNFHVs%2BwbB%2BwdQofZiM0LefyvXlwSilFb%2BTsvaXoVCspskIwI%2F%2Bvl7Se3%2BekX5UwSp3tH1AKbKHqZtgAomD5LVG6xQXeME%2BHKCQdMPj8yuy%2BOaB%2B3M1gAchagskoGgSkFdSWJ%2BI9NS4LBO5A8%2BalqgSxcSKIYG3VVVGT9nK0ofuxAN89mc3xJWTmrDodg54Z4DQpoJ%2Fs9qnowyfbrvn5wHCT7YHZNAS%2B3fwQUmxYj%2BwA6o%2Bu50nDvfrYYqdGxo3D950VGqn6xk5Bx%2FtjR8dPAMK3r5s4GOqUBF1LC3bWdQoJGVW9CQq817BKYm6EDPLEPuznic76HZyzLhw11%2BOrdI0L3leK7IKT03quRwxqY%2B7g63fyW48Ist6Ni8VmKyzuAc0x8fTE1dwuGn19JJLneznBa05GdCk52pg4wdgIoO3hWW0knivBhX6pqwXVN%2Bdb%2BwZtwI09ejhRSOh2aUF5dolJ2mXtwouvrgP%2Fsqv8WKU%2FIR9eeEmGIlbZk26Di&X-Amz-Signature=9eb24508cde0a75788c6ecf9b84d5efb0d9fc4f234e51c848702f79e7d9bd17c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFMA527F%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQD580Vi8OBCY0BQeifhS%2BqAJ8jEt0xsRRF2jdYNx1Ib4AIhAN2N8J%2BsEFRQahx8MAUoPZVq5NFdbgsGmxSin4fbVvHaKv8DCDwQABoMNjM3NDIzMTgzODA1Igxk4lEqIhEOJ%2FZ%2F5aYq3APMwuVDOXP6zONXwqdsw2N9m9Rub6NR6cB%2B8zPRsAl5vStJRBDGB%2BDo9ihjhJE0y7VqZL07dEE6HQkZUqnel7uiTWfyS5MvKwuMxQRcWrO78gwemb13pJlxDLDYzvA5WwhHECrp24qd6QRKqyVZL8nDMMScF7oUPlAd3dsDO6ZplBkjtmMce%2B4gZN%2BvuyA7I7N4XEEeiAf98u7N3MYExI0TGIztuUtXURwQEv7CQSYYd04DH89c%2BP6k2thzfmpl6owMMJRc6BJoOIgN3SfPm66HnHcAmd8ZMkNv%2FQL%2FmqKbnUuxekfxhCn1TYS4cAO9MwRnxIAjvUzJu3RBwMrC7w3OMdk%2FliUg9xM7G%2BgoQs0cf1d69yokmhNZCzFo1TtQzOxzhqiYw8dg9fTrsvO6XTFGQrHnG6j%2Fvk%2BohrmCNacP%2Bjx3xHYHwU4exsFfqdLzE6sCkxvm5coQI70md2R4C7twFwvrL05cN%2BupZAl%2BPhG3rHpyAXpr6qnOMl9dMOwDEcev304txKQ2f77xGOYh9shyp6hKdbU3OK4QhyWqrb71Kqu8kKd68D%2B293hLqHnyRt7JCKcI0xJn0BE6EOxoQOSldppFkp%2BlJtPPA8Xdtc8OaVIIb8t18lRqeywapzCv6%2BbOBjqkAQunTpQTy1RkAjy6QT2cXb7ry9PlgBHYLyJfmmWO7OdN7Td2R78DdUyoJFFCzjYeqvhj%2BTA%2FvdyWFI%2BH7JM2lyZCWRkSZSN908K0EC2sHg5ZUlxoRbZ1DLLNz4flLsDpmbexDxVfVKRFWtvqNRr6qUhOXkSF7WBenqipaClTWE6jujoImf3DbLenMrVk5TYayPT8AZfZ0sX1NAHu8XVtw03%2BpV6m&X-Amz-Signature=0023b7ab74a09f82b7f21a0f62dfd6e8717f6c323836cb80c713545a8fe96845&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SL37J7HD%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032128Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQCoWkh1rOczc20FJN%2BaHypN9OGQ2kElXJoMYVnztqlpAQIge04%2BYfvdW3KSBFdfhiH2TibOOzNwhLh7OxCE8uMS%2Bjsq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDAo1JupjqY82ITQhOircA0kYHSjtYherNFVp958qTGO0%2BQjXxyvwHr5anTbZrTu1pw2mIgNnKUBxnJ7uyBGAbdXkQsZfd3kR%2FbeCTtbZ6itTqf3IkOXGbzU8cCxp9qgvFyVC0JsBFPQ56HU%2BR%2BqS2Yvk8RIZd3B%2BHksoFN%2BrbYhNSZ6bhXaDCJu6SBaGd3OPrUMYsI8qsF7B%2Br1kY4rfvRTgCjopRVdDfT6a0nKzev4QT3rx%2FKJ2qusuS3utfd5tEcxx%2F2o9yPHT9AJnYU8ZzHQaVDsulSHXSJVy4Xi7CtIACRZaIvDXhaBTX49zpPa3qAzrCBiZxlKDj70dXPiG0en%2Fz6FVRqJGqwA3kWjjpOZm5YpjT%2Bplt49UgiKOMUb1%2F2DXp%2FZiFBUDApgqQTTXOn1B1TW3Sirivai4DpWfIGAdaqVa7vbSfRVDMMmSEVHRGVMRAtZIqXWKVZ96xtCPAEUiaquNSTuUvDwlAXRevwfQc9nbW1PRgo%2Bxa1Er4M%2BHhyQhUEBX6n6rg%2F%2B5uuQu1AvcwYN8JG%2BWJO5kexGagrbWOIC7yONlh9VUmJ8QFq2xulb4NuVP4ALAPc3t%2FdLh9BRyHI4Gx05BUiAkqoZ29GGg1Sz6GShRPj%2F2VxJCXRowDz7xKA27Tls%2Bry%2FwMIjr5s4GOqUBEKN9VDlZt%2B6nlrzgSH2BnjmFQlLZhdr4KrwWPqveXBcEg%2B6YX%2Fb68LcWSUz5uq7rgOdr0zvpJXBTnNYyAidQx0ApDWqkIhHoQkIjtve6lt12etnEkkJDY9ZmlZP%2F4z1RqnH2YR8pY6wtjEkYYyLvplMH6%2FiptysfhMeSz9yu7PsFfonGukjXC3LsmtQ3sieA3hY%2BRUI%2B1piVix30L9snOhBgPk%2Fu&X-Amz-Signature=a122af70f73cd3252be2daea6e556d3c0a3f32c56fcb7a9e1db59a739fd34fbf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UARR5FWU%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032129Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDotXSC9doxqRHneFVkYAFUGMzihGV6%2FpyvrYP6j%2BOYcgIhAKx8SZMEZm3XJ1j5%2FKV1SXgBexi0ZcWNBOWxA1B6hfQrKv8DCDwQABoMNjM3NDIzMTgzODA1IgyAtbjqxW%2F4%2F%2FXF6eEq3AP%2BSw33AUAIuZeO%2BwfVwz8klryEat8NVwrCdoLSHp0v6ZcophlcoSsjGb%2FqSOOIFUXHyVc0wLJXXJ2HE6r8V0xF83LOfXo2AhWfsVuwtoQKAv5F%2B%2FiHVAE83aYKWw%2BCEbEg0GBlG0DGX2aiFQIZSKzsdzMZVDlZEJqUbWfc%2BSJzITOr%2FWa5rpX4joJtvgtaGgCEkul0OC3ERiXqtxmZm%2BCtU4lqV1yx3b2GytVq9DTicZGL%2Bjj4xYM2ZPuteYX8m%2FiH0Kyx0FjbmDMYbT4nC%2FuvDuVWbde7ZvW2fywGpkLvRuLk1kpMdBp3tCe%2Bnbad6l0uC8cyF8ZPhL9B4KECNDofONcYzDs8%2BtBsPUXbdzxnc5s5eXqg%2Fp2cPmYH28Wc4ctZMakNtM%2FXQ3Odz71ip4GbrFZDztrct6dvH9PwDojo2Xw0ANxmMV%2BwcguOapRd%2F9Ucx4iUA8QkoCcaV6JBnGCJdJhN4BX43Xhwjlt%2B1kCFBZTK%2BTJJd0BLUIQFTH9Mzm77P4E0dt0ilclVKThYlMuqZcYXv7drSidA3sbGhYz%2F3j5ulGsxjKI93YlMaHC0N7t6i%2FJl9yxybc%2FZiLDUs%2BT98fPTUtW4HUhf2rogev%2B71neU8qsSk%2FpOOgaw%2FTDg6ObOBjqkAbsKW8w%2F0%2BOJMxyK06lr%2F%2Fr%2FDvPAXxHVgtfX3ZGHhX1wBFEn7aOq9FtoXCSDiNitxlbi%2BSdfdqxVv7eOa3yXcLFm1NjaTcA9fBYZY7OteTizEti1XhifjjB2APHbSLHs9xrZHsZTuXZUbmKIhSzQ80QR9Ms8dCdBw4AuUQzVb6j5gqxf2HfAY7R1ES6jXQK%2Flt1ShEPsDQcojZ7I%2BI61L8y8YbFJ&X-Amz-Signature=a67f2e0ef4da9837beab3fec532191909ac257cf1c409d7f2f6d77f13cf87b54&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=2a4635d417739f79cb622a2eadf64298cda2bd4afc6e8537816da9c93e0b47fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HM4YIST%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJIMEYCIQDvxr%2FBYJa0k7smhETPo9X9Bpy4Vz%2FP94E7v%2BiKSyT5CAIhAN1h2tytqhwvJbszMPoxByLzhRITRrGBpomIbIxG32EAKv8DCDwQABoMNjM3NDIzMTgzODA1Igy53dwgRK7nl2uHQAYq3AOkCf6j5eP6x9uZezwWj%2B%2BUYF4UTfGXC6UCKB7wSjfvhc6WNcEDy7f1%2FNUbJNF%2FIzNiKQcJGbqlupvCtZWKNGIh0pIlZybJ5PK9xqG%2FMz0D3i4E6KpfHRnZw8M%2FW8H1QnDfey4zkU06dfrHq0ffA2my5nw3v5bG8TBLt5lf3Hy0YMshYiKSmytiaYq5tduZ8MYIu%2F5vy8L7KZcw6yzWcxxpoqnJG4JoniU%2BcS1gvpjGA99Z2hhCAYhVsW66j%2BpZGBc1%2BYuC2dngTZ59JjEQuMVaw4%2B2fzn0jy%2FPIAdACFh%2BOSmEqRD0xdRdStEDkOnHojx9HPXiewZ0%2FBNRHil6BQAVJfaz9tttWMj2Z2JXHmPPBXoBBzWwSluo1qUQb3XRAE6aXet9CbQ2H5twdGzkCkQz%2FK01GF0LuDQxspc4NdmMyypRU41oYLPGRDKlnFrteZjbswjjpWYXv4L%2B8zKZoizPRkB9Qg8RwfyrHtZxlIkn1NXftXO7pcLtuolInE2SDZiZCF9FJkZ6eYHxoTa8ioBSNiG%2F2eW%2FTSetIHzrrtKz3IOFkGzWBz61se81wWGm9XSpQ0gA%2Fhd6RyfiCCFRaOFWs2zrWni%2FIsINY41woIS7pUzGXcRqrIpIyqfyJzDQ6ebOBjqkAWUoGTNXztsTYNgHZ9H0tz9%2Fk1OuC4caMDKa9r%2FwKM0Qrq7N0jbCNXBFZub%2F1OornLRtpBVEKErmZXHDT247uwiGodPPij287Dwo5ZLlxqGjPxfBzoCsPOBrsdptkGmHJtQ7zgLEtt%2BVJY5aQ1hktU%2FN5l3W1odoHG%2FF4TwOydVGOKGXT4jGez30SCkxn%2ByMSzk3MYzpSUb7v0%2F12SSCrvf%2FLjm%2B&X-Amz-Signature=9b9858e8d1e90fabd7125b98565347b1f0dc59ebf4ad168b37a105ed8046daef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

