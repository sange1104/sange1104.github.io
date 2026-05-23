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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=eb7c8afece4662fe7837b8ff3b1830e024abcf47875abe3a2ae56722a9f62c69&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=985df05543e2da71658cbfab02e7153d861ea12aa8c0a613f914c48b468ebe9f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=76efc087702cdf836874aeef4250e9f67982d28d9e5489a96e677eeb6fe91645&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=308e6c54e1925725d61c717ef9f91c7511bd3f1ff9a72ae6acef9e2890ed7366&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VKU4O2NF%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040851Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQDpSpn4868cac8tgXZ2uFXPrVf2OXeKwMbCZCCuZO5h9wIhAPKEQtcEyhs91Jeee5ZyscjcwMVrfhdguZ21XR5e%2FWM1Kv8DCC0QABoMNjM3NDIzMTgzODA1Igwwx7O3DVgSTL1PBEUq3ANjMxsNv%2BUpmJZ4ucLMt7ly%2B%2FH35KdlBrqd6LMwMFo5v44KrKKVOkhvOTH88dneGuM3aqx0yAoiZBh3CCzOFAlnhOTlpSRgajXD6oUrdHd7DzV2TZyMKp1AdYVHniQUpmCDOvBqksNWEWcmCGWiQv1qnxwJgo715SkbPmjvhuYLfTAWOGkIAoroc6M7vBFz5149DoHCdL%2F8SESdZcOb%2Bm9LoqbuIYBXkAJEK2zanRcpkEuwZj9b0WoacUzj8PPRrwBqs2SB1Q3GFjWIDIqCf4oz5XIdE8C2AWSnRfifJZCB9h4v8rWk3kXtPAslr0Cdhj8Spc4Q7CFRhjJ9CEwTaD0TbegqdkzxUDYqDHZGbRp3%2BDgqpzvcdv3sbJSwdLLkTFtLz%2B6w4d7Wo5VO5LcGiuNNdtHML6WshYjrT5lNhcYbusEPni4Q27FlL6tRJpc9QvhBd78SaazthZp%2FqTmjgeCtutO7FrQHUbqhiTHnVsrtk8Hk34pa4AvTwmZdVKpj682FxSW0ZpAtk8NAWpseLMavfcDT4ggQ70vX1A6vXN5QCoo04fACSFry57VGYHfT14QWZ4Ue25WoXEnwqGSRDgKlQZLawB76%2B9FdVWCjEmgLNiasw8MIoPl8U8g6GTCXzMTQBjqkAc8bC8DQENnBILO2bAeuUJkzbyzkwZPP1%2BC38IoYFSIyZf7cOuCo2mudaI9f9vAU0b5Vi%2FBAhEEk%2BpBMqCKlhpg%2Bz0SBIfejpkSFFk6wr1w8nGfgWyD1DZgY3YWi6IQF9an79SqhWP8OaowTTKnPH7OVMmq6Wj%2FVD390n2tNEpTD09g9DCIf7ysPRVB8pWE39bwIIpm%2F%2B%2FiuXDq7ORi7ezEEiNVW&X-Amz-Signature=14470b6db82bb58953229b2fe598e2246712a3d4f0daac94249dcff68bca586e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UKHE3P77%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040857Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIGPftpQSTpEK1uZaBdbgSq9bvWg6a3NlfoY8IaJUGHnbAiAVI0z5Qabr6%2F61TZTsbP3zXKBJGOrzGRQdnUEOKKTPPSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIM%2FTNhYRkb9vK8UnYxKtwDbSQUIcflXWWpf%2FIbMJQNVlfUGSQp3o8syIbDHoeKT8erjYIHz6pyz%2FY%2FMp490Cv9WOl%2F%2FWsDeY4dgNzttSU0NPY17c4K9Zwahh%2FcMOYSbtRg8FuhbhArSao9tvFawlsshxOwo6A2vKTs1xNHCYOPeAJtKXuuy2o2qBss%2FovUSYoxDnKDoI%2Bs5EdHcEbTWV%2BT3Ggb1oTPb0E1WsJbUfH7VsEDR6B05kdQjML2OvE7CJE6RIik6wuGtS6Ay94chGrUX9n08qrw3tzO9%2BQTW2717NhQuLN4ZEBZph0MObJS9Upmi4kZBntcXOtTrgGiyAmid%2F0%2Bf9N%2FP0oIr9qqpgV3wa3h8Qa2o6dEjrSfHtLTy%2Bg5LOTQSvFHHGAtHKsLlqSF%2BCncP2UHr8vQ%2B4TOB0b7fKZmtzOST9djedrV%2B2udNkr%2Bcb1ImNtJIBQafJNgzrPtSCTWR7Ssn9UQARq%2FMDst1aB4r3u0wn2%2BGGYADvniv86E5mA0wbZns5aYhBpK5Am8T%2BHpxig17bAeGs24QnGGUOYa7qhYtfQMpashP2ACePdJ0Yu22C9nxv4GzNyklD99%2B7S9V66Pv%2BjJ1CUIWCMmWp4tNXUsjCZvbC53VbSDOz44kbfgJ%2F1auVqXpAUwlszE0AY6pgGDhAJAsr5RruSzn%2BGOD1G1fsC98erJyAdJDd6aJe7xErleQY0%2B5CHTo4CwokdHKygdKJHCJczwBCF784f1xwqKrmll%2FqXe4OrfZa3PlmJyj2njY49Z1OdilFBnKELsKFS%2BjKQ6ySEjrFDKOsq3w6tH9Y0fvHX3iCel%2BwS7G9ih0pPRpk9gBz9ZGX3TagiASSlZsHn0FVNMCopN1Fo%2BYztoOsib5PF%2F&X-Amz-Signature=cba65c236c9843d490b960c839a9f615a8b311754baffa0d07dd6eee9e461131&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y6PPWFHI%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIA1AcULzn1EUDS4lDRRGzHn%2BQpDV%2BDDrCqirSZv7uCAcAiA8fvHY46pRwP9G1wlY3u2Vj11rccrcJSPFxfkSxUqhDSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIM5HT86BbL7Wn6q753KtwDAjn2iF8tjs1MAedarfwQHLDjBGzrE12VcXH5PaW0kPWZDxWOiUmhNahCrRrL1okjScfWH8J%2BBopDWdC5S%2BJ2EOad22LRSwsIH2r1X6rdUlwiPjKjnN6N9xUjvp%2F2khDg3EHFF1fYawqnAMRU8QzwdTup%2BMA4RclN9sp2DWhMoawhPL8H5CQWSnyBmbFeG24cgjc3OUng5A9qU3E9b7nraVpuztErSnZW8eI6lmvaS5EPR%2BAG8AeJNoFH9%2FkQxHMXbbOIKt3RPKRBgnswIbjZ0opmXSlP3HutxJUx7t4%2BHMmT1EzLRvbc3xV7bSGKx72WJs4SiJJheQfxappsSpwT5natBpPC%2BZfhEq2Vp0YuPX0HdWkFglUN6w6FkuLRIpbCuOHE3HC1mVquBW%2FUPVHP6230IMUOIACVTqQgOatsEQUXU1tSxMqZz8APF1MmSJ1TviAk4WnMcFYg%2Fmx1v6TLxVVbSZOMNDjpKLU%2BgLO4nm512bfzqKBcOmI%2FT1AyHCgbupD0rxbqfq3ZsVTJ1i6F2nd%2FphXwra2IQNMDfCrvMgK481Yf%2F2KUN%2B12WiBmeOhZ1ctTL4QwwWGXpYnHS8TaJ%2FykOH%2FFQbNphY7uJbEweIMg12TEBSXzHHccQeQwmMvE0AY6pgFfqffzxj7a%2BYDUe4th4pjf3mUx0M%2FOzNKo9gTsmxBggwBn73AJJGV%2FBKMQ%2BT3BA31QuJbRQcW2ZQElgxBMM6zfOLRJJBTmtlN7rray34XW1ft9sRc8kVD3Qb0seAei0YUSEb3qb5YVO%2F9HiApBf7S%2Bs6LzYZjP9e%2BPz%2FtNnBEE03DO1kmC2kBnUADNGILTfl75ZooioKEvbTE9ywdOKs0ej%2BNAHDn2&X-Amz-Signature=1d15ab9767880c318562b78d14dbe503f5278a1abf47d9722b94484a5f84ffa6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWPDUYRA%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIEFuTIl4kpoE39BMCSoM7wVgmAN5zO%2BytyG%2BzsrjdkO%2FAiEA1faSsczmwF3aGafDuQSvbdhskQ%2BvimmfjoKYpkiBN7gq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDAXGglwItUTeoICYsircA6Ae%2F56g1%2FT%2Ftk9lcr9PknGOgkvveZkTlykHpgODQdc72mjeN8v6GbMCZtSgbdabqG5AX8%2F8WnYgdzaH6maLXvKdXpBUP4GJXrZf5lqn3%2B3rlV5k9yAK2ktJopgfgNQJUAeYri61iJ66td2cOk6Ic1ArkzIcJXOeBDbxH4YyXBRhJSj%2FwVw0W7NWt1Z8m0l5NL%2BrpnfVhxlGBM%2FhZi6wwiPqjqRiYl6QaPXzjD8M2LgJVqdctGwfJ1YMi9ASeSiLnvlfkTqnBSQspOz9MPOyEBxm6g7vYyM94C%2FqepBAFt4uVckE8AAZ%2F2PiyZTna6%2FgC0oebiXJuosoUtWEkgkaXLSRigMEDfLVAH9vkWiR5CImijhy8yhowph06cXOuqVfQuRzy9Ycg9xIvvG8u%2FTUR9Oi4G%2BVSQ0v2Nusnyj1%2BYo0Xna1gZtmZQqHqYCaBnFMhMb5AatAhuEeuWNHn3FlTAfQH7ivjrCg%2F28aIEIy9cMsFNBtJd67DEolseyM%2BTCNshdi3JMTuiFdCfMa4lP9MqgGK2vAqdt%2BLCovm0tK1X33MIE3KP9%2FhUHJrbTactK6C1ssYcEtBFi8YpVWAEsGAeCGa9rbhmJiqJGAkJP6%2FQF0q23xeqxz2%2BJ%2FltBFMLbMxNAGOqUBM9aO%2BDk17NZpBwLQ7Hr%2B7I%2B8%2FQ2RGDxSj7mgYastJYlTWgSshdkAMNufLchmAkE1y1G06QhIIKZMtUBwJon%2BgJo%2Bh3oziuflY9%2FK%2Bl0aTSEHDiMsCk3gL0CFdO4n%2F%2BQn46clVEP8kzsP4Yo%2BiaF%2FJN3CchCcVZ%2Bv9U48cV4YLmwq0c1tvERta2qSBEtvUqkBk6mPOwmkgPxhviKZwtPpk3qnJEH4&X-Amz-Signature=fca1a2c898ba7608621dd33a50db57db3908e39ea2f640463b237a32494318f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=bd23fec36bf3f2728dbd6c79b640675ad0d6d7eadde39245ae6c15406f539289&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=e027e1fbde277eeb8ad072791d8385fd93fe1f7d2adae669a55d3f6f40d3b544&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CCH44ES%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIC4%2FknUmCSOFsN18wio%2BwI8MekzJXgvmYtAUZqDq7BisAiEA%2BnC8uet9pmX3m8q6pMlPeuL2i04eB2xG8%2BIizUQVf7Yq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDKcDD8ZyNh7z%2Fcn3eCrcAyOdLHl%2BL46LnAO2uNRz7b1jPL6qJ8CfCrTShed9Fl1qGeD0MeJHfMMwnpAI5VrvnpHuGxJyRWRJKzY%2B5DkgEXVPysNig4TRhzEwrHqxgW0CYLytyUoz5cTWPD5zYlaSWo54SYl1ZYX2%2Fl4AhyX41CA7Lv8PLrl1at0O6u12CSjb9cVg742kdsu%2B8MtKz0qwGLcnHoxW1HJKS3kaXYoF1RBc7%2BRNz8%2Fzs4b41jxOVUpM5QqHKwEPQ5hrCDNaTue7FNKhcXd%2FcMUO9P3mhOCzCYuaPIKaqjGYagZxa1ijpJlx5q%2FBjnlOpXs8jn34Ydn3DVRfzHJY1aXFog35oYKxRhyK8NcWjb2QQPtwljq35%2FTJodl0%2BS2nw95JnQOQs54BAuZiwJr0uXbJ%2FGZVU6d8bBQcuitIZx7dsZq%2BxT0%2FwT4e4HtXkQLCJRjF7mI9D3iI4TrOMqyvZlpsUF%2FDeX1em39HxyJ4THw5%2BTTJUhp6mLcgxiMqZurUb%2F9g1izeMCH95r2Hv1M6RxUW5Xj1N6Q0jOWJBKFe21bIPAnPZm1YaqMFl4MvVBqCuK5LSmwL%2BPUIWbtUGbvBPmf9A2pKZnzIZeUSD%2FS0LOBiP4o0DRnOsKI26XEKwiz9izLgdoH7MO7LxNAGOqUBIPnJskQ3clOS2cBbVNNktqz2wi1ekTtYWqiskMR0j1aH140PA%2FvBGP4JlJ9C5NpAcpPYNVnokXlsi8qA88Mj5nnl2tB61GRsL4mNlUIG02iWOinJz22Nm0S5obo7OGTQsrQK6hcaxylEnuHrO9z8qiCwHM%2F8gKfdugHB601tweNCi8QP1gcXMbFT7np88RHL4u7%2BazquFqhlOT%2BThj9vQxlUFC8v&X-Amz-Signature=bf167dafdb2e107eaf65ed324be4a4e8c31c8d55e343028d9df0396f8a278da7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=c1c4fe0abf406c1d351ad3da76218a177beee8b7ca6198d93601d57cfc302fa2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UKB7U4MX%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040900Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQCqSZzGftFiEeZ%2FbgBKBDtejrINqH9309wGPK%2Fu0XohFQIgdvhNDFiuCH5XMp6GDEdE1X%2F80K9ZT1K9Tf9JmyENl3Iq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDOGuf3eC9SkUom5BXSrcAwDlJMQvkOSbwqTfuoUxKEvZ%2Bw3Bn2x207EKYgWyTaZ658GjPiuiF8QXuBRqbATgfl%2F%2F%2FrSz0svt0lWbQJh9hdG3mT3JdnCUhj8tphLq04JEzqproAeKBl1nBRwr26i0hc%2Bc3YJUn8bJN6XGxK95kSMRMgGZTKjPDQv10DnYD5Bly0oQGA%2BIeApVdelJQekyC1647J%2FBYn1UgOiChYyghf7f4S6cMGmxSqm%2FdwiAFv9tL1R3qG%2FpDvAsWbl1C5lFS2IB9RLR8N%2BAjOXjHXyHeNzMS0DyVgo6FeX8biBkvxIlkHR%2FLF4XvACGPDFsgHmRvASS1ZxDkTAbFGx4UZ9s%2F3%2BnUwvhV%2F%2FGPRRCK4zU4xGFxGM62D745w3s8bVyoX49Nl9VZXbTzM1PBHBPlnnupc1YB%2FoNaxj%2F3t8Hw8wavG9vLh%2FRBY3qTDrm2RMNYatqZHTW6GLtKIq4quhuiBfAgxZXYd03Rs6VUqv%2BBn97UucSrpkYcxiforwNszmcRgZRwiwOxHZcNM3yDM2BKYWGhnk0DaOeM4N5iNGXcJDs%2FSIhDi%2B43lyfFnQk2YPGfo8s1dGYl0NeOiTKKrVuQ7kx69ARsjWzZ2v6BuCkgzLEsqGhA4oj7W6%2FrRd7Yb4MMIPNxNAGOqUBg767po3G0cjDA9C0yAIiBSaSwUOaLhvePLVLqdy6mr%2FHVUc8Be%2B7P4VRMFBCwThGGI6AvegF%2Br2K05GSW7PkCkNrw0LBEka3VetbjkkPVCOM9NTHP6UYGD7v1vOtkkeFTLVH2AiygZxj27A07e7sHIIoTyKpyl8Y2aXMRe8clEzD1am1%2BNLl6YDpTsDox83LXR85jiBuM4pJz310UhN2thxoSB7S&X-Amz-Signature=a5b509f84a0aa46160be29b338953f4460d2f657f9a507d3badbaf582ca58cfc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662W7DG47I%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQCmIdmlL2Wzy4SmPlrSvWEuKBc%2BxBo%2BBnbW9nqLczHftgIgYkjkjTNmx%2FxCzPFzBrfDaYP%2BvvhrNW2o3gjmtqQu%2F9gq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDGy2IFTUVYK8q3BE5ircA%2F4ryvlxWnD1K03THjRnw%2BZ7jzlzl4sA9A8EuKflTRv3fN5NAFl7ah6LBSk6SLc5TrGFx10hcKnLz6VZejaTIofZhvFXN77%2BE%2F9OjOPMQ5dJs%2BUqBI0heVdyf4Qp4%2F9VJuLaPX5IGoOEfwxofTfzz%2F1GL5YCuviOOTaTMXN1rXnfWHtKAYF3f3V4GxxnPFh%2FHpswAjnaSVgQaHk3AK4P1Bp%2FgOHZ9gYxloURnFUV32Wh0cpbh0g5CAAYrOF8bKRWYWEeuLBr5rJbNqgaWzwLcmi2Q1HEDc8sb845XE7u77Hu3BhXgmHmfsm%2BSkBI48UdVT8ltnyv1JJhPp0toKtYHY070bBPFn8Me9sAjne2BjFBrlfr1U7WhLAQUEbA5cwW1Afh9f0OhTqFvMkY62mb6KsONujkkX%2Bbsr9tSnthX9L0FcFEU7%2F1HfS8Bk2rgqksfM2MxVUa8dupiIF5wVcGk2wbNiN6O5BZke%2Bl5e7msTofm6vLz2ulMY0F3lGNoMAsI5Dqaps5dH5Ea3Gzwj0oZfBRm1BNkb1Ue2RCBj8mRuWwTem4SHqf6EIOWOQVtJDnfnQVLACLi9jsZPHzHombKjg%2BMViJUfET86SnhfHdo1vYx%2B5LzxQ%2Fi3gEo6l0MIbNxNAGOqUBxJTLyqGAopcOc8Lpjt1QIoDA0bvzZjWFqx7i4v03kXhruaYEv4akWqaHo8vrQrDdLUhW%2B5FWjRDYjdIabazxtivjfCjwFoypXcm%2By2uT9agOTfZiRMENd5PJKzFPGomNBAXPMLpnXWFDfcsq4O7N%2FPLNywlCOIGKTAhWM6qgVxIBYv%2BWTTdj24zUtoxOzFIAF%2FjgPVGBnMgOUU7GS8V5pAQdBJZD&X-Amz-Signature=af079b79414c46f0fca72e66677b220d0f48a46c6f35901632db0de90e912d5d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T644KTWK%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIBMcw6LMrD%2BdbSX8Bz3CE1Lw95WTvohlLqvjqUQQyPIJAiEA6hMjy2N7zGyOET%2FS%2FfJLKc0AodEvDvlZ%2F4Kchpx%2BWWAq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDKPWxjPLrxMX3MFhCSrcAwUmXfv5RTTJxYvmBY4mmEP9zITbrVPG5tVYgiUAUaWoO1MD%2BDrOvg3TnbRI6cAwfpDKG5Bb%2FYeUuHfxWaaVJhBKb8p7osAgp3NbbdXwpq7q%2BrWB%2FjgmCSk5UE9%2BDfrF66bQS2SSqUvy%2FY2JYfMADAZkMZY%2FBhr%2Fiu%2BUSg3O52bd%2B8%2BVPJEQ7k3h9E%2FLmGYdDY6kCovfePWrelfc9Wyv%2BTu4bduoqONSStE4SUHTtauhXqrC6EuEbyn1agCpTVPhkI2nQQQHBzkKK5XzTOfoeR3XKTdc575rdSVhWqZFGPHJmcsFYu0VXrULIOUhbQbSSjH23ceqEDAXvJUvMxWw3xqGtdIaMYT8DIl0YhHPtimUOOODTPDjxbVrDFalMWagJDiA%2F6uvCI5FV0zH7HUNXNqFrU9e3CT6H8hdArDRw1ySfhdxgi%2Fo2FqRDBu9tg%2FeiGzMNR2VnSYCWpT2PV%2Bm7sceiRIJWCq9k8c3qhcXhem0jujhe6o2hoXj9PcaPKbc1h0TRdGhzYVAXKVZsOsPNbwSmJFnYktfva8cpDl%2Fj1ZB3ThdJ6FT03u9mz3qqFlbUyGI%2FhhV7vzDEJo25jTrtBKbPoaMWYgSAuwR6csrSgwS2xZJ1dAZUjQou66mMNrKxNAGOqUBmtbvD6DsCA1js4FCRgGYzIosVVrbbjkg0OqsunIs9Q4y6OptcY7o4QpneW75zYrDQ83Bj38%2F0EEndhEEOBf%2FFLTILL7B1HnEu9NqM8m8AzRPBn0PyWLeZB5Ix5LYcqIhon4h04K2IVIPMll0MNeZwjMuNrsQWK%2FRu4d%2FKxJeHFaqROKoU3bC%2FHIKlcOTy4jAHM3qpCp4v5Q4hh02koFHucMywnuY&X-Amz-Signature=f41886fb5efab77db4e46bf859e2ebef5b22a7270ea33a529391ba1a70c90ae7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QYVXTVSU%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQD3%2FsP403aSiDnhBfjJYtHxLrnD8DxgNKoy2fxW2L0sKQIgdwxpdjsyGwReZjvNfwmyM0AeHjzbQCLTdKhou9sw8Mcq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDOGRdFP4aKwrZfUc6yrcA3t9zronigFhde%2FajOGQtyIG9s7CPcdCHa2JRIhPFVW%2F9f0DOaxn5D%2FFDRIu%2FU1Sfjp8YQYak2jH4E4gFsmQGswZgTdWeO1EbTHsTmoZOYKonXt9LSaJ7bWwHl3rbpaoZgJf%2BHEvjHubqlgbKqMG00%2FWx9IjuKijGmA5NT8YnKzQGjf%2BI0mRGP1mf2DhKVotVzbLhOXBvkW4A3F3482oCytQA3XSN1z7%2B7bTRt4EceEWVNwMHZy5diNAFVuVOlvO7lr1tKWSr1%2FfeOaDQnKsOG7Rh2T30RBKLQ84sMA5Wzns09EvVlBiOYjtIZ9FKZ8VEw3Z0lpXG3VWyjYMyVHfeFHX4t%2F39FAYR1i92Cu6bOrc3%2Bd8YFr5aVLmB%2FedfxWsA24eaj4vKG1jBCxemEImNs8vaN0grR2xblaCJ89ckWPkAXrwJvvJ3rG5BOLponr%2FZdjEOKTC%2BAVODjMR8qP8mcQbTgEstujVS6Ea3nvgEsGMLWDgcTLff08U3fShtN60K6VReAsC27sPUMbi6TqltjvovIg6yxokFU6TTYPcu7nx0bS99eLhLxPo%2BMIY437qJcM89Fjli3sZkR%2FeG%2FM4gYcVqmt605VP2vQGJxoRMZNIFvEkFjEOY6Tacs3cMIrLxNAGOqUBsNpSKxNK1K3zK4ChRlYIBG0pKRa1Nvd%2BZfBBCjCfnZMfB1gBpO8SaUVE2G46xQPzUQYFB10cLxyYMoByARjj7oVY3vTFrHsegghiWs2L5OO1F4KsoiPhceNTXdBYcVCfGsqYyBLp0NWoAWjdIPa19jLjxmfDh8i57BQDI3Zt2dLW3VQ%2FGmZUWyVERH9KTGYDLPZV8wbKWCBgH9haHQnsajUGBQ63&X-Amz-Signature=e7e211a7d2232a66b2f57aea8f8eba295ef7e9928423e3da470790b438f22140&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=196b612e3d9ad061310259600bbe9df8d5fa8103542e1a939efc007c6a53c718&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZTCRWI6L%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIFgykxzYF%2BI293YEGH6JIF8fc%2B1XW6ExPfJMId3hOeBUAiAL5lfVUKGvH6PRV0JyhjrtO9w72Rg974hnOJOJj1zglSr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMuyhcJRSEsMF92A8hKtwDtMh2WJnHmmew7F9LcPKvriCU9K6m5KFMcXF6jKvn3%2FFahUagKVSj%2F0miPqWXVVBhd0h%2BUxVGHcJSQVLj%2BiyfVw99Ql6h4VsjJGV04C%2BYRQnFxMn%2FbaZYyHhNjJZJOlhVu4MNuCA4AUQ6heCZrxmSEzIyE%2BSzZH3wqpVGbvmniaMJzSzEgb5j9gYUtxzw6iFyxlneYG9alRqVTzTBbsEEdwT4mVSwaB7UO7Tlsv9VJTTZfDIRwTjkoYwZkEPmQFaxk18HomOpUPVi30fgQfHwiy0GYkdlgd8FtjPdBAmLgEWUIXrZXA3l%2Bq2Y1SJ0zS1IMA8RpuRwYkXsaVww%2BFsdtYq14XbYONswGOop7qhsQhfM4qHFEnXWOXXB0hetSIiDC0zMiOf04GiGJR2e3sW%2FK3BgG2zk9tAksrs5%2BiEj%2FxdnozoJf23Zvim7Fc%2BeNQ65kLhJb8b2MeU8gUQrFQ6zK3EW8%2FY1iMU6D8KaGmgfeswM8SUr6llMDbvrdGfNknQQh2slVDqwZypMJdOOmAq1b4KdZqjgLy80wGTi%2F6GtME9M%2FqHkYRcIA3kOZQlNpUNWKVwJwXjeuwOv2UM8jfg9hQuRxard%2FYaUE0TDnLqPfqffHv5VNEIBT3faj6Qw1c3E0AY6pgEI%2BACEpHj%2FcdJC5RfoyHmj91Daki9yuGfE1Vy5t%2FJnIDxLrddqmxzdIkj7CQ8zjxKmOXYYrF0L6K8bjJb19rpo6ixbPBR4TZinVtZhOIyjCl8O3pU6HA0cBPH%2FNK2mCZtJvuzI7YNwABLzFvPBqZVOEK3rdYdlk8TRz6oF8wKSjEIeZkSeuh6W13sRENdyClyQcgS5Qi3PABP2LxkHeUqxwS%2FTwHcu&X-Amz-Signature=35e8e6525e55ec09f2f9e306efff9950e1c80e2e88802cc8bf4ce5016e0f9ede&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

