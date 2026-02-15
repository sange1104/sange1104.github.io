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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=a6b75d7a7330b326c733d21f1b5c9ddd05912e9e958f1b4f220cc919250dd756&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=99e90244e5208ed7f530b6b46ff2650ed57b4918c4deb807a0eb86a59442d23a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=092b1ae9c6d0f6203a88a0947e32e1fa3a6c34843992ef8c7af5b5de40bfeb80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=6255ea1eeec14e2e7f42973fd17fb341902ffc67bc10cd91cee83dcebb596252&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4U6RAVH%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIQDsdvJXopwICyZPJIcXQe4JsKsmGErjB0v1B3HEmztj8wIgYBO4FIqUEQYQW7HEIFFEanav1PdsaFJ82yFsvmg8RPMq%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDPFCWsTjzP6z9Xfc0yrcAxdxl4FPPMOXwF%2BV2N6e1gbwuB9xD6unn5nSJz%2BLBvYMmQEvnsJJkDdtKVhxzrpejX1f44vcY6F84ufrtR2VRs9p6405itKyO4Y7ZuPN3VBNYNU12si0HFj4SjsY%2Fs94faw4ay9Tn0N3cYq8yNL%2BVdYmYlCCY1JvA9v%2Ficq8qEnifaLH%2B%2FbEUxYD1haViGGWFztSDaHZOHYTu%2F1F2iDuqqIOUZruiLHVW%2F34H6n%2BLpEUGlR4nEIEmGgCUOPiHFRCN46dEpT%2BNoA78WroaPUyjCsdL0MhlX2WFLjo%2Fu%2FNEK2YP5MaZ7i6tJP0rPPO%2By3cf8GUwYmHaAPLOR9TrdG0HvPmZb4jNfuRQ6JtUMnRM4RJJHlfcJPDNEzVXwyUyGu0JozsM1PXeMI0laPJel5ncoQvRJuklRdqdKcdqMwNbieQubGEm8uaYPmp3rotGiXjt5827a%2FUH1OFyqRAcH%2BdpeT8DgqysQ5ZRvQxWKWW6eCrlORGcwlK8dnZvyp3O49K4n6nbl%2BLPK7DaPjyf8zbnY%2Bo47JxeWBJYOM3Tc57tODZGrGEcB7K3cdkelcSpbHiwR%2F%2BUWTIz9RZid6VE%2FX0LpgVu%2BVVI7lS6vaqiH2pVtE7RD%2BmehhIMR%2Fsia2QMJKexMwGOqUBAT%2B4rfoLsPfn6IEVMfrRWo9eJzxmgzWHjV3WRH8Dw21S5D3xrtYCf2Wtf71HGACZPaqcQc5H0An90a3YXMtyvDG80I%2FJpYP3QT5fxeF%2FuDyWbnGB07gKhDYyWsurttJsmY4aVRqlhEvRU4ZCtWFQ5IwZwdIdAeVodnzQ8d1LxFO2ep2R2KA8BoCfcgKRWmfEuA4g09k%2BZhgKCw9C%2BguTNCbP8wmb&X-Amz-Signature=d7f0ed44569c71410a587d7e2466bc309d6f684d483150dad86520e398c1b132&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666N5NE5TI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032220Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIQCEuwj05mH3PwY2TTOWMeY7eOdyx2Zl%2Fne6Alj1ydWxwwIgDufuTyB3Ko7cG7CBwKwvMTMRpoRVH1YduoNjRfP1VxEq%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDN7e8PITm8GGBbtYHSrcA%2FVsYOFmqeTSKGzRvE%2FIkoH036MESQ0Kfh0Nj%2FtBmMWmoS3BwR2nwztLMg0ZBzVvc7kZSkZHFAnTxY4C81xLehd34ySvt%2BOX9%2FbQSQIenX7r%2FpRqh4ceF44j8i6YQ%2Fzf6zipgPNScGCjDhO1gaOJUNW0KnGf0gwshCf02SGwblh2nvQ4P5XYOc2h72XgIe62emuAKz7ZNXqMf19zbHhqGm97XQmGnR8tskd8Ebg2XWAcSHF6HB0t8Cr3reqqjDNxMBjfkfgAfrAWzxWyxB%2FVWyokZPsKkj%2F0qSMp4IoXFcBHrg%2Bb3WRCxxs9XHJa18ltr%2FJGZVspnnHSN9BxBX6vLLDTZzJdg6zLZR5GSBlI9qPd1n6KFJk2j2xtmlujwjUQ0PtMGlKjZX%2FBbcSGaXtNDyttuga3SEUGcsFnir90Nn3jsiXlVg54W0OCF%2BEwVchTorxwe9w2lhu2pbOSEntKbNygM3dVI9XB3KiJtK%2BAwhO13XMUe2nXItsKEWuQuxYuQ4v3AnNUbG87LwhOV6s2r6tAz%2FrQqD1Bqd%2FyFIfaFfCaGCza%2BvOedLHW%2B06RaRtffACEaTZRKMhaod8LbuY2LiiLDxRlWrKG62A5xQh7EOheFQCMHYb%2F2x73sWcuMKKexMwGOqUBgQ11anSU%2Be3C0YRKSuY6wA%2FM3mv1zeq97fsLUhtJUyhb0l1BHHU%2FAPWB2B%2BYG7D44iBMv942p14jjhiLCMnNGCc%2BG4OR2f0vSPO8MiMXmNmPa7TxNe7SCaAMYQR1aoyX0g6JYHmxrPVzkR%2BvhHJqwSnOz%2Fuf6ceFNKzsyWiEI0D2lWeMh3sHnzjIudID3TQpq883lKY0PmU9MvY0odFfZEBg9tMv&X-Amz-Signature=ddc1a9cd6b8942a2945ad8cc7398980f478faaae887c9247597cab677e43b96f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VMIR2UA7%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032222Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJIMEYCIQChzrmU7D2s%2BJSUuZ98Z5Nh0DULKnD7V%2FDZLBjmVg67awIhAMnMrtK4W9TwKx7hoLtAKQnjc6ev1YmgFlhDM0dfMMnRKv8DCBEQABoMNjM3NDIzMTgzODA1IgwS8pc5lhco7QdT46kq3AMDzQu9oRc3tVWomCvUiaxkjr8YJiJ3%2BTm0qv0tSp%2Bwxwb8cHBI0kbk89u%2BoponEZLmk5UrFggbCxZFXfPK%2F%2FMOnZyg5B0ASltNAHxCww4RpA806NwSgGPrZpSY0plfwtsdPysuX%2Fiyc4hZU2A%2FFepM5IteKlruMZZam%2By0vfxUc7%2Bysheku4Qa2x5vfegAOcOsXZX%2BybTi6LEK5RdoxrLIkbHVvMgyI8qJT0%2FtL462JU97r%2B9BfyrjC1PZHAP3QaSeWtnuE7PJtSvGmf1rZkINfoNFqI2VVaK5srogXwR9HDzTU4sVxImOQclJp16rNVVAHdW2RxOgyzJj3jNEIii2jPSyVAo5eXgGYdJxhLsjNB77xtuKrs8dUcmZSWEoK2qjbo43x13xqk4weMyzQTp12l44kHFdCh9d%2FCLWmmYLb3bLftXeqAcRuaXJ2YwlQWbhfRMxCwcRizuaT%2FWrBVnBsHzHHf8uZU73QMzqwxF0u5bMi4rr8XB74W4XsP8nNiwidqGnF9gk65giI5kXqfL56pwuZ1pz1925ueqkFsFuOT2Q10efMxGaZc5HBQRw%2FTIQ89gAzVAASTG6hQ%2Buq8YHviynUd6FebRP9EP9MB3FawVm2C4VVanLPDId6zDansTMBjqkATMmlYmAKRVx41HbJ5dG3ZQ87ByAzog9Lr3mf5svLmWHLW1k7KLCzVFhRvE%2BcaAJjCEqpr7PJRnjVDu%2BIh8O3PNvxySv7V5byJk9LKNR%2BEvJYpHLTesaiVyVW2kUrC4D5LluxuOX8v8MsGs4nxA7%2Fkjgwfrnybtv%2BXlnTqo1QWiq2c8KIGhmNKheGgM3tm9VliFOE1UXoqCI7knV03WEh0HTXiN5&X-Amz-Signature=6ab9bb1510261245a184927182de71b0cdbfe68b7b871b70cf9b838bbc707934&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46632PD4NZA%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032222Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJGMEQCIGUipBKQr3%2F5%2Bpl77TbGKRlRA68gY%2FsA%2F9iq2WJFWMlEAiBKE%2FD3m0lUJk78uTJNyVgFu11CI6l3WOVhtqJE%2FR6lSir%2FAwgREAAaDDYzNzQyMzE4MzgwNSIMz%2BGIRgkxjRtpx0MLKtwDUgrXblFjOCI%2BcpLIlYpMcvYdVg0E6VRCXxN1zayYlO4sCkAlyWkTOanbGsBuMV4rBiZFi5HBz3v%2FwX26dxLlGwEN7TK5k7lRhn4se%2BCLAGHciBaNeoRz3mQ%2FQrBaJnYY7kLSg1XHRf%2BqGZAQdQuolXJ0LCQeXPj%2Bn%2FzCdooyrzj8wy1TW4xQ2wn617N1YZk%2Bx0DrIv5tfQ7%2BfUpzs%2F3n%2FfWY5SE9UNPj8ne4bJNYygU4UCEHSRlV9qylBo90G4waWiIHssOJ0ULeCZa4bmY4OJoPvuwI%2BCAiYCRvt1cLgifGlxeB2%2BLDjVZTYYwwtWMZFf4nc2vH96mNDyutfE1JWGhrntUDPQt21T%2BssflvQEat66nHL50d15hp7mYt2QadlSyp3eWmiqCVIiU0nU9MWkfaJK1DcSr1F9qOxV4qLoTqYelWTp7P7ZwU%2BlMgGdU40du8udUkn8gJtFeIi%2FiHUVYitAFV7CZD3n1nwqOMlADWq9egVCvN%2BtEx38oRNYr4F9KyK%2BUlRVTyDb37J1jOutb45JjIEpllY34Yx5D9XTAhsC3O8AuOE17GP32KWB8hYa%2B%2FAxM7%2FRbR9F2uha7bND7%2FUIF6NhXfQFMMVN8kRTlfOlKNBWSATOQD8fowgJ%2FEzAY6pgHc9LGySGSDmvDauPVGP3qOtqgihxalYJwPi8xSDI04x9unLkqYNoqPrIBixy3bLY0uN%2FxOcslMpWKJhREz3mOUPBTb94YwkoDzjtkcahDrWV238AgjU%2Fljd4D%2BKlZ3p4JjVzSLf%2FGZIZ8junnbYY9HuVjQx7329GoU5twTwmwW6ed0K0Cr1rP7gHQquoj4qLZqB8NH1%2BXGf%2F13om4MNl1k2MCn3HPU&X-Amz-Signature=0741ececb6b57f56c158b4f731f2e7fbac9487da0fcd188ed5842b7f24c6ce1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=d3f0fe9f557641ddc3bd0be39eb8a41c30e53ca2544540cb51ef6bbcdf3be31e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032155Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=2c043626572e7cd190c92d37a2a495e77c21539c88a3ea08db40064be0a09b94&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UT2CXOHV%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032228Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJGMEQCIAzaqrzy4lWuxQhiQTcY%2BWPAiLgrh%2BpOG%2FOTsWawDBVEAiBjOBtO23KS%2F%2BHjzllwBbvglb%2FPLUHauA4qqF55gwpXhSr%2FAwgREAAaDDYzNzQyMzE4MzgwNSIMAQc6%2ByUoSFbpmbrPKtwD7BwwWgFqYpbPLH28fNNEGbg%2FTmbBdkQdGzH%2Bd5wL1AjAGT4qnlRCUJyiO7vw%2BCjGJAJpen713vd0PLrt2t9rHsMxUQTxZZlVRskNYhPtEVegOKCt7VtGw6HIKzoE6bKP%2F5%2FDumWl7q5QOAusbj16mgdp0pYVE3WDie31wDSlgaPB2zdTXmu8xgzu6U73Ten28%2FPoKJGjx8%2BKIsRXnwXbZw2qrTKGl1yRdS5jB5%2FGAui21dywAvrdxtLTRzOnYMgi47Nghldh3NG9Lga%2BrAt2%2F8%2FyuFypvqFWWBwTY7e5Kb8BT%2B6XZyAZ5DVdvG6ft6%2BYh2WJdn88etLQZuGELOwnrZQp8BMYJkBa5ChSRVAKR7ros6rHX06lZzUIG26q9imF5ieIuZRdf9pq47AHHV3e3bvS1v04%2Foh%2FukVmRc10RMPSPBPBF5QLtLa7HuLX2pmi4bsovwcwMK8jp%2FwMDgeKQcz08LRbarUz3uHY73n5y3ZKT13vWb76GspNNSO9i4B5Dm%2BqViZBzswrW%2FXwbXshkItRme8pqeeSxzgrzFwU22i4PqwwulMD9%2BISfSIc%2FDHIeAxiYYVgpRx2275We6mreNBxtIg1MbNwEyoc3%2FW5R0QIK1XGyN6NYnjyA9Awu57EzAY6pgFmr9J2%2FQnUeywLfVS78rL%2BiR4FvZYZ71evr55A4kIqNI9qTKDXyBwnzt0OwXVn%2FlsSKyHe9cY3RIsKgyBuKyYgVPOseGdB%2FtDAEz6kM6HvOhgX9d7x3VTgK799vTrX1kXxZjqJkDJAuM5COvWa4vuhSiN2RPG3iFRYPSFR2fBMEwkB9Kp2TNc3hfDfagPbFyVV3sBpFnbrHw7bVJY2%2FliKKdaPYTdl&X-Amz-Signature=b363663729144270d934b7720d80cec9edf09b8db81b2ea5e7c976090b07b9be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032155Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=85ab2cb7c3af20d2e5460c207a7efea649706986fa7662c4b28f95a261b77a57&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642CLBQ73%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032229Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJGMEQCIGHni8E8zkeBGNu%2FaTTp5ILAy8YMlrhHhoYIj7uMqCfFAiAICoRLUTFYCUahUsSatx0nDIqt8%2BMqWDzeNZe3mUNK0yr%2FAwgREAAaDDYzNzQyMzE4MzgwNSIM%2FNHLLlSJjIbScRdHKtwD73LjXC81t8GIKlEw%2BaW4cP6c0qKp%2Fo%2BkzmiUu7OTBGPcShJBfl1muOv1H36Y7o3hPOfDWsSs7%2B4TJZYj9qzpHPS3TGT9Sc9oxODiDZhZ2bx6WuWHCjVDw4EAs3tDP1nlI6qbQJOnvymFaZtJw6XeSLpPAl8V4YFFIuBVCsHw%2BRzLTBHPpQngnLY86PTSWzBc44ebM7i3LXxttjLJdZ8pa3FV8fZ6s3yXrlz0FkHsKlOv1gXR2IzllTrDGOyOVswnt8k0WbpRx9QLEMpVN5S5Ze78HhhXF3mRLmWZs4W%2Fj2TzSzu0Za%2FqfPi82gN5uU1nKpaxN8f4GQLb%2BVc5AUVDHP1idLFgywrHSfEU8xOTPkZj1De2aShkNKmxHRBpaEiohG4XgvLjPQZUZaT9p2CwYWcPYp2xoDS6KC9ar%2BPveu83qOqn3Au3e5l4LYWzGhx3pzdGzSicfx1yKX7IKLbNqeEYkttK8mToVpjFMoOXx7ZtzjmiJRaYM%2BK%2FGJGTkWjz2FjsoSgkJUUOb2bmYVYUAprEV3UqzflbfhX7%2Bxmmw42riOQ%2FmlN%2BVghsldTeWYrxswfCqIIuMINviCmTMMrXrdPFt71CAtziifR1CbuMjMH4qXhYE8EHjjNTneEw1Z7EzAY6pgH8a5wV9N04zgZsKUWkpB7CYNPetYX8doGTlcx61lFUDmKzsJcmnofTUJ%2BSp%2By30R%2FEWMvPoS6Sg1hZdRKqk3zcIecrxFggbiXukNKSqVCXX%2FWsalztx4drFQ06M9LDlGBblJY85L9BM3QcAJe%2FSiXLOiDWS%2Bx8u4YQPQ3CJQjFgESBtkNAtfhHBvYQoVJL%2F19yyIoOcX6vdVT3u7SpdkiAS1fBVct4&X-Amz-Signature=9742e72f61dc822f6cd817a4bc148168aa16653ab5c21de54068079c5107c0f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634XH4A3Q%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIQCsG3R2AweUsOMV2C8A6MnNT5ca5hJwEdfzxDSBZbNLKwIgQ94%2FmjG5Vb2Xv0CbJNejYeilMWWb3siQqQiR%2BT2Y4GAq%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNSJZKQhLhJAMSjytyrcA7K48CG%2Bo5hBni1DqS1BlqrSQAVxSiLGGHgs14XUgJWaJM1bfmHC5L8hUnokRffhqNyuvMKDVgbKfhUj01aWJuZVMYpGEcoWG%2BwPfgWlBG32D7mHTESmAJ7R7HtXmel6%2FCkclaTLu3KwAv8EDabRSHbrfm7WXTxqFkh0uOZ%2BSzSLPRVUiX0Mo40c0aQFk%2Bt9LiBxOoN1Iz%2F7Jzs5KstVnR0g9jr6gHSTI%2ByEVSFG5lf%2BIlMQtsDQRMU371FK4FYrZi2p6GeUXhw3Ll8YSShmA3ysMcZguE4sifXrp1sBWl%2BiQ8W2%2FJOvc5v%2BRuHvB2tPfL1EzIvoeuBrgb2qjB68PrTBfa2kUTMdQR884aCdzBjMl3qE9ihycPH24F2R4peFS%2BPERYrhP48mELEyJTufHo3eJeOZ2yNCLtBpUFuiNnhWt%2Bn7AVZD1Ek4Z3TZGygGMmn1x12cxNaUpyBy0YS%2BiRbZASerf2mERXNuj0u6Av3uyNyzXCUICWgR74yk05T8bbWaoXLBmaFoKAjZUjeNlrK1v15pjQElwyVR5aRKV%2FsRYHz0G613dtypXIhofjvq4uTQNELGTIDeYU0O74TXqdgAohiUEhGnoEJaIMdX75UiaFSvkXWxYFZ%2FSrQHMISexMwGOqUBZnSlOEoizXZIBCsOJK6Nc1ZDfDuH%2BKRdPhHhRaS7P2clInalqQNguDChxeyEq8UWE1nlZQKOWe3266TV4fiX2qQD7gmwec5MHDHTRmIgKjNhYwrlZKQSmCS1%2BvVwDH4yrZVh8FjnXqSKLUFiXL%2FbD1LHX6wZK%2FKM98mvxhUkFWPmiEYNYMwrtRoJCZZnP5gXOf1kofFJYOpTdon6OAM3jhrL8sKw&X-Amz-Signature=63f2f53d305e57935f82c3336680f40238b41d99cd098c685981cca845ee4fc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UT2CXOHV%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJGMEQCIAzaqrzy4lWuxQhiQTcY%2BWPAiLgrh%2BpOG%2FOTsWawDBVEAiBjOBtO23KS%2F%2BHjzllwBbvglb%2FPLUHauA4qqF55gwpXhSr%2FAwgREAAaDDYzNzQyMzE4MzgwNSIMAQc6%2ByUoSFbpmbrPKtwD7BwwWgFqYpbPLH28fNNEGbg%2FTmbBdkQdGzH%2Bd5wL1AjAGT4qnlRCUJyiO7vw%2BCjGJAJpen713vd0PLrt2t9rHsMxUQTxZZlVRskNYhPtEVegOKCt7VtGw6HIKzoE6bKP%2F5%2FDumWl7q5QOAusbj16mgdp0pYVE3WDie31wDSlgaPB2zdTXmu8xgzu6U73Ten28%2FPoKJGjx8%2BKIsRXnwXbZw2qrTKGl1yRdS5jB5%2FGAui21dywAvrdxtLTRzOnYMgi47Nghldh3NG9Lga%2BrAt2%2F8%2FyuFypvqFWWBwTY7e5Kb8BT%2B6XZyAZ5DVdvG6ft6%2BYh2WJdn88etLQZuGELOwnrZQp8BMYJkBa5ChSRVAKR7ros6rHX06lZzUIG26q9imF5ieIuZRdf9pq47AHHV3e3bvS1v04%2Foh%2FukVmRc10RMPSPBPBF5QLtLa7HuLX2pmi4bsovwcwMK8jp%2FwMDgeKQcz08LRbarUz3uHY73n5y3ZKT13vWb76GspNNSO9i4B5Dm%2BqViZBzswrW%2FXwbXshkItRme8pqeeSxzgrzFwU22i4PqwwulMD9%2BISfSIc%2FDHIeAxiYYVgpRx2275We6mreNBxtIg1MbNwEyoc3%2FW5R0QIK1XGyN6NYnjyA9Awu57EzAY6pgFmr9J2%2FQnUeywLfVS78rL%2BiR4FvZYZ71evr55A4kIqNI9qTKDXyBwnzt0OwXVn%2FlsSKyHe9cY3RIsKgyBuKyYgVPOseGdB%2FtDAEz6kM6HvOhgX9d7x3VTgK799vTrX1kXxZjqJkDJAuM5COvWa4vuhSiN2RPG3iFRYPSFR2fBMEwkB9Kp2TNc3hfDfagPbFyVV3sBpFnbrHw7bVJY2%2FliKKdaPYTdl&X-Amz-Signature=faf4507b45b99a9df240cf7499fd734070b895059d9b10b3428083e789f08dc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46633KWWXDD%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGLEvYjCyAaK65DC3kGWnoZQf6Q6UCtTnCI91d%2FATnE7AiEA1cYi2o9t8P7kIPtYXUqGSoSHEnWZDIYX6Gvh%2F0tOPYQq%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDFRb1ttot%2BkqTsGVGCrcA4p0qejX%2FxMN3L67xVHcptOU2Afm9nELcPMM5jYiqrPfZ3%2BMM6CbLYzAuq%2FNQAKyp5EMKswSu%2BeN5mlfFf56xDBwbxpbGd%2BJFmm2HTb10R2vt729FoTKbDGMyQ9XrurPz9pAM8lnbuYyXr18RrLlVqk8ptNWzOiaC5hP3Ei08M2VtsIXocprA820nXFzp4FDDmD41lmODA3k7uTfcUSbGDkKh6E4%2BIvjof2dsTwVPadlhq97%2FHawoDh2qyUMN8Vlnad%2BWQJw%2BsawBUSVLRCkrocj6Jsss0BSBibCQdDdFHktBA4oPFOS5LRIAjpXQZIqKhw5kCXQwHX%2FE0TXoJlvZxR3z8SVr%2B0Bj59I1Za%2BAjelvXlfIEOc8J0Wpe%2FswfP1DY%2FCot9d6G5VsP%2F%2FZxmqqwyfijK0HGEI6wWyR1kNnpvS7Hv6jpeLUt8Pyl5qXjdc6efl8YF2Xt85Wplo7yynS7Jq3QyreLZJUug5FpRX4Xu8cH32foRREFMiLuPjiA6Blz%2BeKSZkdqsUbNi6v%2BzEuCSGwpobK4EL2%2FkGdiKBnNsFa0k9AFKuRezgRFusiMENaIvJcKKQe1SWGqviEkshsuak6ZbhglTinufWM%2BmrTcnq772feqISeOld9JkmMICfxMwGOqUBbv5lfGyJ8c5sGu1FyMvtt3Wz0t3f%2FEPsKaDk04Pw4jNpMr48unm9r2mif6ePRtqbTwaKNO16tUQ4euX%2FeLa106LV8rBYG2MIW8li04%2B%2BYWkhDwczz%2F2GVRYRW3c8PmlRaGj7XIe1fzyF8ZaWRZb2A9QvsdqTKPFxe5KCEKY0nFJLr%2FXWdJS%2FjGP8CgGYezTDd7ipWmnMcEXStD8bUFQz5gzXoQh9&X-Amz-Signature=883ef7f654c9d227b7408531421757e0d9c6aada92d698de1139f8fc078bfe2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032155Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=d2a60ace720d477d6986769c07bf38963fdc07f186461a6d380b980266ffacba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RBZDEXOI%2F20260215%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260215T032155Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEgaCXVzLXdlc3QtMiJHMEUCIGL4XnDQPPp7C4qjLP9%2F3y%2F9%2F17YUj25O8Ld5qaXh4rZAiEAqIxtHOLHc%2F3eXFdQ7WjzUInGaq%2B%2BEwc7iAKJ5D4iqs4q%2FwMIERAAGgw2Mzc0MjMxODM4MDUiDNVV9Z3TWZOGOxAZPSrcA8BPtSauijsbJPVRnpmQAQQrvbbC8Ga2J%2BTV%2BBTf%2Bo4zA1jQ7Gn9KcSG59KgkVBXjCmS2vaqKwmzsFvv8yZAMO2aK6CjIoj0Gz%2B%2FGRVohAXQ%2BkZ5pmkb5tdwoXvTVkI7LLeuYyZHqn8OrsPJCldALH4kkWC%2BWZBkuBbIi1m%2FKBO29Y2S%2BjrRjDQ2diHwRnvIFvgQ%2FC5gxWzj3XmDrtOO6WPYF0w2reDT8R1SFCS%2F0NnS%2FkrWOObB6qeiNAthqDlg6jVnqZzQ73nP2USkqLVhOyydSSNft0EW8i458qUQoCBbJAzoPD50ZO4%2BmTx1YTkVZD49o%2BDRRSWcijRFMC3gvfUH%2FBMLO8pGyCLtIjrDxmn%2F7pHG8M7166LhuKb44XVUedkF58FlKKTQ%2FJBcLduPLcPMrqBoc0wsWCoiOpGWBgokgFCd4N6NyYMh6iOOPlrNrJWRwCnGP0WTrHAPT12t3PCub7IkC%2FmPtEEt39youMc2eVE6nMpoSNPZCbRhCV8fEksNSCoexP9k0lOAozhe0w8yuhqRO%2BGSndoYXWo5IDVGjsS6xwpwmtCHkoneNsoPDzvw7t5py6jv5XBHl%2FyWBmGty3pnzXa0FhoAfyTArxqbYA%2FCsSPfmoxe67QLMJqexMwGOqUBSCcFXXc6AsrxqyH6OAcj26i%2FpRi0N8n%2FaJkEZ%2B48LiTk8OWLt7CJXn0J47AgjImiDAuHiXN7Tm3%2BAvPSGT4dq1klAubV5EVOy1lsyhP7c56hPrazUcajMIwOa2iJLJ54n%2FbDyvRbJogv4lG%2FvKoEbh1lOI%2BqIIes%2BmxGg8muSdszKOSAqS2ONyfpJ156Y8YfVSUlT3nCHSKCoz5PY2A28UXSJ%2FPt&X-Amz-Signature=a500696998caa4497007149e15b11838aa20daec672b30f46e3cf3601d41253f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

