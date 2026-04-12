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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=e793d9c78725a51b6f6a9bc65a8b88546ec07f9cad6d0ad9baf9c0207bed1e0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=cc8e4019f62f64ee8da2cf9ae684ce2fffecea110b2b78538d7794b40bf3f788&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=1aec9441241ecb0c29f2f4cab9900c3a41105a085084d770b3807b8cdaa3b19a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=ef35895ca11eb9079d10cfdd4883c3eacef06a3c1592592146aea051972ff73d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YQKJVG5H%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD6fKCy9l%2FdWb7FI33CCS91M%2FJzsczpFjan43GYqBH%2BWQIhAPYNOPGbkPl6Rf2xxdRn%2BPllamQ%2BBVTdB1J15dJPEWkkKv8DCFQQABoMNjM3NDIzMTgzODA1IgwZejikRvjsci1kyg8q3APQ3RRkvF%2BYGGrjWcK0ASFL9J5Fma7qz055x7mnV2TNvBEX8biwnoaLUOdia6O31KDKBYQv6b3%2BE8idR4ZEn6y2dkHH%2BWfXdSjhuy1ie5mAitFa1V2F1GFtWP5WPXx3bYxJCXUlVzBuPp1o9uJ2oEwi%2BtaAVhW9jeWnMcClMA3y%2F1z%2BBIRGID2ZvaQq7Fz%2BeEerDIhPI4Hn%2Bv1ZI1t%2F7ogL547FZmd47f0vOSIGLP63J%2BwLr6gCxA3%2B8yUd7rp7H9AamZUQYiRlTZkP0R7e99CEo2OtBBCCv%2BkfRzfgNYq0h9LqWttgRGXKBhrawijZLmpgML%2Bg44xrO%2FgruY%2F4TnvvfjwQP%2BokmHP%2F64ArMpTVcFtTtW6aPW3WFBgnrGqxDByJPMzcwdR4Uznrz%2BHc6TXpXMSrUOOlJ5GHi%2BL7j%2F6s4VkH7cmzaTJyuR7MW9GYpKkS1wulc%2FBghYc8RM%2FZf6JHTqSXuC33qRXN4TYyqzAHJDY1Cq2VJL6NN08Ra1eGXMqcy1%2FecWt1W672GXbbNVY4EyKWnXQDAfLnbjauMlGeE7SmjrqwX363S6nGdC%2Fn4a0LDr8NyO3iLtfy9t6Bmcsa8bkOeSDKib3ZE0UUa4UpN8KD2YDuWEalBX3tazC6iezOBjqkAQKNkDg%2Fb%2B1S1jAgVMKpJyNRpBOxq5EbM5F6HPOMu31fz8FrXYFd%2Fz%2FvZW5scVQCqOro7qaYo24viL0sQaSQejfCyNgQbiudoStROIY0tl9psgAdd4yhBIqMurL3pUbp4hQAL25hfT7X7b1TY4oAAPeKnJTWG4Lg7RKM0O%2B3NJtbdwDFa%2FNqx1R38wzFJfLuUWY4MANOAf7bo%2BjQc57qAsUhlohv&X-Amz-Signature=79b5633e9a23fcd0bddf5bf0e37ebf1902cd144c99a2372143e6fa4aab6f5480&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YWXZ3553%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCSU8LZwiAZgebBAoDKIEpwIS2AMC8rIfYSb7eK%2BF1JHwIhAKD%2BlxwC%2F0qpSU9vi1jb9E0KCgjZcQAv42Bl5sxnJcFmKv8DCFQQABoMNjM3NDIzMTgzODA1Igwaal13dwMWCFhprI4q3AOoXvp7f9hEMre3sSgh7lTcqlDdeZ4bZ0B%2BTTyPM4JzSAmW05ZvVeFLEkxpT9SBrP852QnGM%2BiAXGbsxOrdGVSGbVo%2Fs7McRrJBgFMOsRb01aM8ey1mNrT5n4syFjPjCtn10%2FC3ubVSVEJojoex2Jro8s6fq7XYCAfg%2FKKTUAm62aLKqtBsOk4mJzvNvUZzgypnTEuvz5v28oOcO4SZ7LfgjvW590WeNzx5ZQoebTjil2uTUom9yf9SE%2BmQ7TLnCb%2Fep9phX2Qcvxhj8%2FOGX9WxTnxj2RtzYBCQDN6Z5CMOg6inbuKlsYtbUaBv%2BemVB0vnf1xAl%2BB6Vk9byxgx38hDuo0c1k2zNd5rOrZDWLuwtYUF7azOGRxjdVCKQabMVdjMJlkuG6RZHs3NJVJNzccyGkV2EndFh8DeJ41nNpJoSzGgYpjpcKX4xFl9ioBZ83mNm2xRkEwFbQhOP3qbE1XCmFv%2Fj%2B0BsTo2hy07OjvxH4LUU0kpNrtzzr%2BlpKg5Nj8dgKtlD6HvrLOCm9cn%2B9sncA%2FAHwEsYS7Ksxk8jgxvDRmZvOcIFvKn73Z5ZMIraC8qFNAkWgsWtealhbpnVIPmVMy2x%2FNCGmh77qt9EvqjvmoOxrFLPYa0ovGHHDCZiOzOBjqkARVoGelMRkJ8iYrMa9FvB%2F%2B5xVi2ydosOhZutrrGk6dwenj%2FF3kT%2FRv74UL7LQ%2F3TCNB50AsSR4vWo4%2FebN4VFgLMPaYuWyttr4pRo2PrA1q2CdSSTR1Q4fRBjOfe%2F20zooWxA7pdiE%2F%2BEjWv2qY3n%2Fl3sVva%2F%2Bqlqox1fg9Aspj88Xh8oavd2koIkKnjiaJY0GX4fsNF7u41fl9wKApRV3OWzrm&X-Amz-Signature=2dd76d3724daf7cc06329460b6e4e7242caa01080346a6789634541472471ae4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWOPL7T3%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034734Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCOWEpAaXBBmOuw1hxLOPDnPTy8XIlpE7u%2F%2BNNCJG6xwIgF6wWpcAU3tAuhebOQ3msTu189CshNsAPfj7LeDc%2BGxoq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDE92vrf48XTS11QXkircAzR7ZcOqN9taJmtrhZa9DhTcmkcrhoNS00O4wUAJkYgW%2FXJqZ3XuLPhKJts0Tcv%2BVe%2F8d5z8WcVeR5JFQgi3KJgzkJxx4PEB%2BxV%2BPjSfW7lVsmCgMYUn7oHkgkx4NXwkVJnUHF9vo1NMtYX6ZKP9hZrm8lhvkk2kAoQyoGNok3Vk2bICQsxy4quMD7XEzfvCILxksJCyD6lT9uA19tMWu7iU2q4da%2BqaYFzB11r7K%2BIUyAe8CSuIi6f0lRT3M7G2M14GdxnpCCLn8Go0fzNm0r%2FUdfTo%2FDbylkvSsbziieUgrpVo68CfOt8MDv2%2BRVvkYxxtaWhHJGlTywE8UhsVilUNNjR7UJVPAiiso821BRmFjBxHUOsqaIEWHJ0RShlFDnXaK09YOX9cG5NSBQhsI49IqmFRglJxokPGdiNK7UhrZll1qLSfCdkXIKrxYv5AknK%2FvUb5xc5XMQMzoFdj%2FjkV6Q%2BrBgDzz0d1ze2Gj0MBcgOwoI6xhH%2BxSK2TEYYx0mEUd1gg%2BeHQV5VKO6nkZnpmDFD9x5V006bvvH%2BhKyw9LqjUbZbGOSO1Wvp4yuW5h5LF8f1Uyv0oiZPknqsQ83hsZ%2B9TFzC9VijxMQug3mi5cXlycGwRkcu1gVJAMIWJ7M4GOqUBqP9rhFpyo1TxCHIphlNvhBMkOTToST%2FM6w1Km%2BWhUPjwu4A3i6Yp6QFcluHTIIbFodQWECqYcoUxd2jT5Hc%2BG1qP4pvSGTf6WJqAQhcnklzZMAnNYc%2F8VVmc%2FAREg3Jj4CzbB0hkBx7ogtV%2BMGqbZ%2BVZip49RT3xrrIlTlSBfgqbaG4d9h6C0%2F7dxjAOMx3kMcY%2Fn8WIXXRImOITDti%2B2qBt1i3q&X-Amz-Signature=6a1fa250c29640b7984033265618af9fcd5f3e3023704ee03792b21a014b33b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WJTESLYM%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034734Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCQQBJOEaj%2F%2BnRY9C31NzQulWHMNFFGRyceHd0zadJkLAIhAOgIuwI6ivlOxCAnAlITnO98AkZTIdo5nIvQI4NltlPEKv8DCFMQABoMNjM3NDIzMTgzODA1Igwpj263LZ8xFbRcQtwq3AMKYK7goPnvQwg8DDTnF%2BIm8xyvF0NPFepjrXd8UhYUgWxQM3X7NHbT4mJDUEWKwTCnCTDeq2PfUR6gll%2BoW8iIMZIVdZLV%2FCD9L%2FP0UhokkEU1fxtsagh3u7L9pwJDEvNv%2F8prnDt%2BwbvkVup%2BkaUlN4fL74XAbRmaeKKBSxB6po2RJbvVTYsD159YbYfWaU2XX%2BnYAHGgkqqeJ09tQwCZ%2BBtlRQoW3vRpCOueNKskytc7csEa7TkG6ZDb6u9C6TLjX%2BGmDaCd693TYf%2FJ155XsULAdKyxGNJ%2B6DpFSSOhB3iY%2FNKkQgNCrpRvViW1ZkxUIrNN%2BYOMcQ5Akxle3XhiEfU1nW%2BrOyxuuuDjkTztxztHOGaIw1XevBJopATvAFlQJVaWQx8wGyJttDd1nYQ5U%2Fqn0RUOlW%2FTsDqKTSRxgTdc3SAGodsByk7xS5AJx6Ss09oyipP1F8nX%2B8lvM81DEHkBzqfAcgGOHPheBjfSRSxDxJVI1yLVTKJtaU30AcbGgHhnonjLlV6qyzrFqoisbobxQlQ%2Fr1hSfx2%2BNFzVlOHSiJ9Ihrl06PQle0HRRBujF8tcW3T6MK7CFo1amNm9atiENEPrCV%2BdFC73FbeOCOwWLFpvohaX%2FTZgiDDbiOzOBjqkAQJ3%2BSoU17E4AypfqQ8LYV84yrzoTpL8PvaWuM5Iun8%2BXGvaxVwMmQIu78wZKcG2enykzUovCg5mNdEfZwDzxt349Fn8AydVxgVyQVRFfzcA%2Fcm5vxShNfQXurVjyCjfWfYxxiCLU36nRPpi%2BqctR457p80TsAepjGMTqDB%2FSse95KzH106aloAdo7r9cNcSzQu%2FdVjjUzE6gA0Yg9x7eLacz0nF&X-Amz-Signature=5fff4be0de62f34fbf81bdff771f81df4bc39a94b07abe2ff81dab81492421ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=0adadc24e34cf3c583ff2037d39fa71b6070fb7f0970d794425d2f2f7bd603d8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=c766a17a278fecfd427308cb0f7af30e4ed3be7ee36b86a32598ff271b729d7c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QL7JZIUP%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDslwG0PXqs%2FPTNWlAbxrwoHobiqB397XdzocfnL28McgIgdmJt0rE7nqJy%2B6W7uNf52MbEjLr19qF4wXUKW8CYdKcq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDGCRvU2neyxCUwuY3SrcA4OzlMQaaD5YHA%2FyIQG9QGaMyane6ssN6lCvpPcaQKRUSX%2BAHyOJz%2BGEJX0MEFeYHXjmZWZ4zODkNpiHwKovu6c8NkpKcGHE8n0EJ8AtgSGmekFp9aEbCbPPehCGhPO0mytS4UanoTPrctloVnxKKEjTWkT%2BzY8j7B0gICIcz%2BWTFUfZjgPAiF56EtxgJBqR3PDeFlxANZ3e4%2BEn68Ehvz5IG4RT7UlR173WblJKcYbeOgbHZkEGwQDZBsgv4cTbha4Rt7huVRUehBM8KPZuSfoGf8EIpAOEhVOlO%2BhxuUcnRnsCQ3p4PztdhQPp3XgQgIuBg6Ei%2BEjVOVASegr5J6KBYy2Yf%2BIV00QZO%2BoShoPr6t%2FPqug5qsB7j3lL%2FSIKC9lMQd3yb1VMmmUgwiwTCCkNHPoBl%2BtlcH2GGYCT%2BAOq%2B%2F5h%2Fnx8d9ekuh69FnSB9xBkLSM7XbKNi2%2BdzfCzNm%2Bh%2BZrcQOBU1jEs8UWwAmEnSbv6OPwA2ksMYH7aDap%2B5Kk%2FcfsIj0HC6SES64lblNUK0hB8Jw09Io1OIvNDGSaGQOWjFQcaisWcFjPciyy9RnkiEOliZLymOru31xTBMufJvYPct75Ol3inIu5xd0%2FXVhq6m7M5%2BHFEr7kFMNSH7M4GOqUB6QlPec7MUP8Vh8hNb8IapUv8BzMOtq0Xsy%2FhQr6NblcbAV6Ln%2FxIADzHYvi4iy2BRsIPvqHJoIrRbVLmd8owomR4VnEyP5mYOL9wal1z8x14JIW8k3XaL1i1wsAFxm4MQ0Y5ltDjZKsqvzHXLHX4t8Vc93XVw1EyEHVWzyxKYzl6RA0xZIwGOfoT02qSRc5vYv7jNBCJqDN5wyrxIPieAZGoviRa&X-Amz-Signature=d83fa71febb33e561c2b3eecc42463a4603102cf40383289edb2ba92a2040d87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=3e69b7a7feb0fc84d4cbbdcb028186cf7aef958742d60a57e1c73ba69013023a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666ZD2GTZO%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCkaZdxnt1x5poPXXto8LuykeB55roWhMsUTwLDIdsVKgIhAP1TkCdMQNpSCJi0u4Y74ZQ%2FOOpFGFyM%2B5HXn0ZYPXH1Kv8DCFQQABoMNjM3NDIzMTgzODA1Igxd%2F7siU9w3MADyPnwq3APOTBnDe4CD8RgUNdzjPvidKxhvjyrsxnE0FDuOxAf907qiX2gushpVR33iNRMbcWFqyJjXh8jhaZJA%2FIQ9NNYBrhnigKoHFPr1VuDbTH4xCmqYgiCbKs58XNB0qenPjBJlnw8VaI4%2FJ19Z99sTOWHtPMSFJzQNUTYilmtU%2Fi5tkt3GQbzg8LrPpYhhBFY7ZF7QmWYcxzX7%2FKRA%2FGPw7u9z4eWLiB5WJUPmyKE8HikGjxy4X11QLyuD%2ByZHz6ie8FyneDeeXaKLBPGwBhVe06xzw16BQgwlOkTVxPdTuEPO8ZvSOhSb4c8w4wG7m2gK9KkBnmmUT3HpuWppRvQ3KrjJbNOvfzYwvBKTTKIoTklpjrKIVMtGLl4BXnE15p2eOzqz3UQ6BN7HWBAINCHGEtbY4ekZvZJzFQLJIvoox%2BAjE2kjrPvPtaoi2ahTudzZkn%2BIf2X3Sgc5rbKmWx0WeiN1AMPiW4dY2GT7W94gv3N6kjeD0lDjJLs%2B8wwpilT1UeLMDxswlsY12tWruwNdeIERGs3BEqPotpeNMrfJZAu7J%2F5LAVo1DjaQRcYGHxHDMoqzrHBa%2BaFOfoWJTRyEcpA204uDkUBLNDca1UgsCmmuJwp0HfTVryMoghRU9DC0huzOBjqkAR2VQiTE%2BcuHSYjGBkJbchGi6%2FSVxAQVFM3TX%2F2182cXPDj1gJ3aCe2SYe0qZYTtx3pVeq6wOHuFm2Pt5xMu4XZXdSCB6LpBGHlVQTmtJDUcetcxfx1HCAZ72oCQ3PsJmcPwZZoPSUM5mLOlsqAMRbVqBH4SzHebIlbZl3ji0aublH%2FgwVTcwhwfTYhL%2BVqUkwWPJiE8ZPKF0vfV8ZSEvbEM9%2Fte&X-Amz-Signature=dc3fa8a5962cbfc1434b54f8a1d60a407074837d01840e8f2b961c0ac4592edb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SG5EZ6VV%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXVKFn%2BbOxn4OgVtDU2nvgFVcAy2X328CBUlhKCt8KogIhALozU7TXLtg5IJUpmP9OlLmVRRwbtBTEtdlz9XcDK8akKv8DCFQQABoMNjM3NDIzMTgzODA1IgyB1XNx9iA4OJJ8M%2FAq3ANoTtHUFpiIMhiLtGr0OL%2FusjLDgcdmhDLLDUD2uIL%2FmayJwix0mHePpR69sEgwTySU4y%2Btgo6Ex2Eqh4Q9CZa0HRlQrKMEjQniDBQ7JOlQfKRLkq34R6E0isDQPeJJVUuCMS%2FHDoZwyfwulCf6PKs8gd2NMLw2NxVdCEc8APbnu%2FpCbMDCPyuCYLteWVDmAGDkwBvrGZfhR1PKhh%2F4A9LaKUS7GK%2Bo8mfd2xJGvqY1lccQxXRtj2%2FFwtu2iYu%2B5AF5EMalbVSq3FiVIIprU15YUOp6SQK575uJVP1GLajhmGcoGL9vngxsK6vaGfsX1I90HHTHvLDcsVvzj8tcVjkI919IQFFqtlkJq9pE6UpzYLzVMR4PtmkdsQojNF3DtAOMwMFSfXnswffWMWi3nKKpaJJJsndxfO4BckH0ES7bpBYunvG45SNOK%2F9vKmJi75Cp9dbu9%2BLfftN6bnywxC0ndSIFguHAxi1UI0zgfNZ85fhsXzEi6Vo1yVGAr2G6c20C1lqWFM%2Ba9wqIAmRKfnwp4zG0sUDORJvvp8Zp3TAhsOrkqYuTYinG7Uwmp2cogdAhZ2kBTr633Tc5U%2BQC7rnNmjP77ID22oxnH8vCbmt35nNDlJ2%2BI%2BQXFn5NaDC%2FhuzOBjqkASV3hzUg8ce9VkLyT3j4kPWyCR05umoTYNDpE61p9xvBy%2BsR7TkdfRIMQxNhIVg5az9JGbM5gpLrMcDyCidzjXzA%2FnitQV36YuB6Z5ZE6%2BLTcgrUgqvrf3M5XIha4WKKPGdH1KQZ%2FB8v70FYg%2FeQ6MUHb%2BP6di%2BI%2FHwb5CiY7h%2FKg8w4JaQ0sW9ABl%2FnggXuyNF98k%2BuZMXlnmWh5xLutee7dt6T&X-Amz-Signature=881aab2d1e04393c464af0d9325ab3276b6a1395e3a8f150edd6c70e656fdfc0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MOLEIME%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034739Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIACjdf1xM2Uf26HmhQtmszH1pqkgCoI2ENukhPslR%2FblAiBmmMoVg04lECUAckKAPaKKv4gYynKXRdKxKJS5%2BiwbmCr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMQWDO8zH5eVc19yhzKtwDuKRbZQqVaNIjrMh1zUY0voGqI8cBR0pxLDwHt0egaa%2FjxRfURgAqFAqzU6UZzZuVNZId%2F42%2BGxrFdwpf3V8efitnysmXlNNc3WQ7rgEL7sp5MTLXwY%2BIUnLY%2F75SSkueOgvXVQ1NK4WHHM7eJhIrI61zHYD%2BTXE4%2B5dngN4OcrePQk%2FvsqnjxUOm04ZW%2BFSL8yQHPzPKk0h9M3VNmVns%2Br9aJ42%2FviMydEKBTySW%2FSUPh8H7f9ifdXMl5eBYbh%2FQ6f4Y%2BwLA23NRsqhlt9HElcwp287kbjNHpz6HA0eWFVjptFrhvLriF5XsX%2Bde3LJncZjI8HuKWIC7B2rxtm%2B4s2OQsI1OEnfWrT%2B7EOYDav6IMheOlZxZeDPQn15gkz%2BNA0GPrryKADA60oq2lIOPrDcJ5aU8ns3LoxajQmYbpHjjzQCVoga1hC7wNcVfp3tqKmnAmMWuiRfN4ojaEY4Wy3QyojCZfUVl3H0FGtMONA%2BjuYwmeN3SfDNBZ6KNxtY3j0hf1SL%2F8Fqig8mWgWep%2F4HB5MPCOYUgwmv15ob3IxVyjq2MaMb1dAqq%2FzEATS98s94MnIqDBzH%2FhmNqoaKLeYk95enGLNZekm4PErXdbaW0N4o2KwajgLO2354w2ojszgY6pgEGcBtLMrKKvpsdMDk5Pccuuh3R3pPppqugA9ybs%2ButngwpM3yKapHUs%2FdLlItt7gUQKkmn6haWVqzx%2FlF%2F5MCgO2yVvVqyx0jAspBNbGCw8uXH7sutdHLsvthbyDCOHwWjIqBvoZ7SgHHryjhB9w66FYglW%2FtzgT1Ws4OKV1DQ7qzudH9XRmjur1uBPEEdhb%2FnczSfy8J0HobPnU7PQUdhrwdoTNE9&X-Amz-Signature=a8d04e5db2123a8ccafb951904fc085423c46a2966d78c6644b142a13957aa55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SEHZNBOF%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034739Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCD%2F5aw34nR65h%2BW3G65oizPzWF53pbZK%2FZZebg0RtwlgIhAK05upaG8C%2Bkr28KOoAwXffFanDunacRP0%2BpMOwaSOT7Kv8DCFQQABoMNjM3NDIzMTgzODA1Igz6GyOYKMNrAWyAQKQq3AMU5Rb4QoK4wbkuAyygzfK8levYy7T%2Fe7qwTL%2FqUOkMMoNXbEizadUCLrIAmkGaIlu39%2BAlpqzONJUzENRD28oEsQQOj9ftNrXdPCMBdwu52mAphG2OK%2BFOBUDg80Wc1Y3tcyfOik%2B0TXhcPCsNql1lp06Hd5FVrAhU9AxA134abHzPh0OZKK7Z8RsGfOkrSB6sg8LZftn7THaW7Ma5yHiqjfHzJ6UR%2FNsSzks%2BcmeXzUkiSCZE3MxmlkVG7f5%2FlQWzJZXm7Il0RoF%2BeAKBE2bdmLwBjIliA6vW%2B%2FZTtCEl9QdPKnhfqlngIlsVGjOBRRBNas3PZ%2BhV%2BJXyvBpvtnVpWBb3gjTT2VCnLY0Y4Cqq9W%2FQNNifBGXJfEfYser8%2Bsu%2BBTGnTturNK8aF%2F9%2Bg0C3oNSD5nGS8EtRVI1w%2BMl43GShvAJpSCOMTpcLNA9uDKHQcn4JdUh6IOLQfjgtX7lvzWJewOWMwitwNjjSn0pR7hQBj1I7JOtl2NuH6%2FG34FDyKqnvazacQpxCs9I%2BjWZ2f5SaYHJewjpDydGSFYAJQpjzpGL2Bip5NemUzyhd1gr302NaUJW2j94JUXBBELk87nqVNEdEb10epltTzzdVOn7Qho76RSibPm7HEzC8h%2BzOBjqkAdXYENEMMizX%2B21xTt%2FAKuVAWur%2BetfRznowOPP%2FSPwV75pbL0KEa1MRhtiSBVTKlDalLiDGigJS7IPXWiPSN5VdMFFtxiMJBEDdwpRJJAAOo067wURpEScOL1JneBuyAeP66aWrBsuFvZtMw8iDrsjAUovYaBtCJwwbZx674YduZr9G67uS35ONOkoMZ5kEegjRonQWMzjFsuZhKuwirru3abfJ&X-Amz-Signature=b7ba24d91c684fc2aefe8af0f74ae438dc4ae4129ec00414762e94057917aaec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=41ae2ad7333e4ac4b27158a98594753053c406855b4c3afc0f3868eba76d3ef2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJZ2LHY4%2F20260412%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260412T034706Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCBsnrR6ebJh9nqwwmJFQWWfYpyhjlonH2QT2lm64rHvwIgbxbXcoG1i4xG19GnF%2BN0R1ntQTvj4JKr%2FL6CGnDqvPIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDFAQCdYr6zMT6SfhrCrcA4q3CD31aROpHcvLFgof8S5bUZ8hmBz4GoKavnBm3VuwhyJGfxi%2FWNRcP899WDOUTc6YVbSIpHzp6SF31nD2STCrffWIl9%2Fg7Cj580lxLZlpvs0p2%2B7AZW5LDaABUsliqZAE6%2F07t5gSYFqT2w%2FtP8scKH0hwOmwwiSidouIzKkqOSWB4isPMfkwa4PR0EMbsI4Qst4l7Hzn17C%2F4hcms0RtVEvdEAqh3n3mmG%2F5S1WE8vXNgSzZcDX39oyjIrUBW2t8QLma2F1H9hZgOepEK8ldrypFxPBYGkWv%2B4nsSQL6r%2B2mo9GkrN4tVJ2vDF%2FJ0PLGVswWL8Xvnv65bbuBkaPZPlr1pWQMvYGPP9GgyvGhe%2B%2BdTtAQciEC%2B16fEF7ph0RCmNen8M69P9eMvO9crwFje%2BXVDXWn%2Bk6RVuL7kRXSut3RjXpV01KnJj15WJRdyzcfP9T%2Bb%2Fub%2F8FYehtmYneHZSRBZSYWQfuZemMOhv01oREo2ui8ekZBx%2B0%2BzhkOn4tj3SPRls39F0EX80QSmTYNiZfbxY%2Fwj4d1CSTobCIpQV3coOHstRLoorbZDjBeP0ZV%2BIOGg77a4mla4CqT88fLu%2BZ6Y%2F554oEkQta4h1SI0UvYEYNzWCUFmQczMP2I7M4GOqUBbXW5i9lYqaNau7xfX4Oqng6lqBcX3GsfeAGtZXlMRwyC%2Fb1SuZIS%2FEnZN2ZCj%2BJaS49zAyzm%2F0XhuxxTA3SsioGvvtSKpjhUwtAB4fFVqeJQg5kkcS%2FoztsPkKgad8%2B2kzuqw5c1ogL2nrxPidXvsY4ZaPNfvyt%2BdjJWrAQoyLfbys%2BNLkzIyL0c2Vz9GLHBExFdEX4Qu300qK9E1gqgmRyUMP2w&X-Amz-Signature=3c9fd79cdb802a499a00a327284477161179b937438784b067d1f4a5c6ed62d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

