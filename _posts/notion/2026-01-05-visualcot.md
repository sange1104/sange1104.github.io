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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSOVZDYC%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBAxN5Z6J5OQNdxcXyaROXqcduuezzI%2BHMrOlZ3my6NCAiA9LYDfty5oBH2wS9yrnryVeNQhH9R0W1l%2F%2BLlppy2fuyr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMXrusm86REyBY4NUUKtwDmCSYMO20FrTpgu60QGETs1i9pMELe3vRKqko3fwALbyohVZcbV9%2BjOlXY0auJpBcw2zUJEevfAFWowH6OxTvMogkunJ%2BbUxciRZpGYF%2FCtmTdSG5GG2AuPK7yEmxqnmdheDG5q36qeH1hKnOHWmApHe04hUomgoF7iTZ5X2f7Nie3oK8%2Fl9T6vNEbSrE85MmHLrkb5rIZLuzjK%2Fo2X0EwlC7sfkONgqlXk0rUIRKvxBA7LTJtTsIMXjQIZzDwwQLz3e2dqoqurQ3zQBNBaqW8U6O5d8252jCIq%2BlQVy1ly%2FOyJotDvHYKagRJkslu9QWlJ%2FGBPadHKfiJYOFa5Sm0fDedjp70G0uDLul71BlJbnW%2B6faqbx5SlFX3aFHk7wcKiyCyHjJ98dnu1HdMDezntY0zzYoNNtFFPfb5XNf2R6qpiJ6X5FqEdYJPyz0qkF5nyMU%2FkHAUvdxrC23vxxjXtXrbSawrqR%2FikDge2Z3Plkzru%2BaXqeD1gKXKJVEbn4NwTWcuzhu7nYFvhsTLNzK5d57ISaCVE0tzttGDifE4rmPwNcCit%2B%2FI2Z%2FNp%2F4IcCpCyubbSeJW3VQziCIKAAGt8Bq7i7iDJFhhvsEnWpeCqp7z7MaITFqf3p4KDQwvbHxzgY6pgHPraMyw3%2B0xzRWIXymRuSwmDqzt1z0Y7JHd%2BCR63fuC933ItVTDM0mJ4gZZIMG1x2XLebV4ree8OtBdkjhksaX262Km5kt57cxrSkF9P3yUIYM%2F6YUtvnfra93%2B9WpRGygnUj3acNk%2FMWw1Yy3HA2v02w3yR4hdLhMcuN3hosdkMhKa7hu1sxjoMeF1igvvJMXyb59AL6oHx5%2FNv36QyfIQYRAT1KR&X-Amz-Signature=fe93382c1edacdc0c084befdf0756af1e95cabd3d909edd32e308bb152a491d6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WSKZYU3W%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAmZNNKxyWCqF2PV2FR%2ByW2WfovF9SvrWCqMmMvS6rgPAiAHrI8t%2FApI1YHjorLh1z%2B8RQ53Ip6EuJwGCRwVopckYSr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIM5MvBc%2F4%2FK6OU5LM7KtwDIHONh3%2FXyl25hlsXLH%2FW2HFiXK8P5lXCqNiG%2Fq2ReBqT317hkxaa9pGzBajUUkfg1zIhrqTdLAmjSviZG1O1sfTe7qOiT5iVJkGaOkqneWYUk8GRS%2BEuX39z8OfygmR1GsJMBBrySq%2ByZMKK9GfeAzut4CNg%2FhTVSEOQzSgcJNTsyFWx1FpvPi2PYJTLMK9UgfBMz40QrxTGM5PdPiUoRnqO3WfbyXZGTDguDiVAFHO9GBy43Q5M%2F7uEKrgEblpgLtv1Sw6TKhUF8lCQds2cRGRYCE8WRXii8yR879Eb0s%2F%2FW%2BD30yxF6xL%2FZpUVTzTBtjo%2BXxpqZswtxr6TAKcrOqkJEHI1GkQgwTSEimrTMlhuv8Ku0UiyLBEN%2BYwDLZJq0EFPbgb%2FKVGg2M5sSQQMoJUVJXy6h2yiJbxWq6UWZZIHqpWhJOCfPndxV04TTnoosZFQvEI9hZS9G8CikuJYrg7G9wmP65S5PgfM%2BeEA6ZrEYNOT9asvjN6pkN7ipy6O5ccTDKZ2OAD5Q3EVH8mhwnqg5qxjLUplRf2%2Fx0gYQOgyZyJUg9g5LMDFjSzb7YM3QQpTkhXIExS6YKXvF7XsgLpsLLs97%2FYbTYL2y9%2FTz8lRWtGJkkel5iD3lPYwsLDxzgY6pgHoM%2BFspdP0Qo337X7hW2W%2Fn3PeIwwI1bQLR9IJJKAaGkmpvRdkQ4BJQBELeihzfz9CpsA%2FxWlvMk3Wo1uYTJSybItU9wULSQpJZiU6012QapyWzEcsapKd2BkNbAp3ddhiFJYPYQZlZOcnZDQoAYsrBIX3fc6ag0IKKKk10pNvWfgwCRdbL36zDuvIcwGAYNlc0LiubOKjuVuRALqYfBjNNrptLbzB&X-Amz-Signature=389bb5c2e577a92fefd5254903a20584b578c07ff15761c90b871ef9a845cd02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665EVFCRIK%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035336Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDiQ%2FnkUjqt%2BMuDIj93i3SnQyHK1lCQ3GGxdxa8ymporgIgDnzO0yzkLlNmYhcHZx9P4VY2Fpj7lIgyOOpChkKcvdAq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDPElI2ve9xe8OzUvOircA01C8QrgXmYPMLx8cLFIX6zzgwIVc%2BMzZBhepV1NKQnWvyHxeGiH3nVjdBptqoPC05kyOn5jjbjqbiys%2BMU%2BBXPBEEU6O5Pebb6hCRwYbIcMSIyV%2BvMnCFA%2FyFyVs50Gcli4WjAbutIYVlllrlwJRDRMleEcJyKeQoWUznlV3Sb0xG4n4Mwh7VTdIguoYE0ZT%2FjS5po00%2BgBD45o98rzCVu%2BylgI6ij7v3RKmM819Tkghy1yc165GVId0cKgmeMUn8Ca9%2BbGdfICfqE0YmsT1G8WY1cWnORogGNsOIAIoxxoSuM3qvlxJHWxWMAmacBmiGaUgAcwybMJUaC5mg3AYW2wYxj7ErOlDQfNtOZFemQ4Cctdli%2FI63eJw975OH%2FPztGF6GQKmvGWKX4Wto26ZvOSAfU3C%2BjoXB%2BrCJdTTqm8QuCDyxOa1Hfwm22ackLbk6hiyOSYUvuN0lX2N9aninxfmFcb4o1lUWIRb0INkF0CPXiNSCFIeqqs2g%2Bv6v8HoQZrOJvQbTu0Z0pkQykXlQMbEY2YkH9DqRRpFgXpBHNypdhomrw%2FeHfA%2FHzk%2BBBO5cOncyRqzWWsPM3V3oJmt6bBvujjE1gLFq%2F138ro8gJU7C1Y7I0jxAmQ2ym6MLCw8c4GOqUBKxWA30Rxz7AzcJ5J4XZyRr5TuWpQdMDZi2hkICg8Uo63o6Icz3P9JSZk22vTjK3xr0FLTwZv4rna5cbiV3tXKDEQiNnKWtQd6BE%2FF8F%2BBczbijomP2KZbwA2%2FWTGiTBC0cW%2F0bYWoSFgJRqPebCoKLUaVVaubaFWdjWykACklI6xzSh1TRzqOv8j5psg3%2BWx3PM7zvR%2FSUaWq15SSnTsuP8ttsTk&X-Amz-Signature=88dc767929a790f88233bc69f78f307b226438764bb3a09a28093319f22dfa4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665EVFCRIK%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035336Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDiQ%2FnkUjqt%2BMuDIj93i3SnQyHK1lCQ3GGxdxa8ymporgIgDnzO0yzkLlNmYhcHZx9P4VY2Fpj7lIgyOOpChkKcvdAq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDPElI2ve9xe8OzUvOircA01C8QrgXmYPMLx8cLFIX6zzgwIVc%2BMzZBhepV1NKQnWvyHxeGiH3nVjdBptqoPC05kyOn5jjbjqbiys%2BMU%2BBXPBEEU6O5Pebb6hCRwYbIcMSIyV%2BvMnCFA%2FyFyVs50Gcli4WjAbutIYVlllrlwJRDRMleEcJyKeQoWUznlV3Sb0xG4n4Mwh7VTdIguoYE0ZT%2FjS5po00%2BgBD45o98rzCVu%2BylgI6ij7v3RKmM819Tkghy1yc165GVId0cKgmeMUn8Ca9%2BbGdfICfqE0YmsT1G8WY1cWnORogGNsOIAIoxxoSuM3qvlxJHWxWMAmacBmiGaUgAcwybMJUaC5mg3AYW2wYxj7ErOlDQfNtOZFemQ4Cctdli%2FI63eJw975OH%2FPztGF6GQKmvGWKX4Wto26ZvOSAfU3C%2BjoXB%2BrCJdTTqm8QuCDyxOa1Hfwm22ackLbk6hiyOSYUvuN0lX2N9aninxfmFcb4o1lUWIRb0INkF0CPXiNSCFIeqqs2g%2Bv6v8HoQZrOJvQbTu0Z0pkQykXlQMbEY2YkH9DqRRpFgXpBHNypdhomrw%2FeHfA%2FHzk%2BBBO5cOncyRqzWWsPM3V3oJmt6bBvujjE1gLFq%2F138ro8gJU7C1Y7I0jxAmQ2ym6MLCw8c4GOqUBKxWA30Rxz7AzcJ5J4XZyRr5TuWpQdMDZi2hkICg8Uo63o6Icz3P9JSZk22vTjK3xr0FLTwZv4rna5cbiV3tXKDEQiNnKWtQd6BE%2FF8F%2BBczbijomP2KZbwA2%2FWTGiTBC0cW%2F0bYWoSFgJRqPebCoKLUaVVaubaFWdjWykACklI6xzSh1TRzqOv8j5psg3%2BWx3PM7zvR%2FSUaWq15SSnTsuP8ttsTk&X-Amz-Signature=ea309ab309bc4ca9d252c8aef8b67dbf90e6faf0cd5dcd902f8ffce3a4913ff6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VBSA64HM%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGdCs0X6ci%2BL%2FXY3Erg%2FREYonL7GxH4pgj0gYtPYy7PeAiAy6iysvKnRX5penLFmwB7C%2FNcm8Wcy%2Fh%2FcmaFY4Z5rhSr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIM%2BPbuvCfYG38bVgdDKtwDCbTVR330Czy5ydomuc5aAtrpZUdWg8DW84AsIvgX3j%2FI9YYAyY8VvFK7AQQ6hPrx3nEO3FZDv4pt8grFiGMWG9afu0lpel47%2B3k4ED81TtqW%2FgmZRMUAdQyytWhDRiwT168xauXXeyLZcM17F6H38JINk%2FA%2BaczuMSCYfyjXp2y9rrC7HYsXzp%2Bdw4Zq5MksyPNCctujQf0ORKj9vzibQgSc5XGdX7NiA6y%2B%2B5LW85rTba6ct70kvsICes6UzhTTsiSnu9gP494l9oc6IrPTS3W9PgG0M%2FlE1hx7NTLXxBhkb4NiporHdfhySfBOkyjB%2B00FADXNgDgOCrIA%2FPimsv3gnmKBAkfWPXlCha6gnJWiuNZXIze6%2B8a8EzXo1Kv3c9yITLiaO9%2Bo9Ug3J3XUSD2NaIoXbZEm0tZAHIZelx%2BAssgnVEUUGC0YyozhITAMLKdhrJ6x3kpNp9cNsaSo%2BpUhcWw9HX511CkkTtkqOYwOcyBDCbCzx5dW461C5kIYWfqKCboSyH8qulreH7tjMWCP10LZnpP9HOizL2PgZJ028givOQ16agZwkrEFmVI0YObwb1PXBS%2F35eJBB5kw%2BcMw9i5VQkZHSym1%2Bo5PTsnVZjVH0ZHBHRi4qDowzLDxzgY6pgGVBUbh1K2FGmUx9Vl5Jj92XI3hvYxRax7IoVBRI4QIewzvYns6HWb5hDXe8bgufvFLuOj3h%2FqrsUG7NbecXOvJAMlpV8hnap9wiTU%2FLbkyrlqEdorWLZSBlKl3g7q4waChE4179vUMtK625OmMDYpVAZOv3RB%2FOsLNxWZED91sF41R%2Fv4RDkX6J%2FOkPaBxGThhOBkRCHEKX8En76ouKq8ppj8QAv4V&X-Amz-Signature=82e0701cd1b17afde7992e606f13920fd86873cc12a6b9da9104a690a753bf06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WWHXOKFF%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035351Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCqBLD5do5Njw3jp2VUJ5SMvDYniNPm2%2Bijqwsm1gFc0gIhAM1fe0UF9t%2FPRmFH30bCmGbH%2BSuTvu%2BhqDX4MPSktT4xKv8DCGwQABoMNjM3NDIzMTgzODA1IgzY2p19MZnl6wjjzY0q3AMZG%2Fh%2BPfrjNG3qpR%2FaoCJNoBwtvpDupYmzg88oRE00ijWNZjEJNHjDTXUsaxK6v76JaReAO9lASZ1k1aMBuYcSbvpPmdSvO2qciKVuiJ7Ev2qE2we4eAlzzFHI2ZWAJ24%2FVgrtlumo%2BSqBW0SdwHvvzPNRJo4oenP39JW4%2FEPz6yfvH%2F0T85p%2BuCoi4XrPwaNSbGRaL6GmpDyPG%2BXiPwj0V%2FsfeWcwmEiVt8G3g6VTILn9DekrdwV0MDYmK5i2VontHPuD4fGvLxhbkAmIzIL4kA9Nc85i2LKy9C0QdlC8uonTbU4Tq6dhODsnbUzXzo2ZuTaz1vbMl0LV3pcjCBHQLM%2BLqhtTmLSoaHEtvbpEZgcy6QIOmRNrih6%2BTLrd8m05wJnX8unEpPIUPEH6DUDAdiPjE14NBwcc9RAZr%2FXz5%2B%2BYUY0LRO5RIfZTPVjfCInwzucS0AtHQP8OutwtYjbpcoj15sQ336JMRx5%2F%2B0FZEAYKsMOS65tz%2FvuvVTRz2njLYuZ6fO%2BTaCOxBhwgIas7jO1NX7V1UQWQKcYXWrBWJ5w0r%2BWSoFboPzfhN3ZYO7HR07Qm3SW99i%2FdqQvVnhX4F77fWIyBJ37B47b01gjHb7T0xmvKCpxOBcxEPDC7r%2FHOBjqkAW15w3gkXR7DFrwZNSc97Q%2BZaBGhG6JG4wG0BNiRWJv5WioxkFLoyzQk4Ye0zuqtUJeH9paKIctYaNUrCSCUV0C1EkSHduZ23tIIYa5ZhTULjpbcaPCcUuzmFoY0kIW9jF1Pw5bm9w%2FMMoTCXHZZfdFvY7a4ez%2BRRylBWIeynGvIlOrGLVJC6ks5yE1s6NF1Ie4LChk3q37DvDWJuDW9yczlCC0P&X-Amz-Signature=56d759f27d15d19180cf5789edbb831f407c30b88b94191e1994f3f45871e722&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QT7ZKTWS%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFRSEi0Pv3LDjZtlS4H2m5Q3rgg43%2BW9SM7lOsrYa6J%2BAiAEE43OVlpfVVcM2OLBbWNzNHjsQ3I6tqY%2Bz4S4SQ%2BwpCr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMIS9A67BoId6eyQR3KtwDKZPW5fue2teVHgERsLDRRyoX3zb6haO3m8rRctAVkP3Hl1hJxmoTHVNdyxyYF48mAxH0WXoV3wwvymTDt7Jl4DjpWWLB2TQmp5ZheB2mKvLC6Ar%2F4M05LBvsfz5b0bwXCNPTmSLtV6YTb9Va61SsGpMe85bdHwNECABTUbtPHQBKXg9o2irQIXYZ6oWrTiU%2Bmjd%2FWfkBXHbQl3x9NfjjDTpflnwypnzEgF96LU8QVYTdUl5tLcK636OYDVf%2B%2FXR%2F4wX7Tpk5dUgt7Aq7VVrqETpZuR%2BxoRWnU62Clkz9KMtkTYx4%2BDMIHNIMqjXEvbDv5Pz2SKUfBymF%2BwFOx%2Fgzp2rUu2nyr6YU0GzgsTbgENHJSg8wz0cPJkptXUwjwSGpHrpzK177DQVu4q32wJ3duBgiwPF%2BQ3hk%2BDrP%2FlFFmdsRSCseikyeVzr%2BNw70YdYB2K7GcqoFKh2JVW3PU5WE2qUjaqUKnEukAC0m0RddajyHVQwY9EGPd92qR%2B7j91T77vIzYkq0FhxkqnSmMYCqXCSIWCu1R%2FgFUhbt0B80n1%2Fqi6A7gluLmdH8EO1YgmOtzt0phqEmPQw6SV%2BRdrAiyGGUzjePjY2auGxlqu9AWhy5S59t80ZuuBEZFwQwtLLxzgY6pgHegc100vssWaQbidFzPFjtuMND8XrVby9cuxrgqg21DXjjJuI4O3REApu9pgiA8rHvpFXmMzg9PUCVd3paW6E3UpQxyLEYsOUcwzX0tDUdNiUbUSOJj3esb6Eqml%2FQC7t1TqQLTcQUOSM7sbCNtxputkn2SpVKDX5%2BzNCieQdKQMuPH4yGbDtofTJ1rSNmEHOIevyaJwPQEUGno%2FFBSPFwkrBLlS8s&X-Amz-Signature=20ac7fa45ea7ee5f021f1c3e3bb2d58b7b65853514ed1beceff68aead2581915&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V4SU33YO%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCxLaIxHRRQ3VFvsDf7Xf5qxbtRtuDQ%2FbysP6az0NDIaAIgekH%2BaOzD7sRoFUnY%2FXDtrAlUALiJRW4F5%2FNlQv8xU4Iq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDGw9qOCq1%2F9FofwcqyrcA4lbdbP3nmRIHhGxXWHTCisQVQw4aiMKXORcpZl2eQmYAAjEGcjfu5DysdEivnybHhVUqVSe%2Bz5UtTM0Br6Ngw%2Fmccg6htEbfa5GnEwjjzjoNIVAclcs9Ba2qmXvKvrErXGg5PdElNFOP%2Fued823I4MJQz4PGbWPMbptwELKa2dRR4NWh%2B1o02jCD2%2F43DbvR3bg0Gze%2FTTPpsQBcgXZ9ADdVFRWLgxwH2RIVN6FmqI%2FSEggbg93o%2FCOndEJ2i0fUJcG8M7J8NzPJNKELNp2h3UoNtZs%2B3J4MpEgHcCAsUCo%2BHK97V%2FNGRE9takt%2Fe5GvWf2iUOr5AILTcyeFnRqN8TddJgxgzlY5Iz%2FT1SyWhbT5MD%2FghuTBXX%2BQGNtRbQ0wuAp8cuR6hI9fy5PWvZi1fIsI4TLoG5jT3OoE4VLIiA%2BtROQ%2BPFuo1OUZJ7k5Xe4Ie2LW3nf09%2FGOCx8hSavIzrgf1%2BwwL6dtOYbr24Qh02enqwXpLNPgau19IddPPoQvcEmPGBQVARYEqDYsF9wusgMImvsjqDq35i0VpsLoxomzP3YNjlTLvuMohjL2Z9Ri0cYRJSlmSDa1Q7eGrXfYkXLT6z5Gmv2sqF69wJmeao6jTWQmR9Q5Y1KKy3ZMLWy8c4GOqUBP7%2FcFjAvqqkxYaFhBOL66718Th3cVqzIisLKCe5GE3zzivoPrabsexTZzs8FDerZU8UJcst6dquuu2ZG6W3q6wnLzRmgLjfdd4Amtm5RoUWe5wJRIypHcm5eBPQXSzVFuJ9dhiRfRCtDEW2Ut3h3LWZMRdyZ%2FpR%2FTy2HC2r%2FMxdA74Z3rUHx4zGBqcP3vpF8VHN7OfWvWhaABf6L%2B1qXS2ZQbZ24&X-Amz-Signature=b8fcf4a4051df4cfffe7eebbd3b4db9ed056ddb82600ae9aab20b660f3494e67&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665JHG7SEP%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035352Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDV%2BD0oOT4Oq3EqlD0RtARfM19wnWs2132QbU%2Bba1Bl%2FAIgbCdnrWQXEW999z%2F7eA%2BEjuq9TYvCASInsL9glHOYAwYq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDO1lpRixGN6%2BhKE%2FIircA81SIeildc7SSuTDBnkQg6vfsdFntzzpqWJCS2%2B5BzqGbenQGGXIcitHZRV%2F1%2FeybdsYjCIwqU6CUikwn2GXEIgQ95vW%2FhU8hhGu0WUPSo0WYwgsAGScbMun0SuKVuhiCClr7OvlqAezfCQqNsHVHjE2lcLcxK8vsips0KVIq9DKcu5xJW%2FyIEQwHfyfW91tZsRNZm%2FxlICA%2BLcjRS3378crPyzPm1RYup9moIm1fUPQKegBnClmM%2BVRbXzMnWFK4G5HRl%2BRhwu1Uy41z1t%2Bs6tA%2BZvDVDNLF6bBxEmWwpCEgSiecLAaPdYXs6CiHcGYyILexfxrgD2NrUkSnhg5H4EGUn0u%2FZVB1xD9OzgyxnsyapXH3BdHGm9E%2BeOu2PVlWg2VRZf2uVkLNxZKlSUR0yWC7Vkf0oHqXnEB7EraYZC2I62hDN3vjtprTLFu910kph9UJffLZTE7ELWZg0uj6Fafvkjr2vgvi4yd7FXw3sulE7aAgG43IK7KjDu7MGxT0JNlIJN1iAEEChFytYQjIYUuUOVzM8K0a%2B0UZ2IHwLvQiHRVXzmmbsAbOhq2t6qnKn3vHeylGk9HFwRPGO%2BTnNpLmdKwT1QbzDB7g5b6L6HsGqndJYyqZ4ZMt2VUMI%2Bw8c4GOqUBhx1a6v0KWxSnUc%2BMuwOumSdZGTp5j23TGlXf3RDM%2FNSIl4cJaMpgJb4zohQ3wUJJgQQ7hfrxhBZLfLb4hmstiLyg5J8q5g3W01kZ2XVTHzBBUquukBLCuAYTmD7zgiL6NRVl%2FGFhdh1CI%2Fvp2gZnq4aUdSeaxZsmUNXEqa9JmZw%2F9kGYZDpHzirGGRnbf4pTa7vBnTgu6BlCox0PU6g3oKm5yKNW&X-Amz-Signature=5ac22a04c6f9c8e50aa1eaea65909be8119262dffe47578d644f48b11d7a1c75&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665EVFCRIK%2F20260413%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260413T035336Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDiQ%2FnkUjqt%2BMuDIj93i3SnQyHK1lCQ3GGxdxa8ymporgIgDnzO0yzkLlNmYhcHZx9P4VY2Fpj7lIgyOOpChkKcvdAq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDPElI2ve9xe8OzUvOircA01C8QrgXmYPMLx8cLFIX6zzgwIVc%2BMzZBhepV1NKQnWvyHxeGiH3nVjdBptqoPC05kyOn5jjbjqbiys%2BMU%2BBXPBEEU6O5Pebb6hCRwYbIcMSIyV%2BvMnCFA%2FyFyVs50Gcli4WjAbutIYVlllrlwJRDRMleEcJyKeQoWUznlV3Sb0xG4n4Mwh7VTdIguoYE0ZT%2FjS5po00%2BgBD45o98rzCVu%2BylgI6ij7v3RKmM819Tkghy1yc165GVId0cKgmeMUn8Ca9%2BbGdfICfqE0YmsT1G8WY1cWnORogGNsOIAIoxxoSuM3qvlxJHWxWMAmacBmiGaUgAcwybMJUaC5mg3AYW2wYxj7ErOlDQfNtOZFemQ4Cctdli%2FI63eJw975OH%2FPztGF6GQKmvGWKX4Wto26ZvOSAfU3C%2BjoXB%2BrCJdTTqm8QuCDyxOa1Hfwm22ackLbk6hiyOSYUvuN0lX2N9aninxfmFcb4o1lUWIRb0INkF0CPXiNSCFIeqqs2g%2Bv6v8HoQZrOJvQbTu0Z0pkQykXlQMbEY2YkH9DqRRpFgXpBHNypdhomrw%2FeHfA%2FHzk%2BBBO5cOncyRqzWWsPM3V3oJmt6bBvujjE1gLFq%2F138ro8gJU7C1Y7I0jxAmQ2ym6MLCw8c4GOqUBKxWA30Rxz7AzcJ5J4XZyRr5TuWpQdMDZi2hkICg8Uo63o6Icz3P9JSZk22vTjK3xr0FLTwZv4rna5cbiV3tXKDEQiNnKWtQd6BE%2FF8F%2BBczbijomP2KZbwA2%2FWTGiTBC0cW%2F0bYWoSFgJRqPebCoKLUaVVaubaFWdjWykACklI6xzSh1TRzqOv8j5psg3%2BWx3PM7zvR%2FSUaWq15SSnTsuP8ttsTk&X-Amz-Signature=74bd42ccd619a1aaa73872155fe1045f0ae038ad0847d44de8a011668c144990&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
