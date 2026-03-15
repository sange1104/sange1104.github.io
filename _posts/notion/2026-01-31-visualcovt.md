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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=16977a49c03872eacc5a72c3f7a68b9d6c4bb893351a2b66b0b28de41aff0a23&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=4eee93500bce196ab5ee0f290a9e85d04be48c363f38335328fd33132bee4e5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=00cbaf2c3472dc8e684fe98d048b399e2e504410ed37bb92578728bfb6c12234&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=6169805700b64d0ac0b35f2dbd73893c8d4cf5682782b84cd32ca32630f2cc07&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665JY7RVOF%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033249Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbBLawbz5ZrRJOioG5emdg3Ag3Lb3IqlPZc1JC43Vo2wIgZ7%2FbdTbvGT%2FxXskuF9IF%2B%2FFOCWJH4%2FH1mHVTEVaD52IqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLnx1aA%2BZ1nB%2FbFyLircA%2Bcz4GTL%2BnjmGZhGR51tvKrrCkbyn2UONW3N2SnA0I82l7MxBPM6l5TlY9mmdGcLa73BS3yifn8B711wqhwCrvNCgqmH5uk8I%2B6qkXQBFDKsdIyLi02BPY75ED%2BTuyROv7hnTCn7kMpvlrGl%2FJ0szYIM%2B8DnnPXuzu42OyjoQ43EInmeQ68RYgGpOS6ruGDIhvvP0IAs42sSSWGKHSpWNy989zMln5sx2PjodWSLE5IZPyRQEEwzOqw4G6H9yjQoE%2BJoImCIsUI49X%2BUe8OtkMjMvnt47bPhCU9tj5CjTpcaaTFC9gMPdyr9IrGd8K6prf6HclBeeFTbB0DnKMohfcI%2B5PUDGyXYJBGaC0pOp0b8t5gD65DsOpyEF8ggB%2FPIpZoZpNRrQiBgtAzGizfsL3s2qzJbEOUtomqiUYc4SlDXWQEqiLyFxgW2%2FQSgEnrkd0kezl%2BilOaNPBz%2FnMiOhw1it%2FobwmxZuR78io0KUjWzUy%2FR%2BoTbPL%2FoBQeMMJqw1PoAxsGe%2B2Spf6DMzB9NPkqav9q2w%2FZYl5Y4Fum7M18GjY7UjYhamueZmdFHhfF7h16%2FfQP1I507vIE9S5j666IuNK%2BKzw%2F8LwfA7SIq5zy%2BxP4faDk%2FQo%2FAxxi1MJ2R2M0GOqUBFob0yluTp%2FFT9mjn7uEjWz3iQJpiAsdq1RHcSnYvo%2BLG9GO5j5eiXzrquSZSt6jVZdA4zwRkWGcHMGcqSCO1tZEynGpM1YzaHtKRLwpJFSQ3Hbc%2B9bVUtxCY60%2BAspS1p3gATon62ug9SLm4Hrc0Q%2BsUfwnmk%2B5JSY%2BuCnYdgmMxbgOZ%2BRZwaOLsWOdeQhZ9dssc5FxZWGplMKneyLsVIfwPLjQL&X-Amz-Signature=7f1da4225780a31fd9eb5e4ffff3d3dcd19ecb11a9efd69c078a3ed44a08b3f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3ZCK2AL%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033301Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFRJsoW9sdgUVg00jLz0dMFpHWvkNYh5OzOLHCIj8rGXAiEA8hyp4l2%2B94d8Z72j%2FmXTUSAWdAWVju2SghV6pCUGo%2BkqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG4Dn3vJWfwUgFeB6yrcA0%2FZg8nTNRbk5F%2FCEqqGtY7nJXLVdIMPfR%2FNeY2Pj4suaoOphOjzJlFrc92RlNQy%2B252z8IKjjAM%2FPRg%2BpiutkV0%2BhQ4XpfhYEeQBdRiba9hSpYisdyiUo0fJS6d7SR4cQ8lc5C%2F3U7bDYw%2F%2F9DNFhDkwVW9NKCXfSL0ZmhDEn%2FTlrLp%2FdWZ751GLd9hrqp1w2WvlAmSMMp0nj6mvPXA9WBIz1vSENquX0XhYBxUVP62wtGOb7rVEls4upjmDSYDCy23ZuXCZhpXHAI2%2FKmJz7xH86Y4KIoDyD1u0Pm9dTwQiaubBA6SL6VlZISEdMGoOcAP7hCmSPx7AmeiGQmcSGRVfhRuhutEZv8eTPfocJcK7GjsOO30XdYxo8ilf4eyCy5STIpzbIiyHNZV%2BYDxwtA%2FvbBvESK8tAIF1R%2F9ueoRBOnL7PcDVazMWepgxZ%2FQm9rxhlJaYTwg7vdWFmRftvKHHwQ06xqZyHaCVRwZYIsaBa5oxZh6y%2BRUQRQy6v9nmkzNRzLCs6EAVKOY4kgK1z5u13nx%2FqURtxzfunHknReEDNezdReMuoPtsf%2Bt5YcS%2FQDVjJ2GYLSVBK2RnPhv2ViJfF6lGdJbN23wM0wpiDGu9do1zslqqVwHGzJYMK2Q2M0GOqUBVu441lDIbCyK4a%2B769KvaFLdZoG%2FH6PTc3BZ4N8enqZK3P9K0oEq6iC22YUEQByP7H%2B61K7kGe9qbL%2FOIuWOAZYbuMtTmmBrp1v2MbbWNlTNK8Ef2GrkJ79TLwp2EEQMgbRI2fvTwxdh1DAyCcuXC0xpg0YDUYgic87LNU087n1oWKod0F%2B1TN7gAi5yrPrx5JuaV3fQu3Oh%2BXJxEc4mVhr%2BU13S&X-Amz-Signature=0bcc58a30e8fde7e1a5b8f41a478f4c16f22b40d0f9cf2ebb8b6e6873312c857&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5SDQZY5%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033306Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID8%2BoO18iCbd2T%2FepYZm%2Bi9bLyZZJMAOdOPyV6B23%2FNCAiAupMGRLVwH6Xl7pt4IZbgGgtC63AR493pYDHoeGgfBZCqIBAiy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMLTIAgdxRvY46hv6GKtwDcSmT0wCoLmtidDhrKXDciWlhUkBHa9o7o1xAnp6HSKOiYVZPAVMiZxkvJrMeN%2FBLbGpfjZ15Nh%2FRaYt0RJdespkNoDhAx5wIjwWp5ru6tt47aN9nNW4vVdeORZ5ZdqkpsvkH6bnZOpHW4UnUZuzj44d4Xnbw1yT%2BLeGNL5Y3pQ6v2tfwcyTxUzXtMJFJ0bbjC8r378tXLMobO9etSVegjnXnFsICl0CAWe%2FOEEk4dOf2xMe9yw3B5mNb%2Ff5O%2F0MMfYOZ0Q%2BL8vfMGsR87UnBQbje8NY7EV3kWGVKLM86hYyx1aANTWuEvJxF5UhVWxwasOHMPIrb4z3twGsNMFqe1%2BvIDQArUvCOe6uSN4gJkA5ggqcGGztMuGjjsDgFcHOUBmVXeJu7lTSb%2Bvlnzxo%2FDYdYbpySDJF%2B1ryQV0OIWXBXOwe%2BGxD3hR4U9FAbyFalbBRd9s2S0YTNscK%2BiCLAzKqmuMA6wqFOMwplc%2F4gR6R05OFfsRQ1b7gm1S74%2BLtptszV35JIwCpxREATah15dSsNInrWFpV4cuCTlh025nhhawstSgUysX357nPRP0aJ2aXGcQCE1hFira8Vqc0kgGoFnoQshsL6KKLV2KJ8wkxsb56SVDj451y2UacwnpHYzQY6pgGxXfl8zucaX66rZZug1ibK9QTCLJ7Fyx44Ku6nVEJREkfjyzwVigUGYOv3ubA0rOIbbD0CQkQ5Dl9vwS4uWTIFd7R14Mw4m%2FXMgaQDFWvZPr%2BvCjOYT%2Fjc8p2UyoSsieYvI7SILyX8GdyIGh88BnWUyDbEfvAGTvIy32kAPx12YQZrVihKFWJleTFNufOaGeepvlzWPtCcitF1%2BLqYhq8zMhY0Ohci&X-Amz-Signature=3f8fbaf955762fbd0f84efadeb9a7da28507c6e11c204bf597e25de04e0e677d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666DMTOB4X%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033306Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDI8Ts0eGGnsXzYp8t7vzw4deFDh2gIruDBrIvOOa8Q5QIhAI%2BGPDhsjnNW%2F0yd5YN%2FDYPgG2WfTRqZ72ub1JwDE2ikKogECLL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxZAOBrv3jHE1jnTMsq3AMFWKXwdaXidi5v2XTcVmvL%2Fk3LyLZObOgB33ii9%2BFC3jHtAa3%2BaFgg%2BuvUsxYJZjXgrp7vnMX2YTuSolCg%2BRmHa5xigFT%2B5Nrz5VOQCaoyZjXY%2BoyavaknTLstheMUspc6IJ7NnAHEYS7lCQBQxnON25z5k6Tudn1U0NL5o40F5DeM6uQGbveXmvTA%2B7%2BcJFY8RMHQxwECY%2Bh29HdkQ8kEwWDsIOh80y9iZgSCuTy5tU20KAiecPVrnhE%2F%2F25elA%2Bs0LvNd2A%2FSR8zlLQwLW6D%2BDO4Zg9EMijZdC6gw0THNtwn7j72S%2FpgjezMUAUVn9GEZ4ypmoFvTe8uncw0X1ImfzzH0awMSDDtERphBWyjiNBbMDq%2F14Fht6hgHq7%2BMQXccMsB6EZrHlt2bA5xiuvxPx6LxE5vZ5xuhs1ixLb2%2B8tCVzOd4YHAI1wt%2Fee8tjIzqN5GSSVBVi05w6QjT8d4CHEd3CIkXy05eAg%2FJHuDSh86aP5eNTp9vV3IVMbrBrmsmvtHv7XSHb66JAf6TCEVtLiOu3rydh9pJqV2ViWZl7LyH658ToiNM82HF%2BnsNVbYIYC4O%2BDcVfG6vfx7nSJwyfrIWdAOZTFciGz4VNman3YSMgP8YvjLe1w8STChkdjNBjqkAQ8Ookg37FK94I9kvdXcFw74QcwNgpQjEprmkMMBMdpS5kFp%2BsyvE8lr%2Bisfm5xVLehZdUOEbdNEmOGQCon%2FssKImC%2Fe9iLZ95%2FJk376qi9R2fti7GugIEstPoQbcyr6eVvytL%2FlsC3%2FSKZ1ySLFXwzuGr%2F1BdZqvpnqpUsPdIF5S2I7snoUGCRLFEKNa5%2Bb7VsTvEUh%2FRbQPgX3OuHqdkj1MH8R&X-Amz-Signature=322b991429cd51ef26c599d8cc3da6b258bbb4435a4175f8122e01a66554ce56&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=af518a40786384d1ec499fdf8125928e46244bced113cf25cd27dfdb5018d587&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=038ec40b329308c11bf131af21e8450377692e70fc13fdbd8f0f026d78230e32&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZAEFIXVL%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBgs8hil5K9f1%2FbqR7xF3sVEbw2hy0I2Bl%2F7T7yl4qY5AiBEPqPUAlKGwRp105wsNq%2BTrhz%2BF9jAkTyjq4POa2ekhCqIBAiy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMApnP%2FDT4tTbEVT%2BnKtwDC8F8i8WrNRJr92enKWU157YDGj96kZevlP9u4Lw843R2YWKuiZ%2FpBU0oq1iYdUaKftPMiHUXIaYHSJLo5Qj6mUCuyl%2F2raJQWAKkWHqrvCjQvsK%2F9WJpINdv9VI7dn5kuilMcwGUEeHL9fYSDZ66aT1XDea%2BqjZWSMn4%2BJlkjB1tYegxWvtbqbqcI%2B%2FkDi735Y2lVmGFMEDcaEiYA%2FTwvhGq%2Fz60Yg87dZ0FDePkWhLuHpX9Qk9FRC2bj9R%2F%2BqmLs2fCmlxENlMVsAQEQ%2B7UfkxIBZeSwcZJk3yZMX7vIUATsTBfjbXD76u2tRju3YGnZ1ECu8Sc85y2305aMCUf2NtJ%2FkvEToTtrB6%2F8bIvxRhPEK7hgZI738QL%2FNzcHLOroWhBfphioMa6tjYBuFt%2FPJ8%2FZgvu%2FcJvaq%2BBPXpytXfRum0keay%2BM95GAa8LuPD3%2BGlYuwNA248x5m%2BXWs1asxEaMsR%2FSkJHb7DSEVsvzwuI2TngtH6wLJ4%2FfIQ0E8QoHWwvGuHYJH3GVOS74mAByPhbkDCvbxnYNW%2B2ydJUsvmNNNaV7SFKIYkgLGFFPqyui%2BuaavC%2BQWbx2yKNszPxtQaiteqzorlU1aqi8AjEcaMOtrrOMU3dCBQ%2BqJIw7o%2FYzQY6pgGoAKi1jPMxCMt0YdGQOYxG8IkB8cPRMYhA78ZIuDC878KbXYd5RBDwyuf2fll9zQMXsr4K5pY9CTKsapmBAb%2BAxgvxMMqgskar2SNTeRcL48Mic3%2FM5T0kP7URJLPS8AUjnrGsVICo4NsFF2xi3EWviyeqXJig6puhd8tWPmV2C7yR%2BDbIp04JqqileavBFszpDlcVENu7pNfuMyM1QY8BguZM6I8n&X-Amz-Signature=3d392425f1fea285d8e22757e3552092ffd416e70935926e9f78a66203192763&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=36628c35cecb67b1f6ebef3507249a8e84f6997046617b7d2261a6a2863a99ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667PTJUGD7%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDAQKMlcB3Uc4%2Bnp7XsRv2J3VuX2AgM%2F0ZtRS8NjtBXiQIhAMSsLPl3eac7FgCM1bwlfgq1Xmsk4K4LgLxR73iO%2F0EmKogECLL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxU2HNmje1J%2BagyNeYq3AOcF4JCxlFX1%2F6szLvxPons6bYmySHTezKKK3F9LocrTmAQXTU%2BrGz7hacJ1UwansSu2T723pYU5BwPCO5GqlOmw5CRoiLc%2FovEzvzgp3Lr81YO5kwq5EwoKiteuZEpnjq6djKnmIhj2mZwWfLmr2gRQT9GZMGbKov1Kr8e99HTsfKmQQemXTYQXkdHXQPZSz67IYOS6C7UJWFLYD1X8lNehoAc79F80zUPNOYsOka9PuNAjSke6A92hVzcvbwNygVL2KPqtOZtGeQzVjfz5bXOfOoj7kjkslGLAP%2BO%2BqOBNUxlgkCzyemsVigFa9aZj8kHdNWcZwMPze9IKptc1XLS85SIGxjlICtFRS3Kg%2BBZGOj6UcmW3ZTU%2FAVPZP4TcuWNJTjz0uytLsx6RPaWGPgO283PA50DG2OX7QL6fB1a5ruO0d3Ob%2BhBSJac68%2F5XX%2F8u5HqODvqyBngGg5%2BalJ7eTGhTP8U7prJADqLIXGgiyNW4awwB8ibL9nPF%2FvJ2SGYxmviSD7hAvjj7wwxM%2FCKMsPpvvktq87tAYyhZhbEnyCodnLKidOkpc09vfPdZL5EMlFKtoILU99ZH7d2kguXjc61jF1QgtW1vk1sM91gPiuKts%2F9WA6uTDDzkDDGkNjNBjqkAZBCbCPBPmp6T7QystA7DLtfIOH%2FHR7TuEi9wxVnkqxoZ6IhqUmF7euX%2FMD%2F6cuky0cXvP4MwtZj7tBVH4GjWyUUnnBegmwB9DgSQak9umgEP%2BQM3Kr8D1InYQgqDWT0wPJzIA4b6Bo6UN1dmubyodbu41etZNlKYmtBbs1o6fSgaxt6y49IB3sxqBzmwDIs8bmXl7K7YzB3yk%2FDxjyZUFdlhu2h&X-Amz-Signature=a3b7526c40e41f0f70b11d59dd74e634ed89158429af66f1c4cc5485e16ecc75&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJUSIIAA%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD0bohHjnRC8zHXCIBP%2FXcmCZ%2FtoeAJIyM3zgyop8dC0AIgYBxHcI5HfZO%2FYUIAayass%2BpwxULQkVI0d3EMdCLXqRUqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEgoc7IOnr4HXsOy5CrcAwG%2F2P9UVJqJgNOA3ELn5CdH2ybhso1CPiW4DJDNeRGh1W80aLxesQ5uMb3lqQ5UvucNdLKRUNP%2FukSjqFXyqaZ7%2FpjnPUMvHktxDA8ILyLkqaM8nNWJ1CEK32uxlgMWoWADb9cnRZaohoQZk5Ee7qWXy74L0HqHs2iszU8eSdnvAHuXquPygzqVm60WhwKvoOMh1hArxsqZAH%2F4%2BFOZVJXTPbdWJln9%2B62%2Bj%2BVee1tEyIXSfLqiTghJxLBfF58hV4t9zaR2l6jxUSo%2B05VVme6wUnRV79APIa0v6M4A9VjOiSMeO9KJRojfCNV9QVQ7FITtvjukOASSBnzaagsmvMbNWto7n%2BlVoH%2Bsa3JUH4FvYrDKiekxH4R3LMbYDnZt8vMzjABwinchsmMkeiVtq1PEGKzamGOuUZSvE8ug1DbwReHBYzkp1NCb9dxQGhNH3KOhCrITdGq75kEZvNWz%2FY8pZmfWA%2BtoLCbN%2FRDdjdlfbbyXZYavQpxNC1h3JgPwNMdVSNIDSVDU0QnRdi87D3ams%2F4hMXRKKK78eV4MNyKC4f6L8fDtIHtXqqad14iLfY7Ec4IxtDITQn%2FPo17%2F11nA0agB86eNAF9iH%2BZd6nLNAeOB6GAdiWlRnd7mMNWQ2M0GOqUBuipFpz0U6wcsfBPtn5FTkm1goTEGL8gaAOK8qU4xdPniMWuY4iRtN92xxcY1X6%2FTGGYaJofc4gLEvdm5LrtYFnVrRx24L8YebBeL7PZcLuP0ax1Fu2CrcucyBK4l3ifFvEp4NRj%2FINIBElxUNHtadGXCk%2F5%2B5%2F9FbQlqssJSZXHf2swolACB7GVnf8XqsU8mxJWatDnecIBzMG8VnEJcK7jadlTv&X-Amz-Signature=bce1e21c7c8a6392bd421df356130149cfb7b4338a61d4ee033994f1536b690c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664VWXRLQH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDJGc6m8nY69exaREB8kgU5pk2jD2GomTHzo2lmnhP8MAiAtjl72P0KoXjR70ctsDUTWQcL%2FdeNbUZ%2FT6c9zeJSmeiqIBAiy%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMAgau8Pfg58lMrclrKtwD45%2B9%2B1wqSEz7VFwan3kko8EGPkY3esCU6UC3jQZ9jM86JJlhShGJc%2FxJVd4DroFdMwq%2Ff%2BRXRpW3Z4vFTKHjjfvAgFBOiuXm%2BgwbOsok9zcQjNWKubHmTkkVstfu5Oosv9EVnNBlrNwKjzJUW%2BQGd5Dr6vs%2BO%2FtDdTygStoQnyj6b1gxmdQPjW2AM4bpJSiMVXN5qZ5swj7Rz%2B%2FMd%2F2Uxj9J4KFfXeai6OcJs%2BlvfedujVCrG7a5Z%2FJLEW6RTAKI8sn8zcu6IMLUwJ9w6eoiEo6dfB3YDlyRLx7QkhzFDgvZw1OoWy1aSgaOLEkfgxKues0eMCUrAtR6685SPjLvLjYezMb5ZZYHGHHuwOg44mwgrjpmP47KaURu0tIdNT2pZLwW%2Bl3lrpnhnU0FjxMctm8t8JivdFYtfLg9zggWaHux0jbieNwda1FvMwYIlf5KUA85yjA%2B%2FoqA7g7p5TIBLsSbHxb3yDQarjeoOh87fdCoK8fMWsUz%2BG25cg5cdCwNKbVJoLI6Z74cwZW3APymdQpDQAbJ6Oa7Q%2FWBd2i4Mg%2FKrfcCA3wxtwGtoEzPznxoHkJfSgxx5SPL9hu5htDEWP17nT7flmKi7nm2CaHTV78eEs9VNKsPj1%2FSCBsws5DYzQY6pgHafgf65amkabQM84HYOIMBZRCIBcBj%2F%2FKSz1eFGBpf2dPuFoJVml4wriWag%2BFlXiFHXbfoStBCha3I4afYSaSb49VZfYKFTqkhRCvYhH6YB5q5apFCQfqAKl7myUb1oWM74k9Jr8fBbm%2B%2B8kUdiS6COSAxnuGtAIKqUcaa3kVbdq5b96bZf8Trs0xd6Ga7pocsR%2B5NepYCQ3tlsuw%2FUHI0VaV5q67O&X-Amz-Signature=029c9543deb3af2d32d1f7fd68ec39403f89856c2614c4ac3406eee48e0ed047&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXAMBGX6%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGRB7lBJQqv9fS%2Fsx%2F5VExaO3DuKePS4bUvj7KCQc4YTAiEA6l1yq3Ur58q8Nhw4BG0V1In0i0nDwXi658qs1wqzyrwqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMnkWxfG1ZGfXkaC%2BCrcAzg9Aod4bVvUG6Tobxs5mzetulxY%2FIGx379O3GXJFQb%2BKsuB9jUdvUsN%2BpTPhkcbJGGSUrfUSW%2B4MHToJccACe4lQvJcM3AfBICk6ApmBSP95CeB2itRk8yVZ3ZLYSozJpZX1XtAbYPA7ychYHPMIMjKcsGRD4TusfUdWGAqTPnVCqZ7nZK8baO63PvdwKmJtlO1CB0wFgDqbhonJfGUULdYZtJ%2BQTP%2Bdfp8j1nNndn8id2d8nNeI81M0ck49Dx%2BZB8Dx4nECjUZ7NAlQgjGePKTpvZbuseGV5goc9JJk7kiKOe%2FR6G3UXAW%2BSgVL1zermKYtnpDVFwHvNQ3Q51GYnI7bRuNxNfVS6BR15%2FLOzJzDsq3cdcfdZ03OdUwyby8yC4z47lQVN66RjCr5SuJSOM3YL7sDcjW8OJPoJRO86xsY2cqoN7bd5NWq7%2BVK5Gz4eDqDnqwZHX6cGd6JNHCLTLf9Mwvsa5DvhblmtYP0PI8fleGBQg69G7bNj4hWvTEQ1vTg5Ay82seTywM17ykHUv4ouKZSntO71aQsj5VM9Kzfs%2FmhO54BQFKP5aABh9Q7Zm4RZXaORIS1LRMbGyMNZAA%2Flwe8GK17gKwOi51fz4iJ7GX8pI3nXEbHKSbMNuP2M0GOqUB6bcJyveFylwMXJ7FS%2FkQZiq9um98ssPco%2FoKFdMtqctWOd86ZPv37csSjCg7kF6oRfOCHpAYiwcIiG7gYGG%2FaorlbIuMsAF9vc%2FdEYAkvLkWVriI6XTs5UyDBd3hs58PaX33vYWu4bF%2FvcjOgRbe%2BgJSP%2BpL1qXqSSCztLdTqH9QWKwhxPmLMRTEt%2BA41mFPVluWgYbdE%2FexE6H%2BAFLUzega%2FuLD&X-Amz-Signature=47fa813440f09b4cb591c15c1ba90701e344bc44446cce18beba416f57bbc33a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=f0149660310b044fb14e81f25c5b1284f0342842f184b6ecfd2612697c6785f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW353PHH%2F20260315%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260315T033236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNw3%2FFmikMeGdR54zaM%2FVw3q6pfYv2WImfUl%2FPUPihZAiEA%2FC4%2B1RgOYZrDEiexYaXOpNbIg3LcjQalcMYYVHHvAJMqiAQIsv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIbYZwOdYX13tQLdUyrcA1EQXshSevFP%2Bvg3IRIGfkireGDtw4FhyXPtOMgPc1tWOyUYVRWqJA3TMTw4%2B7PvR5w%2BDVFzHUqj%2BHxK6N0TCXaJ6tJTMV6YTIkZcFOxl8%2FBDf3HJtS5hHQMMytRHR2pHoO0eJ2xnT4vYXgYeq09OZjFTmvnFxrbEzFTXWPHKlT7hjt5UqUcCAP%2Fzceg6MJv4Cu%2F%2F9OG3lzRXU9jwnFuX0GQCDm56DRaVXz8cpwRv2Hq49fdev8krWmEe%2F5UOzRxJ7kCu7AQPtNxgSFqFCioGkrQhfnvfcjENVjRn1z8WHycK47rKBSAEkFo1hY0Hfj6j6VI8ldaQhCI%2BTL4qMWnRZfBSG6QXgMXvigFD9rCCDlH30MEsPfHsnIYG1NZnimk1YIrfV7fNTHctfE2N99LSo1vyZBWKctrdqYtcdI1nRlK1%2Bif3H2lrR9EivMFuVFpKOLRJSKZsXWkl%2FiTVtQdvCB%2BB9QG8IO4mpQHQQ6Ej%2BVw3Win4n24eYNPn%2FCemTDBcOB0mTC8Dh8N2gphvkzM6R1fG9YKA8%2BDx6ue7vhxw5v1HAjGtZf3fQpXau%2F1IqA3vcOQIzLyRTztbwAKxGCkbNJgjFRSSjbwFLh0Kc9jasM%2BzwNR0qycplVN9p5mMNWQ2M0GOqUB3RmQCl0RlIY6%2FxhmWzUT6Wk31k8Cf%2BjPkURlAVegPmHaOfA0zGnvq1O6iEPl7mralQADYvlmvcAOK5mFHQ7Q5LBJBZVre7xrVlmXjswemHUSVzXtMAG7zUpyxkIssRtC5OBAQ8flnjYdhcOb7lzhtd2mjCkEaULpyjiUlyHjBpHFlsw1Zc9vkQMh6fqrxmHDQ5XeD8tlR%2BWU3ZBa1xNcDDHFba3q&X-Amz-Signature=ef4f6d7fd4590566bd76a1c0b728dc5c414024e900527760e11ac331ffae460b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

