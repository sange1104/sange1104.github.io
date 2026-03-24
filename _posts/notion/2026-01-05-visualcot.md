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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R777CHRR%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031611Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFqyIVl4ZgkKQ1LHp6nQ%2B8GcWXeXPg9XCuPbVxoUoFp%2FAiAQk4QAMtKBdmlWy5dS9H76J4m16lyOwzZtoyn8fcdYJyqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHHW7p%2F8rXkIKY1RIKtwDe13aPZnhZuz7KY71%2FHFMPqkvrcj40JJQqmrt0y9t8d%2BfUkXihZqv7VX6SYIYGA700FfAslE%2Bhf5%2BRZReczCVdYgy%2FvctvFr6PBGzjfzJs5d3aU7lUUFMv3CM8sDeK%2FJWMdQpvj1IyJTt7Rm2V6Yz8wJuZ8dJcTMl6vLalXguXlhIs6piH6Ad1VfJ8hxxw%2FeB8BypvGvsPW8gi9QUmxmTm1OZ2yCy2M30eP5TLOuQzobtCtQ0RunzHqKEuBy3wOWN7QbIIHvwxrvU8qBAT8Uh0FD%2FkiVTLMG6ldqpwk0ajm3fp5LDXWWvWtWWDmMsMdAqx7A6lcIbPuQlW7UYayBtRpkhk8iDzp1a2cuh9pDMO4kAHbqD6pD909NlOe5aMWkCFCwXbW6mkhq7TItZo2QnnBrStBwY5CNA612VdlAvtz5juMsPCPdE%2FqmBt1aM8gqpXt8lUcE0oRf71sVQcIGuGoIIozYJ50fHFNSaKqXX8nU4tyEucgAax7bWgtgbNx370G8xrgcdoo3adAZoN2rAij7HT7xynt%2BDleJmxZa6lrpzdiiPQ%2F3grhVjZDwalm1q2%2B5uxQTGqQNge4dc6edvOGnQigjcLnHWu9hbO0ZKzS9x3hMa%2BkBrafB0j%2BwwsfSHzgY6pgHmBMlYK2E3PmJ4vw3fYsaUhMy%2Fbsmu3Stc8s2sP%2Bld727u0f6wLVHKs7Ko8wTpaHHS6GYAbXhegj%2BB%2FWiK%2FaPVe%2BEBZu2jzZMsSU0ymmozMWUWh%2FhlOEDTQY8u2tgXkNDBVvOp33h9qtNZoCNchia3QsQ4DlNjVUcD0QF4KX3Num3SVXCtDm1arOiF8RXIONlh0bIdx4ziaGFZ6GRfpKiGkFElr0Bj&X-Amz-Signature=90b527dc84661a4a96ca8d7682fff6fb972bd1fbab309b054455d4ecef0ceb62&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VDDVV3P%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031613Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCqYbqWfcNaJHjJ%2Bp97Jtr952bViTbNtUH7KUUc37P%2F3AIhANngmMwkzvptyYEIQgzcsMrTccG%2BALb7sEW9EUnbdcY3KogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzQWYPG5tlyabXNi2wq3APMjmGjSlQpzyPjd2%2BHXqjkP4Nut5LXjam65rGFVMLhzK0P8FgYyQxOuqxqB6FPVk%2Fdsqq01PC6dFRo5oOt4%2FYSuavoOHxLMtvLEC9o39U9Rrfsd2%2FvNc6yPAMTuY45qxCfaEPLzZyQ0BlMaT8%2FjXyPFKx781q36MPVmhrZH1iRZ06jEONAWJzRY3hWYGRE4I%2Fgld0vP3t151n5JV9w6Bg098QI69LO2rbcYeiMDPe2iCDzZRUF2JQIx3Zmdf3m1TvXNw6u3s5XGu5iTk0Pz6FbPb9p8UFgsAnk0DjJvyGZZDOyf1AA5eQ7lvzK2RgQ4ffDVmSpYyEnLVZScIbeQl%2B8lZ5GsgtF2flzdFAaGASGaz%2FI%2FgL1Lnkn7AgZqnQNOlXDirq8SHxQ2QQn4JPn0DJILAOU4ANxzdqNvjf0LoE8mvj3Q060V0xfrnnJF0OI8diiYdH%2BxLcwwAS%2FfjcvabEbI8FVq2MH0Am%2FCLlMvcr1HZ8Gvk%2BVvDtuX2Md%2BNCcc58PZo6b81n5hRygTfiBfcf7RoBwRVyGpigEFgG2%2BjSX%2FnPvFUkqRHS2iZIfm2%2BNzy8okqd1KzYV3zS8b9QtidvroYptKQpaTpU7N%2ByOsqOjvpxn%2BI4R33GC%2BqM0eTCE9IfOBjqkAcHCp55J2xkR0Dm93X5b7YrGazjdrdWkvquWqXEVkzrleemI1jmDVe9%2Bs%2BFwZCZcrmW8WBK7CNlELry%2F9NUTSW6wTvyFYbOD9uzcqs3SUn8sRfkajTvnJmK2ztzImFXeOIYzGYdB9Jz3atpsZPxvXphCwqWmilG%2F5cL%2FZLdJKuuVq%2FCaBvdNxZVX5LWDLR7NYKrg7B88xMMyIoND0iNmz6fq8frL&X-Amz-Signature=8d070decf157540170333b81a824a98eb374c5e2396d60d6e91d2759e799ea11&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RXWUD55%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD1gTe%2F5L2fWsNpMiY44EWZ9cmTD2CkwuXL8eD6ALg4hgIhAP9U6bJf62O5BohUMTiSY5aW509rS3JVU4w11rK4ToT%2FKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgymrFs6zITiU9yzicYq3ANMJ5ETETpytplOdcP1osWtJhthUhSip3kLnfpAx1rOo076GLymOM1e13XQd5fMVh87PafNQZg2zslCf7nOclwRgL0pFSxJcb%2B0drb7NnMREaoPSpciqlWKSowFKSZpizc6K49M3Tmuyo1x%2F5i6H2%2FQtMzWkpe0M2MZV%2BZ56ZDbJBShH1Sq0mQxmZ0XE6Ri1W7T%2Bx9Edlqp84zpsXpYio%2F83QYppeKuaNK3GZTA25D0FgoSYbDtb6oS4rN%2FIUmWRjSLg8PkvBuGRfSO738qzrA5A5iReuQ7t8CTvzfSm3%2F1K0RbTb66g%2FeLeiH16OFDeUrkj0rahfkzEl3lToIOoD93%2BhC7Wy72wIgO4wg0ma5GclmxM1kqdQNe8PY20iA6chTFaioDbGErnv8l5Aq3EfXnoEyx%2Fr5Q3tic3%2FOYqfLpJ8jZSI69Is2h6bSz70sRSaUCUzDPYTvfsXgtFZojobzUAWSwUwjB9kgjM05HJmwA2RMKTbCjbbElNTIQWkLPBdxDgZ7kPKjgv%2FXf7u20b5TeuEd6p9O0t6OlDPznM2vOWNyvClc2y519Wv9PF3T10u0lrsIgF%2FH2EHt9QyzM9s8f6wo%2FY%2FTyCAKxjWXqzm8l1QgtcdejI0p5aoca7zC29IfOBjqkARjLv6dFDJrfUTUi1ZB69s7ACloPwj5C%2B9HlTYgZ1rq0tktJx71VqsmXcgnJKPLhjY6GcluULs5P5LxJodpBhteogg%2Fu8bf7tCtQtPfLHh06QExRngpZ9yMC%2B9vLiO7QfxzkXbFDpZzUiQnMWdjYbV5GOyh%2B9fzYgEpa8vh0n%2BuYW40%2ByoegovFYxsYBWA7KDg1k%2BDP6gPV0LV4nUUuCxvA8rlK%2B&X-Amz-Signature=2765054d75cff773076e0ba63092703767ab4402f8dacfed7c4bfc585301b403&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RXWUD55%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD1gTe%2F5L2fWsNpMiY44EWZ9cmTD2CkwuXL8eD6ALg4hgIhAP9U6bJf62O5BohUMTiSY5aW509rS3JVU4w11rK4ToT%2FKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgymrFs6zITiU9yzicYq3ANMJ5ETETpytplOdcP1osWtJhthUhSip3kLnfpAx1rOo076GLymOM1e13XQd5fMVh87PafNQZg2zslCf7nOclwRgL0pFSxJcb%2B0drb7NnMREaoPSpciqlWKSowFKSZpizc6K49M3Tmuyo1x%2F5i6H2%2FQtMzWkpe0M2MZV%2BZ56ZDbJBShH1Sq0mQxmZ0XE6Ri1W7T%2Bx9Edlqp84zpsXpYio%2F83QYppeKuaNK3GZTA25D0FgoSYbDtb6oS4rN%2FIUmWRjSLg8PkvBuGRfSO738qzrA5A5iReuQ7t8CTvzfSm3%2F1K0RbTb66g%2FeLeiH16OFDeUrkj0rahfkzEl3lToIOoD93%2BhC7Wy72wIgO4wg0ma5GclmxM1kqdQNe8PY20iA6chTFaioDbGErnv8l5Aq3EfXnoEyx%2Fr5Q3tic3%2FOYqfLpJ8jZSI69Is2h6bSz70sRSaUCUzDPYTvfsXgtFZojobzUAWSwUwjB9kgjM05HJmwA2RMKTbCjbbElNTIQWkLPBdxDgZ7kPKjgv%2FXf7u20b5TeuEd6p9O0t6OlDPznM2vOWNyvClc2y519Wv9PF3T10u0lrsIgF%2FH2EHt9QyzM9s8f6wo%2FY%2FTyCAKxjWXqzm8l1QgtcdejI0p5aoca7zC29IfOBjqkARjLv6dFDJrfUTUi1ZB69s7ACloPwj5C%2B9HlTYgZ1rq0tktJx71VqsmXcgnJKPLhjY6GcluULs5P5LxJodpBhteogg%2Fu8bf7tCtQtPfLHh06QExRngpZ9yMC%2B9vLiO7QfxzkXbFDpZzUiQnMWdjYbV5GOyh%2B9fzYgEpa8vh0n%2BuYW40%2ByoegovFYxsYBWA7KDg1k%2BDP6gPV0LV4nUUuCxvA8rlK%2B&X-Amz-Signature=6980924bdf9e9f077591cf0eaab1c2fca2ce4e095679984f0f6b371b0adcfd30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VMUYVDL2%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCewmPvfXudpXPwkMUAIs7w9QIL6v83oaPkTG37BbaCMwIhAKx2uWrGTGwzHZcwUSECzyOnA%2B7inowLB4piJ%2FVtBweUKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxLtniPEUu4zB8oUmkq3AO8HHWLTbo6j6fY%2BzOswKgP2Kr0I9N0%2FdGF15gleY9ehYlNLiy%2Frv8CFLl38yMYWd2wO4y4Ui422fmX%2FIecE9DtedS%2BSPYYeXt8kcw0cUFqxgrmGjPNCXmyhb1KBBr%2BEchyv0Dpl4rAupm7JIibpuUQ7K5rwSUE98KBnEBgdmu3g4s568mXTyJwRz1NkzIiiQ%2B7Knxu5ueOW1kUpC6SruJgT6cBgMVKk%2BWUCusD3fcccqPs0O5wkFhhR3hNwJgRZXMeRjwDgq42Sb8OBRaIyqnT69scKE63c5cCefS206cWUaLm4CvZaO1GGCUHThyeZZdLnK%2Bk7vkQRp0%2F1Tm%2BAeBGSbxqLAlpV90i%2FVs5bIITStUWh1xsuo3FNFfHoWrS8F4Sj3uqMZNx8ni81j3rjk1WSAA3LpEmf6N9p%2FVlguc7JrGyHlI8Q0JG3sfeMNbKuXzD11zOT7fHiJO%2BSe3h%2F52vOVK4lyVBIyBpGWELOpxrh3MMw28%2BPkqyOBYyIoTraLrsZVw7HlHvx9U3%2FzOfyqUVnDZsRBfoOu23U4ZLyGf2ktf5TVK1MrXuQ1HI2clcJaZQAKkJbAy%2BwBwsZCIEtnZLqLKHNzQ4e6K4dmpZq%2F%2B6Ycxa%2B7UJoWpSceKQWzDJ9IfOBjqkAWDH93pAR8zonDuGkpwH20f%2BZHxo7g7PuTDx2u1L1vfnBxBdxZyQaegGpWs1UMpsLIstbN%2Ftn2Rv%2FDwnnYFuOMUEjUY7SfsYE%2BkE3Bv%2BDhp1fDp6Hn6SoUnzFjPuZgMogzCw9zzEX1hdGa1wYvH6XSKC1jaMdz%2FtAkvlU3cjY44FoJZr8H6el5RItMNKjXLbwUl%2BWezHaJ1O2YMz87%2F02I6Dionl&X-Amz-Signature=b7800ffcc5a68844b8cfe34df1a69c3e31747a4b91e2dc4094b03be4ac2fd787&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YMHTWOHH%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDDnwXriI67kUdNd25%2FYUEyKnBJdVuILC39c%2FTCxvgNTwIgIlWpE2BWcZXRWMuyPEoOACJ01zQ0QXfLprVL3WRF9tYqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJAf4Nnsr6%2Baf0hIHyrcAwiLKmal5SW2T6jOG5O5sjf0ahmYbxv15AVejdr8Dwu1HdGEFGsTHeLlnRs3lcweuHLpW34kCyPiYBb%2BhMIKbRlOfZ1o%2Bv7Swb7qruM7PwXQwh%2BwGITVTzZHKe7sholwSvvHG1eRWVO0Dbf6egXfEcd3oRFD9FeujhaXBKkgc6LrhMWSKKdfZPyz3Zun4z63qO3e4OYncvu2ro70VxOa8X8s2UxAj6M8lIe7hC%2F3fHLisnJYIp%2BnVtNzMubrmmTOJrZpUORTZp4xP8B%2BFsO6DtWJFBoJ9WzLman7HppvvhiLwUpzSNfBTFyKL0CTjp98i%2FqY%2FDDIgDWLmuijSqXQpCQtVDoiUn3CdXXp0KqK%2BNuLYL7XoQprhis79%2B7kdCsS0lVkwsY5lv8aIN7RE%2FOeMDOScDPN75TISPFJSlNHl5UqpTSdR72AhGIU70XJN%2Biu0H8Rs99KNHMsMPuf7ZP25wZifELTohljq5sruVEmQ%2BNjFbeD%2BBcJh0T58fbhcHp8Q6uw4crXlbrc8wu13nsn0dpEv9FoKsvNDdy9wkvuGTojPBB320ryYigqfnFltyraeyRGp56JB5qZYc7jtcH1w%2FROswPpz37uwV%2Fw7dcxpB0XQ4q7BPJv9I4BFWGTMMDzh84GOqUBe6H50A99X05MmyoCFmPa5T%2FAszbwmkRNDmXk%2F0cggSevsuyGM0LrYfunIP%2F%2B2N87JliMOMAFeAbwboV6EyDAgKsyCU6IoWOEJNbNnM994NcNDNObiFo92%2FGgVtvNx32jW6sEbK4Z3mTVX1noX85qlFDWopMMrEIdAuPGN%2BtAPyC2jtfVD2PBkhRY4CJKIOdEdpWzxuA0xSZYkt0hawP7dsbQqLVy&X-Amz-Signature=b6d5b0a40294c0b10e51c54b31b4d2c21bdf65e0c9a73d4514db8031f4f2a7e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YPT6SMKY%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031633Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICGBYzciraNlQ2KDFTjQo2tuJNM1L1IVaPtlnh8iM4rUAiAGXNNM4t2n0Py5DZPdNo6rRcrFtQABUGpEZx0tecciWiqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMdNF%2B7aJ2KyB55C79KtwDnaDUiYACiylwvKMtoKWwAGxbwfFMBeop%2F0WYRDxEu3a%2Fkx4e69v02wuJ64vrovLRoVkRuw51z2bSTYwyRwcDWTxp0e1aeJpDGDSOW2iaIaRP1UmDAWDg98ZCf%2BGStrSJQjIoRvO%2B4lVuEgBzVYAjzIfDWSVJDzSaElbvLkXs%2BRH8b9iiKtdSeyWgJIcg4efJy9qohxxSCxGmkcebrMcOpJ%2FsGgFcfJHFXNajnrFhz29DnsFg6HcUhm4h5hxtECwi9xQXTDzHgz0jcUWx%2FDVQApullDNlpv3OI0tzEacy6BLLhR5wvEwwKjZh6VWH6zduWPV8FS%2FlZGvl93RVe2s1AQf%2FE%2FsbU0urY0RzvmU1H11afdh626i%2Fa95j22PVq8e7Ik9ica9rh6ZDVTUY3Nnq2F%2BYv6cU6YIZpwQsJNhy%2Fs2riOeoX0w0kFRHJCsgzEbj0ZI%2FP%2F7AJkRrSAvs8DpJJwbCYkZkeMwVjsGzs0dMlExE6Z0dwTuicBmKriUS5EbCNbcmJjPg35686jGTEJpyl2l4sEXgdv8W%2BeNqKUrVK2ulAR697EVp%2B2HkT4vNOvdSZZ4PVD8M5t7pm%2Bl1a7kANo9rqafdToFlMxtNMSZcNaeoTlp4p%2Fao0FWouPUw1vSHzgY6pgF67jUtqtysG0Eh615rMd09xRoFDH0cH9aTURxEobHjoOZox8mdbG44faoSU0VSblBhN3VBlsWOFlszDwK0bcaBzY%2FY9XmdyiKKwD0ROQc7AGDfydj2EpzJDRIn4xq0oXynPZVVvDR6M9tbfgzZpcov58kqAx67dB3wPAmzRh2gFSisqSrfN6kIUQ%2Byff2hxbK6QiydAGBwEjeVa4JWec1tJibXQjPA&X-Amz-Signature=32dec1635ec3803c980e34f03484d93e77a812cb87ba96d06efe1f6e72b337db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666HFB6C6Q%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031634Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDnhTMP0FoqH7fdrr%2BGK2xiHtF6Iqgf5GhieWfYgrEaPAIgbfoVIkfQRHe8B%2Fo12kRwd99jqhdc7iU7PTMSTM%2Bfgq4qiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMK1dZ4kIEns7gan3yrcA%2BxypmJ3EERfuTEIvEr1jz63I2SCJQeczxGO67LSxomdNRKGWiASXSgPfwgOgD6ewtT2%2Fa3zz0zpfOZncXVx4vHDUT%2Bnl5HZGyG1BFX7MdVbGcNbKJGZ2u21Lz%2BW2aszk8q8p8MlSGIRUcpa9wOnS6yDsJfSs%2BZsSWer1aYGhDEoNUFk9OrMmIaHXJLvzPgvEi7TrW6HkxRvuu1lKx5ns%2BkkZnulFIS88bEemg0wcm6Exzi0qj6liP3cmS7WIDO7peFs1ry9HfT%2FY2A2qZ6baOMq1EfpbDSLdTQvmNI8yx%2BoBl9d3VwfaERCeOS5n7eIoiXp%2BxWrRa8Fa906ulyuoeoMVyh%2BKSwdphwcrgQgAa9NA9c77euHTPoZjMrF5w97oHPRE7f%2FeOwoVm6G4V1EPiNNdVsrcbj9bxBBEytPgJ%2Bm7If25JhTW%2BIeRy9c56nfNd1sXli%2F2w3zjieaAznk6RaIi52dVua7tmd%2FjDg9dhLrI%2F%2BoXGmH%2BteRLpZpJXM%2BS0DeNEmWBpC39FZqElBKL3R6h%2FFMpX%2Fy2FXkAUbAVhg3CMgP4spqP5EOamEdaVrGy1Gb12sowuyOKz%2FcMIOBRapklxlPm4sTvbbkHYX4lMwi7zRJC23ro%2FrgfMamMMDzh84GOqUBsyWogjjA7AICRSinX2lCDP1Q05mzcYeOn6K0aOdtbqn6bv6VdU5l2diQIbDOhA7Y%2BJg89VXTCQL2bhKXH6mT%2BFfKSTJuI6tUzuxx95CIrWNv0S%2BQDQoUdxIy1hrorJCixaiJQkdTb9BK6uqJO52UmYZszsZIZTB0dWtNpbm5OZTJyZtoPdZF3tyqk2S9krSAioVjh9q9kFay5iMqVftqsbAkhmNO&X-Amz-Signature=f3c2b96ff077d75406f3ad46038ecae0de69ea0aa373d1802d400e2365955101&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPZ2ODB6%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031635Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE727WZODCTZyDqv1vQ1%2Bdfsszebt203bf31jwtbKytlAiEApnVn3hdLYCZvVYCfx7VCP3oaJt3IoI2Ev%2BPui9npFY4qiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH2tPLHECtuNLXcIkSrcAy62bvL8cSQaxjQS7hI%2FjJERjv4BI5%2BGwLcCFogHq%2BuWjQ21xL43edxQpagpBMTTUJhLZOkNCkfDS5BZtqX4hrfp3XIadAtBWYLRcEpDVf%2BIJQ22pVyBlI8y7nxUtqequRQBJecPP22OkWCW%2Fge0HaxBWnGF6jaSYeLkjbHthyAlqxKEWq%2BRPU1HxSKdrVgwymfmaWinM9yCXK0aYSyibMFQmjS8w8XyYz9hIOFGobV8Te9ISqvl37pRWbwO0ftH18HfH1Qd1rPS0pWx5izLSlffj3Zzxd1%2FNm47fctNL6Ykcy5ZL7vm8CNySqvMz7Nk%2FbXtZ3YfkoGRff3Yl7A5cYtVssAxAdJhjxdkKGvwmX3RbTfPgrdaO64sG3S7BjfIwKq5DbHAEcnhDVWNhd%2Bf%2Fsd5fLFkoSsEv73J4NMEiiARhMSnEZJDaBH0bWFYWiteVvza5wouZtk3mYQrVrqLcGpJw1QgGnqL1t%2FLhw3vLPxjvhCjrL1vinGrpcQl%2BfmYlyMltQiMYinScs3GA8oerKZyMnlxI41cZXjC53Qs9iO3hpO%2BuhPqNrYQ7XNWczopGoco35XCYUIx7hnmB%2FCuZHfrITPRWEvHppOqCQvwJwT5rmO%2Fivpa5k8rsSWMMJDzh84GOqUBwIyZwGqP3wW3025DjAR34CKRslawEdpYCtmKZuqy%2FYsPI4EM%2B087Jd2wFJFN6eM3Lzy7felqhdZvQYQbrJbffwbWue2DCZkpaGBQA18n0eQR3xb83w6x88%2FFWzT7TonmRE6q3YqvZJJ6HwM%2BrA8uY5756zi%2FPtg5UEi23pazNL4DeCCKgydOb3HkDzdUJOqqmylVlAoN3%2Fq0474qjYenqIqGSgU0&X-Amz-Signature=1c5c5864ff279c287f6f1f27d166763cd304f7f9d222e04da5656fd1cb586115&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RXWUD55%2F20260324%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260324T031601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD1gTe%2F5L2fWsNpMiY44EWZ9cmTD2CkwuXL8eD6ALg4hgIhAP9U6bJf62O5BohUMTiSY5aW509rS3JVU4w11rK4ToT%2FKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgymrFs6zITiU9yzicYq3ANMJ5ETETpytplOdcP1osWtJhthUhSip3kLnfpAx1rOo076GLymOM1e13XQd5fMVh87PafNQZg2zslCf7nOclwRgL0pFSxJcb%2B0drb7NnMREaoPSpciqlWKSowFKSZpizc6K49M3Tmuyo1x%2F5i6H2%2FQtMzWkpe0M2MZV%2BZ56ZDbJBShH1Sq0mQxmZ0XE6Ri1W7T%2Bx9Edlqp84zpsXpYio%2F83QYppeKuaNK3GZTA25D0FgoSYbDtb6oS4rN%2FIUmWRjSLg8PkvBuGRfSO738qzrA5A5iReuQ7t8CTvzfSm3%2F1K0RbTb66g%2FeLeiH16OFDeUrkj0rahfkzEl3lToIOoD93%2BhC7Wy72wIgO4wg0ma5GclmxM1kqdQNe8PY20iA6chTFaioDbGErnv8l5Aq3EfXnoEyx%2Fr5Q3tic3%2FOYqfLpJ8jZSI69Is2h6bSz70sRSaUCUzDPYTvfsXgtFZojobzUAWSwUwjB9kgjM05HJmwA2RMKTbCjbbElNTIQWkLPBdxDgZ7kPKjgv%2FXf7u20b5TeuEd6p9O0t6OlDPznM2vOWNyvClc2y519Wv9PF3T10u0lrsIgF%2FH2EHt9QyzM9s8f6wo%2FY%2FTyCAKxjWXqzm8l1QgtcdejI0p5aoca7zC29IfOBjqkARjLv6dFDJrfUTUi1ZB69s7ACloPwj5C%2B9HlTYgZ1rq0tktJx71VqsmXcgnJKPLhjY6GcluULs5P5LxJodpBhteogg%2Fu8bf7tCtQtPfLHh06QExRngpZ9yMC%2B9vLiO7QfxzkXbFDpZzUiQnMWdjYbV5GOyh%2B9fzYgEpa8vh0n%2BuYW40%2ByoegovFYxsYBWA7KDg1k%2BDP6gPV0LV4nUUuCxvA8rlK%2B&X-Amz-Signature=8d8410c9911a99e31cb8768d8a32db308655d8bb2d1d62d00215e31fceb376f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
