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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=41d7244bf75527000575fc54865fc3adfbdf3f6d6d451aee9624b71ec4d543df&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=b188eca0785cbd4d0052417d6a75a0efb56fda4bb3a52ee44c66e7b624201eb2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=418aa379c498f370af738aae629e31db118b493c4b0f980ec8412ca9600219d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=65321fdb06c328d868b890d2131bd7ef4d129c14dddfb3861e026bdc9f331a83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WBS6LPQU%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHq%2FdHt0WZBSZuE96Fbd0KGgR8ZXIMh9FN%2BksesG3No%2BAiEAk7WPrO0sJUXRjtZjqp%2BacWJd3MqM7EmP9GSXfzeqKsIqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHI1Lh8bE6DUn0ob3CrcA4nhdN1CFjq9KHB01zyqd3Dom6AxyVzOLkw%2F7oejKpdQDiJ1ZZubuAjQ0PKga3VJrv3patQ13emLEzFjcrwMlAbgRLSMT5Kl8SqLudKnq8yIUkw3HCXaVdUwvgvveKPPOsB%2FzERGTEfqXRs9IYpPwjN9Vlq4QNMN3%2FguNSHgRe8OHaKr8eImUgys9%2BQQPl50mdlPcxyRsF7iyGZ3WAdnnKR36l4s5%2BointW%2FUYVWh3cL%2BSBoUVcqNk3608qAO1mQ0uFDMCFXOEQno5LUSQcP%2FE6tZEIZP4y1ZeuLSSeTh37TxxK4MIoREuejGBtDDsN3qmSqtrxNkVUm2SaIUvpG%2B6QQRGMP6QIyeVZDRd4mU2EVgBfiteRO7IfZfu57SLFQJP4c1qqtFrVhwHOvhERKNIjScdjnMGaO4ZuvHWpkmuJU45mjYp5yiHRaqs46HKw4416bqLi%2BElfFPOSHMUN9y5d2rj7oKK9%2BkLAXGxtFKQ3EUEZGMuTKZcki248w6r9i%2BOtZJwcBzsLDayWnYoEsHP%2Bycs7n%2BypTcsKCUfrxQOb8ScVkd4LhDku0Hc8UNJpIG5us%2Fq2LJbu2by0BfxDyCtPMUni6jlr8fy14b10qv4sX37LuAMu3MJtYcYl2MMfupNAGOqUBzvCSXWay0jLeJ9aXRXMPZms2IPXo9kU47ip8WXWhjRsVNgA4heeLzspvj1qOKKKMK6RhGTzsg%2BxJRCIDcVDOLe%2B%2Bjf80vPc2tOcFXlpqwJ66lFJD5iLTkcAy2%2FwTVHBtsSfjmn6yJZ8fJyrL%2FHm9NHB1bAi1kp8%2BoCi8okj5G8EG9Sv0uq3yrLcUD%2BuuRy85bnszlqpES8I1REPpR4K6wcShS7O6&X-Amz-Signature=9b4139119186c7e333e6c5c52b34539a223d12a39b39b39602b915a3109754c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QITYLDFA%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042240Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDVeXndz1LCEJk6%2BZEjtN85JsnCYxTtP%2FX3j%2B4OpDJcKwIgef3XSMWybNfV7VJgOg8cmTl90CViWsCvLzeFSnnKzkAqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFVeYXXZJsBwGuABQyrcA8CgDODgMZgxEA2ccUpBKrBGyTVZxFi8b6dwskctZw0JacppSQJtjE1E7H4E96%2FWwW5rk%2FMxhLgpkhdvvZQFxpJ9%2BHo0UWPKD6rBdVPhZg%2FkC4VD7EyLoR8QNgXe9Hp5bH%2FzaMEHtczTSzDdGfeA08UFo%2FjnKCSvRzwFeaZQyjl6D6WAl5wzhCPkEX6jhdCXcWEHcSHg%2FsudC5MFC2tW%2BAybKV1m5tJEQLT%2FBay7AqWMlEWEl5tl0eWuDaz14AJHS%2FimkDRa7YHScCurXAdCS0d6PKN3cyPDBJ7g0Wu0eKa6mvVj0mW%2FcrYCkoYY9upZjvVgaJ74vikT8oIQZpls1scXCzXV3EbvcBcBli2j48mksXP3NcLTUIZaB32Vx0lv3tC%2B%2FAF%2FwM4TyFXgm9qL%2FS%2BLwsE7z8WSezcNAT5RsEKQm0l%2FrAA785kM9fK82P7dJQbu8d%2B7ZtWtJGhW5TX7AvjnJs9%2BD4KDo9HODJszoe%2Bhi996UFMIrUfYUa%2B%2FPMX%2FQgPe9yQILAIH0%2B4nYgp6CEu%2BvIGQ%2BVlmO07%2BFJMKzC6iN0A9yBfgp0VI1DO8bzItsTVfzcAS6qQWnNYS6qI8MRNArFwgJMxsdsp9OImQwnVX4pHCHQDrqpHQzItSMMHupNAGOqUBlxPJnPQOz%2FrEu1AhclZIkp5zpsp%2BNSp6ef5DGb8%2BPGEhH8dUq5A24tF7frSbd9WH6fgpYFdvHqdLbZbEcxdPQGinQOoxcMOrqIoWS%2Fu6pc4hXJkeLWFsNy0KpPchic30S5wUn1CqX1Jd6MOYWLTrFH5mlzNiDU3n4nF2zC5z1n0EZTYfh6sMIWcRnZzaJGcuhV%2Bry8SmCe9fq9w8aEvxOQMRkJGb&X-Amz-Signature=d65508b80386d35e599a439ad81d004ef1aa8d42921e5775cfeb60257f580a6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMPPT35A%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2BStb5eOrkOt1U5wrzxGjOuDSHk%2FikL3s6CfqUgeSFPQIhAKpTW7nt362UawYX4eNNv%2Btx8lftC0V3Nt5wAY9hoRpeKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgytaPlnXknRNUeBkxAq3AP2M06iaKNFd%2FivyGWb6j2Yn7xzqccFmPcj%2BSlzf%2BQye2KMozMfD5aFn%2F21icCnJlGG6sngsCPofEi17XjSfoNNxLtIIrl0VWIfHrOxJ9n2PhYo39cWPIiYWt3gL9bVAa4%2BeTKBncP820cTAmkQ3TPLmeJA4k%2BkQAikhMSdEkCLgzKwAcX7bdG1dTiURMLrE0ImmKdKW08nFxsPKg35E%2Fyx7arZZY0bhL4c9gsx9hoHm4rdWC%2BeVXIwQGpR2DOOrkpsA1oXvx0EhFJQdpimFXzTpxaKeXn1xJueX8wdnRpZUp2QY53lPlK%2FlZcOV9patvSusqWhDEbQZMu9cMUIARufek%2FKPrZdbcXc2hhbYRU0p4FK%2FAKnlcOBtjvGf0%2B4oWmn%2Fw08rzvgpmfHUVJW7hxQRV5bCQjRlWQx0d4s%2FGzHPfyQJ9hJY0YLtfBwSSmcPksGN3S%2BgZhA%2BAkZd4AWfICLaZblNfoK%2B1jdKVVU%2FMv63QVZ3f19UJnDp5zXWzf1hV2vrElj0M73hjWJ%2FCGgG%2BH2gT%2FTbWQm43S6E2MTGlUyG6YJA8%2F3TCPzMPX6veT3uJDFecJXE1SqrOZ2K2cmsl3L57cXnlmF%2BSYmO1dUWY8P7mKZ1PNsi4mQ2RWOzDCE7qTQBjqkAcO2sdmFrgHOZ1jguDI7M9o%2FnIcVUnbbUXM%2BwcOpttQfy8bzshZ0z53Sj80IR4Hdflt4oIIEGFmKpTM%2FOVeJS9ltmDcRxDpITmpgAj9HheabCTtup%2B%2BdaVINmE%2F%2FAiXiZix805cSrZun%2FzWFFVRcWx27k9VYn128WEWISAU0Rkz60iEYn5VrEnmY6wcJ6Oqb1l1KY7Zz96WnOMHd7bAePGLnE1Ui&X-Amz-Signature=4e033189b80dd4c730f9cba82bb7fcb9d5d4630ec46282a7b4bf7392bfd2e927&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QE7ZK7I3%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDmVith%2FGqfOoeiQfd3M3Exmw0UlRCfBjiCmwHr72%2BI1AiEA8Ide93LiuGtFzugiGZD9V2CEsbui4PcT4PubMCu3xBYqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKpUGR3f1ZfRhzgLMSrcA49zI6dnqCCMz5xIBynaB7kwmKavaRwx4yhTB9%2FOC8lUhMwBH%2B7V%2BFIUoXfyhXIipwptXbaGiLGRjSjHe61qXoCIG93QVXRc4XNXJFw4N0AhvFUDRuAxbBAtoQ28GJBUAg7sX%2B3BIWmwIT2TQgpflqYtAEIQ6ocjQMdd4qYG%2B9dE6UrZWWr%2F4DcXZmDbmPLL8oCgZjwQRIJ1FjGtWNygljuggLxNO6KvAg9RKb7cFd%2F0OKJWgGaVyr1oiyFEPOB1tv%2B%2BzvTmyjA0Dap0mETZltTmthrPt%2BVqYhm9LvgXXhzCb0s1A5yu9gSkMWwEoCTINMISogrzwn7vtLiwnbRyawsA13a0no1pNjuG0k6VG4ZTakG9nAiB2B0ptxj0x9FMxyLmo4%2BWpztj8w%2BTC7ZMIoNQDfEQhNlf14ktkUNueFK3ctJzXGJdMcUelcJcGStcuaKF%2BZuYK57c8WbGvpWsfSoD1MPc3Np8zU1j5zGBP3HSSO85BM15Ie04bB1V5bUNdebEduK2SMUMih7F4Bsk8gyFZocVeqo1fQ2quB2WuhZy1PAfe7N4PEHgeyBltvPWzMyc3uKujpJulNaiTk79lOeJc5OUJutnbosfhuKp1xGxPKCeKHg%2FWzSssJgPMNjtpNAGOqUBZp7cbeQz0ZLYkF%2FcebTr1MsDSWuq5MNFFO37UQaYSQRKGfx9nrgZTMhirhmb141B3VUdAQ%2FugqZ%2Bz2z2wnP0kDab1nLh6dai1I2y%2BjMRkQzNwfzgC1Z6EFQU7yOXGdcu2QULIdeIhEZNyoUP8pYlavD4ejqzI532W5le5GYtufi%2F1iec%2BzcW8LE0jvs8mevegdv541tkloO1XS3tpY%2B2c5ohRFOC&X-Amz-Signature=57595aaab2f95b02256df0f5425da7567088829ff3772ffb24130586c1e9bc9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=e21819d45fdd58d4a435f1b3da481d634bff685877ede09b5eedd27b90206562&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=76d4cb10cfd563e5a2f3bebea0f059ec7d7d04a1870d73ad575ddc37d0ac5751&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VMJLSWCI%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDtHW9gb%2FqdlZtgXGfrGF0UB2SRky%2Bc75C637nUymv1pAiEA2uogQpWB5Hs1TQb9peu9AbRTYbvHBMt%2FGcqoSz3HIOQqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKRTCSVHgJJS31ID2CrcA%2F1GdOqYr8aDwwiGqExYl9MBuv4MAqGS0iJB4psxHgj9CfkCD8xFuLlCnX4JNtdD5saSaQT0l0f%2FUrU%2BdVTa865cntfj7ejGiqztiqHo1t1faD2h5zDwXBBs6owOo7T3E0tNI1uDu4MRTeJF9Emha2zmLExFskGZ88JwCT0IEX%2FL3IEKpL6YbnYSnnseQNexBTafS4Q7FhhMneuQVGHcL3dxJGZ1NiiW1b%2FazBjXvPhxxyJqwkd7TTF2ctkCSu9aCC8QzJR1wZLtKSEH%2F1J3e0nlW%2FhywRUvURoZN00IB0q6Ei3q8E7i%2FbqPcLwQr9L%2BqcOeTkq3hdLAmI%2BHNcwhyVpYmSfkQzQMLqpPLXE5NH1V%2FEN24UboBvX5DGqMUDSFs5qf85Hbf9qCARAUZ%2Fd%2F2K159aN52RqCznz81iDeFGQ49TH6OsoHvZJFhHNVTKDplcPs0wyHoqu%2BVmOnzhlV8I8eYIk6CM5mCNkNS4S8EeYipkNWy7V1As1MpGIUNmn65xOUixRVUw7q%2FzxoN%2BHedSEHYgr20pMfi0hGU%2B2r3NVKQ6QAiJtutlcZr6BLhp7%2F5BaXvy8TIva3c1JvzYRhIMRuNnUNWyETgPKl1BeWa2XveY%2FxnFGZssreIwkcMPXtpNAGOqUBkPQFpRUumE7plXB%2BRR%2FiMexv6NsQuzyJtoWRIITXR0WzqWNEA3zlugDjg%2BpkzTsKb68RgLm%2FBKocQXAt1sHV3hTGfD1JlFwl4Mm%2BZsE0SG170vWV%2B0QfbC2klJKBN09kQS7d7ylg%2Ba3h863XfrMwqLKNFqMP5Vs5rx2CKiU48NzDBSPvfKfMPOY%2Bx9jht6ytaokGxk8GNOwB57BFCESi3fyoHOjl&X-Amz-Signature=b2c265e8e7920d84162cdcbe683d2ca299baf8460779d7cdd0a7667fdd14c7c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=b9b7d0cea71251ba550757e2172c70340536a78c1957a4f2aa7135202c82c693&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663C3BGCEL%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAXZSwHMV8aKG3rcKgj4WukDs5geSGMm061bBFwvBEI1AiBekX1yFhyEbBJ6LNxtdGBKJdAIMYgD31L6nHzbyY4c4yqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmDvuMHh2GHYWJbSBKtwDqCYrr%2BeBOlC33YNKwGi2rI53tzcTI1vZ4jbezvnW8gzoMujMXfgQxG3tgAiz6z7lT4hrl%2B4v06FCmsryFOYQVMPBHZ2YaOc%2Fp7jzKJnIqGAvoJzoviW%2BYAW4LT5B7MWs8kMCEqID2ecuVluTGJCixNBIxxAYhKmkVy7rhVwlltt5nsGIzDSYFl6VqnQYacLj3hH%2FetmWXad%2BP2eDNjecKf%2FbvobU1wLWUj5CFWqu%2BrOhNCAM%2Fy7TP%2F2APN%2FZwX7lrPvPO%2FlMAaTcjy%2FVBXStjEBNoaCAvu1KbgeunnFc6zxTXkP8UKz1digOlzP%2FfroZoiKvWdo41NqOwR3zxmwrzuKNBF2yZpvB2AE58Xss1I3QVu38nYl0DXsVsjCmnaMuOe3%2Bhduh7sWaO5JWPoSXPSVb039Hi2qIzH3SbFcVqJaKIbds1hkW64gr1zWNPtDIyHP1AhgOzzrrcEeQEr%2B%2Bf2qorDBO9QWKtbkOJPfsEqhgXCiJETTCDZAhMbW7obueEg0IvFn6HpLmP5o727P7Ry2Mh6NJCQW62Rj3o5TMG3PH48%2FQUX9h3g%2FiJKdkttbxSTmF29dhmGs%2BGWrM4Zeht%2B278EwsniueE9ydyCSGmvcEKCIlels5rOnNRDUwou6k0AY6pgEfXUoZ5BP1BBC44l8eIe90fXZBQ7uBcAo2hbh%2B9nsLGBvMMvPzQA2xkPU85kVBkrEUxOzaVD9eHlfc66VJ1YVnzuE4Wz%2FFmC3f7WTHk3DjNFyzYmZeyFh0pHCCZ9oOxMjKyD%2FzPo%2FOMo681S5PcJhf2as6p7CB225vyGfMuz3FKEg7CTq%2FVnMU6ZqsF4lA%2BFu1aTebmiUfKTtDBvHBntwJvmIp1oMI&X-Amz-Signature=e40408d4083f08982adddaaa03c38844aabca7a98c04a34e576c29271802e27d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VWED75QZ%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCpay%2Fo1ayZeNLz4iUAk6O5eGtiltBk9Z2kKZLOfWI%2FIAIgOFZdOeb2eXjxxquNKtPZPYdGoB2VtDZUcQpk%2FcgHVVgqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGE%2FXSPTrvz9fqgHdSrcA7EpnaTenxv0%2BxUXUZmahZrXByt%2BLo5TtFwz6waMNKJ28zztHFuXRwqS2C9MNrVt9%2Bxepkl%2FQJAvONTaQ2QFWnnwAc0PZ9NdbJfzwhiywNqUr9D7wo1FUXV1Qm%2FS8KSXQvMio8f0U2Dt%2FXZKrZO5EXaZREW%2BhFJyItexbi%2BoqMWCJB0m1BhIbR2IfUtHMup6wS9C%2Fa3q9gIeJynw3W%2BAQvNHzUoEQ%2BMbexaTqOK5AnnNJxD71GkjOnnBb0T2ubtbQvgl%2F4pJCNBu%2FQn2%2BXkORygS5CB39PfBDz1lcGQzmq5i6lWJcbA2IiKi7MQoUj4Y13l6TRezS9p165VRxc7LkS0XxPvmq%2ByJF67jV5oaJ8PiVjxdmloDev1mEO%2FnZot5sQ6GPw46eRyjUYUwgoZ3xMv4vM%2BjSerhwgW35Kf4b6dKwjXFf8xAoPzNDv3Pp%2FRCYyrhiZ%2Fqlhj%2BzxNmUVWSE%2FhYgp0zValqxuK5t8zMfpD%2BR72bvnrzeAWM9A3Xzsr%2FHG6ncevXkIhE09OsdJTxGHlqmXNXqJNJj1B%2BcWyILTIR8%2FlJtKNmMOGg8UMqZ2WBAAMXaW0RYZGcuwTEJ9U41V%2FBs1IYH1yaIrfzkQrgSx7%2BJvjut9nUH%2BbPbkBiMOzspNAGOqUBeuI48LsQUPnuigCj%2Fb98paCvyjt5JiNtvvZcS5bTwHlt8wULUvgBxUMB2dAZukz9s%2F0g5k%2FzATHvrGZJxBJySCTVBGmlQ6wc7TmY57qKRpUsyk1CnrhwD%2B%2BohbUv0GlGpziQI5k%2ByTZbiZExvb%2BGqySQokjdjw6sa5ApYiXaTUD0UE4tsg4vrBjhda9uRhBjH00yae1V3XMK6V8JdjoApFdGk7O0&X-Amz-Signature=da8f1ddf087b801820cc62c2f847f33f914b40411b4af0f3755f7e9709e64372&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666A67L3BT%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB4pqbLiRzFiVkmffEHXgj9A6ucnsYLAgK1sMGNybVdGAiB%2FDuvhc9VUS6HMW8T8M%2FHg04UkE3UaWYhrejMMVGKOGCqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMbPrhqiIbMD%2BXVmKrKtwDBNqgTz8gaCKXd6RwlsViK42emZMJ0ayKhb2Grszs2qutM9EPBnDla7Kmj0f06zx30xA8BfH67L%2BqNlUX6KAbf9UR5yZVmpzfSoAEGm0IUjdQ6eT%2FLmPaDQDfWpf2dIdl%2BpK9Uh9Uj42z1datap37zofwRBqqvCvZwDUzJhcQtsa1aBL1bORNUXpFxLvt5Tmp%2BeKhNSPZkw4Lizz0kOf2kA25H1hJ8uAhToLP%2FFwrWCN8rLlCbmkj1iw%2FMYRDy3TV%2Bt7WfWqYhaEbyJ8h3jYP49HUIeu6cHfSxm1q3p4k5r5ZZq%2FLPmIZbRCACWmqdN5ljzOg9b42Zi1cgn7a9bufgrvOxieYCOiBtnKJO%2Fszi9D9JW3%2FCo0V5FJihtTnPRbN6H41fezyKTJQWCqnWbk7QDJiv51cdJ4oIZrZypsdJjCu4sAfA3MiaCNhM6n%2BpprfSeub3bRFKCyqXP5C5eS%2FGIi2M8P5hXX1WbF4gbE9JcL0GGHcWuPr5Bn3MMPcVnKOfJOhNtP8BzpnVH39EwLsWlwuCEWxrklT587q53%2Fi2EFw1aK3HmTX3Lx4YInCTiG2tiblLsEzTxv6UVDVIF3wrPvG%2BIQNCuEc1z%2FApPOwkC0UIC8HBydHPmlOGwcw2e2k0AY6pgHeiXHtmQslv20tpgjVVManmNO%2Fsb2P81%2F3lKyj25dAOHXAqu5C6AmyCJjJ0LLdmjE0e69IOAuZrJMpmA8xJ0KtO5QJQQwa8eMmLstGDWCmoZpWR2S%2BpcrBh1j8zUd0DzLwxXbeOwngip6Y86sXs8Q%2BNPHAmFyVicf%2BXxbEkFvirgEzp15CitGy19qqYIPxQyNMbKwvYVhBU318dFPCtlu%2F9i%2BxpXuC&X-Amz-Signature=bd075f6fd85277f6d53bb957f1d0b50d003833a75231485c9f1dcecab7de4a70&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666TPZJTTC%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2Bo6VLx%2FBA367WwHgE1wcJaAAWYpk%2BJPSJJRTgeLqh%2BwIhALnU5uJV0EIGwoX0HYca2WbZniWApECFOsTC4gFdfSAAKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxmGmjLktEgyIj7IXwq3AMeI83wh9JtF%2F8NmN%2FcOKJziz7O7CYtZeHFnDtvpTnR2DJWq4FSRIFhL77QXucR66CeqYOBXAMmJnAPORt0WjzB1TRwglUmYN%2F2MwurR%2B1LxNJTrquATIakLX3wyElu%2FogJpxAr2LR9%2FCgU0antWxqE9XYHrZIL97bgWixLKjfhG%2BXOA9cLiLLd3J7g6hD0UZk3j39MTIKm4XxNSw5uF2ASbW92BUjrUVgPV0KQ2KV2bPWFOnOmwf8ow2OOyCD9pwTV7%2BWRqEWzHIY3JzE1pMgnyWfOmstdpAl7AQ1cNDzwjMgmvAbfZKzcHP4ZF1pbTZF0RNUlNTpD5U1HYhOeOSRJPl3PlX1MxdOG6PWWBm2mCsrdXpBn%2BEiaht7ImDQ%2B84IjwxoP1gnAQStPjxf7oWVq6Eig9Yz%2F0Cxec1lG0oPUxvXqew0ZjJ1j9CUW2EFoSqnPLyyk5xzY1%2FHXfB7fWFA9DnGrUsG01VPhZwzjBvSYFHNpBICNxwd2dYhmbAObSx3riagwbME6nFKVh9i96w5KoxdalqPqrnM%2FHz1Bu4SPVJ4E9IIjyM2p%2FsA91oTqnWZgZmEjuESF7E7MQv1QXzJAEFsbzpYD6prPO7kxSkqPc9KwnL%2FSdmiVBDDkzzCb7qTQBjqkATfipYBJB2LYfs4O5gaIXLU1aP944wiFujHqh2fwlS5WtLrvZk0aTESlRmx%2BjaveL68%2FkY3DLJ5LrqoHZceSKbzQ%2BSAb0RarMUXt%2B2kBA5%2Fzx5atuNrQRgpxBkeUaAxBA08OJb%2BEd%2BWrHVdpMBVdTb2mzx6r6W3I6Cob2LUaHELaQUVj0KnHtWaIJHpOdXc5SuXuYjkjtwVIGkyzV2FBtVo87%2BZ1&X-Amz-Signature=1fa5b849d82b74e563fba2252215bde111792605fd613289a5827c2b1b291919&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=8a8ee23d9216a2449ebf7b505ceb6027d436ca893028266a09d4a24d2ecc79c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YWUX2LO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD%2FWDGg0uS7LokSw2HdaqoayGJGRfyI61a9Q7g0OfzmIwIhAMIr88dVhXxbF1Z47%2BrVEX8cqtHYYp5ns0AXTW8bmIoSKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx7l7i0Sj3o5DsgHPAq3ANWLtdRi%2FFt6Zr6zEmlmoH7opkXy8tv%2BZaLJRnuC2IJlt9M8eZ6xHfAh5m1CUPrhXSkD5Imij%2FlN24t0jHP0qDVqMyip5PLUZkzHWJdrLsgmnl73RLZ9MR1CMwv7HxcM%2FXPU8ETsH0FL%2BGBUogdIlCB%2BHhCm33lsDnQGrzojb6AISmj0DkHcsmjlpIklYC0TDDjiy0E4GbQrXsewuOQAm4b7Odef2fL%2BhYJrMEpXBdiktXjGR2ktgX3v8wE3qiKUMuLu1Kj%2B0daHdNskYRhx2mW1WcLXf%2FRNHc74GcvXVufF7PAu2SLOzamxYYIlIo5bVmBWeVBgBKv%2BB0I8GbKCvVvmQrT3GDk90J%2BOnX7XlDCytQbZXd4LfLULXCL9a5JDwcq7EIoo8Z5BVuVmof1BbKH2lzdv2gPp8TWmZJEi8svd%2Bu7duvKWYWr0tki4VMV7GrHuQLqYAVpDLrg6d8YeXkIiiQcjBxw8%2FVsoc5IFv3K%2FmWR5v3HFHJbWbHXJsF5JE4De3qnXzQkeDGXsHct570swebD2OlhzZMJ59VB0Pxe02zbkcCoAOgrSNDDxCkwcvhP1zHYEZl6FTqyC%2FxYeEdzG4ijcJgfu6YLb3qHBFZWJr3dDs0xpKuBNXmWQjDL76TQBjqkAa4cOUzWe9aOe0oPtGkQLTMLZsTrfuRi9AzqY3ajSw4VrnR7%2B27P6SBYiwbArolcIl0zakZ7pZEb3lj1ibjq%2FLKAryX079GKyHLSiA9klcqSCFeWPXlyiDWxMlxxySx6iCVQl0SQpCCOt16H%2FuetZ%2Fu%2BbVj%2F3OyoHNrrpaxx88QbFKW1S1aIIwRPk0Z1StpyX5At8lqLFJcm3El9Aux1sxBn%2Ff5T&X-Amz-Signature=81f3d8b2ba69e84ab05e2b1c065582c4d334b8eaf52eeff61ced951c7a0a79fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

