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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=e03305a07f41feee5d6c4d7f76c7bd711e976bd9d80c0a9821940817f7577dd7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=2dbb58583263e586456f59c1f87870d4968fad443c2ac0ff27e36c3d4cbc1ba0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=b2397892c0145a6d585aa0e95f86578679d601083addd5011760435e4d77288c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=d152aaac341462a27a0771737ca6487010a9a3a3644e41055a3d8f73f373ff2d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGFNSZVD%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJIMEYCIQC%2B6SOnRuPxPytUAS3PrAMwaMm8yVtpGXFyTTE2WhaG9AIhAMGJTKijpOdkZCfOTekHAnzm%2F8zrla0RBbuIO7iZzqdnKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzuofdwKgLkCluJLFgq3AMxm2MJAlEkpZnPmq9KclTQLy9%2FfjkM4ZJG9aSWeWOVAobmj1N%2BX6aMfTjLjNPdmMZlBTCiGA8wS1GQuMEP9m3kUHQfPetEgIsg8R4SjPVFc5BCaqmPu143m34jHGiOWGlbFuYwojBtZGyVXY7n5akJOqqjm2nJN7XsM%2FhWWatLaBtZCyTtHUxVRcirqid07TjCGKqGU8IOLw4Fi%2BQK%2BJu46Zl7PmoYIu9wfpwMXfQTV8yC53ZNtq8fJ9qeZkXy8SsLFdYU9Dcn6PYqwXcSPekdd%2FZ2ESuTbeccJX2GIfawNRnD%2BNfJjmrzT050bIOcrSVdkwkU2g5KqF%2B7keHcIU91tSGeXYYlT12BlT4V6SY95iB0R0XCpfLjBIToOtRykG784WI%2FHOLy3DCFzC%2BleBV5d5kBhM4WErzyhLBxzn%2FuhA8ZCIJXDh2zaMfbzNwhFe%2F1LA94aH5lyL54EU9jyj20osNr0do5mwcJJXMLfCP%2BOODTtI1t0QnQZ9C1xfJEbsr1X%2Bp2snFLuYZAUQsOoSDQU1OYNHb65w4o%2FtRgFsQUUgUvxl8dbMj4817IJ2m88BvB7efBNDPFDI9Mw5YXHPntUTrGVd0tyXPc7i%2F1jl91W%2FMBQkkrni7s1L6aQTDk6OLNBjqkAa3Cx0HP2SuGVtc5PeJ064QU2xqtxb4lOy000MMBZKmnFwm4Hj1ZvW4tWyaw6hyhk%2Fa90dtVGRsW5euJ6PWAYWUoWPV%2Ba2xzIb%2B%2BtcPhFVvZiZ6Bglhp8LMcTxO8eeGVpY7N%2FFv4zHrcx9LZ%2F07LF30rjqNFyYnnwAXxeSagIKklVQh%2FtCl1uclun3WbQ48SSM4qCAPEiGh7qlydxA4G9pCjbN12&X-Amz-Signature=5502897f40f8169994e68b95d99fe7bd36eb03e7d0af27b7e57cae2228925d27&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YD2MXJ25%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031351Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQDNdnMkX7trQuZc24%2F5hwR2Zt8EFR3329MTZglkmPUoZQIge8IajN3EQ58vrGq%2B2baaQw0dvSFzZOCTM5FVHHfTVacqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFlTKjBrhl8jMHXwwCrcA7b4Itr62jCHgcnQgdHKPwkPElInkFoyXjf%2FFSWC%2BY7agD%2FD5ijkxnMTxFdC1B9Yy2azXlxjhbnZedGlscpUIixE%2BEach%2BqQdhSxGePALdPDwpWI4OTvdx8S%2FdmHjBta8rXNnO4cuqBRqT8M1ZTlsc%2FDP3tcFMjGW7MeIoHxgd53wr4DXxflp5uDd7iS%2Ff98xiv81k08A9plh2GUyzD40wpFxvU33x1sdq%2BKo7K2kb0luQhtY1JaIU%2FYRaLTijyQV%2BgZMqxdktAEdzVX2El40BBJ0kEGNVIrLUEo5kjCQfylmfU9UrBxk0fI5dIuw68FSPivMpXHajm3Pkfx3n7J7R0XVpEAYn1TxeXYaNFMT2MAKRBkVbNWwvzs%2FsyKDE0limcLIhZDqiXDTS%2B4m1HuSsFTOW7fiVDULVXwwB%2BfnYaKTeq3TxeyyOsfNwPOEhHkGvljfkCAc4XiIwrLTDcxkbcpwFRG7452R%2F532L4NZtheG04T1M5F%2Fn4M3Zdz3hkdoVy66jFcpyh3ZGRVFdvlwY3xQwewnurvd0Ea5N1AEtP7iAw04PADRzcB%2BL4yXq1WzympyVhoa9INJUoeRNahTz%2FMSkAR0WMqDZi%2FgjZJEqJJWvoQTTGRwRfEVrxvMJnn4s0GOqUBKikvjeHmadqzt6t08sD13ft%2FJYyw986JeP6%2FCj2PsCErZ1R8EurzE3as3L6CkN22qeMq%2Bni4tczrq8A4nmnLkdk5GT5cY3ZgNjffdEj2Gpufh4GgadUFpPaPhsUwpLgkBIHfLuRd%2BF1gi5IIlBNF0elB1FEIrO%2BulpRXJdL0XSMd1ZEzWKODqP1B40rs5t1dBjjQXXzhEq96W2sXjg6uLFCcHvt4&X-Amz-Signature=bea5756469470abcf46ee9fe577f1ce548efe1046c58c6b3947cafa8b00e8b33&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z5ULQWHO%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJIMEYCIQCgtZIrLF1oM6eXVizqJLAW2ngzD0XrPr3Ud50Tn0kMyAIhANYEk3nOsft2H6cJRMdNe%2FWCjUCvCUEncuC%2Fe400QyYLKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy1%2Bl7znR4EY%2BsZGdYq3AN%2BXpAIkRsTOU90uLRrN8OwYo%2FLQvc0V7%2B5Xo%2FNFG8l3YHW2c81SAB08hMjz4GgTpNiKASl5K9wk4HWMhARXIgjYFZ2FyNwpYH%2FZYtYJmWRFh6JXYOfsyGs3ka0iuOeBNF4JcyYb1W3CmKP3i6u%2Bb9Et%2BAqAMmAkN9og5MI2bAfcDoG3oJdCacHd0YOq039OCOF1AY%2FA%2FxCDXf3C1VtvyFVdn5ObH84LnJrF%2BVL%2BDN1On7hhBn08GnH68lgE82SNmOi8fN6jhYT8KF99vckXdxoxGso%2F9sOPL%2BsBo1HDACXVjtfDNeOwBG7By13HdPZJt2OC%2BznLSmzavf8xSHDrucyF%2FsFJF%2BfFcP2sNQiypb5GxZmuGKcSDGwYiE9KBIGKcMGe5LOA6Vtblpas1APSg6t2RuxQtKuUs%2BPzROaqBiCjb8WUqDdvA%2F%2BClKH98UUEpSIeXeXiL2hnjOFhnYWzaiheGBtC%2FfpRmHYvYZeROU%2B9Y5S8rElRtT9Bz8Df8KqW0S7SvxVvve6S1VK3OFvgEuAObwTm64vD3Sqav1%2Bq5ANaZhTjhvivzF8NSTOnvwLmqym9orCaC%2FSrRIdDCglunIbabnU2Men%2FyeNzYE%2FWML2XCDMiO6KKJS1rWtr%2FTCW5%2BLNBjqkAYAPu%2F%2Bvm6P8mkfeb87XUmFeCy8SE4jFLwRiDC0Dm15VTr6IxHOxE1Nr5DOPvyvTFzuXiIk%2Bu6LY2Kuqiy21wv4BRxSHbIKXy9Rl8%2B7r8wfX%2F3IcakAZrQ1GRQIG0RJbvVo8QHAzffIFo7MO88TQE3tous6%2BuZsgKH5TcETM0JGiwNV%2BU112oQBt28kwQcq00OxIQaM4LxJ1qbJe2ZufVF18eG0i&X-Amz-Signature=90ac34727806453c8c8a5e7b5024c7c6ad618681d4dd063d47ccd5c8d8c558b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S5SDUSMY%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQDOcO9m%2BvkMfyDOdPcKbcq7oZMFdnYLZkdJUdqh11rsXAIgMl%2FIBkLncxRYfrGmPlhm0N24feS%2B4F8wfxCy75cREs4qiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPWGyjnuv9Ijur1vjSrcAxcpQtIb%2FOVJStE9tuIfgfh0sE%2Bsy5ZPNxV2kThYGrh3nuk3P8gZ46OfEc%2FNtWY7EtXJBjGoTM2B%2BW3a1PqyrDEBpa%2Ffi%2FqfXAdR0Xr58jNYvUNqKAEJTYyabVftp8Wr6Lk6AbRYvUXktAcsg2Ujt76acmpT%2Bv2lOOHEoytQFKxGXCbtJaU4fwKamjDgHQfHckb8cqMRrXukUwzW4ubj69IhOUvAw3k9blJwlLA9dgnnDTu4E%2FrNoXSNqMDWezFpSIOHfAyZQ0MdrYncHgOnNFwhn64pj85dnM9ob3yTCPo60W60NqI3qJnCVKOr9JMD8%2BOc%2F16uIQgJxiuVzZ1NtZg3vN%2Fp14ZPKF%2FkUNeur7OVa%2FgCvkwr61fg4SF5AocZa%2FZhEucN07aXWIi9ItJyDbZrwKuYPiBkmpC%2BmABQGk%2FWKPqAse4yYyRLbd6dkDUPBWOmacyVvgBRbke6Nz%2BK80IVx3dmS9cMbwlu9X%2BeinUJSgOMDOk0fJ6DKtsTvds%2BIbcCCygN44yX3zF1beVPWpe8CQNlNIfb%2BxOApRBMwAf8nnJiD2OOwnInW4l9tS0tmvKjGJPBF4tci8rTeAdg7BkGNhB1xJ%2FgAlfs2HAPfvBWF3tuQdBnQ39EGLsPMJnn4s0GOqUBz43FNKUBKAsZdG2Mqw6IItnIrOvU8Lh%2BU1AzPZlKRKmDYvyD4RQ16CAu77BvWo4uZTnA0FhVaMV%2F6JIRfmV1nQtRyFPKGhY9fwirs1j8qOohKSHAZ%2F3%2FfmdD6ZdV%2F36fsLtFGMsQZtwyNKSqXjfrB3k0mXETIoJmCV%2Fy%2FklyPAUyOrn0jK8RbsntC%2BZbq9ex3jkbfrStuK6zO8zf9wR3i%2B47KSua&X-Amz-Signature=e1d729542cf01430a775a1afb1107d212ddea852033ebc26259a78d3e368ad10&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=c8caf2b72e602a6946b9031dc26844ed79f01711a02bc664f45c0f08a8cb24e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=5fb7549e37c010f8106588d5fc81640da5b111395b1bbdba87b8e886484bffad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665MVTQWLI%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJIMEYCIQDKVHVOP0ZGwGzOiZ5l0wgSqCfPyPsgHzukpC7%2Bqr0zcgIhAIGqSnbREA9xfpxjJGdPVA9t%2BlFT8Hz8ubAAiuGCGXYxKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwOGjB%2BorQxpyma8nYq3APyr38BAvhwdjXzy3pZH5H%2FNXiApJkxq6xpcfrs6nPTiEralyeUz5ZxoM8yR1PHojhj7IuRieyrU51dpSYg6OjZBJ90%2FiOY5MEr802JgqlRrQtbzF8Jc%2FcQ9zOSIxu%2F70XzSpw0nUXW7OcFrjckC%2B6tAvCrvK8atHwqvzQ%2BtiSEDvKeHTiNE2SPJn3U8EDM15a787qCd0sWgvYzww5ixGhGQQKyA7ZhQTNQq1e3B0WBbz5sD%2BwnsumEbtti7chNb1YhuB%2BAFEkLM7ZHORaGAUBfIRTd9ivQtSKeWEiFmfyH2QAwupMy2FZ7g65WCkSO8SuT2%2BGbGuANoUy6p8KMm3U4Ek%2FSdYtYeSalTfHxrEmQUUm%2BxmTi%2B5xe8QnnSnamtCzb74YZJnwwRngjJ1v4Z%2B02UzeWkPddDA2EMQBtw6SYI%2BbATcI1yGFI7gdO%2FkmVB0G3mixycGtpuXjUiTQDdxeOUVYZ%2BrRB77NFZSpAMQmgIhm8v1z4drOGurkZiXjyLFE25amQIrNr7l7alLQEXeKOxFKoBpuktNiBoqyPUsU9KZQfz4U7Al%2Bcvwgkcbwg27FVHDL468XtBR4A4d%2FLLIoZN%2BjRwi1GJ9UvmcX2V%2BKOqFFEaEL3oG7jX9a3kTCf5%2BLNBjqkAQ6zhAVMoJa%2F9XlB%2FgDTFab5otjdEMO9TmGG%2FINNC0HkvO2c2tYs7n%2Bsfk1lKkPzS4u0oN%2B7oQ5YcoTPtS5sIsRnc97VpYQ3U9cELlIIBVicyZ7mZ5U7hBYTrnhwznrZUcinXRdCYf1UFWyoVwk%2BKnydmY7XAXR9hrnSRC18YSRqo%2Bnlk3xJG%2F%2FdKrGLHYJrd38ExkPf7V8vDxhMJTE9H27tf%2Fcu&X-Amz-Signature=2d06e8d854400087da5b4b244c555e2ef7f14d151012ebf1ac3e14b924f9ab3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031329Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=148e3c5ec2a64c6105a48a8f596c44ac0a6536fbb0252cb3e66b68a06ef725cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XT7Z4GOD%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJIMEYCIQCqVw4ciFGLJM0wdo7JeQnHzzsmdRnJqVSqmVNovEU%2BfwIhAJarHrBj%2BvNTyJBOqoh%2BT%2B2aWJok%2Bs0iQEPQ7ANKEiIoKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw%2BY7VbOSpi8rmvmNsq3ANlK%2B9fAAfY3QS6Fn1CIj%2B2kyv6KjWX0fQiEazASzyLD%2FF1SzIW1vx68AHyRTGsqSaCdWKZ0vIvXV9Gssq3AUAfcBHMeQx1HWNWcA9gQqXYEYYRnaLrWYDHlj25MasJukZcmbCuTty02HJlKm0uPwTshFOeFAF7zQD2AGv7WYIpzUWdkjOhasruiVRgyaxS33L3pd9%2BtXPWyYSJdt4%2F%2FfGmMXDIb4IXPpR6SXMXFCm57PA91r6%2B0eaVDlOgwYPiyPbTQVraeW%2FGiqLSDCEo3yNbjfqzW9iUkQZ%2FlbQlieON%2BOQ7UuaS%2FhF7kv3HwAMJd%2B3Ujh%2FXSFr3Zin2uSPjh9THLjubO2RZcPgBq%2B%2BJFDgZ4tkU%2BYPJnb8K%2BwdVMLTQ4a6q4aM8VWi0ggvtl7ckSBuHV9wyNuUUdIBT%2BUP0RkK18YnZ%2Fg2Wvw6PlUvPPOFRlCfaV5W8psnK5wUCxq9fvJevWpH3%2BGTTrN6ax5SI57JFTtBlGQQKG46tzc0D9SmkbW6TzGtNY74xoqpdsqpSGLwFw0GP8zaHaFCYD1VTizePuXCyYOtlGzpbCBXtk%2BAoZlRg%2Bz5rbcRrG1XKBFvbJv7BfcPdWIt7YTZybH2v4RiottGBxOZ6UJM%2BSm2kZjCQ8OLNBjqkAUK3xra4EF06%2Fatsd0wGaXBEZbbk0HxEwYvm%2BIT%2F3pnwlGGXm1gflMoNB2pPY2e7yJPFj9gBl5XXfvzpvkuxdTKvuntDKg1h%2BThxlVgZh6J4hXC24w%2Fb5mSRR0EOqWXuHAYCTKu7scDnR8R7rRELDVr9ye0Y%2BxAO1J5bmVjgf2Br6zc8iKWM5GP02lIue2UDPgH5RraMD13KbHSEKsJFkXrTkMVx&X-Amz-Signature=04e9683bde1fe87c60f69423de01bdbef67d075d0771df9ef51659169e215f6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZA47PIHU%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQD674zS4H%2F0JRHGGm8vDNJ1yZQTt%2FuRRWoiq9wAfYdB5AIgC%2BphJG%2BJtp7b%2FSp1IVFZFlJk4gOncMWFwoOMDNwdqZwqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDztyh5WiLO1lzFkRircAyL2Lj4Oz2IU6ocrk43dDpQ7L9PWJ2E%2BNtFWdLZrUOyIhvVkukP7%2By3F3wgrTogzSjxxLP4qOdFKWqCJpqLt9nTEHfTRH4Kd8zeexjuI5Tya1DnVSHt4LxZhg4Mi3KxZZGe6ZdbRMv4QkkfOoX5lFfpsIDniTFSkI5D9LjgxlURcg%2BICB4bMinG7cd1pT%2Bfii6LsqcyVjoPnTM8gQTLKV6YgUBFs5dDMJiPSD%2B7LG6IsTSYJ1mvy53axrfq0qJ7O3PINBSDOKjtXOWxmlckDYpzO5E8atWJck2hg6jX9Fqab%2BdDOmnZ4uswrTdsC4LjbKqpKJFZPapS91H6vUH4pzA6OrzYYI9gA4orqk%2FPU3w%2FsPsuyhMnbwrYr9vjK8w602n7Cluf9akpw7UBnnuAbMj31AHoacAnG2w%2FjwlgM9KmJ2xqxhaGgMi4X6e%2FEf9ihYkid3KzBKWTJe7uVfReQ%2FK%2BDmJ9zVWIEa1RML2fK3eXGCHk7zEf2Cy5CkArsdfV6Z2IiSi73Nfh%2FIY4jkY8h2tFYRDIxQcE5j5Ad8Ypo%2FKc108tcRcZNqPyU0BKDV9bUDDtIKsraH3eVjwur0o24kp9nMWR6B9uM0z%2FW5EfHt%2BAH8P3pm4F55QVdsxfKMMfn4s0GOqUBu1LnOGoaNvbWvnACni7w372lNSTSMiB92FzbZDwO2f5Cstwbj%2BVXm9EdPDggbPlp45bOYeiZu%2Btg3DwnAgzRmAg9cHEfsfotq8ZivHrthByalKjsUqaDXLgjfd7KUr7zlTk%2F9o1XLd0ZzQCGdhMAoaoEH05FHOnCHUByzSB6muhZ75zVsXvujxhGIZ6Up9%2Bc6nFCNI6ZEJ4SJvFhihMAQIuN1967&X-Amz-Signature=dbef87a5d174032b4531639990d90cb8b04361ffdee0f9916d23d8f99f3cae4f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MCPO26X%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCICJpN8DFwSE%2F8UmdcAaGNDDCu8QryZOtXHCdiDz4l3fmAiEA26djPD%2Fl%2BxZZe6xhm4lAb6k5ZgRrh09n0WPKpaTyXv8qiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOaYsrU6UivqvN9qvSrcA0AlnzPYjneybzBYcZ7hFo6kP6IZ1Zgi5u9NT3sdTtHLg7qhEqdS%2BVPG2DbE3yD6yUjMK9TDf8%2FE0126FBUzLV6oqDyPWJVrjLP9LCpsIqM3uwZFfJzQPj5yaYwucuEfGS6d0eeDe7SHtOtrwy5fG3orU5lT2nu2rWHqXUaFcN6Odkke43f4fdDPBnV9arRtYEfLb3JPq43eaP8uvXuiTukxZGEM1fTFvObkjhlI4e7dh455csXaAg0abDROfClUMDY3eOnooSn1GP7r3UluJF%2BEQ%2BRHJ8SCFBnDwLCLF20D4Eus5Oz6CDNd8%2BOt5PV1Fs6t78z9x1Z9OT5ct9rBse%2F9QpqDk%2FEIDdRcHV1W%2BJzdmM0yzcdVoddLKeATj1sMgUdZ8i2wMovkffncWwZ3tA%2BAkvRx7d4TZREegnFxD4OSCbQU659H01zyv20BgFpaNfh53PuaDkIfK5WV%2BcxGkDAFbxfmhpnfsn29TiigcuxhdKDq7rXQKfaDs0Iob32FTt87AeOUqAHUpUEXLBRxsalpUTvsyAowTA5trH0D7Lz3a2DvYS2W44%2BJHD7nfHL%2FY2ZPEfmGy6S4vLE5FVa%2BSFDlrwXnqDYIgsT1aDquLSv%2BICbb4gEEtCYHFR%2FEMPvo4s0GOqUBP3bksUj7v27sWtd13nTLHPH7mRIPVby2QW0KVnjS2IB2ncYnDWGpbIgrC10pK8nW5ol93kRSfsVxydKYyJc%2BhOyQTKVEoWKoW9bF3RdF%2FYhtINFxNIYgu5j%2BfizCS3ueWIPy3%2FHtn%2Fm206HpUzLWQ%2FLycyz3abY0R%2FsIq1368giQM36TqamjWqKzl4XYBfghx8IO3%2F5X6AD%2FZH7ks2SfopdC%2Bk0w&X-Amz-Signature=e96b4417547d40715aeefb7b860edee1c87f1188f7fba57419451845137c0ddb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MFGKRJ7%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIGn2S9RL%2BFekgOynSVOjpoH8mQoiDYGuWoNDy2Jzg%2B7vAiEAjYL3IcyShLiK0LHvM1Dq%2Fx%2BYybn6miesL2aNbzO8aTQqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMVI7Dey67xy7%2BfOyyrcAyIoMfbwTsllbrn2%2FtWTklOqgA7276ulJZm0yPB9eDECVNn79%2F5Gn0dmiOsC4prpzN3EArtCVJcHueiUpfbvHGANnxfg%2Bs%2FTIelR9gwMeTISD0BGvs2YPoy3qBUjBIbskVl0Kw3on3%2BX0RLJ5hFrayxCkWMU6xEzctOEG%2FT9dmh47OV7GrVEQNmK%2BWs7g31ByY9dkTDeyQwvNjGBQOSO07PdbXKZimKxUmqi2gLfZkqdFkl6tGqpgFNWXDQk1LQNGS6sFY7fxG%2Bu%2Bh%2FwxPFYUZRP%2FRn9xzY7WoXWenNgnfDrv2zxu7U8b0nFfPK5ZO%2FnJB%2FAjsDGJ4EDsBJDhE%2BlwyYydH9utjHZ39PRL7CYlkGjvZRzFxK2QjpY0WRYomPISr9Os0ui5XpIk4wLmnSoSGOjetHAUOdhKm1u5hmSG%2BbUFNBjNuETobFwfakY79fV8EXhYU2K%2F5Z050jyXBmb1fOpT3vfe%2FOm6AMEiKVfsOr0RdPL0SjATB6ydBCUV2Wqt14ejj5SVOb0XP99WlVww%2FRHW89gikSHpr9DC0nY1QNtFx%2FPJEsWEejQcO6eeBI05T7HeTo0LdgdW28Af528qhwLJRMb1LmSwce2%2B8dsQhvY1vWL4niXdKXaFt4EMNro4s0GOqUBzld2xycOzIYh9dF%2BqHRUqQje2EFjplS%2BdFJZDk%2F4j2jWJ%2FCaKc0mzoxlHQSzlWIvmGEsILEX3OkdNAwUA3QF7DJP0lYVNL9ktj%2BKK%2FzaEAr5%2FRzbz9wCM6Tg4wty96%2FiqzraQnGaz0OeF0RcMFDe%2F3qKpMOaoWCq1n3kTg2yV63VWzrZ5NRO%2B7us2xWwSNpAY8cGnKqb%2FPJbJlFZnBXfcP%2BVCOh9&X-Amz-Signature=b32bbbbda02086f579300d6fba75b05e399fe95b6ccaf59e8e1c55f58675381f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031329Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=0b89d5bd27cfeec7b4dedfe9a6fbad99ae64c7f501f51c4f897a24b3fa5393a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWMFYIRZ%2F20260317%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260317T031329Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIDTT9KMf1zXh0Ckjl%2Bd6fzgI6CNVlAYhhiielPyxCa0NAiEAmk3Any5gjN2y24ac7yHDISBqlAhv1TVyHNca%2B1VrORUqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIf6qEo16Wift3UVuSrcA4EPGWm1VE53R5377axPK4ngfF3ztSf1cGE1kXTkazqPdFrq2s9sIyfrnI20oA7ZJDoj1yGl6rhcUechwNE%2BmNqfG5E7JCys%2BH89dmJPUErpFHixJ2vyJd%2BL7yhnoxVtWA7M%2FQYknQpUBeenL1JexT504Nn8QY3fFseONgA605QuyaRqJ6xSt9xN0l9CqIzzd96Wf6HItp873YNMG2hHlQ0uT8IxMp0%2BMn%2Bu3CqCGntiqb%2BqGTAIuuu0e39eAMnkT2p5RTvZSEbyuu4%2B2EZ2JKJQJA00TnFxWgpd7cVUv73d%2BhqVNVA1lEpaf7%2FEIdbtAF4F%2BS8lwmPGIZcz6Lo21u2WJ%2BA61gHoJ2%2BFjUbNeKmQuhoaeDY5DlXncduZaRoD8Y%2FDtpRUnRLUT0AVlmPNGwIYUsgiudEDEK2krJ31QDa5ApLwfhhbVv1504J%2FWJx%2BvRjcpsx5pY8KUspACEpGRqbk5SfQsTzVzTsfNE%2Fmqz2lm7Ateq5J9b1XmX0mqzIgMah2orz6CUtHC8a%2Fk2F8GfwloFjJ%2FwT3UNrx28X8A3cj9LvWpc9km1I5iJKqStCPjwHNOsh6ucgjCKjdnrWXBdFw3Wh6%2FawOeTZyvYS%2FOVSDXLiH6Jc0RdFM%2BpThMPnn4s0GOqUB%2BkLPgU6%2BPdmDRa6t0g8i9H%2Fmlqgk4pmAtUVF2MNwJ4ChAqKmrGfqFuGuvw%2BFDZ8pFL9bGzaAmSP6dDemV2Toxa6gU%2FZHaAV9w%2F5nLoWOLHNkaHhzDYLJIrq1nm5qFZS8HJl9Qgs6F5USTEfl02NLZTWoEX1fxHcuIN9w38g5ug2l3nSrm6yoHtVKaz3R2QBB7Nebn0kpOSkbGw9NOR9vgLgv%2BGth&X-Amz-Signature=d2a097da01c625e3e4df23870542028eff803e20747ad21770ea5a1838a77906&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

