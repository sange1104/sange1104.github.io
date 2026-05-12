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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=5bb35db7b7fe1a7fed62fb9c6a5170fad228ff4973bc97f91de2ef75932a5b8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=bbf2f79c1774969c680e014a154045da4204152808523fefc19d99a538642fa9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=aeb111716951fc8e671f57f759ab659e95dae4db01cde7c011c894f15039605e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=f039f4b97b8f116c0199c359aeaae6c56b95c6e9cef6c147cb9eeaf62d4f2346&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y5JUUGDX%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFwaCXVzLXdlc3QtMiJHMEUCIDdjb3quxzTVEadSULN9gvakWzllSvZPMDLfUraSflKCAiEArVU6qfyOe1yUvjjohC%2FIhsDINxbiPSzp9vdGdbYdXiwq%2FwMIJRAAGgw2Mzc0MjMxODM4MDUiDJ0%2F1T5q2RUnI9GdxircA27rvN6d9tBx9dS0rrUGIR6efehkhgn7W4jXaEbklVE2cCsLQszefuWh5oDhZTa29vfQ72%2Fekajk8486pc3E1oCV0IRVomE6cWcTUr30YHXIUtLiAsFpWd0hWzhTUCbhFtU3yVJOwhjZ2tGbGVqIPqiIGNdQKtz0F%2FC1urQ%2BZypsawXMmjJrgCtNziAFyEgcpIdcoG07N9qIUqLl2cKWIPc88m60cJ6gsqqPGd2vH3WE4StRQprub6gvu1E%2FDmVJTV6hfUua0OvNH6PVgJWctIuV%2BQLxFR%2FYCGsxKdu1dkpuqlQMxVngqT3b6l0Yey08VOLi8sXyngEzUcgvXvScfxqTk5doVS2aUM14%2BWFOP%2By%2FfdNbVgtWXRKBhjn%2BopHOlmgIgJRGVOxgyL1LxYIeXWb67s2MzpHitKP3vbw%2FwdutuOHMnqtpFvDUHzvAAF71jBYfs5w60QuLV395lm6GhosKFfbJqbtmnzijC%2BFlnHU%2F7kDVWXHl0bksANwfJC5yudzR7GVV7tORSHPeqZDUtZJsdQqXDbmO0SXqCInoKR2Zs6n1ChMZxt7KixKRAAcZ%2BpncTS%2FriQKS357PyaDOv36KRQHX7b%2BwBH2El4zJWu3WzfaAuOV8dtiSnxj0MO%2FBitAGOqUB%2BOQrvL9U%2F4usnzHV7KbQrGhBRp6iaNx%2FlHrTG%2BZB2dKW2Cy1qe%2B6hoADKT3L4g%2BnuzvKK%2B1H8xy88Cj0LgeGpxlYvitykTC9V5fac0i1e90U4UC%2Fj8zkaImKz9sEmWsbjr%2F%2BsRrkpObkc28NOelwbWnV%2FY5DIYomTTW2%2FZ5soQiyPyHzhLpPkTUaw3DEjB8XNOfVx6leuyOL1Lr25xwu7QDIaoY9&X-Amz-Signature=d5459d799a2a7e02a5bfdefd265192311878d99b121f17430182b19eb244b303&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WLH64GBF%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040650Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQDlf2KbHPzuyNLVGoYuGUmuEsxkkjkNVlATA16Bk4zaVgIhAMoLmblm6Z9owMj0pR70nlP8%2BXyaVZWMHguOUSNH90J3Kv8DCCQQABoMNjM3NDIzMTgzODA1Igxj3qVlRq4%2Be%2BneN%2Fgq3AMEmA7HyJWfYQIq67JsMucITxveQ80jVhn%2BA%2FaQTEP7Y80hNxw8K3s4frKEUgtzwYANlq2NxoltHHaUw8HzzH7PSshkpqFtc8LVczAUIHZFSS8Hzpxb1xEcsxNcTi25g8Fr125ywMQGqzm1LoByBdt0CU4owqiXgyvY8lmgsld5bkGli6R%2BcV6YGX0%2FzshC%2F0QSqO2DlQzgWDBO9djjaDc%2B%2Fz3gtAWMdAn5ct9CQJK6f6sRFiP2c%2FRz%2FByhy%2BcYqhNaair3aQjnuMISBTRdtQbKHtGh8O%2BtjYYpB6pVmN3oIINNNuFUa3BV4FeinehcGjgaV7soRwsp9eZCuzR14TJ9nvyDYA1HvLMS0Xj2Y1lWOq7xxezB1kmuEi5wApX%2FvsG07NVuCSCq5FOrDbgjDnP4w%2FqG5WGOekK79d8ZA%2BjQxu%2BvEfDJY98dbXgazbk4G6GsutvdvmhZYvwzTDrwidunESukyyc1T9EsJouMDyd2wtRaLRjSxe9Z3yZ9OY2%2B4ijuJzZUOFmk%2Fpnwn6IIKBO%2BsvCnTriaC6F1KHRgy468USfa%2FHP%2FegzwSWCDOZYHA%2FFKvuwYVxIwebCIKQl7DECWtoPTnxPhkM6o%2FEoGGaC2jU%2FGGx3%2B%2BGk02sl7kTCTpYrQBjqkAWaoekWdXlhaI1xpZbjuahbzFJVTirNL5QpqPS2TPFbFY%2Bg9UZ28oBvMS%2B3m6T8iRqWE51HeHke32D9QqJCfP7%2BNkikBJ0vse76LRbPDTz8pHbJuF6Vi2cfK3LoapjsskQjQ86RuN9iWfAupauz2QsdWsiODASz4EgVjX62zu0Pe0y7xi%2BsxoJJmpbOKcNDilTi7cFzRtyYegUYxJ23rYj4fDFYy&X-Amz-Signature=36e8d1e87a537aee0943c934c3b697c3f840b2f85c238ef7543b2ab22cb31f34&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWGK6EEI%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040651Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCID6yjnrBlymWX%2BEKyjccVvRTOMWKw%2B9dRO3C1P2d2mf9AiEArtKOL74RZqiDDmI72TrbnNqRSImfPZ%2FkjlsIWSNsWUQq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDEFmTlKTNU6TNYx3KyrcA9JONeKqqoUFTRLHQkQ6f8%2Bg2Er4ohpjCKQJwS%2FlXcv1JYynFwQf55GNWXGnLB7QtAS2WSHmbJ6o6QqfehxO2e8IB6i%2BcT0%2BfBJyKHEQsxX1Nux1dOZvavMaUzLQdFOTGiT4klr2JiwbcEDIyxdbQWWwGMVqbueBHP%2F8k6J%2FkEriojSBQnLLyy1yonbF9eRL6u5sW6ojV1FRdgvLGIduRrO3KcGAGBVSPqUyR%2FFi%2BUwRUsYKVfK22jfff4PlSi875tbkIswqEpRTu6TXzUH%2Fk0TK9ewhVB0H%2FNoOV8wU4tcgiALwfyzrNrOJ%2FtNbX52vkXytPAuRU2yxsoWeuHEgO%2BilMlQDmT9vHFnbR%2FQHWo06BsrIaF06qIqxabVhf5DsMXhH1PUVni6hqbSvSzX1czaiKB%2BTq2eLScJvkkVljQhfqe8XZCPj2gssrrc%2FWUeUSXBhBmeSSFTFnpTA8t3BlfDV0G7iIHXPtUQHJ4z4Wl7TapiH%2BosEAHIIyOaZjtr4GqOuGI4QmQeeBKXPPN2VX%2FFjG3%2B8RIcTvz5Erq3oqvP%2B04hziIhE7zfQdC1b7mWxyQkvBQELCSRM2rl8bfskTr2XoBNtB7YkSvOsPY%2BiYuGTBy4pzNSbEKA3NqeMMLq2itAGOqUBnpdZ1RW4hWbipAHAJ9JazlY0kOwo6zPh2GzUf3hC0H0rOzbRROS62See%2BTYBYovyL4k6O01EWPprOzUAvcjLzhX%2FRnh4dqTdeH%2B50hDV6fnf9MzRewhkyWgHbAsFMPod814ns%2FsjQELylR2Hb5%2BVQ077R9qKG0nSGinTGAHrfD3udUzsgYSE4iVRoevryh4t2jX9A9iI0lQGBFvke%2BL5KOLDVnVr&X-Amz-Signature=932dd4bb46e9816a1cdcd93a92b9b35823fa7a61d5fd68e0618255e3ad556e1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675TB2FM7%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040651Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIC4WBLcR1Hu71UfVqeQ%2BHrweHaJ6Nt6h7VMWSex4PPVrAiEAzK2CkmW5NMPbzuITohyfY2f4ULS10%2FARRogRtj%2BCITIq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDMTT%2BSbx1202V3djgircA%2FFG9n9Ve2bdZBFHqmLYn91I0FPEf89zsfx2XtvPuGAWyv4L9b4e3KWPWYsiLdyY1%2B9fcCN8wV5QlAAtyXDVu5q%2F9nOejbLE%2FAUCwbQ1VJiOj3MGmthgXJNhFU48jke7iupkxf%2F3PWzXAjbA8IU94kkmSHmgAmR2BAKXQ9rz%2Bl%2B8srrUQaRzSzsuv9jFSYzdSUn49so41O5O30deCLogGDA03IsWDCuihRiLN4PbBvlzpo1HxEYCe2Yy%2BLwlqDIPxZuRGO3l8pTQgDLBq%2B9LZQChF567ID%2B4OUxjixUEs9eQHfWZqWdVv4ArPlQN8sPKf0F41RbZQKykGj753DidWs9r7LNCU0rlH7IFWt4HA1wkwmg9VmNuFtKuH0mR6IXGojFzQqerrMvjqBgsuYuWoQ9tErDmRd0yXNUPZZ2fm3IbgfvD4EHYBvA4D3eQYxC4nnulg67QipIUXS%2B8gryvGNteEHdExd27QS1QmqY7rKr1oqzUUWAuW4Z7LgTjgodS882C0QuYIPqIUqX6zSNU2afxcVhV1BZIXfEV3sQJsM9wy7MqRKrc%2BsJrRqEMmqbVizWRkT677oKVKdwjtI1t57fA1PWx6NNZpVW7sS4IY9wYJDblXZ4jBnLC38urMOOiitAGOqUBc6ekJcXL0vQkTZn%2BGzZD9TMT%2FnmbYQl9wppOOxrQyAz%2FWb6t8t8jvcuOSkCRQCCX4SrCl70nnKeaI%2BQ5FmmA1cW9wYiD6kfesJMRLBzb%2BQdz%2BhkD9HY9sraccxlSoM6BVs1B%2Fn9mmqkE7l2eAfNZZjhyk2NtU5zjPxsYTVkwFHLo3DOfKreD3E%2BVUfOrl3N4zB8Yc%2Fxsv8hT%2Fw98O0yXABStokJZ&X-Amz-Signature=5be4daea7e89557ec99f58580f5d32494c51ed0f222c7f65c63d211de1458219&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=c9a0fc97e89ed52188c3967b665751572552e9f8f200d3fbe9a36f86c0b1ab77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=8e85edcb8ee7dc2be7df76926b5694a5de86a6cb834fd4fec6fac2f81581e6a1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SLBBGCTI%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCICDre8tplUZUNE5UdIsPqCwtVYOVWKFGU3GrK6B%2BswamAiBGja%2BwXCSR6wh%2BLkn2lDZ8gBN2AEUeSnxGUeCoirA%2BDCr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMTlz%2BoqARVzQZW%2ByoKtwDl7OrPpaZQlGq9ly%2FO4C5SArhBUcj0%2FVEeoSFZ%2FAst2is6Q2CqG1T41O0F%2FkTq8xO5QdTHgWP2uqsl2xxL%2B5B9SZBDoyRi0fUCkDFaJbAvq8OvN%2FefJyUC6BJqNJvPNFv21iarwRTHNRfMoeBIlphZjCBxSZdbrqNDtSh44BDwdushT8TthKlLYN5kdS4%2BBWXI9ymd0Crhb7ZOO9yZs2pAF6xrPbxMSZIiAeT8FSKJqebK2izZgpqbxWNVwZpzy43616xoSPQTyVmnWcpXRnLekPqAfhmoWIpqq09Q0ZXR5B9bi4slr3BXJaht96%2Ffkb5xGXXUf8zOiMzmafwtscAkvE1f3mzr6tRuaSXtXQPOhPFW8Z%2F1SP5DHCfOCGpXs60T1jBq9224Vy8S9UiluFlOVJHssp16bIN%2BWOtDcH5WfrqMBr%2FEQWhXIQKIMXnLgBBbfSuMGZjyET99pTx3s2NTBysNmHH7w2HSvkKC0e4lFqC4VaKUA35CbSQKdI%2F9yPsGSgMcXRZ%2B%2B0uK80OpN75F%2BL71fNBpQoI586Xpim9RHRMssD9Wu5N1%2BcWhs7F3OLsL9HJjotVBhMdmTmz6J%2BtewXMWRmWl8h3kIMB0PIlepS5Anuw2PcoVq6Tlh4w0KOK0AY6pgFz1sI4C03yRuHwTFsKVwwr58JJ51DU10xFPeFJcopOrWsiNIY%2FhazJ9sly80DLbyCSIJPJoGDkbH25ZVKa0aNQvNAvnTIQ%2F3exUKcJOL2l%2BSpsSd6F1osv2w%2BO6Krryew2qGLUNFS5ecrLfIDmuNALDkFpe3OkXibjEQkz8ymMCtVg5BD8wpqiN0QzoaETld%2FR6OaTuVpUNjpRFCybnDIYtilcqnrg&X-Amz-Signature=3d0172b953a13bfb86a2c183b6c6a21aaa1776d802e9bd67217409911ed5b058&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=099ada767a022ba58136369d08033e54c0d45bb8aea1ba11d16bfedfdf724f2b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665YTBJQBN%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIAZnD6V81TILhcwTPEuHBGc5%2F1KJpQilSF55O8DvORbSAiEAq%2Fl72GpBxgWiLDZ3ezyHEKXObMXRigGkZh0K%2F1Y1QvUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDJ%2B3sIiRz3gaIy7b%2FSrcAyV4m%2FUbEZsgI0RLNvNfZa7aWlrPOZSv3IvVcxqMmyXUut4TErvE8LM%2B09VHZPo3TSq4gTDwjb7KiK4i%2BRftCcOTm2cvmTm2h2ZlHjusvPKzE3pHqmNvbrQNiEIcWzPOUzYTn65TkddM3hAlHgfZcKdFqj3EIShdOXZhM%2FmztWq8gR3K6l2fpjDdUjWFA%2B9sMWYuKZliomVxaCK4CsYDwcWdnPQnR%2FTroHfJUp69WiHfnvFPSKCo2Klhm%2FRKacqcu75ywxgdc50o%2B6oM0iPbkWgdNMqgMImTHaG3hbspG1dVMRUJxCZmslYKo2RpJqcd4eTwG4fQsNhpCb9RUuAfVBEafXehFLes7kDeJNtcoovPPLg8glqxVNUQ322lY3qgzBl0%2FGe394d5Ujhmnp770Hs6GX2RI6vs69%2FyrLUynMo0qtG5HWDe5NFw4Jek33teI3%2Buw%2BveRdqPrMHyYHnHceAK6bgg9E50PCn3INphbfCXoR%2BXdyOCujUkLPrU319Sod%2FjgLgu%2BbWdfmrMX9mHGocaXmbvv8LaaxkCbkkNSJzAuGfaLY4QR3fYTYQcxpqk8niE4qSNF%2BO9r6N08FM5obioGM8ASih6cXYXklBy6j15KyImuYlQ8RuCQPh9MMakitAGOqUBThm6aKVlSy2mQw0CaWYq5%2Fcd6ISUFUzlJUvBb6LhMfiNCYh0TA%2FoLMd%2FHbhAqUNcMjAra%2BPtmM5bBzKVT5iz1cWQt8%2Ff8omA8DuO78Ke%2FtLHqOc8BOkMY3pqm18YyWMM05Ytr2cYNUPVHuXTwNtN%2F14AIPW45zo%2BpGtv11hKbKh%2BQHQsgDkNsRsg2UMv1hresZhlzLMyF36JuUJBicARiIZpxYYd&X-Amz-Signature=27f5aa977c6fb5d6b0665dcc83049f75d7f0344102d1e6da6a05677016525ddc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666PGCIHPB%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIDEejpNbYZXFY%2FuW5jl%2BvIhdmFOW62NGuhJgwBOqajrxAiA1OBmjHNOFuv0jaKdHq5H0yNDTaIDDXtZLPzwfMV3k7ir%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMyDmJiIQrQ79JYgOVKtwDdMa2DJYieqpqGbfElfRigs2BNEqi%2BNPvQGsIsJGqhpS4kE1jFaa7FjiLGNPMXveNBikPVYhwU8YSbEJPVrq6ckeAQnw3QnLqy2iTTLrTOJbJ%2F6lAXoAJPpOn0MKArAqPPn05sIoWINyYsPlshVauJ58v3Xmze9zk3c7r7aT%2FSJj4KQh6XTsQJB9DjPBa%2FEjaasiORc1uupGUatCCqio60NvsqXpUrIlS9jqDfHYXW3Ya4p9HRWugfh108xvZ%2BFr8fJ%2FMNY%2FKwDKGAoemU00XUlpT516N5bUrXu1dHtTb4gFlZGH84yy7dc8o4mNUqQ3xn%2FkdEtzV63D2AJoVf1ayqFoP6mOSpgl%2FbxZzCWm8qqOYPieIQYmLxX0vIe2eDfcSxLAjwVPQDq0%2BbyRUbNopS%2BHAZcxRtvCsxzyB5YBb3r%2Bwng%2FseKF8GjkSfPRBIclfaCjrc5kxon1ihiP9dancsKo8%2Bzv52u6hBCM2QxogFZpRLQAVBn6k6FjBiVczzdHWmJeNU4zxBUzUlQFBB0G2qQElpXG24L3UHYK5yGs%2BJyYlY3ByBulFsleBHKy1Hv4TpXwe42aH4hwu08PepP9ePbtGpzJH90K71JKnBJS5h5esETQ6z1DjNpTzDJ0w%2BKOK0AY6pgFBLOsEtP2MGOLLJHOkMZMxuGyljKeQGCAKfcLtDyxZqIwbwLHjpObsIaQCSQK8vY8yWbIz1dndobgxb8x6s9X1ChNgRhg3sr5BB%2BgU5nqwnQw%2BGifjP2ezsBcAu4jtIRJtg9e7lPFcGYX%2FWyKdmgb%2FlTMBQOmy5kupy%2F7Rf9%2B14ccVzi%2FUFLgmEZAyvjgKit8ak2m8H3yzvfUVlVq9x6H8vNzrG5Sj&X-Amz-Signature=f3686e6a026c051274538fe4c8d4417cc8d4604c59e1d619f45ed6ff0bc13044&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QTWNKDJJ%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQCh%2F8cePyUviAEsivNG0fKi%2FSy5qUUstT9g%2B5q7MwLfyQIhANC7hm5TfRzYXHPFg2zzlfZfN9KMj6jNeevCliLSCP2wKv8DCCQQABoMNjM3NDIzMTgzODA1Igz5fOZIJPBcaBNbcSMq3APNderLhcvuhhV9eHxGr9Y6%2FtNNQ7KxE%2BqBDMNBVbemh43Pe%2F8je0E4jv1MaWQyCj60WwU%2FV2rFTNS3y0QOcdOWC6VP9pnkwdOK0tg3QFX0fES3VIPMa6YhqF2Hqcwb4DfiI%2FEpExr8jKD1Q%2FRQqpcmGDO58AbHn0zfEz%2FUExIxvUx%2FgCSZuT2acTR7tNicEbHPHdH8kIiI52lF9TxtfLKgiZ4ToIB3n4cjFTI12W1BQClZ%2BWYZ1FoGQRJTKYttT3vsR0pCV9q%2BzJUKRI9oiut79nKTzCRanj1dpROEuBYbG0s2txP%2BWGJ7j3N0%2B5J8wgZQGAZU54ivCbiy%2FSBqfs4B8I09MQueBYNntHjzTrPPRykmkvKXZBpC0Gfn1LeSZNt5ekkYeRs47EIeu2M9XKLmMldC3hQb544%2BFaIGl0Q2xRG6LsYtBq2GFkTcDXX7a%2FekLrdlw68ha1xlAqxcgC62xzXPBoGvU67dQWuHCi2kYMnpQ%2B7GbDzQCOzmgQebjpx1CjrKbH25omiH2rOIfL%2FibSWy95r2o5DuksMUS6uQhAAYgyOvi9RUhU5s5NzWOrkfmMe281%2FamITAzINWhgmLototJNRfqpq559kD3nT6NJa63Ql2AkFsAy2oOTD9o4rQBjqkAe9gtVRUg6lVZf1xkXWEKK2eXMLlogEEuFoGA6F6I1o5Qnyfx415Fp7KiYzzdudDbzuXvY7RtBi6YJNrwPynmnjm%2FQ2Joc6c6%2FGD3hcJgDyoAJYpdJlXexQVAlqKI6wWu6OHwC2N2diChjW%2FvDeRGJCRg6ROuGr9XVkQ%2F4W%2FtYEQjrrirEoDRYTSApHircrXLAbEMvt%2FcE8SB06fyObcbs2L4K9F&X-Amz-Signature=39070e1a33771b189f409d69be2f7ecfa3aa43d82eaae3205b151566c33ab578&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666KI3BIYN%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJIMEYCIQDXIY3Cmyq1s%2B8IiP2iTXIV2KDtqiNS%2B4LyJ7gQGiR7DQIhAIBGT2Qx%2BrtlMGb0uFPdVsM3aaRK3I0dxOMWamxiWkw7Kv8DCCQQABoMNjM3NDIzMTgzODA1IgwTUmxwjL62pJDJGqIq3AN5iAqOyiSvEJIMtDOHIMedE1gNuj7uQPBcVYezRh%2FTmWWz33AhfRpOi8fXuKdZDUBlP7I4euTQ%2BpifMPGEW2yoSlHtM8aUYoDbSngnOqlsgx00%2Fwrqz%2BYpGOUN%2BWUyYE9ghcA3S55wh0LAiqKbbOwC92ym6iy8LUaXvlpal6H915t0F6EtP%2Fz71JtaGE3VffzsBc5tLl488aPP0yn%2FH1pcjMhqiTx5Xwj2Z0nURoTNUBtvMGnp2eYzk52w0haR%2B%2FCeM%2BjVE859czrdhHzeb1p2kqNfDOlfnAIOYPVz91bhoUYWNkFxukOJtjH8bOe1uMxDfSYCVvNRdXqZN%2BgE%2FAsptrRtwG386A%2Bq%2Bq2aeGwifvpXxs7l37FyfcikrSCgY10J4xlsjfIduxPsELTM8z9PXdMIMinJ2vK1IdDXNhmGOAu0eDrVevHw9XvQtUqemAK5LG8nFvyttQaIYafU0yLbYcyKzdf2hoBrZp541hij8DM1ACpY5yhnvQ82JnZpaTKJXfpiOUH098gfu8p6YidjPa8mXkW8C2qA9Zkb6dn6fv16BMkHTyGjARxRUYD4A4XvpC9d8yYIpEKc5DkLMAJpxHk%2BeMcfD1cy1Hhxvcn4VzvKh4G1uf0usvmnGjDDqorQBjqkAamgf6NGj9agrzH4DTLCwXkDG%2FsT4niyONHdzrNYf%2BQD%2BR1IsKLFH7gASbcmCiZSgBBf%2BRRukxUmOk1RGa0zQ%2FLGSOZp26Smob9ZhWhCCUZHHVYAFPjEeLQiI61ORevCXKo0e9HeE4XuXLeOGvb%2B1vkfzmQKp5LplvQJqt4ek%2BNA%2F%2FJ6HHaEDQN0ofi2EBMNukFJks4WhKsTyFJ77vhuGPFwNzB4&X-Amz-Signature=3ba5d8c007b01f127e7024fa76d9cf00ccc912f632d3208354531fed012c33f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=ad86c87a2ccdebcceb32d2e1367e987c9c515e284f288714887302ed7d3b225f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664A5BHZPS%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDJN54gP1l%2FIYb3sBXddw9I49QKrhKvBGe6MQg0eEmnowIgP%2B9eyySU3u3YNsqw9eYonz94Raw12YKXOsT1UjMlFjUq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDF0xjhGY0qu1OLhWWCrcA1XCAMyVAcnBQybA9F8ZgTyzhw6Hvc4zDv9Wdl%2FRukYJfjDT3XeSs1yvUzAFzfv8eZEqyGfHdIzc222bu0CWVrTm0A%2F2r9%2FiKiLTjk%2FDnCUc1hHpQC4mVrL5p2viFApSM4lAxdEJOAK1xRas7liKYVECeRdvWwGBDLT2WaFug2RC%2Brj%2FX1MF%2BK6Mrxh71qOyD8joUlBhILgbtmj90yiVR1JeBFDv2yK6vslrnvnSgtd%2Bn5X03rvXVv3gSxpKMOoxurGy3LkmsI43iaz%2BoZpFeMZJ1t208P7RBG5LWrDuEF7cA3BtGEUFll50llZtF%2FQ3Hp27t9QL3QSjx8VM%2Fl6LZv58%2B6%2BsOPnMxYEEmBT5U8VbtStvgi33fMhEGhaDWhLuUusGBW1P3UgyQaq%2F40XmcC1gss9HLpA21e%2F36xJw%2FbhxzBLP5%2BtxiMQlmBHzTXdI6GiD16vaCYjURk3xIrtKkP10ttfv%2F7XobaQd%2BlB8wktTmqcjR1k2AnQ8rjzRInRDppvlElM37rzOtY1KHuTtHRdVUD27gqA%2BbVQb69ytKW6SvtTQq8qQzNC%2FQB3RcM0VcUqTC%2FVMJxiZsMc3RnYZAdPZZRhjBvb0fiPQ6n96OMHpXc6gdvVBQmav7vZYMLOgitAGOqUB7AybSDvSmhaAzeeg08kkLoQuJkq4HQQPFep1cXXeiHu%2FyBe8BJhHy021sqYD63MFqDh5yGFU%2FQosOEVofLpuD8rEWFDPKCZoxxzdgRtOy93ldnrQli%2BQ1uBGzkXntvc4Wpkkp4ZAXeFOMu16ibY2dYs7zLPBTxnwlmesoWOAttDvlAvsDArzVyAujeTGjiM%2BMSN6k67YHpQKTQT4Tb3BOMiFK8ab&X-Amz-Signature=ec5f3ae79b73bedcd285467f46477012ec16cf99ede808aaef7ee0a6f5c32bef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

