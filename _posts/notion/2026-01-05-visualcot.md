---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [paper-review]
tags: [mllm, vision-language]
---


## Abstract

- MLLM의 발전 - 여러 VQA tasks
- 하지만 **interpretability가 약하고**, 답에 관한 정보가 있는 지역의 크기가 작은 **복잡한 visual 입력을 어려워함**
- 이 문제를 해결하기 위해서, 본 연구는 <u>**대규모의 visual CoT 데이터셋을 수집하고 제시함**</u>
    - 438k의 question-answer pairs
    - 질문에 답을 하기 위해 필수적인 핵심 지역을 _**bounding box**_로 표시함
    - 이 중 98k의 데이터셋은 _**상세한 추론 단계**_와 함께 annotation됨
- 또한, multi-turn 프로세싱 파이프라인을 제시함
    - 다이나믹하게 visual 입력에 초점을 맞추고 해석가능한 생각을 제공함
- 관련된 벤치마크도 제시함 - 특정한 지역 파악에 대한 task
- 광범위한 실험을 통해 효과성 입증, better 추론에 대한 가능성 제시

## Introduction

- MLLM의 등장과 발전
    - LLaVA, SPHINX, Qwen-VL
    - 입력 이미지를 시각적 토큰으로 변환해서 llm과 결합하는 방식
    - 여러 task에서 그 성능을 입증함
- 기존 모델의 한계점
    - **블랙박스 구조 & 환각 현상**
        - interpretability가 부족하고 hallucination 생김
        - llm에서 효과를 입증한 chain of thought 기법이 mllm에서는 제대로 탐구되지 않음
    - **비효율적인 이미지 처리**
        - 인간은 복잡한 시각 정보를 처리할때 전체를 훑고 그다음에 중요한 영역에 집중하는 방식을 사용함
        - 하지만 기존 모델들은 고정된 해상도로 전체 이미지를 한번에 처리하려 하기 때문에, 세밀한 정보 파악이 어렵고 인간처럼 효율적인 추론을 못함
        - 인간처럼 추론하려면, 모델은 핵심적인 정보를 담고 있는 지역을 찾아서, 관련된 문맥을 포착하기 위해 그 지역을 확대해야 함
- 이를 해결하기 위해서, multi-turn 대화와 dynamic한 시각적 집중이 가능한 새로운 방법론이 필요함
    - 💡 중간의 visual CoT supervision이 있는 데이터셋이 없음

        **→ Visual CoT 데이터셋 구축**

            - 질문에 답하기 위해서 봐야할 핵심 영역을 바운딩 박스로 표시한 438k의 데이터셋 구축
            - 이 중 98k는 상세한 단계별 추론 과정이 포함됨
    - 💡 유명한 mllm 파이프라인이 정적인 이미지 입력에 의존

        **→ 인간의 인지 과정을 모방한 새로운 모델 파이프라인**

            - 이미지에서 관련된 핵심 영역을 찾고, 확대해서 세부 정보를 파악한 뒤, 전체 이미지 정보와 통합해서 답변을 생성하는 파이프라인
        - 관련된 visual CoT 벤치마크, 사전학습 모델 제시함
- 기여점
    1. <u>visual cot 데이터셋 제시</u>
    2. <u>mllm의 새로운 multi-turn 프로세싱 파이프라인 제시함</u>
    3. <u>새로운 visual cot 벤치마크 제시함 - 특정한 지역 또는 객체를 찾아서 답변해야하는 task</u>

> 💡 기존 모델들은 이미지를 통째로만 보려고 해서 디테일을 놓치거나 엉뚱한 답을 하는데, 인간처럼 중요한 부분을 자세히 들여다보는 능력을 가르치기 위한 새로운 데이터와 방법을 제시함~


## Related Work

- **Multi-modal LLMs**
    - mllm 초기에는 llm을 일종의 scheduler로 사용해서 시각적 작업을 수행하는 전문가 모델들을 연결하는 방식
    - 최근에는 visual과 language라는 두가지 모달리티를 직접 “정렬”하는 데 focus함
        - LLaVA : 이미지 토큰을 llm에 맞게 변환하는 projecter를 학습함
        - BLIP-2: Q-Former라는 구조를 사용해서 이미지 특징을 학습
    - 최근에는 2-stage로 학습함
        1. 이미지-캡션 쌍으로 pretraining
        2. question-answer 쌍으로 alignment를 수행
    - 여러 분야로 확장
- **Reasoning Capabilities of LLMs and MLLMs**
    - llm은 in-context learning, cot 프롬프팅을 통해 놀라운 추론 능력을 보여줌
    - 하지만 visual과 language의 domain gap으로 인해 mllm이 이러한 추론 능력을 물려받지는 못함
    - 관련 연구들
        - 데이터 통합: flamingo
        - 시각적 grounding 활용: Shikra, KOSMOS-2
        - 추론 단계 학습: V*, CogCoM
    - 위치 정보를 활용한 선행 연구와 다르게, 본 연구는 단순히 위치를 찾는걸 넘어 중간 단계의 시각적 사고 과정을 명시적으로 데이터셋으로 만들고 파이프라인에 적용했다는 점에서 차별점이 있음

