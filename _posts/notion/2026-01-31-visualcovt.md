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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=638d14067c710cf65fd1c44bf22e29d49c5c132f7a4a53f2eddb4111b8a733cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=3d4dcee5caf0837e4f3f4826a1110978617011a2a6ea49b4a04caf68759b54eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=3776b38ffa65bdcab0d220a99b0de645888505570ab1b9b396783b1ef773ca25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=6f283ef399fcd531db8681ddf4c6c4dfd3a0ecfb565a764102d836dbd44c5a42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664INMJD5J%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIBQbR%2BbhS2Y7Cv%2BcWsALJ4nteLyHhjtIShsjkrPHNzfMAiBT0z%2B%2F0q1hba60xBsvBHuhyb2KtLohO4EOuftvjxdMCCqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM1TDcNCbj9kQgw0%2FhKtwDvrK9iE1E9QpGvZVhpoT1LnOL%2BBg2vRvJeNsFBZnA4ZTkkeb1Y0xw58m02g%2BKe3UrU4oDpSSv0Eockkm%2B%2Fge%2F30KEMxTFeyPKnElGL1DyjTnlz7X2m5TnjHK8t2JwBz4g0q9kAjq9rhimr%2FvFJaGH38%2B%2FmqDHXEVuJXUAMY%2FNjkq1lz3Rkd6MBdaipIelTZEsU8wur4fhZE0nl9Gq5nRc27QDRtJZa5w3UZf5VhkDgqXA%2BSyFgEA2N3xGOZH4GAs5eWhP4Pdao6dQ9j68iZrIORdQwv9Z%2F5Bvexptv0cahP4TEHtSUCAUpagKvf0Qg%2F8z0aqf4SujafNt4QaLb8wl5ke2X1v1PU5rj65ELtCcBU7gJQGcLo1ItffcvufUgFsz9FGEHRKeIatrZZgV43uOFrmX1bsYcPncqdPxRyYEKta0oSw76llgWGRj88dunZWCUYWhT4qzrw1JvYJNOeNpG3pA8A439SWT%2FCDXfGATuxHrBF9%2FqEPgSHb8kBDa8tp%2B7gsuOf8bg4QXRfoXAob%2B87tuoYZroNazOscTZqz2ed%2F6By8Sgj33VoI%2BH4iuxg1awBPTxD6iNENRJqbmBs8G%2Fd3Mvce5sZRVQMX2W8o0%2BXf3i7IKA8BEScXMqtYwtcbAzwY6pgHHWjjP%2FJnXuMN0652gvWJTUWotHT4xxdAxtunDvo1HL4hu9HVxpAw3YGSNvj67nyh1yWSS2Fnd4sBDNG4YHro5s291w0JWSYOJhViG0HCn2vHQx%2F0L2ESv9TSl5iBfTe0Kn44c5SeIf9UrIROBHOlU5jpvVJhwVlGFbPUXNssWS5y3enTcn74IH%2BKqL0gTbHZYCoQPePLdWZlLteS1ARIhyy%2FLMTCl&X-Amz-Signature=6f8690be026d1fefeed7154fa71e25d1a45d7f912b116fc96a49ab692d2669b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LHFY7NK%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEq9lehjLYxwYz7nqTow%2Bstx8jIfUfHdOSOlqPQWDRteAiEA3NZaGglWfSiuG1oKGY8N8slNzXk7uAHEJZJqz%2FDu6VYqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOL8IlGFdk4WimLF4CrcA83kLP5BLvhXP7%2BWpyzltH4n%2BdHuzrXSOFC%2BuAA8UFWMYzIxT5gwXtyut8kD72r2OWTphFHR1UP005CzThDIgt6mC3uad1iwh0oEPWI0IcPQLUszEtAIAsq2TJ7nuHGaeNXUr7HviAhUoNFZ83hHRohnHV9GuPGTLu0Wtpm6dw0Xrtc0zSbkJVbsdro4YMSma7Ly1TkHeYyAS%2FaijHxj4uzdMmiuUUeLC%2B4F0ixvnRG7U6%2FpkWIbagMl0te4Erm9f4mbAOjJwyQKGmpqJYlPEgLSFeKG2UzTaulx%2FZHWSa0W8QDspHm%2Bml2mmDaWZOCDv3tQrMO%2Ff8O70gTWNoqrKo%2B6oH3wTrw3gHM39IAT2IJbnq23y%2BLzbirOf%2BW69gB53vojlWcFfjtfikH2EvLmU3iH1aCHWihgvKW1tN9zQK6F1D3prPdrNBrMOvDh1ICaWbxP57OX0x3Lx6yN5IfIXhXtwZSNOTJnYORBb74tMhwVHM31NqTx2uhTyRF1rN3SrxDWcPTPmgGpfauEHrsTT34tXPfLTBvcka9YFlaKbEMKmYG1PjRSW3JLLnC82ee4idWj%2B0wDjKWFLQd57oZw6u3xIOM8GSx4vml4JNktrHIFkIGcOimXrVC5jExoMIbIwM8GOqUBd8zlqDefG%2BiaH7ziiyi9BOfkNTeFP3vJGuKwiOx%2BbdCaZPHlpVhZcDlc1JAu19jZsINA%2FwxwVgGCQMCfBN3BxTZE1gp2x5akifP4qX2Lp7699NOsnDlkyQufV6PGPABnjY9rCUN2CPfvviwxrwp9zGg4pJb0RMrzlh%2BaQQNLbhgVPcyHETYe6oOEFm7Wd349u4QrRpEuRB9ibCjMuKmhdWt1HNed&X-Amz-Signature=d9c9fcf7d4f3379fd311c70dbfe713a000fab81ab08d097e43ba4f910a520995&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666TFTDZR2%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040609Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEPg6riVylgV0gqeN1P%2BrL0Y84hCBDK2pjLIvTLqECjyAiEAmShsYmpw8qU3vu5fR9oHwnj9X7hqR6TSN%2Fiz%2FVHCi6QqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCfrYd5SBTG%2BGtU9OircA%2BjxX6%2FNAdiN8Ii8rrFTVo0K2pNrtiRXsGUsAi1tbCLGNPHzEZDRH9OjLRaxdbhXEGg6j%2BzXhn7Nazn97NhtyqGQGE1%2BtoOXhgyROFMv7VVHUDPi6fVMQEa9m8ghWcVb8n38LsBxwFGdAyphqXmI8%2F1cfiIErMlqjZ3lPy%2BM6U4cAwmfLxynbTSbRKt36Hg2miZSHEommTs2ewgt72sTmvA6riQKgxG6jBfPh7jkJtZOO2viQ%2BZKOJbQwIh9z96o4PApPCWajduijX%2FJPnaIgZuiSBR2BonsV1WpbS9pcd1uc%2BGJMCNZLF7LyzIbtUOCJ3rU5vAU8Xt1UmVQ00W7Bv5mN%2FSvTM7Csd4pirYTCmWD0GwPJfEaAg7yZlfU8S%2B%2FR0Lp0sexZ7g1JBUPJ6%2FPAUt6f2gCRMuL949T8J404ULvpwDbBmtq%2BwIx356Idt25RlpkdDST9MuoXRgzRO6PbdNRsRMnQ7xNNE0sarzOCyeAZJphpBeQ89GUoK36XMWq%2BxkbwszTMEtavP0aoDtj9p1WI%2F5i1W34v%2FxZlJFW7woATHlR%2BHo1UQ0vDo5A3zHTvLV%2F8vvnZq3geEraPSJ6viApCWOUIT6G7cQfS1PmqtnodptQP7Oo2GYJkRvBMI3JwM8GOqUBKoQ5dkh7QVgOZm6q0tojMg%2FmL9dqsEP%2BkCY303hJf9fMTMeNuSJIzwQxteuUY0GHv77hvxqhRaqD9PAedlZZEJ6I%2BYg9o2Pg4ZCBr2j59VxBj5uX9emtlfsf0ap3ngUEDaWhW2et0ej5UNwKL2l%2F2wWPkX80kRY3gP14MW%2Bja68M7IYrGiC0FvMAkEiX86wovMOuriv16%2FGFQNCFpsAVtwjluCCD&X-Amz-Signature=7634c7786bb7ae4c12c10afce25fb09cc2af61c91323cb0344c4a08c512c79c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIOA2E2C%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040609Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIDv5uHkWXMOXpX5Q9haOtqQcreTYd%2FJbi%2BemG7qO4eRoAiBob8Gty6D6EbskHaJTAtNZARrUiqnUmhgMNiqjLhAq3CqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMacu3VBdnCN2eUraFKtwDq81ushD76CD4UBkon9crrbbA3CZnvOO7j3Zn1oNqzmpHBHhQtMERs4RE6mvtgnWtzW8OFFjueOwzQe3wdMs5C7WoqsqL4WKCr00GBZD5vVLbZ7DHCrCexaYmpWShOfjmVflr%2BKxgkAKECHqRGJodHkQQ6L0Nule9ILAd4%2FOoDAGvZ%2BOTf0vxJ8XYjrePqREQ%2Fcfs7JvTcaAwG%2BXofXN4%2BHOSR4qu%2BsxgVuJobtnjqsRKfW5SucmTkgYf37H3LsrsTXAYymtbPu7e%2FVHLV8Mk771%2F9CYoWKHNYbvzi4b8e58DN0N%2BRyQmxNq4fwuPF%2Bssk88LQ5ua8omaFvCkHSQilAVM5TGUbu5WhNZNxegP9mDx2Zr3K%2F4qBysGL3fsnZ4dmftyVTySPwSLhe8J6vs8oqhC7YhKB9JzXKIx8XClLfaMlROX6zm6fI9JS8ZRUOJcWDo233%2FeSqKZ7y%2Frh02JUEHz6GeoEPe0ipSIgdVm138iFUDcarW2QxYSgS6LEEhkyNAxOpRfsPY%2BKuRD%2FD09gNRBlmt%2FwpW6Zi3FMqoGlzn364cGgTs0yU%2BUssVJjfKhEkXXEdt3EVM1D4xxY1rQP4up9RDoQOKVWqR84po0x7FETGI0Nvj9X4NUUXUw4MjAzwY6pgGgSQS4NwA22f%2FH%2FM9916pcZmq42ZupeUWb9OsVzq%2Ff5%2FmQvA9JhGOTg3CWCi2DpziPSqwTwVthFWOZMIohmCgUtkMXETuZ6GkYQgRPkG4vv%2FITKmrHDA89oesb9saFFLwWavp%2BDqLJmWSxGuSwLRUmchj5DAxEQgJETCUEp5HXurFVnrCSlNK6fF9TU%2F20kLuW6u%2B6Ybk%2B%2BlW6qdxUl84w25k8A9PB&X-Amz-Signature=92867e5e83a687332c832def1ce0c8ae0bcad658f8b73fda9dddc7c421a825c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=63e7a4b83d9e9da1a7476f0993130cdedb083f1a51b175262a515abff2a69155&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=c30a481703712ae0e1c6b675896a862875b964fe50a1945fae082ee0b8178988&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QVLGXMXJ%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040612Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIEsyttAif0QAFioUbGUjy%2BRF%2F2jcOtqSKc0AnvH4p0ApAiAFSxS7fVy6Bw54PTNh4G5s2g0xGY5Y1HtsiEST%2FF%2BYoSqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYLlKKnPB4symAJrBKtwDdhGd%2FtQDwmkd9a2ev7LDjG7jPe7ZZaCFRt45DVwMGRP3%2Ftpd3gLgCmmWwX%2F%2B80BlolAC7EHHy7uL507wgw%2FB1mIwTKNrSNz38nxrkGiWct9SPIZVF%2Bm2ttFn6Ux6eqeYic%2B5hp1t7O3l%2FzI9uiXlj%2FS7feg3Bt0ri3BKxlNoaq%2B6%2Fs6Wm79ZhkEC%2BmU5LKRHMFCbwIsa68BL9JiWIAq4QH7BIgIJKRBSC3yLQ7aVgBY88kUYsqxOjjqww9uO0e9sBCEBj62cjBFdNhJl6IvrBcU2%2Fqj0oJhG9HPTWJkyyFnCb%2FETJhKtkujBFzafETrpJjv0b4neBwIAbBB1TjPIFv4nWh9wzUrPwS8mbMpxFFvhGAem8O%2BVh4r%2Bl0WpQC9Ofwdo%2FjC38rNF6v0VfG05PMCmN9Pt9y4vJckJu4TZn84KBYno64m0o9RPIw0TNmgZYUK436r1iduMXQsdBAih7pAbOp0g3Hf7ESTOqcvavkXL3wk14KxJSSRhtr%2FEJy4eF2UeszSdOC0INX%2F9VuE0Wcz%2FyAs50%2BfRjN9S3ni2jVEC8zxpJ%2B8RjOsyTUCbO26jh2cmZLIQG62zmMjCbZyn68QkS2IaZKFSmjpctuUTJLaJBRBmD8B92B8iMg8wjsfAzwY6pgERkFzvlMKIR8Q%2BZV48D4NbPCNpN5Ml1Fyst3CSM9q8IUM0EM7Z18imqiXamqar55iK6opcpNaL2GM%2FH8DvXrJZ1hlLlLkJrspGM7pVg0AdJMvR5x0Z8pLYt9HXGBWKSnDyowvHeaVkJQaYhJyk5s980p8bDzQViqoNrkxI0PR6MRy94yR99zS%2FwkSYOnke%2BsoMdQhJgSYcO1o%2BA5KzGLew4MIWyro4&X-Amz-Signature=395a6587e2cdb4c498c0f3d50ecdd179d4c21557a5e3fd742a03ec9033df2aed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=016a6b6ec51948b0ed3fe87fff0ada4eac02e1419e6a53ee4646375739d67a9d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHN3SNVO%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040613Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIF3mrhYksDTYjGfmyQIzZn6cqhfUH%2BBskQTwcITwCpoOAiEA8sPljNdSFsNrRrr3gnDMhbrNVsRPtZdexyk8ReevJXwqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPvlp7S2vPuKqq39AyrcA25eTdOu%2BebFpN0pmKgijunppJs0AYldFDaIef%2BkjVw8zr%2BhaVepEpXIVC1yjtPv0yqTiLEH%2FYcWWpNVCYlfy69B09SoDmEgWwG8QVQFzgtKFcWFuoOe8A%2BA%2F3zw0lWEh3jbAROHvpF8%2FPHYEoWVlAGLd584FF619X2jepSFfkfGN2QFpZF%2Bnt3%2FwuQUk2JETNg3kbyiMRLB7YQWiyQXW5MqEOSrt0USQUctcopplliiMcEkWqdOX6X2RogzHOQ%2FGa8qvd6TycCpuqB35DKHxPsNXiNIMtmSN1J3BCMCzuU4mafPvf%2Bd3gCbpjGc2hi167p%2BFieHZz%2F4dFnB%2BsAfHqowaS0jIPrhv4%2BRNs0lLi%2BN5olk83dJGuyWhI2c%2BB7wzg5gn4CLJcDRCy4QHcND2ywkfAFCXztQppyxCt4zWsv3I3iqbyoEdywGXMymAMhA8JU7jq089nLYm6gDVZAOZ8i08g9Da0Zku%2BLcm%2F1McqaEzxn%2FxlFB4nN7G8Lkw2mW5aOHgx9OLqFmqbAyCpvMHql%2F09rB%2Bri1S6A2DiIqNB8YpTpfzp0UDVG2AdfurEoMQJUO1T3wwFckfUR8CAoPiZW3MJpLnxaRD2f01fRT11tjAEY7%2FoiwR7qvU2JlMLDHwM8GOqUBLVavndHeI4STSjXhhQmYw2y2FtJX3ZuNmXhOyi4TLdDvdobAFXxMJIJ66CUkOMmLjgEW3Rl7jO2dPZNajNkTcgnJ479BmrSWjcJKute0BEbh7ScVDNb9EPAbAUZnSF96FOuNaGx4yvM37q2PhTNCtWs8JyPm3KVyhd9t9WOsWWkJrjGmaEddMq%2BNKOaWlZK%2FmsuyDH2A%2Bcni0ViXu7qrQ27c65%2FQ&X-Amz-Signature=32c30d5cf04801a4a89251ee6250483f7adc5e0f4bf4fd6290a97756f526df15&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBJYLSEJ%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040614Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDfwIkz8o%2FGrXSqNYYf81lsovydkzKKqFvpOWL8uYCiYQIhAP2wuU3GeI6RwGU6QYNdm%2FZO9KXLmV4WRbDlmlht%2F%2FIKKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7%2FxgV79QarIZQW%2FUq3AMAYgKvXSFVtzqjb0mtBIMcH3Z1Cp8yXMkutANwIah06wskNK%2BHqU6gXoxVc9ghCuQ6NJ9G1vF5iTykcKrcPDYMOUXEzd4%2BBdqqHtwRuG86IlI4Kx0L4LYpjlIIBqria7dStvHbxRB0tLK%2B9zvBSYbuBbni725%2FTgknn9tPK1m7zCPL%2B9YUOEW%2FAokHA4kNqg62fv%2F%2BeObbMdWSVYzfwFdLNyKie%2BKjKMA5ivTSXyN%2BzRSPlnsCjiEXAJUQ6MAwYLCYQh6MV3zCKBEVGcyvwUDlTvXvoMV3p3xaJbSTHQUcXTaCBpRvynJTwIe4u%2BDzF%2Buij78ryYtYDnS6LHLncFF%2FjUFy%2Fzadaw%2F7gC8dBewND4uyp%2FGg4SGass%2B1iLUiwjYGoVzNYg2QBs%2FcuJ0KPVZdFol16%2Ferbwwx5ejiJUwgnmNyxqrcGkxbBOnxxqQFpAGlJm%2B%2B%2BUnL5lPo%2B3wq7YrpjLX5AduEGwbmKHYpzy2%2BdcWaQTc6LX2KMwPzJll1B0YKctXTvAz0wUlpGMCGKJd8Lk5zPp96mgnRDJiyvjgh54ki4RGVKvLcIvjrpzOnw%2Fn8w4kRLVKBRPSp3VqhstQhFvurpF5U4BBG5mTpVoN1jxsm779CnPpbdgmy7zD3yMDPBjqkAefRSNJ5v0PXdK2uHwVWdwxYoNGtJ0E348GkkypbH%2BMuoXMw%2B8UvPeKIZ89qf4W7h3qzHJLBPExDaKCqF70pPwgCvuYY1F78CbjcvnyQK9QaRXSbVjqYm9YzhnV9N3wpn19R6Jx5YE77y4fetQQZGi1nDduRZCv%2FdpaGpds4bFnhoNq4nmQQ3RcJMDA%2Foj6A7Y%2BMug%2B4tTTqn9sNWPSCga9TPsCx&X-Amz-Signature=b44992f9eccc46f1419efe4035fa1323e99f803114caf74826844f30b16681b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UQOT462P%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040614Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIAGGqvZ534pbDJ7dyg9ZW%2FX9a5lw%2B09oVz5PjYdry%2FeMAiA6f9EwI7ATevVnmnXY7d2NaH1HMCeJevKRSS4RTMW14CqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMuFJ4bVuJvFImxx1mKtwDANf7CBKbPA%2FFU6pxy%2FJ2ipAy5z9jeQGdLlA9MzNLWC7PEuqesw7KuL5Pvrr38b6aH5FGaeigVvEe66U4yW57PsUpUR%2FkjzizWUPxeWP1%2FeUajnZuqWV0lElqhCovCSFP8UlNbzTB%2BW2u5XxJON3KFXSHy%2FvIWrfBfhBbEHBHNAcjvUR6H7EC%2FYjtcHVwM8gEipZt6k2TczOHC5WguDmAUZgQn%2FiNpIhjb0Uyo7KzBaU%2FmZnFCAzXRQrBOYj7nC2dSV01kvNIbne5WHq%2F%2Bzkn8ej3df4kfsSMXg9ZjSsS2gZy1tnijdgzbG4qqqnrTA0fVB1Bm2dJDfR6F6%2F24xZA0D7%2FUR5FY8lh%2BwSEyoOUBcOeEA%2FTKMsTKeSRjTs5FSpUa7gOCYzeR0sGv2Wde%2Bc8RXGveZjTWfvWcDGoScbWXaq8VzhYhqgF34ulE5Rfgw1NIpPyO%2B5TcRwVP7491M9bEPqnD8yTSaEEpvs%2B64KKmKHMq8TfWtKlI0kmIJDrd%2B0YP1F92g9Nr%2FYn5chELUCFscaKhawQ%2BrpVh5m5krSz67S9otqPgQaTcbSYGqoL87mV8URMw5jHVAra7nVD4XhPcTQQcfbqevU5uK9hiWzkwMm5ZXg2YedWMjR5%2BA0w3sjAzwY6pgGOP%2BlEYuVKNI5xjBl63EmMT1zKLxHW6xFzb7vxBqhzBCBsYqN27jfN2tusWor5KDmu56aMF7Jqu61ZeCAk6v7PQ2Kh30s8P14Ymsf3yID2sCdREjKItbKuHPYj74tuS5c2B5OInSnr9hUZQnI4g4SkaQHU%2ByTJp2mx8Oyhcy1q05LgQG%2BNQWVW5GazFGYaqHzUGlCrZh7Kpi5wD7vpRdmUbPQy%2BblT&X-Amz-Signature=5e1f8988a245d0b6cf48e42bbdd381e95f554e54f218a3fd72b0d5941377954b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662J6ECWQL%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040614Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIEvYUOhp0nzjjPA%2FBNxL2bf0K0fFZr3SnfFpgZ0%2FyEAaAiEA0y9UDdliSwECmfAdnKxn2oF7FcuT2hSqwhNzkWdqKSkqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLOtEndBBnPo8ggH%2BSrcA6cVTw%2FMIQI2ZPK2KiTIrC2Q6ESUMOQlQ4QYm1GgrDsg9hEOQ5ulCBlk%2FKGjC1wWeVwq1CAo%2FzTt%2FIPjuskPL4mksGZc1rjQqXcMB0mz%2B4vxZ8UUxyVgd556w16YF5TQLLa%2BO2OvxesCTYvbgVj7dBrUkXXEbMcNiALs8bKgz2Q9NmR07zBuJl2O5troLxq3jfJEQ4nk64q9cGPLOCDQHa66Y16aesAKmnbM4FrnqBYEcsPW1dv3JFvSisCB1yXmjmJWPqzwFfQbpo8AL3V99JS8eElu2eG5rM3GF3UsTOnwnU%2FpS%2FaJdqAjCiJdttLXels6pByRszF1Wr8npOQ8cHdQZYv%2FI8MB7KuUvu40QazuAZ66tFTLxneG5eHUyZrvrCzZZxsYEiMG1KsXsICmX01C5BEDpvwszROanai%2BXkoRV0QzIauQhZ7bPH2jfrd0MMqt2J2zXj12KI3GIRaKcgyCghCcuq7G8c2mtvp6K2QPnT9cOCoU%2FpbgrErLr7B5ZLPD2iJxv6vBOdEhuovr1lwQTmqulMLvgESujd2LyPE6U7QoieSyxUjqg8elUxvYIissnAqOfdd0QWH%2BQ9UOeRdDFhFqQDRRMyiaTWYCwP9LXMlT%2BpfU5UtVD05dMOPJwM8GOqUB%2FOTDoqP%2Fk8JdB4HQM3LcplaD9cHGARe01VLht0do4sTcDqy7iBaTKV8CiAQKZE87DcgJw4AJlGbtfJHC0EITqWDp6ftktrZh97wKhzoGGM%2BYFBx719KIyac2gyzAU2e9NJ7HPiIGZArlf1d1oYQ5wbfLyk3V7%2BsnWXX2t1XRSZHkVzZfduUpecKBPFubBjxvT%2FV0NqhwlAGu%2FZMZ14pDrBoU7zNp&X-Amz-Signature=bd35be361ded359330628e2cca5322b477cae5c97fa78649ea003d43a2cab533&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=e5d3ec3ecdfe25a1ce59fc5df4c4f0d24dffbe5e8e45d68d89c21cff7570fd85&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOUQN2VA%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQC0EGZLKYcUQJsIqvK2yS6QeCRkSQ7bjN52OcMWPdgX6AIhAK7QxxjzSlci1AWeOlrHOPsGu1ncPQltYUdD%2BWXRerNcKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7LSPy8qu7TgIZrGAq3APb7F9Djdw39FaaC49JnI0PXoj5h3MJHsTMrUa5%2B5%2FeoTyo4XxOqT58%2BQWOhcuR4yK1QTYhjm94taDqHo62kO7TCecY4%2Bvil0W0s0TYop8T2BzKYe2YoOQwwAwLQ4SlR183imK9hHh9K%2BJPpyoYxdIOd7VwQPq%2BeEVObL%2FkCIVXkKuH1rgPbtBDQOd%2FELcMMuQoeVNvvPtEDv0sIZkW%2B2oNBtrGd6473ZsOx5dBTmmssXJoA5RNpRT6KSHt9trzDT6X7JxGyvfd3UNMFjP3UhnsaSad5jTELLCo%2FnJD2SsmgCsHibqRBaqOvKzUChi0HYiRn%2FDuLYvQhKl9eKHKoxWXIlOUlmuD%2Ft%2B5fwOehEtVsGkY3AnXEmTTndGHfeGqySCYI45f%2BOG0dEKBOGoxwuOAq1Y644DuWZALDVwe8iSiIH%2BNzJYY43imLbjU5yZtnTNRc1qR89l4jZ0OX%2F3oucZ4%2FsLrc0CAl7J0lu770pPq9QdNdIfpDZWKHTaa54sbnNjyKlcoThjpCQXMHeJYOje9wBriuk%2Fiij3fWx0hF2mW2CkWmk53SHNaihwLvhzfF6WlfNTbTji5eAm1%2FrJiTNMDtcaIMKW5lvGkkB%2BurlM0wy64LmqPhGSog8UG3zDAxsDPBjqkARTN33BqgemHGMKwRrm9oG%2F7XhWRzH6bEcr2%2FLhRLaZoKL7HDK5i776axARfdj70XMuO%2FCyknpdfYz8nmu3Tq%2B4kcjkpDSE8KCx%2FS%2BtEIBXBCqPeXo31FcwitYNT6Mn5midTwDizLl8WOPol7yfWXZINKlbC0disBWtGP8PWIZcOMT1SKpjnrM6IH3HVifizxFGDfqF%2B2lvi3uQm%2Fu9kV31Noe2r&X-Amz-Signature=1c251219bf405545965acffe58ebcea7d2f9468ad6866d07983be6a4805e3c5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

