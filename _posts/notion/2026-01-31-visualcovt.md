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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVWSG3M4%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD5hk2lQqP%2BhPBtGBc3CATmCe8iMNUSh1YnCMWipy3b6gIhAMqV0wXQRZsBjwlCj9CmFlUWd4jCUyPzJLcHV7wYR%2BvOKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxek9TrGEIra8%2BJ4BUq3AO13IUwNJYsg9PFbCy7R0aTigl0ti6zNAi8LI8KhAzW1ILb4nxq%2FU%2BLa4Qt0upcaJJ7LI9XUdzAAstYHwCsegrYIDMvSuFjV6kTvhfu3oo4HLOaouMiZCNqeHATHQntR%2BB3L3i1cHviBwWxj32t4DoC%2BpHThy%2FV5%2BY3b2nEJ1DePppMwOBZDyxwhATKS0G5ypjdMlhQ0Y6H0nyCr2tu1VJqiSRLd%2FVBM3cAHhYEijMuc1mPTqtCkaak%2FX%2FvW4Y5%2BiYH1E1qTFlk9SjKsLGqWIuWneBdIg4%2BNHV38RmshqSnaGwuZiHQfFJOp0Z%2B9bPC7685YGt%2Fn0nPOlAXWUmm92oOlKqZ1fs9CaUc%2Fqzbhk2jHlhcRzLFprbazXW9i3t%2BpvVRODuYtVrJ0Uk32hgW8R8tlJd1QxsoNuGW6a5a%2BxdxTgJL02cOfktlQSRPDBRPIi2WDBduGwt166qMHLHptn5Q2d8uPKPGwIJkWAkTdaKgUOgBRBXitB4n1V7je9NHgFJFlSbKehmZ8xuWLZL8dpVt3cbUMhRAgatI8NbQfaL5Ral2h9b2%2F2SPRD8mGmLRaVMs17lTxYRXdZIXGHzUazh60YW%2FhU1522FocU6XB9991agoH3PEcYo%2FsBl6SzC8t4XMBjqkAV6LIDuiz1tsvKbl2Iylh9I6HqzpWyb%2FkGTCC7oze%2BXGsxPC3HBnCsrtknblpdWXD2egps3moFYwpSyEHlCphoilpkUngHxzGGaIU4V5%2B8h1Q69jcbF92TUJ8ZbBgDRF3GFeofWC1Ebofu2Oi%2BF3OA9L%2BULIVvddedRlFcmKttvXaXk7ENH%2Ba15c6gl5vBsIed7R30M7or%2FCiwR2OY1ii8cvQoqz&X-Amz-Signature=b7719ade72c85a02163a152980e7a613cbc25769e36e1b270c71f62621bf1eb6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVWSG3M4%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD5hk2lQqP%2BhPBtGBc3CATmCe8iMNUSh1YnCMWipy3b6gIhAMqV0wXQRZsBjwlCj9CmFlUWd4jCUyPzJLcHV7wYR%2BvOKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxek9TrGEIra8%2BJ4BUq3AO13IUwNJYsg9PFbCy7R0aTigl0ti6zNAi8LI8KhAzW1ILb4nxq%2FU%2BLa4Qt0upcaJJ7LI9XUdzAAstYHwCsegrYIDMvSuFjV6kTvhfu3oo4HLOaouMiZCNqeHATHQntR%2BB3L3i1cHviBwWxj32t4DoC%2BpHThy%2FV5%2BY3b2nEJ1DePppMwOBZDyxwhATKS0G5ypjdMlhQ0Y6H0nyCr2tu1VJqiSRLd%2FVBM3cAHhYEijMuc1mPTqtCkaak%2FX%2FvW4Y5%2BiYH1E1qTFlk9SjKsLGqWIuWneBdIg4%2BNHV38RmshqSnaGwuZiHQfFJOp0Z%2B9bPC7685YGt%2Fn0nPOlAXWUmm92oOlKqZ1fs9CaUc%2Fqzbhk2jHlhcRzLFprbazXW9i3t%2BpvVRODuYtVrJ0Uk32hgW8R8tlJd1QxsoNuGW6a5a%2BxdxTgJL02cOfktlQSRPDBRPIi2WDBduGwt166qMHLHptn5Q2d8uPKPGwIJkWAkTdaKgUOgBRBXitB4n1V7je9NHgFJFlSbKehmZ8xuWLZL8dpVt3cbUMhRAgatI8NbQfaL5Ral2h9b2%2F2SPRD8mGmLRaVMs17lTxYRXdZIXGHzUazh60YW%2FhU1522FocU6XB9991agoH3PEcYo%2FsBl6SzC8t4XMBjqkAV6LIDuiz1tsvKbl2Iylh9I6HqzpWyb%2FkGTCC7oze%2BXGsxPC3HBnCsrtknblpdWXD2egps3moFYwpSyEHlCphoilpkUngHxzGGaIU4V5%2B8h1Q69jcbF92TUJ8ZbBgDRF3GFeofWC1Ebofu2Oi%2BF3OA9L%2BULIVvddedRlFcmKttvXaXk7ENH%2Ba15c6gl5vBsIed7R30M7or%2FCiwR2OY1ii8cvQoqz&X-Amz-Signature=358db69bce65050e2cddeb96d029e1faed8a86ba7860c9fa0b7e83a187f9a530&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVWSG3M4%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD5hk2lQqP%2BhPBtGBc3CATmCe8iMNUSh1YnCMWipy3b6gIhAMqV0wXQRZsBjwlCj9CmFlUWd4jCUyPzJLcHV7wYR%2BvOKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxek9TrGEIra8%2BJ4BUq3AO13IUwNJYsg9PFbCy7R0aTigl0ti6zNAi8LI8KhAzW1ILb4nxq%2FU%2BLa4Qt0upcaJJ7LI9XUdzAAstYHwCsegrYIDMvSuFjV6kTvhfu3oo4HLOaouMiZCNqeHATHQntR%2BB3L3i1cHviBwWxj32t4DoC%2BpHThy%2FV5%2BY3b2nEJ1DePppMwOBZDyxwhATKS0G5ypjdMlhQ0Y6H0nyCr2tu1VJqiSRLd%2FVBM3cAHhYEijMuc1mPTqtCkaak%2FX%2FvW4Y5%2BiYH1E1qTFlk9SjKsLGqWIuWneBdIg4%2BNHV38RmshqSnaGwuZiHQfFJOp0Z%2B9bPC7685YGt%2Fn0nPOlAXWUmm92oOlKqZ1fs9CaUc%2Fqzbhk2jHlhcRzLFprbazXW9i3t%2BpvVRODuYtVrJ0Uk32hgW8R8tlJd1QxsoNuGW6a5a%2BxdxTgJL02cOfktlQSRPDBRPIi2WDBduGwt166qMHLHptn5Q2d8uPKPGwIJkWAkTdaKgUOgBRBXitB4n1V7je9NHgFJFlSbKehmZ8xuWLZL8dpVt3cbUMhRAgatI8NbQfaL5Ral2h9b2%2F2SPRD8mGmLRaVMs17lTxYRXdZIXGHzUazh60YW%2FhU1522FocU6XB9991agoH3PEcYo%2FsBl6SzC8t4XMBjqkAV6LIDuiz1tsvKbl2Iylh9I6HqzpWyb%2FkGTCC7oze%2BXGsxPC3HBnCsrtknblpdWXD2egps3moFYwpSyEHlCphoilpkUngHxzGGaIU4V5%2B8h1Q69jcbF92TUJ8ZbBgDRF3GFeofWC1Ebofu2Oi%2BF3OA9L%2BULIVvddedRlFcmKttvXaXk7ENH%2Ba15c6gl5vBsIed7R30M7or%2FCiwR2OY1ii8cvQoqz&X-Amz-Signature=bfeed952b5190e338232cdcba36cae7b44f29944933e9dd6244fc1d0dc8dd0a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVWSG3M4%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD5hk2lQqP%2BhPBtGBc3CATmCe8iMNUSh1YnCMWipy3b6gIhAMqV0wXQRZsBjwlCj9CmFlUWd4jCUyPzJLcHV7wYR%2BvOKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxek9TrGEIra8%2BJ4BUq3AO13IUwNJYsg9PFbCy7R0aTigl0ti6zNAi8LI8KhAzW1ILb4nxq%2FU%2BLa4Qt0upcaJJ7LI9XUdzAAstYHwCsegrYIDMvSuFjV6kTvhfu3oo4HLOaouMiZCNqeHATHQntR%2BB3L3i1cHviBwWxj32t4DoC%2BpHThy%2FV5%2BY3b2nEJ1DePppMwOBZDyxwhATKS0G5ypjdMlhQ0Y6H0nyCr2tu1VJqiSRLd%2FVBM3cAHhYEijMuc1mPTqtCkaak%2FX%2FvW4Y5%2BiYH1E1qTFlk9SjKsLGqWIuWneBdIg4%2BNHV38RmshqSnaGwuZiHQfFJOp0Z%2B9bPC7685YGt%2Fn0nPOlAXWUmm92oOlKqZ1fs9CaUc%2Fqzbhk2jHlhcRzLFprbazXW9i3t%2BpvVRODuYtVrJ0Uk32hgW8R8tlJd1QxsoNuGW6a5a%2BxdxTgJL02cOfktlQSRPDBRPIi2WDBduGwt166qMHLHptn5Q2d8uPKPGwIJkWAkTdaKgUOgBRBXitB4n1V7je9NHgFJFlSbKehmZ8xuWLZL8dpVt3cbUMhRAgatI8NbQfaL5Ral2h9b2%2F2SPRD8mGmLRaVMs17lTxYRXdZIXGHzUazh60YW%2FhU1522FocU6XB9991agoH3PEcYo%2FsBl6SzC8t4XMBjqkAV6LIDuiz1tsvKbl2Iylh9I6HqzpWyb%2FkGTCC7oze%2BXGsxPC3HBnCsrtknblpdWXD2egps3moFYwpSyEHlCphoilpkUngHxzGGaIU4V5%2B8h1Q69jcbF92TUJ8ZbBgDRF3GFeofWC1Ebofu2Oi%2BF3OA9L%2BULIVvddedRlFcmKttvXaXk7ENH%2Ba15c6gl5vBsIed7R30M7or%2FCiwR2OY1ii8cvQoqz&X-Amz-Signature=812dc1e90ebbb50347461fe8aac3d838a428b0656b83e6ca8425a2bcb2717483&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TE4QB53H%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031152Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIFXaKRUhVu8eBCm6jaNl4xvPq7jPsO8fP1KtYiLQm5MCAiEAu%2BSx0Wqn3xHDrBauwe4GAg2QRp1hZH%2Barh4g2wH6VgYqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB7jbUGXIgOkhL%2BEXircA5WIFLJYWDuaUzu4xq%2BTom7a2wEUsc6TQYubWizSOgGNvANQQG6yNs6kOdP3SNF5r69V2wD2lCA792buzVbgkH4Xsj1nPZIGhC4hDE4fjVFb6ewwvkWbfol5xoTw3%2B%2B%2BwvB74BJjNz4Fqkts4CdK4t9iNHqMc9U6207NVuJiBnyFgJW1y8IZGAxTI5qRFXFd36OquLlnUoyXu9tAx5ADfoFnWkmosZGSGi8dxJcff7ZKQArNbG5YEkQfFjP7ez%2BjTK6rM5rfvejDc9K64WVtTRGrqjBycrD6Avg%2Fe%2B7c2Z81mNm0w1QyUdz0zZv5L%2Fy0hFPRzGOkJ9RBjwspaP91ozBSTIfYjYxzdUAR0F3hEtbfd%2B6DAQR05KfBIGwOum6QcK2JkzCLX9%2FYJgk2v%2BPOMCSrKFfepO1Q104%2FzKB6eqx8Ka15KT5s5IJBAIm8t1Ms%2BkiJ6%2B1GAdc5t2N7lpZgJlKiE0Cwm7kTv0pWyU5AFYlGBC9DMV4ykyaT7fI%2Fbbua8Ehr%2FqaDY2JG7cqWD48l207Qed8bgI8B%2FMsr1vWSzBq8oovxNkSnRQiUwNOfzvLVdNmZxqmIQCqusjvz33jRclWN8b%2FX8FN7esoyYfZ%2F2y%2FMyahimnAzHbu0yYlTMOW3hcwGOqUB2U32el%2BjMDqibCPMdKBdajJmdgqIboal0n2Bfy5NDfvvjpAbM5clm7euJchIzV1h43xqgk8FEGmvIIaNXBT9ipDx%2FvIKrN%2BQpujzqpeL%2BFtK6xCblscluCbFDAd3IvrSdhmNPfGZlWRMKVvR26xMesZIR%2F2dY0rXF3nA6M62ydZNQlJLY01ekviM6Boi0gUc5y8MfKj%2FlCQnFdJz3xOll5kAiYsy&X-Amz-Signature=1dc8aa0e120656406912fd6b3adb90840668a451f07b65cbbb442abd81ed189e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YW4Y6MTY%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031202Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIFZbcHOVG7DcZB23hc%2BujJy96sjXVSzXoGeLSfMsgnonAiB2HKc3TBh3VXzo%2BfZH%2Bs4czxD0gzc8p8K8N2UdedZCoyqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMkyHIqDRmfrS%2FHNZ1KtwDa5BkbSLi9KC%2FgarmzYZi4k3hyTztjRFBK%2FHgHy2engmQmVeRSV10qywsvh0e4OnusYfzi1DUTGYs1lpFIzSXIVxSBRAcUwKeZG3%2BsmvtGTN9O52EDJ0V0zoPNio0br%2BMwlNiN47r8RLsHpUZxF4q8oBfylRXTnVqBxU%2B0AgiI3YZSDuXtvLEZlMv0TrkTjOHGMx0CruLcR8DqrUMhpGX%2FA%2FDG2rLa6Qa1KH4eYR8O6XDxRACvSw7jAywaDcD0lpbmWUsiTh50TxB5e7kg2LwYGfU8YKwGU9%2FfeuC3%2ByCFwZRxBC3N6R5Sfn2ATr45atftPayThuWyY7MYbdIj%2BTupVZVRbzIWZbyc%2BOjAbBdQpcDgZT8WRuUN9%2BRYr3s27E%2FBNxCFza4EQdGJ1DjzIcMm2JAMWgEi7cX475WRVPQYE7aZoi%2FVlz%2F3jcVzDQWuYmTrepcaqEvfncbkMgsIh3uU9tUWIyiBs0mE1QVX5R3SPdmRnI43fC0ZwTz0C0%2BfEsqlW95KO4oUcMzQxgPUKvT9dkKJGzdHTHE98uoXTUkvJOB25eU%2BL9vG4Fnr9977HWyxHydsD%2Fcn4Mgu35aRqfJ5E1m4GDkD%2FB%2FAaWpLr5RgWKGY5%2BKHAymX62FdnMwxreFzAY6pgFxyi%2FnW8tw%2FbSoly0KQuFT3sBnRyi5VSDxxH7c1sROy%2F3to9Kbzkgq7W2PeLuzu1RvYmkTyePCCdZVHPnlJsVBoge86psbhsIu1hWzGbgs%2B0I%2BfdZrjw7J3bTEJo0r%2BwsFG78WEgegcC3EZOR8eNOJVDuh6c36aSH9299%2FE1KWIVWvoI53PMF%2BdFG8VEQiHOiUIxWDz8tCoL1kpdQNkgZoHavyYNjt&X-Amz-Signature=f8088f8831b905bf788a8e3d1aacc0d47c465954d7bd773d05fdcb9f8d4ef674&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URJBU2VQ%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIAWNbsatCdzVQtuLZGuTRbHzSanNxs2aXT%2FBLEWuuTIlAiBPt76t2u%2FxxJuLQdONDcMbf9R6QsJmpAKLeh%2FPe0CsUSqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZkIw3BS8fu5tdSFSKtwDasSuatj8LXqa2uOn4uKHH401kGsFlQOWGFdXdhQ4oxvE85N%2Bh%2FrRs9DEDRiZD%2BwZXLFfCkwh9iznSFsCaBtkjIhv7VcLmPZIL8HTC74c%2FPff6wdhkk%2FAPT4FgveusdKfAS5xwyaNJWgTlVEriHgRrN1fIJhAEFG%2F11WscOHhHXJZsDtvJNciuRvpR59iyE9LME5%2BichBwZLM02uvQcQw4oX%2FHQt0rz3bd2HV4YYKKNzhoPnxp4Si3MG60V1wZGcuCHkbVyAhJPTztw0gEtRQGZfdeYuiqBG1Q6hsskXB%2BBWr0akRKVoK1y1YXCxyQEgYgIRAhqBqR9vFFAEslyjaIdL1UPTVPBn5Bl9amGZJ7m2ikTYdIWJTIxXvsJItmNHdr7eYiM3YoyLDWPsi8KjGsOMwIC%2F02zHvJtyara8e%2BWIvvO%2Fl4zfKPT6SLF4g3w%2BtehPwQwhJnO0inmapJTW5fxbmXE9GDqSKKOYMseIjKUQy7J10T7fAyxxln277ZhzwepNF5j2xVhIMzKG16df3O76rR2hW1inIPMRXkZ4EoJnTsK3YzJptuf0FEWiDw6S0RTis0wuj1QVDc%2BMyf1KG9v5z18%2Ba%2BkORfO5k32b65Lrlx%2FA4ih5aI6qw3n4wxreFzAY6pgHyFitGFTf%2BDCexFeVvb69yMP9n7lzS09Ijow3lmCXnNynThjOql%2FAQlamkf7UIpW7kFjrDCpUPntxXCyHOdbcfh0CUQ84kohXub5PdQQ0l3e0vc%2BqqtLZYaee66QTmVklhRpT%2FIMMFHqh5tVRqSI9cNFEP6cf3ZrzwCgRHb9Yj1b2LCjeZe3G5dlsKb%2FPmxEBZDclAkjiciYEcbVCFQFd%2F9OU3UXTc&X-Amz-Signature=3b8d166f27ab5d8bfe0a2db120b65714f0074b074b0de77012de516d703a59d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664Z2H2NG%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIFvL5j2rDkeUKlrsgoXjrfRPO42twUFV%2BSOKMv4pc2NeAiEAoGh3WQmhSZcwzXfeY8uoCCSEC1nbMD0KY8l574LI1P8qiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAU0ew5UPGj8K8PiFyrcA30H%2FZUXGoVI2t8gieBc2Mr%2Bc9cKEU6Nj6ojifGpNjlJj7I9Jgg9hcjGTOd7OeWJL6Oq0jZ2PGMA8SYyK84TZnBv6We53ObGAOVMxGiIMvEkFxaDmLp16pd2gLz2HtWfYt3IIXn8e2gk2KTVBXMWoP8NwnDo6XGhlz4FWXB%2BdsIxeVFLCddJ7l4E1Z%2BUOPprP0nY%2B7mWvzs8cj30fduzsicXiRT15M2US5fXBS23Cx46k0mJMg0HkHyzIsBIG25zW4YgZc86kpKNRvqdB955Uyb1e0ZAHC42LyyBxmWbfmYoOlFLAgv1OXcthJFqf7VEQ5uZuw2gm010quh%2ByPIht05F0Z6Nc87MnwrHUxqVFUQo4WGsEUhyg9sPLrw0ZV1D6IlQ2%2F%2BTeIIfIUFPa2zNF3TN2C2Uz14KXZOcmpasQxIfCiOTuQHI07zU%2BNNevQe66dbOsrVtObgK7WyE%2BRtVGSg3%2B%2BrmtB%2BC1lZUQibujHfr8oYfyiYz8AkpehzE%2BctEJXQY9XmnF9E7mkQWM4aBCdeQId9yl5xX0S%2BVkbTMedJc0HnVEBYJmVekzkE2ZB57dHn2WFjp%2BqrIWNnlOze2LAOrJ%2FJckyltYG6YaKIE%2FMMgAq8DXcyfJAdanqpgMKW3hcwGOqUBK1YdrsPGbzFZSdHpkLP54sYmvDviONhTZNtzApB3zB%2Bm8Zlrjxr7VrSbSk0%2BYr2kvVfKXPVsrbSV5JFSUp%2BX09JQxATQbYRwbV8hPmNtmfMmiS3Sk51nCWZi9kLOnY3JO80o9x6GyzGUubxAB8B%2Bwf725R6aiA3mKlijlAyPL9lNZ%2BQXlkNEopMrZaEdtIBIpysXG17BYQUCUKo8hADKekphdZ1V&X-Amz-Signature=d0b97ab4bb1a62ae2c96b4d946abac6689f901575f4536ebc0d3f102ca770cba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVWSG3M4%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD5hk2lQqP%2BhPBtGBc3CATmCe8iMNUSh1YnCMWipy3b6gIhAMqV0wXQRZsBjwlCj9CmFlUWd4jCUyPzJLcHV7wYR%2BvOKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxek9TrGEIra8%2BJ4BUq3AO13IUwNJYsg9PFbCy7R0aTigl0ti6zNAi8LI8KhAzW1ILb4nxq%2FU%2BLa4Qt0upcaJJ7LI9XUdzAAstYHwCsegrYIDMvSuFjV6kTvhfu3oo4HLOaouMiZCNqeHATHQntR%2BB3L3i1cHviBwWxj32t4DoC%2BpHThy%2FV5%2BY3b2nEJ1DePppMwOBZDyxwhATKS0G5ypjdMlhQ0Y6H0nyCr2tu1VJqiSRLd%2FVBM3cAHhYEijMuc1mPTqtCkaak%2FX%2FvW4Y5%2BiYH1E1qTFlk9SjKsLGqWIuWneBdIg4%2BNHV38RmshqSnaGwuZiHQfFJOp0Z%2B9bPC7685YGt%2Fn0nPOlAXWUmm92oOlKqZ1fs9CaUc%2Fqzbhk2jHlhcRzLFprbazXW9i3t%2BpvVRODuYtVrJ0Uk32hgW8R8tlJd1QxsoNuGW6a5a%2BxdxTgJL02cOfktlQSRPDBRPIi2WDBduGwt166qMHLHptn5Q2d8uPKPGwIJkWAkTdaKgUOgBRBXitB4n1V7je9NHgFJFlSbKehmZ8xuWLZL8dpVt3cbUMhRAgatI8NbQfaL5Ral2h9b2%2F2SPRD8mGmLRaVMs17lTxYRXdZIXGHzUazh60YW%2FhU1522FocU6XB9991agoH3PEcYo%2FsBl6SzC8t4XMBjqkAV6LIDuiz1tsvKbl2Iylh9I6HqzpWyb%2FkGTCC7oze%2BXGsxPC3HBnCsrtknblpdWXD2egps3moFYwpSyEHlCphoilpkUngHxzGGaIU4V5%2B8h1Q69jcbF92TUJ8ZbBgDRF3GFeofWC1Ebofu2Oi%2BF3OA9L%2BULIVvddedRlFcmKttvXaXk7ENH%2Ba15c6gl5vBsIed7R30M7or%2FCiwR2OY1ii8cvQoqz&X-Amz-Signature=416a2231417e9923e1a20a9512e7693f3907418bf90c507a93fb02489221d4e9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVWSG3M4%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD5hk2lQqP%2BhPBtGBc3CATmCe8iMNUSh1YnCMWipy3b6gIhAMqV0wXQRZsBjwlCj9CmFlUWd4jCUyPzJLcHV7wYR%2BvOKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxek9TrGEIra8%2BJ4BUq3AO13IUwNJYsg9PFbCy7R0aTigl0ti6zNAi8LI8KhAzW1ILb4nxq%2FU%2BLa4Qt0upcaJJ7LI9XUdzAAstYHwCsegrYIDMvSuFjV6kTvhfu3oo4HLOaouMiZCNqeHATHQntR%2BB3L3i1cHviBwWxj32t4DoC%2BpHThy%2FV5%2BY3b2nEJ1DePppMwOBZDyxwhATKS0G5ypjdMlhQ0Y6H0nyCr2tu1VJqiSRLd%2FVBM3cAHhYEijMuc1mPTqtCkaak%2FX%2FvW4Y5%2BiYH1E1qTFlk9SjKsLGqWIuWneBdIg4%2BNHV38RmshqSnaGwuZiHQfFJOp0Z%2B9bPC7685YGt%2Fn0nPOlAXWUmm92oOlKqZ1fs9CaUc%2Fqzbhk2jHlhcRzLFprbazXW9i3t%2BpvVRODuYtVrJ0Uk32hgW8R8tlJd1QxsoNuGW6a5a%2BxdxTgJL02cOfktlQSRPDBRPIi2WDBduGwt166qMHLHptn5Q2d8uPKPGwIJkWAkTdaKgUOgBRBXitB4n1V7je9NHgFJFlSbKehmZ8xuWLZL8dpVt3cbUMhRAgatI8NbQfaL5Ral2h9b2%2F2SPRD8mGmLRaVMs17lTxYRXdZIXGHzUazh60YW%2FhU1522FocU6XB9991agoH3PEcYo%2FsBl6SzC8t4XMBjqkAV6LIDuiz1tsvKbl2Iylh9I6HqzpWyb%2FkGTCC7oze%2BXGsxPC3HBnCsrtknblpdWXD2egps3moFYwpSyEHlCphoilpkUngHxzGGaIU4V5%2B8h1Q69jcbF92TUJ8ZbBgDRF3GFeofWC1Ebofu2Oi%2BF3OA9L%2BULIVvddedRlFcmKttvXaXk7ENH%2Ba15c6gl5vBsIed7R30M7or%2FCiwR2OY1ii8cvQoqz&X-Amz-Signature=c1006c3d5662fbf02fa3fa9b854d305ef66edea76a5d9bad735dd6d157182fb6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q2KSF3I3%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031212Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQC8Fz%2FRluePpyht7sdgc%2FVQ52VlK%2FBt3IkCf9AzCp1l1wIgN4Pv4tnqulwCc5TXfnesiWMDSPOwiQnA9r8d3ioH26QqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCZfRNbHZxBSJU4iryrcAy%2FA1YX30dnuPZ6DdS5kZEIBW85iIpE8BKOawRDJ9geMZxY3%2BfutzMo9h%2BkURcZPpDWVn2q4NhmeOuNQ5XoPCgjeiVaM5%2BJXhZfr4BMZBoWubCIdsrmZiVqdXaokkXvCu2yypvQfuVz6e6lMtvkoJSgFQbkcwJBSOBuUGbvVF%2FSbUnTBeq9H%2FtZAIg2oNejIaSvCY767ko2fA%2BDRDXrSpCC%2FTKh7CMZgHmIX9HYBrs%2FIVh1mec%2F3XeMyzfEccWoHHDzo4TKlq5FNvEuz06vZDo7ivmXd%2F1SUU%2BEvtFeE0wL%2BYH%2Be%2Fn0L8Wnn8YAgnjBcjjnXCwV3Xn2r8mMoMpR9mGzQDBCvGlL9jgvx5qOO6DDJfrEVwjMZbPv%2Btcp5RiAk6RHlUSzLaBDSAsO%2F411BL7qLeYaGDZNlT98BNxD5UzgLtyaC5G2wFfWfsMctpa5D3NeeEKpXDvrV3VtFfbrPSIQCCHUcqLjc6VHu9YmXjbQTG0o0htHAGmjbgvnhczOdwXJOAlowUx5HYbgQz7g11EmVQZrVHHP2JOgHuC3SklPnAP7FVsLJqicht0m4f6jUk1uRFlriqcz%2B%2FMnbUZOM4BogMvM64SFVohBFiYgChPLyo1zkgm7tJUaZTMHNMI23hcwGOqUBwDxxWNNN%2Fdlzi24INbVLwplG8mzSpmv94yg6Uk4GSxy6jmF7MehANAnGIpiCafyNR6WHTUbs947tFPNoThoN5z1B0gHafB%2Bm0DK5f5avmg7tuPq55Y2hTh9YABGtyCm%2FBQikF%2FrjKJvHI9x44kXyamQy1XZe1dV5eWpm1rhAKj%2FnEVnwhuO%2BnE%2B%2FjhWQNfz0cTRQGRZ%2B9sLoTtZt2xhGeSyfN40V&X-Amz-Signature=76dbffec9012db4885062eecc603fa670fb11856d6c020fb9962edcdcf84b475&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SVWSG3M4%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD5hk2lQqP%2BhPBtGBc3CATmCe8iMNUSh1YnCMWipy3b6gIhAMqV0wXQRZsBjwlCj9CmFlUWd4jCUyPzJLcHV7wYR%2BvOKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxek9TrGEIra8%2BJ4BUq3AO13IUwNJYsg9PFbCy7R0aTigl0ti6zNAi8LI8KhAzW1ILb4nxq%2FU%2BLa4Qt0upcaJJ7LI9XUdzAAstYHwCsegrYIDMvSuFjV6kTvhfu3oo4HLOaouMiZCNqeHATHQntR%2BB3L3i1cHviBwWxj32t4DoC%2BpHThy%2FV5%2BY3b2nEJ1DePppMwOBZDyxwhATKS0G5ypjdMlhQ0Y6H0nyCr2tu1VJqiSRLd%2FVBM3cAHhYEijMuc1mPTqtCkaak%2FX%2FvW4Y5%2BiYH1E1qTFlk9SjKsLGqWIuWneBdIg4%2BNHV38RmshqSnaGwuZiHQfFJOp0Z%2B9bPC7685YGt%2Fn0nPOlAXWUmm92oOlKqZ1fs9CaUc%2Fqzbhk2jHlhcRzLFprbazXW9i3t%2BpvVRODuYtVrJ0Uk32hgW8R8tlJd1QxsoNuGW6a5a%2BxdxTgJL02cOfktlQSRPDBRPIi2WDBduGwt166qMHLHptn5Q2d8uPKPGwIJkWAkTdaKgUOgBRBXitB4n1V7je9NHgFJFlSbKehmZ8xuWLZL8dpVt3cbUMhRAgatI8NbQfaL5Ral2h9b2%2F2SPRD8mGmLRaVMs17lTxYRXdZIXGHzUazh60YW%2FhU1522FocU6XB9991agoH3PEcYo%2FsBl6SzC8t4XMBjqkAV6LIDuiz1tsvKbl2Iylh9I6HqzpWyb%2FkGTCC7oze%2BXGsxPC3HBnCsrtknblpdWXD2egps3moFYwpSyEHlCphoilpkUngHxzGGaIU4V5%2B8h1Q69jcbF92TUJ8ZbBgDRF3GFeofWC1Ebofu2Oi%2BF3OA9L%2BULIVvddedRlFcmKttvXaXk7ENH%2Ba15c6gl5vBsIed7R30M7or%2FCiwR2OY1ii8cvQoqz&X-Amz-Signature=c599cbf92b0ae7dc24392b48afb5c1384e65167e9f24ef54972b1bfe156380c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q26HSIC4%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031212Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCICiQhHcaD%2FO32Cph9hPnTv3qZr24jkdMKlj87TFqli3YAiAEtARzHG47gNo%2B7hXA%2FC0vnCUXnUDr6%2FbgU7D5l2n1YSqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMNUMvWKsbvpGqOJvwKtwD8jshgBWwUd%2B4ZBQhEcN66vn09MRYioeWL8uNSyXVyyms9%2FIt3Pi0m%2B89yfg8Yd%2BgCgwH8KFuLTnO4b1989i6YuAYZkPgdro96vxuinjY8aZHUGfS9oBaax5oq8%2BqjV5Yyk5Mmqk6twVxM%2BwILPt3%2B8avtXtBlGWvhkPkclvq73tXhKyFUmrLnp1H2qjGQjTL4G5tKc%2FsraYBXN0%2BA%2FZzt7VdwT8kWsAYw2o0L7HvNpXi8T%2Bqpqs8cJY4Vlje%2FLE4A65Vi4eBUHT4gvz%2Fpq7gMCGwPRh01WFpA6ZhEzzy5LUIRONYYrjMmRQFjpHNQJTQInnVzIHph4fH%2BQVb%2F16WxD7EFPKA4N6Dk9zFHAzkusWlenivoTvWNTMtPmiAi4CWtb3QPGQWRaMIHVR6Gv9JLgZEYX6hxrJFxJaS%2Fx4rLDsrjnNJ%2BaS%2BlPneeXh6kVcrRPWCV6FUs261zNUQOSLX5o5y21nDXVRg2CpdjQXY%2FJKZcnNZQ3yURhw3ixercBaLn7z1rGDby5mHGivtXK05DtbKTyKZb0ZKiyLv6F1IjVIlCyatGo1irL9GWzCJoM3FDT7iqh2o5C9Lh3Asd9%2BbI1dVRlCnEGv4ZRDW2RCvax%2BIGXYdvvQ92IWReKowyLeFzAY6pgHv80ZSrjRrbLPCQ6jwdCzswcCLcXFezvhx8GIcmODUlAeUnGsT5c%2B9Wq%2FkGYdito6UCsqOphRBzrLUmL1nccWYsOtNPwzdlTUYHrOublGOu%2B%2BI60W64IOxUVW8CGaLKRC%2FETMNqIFZJDDtjhd%2B8%2FzEwG0VfXLcl%2Bu6egdNXbx48uycVbk1tXH8%2FsHh4nJMRssbQEbLkjeIIY8XVHEvNzgQCl4DBN5r&X-Amz-Signature=c94ad91f08c6a4b492b0491645ea4b22133b77f176264e958e635cea9e5f4e34&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QQCXFTRG%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031213Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQCdCgS49ee0z6gNQnUY5vDxxucKfAvdlX4jlSX%2FpU%2B9wAIhAIZprcLIB98EAqwWNj6fXZKmr0dO51va4fWtoG4Lh3PcKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyNbK9Pl31tI25O52Qq3APavcPJUnpjumXUDvCY5qXH1LME4DPUo7yZsXG1fZJLPXh8xMTgG6FZxPazPXs5FxbXbaZJF5N6yVq6fJVtB8Lo7nXQTNjxVHxjFzr308bmFFNkdW%2FF4l4r0xzqYrH6aPhBUIWveDETDA6DYhca%2FGXLQRNeryf9fVBG%2B9wHTmmKYrd8gkRiyDZWVKdpS6ytHvgOdvFV4kTj%2BpFhVDgP5aoZX7UCVy8fihsEKzbz4EVgssRVrUK0u%2Bm67k4cOpDuLvAKxcRtetp%2BxJyS%2BeK9u%2BBTKXAQHSK9GqfwXqp%2BG0jrR6dJM5BXYOJ83Sr%2FcSp0tTzFIe%2BmEPjRVSjGpGenMe3HomQqiF1vXl9Nelc22EyYK17GwbKhfVk9XT2mXV%2B9L9Fz08Rr0zTY5KXxoOIfh3r%2Bb6bm%2F%2FslpuOyA7G6s3%2Fnf%2BDLtm%2BeXXZEF1TCLv5KXBnZ0IIOTbrnLO%2BjiSr8kTYcHi3Rbz%2BG1UYXv3HqiW8ISKq%2F0bgniCGKJtrLq1gcQ84Gy3a8laqN%2FF5AnlQ8u5HkH8zAdAY9l%2FpMIlaLvLj8L5PdqzQocY0t7CqARwoYyxWlq57MK85kZTdAt3kTCvsYwObXuOzt2ZDTl04LiSDLmrhvQHp2L6CCcjSzcjDmt4XMBjqkAYcovugAjuiHXkMgLNIxLZd%2BMxDOt5BygLnKXrKPElrBGqIDvGPs%2BmYrR%2F5eCIt%2BOXgLbfGRx4JWujDddD%2BvLSwXba%2BwFIWZU1L1XrFvzN9Vz70813sTZ1YZpMddDApPQnjKvLY2Uh7kbrNq8CMI0VBq5CJunZXfUoNm3LBqEiqMgygnkyqLIwjri1dkmP1RfKd2L3%2F6gZIyOwtn97hiA6h8Iz5N&X-Amz-Signature=0542fbe7a43d3f7c6eeb6f2c9106462fa4308c1807bd7967cbc5c2d0607f9ee3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466455NWVJS%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031213Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCID3sp6z3YHMrRniQT3VRMAeJlNT3oje212Pn%2FMJEVvz9AiEAlPWfmABGfOwFVLyrzTUyt3AloMOkBZfH%2BPvG1HyJCnEqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAtJRE7lnmP8pPdyHircA0KBDvPHJDdTpRV34I6Ahe3wme%2FznkatHZKwoAk9aQR6tWIIK%2B7iyyD48DjTyTizPKgki1ai5MMO%2BfQFLa%2FzeIO7XLTWrB6y6lg7vD1amgPahSfzJ3zx0HJo9MTYJ9IGwpH9lo0HamrR9tfYRs%2FYsCiN7shE460xSybE301v2XP4D20FkH4zpgBxTEFHl7uX31ht8p6veZbW8vLlD81ixicea%2FF1cT54Tr2tTpCAZppfLiw3Qyh47z9j2DydmAKqh79QGT2R1fn9Q1tHtv%2B9XE06r54KnFWpZ3uQFH7wJEWcDmNtI5MEkieD4WhMUPPtegzkkxzm36Z1XzxwYbFLqcFGRWd0t%2BCz78YCWhkaUjvpd6CfVM41eQ%2FGb8JzPjsOmclgyrBkUK8ZNu5KltNQoM3xsELaEeVMIB0bTlAmwac12KJxkFbDD%2B1rZVQQqyw7Cuhf%2FPppCVlWnySyqG6WGJ5vGgOiZC5aNrqGFwxL%2BXsD0kwZ7QEJA4Ttx099S2plpOheKd7J6jVqo9HNvWQvF3Pf%2FeT95mTN6pS40q2pqleA4w6YSqnUrZ%2FDq1oYmssSPqq9I%2FBWt8GspTsijnWYaJNV0xsXoaosg2RZ160zUZ%2FcMOyySt%2BJX3Affr%2B7MKe3hcwGOqUBnoztvekjNSeEZ8GGoMsI03IjD%2F69VVm3W8o%2B5Ya8GBYp82Swu8Jfknht5knKsFjUrPU0ICoyiNBalnHTtubLbmjmBBcea7SoiYZqTVRuGkzAyX%2Flp8bnhfiSaYV%2FppOmD2bz2QTkoP3btQ3dVdltoPl9jBhngrvwjg%2F9zhPkyEH%2BKYD76BIs4rmcx3blKWfNa0rDp5DJr8k4YYfyjVh9r9QFNGpU&X-Amz-Signature=342e218823c4cfe0dc682a23e2d1ebe4a7a0d92091ccda9e379a6a5b8ee10c4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LXWR7C6%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031213Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQCLCfE9QA%2FErhYP5AlerNneHCanmGVbKzB%2BJDQZi714kQIhAJaqxSNNq8F9D%2FQR6AxIea98cI5E4Z9H2k00Jv5BkahiKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxRGJLUtkCYt%2FFaXjUq3AO5WEwI36pQaLWWOHwGd3Lwl1ON%2FfuukmeFP6MHG5a2k4J6JHcolyyRw%2BoCFuRxcARljKpgg69A9qWb%2BKq2wE7N3lnPVAwaNTCwii0VgeQmCRvsJMHARNwunzx9L61vRwFdTMfDcJDU1u8warftQyFQb3vCPrsKW4rayd2nSTx4Ljic8se2ZwMlLAic%2FRz98cFs%2Fd18h9uoJJNegAdet1MUhihaZsMkVdNilLjXlBCfV54Hk1u74Xy3qx6e5sfl8J4jKiU%2FZQr7YlHyW4mqG86GVubv%2FyfGnKS%2F3tSoIZhPjIIAmBzrln5HvwTrX2Jmpcn9328F1Jhy283%2F5V16bCsuTP3BuMJaJbTRdAHy1%2BAKli9tXGiRvpjoC4sFTUHLS%2Br8OGUZI1nq5K1X90fDlMub%2B5pA40KQJgnGn7rFmAHfiYvmDZK3pyBYr8AHfnXsOPGSePEDgUADJL%2FrLh1L2LcEkiZgt6XGUa%2B2EzSHMhBRXPQmCf7YN8edIVr%2B5dkH9aGG%2BFPOo8zaWfeRyhbhYI4Mfb6xZCoyUlXAlcjdirWiXMwUGUqKe%2FToJv%2BD2fwknLQvDp6etztET49AyEs6ISGYMsonEzxIQ24LV%2FCccnj%2B2ELAFZdQfndb7mDMlzD3t4XMBjqkAWoDqBT57Sk7PebDVDP%2Bih55ZVFmlNPT5bNWqp%2BWYGvQ2i1CKKyy9sy2TPHqRpea12qHnGl0y1EvCimce7AJirw16OvdOHRBAQF2x4ip5fGQ%2BSPDd1hnYBztHQpe%2BVNG3udw3rHkjZsr8wvOU7Z6KmRExXaXzj9y8T2Kpc240xZ7xfQol34li445gLC5kjaYeyI4UvS56Mh7YhgjJBvYEb%2FJY4nt&X-Amz-Signature=e1219f0f54a0713529912a1958371422a49abb05a3b14b0bdee02ed0347a7a65&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표