## Visual CoT dataset

- 데이터셋 구축 배경: 기존에는 MLLM이 답변을 생성할 때 <u>**이미지 내의 특정 영역에 집중하도록 훈련할 수 있는 데이터셋이 부족**</u>했음
    - 이 공백을 메우고 모델이 **해석 가능한 중간 단계의 시각적 주의 영역을 출력할 수 있도록** 돕기 위해 데이터셋 구축함
- 구성: 438K개의 데이터셋
    - **Question-answer**
    - **Visual cot bounding box**
    - **상세 추론 단계**: 전체 데이터 중 98k의 쌍에는 단계별 논리적 사고 과정이 추가로 주석처리 되어 있음

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666CEVKZKC%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQD6MIOPxQ%2Bv8PTWSY7xkVJZ1GPmzwhxokdtffw2DH55twIgEbenz87qdSyP4PsMgDH2r1qmr%2FUcqm5L3viyGvWiIGkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAu2w86YLIUlZ7vfKyrcA6VMxOBdUVIi%2F5R6bgOSfN1w7TlDIwD8FfFQFP95tAE0JQafWKF2gNZfSmnc7lnUUNrf%2FRha4FhW8Uhx8Y7UFyyrypsqfS4azOS%2B7MbWnZ0aR0ojHs7%2BcRj17azHB%2BnpbDn5%2FijjP1q7fQQl%2BzI6Q8foi%2FQUgyFj49dHPlNQ6WamOvKYZUycbz0Rru48wPNoC7NxLhZQ3PIPxmmPpMq8nOSoQ7u7XI9ARZyd3nuRQ3r8myjBzqCYxT%2BjI%2BCO0Rde2FtL2LCyTtc7rdZN1i4QvMmYbohTe5vViH9nuwnPgzDCDOxhqJAm4KsL0OY11bo9na9w9Yw%2BIUejla5f3DsSc4yvZ5g6WG1hVgrgfPHl7KnE8yhwrY%2Bj8bj%2BNzsi6WaeJvffYJapdm2zYsR4CNdfMaFu2djpZgpeG0daL5OCANijJP4tCulZNyBCM490ymKErOeivDvSWEwxKnDJ8piAYa7xA0iLsm%2Fpws2947jgBkx3JU%2BAvTDy%2BKlF%2FewTEAMDq3xyMmpIzeR9r7KzjsIM4j5UeUhIaV8jwi1xxwTgQOhkLxkIcJJaVqLXpSb8VIsnFcrP4MZw95RAnYhFtwASPCQg5JQOas9mK1x1UqxnVK18XB4mRW0%2BK7WQ%2F8aIMI2Urs0GOqUB7NSQiHiJQFM3R1ihb4X%2Fw6o7YxpVGK%2F6YYEdH%2BpBntRLuZWAa6Vm1JIuL6vNN%2FrFYvvHUbl7ugxnizcFHjL3kZE5D6cyOqYrIAantAZdInzrMWoj%2FmuQBiqdKblRP1bjFpNjj5e5Md%2FFpzq4VnB8WtC5%2FXyNH57X1d4MUkBZ%2F5qONRmMUPozn5ohlODYK6rHRBWbsNEwxye2UtZIOPRdKjNfqbLM&X-Amz-Signature=da2e1ae96fea5c9bb25222344a7b6a6500be5f6ec953c2e2991c638785d75f0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VOQJLYUU%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQD0so9ejMrve4kJxAAnHznZyUEdLYoPreSsVz4Tnxoo3QIgTt%2B0j%2FZRgw7Mq36kf2H0U7YFiHxeQJLbkaGT9mwo9K8qiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJvdV9ZZQXEyOmwDBSrcA%2BV1SZRd31z5Cx7yuveiRm45Lfjl2xv%2FsxVjCQpt5G%2BzSfHBUzJ8MkS89rJRExcHetXyLwnfQfDCd3o1CuwVIoAFK64dpoo1TGci5tAueGX12RDg1DABAnTnZ6jb0QXnu23odoCSYNDXKd3qenX%2FIf6yt5Y4vaHXoJ5FZ0fA0daZkdF0MSW%2BM1xYaJYqZ%2FhRnI0TIdehjyG5Z9Mm3HrOi%2BVOyss1a5oIO0lg5NIxUjgXdQHLYRGcmSXytDUFiWYAGgT8AtkNNlf9dxcB%2FKnMAxnCN%2Fbsp689bSaVerLMHRKCmAPvNO8nCEOvzQmefEiXbaWkCtNRwIpoLcMcxYwgeakQ8VvcLFdkr0jy02OCgoE1LSUZXECsRvYZBbBKKI%2BEYEuvPcwTP69blxR930NR3jRKOFu6f1qG65G9dz4zj%2BPgGrMIsHZVZFuzmRA1QDaYBQXrXwETdWmqR6Sy9GWU4gCiQidyeV02zBx%2BK2JUrrEDqZ55HCrF39OiarAHmeash%2BwCdlrTr2TSzQOQZf%2FhPJSXqLsED1BzPXjFqx40%2BP%2BPWkRo3aBS8kOKmlN7PxMeUAqkU4FC1wlFsBId%2BPFzp1bmscD0gxzVS8kgyT1rrXUBtvj3A3spXN3oyKfZMPGTrs0GOqUBabCB4MlxAywEeQ88YjoaLjmpun7A5TgzQGmLqsvjjwkdgl93uzSTvMDhoe%2FSv6rCMoOoCXsJ3eJh5jGJQaTPLV0k0KEWLwapXyC22Ifbq06dTOGz6IslHbCQIcn%2BIl51wktOEM%2F84w4h1kPq0yZM0G2nHYluxMsxchUxzAlbWzUERdtCW%2BE4VFZS1xcDBX6n50Qn2qALZyH9KKI3sO8%2BPvvtQ7nR&X-Amz-Signature=79cec160ec1ddac78ccc3e8985c693fd6064c8c540501d9f3157353d68591ec5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모델이 단순히 이미지-텍스트 pair를 넘어서 “어디를 봐야하는지”, “어떻게 생각해야 하는지”를 훈련할 수 있도록 설계된 포괄적인 데이터셋임

