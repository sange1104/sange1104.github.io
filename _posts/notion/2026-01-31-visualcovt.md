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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=31120390f3cb335b2c27c8f2c9ebd12f09eb576a16dfa87b7252a8b75d3b074b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=50ce7dc31e69929f5b9a4311c81fcf77a18ee27b09eb1473b6c67704b915781d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=7f32338dd14745a3b050d608e03c2b313961143b02d11b4bd6f6cacf0e33b97c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=6ab3e4a32f0d02e05dc912bd8810c121430c8d9518e6080fe767aecbe0a22c0d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VESD5R43%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQEjC8fwvkzYR7k4l%2FUjI%2F%2F2xSRImt%2Fmx5Hmly6hg9bAIgKTDissY7Le8YRxjoi0lqnDu7TO5BLa88yvBNhnClZhEqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNqsZA3z6h8Bv%2BGo3ircAzs20d7A6EWkcqD6mxyDwbfVCjyB59YuIibWjbo%2FD1FqGLvm1owe3skECiksvZaKdsKIO5uXI5MtkcN%2Bi08voRzq7JGJ20HG4Gv9Q144PaZH%2FacqFSpOsP%2B4PXIoIXhRsW%2BTEsHaSsZIo8vFe2G%2BDFrZOzk9v07YDk%2FX%2BVmO9860wenw6EFkQS2pjv4edSzZUid03xlJA9%2BmZYpnRNygNoKWfg4%2FvebN%2BOEnVega13m%2By8VURD%2Bc72u7VzLUX5XqoUGy79Y%2BkwDAvLgpcsmbA%2B19WeEJqPXKEKGmF1ZRkgfLqXP0qP%2FOouLoUD5r0Jc2uG9rd1UVc0pdHiDqQm7g%2B1z3VtfeIG2NazUr8iMWG16U6TCUMMM89w0RZsx4JkJronQ05B3fTITnME%2F8mKsahHXw%2F6f8ODDhgIJuSq4f2HATs9n4WQGZ5iCgXudPoHRuyILyPzUXc72aQXou4NQ1BCglyZenY6VL2bzKP7eKos6nu3Fon3l%2FH4CKk6yKcbgVxBj2IaNPhf2FVXh4obw0vyUfEm%2FMgvUoKnHBxoBQlknEuM1oWp0lA0ZZfz%2FAgrTEQhmBEe9UrBZWquwpKcI7BXxqT%2BqIOJedLdE9SH7ONXSCnLKQWgWe5PbrpZWxMNTi%2B84GOqUBldWe93kTlodokz4K8uJxSLC7jQLz%2B5YGyi%2FDJoRsa8Of0e3kw2Yu8xH7FBul6hvHXXI9TPO8PCR6h1QRSSDJdTcf%2FLWiyaTpqgh1w3ei79w2YUdLxPraUgJ5gRgF0Sui5fYZTR1LwuyRD%2Fca%2BT%2BhS9n6ohHj0syO5A2IjUVDiELYQZnB6T9%2BLqnSHlLdRLY4l1C4E5aqyIA7aN0tKWAbXdMRQEu7&X-Amz-Signature=01f84bbbaf6ca9e9546c1e977ce98f316af56571d4f3a7313a5c94ec5f1303a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OWYIYQT%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034054Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDAeJC%2B%2Blau9Dwg5u%2B4xJ%2BmgpeDWETlj45Fo0FdmxbzFAIgahjZtG67Cb9q4dT77ijks1R5%2B1pNNDlxJpkLCCCR7DoqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJDFTc%2BYiJwTGlQlFCrcA5DcbRgMPIxTbhnkrPbVT%2FeqlO8iu65y2hy%2BIqmrV2MtTYayaorp2ewMsXwborc%2FON8UQIIY%2FaPCN29Uff6aTjVD8SGoXmgfU1h1GXw4KfKXdPy5QcEimWltuAa96xra9kAV0e19K9M2utkxLXnZMpv2yjYGaUnkR%2BLzq0BsGuGxo%2F%2FSojnApYQz5f7N9nVfc901R2fLecH5y9ANSk0yKiXnEBxk9htKo72uCM%2F1ncDryy7zSHtiYaltof0KnOuxKyGFRgz1qV8PHo1X9ZHiX2nQhNTpZ7URntWve50Du%2FyZg1erdGMDE6IxHXbUFJJtL4hKiZDmMPsdn5D6lr7lPTyZU%2Bep%2ByuI6Vbz1LflOPu14qoKzoZcGi6Us%2FVSAuUcqFnvJ%2Ft1CnDXq6hmrkrEq5mNAI41FYQElXDEvR4t88j6Ok4d%2F3abbU4rySY2NbAaRCNDU5k9QpxcaZmAELcfNBaiM2QC%2F86QlBq7QzUyNas5hx%2FRQ%2B9Bor%2FGzeadV%2BgJ2y0HdYs2vlSnPcXuOCfAF7RQLhhywhJawOfVa%2FH%2F%2BrAFBJ3V%2F9x70FlzUEvezNnIBzaICTLRFf3wIRbshC89oowsCCCynsY6mGb6rtFSPd0PWPHz38lZBjwFgSuCMPPh%2B84GOqUBV%2BtWTc24nn%2FWHQAZTte5BYQCEDDqtMy5tKR3nAaol%2B3kJ2z%2BRxPTvwVdhVjXKMzzd98qnEV%2FQa9Kcke8%2FZHN%2FfOW9lAwuF0mOU1LmUll1HvqmCrkby314k4tqNfQgZgRaXqSRr5pmsJi4POYWgAft2r9jKMc4t1PrR4OQRxhNB%2BCGOyhwZO9TDOU1jn5HcDLaryP2dKFQGu0mBI880E1Gm1S%2FOBs&X-Amz-Signature=ebe8566beafc9dd0fe4c9f0364564f2a2861d46969633cecd454f197da37046e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QNYVHIRT%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF1uRSvNTNmg%2B0LXOdOMXVaKRJutunuv4KH6%2BAH1oDl0AiAxomOE1qU%2BZ1z%2F5FpFeO5hCrCeIVnbf7qv%2FOdFQAMALiqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMlfalshRCIRl2S6hlKtwDvg%2FPKuuNl%2BiTMWXYPHx0GR6FubGVhROtJ3u5onV7926aivMEN34lhxzjey6y9lQjo%2FSD1u71WLmG6oXMlUtYVmAIlSfxOLtWZSV6GSWWeZxt13e1ebTXeQbXM%2FiYxWPyxbEk4U3UWkKxemNEXcVDXnyoFUI7iRCp0lch%2BqPFNWSLFuHA%2BoZ%2BZ%2FujniaONZx%2FwZxcRaNpQV2R1YXErsSDGjoISQdyNSyaEwUYALX0ZWrhtkF2zBIspV2FRWXiqW0PCP7jflj7%2BqAu2VuirLBBqyEiX7RxaM5XCcHVfpf7Q2lGBpfhHJcqWSVMpXHmcxlrtN2nKQ41P8iOekLkZY%2B%2FvhUvHheIvcrWYJtgVXY2oEdUSnHTck1MT0G6bfm%2FbIKjwSUKCpKiyeCsu08o7oCW2ZtPueW4HFTqeQTLGaAArAUkSR6SKnmy0mrpnSxwg32LadEjNeZd5KtUHP%2FkLVy82lVak2iTV5tNqy1Bm6PB6F6eRrlwsgNbqyMvFGkyudMHz1LFMlmMiQ6cc7EEhkLyXo9JGwH78CN2Om%2Biqt19PVj0PEA4rn8qdY1wEuMSMlaH3xFHBsvel1nzh7kyaBiOBvalWLotxz5eD9%2B7eGEy%2F3U5R7aQScWeEVN79j0w8uH7zgY6pgFdmtB%2Bxm3JrwLwL9KegCWkp%2FQ27cKKIkSKRqDBdgCazmzdyeY6XN2JNXrWKNdPO6kqZa8YOmgcFd9yYOG6ezJBv8XfXeTCsEGdEMUpE3UUfBH%2FM792pQEAxE%2Bcvs%2F9TXVQVLikVVgxNewuOuF4HewHdh8tFVX5ZgNW%2FvaWMYK15jJGNzJ76w4s8WRWsooMfAUELyQ6MF2AFnpQY8w%2B2fd9It9Eg%2FIf&X-Amz-Signature=cbb4e2cad5c8aa223dd5d1280f7ea8ac34b59f1e48e6d9575c224780ce86d988&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TAOXPOS5%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICygcPZRgbtWI0Kq9pn2TWE%2BXyVJJC3rS9kEqBRknsIvAiBzxBOzCQvvk5uEZ2Y83Mso7N5zg5LVPctZ6JNICDg3OiqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMC%2FE%2B6vIx7UaXPyY7KtwDg2lQGtl7k8Ly5xzvGmSGpbQUQYfaaeXvG4HwcKPrFjoaJdv7XOugeUX%2B7THkWsMwRh4TZE1xKRnaz7NMqwYBDTTWWqBDLTDUpAYcoLspGj0j6qb8aH93rOf39prj4cfv7lECT0EuYt5G6CbV6u%2F7UFXpmJ8rAJ%2FdHsIZutGCcYVyUvI%2BMq1HBClFMFetbsPVeXOgaM0Ya6xWo6Y4i7BzezE%2B71c3hJOJZ8ea8O60hT0hpUz7ISAO%2BTXF8b2uQvE8FwjMzXklnUdOztaMOVzbRLRTfp6hqZ43eeqTTdWArVyGiTklCW%2BArZlZcgKBMlWefqy0s6OYHIOsNpC0Xk2dWyxxAI32pZgXdBsysjTrfMJR9xWTvFTF3wewus9279nnde5roQ5dxUozqVS1ErIsfKzYBKHHM8%2BsJNjjZV11MrK5ya578SaoKz0Rrpk%2FOwSIsHmY8u25XxTzngska7NEzjy8NIm4umiIqvJ3FuHTG9ODRI0kYb6fWxS0mLEpZ%2Bq9zNt0dukg0oa12TfaIP2SzlncHhTcGGKIb2dCH4LrAlbeubp3N3QcTUt8uFKw8H0jdM5j4l%2BwFS7E40Nhaapq%2BDRvbGm1JDoDuLdvNmvCWaKAKdMMN3AWcAN66%2F0wiuL7zgY6pgHk3S6zIp5NoCO9pauSTz7dDW7Iuayj3%2Bk8luS7XVB38NEx%2BecAShy%2Fwx7WonF91bQb7cKwE4NxS8r7WMMetqXqNv8ITQ%2BiQG%2FHtdFmPtsE8qQmEYWlMSZx2VmQroxt4fYHI2swDlRt4m%2FlnfKsDvpKPRBiEBFIhMfVa3ASreUXsYAVZce01vwwFmVCbVCIDWVpVhxR%2FA5bXvQj8w7T%2B0Otk3TPgGc3&X-Amz-Signature=1b1bf242c2284829c94fcbcd5689c6777e5adbad4d257d1bd29cc85cd3e0acb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=6d5b48aa6c388495a7400a728972d628c26c5427d0dafa352d82b7eba73108fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034032Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=64b5cab8eba90411db7750d61f6d815dd554c503fa3dd372b8996e17ac6ce405&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TY4AZ7SC%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034102Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF3SbXvmHnH8jnmZtuW618xYkbDD%2BeUY6qjxC6rhjkdAAiEAiVT%2FZqPNLG%2FgQ848uWp2Xt9Kb6mj0zVJEXvnioden%2BcqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLsC3aMNnU0gqMsI8SrcAw0OWU0WNvFNoICUxaHfrrgbslo%2Fe8nD8lytXof6RvW4nk7TmIPDg5haZz4rjGbjArXu3M6E42cuWsXoocbBYDVMOPZP8xRr1zXp3ltd3FfZLoPRNeZI%2FkND2POYqsN%2FbQTl7p2xXMwkkeFqxGZyipVNgPRwm0iKBXqjRMT7S63Pbu%2FZTA28zlCxXSMTmzLAafL8jUAEJv319TxhWFKL6iurcx9y9Mq%2FP4QRd49QWMws%2FN94d6JeEpyxW2ovBMAjL%2BZ5sCaSDhsw6Ic3PSM8%2F4sjtNw279QPRl39eOHa0toVJA0IVhWORNgFrCmjLdCNizWjawzdmn%2FW90n4a%2F5chpqH0sg0OIRG8dLYHC6JCtvxjMEO5pl2xOt3fANYv4jtzZC%2Ff%2BQFps8XG0qKsRqYg6HqXCGk0ztsmA%2Ffm7YBtmtEhViOQqjtFL%2FpIoNs1CfSGnOzteIFpXQt9mQOJeB0kj34xnG9elasNy8OiJoJL5gXRiGxOoSBhFprDUEcv732gOh0J4IUgmRl9c24sNaPRnHIqQXr2uF9TNjC8s1HjM8zJG0ndjxE0KPrUDMt%2FJjWrZ23HWUXxxQN1Ypc5srOU%2FP%2F9W%2FeyOO99xQTHgMUz%2FJMiAO8VG69gE60enpYMM3j%2B84GOqUBHh5JCuod2ZrWzIk7Aeop4iSexkIdZz8XGNwgKvM6O4roucqi%2Bonv2qqE5Aj5Vz2V4AyxOcXe6xyu7chI0UTfwha2JFLwEzAmwSa4mRR%2BcF6UWxtYLxiXLCn18K3EVSS0d%2F3aMD08QTzN9rbtvBt0UmxxsRk684qZSOJQ816xKkS3CAqrOnYBEiEEkWiBJzWSmTLuTYJhutvJjEc1dvUCi8gg2VtN&X-Amz-Signature=e38faf152f713e0d13b30346e2180f6b76f47c18cd36c194928f8e8dce96d7ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034033Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=ccf88da38a7ce2f8678df57d5b34552b69e292fd5dbfb79b6ea59012d6676d63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RZRUMQY%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034102Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFrUlDKKPLPmAUiCgjv1qUYdZeq11TTm%2BsPnCA5XpJ6zAiEA91uN1uOcfiaxFO1G2vXbjA%2Fla436g3J7T3Rie7H8npEqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHLWfwILRJCbEkDXJircA5VX9%2F46TzYqRLT9JUlM21nE3SCWENPk%2FA1A%2FTpItAcov75lJ70GdpsE%2BGJNZLsCXwTR7uBlZuQK4%2FbLetJh63X98Wm1lMtGGbKofXqmtm6eyu0c85lhpdfX1Fuk3Pgp7Bg9YlQm6t7fUP3wh25iaI0xaxkvkQF4YwL7B5F0BkCppUXlR7TIlLrbLQfzst2MpT5FXtWagqQkLFq4zBOk60sHpbBhy78jv8cQaw%2B3hGEmu97g%2FRaH1oCsEU%2BEj0q2x1LD%2BuAWGqW23W3X76oA9hZRVedW6Gk9tnJ0TkCTa94F2HYYXPiM3OAhTaQV4wTZWmfu%2FMUoBrYYow3MvPR9B909jSRIbufzZ18iawSis3aEngPJeP4AEVN8IuES77SE0PfFts1StZRMdHtcqA3bOxrZrMStP1P84vzn3Eygi8TruRBKwioogKZ8Dms5GOmX0t4sAgeoRB2CSoGb1yoBhLkCYj9ofThodP%2F5TkVO%2BoUlyJn9LRMv0mmGKEjPNgIfDuGw8GTMgLL5VpAbjWBWdsiqspXF62Iv8TjQD6ZfTYPf9hMZ%2BTOlcZ1QBrKpL00XXFajD3r1yQ0gJLb9QENfgbAfHecTl7VaXYiFaI2yywE4h8cFV0XILL%2Fs1lDMMKSH%2FM4GOqUBM8yqsQlnJ%2BN36Ig0csvAap1TQQ53PBVe%2FCZLLbPHA56bvBMvgAGu1o4WIb1qXpYnh9pXF%2FNQsWvE25sAFUQn3ur5OVU1e8ly1bOYUjSoQ5n71NjkTTyfOOR9y2KBoM9y8JVfFCU%2FgBIdl%2B%2BleP4j7MXuBsn7cj1r2BVg%2B%2BOzRazDka7l1mWPehh2ekBibIUcMgft%2FW5Oa2G%2Bb%2BV52td24Tua6d2P&X-Amz-Signature=5e20e91e6f0e94feb5fcb2e4c35ecadf1a307bcf594f309b0a7a86c360f0d10b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGQF6MMV%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDGdQ4%2FH0%2Bbx7MkA1hll85seKgUXxeuCYH5X921JCo1FAiEAnBNCAyOSrDoPy0AYHABlRBQMwW8LS8ilZNtn0VEI4D0qiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIUe47vOtcYdVFAzByrcA6JeEBtMhKAFcqSCgX6CE%2FQLVjmb%2FbUo%2F7vA5fT62iO%2FTHnLJ3r03zxWNVAEFY1JasBKEQ8dXWMe8IT4MnwahCSqg2aVHs9TiuqMlHcYXEFJvpQ5aVr1VpXIw%2Fobu028rLtx9z8AlkAn%2F7f1xKUSIeN7oeQfuSVsTCMbRcjdMraKWIBUQ5p0DtlUbro%2BFQl2ZWhz2g0pXi3c2Mq2LSDlQJFLKCyMG1iZwUP7STe5qRJp90maOWXubDZhQ6r9Rw55dTB5KVxALJbq4StIl%2BHidNHdcv%2F1cvGJfJ6Q1e6FJVbDWbToip%2B52b6i6skL%2BbQ8rwxez5zT3X%2F2SkBHwX2sAhzpEG71K4uGvA%2BoA1zEQKB2%2BCau%2F4bW4tMPdW8lba8IvXphJI5k9e0PSWRpS8vOuWAcCsTi8B51PyfnqzvA9VLSPr%2FFUTlqMfhwy0O2MH5PG3jIDKwYm3twkSuxtbWzlgsjustH2esQnG8jLcc0LLDeeLuxZxYtOGy9EZlZqSUKHRa8y9qJUJCMjQz4GEj8%2BLb8PODJ7tu6USgDkU1%2FaC40SMjMHt2N0xTfdEu3gjroA1YqxuhDnuXf%2BsZgaZPF6PpJKKdecpVjmnjbFIFCydaAEUFvvn9LRgBRg593MPfj%2B84GOqUBIw7S1QJ1fR%2BoJm1p7OOAxqfRaw2SL42NloCXNn3o5x4EG6pluYRY5s66dIBtVwAEjsb8WPqFC93HyQaP1etioN%2BMZmh4yQX7XueJbs1YznPkFaxtjPJQg9p07NJxO3HvHBwsjsZpAqp9Vaanq9icWC%2BkTolccJf%2Bc0drJJKA90q7h7Ia8DSMgjL%2F3F4kY1vKr8UOxnT0sbcEhLroY952m2I2Bgoa&X-Amz-Signature=93b6962902b6d7686933e7bcb9cce7b2ad6daed12f6807c106344dc1ef93a99b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZNHWJJFE%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDuiniOxVBYifCqVVDcc9ul5zzqi4ba%2FrSjDrMIXGZPvgIhAMRYYtB%2B26pnNGt2JajTJ8HV3IZWtu4jtVTn5qR9wgJ8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyfIg3ZJ7FvrkdIP6Yq3AO4ft7Ffl8lsregpoAUN7IdvA8GxHJIQR2ipDr5Dx2s7wXWZkMeN0Z1FONwsCa3slY7mHfe4XhOt7KR%2FxfURrZDbAdIUTP8fh43Ph52vZ%2BhKURegIt380y%2BIOrISkI7aZOqzY7EpEBFhoOhMBS90lnDsPBBk8qjARRhg8QdaQZ95o9ji6s11%2BRGa%2B8e0X2h%2BE0uOJFUZ5JhlWOzyE4FwGzpmgzFGwIPpHVqxq%2Fe41plMfvGacXRwDXogaetD5ooCr%2BPWexPCFwG4DFMHQAZw1LH3XwfQlIPm1vIa0qHyIb30TS4u6sdHHMmNhZREpa4l6Ch8qVo1rSym4aloEydYaS%2FQ30tKWywADq3OJ4Ht%2BUxVeIey36StHw79I2plvrp7qvGTXYUr9AR1kcQa%2BiFLSAeC2Q%2BPYEGUdsUMygWESYhcsUSimDub06Ql%2BBN9bC4bGvy5cnd41Sfv%2BVG7wNrz8FUuxbupYx9C8L8D%2F2ygoeYDkPuoL5ygbc094kn%2BNc0S2xu3qhTFPdZ00TgxS1F7MnhEBGBele7CfPGOh%2FeUzujHyqB6TNMzYrrIYbAKVPZKheqE2qon0waofSsbF%2FRcYoSPapye%2FtUVVpEN8ZjWC6jKq9tLU9tJzTRdg0aajD%2F4vvOBjqkAY6p8ck3o5fFdb2NKOvVPTYsPXCbPg14zYENMjiR7nuFf4LKFunv5RP3tejSF5quWyWCV1t%2Fwlj80UVvffErSPEIsn5DFhHHzpFYi013%2BhQvnt2aYcQ1fDr2V530PZk8hvEtZAbeaC1ahQdC001aK%2FAOso4mRy8aBz4fJhTB3l4GV%2BJBKUSxqsH%2Fo0TKVqGRmsHGuVFDPKxLs%2BGFLHDL2Gc6ynSJ&X-Amz-Signature=520e9f59f9a00e7ca7304ad93b6c71d7d744ccd508db760795bdfea1818d3ab8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VK5TJ5AX%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmp1Q5zX3f0jbvk5XdcP9P1x8hnaNF23CI4%2FH8Uj3UmQIhAKR%2BAtNh55wI2X8EbRud5eN09hzK2qwkUBBcybkkFeqnKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyRAu70wPVAAgYKhlkq3AOZcEmPUtqKU%2FfoV125kKadUIcXspjY6MjQOk0Hi5VelS9qdPLkjtxyjJjcs1i1mOauDO9nb4ewYhtSXm2yDzcFV4AQEyD1FZLK5GnJJiQDJhk5vPgpcDvtgXDgH2xz30kCCOgWq8T5swW9MUDxvVyEV0uA0nabqDrlbF1fOK38QY%2Bo1NTXUchrWxV%2FIODFZOWTPfDU1CJBiwMVR%2BTATCan%2BaBSL%2F3SnBoJF5WFS0i%2Fd0Si67aQROXDIiZI%2FNmSJr%2BrLj4HV5f01ADj7%2BlguIZOL0y6gfD4QpaZyrGnpy9a%2BVCX1bxV3cOSpuQdq5BBy7M6VP3lmr7S%2FFzyBDh02SdYmkF%2F1rMnurjhOxSAEUhIjXXJRuhsIRuvRH%2FqVN38DpQjUvyX5h63S2E5ifkZBPYQJjJwHhy9lsKFUOlgTDC%2FdfN8ErPKn0XlwtTzRols4Yed90pyR8%2B6pwXLrR2ILcFlKc7H7mgr7HReYamQli2cgFasotSLaPgRFSlKwvqiucjVUkUkJueuBLlO5qwOtR5VHnHnOaTwePchxW2X67CfEDzRVbCnAseMJcDGQanKrwa2Wk5Q9Ve3feuOoqaNEtGwjsTwnTDBTB9MqdK%2BcGf%2FE1H76Ztng%2Bo7CyCRpDC24%2FvOBjqkAVFWzO0SfPuH9zwIO13vlti7cQSUU%2B%2Bv2J4%2FPBwGM%2Fkw4qLx227Ahv8TUmZO1FNEzMLOi3ij9YR1t0WoNADo5cOEDWQDE7qHkWwoY8pSlOF31iHM%2BwXMDgqY%2FLcoAqZL9eLxZEAwo%2B9hcLDME0nTDLgavHTN7HGZLxgiCKlRZKcSrBFPP0rEBhc6xJ97R1iNYNOJN8fH0jr8%2FJChGhVnzsAum8c8&X-Amz-Signature=04be74d129d4dbe0a45e0abf86ba147fcdbd16f4621ed7de7bc65c139f32585e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034033Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=f5326fbb621cfa1c2315ea1a2df99ac72ec5e188c41176f5a5f3eff04664e0a1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVUTEB7V%2F20260415%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260415T034033Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDT0o3WtgQpdcqi%2FZihmZ1Fi%2BU4JIIHkZz%2FZFuoosYq3QIhAJinThwJYQ1dXZxVT3Ahjbos0XDDuDVFLu3FJgNlhEP8KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igza57VlygjedhX54zoq3AO6n8vdf5AspTM7zLTER4hppEqj%2B79LrQ2Hv%2BjdXgpYvyvg3Am2OEUHE%2BaBAAcpCdJp3wUOaV1E6rjbDLyMh9w5qaN%2FY32SFWoQLYy%2BOxohKMIjTexYZBH5awZk3Giwe7XUlVUiRdXARdmAHokTmECpNB9KWDZMI2auGzRLiFnLE1cDXF%2BAC935E7QHgA2yWlk3SZfizB9IqLHqQAPTsQU6LXVIrzfXcZP0g6TBcPAoR0vbL8cTAWb%2B255m1%2BHceTRe1Ua4ibceSUWowQmzEpfXy3q5m56aEWCwtIDESWJDXgkJgyV3uNc0eZzjv%2Fpluym50JPrY27eroGhyOcceH5zE7%2FMuMKnub7MixgMaE62CJcfZsLZWlmaIreWWyRtpc0gUDMiXa4YLURaJdPaHNfDy7hkImhG7H%2FaEk0QN2QoHCyyaoi7mpSYgQ8t%2FdCB2odnQECy5V6LgqPeiDop98l9rHtx4odhN8Pv7kzEn5IWlWX%2F8eqqz5CSoGtloVHT60xe9EIzD4cNH9bwN5KGlFDS0FaWUQ8rCrj0UxVxgDz0yE8q9EIDwM6tIJCH%2BcX8BEgaWlCn0mWRIO4FBu%2BlPR2hdaR%2Bxj3VTSan8uexYtCR2fbMJ8EyV%2FOZgRr%2F2TCA4%2FvOBjqkAYVioaUsTTQjkup7wQolI7rVwFvilaiuDannoAAXBeodzeSAH5Z1NH2rmTXeyw7m54OVTRvKc4%2FsRT6vgMcHZfLOZ%2BjKvhDJ%2FGcRDcld94oOuoUucBVjGJBprETn6A9cG6jMECHAxBC7tPwYUn%2Bb27UK2mNEqDK8Hl9A30vmn6261Gc%2FlHs3fWO1iYx3VdPssrF1ymUcp94Sp7cMXsSYY9Nrf3iP&X-Amz-Signature=561c2844646546fc53aaea6d9a6f47d5b92441ca2ba8bb36a6c8b21672989a2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

