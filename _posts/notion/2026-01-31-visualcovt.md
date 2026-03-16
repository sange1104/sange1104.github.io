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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=493f954b1e9c66d998883f09d2f3124a2740421a228032ae32b8bd2543301a98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=c0f630cd89d5779e8e45c65d0f73b7cfbd489dd0a1c01d8b6b721319800746b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=d87762a7f86f256858bb6edf09a508d60d95da35bbd1961d2d2753b96aeded7a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=aae2d0d8f51f3510f2cb203dd00a5a4ed5b0aba7c5bf84db1841368bba279912&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QNS3KWYU%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIAYhnDGdmGxD1fubP2QoQRivrwpBGk%2BwIu8VNlegR3lJAiEA3J2m246XkKluS4jqhFG%2FBfBfCRufYenzs0xdJPcn1ioqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPmv3aFXa5F1sgyvdSrcA5dcuXRAnd08KKNGBFgEXECC6DzI2IUWGmxcFRYCcqLYeNGH%2BYQpumMd96gCa9wjVmgI6pk1l3qLVS8tNo37GpD2kAIJarHybJ9oRlUDFYbBL2j3rJ%2FfUIbEp7TfgDNGfMYHFwCIpWb0pok%2Fx%2F%2FJbPY4cZS6Fj8yk3JllYUiD8gHLMkR%2FsV7fSmCp6RI8XEFdF7qr%2FjwH3yTrKhkIdziCCX8HbJG2hmt3ZysN2Zszv0YdK2or0mmNDTnzLQkAOQmCtzkeIqcIoyeX340FIlkV6xOJapUvhe5KCfduU0TO%2BSx%2Fvbj%2F5S3DfJgsl8FkI8YAWcvm2oF%2F9hcVZiUKazfszzJ9ZjpDin8uNf0f2CSADgy376UB84Khqb1hNpOfl33LXO0Nimf38df3WoRD%2B61oMcnVyhENUu7u3OfGerD2NXS557hBq5dgtxm4BID2w1inx%2Fmdb%2F%2Bo6h25rVRzSt95ZhC7PeTwd7A3xUYLPA7pQ99jyUaY1lEAeVzAzBkL7xv29AGcPqJOThYU2OzQyyxTBLi4pthI9ppDgP4l0Xt7favTF2godb1i6skL3SsU9Y%2B3QxQcn3gpOsYpNJGAnUlxeKRYyOcGbrUdH4HUD5qJoR7yD1x%2B%2F74uoJmdBTfMNy%2F3c0GOqUBBxQdETmARBXHKIghIhf2Aa2MVeWIGH6P%2B%2FfaR79B0VXg9%2FmHtMU448U7OGdGaOqphR7wmG0RS1lY6OlRECEC1yhU0hCdOTOkc0FIa9UCqJjVbBYQh43xh4GKMQE3B4dDh5r1MkPFMFgkwxilel6hFE07RoaXCaO%2BqyE2ljsYt%2F0ojAvFaq7hXeUmgBjSCfmpi%2BsPXwpy1bbrudR7mBmjqJ6fJT%2FV&X-Amz-Signature=e60855343678e1f5446410c3b8ac7f6f570ab3b57a2899a0ed1c5a450301e15b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XP3NRZZG%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIHZRdsExH3Voph6sCzx27wDEiNYonSL1ZraC7Ul29pfjAiEAoKNtt0ArIC8mGXscCRuguo7YdauOgfLC6ADRjhBziGMqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEN8d2Q%2BIZQmzc%2FxFCrcAxy1WgOPVBdPCCz0avuY3hsybqbe5F3qfX1eqPacc2yEmoU2yKyBIqNlB1zCzL%2FYlgze7ChzLaD4o6HdSvh2ZvhI3iTfePMFdHkUscUKOqQXaYNO3xf%2BqAI0ARK6mzha8JDD9hFWh%2FPDTZxDWgPSQVISFJcLKKTMyszEZp5DP6ginWDmHDypciYzO%2BZY0oWZmTt%2BLJ98iz7n%2BuswkrZ6ZGgX6v1SAt6disnrmxsfusxv6ymh3MOM92tjdyaBlpQC5McouJkcFiW6YMo1IHXLNBHLIWNgH6YY3LToV%2BCog8xfhYSs3oknChAjrD8Jtj2T1%2FweO6UXqa4GzGhM83jtj2sJz0tHJ6Hqi9XM4I41shc65uUjQyKd5TDiRZ1IJZeShtGRa6SitfHIKZ4pJCmwMGGiv2rEVxsKmR1Euxj77u7IWcjxJWXcLGR9gvF7du%2BEQNZVUt1Y7xiCbpcgVhzTNq5BpPjVwxRxPraAWYVcEsbxnb5dqlqbvsTFbCaCQqTbx7%2B9S7Tme7FN5f5aUzsCdXfysXekxNP5uGnyfC6PlzXXac4MVh7yQ83SK4uwGHHeQqXqwnp6aBM868VPOENg1QnSPH7Yj97NHbZ31raaXmuw%2FscHajtViHC35svQMM6%2B3c0GOqUBr4Cruw9xrj2%2FQQqrrG0xWn9V0PyFxQocqnLpx%2BDBXD0lDptxeF6P1rXQucxNIvmV0rDH3Vth07jmU1ffy1FjvHhoT9oaxT19lcoA97V%2FW6ICA4WkokBMt%2FjH7PdNzWAidM4FFeM3HNxdHF3ZGPtT%2FUTQLynVJh8IS8ga6Z2h8I7LUxTViKcewXuS16SC%2FjBALO0mAUkCWRx97XHzFXmlPy77Ou9a&X-Amz-Signature=de7ecb307848b066ad398d54e3eef6c065d925d058edcfdf26b156c333777819&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RRQCVOZQ%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033621Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJIMEYCIQCu8cg3cO49ArXtJWDGiizS5vfCNib%2FeyO%2BUcLEg7W%2B1wIhAJvLXSqrT3clk%2Fu9c%2F1mEomeQAdIRAcoJc8E3ffqZ8mGKogECMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw2UJa5iftdJ6WpwzEq3AOV1SiwoM9ov9%2FwJ0Q62rAU7RUsEy61l9biJg4G00tjMNoDQlOot7MotPq%2BfZu%2Fe34MUaYBwf4WFGz7ZEy8N2N0EN1bNVNEmKIP4Oh0POAGaP18I1SphZQOMtD1MNv1%2Fi1cK4OyY%2BA0TCUdqkLXBK789cxAU9MBCaU3CjiwsQIy27SdTybNlpJUKDzt2YR5iKox0ZTXB8BR72Nr3vUcLGvPjJQKe75AyVywkoZaG%2FpOIi532%2FvbA8H6VEExUHq0iHyRpkJEP9ZeiQ8RbAIe6YUh6OzW3W9gXIJtXqAFGSR51B4Bm4BLVzSGDSiIZiuiOsEPeWe9FQBmcX0i4uUENM1AEX5ByGwDCrgg%2BMUlU7%2BSrl90zoNRsHTZOja7J1H%2FIzQcVOVIWjg1cr%2Fqc6N7HFrOgeHWM3Sdlg%2FEZp7vX0wIjLYhAXZFxMtpVrsU5P0ptR6ElMxWNdC35TvKjhXtdhfNtfTGZRl%2BLt4C9AWZufROKKvo1%2Fby1gBJu6266QHdZeWDgQ86U%2BGPVrQE23cVtp432%2F5x23Cj53vcV62Oo2ONWqF03wZ7dliK4Z3L4jFtp83JOfkpoiOpz7TT8JeRMc9tOqBvXkO7y0YEf2xl3a50Cc6qj7YZxfQVtWFoGDCQv93NBjqkAZfQOwo1GOV9qkySfGpZ9Q8BX3JyvofNpug3nv27T0dqtMnn7UY8WquWS8uCkuiNywd%2Bv5QqtC04QB0bkQ3%2Bfz%2BsNDj6%2FGKslpJ6cpKS%2Boia5okRK8k3A%2FCIQRmERHUnnQ7YPFz6cDUPSsYMAuT13nyRTaSEzC8TXSEjVk3dBTKTEkEbOMKy50q1SX6AekUYHA3JD1dzPiuLhaB4t%2FyIpCGInlil&X-Amz-Signature=fbae2e79520f9b6ce9439eaf6959f8a14dbd4943b334d5596a93c821f15688b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z7PCNRLS%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033621Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJGMEQCIEVLoi9OkvAqV2%2Bxh2SOATPSKnZ7yKJLs5ePTw0AxQgvAiBUslRIVP5NbIzpu61nt%2FdA4Mz6x9BKQGr6fwAlz%2FB%2FVyqIBAjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMuwOls5k6uDUyBQaZKtwDCQWj4DCFnYEiCNREej4ATRtBnjdrzZDnTEfVe0hYmIbmh9fCctdPUB9lYeCe9rjp6LKZhGDQD%2BB5LeJUtw2RzXAHFISvV9kk1LyM6ALObM6zbsT3zK5o6QpWnBD0yiSbv2iaBFt18sTnfJZbJC02pdZIFpq56N6R4uX1O5zC7DL3DJIvjp2se%2Bji1c5EBeLkdDqhBrUVVvZdxCtoMvVuxCQcf43Yf3g2rfwmuScZ5VmQDqaP3lvicuNxU0vT9CqfjTH9Wk%2BwvfTQ%2Fmb84e6EPSQAn8ik6sqrzZ3M%2BOKfLBrfEgj933OqaHXr83bYgaIbhjuLT%2F%2F5E2ZRDiBBoLoiNxKU%2BTpD0O2rvCMfTdyKteYnlYW8m9vNWwacmDUdSEym2VkdYHp1Jgf24Fp2A0Os%2B9U4icMrtSZ6ztIliCTcATpRdLJJUc3qJJJypbDFF6cWxw%2BTII%2FCVcAyEx3LnpnRJhknSEBe6C5oJ7kF7kG78p9T5aYDq7qReD65F6x9WoM4EizeMksnWmbJwYqnI%2Bfl1QLavB1nO8WPOc9EdMR2QY08pPhFfyZ01H4XyXAz%2FgkWz6qBfD6K9RU01fmYAjjnG%2BiKkq200rEr6%2F0M0B8XmbAAqLaCAX%2BdpT0KYyEw4b7dzQY6pgFZEAy8M%2BTtpV3XDYuwmRJAdA5vyl3k6J9bhTFn%2BEE6ms2KGp6CCTuYlTISGx4aKpwjROL1H%2Bs%2BvOTw0tAmW3rm20DPiQQSLOlqPBS4%2Bco1qPZa%2Bbdk4XDS5BYzGGqvVXOf7SPGuC16QmftbmhHDj8FCPX4dTvkJfYuj9pTf%2FNgptakVpEKe18iBjOB74bOUb9aw7vcPA2HlwrGkE%2FTBZLLQhTGnNEu&X-Amz-Signature=c4ac8bb83d14d2694873c481d7924279e554970184102012ed576b0d702ec48d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=93506bacba5584cf82af5d50d395b17de553876459bbe46a6cb11c232f1db7ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=dd73feed9a6478c0abe33af5192cdf4316f50c36e57e15519ae75150ace1f5f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667KHGXEEU%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJGMEQCIBNaiiWYgYUxbs5WfeMgK6yQ84S29QahAl1EO3yiZrDaAiAEKqnA1iagbEd0k5OKnM1TZjcwdsTuithV5%2FpUTQ%2BttSqIBAjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM4s8QC4ADPSQotLabKtwDrfWvfCgU3N12ZBepsgKVQcerf4VhIuXPOjEIsF7NQgErVOOxL0aQib9YiEFMdJfJpXz6ZA%2BfwQUZ61k5Mgh2hgOlsrnzHmuk4XJVAVrvXcdHgpZjxEWQ07NvA50sX5FxZS5MK8bO0ur5%2B97DE3bdwgx9rBEHscdXKev1nTjqoFgxeRs3g%2FV139iFzSkuG6Pu7f%2FUwa2B1Z897N2pbWhUW%2FHxfOK8yPgGXyl0gwB7dxwBm9%2F4zdtfkYkJrtWyGI5kZb8%2FZodRPsQEcLxVWQIy8mi5X31LIvgLiIRMMxgTfm3cJfhVWxwWIQ50rSBNAEl56iMMOIGRKNg5zpZUMftX843cMPM1kfqxeZpiYA%2FsX5QbNhzO24cVn%2B%2BGgdjC6F2uQ0ppw2%2B3Q%2BchUXH26pcpheviKuQZ7LAcotjYtZHw0Xxo4ryBZCvx0uB8%2Bfy%2Fvlh9OXds0RYB1VgiWutjnDuN3rAe05UZnXIuDMw%2BDcweCEmbycoYz8npnJhPxSPh7XjcSsTWFpR17Nmq9ha22KGkkej4n7cuBFVhk9QbuDSRZyAwYeUvQji65zij3yKRTa2EM0guxEuW%2B2l6M3630pR1qqA6EgkAzxqAezaMndztqxCSmZp3nPBhS5eW%2Fmkwg7%2FdzQY6pgGfQb8N7f5MtTWYQu2eeGNf8qe5M7ro9i7vFubtmOdWMnGhy%2FbQkR91H6XS9Vc2aPRbS9xRkOVYgfhWDnfRt3x8VWriG1yqKXwhJXKnxS5lIiEkU%2BCsA0THagahT9RdkVBjmWi5KeI%2BGuVcdqtoPumkcO9iu1vghM2bv9JmMuitg5gQwOU2c1JLvkZVNc8rqh3T2qdjYRcXlzsNcwW4kHqxnLBWNiwu&X-Amz-Signature=0fcc3fcc67c7eb1c5d93899f4a9dfd0e4b73a73da8aac539d68d22f0c1ca08d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033548Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=5fb17f35b1d312bf9badb6b3fa978200e807c7717fa6956a07a86bf3bad955ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQG7Y3FC%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCIFv1nwH1ubek%2Fg%2FUnc2fiRRezMVctxQ9e4hcXwqKnDvbAiEA7AfQlBIMQpjp%2FT0BLfUJ1DYEvr6Z2rxY47X7pzSXyCwqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA981MLRnNx%2FpLEAKCrcA%2Fg1W1nVSmg6IhyRDLm6BGSW4OtBw2UX0CQnm6U%2FgPzTUIVAdsuAW2XaZCrRGQb9LPXrpnIuelI1K7T%2B%2FghfLhsfr8xepuEbABGDRjdUROEnkUwLsHmvAHHaMd0be%2FtkZ6%2BqrZU%2Fa%2BbO8%2B6TN%2FmUVPANhNunBaV8yThtwymaFOxcM7FjgwzwT73vTngoU1BcxgWIb3l1n%2Ba%2BtjgxKKQO42zqP%2Fgjaehwlamkor7NdqvT1y9z0ber4FwuFK7%2F29XQ0rBnr%2FWsfL1MONI36C%2BFWmh6ChzLCKmI%2B%2Fzs54983ZqIBBn%2FSh%2FjIpAuAtivr1c3J0rRwMMASGQfi92Hx%2BUyoEi%2BiGeFLTvDTrvyUSn5%2FtXcZv8Ia9Fpcdj%2Ffz4aETdOKgZfBS0BYrqWzO1goquPcTQ4GyxofIWM60nP92SqLbPkMW%2BaT35YpoeUryLhsOkt2aePwesjLfFM2wwg0x3UoRz35Uphtlc42dxbglhGYCareNyR%2Fy6e%2F16%2B9uROV5AF81wnEKBlgSzKAxC5WSlSMcBMnZa5TOYiwyRW3LSQYIjqNE9OF3NrwO51F69%2ByZP1AIAXtvoummKCoXW94S6TrXat8DQoC5b1xmi0NtYT%2F7193ZIjTzeRB9szWBFCMMO93c0GOqUBtiKgqSgb0MA5cY8pXB6YMeQmMxdDXW4KIMrQ%2F2WI4XA7YvF2B2Vi5a%2BjgaPrVg4ZHyOu%2B5t6QQHB0JRL0ZHKzEhy5GJEMPa8v%2FlXzSsHhc7NXqGZh4n35GPpKhH54dOaVw3OuR3kA4yrLCwamRIHlfNkjeqA6vo%2BUfvfMB5vKTYBy5hB%2BZz9LlDEgq3gemy6PLl3bau8kRDOEAlnjmGQ%2FiMuPuaD&X-Amz-Signature=05f97b4e4c15f8aa3360928e4a9676d758102498bbb47e9992cdef33491af104&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667D2TZRVF%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJGMEQCIEa24DSAmmUy%2FRYsNiyg%2BXVuqEv%2B0088KbzfA63Ib%2Fo3AiB0Luz9d6ZZ5ZZg3g7tYQHBhD4%2BSb0cjfPIJkLvUzmzDiqIBAjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMsEXl46PQUfzlHunFKtwDavj94A0d6s59plBE5fPy7rwwG1Nf3rfmv5aN81ms8Vg24btepA1uIsYf%2FkHqx0n95f9A4BKI218p77XW0NquVMXZZrN1QIpXxzGFdfba9nbivFf75XqpU20jCiKvYD0BuFALcyio%2Fi6lx1Y0iLGPYTlqd%2BsfmBKkC9IHo13ka4%2FzT1eOeOXsVih%2FSHnvJj%2BRP%2BiNAGZpoMNC6XsJ3KE3jOCtbDIsVYE%2FoRW7QduKnPOyX7U7Cbw8VRX4bt6a47xr%2BpXJCnBrZW7%2BkMmIWgCrRVhkGMUjo5dgGXKskKnRfZCm5dZA1SrcT7omTvgEXwLuTedEccSOh8Dy7OBRpcMxB1j1n9Ee4cvkLpJRnQh9hxHYuJzcCf3xlc5sQ8H4Mr1SxS4MVoGIVsepqIjb8ko6mr3j9U1YX%2B7cOwlC9NMuyVpamdPc2Qtzerp1v3GNvV%2Bk2ZcuZNK4A8PTBtQlhAsEdrHRFs%2BgQlzMpKJBgKTMMOlHdW4HBkAZnas7jsaPz3t8MPwIoGRD06zAPGtTVMBo3ndYQdCdnVFghwxeOw86i3zJ8%2FIbUDu5xyz%2F72h3aqhlaCT%2F4v56D1%2B0vNTBfZSXCGG0Jr1Ap3If6fJW1s7n953tdYbsJ27Bb9ExDm0ww73dzQY6pgGjjq0%2FcgyWa1xhZFi2kprTgHA36pVq27AMDsFtAVJFijMOCmbeSUdeUe9TpjRgM2iQR7RwxWiFoeHSIEt1saHPd3ZnFj24i92UWXogHakTjUUmHxJmtG7eWepotVbGxiRKNWt%2FrUWvGmcTn0QozeC4a0s4SfDdtJqHj93XsUyw0f0SUasEMvMrjS6QI41sFYX%2F0ckRwlzde5Kc6%2BprKYCXQFlTp5zM&X-Amz-Signature=12476a3716c98cb90b7f66d9ebd5ff6659385a1c85e1b02f3b8782b9bf9c1d79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOCR6KCN%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJIMEYCIQDY6Y1YN%2BzOaEeTF8B5awZpX0Gb3PFLjD1NkEkec5KG7wIhAJEy2xrXg2nNx%2B1l2ynxsxKT%2Fl3SOdmn49Khi37CaVnMKogECMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyFc5j%2FwaP9btBV7KAq3ANkgnrOVpm99BqwQXkGEJSL7eBLW3Aasxb%2BueB1CdYyjnKBYAjhykm%2B%2BRYVou1GZmazG3OTG%2FBEL0x6lnEeHTuJSclbb87ViOnxpCozuouhU7SrVDnmmnmgLiIy7YX9ltQkMX8e4zl1g8umsgoH9cAznx73lKch17Y1CxwhIzqlsNSVq8Q20LTN9U2yZjLwtMnIAzdpZtMNbvkkf%2F5pOm3YPZ0h1RhOWqtaZKfIMX4ICRqhqSw%2B1AzjmQhbN1MueC7pRCwWQr2CHOgBTB1StIthHLP5Fcq0AI9OoUBqo0QAwFlh3MEsChljyaJv6QkSvPwIqwP4uKfdk9aRbOnUezBDA2b489QmSIv9KQP4rwSclHOM1gjT%2BtjDYBfL%2BggzaSZPVYKA697NAyamywtUxhJLWgsTS2Z4maxM31%2B4LR9322IhqpyE3Tq4LUdHppLHN6FogV%2B6sDW914j53Bbz0TsiDOMBGsWok695L%2BKfHQs5Pi82PIi2wOjcj2m5R8cFyS69TUgzVDd7vFr7jHx9Bs6Qe4%2BOBPpjXdH0PyF%2Fz6wyQgAXqhRVu6LZRoXiKxjrI3ky%2F7FaCy7S750RkpBADitNQLNXUxjSVrI%2FWn8TVRtB0gVzHoHQeQ6tek66XTD%2Bvt3NBjqkAfFbsTbkLkIun4TFujeKRv%2F5kbhrkR3KGMHdzZNeAvOXpAacHVh%2BOYbSgYYR3joExyrkRwVRZ4IJTuSS1OshZd8COsqsuptjdb76sS9oiM3BF7xWZDLhvv3YlfnAe8nQKWl0p6KfWyiVU1DYkdFSCFjHxuz5bsOaRk4jj1quyrgVSJfc9Kja%2BnHsb8rMnCrHRB1Me01AiH%2BaMTWx2Erz2tSIDYds&X-Amz-Signature=a3e79e2e0779fb65fc066592bf1846aeb831ad5f1e8ed86c1a08b96b81a19aaa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QCSJGOFX%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033637Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJGMEQCICWgSYacXno%2BzYu8MPitWjZos1E6HuzYCtRDP4j5j5jNAiBhncruy%2BjuWyLwuuqHvSFrroicBGZhqwvSM1IfStXxNSqIBAjL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMUEsIWBiebzfd%2FAeaKtwDom1KDwVq2LOXY%2FfvJ7AB7u9i8x7eXCSsC860XS2z7qeTn08kOgahEqmGkjYLiDPl08Pd%2B%2FEWIkoRA357cVh%2B0WiMjKwfPKyQsuKwVCK2YMOUEE0yVAhQHpApnmgOLeQXv4HHDLIUAZd0dIjP%2FBu%2Bpg5nH8mhArJsrvplRRuKvVqT%2FWUiSpdwx9oRhlbhhH%2Fla2zBjwHM7s8%2FiKfY%2FGnpE%2Fn%2FSaWiOuE%2BBS7Juat683iCAq7GBVxmJkUlGL4JlBUP38tgMHoJHDY1TDPpeKdx7avs%2BITavX3BQvvbpNi%2FOUEfXm7EDCtSoQlEXOf%2Btavm5PrRJk7vJPah17nWZy%2B3kxa0FUzvm4mkw9eDLcsv0SmZ0fdiiNj4bIHOvCVN%2Bi5KC2XPaAVtJT7EgtTqLSVw7Y0oeAq71vREYKu9FIiCfVBX%2Bvf8xYUwiIgoxbmEb3lexu5AIL9CrGfit6VmkE0hdDenzLn9yeP9%2BmICuUiJkb%2F8DSBE3SwlzqzDKBIKbuCVdp1QozQmQoaA6XD5ZwJH8bfsM3DmyJKgzC9lufMfXIVLnKz9%2Bu5kNqzkSMU2VUfpCrV3Tz9uUyJ1AYXfcY3TqwzvagmMhl7yg8O6%2BnAaLCUN2G0JktZ07IIUFQ8wtr3dzQY6pgEOwHCAcTUZs1uMeYmHoZ0V26iyk4QHyZcRcFLOI5ywSQylTN28vBArb2hTDUrBmFtO8GNKHwpxJyqdwsfcXjmcR%2FjGJ%2F3y6Zl9IGx3clqp35qAD59AL92CCCKfb%2B%2FRDnxLEtCqHq6UjCcbPd82aRAvDkz92GS9Hty7woMDQfeXf1N2sqniBOdtCahx16U7lbK78sH3hPqZ%2BWxlPdWIHlpw427WWM2X&X-Amz-Signature=9c8c4a239d1dae6e077e995241ac5acc998e047e30a3ff39848d9c90034fcf08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033548Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=17bfabfdc8f42a52c5fedd74fc34b604ad7e4c12d201ed41acb07f74f0b66c2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C6YQP65%2F20260316%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260316T033548Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLXdlc3QtMiJHMEUCID51ObNsZ4lUrBqwzNY9kinh2cfSNgSj6f6qFYaZJ2KvAiEAizkXPhQiiPzHbGv5iaab7Tels0HsPG94F6bbE%2B4qqnsqiAQIy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpjzGdb48RHYQ8pbyrcA8WfJl0dPYE%2BioRsDX6lgvzQgFGcAvW7EMSwKTQTu%2Bwoq4SSOdo1vuvSG%2Fj9iEYbokymKBwXtPYAt0bud3rYk0nIvzrXdyaYg%2BlEkTm0YY42eWkyDCuZm8HqgMI3i9bh1U8C7BcnUibFHVB0g4EMRPpzYq2cX1xHdFfRuK9mbyZuAKAwuj1uabjO5sNItIlLv4B1AoP8JoeGvuNPZqIdTgeJg9R2hGcp%2BNEk%2FHmNoyg4%2FZiz1GOhd1zUtaBUd0bn2%2Bd1ePxpBXfQXCWU9bM1wRe84L8fPAk8vIyCXDTLJtk1IQKyi0jwdKuowWYcOQ7usdqQPYQLjGd5N8QqZ4PQwSNM6LzGuXyc8WCuANT1fqO%2F2jPAcCp4qtUaJgNuU%2FW9bAxPQo65XQ%2BekraYUsmCv%2BTO%2B%2Bvwmw18RFEN9iQg4x6pSy8qTdGuVYm2YOa7iDrOYQLNLls12caomwOHgexf5qMP%2F%2BRPlubDw%2FndoD%2BOtc%2BgYL41RGNDVsYRlb%2B35G9A1tjeuF3mA0axq7WboDd9XYhQ0%2F%2BqMKshQbOOBV68YIHsFiBmPZBpRwe7aX1ZTH5%2FRlJKaHo3i%2Fzrg1DyIsMYhPtDzAEkB7X4tivKwXHFnxmipH8SsCyxIc5n2WkAMPy%2F3c0GOqUBZxebusw%2FrKRZCtEojBdnqdlZFqfdeokA9S%2B1NqRFeipcaZHisUgT4DX0qgeyZs%2BDZSc9K%2BvS%2FUJoiTfIcTuDyGFrHdRuq6kkGqfHjbXaD6e%2BLPdT5qz%2BS8PbIAYLk1RlFVMGFCOke71gIPBW7buDWHrXIOExA8USUio%2BEDTuh0o%2FJo%2FjF57HlGEQRHQArKaH4q3QD7aRbZuL1BWkMAYLxoGCwM3B&X-Amz-Signature=7ea58f9670e7866c4a7f17db3d4c4908fb25a9af301118c8cab377f1d65df65d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