### **3.1 Data Generation**

- 어떻게 원본 12개의 데이터셋을 활용해서 visual cot 데이터셋을 구축했는가
    - 기존의 이미지, 주석을 사용하되, gpt-4와 paddleOCR 같은 도구를 활용하여 부족한 질문-답변 쌍을 생성하거나 시각적 근거 (Bounding box)를 자동으로 추출함
1. **Text/Doc**
    - 데이터셋: TextVQA, DocVQA, DUDE, SROIE, TextCaps
    - 이미 질문과 정답이 있는 데이터셋은 그대로 사용
    - 캡션만 있는 textcaps의 경우, gpt-4가 캡션을 기반으로 질문-정답을 생성함
    - paddleOCR를 사용해서 이미지 내의 텍스를 감지하고, 정답과 일치하는 단어나 문장이 포함된 영역을 visual CoT 바운딩 박스로 지정함
    - 필터링 파이프라인을 통해 지정된 bbox가 직접 질문과 관련있는지를 보장함
2. **Fine-grained understanding**
    - 데이터셋: birds-200-2011 (새의 종류와 속성, 부위별 위치 정보가 포함)
    - 모델이 이미지 내의 미세한 디테일을 식별하는 능력을 테스트하기 위해서 **특정 새의 특징을 묻는 질문을 구성함**
3. **General VQA**
    - 데이터셋: Flickr30k, Visual7W
    - Flickr30k - 이미지 캡션과 객체 위치 정보가 있음
        - 이 객체에 대한 질문을 gpt-4를 통해 만들어냄
        - 이 객체 위치가 bbox가 됨
    - Visual7w - 객체 수준의 위치 정보가 있는 question-answer pair가 있어서 바로 활용
4. **Charts**
    - InfographicsVQA
    - ocr 기술을 활용해서 정답이 위치한 영역을 식별하고 bbox로 활용함
5. **Relation reasoning**
    - Visual Spatial Reasoning (VSR), GQA, Open Images
    - 위 데이터셋들은 객체 간의 **공간적 관계 정보가 풍부**한 데이터셋들임
    - 질문과 관련된 객체의 bbox를 cot bbox로 지정함
    - detailed reasoning steps
        - **gqa 데이터셋** - 객체와 관계에 대한 <u>**scene graph를 기반으로 gpt-4**</u>를 이용해 단계별 추론 과정을 함

