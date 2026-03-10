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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=af8dd0acbd7b5af13cb45410e6dac540391627a20140029409f96fffce72165a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=9a55ff7c2bf5e889f3f31659560d3f5392dc3b3211ea24ca80f709a3a0e256af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=e1a308563cb90ab3b80eaaaf74da00312c513a5ca2002e2f7c7e7d05b4d26bed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=ac46825b71b23d00347a5b34b66a0d37e94853945f62574e51b3174973827cd3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YLDYPHLV%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025114Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIQDobO%2Btttiat%2B3Fy5TUzL78xv4E%2FMulv6brerbYjhZKDAIgV4sckcwOhcVfVoUGfqvf1wQDMh3H%2FkpC1srvIQxckjQq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDD2ZrSW9uhsb9ZXC3CrcA%2BgVO1VhJ6Fh1fTKyVKsPCr%2Br4yAPPEdXWZw2ZcMKATkVmAwpu5ldYZJW1upc40C%2FFeP9GyGQOYbPV%2FLU0V2Ivuna5EoxZk4%2Fh6KQFdYC2bslm1phC9MQhlChBjZl3s2iFpwXDcCNjVDqMHAntfc1RoAW6Mb2ukPD4d9TILApWzVidL8r1SI0X0Mi2oeN0DeO8K0xL0rCyWNu4wCSDbFUPbC0pmFtuMcwT1h9rHRt99z0nON5qwliRmQUE8QxgUMxwuJKpYpjUHKpjrsXKJK2vOPkyshcI%2FmdxYqdRjAXLZVYTFZl%2BgL9FrI9JI72bMuYwYzHspKpEwCFExz%2F7RIlRbEo5LHBZXXqpKyI1JxzIFcK7cv4EljFiDA3qJLOYDVkZJwzYrbXPT%2Bd23vgh2GrN6RorgmFXtcW3XTmHN1S7J693a0TVIJIlUU7LZB2FGkHBXEpGwpV2JsP5b3nlYv4dECZzsGMgpbA5L%2B868akKl%2FwY4epIXM6NhUdupruNihiTBDEwc1yiien2UK0TRki%2FZnImfc0UeEcb7wMPmYFcWcu4Zukgs%2BOsHBmJuaiIfSbKL7TO5l3DXlLdyC7MNMQ8zZb5%2BKG0Ico%2FfroPu5kAtSCAu6nZD3rnbCA5PCMLDmvc0GOqUBzn2kB3XgVuQ%2BorhhyT1dvtTGVacfFlqTLuvQavyyXeGvArHiLjyf97786NeIv%2BTicQnIcmq6HsF8OAqMY4vg0ppdscSHuUQB779bAe7QFNruaftMmoHtOmVdEYRcW5z1Mq9wfGcKXjmgzdXnvRNWWIB6hLrT5j%2BxmQED70rcBhTQ%2BiJgWmAVmeCVq1L4rtqQdfNqOUk3S4TCG%2F0Bwg2%2F658m8ohx&X-Amz-Signature=274ea1b718fe062ec5ff227d6502c463c58a021e19571f529596af4fefc39ffc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMQ3CQFN%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025134Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIQCVz4W5%2Fe%2FyiKq5despN9xvJMxu65RHSfAwtNF8c05oBQIgYp96tZ5PZYYEnAUIceTWLT80SPh5hB9l3X8sb3PBrLMq%2FwMIOhAAGgw2Mzc0MjMxODM4MDUiDEyG0A7EtF3tDVI%2F9yrcA68jG3qIe2askhC6%2B3Nqk2w5NTg15jXd2wmV3ZSpN%2BuT2%2FwRPCW0lKiO7Yzz%2FQtnhEPnMklhVB%2Fc4WIJLL%2FtbiaUbXgOR%2F2TP9wK9aPvEyJvmF9cFxnpZi0%2BGiHRD5yNftnUDXQkvLTrscP0yLakzlYYMpbQEWmAzolvKPmRU13qoGEFkUopLLzA4QXj%2BAAgMJPnJlM8JrbNXJb%2BW9%2BmVKdX4jp02sop0fqMFh%2FLMqT4DpgqBpRUtknDGvhPVokt0wHvH0lwgfGC5vGm7WH%2FYi0wbgFerB9e%2FjnLxLM9CGBkNDx6WwUPbn23xFNWfMtnNUBtXiJsfmlcDuvWtXzcNZxGfbOy3mJEFyU1iYEjvPr3Dgv4MsknlZ8HhYeV9Z5SjGX4VgEHCvLWVrBo%2FuPQLtu9fvi1u72mHlAcApnMbnMe%2FsOroTH9qp5zW5jsNHectylcCG2obxtKeYXqEcAatSTynh4Q2ydHXfVWUfGarrohoiFGNSl1mbgHV51W0qnMbIJPWv6y6ADqq16koyfcHu5uoGVELt46rVai9xTgMqxFt0fKI9EX%2FkRJZ03MdWCzP7eXfCS1lsixdLlabBgEBWLIMm%2BVcbkSyQFEiB3OqwckAkr2vn0GwiDjEp1MMI3mvc0GOqUBSYWeOY%2FKs51NTwankSyMtD2iXL5wbkqxx5JFFEBQHn4g6GJKzpDzMCNTDsCefG5R78TZvVhDvdLjjf23pmsvGhWmgC5k1b54ld%2Fs%2FfubdY1kxTZX5ivoGzAG9l5mQwieC68EbXrOKMTzq5U0x7eRJrFs8J08IxyODEFeCSuuhGNvY%2BQ8re0LczLrXPrMRfYW09QshOXTjuArZpkxBFnbvTrdJ3YP&X-Amz-Signature=07a4e858248566366cad3016df08fd109a4a01421e47efbc9d3a8527248bfe02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SMHJZTGV%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIQCds%2BKpobkE1BZcHJUqtNAdgSLa6BC%2FxrYmSQHHO5sZ6QIgVEnDhofodu9bEkgVXV%2FEEA7saRr9qRAndb5OuecSoX4q%2FwMIOhAAGgw2Mzc0MjMxODM4MDUiDMhFCLm9gvv%2Be0qMuircA7vqQr8GIaQk7rwZVRAjEp2NA57Y8muzQ6RLprDOVoNu%2F1ZNZqQP7IZQPd0nk0L%2B88%2BD68sTD2ZC6kGekk9DGSJOMId%2BISNITvZC1ygb7PrqYeFlEADtZ85CCcEKVYXwBGcOAB5i4tyfoEhZl5D3BWvg%2FaLghhZ0xtUcCbw3pokwzEHojS17gjY6pIAfCteogiQwh4xE%2FwkapWtTyEXBU0eRcEi5n5tS5RbFDjSaTypG1PQkDpnoVMgmyRo%2BmnJFlxaSuwqE7KjznVlHVG%2FLlUu7%2BYkkxmV6je59mrYDWLL3eElNlB6WevLyQCt3MC8KWFyuTSposchfueoYkEkYNbPnu8LCM%2Bci0pe5Q79zqEjX%2F6mukkdqnMwuZ%2FEgdBVV6M6VC3edSUBeNO4mh%2By3x8UfRv5RLigMmPex5P3FjopZJuA77fQUMs%2B0i9LcbsPVp6SZIApg4V8G8xlz7M9%2B%2F41htGaCiAJGDqVhk8wG4LkCl983MwFDILSVpv5m8VkixMPEfvkN0OQoNrS4PLawGeN4tfX%2BYqs4oqMoTnVm%2F9HesRk4gEFHBPFHlWPSBEk%2F8EG3ZUKd%2FH429VDS%2Bj48sFjNOyC7Agwb6Z7NslWiAEoW1Fh1DhDS%2F8Df1NBrMKXlvc0GOqUBhQWHlCX8HDYH7mwOWFD0VEO84AFjYt%2Bw6yaaxHlWJlr0AaEAfhAQDkoiNbeBfdfNiLfeq58ypqb%2B8IVpDAdIieWBWqKefIAukZ1c4T3saoRJ0gfnXN8DFLGPu4dYNEVeT9CtHbL4CSb4naYqYent7%2B5XXgMBcT1QmrIVnYJW9RzT9vBiBng%2Fum0zzcDYGUWTiGwcFD04kpRmsWAvyiwvltqZC7Zd&X-Amz-Signature=44f877e5430781113cb3cf170396c6125754d108adf341ac0d3c20d3614f0f36&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673KUWF32%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025136Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJGMEQCIAVS15NvJVLxtuZqNo6fKASemXVuiaxV1t5jnVM9elNOAiBxdPsxqQBkKRkJZwesksgYHwU30pfL0HTiOfOG9mpRVSr%2FAwg6EAAaDDYzNzQyMzE4MzgwNSIMmJh%2FT4NExShrnRK0KtwDUbEKCnEbK%2BmBSlPHn0ggT8ejhZvit5sswzFmK%2FLqMCMLj8fw7m8wPqQOCrCmejw6nemsPjww3sNh6Rsw6HJ1FiWbeDAYmsZf9KtdBsjlx9nfC7KF0kI45ggATacmYG0YqMuikwMDk%2FjYAs3cFdSOYNC99%2F%2FGWQxIYXMoMFCGEszWufea6uRG2VPUYkxYs9bjf9zQ9rBgGzuY3PGNXejL0BOChlLqIx7abrl3AyIPVhNkr2wO%2FRaQqYRkD9an7C%2BD2Wm6yWmQfVLE%2BFqE%2FzN4EYf9Q7wgxjo%2Bpw631RpgmZV0K4%2F6cw3FqEg6R%2BtgRLPqP868gJLFT6JTSGEhmFTc3y82MX7xGppNNrYNTwvrA91SDLN5d%2Fyh%2Bq5NTweAOe%2FFneXUmsmJa6ZgBCWLw8ywIQNpdVROfUuEu%2BvXmwfqCHtAI5Q92VqUk3RI1rch%2BautMig%2BlcgmG8oEQcRAI3tTaDnw6OilfaBSlz8dxeLlnS9l9q7AzUpUPxVXqSriUHr8bjpYCOlKGS816RzTYoCUaaCYX%2BtvpRrItb3NF%2FMXWXp0HuB493OTmmjlLdehAZdAr6wv51i2vRhaUAVJGy2zactRgykoP%2Bxo1p%2FDIvak44pooEww6HtiwY9Pt80wn%2BW9zQY6pgHcADg0Z34fE03jK6qVZS6dAu3RBafj7TCBf4VV0QDlkE8Smf5qW3Rvp7ZlwBgWGagQJulWryFiCmY0fxjm8p%2Fm8YUBadtJ5N06qBgmfhqbwHXcp0A9ppSVFBvYPdiYAfIIICYH7LXdzQ1oxiXZsW61IpQz96kHI80ukMZ%2F1a69dPJ4vX1VauID4zTI58pHyCgDeYGOz79tIPIw56GQxaBNmiaFQZiT&X-Amz-Signature=982274fa2fc5a51bf471cb7b05f7f84d9cc327374c5e76f4ec740ec288a9db69&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=1cd4b0476e8e3cc32974db6bc298f7be64b952756332861309fb2a408b8de387&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=9b1250ad4a48b822d979737d2ab4a42a467dca3aaa30945776b1b975d78bd972&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667A7LRF2N%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJGMEQCIDH9FY2ihvoC2YUp%2Bze6FrNLjZzMC3K1WM1eDx6mbavPAiAOw2WSY5ES1uHuxBVa6VK4nde1ElStuGV6oLYBnHxyCir%2FAwg7EAAaDDYzNzQyMzE4MzgwNSIMR%2FTIATFvb7v38FtpKtwDRAZWu5QfX4G8XdyHRdkv9eoqa9J7Mh4NFhpRLI1goUuQlpEs3WkXkO5x4I3xuPRg0HgJfN2wUi01HuzjqTad7qkF5CwmlBmp4SHeCrXQ5kni6asCR5DuYRDleaQI%2FM4wp9507vH7ENJgzNI5FzNA5JTIYhOv2pZH0tbX44k%2BLfCmY%2FoveVuWHgzpWC5H%2FW8rXCmU862W%2FD07buH09GP%2Fy6A%2BT1SlYGZmkaFSdpTCjal1Ugxv9c8nPFFfZ6QP1vxBmLYz8XJlAZIjSOv2pDNc1%2BHtaeS9WNCeM3JaQf9iDdJe460Tb9yCGEsgGEqn0r9fjUt4DFsbYuaCnMKT8qHh%2BFUc1UJZs8agF7dILy3RutZAKwBf7yHXuFHLOzQXEE9m%2B5hWK9hqB%2FfaBQnBFPycke4eCiVsL8A1NTLI2gdp40f%2F8GsTvQbhjkIKb5Guf%2B9zgjOVzBbTWjTe34DXQW4YThHqcdQe3LVFAReS3J4Pb62FTphxta3%2BcBoyjx6dHAaS6%2Bspbd2nzw6%2F%2BbIZ8%2B6wvT1CvEFUXjncdOKqS1455G3Uq%2BUTFjZf0dUYgXmHp%2BGwhLqOd4X6QqKlOTpvY5Q7Tnb8un54%2BZNeG9uVx4%2Bz%2BAmNii7D3r1kRIjE3%2FIw%2FOW9zQY6pgEdl09C3DY6zf6DoU3pzNaVFBXwhYIhV1Cl%2BxSde6hpRNOjD82u%2FZt%2BjArH8kekwEQNKgsSgRTdTSgBuOwmffVAAn8hwKClu5aH7NKZ9prctaSic3YgnHYKJs0F%2BzF6e8LTy7GDUZKrpo57o0xillf15KF7c5DYsRHuPbNIG0QajKE2rRNXHWdoFMgkXQK11x75XXx2cwIolR2sW9iIdDxQJMMhbfqX&X-Amz-Signature=06ae3d8b9f573e584cbeaaa274448908af060d278a3a9c9560c57e97f0ba5d0d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=069f2b5872b4417fb6b3b0d340a2090a1dfa890a41dc64e3b97888e8eb9824ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBFZXL5Z%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJGMEQCIAzX2nuUF5nByKaRyCEQmsd%2BzqmJ9lv886s1rAZFBAyjAiAVTckUSAkubMIGfMTViqsaER2lPkePyQHhWhr6tVzt0Sr%2FAwg6EAAaDDYzNzQyMzE4MzgwNSIMJdXz3HIdDhJVV0OUKtwD5ueoltWnu3RiGEiTbJOGqR3mZwPMUTxHBhdp3P0D4Un3FZGN1SPsZDcMlQSl3LVEtmylseDu4xxSJyK63xIM6V0o%2BWPGGwXwmI4xVk%2FOcgRdicAMW5IQPpfAgKj2Gk%2F58WpHYx0jx5cU1fL47WiF%2BeT0ZYNiQ6LwjJgG6lNvlzrfGK1pf%2Bh3BPvVkqvh8WiJz%2FqX3oCI44USn%2Fjo4ujo5m99KZPawt8PlnFzHTjbFkGHyUqx8Xph9vDYgebgY5EeDM9hlaom9V7nKo%2BbFkRd%2FyxQLTfxnHZ0olQ8ZlqAj5q5lyoFXJ66BpLhSjuwlIn4aDlnX8fXVjc20C7a1T5S8cjL2xocc4YKFTrnWWk9vHaieQ8lSyLQfO7k6gWcK0HJrDu38LFrSSp0OdCQZoTVsSsCipGyiYq6DAxGxeGj2yGLcqsBL4abdwAMqED9lKqIArL9vfraMcOWrMlJwSpczagbs%2B%2F%2BdKaoPQl4huXvAwK%2BaPEAIRQU53LDxn5H%2Bp7GohykZ%2FbX5NLznsKSbpBVYgHsHvhjiiuERSfdhPXlGEJTETygw6zeXG7nXZ74p0Ra6bCMqSLQyMgFz8OY%2BqsCGnv9Nohx%2BN8AyCQXAz%2FoOZ3BZ5ExOB9hfEvlM%2Bow%2FeW9zQY6pgH4psuu4TY%2FqiPTIGlKTfEs%2FFELsFJ7inMFOqOWCWM4vz%2BtpBe%2BVejllUBwQkbzbVgAgp0xOexMEb0KtF%2BYRij2D7qKKdF%2ByafSZ%2F9Zt51NME1pgj3thG1CAA6O4aqcb9kLVu9npK2vqlzroAb1lF3rXxA5GN7JrxQU6AdI4CHnjy09htInCwap1jM6sJ7nDGRRBbStLfc2UaYCIouIeX%2BkW7b09z2Y&X-Amz-Signature=4a177ae0db79e5a37428b63ad2f128a6874043ee763f380b3999a5f6bcaeaed9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SM4KFSPW%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025141Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJIMEYCIQC6ivjdzk3Vhp15elC7Ho2gmyNyaLjRufnZV2o0%2Fpx1FwIhAJgMHZUHLz3McNP58qFu%2BQnfLRwRKDiwDUQbXQdfCLG1Kv8DCDoQABoMNjM3NDIzMTgzODA1IgxwGXyRUdYvuE983Icq3APh7iQC0mVJ29SBWngQkzMSj84JbV%2FIIpJuXjOI9ggWaaGxvCWxay4m44ODutuQGIWvpEDNPsjv3wtyC%2FTKll6N1S1WvkTE63ioqcZCLAXfpaovqElkCY1K7JFubmfHz0j1eZ%2BPGFlH1JbNzVvOiRzmCmgEEtzp108dWZ6gtl9cJbzZbWmzcp3TnJckiPYNErF5qbT2oZn0StSOBAE3tqLsxioUx4yiFEQKrVI%2Fk0NOs5zUbQVczC4vbkr54DjWC0IBT52cau62HrLY8zgnS6tVkcy4frDYkUHX0162Eja0IL9ZiND5HLFrO5XLwqWVnCsHoUCL8v6nqqJuz9cM7ADbEkrvzIau7nGjKqWARSd6A%2F36yQaO9yaaDOJPJFbX6E%2BgUXrS3ByrtRVlP9srDw02nnjvXiTaXB55Xxzy8hAPvyJiZyVS3OZsxMVJCFkwfozigowkFozIZNDF2XgJbEkyYotEJybvB6Keubkt5GyL0kR%2FUn%2B9rps7dtPwzJWSSjEqUa8bGkbjNfUuBA2jx3Mj8EQlquQ3M2HoDFualPyvF10mIm5cGd81q2LkMFA6w7vC8nhdB%2FsTFIg1o7ZGi7A6auF%2FSnT7nfGj0c6Vxy9DK19lERceHgfiInnOfjCA5b3NBjqkAefIunqdjls%2FxEzrzmfK6fVY3EQbmIzuK1MrDMw7HjMKtC51%2B5KqNF07cggzEqp7h5oK309nKLCC%2FSlfByR0sXNWVA6jxZ7SqT3YwxC%2FaSPGRIHRMcFc1z9tOEpyJ8GHsiGQ%2F75w4noaxGlXwMWYKamQwUANpdIDePUofvqRyZOgQeYaN8aWmNohmbURTIRfsw0O5jFH%2B3DAVjGctrD1cUI0UKHY&X-Amz-Signature=2f03910c9c75b7df3bb6994ba9b7ea79725ac3f8bae24777b34429bc9aa7b533&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QTMZCL4K%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJGMEQCIBffxYkwc3yUTtw3IYmOmB5cxmE9iuH2ttxN%2Fixb6yeTAiBOLRoKF2oXFXyNxBdhMAUiih6d3vJMkH%2BDgtd8Eso2KCr%2FAwg6EAAaDDYzNzQyMzE4MzgwNSIMMe42wa7Hp4Od5HMwKtwDBQZ0cFcJNtd6IG74Nt07Gy2bhAx0Jdab8x%2BBf3lDkTYnPANHhMBxhViiFgQQ%2FQG8plyodRSpoEc4sOqCZyrICHluQ4QtkknfDhs%2FKFPVGeENdmwANlKcJryEU4WketXv98wUXCVDFw8C4xoHZq8dicGOlrOOfqicFrWJp2ulbWQLaWNMty7bZT7hXXkMMu6xSSsV%2FkfNLfQVv%2FaonZDO0YlRkZNqDa%2F13JdgBOrCHF1lxFgy4Wko8YrpFiE4pYesTQ7C3AhKeO1FwZsFtTbf5vdFuxxz%2FEM%2B1AZHxRDRuxmj8X7Us5gAfLm3JMHD8p%2B4k7Vs37s3e2ZdhDVHMEojUAqpiV8JgFLe90Cxt88rm6WJu6YuI%2Ff7N1B2JGRdeylcri1z1%2F21DqyUoFQz8WXcTNBzMzed4Y4%2BUAMGX9vGfP36O9wunTamToy6hwXuo63ERa3rW6sa20EOHq2TNr6VnrM%2F6JN558C0WhLXikTqi646G%2B2FpmxW1v1HGjI%2BM5gJtKBZNDuPritJj7n8Xk4dlzx31LKEU%2Bfy0CEIftYOvJl48222EcZKXsZQMwt%2BUtfXornblpJYOR%2B%2FNmVXvrNfUgSXgWymZnPT%2BdkNQuhQBLoj%2FhRbrJlkyYv3zWow%2F%2BW9zQY6pgFO7E3G6qELkJVkKvEwqZpkK1gmgZVflDHrE39rnqeoijfzSoUy99NRYFjAkHfjIg0DgFmf%2FxA2fFS3hb6J1aZMmyBFmC8Mwla4zTmOtNM%2FSeiWmclOgy8BWrrU2Z4NCwbrcs7S%2Bs2iVnxEVcdUyazstMvyVF3UndbdeTXwLF5cbklhoBpmgo0%2Fv4ayzM%2BADKHzHYMiJCZw1dBqE%2B3byTXAOTmOksma&X-Amz-Signature=82f1f3ec040088b4c8dd55b9f8039f6df8ad7d24407f74708bcc676226950f95&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y75ATTUK%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025145Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIQDvj8VG6JJd64EEJGPuw0xtKPIVGS6SaXrwo3gd12fKTQIgJx8xQPyal77HIfzUZrfM%2BU0XmcW%2BmODcpBQLhI6nr1Qq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDAETzUC8PIl%2FJpovECrcA%2FiMop8kVFhRPGuOUa1%2BzFYBFcP4oyFY27H5de8Z4P51scDhJflAYizyUcMjAADphz61BUkRWIFe0BlZR2RhVExnWIbyENq4ZhC%2F1wy4HS0ISnqvN2raJSmgtUGKaJU5VT0%2BaxQncqy051NWnKUhQ1BHkRCiwSWRseGFv0mRoLFsSlU4Sgs76YYZWjBtM2olZ48RyhM8AzMoQJBEZqkin2kh5SJIyOLSzvAOHBn1yBt%2Bf8kGB74f2T9TKbxJ7nW4Sq0PENMkMhOnm3pxRzz9HaIaeswzCRNWhSw%2BnqHPOA3jndaproz9HZ%2B5kkayiM%2Blpfkz6JPEY8jC5c1J5IzMhGAi7G%2BHB18tbn8XXM4m1i3pZE5hriCMS23%2Fbv15mZT8delanglPY6EMWWzCe2Ahp20qykzjUpcBnbyVPny0233wDrnnkSezUVVQu4Wy6h0UXNEjRODRqsSR8VbC6%2F%2B3bms2pwuVwez7CUv%2F7tQGg7heaQrzjn6i%2Fo1HNZKQ8ND%2F8O%2B3XiK1n4SWVkNlOvHA%2FKoYu05vk5v4Fq78asPm%2BU6Q5m3Lfo%2FLSUHQ4Ii8Y7aE%2Bg2jJEJc13KEb%2Ffyi38k50yHMZjj85h9x7ZEAs2QkJ156sSF6Ufc39%2Blr5jHMILmvc0GOqUBocSLnAoTGvCS%2FGLMunZAMSb93NFyaym9G%2BsX1n%2FucT193hwLFIfFoyUyHOrSdrUfKruwvY%2BF0WuQLWYzN3gJBm26f1gF%2BwRnDeJxC%2FFGPU2j0G02uSBjgh45D6J%2BQ5m4CJeTTpqdPOvBB2w%2FryrgE0vVSxIYOakkdaSe6Di8kh23b04taHufDcrBNr%2BRV4h2ORWR4%2FI9ktMZD82jMu3PviIIm%2BfQ&X-Amz-Signature=6f884e325a10cad4fa7672ec7a533ad3f4b4c2a8c6210e59ed2b43da2e5a1cf2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=563e68bdfeb738531c29f842f0657ad78a64580c0abbdc4ea256db8c751f751f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRHIOEKF%2F20260310%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260310T025057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHIaCXVzLXdlc3QtMiJHMEUCIHBgB93PjRR490ORtAumlM0FjxvImf7Acyed133NywCTAiEAvCSFWAVj857Ug88kdxpMDtId8fmT1xrnumV8Iefuv7Mq%2FwMIOxAAGgw2Mzc0MjMxODM4MDUiDM7IB0cJ%2BiCw72LIBSrcA3tWeXHCqJYjYzT6lyKYAjv0oZLCZQOpgg7SnCI35sKM5E06to4jU5UMT51o2AAvd5CdfOnEupoWQwnH1NvW4zsPY7HJGnxSgaoZRx3gM1rnyBJBrqMWJifkr4jgwVWU4IrxpfQajU3YXIlsrG8dd2wK4DiceAHTQxooLnz8udVs%2BvzOBZj9HX7Mo%2Bxq4tQktmwJpU3QS51gph%2Bq3Qmi7Q%2FHU1NYkAbVZ0nA64DuvQkxV7eLoH0Owz%2BuTE5WSsNlQaCxub7r5aLL%2Fi58JGv%2BKfMYRqfPvsPFHtfG2jTfrQpBSSZ0YIQrBc%2Fy%2ByDCo7s1Wv1TWzyme0Ohy3CgQ6K7ZA8rGdCYOVfFiUOCqdETDB%2FThsa7%2F0HtJvvuB3U%2B17MD4gYUyWrxFd0JCpkpkphwvJjTFF47PH1190Y%2F5CY5WAkhfNCeM%2F0YgBhsQD4gEZ%2BNYulDBZegTF6bCd1UyW%2FXvAfQsHS2czPKMjkgGfLjuk%2Fld3LKuKd3RQOCPZN%2FOk1i9jfAX%2FoihWeejVVLQ6X6OqWnBAFCa%2FbT07tak%2F4d7sRMfi%2FqSaiTbi39AruYXQzQVIZ%2BR4j8EAnvHIkMVjCw7m9%2Fz07gmHmvq9LADwoN20tahqgRJsWmkv61vLpQMKvmvc0GOqUBwcm2JnoL1Xn7YZ38KjmMj%2BGADSc9Xc9iMsdsLvsy9WA6awBX8QPP%2FT0ITPt0naEZfvFTjQmthtNjsOyE1s38zuccz9GRKB4%2BQrtTQ337gKT32PcrltNYucvTL4U4N1P%2FwFuElNScyb%2F7ejiPrnSpyceHRkR0FtNmJFYpR9OEvKTmhNyPnYHnvs1ZeF0aN%2FGxG2WVTtd7GV2OFeLD6O9kneyeMcrk&X-Amz-Signature=bafd074e020bc2fa9ae8d5e33b110e21504edf797a1aa71c2e7f7bb825f5907f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

