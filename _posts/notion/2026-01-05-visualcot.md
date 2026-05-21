---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [paper-review, vision-language]
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XP7U6SKO%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIBeCo6SulE75TY%2FezUH2u6LXjWwK3se6MEgvDf%2BYBLGlAiEAkD7PwrHOMGz9u9qy9whxM4bJfqlU7JaSUxeqsg0bRnMqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDErujXONU0QZ2tKLxCrcA%2F83RplrtST5UoZ6MHKmJqrmbFzLpRb5%2F8SZ2YjFRYglTGk%2F6R3Dw11xU5d0RLhn7RZqPA32Snw5RdwOGKv8EjPALbYQiPUA9wtvifmO2JN1QBfBW1oF1LOy%2F9TKDVmNGoh6ZcchrEbRkI9Yuw5LFh1kltmPdb3Z%2FFThGNyYU0SBgWaO3tSfuTJ8Am%2FBp3ULYopHRKZGX11gPXElN7%2FCUkiQiSF11b64z5yZe%2Bypfk3VWhw2RdrIssnWU4SFCqFsDP7xMAlI12Rz7Wc%2FqBBwieKOlyLYi5vh8R%2BK5X4YQ5t0mjuSFVRj0B%2FEcxRUepP%2FaosiMdrobDf2MdY3rKsnuOMguRJ%2BO6E7mXxzs%2FuiZzyH16%2F%2FWZx75LI6DuDUxzCHItL9EeY1Vy%2FTmw4P1nrSi2q8p72Ol14pvSww8voDPenoBGZMa8lSVKbawpiO3gv0hLXUDQUJ4QpnmhyegRXOXyoIfPtUd8WtWA6xowmFzfPzklDbEYA2bGKZKbv2MafJaFVHJq7mtCDo3wbaEDwOJ5YJZsxP%2BYBCYvvIE7C%2FsVnC%2BCo4sAfaZZtO1IEDj4lrSQQTR1RoPo4PORTmDuO2oTrQUI%2FJtt4pKNQ6%2FXuFwTbjMUyrY9GR86LhQaEsMKfoudAGOqUB4FqFkCEnmP1VN5wltdNZdxkDn9T6ou%2B61YpcfYMup6Pu%2FwOleJumreES5EknQK3F6lSFvrYyXXeXR5hvdMQXt76qZV15z3z%2Br%2BYceO53pdZts1w2bR7bWKUCzdtJXx0sxRicFAZw%2B0o9j5CsRZQBLUCHAV3nSM5jDPe43x3rOkDjMHNiZ2WZjp3vPmuIKdPSfl%2BCSrNBI38B4wSvfn3iXTtP5lA%2B&X-Amz-Signature=1e4d177f0ef35d8622f98f53098bfc2a93796b8b6a698d59620ad3ce131e58f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667QUZ74HZ%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQDD4vbVxAQjzR3uncut%2FgxqUPGHYGXs1PZNwl%2BTMpKilgIgDNbZwmGrt4SJJiy%2BI8%2BoWY2gyx6Q6Ae4PY9i72LstjgqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCYHlg51IvxDCGt%2FkSrcA8kRdd4QWy9V27qVKbqjNOLd6CfTpQ2fd%2FyNZFUrhbvLS%2By5ZR%2BBj5s6U%2F0k7QeD6HX4WFoWCcklDnqqIiHnSQAbRzsSmpUCHmhczNm%2BKLHp4XXddsQFubWDrnX%2F4i3GG9QvQfeIew%2BGcxOR08TGeKX7H21cJeX1aC0%2FS9kNS7EgNGMarYVGNvy3MMvIFe%2FHytF19wJ%2Fgzy%2B082AehJJ1d%2F%2B1h8gdNGzMb41LqzYV%2FFx8%2FxnTZuCKapTeOiRa06sv5nxvy7TM6GwnEziEvWF0MBKmp8HsAM9PyOTF4nGtJ2Xot73aUw7PWa0dPl63TQkQ%2Bgxo7YDNrzXdVEGfgPBLNEQ8wkPWRXmZNsqQXCh5qSc3sLYeF7gflRf3A1bvFo%2F%2Bz%2B3UMlvXNxrLsRfnGINH1Eu0X9IwyRLeRS9siBOKOmGJHWUP7HuzauErK5mWKLW2qJUMpw7PShRy5SJCLdbV0JTwP3mYymHjiAWjA%2BByc4o5G8NjkRnz0tjtnYHrcE6YtKE9w8%2FLvOa9rU0t%2BPj4ZOSAdo96dljphsgET7s2O%2FibKOgYXrr%2F1P0mf%2FcY4U7dQGxlzjWdOUpOETMi8Kl5OvV28ptr4ArDur5PcMOcIxKdzNbVOwA2CrPqHypMMniudAGOqUBbjX2xThinO7oZmxQwvePpKHGxWX3dQGAmAXsg3LMkq%2BTFrj%2FgqdWraQ6t3I6x6lQb2tb88tlLlgHjzGdUgtnX6AVV4qbRyyLo9QXwNd9%2F0JEJP6n0ReUyyrbVcjfZhBeSUatSptvAE106qulWBamCF3b3%2BOkPvKcSRWc8ppVdB84t11NYPuFxdnbwvVGRwJZuZLpVYxm0Az%2F%2B56BIZzTrpX6cYqY&X-Amz-Signature=1fa9fc8cee27655cdc190ef2e6c94bd4bd85cfa5bee1f4210deb7542812e9abb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X24MOVRB%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDUaCXVzLXdlc3QtMiJGMEQCIEeNF47ad0TSdXcQyfAOG8FvqlLjXGLO32BhnVbHq4JVAiAJyOP7gN81EZsMYgEdde9LjiyTkLUS4EOgII997kLaGCqIBAj9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMTxDiX44MC%2B1q%2FmK6KtwDtH7Rxi%2B07Ea0n05U5ZLI%2F3GhWufXO9cvpWl%2F9c4MS9MynXmZER446VUZCMsdSM5V6s7%2BN2t4NWC7UQ0KncQ1OXegYB8fbBTgQKD0MiRzirp6epV1y89OToYO%2B%2Bspo%2BNuBsfapYyGrSmmB1pCN16i5C1JYkYFlddng5YdPYnHcU2s1a6CII%2B4V3%2F7q9eak7tAs8gpJmMF3FlQE4Mf3qexEpGhp0XBCQGeL60ccVxZaKfruJLATjXGf129s%2FfxE8B%2Bf5LTMyJHzZ%2BnKv5qGnTwpQ9KY27WWTt9bysNAjRBDz4o298uJ%2Br6Tr00OY%2F4OsVHZzXSO1qJVzVcS1Tq5kcJN9kF63cglXXsu%2BWBPwrfqUfM0k1mrS8dQZgSqxNRCN9EXxw6nt9P6OaK7WTbp%2BdmnFAnwXzSWpGcvbrpo8pxa3OU0Bp1l02nM%2F9AqQL%2FRNSH7Gpw9v%2FI8mg36kJuP5dBrBQRN3gGS6vLAdVU7aHLE9Rnk%2FJnGmvwQXCtQQAV6Kk7Xm%2FfHRyY%2BvAbeMNEBS5acffYfeCHJOXY8vDf8mC51ZImaXmWyopkRkUsIx8EdEYQ50%2BFYiOO0PRzlmbU5bpVYZTqmy922bI8XYO6asLEpmp9e%2BtGaoa4F9%2FVQIgwvZS60AY6pgF0FBawsVZbjW7lK%2F9JBNiqVbt0JAR6sMSUn9mTicEP9FOrfRhd951SX99C5jMv2UVQiofUx4lTPud5O03JJgm079cWLsNjDZ4KUWG62Esqx%2BOUsLCujna1kk4rokr0pLF45av4NeCx%2FFYE4hTe0uRvwW1hNvbr1hy0U%2Bs0%2BW668xOT5qVTlJ1l0NVN4HmeUdYJYvorgRb06J8Lf%2BzTDnznQVJ2lNXD&X-Amz-Signature=f06741ca9057046e9c28a785a0de212dbe0440586f1c020ba75cb8eedc08973e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X24MOVRB%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDUaCXVzLXdlc3QtMiJGMEQCIEeNF47ad0TSdXcQyfAOG8FvqlLjXGLO32BhnVbHq4JVAiAJyOP7gN81EZsMYgEdde9LjiyTkLUS4EOgII997kLaGCqIBAj9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMTxDiX44MC%2B1q%2FmK6KtwDtH7Rxi%2B07Ea0n05U5ZLI%2F3GhWufXO9cvpWl%2F9c4MS9MynXmZER446VUZCMsdSM5V6s7%2BN2t4NWC7UQ0KncQ1OXegYB8fbBTgQKD0MiRzirp6epV1y89OToYO%2B%2Bspo%2BNuBsfapYyGrSmmB1pCN16i5C1JYkYFlddng5YdPYnHcU2s1a6CII%2B4V3%2F7q9eak7tAs8gpJmMF3FlQE4Mf3qexEpGhp0XBCQGeL60ccVxZaKfruJLATjXGf129s%2FfxE8B%2Bf5LTMyJHzZ%2BnKv5qGnTwpQ9KY27WWTt9bysNAjRBDz4o298uJ%2Br6Tr00OY%2F4OsVHZzXSO1qJVzVcS1Tq5kcJN9kF63cglXXsu%2BWBPwrfqUfM0k1mrS8dQZgSqxNRCN9EXxw6nt9P6OaK7WTbp%2BdmnFAnwXzSWpGcvbrpo8pxa3OU0Bp1l02nM%2F9AqQL%2FRNSH7Gpw9v%2FI8mg36kJuP5dBrBQRN3gGS6vLAdVU7aHLE9Rnk%2FJnGmvwQXCtQQAV6Kk7Xm%2FfHRyY%2BvAbeMNEBS5acffYfeCHJOXY8vDf8mC51ZImaXmWyopkRkUsIx8EdEYQ50%2BFYiOO0PRzlmbU5bpVYZTqmy922bI8XYO6asLEpmp9e%2BtGaoa4F9%2FVQIgwvZS60AY6pgF0FBawsVZbjW7lK%2F9JBNiqVbt0JAR6sMSUn9mTicEP9FOrfRhd951SX99C5jMv2UVQiofUx4lTPud5O03JJgm079cWLsNjDZ4KUWG62Esqx%2BOUsLCujna1kk4rokr0pLF45av4NeCx%2FFYE4hTe0uRvwW1hNvbr1hy0U%2Bs0%2BW668xOT5qVTlJ1l0NVN4HmeUdYJYvorgRb06J8Lf%2BzTDnznQVJ2lNXD&X-Amz-Signature=de8fc7862c8525336cdd07357b334685f19588a2143fa7efb744adb3aaa4b63a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXNO22GW%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044613Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIEQQzlWTrbKFvm%2BveQlxCS5Wpvt0t%2BH0BZ3Xi4tLidD8AiA%2F0Dw17XvINn39ntwK9%2BUqardW4ESKw5H%2F2ISHPU4%2FFyqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMAR3sB8X473ggDehNKtwD%2Bw0PGQgGbbYl3TQLJqCbo0URXE2wmCD9iAPNe61wJf3JEZGQYXVxrQZ38uVru7RvjOWlgt110IRH68Ate5BDA1Am36yr4lqgh3EiF%2BlWrBLsni9rdBv302pS2oQA%2FpQModS3GAJu7HXLsk5%2FQvR2RCaJVjkj6Js2ubGzaiUXx7h4k%2BKHnRuyJULyROw4soTDi4iOgw9noddHmrniYb7O8Wc%2FKtkmyR6KNhBEdlOfrorG6uX8UscV36KMMcuV8sGwu6l9CNzoP3JOneuPGxanvzM23wQ5lyUaJ%2Bfjj9alIhrR7PAtZtFPgrhPZk4fJRI0pUvYqiExYNENfT%2F1DDTpLDiEbUW8nP1D4%2B89RglqqPfCz2ElgWNoY0eZdYlUiwrYJBA9uMVMo519LVq5a9y%2BLf3pVQ1h67BVICavIs1nSmJ97JoZV7YDPdhIHZLGH%2FSP4BYBS75hleiNcE0i7fJyU5H7BggT5ht1TKbViSebEUz71ii9KnspvkQm810LEpU8rhTYW%2FD3fCSTqXZSYaKTgw4lacHbmkN9V7CzJz20bozPm%2FfLpEWEDWNh8yTMKqqLkE29Jr2VNyAz7JNrSsX7VZoCTZ9p0R%2Fcdw4NAbp5lEnBTypzBG2I6uZQEdYw%2B%2BK50AY6pgEjtYGLIYEhJTdviJb2mYjZIZvujEpBJdZ6uHDDdI3E%2BcAtL4Iyu9%2Bvv%2BFvzxUftmN%2F58slH4hSbDlvk9z8P52H4dlap2B2F8VpTPD5bH9VSr2C3PMEuJqNvk%2BgAJ3Ku80znXbcjh71zdx9AY5nm4jK0sbQThuxLLJrHPtKMCNp%2FF5r1Q1TLEnuQdCl2k5po44D0dOOIl7%2BpeEiLuX7au7k3Ynp%2B2mE&X-Amz-Signature=24ba009ccb14c5c0da329d72fb60155aad4220f719462f9d50f4676f128f4e1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XP4C6R4E%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044614Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJIMEYCIQCyS39TElOP4B14Tx4MqrDH510%2Fjc3zyZ59mvpGNp0NDQIhAJ%2Fb7BQbD7EvRIaSXiFkEcf5%2BAKu9bhaUmMkj2vxOxetKogECPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwFplwrHbRACekDZ6sq3AMwtBEJ873HPEhpLch3n49Zs8mc2OtRbM7uKXSNSQCh8WiXtNfv6dJMpSK0R7XhxW5maMgYGoTV1Fn2z3eTFuNbZOIaJ2PzIEOVQhkA8s%2F819RmW3zCzTqrB9xhyzcWgbdaEI7GVW%2B%2BNd%2FO9TINyxllYvRI3MDnqpjI%2BRTyPRjTUlVUfxTIh416tRCCB56WnfGKFFAacoHlVfT17teqyEPNNChdHinHaosw5qVJ398UM0YWrf2UP7OIEIq%2Bhpl6h2yLdKcLxBCa0yJxx7latwWHCLsHw%2B8v7Sa2qlH7DvfViYDjma2dsrjjJD%2Fu%2FWBaKRcFo0P8%2Bo9aHY2S1UclPhI42o4hKxeOwox9isej3YWCaVuDyp71Fml%2BNv35Fh7P2sLQUwUv3xftP%2FlIlfh7AqbGqKhKGXCluFCwYUUSJezDANJninEF5a8pmlVbeS2AVXmv25b6eONt0y4Km1FdbRiTumeqkmRfGj4YOLajqsI6TUxYE6K4VSwqQ%2Fmq6%2BMxccnou6bw9k4T5CFVP%2BATfoB0bgGIkCbjYUA4J7rL87fgzS0p0HffNF9xRC1xfoDIbO%2B2vFXcP2nl97%2FvXv4RQSHX4oA5N6yvpMQLEBUj8BxabkLKilxYTNrzqP92FTC647nQBjqkATy8MGb330TnAudyThlVFVCnFkY3U9U1Jpit4qOHvgY681axML%2FEQZr5NMVE5PhRfL4hFwrovYy0hIMydalxaKCATtFFQ3%2Bf9YlS4WIbUNjkI6odjjhUge%2B2gIupQhjaYNyI4kTn%2FuUqnFGVFO6qSoI3zK1XwdIjxaLmhnVkW1zpB6kqL3yjK2zcmqFX5lGczQacmmHjw2gpaQfmiHzHVz2SZS4x&X-Amz-Signature=e00920e2208d82b4d84f6d1eea7cf853ba53184622d01642cf0ef8051015d67d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TN2IRGEJ%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIA%2FUNXJzdujrMhDVYN%2F3Fj8D05BK2BomGn6OJszcqnQ0AiAsmpVz2%2FDz4g3WQqdAfrBsVmkcFfn7tLjCtT4EOHkXfiqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM1SOLnEuiWRgmnPVZKtwD8DFJB71xDK9gQ59L%2BouDwCRSfqeWpxbJcaIhEX0blHGongE6uVPrsSm2L6eX%2FPoySVvdscS5yMFcfoqbjCVBlUkTQ%2F%2Bvt%2BfC%2B72cLwDqVEzadIXCqABAQ%2FM012hCa8iKQynGdOu1trQSh1Hjmv3ptLoo4G6Ux68Xlvfz2gwFWYtKCxPa3tx%2FyP1HJSZtPe%2BchIS6a1HYewyxUaU1mdzgKTD1A7qY9Dy%2BlPuWg5MjGO8U9upZ8KtfimxbbFMiqkYkE3Tqpl7auxiMuV2pia%2FbdFc4RMamX0uiGXkeyPHB2if%2Bl%2BkPaSKBETCCO5OtHTrT10m8t%2BieBqy1iKhDM%2Fwx5nLUIfo%2Bfly5qDLGboBQulqYR%2Buf9UedinBTL2vZWSi3bg62FeRYJmB6f%2F%2FHrNqu%2BOvXXW3CyCWY%2FWe3Ljm3kSsK9j07t%2F0iYRXVJJNVbUlXm%2FQM2%2BFGh0y8bLj27Dfndztjh2IzL545FW0mtO5FCzKvw%2FdFoWLAWnvRfY8%2FLWKTxM%2BWz8d1seN0%2F16AB%2BdEQ%2FvlCLN4Pr8kFTOfVbvWTbTsdTvrbPrbZe8TuJgeg0penS9LIeg9BpQm6twb4aCoUZb2V8SOSwudlXY3thtZzJLfd64EsqRXD5jDmMAwzuO50AY6pgEi7GfI4L8KopAJDvDD4bvBVtyFDsd07Oy0uZVWU5rlKcZ0cq2QsbtQvu7UndT8hurnk4mFBJSwzGoH%2ByxdoO5MqZYQvZiKoZFuQEg3%2FDmUhwEFBzbVILSpjmI7STX44Xqw3oIqr3n07KOY%2BRYr1A0n2g3SV6a3yGSTFbszqOztbrKxEei5pk%2BOrtUPGbzN8B2C%2FUT5KrR50LxPI%2BMGsCahHNteE8nB&X-Amz-Signature=2788dd9e31e43ea13f5b16c45efa2bf7bcb91a0cd2318b04ace2fbe93afa35f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q7OKNPVM%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCICME7L%2BYTcJJAj%2ByzzscWse%2Bf%2FlUOxtWzmn41WEp3eqfAiAo5CrW1FXuBUkhVn0Zd7cqrI0KoZrDNwS%2FL45ckYDHhyqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMigI2NRcvMAr6rKwXKtwDv0s6HRM0AxsSQjY8FBxaSpfcqYqRU%2FwCROsB77j2LtHrKie7juR%2FYA6tNczhfPlRm4ur2y6Oqe3V7K5xphU3CI9LEifCkAgcuQt738Z6iMzR7XH6TN1uIJgfxvXknvVGefzGpyWGFEJQv%2BJmC%2BdQxI7ZCqKC4qBg%2BgUmKte1N8cAcWTAadplyI6K4Ur6MyJMIA42KwtoN7YwApv1oV1oaARMbMMULTAYSSnPznr3vlzYSV84VIpeg5bu40gNOdv%2B6MhQ7CA0hIgtj3egu59BUhIvAUV0sgFy0SUNUekHf61R4FZMLH6Pr9jUNIbYAcdFjo4gSxZ8tjFTo0Yq2wvgFQP%2FKbFAOrL3jhkwpQUXp3xFTnPa9ife5nTr1wegwyy%2F3whBPfhwNDNmU8eQcbpJd8iDckOo96HEkkvIViZm%2F%2BX%2B5%2BxsCJ4oNukglu8PsjRxvUb6hd8WK5pc1IzRWJsitzV8%2B2YM2f1wtlHsU923oa6ks4kgBNxi59bjne12KoC%2F11goiuxgEbEB1LMqxsc6DYLqjamL4F9uOtv9tsahcks8VaANTfDhi3dtwZzizlxYBAUai3BgxMWHARU%2F%2BHbbFqXzr7XRKNZusoNBBa8aD15MPhiuXgz18E77wrYwluS50AY6pgEE4LJR%2FnqNd2yCtiex3oGWLo2ZT%2FXfS8wKzDPsFlu3QfDX1V0FfoSif369x9MtxWNIHosDrz%2BF87Y9%2FVZWc%2BZjk3Sp7OzbIhdHIgz5VV9b7ReLAMnGnL1vjLAK%2BXoARXZlVWyLgcVj7K9Fc2FPTUEVKUxus7c9Y3Hjhsug5nV%2BQADqAX3VmGFHk3lFO%2BxjdWh0P2pHoq6z%2FjdeAR8RAuB4fatCqoiL&X-Amz-Signature=b378e25603e72af1f914734b5a1912d1de8162f9aabc778cad98c121a9d20838&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QX6A5UKX%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQCFDIK05QV9Plospy15GVhZSOd%2BRvImztaJjom72iG1OAIgM0mdBrPCMILNt5e002cAFnbP%2FT96jrYrEh1GmOFJWMMqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK3zRhPN%2BNJKj3WJRCrcAxLiHZXWoAqBMFnFiFyDqZvQZwR34lyOm6q7ntqo4kL1S1iDVj4UqOQRtYO2CBV1fZDKcr7JkApF0qT3qR%2BzEPtXJcM6zW9fTghqiMmDcBNAU9NEGCO2Pkw9M1qaLr%2BAGELvDzpik69ASr0jFdS%2BUIlgj7iqaQx9WmIYdxV83txixwqwdFYgYRrm2Z8TTvnC%2FHujzqtB%2FrEnSr5Tr8NRkjPu1y%2BCblPFB9aGHVq6cyN1mzDlTOppFtjQCUc00m1Sfh5D5CXBdk8i09iu3AK62HRdIk%2BAFthKknzvknsn9%2FC8Q%2BxHeQaSvWiTQAOiqlSQmyEQzw6qdDcDNQYQmag4tKbQDdKwpTArHhZVNrsCMaeZ6f1RgDhI28kKbw1PiDYmYiKq5hHZh%2Fjz6kjSU6qJlYJ0U%2F7FhRPOTRoQ4URc7N5CmZRT4X%2BMcI4VnIOQkAm51hYh7TBhjFpMFg7ZKJZ0Jn3Ma7PpZN4c1uktEhc3srarN1gDEGuS9N3kfR9mgfMqVtfCoB25ClbUgcux4ehX5z0SeJgoa056s4Y1I18J4nZwFCIQruBTvyTe4faz1FhIzWyCaDxqoFN1Kyyh92EqLKJZpsRfp7jcsVpZnS%2F9%2F00QsOBBq0wTEf5fupOiMM7hudAGOqUBKUwMZze83qQ%2FXyBvIWVzh%2BGV67DjYoz%2FBtQvirXoI0jw%2BP%2FjhK2auBd%2B%2BrinPvsAiDs8i%2BWe6EXWEvmhnbtGuJUCbtvD%2FDCMRiXeMUM%2B55Qpz7gjs3IcSBoyqAi1nGxxkHKBDGw%2B5%2BpGeAqRA%2BH4PBJ4X1%2B%2FJ3zWbiF2jfgxftwq4b%2B58GaLYGvsLJixXBoDAM1ydBtxWUIW7QmHW8zjuYY2sZnz&X-Amz-Signature=ae76bcac4d4cb08d1a20318226235f95cf07ecf5e182038984cc9392309a371b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X24MOVRB%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDUaCXVzLXdlc3QtMiJGMEQCIEeNF47ad0TSdXcQyfAOG8FvqlLjXGLO32BhnVbHq4JVAiAJyOP7gN81EZsMYgEdde9LjiyTkLUS4EOgII997kLaGCqIBAj9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMTxDiX44MC%2B1q%2FmK6KtwDtH7Rxi%2B07Ea0n05U5ZLI%2F3GhWufXO9cvpWl%2F9c4MS9MynXmZER446VUZCMsdSM5V6s7%2BN2t4NWC7UQ0KncQ1OXegYB8fbBTgQKD0MiRzirp6epV1y89OToYO%2B%2Bspo%2BNuBsfapYyGrSmmB1pCN16i5C1JYkYFlddng5YdPYnHcU2s1a6CII%2B4V3%2F7q9eak7tAs8gpJmMF3FlQE4Mf3qexEpGhp0XBCQGeL60ccVxZaKfruJLATjXGf129s%2FfxE8B%2Bf5LTMyJHzZ%2BnKv5qGnTwpQ9KY27WWTt9bysNAjRBDz4o298uJ%2Br6Tr00OY%2F4OsVHZzXSO1qJVzVcS1Tq5kcJN9kF63cglXXsu%2BWBPwrfqUfM0k1mrS8dQZgSqxNRCN9EXxw6nt9P6OaK7WTbp%2BdmnFAnwXzSWpGcvbrpo8pxa3OU0Bp1l02nM%2F9AqQL%2FRNSH7Gpw9v%2FI8mg36kJuP5dBrBQRN3gGS6vLAdVU7aHLE9Rnk%2FJnGmvwQXCtQQAV6Kk7Xm%2FfHRyY%2BvAbeMNEBS5acffYfeCHJOXY8vDf8mC51ZImaXmWyopkRkUsIx8EdEYQ50%2BFYiOO0PRzlmbU5bpVYZTqmy922bI8XYO6asLEpmp9e%2BtGaoa4F9%2FVQIgwvZS60AY6pgF0FBawsVZbjW7lK%2F9JBNiqVbt0JAR6sMSUn9mTicEP9FOrfRhd951SX99C5jMv2UVQiofUx4lTPud5O03JJgm079cWLsNjDZ4KUWG62Esqx%2BOUsLCujna1kk4rokr0pLF45av4NeCx%2FFYE4hTe0uRvwW1hNvbr1hy0U%2Bs0%2BW668xOT5qVTlJ1l0NVN4HmeUdYJYvorgRb06J8Lf%2BzTDnznQVJ2lNXD&X-Amz-Signature=c42ed780ef96cf47b10200b1ff1e7624a2bdbcb536d4de2459695119e859baa0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
