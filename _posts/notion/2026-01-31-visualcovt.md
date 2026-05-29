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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=8d3bca5c1b4ebb17fb233f3b4e43023656a13e9c3c08d74ca244a3f559e239ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=e46bc88f6cde3f8489de14885673b550a767601a81466848eb55b601570afad1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=d9c5bf6c84c9bcbad244bcd696a76a6d0fd588a982d7a6c5f8c0f0bdebf5a487&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=695f6331cf17e1c360a67f7a200e9e5d1e4c4ec1dd2d598acc3ad67edcd02141&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RER4L36U%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC3B%2BcQ2gz8SZrULCDU034rNm%2BfULpgENkX4Xq2Fqy1SQIgGQxrHEQ385WKCl6%2FsU29Fp4Byni9FSqGVyx802HVvJQqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDAzFD3ZKYaISO%2BjXCrcA1HdYfU1zPT47CD9J66LcdHZNA%2BVQrr5pTmXV1cslK2FU8OdBa1h4%2FWN1%2BSD7trEqyYnVrSSsPLqL7vBCGcULgGe%2BiSvPDnW79dQbTIg%2FWNoF5vN5jbyc61ZBgknK%2BxU%2FHh1UaAtqt2HINIkejI1bVjIG0MwUq1DtVAD1Kl%2Bf2fqIkBrZOIIOzwsg%2F416tKTo1q0Uf9CBbN9G6Gw1McX8YKUj1q%2FZ0NB3s8TVPomivUE8HBTsM9mwzkug%2FI9d69Yb5sDhuCBrzthnsR90r5%2Beyq4PElYCR3VKQ%2FuZCfMAuXS3eVVlslGQM%2Bk6acxgWncXpeVu0b65SOEcl7Y0s3a6dy0E5vvdzAasZSjsilpN%2FmS%2FqJyoGnpzqQUD5UAJlaIGzv%2BNJciIsXtm7Sc2s9SyC9euqhc4FnlsYpworH04mRS5cq%2F0f5%2FjyXJp7JnQkEkONOT1xztgtQ%2FnBvnC1mxchuXhTXEKTPszoq%2BEhO%2FPWmfXimYKRgiJRHq0ukx5ILsl4kZVl9rqoKbKbooBZfTNrHgniWLNjTtu4odgWoJ8PpKWB7SHiriLjOMtb%2FVRMZ6b0kH6q3NjG%2F2n1ncfnI3XIyVVXu3AQpBunRo%2F6eXBL4vmshdb7QDVsiMZEq9MICW5NAGOqUBGT7fEynQoL9SB4IUR99gqXMV2EQbgrWX4%2BY59As5ayMzWRUPc%2BniRNqKt8lbdeV%2Fzlbminu%2Bk98Gkx0D%2BxgUojSP%2Fa79QubpsWQwH75a%2F%2Fnh0XzKRia42jZRHr0HKlZ4W7Q7RaG26stxMl8Iz%2FemZ9OLrWPPhCVDO9GIpGq1q1LZ7MW9tFfjh0PlnaxRO12isbwvfg7RZVP7RhLuMlW5%2F0MRdIvZ&X-Amz-Signature=b72a312e02e30f223f534069ea9eb3051ff675d4410cf282e4d8b297af5aa56f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSKT5IWK%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDMS4EsXf%2FirEH2qMlDVpGxtRNM%2BkM1Bo%2BBsMGixRsnjAiA7M%2BOoBWSz1ueOTjB0B2X4qWkoTLHjKqLI4WqGRMAiqyqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMUzBvIcSnwCnIleOhKtwD2lpx4to7RCmC%2BGo%2F8VQk8p4T8JaqDtxTcN6sf1OfmNVrUObixlltwbeYeUOE1VUGpIQmY6LGi2IvmR96eAjkXVfEpXT1tEM4t%2BlObjctU2SLoEQKSnTDahTv9MLuKWAmZX3fVpjNcejrTvmsR8pc2r%2BhK1iQ18RiCNteyu1qBWBBFPOaG%2FASPcVDxamaEYd4ozn%2FPf08rXvEAt6lFjeMT4E83mnQqUC%2BsPTKpRojExJcqEsMGYMSoP0A%2FlW%2Bz4xGSODyIZQV3xovAWOE%2BdOTNWjPyEQEWX%2BufQvueOKIDikB1kGxzyaSDTUpHoIL2IrYDYi20dMoH611uubTR2Fe%2BOPaZDEbifcivgwuBm5PhOf7n4GEIepF3nMo697j34bAh5a%2BjMYkKs9mahyialRqMpfQGetOlQYBZw%2F2xQ0fZXJZSmkSgMLn8xNPxppwZJYbXvoFM9VnqB%2BX4GsLai3BouJX0y%2BzMTat80lYPPA5wd8KWSQxgyJV0MtF%2FI10RluVoPXHB6sfPTgJolgzrWdFNFEyZq32dWxu8iB6718fpIXU3gfy2j3lM5StUf2u6vUFfvMmswTOviW19XpaFR2oXvaQ33skgmawNGJcwFG%2FiMVCIXFyIjYNj5D5wvIw4pbk0AY6pgFc%2F60vp%2B756EjNN8GNyDbcqzjEIZzO%2BF34759Up0TI%2FX8N1wbp7QZprEFv5TK0uy7vfvc%2B%2BUk64LNs3peoAxAzv88VfLegRIFVdZiSvP86f9N4PYEeCKOjpllKEa%2BI8KG2AUlpa35%2BoTOGEJ9ADFbjdP384kBfjgMTi5gL4VBP1QM%2F3cWJxWDRYbdZzsK4z8lFtanG0eS6ya0oYQXmcejEhUKepQzo&X-Amz-Signature=25d0865d1ce670eca1698ffaa4f11493b8ba81124c28ad4ca611bbd9eabf9850&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RURDFZ4A%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC9U2mseGMX4A8HSJDzpxPfO9wrUITyCKiaUkNFX6XzKAiAAthiE%2BGsNPVko6y%2FPOvyWMwcDsskkv0drJjlPExFKpiqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2UwuxSfLrAFUUN1oKtwDp0hV0iF8LJKWQM2%2FMUisuzU7br1S9vSA9pp7OmE9RVTqFKve7TL0c%2FtHjuYC5%2FJ%2FH7Vxm5CR4tbJEuUbytqjoOgNgZcRImyxtWhBDiA%2FKOLS6OMQwBmJTYftOIHKqfibLBPJ32nxZMw9qSTNfAc8LoDxpkVbn9CjtqG9I2RFBHYR1QE26l9NJUiXtjS9qtzpHG34JZWzBpZNLh5r6Z76mzIFJmPfFj5lzCif8N3gzuVk43oqFV2096pKqcRf93BEYrSVDSnCYTSpwYTs6QjNwezJzahAPdeC5B4c%2FzuFh%2F0r4Ba0vOSueURVlBSMig21cXF4lC18DSs%2B4KTXuvo%2BVX%2BMc4Q9Gig4paa1YK2UHMljznYsTV5KoF9upduQ3DlXr3M3BzMjNZqEBgReauiiELcz5mzzw46N4dp07O1BTYisw3xe3mHvfCCL2qnqPl9Y%2BRApyWCRzoBFW7%2FXudN1e%2FUXtWB42OU6vHuzLYYEYMixMgNbFqwC31Sl0nLqIcyZFCL92WT8MIQl2icXtk0B7HzqurnZNEeEQYRO2Ne%2BQkLITzmkdZZ3%2BsgJu8R5CQYtINDKU%2F1YlvxOrhUUdUz8Nj5mcrSOMoBygx7ZNGW%2BRO6CBSvC8Zqf0mAxqnkwtJXk0AY6pgH%2FCeYBWT43wiHqor%2BJLkrdbdOH4S4EASahKJvS9UxvQMlb4cDPTBBt1iE6Sj0Gr62gR3z4bgtZYRt4JUBGdZYZy60Bm0Gy7drf%2FZDfotifhcJtPdjK5cD1C%2FedyaTiKGieMdLPW0INzj%2Fg1Tl2UESOAORFl5Efqd4C4peoZfKF90RmJuKriN8eorEH2cYdT6Jq8PHBzUqTpwqNkCnQS1nSAeQlDQcb&X-Amz-Signature=2f180e13a7fa6433a79191dbcdf06f213f180f8cf0ae45ea3072cfefe1ec1cd6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WSUMSWYS%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044401Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCxKpY4d1agcSf2rBkCyThhoCDDkNsJ3kD6%2FhmLIdOtFQIhALSrsqiC1I%2BPpdVZ59B%2FBFz%2BDbxLKEHSdHKKYBSSe3ENKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz49r1aSb1d1nw8jpEq3AN0vEoTQIz4BktsCVOq%2B90h2bkGjOAqbYvtgkMyevwd3yCw57KN3NvahtuMdtdBn%2FtXv0670xsa1CTk%2FvXj%2FW2n1ZTX8TQzrEZHCUnezLMRF6Ra7A9FgDtxROj4HJJyUIoMkoTGeXHjma%2BRnpPhaTn50gvzTAEqH63afgGxz3fn7zaWnKW%2BQFDzZ4kZQm2So2IvdhzfPZzXKFJZF5F4qAS3Gh%2Bbxn8rC9mOitQYLw2EB59HFwCU46sj%2FwneKsySrWt1IXQnESWcM%2BkmG7VHAhc%2BVeSohNb3yGK6F0JvZNiekQ5YFka3LYdgLt4eI1rTvy9nm5RmI5Cc18E5M88BfUYlTS2AgBk%2BnnGGq2a4KBS3iRnMtcvZSkqlDCez0BFWkFFs5p%2FexE5jhRecozVQ2XMhV2gnj7vhl2uMu5X7v0unOO0GpKwjSQDJx6jcAjH%2B0AgBNZjjSL2eJ%2Flm%2F7ZUKgZhhEdvPsSuBLy%2FtXbQMB4g3%2BNM%2Fi1GjP2%2BCkU5eBrjHCTLN%2F1%2Fu8vFyMtxCZ%2BF%2BJqyPCO4dTIRT7R43y8EoiCPGZ6ymHiZI%2B0Fh3Q%2BW2FUru4MV9K5f%2BWrtvvmxRQAtJiNIXNSgZCI9XXEkP6rdkPvRLk31%2F1%2B5mVlgno27TCYl%2BTQBjqkAeyPS8H%2FBAYe6DkLoLEosnIhsS%2BK8OjpOweW1nS%2BbQVIJPD7h2oAlOkiyaNiXCy3w3kB%2FKeZvxY5HDm9uOwJpj3KyF9H%2BTe5eZHTAMTQdx1lXz5UrCmLkAIYhMX1WDZttFjU5xm4jaxn%2BNeV7FP%2Bje%2F%2Fw7aiispW8u7s86hcTpuTWpB%2Fhr3AmesmNtxTEZp9o3eL%2BhyrLxHnOiqfsS6JGFCAeojv&X-Amz-Signature=3bf36b2b1e8a1a375f00472d46c0b28278a500ed6c3806dd36b66d4be7397467&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=b48103204755e9c9d799af705cdf5b0274c1d64391e50986ededaa85db1d5c0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044344Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=78d3262f3cbf3e11540b8f98f9ff9476e48d2ad6995833f8864467940783b775&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667A2G6YQ2%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044407Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIERc1Pvzr31ZDW1hVjpQnf3hhqclrNnzpvhmF4pf6KqcAiAK8c6oDFdHiTO%2B25ADSQJU8aNDmmN6J0HocZG%2BL8hYsiqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMak2XNlvT9s3w%2FzP%2BKtwDRt0EWv8GiQxMc26X0vRRlY9HU7ZP0i0QpeD%2F2Bkmc6zaGctLqkhhiS54yRc%2BNnZNlHuC4Eg0lzjmgDjoeemRzU0Gvei25JrxMbeepUeZUrRFq9NsA1w69SlMcBzPdK6F4B4qUKUSYKjYlNv%2B4vKfmGuG49J4a4Y1ql%2BS2UnmPWWjMN0EtFDHjk4JNJZSFXPw3fWYfKKqwwVIFk%2Fjt6tmw5MmyqlTxF3nEX1wmj5nSvKufJwLi3lpF3lgaZKY2ZXq0Es3%2BTEFsaeG%2Fg%2FCLmNuqwb7art3VmDLaPQdbaYi5GRjcUZXFSSmq2rbnxytN%2BVTzkjSFbF8BwufoiSzCXlOi8I5wft2NyNxbjJT%2BXYmvxL8EFner00TVKKheeuEzglS%2BLcHNcgNF0AzWQ0%2FWdKGtXBo%2Ba1k2Puh5%2BDPgMHoOF7dXKJ9vumXZMPIhlFiHWbHassgskj7P%2B4rMyqhU04VrF9PtvB32FzQ6fGsDhJLiCdhpohiAVSXtOlFpUegw9hCW9iKeieLkiYEWb%2BVC0jLjfJ9gQpIXQ0vAP13m6CuYgDdVvVlY4byb%2FgELY817gKS9gOvrrXKL6t8RJZjObWAXzpzg8QVWodJlkp14MfDcDyXAntrztbKTIa7Yfsw05Tk0AY6pgH%2Fp%2BcjpadyYuwPfnig85x04rxDHX8Z%2Bc9Yytnqkv5VOImj6IOfiUG%2B9aDyrqinv2uLJIFcAkgDBue0J8VL7Jd03uzvxP8%2BTQLyQt2oWFaGqkYKH5OGho35V1ZCw4fMh%2F%2Fi6FGik%2BXw%2FeGuQnHNUz%2B7ognaLScJLlUj%2BQ%2FgUhkHaggbaJaWlfVY6QQIbRCJ3yE5FE2dNtM2AIMfCNDHx80iwHkxlR4e&X-Amz-Signature=26b489b75f5beb8cca86344298ffe7650fa03d5d62c58f385a28800232393993&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=ffb0fb4bc066718d4bf314337f413a6197bccf418d7328559fe2a6a83bd18fbb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WERNPSRO%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044407Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDZfnHjn7mPhG8XDNUHg0ZPv%2BSWoEiwuiHY1rkXFWiI6wIhAPh%2BGvHgzn1FPNQRO34Sz%2FJZG8NsJ1OWmu205OHLCXoFKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwFivTrWpFd%2BwVkZpwq3AP0%2Fs3q8U81rtI97WSR6dFKlKs6ktJQeZ7G5bs1RCqxIlYyTwjV90KqIV1PxkldZIndqBDO2nb9HVEQbt8bHV39FuqxCIyJJbZyBCgOY%2FK2Ch58D78Q2%2FHZCFuEmPhnTNUtVapmJXkzwc7Zji%2B10RvTHSnV0d3gzaiFWoZs%2BZh2DDkP%2FIi7BD4gY0KxVCaxkUuHY1Q%2FwoMDB%2B5cCBVI8LRFaJmKVFOY3OGI46n7Pg2U6EM%2BQrH96XR6UKratS%2BN%2BdYYK2rdY4vS7jrRiF2%2FsLNFftkFNEEeq%2BlcbRA9riYx77dOgU%2FJyciiTcVVkn56RSSAVQ9fe6U9E3CA3fCFsPGgKTILdo3R8b4HrCyqlJc4s%2FdQ3vvrLaJulHtFZBI5tM36Xl9ugYEUGw4bXJTPDMXgICdx2NOxiyqGUHbG350QgRwiZL9eKaW4tXD9%2FzAY26VsJaqF7PtiZFHGesdqy5tRcZ0%2BLdl1Onvi0XJlx9HWxVM7rNSTeL2S9bO8bzNr%2FF7BeiOb9xJWrtsySTll%2BKahwNljubvQTVglN14vaNmrQdwjMcaXsbpW7qMrVTSqjzr%2FXZrEMLTKi0uXv4oMAaUOby%2FJvowUcHWSaxDYU%2F8EON6ZrSSHfvsdCz1u2DDCluTQBjqkAfM795ovJIdwpO7oQVuKnX6hIFLomoA8fCg9psLAHff69jAxmKFz2YYB84dM%2Fist0AdgPcB58Lcr2AC7OfTy1i8cz85F7KhOE07fRf2F4oY5fVBk1BN5PhYBrSy0AOp%2FJXgCZWcFxSqCvdD%2FypAhcbTZ%2Frs5IQGw4%2B2Qe8ZkNtOHiB7cjloR5Oy2o4rvx0ujWR4eK1ydqw%2BYvUzl9rSxcn%2FYqeFI&X-Amz-Signature=c15bb452eff8c862a99d2e96509face327ffa152b37eabe6e61567a5c2015b33&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SRW7M5M6%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044409Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIF8L9NOWsyookDNn4zltFr%2FmbLB0uLSKXa3%2BDBiqlQM%2BAiEAiUyEqGyY8tX48VU26J%2BPe38dPYyICdGPTXun%2BCLwy34qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDExdBNcKE3MpJ6WtkSrcA%2FG4Utmt%2F%2BCgQSs8OT7wLCaCn%2F%2BuuZtw8TAb0Ue0pIsUrPVLJEFPyPibtYeuEHtdS%2FqP8vyTYotn%2Fg6WbF8XgQGAjZcjq35A%2FX4KWcIPJZdhIr%2FVatMJ8M7sJhqgwcYOmQULWOlySmj13%2BIvZrfZpgnBexMEAdlUbBLdt5HWAwsnS0G560JEQEvLsHRLq%2B%2BtdyPylnpMwSn1r6E7%2B28w7sz456cGxAE8G5f%2B9%2FtIZPX%2BLO7xOPmU96IKlvuhDqWbL7fd9Mdo4QnN908QuSlR8klYVnqjFOWc%2FStY7AnXPNj5yBddTd5vsjB7zXlFCemcYkt9db7Oa8NIPqKyWlfNEzbfcoytKZBPL8lMwvhK7XMrWUTTXacVEU9JFhaSQqKSIQxDebd9RLRL8B0aos7sbLKqZIMs%2BO4wT97KisI4zjkp9kX8o%2F0yhdhs3hbkVYGEQfe3X%2FOxYaLE8%2Bo5o56HhyEII8dKOWfi8FPBggWkGqczsGUe0T2abwagz47aRltqmyoRqMndZaWf8AkKmJX3yh2gacinvvcV3HiuRfDXMtNySvD9iJ6nGHiXRpKI5PGwkTOwyFxngDMvQkk01aVqf537Y3hfGu97V5EniMAnI045vHeakaF%2Flt1yB22iMMyU5NAGOqUBYPToC%2FSHhQYX64awX%2FNZURay2fZEjbGUWHLkqLIuU6XhoSBrcHxIXAb%2FFM08XHMMhkwNk7oJdwveUX0SJ9qda2dZ%2FBbWvqTx7BmMcaf48pQCamnkDzhkaPzJKnFUuZK0IUEhv%2BVT1jMi1QInx8AzQpHh00oNP%2Fal5aQIZnmzKcQ2CSrmU4VD2pVj7H1TAuS1qWbSdORfbpJH9lQEKpyZk%2BSsARRc&X-Amz-Signature=3dbb285be4ca0f74a062ce882f1b6d452859c0de61aea8f585a2fb8d733c38be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666EOBNOAF%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044409Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCzG6VDprhqqaqthERBGtSgVlHac1Imo3bRvK6SGhhmOAIhAMBY580HEINXQ3kDsIAWDq3uUpgSNKbaRb9eHb96%2F17AKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz1wONteerXU9nTFeMq3ANBKsnd%2FYbpO7CHmDJQ3jLbEjSOdCWMP0zMP6wadLqSK0pjjcQ6MALoO5occnYMYjR1KGuWB6ta5r4MUcYrUn3qzB%2FoegAmAklhCEbLhre9I11xfrDdDEPo0rCmdz%2Fa983cpR72CA1Xitn2%2F%2FpukFguj8J%2B7Kuw9m3yVZhqe03aYb%2BfraM%2FmWxDGV4eWNVoNNb2y6HMlhu7Hx4W2D%2FdEqwiVGq2%2FCOjnDOovtipWR6VCrwAHtkvPKH75J%2F%2FPkhawxNE6P3pQNPZsv5ourwGshYzgYF%2FOwi%2BZRZmH3gbX0u8hktUILelMR%2BN2U7jbQtbk%2Ff7mlqkNhKusAOX%2FzrFwaiNtNoIBQohE2oNfD%2FlF378%2FsGiu7w%2FGszhjJjvoycw7dx8OUbLZUq9BWsHcQ76UyvbdmNXNGrYTHZH%2BtGCdA3%2FVz9f3ZVE9F4sjyhQnxAiXC7tMUor8fo8CgWXvetL7HC%2B7hhR%2FTfG8%2Fa3B058bouVpXOX%2FieQ2ItGjCCJef%2FOWhPPawFl6HwSyx%2BAmqsDi2q%2FPbQzDhG%2FgwH19zxxO032v3IwTAuqMX%2BBYhWxX04v7KlEjDcd7IMGP723MbEbZKSZedi%2FIXd7WUYcGXlk5Q6W2flzuWyZP9zFZZpGojCBluTQBjqkAXKJwcmQwka%2BYodLYWtSlkDSDfsUSB%2FlbqKfdVzKK805z4%2BmoZfDZUZWaExy2fZ3JHS7vc6zbKxYs9rzHxfm94Zkmm4xyFzans20fcumu4U9FqjLnmKvaaWqE84L6fXQNtvd%2FZ7T9uw%2Fzlktog9ItvV6CVZf9lf%2FiGwvOyfkMCMLJ0IWERrpNWp2kVivaJm6dcrOADbCsMh%2F0vzq80HfAYQr6X8T&X-Amz-Signature=d2e5741366c87a7c20278e7c20bb7454b17646ae8d9e475b9e72a5821ea464eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S7JXL5MF%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044409Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCvWLDFK%2B1BvMvX4%2FbqIVFtvr412p8N99TbgHbdLtXx9AIhALszo3FFOTK%2Fs9PpwYuw63j4kXN16IjZjaxRrIT0aqtqKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxbQ%2FMFoU0HvBVkKb8q3AP%2BKdwzwY41k3%2BqlwffYGLue%2F3cr6b4W4aOkifDSVqHw7kYrZa%2FvIwVRsgAwn3vIoABjM%2B%2Ftq1wKRFQDajM2%2BHBerpEm9ueMRsc5WzVAmNLfce0efvXZfiUBsju8PsVk97d0jZGV1d3DMZ3ubrPA3Xszw4xafz3Qb08QFUoZm4y1XIAmKMobOcL7OdZKBhtPryKd%2BQOEpKAbx11wc3NyxWQJ5QCgR%2Bcdyt2mHaB347X4QB9HWQqKNOfBzvZRE2ioKi7FsC8F%2BQxB2WCLoaYKb%2BcvPt4%2FBxja3pJLLWDJmiSvFvLmhZLkm78LPKnhYast0vb0y4uWUSUaO4Ne2qLwcaRys6q1uotHfp1uEGP9O9ElqqFuhQwYJhiYt1mZm7pXS%2FnSSQWPsoYwX51j5fmVFH7hrz%2FNANjydmABcwGglXL5S5K33yWCbuSSoRIe2FcGjJhg24yAIomAtHeY2bvThoaw7h%2BxOP5DKiK%2BW5yiu0ZdhTmjfYwqgdl5ZR8dBY5EaGu0%2B%2FenZOo3TnFRTTRTFQY%2FPD5xro78D6alMEY1Xr4Fx2WLvGEPHf6a%2Bs058QvjFnNE6xf8sXAj6RNjK2brMRP%2BPv9n9at0Fkm%2Bh49cEXhHTZ5RRCDrM41lq1MiTDMlOTQBjqkAfrqXNCBNFnzYChTLmGIVgQrbUYSi%2FC7gNb7SEJbL1T818wXfyxSHef%2FitLYI5klEIuROSjeuX6Xk9rC2AFrQf2rahRItePEPC%2Bqwn6NfcECHp4WTcnjdQnZTjqbllADZ478tw3X%2FhWEeW2eI%2B1wqMFDB%2FDPtW06jpROIE8WWhYExtNXYZ73xPAkt66MuqjZEjDAVDzd%2FmykRnEzLZZxfQwKp0ZZ&X-Amz-Signature=87c253a7f907a1069bd0878c73214b9829cfb41508b63afc0161e2ef49b83652&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=6e89ff6c72b48319877ef8eb3af6bb2e9ab2d94903b821e0e6103542938224a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPRJ5HWD%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044345Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWQkEdUTeqPoTFP1DWco9T9yMVViyBWy1MFtu9L70A6wIhAIVWaWh0GtVOm2fE73IKqq4rImyTk9nm%2BiC%2BOvDjpbgvKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzXiOWFsVpi%2BbUPungq3APNhNOFzHgcwSwWvNb0zv8ZvjEIfwCWwwK3Q5Rb9fLF3LjP1mPj%2BCqgDzgLAlON9VOWsDLss4RHOcg2wO63yFegBdBBbLz32EAT%2Fb3u%2F9cIDR5KgbtSlBcvVUmUAAk%2BoomCK8RCacT18svBpulDges9MknIoVuXVtUspauMNAopE2CIg8AMZLuDIWWrqBOseGrCA6oYPqpiDBTSHWrC8hkBDDqipcF24I7oSc9LCgPN7bpG021dCjL9dgmPFbTVhQrAgWv%2BanTzlCtg%2FF17p9LWGqB45QTR8FzaZgN4EuD6tUBeF4OlXEopQ0ra3nUJga%2FiHuvYuQrc1dtNqDS4qWdx03nCR3rEKa2UjGf6Rv%2F4xtGeAHAUpX37E7tAA9vorU5kIpwXvH%2F9fkYpHy0hvbVXh83mjEyXJFWr28r82hxcQ2MGrwXNNsB3SClEyUtzvEXKgQV%2FPopvwdtzX8Ustw8YWsuWIn04vCM2VqIDq%2Boak7hJehUI4hrtQUlAgOmWrYaVxZBYRWBLwaOX%2BwCZ0xDaE73FDaCGEdpVIyaDBVUbLugaVEl%2F5RkhlWT7Vd2f868IRzJ4deMqNaNhf49crS3PbF1zRIKPpuKdZw2S8vHjT0Au%2BWjQAcGdWk4RKzD8lOTQBjqkAcft0unTHhYKKrJ0ywKZw%2BtsX0Q9FlXHIc2rFAfzTy5dhSgr4BjG%2F6itQTghR%2BXCJ%2BS4yGD%2FzwNmsdwjP2gne1Mq%2BNxQY7RE7vSVIyIyqpXLqne81VpmtE%2BGUBuCQzZIfOT4DvXaY6CoBEgs0KI1LOZ0wPQlajbq0%2B0QcWwNuTwEohKPJZmUksRTJGiR1V9tjqqRiV7wOrtSzdUP2osfWekmej3p&X-Amz-Signature=fc6e98e83ef064be797ceeea4595938982579a3aef83ff4a89c197dcea621a9e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

