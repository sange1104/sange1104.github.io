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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=bf0afb4ca3db98dd86e01dd4676078a56d9cc0466eab2d07ce017adce506d283&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=63461caa8d9c930fdab414942f67eca1e195d97a79075e713e5af06aaedd12a3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=fa07dc51330201c4986697b20b83f2a54468d51255d97f91b9d33fb263518c2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=6382cad77ce39663d8e37977e0f7191d58494054edd89a3c5b1c07bffa57c317&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QOEGN7PF%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025427Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHkhJdcpOZgW94LVDCI%2F2y19wv2nckAGZOdI1d9xznUtAiAVzlZTAB%2Bk0QqS8Apkta3ShmwgFwkfLugW4ifEiCi5byqIBAjC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMO2w1XkAfYKl69kSIKtwDietE5gBUOEiS%2FvADGVPFTfYWUxh%2FFVDO%2B8ZD%2BcsuFjlWaQ4L4oaKPu6EkZLmBm%2Bt6vNKXynQM6eLkXBpomXqswiLqn55MMj5JylndrcBT5pN%2BMdVzU8piCRUbcWWQFKy5htPD17LJXGMSdPFTmH%2BXzsxqHGjMKBtSFRikYg6MXyM%2BODsc0SIXqGAqsFaHubPzAf%2FLh0%2Fpvl8PjOrcfV2fj7dzoT86gJ%2FsdCJ9FM7Xb%2Ff5CeqHWeQ3zjHQ1viS1B%2Bt1BRGib3zek4%2BFhA2je6MFhRG%2FdlWawjA1kJ80yElohoc2feRvZYZuMyrxNUhH8vo1onZaKH5o%2BLp%2B%2FL5hNCI%2FKyPaOY8L6CSLPXhY0eBObzL0IgYQjh5tpfLCyBJqHHx4fZQiwOmAoiJIAhlIyPxoB74HBLj2%2BR7zjWnrJpqnHHy%2BSI%2B3jicJ8FGkCOx7ZhpbYNqpz9y7NBDSvrjOPjBHn2TyoXpy95mlW6H%2BHoyHsvMnlocJ42H6MKqrVGx4hvp%2FxogxHrSoHpe5n812B3D4juEGIuHYe7BwUYzOxr%2FWBd70OY8j3J8ERHaFcqFR8XUvAOXugFHENmQvl%2FdtNRxJa%2Ff7hYPZMsnd%2BKmYTcpsp48Ow1g8SQXVx0tZUwza%2BjzQY6pgEm6F%2BIfhtm%2FGzjRvekBm5ZO0LRrs645xpEv28o2a7FRVY6MToUqcLQE9DwDnHWKm0Ril7dL4bleq0Okzoi84tgnOH4g2202ZDeIuJIdX769ViaGIzgrPW2MBU7PgSKlugH9Acj%2B96sjaTCLfjcm544Q3lvxLIoxtFPCM6sN8Cs6doJ4%2Fg8V%2FuL8QLmtpepgvIWFwFAKZ3%2BLW2nKL2QV%2B0wCEGRqClY&X-Amz-Signature=cbb698806fa2d59da8d3fb40e3d0b11fcdeb636e66aa70a918b4395176af9e3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YJZHC2AM%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025437Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGZpI8ThS5mm59Lvirv4jnMI76z%2Fx3q4LTwfvpPlOWzeAiEAvbALDIYlf6R4G%2B8NzynPD6p1Q2ZpPwS%2F9fv9i1IFTlYqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP1UwwEyJ5UEfzYQTyrcAxnIfaI8xaTusY6TtH9rdAr6MHUURd%2BfSWZb1k0N2p1hrA%2F0P%2FiQvBKDhycwA303Yrn9vcJAZBO1hi6v56JzDvIy7rcgvhLGpGTgYi732%2BqwJTjSOyUBF%2F%2FsbJc5%2BLBk7tYcF0II%2F%2BAbs%2BJuhscTzT%2FvB6TOzgHgTFfr01QeLK1lPwYATqkLWjwwiajRphilVC%2FYkryp%2Beuy%2FX6FsEJxc13wNkpgXtcN54phib96XXajrWYldd%2BsX%2FW3SDvD9haVfHLoX1AAc%2Fw0zRv1w3TylxS3ekpglmcop59VIx9SEFf9vpspN40uxH%2FaHxZPb7uIzy6HoArZrKZAUsCVRAnzDiqEk1U4U%2F%2Fwz6ZAPIuIy%2Bqc2bxO8VMvHUhp6wrzsUxbYw8gwXnFogu8s8TPNY%2FXe%2BENHIcmEbyyy6A9sYHl60wsrqMTuaSCM%2Be7fIzDIIm83cvRPYe0dpWGDAbqT%2FgYJPSxgE8FYDahx9O60WJZUI2G1zScLwXDuebqSYctB%2Fa63aEAt7KsaSX9plxp7Z2xtfJ1wOfzaRbbpacM1kKeajpjSDOX6Z4AfyxzglKactUQf8DocyuY0JPeFTeZMoHw8lyUHqOO73ODNhuK9%2BYar8s1iaH7UDD40VJjtIooMJfeo80GOqUBi8bjFsG9TLE4IH%2Fp3mowyhBMQWVpdfI6JGGf5hUGSEGr1%2FBj2u4SVQU3yIpDvLG4JKrkhzfMQ5mz5I8ns8pSrNDrDeQUfXhMaNHKrmv39o9wBJmiH8afEW2NwKL8m5Ok8VdFLduMNxUgKC03SZPoWsDQDiVvpOl5tXWGWdq5apmBH%2Bj912%2F4z%2FvWse%2F3E7qyvBa8fy%2FhauhxPJjqTq1Q3iTiLqwV&X-Amz-Signature=8891b597c72e438f079db7f40b52e3c30fa0dde78025c296171040cf8e11fe62&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664D2IRRT7%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025437Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC2qYHcjOgPw2jsr9XOMdbMh96gjE2cvU236Z%2F8guQWQAIgDBN30XBMuC6IHHsbwEbUNn6tBUjIeLWgrVPmsJSsRFkqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBR%2Ba2mlmoqSV6kwISrcA9gHRFC1q0nKUE6ePllZQI%2BNWUO0jBcObpCjiKa8AwWB4%2B6o5Gu0BU7zeZWpQnxgttTZiW44KqnVYBJQw5Dsm%2FGXSdkchFP74l%2BWhcJ0nl0pRZu4b%2Bs7CZALnnVF184Jci5EjAZHOfAe5r%2B5DM0NtfPVxkd2W5VJkiM822JxE00UF5q%2BAeF61b6vfdOG5zigdtUqxugMrt2ZtCpmZo%2BfaFaW%2FbStsLGCRsdLt3pobKHB1ra3w%2BDfG6uFRrJA9gi9or0V5pDUa4mnzBeXmV%2FAW0o%2B8atTaYLgozjU5fIXkJNVyvAifpigcIwAiFZyvothiiWep%2Flddm%2BKi1RBgjvZRG05CPoGIoBTH%2Busfeg1SWJqopKNkY1lf1%2BqOS6ZOyV9Z4GunZfguLGcJEj%2FWg3kotTmRdyakIFepz9x46KbXqGBRTAlGR8rYKLxY0X27WRL5ny17CIx1P%2FYXok6muj2V54UEcwAlIviYSUee%2Fzb8PGsFWHqgKMHjLqhhlvhl1ZE0bXqUw2PtPs%2BFs2uxMRAtompv8hx6e0t%2F5AEVQbcLtk%2BJhzZyNAB2px9FFx7zLfJGCYsE5AOcDgwGGP2T4QwR14fMgj2RhxaDK7%2B%2F2qfNsNI96E4%2FjcllnfakNFdMI7fo80GOqUBD%2BJQh5y3o8cCRVjHgo8rI%2FrY3UjqYlgyvc4%2F5bsXrpUFs8W9UI9n5J8VPW%2FnGBkqLOzR1aeI4Q2%2FQpnU16fikHelmgF75a%2Fs5irT3j8rSq1%2BmJJmTKp%2F%2F98BzrhylY9f0j9ia0LHUbkyRjpTkgXIhQse3PGPhGXdqT%2BpoHg3%2BEfV1IcaH4Vok9iCEvzesMTs1Ik2x9Bk4385Igc8i%2Bg81%2BFy41sR&X-Amz-Signature=1a4b15af2ec06f395bade1b344baac3399ebddb36cd01b843af77e5d1c43e462&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46647IUBUL7%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025438Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICPQYSTp3m%2B0CsJQj9wBeucLes%2BuY36nPF5oGgHGy8RYAiEAgsLredF05VrtqcktqyxBtyMty7dnK28eyKnGWo4EbJwqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDN7dsECj5RjCb6PhryrcAy8uZaB1FIM192RV1RIm1jTUw%2F7dGpQf%2Bs%2FaKDpPGZzqE8fk44J1SrlOLhYtIFDutb6TXEnuNXzWyjWUi14qVGhC%2F4GpYxA81qo6PUdbNFRQlO8albFiFXaXCNtyyb99QEq4EzcLTiBmutB20XfiW2Lb%2BAj993F2JROSBqnSgb1DV08QdZRBNq8DQL2G6FxA3IRebMlAxNiez4VtGQAkyhb34Fi3LkVOnRqWpazTBmL6prGQ8QVJwkdGSoNf2vXWKMNBbYFxq3xQDDkd%2F%2BZh2se1i7YCzLmcCLV%2BTHrKKIAQaQgCz8Q0y51t36UZvI0cHfV9qEyyMXb%2BGARTQ%2BMzzPAw3JuRsFnGy0T5HgPsHvsMc2h4eMlhTXNCTJhRTK1vYdo3uyU6i8tOrjTdLiOzDHOIjy7kAShAaJUF151thDTWbvSnJBFfUrAbgsd%2BCC9h6PZjo%2BRLHw%2Fsb7PD2%2BovK0DGe8p92k9oSEZmhk2qCmRhaJvmNSyuZY2jO%2B370yjck29Eqn3Mmo3VMbQwuFVhrWGxO4MfQUl50mTGBycyUq%2FfVEHx1rUqNK2%2BUqK3FRsAU8aGzTO3%2Bm5%2F%2Bt5oDzO9VzZ8sd5GVkxMLzmNAoqzV0HdePyLweZMLIaQn3%2FOMNbeo80GOqUB%2FSzz%2FuM2VUoxSZQUpgnsYIvIzzc8OmWMSUl1aZ4h8SDm3ftrnZlprrpwOAen%2BnUrMc9GINrkh1%2BEHU8qytR1VDED7VQuLpHbs6ICHZXNO2HkoqTUquq5SY4Zyk4T3Py8aGV4DFWx0qnaWx%2Fgy8cv9Iu3yzUzcz2G5K0b%2BmTbrMjaQi8a2MYz04EymBzpw35okzJTGRmn3y%2Fx%2FZyyMogYX4oD7z%2Bm&X-Amz-Signature=1f3583070204c4cb61359d3c7b3aa5680eb610cc32a3c1cf567939e1dd2de96d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=95bce0ff870644e2657a8be95800ed44a516f8d74967f8227031592360f76e90&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=08d6e4917a84cc5773aa98aff1c63681c826026946e818ec77277b80812a6a1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YN7XPSB2%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025456Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC6DKk0Ni6fCPuVsIW1NTk1Pf9igMQI8SZQFsh%2FjVN4TQIhAKuUvO%2FuR4nnG1sj%2BTNiy3tPDSrer4GMCedkb3X2WkbbKogECML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy4MuEK2JeaXgML9gsq3APSyYa8cWtu58lnJ28u4VsH4tCh44ai%2BMdfICtofvePpiBIrMfpNJRhTAE667hINoGDTmAxdvIA%2FWUmuGN0BOLVjOlPNrOR%2FVRWgfzW75gMsU0btfuRGAN2ZNt1sLD5u7Jngz68lS8CHwI5QUSncdBmBR5XyEkdLXj4Qb19AK17E7kTi5MtDRtxS4b0JMaPCFbAgaRlAZDPJa4RCNMc6ZqjfKg6lGKk4zFUv2kmOzCdg%2FSEq3VMU%2BD692GtRoHF9DtLiy2HFiWJeKQE0ZhuOyYIt97ZLEr9UbuAE%2FaxFtuDhHRbt0GtxvCw%2B02Qgpn1DUZb%2FIn2Hoyn4oCUGaMoJRXd27y18X1TfCrFfqBwJhzAXZ4ATv6yWQrJqfjzThRoWS%2BPS5zX42YzDvXZSJ9t3SSNCHQwcA0NDe3ql%2FH3LglWMeJr8p6xokb%2FoAMlbZ1OjxD4ivwGyRzkndkrWj6j42WSe2hxPnlQVu%2FuUKVF6BMRLNM5CAXj%2BuDteioDHVtpZcMl2%2Fnc%2BYODyuRepw6x2vBjt42gHCBy5sCjbvmN7qsJiq740TRfyOL3z3DkanFv%2FckhWvTinMhEWgs1YAku9bpPu900R7XHgJgBPKHJszTGjSLLqiq6KAMQJqD5WzCqsaPNBjqkAenZyAJN7eXhw8eYWYQf8BXNFMB6HRde0p8z%2FbajSotsXgyPGRQS8voop3FDa1z1F4fHIHj6jA0852i0NSc5WkH2f0UC0CvBx2nIMRavSb7J4WlnLlufwgAI%2FyoEY7QurhzwU0MXgeCAnR6LDOg1c6wOa88snG1soqW91nDa1yC5fXsvkmF%2FVjBycYLQJh59a8OnzE0LHu6oCn2Pfe9Yc80d%2BlfC&X-Amz-Signature=b35ce2888a7cdc39065d11ebafd23ffaa8e7e7547faace41517545449e87b4fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025414Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=f76b16a4980ac6c6b7a939ab8cf7641e93176fc733a1e7af1710863511676a72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XR25DHOT%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF1nUKb3eGRYc2fEgHObSPXsIV2XICrDj1NBZzhA6HTwAiAxDCMQ2nagdkD1R4OUnvhum4r%2BuJjPMHMZvOOUXLC5FiqIBAjC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHH15YOuvk4U3Xp57KtwDwe5SD6ZgcKGko3GpTeaB4wfUOi8yFga8CWRsePjE%2BCa7qYga8DSoDt1pjlyiYCqv63Yn0eEOz9OK7gHhMMf2ZMtvvxXogug7lgecJcwdFz2q2UeV%2FLkArnA7Ymv0eTaHm6l%2FNgrAr2rz0Sh7EFTiFqXZC3%2Fx5KUR9H9QSzGYgJwBsRMb3%2BC3E2%2BAr2geNKDZqd2cIEnt8x05HLx88%2FNQfjr87f5ie4UN10%2FEkJTsiY3W3Pca3owra6MQnYtBU41uhac3mnu%2FT9WVGTmi4m2n7xRNPRzb7hJs9NkZjSfAEs9Jj%2Bp7LXz3yAjs1tJMxX4Fh0xjVKvas97e6IRYw9AC7bv0RJ96Yj833uKCJGmKSkvvqcJzWOcRE%2FQN97nRlJutafADj58F4sDxocKsp4DXE7lHkzTJLQbuwL0wQv%2BK8BjnyjJ7adw3B30xgkx1mqOwtpAfTuqt%2Fc8BqL19d8StT%2FfuOKiIF59b8e6nOOi%2BXLeTOLxkfXpJpxcdbqYoxZm%2F4DL0IMfnrk2WKMVlXyrSWpj2k9EyGKRt1Y%2FDql%2F7rJnhFKJtC0jzC6rx5b%2FUWKYsEKGdSmlHZh9GwpIqUIbNXvHfHgr2INbNyCPJtQmIbss5iUN6%2BF56AXDR%2BSgwna%2BjzQY6pgGvbZybgrpbhYp43JV5X2q8gLlUXH%2Fxq8h9FwJdaKIIN%2BmQ%2F%2FKxnC1uQV62zgDZAI%2BWc6iLhXn4iwOE36kRyN%2FbZmSVVGlc%2FSnnCTqfYz5qioVgeuXsWbL4B1q4x6YpLQkysbXx6wuH%2FqDlSEXbCYJUg6HAM0kzLYjLU7dLzHUuDsJYCal6lMHUBEVLmsL1oT7LOBxH3dwhWW556qpHHUtGP3r6pz%2B9&X-Amz-Signature=7ca4d19bb3424330d3d1fb21a83b97f17bd25c155c6210a1400278edf66a034a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R74EUKO4%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFNaZJhIpn23xB96J5xSU8CGt4OnEmcgUEzXckquOSJTAiAe20shtzrnVxL43zZTFlLaf4aHpSi5w5gOz2U4x0D9KCqIBAjC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMi8o2f%2FFHoLU%2B69qBKtwDr%2BgZAqUzNuUGZ5myx35auptgeXfGLVcr%2F8aLoVZP8twUkP5Y6n9YXHchF7cYMacNPScK%2BrfZQcsIiV7DjsBURn7ZOFub1XKlnUgrg%2FxdFa4cL1D%2FhlDPwpQVPoA6imSiAD3ZUArcsLicJqFL8igoaQFujQlSZOtZQUShmp6RdNDLVnl%2B4VfIb6dQNrFwfUk25MiQhZsM5nIkm9lQJ7IYIdEIUvI0mupm6SQVdHEesPTUwDn1zb0Tic428PtjApEdiWcWKOTiXXwkQtqpJ7B4b%2FR1uMDEL5kdpr2qUYIZvMjqj9dVKqe8FuDpX3veI7upl0ZM3aJactR80%2BE9N8XD09jO5%2BfqP0thxoaHZbpWnQQw2R0hoW%2BSMOYY1AUAOSKtDFstvu1i2BM%2BzCgECsr5Yh%2BNYIijKvngjZ5Z1GXNfh9td9eeqzOXn6Mriawy5GF3%2Bzdr%2F%2BIA%2BAACid89T6S0OS%2B4kSIOm5YqgLHn5COrcsrzIj0OON8bPe0A0e1NT%2B3%2BkInMpPpOZGDSzeCSRy%2BDyoRhryLcAbHRWwyj06C9gQgbBUn4tAUQX%2FFmvH%2BBEekQvolZGZWF6VOmqgAudsosfWnpJRgLu1g8RMZPetK2T%2FcbI8KUAr3AqAr3YKUws6%2BjzQY6pgGVMkAn4Suj8qRgqB9sKVILLYzfJHehirqzHuKif7N1lz%2BkYOa%2FzNuyQw1%2BjqEmiirzXiT87qDEg4huOm4vG6GyW80mnN4YyMv4Fn%2FMi2yoEFJus%2Fresn1AsP7Yg6pbe1CPIJFhCFz6zXx8%2FxrzXsx9uZDWi4HYe4z6taUnoWzixKvpP60ap%2Fct7U5uJ1g7j86qI4IkiGIRo7V2xhJCga%2BJ9XcrmH5l&X-Amz-Signature=5c9b6b591795d755076e10b0eb55e46890198a64f40d28a22209c27067ebec3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666EBAAKRP%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCQso9Oi7Hv7dczYIjtPiMntfPQkhsHXVKEn5TfSuZqpAIhAJl6uwKAnpmV9J%2B7bq7vjzsI47CmbXCigUxEpgPSnBB9KogECML%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxoswaHo8zsdSDFoz8q3AOdnd4XkgT8G7AyfY6a9McJz4Ch3wJHCwGjS9%2FZMePv6vY%2BMCbw%2BaQchopPTpeLqUHE%2BRSvuSlKtvxTlvpbcOFC5tLh9ApaKHDgA3bW%2BsWl1epsEk94VWFmBBGSDirMT5iZyXbtZA2PAzirebb5GyqR3aoUDjV78XvpD4JiBnF9IVwnUYC29Z3DJ8tsbhY%2BN5oNaSRxYK9dVXiTgFl4%2FdGiu3c4qveOYp3xir3dJE59kdgsuawFw4RhCNoHaVW2lAR1%2Bc8mBC0njVrjR8Yml%2F%2Fr7eU9yKGnpzLMZCVGNo2dWLyiJzKXiQn55T6d7SyPwK8OSfbv2m7XJ1iHWRsGdww8WN5ofhT0DIBGoOdipr4quoHNIzlVdmkhg%2BQeE%2FLV3GKlNfsQh%2BGgF5yDaFNyw2eNCVMTAyxGptPLPPEx28a6ctPNC8g1%2FoLunEKtuqYp1A3YeNsI0uiogPqHmqJ3GyWX2H7x7c5S1ufK6%2BdI7Yzvd2SZxf7Q8PiXntJuSLKovTxsobwHtm5POB%2FEDRmBwCndNg0WC3jd2Toi6vDM6QF6vvKJWZR7v%2FVDx9EODVDL3Uc6COQqghfFW%2FLmE7HZXJ473YLmiMcSFlhTYWQhmkz1AGlH%2BzDvzGBryo5uljDQr6PNBjqkAYztWQHho%2BNgzzicrgj%2FqZMZyImX%2BTRdvfitXwJJTSw88Dv9qmSsU%2FVnkrkywgqEAEnl8ztth%2Bn0zi%2FbgasISV6N6fO435pVfZurBDe4Dw9rVz7cafw6yUgauH52L%2F5jzjB0sK%2Bvpk41SuUXopfcNI%2F93w6ehoR89dwPB0L4T%2BV6t%2BbhK9TsjE13FeelsECU1O9kgZWHS5PhZQmGlfV0QLmJweTI&X-Amz-Signature=ae67ab2065df4b280be22e588e85afc519025dcd912f17546386e1d920649498&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QDAPLWFX%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDQetp32h1sQa5MDq%2B2HbeCzqmk%2F8voaJqX9NvonWO7fAIhAKPIVAHyi374OWfV20RVap15um733nbzqG1YO4zsAhCgKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy6xAkf9pY%2FAyI5D84q3ANNbxLZXOInGGmrv7r%2FgM7cEODc7sq8xjW3jbZPcETSIt6fOnOUy93eAlXo1nfzuzAEno9fokNpJZSxL6PBKMzBzvwhxCuiQmvnbXIQDtRqFXqfpD7p6BEmh4O9bzEIJsNwFqEXgkHl7TxnfckQznXChK7O30LF%2BVokScqlUcBFApDOJUJo6t33WIxg1MpWoQVQ8G3X9VQwI4dGsUt1b8w3RXIktHsUGGyL9UBuMWie3QSPVBQ602%2BNxLEr2l6qSnrNUlyBcjF8vTtYRD%2BDhdQ4HiiHUOeUkP4NF%2FC3SGKdFOw00VChucppMALQexV6NkObwGBdHrlEJM9f9KVeIEnzbd1dd%2BrBCCfR%2FP1Rw%2FIfJrrmZJrA4JXt2L%2BLqzz9F7uk%2BuD0sUuWw2nbbvGXLpHCrIgEGjd%2FV3AmnAxjYXSsaCwRkXVgS4Y0b7CAhrdE4LW2NfEP2lLi3SjQeUxKNx1Ud0hb2LJ8qd3axdtkgReg35bc1JV0kUGwuMcbZPoPNRXsOzzE5xTBTT0%2B46THA1d2nTO0KseFOU8vBF6v5QXdidiGh9p2bPZ4398TYHKXgZKlSXA%2FjwzqKFq2KeEgEd9pxcBq%2FFOHbb0MFYqu69GSqnd8%2BqDE1oaEEg2XjTDj3qPNBjqkAYuebbTKAdLwszsR05W%2F6Mcv2o9Naq6SIoT4wliUPxjyxN0DHsGPoMd7P6o4iUWSDrlds2Qbp6CH9PWhRIrySdVYhG3AG4AePuntstHuDKA80edKMvVT5SvMtUD2KV166BClva1RfmSzgwcinT9GB2gadEFsFwmwn%2B4diUTwHLfkVzA%2Fn%2BIzo7UorpFs4TW6JFp4jHg6bTy%2FEryetnTY6ZxpKwzg&X-Amz-Signature=4fc209053dc93be83990082fc97a4b6c634b35bb7001a9938b8ae8c07ddcfe53&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025414Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=697a8c7de8ad0e7b1aa4c31a5b0226fddcaf7a28156a4af5c56adba4ddc4ccd4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666B6MERGG%2F20260305%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260305T025414Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjQvhAHOkHM5QdU7mM5MMBr5iRPTf5pIH6mqhl0v3wIgIhAMtQawgr9y6vGOx%2FrsZ%2Fgr3%2Bm5uyun5MgKh7%2BUIHcPBVKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyDKsScs%2F3NZPSkc%2BQq3AO08A9tP%2BP78eg4uu2Ugf1rImkArOp7xUOD1n%2BSOETSA40vuJaccH2r%2FxfkTcRMitWwgj%2BgUofTW7rONmrgrim54n1JgsH2ngl6uePp35Tn0TWrm7FPoFcqoVhQinZb8e1ADuNZcHdUrV8pBvnOp8ScArdLkAbjaKfxrPEN3gIHSZILob%2FW1AZJNEmKBOvrY6Ts5CDFfXA1zwaw%2BYXCAKX0nwyU78zftpe99%2BA59oFrkedf7h2itdK4yTLNYD2umVY1SRa4eOLheHXHtCqonS7SiJbcj4HLSn6h5bB8fCyvhxP0tF41dTPmIBLj2nhEdaJQHh%2F6QJMGbk2nUPHF%2FuYUsCfRwqpTGrm0GPACXNnl1I7mqYP3oslQeHZMDe0MS3WYJHR8ajB5j%2Ffr4boyp81dlyrmlY7IZgwI74XRcRBiRhFigqPoqBiRXbvDbVH2DBFAk2XqACERtrnrjfRYInloxw9ibTUWUNiPYRVoY2Y1BlgF2CFV%2FutVyOAKYr7ZmuIv6gEV%2F4L6r2O6FovDUh88DzHK3fJTMyX%2FJiljk8XXXCGM0XhifZjBWgazn11JZr%2FJx2cx%2Fc3w7qO%2B8SFHgTfN2Lc4%2FmPnTe5S2AKz1sT0IZwCA9gbAM1PHbL%2FXDCW3qPNBjqkAfZ5PvZoWATmg%2B1G9VLWBcfVqBL9XlangB3cUlUVf6hazqurMdKusA6uiTTuPw5AClgRzEIL51Eh%2Fj9con2ykvHjuUBGsVqg%2B4XZ2gptsiriY%2FrJahS8GGEj%2F%2FuchFa8M8k6xtMXhu0lR202dFjbQm6WCk7BA3ybksMGdHyTslfiagmRRTU9ogybCk7pO3r%2FSxn8B9DygpfF77HAc%2BQBht%2FWQ12N&X-Amz-Signature=c8f4f0cac7403fe3454a8912e4ad87223bf90f0af15cf0c4bf36accf4726008e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

