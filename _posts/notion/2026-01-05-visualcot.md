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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UR7VN6OU%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCID964PsntzpGy1x9FzguuVY62%2B6l8P5acJbeaqr4PtRgAiEAgf9YWLbBVhzhDieJwLpXKTEB5IP7xpkwSv5OL3%2FY2Goq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDMU4GgnvOR2ubcc1aircA0H4ljWIBivxmes9nxe12lmbYFCtDGZuXxo3Ac4ZGsPx3EqXb9jQfyDTsJSNM7H3aSljF7Cm1ahzbkpO3wZ6y%2FXy20kCrQtkyNg2NAcwfPYWZygL1DsbDu3vM1pqhKC5ov4Jt1gelH4itpCJAQ4OYJ0oRfxfjy2KyRsqIdJDPQouA6oj0tVLdA8XIxuByI4301GRL4NhpT2l3V7CAw5yAlLz64hlc1U18QgC4yu5Bg0FXtXvW4rierzKgqfWkTo33Bg2z9OzIbAZw7vpn6ftVEHlxtt%2BQ4EEcqectCt%2B9hderLkOtk2wPjwomlvlIclanyxGDm6dGgo%2F9lbFuHbnktd%2FKvfnvOwhWE5rGSmS0vS9bnaJqpOOzj1nJE8KrMMeGzirv2jeX3YXoewJBXg3z1uXQDGZSx3YPznUual82aQnAq%2BVfV1J5vPq8%2BBKz4AAEzIpR2QR6x0FKlHABtL22W7CnvgBNzvRTDZ%2B1LHJy1DAIxlV9aNKK3xZi4CL%2B%2FCanss7YHnta4qFyaFDozsV28GYSwAVgybn0e8fVOWUSQbS9Fd%2BVf8e%2BooH3v00k5zlnLABfqZBvTVgpPbC0W9DtuMw6noKIcdlA2Ad1mQZuluo%2BimcL2OuYyhY5O0uMJz%2Bk80GOqUBrfZX2Q9MT%2BOn7XDJpAGMtTWcN2a%2BtwqTn6XyIWLAVvPmpgrHpQVrAWKA7hqbxJjPeRJDNfDXMJG2CA8H0cKVui9%2FMM0dotlLyJiqV6k%2F3yr%2FkqgAKLW%2BQDQFgHTybIoJIqvTkubSPvai10HeZDyE%2FkRZCjVcuh9FJY9O0dzachejZEi8pFdvVVPF7BpHYBbE0X33TxUzFV3Fn%2FF78N2A%2BQdd7eEd&X-Amz-Signature=5655112a3153e6f1178329c24c77641ec3dcc373b912711562eea8f9534ee142&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VGPGJR55%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDnXHBbLGZUGySiTHxXGZn2Gj7tNdi6uQ%2BFseo9bR7uNwIhANJQ%2FvXaBqNnhUXVW%2Fw8%2BmnYOvRaiZ1kBw7vfBEitpKGKv8DCHwQABoMNjM3NDIzMTgzODA1IgzhWdK4CjpMisslKkoq3ANajSgkL20PfeT4dj3FIsravV3om0iUQca00Lml%2FjL0%2F731dq0cX2oCfyB4SsU3zqEL9GVhXL9Kx2aIjzKLpFd%2Bu5r44HeofEV6COIOhKNWDI%2FXefnxKjeOm6uKU%2FXks43sHGEkiv8rM4sUxeb1c0d8drfe7bDsldIxKK7fqU9BcMUJs5VIqQHXAoj6KhXRdwfP%2FO4gzhHVlq4mrQ4A84TXkEfjNtMmTTXx9b1l611ojg8z3yBtCPJKRserMJFYXERutQRIMB9LyrAKzug1xL6YyyvMJ3qepCH4yOy2%2BIv1GiA3W3Mcmz6lz4BOFmUv7jxYJCVhyVZBWU1a4MgB4TFN4zplX%2FWmQ7wvcVgnVqXOGkf62zLbccqFaaHGr7CtSmfED9oXpeOSoX7ibW0HFuInNxD%2F4Wa%2BXSIv2lvBFTtK%2FjZ8%2By33V2HY26T1K742UI2xJ%2FMOJ%2B5WmO0g49bgolmH9dkFLtKBrrUaAr%2F4s5KNSLvtiEIk%2FJbDUbItHm0HqWHJo6cqxICVbh%2F56Tuuyod0WfzMp%2FVrO9YzvLsLDL4biKWDXDxNd%2B6GxVZODmXlk6%2FA0Ie6Y%2BSzJWvQ5Fl6bQmFbaKQ9ADzvhFZKozprj941vtt1GEzayiHFc1e4DDK%2FZPNBjqkAakouZAK3cGjNRI8Vao%2BWkJvle70VDfdcDJZQDeJ%2BDgcJmdZgBL%2FNFeWRGUOqVcY%2F3T%2FnVkWGHYCCDBfYrCkmQX8R9vL%2FuzvsN4th0Ok1PwdOOyeTK6CouBs1ZzM%2FhHGt18jmpfhZKuD05lm1VoJUfs8rj1oOcRadme61P%2FGibcltJ4Y9nU44Hdyjh5xUQDrkrjmR5uhnuHpXkswdWkEVdqiM904&X-Amz-Signature=ac7f25e23fd49a9f553b66316672181fbf266f133bedc7828f5f2f5947c7e1ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RN2W3IPM%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031526Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBx0u1C%2FzvGLYnn0dAd2Vlv1DMKPfoCDfz2SJSsKrTdUAiAu8gviIjGpmUVp6WWNOhOOggbKUOoJYI%2BQ9Si20U94%2BCr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMXQCzbzUIFX%2FBzt8UKtwDgaX9JXO9V%2B2Bt7aQznWuyypULOJK%2Bpr8rG9KQgyAlzT8FHD4%2FPXaAJna%2F7%2BtjBAoyQfhonegDxa5mYg32kWcwSgFBd8wcfgaksI7ebWsyeK6aGuEvyr4Zi1p%2BO45ZMniQiJPnvM1UtnR%2FP8c9X3RbTzFcdqNmm3QS1Meati7jZvj%2F0nWbfXwMvjyV9CTgx%2BtXOMK83PizF48PhFe89rC3O5Suvx8OAKtncTasH%2BR%2BL52f0BATa56MwI2q4BH8A4IPfYWOZMdXNu4uFKPtI2QicAn8NHVSzqY2Qln8p1YF%2F1LD8%2F6AfGcqf4mzRFM2KpwlmK5ghUMrTd9T%2FOZGh6dKJQ3K8VsrGu94uxREoWyT55Bf%2BaTbMT0cv5bgLA%2BJ809x3egLrQ92O6r4ujJ%2BxrkoStNPtQqqkFagT6V%2BT%2BikmTdB0hAM527qONrpAQNVUW95ilsZyXXWF5U8JbptdN1dOgXYM8yGCSrptQoZELY1ZCyUZmyFB640h17%2Btsrfjdmo%2Btn4s41pvYr%2FAn%2Bdl5S%2FR60aQziTzgCLdUWct9qh2g14IONV%2BNxpXFelNMZe1euCmrIOUQLzDDxDJqgSrAiw9iWbl2vzbmPnE1FiH8D8D%2By890FoJtJOVeghFQw%2FfyTzQY6pgHBi2Ynf%2F0ES2uhc4o9jnHbE9Xch4dLQkggOpBExKvBF7pO2XmtllOp2brYrayarHeM1s44a05zrEerR9tC8RBGlPHRV%2BjDVnH%2Bb3poH%2BPkDhI36K1VVkN887Wxz52iGz%2FC4%2F9MrT29wMyiQazXxZUokY8iLxK1BRpeK8zkZL6J7STsJrciBGjvFDK2uj5bDDJI2dbhVKUPpCxjIFacqFKo2NrQxR0g&X-Amz-Signature=e84d162e9e7edfc8f2f1fafe5217525019df4a7128eed7cad75d83faaade61b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RN2W3IPM%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031526Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBx0u1C%2FzvGLYnn0dAd2Vlv1DMKPfoCDfz2SJSsKrTdUAiAu8gviIjGpmUVp6WWNOhOOggbKUOoJYI%2BQ9Si20U94%2BCr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMXQCzbzUIFX%2FBzt8UKtwDgaX9JXO9V%2B2Bt7aQznWuyypULOJK%2Bpr8rG9KQgyAlzT8FHD4%2FPXaAJna%2F7%2BtjBAoyQfhonegDxa5mYg32kWcwSgFBd8wcfgaksI7ebWsyeK6aGuEvyr4Zi1p%2BO45ZMniQiJPnvM1UtnR%2FP8c9X3RbTzFcdqNmm3QS1Meati7jZvj%2F0nWbfXwMvjyV9CTgx%2BtXOMK83PizF48PhFe89rC3O5Suvx8OAKtncTasH%2BR%2BL52f0BATa56MwI2q4BH8A4IPfYWOZMdXNu4uFKPtI2QicAn8NHVSzqY2Qln8p1YF%2F1LD8%2F6AfGcqf4mzRFM2KpwlmK5ghUMrTd9T%2FOZGh6dKJQ3K8VsrGu94uxREoWyT55Bf%2BaTbMT0cv5bgLA%2BJ809x3egLrQ92O6r4ujJ%2BxrkoStNPtQqqkFagT6V%2BT%2BikmTdB0hAM527qONrpAQNVUW95ilsZyXXWF5U8JbptdN1dOgXYM8yGCSrptQoZELY1ZCyUZmyFB640h17%2Btsrfjdmo%2Btn4s41pvYr%2FAn%2Bdl5S%2FR60aQziTzgCLdUWct9qh2g14IONV%2BNxpXFelNMZe1euCmrIOUQLzDDxDJqgSrAiw9iWbl2vzbmPnE1FiH8D8D%2By890FoJtJOVeghFQw%2FfyTzQY6pgHBi2Ynf%2F0ES2uhc4o9jnHbE9Xch4dLQkggOpBExKvBF7pO2XmtllOp2brYrayarHeM1s44a05zrEerR9tC8RBGlPHRV%2BjDVnH%2Bb3poH%2BPkDhI36K1VVkN887Wxz52iGz%2FC4%2F9MrT29wMyiQazXxZUokY8iLxK1BRpeK8zkZL6J7STsJrciBGjvFDK2uj5bDDJI2dbhVKUPpCxjIFacqFKo2NrQxR0g&X-Amz-Signature=352b861213316727e174a76ad34eb3573003c1868e4629b0eb824d300b5e1657&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46677DDGGCD%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031558Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFQGJcWufiRy4k%2BuK4Oqu9pQ4PFz%2B1jLggjQgvhndPV4AiEA0HE6WqGXbdg6xuYi9iHfIK7NpJWWyRAvefv91FbeUNcq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDB3RYA%2BDGfmnfn3wtCrcA260l%2FrG1NWlP6jTbiHhf4ToWt3UzYx9lGlEbzsVtzyBTSGq89mp5BIjgY9Y5xu%2Fl6vu8o%2Fjv8qpqEl21TmOa%2FoTGfZcPpAC8sXNS8DH86xYWeFcfV7K1sL4lPCKqBndzsl2Jwme9z4wI21N2Lmrx6P1LJTy9Nh28zXB7vS%2Fyedqh9d0zfvZojIv470PTpA9AQgabhgxHNz%2FALbgFxMCJapXk7VKbaxdYHruEMBEqb3%2F%2FkN0q2jCcH%2FET87rizpVLSRTbRyEVs2L0P%2F9Ubz4JJ8E0MIP6oKrVtf3Bv%2BRJTb6Di9%2BmPAwTjjaKOVWk%2B2PUnoZf63NCLKRJq32nFvQTAksJL%2FJ88reie2KL2zAboy8DsA1VjAPULMuGU09Vo2AYoKuBtnXyK7pVnHgFJtpRapfMPl0A2Wr1vylKYTXgyJ8u688rWUyfG2mO0Fil7FMrYynZEquRXnxe373OrNQp2yItm5ed9YEm2jS78T%2BqEMO3sFZgDyG3R31h4ZHbYlnBJQKqcDMae8OR8%2BlHbWZHj2N5NtPgIE6wmxJfexyoX8BXOdpsaK0GBeHsjfRhgYeSFWh2hjQEpkLYHIWo6uWFcFE26umhsmcQltHvWwiUT6DREBHMry0C4%2FBDKkkMJv%2Bk80GOqUBfyzgxGF6kcslc7jN5YGfaoNd%2BxYtbTHU2A14Gq93t7yNpwZc2QKhWDwD6XttF2lvlMsE0l8Cd3sYBVd2mJwK8t3HIeqbRe6IHlMrdOZ4TxqJn2OIfcflQbVmOwuVvm6rinly51EStddYna2e5HnIrzEygvDN8FtmMvAPw6GQWnJbc8TpM4JFkgMQ4pI8kf3TCcWxtVQImxFlxHJVGbqjSc%2B4%2Bgbr&X-Amz-Signature=eb8b210651576d48027fc505f26e18dc48521e274842809ae3f145da438a21bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UYRTIMEN%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBMzCTCc%2Baz8C7JSmpmPQpaDjegIh6BVsOVNOCY19J%2BPAiBD%2BoPOnquxIjmr34MQE07jtCDdp7STKA0vXbnZF%2FLgACr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIM4%2BKv8Shbl5Fh5%2BZAKtwD4HqFgGg%2Brf%2BP7J3lZNfjLNn3wcZ%2B%2BAyeAy2VJUs5Q2zsu8yAuSdn0ygYyfPnS4lRuF4tny8OlpmJsQ%2FScoZpk5fiKhcXr860EZl8gWgZl06mnFrCBkFXRt%2BSg8KDRoXDHJSpxX1oGiXYOX%2FoDdUtkA4RYKRvRoshW18Axz6RuXSwCgEVqBmuS4mn1crgQ8Jo1jU32UBT8A2tGayvoGjJs9mRtrl76yJD6Iu8FB%2FLg1HxFHB%2BP%2FHbt53FoOMW9xjYP1V9iX2y23qcyZY9goWFVMupncSzT7lq%2FPBbzI2SX%2BQYqFzK0%2BeIpKSK8iqsACD8ZzZvX9Iqg93xEBImMsqE11Rcka5XhVdNNC8pAbmyQe5jN%2BzANyeL7QbEcgnjDjudkU4YfakVidQhloNxg9GllCBRW72qwVC7RecMIjfl3y7ikFgxeYkHpUKNxOIxqQ6qSzZ6caV6Ep9yc%2F690S0nlUJxeCFEDLNaqHjUx4zzfq1s7kgVDLKVWOFtltoWS1BMt4e%2FRX3n%2F8OUi6JStztw9fwEhdg81McHbHd8blt4TP%2BhKaAFhJ7aznB6v6QRUoSVAL9S%2Fj4VIyNLeTEpGjJzmNYvE9djCxpZYF1aOcyD%2FvOzRt8%2FPI4jeBNxBykwsf2TzQY6pgFvCyKtWnNnvGk1cP7kvdEHYEw2BBTEEJQaZjz87JTfX0pEgR7fxXVRFDQvz94oDhvimKtgRo4KNueM1RAfiI4w6lYNuFxvrGbZTQxK%2FTNIN%2B7LmrQf06oYbp%2FAKcD6vL9TiGRCvKbrLqJI3CbrYuDjduncMPH0GiNR4At7YT1y5AeUh%2BNY%2BLcKQ%2FZtroaQTZ7EhP%2F2JCthrO50wQXuRdutiueYUwZj&X-Amz-Signature=14c8a4f743adda5bd6f3ee13b0d837f9af9b6f35012418bd2b37d1a744dc6021&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZW5EYHRH%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID1OoH1yWOZrqtAbiggp0nvLdbGWJJp6xmXsNzQycnuIAiAfAQcNJ0oZbEdkq4GTctww0F8xZ6WpX454obpFqN6AOir%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMiIugdmMKgMLgQcZvKtwD%2FTuTjewyPQFuxiachaEOQQ74kGiajl1UtvNC1%2Fp%2FFr3IwksO4J01MPER3jQAwDcHwItybBfVgjm0YLiuHqhmBVCCA29Kd%2FEpO29ixGku3LWwcd8zcx8ETxK4W8Dp9BHodFRdJEhSKM0EYBMVeSkfOskNo76g0HgqAoB%2FTZwDjOGot3VkfaeNM3GbEIkL9tQG4hh78W4ikoMuY9oBg7fn17%2Fv7F9NXpWDlin%2Fio%2FJNqJXLK0LVkxzYBHXognwmftlJ4J8Hw5OQ1JBUQyabqmFKZeMgYCQxzNTXtpumjx9t2SjmtSKKDUZbFEEkCxtGMgHW6J8SQKcpj3aN2AiXsuDtqsLxioXyo3tS21s4Bn9SZhDCq%2FjRhGL4j2F6uXplbn2N3cF5lHiGAWrOYwLnFqYvqNribS6mbUDUqFWKTsIuzhkqIqjqWA5MlrmJyr6UFrZ%2BeeMK4o6YbQLkOghfjNfFxS0ZD%2BZlrVc1WTKB3wT6DJoULVO8H%2BZtjA09VU%2BDAREMwRTtoRUs%2B245cEVEGIL425MCEIR2mQXYmLFXRsX0g2yRjlWaelRswKRP%2BS4QVSVO%2BA7EbF31M41O9oXF0gzxKP%2FpZ5B7FPD5XaQ4ZzNVzuFB5iXbBmvV7hW1YAw8P2TzQY6pgGvU6sGEIbXuuB%2BnRUaVbdNj5R%2BTCkl3AWWWw6jmxx8vcxkQj3dJBbU0MYhohNxoib854AEck4qpXaipT%2FgdKZK9IGuvvWdxeHP9VI6m0cZ5t8ZASc4H6OHAKJJjK75yhL%2B0WNf2fT%2FlAdwHrEK84AsXd1cK0rFkWPcCrNxiKJvX12zYO6hxyU%2BbIrLGXpcpjPd6FdtK2MN0u9W5xOQQ%2FGg5lnR1Hqx&X-Amz-Signature=275b825f4ee8070345ee609ecd2923ad33f640fccd75d12ed7867588cac79fbc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSIZA5BG%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHZsrEAWfOXaBWECSmSqwVvPQq71m5r1FDmns4UGI%2FCcAiEA1luxUYXpaq3dddh8SEAgTYExZmCzc7GPyfcqLHaz4yYq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDC2vHdFnPcbRD9cSMyrcA7u8Rv%2BNDlZ9rUmidzZYVW1Mize%2Bso6pzS04lPWXTFHk5buiV5e0mQJeHIb0ZsyA5Q1Xq1awnuDV%2FisF5nmsvI4GCdhgy3XPyNOUHb2SwomsK5FzyhiimDTjfE4%2BP%2FEpWzFl8pDGeEx3J6cgKCjBBrXbu2W1WN3xH%2F%2FwgpxNyw35qReWQtIsnu8QWd97Ppbq9LskHUGcj8EgCZByHsWISlvONk8O3mgnxeotUWIicRKJ2yuxJzXuMjJhD6UcT1%2BiGcsLgA61PgXg0z4%2FLMKNB9tt%2BLksn23OSMVxEFyhJOvIpGww4Nt9jJTXPISvatHX60M%2Fbdz8z4f8x%2FmuSkEUtMwKfdXpqLAYJFb3nY1AORPNBmcOdx0M0Q4LElqxcHNgyycz35jEhhp1ulrBEmm5US0Q5ldMU5qgFlOOaBO7TIWdTKP1oSFsOftjiQc9N4R9O1ikcBweZosjFFQBZ9i0FeHZmTh45maplJO8S2IKpu4ltyN%2BG8FXuxkgGCqkbg7A8FonsPrwNj2eEczyrlNIrLVgaFG2rn5Mvxbp7WnKugXDMKVV%2B%2FlSV%2F3uRk2BHh5PxBdR%2BDDjR0E%2BI6q20vAzJT1jXlVCUjIG%2B5OEQTx5Fxo1oxebwS%2BAQo4w8VmGMJz%2Bk80GOqUBIUJYNDsFhrzIjcAcaa1Uz5LhcVjo8C%2F3TsWaxyyqg5Ukf5MfgmhAXMFFY1XHF5v5owcARkNxojjzGzSauZ7D4c%2FT%2Fw50lqSt1L8PoSAZvpZZZkvgSRPoh%2ByCPxbrij%2BulR88ThdSEuubiZDokwLyQ%2Fbpx%2FBPn2lYEEzoQPwqkarHjOph9LHj052a3AJ4vHXGbt2AijvWX6MDrRprOyG%2B9%2FCdhdg%2F&X-Amz-Signature=8ea452ba03b81028fa861b00d6b492a1edcba32afb464a29fbdcd475590efc7e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QM5BFTTL%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFT53wWwXpNuBwKoQWUn1vnJhbUDWQJXtHzzuTil6PbjAiAaV7zeoVxn1L%2BVNGxYt67RXjkvh3sKIKT5%2FFKTjhTKdCr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMVY0uX0GkvvLb7EB5KtwD8G%2B5u01aZCHW12Ai281%2Fz5o%2BMZHKSsNl8ndRnwjey3GEuFnM9pygTdUg7r0A2z3eFWpATpwdbbe96vfp4R4cT570s7YoAHfCnAK0%2FR5MKa7CBREPPuUOieQBSecIllfBXXyiq4eISP7Vt1uZciiS1BKJeDr0pOMcvieA%2B32u4k6psjxNEnzlqyfhiJhhaT%2FAvgRGUPVLUssmwXtTb2xgAZbHIMoqBS%2B%2FKkzKCoyla87bg5KtEEZ%2BNn0skuMBBCEu5V1jvLf60mrQAL0uLpDjDki96kcNcU6IucN9wNX4jMYyHvMz6GRZjUxKF6GqVzlG20P92154ZEZWu6cTp9L6XBEMJTwz%2F6VQDvD3Ddn22vzFs9dnu8u6kX7q0nnpLlADXMB3TFotWP9PIsehFji%2FEqmjmmZRIC4LCV9gJ8DML4DjbO3K47%2F09jOBxLT4XJ%2FmAuMt8cOuFGmUQPuIKjw2CKBKAF5QkUIEK8pQW0MBSeWDDYXDbcWXTH4Lp0vhQ5ZbQX9i%2FK73Xx%2BvMZzhj5bIFwyBK1%2BBxkyqUFYvJcaKo2P%2B8S7TJClRLpXP4FgG%2BQPS1%2BlOIfMTr7BMkV8xhyRB4YrYlI9VPFDd6VQeGlrhY2wySH2mEx8E8dlUYO4ww%2F6TzQY6pgG1dCQaNvE108eG9a3%2FlwRPZZaG9Gg4uXgRN5lX0SgT%2BndYq6fS%2BUOaEEziMzFYSk%2B0lCGgIE2HTKnj0QoHOzAHl8A1pnxf4W%2BmCqxhVkQVQUWlp3e8xkwpbphiBTWqSa7lQtk3CS5tzAELeX0Mf3U3H%2BusDme7DB2do5s%2FSCqz20RAjtBZDjXwzU%2BUQSoM9wvRx8XVHf%2BsX00s9n3tqk2OZPvOkTMO&X-Amz-Signature=8bbab084d7adcecc3493f0191ea7fc63a98b35f49f3ff9ccf4eadf8ae90ba658&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RN2W3IPM%2F20260302%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260302T031526Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBx0u1C%2FzvGLYnn0dAd2Vlv1DMKPfoCDfz2SJSsKrTdUAiAu8gviIjGpmUVp6WWNOhOOggbKUOoJYI%2BQ9Si20U94%2BCr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMXQCzbzUIFX%2FBzt8UKtwDgaX9JXO9V%2B2Bt7aQznWuyypULOJK%2Bpr8rG9KQgyAlzT8FHD4%2FPXaAJna%2F7%2BtjBAoyQfhonegDxa5mYg32kWcwSgFBd8wcfgaksI7ebWsyeK6aGuEvyr4Zi1p%2BO45ZMniQiJPnvM1UtnR%2FP8c9X3RbTzFcdqNmm3QS1Meati7jZvj%2F0nWbfXwMvjyV9CTgx%2BtXOMK83PizF48PhFe89rC3O5Suvx8OAKtncTasH%2BR%2BL52f0BATa56MwI2q4BH8A4IPfYWOZMdXNu4uFKPtI2QicAn8NHVSzqY2Qln8p1YF%2F1LD8%2F6AfGcqf4mzRFM2KpwlmK5ghUMrTd9T%2FOZGh6dKJQ3K8VsrGu94uxREoWyT55Bf%2BaTbMT0cv5bgLA%2BJ809x3egLrQ92O6r4ujJ%2BxrkoStNPtQqqkFagT6V%2BT%2BikmTdB0hAM527qONrpAQNVUW95ilsZyXXWF5U8JbptdN1dOgXYM8yGCSrptQoZELY1ZCyUZmyFB640h17%2Btsrfjdmo%2Btn4s41pvYr%2FAn%2Bdl5S%2FR60aQziTzgCLdUWct9qh2g14IONV%2BNxpXFelNMZe1euCmrIOUQLzDDxDJqgSrAiw9iWbl2vzbmPnE1FiH8D8D%2By890FoJtJOVeghFQw%2FfyTzQY6pgHBi2Ynf%2F0ES2uhc4o9jnHbE9Xch4dLQkggOpBExKvBF7pO2XmtllOp2brYrayarHeM1s44a05zrEerR9tC8RBGlPHRV%2BjDVnH%2Bb3poH%2BPkDhI36K1VVkN887Wxz52iGz%2FC4%2F9MrT29wMyiQazXxZUokY8iLxK1BRpeK8zkZL6J7STsJrciBGjvFDK2uj5bDDJI2dbhVKUPpCxjIFacqFKo2NrQxR0g&X-Amz-Signature=923ba3822bd101f47f63398dfa2623fcf8046435af54284ae6abc34cfd665f30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
