---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [blog]
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665CRGXWBH%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE97sJrn4TzrAGZLlk9KB2IawtDG24yhm1i%2FZsF4TucMAiEA4KZLx2NvmO%2BKWHJfd5CgghtVF%2FFOFvDv7JzYJmhbFNMq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDCDgS3hT%2BHIaHXyyRCrcA6ZvfN1KZ8W0SJ7H3XLcIXG7YRiei6xD9vscwufP2swWpaYgYCpPd8cT4faTT6WesvbKG8E1zjDXoDgdrUZ1GA%2FThH1n4WkTYbAOOFKvgiinninBlp9EhBZ5x8dS6TiP5XyYTd80LLe3EuCxv9p33B%2FlD67sFt%2BzgyUIcO77OmIxueLaW5mBGZCkoGmiyWesWhJOgo11g1idqs0jLZPgXuiaxxuoDCs1uKm2Pivl7clJGCKjDHiOqLhGLcZFRXtRIl5%2F8U1aNGTUWKpOn76zqnZnaYKp%2FVUee8ZOeWjcO8NmLJiPLcqzCkETBk4tEjP0o4AaTLpxkrv0bC9oNPQ%2FTQ0Glk7IcTjCJ06zuSgW9ITR%2B5bJS93%2F8zrx%2BxOzWLMSKwFGTEY1n0RjKkBpokDtWo%2BHh0SA1cIUzj3cmO1wILu8qEdiDzzexsVPkUXVFiO77NsvuGtj8wA7U4jaqvVidCzoeELuoYM731N7g61lEEUwMomJnUQatdRtU%2BCyLIrELPm12ybK2kTlxYwidYqASvA9VRUOqutQItlZfba6OZk%2Bd%2B9d5sJ5KpMMHEH6B%2BMI8XeX4w41xJJUh22N9A1H32%2FJFsX3orwP8BNr9ESeV77qdJqmDhzsNEdmAE9OMO6f1MwGOqUBk9jApcgUPDFqFkyn8Ud197tMICKtxeTRIqZn78OywJJ5gCKYxZyeBXDBlmttnn%2FamRmOZ17%2FX6U6UfTCeCu7kljNSFH2FrZrOnI7TmuR%2FK5A6pZQxWgm1X9%2FH9EFzrlEVrMop0aaS4mjqA%2BRr5vHiWH2i1wQDA7buKtnlxoHPYMOkJ1gs59Z8glLgjeviR68jwJwvL3cKRlH%2FVb3Dn%2FN1UE1eEPm&X-Amz-Signature=90893617788540724e7c30cfc43797d05da1c7b7435600cc76796c19208eca8d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDXWFNJA%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031726Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBtbCBWk2QjRbnv6kqOHTOI78fPy7V%2FYUuuPwH44f3D9AiEAkOGrCdLX%2B8h6jHpBu%2FjdPJyxOHGF76NEli1YbGRvujMq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDAIWhrTmCUwv2nh8OCrcA7SOKhc%2FXSTLF9ALQUQ26696jTFL4EDl4o0BNKNMcfxOxBMu45z1uupp9vHpwgxwuJ%2F9BoN2kldOy8kEw3SzTzUIkmKnfTPZD12tzDsFFtmcFNTkhY0isgOprakcu5auZQzKytfdOOADfUlR5hZMXR6SwuNhzzUSLW9mYi6MiBo4dv1wvVOrkPWiXEnsD0k25MVWTyV8DBD%2BBHwJXtEYkKZEvvPQiPqKz4sa8C3MPdoLprhHiQXXO8ebpggR33o%2FwJvMrrBgVBGzfmnM%2BPAm9fiIwKtfK28p48Ud0CdZ1FhV9r%2BIkH%2BZpkah%2BCCXIOkEEBv65RaUhRSd7Ec31DUSgtuZbxIkm8EPXnQ320iAoZRmhR4b7MeIQEB3UKi7Zmth%2FQ5wEu9vmI%2File6evOe5YpRlVqN7a2sZI24UaeksksKmS2QUHPo6cw7JM%2FvYgj%2BqAmlWgx6WBXd9rer3XipxCnROkKOiSXdbg7O5%2FZc%2B%2B9mYxhSJ3U8gsEK7EBZMTLFnojQM2hBAxs22xMSqy1xTnemlmDIxO6OzlvAJTZ%2BsRQ5ZKb6Er7Kk4xPa7Ht%2FV6W875juskygKUugh%2FBdiQAGlnayZqACkW%2FRVvPAMUgZ%2FM%2FUUWfh0vE0t3nxpK69MOuf1MwGOqUB17aIt7wjGJxfW%2BDW8EuvlZhdzjpN%2FEtLCG04xr499KxXu0TmZOc6dbbLAiVar6tKxsndH03JeAYezfsy1IAI5JhSDdk4UZMgGREPplxCA1pos1eHEZeJ48IENUDJa%2F505MWNBvI%2Bzb7%2BXe0RcvXkWHy4gxeqUQLCrrER0PXA9wHrwf3pF49iAPaFkNQi0xrSIo1zOCM779dzelD8CDZXk%2FF2fRG6&X-Amz-Signature=eed150c7bdcc840f2ceadc04382528c9984cec50cff9b3e4290e8a28d2994243&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VOL76FHD%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKZeahvdpop0fUFTL5DT%2B7AE8T5aKEEbHIH%2F5GpahClAIgBDzxmfdOHvPq6LRiOPZy%2FiqDl%2F1lAXN1ncTA8T4TWfIq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDCVblWdF9tbt6vFk%2FircA2SbU4go9rdnW0RVQwImn4qrFAWhEuP3krnYgqQ%2BfZ0GKSWL6QOOa%2F6b0OEY8mbw9HiQWGwDbbZhion4MXufTw6IAi0Qkwysz4HlXnKlr8s6Cz88s2f6cy2ddiZL0SbJJ4VUFKVensX4WQB0o1TtI%2BmZw4HO5YdcyituvIR0UJ6M69r1kbGoRE3M6av4e2CBrW8TSEwM3SBVNA708fyyTMVbFZhzFT9Z4pjPBuT5cSuPx%2BqC2w%2FJminNfBisR8BdK9WffFfyNsdGGSEJ5o4TujllMnulYedy2MyoZ4NvLSAeUc2VOud7e94XwMqp8Zt3vwr9mK9uQYauFrwY%2FX8xhDVob7hdgbtmZty6PJeiBu5Dbvv9QhQkHqr1JF1YUo49IAyPRMntYKSdNwEAqE4lVkxPTI311eW5o7c6aD%2Bp77aN%2BYDSNR6grP5NoIOMOhKZqi6lmuwsOGXJi%2F60bwGknTsn3WAq4p2fHvs1L9GmoKKPnYYpbj5PBNwEB7OJW8mBWG7ciIsrjJRVdsXJfjNVozAEllQnmDtevil6kTnfvmlQKhDeMFT%2BbtSci5ehvuFbxxH2vHiB732nBhA5AQpz5hDUuZ5EdyM3dMZKEc%2BVq0P7%2FeEgecn4%2F5NhaiFgMPie1MwGOqUBKBr%2FtncWEXD4ioswVK1CHEdMxBpgkd%2B59gCziJJs2I3XF9I7B%2FmHmKhJaAvrce9794bMM0Y4CiMZbj6rjMh0WDD5hy%2Fezjbu4UGJHLA3%2FTTTEqwamu0hOUCU7bLtxBEZO8OnmFIpPAh8WjM6X3Ws%2FkVZq6oPgbSva869VtPpHYTnlWzHFf%2BPrXQ5a3Q8aEgWKOEzZtqYohsZTMkL8edA8podKTdO&X-Amz-Signature=39e5864bce3c672896c29058a156ae335901b24127c48f0c425069d0abe0ffcb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VOL76FHD%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKZeahvdpop0fUFTL5DT%2B7AE8T5aKEEbHIH%2F5GpahClAIgBDzxmfdOHvPq6LRiOPZy%2FiqDl%2F1lAXN1ncTA8T4TWfIq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDCVblWdF9tbt6vFk%2FircA2SbU4go9rdnW0RVQwImn4qrFAWhEuP3krnYgqQ%2BfZ0GKSWL6QOOa%2F6b0OEY8mbw9HiQWGwDbbZhion4MXufTw6IAi0Qkwysz4HlXnKlr8s6Cz88s2f6cy2ddiZL0SbJJ4VUFKVensX4WQB0o1TtI%2BmZw4HO5YdcyituvIR0UJ6M69r1kbGoRE3M6av4e2CBrW8TSEwM3SBVNA708fyyTMVbFZhzFT9Z4pjPBuT5cSuPx%2BqC2w%2FJminNfBisR8BdK9WffFfyNsdGGSEJ5o4TujllMnulYedy2MyoZ4NvLSAeUc2VOud7e94XwMqp8Zt3vwr9mK9uQYauFrwY%2FX8xhDVob7hdgbtmZty6PJeiBu5Dbvv9QhQkHqr1JF1YUo49IAyPRMntYKSdNwEAqE4lVkxPTI311eW5o7c6aD%2Bp77aN%2BYDSNR6grP5NoIOMOhKZqi6lmuwsOGXJi%2F60bwGknTsn3WAq4p2fHvs1L9GmoKKPnYYpbj5PBNwEB7OJW8mBWG7ciIsrjJRVdsXJfjNVozAEllQnmDtevil6kTnfvmlQKhDeMFT%2BbtSci5ehvuFbxxH2vHiB732nBhA5AQpz5hDUuZ5EdyM3dMZKEc%2BVq0P7%2FeEgecn4%2F5NhaiFgMPie1MwGOqUBKBr%2FtncWEXD4ioswVK1CHEdMxBpgkd%2B59gCziJJs2I3XF9I7B%2FmHmKhJaAvrce9794bMM0Y4CiMZbj6rjMh0WDD5hy%2Fezjbu4UGJHLA3%2FTTTEqwamu0hOUCU7bLtxBEZO8OnmFIpPAh8WjM6X3Ws%2FkVZq6oPgbSva869VtPpHYTnlWzHFf%2BPrXQ5a3Q8aEgWKOEzZtqYohsZTMkL8edA8podKTdO&X-Amz-Signature=f27fecf08f45c3c5ecca1ca96ef8829e58035a6651b7dd92455f8115e5628372&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665BYN2KH6%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031733Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJFMEMCIBFY%2FLHuMf%2Bsn%2BYHvQbTBMF8hrQ%2Fh8dPQthq6jH9gMi4Ah8pPbBtLz4dur7bcmdps5ZW1VdJGxXzOH%2Fvye4LisCUKv8DCFoQABoMNjM3NDIzMTgzODA1Igy%2F42ZUPVnEYrMBJAEq3ANsji%2BB2nLmdhBOlrRjG%2F9f723i2iHCF%2FS2iWglWcu5DGwqnzoQG1WkIp8qg1ulVIRQASUZStSCacTG%2BQ2L117%2FSVUOnk4Do4bhi5miaUPEzG9WDTxl5RiuXHR8z3abos3LAay8ctoFAwA%2BEbOhboRNwuG%2BhRn7d3QvP6zoggEP5NZqn9fi%2Fy1yyAzTP1Ek2WvLn1Jba%2BLCdKwbW5rNyK544dPi7W0ErY%2BSLVx6ZjBzAx8HvvoOvIQNwSRTU4XuW%2FIM4C7qNob7Wy%2FtPmt64Fz4%2FZOFbJUqQFNtcosPw6tF6Xm9blCo70I6NG6SLQq0pRHyguyU2ycnUdKWpoo9LRhCHaWNdGJSX1pJZ%2FFCOcUvcoifqzuOW%2BFrczvL%2FEfKFgdCMYubniSKspEx%2FARlUYfr2tTDN5UsWnjTb%2BZpTTPSd6hwZ6iANgCO2BfxbTwhi7RxjhWrljbP%2BjSAQXOYC3un%2F3wbcAdsFhQZQWdnH880Dh8oQNcLW%2BS%2F0YDOKIwZ7Mj0JkMFysqjGjmW6nl98LDEHp%2Fo0OwOO6gO9mM%2BvWNST5LoD2ZrQS7DuHj%2FuKcgnfQITCfbaMdkAbBkWQ8ruINZb%2FFq3S4PhLaSdjqnNQSpaTxOwMSeB1CIkDLS0DDun9TMBjqnAdqQ0ELnC5QLdxb1yLya15%2BE4h0hBnn%2FuYxKvDXkGxqfuIj3KsFU1rSJF%2FXcImIi%2FDLJTtd1%2BKz8pZ35Q2PucOKZFTpcQTAAJ1wmskYAqgbN25WdfFEKJJqtcKeizVKPXffMouIn7JqfprDhrlRQUjIT%2Btabxy867I9lywhH12jhK7lDSwC%2BoMyBWSOCtUL26Azc6aPFu9pcX4pxeb23KnG9WM5Xnz2B&X-Amz-Signature=30825b2044870476ff227f6f38153eff1ee02f995b790a5eb469bf1c401d73a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWTPYSX5%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031737Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICcggKurLtwrmKXz%2BEoUw5LRMcLkZaDA2zikKrFmBsnGAiB5m08RBY6mBR34O6gYtcDlv7V5jbLB%2FK0%2FHFj%2Be6bdLSr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIMHvgU%2BwRfHKr1peg8KtwDxnOba5QyEhZS1WwY9zhY5AkBzGZzUORFV1NxLqLOnf2tg7e72w%2F%2F0x6rp8cF6oaqcvaZSqRZota2ezCnHWBN8k0CF2Z9B09IfRyfk42F203tqObxQOuXLIyCMgAHGeqeOWEH%2FqH9RfOFFw2z1z70oVEqq2OG%2FllhfYg5mXhs93N6ZHaqmvKs38P8%2BOE31eIPupVAzAMXP%2FfbBbNJy%2FxXDi%2FPX7d2LuXslciWHVwoLsTkdWkeBL4qf2iTFryUhlD6%2F%2Bk9CljLPRSFeOqXAMQLAdXIxUZmLTRFZhw5h31zt8D6TMszbvLY8CHlmzRZS11yXi1vxGWddTl7qWJF3wuMEYVxpdkTkBqlb3F3mgmeUdeJBsdpKWqyStIvE9eoGIfN6MMWacjNWyf%2FkBr8Hq5FxgqxsZlnLT8JQtEuOQdBhRSHbtQ0w7OwVmIoODPx2s8OZEHGYlUP8FEMNUn37DOAkLSEaAfFVWCE1hjXy4qk9U2S1powAMnSGuMHYFukNw22C9AAE6WnocEjePU6ImEvHXPjFoiRgyce5wfCWfgorHLZAnxPLOpj%2FDQz2VXUDTqWT0Fv8foa8ZtbEQxP1fIYXsQ%2BiYga1JgkMmbfLm2Va4kh6mqOffIs5mNkra0wvZ%2FUzAY6pgHPjLlUxp11x8Ab0ECmV%2BREsUCsMGeOVSsBUeGwJWv4au7gCvUrIvybUDlF6xv6mWVyFdpMS5TDQiCn4JxwHydwE0eoNnvDYyqA7N9xoTFmdwBKkxK7YV5jSBxvyilSIjQfwqvU5UtEttG7Zr%2BZAela8U7J5Mun650sTKvwNt%2BNsT4VTHSPo8X6N0%2B9W8mSXk2lhS5YqQ7ot21ETKxCqInxjNHH%2FrQw&X-Amz-Signature=cff4c9dcda482be3de2f97c4234105af23d5ef3cb0fba5b40d588422b5256ed6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMYRH3PZ%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDfWdtVcfx3BW7l7RVBElJOdpO3fRLW2fqB4hJk6UcHPgIge0ROCciSNSaIYbppTMxE8YZpuemTQyDIkHWaPU2ezu8q%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDLsCKrjHabKaxL76nyrcAwno1R%2BIUqf0C1FUxoVCmYfu92z87YXcRw2kOkxiTYAu5nYjrIT0xZW3bt6qmUO8EX2BbsFgZDJynQrCMfH2Owhqar79btgntTG%2BoJeIsVD1rI4JWZgH3x541o%2Bhka38xzpb4ds9R4PSSwAbzMup0iVnTbXCDPagNM%2FmZZ6Gllf17RiuIEcVR3bTFaJSC1CubNtH4oXXnhhAw0kXYF7w1IV8RWm3yPY116GBgV765dKWi3SKG1s2mIIvjFNFUwraiwl9Xt0CgFUqgWd9PR6QO9REZRSxUAsN1GhU02yp4E9nEj0rXJ1n8QT1cQowsonZWafS%2FwFz1IK6evP2vMoiNBZbJI4e4yAsDMhVYInYlL1IeCRLOTJq5JGN0Q1OxJIgJS%2Ff8S%2BGx16Zk6exw9pZWDiry73y1zSK%2BJrTeQSaHwrAy6T50hXD1x5nKChRZ%2FkZ8FCTbAyINdD93wCr%2Bh0GXYWXLW1RJ3NHTwB01pJVQriMbcmyg%2BGGO53zYXmXzxszmMUEv70ryi1XkkYl%2Bb7Dne8YDCY8R%2B1JQapt3JY2uP4a4viYqn1HKqOjjohJtksfmOocw0lRcHIQ%2Bf1VxKzjRm7DDW5oyoU0KOaZ5TP4n31kg5IHnLlk4T2Nk%2F2MMJef1MwGOqUBmOx4sqKIWfXdgc8m1ePRYp6abl4KV5NQn%2FEl1nc7l6jbIfQkwNDSKlRTch2GKc4aw3pFxYgiWNc0QvKT3JX4JViZNDdeOISaBpjn7%2FGfRBpFhi0HumkmnhGNvv7XmyzvA3GOiSkEz2K%2FyY5ooy4VdsyWQ%2BDNXaBVoGTiRMRI%2F3RpgTkPTyO9reni1CZ8jlzGQBsFO5pmdjQPRyDtJAMmDmFf0ms3&X-Amz-Signature=faf2628a584542b56074cc84f9b31b1c0e076ba29d718c72f1a416b2951ae709&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ULQ2G74%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031738Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDRV1V7jUs5AC0wjeKHFBWgNoFoYVfeYLjFOLvxyU9L0QIhAOeoyAJy0Cia2qTQMmDr3kEWpGxkT6j22IgsNXogNh5qKv8DCFoQABoMNjM3NDIzMTgzODA1Igx2wmPgdpqt2e8QNvMq3ANhfMdSQODJKrqE935yw46Iez7sL4ZvXgItrp4FxVU6fLvv0kUmpeG4jLmJKX4i%2FRh4tXD%2BQ2hqVNR8UHcZlAMrnAk7hOvzZgb%2Fy5klRovOjjbjxQc2tZhXQJnw4409yPk%2F73ufqPY7vyjTu2mEFq9R37AbzdUxXUzGT0Es7Xb5ExPGR3RbNu4TcIQZoLscvXZM8G%2BqKetcGe8aWsUPYwgXP0iEbNuD2SbhDPdLKR7Wx7zyDMeeVURhmlH%2BLaZs3lVUpYAMmJ2LzglBwO6WmZvwV4zyJsZ9861FXs0cgoXdfbH58MOo%2BVL4j%2FUU8FGRmhK3yXoIxOnmH23ZFL%2F148CMUWsFjtUoduzyTlqF%2FMhFPstOzXAP870CVhtSGQoQ6Ol1xPc8doUGCxqf1K%2FabkmQIlvBi3HK9iy8l1mdb8%2BL2FT0obblTQTjrZf0pL2MdoUVApX3hAgkZDT3xJVmuN0wdTVKPHE19oG1k2opt8Og0w2DzUJaGzyNxY9vBLf9PbBFBHEZjWz7osL%2B4fH8hE95c4F2gKtVFGzLaywHwtUnoBP%2FM7ienUPWowumOP4Oca8ncPuNVS7OhvSK6HgfnqcdgVN6oC%2F0m4HGpQxFauaAsJBoMKrVQ56BfIltujCzn9TMBjqkATLi4NeyqJaDKZbcA7rHFwn5RoBq6Ne4FoT1oebU9%2BuGR%2FdKkL9VEtjqX3KWFpFNkSyIvtu9Gl%2Ba8ovWH5PErPfYdcvIKlc3gaM0o8oP8S5TTeXdPnnfr3YetMcGrPOAdoxycGlxmdCMNXP%2BqOoK%2F8Lv7p%2F4WKm1sfaupZiTMg6MzABIVe09o7I8eNzXT%2BZ75ZSoQ3LM111Twjk8J97RAm7UKOOi&X-Amz-Signature=a11f3772e9eba1ba35a15f3141e5d3d12b1feb1c96bf4f7362c7e2fe7382487c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZDBWMY5R%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031740Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDhzFk2m%2B02YaY18DzaX2RPZ9cE9SxaHzjPUx5j7PNzAAIgN0q6Yj%2FF2RGFaxddtSXvwrbfAuv1DDshHymyQw5IDDYq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDC7eNXjc1ZqWzZ%2FENCrcA1%2BOgLqKrKaeJdsCVoj%2F7JSqszAzmtrtQZGV2bk6Xzg%2BKyDMfpK%2BC8AaE%2BSJrgMmfmmKjfy4esKPlmhd%2BP%2Br3mRlhdh9BQKuooj2ctRXZ0fCNr3OXXgdky0zbHpaA3k51UWdOWwlfYmaqotkRQh%2Fttzwa95Wo3PQAiyp3S49FWGiRRbUqdsd60g%2FNYtuhKXaeo6R0E64hvFxaE1mcxHfwYqPIMXPQLEOtJFBqHpTfwW7PCpi5tvLsR%2FTAU0TvxYpPckq4CcCj8WE7%2BWmbfe7x2Y0zau%2BDAct1DkUgn8Zr2f1x%2F0HLclJ%2F04qvEgIvCY58b4%2F%2B3Ap7yib3G7We0Hh5EGXY3HFtxkd2eO1L21ia4IuI4EyqebFyjbFq4Z116Dn5qcAkfR3BVJA%2Fk2HqagLNcFibo1ZymqbC0ND6IJaNqt%2FK4Q7CsZXZU1RV96Sb%2Bz6XH00XqmVCAnd2v6qVseOG%2Fm24FVMp1%2FzWtR4c5jBnVCFaWRg7wOxBBjppia4PaGnIJUSRZJOK68TNu%2BmkKERxdKJdnukc4qhMblznSghEXYtpYoWKXYpBY3DEmS%2FhMOJFgMFVadlF5hfv%2Btky3MuQiAwKoL2OE5NuIKXKdteKCOPR2evnq4F9kOADdk7ML6g1MwGOqUBMDCi1oRvCnaQFTe4wyhMA45K70z3LG4u5syI2FwMW%2FqQPyauvdr3v3CltFUDE7BsS47PM5C5C%2B9lffapH2qYOywkMvIWvLRePPoI9yeY5r7UJVdkcjs6HYcKJr2tSqlT%2FB2Eu57KwuqGTZbDtmOx7OCr4WiBUzDIdPDnhjoJwBBltO4JwyjRjMZrhxqaDqJFD5Ov0d3ZMr8x4O8URIZ8kUlzfwVY&X-Amz-Signature=1c13a3a48e9dc81334d3e687f062c1bcf4c0ccf5846225cff1b2e372c73c1415&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VOL76FHD%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T031717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKZeahvdpop0fUFTL5DT%2B7AE8T5aKEEbHIH%2F5GpahClAIgBDzxmfdOHvPq6LRiOPZy%2FiqDl%2F1lAXN1ncTA8T4TWfIq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDCVblWdF9tbt6vFk%2FircA2SbU4go9rdnW0RVQwImn4qrFAWhEuP3krnYgqQ%2BfZ0GKSWL6QOOa%2F6b0OEY8mbw9HiQWGwDbbZhion4MXufTw6IAi0Qkwysz4HlXnKlr8s6Cz88s2f6cy2ddiZL0SbJJ4VUFKVensX4WQB0o1TtI%2BmZw4HO5YdcyituvIR0UJ6M69r1kbGoRE3M6av4e2CBrW8TSEwM3SBVNA708fyyTMVbFZhzFT9Z4pjPBuT5cSuPx%2BqC2w%2FJminNfBisR8BdK9WffFfyNsdGGSEJ5o4TujllMnulYedy2MyoZ4NvLSAeUc2VOud7e94XwMqp8Zt3vwr9mK9uQYauFrwY%2FX8xhDVob7hdgbtmZty6PJeiBu5Dbvv9QhQkHqr1JF1YUo49IAyPRMntYKSdNwEAqE4lVkxPTI311eW5o7c6aD%2Bp77aN%2BYDSNR6grP5NoIOMOhKZqi6lmuwsOGXJi%2F60bwGknTsn3WAq4p2fHvs1L9GmoKKPnYYpbj5PBNwEB7OJW8mBWG7ciIsrjJRVdsXJfjNVozAEllQnmDtevil6kTnfvmlQKhDeMFT%2BbtSci5ehvuFbxxH2vHiB732nBhA5AQpz5hDUuZ5EdyM3dMZKEc%2BVq0P7%2FeEgecn4%2F5NhaiFgMPie1MwGOqUBKBr%2FtncWEXD4ioswVK1CHEdMxBpgkd%2B59gCziJJs2I3XF9I7B%2FmHmKhJaAvrce9794bMM0Y4CiMZbj6rjMh0WDD5hy%2Fezjbu4UGJHLA3%2FTTTEqwamu0hOUCU7bLtxBEZO8OnmFIpPAh8WjM6X3Ws%2FkVZq6oPgbSva869VtPpHYTnlWzHFf%2BPrXQ5a3Q8aEgWKOEzZtqYohsZTMkL8edA8podKTdO&X-Amz-Signature=01add8dac8d39e82594f5f01d2e6728442518f46596fdc8ce1cecb41dbd69299&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
