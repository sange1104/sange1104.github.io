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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031631Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=67712298cfd7c8f2cbbea058f722a7f6d8890d94b8df4f57bd6c983fe9fbf38a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031631Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=218e859f072e4f8ccc0c05cb90e2edae966776c59dece5fa395559810368f804&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031631Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=889e53b1e5a4cbe04bf77d1184bf164ef7302b205a5f783d0a2d344cb68af0c9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031632Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=6eb13fabd3b2f074dabcc4610ad79dec3a9ba6fcccb7b8bb096e5631dd32694a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MNOYMND%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031653Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIFMyGDUl7rEmUEvk%2FYjvrpwO%2BkSsTYIPNJkPJpyCsertAiB1mIShaytmjI8eKWJEn%2BouIyyv1XNf8oqqJNKDbrQiiir%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMAdWEcgK%2Bo19Xfz6OKtwDXmTIH8yKqUMIOyDtsYme7UlWk6xUymmqyXCWcLyZ9bO5fihKRfXZ1jxUdSrK6reAxa1ch2yYbUf2oMg6Cl9EcaDLB%2FOTGg1Nxy8u9eNQJlLHv%2BTR8EbQ5mwR2S%2BlFs0me2MPBkm1ji8YKbTVtzT7KoxnmItYWS10B6x0KUHaP4RA7n1VL6n0oUkW%2Fez1uHnoqdJPJuF8ZJVwUB4DT5SSCbRTAlFVM5ooyeZ2Ulu7yiNxcESi%2FOdHYmoLTq%2BUADUDsYx%2F5aSeTABv%2FD6N2yULTh20eIac8sIaaL7Nl2pL0iBjmvyNMVkvOSzKgiWrJzp7h95MFlQVyPQhFiSc%2BVmm5RsELlhLBWmwkZVI6eB0iXw6FUPkj3MIReBvz5gwxGlMQddtvhsdrM8mkQwu2y4bat8NLpN4vkmX5ni9ISMR8VEx%2BLLDMySrwyWUtX88r8VfR031%2FWWbtbroifNFiAa7JDZEfxb%2FA%2B1u1of16lPYR6EJ%2B8hH6wnbF3NPh1upTfKZOt9hIrxt%2BCCMCSnSC5Zzahsij7Th2FJCMwiCVDnAYYjrPcde7OAQh6zKqvr4DEinnTFc%2BS5taoF1%2FzH%2BvLqKTY9rNFnt%2FF3bhVoggVEIHobqm6kQivwzS6E0a2ww99W4zQY6pgG7R4dhR9C9pRiuWaGp3qZKNIWrXQXFSY%2FWfwH1EPV4yCdeDa9Em2ZgIDsof9SClS44AVK4TzEygxfWg37EkiVTxPUwMWRsYzPXtjZxVg%2BIuZUr9%2BEkCG09sT5zDKWnV%2BHmHF59ZOiKTNIrHwQWN%2FM0ErAHmJeZqvoJrHoqdvBfxpdxMwEolzItMPJG81brhBnTBZQ9cY%2FTds%2Bq%2BwOjNxcodqsrFC0F&X-Amz-Signature=90b489c0f85a9de3d5b41ef9ef6a76642aa9bf2228b956798973241336b8cf34&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S26GDQOR%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCICb%2BNXCSGMUHccLf7M7Pk0ucHVfC8t98kUUSrSNlQw6UAiB46Z49Q8hMdL4aW72FQLXBlORwEteIVuesGFULmiJ4Dir%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMfddANy%2ByVHUh14Y4KtwD7WkxychMLdpVYqgQlyDFrR43j6o%2Bc4P8v83Oza9rE4iQADCkArEnrT4ReBhtFiYiS78NtoWb05UDako5cFxtdUhNWJpyPUg8RGr%2BNWCZHxRMftJ1m4nOnu9rUWNnS6bPCrnV%2FPkYXL4pkh%2Fbs6VYdcwy5CaWAJY9Ys9VhrXpWKwWrWLg4C7txj%2B8P%2BVn5M0DQHE9gRfHjDWUNqe2uglxLNlsANN96HBnUemieUifq0vP7TL7OrrQMvGwekBjQTv3LjzBQd2wZZfgsX1PvsVRNjhVnOBU0ZWoN5EBXloAIKgE3OiMsZ4%2FP5lp7tw51C80MexfJgg9Pzcbi7y1Q0QVEvFZnTbOcm3KyI9pVRGofC8mig7FoyCgIdN0OcBz4w%2F2kwY0yLrMGls73I%2FXfS77ml34pvmwIRaqnvtLhsWADpipEPXQW3J39de3NNAUedpyq0xzYTognddMcXZ2rZeFENIawB%2Fipw39hu44LcApQcFgVE0Z6LSEfiPn0OK09q60y8FkIXoKcJAkMRbyucw4bL7M7q2E0f%2BE3clBW2N%2BMYc%2FIOvgtAjddPLiu9znHXKW%2BEb6ZxmrQjcb7ORwU1eACAQZ%2Bf09k6V5lw5aOwyEeQ82XR%2Bcg%2FFFQajP4sIwsNW4zQY6pgFeSZuF4BTYsuM68ZXB78tPov%2B4gznZQSE3xgnED2qhmM1%2BQ8Yq29kDbKLatcfRrnByQxP%2FA1z%2Fym7HVOIVL3YJCoRb7qlHZWl%2F%2BkRYaqQTibIx5DiofyU66Py%2F3WvHb%2FIts0oJtjwW%2FvssZk%2Bt6Zbo%2BuFf%2B5C%2F7yUAHX8UDZuwfSUsR3ER0AA3W1BCwH2Omp7K9Ft2S6PywAzh%2FKyCu8HnctBzYsGV&X-Amz-Signature=a0bda5faff9ce51265ebfa944f2362461e0c00b922b257154e3babeb30519002&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T6GCYVBZ%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJIMEYCIQD1caOY2J3TYqHcE%2BuxEkQcEmXBI7S0csfdp5CSWqHkygIhAOJSUQVVKE7nWx3hPeY4n9u7zHIqg2OBZBrtsL3wETb7Kv8DCCMQABoMNjM3NDIzMTgzODA1IgxeNx%2FayWz5p2VykE4q3AMR7YWXzG0g7802BC5gIF53XSPDkhgToZsSn8IltRxYOxVTKz8cCris5J8bCCt%2B%2FmNhYDdqjRwbNhHDGFkniu8ZUO2g5XT4Hnk8Es4YnOgCpb4d%2BTPj%2FVy%2FmDzHgSDA7kLbTI7oWhIvHTRGfJIxN2m%2BxQCRa70Q9JKzwhOnsIJ6wj%2FaYkgpk%2FGu2ZRvs4IDMGalQgswym9IN9TAVeKYKAccpdf2oo1unytgy7FXIaQz7%2FoEmODKqYHq%2Bre7pnodghC1SSxOM0C%2FOQWaOo1SvCg0EET1sR9%2F8qPevkxQencgH5zphM1ENQ7hDFxblW9EXIvVgBW9fj%2F2mq8rWT4tlWooUBeHt1BV3Imp7ez8MlQVNfz0s7myQpo22mAvVai1Ewn%2Frh9FVguq9KRCETlfNyPLhWDZ%2BlkhYC8BfQnhreE0CElastW1ArupSqB3Uq1Cm3OchpCAL3w8ncnxS0cf%2BMNDVIaGCpryLxDgvT7tuwd90MKXdiwMwtznF%2BVkoL5hYcUOfT%2BGMbOhbUCdHpRWyFNV45BcZapVvjvcTGIyuoZFh91b7L1LvJFyxrAucAikHc%2BTnKNIuE%2BszPS2OhxLUKLBziB86aPfspO8%2FTGDJNE%2Bl39%2FEEZdUF%2BJT6XGazCi1rjNBjqkAef5zumi2V20xh1rYON2VQNV8CyRu3Pf2AJ9HUBRgyMCRR5w5MUuQuPG%2FE0ZaRvb0s93WOzHtbsDLuW%2BEYNrCyYeH6vCEdKzQPUc9nstJED9wuX3oBjwhTN4LLYv3NUl2ydemmptu13JrB431p%2Bp%2FohCzSI%2FCyssqJCz0iGdWpny3OdBfcJR8g%2FwkFwU5xYjTk9kyETvvJ0UOTDip5G9DRg6f1gy&X-Amz-Signature=691ee29592cf7183b25ed8e2290c8760b8374e1209bf2bad76c1d81c7c5efcea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z3FBBWYX%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJIMEYCIQCWdEQbuQOi2%2FxiOVyQpm6FmejQ9GjPREfwEmEeYqcckwIhANvLGhKclsMJRWc3ar%2FaUIO8h3t5k2zZvExfqQsDSBo7Kv8DCCMQABoMNjM3NDIzMTgzODA1IgznSWfj%2FU%2FWZp18AXcq3AP5PznNrBCCAa9J%2FOrdmeWVdoHo2I2zNfxMWixRYaEcIivL9EqZSi1BqsLEHMwHdtzpZvDfNChDqBCYce1DRb4cENYQnxaJuyemKD6CH9BIaVeGL7hifFFH671A%2BXMuGqYp8YN9j%2F94I60xpzxXevvvM6j9pFuQe%2Bf68JSqomwp3Y0JKrRS8FTeuDx32hkuKT3E5tRqoBUCN0SX19lJcf7d80H5T5gDNY94m5YClmjSBYzh1IXwhsDYUGU1TiEIPdmL%2BFtZ7TJuuknnU1FPfFrETL1RZtaYtCOGzT4HSGk614KjCqepI3qb96lZ8O2S%2FeGgr3Tzq25D%2FHldfz7kfJ%2FbVA42nNsXM%2FQ%2BmNg%2FURb%2FpCOLFy6kMVO2n%2FUJ4r91mR3%2FNgR9xefIeEWbvXwxUjFRNmhU8vo7LEwApINbBo2PRE2rf31WPfUaOqn%2BLfUSFseyah7Ph0p6Ryx4mQ0F6nWFfn%2FsR1U1xXInDD6bZHqg8uQds4eCwrli3EwN7xIkBkWJQzP1wSXMYwf6uDsiC6v8cwq3PKPRm4HV3ttxq5Y0rhnhZV3Xth7S9xbqYJmEOLPz1760HUS6jtSh5bqIOVxQJgbNqkhWodDYWGkS%2BbcqXmijuKc%2BawzxWwgLTDCW17jNBjqkAeQhUX9u3Ns%2B%2FkrAdRjyG1lpavUF2xdacvQ%2FuCjKuemDmolrqyZ94%2B2ygNh9xJ96K%2BtZpojIKG2yqr8ptQrNKD9mYx5yfasGN09KlIaNSasUjiwO01bblqbJNls42ZfT7Ocn1cRsi6VnRrxMNnxJtAO2uIP%2BMIY2AQ3lFXGj3Q6fgvbhAAbsQsi053mMRI%2FEWLl38fF6ZZFPkDymNEHxOk92B8%2F%2F&X-Amz-Signature=38751275872a901e772af387aebec0274affdf328221d318b61e59faa62ec4a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031632Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=d99d0644d882efe280fbf48d8ce78980bed7ad446ff98488219fc16c3a303e3b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031632Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=fe6d4c9f1aa2e94aeb041c38cd157edd650e2808edd45539a40b53ea709c4d53&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V67MCAFE%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIAR5rNHVi1ksgYb7rWFiZwAE4Qjfd84vIzVBHKZw4X7vAiAWFMblfg8xouNIkkOmDozoOJP0OIF%2FYHJCJemQ6FijeCr%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIM7R4TicPgV4HFhPw0KtwDLfisvXTLW8QOKbWFjvdsnfu2%2FNBftVeTp2fjt6kNZGqjbROHiSjQOTy2vIGmjyNBBRK1Mubl11e0HaXtfKWRWVChz7wplXRzHgZO5Eqf1E0bkQlJwg6TG%2BF3M%2BDMjLuh9An3ruFuBVfCG%2BjjIs%2FJ5y2UxNzIhuL1VJb8qxKQYKci%2BO4KkqpxgOhgG%2FJd1WahjmdRXLsZ97A10RSqOi%2BRR3Fy2PCUR4rs9c84974N4QsRlun34uCntOwN2nJ2MuX7AB7ErWpAOQaumUlUrtKHbZrKu8aZR7I9ekmSdPjzervKpAkxFhiOsViCkFitvHZEd4cxW8ey5H%2F64zSAAK5rBVEWo10Ebyg0Fulob7SIK7cx8wjkBCmqTFF4adrzaAkRzTTYu1TokWttpLqPMgyZ8Ck8v%2BnGhGGGVWkeORpNmD%2FSBQ32Ay8vp%2BlxQ5SFSt%2Bjg54Ar5LFvShhgx%2FQBj7Ygt%2BjsmGnPeTCuC0rg%2BtcoFKq4nRGuIMoIpti2w5zQo1SP34QiwueHKKe69LeiCPm0CtVrf8eyWMZf494bmfoB6HCdXphnT6gRhrq2r%2FMmPPnEu6sO1sEcbedNz6G%2FlO1jp8y9wORrw1NVf5cTPzMvsFaQ%2BiNfB4DJvvU%2BSww6Na4zQY6pgHzLITrhcGx5pXIpMcBjWfLWDUWrthKNOidlzZC89d1yi47wRXP0BimzWkoh5AXGb7jSXvEfYyq9WT2JJ0Fc2%2BFy4JbaWbLl9CaTld32MQcAfpcOz5vc2amVDKQtFhKuigmjyeZb%2BUivpSrYuBRdBA3GiQ7JrG%2BnlQDCqsfln2nAiOzMDZamHYJkDdceUyPOKEegPdqMIx8PK6uD%2FSv9QKv6zxgQA3%2B&X-Amz-Signature=8218d03c13a4cb805d7e6a0e4ffae7b3efa252e911bb7f70b509fef3d4c7b01a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031632Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=cc3e93199801983a80da390ef1193bf1f0314afa793eb37274718792e837ee7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OCR6LFI%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD1DEW%2F5UfdfR1JteNqNHOXGbTceiynK5Bn26PtJD%2F5UwIgUeIzgIgaLXiYJanM4y2XkzRRpVrGDcm%2FEiMxl7Vc03Aq%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDF5o7HshmgjzzGZ6LSrcAyM4ULTiZAzZXheyX903hLn3xMSKC98WhTmMixez32LL%2FOVMB7EWLmuviRHP3bW3RPg6iuQnZTh5e4sVmOGxH9MF0kT%2Bc4766XVAYe5rtaM%2FU6vJbaUSvPS8k3o0N9qqNL2iyKSkDzQG%2FlLdoSZeu26qsMoj5cgzC8ZfYZ0MrF6abdhdNCTL1jTNhY4n%2B8GGVnPapPmRKRuZ9DYYaoHskD3xSZgL1Y%2BAG9NEmCEmnfYMOeQqtwpO5aZBJfeBL3XCvO8eXjpNF9%2FMH6Ld5u5CkXNVD89HyaEz2kxmMPkrvec7xxHkyli7ycx048AAkbWY7Gai56SbLN5chlYxUA5cqiB0o%2FOqO%2BJy8FhLqRnzMZmLtQ8%2BRVaNr3rEYfCutRLvIraL6Mx%2Fc2c4M7W23gb2YyuBcH3X9LAv5A6HYLNdPuJaT4bVOt7B%2FRQsPBS3r8l3FZC63qB4heWAYRMSpuhGB9CQTV%2FEfsFwsyLpZi%2BZxFugdNZ%2Fax%2FQBZrPF55pHowlnV%2FPM1jdZb10gMoJb%2BKX2SAsfpnvS%2Fr4QYIEs0SrM1AmhqKyZ9Xms9c2nBYkbk%2FKxRAqrqoylWPCaSzKeTOR6Ys9hLCxYtOoz%2BQdAm8YjPEeLypktUDeP9l1zgyxMJnWuM0GOqUBrs4A0cyBHYtoYovuc2VFJArqEITM%2BtU2Wche151VUi6%2Bzhf%2FjRXpbVcME2KXz2%2F5JrMLYDgawePPagygl8uJwrMkJSLkaFCG3bjHWao8GIWlnLsqR19EQba%2BWg479XiR1s6mibkoD2WuOH049GrBqsmtr9Nb6FjL%2BLRN0vFcGFrDWGwcZhVzdpWvWfA76%2BN3jOqmt88lBbJZCWoTHTpZd6RsZXdE&X-Amz-Signature=b52c109f0996d442aebd0a5dfe6351643ee52c2f549a7226a9b8880d7cf9d06f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RT7XLK5W%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031713Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIBP2gjgRzOxb0%2BSrI03fHOqpyrKZ8GJUVY2%2FSxkZb5RoAiA%2B3XpmS1rnWpM3qp89KnX7taXnwKzxJdgfKAc%2FQTd8Zir%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMe2CZN1NVSKkXEzIRKtwDkb2U5EPk27Qo2%2FlMk0mwl%2Be0tsnF4ALvTShRSNL58PSeuY90aQmJgZcQPSBwyVfGTvgHcAU0YYOi13PSsw67xPWZXAF%2BhSe%2F6VBt%2B%2BKVkBGHr5RVTDPpkaYTLtW0XwNl0hNwIdLy8ORhmgbw6zzJclwKzP%2FTNt8XznvGNOLXlCavO2xIcYs0HrEdpYN4fZ7Abk63heKyUJMgB6PK%2BypvyiDExHDg7X2I0CCu1sKew9S1sLfRG3%2BdIom3Wf%2BJOy%2B0YBxOb8PutNdEFvKI99AllOu%2FzAmkWBLi8wsvH6pUjDnIt7KTJXK5zSyeGZMRko5inOfqQjqO579%2FWcVHbnvhPLkdJtDdulqP328QJ2LPhzBbhbwrBZ%2BCbHYy5TacVu%2BdOoZK%2BZztsVtAKN9G%2BRszgW%2Bk74gevpqtnfGTOYu2ZcjYG2ZNl%2BmGwA6GdQb%2BbqVfEGZKEh4Y%2B81NuyZGyVS2V6C%2F%2F%2ByKEa5gWl4Jkn1mazwraOMyorHZQJQ%2BzSxXhlKroqgAUSQ%2BgZAffZ5w4Tq2X4nQXrib82zhGfQ%2BUTiCkrW%2FefT5EwcVE%2B2BN1VBULqaf0V%2FF5fxZdy2OeKJeu8UMfx0nYaawOB%2BC7tFmGLlPNK7ntDISZSvw82Lv%2BMwm9a4zQY6pgFJKhwYCyN6rQ0YfD2z5C06H6kaY07Er8YIO3ERPGUPcozseWLDYqvXW6ahSp0uJuicXXcChlW3vWl%2FsabGaodv%2FpDYFE4G%2FuwN7s0xl43A1gwdu9YCu1TmerpI%2FpLGQhE9GePapli%2F%2BjKuHit9X7cixAi%2FwBNj05hTrun4Nx8Sprjok%2FdR%2F3TRvC4IdenSL%2B246MyKDAG9Ah3nrpsUXuDpFBbHUQcB&X-Amz-Signature=6d8f85b35ff1ada63e2da1def8001f2d8334248b8d0e6ce2981d88d780fb115e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WI5F7F5%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031713Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIA%2F7BNBi9eFsc3MYCMfPhY7E9zMcTw0OWfeaWavLd4mpAiADDzybiiaaOY1ZP%2BjLJtwfxz2KXBX0OvrFUEG3bCoVXyr%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMRKkVgLQIXYtcAJO7KtwD5AFmMCkXE8I6fpli%2FqnMf29EchSxgDdNc5GLfCT7wvVVi7gK9MYahWK1Y6cZyBhRz%2FrqPeVM7DBSU2JpY9P6roA7ZnCDrik9DA7hoNDq713f3gqah1dlOA4%2BnZh2vEgNpE3DDOeuUFj%2FiBR24%2FGCCDB9lIQeQDqXZZubtMDkGHcU2o8XrjBrp21IFAJxXq2rbeZypV7SYxiZcdAXbhs1RnMcMPlui%2Fk%2B0OIJgf1l8FwWemM1e3LRiC8b3M%2FrPGBEeijhwYV3GcSin%2F50ZrSAg3bJ9zMO26M00WiZWIMbvda2WOkDPeQorUmzhMCpVmjb20xmfjdzSQ9GUUWnsoXDDtmLtyOBBb1vX7SHEGH6G4OiS9ETHV8uijkfSw4SUN53LsP5RNoosviPyns7izbRQmZ2JfRIzI%2BfNWehjWcGsxM5L0qmsyXyn4KZfE1fcda3q9JTecKeeWKI51uZxUW9ZmG48VNc9zAsVIynZzIceWcaA6dxFVEcDniuA7SZCgTaIFRdFmjVL0sZgxUK5xb0zeLd8FihpzJYq5v5Yoo9ZoqS5fGSda19sjVW4w%2BGih%2BwCudlFhMbUp1ZojELRQljphY%2BL2RISBDHlIrCS1NeNtKu9UrxdUl4yK4S4i8wl9e4zQY6pgHNTBGlFXDrzG9ravhsV2%2F6ni%2BrWruRouYSfCIBux0bAuKPii1%2B0eESEBDt4hK2GwaV609%2FWArdDSPEok69aZfXnwwms6MjZWoHbFb06xXp6K%2F1WqpHDVWGIytTbLqwNb8g5UK6YAfXWUbkgax3UG3diElE4sw768L1CLw7fVh%2FPVPuTrZkqzJ3enXX2wlRdTH5q%2FqKArtxdMR7CsnzRkY8scX4Gr7v&X-Amz-Signature=33665fa1707b57f08d46cc90eefb6340c6f30edf1cbf48110c23321b5dbd2226&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJLNXBXY%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031714Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJGMEQCIGIBMVy4k6Hf0gge3sfLSO0cAkq21kBmOulN5DliYrZVAiAnyb34pZV6x4OrxLCf77quAAsfvnuvL55%2B%2FRF%2B%2BhpVwir%2FAwgjEAAaDDYzNzQyMzE4MzgwNSIMn6s062OpFOQzRi1%2FKtwDu9crcB2cKztDM4OlUTa%2FtYWCyAnvocy59FGVmO0QSWSxT7czv0%2FrGKJ0SoPL2Dfxl%2FyMCAnnuQNzk79yP5crvIKDtviUymWrnbS8UG%2BwMLY0v1MIjNs%2FSAm%2F2GZYm1N5E6UoPYeAHLmGbzgGOodRKDB5S8Ris7XIAFSCTJSdhCTStqgn1blIL20s6QDi1t8syDDjgw5HFhyhgDt7gpFlQYW6bPTF2rHwmPKgZuelgytfRcoyMfktvHQkoEcn32CCrUSEk4rflYoNjiYZEiQMQefvIp4kOcn%2FDNnctUNq3vd5zc9WmH5so2inMBbbmjCcDwNd3lbr2TYz67n%2Fjr%2BcuT%2FjsX3esHKc9O1llAOVQkwIgzGmYH9HYRwqsfgOuwEVc7J8oWZsVnpTXdrjdspaYfRm6GIcigayFmNZ9lPwBvV4yURGhJUNUOIXNlsRaKpvOhLFnB4O8jDyCp3eDAmsC4%2FNyhJEjk9D115hRoJFIZwIsQkzCPo%2Fo6jR6BkDh952UFZceIBGvE1vqMGiHadmCKZfp5%2BpB3t%2Bxg%2FcxWcOamHFKDaWY59L%2B5SXUbS0GtSIMOE%2FeKrZCWX%2FvH0guiGrW7%2FlVlGjjNC4jorVA6R9wDkASvJpauu48jx5Zqgw%2F9a4zQY6pgEExl3KKEtIdjI3qCKMx5xiO60Ki%2BoF%2FCDJFM1Oxvd5jAURakASJsJTnrX6GTejq%2Bm1jbMsithjhfvCmfRMJr0TOvaH%2FTlm19RfXrUIAaNgNZYKJMo6WcYypGN2OH%2BlOpUWPtukFQuKcwzbMIdKIFI81t5h9BXTnKeKZYaxqckFFAu4H4fkHIsrkc3naW32xq0rVL9oCV27emb3%2BCEqpWY3VYo2XF5b&X-Amz-Signature=10d474446388f5af8d694330d17f3c0aa2797b7062264e02cfaf33257f2a6ce8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031632Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=8008007453e0e8689d202e9b3383ee8027cd3c5e4550d4a034962441da4888c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C6ASW7V%2F20260309%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260309T031632Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFoaCXVzLXdlc3QtMiJHMEUCIQD95NWqjRuWaA9GwhgWrY3fJzOHyuLeLgffAHx%2BCnTzOwIgCJA02emuy7MFe2kkC%2F9QJhult93wZ7QYb7xssIDiTW4q%2FwMIIxAAGgw2Mzc0MjMxODM4MDUiDIWnVtScZPmRNa7yQyrcAzEkwlPXUg2iQP%2BpkZ0UN4hANsIYIHV6f7jGNTri2yhlXhwVdprHy%2FufTsBJzJVGwSQ5uDF5jA1Qjs%2B%2B7kYKReaojqzjzisYeShYjEYEM1wql2bfvLK4ouIvHe5WvebrEF7bbqihUrUP9ny1UBoJMZZ7oFRFLUjqSMFH4%2BLkAs5rj8I%2B4Py0SaIyrtXiKDcpbDdl8ux88wC1D%2FAsNhaDT59w0on5WC0JHVAnRQlutJio%2BpLYzzpjS4%2FfZ0RUoDB9mSVYLEm5NzLTZq3q0XE%2FnxapmdqkiseJveyWZEYmMfBcefLvduqsy3L%2BYsiTWHluqgni0ZzY7ALiSxfnikTFYbFEmcD6ccJSBWx0%2Fu%2BPIYLQZqOSXboLIoZbJIgfwv%2FftVaM7LnIP5167FByXhkRZ8iG%2Brx0mwClSg2hhmCe7QK5AfMrWPX8c1rkFKS5RshlsgZUVjjbwjA1EiZNJfoaczLdUWmSs%2BimonV%2F7piuxzOyTPPkz%2B6sLlEXb6u9Tkj5LqRlDwTDnk7Pg70kAqMMEq5BBA4aEno5hzAznXDrY3v6P7BcgKDZ8RxK0EbFdXLfK5iv3aSHYDxHeFEIusn3fY7gG2PB9dV9vJc9LMZri8hE0RQzshRJ7pkP7XL9MMfWuM0GOqUBV5FpJS9HPJEAvNPvY9IQZazrE%2B9kxZ1EcES%2BCHzKMQHKf5HlpAs%2Fw8fnnijpdp4OgZ%2FuD%2BZVS225LZzF74Atz%2Fc2VvMCv5cPvfT2kKhE%2FCjLR3mzGKejofYT%2B4Uz4iQtDQZldpJMtKdvhXI49c4FmHuWGAfG%2FQcecPkh5PJ3a9vnEEXMpC3pFo%2BhFCu%2FLo5MvyrbWs5LQisiKhp5jgNpxfdBtP9H&X-Amz-Signature=548c4cd9d0b91b406b7d115404a223b0c3efd808cc4b98e172c5bc4d5eead2cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