### **3.2 Dataset Analysis**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZVF2SN4%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024557Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQDnJ8khpwuOO4li0jNYSEt2FHiSDBEOEW%2F2t9kgK68uMAIgbxuk3O%2F8gsNcTupryPeV5rVlXkzIjxknwWEBNSjJlm8qiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHW6dkVjdIym8Ms0CCrcA2YJm7LZEmKGEFZT0eWPutdxE5%2FoFuGuJ8eTFVGB0ODjt18S247MyY4compsD%2BAdRSl1YUR9lXoP%2B7xjTBj2aaiErrSwiW%2BtSAYacUBpK83K6%2FU1X8s4fCwB52xtkMecyfM1n3e4aRVv%2B0Z17y6bZL502oqeF5Dq2kK7cKHCtxvP6rb%2FZhNp0JAstAmbUVOo3M4sfJqgb8RUjKKw2cyuV9GzZDJHBEycD%2B8K0gvNAHWCOSxUFjE6MilwFGlwCCM9z8PpEupr9WdLqsUXlft%2FHlZMcvZ26OHFSuxxGPIc0pzQ9%2BCG0zo9d5uCVPG8eTVFJ2DMq81tt6zk%2FYJQ8VegqHuOeEKG0MvsDETYN8tT30M8jJKmLtMedwMFIiRgmGF%2FdNBJrOf5VDepkUjJq59%2FoVBvAKB73ZHqbs0s%2BeDd2o%2FYfI9W6BiKJBwugfQPNeF0cxPqUnkBLNsVv2g9SBOWLUMfe82oHFeDYi1WcRoCYrqpORV27d0Nl80Tbnjbmboin5NbURN00YveRhWwo8mk5qBiC8tqqek3o7GweeMW%2BZaF6%2FpfK78U0ZciXPaNSIZdZ0vAK8EJ35cJGsIEJOhFXQZXVbzHruqQwSsdl%2BSmn7F7aCGwieoXbMTJOEcwMLqUrs0GOqUBR15n0XP%2B4122qlscGC62ra2Yu0dNJmNZny5rdb7ibPaWoXARMTjsdxgumXVCycBXAh7y1QEuX7wBbSA6l16J019v7szvkfTZimrURUXSwkxgWlDgS8ya6QGJPf6ITLHXdDYPQvzLJJY1%2F2OLQpmUT8q3p4kkEXSE5zBJZzYijS5gB%2BirrEU7m5meI3IF9a0JsQxzblLTBUHBh%2FRy5UjYoA63cAos&X-Amz-Signature=fe520b13cb259eb97548f5cc2171a7682fea4798f4c9b2b3cab9255616b9b186&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- bounding box 크기 분석
    - 전체 이미지에서 bbox가 차지하는 비율을 기준으로
    - 소형 (1% 미만), 중형 (1~20%), 대형 (20% 초과)
    - text/doc 데이터셋에서 대부분 small/medium임
- 평균 영역 비율: 전체 이미지 면적의 13.2%
    - 나머지 86%는 질문 해결에 불필요한 정보일 가능성이 높음
- 평균 픽셀 크기: cot bbox의 평균 픽셀 크기는 247.82 픽셀임
    - 일반적인 비전 인코더의 입력 해상도가 보통 224~336 → 핵심 영역만 잘라내면 화질 저하 없이 딱 입력 가능함
    - 입력 이미지는 매우 큰데 비전 인코더의 입력 크기는 작아서, 보통 down sampling해서 이미지를 넣음 → **핵심 영역의 정보가 손실됨**
    - visual cot의 필요성: <u>**모델이 핵심 영역을 먼저 찾고, 그 부분만 확대해서 보는 능력이 필수적임**</u>

## Enhancing MLLMs with Chain-of-Thought Capabilities

- visual cot 데이터셋을 활용해서 멀티모달 성능을 높이기 위해 제안된 **VisCoT 프레임워크**와 파이프라인

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZVF2SN4%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024557Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQDnJ8khpwuOO4li0jNYSEt2FHiSDBEOEW%2F2t9kgK68uMAIgbxuk3O%2F8gsNcTupryPeV5rVlXkzIjxknwWEBNSjJlm8qiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHW6dkVjdIym8Ms0CCrcA2YJm7LZEmKGEFZT0eWPutdxE5%2FoFuGuJ8eTFVGB0ODjt18S247MyY4compsD%2BAdRSl1YUR9lXoP%2B7xjTBj2aaiErrSwiW%2BtSAYacUBpK83K6%2FU1X8s4fCwB52xtkMecyfM1n3e4aRVv%2B0Z17y6bZL502oqeF5Dq2kK7cKHCtxvP6rb%2FZhNp0JAstAmbUVOo3M4sfJqgb8RUjKKw2cyuV9GzZDJHBEycD%2B8K0gvNAHWCOSxUFjE6MilwFGlwCCM9z8PpEupr9WdLqsUXlft%2FHlZMcvZ26OHFSuxxGPIc0pzQ9%2BCG0zo9d5uCVPG8eTVFJ2DMq81tt6zk%2FYJQ8VegqHuOeEKG0MvsDETYN8tT30M8jJKmLtMedwMFIiRgmGF%2FdNBJrOf5VDepkUjJq59%2FoVBvAKB73ZHqbs0s%2BeDd2o%2FYfI9W6BiKJBwugfQPNeF0cxPqUnkBLNsVv2g9SBOWLUMfe82oHFeDYi1WcRoCYrqpORV27d0Nl80Tbnjbmboin5NbURN00YveRhWwo8mk5qBiC8tqqek3o7GweeMW%2BZaF6%2FpfK78U0ZciXPaNSIZdZ0vAK8EJ35cJGsIEJOhFXQZXVbzHruqQwSsdl%2BSmn7F7aCGwieoXbMTJOEcwMLqUrs0GOqUBR15n0XP%2B4122qlscGC62ra2Yu0dNJmNZny5rdb7ibPaWoXARMTjsdxgumXVCycBXAh7y1QEuX7wBbSA6l16J019v7szvkfTZimrURUXSwkxgWlDgS8ya6QGJPf6ITLHXdDYPQvzLJJY1%2F2OLQpmUT8q3p4kkEXSE5zBJZzYijS5gB%2BirrEU7m5meI3IF9a0JsQxzblLTBUHBh%2FRy5UjYoA63cAos&X-Amz-Signature=eca41556ecc1b4b9e92303624bc768f240a6d44b700b41239020dc1026784e61&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 특별히 복잡한 구조 x, visual encoder로 clip, llm으로 vicuna를 사용함
- **multi-turn 처리 방식**
    1. **CoT 프롬프트 입력**
        1. _"Please provide the bounding box coordinate of the region that can help you answer the question better."_
        2. 위 프롬프트를 질문 뒤에 추가해서 입력함
    2. **핵심 영역 식별**
        1. 모델은 전체 이미지를 보고 질문과 관련된 가장 중요한 영역을 bbox 형태로 예측해서 출력함
        2. 훈련 시에는 **정답** bbox, 추론 시에는 모델이 **예측한** bbox
    3. **이미지 크롭**: 예측된 bbox 부분을 잘라내서 local 이미지 x1을 만듦
    4. **feature 통합 및 답변 생성**
        1. 전체 이미지의 특징 + 로컬 이미지의 특징
        2. 통합된 특징을 모델에 넣고 최종 답변을 생성함
