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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=5fb471cf639d329996c66e9127692a3e49a364b2f104f2c702d564272365e158&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=427ff50f838833835a5c0e480e490003c669a1c596e2c2833215f19fd340b3f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=5e2a79404297a2620c9c7618a4ad6ae592df470894156f9473552e9fdd75cee3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=7b3b07ddbb46a3557b75e92855c0dc80ea160b4c11c5280f9dc00b4ef8735a6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SQUFUUH%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034646Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDDtzad3oM0rIrrAM2hwWDltBylRQdvgJJBymhl2AVzFgIhAMy2fe%2BU0dZ5hndfSA3PFRrbWwvZK49hmB51dsG5K2r%2FKv8DCFwQABoMNjM3NDIzMTgzODA1IgyYgcIBqF4MMtjvChwq3AM9t08sGfJf9MZhDPQGaDV9XLEamLDumsKS7mHfE4TMi1K2SiNIG6vnDUjA1RL%2Fuf8BWjA%2F78ONPQHAi2jJ%2FXdZ46Rahza%2BsPK2DEbH2szN7m9CoO%2FfFUnAmFVyXXefm6PHPy%2FtcIAGktUgzcrgYV4lCWVQTQjRsCITTj8eKmLl90%2FRsoIBJaxL3VJ1EPNr8ASL1olCPYoGClpIFZrLgXBQI%2BbPO6ZSTVcSr56997VXOx4yQ8WVfCMy%2FFjzYyLE0NQhLmaJ6oitICkQFebbNwaTjJ4VOZcuyNUhd3fAB47lfm7su9Zgg7sqDtezMKqqDEh6776oQVhA1h4OidB%2BzOFLhpG2pAeZf%2Flqsz6AQ66mEDIhdug4%2BadA3DdCx9tldzVf6bByvaD%2B2uJtjXEc2kDjpeEiUIghkdm9%2F%2BvZmxelrpgzbjr9TKEFHs1FTdoE%2FEuPAdhuw0bT02s5IQdXvG4AW6lM44xodCTHRYerqyrm4aedL0MauqcAkbD9X36jD9CgyTC%2FvYp4h8gN9iN7N2rhd294ExjZor7NKGrYovdGJ7hKbKsC7hBnJkK%2FsPRPAwnaRKkYpHHOktKfeorKqGXxPKUakEcu0CP1wE8Vv9vW9RaPzwtu5Xe0qwryxjDwmabPBjqkASOHk9grggQ9C5NxYMd2uDRvCaLi5NaSlkWUZrFb3D6DxHxFkB8LeM7LYxbH2mUqmpTM%2FMzsuMYek51SfBHMw6%2BzJ2oURAso4MrgnmcxttNpMSHupiwYDgaKouz8mrC23gpZe0S8Q0LaTpxdqjMIW8z2N6mV%2BvEn0auPd1m%2FLILjOVzY0nwtKYyr3Hp6FxfwQUY%2FB%2B0ZV3Nqh4mX6WPVvPXSxkKZ&X-Amz-Signature=7df8bb415fb106d7f6f234b3e5e0965bf36db0444bbeb9585a4bef105381aa7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DYC7TTY%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034654Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB0SuGyi1vHavJmL2byq2%2BDpH9VTIq16XcI0OVjONBouAiEA0DKiI%2B0gYjMJ9Ky%2FQJHoTRHFaXfXq8ipGwlKxDhF71Iq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDAdaylY1vyctlVa26ircAwO7Rd6NmBi7gqDWKpecIKnO0c%2B%2F9QvP9zT7fWxf%2FUFChct%2BmBaQ7tUvTIm2KEmfsCAdntwCJlzDemcJYsaZJhv3Mc7iPtJBC%2B37s%2BJA9txlwfjc00QR%2BwiFUu4UKdTqO7HRFN9W7P0%2FEQmjwJ51eVqiQpIjVGcob4YKtDWmFsoOXxgREqbCFglXPzkAO0UuPlQlGpPgLl2cJXfxHSKwJV0yvspup3g%2BfZNZPmzYoBSXDxYspEMlQ7fW4O%2BkH9gNsfX8Iq1Iri6cZ2iJVdRpyoBJRIkoJdGMoHxXw8NLoIEpDNXioK%2BmGrlGuFIJ%2FIYsyfxCprZU2Z%2Ber%2Fy5LKui85mbnOhaSuGZN5SyMg5K%2FCMZq6XcAWUbdPRSVeDm9hTAIIC9hqVt8n4vyjqEDakk1nztZCAI81ErGh85MDkiALR%2FiZITJhzM5TzmWDQktGuaz0KZdbP8cszFrvn8shbbLBeyqU01n9Fz6njFRBgPJDdcyAxDtUZh4vFKyuKmOF6cmwtmAkp5Bn6yFKnM9vVAjNVkJwltmgn0HAkrvXpDfM69NAUNF2%2Fm5HEJdkjCWd1nC6i3aJ2ZpjI8QzmJ5kL27el2H5FgmrWAR%2FobXZyTypfH5%2BleXrDV8%2BQxhb8FMOCips8GOqUBaSQ8s1lYcVV03oaxPcsa6Kw%2FikOqZmgs8i8Nm%2BNnjsfLyLIMPee1LDiresn6%2FTxn48cSa8tA4V8lph0EY3%2FqrC8sHxW7MZ97QxKPtFb%2B3HFmFgBjLrBsAxvaYXcEvctaXnaRrrR00AoCo30hwEf6Z3H7GlIIHQ7Ji4UL2gm0zpW%2B3L8tJJy0Rs8BhTJMw%2BEKBm8kagRV8MXq4NRDMOHO8pIlxwIt&X-Amz-Signature=9c31c30115d19123964c6690088cd98dbd11a3bb758a859947d9cf4a3b4259ed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666RB32OKM%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCiL%2FcbZfHA2shMBGCjmInrE60JxTivBJJPgv1qjqamNQIgdwRXKH0D7Zo6BJ3NlEL%2F8W8u%2B%2BY62Tsy9dzdOwKHP7Qq%2FwMIWBAAGgw2Mzc0MjMxODM4MDUiDAA6LYNUbaCBQrxI2CrcA6v5kSlLFtsW9%2B1LXuyHlqp1qXM0LFXUv1WsRGyuwg5sOXsSpetrrhbxwEYt5Q3tcW6sKpI%2B8Tm8KE%2FnqdGFtuXimybWeA4w7Ds7X4qIn5UjSIvDVJwOhv8kkEYJtUtTMfp%2BCb7nkVgIGKzbEd1jhtig8EqQa5u9CQfY4hJ4dShCvHqDgv7WjYa7L04OIvoOG4TRbAuW4aWioBH0K4%2FDqklk6dB8u%2BAtEIfd1Fk%2BnMlfiYKoRF5RHorxGZjLv5MaMOOvMP2iWgfy1KwvmaV5OvWxKtOuxHBHXRfJpyEmEiKo6tyod98UrdLrnbI%2FyHv6y3908h5QMIvVld4DTRBIX3yZz%2Bax5UcsdA%2F8gRdU8byOIyYaAjHRixtVXCuWqnMJAJvlh%2FHVlkFTA8y9ndLZO1jexqkGL8xTdQ7Ay9GrSJORHLuZ8NFQqR4RAaUCtl3PqWed%2BNLkHtD%2BpqQOrjperdIZmvw1CZZaW%2Fogs3OgQooBtW9ajsXJZkDKrc68XFAiYiRgwqPXYR37i6UbJoCI0DgCoZpmX1pJju%2BEmYg1viLk5WqBkRIfG36JZIhejsiYgfgmuFUJsi88rS88sdquYDrJz8U9X%2Fb%2FHZmloLHugXm3MgzXttlFvkJLsiz9MPaspc8GOqUBxS%2BFIgdf6deM1UU55BIj3tBBq0%2FkChd5grDgguy6uTxm%2BRKs1Ib7h%2BnRIpeVx%2Fhz2ybhsG2N7Bg0hfyZLeq%2FwHol7t5xzSTNnlIg4Z6XmGwftTNV9WN5YdtQgWRw6TgjLhFUl8AOWCZ5gbVOcfzr20pEFuES6ni3YhjviDA02lRUukT%2FKMhb4jypqVQzoNEPZWlNMaV9WIxanrItAtuxfr6a7VRr&X-Amz-Signature=678001722998b10453b6d70751fe1302c29deefe76b539869d7e5ae31743bc59&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QT42QPN4%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034655Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC9LbR%2BhvqGcLAcc8e65NtqpVv7jD0dj9K1rqiW3EBVkAIgItXINdsvMVBc9hKFLYIOyeK5R6OMud4p3NU0L4RrK1Mq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDDbX6gUjuhn9A0KUiSrcA77Db3EUhrO%2Ff%2Fqb1GSrvATEjteS%2Ftl%2BVrGgGyuBhNxmFy8d2B5b768QyIrhHEyVawXgvmOmnDtuI4Zj%2B5SiQEolvu58chgdsnI2KWNmqQWKslMRZ5Ce5v%2FVCu7OLhuCU1Vg66IOg1rH7y4TpuWyyjaY7hUttjySinW1DEamy%2BLBKWGgyfqXAYTQ%2BsX86e52NvG1%2FSptjo1LYWbzqKjEnBipOiEhehXNjV4rTdqS4YI%2Bpnl4jUpacD5wEcks1gYiA%2BY5VqkwEeliZqGA%2FRvOEWg%2BixkjYUcPpPPFnsJTwbmvBLC3SC3wL2N2HHDk0v%2FDQG7kSxefUUtE%2FBjNLMFBGY79B4Uc6kiYGYdTl2ntR%2BdYI7a3QQxOW4hWAScE2wm%2Bgn6KCmOFEHySetT2e4h959Nrvt5GQ2wsg8e5lWLQ%2FlVnuDfm94pO4mzAsvTr%2FuyEKwMphSW7v7qjwC5%2Bhc8gItthaXcIFpOuguK5Vda5emZw6lhYyVjubSTR0wW71d%2FUW3gkoINZRJnJxlHMB%2BW3ZGgFhLtCOcsQYXu27P7H73AuwFAtQ5M64r0tKj5x2HM0VA0LQm%2Bs6Bmiux1u1iwcDPRVDWu%2B4pv9NkRa7bqyz%2BPJPmNsPdskveB%2B0FjeMIKeps8GOqUBmQCZHO7lXMFt%2FFQai0AV8FZoC4AuIB%2B3w3Ie5plzFgTK03QDOVvZ16o14is%2F6JYuZGzKt%2BVvvPsfzdMULwva%2F4Xosbih%2FqS2VLcco2YJkXrtQcAVvfDBISvZXk%2F%2BmTUWDvY9tMyXMGfSzVvcnhEnzt0Etc4EEUKOcvNchX1qX%2BGOAMIhCP5T6dJWlDu%2F%2BjSqbiz8UZ9IZTjzZ9aeu01vqW1cH5uk&X-Amz-Signature=1a8fa58d61c001641f90c5211cf992b12f36d1d75a477dfe7160668fb15ba493&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=b073db17ba085ee70811e7adb7c283689d14cf3834a5daf4c5459d70193c6e9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034640Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=91f6ddfd2bcafd2359d441148e64cbacd0e29dd2df967c0cd81d3af5e65c20b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663X76VFLQ%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDIN8vs0iqp%2BAINqNsb1A3mOlAJiJK9IovofKcyXpY6%2FwIhAKWP1SAfckqye6KKJ%2FxY8g2lEW%2Bimhgo2IUIzVmBfAfBKv8DCFkQABoMNjM3NDIzMTgzODA1Igy%2F5zObjnZIbeAgti4q3AN1vNkb%2FjhAYWyWYerJihFp30z2rkh7vDUcLedhXBgmn8dig6Eu74Xt7VUVYmU3gCyJ0WxyslXmSKSy1xetxnAymDy9jdhArn0wVyHQVmY8qW1UJvAuKhotbLlEEtAdRpMLUbq8yjMkBRWVUNMznFNvABQcJhREjO8%2BKLhOVTJSBXiEE9PZD1kMZflH8q%2BnHGXDqQ%2Fz9QkVX%2F7L76a0kbwrzibVQ6F6ja%2BMqpiu4aq8E%2BwehYns0UioX2d8N7FW3jBqrFK%2BsZXKDsCOTAiPtuukeJeb1NNup6F01%2FOW0W%2B%2BypKWmvUPn3sWjNyvkhtckhb2W1a0oD57Q0zUDNpqsUO%2BlhhLH0%2BcTs7W3n8BKCoVfLFztJaz6IrQVcHmOeAL9ZLO2LwG6oWnvmN8ELDni4bvrmPmU%2BaG2x4Uib3hxEVQCOpXr8pIidj%2FPzRePxfHusMgeLOeVvUOr6c8Vq%2FAvxoI7vgk1YmzrwSfRd7qXVrF8umE%2BL%2BdH85Q%2F272DjVthh61lZ%2BO%2BpWliTAF%2FdPL7TE0fTV%2B%2F0aHQMeov00L6TH2YxswbMjdNpADlmG50k5a3NRfgiUpzuGIK6Ie9oikGBZih98ndi8EKyVjYvjmY9aNhhlqFo%2FL8SRJDdK5EDCLt6XPBjqkAbSRrOmZ7sqY6euuxftibWKB8QXfnYt8%2FK2ZdGaC48N2opKigFBrlAfbQ0g7%2B%2BIz%2BEXj9FdTSa3s6P6oPdINlB0QUKdqimP21f49GhtmHNv5wirI8rs4ACxTuS3TQd%2B0YKjAB%2B2cHzbYi9nE8Fxl69%2FtZVQ24ErjfaL0JA0DylF%2FsiyVjzk4xXL2cI0ZiEDlLaAzZncopD%2FAXtl%2Fd301lWI5VHLr&X-Amz-Signature=ebbaa00685dd87a9dbf128d03121f1b880c80ff6d5573fed1a8820eb57cfca70&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034641Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=ca01347ed5ce444753922ca7d39b811765507835b04143d38b0f6993049d70a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666ZOAK4SS%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBGompHgrWROKo3nHGVQfJVRtClCqSXV6vBrX%2BwfKvzMAiBLzndfISmDkGxo7XKpVhNripHLxHpimzW8fSXYLkUZpyr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMwUaDymQwgpgYHViGKtwD7HmETwEYm6xDz1PsxcYcqb%2B9fP02aCbXWdOtBoD0enPs5J222wfhShlA%2B2dIR6iat42j1KS06uaUmj8K4NKwsQ81fG1vSYeVwptSEIbcKs%2Be6aMdIkFXLoUkg4ySWPAmD8tVFUO6%2Fakn3zBIzzInWz%2B3Mg52luFshI9Z88TRO2vyFD4n9VDGsSOACrhATP31jKQpYQ%2F%2B%2BumcH6UC8gfvHWpuoIZzfT6NdbLKD7Wvr6J34MzLSlfYdI9t4RarN0KQPOnLxn%2BH4QK2bR0v36jKRChAOKOZY5LQJ6Ovlze0zmiuZT6Xl9qM9fTjXimLz0WrnWxyr4iwOGJmHk1ZE38rtrw5gjfoXyMQa0Va1rjqRA1TirublE3RO2v4wk77EN1T0KnpSnPgvP7OWhkIKd1lkjGFzeUONaxjWBJQYtDgg2MAiHQ%2BWybMnOeqR01jbs%2BABkpu1xSsVjHk3no%2BHzGj937phLyiiJjGt52f%2FaM%2F1YG9acgYJs1PS8cGa%2FqlngM5P1ux37bAnkQPrSzKVZKShyEcXccSlKn3i%2FLHsZXaLOXBzQK83xae03MvRGLTPj5%2BR6sQya5z3bHsEMh4mubAx%2B6UzPSY03klGZKbyd7SpAuLjLVA0Onh%2FMh5n3QwoKCmzwY6pgHj0OMOdoo1AqqEE205RVyZEEr9UAZk6QxXzWNQuRDlbl3xnC9clwyDL4SP2rBSwpkQQzPipK0ewFURwyz%2FG57Z6Gh2%2Bx4RPv1x%2BqfK2ARf51NFmYaVwpuKjwnTwPHtPhE9Wp%2B1NdLSWVX2TWTVb7f%2BP7repxONTllpIl%2FPzy2hiGnEwNlURZp1fQKDXd96XAFSxK25tvbGmeo7ZdmnigW8nlj8sO50&X-Amz-Signature=20f8001e26c68ec017d4296b6f5316c21f558302541da202c79f46bc245f7ba2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662X3UYNUV%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDWge0NjOXol%2FnB4%2FxEzNe0gvMTUlvV%2Bjn6Gm%2Fpj3B4lAiEA7q947d2jo4FOX8BjRPBD2dhJIRMJ1i0pcrfKIaa6Btoq%2FwMIXBAAGgw2Mzc0MjMxODM4MDUiDFcsz4lDu1k3htmlqircA%2FNjhsFkMNhWfn2IdEDgOZrpW13aYC6He8jTOanRIAt73w3ejx5PZ5TP4kAlWSc%2FsNE3D9%2FFpPikUYbVmGxxKiUSb0ORT3XgCJ5VU%2BQiz507IuLNyg6Kj4Sbs79tw5hc1uO1Icw0GYyL4a15XAM%2FeARRw7%2FPFClXU1Jb8iX8VDR0pHiEwYn9nCbgPUe5xxjc6NCesXjBHuR%2BMpFH1GNGEMhnzaNmKc8MEaPASrgfxOAJy2CL%2FMe2kOL45%2BLlbbr6AfvV0yxKtBhGFF8JXQGYqQBzMeLuG4a%2BO7B%2Fi8EnbwiL7UNUiNSFceFZWfJwbygrwAtF3qL%2BJiwxvyV5Q7%2BDDV%2FCq8xIBS8mUiwvf5UOedbOm28luI6SQ1Uu35mDDWrCuhEZdeTj9Kb4NJQBFQEpEzWWhlUH%2B2yoZA2g7vgew7yL3l1vbos4JU%2BKfnJXWB%2FHjxnCTeGIZEMs7wQMWudxKJvsJXudUZlRFgu4ar3fWqSkWgGeO8ek0ISX%2Bo4%2FtVLSTyZSDT3OeMiFukFSk7cz4tQKqaeWS5YLaSPmVUBlyQbE3qX21%2F83XZh6pIHOjZKzlagU12mmu6cw5gjfWbMZPqYXuyvtZHpPI%2F%2FrixZItTJ6MpXF%2B7po9TBdeQ1QMMCUps8GOqUBDR%2FqePhVEqAKhEmIKtngO%2Bga1nDt%2Buzun9Cn8fi6sGY84GD1rodnPnxBXF9Dp7ykIOUDQcSb%2FUwE29FEjF2ru5q0bwMpuso8gHXGUMwBaDnHBx1BZx2Et9%2BbBplikuQBC%2FJVnMMbatdSx7%2FWOFDjR0waYislNOdvpHKQnZBuUYWhUz9Hs9QC3LzgktD7BVyCIRSgs3DFxT5%2BBSU34RxYMXI8wNwB&X-Amz-Signature=558bd43e9abe5453ffeaee2fb12fbb026f27cd004803d4d63a956b1fcadfbe1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V73XD5RU%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDuMA9PuNGqbUhYzT%2F9Z75m3f6qGObeYJ3MJ7jW9bLTQwIhAN5Nmd1Ii7uP4yVLeIY74i0UkvRi%2F%2BDt6%2FTda%2FLii8xrKv8DCFwQABoMNjM3NDIzMTgzODA1IgyYCKdGufxmiBC7NFwq3ANctSxe65sCO1xuMy785uZhgJkO0UU5u3ejFXUMfduIJNUZkxwydg6VjNTwHxFLrT0XYkR6z6BGIm%2F67JjmqIH5K04wyKrV8NxwY3HUicBJGXianLf0WI1C%2FVZn%2FOr32n9nsTP91wuAmj4Gv3UyRrJWdU77jo0C%2Bd0L2LL5tTQU4QoFjsG9PpwzKj2q%2Fd6t3YreEopCImXj2oZ8EokTIlQQZ6uieoNSUeTxRbcc19TZg%2FyhVwDgY4X%2FDYk8R9J1XpQ9c%2FkGTjQBQ7woREVxE74dYh28stFN%2Bd3HLKBgI%2BjY%2BgIj%2F917zruU5fgpdlqx8laP6WvZ2PdyVXnxkSAv5SzcUopnAUgz63vgVXYTepzZAg8SODuOxfDh3FThRfczVjqKfgxfuwkHwcjAPu8flqJyq1Q2iB%2BGyj1ianpDHS7JZF%2BnReHtckZUJANoarx1Do4gChXTgs1%2BXYWbR7TwEv4Pot7F7gU4qOaF%2BcZNsAO5zOMEwbFzwOz2uCuJaZZbD2CI1hfQeDmsyrP%2F9J%2BsD0JWIYm0TBR43MKq1q%2FMPDKYIKVD9vCB108972uu%2Fh7BHL%2Fd3e9UFCZ8R3dsF4%2B9prFxlN8ZEbqenyp6Utji8yXhbp7FGKip1d7MnxDq%2BjDKn6bPBjqkAU3fy05o4VY8Nkv1MtZrpBffWiyRev5U0KlakyLt96dCCcrUN3ZJTv8JOId2cBmK5N%2FIHJelY6AvfVdNT%2F%2BDozUkUp4bFQ1i38X9i032NCXQD2AlzqKEjafsWdU8bT3sKb01lhMSKCFTQ0xD1rrhpVJw0OkbH%2BjfAxOYriJ9k1yN2Z2FFk0mtdVwu3vzLmRkympz8c5KqNVZg9iqk1dCxAaPpLqZ&X-Amz-Signature=4e9a41529f693e67e941225e67a53464e3c798d93270b6edcc86009a225f7b0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665R2BGQWU%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034658Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAS9XMEsB%2BSz9gcNlWBf%2BtbHlcnUaiRbvUWIwDUw4gpjAiARbVOaiswnWuMbilxtKrDJOcjbhDbN7zACXftbv%2FCvDir%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIMEZFSj4PM%2B6S7JfoYKtwD%2BoT%2BEwGwgUFDv3RkT4ZDIZKpeRL7RfKguI0ftPjzdE2S7BH98OrtdXct55Vp0nJhyyQYIAW8IfLncPhFJTtGaZSGWezpyLoX9EK41uNYmlUy7zV0AalMkmEafEEm1g2Hyj6NAuJOq5%2FNgPekg4MfUsd4OyqqQSN5zqRyG1Z3%2FdkgGWyiEMF19WoGs8dcu774rZkSXyWKz%2FDslbNrxUEH1FFZrJxbTmn%2BIYsg9MKeRGBdpUcBZTvmAM9VouzxWwT3pL4JFVPgFsqF0WRVZMB%2BiOW2FelzoW2%2FeqtAHFQIBjSsT4Y2gNcQIAOgFV49YPqGsz9A6MDDKr7pmvBYF5EDha1uCXdoitxEIuxnPnEoxr7Wvi3kj1H9NUJhCyOvD7ffA9ZAz2GPGTUTk2PDN0LNsSqCAcRo6DL0lxnyr1ugF9Syz0tBlvdMf%2BNFqRiDzelKRu6Q1RIdqWxIlqLD421RMVjBuBtbTNrr6Asbrv7dpu1V1G9HHbzTmVHXA0xKccKB0ru%2Fyi7f2FzQgdaMhSrSkvNLJfnlw%2BeHiA5A%2FxDvnMmQi2NJdXXYoUMTFZGukLr6OqRTQI7tOIIjBzObfiAYmjnCgwU4FBjOjTtj1R9AwLE6ti0ImvABxBsy0aowwp6mzwY6pgEP2IbrL9K6vy03YbTCIbGwzdjbTJURtqmj7tLZ5elPiQLtdwN%2FhbX%2FYU51aVuyYFehxdvWyJ55yjQ39xqlQ8UjP6ukgv7LUw69WRZI8EB8pePspn0NWWo%2FX47CL6i0Qa2erDC3yxDyW6hMlfzdAmmjFNatTuKiJ0D%2Bp0OaCDAgJ557EJsNL%2BKHC8g16RwoUfPTlTcpWPw9qWU%2BaV8UL7XiDZnlySrV&X-Amz-Signature=26209d9a2b52ab48f9a604056328683c8b9106f339840638aa0738ae967037be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034641Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=21691a9aa7ed24a97ed041cf15d2411400582c8d81812b173c802f0f87e7555f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQBYB3Q2%2F20260423%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260423T034641Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFC%2FCw%2B2gUsc2BlTSR%2F28MPzWrHIwXCmzPwJ69Ksy3ihAiBoCESr8XxHBayQlx0i1xyM7skfNExsZZJgTRVtOVa5vSr%2FAwhcEAAaDDYzNzQyMzE4MzgwNSIM4TOZzbdoYXUYV852KtwD7LKSuOVqQu8XoKHEo5eGKXFc%2FXtLm2But5VgzBr4B4Mvb7eptkkXVu5ueJiO9xNcOJv%2BRx%2Bs843PrS2OqkW90SBnW7dDxtJGF1H5Al2Z81eip4x2xdLwIPeoiwrZKORdeK0j77B0own1g1elVdpUK51dnVEyvDlzyuX9YerL%2FdfzF4nlTCxp0Mm7K9rGQZTilCag%2BTSEUqrqFG0D44qQ2llcJVQ614Av1%2FP7pmYYp3pAyKfoh6hcziI2okCc5MTvN%2FkDGE8GnPY0cgdg13tyqLXP6QjcIfPyURk3AWfUBvGt4GX8iQ5fdV7ZNK%2BzWC3ccYLJjyOREdeI7CjNyVbUj2Y8IedzU8fQj9Zb6C%2F1SP80nv%2B7O6Kil%2BNftAhlZJn9F%2BwNkYv8HTEPwhPZXaaACL5ZdMr0STvQjTyIqTwkci%2BgheDrr1mYZTcy5%2FIwnXVnOaTtBFlxqUF2lBC2XIL4Ig5H0wikmghUUfupEo%2BhVUv8qxWByqJ%2FnbExWmS2DDfoZpVV1J7H8OYOwZg2Aj76kgqoPkg4pL7u3fv%2FH9Vk5WExsqRYLgSVWSHAYsxZb%2Fs9MdT%2BNJjHbBDaaXMk%2B21kyVPqv2AQGmUKBu7QgVJQvZVRKPITLtUoS8zmGIIw0p2mzwY6pgGgySEYyPWtduVnYF3zUxLUxyL2M1vnDRr2NpSsgrufN29VCoVjnAh42XTGcMtvqjswvOEqsxFVVm7UrGcgxcEtFHBd7I01j%2BaHxZEckfY2%2BlMT8vrGoYvP%2Fwe2%2B5sw5aaFsA9iBGwV%2FRODuptFL%2BZMe%2B2MVtsYEd2BrgXgvPSxVBz2oYDk30dHxJrW6k8IA10El6NhtfR%2FsT1W9Fhzk4yayhAY4Eib&X-Amz-Signature=bd2d4747a318ca8b61750612e30c297d6baa00811e8eb901d671c6f7ce206d32&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

