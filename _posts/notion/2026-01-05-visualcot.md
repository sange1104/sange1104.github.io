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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WID5GLXF%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041452Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDJtNZhXMx8ef3rKC5gFmOl8gSlBcbhmK5wojgYkeUPhQIgBnzpHfQI%2FLlzL8Lymnl8Qvq803wcIBVd93v6R0GztZIq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDIpQ%2BX2pw5Sbz7eyfircA%2F8fkiZxsGrF%2BS8vdTYKBuCIkVFxGjPXbYBuE3w3nMPd%2F%2FWeni%2ByolodEQhpSx7zrKD%2BE88u2NMrmRkXun7S7uBULd7RL5Jkt42bJ0aKbFg7SCyqqAVeId%2F3FIw8Iqu%2FJ0AMsB%2BednNv3%2FGMzpVvL781qq%2F%2BjYaQ5mkS2sn%2BLWcuBHpe8gU9Fg3ldt8sybrIrpf%2Ftuu4NoObUXiAkEp5oqZSfqmAb3RgxlVW3gOkxPv89m%2BPdfRsEg3R2vH0fDtaBulmQNr6fwj6pWVAuicPHkUIxozkx7fC6ThBeFhJ6ilT80ihBehawIsguUJcgRn5wEq5ZTLAa38XoN%2FdijIYssynp3uC%2FlsnJZmsiBSjODcKZIulaBoXRoGjnunnH6zp8OH2UePxsXhbQF8kDG9TUdTpLrsAOR6a3fEuD%2BxnFM1A4AMkf5xnsGvFwqqb5OgC5jxmYf0GFO51JQN%2BVd9zxl8U8fVCj2bWIQIgU3euBXNVD036VdoyYFspH8WPqxPFYUr4fEYTDHxqwAZ%2BGj5AahzA9rsxwiF28DFUnjFeDSKU8flqX6EwS%2FnDjzxCXISOwq8EOl1Ya1QyCVLPTgow4KGO4mmHO%2BkXInO6VjAtR1xIqrNLjPeQ36hi%2B2DcMJv0lNAGOqUBbLNCsiQvZ3PUTzjGZaAiy0X4iK%2BxxLSiN9Q7SgQsU8gzy5Ea2NmTKxH8y2mxXzxs6Jw17osAfFD0c7GKoPQXDpqpWyASs4ngFXpnpQgCRTF1xofly8PWlHEa6ya0AXJMtOPAWJs%2FBxkXfuKhs%2BNvdUxGcT0yr6vlTmLwBI6aG2aMAX%2BbCYT%2BFaeQ%2F7JqTDAdLZS5njGJEaEZJ05oWzNCUywyRCjG&X-Amz-Signature=e35600b497d7b4a2b0b129999741e9a152d6021e4ebc0296c98a75e821ecfe26&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VNA57K73%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041452Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCYc5LPI4dT3OJ3OlQEOkrAR379ZVg3tN9UHc4dQrEcwwIhAKPSxHoGaVpp0TDVBWOu4EwzXbfUJ9NSh1wwXTeS4QElKv8DCFAQABoMNjM3NDIzMTgzODA1IgzTMW0bcdTwGIeoR%2BIq3AM%2FgzJDi5ohGoVm0KFl2VG45PSZDv2VBAVL%2FrXTOngSmTAAQrPdk6aHvvsYv%2BXQ7p1DL8FEPi7KfjfxFA5%2BQYqGVuQlgazGF%2BudUXhN78RZ7Joz0L6b2CTReslFQG4I%2BA7aPywgXw1oRKGXtORRczg9vd1UmqlIOFA5IFnhQZwzEpI%2BxwfPdWJUudCCMNAdYgl5MnRwY3Py5zvPAK%2Fe2gHLDGssADt9ibZ3KwCAldAn8AAlOqQpXTs0C%2F8Dd46pe5iEwXJhHhDqAE%2BmHW6Lm6bGWr%2BYN9U%2BLU1TohQGB%2BYNsFn8vfJYsycE4dOHzymaPhs1Z53pHpw3ET6KAQEV4rldS3K%2FAAz1t3GUhidD5uy7eyWsxqQRwrSBboHA%2FlZGk%2FmpZFJABelyh0s%2BcZb6iJQFTGz1IFUCZM9WSqxNt5E%2FEmCK0NKv6UatModOJvc3SHpKNtEmHbKYYAgZL%2FY5mrUs3PDB84i8LybGhuRPMinylDflPnBUgnHULKFCoeaW2Q5ACCdAee6agBXsnG%2BIPQGqeCjPf9fN%2B0G1Trw0I0y8xfjyAoVQ61sX4aFxVYKXnAuj%2FTVgk3P0cfialopmb%2BLUPhFQPLi22aKfxTA0oGW3JG07OWIQ0o1NtbwWGTCLjJTQBjqkAX0WwJ76EeuSzB4R66MhJ028GR9UZrL2K2DhdBV1OM1XjohoVxl%2BkMxRMtjx5VQSfs7msj3GmP8I9V6XsRQ304rMMpIwRw4uFcGdABs4wJazmVHgZB6Cz8wdWIwA4pko%2BJ693rYLEXpn2dakJ8752QnqdbQEcb3IOUOIzR%2Ba31B9yUQphNb%2F5%2BcjBPARTwE8oOp8M8NBSCZRBHl%2BkC%2BkiVyS%2FmCc&X-Amz-Signature=5c6d7fde2a25954589c86323d056028394306f979886238c9380469cd129ded1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666DWR6EYZ%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDo8AxKQ3JU655juk2aJoQaZ%2FwI7zCV%2FKWxGgx2WcLPfQIhALZUY6WFt5yv9kDS1Dh7yskey1b8%2Fd9r1%2FNwLf7ceqDgKv8DCFAQABoMNjM3NDIzMTgzODA1IgxE2hxDWSR1bg9P9vYq3AMtsAtEz6VWj5l7kUl4BkXsCVdd07xRQoDvicRRGgELSM77O%2FxaTaEtQdksEHgqLqZpJiXfOSm1oJ6OlSHk%2FjpE9yN%2FrJcuBEqB9PGTsZD8j0gaa5hp54HxHxBV0qY%2B5quKnYz7081lNASRAgiRtCQ1Uj5ksmCtOClV9QaLk8Ju%2B76irPbwt5FFKYga%2BmV6iKo3jEOClsbb6cSxJZ9sphmWkL0dURIE2p9YO3R%2BIVFOOM9DXsAgOMnLgntBBXniQAxhJN9NTtbPGQk%2Bt9gD%2BBZPncCgdHU1IuKG7Mqj4yPBIbr378KLCjuj81RnC4ZgP8VydA73cSHGMkL37b7PnB06kqfws8cqVT0rNciAQDk6j8vJZjdQF7SfR68uZYxAi3ajZssgL82YlDftLHizJGG9MvjL1fFnNoeP4F6efwSItQl5CaAj%2FStmio6fN5H6XIEHoQMa1qajqWvvT4uZ%2BLK2EofXrjKC16XDKErKlamvYgakLfTtmnboeP9NfhgGOXxk98nskPJivTrN0%2FEn6LUvSK1sKuGS1BynuJpwkCtThCxXL3chAiAM0sIo%2FqqInL8fRTNzX5GQQWKUPMA2y%2B9erU0fjHkBcWGXB%2Bag%2FS3fvzseIW5UhH2Vi%2FpUuTCp%2FpPQBjqkAQ0AU0VNjB8bM7zASRPx80iG79xoJaApAS7wtc7EuZq%2BpHxfGjjIfu1tMHtxTBvseg3YL6v6dPHuw33lllwyEiPetKAmJVnku8tHkVJKPLaJueA8FCHgr3qY8Xubsew8QnWghj%2FrlF0PI%2B1nJQnIxLJuE9o0%2BWUSctHusx3Z6P0ZEeelLGFjjGszkk4H6tuXyjIciNhxZNzUM%2FZsLctVe0F%2BLSRe&X-Amz-Signature=ba1ce54e84f7aae3cdc78c25dff1787ed6364f3290af4758d19ea27b1fc39e4f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666DWR6EYZ%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDo8AxKQ3JU655juk2aJoQaZ%2FwI7zCV%2FKWxGgx2WcLPfQIhALZUY6WFt5yv9kDS1Dh7yskey1b8%2Fd9r1%2FNwLf7ceqDgKv8DCFAQABoMNjM3NDIzMTgzODA1IgxE2hxDWSR1bg9P9vYq3AMtsAtEz6VWj5l7kUl4BkXsCVdd07xRQoDvicRRGgELSM77O%2FxaTaEtQdksEHgqLqZpJiXfOSm1oJ6OlSHk%2FjpE9yN%2FrJcuBEqB9PGTsZD8j0gaa5hp54HxHxBV0qY%2B5quKnYz7081lNASRAgiRtCQ1Uj5ksmCtOClV9QaLk8Ju%2B76irPbwt5FFKYga%2BmV6iKo3jEOClsbb6cSxJZ9sphmWkL0dURIE2p9YO3R%2BIVFOOM9DXsAgOMnLgntBBXniQAxhJN9NTtbPGQk%2Bt9gD%2BBZPncCgdHU1IuKG7Mqj4yPBIbr378KLCjuj81RnC4ZgP8VydA73cSHGMkL37b7PnB06kqfws8cqVT0rNciAQDk6j8vJZjdQF7SfR68uZYxAi3ajZssgL82YlDftLHizJGG9MvjL1fFnNoeP4F6efwSItQl5CaAj%2FStmio6fN5H6XIEHoQMa1qajqWvvT4uZ%2BLK2EofXrjKC16XDKErKlamvYgakLfTtmnboeP9NfhgGOXxk98nskPJivTrN0%2FEn6LUvSK1sKuGS1BynuJpwkCtThCxXL3chAiAM0sIo%2FqqInL8fRTNzX5GQQWKUPMA2y%2B9erU0fjHkBcWGXB%2Bag%2FS3fvzseIW5UhH2Vi%2FpUuTCp%2FpPQBjqkAQ0AU0VNjB8bM7zASRPx80iG79xoJaApAS7wtc7EuZq%2BpHxfGjjIfu1tMHtxTBvseg3YL6v6dPHuw33lllwyEiPetKAmJVnku8tHkVJKPLaJueA8FCHgr3qY8Xubsew8QnWghj%2FrlF0PI%2B1nJQnIxLJuE9o0%2BWUSctHusx3Z6P0ZEeelLGFjjGszkk4H6tuXyjIciNhxZNzUM%2FZsLctVe0F%2BLSRe&X-Amz-Signature=139e4e4fd84574ab33c253ee629f3783654341580ff9c1f9bbc1b99a7783f03b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664U3IYMRK%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041457Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCo9ho%2FBjmACsTbgiXb3UfI52l2zvlC98khu3pO1hDDMAIgOJDFnqLOAYdwfGUxHZkryQ2xgxq7Ur1wT%2B4RFojmOPgq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDB%2BUEURQTxtskBpyEyrcA9loDdQ5WBgnj57RxDG9NBhwrqP%2FMZdW9xF%2BD0qevUIGwiT1nfsGFRPph85IRbwXAtnpc9pw5CrIkzsQBQUXYtClFKX5fkQTx%2Bg47LLbCLbbP%2Bp6jgclfUSgJxufzkpG5L0p35uQZT8YxICjMdrBxjs2S%2FwaU%2Foo%2FgYxxUeXbucemSH5zaUqwuYajsUWJLyEVNjILiAXREvZLUisn6g2DDJEEluR6v5Ye9zi5CnHWpUsQy9NAmO6LJqhIyR8ZqonDFBa7FJpXIqauq8UkvsnQ3qgALGz6tRQh9hHMwzoPAcSnbLg0BKarrfRUSx0riOjGlzawmUFdi6TlYoBOHthf1qUL8graDNinQJcM65SPoLww1HXek4I7nqqIU0NGqmdwFXLd2P894%2FSUz7TZPELLryGtbllpRzjKnaUwuWGE9jt0dMCqtMQLg9W1bzdexlQaq%2FJvXWtCLWG8BwoiPpRN9BsYHc18qNpDCsQN1OHqdmHADqIfd2b0p6izGjOpsYCN80EdLpdo41VhndSRApmDnGwgMU5XJBjNuWynAcmfcJO9ST1cG8H7LXTa2kTOWB1S3oZT1%2BQ%2BEfI3Fj6qvRVGMWqlY0v6kSsSbdFw2y%2B8%2BCkatYj07urrJ%2FiGxMgMJ2BldAGOqUBb1gwsA6OcxmY6Y6gK7phUvjCYbd6R%2FuEPdwwMbc3v8qtEjud3QnKiPtQJQpwJpWhjh6%2FUMScSxTkrzw%2BruExMlCrUCABFEiFeI7exkhBiUBdVjLCIkuI58oedn9wS607Hh%2F9xiMqCcVPG8DFCvaAsPwj%2BOIrnTfa13zBuHUSqSrR3tU6lTDjBsh9dbWWmQDi7he1ZSCIl9GCX2IL2R1m75CSBssU&X-Amz-Signature=bffd14d2ef5f1894efa1edc2f45436088d7c4787b204f41d12339ba93dfcac2e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SS2JW44F%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCZB3oAYd6CWZlR%2FHyfYkVMtU7ti6mQMmaAeeVceHaGBgIhAKTXbTU2JP1loMWCPAiU6HHZcNXktpqzG2yFWzSrjXcnKv8DCFQQABoMNjM3NDIzMTgzODA1IgwaZv84RycMOUx1s7cq3APKjHFhuJwnQNbcdhGJzj980ftd2%2F0uRaTz12lOUPssQl%2F5%2B7q3VbjR9Pv9dnr0rESL%2FCQlWj%2FkMweuJnr9GeS4KAHT2VGhD3BjORAWVo3gGygP2fGiOzyjL8gwb25b7NrXUgBAsspMqE2SajbPuxuprF9e8jPhuesY9sAIcgBojaSSWmN7CKrHitrlBsfTOxCbPwjh73ILSvzhCAE8y8Wd7HGcWI0ROnlvyIMCBJ9PYqxiLFG3zE%2F2CbJHA0W61vRxFEGZrBMfnwwv7DUl8yr%2FByseX4kaqmJpX6G%2BzCGUqSevLICPbcQ8tYumR1WhoGaXKergTubwzgbA%2Fz0b664bNfRnVmXoIyprWuMroAPn5Z77Hpd3MK%2BLUHdNCikDu6jRS2seZs%2B6BteRyosQ%2Bm3Ug%2FjqUJl6kSxBhekBpOSnLKHDoKK5McQcMyVdVKtMB2Ff%2BKuJj%2F32Nwfhs5RTnqkC60J82%2FB060UeVMVgQ34UpYjsnAcxMpRv7ftnfZCl9v3dNyzaAyC6DDZAsDummKd9IL9FfZLeFKM2QGedWZxgeP4k7QkYhDzYtxCKp%2FbuCKBGfSef4aE9WrAA%2FvICV%2FIFtBqUyc3Hobn0jtndvzx8ih1Zc%2B%2BGVHY%2FsMQmhTCt75TQBjqkAb6owPSzTwJmbjna1Voua1Pffvl0bG2%2BIBJcjHRtFrCPUBmWhQTjN1xErO0k%2FxNtCXwb9i3sg7BSOvx%2F4ihqZDg5qollCu7qbM%2BO%2BG%2Bjt8gxZ6HSri5e4tKuUdwQhs%2BPZC0eT9Z7uhCjkosImgONLYnVMl%2FEMhSMJAkZBCdSiJMd56rpfWNXrR1kzAabidl5OwI%2FM%2B7QwGJhQtFLsxsS51Vp8LfE&X-Amz-Signature=fa33fda1bad55971737d1473b4d05a4fbe0b6b86abdd5d4650a60f96fdd280db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXXHCFWV%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFZ5ACSIn%2B4REROvAtX3BNaVusM30rT%2Fshq7gEub9%2FDlAiBY5bL6rVmpcZgU8WlNOK5bagXqVi4P%2ByUEWu6ll6TlvSr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMrCwoSScyVKa6e0S1KtwDdQK%2BcsWI6Sk6f4g6%2FXyimKrzGpxiCZ0HdzSF2IKOKU%2F%2Bzob%2B3I6vNP4NGQXRZyUyq8%2Blo0SSmNUR9gb%2BL69CZGsYHl3gIIiVUaAkHc7dueCyRb8nxsFndB71ERiJ8bnXUdrAfdUxtjKox2%2FUub8ZQ5AfLOEl9h6Co%2BW1AfNlu9EwX0f2kfNNm0G3RnoUyfN95FNbtBUy7ZFgkQKsSejRj1g5oepskkgQcQxHCaSBfYCi3pXBMYPS1Ua19DwIoYuCx23PA4q6j6ZB%2BsIcJO074AaAqzXho4h5dxaHtD5sy7w92jIeoiePagwmLo%2B1xEZFLQu96esUW%2B0QKX1lHcTxr6yzbADmEqmIDTw6%2Fk6fcQeCobBwFAGKbbHcx%2FmSl6ruUC0Mbd%2FGiHEMPrDZCRF0fZoiAAqHR8SpJmC67t3FaaraNPxB%2FLwFvYfWCdmMK3i1aIE2mxNQZxWCfUwlWv0ofUstu0j2dFIx0Tcq4qlAwHxKXk0tn8n3GFcdZEaoCr5ZQs8CAK9NvrpsoyuzRrM%2BzHqBVKDpNUM76ypCz1T52cvei9QJ1O6iEcPU4WavQS7tLMRn6lwLDV9OimxqK7G76Uam40Fw6tYXanG1FjHGBPONSF0VB03ByJHNvfIwxv6U0AY6pgGflFLRl2Gpb%2FKNpWpdfQ5gcW1LbOBmdMVZSP8LjjdIuotvyoSuUL2ZCVhJhj0mmaPaxSoQPLMpj68aLEa2580N58lv%2F2uNb%2FmaOfQPMeD4gQoEK8PNSWX%2Bbp0Cdolb%2BILoBEofr9pOVXymzLNtEqJQumzZ3mtgQp4elngxQLa5k6YCen7BrwZVmAgt6DCN6%2B5Qrc20X%2FitKHBCFVn4vh9D8FoUJBW0&X-Amz-Signature=7eb13d18270e4d0ee64dbe49fe2364df4c0936913ad4d98fabd1c360417f0713&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VD4W2LEL%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCr9v%2BjD%2F2SWY6bj1fCGcoZfD1d4mVRSGDi%2BWaJ3BSMBAIgDnoAg%2FJJ91Jr8Y%2F8cJuiqNXusm1nzY%2BgrlPZVzqxe6Uq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDJCYr0b9GfuG6m5vtCrcA49BLHsRYZxODq3KZRIRH%2Fnv3f9hB%2BCYMwbkA%2Fq6PRwrkmWBBeqUVu%2BsHsIf8NYKm18LVEqsVy6Dvl11Z0TQsl463mgUQikFPp1%2B7v62fTdc4A1ntB4QP5ws1N7N0Au5RTvgGyphXByQjirUSLg%2BrCaDfl3s%2FqMLnzq8tsOJnPjT0MiThhUiVZu4meky7n76eNTdYvCGyMShp3RVcYm74rsOuTTB1vsl1fy55%2BOFw%2B%2F%2BvBRijDxdzX%2FkCMXOELH%2FGCXJgPvQjkE79lPjHZmw1KeyI4XZj7xwkVToSc%2F801H2%2BfF67%2BLazT4MOkn7UC%2BzcnclS0xwti5p4XkSw0Eok9Zjq6KDZ8O605LcxWfvZINwIogYCCGsSnQ3y2DAF%2F%2BNlT8rPT%2BSHmXL4f3AfFFXxsDUoAHZqngrreTyQwgY4sZVleIxvty31Ne8jvZ0t%2Ble0zyo3qXGbCeFd0UKVaxAgRV2wvW6aFVe9zlbNiRhfvqZhtABoQffi5X3bc6XwpTEjoH1ibgn%2BCW1xv%2FLL1tYV9KhGn4cChBvvEebllc5hhW4bCCV90R0jjoqt0D0EcO17opd34j5XAV5GEeZXS49tEEaD2OnR8PIhARkaNefsnK78ilVl4Xrq65F8jPGMNP9lNAGOqUB%2B9%2FBRGCI1M%2FOAviQz7IeQcazzczzykc548aKQs6F8HBCkDentEIRV8uBj%2BXX3agTfiw%2Fi%2F0BJD%2FPywCR%2BbuS5%2Bc0b0l%2FrxvYZfUCXxH%2FMQR8kA7O6ON%2FJhor0Ri%2B723Wy%2BzMpyz8eblZdf%2BfVO2caB%2FTo%2BVfXvrj0rCb%2BayQ1NmeYj%2BbT0FIKq%2FaVOZz3IQHUZZAHwrH%2FSeUjbPh88gj3odysZlL&X-Amz-Signature=ff366b180d2b4154cbdcda9a71e592471e043af5d75f75a8779d7b135ca36fef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662PU2JDPJ%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041505Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRU%2BFiShfNIO0C%2FGNkAzAAlwwEFpq9D3xt%2BcUioGhnhQIhAMy2hqhF5b9VJST8FuInW6GTUsv41tss1tBHAuLrmjyRKv8DCFUQABoMNjM3NDIzMTgzODA1IgyF5rGVul%2Bn3CWR7Q8q3ANaVqwHrG6RYr88%2FZbvAxPqMF%2BPznXnJ6Zb5vxMQs2J1SLdEuc2CoRCiflCL5WZyulmMmFOmdfcRR%2Fhg52jAVICH8GYiLtei9%2B748fv%2BnJdKl7%2BOdVA4nipSJ7umblS6skM75U0%2FQH4wJlSHWB54kWiClpdZyfcnce6lxlm5jCNu6gz0NPAUVqG%2BQk2%2FxCZ9fFlO5t0OAlazJDMZUjll3b%2BgEk7mfORrng7vnEpK10a%2FwPw51TbQtHgk%2FdobKihruKTBAOhM7ZYv5vGMhZPHuHxl1T%2B6PK1Jzk2rc6sSnqiffc%2BNj3QiWmVCglSgVguoSlLNNBB2L2vktoaQic%2BON8V5Mnalm89HulKM8hrnoFcMh33FTcLWMShrVm%2Fx4C6El1xcEX2GxXSTMwMfh9rkZCWw36aRZ8DNOyF1BX2OOuSbo5YU0KWRY1At9mhR5XBqXHFH3K0uCxkMtS9BUnofhJHUJNS0daNs0DQSj71pc73LDoO5vB%2BXsQAyh2VRuzwmcEsrVdteX5PWSDgbK%2F9YTmLY0uERhrgOx5FVynlFLSdhyjC1FvZNaowTXJi4iI6mL2vo3zSV%2FrbBMIfMEUcgkbaTLmvzjCSCFWpzlF91ME1NqHvLDXIH34xjBq0WTDXhZXQBjqkAQBftCRNlFvqru%2B8ZkP0ygvn60sJ2eh2xjhYA4%2B8NDh3hvJP8aw%2Fgy4ukSdN63gTXPasNMmrCP1wRxSa2j8nFaNW3OKTd7fAec21hgeGzZgR7%2BsECAGa3c66EuFHcofXeV3hQJYV0jBbUKTqWrffqsOKDvxQgOgQwMq6Jq4qeUWhOJlovc9%2F%2BuvO8UmOCumj7tTE3KJf0kx9LN%2BI3GCLCu8%2FmNty&X-Amz-Signature=6510becd7c9f7943d8d55fe157b2b82e0d8675eb35bbd838fc510d57fcb232fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666DWR6EYZ%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041448Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDo8AxKQ3JU655juk2aJoQaZ%2FwI7zCV%2FKWxGgx2WcLPfQIhALZUY6WFt5yv9kDS1Dh7yskey1b8%2Fd9r1%2FNwLf7ceqDgKv8DCFAQABoMNjM3NDIzMTgzODA1IgxE2hxDWSR1bg9P9vYq3AMtsAtEz6VWj5l7kUl4BkXsCVdd07xRQoDvicRRGgELSM77O%2FxaTaEtQdksEHgqLqZpJiXfOSm1oJ6OlSHk%2FjpE9yN%2FrJcuBEqB9PGTsZD8j0gaa5hp54HxHxBV0qY%2B5quKnYz7081lNASRAgiRtCQ1Uj5ksmCtOClV9QaLk8Ju%2B76irPbwt5FFKYga%2BmV6iKo3jEOClsbb6cSxJZ9sphmWkL0dURIE2p9YO3R%2BIVFOOM9DXsAgOMnLgntBBXniQAxhJN9NTtbPGQk%2Bt9gD%2BBZPncCgdHU1IuKG7Mqj4yPBIbr378KLCjuj81RnC4ZgP8VydA73cSHGMkL37b7PnB06kqfws8cqVT0rNciAQDk6j8vJZjdQF7SfR68uZYxAi3ajZssgL82YlDftLHizJGG9MvjL1fFnNoeP4F6efwSItQl5CaAj%2FStmio6fN5H6XIEHoQMa1qajqWvvT4uZ%2BLK2EofXrjKC16XDKErKlamvYgakLfTtmnboeP9NfhgGOXxk98nskPJivTrN0%2FEn6LUvSK1sKuGS1BynuJpwkCtThCxXL3chAiAM0sIo%2FqqInL8fRTNzX5GQQWKUPMA2y%2B9erU0fjHkBcWGXB%2Bag%2FS3fvzseIW5UhH2Vi%2FpUuTCp%2FpPQBjqkAQ0AU0VNjB8bM7zASRPx80iG79xoJaApAS7wtc7EuZq%2BpHxfGjjIfu1tMHtxTBvseg3YL6v6dPHuw33lllwyEiPetKAmJVnku8tHkVJKPLaJueA8FCHgr3qY8Xubsew8QnWghj%2FrlF0PI%2B1nJQnIxLJuE9o0%2BWUSctHusx3Z6P0ZEeelLGFjjGszkk4H6tuXyjIciNhxZNzUM%2FZsLctVe0F%2BLSRe&X-Amz-Signature=cba16a0acc1fb324c7c1ba8d643dd630b9a62b7e9d6013c2ba38cd76a5dab988&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
