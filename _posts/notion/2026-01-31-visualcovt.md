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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=b052a42cb347f496131331c3026ef30e03983ebd3147d9a790269eb0b2f44a2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=cf5c111c0a03eba6b571ff8034fc53590e2dd4a700a6aa1aa3136e043d31e920&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=29b4a328b839312ba9823a83d340872ba3317b9f0dbf227e47c117d308ba668e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=3bbedeb676886be408ee2282abad4bc6e3d9c557d2151318098f21c664f43404&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XO7JWMOT%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040311Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDMceQvFtswkFozB3Ti3P91cu9socjxQSn%2Fkio4hdhEFAIgRpQ4Pi2DevCDSk3rgG39NjlmcOj%2BOGtIS01ceydlYw8qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHq%2BrIfO9ltZF3KryircA4kdCxFsgVjG2%2FOyzHCc4jDPje%2FPBVVnThnzskCDrgFB%2BDgBj5YhIcGXIeAoFdX%2FwrJMp5c%2FsEAYXXdGX4T4c9hM8UQJSptHDKl%2FZdNJdLYpnIZ7OR7rmXTeVL9LoWjKtgglsQvZ1AIkyemJl1ZEvfjfRHS5UoquQ3B0FsCP61M%2FDPwBoj%2BUF5U10cpCYUpKK9H4UPeiFIciOgMDFs8B48vcl7vV1f7k6RC4VUZKz%2Fu1NaAInSVzaeISf3mY8z2Rcz78fwGHixPf9t%2FtuNrmYBb9P8ctoCXPnHs6gLNkUehW78t2NRDaoQ9zSSePHDlWR5dVPWewX6RtEVtI0riEevIaxEQtu5tvdw5gzXlUb4PuihlqGb3oX0g4YJu6L4kzgGz2icB8pPSY6oazUkakbZmNtdTJ8tIiZFvcMcQ4%2BlxbAqut0wMYIeNJm3j7%2FaUQ%2BxYqn402WsaAjG%2Fhm%2FlrA93U6%2BHp8l8IBFLjj7uhC%2F9CUWulcNPGjDr6M6AjxYxvkBMG%2BicRO0Pk%2FsWfsHVb%2B9tXeukUR%2Bvu%2BIlRAaHuNVzDd73TEA4t%2FgietKEjPi2YvGZa45V5LuY%2BscgIQFGzWfdEdxzdV38qagN92XpS%2FNCHhDCsrfW9MbpHY7PyMLjFn9AGOqUBaP6o55%2Fb%2ByljghDOw51WEJFqDJ6ep78tSr5i4ysrxZfvWY8kzdB5aLNQca27i17qGiOLzle5WbkSVhnkW4dgSXkcNeH%2B7L7O5uVKA56wBBGHds5ZZMX0PMlCFBuw7IcW4cVzAwQBEHfwTsGqc5w4IgNMC%2FF8q2%2B%2BhP0rGoe5WiF0p9SNrhCtohbcpgMvlyDMqA5PFzOBnNIQi%2FeNoNG7JVcAWpy4&X-Amz-Signature=1218f6d82a0593e6738c5b027b397d87480d3dbece025c932135c929d9f6b52e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UNRSXGK2%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHrBMWB5aFE%2FaBjC6vAWJP2CCbPPdg%2B09utsayPWDT72AiEA5tN3MiHEACt%2FBpVDt57E5cp6ISBr2UdQuzcYDLDjFi0qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDSAb3prxmDQlbTpuCrcA3FRsvD6Jwr%2FfOXU%2FY4r9MbpriIKRVvCTyewOxHVaEPsK%2FU9PTY8lkcCJdbk3YGGqgcJqSXXXRJZMMZwl6JIhmR0tCa82%2B2st4XVXJHnz6%2F9hcIksQmC21xoXLFd0DdO9R4Nvows7zoqg2%2BSdUVgJl4gh9xklczU7MbhVK%2BHpmvSFe5aDbycnEYdKKI85neSSwQF1KcoyMon0yrMHaFENZXp6bYfVy2Ch9D2hh7a80dTpRglxtnR1FE9%2B44hBwhwvZo0z67hK%2FGfT4kNoQTSq%2FICwDfYilrnSm8OWnDiNhRXHP2vExtI7FN%2BcmE4DXve6x77U6gZyrEiACjpGZjvWhu%2F63LcH7PN9UMnbhFCy3UVKyTLRcy7OgFR0Bi2qHjm3PObE2N1u06AxnAXkgdzMNshDC6LY6iLARhMs4lHztiFzQT2W92hklBTn%2FeWjagPekP%2F8mGAfFyksTzRLqwGeU1Azj7maYQzan6Qto%2F6lbxAltNI7SPoHyr3KZGrmR%2BqceRlUUKKVTQIZ34DXW7PZMt9oLL2AsjcHSxGuot7tfWVP2B9J8FJ5q1LDVjammClh09GZ6698M7AowlDZhZazSS60rITebhg26cDox9kUrBG6JQj%2F3LO8ODIdwZBMJPDn9AGOqUBfV315N3t%2Fvj7f8xztYarpYyWQdCVPafv%2BO%2FTNV9v5ysJkgUkLw603g8cWku40j8pnJHU%2B6GcQMUXd5NKXY8rW90KWxr8RppF7Z73xAcJfG%2F5dUL%2Fi%2FWToxPYt%2BZRFwd5Z5MabK%2FSNS9gU1cQz3bHtmJrjWaCg4dsToSothwZO%2FCWH%2Bj1Qe3NL0gyHYR8WDipwIn2OoLVBmca33d43Dbq6mP1l1hF&X-Amz-Signature=8cd911af805a3dbbd77367f407b31fdda4a5ffa58929ec8bc8fc1c4def2ae767&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664GKHUPPE%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCrvxd5yAUE%2FDmnqo3QL2m9d2f4rK6e1cPyYRB9WTTZ4AIgfCCP%2FJbbr2ydUeVD2sPYTLqxnNeaUI0yj9bBqgf5LNUqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA6KZIV8twkwlkpSeircA0z6M%2FD5%2BZIELEMZS8nB9Q2HZwlQmtwIFjS5Pnfj5AIIOqRLZaGiXDjMSw9Ze%2B5bvofb%2FBAokuuFjkWVsXyCsIfxmZ8gR5PPH4djHJkC4j40FWPq%2FtrhKVf1D1qkj113BFKN%2F4km%2BVeiicVq1WKOFlFo%2FkEUaHsaipKvnWJMdOiXWxUS7p4k5Y7Y0kiTv8M1k4AEDbQUD4vFrFZxoRqKUCQCUcdrQ2j8x0%2BPLfGbUqb1xWLAKo%2Fvqxcqs0mIEPZIy7%2FhnfS0IXkIG7mrkUXhmPTgConmicQQI5WueAyZ0z7%2FHJpPxepl%2BCZRJmwK1LWKxPjBGzvVolb%2Bh6iNcAiOEj3DmaZxa06q320YgNxaRve1RjlSTP27fRdocsXUtobLHRmz9PXLuSYDT8sroMVeicINrdoXqUQC7qyMee0rO9VYA%2FSsfDtaV5HR9atZM4%2FD7km2olLrd9ckDDxR%2BFHb16bK7ldw03Vqcg3w%2BwcASax4o%2FteWzxZNUk7b%2FUFo535BBSb4V%2Bh6ukP8aAOZjhvRO2qt1OMsYmVYEiq5zrMNSd49UrOlmPvIsRjKu0s%2Ffchc4wD6E%2B6VypymtZql8GjkYcbG5x4mL904hpGTSeg1KrYiOqV%2FQlKAW6WWm%2FtMInDn9AGOqUBslHD%2BQ1QptBGu%2FDW9WTMi1L35K1FXUWqINTXWcWRxv0o1pLP%2BLXXOjdE8YRdhe07mF1lY%2B2QFan%2FEbo8ouM%2FURnd8jU9Ox%2B%2BkVFxkaDrxnB6fhLyM9IvhzMwUVqCvA4pMKM%2BFtIekMC55u004M%2FHGICp40VYdqCYOPuXpnH9fhLyiPqq6U2Ec5V2eBvCu3YsN2NMIUI84Y31fnzsuZLv7YyexpSE&X-Amz-Signature=7509186cd99bf22b53a187d79ee3369bc8cd833acc974bfec3a3ec95b179746f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666OKJGVNC%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD6eL4TeKWwqd2A6byyq80xcnJMEY9OiPCNBzTGkZ0a1gIgO7Kw%2BY3Zq3hDkP3yuimMZjtejGmHN97i20tpJzmRz8sqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPjiZYNIG3xUBOXESSrcA1hvSh3ft%2FzAHoeTz%2FyH77wEZA49X2ZtgbU6AkY5tN%2BpvqqWiHWcNuWLDE7L5hvN7D%2BAdq3M7R3gfB1tPgrGLTERkD1IYt9kemJ4qOJHy59bXEqA1jkhh2DeioJ%2FgcE1tfL4oOTfqSoBEOrnKOgA3bAJ29cSEBg5fwYjp2%2FEGE%2B9JsY9nC9BRrVpk5Ih20LUuHMgeNbGJdmJUE3d8i0aoS1z%2Fp%2FDpyr1frqEcsytQ%2BQRvZ9cZoc7Wh5Sjn%2FzYm2LxTOohcqzkK5yRjl8qO5wHEi7I81BqEVz6O55PRTu4%2FNpOvSvl0%2FA%2FLVZUA0PQTxcsegYD%2Bm37FJC%2FjeAY%2BvaVxFVwKNeWqiLNQ4dx3AkFSjOWaxsRfLh6kZTk5AeL6%2Bo9ll%2F0%2FhOgi6cApu6G1lKzSHnSnh0lrHmkF%2BFWBju%2FdTFEjTREU0gKp79SLFxQsWwIiHKs2IL8ef43uJfXhc9dluwcPrkxzdhG6X6zed%2Bjr7j6yI4FHZR3ghF8eB137ApsQqY2084JEValrON3ubsHUdYnyqM3gPoDykoyB0oATvDz0HVgGHM6j4S4FwpylkHYUBFVpVfFNu8dobXVNyBDYqGt0dpznM6EPnpdCo9i%2BLeAToVFE8C3OyHmyIjMIXGn9AGOqUBER8VfFtX4lmaKjvrqC%2FOqaSNsKK7GTl21xq5HGccAWSINirfG%2Fvg7mU5WVcX6si00067L%2FPwMmZunHWvdAvwCmUF8%2FgTcTJjNnMz8US2A%2BipLbrllLSg983zf9oAF1GRlRv%2F4pAMoPdpxEFa8A6TINxYHWJG6VBDembZBLo4bRs%2FvzwKBtafN3EF69ZXdtaWdybKIXehFfFrLOilJfAE2T9B6cVN&X-Amz-Signature=0cc585e2d02dfa752fa0428e3f1acf331716adf18e7cfeff40d2821bc5d7eee5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=75d3a0dcab8c692fbc23ab1576ccc8ad046fb997d21eb75bcdb90f64987b7b04&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=10ff32fe9dff036291e4f786cedacc97730b97085bae25d6e7207670f27a2833&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YA6HI7QR%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDq7OwAqb48Zcr7BgjDbaJATE9KwYA9lHDSlRvm%2FPvGhQIgFx0eUpCWkh74dluLkzU%2Blaz02rK3GeULa2yUaSRVF1EqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG2JO7VdAEux%2FiEZfyrcAzumEW1w2t2EgzAOxbKMaFKsgqN6t2sQBzaxVYvsYnP4VO3TP8W%2B%2BHmAGQ7dIvVHhLPuLlJdu1%2Ba7oWGtTzVi3r4JMaczerIcTwOktQvLdrN0tljmtXKNBRVR%2FEZTy0%2BwF739%2Bp9eabe9FvPDSuaEE%2B40b%2BHAe%2BM0EJBvSxL59t1jsxxmOJFjpBv25%2FDKBMy3GZLQIdpMaUYAb5rarbXfibEo5zwIiJj85zewnnYr%2F9FUNU4ylWqnIvkC4S%2FqOOnE9Bp0HGL9BAOa5FhYxOVUPHK95xl4vq6VzTK4gmVAOFr0DW66dvjZaQDC%2FK1%2FELULVgcd7hsvKjlmtT6bPRwstJbOFLiOasOxAGW9gVt61426iiDuif0AhlQAx985rS5hj2WkCY9nGyZ6m%2BybS6wIWm1PNK8N%2BFDKYQA%2FDkx1nsEOaGXag6edAUj7ebuaQXg0p867joUw7mvzJct4HEuRk1OkHhniETQReAcXXRh9AnPvVzv1qN1r7a8kimBb%2Bq21knLnRJz7q5wBhwJSnnA5vsmi9kDySEMJEKb43tybxVQ4NdRcaB5WSzR6VTzMoVqiGjcUjT7o6fS8TSWoX1TCeKpVKrCv8vUbyCqW%2FE7esOmEiLcRX63r%2FykyfE9MPnCn9AGOqUBxbJYTEvNNQaWAvPOW0GHpwV%2Bvh%2FYX6nhIs30d3CRhXMm3eZ32cyH4qzjWRtxnUzuOU5WOJwbGY7VMVsutzBagYgF3tohp6OffK0vt86J4EhLiTLXODouvwr04NKp%2FMZNzAftmaHDu7jR4otdREz%2Fg7ya3WV%2F3SvwT%2FEhgZZGIgUcN4ZDCVl5ZjlPiNhz8N2HWxhQs37hTzOPxtdESWEVvN705QWd&X-Amz-Signature=18f47d1bee40522464cc79c524cd1c5ff0c87fb813b73cbe2d465d7d701d04d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=f07e2a837b8c3799d74d04babe7cf3862290400065625f249e7f341e9715fdf0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667DYCYQVM%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDug8%2Bjy5mqIgO8%2FNiU7qvCWg%2FeR8T6cvO81d2uMRscoQIhAPyVblv63azvvyGWkOoUuL9ueFac3RKBn6ftZ%2FsNXIu1KogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwlv7o25OiggJIMiXkq3APT%2BQ2xkG07mBWFjZynTZDNqXHVMSl2k2H0POoBsi0BJvgK8oDExxu2HOONHbZQD6Ll6rBIxsesVKsNdtYP2w9ixxIwzfuPTckLCBcc2WzJkIk%2FNzoNbXzRNhP8EN9LDyocdLsrwHbIzIo4MwD%2FZ0xfqoSHlAC%2F7RSQtCOK2Pw7UkJk64S2js%2Bpcyt%2B2RWClV6i7r8ABmaDsV%2B3NISMtGdvJU9E20KwdyplE1SdOoOFKxkPaZLH8Oano0zTfmK87wnxQla4LXcSeauzn8tApWIrGfdHbf7Q78s5zBd9fu73lneO8FGPsVnLvYrbjf0T7CM1j0qnFAM7K1PY0NyfPWGXsLmD3Xld9xZb9Ms13kzjHg9P5nBPz4aP7uyfBYWjUtDkml43nFtfTc7XBxqvuwH5fJQE0Yth114qwkNmApVtIs9kREVjCqogX%2B1Pwn2sKlwmUloH0qBWyIjCcnClmqFJslR%2BkDazjBa4ks8GsEaMLDgrI%2FAGhSn5S6Zfl6VxiTWkrSa%2BIyh42LtwZB%2FV0jDCGTfcBIG2La5RWTh7a0MCCe6JoFviNiiN7Q85mwBNIgOS2yFvJ1gBbDNJ7gkBjHms95Dmi2BDGiE%2BBK8grm10iI0muxvSgMC3313INzDPxZ%2FQBjqkAdW15gq4yvOHR5ExpxDOwocnE77bQbC1BdCmQ%2B%2BWU0EgNoHe2b3jCgi4ERVwK6tPgbA%2FGp78JoET7k6qRLnBkf2l6aDD%2FAysgjtwrxlycK%2BFjtdSQ763hwBpDPSNFDwcRXmS38SNfbOpYbmhND7ulzl1Oe6O8j%2BO6s19wrK%2BcLjWxEPPIQKXlLoRGjG1yHuktcxDC%2Fri7GU5UzQLqjXcNJmWAclB&X-Amz-Signature=f1bb1cb98f0190e55a300f042469e2a6187a76dde0ac14dccb071d5d5c975ee3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S6HS5FZA%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCijvsw3Ely1xI3q5%2B2l%2Bs3uSaYJzIJC%2BASczEi%2F0EplgIhANIrpZ1GVP2fWckOAyfOYPASByw7KbFWv%2Boyx8URKR4NKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igw4mf92MTATz79YFBIq3ANaixuOa73Pig577xmqIE5iQVU%2BwWnQIMGWIaL%2FzsZQf8zVwPd%2BPhPaYNyUCwafi1Jbcw2F3zFN7Lz%2FtNWnogul5aBRRSTawMWjfvXwSwzC5pXlvbqxWnpc4%2F31HVuSk914XNRtbETyNsHrQN%2BmQpsdWGbyiphgGYxUILjjS05wPojK6XYD0qt9as%2FfID10w2iUsC0Wm7BJTRbvY8AWzQtmosEgk2v8x6HNbxLFMQFo8HGRoN5HHgspvkzsggquWGLS9sGRcA7Lm8QzTyTBUrokzwdDn7vzrvwrOtBigBpm6gDm3o7BNPWi5rCgzwdmnJh97saOncgqrIu1y2jKR1xGJocLedPNw%2Fv2vYlDZ1LjoGUW1eSzYmGgWaPiPab%2FOTvwNNRX3szQDBcdcYrgiTd58TegEjZWux02S%2BvHiZ%2Fw0b5PZhncGEBRsbUKJkt1X%2FZ9qFFRH6mlEjkMEd0e3Vy1qah1jjnXpuQextYp64n4FHcMBecSjthu%2BCakg9OWd%2BdyxBMX0NZRRCSY0uMND6mMRH1vkcrxnjCmXn8jtzrpiTHjSjSQZ98PwEJ7AvkHmkHICe4Mjd7Z1Sy6RXDWcNuJH19X%2FvN8lp6xOJEQq9vx0PJRPYmRv3J6CenFpDCYxJ%2FQBjqkARmhNEh9JPcJyTwB8oDxgTh%2F5a8NKkY%2BJXUnGtp4ZAcsmQ7GFu3WK7sDVbu0eH6WjU8VMLmOnfdFPxQ0sto2H%2BFvuOGbK2jCQvfhYMHaH34Khdq4CFfGiJrOw%2FM6OKGWADx4zvRBcnxVmXpWfwAI4ou5cpZGLWPSJPtCcaei4I4ExPtsT0PNIzJny6AOy4DKaqCDLEUZmp6%2BeUTtJid5vSEILmcb&X-Amz-Signature=578603e693ece4b6a2b2681e1651ab90d69c4b5627a5ce62bf0d1c375c1bf20d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UE3IPWUG%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDsd%2BVgd8Graeu8R159JBChwBst%2FRSWF0Q%2BxACytcA99AIgdh4z12alLajFW1aImC32Ob9Kvzk9Jo8njy8zKa0pwzkqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHYkBSxsHF7ebQNGbircA6Ay2%2BuJcgPEY7%2FU6tGE0bFS0Ed2sMEU5som%2BW1%2BLqlchRv18PFIYbV2x0L2YXNq3V7nf%2BImyVm%2BFJfEmlydgrzg6tCTB8ev%2FzNu8UHwkDd1qkYI0CAxKCSA4u%2F7C7vLPVS7pwb9hc%2FiHoWArc0YumUibRf%2BRdw1ijGqXEQMR1kg3%2BtXj%2BSWtmeBg9C3n7XAOdY%2Fs3YSawE824vz3Kcfm85xciD%2FoQpJdlv0kGnsP3r1e3qitkSW%2B27%2BNO7LHSourSz7Bgnv8rNU3V4udeWUEKHSCClyFHgtXmZK%2B0pS%2Bc8XqqsIE7nEArkQsDDPZlrY%2B8f0K0NiNTx9EOkVNDyyokNAFPnJ%2FF5sTQgCMF8IqYVfVgeExmy4sYQs604mjvHUs0w5zrOdNz7oOl1uTp4qUeXde83uvFuL%2FwyKLxmvbuMNmv6myUwaBeuop0cqF5xN2qKMEaNoab%2FMlSHTHR3RwrmwjhNxOt1DUXp2JhduFiFYNwbKYNJQVES9GSZixXx7mJ522uB3i2JJLlzh7ygBib0EANJ4yIrT9UBdHkU0UMBSOjDcZjy0bKjc5NuN8XI1hj1ZzZoyEPvKwkOLUUcAtHiZEKNKv1OGh4SBpKu8AhYGiaSNVaHbjarb80MoMIDFn9AGOqUBffvI%2Bort0vFM9qYs0dFRGmsmDG0R4p36w%2Bvi5hX4eq6dRsdazESj9WFtRcRxF5Ud7FvgK3lpDwA0zrIwZcBUrL4pjBZ2H%2FokzYjczYmHkTM1FFoFrbyRxteyvyyfwRIX1ChwAWVW8LkjjvolL9BtCOnPx1BGq8N3DkiZTABdTZymDiPyjcZsTXFF7gkBQXqsni9f7gBU87ULTquj3vgUdj%2Br42IE&X-Amz-Signature=291779d53f838637786ff00cf5372b53213c926363937b2ff629726371b72bc0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YHCFMILT%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICwAvUuTPNOsDdLFAB6%2ByNptF5LQPcBdCf76iKDQFZ04AiB16c7lmcJCkEfsTd1CmDPcbKCt2B2mJDb9E0AV%2BwqPviqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMFmKepiIE9oTktAD2KtwD2IRdjY6nMWwKjcmML9jVgNyzyvMkwl7vlgH9%2BeIZW36w%2BDxpL9BKaeCoNfNkyS%2FN4LHF%2Fsq6iDxXqLp%2FLZWWDcTMDTYRA0f8tWuyOalVNLMwAwFmjdVlbbJrWJa3ctf6QxYRI8N2w%2FvRLZ2Ro1jTTy4IaARF%2FYzGjjxV6BvF3x1oGQgJ5%2FWBDq8DpFBePOSIhMbRmyRmgm5iEP4AhlxVCMFdRvz8Qt9dLQubmPmDelhsoIM8i%2Fq9s3N8jAYyg2SvyIAI1TQalU7%2FI6HuBjvTEyTEhzCe81gcHDyYY1v65bQs%2BVcmFaaSfCdZ2WFmFprfakPpDONbNqlTuV8FWFPG5mBxYR%2B8%2BKx2kA7SrZ1%2F%2BwSI24kmtdqaBfiNt7h7xRFIuzBg8VjglPqjPNbtSdWyGxARiUgotGQwzZPTVp%2B5fsXezNpWo%2BixG8YgOJTqGbivuv%2BVjlIOz6lTxWgww%2BK0k2CtIYxajkUGbJKUHvx%2FCzbHtOr3QniKZRvuhOFj8cKkR%2BJiOhda4oSLv7IqtBfyKxDoe7%2Fdkq9ZBGed3XEoNRNRl02yBIoqJgqnEG6awSkrWq8KrHyAT6KgEXBRPa9fNFDYs2WE%2F7Bi6B%2Fmu7fVVqf%2FSKdEihwgAhCJHSAwlsOf0AY6pgFnQKhHpfC6H2xbjeZu4d%2FFj3UDuOhegceR91iQDWV3o5yWY5cb0544nPVcz%2BBZcDYCT3Ry91GN%2B8rsOK4l9McSoukHCX7zAF1j%2FMtZkvI%2BPNwagKhfCVbDPsGQX5aJ2gE9rLuHpOo70ByXNNufNmekniVdIKDdxlVnFRa3q5yn2LQCXUwImscIR9Nm3W4MlgIrdq2lAyykgCko1sI4GK9GXtkr7UOt&X-Amz-Signature=8fe2308edc8a659323b46164816f4805ff1df41d03331657385b1fefbdf6da26&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=56b3d749d90dc59f0d47099839dee9fcb66dccce0728fcf25bb77fb320cf366c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKJOP7YU%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T040300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrAHidW%2BD8yNmw6mbW3GOtcsoS7XGKDan5IF%2FoxaPooQIgP0jszNTjdBeGOh5CY%2F%2BKKTqvPqmu%2B%2B235cfmXYAi4UAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtK3%2BMpQBhX9zEk9CrcA%2FdYjLENcv8gfplWbjfgk2Ns0hXgqa24d1aIp3BC2ywGj42izBmN0T3uIZ8BGu9H1qYGy5VGOViwDQNLglcPPgNUbvw8Poj7KIdxMTT6FlYD8EkRgojtYwBpdZbxtHbFTGGlY8MfIVd43xqL4gFAjGU43Xnl0YjoT9ZtCUMqF3QvyvzmtIcxfIwKPFUEH2mp9cCGc7eO21aIYQvTbLj%2BDIg%2BpSy6bHWU5n8kTspPTAWPjesDXnvP8I3a%2F%2BnzjJGB6lnsyj7a%2FylKzQr68t%2BneIiNwvaAqBG2zNu%2BRuOUpkBapebJZk4Xzgvsc%2B7lRBucDBGaXwCPEXoEhmZhhEMFZtkaER8bBlR%2FbgVP56AgK5MWO5u789q%2B8MeQLVGZlYZ0qDKJ5U04PTdoaCEB3zrospoc4no32gZob%2FXZUDrv%2BapBKqI7ePFue8eAuE%2FHxiXtnu5VIlD%2ByVQOHQimXeGFaGRTct0U5ke8e7%2BEY4OlRrWLU7vraZ11YUFJrqakA6gVXWKJdZzKQ2O7J4FVKBMo4hUzlJKlXD4U5n5BiSrfcmriizjr2xXlgqxsRZVIxMGSMJB1m%2B5qguc8TBSd2vCK3s1Qb%2BkefS44G0qCmpugUlmXsd%2F2XrU%2BNo6aqnscMNLEn9AGOqUBOF%2Fwcr6A6a6SuaqX8pYLN5SsNadQJsRsJgo6yyhLgXCNKrY8UHlj1vP%2F2DidRBzBjWZyKrHsYBNkrGtfdfMpiVBxifd%2FgNu8vIFttWvHw5akqceCRQx2qvrtQcWok4dd2GjZPFMKrJSsZDeT0JGDGA3x9iBhMs4K%2FghwLeER%2B6r9vvbn7Yx8ZXfROn18OY1hVFLckXyMlyWbdLRgkeXwKB%2FNgpSm&X-Amz-Signature=b71cf572e6de34075fb7c880a9e3d1dca6005c69353bd25e1091dd3a9cc98f6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

