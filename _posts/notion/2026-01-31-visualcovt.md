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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=d49a38f16498356f7c201038be1d73c121b2a69def989290fbbe3a4c3d2e64d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=4375c9def105b1f9702528afc36974444ad8695264e6ba8e91cf3d7a794c3d22&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=558f4914fc83ee4501d648fcaa0778c25d95baaf9f9d1a3ed57af04c6190c429&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=da496a72f53e2958ccb9359af38861f5b5654778c48f07bdf029fb3c73ee2252&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46627SFRD5B%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQDyOPOTPwLeL6fYjR42BmCFU01Lr6LpcS%2FsV3ePYY50FAIhAPOG980tMEIRYyQ4w5UW%2FqoNHKG9A4MoTxYxfWVaYnBOKv8DCCwQABoMNjM3NDIzMTgzODA1IgyPmCmFi6zPUrtfJbQq3APnBgrfIoZBEqrIeVUiLdMy6DbvVC2dZRRQWsE%2BETeVt3SrmM6Tikkma0ektDry3H5GRF0QD0Sp4JUQFK7xUK%2BCJsRtYLxf9VyVf3X2LWnqapjzZgWH2YodKic0ij8ncJZxSnAd9tmgrJ%2B0zG0NaeEovem4jqXnURNsHD7TDxosSjRoHLOoaNWkoZIBP3FWjiYvOYiYE%2FoVrbAtpucFNam0aZUeYrvN%2BXoPgOrhxoXzv%2FmK5QDQkTKg%2BiLJP%2Bgiqk2wd5C8DAaIDlTao%2FNf0AUWpiUcQSWKKXo6l9uisDmOgoqpdQQg4MByWjMl0%2F7G%2FPOco3TookbJ2Ma0QyW7%2BZvbgszlTseLeJViFlSlIIFPrW7dTguEtLwGgWfj45U3%2BT9Rj2kgvqXa9goqO5h8Fwx5dod%2B2H3JjgW%2BDBaI3%2FqX9p3RR7zcsmU%2FR1g%2FFHS9MY60sT4IjIK3YQ16ao5v9JHOLNiux9zNlEzMzsOCSGZtBWGbmsDZuX0%2Ftx0yZ5AFGxhOzwU%2Fc1Uuxejcd68ffd1M7HlwcyAMBLvC7NqccGmJabcogb7rbNd6qRsBX3QIcNZ11HcPihMGMnZZM40hSvFHZt5dWGiLDkK1r%2FOJSbC5gYEh5YkMrX95YL8%2F0zDOlMrMBjqkAXWk6vF1c44wJy5rcWWSxVdJP4kdJfGlWW7lhew%2BvAOEJbvQcfXRzzNbM1rk999I0nGW2LzTdyDppxVDM18ZFeOdKbvnm43z8RkNri7w8oFKHvavVx4dLbn0tBYGYJpDHxKyLJ5wKUnMjrmIhw%2B8obJ%2FrHHwyD6nAHXl7EIznys%2BgGb%2BLG3nfR2lST0Va4VXdJ1Hi7PknLPICKb57TDjT7u32sgp&X-Amz-Signature=690d8b03193966a801321cd9c8d70ae51adb915fa48ec97eec242fa612e45b14&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665NZ6SKCY%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQDrneosZYQeDydXE321LdNaQV%2F2hzyg%2FIVAfwEo27AIPwIgUdJMRzK41n1K0elSBKRyYxTVZbSHHYnW309GpC2UB5gq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDFdt4N6dV4q7aGmFxyrcA9zl3YfKRgxxhbBqzqQFjJxZVXu6pvmCwTJHQ4Np9EmBpNuteZytK1C%2FW8Ko4J2K2X2UPrVIZ3RW7hWe9z5epKDZErFbmXfQHOyQkntrqS6NeWOcgvoMtSgquPw5tTVrs92q6nJP8HeA%2FUoPqNkY12FrxpqU8ba%2Ft6YyW5iOvWYoip1n9oi%2FaX%2F9eYty4Gf6W9jkvqJHg%2B%2Fmu38RCTrZ6f5KC3S%2BCCKP34Vjo%2BlCgu8wxMvOn9rG3tlwCfuZgkWgUk8%2Fq%2F3nLVZze0hitljGSKiw2buXs5sOXq2pEYzEiNfhbdkwvN7j58IwF08mPY%2BF2DRTvu1epL715WrmtD6ORbKmZlHNDnUqlrj44Wt%2BAzHo6I4SSzL3r6Ss71czmzJ4PnUDVawOwR2gMcgNmHAg3AxVO6%2BaaDBAbEMYaUTC0ly2dh6deSaTBgIuUDb4VkwHArMrm4TorMo5XSIp7U%2F6fOOTmNob%2BWpxLWaVIxTBARtTSZxO4ZRGwPbXivp0eeSHKDUurca4N%2Fe48Mis0DfkM0jYPsgAzOk6QPkDJGXy%2BN7dZlIvfWbFkFl51VN9cdRPzmOQzvKHQBYE3cTwC5SkpbEMHlYUyJLsGHN5An5ecfzTdhNKSbtsVRoKFKNLMJyUyswGOqUBnKJiHr%2BjbfTtDxnH5JXiEteFl1vW%2BB9rykOtg3Ag7Bquq3n90eXK%2BiZlmwtR8L4NUd8Vzy8WIi2u1Q%2BW67sY4uJ72S8clkUTDPwbSLTaMRSGbeHV09uacG3es%2Ban6s6eB%2BOitQIkookAAPPVHYNwHto9ndA5U60U98xpaI3zlyT%2FoZieSWhY34H9rlfkWPBF0gxtP8FBfFXScYXXV32vhV8tWpyo&X-Amz-Signature=24fe001ac89ea14a29d708003fba17684c707a19fb011dde28016805bb89a37f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664SL7HHMX%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCVuFTg%2FSjGgLmnQrfjRr9Xs8Rz2SPe1PnVlUtzisgWxgIgBx9RyideOXvRCrWq5C6CHw7y6yyJIr4lfygAF0dV%2FOwq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDM1WhMNPxqkY%2BHlDQyrcAyGTlzA2s%2FiL4JLXmVcqOMnQ8kJ1whXRWvg%2F91sc4mcatdMo7nSHFvlABOQD5%2BHvF%2FW1pzlWu%2FFMtwow%2BYnfPAesFtp2wah2LK0Ml%2BFs%2BvV3zENnjVM51YXUBsYxP6brwiwP2XThnLfQtYEiEOfFLM53rQRZiuNB%2BU5Mt8bfVASFBLNQZ3t5vzgynfPm03JK7hhZ%2Fz5qkkAHHaOgeRHsQ4suF8l3FRM7NJokhYrEBWtOOVOFj5nU6HcrxlctsfmODaj1u8ur84621ioyS4gVWMc4hFOKbVLWK8wvYu%2FWpCVNV1C67KHOv1aOkEkYECXYDl7wV22orAK4h%2Bkp%2FcxJdfOuKEBevZpNlPRPstqd8nnvZ8qRLRu1gTsj7KMMXo5cJ7tQODR%2BUVyyPsWbLfbil1hOWtLzlYOEiiu1xxW6tyluyI9OTKp4%2Fn4DtgGrAZQ0%2B%2FskspqYH30MIvgKbHZOVnc5TnYz2R%2BWIBizg8mIRcwVDArcNA2ctp1SqUZRazyba6N%2FNBn93PJIb5AR5P%2BZ3EyMwYzo7UzI3QueRY%2FeZdhdlq1KXjbPPE3i%2BBpOdfeoRfvKzQRN3OEyTSiXa%2BdIxmDxNSMN4Nr6NHAden36o%2FJ2Qdl%2BwQbMjHv4gSbfMI6VyswGOqUBXcdcNtOaulRkGqBw4XIAfyuMR5%2Fcc%2BtORlPOTCMcCIc%2BoxHVOCfCl2N5wB0UaD6b6mrqMjWtAQ5G0K73HvLLjit1zbGvi9Rj2bMjAJFroI0E%2Bqjrb78WN3PakjvjOMTkCqPc%2FzMKCLtIiEasOnwe%2FMNaxAFf7PN%2FDGY4OYGsYgGjm2xLDJra2UgxjKiYRwZnhgPXs9zD5xbNhew74eoFVa628jD6&X-Amz-Signature=0b91b7ac1cc828b678f9791f81ed18c5a171b9bf63f3047214ee6422ad7b0321&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T5U5F5HC%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIAGlMKA1ubmsNYm2JHS8NG0Grz2agMUNhCF9i1LvouhdAiBexwA4oNNuXOz4OmrSmQMBg6j0KauQP6xZVnF1Ci%2FKKSr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMfYmEu0qqtz%2FNcyTQKtwD4wCIYBqseVAWiw%2BLuqxyWCYKi%2BykDt7H9XSNlOcum0cvsCwn0eCH0l8FSQTDcfKO2D8BYIaTT72YoMnbGRZaQ5wDenjtoO9D7e%2Bq5iX%2Bs%2BQA2pSnhkVocrdVEvSjZYAFL6qPHO9Q9c5ygTVQrA8aOs1CGo2xX8k8QL84hob8lpDyp%2FDgFothaU0mmQAF%2FAzzHK8yNuApsKaUeGO0GZii7NJmvINMxr87g59K2PbGbYXOfPlibrYpM7XccqkQYOoTgJLy21zn08DntWImV89RF5PVfe7RM97Z9LxQQE18TpQLrEj0qdRf7hnP%2Btj90y6QO3kWGfSmFaELDDruV7JodFFamq1N4JbpX0%2BdnmGzEZJ7NZLiVqWHZ1q2HyS1D21ZuFJDL009Rx4EzKMR6rHx47FJknN9mtqsVahkdG%2FwzetyLr8WK3XXCJlUJfau6wHLbVWfeIsUYoDdtukj4tTSyBgmWO4CFsr3RTRYByor4H50LOhESQF2fGAfuYQW31zfGBlAFddunw1acCZhFCx2qwVu3VQJfQywzkvH9aXAty03beQcorjpTBIw9fdtTALXxuAZIbBD7DQiQ4MYg3jfCuspIc%2BOzbH0tS%2FTERr4wT7FTH2R9UQIaObBrbswk5XKzAY6pgEJUHrWq1e41YL0zoYt8VNwrX%2Foz%2BS2osvI1ZZtcwZTXD2GK2soMM9O%2BJkS1pMuWzgg9vr3R2dOKh%2Bem%2B5M70ITOxR%2FXLf%2B7fDCRBq4hP68eCatDTRetOW9eyttnO2fMiHyITznwUhsI8Y3JkXEzGJxB1mTD9eFsFYf68wVjBV5raNOUT4H7SSXwe90M6A7Eb8xHNVweMgvEJIzDSW8kRD5p2l1riIa&X-Amz-Signature=fe13a5e232ea9dbc96bfb76483ddf01cf8062ea413d2164b95a2d3d837d71737&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=8dee860bccbac1c6064cc399af1b031009eb8619d8de1407f759bdefae0b05cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=c7483ce8a5843ed17bcc1c8de5cf966c4368cef9eb6d7d7afd689700ee3ecaf6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SEFQPRM%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031912Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQCXubx4n33Wm7jSEocHBvkZAe6%2FIp%2FuOsNrCw7Ig78XFwIhAP9GJP5ok7dqZyEdQycGm1e2kjycXkjWw35ihm3hlSnbKv8DCCwQABoMNjM3NDIzMTgzODA1Igz00Q6Ks%2BP%2FBOTnRXoq3ANg5L6MX2obXpnZIJDKZ6JvCzOUtwc9AefKUa5%2FJZdsuPWHVAzUa8q721gM0sBjVudSncNweMWpm9i9bCXowrsFDohuYTy7vvqZG3B96I4MPLY0s%2BmFXA7aXq1P1%2FJBWIudSk5RZcwoaNcsz%2Bv3ZkGrql1KsqjRNUe1zVbvD5KMO63r94MkHpnFjdO8%2Blt1IE6TuPoaOOTALmGwKil0BTqSlQIpJSn68ODWSO2ujgPIWhTco7KnoZJDtxUh%2FaCCR%2Bp6cxQwmtcr0E9lkOFA37K7Bz4SULzKCUd9Bo6NRillElUKZeqRalXg%2BfeLYp7ijYJQml2725O%2BwZjOtlqquOXZ2rdcJv9JiJwmgBTLsS6FDpVn2Au7kOWM%2FueZy3AtaIlg4c8hulE30V7HLn9gS5y%2FPirNMUUp8XUTfoMt6I8kLZnaKvH2jZAbSPiMLJSlHsZaxx9ECJWBkGmtEpO8%2B5xT2kP1DKurnUardRtjIoaYxzY9XCvQGj%2B3fw5VtaXlhnodm3vEAYoZxiFEhgLqMc8EaS%2BCXhhJTmuFctRATJEId4hCaJXwqGNknqimo%2B%2F%2BtR44iF3ECWch8kMCGfaAkDe3ePO8cZ8wFp2dFq1PS2iSQ28HAVGMVi%2BZKxIv7jDflMrMBjqkAW8VtHdZsFIOTx8ytMe6zl7HB78tetywl79D%2B8GMFlMiaVQB57pS08EEdDx0hN1OVKw1%2FIUnoozkWBS6P9D2WSxZ%2F%2BiEDy1Cxa7vlfLc4uVwWIavqGsnsnJluj0zsgCvpwYwH8YfNPN2mK4rMmbahDaBk%2FUabNjQ4CAjf8OAak7cmfDVB0CqXYLjiWiDrCAhKitICg%2Bq9u0c0wOCNAPEPtloGllu&X-Amz-Signature=9ae1be138415842ff18a721108d548a4e953af545bf63531b29a7ddc8d0dbcfa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=8dc03ffa43d45d6f6270f4eb2a9dd2f1fcffe1d91b2ab8979a7f374953051316&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666ZLWWG3I%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031913Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIDrwloXSqCaA3rOSyBVAx%2FmgSuFR4nkFygGh6hv186q4AiA9VwXA1UBwLjNzHHoVUDME1PitDFvANP%2BgndKHbOouRCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMi0jm3hRsXYi42Gk8KtwDMtz8wwcBMLt5HXDncjWgoAulm%2FGlg8C423Q%2B%2FWz%2BO%2BygSvTeWDIySqbNgOz3t9QYh2URxr0c4Bd7lDtXkOR9JwYye7oIZw9sSfEHz1cbuzMSxD3h6Z6du%2F%2FguYWti8%2BSXSezCutY3hY%2Bw2xJ2S207bnHe3JLxc%2BtoKzZX4sU5l2GJzjJ3AIkrln1kcJMHkfTxLJimJz%2BD57hv5seth9EwMwMabYt5ST2oHoUpj5xePXfGt47dlXFpMurHLIX%2BrAuWWvKwMp8Bmo1k37hIs%2F8nO69Q8Ke7sMhEKEFSBWmcZ9NEu2xCUQkv%2BTfXcRCZj%2FXQWvlgY9r2JEQEkoAjYg8P1uD0l5MeODpVOqgw7ChRaIHiYIr1A3qIVWW1YnoJgLHUCdfBIeFKyQwTbCAG8THHipwt8uK64Qrx0aAxAY0ZNQ%2BaoxLd27cTZrQQ0ei%2FZnvI8iLBxbIKElBj3Pz3l1djV1cnVFJ%2FhwhaWY1wb1Zsd4nSjKCwAkfdM4%2F1rHnlO3OGXaN7BLI8TY96NJZaGfkJP21m%2F0Bye2ZVOVprMIAsk0UwS%2BxDrUzaBHwV2kaxC8os%2BEMnInQfn4hg6bu130kT2iHt7i1t%2BJPrLxNfHqluisUchG2gf0g0ZkHnDUwspXKzAY6pgEIs1izLZO0q3%2FeIyLW4ea2A9PIqdBtGJuIUyQLpxPNW4axD86Nb1fylXOf2p3oWRPvSU0qws%2B7eC6Vx5gbzFbkZjSD41dHvt6YL5YJKA7VqsDZckEy066MVC2P%2Bk%2B7k7W2oXwuXjRMTIuFZaZE4wMhg9T0QQrUWEOX0lfMzbJyPIWzNkTcdndpJx%2FvCfUhwK9i63sFF%2BIFZJNzRSpHgcYQya%2B%2FLk%2FE&X-Amz-Signature=6f784b9af88ebeda860e83692874cdeeba38e04dcc2d9751d4c4cde774dc8c25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S5KWHDCK%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031917Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCtJLbers1BS%2F0A0i%2B9c7G7LnaqQvkISedxSIfAdZ4dqQIgGXrxJPvT6vZIs%2Ffg8b7LxC4PPEfffM0Vyy2JQP1FC0wq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDO5NNIuTBb6UryMc3yrcA1OJvDKBhluFBQSdM8Q9pmY6URUqD9bohD%2BRm81boDY%2BiGlUW3i%2BmlhONPppi1C%2Fm0yFwJblq9iWIHTLK7VSIxvgAniCPfHkY1WEdio%2FKlv0P7dkLoCFcjVsi3F%2FjJRBConzP2sb1%2FZ%2B%2Btd%2BJ6Oe1K5bmWzf%2FhB%2F2DIAcXeiclceqxGtX10boDUWGASpwP1oln%2BH2Ap4hBGmCeEsnSxjgir%2Bz7exh53SK2r813Qg%2FGNknvi3TVfl%2BfDzME%2BEG624M%2Fev5Q5Se%2Bkkz7AzVOjuDm8P1ph7GoIC6%2FIzE2o3Bcw02x2yJj%2BbAnWVO19tGWmxX5nHZKESDcoqufj8NzpYJ6dhSj2WYPSBnOxckTRvnbAwm7%2BQ2b0PfNh%2F%2FnovJAqUN%2BpSmEI6ogY%2FwBAvxopCOOeMLlnCNcMPpX%2BysDZtauV0uMmXKGvd05IFQ9nfPzrL9fvNKRKZDRubPF4HEg7rQqSa1yEGj4yLhAeJwhyde8HIpu8uUrwPMa%2Fu2YuJAO%2BtDzJYWMgD7v4n1dps2WVwAxHgGIc9BS6E6WcE9BgNlTqaLjboIynb8zsgOgk8icYUD0A97spu3NjENryvtI9y4yz%2BBvy%2BEZniS9DsPGRNVui2W8enoo9m8VwfOdT0MO2UyswGOqUB7T4P76IDbVSXMpNnIrkbFXXn3qAbZWTzGR8ChKOfTKAsyBZ7yOSIkc9Z%2B2K4IjchpyENHAUNPJLB%2BbX%2BhZkYBjJGP%2FL28TSu0gMeD1ZJh6BNiTW1cTwxRf7lU%2BXoCDzUTEwcsZJX6h070vZRja3c5gDQdXLgmrGUAWEYrM9ZZmNAUV1wrpYkCbBtCV%2BjsigHGyhhOhgSN3VfVhHaQlDpphenLSYy&X-Amz-Signature=7a24435867a7755e9f5ff93f7c545fee00e9f8ede7ceb089f0a2acb36218c40f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665FY4EEBT%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQCOtr659Fv2GwO%2FF3YzoRFSffmUCf5rGThyyHJI5ZzKnQIhAM%2FS1XV0UZM3POsFAvJ7dAYQRueeMP7Z7I%2Buib38cFmJKv8DCCwQABoMNjM3NDIzMTgzODA1IgwCpBq0vhWnbCiAK%2FIq3ANBjifGsGO2kofYGn%2FD1cUHhSFQV%2BiXC4U%2BEXjxUhDTO%2Fu9hLw02xbXeSyNB3P07xzdgSOw1E3amx0i6a38bGcHTYqnJCbZiY9lxxzcO7wRVoaZ41%2B0b9ajlNXv8iYFnThbnaXjvvNk7vHfonMpiizE7ngK3iVdzSjOeFIKYPdv8DgcMqWgmDckyI5P5AyEON3Sk5%2BvK2M8xiL6fUynHIkuud%2BdvBQdZlyN0gU9jphz71fnRSunNr2j3tS7a9D2JxevShslpwk%2FXfb%2BTqJjmKHfazdbfgqvVZIKr8R0%2FSdIeFze%2Bcn88XKfLB2B%2FklhqiirGxP18QX3BcDwhVgukV9anDD8KNBJ5tE8O2AHP9A0l8IiwQLPVOjVYOJO%2BOkvSA6Yj4ZnJTG%2B6bqm79s2vT2iZFnFN7%2BcOYfccXgcMZJFpBKh91b%2Fo%2B3S7S5CfWeYyjFZq%2BzzVic3Fs4c8XCCuUU%2BqWx12%2BXiQJkNsrYFbnecnh7NZK66nn21wSM%2BUrg4KZOOc7A9Hz3Cy6%2F48AcZsuwq2RkXvsvwkA%2FZtaUSQOMkvm1onvaTbGjA2kWBfcB20Gr5w90PlkSjFOGnZvpYTDnAEKgcV4arxwLJbvpvrycPtTd5W%2BYOwjNujFfWQDDOlMrMBjqkAZXLrH560rS9m%2FiiXXQp%2BctVX9UWhyLqzK7QGVimrrQsuDtTUqruKK0VuN0FT0WvMuPrKH0iksuEgcjPBmyJ5R98dt4ArTnYxBiFD1X26AOXroDTgUnT8TxALv72kSCyjuGDThCtCfWa7kv3tVqcSQQpaXopa5ObNcaPmvnMTNwtXD6ZiUL3nKh%2Fwx3MIiT82ltG1gv9kwnGRRno0rOER8aGdkRF&X-Amz-Signature=bf7df350b0e91e272e3e733d1a7cd97a7f3441a35be191e3ffdf9567da2b2004&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UIUYNZMC%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCkOwb1hixcvG1YxQtaCKCxSPqV2%2F7Q%2BsUqwSMIHm4gkgIgH13MaHVKfToEpGuyjpqhajRmYZFPoUNTXp032xCYVbUq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDKrohWXJDDBFFL6styrcA7ZZ7HdEs5VM9MpKnm7AeNsD18N12U2%2FDhHxLKraHK0I1W%2BqMCvZTgY3%2BAGabCJjXGgmE2n1tPN7Qvfq20NqBn2uXKKIvHEF6E6kn%2BkCvhXh19fLqt1akkkKl9cySamgc5iR7z5qxoBSu8%2Byp6R4wOBe33cDFFRdgCGkv2fq3kRTIRChW5sx4cAdjCWc18dcXiFdPMsC%2B2AwygD8lYiXbDRjGygYfHQF%2Bp5fWH3xYVKAGAAlEgaeH6UXCMyEGlcv7qwTTXIe%2FEu62hA4w%2BJVXFNdgpeJgdrj%2BzJOofB5KFWD80C3UYyIhbUXrZVcZ2bp0cfepanY8xMVLlSOVYZxqmluACcNjgZDJ0y%2Fxb1kXbR0jkIpSn8siqKa3%2F%2F06nJywr2bmrWrmHH1xxVHLzcKbjvf2n7Z1rvSdzwq3AwtlCpIH9cTfPmfOjb%2BSvrI6%2F%2F%2Bhq%2B3e6j9Q2h1D0asZoI7BSqXcW6KAza3HnyYke6GysfEl%2FTTUOVpMRaWHgemcwFR16YyzUGNxozl5Sy3vH%2Bf5NtdrbnB2BY978AedcHFPr6eyorU3YLBNTqolXN4qpwsfbH%2BoSO2oRce4%2BitcuhiW8hGihv7TtyTvRwSjgaUU2X7CFzG8%2FcxyadmF%2FDjMKWUyswGOqUBQ80NLD%2FTjYEa%2Fa5DmrFEyvB9o%2FId9PkudkyO%2B0qYWekvNlZkrG4VsYwHZs0wueGNokmfwnIDOg8efyL1aIOjlROltt7xFPaimCSfAi3%2Fn4G1ETeVx0s7AdEcGLnGPm2%2BWnXEdae8mNzRgpk%2FYOqw8NmV9njF7okCpfvUDY0MSepZiV2%2FP3Wo7kgfsjBOCWet1XIeemUavRtzUSGzzwtcz1G3k5qz&X-Amz-Signature=e7276cfe5e116a9ea77dfa388970df9ed9167892bb370767a6f7d9d1d023c55e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=84f0b112369794fae7da62ecbe374a3648eb02980deb43dc63954029a4a8700c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UERR4Y4D%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCICmo2gresxgFn%2BHc%2FEcLKnVFwDWfgCTNyQuoUXIT1bF3AiEAvyVJ1Rgw3FJpyN1KUTDMtGmM92JiPF8fWcFEXtiq4V8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDE%2FW4hPPOjLfNoIN9CrcA%2F4p4X3ShWObCQVenXsyAOt94iwQgAdNrlUniuuFkSdGCCS5jchEjdaZM%2BYTGLyOczlvqec2XDxqZEzVOFSB%2BW1Pa6zafklNZ5yU8G4C56PB9Zoew8jQ6ZwYVj0GUnQwpuaffYKb2j%2Fb%2Bq4j9F44UTHC54fo4PmX%2FaVC2vF5z1rVQ0rwqDSg4ybGzgbqj%2Bx57GRrfPtq7IvIoRMPLJf5m3gqsL4naMQDI58tNV%2BPw5QqxGpNxjCrYKH4PtpTxOowBVFLknJmPvMFKvMeolSAvbHw7ghGa04FUlBSStRCJ9h%2FaNuIZH0sTbaNOVXDDdBPjRxPsyw1rxbjzRGhYqUcXqE%2B0gBdqsU0cU796RkdDg3KXoSe0A8ci78JcuUocyAR%2F8aFMxidkbtPaI5Wvz1x%2BKFMYuy8cL9Vq7erEx7zKGjbNHCYdFKYxIrX8Ve0pC5CS3P7oY%2FJxoomlz1lnVFi%2BfeLwhfegeqC8w3nRNPKf6msgoAfwh91j8Vx9uLZEElcanO%2BkYuda%2BH4ASc45JBknBTKnUJBNztJUlzND8AejYJTdy1JmADVHEMvGMZKelC9z%2BCr8tfhIMfA14Zs3Nul8vll8Me0XKhmU70f87ZObcm7O9Nn6tzQEwistGoQMIqUyswGOqUB4QxRCwTosyc%2F6hGFjyNDjDvVnifyDZCYtY87G%2B%2Fmh2AIIJNP7SwU8K1e%2F4OUQQ%2Bnm3swykYY8OsvGGO2C%2Bzu%2BXO75rfRIy%2BfKP4fiZOCHQCPhQWos5x0llfFllbgYLg5lgYzkTxW4B9LDMD2XP9L6RJjSMtTdyEZzAs32%2B0M%2Fai0Ar8Ai4bD%2BrAcwdVxCsuAOs0HZIoeO4kdN%2BSbdnT4U8hdn634&X-Amz-Signature=b3586cea11e9274508c828b35dbede78c9b5a383852dce795553f9c5464de32b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

