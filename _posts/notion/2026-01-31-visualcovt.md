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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041913Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=b6ee98a2f5aa6303f78ffcbc3ec97bee7bbc3370a0eb2bd92a813714da88851a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041913Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=d9e510ffc02f5ec48aab440b0d8ae23af95b572db9e2a59f264c195f1872f51f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041913Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=0a4f36b4ed87616e5234e8397db7d581c66381b8d7ae6e4ecbc10b66fedb05c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=824c49e420f4dedb9269caeeb872e08046f14af3c9b64accc0c75548151d3308&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSKT3ZSC%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEY%2FV6LTzhiLR2VSJyePQB3a3IxzJXoq6pOn9KJ4d2sgAiEAjvXE1N7zOaXBmQzAmA24ZnwNLDP6eJ5tNeY%2ByfG3%2FRUqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMsiLonO4oQ3z5WTTCrcA2WrNXLr7JbS8X66XcTjaYA1XVqlwO5rzH1Il%2B1usr9gywQCh2JpMI1dF3lZq%2BcJXJS%2BScItPljklB9c%2FC0Iu%2FxdKmHwhMUKF3ebgHea5r3WQhFJbmRWL2M830eqocNEpcSl6Ub4pSxX%2BbHHnxZTMIHWkUMeUD5GyLl5dNC0iYVoGCbWhrzuPDSDjWURyAyoRw2DiELrTHFBiapRZZ1V80K9C2IUvZVCHxAOz3nJHZ8gvhdFfK3BO0I%2FcZzAtdKd404yM6c3TUAOCRax5g1KvHey0RhEcuPL9B5yufnVYdqmPVHWNWE4lGmi99OrntHfsaVBCloiJkjz5qH27q04MMCnJYJQYkzA0kv8WHzZywCNlm%2FgkuB%2BLHRspxG%2B7XKAvCbjhYyqWBhDM7vOyQoWPQUfQv0ldDEzQIvRQZkUn9SAAQcMxUQS7JEAicHValXT7eGt7z6HbIMhLBWMC2WJBkQTtcXsjJgk%2BatfSNMGH8i5bGRrcXXWAcyXyi1hqRCyMT8%2Bqwjf99AA44H0x0Gz4a7WxK6lJ11jSxXNmZgPwmTL7oN1dgW3W%2BYfG2uyEQaly6COIwNZuwGxd4Zp16Bae0SkEr6%2FgZOSCyctqsxdnWselQBAVjp3p%2FMwMQLVMLWn6dAGOqUB7Bs8KzMTfm9XBAOAUmxloBGUgleakKdEEdRb3NLMLiENVFEnip4NFOEo3MAw76bdw0xOeN6PpUV00EgkyeyXkaSmxaGmQmzbIGfB7owd58p4WnZGFnUkom12adYnI4tz3l%2FQ7g%2BBe%2F4z4IJgRecNjUbRrAEs6lZm4w8FIXgiMKOy2hlcgyI4hPU01XJNfpD6S89VSYnDsFYeIRc3KDCq50HSr%2Bbm&X-Amz-Signature=de8a80bc7f28a50baf15125b8a66966ce6e9aa755c64d4611a1f291db06d52e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VNHU3I2J%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQCT6S4kkjRVM0lXjl0nGxglD0oXSS4TAccf6rmK%2BBwEFQIhAO1BGgroBvJDdHzNyfG3OILYSrkFITitlm2Wx3rHrL9wKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwLJ%2F2ZIX0d4uLaMNMq3APoeZrRCja%2Bj%2BTHe3%2BAdeid69vN6%2FDZ1VaUDT6L2LeTvxSgw4UTkOdQ9b0UIn51OOXv%2FHHIuEHQ95Tm0b24ZuFbTqEdXUbMaCIT88TwhovM6UneGY%2FF2dq2b1Nn8r7DejFuM7HPwLlZRZvXFzwyJXM3pj9EgaS4E7zN1s0JSgHqS%2F3l8UbH5i9CGGqtWgnFJmHAqBHl6c0pSNn%2FMmXYI6WcigxLRKhYxOffMBhhhdhMT3yDLbNiMoKV7H7AJQ%2Fdgt%2BBg6zsV2UsHfruWojT4Xq70tOjJ3%2FV45bIkY37t2LTA7ro1Ad%2Bcmr13ULXv4aAuUxE5UUEjw%2BZ09oQmmKLRAcOJZSkqae7DQv9%2FSRNfimbE%2Bdj10LMhr04iIjoiaisvmbtP4FfUyysDu73PJBZm3ebOM05Vs9llCqIB1hoxXez6L%2B91P99FKZPChEP1f1qIhdzmy3b8ZuC0lA3iq%2FTRrb7hJ%2B3MhdsgehpXJx8eE%2Fvj%2FIpN8rJ5UYy31USRLq20H%2F%2BeFpK9OUTBn9SRBhUg8mtdydd4cnFRjJ60TP68PWzk6UhOLzGLYGQrV0RhvQR6Q8VeV4uLVAgkt1sSVEtmWmUYzHZ1X%2FhzuEmko3361cfapKbA3CnGLjUCQmNbTCIpunQBjqkAQGoHVxxxegUTIYsOr%2F2o1pV7sk2RT22SFnZEZjZWyY0XNrNhya1ivEwOHTu4l0SUwEm9gVkc3CrIXebejrMMQJhjLQaFfrr5AkZw%2BRu8L03yZtBmDu18Xq1A9c5kmb2j6xukKGRvF5ehVBXboLWj%2F4TKrkHSxjxqgh1TblI23hrB2Fe%2FzH91y%2B38UV2X9E9zbnJTTe8S9Ir7%2BN%2B9hZ4P%2FZR%2Fy4v&X-Amz-Signature=9ed7338f3a9522294e13ed773556a62e0ae50f8e2896a1a1fc4fa3befa0a2037&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HLX3CI3%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQCaTC7gR96YnnN%2BUBa4O8oPmxa3xspXlRfGJuMhTkZa%2FQIhAJBofKLdp%2FvFPKAyZXqz0BMx8eV%2F0LfkocyFcxr9hzTvKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw4B5RVJlLywQ%2BVnKcq3AMoSJZRBXU5a5MURWLINs7W45Z90hPiNsozunsT6hDlWVnxtIKrAQj%2F8qJllgHjxT7RdbdqtQGKpZQAUdiwO5HQQ8xNdAA3YuCq7wj00uo9jLzUXgoCIVZdAM0hvvMgCyUqLv%2BS9gKJvsafnLiVnodogrlhqrLzTjQY0dziMHJ1DzwjuUNQuTBWaa%2Fipa3HKlpbFJeyB1Ddk8UguVP3q2XpLWec446Llc%2FeWAwOhZUE6qb%2Fsd7BECZZJ%2BT4Oy55pMhl6BJPhwuUfuShs8U4FFK2ELLbpSiRuWOGfTMMT8Z83JGxXYJfgo9rHCHsI%2FoDSTZ5OR%2FxE2uaQ%2FUw3yvGhr30SOvcLnorHBFIzoUsMN1lwRd1a0XYtVP8f1m0LcoIi5He9B2Rg6UHcxkahcsClGR9jFKp1%2FuZyExh%2FzYJF3BylOBGhkPtv3Rr5mGaS%2BhzoaOu6QAQBGfwBV6I5hqsg009I6WRdqp7Xzx8cP4vWKGTdVom%2Fq%2FMZ%2BinwZyUQV9W2Vx26IEMfhMMo9vskSB2Mui2JiXpN7wvdG8jZs4axd68lr3sIgTpd6TY92HOk1rAV8x9Msmga6ogMelYANUDlHnJ2SVjlu6sEumS6dJ8aDzHaH1PkSgYYabRtms2izDdpunQBjqkAXwFW8fh%2Fe0sQJQR9GOGbnAlIDKzArIbDkj2aXzTfpFUxmFVY5kp%2BnPkxhMQOXTNjdNPB%2Fyd9ZgeZVANC28km8LgJeTvSMzaiwjO%2Fnlqy2PJVyMfmaFGql2Ru0nhUQzKWgwhIGDT5toWqMbme94D%2FTqkVjdjAW%2FAkAtjnMgQdPlhq8UH5WF6R533D%2BL6ZLAoPXn%2FW5qrgCiXilQPi8%2BUIaHA%2FPiH&X-Amz-Signature=26e144e05e4010e03c5b9bf39f22eb7de6aa3f97dbbec516639d2d54c4923686&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SOCPTDL4%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041928Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQCt4fVWxqmmBCrFKkAO07wdzHcppAjxJJZPjEw2FS1QUQIgN2Ga024nIYSUsyllwfHZvW79syGNeqNB5%2B5JsE1NWFEqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFC%2B9DEx8Ft%2BtRUOOircA8ZbPe6jkmOeSV3rNQyN0ubhczQ561hVecLfNGQXKaYhDAGIDn3YbEt%2FpFSXMRb%2Bv0I1vLWlHtrOQyrY6%2Bfb6gqtTJ3IrWB0lPLwiJdcBavL3hJw4V3FYnZnFajX4sxORjChutlSCwjrw7qyhlyORMtfAZjLSGIlyVV2AggJcPAIvaKdzJVySvJrmdSUr2esvpUhZn2YQmzyaChAaeP4FJ5%2BSbcuE%2Bhsazg5gSbewSgWEeS2Mn2uz%2F8SYphkl4427bh%2FzbftW0racTLZ3%2FJEoIaqAz7opXSGw6VW%2BFQe7R%2FK1CQs9%2FZdt8eI%2FfZeUHNBfF7So3%2FD94UxSVrtaIIrhXOyGHzfrnuHjzRMxYX7iU6zbByk2VAdhnaLy1UDtdDpXJ5R3dzODgV56Sesokwu9AAALH9VsISOLlbI3vhkaYErcB%2F8wFvEC%2BXqXSynPyciLrmWsymo%2BZ5rw4ST63jq4718A%2FtkeyZgeQR1iZfftQs7gcmOj3Co%2FNW2qsad1x7pSj95muJ1tlqbRISvuo1OobxhN2R041N8LYXkmRoiW9vL%2Bf0bgFcnXb8o4KMP0G7D5XRuIAi2DH0f3VSiM6Xw2kBel0RAt8Yvza%2F%2B2cgxSiPcExRFJ5mJj5U4KIPwMJGn6dAGOqUBmm%2BUUfAbsGxwXSCNy2oHy4zEqZhcvrU2BwBOEhwsRaEM%2FbiOYwc%2B%2F504PJGn1Ns6tY9ZxtmY6OFJwzgOnCsyUqfl5%2B7AyokxGqJEfP252xraOuuwPTKPkRY%2FDblI%2F8DgFgKmCTJ0Ja6mv2ufA9GtMPtbtLIjGIYzo6y%2BKL73E%2FsLoD0RUTupe%2By6MaXUcP4sv4TS3LPeHbmL6pwU0ddr0Pgzktw7&X-Amz-Signature=8c93dbeb91d6ff523e6857d818f35bf136c8dcee73d5c10dcec84e071df517f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=142c9e0c78c59d455d2747eaad343a060afe2442374bcf60f20b453a0ae04aa3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=cf896be2059405b648e78f05e420d4ee4c595de834fc46dd1ea22cc5df9de80d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46676B6Y2JF%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIE2nast%2B22DzarHmDAbMV%2B6sWS0Hb0kjR045VaQ6wDjpAiAZMSFGlumU6cIUe%2BvplvhVYzAhW2I7%2BSgpQjj%2BrHfD1iqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMCKYhERWp5NQSd2U9KtwDhnRMzOHvlumx8oW2HOhc%2BCE5d1ri8gKKQC0wWnmZlMBi4GOWzqydArpQvlwkfKvDJJ0rRWex0AJXX9udcVgsmymQeo5acIWGq42XefnEdCRK1%2F3nnfv9ZvFOjSOZaf%2Fy9%2FWY19HBrRSeKeINFCcbdwV6rO5zbevBWb2T9lMLZ7Ys1inapSJZrL%2BwDCY%2BXbmX6SGE085MOiVquQnga9fn9pTV50hV%2F0MH6pjfdnKo9%2F0yPrAUE6nG25kLEV%2BNMXORjjXNTSpIufUYEYn9o1oDhJJL0pD4Q8y6RT16VKl%2FTOSwsRsOagFPzuytpRNVFCF6GoRjhf5fkVXVrFzlUAYOu7eORuZYQCknzXBCxXqKFYSvqXPzoXR4IOYBQMLuppP1C8F9SGAc9uV%2F4XGLYXDGP9J1QGBNRuMrItqm24R7ZfAOebNoskvtbgyt1tOJOQl0PEjKRi8AeKd7VNNbBKEi0NMLKEkN9QvGWvbXGvM%2Fe8UgQQ2LOhpgeO1zWDUkTuFhf%2Fm%2BT2V7BOpkllzoznXnUXDcmajxbxBGXwD3c1wF5d14J6n63tfXIuCHGx2S%2FEo%2B7NAng6fT0zD7Jl3JN75X1XUP0tXIql%2B5oTtiz2S48AOUGVBj%2F7QzG%2BQDJ6cw3qXp0AY6pgFqIl4nDP1LMlqwEF8OkPBb%2BV9JGSRzF8vdixUplZ0qV8gPfTuErRb8GQ1XYusVx7Hf333AxwVvtD8ah0N0ouelZufNtlOwb22SLYW3hWYdct8MSIMnsfF8nm%2B0R43Xg4s2I8NJ3%2Bc50TYnITWevCv3Xcjp72kfiWRyqmTCA2MT47OuZdjPVdnOhIBsRGeAxRIwxqMclFTQVJjZ7O3%2BULviuWvZRQpK&X-Amz-Signature=9d6e076a176ddcffba6186d2cfaa001e0745ba3d7a2b83f119f82ba0395350a1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=b7836ab7a647619d06ad4c1b86897c28699368cc53924050b446046bf3d844de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SWDERB7Q%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQCidFky1L7JiYEwxpwv92CT6FBISjlNdL4CHcEesGk%2FWQIhAOzcaVwxg0IPPQStlLOucz6m73S5abfQKJos%2BsNcEmAaKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwsGirQ0MnV2DvPJpsq3AP1NPDKghJ9g%2BuLYUpOJ2j3wsQum%2FND2yo%2FKiRT5GNdhjXr6vhkYyBDZgJ6Z153GAsikKwp7fW3zWR7M7XbfL7aegWoY2GoPqQ2IacOR6BzBslkqxGYtU3DhPAM6p8ndq5Sk8Wzore83s5U2p7C%2BpRhKTgMxOgjMKPyqPVWI9SeNn5cUlixf%2Bvc208czPsmEoIH0%2FlEIRPI%2FNqwumEKPrWZDZSAt%2B4NxsVpATyI7z1izC1GSpXmkgi7uPkc8Bqolubag6a9noBj5kvHIDYTzSTB4gl4G9cfd3ufUEN1AJ%2FXB59A0uuW3vX7g3db7wnvrNgBwpBiGY4dgFOTugnpT7ObCn2MjBoqvDhmjSPoNm6aVvGBCAFz4dc9gWEn0QAXKZJ2Nj%2FD8VzhR4RQHmDRCMsLKHWhzDCHF%2Bp3GQJgb3DJnzX5QhGM%2FMBIblrEkXxlB33sXGp4Q%2Ft3FRWzk1hO3GNrVi4mTeOGU%2B5Ij379KtMCMFRy%2FiNJanuFE%2FEGar1%2BZzmw%2FR1nDyKk%2F6abb1MXyvjToaH4RrWEMdUO9nM20cnQ8Z3aBGWn%2BX1%2FUCZGnIa590mIIyQ1ylYECvX8zHSTY6baAiTciV8JPumAE92E0d7vpBSlMgJm9emCeytvYDDKp%2BnQBjqkAbOjPkmHKJnAdC6gWz6aY3JYJKcIus1zIx%2B6LACX3mYvH5PGuGjioRmsinMN3Q1rF0oyUfIV%2BbPk7%2BNNmwyhHM58FRrdG99mUiS5DHykWm8Jci8OYOWBWb%2FCDFY8e5vA4PwJnHeptpTLhiKkowP1FfZSd5pgDpXP06j9YjhZeQjfHiup8bzFWPmPM6eeER875pf5imeb2SBst8JnhJ7zI2NDnWrD&X-Amz-Signature=537bc7c2042afabed040ad62a9687d5ebb3468dcd69fe12a3013bd823fe09c13&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663WELOIC4%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIH36Xwcm3vdT5ntiIqwOd%2Bd8TTC6AiHt7Jl%2FQFEQCUBEAiBik7wMiqNvCpJmxXsdKAegHZgJgd1Sc29vVOvEJxbWuiqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMrg7IlGlDn%2BvgQXzoKtwDY1WMVEKp8LJr15pRLWvppvaMhpP4abPEL4S4EAJOz6oWPpNpB971UYJu7pEbZqyB%2BU7wANmlVk7CLO45qseptwkbLvN41IjPzjjtkC6ugpXe2OqtijiCryUfzoFQeqIDG0SlQ4jN6tvjPDfMZyIALbi07inJ2j5kE%2BgATWmB%2F5cQdcNkjXBhthGT3sCDQqqsJ7NQGHZ19%2BtwA8SbwxgLbw0CJ166ENl9piTx7RnW5eydkH4Q8pUUindApBwdWKsoFAWjevNJvYXig4UzZXISbVp1ezaNYAaFi%2FZL1KFa4LuYXdFDtYKt7zqfk1DrGCT70pW1%2FV9mNGH5qDHyWoq40JH3nuxGD2dYnNbLzSNuRFJ%2B65je%2B%2FB3edpQYocBSk%2FlZxAHEaMcgTqjnw5%2B8rXWK%2Bg8r7myhn7mGWfIibyK8Rsg5kCc39DAGBeVv9j%2BMewdKFvDCNHJ5cB3bVDLmcWQu5PgSwZVb2M%2BNi5CoX0lr%2BhNjyQdj1i%2BLfrLKQB6CscP2UJ6qCnaZNeS0P9rGrZzcBwxCBgf61b0w9TlpEiTKEX9Et%2F7H4l2Y24aihiRZ9662bd5GW2y2YdatjVu6eNNoamFRRgBvUnjKmEe8oM1JQIT2GfR6nnnwCbmwP4w06fp0AY6pgHMmtd3UUCrN2txaprzElsOSnYBFwt91Ou74DLJ0YxBai02Kwl3PHVslDQVoPdJBAmu%2FjfOpm7ahD7tcy4tMTgwjijVr07ovgUC5cu6CY1z6JRIHfFxdd2E0%2FjyW5wh5oayn20NZHRFJaWNjWLq8GuGzwWIxz%2FAqLCdhFpNhSlJrm7%2FxN3NzQuvAaUv9hxbcqSpAk61ctz2arosU%2FAMX7dV3EO4jyh0&X-Amz-Signature=63adde596c8945bcc9d94c0e549cb842f5b9f70dfc3bef089470ae0842cccb02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46665XLIXQU%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQCWGdKRX2xdGKQdu%2Bd5HT9ycuNtgWevZiNb1RT%2Btm6dxAIgIPIklVPyn72YUSIzt%2BFexTPOZn7DkPgLD9bzinc3E%2FUqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCC7Y8qZEWxvJOA%2BoSrcA7IqAkN%2FMkImFSMWIUUVzaDLixYXxE6YuEu0ccWuelW4xkGD6gCwaMB0qrFxV8dVzalw8A5t9MbNzm5QlLhEFzwhoT9Eg6YRIYVgrDOZzKJJJAU8yWVAzq8QfXiB1vviSlnjbB7pS9CktxtP3mah4HQFE3xxhJjnECQhPMuUIhtbIzoJIuUGWGENt%2FnIByo%2BUkhNdEzXlZgdr75VDypSUGjtODFyGsK%2F25U%2FBSZbXAgCjuYLdzL%2BL8UK7d4hzL6xcwg5baLilmqQeFblKNeguHDIYodzI02Hj9kZ8q9XCdydP%2FgpWT7gbXcroX7tEcsTStqP7XW8x19V9b6ZQCxrldR0MSTYubh0s9Jt9ETbE%2FFUUuI2nvnMuDdVw6jSxlWzht1JGoTYMhTTA7nH8kgeze%2B02zvzNGS0KAdCYkYiUraE9Y2ShzD6UEcidYuA4Fp3AeA0srETs9dmwgMQ4I9LBTMDnUngjFSiyZPbViGjd4%2BrXRAKv1miOT6771qB2FLFbpqrjb%2FbqPOuPwQn4E%2BiX7z%2BhDOmY0BKsI%2Fuht4TICtWtXAsK5gMfcL0fgf1qbWnZv1CQEEKc7%2Fg4evjth8VhSGKXFsmjI0JNn4kx7HN24KiDY0nuGO1WLeKWyMjMLum6dAGOqUBvBLlepoh1M%2BEL%2Fmy%2Fz%2Fu%2FkIN9XJjZz2GQrkkluE2N58AkEfNvnXwGPJloxF7zD%2BeBMX23r2OxEyZBiERzTtqSZSPxdj6HeWLLLSSw47StLceDTNWroIzpsthqgca4WWdjys3ZIW12rOrcJ%2FFSNP4jp3DjF6DKvrI4OQrk1qS2AMxIY1iE0s%2FWbvmOqxQuZ39KSa%2BRHaxJz3J4mi3AlVlADgsSLdy&X-Amz-Signature=aa1768e46525f9a15f7fa99a090776b7f0298922fad72f3357d11a1600750c0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QQO7WL5B%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIAehli10bKXLNMtIH%2BN2v4skvtoLeAeOv4N%2Fnbo6%2BqClAiEAtpSmCyRqzns9goyHzhHhRRtNBeY19s2cnppiXjv51fYqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPlPCWpzNCTeLJP74yrcA9NT2i7R%2FfwoxGLCrMqulYLt2ZqneYCEhmV%2BSwfYK0C%2FUIreUx5KsJnEyI4fy5d5iHcI6VDYTR3cjSWF%2BdlbWsY81U7wa0eHCEJTUISvvcTeUE2q6iBbg21wQ%2BJDM0357HcqXz%2BlcL%2BL%2FZGhBqCSX0chk9KFNvsNEiR34xl7P7FN8OOTiIcs9lcXHUz41YLQ0Jm6mv1lgygBlhHXvHGu2vQxertNn8LBn1vNAdBSCL1J1whT8zlFCGjmHB4ukUGVhFBcYpHaT1yS41MpaeK1gzNjJZ%2Fymvg%2FL9rN37HjELABgciN52AfWAQ76k8RCgrT9ZDOfPGK1hImwEN%2Bo3X1Q4WuwqtK1Da5f16NSF%2BmFDFyAb0FeiLR%2BOMyKmvkGt56KWMHLB4U%2BHYi7CxH310iyc3Rld4ZWEdu67DO3vBfWNDsVcGfd55mlyM%2BWmMBwvxIrsGMxyIXzgmJgapVMqNSfT4KkZUNJzsjEHn3ea3NixBdSR168Dbg1ecNDmYyCz9obRcgki7gvQ1oNYeYkFeApOC%2B72mlRWpMXR5SQeXS6UQiHvN5g0N7BdTx3w83x78HbDvo7wUiRFUZRGRUAQbz73Dc3GIYOLsRRyfmlp%2BmBkXxQ3aJ0DIKiXOdAi4JMI6m6dAGOqUBrdc6V6JSBcRdDSuTIgzJGSu7NR6c3qu9IaiPUGAVLyqUNkcjuKEBnMqsSDfR4ED3VICO5%2BFVP9vgCtvtVAhBU%2FJyhDTnl00UEPIIwbAmTEAjThdgEPlCft5rfktf%2FWFrARHNyvJh7d94rsjrs79odVumE5DVEveIx%2FA84heHVyAasmC8nUgUdXxCr2MrTz%2FGh2E0Bru6A4SXAIq2Xa2w2pW1ATDM&X-Amz-Signature=ae1efbc147e4fb375d5e3f9faab703cfa672dbffa9badb96dbf47a12c52aea5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=bf2a57d681c33e5f7c270fa5b438a545381b3e4dec12c2bb8e5f16c0f8b95b88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ2OF7TZ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041914Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEM%2BjUK4F%2BPfusQelUifAZlESQKzF46%2FXzIEuL4wlBAXAiEAu1nPwNwHW5Woq%2BHBrOYM3RdlWrKylpSW0wAujKU1rcMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLHuoabsmAJP7Dst%2BCrcA3m9xgv5YK61sdf5WQ%2BzxImIj4HbHZ0Bgl7L%2B0QTfRV5P8nwZp%2F3pNcgtKxPCvdRJNsjnjC0bWngbzPHpf5kOkG8Sb1V8d0gSrGcYk1bJ6GTE1uEqF6C5Qe5i5JHRpWtrE%2FDDKFOcUBw%2FSXm9JvLUIPrrM1Hzon9CKB3vZfhp3hcANnbXxl1JNBZ%2BRtHobnM6tHT6TUpWtBt3ssJSfPvR7xCPrI3759BmADXMNVbiXpkUUFn6cWzCCyT%2FpAHb7WeURy9xE%2F5IdaY0%2BwmUqhc9HhPS70SIL%2F4LjgU8IfJfkNFeXFEAvpNjcm07sHv5CBg0ePicSmllToYOt4WtGxotIRKoDQWfIhXo%2BFXVOzeCoxJ4HP0xDDodYeRGQKIXzYI7pnjLtr20KbUeoXIcXVrnPjF1JP9oreBV3Lvj%2BUV%2BajQ458Wbdz1wNAK7eItMWc97GhHjAYpMXSYdy%2Bd%2Fz5XHloQBwIBjn5aYNYTCPRFNuR0DDe2IgZt5MTME6LgIh6biy9zFPWaHdsnBI56yOPJ2sNFrzkSx3Bwk538K4m9qREuWwyKFbYc1DlO9x8N%2FwwNpvGHqH6BIfDYDx2t%2FQYJUomi6cnRdVRBom82XWMR8RbQSYPwHJWwO71RW3HNMKGn6dAGOqUB%2Bibr39g4taw0EI0zVgOCHXi2Ux8sGjdgFsik2mXpoDtXBbi5fKiGeFYXO%2BcbBoFbnJqfwWT2fvBn%2FtisbXksTZdnSgnYOxpYkt0Xyhd9stT1BYefhdl6hTDmMCe9vP3sU%2FNDp7s1wGtJ8RLoX3HrYINKUTT5A%2BsCO9qoBbtIWI%2FJWwETDFtLcLmfbbIJAMtEN5jld6rPWxyg7UtdjbJrQ%2BYJVJs3&X-Amz-Signature=8d64ed2de4759e0b983b243fd70e5e4ab2944ff6979c8ec5f7d28f8872c9f2b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

