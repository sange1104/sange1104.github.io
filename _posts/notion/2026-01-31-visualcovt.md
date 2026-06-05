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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=7b883913e604f706611ba5f3b24e09d6fc5af9d9ce6c65309a6e2a67ffca9ba7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=9107a4b4706b9a60f65ba98c6e6b304096c38c665fba8c0f094f71785799f7a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=a77d1a75abecc4848c71fe64a043a76ad65873667a1dc710392effdbc5231395&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=a3b76da13fe33ea7a3d27f54e7ce9ecf1d7fa68bc67af386db5d7b36521bdd91&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZXE4CY6I%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044826Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDIMCYZri%2BqtHg4Wox%2FnnBJ7gJHXdMR7VYewtd%2FXYuyYQIgVMgxyWRnrh%2BQ54bLNHrx1IX%2F98%2BzHPaRJ%2Bk4gj5w4p0q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDN8aINI2iMS2a0qLlCrcA8AVmCARY8PHwLxC7FlSaSfNihz%2FDzvNU24k4OAI9CaFQz5FcDsx%2Bvlm3r8hORWd53h57L3%2Bi3PjEAE2AEZ5CKWW366nWpY341qfOA42pLRjerRUkBk8D5a126j7XmOtufEkHpNz57jKRgYLRJbDezPAUflZqyl4z6Eh3MUOBv7L5lMR3iC9Wg5HAIklJzDtmEIzVDK0B%2Fm8GJYuOzPRC0vkHFkR32vkFLxtfKPM3YpWXaSsisfxLju6Ot1AKl2jvI%2BiAacTLFyY4cKZAAl0xUC4pGNiM5ZXE5%2FSJpnQEIy4FSDWlQ6J5myJv07mFLRpkX7vjWhpLmIr2p%2Brcub2cnNMWg2iJTpApPV92vAagbDnTVaakeU1Xll5kvRS6hFuXDxPNf3p%2FfunAvTmHljO9QvIXFgmsT6ZrzxacQ0Y0Q3JEwu8kOEamOSWT7B%2F1VaGA9421s%2FyR4VWe4fu8fIUh%2Ff0xMFlDk3nwiIX%2F9b7T9fHxR06eoktHw%2BE0h9siVd2fsX37iNeSaCTYUjfPuvkHX8XIWnUdoEc6g9PrEdOEsWFjN1Hlg%2BMcV7K%2B%2B8PZECFvd0HYv12lynMbgrE84NhnCYRx3utFr7kulxLKPArq7mrk1brs6bpZX%2Bo6bibMLb%2BiNEGOqUBhmlaLrHQ%2BANxSqkzhVgi1jap%2B4Ja5j0P8MBn2K2bM0gxts4%2B6crWwhdoVOGzukD%2BwCOphlR0%2BktrtpgcXg%2FA2JvQIsvyvuyjK8sZofbiz6drvh1EA9pOQdSOkqi0TkRQrGL6Q119g3tl1zHkxYkMS6WuQ72xUQUKoMH67c9SlHaOVgyITLHPu5Z95ESo%2F2phlV0xfqY%2B7IK8%2BWdnNMWEJbExe9zX&X-Amz-Signature=b9fa10a082a0d9e6563a01d6aabccbca64db2f2df152c1896c8524defb4b6fbe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626VEC7MZ%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCj7YtUf6zWJEcRH8zLKLU5shwIlG7pPSdTCCsm5ABmDQIhAPEXtV1AagvjRUJSci9XROBiCpn%2BmgZPWwpB7zRCBEhRKv8DCGQQABoMNjM3NDIzMTgzODA1IgwfhO%2FBNZdU5EW1yxkq3AMuwKq%2BT3fOXlWH4cyAF3xPiQVDovm8VjORIi9AT3zrrUozc8mExf5AvYLhhuNF2Yj%2F3p1w2Aqi1qMH5Yeyv1WjSFGueYf1dYx3tw8e9Su4S%2BpBizaf7xwDv%2FZURp3yNtf%2FKB2gyUMF2%2BwJPYrbYvLQMPwg0BOThQ3Mh7VSQUwzxUvSE3aWLmOJLN6jMmsM73Hlr4zNsfdTE9am%2BKEoaBoLTXUtvkERQhsw2GToNWlFi6%2Bqc%2F%2Bjun4Na2PXnqrpqO5A%2BdvvKpai6Ksog%2B%2B%2BAIN63h31WhyHPhL3%2BlkqqCLYv2o%2BQDGCcLXz2DLIUey9KmhmIpSGD7WZtpFOlVzqL6f85b7RoTgCdcPyAP2ANYU3yknbJ%2B6lPNb1w1Ceyyyu9jdLF3QPfQuj%2FMzDu%2BBuJxws3J%2FkpNo4WjQeVDXoUFAZNRXR%2FbNScoyTZhEcIPEumwPTBHFWEWelFnXYT6YYC9DqxljOk9Tp2FBehhq%2B76GwSPtw6IWYyDi0nzca%2BBhJ46h2bwFamibxWgvgTi5txIKUkWiQdsJEFrvtJR33xYmHw5iZ%2FxDMS3nfOdIMHf9I87LUNcHCMay3nse5AXYfeWFU3x8djSfiMdIFNotTfGGR%2FxD9AE6RQzY%2FHiqqBjDP%2FYjRBjqkAeRgpBpHGahQ2YdtIYRKxycG67YA29SiT715ixlbG9eZj0c51roNiSFCJSx9FG%2BYJQD3EPXaksAgPtmipG%2BSC2aKwH6cI1LkTupHkDNILDsWeDopO97cbpKx2oMNz2CPyvlaE9ITp0R93U1bv5hSfnmZ2GTp9gMY7lhhnvL4jMEq2BULdO3McBHA7JAD9%2FoCGCKFmXzO5r0r2yabuS7K1LginuaA&X-Amz-Signature=de3360a512ab08abbd867d45ca5170da0658581db0585b281cdbb1404cf8e82c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YHRPH4QX%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044831Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDOi07gQfcKD1jNLcwpCEZ%2F3fwwnyQzmor1QHfav1ofqAiA4PD6Ds%2BITz%2FSiNqM%2FxebeSBQT%2B8MRVNKV4U2s5xp3Byr%2FAwhlEAAaDDYzNzQyMzE4MzgwNSIMqb2GgScplIiockK%2FKtwD0kD6VMqDewXfldknawNU4p3%2FKSmtw7T%2BdvsXEsZsEhCAqrlCUx1g9zi3ZAdAwQsRXIZsvxeKPmjqPQDhL5TxhMWc62XcdMjTHt6XwCiGELZuopXbnrFNXB67GlRoTtsTiqVxM%2Fa6ZsTE7qG%2BT7n7dQdPiRDg31nTElHEhr6EnhVfOpICJSQPxmyevC66jEKcValulzyjAhEXL0bw8GUoUK5VTsZXgx6uydbjR6q%2BUhxmaRnA4euqGpiJ5shV64NsRsevMXUYWp%2FcHmuwevg9eBJOJV3fzlHQ0rbb9d0%2FOB%2FhCw72xqhvGUzoZiCMwGJfs9kQOM5l9wKFS8t7oucG%2BW4Po8KjpPDuBKlB4usDOustEgG07rxdAVWZNlbX4y30z42e0H%2B99IZUU7k5imTUnXTGNjNVpPtNj201k1yq594Hp2Zzvq9bumRhe3AKrhFvlZ6WMei81DvS1zbf9kkelb6W9bT95JRiOUjUgg%2FiDf6GThzTWLO8nWLJaFzGfKfBl9%2FpcDja2cYqrA9KAipR5ybM%2B1Y3nJSDa9Rc%2B3gbKDNAF51TVGOHFJRyR3yBfJ2xZ4d9LbDkHjkbBBSginLNLgzRbpUH1WA6KtBpFfP23T4psVYYv1vBN3XiIDYw2ZaJ0QY6pgGldId5HBBQMMJca3RseWA3lXWw3QnILWZudwfuLm9IRfy27T1C2LHppn3NNGBcrLxApKiG%2Bi1pI6nGzffEd4CaHfTm%2FyIr7b44h4EsykTS5hnE5lj34JIOtHefM9Kxsq0GSRhfMRXTqH00OJrRiGBaWVjHFZs97f%2FEwrGYgkSPM%2BElUTDFHYw%2FnoDA6gGcF6Hi%2FXKEGQHSH89L2RVIBaTHGClxEBvi&X-Amz-Signature=5ac0481a760530dddc5f8e3c0bdaa6d60176515a155e4c1a8d6d6bdc3e20ce1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RFKCENVS%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044831Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC%2BLLsM%2FXkMJpYIKvekkzBFAeLIwEun3QcV%2Ft7ztNuRRgIgHcmIYcvQtRl852DD4mNeEDLza9vBKtcS6E%2BmBlbdq4kq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDLyAHAGSBN1QtxKHqCrcA9ZesmfpRHE4wi9vRH8nIi0OzFWDvDlb86xW7x4UXkHDDz1gfF0SGi4QDnL0NkUrnR8lH%2BJZ%2FOrGt7iVsOVM9h8MSDgHNDDNfn25GOoV%2FsQ5beFxIdcmsE9jObNftgptfkq3XYtyT90kykKR4zGs30SLL1YyB6JCwUlIFfmEgR2IrXfIX2L72vhoG5zSdnccMHA3EjK9LusTHoG7xrRst0E7yPeMkt8jirMAICPBLklQgaB62dkLjuTd19ear76sMZik0E6H8hpoUss%2F1yJlZ3QzapFacTKQefgziFpdgewg0Id8N4j2ZqYviBlot%2F%2FtUZKrTBTPedRf7ckOhmoeUiviBUhGx9ec8zKlKoTpoq6ctd%2B5pZVml8i7fk2rzG7JN6NCbtUmQP3AvtBf9GrViF%2Burq2O4g8nqt0cO%2B4tChmuB5iNZa0KX%2FH2%2FlcZ0xEd6z8W%2FhkX9d2q5M87sELXrnF72gqq781GX%2BB1zUSFfZSHEPqeDLF6OMMLUKeuyeJ2EWq%2FDe%2BQGFiugScJpylM6aO4fihIJnbvrz2o5jk6tzMRO3IR1n2ZfjxLkI8Ccn2NgAvixmdwV2F8beoVWVatL7w75lrgnSmrG%2FTUWkRO98LdCqHxg9TI9BlDQfc6MMP%2BiNEGOqUB0mNKMfNGkar05m5K9wfu533zrdFapZ6Sp1UJalv0IO2Vj3qj6zJl2W2h44WZou%2F9Lu1Y1k2FKnTPhNO9Qw1xp3n2akg321rX5d%2BT1DB3WQiSkZKYhxoncw2WQhPlxyUymWk%2BvFzxlN0xEkhkVYqbk7w5gwt8VCO5DqWkQQip6W9I6XX5zNmJAeFro1X%2BQko6F1FJXg%2BWHrS3n4m01E4LORBX1aVZ&X-Amz-Signature=874c394fe2a6cdded16a0541ce208a2d4ccfa45ebc1678d260ecf23fd60153f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=000fc9f77a0892e0102fe11a5cf075239e82095316963a57334c9e5f0b220d83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=f33e558c79198800bd311bfdb7d3ed4ecc7e99593a116df0faf4f0efde81dfea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666563KDQA%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044835Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDJ8Yiryp%2BfSDKddfqhsSCj88oxHeYyFw0xjYkMjoEj2AIhAKpQqJ%2B4FUkK%2BWN4mkhc61iZYyrYLyxtNYGz%2BZBpAZ8jKv8DCGQQABoMNjM3NDIzMTgzODA1Igw3VoD31mKOs%2BQzHIEq3AN3%2BSKZZV3Te4XOh2VoAPW7QCGBDXI5V3bBgfutIWNbJb9Z2rrCJYJQzjZzZS7XjaSrxGF5M%2FrLlcfD8%2FjsP19%2Fm7WmH7OMW5CQi7D0LM9aA7QEydwUIauCz7iMu9v5h64HDJ8LcTDD6%2FmsnNEm8MUtUjo4Xs6822p0RrcECeAiKOIXLVj0dMfZ%2B6x3vsJKiuxpwlrBcsqgQxGzLNYaG3gSyEljx1a8a1WB5kbGywSLa1D5D1g5N5wYqcDJPepxic%2FpdqkDldyi8uNCYaEB05Q%2B0d2ab4QF9aa4W1Tb8buYg%2BcDxg%2FgQrSHtLwU8sMj89ewrUuEjovqx8R4dyc7ZThZ1Wvie9sfyL9MTeJS42onwsf0fbzzf0xKZFXezW%2FzFNUjZ1vl70i0wNIMETYvHXEmVt7l%2BOGBN94pDYazo%2FtMczl2wk3ukvmoPm3JbW6WeParlJBZlQwK%2FpClKmQpWPSo7zkxv6wmbBWdc50iwd8R7N591g11C96c3PxGt6bWxJzp%2FxWx7pmDUozNUgmXWqaytIP3eL%2BnQuhXeMYoM8VLK0s%2BIVMpgSmdHg46Ia0fZvSulydQYjvRFd%2BuwDsR4syNw1hfecgZQutY4BxnF0QDDQ%2BT%2F%2B0BfRc6QR5UpzCb%2FYjRBjqkAYOEJlEs9IS6B52wZKjWmzkwdeuEOOFWkLMvgLC7kXoNgPxjvmAfn9g6z38RJ0KRWLIuw6Cr%2FV4r2773sWra%2FJij52qwQO%2BHbFWghi5K%2BSZZQZjJJkYZAUGuWQ%2FhgUWu1qQJjwLPANO7WpHspJ%2Fuqy%2FbpLpXlLTckUUtYlfGqyf4qRYq9DdhrOIAMSgtroI379hgZHJUgUInzmgFQ8%2FrP90IFRSS&X-Amz-Signature=60feb1d1bf66ba91bfbe3054c64852953084b0b020a58d9f51b7fe29ffb2624d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=ab10788f9e97990d6a9ed407d46c2372696432deb77f4c37224bc32663350a6e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XVTLD3L5%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044835Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCLBtRCQUJyY0DQD%2Fjberxitz0rwUVkH4WhvsYx2cz8DwIgeSiHnoXNCW%2FX1Mlisdc3hkrEAf8pu73p%2Bnhb3CH8Nksq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDOtwEWIJcyPAb220VSrcA4T0GrsEy5daPtpRKvtAMcTWhlN60DbP%2B7hAqWhmC4U5HnJTWXGBVKGxLpuHzmh15BqW842JN%2B%2FsEZWFyFIyeInomAET5cDjV2NLi%2Bp0dlIxf%2BuDyn9mi3LSb9P0hPQqdEIoqu7rLgK6rmnHGo8gjnZFh0oaeqv1m0SLWI0fP9H5kgweNTGrzyaAQR5efdDKCSWd2fwnm3h8HDuz1%2Fjj%2B8xxCwEYMSCZhxLpec0MnOZGwkwzHb6MTCH7LtxUH8ASBeetlq4hWl2rd9O%2Fbu%2B44V3gXvu0g2g2prULbCMyLLgVCnM8j%2B2Os3S06VwutFOCYhKPlNlmVZ701poFP3Zhy6WG0wMSOMIyuNzwC%2FkVoefj2cGUELnanyEzHSfxgC%2BE61lkEn6DtaSqU4W%2B6EuigOQ28u6uaHLIFNhbPBhT7endkGxB37cTI25m88kijTO3QtngZylorm4AE8H4%2B1sfBvD1BWzrJJ%2FyzrD4kacibE3YzK1o%2F6MPWFhMAfaIJNvjZDXMkUFOUzmgGIFkOiVpLcG0ZVH8FlvTkGaErAvPTOUMG5OKvfk%2B75spRXsscetc46QPvnADWxM8ktW9w%2FmnumCcPi%2BS%2F6qpSUPSdLbfviLK9cWacRKHTUVb09WcMNr9iNEGOqUBjJnB0%2FIbd5geeHnV3v7%2BEFNfEn1D9TFJHFnkWvAijcT%2FBFZSMsSl97GDK3HDJ3xyuhoXD0dN6B8FHu1xoPc7mIudEaLVVrvHMhzJNYA%2FxIC3uZX8qfF5bA%2FEJ3nrO3pfYLaLTLl3oPYSPdrC5VibVLpDV%2BpuJbYvitNd2pUCxu4jH%2F%2B0tC7s6fvvrGT7YjHriUZNPrZvBefbvXKmIsP6ffJG57hc&X-Amz-Signature=2d824a7fa55874d15ad20727ca243bc18f22e4bb569da9fa9105f820de9da544&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZGMAIQJ%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044836Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDU2d6cLUFUFPx10umixMwLWk7S1gKNlfFdSs8rKVOetAIgRID9KXKX9JpkHbpkhWf2GDkDp8VuOYX5wE7nca9LlpIq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDFUK5%2BeH17Fek4FV%2BCrcAxXcwxRy6UW7jJo3%2FdsXpv012cuULgnhzez2AXpTmjPTKXTe1DwZCS%2FqEkwxx0eZbs7wr%2Bg0j%2F1H6juu6wl7PQJ7qZavB2PBKN3OWal%2BhnkoSkw5iaS2Dfy6afPSN21SPLLtZ19u7swjPx%2FWrb04SX26ueWiZ1T8UPVDNtIMkHx%2FOvQ3OA96JduRB7Fnu8MM6MO7EGxMsTeu9UZwoma3wqb%2B8RaYDYDFqnayv7W5wP8sOjSfbPCedjDcut8jhGtCa5SUofZ79UKKIsludsHHO4Mq9uIWQZf805xQ%2BAgjW%2BrE7kWPk2Xssw0783OEP1Zu%2BVHrIs26MDWuKVhGUilMVoDfLiDsU0GtfMkeu1OVZQPoSMvQUEeU7sY4IhciUrdDA35XygiKv7fcd%2B3Kp16Fw%2B%2FGRjXlDFZUm2kngHZtBGB4v64Y3NJAFHfSCCne0dOXe3YXOYDhpKtgReSh9E9mqyy%2BULNSx4avvYG9n1m7Dff3zCTql3B2QWkQKCHYIaxkrINuLsGFc9HZDz8KXD0cmMRYd%2F0xzXybaQ2S38igMFjKyufIGqoG%2B3zjsTpmnnWNBkroHr4uNihNA6o3%2BYwlGmh9akJlhMJnEC2y2KYOZrbYDiJnuEj4ZNTw%2B4bHMPz%2BiNEGOqUB4wXGMXOM4IjZ9WsCd4%2FIUvzJUAtWC%2BFK%2FoqjRQpEaL%2B1sAy7WHX2Ys7p3QTTe9QfpbiPxX3OPMfLbe9qqGAxHCA34elJuxEEVItGviGRQVKmZSKIeQIWd7j1BJ59tTuFMMCIbtGKDLpCf7%2BulL9%2FyNxTP62yvYJWUU2kilA5T0wWXZ2U71rEA9aZwlAPm8yL1LzdgTWuxPnGW%2ByeYyhbj3Q4AS3Y&X-Amz-Signature=682371623e986123c3f6dbd9640662d67d0fc809e4985e233344911ead0041a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SLI5G7HF%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICqjaJ1Bg6VlUbcotNgnx7jlcr48KkozC4QxFSvIRywTAiEA3tVww5spUkoP%2FoSq4jRuLZ1oa9yEp0j6eXd35kjuFVIq%2FwMIZRAAGgw2Mzc0MjMxODM4MDUiDHJ09bVf13lcRqXH7CrcA1Xgl3Wm67YPi71frt1ws8Qyh%2BP8cVlmK4OAo2jl6GJs2cO5k0%2FX%2FdjoMz7nSYejcBxF01E4xtMxbxLj%2BEFxcn9Yw9fuaftTcz0DZnBwesLra4FCGS8BZ3mgpqoPEo2RAWO6IvD3CHEH1oohRzG5lrCPx9X48zMHuEAl4QGhtxEUHRuyvf2kUGHsc3tsKCWfVrhfF0%2FACpbJ2CWWKuCskOAboRFBnFqqjQIEyjKRKENQBCg7etoDC9d53Tv0xC%2B90V2MvS5IPwdISwaJ52MRdF7H4x45gceCSqeuUa6RHXfrzUx1gqdZA0G9ewj6q1k5YvQMoESaJ8MJVrH9YLJaYxqV7TfUW4mG9nYGkf%2FFhqkL9h8HVxDwXr3QqgOtqp8hhu2NXO0hjEd3v0rBHdgl6eBjy95eLS4qq7v07GdhKLRGoas4TweWfVAi9Mmn73k4%2B50odKHb4VvSN5oqcTumRProFVt29Oo9TFEK0BqzSZokC%2FjUCcb8005dw%2BlqEAYAGH6CbOCKkz5ue6nyasuVL%2F04iI0kqvD8r9RzrRYrk%2FkN6kNQCUwEfTSpZSHZlM3%2BOvi%2BaBpDEqlUZcdkqXd5tTOh4%2BTc79P223HhV4TEVEry80vjcRAWlkeEEyBtMO2JidEGOqUBiw5NrRmTlAvm6g%2FZ4emNOvS6YXYz%2Bd563LiKlamOOsLHF5rQq%2FeAm%2BPqT9pREzHq7SijV6sbQF51prbPRJPRY2HK2rm10vMY8QVh0auZdwopG0dtMMBYpQVE5SCS2SEjQ4zpVk3r9HgNAIHZ8dWwGMPVu0w234X1rq22Aqk115x2FAt5oqiOu2Ok5VSQq8YlsQ49WtG9EfBrEUCqas4YsGbRwmkb&X-Amz-Signature=c36e1d972eb14d20b33a433f0e132b37e1a0969eb6f690de86ed2b7ad2800418&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWCC3PYL%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGOPpsKj6Qky16ayuE5Z%2BCM8bfWXj7CKVFgzaLNICo%2F0AiEArknsuchD9Dik59yrOgY0DWMXPsF8Q2hrWMqhEwv6lQsq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDCeejVGnlxR5q8HnAyrcA1Gl749rMc1r808pRCL5YPIJTylnjc2ZIiV5SUS5VPZknvvHdSCSlzrZu2DFG%2FktpX3OdoTEYZuuYlRU5IlRdNNvt2OAFBMv3KOQJc9qHYYxly3FdP4g%2FcuRpPDFaLkLH2hdCmk9q1%2BlCHJsOXSoCqkVrIN4Zbh3QDEcIMBKxN0tVCcuaJxqNW8GtVv2myGQBskeKIxljrynwco1n5weZa1m2j22qZL%2BbBjH%2FNXG7BNwMp%2BZBWIfkwkDr%2BEkggwVPghqSXEUX%2BVSMaalB7Mxsar5zRgUk9sx4Nj7lsyTg%2FOH0vvxrybZczFGewntH9icwiT3uibQnzyU%2Fp%2FAI222g9s%2Fm%2FCoUiarnazyWbxCoznmh1hF8zOjSALScquRdpEXYk4GtpRD6gPikiAS6fN1SEvGiGj9FLJnw6zku10LbdXdBRcAqZJLj%2FxDTQm2D%2B%2BfbHEvJJpT12ebwqRLRVhOmkUxhfIdElfqoVtTFiINzj4aQq9Gdg3zjt%2Ftm%2BMd9cpKBof%2FOBJkPIfP9%2Fo133TGqCTZeJK78WsKTyH2XgaFpxsT84CnLRrUugaIh8PhiOTqvgY%2FEo1zN5F21Ru9q3cbP7xbQ9PMTygYnt9nn9pFLZnqH0IjM8gwmspHiRP%2FMMP%2BiNEGOqUBmMkaZ5Jj5Zkii8ssGTdIc4%2B6S5hKCCEXKgPvWj%2FnF2ur23pInR59zdqpWXEW9uKSxzFGcvCSXdKckSyjedmORVvc7p6wvwGmBxz%2FAVatrm3ViM67b19HGp3dUEvo1gV3rgQkdkXfcitWxnKQGeILX1WZGcmq7e%2B5G7KJVJLrNq9F17UdOOmgVCWGNo20bK71tvK5MUCYrO47TAld1bVZYFL2ZugG&X-Amz-Signature=94d33e0df112c299deca3157505e0ef5df36f4e4e65fae4620c5ab28b7a3f755&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=6e0ee3e017fa5b955329b9f367b910dfcc9ebc9f2d91060dd3463c1f358097b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCE2UWUC%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044820Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICtIf6AHKF%2FM8u3POqcr4MpQhIquWK61EuuAvoUNI9NeAiB7pyhk14mNWCA9Kog0J27wcMpK9ps5TPcrIEde4w59fCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMNcaaODHd277urhi9KtwDJ7i7%2B%2BGk%2FFFISWdMut8jJyeIYZL%2FzG4LEYZf2kPTUd7sP8xr6eCWbUOtx3igvRsdsGeYoMdWCKBv%2B7s%2BdH%2B%2Fo1cA1HwHVI070zKO%2Fy%2FK%2BEXoor61spSAeX8kHJ9t3eKRP1YYg2Jm1q7KqfNJjBxE4jObER4vsuy2LmaBPbYRW4Ddh95CzjWmi4pNAhHzYsTFoSR9Xqi88ZlEsv%2BOwnH3FXSyNcJXYXYxne8WWz44sLN8tD%2BlFvwIdSHfy6i1zX4seK6whzcwFGU%2FA0U4nGb9x5GPcgQQBw62Tryg0Uqv%2Fm8nLn2QLI1v2u80F%2BaNzKTA9ZIZbKWXvAdDVpUzX3b7NJqB6Z%2BsHuN4gC8Cskra1g%2BGHaVWb%2FLUPSY91MvFAhWNPIO1DNEJDrYAjKm33bWqBNSo66z9sVBl9a2wG2OJ9elMAgBpvP0kah9ERvpCAcrCcMJpTvHVhbhH9HhLr8OLJ1sAdZj5ErfoBcYkAJH49Oyb7vJDV%2BUWWfJxjFMRYolc6Zgy8OKdgBROM9%2FZ%2FVpDygtzM7QcIcgFHqe5N4dGaH09oQOQRVBxsNykLIRKVLF7E84eLXEPLBWdzCN4pP8iTRbDoTr4pfk2XRKb8IH0WLgGSskl53VB5u0C9ocwpf6I0QY6pgFx5WtL4aQTK8SIhFhgMJQqbkFI%2BW%2Fn3oM39CCAMuMzyseiIDdk%2Bkygjs%2BX%2FoF23tnblXxcjm98vtqxh%2BjIhYTy%2F9TwcRSGc6OrOPZuMVKjwFI0JAJea9UZP%2B8LPQlwBekL6%2FOe3soStUpfClc8iCe8ZyDyhuXPhow7YX99bNezaY2%2FkXE%2Beph75V%2Fx2jNvYPO7xUSjqFL9DZYSt8sDgjSj5irNRJl%2F&X-Amz-Signature=aa6f4144b7be19cd6130d4242ea883e60f4591f2d4d83d2c0f2234e99bd653c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

