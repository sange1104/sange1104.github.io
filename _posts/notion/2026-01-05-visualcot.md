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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V5JVXRYU%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCVMGiXzs2TNRywulfEFAcSMBEXzt1uBm1XtSRbwWtiNwIgP1m9x%2BWzkUJGTA1b6crT5VtcgnxBMlSv95MwjnrB5Agq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDIOA3IT9DkhjYCZd9ircA2fcDCWzsQhVMtFWvO418dicu7Xl9%2BH9tQVvmvQ5tbNKNXQYkG2eM3dqU3yUNHB2UYPeEb2mS6%2BYI1LNIgbA825tGmMhlkZ44VoDLXc7A9qW9bTTmvf7oMgIDfmtKuJG5G0Xnr4aFP4kEMEiBFydx%2F1aTy2sSpuYYhU5VPT5PZQdj43PczZjt3qUkZA3GXQiUB5wRKG35JOEKyZGHHcFHfNDoF6U1NVPTEzn%2BD%2FGtcrt48FM2fXOnGTltNeajd80%2F3EsgOgiuo1j5XTo0%2BibdKxD%2FFIoyU7tXBdPMACRbFtz9KH%2BdRkm6D5YKYuLEJ4f7ouWW14KLDfJuqFdJnx3onzEKvmBJu1Yb2DLfWXafPKxEWZNHe7%2FkFLyHAWwPM%2FgZ8%2B4gj4%2FXfHPaT0lnkTEXoyOMQPZezoqC%2BeKujy%2FsXMDGorcqjysDImXNw5J3vR8dYt%2FbzKdGOTzRChkX8oXdvDA2yAzdpmIzUNmNY7HN72%2Fw3LbR1JQJ3ePZtjbDGETkvGogqfeDnxsRLAh9C%2BvoMJ5nTWv8600valK68R%2BCQ6O%2FLDwFJybLof80V%2BiVYxJ6WH3kUJEFsxNYEpPhxHn0esilWLX%2BYEPeLdaKToMUQ5r7%2BO9Yp9cDxRhPqP2ML73388GOqUBJPpEsX31YOC4k7WkJPGEtRrKKue7rLshXxsYo8SkGWm5bJHhPIpFWbkLiqoy8dgM4OqVjl8jI1a%2BM9EvgVNDAmz1rS%2FBfnuBLHJ0lL7MpF9KY5X6IRxUhjelkHtVWWFQ5l4Jq12kFuyfgXOzRMlpdan5dJsDHaCHvakVUDqLtGsUpaQw4R3LUqKmrqZTFBF9e8RMzf3jUMYfqyZUPN3CjPvSGgBY&X-Amz-Signature=9a6259facd6912508ad874a3dcf18238fe5eae39cfc0ecccc3ebe65e536d5a27&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ARDRZE5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICHUsfekdaZU%2FM4w1GPBgtngHQbRjFO%2B6hGMfODY5Q2wAiBEA3xWhqIzF4oaxs4R%2F7tWpuoCO17NdW6zmM3xfPH1dir%2FAwhjEAAaDDYzNzQyMzE4MzgwNSIMYuSbjHrWpVx17Sj6KtwDHGaZ9H2%2F236JaKvdeQ00iw2aHa7VTN1SNoZmSz1R6zRvuXxWb3IgAZAzTJRTFcaik%2BCEa8w7e%2BNtjmVop1AfXbctOS1%2BKfFf3r4dj83WCxtZxqKh7PAxv90HKVmJ4Dp%2FQnfewbYIM2q6sPpVhbaRmqWDRQJV%2BPwsc1RPMdFX2owKFxhtQ7bLUfSIi5zbx3AsRyJi3z%2FZAxSJQM1od4kTX%2BCylsNCFcUDQXupImrDS4J7u0Q9J8KFa8LfkUbdS71jwYC3Lumu%2BLzLsE2PK4uqldlPRMj1pxsiJTE1Z0CbOkutGc85kKHe3aPIuxJK%2BHKAxHznUhnhu72OJoR0HmUt0BADPjzxFHeDYkeaK0G5oDzzw4c2rhbWYx7qsYfBJEMtKVkHSayUxH6BmcLu%2FPLmPEpPx9F%2B0rik5fDYxBgl%2FUiXZW12sdQkx1nO%2BMRatuGVSdQV1SwGbvvxWwMUPmX3V3spvRwvxtziAeMSMpC1ZEGVtM9%2F1QF2SUBx%2FjMV6DNfjeITJJo49Mse9wwRxYsb6kaN%2FcN%2F3dBOagVHbjLYV%2BlUXkzNSHE4e9BC7txC36WqYYlYqk%2BWexfxpwCoq4PAYNqk2EIRUp5h%2BP6Bi8Cj3wUuVKskdneGfHG0KKkwsPbfzwY6pgGpZOAXvB42jAVPwu7OmOfuy7WaDo0o5ASb8TdICHUpxbKGioFXGj0nwP5YEOujjjvF6HjdzZWZmjHZPWl3LKyJOJ7ag6%2BU5xaSakPSEsH2yw%2BcC6OuVYMhAK%2FdeChUr3X6hdP0fc3t27AJpQrqGGGCGg6bqN%2BSM7quLIO3tSpEUUe0ABrWf3IoruKOJMH20genXwhCqw3TJSCB8E1icyhilZkgkRrU&X-Amz-Signature=1c6269e15ce0ffc6b20281fbfd9f45bc7f00787eddce1ce1a99b62963b046be4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMTKAFJR%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEA4%2BYNCQKhRoQ1%2BDJ%2FpJo%2B9XDMZVZoc%2FVhs6n3UV%2F%2FbAiEA2TaTYxWClR1zGJUZFIY4QXWrxJ8PjbWLdrVf5GL8b5Eq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDDPlCG7Os6OxR%2FtygSrcA%2FViF5NP4O6T1nOgu8xO%2BC2CY03vkLgSfY6Zd7VWWBN5SnMwY%2FE0E8QcgUAq5VG0D0Z6DdEyDV%2F29FvHQ5%2FY5%2BDXB09IPYBvEd%2BUv%2FUvqTyFXEIsy2glx4nYeIg1zQoDUePGauuKyCKTz%2FL6YVKzqbIrvYiOcXqSEOjcQyEowa340PpyT9wFgYXmzZxjbqQUFij1hbhJoXTKcnEZ6uV%2BIBSK4BuWQ8iTAMF7pUfl9NvOidjvW3drJfRwWyrhO%2BFmedIw%2BgHin72YAcOTsyALsrlb%2BnNQ92UgrO7TOMizWLKnuhqufR7X%2Fv%2BW1Tsri%2BcpmOdq9eU3GAgkN7y1kLiVxfe7KvPp9LQ8jrjX2o5BT%2B5xXUGqeH%2FXT5PDaTBwtjwrtEnfoLA29SjkmVlskILguuxY31rzWtQemqfaqARg9B6lpWViZ3RZyFol2WRL1cGLslL4HZXm031LFO%2BuY4kRQ4fZFePqpUh0a7hR5p8DHYdpUvKp1%2BmMrc5WOb%2FdDEGXqsrCrPEOCRgFJ5RUr12FoIYEPZA1F0R38uB6uhYKI7%2FN5cvP9kCAa8Q5aHIP0V0KjFVG%2F79G4URgIV%2BMwzd84wo867i8aZha07XIQovZQM23c7mI5Sh4Z3Ja%2BRChMIr3388GOqUBinL8qtwIh1g7gVAYWUcSS8Xso83e9NR1NTYEPBY2NoCYFIjqGcP4toMfHfmQuOVNy6i2vGDleDziUEhvgatHe9OL0ZtPXxI2PCd77%2FPzDO93GvBzEShcmAcZg%2BflVlnk3gg0tYx5GIh97ykQ7pT4RdfTkpM2d5nMx13Aqftmu988XqJsmmVYFSY4DZYDKxCskU86oMzNeSqvfpC9qgDkiqRcw8bD&X-Amz-Signature=cf142e343b9e62b0226762e83cdb204798bc77521a4f68169146a744a4d92a31&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMTKAFJR%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEA4%2BYNCQKhRoQ1%2BDJ%2FpJo%2B9XDMZVZoc%2FVhs6n3UV%2F%2FbAiEA2TaTYxWClR1zGJUZFIY4QXWrxJ8PjbWLdrVf5GL8b5Eq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDDPlCG7Os6OxR%2FtygSrcA%2FViF5NP4O6T1nOgu8xO%2BC2CY03vkLgSfY6Zd7VWWBN5SnMwY%2FE0E8QcgUAq5VG0D0Z6DdEyDV%2F29FvHQ5%2FY5%2BDXB09IPYBvEd%2BUv%2FUvqTyFXEIsy2glx4nYeIg1zQoDUePGauuKyCKTz%2FL6YVKzqbIrvYiOcXqSEOjcQyEowa340PpyT9wFgYXmzZxjbqQUFij1hbhJoXTKcnEZ6uV%2BIBSK4BuWQ8iTAMF7pUfl9NvOidjvW3drJfRwWyrhO%2BFmedIw%2BgHin72YAcOTsyALsrlb%2BnNQ92UgrO7TOMizWLKnuhqufR7X%2Fv%2BW1Tsri%2BcpmOdq9eU3GAgkN7y1kLiVxfe7KvPp9LQ8jrjX2o5BT%2B5xXUGqeH%2FXT5PDaTBwtjwrtEnfoLA29SjkmVlskILguuxY31rzWtQemqfaqARg9B6lpWViZ3RZyFol2WRL1cGLslL4HZXm031LFO%2BuY4kRQ4fZFePqpUh0a7hR5p8DHYdpUvKp1%2BmMrc5WOb%2FdDEGXqsrCrPEOCRgFJ5RUr12FoIYEPZA1F0R38uB6uhYKI7%2FN5cvP9kCAa8Q5aHIP0V0KjFVG%2F79G4URgIV%2BMwzd84wo867i8aZha07XIQovZQM23c7mI5Sh4Z3Ja%2BRChMIr3388GOqUBinL8qtwIh1g7gVAYWUcSS8Xso83e9NR1NTYEPBY2NoCYFIjqGcP4toMfHfmQuOVNy6i2vGDleDziUEhvgatHe9OL0ZtPXxI2PCd77%2FPzDO93GvBzEShcmAcZg%2BflVlnk3gg0tYx5GIh97ykQ7pT4RdfTkpM2d5nMx13Aqftmu988XqJsmmVYFSY4DZYDKxCskU86oMzNeSqvfpC9qgDkiqRcw8bD&X-Amz-Signature=a6ace86a3f9cb1740314d9944e636b6c3725d226f5f4ece210e1af313ee67d35&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YKUI2QBK%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040915Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEAK0rRtxyMK1X2Cvn%2B1TGRa%2FaZ23OScfobykTUfEbgYAiEArDChGF8NIgFAggAOmNRG%2Bfv%2BbnrieQjL9gVSPCwIyTIq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDInjsnLktvNB1slXDyrcA8TcIqqdFZp2%2B9bnaNwlSuW3d%2Bn0Tk9XMjUKOPq%2F570BEBW5NeICa7CNJcUQUnWso1dPNL1vi%2F4ApLKaux%2BG1dxZPhSkiAXg2qZAX5S6L2NR9%2BI4QM82VyURca3FjkZmc1CJ43u0akK1VX4uLDrsq03lRLRJB2I7gKeiUGl2c18hMPvNI64gVRRH1TXgoJBVps3v3uQBYqhd%2FZqpQyhylJ%2F9Ay8OAiyi%2BvIAOeaWSDgKaPZHkrcZWHHpyU942t2Mc9BDbmbgvRy9hChL36euxorRhKzCAges6Ig9%2Faw0tkUkx7%2B4hN%2Bjak1Pl%2FBlUSQAW1o2M%2FE5uEa5u0FH65hLTPKhKk%2FdsUP07XTzfe2T0MVOSaumTY7wDqA2MQvyMdbCa2BbpoIfP67jajdunxwIzfwLpY2ClJiqBbKYDetyKUS%2BPZEYlOItmjpbclMbzxxw3u6ZEVqslH4me%2FQcTFgg8u6aIYNIXPFW2N9fK6BHTBxvxCVBG%2BdQbxbd2DM9rlW2tuUbil8unsTzaqP48TDkcF9eZhkCS%2F1II9Ir5mxa2Bb8ovAqhurStIEU4l8%2F1TvClyAftgT7AgJ40n1TKu1jk%2Fs0HFfxrLRdg9Sh20PMKQYr7eJOgFqfxhp7j7IsMO72388GOqUB1Sxu8NcDBNPHald2Tgp8LRjf73tZPmltyI0k98yIQSCF9Bvc4oHlFjG9Qop38VSYvCT880ijFBl%2FwGjR%2FnGbXDbQ3dApzN7mZTwLYCYaCl%2FFHvK2JRWFP23fxsqlokkrP7YyiXDmSEQpdshUYAe2flaaokxmhwuZUhb13vgaKsu24Kd3uB6I8DZuzwpi9vxdQMYhSqjeL22MaaFRsg0e%2FteSmXTJ&X-Amz-Signature=990faddb5853fcc991d93d1b69d3f304356bf4cf9c705cd545857be290b82f32&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RNVNBZ4V%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4lXU%2BYq%2BDvJm7gVaye3nA6slzhJ7V%2BiwggAvHB4xwNAIgfTvKpAZgVdgZit1AHFYik3WCPhi8r5boZCnSBGJlqVoq%2FwMIZRAAGgw2Mzc0MjMxODM4MDUiDFBrgw3dIs3byvexXCrcA5Yax%2BTh2BN7AA509nYyY1I9DEBSlC8ci5Tv7%2BsjpcCiGhd0OmbpftpUE18Xp0OOpsxdaMgqIGFUngPY7ewkx%2FDfSgs0R1bz4zMO1YUasQWYM23%2FOwgD%2FXmUHGdOLIjE%2F1pmoXIAbPlk0xlMp99TvaBOE5JN4EWIhTOxmn8Idult8x8kGVF%2BovSptBwx%2BC8LdKjwDHtC1GaFKD7XKkUVN7LQpZTvhjZ%2BwI5sWZyvOS%2Bbff8Eb05ev67taY%2FEaR4UyUnwMRgpEK0TPSMqbUKLzjUYRiFWCG15SIof%2B2AXCQaazjCMcWvPhASoN9rNORJHuLnjJNgigb%2Fni1Dzt53fQUop9ygsXqfpVpQm9j6b%2B%2FyThIMpxPVyhT4954h6hq4WsENq3oLVUZ3FwSiI7BCGQRFN14Vk26tBOeoQ0bh8fjV%2FpJt6H%2F2LYy1Kae8PmigG2dNPPLUpcoeIyUxiTPH3Z%2F5zFxIg5wcUfg1tNI64SkofuWkOrbPv6zPyklZGJh2djP0GCih7tZaNhdFCgq7h6WEcxbnEMx5mWv28Upno4%2BPJFKRYI%2BbFuCXnM9ntmBtAc5WH%2BdEosEYFatoY%2Bqd%2FjSLIDLu4HioWJhR2TMQtPHD8nZakLcmADn%2B%2BoNT1MLSr4M8GOqUBfljxoQZXqCaDRQW0XLHw7PxRKyvsx3iMoX3BDS1Iu6xE4tKGR5dj7wU496SDyiT37z%2FjwwQBwcEx%2BwxRNATsp21GHz%2FYZjuEnC%2F%2FEyBGlB1OHE5ZeB8xVtL0UWh4sVSHCcADy4aBolNqcC3HnWl1qVg0wcyFwxv3rSUW6%2BXUiP0wW2zdxcM2gT%2FQMCnQ3ZO5lwLNvqr7l%2ByI1kVic2nFRs9RLcpB&X-Amz-Signature=b5ee664bdc71507dda5c9227b290971119eaa4e92e78b3ea062d0ce690279871&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XONXZNYS%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC0OKUir73o0JiGFDYca4mHcgrbD68k1AvakUKXc89BwQIgLkasBt1g0R1Ad0rT%2F%2BNk0qdinhdbc85SX91hK%2BS7TDkq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDB4kQa6SrLzYwSdcVyrcA%2BqB0QmpO9IXz0UI2UQTQ43sDT0ZABwDzO5cUE4%2BeeLJqFxq0tDWD9%2FFPKKTF96nnEYBepiLss6tV26gsCOOYJ6cU4WUOSm1C7pcgMuMnBVEIFZSpuZtoPWzpNap9Pr%2Ba0VROyRWuyltwGriCJS9m34odJyE%2B6P%2FtqEQVRay%2FSEVlhSAyN9TsRCnBiMJ1OLuqiCvptuMH6Bx0hilNAjXbP0LPLoGOLdcUFLfj6m%2F6qo7QvQ0J4sv%2FH9it0hzcOqf%2F30WlN9bgWXBHQidmF713EvVMhBKVJ%2FdHJ75y631hJY1sk6rPX3K1VP9drT0a%2F%2FGlLzoaZLbzZcs3pDT8vCqKlOC3Fk8mHNiyO6zagoxwZdixr0taMrCJjTm1cMkWyaeid35UPQoSzGjzLV5FEGMDESwJxOsKhSf23cVsBcOTJEoB0ri9QwvFZO1ZbPOZwRMgvY1xUFguQw6gsAOD4DsJxTHIyCSOcGkeqydMzZK%2BcIY%2Bj7g18y9%2BlYBQPi8eSph5AaTeOjzqzLE1VOZMBLiVtw1%2BZZMQpMKIvVyLyfLgMTjxFxSgKkaX%2Fru3uqTMaZsWppE%2BbZC8QwGSO2BlJc7xGcPq5OD%2FSWLYepshWDZrmHjRk4LrY2yI%2FcktiX9ML32388GOqUBACkdeaukvP2u5bBeR5KBTdC6PCnwFY%2BjN%2BT7r%2Buj%2Bax44eNx42w1dzPaMd65dTLjhaPJHuRIk3Tnjy4xvwAbXJC0Jw1IYx0ybTNYuF52Tc3OCPc0yXHlbpzT8qlXpaJKjuVx6MXTXs2DqftnsYM9rumEYUq%2BOCBi0nGH40wFSvFYyzXCc2GqbG%2FGjiwiMR64DsOBXc3mCR%2BfKsNvm3Q6ivCd93EX&X-Amz-Signature=750ac659d242a3b0c62201bb9cf0c687500ee5924079c5a7fd391e60b8d6c165&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZA5HCICB%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF61KBYAOMugRt2kKwcwlJgG%2BmFa4kiK0VPkWdIxEEFhAiBgpXwzdCBRQuXSF9Y%2BUAyBoT9MkiHqh7Kzpvf9Sm7Doyr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMkrcbA7quK2jRTNv5KtwDNp%2FWuHV5duyPsACdaOKX4vK4EsBBAtepPKGYzL%2BO8NU6RfHG7qmdnz%2BUDfS5wWD9sYmXI2mVrm3IivibjeBQO50yXJGf8QazRz5hTHU9KrO%2B%2BDCrptgU4hy62C3L%2B4moJRGQcyT%2B5hcHTYF2y6PCZLJqx%2BG%2F7l7uGmkKHVopJh3XaCcNuac2VTNWwcJGma79w%2Ba3LzSRF%2Fm9qA0ZF3uZNg9D9k4Q2a9093cE3cleQjc6AYbuNf3vBSptBcqRRefJL4rUpDbF%2FfARVKhzq0HfJrt1yvDqh9Ixi331BrMbv7qxw3lcD%2FYNg1UXeAaQJMWZFZEiKM0p9JI8Og55%2FpzV9lyvN1Z17%2BOyfaAa%2BH4dYkSIGY1LigPVMdGBHROFqF5Qov7zddKXh4dv2bTa8kXSkP2yzYZim5EBE7wW8eCStJiu9Xbb7lwNMsPmpJc6apxldtoAGiTtHzfd2XPLHxrE8USAzutKLo3BEvnxdeR3rVh38%2BO9TrbFtQCBz7lQIJgAYABkMAZyeLFedB7D2dAVh5miFRe5uSAfo47NMSx4tXyzWPqtGn5A426eay1AiS5r54Yr0l7If9fSnT%2FsV%2Fkj%2FJeFiMV6LKaUjfUx8ZnqqfbOrI1O06NfHPcutFQwzZbgzwY6pgGsyLqFBL%2BugbifUwPxbB6NsaYGcy9IrCGbHna1XZdxOwjRBqjf6rsiv696GeCsqSJvI7nUhcIafWemSyD6e9nxWIlB0ARCLNuhwH%2F3rIOYE58NxHRxDeG8HALnUSG53insHPkN1w9cP0tGMYYKq0MDobQlaB38pc1CZUngGSV3WktwWrRsczIFw18BYyzdbm%2FATuRbZ%2B62dBZYv%2BuKuFkk4k9wnAKy&X-Amz-Signature=780ea0b460f9676b673d9129b269a4a99bc9a2be679c31a70daf0248fadb82fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665X75QCP3%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCGC13%2BhcMMTgou43EtWG14qdyTz%2B9SA2CjsoCuP%2BbQ0gIhAI7p6xKegHpS3NGn7WDIQ7OANI6FpNr5%2BkS02LAb9RqMKv8DCGMQABoMNjM3NDIzMTgzODA1IgwVVwV3lLBvIVSseBYq3APcO3jPySul3PyGhzmirtXD8ejUPjMa3HanCa4gnLVoMd0yXzcrABQIZLF51rAW%2BbJbiEDAtHnabB0sHQMBR3pgXZKTWeCP3%2FUxMsoK5j1UiD4TJy4eHoyyc7t7AjI%2BWKGgaXeDpQQWGSbjJkU33VGOnI7psFk33D%2Bti%2FXmsnDzM9EE9U61fmZfJG0drixANlSgn4maigOKd2bWgL2mYt0UtFegDJGJ34Dn1dQG%2B6xbO%2FqbBz3nMVnj%2F4Wy6jTHsWDoQm%2BPizI23quFM%2BTd0ewnpxBcxcjAJeyDsB%2BozoS6WaPv4ro0RpUkFnMKNB1s6MJ7I9U813p5EUFGIathQdzl5kJa1%2FtKtbmnDvZts7Awc23TtnPw69QItrsYEkqpJ9QVu%2FOGJS4lfc6VgII1vY2%2FEmSdz5OwQBtRfed3EoGWp9tONr4gFpyxrGkjSTMdDfCv0mFieTopBFX90sZiVWESScUogGDPj%2Fp66EQwMZwTmqW7Z%2BHB5OqAoBd0UxamB5lImnanjRsbZOj%2Fy8Je4BVC8W8RKhZ4%2Fpe8dyMdyqw8zxifJyCq2iyklmSFDaWfNXfrVuEA1%2FouiANSHsAscTAkr3L8ANxgDBaVlAB3PmWD%2BVyt3RI7JnkZUhv4%2FTDa%2BN%2FPBjqkATGvuN1F0baDtKUkL7GSYrZfz5nlU%2BNmjeIyEjw9kxvw5I7KwcD1Haq2qhaIrsF0SiuhoYJfpq5kP1ZX2w%2FcfiAQlXVOnZRPHog6Pp9HVGUIMjMHjP%2F0GaxHJxvZ%2B5uxkaMPI0Yzf3fRgxVtuwSKjZIIOnJXvh8FPz3j9IBhC%2Fc9kMPd7jZfkOwbR4OkAmO57Rh9Z6381qHUKwnE%2FJaENuiRwUQW&X-Amz-Signature=f49991b8ed0329f966da627ccef3b7cbae961508639287670cfb155bda3cbe3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMTKAFJR%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T040905Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEA4%2BYNCQKhRoQ1%2BDJ%2FpJo%2B9XDMZVZoc%2FVhs6n3UV%2F%2FbAiEA2TaTYxWClR1zGJUZFIY4QXWrxJ8PjbWLdrVf5GL8b5Eq%2FwMIYxAAGgw2Mzc0MjMxODM4MDUiDDPlCG7Os6OxR%2FtygSrcA%2FViF5NP4O6T1nOgu8xO%2BC2CY03vkLgSfY6Zd7VWWBN5SnMwY%2FE0E8QcgUAq5VG0D0Z6DdEyDV%2F29FvHQ5%2FY5%2BDXB09IPYBvEd%2BUv%2FUvqTyFXEIsy2glx4nYeIg1zQoDUePGauuKyCKTz%2FL6YVKzqbIrvYiOcXqSEOjcQyEowa340PpyT9wFgYXmzZxjbqQUFij1hbhJoXTKcnEZ6uV%2BIBSK4BuWQ8iTAMF7pUfl9NvOidjvW3drJfRwWyrhO%2BFmedIw%2BgHin72YAcOTsyALsrlb%2BnNQ92UgrO7TOMizWLKnuhqufR7X%2Fv%2BW1Tsri%2BcpmOdq9eU3GAgkN7y1kLiVxfe7KvPp9LQ8jrjX2o5BT%2B5xXUGqeH%2FXT5PDaTBwtjwrtEnfoLA29SjkmVlskILguuxY31rzWtQemqfaqARg9B6lpWViZ3RZyFol2WRL1cGLslL4HZXm031LFO%2BuY4kRQ4fZFePqpUh0a7hR5p8DHYdpUvKp1%2BmMrc5WOb%2FdDEGXqsrCrPEOCRgFJ5RUr12FoIYEPZA1F0R38uB6uhYKI7%2FN5cvP9kCAa8Q5aHIP0V0KjFVG%2F79G4URgIV%2BMwzd84wo867i8aZha07XIQovZQM23c7mI5Sh4Z3Ja%2BRChMIr3388GOqUBinL8qtwIh1g7gVAYWUcSS8Xso83e9NR1NTYEPBY2NoCYFIjqGcP4toMfHfmQuOVNy6i2vGDleDziUEhvgatHe9OL0ZtPXxI2PCd77%2FPzDO93GvBzEShcmAcZg%2BflVlnk3gg0tYx5GIh97ykQ7pT4RdfTkpM2d5nMx13Aqftmu988XqJsmmVYFSY4DZYDKxCskU86oMzNeSqvfpC9qgDkiqRcw8bD&X-Amz-Signature=296671f72ff35806c97a00fa1d618069755f2f8df1e9ab2c3aef56a23789fb20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
