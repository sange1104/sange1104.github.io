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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667U6FTESP%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045756Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8zJdnWqZUIysJT6NpTb%2BA3HVHfnI6R2Zl7psuln2tuQIgRFzL8Zf3rSc8pX%2BvTihz8bZhy32z1JRzmZQKwu2X6boqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJEno2iQKOe4jLNacyrcAzXkGqWXsmaaW3jtrvWu6LaO8iG%2BNke1qj53lJck13C92iFXI2damAPQ84bKGO9iMahfRlgyjtWJzRwChxliKL1Ctb%2BTW6IIeT2n2iUohFT8qZS7aqtadJ6c%2Bi8j2jWyEba7ybiKvJTWeu%2F5YhTLbSpqUd5i3vrt%2BUM0acIbRbIPFZFqH1o4UTC5R8u5v02FvMNlp5%2BOAZavfn8ZACAlqxbNORMW%2FtxKwPkFub2%2FNdwrvpRuqsb4gyzh%2F48swKbPkWS8bex4MMfM0liwnfpkle0rJnFOxfvzICqYgyPppYAbgaTQVfvem6EC7tDQPExL7EF6mKnYor8tQkBc4hrHGK6wdary%2FNvqE2CdeEx40O%2B5%2FwPzEgsJjJ6lYjnAsTkDCWGfm30XEhv5vtDlVnjU7kHfcXE7js%2FiMiCkiNTTigSk%2F1z6aubfUKtgZv7qs3wY1FtriUpPd5xejha6W%2BfjvPFGzWvETWnRn9IfatBb7NbqejW%2BSXqsAiu4CMKyzba5LsXDjn460cmrvsmpc16tdVGsc075YYfuPG055zOFHQ8mYUwGIoaacBpZwWGHyS2c2bCfYjpm5clvhPokjkdQ1w9c%2BXu%2F7T27r%2Bchr2%2Fo2vVm7PARjcO8HmZw%2FnF2MOTQk9EGOqUBbA8Dzu7L4IWIJCYKKH2Yl2qYAkPPmDzlv%2BcaZS2ZwAo2hNxfsOpjmKLlsRg0wKPwYxV2H8X6CXjAyKowcLVLCItp0suOMX1jmw0ATh1CDciSH8bc7%2Fx7ju9gPMC%2BeKyJPg%2FuU2FWLnOG%2FG%2FAkvwpr940fk9NEjxVYIDEVjwo0hSPKKnDznA%2FLfCFZdw%2FVxWSfIDhfp4sEO%2BBLAxwzHY3wdFadXuq&X-Amz-Signature=33f28d015c3e61575b1b1f35ebec08adba81e258079f8d03e575c568d968baf3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MJKYUWO%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045756Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICwW1YWPWlPt9mFil%2F3DJB8FeS%2F2zQiv2gQWYSHeBLjzAiEApzZDfN0BNH5Sge8ctg8u8y42Kvh8ldr2llDLqnSRqDwqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKEwsdEB9PMAW8IH5ircA%2BigSzLf8OZ7iGQT%2F6g8tFszSUVLCmv0DDCNIYUFIOyH5r831Kwka1Vw9xy8z4753ZYMTrFLh3iSdqMyoxAYz2GE7%2F2h%2BiqY52T7LlpAuOYmE2QzyA6QUlmxiHek%2Fmp2iUSv78AQmbiKhVKItjwmOfVWJuZLhTZn4UnN%2B8GFI6H7K2JzWJ08zbpCr7oyBR7u7pXmfRGLQQ3AVaxIfrnqKXAAPElNyl8Zy7leWEyFus4XU%2F8oY%2BHh4mhwQHYeAsD2giMWTDA85G%2FELdW7yvTrfi8oqotuovngX4rmwh3TupEwjt3%2FDvdlTkpDPaJqNI5%2FePlg2pgGq5LVUyV6CWXNVZC6%2FiglC3ZvQdGRIWL0puWSoaTcwJfj%2B1K81Om3wRoRVdDaR4yn2h3e8kNrwsHIEZJRYDzATlIKu%2Ban3sM62M1U0Gd7jCsSC5KQt46XK5vh2Vs%2BQt6HWaO%2BShEhPicoKP2uC5qId0JGMF3xN0P2fBRLH9bHtu8G5NRbPP%2F3VsI4fbnlY8UAwALMi9iuDwbNw4qlvlznUkefjWVOlvoauiTRl0%2Fcu%2FqEe5KS57k1GeBorus7i9SdomEYv5wqJ4FXi%2F3UFDSldC2IjQK7Fpy9viFWcUTGWHVCeQDhi12FMN%2FRk9EGOqUBi7l9UX7GzWYo9YhrUiIGkul7cBnStKQnmbcM0V8fGJB7Bspu1AGPKDEK7Cb%2F4ee8xjSIqg%2B0STw0mok8pcqWKW%2FKrU9uwhtRtZOHvrkn87MYb%2FScJvLX8wIjvMoXzm8vZxdFIEh7QusbyDUKiaz5lCUoipDtjshJ06E8pUeLdR3vtHbeCYKRv8%2BfTQNFg7%2B7dAPB4ehtaY6GjRoecvzRtU7Xpio0&X-Amz-Signature=85c021dbb4cf326cb5ce0a08fb0eb2f0480ae59cd308fa349c088d0a1fbd9c2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667TRU6M6D%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045746Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQCcgOBEFbL%2FaVmIrFwWk4I3FXwgNa8bzwmZpydHuWAwIgFz9KAZ03kE9pgkiFWBF%2Bzq3T0br5YHX0WGjGkeCoRkgqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGpVTgbs0qAlHtU81SrcA07ZP7yl4vUy69ukzWSndFM8oZFrapqLZ3xhmBONZLL%2FONLrVAuU%2Fm05AvLEVXpE8e05vpx9c11mN4%2F5Vxwxx61QfvQumieDqRrtbfL7e9yWNs%2Fse%2FPDy2kOAIdTxNyDqfYynKh70EPs%2FfOJyL3%2BEvmXP5J9ZUHXh96GgNbcD5xzwlyRNUelqiry0o6QAlJADte4e6O2GXiBfFliPX%2F%2FiKAk76hepsbwHsOJuWmW03mU6ZOmRYN00kuEtMwKjKT1AOe%2BhEyNf9mI1K2kkMdMyHuzjvJCf64LUR%2FKNCgzlpk2mm0lDaXhqQrDJSPLqjh1yRv5h1kgkjRShOeOAsc60NLr1edu7xstYmvWO%2BpyZIn1luhULbasiWeIVpxGaCMRRIdFj2i%2B3f0vNqamglImn0OpD1Ink8fBphgUOfdl9VM3nsG98xabG0a6jAtVm3%2FurmJFUz54rNF9MhkGvlT%2BMzJK7JlOVraKR5mnQ2cEUkbusJACYxIWk11buf9WrhUWiaHnU1WeAq0wQJvIfQWGOP3dDkttETGymCubftz1sM66FSLA59z7FKXJdAzktPZPVdkZpxyMshv9VDGd62LI8NW%2FAQ1%2FV%2B6hobE3r5Pjw2KPH3FvF0gI3afOuOLLMKnRk9EGOqUBF22ZnLekEsT%2FGxiZRUTc0Bx7ZlHy%2F89fYuIZKVP1Pmv4C76RwOfSilRY88ZJCPLx9KOy3J3jU3533ReoH%2BBEAi7Kqst3a0Fotp85t8nI8wPfRjFc2jCEHNCumwMeO8SWWoTHS%2F%2FT7RdZi%2BU4%2FRkEEE5UEi7U%2FXeQmx8qrVkyyEgxwc00FQw6uJ8wUtiSYFAWEn86GksnNbivTZpHey9RptEm8dda&X-Amz-Signature=c54000089146e6e625de64cff978de160577413b2704611336dd79ea5bf84c50&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667TRU6M6D%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045746Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQCcgOBEFbL%2FaVmIrFwWk4I3FXwgNa8bzwmZpydHuWAwIgFz9KAZ03kE9pgkiFWBF%2Bzq3T0br5YHX0WGjGkeCoRkgqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGpVTgbs0qAlHtU81SrcA07ZP7yl4vUy69ukzWSndFM8oZFrapqLZ3xhmBONZLL%2FONLrVAuU%2Fm05AvLEVXpE8e05vpx9c11mN4%2F5Vxwxx61QfvQumieDqRrtbfL7e9yWNs%2Fse%2FPDy2kOAIdTxNyDqfYynKh70EPs%2FfOJyL3%2BEvmXP5J9ZUHXh96GgNbcD5xzwlyRNUelqiry0o6QAlJADte4e6O2GXiBfFliPX%2F%2FiKAk76hepsbwHsOJuWmW03mU6ZOmRYN00kuEtMwKjKT1AOe%2BhEyNf9mI1K2kkMdMyHuzjvJCf64LUR%2FKNCgzlpk2mm0lDaXhqQrDJSPLqjh1yRv5h1kgkjRShOeOAsc60NLr1edu7xstYmvWO%2BpyZIn1luhULbasiWeIVpxGaCMRRIdFj2i%2B3f0vNqamglImn0OpD1Ink8fBphgUOfdl9VM3nsG98xabG0a6jAtVm3%2FurmJFUz54rNF9MhkGvlT%2BMzJK7JlOVraKR5mnQ2cEUkbusJACYxIWk11buf9WrhUWiaHnU1WeAq0wQJvIfQWGOP3dDkttETGymCubftz1sM66FSLA59z7FKXJdAzktPZPVdkZpxyMshv9VDGd62LI8NW%2FAQ1%2FV%2B6hobE3r5Pjw2KPH3FvF0gI3afOuOLLMKnRk9EGOqUBF22ZnLekEsT%2FGxiZRUTc0Bx7ZlHy%2F89fYuIZKVP1Pmv4C76RwOfSilRY88ZJCPLx9KOy3J3jU3533ReoH%2BBEAi7Kqst3a0Fotp85t8nI8wPfRjFc2jCEHNCumwMeO8SWWoTHS%2F%2FT7RdZi%2BU4%2FRkEEE5UEi7U%2FXeQmx8qrVkyyEgxwc00FQw6uJ8wUtiSYFAWEn86GksnNbivTZpHey9RptEm8dda&X-Amz-Signature=eb8816449e082a26e61181b285d83305c2f96283048b7f834031750222315162&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QAJUI2N3%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045800Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHxUDXCWglDFUo6xpW7N%2Fh4%2FQWsdasiQcjDmDBVS54sJAiEAjlGSZIVv8jOu0wPRkf1dW4Yfk0Sv1JfYyvOFVqsogaoqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJvsGMmnibcnYmLLkCrcA4e3X4H3TkAdTS6ByY8iiV1nYvz4s3YUSEJNnVReL3jX4yLkdwg%2FBuwh7H3pK3VNE3UWkdUZTd0DMVWpv61vMN8Dg8tMGUl54EUyE0gu8ZP9HeNU5H7Xq0pncWUNkw%2FgPGvq2T54zhK517Xo4h2bx7ILQOhqPqy50iUVJyU8xNm96sdJo9BoZofhjppTzb8iPn9E5AjTSn2CfSku9S2K7SOu%2FnzNp36ju9MgzSaOG7SP6mEC2kDZ5IyeH9Y2WZojqGQMUkQv5udYz2dxgamng3xCaiRUaINxdKSivathyq3IhP2LkNSOa9eblDzCNdRIv7u7h7zB8Onu9YPDBAE3MFXFhUfsKE9lK21rhbA8muaGDnVQu75uyFAHOc2o7XiNrEqwXAvPg1OVfCTO01eTgTJwOSJGdtUzkJn0%2F%2BV2vS6AZxMIpyCGDY4VuSXX2pOzDQd5aZjR7YjnPmGG2XD3Rw1o7NkFXrBACRMYcfc7URTZnl%2Fib4xw6hV1GdrNP2Cux9JsNCF5leJn3hxeWCty4nyeQ9zz9NQ5apptqiXpzWgl8aidj1ZzdoSXtcvHuqerhxA%2Fiwtq3%2FbiresFkZtiymAC3Y55%2BQaXGDOpxG3YTd6KczUnLPqXDwcU9jh7MLLTk9EGOqUBvXtxU3PHW3abkwzxpTYI7P84jsQc8hZKKwo6Hq0fdKPvbLFQbS9%2B83ogjZvSZDhYgTZk6SWyx6Wa6dvQ5m9DVTPlrTzPXwAk9aJmzD8GBOXj79z0IBIITXt%2F0zOChqo1Sur6VYnySGJZgZrYQS5nTWAdYIHWnmQghAR2KDAvpGrfZnJGE8ToFbfww0iYH4zQG0SUxh2SBvE9Wi0sMdqCGCxgOgXH&X-Amz-Signature=1dfd57bcd5536f7ce267d0ccfdadce1751262066dcb4ab72ea73b8b901d14569&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667EMXDM5O%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045801Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDrd6qomU0SuiK8Cug8NRNNotJYVPpAGSf3EmEKOsa4zwIhAP1XQNeUx2oDy%2BLKRE6Zmtx7Ndpnt%2BPxs%2BYn9hfHvaeVKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzdBtv9zZCMbs5OE1Iq3AO4v%2FI0qPD78iJTsNdbtI5Px3eueC2%2BbiWd07rTYCK1OzuEZu5Q%2BDC2ng0bVrDJeWNPKU30Qw2%2BSVuJGfuJRL1onrhQnF2Y6nLtgn7fy3M%2FS8jf3JziGkeLAuwpX2bRMfRoE7icAAn8%2BOCLnsmlIam60Q7UsfdmW26hYMLsp4AToeCjHdETEUk0Oa9g4BlyvR7Za8f%2FejSXThdTQ3HnwjX1KS7H5f%2BnuGHc6LpFUqKPlVk2DBoFtkO%2BlG3TMo5TaunFITy0tQaI0qMca5yB9Yo9kyaecAP5wDInL40l5%2BmqC3oMUJzCRfQk2TzlSLHzIqw0KDHzG8nKKlx9SLIb8n0%2FJ0HXkIpgCUejhD3xfs9UgM8MwduPe%2BwVeWNzPq3%2Fj0LNH364DnM7v2jNtPsoWDWN0P570PT2YcTQoNof6MTYFeUeblQcPKIA3cDECqVbBAhJV%2B%2BaBHvZdKiJvs1giTcFFBMkN24tOPxiJlBE1Io37aRNRq8FF0D3Oz7BO5KQAq%2FsdIyhH%2BULZFgpU5qT0Ivx3tiMg7ZUh0qWYcqtQgR95Q3tAJ6DDMcNYb2%2B%2FRD48qMqELsb1BTUbULVzee%2BIqIzFNekQQr1Ur7PYuwu3rE%2Fn6daiAoMKTY7VKy4wDDs0pPRBjqkAaV0F1KZOhVEccYuquP78RO0SjSffdbAcgv34GMcDkJG3Kb08vIt6Q9pdKiBR7rCHxObvNMRJTausVrVH0TKfOA%2BYbqq8wIvwS26ZL%2FGmRdJ7E%2F8qtBdmZ0NpvAE3HBwSTWMzITU6pMWWuyeQahsJBhJssWdPvo%2F0NIw1Y8PQvxbT2MaETpl%2FSdqu15k4romPTWPrj35vNdYV0EqzAJ6fOVTH5Vk&X-Amz-Signature=b65f021bbeda4188bfc92397cfbb55a996d2e4474a92904109ac611cc2a41ded&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RV67SD3%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAf6sosAJNt70UMHtPnMsh4bVG%2BEe%2B%2BlAeXaCwhywDtOAiEA8pEV1xsA2C0cWeM0R6tvE3WcUWBlvhOhC2hzD217%2Bt8qiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNN4TFIb8aBZyZwGlSrcAz%2BCQxY%2Bq5Hcct9SC8q5dnXM4YqPyWaJ2JILWcLGGSe%2BhmkrkTQSWgA3TkbhBREruEOOJrnQp40meJvTBdhOMl7SzqZ2vfG9gdmKDHjOoaEQWOiMxxqL0kF5E7uCwb1pmDyz6%2BiNldZBrFs%2FcIX4efn%2Be4U4XGnI88Hmcjvg2zu6J96GyuOwFs5Ur6d%2BgmKVZYdKJhSnqSN0shopRwQBNa2O4azK%2BkYJZasjLl10CyaikNAObBjOm9hfmZh3NYjO8pAA7Lfqff9iTJUavjZjyJkTz%2FYt8sOleyyGReHtV%2B0agc9NHNcWn0o2i%2FyaLmv%2FHWPadyoMSq6Cba6BBOhRIG0EBdycAL7GMvJefXoZCBLmukf4uVPd3ipFoCIeFhJh9yGkOu7OjuYrKzmZteKKu%2Fkt7P1cMyiBdcPDAUHhFw%2FRyD5JpYdzsF3hi%2Fa0FhASoSf%2B3DQDve8R59ch6hUpHwcJgRwflSE3JxoDV%2BZBHKK1EDdT0hbZ%2BmdipGghd5SdNdaMv%2Bs4EU7MyyR22xAUioy%2F0SKkT0Y1C8bvDY5ZxEMpMiuSYjSgA36EQ12RNDZK2Re%2Fg4dfRbVM%2FZHWVWf6DevsEQXvjKJ3xW%2BBlsZFP%2BGNXiAh30uOAp1ilbB9MK%2FTk9EGOqUBTGY6ZVvzlvBxFa7WC1UWZ%2FnNVzqugQTxfQAARKkCbWCCptVgqX%2FlyNLgUTLn3CftQiEr4B81CNIfVpraYegV5SW8mI%2FC3QqvIyNaL1dhAowUKUY9NYwG0YgW2idlOhV0SWg5RFvFCKOFWdHkGOKJhDv80jAVSNtJlGQ%2FbJsdYkiPm8GTWQHTvo6xKHdWFo7VUcu4NapTJt6WgkoUmEgUNk8emRhr&X-Amz-Signature=9354024fa6b37294fb3e1977cffac26b48e8cd60bf11a5c461b8d1109dd1fa64&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPUXWIGG%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCH76yZ7OSaqD2vs5eqEVa6Ww0sqBOHXkhbtOSP3v68rAIhAMlnnf7lIyysF2pDuI3SFMnV8bnDLTWLLofIjoAWwlGJKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzloOfLncMHQKI32Mgq3AOjFcLvmlUuBiqYSkwsEnzhD9KeF8Ayc6B6py%2B4kGE8rrSj7%2FtT8xY6q1HITdqnLDRBRm%2BFr5EuKAiXE4HKYfhbq0494pCvQzzY60o2gTjpM9c7boMIgjPTQgvUrhFS88yZUD2RgkwpFbEtckw2zbm%2BwZXFilMEbqp075gyKruwd3G4swvzoKDaPErrAjGURmmXNh7WV05USOGaFmRi4YzuPzdAR8cQfgB%2BUkc2lPQKLk0D%2FxbmcRDLAKEz0ZgvIyCzhyX4rVSN7e1tGzpCX%2B0ZRoJN78cJWAFxuji1WxXiPNVzGpsYCRdpKqQ5EfeLGfH9cN7tCAEV4xerXx19i4wCgmqgGOKXQ0bq7OFLtyHmYNZ%2F8uBL8eHn%2BSAWPSRh9VgMFHzSZ85JxM3%2F9RSBOd5vvHEORdpml%2BmyepFP9VjXEaC%2BLJOSv8xU%2F56YnMVJQQQVtKGW6U7s%2B3c5x9VZGA4%2Bbc5izn3W6a2fEc5095V5hjLoOOlX9elS%2BC7mDsrmMiEmICep5CCDOn3utPMWkAk%2FZT1i5CjUUhJiWHQU8Sm2qsh2IbObOvKd8tAApbALxKRAn4TTS25LfBCR8Uh7MBVD03p7rYW4hAxPUiNMJgDFHwNyIhedyk%2B0HOIxjTDq0JPRBjqkAc9xSvo7Jgubi1%2F6sstSRBMAzV9ewEVApIEFASnEn5mXVNtIGPyW4iDfyHU4QLyvw9an%2BRUUqYhEvuvxZlB2DraTAa8PF%2BYvz8v9uXAIWoc5IRXPz0sXzWEnKWX5b5Xa10TFZyDiJ34jll9ZJfwxT2W9uCyuX%2B%2FvIaAKE%2BeqHYsG%2BJNDXFrRryktmWfzYA%2BNib9fVte3GN1QajCGPsZKCuCoq6Zp&X-Amz-Signature=f0776427cd71205468f30e6f4ee517968a28312eb4d80a6feb1feda5aed0f424&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZYBERYFO%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045802Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoiMNjwXxGVZ3xBzO%2FvA1fD8E2R95nCuMp0kG%2FgGuogAIhAKI1vBy25RqZAAF%2B0aldALusjBgkvglkzSikwfGfFXdgKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzh57ZEkps%2F2wsa7oAq3AOPLZ%2FterCbd5l8zq6i4AFYe2Z7AEQ9sCuc4Xbd0b8LIJbdUF224HP5PL8BtSfIsvg5N89r1QX6FRM99ZPCBvpfPwVt%2BhnjJvGnoe8XRLznvImoAhf1wmGP5kYAQ85r%2BFFlRDc3B8%2FPylywMoWwpd51aFPaK3z3qo3WiNuFsq1B0DVKAkZHIWI4QapxXEOO6wOGccQtiS7y8aV96AvOle%2BssSxdnVshXt6ZqhY9sEZ5Pf1GFeQhfce%2FxntcA9DMpAIEgPzb9QNhe%2BBCBisGsJrG8SghqA3MIWmwWD95LHjX6gFTgYfnevunjXoCIBSFoxE71bqNxSMg%2BjlUmYbLqhrLyXVXE%2FxJJN%2Fc%2FjkqST%2F9k%2FILT048YCPyuHGGqc4ASmkAbNZELSNXoBOA7W50YzUMeIWw%2FQw50fKyz8JlNm1dDdghnyS1KejmpxuqeYQfkXtOK%2BKKH22%2Fi9VQpOeL595UD4tvse%2BoX%2BW%2BSqj%2B3CJnSXwaDm2%2BZ2Dy8sY%2FeyvHazqIG86MbOEPbGHvXIFU%2BWPT%2F0q23tdTGKziIVtsdqWZz57J3w9B93ThiR2rf01mqzqKNHljLY9EDXNd6AY%2F%2B9os9YHIIrrS3CMHghNl6qDxUkLwKGGZBktwu11ZYjCV05PRBjqkAdup0w1w%2Ba8J0z5AKqmI5PDuDtXX2OdQtNxJljkdyusxZjYOKVmxavsvA%2FqwelN5xshsBJ%2BnXh9evPBG6rSytS5ss2iEa2dfiLvCnBksBQ%2FM7tYiP8WzFPKUrqy%2FXrflzD6clI3dA%2BpBkzxLoxzRlgxb0btp1urz6%2Bya9G2%2BObYFbSN69%2Bre0N%2FxpuLgyXVisouIHxxar2a%2BNdK0kwH86t8YMYBf&X-Amz-Signature=9b18a78c5528af48e87b3f65256af6cba3815b5ac511965031d323cae3ba3979&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667TRU6M6D%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045746Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDQCcgOBEFbL%2FaVmIrFwWk4I3FXwgNa8bzwmZpydHuWAwIgFz9KAZ03kE9pgkiFWBF%2Bzq3T0br5YHX0WGjGkeCoRkgqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGpVTgbs0qAlHtU81SrcA07ZP7yl4vUy69ukzWSndFM8oZFrapqLZ3xhmBONZLL%2FONLrVAuU%2Fm05AvLEVXpE8e05vpx9c11mN4%2F5Vxwxx61QfvQumieDqRrtbfL7e9yWNs%2Fse%2FPDy2kOAIdTxNyDqfYynKh70EPs%2FfOJyL3%2BEvmXP5J9ZUHXh96GgNbcD5xzwlyRNUelqiry0o6QAlJADte4e6O2GXiBfFliPX%2F%2FiKAk76hepsbwHsOJuWmW03mU6ZOmRYN00kuEtMwKjKT1AOe%2BhEyNf9mI1K2kkMdMyHuzjvJCf64LUR%2FKNCgzlpk2mm0lDaXhqQrDJSPLqjh1yRv5h1kgkjRShOeOAsc60NLr1edu7xstYmvWO%2BpyZIn1luhULbasiWeIVpxGaCMRRIdFj2i%2B3f0vNqamglImn0OpD1Ink8fBphgUOfdl9VM3nsG98xabG0a6jAtVm3%2FurmJFUz54rNF9MhkGvlT%2BMzJK7JlOVraKR5mnQ2cEUkbusJACYxIWk11buf9WrhUWiaHnU1WeAq0wQJvIfQWGOP3dDkttETGymCubftz1sM66FSLA59z7FKXJdAzktPZPVdkZpxyMshv9VDGd62LI8NW%2FAQ1%2FV%2B6hobE3r5Pjw2KPH3FvF0gI3afOuOLLMKnRk9EGOqUBF22ZnLekEsT%2FGxiZRUTc0Bx7ZlHy%2F89fYuIZKVP1Pmv4C76RwOfSilRY88ZJCPLx9KOy3J3jU3533ReoH%2BBEAi7Kqst3a0Fotp85t8nI8wPfRjFc2jCEHNCumwMeO8SWWoTHS%2F%2FT7RdZi%2BU4%2FRkEEE5UEi7U%2FXeQmx8qrVkyyEgxwc00FQw6uJ8wUtiSYFAWEn86GksnNbivTZpHey9RptEm8dda&X-Amz-Signature=135fff45883c95d3d2ccb6507b5eeb7a7c9dc54bd05c40b49ee378812fd4474c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
