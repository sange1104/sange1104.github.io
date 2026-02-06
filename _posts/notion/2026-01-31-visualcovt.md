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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=a6c5e5581d50e88162e6d5da5171b44b94047d3878651c1c7a30142c9a1d4dc5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=048f0e77e09d584f9159a8e84472379574da9def9a9e062955379c2ebe2bbb1f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=d90c57dcf490c0b288119a5caa482f44f60236eb939066289b6f72d3b281dfb3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=3208ef8f8c54b101643a6007b29fce2e0f4077d0811cb02e6afec6be800d5b7c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XEES3GCC%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030923Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJIMEYCIQDsWx0DyJnwz63VaW3uJ5KM1w8iRGgf38DqXsZX3APU5wIhAIAIyU9OsDRbF6eOVsCOrFC5EqbDtNcg9vGhX46LvqO%2BKv8DCDgQABoMNjM3NDIzMTgzODA1IgwvUra1RnDcsKuRS%2Fsq3ANhxlROHJqbenL1u3rLm0s%2BrHuZAUJ4wOAqxm%2FC2S98m9RlWsfAmVgq3XhpCnp7%2B2w%2BHYMbUe7cjk1Oe4hTVPxSGyCq%2FMzd7eLWwPPk3dCDGUhfZp4X4%2FMGkLCUXMlxOFUQXQnI77ThzeBssQ%2F%2Bba%2B1zUBgOzKeydS7KeMRxBxdxBUzoS3m6ysZ6yqSk7T2iFYbRyEnKZf7R%2Fc9yDWHFLZFML0ha3xBMJGnYdEDwE1FqtZhIWUJgL5Xh0t84PxifoJkbWEDrKwho9xF0TPn%2FE6uy3mnKAZWBoR2Mvxt9mPgRWneF8G2F2uumgiLSbKcR7ICxrro65Std3PIfkfPFFlN4Z2NPaBRk12zSJM3RUWrctRitf2EYQfqldznYp%2F2UVZ%2BOFzWcaWxHp4wmOuU%2Fq3fWyFYlJ%2BNJqHYxf5s1Vr8P0z6JnaDeQp2lJLXLxjyoqr2NcASfzBxQ%2BHfgOGSQFRuYMb54jq3AXDBDv75neQzyVCLa3P6Z9sUWDcin9O1PwV5CaG0ZpSGAOYUdbkxj5aTHYjlD%2FYvyVvBwjHKEiL1%2FyJ%2FSaG7kvmTYARLHVFkEm1wS8PBVlHbrszAHXoU6FFAwQI40q844CG78AAVkSGwCdKbVwWGMlC2Z1wZdTChw5TMBjqkAbLevfT0wAQ17Lfx40wZyoixFJJuXm4M0ARv%2BU7vKbIckXljxww%2BmQtqKZxSyZK%2FC36dq1XZcNdwyrPxrjqVU5Q%2BGOSsH%2FDDinqYD5UEyv3L6k5XqN8%2FhzZ6JOyQbNkeb0hbxK0W0N7cuJuu9yAzsNCV2BLu9%2F2zqTwhYk7y%2FN1MP0ctbFQffG9fB%2FUC6TcJko0qBTcoDPSdgvKH8FwRJXmOZJBN&X-Amz-Signature=d3afcc0c6687d8eec9018d786063532b9b9394fff027a955830696e28595aad5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662QJQZRGU%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIH7XCmXjl5dO26yDAI5NrL6EQu6Rgbdb%2B%2Fj5LlDEQlLXAiEAw3bwhsGORfgK8LI7Pbj4qR%2FRHu5XA%2BtqschSrSLT9gAq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDKo3UAGcwoRIzhCc0yrcA%2Bla27RfFkQbDw%2BlD9inyhQmEe9WugQ9%2FiNATLBcN5GUZqZWvfDP%2BlUoq%2FSIE%2BNeB7sgjYRi1MdCDPVH9SLsmVhkLRk%2FcHsXsrGeJkaZxe%2FoWjbCU415Ih9mMcFKtK1HPeo4TN55f4pHoA8Ny1w6D8ZXyhUlfax5bmuh1FQp3NWfhzwdz%2BuPtPht6zV7G0ILXcAscRC85TVl%2FrOX8K3LzNhiagnLgnmg4hkHZK%2FoE8R60XBMEQ6NjQ4djHf08PoDKrrQIA%2FdehuR7eAQvzsDgwegazNnyAMyx43%2B9M9KgGEAm77r5qjxP7v68LZ2Ar8kHGPu1Uje%2Fvc1mPIL6krsL0hEQlqGuh3v37akkIzAAJif6WgCOaNI8jnw%2BTXEyxIGZlOluZJHSCfU%2FoEQgy2MXookKutu5Xs%2BTPCKkGepU6x2VcGD0IJAyNmwlAGe6S2sxNh%2Fe%2Bc9fgAk8Ke31krFHxihjq43cHo20uT6MoFbgTxNV2e5l5Pl8mPlpv2qnmYqMagkCkOuvzu8aPw%2FDXSPkKF%2Fq73lp4ftb5ua2dwG8OeEEjmHIqpI91ooFn5sjXgvscpjpnJTLvoBIVH3ciEDriBXNIqVeaIcuvlapmtl1j%2BvW0dg0a4kXgToyocKMNTDlMwGOqUBINzD6jdt2gh4oRRm0ye5Q%2FWDWRIygj0PlYT3it04G84aH928dUFThPUCVHT89br9Hy1%2B16EE1i3pfJfaI3ZrXALhIf5w0WPhdV3OFhbJ6eSTOzf3EDxyXk9I%2BGUcOfvNapxuwHiogXk5ifuvPvlU0u1GVGWxv%2FbbxXdUtyphA6kx2iELszWiwwze46EkNgbyMxYDruVJMQIJDyxpaj2f1KztgGG7&X-Amz-Signature=2b0dd2ec363c9d3c170bd5473d95fe794063679580c6251e3bf5d520ad381322&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YSA65OCI%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030944Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIQC0yqKfzfkpB4AbHpUFvAucZ32EqNhHbxqqa7Sbey8T1gIgEOAOI2o2YRUOccynHouOGbocq0J%2BimNAzi7Ln0GUSGoq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDAsOSizL2GK%2FCMIE9yrcA40TKF8xR2edCAoptqYtEKfR59l%2FxNbEu4XT%2Fzy4NGqucgRBzFAlSvDJV2jT4daJJ2Fi%2Bk3BUcHuB%2FN%2B%2F34paqhzbo1wp4SCCHrIUnWisY7kKTvE7vLaLIrcQBwTjlsjY8G44fEsG7lRi1dNspGCeOljDtuH5ZVbpcCMpmzFrzBClAblx0DyR2WYvvrH6mp9AXBg1VHKps7b1NhiVY%2BVQKjdW6tuMY3%2B9blgORUMQvq1G1um48qAtPw8OvaDm%2F%2Bt9UkEKxZy6%2BMvVVBjkBAf%2B6uYsuiD7VLo81pfAGPlKFRxE4yAtttWd%2F6gFxaScZOBK24N4SxEpDMJHlyxbgm2DM9fLQtDBHWttML4MmwMIZkOGCZu9Duj41FVFqnmEX3abcESGjWsQ%2B8BO42ugKsVRjteeo3RRLZS5pYNRbe373XwmRYhvTsEe1RuPJT%2FH7brT80n4%2FbeCrsRgRzBEQDnPA5MDauAm9DcVEhiI8fNqO8qERjyOZv8PVTnns9QFk8i3ikQfIe%2FR9XKUYZfAJ1w55jv%2F1aWBRhVikFMXa1J3TVTTiznsCzRzYjYCAA7Q%2BNb4NfPkGIL5%2BUH%2Bv0KU6S8jis14%2BwEpbJ534dUu%2Bl4RGQmavEuF3ZpquSRABo%2BMMvClMwGOqUBhDq7geTgvQHtgiVxRcs6sPOl8iJ%2BY%2F5rZAnN87dk2DnHsFXiQXGXQT4yRvj2DV2RXuy7RWVE3sHLsjRwIGodswxt8CEHXZKxgyqOsm4u9eGrA1mbxHCXfRUdIYFwDmwfHLtBWObSvD%2B7MIpL3l0w4L2Sw5HrVGaft06c3dbuxRY43hy3XDhqEXTASqUFygFDJkaRFXhSJCmYiPoBqdTEX2reOZ9x&X-Amz-Signature=8891e1a89233e2de061acf943c84ac978644cc88b3d41399fed3d41172960713&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XFS53AMS%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030945Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJIMEYCIQCJMuojGLn51pxpQOSRPLjmTlxnA8BNU5b3Tz9QI5QTmgIhAOrEnEBFW2gW6ynIk1JLnVij4PdgIjAy7GiHRYSYaaH8Kv8DCDgQABoMNjM3NDIzMTgzODA1IgyZ9QvRmatgj4aPCLEq3ANsDKliiIn5PiD3wr0jnw%2BEoVqvA4xu40iPSUgppLsL2uoy28X3iaIMDMQSMr1OTbyTI2g2a%2Fsd7Zj89kN0gkdq1%2F2eiBl3Em6McYfcO5Q5pZ0%2Fbb4lMjdn7%2FqMXBKSQ88MGZbwcOH6eXA74FxrMU%2BmCBjzyi4Tr2%2BrZXejmoJIdRx957MNoevy%2FVHBZtaueQK7DkXGaKQ4dPBcQracrXUc7RMVeBQkAjI2z6O1c4ctgPOODbhFTFAOP5siZrFB9izGmIYMERK0SUp1AlZ%2FYilqdgo3rlNWy8QSNZyWnGkOfAMNVtpBCN%2Fni1ozKMB45FQk0HqSFV3d9Qm%2F0cN0UeQyNdufgunl9tKQVtQaSJZKGhL%2BBbfWptieN9Q6QkyL9TqXmEC1Qx%2FOX4hdwMk4Q0xuB4%2FEBGGYsi1rC%2Ffpj%2FRUjaoLHNJwftSQxzvYf2RgBhGoTtUz0VArKaehDQLEI61rFkKelcfNaIlGVOa5719GvWxSiT3zsps4XSHCdJY%2ByjZoMo0VFL0zGQmI%2FxAhhzPLxLLUCgLiAxDdem5O9jECAvUknfjeDOdbbE74ye%2FPB42VP1rW1vEGZoGWg8wVOgHP4nbCDzbyxePKD9Kpu7BWMRkkassthoYAamQ9eDDdwpTMBjqkAVjOFrN%2ByjGvN1JqU2vZQ7BBB%2FDmE7fTqivDyeXnVMxyrygQLx6HRwbiUtl0C7P%2FxfLKEYtZggiF6y5yERe7jrUgYZH2klp%2FW2jCJoMKMoRhE8nveAIPUfdJtHjaYKLwXkPuNf1UDKxTjpStvhvj%2F54Q3qTJHxYISmCgwXvVeISjcXsBbdmmPEXlJk50%2FEc4lMboldUExUmb8iAhFTDYibVzO2ro&X-Amz-Signature=81d22e3fcc8616560de84b544f7f228df8ef95906b051ac4d5c462313a477b51&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=e38554b37c3033d2aeaf19e22970df509db96beb95192720c6265ba2bbe3556d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030906Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=0d7e517b3e4c045ff463e55d280dd1b7c6cedadbc8df85987a7e64d685f465eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VMBP53TJ%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030952Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJGMEQCIFgsG13X4fFfSibyvseRgRT18xIC0Y5BwGdvsVe%2F0I%2FHAiBW9WKFgImZzvaZFeNugEBv1iQTUnbXyTcoM%2BxH05G%2BTSr%2FAwg4EAAaDDYzNzQyMzE4MzgwNSIM2WXoSbPSwr3lYBxGKtwDsGJdVCO6pyUHoUQi%2B0jv%2FXhfTuwH50Lr3eetjitr0HN%2F30Tnp4AgdRhEycmZ6ZpHGfu4DGxxpd%2FJji%2BMW%2FjibcuCJYFdrNb%2BBu2nrIVVWUT9BFsNmZ6MUyFctuwOg0bSV%2BCL73IFGl5gXB6SpHFZyn4C3aMK%2BD%2B1kA9ir7Gt%2FJrqPFvDZEZX48YMdCgEtIhikwPY2kT8tfmr2uKQqc1S4%2FeXllePEVPfD%2BxexTFXHv8kPgSZAlNOxg6F4xaWkiNZXcCxBelaL6mcfHMF7sD0natkvq2Rrdg234EXO6wlpc6LebIIMPs1TnXUoydEzgXwMOR5Jhshlpvdf%2FtJGIcucsUNqi0zt4enWK5WafdFpMxfsWalOSqGd0AlwjMJGkUlCN6L8g08YuxFR%2B4Jcji3WB5AyZyZF6uMafg971ylcD%2BVV4%2BA5U8yVt7glyPHG8NKVWusYXGjr8yCnguRQHSqIlZZ169fbmlfeqxkV4HjrrjQSwrHt%2FeO4T0Ys9WCOHvBg%2B5hv4zl5rRlhuNhWT%2BqAau9786Fgs%2BLHXwW9ahi9ExVD5EhX8tNn29z7tZn%2FcmHFBvbuv8tdG%2FfQb53gK4TF4tgCVsQKkKIkik5mkOPWxzXeqLD1vmUcYELM9Iwk8OUzAY6pgGwzjmjUIGZC2W0vl4uby0ongevr8FK3xynjTUpMep2iTJtSUPoBN5DMQz0KaK4lHjY5Ft2sSySI3z1Tb4S3ioUskwq3a3p9rkkKqeg9TlJhmqvbH9fvwdcA3TZRigISmK9hZ%2BN76eYZhqOvHs7i4JDG1kv%2F2nBIwDSjkhj21Y48I0ZFarKaCRcmzs%2BRjiKtSnKtB8tpV1wQwGIdz52WWUpGMpQ1rt%2B&X-Amz-Signature=e5374582c0b280961d749dade9161f661bd156ee711aaab72f568d33f65e619b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=637d767c0ed474bb2439d84b49ad4f84bb5691a9b04845e0d1e4f268c916e22e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CFTGZLP%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030953Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIE6%2B%2BIu8hjqPOO%2BUnnCmjEQqEwn21SZ4HpmTqWv3JVf8AiEAhyr%2BstJF9PETwnRNjYGhb7obEG9WjxNFJe1lwvUHZl4q%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDH6tyNqyHfXWd23lyyrcAz5Qi%2BdrzTw9K1PlTsXVXO9ETr%2BJkGkXbDtvpaq3cAkpiYedLS2GICRFuGN1kH%2BxEQwvCfXk1rK6Sia7ICX7jNSfg1vMh38OcsQgSjZ1Mm4f4gow%2Fe8gBUw7urx5fXbjM8jaAoZ2p05A0iFF7IU4VEvmnulwnJxtgiEmL1TMj1qKJtf7zUcQ4APIpGft3blvfI3M5VvurLPCntnDEZV%2BqGpU9S7NLQsZyXiKgdqgs1mfd24BOrd4a2tOBFQwsAc5T%2BFr0%2FotMceHf7EEk0mZI%2FJcxQt%2F8bdz09P4%2FE%2BoD4dKQzyeVa5tn%2BAsFMs%2BwEZkRTBc38L5VKBkXDKyG9kjMA7uTZERCNvnAVp4XOYwXWD5mNZTpy%2FKTx%2BcBlE%2BqG1LJnmlog3dC0hMagLVuquHtmN32%2BtzZcSCxHCbFyc8g7TGlDSYaHBeP4qq%2BquVUFxe3tLIgmRNYj2B6WLNdkcDz7Kvr1MwLHSfhzqISv9dxt3D4ujTDgA45wO%2BJAW1Fgj0Gfojz8UsYrgoAeLoZqleQ%2Bf1rLjhPa6FcvJMDel8Ix8uyz1Nmq1DyE3nwMmK23zS%2BFOmzyf9wwko04TfKSn43Ebqao9kj2h46ZDAxhh6FzjsOmoh7Fx9LZiWy4uVMLDDlMwGOqUBZyEqg4gxcVomkPL6olTK%2BXBi6ALFZAYXu7NhqPaNoqylSV1AfTJdnnXO3kmFO6fvp4Hj3DJrsmOpWU%2B%2BDk1opW0BTlQvblpkm47zSO5Ior7MmbOoassn3u6VqheKJEnkmDKMC8q5%2F7Qq0hmeG%2Fa1%2FdThPPuydHJp971L405laod7NkFIY5kNDRlIk6Y4DdzmCqNYevJ18Uj7pgmVAALZafuMCu4O&X-Amz-Signature=9243e8ad72b9aa743d065267bc3acdff70325182c214978d82e080274ec7db2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667W6OMQXF%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030956Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJIMEYCIQDwMp8UU5irdzGjFiRmifeRifJusCzTw6oTxq0lHJWsVgIhAMmN3dScx2uTx4A0QDkCkt%2FyLR8RhXVO6mt8p3lPwj3fKv8DCDgQABoMNjM3NDIzMTgzODA1IgwWtZdFyGHnZ%2BLx1m0q3AN5r%2F3lf1Vy3RVffnyubkKnpzao6RzEXKtzxgYu82jSge9pnHAEWNyjhtjk%2FzEtc6s2OOGVIeHTyL8JV5GSYlGbxRUY0LBd2oPJhIOaWspHcnYPHJYhkd2VBAGXcwkFMKFscku6xANezb5DRmAAfHTaKtBTbCJHdCqBhhqAIgMhFr3trELMc7fVFXr2J99nixAkYo1A%2FLDMiNr4zxmiLvkfrACUZyVkd5a6%2FoQJAXNMjedbTdN9hI68H4ImcnM0RD0mLjROhPUnwULinYyW%2FjzwAnvD3fOXT7B6niwlxWwbhUJHGPlU%2F2ZDtDvpik2eAGxN2TynMs9%2FFjb%2Fli07UzUaW5fNshANq9TYcY98Ce3GYLwEGWQx%2FryT1uPlKVT2pJglWyi%2BjI1hNBS6kxqqUene%2FQgQKVq9JbMnAgh27fAgadAbhhrJq101i2gEs1H%2BeJ9%2BHwi%2F12mTFACeY%2FjmT2Zn%2B5822bsnFZdR1eWnwSiEh3W%2FLewpYhgRrpcNJrXeKJRwu6jHI1qJ%2FVCCAtDM1%2FcS%2BlBCBmyVTkv14A23xUZKRHEX4sJWzfE74e7h%2FLkfoyixYLzPyYNa9GqHPL12xbkuPTUg71gEx01%2FQtsej2Z8fKSQmhUvv1gB8z9FuDDhwpTMBjqkAdopez2gnAyqdOdyaLO6ur%2BWpbTJWTKy8JdChheKkZABe4T7yx3z0TYAoh2V91AF%2Bh6rHDYTsBjPZdEFhJJNxLDsVSUCIrSEFbg%2FspnDjFaVAgkY%2BH8pOt%2F1uY0SmD48jCi1ta1arrZf3WS3U9o2MHcbExBnQ8SrVnBuQKVq8neVBaW3ofip6IcWQc9oVGKFlhsWOunYDgOik8O8HeX7qM9AQ9TG&X-Amz-Signature=ff30ba22ac13f81c8c38722a5c832e7cec5f26dd6c4901bf5623c02ae851857a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663A5I32YH%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030959Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIQDqYgJGMdPD6dwa99nc9%2BFhEtHAC7UgAXu%2FNUZAO8E8rwIgOLQxqZLQxUfpHuTbLInX82o6mxA0yNg8L5RkAIGfq6Uq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDCn7xCfWiO92R6jZvircA8u9Mpro8SS74SQgbHyMuws8z02wHvWb0Mz61cmY0e05Jzxje3vCl14KUOwfqROB0mnwxnSQmknnshWD0UTYlPrr1lJU8MEqI2xa%2BLGC1ln6HSzdCiZLspCHXZHKp%2B46fvjtPOjH%2FofiRgEEFyMKk056jsncVcc9pJWgL0tuftOJ8SOU2OujCVpbKM4hT1Mb366B9L2YSzMw8QEVsIGi9jIcIsJN4fIMIAmXLw%2BdUaf6ysnI40B1prIQm4jiG5OU%2Blqypwcd2oM1drqn0aneX1H1Rjei6NiHg9p%2FPDJCm%2BOzSVQzp4zqf%2BVXF3XhGiORwK9VI5K%2B9MwLitm8poiOwat8XCgZy2xu%2FEuQEjm2erw94qJzWHHJCAi9aXWsdHpQchjN8kmnhg9H6UtTN7IO7FpSUPJVPIqPfD%2BUROwpa1F1zmAhEtinJwbnu1oJzVvbJSpi9dQg1pQ2imEh%2BNCu83j2q1kod9df1pdTajsmSviH2HClwb4%2BRdLbys8ckMSuHs5psWainFBmGFpMwrX%2FgoANZ5HmTbur%2BGRlSOUbXM6L2gdoA1pMaGng%2BBefbUXM2bB1iLDFmq%2BD0%2F%2FEaP8een6gBbSvgsowzL0u3Vhs0QuRRp7XQN1eAKARfPGzMJfDlMwGOqUBpT3GKHlIyh4VUeTc4kan0xzRYGgjNqnwxcGOphknYJt%2Fy%2Bw3Veux8DM3FtqQ8x50W0j43vicIFQDNW%2Bf9pkJAc5Q%2F8PZ3NIM8CMPe81s7gSTjJSN4ZZ09eNvhsaTN%2BlpcT1rf0sq9nWznyCwknIX%2F6v9zBky2%2FsrIWBkZ17eKk%2BH81XVXcH4vZigLgXvyQKZp8uRQhbJg0I0bVMgTzfEtFV2iB3P&X-Amz-Signature=3c256129ade2beb02d6266d2fbbc62d9b3b3769c5fdee135c69586c7f38b284f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HOFM6PV%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030959Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIQDotqjuHMYq27rn1yAXmWKWiTxG%2BZIvxMdVW2s0Tp1i0wIgdqdCg%2FfHSt%2BklxyKbIpQ1h28GfvhJTzIPnpvszxk0Cwq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDJRfCF3gFGxsmD8XYSrcA0UdCtNzwk63FblTbBz5hqb5pO4QCkXagD58wnZ3w6zR8HmIt6jD67TDzJ01H8ita1IBAokdZXGOcEPiqKuYOOV1GTArp%2F1MXF1B1KS%2FG9X%2FIV5lqFD9TwxqYErhFOjTCG21l4AK%2BvxjjWVToaCy1AmABCqD%2FGN7BTMMRpq1cdCrZbh3MC6Xm7%2Br1Xt3A01nGMessSx1m6BElRrrVDLdu0t5u%2FrkLdN3TRUHftnsb%2FTYqYBKRPrtO2eBqSwWjNdER%2Fzymy9Lx6xVWn3W873skmqEmHQIDP%2B2QGuRPSS%2Byrlzx6BeGw9RwHb4aT3RFKWhP3IsWLwTceMCvmaFe5yDRMxDbrMWOBmaywDr4rM%2BhBRIpjeVnkA1wrKMK1apZ%2FwWNTevQniJRMKVzk3h3sMzhZ%2BwMMVRX1j6cNAEtQhwVFYRdxlHsEt%2BYHQBFfSWyiu130HOWlwq57J23gZ87OgdxcNKKXduCIe61ZTccK1O7RodJMYa4po5aVIN7bNQatJYT6ucJES02U%2FYRgUGnC%2Fqg3fmbUkve0FluT7kgoq5B8x%2FPAd1v3WojO80byahUzmm4i3O2azQuOCbAsBnHtKn8XcHUNBMPcmcpauaFWy4CX%2BmhJy42dphzm2csa1sMODClMwGOqUBNvCOeocEuofNyaGzaAL92agvS1l4%2BXENWLnUal9zKDXP8tBsOQiQbdPNG11dAQ4PG2S7tN7Zpcr4vVucY4xggTizr4o1dtdpmon6wVM%2FF98jWPNW6e6tqiEg1Ckz6KqdSGI0nuEvqg%2B8VM1rslGaQstWe9U9MLxak%2BfXDTqo6r0h120tCaj4vaOTaKr%2B%2BsQ5d4JY7AFzR1RmCHHcNpb4wu0r4z2d&X-Amz-Signature=90384f6ae1ab6a07b29077e892543f8fab6492b1088435540891a26e77b4afd2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=6a37697a7abc2e3690cf4f72c23c9bed0e76f2082a204cfe990470bac2b1792f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675Z6Z5PM%2F20260206%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260206T030907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIGifaHWDwxS3aihJPz0BBegiUiE3mnFMDEHyeEx58DXaAiEA%2FPDQyo%2FfAs3pYjQxrfNFSqJbxXyIIWu3tAB1CqjHdyUq%2FwMIOBAAGgw2Mzc0MjMxODM4MDUiDENBziy6i29p4YzIgircA0FMAPkNeSFPegE7ryeeCfquwDYMzvi3rC7tYMPlJ1KHFnIWauJ7U7gWur75LbkNW2s%2BMPqhAJhe2YdNFarPT3%2B6qX1xJKZc%2Fn5poOKXKAWcHWSrRR3f%2FQWYGEPw9QbGiXVePGPDDRepobeTLQlbkDs0ql40ndCzLWyL80lXOgCD8uHhlSjfcq6NjSO7RzwAElWbwSYGs0ArXqfAiKcH6z1UZ5V5GZJ7RZIQLCzyOXFSbU5ij23uPKVTwpeFW%2F0Dcmk3J4PCL3fm4l6G%2BshmrCCyWccIZ1VclcfkidHTZia9kAoVGPgzGoygsPf5vaQHQpQvrNSTxveN6bg0vSd7WLad5qwHEhkL%2B0DMhe5Z9COCEKk7hSgbGKdJTRVrVLEbscXxhZWuy0zxeqmj0A43Y%2Fz5aZ5UCVwiwWl%2BzgjQNmkYGLvADLVxAEoGIdxVZiwT8%2FQVzFq8L666Qb2AlWJFwDbEYpAgihxMXFnrwEF7npKdbPsZTIxHgSuGb0CsRwlJmMpwR2CGCzP4VhlKHpOdL9%2FsFzZJNreop%2BzHDJpg2yozv1ue8ugbLyf72yhNFRzVoyaEO4h7n3tGGFhNMkGAUzkbYL59ZX%2BJCrXGVCUGl%2Bs78s1P%2BCyvS2MCV%2BUuMIXDlMwGOqUBkIqc2hzR0c5NaokkUo2drQANBKAe6OnQgMWrmnmi8G83ptgt3Hmk97YJtTWw12wGvOsXZBba3I3EO%2FzHXlIBstx23ibUC1wLcXeIeBENqlaovBH%2FfBmQ1dEql3Oj9VVE%2FYIzfCAoHQMLTCdvqqSZ8dp6vPgll82hmL7gOPsnuq6JKuMJd2ObPRsMexIMVisgNw8trPPXDxgirC9v3KX%2FyhzkkWrG&X-Amz-Signature=1e12c854d2e7ae674fb807bbfc1bafd5a527c664486d7bc2f0d1e8b0870c0544&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

