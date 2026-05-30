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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46624LNNVLO%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041938Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIF4g0M2jy5%2FvqJvhcg6sKGpsjoJ7AMxsEp%2FTbmvoqH%2FZAiEAp6b3I9%2BD9ugJ3gP8tsmsPfUjAAB1YMaDDQi4nslGY54qiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOwYWAjONf%2BZSGN6EyrcA1RNgTXVJ%2BNjmH8gaHPXJ2lwsUSqlh%2BdvlmSTDPbINrrfnenSHqPt5NA7sZ7A0k6SFVuQG8Uwc2KNdRyjgHP7WHsZwVcUU7l6dq%2BLl%2BWz8nM0eJkitPcjJUfN9APWtctk3OCgYz1CJl3eEJ5wL1U7FSEkb%2BcZuqhpn5WPUMDDu0i12JfYKWGnEgztD0tQdUfOFttTLTVlQ2atRvbAGiNpXwjUSJlNo9iB5%2FA1Az2TVBw%2FW073Efs%2FMrYBatkNxPskWbX44POgvMLDLDfD9FHitoVSikKYfNp8j4yWfYY0vP2kaFNeV74Q8KxV784fQm0x%2FVUUMgB%2FIVFLkfMJCYR1sBxbWMVoPOziJFCeozgRi8cioFqJnme%2BaJJ9jC%2FNL%2BE50ZBepSQDJpTp%2F%2F5sP4JEhRKCOt5K6k%2F4lv7saFkB%2BcDubWBw0SVWxpIcMmAb0BXIq296C2gFPLICinHPrN7KL84GImJ0VZTyJ26GBrqekdu%2B9YjdRnXlYy5TPVhkBwWKAx%2Be3uSnJg3eQj0qynjs2m%2BqTHGU3d0r7SSPizQFXw%2ByWZlbBNyhVkvJ9cyboOJkLWQBoKKDrgGqFgK69DEcjAVfmWa1WJaKkEsHP%2FT%2Fyd6RPqOalscRMn9K8Q2MLGp6dAGOqUBCbxiIN%2BDVkch5TqImdVgoR9iuNgv23sMdTsnW3x0lQQbh1m0nNSmfrUD6WgxMWwdaGTeWBzmg2Z44Olu9l5AL%2F5h84NhR0oOMOZckxAmEYRu8H4v9lJHG1JO8dqGvOeSOn7ROCMdRv%2FU1V4nJJCsoc7c9Qrw8q4B7qx5qlcJuoXRvv%2Bd%2F1JXuiiingUsbxwBNSC1xTS0ts0OVxKWWXTSa%2FTzz2gJ&X-Amz-Signature=dc0b74176a9ff8e8562c42723509edecfce0f66dcb4729c7b23c3ff6a1bee1bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R3GGL4ZG%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDdZsSX8dCSYcKuxtEXyONMHhMaELD4bjyH2H36hpuBBwIgfCvVkLNGFrBv7VaOz3DF9i6%2BYPSFiuzQdqTo%2FuVEBokqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLDUdfLu%2FPqWyEBawSrcA2K6fZ%2BpWXrk8VSmO9eGy8yoPATbMwprJbjMYXONoE3Iu3qz1pJ1%2BKboF3dzm3DTWuPIHUM9XA0ri4Pikd20dLpfo4BWU0JZNn7hbD4Z0Xqj6UdxkVL3rn42xyqiFxwfBvxPxGx7HVCOlQ9WImWVxYNyD6FIMzHuJrYqECmwjBBUmDJTcdyjnUzSZrPfCw9A%2BQ%2FKAPTA02l1eXPngEr6ux7bSmykns7lQyxN4hWWzagPhpOCzbccPzrCD7eX0pC9kfSY7W96PK3R5bUBnjc8VmGY44nKChE9%2FFyG%2Bv8TxAbhmliGaFEeyAxYdRTEvz52uTA%2FALRqlYd5CyfInsUtvmeW1V06Jo80teA5cbfZkWraCpM7Iho2hFjIfQIx9aGjFs80D9KxqicsF9hAyHEuRYUpiXL0L4o%2BhCrvjm9HGEnl8WQZgdk5mlo70eV4ePSoTsJ16o%2BFn3vUfD6LhF3I6Sv1BO0bJwYilNdz6IWkvD1t9XL1Wa2ACRB1P2dyhFn6NO%2F89fF8L6ZqNtYy1vExJrZ8OCrhmCM47qCFtRA19zWvBS7Pp0Ovi1Ielwa7cqfL2TdeDt6jM%2FZkskxv7lIbs63Z6Wtu%2Bhpqt4vDQ%2FszcScC6IQzMh3%2BIfGG1S8iMPOm6dAGOqUBt9Ehmjgoe0W0LEkKmVWJ1etSfFF3W%2Fvf8V8KmtOfxLZgtn7Iz3G%2FDQO2y0FUe6%2Bcepmn%2FUwaLyZ6tTDdvh68R%2Fw73xoM%2FfPDAwDRDJowqHKScByJdaOdoKaqoOQTuaKJyu8A0GJyRwEedc028G5gp2vMlT0BuiTg0u6m%2BU0g6sLFqwIcd5%2BkBcbf5q%2FQ2sjq9r3DNB6IwKkJub14%2FuEmnnhLiiVR&X-Amz-Signature=c13626991d54ac3f9a0d26d949c5034870129ad824c28d5787756e2505be7fa2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YPRKBB54%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIDV29%2FuCR9J3aVZYaNDLY2Xzs1TQRVSXWWmVRcsqkqyrAiEA5RrLjKhTKvGNqqcPbY4wYHsRNynNAyXIJ4BWhla5mSkqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLtLQjn%2BsuiVpTEjYyrcAyPAsDxakuwLvHAQjSlyU97cbT5a49kyFowaa41yA1S3kZQSX0Wgffi6oLSGApoKRd88OwYNlANgmAk%2Fo2rNInI75ifDlG%2BpxQNW%2Bs4IfdJwjkmGSFK9E7wQ12wFZiWzalJBQcU3fh2RPWUe9RgdV4XedkuD6v5nblB7YajxjzlT4drxReVt3VLDOhzB6q5gENd%2FsH197YqFmCOtwiNZRI5s3v2mYmxzJ89OmsNAxpdNJgSjf0pvFpQfrtBnTPxIREyMqhH3wByw6FAQlSo%2FSrCiND5mw4VRVpwl0heb9tCqiF9cEV9Il8G8UFJeRxISu4AdxTg86oMYLHIDGyITM9eRt8opzXEn6BS7R1dFHjob1FJv8cVgrjukwMwRkb14QCeLBl4MuwC1kiAiZ6Xw8d0gxKC4rglXAa6thDHBmyjbHsiGyoq1mAJhzX7ecLcn1l6UBn%2BWTF9cAw0nyIzRwRvSELqyrIlXIFjyzEP7Jj4B929SAOoYdBkoMQ5el0Wjl7bKXTXCyScG9R54YapfLOtCo52YQoyaYbEK6OCx8VSwxAKmaNVfUnxK%2FHLS8ct7L28HA6gJkMqxk0VDky3NgOLHpJo2YCGqUqavSi%2Bil1LtBxGf45LZ8WBx%2Fn8xMIqm6dAGOqUBoFLjnQgwOD20wRlH4vhG%2FO0GEBg0qbmK5FRQYbjlu1dUvGCH6QiW1FWe9SIIXQBpi9ZmXmO%2Fm1D0PyOQq09gWgOk0S31DPqv2f3uLviI7AZeA7ZC3wcNks0x6C8g9eZfk7SS%2BpRnK0FZI45zAEiqi%2Fe6wVEpN0%2FGshvhydNU1aImuKU3SHgWEFI4tzXW%2BV29ZFXJh07%2BjXYwVo0fD9cNnMxT7gai&X-Amz-Signature=f56af8424b6c6e37108c503fb97d8521ce12e346194b82566cecca6f0a544e05&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YPRKBB54%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIDV29%2FuCR9J3aVZYaNDLY2Xzs1TQRVSXWWmVRcsqkqyrAiEA5RrLjKhTKvGNqqcPbY4wYHsRNynNAyXIJ4BWhla5mSkqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLtLQjn%2BsuiVpTEjYyrcAyPAsDxakuwLvHAQjSlyU97cbT5a49kyFowaa41yA1S3kZQSX0Wgffi6oLSGApoKRd88OwYNlANgmAk%2Fo2rNInI75ifDlG%2BpxQNW%2Bs4IfdJwjkmGSFK9E7wQ12wFZiWzalJBQcU3fh2RPWUe9RgdV4XedkuD6v5nblB7YajxjzlT4drxReVt3VLDOhzB6q5gENd%2FsH197YqFmCOtwiNZRI5s3v2mYmxzJ89OmsNAxpdNJgSjf0pvFpQfrtBnTPxIREyMqhH3wByw6FAQlSo%2FSrCiND5mw4VRVpwl0heb9tCqiF9cEV9Il8G8UFJeRxISu4AdxTg86oMYLHIDGyITM9eRt8opzXEn6BS7R1dFHjob1FJv8cVgrjukwMwRkb14QCeLBl4MuwC1kiAiZ6Xw8d0gxKC4rglXAa6thDHBmyjbHsiGyoq1mAJhzX7ecLcn1l6UBn%2BWTF9cAw0nyIzRwRvSELqyrIlXIFjyzEP7Jj4B929SAOoYdBkoMQ5el0Wjl7bKXTXCyScG9R54YapfLOtCo52YQoyaYbEK6OCx8VSwxAKmaNVfUnxK%2FHLS8ct7L28HA6gJkMqxk0VDky3NgOLHpJo2YCGqUqavSi%2Bil1LtBxGf45LZ8WBx%2Fn8xMIqm6dAGOqUBoFLjnQgwOD20wRlH4vhG%2FO0GEBg0qbmK5FRQYbjlu1dUvGCH6QiW1FWe9SIIXQBpi9ZmXmO%2Fm1D0PyOQq09gWgOk0S31DPqv2f3uLviI7AZeA7ZC3wcNks0x6C8g9eZfk7SS%2BpRnK0FZI45zAEiqi%2Fe6wVEpN0%2FGshvhydNU1aImuKU3SHgWEFI4tzXW%2BV29ZFXJh07%2BjXYwVo0fD9cNnMxT7gai&X-Amz-Signature=5a50d6e4dbc2baa332e58becd14623417e8cdd8e2a4fdcdd44b1a35dbb525462&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662SVGUVSP%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041948Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIHDjOnK5lXDudDqJvVvDf073jeJfSspm6BBvkebiCh6SAiEA7jr1CmthnMG064VH4%2FpWbxtCqh2ncYXG%2FYxMrhXknUwqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL1x%2BSu9K6RUEg4zbyrcA4HOJuSC5MVe7OshSpur%2FJiJLMo%2FpKAlbTvX%2FwVv%2B%2B84yyFSGDPZ%2BtXYHmlUSc%2BD1Okcsv6jZ3%2BWi7XZwMX5bucKJqj9ZOzaN6K%2B8G%2Fb04j5j6fLKPqSdcj3fpbYmkIFgmddfyA2ROZJ59R4zFRMkOtKQO4oCF7Ga9G47qR0w9fRy4RK14Fgdyaf%2B1gfRfBs4MwU45r3CIcMzGSdNuHBDXkmBr1mMrtv%2FzHRmRkGwp4zrnv%2FEN%2FkT2wzXjo5FFf%2BYmPxoPYnrB95cMYiuLmq1aD7McfsyXcWMTXNbytMm2XEMErrWS6TGDGPWjlS531s9qEiddCf5JZXkXlHXK%2FUPxAtxV5aH3lHcsbT76jDx0X9zv0F%2FoSZ%2Bz2ueyK1sjF9GPabQcWdtoqWfBN26d7TRbKXrzlPp6tsfBw9QzAMz7pKcgOgz1sBaD0G4Q%2FtOgtPrtRHKFJDZj%2FuR2yGjpgbg9wSSrJl9fYZpzCNyVZU2Skc8HT4W4H%2F3TYaAt%2FW80HymtoQaOVFXcx8rTDp%2F0iIJHcJB7jOp4FRKesYHwdAh5%2BToRaj5IcsIsquAMv6noxZWE0vyAkuVxFU0J69saCas9ENwseSqTtyebqSzZBQM1mIvkmGDbQuqqsSTgt%2FMOan6dAGOqUB%2BYKRhjZvmRh8WSR%2FtllwZb21JPPtiOySJl9cV%2BTQp6BMT2fhxflApJ7TNZWtXfM1bK8rKQZBXRrhozPE572nga3%2FeXp5xmmuk6oXP2T36iUyZ9wR9Gulz%2Bcdo3mxHg72c%2BaHQMUml%2FbcDBTZOuUJim6Ak31Q8WkU0ULoy5FF5tDTxR89cWMz%2FzCjuFYr3Ot3i8s3nS3WmiJf7aU3aM%2BVdambWDjy&X-Amz-Signature=4ed4e064bbd1876367d51df1734400f1c75d69ccc65983cac7c124e05cbbf148&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XXFFCJKP%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIALs9%2BOiy9awUD6a3RMEgWlkMRwjgKIx%2Fhe%2BRcV5a4EoAiA1S87VLosqgvIgnpsVck6zyWUjnKyZ5u9HSyLpvovaFCqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpUm%2BAJjBOZ5oup1uKtwD0ZZnULvCvqGyJGmai%2BZQbZc241oJpdTc9vCRi59rIUnFRJFb8ZjKNv4AZC61o42%2F%2BD6pEy85B8hIIJKpyqrqgeVrXjFQFUwKmfbPHEAyyRBEFbLpsPuUOXhGVOtcK4i9Rf%2F0%2FHEqde1mE0tV82XAskk5Y7BrD4tahRvf%2FgcxLqoNzCKmbspAmNBnZgrIppRuHup4KWFoUB5GjfUKN3r1DcSHjnuqJgkttTpMmDLQxVJZUJqyRzS9FYug9uJ9%2BduqLriLYAJe6qLBZEXR3S1nr%2BAbVyG1%2BtRPl%2FunTMpfKaAMjetfnpzRQirePT56gjhgsK%2FPx33vWvVXT5N2wyu4amQ2ERBYLj6LijlY2sOUlRHNe3bW0Wa%2F1GhaPEEm0u1Dagrk1%2FF2IWUvklv8SL3MxsXtmFi%2FK4Eh9%2FRkI29%2BKW10A21Kk%2Bg3UGtTD1js6GEv5aTMWy%2B4dj23%2FIQSwNVHF9Aen05SpmNzCg0sQCJbJEnSWTnp3T7zVmXTJlXDIiR6vATsirLgJo1aaxDaQ%2FoNkY8XYgGIevdQ3fX7Ln4d9pm%2Bfn0aUDn7%2FA3gqDNir43OlDJzS6zrNuIkswDLA4ttraNilrRYSQmvefs2jdUMW7e%2BRFfeIbRATBoTOc8w56Xp0AY6pgHG2sAyG1mmxIb06kWkj1%2FbEmDS7Lgg1SJlIGLPFJDdzNjWz0Ids3imzzwJxPIG0GO%2Bnwi%2F7HAWF62R5gqHD%2B9gYlsdvLXwQoZfWKtzPXABT%2BxjQrEjZAXnsTVjfywLQQiNReltnWzcqS2Grc2%2BZKo%2Fekq3bI%2BiMVkvSb1qsZXL2WC4gnygyeZS%2BgaBJ%2F%2BnxNGXFPXJLgAku4oWYH%2F8hLJ5fuAgAkMw&X-Amz-Signature=6fa31101c7ff769922c11f1877b29894f6bedc8c6860e5dbaabb1b4cb13e4249&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664S6KOM3L%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIAzSVkD9o1dZkP%2Fybhmg9Gttugl51rrcMUwtpst0yUCHAiEApnPVl4h17EDJ9cNspI6TYs1tlFaezn%2B2oziK%2B%2FxcZiQqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLFvFcFO3stl%2BwngyyrcAx7vmKtP0sNtv%2FgT32s9iUju6MfqaRLeznphoWv01n1hgF1hJ42N4RHYBm9YgBp3K4%2Bl77m7s3qnUYEBpObLyP8LtX9myi1Urfmh1kcxfAflJ7ocgu2eVy4gx%2FQppvSOSoBN7b9k3Fz%2B1GTJMHSNNOQ2qT%2B9xrxJqPel3fBH08j%2FJxvxvTpDvzS6tlpqO9ROW%2BZMOkVefQVh9Se%2F24ujlsV2EnGqrmoqtRSMN1BnftCXQUDn%2Fh4mdGFyQofj3iP8s4EY60VcbqVul952eI1R2Us6H15GYy7SgOhHq0G5HSy8TfgyUfeoEV3Y0iUYB4V64Qx7RRMk4mPa6ynXecf%2Btx2bY01v80dysIkQrO8whzMm1FsI6t4MUmHgWpDS0spzg2gc%2Fem1HVMQ0f71%2BAvyajlF9ZvNqFGFDe6sUPY9r3dht21i0g5YuhXuKDtkeWRGMD1iOUEevdIeJw9mp9qIOx9zIh9okry1ew3fmQJgUqbMprds6EScFAVG3F4lqa%2FZ6Xi09KQxJCShVYzkEs7iDVCs3l0l4ujoWUIVmBi3QANCrYJGMELJGzNhjR259q%2FppRq2IUo8WMG7YFYlZn3LxPsq8jcMd9Bdv8WyEH7MZ%2BR0yciFokZ%2F3BvglW7fMNul6dAGOqUBGWtPq6099bCepZ%2BISanSxYCwNeACP2iMaTjBaMx9Cd4PXZ%2B3NJrOEeFSWdM3Jq6G3GkzWS1TqBhCpgHSo8CqlzKj8qDMSLSfSc7XWoL71zHHF604%2BuMnYAdHWZGnYnHoXP0ahcfyd6h1%2BVOAVDzHTmtRqkKRZcRbRjIN7gFl5%2FO57mtl8RtHzHh%2BZKpn4pUO9f6Wy0Wy%2FISQbSMtIlZQiyG8Wbcw&X-Amz-Signature=c82dd42f6579f672268bd31d7ec9c95a9009e67582d1ab062d5bad89731beee1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667HUUAOIW%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDVlRt4SlZl9et7s6VIMDDmVrQi%2BUBtbCqygBl4hr1ArgIgLjpt6faX4Dj1K4Fkt7kKt4stWiYjSLm48YYsr2XahkIqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ%2BATbQdiIWI%2FpxieircA85BPDlX6nA%2F0jvYUJUMbmKOLpTcUDREA4vpElEl6Pbv0pNajWI7qAeWhKPyorEhK3LDr4SxpwZaRUryVN7%2Beq2V7%2B12v4DS12KSuTvq8IPJC35G5gaqUYBXbiA0Us7fN7aU3nPdrOrzwpPbKuYYqcZtlhAM87V2%2FKrMB5B22Byg%2BLCXw8L49mLKrlCuahmC59IwZECC5IaZzDUVnkCrt%2BV6pgaPXEl4QucSm7QW%2BR93Fo2dP8G4zUjqwxHUsNq6iiXC9bwPGhzLO7bo2MRFETx7HFhxDtEeOxmXr3TAOFO16gctASfUlxDUaBN%2FF3QSQ3wD%2BZWtdKKrVkiyqu%2FNs6GIO1DDwB5g%2FoMlak7%2BVSV1xO7QAcOfMUIjeugglrvdhZydcv6kVMHulwXa0zYFE9VzZi6QeXxIZmKFX46xq5DS1Xhjg80sYdXWshuWH7ZjrU7fFlqdUyDwA50yDQYJjBMGVmGldPfKaWipAj%2FDyBn2KlMUKUaqdfMgX5qoWAHQ%2BIANb5xF%2FLl%2BSIqmHuDOZksZX5C0kybkD3VF11QpKbm1TompS804p3Y%2BY%2F%2BL3PlijbjxY%2FDcxxmvykU0Ad7C8fmFD4%2FxJy9LEVf%2BzofqUMF5XVZ7WQo5yUftn4i9MM6n6dAGOqUBaMaKg3PXDuDv8mSZXVo3qb1cC6jI5xxyeaJAyPBvj0QVsQBVH8AKzN0OdPB0R2TZdwnAGcxABgN4bL1yxMi5Qg8s%2F3Pm6E2AQ6E1uJJEc0Kz1cC05gRm5AcJyHTlABXwK5Bk6C5%2BIez%2BFcbOHiYiUkFIAojiIYYT1%2ByoMIFyQQxIrPyZTL2X8Gcet1BXw6%2B8xBawplCF3EjKjW5yjVmToZ47CD3g&X-Amz-Signature=73c41327c41902b86c92d0b02e1cd2b25665e3bad4c50f6729c9dfb96d84a579&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U4R2GQ62%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCID0AdFTjE7L5wHDjTBbxHQ6MRD8v0S6M5Lhk%2FDIee%2Bc4AiAyUcLBQGG90o0UKgklow%2B8M4Kv%2BJzVva7Nt6nX%2BtewKSqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMMOYHPXZDNkns0CLIKtwDosciW18kT02zyxfuq%2FTR%2B3dJOY5C4u9pj7xPZR9t4SIbgK68Vqm%2BL%2BHLHYUmh0pFqyR6eG7M0AQCa3%2BZTQVFN7x9vTAJd0bdpKPDsRNVdLTqVPHop3d3sRNk0oACmuWGeJIUNh1jubbnZa9mhbkXcF1FInFVZ8hn%2BRUShvSRZoF11PA9bm1S6iLzXqwta5iOzDUvD2ROh4B6GSd2B51tvmJynPK6In60q7mu%2BDKG8g6vucx3DeaSCjVQjwMy5pqetMR4IwMMzdNEKadEfPVjtKnrV7NKRysXbzQv9Q3yRHReHyjr%2BTH0bvJ5fkZNOBSspci%2BTQ8EykACEjrmzzNo%2BZG6n1KfTA%2FVxU3UaOxkzu2VTuGJ4zyxvQ00d%2FYxmZ4pEmhWy28oTT899g0syOK4m4NWfBGjNS2ZBdaJPEVQBu56wqvVPLRmu7kMe7ldjv9zcSx%2BSmk%2FzATSzaRav0H69hfKb1SNoEzfyFKQT8PKqg6llPwyAWAk3b8Jybrvr8cbYZf8M1TohaL2A8KR67OY%2FF2gTqClJ4uvvHJsSyMMoF6UT%2BN2z8eCMS6YNfZseimAdTrmF7u9LQPsww6s103ON5b56ZoHCfuTBDZrJ2Ur5RvlcCaGpm%2B1JvMW7tYwi6fp0AY6pgFXfSIyDRUycJinv5l0mL%2F3J8FGaT6hDZEQmuPNAlLGp4aRMZrM%2BL9e1Rt1G1UUNBZAFp2m7baqc%2FfYaE6K88ytIkmiWeJ6K0l4hCojdIyGQD2cmcI91K7xvPykGxMouXX9DSMLQ0FO5Rg2dph2sKG%2FqqjX5NFKEs5jaO4xsgBWZI5a15pWL8QEXAQw5cRxKG32Bs8GakHzb%2FrWE7tFOnj7uq26iPtd&X-Amz-Signature=4797e260e142e3dd7a7fc9a449e66f6996aefc4734d812e6ebf44c5910cfdd48&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YPRKBB54%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIDV29%2FuCR9J3aVZYaNDLY2Xzs1TQRVSXWWmVRcsqkqyrAiEA5RrLjKhTKvGNqqcPbY4wYHsRNynNAyXIJ4BWhla5mSkqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLtLQjn%2BsuiVpTEjYyrcAyPAsDxakuwLvHAQjSlyU97cbT5a49kyFowaa41yA1S3kZQSX0Wgffi6oLSGApoKRd88OwYNlANgmAk%2Fo2rNInI75ifDlG%2BpxQNW%2Bs4IfdJwjkmGSFK9E7wQ12wFZiWzalJBQcU3fh2RPWUe9RgdV4XedkuD6v5nblB7YajxjzlT4drxReVt3VLDOhzB6q5gENd%2FsH197YqFmCOtwiNZRI5s3v2mYmxzJ89OmsNAxpdNJgSjf0pvFpQfrtBnTPxIREyMqhH3wByw6FAQlSo%2FSrCiND5mw4VRVpwl0heb9tCqiF9cEV9Il8G8UFJeRxISu4AdxTg86oMYLHIDGyITM9eRt8opzXEn6BS7R1dFHjob1FJv8cVgrjukwMwRkb14QCeLBl4MuwC1kiAiZ6Xw8d0gxKC4rglXAa6thDHBmyjbHsiGyoq1mAJhzX7ecLcn1l6UBn%2BWTF9cAw0nyIzRwRvSELqyrIlXIFjyzEP7Jj4B929SAOoYdBkoMQ5el0Wjl7bKXTXCyScG9R54YapfLOtCo52YQoyaYbEK6OCx8VSwxAKmaNVfUnxK%2FHLS8ct7L28HA6gJkMqxk0VDky3NgOLHpJo2YCGqUqavSi%2Bil1LtBxGf45LZ8WBx%2Fn8xMIqm6dAGOqUBoFLjnQgwOD20wRlH4vhG%2FO0GEBg0qbmK5FRQYbjlu1dUvGCH6QiW1FWe9SIIXQBpi9ZmXmO%2Fm1D0PyOQq09gWgOk0S31DPqv2f3uLviI7AZeA7ZC3wcNks0x6C8g9eZfk7SS%2BpRnK0FZI45zAEiqi%2Fe6wVEpN0%2FGshvhydNU1aImuKU3SHgWEFI4tzXW%2BV29ZFXJh07%2BjXYwVo0fD9cNnMxT7gai&X-Amz-Signature=ed9cbebf9b1729a6566dc61fc540629102ba9ef24505491763a6b296c7bb687d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
