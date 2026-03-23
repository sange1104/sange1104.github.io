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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=87d21bdbcb549bb8bada152cb0487624d737985a9b92160da24b57e2eb31141b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=6ac200ca1da309433589c27b40055f12fe1c20970a8bd21824b595b2b580c250&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=53e1585a3a3ba65927787850f097c78a7dc7d6946117852e86a08eae7455f98b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=e5d8ad0c87767093f1a464a51b4507946bb43c047d3bc475901ae27854406771&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UNYWWLND%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDSrozPV3oKv2SA8LvXuK3BjEm59%2Brl7gmXmSjcwCRgAAIhAMmSF%2FVoUwwHZdHUj%2Bf%2F9fIN5SaJMz4ln8saHJsf3hnTKv8DCHUQABoMNjM3NDIzMTgzODA1IgwURx8uyHro9lODdWMq3ANOTEj8LKjIuA18XHKiacxLQzkhd2M%2Fusra%2BBZfr3M%2FGsI5YkGJnzvdg24af4moPolXBH7scwqbzC2SDjQHyP8tTWnt2AWEbhSqsq%2FXyKWtIQ%2BGBWg9rlJRPqUhaESrcIlFG1txXXxvyuj6pOom9ArCVkYdEEgPS1yBOLOnjAwE6dzEs6s3CdDe9r5uGUqXgyyBCUIKet6%2BQB2yYyqNnBI9D1SLN3hscjT2Q%2BqlCt47Q7VY0twl%2F8jzg9zHMolZZjHvyxf2MIxK9M%2F8wBYucU8wZCLIsCXzQqoCAq3FM2W7gTkiPDx%2BvO0pDfXAqYxNQSoAbO1ljSwWwV3uD86SXz4b9hXVhs1xVElF4GYgllo2H8qCDORMT3VY21cgu2k3P1PR%2Bb%2BM0qFqhiEfEumGZ3lfds%2Fh4eX%2Bpi4jfVPeYF%2FuhE30dja9kARZ1MbrQ70SEjF7HV%2FmHfiYPAaUFGZJQ33Xc8xt3LnG8wIOMvE5B3PbYRCzuglMuJMeRH4tF%2FeBJVNnWq51fpqs4R5bwc5J%2FI7Jq9aQD6XSoizrXiifp8dwPpickmFHZpB6d1OXuiOZeXnAh8BoUCwV7Vgo85BKUej22eBkkD%2F19Rn8nTFXcG0x3FWbSXnD3VyihGsa5zCL5YLOBjqkAQF%2F6l0tM9CDsnlJfi7Ls0%2BEN%2B4295SuvgolVH85Ymzc198Plj3sms1sly9ysYWhSk4oJICUPSxTzbPZc8jC8c8t3ekQi%2BtzO3APBmyXta%2FHgI0zJ8MZDLKR9FRO40nMkbieOCdG3XiiSWwiFbAJ09BqN2uWXVYlj8QIzJ1c2CWRvuC8XO7i49c6jLJKvN83qnbJV9LSjYTSvDVtnCpnONiz9ZFV&X-Amz-Signature=2bf90ee6349cc46fae8df388a4aba0fa5fda38a1eefc91a17f40bed77a451292&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YDCEOKIH%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD9DOKnE8cMiZBywQUfrPWC9%2FqbOJG9tnQ8FC1tJmPcFwIgPXAdq7MSeFJ3LnFIOnZ9PP%2FzSFrRt%2FWcYdcpYuts%2B7Uq%2FwMIdRAAGgw2Mzc0MjMxODM4MDUiDDDA3dUt5gpNI%2FmcwCrcAxBZVNgIYUScQbqt4RiHYmJiTWtm84slVeUpk%2Bdk5qw7DWQJm7OdW3mHw1MgDO4H5sgJj6uaiAN2VifMqQv957jLyJ%2FN%2B%2FUy78wexkUbisvxY9v5VvbcAy%2FE44VEW8Q7GXGcSe14o68vv%2BpZvikuWAfEKRbbMa9ob3Kk%2BVcr3ornyOAHCuv%2Bn9xMBExw4HVJ8AXCZ9KDTQ3iljnZztP1DAOAY5g%2FDAnew4fMW%2BO1YHwkkzt7EZE8oUiehDe%2FrPG2AnMdUxcOFpPEibrzroVrELuJy5CFr08L13Te1Ae8XntbFpuWy4GmOKh3XQTDXh%2FfZSr%2Fu%2F%2F6sODsDzWdqDSlKJ48FYhRF7rNatOZNgYpA1JimSPkfMe1uGdrxu2pPPPZ%2FfCAw2M3SSvTKzZqci1IomYgjuCorCs9nECPseYViMdMGer%2BXeIOqZJKJvyR8D9RPsHlqe%2BPenWVY8jhNPxtWD%2FNTn12wd7DSstIxm82YPHalW6tTO3cU2UECbrkRzvepVsAiS9SbBBN8jk2Tq4dYWvVOgQxv89bOMK9RjlWrr6RWpdYHGrtddA3op1eZU2OSapXDpPbtdtCmBFbiPSXqYNa%2BSweM23DbtENM2W53NDZULfGkjafa1bE%2B4pBMJbkgs4GOqUBbuw9k1ajcGoPyE%2FUarLTmsNJSLGydH1b7QMvu9o4F90YaJWqd6Q1QYz25igILi7Fyr9N%2FM7%2FuKV8Cnfz7eURZ%2FulileDZrcpEmCXB6hcuh%2B8g1Vc0x4yhm2xfp3nZl21CD%2BovmblrIuOeIBX0umo49Te%2FO%2F40aVlWo%2BPTgMXBaPcOib%2BeUl2Npo%2Bo%2BWp8QMA1fZh36IUEbEAVoRVCd3pfaBt0MG6&X-Amz-Signature=b298520d6b17666017ac5dd411196eeb2380b069177dbde4c0e5a551cc4ad9d4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7YXFDOR%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032604Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD%2FhibtI1EC9XGv9N9k5EdR75EM0ODbZSIpcoG8Cq%2FaUQIgXhGNGQQQ5eZux4ijIaULhAAQq3AmoZGGDpLjHigDzuwq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDGOldJ%2BDM2tIpIev5CrcA8JwczINSnTl7MaVkJmTxYiTTTjst54HhbiLGVPjFOaVpsL4%2FwIBNeBnshGmIl7%2B6GZtC8%2F3GRq5p3exuyPI7jMlFDhZxiK5AsWXVVysIgqtuwfa5MkJOgbGypNfu%2BtHC4wafJChdawTeQFcNGwdaTnxSxJGBwy4fP8oinER5ATlySD4i2OyQNaB5ezt1oWusMs0kOBRbyfrhlSXyi6iyPFkBp0vZO6ayiJrwjkbpDsBaEa9Mq4K%2BORisBe%2BcM9jZeC3ueIqwEaCFsrEnosrtAPKUkVGhHlTf8C%2F1c4zpItrMXp3hR9BANqCZp332GstqjhQCCA4PNvDjufSWzaVLVJezty%2FEjKum2KWOzU%2BejaNo1fpFS%2BYVAv%2FRGR%2BnEyTv7gcmnOc6trRxoE9PDnfMSEoYEKe%2BZVv%2FImTQIbC3BVUXq%2BEVeIS1wqit9tMT3FzKDy%2FEr1AbaCl88YL6YmfopCesEtBPiGo1QqHtszO8CGkGipBOqJr5qWGFvXEzmcKTbxdshLBbdRIkfvOWn6rce34ZjwbPHqaDE%2BEyNU3saoXIzQ4ENIYcFYisV7RkliIAINbqXhiga18VBVNlQJGxUrM2QELlfjTtw%2BPKzpEha4%2FXfEPBdfnW6BzfuUjMP%2FAgs4GOqUBV8xoxcRzWOcJWGp7KosYUlDOiReZuTrPAc%2BH%2FjJWuKSGpPeN%2FXqYLaBWuFaaXCY4kfYLWAChkk8hxBuOFw9J%2BDokwOWLxR51oLwKUgzTkea9ZFTolF6R13CdrkyyQDsc88zE1nOdSpJ1lLEqu%2BehWn2LLcGSpRbjF6u5%2Fu7xippqEURQhZhM7gdpQhprdCdbbq%2B1PzxFs64FQ7ma7ambL%2FyZMfuC&X-Amz-Signature=b0d8ab122382167423d89eaeee72aaf81eff066d4cd16337220be0b6764831b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W6VPXSEX%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032604Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIQD9qdJnl6zsczVqETZO%2FLsCSLg2V3raPqmx921AD7R4lAIfQFeTuWfpNSb07QY3nSanHtykmM%2Ft9ef85fvIYvqlPyr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMbjsqGaMRBC%2Fn3yHLKtwDiTRzxK4h8rTY3UQqgTAb8IATLVNx7FdclBt9%2BvuVmt7wCyd3fFO8LzPIGfSHWAc8flN2jgbrmEYOiwEcGgu6jW1otGDM%2Fa3BTymYgy%2B8ZVXdCW54%2BjhS7OFYerBpe6W2ZLyOctojyNIibtKRNAG%2BcJhpFvsbrsVYCKPzCe9SBPUVZY%2BgPhZQ8XbXLW1mt5BFwGpSJPSRQJzg2aPBtQLhWFvnXKxqs96eO7CQXVW5KANMZ%2FZG%2FkLbUN%2BAIrLwW21cap3udh2UbnGwhgRm11m%2B%2F%2BKe4HuuD3ZhVYrARu9kCyFfUd3NzOLn%2FNfDQzDX1QvT6ZOwcYlN7OkBMjwQDnICMAJl9kzMgOigX75lfJhx6HsiFMHxTyFq39OvupukECwbaffd58LDc2tDIZuMLcaPB8UkYR3K7pWSKBRiENPlXDqJBSvPgNLAa0ofGurdWD5q0itbfGvNVl8LZK4pFO8jPxyZtAPU%2F5PoNohDZyBkth1Yd%2BHFMysJVdfT%2BeI5w%2BWfJgp%2Bg7Fkg2FxDypUU1qmVdfzg26DURnEPbZvAnk%2FL7ulsP0PS21n4xyY8GWjOPq%2F7JJZEDUEDJYAlzJ4fbJcZUwOrsKtaaZDLKMU5VKzt0tr4lsfg70CIgEVgMAw2%2BOCzgY6pgGEoyrvoxBwuEZBxo2jr9OnLQKZVDdJpjdghlHc78000zaFSmwofkSj%2FlJ2eFePhxBaoR%2BJqgWHGRP3lp2%2Bbwg%2BgDE6a7Lu%2FlnDTxLp1wbIUXX7Y9qiDXnkIM9KqlUffCeXGKNseaJyVQZ2J18fuaDwrtD7L76gI59Y6KFb9FhVx2d6UkeNAJzzjPuktj%2BW2FTJcOCiusaSYTd56Omc1krRkWGkTqNU&X-Amz-Signature=2618a169506cac4c52813f3fd84e7695824df60f9fe1c0afabd0594290bdc2f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=ce5732cdf7b11ff03b2503b9ec1db4ce239190e0a30c0f7a37811e5e7f7de7ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=96185ccc640a27cd4f60b768ef9655f46384e59e8b34a3727531a7ae47cd4e08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666X432ZGD%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032609Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDNavpjHzoEwRUszExyt42O4cRcKl2hb4lwxgKqhAveBgIgB%2FkSj3jLH1AQaBFSK0qpoB%2BStiFyq5XdVq%2FseGDJJ4Uq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDEqSk8DOprXAPefcfSrcA4jPzSaOko1eSz8MKCgoUR0CvDniNg9Fom6tCw6%2FxDLHYIMSPmQVbuf3fcm9gGPjSSK5IuJmyxnISvFrND%2BA6Pk1Wae4q89mfmXp5kxB72l9Blu4qDzt1etmcBEMV7MdDl9PUmOScX6Ht5jwna64lnFxj6xYcyKo5Ntrgr%2BFFFcr%2BT0ws%2B%2FJAA9hm0bpSAngs1jVMEaIlxd0wdgm4jqwPVoE2AJ748tRNQzjR9pR0uvELU%2Bk2KY26gv2wbCURoLo1Ba%2BRvcXJThZw6Tc1O45RbluzaCwABejgWCSgb9dvr7d4YUZXiP%2FuZE8Q3avIddntpCahDJWGCVL5rpZBnRLwEHMWbJeDBolncuJpAf3I5rJrGvUJ1Jwb1yKAqyv4S4%2F7xceubBZbCXy7hpJPnu%2B7iaQSKTTYwPJmJDl8seon1IPfSx9ngzUUC6O80eHaJYIeV5d%2FigOkcGnjXmGmLYg%2FLWT2cGsMfQn2x1KrvSTJs3pSCC6kCZVTr9tmAE2yF2ZJre10Z4AH2pTk0cv5QimdlKKcPu22UVYI2dqF%2ByRDDeQbZOZATkDMhG0uDmJ3nF0tZn7mwtZa7mlSUk5dQ%2BBdB9z6c9IbkcLirSFHExsA5GIJuQzF8%2BXm9dBtqVsMP7Ags4GOqUBYlfd5P0Ryyvkepoi%2BEA4UCq7hZH2xHkjvHTWMS4PL%2B2fGWEanUBJ%2FARCVrj74eoKpITxW9MLA4URiIDT15eqj4K23%2FiDbDyYAecVlD5Z7qYKgghF48RSvhcNKq3lfT7tG%2FSU%2ByCIJLdX0TFnD81zHEoYc8G5tjp0dy7hL8yCYywkRWmLRn3Y1dS%2Bw5IsFnAZ6eXwtccmdslg846VuvqGwn03m3aC&X-Amz-Signature=1bdc65d78d0b04454c5af6cbaea9ee6ed81b49cb79716b4ecf82227388fc1d46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=4bad72c59f39acf379be5ef232b34c593ecb68fb30d1bb3b3cad3989d8c876f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W3CFD56J%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID4YUXZEqht4Lxnoe8p7pZhHYxpd0q7PPn2SfI1eZN5IAiEA5PjQn3kH%2B9CTGS1gr8LnHq%2F03NiIodii1xle%2Bjhv56oq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDBoUphomYv04g3XU1ircAzt8BVGhd4nJohjfqKkOQCb%2BDNkATO0kJzQgUOR%2BbHtdbO%2BwfO45%2FHnyfhnkMcvcLMFMS%2Fex3vrwoooGT31Bv5DRizja9Grbd7kjhOKojMe7fCfXItCddvGtqUd6zbSs2ZTdhlH8Ctoxows3zMTFLpMijXB4R8oJpuqAeGmctuKKf1GImJyc6ULdIzkUrr7wYFgu%2Fp6weqAG6Sk2ovaRc%2F4aADlmscSkQQKPNAlOF0jPHErfa17shhDI3DSS0ECn1NOZVyWEnwjO%2BvnU3p4E7EDRUWnw%2Bw04bHAiK7aJQUS8LUVxq3rIdkEuvCox6X34e8vvXD9ZUeRjl5Jk4dLN8%2B3tKA6SgWawaVuBoxZXVJnyzF%2Bpn4IWq0rxAjJpXlqNsjPYKRt01dSjN0%2F6xvMl8%2BWIckbkTNYVIkaK3v6nczrAz7uA%2Fqvzi%2F3n0gVFNRPRY40Wh4oTSvVIy5RMWf%2BK%2BGnRjz3mW4Vmf9HDqLTjQSJlLjCme%2FoKwXmdQ%2BmhWED5HleT8opGdliaXZQ3%2BZmAxlc%2FUkqQL0kxQzess2x9f8VOXHVxhJnt9rXR3OQTbKZbP92Ll8NJzbVavxZnMohWu2lRxLd6VuzoNolIujlWXheW3WrUtofGFVVgkboEMKXkgs4GOqUBf3SVgTg6HE9i6SSIteokakf0HPieqTLJ%2FYw%2BDPoEQhfnOAVYS1MBv9o1ctddXTG3iTN2e7MipNDWd9jXVtMboSRzC0qQs6h6TCK3SVIax50IEOeuf4PGXL9hHUc4hGmRA9zrHgdMxeeN6D%2FUmNCDg%2BV79kG%2BPgA3t3J6GS8seGq40y5HQaVxe4Y%2FtD3RPrBkuenfJDRRgycIGSt1fj%2B1PgpysOb2&X-Amz-Signature=3e299095e822395f2a5b50849c1584f6a47670c8390bde418dcb0a5ca89ed339&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W2DBZQ2N%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032611Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC5ys1%2F1lhmtyNy%2B5PPzUZEG8gY1y6qEEAlY2pPbNOVBwIgVjpggPOaKMZQ5PkhgYQ3jNAk4cRU4K9xTMPe9clZzmMq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDGBi0cfS%2FesQ3x%2FrRyrcA2Jr6Ukcv4HbHZEKXfZKGItZWKycuTmSjlsAzXff1Q9BbI8NAeveLWKW8Q0oLnLCnDQ0F9y1uZWsuuqQt0hRTK0%2FufNFLm3plK%2BMUYmb7oS3COSOsHIdcE7deYsUQMU1iCfi%2B8IV6MZ8kgCerNeXo3vJlCgNh%2BEgya3i5ytGB4h1wnHBYY%2BLZA23GRLpZQ8xa2lwa0NIEuAJQolIYIjLgfkKyBAX%2FhQA4PJyx9PMLCxs%2BKB3Ei1K0ClfhVXHbNjdklnJYK7gsVtcX9I25ESGYleFVHMVysjDPQlgWGgNmUrlGFaUx0bZl4uho6MZoNmR07279er39C%2BQ3LzRfmtl%2FjOOy%2BX%2FEvh8UNOkw49GpLp9mtB2OszNwsIBacampATPLK4ae4S1CKAb1HFdkQYxDpkMo3EdzcNsiSrfY02vgN%2BOtgyxq75AsZ0BLQ6tgZVXT2BrKDs2Tlgv8DUnhK7JD5w9KFojmwIWXudmcZAr%2FQEIQ8GjbLdYYxz8kFeuzuTskmSOsqv8OkhtflOJBZix%2BNzRh%2BR1aeqF9Mnv7NKwwBHFmJXRpKo2oz3eKhbtNKtTHijYejcdESTg099c6fbDA4tlcTOo2kX%2FNg4n7lUeVtxm9zeNvjpbMTR0WihrMOvjgs4GOqUB%2Bzie03ItPvfMg%2BU68ZhH0Qx7E0QTVKnyOtr59jIFTJzN%2FjQw4RDUHv6ySZVg%2Bx58%2FJ4iH8YUwbaFwVQKUcw9fWXm6SG8bj1FLmIIMnDpnkVnetMQH8u296KtJ1puSop4p7aRdv9aM8McLbgt8KG1TTljTZO03TbD0QvjzEvkvtcVq7hXrnbubz1Sq9q%2FJkQRS11iCVWObqH3gEegm63XOgO%2Behwc&X-Amz-Signature=f353bd699fe4cf7f89f8343162afe4819566c15ddd9fdbecef6af0a6430ce9bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663M6MRZN5%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF%2FmAQTSATi1kEsR%2B2A4DwcTQlprDCWeOqPF%2BiiBonM0AiAuS4gJGdK7VpEfNl6itoahEHEPGcj6dEdNVYzLwQCb2yr%2FAwhzEAAaDDYzNzQyMzE4MzgwNSIM2M4Fgaq4CRWYmbRqKtwDDRvIjjmIzsEbE0Grkkexcrc8giNwBIH9EyLV63g7UY0kNRUginN2gCPpxeRnEZQGUC0OYzZeDpu9u9LL3ru%2FyFaAjCmCxpwArbcNxKO35TvPy79helurnc8ueIhvWrNpnvRYFo4TWqlJKo%2Fozpth9TjfzhbYSmOktN9ycDhu0N9yrhlD3I95BE07uEP0IY5DidAJv%2BSYKWsJO3W7lkbf%2FTuBayjl%2B8%2BPegMGR8%2F1X2zC2W0FvHX3dQwE5xk4Apv8CdtKM2iHbqjJRXpKvmjXYGB8jpmrREa7PczahoJcZosbWjw56N3zn8tuD2T%2BXdoWfUHyNS3vUgFGgnnMwvcN8sI1glNEQTLihC%2BNRBLp7eT2uXAqB1haf2SBJM7e8%2BoBkogmfvGZdhaSOtEvfPRNUouxORnP%2B6igSV%2BQWccvcVJ5hQBee34j6xPLeu355uq%2FIOjA475xROP4%2FWiA4JWWr4%2FtH3vlgaCnfYa%2FbEVX7f4Z19uAdL4aPfsDWlhv%2BF7U9CJIacGMPNLxNKczGWOVXwiLN%2Benq2zOccxvGbzDLvskW8mpxvH7%2FvyPi2sea9ImC0QaE%2BVC5GCLXb9XfvhuIEZNTuauFJ2au2myVz0Qxda22rTNpkbeJ4j3ywIwtsCCzgY6pgFeKBFxLyvf1rVXgjdQFasz%2B8PWtzBwPrqJgNWRnDBXVAwdZK3mgUpANob6GYjLREvJYkSuR3AKqju6H2FLyQQtldqVYV0cRHmNJ3RUitSu7bm0oWWgJbZWv3b1ajGydTEy3j8Td2Vfv2bfbESyUfrCWWkikpe73LB41J0iAmEbpZXh80xWtY3i%2BJ2U169H8c%2B48AT9qltkGobEvfvudNLD7lnoJCH%2B&X-Amz-Signature=bbb8fdd0632681472d8797469eb9b0c97a3342921ded73162f9010e4145fe5cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRF6UCUZ%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBLmxiY3omn2PZRzQg1F28brtb3jTblUmscAKPnpz0OFAiBz1cuZtggoNOV9V5oZD%2BK%2BdNTEdoNB7DziYY0WXC0VwSr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMif0XTX4zW%2Bs5g6HuKtwDU7Bdbh4z%2BnkD5fHsxwppxTYCFIWPPhO8oJPQarnPkwYhMt23SxMJNOdKaV2mrfyh0%2FVsejMKUF3rz41ZfF1SOFqzkguCRByJmc0fq42BkS3oOHhfyfQB221EP7aDAkE0Zv%2FIIFB%2BDIYpGhVuo34w8nB3g%2Buhc5wJwXeGL6A3PuRWA0SHXJC2jEf7Kx4kM3pliWs6GtKp%2FpBHBud34AZ5jvOgEJpLAjWy063llKNeS6XXlOFgwjrlAnz7s5Mwg%2B2yikLmofKrAZhtyHYqspGOe%2BGcR3L2G2lUWEcUA7TaSCwtnVSuDcHtAZa69sH3OP%2BWNNODc5xHFvPC9qX6IbPuTz6uZZUatc23Ifs9gUOLVPi85UzAGb2L0q0EjNn2ZvqWDL8uWz%2FXbJNoEn1DmhyC6zcyuEbIg0owN%2Fu9hzzf3ghs97Zr6vz21cKZr21ADZF5EFTUwOSO3BhjHrlX5gq%2FDsnhT%2BGRCFhj1CL4ui8F4aZy%2BN8SYUjJH%2FUqCuEhEWJLMpSSTVJwoC2xy8T7HSufpp7RBNI8DNwynkZdTYbaog1cQiss8a6KWvG%2BxEAgTYYnk%2FLUjQCVtLkPfEFP8Ps4ExxoL7wpZKSktqGYxQ6MwREGh8G3qvlBnyYO7yQwz%2BSCzgY6pgGGOF%2BZjyBa3nxNfyvR2POJY7zjP6g8ziwP9a0fiRR8avWsMDVtMOgrHRWS0lX4axtOKZ9u4PrdIw6s0akhWeuVvGcyN1U2nVjsreZXnRycjjsAAmmXXuG3cEI2NzOrJV3RjSCQhGjKKCdoJZYzRZsE8asNO67AU%2B4Bfp9%2FZavcMDq%2BeDkg%2F6b2b70jimUW9dUFjrWhLf3b0IFPEoD8kbh%2BoNoFM%2Bmv&X-Amz-Signature=cec74d153f744d44da23e83dda480b937887fb3be32d430c8a5aa38a657283a1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=6e8b0c3410d6ebe71468cc1401babde42e2db3226d404b394472b0aaf18f0b5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIQTOXRV%2F20260323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260323T032517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEesxgYp7zYgUYUOaZAGTmXDV7KK4g0tkhqJuPXT444AiAGKR0yDOh4VTDUjPUWcfhyEDC6xlylBpUSP9ZzQgGZvCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMu%2Bn0KwquUABFm2NJKtwDVHnQRSriDMPMoBI%2FHmDuHCmcpfJEo9YrNIfzBmMDq9rUBpqurzCpc7VWbM1TcTvkD%2F7rTkBmcAPQ2PFsUjjP7P2I5xsBZsrV58xAzu5h9mbKmetLPfaae2J1lyKZS7SxN7HOW6GHdYFmiLSWinK5oXMaNps2YztOIsqHoMf5YVidHpLFblFBTTN%2FUYa4mrgJjSEnznAnEfpoxCGPns2m9EgUsv2wGa6HPAudOFXyetGI%2FcQpUETcRwiu%2BdK24fsZldrAXkpeh12knKvpO4A5DwBVNqFnvVqpfbXsiFL23ES9uBZ2SBowmGkyalByGaUaOYzOa4gEiD6dMS8lHzjTWF9RSjMGPFybU1WCy2eYsdxw7YXnIgqgGdnMX1PYHWBLaGVhioQ8E3ckUyng5Jxs62e0bpRByJcNuW9QJVsxjQ9fwHiuctk2qmBnhmTtT67xBa9xYWo8JAQwJN2uK93af%2BMREr2f9N2kmE1gfR%2FczRBQyDdgOlDNbL%2FBIpNT%2FqTL7GaF1qqSmDKyvVc9FwCiYofkjZBfZk%2FxhuQQVthEjLuiIdkdorSZxxTHkapErTL4enq%2B4bMB6tx%2Fzi%2BLv7Q%2BBvE6g9qV9Il2UCOEbdTP25eGHpR1zEMf8FyNnUMw%2BeOCzgY6pgG4jPOAemDFJhFGCGuXboEH5m6w4LsobPzWKrdnTtbRdvS%2F%2B2KgGajjgYIvqd7Hc4Oi4UIsTFn45AqdA0cUutrFlIN3WjYwZsnT5ISi24q%2Bb7KxRkALjfxCzlPPPkPingvd6dwmar%2BEr5JQqWGV4tTSh3CXCHWMZvesQWGisfjmq6h6tg5%2FJBP%2F9ep76DasA6%2BpeY5KbEFcu82HnUSEIg1fHgx9KQhy&X-Amz-Signature=b243621b6553c5187c5c440b773b3c29eccaaac32768606015429c532bddb9e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

