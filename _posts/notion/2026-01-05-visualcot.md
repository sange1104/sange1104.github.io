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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XK3AJGFQ%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCMj4FpAEf05hoRtC54uc%2FSau2c5AmH99eka9XuEzxxAQIhAPMS7BoZA1In7gHHEOb20WArqrNRdpGu4yypNY5r3Tj1KogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwrpBXJwAOcB4dIAKQq3AOemREk9OVhF%2FwRozBEyXqr73V3j81osQi8teN%2FeXFjgeeT6SgncE7eo5wz1CvydP5hqkVESE%2BSd4dUs21S1vhVsC8rUYJ80gQE4oEdaGMFlBX%2FFBg9Ph7a0NgwDekDZs78csl9zE8tOY6C1nrsQO0XoV0jJZU56C7YrY%2FWoMG8U2epg1bTF8HgRVOC50NLk%2BgeQIHxA71ziwQi9gXAbDYZ7o8zRtq3DYq3hmYR3eun0Ye6vriBhUg4V5rNM4EqWL9zORgg07UrwKJx0%2B%2Bp0lYGFT4ESUk%2BaaK1tqq0vrcTlxrfwQV%2FMaIzW28IAqh7%2BFABMKxxf5Q1bBkPyQM0mbdqb1u8Oavc0eab%2FeeH6GPbb63UOMJ9yEdc7U1mBRc4JmeVwOMHmKiXJSlP0A102kL7WVOfYTCUEmsXQ%2BA9BdU3SRjDi1sKZIAa4XbVhtMndMSbeZQ5jWeIBl5CaGo73ss3IRPEDV2G3iTIgHq6hb5%2BJ%2FD3YZ%2BYi7ZWA%2BFF3FaVzv45MWStavJqb9MRN0PEpoTdsVLWP%2Bm%2BLZqpRlXGmGe2MtF5XTvOlJ6ce2RwklATY%2BP%2FSwTESrZ8jJvVC8vECIj7w9imbNggr%2BUyIhuM6BHjZO1H1eau5MXq3%2B8MYDDtxtHOBjqkAaGBJTmC4xK8zYf%2BaVTvRhhFP2YolQIGFc6eE5NtYRjS7byILC7B%2FVfSNt4BHIOUFfcgsUGUTW7%2FwGZxH5H78GvHvonGfffroVrKsCbmwmzrgt4rpR4AYNPSMWwjdLQ0vicb8rfAGnIYnDhTeqfTf0KXWGaORY1pdd%2FotniFShbEpExXvf0RWDuFtiroFLfWKvJlh1XTqh68DKubohMCQ5EuOj%2F0&X-Amz-Signature=560f2bdb30769e3bb887e4688e7e6bb9e956f949ee6d6f0f443fec83c5c7715b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TXHV55JF%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIExIjFCgqMKF0hPBgOwDuTjYSg%2FkULqut60JyPHG7HwyAiBMibm%2BU%2FzmljLGPTq9dZcpMYcyFJ5zpkG9YgqrHJHyXiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM4RF09JcDf3vTa32iKtwDAKGH3i%2FkoJ0tg2lquY2aeCaZsnOSuRLitOyQn653MntF1UE1YgrRw5%2FAgH6ft25hKgaLshF7flZTBOCdffXMng4WzIE%2FRSDTN3vqbj%2Fq0fwb9r0uL8KbeIw%2Bka7TOsrxvd6K9ukXJSKRTcfE2GQU06JzPP6CEqiUXsTOz6JiH8fB6FH2O%2Bypk%2Bs9ZgN4ilLD7Wtk5oeoY0%2BOvDPhmMsZdIU%2FdoiHjpb1Aaunyc4qh1N7wBlBdUPK9NraX3mi6Joj4ZziOIOpXnwzWyAhyuJL0Hm2JNwsp1yWZeSyuZ9dEx3VXMXrigQNjncYdQSA%2Fs2Qc2wSrYuK8gzLNJ3kRXITwFbgEF3H%2FC9hjIXNBaUC0CF4HsM05O%2BuDpyBj6TQTJARejmsz5IL55%2Bt2T4jUlZEbSubX%2BY3rxalrgQO0fBC5UbgzriGM3sNJfbzF4mhzmbeQmZyrWFwp9SmBkoYuPfozjzhnRRe2yyuESmpK5OsBPQ2XPwMB0FFxrHtbrU4wxh6EQ6fiLzhPY6%2BtP1%2FJOcX03dIbfQKBcvGO%2B%2FQqCKo%2FqPfHSPgnziH%2BSYZJ%2BVri6YzzA4ZRZOYXbWUoKSHGizbiUp40qhApXVVY5A3ztiG7%2BHjfk61iOqAmHmbFtcw3cbRzgY6pgH5Q1%2FWQ8sQivZE3NxPyQmiMxZixHpZmomzmI6DGpt2hYRCYmRkGWBv50zI5X7w05vgvka1MjP32y5IE1q3w0IgBv%2FzVtLWoupfld6laVZdKdUS0HfKG2cWE3A1M6eYHWvxbt61iybTSlEdTXWBncx9BGCXLXEbrNMZ0rn10xKY8YZmUa4JAuX0CrzrptNFwuiWRmmuZnJ%2FbtPKq10Txq4RUAke56yy&X-Amz-Signature=48329a4c738b17cbf0bbeae6ca8f302884b56810d3d9bda79f1cce3ab5bd599e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2UNCQDD%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIGYG2JTEvN6r4zZMyMC0vYnL6wpURIVPybC3cqg71R6MAiEA6xgdnWekb%2BvxOx18ahs7IxJHHJ%2BlVk%2F0f5Gvwkn0ltIqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ6OTPHKJHvM4NAg6ircA%2FuOfDVzuo3w3ntaZdVYxDiXq36WfiK86%2FripIDPgAK2zWjE5uhz9dv3vkytT8DNDCx6T4DD611631FlGi6omBhFFMnpekV4O7F2y3yi%2FA1KU5arjTwFioa3NhdAXiNg1N7RpUBefVlZiLvKylQKjfXxo9BTibD%2BEcGTlaMizBw52VDj%2FJ6SugPemI1K4k4IyybvyYIeBKWVThvlyUsLIEgrZE%2BozZDv415LblgE%2FpOphXbKFWClzV2xTQF7sYUuEnEvamFwsJ%2BeNVAJzILltdI4w%2Btf0ZO5KbieCTgquTQxyLiEZOgrkNIEHNGybA9Wj4rkPefliUQ5g8GdhSZzpGldBpAEgY%2F8PUPAYVhQCT0ZtK8sMQwh2vVspR%2Bdn00dvWEj6VKdZ4mYee82olKXW1aXkDuUpKSG9OP%2FDAjiLwIKInRFHJs%2BtD0b3OL%2BoDruupfPqlLZfFaeLIyIjEpWLx3OOrUF7GA2DGvm3s6UMsH%2FYxUfJJapz9rBHOTx%2BdSzZ67kaUzX6OXfSrwyJChopoWdIlSpUunRkDCZK7aZIXfXWLwLWo9CaKO4dTp8%2BHoxBuFVzHdIltaGFx%2BRlnq4y%2FgPdnuyDHEB6P4UKlSvwFhK2D%2BCcvIcdpwHSX%2FKMM%2FJ0c4GOqUBTcgRAdWeYxhYWcQRTQbbsaA8asEQAXXfvqjrxHPqxVbZQO5pWVnGRjzdf6e7FKlGrYeJfZLU0TzFEXlAIftBxfKY6kv13yzwCs0gSHurV6vnXs7tw4EcWjvZVht7bkbGCmjwiG2v8JWV2COpjNoQj3qhkH13PA5F9Rw%2FbArxBC0mrbxBHPmYUwphP6Cri9xUxKPc%2BfXuiKluk2I8nyLXBCoJl1Qr&X-Amz-Signature=39d3eb50759758aa623ca0cf4306746ea7c2ee66dc00ef96570118ff530a75d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2UNCQDD%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIGYG2JTEvN6r4zZMyMC0vYnL6wpURIVPybC3cqg71R6MAiEA6xgdnWekb%2BvxOx18ahs7IxJHHJ%2BlVk%2F0f5Gvwkn0ltIqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ6OTPHKJHvM4NAg6ircA%2FuOfDVzuo3w3ntaZdVYxDiXq36WfiK86%2FripIDPgAK2zWjE5uhz9dv3vkytT8DNDCx6T4DD611631FlGi6omBhFFMnpekV4O7F2y3yi%2FA1KU5arjTwFioa3NhdAXiNg1N7RpUBefVlZiLvKylQKjfXxo9BTibD%2BEcGTlaMizBw52VDj%2FJ6SugPemI1K4k4IyybvyYIeBKWVThvlyUsLIEgrZE%2BozZDv415LblgE%2FpOphXbKFWClzV2xTQF7sYUuEnEvamFwsJ%2BeNVAJzILltdI4w%2Btf0ZO5KbieCTgquTQxyLiEZOgrkNIEHNGybA9Wj4rkPefliUQ5g8GdhSZzpGldBpAEgY%2F8PUPAYVhQCT0ZtK8sMQwh2vVspR%2Bdn00dvWEj6VKdZ4mYee82olKXW1aXkDuUpKSG9OP%2FDAjiLwIKInRFHJs%2BtD0b3OL%2BoDruupfPqlLZfFaeLIyIjEpWLx3OOrUF7GA2DGvm3s6UMsH%2FYxUfJJapz9rBHOTx%2BdSzZ67kaUzX6OXfSrwyJChopoWdIlSpUunRkDCZK7aZIXfXWLwLWo9CaKO4dTp8%2BHoxBuFVzHdIltaGFx%2BRlnq4y%2FgPdnuyDHEB6P4UKlSvwFhK2D%2BCcvIcdpwHSX%2FKMM%2FJ0c4GOqUBTcgRAdWeYxhYWcQRTQbbsaA8asEQAXXfvqjrxHPqxVbZQO5pWVnGRjzdf6e7FKlGrYeJfZLU0TzFEXlAIftBxfKY6kv13yzwCs0gSHurV6vnXs7tw4EcWjvZVht7bkbGCmjwiG2v8JWV2COpjNoQj3qhkH13PA5F9Rw%2FbArxBC0mrbxBHPmYUwphP6Cri9xUxKPc%2BfXuiKluk2I8nyLXBCoJl1Qr&X-Amz-Signature=126962f409767f25a8c77c77a174582089a91c1022031ed0a11fb52f2640e7dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667QTKCKDN%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIDLaVUP92gH%2BzaKrHjy6qa3KnQxUfqeJRvotIODEEIdGAiBdClwOQVR6697vlFrGBiaOACVp5XW8WKPinSI2RmNOyiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM7LlZCjymEo%2FvvXirKtwDWUT%2Fd84oZ7vGui0B6ztfhdF47kerDUSqJ99DhHR073ZzBEue9dAyPeGcng3WTmw2M2EKVk6PILQFSLh3Ep3GFAkZrC53tPpPraWx6u%2FMdF%2B5OzyepwEQqBJJ6%2FJKBokGkFJ8GjirNuWm%2BK1L%2F%2FlmFEYs2iZi1GO2hG64hDUbSxv73kLIPKKvo9M1I5Ny1YaCoaGpNeoxy5qcITxcOHs%2BziBN3TkE7D%2F30SxVLdynL8BYed5DA6LrIUaQVqlpYui2PkcALxJ%2BaGDQvxNBt9U6CP2DlX7GUyf97gulnqvFQ%2FPZxotfXk14I56O9itAv7hvcite5m0w3pJAkXb%2BoZhczSd%2FXbVSuNXynO64Ch9PxJLw3y5T5Bww2X%2B%2FlJGQpwG4orsxgrB8%2FOWLMD0VnzfkA3L6K95TKD3Q3Io9WPKEacp6Ophi%2BW551G%2Bf8MWl6R9wbTYSE9F0%2BgNTRdbZCznthX%2FoHVcXtBdIoPffXF9KpSrQmVL4iqIqC9BhJWg%2FgswMRU0sNr%2BTux6YqzCJewMGaFk4pjgTajECsOwNmxhRuLaVH%2BxB1sYTdnMpUkrT92%2BQp%2BWczPFPXEkaMz%2BOTeYneyUF8u2KfZr9bWxn5xcEeShfNdpFPJ%2B6JtvgKlkwqsjRzgY6pgEke1ChVu%2BhfeNKHcdKl4KOfPRA5pHrVo7M4q4H3EJpmCZXXWFSzQadAbv%2FcVCt%2BAf37KwafJdWDI0fwDqnSFDdUsTOUDAoMe2ar6k1y23WvI5cT%2BeNxbzwnFV6b3a79ub6T9TF3j8czx9vf4DPXo1MI0a1wXjbfzCq1vn%2FBZa8oDJqWzDB5bvcabyzRh2F9eUXxhK0F8IzDt6uBsWNtdJLzmrhmHb%2B&X-Amz-Signature=82de536bd761b209904216c825e575faab63f04b34d1b7eb4d0f7593805da62f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUEN6TCJ%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIH2r1EgylVCylY0kIsylGzmANldUiwnrmaUV%2FlBxF70tAiBcd2Z9GnqEXFswe%2Fb0CAAGVjpmHDaHnX9inRmsjJ2JeCqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMr6oNudBykbjCjxtIKtwD3bb0hu%2FqBma%2B7Gl7zBJTa937e%2BaAasi%2F%2BaKDzRCezENZSX7ASqM%2FlDOps0EWzasDj27urTaViI%2BsMFruGtzNRmd88foYOiKFYlVT7OHs7srg9w13SSOH1wew9xIrQE7T9wYbEcGvQSSwAJsOL6gg7ns4BSHLMlJIkUYzkJH1SNtkxFrwBrUn5GLQqlpNy%2BuDgwA50%2FfYBMIGSOWQjnMCrchzfbsFgAcWQg6gLG%2FzCA%2FQV5nQ5dzUI7yNWZHVJBv7wUn2AZ7cXtBDYwEj5sL6nE4bpDUevPdcGlkgTIw%2BJpbMYaX6N3SWKCwjkcHQm3vt%2FaNfjI%2BQMoS6XbGi8SM8KwuchEi7pjX2SLTEWOKLV4TFdwGEwuj9uuBik%2FRafL8sVRihpYfz2FuKe6%2Bobbd93K6A%2Biib40%2BdRo3nJ6rhGQeALt1ZlobgLp8G8u%2FP90La5E90SDYgAEnnShloChwKdS5gdAYSdt483XWZJVyDi8q6wgV0l3Nwi49MeQl%2FLhiGy%2B3Z3l8Eg75weBJTHMKKDAZuxKofTNeM3%2FT7el%2Fq5csG2wKz9OOxy5iLZ2O62ily1AnvoUnHqg30q7SaFOy4wiiTTy%2BP94qVU5vEorLkS65c%2BNktQkO6f9or9Yswz8nRzgY6pgGMxj25vCqpdQVHf8M8R3eMiSJch0WCBHmLwT%2Bn7gEZQbOmUZbyWWECvTnLr5X7wvBMySwJz8XBBlS6qm9AujAmqMqufXoSnHW5Nqj4YOLRYjemM3IFkxupMtuM4jnuLvaroAaSE3UTrro44CyOX4xmg6TOED7yCpj%2Ba9H8wV53QwfAo2E9YiFvsOID3uPuy2x6ye5N9PAMAyAKibOnkbkQwUf9seHc&X-Amz-Signature=a2ecf8dbce224fa7d529f1d3dad09a1c9779638fe1403aa692f667525d9320cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRR7DVJ6%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIDIL8I2wRKrM208oQcYngzHJ5XqnESbhOSosgkiXBA16AiAjGjHPvo%2F6u9SNn3SUM7yJUVTAIo0cubgKKNzBrUYSnCqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMyZvAdWVeOP%2Bpj8gEKtwDp57NqG%2BsqxCRav5Z%2BVKXIW0aGbS1lFgBQGNCnD8JImzhYJ4fs3GlgtJDMnxMAOBnDTlpmFoOJwonyOsm06r2YB7Lc%2BLn%2Ffl4JEzEyJQr%2BE8RD4xEzOhoHEdvCykwUrGBf5twWALTOzsHwJQ0k3xN2NfUazxKmOBS2%2BAAE3J57ZXKRrO3bdeaSsXad%2BhbWrIaS%2BCcbh9Yg2u8pX%2FMIo7raCwHDJLsAFaeGWC%2BTmIECyEHKYPoSfzUqY1mm%2FPbJa0MGr3%2BolQ%2FkzHweicTG8T4JBYPZvhveGGD6JKzLy1ytRJU6j5%2FSwr6AsN5E7qukSM17%2BM0biWwBQ5m4SD164cVCFVY8ZBjZ3U9gIR89l0Omp1TjdeGAYGnVr8HA21MlA%2FO3Tjjg0RI3An%2FuSCaOzRxObKwqcboierKV3H71U2GuhhZztLoZcWvbphv8ZyZu%2BvOy0iFIlS4suwp5%2BNPBUhNxF1WiuAx3wC7mhTLkmduFhjsCh979IglDb992Z1CKN1tsXoFwK%2FLzTtxOJN%2Fv1oqyod2b1qxbKlRO5PWmt%2BWbhyDKnlNCqGfu3U4Y9uQIfjachziAOX6BY623CUqvMBUOnqufvTjhp8lFBAPLoDM53dkfl89qg5YpXMiaOcwg8jRzgY6pgFG%2FYRBRcO1sEnjlDbRaOi4weI3maY6Fk6%2FxzfMmNsQNiOAibz7mH81ZcSSquaLpiS8rOgg6%2FFY5DzxwGzpNivDz%2F3hhVf7P9H7w8cWwpvlEhv61ysz4sULHGEkP0jfTmEAMqqqtZHV1f4dJ8s38nfXtI%2BZMXH36%2BB6nAgvQhvr8fADn00fEpeMBtwj3I24v2TPVuLHYpdn4%2F8L2miLosv9fgKQpqPq&X-Amz-Signature=c6b44b79c1a2c002ecccb5ab54fe27bc50f7cff0872d3ea84ec3b60d172dae49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UVGXTB5%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033348Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIDOF2SAQKmJ1E6yUWmSTn4FeTDDUdaf4wUzZIMqVeuDgAiBlPXLF9fkC8kB6eyCSSin4aucbSR8gnbR7iNSp349BLiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMENgVX892Chna1T4lKtwDWJ5mAPe0kT3%2Bv2vo8v%2FEpCOuwmde%2F8MBwxl2jpSSzh6Ztlc0zM9TSX0paS%2Bc3khZHBlMvCsYulyQV%2BxBgmUWfFzFXGXslADgjY7GUZZwVYRTjDNsLgX1vUO3W53yAPv2UEnW%2BlCTWpDL7exeritgwdQVfa1MTzhewU%2FPodaU5BUxH%2BfcrU2gOveDNi%2BiUVhFFlJhM6ohJoG1%2FbYCoLslc1uavImIaf8V0ChTXr%2Bz3lJZ239LoCFLUSPbT7hwQ3qTjMrUZslwP2tUh%2FQVwWR39qeCSwEuK9f47DCUQ19egFDa8LW99SkAOOe33Q5DZPUtPuy07R0S6GAJeHzRFSnvop2fbOznykWuaPy7nAqPuWDP6yNIeUiCv27eet40AGHVPhT0%2FbgoIAwF0roeMoNsQzmh1ns2OMStAxgLLZq1DTDBDGCRTEo5festNslikH0KucET6FNPKro9brp4svdqLF2OMkURgoJAHEO1HzMcn%2FlQoN11%2BSDU7v1KehYPAOpiy09tk4jar%2Fy4b4406YI8DmhOm3OdsGA3B473IAsXrUpt%2Bk%2Bq%2BPko9zjNLz1u3dusXKXe3U9oAt0%2BHvm3RquxN10UDeJwTXdJhZhMeOoUJ5rMg7ATSE0e%2Bg06kvUwlcjRzgY6pgEAALEXwcKwljdrcoAZyIQ8qJS9IU7rUv0w2HAEbUlkpQO3LQu%2B0id7S8r5MrPbyRD%2FandcxwJaDBn%2FNO4oHP4VoHPkW96Al5m2yxA2vEpL%2B1VNzxHap7a%2F%2BYzhkzsEHtH6Bywm1FSnj7U3RpTAkRYDaXs3TwfDGS2FOadLBXnMFaUj31WddCwtxCE9H3zkiUANENVfcWY7HhoAMrwxRhUB9BOyC8wS&X-Amz-Signature=875acd6372f412e26fca308945b2c21e603df19914631260221db9e11de7907d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QO2Y4NKJ%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033349Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIAlf5Pf8IZAKkD0SUFhgUZWyBzbmc8AXuhBmLnZxYylvAiEAmUzMYi3WFBkaxUDBtYpSSsoO24cD8Jl7xlicJ6LkRBsqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJz6tmKyUxcC%2FZhpCircA%2BkSEcJPzcR8q9ooS%2BwYTbT0yvZYpKc0TEl8P0ylv8yo8rMLUML%2FoBPPaUP%2BoENId1mMZEypBZ6rNvBRbnfkFLV1WKNwb1u3A5oVgxBf3K7olH%2FVnDhbg9cAm%2BNnyc54JgCltifm3Vy0fznt2LkC6sUYm0mSBpYlDH9%2F6YtQE7gixgkEQP0WZ1IVyJCfFY2PZE%2BW8Qxny0tX4C89ki7zPSnoVC2XwWKRX0xXDKat%2B4Y9SRUCJqL8qRaY%2BeTuOfx5FMk%2Faed3a7JA0ZWvcZpQjHmX%2BsFUVzI5DONpdY%2FVS471UBW4R5NSO0z%2BNojnaQrQ98kVcGgOxBjEfajoQhD7cIhisaUINDoOh%2B%2FacMbct3d9w4usctyxe5b6neEGzSjhRt9QR7v6SB8aA5AzNkUTwaihfUOZxdZeFA4vsDLdIDQjkPCBokW%2FNx3%2BIhlOu9t0eeljqUdurC3Xv9nsqmB3yBIfyvbefrkiEsQSJgQpTDKc5SPM8o%2FqZ7LSdmrXAhyNy1FDh9Cwd%2B6TDB0j2J7iTPSzOURyRMralcWHLgJsIk%2Fa%2BG8%2FctyzeONDbh3yT3fg0YWXhH7cEl01xGJzi%2BjuvNCoKnI9e9A0Vc18cSnGUkf9hYrRY2Gn6ejjZt1HMIPI0c4GOqUBR1K%2B%2B%2FQoh6aetUJ5qN6Fbu19y%2FRNn9MNji8zDpf4PeK4oF2%2Fg7Jqr%2BtwalSDsOXjEx%2BhdZoS0o77SjPJwI%2BvXgIVdytuBInvGSEsyEHCuS3lAsXs44l0DrAX0JXL56wX2TRuO9Vb4yKlbFY4LEMj5zNK4RZ3j7K7Myzu7zqGf5frVNGD2%2FDYRzOI9uApksSJjxNL62eJzXFIaQIcsKVKZbs8Uaul&X-Amz-Signature=f74369970e37137e7ad3df730947ef622a45709715c1dddd814bd81d05a1b8d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T2UNCQDD%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T033333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIGYG2JTEvN6r4zZMyMC0vYnL6wpURIVPybC3cqg71R6MAiEA6xgdnWekb%2BvxOx18ahs7IxJHHJ%2BlVk%2F0f5Gvwkn0ltIqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ6OTPHKJHvM4NAg6ircA%2FuOfDVzuo3w3ntaZdVYxDiXq36WfiK86%2FripIDPgAK2zWjE5uhz9dv3vkytT8DNDCx6T4DD611631FlGi6omBhFFMnpekV4O7F2y3yi%2FA1KU5arjTwFioa3NhdAXiNg1N7RpUBefVlZiLvKylQKjfXxo9BTibD%2BEcGTlaMizBw52VDj%2FJ6SugPemI1K4k4IyybvyYIeBKWVThvlyUsLIEgrZE%2BozZDv415LblgE%2FpOphXbKFWClzV2xTQF7sYUuEnEvamFwsJ%2BeNVAJzILltdI4w%2Btf0ZO5KbieCTgquTQxyLiEZOgrkNIEHNGybA9Wj4rkPefliUQ5g8GdhSZzpGldBpAEgY%2F8PUPAYVhQCT0ZtK8sMQwh2vVspR%2Bdn00dvWEj6VKdZ4mYee82olKXW1aXkDuUpKSG9OP%2FDAjiLwIKInRFHJs%2BtD0b3OL%2BoDruupfPqlLZfFaeLIyIjEpWLx3OOrUF7GA2DGvm3s6UMsH%2FYxUfJJapz9rBHOTx%2BdSzZ67kaUzX6OXfSrwyJChopoWdIlSpUunRkDCZK7aZIXfXWLwLWo9CaKO4dTp8%2BHoxBuFVzHdIltaGFx%2BRlnq4y%2FgPdnuyDHEB6P4UKlSvwFhK2D%2BCcvIcdpwHSX%2FKMM%2FJ0c4GOqUBTcgRAdWeYxhYWcQRTQbbsaA8asEQAXXfvqjrxHPqxVbZQO5pWVnGRjzdf6e7FKlGrYeJfZLU0TzFEXlAIftBxfKY6kv13yzwCs0gSHurV6vnXs7tw4EcWjvZVht7bkbGCmjwiG2v8JWV2COpjNoQj3qhkH13PA5F9Rw%2FbArxBC0mrbxBHPmYUwphP6Cri9xUxKPc%2BfXuiKluk2I8nyLXBCoJl1Qr&X-Amz-Signature=185b9f3d502255fa827d51c355b9fab8b32d9f9afcd0172ab6e0826478931dde&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
