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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VA5N7PBM%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023410Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAu7qB9lLWc4UHrnJ%2Fsswcr2vH64Aazx9PMAHZEeAvEHAiBYYzNndOy8ndBvk3ThBeu1YSAFtvzmR%2B3KupAygM6%2BmyqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMC6GOUjC%2F8F5g6h6IKtwDbvTzI2tHTLCsqGePuI3yOJ%2BUOmYKhdRQagvAV7E0D3mdjXH3U6xWEhkZyMSnT3ebs7aTgpVuxKW4I8u7QCy8rg7hbxzf99LzDCXqeAjx7K6JXE7KYK6MmyFYVPEva3OF7elFjJg2erJCNR%2Fh9j9xNaDoAlTNAt0u6D3hUlB2ulW3IdTw%2Bk9Cn7czqCJsoFSgPrZGQZl2svGUFjbU3wLBpYRp%2B6YXMsRAEevhuSFcI9YkirKzVpTA9hXdHd0T1GH0b%2Fm7AoY3hv%2BZfzQPel0gyBPcwRs%2B%2FgkcD%2BnBn8IwGh06xJT6uvq3q0H8ruzuTlgY8SdBLPRqB8O3HFvfKP%2BrLhrwDf2NnX2di7lR8ITPopxRLa%2F0xd1%2BLDKkGTwHBNq98TpThlIuhL257G3cegOIQAgrVj9NBhADGOOq1BMdrKqdqqCe3AsY850VEy21V9JmMNvypMy1Z6ByMO7eH9%2Ft%2BeoH6VPkgg31aKHpZJd8c9jSeL3nJ1i3F6eMPKW7HaX5gsyVj6PPoiMAh6GcTizaeVxUhzbMLP%2FM6N%2Bk%2B%2BWEGPu44s4RCgzLa89tA2mXlBy7kIzzaGb8pWejcE8j1BAZrtXu1rabqHWXNZjDoUhZXNIcMh8g%2BoyIRB2GFHowrfL5ywY6pgELL7KFx7J8gA192D6kofmSIQXS0F9txud5CWBRQQW2Es1spDjXlmUs8MNmvypGnpUXRHxWSe7ZbFGKMrZBllAxfL8FcBfCZHWBn%2Blpnvxb2w8kXpgyCQGSNu2V7cFUyjK17mulEQEddmW1WkpbdkGIFiWS2%2F%2BNSFh2sj1zD%2FpgZa7t5KI%2FRioXwbK53RQj%2BhRKxvBQMxVk735eNWBinR79vSicKJDc&X-Amz-Signature=d5733c33303193d1769495b28c2dba82f3fccb3ab4fea12db1fa768604332f53&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T45HJNDC%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023410Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCG%2BxtbcHaYcRgg87d3uRkjLTok48ok6PD2wMeWvVV7rgIgAQnXwxx4RJyft9CXl4hez3XdEN1QuZ6oRZjciGBUXGUqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGOtJ%2BYYn2jvAs2F%2FCrcA3I95CMjijX%2FKW7eLR1pvs5N9pD6U%2FMGe3sXiYqK0yReOAmKBWHK%2F07JQsfTjrBxq2PyIvgG0IZEidVTpFN2Gh%2BDfxbv4JxdtNqEiSrjiryUb672AtzyC9iZmwK2xBOakjyTOY2%2Fp3hqPZRre8q%2F58mdDvutV7PVXzpW55dUnRBrjZP7tUFjxuy0RGfFvZGjdxoAmTuSY8LCzHneR2dMyHGeExYQBXCXQQJrQLTHp6rnEBOUe3PYF8uXJnOKO9bCdxwXc0Wd4R68KSifuZ%2Flj3qTQSOwtPcjboPHSMK3Y82qwFypiXKwKqid7n4UqpNSbyREI3KJiO7dddtOgN1nQALzN112WbFcO8ebMEwBSwfpa3YBhWUQlDun9jHITfabsj418jygx%2FLl4%2F8OEsFwAZecirmDWBDvqOnj1Pa1WPVjq1WaJ9e7vw%2FYEF%2F4CkEj9hefGQwUgFOepqiKp1PydKAMyRCwYp7i9bg6U8LLAc66OmhxfPHf8yJpArpiWsHud0Rkzd7pa%2FYp9ZY5go71lOFqZIuY536A1BpdQqrL7Ror8k6iFfb1JUyUkqhsvPnmu6uLwQe8QGUccyS9R5MgtZ4d3mIWxYNS9mTwAtAU0OzmqQaCJ76axs1xIPKYMIDy%2BcsGOqUBtRsgW3F3Tm0jnYUOQRF8Uqy9GovbblYXSddnvXj%2BqnmFgN74QXRZs60yAN2LlDaTHhTx2gupcgwIBhvIuN5z3pKvIIMW6lOlpryRkVWVRDvX1l0ABZhWwjw%2FOQGqwBZnulU2aFH%2BM1gLm19XIVvl%2Fquzppj%2BW%2Fj0S5dDroI7vwSTU0jA8JQ%2FUJtqYAooIQzw4d3LOWuZEj2pteDYpLxY3b2QYRUt&X-Amz-Signature=419d5161df93494ad571a0285b19ebbbc7c15ef9d5ef431a8587a8c1c84a18ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3D6RFU3%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHwNHjk81CzZj1Ub7zymphGc%2BPTLcLNtTXoh4z0UNXG%2BAiBhDqFgICMFPh6byXKwD5xwNybKR63bIJhHGA2BCN1OoSqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMG46WX5U0H%2FQv%2FAGXKtwDoHhBEc6FoDAHZ5icHJPVjJOKB7%2B82BED2d2sLoBao1VZ%2Br6j5cYfaq6iRqKFGkPwfZY7uJcS5g%2F8FibuXsc2nh6zo%2BljIyMahIhacEQUU0tCVdxHOzL3hn0cmNOBDHD9T1e4yxAHmFQXf4ByqSBZeUHrUV%2BqkP5%2BWDub9qL4Aj11T5SPIJqR7kEDvSaYADQtM%2FLgz7g%2Bw7PGGc%2BN0ziZ7GPS2%2Fn4YgG9u8kvFYAgVALN1tKj4%2FrUu6sjHVb2O5jaB%2FHi%2BtajY5ablWCtVEdntxjKLcYzlAB7wqvo7Ht1uWxS5n8ahk0WygM4kSTaD3AjNvKMHngVwlvOzrYtUK2%2BLtF8k91PNeNaLOlT4yZ6jfelPFwO6I1MT8pWPDp6qoa2vNwxvD%2Fg1%2F3WSC%2FLAk6czyr2NZJ2UN2myI0KGLDWSFamUmKKuSL4z3e2ApT831BnmttL83H8knENalkUF2a7VsNlxtdCCK4gB1Wx1dDwonfL5fT04Mqf5cp07krDd2p1Jpc2sA7EjYVdu33gvXACr%2Bn6gbaonCkKhP4i%2FDCql%2BatzDqLhD2DjEqRYiuHe1HUczhsT1tY75Zl5jNbgkZ0XS4McEXUthCdwgybZIK3pdtSvFXqwudVWGh7pTAw0vH5ywY6pgH%2Bl68Az5fWBxQvOw%2F%2FygdahyXck31WyHu36nfXa0BNtiWSyfUAdpzVpByWQmytSpDhvzuIqbPmLgPgB6DvC%2FKV6ZbjlsT4ITmPJ%2BWthCX6tMsyA98DMyK48xLo7q%2FImRKeuItRtlSpJgAQ7PKSEsEL6u4Ee40kinJSPD9GDoSuxSgTk%2BSTpvThqKjP%2Bfn4EUthD121AN3C5jLHxyvZ0iGkQeBebyun&X-Amz-Signature=06d071e4ade671a9c7400721968683d5b5ed14c64f1d5d8a777586e1815c25b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3D6RFU3%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHwNHjk81CzZj1Ub7zymphGc%2BPTLcLNtTXoh4z0UNXG%2BAiBhDqFgICMFPh6byXKwD5xwNybKR63bIJhHGA2BCN1OoSqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMG46WX5U0H%2FQv%2FAGXKtwDoHhBEc6FoDAHZ5icHJPVjJOKB7%2B82BED2d2sLoBao1VZ%2Br6j5cYfaq6iRqKFGkPwfZY7uJcS5g%2F8FibuXsc2nh6zo%2BljIyMahIhacEQUU0tCVdxHOzL3hn0cmNOBDHD9T1e4yxAHmFQXf4ByqSBZeUHrUV%2BqkP5%2BWDub9qL4Aj11T5SPIJqR7kEDvSaYADQtM%2FLgz7g%2Bw7PGGc%2BN0ziZ7GPS2%2Fn4YgG9u8kvFYAgVALN1tKj4%2FrUu6sjHVb2O5jaB%2FHi%2BtajY5ablWCtVEdntxjKLcYzlAB7wqvo7Ht1uWxS5n8ahk0WygM4kSTaD3AjNvKMHngVwlvOzrYtUK2%2BLtF8k91PNeNaLOlT4yZ6jfelPFwO6I1MT8pWPDp6qoa2vNwxvD%2Fg1%2F3WSC%2FLAk6czyr2NZJ2UN2myI0KGLDWSFamUmKKuSL4z3e2ApT831BnmttL83H8knENalkUF2a7VsNlxtdCCK4gB1Wx1dDwonfL5fT04Mqf5cp07krDd2p1Jpc2sA7EjYVdu33gvXACr%2Bn6gbaonCkKhP4i%2FDCql%2BatzDqLhD2DjEqRYiuHe1HUczhsT1tY75Zl5jNbgkZ0XS4McEXUthCdwgybZIK3pdtSvFXqwudVWGh7pTAw0vH5ywY6pgH%2Bl68Az5fWBxQvOw%2F%2FygdahyXck31WyHu36nfXa0BNtiWSyfUAdpzVpByWQmytSpDhvzuIqbPmLgPgB6DvC%2FKV6ZbjlsT4ITmPJ%2BWthCX6tMsyA98DMyK48xLo7q%2FImRKeuItRtlSpJgAQ7PKSEsEL6u4Ee40kinJSPD9GDoSuxSgTk%2BSTpvThqKjP%2Bfn4EUthD121AN3C5jLHxyvZ0iGkQeBebyun&X-Amz-Signature=c1199b07435055aa6e83818cd73a9fa1cea8abab639ad2d0354edfedf9e9ee70&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WLTYAKM%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAU9WqXgCJeZthmrKG8sTiSzVyABokK44OWExgj8AMzUAiEA5wsrlrzy9Xv2wwH9ejno5b9aSWql7lnBPd3xdlaSdeEqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBRObVILg%2FLqOX7BJCrcA%2BnyPJlp4BgW29GkRaEFpVF1ye6hcrV5w3mN3a%2BebqNnyGxWj8xEV5GCnDw0EGODXUFmkRsiDBw7dajfhcTfqq7Zn%2FnaaYoOM8u%2FVUnw9lXoe7wxZlfbe1UcPumqzdqj24m%2BvXDLlzbS%2FE3UOjJlM8UA56iFHi1%2BI3WvmkjYjdunt4A%2FOTWnJZ1TedRL9ieSQ725eWyKRwy6mV5woOfd9nBBiIN63%2Bb7CD%2FBhs4w1P2Cw5NpTq2aJuVeNfa44L0vwuBVgHvV2wcuOhi4uxdS8e%2F3ucBOywFSSl4WBakcn8N8i0jPGCkemwEDtvrqm02YoLPtjhv4oCgDZWpFE3kM%2B8KCudIE1P8rW4ubnG0aDNuT4YqvGEC7D6A0vXaU6uyWxTGIfl40H2Oan7IkB3W4Ioc48nPJF%2FBh2yllhkya3RzuxCCmunNDekFWVqwftwOnR%2FnzVpzSl5gI6ORge7uWN51VJ%2BwzotblWlbqlXFNFOdrR1fndKbsUwTSU2YjWNSk8mYMKn2SmjpERcuku0CbPKFZSkG2cF95c3RPuu0JrAmgMxM99yWzoN9BeUw6%2BsFy9MHn1CTN4xRc0mTXZEdwr1jjR4xhXho%2FYCRPU257cH9%2FoTEYmUmLLyEAGPVRMIHy%2BcsGOqUBJp5rgO6ycQcI%2BPdw3Pu6%2BqID8pG5%2BXFd9J9XUyzHMapTfJUdu5lOxZgO3d6wP8sJEQTSyf0Ic1X348st2Kn9vda1%2FO7QdLiI3M1nEHFDzSGtSuUQGfBry8D5Rn81JT3McG4LcuWX15wYFIhDh%2FZqLRHq4xfi3Cx%2B0bhpWnTwJcG1lfJdfpQQI5Kjqu%2BxYMa3iPwLXP%2Fj2UDsNqpkRfkf5Gsbdoxs&X-Amz-Signature=060f11e22ebd5fe109a4a979cc92dc087625c39a667c5cf8e2ffe5a1ec94e27e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U34ELA6N%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023423Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDRPrkLeV390BqcIhnp1yoNdbK%2FXbNAlIL9ahP%2BAmTCbAIgHWVZmvp%2BamfLlOfoEY0rx7uWBnEbsaI2WCp5VCy1ZcQqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPaMZOt2AJpC5%2F2%2FAyrcA7GB%2F8XajdVCy0YIPVqZnK2CniYhodiSliCozjUWZE0qS71z1Zm1G3nRoM7S5fe0bACCuKbnP1A3tornaQWdTmvKjzSYOq%2BbxqTqjULOwb1y%2Fvqy8cwiCqInevlFZr8JZ9rHfSaZaILrcApEjMaaXZYDbWGkw7PCmfmIUM1XVdpvPP5VqjXQXzvnzr6dB7XBCO2SqlB0LwIeZ2PQ%2FkbtJdinY6ku3bA9t5sKZxLMDOT5nwtFjyvrM5aMm3IvisobWslcs15xixa6v6FJoQdCRkIvn0e2Q3aC0QR0asDyPM673H9fbI7V3uzgmgq2A8OVb583mN5rhBhokQ9S5igYJxjWwL96yX4vSQZHlzxeC%2FprV4YitsnbdXGASKnzUErfL76LQE%2Fac0PVczd2uNpY8TzjeGLJvd2yY7RM62tAaK7%2Fdi1eE8aykthe5gQ0Bve2dByvwAAtqCoxoDggqchJQXdfv3mf0ZgVns9x9%2BWmA85OA7Ss75%2F3CIQUbYQCwxx3KQYjRZ%2B%2Fw8gyDgC6FCmGXNBBD6PBSvJPjvUVXtxIgZuCxoCRXr%2B4jo7L3WvMmZ1FwyWA1k2EFXGEkPJQSty%2BJlZahY4%2Bxs2hBS9VhYvZrv7Q%2FAiyzNXGBpXt1KO7MJPy%2BcsGOqUBQQDmVFN4Pgkx57tqpgOxz0dmNwpouP0sp4STKPQOztFumXAYqJb5RplYs%2BDnffobk6i4LUTn%2BV118R1i0no0pTYQ2owJR4O5JGmlCjSVu%2FITMinvbfV9Clx%2BIEJ6gFOIdu2cWYwyjDYOpkDmrpMWhPDwJ4oxN2ngH9x%2FUzaA44U1%2BzlkqGU7GP9gWIw3kcdkRDcwnZVB6UHe9h6MM0zCy2Xp1lV7&X-Amz-Signature=6dd680014936a1e4da84190b53031bf66c004b1d801e53047bd666a0cdce0ce5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VXCW2AUO%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHiiQgHvV2gAVLIGMPYDlSpCvk1bVf6iNzEoDSBS%2Fs3NAiAUwvE%2Fih42Tgm%2FcRjdSXWiO%2BPYz5ZhNfhLcbitahJAfiqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhFXqPvmsvKhDSZpsKtwDRzLWkxT%2FQB9lmpeMIWfvswQjd1ed45JoR%2BKttXR8XDwyApCKZtyKM35EQyvKQCEv20rnvl5%2B2TiUQ2LsiHtNHqCKywqZ%2F7QbvoQFmrpY8ErkofP02xrRDurQpaStrWDYYd7Qs23Q6GxBCNku4xm%2FSfduWfZ%2BFBej5YNezLoBtoWyozpgGnunBdUPtCCEgDGaqHyRb0FPgnJ9wINJ%2B47MI4Z2LqQj7lvlwym3Y16Y8pDSon2pV9KJCXr1Oap4B%2F%2BD3pJrynUmMuCCo8x0eEf71wFTeodnpd9mY1DzKJ98ijbx4qbdlFu%2BhiBS%2F3BHRlfV0pwsKv7F3vybGbqIqE%2B8O4SnYUhGOTuG60H5Bsq3CUdVWpKE%2FbwN2Wg9q4JexVtl8PFKbjc2iJkqzdoLrwSMww0wTUSn5JzkFsmw4SxpI2asVObER1W%2Ft%2BZ7hd2ikJ3QrEsJTP%2FjVTCsy%2FsX7YsBWENVM6LixhmW4hWm5lG%2BiCaEEHPG30TVEvDn1rd2GyVzcK1pXhj7%2F%2BYP%2FAvDhB69L9EJz0FpHrDDI%2BVxcaxGOC1UwkuwhTP9NZN0XZFFcenP5DbHIluATxgjbAYTcXPLaWpsiZ6Vq%2FvTt6qbPr5SxiqwUZchJ4JT%2F3S%2B%2BqIw1fH5ywY6pgGFeL5V2cWFXIY30AcnL19AcOtwgvQegJjoqfPhBOFh60%2BggWH1xtplcMfJyqq%2BTp3P0X25FIYfqQCo6lo1AakskxU8TVztWjYFGANdTeUvrc3y2%2F2%2Fxcqu9JYVr5Pa8tiFolllJZJBnObrrz%2B%2Bxwvm0lUxodT2h%2B6vP%2Foke6dzdZZFA6elqxDik%2FxZyyQnJme6eciBd%2B2sxowH7eOGn42LTrIIVF0G&X-Amz-Signature=735cf3bc8939ac1cab7a14afe6a6a3331d32a03885cbb0fd5ceedaafe2c31650&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XR76DYBU%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHm7Bc3M8iFTw%2BrcWllkMrboy8y33XJ2RpuoyGs0jDH8AiAgv87CQPVarzDOWcWmzSrHBQc7twbiADVbEkBce7wWFiqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMydGgDCfyZVEG9lSAKtwDs5Y40a19TFJDa1cZ2PGhKgxWNYEgrQDDBehScrsGLg8xCedOrUiIy2KT49mNHQXVMVtg%2BEeyksY8FaUGLJPTfcOdWwALiwxjot1X3bMXdBNdSuZHg1rp3Xh%2FhiBsxY4sWEW1dX%2F%2BEvZKWGIK%2Fi3%2BYi1%2BwUEEqQlGBLCWOJ47CyHN9gE3t11kr%2B2TvgzECJKO5S%2FQgkYd%2F9XPhtR49N7MAfpYi2vuIxyNo15hbIevhyMEMTOSJNUVnshlYCGPPOYDbNJABavUNGKXvDCT5jjL7P2hO362qZviNlDlRld5V8GMrDXsbYTlXkh8JQTMf6gNyMYLnW%2F%2ByQykGAHqjBFTXG464PE683rBjbgVhdm8CgU76RGP2QTOhhXnaRHRrwWNxE%2BQJIP9fGA6k1%2BDBkqnIeg2%2BBFbQnQENoHu3cfFUJUSywEgFNN0KEMoTqmO8MTV0%2BEoLIbKnVckfShuSTHNixv6J5SDJ2UMtxKoqJTazqHjdGzyjIJ5H%2BY0Zhny1i6ufbhWK6%2FH2IGTxmHZckG8DiphxXLeVq2vBZ%2Fr%2Fe2QnHq4PV%2Fa4u9EclLAhYc2441Yqc%2Fv9irTvLEabDNRTiEn2tiWbggJRfS5RUJuHO512nLHf%2F4Dsz8VHrgVwuEwkvL5ywY6pgH5FpAG8xTRYw538LO5K9bTaBFQrQSyfctWL2IMlTQKx13tNLqUAGbge5ySWh9J9V5AATeV01Q3FVOxTk%2FHykVHa5dcgNcONn7gbthczdMiJB3EwrghnOB%2F%2FQB6cIeiJue1rYhXBb1POrxjjgMNCtmjwTit9qmwpLI5Zd9xxRZhB2eLs9LFqOrLk1y3G8UQ8iuCpX1L8m8RHoGzXEFeQZnbTMiRXQiV&X-Amz-Signature=f120c5049218410c16cc12aa1cfddc0be0595c84cdce84893522ff2f841bec25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QJPRLNEK%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023427Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICYcrRX4smkEwrb5z9JARBUjG4FysDi%2B1wjE%2FTnFQjAQAiB4%2FbcX6KmPTHLXNjlrdEA815j%2F4RVyKqmlEikMmv1SDiqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMK%2Ftpl0hupGvRoVyoKtwDqGG%2BcVNcauDim065oh%2BYJUF4xRrXdkUGnznJSTIYdMbo1tsA6fGyO2e%2BAVs6gC4Ir3BsLZkdkz4pONb%2BLYKdrYQ4t0ckAvxWyveKbcpNHfeMf4iRyxVVmHiUPJIdnwwg%2FIzyFTP%2BHkBvWhpeyTR2ElnqUjN%2FqFBbXuDQliInSmgbKvbS3g37R7%2B1W8KSA97muk9K1%2FoGCTSETKMdqpHcGQh1DrLzcbeHqsv%2Fjy9hMbHCTlaV1sVB8OVIdb3cvi8axOJQkLGVhcVKjxaoSHWHLvgeDbRgIQ0MILAiGk0cR3A6rrq%2FXEE7DPSc0cFrZTEp%2FRYorqoSiBEZxknjlH2z4X0dc9Qursu9KxhbHa9Pil3%2F%2F5YIcVvpzUFCkbuhS1rsKekjc7oo66%2F2pSKZAQkqFyNR9MaSqcWi11hEQwRN0c52pAebBfiKSHFCEK3HpnbhpcNCpdMq%2BL%2BEA94vK%2FPwh3rYO028EsvzZZK6e6s%2FX8m3Aqi4t9rRKuA4HH6fpzi3Nawf1bQT13WTL0P2V2fMVpWts3BWfRKNHE9eYi5Mphexsd2MmCODmtZl9%2F0ekK4yJCOpcmr1PVyVTsfC9C83et4LIQQNAlz294ZKdzRvw88rXZqaeaqEmpUBmMIwoPL5ywY6pgGepQp%2F3CYY1%2FHlMDkucN1zgZaHYcrvacf5oudPzsuM9jVwOkgSTU6oQBoC1%2F%2FL1%2BJuMEdQZvO3UJSFBiZTv752gDA0g5tUYKk0AFMjE%2FWiZtzg5xmEkYQjLKvigVZ636Tbh1o92wN3B8PywJMzUoh%2BHywNucN%2FCgXi9tu7vQyHngqfH7TPKHDTMOb0CuRv0lq0IpL01pGGlq4Lq8%2BYNhBCEqKXa0E7&X-Amz-Signature=031026a192ffa759e7af49b23e28d76034756d2a2817fa9d4b987ee6cb375e15&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3D6RFU3%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T023405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHwNHjk81CzZj1Ub7zymphGc%2BPTLcLNtTXoh4z0UNXG%2BAiBhDqFgICMFPh6byXKwD5xwNybKR63bIJhHGA2BCN1OoSqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMG46WX5U0H%2FQv%2FAGXKtwDoHhBEc6FoDAHZ5icHJPVjJOKB7%2B82BED2d2sLoBao1VZ%2Br6j5cYfaq6iRqKFGkPwfZY7uJcS5g%2F8FibuXsc2nh6zo%2BljIyMahIhacEQUU0tCVdxHOzL3hn0cmNOBDHD9T1e4yxAHmFQXf4ByqSBZeUHrUV%2BqkP5%2BWDub9qL4Aj11T5SPIJqR7kEDvSaYADQtM%2FLgz7g%2Bw7PGGc%2BN0ziZ7GPS2%2Fn4YgG9u8kvFYAgVALN1tKj4%2FrUu6sjHVb2O5jaB%2FHi%2BtajY5ablWCtVEdntxjKLcYzlAB7wqvo7Ht1uWxS5n8ahk0WygM4kSTaD3AjNvKMHngVwlvOzrYtUK2%2BLtF8k91PNeNaLOlT4yZ6jfelPFwO6I1MT8pWPDp6qoa2vNwxvD%2Fg1%2F3WSC%2FLAk6czyr2NZJ2UN2myI0KGLDWSFamUmKKuSL4z3e2ApT831BnmttL83H8knENalkUF2a7VsNlxtdCCK4gB1Wx1dDwonfL5fT04Mqf5cp07krDd2p1Jpc2sA7EjYVdu33gvXACr%2Bn6gbaonCkKhP4i%2FDCql%2BatzDqLhD2DjEqRYiuHe1HUczhsT1tY75Zl5jNbgkZ0XS4McEXUthCdwgybZIK3pdtSvFXqwudVWGh7pTAw0vH5ywY6pgH%2Bl68Az5fWBxQvOw%2F%2FygdahyXck31WyHu36nfXa0BNtiWSyfUAdpzVpByWQmytSpDhvzuIqbPmLgPgB6DvC%2FKV6ZbjlsT4ITmPJ%2BWthCX6tMsyA98DMyK48xLo7q%2FImRKeuItRtlSpJgAQ7PKSEsEL6u4Ee40kinJSPD9GDoSuxSgTk%2BSTpvThqKjP%2Bfn4EUthD121AN3C5jLHxyvZ0iGkQeBebyun&X-Amz-Signature=abc99385bfbc56cb4b54eb76c17240c6afc269138bf8f6df6fb74d23da6a0963&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
