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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=112144c0ad49efbd51a689d392e3fc591901c83e3e285511aab5969f88ff920f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=8200ed184890b74989aa1efeb74924b63d309c873aa3d04e0c00487704b42dc2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=f512aea052de8523841b946d056ea0917ff1507def01e536c8e715df4cbe0a7c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=6755d39c12ad4f57852f9859abb76bb4f4b478dffa2785b8bf9aec505c7f571d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662JROD7A3%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIHNop66RX5xsFKCtaw%2FJApri9m4pgQB1qSjcUbRHSbhvAiEAqh8KQxuwx6i6YYwAWcrsWfpxG2dECnAYQWX2eU%2FV8FUq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDN754En%2B6fEfg5gloyrcA4QtYJCR%2FFNCrLEiW%2FymB42mGMDSCM6GDdh9J6XZlZvBR1qu7wWBKojcMZpmd2Pv%2BxL81RtwOCk9utqOJWhcNY4JoB2dIRY8PlKCnFYsKz1LiLRhwsSz6qG65EStCaQmiy3lC6yJltA%2BITNplLJKqt9bypB%2F7rkfVhLd0fkml06GlUKGfMb56L17%2B6UG7tI%2FIt34rmWL6U%2BHM%2FW2UIZhWegDr1YM7zs4VWtCKnx5%2F9nUUca5lDSnkaQ1EGHuSpBsVpmKEHajORuGdiRgIxddeo9N9AgkyGrHXRMk%2Fw9UAmsjt0UoMYj%2FU1nolWlpADRDl2VTG1NCxwg2ibDB4dlBUNB4%2FrARjHYJeHPc0DQabqxJN4%2FKo2%2Bwnp1K5aLGAib9m8k%2BrRGfeaNOP9f95KMhZOpI6Emp70%2Fxx6f0UfVEKWHJJSg4ch0%2F9ChHuvDO2P9BnMjvBuGqK6U1ZD8afwjeZzAo9SkjeT1m0e6nzEeNHZAMpzhPkaJfKQ0RtNYytdQWUpVlMzpnDyPQwYuMS91pgFYKTMGUNrektHTnGPWMx0SmSoELQoUXaFUIXhUWh40chOG0ftwaElWbQLcXohN6X4i3lJeRp6%2FZkgPXo4fOmOkZjslWjIkrmm3hf%2F9RMKe4hdAGOqUBt0GlWGa80x%2Ft0YHAz3aDa8TR2RULErgTxe%2FTvpm4aDsQeJEk%2FK4T9ckcu3emkUZfmiv6i6qYG8UIujyCQM8fsmNPHCfOGIgsM5zgElyyPSZ%2BOOPxhhObis%2Fstq1MW9vTVgEU1T0jpjdhIgxaXiNUoLORIyUrKH2VkKraZyj3Q1XzSs%2FqRKkjwXh0KoRbkc1IsdNxLp55TrI%2BAeflhHsxPF3oxtFg&X-Amz-Signature=a8ad8209fa5bb4d5e99cac44fb1849ce7fecef8fb7b30e43478c08f9943a1185&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TPWPO5UX%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDS0rKfaM3Hc%2BAr%2B8uKjl3WWPr8JFhDbi2skJwLF%2FpQGAIhANFjF7CLzl%2B7gC6P5jtFDxb7pbJVgrg%2Fm4YSeJ58bcmSKv8DCA4QABoMNjM3NDIzMTgzODA1IgxxmozQ46ro4DbCvBwq3AO9TBDzBctBUNeW0zaknME01m3ECY553tDYY1sxshP%2Fz1AN0FArlzcQubX2HeOjiuv6YO8ICHkqNgOj61Vt0KHVp3fFwYA7WslesuoKtjWzjRrvqeeytSMKxZTvo54muwSxtxxkSTx1UgiajcSxeV2ILUaKZZ29L4ca9swedNbRafUGlxRPnvL0Nx1QgnP%2Fbduh82LAvN84ALuEmBZV3Bykt1GeIAfhqs5vH1k74wk277p78kkjf%2FRPjJ7zmtSf%2F4uxLQhTM3PSawDjOnyV6D1nBI4DWSxr%2BLW8b2h2OlW5N4snWOCOOS8d4Xte2HiWJlLG9x9PN9czYbmtVAnJhNvyOAyFtUd7Cr30MTyeR%2B0aRdu6Eq%2FmxgjkA14iC%2BFb4yqatp6bny7%2BNnNLPXNXvXo4qw97389qgw%2FO4rLNxp0rUDxN1VtT4uNkkRvEqDdOERFBVXfecaF3j4asSje7%2BaQJz0Pu%2BLIFyUdOsfPbwrBVSS4guAaFG07lgvv4wGIzht%2B9%2B9R9uyb4d2IwcnMb5WG5gkPcnJyVowdoASaE3Z0186eyk04V1VAAyFMlV6JFXLGlJ5BDXIh0BEsEX6jb87qroj0viWkhoxKkR%2BWQwy8QaBcRJ2VV%2FlVNXfG%2F8DDntYXQBjqkAVdxTvFY1HIRFLXr59Ew2SpbEd8b0fcNKmhGrUXY1nVoe%2BWmcN%2FbjqOjk%2BQ8fJfiBqiw5Eitan1Tgfdy8NdollsGfCdnepTfSv%2B5WuK4lX4bmDZ%2FHMoxBnUVfZgGPz%2Bj1i5ENM4%2B916c1Fcz0hfXh%2Bsws3Ikh6GqhQmblhyd6spQ8HiTEag2EUxt7kNsq68D8Tt2Z6UV11M4PwkblCVwe0nnLs9%2F&X-Amz-Signature=8949d2f868ad230ab765e551a1b0f91cb437042475d297340633ccbf2307584b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TJ4MKT3E%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043739Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIFBp8zxFOnK0glNjoVVX8bKpe0PSifLC0BEoUs02iLbXAiAuGbqsxI1vrTP7spWrsfMnY9PPoUOCMo6weN7v5V7kICr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIM9Gqy5Mu7V19UppN7KtwD6RVM5Y0s4%2BhzGH%2FDpzh7oKXIZ7U9aT%2FV%2BFxIYpLNT7eq28rHy6eWcpbKts0wQ6I%2B800BCZB7VRBewVXJ37tAuogTz%2FDTdmf%2FaEgczEEdQI5%2FZoYYqWBxIqOYSI6njmXc7Pu9UZsxS3csrChXT1MA13H5eA2C2s%2BZuGPC0qt5kLjP3Kye1ozOejebcUvKylypAbBUdV0%2Bm1tihIYn%2BWrRdJu5whhJqKHSBC1NXT259zG3g3%2BPy2H38u7TtC3UKW6sBBeJ%2BJ3ZHAb8IHldBQi54UFe5XsEyEVU65iaJVXfppuPGjbWyCRYAC2WpFxtT61T%2FtxDdsmnNNSUsK8XgVvlsJLyvo68V92z1hdBMkXtmFz3wc5rwmTZloM2vf3bzHiKLhVy1TPBpYiyay6NuznvDoPMnxsojnc84d66POEqichu8w7t%2FYLHUYzHFMOJEfi0kgrQXODLeOTfD%2BzeU7kohZtEYYw%2BXHYaxJsTrftZcC1DyoZcKB8BVOtHgv8YWidpIZUEMVECdwL3tgND3QcvcrghPo%2F%2FMD2c8IRYQroopIYt9OmPisWxMfm1hosFAaZaSiz30kWF67XfV%2BpQBJ63RARm8pHCgbq02W3DJ8KmY6f1x4Tlu6OkaqVrs6Uw57eF0AY6pgFBc9v5e5Gl7%2BJg%2F5gZcRrZjCri1Kscx5bvipnPqjI9qwJLze8IqVDWakpxXPmVqgpJBL4AQDYTVnbkXwDOWP7CRSeeBKkCTUFwN5OJzJannRW9JCE97cjBgmhgaeNvhsAQQRB3qsWc8tSELWyNiY8mzJ7JR3HtHhkJEZ5r0Q0J6Vd8Pr1nSbkagB%2FkAImERFvr%2BcJKIVus3SNwhhKsnmJjTqFNvJsI&X-Amz-Signature=adbd3a16fa1ed3818928a1f33ede36ffab6b52598831a6ee79f2cf64e01f4581&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RTQYHED%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043740Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQCcsTw%2B%2FKm286wZL6Aq9yFNroqeFrsPEY%2FhyFGGb8BT0AIgXc9zLmo0gVTeolLc8k53l0rr2E3ywu8FSsHjv73xtYAq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDHQ3G9X2jLItqQP4PircA6DAo2hawifIix07QSs%2BX%2BzIv1HykEqZhZ%2FSshZcNihKljk9AI0rvEiv8HjSXdhFU44gCbrHyFyqkMDL5HrfaIO5VnhtytBRblj4yFi27CcJ9NBRKNv2P9cSvF5ttFhrl%2F81jZJyy6OunZvvAzHpjbPeV6GLLlb8bQl7lszK1HmQ1TNu6pq0WnohfXzgi7NoY8r53prhGF3HNgOH1FVq2iilAiTJF4%2F1tFkmEzL37Qn%2B%2B3mfOvlVr6xJJULyJgboKgoDlbfjTwIDu8MRYX7m9%2B0%2F%2B09zQ8CtmaCDljg1sR0Ci2ZQg55Oo7UPgBs%2F7VJ9xZUpQihkVLljRD1gWDSinwdcl0mK%2FFIDn6v1ogfBBa8zXbNiD%2FgYTC8IN489cH8LxRPltcUMTZBExEE4aS2zRIaBzroA0UZobc8poGXvkOV0LDjJlLb1ec0yp9WWtXeLSuTaVxwu1PYgu3jprqCjkh%2F%2BcbqhaWF58zeX5mmBFHNDUBOEt9rJVKLNSwgN%2FDqnsqu36sgKg5Ubh1I2G%2Fx1glaUqg9IHqRNtTD2CRf2pr2eUPnnVqNuLKGPBLn7Cvf%2FCd43yKhfWnHvYf2Ceh8Bu%2BkvWq6lBNeyK17GfYHLNrpXulHTOjjqV6R1PrXMMKS3hdAGOqUBz3HGM%2B9bvVC912FHTwJ6zu3yPYNbQrOJKGVxBnfB3c8x6vHYv0UGg%2FPhkDYNJ%2FFxJMUub4hK%2B175lzIZI1cegmj8PJqi7Yxej%2FbwYgslOHG4jRIAcmaS%2BCT2g9FjmsjR2cepA6SD1kQ8zUTjG9uaNxuJ9uvstwOYMq0N%2BMweRdwuR%2BWv%2FD1emK4g5dSpA3aIk8GZa3Zt6xwroZNfOo7fSOYQWPWC&X-Amz-Signature=bb20603484ea7006334fbf54c7d450d7cc6f30da9f58d99b68fded40fe8666c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=7d6a67faf10d4298a08f4af9c994322a6f9cec64187674384e6c5c96e3a92921&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=d4b2c49af8dbef036cf35bedfd741e06258ed0ffb328a6f4c8f512ed3b3a46a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUW5WWLA%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043743Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIC1uIIaspbExvP4cN8RycwJK28SeCEsX%2FDwIws9Sle05AiEAhu5%2FiQBRiWmvC6SlKDJMjfoIlEjHObuz5d%2FbrtrwQD8q%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDONNengUl3PLewPuUyrcA58GAa1BoT%2BZc1al3oe%2Fx04YmhFDbgN3vNKZn6Hq7NSfT7D2%2FSqsdjEIzIaQbTYFqkqysb3JAlHnqz0riWuwOomMMHoYoL7wAXItDJ8AsXpgm9vgTlOVFfQF7Sh%2FYCqWfw26Cp%2Fxq14aOgfYGU4nsFLQkowb9U1HhBOfheaoU0Ea4vmMpoidqfPs9ilEKf8hW9GqOGFt4MhaQTGAmcVCHLqNAS2%2BlTfpStzbP3RNnnF38P%2FBqfjkMaEBQ7pNJc2JmgySeQS2Uhr9q7mgOxBrsW%2BVrwQQUy6L3d8RdIcYtINP%2Bg5rqLsgVvTl%2BVh%2FfRkW2LzU9UuXL1r03Tcn0EXCqd5%2B7AnwOau8IxOfrRrgT39hpjkG3PSvtQAkMjdSIP7WnLDvTMYOJ3Wcio7YZNRLxNyzKYaK2uUttsr1jmltYQX90d1htcHqxRnfqJLOe5s0bCQ%2B%2FADUZ2jAmsYuheus4KYHCmPmAcb7h2SBTxTusRxsqQJQjT2YTaa2EYX1v71mFGbOlZGuda72zshLWS3gCeYuoq5fYPA04ZESPMBL%2FATBDW%2FwcYlTPP5nwS%2FNGFC%2FFNpa3UWOY6e%2BKuup7BcxOj3%2FRNW8SyVrvw%2B3yioe4lq1Xbmy3gs0%2FnMuVugeMP%2B2hdAGOqUBALV3cOmTIE54JFSjrQvqGnmtAMuTbibncPWn71GkB0BVLl7VLRwQktFvVAFgnRHOo9yS1A5vVrlgXkFyIv%2BxTvX9p0HpCb5%2BmSpXs5D2CFkQSpIOCeeiS64iQi8flqgOMMDqhCFUtvtXBZ62Avf7FPWsl1V0lBSL0HIGr5PZhbqXNikv8bgQlYeJdTKwrOzpwdDtMnreO4kRwdnjftdeJc9KjWzJ&X-Amz-Signature=f2f8884715fd94d2ff4f43a15e296e77fa25d46bd179e4912c9edc0838d9c7b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=d58efe86f54c1e61505687d07544b8912a392eec19fbeca6665f04d3f00bdbc1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665S773R2B%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043743Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIAqrbRlNWMgfW%2BPtiSOH0Pw49pL99eCjBwIaGKw2zv5gAiA8sOz2Wkj%2Bj%2FTyTBgTeVve117UDrvwy7MCj9aj%2Fs5taCr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMNb4wk6PzhQGvhz8tKtwDGO4tjXCs3rwY1CzNhG3cZLgxvXmCuWrXRclHIxP4NNY5ilzYjeLiToJFCLN3fwEzqGUn7kEYE4MbqjNJgxUpPw5eH%2BYtZRMeYTkjLhv9WVIrtZOoj32zVxYTs6Tgfrbz7qARcdzCon0mjNPOAsIkCNwj6PgwE6PipPm7gG6Wl97vanyjfxkx2vGjTC2mUlNJsvPZzTP6nK8tyFSMjuomEH%2B5%2FFb5nfhsa9Wh6%2BGwIQ1zQu8PBODfpPq1AnW9TlrCRIKHOhJDyPlLcUwxZE1zZuKQle3iUPBpe9rOfDoa68g6DYpiZ9kvPYixUHgSx%2BZbFeenLV6HqjzIKGiQ1vg7vzxHjHd4kOvG8GYZFUw3Y1lM7jTH8Ovl3tbMqhUVHPjIKUE6PIL0p83PiENOEuGfMYxNxXTJUkgLKav%2FN8Fx2aO22%2BkPoOxgKp6GbzxhTVG%2B4%2BUepen5j5NHiJ7PIppCOYqZFIGnKTFTjSALG5wQJQ2ey6ugJXbCY5zS5kmxSYgdGGwIQXcFGoNmETYrxLJJ6iuzJOm1T5Cw67PW1bvN64KRlsMy2kpidYcEfvVgDtJdUZQ%2B0ksBt4Q%2FLUE%2BWni8cPdK5PNc2O25wmkGWXkig%2BEAXRFNMOGWWKCQUFIwgbeF0AY6pgGBfbbbEYJ%2BljT0MSrGE3uvHDkPd6tFKbt4l3oVzC4BrWKNcZQCiisqyXcwRp0Z83gCT%2Frl8sm8MfQfhu%2FtBF1e4exgBntLHf6spoKuWCvZ30C5BeIZGl1JdfDF8YUq7HIEPDc7OOCT1PWud2u1biy5kOnyxn1jVL8n7%2BWSiM9IomgzEpUD6l6QfEKKj1WoKrnOyQj%2FJSvX%2FfcSgWbNmJGJgz70NKiH&X-Amz-Signature=64c7640a4475c939dc52ac37c03a837790dd6c463d5e38da12d1be0c256fc0b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7RT4VBR%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043744Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIEW8UuCxVfBSMUy5vgWM7VX0HmoSOQkbeJ2LDp1n%2FZFqAiEAllZE6pLbwoyCPrb0wfwi6nwcI%2FLGotJMZvH6ll96%2BZMq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDCKXBO5M4R0FzWgMbCrcAzWHKPXGkmhmZRjdJRSiQlgiaBroHo86nYFO6f0P9PKjKVTpkGNdQg0adhE3N23GgNNxHJxE0ps%2B7IzsxAofn2t2aIpygCTGrY7zLgKF1umIAncQ7mNSbpkcTp0ZxVN7KR7Hhl6d%2BKfIveK8VzrFADeb0gnLNKR0GlsK4JqNHMzNT%2BxkpZ7d2LIljmNU78oYndVYVZMJUBsw%2FXUb34LYwwW%2BdSsB4f9eDek%2BhQ%2Bh%2Bd4AfRFxwEPY%2BZq64ujbP4bvgBFjAlnfpUrpG5zExBTABBaTqgoc23h7fdJt%2BbRiefwvXtT7f52FoO3DttPc7YjhixYugWV5yayiin%2F4paLSq%2FX7KWGSREgaDa87KQatZbw%2F%2B9rbxHvNdQcwVlbKHcR9vxqIoU1c%2F4vFfX3zoCbyPmkJ4I%2FA5EMuk1L2j3xU1VUHldV6uD7lLmcjSyyoje5%2BaZ%2FmGikDXaJj0rG%2FcG4DbokiWqlcStaNvv6HXiE6EiNIbPhyoJCIcFvSbRTjgMVqF9v%2F0pOogCstOq%2FQm4iraWPu0QVbjYvF0nwOz3Lckh6aXI5xvEbXnNVwhfKwzGTmqeEU2HAG5YS25fcEhpvKt6GhVD2mj7bAWjyfxBIzxF6R5aQ%2FS3HxejTg8q%2FnMPq1hdAGOqUB9dPOFlHVHqAIKW%2BdiKuPuoewMO0b4ieT4gdpmBDMX%2BgGK9TYeoOKn9pIC1bgIAzH1bdR87J0P55xUb298WqUrmrdRNdkstGI4BJ2ZAi%2Bf%2FhwhXbUpjCvFsUk9ke8x4p9ANgYUhU2zIAs87Gd3HZhfpnUony9tzq7ZUh4MvkTfylHruH%2BqpQbdtEVqRYKXuIqh3EMfRzXQ9av9EL5OPE3klyUMdXS&X-Amz-Signature=972fe60cae5b112b3f2a2b992b349ddda3eb18139eb1a648ffb75ac61437941d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665NUR7VGZ%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDWhAUEqGkNPQBHgZ7oMVVBGe6VkEe4lXazXSJp6Xs1aAIhAJ4PMuvUqbyqDkQz7Jls%2BU4FW8sCgcistpXtOUrL8wO6Kv8DCA4QABoMNjM3NDIzMTgzODA1IgxyBkyP%2FY7%2F6izKr3cq3AMWreRtmnOuc1W0k2nYDqq65h%2FBTreOg9KU8NfYUybwkDNuDldJzDdq5BleSp56CypWVzGSA4nRXiJKgpjpgnoHyMP6vonO1BXS6axXi1XcE%2FuwVAhrMrXuqfR%2Fwor0q3QHQxCXw5ktgjHKiQR6v4RmOkpEDlS1uujzEKRnF0K14gWCvc6VC5zbJx%2F3VJXSZwEUGlPJN0GR2%2FgbAwZHM145mjuflbPxP3gZyNa6yd19DWwbGEumy1%2B1BW6Gsemv9hgzLZKbKwR30bOCN1YFTyaf1h8zXhxOZD2hTXrhH%2FYDshbxQSbV8Tm%2FeAXsUHd0qRTPiTacdnLfSUm4P4QvZqArVktT%2FEaxg%2F%2F8qZWKkoTiGgfT64hc2ORrxfuBeTLE34SD4tPpSAMG8a75%2BL4EWGyf%2BF0H%2BMNZMrcbofGX5I34XWfTHduzMhKS43lKwno8z0Uun7qUdcYLNA46dJnIWZQ9eH7Qkfs431w2kR%2FhZjgIBmlu4oAohPPBpfexikdd5yfcKKNtGBne32NpQsXG9BYpEqO2sBIIaLMyQLMynFWQeKIUDfxPr0o8k7O%2B%2Bzm3r%2Fy4lFxKBLVf%2BBmeHwhYJzbH%2F8TQjYVljH1AOWNmT3Uq7RZZfOFsOwKBDUNLMTDstoXQBjqkAfA9lo%2FiVWVAmFptjO73o5KYHuCfRFvWxu3cqX8fFQesPAuVrJ6jqO%2FqiY5zQTtnnr%2FZ945afIT0TbdXY3m63VRPC2ZgpeZTA7CJIb5RZUyXMROACj9b47a5angQv7CsZUAO7hIXMXe5hYiEj%2B%2B1z6JpQMwMa4n1yA0rJCWuyYKcniFlRbL2YnMGwh4hrfPmj0cOyNQdte4b8wcIHiVWRvY2Fvbr&X-Amz-Signature=d746a6b7d2ddf9b61bcaf6915744ceb532806942a84a1a7b95d62d8e84ca6b69&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VZA3DUOK%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDT0lbkN2BuLdKOmTYsS1NOjPi%2BdYeK4VpLSs2%2Fcuwf%2BwIhANZ8ilNWwyeBrLIsIcOoamm7YF06mKFPE7sapaOyQoIlKv8DCA4QABoMNjM3NDIzMTgzODA1IgwNE67gJG%2BBZZDVuTIq3AM5ucsxahWm8EqrTvf2RuDCn06k2yvfUC3yQgllyYsCdCUOnmLdMzoqD5jUwb85GKNpkK5WSo7rIvp1dKvg6f267XoZkkX9pO2H8ILAObO776D6Ml6IfJBxprVIvV1j%2FMsjV8Z9CEx%2ByVacDuglX5Z3czVCCHr3R0FopD9XsACtDzN4ZavZucivhZWa%2BRS8irRtMAcGhWguR%2FhZdclaPAzggGxhrK1aNYLtfd8C6wAEBmNwUV8ZoZo1oPOzeugJ4%2Fzzt8T9FGMQ2YXGwzpnPNH6TpHFU8EZU1LRwrgtNKFq1%2BI04eG0tIWoLIDKTkVBI3b2wkUyr8rfzDO996E2Kx67bY0vkKRaFosJZ4A40zOw9rEqDf1fTLaDPdY7dZFIZ0vdaE1Tx7a0UT8y9yWpZqEWUHbeTDedmx8ftrz7wrrydlKz7Dc6M8ChxPShMWEO0r6PQ%2FKYPu9rOy%2BEkbKheBjN1ku35ij73bQPAbP94%2F0iyzES9BbjDBHXsnoSKfZmxKyj3zfJYIajnutaMMRryWOt2yWhSeBbawb0h0tUVoiVeS%2BXkPJSmS4d%2BWoCmALpQMKz316KSgSfAncQ8pphm9pMu4lzCn0KC1I%2BHhxjM%2FiFXLUUMde5FGLvtTjajDDotYXQBjqkATtX5FJLJ85ThiM6RvviQ12ZBrnSFmgyXzro4a1sEDgKxWdlnVau6AA3pSDJ27CXtWghqBmlBvnn3MTePk0EhVgCN1zo09zJULfWM4P4C9gIlVJmDxoczbjmGJDZ2xF%2Bql26Gkgl%2Fr%2FWDGQ3BONCMZrTQDD6hnWkTUdw0SfUL88oqL099tlAPQZbfiHvsOCwCqaN0C4ovb0bQQgu17wMq7iNO8cq&X-Amz-Signature=923c546aeed0029f9aabd91def2fbf5efb4be07778bdbed7a83d951911ad70ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=c92fcaf535fd5d90606d0c25b5b802a917b02a8eecf6fe5097176b65223e929b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTKXHKP%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIH%2BwC8tp9ZlLOZKIUkKnf19zfhsfEw3FHYKxvoU8mWGDAiEA62uL05aDnKXAZg2En09G46cKNauBxwjpB70%2FdA3FHeQq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDO7xEfTeeGBnNvtEbCrcA66GAkw40zfSzBPewLh1oOLjpHLiaAeDNE3mFyOySXXKNpTfwIyvt8zP5pt6UiMgi448ReWTY2X1dLK9Y1uwNHfdqAOEQNQsdy%2FRI6mDBtU7dN6Rzn61IjiPivzPxnEXS%2FRUzZTYwMmDdy2gM1iv%2BYACP9PfL0PD3Egq%2B3Zj086xYsqevI7SSwnz1A%2FlmfPHOIapbpK%2Fg8K9sp3pKDX8YtnGJZ6VWtBymyLg65UnLLTfcWwgFOg0Fvyz6nN8YeCFA3YEhqFtuvG4qE9jrbBaw2ETZxPAcz3VxI2wt%2FDQyKc5X0mxL5FC0WamN2gV8dqh3A2Rbnz5TU0cRori%2Fhrl00NuUIyacP8ZyJ1%2BnY%2FyAiWGioz8TK4EuLhQ7v5jYoya%2BxBhal%2FHENiabKx9dB8BpbIdLfk4h2WhJzf4i0mLyceNeTFW8weMyOtaNWSbJErXTupsCj%2BRrsgxbsl3gEOmWPMnHYup9%2FwNqR5Zgy2xi06%2BtjOy6JHQr5QriIUKoo7LWOxUh2EN8VcY%2FNfwCCtTbIwMAJxcufj%2F7mR%2BxQv4P7Vr2CBWv5tScj6t7Wo5JEDav%2FSiGYbdh4Ti4uLwZxVMNp7TMgtNSzvTrA5KDu%2BnyUj4ErxARYCAikL8qgQcMLW3hdAGOqUBcIzP%2F3saBpuis4t%2F0qhjTaQqLWFJmm8M%2Fv6RaOHnoK2VSPFmMQ0%2FsyYbVvtX8NAcGGM6eZ4SvADV0i49bwfQryV8eWVcjpDTFMKDURH9frShelcNSjnB6SGJw6tG24UKyQphVyrgn6uPlSRpQiRDKeH4eJvdRdm4AJSrkd5Cde%2B1CyAhl2N8kizFp1b%2F3K1D9gPcS2cgELCxuHOkFxJX3xiu0Nf7&X-Amz-Signature=8ac5928f28d35c781224c652c09c2590a6b5e34d77613db5ec3379aa52fbaff0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

