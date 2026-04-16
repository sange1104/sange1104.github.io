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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XO6UHWMQ%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034825Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDJrXOdtfVwxAdtUrtPrtdomOlGJWbOdHSSIsbwspVkpAiA1roVtj0fGVqo8jjFq02vQYTul3dPYRGKapmyOBdKAkyqIBAi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMaxmL8mEOOx4wQxc5KtwDWWQWJLDVCnKhgtWODOc%2FSQBBJIOctSdHjlayFv4NeKGp7WgrWLMFqYuEMUNc5V7ZwzleEter47nTIVKTSFhu4KgU5jFcylZWjOA1aGeQv%2BjBfLouUWUQob51ve6ELXGYR2WxFSQf1iWnTHYKLkXBd0mImZOfqc0umHMe2j0Fw%2F3xFZOUBYE9aGGULNNED%2Bslz1xNg%2BqG%2FZCNg5wdItsgEr46Lx1z2snM3OTPKz22hhXtjFFeVPmIA2JWaNWNlVRTLF1Ib9YFAKxznVnuXqeyn0cxS%2F%2BUv5qsMkt%2BKGNTT3OQAkgUuF44YK4L0YoLMii7x5ZfLCUlA5bRAuf5TELhTUnjC8ARY2sTTFtVwy%2B%2FBJjKlR2DQ2xxF29lYEDVRAGb6Jz%2F%2BcCGVG3C1lUllioce6iL4N4R3n5XV49Oc%2BLuOeXDFk1c9%2B57Y13HaxrjeyTQqTyDDdLIYbEGexCp4W2CLQhjF3xT2OqTfnTMZOE3JU7KzFWjx1dy3hx2f3%2FezCFAa4Z3BJnYQkM2%2BkPcMBuWziVqFPeSXf593yrwh76t2KPR945dqSgB9X%2FeERd%2FEBwwsKbf1Kqe84vtNlJFpJCuCbb93sMQoCjbYlOCAGdD304x1f4ZwefKezfMFtwwt7aBzwY6pgFr7IFbv%2BaJY5k0GxQOl2a6Eflsni%2FzssqteaJAx4RAl5NbYd%2FqIYyiuneFMaUSFNz6SpMnm%2BiEgT5VU2Z8NoN%2FXjan6tglRApM94s7cAQkdk7ShQViCHx6C4Y4uNhzSGSu%2FEXax60eg0Jplqt7SAz41J4XUyLCImmwdmP2jX%2F0viFprSdlBKmCGrLpbn3FdsPKmIq0zKmNqzbgu8O8tjdj5b3sJYY%2B&X-Amz-Signature=6048d0350a5828a30390d1cbd31c5eec9e145df1a8656d25f4a3c146ec917ca9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666KXWLLAB%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034825Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDR7ML2BztzlgxFJWUos7Vc4w34i75QbS4KE14do%2FiadQIhANzJXJ22un7xpP5Yr5HQz7v%2BRrY0YaJQafUzj6GTlyiiKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwVsgCYMDXJSzV%2FnM4q3AN1%2FUT%2BhJAkn%2B3bYqayV4b2Z1CVUmqAUIskWOXNDRjurUoGg7%2Be5w1rgJRBAs5qJ8xiSuSxvIa3Pu38MpnzKRjpIhQ29FXK90i4crEPwg0ynRVQ7lFzBUFchN20BQZTBuimQFWaJdX9Bzvm2GyZOzVPM4btWhQxc8UuzZMgS9NHP6as0eiTuGoSGQATKfDJxcej9NnSOdAGIPrnGDvymW4eflb%2BwnrmpE5%2B977rclYDHiUXRjDsurYZFEoiiWXpWAr8TUb8l6AF67MMaYbs9caA72GcUg7Tl8yfIqbIgUC93xfGlZjY0W52PcpoWenIGwoD1wXsdLVh4bRcOy36AHD3iWriBuoYUuYxGSAiW1vguHnwyUej5TjigwOcKlgXXfoOzqYs8svoA7r5kXv1RgASHDW8GPdIJPvQ7HD9HneOsrylHvTm4Ei6zaHCviutVb1fCblqDqheVs6HxBhLzXy6ZLeFjssDGIGvs91qIaNqlVVYEJbza6PoIArwoUMckp%2B5gGCZR3veWJSKQz9tzVwct6kxaPR21B1dMqf1Fx80D%2Bmqs796JDUjo7PQZxTiOxDWa4yLIsYlgYKsa0OJ9CdyDcd2ygVvaq0YVniwj%2BU7GSWBH8UFdF40iDpGejDStoHPBjqkAWPkdO%2FWs40rp1FCqhmFx6fbaLPtBdhYCawOyIV%2FrklqvJTPQO6bcHwkPpAdTDK44Fz5ks02k%2BLOn10ITxIidhvbxARUI4666%2BZjigb%2F3kPMXPQbBLhSNTJISYEnBMg2mUEfetfKlrl%2F6GAnzpLKyx628y8pjq%2BZuXpTqwsQCQuj2f9F2CDY%2FYceTdPsNX7uZiasQiDKv%2BG6KkgRH9yBcI26kOH3&X-Amz-Signature=b1b9869761480c3ef2ea31881d5e7fca7914dd2b188912d52e038eb943d1a6a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6DRKM6P%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFNB28qmwUcJAuOhi1Or%2BUYaQqNgQJ17wuHlr02Mw%2BgZAiBqfHJiGHXonNKhYIfAtsAEbaBj54z%2FkqQ%2FqCLLF9cPECqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtr4du9tGibzoHzFCKtwDkFOXheZLReGVoqlXqlclG4V3tT9ssgmYudShJd2q7w0K3j13Af6yXTvs3dY98WrNM%2BXp3jYEHLH7TuP%2BgIFjlgiydWd0XjPERVWYTRj5HSKiAgmNLmiCNysoPILW3%2B3Wx3AW16BR6z90NbgYFbBWqUgjbSFZ2AJoFg0X9Mej29%2BIt063sejN515ahzEWnNimllgxgtweHJWP%2B%2BNQaQuVlKwadF9PWB0EXLjXoxdtE1B%2FbFuRaT5Mt%2FaBdTk4ZGRlWbmj%2FBdJ6ufVkyGik3QTMg3SbdMb%2BbFdi2UWtuMS03hjaEIGYNcm211RzO4FbSHvqVkhdxmv5nvv5vvhiygqUlkmgNeTJI2BhW3Hou4SkRWV%2F1qNEjAX5SpHIXrSmYs6jLiTXUueOh%2F3Mruco%2BajYoep3zBKmnLpZDInaYZMYugRTfwJWv8nVy1YOHwIrmCgVGQ7OY9xXCuQFRCqOcjYSWaN%2Fizb8%2BLr14YbOW7yz089DGFKkABKbvAGV4YQlH3pD6Xk6PMrLqkvfLlpdqB4FT58mG%2BoGNpEjIyRBf3ZiN98glZvph6gsklfaSE87k%2F01hJPx3j897ib5J7ItoTyZMesQgnvSrXu3artDOTda9nI%2BRINNGNuRBS1DU0wuYmBzwY6pgFQXZULJyg%2BzId5GqBporxHf5JnP%2FW9vEmoEXUGv%2FnsetQHgKHcyfkg2SqRBKKaBE8crZfucmkjdBgY%2FoJu8Pl9ScXKmYXx%2FjD2nUpC5%2BMHqauRG01uUp2UXxOckoNrvpZAhi7L9hxHt7JS7GxEgzPZICPeFopzQW3v7%2BovdGj2isrgx%2BYB%2FKC1h7TUCWJNcxJ%2BjDHg%2B%2Bou8RMQaXpcc6s7UVL3YdzG&X-Amz-Signature=18da5eaf6b4cc0284a89f6548e87f395ba77ec2ee4f9e0fefc56a42750787172&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6DRKM6P%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFNB28qmwUcJAuOhi1Or%2BUYaQqNgQJ17wuHlr02Mw%2BgZAiBqfHJiGHXonNKhYIfAtsAEbaBj54z%2FkqQ%2FqCLLF9cPECqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtr4du9tGibzoHzFCKtwDkFOXheZLReGVoqlXqlclG4V3tT9ssgmYudShJd2q7w0K3j13Af6yXTvs3dY98WrNM%2BXp3jYEHLH7TuP%2BgIFjlgiydWd0XjPERVWYTRj5HSKiAgmNLmiCNysoPILW3%2B3Wx3AW16BR6z90NbgYFbBWqUgjbSFZ2AJoFg0X9Mej29%2BIt063sejN515ahzEWnNimllgxgtweHJWP%2B%2BNQaQuVlKwadF9PWB0EXLjXoxdtE1B%2FbFuRaT5Mt%2FaBdTk4ZGRlWbmj%2FBdJ6ufVkyGik3QTMg3SbdMb%2BbFdi2UWtuMS03hjaEIGYNcm211RzO4FbSHvqVkhdxmv5nvv5vvhiygqUlkmgNeTJI2BhW3Hou4SkRWV%2F1qNEjAX5SpHIXrSmYs6jLiTXUueOh%2F3Mruco%2BajYoep3zBKmnLpZDInaYZMYugRTfwJWv8nVy1YOHwIrmCgVGQ7OY9xXCuQFRCqOcjYSWaN%2Fizb8%2BLr14YbOW7yz089DGFKkABKbvAGV4YQlH3pD6Xk6PMrLqkvfLlpdqB4FT58mG%2BoGNpEjIyRBf3ZiN98glZvph6gsklfaSE87k%2F01hJPx3j897ib5J7ItoTyZMesQgnvSrXu3artDOTda9nI%2BRINNGNuRBS1DU0wuYmBzwY6pgFQXZULJyg%2BzId5GqBporxHf5JnP%2FW9vEmoEXUGv%2FnsetQHgKHcyfkg2SqRBKKaBE8crZfucmkjdBgY%2FoJu8Pl9ScXKmYXx%2FjD2nUpC5%2BMHqauRG01uUp2UXxOckoNrvpZAhi7L9hxHt7JS7GxEgzPZICPeFopzQW3v7%2BovdGj2isrgx%2BYB%2FKC1h7TUCWJNcxJ%2BjDHg%2B%2Bou8RMQaXpcc6s7UVL3YdzG&X-Amz-Signature=1d5d8432f572e12f05a48041e30bc777200a84e68a707c7a4dff2b258a27020f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z7G6VIJF%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034829Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA1KfQFeNHy8ttI6dkYICJH90CjQWECxth5ORVQRJcN4AiEAtIdF0pyYLdWQGnT%2BVt7t4pLWBBTRYgHy58buc3DcBBEqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAPA%2FiUfigH8NS2d1CrcA%2FSElEqUAi%2BLEg4YI33TfFAFg9RF26YSqzr%2FO4itU9FcrGItk9QRYmnmIdp%2Bdmrti0aAUm6uQqmNGJnewUySiLvTVGM69iBn%2FB5XwYuNe8CtYJrLloL%2BIiCFo8sNcC%2F9ooX%2BRVleuKwWHzR2mUNaccZBotlDsJcm49ItnFx3N1M40pOmIAWyeKt4Mz73lcy8g3xbv7i3eDMPa%2F3JxrYx0k8A%2BpDYHYK7WesU0v0KjOm4YMVI8%2FWtq1acEwBMVcIzkc%2Fx9DuJ%2FfOH9%2BBB9i8XiDuWyZB4ihEcrhjyj0ZFozbdogMXbv8Y00gyyi8ZSceR7wRXgWGfcHvIyDvvP%2F5Cwc5xSX0h9P3TJwqgjAi8C%2BiEp7EZRjVg%2FgvXd6M9rADmg9lHfykQer7TJYaxO7AT6ricmruxAHWc4jbPyWh7YWQNSUNVLJNNf11c1BMuZ6aJXn0BEuy8jnpCje%2BrCoY5INV2PxCWRc9fRXgnJkxK%2Fqdq%2Fg9vDWfvLTTkg750Z5WLdluYF8bLTA6mkW43ihN7leLsZ%2Boy6QaUVedTkAPgCf80LsaCGfnunxKnzrIv4SOrmXwjePQcGs2q%2FCvIv9L%2BLN3FbEAbeLwqoozxoghp6ZsB9Lh%2FhsBymRvb2ZrdMNG2gc8GOqUBMx5wndaSkBv7s2nRyDNkt3DOCeMldxWKkk0Ob2xQwn9AKw7SN7IRqMi%2FmSTzuoqOVCoGo%2Bc4A627msF8lR6Y32OdTTKD%2Bgb0%2BFlsb%2FSOhhpnRpvqS4TmcOM91FPvE2E%2FyIL2f2F%2BBobzu4zObB0aJF%2F2UhKxXfE2iQbhVeui8hw5m9Ik7CNFv3jgsNAIjpRpHigKgy4CCOBJ%2BVwLIo3EJDCRbOCG&X-Amz-Signature=e3b8f7c25a0fd5e46f101326cc4910f775e23a939aa692a41dc5437cd197af1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667NWI4JD3%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034836Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC7vMnoejj5GqMhfVPgD6coDvP9mc7GHoiGcTalXgSW3AiABbPGwd%2FXOzc2xiXZtuSbi8k6GeWfPqpnfoCYmuZAAtyqIBAi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoCAUIE2mJLeTWQYXKtwDHX4n%2FQC6DS8nMlvPZ9Gxw%2BJ3bWYdqmWLpA8NSuFJfjQPCKf5eal8b23RJfNJbM9XzSIk3yttZszr%2FLMJKfJbVWjyN7kL33GnqD1ebEkF8dAmi65Rksx9hZre5iIl6GmX09Ig3ltzUizn69bqIAtsNQwJu58ls1H897rUV3VSTuZY95eJmv%2Faa6peZU8hNqo%2BsxEBnhl5rGKW%2BZkREIdag4AlgcbtgyWMRR%2Fz0XSD%2FK3ZWHf2HQ%2Fz%2FiNNX5UsuUPRNzaYIJ1KAf9pypSLJ7Y%2FQNtUPzxIRgl0beUUPcVi1XI79nesctUzypolD%2Bl346P7%2FtmZ8c5opY3sZFDsGRjikNZrG5jToIh494lZzdoYW5KE8cUx4Bwunn28jB0qa15al%2BSWaMOYBaNZP7WOWGi06sAB2WKalfuNlMpQ99sZo4%2B5iMOcAeHodX37tRNTfEjI3Yq1xXBwrFqE1cGAqVrsCQEpWUnElbVrapXHG7431TmAvNDMMyDBbziokmOXWbUxFlGjbsAJA2dOEe%2FAY3pCU4wgw6pY8r4m9LINTmaLP4Dyxgjz8ZWfr9wkmaIoEMd6Xc6RD3iCkKfwYM8E%2Bg2c1Ky1YY1WiJMoDqHdf%2FpORx4Q4zmuY5u5CnUwyu0wtbWBzwY6pgGaIsvqiCgsBrKLB0NZ6MzrEC6fwVizgGmRnJRNtHbqaDFpuWC4jNFpNybN%2BHgg89JwXzUHSc27q02kgulvM9eEu36aCPLSS4rFUXaHvU7rf2y0Fa2OrmevAql8lJn2vTxF0z6Mxu4rz4KCKq5dNHm16rJ%2F9kH57zTwdKVBjyJ%2BckTXD3amVvmrLkCroHNR3dlCBFVH1%2BdXHsZn%2BLiG%2BaSKZQYkeEaA&X-Amz-Signature=8d348b97c51dbff619a3ced62b9cc1e415dbfb819a14a4a4677816f00a3c8048&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46655QRMHZW%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICOvfjLxst30ZFxeGVvlnxixC8AQRTfmUlh1ziZjXHbSAiBr%2FaaT0IweULdORi2WrzTG83p%2B8jDMPBsIT6YhKmmYeiqIBAi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoYhcLwvB%2FT8i2ldiKtwDCzUGt5TsTqBw3rceZ5D0yb3wRM0dzTnceVrXqxzz9XbSfBBbMOa5tYdXtc3WyggaHnFkh%2FEiKFHJWT2Qt%2B%2F%2B7FkdaOLOF3ErrvLTfxSWohYrlFw%2Bo8tnRmSqqEupHftdL8MSlZY%2B257DlaSjintpD%2BRbPoExW1crphCfP3KiFqD2qgzxAjVi6CZpXv5suv%2B5xyJI1UDp6UgwGbj0nhAs%2FKI1jqZ69dlD5dtIWzfOyi7bbTBeKtVF4doOLoakhtFNa7KyqY633sre3wWHOiTiuyM1VP3VFJ6fxfnUX1pPOiZN%2FkBp7ygkkT8478md%2BrvFoyco7l4PNUsbT4gK9gI2wUwtciHmG2XAFg4TAbEK6pQFuN%2BLy8D3l6zPTKRqxKKiaWZwEmjTK8lXrLwamKBPTY64L0nFhNq9V3VqqvyLij0mTlYTZC0HfQX4qPPm5tkHeMiktghqZxEJ5qI3xxxfEv3wMM1iYdLC6Yetnr2H%2FFuF3BjtcvTR3TD3eSVUu5zN5HoL1U7S0IN2WrnePW4hlgTZI8gjY4icbMHZcNRsODBnzK7CX%2Fe4lDxTbzGvLP9QNBVwDMcUEc0l7AiGENGtb5GVHSyb8sgIrtY6KafMcuMh2dE9oteZ41DCztsw0raBzwY6pgHiSogJ0%2BB3dkhzYon7ykBu%2FlPy9HEgxWzLPMoVOavo07SwWExOcNwvp71dONZrEIMu2p%2F%2Fm1usMT%2BrBZ4WMOV21PP6fizKtmDTz7JVjDwypYsDBxKTH6axaHbPevuencYp7S6LCy0iRbsSNrvswpdJNlL5UYChJemgH4ajaBS%2FX2u0SWeqjJDhfMqx3dUBjGiBVPlHtEhl5nqtKoooK%2FxMUcY2tLP%2B&X-Amz-Signature=4ed693a0cd259f3b4772ae1ba6e84730503f7f706604b7172ce334eb24667dfd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3DTGABR%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHUfwUDTnsN%2F19kpg2HT%2BC%2B%2FgEoeTZ2bJ9ke3rJCQsQUAiEAtkVw1tRJV8mPNIPBDuKA%2BZEHbsbn1HQDpCE%2F%2Fh9tljUqiAQItf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFi295S49%2FHMAkbRKCrcA9%2BaWnBuWwBVALBQtR2MpK3bHJ58dAc%2BRFUwp5%2FlYjUrIAu8Ktd5SUr9LCG3%2Bytq0X7uL%2BbHeaM31in%2Bn6%2BnpUi7TxQKtPs2JU81Ha5PpMAFwQVsAVG9GXHw7Z6HvPdDDTAfAsryX4mIoLe3YFsgz7CE%2FJdDePYM8qQadmLztyJ9d9xM325qEXXnyJEvoOQe2h5Ia6jLDP8d58apNfYnOWvfW2NVhdUzYmiUj6xeyEWmMfK%2BILrpQIA4nLkMjpzeZRS8hdxHxwQirem6y4C9VzydIb2H1LA0MmRJidDbSn60tlJEArz7kOZjuOfQzJEBOOS8CMn62jsB6ZMXD35a%2B%2FwEWUBwOfxnrGQ6%2BOxjP%2BerI4vgpZICOu6iAuXVazaY7SkFbGg%2BdZXuT8Y3Sa7%2F7U8rSqdWEGrUBWZ846yPB5pyHI8mIbmwMHXLYh%2B8VUX3vlydNtqBnCKnqTb%2BeeXRPcMIZkEv2Avewryn8KHCNiqsPWnW7QDFg9UST5j9XxsIj5hLjZ8R5WdRYjko421IAtwuX4g8PS%2FmBktAPjV7BTI0wCI390MqMxGJWMDdDnOi4UX9UFyCRHQPtvW9A18Q0sSLIiz1II%2Fzu9TYi1vk1A5EW0gIw5YVBrAg50guMNO2gc8GOqUB1%2FBBra%2F2QBTm3AXFHdy0keikq02otV8WxHjKpRRkQZh%2FLDCpYujckmgZiYkJPN7ealiIgWOZ4NOIlBON9VpVQKSYf7UMDvrLOYKqpL4Xi0JiCFawhSvgi%2BW7zSEJQuOzheMWwgiy2YJuF0WJJdO0OyOt9pMRr%2F09JZdt39ndDvLg0%2BMKuudjEASaxZjVrLs26F1Fp%2Ba1u6R7cQe7I8F%2FBDP0Bscy&X-Amz-Signature=a0002a2cc4896454dec9826c3dc1be8d64d27edfb47c67461822385bb30b0955&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SOVNERJW%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCX7D03mY690uQLraELU9l7EaOsj%2FCtg2QDwpySWut12gIhAMwtfpgyxc74h2WVeSh%2FcprBFmlLn2461tFs9gN2RpXcKogECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzAv5WOq8Rt2sW8XVAq3AOLmYYNJitgat9S0kA6Ehj5hU5ib5vpovX%2B5WAiHaElbYWWEq%2BBEsU9%2BgVTPSkr%2Bwnn%2BrHpxO9zLjhxjmJcJ1yWgfqNfe4UzTUvHHYSivQhy3n84dpjibsadtPOwWTjVL1Y6XY4a7eUPohhLFdMolwP8KFlmhfNyNsNV7MwZC3IhE1aAmvhUWi%2BDMQ3NY8j%2Be3WyGhEYRC%2F8hwnYbRShnYUqFoOjeKBLyYPikJwcAhKAqR4foplc1I2KJh%2B2ggLuAOfzIP4D1mKpuJrblPvcz7Wf0gVZBaOQaMAUDfCc3EshCfOOrfLoXcMNEeV3GD%2BcLPj8j1hx4WLQX0A2rU2Sx8bfVoKr45IED6uIQGLt2ihoGg1GVZ%2BCI%2BMNXWls7IKhquDGefstwgi4nZbE5PROz39cpJIuqJS5lacpS0Tk8LSAAyHQYPmfbaLlrf6HdpcjuaZ9BXLgPGxajTmUq3tqfGEkVIHgk%2FSROAJR8pGESi4YSrxHH9U3RMgysBn2Tr8%2FfLIZCSlnzLtOgtNjV7Y9K0Om0egoYm7yx9%2FdurG0CCUswMZqZn2I7OS0SR2vkAZ%2FvoCWRH942egWbrjWZRx2JroenBHyLEwghlYjzOhc5d1CknthF%2Fz1SODckMkqDDHtIHPBjqkAQgbGS%2BYX%2BOEigp6PefY8iZboi072GXRk2GcYskuVK6rJt4anHRQabP9D7eCoQFS8GpusP6pSzKjuH5qXkelhgZKUAb%2FbRx7SbwPcJO0ClD9l9XsbxtTIuKatA5VbG8esIncQFs7PAnQhcETMkV28vnO9tNwszS8tzRQ5SaJLz%2Bpl1hb419gsgl1AgRQ7%2BAGXEfemGnrCm9n8uxm1Oo6dDH4u%2Bkr&X-Amz-Signature=55d8249894b849aa17a84d580b8197a2ceac1ca6f364d36efbbbdd40a8e0b413&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6DRKM6P%2F20260416%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260416T034817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFNB28qmwUcJAuOhi1Or%2BUYaQqNgQJ17wuHlr02Mw%2BgZAiBqfHJiGHXonNKhYIfAtsAEbaBj54z%2FkqQ%2FqCLLF9cPECqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtr4du9tGibzoHzFCKtwDkFOXheZLReGVoqlXqlclG4V3tT9ssgmYudShJd2q7w0K3j13Af6yXTvs3dY98WrNM%2BXp3jYEHLH7TuP%2BgIFjlgiydWd0XjPERVWYTRj5HSKiAgmNLmiCNysoPILW3%2B3Wx3AW16BR6z90NbgYFbBWqUgjbSFZ2AJoFg0X9Mej29%2BIt063sejN515ahzEWnNimllgxgtweHJWP%2B%2BNQaQuVlKwadF9PWB0EXLjXoxdtE1B%2FbFuRaT5Mt%2FaBdTk4ZGRlWbmj%2FBdJ6ufVkyGik3QTMg3SbdMb%2BbFdi2UWtuMS03hjaEIGYNcm211RzO4FbSHvqVkhdxmv5nvv5vvhiygqUlkmgNeTJI2BhW3Hou4SkRWV%2F1qNEjAX5SpHIXrSmYs6jLiTXUueOh%2F3Mruco%2BajYoep3zBKmnLpZDInaYZMYugRTfwJWv8nVy1YOHwIrmCgVGQ7OY9xXCuQFRCqOcjYSWaN%2Fizb8%2BLr14YbOW7yz089DGFKkABKbvAGV4YQlH3pD6Xk6PMrLqkvfLlpdqB4FT58mG%2BoGNpEjIyRBf3ZiN98glZvph6gsklfaSE87k%2F01hJPx3j897ib5J7ItoTyZMesQgnvSrXu3artDOTda9nI%2BRINNGNuRBS1DU0wuYmBzwY6pgFQXZULJyg%2BzId5GqBporxHf5JnP%2FW9vEmoEXUGv%2FnsetQHgKHcyfkg2SqRBKKaBE8crZfucmkjdBgY%2FoJu8Pl9ScXKmYXx%2FjD2nUpC5%2BMHqauRG01uUp2UXxOckoNrvpZAhi7L9hxHt7JS7GxEgzPZICPeFopzQW3v7%2BovdGj2isrgx%2BYB%2FKC1h7TUCWJNcxJ%2BjDHg%2B%2Bou8RMQaXpcc6s7UVL3YdzG&X-Amz-Signature=68e784ad8cb0044d30a6e110af95195aa955b5d7c5adc028f35b8a6ec8169489&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
