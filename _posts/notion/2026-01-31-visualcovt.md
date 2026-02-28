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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=cf78581386cc6e65388bf47a0f1b6bcf5bfcd9c69f2ac12c2862df25ee96546c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=b9ca1bf3cd1a3d3782496e115b2765edb29edf2f74df7ee0a5a63584f1343c86&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=33ae695d01c86b21171ddb5e46829c9f69fe4c6f03e670743acff6daa64c5caa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=60ed7a4f9d6a33d9eb71174f232ca5adb8db8a7176d72c36adc83042d1e42e4a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663N37544T%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFXW%2B5J27fniEjz%2Fwrb%2BujEEGpv50Vuv%2BFoTH1tghVdiAiAdrvCLWqXplva6ctKsJiznVTOJ0i1xRp%2B1qR51rvruACr%2FAwhLEAAaDDYzNzQyMzE4MzgwNSIMtuH767PNLSRbm15LKtwDBG4D3nXqPgKrzaJgCE%2BzdSpk000A9R0MYPo64FbYchI%2Br2LBiX9kK3JK0mBxG9J9fjaJpbnQt44RAnR1pfabdlewo7PhkUju7RjGaNUJpxAVl55pP1O02aA69YskOdBRU0LKcNoGmrACJb6oZifpjS1Eb6VzPfjmNKc9G6WxbKHPs%2FSqrKx1jRfkzNZ1v8MrhQCZBJ1io%2BwrSjFqZkNLIfrUSRRZcxcQqTZAp6%2FhumZduclDSNnSOlF6a2wom0QANdAzNuRzodpnI9j2LR7Ue3EIkB%2BVs%2BgGAmYo0vXG%2BgS4XqtQIDnTs97L%2FX3Z4%2Blls%2BJHcz6ytUISaZPjtBwaXapVd8nZ0zYQnXCJG9bMoHz0RNTKA6bm0th%2BPwWt7iIr911q6EYd%2Bm6QfCNGHG7XET%2BjdsVsTga7QQ69bVT5x78jgFUXISva1finGJu3abqwFoYrQTbeEPqt9yaODfvYgtWnVoYwYoMXUkQIcWJ%2B1l6y5vwGpMgfepvINg6f9qJqNDmLoX8TaTeYfegBowcZTUwWN5Em703BWKA8kgcDUZo8eC9Ovtd8qHmsqGs4GskryJoWoy%2FI9mWXjXuzLoDVCku2JTXCbBobn6iQavwhEwuxcayLDdKkfcXgv9Uwj5aJzQY6pgFY%2BYwYiQoLU5gPf00n3RQQskkhdSaXZne%2FyxZP3XMHwdGdpXnWeA%2FZU5ps0XGEzcARcKjEs7nKLGYCPuKsujiLtGEu6liHZFhswZlaQaTJpr7cdNyerjgln7jfxAd4itcnPYiZfXMNtbNPILb8iLimxsdNx4fjvulrN%2BysblxWOUAt3wmWjLMbTYcX2tqvg9bGm5%2BJjO6NMmxwYoFgkdjMshsQuJCh&X-Amz-Signature=a2e39fdb1f3d3653b9b47984cf70f8bc28241084ac9a2934d7450b9e00936eb7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UOTML2LT%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGtF%2BjNZCrhv9yIVMbzkHirGBr%2FpYnyb9MthWLgrTRYwAiEAnxHZEQhvxqTWuSF8ncD1VmRcQkblshC0Q%2FiAA8IKouwq%2FwMISxAAGgw2Mzc0MjMxODM4MDUiDDylwD%2BFw27PJfj9NCrcAyXFYPN3l511MdGeQcBsslLuynQAZBUi1UHhvCyrnWHzu7rRaIeheN9%2FfWW7x3qdLhiUYgUVV1PhU%2FyfNB3lkeaurXofD3G%2BNNECSIDn8t2y%2B7Rt%2BGJM%2BLuzXhNTncfMtW6jsOixFEdL2GPDC6tVkLFH%2B62LMrVYYOm8hgiZ0HJ%2BcuBWZTlrFpStYXykriyf4mW%2BDeukHxY2qJx4TqdjAEH%2BMPXEbdhEDesP82HZL6IK9HDQfaKZVP2PqshDv3mVenRMe4dGfVDUID0GA1sHfhjKD586TYTdUFDD9eFUyO5akw0n83168kK8NeeoMflN8%2Fo5fW97WPrroxYtVoVrx86p55t1jk%2FtvXSAOJ%2BsMt6Y34zNG%2BkIDvGe8kyH%2Bi3Z%2BuvgDpbBmfSzibZNwAlPJouL576I%2Bj4dfnHBglXA1zW45efU7QWxCEvML9AynuvRfzGSBwMkPXQUEWUnTw08uIWj8JwXy0HtuHCzM4aVTBm6URC10I68ww93vMsMsolmrTJPR40jiFv7Qu2kknJTPSbKx604%2FfKSxmQnOMUhi%2BpO1fvS4Z0Ml3o4UB4Vx27QyVdtX0328hhXibf0ZZVaJ4EO1CvH3BjqcetD%2F7gLtbxvRJ%2BF8gvjtQleutVMMM6Vic0GOqUB8bZmyXS4mkg5F%2FHIfqKpHwlhx4vybALhMAh1esdLNzSsaO3FsmTD4prCSkYNOLqz8vq5JTqqwW16ttA8OfKBfooiDhOBifd93FQuyO2oLVVEyBDCiaCcnLZLlSUoJI2FRHe0WThWmNl0Wk2adsYkPHnpdqY3%2F%2FPg45dFrCfrI%2BSGo8zN4iIU1vB4ySpd6%2BbxOQt8lVYCf2iOHd27zBxxeSi%2FYcPE&X-Amz-Signature=a504e9beabece8671a4ec4e7474e2a89a4ea0f3f8bd4233e23a436834be9c1ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664L56THTT%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024231Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDPFHUeBLc9OWgFFc7Bh5iBIeBTkXPrmLFbLwZ5%2B17%2BKQIhAKjPNeImFIv2BQM47lJmqDW9npJk5C2LnlQelaEI12f%2BKv8DCEsQABoMNjM3NDIzMTgzODA1Igz0pmWVVZl6xz2fV8gq3APW31yNRk51W08QLCkn2fXm6n3fKkcPDz9N6Juy55vcc7HVd1fZI3SVC%2Fw2fVzTdSsndvLyhhXKomWF7MBHslEaGWYGvftlEwXABShzngXAUVN8tUWle51Gu4oEvkcqW9qSsM0yZ7rgvKV3j3sH9umjgmQ1ZFDIADSUsfGvZ%2Fu2QuNBvemd9IV8i2iU201EH42lHYeup4rxsLY0hlOoWQ8PikidDHgpNDvWIxq2E8rXjuJgrJFp7FQd1qww3%2BVWDeYt%2B%2BTMLeG8IjM3mMM4kCPyBU9v1ITQD7Y2KskY1OoyTrccYn0hFs%2B%2BZYeFrpOjQQFfSKcqAg2EGOTckLGhEpYBc1AZmBJoKzyZCJkfTSo4jcywfG%2F402n9WDYIX3%2FE68hGv%2BsOa9r7WYtMqyg7QC%2BmVd6RckJIpmBnqxY3%2F%2BUW%2FZ9XFS1L0DvD%2BlsWr1bGLwQgmbbEfTC6SAGa%2BKcA94o5kjWmkVg1BCRy1BiXj5XcHpWs1kdPgwajci6gLsm%2FmY4rUv4nLIpswuLgZV57BsCGKdqLXGGf6r9Obzju6GbUaTh6yv9l%2BbuIl2N715vnTuChqfbSaDvQuqQsHjTE2Jy7nKkVTt5aw4xFEIliq1lSr1kDgX0xGPANNviwczCQlonNBjqkAa79Te466zMgIiRrLVVHeHmlbdDEWYokOj0XBacUPbY1nAoT0Ycv4gbJSF7gD3dqLqs0wOcInQi9raXH38HAcxp9tlOhJldQzZeLcZx4J%2FzUVcF%2F3XdZLFS1tLxqGDeIJQxHcFavwlaYv7g8kmgTlGPaVpp0fxDUq7MR4FfPWg204AmNg8GLHUuQqMRUsFEfOt3o7bA8pfSpSDA7vsdKiXj0wnkf&X-Amz-Signature=ff2a244c659c62acd120b0fb814ad07ef1e97d2361ea4fd0f7bd0cb4c7a35d2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466476N6XJD%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024232Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCvIr8L3uk%2F5VpEWEFCh2OMwfXkeZSgSICKYNRALdM6dAIhAJ1Cpk0lvjdETSEg2RxYBuiYWHOqgM4Dj%2FilpxZF%2F3zGKv8DCEsQABoMNjM3NDIzMTgzODA1IgyqMalkilA8V%2B1%2BJlsq3AMR6rvD7XSJEw6YwdmC3d88B76c8AxrfFFOjFqx2n%2FWJPDuLoqOaCZuswe0td%2BBK8xiymC3lZ%2BUFAEMPNB%2BE%2BZ6rpgX9A6YCpUtZb0LhkfLGqyKMA082%2Fw4l8SuDizbAS9Aln8VSlf3diDOatAsg9BtPmgdm2o6gB09v13cp6PZz0EVOtwER9pTBzmRNQApsDe8dgPI65FAZVyeX5qhDy4w9ZkQnpr1leEs%2Fdu5VNl7YxKXLDRmodmMQGK0G%2FHOXztkWO1kfq2qIBS%2F4y2Ozc%2BL6CRr97xajt8KL8mvu2d5oqI4Ptih%2ByAmiXJC2kOmtGj%2FsgYppWDMeLht4FglLErzAzTc%2Bboct9ALbwehhxYLqputGN00u4SfdwAMPtd8xlHjPwQftKNVeUs6OhWkqlJz%2BvqzSKn0eK0UEsEyOuSsDeZEyhNhpodE3pitxyytl3YQNdHpuAP%2BGuJP2N1mj4W%2BtyZSMUaRakbRZY4BYYY2rn1Aw0l28TtCWBBPfwm0wVuhgsIA3UyGy9%2FAACzK5A3pNzNlCb2G4I65CW8BVdrtnNcnxbZCeh8HjHWdKWlI7sXpQyZJRlvMyJoLsjjVsMcHNP1xgEZ62xXPakZ%2B2q4xeZIpGks5ETN0xHLPxDCVlonNBjqkAUemU99vUmw6ZlamFWh7mkDq7Jrm8Xvrt3XhEyE6chpSdbScrnh7KhDQPJjGk%2Bt2i1X5c2eDeXK6Eyz4d%2F2MV483JwM6BIAohiExpT%2FqGkb83LBA9pBXa4A0dRtgYe3VSPXx2N90RIvXyAtvMBbPgLyq1jVGVpIdH5Qi5DjQBX6UQdBpKgUuJq9FL0AIXoIAKEJfEeTnPCWaoEwh%2FPyyndCrzp4o&X-Amz-Signature=61069ed1ede07f09733985d898fa6ba8b7a1bc7b909d7edef85c1a7cf10cd735&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=22f44a04456d1235e8c96b14f79fe937f7c22625804f292cb3d24569ad22c3af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=e5276f4cd3d415e43966b16006260fe25ec6225185d15fe6a30528a1af3179fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662X6BIGPU%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCdAQRQw3qVzTjOJ7zqmCUneod7fERleccCoUaN8UnI2QIhANVAKEeqHnWkNxOaAvDu4znmY1VVafsh6T3uksUL7O%2F6Kv8DCEsQABoMNjM3NDIzMTgzODA1Igz0Ai%2B0xHUZlKrFn48q3AMr3%2FQAFcXDyj47pOoQK%2B3FHvBw2sn1quauWNqIMywS%2FNDBEIM%2Ft62WLtvP2RMMJq2DxaSaHoYkNHgBhI5OqxIC8aryyEuzCIPtpB1LOZGQxv6qN%2F8vNgUGxA2aZajBMrFLcX91fBJART17EhvP%2Fv9tdKndRJoasvzRoGYcFfW5qUMfB%2F3YsrhlUjQYtJDh1bKBPkyDNbukIgN4MHGVtwc0RnTNAz9OcRRvqa3M7bA69VS183wo0Krd7nbzTpVeKfhojU51nE1dbbv20iVxEJMOcScZhaC%2BnigJOqtExlGNVkzW6yFLMy00nU980Hwqu%2FPWkrvgOW6AHftnmGFvYDF1L1gsWf9%2FMVaXjGNpGj0TRHEsEFcpIGgHBzYREJ9Lxn9jRYAcFsjDztw7jgYsgBWKBojjXiDWis%2FsyKcc16TZXYV%2FjW73e7cvnVxvhiq7hbzsMCT5c4vbZwF2hNx1%2Bn1aCkde%2FUeqhFTRNX6f9glqq%2BZyvGQvaMD1AKhvaG4mOdF%2FMP3endwqa2HX%2BkQDJelJNrnOnJ3ckwOSCsFsYynbf%2Ft%2FEVPmsy6EPzVboWV2LN4c8c8oTFSg7IQVNtIOLF0GgvTY01UW93aDM%2FwDeRQ%2BdKNBDkmCQCEFXbyhFTCClonNBjqkAYNCKOZYEubKGgeD6GAlJ89cVph30a7bDIqaU3YNhJpuayacOnNgs9JMaE7Z7JRlov2EbT3EyRafmuGhH4MVvnGDxYTAq3GUq8%2B0CKPVAFZ85F5GP8pZwPVDLNbrVpT8Emp4FQSQQGulZMzZkUAQl6FMUcyO73yrsbVrxGV5wzSYdeKxjQzjyoKEFX3A9hngXaOgujpHB9Uh0VJ%2Bxeg5YfQCHKiK&X-Amz-Signature=5d33c6594f0f3c9b647446e6adc04be2ebfb7ca4e9d375363c293bccd40718b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=c6b88796efe20242e21c0b192d5e6106573d92c1405d12c2e95ef6c8e58e3bcb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RDQBEPX%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHPaTaMrzWD0klQ5O2pflVMyEw4iZfxeWMRqHB0Z1jY%2BAiAoT0Z2UzkZPxv5LwJHUr7ddYTpWhuwJthokUVkp7Vrair%2FAwhLEAAaDDYzNzQyMzE4MzgwNSIMS%2BDs2CGWxChmklrtKtwDLBtX4XEjNAIBTixs55zElDz0Ihvn%2FtPpDpF%2BrIDIS9OfCS1CjpL9WOoFpsmGHBSshGM0UNPs%2BeInG4huYNdQkutSVZQ3zvMnbqM%2FaAfdiYeke5tNqPap2c%2BRtjmiVfvJMwS1bVsNOBI3L3ppuHc95taS%2F%2FFtj4dxvOiHMBOH2Y8RRciNEJQl781yoFnM%2BQ%2FDLQ1b%2Fmc1Yz0qxb5WaXQ1KnfbbJFrVo6usTFTKfozdwQbbh18aLVzDCWVKlhXX6jJHcn06G7Tzepx1%2BIC%2B8emZQgA6l2drAiHXEAO7LcG%2BLvYreq9zG52qnFEXx8ya0L7hKkJ%2FjqxCgpWcaTM%2F6m5krkd76nK1yWjCB6DolBDB7WMHg0%2BQ9DtQFj6SJzd%2BbJnoR9fMr5l7RhO9zaW4h3gPQd8wT3Aky%2BmUK5FTgBRqUKyiVptqDoyrERmok%2BjrzW5SDOS7hzWoz5%2FipL1CmiY%2Ft%2Bl3Zz6REarT8Yxm9tetM7oRoPiTZ0J5EOlXSbHxoKBGFouqrYBUDrnp46gWyPCvzax%2BvoH9U3XH5al%2BAlSPEbMH1ZCm5S9gHJhgWFcTVyTSpdnKVZ%2F2OizhISucv5%2Fp7vUCi0C9ZvlWFhi4tIVAJtV%2BJ26UvlxZzhCtp4wkZaJzQY6pgEzSIPBFsh9TihgMkbi4vooRzSAwI9jAxTXGhDFE0lzIfGQ0Wm3GAAjR0eywpPO02Sp8CkQdDtxouMPB%2FDIoINIMmsUDOTlQQ%2BDmm90%2By9n7%2BHmirl%2F7K4TwpTtTgK3Fgq1G7fOyAuSKTIlCUa60QJ%2F3OBhT1CqJQrs%2BXBp%2BqodNsr5PveMPQWmSxhbmtdtDIm5HGGHa39Ze%2FTfzWYNkE1V3NOGL1%2Fn&X-Amz-Signature=5b863ef44b2d233378e52c933de15bb864b6dbbd510bbcb39ff0e237d4826ac4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BOGVIU5%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024239Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFBMXg1sJ%2F42uA%2BYnJs3gXHXwuqNvJp8p4LFCzGdrb%2FjAiEAsa23d9nBats4tAQUlQ9PcruFVB7qgDCAXSpo4xIVWkEq%2FwMISxAAGgw2Mzc0MjMxODM4MDUiDNIveyfShv7qPDwxvSrcA1cKwW3k5vDY4C27BcVVUMeJc65w5DU7YDrwDHCrCIcBTfcz%2FHVzFdsWYFaVWqL4l5b6q%2B95KxYeeNqUs6G2MFU0%2F9rjdVf6WKGawaRHF0eiMTt92qpkt6E1ikw0ZaGGQjLtyDt%2FaAK75Dij%2BIJ5lt5EhqvOwiEzIuyGpqWXkmCpTc9Tqltq6HkH7IOeOvIBk6k%2FTVaD2Z%2BhxfhpCl1ZgyHfTqPOmM16t2Q%2Fw9E6YrYtsLf%2Be8zMRa%2Fr7KokD2A2m87d0NVO52WK8OwcXK0cXkr%2F9mcK7tRwZbX0FNMGBBpSk1aKOl4pD4V2GKuSIEZdJusd35jXb1WAketxmAV59qJVfM4jl%2BrmZmwKJsw2PKLhCPAmkvMqKIeCMOHqofzb7xYI02ribK29hIG8UEp695kXdBIb9ImL6YiLUzWSTyBPuMXmaDdovCWMgL%2Bic2jkTvphe0CS1o7elgtGSeRC7FhprU9jX4TkQ9Tb8HMiPJ%2F3sPNiROMPFrJic2btuN8nSW975riTbNwYfqACKdAHGs%2FNVq5ZsBFoMr5wg6wixIh5WrUTfXhBQ2f3%2Fc7Ley9kZ4bt6gCtnte23cKlYOQGHGvGfHPQR6XjWzExQ0kZyxUW%2Bd9OdE%2FVvlZxHxIfMKiWic0GOqUBe5YlNuIoxxRgeCR91ZEhrI4AGrxZEF581%2Baj30c5RjsG7Y1erLPKgjrSIkYm1qKGybjnxXZh07x5NW7YDB2ATjo6qkhp5ZDlt8xgFfhlwuMZOBym6dYBt9XGGkUDnxp71OjdCxI2SXPvSvsTbh6qcpI7h2L2jlqrla8wVsCN9ugoWNMNqlfNnmmkfiE7PI89qIlIqQYNxRfwlGMSLgXMtBZdRPcm&X-Amz-Signature=0962698d9ec876cea34876e091006a8c3bb99739888170dee502759f333d352a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UOK5SVOF%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024239Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCHx964D3FWSvISIUfY2YOJT4X9XXbakwFucOps0pq2VUCIQCWlOV%2BRmzut%2Bax2WHOUdClaNJ8fQC%2FQtm1Zzx3lmFdXSr%2FAwhLEAAaDDYzNzQyMzE4MzgwNSIM1Icpn7Hh4qDuYgs5KtwDMWaTTXa51JGto31OcEBoIcQyOj%2BRcsg9zlIzLAFR9i9AZMRIpEnunAJ0Dl17uE2NbVkE%2FGxOpLuYikbvkRgxiOK8KbKUODfW9M%2FLijlL2LNpz7b4nvMbOy1Z2Xg4JBCZbTfTrFNyI9IBlBFq%2FA%2BqsAoGjqAX%2FN5An6uzkOFA0ubM2E%2FsZiBAyLddLApJXtmdqavnngVePL3UX2ajXp3Nk1XPfywthW98y8GWhIwztf2xhbZATGz9fti5PLw%2BjNZtdLDoX511IKpa%2B2vupdXpKsgdvbhpyByGA392uS1BmVeXuxV2PWkGyhXZTA3UhwcryDfTWNWHxC4DajkR9UDlU91W42B0L7QwSvwKblumgeLc%2BzvyOJoExJ%2FqioyVaMl4PGyFB62oBv6UArosCzmDskN5H01w78vGZ1d3ChsyU%2BCyFOtwMgnuN4DtRYu0sWoCEktnPIxt5JvUNy09y9fxOieYKUdMfvlg98uUhzUC3CjFtEuVT0wgr6EBXq1VhG52Uved%2BA41VLbVOx6geWdQ5720WvYGgnZsMLmDAzQxc6Lvo1%2FCrSGNL0GO6Uh0lnZYKalNB2EqMur8XjQnn3X2tI2YqdKV8BPlraWJqga0AFV5yRax2y9DRG0Xng8w5ZWJzQY6pgFYaA7U0zVV0XbVUpoB%2BmnmKrZa%2Ffc0tl5hWcNV%2FVaowmTm0x91VlfX6weUgIccpJQ%2FroJRyPxItvCD3sw0Lr299juNhhDtxWvzlQbCr1fVQ2Ol9GxkzyoKcGVJRzB5S0fyMIYzN8P%2BrkvUgbAAWoSS%2F9jEu60UjaHPNEl0mOFZHc6omuxKkVa%2FARCq5ZmhNv9lE8jLgZc3JgE8jSqMrduuIm4l%2BY5R&X-Amz-Signature=7d6d2154306978d4f1399b1f782f5aa1c79c5b4c8e05eea2d540a46c4de4bcb8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WJRSZSL4%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBds7YP5jV0mgCAH0Ctdjkr4vOZVE%2FsUoAKGnHv1P%2BAiAiEAnymO%2BVccpsYiPCNPpz71Ij3dfKReNZZE%2FOe2L%2FVHGVQq%2FwMISxAAGgw2Mzc0MjMxODM4MDUiDCBrxPSLa3dlJQOByircA3T79wyAOe6WgB%2B%2BRud%2BZTJyXWJZjB1IWX3xgH9mBBFKVi3PiKMBEoNa0ZKNIzmAmYDPuDZIaiPpfF1oiiLkRGlvOq0cBAjq%2FFMfhSOx5mDYmJnWtdkk7z8ZJosvcSHARv86LfZ22Fyg330L%2FmczuSUcKyI6iR7HkX895FhkZ0fWeRYqWvZYFXDrMDiDPNYqRDt0bIgKpztg%2FraOjZFxi6dSbPOAv9fnbkJUG7gGPvrDpbu64xRcRgGcfqnMaQ%2Ff6Z%2FaLe%2FSghjYy5WHELaqhBL4sgoq4GjdyNSekX4st8fydtxsoyGRu9hH1VTc6y4tBwJaQ6yLoM%2FGkYv%2F9B84EcHwDomppOMpjHrQgDJNFPbQzS60HnzcPgIPjeQIo9Qf%2FR9Lvj69HHRolMSgcipdnXvNwFiP9SF%2FUQnJfcCz8zI%2BLBO8GOSBGLJzeqc6l3MpYo0epxEBUHfCZ%2F68HyNChyZ5Ekf4JaBIFu9TuFb7fZOFaiGW5LJwUX9hjmYUEvqntBlF8EbZ4AtuSGAVYMRhqJG9VpQk2FGgiADdn7Wig3Fw0opT4dhvhJRymleDdTHwCpUAKoaHQcX68BMs%2BQouWcKu8gliAepFjZO0rLL1vm7qt1iieUnFAYb8W8XrMMSWic0GOqUBLYAAou4jBQYebJBtGwD80u%2Bs89v7ZnWHWabO2q%2BfxSMtVcBBg0c9WFNFnJOKA6e%2FLqv3mKU7fgXFzHPn%2Ffup16plcC60WOt%2BnoWelJ3KDCzRmsg4hjQoxx442Ea6IWZUMUnBAHxdaRuHxTr55sk%2BDz8c4Yv5QkLuzBBuxsl6JkEODjVD31e7MYPoxeKjZIPHLpj3gyRXW%2BYP0G5sUmct36v5MVap&X-Amz-Signature=83fe40274f092336213cb785291f64c1218051dfac63669399260358e2d54f9a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=d86de62b88c22c25037b04459b4248601ec765bdc90454e070e059082f10b8c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UDOFB6DO%2F20260228%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260228T024142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDwQ8OklKbst7KYXjQ2IdtjOfE4OIiQo9gD5OsSmnS41wIhAPdhZOTOvdPuYfPBWyISL87oZV0iZmkXeYsU5vHFfjymKv8DCEsQABoMNjM3NDIzMTgzODA1Igx3GYV3h%2BKh95gCVfsq3AMkPN5OHdWs8TyMxYrz2pZJB6ezbzkQ3ubRGXJYQC8nGPWtQW4k1qk1Iy6ZIJ965pCd0jj6b%2BoP4H5aFPHvQVw3FFbKSGVFUYbxWYNlHzJ9UHIYbVXwDodAXhvrRt%2B4BujwYIIGCKl0Z110MtdFGf31n1Dv84HVeL%2F5v4Xmms5%2BsqY%2FfO6iHVm6cZIHfvX%2BEJS9r9xiIgobupV%2BkCAaTnMNh7503eIvvNlkZizJLf766kC8526y4AZ5xEDjhJlm02cjqkqHuSc2Fgfyo4la3rouMh3M45uQUrqjzSrAHqXr1gSOlY37OJvxXZ1vN94HabjWeDDfH%2FePlMHde%2BY26t%2F2uoo4oCgSwUAnp0h4b69wwD9NbzOfq%2F24hhTJ74sg7B3Sxg4bsfwKuH6cu%2B6s%2FmVsjh3KXocw74IgPGDBToMxqqwCX%2BVUghvwSVlIudohl6pNfXjQv%2FbNlDa%2FkSsS8pOiZOljPoKZldVOsjYE8TimFmYtofD5x3Zcn6brsLSN1d10b9po2btR6goVqN5PTHJXZ00UEUjlu5SxtISfo9%2Bc308zYHU3bvLwrj1gWzGORqj05b5ihD3egwKkylSTumfOQby4ErNJNnthWlvqBk6%2BmSJPVqiktEnGrIj0tzDxlYnNBjqkAcIhCrya3o%2F209GEVyri7qGNlCo8TFBySGqdyoQ6YnQJl7UxC%2Fd4hc1Ts%2Bt5y1zzarH%2Fz3yHN7drPNEWQcLTyopBZWZ2Dfs%2B5vOe7eApU6sEwOm9ULqtYvOtaB4s5qtxk4h6koXW6lMT2QK24BTpPTUpVZO2dzduGDe8qmUqdVIWmYhjE7WGTaVaMwZt1qz8lKhg4Hs72ik2vdgtqePdy3Qa9W5w&X-Amz-Signature=2806ed807791313436733e8a9f859174ea12e8ef737c374b0173cbd646b9ccab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

