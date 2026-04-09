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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=81bcc0abd98a4f989559483075256e39e0641c19055b8c89017ed3913c72104f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=df679ad25cb1686c9d96f3ccb4ac6f8bc6fefefbfbf648fd6c93f81e7a2f02e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=3750c6efa72cc52ec31862d893998e4a631f124532e61573fef2fb2b828602d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=115d90df8773c7cafc91ef0f92434401312864acb04494922b1244860f32fa0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666VTUVOJR%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQCqaMEVgB%2Fm2TSIUtz6%2FkFtZ%2BFm84w5y0CzmN2VvQzdWQIhAKUedPzfDJoQMFY5NDuo%2FDNbimFsLMii%2Fseh2%2BH4wNAoKv8DCAwQABoMNjM3NDIzMTgzODA1IgwLy%2B1V8CjaiCAIKocq3ANxfGkn6QPhtEX%2By7RQUYL7melb4tW5GCPhTCMy2NJeCPN7T4736QrDpgBiTg9AlFB%2F0e1W5bFs51OVB4NcbUQLBvc%2F3RlSLLKmFe70vA1QeRY%2B8VJEEDBi7ZJIUH%2BCWmlwkCg9yheDK7BPu31p0Xy4nHGczBqT%2BhlyVGwqAqR75j%2FwQ7WFbq9%2F2Oh3iHOdr4DT4B3F1r8mkKz7oOL%2FFVIqIFhFc53%2FllNdburwcAFISi7uewH6n1MqJEkaAheHQvKK6gLYk%2Fuhv1qzhp7LzNozgoAihUsrdByG655ps94vzclemcoMFq3sG7fu3ndW4ScG1lluRSNci0%2BWXzV6CIK4%2BCXCjQZo1BCP%2B%2FmNXpf0p%2Fd15rKEfHdPCKCqmh85DrVCbyeefM8iRfL87MVToTGHwV6Kl89U3ytfwoBMoHvoYb%2FUZjbON2ssZl3%2Bs%2F1Gm6UuxuU%2FvXHb2Olpx%2BptySVqG33PGman5Ak2yeNIrLyZhzrAxIuGxzTUJNBvTL2qSmyyQ6yhNK17pqD1gEEHEDwVVo2gtJiFokPBeHEg7XbM7XW7oy9e5SzINA8FRMXNWFNlnY6Thjhnmguj2Odr9M164TvuZgzDbOGRQdCqe%2Fsa%2BlYkD7o2r%2FS%2B1%2B6ECzCttNzOBjqkAdkLPT8zevlo4TztEhVx%2FpfvrzM1TVuC6wtKjxD0cWQBSyZx1iLqZMy8kgG0d9jTFMH4cmKODmdvSrefyd13K6pbfRltnuTin%2BvBam2vDWZwhQyKHsKR9oyNHPOkfT5icBRIa2aM3lFD8807NPzgBwoW54iaqfvC0zrSc7SD0jgaRfkBTIDHFZow3KFRvwEwAWTn%2BiR%2F630zDbPIRWGqcUYq6Ulh&X-Amz-Signature=a23121960953e0bd95fa7041bae8a099f1ccc7ba18b6fcd6828c3c2035bb6ef0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TGUODYCV%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQCLF%2FD3v2eD2jQqxklSCfxHnXgghPuOqxys9T73VnIVQgIhAIQVEt8xymtM2W3AYFV7k1kew5oG0x1FRDME7CIGmf%2BTKv8DCAwQABoMNjM3NDIzMTgzODA1IgwNrwOPAnyaU1ObEL4q3ANWc9ykMhfeP68qkZ%2B1hepA%2B4XILt0VsmTaxi54%2BJj6ViwV9ECMQCnN5Z2asE6ThCB2jWQdEddFE21lDf8YVa6ActPo4p%2Bc9d%2FkZ30eFFX3EPhdVZ%2F1G3j%2B69XaO1gXosWqTghNQ%2BqGKeW2GSWXlP%2B9wj4GwTncfxcsdq5W3ZI4W0rwOniXUov3h6sfIIcF4ZrKmRtRLD4QdvnhfNAngZzNPCOeWgpfutknpa%2Bt9Gs3mzzlhcrbnQ%2Foj9C4x5zSMzbiWnwL9mmn2DXFW7Trsn1DUO%2FyhLp%2BcuPNRQZ6R3cq%2F0rrqLdHGJqpRllmp1M5iiG%2BA0RnMZ6Umy%2BqHcTIj%2B1KhehQEIHbDmFvzLStycGiN%2F8gdtImUdUaf0%2FGeh4cn1Tg0B3w4WHyamLgQzaN1FL68IQeOFtihNLJ93w%2BKevFo0%2FLF8iv3KIAZGTHdjjzMPVARQPTfV00EEnqDRJz8yBnPlAnLAo1DR2HV0R8AHNs7T8ljglm2taYnxIqDYJZxksS6LD2zC0Ob7ln85%2FA8rUu1iBF5oR8tu1AhF%2BTgzOTUL9E%2ByS76%2BpqUL5W%2FW4cf9kwwkNyeQw48%2BXQQzl8rcSfEaB%2BgiYvPDi%2F%2Be%2Bn8LKZFdlthCV6Ge3BIA3nSDDasdzOBjqkARBLHP%2FmStzRg%2FGGKEneaLc0zmOxBOWotFFSmLZFHBBGe4bcbv%2FzRDVzNUe0Z20bCbr238t71FS%2Fo1TPzpySRyO2p2WanbLsSSizoghbSr3avI3F%2FYtSY4PZ6OW3wu1O6T%2F1tKRrtuZqY7tkEDMuLPbQqBr21N4Vl6qT4v%2BVoLTLLDSKngOoWDZkhD3aUAYawxo20vY030q699pAt8pegmDGZ%2B5v&X-Amz-Signature=92316f445654aa20e6e88193dc8fb8817fb367314555873b0d364b49b052941c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PWS3KYN%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCmLl0IFzlZ3jjgPGJ62uX1sjWZ6TBTvCgVa8yjBzYvBQIgcJiRbPTlntlLO4jbvSCbJ7WaggN2JYRIAHvchP5tHPcq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDCDF2cBiyxxgix%2FifCrcAyaj%2BqemcoyJqTQEn%2B9L%2F9Sl%2BuqoiTTHcovnfG1CluJY0%2FIvlroaRnG9wA78NPc985QDLUkkBi25%2BHfNi7we7y6v6VO%2FJ7c8zqw9ucniJeXGdTUF9mJCfEYYNpYBsxVkcu53JELxpb%2FoZIzRL1UGcmnEk29bLEheKPMbaAoPInzo4M7PIJaEYF8bng6n9jLgxeq3mWaktfT13YdhYMKSj50Ukcd%2BAY%2BqLLacp%2BNGW%2Bq2mIIy6V%2B4kp2qVfdJQMXX9awpl89A%2FuczT6f4Nkj557QPNmlKG%2B8nvpjl4VQZyplFTeld71qeIn%2B4687vBiVGTlJ%2BsPiZsbed3hV31vmlkYIK1JzJ%2Bvtr69CrnJtfcGBkzM%2F44788oYqEOHhJE1Hcz2vXKz3E8143AY7%2Fg4pFtHjykAPESKcLajYtAT7AIyRByPSB1nNesF8aqaTVZScdNuW61h0QLoH6t6XUUJjG2XZq23N5iwvr0XeF0k0puEM2SuWBAJG%2FI60dQuADKMo1UmelPxqWnHaYP%2FEvbibvKZYTrFtzncfn4RDX5c0wdduW7A6g8RsDjr8kxk1tzfW7F4MZCLLTvY9E6AvZlpzXPPqDe6XQg%2FdP%2BIFJ9Kh544jFq%2FHg%2BA5ydmUAvjSuMOWy3M4GOqUBVmMmnFRhHnZr1wDeEc7jw2mXiazo51M1Krj5Yy1w7sUqahme9yLGjYhoLaoB3jXOQb%2FUXf6L4UllDZL89wmI4r1IvW0UmvtsY9x%2BwDeh6edLErs655uCvnfFyLVBhdnRVzlnuqZucIY4DXiDqZDUuEX1adhbasVeursHYSGnAiNooJlRm2H49dnYjvR73utIwOApITErQy2YDjWTpkrUU8EZi5sx&X-Amz-Signature=199a64f098b48993361fb6db8e3b922c23f201c2140feed7b352541b22030f16&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666SFRBZNQ%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQCEZ8OkyYOyHKzRkOWPBsQ8H%2BWzpSeKSkpVnCGzXn473wIhAOG5BzEtSrH86eltPn9LqUZ8s6ZXvL94T5J%2BhUOWd7wZKv8DCAwQABoMNjM3NDIzMTgzODA1IgzhzqbRlVIFt12lKWoq3AOC1eOW0HwKJnw1410wovzmIzzdmfldZSYxDaWlMSwE4Rd7M1BYP9eohKMFw1PkcevQS9kmGkyn1Ii3cB5JbaMJLQUIkF9NN3d5IGax6%2FbDo7fzjTcPAdSV3fmVxWIag8byu%2FAaAVZGuYuo3nvc7IlD3Wa%2BJ92Qcp0lbZxVfPsSK3n0voKSxCRMjVhOwWwqv0iRxDvWjkPKtXImgWoZ7ggS2NaytCOlVai45kRUDqgrBDwoFlq9pM9zMcIGOBO4rQcJiZh7aHujbrGwHDmwCbA89KnmBTbC7mCvOnGA2tGwjezZkovmdODrAPGdTw%2BNa4dzSili13MNvx1lECwh3spig42wPc1meKRCn1kKso%2Fnt8OzP9bku7aE7WBTNeJByW18kWYaAdM9iLlJnu1oSze%2BUVdtnQHakSQp6Fql6W6W60%2FhJnKy5dmoq6XcZf1FgdiL0R6A8nhif%2Bb4Q6pZKkE9DWIgum7Xp62hyaFG8sTdJzuNnDiQVutMcLBOT7UYxK1XqQViLyQyEttI8%2BN89tDat%2BEPeYdmpI7TV686kDDUOHr%2BOASeR475gxfmZPaLcZaFRaW4fwfTE7m7tJvlk%2FBmQ1ZSmV7OSh%2FtfWZyAxdoBLcBZXVdFpNkcJwB4zDRs9zOBjqkAYeGJaV8Txl1wOspKsh4L5M%2BX4yVnkmfKHmWviC9vA5Q4kO7FoyiXu%2BBUZzwrNFuKqGcd192ujR2Tknbqh3rOaQjW9%2BT%2BzVxgk8Nr8rPcobuFUSbmofoOljnFbotDW08xvnL4v%2BsaItVg%2FsmuiURI5CvahPIs0sEP02hZbOQJMPnELmp6H%2FFz5%2BYms0%2F396mhNBrGT6kUp4%2FsTAhDNa4r%2B5lRXT8&X-Amz-Signature=41d38959cf5b421cdd61c028cde032da5f15a887cef5dea49168fc2cac37c551&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=577be56dda3226841ab9b691e1415d1206a61d92bdf88623e04cb42b7380fa21&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=5b1122ea13fa737dcb87a1dab2c015d19990e91237bac8e9424e941fff482b5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662N2NEI77%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIBI%2ByjynGrwgWH2HSemW3BbdsRCGar%2FbdJyA%2Bu3YpwffAiByEEoyxE3ytajxK0oIsgjrO70Hwib9nI293FyUHSmiByr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMMdg17%2FCPnRbXim%2BiKtwDlSy%2FEM%2Fdf2au%2FbsGQj%2BiNkdFaJxAcY5DEUbY6E9VS0mEX5V3yfRQ6e6GcGu4Kt6cZnSRWlYPPb3gnbIKIyJKfQ0kH0Xfa9SozD6mmBa4NoOsfLa87%2BLO%2BWONgJ5GOCWZZNH9mUc7TDz9oi53tFpWert5NhknvOgxwAH8mcIRyPWBbG8pqYCQbQhXZzKOfwf9p0pH4l9Z2ZjWDh6InxQPaiA%2BfCOfjlCJKeEqxeqAYb3r5R%2F7KncUBagnZXSP6n5T6wb%2F7MY%2Fa8dy24smf1mtTI2DwmVOESzuKi8g1BhoE8pnbw5PUsONW%2B%2FFD%2F7YmMctBURSF1Ou9vhyiWNPZDSAdS1KBkG5bHDnXrb5ol40fKeprcIAXVUcDMkE4FvPvnx1pvMI0WkkZBL5AqW5OCP%2Ff1tdmhZZxKv3qoo41iGR2hX2pRFQfB%2F1sXlHYU4wpkC%2FPdp3EdiwU5jOZf%2Bv6Fcj1tXN66IaAEWYZqJKx31SsbpnOOWujq3kC4W4jPP4U%2B5vuYYQDlOuwueSma%2BLJVJIuK51sqGmYFePX%2FJ2UzFW2Qicoq6CgLleLGvLEe2CJjz4uulXRsa1n7LTaRBLYKccEG07kX1dpej6XRW1fv07LWY5p7oYSSbEGVpU0s0wyLTczgY6pgGm44%2Fcdpv0K9FlIcdv16ZO0l2amVDBlamAQeMhSgRYw%2Fn9Amjx2jw9OhIdKn7ALwrfFLoGrUiH2wKtVNr8iHcDscMnkJg5SSNv5LUTj1ebrCnM9QasnC6lD6SlvVRJvt6qNwSpvnbkH8NbTMXf%2Fjr%2B3tqcTOy%2Bvwp67k6kukHlpJp15QRvBwRlAnfyY5AA8cBG7f9lFWShxDkX3%2F3hHMUVn5Lq9OJP&X-Amz-Signature=cc536667690180687daa3781bf38a5405b192c608a8cc4c49d746d9c6c0a44f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=cadb126fd008a6c879c2085e40482d4a1ca165514d244676d330561fd5f8eb3d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VSBJNUMQ%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCgjQT0WS7CZ8d8tEa%2B0UhYDmhjtcRfFVhEt0dpOnBg1QIgI68NFgAJYLRTGZ6IC371HgN5ldxc%2BoVzAnPTvPgNIkgq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBmc%2FVuCxPCsBv9ZFSrcA0fL6JNVQ01JYc7eJhpscJJw48bpEf3fmuPoEHeLwfX31zgsOHjoJgpFBW%2F0Whxi3yugzeJcMseLPyMbJc7Ll5EtE7Du%2BqbgYstFcc9u%2BduBjw6PudAlyu4OiMyitHZOS7KbV98nSaR9samzs%2FkGSHLhk9%2FUZdgOru%2BYQw6kH9DkeLdvNErHD4iqdAPo31z44zKhgQbQgZ%2BA4z34uG17%2F4jxFnGwt7r9sEPi3XQqw44gsWmGd6XgcXTFRyEr%2BBGsBgQnZ8UWUHIuE8XY0PtKOdnq6zOT2DyZaAIwt7mjBC%2FpycbHW8kpULTAKmw2TvWpRZTwzU7z3s%2B82C6%2B8RYFpf3zVPbaehn2k5RwGk6YOKI%2BHpxSIsMP2iRqzMQsqc9NP2LmvSJZNzCd5XeeUfS%2FAtce%2FksQkpnDiTbbkjizx5rjGboaltyUbQaIK1b7m5xZHErjHcVE1nehuT2tF%2BzlSL2yZAduvF7MBuVaMf1wmLjC%2BWkeGOWAWtlUWwTav%2FKDSwVVCxxkzZMyWcbQvQ49pWuYkdTk%2BnPPQhrpscaREhB5FSR87Iu9oQIvdiX2ky9MzCPvwG19ZxsL5kNkaDJBPUTz1Z4bgj2GVbI4F8gQNDQMV%2FLdrZ%2FGk1jVzhGzMNyx3M4GOqUBEXmiKuoqNDoRLFt1EsG811isPztn9iud80dpxVZN5mclSu0IQc0%2F2Q8yrGNzeQwUYIDR0LKTgdLpI%2BHmgEKVoJaiHHRx2PU7eyJHH20SlVePOJXtt2jLbTrmCfXfF2jfGqv6%2Bl4%2FXLNst11QTDfReXQlIpsgkUB1YLntnnoO5D88bNxe5dB7Fa%2FvNt9dtl%2FaHTFaGSOFUia27ZnpwmWLEuKZxsQU&X-Amz-Signature=8602ad2a8cc2ab36cb2019d2624914de428bb0c21095e74368fe3712af90b3e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YLNH6XIC%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQC396Z%2BABJDOjb%2FqQtpq3JqrvUaMGGFNtHF48X%2Fc47AfQIgMKR1kN6M3opzA4hmLaj%2BlgX5WjfqwSmAD4xCSBuAGY8q%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDA%2FgdjpI05Gg9Pyr1SrcA9kvE5msPaFkaBMhuXFfd91stscUL2W%2BTieX%2BERBvCsf5BM8gfrbRqlERVWz4szVCwchYqmirQe4gnxFC%2FVTkv0%2F2FNDambJzIahrNCdDpq6HSpJXOkBfPHoYblBgpct7svQNb1YX2WGWGTYHPaMSkuHl3W0G3LTEtLHJWSey3zk7Nfwz2pMWJlDsXbhWKx1ijzMhcm9kiSnM8XmRoxffvOwz7WDJo0IvOihcipP2LrhGwZVKI2gliDNd%2BS%2F0%2BjxKfSCuq9Nq7wtju0GX4JXJkUTLEdMQoQ9GrXOhDY8FYAr5GTfd2f76xqnIoOXGhaptkNBw%2BX5KAovJ2%2BNu6LHImzGh1d%2Fd%2BpO%2F0BciDrOgyb7lQ9kQr2GwrdYNhA67G%2Bvau0AgKWOAcjqt%2B6nfIg58DpKVl8hkbePh4H0tb2k2gwF8jsHBRUs7dQR7JrbZTnkCmpL740jX3VxBlTFcv30UV3%2FUgioeP3p6NMfhRw7Dq9xCb9futthT0gKEsKDtFk%2BabRyqzJHVgbVF2JiVvyUJiDEfX2D6jKpx4b%2F27khkDwGwuGK%2BONdgmZuQwwhje%2FUhAYkfk8LFTEBxNwSBLyazfN2Cr7cPBK7jvxr5WsvE4x1pBn%2FwLGylOKS3JUPMNWy3M4GOqUBMnauS2Q3efntt%2FnJvvCyehu4fkPC84LP3%2F%2FhdsrcNfqU89TzlESefe8hsdVoJvxJ%2BecZs65uFA6fQ4e63R6MMOmlYnJJS9lSnSNfAcaPhfjqHZPpEfQyFF7Q0I7MYeNmBiTvN57VQH%2FzcoEv3F%2Ftv2Jlnc4%2BWvdVJIGE8GgJUtVrTchVjMDBgx7mwRkZk8MdkV5ISDIeUPoJcmBsK2sqDZtMbT%2BY&X-Amz-Signature=cf3c2407ba1864c5f9b1f992329e5e273857e97872d888626d55d5d910bcaf7a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TITWV62V%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032928Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQCxJ4Jhih9RvtKMRk%2BdmW8aFQ1tZCS6Z84ZwGsDaS%2BQXAIhAOsVloP8E2RaTJaZzQzrksskPjWaXGjLC%2FPyTE17iC0tKv8DCAwQABoMNjM3NDIzMTgzODA1IgwRu7%2BylzJwG8fYPbAq3AMJCBk29WuYZSu0aF4jcfmgdkUnVtM6nhKT%2B9EBKHynIEidxd1zvsD%2F043DYxoelONcoxAEE89kAQxWv4OeU7UNfApJRvHbcUC%2F9Mz0molnj8SPtV1IHz2KeWdlIUv4HIEIVg5RzKmlQoBBW%2BXAl1EmryCixdDgOICQzEVoRW1CJGG49uf3kL11tqGRGGaaoEKlsjXEfWFrv1OC4XK4%2BX6KhSmOo0B72CRAedjqhZtURy0FMm54ZOvZLhgkY2n%2F63o1fBiAf5IO75c0Xd3ub6YjN880fLGlIsCEup4OF7UpyCLQNcMnpwurrhLiXh34GhyooDgR44yrwTVMilXhrT5WNopDDp%2FWWvviwVF9vQa7caCZs3Id2TYPK78G4J0XbfrJ68PX373gEHo065ktkzN%2FQ1J%2B7fVnCphDJrqq7Mg2SrSDOJd2roeqpyCpfPAlKLp8vR7hCgao2nngrmi7kqVTrWyfxuZoBsRcdxWKngElTc5Qou70jqal85fUQJB2SEulddUzCeCCkE7amCVNKknH8zycVJpOTaCxrJloLNfGugmm1uC8LmBNxnmZlPKXoO6QXRVRO7dH9sRovN3c7asb6KiyHIcOuoIKcPX8uLY5pI%2F7uZkLTvwNapwBFjCwstzOBjqkAUJIrRICq9ACgOCZwtXjEjnOUy4tG1Mg8vvu35bED9IV7ohTBO09AWSfAnOiYjQT4iGp0rhuxaewU4mzbDrgRq1QkwTPT3EFjVM6ugjlJj%2F3Rqa6A7loFdWCwIFsWGmiRX1ltyzyY3dhnnCQy2qEkkh8QwRCf2pNqtQwdETUm8pj%2Fe4Q5YOe34SSbv8pW6YB4Huut%2FE249%2FLND3tHKkOQMet%2BI89&X-Amz-Signature=4e8832e8f50b9ddb28fda1721aa4f2c7f01e43440a7c2eeb0b379095ecc59265&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664K6CL5NX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032928Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIAkcbIuwvlD75NcVg6I8iKbv3VyWgJhkFEQGV3WfrbSEAiAf2p9IM%2FOwEbxgLRxJC5k8Z83iIePDIJGkyElOnWpfjSr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMbF6CC1nEdHUB2xv5KtwDMIDRnfU28eV4D9b60W9DX%2BjCFVZuF4LxFphMA%2F%2FLphWJfS5hypxQB1aTFCv7iFbpw9o4UbDe2qD6ifq9qUInSpSJF8boxQ15pZvPt%2BE%2Boc2E6Z32qPALCHL%2F8bTroUCXSKMRq6RmFM9fQTWoyZon2SrPV4r90tULH0mMYz4be%2FdfFFLwv7qytlmMk20MYT3m%2Bcgik%2FYBoHl7a1dTSKZBQ6KSP2RAbNOs6QuwjYnWvrMbMiYnK3KMSMhOsHA%2BPKiCOtguzHUIOymKetLMMaRVP208GEDAz93AW%2BNw%2FHVuTVEOEZxTkmY93TJEHDNLP6WjcB2zII6Y4klXiPelG5W9ETUG%2FzVJwsv6OismerJduO5WSrr2hj%2FoFeB%2B63eQ9l%2B3h4kL3vvuOUXTl6h0VysqH95hZ%2F6o%2FaEUcGhaNiydoWrvPzz%2B82YaLvcxX8oABB8z1Lw1k1e9UrzkkgNWiVMha%2B6j8rcdNdVai8BrUmLSBjmn%2FrnFiccIBfljvekgQDZ2h758hv%2FDtuhCjCPKe7qVBbZ1yYNHVmzG7HQKI%2FQUvD5ab9avkOqxZLA84UnOv22m%2FwLEtV%2FkM0sAXWGsAyAMX%2FVY8CCfxmwaZ8l2fXf7NwtYQM0uMm5tnvfmX6IwwLHczgY6pgEbbd%2BbPVsoFONxryg4DGwFCEC5cyrIV2DNxlVQuW12pknow6qV8%2F5HzPSiqZXouI%2Bm4HTZKw9O6ufI8NarvMyVADWBFisuZrUTGitG0XCQxE5euM1xUSSDFkFnTZs%2Fo3dNfH5UYZ%2BBuZQjo7Z%2BCburO%2FysRvYiPOTkLmevkmx2ldgEHEcw7yWnEmqfJkyLYXcPbZiMjVTuZ5DAtseCYelNqI%2BDsMEN&X-Amz-Signature=aa0b3f7261ccd3bff7995470a95e3f4477d2079811f9c1330b732938bfef8298&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=76268b841910392e8de5da72db15202c1b6a9d9611249e3b82b0412e1d5ae4c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3QERAWX%2F20260409%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260409T032904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQDi82VOCfNBLM7D7OuWYxJyiHQmliXZD3HUirV4wAqQBAIgLO9wk7UBFSyaHGwAXuIzoEfWpzSAF2NrU5AKfdpXXfsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDBCdsrR2J5YO3mu75CrcAxV42ueGMpbxT8CDWqeKEbxI8war8cA3be8eMRfFI%2FDmQqJuS5e8FyAVOjOy9qqf7EIY9LIhemLXZqfpYo6FYtUATieIwgkOc63yhgARZHyFUIRwdKDHjTTIBQjmYsemGGvYxUZHIWzmkdCJfqqJt3Mv5HJsdKA3CI%2BijB7DwGnUW7MGwQSO%2BFEb9CFdBFsVFFC1AU52hEXakPMTZpWA%2F3tygFqmxTKAU9GX05wqdZrGYZqZQ92HYLg6pZcKXlugivIy625dFnnA60eZRqMOuXim%2Bc8wPcx3lhIXSFBmwJ%2FH0WujsFHkTn%2FZVn%2F8DfwVABcPv9l8hbAUVvinQ5qSXfWw7%2F2ITf4PzBmznIXR8JlrjC1X0Hd%2F5VkpGPh6WpFnqR8N0aPvweQfdxVccipgbWtUOBOODkhJQ8RBV8jZVpOIklFpSDqtnThxZ1HlTCgB5c%2FBczJk0gUqkQlngGEHQLaRnea8a7bBxx5xMjjBZcntVxpOj8OLt4WbXvSrNKgelHz18%2FyNL6XZtDvGwZ5l9nHNS8bovCyu76ZerxcSwmMWvrSD1C9sogrVxx1Qh4mfDshOWEuQoYsorVjz4S%2BrTbGM6RToQnnHjQyHWgm5Zlt%2FHOzFa9XK5Z8Sur97MOWx3M4GOqUBuDgAFpDO%2B4m3232fwUzOQFFZ%2BKZZ9eWNQoW7jqQYkvy6RYGOH3EmVGFUSwatketg3hbt2h6%2FJNurAsTonqZUG1%2FfJDthftcIEY2jgIHLoqlbqNz6yzOrngZtQG5NErbexO%2Betl%2F808S0oAxZyAscIOHZ0Cm6xT%2BPPTOQTAk%2FWzPi8VBGzLvoyvBf1HKNxKjsoJ%2Bw%2FeodPliDqErZlVW3Fe5Mc9lR&X-Amz-Signature=d9b153260a55159d3fc8a4b50b50cc4575c4f729676d954ce5155325b2f21f8e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