- **visual sampler**
    - 단순히 bbox대로 자르는 것이 아니라, 비전 인코더의 특성에 맞춰 이미지를 처리하는 중요한 모듈
    - **정사각형 유지**: clip 모델은 정사각형 입력을 선호
        - bbox의 가로/세로 중 긴 쪽이나 인코더의 입력 크기 절반 중 가장 큰 값을 기준으로 샘플링 크기를 정함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VEKNL3PX%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024616Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCEwDapI%2FFVDJ21Gnhn2%2BYoK5Q3gzr4mB2TpD2ZeEgGLQIgU87TetIz7arR%2BVH8AScf8dROq1npVX0UKFZOpr74QPAqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKq3MmpNX2YNjUxhByrcAzeLf4Pusp5ZQ969aOU24RyvFbQhY5XhmrWX80A1XwAdNY15DzW7Kzd9H1d3o%2BOk4%2FoV8bdVEl4Nmt3s6pdv6YuFf0QxQk2XahqDvEiiFzEkPSoRf4wxxoHzW5WuXaJ2a2IJp6C3W9NAg7qgMvEgDB7sWDXrXGcuyE%2Bh9%2ByyZYZPSe7gPNn9iKGh485aAt9RWpqzj0itNwvKnhnJporAOogkef6zpRAFqBZ%2FfPg522UwzGpEqcSODns7%2BUY0DotpgpQWHOP8foCtXrfqlOk3HfkG%2FYfUM9RcgoddfFzcyoA24tzDfRmARYHC9RAhdqZYQgm31AMw10nc7t%2F%2FpxivtnQJc20LsUvl5uSleJdISvkGBLw60u5rfFfq2IOatxWfMwwo1sta7QIAObOvL%2BH1oioM6lvsO27zFfpkoM1s0tY4xX%2B6Oemf1QFA1NvbS5Ds10HYM4JseA4CbshYG6Ce3VIO4f05sd0mKJJTwQNrXSaw4Bq48u7t8BKURe8X6boIx%2BkrmbICnXI8fJZJ1qn%2Fo2jbGeT1QzUVdG9OhhoNBE9uToUo%2B1Wii%2BnJjYqkBwHSrPt0LxW1VCXxT3RG%2FprWPg7AIqKs0NN6sQ6gI%2F1b14x3ai27Y35vftbjJpb4MJOUrs0GOqUB2BWwzB6w12uG5TPJGPtYrEgyCOgW6S2jH%2BBfyYs4wFn71JIgOrlOH%2FR6rwFfgNnQvqX2uJfZlY82E30Wbd%2FToKF6lJdHVQlu7jXTs3w6gLBnsNRD6yioZMedJVhA0POcMXmx4x%2FhJI%2FqiJDzeDmdh7FVSWz88wBgzKxdEWdoV9blKRnaCuyICGIxVqCwz5mKPP3nCSAKg%2Bd987EPoHj5TZYWIL%2BO&X-Amz-Signature=01e3727d334e14ce5c8e31f7fd306b381096f4f6b438d7163a24532aa62ce664&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 문맥 보존: 너무 타이트하게 자르지 않고 **주변 문맥을 포함하도록** 영역을 설정함
    - 경계 보정: 잘라낼 영역이 이미지 바깥으로 나간다면, **중심점을 이미지 안쪽으로 이동시켜서 검은 여백 없이 유효한 이미지 정보만 담기도록 조정함**
        - 가장 바깥 부분에 해당하는 영역인데, bbox가 크기보다 작아서 크기대로 자르려면 이미지 바깥으로 나가야하는 경
