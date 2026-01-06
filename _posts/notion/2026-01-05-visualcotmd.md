---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWB4DTRB%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFqWiSONcTVxgrBnItQF%2FKZTxkEmVUJubWrkLXcIgqBWAiAQ8X0Amb6aqlcRFuTLbrmDJ1NQ%2FgMPm2i69xU4cWx6Kir%2FAwheEAAaDDYzNzQyMzE4MzgwNSIMqE8M6nKqWWsCy9aIKtwDeAWpXQrmo8GSoIsujCy11WRAYCVx0I34NFuC2YF%2BDhkT7nZgtmg15v8Lq9kf1TOsygVAlTL7QShg3x8ufXdcuRUMQkvdNVUg4OSbDJK57Gh6Qxr4x%2FKjlVTvQHq7f6KSwbTQF6J9CUbOP3a66yfrzAmlbRrZAjNK5rF8a%2FFKTAAeDJB77hb9ARUTD4VKnJltWGR6DmJjX8HW1TcnWfz9nTWXT02NsJq43ccc9G2uCpCQ%2F0Myrgn3HpaR4ymFwyKg5Sy8pxKOYXdXUrWqUN0%2BFDXbOPbUmPwBOATjvteIpFpJNZhYZyXUYbqG%2F66MAfZfRl5CkIq32924H8hRy%2FjNl5ywE1V1Yn5wYtLgmNM8HvcsM53rN1h5KUMdcd5aLrR8jN88wWvHPymanVjMFcc%2FBWDarx6LxlaLlFh2fw2qAjaPtqtpFa4TrDcYEFdhOCx8M7bgC5H2JCmVCxNaUGtppLY8kBrjb8UJJqY65twpeu7WqoUc2W%2BPmPGv0SeZGvuPiZIsu8D2LsHlHmJ8JCu0qSYc47x7AoBzzrfHIHB%2F7DVMjdq%2BjoI2njmyPdmRdQvHQQU7PuzH7GF5t4LeQbqL5qJNHsjHjr%2FKLd9ze3RfneXLRvh%2BBVnUTFcCm3Ywppv0ygY6pgEX5jCpEQ7k8%2FoHVP6qYToBvq76EJxbJNNYMHrSf5GjZt%2B48ixB0laEQ9DpRkA%2BwydX1gxoc9MpsTqwS82jTzxMffrHahPnJGNQi2%2FCePtuY145egEapAQ2IZVkZs%2BOpSORF8nvB4mvlYGqzfRq4qPp3lrJtB%2B1paggOhxiWjJfr5ACTi1LNRAt7%2BFy9LO%2BuRTydMDpF3wsYF5cBMIySJCcHTdzoyYr&X-Amz-Signature=d9ea8bfd0956815391552a95d23670f51bf0c1caba9947fc7a36b03731a0032b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVCUCZ7B%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135507Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFflkkFlVRLLwQbW4rBhNEgIYjx2fE5wJtYEsJLZbT1lAiEA8AJTFxRTSRSVBVkKyrciLO9dogJjzz4FRII%2B8IudRa4q%2FwMIXxAAGgw2Mzc0MjMxODM4MDUiDFTly2usNLDByAGqUyrcAylsW3lCr3US3LQdrtCcSuTs%2BnpHle8G%2BHYd47PGvEa7sCw0Xr8N7w0JcPdxIkg7FYxW2KPde9N0TLucm8PwUPeZaK7Fk6v2%2B64HZtsDJLXQHmEgiaM9gJKsoLb1p2FNMq0WSW9WqcedI1w7YFl9ru1QdVKOdsPact7wJW1zE2iwT6EjHZuzLPDIzh0Cdn%2FfdK%2FSbuMhHb2u6IvzarEy2ZKBl81R4FIUSl77TJqT%2F1pcbhdqXrl%2BO5lZE02GcVEOJtjXjIFMs%2BckvPOcaqHB7CsjrBzaF1r5pqjZrSpvBIWCO7EVbt8zWRf54%2FKNgJDKvrehME%2BTsRtvedkneQwh%2BbHkI1zWvuBhbAipGK08wVi%2BS%2F1XzsryiLT%2BJ06ITZv2uqGWRFfppyPSOOt9dZjNLHnnlcige02Ge2L7hMXa2HpNetZjkPdHjAIuTUp7UdaFrYxArCtl%2BilSx9e49PTtPMc9oUc%2BFAGvueJpkh72rV7oqFOdWFRq7K9YPZabLyR04Mo7FERxBfjgL4U7awRhv2D1M1vvjU%2F%2BNqaOKOjh3OK0t0KzkbFR3OIwtJ7SHCCIw1Ps7wt3Tnh652sKB4MJbESxAd%2FKpNnMmgSnpFEASBvBykxXxoBgUl9ZWk%2FWML6b9MoGOqUBPd%2FjvlnvJQBuyEYbRZsQ%2FHczkFAekM7zXAiuaBS%2Fw4foR52VrQEHJS0rCKyuaMtNP2o%2FY8e6gTH1CktOJPF3KJ%2FnmbylhSs1u0rhPjEkwZyJEl%2FwNpW4lvv%2FubFxSH07R8zLNcJ4JqE5noxARDfHcNleb1X2C%2BjlhQEhg%2BKHERek1xGuD3sZJGWg67K1HJrDy1Z4DrRI4k6r49fvOdTNtxaPGYFn&X-Amz-Signature=f4cb1178925ebdf28709b074549ef1c75b30cf7d016bbdc47d2c417c1d26af4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YWZ7LRP3%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135450Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCdP%2FeQGEEW33a8DGxX55V%2Fv%2BEdofEbAXdm3%2FXNlWAQhQIhAIC9lxERmbAwMWn4DpcVeJC0jdMfpV2bIXOSKSuv%2FjtKKv8DCF8QABoMNjM3NDIzMTgzODA1IgxTtWe9wJ8dnXHL1mYq3ANR2fFiHwzURvFgE5fUB0mVMT3FTRbmFpyh3io7n3qD6X1%2FTrhPZrLvwtFqYAhlpz0TK5xfRmugcxt1TMPcAJfaV3z%2BMFOwOqAm0cnP4B%2FRfEO%2B3omPN27hECG2mVPlTRwpm7suG1uQ96MMzvjR9Fltwjz19qwVIYgtr4Q3RR7oGEiHVqRYurVTNjmwSOVI9hD5GeySo7LoGNiJ1W8ruFTirn2HHVpQbS440HdH0v4nfH8eGAKceuMFYntGZFAiGAPCnGqn2M6APLZYbQz2CfNiENHBCcwPqHOEaYplL4UdwUvReNZICBqExv6XYCZnzVJ1OvetZtokuuMzagQq1P9EIjfbziPWHuyI9iD%2FWbxjfh3gBm7O87XAW308jKUeglLQMiKmqP0jlILeEGC62JruzysWaCjRB%2FXDYc5B%2FuVNdoypbWAIGd7KkB%2FrS9DnE3LkcnPICBcTgKSm35oVaxYS2bXq%2BNXpE3Mkalo2AoiVw2NWONN1162dn1dhmzWV3eFw8CNMioI2I8SukaR1W%2BND16Fcjtn%2B6ku%2BhtZreD7VBdTSk3sYZVp5MX%2FAG1uIMgkhZsAgjcgvcCrbkvj6zyWStjejxLwneR0xw0oQUispF3mef8iz0YR%2B0OFQcjCWm%2FTKBjqkAbe3XczqDbJyoWwaVA0mo%2F90Cy%2BHNqNMBGQt12XST%2BQ3oNvVgwCQPsEHWdp5tXy5UELsRuxsev7wBMpv5AT6KuI4RzTEBQ%2FR41414SGZ%2FqJc9rHgl50Mb%2Fj2suJP3AdM3zB0PMlemT3dRIviWJC76v%2F3k46MR3%2FMoYGhdadLx%2F%2BvV%2BnjrGaaAb4gtGTZvo26An5jc8slu%2F2Ak8Wn8w28n8vNtr%2FJ&X-Amz-Signature=e5920dc7b2bdf0723552f72888da0dd1710360f5ec90e2a676885a0d564674f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YWZ7LRP3%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135450Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCdP%2FeQGEEW33a8DGxX55V%2Fv%2BEdofEbAXdm3%2FXNlWAQhQIhAIC9lxERmbAwMWn4DpcVeJC0jdMfpV2bIXOSKSuv%2FjtKKv8DCF8QABoMNjM3NDIzMTgzODA1IgxTtWe9wJ8dnXHL1mYq3ANR2fFiHwzURvFgE5fUB0mVMT3FTRbmFpyh3io7n3qD6X1%2FTrhPZrLvwtFqYAhlpz0TK5xfRmugcxt1TMPcAJfaV3z%2BMFOwOqAm0cnP4B%2FRfEO%2B3omPN27hECG2mVPlTRwpm7suG1uQ96MMzvjR9Fltwjz19qwVIYgtr4Q3RR7oGEiHVqRYurVTNjmwSOVI9hD5GeySo7LoGNiJ1W8ruFTirn2HHVpQbS440HdH0v4nfH8eGAKceuMFYntGZFAiGAPCnGqn2M6APLZYbQz2CfNiENHBCcwPqHOEaYplL4UdwUvReNZICBqExv6XYCZnzVJ1OvetZtokuuMzagQq1P9EIjfbziPWHuyI9iD%2FWbxjfh3gBm7O87XAW308jKUeglLQMiKmqP0jlILeEGC62JruzysWaCjRB%2FXDYc5B%2FuVNdoypbWAIGd7KkB%2FrS9DnE3LkcnPICBcTgKSm35oVaxYS2bXq%2BNXpE3Mkalo2AoiVw2NWONN1162dn1dhmzWV3eFw8CNMioI2I8SukaR1W%2BND16Fcjtn%2B6ku%2BhtZreD7VBdTSk3sYZVp5MX%2FAG1uIMgkhZsAgjcgvcCrbkvj6zyWStjejxLwneR0xw0oQUispF3mef8iz0YR%2B0OFQcjCWm%2FTKBjqkAbe3XczqDbJyoWwaVA0mo%2F90Cy%2BHNqNMBGQt12XST%2BQ3oNvVgwCQPsEHWdp5tXy5UELsRuxsev7wBMpv5AT6KuI4RzTEBQ%2FR41414SGZ%2FqJc9rHgl50Mb%2Fj2suJP3AdM3zB0PMlemT3dRIviWJC76v%2F3k46MR3%2FMoYGhdadLx%2F%2BvV%2BnjrGaaAb4gtGTZvo26An5jc8slu%2F2Ak8Wn8w28n8vNtr%2FJ&X-Amz-Signature=caca8e898c4c3fb49f1ff6655d31469be446c144816d1edfc61849d25c15d46a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663633CN3E%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICNw%2Bapcfwphditdj6bZdQyF1MlEWjhsR%2FsjCJwdKLy%2BAiBNRHp90H688qTa8vSeaRG5Kx%2B9CblmSPPVCc3yxDc5cCr%2FAwheEAAaDDYzNzQyMzE4MzgwNSIMJMeICOP938LycQX6KtwD3LRpwOSHuB%2Fp%2BzR90yKWsl3rai3hQuCn9AmFjmUMqEBgGI7xg0DTmiL9ie1WBnOpqVeJRSNpx0%2FNrDRs5HXLcfWJ90BAjBdUAvyZTL4XpgX5MhzFuAD3rR7%2BZSio6Y1oY6Sx8KGlrlIR1eknmx%2Bw6A1sxBTYw0%2FeyL2iiPeP9diE1rvXUdmMnEyY%2FG9D2QLrwu%2B%2F%2FH6lGODaEHZdRmhvuyigNWmG%2F7r2HhRJTKxIIUDrwADJkE5anZgWVVYjD0v1ePj6KX0NKNHL3g%2BRWwi5JS9r33U6uhQMklmtq%2BZem0tnshkx%2BM%2B5okAxCGmYJdZM0QBP5Fut%2FJE42UOI%2B8YisSneMl4LvMeoyBguI8QQrSt97v1wRhQASFb%2BczjXKM3Ga%2BS0NJGBCMrHxYWtRHppBO3NlZO2jsAicTbP1IpaORgvPs%2FaBgI48%2BaBgBRKj2x%2BlA0wVDE5MnYHVKU8tCS3Dc18Fgqsl7o5BCeWxt1eu7uCj0CNkAa%2Fs4rydPAnlktbafKOwzHa%2B3OGC1jxO4C%2BQkZYUukD0x3vRJILdl%2FIp8VEkhyU5U%2BxN5jkCaE1Uiwatk%2Fl451eE6PU5MoP8PoMQxGrZasPjC4bQTxj9%2FXGOZyQCCaPOK3Yuu9f4uMw1Zv0ygY6pgGtaFQVequchfzWe48PKslgN5f0XZEz66CQ5pTrFVqkbbAd9j0G1RXaXObG%2F%2Bb3xZ0fau%2FuwPmuk1KIUVSxqq5U1gUhFeIea1t9pLYHlHoz52cI07CUhIFRdZnOnL1xO%2BB6yRjnknGerRfsgnZ7Z2K4rF0KqVuOwfaWORnHdQmfjl2IFJCwNPv2DqBzw5gu8Ee1R74Xkoxptyl0vcd2vcJ5bfM%2B7EB7&X-Amz-Signature=fafaadc2083b9a5c18b2ec843c5e15992065dc505ea94936005de958149ea62a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKGIR3SX%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDxFOyZtZppCtNcBMwerd%2FmNPcrIlal%2BkKASzA0pVEjAAIgMociBAPcnH8yNd7XB4E0IkAym%2FpxFu2IM11VVdaVQaEq%2FwMIXxAAGgw2Mzc0MjMxODM4MDUiDOhTa6QXDSJP3gCqlircAxqXRQXqIW0MXxTp%2F4DW2%2BKxRVq9UmerKkUUkiLTDmKjI%2BIDUMLMTfeZMBFC1IIVLXlQ18nmx%2BK%2FqC0q7XA82%2FJFL5WVgDA%2FFNKV%2B0OovmphXFnYq%2B6BCGcrNaZLX6nsMkWKcZxpyVNNOFohHQrgueHyUcHnOeQgFFJbKFVZPzI3ymLAQkL8gGNHthS1yfhZEf2kdoM%2Br1ysrWDLDX2oNUnwY4CeFGBFrf%2FFFTXuF60hcPL4bBRoZKCcxzN%2BQkrrC2iU0rYSYWF0H%2Fifpt2fnRAPV0mw2FdGY5Vy1zaL4g1WVIoQBbEyUg8S1h280mVBqm2LUVm0WH7zeOpQ2Vn50U1qmKeVYzwqcs4WFJkpwNLQ8TbjUueXlFjE3dbvbejTqR%2BffHIPseoJU7rzZxpsxFRTo2D5DlAE8XVEGZRGsq%2BvK9Z0qoQZDh51L5fdN07bhx2%2FPiPxpAZOevr9vzuFgjBYh3eVxAUf67e5EUCfhftnq%2ByGp2jb61JDxhYkqLCkT0A%2BMfQ6BR7R13Ismvm5%2Bgl%2BuH%2BQ6nxvoo6zFp5CWQx6Ghd3mt4RAs4uN2aZV%2F3BlHGD85SvPk%2BNKyRBB%2FyOMef9DFCRWaJeMhcKwafNKwVOY1%2FzroA7ta%2FnWSFlMJ6b9MoGOqUBf33fbjrpbdCCDQD2q8NazPJikIZMFE1nNOVxdnnxFQ4oQ3by7Om1iH%2BISNifbR%2FQtTlvjE02KJKRAPKTdups%2FiQTTm7eD3VYJ0Ri60Zztz7C9Nrj7M0gSGJDhkW6C1Hf%2B5O0u1zF9SGkpTCSWSxh6iELhB7oS9zudh42r7o%2FYEyoGNptwdjTGVEqp7ah9RIOeL6D6ObqHi6Ph3E27V1z1zC7m8%2B%2F&X-Amz-Signature=dfc2226d93ebe33eacc1f09fbd46ca5107f4fce6c3ae8eb272201f571130354a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7K35PC2%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135520Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBRMEMenSUiYMVFb2PlA41m4wjeUwmdwQHbxLT4j%2FeA%2BAiA%2FXt%2FnzY%2BQfq9YIsnhcsO3FmAHCHQsPl4fCn4qPDqt%2Fir%2FAwhfEAAaDDYzNzQyMzE4MzgwNSIMF3%2F8naqEsEd%2BysvcKtwDkllNoHry0qK4DHooQZnaSErMvpYnjQis5WO2gsyhgM4Iggc35ylqtd9pdeaPp%2BcBhaROjDeTA7LZzQfDX0CYcTdlYrKQRIfNzwPfy7H%2BhEs8YCY3XMOkMdp4y7rItzlJeCOYFBn0gpc9Yn7u2Z16wdSrk8gdSgL5iTXOAZuf6K1qmaJsnrFUu8AUZthBiwQpdACQ%2FSt37LK7oNoQ%2FQ6M6qPyxy5rREqgOzY7uDujg6J8fYe4%2FeaGQbeJIsgRj0UgaCiJ7MC8MBTYLgOBh6TwsyWQLa8EBEwQuF4Tha4z1%2BkFBuA1Q0SfoSNI0aDXOXyQzFTjaXWHU7GCIZ9S27olD7wtla6M9%2BpSY4LkgiDPZDMYx76Y49K97mKgjsg4FCiVjXRGjHzFHcctd6LttH1ezrF056RlNAHhXS5t3vrMmqOs7JoBxWg7TmqR5e82%2BU3t%2FzikAesIxO9ERnx0PID9zM0xHKX8gVkinqFpbZxj7rN%2FfCCGWO32k2%2FYyMXkGj71LslAroje22oZINuD5OEJJ5d%2BhHDWVoZPnHUDxN0vz8gqtx9eEhfHSGv2j3tXuI3LDSQylocIMTXPSDU6NGhSgZtRbtDRj3plB9aHWC%2BrV2KNEzDPk6moVAGQ44ow85r0ygY6pgHT213UUt%2B%2BB72wilJ6KL%2Bsmx1oRkLaCIwXvQjbCwB49OawKMNCTILdJt08wcJaQw6uBzmCqquSKWEK4aLEVLXolGFx4jUep8NsZMvazz9EfyfcsnSuGtTi04Jdq%2F395DCf8OlMQYKmVkqzZkEA7018eHc%2BPfgLvrV07NjyoLMH3u4JmvUk0w4lPv8lTEXo23VwxirayQ7%2BfnkWWXSXfmPmccmzHDOI&X-Amz-Signature=60be494f522969f0a62ce66af1811efa14a03866c7a6b8bd0a3132cb9f58d443&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46644IHIQJ7%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135520Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD%2B2%2BmjWztSxghDGD8LrdgfEIU%2BjPFJpd64pUresQbK3QIgE5OymRSxTRZW5epgsiJltUJuuokJV4O8%2F6xzccPnXacq%2FwMIXxAAGgw2Mzc0MjMxODM4MDUiDANWfgNDjg28A4L4byrcAw%2FaHAtts2tFyxPJXCqn9ZtZ1XXAeKFcAdZsn43BM6hlIKJ%2F3%2FXg8EIqu0MiTHLhfzu4QQ9IGId%2FwdpU3ncC6BuuFPYFcF%2F%2ByFBmuRnfc7ld98HGjLJyewavXeOaJ500SeyitbsAeTiikWhCBbVF0phmclN%2BKXJ4hQ1gSa6RXHwn1K4iNN5VznTR2sgGTxZY5j2VX%2FeSgYBdom8S6jlmchnvVRYdlcoitdB3Q%2BGznkHZhjrAGT%2Fq7me35ufu%2BDKwIqSS4x7c7cCR30x%2B%2FaZPOYULJ7FMCJsLhsosMcYdjCa%2B%2BK%2F%2FNRM2qbs2D%2FE5A7NmwG7LKRwktRXbsp0ykjt5CKb4xxVjcCuyWJQl138PfvzIYsnocvbayYYVUYZmeiK5W0U8aPdukQ52KKWkRX2Gv3rkM5dAv92un0xfT8oYFXVDBp3Jf4ELnDjJnGwVkUj%2Bt4LSSCe22zA0J6ptxIG714lydjNghIZzFWiLIrP6GL0n%2FhBohkRnS%2Fzx0lxIm2OMa0aDle7eTOS1PCwhHRj5Sv8gposFGw5BOyC79KfNNfSZJB6BzhO70Gl0vXDRhi8PoCF%2BRhm3QNHPbIrb3V3jeDz4kfzVCUdFfORwm89LSUSSrjmwGQihgU9NpmOyMKab9MoGOqUBtza%2BdMACQE0ycHNxm8QQqCJqz3asIrB1%2B1DuSRtQihfMeMMBrOClqyvb1T1Yl%2FzZYmyYBxwRJBe5aldLBoaCXJ6lMemnKbaSb%2FHgEYmNFyOHdagpWdnlezlj50L7Kn%2FRraIzQEUQsvO%2F1PAWKVJmLniMbqU%2BdSoLyWEWHD8xARpUr9O4u%2BULaCi6%2Bi9rDBqHSKlSCQvdHeY7zjI9So07SSXHo4YD&X-Amz-Signature=7ab99ead1210eec38cccef1e6153a9958284b975f05cb451adc6751f8cdf2993&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TNBSUYVS%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGtOnjiT1Vc5OE9Dgx1MRiymqdc6W36%2BBuJFakI2p8GPAiAuC1cO4NHWN0B3KpFcRmNhpbCZi%2B22yPlXIRoQ0tUd0Sr%2FAwheEAAaDDYzNzQyMzE4MzgwNSIMSOCkDr6b9sPPGcPVKtwDb4odZgaqbjTplIgTDYc4Kg7omqJ5JASol%2FAndd6yjxqkeKk4aBDySy2xt%2BDom8jzvcT6Uk%2BBmTo9YXWDxQZL1I%2FtuX8OQxrHU134tVYz%2BmYC6w2Eh8fK1z3OTXDGke1VXKaC5bwrj7iPsLim7orF7iy4MRrh7DaXgkONAQDezTzGduS1D4AJnwdrdmzp3cwak1SaNml9bMuEnniTD9kHBsDMopnyESmNwbtJz21ko38cAbxUkjCAj%2B612TNcwd7uegrxzrDxN%2B3iN0hSRkbY9P9K3RqrA%2FH8gib90ZfWMcTce%2FMYQ%2FsWc0qzEWzRfU0%2Bttp%2FdD1%2FzCgcSVi42XpTBIlGx10BQwg%2BCVcbe60OKYQ779eJxFwVAfuF1f3FjEZ3ve27rZGZeweUAwF3LFDS%2BRwU55rQUdZ2HNcABandalZ3DsN5FVmj%2B6fbAQOEd2lLmxhwqJEdvyQU8m%2FGbW54UXfyRyBrrNX8yx2hefe6%2BEzsfeRLcvbA5d4bdoIJvKsefHVPLQ7r2Ya7GyLg2XXjIwvA6yvKy7QwjaIFKDWZS7mpeTCqhLRUwCWRS0oY1lT%2FSkiPCJEcj8Q4icls6HRgRI%2BrTnhDSb5f96HDfR%2FMm0CFA59ScNJNswtPPOowhpz0ygY6pgHKafPwgUty9qwlhiOym5LMCZF1IoTrmMj3mE3gx3Q4tkUJDsAJae8l5nrmm%2BOJRfZcXfWHGwtmrrb7BzNggArQUcazpNB%2BSZiKbr5T3WeQlIZL0KS43CMyq1RlCCWuJSSeOqtb0erFBEsHzYZva3CRileg0EF8G%2BGTZdQQRYFtSCMpHd8HfDZ3FzQqTeYj990O6T9QAf%2BaQ%2FqCff2uOBUZuZcnu4v6&X-Amz-Signature=29ba852da0a7a04f4625f4a3268ba4b36ed717f95fa4a17ffd1bcea51a4a7698&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YWZ7LRP3%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T135450Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCdP%2FeQGEEW33a8DGxX55V%2Fv%2BEdofEbAXdm3%2FXNlWAQhQIhAIC9lxERmbAwMWn4DpcVeJC0jdMfpV2bIXOSKSuv%2FjtKKv8DCF8QABoMNjM3NDIzMTgzODA1IgxTtWe9wJ8dnXHL1mYq3ANR2fFiHwzURvFgE5fUB0mVMT3FTRbmFpyh3io7n3qD6X1%2FTrhPZrLvwtFqYAhlpz0TK5xfRmugcxt1TMPcAJfaV3z%2BMFOwOqAm0cnP4B%2FRfEO%2B3omPN27hECG2mVPlTRwpm7suG1uQ96MMzvjR9Fltwjz19qwVIYgtr4Q3RR7oGEiHVqRYurVTNjmwSOVI9hD5GeySo7LoGNiJ1W8ruFTirn2HHVpQbS440HdH0v4nfH8eGAKceuMFYntGZFAiGAPCnGqn2M6APLZYbQz2CfNiENHBCcwPqHOEaYplL4UdwUvReNZICBqExv6XYCZnzVJ1OvetZtokuuMzagQq1P9EIjfbziPWHuyI9iD%2FWbxjfh3gBm7O87XAW308jKUeglLQMiKmqP0jlILeEGC62JruzysWaCjRB%2FXDYc5B%2FuVNdoypbWAIGd7KkB%2FrS9DnE3LkcnPICBcTgKSm35oVaxYS2bXq%2BNXpE3Mkalo2AoiVw2NWONN1162dn1dhmzWV3eFw8CNMioI2I8SukaR1W%2BND16Fcjtn%2B6ku%2BhtZreD7VBdTSk3sYZVp5MX%2FAG1uIMgkhZsAgjcgvcCrbkvj6zyWStjejxLwneR0xw0oQUispF3mef8iz0YR%2B0OFQcjCWm%2FTKBjqkAbe3XczqDbJyoWwaVA0mo%2F90Cy%2BHNqNMBGQt12XST%2BQ3oNvVgwCQPsEHWdp5tXy5UELsRuxsev7wBMpv5AT6KuI4RzTEBQ%2FR41414SGZ%2FqJc9rHgl50Mb%2Fj2suJP3AdM3zB0PMlemT3dRIviWJC76v%2F3k46MR3%2FMoYGhdadLx%2F%2BvV%2BnjrGaaAb4gtGTZvo26An5jc8slu%2F2Ak8Wn8w28n8vNtr%2FJ&X-Amz-Signature=c5b70d5dcd549443d6dd27b181f6d2af886a2f69465a61951289091f0c978463&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
