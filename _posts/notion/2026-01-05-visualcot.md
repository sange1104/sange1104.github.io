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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FR7JEFV%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDtAo2K1NNrZ2n23tw7Yea9q6xWrym9NI5HfkO0Wbf%2BiwIhAKh4NKb0g76hvzjgrqfrqHg%2B8BqjT6sIMsMCuo%2FIt1ofKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwFOOAtxhS1vEo6uy8q3ANkH%2BNelKZL84GAGw6DRf7RVjJWl%2FKgklu%2BRHFRnvI2kSk0ZOcvsxGYWIHSNsEBJX0Ckil9kueUWatXNkuFK8rVkSBv3F2gbCdBSdxc6z5xPC1pX4osOhbQrt7J2zHs34rgGdmZ3MO6C76VyQjqv2iDU5qZIkSHNlzAGlmukiYRYQzr0w0zw2S2YuCvTK1wE4TCF%2FrgbKsWeDjmMsBI4go3SQxvRcwHgrXoXtoYwuyOC4w1s3FLMnXQKyZDcUgeHCk50qSY1qmpZr%2FuItZIr4VyQF78Fqwqd37QWqYEqt08Ex0B1g4P0jMsE9qvMAlXPmfh%2FVdORgv8w4iNR52rZraqQnTJ77yjEkyKAwiFEXn9Oe5D3UHHtyo4CUJm0w8zstiMOPGLctqUPF%2F6NGzaLwR0xyOcS8WEsgiP%2FVoR0M62rvALWfN9e9sG8JXUe9w3%2BqO8E5KMGWJZX%2Fo8NPHtS9OY91Sy%2FgvBr2JpP5dnttKo1IhpD6iB%2FYxbkjHjMmM7IFiV%2BYjqzjKsbKD5486ckCyQc%2F4W71YnGeS2r8ahoPqhe4eVhrq4EKoVsegBYODLfuauFWseeag%2BEushBLM7FcUPfZ4MMe9kiAJDvbjh%2Brm8bqys8m98e4%2FO4F4AWjCRycDPBjqkAUYU0Zr7HDm0EW0LRS5%2F07r0ksfEpKuC%2F6fyt%2BIfeAquNzndLHYMgenkfZCK9xHG%2FtoTsddpCyFK9GEldcL4jbCe0SGn1FLDpCCbUAPKeOwoB4sdTqr%2Fwvg2WNVc3NgUBsdKnGororekVMevL2q1ezRsLJPTxigjXaiWX%2F3I7SNJ7qS3dsWuYhYsF6q4BQXA9Z8zkQhrrdx8GMTCYMdOsRDT6klK&X-Amz-Signature=6d1985adae97b9cfa15a66ddea4edfae161debf5e28d58e43fd7d8ad7e4f2d20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664FEQWX4%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIBdWGYXhECvbPR0G%2FBTlXyJ7li%2FkBajneCjQ%2BgJ3nm5zAiABK2z1jif8ap1nvP6n53W8WUDW4jK3JK0og79vmtNX7iqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM6d1p4ABndBClz9FoKtwDvewhIdhLo2%2FlJskltAkhEh5%2FjEs6VZJu60465IE581syg0rn%2FEBzg2Sa3BEVqK20K3CD9efmfWMcPBjcIsVuQwbW4TWdKUbFR%2BlGfIYwGwriVQt6RNex%2Ft4bgkhUIP1mkvqn9yEGGkSlw7GNIyCZ9JWpu9WihlGHITxen%2B2N6q3Citjn5%2FqcYCvysYx6vH6roN0hh7Q6Csnd6Y%2FlMFbl6TShnFZPHYGsuQkyPjA8xVP4AodWsNH0PjUAKJEoKxOXb8AnSkCVeyaXIiIoumuke%2BIc5NeNbUxpLSjYYTMBYImpgvcCZez5rc7j0c3Xvh%2BIOuf1IHnucZjxtbVzRwxBhF23FbE3X%2BopLMeD%2Bg%2FuUs6kkpiohg95Wz13EhHkCroyKu2AahFMRoE72zoHeBRbYe0Hq9bqd%2BQQpiH1CRcknAp46%2Bm1b%2FARspcj9I1kKoczUzHNtj3x1KJJK7j%2F6p2lx49PTbkWgxTkcV%2F2Jxjk8d95dqXDREeVFcZIS%2BmYUBVXByJPFyVUxGIuVz2hpwzOExSRmBCySLy0BZ%2BkMRDecJ9ujcPmoEzo72YXLC5SWCjZJuVUNxOBa7spL7izaVgnL0c3fm5XpgxOJkLdibC8lvYXNHDIvlg%2BWHs0ingwrcbAzwY6pgGMwbpER19P5yOyq07l9ZwcIGhRCM5RSWlOwVq5C37pAfgc%2Fg8IXtMmfHmwZV8TdXzdyiWRH1K83RJklKYNKwCO%2FUl%2FFVcX%2BA%2FhQS3tWOh7%2F5xEanayKkr6QBLI6r2vl%2BBFPkj7ofndqIM2%2Fhwax3hb9kwSUQH10oPvN0n077rB7V592N8xUwitnNN5ToyNJZeKkA1Tjbv19vj6X%2BEw4%2F%2BcnrUDc6WD&X-Amz-Signature=89c1829109bfdc92d402091ba7b056e336f0a2e4940723ddaa83063a70014e0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663H2IWD2Y%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQD5x8xk6hz7l0KPNuvvix8LvA8%2BTLKP0u1atVn7yYULFwIgAYuAqc19yZpzw5n0v8FxdX7qupL%2FdHFkDdnlMvRfUjcqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBt80E2jFvXPmIJJkyrcA5ynGOyIP45d2ZECIaMkIGO4z4oBtT%2BUoiQehsD8J6XmkYJ3pSO%2BaSmhpmjdVronZq59zTRytkSBrbrHMXMbA8Vcf2xa%2Fl3KICd4LsFCGRvvdip6a5q1MsqeRbHd2yuSJXJsdJ4B3YS6IOvKiCUgp5RTAPmMhe6PWzK%2FsJm%2Fe4Q26C2eJGO3Gd2tQ2Pb84G7MrNr%2Btprcad3TcDrZ%2BP1rR2b1cedLHt4%2F6o3FR2S7bW8G2oD2tGtCax0EBH0nYldFgGn82EHZ6nHLGA7m6AAi2pQ9P68EzCzl%2Bm28RjPVCy3%2FVlSGrGHkHydvqFzXxFczdyma0JnSPqT%2FaJGHXFEOoBwjnaMia73vwv9sAtRK91r6ZR3MJX1WqbMzo6lvePXQMlaHBKrm6R67mSWOqU%2F9ilZjLIPpbABFRNJ1x077gDWJuVoEneTw8CD%2BGk3aQGyZF6rkSFg%2BbiIEwBdWJdbBWBgKga5bhKXppTWLIkbny9HIBuRt8W6hsT%2FFODi4N7NFJ0uhHyrVfxoBlRpSyIREOecsjuY4vOgfc2POkflYRSPzUTYujvR7Mc5%2BdVgprhF8ewhXPk8D10xLHrr91ybBfCiKzVwYocAZ2JFkIJgFLce%2FujzXpvCnLwJ0dkYMKzHwM8GOqUBWlWNtifxPw6ZxxoPPxxJdDnW8iTFArEJzrWBdrib4QwfGd%2FGSV2evdmYkeks1oDplTd4KJeXDNoHFv29SkKUytx%2FRoD45u2UfsAyBgrB1qgeESlGXgiNwBx3ne77e04JcU6w3MkPF4h1io8olBgZpe4FCn%2FqGfyxS9u3mQH3PndDrNAl7KSo8hRok0%2BwNFnhEs9N9AMfMDOv9RC07soT650fnVfl&X-Amz-Signature=699071bf260d617bbc13559f9ad9f55ea3e5b8812ba05bb8f012e846cceea9ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663H2IWD2Y%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQD5x8xk6hz7l0KPNuvvix8LvA8%2BTLKP0u1atVn7yYULFwIgAYuAqc19yZpzw5n0v8FxdX7qupL%2FdHFkDdnlMvRfUjcqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBt80E2jFvXPmIJJkyrcA5ynGOyIP45d2ZECIaMkIGO4z4oBtT%2BUoiQehsD8J6XmkYJ3pSO%2BaSmhpmjdVronZq59zTRytkSBrbrHMXMbA8Vcf2xa%2Fl3KICd4LsFCGRvvdip6a5q1MsqeRbHd2yuSJXJsdJ4B3YS6IOvKiCUgp5RTAPmMhe6PWzK%2FsJm%2Fe4Q26C2eJGO3Gd2tQ2Pb84G7MrNr%2Btprcad3TcDrZ%2BP1rR2b1cedLHt4%2F6o3FR2S7bW8G2oD2tGtCax0EBH0nYldFgGn82EHZ6nHLGA7m6AAi2pQ9P68EzCzl%2Bm28RjPVCy3%2FVlSGrGHkHydvqFzXxFczdyma0JnSPqT%2FaJGHXFEOoBwjnaMia73vwv9sAtRK91r6ZR3MJX1WqbMzo6lvePXQMlaHBKrm6R67mSWOqU%2F9ilZjLIPpbABFRNJ1x077gDWJuVoEneTw8CD%2BGk3aQGyZF6rkSFg%2BbiIEwBdWJdbBWBgKga5bhKXppTWLIkbny9HIBuRt8W6hsT%2FFODi4N7NFJ0uhHyrVfxoBlRpSyIREOecsjuY4vOgfc2POkflYRSPzUTYujvR7Mc5%2BdVgprhF8ewhXPk8D10xLHrr91ybBfCiKzVwYocAZ2JFkIJgFLce%2FujzXpvCnLwJ0dkYMKzHwM8GOqUBWlWNtifxPw6ZxxoPPxxJdDnW8iTFArEJzrWBdrib4QwfGd%2FGSV2evdmYkeks1oDplTd4KJeXDNoHFv29SkKUytx%2FRoD45u2UfsAyBgrB1qgeESlGXgiNwBx3ne77e04JcU6w3MkPF4h1io8olBgZpe4FCn%2FqGfyxS9u3mQH3PndDrNAl7KSo8hRok0%2BwNFnhEs9N9AMfMDOv9RC07soT650fnVfl&X-Amz-Signature=04d25f6a0301c98a444f4f4fb2bb90f48149c016791ef61aa68e88819c6b466c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667S5YCT2A%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIG0PbzJb5YStSeteVqSpoPm7%2FthJwwECN5D2pZUB%2FJg1AiEAvZp23oMhJNf4jEL0WJ2%2FjamTwGPNdQpMlExNtesO6TEqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGF%2FKQXBYGnuHWqVIircA1AUoYPidUO%2FJjJQ81XIVVVUfFfPRCJUB%2FaH0maV%2FR8pGJ4kOWzxDBoaWTk6z7ddK4fbEH6jVHv%2FH%2BF2ol5Q4HU3GdT%2FnVQoWc0mcQ%2FUMstiahMEUMuBaQxX%2BKFtAx4PzW9foiL%2FFed9X%2Bo7Q0Nkc9W7lkFqPATP43CM%2BZ9j9T94wVM%2FSSkb2vYMrNOplkg5%2F4VJ%2BGyb%2BuI%2Fau6I4WdY8Wd98w%2BQUbSS%2BTK2RNzHRDrsOKBAjCnlk7x1DG6hdJQ1EsjeB6y1%2FbfaiZ4Ray3Toy3fhFTM9fH4%2ByiS000ng0ui6T9d7T8cVPucJrQHzi7CO03phX9CkhaAlcHv%2ByLuXs1BUJ%2BdRPhRd9FeLh52FNXTuCITa0ibnZ%2FkqkCu4%2FTe%2FJdDEu7gs370hML3ij6d2Q8VHd%2FsCK4Oid2Kfd46ynr45C9TuTfQgynbzBILO5Ie4%2FljQ6DfAhFAY44JyD%2B%2FRKug1Ypoi%2BZlfgKKnIoS3Q3OlLsb2BZM7E%2BwTt9T8ZJws5yuEimTLLQFRLGePebaXSFOEoC1QOQiUVJzq8cTDd7TyoOREGzGDX6BIZbxnysmBKPC52zZwxJ9VMWkmMB2S0dvATpJOpndkpsD%2BFo%2FMCXjb9FyhieyPUbTsmRfMODHwM8GOqUBRz1iIpzPQvEWZEJLmcEXn7dPQWyguvfZE2TtHnfqptPf9b08Id%2FOlanIVTnWgCpgA4UX%2FPO%2B5ntpMjGyhMVmo4Xq4OFxncRWC9gudfq2vhRyryu%2BfY2SoWcSmWqDGCIai%2BbwWeo6AAJZJX9FRMaTKOlcWE7hmuDkGBfXoKY%2F9Y6DHxP30ErVhhSqF2QNbhSzB3hC3NVDlQN8jddLCn0TY2vWlWl9&X-Amz-Signature=8ee4abb53076fa6dd66079231465a38132b82cca2a7b5c6d0c9ade341300db96&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TJHB4KFN%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040637Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCICa2XyE5v6N3knOE2JM9zy19SAnEk4%2FWm8o41A0CYugAAiEAxImTpeoV5v1IK5LaRun3LpGdspa%2BnXtRM7aHiOWZHvAqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAP%2BGkv340f7tR2PRSrcA4rNzMDLce5Tw9wiFPGv3OyhlkgybxfzLHXhIFef3sfAvZ%2BwWdvQmmnw6ylx%2BBLIGFB00Xbbrkm3v93o6vfM0GlOmQeM4gmQrU8UM3qM4fSChpx5KI6GMdknGzH%2F%2FQLVQ5nPAuCREzLVNguRfAzL%2FHcc42KSXOZxv%2BWHeS2XYwwXgGCjSpqKYWb6lGubDkKCmQlI9NjCvjJ06rpbXKtOAIKNalYCt6M4q30f1c%2Fe1YSHv4xI4LEl%2FfgcIViNhqNG3uBT4I%2BRvq%2FdIgqFgaj9m03NwwjRaW86uZh1LY%2FkV8YIuvPkyvSA%2FR2cztLlE%2B9UMERpYKekvWLA7D5SedXtReC0BWd2y6cV5ecwaMGEQuOGxBg919zlBVxSmCGco%2B%2B1H4KPKK7vTJru%2Feg5OzBWxkDmLHilDM50ojVzSmi5lF%2F1xn5c4pF3Iwd8kgaYWipOZGehMlRzop1kUba9uk1Tx1OAYMzxElPmYm4fKikwvqsvvqUrqWcpsDC5V9rVS01RdhvzTVaYJWYsQl1mytwigrS%2F8W8FkzRpHIpqtfnKNeI1RjBN%2BVGXHA4cLkPgD9heCN%2FyLMTOfa49lGyEYSgd%2FfYKk86b6u6QHMmEr0aChvvIbcIKsfdXsbtwrtdmMOXGwM8GOqUBAjp8Hd8xHICMdpuwBwXTud9LurP8uk7FXDKn%2F%2BRLtD%2B9kuzG39D8UWHUtJZEpikxWN37lXHQ3aH%2FP4m2s0lm4dAQNanvX47p3JksYe1UAsViQwkUVbi3Xpj3WD320SmM1TlRL2iqWutm2divuT54a3uf3KzQga%2BytcoHcjvaGV%2BGuoSU2LaVMlsazWHhlC827i%2B0RQOJYI75IefI66z1TxsO1CeC&X-Amz-Signature=8d9087e703f950554bdfbdd5d89a3ae09cac49849ccfa6666b9abf4eb28950b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RHXMP2KR%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040637Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDeI2PKnGXq1IQDXM4jq3%2Fc2SOEByiOOvYxdowW0b4TrQIhAPV%2BO5NyLB2r%2FJbNxoFsyDPzk5WcM9ul4t6Hl0TUATDkKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igwkh7Uh2YUF%2BlE9L5cq3ANJHH3bRDDa2tztkTI1QABGFrdmSn1zXsXENgie%2BKSNP7bveO%2B65eoIfOj5exIVVlIMnKPJUfHDE%2FLjM2mUOZylVud3QTELEyspwnF1%2F6cCHeaQFbDxJhmuIyGOnMPItcZRBrEZ4LlmlCw00MAtg9f7shSBJyytkvNJUpyIdUiWyVYFRaWqwFAdKTknMoWfOi6Nd04hngp%2BQ3iOvhqintSZYQQ0pPHNr983a2Zz9wHHM38tTZDld8AKLuKKqonqTzrM4MUpTOjqrezlDAuIKrkDlOneWXjhiIvKOpXImlrHvZhrJ5CojNeA1I9x4njiC%2FG8rbuJQ9IOBpyl0d5G%2F1o43RLw9uW17YuAGrXVGgX1fr0qRNY7sDvcxLn745XGn%2BgtQq1jrRw1MGSqJ%2FpmuUjs72wutRiB%2FAm4KrrjXx4i1wphxIY1A%2BA9GTaCdr2tFQGorPwtoM0Wp%2FtyGnoJlKKpvD2ln%2BF7z%2F6sZxKBlI33F6mZ6uJokiehzgnf5XsFXorFzcRqnKHdG5hA%2B5HHVTGH7xqUwImjPomVYs8HaX21C%2BbldPx7dGhc1Qwq1ysuiaRhOhudpcfe9XslpRpvjEkKSiF%2B2Bei1Q19q%2BNtlt2iROLOjVidmd8Qri%2BwXTCGyMDPBjqkAWPH0uBn461r7d4zmCGdzr3vTk1ElAjijW6mjKFiHdurg5dowJXPRAvOYUYH7Ek%2FUhcL%2BnwPZ5DbpLKAWLJbH9t02%2FkZ%2F9yb3bIF0K6yrjcfTbOaxJaqNMDYgkbm9i3k2gaW0gaMaOeZtDDvv9orlRiLPbvjF05Lq7aUB6oh0gc7QQK3phnID5Uk6EZuW508vsVVNf8EqELlK2emem0lZ7sNG78G&X-Amz-Signature=f344d112b4d68388097a51e0fe45dc989929725db12ce1791c7d0d4e692c3c14&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XBNOJRLV%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040637Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIH92on9L3ZwIaURg14y73iY6o8XXhAfeS9wyjt%2BoBfaGAiEAmYEhXr0hVe1VObe3v2e6zX1h0Bjq7OZTVX8PV3piinQqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMXQrhCKJSr9oZkbwircAyFmeHKZoCjjXwbgNkUUJpCss2P2dnttcJcW%2BMwplLumbTZahuRwyFuGyl4mf7KxbpfJTxJpu2EuP8Ue9ZAquS%2FBldvP6M8KzYWvENtM%2FQ2y2phKHzYvHg%2BVTGZ3DsJRm9AcRJBbWdZ9HCFlfkpEhc0xUJLJ%2B%2BH41DJERJUmYHbm5OTflh4rn1hB4u%2FMqZwpTfSLN2SIIMqG8H71qzz8isC6QmhWTwtHcB1gIdOyXIW8OWZ0vdclpDIFdwXqtrkCTk9FCW1nXOSjD0x3WjwqhHerz47Or%2FQ%2FcLmRMFriv4FtIERiZL%2FN3QHNszdTJ9feFJNXT5JI0w9iINZrKA8m35v%2Bf52JYJObtbV4H6TMGsg9RaSXnxj1Rn7K6B01sQiNJKOYd%2Fln25rnv8DiD1mcy%2BHNM2G8X7ratvAv%2BuF8NCWNBm%2BS7eidTfXtwGYHmlLiPWWOPJVv%2FJqcWhqlfuR0stXsXbdj43HA425U7AF4ro83XStmEjvowpprOcYM%2Bj9zVvwb0a1%2Fm4YBLBgEJDvNFl55363eO1nRNAkDntt2jlsFqjpmHk7l3839QllpeZJ7QkMu3dMDy23f3wYovDZC%2F8ttVSBsGS0ehXmWjytrChFHjO03%2BO1ot4sNlAyxMJzIwM8GOqUBNpV2BnHXOeGnfFVWVQTX5fSlbDn1MrE4Avc97AaQIwqnWQnu8s2Ajeb7I2w07oN6Yh8Fx7ph8TTJOizfGNr2jRT3ErCeDAK8tSwupyIt7lpDPp4CyVPqd31Nt%2Bcid6QKY8Y9CjX2jc15Zk1Dvq9Oak8LWmVRrnBulYuJtxA7pQpA2b%2FShJAh737DPt2Ofq6CBQ0WfKP5xWkiSX7K3GGUpwoL8H3x&X-Amz-Signature=3d02d04831ef6bf992278cc81ba25a1ed29819585688f71441e75ab2ba593922&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5TMKETE%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040638Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAwaCXVzLXdlc3QtMiJHMEUCIHtBKWSXUmbYnMMOIGGxYCUXIz4MnfGbBw0juH%2FuN%2FeAAiEAjABpjyFP9VLUSXYi2oPMduv1VMtHsP6mTh2oICg3LaMqiAQI1f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCWI9EwuGSGiPaEFsircA%2FWpUfkZYFvpSTGFsC9Zd7f7U0RViOnNxOHVmE5C63n8jsbwd4z%2BxHtlBu1Yni117ZvQkOvBzAFqDZxHP1NrC1vSP274hlWYKLJnXGmr%2BkUL2oscjQXU7LSPWDuJNv1y9vlgZAN0iS55VukjlJ2o98v90x0KvVeS6DnouT9%2FW3gSPSKD3Mg4rVVoNBTouDZhlUYEQ%2BsLPUZ6npae44EL9wRsASDvt9yg1Yxu37t%2BAfwSzFygnYBTiS4a1Fv3QHeM%2BLewdrcp0rcSg74GMkS2gm6bG%2B7Wikv67OmO8sUT1ejFeLlUwDE1VR489Jr7M6lXMWF9iDEhuwm5hdIiRcirlPT%2FloVAAjvLqz2YRTP7boEctkGgu8RCSDA02CZjHfEzianM6W0DJ8yW7do%2F%2F5ibXkdJTAimEMiEX%2BRHoCotUO66BxF3NW%2BAVXCyAVoV43uzKvIfbKUQmFAOcTWVUl6DzuZYqs%2BWfWdbnawzsQiEwlHoIFJxCSOvnduvNOJ8aVnNRleMkOjKKgB6di1UOBiEjuL7mnbrf4PBrNaWmj0zYQQlMl7HMpUiw88CW57oYe8K%2FjSx9M%2BqZwkiDwAcGYzXfl2%2BWb1AZtg3t%2FEKRWWCN9hIZFYTJQkeKXmBmn%2FOMI%2FXwM8GOqUBIBXPJXPjJkGMMq2C5gz2vSGTThdowFmJEZqX9WMVj47qw5%2FvrziLPye2z7Hkta7n2ssik44o028uuPQxSRd3CCDUo1PBwyqCepyOcSJ4SU98WLbUGna3h0NGvSD%2BEkZ9e0pbF68HNyhCVRlmDyazGnQRlt5YU88fWJAgcSI%2FFKwk6juLYugP7B2MXn8EEL78qXDAXUj2WqXVJjwppqMqSOxMiflp&X-Amz-Signature=de768b154747c9cc529b2a5ab582cea55e1c490056e30a5b254f7a0788278835&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663H2IWD2Y%2F20260428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260428T040615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQD5x8xk6hz7l0KPNuvvix8LvA8%2BTLKP0u1atVn7yYULFwIgAYuAqc19yZpzw5n0v8FxdX7qupL%2FdHFkDdnlMvRfUjcqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBt80E2jFvXPmIJJkyrcA5ynGOyIP45d2ZECIaMkIGO4z4oBtT%2BUoiQehsD8J6XmkYJ3pSO%2BaSmhpmjdVronZq59zTRytkSBrbrHMXMbA8Vcf2xa%2Fl3KICd4LsFCGRvvdip6a5q1MsqeRbHd2yuSJXJsdJ4B3YS6IOvKiCUgp5RTAPmMhe6PWzK%2FsJm%2Fe4Q26C2eJGO3Gd2tQ2Pb84G7MrNr%2Btprcad3TcDrZ%2BP1rR2b1cedLHt4%2F6o3FR2S7bW8G2oD2tGtCax0EBH0nYldFgGn82EHZ6nHLGA7m6AAi2pQ9P68EzCzl%2Bm28RjPVCy3%2FVlSGrGHkHydvqFzXxFczdyma0JnSPqT%2FaJGHXFEOoBwjnaMia73vwv9sAtRK91r6ZR3MJX1WqbMzo6lvePXQMlaHBKrm6R67mSWOqU%2F9ilZjLIPpbABFRNJ1x077gDWJuVoEneTw8CD%2BGk3aQGyZF6rkSFg%2BbiIEwBdWJdbBWBgKga5bhKXppTWLIkbny9HIBuRt8W6hsT%2FFODi4N7NFJ0uhHyrVfxoBlRpSyIREOecsjuY4vOgfc2POkflYRSPzUTYujvR7Mc5%2BdVgprhF8ewhXPk8D10xLHrr91ybBfCiKzVwYocAZ2JFkIJgFLce%2FujzXpvCnLwJ0dkYMKzHwM8GOqUBWlWNtifxPw6ZxxoPPxxJdDnW8iTFArEJzrWBdrib4QwfGd%2FGSV2evdmYkeks1oDplTd4KJeXDNoHFv29SkKUytx%2FRoD45u2UfsAyBgrB1qgeESlGXgiNwBx3ne77e04JcU6w3MkPF4h1io8olBgZpe4FCn%2FqGfyxS9u3mQH3PndDrNAl7KSo8hRok0%2BwNFnhEs9N9AMfMDOv9RC07soT650fnVfl&X-Amz-Signature=138ecc6ec20e1b15b79ba2df6ebc94b01fa610faab41656dadf0715d3c7a59dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
