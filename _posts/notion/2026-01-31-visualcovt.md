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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034756Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=f139b5a6ee3369a61876e5698e8e9ebc225f57f95db82518bdd30451c964e0d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034756Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=475aea111d121ce8a5af4e16c96407e22b3fd5324316a4a409f239bdcd0f2c15&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034756Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=20e68e19522255812f9c48dcb47a78ba081a9eb6fd68a08200f4b69e3b082dc8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034757Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=9d0ef6bc1b32f0f8e5abc2e1d4e2923835d89e19469a25e704da281b0cf6f1b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKY7YZ24%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034803Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwe3ywdMjG%2BdVFIM1fU1botAEqcLH4XFBm5P5aftY5yQIhANlDgKFNHejlx04%2FpyS%2BWIcMOvhrtq5mh8%2FJrZN%2BC8CRKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw1YYjfDpFM7coYYYAq3AMLyZdDfIq14TXEpt00wwGbkvZjrZYd8eqAhwvYRa7A78AYlzx1Vgzr%2B24QciZ5dP8rWUzJhPgNg3W2eicyl%2FxpFDPiLR%2Ft%2FLuMLKvQVCzw%2FhaAYb6g47A%2FCyFBU18sqe5%2BkTLAtqj5SSyb4O8JsXE9jzUUvK0nG69xVdgb0gozEnGkRmhB2XIz%2B9ty8dACx8sO%2FlITc9%2BzVCEdjg5CUy44m%2BTtWde90EIhJ9RP73Qx%2F8mUjyOEZ8bE8jHqJC%2BNA1pMKuBt37%2BpRvrxaa8oAIZinhnjGVrdJFFLk2b68z14TeH%2FpdZHSYnAL2DbJX8azi3FU3RRu4EZ6BwMrwFSQW1wP9GYasN4P%2B4RYYDozyIuXSChzoHv%2BWF0sZ5MYxLSYj4ARMTlYfweFNHX9ZCHW1KxWUhW%2BJDtix5L3lgxh10bAIPHsi9WF7zTLY89Dxwxdbd%2FKwe0oWj8BElOTa%2FZqrzBvOfg8UNPLZ9GjnI%2FMLPV8X5nMC%2FjG%2BtwJayS%2B8CRGubPrNg%2BQySdOcVUNDXk0bUqh7pW0NDnFmzNckHJZuWLecLkAJ%2BxPKHQJ1irJcinj2bwEIrVFs9PruTCAY1iqlyN0i7Y8aGoGxtQ%2FyYfNNQmhH7Lnbo%2BB3OD9ziPdzCMtIHPBjqkAT9LcFgSCDWK%2BwlncyIp0fy0mszEwCxWvgUfMphJEdEtV9kk94HiyjxPnfNXzumvDfaG11uCiHiCLlZPXuMMWASZQVRIMwpta4ccZZkas5xxvWkAO7FDKPen1zgi16tjlYufqYqHsbyHZD0L2iqSk2mXrAmTfzg0fMW8eXq5F5nR3j8a1%2FzvaVVm7pbXeG2WXIlUqON%2FNDJXDCaG34ZTMLRGkZ5J&X-Amz-Signature=06a9ef309bd7c69eb348ba420eb479b2c7dc505dd730fda9fca147845c7d2f7b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVHDLEUS%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034809Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG%2BfRujXM2tp7OwspVDLD9Qc2Bl8sVrXBN8svnoVkp3vAiEAtp1AcDxNs9vj%2F3K9cMVz7ylfyCWKjk0tA9JI%2BRGurG0qiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPuMl57C65NSiPMWTyrcA88alRhFND%2FHPEEwu27HdXsC9TrBcx0dRdvogsUCTBAA8fO0CafQPhocgRxEm3SL0dUud6U80idkqdZRB4faMsQ%2BuLMo%2BFqpWy8SwK%2FA6Lrlyla%2FOkAvaDAJgCEJfHTRO595JSHeZDct8XoljkCG4aSA1S%2B58%2FbsnIYDdHdId%2F%2BeKLVn%2FF3lAHUT%2BDKMxr0%2FQ%2FxafCYsPu3y7vzb41DDr9CRjZV%2FbFfr9381td%2Bl5WPJ1hx%2FsuuqrTPY%2BiYK%2BI5i2rXdikAC6HlFoOiS4Cw3BRJrTRtpDd88e%2FDg9BHJHUAwmArKj0KMW8JITp2v1SjTL18V6VqoOVQ1VuWryLqfCKhjCqxDuQ8maTBVU1n7FKhcgCX4XXA0L%2Bp2tkpopTHps0LSlNK5rNJznyhp7T1qihhyHQYDOsjEvM3iGmGaJKlN3vmOP1hPjQavA9praWjRx7qdSuUdXDUCWJKWcOMDp6z8eCVyg8PeALDfzr7ChJAMtlWTkNlbpGRXdVKqJllLKTSbWNEQbH9wEtrdpwvM0p2N8QAiDgO8285RHomXHJs84TmajuzAmh5eRNIvKp3N0tCdzdZv3EtlcssfZIckv7XRho8fi7zM8w%2FzL%2F4BaKCMtLy09sBTcAj%2FAAOpMOm1gc8GOqUBd%2BgTZMg549KxNl4MAKZRWW2rSfM70Mro2QrzwkQp0CMPZZydCslnqbYDyKCrDoCqcEmUNskjfd%2BayMGkE7czE%2BE6Adlc5y6eon6zoKfrAOhEezy%2BCfnUQHG6cVKXVPSRPPPiO8f3LMqU%2Ffz37mFQNKgp8Xtj278eCvXjw34L5MsldPpQrxZcUIwyQxN9aJXmZiSn2wAFISb4sQhKFg3Q%2BDZLvVVR&X-Amz-Signature=c73f42338b8c52a8c3f77f2df20c3606709c987724f373641ebe286613fb1997&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ROY2NEB5%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034810Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIASj7UxSl4cs2VwaGe2kdXMG4Pu33ySmKQ%2F%2BZAl9frwWAiA2DPJtGmmuYgGilfXDNG4wkFnMJlHHHj0HXgnSDGCiZiqIBAi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2ByrfhcP%2Bp9F7MAXZKtwDK4qjmWp0VqivZf%2F3DTWy5w2Ioscmn4F2b6i2VNpum5L6HFzZmE2fwcqm4jY5v%2FlUlzM41OdAR1nTs%2FzuMJocslxYAFxjLwcmh4emUJ44hbUuE3l4DikLiwI9G1jwh36LI0MsqK6vt3LV%2Fvnt8PwUQUbuDSh13h5qSOMgyNnDWRlWBzvyhuAXB3aTtsd8LG5YqOGpBbPOZ64TMLSsm%2B4JHv5Cve%2F3oUWgWtERW7yDgQJu5nIWWYzqPIRvb0rxNALdp9a2ZciFJzdC5n9maCE6n%2BkydVJ0HhduP3RtX8DVUujnmjr%2FgcHLYQmijb27M3XwpAPCa6eYpvaeZmjpHV8Kwlh%2FNCfFUcvpYEgVqZRFCvdS8C06QBpuzZjrfn8uz7lAeRIHFQT1w%2BYajsSkvLWqJuX6oiEtnmO4yFW06qIo9hd7LwsQJRhOThSyRmOYFDsINQ96DlPC1jePvMQIWyuZL2AVGsZOJ08Unbgug%2BwPq%2BBQFFekxCdoVX8TgkzH5bIkewzxuyigCptXvU%2B5%2B3yiMHjPOBWT8uDqjxomYjJV6RweEomn8Iqio%2B5zU5aDN59htXNuY059vLfS52HxjF5wpTE%2F7gc7rfQMS9a16vYS8dxQ4rQG64Ga6dlwZDAwr7OBzwY6pgH2HU4CF5zMhxilevww7shoeMUwj7cq1RthzDBzt0a%2BV%2BqCMIKfBI1jGfY9z7hMhVNE1jrTnsizInI%2BtqBOlDJ%2BNArP%2B8c58arIaJnA5wDVbxyoyXBHM2clIBMJTtDCbIsfHzRrNZtWO7j3%2FD2qoXMLa8eSWrC%2B0nScna%2BCQ4PdgQxgRKqdHuIMmp9Fd6lQ8dhXM4wgamhj0dd4%2F1UYyb0rIjg5Or5I&X-Amz-Signature=89ca2e3d8aba39f223306c6268732e674924bea741276c72f1227f5f6eab401d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QNC4FEA2%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034810Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDUoEIvRjUQOc5pJh2VGVtHEuNioBgupwrdv1jy8SFgugIhAJL9bure%2BlBh6dubEzyNDdLBDQZ2mKJcCjj92rMptdygKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxCDq1KfW9hpIghb4Mq3AMRWYVWsm3lG50z2GdOVaTzksyh3YN4bFpJUtiTr85OYd35t7Z6mhDdQvFYdEQT9WZDKXhXHdZiHZPuBVTvGy4Nge6Vb3U4H6XhSDgeJJbh0vH5dMt1RAXPjM%2FMSojyW8eYlW79aM0QZK26D40fKr8vlrc2tzXXq%2B4dDIigID8xS7wtgk7y4wx2Kh2Di6tYRB6TJzGDu4Awr2eOfl9m58YOTCPUY3yB1c2GBdXzjeSmUPBSo3jWklLfWptkrDA1%2Fkw8bsXsyWrvRPqeZC9KN6F6eV%2BZZCEEIqZ89V5u%2BmnJHIbVEV89ZuG6ikwErxsIquhV%2BvT8SbB2f13ObgAdNqdRmqX5O%2BFgCJClqZMxBFcWxZ0pCY1%2BQzxEcK8XRt%2FRt0f4YV2o59yeyxf68aOQx8PPonTd3TRlKc5FdW1j5PzDNG0fg%2BjQRRn88LYDnWRQOIIQ3zrTywYlRSWeNGPDcCVdtVkrAYEcCja%2Fog4hYo%2FTESjjcmyP5z%2BncJLwAHuUKYlpZfluWuF63SIBihx08Nmuj0gdgK0Aw8fTXSFA5P5VlEBxE9jxrtZGduxhJLPw2LWHhrM8lXMjZ9ZKegUJcOJbakFm9DDpigg1IBYJvOUOsdqeTtkW9g1y4ww4qzCws4HPBjqkAZZFJoMyniPxApo8%2F7pcxJ2Htimy%2B7%2BiW%2FbcuaN5VmeahA6PMVVPp9b0w5SkM%2BkgxPXXDELDF1UDjzEdpkKvhr1eItSg92hxIxevzfGul1HDO8Uy77IFTek8FJfSOKPk37lb2Jq2rIek%2BhTRY%2B3uqjzIdObh3tks1mxbaLI6UUoSWYDmubr3WtY%2BSDiDaqlJ%2BU2%2FwDP6EtJyPVU%2FW7fF8%2BpnUTy6&X-Amz-Signature=6aec701bac77efa0170583b1b89e8c10f80e74d843f943c65f6698c7d1af42a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034757Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=75360728d71785a3b69f5fd76ae19af1c4ab1ba5c3cc2e4f9eb299e0b7d25cbb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034757Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=758842cad7b09f52d3398be025282649eb01e47c3d7f966cd109527d7c7196ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RC6XLN2O%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDaToNMtbUum5otW%2FzkK7WwxNve6MPiWIAlIEr5fBBkngIhAOYwNasMRYCiTaZ9oiml2Km4eFD8k7eKZ4p%2BDzjXsy29KogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxHrzDxQCt2pDB4kikq3ANxCA5SBIoUecIwVvZzr9rdAzWF5r1iF59X3xb67kafabg1kBmskTFwPSlAPUzwAiN%2FWuD%2BhZ%2BROkUVZR21giK3RQkxqwshTimqQfX0Wz2wh5CwOt7NGHdtS2gRJLvE3Zhi1ww0AqAhcI3nV4BTCm4%2BPla9xu6N17OFmDdEc41fV82WUDc9zVPii97CLEGaTZJEqzhbpVlH49Vfet%2BJIB8wvHtOp7VdnT0oCJLWTeNtn8VodLoANSlvGschAG69oSYOle87EAUC9Y6YQ8G0TirMhQXOQPudGzDU7CGRJOgA5DkJlh99G4TLZ0eRzUBKPMot3QfQljdD2TOSEc5mp7qCseg%2Bq%2BdvrQhovx0C4dWu71XTnbuPS4TPJB24ChJJSIn17dOO%2FLukOn6S0%2BMKSq%2FK2wo7tnYj37UnyI28a2cpu2Rbg%2FRhZmy8yDnfsvwf1mSfPgjW40EFEf4%2FqNY4jwytBDA7fDH8ux72d%2FaWWRxUbDT0oOz7lyUNzoo0nb3OC60VhbnR5dacGSxStYQW8ogpLSgfuhM4Icjb2Q4TMsRe%2BDxCfRNp98UivwaQBMlLwUQqg3CKuHWRYzO5%2FVVj7TfgSz7benGT8muAnp0NtmSl7ZLFGafkRK%2F1rSmK0jCQtYHPBjqkAVZLwMa30AxVnfPIMZNqudYwx5VRsi%2F2wSj%2FwOC6H5dUtGwBUIhjpRYfE8NZGK2HSCgyQU15c3Fds5mu1%2B2xcIFOWWn5pCtMaOFtDkCh8AqT5tglG0DvvwNv9nEt%2BPmzRvgv8h8YfZjViMTBRDZ73nL9p3r%2BaeUredFuz1rFEH6E7PYFL8YMXcy%2FKKpROz2xUJUpFks9mncqT82h4DjBLVr97HS5&X-Amz-Signature=cecc253ff8c184fb71865724476225076e56eac2d709dcb0b020223a775dddfc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034757Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=a29664912cbca61008bb8076025644ce994a2e5103d7c61e61b2e176fbd0d616&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V4VHFOYG%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034814Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB90RdORYmMglRh6arda4zymITZXClplplS1V%2BaTwzPVAiEAhSkqxrc4dkC8YG1ays6HsYvhq3Ym64n7cU6gNMr29wcqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCUSvbYwkaXd0FK1KSrcAzZTELBAumr6%2FCt5NVVErCWmSDeA%2BqIQlVaNO6L9pxyqfNm1JVZDLGDVaL3uE%2B64U1fXq8lSR3mf7Ip9c3M%2FznkJ5LZMGOOvVneBYvw03JlGB8uhWh8aHxQtOcgWdQhHYy3gcJuKggUL7Vpo7kR6vXwwRFaaDGrvHdzqrDOUtuWbGnc9hU6mfK%2BuLKbSQG5xNXrlIYs3pmIl%2B8cmNgWOcUX5KbIeUV2P3hxHxT%2FjXBJBC%2F5zrZlzK7nTSgSqXgZ2%2BBEaN8w3ulZW5UEVce83j39H13Ae7TqyQWnxnvrsi3rDbUdW4GHKQru7vNpMeKtC5YIlPLI2ElxSL6eCAOLOTsNPdeDXuOvYEEeKvVZ2j8MLzksajqvKsNvpVAokygAG7udms607eq6UQyylWkY%2BsF%2FQPk3O%2FZriivQe9Yo7x2DMbGXLkV4jgKIWIMYFQwnDyc1RdHavh02T23e6C9HKiZq6RYrztta8WFouuV4SMwHTpRvO0hMt5LLcl%2FIStya3R6X0pBWRE4%2By%2BjGA06ZpEQPdFIx02EvkFCcWK8avMcq%2F5VPpAeggmjkV%2FMg4PWIAJ2DcDHIrGKCEq5LrXw7kO9fOhtUn9luvQRJ9ao9Afc3xfosFCujbtHcJE0WHMIGIgc8GOqUB%2BDdkDIN57iMYfXsu8yTiFzPppCOT7C3EKMNuX9jyUgPlJP2swDLobjUYQlxiMhsp2uUXzyPPkUNCl1bcbJT9Kt%2FpfqtKEpc6UbFotkYySzyyqh5ASuBDa59Y1elI9r%2BLxzHI%2F5II7xwSCKntF54gUJIHrLPbOxuXaSqz4onVaZouAMNY9agB3Ip35WsI3rrUOD1elt7v2F3VT%2B6PhgdBaaNC9kYX&X-Amz-Signature=78cd8a7bf4d1088f7ac334010507ca9cc5074d959dda2209a196227e58c0261d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5DU4S5Y%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCV3TOD9bvg1PZETME4%2BySnx4N%2By%2F1Ao4djDSt8a2EevQIhAKFvQvtdRenXky0Us%2F80kVfX2wApJosSelXDi3B8Pr5aKogECLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy6AYxm5MaIFFCtaEcq3AMYRPTHiVVrmQ6Xyf3Dir5v%2Fupe4AsEBrLIms3qHOsWpbXzaBmaXWi2hrF9nZIoksqzgEB%2Fq0xtCXu6%2BYILXjHREWFs5aSTGe%2FqLr0TyihArrZrYeUSwR3qePWxhkmgb0S8EQNKAZBi0FhsZ7ufRJAo7ViBjpHeM4iL6%2BF5hunzQluD8T99BJG4lFKThbG3DpPPSLhvOQSMWGkbxS9c0uMtHTs7K8UmHiLREgZI3%2BfJYnRANG0d0gVk8zj2cAKZyexgCL%2Fz6%2BS8KRpjGwoVrSSihhJv2nX%2Fl4B3T4wFnYC9axehsHYxxRTBs9VQzSjlrAKerOJ0kyB33UMwvG3mKNy3OJGMpcFaPrQCTOhyY97io9rH7%2F%2F8lUpYFecvM8o3jlKVPLp3vksn5U5tuepI49pZsL0qL6opo1t44MMQWr4yuuofU7q1Rcvu%2Fa0zYu64cMHVyPunEPXjqtXm3QygfmwCaQZT%2F9USfaW0GyZPWpq8%2Fogf6VRpNtZGBRyBVWpOhQzojeIHmI5fuGeSU53oE2jU7xrNAVtH5ie0ddfqHtwPFbGfn9LBC1ZxR4t4NidxgkShl%2FryUm3hK6WufCkrnUKa7SMiU2u8mDKnCYgHLcFn99Nlz6Qs67DuKT6GZzDkhoHPBjqkAVrWJGs4OxB7bjxVcaNf7PW83LJXzPkf3YrsW%2Bz47otE8zOO50VPrAcMM%2FOZWteFcJopIJxzK17yjz3Vp3sF1UKQpJN1rtzCOp1VhX5mxatsxtXqUpGQs9TNTCj2hxXeLf4fjw2jICgKql5Q%2FWCDeN%2BEXmuEjxl4QEndjSDrCqU9T7AszL4%2Bl17k7nC1l4bGAKz7bQj7POQ9%2Fdc1pm2nMSPxFla7&X-Amz-Signature=780e7724cd8bc2726f5b4ad390a2638274aafdc5d654a5f60853600cded79564&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXCQIY4I%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHwRKH6tEGjQefCkkk3TvlwG%2FSPv2urVVgK1eMtK6jntAiA3G2nk%2FW3OT2Y701F4fZmKWvxu6ePlqWQ1Ieyb%2BAmWySqIBAi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMIhIagsAqvjc4YKWJKtwDd%2B%2FiAoxOWx5vTWvDW%2FAfrJUCTHQVPfT1H%2Fw%2B%2FdlYc2ZpS6N9q2t852STYdmAukJvOEI3CsLEfYRAO5WqO34WIuEI1kixoXOBU9p5juK3d8tKdWY0SzrN6nHFsYkf6ebyy%2B4fF1zQKAAOuzlfBU0Otfizachn1vl9dD0c7xzdGPDfHAKsLmsJzbzTncfGlhs3XsFwyimpXNXbSc4b9hf7IRHlePITOosdxHmO8Na1ysqeM%2Bjo%2BMoCIAdr9Xd98vWZomrcmzzHT9wCLJOqlFPktbDeeWUr7tMS0yZR69Q8QItWvhHhgfHogTa2xhYqwV4z3GV74UspM3vRt5kxr81K8U2RuMpPnB%2Btm2PnLp0Jms36IIq9Vvo%2BwPpOti2OTlC6inRP9RgD9%2Fq%2BPB%2FUozC6eAThVeWeex79wIYShlyGZFCGpK7OxtQBFPgtn1L%2BUro6x390SKctC4M7erZoZKiR7dFJE0IMx07GnoUSdIdyOBh%2BQWsemiMez6h2XWVnc%2BTPORr21zjR1hRfbbv32yM4y6JMJwc%2BZamGcoM2xBMv0l0Gq5%2FqE0FUTl04aHTtYcsnHXorHmNZAfHDB7iNN5%2BHFbdNT1anTsL6C3ACt02vgpsomuI%2Fbc5S88jXI9ow8bSBzwY6pgFCfwB5m6PD3T3gvHKgXzjBFaeQWD4THZqsV3IVaV27w85Ht2A4T7w%2BuJQDxjGcoR0aTR29GWjQZomAkFTtaj89mRRJVgmM6wZR34J4NLsS7dVtBbnQgQJZR5E%2BqYHlGVLyZ%2Be1VAZNovn0lD90%2Bg7S%2FrA1RpdHje3EePah1j8p991wS1weWd8B8GB5TgaRv1HOMqt%2FB6syhW28s9pCcobJlGq7G9s6&X-Amz-Signature=350b2065c8ce7669cdf8df5580e483bd2d0ae62ad93bf117468c975497bab12c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U2ENEZSB%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCyHddnRQ3wYfvFiI9t8GB2ePXNZienF%2BW4ldi8SF2rsAIhAPUOsb0W%2FJqdQzc5j5MSpQKxsGrutmMZo1itOR6XlRaoKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx%2BXgL8VELEpzdETO0q3ANNzZ%2FCGx%2Blzl8IC2Gj7KNwHkvvckEGSxUHN4rOUgzU2mfHe8MOtL%2Bgt5M6hyJORs7CNs1BqXRR46z2dbR0km5Iake9WKwD%2FXNZifUS3XJEeEuuBv%2B2ZoNia6z%2B3sZRscYMG3tPLTIyHBN3XQk7T387qcKcZzUkxhplaf6m0OZKt46LFkMhXAiBDDMKA9Pz2ZDbqO8732Q8ijZSmtmgEoY75S4ITMq56%2F%2FdZI25NH0JqchInLsKrnB7BO1BZyPQ1do3h%2BB5saZzBTcbZZoiSuyJZQmj%2FRdyOdvxGeYc2iU1PtK0QZtPh8T53eLlTJOx3md9e4uwFOZnFPDUuyzQ1o9E1LpwT1hZmlbEfsnwZg%2FsrsPXsr8wkTHcx5vHvhgH7T%2FOAdQklSlUDllSiuzrcbtvASFt4xdnhKyyMObEaIimhFwbKRhH7ZEshXRGtJvvdQCQDY5vptoBxfBWyHbMdfCcLF3SFtqJ9FN%2FeVG722bQ%2FsK03And7foTSV08ee%2BZEpYneOlpvD6so7upFajQ65s5Yxaa1HeNoaEFkdHWfBQQkWF4v3WwFIGkJHp47%2FzGm3hhFJ7%2BO1CKcSm2PTU9zAq%2FjSj36kTPlB4K%2FVz%2FeepDnpVQVugE74trum1%2BCjDCtYHPBjqkAew2DiEm7yszjG2eP1etWFSdk1mZvSuHkFxeQO9JNAl4BePcgc3XgNWjCBQi36ul7%2FJHumvjBAX2nPWOVaUU7JDS%2BJDxjk3K5iXwtGZ5cceONhAxVpAemITd6Q7UpSNId9Jz06d67DhVM9D2ANAGm%2BjOCgwKeDL3EfaOlKmQJgDEbrHtWXS43xlOjfher91t4ktcShEnrshFyv8wtQ50QkH7Exi5&X-Amz-Signature=62e766e9d052cc7c6823c5c12d78331a86f18582f30aaaab210b899d309641ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034757Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=2b0f7bf16d7adac27e49f120ad5a6cd63df99f8d84b6a7df96ae155e8b50fac1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD6WTZD%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034757Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCMIakhfNZ5s5UxpZtLvmXdfHrW4lJT7%2FlZL50fpYWgAIgQBnhT4vhiBbp4VK2mZkgpKLUCMG6ahQa3iU0%2BdfUBSUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJk0vr%2B8EjmvR4hD2SrcA4M1gj12jCOuBjHha5bs9PhFQNBciBzteZlRgUiFB4j8zfBzeD%2FHtF2OlfSQdWCWhynu3WyCgozbOK4BZbp9MMqiUfPwzZhjrIO6A1H1E5qBvALbZiaWJHN9lHtKZN1Dml%2BLzkZ2hDUPmfZwy6gcmCi2d43rPVkZ5gjbiVKeH4nX8viwRlGfLccerW3NTFzEJXzA02Cnsp1y81fvFGeewdoTCWWtVQqfX9EXlOJQhrpWUZjnnAIsC42h0xpvky91ICNMd9MN5l5exIRdFKM7O3WD6Q0vQXJeKkpQO6ogF90e7MzAhwPo6IWKsyrZQLQSXBcqPyw1yvwB2ZURTgzSblrv310L8ETID%2Fqw5pmb63AG7iwg8XNWvSPUB5Qla%2Fv2xqmP7Vc6Dl6ZFcNJuhe9Hb9%2FNwvc6gSOv3MqCP%2B7DB9OnLYIrHfFiCDKW495Wxk%2FusxL3F9a0lcsYdSDPeeEa5doEkcZhaflZ9aSK3Q%2B6VPUgnRnAzlDbjuar966bOODQb9lmKuG3wEP%2F7B7RWxW%2B5waNIJcV6%2FidE7J0KqryYt1n6aA81FYn5q8JoJhtA1gwcqt10aeqsZSYNrfvLmKSu1S%2FqaRwphdmGJxdZGtA%2FGvIu%2FtF2abdBCNOfsBMJ%2B0gc8GOqUBbRqqPzrZTJIbCHtqZIVOC8DCfdrp%2FWsEHloPGWglAz5C4muq1Hm0ujgksGQQM%2BwHd%2FbImcdj%2F1QcEuq2Pf0lCxgYPKX0dcX8eURTR9BeRcERwMot6UAkNF8nQEsHLT8LLZv%2FdKMh5suyNC3heq3C4f6DUm2InP4cN4cCOCBzObpdHBBxK9B3eK%2F1clmNuUPmcsf70x4VRnDn%2FwVVVqpmjSmBSDMu&X-Amz-Signature=3382c368c035da9845fc3ed6a0edec32c22eccf60a3e52d559926a89f1e150b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

