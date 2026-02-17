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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=72ee16688f1146c1fd5cb24b09808c1bece7d6b99230730a0387f521326b08b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=d108c240dea9bae68eb6dfd072a3aba62e5f692c74649969d2dd690086e6bed1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=4a6785165d5f1dcb0a683e2574bd7715ef3a7834045c0d7dc36fb899038c26c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=dc93eb522c520c6aed29accaac44c092b9c631fdc680e37bdf23a4f67168bef2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GFQ2EVW%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJGMEQCIAWblVOF4jaaz0K3%2BmG5FcMLeci0buJS3hs%2Bn7W4RzgxAiBxYGkZKfxmRVAq%2Fw6CoSk%2FK7FM62Kk7pImskkQEfJWtCr%2FAwhDEAAaDDYzNzQyMzE4MzgwNSIMzLIGTsm70wzrmcUlKtwDoPIbHNwItM%2FpyCtrVauf8Ghrfli0TOfXOL6UJLHA4LwKbCIvGUg6tJzqvTVdKmKo8Y02x58Rz%2FBmfWBrFGV4EuPaiUpSqRJNjAzS7F4HFtfrxZdBHLPc%2FPPsJ7MIcTPjCPTU8hsPOqOtTEyu6oytV3Px132T8uDQO5jO9Mc2obTM1zO0iTUaJnTLfw9Cc%2BHHkFpF8rr2Qvlbs5gHIWAVDvQsYPdTwkcu%2FYSqEnAIykLZwc7XLxj15pxkSZz4xvsQG0xewuiQIIGioWGGNzAQU5XBkr5M2q%2BYjM6mnfptR%2FUFy4fkVRcCUmikT5p6CP%2FPNAqK8uImAdNZT%2FqWRX973ZEFlofnBAVo1fRlFlOZ8WmvJ22UtNDkendC0fxd9E9rMnapL%2FUK4l%2BSrhZoj2mcCsTDIJkiYbiih9Gn23oHU2TdUXbEDWhp%2Fpyd6s2RKKGCLO2AbhOYNO2sw%2BiPbhEDZF0oCkxI%2F45kBNtEur0JuEA8N%2Ba9GNrjs%2FfosqLz5Jk3wcQfW8ViF5cIJHlluRsAnAfYdeMmJ3so88SfKe8Z9sOrGOvKrjMjKcc%2BNdbLAD%2BwN7EVZFhmVUMB3PMtzSD5%2FAPMSgfy5BRZJuJpT0ymW5qMmHh1gMhKEiNluxYwipjPzAY6pgH74AXk5ZjASU1ZuT%2F2TtfnvW%2FxHE9pFd1TuqvQiBXikL2ACOcaLSWuymQhLIKsmA7kDP6bsB98VcCANoPtj7hT304c6%2B1fyHioWB%2BBTgFeeJmPdKLX8TB2BzZY1Kpakam8i4B4YylPbM22E0rra%2FF1ni9BWoQ0%2FI46BqQQv6YRKnD5op5MHq9m6YTt2y2Po3frdwEY%2B17HSUpKxdxMtT0gPHCmuRG9&X-Amz-Signature=40dee1e440cd38cf2ea76693a815273ea394c37f74d62f1c6e63234ae7606fd8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665Z7JFE3U%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031349Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQCh7R1grbS4Og9SiRthFICVL%2BQJ90qNCHE76V4MNyePdwIgFKxgvEZYt%2BYJHmWmx9Fd5nCGclVPYjhRSQAR86gqNAsq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDDEgIE8Uj1aTERaHIircA3D8Lz8QpyhJpChVpl9%2FD5nbOu48Fw%2BNsESHwHBZuC69bGDAsoqZy%2BpWnFVRytJuUiHA2RxCWLEWFQ4Lz7pkGjm6EGkzHsF%2BiO%2BybqaXkjqNq8iLYzMMqzvxH1aT5GrpY9uU2WkZDJYKleeOto7wITXKEU3hojiOP2mtBlAatCG9gs1ssGd5nSV3XqY5hOPTKGRPNTKVW0mfzq5gaG2DZsC85YgxxRZFhuJ4knbp0mLPwpLiHEp%2FL1LQuvG8bhANcwFU2qIW%2BqQrVsuATZxQ24%2F5aVBbgv6ltttE%2BvYU1EcdEtqXr%2BHjzwGJgXloChXLyCLejTfw6OT35ImZP%2FJcGRi4PHom9F%2B4cDj0WXVzqj7qIkechnjYGqlyu0503UUM3jp6C8YHyO%2B6qAxntSQ3f%2By9jMz1fruPBUIJk%2F3sMbBYG7VQSqz%2Ba4BQgHNJpAeMSwX5dU6gI0CADdjpeZl0leBVebZ0pAsv8I20uIfGqmpdrQpCtfohxOXmzTFRcxwWfwaOxnA5lZnIq25wdHPuSXH6Q1XNf0zdh6pt7VgtBoP1kOOdfD5a%2FHye6e85K8phQaCK8GICO048gUxUM7wCPM7Os5l8Pdl%2FMSjcV7Go9Jhwtky%2BYvpvs1ALPp0BMMeXz8wGOqUBqXJsTRq92Ev8UCiWFgtoQlEopdmGwHOlovd7oab6khGKnZTalpxGkDqL%2B8YrLVh2%2BEVFQWN5YDOI%2BUXdhzUUddmWbpTToGiS3wRTyxCOXTz15vpueo2QS4pWRwYp7Zzq%2B%2FCojFDt0WgM6e53ZYl5dvgU04F74d408TA33UZJaZ%2FWSZoYMuRHLb6oymqjnkGEaZ2ar8GwxiaEpE68rM3FZ0X9hbCl&X-Amz-Signature=4deaa5c6e581c633ccdb76f4a53333d4918db9b10ba2c30d79648d7b590261e8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VM7QJZ2S%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031351Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIGqzuHXIdPOffB8SJo%2Feg5rDpkot7MXDNP35zUgVFrJ4AiEA87Sk13AaEOlImfkzyis%2Fy5zjI7zBc%2FluUiOGUcD3P8Iq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDDd%2Fm5P6dD8Lv4vCFyrcA9TYDq9QqZJnRkxNNim13gh%2FiVUvAn%2BPfYQTc0am6LqTUkmQgoR5UAqL5mYaWHT3xz43hPKl4TNnnEihJO4lgkpY9f2igjjFFTYj00Yiv9%2FrjjJ8yaklONWffsWQKwnG8Byz1%2FZc9ewe5vHbkyBmmZ9%2BP5Mwi1mJgbPlsAQv1W%2BczBsSQSujB0%2BG3zOPfsJTwnCH6DnSyOVmysC92L%2Fm8z4R7nDQlHkE51EfejXVSCTeHQpJPlpexFDoLdnKOmiaDZNPiud4TycGV70YR8nm6Z9qyyDymWNkgHyIWjr%2FQI0CcI12tf4OexeSuMmi9yjnzJ7wAbmAOAkFV3XqMncBJ4A%2Bz2EpXhWaRunL8Gf6v%2BNvNu1lwMI2eOsHi%2FMeS1AS%2B6oVeV%2FpkTln1QdgWrVjt7sSdH1d%2FBolPYt6ZxchYeDlvnJt%2B29tUGQoSO4xuoS6EBKlNMaQcal%2B%2BWRp0nwCKVqI7zaZWP%2FTu5S9XjUgTjdVkEASsR2cXvaxUd96qH%2FetVmv6QHiuHdfSbY%2BmYoNr1BcuPtYvhpKjzZ55Si1jyuOOwAzK1tyMrZU9fpso6XszXs7In4IFdJR%2FPh6g3FcjEB1gjQnUCVnSjkel47gKpOXShfqlBg3dZ2CKt4OMM%2BXz8wGOqUBHnDuh29WUSSWCgg8Zch97PQVRKO54Mm1POb7wwKwwg6VWuYXqQVrEU3iJd60%2BZCJnvh77jdZMLPoOgzcA9c88661vVszto4ep81%2Fz76uDIP0xvggxg76%2F5ND1YqS%2BYx%2BBlYdqCNL2lg3mDDgl2b%2BYu7I5rR9XfXlCy%2F6rdp0I7sdJ%2FwiC1Wo%2F%2BevknRLmVVrdf64FT%2F8FNP7UpxQnyI75hXqHER8&X-Amz-Signature=3edc5e3a9332cf60597b5d5dd8923126cd87a490e931879caf99e04982844730&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667YHVT2QG%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIHOVYNYDziyO58glNkhNlSx0lVTNmI1yyB7famyjcI3HAiEAoZWnn7OFF7QsloOHi%2BGrqBr8%2FVRLNXYG%2FqDUpTQhZt0q%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDJiM74UW%2FkqRYiQT3yrcA6Nt1KNSlF80aWAWMr6P8rq52a9txP%2BMzyN349ebQpuBOMbVONDYWftoAyQQ6zPdgHNlUDqyY6kyIHNN%2B9ku0RUJ%2BSN4Xk7kKQTACEIKgAeHenF%2FEnlbkKovKWY0JbY8QeonLzL%2FvmPOrxYHCg55DsGKvJ4Lc35Eb92DBoDkjDP%2BHbVsjvqhZSpxmLD2vLW59a4oZ10NDW82xRbvlNLgXUO1RAUKEelV5EajO7ZQrq7FwWU%2FLD1ClxeHHEsJMzDEkTlibNAqv4ScAvuS%2FU%2BglVChYFs42XG2GYv6DzfKAqS%2BS7b6Apxd%2FMeEBzqxVtbycMcLyEhnGWY3E3lZI6IJ4L2PmcQog5AgUUPi%2FnjWUcGorRCtNnqS1kAohlSWn0mrza3veGdFPIrrWZLns7nThnBsB7c9VI3LUWLby56Nj3WOsqvfxglBxfaSNHETqwwyQqr1lqn2fQJPbiMTcncah5%2Fe%2FdvoL5NiorvlfrMhrWQ%2BYd6cujMN%2B%2BxyXBnGeJiEJg%2FqiVWzGDHKPazhf8UQCoKS7g%2F2LSMQ6M%2Fv%2B3JrgavvGkJja6rXdiEDQi2Joom3dfRTJzrkQfLHTOmZdAKdi6bdORhBpY8Enqw78BqDzp5R5i51d37m8Xyu49noMJOYz8wGOqUB4uEcz9ZUT3yQu4ubnuzjVUyWYG3f6Z23CANLJZRgHz5Tzx11Ah6rJbNTt2XUss3%2BU4OoNzNqtUKDscrAsNqIwvVHpXRd3QQ1NiPCnq7Fp5CT47e5O8iS4DYdkKvjVCerrHi0erhrxITFZwhWG5s39vsVXZIttKmim6ZAjFlGN%2F5hEEQUrVGRuT%2BTNbABuUpWTEMj3snfkrYWiTh0D2bL1Dx1kK3v&X-Amz-Signature=e172540a0da1b0ebc708f51a1c957c568c9b99e93da1526acc610e1c239ea2ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=95f839cafc34b02706f8a4ee65dc79c5266b84db10453af45f2e9ba016a378c3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=deb2a99e7cef8b29ef048d9e7fc9664db234a8926cdf35933ea3f43b64884ba1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C37UJC4%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJGMEQCIEvYl5flCELASyWzbd7LLuvfkXKtVqYfeS21M%2FQJelpVAiAvgHApr%2BorgmIKI4qZmC%2F6EOefYaouVl0oyh9SU7xf3Cr%2FAwhDEAAaDDYzNzQyMzE4MzgwNSIM5HrgbvFnrQlsUiMNKtwDaUx4Y94O7zohoz5T5Sm1X%2FKvZKkiPmrvWXtoBKYITONAjyc8ZSSent3AGy%2FPdb887%2Fce4bosFDzdQE7mioHm9u9T00ht%2F1VbkO3bJgmO6VZeFb68xOozGcXu1jnme1KJ%2FS6c1qFMcApf5UwxMFKcnpUahwAzrtjdrHV%2BUtNMK%2FOVRhUnlzyVSlYegOkM9r4bqUxuK5W8UQEcPeEVwaMfLUGYKu7lHY4RyFhcy87esqz3xm8qlVJ%2BBV6ZeP2Cg8NZbpBifabdBlBPTae0b9U31pbFVZRhryByiPfDVrN8zLIc7Bsqu7QbNu7VNIo%2B2bkpsXmeR7Pr4GC2hwlZsmCXv%2FOGwW19MRIG8CT0nKTNbb9MfxKnfyWF5foJm666qMcif7bouHoreyX1eglIoPiS4nb%2FilBdql3O2ne3BhX7Nq5VzRjmblVP%2BOTOFbSrsXow85B3K4ew6FjNOoPT%2FAFC8%2BIeEqUDHAtxdUnYUDcreVt5zxID1Jgf9qWkf5pg0gow0kJ2V4gKWZ1pK6ncFV9r3cr5T8oBmAb7Feh76F%2FLtwaRE15xcZxGrge%2BwFdf8EjitQIRhJHDpOwLKJMYYgbVrovsoWCCA0pmKGsBWFW4uGXMqgEtN%2FfgNFQKQVYwy5fPzAY6pgEuDxg3rVbv8AJUfO%2FOV2iTTWJuGG7kw5tRcUy0HSlsJtWF%2BLwhOw%2FKC%2Fs7GbCg914XDiTMwFXyleu%2B0DUqBkHywCqMYrexVMd23PAqUEkL21xeA4sVYQrHUQ20g46cdoyRmpRqKO6MxMtT11SgQGKvCvXKVmBfae4B5nKHnY5fFu9X0YHraFMkChV9s9IK9dbLNbW3e8zvWMM7Cx64S0XYz1yHx%2Fmi&X-Amz-Signature=22736c5bf647b73a9c6b7f1addbf09382210f9b23a215f64bb2b80f13458b34e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=92c3cebb09cca924473a8b38c8a4b6566ef411b3a91e664f82f499d838e0bee4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W2GO7MKY%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDjQrYnizCB1ZLib0GVNO1zViYGEGVE4m6yPrCOL1i9dgIgZ3JT5wBG6XGzh1n83yVCWezbFXE%2BZGDiexVkVndJUwEq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDN7EqQ8Xn26UETGJJircA1R4xGe1DEiyUwf1%2B6WIKQdrTAv%2BBayNnglEAiSczngQh%2BGzOefqSDT5xhK1GQQX1Oc3rdaWpcp9cAMnQlQQzGPA7MmJvT2S5gSd%2BLBj7mWAuoBcsUGXaqcyUn%2BeWGcCVYlC7agi9uvbAsVEAt6cch2k%2Fqyq8TN6WCvhK1%2BJ8acCK2PZ0r86lJaL9ZMwfSULzko4xq4oV70rKQyoeF3PKqoOIwZI3qR6DWJIRjaxofosNMDJleOkZqrtXZpLewapTDdtKm0W%2Br8Cpv%2FMzkld4W3%2FjvFi%2BprwMWaUWk9989JF95Wf%2FPhXmbOWsvwY32Zd0A2p44uOA37wGF9onVNp4%2FiW%2F9kQaW3apUwwQ35NRVPCi46aBSeSG5kXEe6b9%2B3YVgrU47nDBPimHuf0GOnKTcLdJ7qbAgZ6VbtvOkmpJMCx8IftKX%2F0%2BxweMGkMb0fWbPsVEgiRu4%2F3R03%2F3wjIC3%2FXKUmNwuTY%2FEkvOhDbcoIerephXJTvD4TrWNg1vo5hXoqG%2F8K3l3m95mUHSj%2BK2nj6qlrU4cMeCqXYdEk0V6e%2FGDJ09V4NPtvU4L7fIsRb17L1fp6CMe9djcpRY4WaZ%2FWXV3zL%2BReiHPipN4L8WBpk%2BOklfSOYSlmK6L1RMOiYz8wGOqUB0fr2CluVXOvhHxtxFAAbaEt28xGRCD2NMNRWP8XnJrW9IE4DTL2bwOflSnraBaXdArCyfb8jHh%2Fz7p3g2KzNKMjZcvGjXgqZsiwFwsa8FFXEHZnPM3oIDtywADtJWhIdqk%2Boh0umTYusqo1jDL6Rw%2B5GBlooCQ%2B7yB%2FyiWgvrxp4IpSgB3qK6NDo6w6UrWA0gio8ZXCeKGQOC1vvzk179i7k6%2F0z&X-Amz-Signature=5697fd14e4660fdeef584017218d682742ac03fda8617490244d4a937b8ea93f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662QJIXU45%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJGMEQCICgvn7lC3TlXpImjN4vjRstlicGVLmZX3tTPKi1MO3I2AiBwQeCDKqdqDOZrlQEwwsLwycsxcX9GDbLBOhjG%2B9Kj1ir%2FAwhDEAAaDDYzNzQyMzE4MzgwNSIMjlRNS7%2BzmVZIUHEZKtwDbD%2FNU663BCyQccSVaTofvTex0n8n5lbRPITTuBNBI15TkCzXhnlErObE0lEzYIz%2Bse%2FPPotBsX698K0PsOyqyA8q1ayTXCRa%2B6NBYp9lN9QYysGOQLYWDehtHkyxLTUHIv15xfLIDqVCsXvFGz1epsc0GPsnYGiVb8bTe7hN2mA25RhadDs5uzKsoer%2F2AlWwSXuts1O5Lo4NyIuHYjwcC7%2BQJThf0mILqPIVJSEgSd%2BoAYFcIh1fdBhtwbXNJZ%2BecQZY0hwvhpm5HqMfgOfRjQVGW1l5FyhTsP1s6Vb%2FCuPickjxRu%2FeEDxEpekhaAXaQfjmlty4E3bukIjkiC5LbmsJeE6Uk5ML0f9xZHhpz0Uwd83QNCLGI4Mf0YkE%2BrnAvejxJtdrgFi63A0uojuFCf8ORBCbI792NCcL0G08P83IHW3S8qmzVSmgl1BDQBZ8Y20V%2Fsc8DetchSGI2bVl7LMG4kvmUSY02Bc5DIgU2CWl1ql%2BJdnEp%2BdvNMFCOxfg7b314Lf%2B0kP4Q7NmwytpSFHvQ5zCFIVJ6J0RgYtKLQ0fR5lf22DyAxTw7ttni0bV9%2BuvfsnrQrRj3VYZYn1Bi4K2rlJGk9zMgfrfFSqfAJUgtCBf9ZfMVBdAbEw2ZfPzAY6pgEzvvzwK%2BkEbCTe4YO%2FkXGjMdChzaE4tyHPLnjlwRPpxrbRI6fs%2BmpycBWBxtpObvQmmtlxB048%2F5CvtawvTTtiTjoFb6PnBTKYIxyJd8Hhs%2F9bg4rEj2dim0sr37V%2BYm73h1m0rezXdTRlQVCeBul13LdqU39W2tAPvzzx7%2BvrLM%2F%2Ftmw3IOtYlqtDg3jFfm2lFF4vN6iGvQujNxZy9uqmkVV7BLwv&X-Amz-Signature=c0692de3fb8f8347331915014b545c95ea6f936a8b34deb0ff6a020388e70ebd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q7CIPSYN%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJGMEQCIHcJopQkL7r8uN27n4YXJkiB2c3vFY3Ly70o73TuNysgAiB2nV3h%2F7dc4xcBER7Xrr%2FjOwXHHbOUM0OeEMw9iMw%2FVSr%2FAwhDEAAaDDYzNzQyMzE4MzgwNSIMPatAi5htB0WHe12gKtwD46Z6K4qyIPFLVVlhRDm8L6vfUZO0jrr4kdkZOQSnqDFj6wiNn9qx25fkH9dfG2ZXFY7nMGuBxJxyo%2F2f2Ii8QHbmWbolAxge6tO7FJt1tC7huuYymCKLz5qQ3GdT%2FyzlvcaNdm70DrJp2EwdKqZ63d9%2BKYDcI%2BwjZsRxn9qkTkvK31y20%2Fy2wJjgy8Ud1NqxZ1uhGMDvXk4BnLa68aZmoO6d%2BGAUuhQhBJ%2FpBqV74BXdPO1dNCgL5qfqQrCOOhxtHmzcyxE95963sAxRGNsztiw3ywBM9nl3e6215vOfbtUe4fOAZ7%2Fw%2Bxr6DXMQdtlWmm1Avwu74sn1cCS2LWJl4dwiuvGCy84usw09I5B8CfCocrrEvgXY5TxRTCDg%2B5S0KqFT40WmQa9px1fbwTRC3D46wKZ3q7tX1px8dpNO3q3p8E3cxbEwM0aMRteA6dbp6Bpto53oyMcD9AKy0Zvp1QjqRWxsL2KQWAzPlZtXJOdmER1rTS6%2BJom9nFpzAed%2FVfpxx7jY6hnmEyPK6CYcDP1gYIcQq3T8rr2LPYKDRrVoHaXmzbC7Tib8txbTPqGshULXx1bPE5bvJg5FtUBsBZVrJ1cVJCzRx%2BT9ua9cKw3eVLwj6tYEvKFG1cowzpfPzAY6pgE39fxhCxr7CtLz9DlmWl6FvImzR2lKPf67XuJYdci7nvGS105XjaZ7KwJkDScNmWbwIr7TcjO%2BhQ%2FF9yfWJt%2FiVIIY07QMQd16JTRSY9uNxzshimSuye6QFDnFHOhGfQ%2B4W83k7TO8q6fv8D322hfEMUR2ge7aHs8bactY8P17JSFTGkpXPQNv3vhkNKTZ%2BGZJutA5y1sSTPmATv76ziHu5i8e6xY9&X-Amz-Signature=e0b2192a0a94e4f0341e230d9a04df7fc1cb7f755e82a31fc014ecf713173467&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWKRVUWI%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJIMEYCIQDGZjy6BNtrWJfXi6I93ic3CY%2FzXsPiostZIlrZynMJ9gIhAIAxfAcOzRTfEvyZ8gwQ21SuT8DfLsoMpAw9guwwpqYwKv8DCEMQABoMNjM3NDIzMTgzODA1IgyKvfBmEQronXtvpsEq3APcr9akgd9ObUWjJnu%2F5YGXOF1SaZ0xl73si%2FLipjq59kWsyqBi2JguQ4MVJTngN6pOOS8O6eL%2Fp8K%2BmyvTEDCJ3ZWzX8vfiau5ST5cJYvAEiWUD0DpFhzu7k4jpQIVwHxJMWIbPyXAod06GCOIFzuk8fn1Ful35zUKFll2OUVAGA3Ysu68SdFy4swQN6EBRxc%2B7TSkGoc5lry2WrxXhQJOwOoHGCr0gEASNgZLEvyhp%2F7J75hcE%2Ff2ViExJxc4s9n%2B2Q1KtqV6PM1ydSOqjW2VZf73NHr1Tr%2B7gWqPnSJkHFo%2FrGl1DJc%2BFdsazxGE50mx4DlH%2BkrPepCdOMPU3vIS6aHBgvE8AHahotzdJKmVB%2FzY96A9%2FuEfn%2BYGrc2o6LYDTF3I2CIiHHgVbHXbmNyZCLvGiVComLA13KfpPY%2BT%2BtcAZ8CZhK4Mb%2FQX3tGSJeNDVYd3i%2BL7TkORiiQPSwlnTuFpVBLGJUFvKzCKk5xuBWjGK4mgaDj%2BkPmk%2BpdESvrRT1RUdUiNn3xhNIzvI26RitgbbyUTPsIRsrBpN70u2bSlCiWh2t3z3zPteW3jBR6PXCholTmysZG2l4%2F11cD8rmtOvM%2BD0ywoBmYMPSAKrPpdV8Uns%2BEUNceJtTD5mM%2FMBjqkAag7MjvKrzANXlScTdWM%2Be4fnKlOGM4dIeL5myEBIUgYC8NnVSDUr3qlFCrv4XzW086bYYncyyMPhMHNx%2Bg9c%2FHh6%2FD7zrVPlajhXZwwXKYL%2BVO85EAzQVT2AO2lz62lXtBJSItn6x3gsFyk5Qwwpe0AmzoV3MaTBrJB%2F9yXNxBPz7jp01S9RWjODKnu2pLYnwZxBOSmnrDzqIIKyrga%2B8S4OK9M&X-Amz-Signature=8afd7fe83a6c3bacdb53d2e920e90893fa13fb8e3341ad2eb8d8df60487e1883&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=292966d6f54a7559c10d75848f136405a452be1a0359208118973a261977baf8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662XZUK7KA%2F20260217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260217T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJHMEUCIQDM8jPXWxnnjqyY6O%2BOO698ijRuHIsGdlTN8nIAuMQSIwIgOU8ojjcvs6begHPbHRwigNf1BxEuPQoS9oHQMI2GdIcq%2FwMIQxAAGgw2Mzc0MjMxODM4MDUiDPQDjHBsoW8z%2BMOa7yrcA2%2Bt75c2bh%2BIhsBAIaCzDdTouv13wF79apxo9Irzv8WUpdeJLgzEaXpups3VsHvKXvYHQtE7Rd7gQZcP0TOtdZEfN%2F5lt%2BlkAcHWW8uA%2BTzwkB4mTvU1Wat%2FsudAo%2Bq20Cf4tGDlIRuxOxz34SS6tum4bFPJ%2BcyLzFLhcPFuU8ZVg2UfqBtQjycegiOboSSyEhSYQy9o5KvmanJsJH5h%2F4y4IWsT%2Bidthx0Urf2ARGva2B2pJ8Me7Ti5q8E%2F4j8%2FxcTCQqnx8Y0f6aQk3Ddb6mWaAtK7Gg3EN0AH5a8kGLRVkfAnixeY8qv00XVLBdwYC8K6vkWRD8b7m%2FqI12Ykpe7JCr7Q1SVaNMQVIBukkmTzsPi5exQHkl84m9GDKowcg%2Fh%2B22w%2Fd%2F3bNuQykbRmQ4c5cgNRk90CkwWGC%2F9S7c2RuJTnqbyfa43LAEGHJhOS7J8f4b%2B2DvzJqkaZsAIotQCM%2FRglZFzPATSsH3nRBW7IN4qPjJGPIcjHcF8eEEmZZ8qoRvzr8Q%2F9iwKf%2BB5%2FlxeOCehe9s3K3rDHrFiyx8uNkp1jmllWPOXVGNeSbnFqkEnPzXYkkBAWA71nkUmZlD7xQaWKhKG%2BO8jgfa%2B%2BhIkSIQqDYDYSigOtnnTDML2Xz8wGOqUBFsoZjiV2WH0w6Gg%2FEusVWDG8NCgVcY3j30y%2Fh5tMoAWTddWmSDg9a6%2B4%2F87cmKY7ibOW4NHjCP%2FkFFDC7GNWtP32%2FSwNgbcjHq387qoeEUjXH%2BgIN7FW7Q02BWC8w0WW%2FNKeEGPtR69SheCXAiq1f9pA60fyJYDY9xzmHmq%2FYZeEAl1AEZ2wz%2FRd%2FWuTJLxSyAmf26yZjMpgCdCUvfZvNT5aepdN&X-Amz-Signature=c91d9c5545a684a5985bbf3130f778dd70d6c805ae3594c10bff5fcb719cd940&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

