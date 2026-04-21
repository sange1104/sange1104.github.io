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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=b27bf759bb9acb1d69b4ac0a5872fc5092028c881d336355437fd8c45596e72b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=f086d4e48772f0d9c5d79f045e7e8265640dd55bd9d2a9dc978fe10ec23f114c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=f9374b776d41a7ca6a5f297733d388c6f64d485b3aa190a5dce011818f9edcc1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=3d79d015211c6d6f5d5db5485ee741f88baacb7718b34077d5400ea55978d09d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RH4XBPLI%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQCuoHQaocH6g3JDimP%2BG8fs8pCd5y36liDlTBYs8CAtSAIhAPK5ZjbfxRS2J0z94uRCFb%2FHT32bQeYdaKWO7%2BIpJkDIKv8DCCwQABoMNjM3NDIzMTgzODA1IgzaO8GQGYfZo%2B7aBRAq3AMrAuDqE8hJR8jtSM%2Bhafrj%2BzXD4TLAJJ3mY1%2FnAo7Ma9bNIfuszE06tvVhs83Qx8orIGYcbWS1YIbON6JPC7yX4yK7KBAjxSLtvKeoswiYqL9E3S7rEb1JMxX5b%2F2ZVLRG8dyh7ZsDjYM8MYqICJXVVk6OJaIagMYVkMmE%2BMvSqEgBAuQzC2QI63Bmk%2BPyOoep5OhQ4VmsaePC9i13iGGuQE5YqtGUDjY0D9%2BU5S4mmgXwQcKjShFrrNOPm3kxdhUKXea%2BWyWcecS2nf5088NKiO6c4G%2Fx9LlFF5GDudv0t%2Bpa9dbQCyo1OlR0n0aiYXil%2BDH1jTuPx1yOUk%2B%2B7%2BK4SrdzbLSwfjrMir95MQEsbkD%2F8wpNlTN%2Fv%2BPmqYlTeS5gym0KAQbMQ9uI%2Bv4KDohMe7zmUBEq9R28YiNHZNiH1rxqRRsTQouhUIUPl8JwlyYac4ZDLeruaPPLjTyjVVAPd8zgUlckq2xHiQeVinOw%2BnCxjdCyiW%2FEo1YOfUTpc%2BIUGBYz8iC6qtoNjT8MG0fWFI6C%2FjZ%2BHU8AokOfJJ1c9ph9w6YeHYpp%2BtR3kAto5BVYgs3qrwAw7jqdGMra67vOUspnZmc2e30Rsu0I80cS8HRWtLkS%2BFYu0vttETCQ1JvPBjqkAYpzYFVeVmpzZIaoH56AxnyupwzrcTVrsR8nxJA0DpAvggcHdGijX8eCaAhKtOk5WyIiZKhXhd2jNyRECxNNRuZiHPhtl9h7DLgpBJE8vG0AlYJffL0ZTjTm6ueuJIIf4X3PSHdU6a5i%2B9kk9lGWGWIwJ3OomdUc4AuaN6oO3%2BzPhrPmjnO42upR0V%2FYi5otxLgOgrPXJWIaK37H9ZB9wVNo3Dv9&X-Amz-Signature=13a07bd58eb6dfcf33e4e4807d9838fd058fe136045011ee134b6eafdc41e92e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZN46L4VX%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034721Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQCa24OQZdMI%2F6GY2iPkSStBoRe0U2DkdNLQ0XUc3MYTowIhALJCXLAqcUVj5Qr%2B9bghx6oSvSQiMOX%2BjdaYmJY%2FMa0xKv8DCCwQABoMNjM3NDIzMTgzODA1Igy0iiRUMyKja1Ae3Y0q3APOemitkKzhz3aREuo37WHcNHDrDCL%2B9EG%2F0vXakhDsfV0A9twjDXGAfBq962wKuCO8fvEq59kU%2BEEbGiVz2zbthnW9sqg2%2BqjEQAQFbkDxX5RMzECkTp8jfq2UurEukCGhr3b%2FzYfPn4nO6gtrh4It%2F8j2N0WtAo3hRIXTHurD6TZicAc2TQ8b5pN1D79j1ktotKf7WA5OWd%2B51qxDghN93MMlzX4ZEp5RrZ2QPchIAnaBT2%2FDLbbG9Lk0TUb9pD5xFgXfYuZtG6UlvwuqqW5hMatsiMCA0bDH%2Fw3Bu9GDLc2ZjWaAW2BREENWu8hE%2Fj0BmdH%2FqCMXsvcoyB1X%2Fb6vEgkuqp9sp%2Fal1mAnoVP9tuTA8UVQ2T4KT6eQN9TBgnGIAmMq5e9zhQRnHXkutazvJx5tGHOL4lI5Lq2rNQT%2BzrPOTp4a2aJZceb5C1pPVMTV2l%2Fw2BTcgpLraP6R9wtStX%2BTI0tMHrMlPiPg8Vgjt1PzJKou74xAK4XGpKcFcgfpqkynwTOUPUSKXDdu5g0Y2qnACwIxxbaS5sYCbSYPQx00mboNsmq9a60AVX%2FWQpTkRc7n1z1RNGoeK859JnSBd%2BroYvE0XaIqBv98ca%2B5qT%2FYLpF2oNKK4Cj4aTCy1JvPBjqkAf5%2Bd2ceej7g9E53AXaZwiu6U0B5cLY4poNysL1F3JMSvBQ%2FKK83cLZqCNHKTri3xRNnz0gsK5al0KtA%2BSgD%2FqMXrMlMKPJ5JcYZp9Mnv50V3J0rlZjai%2BRvp%2FPxitgc0TQO5SAHYasbsTVDMkthUdBBzvIpFZK4glwV4o4gwGp3ZMgEFQfDQG0hlMMrme2%2BA6rYnAszXSvPFEUHc4JWdbTFT1Nm&X-Amz-Signature=a68d7b93616645e903c8580cb6a74beae6fdeb6041b4db8fca02671593a1a8f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664QWKSRW%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034722Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIDuTe0XCwDlbtAF%2FLUc8CDUg69vPDcfu%2BiocDDlZCoLFAiEA8jHf6rOa1gdw%2B4o2tZGawYhexA9qoAlQOl5BvY8oJxMq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDLt3UyaavPUWQEkh4SrcAzqOJxJoAZsCQdNbVkNR4%2Bh0%2B7%2Bbbj2z9jo6K8uqId7eY%2FBJJ15knrpEp9H9nW1sRCNJ3EcwU5JFux4XqjhQ4ev9214deOtkqvW0wEC2P6Wbk1g5nOlWKVZtgtduhaNL1k%2BoJJvv%2BvXXWf9sCDgzPK3Jbjrd%2BtOJTepeNW9k0Mhm%2F4rhaxQfiUa11vJbZ1vd1%2FUXMc5PmwnEkcE1QRVIHl7og61VN701wz0G0ZLNuonYyyfsWq4rZzyTj1hHGZVd%2Bz6YV6Cnx4APWlB5hWreeiXNUmMzNd%2BnssBZwknz1li7gKMDgX5z95PU2sUt0Iuqk1coDK4Lx5ZFA86ZPwuBmj1G2ePHbDVBIrkyksUDhhm7eIRIdSK99hjg7ANOqZndl44bHS5BGTxoo0ZuEXQOc3KKS4vIW%2F%2B9IEAHDQro6qoHgLhcJKaZaGYeEHDtDFbctMlVacnigdUq%2BVeQTmkuGFvfqOZVQeZjzPRev9e7hNV8dfjLXEYsSrbWFpsJyJnKG0yxk9jCoSHlw3C0jxwvqLtxftNCRecea3X1pA4uL8EZxlfC7QqmRJVMXDcyCjhYQDh7nuX764qLLWn8j6sGVzJM2eRRPZTpjfBS5SDWzGIv9tvp4il0yDN%2F7EWqMNHUm88GOqUBWz7dWZQDpTh0K4GGgpxpwVyjHJ5qMv%2FPNhow1XPt2Ev9jNgOkMxB9KmHWdRruU92vGNXYukgGyll9BuNyRk72tmaA5vXMEmDHtZQn56mLPsGRG3HEuPtXwzprNuBMMxIbFya2p3RwpxsLqu4Vi0a1JOlS0cxo83BRs6EhnxLey8q7BjT1XnqUKfPEnZEfiZJ4x7XAnQztjBhdYnYCNs%2F5GNmKvPq&X-Amz-Signature=b1e2965a589d878485e703fedc84e05d5322d640956216597b6cfd9109c3f39b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIXVUQ23%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034723Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQDtIZvxoO4sajB%2FYK9EgKa14IAkNtmjf0fYWw9uZlod6wIgWIZnpdSvSwtbQ2drv3xhdxrDtnFD3SSQgsmNcqoBNa4q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDB8GII5m3LCOHF3NbyrcA%2BObIT4Sfny6Gs4kdfqtBuJC5GoLON2GT86iXwHJ991yGP3sEjKiGx9tAWldCEOUiFLuMfIGmkvcD%2BJlX3z%2BM83amGW7yD%2BtfQbnGbtHQDh4Gw9Yp%2FTKMcnapTGRx%2F58A%2BcqC8vBQv2M%2B5ing1N2ehg2gkEApBHSjvoxaQF91LsBymH4WHpTQGMGQV4vbb71MP5TOpSGvXJnwMcB%2BNqi5wsVkIqxElJ8EHw4DK76od%2BkJkKjpoiZjC7wtF0QBEtQ%2BFZFz7hcLFnzGLM2kkLxIz%2Fs4vQibPWTGyUF6uNhAVc1Ru8ziOzwbsp0xmi1YL731hZO4dDdwOkvLsBGZcQCm95zdSq49B%2Fbu7hwaU17eVZfDHwq4en503kOTDo9A1Y6ip484tkxauo3GBKtphEWRuQHwxz%2BuBKObdswIbju3n6%2F2CexI9ugkz0EXZEScgjLZXZxgRuMZVwlMtIfFVqDDD%2FdzqtPTWNoINcj9USdSB5PHLJZEptDW8wRm1RWY0mlr5nuqa4ljUy67rhNK%2FujPRLtc59tAAiBxFTQK1Bhqj4v7M0qznuV7Oqryeu%2Bj6gWldap7BwesqEXRwIYy5VVyXib0ReoFK1gY6rpwfX9xK1Itl9SWasDY3hfUfaLMOrVm88GOqUB5LTib6cEX%2Bfo%2BCv14vfGu9UlkAlzWW7L1Zr2g1a0UKEP6vx5UN9gXTKL2a%2FmWfp3hA6I3ZTUfd2TSKNfST4dEjKHmJ1FUC6JPtalJXxPDdMusv3rp%2F5VxZ4qWgQ2AiJE36Ia%2FZWR8jlG1GSTIWjF6hR1h9TYd%2FqDII5Jj3o46hYTTnhmC41q8Z%2BP%2FWypsR%2FZiRttq2tuegsXXbbyw37lSp8hYtwg&X-Amz-Signature=1d5ce89e256815023cae14d5500e6bae9dba54f1fedf145e51a2d8dd3909c17f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=dfc22f05b053ec7dbc78615e7b8dcbbac328d0db8d31265c6885c42a26be21ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=6f9127f51694903f94af3518af5d918797cf58aeeeed83dcd9ce66976e6a521c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XRG7RZS4%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQD7JYQmtm9%2BQv3mysfyuHgqCJwtVz4uW362oyDOulXdWAIgZL3e%2B7sM4sunQHlMfB6zWYUOOnMvhyp%2B9YTPmrbXAuYq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDGcF8i9ljSReoPaajircA79fEQTz08ni1FIAq1%2Frg82TkQyJg3vZXXnD%2FuRuai2Hs52Jkpb9YZewNFf6TPktkUWmh9rKZS2uzavv5ROY%2FX2hvYCANVdUcqWU5J24KTwJ8Kjgz0%2FPHfdlvd8o4nbrkI2%2FtA5MQ%2B5V3I5n6krvbxu3XfrpNWp%2BlXELngt6%2FAvKVl2LywbgMzUl6FxpBqCUWNYh%2F5vbtDacOabKTK8sNCwp6nna7ksfpVLALnc4JAzYGj0hUKyLPLw%2FM%2FiYBlPGcD30aIoFTGIKZmh495uUmrG4kLh7WM7qY9JOwH1%2B2LCnzJC%2B1zlSMhlgqiVswcpNK81BpFuerL53Ec52ecQGjUjFK%2BpRXwO7Eyz0xYmEoUUF%2FkKM0gTuEAElTl8cUv3LO1FvucVFzqv%2FJqAcqjGeGQWuOZ5VTsdnHzR0c7iIP%2B9%2F0I7p%2BNTayCfGw9GN2%2BfKg%2FauYS2J1uK8Z4ClvTgbZ3uO4t8uENPj5aH5SeHkP%2Bfwu6op0lB70nIRTl486rGRB9ld2iGsx%2BQl1vByOxCtepM5sjvXWWFvLJ%2FHWn8sEUKgfv0IU%2F%2B%2B49nu%2F9PvDGmHGe5sva3rp8N8bW%2BrMZtf9WJ66gwstcgKCXnyQVWcgYMc2DjB1w9a%2FO6UBdnZMM%2FUm88GOqUB4pIkG5QAiY7%2BjsTMyD3VAR0oCFH1x3A%2BDDYS%2BNxWkHtBXZd%2Ba1mxyQV2zHxBubVGUxsUD%2FawqEgA9NpGw%2BYOto%2BwPZTVwx3A7caMmI4YtG4XsgBvOaMeR2I%2FEVRKrEAB8rrtA8P9ejmOvxb2w4L5wgRbgt8rBAm%2F5tOGrxwfej713LA22cOiGMmim2g6MnrWcvIBKCmbqRRw6A8u2ldgeDfbTER%2F&X-Amz-Signature=ecd55b25498c1b93ef08562afbdb5b4b50677de2a626d70f7c19d6048b269e96&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=6026415ec2bd9da842263fc71620ea83e2760f68004349eb3b695fc5d0bcd37b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HYQ7BYE%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034728Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIEw2YMgbr8kQj94CRnxDvT0tYFsn8w%2FfoSkLibkre8uQAiEA4m5e2WYyrGBrJspgSOCi9sfZLi9Kt1LdRfYwbxEWT5Mq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDCFmQDl2TiAS5%2FVTYircA4RLws%2FiMgyQDn8QfFgQq8UI0CfaxvsDU0TM77LTGb%2BcgCD7FJSY0IVIvywGYdiuN2Wsfq9wdVk8Cx82yT%2F8qYkLw%2BOuhBwjP2wL4YaGHDtv1ITugpgVlIwDYTScMYcG%2FiiI76sIDkOMBeXMH9p66jpxP0RWKx2QyKdFHEIqE25t5Bu1ZZkDMijgdH7QowjSyEsUn66ujbleiB6kfO0IkBhrU8HaF4X7EkI5krgeMM7ZUXJ5zgJrxL6X4EuEWqGeH3yGsaVc1%2Fqqelwza9g3cC2gJgjjq1XsrRVrWCK0Pofyr3KrlMKUBbFj58Rqkm2vcKNt8%2FW4uCMpRaj8rINszufHA85RQ4hNZWPSEahD%2FZPH%2BoC9E%2BSR%2Fh%2FiPtTKvOvlyNHSVWvCmnvsZc7%2FWfLOLql0vzVV23%2BHFoZdSSfR8HAvW%2FhhcGKRZ4mn1X5Can3IZSqsMYZjc64q0Oi17mVte%2FIIbqrWSQkq2eWzox0i0jbAfnGoD%2Fpw7niDltpNDHy5dFyxAJqArappAPNsoQJO5AyItPy5zxC6mM5huv0kl4KARkIRwntA4PN394Jo88UAxmLEZDsnmROOBIgmmt2pZXNe8QedE6UL33lchY9YpDB35QZBiRC%2Bpqv5gWOtMOnTm88GOqUBKgDZTtlaCIuYyZIanxRDc%2Fop0k1KofXJSPc%2Bkcr15ccH5CSCZr549HlT%2BTPglz%2FW8ihL6xP64MeJFB1Wsbs9QhjFTVYXiX%2B1dmOW2tsKqtmz5qMLNo%2BJtucONMJjuWzIOy%2FWtM0h2zYbJUC6Ep7nYdc5eMurScfr6f5DRck6NdZXPOoZAxnKKdmV1WUbW%2FMBca5WK%2BXnXEiEmD0DLaWmt%2ByvuUKp&X-Amz-Signature=90f908c09ae431c3d3d0e153e5cc8dd5a8b2be4319bdecd7d1302bb2935bc331&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UEXQWIMJ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQCbsnjkYio70rJkwbddPnnEuOyTLJyZ6HrHVi0XIOACiwIhAOkQhkWkM7aZclafjzSxqpiTD%2FUtvJ6Znp3f9IpadMdLKv8DCCwQABoMNjM3NDIzMTgzODA1Igwq%2FIowvmPzpmG%2FyAQq3ANLl7zeLK%2B7Oi4RjDRpHajDIGpo0nTw9CuVW7iU83HhV%2FFPTQ87kCVPC5t9zMEzlBVtTqIpZtP4SJ5llQKWrAzualVC5Z3hwmSOE%2BHdkkMagAK2Vyd6AX%2BJTQvK%2FjSypqVJa6wuOKVwENwJONJoYky6xwZM%2BXn4TEkDo5EiB6tNZe%2Be6tfdnlsJGHA9auqi05qQRqB2ogxtM35XhYE1mgrqimUViqluduNi6HH17J0Bep%2FPrg4tPxUoY39EESBsDDyZYGSEpswpGjRdEAGxDWEw863O%2Fo6EPhJ0jB%2B4D7lXnHrQRNA1rss9VqYa0QebBaCkfUWg8w4TwIkCVvKL%2BAW4gKaz8aitGXvADfRA4IGlGxv%2FW8P1euosU0s8%2F9NCDoCgntOJdjgeR8dxOYooU4y71T0VnAnh4T848z1XUEbxnlc%2BfYn95BTBzTzK8PuzPRdoMInuc0IwvJ5tuZiVGZ9SbhX%2FTqOx84juN49fJr3Tlme3htP%2BzjvhAPijrUXozl%2BMsakq3Rd1w%2BywuTdwSk0w6pkOaoNdqZJQ%2FDluO%2BKyG0eNF1o%2BBiyF0lsMur%2BTHHfWUCeUeDTCy8E7Pn61BhPGxrZvatbahzPhR2D5NiGZDzF3bj%2BXS66VfyX4azDx1ZvPBjqkAXkC3v%2B94kMeTEHzEvr3WtHEinu%2B2fJ%2FupTpgHHZh6qUyDogOnP9dg8QlMNfncBjHMIERqPVIryD0brT6WasAcwxQw9WIVUjiZk11ygUwmnC3AZxJIAqtklWO8QlRoXb6O%2Bo0uemv7mtiW85I2Gx9dpD4bE9Q6spMsomsf7%2FbWHeVAhjcS5QDwtYcVknZa8NTjZtMSMWqu4EPuoAW5G6zGofrPYL&X-Amz-Signature=13604151b78e79a167cfc8853379301fd096c3d87d32a841d92ec3ab30c7763c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QPGR53CQ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIEyFnj550udTyt4wZcttVUdTkdaDAnwOcdeB0NgA1XSTAiAVQ9eD9cMnrry14KXwm1jDCMniE5%2BseQUG7KT7DI0hOir%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMCtIDmR3T2iOEgTB3KtwDVXmxB8tZxudA%2FY5McWbrrVqD6CgKAhzZRTmqjLX0FZpE046Fznd2v9pvAo7BT593jkbDNoXjdhcGqrQmBHGSGHZ6pMJqk9mIumLR%2B9Uvp%2BlYJ%2FEn8Wm0GDXIS6E6I0lBnnaJdu6LRXVzR5jo1qlx8PIl9Y77pjPPwvK8K2pDA20SqOvcLzs9B3X4%2FJcRFp%2BjUsMQi5Q2OwopJ750qBSiJDRW%2BiZP6ue8tQoaSxb0otE3yJb8eMGIcFPSIVBcBPQJ2%2B6524%2B4JFxPYRXsZW0q5qSpNLWhoRyW6W9M5y%2BqB1aN6PXwbmNTOYmFOPf3BigUBt%2BaDYQdvZTEvdgJ3g6H%2FvudGC7pSFvLtMDkX9OfmP4uINHTiMqvy7SZ6HF7G%2B3of35MYFDwUTvBbaZTwE7kefT1Dufz4XI8g7OurK0vTi7%2FLDpnjAo5caxo5TEmYo2%2Fv5rU9QRcHUbR7SEg7itlmyBeQ47hQcwLuwFMd5fiX41oJPj2jnzUhT6R9xOR6OcaGqN%2FjdhmCNMAVnt4kWgFxNf1Kven3eKa3Hn5ydomfsqa7YrXexwnKlWSRABaSox8DdWSmAYKZ2xrFE77wAkRwRhWPFkPjkF7xalFatbpjZ2OGXl1CJNbMwKV5sIw1dabzwY6pgGaQMA%2Bt%2BCPINbxNRP7mWJUb2FF3WjOluaMlOeIxoVDFVsxuE34ay8h%2Bn1G6YY4nGzlhla97WExTKuT%2B8acbw7mKO6DJaBA%2B06uC5q6TkAN7XqpWLslvX0gjrLfJjRCIEV7vj8QICXhMsxcYeZ2nGID0T%2FVfFMlyj5Ube1RMWjaUlyZ%2FIn9yLslha%2BM31sNORA0FNYgK9avKXEdE3PjKsyqh%2F2oTY5i&X-Amz-Signature=0bc610d9896d1ee54b68c8d666290535fdcc3698397e9d259879bd9d56bfe8af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAR6BWJH%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIAFhva59EVQRgzHEDkhvZMOA%2FCzUww4B%2FUeNERhk6euZAiA80TtaYU%2FJyPOSuao7nGpiAKmLr8MHzzY%2BT%2BB295rxgSr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMwo%2B5qT7lZZLGMjqdKtwDFFHFHxZAG7tLq6PFf8OEwIivavay4IEzWJjrUNMtYADCG4nPoocqw1PEpbK%2BH81YXNNkzTb3ey2tMQ833dlmTEr6rgxpmmuYThGSHfm3nVr%2FPFfP8hlgfq8AxYjxT1JEGg6%2FLHKYcnc8NciwU7qPmm%2B1x1BnN%2FpRqtXqbj05jVJxKtgT8ReTwIzIU8sYgKJLVKc39bbuV0vy8GhJDYZlIjZwYy0EMfO8qAV2JZn02gskTWuiRKQH4CxeRHj6Sb4g1i8VOJ%2Fy%2BnBRcVoqrYOn%2FJK0fTUcI%2FVP34PzZQeFMo4tN0K6UH%2BtVkax2KXzaR%2BTDTPDyOaB9JgYZc02XZXUov3E0jipvUANDzPoSroxjTr17jteTIrxpt4KzgpXY5H%2BLWNBkgK%2B%2FG0sJOkL6TOVb3eXrqCmW%2BAs%2Fr9RYazfJocLMkfkCvXkfY8QN1b6EY7jyJhxXqIu0SG6CZ66bDAGHHGHlUdqGAjS3p6wIrAByxS7Z6wxKqRwTOO3iJ99bvU04OtCLFuC6TTEwTBoMj%2FRG7A19kBCTJD7UoPK3cY1bbEAgBJmFonvXxRoU10zYJFarAv5ODkcc1k7vu1opIBau1kzEYejBo%2BjKoReKn%2BF%2FLBufzEYBwJPfAVR6m4widSbzwY6pgGOLESLhNjHJzwDZ8NcekaNIAvUFzcEk4%2B3Ymp0ic85TTTh1%2FgBkZhKA%2FcO6fmj5hDE8IObt59ghh07UlXQ0ZDxYMRZU1pR1G1JcUvaYIPsB%2FYNnCBedW8tF71wGH6P%2FIdRka%2BRF%2BhHnYiIz7tECWAjA0vPIhSvAl3%2B%2ByoMESovoSLVAZpWK1X%2BVBnSFRcU6ag13P66%2FCWsIfSjZBf4CnLYF844uDU6&X-Amz-Signature=25294fb975be8c50e4e5ecb355f84e2ccb29eaa37283d5b8cd3c0a356896f339&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=4cfb622f0085db17969c13a5a166b9fb30129551fe8d322d352888954f0910d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FVMTTEZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034701Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIH5fPAjb17g8Vub1eIjkt5OCepJTYea50jYanBat9ypNAiBunNoCu6W3%2Baqstjm8LIDjBn0x8AWMNywCitjc1g2hYCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMDsRQphAmhvIYwnrIKtwDr3vVtRHMgQk92XcDhXTut0IM8qubI19YYdSOMa%2ByK%2BRiDLvAiKZSK6OjA3cfWj7JdBF9rF1zzQ7tJFY6csJ9b8LbEylnRWPTsmMryMUYKG9AdnwyZkCQNjGK4P9qjUAO%2Fs5vIT6X%2FRXZ7VZnWAjqN9ldBjSFwA4omErZmRivcZt9jlQv9zl%2BP7DpodlPfxInPr4hnRUGfxpsbUL8MCAihq591wBDoCU1fYgil6IHz0hl41ZIt313iw0RN8N80f5CMlJ3DvRHjJjA6nwQ1NQDztyNFsifHYXtapk%2FcF7cWPFNvojVbzX49J4BQsLb4HVIcfx4WyVPI99NpqdLh7w6MzUKnWMUwkZCP9aunHe2ptvctw5lMLf6r9ANNDQG6OVwYFD6N1vmLfhCW08gPUZ3tCJ587Z%2BnOihrb0lQGIA94xvVEYaexozJMYLPQi%2FHT%2BETWUpk7ZLTITONUg1q8kRNmFLeH0%2BpwChyEakU6GP6dUDwiKbRmaQuJtUp2NnGQ0zFEcBrKvT0AYV8AShOP9eR8%2Ff9Rywqcv%2FcNWEyrWoMjD9AlREDfP6r9SeAqKNWl4GysP0Q2MUHvrOhtxWWwHpdTiQ28eHiRez8Lik%2B7OVlMRq7Ec3CYEv2089R0Aw3tWbzwY6pgGrg%2BAZGr5yeuruzmIC2wgbvb%2FavMVtxjn8fWYwF2LRQaeQAnKFx1bTx%2B%2FSmGR7YtwL6G6usyqf5Jy5wH%2FXi0zOmeM5S5ZYDAyy4S3YbkEBiOCbyG1Ys%2BlasWMe%2F078y8lvstfc57pUFLAlNRR0q3eLXuEaI4CCNyD8gbfvErGOp%2BZSogeBbfOGRqcDypntTm0uZQLERZm1QfcKrdZ7uGbK4Zzg0N4I&X-Amz-Signature=904ce7e274f7b65ed9847cd6d591e770451f80fc2e7e7ab2e95e20e9ea800bfe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

