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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=27de8f407f26a0b36c4365784c066d22bf9a080e4f53918e49265dca1e5df686&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=7d4c577598a4182ca124f5758d39a8e539836b56d57ca7ca255b56dba2b7e9fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=4cbcf6e9b2bcdd687faff41b9159d889f74b10e0eacff17420c77b45ae436d45&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=7dff8869a976dacaa495f7665c4d08484331e90940081fdc717ebb2cafe04e0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SMRBLIIZ%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032743Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCX0nuHuykUA1GvQyvEykwejgekwUbdN%2BnHBId8YK3yDQIhAPGQy9D%2B6MksKt5Ypt3kq0bggywfsqKwQloNPNGeSFSuKogECJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz40oU9GnBUUhEHcMgq3ANPrBWGlVtUKe%2BaWvzYmSMKpFuoZ%2BBDodgPX8sOH%2FBYvZqNmu7RQiWcl%2BmMzIFVxGrf%2FEneLSy86nhIZVYJAa5S4u800kahIGFYv9y3rQ3ZRylXpUkTg7gHUx1ypyw9bzK2dgd5tAk59ZIn2W7yp8X1lSde2y%2FqBbNsdQ2u4Y9EYD%2Bliza1Q2in8xX7WlHU9k7re3QkbfIAx5hL%2FdCyr%2Bs5M5GjV2L55arLKI5%2F3wI4b7N0In6vmOeye5RjdyhzW0IM57jNUYP20iN9%2Fc%2BKrFQmdTwzqUWMP%2FQYocbdVzu%2FpsKTDsurPiZmJXiLkv%2Fx1v2I7Yu2E%2BUD%2BioUdaHm33lEoCL2gIaCaefQJwXoXsn3GlyABwm74U7EyHqYa4OrHH0kunDE9AliWxzh5nUA7kKHEq18uLVD1QPcWkn3S2mnjFUgkTgt1X3TH0EHNWBjnSIbcszWu0im6Hn1fGPDUQhiXLFeqFbEANHVMgeYhbZNx%2BUIrHeFrgWjwyh%2B%2BACphFPBn30NLZs7ZsPJSOqylqfaSd9djQAsMCSSe4pF90B%2F39f%2FmQLYrQp8W9ZDzRPU0Nm%2F8otCvDShlLGehT21oWe6F6Ot5uu%2BLdyeGoKn%2FKfTrdQ%2FFo%2B7SnDlaVJW8zDNxKrMBjqkAUUzbr9W0hDXh8reBqYTGwGvb9ElAFBSRiVFrTQB78p3qsGRVZuOx3IGQwqlLjQqXFoMpdjkRNYB8UcZ1V3RMzrkvqpYe%2BWVUgTWAI%2FugyRQx3hzxFXLM1WFUBHv78pAuEj6AWJ81JwpqJn3HqtxKzYvD%2F5qxXEi9N%2BoCYIrfrPrlxmkFEf5gtALBOMRT0bjgCcUbfBcspapOjUrtxIq3TsKBpQ%2F&X-Amz-Signature=8f959973675f0a94819c8a59bc4f271654cbc2f22ca37a5044217f5b71e134ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U6J3NYJ6%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032758Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE5EsvgNwJQDm3Gqo10y5Nz3JjI%2BbkxP57R6Z1rx6cPQAiEAj5huBF%2Baaqer%2BRRBAcHij4l31EmzkFnXBM779gmCBfEqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA3M74uIKBhKGmrsmSrcA9CQNiQYdNSSzGAfTjFUp%2BytilYKp7CIy74t3n%2BkUYnjMaXjaJcdyPwMAmdqdwjo1C6ac9ahj8LcQTGubRhgWBoBo55nTz301bK1hQu3MTpjbo2gEm5TOsrX02UWoKJIc0dB61%2BmQ2RhsDgi0E5PzEEBI7sYOx0%2FzIIpmq56%2FgEG24vBSjaMLtlm27lD%2BjGvMvylmJdNdFPjXoKIq7UuMvkh%2B%2F3gVcd03SJ4thUiFv%2BIxySgMJmDDc%2BmVcUJjHnc23x9IJ2VoTfxG13fRnWZF6%2BOejHn7i1xb6njydocjuKDJdyLtWnvppNR7%2Fi9%2FZK0zIYOv5wTXnUTYlrjwtSdxA9YUKlONhOiNzco3RP2YoKs1ntwHVovSqJqR4oqHXRH%2Fa0YGvH0v4Bba0EYCeqLhte%2FDsPmSopvrn6A08cn0rQICPoZOivcWV6G2Y3M7s5W3dSWRlDip20LUGNM2pGkRRaXfJOipjaZQBAWhGzpa9J1NL31NwR9Mt8AyodnSlUzQvTI1RUi2q5LnnX72MIQ9G3JLqKI1LvSu3b%2F2X4fuuAF%2Bs6Fgf5OFK41vzbtRdUncdKp4p8jgX%2FJt0SX%2FEVD7QPYIydbWzRwEXWuvdGELQpF7nq1Ug7Z38ZoCMZcMPPDqswGOqUBaw6mz8zdpn5k%2FGYf99%2FUYQ%2Bzz1RgBDWEyRMZ6N6OA8XSS7TTYYy3nzreVDc4XfoGRwqp1WogQb3R793QDxJNMzbBVZn7DFRhHVlBBk9cBOOd%2FhFemj6g2NqR5vfYDSkkBJ2OoSjdIICjLbEUaK6%2FCTN%2BpkgcypIOsv%2BELw3fn7JmK7NKUZFxcBFpQYgXanoaBmKIu%2Bp31R6j6eikkUBKQBVAe34u&X-Amz-Signature=56cce9419e3660c349f9bb6652dba5d639d52145890b24158582a10f6150c602&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UEJR3DHQ%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCoRop5fmGaDfvUH2Xyt9ORhiM8%2FuynhiHvVSbI1aznBAIgaSAsSyM%2BCD84Kb7%2BLUvCBeunBZEF7hoiId%2F7IGWnGFYqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI6UcZUiXLELkPYafSrcA4yLAitYcIWNhTuU5GeiQZtVLaQmNIfyYZfOihIWVEXPCE41FNhVKIM1ciIkmi4UMgjdQMLK9A62oReKxfN2DnxDrH3S9%2FnbN2bzd2oQ7vNMLgvag%2FTSp2HRXRFrEhA0mmYmhej7RmlBjaGeVb0tMFsnAD4EA7O1Ocox8CZ8W7GraHlNw%2BsN2I%2FLiJERKzuO4dA4mgctEXtSFNstsGNQonau%2B%2BpUPods%2B9pW1pjHe9Tlh1%2FoO492rDNiRhrddUAO6kFQABrM89J2gTXfrtBXCudK44CYZAEQmHN0D6ZarDi9QicGV9CHOleC11wQwqoPMODoWxUAbsJwwoCwSjD6u%2BFvQp31GCM1td6HRSDtcPyWQPyOHoo6KI44TygjKjCuqSptm1kYvmN%2BjkX74AdMKbZxNDVdcvNPZj22QLch9CNA9THGmtDeDCXujdQ2yPpuSgW50TZbXRSs5cGwwadqBUKfkRQ3EEBzPB62BA9H%2FKPJrQeW9b0x7wuhoO%2FxBgIlYK2yrm8zudpLnEdHGp68jz7nok1iFeISMmGdqTocQH%2BDArcO2OYUTHjTpVjCB0I%2FsDQN9ifiwj46EAT4%2B2vrfWhWZD1SNR6keunRRfsAg6Mu14Etcd4jzG9MgWYmMPTDqswGOqUBw8Wfu%2Bz%2BOiy5CM0YcUh4j814mOvdmUsxYDAD%2F1bzBJS%2FfYxvZDcv2psVr1yOPPP7104SzRowx2wvyrBf8T%2BUeDUyIE2yadVLadYFiXzJeKowOWsGrAuwRSAdRoWvmC73nuVR2VlyXA0uqykOTitvmsCir24pPOj7HE3761R53ZBHon8CZzdxK4wKh6Its5vYx3R5BJ0wwkHwEqmL%2FCbQ6XiC6Qzo&X-Amz-Signature=cc8c51a6731ac71cedd9b56664d3e0bb323470e2f4c1e97aa079695c83da20af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OZMA5EH%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032800Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2FJRzdRUdqKXxyoQJJvAxbV%2BMIlySeIQf46R9tBfLi%2FAiAKmJzOk5%2F2%2BQ4Ik4vvnY5F78BMr%2FulVoVDDO9WxMrVGyqIBAic%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMW3B5qDViqonAbzruKtwDiRIiXY0n6AL4C7%2Bn3TJywlTilN6mwFcmuOGa4TRs9Rzlckbcu3u3qmg8cohddA5I3rngE%2FtTZhKOTxrhr%2BQheQy0NfZ7d7G6ISe%2BTILX5dX9dXF0tC%2FErEZcdXeEU1R30Kkj%2Fu6JLaO%2FVdPla77a9ti0xaQgPtB0%2BBbloVEup%2BqK8%2Ba6MPouO1YLWLhrkrae1Su16KOMtbgipwiNkuMBGOtnQWPl1OxvYQskoXG3toKg31HEsgoDwSHY8zXexQm4GoU2njTcY2EbkwWc1TrJgUAyuc76Jxd6s1MCEG7tpPkrbaBhJfpxMDDlSPJK6SMJF4va7JMn9SzbGl7xRtAz9nsoLiBuL90VqrVVH42B8oT3H%2B3uTdHTG3A9Fd9AfCbjQA9hjUDx7oN6VQt6YjDPYXmAzd9hJynNEN6ESoVeKbot4gCUgqKMntXA6S5YZyLGqDeNM26kNMrJDglGw65A%2Bi3tbzfXJ0wignnlbAqef1zNRTCFfVPjROhsqiGNB8B19iwV0FZXfN0eSBVHV1WBzir5SDZtn1E2IHuZZm9sSIpuTky8nRx5M808r5yN8Ek20pCYIY%2FDUOJnFOeceeCmVywtLB3wWAjlYVtjFiG7i6iQ8GLLsPjYY0nZa%2F0wjsOqzAY6pgGQxxQ253rRgRSdP5X3BY%2Bbq2ECKvKv3vr6UmIkkVRTrRpHbenk4MnxnjSlzI0IYAQ5XUR00xI2CFA2h91Yxa%2Fv20CAhbdwAPtp1y6PoJDhgAbsHNfGR86LMnvHhXu8U2B2OXD7Jg8XKbcO%2BiJy%2FanRjtue2wxjkn%2BZmeFcDqupc%2Bo9PnFb7Y2XAIThKLxRWeMeYh4n7QuTWa3uzhKeBSNYnYjudELR&X-Amz-Signature=e85146aa4fdfd773300b192122fa5813af02affd0ca2bd6b311a4f6494315df2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=22bc74da69ef0aca532b8688fc46c883779bbf4f15267e58c3fd85b19c3c8c5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=c63bd87b7c0b344c8ef72f70b9114fc8bad7f4b89342ef3a818742a496db57a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665MGWDWGQ%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032809Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD2G1XaEEqsVMod3wt6I8V8kjqiJj7F8fxPetL8hFyrqQIhAO0xHxifOZlMfrmso5kKUFuIem2%2Bral2uLM8L1VwuUU6KogECJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzBDEisKsLDMUVMNgQq3AOB7ahw89wF0tkN7wfOebo16aB09dfNOox47OuGo6mpwjyiSWThk2YzJ7Iz910boSagWa5%2BODjcg6AwalW0qVAvs%2B3HHgJKpfLodTITd59DJMSgOZAKFFKKAMGyJ4peKOewaxsLryn6%2Bd8D9F38jk16K7v0iaPMudsgc5jKBPySDuDGWMpR9qqjQxVrkxNjN%2BqMTsgHkZVyQkSLUKMj9Ek%2Fz1FjUimrFprUFxhYYQ8Fp7NMn65cPrhrFZ2O2EWV7zKOHhXWWqMue3lJ%2BgwsxIz4WjiktsLoxRTKwgHOoMtF6nZ543hBXQW4XXsvvV9Vs74eBj9uswdFw6MKmLWfNr5XNhYiRT552fhg7XR9wlkgeqMUL6k681e4pUsA7dRIJ5%2BXBOMAxTDDFtlQcMlG1ejruvUgNdK6r3%2F2OC2uCDKXPxsE3TBh6KtJeQPW2DH%2BQEM1wwSJIxJW2mY8jaoPtaMsA8SR7eGgN792vv0AnDeTQo%2BeWmsreuvezJ1lInYaaSlzU1vls2pna%2Bz6BI5Mz1KBOECr%2Fc0mJqJHpB9UaR5ppbvLCu7l1kcitKt7tC3F5PvbVRty6Y9Rf8FHoLtJfcoTC2flDOC%2FewMVKhiD5zq9pijiifm4GgdMmlnmpzD8wqrMBjqkASKCwTh%2F2wpsBLmnRBh%2F0zbtd%2FOUevi44CpRcaxBTWVUxKCjcCNF7IbeBtbxqOBgUZgWCcDIluGUmEjKwpqWfzCZOMg8bPsPHuKQ5ushLGJppBhixLyt0Iiya9%2FeJvChm0Y2mSiGyQPgRX4YpPTn4Q5CqahcLagJb3C%2FyUufg57Tch0qZliSGZvXguj913MDuFUemMOnw0i13ECmQdqovurDcFG0&X-Amz-Signature=d8a7708fa8cdd5b448c888da97e16973cab8c7a5386d721a98ac80f871cf3afe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=9828dc73371f5b9d8fb9cc0c23500419eb993f69ab82537340b045ace4ddca3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VIYPAJUP%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032810Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEYhWBt6ktzWbIrCBj%2F%2B3dLePJkvf%2F6gI4k2H3u5QO5KAiEAlU2Iq5SEsKlH%2BXPvoNeIIr8K0IT3xhyCpnRc3igT1xgqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFq7HkJ1UWRh74HlfyrcA%2BxOUQaP4DxT59ZI6JKG9UrsesbOW19ptptEXuxv9klWOup6%2FaaT6RAbWJ2T4VjHC8IVJEG4F4UFf%2B09l6zWBZ8SS0V56ixPEGdX%2F10hfoTsrDi%2BGb55ZIJpqCAjmZB6cIJCUAPvGqS7KJVAG89NgYNsBXmCO7Yt6DktvnJWotAcUWRTyey2BwZgXPsW3uiPnFFzn4mOjo1xbd25gLf6Qxu54kGd8rMi2Lx1S7CzRiZPojB1zuvMWdMhivT6B6udTvZnF7yUSldsITgMTpvZxfaonXCRm%2FcaOiCRgGS4mFxvQVQmhXaL47qw1mtVkVUyC0b886fAros3mlt5GuZI1%2FQZfZOSgiZkbbUZpK245l%2F8%2B5VGjfFrIOpJs93u6kLAksD7kpJ1wUdiD6MLyng5UwvNgLFVghSUBzc92nKV8MjjBJPU%2F2NHcGuzMEDG%2BbUlgpTwoUHqigrmmIDYz7ai34HwXkLycfXK2Vl%2FcCEI6zkOamdmRAA4M%2BTjREn1sq0dagXt3o%2FCoYfDg2RsxVm3JftAJNeLa9zNbcIE5NtGKlKidsJBhKJUmqEEuaFpm3%2BG7Vubjg4Njevfhj3h0%2Fw8ILnBQ2cGyv52uUwM1G8AOyifYibVE4b3y5bLfRVUMPjCqswGOqUBKqIvMshLI30UMr5S%2F3rvnFhJyJ5CJk4ymoah3iH2d8%2FpJCVjf7BwEsfyuSyT0g7BKWG%2FYAs9OuOUkycy%2FSgVHXPhTT6JEtpWmTVMZdsLyvZMJygu8BM3AgHVLnaqNvFn%2FxAmP2MODCANetY6Kmuc5Wh3dwjnQ5KujgEwqALZIeqX41ukAHwvt6Pgdlf1kWkxRvZuCxsAnA8pIAqemKosMAFR7ORk&X-Amz-Signature=98ecaa252ff1a212499fe75293a9d9cd0b2837e951368ffe49bc218411b6e50b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U6IZQCHK%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032810Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLnAnGxTbq9eR9uoEsbVmAsDMPSk5HuTm8Lsbq3%2F4%2FMQIhAMPv2QWCc3CAGW%2FyfQQ0%2FL2GMPMSGfGwzkrPzGSrjkqxKogECJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbToWBWsDeZwecyhcq3APdlIHsAOaHbtf6lbXAPAgyAB5oBdHLbIIR%2BkiiQO5JwQEbg3ieqny9OcFfqTwAyy0u4K0PhKPcOI9FejXnoFeqZU0emf4DnEqRJaSk1NszdTmNZpNJtt4G134mS%2BSvNl3jW%2FUgM%2B27UvOqfTOIXFZLdjH84EE6LMfbPuMQKRQP5sNmJFV1wMisnSg58v%2BzghNeb%2Fe4GHyrAj1hUB0e%2B6U5GHGKrEGVk6D7pOuqo8PkODvevKSA1X0m7K1GH%2BNvE1GAFyXL9LVorwq36JMm%2FSrMjWQUc8nfTolqpWgaMI777aRffzNwqLHSFlk5SxWdD%2Fatc64m3YbMv090Db5VMl6Ja%2FveREY1U3FkMXH87KrLWK5IX%2BZ1bLtlfvsNem0btxkICu9VoCJ3PTSlygvPyvHiHSLigC3FhhuNuq3z%2FJkjbdp8tx82BuvmJjCdDm0DpUKkbHsIwouTYYAE2ON4iNLwcAFQ1LJkhTf0DUMAZBtPYG59FDgudLpuasnvPdip%2B3UAFVd1TKlv%2BRLGq8H6QoJrOKzdPbF8prXuAGAQ1wiPbIK%2FdkuZQgaDVCpugBwLJ6DmsaHe8bhz%2Frt0Ii1Q5kRFI6j71H7InFJWM3MB8c8NwFGGXnf%2BEDpOEOTKPDCXw6rMBjqkATIefvxVqL8Mo8QVPd4yxNYJQJqB%2Fh%2BWCO6BPZIRuLVwdceEdrJuBkKpvBWZiLluP%2Fgqada7Cnh6hbuhwAMaL38IAs3l4p8nl7cRIiXZxnbj7qEKxsmck0im7o5N5V9tx2cnzsJopJMioltZ5ktEY2hwZTeP3x1hL%2Bj8acndl7RiFBJPYJI130AqYfUJzQxjec%2Ft6EbaYGNOZncV7h962PMsBRgD&X-Amz-Signature=88395e18c732d6b431b8e2ec40c3b5eae6213c65dbe60dd8b1440be989997bc5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFZWNKJ5%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032811Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDw0sQJGIeN5%2FPGEWOzVc7B6R0%2FHphXiDupDEVo7VLIAwIhAOQs%2B%2BCEsjH7HtC1x2ekWLfzIkM30oS5g0gII8CFhRzbKogECJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzqykytLs72Z9mpfRAq3AMNHnI9yh6Yp89JMtdvJpXXXE9lNxoJu3X3fvZ1uPV9YqAmdVMROaKJqL628kYT%2FfjNlMZCrRoGcfkFoWrYgsLL2N%2BSWved4nV2kZ4UqXY58LiviSmclW5ShKuEcnNzaxmc7u1xDdnXg7NUlGpRutevz6Gy8BppTWw1tE%2Bt7LundaMECN1Tmjwu5dtm4S7XTbBzJ7VFMv%2FeKSwykCcqxeeeE0H6qCu6RvnSm%2FjdKVjEyeV0%2FC9LWLWnYXJSW7ZzeKpCtzQaUtClgAwJsS03lE%2FH1wF6rzoa%2FWbDjnJMpOeBP2%2Fg9TYgEr1xvOVqoHxQOJPunrIUVpqrt7mprCmV9EYBFvxY6imANe400x784lZ3t%2Fhnld8oH0qFafaRXU1FrLELtBW%2FudX42Du5ocvkRejmaAqGnoyuUFn5B5n2QfJAgLFmY7J%2FM%2B%2BUPs%2B0%2FNZdZU8QjvqDw%2B%2F8GjJQXSOMVfJ2jFPHEB2qWeVe6a%2BjX35bHM9ckVWYBIK6Z5OpLxw9CV%2BdmkMAWAtkbg4%2B%2Fv9%2BML%2BZDn5kG59KZ7BWqphruv%2BRxPXgE7%2FdaxgpyZMlZVoMMac4zofrl1siN8rwCOmQgX0cV2sPVdarbTprxurL16Qu%2B55WsCGd8e%2FWsZ7Q%2FjDQw6rMBjqkATWJBLsKRiD%2FknyBfuvP3JXrLY2a%2B%2FEob10UADVYAkdLlrMZkEs7GecSWPLKhqfY0B9g19gweYU0Pyht2eYViWR6CqjEsv6J%2BlhC4ldy9TYkn4gyJUwuzT1ZqFqmXIkT%2FPxIQL%2BX9e%2B3VoSMl5bRf4knT8lm481TGjluWU1IoX1w%2BFbMQpNzc74FPj%2Bc%2BPzJTPKu9l5dIuMSAxd87%2BkiG6kQrlQP&X-Amz-Signature=619b94cbfdfa0ffcb1eeac55346f8cd21a5a3054daf4ba2ad7fffa52a7d1d175&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZE3XMJMJ%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032812Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCv%2B2HQ6rJuvo9xHq6EsbSwHorUoMME%2FGEmwYYLEMqkHwIgEimXfOEfwS80wQttXucGTHx32HV%2FM72%2BD5oKMc00klMqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKfqevXwsmOvnZvYcircA%2FJ7u8Lh4r1y2CVdon34nAs9b6zWfBNLSuL6t9g%2Fy1Bbkhg6xXEIDfGjfgpvlmbMXLaJpg1WkVuRKkShp79s3ME8NL2J4yxfe%2FlKqpb8JhAx8MEFWioi7MVbLQIGPjIjdijy71qOnKSjSJ9sMSp%2F8muPTS1kPqTOVxvWIAl6ZzLYURQX%2F99X43BATKuARzW0V3x3WTxOEqLJGrBN77eeghYhgFU%2Fx4MXgR8US%2FLH48OF3TraOAdppjNjJ7nL3mLA9LALu3rdWuW%2FUdwGOTb3Ip3M1iMD6D0pEY0aORH5eChOPUAuwFXRrY6Acd0NQiu98VRfbZcJx%2B8nzeIhNWIV%2FnMJiC3tgS%2FOw8AKnzxV2eoDLomgQ2iEikKkFOqI5KzW2tZeXy5A54k11abhHP6fT08SGFU4fMZVPtD8FWVrgfms%2FRrmUXcSSGiqSG1OW%2BwGZp6JC8hcb2Qln67H160MtOYQOAVnWeLDwwAh7gzhdfuneBni6%2Fm6akpXTB1qsZeCNofrch7v4TAFCcMu7Jjcgxa32pzV4udrTHuXZOiJ%2BjyDI4LtDcCXhHUSpcxUCB%2BLPfIs5qgdkCzgxdq%2BO06OqXsbMLyRYo9o5GW4pqB0U0ScOShrxaYQgqmM0FWcMKXEqswGOqUBWPLZk3yZ0PaIgDwz%2B2N05QDw79QhTAkf8iYnw%2FjA79RPEPt0i7n20rsWtihqkVuNpb9l5QGKbC%2FdFGSZbA6yZmLE3uKiq33F4d%2F9dE3ZeKdeuKnNBdtmeN2j%2BlGcAw6e5oDFalqgqwWg%2FCWnbJtP2VedF7u2gaBQA1nrS46kaT9F9XEsqHjhmhJuUrLNTn%2FCgmAx%2FZpNkHXkpkdizj0L819kFCK8&X-Amz-Signature=3f7c3f48e11bfae07c5bd4302565feb1c960e3a5d8c31370bc12702e932c14b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=40ab70ba310ef12437b34cb8c79b6440b4e4625c3a64b6650d6be40eea5b4275&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSTBY2TO%2F20260210%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260210T032730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICX88ZlNkVJcBsuUDh9leca7slgcs4GkNB38OdXwSTLEAiEAouaMYK%2BwZxeMkvQdOEMoy8odpHXdORodtkMJNEIGi74qiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWTAzyEr61de5lbbCrcA5BSYJHEOpheXw52luzGRR0A1%2FGJDb4gw0OkaKYZahnvZcDKhjhEoqj2wYhfpgjKqsa7vQMtixdS7zrzI5ykMeD%2FAGRx3OAfng9wIgMbglX5sIA1bzvXY%2BLJWlSWDLcqdikwbUMuxYIWdLSOno%2BSlq3ioOA6%2BtoW3P9w98etEJrBYEopaFgs57tuIpHpYvep1zug%2BamEn1VUZqK7dhBAvD65u3NSeRdZI9syINXxmdWx8kHVQK2%2FLZkDM6A%2Fo9WvmQClh6HFKdXSRzbVavZSz8VkVWmonminLPH%2Byky5tWGx%2FOs%2BCd%2F9oOF%2Boj99mtymhDUSNpqP7njjkRKnxviFWSklk9V7aK4N8nrbgjhXVubjkBjAVtNqE9gnk2iWnbabcgg2ImndgvyJ2F8S3EaAEMq0JYmg%2FOzejPt%2BT2liVt1Eg0GNprJuUOunNUj5CKWRbTsOfa5ygGb0pSGoDy5QECzEsbtxM%2Bf6ZSp8GoTqMKium5Z%2FSPZvqNNwwjLUfRpk0vLLowvwWHcfXpWucDCf1QpFTwuSYzgWbyNP5AyGO5virTHjR0K4JWZj8%2BedMFbZuHojRfPwKNC69IMFB08HizFEtJkx9CrGX1sx%2B%2FBRkwGoApaPtITzOUdfbwCeMNHDqswGOqUBfbAKbNQu%2BcQ9iLmyuRHHN3%2BXZK2YmejzAjWa3rP5xfC8hT2E6z4%2FuDpCDQGt%2FVbCCMiw0yhL0zjyS%2BC%2BYJaFLlNl7ybfzSLXPrfHRc8qnSYysADVEybaW9%2Bu%2FvLOQkKn8%2BIufQHbRHBYjH8APXpoQXaPM%2BGVnRyLpIo%2FhEeyi9sjmsu9AQ86oQMqYvZe61b8wT5Ck1yrlXgiJo4uXqfi2EzCMW5h&X-Amz-Signature=ad27859cdc00c14a1d02da0fc6cfcf46a89777bb4b3a69e86ef068f53662a045&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

