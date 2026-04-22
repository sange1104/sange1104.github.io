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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=a4dfd37a76600c245c311b1b6be709412bc7e4799b901b7f476836e020ae78b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=8c9cd8f52624b070cd8bcb1e8211850e87851f6b6a95c6b8cad570a8106057d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=e9ecbd157e08d907401341a286882f74caccb43bdf469bda4e24087947782868&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=92b1b303eb3a73a72e5ebfc709107705056ba9a82ebc584a2366b14be09fdd8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YDH3CHLR%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJIMEYCIQDa1sjfgdXuXXbmxC5pf%2FOnwYXZGF%2BtpEFKm%2Fl%2B9zzvZAIhAIBwKqgvDP%2BQu5Ynv1SHubnOeh5AEdber0qwHkp8xKnGKv8DCEQQABoMNjM3NDIzMTgzODA1Igze51puGsZ%2FFBGVFs0q3AMbjIQ%2BZqVfZAS%2FdQXIpD3BYoNDugCPVB90fRaKbXHqZdz%2FX5UAe9tgimATBhfwya98IXhNz5ElgMz3eRL8TG%2BWOAdpaZAPrd9p%2Bh36QLYryW9ShzUypIYU%2BbFu5cF1QGW7kgvbkopkEuacFF5kzgOXuAnEEEnvrgSPeKhei2T1i63CQinSdccGRFOFcelQWvzGtIPUDfJNUc1H3%2B4h8mNQrU6%2Fh%2BNU32KOq32N%2BylZPCVi9eeyPnwcHgCMRUciRxPPz3LhBO7rlDL3DcmXfmPNiyCUL24CUV3gCJKCGGt9ij%2BB5e%2BQ9BBA8vCNqm59g3CMAqx9gmINQTxuH9ZKhNP9oe9z4glDQY5gNjzNuJyUQyyfFTr1L8ms4FVAhM2e3OPeyfLKC02YRXFVOSaK9cs9%2BCeHmnN8VicijxjsRu%2FrgYfL4yiKbprVQ8zb7peKn1iUT5aNBsTxDbA%2FWdEpC14dejPBCO4yjps5ZXlL2snFm9D4HQSkygJZ%2By3j7Si3Q1UG5mmyPypeHaGdQrHowwbadhdQF5b%2FGamMX6igEjDz8D7%2BiKb%2B3wI47AqQhtQ3mg0Sz%2FknBEgA1bPHb%2FhyEucTDeZKqHE39bQ%2FT4lr%2FImBpz5oPHudnjZM52onQzCU%2B6DPBjqkAX8%2F6JTMmHTxcxbtKTo%2FZxNUM%2FKWLrHycH6FpXJdM7NFNNxPQKTkF4OJEV1KPj4n%2FhMqEzciACGNTsSiUN551huPyFQQc9%2Fz4I9p14i46ijCCCvs%2FCkY%2Bfz2CUj%2B8mP60vuxKDm5KtQvKPikp7Nrbubws9dKPjOcowBmgb8Avlfl%2FrjigcI3H1biacHPt9AEmFE3pX1iZjKS%2FfRmQE4zRqw%2FdFaD&X-Amz-Signature=288efccd22d6b8282f4aba0b2ea6ab3aa85e1830fa2c94215d95307708136cae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ENFCGH4%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034229Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJIMEYCIQCJSesyfcjAhJ1jwFENvmtFdywEHFOsz4%2B2rLoeFl%2BF%2BgIhAJqYf3sYuYi0wnwKKx9v6%2B6L8Jdqn9D5TZe4hXQVV%2BOTKv8DCEQQABoMNjM3NDIzMTgzODA1Igxdd2LOWGn0uPDEwiIq3AOj4zDg6RsDhlLJeMaPa9F3ohkbcNnadrZxDWsjSzvNtDywXj81Q53K1vazF0pEEMJGL5607ef7fFTIFUdw02U6AHS0fJV6NnWMTpxOwcCSwwcJ38CVcQyhLppx7EUW362ICYojrwQFqj%2FkU5Afq6ZZ2XDETnBWmwMKvX%2Bww8hL4uCyXq2z1JFvLhl2M2N%2BwOHFUifMhTLMqfRRQi4rwng5KQ0QeCUDwpLc%2BEkHpg%2B3l3p059Ol1MTSEUnhrSrEiceh%2BA%2FGzC27E29q9U3NQEFtIpyvRhs5Evgf0Ucs4JrIiRClRdVBgHszvkQ1RBDFKzDdOaOBct1DT8KlobMQ7BT3j9zOozPIIMBeUitQ4LZ1q2QMkM7hteoojVBaTn%2FajE%2F2dnw8z2D%2FES4sFYziYEh6KTdDO0sfypW89G8hMPRALxPRPW8fc%2Fr7pc18BshLvEVbQzMckNm%2B5V0Qf%2FozoSKMpyj3myhuiItMIRe1OrJhW8jIxYT%2BSaGfsFMZygsg69J5LinSqMKr3E6HiN%2BMrxC7CIV%2FtJwNY%2Fx1AQ00m780bRrlCTD7%2FpC5AjnC7ScfDX8sP%2FvNRREvYGH%2FzCYT%2FVNSnaWBzQ5uM0QNl6T15VJZnEOCeRAQVqWzq5jUCzDC%2BqDPBjqkAQfEdPVNIwT2OIIIlglQNvoqjHoxRuIPEoRBg%2FhArjzDKAWEwjwG3KVlOmav5rf3Q1Lcb94zG%2FT2SpcAef7t1wd3IcVCEMfX1HtBXYyio3q2gra%2BxpHHWYis6wFtiN2j2TCE04D%2F2ww7TtUJ11U2fAN2n%2FfSw6bNwC4jW3yY3XqenDN1tzGjhUYKOXvPgH88gYi41u%2BTr3iBRU%2BmgGiMCvvkw%2B1M&X-Amz-Signature=9f5e8352a37da1c39a0a35a9619222ec0818a1ac6841d0363d6a38d5237cc4c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667KWKMF2G%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJGMEQCIHb%2FWaFEt%2BtNvHPRclfqs%2BESY49eD7t2QfgKjJtmMCl0AiAPXdM9LNdjyT3tOByrCjB6FMpylB2h6a5eGyxALl9VGyr%2FAwhEEAAaDDYzNzQyMzE4MzgwNSIMrf97naPnrg%2F5F5nRKtwD%2F1XGhSHqbH1H6BA17gNRLbGW9toeRPc3PBeysAbAs6PBbGZ4zrQLfGO6AnM0boC%2F7UYKfRAdPeIdTwy7e4TjRvnsGblq3Su%2FeeSWSpDySVSj0hoIyVxmoePt2cv16MjT7K9OWdoZvu7%2BNUx0YKj9W%2BYVUBi7vRChpPQNQFxjOPB8HCBaNZ0YT5MDZD6B66KF9wA%2F4RnrnQI6wcMBKsbDbyk2v4pYXAouYbuhf2g42RHwvrjVQSPWVGn%2F0cAZmXB1NbyC4qibdR5D%2F%2FspUZXLfFBbLUos53Ld5P4wE%2FdXsJo0BGG6V8iTPBG15C%2FDbv1R1tKI4CYYNo%2BxgV04COUHxhZaBtixn9nDcO0zdeCh%2Fg1gHdZyvr1M%2BF%2Bm8u52KRtRoJt2JhmbV1w%2FDwvhggMqcx3mXZBMsxA%2FKQ%2FwDnCXl8vduANaP7guqY857KrCKpnP2iCiW01Mh9cTlv%2BZMtqGg2UzIkN7817bTy7%2BzoDQVOtN4vkDoLo9t%2FjddWJv1xPmaR679jTDvkvbjJtsYqBNIVxyAoxnH4XnGjzL7tKD2rtZ4KINnJbhFM0Du5%2FpI9PxpQTCg06bISFYK8dzdTQPjVXQ4mRH69Xc6WKAPj%2FNChdgqgeVTkui1seFuJkw8PmgzwY6pgF2zDgNZvOPphJmlto%2FLbEv4PSJ4NVTGO%2ByDWn%2Bh2DBYw3Ae3KF4wqsmhxWgX8jr3OPzs%2FEFcq10RnPYWpwiLwY11DJ89d36da6kp%2F%2F0qslKIY799J3lYNk%2Bzh6Y5%2B%2FBafzDG9eyQKD08WpRWbJsDzUhgr83txF7mGhAlQNFQP4Vso8f%2F8K3n4TKdHjNLhVdfhsZR%2BYnUrJFx3NtwRJ%2F4s7%2BC%2BmXfYa&X-Amz-Signature=b1a06751f1398c41be8a703198cdad47a5f019542a6c4e2074ec53b5867a2106&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FNHUX7X%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034231Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJGMEQCIGyW%2B0n9dnvY7XiDU4iKX2xB%2FbKgACyI6HhHq4jTFUylAiBwlLuemZ%2BU76WLurgXv7Bx7PLpSbEed%2Fvk8CcgrqnaPyr%2FAwhEEAAaDDYzNzQyMzE4MzgwNSIMGwEPn6uxiHtF%2FWryKtwDdLexF155A8Gvy6%2Bbdx4fpcqUGqN0AryXOXrN1GBk4vTHCoE4zftoCcui%2BHJZKclL6KcOeke3RhxKsGo5O6j0qVtHlbNYBiFN%2BooLsvSCZjk3pm37KHVEPmSvfnxVuq%2BoOuX%2B2ZyJlIfyB0bsUP%2BKQg%2BbXTHtKw%2BS8WR%2FoxV7J2oAXO4NByks%2B5Xz1WGDLeWkCgfRN0KyjHZDvLdQUlooE5%2FZrb3LcjOD6I1ajXYd2frdhbs7JyBym%2FxqF7lWNyBq7SUFFiCsCpppcUgpGCwVPVzLcOEvoQ2Gflz1N1UCZWwrXYKynh8urpUnRXBvoXXuJpmyStIPh0ri2hceZ0yaRXyjqyxvdkqefzhYi0OKXBqk2z5E0YH1mG%2FaZJZ7xzS8rcflITg9QGu7Brrk5ct7oY8FbmEr6TIwkHRlMNhnjb1Q26njnO5XKlge6JIrKUOzjDviCwTGznS%2BWQ9tGtj1g1pnEwdjBTGHhOHfvQjZcv4TRXTuLr8f7hYV%2Fs%2BDFnqtlHc7tugdk8K8%2BGb8MEG6wK6nKEo3%2B32at9o0skspnz5f%2BGGTyBiUY9xk8q4Xo%2BCcHdRuf79UKv0eZQI%2FTtxC00nGuvQs641Js8flDb2quUO4pOFbMU4XKoJjUE4wl%2FmgzwY6pgHv6GqNsdZBLpW%2BAxNl81gjUazIk0NHIEZlUIHEY9n4DpaXGg9QXsUYCeE%2BdtYuRl91Z2qOwBNWlxUbSVEACRSvGTKpOmirSQRPTYiI71J3CzRBrPTbiiBaSrTR9aUth1vgHfeA3Yq3lMKn8HiXSkQZw%2BrLktL14x496yhMfb2pHWCjp17U%2BgL1c98y3ZuT%2FTFGaVn8Jkd%2FW%2Bky5hgLMBo%2FSf8ZVtj4&X-Amz-Signature=685a1437376500df38402c406da1ad7979ff7c97224694cbfa4281de942dc5cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=64d7b039af010a933e03e4d39ada6d3920bf01387cbd1f75df9c3d8537f135f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=a5c28530de1f4b011d846aada0a5ce998d2b033b0a698139deaae46c14170b09&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZBBRX3I%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHwaCXVzLXdlc3QtMiJHMEUCIAcD8jevjYKi8EMq3WWLnQEjr3sLlzpIFvY4B6ySdZ09AiEAtfWlbu2UnJxTS8ad45J%2Bo4Co4tgJGXL8D9oyEOURvtIq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDOrOb5IwGWjOA%2BrYKSrcA%2B5SW4Zbd6WyzoWYfomG7mSdnZ4The1AgRfdl3lK3Pd7d0soL0PVDeEimgwqETHG2S5AcXGmrLwM6qGcky3%2FpurrNkZWoG1rAqm1BQzWI%2FuHHeihykQwJg4720%2F8lVw3%2BMXfXSlBquCZ%2FeeWAlmwLNdrD%2FZUGFyoIV6oKLQSMRjfVQOYJ3HlZ9bS0mcYs9NeJCRuFVBrpTjkY%2BnVY5VtOKlJ94wHSk7xQ%2B7Ywf1NbH%2FP1BlAWuhUUpwDNbJnkHrdWphsFsBWYTou%2F6BNHC%2F3g6NLJfAUVSQY9ybI56f6zqthoT5xV5Ps4yZhXhMuqIBSvYnA860yRl6rD6u8f1dq3mKwyvcgMCvDOTHIH5cPaKz83auw9PPtsyr7FbuJnYJW6F5IA1G4tiXiiZsoesfOZIQprGJZIR1dGR00tcjEh2ydHn1dR%2FUcNo%2F8rKE3MljMaTaJ01Y%2FtisyFCxwfqJRz6%2BwMlmiT8sANJfcGGyKUGpFaj9onOh7L0VAWDeDx%2F5i87%2BbLRXVSYgiCo4vlec9NP%2FZKq0xnFNotcmfKKDenoLdquzraayG1owrLAIRJbWjIItjgRZG6RkmB2GLsUVRITP7YrZJunTre%2FSI1PWi7xIwokhsPYNMsgJ%2FX7PnMLj8oM8GOqUBw3WgMAqyRMjCjk8R8JJJuE5OhJnQ5fOuhP%2BvK0SlfqAF0CxQICc6UsyHTFhSNDKLfVfuLqC4huvgFnLQ2iIWift%2ByKpEnlBpc%2BLmk3%2Bh5oANZntjNgoiZPB%2FejJnYDbpLZFhQWyrDsWIJ04vbxYDt9AzjCUy0QvLvLJO6fJ9s7yqwl%2BfLl8WkcLciYFgXq%2FPkPirat3dYglJvZLeb3ArM6nzznTJ&X-Amz-Signature=d9c753a7646b1dcae179a16dffb0e82c52127a8c1eec5cfc125d686a0974e43a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=404b7b8fb715bf5f599bd6b77094f181a7773b833054d120b3198cd76bb4cfe3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TOVRHOHY%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJIMEYCIQCcQLeQko9WCeEm2t6ZiRnRP%2FeArIXUDIQBQK1BAS5yvQIhAJT7VkwGeT%2BIS4%2FG6CDWDMGczUcDlabfhXrrkMhtZFQJKv8DCEQQABoMNjM3NDIzMTgzODA1IgwGxQX9Q9W%2BK74YRv8q3ANyfvdwWGr0%2FWNaJ6g1I6BgfnZuDF5AoVEv73TkCms6Z6EVPYAFQAEIxWy8PkLxHbyLZvUWuIKc3qkJrT07zFzs8Ojp%2Bplrltb1%2BIFbtTPwlUwlK0qBrfKCDYbQ2baV5HmQaMODPJrgjjRd7NuvEFZsqIYIXxU0jUrmvPIumqo7cHL6MbX0F%2BXyvIvL5sb8Owq4K7xXEH3IPDPWi5Gj4s5ZX2vm1AYAw2IA7ZvBz7OqSg5sFoxX86tKUu6OV%2FVQAo2os%2FnbNOWIcThFqcMsk%2FamOEFGutXKM54rnmoraIxXbnntyfVmxrrdSYZNsmnd%2B4IpFSHDYrcAYCfCteoDnbMi%2Fhy%2FADEueVTVfNu7uB92wGi8zmVnQ41j8r2zAblmz5sR7ZB6AbJk8yhY9XDFzJsasg8f19%2ByCvKt%2BQi4aI237WMueJYigUb%2F2uIdNAoMjC%2Fk9f83haTaDwZ3O49gEztCCouwNeZzbbjqYwOZX5xgcRlSl4XTLXjVbHRhR%2BASS%2BiJAhpVwS74H2%2BTr0oWhg0d4QCAQVNx2GPv2z%2B2JJ5iSKHXc6Rw154%2BDEt93u0X3YTysTrcPEqdcxGq2kRzBKmRzEPESX%2Bcz5npHGetWp6PHEvpN5A4YmUu4A93OTC%2B%2BaDPBjqkARekeDryXDema1K5DsAJ0EdxA%2FfJ71b%2By6%2FlYcnCl3JtQKxPq7sQMDfYmPorbVDGKfxybSI%2FcivItOExko2FXWLv2taSl3l%2FhDNeCMJ3yovf0Ltu%2FhErMefg0xELFHnUji6LWvHeIciPaL1mMyiCpuSgUUc3VbrfUqvuOm4kRhSTlKTrlTT2fq4xs3kGwCVK5762JFuwCtR2%2FoCZHSvlDEUsd93r&X-Amz-Signature=9bb214726f6b6809c88e7ec28809ce7d4c338427f8f671fb2469f461dead6efd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMV7ZMP3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIQDlC5lgU4HwidetZJWQnO1P3rboA0vAFvfE3SlTAVjr5QIgHZ2omw2OZAdO3EdIl77BHlm6Z9m2AK7iOkAsK%2F0jSJYq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDMU%2FPrcht9pN%2BAUA6ircAxRy3DbRshbXfuHpgL46WAIdkJsLilcLS%2BbyFYyDOk%2Fyq0SvATpxHequMLojCPpg5o6W9%2BRxCh8MQhnkvfL5w%2BxAALfp2KN4dKnfgVXRqgC%2FJtskDB7%2BL1QFLR%2BsvEBYOmvlTepgGD0O3Mb1jKx%2B1eKZqmIPoT2hmZvBrp6b1Iwk40EK6YFGspc89okKFiBYiaCyrhylm2Nmg7%2BwgkVYviNs8tIv3q%2FkPo52QPI7RsGobdc%2BSuWAm7xIhupeisn%2FEQXZTvYKeBxO%2Fm7%2BV5zATrS0bJikI076f9LZQe%2FfcQFS%2FcL6zaEtQM9VxOKxDpkSDZxLnVRbVtihLH9d6WBK%2FVebhMSCVTcOm9KSnIyA6tqpgD0dZNPQfnxiqe8A0eZhVkEYRufZl57mC60G1riErrsJX1LxzOE%2BCsrr5JXTmZiOEBW%2F0feJns8EVDf%2FmJDwidvkMty3Ig%2BsNX9OHU5WJS3S%2Fe0I5tc99X%2Fpkoy9NOXUg1Ho0w%2FpHfFzgLQ5u%2FRrg2YV9zYXDWNauYd%2F%2B2fc72NoS1IaG6144KVuUaffMjNvhXH3yaOnMBCH3aN22LhAPVXLbSxz%2FbHyGuPdPqTAkx%2FIt5ogPQ%2F2XfXgVnFeDnN6j7sdfK3GBWXAYiWRMIL7oM8GOqUB81N%2BdmB6s8oCfar3Y9MUloeVBB7ZAitPf5%2FHUc5WDjmgr4DH47tIxLd4gzdDOcel0X3KGR1W7cIIMbeCBB9PUsMgrmPx5OJgmSGvvhPiCyONlxd93SikLLoIoycFaJR4VkGIaYZ3tPkZR7Ttc73%2FeS6JzVufpBQyVHB1uJTPjIlkpLzIMgMAgosMhJZlC1iz3HXNDlhmQRSRdfwBQfvME9p%2B64k2&X-Amz-Signature=4e6bc9da76ab7878be37a76036f1038743b257026ea3ffc69d9d9e735e7af41c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PNXUGNA%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJGMEQCIEFcHqexFjTOT67so7AUdqWmiyWeBsmoYbpzI5NfdpoaAiBJYWwKKkbKgIWlN4AzHh4p2TzCXYZ33FVvd4XoEfG0gir%2FAwhEEAAaDDYzNzQyMzE4MzgwNSIM%2B25zxs4VSiYR39PsKtwD5hNZYnm9BADbrzQIfefcfLCN6fvPv4XFAOEgk66xTKrxSKFTR4Vfhf8Iy64Hgkb5Z76u%2BMuMYyhnKRcoXvlAaPmHB4sx5xGWMx3tEYPrwexlDxOq3nQS6XT1mW3jKTV%2B0o89Ffb6TDirQJKu68dIM3E%2FHNbY49xdWk2MlMOLC2cSRBTjhek06myJ956n%2F95Z8OqWVSuetqQb%2Bg6iii%2BQug4paCibeGM2OqNFGhjpXviPJtsiFrcBtGSEjHBGUiDbO1PWWN3KPOez%2Fy7fC19hY8%2BmAxGnrieYBzs7BeXU6cDCr0%2Fy%2BhLByNA%2BpePS1hfajPZvEpcfZQc616SCsZm8N9uWo9VC81tH6IhmFrp0MJPF3fwdYh6jPyoJTTZMtrAo%2BdByMp6uIX4hSmEyLM0iPfw%2BqNU8WANEagMzbZxal0PnMp7j9LwT2aQrzPvGWypqHOIIRmGeMdr4fr4L6XCujrnBvKyF5yi7hMy5tHHpuOQdVcTNkFLnZhWdMxxbm972Z4mq4ERfF0tFdkGQXHDCup2kWqkd3yK6BPoRQbAcjhrI56aiOyosT%2FpyVAZvzmXfEcyUM4YxcW4MrE5nE2ySrNycTNnKtsLUUOh%2B%2FDJM2pqieWmoyqk27KpOX%2B4wzvmgzwY6pgFwa71Bj017A4J7r2ymvgLB3ttJKpCilOaZEwqGPUVbvxcWIF48hbWS7Onfmw%2BwFGHhtRcQqhPch7PmV6Hxu%2FGEmbmYcn2ZSmp6zB%2F5tmWAbsBy0rxYsXNIGYw9Pi%2FuopXlgv6H4TrBpJt60MJTGJagvfxOjDYZN5XXzBxukvkIQxC9REsN%2BLrrfqNd9VobAX%2FmGJYC9xnU4SNKo7C1wf5zAcch79QD&X-Amz-Signature=bd17acc499cb54ea59ff90b65a2c8be5730ba776a6682dc6361330f3cc851057&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665W6AGIOQ%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCIE8WEa2qvO7dK0h1yUu%2F%2FO%2Fo9YGuZ90XlzeNfw1BuIrMAiEA0Zkk5BScxMupJXX8f1zFew9rNZ0BgaEaTc8woD3XHZgq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDFo81kH3lq98KFYr%2BSrcA%2FCYhgTA8Kh5JLsbl1NPi4lR7qsPq6Cjf2%2BakDUIhdKeZS%2Bwq6JYHDP9mOv7Uergc435tazNcDRrJJ0y2MbyfeSEJAeJoMWJPn8uvd4dNluKFh1SoR8hrs%2BS9RL4enEps9NN%2F3JpiXt02G5M476sXW9zKh7Y26dD6%2B63JqYD%2Br3AoJw6%2BeFlHRfEl271sJoVOzO5Zpt%2BWlgeMGotCwc%2B8v4JL6bUWjnOVP0E%2F8gZvQCvxX2SXw0zzs8KVFZdLuJFjv4Iiq8TFNB%2FN1PGhtuJw08jnUdd7rfa8JLTyKWb7FPVvNxrGLJi2epTr%2BUjXvhgbteheRFaCw2%2Bf%2F7TgLgMMgi2b06Jeb8Gs7VRXJIBqhJ6Pmj%2Byh6%2FpOlbqhycuwGKBxvf28Z8%2BUt4d2EhHWqfS7ac1HicMDRvkTBK3rzAQYdrrNz2PxC0hRxRAB4tI6Aqpz08OYORq8tTzLgnFfAMiuSD22SKhsaH2WTd1DhC9a97JFQen%2FQ5Sg5swSxVStAxZDKtFDguadLZPC1w7POOSPiYtzYaQI%2FILyDK41Cy8ujo0GQevLFz06O59xApscz63GwU5Gw12OB2lsoBz1vXZMmgAIr2NpteJoqa6XWUiqWDgej4W7on2D%2F2UV4mMMj7oM8GOqUBurTzKciJ2na4tf8FbFWpXKUXbH3OjIcZdmK9NBQdRQd4mdlLj2Lo4pT6JPckYxMJBPGmf%2FUodyeWjDcsUmIbEZGNFqZ1VHEiUJWH6pftdkFttn6fsqNosXFU6wKRzBrgvEHOZ9Eg6xBGElJXxCPmh1gG2ojQRUyDXN8IjVObmDtIvO1iYSxw%2Fl6idcDogg6yBzAMLOSTEi7dFJhUZpNWunDe%2FwYH&X-Amz-Signature=948f51279f85d1cb380999d366209a8a4053268aea860452d46a2aac10a025dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=f2650d70a67ced6d39cf1ad7ee4e184184bea7b7f6faad3c45d0b35f86357236&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IU3G4G3%2F20260422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260422T034219Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHsaCXVzLXdlc3QtMiJHMEUCID2dd%2Fyn6pc3gagcElSKVvUV5U1dhpLapiY7RtbbW%2FtBAiEA3%2FUqaLoiA0V1vNFdSvm2e1KRKkDPt1Y7qbjfnbiYU2gq%2FwMIRBAAGgw2Mzc0MjMxODM4MDUiDM3S0dnhLUkQ2JAVcCrcA10JlUJhHdmuVU0mzLJytYM%2BDqpTzV8%2B1OLLYlN7GmS52SvQqeV8gelp3v4ZeztDNTpJx%2BPeNfxukv1f7kDgUxAdn%2Bb1NVPJ8%2Bhv9sbWk4WbbmtikLbcQ%2Bhj98%2FPMsL2D%2BsvJS3Ydx1ryg7goycnEvIUU3x0AMcQyb%2FabqqxMViRzHdJp%2FfikbqxDM2aLLs%2Fya43KgsuMfJV0wl%2FvLe2EXqoL92tCZPx3MFlJCguOELZQ8KmTwm5t96j8wwJVy%2Bn7V2nECa0h0pELQ%2BO7y%2BxjkGfo3iZl8Z6kfLS2%2ByihqNoOzWwmukoUYtOKJsC2c2Fgilq9nmX%2FxoRvrUEfu5KWoZEEHucJvPWzOgyYCe3ZJdU6B4CnpVMyUZC0QObj%2FCc2i%2Fco6nd1C1tkc4tPzTGi36aIDjsbqfSVeFNyi5f3369AtO0wgh%2F7vCvx5fQQg45xmbp%2BNFd0HX3JdpPdfxWkcL1Zo%2Fl22pXYHjfzmcd18wfgPh5dtRpd9c5zFC8rwq%2FfGBV6m5YyJ5%2FNMNceGoVeQwBnqxMABySB8iCQTl%2FPLE7qOsrkjFa6Pnlk6djt0VOWih%2BNH5GN4Dk%2B1gysYCmU3ZNbXTZuL0F6224wWgzfhGP0YCkrens6Fh52UJRMMz5oM8GOqUB6lIOaiTd%2BBuj2onkax8mMsnv%2FBvNVMFKULWwRzE%2B38fYdSGlppiU3qgf6s2wEZeN0wqsGIR378zXUXaZwvhHNfDqnaiJ5Kcb7FsF24Ak3ZWX5GY5%2BIR%2BY5A2w5NIEClqr6v%2FU2UuiZYTRnHjkofa62%2FTPIaf4ICsHFIwnDIB5eRFFginrozIw1C49%2BQZHkPXfsZJW0BO02Xo93%2Fkw9LGpuO6xSW0&X-Amz-Signature=e73b6eae7a0b212536e8736d441e739edd31d89461a8c0e509ebff73a7b26eb2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

