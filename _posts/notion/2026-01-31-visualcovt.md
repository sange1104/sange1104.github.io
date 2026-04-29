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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=3fba82574942d800cccffc45d15a0dca6faf490a65d8334bb2b7e97574e99c88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=efe505c00c7d229640caf929968513287d6e8b528838823d470b0395fe5227f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=f3b3832ada2f09ba21095c433afdf87d0adcab3d1d85cb18a86ab2170210eea6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=8e3a8c88b62b0ed502a598ce6b72fd5460c728a6879536f611347bdafc315d0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VWMXFTMU%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040310Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCQbw1DkY05qSNfVgex0qECjpKpZpy%2B6oNNTAVXvWoifQIgWl%2FWCSNiPdWvWYN2WI917oI7nuYO%2B0KOhaYZF4UoYZUqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPp3B60qSY8yf8duDyrcA9jWOZeEQFrBMj6bfrF54DpY4TQ%2BxIRCAu1c9HKXqWcVAL7VuJnrpjr%2BD7UcQY7VX%2BrT%2BGzivU2lGCeweX%2BNbarkTnZWkoUrSbaZ9YxVZJHP%2BisxZQqevqIr9JuQvh4v6tlNNfFP9tBl37gE4DqxtDfcUE%2FvMl%2FQokwrjuziOds%2BuTu9LFoGudeoeAVdZNDDR%2F5LtTdEU6Z%2FltFgGOfqj2hkgEVP6VRDLlhMYPYz5zbu1z7hIt%2FoIPb28bzSfDIQTOk2pFukEHgyrG6Zn39ueXnIPfU3Z%2FoI9r7RsmhzLxMmMd99flF99N3CKbYK2UWx2%2BXR5Qhco9UM6I9pgf2rhOIQyajJ6lgn5cqwCC6V9ByL47cQ8iC4nXdrPqE6UtEquyCDmNzfHS85D1L%2BHb2ppDFLdYPRkqCm2WP4mAe%2B%2BuGxlhOPMDGjBk%2FWmgJVJt%2F4hCN%2BYVwFso5VoREQ7z6%2BxTMciz0XHztqhoZg1Qh%2By9uTmyQW4PjVheAxiI6nI665s9jukcOh59MwpveJ7WXS3XVAoJW8brxaCxEANzI94OmTZt7CF05YpWZPNoc2aT1auJNcA9NsvVwk2TKHCsY8UxGgLHgyT1Z9hMjl9%2F67%2BREPe9F4%2BAvc0MDlgA5tMJvsxc8GOqUBBIFrt9lrebwvIfjHwvwmLdO09k8dZ3W0dWRYFh%2FgRQFeoyFV6nQfCIYDnlqD8hiAPc6KjSoIYMDESjUAlqwXOb%2BVB6OYPfmxfra1l9vOD9Zb64VzdNYFIP%2B8ZINtJ22QCEl%2FdvWccCJVg40C8mW8JsBPchRjqeiPRmtvePoYiEWzF9Syg5VOD2to%2BwSTt3RjD0eqM7EAQ09q1F4YDOEEUg4utZyc&X-Amz-Signature=41cfcf831005342f2feb9bd13bc47f547ae58fc3d8f54761438416486e31eb2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T3OVGKTK%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJGMEQCHx4TV%2FsCoYJm1K43tcUBCH7lqHmH%2FIIQtVQViycreW8CIQCyURRtfRLhq%2B111vgk9cE6jOql7Q4gAOu7xGN7fmd8lCqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSiAAy7tznc8rgf3tKtwD3ClpdtWKzbeC7HpTiRwW%2BEs2RSlIxyKeD%2BPjS4FO78bLPO7HQnS7%2FJPw5HTa8kysb%2BQDKX2t%2FTMhTPxpjW4O2xCdUQ0bxxuxXKBkEh8jYcbFWLPL2r7PpbH1hJx7VQU4tSEpPbhlmhx0E6H90zPAH6hxek%2BkXgvuukNjj5iukh5MKHpP2SpHMgl3ml4ZuSOr1bIlfXKNIu4F5FzCqJmu6oUo5WkscFNayBc028fcUWWij1rWxQGbtN7VSWuCIuxwxdYh%2FY%2F9de6vY6fV4jX04DObU3F%2FTw2Mg7%2F%2BHI99xv6hDWMbHpZLtfffZ7FcTvtztoDDRmuYiwhPz9CqTOd9BRxMLgfTwdjpXl5HaYOKAhiooxNmtsAfjuuQUUJuWGEbAAFW1ZLaA2rcQ20G078TelKeHl2v7yV%2BKQNWNu5cWkN%2FQ0oYBNtmeH26e4LX9jnpViLniPt%2BvuzRnN6RhlWzgQo%2FJsOesRqjAyrpzH7xfn988pZ%2FwuorJ5aqAmlQT%2Bw0HgAi%2B2JpGcXNTZkJvJGYTw8kUkbeAVrHKR5r7PMPZU0AdXq%2BRbPaeYugWKpA1%2BM9doV%2FCwXFyerIZsmT8W%2Fwr8X6olt9RkcdSPmfsbCMRfzAd0OoBLNNGepqtAEwle7FzwY6pgGOEI0aIuMcYKHLQicL5XIJxlThwJ075XPFrIKKnKGe6n7KJpvCGr86YgOuCECc6AvEfvPaVd6tKkYoFPf4Lxkd%2FmViLusRVSewiwzeb8Ql9bnqzgdnKjgblW9gjmZkzPLjWSBwip9Eby8fZyCgYrDuG8tAi3750dvA%2BRveLHNc%2BrDRv0viHziocjNrEfLoH9U1HXBitegTEORd6AUP%2FSogCteL4J7p&X-Amz-Signature=b9ab1cc5ade890add6e9bc06dc749d170739b1aaca7e6be6491a9a90efa08b81&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W3XZHUOT%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040320Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIB78TOfjbmq7jyRvUJHmkN0CZBD49x64itGrNyrxnMN6AiEA5yI9G0LZ%2BdO5eGNiuY8lfQ3tOimjqhMiN%2Bkq1BgXls4qiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAS8%2BsbJLIN9671XVCrcA1uJGJpHJR9g2%2B5Q%2FpPAAhy8Y7fXJxnmQje7lEtTWGeKaJU7LJJRj%2FNNx2A5j7lHs5XjQeEI55fBU0gXk6ACKqOKs6TSe0nMLKiwarbgPEdJNYcQufB5EviU1K7%2FCe3%2BJW%2BqNxJPf8cysnQeKIpCeQt5BCAhnlBTbrgYNzmuFTo0B0AuOWjl9MGrKRnudLK%2BvIm%2BRjvqV08teDddMV0qYM1NwNEA9oL%2FEvT0mr9iUl9AbE%2FeRUrYQwUxCi15mJf2y8jXsQvOL8h6yNcLR7w50qifLw9VLVyEb6qqdb8R%2BhQDML9oWSJDKl1KlsiPLLzju4j5uAlsjVdr58xUsWgb4ghCb%2F6RMF53UUICRlVPHBCFNde3wd1rCeygWlhRn1I824prOujqM7PajYaARQ2uFz6zo2w7S6JJGHWMxxLQE0nPbMgdCxaQ3yQnpLKOFkZtGvjVZjTO%2FtfwX6B3r7DA9L3pGjDXL8nHARNWfj6L2Z7VYIpM73iolHivIZT7HKulZpXcB4JZUgqGg4x%2B4xUDPfIb67bGHsZ8TBUmqpjntNUbKDhwOgIo5BI%2BlZg5O5xzHQ%2BatcnTDyJQw%2Bige2%2BgpTGwJTQBQczYfJ377pPlGaLnqQ%2Fp9FCUAWLutbVCMNDxxc8GOqUB27LHcu%2FYT2jie4wSYzmxOMneBUDhbTN4CmdAbIx08x3MemP5UZkgo01DpxF41%2Bz%2FRRFuaoFVNcHpbP4%2BGb9QDyqiJ0skFncMy9EmWoV28yFPQNBbjJj3AXQfPeYfZXeyutMJHEskOH4Q0oFGZIxVzzYoAV9YL0MuJ4s%2BDy57XCQ%2BhD0FcsMIPSmogEM2hOu6A8Dwak0E5H8lxwDPIfRx6PYF3%2FBo&X-Amz-Signature=a36afe2f5909520ad8a5d26ed2104dfa7b0ebe385a5f686c8b1ee7256f801da6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOGJT2Y7%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040320Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIE2GU2TegaSC2xe1buWihLJ%2FjXYET0bjW8nLyiSQ0BDBAiEAliJjuskmrQvFBM4VaAIvDbEprCocBb%2B0jncsPzsTf3oqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEa49Dk%2FxI13JRRESCrcA6m2P5NmPHxnH6GdTQ7M3mJn34uxjwnXkrfb9RE%2FdW5H77VpvhG15yS%2FjURttCMcJ8CVarrf6CtAWtWr4szkKbQYFrziD5rhsDX71Y3dMBQPeEexaghm7xS6ETXWjijyVmr0PIEdaFqzs%2FN5YRsOlqjcwnFxpRW0tLb%2B1a340URoQAxmJ7qtcmEIgF0TsiJF5aAE5dt5PxaGjOudIBcCNOn6Fa0zpdBZ57e7kqDN9%2ByH6%2FYbthS99KFwpg%2FsBe3GnxB%2F%2FVDMdCRAN00OupZKUyUaAG83BIRQNrSi7iJ4YHUZTBQkBOyue94dYZkzO0vj4ps9WJ%2Fxr7PJa2N8PHI%2FwSQlyn7Ss9C3%2FkgthFyNinPvzJsVS2Xi9EHp1NI%2FuTqSm%2BDGGYK1Uc2N62f6sBv7ZkzXfLywgRiCwxHj%2Fmp4sLVNfM8z9daonFoX2nhO5kcK9%2FSh89lVa3XlR%2F61W4SPuIMA3qw8O3d4gSLyW9CMQTKirm8OfBhfKyy89Iiw4Qj5iZ7hVkka1PKI%2B5mxlebiKVsjH2iPPCnisThnZctzImlu0ffKm%2Bc7%2F7dB5dZq2stfA%2BVzta2s5MyRch8EtqCPFq8dXq23RG1vHU5vmT61CQXU0w4ZaxShEz4e6x4KMNvsxc8GOqUBTXBIXToe0XqpgV6CgWNrxzip2c%2Bh2oP9uwdL8BIYwEq7p8jF%2FvTV5biDHQg5F5BDfLZD6Fnlz2wiFPEgBL%2FULlGvvEAU7kMtkBrGfpWFeXbNqqH5m6njagXVi75CsDLb8MYb0pd9sCR7d8Qp2yk9nT%2FU4Ww7Jzwv%2F4pNJCbiGP6Z8nAm%2B7RgMMZR9w8N6nffb3mjRIA60GgAwOcpnA%2BNXTL8cbU%2F&X-Amz-Signature=3693aa7eb4a52407d01b9446bc0c3a19d2aa87deab086cb82538ed8745e180f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=c530f01ce1741084db5e5116b845ee624ae80077085e745f49f4024ac190f3f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=0a8328c8682c704779f735bbb80b74550934a54b0e8ca0037fd022f1a6007394&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466537JNCJF%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQC3NIMLIVPVde87xq9BR5RTJX4pvjnAORdxo67%2FPDW%2B1gIgGdcf9c0LJoq48damotjB89HVgImvV87mdGKnMnZ%2BdbQqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEvJVuZDwOXNLBdPBircA8EvYtUB5hGkRFeZYJ3%2BkXlFRtlPwDL7dPGWWMUuYOrGBgK6IOF7%2BVgBoP%2FME2vfTGypDWW0rQnvsnp71hiEAh6ZhOE6TGSUDnPMcT5x7VhHH0dfr7JtqOdZ0TWvwLQrAfNo83oLAQlYNQFbzHDUjTVldrOfSWEoxP4aQCtf%2BEtZ70viuEcNaKHkxWSKJ%2F22lyjeiKo%2Fis%2B4YN3jGsc%2FhjDXlUWPJB3epHFfP9f7YRr9D139eWRg3XRVA2A8IZJIrothafjQPr3GO8GlqZ4nt70xcq4AAtrhb4Qvm%2BUkURm7BPm6FWpHegykXBqlFx8yCQUoXvR41DyXAgKzgcHcfmZh1QWGX9q5Is%2Fgx%2Fvf7ezlgbt4oPnvnwQp6c4i9Q4xn9btojF7w4zOFiONr20vSd4%2FsjwkIzK5ztKxcOCAFmUTF8WdLQQLYXCMB8N4bCmBE1IFgLaHkrKdtRNqg3MW84cvnodF8o2Vox88%2FcGIflx%2BUZDOid3eYpVuio0sCZaVIGVqTezwtL28sOl68nBGwAn51Jakn6kYTNbPMpAPGSe%2FGfpXssTf7jg3Je9dXDb7e0uSxMyR3OWP3tV943kCQy80Zd3x4ZSmTS7RR9VnDQFEBi2mTNS05zwG%2F5sCMLzsxc8GOqUB7rb0MOakKv0ptQWn4VUND6YnrIjI6YD4jDPmFS8ooPyedarj94UygQ5gzWZvpiiFddrrPjwANn2Gpp70DJy30cV1OZVUicZp45lgE2I5HwSvQMLrsueFzqlYIJE3xl%2Foxidd%2BQJjS%2FUBd3QlQDJpiNDvNCGCLkxsNCU5L7KN%2BO9nafdzrfnfcjdYaPaMyLGWwmTvAYO9PuzOT1n7N5nyIc3VpIQR&X-Amz-Signature=52ebf82e0eddfe5e01ebe028e20a833bf36107dce27a15432106b2b08009d7b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040303Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=923d5aac432ebb903a33e173d2a8bf7dde3c5a5986ea491374e3fc938856ec8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RRTXRNG%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIDkB6u0O%2FlQsXhA47yZ5swqA6rok6nV9ZmFy9Ci6oQDBAiEAlhD7B5NzIPahoBgOQ1qCfS8B%2BLSkyAjE1h3fnvJSc%2FEqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDJ9fHZpQldGe5C3lCrcAzbxngFOCkl%2FbSheYuWYXlV701Mn2LL%2BNzs5xZ%2BhcnshiqfMktmJ07ovbaPsYb2VaXhRRvjGvf1mS9%2FFnTKKIHxKktxY%2B%2FpE9U4YeNZnGkXXfutU1EF4qHmzya1wHQz%2BIWotjOxhflnZFCqm1%2F6uddvPZ5Rt%2B4NbMNMFCOpAkt5bycsXd1pEDNHci9jUWO8daDLkau%2FO7F%2BKlOIEIYNHnVMIl1t8l6bXI2%2FaqtsvfDVEHSZe3mPvGK2FWOHE4EUaPN1QYAbXmGyLsb50HHsRLdSZgOTVzL1dW0DQjHt2yqYb1ONqZo0lLk%2F8OnxHgGoH%2FoAKvS%2FavQW%2BxG%2BOTLBANS4f4mZlFrmuI6GBBHTqNvTIkh3HftIYj%2BY6LRy3Vlcv9d4hm8yhO2%2FMdfWSIOoAh5H9GQPRNbbRHZrKGICDZjJT%2B3z15evNKZdcRIEs3590YOG0E%2BUjElRM4%2B%2FW45wBFyQ6nhc%2BQq9NiG4u%2BPd7zZYRBqcJJFn75LQelRkZhtdgQAce8L3lvW2sIy%2FmHA%2BnRmZJXkpN9Y5m1rP3dK64wRgkYpYZtmgGgdk%2BX3GsLjNKcPlLWsR25ph09zL5D5IX5A%2Fc2FfNYHI83jIaigJxq%2BtTFY24thVXZ517Le7lMMDtxc8GOqUBSmHXEqEXVEw9iH4N8Df8QZprMaDsyGZ3iJxGeddyQ2%2B10rYKb7JtzG9%2BAYd2acJijlev7DzEZ%2F0kD05uxrHhYVA1FO5o4sFpptHlEHHUTIKAankfZJLPF0OPij8geWsb%2BiMbzb0HNOsz2afPxvYPMHIX4SDwM8PUDmj4conJW%2Bjx5RyDP1lRosEJYq8pU%2BpFmZDpv%2BUKHlLtDEeKGmLmQnAEIoMV&X-Amz-Signature=fbd70969bc4bbcdefd33c66fc250cab98f90011928721edb0eb121a76ccc6bf2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSVS72S5%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIA1%2F5bjqFnj9pQ7XyDkQgWN0gTEQFUIn18VrjpHOV1gIAiEA%2FO%2F4XkhiTKBDKC1%2B84T9CmdoD9%2FJvHfQylIo6C52kHEqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOX9ms61xS%2BLlv%2B41yrcAyfwPYG1OxXQPtfQMp1PF9v3PROh2RcTjADgYAPHO9XhmzOM6uuB519u8fJpTlDZ2vJlZbdB6Q5UnFmXE21QoeAEFVcGQfBzvfQn3SxlD7cBdG9mD9GkX37chlcSq9ONBcSaS9KFqk3LT3mnLNQeZRpWWjS%2F%2Ft3mjSZ3kkkMuBc64lGBSNbieoJ8022tOEnPb%2F8FnQTJhvldSvePM61gpYVtkymWq8%2B1ZuyvS319%2FgXOuVaA1h00vsNL0W9Wdb%2Fg4dY4OkeeEEFw3prXgt%2BAUQFyg1hDkW9Cs3oD7wd90Dq0h6XmzySJXPeU%2FUpm%2F1GIsUTSpYuc2yAdgWZIJmRXe63ligAUSYNcUukmFzTlL1P19quRT66NbATTlRVYDRupcCnI6git%2B%2BBkmZvtoNjntMt0JEMJ8aX4xpH74rQSDVTsIbBB2zZ0hUM3757F8%2BAkU0aZjfLhpzy6t607y6tzjAcNEAVah0UvlvmwEdqCCORacQMxoul1xj09ZpHV%2FepEH%2F7k4ndPOPehpWFx5wke60x5mDGh96Z7djrSRjl9SmjyTSKuB%2BMurnvNDrFe14nC16jIhShmE%2BftY7R0RK3c0XlVJ0YQIaADCqwDPmSsC%2Bb2pm2McGCr2gFD6WouMNnsxc8GOqUB3Gr2UBb5XSXuFRp%2BJXCJ6esHd6sa9Jxi5PshujJCOT0U6SraTD7XKhuuAfFRGS98fjtu0Ttii42n6HCxuqLSLMld5jWZ3EvV5o9m%2FiN%2FDpL288soLWyRwPcfVrv5VNj3A5m64DfladrPwJe%2B8oA62PcnYU4z22hFnmWho4%2Fhqn7jl1Nh4MjXUAunn8qrI0sB%2FJtl7Ih0%2FLwoJOgdFwBhdv4kySro&X-Amz-Signature=21bb3ae9ded51265af1634774ebcbfbbbd5ee5051af813846bf4f54e4c7c5d8a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667AKMZD2V%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQDesK4Fl15s5GlKf5UV0oaFlvFEoBzR%2FHwJmZnG2Rd4wgIgBLR9b0taga%2Fe0OCIdRpLtXKNGjdjMcUU0BHsMkYippAqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMK%2Bu12H1N0pMPlv%2BSrcA3Be2ADikj3g7ML6Z9R66Tvm5yrMa33lFQj39l5%2Fi39xinb2C8Q1M7oeGLY%2BxSsrg%2B41n77CGR0%2BPczoVBknFli7QDnvWJCG1COK7qj0BH%2FJWV3k6wS7wn6bAtuSeCwqlgnibXrEHeeUWZ%2FKvHCu%2F6A3%2BVP9msLX5zhxvAcs9lTtK9t9oY5xCCfYaoHC%2B2dyo3ZQ%2BAnY%2Fo2D7PgZcO6Egy8Uu4pspDXQl3%2BwKIL4Wa7SYwjoIQoO4bY1o40oNssuO1su%2BbN1uW3vOVo9NrbKDFkwL4TbHau1x5Ud2xQiRnrA0tVA%2FXqSS%2BqetKX%2FtHFBvDeaNOEqg0vR2Zi3KAJPsFnun36QBJ13rFo2G78Yw%2FeGgORyPPPWmy0kIrhofwdZ9Etf2uxgISLmNAyjXhs5w10xEiIvXMzMtQaDeuMrXoHicW3OHenaPezKoOWK4Q2NNXG0o2HvQJJqZirZWttyev6tCxcdIDxgHqMlD87PRSODlu4N%2FP%2Fyjw9iM5l%2BUUGP1wW3tKYMvEc%2BNwUbAvWkUKjnzvC8on441%2F5Y%2Fk1FXDX5X5MNyBL5etlifaGfoTaW1nZr6cMXwNsDPnzjgbZsNH8lfjl9iGsh0FWI3STaVXUg4ltJMd8bwimHUJD2MJXsxc8GOqUBl4Y%2BEfkbKzUZFf0D22R5QYrdbvnY6hn4gf8WTG4h5%2BqaIDumIN8ofnFzx%2FP4oIJAwQPfbiKaRjWiFMjUuXkh2T5v34jkf8tNpuFwmWpMwzg5DpLvjyDRkq6MQY7LYwAwi5G0s4S0Gz2Zz0xmScmH2dVCqZ4YvTHiPMnDCjCHSHTSJkM882dEtcGlMuxMys%2BP9w4%2FLFbnD90qNUbNcq6GD6JAt2in&X-Amz-Signature=bb488875c84749ff9b86c2ef0d4d4afa9cd89afc466e86f330795efcaee436b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSDPVMWE%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIGRs2OSpBat3pRuNrjw1No0RTazU8n4Nt6EFOoKh5bzoAiEA6DChp8XrOuVA49HOs1DPRy%2FLP1I4adV3ScK7Zi7bGvgqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF1w8t8B3JrcUDfN8CrcA%2FmMHm5MZ3GAib%2BxSx7wuKXInAIYfIdto1Hp%2FZGpmBMCy8zfJ2GeJoOy8P%2B7gLHLfwlO0OyuYb47JXTPlu3O8sY4z2tnk51k%2Bi9hWF%2BxHvVhCf6N8MsCKNpWUC8dSsKAutLD85p%2F7gaAonGbFPFM7XXe2PkZtnm93UhIVN1Kj8HPGum3JjocOmE2wEBJMzT3oW25UPYSUyqitpbNpmnKtESKaalwcdfa1oYtoPfM9HBKnn%2B%2Bp8C%2F1os8X%2FuiU5nOfhqabvWBEIwe14uAT0hPbg5P%2BOGXE%2BRW1Bs%2FW6Ub20slfdD%2BRUzhAtHdzD8yBesU3aG25uxfA1Kib686M99vh7TZF0EXc%2FSvapbExouSnMUMR8TUJW45Eqtblzdw%2Bha0EJW36JvCXw8dTdIJ2i%2FIilIf5Jl813pd05JGCjdYA%2FdvdZVeL%2FRe1%2F9vwsjxPh6PdY3RAZQgtLH01Nzz9GnlihcpCOLK8zfFcxJ%2BSQccPUoEB8i%2BzsJLAkZLiRHIPJhChubi0f%2BGvU30uanfCoe7zgGiv9vntvZZ%2FQc8nLEm5NP4RRSzXMZ%2Fb9G9P22OZYGD03ZbfRCrA6GTxOfiHubaGLuMdWC6r%2FZZfsJg0MtcgHqilFdjQhlnoeteOyA6MK7uxc8GOqUBnFhBM9nmO7pgyYO6yTtB8mtD9u51%2FYR0Yf%2FbGSlL7GLPBMRvg54xkvKB1bGlus82San%2BMKjw0pueQidhY0sD%2B5%2FwP0apzr3lxhlJY2ZgyXvnTrgwnObwKWoyCz5EUme4KRdHJxoE3n3%2F3%2BF4gugytx%2FTjXdYZ%2F86rnI0orvw0TdkGFMdns0LFy8JPpPeNG7hEC4KxnunCNzTcp9R7MkygcKUQpPn&X-Amz-Signature=7ed5b4977a9187e4b4655036b474be565fffdd172b107faad33b5d61ee174f7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040303Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=c8400fcf9b152637cd4f8b54a7fb3b362373ed0815a35f20515f4c8cb63d207f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSJVFGJB%2F20260429%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260429T040303Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECMaCXVzLXdlc3QtMiJHMEUCIQCUfkyBIxlz%2BPCFn6kD%2Bm%2BOGxdiE6NxkIY5kEilqoLZKQIgI%2Fp%2FX176MOVV7JpUmWYLp6joG9LjtAnsevJmozAqJXwqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDA52o60yOmLgUVdxircA8h6KgjE9lvnAtXhdz%2BxkHdcfqRllsbB1jkKqSMDe3ZT%2F9OuK8O7miI%2BZtjEQDZimWwU%2Fawo5sllwTWhL5J9ogljPxi5sJFtifYeLc%2BwnaPF08lTQ%2B54lxdjkOzk4qMuH8%2B6mRt3IiwUslsfoXVaNW80HhhtV2L9NxkgwDgjXGquh17HIFwipe6pse4K%2F0sb4ku0j%2BsJumaoUCrQdcoKXo%2BOHSAP%2FMoB54qCxtoLZhRQSiI6dXO2STBhYuJixdh1e0kfihKL%2B1lmE5xByMqkeg%2BSUVLhOy2LyjKPhqpu4pToxWIn8EKsmMd372wbsK8p523pJefRD3EhFg3UQKSgjxAVGBbPaYfWtNI3HXbOuf8It7Csuh9zNJM7sFraAdB%2F%2FEde3XBZaHj195lENMcMC9xXNNxyEK0Gs%2Bww8WJYjbzgDz9lXk2nqca6aTLibCV7id2NO%2FyyNCDGzt9qNKR83bZu7jHvaSs4DwS4Yu9c7c73T3iVdLSBE3Q57FiaRvlLkcYEbb%2B6RWcX8uncW4Wl8pXMUgHybB50TtF22j6IibcctDUHSrYEZYo7AFR0%2BlgwXZ1oaOyIwT9jSK6tsqakE1yQTklnidi9e7kJ1zUqU7KxVuAiRZCM34nOy5v0MM7sxc8GOqUBGuqKI25%2FQKqC2V7N%2FVAT33cdMYFCHoWjZ%2FGxdcuF1zM64H7x%2F4YIUIepZ7%2B%2FS09ajL3b0mHnSEzWAJYfz2dqXgHSch1qg9ReUuY7Bqw2G2gWada7kAchebbdk9chywKGZObNKyU8WEjzBnwAqePkRTGekCQMZICQ9un1NC9b5ZR35zae3sWGE8onl8afDOva4orhvXJXuGGMH45SOO4q3tsxCd76&X-Amz-Signature=7165e48d34b87aa7b52c97d04595270d30bf7484a76ef42dd6c61e14e46ae1a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

