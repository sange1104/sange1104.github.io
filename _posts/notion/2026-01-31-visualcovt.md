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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=554f34573cf0ece6713bf60614c151a373ce25d2b788bfbfec44e052f274f061&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=8843dc0e1e09cec909ae5aa1c5a15aba0c23a99cdbb9805e0197bcd8d8f703fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=b48ded1861150eef5892d85d2a3894ab781b2d7637b18a03595071a128f214f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=aaa4fb768e7bd9c8dac1fa58aee177db3cc719134604bd075901b39d286a45e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QNBCTIP%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041351Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIHZvbsHM%2BhLICgZN0uLErIcRuJvaGrK4%2Bp4RcWgJ8NtVAiEA0F3AP1ZLo0yalZETidGn%2Fal72uRq3e%2B2d%2BL3srMCiZAq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDJ%2FzwEkrAPyIL9zWpyrcA9CKEhwy%2BQjBoe4sjh%2BToRU3GGa2XF1xGOA%2BhH5tV4TY%2FtrDmoTm1a68AW3TWhhdZF%2BDpuqVsHrlLI%2FdlFFoBRqIDd5i7aNk5IrTgd%2BYa4yuwsQ0xO1VkeZCqvKph9WYOF3JGEkTfAD3Enz7iz0%2FLz24dnJ6au8OWUfsjK%2FPdHw%2BWcTfXcyRrmgf3ijfGDXni8TuGaS6NbdSrTcASZHKx5we1hYPtjgU3YA2mWSwvm%2B0zBTZZv%2FtZpcXQ79j1NUwuh6tF9zwiSaL7ZLnlGKG8t%2FyX6Jg7blCgR3ATqR9hoAbpSvbdCzuD4tk%2F8V8%2F6RAO9%2Fo9fvK5mH%2FeFd1FpV4hIhGntqWALmhG7GV8D%2FsrrNSDCwHO4rHDW%2FvbO%2Ff4HDjc0iXvZ1ippamK7oCQ%2FesbD%2FEcokZb59tbTrMl%2BB46Vg3vYBlLoLIzaYP8AsHTz6qj1566XWPZnyur0PdU7uRpj1KlH38OD3Fdku6dQYGi4pEwI%2BvL%2F3logzicYP5G89DqTkQw3ouGEGEWO0ObuIkzJFvClzaKGlpftYE%2Fqnlcsvon2iW9TN75xdKUwNRIaQDQPInFsSxTUGNv%2BdH4RqpfxvaxoWwzzSP4mvN%2B99VvlRfswxie4Aqe8UAfR6pMNffj9AGOqUBcIjyDWQN1f9fDSqCVsaSZcfGTm0RcgAcCvhXxHDcATBKcHXO5uM5QvZ07hO%2BSeDaIG9tc4ZfIEfSpOTw3mB6Gm2dLCCRCEEhvyNA0CvQeC8wJ8R%2BxM66adWenTaDdB0xxDsJHxmAjwHYqOVSp2LWzp64wK4GXqlJVYSyDbmQUIC2DttVwRA%2Fjb56Z9A7Kl0kDcBgXQDBjJoYKgDmbrIQvgMti56R&X-Amz-Signature=60ae82f6eb21aaa00e4cea7d3eb2b237f01192daf440469c1fbd3cf54c43b701&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VENB5WKE%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041358Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQCCVJdKzR4CnfCyqZB0tUyVKQOuLrf9J0IqcA%2BlQezzjgIhAL8plktg5fEJ1Fewz4fMYe2N38RsJpRwWNVA080g6YJ8Kv8DCD0QABoMNjM3NDIzMTgzODA1IgwGID2na2nIBN6LQJUq3AM3N%2FVwwxt2TYnMvr1poK2vsQbx7wOPj%2BqZeW3%2Ftw8w6xUuJe43RuEhi%2FI%2BUrRQTI9V8ltTqVZ73Wz4Xa7v5nZCPkAhMBFmxQBBHEW0RQqjpQ1lG3aOZfWbZ9NzUt8EN3eozzjWPmQ8MPHbj7gJpPjMBDkW8aaySb7ui7zRV2Ioi4vm0QMfuwU7UWdv%2Fb0fh1UowRt8v%2BPtV56ym0Bk7RUv8rlA41S7Is%2B5HtYWu4B5m1kw%2FlJtayMdr6jebV%2BG9OigASs2AQX5pmho25QcXv0CF%2FR7Cl5mlbxFyMsXn9QEFwlrlqJ0VE99oRCtleRdnUfJBKU3IinNPV0k7DeeBIpCPKK8POAzw%2FSvMgAYvfuU5b7PcNyBCKRZtUF1OtPaaae4C8Jw2s1M0rqnIcJuJuSlEq6Ts9AGb22ua%2B9Cl59GqYTGku1p7tahkeg559FTejjRD3JT4nS2Twm3la6lDb8gV9jKdSSNZu6l1oGA%2ByO%2B%2BuGnUGjk0FrKq57%2BRKIY4n61UU3cteceFi%2FEWOFpsMAY8pBdeW0PGnBd%2FKxCwePZzxzGIygnnXGKKlBZ4EuHKEmpss5ko4B1GI5XnCC0rD5nFOADjJ1SNFJETIowl71nlbG4pEHTdDGcZs8qDzCT6I%2FQBjqkAXrDZ%2BzBfKzUATPAvEE1h0z0kL3kPiVCDlzDeavn7hV77rRRoY%2FzvgFaC1LoPQM69B%2FCj0bBXHY1GFAWOIU8xYFM3XpcUu6%2F6x8ih9kVHjH6omMQcE7O1ktUge8IDVhA80s2D1BCZEZXWYwId7u5TWWUVfMTsNio4ZqZGYwwljRFQMipkA3kYM2kCQ2CV0uRTbvRf8DQl%2BrdtgMlFGzbdGYKT40w&X-Amz-Signature=c7bd2d39938875987b5aab99f8810682a344808a5e503073343ad85eca04f463&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RP6V52UN%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIQDdjvm2%2FEmkLcOIoDsHIk30fOSkhQbd7t4T17c3ayyRZAIgP70cTlAdOOSiSHJ%2FsCB%2BFDSYdzq0LR88fpiuxclcyO0q%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDNKyzDTegBk2jbg%2F9SrcA7phUSlJYHvfcTCkeNZ62ExsoqfhzBSKG5hNVJG%2B8qmBCGDcxUeENE6ZezVg7QXkCfC2iNPkbGldW7iNnCwSzCcfEGwFjPUEGGdFxl4SO5XFCLLl35pmKrNm521BeJT6TG%2FCM69D0NGWuQ7e27zZrvthLcRfqtQIwq%2FT%2FvnscMiSZknqMg3f1G20C3LYHZeT83xvWxA5TO78JACbBBC50v4mIrvLWVh2DF5OoFUpjOn3DYo32BRiSHIDTj8DWfN%2Bv9UM1f%2F6RVS4Hp3ZadYbA2kgFPItsLJ6B7TzgWu5YRPJgY437UabyC9buTYqupPWzIJkBUcd3Fsx3v5HxBZMNnANksAP85DX5RP8NI%2FDxlCpyuTa%2BjUEvWmzRCXxyn4nOg0up2lt4Ef%2FOdul9Sa%2FvNWo%2BoNiz0tUwsrRK58FhprxdbpS8T9F14IPzJvQyF4DQ2xlQ9LqtjyjzIpmOrxO7V58xyNK%2FOSpcuIJhpacYxx7d3V376yhsvGwALfsa3miHOwRRMp7ODIwwcSvgaBH6TwsCdB6CNsYiXWZR6X13iYUrM2K9ha8FllCd7niroKTKwNvorCVrueP2dMbRbf0FLX%2B3QzWQU7hGh%2BtSvwexgRL%2F9E70Qc4B418zsdtMI3tj9AGOqUBomkMfsOPUVdjifJpxeSiy1T1KemQQLMy21t2rxJB4Bnq%2B%2FjbZFu1GIrh88ensVYXwkzBR0m3uchsCwUXBl3U%2BvFsSRfJFdW%2B38EUpdytBn5JEQw5iuZr1%2BmWAVaUBXoa3vRwZUZul3e1ThLt9rPTq%2Bq3t08CdPWqGp27Y3jzBm0V1FO8XTNhYOjISGOnKeUHY5PzWNxJKKXdZvjGRfGBx%2Bhg2%2FpU&X-Amz-Signature=a187a1d76e3a0fe32c02b6e4e066766c6f2fe0d8d5f13bd2e8138d76152fc971&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JQEBDR2%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIQDqRfLXkCeF0K9zhH2GwVOgkzKWAl2AfiSQP%2BiK3qqk%2FAIgYxH9BCuimevGOMRpO0gql0vL8u%2F054eTkdq%2B9FGyg80q%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDJ1JcZ1BxYBb8%2FCgzSrcA9gJ7h40wazCbmIK0NE0Lx73Pgribo5h59RpC4r41TtzS2Yp7jc55EFt6Mj72kMb0XnAzGJPu5f7AixhjpJ27GJrqetpMEFULDOiegmdj%2FggmQHC6ZapAWamuDo%2BLeeb9biDrMLOcULvZ0IIjUX1gI2V21Sp2QVHK09sXgIdmFjGfzJXX9ZAaJ1B%2B1J8TaeUFuLnEFkYxZeY%2FY9xmYuCCUm70IUnp7K17lXshjmPxVrTU62WTvMxuUqttsU6E7C3bRh6cuNL3Lav%2B0X0Zft8sDwfMTkBHFx1WAcNNyrJ4ONEt%2FzraNnxnpk6b5ZYEJDrFzsYhkyeq5EJ9EvNPd8bmYX4xzJlcnv7ilNCnhtvZGe1jzIC%2Bs8uCLWz%2BDRPWGELNXqHNDaWSuAYdhFCqjjlyXZkEFVBx%2BX%2B5IcraFZWh2f5uVjHqJi9zA9vbAoLCub16W7PsMJFMooub2QQh5LQqp%2FFGwjVgZkRrUhqswTc7IO0g8K2pEcFFIijcl95i2YikejsKWF4vwHHtgey8OpbHfeVbV%2Fi0vlC0bw%2Be0gZkYS71YH0UAFF196xYq6FQVW5k3DBbMumxfojLTqTpDXnI%2FcFswKzoF%2F4FDTrmraE3XzLiELOytyZ%2Br1pXZkXMMfdj9AGOqUBUIt98LLIcQKG25xIdi6wYQ1laCuikq%2BnGu%2FglskipHBCUZ%2F33BcoECK8kcsQfx2jAvBhLOBqMh%2F5w4GlR%2Fy3UNMh6YgK8qklJffgnDR3PRWFp08KrbhLQsUKpMw4l4n%2FantJq00XJ8XnQGRnm0VUd16M5QdovrC%2FSDPAigkBufc8Hd%2FuzRO3wjmjnoDevXyheMCPhT%2FUtIfnhOyKllx8f5j76z2p&X-Amz-Signature=d55af708a55167394c216786aa8c378e1c7b883b21d599addac6de1d2953a0da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=4a5835601757423a1da215450439846a424185b05a43cdd0cf18713b6b684f5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=493bc3534d58e99fcb9dbbb25d8a3d58ad2c40ca29836ada6ff0d990d609fb21&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SOB3QK23%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041403Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIEgq8cA%2BO0%2Bk2O169WiCTQ4bSs0jHah5mIrTjUiDqM7zAiEA4XPcqtjMtfUJ56tipZ4Q4oYJ9ccKC8wiFSSc17q1Au4q%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDAt%2FB8vcDag8%2Bc%2F0xyrcA8DB44nAfAmOa2CjwWcYs6Hu%2BFdIDb7hN4ZMoHm1kLynUBdPDzZuSJn0vFIruTEZURyn0CtGo1NEzX7YyIXMyVYxjdWTfrfRdgpiYMT3LZmnj7MJ%2FlhjEEjLiZDPwC67n1OVkqE9TmV6Yww2igkFV%2BGKfuxM%2Fsj%2FDHhexq4TA%2BCaaRP9SLuYzDFgd9PeailRO0Idadbj0nQb1Ax%2BVEBIo1xUhLe95pM40gtnaLQwxuyhdcL20Wxg1sGjgCjFsveXSgvlUC8f5rpQz0XqGBid9xZ2pJqQoHjzRx%2BdFIjfJvClTDEBuiuI49H5YPScrs%2FL7TfnTK6o6MrrlBkqhc7ooP7ppGYjSDWO8cPo9djGBaN%2BUU10BZGbGawBhYxAvLISiMugtK4KIWDRFbaNY44e8Yx5jj%2FsN19eMHZiKgVVne58U4FbEVJy54NiLpOc1ORsjD%2B2E%2F93%2Fbry2TZF6Ewe4pbcgK6kc%2FnFd3Gz%2BTkctIiT8NEjN3Pvf4skIi1mBORSZVxzJ24ybyFCJhP3exjGPuPVwoyKBsnTPIW04iqPbr3RalwEMHYM%2BFMnmsYEMVKsM4WDV6Wkpqwqa8mvAInlsvz687rrfKF4a23rtv0C36%2FJagHFnQ%2FUOXKW%2BTk6MJ7gj9AGOqUBf2dzPOx6AKRt7c8u0mw0kPmf57FTrcNsF71PdvnYfp6eKK33YrkonWllw6SboGSdzoCZr%2BbZPpprB6XTMalSpz3LqTg658uKBbDZWkcfMBOj1WbvCadjkVyD7pCcl%2F1VWLT9Wg1dkErfaJoRCI8PoTsOLkR8KZA7RTdZRzaH2E553FoKiTq0gjWwa18SDYOGdLc2QJjgRv4AXjBT5dkkt2OASOYN&X-Amz-Signature=4460932928ee9a7fb4f553c5a8af103d5bcde851defbd971eb4505cf9cb775fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=6ff1121e20a336e9135d4f58fd5cf79998f4bf1cf50699e940018d268572bfb2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y6PLOKFN%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041403Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIQCmuMiJuDOp3FUsP9QGpt1mwKsw6e1MbOK8AEmW%2FapOXAIgS6JtvZUTHf2fvYqrxJelgc18a%2FxkKr1jIgMdl4X9efsq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDH5SrxhCJnohj0ByaSrcA7m1PyvOgMJPKXkWghJwFWfFT1t9dLqT%2BIuq6Qi4BhfGZiuYrlax6RXGB4aDBxueesyETHW4OEOM9tAaN%2FIAJQCTd%2FkW59AyBhWL2PYFcqHbaNIZxggzJSWvUAonANiWr77dDr2zfOe053eCr9lhFKNgXfTUa6%2Ff7wf5JxDU8V%2Bzc3cjU34NLVS9c205RGkhjNtjZ5wbViEttT991jk7ycogNldpX7se8KmMYSXO6bNrE0iWsEdI1RUmG3d%2FHVmpSnw1153ftxZ%2FltVAMvGFJKPAkBws8sm3PGWVBaifukyvFCNmeA%2Bfgn4Fd7zTokKXR5Zoc4IWk4Uq3Ngqp4KEe8rZ9Auaxe1mTifbykaqObNjZ5ZuHaLZSxSSesKNJvEYBm4JjSqh4gByZ6nDkL6psR%2FIhWHt4gNH9qVivETf6YelGTvcWR8Cu%2FTlksw0%2FHJ66yr66R9gt2afvtEbCW1xdiM12LasfXmTegBqiUXOwIwD5H9y0qlL2xuOtgM9z4qBmkJZ3C8FSA7O3dbxmtS1hQw%2F6h9SIAJAM8xYB6hGKNN7xZVxQe4jI9Vezh7MdklmBJV9pZ9pmBj4ELc0fxHK65K%2FPGNrfbZ6Yt8H5uXiz3AasMmQuglu7%2B7pF0AvMJDfj9AGOqUBGdPbdvyVaGQLIggcNmOXtD3k8CJDKNz27%2F%2F8BoXM5BaLLLSB9G%2BQ4RT9tJhSQy80oo3xNT1Q4XhW9ZZYuAVEihvYseTCtViRenMmfcWecCVMheNTRhYhg8Xu1Q%2B1uuH%2F3EzBDpYay0%2B8uE6%2Fcr75pArPEQwAaKSIHMyS%2FUEXvA%2F1AjgJYfCtRVgsa%2Bx6TL%2FPuY2r%2F%2BbUOXaL%2FBJ05NHGSAtxQPtx&X-Amz-Signature=7a88a564ba51a5c9fd42fb1f2e8e9e6152e55d51c3d59585ecc0d59c337f81a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466457QCYVE%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041404Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQCWe62JCD01lRjGmvBa3yQJ72Z17YtQg67ZEFmDt5XtcwIhAKsHKCLXarDtWty6dG1zJs9Yf%2BoysMi%2FvNINfxkV%2Fc3FKv8DCD0QABoMNjM3NDIzMTgzODA1Igy2zGzBnL6jr3MUfdcq3AP%2FTAgw0kQIt9SJHPxI7AyMZ1fbQnEM27f7w43%2B6o7eUyPPnA5rUgd0LU7ph3ALZsc%2FEN52kXRHxPGop6zPkwuatmYwbASFvFxG7F6LhVtF6ZFPTn%2BRfloeQe0R0o2mnCXknGHkMqwKieksx0%2FnNXLTJAPKpzpd7t815YjurPhWj75a5QrrHlQ5bWaOaVHEDMeOPJGsxEqlP3k%2BdiukGxkxC858cD028p2Jew6D%2BDAjnpXtqNgnSBi52VXylabwTYG74Nu7I1B3znJKh7nCdpK%2B3i5i5RC%2Fo4RzblLaYXxIPesPwNZgrSC%2BZ3EHGYgK%2F5xORr1KHG%2Bqi%2BgNpCS%2BDXzwnoEKlwCVenA%2B9TcB0QMGdPu8fQSiEzx97RPBnp1DwOvQZHTJdtajhw3CeK3qSL0UP1Smcox%2BiCZ4EaDMgkbwxQ6yFroBZ7EHbX10UlbCyD%2F03fm5IEu%2B6Tie5iaFd0FRYpsPjciMa5ARzW46TvCXFH8FfpUvSz8w7r1w8aGtjRUxw0QKpJYBwzCHmpBtDs8TC8C%2F7908F4NnWHxqcT6StCPXg6Z%2F2nS1LG8ybbU%2BkJntwXR8cSjbzVJJk1ubo9FzuVVBQDtXQ9%2BCS2yp7HXVcolcmkDwlsdOD1T2LjDx34%2FQBjqkAcd7jrUA8zkhMnkC2vIoKkd%2Fvy1HvwDVm2Ss9Oinq0EYjPdzdeef4s5oW0zLiJLRX69%2FjySOIteDibe1IzJCmL7wuUsGUQOahISS88mHlWtoqUMvu0GNOKoUp8AhMh1TKZwNFfJ%2BlXxL6UHHabUOlJVSXLeITCIAfK8hjE%2FHbDNJAJN7XI7VnsPlJWCbCqhsCnXU81CtS8N%2Fp6ZJk62L8JPgyAil&X-Amz-Signature=778a93dc8f8faab48eb90887d996fa36be09be560c48a3f7fb041521d2b7f72d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W6AAD4AH%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041404Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQClr0vwzOCGu%2BtrbJFwet%2F7wz%2FHrvHWeXg8JuuBm5LFJAIhAONIkN5E7znkBBr%2FR%2FbdRbQuhVto0rA%2FNoRywR629iSaKv8DCD0QABoMNjM3NDIzMTgzODA1IgxcAQPug1IG2Oockloq3APi57B7j%2BQknUj53aAnZWlc8KjFLNdR1mnojXPlAJzksj8EV5hD3TRI%2BgzZ7iG4vG9ZM7yXR4%2BsTdTHy5FnQaild0ttic8LHtEHeZCNsVdWME4YkZO0ZLrDCFWOEkv67sqE2aSvvKIJD10zroMcHyCsbcfz%2BKl0c9MsK8YlM3rosL1A1meJPHAT4JZQmqjJ8h2gOARRTbS1Tj9uFNiPgwyztMq90u5KcvdRPnjtw0NwEg1cSn21w6l6MDmAAl8PqlD94rCaYFPfrbMgnjWtsAL9jJyHktv0FPFkBzwsHRXwqUMdM%2FsAYTpdes621Xw2WgcVwE0%2FbepMx8IacT7mAcRdVVZZ8CznLO1TVogq5sB66A4dlq4zk%2Bb5DR8y5ReyuvMiRoZUVYZnbhtTbdMmmtVq%2BrnRPR5smX%2FpCF0xtso5s3NZVcnzAvoCHSIh9nQkzSyvwjEQ72dWtzo5wVROV9PNRZZeUFmDzjprwSMiLVQu22Q%2FPkIR4%2FRluf8md9kop3GoGSF%2F1eT1uWo9YJnmgHV5C8gl4UtCVEa1Xn4TkGWvKQpDBanjrF1TPSamd%2BFOfTrYE66CDgr%2BZMp0UaLHpmPYkgkmYUzkex6WKe6zFK9PU8Q88MBGETSs7CPVkzC63o%2FQBjqkAY9FQioUHVw0vBmR8D53qPIJdAPWGctgN1nDCi94m3wvmY9ZCgxRvquN8VWQfFni%2FC9vR2mKTEusN0Q7Hd3uZ1ya96%2BV75vLcPvZmnJYw6BELjJqckMD2MkoFmVoAkkvLge%2FPVDgkwBvC2tpwsetNrNbnCDVqJldY9RJhGS%2F6zJNzHdYJlkscXOvMLZl%2BkeD5iSn8DSnXEYYPQ%2BemixsNIuIQA7X&X-Amz-Signature=e7324b65d198338252a53edd00ba99b93d4cb33ded8cdeceaf48b1aa241446a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TU6I4HGN%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041404Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIQC%2BdZMjag%2BJ4Evorh4oZOYt3insuVw9DHCSyOD8m0VNZQIgb1XQW9QB4fOJMunn1yYqvBmtJye6ug9YYsw6WHzVniwq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDCBQsiP1a21YVMLP6SrcA%2BvgcZSJezB%2FVMCTcNArnSJglSVmoV9hxWvpLcFn%2BZuY8KVO5FcREkADms%2BzjkKjxjLLJS6DvpZJMrn1A%2B3LkTx1zAUS3gul%2Bm75PcUqXzu%2FMeeBxRsU6yPwUhbBLfNRbYxsgEfJDtj6Q5s2pmTGBgo%2B8anb61LndlzwBZIHm%2BH1Vx4PQEJ2mZYCFz%2FULe%2FUPsU9VslSJcpaLi2AYmlge3T9YsQ80RaHMZf8tMPviW%2FccWJmRSt%2F4TwQ%2BYj23YsXnGDmOvGnJcyg0KVKMv6H%2BMQ9POBJDy4Auuul9DajTm2PyimvMEPPznrjcbViFNQPBu0f4ghMZ8CHdzZuMeRGevvNCIkBuxw%2FEzERnriUC4WYKgo5MOJqoAPSKbJ%2FvAX9T20MGPGGcoTPCXF9ROzraFzcEFPbN1ixMgr8b%2FsBb7km7NhVfOD0PamJY83EzfYNya9fZ5rpOrSDF%2BcafKKWkoPDVakNN0uqp%2FDHylgewkYwY8%2FHyczr9VRHXSowXbs4rcRGZK5yr4p8mHPKglzL%2Br7rTwHvhTY%2BvuvT142TYFCAn%2BkXq3PjRGTlbXMdECKwUoolbErw%2FuQbyKxlh%2BBCQFqAXTeNA%2BsUJm5VHEFW%2BJ%2Fy5%2Fve7YnKVKVcg0KaMPndj9AGOqUBp%2BzJDEtN6n7oLqFdWjOejyaZ0pFO0RAT87%2FE0SQxKtH0Pt34ipO9tkyKoxCpZ6%2FKpsTDdJnRkPRIEZQV5JWNhGixApIF%2Fd%2BX39%2BCvnKpS%2B13kyqckeogzztTsjxdbIHF3WRJpN822jK%2FedxKzYW%2BzI76vmw3d4TsGn2HX7XZwRblsjC1AeiQ6f61nUvSip6JONfLSi4en6YdhEa8WkXfcW1x1Oae&X-Amz-Signature=2cf1cd431648a887a35c788f162fcd67e5076ef37052fe400be29c160de5e526&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=e2cddb36f02e87e5cc79591419a747f812bf5b8d0f5ae652e381a217899f2500&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RVLUZWEO%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAvB3UfUcVL9XZsqcnq991nBr5vJPZFIojNmpjVEpagIAiEA5%2BhYiWO%2FI9myDQawBgRrs%2FVDnvsQ66nQejjdNhy15kIq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDFaQ8Shdr2YbJ0EyqircA009HcEtBXqO9Kl60g%2Bsrf2m6WB8wqOl35oTn5VBaFwLu09f0cvXU3xn31%2FfrZVbE2%2B%2BHXJ8ZBY8cZz7nx9Uxl%2BZ6KBn1E1RbXYF0dGdbFWqRdV6e9NAxSmY7CLpuN8oxwtOXHRbeEs%2BxyUTD3BVBAotBtLDI2TtHYvOebiYdWMbgaI0CRkk9R3h04dFpGICB3iLiZnGXXDvgVSj%2ByU7iFk%2Bvf3lVFIypmg3lVeBtMiyOwsW3OeLzx06xsi0WSOJX6YeDtEUjbx3VXF%2F%2Baf2VMnf4m5kADPFgGJPW%2B%2BUn91Gb3iOnd7%2FLyXNuxdF6whA9H13W2k6Vcpmm92asPXUgbzSi0cN1zhtXM6WmkCdxkj4J8psO1DJWfd2btMNplPjyAi8E%2F0pxrab0%2FSpXzMLtu%2FEM6oslqJHf0BY00c2jTJlvgUONSfYfbW%2FVHrrx2fxmysvpaYzoRUpGGi2XFKslHL2mfECN7wrsPZKBXGsHY%2FQVQFBe40BfVLX3AR3jh2F%2Bri9xgPrQeWOyWE5R8T71oIItTD9cOwXdTvtd48PdJnGjzqnCjCqHAOqtgPVDUubqUy7mR1uhqiap5FHXzV4rXbNkzCuo4PpvOJEeMrMzuIw7N2SVPBnq37ZyG06MIvej9AGOqUBZPDM5X0YNc0Xhp80YUSCcDxPWA6H1X4%2B3f5BJtAQIhFrNq5b4eHHRXxIzM5kTa0u60juYl4IWWAp2YF7R1c%2F%2Frt5LAfgpzPicLrIpzRKi%2FvtGw%2B94p40Hqx9BjlKwNJrwWk9wk9dS%2B6iBv0QlyavBS6dtW2ZTEO5hAbPx0KUuL1lfwQ3b2XtJ%2BhD3Kz7RsMfvlNL2fT45%2FSjuLSHiJ4CMhqKZMaQ&X-Amz-Signature=fa6962a6dae3a7595814b3185408804b549dd5e4186fb622b3f6839e1ddf4f03&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

