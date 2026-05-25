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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ZGR27FU%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF7IGOepEDAJTAzQJSpzn87gNg3ywEHgwPBdfG7BoDDzAiB3JhI2R89xALC5wDn5NKd2eUA2vt48UNI1S%2F6nTeqDpCr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIM4n2dVcRxMY78TsEKKtwDmpswLppBebGD9TiXkwq7IWBYpS7boPRxG1hSZOClYgTdTtQsNgSdKrIn77G4B3sGTPeuufSKxc1zPNdjH0rqctYfi8qtOVKnHa%2FIBZ6y%2FOOkLs%2BWILyn8VQk%2Bt1gc4GGDrsOinHD4aE8BxVSArcU2C9T2FHYcFW1%2FTWqbppI6m3dXt4DAg%2FfPSAik2b68uRdxq83mxqhMpe%2FmKfrIq1XVWm3Xyo3KheupMKT%2Byak8eMnkYlKNWe1Z2Rua5LtK2mdXgIcxkZ86z5vXAtrq0k1BBE1IUfFQ0DIrhsXObBLVAHN0frSBXjJ4rM%2BzLK1xXuy0sQxwdq%2Fe5vvOl6YD0f26ahNOhJK0Tm0%2FJs%2BIXgsJURNjHKi9rcuGMK16gHdToaD2MDtGJ2b7pld002aRf5XbucdqeNG7QHYu0Lp%2BM%2BAQZ7i0qBYepPJKp0ldCp%2BJ%2BV8gv3xr%2Bp6A8B1%2B5zsOtxi0Y2UagysO0NG%2BS3jmDmVwsLk7KrJnV4B51mETwbOyF3fRsm2ZI0HPDmC505koiQh21Zp2l19%2BSZIaa%2BsaUl1URzpr7H4z8XNEPvKcrKG21tkbPNofT29trZUTHmQh1mm5h6ntyDV4vDH5CBRQwPGzYR%2BE1o93g%2BIfJsmb8IwyLTO0AY6pgHyVzYxHayciZcesWrkZdguj%2BS%2BkSK%2Bjm6wITh7AY1wrTJoa%2Bp%2BWE6JC9sbuUmJgTNMpW2jvw0%2FKsHxDm8LARt%2Bl7pP489oRSvZOVmdEzTE%2BffZmw2fgEwuUZhedBDtPjyna0emM1CNApFIj4xcUXHi2R8Q1O%2BaN6aUsP6CrmBJxz0NPbh8PCvbVJfqgBL1RI4PywLGq9yX1N8t4henssly0j%2BD%2Fgj2&X-Amz-Signature=9dffd31df35dc844aa1f2601ac2082c27d2e6cbb57890c87b357517c2cc2cae1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W4YSFYQS%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045211Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD5im0na8M%2B9TMsNJOwOof3O%2B29Pkn9cZvSxBPizTxhjQIgBWcpu3DYAxSmokqEEqa%2B5bRWLpoXO9n4tS2NNsbMTjUq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDH9TbZTmMBX%2BAlha4ircA1qQtzebqbdUAtaNNC7McvUzlaYAoL0sC0%2BC05dZLgsXaWyoQaoEkmFsddHFFl0GLqQD0KuMUMaVCLm2LqqJfULEIXP8vL9KT8vfYmKZx6aS9DpMXn81Z2%2Fl2nf9DdsN4tAX8EB%2BOA3uOeseHw%2BlwTe3rfKdcPDDGhalGqvqCHfz9OGKI84%2BJdOge7vWvAZ5amdFduwi9QfoEOvX9%2FEGOJ%2BwSSVkhC5cbXCcdyyixbWd0QVyz5FCzG0rGVMctK4584d%2B5IJLQH7DdFIYblGuX1YS7JZ69BFs3wYk8ySltwIwsZ%2FUDaCU3aG73Pgi1ZaaXnfkfPwB01RTMKgpJ%2B%2BEos6Nl1GPTfBL6LtGlfAI0heFggMTNFe%2BlYgzjwAmhmS7jVMYOsPTR5%2FK2uaTr0YJk2hysNTxAZRFxR06d8wL2cQjfN9j7OMjvJBktX%2BVdxsVIjILNc%2FZMICFE9pSrMqazSbGTqj1W4ICsz654Xx1uDVa%2FtzD1mDMqfZ2XJtoo29dUm9bYKv%2BoBoPmGbIR1%2Bt2U3uvo5TVTveWg9%2FTKQJlTHkdhDenyd5WBuqrDPWXFxZNN%2F87H1SiHt5cDMqDwx8bpLvyYZZfYFhbosHEAyz8Qkwtj3Z8uh7FIXCEe%2BaMNi0ztAGOqUBhKDS9ecVIxmWfXiM1gr6O6DCet2xEsAv%2FEuF3F55qVqxvqIJZACNq%2BfT84HJAm9snfh1q%2FkkC200g5WL0NRUJdjXOt4deg8f35RgmTUGoYcCMtLYMDGJ9qRaGaLibFFiGeWK1odrQP33NiKdiQgZcWy36NnlnII5irp6%2BZWCzebXtBCP%2BcTM8WhbQEae5PbFNQLYU7SA0c%2Bd7JvXhDsqUoNJXB64&X-Amz-Signature=c2e61b0501a98f4412d038732ce4ba7d7260ba4ddc05cffdc6d6412f035a5eee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPLCKI6M%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEK381R3WxOhO7kGt9mAdoLznYLTjDJHKSLPWee63XKaAiEAxJl8oBDCEFROM3ET0DL4uULywb03OxQVxBMRY1MGPfAq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDOJIfhoEgXqXc71lmSrcA9hzuBmj0G41Tv9XH4rihhBUWaDUelPKDWEjKhV1GUJ90iWwR3Fo2e%2Bq9LhBtGJcleEucWrdBkVleTSPI90o5c%2BLYTSNsX2m5QNGm8G5rtyrmCK%2BOwU7G1orEgn%2Bk1O2WpZBPoUYLJlapaPKY4Wvnm%2F9M4SmU%2FBntuR5JGJX8NQSSIKqBdY3siGrKHKKrRmBD6WMd85xpBVi9nuQaqz7L9XaY6rnzouC3T2I6lxwiKKcVoeVuLth6NOhHo6Ahcq5fVIXb6NuflXnb%2B5p3MynDjnPCecbKEPRQAGukhT8QfEX%2BIHVwOxJOlTYsJbhXXfFvtXjhyDCtH2ycSIVmm8vfsQqaKLSYp68uZ0oZBBrSxrPWC6t18PyohiUESjXi14Hk%2Fyo8cgvimmSBACgk0FEQHmYUESZZ%2Fx2Xr0POFBOIVlj%2F9MO5tGS8yo%2BrKdWPp3m72nS4rhBzAn2EOsxTSvtprzfY73Ibi%2B0wWwTqGdOBTqIQASkdry36mK50qhao7iBEtAlYjXOTZ339k1J9iW4p%2FsZorLk2u9nzZkcU%2FXg0Ex1rb5PJTWwCKckU7Rs7wxPxLTddnV9XIXvfA5WYDfeiJ%2FKFOHo5X3bHcEsb%2FpE7gbW6kHUjDCwpd6BTeW4MPe0ztAGOqUBTPcTWCLtvVteWbsBmEb3pUyQBEel%2FR4tljEoYr1JOiWkqR8KaTaYMvdTNmv8uhL6FTSxUVwHUIvw5yIonM85cMI0oCyTJNxR4%2BDN7naKrZcd4L7gkQZhxZCFyEWTIYc7ZzfBVFlvvDc62PaDvqXvhkYs3k4tsPduuG1kQarrEDyU0LkFk%2FramvZLOFU41m5%2BB7V9u7OyFj5GJUQxra2IDwfROYGP&X-Amz-Signature=9a6cf23a77cd14fa8d4ba4ce6d1e8af829615057e417b6104869272ae66050e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPLCKI6M%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEK381R3WxOhO7kGt9mAdoLznYLTjDJHKSLPWee63XKaAiEAxJl8oBDCEFROM3ET0DL4uULywb03OxQVxBMRY1MGPfAq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDOJIfhoEgXqXc71lmSrcA9hzuBmj0G41Tv9XH4rihhBUWaDUelPKDWEjKhV1GUJ90iWwR3Fo2e%2Bq9LhBtGJcleEucWrdBkVleTSPI90o5c%2BLYTSNsX2m5QNGm8G5rtyrmCK%2BOwU7G1orEgn%2Bk1O2WpZBPoUYLJlapaPKY4Wvnm%2F9M4SmU%2FBntuR5JGJX8NQSSIKqBdY3siGrKHKKrRmBD6WMd85xpBVi9nuQaqz7L9XaY6rnzouC3T2I6lxwiKKcVoeVuLth6NOhHo6Ahcq5fVIXb6NuflXnb%2B5p3MynDjnPCecbKEPRQAGukhT8QfEX%2BIHVwOxJOlTYsJbhXXfFvtXjhyDCtH2ycSIVmm8vfsQqaKLSYp68uZ0oZBBrSxrPWC6t18PyohiUESjXi14Hk%2Fyo8cgvimmSBACgk0FEQHmYUESZZ%2Fx2Xr0POFBOIVlj%2F9MO5tGS8yo%2BrKdWPp3m72nS4rhBzAn2EOsxTSvtprzfY73Ibi%2B0wWwTqGdOBTqIQASkdry36mK50qhao7iBEtAlYjXOTZ339k1J9iW4p%2FsZorLk2u9nzZkcU%2FXg0Ex1rb5PJTWwCKckU7Rs7wxPxLTddnV9XIXvfA5WYDfeiJ%2FKFOHo5X3bHcEsb%2FpE7gbW6kHUjDCwpd6BTeW4MPe0ztAGOqUBTPcTWCLtvVteWbsBmEb3pUyQBEel%2FR4tljEoYr1JOiWkqR8KaTaYMvdTNmv8uhL6FTSxUVwHUIvw5yIonM85cMI0oCyTJNxR4%2BDN7naKrZcd4L7gkQZhxZCFyEWTIYc7ZzfBVFlvvDc62PaDvqXvhkYs3k4tsPduuG1kQarrEDyU0LkFk%2FramvZLOFU41m5%2BB7V9u7OyFj5GJUQxra2IDwfROYGP&X-Amz-Signature=3e3070a1225a7a1e037bac52b9c34f83d4a74e75818b788901bd0bc881648081&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666XPU5EBU%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045222Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDZ69E6WY0aP4hwxIOCH6RR53%2B9n2sw4wkmZ7dDEI1KQAIgYOFG9VbiynYOiteYz6btpaVeZCAcx2kgtoo2EIwAC1Eq%2FwMIXRAAGgw2Mzc0MjMxODM4MDUiDJbMYMsyor0OW5DiiSrcA0pk9xzKFWS7e2Ye6wb0KYmI0uHpK45ylGMDLbVXPzdn3RXD%2FzaPJ6QlpjOKLXysw9qB4g2eTxZfk3BDn2QzSk5qlO3jTFi3RR3eIquzL7E1YOSXEuWQ2M7jStW%2FUa35y6J9Ymy7rf0B7cqtKE3DvC6CSkfGR5NhTvrss%2FFyrwUuJjJ7t5%2BL6FtE8qLz%2B6strvPojkolqlrDgqp%2FFsuQfh%2FdKAeN5q9ZEU%2Bn%2FbTJLCD2R0hztpIaUXTPkTbtc%2FelkJwDMmSO5wpAlvyzxeUogcPnIXbWfqk3S4UIVv7RaeLT5%2FOkTxHyYHKYp2PqQTi02EBpgKoLxh4IjGxDNeV4gZ5hp96r8jm%2FazO7lhv4nBzR7VfCRp8aEKjaogoM7jicAG6F5sqxOK4rU0Y%2BA87K5Sdq7BrW%2F5PICE13jgJOp7Vf2IVZraOMHyhIJyvw6C1Iu%2FsuJiEBZ51ymEss0pYOyVNMtRM3EK2efkwfzvvCHXYOu6EDsRthirFIfzWUTSWDPsTb5zEyre10YLgefDH241H5Z5jR9jOAKl4vUPBQVv3d1aWKQIixzpv5XPNENDN1JAdKfxdv6By2mmam7TuwHA7qEvUV11oNt4s4UwxQ%2BSbXiZw5CrcSk0qVkl9bMLOTz9AGOqUBdYpgveLaA9zZcjPTN5pUIZZYVLKfz%2BwhrmaMtqVrWiUqmTimlBPr%2BUUu8H%2FG%2FqCt1FsaWOxH%2B1y1RSm%2F5%2Btr6C4CQ2BfimOHNsY1pXn1bDd6RfXcyVF%2B%2FDCaeHB7s5hZeJPjz2bVGEW1Y4Ykuxlj1OdFKqA7mCsEjl4B91cqGkzLKfE5WZr8ghMyfpK9BgAUQQP7Mgdvlz3WqVEAuAODJFn%2F7ixB&X-Amz-Signature=83589f13afcb70be1180dbeab293308c0330c37966eaea73f3ed5f1a96898549&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FAHYPF3%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCuxzdj2lS73H6QgE3kw8qwxU0YVFAmD9wxlamTHFk1SAIhAMJajHP8gixadj%2BU2sFiVjjG%2FWfXSJnhea6eOJK9SJM9Kv8DCFoQABoMNjM3NDIzMTgzODA1IgwlKVIX5ZxQ7r7lbfIq3APcbZJUL0FAkLF1zyzUUrdMZZ7PohUs%2F2IlqtcV88b5Ecn2BMT4oR62gPNhXc18Je%2B6KhIq0uQh9pAQEctl5t2CztYPBGlJ5jdlDJftIYH9xC5aZMibF6lHDpbRUjJxh5jBfIOIAFeWQah0kXk8BZCdGF%2FgG94nAj%2FyfrHt6GYY72tAK146B%2FxPBtGZGJUfvdtOgR0fcxTNJmXsVvieD0S6UaMEbPdkFFAh9F1wpdx69%2F8BJom86W470dWi0JM5xMRllrsxS04QQOJ8qhPjqUD4l1PB6JxiJHToB2ee%2BW7aanC%2FdBclqq98MgujTmlTr7rg3cPDeT%2FwE95waEjciZonItp3IsXNMw3mFRrb8f5eNlRdsYPn70EA8ONekvKVoYFswbeJGsSzAtQ7PEX%2BcPmspFiH5iD6I3KyvbWoM1Z7lmqa8z2oJt9SXG96SkVrROilSYq6yL5o5G%2BV4Lg9WzhJrJvnG5Ys3v1EonIHRLquyCnN2sDpjqgYwc%2BOm9KtyxHrni4FxRc5%2BW2jYsXy3bsYsE%2BtmTJbUou7El1ASZ9DBLAqQaZVw697sUP3gBwRSjzsF3BAUpkQRYvgfBIqeHGjYK67kwBYnMqxPJtRBd6vpluzVS7KZpUHSLpZBDCzs87QBjqkAS3%2Fakf30nBRI476r78JxthNo%2FpJRlkO3qhy8cBACyX17dtcyrHLqZILswmaxgMOhhKkhPMPP2U8%2BYuIqCIo4rON7zZq%2F67pbpjf5yBVPx%2Fh1sswUw8wDC6VvnFb7lpaBJc13Ho7Ey2TQWbrYPuNPAFrKsF1T8xRagbadrIyzCLjUHuzWULNz2UCx2pCckXX1Tcyj5gUZXmz7dCo1p7KPY8OpAgL&X-Amz-Signature=3269688e6cc55287d003362365195aacd7ddf3a279bb24a148a78d66234e1832&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664K5AMW7A%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDsc1K8an51aBEypkUaxqfQSRbBpB7OgnA1L%2FALjsP64AiAR%2F8ts5BnvPPgS%2BLWBckxbbFOZ11FwBPV912VvY1JEZCr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIMcOqOKVhkAjhfVHbTKtwD4fXjRErP0EjauC42akUhTRr1MwovqpG3LAesJnD1wOr49F1i6fHfaw%2FZscGduoSVkMzpLi9mWEGmhhuNrPxPsiXxjc4hbtrDPhUPSPj31mG4h7O5FlTIFnafNOJBI4gyAPXiLypaf13tlcwsYfaoGxCKWCA5vee6Zh0kwa9wHLv0FGXgFjPLc2SGfVw9H6XKMLOEXdaS30fMVYBqXuU4%2BdHED49K%2B%2BCawVjxtUfIDIGsCXJQfDxtQGr8VlK9Zw1BEPQHmeG1%2BCGwABpK0Qb9onKYciSrHQlsq7tY3To045%2Fss91RSvQzTs5HK6zBkJifZgNyuWGpSUq6qU9mQ5uGrgIK1gxeuq3u6QISQKuNsyKcYQxbxJxvYlikJnN8fh%2FmZQFXczizLlz1ZUAunnEzvci0NarHk%2BoGE0ngDGQFVQnqqi4ZZAL5jfCS57EiWVWZAnRJe2pxU1FeSqGa6OSlcnaBqZusMqfdfaoxO4ARowlRD7rkFK92dduMAb7E5CCU4H12SZ8FNIV7Rwl4lqKdm8oZsQNvT93A81xsagf5tU%2FlWvG6PMPOsj32IPc27a2M%2BauMN%2BgnO4JIOHWUQJLDjbNOgnwreb0Kg5M3xqlRVeJvg5IpyVBF2XVSMXowyrPO0AY6pgF501x9NpgYXa9VTLvQ85wie1iqtGe0rjdZ%2Buyd1iJPxGX%2F4ItfEL88haTFxJVzIWVSXXEL4mG727mLG4KWAUMYxll99xT%2F2b%2FwU4wY%2BwBD2GuD1E%2B9aemJuGomGMOeCREs7d6ir3%2FcbPHZFjL7RnctNc%2BGRXqgzOEUxx8UrFPS04MZYpUxSNiiQpzJywzlXBrQ%2BQMRmorMRra5Ezld1hrEG2pR3oAT&X-Amz-Signature=f2229a2d69e19eca745d19bdd16746491e87f13f624255ce4a53b6229de95050&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZKN4VHGR%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCRXQn%2FnTz1xteRuBmy4BPDk5NR0l8jEwSImm47hl7ZUAIgFsmFf8ZDkLsKSQt0tjolFb7%2BqWbvyTD%2FAnhofHnRgv0q%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDDeR63tKe45W1HTNeyrcA9PVAKGWxmoda5iUf04hiY28Cpmn%2BKFCogVFvgkCkprwSUUbD9rLpmx1HEOPar%2BdyEttTCMdwK9Ljl1N3rQoJ9gc1fmYHxE5Ike8jMN6YKkpJ1SEQVK5CRC1%2BOYgIj2MWHcqpOgtRZEUz9KMNXrvGaCajbgVJmHCyQvq%2FrqsZrDW%2BiStfbLyvjJK4ppC8cm%2F9Sd4GMLYNnDXs%2F4Fc5yuX5DvO34rPlYiAxj9aIfl%2FPJTRgl5nKIklsQ6UGJrY5bJDPcTbtk5QnrKikev3v%2BuTvTaS2nWaKh3r9NqSQVs2VgKW8HZY5yiKNttd1VvCt3MQTlfl3M38Mi9q%2FGxaR339SVDtlzpr2Z7yigUEYYK2sbu5ZQMPkeL%2B700t4B4DIcmhQ%2BQswc%2Bc3cP2JG1NuSsESpIcALlxd1B%2BkE%2F6IS6zLV7Yusy6XmUmIfz8fxHyQpG74exbR%2BGOssGbYhMlX36KYIoBeY7nr4w%2B1%2BxrvgoQgoM5QyDn9DrytpUaao%2F5WZkPs7fKQJ7dDi5SRkExFv7MUxUCIbVHPkg1nApLw05Ls1%2Fhs4IDtW%2F2GjxDrwDBR7b3t2vFAvONxvb2Nr4CawHIPRwZlEtSk3G%2Bp%2BvazC0YJknFCrdDQ4jVyCjaiYYMJ%2BzztAGOqUBQEmCDfLCIbqHOGibNijML3xwfmiCsKnr9YcDnv7VgBns8N1WI23yLGZLsvM8%2BKH2IHkxX2f9LpeY5qttNoiGkv5U17FiKyyUYymhwwNBIVz40patOSM%2BvOvfGtEgF3EGH2l9uRjPHGaKj3PopPiO5tMwoEmQCkpa0SXw9DxvI5kxZzdsuoVKXQ5CTN9T2OBr2dirDaBUH1JND4GkMs3kwJEF94ur&X-Amz-Signature=7fb36d4cab1fde071c9e18eeff86cacd716ad59208e048c08d74c74c4823df0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666VFJFLQS%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA2kueLE%2B%2Bi7e7fc%2BgLqL%2BwvsQfdka%2B4z8iNlLAO%2BzhwAiEAlOZYw3vOKDmhC3lUtEhDb9gpXpJhmnxId%2FCX1p7sYlEq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDD2gW9SIuoWH9Ata6yrcA1STujc2jXPkhCDrylQHkAwB2mkSo9lLwg8IL2rj8n0XGTYGj3lwEtk6WQV1uEV87vxcSz96om3F1KRgYMiVegb6chTM0O%2BSeJIcP9HwxvJOPcTFSfyIcZ37VV1aj1WLd67ebBdHJTy5HiLcf%2FFGolBSHEzIq7ZAO%2B1LwRWgteDz%2FfNNrHY8rwokJWRHJ2IqN%2F2%2BehLiV5eQPG5KI9wLt2tEIyHHnVpL1xRjOm8NZLhWqsmpPK895SKCEeMRhwfmrg6uz3ieLtCO1WplWByJqsYyoB1M%2F1v1XSsajmx8eQYkd9Q6A8N2O3SVS1kVSFdjX2D%2Befr9%2F3leusl01BZrg%2FxjRkbDCbPAVDhrcUykfvCUCN9ncO0Vu7%2Fpcvf3QhJWp1c%2BVR09lyHeDuRssXrFd29juM9hQJpP4QJ7Aa6t4g%2BTDCvSllJ3T%2BltQmlCEHRwWdR1Fuh%2BxGZ9fWOmB7HDkU%2B9ZeRWplHTcf%2Fl%2B2zd62V%2BWzQL%2FyPTHgd3QtUU2SPo%2F1wNscKtXDXICbAnDpD4D76mjLYKvmjlOqyD%2FPaJ9yXoND7xZWeEFuWqH3K850TuIJblRrZ6Hos%2FJOXmE%2BFe%2FI6BDT0cNJnSTJS%2FO%2FRsSRsiBv870kkjkmxhiccwML%2B0ztAGOqUB0K%2FmwJRq5yXculobFlerLUP7nvIlDkF%2BqIW8WmsNWnnAunicjAT0pc4i%2Ft%2FhNdHKAwPYDybSjoUP1%2FDl1iNoIVGrOlCkPJF6B454Zu%2FOeW2hYFTuaEqaAqFTqZCXnOJ9A91LVz9CfQSoHVZ48rfjgqSxrYnAWUJrbc2uNLcjoitS%2BBiJ9QWP8bTYqJ%2FcXFh1T8cLNcTJkQKvHexe2Z7s95WMbxnY&X-Amz-Signature=eac24a10d6394840b1c85d9cd5721c73106799ffcef15c7ad9663ee986c28a49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPLCKI6M%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T045207Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEK381R3WxOhO7kGt9mAdoLznYLTjDJHKSLPWee63XKaAiEAxJl8oBDCEFROM3ET0DL4uULywb03OxQVxBMRY1MGPfAq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDOJIfhoEgXqXc71lmSrcA9hzuBmj0G41Tv9XH4rihhBUWaDUelPKDWEjKhV1GUJ90iWwR3Fo2e%2Bq9LhBtGJcleEucWrdBkVleTSPI90o5c%2BLYTSNsX2m5QNGm8G5rtyrmCK%2BOwU7G1orEgn%2Bk1O2WpZBPoUYLJlapaPKY4Wvnm%2F9M4SmU%2FBntuR5JGJX8NQSSIKqBdY3siGrKHKKrRmBD6WMd85xpBVi9nuQaqz7L9XaY6rnzouC3T2I6lxwiKKcVoeVuLth6NOhHo6Ahcq5fVIXb6NuflXnb%2B5p3MynDjnPCecbKEPRQAGukhT8QfEX%2BIHVwOxJOlTYsJbhXXfFvtXjhyDCtH2ycSIVmm8vfsQqaKLSYp68uZ0oZBBrSxrPWC6t18PyohiUESjXi14Hk%2Fyo8cgvimmSBACgk0FEQHmYUESZZ%2Fx2Xr0POFBOIVlj%2F9MO5tGS8yo%2BrKdWPp3m72nS4rhBzAn2EOsxTSvtprzfY73Ibi%2B0wWwTqGdOBTqIQASkdry36mK50qhao7iBEtAlYjXOTZ339k1J9iW4p%2FsZorLk2u9nzZkcU%2FXg0Ex1rb5PJTWwCKckU7Rs7wxPxLTddnV9XIXvfA5WYDfeiJ%2FKFOHo5X3bHcEsb%2FpE7gbW6kHUjDCwpd6BTeW4MPe0ztAGOqUBTPcTWCLtvVteWbsBmEb3pUyQBEel%2FR4tljEoYr1JOiWkqR8KaTaYMvdTNmv8uhL6FTSxUVwHUIvw5yIonM85cMI0oCyTJNxR4%2BDN7naKrZcd4L7gkQZhxZCFyEWTIYc7ZzfBVFlvvDc62PaDvqXvhkYs3k4tsPduuG1kQarrEDyU0LkFk%2FramvZLOFU41m5%2BB7V9u7OyFj5GJUQxra2IDwfROYGP&X-Amz-Signature=498ce831ab8ca866752c5cbe268964b1e7a001b3f92661214abeb63d7249f384&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