- 추론 시 2가지 모드로 작동함
    - with visual cot: cot 프롬프트를 추가하는 경우
    - without visual cot: 일반적인 mllm처럼 이미지와 질문만 입력해서 빠르게 답변 가능
- 학습
    - 1-stage: llava1.5처럼 visual encoder랑 llm은 freeze하고, image-text 캡션 데이터를 사용해서 projector만 학습
    - 2-stage: 모든 weight는 trainable / visual cot 데이터 사용함

## Experiments

- **Visual CoT benchmark**
    - 이미지 내의 특정 영역에 집중해야만 답을 할 수 있는 시나리오를 평가하기 위해서 어떻게 벤치마크를 구성했는가?
    - 데이터 구성
        - visual cot에서 사용한 5개 도메인의 12개 원본 데이터셋을 활용함
        - 이미 공식적인 train/val 분할이 있으면 그걸 사용함
        - 없으면 random하게 나눠서 벤치마크를 구성함
    - zero-shot 평가 설정
        - 모델의 범용적인 능력을 테스트하기 위함
        - SROIE, DUDE, Visual7w의 test split을 사용해서 zero shot 성능을 측정함
    - 평가 방법
        - chat gpt를 평가자로 사용
        - 모델의 답변과 정답을 주고, 의미가 얼마나 일치하는지를 판단해서 0부터 1까지의 점수를 매기도록 함
