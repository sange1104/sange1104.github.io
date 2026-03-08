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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHKFS5FO%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCICAL%2FLM3YGyiF0Lzk2JWV2tM2JMIEuB3SmiSLIsErJxPAiB5Yo%2B78lcQzs8AEFz8vqA8bVBhY%2Bbw5n1Osbq%2BxSGk4Cr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMO79mHCd3tJeKUVjvKtwDz4ZOvwIo%2Bhztv%2BFaYQlykKLVuYVFsXc13uBAdhd%2B3VwHRfZK9yrfeHrfx%2B8sNvfOe5bE5rQ6VzIKJu6KRpmbtRIPMAYKXEKjO65u6Ac9G9KsvTMogwwtx26VF4%2Bt%2BCSuCDITPKmoq9ucFqCgEc%2FWmnw7u%2BhhJZePAqVWn14OHN0Qi3EET6sVbbJWiA7hZnKQjblWzY%2FHApeXly2RoMTiPUmM6EhryWIPTJYyr5iiG%2BGD%2B6vxYsasLCUXMpNk1z3dfrISN30bHjWyJ7sDs5ACpiwubHNhjHwlQKESgfcIr1XLuvXjGJGcc9dKXd03p4C1le00SlMP67P46Rm%2Fv4lxbpJPMeBv97MJCD8Vv0UK634uAVxWXypmhe6iQ4LvMnbhlyZSCm1oawTUDf1CBEgw2j6q%2BAj%2BVB0%2BZKRyKKuv%2B80SajeqgsLo%2FEdUgn2Vya9K0JpBgIf0bDXhZqPtFxh%2BNF8UrXe%2FAwhinFwPAyakZVEW0FTwFHd3S70WCSPz49XwPQlM7X7lKVBZmF%2BW%2F6UYfqIL%2BjEWNFP3%2Fn%2BbxLbdCtGnyRniJwW4lO8beyfSn46n%2BMzqsUDAWuXy27NIV%2BjAiNwwALl7TpZ2VvYB46LneozRTGoI3gUp0AnDGdow9sKzzQY6pgFdw3uChdWA%2Bp5%2B8lmPQ%2BI7d6ehdcvBsT7gOTaLiIj%2FCRbrvReN5lcxchVUG1%2BzO7i0aOMQWgD8NX7UWr91liON2k0OYd%2FXtC1VX4%2B4Na7l1XsnghXkI1AIUd9QGlqav3DLbW4Cn%2FKs1fG%2BxmJ1e7CXktHc85NhFf36sELi0wkfhxVBWNAnLv2cZPSknnGRuR8vMIlPe9wd2QCY8bZKf4VAnQCxCb9K&X-Amz-Signature=d23e99cafc377101fcbdfee7dcb29253c959e167a31dd93ea47130d1e959ca4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RUYMEG2U%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031340Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQCSL8RPsk9ku5a03gL8u2kF66LN8nnyNcz1mO0aXfBLJAIgTR0F9Wzj%2BXfUEfU4roHUtC18JVoJJ%2BlR71xUTbCgFzUq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDATi%2FujohBTIsos02ircA%2BClWcemyt7LKw%2FkATDoNMsb8inHzxda74miPvIfSuC0eJkVKdHn5nWli%2FRdqpQ%2Ba5uYg5AUFZGG5h6eMq6dhuLDf1IXZyxmUia3UTDHmpPPBdWomhhPQUrpApvQyZ9t5UJS97c7ZSDNCqdIHtKTuibTJHTW44l5DtcT5gOahwUw%2BAIf300wcSvwvHVQeaf%2BRU46ScpGFK8Bs6BAtgGjV8ZazKnA3yWYA44mVyMQJudhpnByduc0qKstBzkLk4rOP1fVUX2MRaef6gUqTlXqmAf12p890aGP%2FEEQ%2BR9XQBXawI9qm%2FgP0hDAcTfcqoDPyisrvGqjrSUaH1ncIMBPig44Vrs5HGgAr5yey9znxzXe4emDj4yKoV2oF5ToFBq9ywnXt6yb7WI9F0ZlEZOmskd8xNQEeHnSE1pTXrLxU4ufgeIzv94EU0TIcf9oq0NrbzXMlWLX1BLGPEy8kq7wp2oQrFk8AhdsgTYvt%2BX3N2zCeyHe7XFaMzpjvxLqry1j23xhiv2fxHBCa5QRQHRxf8fn79fiE1j7FVza%2BGtqJB%2FEPJ351fa9%2BAdTSTgKbi4bTzQ4JBYnHE%2BN9BSyLmwonIYcY6x%2Ft3Uw8qubB5pWFONetxjfWDzDJJrihmSkMOXBs80GOqUBNqmWv2Dt5XSnyd8gFjNSESIY4mvUJOJ2duX5egsgHpEQWRxdutf3hlZucAg91EMf3UV3qUIbCerAdD51VijTPU5IW9uqTuS08d2WQt9u1lMH9Epdvb81xVPP6AyTEj91Rs47WBJge0KhM%2B%2BjCqmKWxp06qRxleJJNAL%2FacmJmZ3F73mSPka7GPOZFcnwk%2BV71JgJfm9d%2FWpQl5%2B%2BohDe54fLrRbE&X-Amz-Signature=4c327e58d472ed6819b95b1a27e04e65085bfcd30c9c6dc24fcaf63a9b514a87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPTVLA4T%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQD3UpOATNugzumAeYwr97b4If9wYV248Ab8Z2qFN6xeXAIgG7ptQWOTXbqnmv2DtmkPz%2BbxrOeWZrHEKIDhhuqR5wsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDFLwjmQJQpyqDZxuJSrcA02Jt6aUr9nreIbx10OgqSnsd44TikarqmOrT3vcqd8ayrAKTTsL2DcjxHXPxajlNu6vWmXSx%2FMID%2BfF9wmtzw1oTMBO%2BGeuWVZ0jgNOfr4D2moodceAWVdNbIZLCKsdn%2Bw0OiJw%2BjnsjLHDTbCm1dECsafHV3GEO05%2Fv17aCxmavBrqfVqE%2FME3rCwR6IqeHxnI9dBEogmXWDQWQHluT1Egv9rlKN0lzZ8qjfaOnT62lth7EeI4s%2F%2FuN2AEHJMGfmKT2G53OB8GR8bsIe%2F3u3sokRvOOa98a6tiG6haiMydvE1GmSA2rP4bxBH%2F52e4n0%2FTf2PyBdNp1JsS8LnUwC6TVCje6F9kQwsBFaij6tUCfuxiOaJlP6DmswwzgdoCujZrHgl9z3NTLhsbZn41zISvblQ8usCrBE9i1Y2kCn6o1Xx1SR5PIMO6oA0LiZmbCBRc1WhWQgsPyqokskwX31WRdhP4IdqLioL2KhyyuJ8q1PIFqKjPzCJnRvO4S1XchM%2Bll6VOcz2GQJHUOydJNM2As4%2FNUdz3UR3IizAz9aHq09KfR4XDOEvcujfS9NgJcKga0ea8Hqe4fR0vku0rtBoR%2FHr%2BVMlwVfG7aMZ%2BOJCy43PxtPH4aBZF5oswMIvCs80GOqUBot56h14uiSHEaBUPq3a%2F0RC8bE9DeoNsbk4ZOct2owDuP%2BY4agTWodpuWeUMlV7l6SzUoT4%2BKpjGxP9jOGapVjwHt2UfER5P77F8aM6H390lQWuU0IY3bEjSBVr45edpQGiRg2gvg0SuPjrYMMr1q0l08xLILaofDYWiMbkbdHCwFdroOtePDo%2Bafmub7zxZyorMmYdp7%2Bs9482g5mdIJT48%2Btke&X-Amz-Signature=d51c2e434624d1c08be6cb165c3edaf906659a978e9773a7d2696bc79788eb3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPTVLA4T%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQD3UpOATNugzumAeYwr97b4If9wYV248Ab8Z2qFN6xeXAIgG7ptQWOTXbqnmv2DtmkPz%2BbxrOeWZrHEKIDhhuqR5wsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDFLwjmQJQpyqDZxuJSrcA02Jt6aUr9nreIbx10OgqSnsd44TikarqmOrT3vcqd8ayrAKTTsL2DcjxHXPxajlNu6vWmXSx%2FMID%2BfF9wmtzw1oTMBO%2BGeuWVZ0jgNOfr4D2moodceAWVdNbIZLCKsdn%2Bw0OiJw%2BjnsjLHDTbCm1dECsafHV3GEO05%2Fv17aCxmavBrqfVqE%2FME3rCwR6IqeHxnI9dBEogmXWDQWQHluT1Egv9rlKN0lzZ8qjfaOnT62lth7EeI4s%2F%2FuN2AEHJMGfmKT2G53OB8GR8bsIe%2F3u3sokRvOOa98a6tiG6haiMydvE1GmSA2rP4bxBH%2F52e4n0%2FTf2PyBdNp1JsS8LnUwC6TVCje6F9kQwsBFaij6tUCfuxiOaJlP6DmswwzgdoCujZrHgl9z3NTLhsbZn41zISvblQ8usCrBE9i1Y2kCn6o1Xx1SR5PIMO6oA0LiZmbCBRc1WhWQgsPyqokskwX31WRdhP4IdqLioL2KhyyuJ8q1PIFqKjPzCJnRvO4S1XchM%2Bll6VOcz2GQJHUOydJNM2As4%2FNUdz3UR3IizAz9aHq09KfR4XDOEvcujfS9NgJcKga0ea8Hqe4fR0vku0rtBoR%2FHr%2BVMlwVfG7aMZ%2BOJCy43PxtPH4aBZF5oswMIvCs80GOqUBot56h14uiSHEaBUPq3a%2F0RC8bE9DeoNsbk4ZOct2owDuP%2BY4agTWodpuWeUMlV7l6SzUoT4%2BKpjGxP9jOGapVjwHt2UfER5P77F8aM6H390lQWuU0IY3bEjSBVr45edpQGiRg2gvg0SuPjrYMMr1q0l08xLILaofDYWiMbkbdHCwFdroOtePDo%2Bafmub7zxZyorMmYdp7%2Bs9482g5mdIJT48%2Btke&X-Amz-Signature=06eeebf5c77b3ce56af6f359fbc2b48fcd3a44dfc9576ed24593121281e0acbb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V6ZREQ5C%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031347Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQDnureHFEoO8bmLj4r7PqvoHswNEkknWIzpUjx2zq2%2B9QIhALPv6AyvjfhVkd%2FxMEd3r3qbbYqClzoN5l4bjcxktpAAKv8DCAwQABoMNjM3NDIzMTgzODA1IgzM9eE2Vn0KLP3EIj8q3AMdIfD4v4iZYrj2F6jQjpznsA2PQ%2Bm3ohHgMIjSpKMroKe6oIMpgGfNpYfvLpiEx5Bb6ctQ2XaWbQ5N5KjSddCwkwO5ioF%2BKrXDE3FcK%2BY71uQlFFmwuJc9YkqOLb6EiGaAxqAcD3fpBPDPgePRHH7dSjwT%2FHGBJlxsKVk7fDaENQI7W7hzEevC5ij4947CuMDOeUk2zVgNwmOVL%2FrSXlO%2BSPwZuv8M31tgHpBFYSMpo9rV%2BLZxg2v4oqYNjoh6Ax2bkutIi4cZvvb4dVO9fFGGeEVfQur9R2F6rTMEWq3PRmS%2BsEQcC4ACv5taA0RNRGkTjqDdjkEsKgwfblTYEHJj45nnm1gzodS2uoD4tgg2fEI2Y3RWQd29bI78oV%2FiPuvhwpNtX9OMNyLhlnxBQHKWqUJnYKJzYTLwq2rWkL54mhVRh0Xl%2FV1%2BsN28EHsOWIS2DgxOPJoLG61YiwXkJ8fp3h3tqgKy6mnflyVefxwcUR594boZznXo2KHHyAAq5t5Wb0CNUuLOv6JfpYx2LN3LC6P17GhaNXv8MAO6BSYlWUtg3e3HlgufGzWYf9exSkxuuBLC3OazQnkfuMvXw%2ByZWgb%2BMla28rUIcvBK4mcPCtsuOfs6awsuOSqW1jCBw7PNBjqkAbshJ60RjSWMt1j2z4eqgEBc8xLJnWrVQeQGUAh8KxZQ87%2FHfqT4eVrcSS3SZ%2FoRDVv5FT%2F8bVCTPlbmbRKQgGLvI9erqXKJTWCld4VK8jHkLbIRpmQEGyewp6Z09N5%2F72eaX5DPaPNZpy3WVkH1pQqlnAH2Ek3gOVrqJC22R%2FabEfy573GISrU7a6pzSr%2BsPoW741T5AI9CAvVo7PdHuniwI%2FU8&X-Amz-Signature=95433bbf4a1757c06ae4b1c00eec611f5251ad167773a641559b66e85847f660&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RCI54UWC%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031350Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQDuEJbCwZ5%2BNbujJNiAu0TzXBN9iCxT61JujF0tSr5ylwIhANUKI4MLNwKQ6DLXErXyr42mitu3aedFK4PZBnC59hIiKv8DCAwQABoMNjM3NDIzMTgzODA1Igw7q3Dg669D%2FhI7tlEq3AOeiD3gcqzRFUx4UFZIPYHEHRH0SDHBWqoXi7dQj98AD7HH1gqVgdYm1pl6oGOq4Gy7c9jPfSv6z9DJjG5M6E65eBl7vQAHCLvMtVBF2mtz%2B8VghiDHsMPRRi4Np8PpdUBFDMC%2BafkGxEWuV7cJIZj0oJ9DVa%2FiDEHXBUx9%2FNSkk3miyX9ofMYuYuepzARtBJS53WlMVKi4ViBQbfxPfJ2RRQhw7g2fYNPh6udx2OmpgGk80dhCBIZ%2BGp12eU8jQD8UtgNNeK9VtqndY8rzaNhDN%2BWO4dSbRtJjvIi2PtfRTE8R11w5C4bRCfdKAGXyOJmtqvpQeoYreBZl1KNGG7BiBrptr%2BUkgEzMXivZ6NYS8cLyvo88amZUg4lgU8HJobOlPzvhuLYV2RnyeuD16FWMpxnHUMnpJA6M%2BPHVHjK5o%2Bk1Omk9JGqg4Un%2FiN3Xm6OXSKkVwOBHOn4qQYfyOvWWk8XVlr3dMgo3yoL8cvxBy1RbZwaXmfTJhkaUXyuhZE8zDfG3EnlUc3%2FI18CrpznUbX7gtEiBGQs%2BCKK1Oh%2FSjN7ICX47Wu0qXQJ9ZX22Oa1gla8yGcf9olo5o4gy9PVN5iWAW7yQn65NicUD9OEhyApwvvH6fPPNqAFrDjCEw7PNBjqkAeTIYm13zaw%2B5TyKFzvdkbCtc%2FrOq%2F%2BS8nk%2Bp6UNx0giLng842ycZ1PyqReh4WDVHuL%2BvJcscklJa7Z4z3dekNOM3fqYMMweZMZrXx330%2BEb2KpX%2BsLEz2fk5hrX6RXxvxI4QZnoElj%2FwN%2FLpz75A6jK01s9DMSCl5fPliEXh%2FP2eYvHSLcoZkAxnAgOstdE%2FAAVk0tQV7GtvmTjqj9OgGU6LzWK&X-Amz-Signature=af5fd828f19b221821932d6fe007d070ac055b71448fd0cda38d27f9c449ab9f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VB7HKJAY%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031350Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCICtuopDtxNwT2SPVmgdPV0KcP2EBUZg2d4SR5V1Z%2FLqQAiEAs1HsM7t9T4apCcpQmclGM7n%2BtRYYVX3IzZsFXAPqMGYq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDL6ZP9JZnrIJKFeSPyrcA7YEIZBLH1H%2BdpjzyQS0nMolq65wDhhmLLFX4BzCcduAr2igLzVcb8RSWInVA2f0%2BpnmySVdlRVyXVoR%2FeDQ3I%2BPiYX1XNKzsQ2XIXv60OkrQ27PELRxK19uov2bnwltDt1GckWOHyRl%2Ff9EzAq3BD1l5a0bkCt9O%2FGKy%2Bdm14Q91e3743jcAkIvcaej4Lnn2qBpD5A06WZ8NwU1bEOutytXXQSatWywZbWw8uu6w7w46JvFKyJlfz2Xk%2FbDeRe3BJ4Se0MwGmuULWVDyWaH9hJrEt2fBAfPtmPQ5tqDYUlk7ZVWOIkJLJIX7vKuNsPTfUBSMEBFSLLAz%2B3p8Xq273Oa6%2Fq2ewJAw%2BL8EQAdlTb6LAvCwJsu%2F%2BvWNK%2BzI7vJjTxvvSVmeS6eJR5iumu4i204ZYM%2F6lbeF1TuHXePcf5y%2FdG%2F18VvT54eSS%2Ba3P2I39ljWK%2Fyq9fR%2FMKaDh9w7aBTqQaFUl7PaMpSnXF%2BHfhkrDB0c1jiYkLnkM0oeCCzKgfIM9jIDtQyKt2a473b0Wg7%2BSPEi3J%2F571%2B8JSCv9%2BNHPo62UAnpGw8nTDzVKpYX%2Be5DlO%2FF7jxiR0RSW6DJ0ZXktVGxW6TJS0O3HwiMtrQ9i2wBOy%2FCSaXEVE8MIHCs80GOqUBDuekwN1PfC2SF4stJaaHm20YYcmUp%2Fje4ye9tj3OFqn%2FEYF3V7IWrJ0U8ErkIaJSjp01EJFpJzidepedgGgRsIbs2mwjmxv2SGLBUt2bbjvLTFaVOkvr7JtpFW52%2F20vfn%2FM3nQ4dKpiZKMuRugkEPDnMHwl4uRg384igGu68DBNznYLeBaDNN3baHqsjMhx0BXOUaRpwG5XdhzPkQoUE%2B5pQS5O&X-Amz-Signature=ae9831a35d5669db648610dddf95a307703d23a35c82aae9f2447af4567f199a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q7P5QXZA%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031350Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIFtQ932QTZ%2B5%2FT%2BBeXfyyGcTsn1bBMCAa5N9yWEii8VTAiEAgWfaz3hkWmiE%2BFWxHeYeIk5fQyqqty%2BARAqqHgOpGwQq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDJXTDly%2B73Ttzt92FircAzK3URSikuDXFYfhzFpG4xxyMZlPAlWlnhp5mcXctl2B2dybdLaNhsJ%2BHnFRo0doh%2Bq6mRwNBLfn%2BbCnlS4NW8vlwH7zfn0ZJ8RQOMT6nCwzL3Uc6RRBJMWvIF%2BypMxDSAN42PoDe4XpWAtTRnk4y2rnYHGxJCe8Gu7CaSrjRnDeE9ueuvzW7rhVa0RioLvTdUpJnz4fCn4ZCToYKytfHU%2FcofHcCX20qlD%2BspTotSTJNuW9%2FVWaW46R8nm0LtuRgfYNw6tPm4yg6VDqtYWGYPfEMN6fpH7BT8ZfQfKO%2FlmRoC7EdEjv9Ql8YinPdXs9gxhqmwnBrUcCYQFCSWohCkNKLjQhi94AwPAiW70HZX5ZZx75lH1GNGTrJja7szPwzUQs0Lb23ZITdJk2OhEiwuP87FmQRzjf882IW04GKrZVL2%2BAhvd9UC4LkaY%2BqYJtEka8GFZwWsDmjDlI1Iqvf0PzcfbpsQdscmCDE0UmdiQLGTYnoD%2BB3s3LSY5XQnTh9kSpMUSLMB7Em7rs4LNkXmFpM%2FxhL8eoULMd3fjU8qTGiP8XU679qfhJcksU5%2BA23Tfjrth8wZAz3X0iMz%2FCg%2Fy%2FxVNsNcJ9CZYkKaU4H9esUrEzWyYo7lDNt3DmMPjCs80GOqUBKvQ1IoUtONxBLa8hRJL77MQdlka8xuyQX6x2sjKpMi6V9Si%2BCSUfmLlJJV4Lsxg5yvshk4pp4QI4l%2FLBGneK6bSBSPoepPbDAVrTsMu4MiRaeCfcy%2FQfCTpEiKe91T9rydWWZpaZc7lDdmzeQxWD7oHM07edr27Nan4spznKzMY8RQDABtVCQaOSYGgNNypG%2F1iG1J1oqarWL6mly2U5SXUaUz2v&X-Amz-Signature=e9b513f366c1c9ae729f367e5585e24d4492fbc0c8be93ebb9d4493a969a5659&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVJULDYI%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031351Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJGMEQCIBD5VS7PwXch%2FqE6ppFRoYW3ikkXWmVUQs5GgosJcPSxAiApJfs%2FAc2SYJWH8xz2LafYkcMHkMQChLRGhPMIi1sV5Sr%2FAwgMEAAaDDYzNzQyMzE4MzgwNSIMWIMBUo3Q%2FAp89MPoKtwD4V4j%2FOlDoAvsOT6bto5ypZKDEn4dUwFM67ns07%2BwAtkNgs5iEjbZEzUSbjPbZ62kA%2BMz7JlaGmCY246WJCGe3SbvGf%2BD7YCxC29Sguuz%2BV7jUC0cd4I6PX8TDwSQjOSEjvl%2FEa%2BAi7Z%2Fo0UR8DqNcAQEpDmKnm%2BNsQoHL%2BYHkXEulZsUXyn5qrXcIfCaGRKPgUSz3jpYyjRjZlgy5mALsaCeJb0PKvQWEi6Pfi0tYTCVwMLfSoNXslQw5%2F6ltpsbSEABigMF72Z6LXBDai5hucqw3GXQB0Nv29NsqLSPuzrisCNHgkaa%2FqQFTZrDSwAZHQhMiyEmMD%2FxBSP6R0okQ%2BS6%2BDn0WT%2FEToSMlEipmHIadDkMZal8yvTWaCKMoSiv%2B8R00blMU10Lj4e3wVdtnzkP6qu5qN2RC7QluTLwfpAvIt2XnVL0iNDdBOY%2BR8Y%2FvY%2BHF2TwbZs8WgLCN0LL8Oc6ixGCTmOWver5gG6gN8iKn6SlnPmUs%2F98g20me66HVjTVmS48o5bzvLRnqyq4PihtZLoZxcedhqfLCtEByX5Cj5QjZ%2FPVVDNObXQbqqfyOVGeP%2FnO7ZsBgxp%2BBWfWbpfahWx2%2FKX54L%2FJKoSOTFL0%2Ff6uQMMSklsIZNww4cGzzQY6pgHlP%2BGxqx3QerB70BC9MO8G82wnUadYdToZlHW4W9FqF%2Fx%2FyyZz8rbkNYK%2Bswotx00Myx2x9fvZddoZtDpy%2Fq%2FqJajmqEBKgG5gZngpvtFNSlZbEar3y%2B6ewdSMCMEQZFw6RBZj6qeHGeh2FV5nFpZmZXjvlb5NtYi4ioyGGkZFxUAeoeX3sCwTuvPR2zCKQl9PbP7rKE2K5zg1rI2mba9te6qFc3ak&X-Amz-Signature=667cf9933fedc451cdbe695e8cbb99309f55ed497a38bc4ecef6e27c98ef42e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPTVLA4T%2F20260308%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260308T031333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJHMEUCIQD3UpOATNugzumAeYwr97b4If9wYV248Ab8Z2qFN6xeXAIgG7ptQWOTXbqnmv2DtmkPz%2BbxrOeWZrHEKIDhhuqR5wsq%2FwMIDBAAGgw2Mzc0MjMxODM4MDUiDFLwjmQJQpyqDZxuJSrcA02Jt6aUr9nreIbx10OgqSnsd44TikarqmOrT3vcqd8ayrAKTTsL2DcjxHXPxajlNu6vWmXSx%2FMID%2BfF9wmtzw1oTMBO%2BGeuWVZ0jgNOfr4D2moodceAWVdNbIZLCKsdn%2Bw0OiJw%2BjnsjLHDTbCm1dECsafHV3GEO05%2Fv17aCxmavBrqfVqE%2FME3rCwR6IqeHxnI9dBEogmXWDQWQHluT1Egv9rlKN0lzZ8qjfaOnT62lth7EeI4s%2F%2FuN2AEHJMGfmKT2G53OB8GR8bsIe%2F3u3sokRvOOa98a6tiG6haiMydvE1GmSA2rP4bxBH%2F52e4n0%2FTf2PyBdNp1JsS8LnUwC6TVCje6F9kQwsBFaij6tUCfuxiOaJlP6DmswwzgdoCujZrHgl9z3NTLhsbZn41zISvblQ8usCrBE9i1Y2kCn6o1Xx1SR5PIMO6oA0LiZmbCBRc1WhWQgsPyqokskwX31WRdhP4IdqLioL2KhyyuJ8q1PIFqKjPzCJnRvO4S1XchM%2Bll6VOcz2GQJHUOydJNM2As4%2FNUdz3UR3IizAz9aHq09KfR4XDOEvcujfS9NgJcKga0ea8Hqe4fR0vku0rtBoR%2FHr%2BVMlwVfG7aMZ%2BOJCy43PxtPH4aBZF5oswMIvCs80GOqUBot56h14uiSHEaBUPq3a%2F0RC8bE9DeoNsbk4ZOct2owDuP%2BY4agTWodpuWeUMlV7l6SzUoT4%2BKpjGxP9jOGapVjwHt2UfER5P77F8aM6H390lQWuU0IY3bEjSBVr45edpQGiRg2gvg0SuPjrYMMr1q0l08xLILaofDYWiMbkbdHCwFdroOtePDo%2Bafmub7zxZyorMmYdp7%2Bs9482g5mdIJT48%2Btke&X-Amz-Signature=6496bde2e07e8cf0e3b79e7e6a98f217d225123824c868ed8fc624273beda467&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
