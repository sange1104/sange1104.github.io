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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=ddc70c1f9708b5ddd2c38baa6ec1f3a17e3be4c6af6474d15295b8090b80bc85&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=0e0ffe2ded1644aea1e6c08c98c3301cc06f2cfe203b3fbe36cb15afad48622f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=5e046442a10ea4f2a9270cc896226b443cd43b8a25c4dc1fbd3604804881921c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=bb3e50fa66c385e598e59bba3d6d24dbd13bef32d99d0495b356a029d52308fe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664TMGSXJQ%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035623Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBEO%2Fp4FDrzwEIY4h5F%2BIp5ycIAdU9HSSNV8WpPDwNUtAiB2THQ%2BA%2FLVO2d2xC6o3%2BHHUQ65sAPJide1vRud%2BYoWECqIBAil%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJYlQdsLT9DS7jwhnKtwD352raqx8uRdZuDVP25njUkd9cEQZjOjKKlVP4bVbC2MgIoj6dSzwhzPpr3uM8G49m0Lq%2By7YRyFY1Z506qsGLFrFsGBicL%2Bu8uyfAR2CnkCnEjHJ1ycxghhaut3ykrKgRmDc28Wr1JrOLbETZxWoEn49I1bZAzfIUu8JGZ2izlM71nD382XLbXmTZ4uks%2FtwG8WFThZ7qQk04kFjYtFze24lqCsur6ObTLdxS18IfJ%2Fmr8voyYYjFRSv8cHz0eT5KTjkM%2FeJnrmSgSclSi55SQexifGZrh%2B8S%2FSy%2Fgm6gaveSF5jwSEOXwAbN8CUd0N3Tu5d%2FgPdJfQkacZoj00m5yt3xydanalRK3gXDm%2Bf%2BlQRyUNvc5OKs4VJT8kzrcBk3WuTSlOd62iZ80Qq951HL%2BD0BgqGg8dsdZ9GOJBGWGXRVOqyFsIsw3wFK5MipDvR%2BLLIL9MrBFyV1JtprwurFp5Py1YphW2RG6wWGU%2F7Nc5fFl5YEH8%2FF0DevQNf%2BRZfGLkgHJ5Fyp0L8rpw6UxWN3WtIMf5smrMMzwPgSFpagf5ju2%2FhSdJZcbJf1VWEjXGjsQ%2Biua9eC6I8EIT1t2dGLqRx%2BIsPp3nM0vImY2qvvnpoWDVtwrldwKIfA8ww5C2zwY6pgHXTEM%2BrrmqMMCNPA3fiv4PUKu4gTozP8MNGvXtAw6pxLNBifQ2MmcTFRO2eiymvEGXi029Vn1CfI2uhm5QH9qdfpEcOFyxwHHuzgm%2BeyR7mwNtXUC6pBUuPI6pPpxvk0DNftej%2Fkijiw4%2F6E66JLWJduf6iiV7LG8BknfvQKGRoFi30RBHLLqhLnLxRwgs2s5ZFlcb47LIQijOqA06VlgveWJ87Awk&X-Amz-Signature=9c4fd9b583b1dfe0145ff162e6ade4c0d0c79508b2a5a934562cf6894a9db012&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RUAWBCZ5%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQChYxNFMw42bsA0JABAhZp3%2F4AYjJ1WWPA0i6Uc4YEpcQIhAOTo0lB8f9EBgHiUwRWN%2F5zAMRKB3RcMJCgQfUOgASgrKogECKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy4ONIVcwaTu%2F1JR%2Foq3APtGHwSxXxymgDPZdGekgwDY4QhIvw9HyKnqHS8FjxbEO12kOsWhDxeGRR5qMLNFM0B9TbWqgAMev4bf%2B982NWkgUDxuI3Ixu3r%2Bnh%2B6x7s%2BNlUZxHVwJZ51BPv6OEQalmnGjTBizJnyrgBmso7UTUe5RUcTQ0aSmRP3VIsMcGApMVXehpa%2BX9zza0x0xi1c41727fXP024vChWcTU4qDKhOPZB36DUAy0ZS3QSs6GnRv8RnHdfAJaBMmC0b5VJ50KgYvjMufCdBZiDYgyHLFMNGEYEoXSYvXMIEdc4vxB4u71%2BYzihe0JUb86kvrmfH2bTZCIColcFZjESRioK2iJzAd57M4JLmQKkRjEeuwPG7e%2BhW5gorgQDC7To5NX2SYstLwoWmYRyLNLvtxVMIpdSXL%2FQlxillLVxj0S6rYQcVOyQET38etkhDjphTZsFE7toaPR%2FIFXjo06WR2w%2FuHA8h1Ph2YSNRD2ueLyWHxIrPJVvaYZt1%2FSP%2FDXSlcX1DS%2BYfZmpOX%2B1%2F%2FYzphLwOBPjrljBlUGfEiJozacKDWWrQ%2FrFA8LjqlJbm5QT8WE%2FQT69dUy%2FEIWuwCZ2E%2FYZJbFykUT6fH0orIqzn9alk3aKPIrnFmdiX0r266iFCTDvkLbPBjqkAZp14EuTBpTeWX%2Fw9XLlXwnQ1HBf5FCJjbTnCZaZ9Db7cZ7%2Fjzsj6d4KxOzq9UW3P%2BWVgvwXgVCyFhW8Pfqwp%2Bsn9RGcdB4R1dZvvo7vnB9rBvsnEn2GNYD7trBps10FYZAIXlbV0s3YZhFDEnYRxmHklbd6nMVtRZ73BFE06Sp7U%2BPX0kdTapaeQONq7QdRONAzqavH2LdjeR%2FQQ8YFbP%2B5P44g&X-Amz-Signature=30d1e30225e9503113025d579373eceea3f1ebbc375954a399be447c51762035&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QHJJ74LS%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4xmyZxQSXC3dpS%2FmuhHyvoGcHIVwlcCWeWOXqnaRBKAIhAINPXArEckclS8cRMGiqmtAiOFwNX%2Bgts%2FBLa1TQdaQGKogECKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyRV%2BChRDgQxcnHAfcq3APGPsQSSlwva6rWaYC5APVBJsm80fLfdS4%2BGwmj4IeMo4IUoPWmI7DMSntaus1w4tjDcvmNENjdfuSTMQ%2B4abFO75eDSxXz4zAMeX8kvisVjHdoWKmu8ZtQ8Dxek%2BIY9q9AUgmNuJ%2Fp9tqnbU5pwLAY1rx466gYn%2FNFlcNj%2FR%2BtShSBZuoXRtWCA7chZm%2FRBnJHiFSgAYHimYppZGetKDpD6f9gnzqwbCeMu6xDUHRXxbZl5yRy8BCd%2B2mLZojLCN9a0no1d4DB1kYjOjbsVZLmlizGlCjHY4ZAj7uBMvkHHttfbT8aodctPWl5kyMlZhDoelvDoyVFbhqRlmsmC1d5HEaLUvwQWO1C%2F2a3sd%2B7cwaOMl45%2BitCznI4r8cxxN1Yygjd%2FsxwMksuAU%2F49QivUIHhCqqtExED8V8i0r0POSUYtTpamv3FEikQ5CBJNVL8Jjhf1ZXOmULvHM32%2Buc5BFGjfqQIAd%2B4zKXL2fL%2FHbYK6OAuMKxV9%2F7kUbzGtVSyElmAkLUCj4W2EQvtaoBtPpZukwaJq%2Fog2hlgbgFUJgx8AzprEzlfFekssBxWAmWGF9ZpAkUlVDFegvd9%2Fs7LNFsUDjgFXX6sv4Y%2BRtNVJ%2Frt9QnQjQQLj%2FTSKzCYkLbPBjqkARqj0bDre%2B8cSKTBdZIJowp0P8ayQ2JZAPBhnnzXHM%2BabHRqCoQuKonWsPxtaL9e6Q07Y%2Fuo8M%2BMUVbpp2xbajNGXVYIymoMj3EzCSV4L4p4lKftdbnv23StqkC8qaFOQ4EpJAghA55nv0reb1HPcUIpjQQDwCCUAVUWa7I5DOAU2%2BOWhNTDsKTLQiY9RLD73zGOAGSEeIHu4wkpJ3k43dVSQLIR&X-Amz-Signature=6887c4a04e2892ebd0d1e494a1e7ee4e2565ca95b327e6fe33741a78c26fe36c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666R4AHNNV%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwDC%2FUEmTwmKo556ue6KdCIgKpnSTwqghlZyE7n9%2FKeAIhAKPzYSojF29yB%2FGe5ET%2FgnzPDXGymfGVTesZRmheM4oXKogECKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwR%2BVbohNKImG3sJyMq3AO0pcCkOg5LYFDzU2MrTZOB%2Bn9V3Zz4JaIBQkgElbs81t5XL%2FNAXI6oTY69f8ZYAdo6Eaq4%2BBZK69iXttDPvqfxVnzCwNZcce%2FeLlRioNsWUG2qmXLXZHQruH8bx3QKaC28Feo0LvmAFwgiY8rDM4nFdQU8Nr%2BJhbcz1xQIXE%2F0QD%2FYGOh1TtSgOOENpWJLA5SRzhzx6fqC%2FSpAI9d%2FfJDkNTFlGdNfDU156V5d4TRB1hTLdGmbnvZyrkH51WjlEqZjb67QOsXjgaJ40MggwTLRPRcJ038q1dxuzoI3LIGU0p3sqCqHTPw8jqHRl67kp84F0HkdtNofMND%2B1kR5%2F4QHJ3JNpTO04XlUJ6pL4DtO3QBp2FABCOmgpt7ypYd7A6RWTvp6ezmb7tsgOrPCTe8XeSUf2OmkMnsM%2B5qBCKoqb%2BHtbkLPIZIeqUmRF8F5ODXInhVk51KRefUXTq6t%2FBhkk6QlGq7yFvJ4%2FbEsEWV5WIj6bnd7UGZ%2FiSlo1tkAmNxUTSNqWzNEpn3%2FWWFPnB3%2FzVPgRjqwlrZf4aYeKc7zSkxXIUHXkIC84GNe4xCAXWW%2FesFkE1iTGlXv9m%2By%2FY8UkEXSooeNRgfMrsyS0%2BZjasi%2FYjiHr6OLC8VgDDCPkbbPBjqkAaIWQMYjScRc%2BZeFiZqe3kElKqbFr2YNpUfKXzJFZ7a8F1Nmeh1ehEgshRY1RtTdT%2BYEhv00E7ERC63n9MJ59gUHW0dIT71ig5dHvQPjg8ibl8uuiQ48IbHb4HTvwCpP%2FwyGFWVtaEFhEWQM6L%2Bhp%2F6w5LpdjzRtvBwd1k%2Fog1ufuRjjhf7qvzQi8tBYh%2FpqRokENxrnqCoT0Vdv0sBUKI6KnBMp&X-Amz-Signature=8b66e5f8f44a4ab782d359713227e5474502b3acb36f6d0f7303f789f3c1779d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=eca8f6156f0c34916ff06f9943ed7675a4c2f039fd307bd32952b233cdb84eeb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=0f4754f92b8ad54fba4288995c589dca3fc705edea0f46ba2cd7fd11375a94b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667GFAKNBF%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC46c7G3m6ZhNwX74yvux%2FLlkl0eHGKOV4INGUYJ%2FhAwgIhAO4nLiXTNNbb1sGqtQt9eQAteLGB%2Fu7aawirKpNmL0goKogECKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyJViPLEJeQZTXlORkq3AMTklO6lqmaDKhXBDj%2FC7s3kLxMhB5PMiSsQ5LNTm1vhypHktCZhymVGulOdvJ8k%2B3pQTXGSpbYeKuWdjxkk1vBknh7mybe3jVjNqNV3WkwOFnFGYg%2BfWylPX78QoXk8jwsrZPVekWzAcRokM6Kctz1iaw2Fr9FBlQpvszF5xIrGFwVrl6MjeBmIKfvRrknuId9djIyWxM50pVVppukoeFDaiBtRmZumXPj9VPh01dOhnnKNfR%2FJT2I9bORQ0ImkCE2fP9B4zM12Jg5aQgNvqx2IMfA46LEt1Wzr3EV4KBaensdTl54Kzl2WVHQlJjH%2FyM0FtmAILO%2BblJFrr1LxJ%2FZ3tN%2FBKFpyfovNS0ZyoltYOxzDK9JYebUA9Ycwvp50Ckdemx3ZAvAhpZs13TamMPHNdDKy7D1eDtNHlpzBCZSaLZCn1G95JxBm9Y9lWqf%2FnSJ7xdinTIK%2BRLPWmWqSb4Sf81DPUYt2%2BfanN8MDkNWmHeZIR394XZQ0vK1nWtO2YEkNCGK%2BSHylDoMerXGOct3dssWHOKdFU7Xsltl2Rb8dmw1TcX67GEXhSc8O8IKTr91z5xY07gc%2FCvgiqyDAc7I%2FVwi1xduji9%2BiHQ6NcpYI3D8QTXuPGMG1PiApjCJkLbPBjqkASk3sskadtmJIOPX%2FEjy0AjCKcYMSu2OfEERE0OoFUfbLL0%2FxG4X7shahZhMOqXywtGWTpIP8u5DnexwOqGLpCw3mi6o8RZZt62rlJpMLj7dKD%2F65WgNLi01OzI7dwU%2FOj25cICV7B3DtIQhOPgIYuzpk1bkjzQp3t4eaKcsqj4c3trOW369TsubOoV868gENA4xUeWMbR6avlHdaIIf9fo3jA3g&X-Amz-Signature=b0ca0637d515f8a4d96191223de065fcdc28adb233e6aed04a0dce9c2b070614&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=438f2822fad31f4c6f803d0040ab6346770e6d61c3b00e26dc019d5c35610918&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46627AIGCIJ%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCEm%2FDBn%2BQs6Bzt%2B2y8qvsb%2Fm2FIE%2FfVl9rKNnvumvbcwIgb%2FSyyObjLPBDc2qDR5VGQKZGII9NrgMp1RQu15hoUsAqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKTSWdZq3vWUnnGqFCrcAy376080pgXqAyxlhuXCWvV22i7Z5v51jf%2BE1tNbfMIYlSaiYhDmIELQeMc01EHqrUpwt9BWRmTGPcCeAwlBwHenqT7UknJ%2BV436F5BXv0lYz3tzpYyFR9IBmlh%2BD7zPTdGARF1LZdLSkP8ZMm9nt8ATTIrbjlRGW9m9xNlau08R8GjEtY6IPxqKLGAzp50hy56sUxRL696956jArC6XPJNQTfXrQ4AB6hMrYTuZZfLjKZ3mH7VbiNoh500A8l9omg0I%2FBeE5m6uZFvSlODltf7V8wBvw9FQG9R0ecZfUQosIFKJgJv4Z56PIlQeGBgYMhCSKu0SIRIE0yRR7yQ1CAUn7A%2FaDaP2fXXGFLvrJvanWN9czUrdyZ8cxqd6SH99D4FlgAVJbTTE8PmzDdEKBFSRE3W878oAY2lx5sXsB%2Bs7%2F%2FubIG%2Fwryxd5NpuAnWJaHWPWSCuhNRUcLzu1kmM9poAOePtsKy9PKqYG4ZoJmkzmzxXyyjiFX3HW6CvWO%2BJmWYvCiKThKrziVbijTuRy%2BkxXLwGXenEOHW0xOy2lBYrCeNdjgBeLKZU0IlRi8Eym4gpnuwl1H8XDBLvZUpKNXK15rXKO%2Fr14wsok6ViKOyScSua0MOsWtHTozWKMISRts8GOqUBfD%2B78GBMfsWTdDAQtJDdteSjjZ6AJzvkOVJuYew9oexwI9KoAte5MSXVMifzq%2FRHfUT8W36YUK70kySwmmAHj1erwzv8aBYfrrhVL6ZXAvGlgnquALQyykoxh7IJILNpSZk6FEJn1LBNYxrmy9jzzU5VUR4upZWym%2BfshUDtJC8dEfVJFrvoYVvNopS8D3rRD7UvDm9rMmJRY6d4tPzHQ%2Fs5W3ts&X-Amz-Signature=f7ef8d17355f1a7374fc8e35bcc3c5ba2380bb8ffbbea640e4c6bc04ca52c11f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLWEMUS4%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCAfGZvQ2BxHdoxbu4y%2FgWTcZ4pNZXB5bYsooRaplKMQgIgbY7WxLLboY770tv1bpHWnlzgBkqnR4%2B9%2B%2BSA0Mj8etgqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF9E0S2SxJeCSYY6CSrcA7fLZLJH09A2DefKxWbfykYKKd4r%2F%2Fb%2FQNHAuqNu3KRL13IWnwsm6KjiqEMPFNkWpiUSKu5CZrlicvVIoauykEIgHf8jDayZLHBk174uQuGxaiG7z0YPh0t7txbfDQeB3M8KvyXU%2FNzVBPsfSc8rK0CsgFFqDAh26dKuDw034TwU5wk9ksEbcbHYF23HWqEmrFvHWJ8BfjasTMeVyj0R%2FUL18nvLVBtZwvwRUMIAF6aiAxWVS4L8XnFMt4BKD1E%2B%2BVn3fx3lcAvlRO0%2FhJDOLqcqI3ztaRWpbINo7EDHluRUieYrFXYFfUEsW8PkYzhdUEs%2Fcwi%2FkhX2Ib9gFlgQYqCKnzgOpV2enPS4rFIEfMry0OIEHjDGMhjdyg8i1%2FwD2OhK32pFhDFAaxYdC5AOIjRDDilFeCY7S8fYAyg%2FmOsxGmQeTwwOQ3gpyjUHa7eechPF3%2FCnuKt1NDhCsIVJk1jonLXEaoBIRqOglbRuMO2extgSD24c4yrZXlksdRRf9MAo1W0n%2F2Gf%2BcC6fLY9Q%2Bc0aZ6pvXOIIyJMPgH8XJalcJIYc7i1YDF8bKh3b05%2F2wWYGZQtbZHwE6XPnuTQN5u67Kv1HS5jYNNcTGWMseaiwhcyDsufsqeutYvNMOOPts8GOqUBK9%2FPy6g1WAfBDFsFq94tqVbhDA2nJyzig%2BEu5z3Sy7eAZ%2Bigt03EITmoNvM0YAMjnSTR0lnsiVz8u4Nv06G43c%2FlnUL8lVahtClLwDeke%2BqhT66qKa%2FvGwo2lvcw9aZLpOVrJMhrGEmwyxZNx0%2B4RuktRaM872MZ6KIgUptR9WVeY6l3H57xEScop8K%2BcrOLuhag0ACdgPDPyGMeilGNfw9tVO8F&X-Amz-Signature=7d320b7939c3ba12c4e5beea3e452e4c656677d83628db8be6d1f9eb9032afa6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2T5MKFV%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDEPrB%2BkuHuFLnV9B39HUcnizqkY6qQqLYzVs6q2BU6ngIgMlSpCX8AZJynvRmMWwMbslpnLhUYMAnTQaLN1D1HUPgqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2FvuY3IykNzT%2FsNyircAxrBTTMX3Zhb5ccB%2FYZy0FVYpDohK52ALvLZFS2l08jYFPapRhV8jfiBU3YNTsOxQuLfJK%2BswAAcJ6o%2FdFvHjUKo5qnCARoqJtj44dHCcw2PcUzfDKW8i8ITuu6aScuW440SYa1CE%2FzHgiCwj7zNEE0FRDJ7dE4Hg%2FSMiiOP%2BvYamidlpnrDG6xq4b3s6vn%2Fikrm4yj6B0FxQ4Q1ArfEE5W%2FdCH%2FsAkXILvCL9Z%2B3l7qw%2B5x3DOzwMqRMoIr4otF8APxBunz70eKWb05wNq4RGUauUSEhjo0TOCals7tLjeWjUBh%2FyHkJ44kRMZYg5HIYuABEdH0CSi4%2FSqM0mJUrCXuXhVbw0lwdPmm9hbnSQ6PKpq4fMqTtOr%2FO4v%2B%2Be%2B8RaNk10PP9SGF038gPYcQ%2BYSXtiSdcsGjiOOYTztDKP2IWxmCfzsV8wz73BccIu%2B9nN7McLvG2x4rWO%2FRBsgFJIc9L0A61%2FqXWyqixsXgqQ7s7MuyGHGLgr7xXtd8z%2BDWpiUhtcCMGZ0nFDjGdp3gjGMXTMRXJVc8nk67SwiG7ifXB1VRwFzu0ubI8iuVglIa4POnEP3By%2BLRLbgYQpWlwG%2FIBoBxEI13TtpPEPgAzTJUee2v0%2BuD97wS%2BFhwMN%2BOts8GOqUBflivEvQdgu1B4wt6hlVT1QwZBX5NqNhfst5eJRNQxD5GNhE8e%2BW%2BPa84EcD9MCvP%2BPM8r5XiwPvQ%2BytdOaea1Y0rYYPZRLTqSIGMKXcTVl%2F%2BZqemO%2Faq6%2BTpY%2BL8tzkSV%2BFhi2G1UteljAc%2BFeU6qFvcN6%2B3LoqNci1f2lJ4N4MS4rK%2Bo%2F6fSKDdhm0zJwLidw%2F7%2BDg00eIvJFvq28hNJbBHk8vR&X-Amz-Signature=c643ff3e2f771751db2db5455e985692edd867dd3773f790ad5c5fac1c385147&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666EXPDBL4%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035636Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBxTJakrW%2BSSYyrRAMoJATV3odmqrhfMMf521OIbSH02AiEAr1P%2BG7xF1YKmuv8YU89I0T%2BdCI5%2BakhLG5r1brgf6ecqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAhLjqOu%2Fo8AxzCmvCrcAxkw7blWr21enG2%2F6%2BshljTNqhlak9iSQR0ENEGLqpsLRz7vj%2BR1jLWBRnxW4VDisvxL45Vie4J83jz0wfehEilLnJV84zsTm08UtIzsugegoycBOgJH8cRLbHfsGUXr2cJ2KjqmygjvZP3B7KSlQVBbjB94%2Fg%2FOS7BuAU8v75NeSgPWzNUoa9jKsiL7hDTDK0skiv4t5ZOFCUG3Yg7nAdtirYxbeEsFA9fdkP4%2FUTSfd8MRXuQQ8dEOBcIHioitsGr2ZmK8oGZLLFB3QYth6x0n9%2BdSutUKEZNWQt9Jv27PVM2zBVteo0o0gXYtXJZ4YLnXio3MAgyYjlb%2FfEYqOI%2BlrR71IyvIYia4Sj2xAmWu5l4A91v2hWXcn0gMCTb%2BstJh10JHQDc06NUvSaluVRGfov6RLocv7GoyfCXyxEMKpw1iCvvDNLQetwEmsfzOJ69tfEbyRsqS38mrtFWsPfAu%2FZzpQuTSOHO%2FT6DUPFpwItlv%2FXdn8iuopT72bLh18X4BXkddz8%2BuajbOT0FmdewZI%2B5i2360KZfZs3Y4Ib6u9vNH%2FBGG9iJ3hUYY61habHnZlneCCaiE1YhFsqCuZ0L%2FprW3YsGecf7KmKXH0ir7pBjdaihPnNSCy2FvMMSRts8GOqUBowJoVw4PRgo9zP%2BbxGK26aZCo%2BsT6c19EXDZGADcWsmV8R3AVkoYaMUoLIlWukn%2FMIn8rlTZgzJyvJJNdUMvSgCG8SOKEtD82%2FZ5z3tVUZzNyY0vFAoUrDV2YvcdNh1Oh2yRZYGFEmsyphhw47t6%2BrPJjylM9j3Fx1TOxig61czgiWRdmTYJxn5EjS8Sg0EBGOCCWGmYgU0IEThOdw9KxxkFE8rn&X-Amz-Signature=915c0c0f5e5ceef2e075091704a3953f9734d3bb50554fc5638b498e03920612&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=72af52db9d2e7b413036f66e65339edb295234967b9f3b278f3cd9c8a6fc0103&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPN2BTLA%2F20260426%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260426T035616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQR96YQ27e65cej6MFypreZ6HrNY%2BMUiolBcceOGxhuAIgawNi70bDJ0xqUQNQRUZN9HDu6NhnfEj0ZC1eBq3BljUqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMkiM8I%2BxGPOp7hVHyrcAzZMkY0DY%2Fe6qZBAa3hoW3eFwJIjq4nqumF6AaSZ8FzRwOxcGO%2BtLK0OE3wowktQuLYcN0%2B6olbRknHkkUQAsgkMldPEw5QiKr3RcR3zo9dVqbmQoXrLiH4jgQ5aZ%2FviZ66hDmLm4cV0UiLeQ1Gxl8owfYGuW6c89LXF7L0ycI0epIrkDOoeVMZdYwUj0pU0NCtlCdNY2CjpeaXU%2F4aWSgO0bYsFVIVvthPsezbC9KoAljhWIdc%2Fv31CZbs59rSGRCyu0qEBqWl9WB4bXta330QeAqqDIrDWQ9xa3nMFPwBMX7DapYPi5oPTVrYFz0JYsK6ywatLGBzgFt3WaGjDArI%2F5T4xz9jLik00N7fst3GlQHaBs%2BaPpc9usPKKkDZpWiY4bCyIT8wKNo%2FTagJHxH88OaLNB3k7na6i8ez2kzKoZPEm9%2BVoitCiKlUg6ep9tQ%2FSo6ABGiVZsb0L2roJ574VfrQrwIm2LKDsCXslxmsg538CuNIcdbjqHw%2BnO8Ho1427lo0vyS3gxMWLIGNJI59LalDxoH9dtjIfoOVusrzB5K5NaakTe2tUTlNt%2BpqNStcWdQccvuPq2YFagoWEjpGULBSFcTvRi7uiDz7qvQf%2F9SO6gDEbBTqnF%2FxCMPKQts8GOqUB6%2Bw0dKIBDnMIzYspdFep7o6o79gGSa1gzcaxbICVkHtbH418GDO7L5PH6Menztfh%2Fp%2FYOoEg3NU6meR8erOxvXXqdt1cWXy2UerziByO4pl0Ke5DKd5TJlrzCqYZMMVidzMLijaQeWFGfH0wo1%2BNJb%2FAOrpHK4k%2FSadpDcLzHDQTEdpU14969Ph9IiRNaC%2Bxsmx4S74mJ%2FsbiPqnHbl3f9NMLODu&X-Amz-Signature=939209bff9776bc39f003db6e08e5a79d8eb4ef2d9572260f5687f2afbe24da3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