- **성능 평가**
    - VisCoT 모델, LLaVA-1.5, SPHINX

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRW4U72K%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024618Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCCTqtbcJRBxU1CgzQ4LF1UEoVbEKNOAGCmIw43A6m7NgIgHID61Lv3CXhTne83id6yy7BvRgAlwlq3MIBkPamDAbsqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJajNMFE5WD0N6P1hyrcA98YC8oJv4%2Fi7xQFnM7iVa7QQKRb4U86M9l9S%2BZSWWHp4xNsvjfEbP4KK%2F2tWoT5nXeVPtSAPhhCOj%2BczkNpfIa4lkjoGa4UuhYibE3uhBegI2%2BlewG3rWYb6ubamZe335PCQlyFL7ers0XVv%2BcEXi08XrSrpg7fzT0MJfqdT37sfyOdo2Dl1eCIeZ9DNFbSh934dQ5oJOJ7f1Bw1LD%2FSOMi07ktjgsRmesA1Ebolcu8jmv4fvqXQ7jAmIMgrESwYsb9p37Xqt%2BERRwCa428uysrU0O0NopJMwxT1zg8Z2z%2Fy3O8n37nAOO4Lx2gCHMhKAG6dMRw7ZcDFXiW%2F9Y0PSH7OhG3kdXEtz3pA%2FxVu7pumWmp6MI1jndzqbk4ullKiQuWiYHM7PytRXwX7%2FKIe6ayxnx5kfQUo2uJ7hI6gyrAYplrXfQdxRHOMAK44bRhODe8ULn1JEwhr%2F%2FSvgASbviMnqb93NIoMc4Qu1%2BPfvdVcGFV3ZlryMgdAIvv6lz9IcPkNIp0f%2BmeWWAwz%2B0Wda6HwCiGv4S754FgtmYZDYgDRTMGBW%2BGI4L7wHx97vzbxpD1hV7TnjspBETTi28ZXov6MV6RMK3vBeaIi6hRPevDDiRWOS7U7SY9XWMqMO6Urs0GOqUBPrIxt9fOKXYsZS%2FKtSVyNLV%2BorhuE93TtDJsQmVl%2BjuFW7IyojjjcVKgGTtsi1zxmKYhAI2Tlhc8Dwn4jpYajewd9q%2B58MAPhWDCimQQhCz3hREdrVJKLOoIqX81vDRHe5%2BLbrRvQprifjmpUTic8YMO7%2FVrFYg3LFyOjKtTlsbo%2BGe0yMFHGp73tvYeOlYI1oYUvxqGjy%2F9cgCPgQYcA4VW2Tjm&X-Amz-Signature=979a9fa5878402cd5ecc0841cfe4769ab4ae48eb7836d4fe82df63b16b8c1411&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZVSBMNWW%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJIMEYCIQDedvUz9Vv1lgFPTddcZLNQ8dX2gM%2FsfTUuesHBvchJLwIhAMVpjW4gVMiyd56gIpRtu6gbiGwvKGmWxFp9wccYUYCPKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx6gdZ0Bv5ImiNfR6sq3APORruqDNqwpFK1sylDn%2FgIa6FvaaZTIF80Fmd7gUCH874X8ipMIZm2dZZoIhZouxbmw%2FvdlDH2IqR2CadJ3cZRr%2BaRBNWAV0zc2uveJRaZL%2FH40%2FJ4rVASRSPtqV4IZH7gAq%2FMe4WV2tX0DiCROb04P2mUrvbmoCF8zgghMQLbPRKBCyQCQVKZrDW3hdBkMuAZsRkQ3LmgC5cTim9JkBnOtBYHCQg12OLM3%2Fe38nAXO2Yk5tkNxDWICspENF%2B3%2FajhxQ%2FoJhFEvQvcYUBcym9D6eQtpJe7xxt1lUyNX3H9d%2BzJ1ccXeZ1v8uElt%2BqCOftYZtDOJY6oL%2F%2BH7unOsBLjwhrV6rJVKJshrn8eJtqSOUSnnxoKeBMUhimQWrSbiP6S6pvUzU6PKyxvciMGuuuGliLjoNLDt6ndc1NeyKNP5WmZYqOktdd2%2FFFLThL2zOoQ%2BrWHJSf1mGjaeNR8Ds33r1EIkx4nocdy0vp4zEsY9nWKO5fVcdxZTAWFu9nEfGk3BmnFaCy7TuJT64IXrMyy14RV1Nnd25Fp8djzAhMrOS%2Bjm3jF3uzcqcGvjd%2BuRGhEldmCtIqTub4jwexzKcDeIzjVKkrTZm5oBEPjHOCR0HbfWhp3TnSY87upNjCqlK7NBjqkAabLDw2X0ZNroHnik6NZ3LBqR1qtQy0xYLYn2PcD6DRzC9TuKdJPcm4Nmp%2BbP%2BYfEHPJqxpwgqTIezbhHTq%2FLGTK3O6SJPWxTw9gb8MddHzjXPo6RX8l4RmmwJ5w4N17DJ8AEDmTJj5W93RFvRXMM4Jvc%2F%2BcPOR8SExNsW3E1HYGNAztVuWUp%2BzdrIKfdsdOxP5LcPXYFwsv1GwxLUMGdigSBX63&X-Amz-Signature=bd50033425f4bc6a59ec12d45ef481383be255de91d2597998fe3ac40da10ca6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2H2WHWG%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQC9230UWk%2FvPb%2BEwow2sXt3kpGSgRdyoUQV3Te8ffaKVgIgO5MkJA02X6Y92VlSo3LALbG%2BjxfPOf%2F8UM8SMHV97%2BcqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEIoXrRPOQqfPEVjBircA4sYr3fQQqNDbqbiY%2BQ9WKfflnoD5w9649xajh7gmo8H%2FveraAySjnhVuBm3yOG0qtWB4oLr%2FaW1YGJ6Dy1gVR65R476XlQIhF73GqShr5E%2B%2F%2Fw5h8%2FhVzHp1huJ37haBmSrx5Zbki29o3%2BNdcLOE%2FSIXrzr7BrCYpG%2FEBQ0ksKVzfWSqZJUm7EotqhTQ39o0OakDvvEE3CZ4la9ZLiRj9I7RFFX%2FSX%2FmiVjlUm2EtQWXDUoxNoRSXSWZQ1wxWNiRRckc1Rb6qTtfVhrqhumFnTsDXnReDDVqjuufYLADrzNOaBNcGKIuGBQyPgcLsnOnKad9LHSVXmbBmroyzW0rWqaCr5D8tJ%2BkD58jOEFE0rKtsbIIK4wNLOLAIKPc88QFRzHwqxGAoqSjWFgpuXxvSEv8DRqn3DYGXFKQXySUf1QHh5hAzmVPhgUyBa9T92ioEHH8zHb0HR4lBBZM3%2Bm%2BiapC7Bmwn4ju%2BfCY%2FYviKMuvF%2BG3qm%2F%2BolQw2VfLJ8WKTHc47xj9Z2vaBMvqK3Sw8AzNeSQF8J3MmeEeerKOckXB619BMUa1q%2FhG4muDGhqGZB9uSbWKQK4ieRG8N1mSpXIZbiurvsHrd32oJ0pkB00x8TT0xy4nXpKg4SbMLWTrs0GOqUB7pgx5irCi9mQNaee70ppljlro2o9wJTARlB4m2dt0GkIc1L65oYCk5BCyEcWkStjFZLii2seyFUV9HZGo6s6bRO0bX5tv%2Fi%2F73tyBRHoqchSD7FeZiWPK246zp%2BYX7vYQG%2Bm18VN0qUFYbfzmP16UxN8Wf%2FUD%2BmBdajwpbQ0%2Bb5QnT4iInf0ZqYwgW5UrYeWjZ6unhxhB77CmCWU9yCDMUD54n57&X-Amz-Signature=a567fcf78849178a9961d15fa1d02c02371124d5d3c3ba635a51373628224505&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667AEJ5UNY%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024626Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQCO%2BI1s6ue%2B23iMjTOjjg6sqc1dBqi5kAAbar%2B2%2Fz1SvAIgW2WS%2FZ7tJxx3ExasnFz7OT4zC4dIn%2BPKhaXbrFhD5koqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLvBSvC2WUrFYZlqVyrcAzvEDvOCzMWglQn1J%2FvwpzMBf0a6iV60%2FgF9c8TTnRhazx32G7f7TpL9Cu6MWrXzPDXQa7rBs6aj8KYF3nDmA7c1LNFSirfxCL5NTmTIhExFBJDirJ%2By83eiV8OCkd5z16ez8XHRWDiTb7Q6uIBwsSLmh5g9ucSd5hFOtGwGIMC6jTPZerVFX%2FlNYFTh0ojCrSffvj7N5tOYyOPVcwrHHBtm%2Fgz9fn54UNeRbCCjgkoYrDx%2BBFVRTYAf90NooZmN0iarUxZyssyLKhVCxzC6Ki1u%2BzfVJr7oR4i15s3xpVZHChyV%2FkBTmuv2l%2FIIx2fqYgHqmUS6di3l891mh6npniife7n8NkV5HzaCLB4PUAgN0ZXzp2cniuSUfrlI7hsly31Jxkp0De%2FJKZHCHhVa0tqRDLq3kbB09dePprsOJNJ7AU3GkEk0ReZ%2F8DM%2F4ZG5Vmz2un%2B%2BEhiAFzs2q4Okvk3C4KCVuP2pNbU3O2kXBr9MgqGPD%2BgdnWNo%2B6yfzVyWDyqHNJO4GGYEBpeVObbgj8s%2F8s9LM8jrQoWTnMRqS4i2S1CKSa%2BmB8SmYbR4kRK2jDcRIc63bGdZKreSAGfynK42%2BoX7TNi4Vr%2Fcnb%2FezG%2Fsbg6kX2vXnsVccrxPMJyUrs0GOqUB9fJ7eBBDqtORmFuyAVqUS30%2FvvolauIuvNeaezh9NSqbCYzEry%2BBUx2gV1KMjPt0MqJU2U9EQ5fCSaKsE28%2F21QJwsyN%2FxnJdYH00%2F65CgOdktVtmX43RJTT6C49%2BU9GdED6NWKWlMb4eTmwCTnaRhDe4qpXykKqdcs%2FQQwNoZ4V9jmiQJPnnA51hcP8LPKgzONgkrt6M664uZifRgIhxYsu38m1&X-Amz-Signature=e371aee7198bee9a45bc6860e806041e7d4e8f5e028be3c16ad7b72fba9740af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZVF2SN4%2F20260307%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260307T024557Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECoaCXVzLXdlc3QtMiJHMEUCIQDnJ8khpwuOO4li0jNYSEt2FHiSDBEOEW%2F2t9kgK68uMAIgbxuk3O%2F8gsNcTupryPeV5rVlXkzIjxknwWEBNSjJlm8qiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHW6dkVjdIym8Ms0CCrcA2YJm7LZEmKGEFZT0eWPutdxE5%2FoFuGuJ8eTFVGB0ODjt18S247MyY4compsD%2BAdRSl1YUR9lXoP%2B7xjTBj2aaiErrSwiW%2BtSAYacUBpK83K6%2FU1X8s4fCwB52xtkMecyfM1n3e4aRVv%2B0Z17y6bZL502oqeF5Dq2kK7cKHCtxvP6rb%2FZhNp0JAstAmbUVOo3M4sfJqgb8RUjKKw2cyuV9GzZDJHBEycD%2B8K0gvNAHWCOSxUFjE6MilwFGlwCCM9z8PpEupr9WdLqsUXlft%2FHlZMcvZ26OHFSuxxGPIc0pzQ9%2BCG0zo9d5uCVPG8eTVFJ2DMq81tt6zk%2FYJQ8VegqHuOeEKG0MvsDETYN8tT30M8jJKmLtMedwMFIiRgmGF%2FdNBJrOf5VDepkUjJq59%2FoVBvAKB73ZHqbs0s%2BeDd2o%2FYfI9W6BiKJBwugfQPNeF0cxPqUnkBLNsVv2g9SBOWLUMfe82oHFeDYi1WcRoCYrqpORV27d0Nl80Tbnjbmboin5NbURN00YveRhWwo8mk5qBiC8tqqek3o7GweeMW%2BZaF6%2FpfK78U0ZciXPaNSIZdZ0vAK8EJ35cJGsIEJOhFXQZXVbzHruqQwSsdl%2BSmn7F7aCGwieoXbMTJOEcwMLqUrs0GOqUBR15n0XP%2B4122qlscGC62ra2Yu0dNJmNZny5rdb7ibPaWoXARMTjsdxgumXVCycBXAh7y1QEuX7wBbSA6l16J019v7szvkfTZimrURUXSwkxgWlDgS8ya6QGJPf6ITLHXdDYPQvzLJJY1%2F2OLQpmUT8q3p4kkEXSE5zBJZzYijS5gB%2BirrEU7m5meI3IF9a0JsQxzblLTBUHBh%2FRy5UjYoA63cAos&X-Amz-Signature=d43bcf359d8ee6247527b259124d4f9612eb8b96d41853cc4fb902949f766e79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
