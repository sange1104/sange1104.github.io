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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=40266c5eae5c47a4672a5e4c767989c98d81d5e0ea41ff166e7568ded2592286&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=3e65e7ec0d150a08f50e7e93f445d42aaf9c25328d49064bc2c7398b2eeda224&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031027Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=e02147deed393ecfe64f331938f5f1b85bc0c43b2208b83c14782900434a736a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=c7e64e2de42d7f18a98b1de7a169d42320a7bd21a8475f2e663d10faefeb6772&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WNOVB5YI%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031045Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFdfOOa5zrsLezpdtfUBlsDrRjgnPvqS1DVSasf5L951AiB7z1fa%2Bcfinsdf5DA7lT%2B1Q4t2Hj2fUJj4ibku4%2BJ8GyqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMnqRELCQWev5HCvRZKtwDf9r2S63ymUr1oWGEPdRklplZRx%2F%2BjnHYxKiRhlHKduEif4d8KBMLar23ROj47S5G%2B%2FqZS4huNVyOPzUFJZwqitCMqgvH3A2HkcqNpyWacMx%2BxFKV%2FUfnSmg6mT8vnD2tTlBS9x7ROzBqJBYIHuuEXU11v9P7vAjA%2FcWxJC%2FssdzjSpoQu8hA7LyjW7oqMMEd4Su66JCys1ZdBwploRZo0MlcO6uIqWLvr4VtM%2B0NcqVDBBtllWJ5I%2F1pDXYQ%2BoL5Aab6Uth5rixEDKnimLnQEOp2bY3nn%2BvXihQGnWhVqDQ49lSNI%2BUknMEDzWIpoiAK929Q%2FY%2FyxV6gN6hjna6xiI5Dff7lch8FJ5ZqVSpE%2Bq%2FceIrPavRm12xZZrJfX%2B4e1EEqSzC9%2BOvKFkqrgxMIbGIXEO5l%2FAEdJSYhpEq5rS3V4rGWPbd0RQZ%2F1jLiV5DPsEg0wcMvwDEmJXkXuaFaRKDw75bkGkHc6WfMFqE7oFSoEzNM9ROeeaASSn%2F29hw7rNDZWW87Se7uVIR38rMCes7O6yL3a6Jqv%2BJCDfGP2fLIWsqME5KuyGWSoI%2BLbPcVush0F9wr8oA%2FvEUwL%2BG6eFr1LcvDgz9tNs3Xwx2igJdKhE0m1TCLOJhS2BgwxpHfzAY6pgFWuGNDw9hdOlahegDsmEtIvlScRzkTBU7XSA6amGkkQC9A10zbWyO2iUqr2HkifVHixMv0e%2BzMErC%2FBoUt5%2FppVyBqkRQYu980HR4oT3VGd2BDXCyli6mR75Oey3aQ8igzQmxku3L4JoTpBB24WXWDgD5ymoYGoV8FXkePxGLW22ft058P6823Uhve1oIDMs4Pa8bSLDKXvNwk4%2Bdo%2BOoInlZr%2BbFt&X-Amz-Signature=ed3b085bd9b9134c5649635d04cbc336d6185210c4fed55aed2afe6173c4852f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKXTENBH%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031053Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDwrZd8j2x9oNlkKWRPtKbNOqo%2FxPpooiCN2ARdFI5veAiEA5bt5Fblc5SJ3rylI%2BCiegNhaSGY4DurQpTRspNHGK3MqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIuEm7zYwDfaZNgiKCrcA3Hmmf029SEtaLmnPEAV27w3DkSg%2FrxCmZfksAyYvZxwrJnPIt%2Fxxrz05L2%2B27%2FAGELJNebeI%2FTHUsIDxNmrwLfjIPn7%2FhzLTzqpoH%2FzC8NWekTmIUQfWmN0vcMJOhGUvwayTKwS4DrtgX0eoYH3DZYYXnmRnnNeF%2B%2FtAznWDNhICddXdzH5ldkhCDf%2Flumt2CkCP%2FdNqWvjLJTt91g26zARpxOQMVFHDjla8lRCThtorBG9H4AAYo2EKhdLzSQjoPog0UdGTk%2FePDjbl8MrF%2FmBvLcz7kSEjve%2FuU1KywrHJhJG%2BzgCk1pntpsAOVBPjjSfrCwxcDsvTdcI7F%2F7xwzll7UFa4i6bqyNWNeLkcWhv2RSrOU%2FNbKL6rBNyq1OyvGuC4uoVQ%2BAsgkEv%2FVdyMO0RDl4oVuDpe4rYVQFqc5T%2BDDOIfDpbIYTHCERa751mseOVuv8YdoCjUfFQLLomNE39XJr51EkDh1kWbO32ymxPED0ubqfmw07AqpmSveKohsJ6hwHKygM8n9%2B3TKpKCWspLYcjjEXatKIrDKzIppWRwdZuO927RuNLh%2BOWeI%2F1R5n3JFC6Ijf4ORhULx98bBHmKIy4IT5ahHntrkShdtDP3eNI8H3OswRL8m5MMmR38wGOqUBhzh7KuGmSgBc6Xj6D5TzJi4pjYBI%2BvEXkyvvjoYr2jp4nNd3p%2FyBJFljvBYMEgeshIA9ERu4cb0Le5K0%2BjUn4gtLCIWcAp4%2BixyFk7fcq8k6LwHr%2BoJKCOrDg2jpryqI580EYveWTMxnncQr%2FHNCntzO4sC%2Fxc6HaIAHx3O2n4OmvoORrNvt3bCZ13Yn7AHy9qfP9Wps74od%2Fp2unhKXUKg1FrW%2F&X-Amz-Signature=63edfc9866ada62e30df884f68ee14a02aa53759e5c48db548184e533a0f6fb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WVIHHBYH%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDrST9I7c7%2FX2hMA8zXVeDYhbyy8I4QHaGgRyOxK2zalAiBi0WwhB1fhxtU6%2FN7qCw2W5TfzbOP4eEduW4%2FwpmJExyqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMEhHaXZqFa1bfqAfMKtwDbortW%2B54AcxpEMZy%2BR3roPlBEETf576KagV%2BiOnF5v02Xl8xg8eN2l9%2F6YcRFIkKYKnbhxvRNPrRcEl7litJNcxkQ9qG539YluHn944AQPDOvYb7w5zMQG6L7rPu6Pjanb6dGPOhnqAdVUhYGvFLdSwF65nET%2BxPOvYpL9uJGMvDW1BPlg%2FtGDQ9oDYWduyU9rMtMBlPw7B%2Bg%2FgXpxqoR8fwZjjHvNIWkukEAN%2BwaWS4KQmSi63ASXAqNqzBzmYPeJ9OJimFwi32X0clf0Prw25CROnz%2Fd8mDqyhDaopxeKCwPSCbbchAUKp1LDmdlQHiq7T2Xte15GL33Kdt0Ak1rWyiNbszFw84tcjVRI2Swex0qYwZiF8TlDwGP6Q1i8pkE%2BIl%2FMzRm8%2FHY4XthQH81swoOfI01AP8ikJp%2BrwDRHBFu%2FNgqUJfER9t4t%2FsUsx4piAIwXbTGe3TXzAcW78FyLqaEwRNx49tMlAEWSa9kJGxdAlQLgL9dC5Lbf60WVWtl8Ab8iwzKmGtLGD8%2BZ83CmWpo3W54W4vGmUzZl%2B0enxzpAIi1q6ggtIo6W1jOwkH%2FniNZu63yKeT%2FbhlUKy2KoI4EJIWv8r7GFmy2eWDXunI97FhPhT75OVYKYwq5HfzAY6pgF2mS1P9K6TYxISmlVPKgeVvT82ZcuhvGn6TN8d01NU5f0mhRo1WoQaj7td61ZB5Oo6wvx2eDZpf99qFn2aG1yMLsdBlB4snhBjHVurB3Mr4nnvFVVgpe9X9nad%2BDiW4uz0aQzZQyMO6glHWftdUyLK%2BywODOei7d8uwhEVtv2foYAnfy2Qc9qlJLJSu066dlXvGhwq1bZDKYY8u8sCYky4VHKMmigO&X-Amz-Signature=5f0c0d9ea3fd2734006594cd8dbef820cb39e0f673a7802ab4c20985d1d30068&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WGIUXYYX%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAxRaIoofCbvS1V2sLgXCwR1br1DKqLX44PX3HxMYYawAiBDEBlu3LhXGIaythgcjwJ5X0SI7wRsOM%2FK%2B%2BFeqxRPLSqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqb8CHDVaawLgG2F0KtwDUrWX29hKxapRCXRolafBkwKRmWgmBZJYIE5Upqnq%2F62CW%2FooUP7f6Sd9hl9cC6AY3AlJlGvUmoHk%2BUu3V0q2c8xXJMwrC6Cr07umbCymOv%2FuCy0il7QSqotRldCBtlO6u2kYANq47yfSlH2pnX5J0Klj%2B72Tm0EDmqUHnLVyo9MQg6E1TNEVos1vD67TqvaEVlDnPwpR7lYp4fpJ3ALMozC2KH6urPatkuvOYKwaaKC%2FtznVXKZskZEibVoFsTbh9hudBMPsTDxbm4LeiSDFNQhT6y5ogI1p3r5rSyDRZ%2BJxmLTbRw24GxNJu7YFuWB3LMCTgC6xTFwTc0cYYJWn8rSfo0GC4ax6q54rN6kgD%2BC9cEmR5cxhtdle074KISV2%2FbPFLE%2BzGgL6qkojHk6xnH%2FzDHK5cNxBxhkfaiQLp9%2BWbznRHWPj%2BnVtv%2B41eZtDtkRchDGWFIEc1h1IfXREt2hNbRF3rSwiD0IupVE8tuFfZ47PvH97Rx2yOOOyFQRpsoSlgPcNWscrP7Nu2v%2Fzd%2F3r9DO6Sx9DYZbkHMTm8xCAigfLG4i6aUyccdmPMIWzBKQ%2BSFuv6ZKbDUe49iRppej4bsAVQkFvu%2BAjeMF%2BbB2kao2AEQMXapeKekgw05DfzAY6pgEslyvjVOyKEL8heB4TvzSgmtbfGqcXaHCeEC2nOiqwjQGuXwAd%2BAhvOj%2B1VRxhhPfmPh8hX4nomarloFQpXF%2FspODhtIk%2BG7VbLTRep1PfhPwY8LN7KB1NY1bxQeKMRXyMjC4dvfESz2J4gxRXnI2Ch%2Bk4QM9mvcQ95jr9Runq0rLp80aHz9cjiG51rQBOgeC59RSgM7hToRcdNzK4Xfa%2BVnRabcxU&X-Amz-Signature=c6c6bbcc4fdc307010c74948d4fdf61291b366ec9a43de30c6287c70038152c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=ad9a9a0d1168a90e289c0ecb2fe5cd1daa6acefe84b7209e94e18f335663a907&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=6904319a89b7ea34ad873fa6ee72e5474d8bb6c34aca6b9330d1ccde9e2d12d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UM5S7TUJ%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF%2FqxREi3TA4ptli3KQajBGd%2BDHpXb5lMaluCboirNv%2FAiEAzwn%2BynEKlprmBFn8LUGjjg3Y75EBT3kZxwMejKLKQ6gqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMYr0hxFI0lHCKMNRSrcA8fdryp%2BDTl1%2BxUr59hV3pdd3nagRJbBAOl0xqPzi2sD145t2r6fBjOb4XbUHY1d7qREk8rXVK6p4JGLNdDsdXmjj220MrgUVLNQtuDOvBUlLa0eAtD4pEi4YL%2FCY9b0KLMdAyDbQ5dEpNI%2Btk9uEXw%2BCDOXuLUS0NRiq7dmKmy3Q2arbQp7QZz23GbAfxNUK5muDRUEYx10SaQSnIwSdoTYtoF8wvLpjVcEOdAxDINlb%2B80eqN%2FI7TNaXhea0H90HUWQ1aew6xbUNpgikeWNKzYXtbzHNtAkawtI6eqgE8awh%2FzP8EW3NzwgmxmY2PSz%2FQKR8xdZedFyf%2B8EmapYyK6rBQH%2FTMG%2FUkwFZG%2BSj0FbJJiOf0UJfJZozWJJ%2B%2FYK0BcBDiC%2BMtz9b8b1fF2un6Ve8mekWYg9khooEsy4i%2BYOV1iSONqRyjx9R1rCYezGwXSGg6pYfnrQ7ds71f1J09VlpRi0lkRSqAQMR1XAwKNp14vKhIPdSb2q42ag4UJFsmeMmjYyNVHjlnaDX%2BBMF9UYDIDToBr0XCLdOm%2Fn7B3p7ONpIrykNTPietCNKT%2BveQFySxaOqKHbh%2FREtKzVFcWAhmSmnmEvbEOf8rvRm6EO03Ve3ZaJw0Uj16KMKeR38wGOqUBKpUX5ZvDgGbGC2aB8%2FpyjSgr8GWQtWIF5SBYbAZ9LYmN%2B6UdQLkdrIPDX4YKsQ9e0xreAyz8KIRPKfL7yMvOsbcYe31CKQ7KeZ9AGFJUcedYiD8sD4cOBxQp5y71gopwJTQq2kOUeanj%2BJNbCQTBSku5uZlZblmBw%2FErJUEky37vJmZIj05t0znlAxV4pWEl%2B1SWB7VbMSg5fhOIC7GTULLE8HJW&X-Amz-Signature=86caa0e218c6936d82f0f845a694e38e16da0f275a42ea64c37e86e8e5ba85c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031029Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=cdd9f7f2dbf119dead7c35fd8593a7ca5a7620a8417b5f69ee9977173659fbcb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ULBPWFZ%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031103Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAla7SYDVtp1XfwMoaUCEnkEdGMNT1Lqq5Do8UPaGoRyAiA1S7V%2BVSXPXe83vsIkJCp0QTRJwRLFbKaBBQPizW%2BBUSqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMr%2FW9VoB2EeaVBSbzKtwD1IyJ1o7H63gPQD5024gSg3%2BGzJ7apU07bsl3aTm26rFle8I3YzH8iSzdaGVSq9lV1G6gaoqVeZ7HppWZA2vALYgoAaV7ebkyxsQv4YHIk8AyKpbDsF4GFMEEW6wqh3r%2F7oJ3%2Bh9NA%2BSX7cOpzA0Z5UgOaicK5NFRmI5cBuu2LsFHTPnJg30EBNALvaszjCUcMGt%2FmbuAR%2BIuZGqQujGQSkbDIaDtxf5Vf9%2Bs6Oe%2FkmSZ4BG%2FNO%2FVbboxqoTWsoyEXKtMjkZukGfmOr9nqU2IBtaecucLjnpWN5GALjB0Z1ITkObmJIiJ6LMbul%2BWzxhwKWFMBdcTTvb0r6CKFRRZcafQCeogKRemxad3E3D0NvlcZP3AO9wPL2SsQrxkzYGR37DEuxPBgOYqfpMCkLruF9eFNKACHX2Y0n6YHP314t%2B6zsB8%2BU2O8VcTNCt6lBeZi1FADeS%2FPX6ZEgud1Y75JW4UYFtkTxoLi0Q8gOMaohnYMK%2BVVCmrWrYZx80JdPicLht4TF%2BNmgxxI8XvD9nOdCjNOth25Q43a0mejtWKNAse7MiFLIZ75Z6AiJbHIDCs%2BdCVAX8HJbKUt2XNEzDvJgX%2Be2zG4FQde%2BTx4AQNn23vRs1BeAChEqzagYAw2JHfzAY6pgFiGZV%2FY12qwS6GB4VQhnexUikAWeD2kq7WyvAJ%2BupBIrdnfKfksXe0GV%2B2HubG2TbZmfUqHoGzYZEQ%2FdNWjeBjYUrDCitYZ1BhBKV44sn6uy67YUwNlAICEflDMwsC2K3cIleiq9ApwxyklMV291rvXy%2FoqNXq7FIlLxw6vdyJCIHEiMAqv6CGXMKmRWe%2BFiG4rQJo4QCS9KU9HPOrY2Bpt7N8OxLN&X-Amz-Signature=d9a78af7ab08374dd5300fb92a6da55de625d9b07b1feea35ef041b6208527fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UTPK34LB%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD7ig%2Fl9oslWnGRqKwz2g43yEjtS4i7XJByIykjUGpSBQIhAI%2FSClnM7aBG7rcuQjD43hp3j56X%2BDYl6tq8AmqqhPV9KogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzYXdVedjzzZ47gAfEq3AMXvrEdoyQ1Ilz%2FnTCR3PESxVxzqUFQfDUn2nkB3IavjUYO%2BOjPFOw8zYAPI9hIBZw34IycXNiDEAjAB9CLH0PldTQlo0kBtdUHDeMPKmWb21W8nZrIjpAXhX7NT9ADnQny9GAueiNKp%2Fmfn3jEqtui2jzXbimpeGc6Pz6Qewn1Vh9f5D%2FR%2F1fbphXPWskHJ0xRQCYXG142zhLhR997%2BBtUJojjtMZFYL0o98kLIEJ2V8hqyuswYuB3YHbIwM7TDLFDaLDc7nj4Jzg38LQmxuJnjDDE5P%2BlTDii%2BoDqSnd34K%2BlkbcEDQ01ny0OBtKVDDPbZNcbvmjImTWOeHyi1glKw1lHU9Uo52RLxzMSCEK3mFa1dGCY8p5iuD5au2EM5Ks1jBrZwNOVmehtuZkZmvYCN0upZJcwByhfFS6MqsfdOcwUXv0ADd0BjI7R5HRzI27iYyqYAv3wVW3%2Bv%2B9SY4z2Bd3lK7ESJRtKxUozXf16U4vhUTo%2BorBdYeeY%2BQR1jWEuWQmyeZ7zbYrLMMUdVDqMyDNTAbIbOd8krdu08SmtX145Hyh5s7dTiNH1i%2BMZXyd0NqVN5X7J4ffodsa27fD28QA9xt7WVgeeMkP9OQVN0ruecZzT3YHHh5YKPzCdkN%2FMBjqkAQ1dXyjhqKk4guXnme0GXyCAm0Plbd1guebaSsGgpqdOCxNAsCf6RxufbhCYYktwo17yQPZqP80mT7vZp%2FDggz9BIOrJ5at%2BFuSEV0Cr%2Bia9JTbX8Wj01cztZFUJIqyUBIpPJZZTWnnMT70knuf%2FhfjgaUWLCnu8scdcWuMIJgUMQIw2D0xXzBBMebNLR9FJM00mbBjDy%2BPz1aAGr9lckScceVsS&X-Amz-Signature=52a1c43cf89694240203b30aa76e7c7651dbc182e6763f4889cd671d867c0657&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QQVTELKL%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC9wCrx7slyQeSStJoCnFjxRoVJsZ8q6s2i8%2BORJm0cWgIgCZhTdYHhFoXMAwfO4G%2Bd%2FQyCC6WxdDGO5OaMx2dop9IqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDulZEWOgcuJ0y1j0yrcA%2BmkQBnIbGTSS0eU%2BBFjnymrrTmfg2iGpUYDDs48W808pPCl34E281kOuYqDglH%2FRIzkXGmJf0%2BhFEm%2BsZSeCII60sZSL6ZqCttaj09bBkRCQTnHOecd5VSOC%2B9xqjISdiqcKVzHpxi9gkDrMEWfE8n02sXTSaWokfSSBYEvvg9f09RgvBf3g7Rfw54uczHQRHsrYpocCEoCg6K%2FctfzBD%2FJsQYHzaKwdgNFDAbn0l8vcQmPO8sXWWNO5HoHlalAzn0mxUxKlsTzUI%2FSrT89aU57KPl25A3KSwA0iCcTm8lmiiWVJdJTFw%2BxZSkz37jRX%2FGGul%2FOFTKrO22CwAkr%2BExDTgT5nCT%2FaFLDwyMg%2Bl%2BUzKPH5nQtrGN7sn5xv%2FzZgLPVcnponV2XREA7qpA8tHg%2B9KAiA%2B2EWVulwoALLpVPpEr6YERPmLNZ%2BsA4huoyP746uwQHxPCaSMBtlI%2B72zL6Qm75PhsLefZw1yFpTFNflFfOIaaEEoVSkPu%2BWskDDikgQ7fNlQmgyR2BvlJQZFQ9lDvENk%2FTa0bw1CZa77tkbzmywrvaJ3RfghJoUv33QVb1Ni1kG0neLoo%2B5CkL6V1ipJiOO5B40xavBc0mFyI3HKVbI9tobN71mrN%2FML6R38wGOqUBdiwu0UdRtf92xAXQ6vCnNhRmbAJ%2BEIHY3MGYl5HH5VAscasTR41S9sQU1dVVg26RFn%2BL3VG4pzDYoWV%2BC84yjyN5Gu4xYXLKzJJy%2FuZgW7ypJB6vCfCNuRFSRESnQmP5JF7jMCwLHmKl3ZzqUmYidmA7%2FG9N3Bi4TeHWXvdaLjjlqNvXffr1BPtiUHg8z2YNqd59IRa8oghqhx1Kap6C1AVrK05d&X-Amz-Signature=6023ec4ee8f9515cefe6b64d8b5602a47068f7bc92208f5afe2f758fa0229089&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664TV3K3V4%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC5nYO8jQutOEf5AcmUSg081vt4x8n0Ws%2FP9P9n61iYfAIhALpwS%2FcZFnefb0W8BN2TJEYNC%2F1Cu0x4fBH7S82U2%2FXUKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyp3q5P2T28IaPwYJUq3ANwPLtnAx43uTTNDBsuHxeEkELP4Bno1i7JuhvXcgflBwpM40UIFnUwv6azfylN5Zali5772xGm1W%2F1KcSQlz5Hn4rxjQ8VeM4cEhoixE2v8LnlVbEV5CCEfkblKt1AMlRsF%2BkZgZNdPFH1Tah11UYm1m90lWuecxyugamKFPuJ9ZmLhKCbxLPe2aYQSlXG1UwWK8cKb9Easu82ehkPahllMZAqFEOCNXFO3VHXKspn7WStbFYXRY0a72BLghajUAu2mknMI%2FXtQyCJj46%2B7c5CWMIg2rD%2F9y4AeOimq1fBDeyMDdwXFWVPde3qA%2FPMlo92jMAgtOpBz3Eyz9M8WW0k9ot3yCRpb%2BzzADoEZL4w8%2FDrnzvbXTNjOwzEMsh%2BXUvOTu9hg0n6%2FZuN9Ck35LCJIaWHh0yVvGLPsQ6u0PLwG3G5KCzGQgP3vpWzPi0K7rfx4wuoPYhLKnGqOLcIBFgZDg%2BlOixD5cYy5YCWCZwKYODslIrK5fgJhXM4pX5HMQEq%2FBvv%2F4ZpZrNH0INmjCwZMrWEV%2FnoaUN05IxqVVPTSNSiTXS9onDogEsOT6bz2vB4WJKYCEPmxb8L1LkVczCYaAaWuH6CeyPfVNLhaGp2Ps7amEifzl0mAq0hZDDFkd%2FMBjqkAfhjeC2ZBqs%2B6ShUpZn3NVJV6mq7TBUg12oW3OfPz72Ri6Jb9odB9eQyMnsgEPYjfm2vUa6Ay8%2BYPSbI2YR7c9U%2F7bGt8V0KJ9OMiJIsS9PLHMsO%2BqkJeliLiDihX0PCUYmk7C4wmBbCZh2k6zHO1v4utVD1luWFrmgxPY7%2BYTFZwkr93I4UmOab5XZY1Q2mDQsFtH0pQFX8mfyVH2Ytx6SizsCy&X-Amz-Signature=8b2b654d142881f76c773bb8cd0baa093c666ddd3164ead3c66baebb079b7118&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031029Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=7fef633e599d9fef7e088759bc1f9a5e64ed67c660ce347167302cc8de6f8000&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YYMPAMBT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031029Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSfGkwVkbf8ecUpxJbYnOW3LGkmWSUulrrdPLwmIjPYAiBsrBDg44OgCo5GALc2hm9Hho90jLs4NgFbHZPqF5RyYiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb54Ag7d3vJVwlM07KtwDA1fw1clycDduvPlc90Ks8JBxoe5ToobcPyIqR03OhFeFPlD2fdvkl55QHv8ZGK%2FHQXqY3kR6EfqSivbIsLEnUuFVgcKfcFiCDwo%2BbrVZFFagSBMtGfEa4E%2BfPATC5Oqg4SxpECwOyYvrpJ8rYo2YiKUpkt82R39o1iZMBPJVPyh5SQ07mtBpkpsC4c7D4Qp0eOZnAueaoBny6EwO2%2FX%2FG4RQOUkUtQkuMhleWSWjckb5kx%2BtA6UVEl50vRzKu%2BfY%2B0R%2BYKcgqHa1VVQyjRC73p5fK%2Bj13vMK%2BzWDqt8QukSzSwryLOLzWLRD4aDhHaLhus5PAksFIyTZnQBIFDOrOrpBQ3yD3GlsQekSflm3TPjiFUlbmuk9dEmvsapIZYPHVlnwuplxBZkIbPwdO%2FaoBziPcHMDjJeqM40PZ1%2Fj18LUAZpAEiXa4BWRi%2BCdNMfB%2FolyR9mt9pTs3Hiys6e1HGdmvnLgfhR24IYr97XDHPTbAAkVlDnXTTzMU4xr1dqt1DmniynPkLYvdPdMA19BlPumKRGwg9fdQ6BLaNhdTaexlWP1qk5xrRG0MIMSiloAmBb3%2Fc8zElg%2BX7j5D5lS4yVaqmKOv6V402aKwIUPzvkreTgMDBq3kgOujTEwqpHfzAY6pgE%2FqsloYEHowcZM1I38nAHMjhzuX897xzVRvXo2xpH%2FT66CzyXq7K6eOnuj3BxzYYlCa4OJADTmQck23o5NHZwo9tvqHwiYjRstCtJ%2FViNYZ346UIZ98GpDJXHfF1mhG%2FLtY%2FdwDdn43I7Cq0KiG%2Fk5Ui5ziSxfkcrtZ0Dkdh%2BbxHuiIDMkKshn79j%2FjTslBG0I%2B%2F%2BWdafdf40Xna1LmSjKgkbvmfZX&X-Amz-Signature=3f1ff013d9b34e570b3d8dc40b51b8959db4239dea566c76bff63aabec6d1850&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

