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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033829Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=57ca15db76e116d12c75b13735b820d8ff8b9bbff56c37307962a9fe9c36fd09&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033829Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=b5227a505bdba65537bcdc4e7c1ac27e60c9d5bdd80199f001f1c6908a046eae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033829Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=10516c0998548664fb73a45d1cc23f5c8ee432c964d5a4ec9396db8382e39d0d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033829Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=58142c973bec0d0815b710b0267659613dfec624f63c2309a0df98cc0f9ee86f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663JLRFLTG%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033839Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCZrFhmp73ns98xkDT1fUZcMZTEfafLad3tUHiEQb1nJwIgFk%2B7Yb16sWVeAbt6PPW54627XCnhomVzPZ5DoP0q7EkqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIwHjtFh52vEfWofPSrcAxwEREH9Z9Unn38YuVZaLqSgC8wV3FgZoIMLFvW8wwD4HDlQU%2FLiWTZJOEVuK9KjDYexDOgrT%2ByLzIc90J4pBxSyTwRP1mnMgybHdFg4%2BFFSXtRccLQWUViiG6%2F0jgd1Lsr%2BApJKogrwqJOKYWfOsTK2QEYsy%2BD9m3mdlR9%2BRR834W3Ua8nXDKiQ3zcEPQHXBIQFm2WMJLiXWj7q5N7U7YAGL32ghCh%2F%2B0100s%2Fatf7njD4xtijHb3flbfPEqE49e%2FCEbduEj4kN4mWA8aBI8ry%2FRpyjFjv75ruIhJt2f1h313Q1vN6cbEC2mb%2Ffm02KuQw9lC22252NYp2i7xfP%2FbjY48dG126%2Fnrkxw9a4QE2dZwonzFABir9KBGCfbLxKjiYtV5Y5YnjdNIj%2Bfdxw%2FCNkR6XhJvGGTBwZgP4WBKf45RscRbOL76ddCOaxH7aFhmWmjRmPW80KwJ%2Bi4Ws%2BeYNmL8uEB6V8zjVH1VMc57bHd1wivvCXZvoXA%2BaU03MyHi5IU7jDOo6qrc6L%2Ba6kJ1js466QMvgQhnHl1JwrGmh08Vc4TAQotEZBma2hkG85Q82GONyeMC9q5bdGfIkK%2F3VpfKilVxrNsFcegyHL2h19ht0uDG9DNi8ZtzmWMOmex84GOqUB9ZN5vFQc97Fi6CbbqleI%2FcEt6nO8kec1lYPytenRbotvVmwbD3oHQhhW9pHwTPm9Vxh92U1AKHgP1f9TroB7UtREeuH%2FVkY8iPKfb9hDyysy0GWfBAaTq2tRWJNWOj%2BRHYJ5K1dMiY9WlRB3GfVJAzOTE7VpviASig8Gh0qZUjSuG3ACQKxtKmTj0pDCkWR8PJInNEERrKg%2F8ZUbFSq%2BgI%2F4uT4J&X-Amz-Signature=8479b89d0750681e93750b1fc76e10728902d2c24544724e2e357d637c7a3ef9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667V67CHM5%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033849Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEwYA5zEEOy1ex%2FEocMplM87x2Sr5fXHClOMPMynegnVAiEA9bfhAU6cSb%2BWzS3Ri7oRQJIZlQYMDQGmYyocdub0wQcqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDkVwQAVKJl00EWkJCrcA56iogjbLHQ%2F3DLkb8HZk6lW4VY52Et%2Bn4UW6vvk4w6xN1jmSV343HuEVBAm4yhJaYk1Wtqdo2krCS8bqfp5dBrWJ5mwxYdBEKRtX63LqNn5A6nstXPxzOFKjn70iBL7GIvjT%2FWGvPMIJRdOiCGUgmgblLhn6P%2BgHdVQskUZSf6O0DSeNjtu2iimavLKUXpFyGnn76v%2Bym9IomAjkhM0q25Q1cAvy5oFwIwbQDreDiHsCX2c1rTgeAiAQZxslHv7jgcc%2Bn8ZTvUXBiYYSvCG7si47e0%2B2RMCCjDsKRa9o7uGpfRP1gvL0V6fw0NRqMUdM4F6GlXnDPgbRhOpS2fFJ6%2F6sRNyyxT3tZK7QGLjQAqXPlvVT33Qmi6OOi2Ike0yJ5Zmq1A0DhZJdil64Tp7mQsmChL1R2FKU5SQKMBvpNsYObE4ZtoPX5j%2FxAdHOlqjK6ZwJAcGssoMwZefTMdJ1xmay%2FFvn3KNHmcbxNFr5TUfbxSlMFCwvncJH3VDk%2BZye2VV7fxRpdmBw6pJ44GGtmRX8b79akDeHhmI0yOlux1ECAuWhYZ5ZaEDJK0bjjIvSLINGAiUOBM9VgG0DYvU2lwXTVXY5P8cXgtSO9gkSPq6Y%2F01d%2FboZ5%2Bmxfw1MPycx84GOqUBB%2FtlrWJXMg30ydPdrBhYg%2FTBvZdaGCqvuK5xMcj1IbiHG704Y%2FwYYzd5NwrcAPhGaGiTtwoty%2F9eqrvZUhXlxxec5iQKWdWbjhJ3xCTRaSJkHdDUlK2Aln9eN38jD1IlsTsWNVZrRskuFTSDXxmk05qWpAE9pLCSKyA8kVUsb5oBcP%2F61AY8i%2FE7S80oM39K0Y%2B2KD%2BWpwTDeB6HxT0zeHLOJT4Q&X-Amz-Signature=8ef66019a16b15d1e95152974892bfc95cb646ed856671ced093ce1d52ba9417&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WBKGL47N%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDilQ1aKE6%2FP5ltSqJ%2FOY%2F1msG3QNHwrIEsuDLhfSE8%2FAIhANk6f1TovlL%2BJFpgRKgcQS4V6qouZaRPq6199NWwy%2F8LKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxq0ct2GWBrqMfSzz0q3APtQz1zHM8OpaQzB6bqF5Do13E7YUva13dkart7OBvKyD4N%2FFSEvXvA5agA3lXNN21LcCSaMoOYcmrgKF0kHUHty4MA%2FOUF0Wxn9n5OVsaWiv%2BOhj2Eyx%2BWhLSrnwaADEN8N5mhF9paHHdhRnES3yE4LA2ukxsIRmK%2BTP4ZfqyOf0kgiOj3mDaBRLhW6umZM3YFfQUNxfGXeP85s75xGtV%2BEFSyDzQtgZwtIV%2BWhl7uKhAw%2FQRmm0nB%2Bkh9faVLbKgJvxeIWMLogYK4Q1dH8SM72j%2FdV%2Bfxht7T1MMgLWrvN9Ez1USW3ZOW5TBQDO3ECGqZEGBhJQlS1ktzFbbue7R7idQ5zWdHZfLoS8if043iHCYK082JLhZiklaQzvZU6wASc%2Bep53QIqYZrGF3X7z%2FjhPd04DESQvL3cPwYpmkYETqj2RNhpuKYLQnbdvokEb8KEYpLg7owdxM374DfZyrCRhM2vQsHRYbtrq%2BFmgScI52pryTzHh5w8RUb0iOg57flKM6ibdBIN5osxWbdlqN2rrIyBLWLgnG3B1oX2olKGvhj9gTOB7GRE%2BkBDJPcoE8SKTksShVegNoy%2F59UiY6NPNbYFcaVYpVcrTxoinVehRS6irqLAOhxQd3pOjC7ncfOBjqkAS5%2FVy6ziFfS60cYhX%2BYhRFe5y25syBHPsxyl9watoOgyJHt5t0Q4JqClsILdIzI0bHOrqOXUvK3CjpZ0ilA72FE6SE1yPfjf1a0KCZ3psvN4080ycd9qa%2FJ3ytBTQbh0%2FLzS0AVO18ZVwxrv7yiBgzPg40%2FqplkBYbkzjAdDgqEPvfSt%2BEhFYccKBNWZLgxAp5yuc%2FDUpgx3ZDP8f4Abmm1vw9n&X-Amz-Signature=2f860795dd442efa3f92d7205ed9093579c7c67f03514b6a5a29c3cd76e42e1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VM727NM%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGFyVW2mkx2DSwiPdUslxUuj3j5zp%2FJsxm6SR72GOxbQAiEAySibqrX4eKrkjg2wTOa%2FdxM3AjRg79TtJR7XR%2FdnM0QqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOZssdQ8OQO%2BQTKJ0CrcA5m%2BpERu66DZF8M4lK5Q5oe6c%2BasbrUr3Omx%2Fm2MZ8mXks2hsB%2BWG2pFdHxZ7P7NNV0REQTkrZ%2FQAGrwSx8QlsAq1IYqassHNfjQm0Bugk9gMCd8aaQHTD0BHBz0K7N%2BTYTI6PSnLuwfviY2%2FVlgP7fIb12zBSDNN5tTsXGU%2FiA4fmYoeoSLGfaWTv6rf%2BbMG5eeNGSBjuS3wJU4vQU%2F1zU5EA8%2BGf5pNfuHaMBKj21%2FKu0gc2gLlCC0dhT%2BfRwBh772d0dPqsa9nYzWH4jAwiBfqeUD1%2BtjamBFBER1cwYtV%2FbAtQv8VbWAL8d1LJdjOOhORv%2BI97EjI3L27QRxCwACOkhxItWT8Bsgs8M8uOovl8ndmShROlgtVwVevhoscjYWtzfOMEYzK4PYdgKuEz3WOTnkCWxdaKiUMrrdZuSDTTuV34R%2BKfgRzAderxywuSjrOEfLP9duVLtbEFVgwYf1%2BH8Ef03iSt5d8xAbLqFSvePpcyAg7XasPHlSQ9NVODkeg6vJQ%2Ffch5E1Kf50FDsIoEtSUM8RHhUaJLUxTaBu8IAUwwrJzt9Sj0jEy6uGJitOjXTvqmUW8ru5ZsHU1H3BqmD%2Bo1Nw2ylfYyw%2Bzk%2FNf%2FpKqvbbY0E1GnMWMMOdx84GOqUBV98GUkBMkLQCZhkVh3fCc2PlDyjD6G4MuHih8ea7ZKCKYDqcnFp6K4uOGeQzjRNf2CZPP0QjJdEeEa9lyh3vH3v3FqxBYmL%2BglAolhZEDbxac8IVMgaKpMKnDp3JZKzTBUiEIZhy2L9lfmJrAFbPVXIzsKULw6XwSgQOwIY7kPcsjBqgLspsg1QZgD8nbaO%2Fx6ixK0MlPwbCr08%2BUoNiiufmXUWt&X-Amz-Signature=3b164c7836160d905f05a509318aff0607f02626f24578e8c8764622d0719c98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033829Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=118df62c75849998522c89540ee89383c30a0d11eecd06038dc44b627a034ffb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=166ad7e15d1d9415eb64a543257552dd9560505348fa52c0c246ba7091cb64a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662RAO2ZPH%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBggUC4rXgWbdlIT8r2xtfltryRVhtMQ6mFoCnBNkT9QAiEAksPOMppaB1we%2BTwkHOpPoCWP%2BAwjzuOLsfo6jf029RkqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOSYljh%2FMfb%2B4ac9tircAwLcGkPeZyKnfKUtkaQOUiH6J01FbB0GK6G7kYG3sHYQUj1pw1Q6F9FPNA%2Fu33c8aZTWpjyZNYhEDK26IHSRe29ki4OY0jizpXz7%2BVq%2BBmHqjyYqtlE8rkqh%2F%2FN1JpEkkgeekz0AyymXkO8VlQ006fy4%2Bias2FXGFaMnVyoSm6NerzftD8fvbt6%2BiIk4cNm69BwPJjizunmFEuzL6bnAaZwWk%2BFQm48t27gC76e0ZPrNCcVONeIyY6VhEaD5x5vj8%2BYlnwL5ELPDVrIxTWDfuGMY6FZNfnH5suJpxYRdBPZCB0iDVtVzeKvrcTMe4M4ejX3XQzkz4JHf6r3Wul8eEgnXsIu3dMV5MZfL1hQGva8bEmTGfVepkQwACPWVBb1v9iolAOSdv%2BkMCrtXbWxx6%2BrNptZr6%2B04YMoaM7M0m2kEs9cQDCmVIe%2F8hPf6mCt3spqAiXvQ9Vf%2FMUMmSgzBu8jboSZRNOIKD6SPTJKFyjDGfk0rctUIKfB8YiTckA%2FSzKLDOp3SWKPah0jR%2FS86Y6aSQJCComY015VJIP6bewQrrGsfQdx7NM8But1CbTufwaVVFOuTTlP2IX1cIYZwZy3L6slxU%2FXQNFBCrYT3GAkaq3wR7LvJ8RFcpGUAMJaex84GOqUBnRLSaaa91XvFliAeI859G7Vvfi%2F768GKXqDLulrpbEe%2B%2BS8GZQONvYyKx6ruaRYRQ%2FpaEge5dFZP2CkcwxfglUD8rVXw8eJ%2FwjVERQNeD7gAqoYiIFfYLdxSBGLIQoyRdmUnyvW3FSpIs%2F6JhcIi1pPq%2B6xieL7GqW3I%2BZYW02rHI%2Bug4I%2FRDTwvNhXPM8gleRu5TAzeWlA4tXFEG7Qdj0DH%2FNXZ&X-Amz-Signature=28984fa4ef6fa44b87fc71302424382e8a0e7e2ff848002ca70465f01a83ee5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=96a2fad7752b9ba71d25ba02cb8cf44428d9a0b87e30470ed59c551ff61a9c05&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQ2PMK7U%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC58espB2G4uWql6a2nw8dd8TF0WhpidALLgbwArDBozQIgeXrna%2BsjbpRMXCzgoEge9ZIwQadaLX7BrIhFmabha%2FwqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNnqP%2FWxkQAqQZPcVSrcAzsHhhrEIwenCh5a%2BPB%2Bs%2FwdIsAYGtYW27WcTRiNnTzfkKjCdRNqIo%2BbVFQaAM9Dw6IN0fD4N48PUeMvbFchJoAAwnJY93kX%2FSrmcK2j0rAlpBF0a1fFF05URvu3oye3sXm1UTTfb%2F2B0H8q2zXxMBFzlxl23oQBAGA56Izl3X6DUWK56xGFb4Q5Zn%2FXsND9DyHKpMWPjHJFWL0onSmF3sU46ID%2BQAh08Fc8n4lIOBVaCuftgEzMB5sMtT028bAgIc%2F6OqkT4WvolVavqRKROFRieHzzlkwLU3HYMt8I9jCx3itNyAd75eQAzMRlARIgBdDO40yroYiS6x7jOw5FS7lcEUijefZm%2FDsdctCBShvmvc3UFYhMZP1Gt85%2BTOJ2pB0ZxpeWNaA6EqhfnDxxvZHE9%2F7efN2N%2FccSMwHwoO2oDLGqDPjlw779YWfja%2FmCp%2BvPcY8nmDB1ziQMeyZJztag5otUh6%2FhvXi9JJzTYbME77AXy5ja38p0%2Bxzn1475%2FU%2B5DnlouQeMvlNPT%2BiFsVkg%2BfixX9PsUNYz%2FcDD%2BhqyKW211oYbLVSAuOY%2F63xizErBsuMRgrgUr5GVH7xhwfKVh6CFhrlAQPkvq1eMPNndeUrcB6Pvc1qdB7dNMPKfx84GOqUBiKFCwGsVQNw00sUwnF13QwyrQOHDYIydi88BHnb6iy%2Fv6uRBinkaTZ6GG8Itrh%2BOhgnq5K8oYq01ToCMa%2BuadtUed4sYUIJhiBB5FWv8w4Nr0BkzoiYOpqg6AXJIBchfr2AbhSHZLCyNbA10vpQRdPZOE9lXfkaSUIZ5ELdP4l1bNvJ7wLnCpQctjGlQccUn925dVhceL%2B90ZMohasfqfAaxhj9k&X-Amz-Signature=e4eefebe3655d2c6c080d9b1c0ca97706d62717b582497fc2ce270067b3b4215&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46654YLJ75T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH2tn2Cie87HjL%2Fqri6AbYaPZD8iQIB1IRnglrhMbX9jAiAzW65ow8BbDOzTE4eVdjsy1qAGeh6ww1YCf9Ug4WPvJiqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtP93MtjXl3IJAH02KtwDjmCd23Motfa9AiXlre%2FGSj44bzxIcsEuvjDFbBYdD%2FvgYpm71wp5fU3otLp%2BvfYEXqbrVnsAAIudZi3mSajlXGmBHjkErleCI0J0XxoFgCqMH7kKazkKASlVxjQ4xvPVOD4gx%2B1ln7GGktxzUrO9xUKGDFUZEca2UnaVy2KKbx9Q6zVknlxxKHTyr6I7nELZCY%2FPozLp2%2B%2Bvku1r3ITNm%2FRx2VI%2B5n1C1BxHykXHOjpoIOo9fUwsslnkg0YqQzraN7%2Fn0UkZEqGmkzA4nlPcBjokujsGeTH9DNZr1H3gllum%2B2afpdei%2BkNH%2B5kT6ZtVjK%2F0S4HUu%2B3dfWfXZvlB8AIPBA1rjIiM5O%2BIhIgnHoLIX%2B%2F5UiKN9puXt%2BCNI3W8f8C%2FniiiMrt%2FjF4sWJ8yKwRhZwV%2BDNk8LLqB0ENyk6xgJ2bi4JgOxnIr%2F%2FrbZVq977VKcQ5c4XX98d5AR6ZRtREbvz%2FBF0mFmFl6O%2B524DaKtq0OkQqZiSlD2s3Q64uQvIssNgwgtBWU1lIMmlFoGMLHKNTBLJ%2FQkn1xRSu66HuYT9%2BAh%2F9yS8vRQ%2F4bC0%2FsFve2wdyaVju42ve5CgESSR7e65VsSKimjqOQA9gBAue1LWx83Y1CWgv27Q4w3J%2FHzgY6pgE8ia2LNlr0Nq94EjLFufv6Q1MNV6RVNq5D%2FkteB2%2FaoJMwYxHdR1N62O1pb2iDfi00t%2BUlkuwg4MzEuj8oWZLh0exkQ38urLj0akIArWQIgOs0IkLOZMYQ%2FXZ%2BjMPW4ucp1Ji2Xb0o3VseeGMdTVEpuHRNcmAqECb1kocHvK7d2w3V4TFCCezNEFAMojYlx%2B0srL4f9CQ%2FcW4n5HS0RUoOHl1Kwpor&X-Amz-Signature=a84bf28c869e3d65c1e471405090865a99e731468e0a94f18436b15c2b739f73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQSSNOHX%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD4C5zfkpbcVEeBl8xbce83qmFXCz2c45FINkXCb1%2B9ewIhAP%2Fjepuu6TyupCUGzqXNb1Rx10yoZyAZzi0ttMub64byKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzS2wBSeszfd9lX8y0q3AOy0OF%2FPQte%2BSXoInl%2FdJ02g23RrpBJ6zR5drHsx4NSWMt6wJfMhRI5e6RciMZyqt3%2FXtZtrQyRnnMKtrA07RYTYS8decuJ9ORjd4sk8R%2BgKQARBNzGsGJjr%2BK7KgGUqAMl3TXEhHdJOuZ98NwfvYhJHf1iZfhSFyDwZho1xNh1CrS7gmGl26xy5eIHXbwOpWTMeudEdwYPo2n%2BdW%2FKeytn0OFQlJpVZVDRn417L3uybwnfaUIwyH2m4Y5eBNelN9Z4LrTR1Mu3x0%2BUzUfgmfZex9tmBl8z%2BtbqaVW%2FzQrFLMimXifd6akBKFgmhSnTPRIRuOX9rUKbMECxUkFT4A6VlDQh%2B5SopGJr%2FKMisbOsjK1EkivAx3fgAgSQxM4hQnKSxzBN0ve6HOsDzNskHYjMjZsPngzuHAzEHsUVjViPdiZvh%2FN%2FtQnlTPyc3APEjAKYTp%2B7DN0oAMJqIvjK4r8jaBeenX%2B4XcYIA4e2VUSlpC6mTaIB6CwITbQiCY7IJx7pRMRJC6IsT7gMAK5ILJBcGmDqUum57Iimk1xYOEr4l0dWy43HwMd90vhOdP9A05NVMNCBWrjoGwi0CL0OvtdhzkKuAqxZgaNTKiHnVIMFS1SNSaOonPSE16nelzCYncfOBjqkAVK8PSKkD93UCbd%2BVoMLeblfucdbvuH8NkI%2FZcia5fwJ%2B70ReFGhGiCrFL1Feq7Z2Z0GJVGWy7Ut3dAPdJ7JmbVSAYuXozyh9L%2BuPmlHPBCwIJkSgZR5PcNdWw0yrK%2F5xF8C8Tn%2Fkqq8w%2BjgDcO75hvbi0%2FGUwKpe1Gh7GpcabhxsK6ZQossLb5V9pcOBkD4Hl798F7l6aSc2LgPpkXJIV%2Fkd0be&X-Amz-Signature=726b7de374cbffae99aa09c95f8a85f3ddd25a8d96b766ddcfcb3e116ac56bdd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VKSMPKJB%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCUvGPyKZgSXd%2FAQj5MtpimWTb9c408hX8GPWOhlMrN%2BwIgM9l%2B0n%2Bpg5wlsvBSAvHPekRG5vssVNvQwTKfgOowpHAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNYClA0WutpsAi%2B3rCrcAyww3Rs643RBqzO8ajVjO5VxuSRhhTJwGu5JFbZ9kjlAQ8Nu109WOMsyRgPGTUCzfwyDb2%2FsveiGyi2P%2Br%2FGOQdZO9UoJ5iQhUydqSyuzJteN55lzQwLjFu49%2BS1BVq3swaQfPMm242AdkgpmYZM4Rs6RGNrasEAl12hcFlU1G3uFgNKiFiUF0Hfl7anPlgUrXPJ09I43xSx4caJvrhnXRVPAoFPKpH9jOu0UtiR7vIVSdt7wm5Aa7H1jhOeOqo9H%2FnPtWyo1Ny7nig7mAx08wSf9EIGP8zsddHr%2BxE8rG0WPL36XLxX4ZYkMN0szHXZgmyCfcPT7QzfSOJ1V3acCJyssXpHdVcJ7sLpGMLGd71VKvdgk%2BH4IqTvOJ%2FDF5zwE0SgP7sEqFQU8tDwqFAbgEnpJWZHCFIiNwjs%2F8qNyXKk5ZQTyrGzBMNOiFlkO4e9LOZzO0q%2FfxQsc87CxxbLQRtMe3ZlettwJC2jUmYMDp2CzbFPAeM%2FnTEKi6up6Jq7R%2B4KPWya%2FV4gCQCXLiP%2BSOdaGm8iTS%2F%2BbF1ahS6EXb6CxJkbbwBv7h%2FAG4A82shLL2zB8Doi2adOcxil%2BuimUeT0iaegJE1XOxppHpSIJudevCcU8nUrB%2BcoOWQwMICex84GOqUBgEXalb0%2BBf5%2BfjJBbBvfx2jt1Qn7tUxeCGnnBY5qEGxyZ9np%2BaxXj0sTgaw7Kovp0vhys2ZKnNqtSII3xq35bQ5bfNnjnusONeVVIs1O061EJBCNPX%2F3yywbmcyZUyrQTx4LJ0V4MBiBwEyMF6VN42IUnH9q1hxHD5W3ilDeADLgM2oQDD8H0l8m7iv%2B6IrAyoU0GMfhCNP3vHLb0ioXmIWDNCad&X-Amz-Signature=52652550f10bce8d8758b9ef2d8633daef50bc36451238a9ef74ae28da3037a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=08382c8842d6151a599cf5fd9dafdbcb586e8607683d05eef01193eb2d7759e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QF7BST7T%2F20260405%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260405T033830Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRdD4MdnWSXG3R3UDHdx8Ga8PT0op%2BLPx2s6oOuE8asAiEA2D7tZqhVhrnwZV0yX9MiojI%2BLpY4MQesNsYYatThtm8qiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1s16ODsc4zgI9XZircAxMJ36wYmlJpNA8pwdbK3BqBnvSSwumA6VEEgprtC0OQfPf%2FaqCyj2Ze9z9aG%2B6rsxqwl5eCgtU3zpyelGhrd6t4p7EYlsdtYqDhht%2B0%2Biu7dpR4AxzmWTlNkcHzsXFkTLLcwffHoHx2RsgVu%2BFeX%2B4EoC5esuSsoZNvuiKsZvd28%2FEbOo8ns3XYxtlOiDIvjhttjcxKF3IGr7w840QiZLexpzZYB6qgcDm5FzwQ0OiO0AkxK3bjiw6ShoQYqRU2%2BwxG70sdV%2F5LLbmi9oLVRTONsaGa9sFImS6QmdQptJbCcqBe9YFiLQ8wYNP18wg%2ByLoQ5xCdTSrvZkJJcZDFoxrQ66uHbF1%2BXlUxz9sIXEEZEI6%2Fh2UytpEw%2B7ZZpsVYMPd7gGN34bXaNwI0fhAqs7CilqbFDfwHQoNhhHhtrtFe%2BhVmjfBymHtmTs3xAe8ywrkj3uyys5pBTR%2BHP%2BMM%2BKT%2BPjr0kJEJY4bvue%2FtoCg3vHCS68vsEoSSjPrN4NK9x1DfT65BU5g1PVUSYdWR05RYNbe0fRQgEyeeeWUPGbYBhJBpb64ElcxGmYl7wQnaa%2BmTydYRqz9I5xOe%2ByiZLjRAKcNvwvJZB4XAHYmWoDpCcMZBIEbBtuZ5lXGoMOmex84GOqUBgsnx%2BWzOX%2Fyuq4PjHFdzg3mW0D6Qlzx8vVMRwOs6nKiED3vIERctmvdwVpVOrf84lxT%2BBKBdKfTlMAQ82n9tZXFzm2QRTP887ct57u%2B4f3mgG6c0sM%2BkpAmlcD3KPniNXOQsOvXt6xuub13Xp17YW1OqOkLzNT7pkpfgGdqwNwslzJ9y6oCBANwCsY1NJLKTjTqg2I84u%2BydSaL%2F8v7BmAEpCR6U&X-Amz-Signature=9dde9d0889242e45d5375a112338d3b4592f5091d0a18a22060c5de6a98af2bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

