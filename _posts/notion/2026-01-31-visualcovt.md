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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045722Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=4b4900833f9a5962c86b293b33b5a97f17278ad1ee1a1c12eb242a4fbfedd2d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045722Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=7c95857c1151a94dbcab88791205636f3aadf04c873d5700cdc7b4bcf45244d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045722Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=6ce0abed6664a3cd440cfb4304a5d5f68f055828c53cf377f8a026c003eee59a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045722Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=c634f7ff37d882811caad5d2f1e0b2ae497834edff5ba65688e843ea076509f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W5EZX4ZU%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045730Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDAS3q%2FiEC2N58Y3l9D5Em6o6A5awQxp0wGBd4ItuZOmwIhAKitkZPHGv7oNqvsCFf5Br2ePL1roFzlzbovm%2BC1tvkEKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzJFyszb18xZLry7eoq3APsIi4miK1jJFFqGRUmdW1CWhSXdCZ94PcPECvNAaYhTUfzxXYlsw9uTZjID2gnNi9KQkGrirjjw0FcUw%2B06lErD2pVPKXJ387BqfXe6HyMEBE3eHPKQ%2BSL3iB3w1O7TryHnONxYvFdpsNEhhFP67L0n4k6HmUvYal5lX7CVIq9hxeH8SRzwRUCzaUktWgWjpywtg47zhSy5mdaYjq%2B7FbBVeehMFli3JDQl38m2ZZQVERum7NiCkJag%2F2ANqcaxKjYQClGWShAarHGDGVQoDThs2cJCRatGf%2B4XlrqqGeO%2B31WvqWskyvLh5ZeJ7WYMJGLBi9kLFWqfk01NXoZyMQOOAMY5%2BOhs1BstTX7TM83B6fyn5ontHKLBADfIwDCab7xcHSK8aFu1AT21Ekc65t2PzKHyyqAeO%2BmRFytxcoSAXrA3HdFPWemhunGQzhfkzCmOehhKe45CPLdaHs0AqivSQlYhjBhx%2FtbKFFigfpOFnmpILVhesyyW5wLjfm0V5nrY17Xh%2BZ4%2BdAXKcXU9L74WaTn3kX5vR8idPnXMzTGUVqc6lv7hIMdqCfrX7wj63OUy3bwH9hqawNOpAZMjrkqDUUdQIZwBqrQOMD64y3aRHJHiQz0eXqtjvLQWzDV0JPRBjqkAbdxJRnPiizvvUlY%2BnsHCR5jqDJWg%2BEH7yi7D5f7%2BYvwRjcXOOwiIPl9oEI77B0Esk1XPR7kVJh%2Bk%2FJafECskCrXYntuEwuSiEd70UVn10oi8AeQb3YC0KvdJE0dPhPSYnhLCkQv%2BrTPEI4kC9tAj14H%2FPTYRlrMbCYnh1QYJ1w%2BAVqiHXy2ufqOvDkWfm%2F3%2BT27yS%2Fig6tMdXOlu48jbRuyYHKR&X-Amz-Signature=def7e4a6be9261b650061a6ecc1c636311cc68115214866a992273fce161f0ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X5M64VBY%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045737Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDwzYZinyRJv2wliHl2diYJ1gZ2pLJcUKw0ZfElSAk99wIgd7bisI8DXGyGqqXbeQpEXjD5nhq3hm2PfOR2X79NWWIqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLZexzsb5AbDLoKFKCrcA33A1tXt3r5N639db%2F2KXcCSGL0drQkaLVESSGx%2BfVaQVhOZpoWxil3YWQik28g4vOesxe6Iq11Qk2c64lVMaNW%2BHi%2FipcjDRThXnQ%2BCKoxPYL0BLrNqYseU0tftT%2FbnD0iexf0LS4FoxAybNswO0PFJc0xUsCDH9x4nGpVzisEWCTKyTnhRBa0mJP98SSaURP%2Fj6SeD4bpa2iyArl5a67O%2FcOzvayN8hi2mP8DwO8Ig6eGkXmTnLsizo7gVqjgEYB19iqZQFojgM3p58L0KqZSY%2Fxkz4Ue5PNN8cmwOlQ5H9giK6vLX7mZQ0QQKVdNgUzg0L8R0VfwuAwltimjRFB4Mu0wwXEjxGgfRzhJDNopZAsV34EdldGc5U64ahcxLGv7sEQ5y8uqavmFJ5VbqO12kcQ0zZFB3lETl6%2BPi8CA4%2FVBDCbJKenFuIkVB5smcnQ0%2BGBkhy9vYrUkMXZE0Anwgamfube1gOIFSnCFtoEtg%2Bg6wO6NnymP8HJOvPqyHMCX4CtOeXYrZG3VL6AExlaVqQKi8CDG5NxsKXbE7B18PPOYdbJNLrOJrzv6H6iUXwKkjurjegi7HunWfNRik4S4yNByJMvn64yE%2B%2BFWhzETmguNQMHpJFcS5Im9aMMbTk9EGOqUB0yTuPko7iSW0ChpDWOCpY9uhXDKJXp1WUcW%2Fqcrrh9uqF0f15WLWlTyywvZWudEGU2fDfur7b3xIjkoo%2BCcculkyMCN4u4v3%2BRZj%2Fw05HUvkcE59Ba7vJxDv4PfSx%2F9NUGXGzZKhdlPc1AKw65QkhIFTW8DhNUF2nIfDKzRH%2FKRjBwuumI8Z6C4n8h%2Bh6%2FqgHZRGG18T90ZrvT6SA8DqBkUp5Y3P&X-Amz-Signature=4d0360a88a6b4541c5aff421febc28be052956a45e23b59a6833be91d28b38dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QBTHJNKG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045739Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNMc2ZdQjYRDdPtpeCEc%2B7nOXcsoC6PDkGbbB1SnpaIQIhAPW1oBNRlK%2F93Cde93Z8r4d3GkL93Es4E0oyf6AKqG62KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy%2Fm9P9mlu1eQrXdVoq3ANHQOwXvLaEukuBC3h4cqi8guSDOyegHizVGp6nyjRtZGShHiWlRR%2BnLOYF%2FMas8HuZywtMfAmMN2Gfk5xXW%2FliaNw6LFYaosd9xLVH9ZMI8aWi3C4cyn821uKhxkvhGk0Z39Orjzx59dCihBsy%2F34vWPi0eBcVNZ42qGkiJjSiAS8pZk%2F5%2FKpxVVjKNW1uHs22GlcjPUuTRU6pZVRwEnCgH%2BeAW%2BY%2FQrGjBc7JYJNjeSVgKB3xPVOfRiWvN%2BGUOvmKnRVV6b2UV9ScLD3cZkZYhr%2B7s0OkxMPtCqIJZEsFNakgAIlGlBYHQljWtVGfDZivmrZZATIiB3p0BF9C94T85tJCdTSauO5uLAkWZVIuQ2Y5qf4lYhYE%2FeAcu2qy3ZZUPjqtZgcOxjd%2FhJo%2BxROqfnOJb8wTEIcLeLezt%2FFWZFyIHcvIaNLS3DCvOuMDjjJ%2B5tb6B%2FcrsfCiBQGXoRBNB7vs6HZ8E1YqeIuFpdC9BQ8M%2FUgglr%2FZxalPz%2F%2FFw2vA8aGx06jdMMYEL7IdTnFVjoFq7i8XVJ2YRUTepAFnBzDEyIlQRgZnoZfcXASJwdje2kQCl9TWJWnek1XwydqQrGdIdFUcVkkTaKzx23gkvQ1nC36ir5N0%2FPuMdjDx0ZPRBjqkAZ0QorjUn7WdtJyxTFxhL0BAwEByRDISiJWw6Qd1VL%2FbX3ayG40xaIVkSw8ofrF%2BnbuQkhTkh899%2FuP5h%2FrVCW0FWl3G2VxD0j1M8gtGf%2FAyD0RSHfsKYtKri%2FkovAlZZsSfSmp0Dgf0qoVmdIkcxpP5tNhTaP8r9Z752mrR3%2BzhI9snSvQD1E9ZDPrqDOBYWnsjmksmdTluS2Mvb9wlftci%2FiV%2B&X-Amz-Signature=bba9f84e84791b44c5737081e7ce1850a1ed420b008594db0e55413b75291bad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663X3V7ZF7%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045739Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCPJKACKjWn5a0JKhx1Ei3Xv5mj2fiGa97UPf%2FhpPCgfAIgKZctU6YSWZZRemskEvykbXmlviW9w2wrCiUPt2sNYN0qiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIuA9sLkg%2BM33waIDCrcA8KLPCXlDoSysE40AgIibAKFbu6IvXteRX1ib6UnyPtSij9qXNT%2BNtTxn6gYIurlj3NZEM5iS%2F5f4KCLwX27cEjZ5%2BaAEXLUk1tS3GaYAmTNa4kbSyQx907CpV1UiL7jnRcU8vUfbBnCA7TwpulTap3vro29JMEcBdcOT%2BT%2B6l6m1gJnqR3BE3JPuDHvip1Zxg56mm5H%2FxQrQ1fjyB0xgakUrlEGS48m08cLszBBb5%2BwMWVRqv%2Bb8q7cXHfZqTJ01cTjONaG4zzsZsaktVRRNXlghSa495PbNj%2Fd%2BO9dBg0whETAIRCB6K5LW1KfzQ%2B6TapZG2K4OjlR9HJzeo7cXOT5F5xqWiX5h%2BSVLS0%2FucxUEAhySmDOhenTCwLTFkME2gfbrCi2xNzt%2FgN3MubgxF%2B%2FmYQ%2BPYPfp8yPOLE39tM5SFwpykvx85R0utohYjVAfdP2%2FmaqXurv5algtWpvE8ytMzb2EBODVOnnTQ5DU0QquiTaaf3hKZTaFeYS8%2FWSL7EPCXftaltEVIRcCMhKCq6lWK4GVqiEU9U5ggfFsQLXcO6%2BwVsRbs1glWI8ehifKHuw3QULPv78VkUnhswbgjq8Y8rbNiIHHcINo%2BuYsmsxvNVlMQiVGy3Onz4PMLvQk9EGOqUBE4vIRfVq21lXLbvay0cHTF0%2BxVRy573myOJWIyaQvkhK1hUjfR0LrcisjFiz0DcM8VBJvZCwsCuUd6%2FsZIUnWynMYDLxcLq1pjFWZhangSg3DeGqDqauU33VYXIFASiPtHOtW7L3zj4ky9tSZ5oLpEWTS7NLdRVBi%2BiOlf%2FXWe2hipdnJgBKknlColKvh1pPbuReMFTPd8NudXrzTIXUZtNayH6g&X-Amz-Signature=6799b14adc8247a9fa1162c7420a9562076320c05098758d82fefab9817a98f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045722Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=acd3282f91afde7a09ecebab37ed35dd2a7e5e7dc97d93e11b217cbe742ab8f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045723Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=4efc8008492ac9f8d751991b207fa5055b108f546c17c35e141074b55c6c890a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YV3ZYUYX%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045744Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDk69qfzwrtEvT7wZehEEqw95N%2FuOTJl%2Fxf5ks5gEFkvwIgJteCykwxcW5riWwZ1TrOqZpuATguuMZgrVmy0aM5PTEqiAQIlv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKYK3NGpJmVHSLMl8SrcA8HWxkELjRcbe35ay0TaCkYwHBDV%2B%2FTC7RjdxB35Ck0Td3p02BXMpS%2FrhoblZ%2B72IDw%2FocEqDVrGHcM5vWoXCeJbl2H%2B4M01CdXhh%2B%2BZeN82m2D0pUsc%2BQ6DAleWRzjcPWZdDigSZf%2FwPB2QAu328kAQYaKUBfbzberutnLTsH74t3C5h1TTXOqDxV7Ct3aMO2IZ1JuuAndn91nLGEFiKKrMgF8yOLzFIA2OQlph04taZeexSzTF9pvydiHsE2S5yeED5awJa7fJ%2FoXWVMTxlAawgNFPoM%2BvjTRinVCtSf%2Fe%2Bc2eIYJjvtrA%2BoLp5Kc3O2tjtuxDQsC3SEVp8EdrOoEm9B7Cl4LzHnS2LDu%2BsISJLf1u9smFYLbKNj9uVhKgzes9GWUzkUYveAXqONHCassX7vVdSF01DJ4P%2B5DGSPSi0IbfZZP%2BGeU4tQ3SELKSMo4XairC9R%2F8c5nxJBi%2F5%2FpKZOFy%2FOj69b36M3HnKlvejnMC0X1CvjaapXLvqlkzLPSb3flHwne9mH8DfPze7UNenV5tkSZ8iGfJty1xXCKB8GVALLlHudvQDq3hT5ksT0%2FUtBd7b0QKBX79tyG5PWsCF5jWv4AMqXKHbDjUAhdS3v3YIs%2FuEd%2FGFWn9MIzsk9EGOqUBnoD0AyQdD78tcu89h6KWtDyeQRI3Qhqiif71hAXotJlibU4vK3mAqywsXrI%2B8xJXrr91gXKPWOcQ0ddh%2FpsP5CYA4MPQojhVWmpZBm7g%2FR2m4UU%2Foa%2FNuHbBldYBXDsInmxPxN9yFHfj47G4juMOqV681zo1PuwNfcvr4UXh%2BC63YtgUK8yuXV1EcCPaucXhFxQMXRo9Yr5fIxQXen7iHxHzszHd&X-Amz-Signature=314bb19c869e523852904e636cd646b8c8f7606a702aa1ba5f41f022f5d84a65&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045723Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=3200094be682aae53bc42035e44f3df5c757037f0bd8bad117de9ead4252fcf9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VTRYZEU%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045744Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDKOWxTgEGsxPZ2hejIBc%2BfSe0H%2Bi2V8mLli5FPtw3LzAIhAN22T7hNKUf%2FquVEuTd%2F%2BqP8XvBrqHD%2BwsAIJa30BRyDKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy%2F3FECg8bH8NJChYQq3AM%2FHZ6YAeR%2BnvBO0lXsHw8JwlMmu4K77Qxqn3cb6w7ZxixpVrFMAbtcybI0TOMqgoWHtQTwb6ZCe24atAdi7R4hto7hK00bn08JPlF%2Fdr7qi009zqKUOSXc3CNFW3DUX4bDkoEM5Qnx%2FKQkxCYiXzngI%2BqHOAIUwLJ%2FJPJVtRNvgR7jYeiVzWgwDVJUWPuV9pvsxZ2XrFbU26lmjnL1Yw14wPy60mFjUXzjwelg994WMNYmL1NoVB7hyO6iuNTAiB8U8JoTwkmv2nKEWv9z8K5TUs6Ba%2FGlfMebdch8zi6iKFFTHf9wPpkh%2BCnlDq8ErZ7f%2FbADyBI1KqWbGcKTmZ0RcDfADuIsZsuc0tXYc0auGnk1Nh%2FGhJg8kMgGCc6ljq96N7JIHSGPfwMtAoBQoIUH9aSciX7E%2BnavODPZdwo6VnN4RzIntTdlXGbJ7pZzlcG3bX5%2BIAdjesv%2Bu%2F35d%2BT6SZhtQUv%2Bullsu069ZFTNCSQ%2BtJ9bEFkltAYnefDZNf27rMbz5s5xEnSp7weSjRc2ijKIrVnyo0bdNALXHlOoFN9ZXwFA5EWGKTUJpUkgDKixm4TDxH%2FyBFi69FlMRS62xUILnTYlH0l%2BLwk0HDx33ZxM4i7Pfy%2FivZxHGDCb0ZPRBjqkARM5N9BbHAsyCogY9AP%2BEFwsF4ZoZ2Vv3lY29jsH7LVhnu4pwQctfKeZtfI7rva3Xvp9hN0FDKn6YDYQGQuvcHHvfAhPh4hBh9d9rI5dMOAqeAFyhCYa1zBRLayGHxNeL1B6X13GX7Zcq8NEopN0oZhKbuv0lYMpKWvNzAOmVGkY%2FG%2FfBUUtc5ZimuSlKaNj3NsNKwmxirNx3w5RSjNSuPvpaQHH&X-Amz-Signature=5cd263dbfa2ea679cd802d7c3013240df7eb0c8ddc13bb77a657e7f41f39efc4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663AF6IGCN%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCw7OU%2B7dy7z1hr8ydC1YQ%2BK7%2FnSPa%2BZtcLq0MCTydzhwIhAOpG%2BX88%2FDgk8ChlgAvIzJGxd3BSRZ0njw%2BjxinERl%2FAKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzkPj12n0Jb%2FDQTdUAq3AMKHb7LWDS80NB5C2gzkhqUAS3GJRKP4K5FNKhACpsf%2B%2BYkj2kenTW804DupXIuFwxWF%2BGv%2B%2BRxcILpPRv5p7w7oC%2BELmKubuA8elUJL7sJgjChNCqLuaokWqaAdK0EXD%2Fjwc7%2FlaVcSEI8P6fgv%2BxYmznGn7lqCdCw3vJZuWxY0ZAzBLAakptK3KAhk8P%2BXQQta6s4XBh8VMORHZ4nlN%2BBm7vcpVbdJM5pjqv3RTakPlJNRNTxJiU%2FMU2fjHCl0SRG4%2ByT4jfVRKNRAcD%2Fr6Jy9l6NOI5eGZ4fcyzQx82IGQLk90lQfhZD6ZLkCHIgXRQHh9ux4wdSGlrDDsv9r3P9curSQjOEEN3hrMpknrN%2Bq0EU8uYyT%2FdMi0Zi3s%2Fgy7dC8JwEgHZ7AMnWm2JVMADUnWC3zsTNA%2BqCVXxlJHgX253Y1bOuxbmAW4ZhG8pK0z9kV5%2Bt%2BtkAMlb6%2BJnN%2FYYbivN7E1ROBFlICZGdSRdoaQSuP6jPpvPRIw1T6ggVTlP442meHZ61tRSvH4ekOfMXxyAfhSida30M8Pq068j9BcZjD2unY9rZ6nOv%2BOEkidXzpHynXE5ojPLFitNEFGdpqUAJN7TumG8ihhu7m7SBtZKbc1E17hPP4fKNbTCq0ZPRBjqkAf8I6CSMaRaD0mY0SDq112IfaY5Tu37p9Qx85fNVYLovOslW0qbuMbYQVP1AGZTSqpQq4TBm3O7lijA8Dkky1VF3TIDwcht%2BQf9rD5xY2Nqhx3I3rZbuYn2jxuoU0176PElkFaPDV4M%2BAiVaElBc6wa9LBDXHCIxlk3jV30S9V11juADYRfMsTIc3u9wockAhPjAbVxPPq%2Bact8GVe62Xgx6p%2FCc&X-Amz-Signature=f82c7b24fb6c861165c283feac4edcdbd0790e8a03a15d85d964431a1ef9c7b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJUTWUGZ%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEivd%2ByWHUaCXN3wXuyHT3BtDlBCByBbq4RNvtVxZdNuAiBS9hMruxNAgHAHN1D%2FirxMCUyxDdfIOzTyxpfcfxzqoyqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMIbtFeJr8hcK%2FGnITKtwD%2B3dtfk5H9USi%2BgXPRIXS67Vm3lRweoPFtK7iZ8V61nm%2ByocztLMhpCj30k1yl%2B2dEEeAybWb3QFNqva9iFpCaH5XyBkpSDSLB7zXzn6rjF4yBDU1TnwLqc%2FhLKd83NhC20XMFNhtzkxPk8Vkvp3ISXHjE8M0FU6%2F1zRsb4Fjzcluxzo1J5eb5VH4KvpZ2WhycNuDlXzH7OJVAh6PkJYF9SjVBUKmEaqzvFRFobPjYJCizOd2BKnEtjtinY6XOq5YQbAFfb8p4iUbXM%2FFwA%2B3HysXd0nVZ6mkiJFggG0DufJHK9IX8u9K0ms%2BDdC2oBLr97M5IRUGrrLzDG06lyPPOJ89khAQ8%2FLdIdt%2BUWz4MwLDB4uTwahGvzVgtqIwjcnNxrMTB5s8FNgpSTbiKWiv74VymxBylHwt%2BlytVk1RJn1IYOcMAmLUD4gK6HGafky71v1OdaFW%2BqDwUFBj%2FSVmFlkUCgVvkNwp%2FcCg0eR2UVy0ygRpO0YdYJyyZd7plKO10tdTWxX2bH5Tv%2FsbGFZPmy9vyYpSPGTcBfRkFxXetM3tf1RtKlUxoHvCsNMireXrlMsEm08gGpCX%2BOqz%2FSJ3HDydsfk2BEOVjccc%2B4pmsAda1T9uwLalklCctg4wy9GT0QY6pgGAbj7eWR7NsMRQgmidmB6u3FyN0X2l9QgUM76m%2BOWUau9z2c2YebO1L7xLmORYdRTrGslMqLgXBsrmdMbpGn556Ian5mF0tqtrbOz%2F3WJjKeytuKnPTPvIAWRdJUnNDEOxlZRbltBHd9SMqy65wzxKWbph0ZgtLR%2BdUbXkRQx%2FKlg1ceRPohzXzpy5rQl5PYl3q7%2FxnpEJeVMCM2DYP9HtIBmKPS5Q&X-Amz-Signature=0bb8cea3ad52f1865171ea2cd5e475220b5946f7b32fb29d9ecc60dd53388e4f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634NBMO6N%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBKQV6wr4UgW6xShZxRedhWYGtO%2BG3ZMpRoT%2FjskQpktAiA%2BUSD%2BZK9Rdmko4NzCaPSIVD5scb0EOyX5FMF8az1qHiqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMegPJy1er4YjBp0B5KtwD%2BxxEViTajsx9urXQPGgHPnugP0yM%2B85ur6jzy4OVC7sK1G87MKjMPv%2FbtbIdyT7Lk3TzLPTreH0vR1Y6B%2FA3pMShXnNj7zrtm25pNm7MyAQbF2RBzRwilb8EH8nm0XkBAtgx6tOoyDx5l2gPTltzcNjdy%2Fm7xpDfi1LulOxZ9R5B231XOVxT%2B0u1bNtQmwIQk3vtMfnktO1ObTAjI%2BuoyUd2keDXxdMx7Vwl%2B5MuLVE8hdvHhtRRu8qkj9RpGOXfrCx7SUl50156lvcwRmstGaHrTkx43e6q2btD80RQdChjf2YsdhhZOsE1RzBNLtQ4H0iuwfzJC2xvlCxD0pf9pqRb3T6V3d4EuShdsfnUotJcuOD2giMMkO5csR8A3YnlxnLjt39Z%2BZK8zDi4brDctkFrWdkFsFCwvrmoyO3HbZvmsLkTPnieYvw8QOVfupwIUO7rkhMXUofuB8go%2F35C2x435kGmplavvqlgQqkdYfXa0U8ALxCSh68TFlydRwXQuKoBKOAl8MBcFmYvDLTupiJLRMbgZwa2Kw%2Bho7BX7tBSWtfyQnByt7HGQevGNxLZI9xXCqWeJVWC%2Ff6hkyOLdaFHfqmi68Ut32r8kWMMnoCJBeG7mo%2B4nwDkSeswmtOT0QY6pgE%2BL7cA8bvCqvPhFk1DKIj5YCvmGf%2BYz61R0n7tql3IK%2B%2FgA9Cfe6s4yT%2Bghb3kq9wz24oEbDTDDOkVZmtisclxJEv2OJXOxg4i%2Bxmcgkpof6QW%2FUbt6YvGsbxUoqwsOvLYBe6QFpSTZ0Wfrg7gMPAORxGyN8XrmeKGgpF9a%2Bi9NI0%2BsOH9B%2B%2BJu4oU0HC8xKY3lRMcnlpHy92XdFIfr1Q%2FAxQIdcNt&X-Amz-Signature=65cc9227b357a08893d642f894682fb95edbf3b9f6580c54c3c9c1cf7a25745c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045723Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=c5f2bc6296acaac2deb4288a3573003d487aec7ab457eaf874557d1b81a01af8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REZOARDG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045723Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHOiRh97Hk%2Bn9HXWTbeoQ7sAHAMANtgeztZXgpfkvv%2F5AiEA5%2FFRXh5pJNjRpNtC7W1yWcixESRvJ4Z65AQkl%2BmbTIUqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBSRCBySw4fsp72tcCrcA5Y5tBdL5Fcr3BTQLGnVqsQqvF3Ni7wvgtZT1oa8%2B4nrypY%2BZw9Z70P3hRnU6kzAavN8wGREEABQXUJo3ctOgVCa6dd6iRB2t7UGoOxlrwnX35zsnd%2FsDGN%2BuzDsSdkD2rkjjmxABFEPvCK8NIzevth6N3VnkkAgf7gtFkya53ENKOO1gseyGKy%2B0uxfu9luPHJa%2B6EAjik9kqIwg6fUy0UNQsQjTSZSyx6PEwdGGeM2cWgv36nYGFwEXRboDy%2BRK8rG1jobqTn4b1nyseNfa%2B5GpNtiMThoHrBAq0jPliPSjp%2F6K9qQifW0VUADRL8Bnvb24C9odbnUIZcll6%2BjWrwOF8PcTUUSn8cI%2BTpkWr27HvQLMjyoXP53V9dBW0NlRtj6CbS3IjnncxXacOW0HZbBXobWtUDPKx8AgOnVMRUQtHEJPhIs6U7ax9s2LAlqKVwP9Tv0DzbSIlPgKs7ttroU0cDl5vwu0ONIzW0hihnM3DQ4%2BCpfE%2B%2FPNubJrK%2BKR4ERap8VZvLJsk%2B1JOLg%2BLxyTqZzmBCY9%2FKuIiV6Mp3Js0aap92hsejRKrpJ%2BH1zbA77LSZEdfaR9zrFi2mhcOxSzXDmJUoGWKbSR4KfA%2BZwXJ5QXvbfRQiNV6pDMPzQk9EGOqUBjaKdXASgt5zQUV489lR4KLTnRFwa86BuTE6txCO5n8nfGzxiEWSpk2BHlzY4v38UrDgKk8aYJqPrylQAQ1S4AJpVBvQDh9y7Z0Ov7IFM3ZKmJVmSa7xqa6msqqHgkXvWUR7FVzzKpqBGR2L7woAJwtViZfnmtN62iV8L6HzgHvnB3v%2FvIOOzejglYlAUr%2FWO2ghGbCBvEFKfdLWJkCnAdeec27Cp&X-Amz-Signature=3a2fd57e34b8d68440ee355f5e8662214338479789dfd4fb729a7f6266b4e462&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

