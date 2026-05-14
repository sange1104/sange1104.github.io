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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041422Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=b3d2664c1c1c8aa048633506cd59238b51bdbd971a92f4653a322e56fb6bb083&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041422Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=2c0ac0ad26cf2116da15744dca745eac93d6071e78c3b63aaa40a60b64472895&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041422Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=f821b6dedcb625b752e6fde0cee42a8ce3b01238487aa34442183d4618cc3e37&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=4b5567d607c2e671b093ab81312b51965db53ba7f0959a5b5816fc133f24c9d6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46632HGDEJ7%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBr62ByjnAeoAjkhQqyzwnrNz2b9NBzNEJhtj%2Ffcjy15AiEAqCun%2B6bvimWc%2BMsZ4mn4OkglKg2OJRwYOmD2jKl9EWwq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDDXRwh1zpZvfZjZqHSrcA%2B84mOxQnu6r7fkngHUso3MmeWOaqFCNWcm3%2BSmVpe9YhNLcCY3%2FeQMtG6TiWOiES%2BbN4iIZYPHxoSEvIAoS0kwLFQpV2ahNbA9OZaVCEJQjoiTVDquhTq32wNzqTh7lXOXm7BCqwJUhzd%2BMwZjtJh3nC2d%2FdaaranwALv4A0INX%2BCd6eSUF6D%2F4dv3k720GDkGzgrUUsrtCWmc7M27n1og1wbiU1rz%2FgiI7%2BjUJaF9FXZwMrNMzd0f9SUHd53V34SVRGDLhwTFSJB5gyzQI4TC%2BtZOvu41%2FUMZCak4mv94WCkK%2FK84bVMSfXSLTYUWAk%2FmsBjUf4woxBDZXjqe%2B1pbyuvdR8m2%2BDm3h9WKO1P3%2B1vFtKl99y7GpfZgtg77PYMtnN92SO2PlV1DFlUQL6aoXxiCwGSdfU18PpswhakQcBx4Z4J161dL2pnJXcW1mPYBUqTb2krTjroDpgJx2ZmTwt1h1YEKL%2BNvghVGIccaDmNzpomt8joRBZtedDAJc3cgrNoJh%2B6SVZrRrSv4KcSrHjTAVKL3IX%2Fsv2Ri5yMLQ34ctSAvPZIQdSY%2BllErt3gZ8%2Bukny%2Bwaetz4N2CWtOofalG1igCasFdnP3PoDLLsIIeDP7snwPyXX45VMM6BldAGOqUBASfmRdlMnJuQtDUYmILw7EieeJBmWmXHIRLykndypEudwIT1%2Bs4ayt8CJqyAMz5X9mUTpj6AENUkW8dFdywT%2B6guhJDJ3yPGcDBYAHnLF3t9G7TpDVbKrRlSEpiFlbXvTHCg%2BchQC75D1KoqgUde3iKvJh%2FvnuRgJpGltM%2FnkfiRhKoZ60uIp0tblHQAPe%2Fs7qoPzmaTF54rzkccBv7DVBsWGz4i&X-Amz-Signature=56b7cd855e23de2b84bb02a907d0de037fcd16719a5762ad21905c256ffd7f7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X77YPKIG%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041438Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFyAnVQoeRh%2FdGUX6Ps2k17rfwiKGWnM%2FnO3xkQ8QSqOAiAQlBA%2Bag5spYjyC7%2B9gar526QXY61Au%2B8szZ%2Bs0kSnKSr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMXEniE8%2FUhmc5Qp6dKtwDGKNJutjwdf04K6NqhRZi8wRrKVlE%2BWPSmhYCp87yxpKkvbQ3Op9%2Brftipdo0KI7rlInr7R4FHh8Rt7XD4gyJWKALP9%2BUCRrtsMTf86Fh6HrvhgZc5TKO26ki1IXy3Esqe6axZr5qiCcj%2FExo6ZW78%2FqYzn0GmS3215eZhZsIx8PmWcAwF3YfA%2B1Dv26Ck%2FwMvp4yJqpMoH1XIFj%2BgYI3YGR68yRvxxT30C4XGams4RXg2TfldhjpwIqxmxuDKUCZzgxjIgBFR3BbSTO2njIX9PsqwseEg9x3lSpk1%2F2LT%2F1qwJ2jRp6fMhGwYmliW%2BDKEg48zC8bBXF1rpALVti0G8czm024rXYuTUoUTE6IRbSqDDhafFK8TvKaq6n3hPNfuhA2K8CpMwYJNiMO9rD1ABN2TEqlFOfox39SGMzkNCOT%2FAI4fIrRFaMRKD2Nk%2BxOyWtl96w60VIUSV12jL%2BjEJ16hphjRo3drAuLUK3XSeGsqcHZ5YZMm9UkJzUgYFLDiO%2F3DNFZx2XrmhascCP88bBG7D0G%2FGI2s9oXadioLsGIcq4b7eBWb9ruCLUOij1N9RTFRy9w2FoE2lAGEkRH%2Bfs7aiqZxEpMaLPBHczk7uZH9F9NFObAaslKIwswjf2U0AY6pgE4IxTs%2FH5214WAZlgU%2FNBw689QLYY0JV4roBH%2F0K19LRYPL39CtY36%2F7FatBVKDbvQn2LEldzx6AvS5FT9fkznlcA8L2MpljhvtRkcjGbBPie6tA%2F%2F8NvQvZZSciOV3tlM3cVjTQ%2BYx6tCzfe6b45dKlQobmuJ40yX7sC8C4g9%2F9bJhSrjDyXKV2dVve8memmkO2xdceNyMKUCWpRQwdiLiTpnjChr&X-Amz-Signature=572e30f4c3f65fdd4d21658c2f5eec7a27a9e25355f72b13293095bffd2a6142&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZKQJNQC7%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041439Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFK70aCb35dBo8J5K7H6oJTAOrMKx41saeArWs3LWnCyAiBiFz62wUTw1ROahjxu%2FJbiIJhQCPeEOC2Qe%2BKmuVTNjyr%2FAwhQEAAaDDYzNzQyMzE4MzgwNSIMrhzyEA%2FZcIyDaM46KtwDncLjqbVXA5Q%2BXKvu8Hcsek6ogftHuLFhaYhXOqmsVXqZ7BdAJwaXEXAujqhYwrUEyN2O4b6O6laezOUum0G5esS5hSk99fbaafJaI64xm1ScmTh0ln8a52uwQnz6uWZQ2KXOQYnu5NGcvusMJKnkHVmasYlukpNPtDkayJIpDBRDGrQvqPt3U2dJeevihfYbwqqHV48sJlR%2B%2Ft0VTf8MPg8n42l%2BTB0FLXsrxJIHJExbRqf1e2k4IhoDxm%2BXoy43swvpFiukju2L6WWr2VPNQPxk7SXCcecwKqg3uGR21VpL62vmbq5FmRxN75YfojokJoiPndPmsjZWc%2BI24VN5bKQRNN6UJ72LnxB3jOR8apjiuK%2BWJT5cLqUhHZ8bkNq8viw7ZY73AHpnC31D4Q0Hsv9UE%2FBEfxvoM6jCd9I%2FNWxEhdLKXmYv8rg4ITXWYOLIfkjjl53s9fCD3MpTPtVeSE7dyLholY2ck8kffvn%2F4jxBwLjcysDh9NQ9NxepujzRVn1Va%2FFpN0LrmU79r7BrwpkCKIbzklKiiWlRBxmOZVsn5vkxXTCBLOu1hLyT%2B%2BcsmbNkBCqjkafEQRAcWB4G%2FzGEPIwmwIcQeyCqOXT9EECZB0LDs1vkjXo6u14wwZKU0AY6pgHMOyQHZ9bl2zqVm8x%2FY62sx2Ng4IOHv73%2F6eVcYnk6fWhoyacUfxgI1zUFufUorb%2FmDVXNLdpo7q6UQpMvmWU09f%2Bf46DceiglVNn4uuTbmTFrSuGq39wPyo1jB4JLacy%2BM6U7PI6BIJijCdFN7P3N%2FZThv%2Fsplt69bbx%2BSqq6jlvhNaP2IrAccUG2XzknEE85zVfKkcLemSeih9Htbt2Hr5l%2BdrsW&X-Amz-Signature=10c6b097e20404c5f729211279caf8653cdccee2a71b48b070ffe96654f1579d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YL3BQAUJ%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDJoBuFCu24UUaSkVHG%2BVU2uPSBFVzfZVOEGsrJlQZ5FwIhAIhOdEiGK89rd65IJyFgt15N81jfmOxSVqgC3vm6JPfvKv8DCFQQABoMNjM3NDIzMTgzODA1IgxUcF%2FN2Sb7njywUKIq3AN7BKlldaZHTUBiI5uF8HY%2Fg2aolec0wVrJilCFJa%2Bhm8B8tUGvM2Zr8swMomjJA0lKaW2dMMF%2Fos1BrepoI08CJJ%2Bw1E1n5K9uKlrD%2F%2BdyR6omuYrybLpRIfycMYppF7rGjV4S2YLvg5X5wLrnFrIZy%2FeXg%2ByAgMcqVHJbqzwqUQQ1zkNbwUOaPz1Fv8dK6NAayp9m8z%2BMP8Er6ZRf%2B1npEL7Bmv7Q2kgbxPDoDOaT0w6DRuA%2Bp%2B4L0mBKRFP7bpbBlXi7mviJHVunr6OmJFcIFUPaulyMMW43i9mQeaiPgd%2FGqBiMsDC45r955Yo%2BVwUiRsiWeOdFl%2FB%2FXDoFMp02%2Fr0DPXxxnS3hY63%2BebzWvBEVYCOyEY1CbvQjXSVGS3mg6wZTR7pfaGWVYSFk%2B%2FqaEy00FZPsOeviF90%2BZzE1Km%2FGaX5qYyZF4n%2FSrCSIIV3%2BHi%2BaIZCskVWZk0Vmzlb2gcJw5o5Gs%2BRcXSb2LnEZfrIUnkA0L7DBAZoW2rWXDswLXjSBLt%2BVO1jJrtLYUH58RuzdMl9Jaw1KIF43la%2ByYagZPvfJl4Q9LitJSFurtqJinG9AbTX13IaqddMxx%2FgSESXDQwowZJlC4ytfVvCszax86B1uvTpRJadHZDDy%2FZTQBjqkARoRpIDIQEQNKbkAQkhcE6rPMux7%2FLSWwwyOAiTucGs6RYR92bhAOhtLf93Tz5bFvns9yi4OO%2FeOMlotXO4TSUsdu6zD%2FgN7VKcaTiWdo9VhX8GNZfZojU4bKXY6%2BKLU7T1FMAp4agZL7m2133Zm1p34cu49BGy1ClleKtsvMSxz%2B77igV2CBqby%2BcwHPcI6vhDy6H65CYjBKcnN1JX47DC9AyBr&X-Amz-Signature=d3d31b6627fe278d9f524782558979398e300efe90e583d5571b08c908af9e28&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=02ca4d8c9770da078388b577a7c2b5fc625c6bef808d9c7f09d0a03dca79de4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=8e94a9b9ef80e7ab808428d045676e93f243e7bcfcc2e11b13da207e52ef5517&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VO6XS4QO%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAojh%2BrNPyP7KEZ8HEaDs6yCVonSynBjNuiwvqIeKNF3AiA6KElv1sl8mj3QawHob%2FbNu18IPaAOMGArY2k6%2F0JpJSr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMzW3gU1PZ1mQlrVCWKtwDoQiP6SV0e%2BT1cQh%2FEIPkEhPly3n9zLQqbzSsFu7I9V6TxorT4l0ZBzh8Ifp458M3MyKd1a8RxyhNSWxAYwFyY85No685tFzvh1qJmFYYWjcFLxy4kvksAsLCXcG%2FeY8c5Q0%2Bx6tPwvoxjBlePvQb0fBN9PMtXx%2B%2BZ2F%2BQ06AXBGSXSZARxLP1Xa2Wroeu7Fi59%2BW7rTeuiYov%2BO5Z6ie%2FqVKHF5R%2FnuNwyTNobzcrCJGRh%2FrQcxPfN3TkzwUACDEUKa0OkoCh5crn%2FD3HNy0sSxf2OWw2yjSRVeJRsP5lKReCjD7FLfuSsLlXLhdDjc5JUP5Lt508%2B%2BDhKUcLkw6H2yD01KM8zkrEga8mwAcObmNOf3%2FHnzjErylKB5ZduEnup6vFgJ8ODU0xdWQ%2Fj8%2FbRviVqK9G8NtezqwBiBayaoRSYUvU%2FDjdoWoN71JUEnu75liaRDZqEdTOAN9OGi8cngMKtA%2FeM1VJJB6l8cRh%2BuiwuTrP27K8%2Fg%2Bc%2BEhbZZbMn85vntlq1BQSKgLNHO1mcjIhdBDzaE4wef5A8mwgKDmfZkU1asjrWvcQg7hdRRXytaYguiG%2FKmAPpJV0eUJcpAUSPIkN5gdUIkaErRypDuSGpVOKkKmop8ryEEw6oWV0AY6pgEmSWSxzMnJlwHHTNheAIUMW1PWyFRntgTLHASkyXpPZIolbuXZDDFqEqfOEXA7NezMNxDoA4jFfLrlItpr2mDhW4evLYrcLtMMuCAhw%2F44KH5mzufZhVocPzAxyqIZ6bzcxFhZMfxT0Is4fVffnq4G1qN83%2BqEqXIcEUYdLz%2BIB1OVFDzBTBSzMEEquqT%2FxKCdlywtjjZXsfF1mZRSnrdrY3Bo6dcs&X-Amz-Signature=1ee73987e6988874cb1dc919062d4e44b90bc0819b88cc57ccecdaf7be0b45d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=60a3ac1700d60813e388afbea450ee62db9cc2a993df8272fca99fc34171a238&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJEWCYKB%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041446Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCLEGPqGk%2FAKWTW%2Ft87puWqt8Cn%2BDTDoRFVWI%2Fo4phN%2BQIgD9G8cmbrUD0u5SXEEP22FXsiXN4Z5fRiz9bqBJjo%2BoAq%2FwMIVRAAGgw2Mzc0MjMxODM4MDUiDNpRzlI0q9VgWDdwlircA56Hi2nKN62498NcliJluc%2FZ%2FFCmtVkmqc27LgJFLOLmr4rqi7qeWTEKC003diQO%2BvQpBmFtjRMvZHDhQClzCqgkgyioh2dLDItCoY%2Fc0bPqM2uObX1BBwLw5AlkZTzLJ9RqNFfqprciJNgD%2FeDiJmwVLTYbtwFF09ELUF1LeAfrBXPYoAeXfbYAQfwUMfq8dJUFbfXJxFeQmBLkprocBlT2FapYqCofgnSnx8DLI6XTRE7hZCQTRZafGHeqC9D9WGqA0TfaisenaE7WnOwdbGJJ%2FdO9ZnR6SB6nvnPzQoI9c6g56rAg356GfXhNPiu1TrEuGgI89%2FjqpR5EBBC%2Bge54qoUtCS%2FOa0LAvoxUu%2Fcy1g7xyCgTMxjTKJ4iKZ4a2qtw7401cCFiB145YAM1Ajl5K1fVhrmoEBtFhzMdxHB%2BfkYvGHPQcpnPmlop5Oxok5oSqxndsnws2%2BJX7tflTr36%2FedYa5P6NVu2ulIQGGtKXmjrG1t0yKwiJQM%2Fnqt2b1Jey2l%2FL2GJ114VILzEni70RfUW5a3yCOFB8WlZUhFbGsXWQpqfBuMP9Q%2FDxDaSoIe7BFGozeq%2FFi3Ag4%2F6bRFUc03x6Mi6fJMYKVkqjS91g1qecm7kpuMz1xVvMIOIldAGOqUBFvTIqlhy0qC%2F2f5Nb11S49Re3eKzYw2gKKqX6LLsvWHoEPFs9P2LtC4GBMNyH1EOAEDNX6PXombVGidaalpxJmRPjqZn77qPhDr6aUsumi48d6sMHCV65H3WR1Sya8eYjEQk3aHiKKXKJwvSAt0IPaJHU1fcgG2G%2BGTtFzpxS11IzJzBYnJ0q8xr6zEpHZm5%2BUAQz5akJt9yiXEzqQYIX3nTLRNu&X-Amz-Signature=890bc4a78633c7f7c79c5af21e11937ec88ad3415608aedb6a1663bcd57d5dc0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XBZVGKVT%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041446Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2BHvEhnIrU8gU8S4rxfG2uqxcfpfJlwQL2XHSOLkEcWgIhAPiUzQqf8SUfSKyzCnW0fSyN0ycEyuVWSfjVZOJo2btAKv8DCFQQABoMNjM3NDIzMTgzODA1Igwsr9k%2B6KN%2FpVhypOMq3AOL1at7zpfRXPLbQXgJnANboOOBFlcWEMXAF6fJl15k%2B2h8t4NU8gelTlTHhM2HqvebDGXMPlHsjMp%2FZgN77m%2BwB6Q%2BvYeWUNAZv5uLyOQyoZE%2BP476KEEGbffM1fB8cv8ypjtdeW4VtPCWGvdd4ogSSkIAl92yPLgVkxsPWN0A%2FrsmKrFl%2F2ejFbk53h4uW%2BbRvGptSrYzI5yKPmp55WTjz%2BRxV3P1s37FlhJWfIzoehqNljaAK0MrOy8M6DrVCaJiwNxLZTSAus%2BT3%2Bd%2FGNRc%2Bmv%2BSCAcUw1prz3qFSPxi7ZAgEaE%2B%2F%2BFwYJB44Icl9uRLzxhqyTgy%2BpiQ%2FnVKVruyjzBSHzQg2mfCRhF%2FGpNW4v2ACPatH%2FYhcThKiK9Qv%2BlO97dbEh0RMh3YOI8dyQDZ79ZpDEJ9c65499FmFtLFSwGqdGKKbn%2BkQkIocq%2BP%2BWX%2BR%2FsCIhozenMkYG6kobdGQpdJkTn263vq4L2stBp9KfMw2l22mpQHB6vvmgqR3Qy2Tp%2BuF69ao%2BAgdNqvPno5qzsKrC8%2BlEwXe%2FwMCanKLMnW2FtwU0lgpfDkEzzYnpQDm%2BYuJ7awGaTE%2BU0ebFeaq95NHPEtFgFuyiWqMT4cK6tOBbqpQYQbmrhtDCn%2BZTQBjqkAXYNAG0%2F2Pj%2BxWi%2FRb0vKXb6p3qskQ%2F%2FjJOiWfT%2FmXLkEtRqNdfoJOH2cWD%2B%2FVJl39cNuLg8MX9D1rzIvbwn7PoCyEcE7xnWnSBoEQ9PCH%2BH%2Fc%2FO8qztuLaRHr6RKEiuhRs9TEPFAq1mupfJlejW8QGUy2IVe%2BUWs4Oq7h4keZwiamIhc%2FyZl6bMv90jrTLjRKtUZEHuNEHjHaq72aXOGHKQYYJj&X-Amz-Signature=67eb894318b596094426fb629fb626ac37b846abd14aec349bfdd9daa9fd9588&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7PGNDWE%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041446Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEG8EO5SKRxjc4cithS8p8dcNHMhSzDdZfGmLm%2FWQfjUAiEA%2FwMlmgFP97NrLfvImFBcBrCFNflSoYuRoqxO2qG%2Brywq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDHTh3LsxyJqBlUxEwSrcA10M%2B%2B0RJEYiOfWXMZpp3OGz8JLMtmIttK%2F8ngc3wemd6o3y%2F4htImy20HX0mNKoKsoEJoVmBvkLh4tUZPU2arGxTyfbjpzk8DgmZqdbqH%2B0ZWuXACav6RaL2UBThYbSI%2BLkbdISSR9b8MJBxvuuwPXRV%2FDthoZs3s55S2Gl3oKDu%2BOjbH3o1Zzr2S%2FvKQ40NPn17sWGkTfmfw4ybcDmBtiVvDsE1uHMp9v2pJQrH7xTR%2FQd0EsSJLKtXv4MG5vBDXbVXwo%2Fwj%2B3hb6PNjFaFoE7fyCPAAg5wcVI7k25gaaTl5WlHGUvAR3gVnNSBUUUYVHIfOlEF0Q%2BnVYK3DbDxaQ3B0RR0S8nz%2B29UwYcdT26gBM8cXTFUqRw%2Bf3qfWR3CYOH%2BQnpoUUlBJtShmwBE1BbpB5JamnLxY9FrEza5iTlxmPRgBgdJFO5r%2BNr9TikcXwmwtd7g74wEbGKc0kBTMukY5d%2Bs4bVxDw3qr4En6%2BLZzhbDqkcLNLgOa6A%2FfvJeJ6mX6OAgP9E8PGZuKBL6G%2Ba8yNyuYBsYBS9jDQOMMxtnEGtdCm5O15gS7sJ815%2BKi6pjVvYMKD1bVGSr5IsSvTU3o%2FUckwORKDJkVThtd%2FULqSCgTqsKr62lSRbMOy7lNAGOqUBTn17xirU7a6LEjjdgSDU%2FIfo1nWJ7YI1FAmVRK1U17u2Lkzr7BABNwtmATc8snlhpLJ02h081Z%2Fvj13VMZxvUD6%2Bv5tIRZ6OokriyERtgLxaaRU0m1cybFlxRpRcnHP%2FYSbgcxgKLFi72shp%2FufGDDlZuGfoqcMjamVJJUEMzBTzQT6NSOM7kMCKryCiFba7KT1EAAzZz515h06Ni7IA0TkAWh2h&X-Amz-Signature=0bfa5f569b170f6fed393dbcf2d4c8f2b6ae9dfba28376156a0dadc6c3794a4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XMCGCAT4%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041446Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCzHoJaiKDqYKtXK9%2FYRiOlDccfX6LZ0Wzwb0CUB6d6aAIhALnakmzgSQHyF38ZLeWEvkFL7Euv5QE6A21uucs4MqPxKv8DCFQQABoMNjM3NDIzMTgzODA1IgyH4V3LkByy9QV1LO4q3ANkPpHFY%2BNrKs4KOLwXLTNSk9wWpAMzVju2OtsfTJzrFmkGAl7Lpt3sc1bmP9o2mOhikgxvQdCQ2OZ%2FWbETDX2GyJzqsmR9JUquK4dLgAA9W3zeP1tyUF1rMRkoPpJe0XmV%2FFwoLFfT8C7K1ugnSO1h2YHkkuZaaPGzdm1TYIiBMG5rkXpkF8UxmaIA4sFaAyrhfNkMH90eZGoSq1PEBk784OSbQQl7v700XuXgOy9pOhrpMcmZwQbseuW0mbt%2B2gU%2Fei45ZpTRlq2FZT99bAv6yqw1DBA3f86g9BiYDClti9v8T9tpBMJO3lKl%2FDUfMZx2jDIcnS4u7%2Fha8cinqNi%2Fvv3WdBcR7wmEh8ZR2nnH4vSQHJGkYtWuPV87U8tCUdQeStdD0bWp%2BrgKKOPHahVXshxnPlnM4idAlu%2F0bS%2BPXKTYZC2nkdq%2BJgymo0KCIn2zXQMHDxqG5yl3ARfQ7EEGB2b%2BUDUkO9iGJEfJUeAOSUFEtisWFxzuEq6ZSWy%2BEEWEVRcxNuIJJpxSjlAjEN1oxKtb4zH76Vo5DNxZGTATfgQYRBKyZfWohYtGr%2BA2TiMiH51jWknf1IDUPT%2FC4MA%2FOPPg5o9eCJQ6IrM7rymOm8VeVty09DBgoMB%2F5jCH9ZTQBjqkAVVWZ26e8iWwWZWJ0HjJP7ESenXSlbenYNft1RlWa%2F9UaEMRHhhWhapFpa5ycQmUXQVq2PXPigXnUdwob0c72FGlWePakaU9AtYqcmT9FPQLypCf1yTIg9em91P9n60xzTT3U%2F%2BiYfQGRQFi0iBLPyIYirJS5Jlph6hB6trnGTFC6T2RdoD7LUUkS%2BwJGH97VlQyFuCP8ABKOpUJYR3L1CNDiXJy&X-Amz-Signature=eb1b8e76ba4a3174d7eeb7d9abcf65eb4975e4249c9e9ac006eebebc9472f7f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=0f999ce15e05abee4a9015ae4c16e8a53dde81d80a0ec2aafa4474a596656497&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCRGO4IU%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGacV4nJycNNM8o%2FwKTlScD04anrmBblwPGWtMR6Ie2%2FAiBBSWUnVYoi5qd9hRtA4DAc1uxktgmDcG6mAkpkMocC7yr%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMjLReB2eFIAYoN73BKtwDZNTATDByg0S0Ea6p4LtIauDhKeH7hazoSXKyeqNQjp3eyBKpuMmm0C%2FwrWc2%2Ff9OpY6bvM6df%2FZRIzuaOizMKxKNMMcuJ36%2BvSGsOIDdPx3OgNU3VBseVXevzOdjBYh7LhKHP9l%2Brm4Tv0I%2FIDR2UNIPhIXVcBi4c94WRrKXDlh2xafVYYzDnvVTIgOMaHMkwZRTo%2FDDJa0OEBROOUyfPzYr0HgfoIaRV0y0LLpywHe4%2F8XvYe4MvTeyAUtrmSy7QfpYnZBix6V%2BOmpa1y2fzOjL3IwT2yfkaGg3KGhuyHBrnRlzIOBZ%2BCSFDDOasvhJhNHYD1ROfws8mRf5I29rrefdi2%2BxVofw3DHrKQGz9WoQoZ4ydb05FRAUYhWz7RL%2FCIv2id2AUt3otUXzULVJnvejZ9kC6WI%2B9HIqWGlD5eWVOBYf%2FTQ5wdZc9jwVkZU09anZGVJa3uyoN0%2BzqICllYFBt6EnfrqhCiD0hFnnpm8kkjThs4Pehij%2FxWiqXhPGtwy%2FcIk5s%2F%2FpSr5wSOemTvfcJ%2Flz045GDG3Et0VMt17uNT7sayp4UbSp4jATmopx8uq8uh5wglYfnaT23AwM%2Bm69uCQjfc%2F1zpfoDjzdVU4JROuPyeHmepitjGMwl4KV0AY6pgGiaCkvrIpDATLNFmvl9GOLWS6FCRUOM6Vf7E9Q7YBZxSfUSFJgiJ92aqA7JMd9PePg5GJIXkSzyjLM2OQvaIJF2xSMmgRa9I3K4fdl6PFpxk1gRhRW97Bm%2F7LipbjWqK3tBAd8JyOQZVw1XAa2N6YATZgTgsR3qhTrX9uQxQdeAPjEBh8Ef%2Bxjb8W%2BwtKywWAGaEKkh%2BxDwgyHNOmhAPM6CUSj6WwC&X-Amz-Signature=0b4432626a71f108ec15e7f0fcb63a2392241482f9878c92471ea9cf4b68672d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

