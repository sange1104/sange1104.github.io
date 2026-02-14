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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RN3OFG7%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025249Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIGWGLC7qEiRR6Abv3jooOPi0iQKSIhO7WSRz9wDXRkrJAiEAiGzHeClttL64GrYh%2FBbLtLFkiAJFTZSdy1lut%2Bx9WOgqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDU3YjbkuHsWPE8r%2FSrcAytHZyAs%2Bsl8bnCuXaMYUR5mEc6%2BnytsF18VYEeuKgw3lobSKXE8%2Bzh4aLqZSAAl%2FegEqv3wiZE5qn436jx3CxJmLe8LjXfJpAu%2Bsh4vrNPHN6UkLQ23qK2FXxkUM2grefnidW2C3LJTnASlm0hfZORH6jb9R7pWHMRXjDNCgZEE0VIXTk7QeRHSZpaFmD0SBtMmURqAZNnR3JO2vaFPaTAobKCR3Z1rqQX9AugsTmrC96VvHNhEQjsd%2FHt2WtWkKHyohTjaNOzu7ud%2BrwY9VNceoOj0b3NYZ6KqBazGKOFbmAL%2BkmRgn3IzsX47%2BfucEcjc2zTIK8hrTMVrhfQYq3zCSUoupewn59DD5DT5BumgxdAP6MRJIjZ%2Be3HGxsRyTQ%2BQxyW7xfUC1pTxRCeELDqTAHgKAIDB3tzKDOOQxw6OmRD%2BIXKHtnKzerECf4JnwkM6kOUu1u3Syr8NmxVQt3GsMH6SvniUZctRNp8j5n7km5HNet1ut0GzOTrMc6IEU6%2Fz2pZr4BfzGA9%2FCwNSwMf4Wr8k5MzepSfp%2BTJoBj4kEbzwKcjpAaReCujQrkadt01ELN5fetZR8jJz%2FuZYenOVcx3fdUiYvRXywt%2FFZeYcBSFbsClPkVhnK2V9MKTBv8wGOqUB%2B8Np9l8xrAzgpl5sPIcrtGElDgaaYrLz8UD%2Bi2kIgK9taDn5ADhNIU8eOhFewjTXAor%2BfbuJ6Idkfd3uay1888cL4z8dOiOCHe2X6X9BBzrGnIAlSIv9mjEK4ZKMPa2yQZlhB3%2F0InqdmSVelDM50bFm5%2BOCD31iIxucSsjlYL7VzH53d7kS9HfSqi%2BU4rE5qQ2RBpwiq611mfH4AOVFuO5%2FoC12&X-Amz-Signature=98bb9cd8465d7322259f52c3eb1acf57b44482f041e15fe11e55ce21bbcc6a01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666EL3I4EI%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025249Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJIMEYCIQD4WI1lUPZj3%2B0rQTl7ZSntEChHpHr4xtSxJ%2FNb04%2FMBwIhAI5Z2lqfLTDXlwwqXeN9t1bER6LBFBWvFQ4My%2BCeh%2BC8KogECPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzyOnZuwajhj0OXaKUq3AP9WTcU0%2FNvyk5bh%2F6OfwhwwuIWiABS44TFWuCByYHDkWngEd1od7JjiX7bcV2SpSs%2Bm5MFowa41wdusMjLzdQGenWMqj8W2Pvg%2BIplg0sUlnQwIHo0gEa9MsDu4FX20WInweDxkBloUufrCHZk%2BomqhQxRlRT8x0RL%2F4gOJLwmKnsmA5d55hnDmHYL04webEgUKxTVrOmsdKaYMDRp1c0SCG%2BQUqoMmXiYloabHkV%2Fevz3C%2BnxUpSOyAzC6%2F10J7TvxhnWY9Ia4P8vJS3fLs0SiQ3FVVkSBInml9iKbm7c%2Bgr3Rv%2BeFszncTd5xCdImOBSDpNS0f%2F5u5cvIqqCIYQU2ynnm%2Fmy3XfEM9SGGFDiqeZ9GqiRpNRqOYMtthB44kVr2WhETiE6jB3r8bW3VUArxsQkYnCLO7DURSHG%2FU4u%2FeEO5l%2FA5XAdKTH5gY%2Bxrgrk%2FQO35GcF%2Bx8WQJK6Q0PL1Js4m5svAOkvH9%2BVeyue0SjpFO0MniobRVgqEfwQvp%2FqhvMVfJzPQz7y4whbNQAjDlkDd5sA%2FDOgpynLqgcl8Hytt%2BH8EJxRX3l34fHF0dOmI4%2Fl%2BTf9tNYOf8Wc5xgYjy0gal2DDBzExxL7C7trFJnQpwb8rhLkm27MqzDxwL%2FMBjqkATl76A%2FXKBK7ZMNrSiNTEIbcE9oXbcATyQbqBxdlqB32UzFKMLDkxK2WcVxiSoGRbzU2pPKieFHd29jy3HcmAHq5FebY6gXchvES7G098iLAXQdIVKYXX8eSGcPAcUlWUEqRVadGoAxxdHzxfb20FuWZQ6%2B0vovKC95wJzuFQQZIx3luD0DUfe3AmF5%2F1nwHOlyso3hMkcT%2FngBiKodZaym95a9l&X-Amz-Signature=7413b53481b16c366414cd951957ef9dee964e5c57be1201f553e68f75e5dd4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKSGVH7K%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIC5PPc3lQf3HhhI1pCM1bBh0d9bwL2%2FbuIIgW7jaxd8yAiEA8InDLhDsXrouK1FibrORaf9qed3N8gQancm3TbrqWa8qiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGtuj65Wl4p339oiSCrcA%2F2ZzoI5rdQBnag%2BO%2BKqVrRTAvYQSBAZcA%2FHgyLUqWBlcbWEuKl1fdt4E1PBQJD5vJsdDo04c2fSxvdBl1A43dUj48VNi5If5FcIBmMQJfwf6s8eGB%2FAAT6gFVhPWHe%2B201jJRqf2wSMF4VQx%2BXCmJIDpT3f82V56%2FoJC3fSzsJee7JaUFrZlM3oNXmnJyiZhHDko3vUls3HcS1M47%2BIQQqMmNnrP0SsfRVlO6uV7CblTnnCl2NA4WxR79h5NoEtSP10IDHmCONJSjClJQF0F8w169zpbaDQEZagXP9UUS5zVIHuQeSGxB2uERCafEbf%2Boi9p07oh0jZW7liel%2FXL7EtQYLsclKSmkfXHN4XIDyPDFDZxDU5b3Keh22YsaleGBpbReB5oSeDProzsyCCPttYKI5aCDOZBL%2BPTjMfMhpED2ylzPLxKSEGPcgRqwfrkrIM42ZxJRhJBXyJjhWO%2FbMU3sWV2twkck2%2Bw5MN1I%2FU2UGQi736X3jVKVXK%2Fwotnyhiv2TQXaLZqouH1cZuVmUS1%2BZOZoerFO3aoiANZxHRRXYxgCZnJIhYmI6icClOnBOuTF2SwarBKqfwsyrmiFYyJTBmP4AP%2BCTGc3fmWivHSTZFIkXw%2F%2B2PVE4VMKLAv8wGOqUBpqbHoxXIhE9geZ7cV4CqW0hBPuD9BvETx8j1HHv6UBA3163zIK4cfI1xa3V68C6yBzPl4MQJ1UA5qzSxMQUA4xekVt7fX5LIHopOndXBr%2B1EYXuDWbNsLZFjl2NK4jFaMPLrbDvDbccTXw0HRlxRSfJTG0XT8mLdwFRNoEgDaEdwcBY5GhBtebyOTzZPNQwqXkMAFoc6%2BZYP81AwXL3Ub3tdzxpy&X-Amz-Signature=f4d57a324fe436783e734e74e126aa11dfde5ba75f267d257fcf399e1a4f994b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKSGVH7K%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIC5PPc3lQf3HhhI1pCM1bBh0d9bwL2%2FbuIIgW7jaxd8yAiEA8InDLhDsXrouK1FibrORaf9qed3N8gQancm3TbrqWa8qiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGtuj65Wl4p339oiSCrcA%2F2ZzoI5rdQBnag%2BO%2BKqVrRTAvYQSBAZcA%2FHgyLUqWBlcbWEuKl1fdt4E1PBQJD5vJsdDo04c2fSxvdBl1A43dUj48VNi5If5FcIBmMQJfwf6s8eGB%2FAAT6gFVhPWHe%2B201jJRqf2wSMF4VQx%2BXCmJIDpT3f82V56%2FoJC3fSzsJee7JaUFrZlM3oNXmnJyiZhHDko3vUls3HcS1M47%2BIQQqMmNnrP0SsfRVlO6uV7CblTnnCl2NA4WxR79h5NoEtSP10IDHmCONJSjClJQF0F8w169zpbaDQEZagXP9UUS5zVIHuQeSGxB2uERCafEbf%2Boi9p07oh0jZW7liel%2FXL7EtQYLsclKSmkfXHN4XIDyPDFDZxDU5b3Keh22YsaleGBpbReB5oSeDProzsyCCPttYKI5aCDOZBL%2BPTjMfMhpED2ylzPLxKSEGPcgRqwfrkrIM42ZxJRhJBXyJjhWO%2FbMU3sWV2twkck2%2Bw5MN1I%2FU2UGQi736X3jVKVXK%2Fwotnyhiv2TQXaLZqouH1cZuVmUS1%2BZOZoerFO3aoiANZxHRRXYxgCZnJIhYmI6icClOnBOuTF2SwarBKqfwsyrmiFYyJTBmP4AP%2BCTGc3fmWivHSTZFIkXw%2F%2B2PVE4VMKLAv8wGOqUBpqbHoxXIhE9geZ7cV4CqW0hBPuD9BvETx8j1HHv6UBA3163zIK4cfI1xa3V68C6yBzPl4MQJ1UA5qzSxMQUA4xekVt7fX5LIHopOndXBr%2B1EYXuDWbNsLZFjl2NK4jFaMPLrbDvDbccTXw0HRlxRSfJTG0XT8mLdwFRNoEgDaEdwcBY5GhBtebyOTzZPNQwqXkMAFoc6%2BZYP81AwXL3Ub3tdzxpy&X-Amz-Signature=ba1c3dd19a1bc6ce30f7a47925a9f15bfcade19a735664504f928e8f496c919b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RI5FEYNY%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025255Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQD4toG1AybUaCB7cYkIk1TCrguVP2XQWu6a2%2Bp%2B415WcwIgWWGpCFAHoTJVL2wiVDJCnbTbs7xQMfaVjJdaRmwP4pMqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEwuDE5HgN2e97cIlyrcA%2BFVspnl14imzS7Gi463f21%2Fk%2FuoJxhluOA0BIcnJ%2BH4NQqX4lTYA%2F6DFMD8lPw%2BpvTuO%2BXGfKa34WcMkK%2FEBjWoopq%2BXdL3Y%2F%2Bs%2F3bSZaqabIsABf1WWht0SIYANTqH8l38fOlEE0%2FFxD8DGk1XrQ1aKCyQbOnDUjjqw6YUrZ75hW68V8TUD6gEO5iLgDqJYDlNqFqp47W3HoYiH8wtzXMA5jHRRybuAwjxP%2B8q1tk4cTu47iRob5hwXwsIKK%2BWRlSCMrApchoCr6YCYFT1eEO3fWWUsfH%2BvsqeehM9NDDNgEEWYcHtV9nkHBxlzSesNNvBnYOeboi%2BnbQSC8TiK1GNVOFJliERV0QDhTPZWT%2FBbSWqMhYWgb1gHfzSP2oA1K7LRreVlOkZNMQ2rd7cxDL9deAJmCw6ueRBzQHMChjm%2Fm9tpUIHJFApXpfo8EXKRWiyInLCBPK85I5q%2FjIG%2FxX9TDJDUSQdH7EwyKOkcb0afd0vO3JqantNeWumJ5JaRKbWgARXjQssGDtOHSGdpPknAOrCDGhaM76eNfjWoB%2B4zt%2FsE23gLvvWviFCh%2FsttRVrX3IPCsNvvRqB7CSZPV3WlLECvVcW27g4g4korgjfUBnN58FGOGUqDO29MI%2FAv8wGOqUBG5Ot5ZjBQPL1Izf45jiUs%2F4bPKAHHxiNjIaRQtciA2BfQZt1oq6U8wcF%2BIpjPLTN%2F0pjPyPPvzqXpvsyCS%2B0PdVFcwdvrEz07ARVwFqpWbHPJKxyCUQy03CB6BtgQd7w6xpUEf9Lp%2BzJpddwHlA1quujLX1qsuirIwGGIRBbL3syEm8B3llDRnxoDJ9LD9xlRz5yhy6Eclfna36paK29s8fw8Wnb&X-Amz-Signature=fdc06a915f41c058f84f9721bf9f2aba1f959d1a211ea7bab939fafdcd0093d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZK476UW%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIBQf%2BTabliPVGON5NVpS0rrbki%2FTYmLKt%2FrFZ9egubM%2BAiEAskai0xvl3xgIAQfI1ZVtMZYWbivI6UrNCiIeoNMq2PoqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCCxrdL8wRgUBt4C5ircAySDjhaDwuunirEHRZhpl2n87A2g3jmDPW%2F3R%2FwNe3YKJad4K8doY%2F%2BQfj9AOPDzq1rpxxyH%2FPONHcxMbtUMiCJNC2dvpqV6iQwDkjHUdLPOjjTyuSHk6Bdm0A17TB1JRbRGVrg75iVDIwsbTv%2FL5B%2B8QOWxrzhZlnZSAkzSJgljHlGrqqyv2oFJC6E8NJcggNzbfnYcyijp1HxsQxDRYOu3xEcAeeybcwm9EgLxRCyhnoQk3CX8JVtIiKAdOt64%2FGuD2BTU%2FgR4c2L%2BkM2jgO2G3Tlz6CX52rd5THD3OdfEvXwRZREdIvrqzsM25fOXWXh6%2FS8o28aGeC8UTjzmABsfSB7RF67uL4HhV48%2B0f88qtsRqnMBbBmW3EayHeNNHPqzmU%2Bxt9VwzS2JYxqXW6JSMNREaBRn0SLlMNMGNQIaIA54sT6eNUQIOpp0hZYUZcvPTgmIADIqMVRvKraoml3imuyt9UqZPXQsMJ7ki1IoisS1jNNESP5jxaT2ZmYj1YUMt9Ns%2BzlE%2B9taS6E8dBLri58IYZ%2Fetz8Q88hyupDpxj8cfAo4LYK%2FAslFVQhnbg2jf6AlRWHS4%2FWcFkjik01FZCeQSByrZJf5rE1%2FtkWaESONP252PPFh5MQNMJTBv8wGOqUBepqn2pUeXGCDUWMoAq65rOosrnluEQH9ihVa6JvXwvSd4VJqNxhm2RYhNPU1VWjgmrjyD1fljoVxHlV0UPDmdAc0l%2B4EpkSeVWwajYfS%2FHai4rvv7LWRGDRWyc3BSEbBhv0SO8rIx8Fkb%2FNRN4QBvTLtUG%2Fj2fVmksyQX9Tt1chswft2SI7klSvcJXIb05Aid5oj%2B3AhwndtdXaHk0Fb1r1ad6hs&X-Amz-Signature=c446e98cf0a85d1d23f9d37e2569726ec1870feaa094c2c08c8d9baf1f06bdd3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YBC7BFNB%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025300Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQCvaYIH3fZLGpuGLiSIJyYgouHcquVpYJ13haI2DzFshAIgdy3QWloDceNqNy2F%2Bukt6XtMQL91EJvfr2wl22GRj0IqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFefQ4XH4fTpGCyReyrcA03uJgXm2k%2Fsk7SsPvDaa287KuEGmBRocmJ9Uo9DIxnRpnTo7ynCKQ9eYyoVU30Vy0JZECAXJ7jf8HpSTaaylry4Onucv%2FcfQvWrh3zZaWBr2ugigT1LzaNH9rscDOdeX5A%2FhKciHL3GLTl8wx72%2BImnDahWiGNBskoPUPpNkxABuQ61%2Bw257lPjMMxekPRzVeyGVL%2FRD7Y8n1j5sEn%2BUF97jrQ9SQzPyVCiuTDNeyOb2u%2BeIK20gjhcjeX9ZqzJYCE3UWZzbn2zRVV%2B8d0AcZW2nfRUlSIwkjCzYyqy1g7VvbNs%2FluLiQLv588SDj6lft7lOunrmqaAacijUfCmP5SUUJUg40a5jOS5nXkj4F2O8fhNgIr%2FNyrcpETB4M6u%2BinTNj6rTsbBzYmocvazJc%2FpJhCOSXVUh9EkE9MomFtb9Rd0dskPwuZkR2OXUj5w1iCRe0pv%2F3u5o3wFtB2WHp4TuFzh5JgENRSDCcImSK%2FV2ijiOuW4nEK9E2iTGtoXZ8dZ5qSEE7xkCleanILX7COeEKT5n8CMLKmV1a%2FGbCaVvk7h7djEL%2Fk%2FmuNpiSAnEBurS2KQ8sx%2FgTmhl8qh0akpOneiTc93MptLk36PwizPoSZyzn4xOQYyi4YBMOLAv8wGOqUBRQTa0p4c8HG%2FZk8gAUd1bwNj6pShU3c21XUNoJAuTOmMBXwJ92w3QJI0MfP0ehwYGsIINvKtnkUDEHBk27ybbKKsDCcvmE3bqApnxIZIW6z8NbPmFtAo3dF3o2Z9UoVTDstlrboGiEtK%2FA5KYlbObyIkBNBzqJ4DukPQynIq%2BeQhGzrhrBFN3H%2FCpKYZn8ZF5rhNR2GfrTcFP51BRQ2xCvUb7lLh&X-Amz-Signature=26b0bef5d57a3815a24c5ad3a6471067491fad926732ba6956c52436e4a5eef0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665H4UHS6Y%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025301Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIAaiIE2pxuCpMfQK9VaGcNF1tmrlmuQd%2FkWyyaBjtD90AiBAH5MIvpJzHZpEjfNkzSJ1nd6oXA1EjLYsyMcOKjTz8CqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYMcakhozxIrGYnWMKtwDkq8PNydRyN6%2BLKrgEnTQrQdP7CG8olnTpmwB0lVZXpSITxKXCKpvGf3GXMfzWV%2Bn3nVtjKdzB1W2O6RkmQiEEwejBra0Mfikk%2Bba8c5fcF8KUkrNq%2FPcLOQieWaucR%2FE5L1tOckJInDtONJY4lWrq3cvKYdTO%2BCrsSFfsdeUOzJfudIvCJMBvamCnLzP0Lpfzgrch%2BkzBXfyL5Eo1R27qA9f8Yan5IsdeMKT8e7%2BXQOGhHdjaoEhAV%2B3tv6reSQP%2BfCxmjdQJlZ1ynt9sf7HQEXnx0wB5IydT5tYrcIV9El7tL0%2BG3iyeahaMo1Y%2BUc149Fafn0VNxr8yndEdlaAA%2BMzN4eXjlgQrd0s5eQJRlhqsQU%2F8%2BGhiR%2FnR46b4BpKY44GV7UwH9R3iQ9dDmNm%2BwzTgPNNfUr3EUvec3%2BaZ0oq2%2FczojE%2B7BW3fPcSrEwaYiDz%2BbH6GUlWuVWEHsPnX%2FRXdLp28j8F5xU7vgjKERUNi6x7w41PxTowVPaDLokFxHs%2FlwJsF3M4z6TqBoQLSWbMRJqaDNU36R%2B9mE%2Bqh%2B%2By3T1Ys0jcub9RIlZBYZg6UzreLaxI7MmXiXIxQVOwRa3GuvzPFM6EpavC0VvXc%2BnJ0IW1NVmf5Ipj51kwoMC%2FzAY6pgGCdtwyD57NQz%2BPJI1TUXzB4bDLMnEbsQbciRTn8hJpl1dlnJdghpGYybyv6ZIThQooz8vi0tWnge0LM8tNj970j4GaO9j6VSkzb%2Fryu4sfEYtjTEBdz%2FL1crxZYlu11%2FLgHau0GQD%2BBfXdXGNdCG2h2%2Fr4Kyh6K3NrDpsJvjpE0WN8C60pIpre7MQA6Uw%2FxfU2mgCdjbITRRHCmpPc%2BNrPg7BG3BpM&X-Amz-Signature=905f7eec285774c465c1ca282fdd2fa69d27e6bcb2747be127ffb33a77c72cf8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQ7MWXHD%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025301Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQDd%2BYFzjveRLP%2B8OFWOmQXkKgaU%2BTj4xwHKBJIkIbWh8AIgWErBQeWx5kwYJC4M8vo7Vm3l%2BetjXNX%2Fjk1KNUujBzwqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNpMttSrYTCc%2F6FPaCrcA%2BFj%2BivLry1MI2DPa37%2Bt%2FHZ0K1T90QlaCiAjfrtG06pQxQQjhpABkma%2Fdyyk8PkZY8r9YR%2B22CXeTIFuKNzrfIeJbj68ZJFwW7QBV8fwD6H7qD7dIoCVf1gZ%2FRP0Jx1SWf2KdHpgYYJEJY3kNf6B4XGyia%2B%2Fd3MzwMJHZ6zKI4hpY1t8V2lzAZeo7h66UEIm%2FXZPrFjI%2Bm8qk1XTy2lMRcsLM10xSkQ84WXGcufPQcjRvFOlgtcXlpx2QprH2jmA5L6EZV3bLivNyHpfEfm08pwLPF6bNq1u1Cdkkp01wD%2F2ar9NVFwiGQ9Svxnkzhqgrlh2bb%2BiSiNuOSwrQmsLBKd6642goXugRCYC%2FEjBJqYXPnjSvWS%2FgYi5zt%2BXhoJt5bg46J7UiQYvS3Bnexm4GRQaBvUBz7A2fHb32BsaVwuita9swyv235Zj3V3OhWqDvnlp5VEWXjdvETM9CsQFjbvVR%2B5DB8UjpX%2Bdk9JCeQBcxQVRsh90D2hqWCL5PTea5Bl7aKm9piW88O0mP3OLCWNmYXtfE8qzoUjwg%2FDJZLWvEZuSDRgmX1k1JYKwLX1GBalih2xqbyB%2FEO1HLlU8aAd9VisR3rfue3FXn8vD1ASG9SlbWP33qRQxABxMLzAv8wGOqUBi2XwiUhAvH7Yue5J3letk%2Bi1%2F8IPWXrq4mbYcmX0Syky4wxfYf5x3gXn380BihriCYGT9rRWspQXci5uNXT8qdQV0vE1xPMf2PElahf27wBelbRKv6Wteoc50WXRZe0151oZJp9gO%2B7IMgUXL%2FChUiLjV34lbvDXnV0b%2Bak5l15%2FEVIdMsRA19CzTuYAdSzByg9L3a8gmWNBcTiZWMlxM8KqISM5&X-Amz-Signature=c8a5ab42236ca4446e4dd251d2540dc958b509354e78a20bba3ebcd4e770f84e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RKSGVH7K%2F20260214%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260214T025242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIC5PPc3lQf3HhhI1pCM1bBh0d9bwL2%2FbuIIgW7jaxd8yAiEA8InDLhDsXrouK1FibrORaf9qed3N8gQancm3TbrqWa8qiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGtuj65Wl4p339oiSCrcA%2F2ZzoI5rdQBnag%2BO%2BKqVrRTAvYQSBAZcA%2FHgyLUqWBlcbWEuKl1fdt4E1PBQJD5vJsdDo04c2fSxvdBl1A43dUj48VNi5If5FcIBmMQJfwf6s8eGB%2FAAT6gFVhPWHe%2B201jJRqf2wSMF4VQx%2BXCmJIDpT3f82V56%2FoJC3fSzsJee7JaUFrZlM3oNXmnJyiZhHDko3vUls3HcS1M47%2BIQQqMmNnrP0SsfRVlO6uV7CblTnnCl2NA4WxR79h5NoEtSP10IDHmCONJSjClJQF0F8w169zpbaDQEZagXP9UUS5zVIHuQeSGxB2uERCafEbf%2Boi9p07oh0jZW7liel%2FXL7EtQYLsclKSmkfXHN4XIDyPDFDZxDU5b3Keh22YsaleGBpbReB5oSeDProzsyCCPttYKI5aCDOZBL%2BPTjMfMhpED2ylzPLxKSEGPcgRqwfrkrIM42ZxJRhJBXyJjhWO%2FbMU3sWV2twkck2%2Bw5MN1I%2FU2UGQi736X3jVKVXK%2Fwotnyhiv2TQXaLZqouH1cZuVmUS1%2BZOZoerFO3aoiANZxHRRXYxgCZnJIhYmI6icClOnBOuTF2SwarBKqfwsyrmiFYyJTBmP4AP%2BCTGc3fmWivHSTZFIkXw%2F%2B2PVE4VMKLAv8wGOqUBpqbHoxXIhE9geZ7cV4CqW0hBPuD9BvETx8j1HHv6UBA3163zIK4cfI1xa3V68C6yBzPl4MQJ1UA5qzSxMQUA4xekVt7fX5LIHopOndXBr%2B1EYXuDWbNsLZFjl2NK4jFaMPLrbDvDbccTXw0HRlxRSfJTG0XT8mLdwFRNoEgDaEdwcBY5GhBtebyOTzZPNQwqXkMAFoc6%2BZYP81AwXL3Ub3tdzxpy&X-Amz-Signature=0b900653df734b662d0acab178333d319dd82350f26017eaf70da590f3586fdb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
