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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VTGMHO7I%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC7pwP16D6zSMKpHogUak3nkq%2FjAITbBJbhmE6DxsP2xAIgZg%2BKOkB0%2FkL5haHF0sFYkADm4we6SMCK1O58E9ziTFEqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBHD0%2F1Fa9e0KYzu4yrcA8locHZrzYMn%2BCiYq0VMTVZi2zxhfou3s9kvd5XBZWnaysUhKX4%2F3%2F9IkPwzkJ53Gxy7DGwrryohIqwCRRVgWv9I03J3Kb9QIGPO3O7aEQ4R22HEfQWYhYtpTJhxg6SR36Hc27juZfPb2G63bRzEOpugP%2BVZOditsO8Te36KLu5IvrjBr6bJZUEwcaJyZ6dXuFSFUiL6l0r1AeOS%2BLAIqkQtmRXQ6yG6oq245axP%2Fjz9U4DUVeM3jS4WEh8Fdu3jxMSsPvSModH%2FpkwxRHX2u4EY%2BhqyGAuoMS7hIrMc6Nvclg83jLzw1QS%2Fwpbrim13FxP2hPsejVBwMvak5WjQ4U9KYNB2jiHu2dy6grIALKi65puVrV95qMSdihFMEPnmlMU4umXM24ojSqade8Y6IC8tqkbqi%2BQX8eMXsctEzhdHZU1EES7Cgvd0bOeiIO6sLyzKVmqwJJtdxhYsOIf%2FqYUAAo1gp1UYRSE6cIWDtYGGJdMsV3n5vpZGjBkZqor09RcDXAo%2FtDz3ihEOxN5TIP%2BDvooiLvu92JMilnq8m4z%2Bl3mjVecJ8C2p53njvmwJ%2B0Zr%2BAVKlZVwKppXA9wpUrIKkSgtWOrAwZW1J81Bi67126DfKYFNqZRshmKVMOaEntEGOqUBOXpLTOhYVEVJlPLBN1%2B%2FUMhWc9W52hhL26zbDiEIWKz6A4MXJSYLFvu5uHiZnRQMx0%2FnlIXNdSB0thAzop2%2FmKDMZtmUFUNZWpnaWfZtBTgrnctTs8f%2BSOH9KzPLAopa0Pb3fJQ9dwHaHC6ybG24YUp2Ojme6p1nf%2FhVpOJaz0mOHGqr50Jm9NnHSiv6FEWA8j11NZ72R2dKQ4xh4V%2BIV2Th7Igx&X-Amz-Signature=0ea3a5aaf7bc1b596f4dc46fa2b374fcf4d74da40060a76ae1a596cc8a2d7f4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626YW4R6M%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDWnyu6fsIk1k39E%2Fne6K%2Bz%2B69KesUXbXffCvupQYbzsAIhAOy1CafvBPTVxhJKmZQTY2zCxoxcCHJ4AAIrbXK3HHb1KogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwHjYKbmxcjhZHfdyMq3AMSHfa83d3CIvtKfO5WmsfzPcmImQrS4X4v1Zt1IiADMFimmsavcaWjkZgi%2BOKenGwVhHQ3%2FwFsWvCOyFmZ4g85ajfazhXdw8Of7cdF9mlUe3tahVRxBHS5A%2F7b95AWpBmYwzLbJsveKZPwIDmQ8o4jBrKnRMVK87TNR4%2F3cTXA5G7Aki2fjF84ak3le13qN0%2FSwx%2BFZ1s0fgNwZii8TLj3jL%2Fl3R54KeXIU8aEA%2Brsm1gOrYGmk155rJ0qqADYOBf5HuNqO2BdZ7MVKYU1ev57Jk8DLfzE7rPW4UzSO4t6qtA4mjRJlyYAMYLKwfwSAt%2FuvvowxvTBKNxQxWUqOjE8rt2QlHgWvmhCRuxe6SQfjlnIEIjkpg0VfmDQqRp74%2F9Wftb0KMdTnIeC5nI1lzYPPOxxmbKVIohYC97P3BK5NE1AvmDf6LRQ8S1CuIE70KeuT5Ttxjr8CY0zD3FKB26k%2Fj3losArd520yqLhDhhkyXz%2F4RqHLyZpQSUwvAHqNDkEEN0qfvheb%2FRe0MgY9iDSSbcnASlgnrH71Nynpa5H%2Fp%2FEaOlZXK956r3RyE9ipaWPpofF1ctFBqhX9%2FyQPkVJn7ZU0%2Fy%2FrGEmPrLluQVvFjxkTLISuBmjDqkeFjCZhZ7RBjqkAe6FTirLGxSgSVVEOsyCquH47zqEqDx2Y3cSlBDkEBkJXmv6%2FLEe8FVvACGfY9coAkwVyiEsSOhGt5AFO3vZJWmATlhNYQDZl1bT1gOKvoXa8XbQHeG%2FIElJchkkjWFMFZUuoCEjXKU5Z7ji1dld%2B8mmPqaAYKE617pdppZ7lRwn9%2BkVmHcdWmziUIlwOOsMIMcWi7Tiynrn9diiCxxLWdlzZwza&X-Amz-Signature=6c7087f9af0616d0bc2289d357d042440cd45fefdf6911d6f10747d87935bab7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXSPSJNS%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCvZoU1djPHtxpmZETW5QmKGLFHJ97n0lVQD1RH5edJ%2BgIhAKugpX7ALedl3k5mPWTH6MaQwv89db4EbXGjY6YgEPdiKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOQ%2FD3WmCeIO0pDUQq3AMOkJnNcYZ5nDIpGlWk5yuSTYUg%2F0RaqRVvhAF3RAnNwYuCnYm%2F%2B%2BWRq1w2w%2FnpVR%2FI007VSaxB35o2UGfLZ%2B5WaiI0GoigHmrFfH9oMiDxfM0ijV4jcao%2FXUAGCIAugO3OgX164PDINI33xXSdlhmGBXT%2F8XoQAD3vDiifA3MMzXBS9Aps0yt7Q5i2%2BOszs5ymv3ZubGtNV1yBNHe0R%2BxmZ9d6s1xMywgvWFYnxwDScRSjrkJxFBnAzVCZWe1EqH9KuC5XEiK8UU%2Fc2bSHZV%2FhEVcZehuEgBsqKBI9Vg%2B7VtPUP9qkfPgjDQ8Yl%2BbqGXBmQe%2B9oGieOARKwg3nzn9idRJVNGS%2FrSMzWpKHLa0pPlAoU9e4m8uaHl6ZrBZ89QTv599jNAqYEUxNSfCEKWL2cCn2RiK2sFrYoJymyheFS35NBGcG0iOe%2BhTRiIFek0JGWUlovL%2BuhI4qe%2BUYjO%2BLE1eGAGHZUtSatI7WjErbT12trfw5d3Nxxsw7g4kiG2gJJMw%2B%2FsxkATlRF3dkQfSztH782hnfprrJsOyA9220epEeQJm3h3q6%2Fk6yuSXUyqMyr4wPA9bO%2FTG59KhDDa3ZRqxjU45LPYRvNFIkSfPeuEdIwV8bjmoLBoAyDjCahp7RBjqkARb0Ss3aQaZ9cnwPabKqfuuIRArClf%2Fb2dDWaaPlREUIBexncHYmOLSU6%2BgjiBgEkQo40XMl4GxdTCJzT9%2Fw2NHi1ygvTToABsqEh4qaB0zuwx2bxW2jMjKjgjMM3P4J6sE535URCZwFngwJcUWX%2FNc1oK01%2FLw3hHr2cz4tajjp55r5dCwslsPujd%2B9E%2Fa2917SgbhW%2FbyLfKa%2BErQxNYxDUodG&X-Amz-Signature=4ac3a6b99767ceb25ec1c251cff1196fd5bcd4625bbee7193525fd56054a660c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXSPSJNS%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCvZoU1djPHtxpmZETW5QmKGLFHJ97n0lVQD1RH5edJ%2BgIhAKugpX7ALedl3k5mPWTH6MaQwv89db4EbXGjY6YgEPdiKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOQ%2FD3WmCeIO0pDUQq3AMOkJnNcYZ5nDIpGlWk5yuSTYUg%2F0RaqRVvhAF3RAnNwYuCnYm%2F%2B%2BWRq1w2w%2FnpVR%2FI007VSaxB35o2UGfLZ%2B5WaiI0GoigHmrFfH9oMiDxfM0ijV4jcao%2FXUAGCIAugO3OgX164PDINI33xXSdlhmGBXT%2F8XoQAD3vDiifA3MMzXBS9Aps0yt7Q5i2%2BOszs5ymv3ZubGtNV1yBNHe0R%2BxmZ9d6s1xMywgvWFYnxwDScRSjrkJxFBnAzVCZWe1EqH9KuC5XEiK8UU%2Fc2bSHZV%2FhEVcZehuEgBsqKBI9Vg%2B7VtPUP9qkfPgjDQ8Yl%2BbqGXBmQe%2B9oGieOARKwg3nzn9idRJVNGS%2FrSMzWpKHLa0pPlAoU9e4m8uaHl6ZrBZ89QTv599jNAqYEUxNSfCEKWL2cCn2RiK2sFrYoJymyheFS35NBGcG0iOe%2BhTRiIFek0JGWUlovL%2BuhI4qe%2BUYjO%2BLE1eGAGHZUtSatI7WjErbT12trfw5d3Nxxsw7g4kiG2gJJMw%2B%2FsxkATlRF3dkQfSztH782hnfprrJsOyA9220epEeQJm3h3q6%2Fk6yuSXUyqMyr4wPA9bO%2FTG59KhDDa3ZRqxjU45LPYRvNFIkSfPeuEdIwV8bjmoLBoAyDjCahp7RBjqkARb0Ss3aQaZ9cnwPabKqfuuIRArClf%2Fb2dDWaaPlREUIBexncHYmOLSU6%2BgjiBgEkQo40XMl4GxdTCJzT9%2Fw2NHi1ygvTToABsqEh4qaB0zuwx2bxW2jMjKjgjMM3P4J6sE535URCZwFngwJcUWX%2FNc1oK01%2FLw3hHr2cz4tajjp55r5dCwslsPujd%2B9E%2Fa2917SgbhW%2FbyLfKa%2BErQxNYxDUodG&X-Amz-Signature=8663a5c5ad5d777ea23365379155563daa39bd720c4f31b54566bd3fce91d029&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UVTPSLQS%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042550Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDWrsZnGucJMBMWR1Gw379rxzkHsXVN4Enm88m%2FzlwyOQIgYnTCAUmKbQtE4u%2FOTvtF06R%2FHWxMQLJB%2F6zvn1yyVNQqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOp8kKtUAqipdB7W6ircA3rWPVr22vc3MipZFMzJ5GNk33IoGtA%2BkKyxessFBIrIpi5g6lPNRao1ZlTuBUqS9BelA0P2Zx1y1YVG%2FiDhOsSYlY2K04R4feFoAi5ZvCC5zfz6cBFhKk4O9OFIKSGdNjBzYFid4asOgAuca0JyxaXdSr3wMSleuc90DMUd9Bm4%2B5KhMwYW0X9wRjW%2BToFTiZl7tglG6Y8tCA3J4sfPJrxSRdQKvvCAsXENo0wlrIHTabLFiFoIqaUkEH6DQVM%2F17UvcJ%2FcR7Fc5teP2ccidbH%2B%2Bl%2FMzHeuLcK8Lj72BTaEPhj%2BEIFWyjtQj37%2BEppgtB2t1ozcV2FzIym6diK91ysb9X7TfoCxG1EuGuZQYOaYtGy10K7JawFdsBVTR5F71ZvjskGqdTDFYKG8t1hqyhYy9gyKs%2Bh7PDvEl2%2BDuj3X0d5jOAfAPAP9PIugL7YtHpTyVkGSu9VKdv%2BlOsUdWwaUrGPPrjDq4GL1ouasd2e8lj3WiogmjMs619%2FjwGoNT0xVMIJZjgLq6o9%2FrS9t7TwK4RDdDFJrIW%2FAeXosFBq64QbIVtKrD5uXTKugT6%2FmdTzNSbx370WxsIbcS6M%2FvECQ4N8UNGgrylw2cYvKQbuXKxVQOVObfKZf6011MMCFntEGOqUB6KsQkmUWJf1NohVmMIYu8Chilqr2w1F%2BgH%2FqH4EUnZ7G5Bns1rN0kAChayd5FJ60g4WzOfIxjj%2F6ZMMezpcEuFw6Uo15J%2FOjhi2Y9QwDTKY3xIUZ8fvKtmuasxA%2FrIhNhgaj6Nu4U4JCr3rvqI9mPpfg6ei2W0pICZSk6kuCzuh7lB8wa72jeVvYZmNLWk6MGvgQ5PSNc68dda9DfqKvhltq8XWS&X-Amz-Signature=d143d673d1ab83fb5cb32cf4efec15d50693e52ff1f6886afd2d1cfc04fc02d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZXEHL6TW%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042552Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDuooJJZKGi%2BM0Gj1qvqgFv0FB7ah6MdOXiX9VsdzWKiAiEAtpyHVdG4eRN8WdWfRj1Galhq9zxIGFrE9D0LSdfGxosqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD%2F5b6cBypE%2F%2Fa7nMircA7AJz9HhZqcDP%2BfCzRyaDUrRUPfgXwoutqHTv7kYA4bOsmCX6FsPw5iqH2dK8van9kIRCYM9fSPPCwywnVHTTAIfWTAMACrYHs7V3BTcMbCcLsDNVYPTxFtHU%2B4FSIt3Ck%2BTwsKk5lRD0B7wGgw2RqpY3BcKnyvgbnBoD7WtR2tMNz43ucqLQWDH2RXNfP6pWiAWZnVvMNzWnbDCoObzmeBL5E51PPuXb2Zqe8jzHN9y7hDq0Zb7s8tH0u%2BsEW3WwYHF1Kth%2F8tbh9acybtphH8Hk5cql81Wjbadrb973goSseKeauAE6r2CYQw1OPjkfd6LbSEibGg%2FQgjQ0c9UODfFro9jAoaUSU5Kc1Xn%2B4VEF89o7im8byEw%2F8US9ZKkWFaSvRz%2Bah3lpCKuVu2gTXdTspShf9oO69NEjtbZDeVREdrTZ3bJzk81QmgvawL6AVKtRm1AqVUkinHYcEf0u1JuQavF92HcZnz0%2FJ887qm0NvoznjnHif%2BmFguCT%2BuiWOuy7IZeklJaIKyPDOJK001a%2FJTsb7WJl%2Fng4US67x613ppzsl5DADOpHLByScsiItQV%2BzGD6Zz4N7K9xBUDOGx4%2BtOrCbytDCImUb22buyET%2FwUFjvE11WdVHX8MLOHntEGOqUB1wySpzRYtHG4S5ZIWR%2FQNZyjPROTzK4ZEttoOwgr%2FV7%2FAbrA533K1Mc9tgvHWadIcwwLk9mvUJLMie5gwAjX%2Bfkkk%2FfzyYxSsJ%2BsB6OA6%2FOXdiLnTSfcmaNB93%2FbCFCBNJc0XacsRqAB13STEudCZOWFp7XhHDjvk3IvpBEr7sxjW8%2FTO0IIw%2Fm23YYtrF4vP8zhWjKgDaM68yW%2F0r%2BI3HbVvl3L&X-Amz-Signature=6225f5c07c02d6a0644813598b57263f19927ab53552dd0e51985dee9e72f7d8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y6K3UPBD%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042552Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD4ydC9Jw4x9MiL10hJ4I4Qr4eJDEh4jHn94sjvQBXEKwIhAO2pDwH%2BwWkE55giqEZX7goO8CNbVH4et6qPCeCITP8WKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyALQFR6A64JUW9Plkq3AMQmavcl6lMe87siXNySSAE0aA4x7pS%2BUQDTqhdNo3t5Z5WYOd9W9cxWNbc487rotZwroZ8bZnA%2B%2BZ8O7ep6VNzylp8k3uRllOS4jXRnAep9LIgpfIk3PvhQ2jWlLljHuMjgP3fp6Yojyu9EAszNeL07AiQFKp3JTZFS3WG5qjAhh4Zi4yxYHsGxF8%2Ft4YR3YSdBrTeBa6ygk0tf7U07ERJS2KU70Qjhosc7%2FZw4lwHkrahx8JqbMjmmd4tcEBPDF18u4Kz0EfyylrZl0oqF4UIAD9ApmBpSUT6ZPXVQYGAd43K1MmVFRWrqbQemI31AvMCnofT7Rg50a93NW1wlGOkxXIAadZP3rVT07d%2Fws4lFpEMRZa09qNcclvh6R%2BNnpzRG8QeWyXBzUpE%2F8cYdHw9K1xQ2UrYgueXkfvPojhLG8ZtC%2B8SZZhCVoX4eQOxgBSy2J%2FtZ%2FeN5p37ydGc7PojMl%2BVDWobAYQyC0fruV4%2FM8fCSWWXQLqDoN981rDnS0UljfzeeqE94yLj5R%2BBykEy6sKdfd6ARA%2FktDZFgL1yZGeCxJNIK8VZAwHekBhO15d%2Ff4iyAznLpOZ%2F%2B8BT7gp88AeIJvuW2M6d24n7LchiD2jYT96I0jK7IcXT5DCHhZ7RBjqkAYLlvdfQmpWbCtw3RW%2FgswZzy70nxMDkME81ShWhe%2BvhJmqNTWgahu8HQFJJFuJBwtiVxCtlmgUsQ%2BfZlmB36oQ8BLVrLOTuw3QCNkt3bSnmGrbOwU8yWUUZCaznbkpNJGVsk8%2Fn2qsHzv2TWxF4QrGCTkrnL14a3FW2g4yeQIRn38oQtX7ysW09hiSbdAz7dZDqBE%2B2%2BGKazNoQ8wBwtQ%2FSH3W%2F&X-Amz-Signature=bf79f47812af8a671660d26178e94908f1e32d7d8a5c7fdaf1f261dcadafd64c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665BWJWIBF%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAnijUVRBvOD0iv7DYLHe8mbA3F0w2hiKMQ6IPZ%2B%2FVnZAiAMcwaGJcuh%2BXG4ELm3je%2BqveH7ZHCjFaQrmiTAv6BqESqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMjOupMnCNMmPz%2B1pBKtwDaAFu2HjHAEPsf%2BZm3Xrcnova160fd5gyaL%2FUnstKFt1CICmWoObaZ0NFLokJTkL4vK4pmyUbWXERWGp8IDJ58AmVGlPhU9tqeExa%2FbVc083%2FYxG2rFeMbwGSZ%2FVT3qpeDMf8fDsxr3C6SOIjpluQLCJPDQJW7G4MB42V9IxyM9T0yPEd6Cg1Vj6fhMZS140sf1Dac3TMhw2k%2Flh7HUhP5dAwcr8M5vrKBBnZTeLFWUZcPpF%2FuXKZxHG2dHKVUmgp%2BBcXWPHwBQUeVvDaKG%2BvUhzW64jvglJN3DJviqbbkyKMkgt%2FIxNsmA4DelUk%2BMGvbw94D%2B9Jp0WG0VlWe%2FQl%2F2xZrYV50ugsdJk67FPY60QtUF2n%2FQ656r8QmgdfkM8coKZTUkoemCTbQdB28JMEuNU0Q0LrldHJHxDZfSp5NFfubS2FV%2B2BApz7TQ9FjT9KWq1s0khD%2F13V98m5KXTgfdGSC%2BKX%2BRFFtepfozy29q55fqzR7TjS8VjGb1ZuqQvfCycuNnfcWGf9RTMrbtDhMvJ2V4gtrn81W40z6Txhmsli%2Fj1NkNVsts7oDkwEHPyMTPWD8FJL7MltqFl5Q7FYn2Ski6tJHnPu50%2BRsI9T0VH0ZZB1DnG7ZAD3jt8w54Se0QY6pgGpCXrEMOrsIJeyTpvvMKEnhIR0DRmc8tthZL0wnSynxMVYjlzq2jySqo21ZxVZnhHb7xtaomgYQuMbYMTsmrppxu3OSFiCTdPLLO70ZNm7cfJ9jaSSxWFslMt3AFgmSODD8Ornl20Y8rnIFsJyNwk9axCUHDkZMEA6zGH6zHizacUiSHomZZxJvncdNJP9%2BXku58qZqkgwEKzJXS6kVXAni%2FEvqiQ0&X-Amz-Signature=8044a8e2de5cc383412dbfb0204d1db844dac6351ccc9c07806f5331a2f7cba3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YBFFYPWH%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDbVo1fIVduT6blAGwev9VGXiXDmcDlgtLFrR0vBDaLfgIhAL5%2B%2BhfFuHAsynsrX%2F2O6SLYn5JbiSn89h37SmJHp6IeKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyrrXN0GcPfzfJW5vUq3APNZPKWvZ4eFdsiHMXHetIqy07JaNNHKQu9Pjm5sA72L%2FlfYlg79ZrotGLp%2FC6jxnwtgk0QWeGTuj6JSXBJOiKdwHvKMruucYHEwl6nLIMXB0kt%2BY1AzgSHu4LIAhw%2F%2BJs32CYRIdXXwFWqRPaqylz3rih%2BJOxFA%2BPWY8qDaFYycjMRBCyA6nUvODUour3QKBloxVzXpeLDzMxlBbRkRV9BhOdDUBXz9jk7IdRKmz9%2BYlToKACJNx453O8HfBfCScG6r1kad06LLU12DmgAzRBOunw6xmB5TNcL7TkcS19sT2axi7tnKlvMYe2oxk9d8yY2vXQHoHtHd9mWieswDgw3orPdG1kx8tBaX7Xrxp3BM6hlqIMfGKFHiI8zBPLLHHYGqvWFtmoOymrJ6mIGKBRBKA458qnS0inRVZ4B2DxtUSAfbNRhDIZHcghd31OquwvAMRDdeE95BDhp15diCue%2Bv4X428ctsaoEIaNjF6CokYoMzp9JskzFs5CvZAvGtC3AmqYjwOU%2FSv2955AEUIBGfjYYHhIN16YxqF9UK%2F12uGNErbYR7PoHp2IN%2FmgfExpSeNYwrGdupFQiG3NN4sX4LjUaTXykOdM4EII41Stez%2FxXyPA80RYwJipDZDCHhZ7RBjqkAV787WQjmyCa4jIlTzEbzgSkLPNnli23FUwrae9ltZm0Yeg67BBUjOEtYiSjJle5e0diXX3BVfChIayaHO7VWE8kRB4uBhPQBXXxW9W7ZsAX%2FQMDspmjHH6V%2Fj19UXBRGxbUs%2BTcapo4nNIPLpYoqvdqEl4%2BH8Dtv6Q87EBoL%2BNO4nRxj%2B8zJ67HFzDWOYkxNeOcwOliGSb%2FTMc%2BXYpN%2Ff5W8sUw&X-Amz-Signature=4ef30152321a4cb454c65dfe7458bbddaebc02fdb2a3fa4e80f0d435378c864c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXSPSJNS%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCvZoU1djPHtxpmZETW5QmKGLFHJ97n0lVQD1RH5edJ%2BgIhAKugpX7ALedl3k5mPWTH6MaQwv89db4EbXGjY6YgEPdiKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOQ%2FD3WmCeIO0pDUQq3AMOkJnNcYZ5nDIpGlWk5yuSTYUg%2F0RaqRVvhAF3RAnNwYuCnYm%2F%2B%2BWRq1w2w%2FnpVR%2FI007VSaxB35o2UGfLZ%2B5WaiI0GoigHmrFfH9oMiDxfM0ijV4jcao%2FXUAGCIAugO3OgX164PDINI33xXSdlhmGBXT%2F8XoQAD3vDiifA3MMzXBS9Aps0yt7Q5i2%2BOszs5ymv3ZubGtNV1yBNHe0R%2BxmZ9d6s1xMywgvWFYnxwDScRSjrkJxFBnAzVCZWe1EqH9KuC5XEiK8UU%2Fc2bSHZV%2FhEVcZehuEgBsqKBI9Vg%2B7VtPUP9qkfPgjDQ8Yl%2BbqGXBmQe%2B9oGieOARKwg3nzn9idRJVNGS%2FrSMzWpKHLa0pPlAoU9e4m8uaHl6ZrBZ89QTv599jNAqYEUxNSfCEKWL2cCn2RiK2sFrYoJymyheFS35NBGcG0iOe%2BhTRiIFek0JGWUlovL%2BuhI4qe%2BUYjO%2BLE1eGAGHZUtSatI7WjErbT12trfw5d3Nxxsw7g4kiG2gJJMw%2B%2FsxkATlRF3dkQfSztH782hnfprrJsOyA9220epEeQJm3h3q6%2Fk6yuSXUyqMyr4wPA9bO%2FTG59KhDDa3ZRqxjU45LPYRvNFIkSfPeuEdIwV8bjmoLBoAyDjCahp7RBjqkARb0Ss3aQaZ9cnwPabKqfuuIRArClf%2Fb2dDWaaPlREUIBexncHYmOLSU6%2BgjiBgEkQo40XMl4GxdTCJzT9%2Fw2NHi1ygvTToABsqEh4qaB0zuwx2bxW2jMjKjgjMM3P4J6sE535URCZwFngwJcUWX%2FNc1oK01%2FLw3hHr2cz4tajjp55r5dCwslsPujd%2B9E%2Fa2917SgbhW%2FbyLfKa%2BErQxNYxDUodG&X-Amz-Signature=cba426b728622efc1f7a5ed50255b40244eb4856a862e21e5acc185f487569eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
