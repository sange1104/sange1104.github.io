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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=974db51e6a9487ed2f54fc6c9986cda0e1cc5061eaeccd0912646f90ba881a3b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=daf626496981aa8c3d9a2b4507fdf0ba6afc5d6f7b90e7e4f5a56a2c31ecc1c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=e080686399a357e6f86f70d16eaef3052d4ecb7d4aee6db8773c0856854290d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=aae3170386d928d148c8f3e7e8a3c762f17a5c923b7b26e92565c68e17ae02d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YEWAHCIS%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043548Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJGMEQCIDvdSCh1AUTxVsdEM3HtIidHSySc2v7VHH71m4Cxytq%2BAiAtxCXuQx1fX6FtzvNLDNX1mx7K3ybvoPUvLlTLnjqziiqIBAjN%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMo78gRNUa9A%2BrbdIRKtwDO1kgQB7W5L9jZ6fNvSIVsXVweJtX7bG6Qs%2B%2B%2FGVkHGZ5t%2FPsADfEu1AzEFh5XOWCmwm0xI8nONSONcA11sFWOe7MxDX9uObD0WT8g5L9sQw8UkBaiKfy%2FyTvIJOK4gMO0I1VHUBTWrbmltL1ZCBG%2FKfFUMgBBijnvAwBFy39%2BiDbzT5bi5W8nf8lSVnf%2BuDzamdPsjrHsr48bJ27ogt4vAJhMAlFR6p8HdjGQVGOVwfL%2BDU2gtoXCqM%2FF%2FsQR6ukMkOyIaUFyrSB5Xp62pWet5E0Jc32Unzxei9lChkOPmlOqDB%2FTEKU2OCmAPcGrpSXO2qfPXvwwjMfBaXXrrde8zbYstUNK%2FTNHbQP7jKoOiOXYmkMT8XykwgeHlpEC9z8hnXSUaTMc8JL0xvr%2BOk47ESvXyDLaPXP4iiwx6JwYRp5vvkM7%2By8nnBet3S78yfsqFwuFYwvr%2Bf71HtfZA6FP87%2FhsjMROLiMD7zf%2F9es%2BoZkAe%2Bpnsn1phB%2F9uQNgq%2BIYQ9HO8MsS5eONW16%2Berprtrok8ElbGdRKmUZyjd6hgRJRv3FON8pq%2FJt%2BWAVCZR2LyaemKWcPNBHglMt5wtedh8dHB60LPHkd2ejBgRtllFeHFR7RKjZjgrcI4wuriv0AY6pgFukuLxYUVZxGVm6Qp3ifoRJg5PzB%2FnFXqT%2F4LFoCy7V3JSzeFZpYiTWesDSl%2FWfiVm2rF1G3EjNhzUo%2F09QXQolDuMyLcBFNCahoW9FQFTW%2FYpOuwjJwfmcgbXKqZ8Rj49lQFro%2FSniKFzwd8sVDIOLKDkBasSibW1PXbX1X1iOL%2BRakBbMQyCZWxcAdk%2F%2Bv7SiJWMyMvAW2cJtumtH%2FASksrHGktj&X-Amz-Signature=3c42798ef2886f04aa3c4dba863a188c09ff35caf253e33179681840e7832787&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663B4OPPPX%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043552Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQD7AfAz6ijrL7xT9VzsolXKxm%2BIHPUnPvn800xRceRv%2FgIhAK6enOn%2FHE74i8olDrhJMcLDqBATcTVev66oLauYSJSmKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz85HwGIy9of%2BTU7QMq3AOfebpFacWDRS2DT4X7RSeOeq5iB6nCQ776B45wj8Tj6SKApORP8nucX69K7szzd2po8PZCrqKQLB0LAbF5NG1pHVSPxRGmp9cF%2ByfuMzg8BF00Tb4mFu%2Ff4VUrIcNRByifigEtgp1P92WU6o2reuZjrlFmN8d%2F05dWT1cIFzdF8skj6zPKDZfAF85wMn7ablu9j4oIfYfY9%2FP7pxeiXZr3B3%2FihtbMXCEwSH1lKDT1Kt2XHnTYKYLpzN5nryJK6V5Aq7J6m8IbpsHNriklEn53y6%2BbnEZ6CAd8JJDsHhD6lfSHBAMvt24LzcJKhCR%2BGiuCNn%2FYrYW71EXj8PmJvDaPJ0fOtVZM5QzSpACdsqid2kM7hqO33p%2BeU%2BhwReQX5YR%2FZP%2F8vTGbJ4KxFvDwDBvbTo0xCpft9M5%2B8o8lixpdgx6y4DFEzMvraRydO1Bacs3GCQnFnk6wAy2X5BY%2FqGDlw1J8yDOazpSzlDNIDMSShLbHLQAp2wdPV3ezP9lr7Z3ITpcyHtURK3jJ%2ByIXSua0txIaKJ8W2m9Cizwt7PiHjCWJvzUPyrqlVt69gKOW0NwOki6liY1MStAqD6ok87vS6kpacilGLl%2F7gHA7Tlpzhf7DW2AGLgYSm1puEDDOuK%2FQBjqkASj829hlvAt1vP7g5%2FLHeaUuBQYD0RJRWEjd0fR%2BXgkgrqj2XC3LgWcVcvUk3NagaugHMViAU7E6jam4lNqxMCRidSPdDfy5yAhSg28mPUv1gXsdV7shBfutT55ccwlMN%2Bsduq%2Fgb%2BcOmV1EwWq8FxG5vXz3LKkiCA0nDyJGJN%2B7ChdRv1faY3T2tGcJD9n48VyP8XhoyfFNSYmS51%2BIH7rHRUda&X-Amz-Signature=a2995dc5478dbac6673a76e1c3ffd05b035b619cc773e61fc6ef1f1292db74e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RNOB6CJ5%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIEAUf1cUUCOwMQmnVq0DXEMtZeLEiBvOxlS%2B8wOXXLuiAiEAinLeM7wGWCmm9nz%2Bt%2BiE8IixCB8h9mBrtstgZ0OyChIqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAk%2BAsjXygwB3N9RGCrcA7mbKi%2BsBS4IdyqBwq9juFxBPQuGfaWs8qBOY6hH8WyyqTYWBy96ePQXNa7PGDGvTf1vXzdQht%2BrlatSvQKd10Fm1ZVqr0Bxmhn2QUcWR4zhzJBCD85eiSdzRAwjtKbwvc3edlJih2eomfyFh1PE9Rcoz959nBTIsY6TxZ%2F6P9oUUhSv90zrZioVWNcT571%2Fvf5XJk506kkVxAWDpSZUP9II1svVMLgzOIEPMl4IOsjO27c%2F7HUxFO1rY%2B0IsBsu4RM0NjqtvBkSCh5d223u50DS%2F8Pjg%2BnUN1aSeX59gYJIjg1yHTSGuJrNE%2FeXQb6MBVzIvcokU34ajGwhSmzWCcsl7wbOeCh6L9bzYTau%2BsVgg9hIt%2BwP6txjujoc%2FekZhKA%2BnPoEuPntcnEbc%2F4UznpDAV1FXcfPerbZPnLatzU2X4pv31i4wKi5%2FIRTqAdo30J%2B%2FjYMFcFRYQZ455ml8Xy0wSdxfaF3HaruO04URL1U3wJxcwje1L00K%2Blq4RXUiJvZXfyii3R0baVZjzlXhWHtNUjw9OJQaFXr1WXypuE%2BBbIdZVUmsA8m7fAbVZvYD3RSR7krM0O3YxUh6L%2FxGhj82bKsym43geXqihy04gY9WWPJ%2BVmOtmabTj6fMO%2B4r9AGOqUBGAa2tml%2BgGqJrYfkqy8mUFqCRofq40m%2F14ikgLG5ppOm0QFKpDHeMzHOSWbPg0%2Blfcx5ubk0OraIusKfMFNNgov0uABq%2BUbTSKSM4MD3mf0%2BGduE9WbdlUYKeCbLTf02lBrGdDoGJ%2Fn4O%2BhqL2oFMC33ZdDHyif05qq66aVpQm5bYIEPr1fUevMKWSJelBTOdnf42sWj52CQYauO9Papj8jokh4V&X-Amz-Signature=de94199ceba437e42e8ceb2697296f270e7c0321b9585ff1566afaedbc8fd468&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KH4FFUR%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCsjM7daHNCEKlzcL%2BNRTnaAKlLOK2BRP%2BvN6x8q8nJFwIhAMv3qKR7nsYd4HqZaTEaEpLyPX%2BqLzBI5jZpn8A9Pf9SKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzIfw5%2F%2BFauhbwhUkQq3ANuLuIP1eM7iNxRAiH7KHbWEX2G6WRF%2F3gYuRwF%2BNBvNBxyvn953QYEZIKkImMF4PNn07IDYyCxA%2FUwhsK4u2RNPRgi0oIx8wMmkxFJWV7qSFPftSBczHqWrkxeMYg3rh9I6itZF%2BFCPQAOS1bXB3ftJFtnUdDCDq8uLnepU6Vy57%2BH6WFPugYIp%2FywEys4CZ%2F5mvikRXCy4mEMEnKi8aZ65%2BZaSJeeZ5f9QiNInpD%2FxZSz7QqRfz4n28BOJkJdMq7hAhc0IHmq6Hc0vJv%2BgXD05Y8Z9gUoCSs2%2ByfmahPuyyaUCet0CZWLgiZxevC3VYtoSIaDPiesdnx0xK5gDtvN8dwiNMq0ucDiBB20lPRrQT1XQEtz3ChVg7w0jPDJzU8ld24O2jkSpdGmmX%2BC0sKVdhBWtXWOsOhuVtwCk3oyARvRmVldIKaPUadytcv5GH%2F1mJ8s%2FgkNeIdKMAVkwe4eUOoV5krM6%2Fo08pJVI%2F0cjYJg5L6qXnP124dnkwiqklaEvk%2BScRwoHQihbYU5R%2BIQ%2BKdurpQeO%2FXTw9HChaHZr77P0bg4LjtrumYjLcMI7pDk%2FVLSUZCefjZRXULeoRAolhLnshiNNrD0MtsnAziAX67CQBfU%2FWBM5zT2UTDFt6%2FQBjqkAQSsn1Z08y78uRRocVPjci1sqVlyyZB9TPNjVWWAluQAsDIZZen33YSN5mMGKOm9Q%2BOvGPIED5gpEOUscLQSr3%2FPPlTW2gGHS2rPIHQVs8YMxu%2BhapvKuUY2S5opQzn88x1%2BHa0YBMdLOC3fXQGf0HtbNVgFBmQAxeMcjsXaEOZyQcidBU03qY0jxfQlCcTFQ%2BN6Odeu%2FuXj1SZvfbQSnxjMD%2FE2&X-Amz-Signature=d7d7a3bda232005fceab659b4d2a4539c317c8b9f16bdc897e7b13272f362c3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=1f65cf3ac7f18ed3f1e5c80e161fa8cda5710e8e9e8cc9f619e104c64a88d064&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=c150a93b8f341683da4a1b51bbbf92de79cccff57d278ccfb2d6b2af713d758b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SZLHPQJA%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043557Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCtGojm32rn%2FcWd%2BcaoqyWDYTdpZa1zUqLDcaTYYFfI9gIhAIB64yow0N8%2F2Ozz8q4qZxY%2Fvia%2BfDjIXGfFbLnk%2B7nrKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwE3RA8fJyeTUjal%2Fcq3AMdbLC8Ig%2F6GoRKGvCrCU%2F9ShFo4Qf6Ov1mzMTV1CE8XbTXSxXLGrntorSbCJuP95FoUCLQwORarkYQQIAH5NqUp0mVekZJE8FPLFH1P0piXQX5DyPcQCp0xhFPAhbbSGcAle8ERl1To7PIEVSr1zKxOvl4f1FSbqU0vOuiPeRTTnqJ5xMPnzaGeDo9f5UuLjRFL6Q3AFBCj0C6Pix3Nr%2FnjWEU91uHiHLNElVY8AvmmSZHIHKUKCBtcejNJqA0wkrAHO1K22MP738SSlZNNOLdA6%2F3Vn4HSn%2BDIGRiTwq0vdVSEUpHHJfNIhI99ZnHvAKsvU2%2BBIyPZJgqm1GmhsGqvx9%2FoR8P8uxi2ylJAgL1PXCoJusA99f2nCJMcVFKzOvWAYQLSmZDDQ4Rd0fLrgcWNZ2vuKiBb84v7uhIkXYHSrqdMxpOLDqxMaHCQ9lQlnxXuj6RwWA8b%2FIGoKi9n91kqnGVRaAybAT6%2BmgUIfBm6V9y4WfkJPvf3BMWfHrDtAuxDlfMKZ9pyzlt7VsXK4Wt%2BaqNnwWt3T874IeCb8jLwj%2Fv9sKQgluHcy6QAOJzd%2FWbp7mW%2F1f2O06eznb6SRFN01PAs7H2h0uycVLRd5pB1qkAZ7VWmylaZyyGfDCrt6%2FQBjqkAQRALZy51TAzrSNnGwfxqP%2FJHVgk1UsqEqO9pmeUQghbzuY%2FbuvFL35zTlffWkmC6pyVDI1naJHZ3h62P2sT6oULBEUd82cjiYcvl7y8i3vK0m14o4gmRw6FaDi71YLHQhSuZpST9JAteGZSoG9aflG%2FBV7Cth44vE2DH5LEUeSB2KSCiNAUKPi7hXflhJZbMVwBoHvqjbgpy%2BYWitOFt41fTzO3&X-Amz-Signature=3e7a0973959f6321c9f04277d2312f7edb29c2af1ee3223e432b790c6113492d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=75805a66aa8684334ad45296159fc726107a057780ecf8abdfdb7ce3b0bc77a3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TUX5OHMA%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043559Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDRW6Liw5muV5bMeQ5y9JZ%2BDgLV8uFG47hbA%2F6jtyskUQIhAIjF1%2B5qkSUZD8Zfs0dV0iQUHU59LyrmkzJ3iwt8lsVMKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxki1zQ7MGWKaQKySIq3APjhrf3R9wbkg%2FXvO2%2BBx70hurr8GPPsLRB3POgUKL5jZtWIzBX2TYnKo%2F8eC05TI1R%2BQs0IfSYjJmpMwfQhKsHV1oyyZoxZ2MwNtkTain31GqxX%2B8cyAWKwA%2F%2F5NrWsAiSP3AROquC%2FMRCpKQQjpjHEO6H%2BJ0j8qQOz%2Fr8poRjZJlyEeYgEJocrTjTFSwy4D83LAhllVTIuNGv5coxlQFZb11%2B3ibNWQLzYNBVTr%2BgoSkPTBEDvxNDJnAEx8Zns18FPLRedxG4bZxaR6j2%2Fvv5bOwuadnn9fyy8kmyp8kvkcS8q6GO5RPEYZGjPEFK3lPDFtXqXgY%2BJmLX%2BETGBNRjhtpqylGBss1ApDWG0hqaafGxGdNIuL18I5BD3WYEBBPkWUI%2BSTn7WlQdmYuIOUWJNEBmbUD%2B24ysUuXJZBPe8FZe7xIl4gP9y9TegorwYLsw116NpxPMBiBFwPsYY1GGwv0%2F5JoP52m09Fhn%2FHdGjGnkwhpgmzLwv6hOGbog%2BGLzXy4a0WSOBzcdKvao6go%2BbzWWHNTeXPbdNuCqqyFnVx404S1ZjQzDeu%2B%2B8kkq%2BKmu9khicBr5PeP%2B3CnCTnNQlKNLej8imcfvNXosb4IiIriWkHJS9to%2B%2FRU6EDCGuK%2FQBjqkAUJ5%2B5h4bF%2BzhRtDo3wx8UbU2mUmz0RHs%2FD6tDi77WF9D1v2Ez6XC9k8%2FYZNlUPcTfvZbkOjTBA37BIZSAmF%2BArLwMyRo%2FQLh2rynODluLPBu20lnsHmwroMBD6jNBn41a0RfDfP37BcmxBEIcjGOA3Myq6KpDlJZMb%2BSdv2qi5DX%2Br%2F9GbSZxjOiauata64ngpv7HOBCaLNYtB7Ec7wYmsBGs94&X-Amz-Signature=5a736d749dc5a59e0b32632c5d933cc3bd61921023facb2c6f526a7349cbf65d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SD5WMAIG%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQCScKOAmhW%2BRY1IeA99opdWAST6Fy7IXFgXJo%2FzN0T5UAIgRwqshaxl60dAh0MSnZiB5Aeh%2FN3KR50sRhCwh1wuGrIqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLBMaCv%2FVfzvodXNaircA2AOKfAwQFNACswo%2BNGqrmSpmpIB3WH8Z9fCuuNeWSC51vjnLonlMIZXQ5cU3JippoEXuZWlsHTyEDebsXMaBs%2F85b1%2FeK4iWRBLxyfpbxt%2BUQmSNTYdpgAb%2Bh1%2BKbHRlMiMWWseYl277ImpbYb21di%2B5vKYfODFkrGtFieUAQC%2Frt4%2Far53q8ZrpTF%2BTCZu%2B7FMxZDSyyIXRDD1xEEE1yqFyOE%2BcjVekGk6RhM1rhMGBUu4pYLSBvLZl181SN0gsVyaNjO%2F0AMDYxJwjHJSo6ZAcuCbUs5y2KhPVmYIIFwSxjfMMPjXfEzch9nMp67PZJrY%2FVG8xXfBU%2FrZohP6NsQ%2F%2B1cfA7jQWaC3j5%2BNvgXlD2VxE4EWO3kEQZgO0ZEfjYs9ghU5O58bMG3bwXS3INoovQh5oUh7e6E8cCaYgKzEiU7UDOCPX5RV%2FrqoLkmHct2vCOF0qEajrE1f2Vgzwpcmw2dZZBARJF7ixizTXSWCQCm3fWgatGzFij0MaQynF4Nt58GB5BAXY4KIWA6vh2PmLDVDam1JT%2BjgdF%2BWLNgevAy4tUxnn3YXCYOBWUl7OEur3vTf0zm0yNtjupPdsZy%2Bhb8ibsiv6JGwBwaqQoSR%2B%2BCp7KqErCv2JuUvMMS3r9AGOqUBcK7Z0aRXp2Gu9%2FMdC5O1ziWd%2Fhh2DJ8CG4W1fSYvJsWFccB78DX%2BVaKB7fg8U%2B7ZPoga1%2B6J1%2F4sWSdoY7pI9sQo8sMzViw%2FhG2oO5MO5VgF33FTuVQCnXvT0SK75q5Q1cjNUWb%2BvLhb3kCX7vrQBo%2BAlufkdxrQr9ZRsbeOEOmQs0MxDuWAA1IRVTDqURCbcJMxXIMDkOo9OUnaoiggpt00qk8q&X-Amz-Signature=2dcb28f326c9ee031e2190c462f46830c9684b7e9ea354330a8c741e47468404&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662VRYEEY6%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQCYLsmbgd4z7qAeSv2pntfpGciipcuUFp3ht%2BnmQtkSFwIge94es%2BtZFhrU6qxJCvco6UD5JvtKqK0vr7P7D7hYYXEqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL6GVC4RNKK6jzWNgyrcA6moZ8nBayRVmFs1gkxJ2kexkmasUIU0V1d5hbP2RVIb7OOt3cyueL8W4zJg%2F76eVuYdQ8Xzk1GzvmjRwNcOtvHvQq6vfYxAImhx%2BTYNHwmODy6ciMlsp5LGCcWVJ9S658ZaAu0YEJfqukMLUCImnbqJgUMkLy9oqjy86ZCUGNQISk2adca%2BDHsHChaRC0LwF1lHCIpVRUMForhqwTVC1WPfCHm5MeMYNDv7VsZhh0m944bCI%2FAhVodzdb1XC6BsuSebleCarS92qkHLiCm5fOhmVcKAmGX%2FCXvmn5JprY4kbrSX8kFBEU3ud0nio8IiA5lxcR1CKWzK3WZFuzXri8tvaca4yCVR8b6naPkEmptainbbZ0sVZ6Or8kziGwXx%2Bf3NjpXVvjb%2BMcjiFMYi6j%2B0ToT87GiBXaCCZwngT2%2B2pSFaIju3DQT0dMDKBbp0AF8faDrK6q6Xq7aJHieJhuTutFfObGe4cTDFYgrRaRha7NCxW8kc7zNzVOKgyQgOSi8aWDa18NVLPYCpcJcMpWmlncDR%2FDKrbimJ3NiQ8elJ2LXQatg3XMqysjT9AxdPEWkVeieDXUBc%2FDE6BRbzmIuwxUbIS%2B65KzWC3AgC8mGyaIq1yVBLWFo0y%2FVJMIK6r9AGOqUB8Q3bsDYqubciSibvG0iIBMIyG%2FJzgiQq9XaTw6padIBJky0tqhWX75PaulQvRC8czRPgRmCdhlGZl2%2F4%2Bi3WqzKPZ%2B%2B3lGLARsfZoLTt8SiApL3frz3cNKx8IQAiUQEA9%2B4tic%2FHNlXZJ1azKe1GiWKEnUKDAa1%2B8uHcPBKyRsaAgB4d%2FMnIG4kE%2Bjpp34UALbygY8KSQqFMEjPiCwUQ0vGPTzZ8&X-Amz-Signature=ce9aa0d3feb21de56d6b7d69aa542dcb37278d30f2e1284cb1cb215689d1fe04&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YQDOWN7U%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043600Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQD9aLUAy01PkPw3I29JhztayG5X9M5Us08zsUMxpzWISAIgVeZaaCro41C%2BVRvpDUUrJPRI6WNhxtAX0mHhSQ%2FWOPEqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD9uxQ0IzUwxohcgUircAw0ZxM5GmcIuA4bjyOJqGuu8RvNMGX1EdaGUUHJ%2F3CEc8QH3WMGbPnIA41PjSmUNBz%2FoLtuSVW1aU9gSsKaXwu2sT11dtHnt5wHN9811ejcCkpETxr8Tqfu4zvkcb6HicdgEf7oGAoaKipvbYq%2BsI3fnTFnUY0TYsT72szF1ipWZpQxbsexAtNEl2N8dwcV4vdYbt9IRuYZvH3TZRHiPIqxNjkVUUD938CRjGDMrOvAVsiiMNn5SEOM10gNPzR9eZ15207gWTFoDJVLXsCBGh4OMr8uM%2FmwvG40yF4qdy7st4EyGw5eQs0SNpYbdYeoUkXCLYuowYGA1tQkoMQ2QVF2h6DlMrdscCJVWVM7rQgn%2FFL1nzHUxpcYw%2FdGD%2FL56KktRO1pBnhTDY5FiEXvTBWHdrQ7Ez2PiRGiuu0aaYxH3upG1aUTjcpr%2BCpkNecBYmbnb%2BxedHBjvLihn8oZvXaD8u93yGp%2FxTvfgTO4vCpuxFMLcX47i7WDVOMWQT38ghJau6cm%2F8g1ztUmn34kOLU0BqXlQP0D%2FjwWB3LoSixks45g6jywtxYBWY6Qsx3OcSe9272jtUScq7jlBlEvheGpGak6CEIWMY91zgy49HVTEWNdLRWlxJvC6HQbFMKi4r9AGOqUB%2FVA1waaUqM%2B1A9Kg1sovE%2Bi6D8omMGZp13U3QCAa9BpP1MkVtCvE0pzKuaPn8%2BOVPGONI%2B77cGc7qztpaasPVjG%2BUpecFkOp1sTm81lXu3AmAW2NIqncmfDP0%2F0aJGSe6PUUX7CyeMFjp129x%2FGe5WgMvEautTP7k0uqTd8L9Y2Ve%2BMpDs5L%2FAZHNLU%2FslYZsF8Y09CH%2Fwy%2BDiP6M5UlPGqJ6joJ&X-Amz-Signature=468f1aa73f689c4e1da7eb65ff63b5944580e0379fcfceebdbed74b505d63418&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=7159fd714489173ca13415fab09ba25cf6ddf5f148bf66c4c72c9d80d2546d59&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJ466MTO%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDGwFsgDuPVHZDP8GCfIExi7fhjaE3z806foOfriy4%2BEgIhAIog%2BRAOBKXUk105NThRhqhBDFy31QVKrAYVBVdWTUtEKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwTeVfrneXNLog04loq3APHdQKRUueRQuOH%2BKDfbNaJvk0fatjT0sU1P7h8DzQg1ofWwRmZerFOVt%2Bh%2BXQkauUjvyFPm%2BFOlgBma2tsmptjJDtPme1mQM%2BIGFBj%2BOaaXWsgn3I8yA1xJ3bOFwQxtJnlzJcGaEVbcrnuUCntNWeiYqMIARvWKLdZ%2BIUG9yyU9u7ZG%2FWO8jpmktGHuAIM4V8yD3YzSXCH8J8FXakw5JHt6bOMatmYQFlVo6GUUcbq0PQ1M58as8A4LrzQMuLejXy7eZWXMKPj%2FZhVivBnH0D5ij5fEllO2Yjqeqs%2BncJj%2BpIaNY%2BW3mbOQqLLxw4e3%2Brlk3vV6xQoaLtbS%2F8KzxxMsi2T73c7F6FgcCcCNnGHro%2BxZ6H%2FmTV2Gxz%2Fd0z1qMdIG1fkoWYAnZmjFOqtwQJXYwFhOFjioU%2FtXKwr1F%2BiiTufOiRB3BfPP7E220OZ0Fuibn%2BDrl9Gj3S1XhOKLG1x8hIcTtMw0opyF%2FPZPN3NrngoskFaTvKhZIvKklNzRpWG98H8wK81baPmH2rRqBO46XCJmHiCXsu2%2FYC3ZoCDcg%2FpNpBE6N58yUBENtIadUnwDoE3k6C4VQa4a7EsURRd6MrB%2F%2Fa5MRyZV0qXTOmZiQTNz62dfHuEs9hMOjCCuq%2FQBjqkAd5kC8hIloovWBvshpvXCo%2F1%2BqM4NRM%2BrkqRq70Zlg%2BeGptwd30sTngemuUeoZhjlYSrfxvjlQeMJyy7Ii0k6Kn53E%2BCBqzBegYpl4nC%2Btnw%2BWNu9Ij0%2FZzg3ereS6krHbi0zsKrvMi0vwy9X3P%2BC2K%2BfTiBGJzCEFIBht4c0oAOWHD624RMNCDs68BmNDHz%2BLNDTiTcCwh4ie3zGco3rAd1Lm08&X-Amz-Signature=66d18360bcab6d3cf17529f78a6d52ce8c3446af3a4ec6f6eaae447f97f8accf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

