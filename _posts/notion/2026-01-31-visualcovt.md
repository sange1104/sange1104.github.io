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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=ed569ad7aca23dc5e60f719f108f62c1bb388f718cdeac62ee1836ed5ee5b6cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=a20efa4fb084d4ac036e9c1afea7c34837e623af9ca5bb6f239f7cc5745051dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=a26e0b334e34de268e7e671d31003b0320cb8887a8931ae45d5edfdacb6f954e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=ed70d5613dcf1967dc98797451e4e08961cb354f2ef64481ef5caa6c9cd2f945&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQ73WQYQ%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDi%2B1YqSLgeTPwXhrftYvoDK19rJ3e1SyX13PqT8rEAGQIgSn9WatTToZ5cyWlk4EL4udnIxHKGM5L%2F2CwxJRPVtfoqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNQw5z7%2FydKYv8VafCrcA53439qNa%2B%2B5ReYa9ZIgBhgYW5ydoL%2Bn2y1oK9zD3YKGXekEEqS8jB7ajth9sqDvO8BefSAyrrwUDWKdiacpxqh%2BmZbqvl3VElL%2FWmArivApQABtMXVL99rNChuTtH%2FQkZXCK9bKgtD7DIwt8WAurD9aAfzb9XMwTm7x0lTNVsWCu8pjp0epXDopQPsFdS0q1dSXhCKzjcz2h2%2BMtls2mxsTW%2FSEzHEaWjEaBOeXZyKUe4WVee8h4zlcOMYFYSx8Hdg4vC6yOLA6zof9w%2FogC%2FzeBJO5oh%2FrNNIYFeV6d0ejY42zhn7hc1BAQlhLkkX6Nzk%2FSPP1babJILFglr5Y%2FQOK5taF4V4s%2FbC11pXR%2FnCJIIpsQm2W%2BwsT4lHKXIrL9NxsybbRwpX4qKWGu%2Box4F73TL1i48xWRMktIJUrGjDhwXuC9%2B37jbokQFv0xCvTmQRdPGBMpH7Q%2FKN0MQ5hu8x45exatNGAVNzLfUq7EtB7dlSJB475h8WlSocqxRmOkF0mNreObXIpuuXgX7QgkQ%2FH7QXstxmqj0AGmnhEdn6yvd49st9YCEaIeH11q0xSbUNvGsOQuYXd1qo3kBhobsFejfrFdClilYG94LQPSLceQBzOKPFQvx0PM5hzMPzg%2F88GOqUBlDZ%2F71wSR%2FQ%2Br7YNMgRdkST0pk%2BdrrrNrkzWQs%2F0lIeYFpLFWfUnqYLWTS2u1an5Gfu51977lhSI9NXJSz46wzihojEKAMNM780ufMnczkbb3R4g1eWy9SIQLGGCuazk8OCnUl2ZqHjSXoOCjPNU5ZdVtHAQyJM16x15y0nww7wnTOth0KpRcbR9j%2FyEhZoz8%2FlbM87u7DOYqtShWz01Ro4F9BrC&X-Amz-Signature=61c97a6aea3e838f11834ab08a11a7ec259e78c6fe72b820cba665777cc95508&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2J5QJWT%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIEn%2ByChOKb%2BdpfjPGO8oNeyEP9pjIOo%2F6El%2B6pQWaWU0AiBVqTJO01TI0AZaY3xuTzl6DFmMhCC7tO%2Fobs3sGByPHyqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMwwxf9LqlkJaasJaKKtwDcpcmjKtuWRoXTvg3Bw%2FmgGTkTSDf%2FrWRdbKXpOFep5jod%2FBaVg%2FiN%2Be%2F0qk5xFroYEeHFTb%2BF%2BQtpWIHdD7jqoXQwy4dYDgdh%2BxtfhFdrGEnXrcYJtbseOrtAaEPWKj7qKFqPdDbusJiecscRLVnUkTqbVsjika8UxuxIPadBveuHLXdccU%2BvP3%2FjnQWUvnanR7A5PiJ5lBtZvb5v5GrheBFa4tsE3Q%2ByWfK%2F8jScXqYLhQvhaB5%2Fwkspej8gjBH7PvQRGItnVHj%2Bzcyf%2Bn5LAb8eqpQ1YFhj8Z%2BIvMf6g%2B725kUkPKkxnPYIqQ%2BvN39D%2Bp%2BEjJbiIcGZke0EZY1ykTyY3Zo3lIPwvTTROCJ4bSas%2FZm70ijA0MYjqNNvZuD6Ll61baanOF3%2Bnw3vPT3vpq2FzTylJeK28fTrRz0TqJSmXBDmeR%2B73D7%2FvKpJYuuJZBzZD87u1EHftPTIE9ggVX%2F19PLzyHal3Z9DMJMFGWI0eu9DCyasOY2f3q4Z1S%2BMqMdNgDtcBEGDAnl0b4qop3TM%2FWTUML4v1h6JiDaWIUvw2295j82aPRtiqhYh546a1x2vYfjfoKOjRa8scQJZMpck%2F49RmubYfIZicR0B8LGtQF7QgrytBsNbpgwut%2F%2FzwY6pgFmbJbLhxWEZq14cYaLwfrK4j9P%2Ba92GluGK6A05FDQCm8XKXTl5DpteFhnwdxZAlq5ZhX4UxP2jyZXyt0RZeNuuTCaWZRDKELsoVVQ8elBHCPrkElY1BaLKA6gGg1sy3uU%2FCcX%2BD2eyuKiJ3igQAzhvFEojJl5sbe4d8MeXvK0zHZcFYlhMNhjPbDORA%2Bk2ATEQNk4Vz5f63AgeWlStJptlaZl6YF2&X-Amz-Signature=8605a7142ec3df86dc259e0326de2da54d0c7c34c7b38cf7dd827c9c6a1eb945&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XHRX77V4%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIBWeTuw%2BTRLz3z8zs8eKcMN9rVsCmI7qhIJ7xKB4K0V0AiBUwvukhsJD2tMuE5yId2AKJMaBIz3wFpBGYI3vwxIxMSqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJDWxfIhPywEUB%2FfpKtwDc3xvNn7BlKYQVrVJt0naxSTGDXjEKUSFHFSwEDnpDIbrTaNXaDBGxk0GDyDSkFpPnvz4Zt%2Fa58cq4PmPwLSLC1f%2BwJNX9WqKzLWehhaONcwGAqd0XbRA6sgy6hzEllI%2FypEXKpHr86eyIRcGVob8CNJJdkDXYeYZVqTNRgFUehm6PxGWCH2%2FsOq2%2F6mVMEQOTJ%2BS2xxY3zHbIx6zU%2BfSGV%2BNbBWk%2B3ZZgchg%2FQ%2F3tOUrh21A3ZSQ%2BcBUxHj%2B8CFEPJNOA51TQoUfgyz2hUzaB2DSeVnXQIlojU2TOA%2Bm%2Bft8FvjKMKLzqbWWCYw21OScnaRmsz6MZK6i5AaaPM1dQ6cgFKcUFJo3jmznqQMLp2w3GqZjafLym53Xov%2B3SVW1WtsTjcgQXjRdjb2aUtyjQ5OU0FHq%2BLr7EZNjSHPHaCue%2BkdbdtpmI1LwVQXlvM5obWJ0PT3vDhknKjveALjbJXeZ5tpUMhmzsB6aclgLada2O4Gbno3hydr%2B9p7ME%2BB7ECvd7fo0zK%2BRhrRX51zCEm5uqhIjf1Bj2B2K2b2MBlIQFv9Q8ZbWWuMP8lRvwaj98fu3NzzXdq7DnRvssBonRhfR21Y8Z1AAtdHSzFdbLapyO7QcQTL3YFlWRcUwgt%2F%2FzwY6pgEPzXCXCYMhiGKzg7UJ27FLFYcM9r3XG7z1h9tJxZm%2BxkTb%2BBZAy%2F21IxVyYFC%2Fkz6JO5z9yp8KLEyYdZWVac4JUNQvuto%2F5jq3NWKaJUC7BA%2BBYQIso%2Fhi%2F1ofIB6j9zGEq04ye5IRV%2B%2F93S713KKUKfd0xAJRXQhuuDJmGqw1fSyEsGEJhKZJbg2Z%2FruONGymcmBca%2BpoC20%2Fa8ar97aheDs4qYw9&X-Amz-Signature=8e563dd3584a93ddc943695606d51e4bc3e280e95dbbf30ac0b8a22a23ca0e30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VHTUAXXS%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIG5ApMp4SMFKe9zpMEMULiLG%2BT1FJvkFDe5cRSrffiJXAiEA3nMyySYguYLKUp6%2BXviU8myvhzGSiQF8TWBYeRrMa%2F4qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKLn4Lt9SML0J5OEgyrcA6vD%2B%2FhWaBiPqTVyUhrvndFQHBXbiuKG34FzTg%2F9h318xH3Uo335bWfWxUAXcsED0uZEplk6jodp7dxk126U79P78oy7ri78xoWofg%2FSnKTbRjvBIYsMrGYudTNvLCIQGO3apS%2FUKm1vk3oguVtuYvrEuhP4pCtsdSkV9IxQnWtk397FDq5TaS4B0zheudQUXsX8MXwxYfn3UjK8fr%2Bo9Vd3f62kKIrsUKFMK9quUnF%2FbEic5fKvc9bIxBd6XWBF4A0VtIYFq5QqJ9Sru%2FsfmV%2BzcMP5O5%2B8YFXxR8P6dIuFOk3sWlEEeGnZo8In6NXbuV8X4c0fdzBhFByDzEmpvvM%2FfqNoNcoV440YVNnfJfD7zsNiJ8a3rV1L8QxdoxmFiYGH2%2FVpVaoeHipuOfUJuv8macVa4%2BYVBdCYugW8JDSU3pxmnuAKS3RUoqIbHx2XNSnFJFtDk4OhAfbJMuwWaXyFb0Oe5JLBXsWwtpCJT847okmtj1xjbceMzxvOdBAbV%2BZ9zPwRq82kjxc4%2BgcnEzv2BzyMl9DJcgk0vodCzGFI2yX5bf4fX7RMtFzyqG3LZnycBgn031Ckn2gAMLMi%2BprI8W9LlMNC6cpXn4PGcQbXeXjJ74a2RDt6y3YaMOLg%2F88GOqUBJn5idP%2FP%2B5s88ec3smlrYwi5%2F0BHlmRgbipOe%2BtlXYWBNZ0nJEnn6WbBcZk1Hh%2BdWBvqNbeQAoExclcw0N%2FctpA6s%2Fe34e7GYrIz82yDi3mrkqYUYvDrcci2zo9OsZtyMPwI2f6KqY98PUp0JJDUbEs3uGgAUV5TTBZ5sFUUtLNNDjCnXa%2BjqxKPz6v5L2NXRjnGx30J70qp3Zw3iblLK9OCBnBi&X-Amz-Signature=8d2a1c36eecbaedfaf96b9ba648f1b0311d4e5b15852e971b280e8a56ed929ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=2af669f64155aa43819a3e4886f33606bf5da636f8ba60bfeeed5f85336681eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=941f58ac33c585095ee316882d63a82e0862a27fe7a7d1a20ffced93bb67c90d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666SEGI3XN%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQC%2Bo27ipB8keS7f6IcCbFMnk%2Fa2h2FBtiSCMt6lR%2FafDgIhAI0xJYmUnM1aiDCG9nrvVikD3WFXq1b2ao1COCop0Q6OKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxfJJQWWUoMPCVh5uUq3AMEH22%2F0hPCKUQkEiv%2FsSTMYnyxachmK9Q%2B41o2sW052uwBXtpaBLPn%2FKmQ7eUAx%2F3pDZHkr8jXToe8PpuT5dhnw4yMKeF2jXjw87d5T8lLoGsI%2FyZgmKavy8BaFqAs5MF1r%2FwOO2eQFPfpgJeB7ju375hKLgdXEr1rzLXEAzPpbNiznN%2FC6cBQDf%2FNKNBn6CH4UiJXtNxJgvL7hXu57pJrorIgk16%2FpTsKcix4AAzECohOXq0JciSKWEqyllYX7BdIT9AWj0LKyum8fgKapyln7gy%2Fv5sz0ZxmYihKrLZ2NiIKaLvb%2BlIHKtsBJu2XMqj5jEzYDj1O6fu5mmIHkRFjBoq5OuVXaMBN6nhXfihTVapEl9OyY5tCtnZOkdtKqNCbYQmLfh6mRIYUG50XiemhFJeyN027bkJdqiM8gLVAGfAyQ3GYWGXItCgggwEA7r5ZjiKIKPQbo3rFJFsUurwiq6i3Fq%2FjYpkLGt2hQqeuO5C4kshtaGPiZ%2BMKsx2u06Eo0joMynOD3F8bdkLSFQHNvpLZAMGBC%2FsC0Pc1DlHbc5g3i%2BfpPFPEoKYCsonmHasIczyoYTu35%2BVyYFeUOiNSHc2%2FkTuwbZPI4EsbgJkRyx1UMQpLe5PDIaAAZjCB5%2F%2FPBjqkAeYpUG7zZycmSeNvZbJk4kF1vxsL89avM5zsNFV68OSungJ%2BQns9Ro%2FKqIkVjbf2dp366fbbnznYvVkOxEPQHGDd7zKkfU5c%2FzTxxfFRJpp2yTs63SLl2DK7%2F0HqGwiTvI77lNHmLOlYjMd1MKG6X26L9UOhoui8vBhANezmzPahU38zOqvyHVosKA6JGGbkmiPyr02PbXtpq4XhqFmwWKA1Blum&X-Amz-Signature=df787f11e3c5d17aa941131893c6ca59169c85044c2e6c145eb788241153520f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=e3f9274f43e1abaeadb233c034b37497b83f3c0fad9bc4f34bbd198777d31016&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LS7B3IU%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQDBn4K7DmoARhZQwCCjKEDRX3y5Ki5v7f3bi1taaiE8XwIhAMZs4qyiEkcZKc9t5TUCIhTdvjve3LF3hpGH5B3F5%2Fn5KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzVDubFg8Y4tL8jhIgq3AN7qqXn3U%2BZC1TVpRd%2BSwDgH%2FqzkEA%2B3rcmTc4r5dTI4QfK65quKiJADIGF8kTwULqH6lS9L1ZAZa9bBJM%2Bl7cbAAzWU%2BCWiiwGBSIIsIc4D8PuT1KFUR7AqHg0B1u23JHcw3SOj4A0mFffT%2Blhsv0aghqMb8yZxYps9yAJjwN5lN1Y3iMy7ZZOe%2BqPfCcz7S0uN4PmcmRckL0eW5adt9VBuemSRp2Lvwil2YuLHkQBmoq8DI6eBx6jDu8d4M8%2FJfZetqQUP1fuk4S4GbpC2bZp9l9Ro7qyyPbPT4xDPabb5Sy7HiqX1E%2BjR7FqP1%2Fme9rzuaM6vY4OI%2Bw%2B0rH3IlZCZvNItNnE3BJU20XzYgC7O4H78kl5mpAqEs6mmONRfx2gBET0GC3BnFQN89UMxuer6K1QirQUHkH2T3%2BKqd96mH%2B4aDk7dg9oHCCuOuadYzgaSvRyU59jRh45JNTaxjw4zRyDx6clV%2BffgO0yq7tEQGEd3DTvL4UQ3qvWViTNv4CL4v%2BOoFFi%2BsPU6SzKo6ifkWFMEScfI87s5ceyNnNagWdd6cv3DKnxE8ud9ycgCfFNX4%2BFcOeWXkVlG7kwZ5qMXfUwZwb64Cxqt5NwQPdZcUGxh4BKgTpf%2FmA%2FmTD63%2F%2FPBjqkAVaCCahMeZaT1eEJeBZW4xog2emB2BGDoL9S17FA4Jc0yopn%2FEiS6uGi95mj7azlI57FOR0TGi4irFKQAIwqmi2otOKvdwHPbyZ4x6XGTI5ZKr1T9RSynsN4HjVBBA2WQtuXYZPGkIHs0POfh0BE%2FBZ5NT5o2fS%2FPhwumg5%2FbA%2BewClFNHURSu0OJs5WgSf0a9Ga4Ryw6pRovfquwVGRKixJtbLY&X-Amz-Signature=7fb1279c8282dd61b9b75c6f1b94c379fde67acaa50c8a36a2264f4a339799ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664XF2CFCA%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIFHY1zW%2B6MSA7jwIoHVOJvojtc8G1smhuY6%2BbfcYz2%2FeAiAm%2FUroh8vhYGQvNUR1tnSQA1IUrU9%2FJWDgjHO1JpN%2BNiqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMT7OTinITwg4DoY4iKtwDepdYJSnaKM3TjsEwvHzS0xlgRlkgQc4JlYcpMZYG5VNTvtoBLdNMf0zfq9W%2BM97lN60TREVy4%2BpH1noj4S5a%2FQtPUV%2BGyQ4OEn0h01yFOfXHcRZD3Nk1NJ3j33N82Rbm1BkXgHjg3IpuvVG3eTvg9H6pOPtRBqA0hQcJMUlnamOT4M2unKWMM%2BjGYs7KrxKicIqcZESHNaM2IgHZZ7F%2FvOw9E4gSt5%2Faf2S9rdzhtfPPataEIIcjgnr7AMwDdrnJ4kY0%2BO86epPGBL1rtd7k9bo0vvgqjeYvg78EAm43ueikAD8CUHdr4KfTcYXMn57sgBTFN3Sa06QqlulDL331yKeUlfiYFVxrv5lakJiT5neAN8K8T5DJquyWiMQ4ESntevfzwzvuxtl%2BIiZdH91i0tK114m91X1Ac6nFDkeSENG8pUkdk8tpjn5tAF1%2BhFeDlXqXl48hMRgsUMajqa%2F3pXx1i6gF%2BsXTPQ%2BddGpeRmZbOjmWd%2BPHxl3vvQNF3JGFs0n4HFmYW8jda2yvvJZQpMyxJarbRQaaqg686alPe2h3xRRrb9CfkkP%2BGb3iSzcwtopsbkFMj2bSWAhHJudgEdtq9eyL4qIIW9Xx3LkyRFQL6D0tTGTX6DnN1p8w8t7%2FzwY6pgEBPaxx6A30hPmaVwLEvlEInQCmODcQ1XtRvw7BUYE0RHWK7LxDSWoeeDZl8lMTVavYq0V3YAqQ%2BGTJiGUDVlciIhHWQCKaWlA5Hb9%2Bl7mgE7a1T5TojVn4Vyk6wnvfWH%2BSf1skZTObpjGS%2BeFGlwSewHueMLXuRGYrzjBVEeDfkSDu6m80R82vLp3hGrNbUqYNqMjnFbwA2Kx2bqYoIqNhYDiSY72J&X-Amz-Signature=2db440690b91235adfe764d7c3f9e34c30e95765cae5db6c9c9e4a697ceb432f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SQQP3UR2%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041625Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIE8JWeMiW5unqU2Zt3cEqs9HM%2Fr0M5Q8v4lzjx1blYdSAiEAoECHuw%2FbGU9kslKiz1mQb4sEEhFYL0D%2BktmW0Gjk%2BpsqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDqfeJW7J%2B5nYmgpIyrcAw1wbQm5GWbGi8lGxb2SMs04fNBxFFsTWKBM%2BklK9aLAhGnaPH1mHYmJpgEA7pwmA74c0bhAzaI7iqhAq8egig0ss4EjNY6E07%2F9TnygFBAGwF5OnJNtXIHyl87LadJvGDaFmWTUoHd%2BdOOcVANU8orvAiBUzwgf%2BX5%2BFHwPGt57p01NdyyHZvtn%2B%2B%2BuxjeRw1QttVUk%2BefqRIJn%2BmoieLZnHrmLz1NMG94h%2BHaywCqdj4gcQtay1Rk85MpoFaTySFGpix4Pr2axnMgH2Jz6tR5XPXWFFD9NfdHOZlL3YNQIBHCoA6qYuuhDXzeE%2FzQT40x8kqHymMNZs2DULamWkbXM8IIAv5HkqKg6CJRrP%2FgFtZwmZc4AKmCebwvzPg%2B4N1921%2BPDe22pU6nIPeNvOXhpFyfaoHz42aqI1sP7BelktXVPc8S4mkfCf3OxADr7w169moYMNlxMLlZYtVrMp9ReNlwhuuJIizQuzGoj90Y1adQglnqS1zEhFih%2Ban%2Bm%2Bap1VIBdAPIrq%2ByEXWpJR%2B8EkoCX%2F%2FxvN6KW2SMnhJRuTmmRPQfAGJ%2FcwCR1TE1teyuQEhURiTkoFmjCVMyURSMYtjqvJlwgQuph9v6VIHKgLgxOC3GfKFH3CszyMLnf%2F88GOqUBjBrHy0SmCVa7q4389%2FApJTpz89IitgiJDTVCVzYB97mRL1KmczvWs4yuTfjJkBf0n6NJXma3M5UIpFyiTV9y0sYH7kHogjD31t%2B%2FVuA%2FxcKhcYClDhS1ufaAusgYcaT1HWpqUOsoqOqs51PZaHXZQia%2Blkp3zVZCcRfCEB%2FMPfa4GGcOnSQWt3hgLO%2FIGBuroy5T4KqgDEDWjsePaPxblrcNLcut&X-Amz-Signature=99949d9eaddd1bbfc267ee9e730e9b390d46038a619a8e6b7056c7e86900ecc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TENQSGQ5%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041626Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQDDeWeZH8zDlxRuSzr2FstTlWKmvOJ4Be2LHz0NMG25NAIhAJivorp%2Bf6SbgQSY38yAYBXFlRh6KeOFfell656BUMSBKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyx4ctZMwsDTP1CSIwq3AOOCxfCj%2BviZoxzP1y6lKYQUeAEYbHgyK0G75VbO%2FwFBjTgqPpLtHndgJIuyymKcxXaYT9Vu2u9JcmoG6P9aQXPmVRP5drUiatVTkSp%2BBkV5X%2FzJrfg7pePwY5Y%2BBW4iKXbq8DaTOX7rNX6afuTFSjdyMWQLImO3fU2x8iotz7ThZg6Iw77dNRDAydA96%2FkIAIuCO3VFPBc1R5WWBMkVxDWhtZYHqe2ep%2FkSJqcNEFcfnNzQLzAk9DAQEkP7obL3wIZJJae48jHtd6VbnxCc8P6hDFwtVjEgECCxuZwVAhd%2F0RnCWVl%2BpjvwIjwntgnhuUVx4tDdlnjT8M890iRAcYPUGV0yg%2BbeT4ueYmek7B%2B1Zi1RcaVflfKSyXXwlLfjuCAyTt3w3hAHuKaCmsfHNA%2F4NZ8YqXaaf3UY4oZvZOHuWOCI1yjF%2FeFuf%2F6e%2F2Uz%2BD3O7T5JScBIAQUXBKe25M1yM16DtshVY1nrbHbxaaIcWA02pE7DP3qOY8t6oTfEeqU9t4Aw%2BPKIOUaABcC3FcW%2FvQYrUJLwGg4gddsUv3TyqIm4B581OaX05C7GtxqSQ69jBPqloO%2FRgARVEX02SVCKz5XZhl6w33sQ7Ppf7FnKvJTQsdWxat38ZZ3jDDZ4f%2FPBjqkAQsb%2FTAbAsiBRuESMSNGUb%2BrRcf%2Fj8o5jCSRQnxZn0wahLqNomGxycSoOZl8CQdbMajzl6Ef2mUPIwTKhzjknYCvLvoeSbmVWW0rX%2FCvvOBr5mBfQaUU%2F%2FLgOE1WroQRXUifZXxGrg3EeBAFImltBKFt6UL2M4KWQDXuL92jGI2bKm5FKWdZNvvJLlv0bsZNL0694H7UPLHc9%2B%2FI99ssNk%2FPzfK0&X-Amz-Signature=5da48b9a8f78246e60dfccdfb90cbaa7ac1aad2e4b2ff711a096afdc3a67a8d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=5b8a34e0e6f6f5e7ec34f6bcbc2b97a7977236b3e1a00156aa487b3cf0dc9b8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIPVXMYM%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD9g6Yvx6iax1hbUhvef%2FY8f6TN6o%2BLiPaJY4mjgl9gRwIhAItNgWv9jjxZJyLXlvxE4Xk881RAnllgqe%2FajJHbFJR1KogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUeoBx%2FspsmJ2xSu8q3APsE3L%2BlFDV%2FatJmL8SlDRGRY5u2wgu7928NY0lKoEV5Fd7xZCxqZYlw1o2BdEpEoc15pCOk2wZS%2Bwg2adrQYce%2FZh4hSpAaBvNY7%2Bx4gZp9R2z93gLDi3lkwile1XDEmjNY3jp6NmvA5zmUPEqhJygisn%2FRnJOjcSSboXUA1xVJoid9oKd3WrTS18Q1WMvYUbX%2FPI01f7g3pCjkicXK2wQtBAuYFg1r%2BRUTMedA8cH80I%2BkknZFwbcHOvg51%2FGHdMMPRnRpKSmA%2FL2hmoIE8nKhILXzZUJn0LHjJW7qlHJpiive9GXqSagE5DPJW7N4QXnr1OTJaKHiXaeEbi13LYO3Zuxmjr2KuA8MO3SJCUsdn1C%2BRHmQ1TS9KrEKzhrp7hxkRbUM7i9BsjG69LtnuKSCQ24uW08SaktwxHz2FEWDf1gQKCeo8AgB8NEKS8Ac2nnQJOmTMArM50SjfZtAe0%2BrMfqzDVQupZ2m0WrMGqIN%2FJF3yIAXjqO0DUpMMV07BhY96pOkG1%2F6bQoTU6LfwkyCRR5rxJdDktRguvs9hQzoSf2sBpESKksn3XEEn5TTm2OQAH0V39rxJUFXdLpoAKxSi%2BWXe9NroMtN2Vkvlr32ISAvNT11wLRNuw%2FZjD14f%2FPBjqkAU7GyQaQKTUcrM5FHIvjG2GSoHrRwHISFAtjMpolJ2wJNDhMjQIbU95OJxU1%2Fet2esuRaRXNH01XgXqKfZp%2BwE%2FWVlucim06AtwMMyevOxSOOXnFrsnMzGn98P68Zzx1p3oYyn8r0%2FrRMC%2Bk%2FNkP26n7iZvcBx6Kqpq5Mg1l7N4g40THZHJ1DnJfp1s9u%2B6vSItzevt7zBeVhIlgu0%2FzZk5LI9Sf&X-Amz-Signature=56a2f0e70b8729e8040c200c8afd0d3d7563451b86ffffee15307b7379968071&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

