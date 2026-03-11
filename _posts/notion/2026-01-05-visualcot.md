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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZQQOOXBP%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025130Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCG2eBDb5RMEvKH5gs0QIxZe%2BHePoaQkoYZgZVc7%2Fwu1wIhAN0A2vfwbM6W4Tz9nMdj%2FaPyRmaKSbmuhFRU8rmNjqSTKv8DCFIQABoMNjM3NDIzMTgzODA1IgzeIfkI3F3oXXWCgQcq3AOepfFfL2n8ObZJvdmmYK8PuSflOFjLtn%2BSzvqgjoDCp0bDqck20DM50Zdr4DbF6QMzO9UbfdwqChSJ%2F3CfSYOGGfZL7Mi4qMkXtckBvAVe868b9Www0qC9KMUK9%2FFVIGstvc9kplCw8ZD1x9HqbRQwmK9YnOsVURwoeI2PLTJQuxVfO4VaUI8XSg1E4HJNc1Og2PvBmvG1ibR6rsyggjigb3ArpFfwXWHCGizJEYNtHdQizK2uAbwPnSgPvOqR8epfosZFKSZobwEfJgoibWUik3ErF2xy10xx%2BwQjwjkLmxXG5CiRTGR60oeeFy5Xro0%2B9Qg57qX2HwSmzMvkavbRW7O%2ByKLTpt%2FHb7mxvEet9H%2BnjcHxzLOl4bcABF6MATeDOnO5y8DbHvhl0V20hyaW0cPTVFleqpsbfMOxMPZg46Hgn5fLQV8GoDDAwvW1w5TLsQp8JLC%2FdaZfyUxtby1%2F%2FxvzkMJCiPBJHWjuQHo6YuqZ8%2Bwvp4JoS1xBSnvDNGYtaBF3QVfSFUka4hW4Myb8U401W2Or%2BWjfsfgt4UgSP%2FOsXLNJf9jIYZTLmzcA71fzng4A0RVDpd26xvu5tQNd5cdMWrLxl6759m9OhiF7AD62VzJ0s7nuXjmx7jC28sLNBjqkAebn1fTNLB3wph8GcCXp5WGZoroBCfS1nrqTq%2F65itMpW7zKT2zBlTYG7olOw4Xdrtjx402vB99NSUFTaonXoUmihwda8U8c6duVyRoTrKC6c402CBId%2FJBJY06ZfpqFdyo9f3kzkAjBRnGkIiN6YbWMxZ8PoxtmfqWy7mcXh0i4apTl5mXpswV4obS1wkubHpL6XDV3ptOiFUDlQ%2BkyZsDrQ4fs&X-Amz-Signature=614c925c73f0d501e6fe0657c3a60e487b65d98404dee6e598bc87d1a46b879f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HS3XF57%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025130Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCo8FBAVhB1R48BMnwY9IFdMvTB%2FTfYralAnB%2BrXvpjcgIhAIedK7awN9IHUCncOyO9wcmB5xQj40e0frJM47U5iqj6Kv8DCFIQABoMNjM3NDIzMTgzODA1IgwbgWZkjh6MGjtzIhAq3AM6TzWMAD1t3LD9JSSbpcOY6f%2BZXAb0DP7uwq%2FI0k8dI831I%2FBF0pRQggPswwKezd8bszeiJ4My5AVRtdwT6KR3VevDq3rDaypMXg0PzsBrpNtCPntXAdFrN9HpWiNRhxojzu73dUREIZjmYC3GNpO34a%2F9gPZ2oxwGXCdE7scIoNm0bBhRmqVvDKHQ0LFlFIlxpOwLlEw9%2BktO7l0uJB%2Bw7s1evFTjbP8MyGzZrqAllBM%2FaRorNFlT0WfRSAf1FX7fKkXvbmqkc13JEPCNgrjHt3Rt2pZBfzne3GHUmf%2Fw3Y7dRasa1q89ESWR%2Bii1yjmDHWq%2FvMt3nCA4vNMYX4Wyn0TTsDOZIL478yHcPWZANMvXoe%2BSDvbDLAu8WrpomqSDInz9M5I2dEDa8MomkkHtNBhw1SVULBGMeCJl3tWFz1jdE4hKrcCbeTtllIcPZ2PJ35rEndSyZVomvHtxwmFUBOXBV2xnSNtQXR2g8Nn2VmPGC%2BEkM7D9hkueLbqAyNpiFcoJyHWThx2KUrd6Suby7GCR3TCQtKWH9SVuMUx8qjxcRgL%2F44OBnsBkwT%2BB5JP9CNXnE7uWu%2FKiYH806HEWWqeiexFAW9fYzpPabjPhJYAhYm5VZi5nNa31bjCW8sLNBjqkARVZnM6UiIcuF34I2fZUCB694ZRvK%2B%2BbDteAQ41U5%2B7RtWMW6HmVshQPF0uf5N6ULYeJxky%2FaXILxB5cjmLkob13UGeqwO%2FVrmam12U3xfZQWEwZDd833gsTF4hFBGel9WpBN8Ys%2F5F59CLSgrgDhZsoZ%2BiiQKdzVG1Uuqwj636rr84lhLsvHIsC9QP26ZR7iFjRPOQC7v3%2Fks17ZlJQLfNVBnfa&X-Amz-Signature=de26d634b0f94846f1af43418dd80ea6736d77f556ac85079516fc36403119b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHA56Q6N%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBPuRyxeEC9xc3K%2BhY4SEcosyBF%2FtaOQOjfa0WLq5MBaAiEA3sJKuKquvlPOb17pKiFpoC8al5xuzaq%2FHgfqFP1wNuUq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDRBLJHzntFbqNICrSrcAyiNwMvD1k7iGGwpfGDVeSOZS0AOnxC4X8nZjNGWu3DPSd1EGABpIkhmxq8BS4qmohZrwoM9HmTA%2BkPKpBhBc6vK4AzLkAZFKMfgb1i9zT%2FarNxPRZ6P3PxefCIUrzYpJG0D839tph%2BpzTbYz5S7Cjcheg5kuVs37RLmEmzlEJVFm6gnxywbaOQff3DYzJzqWR9VYQCF1HiwI2vdNk79d6UODEM%2Bj%2B83Sxh7rpjuPs2wW2d9ZUWFrhWcBPt6r9syup4iaWsvsXZqThM5tByojUdRZo2nedCp1sFRX%2B0AfxdmKeiAovvP0XZAS1a2k0zt7db9osGDt1n2iha2%2BEuNzEbH8zC7MnDgy68r%2BJVWZfeX480QMUjy3D5Qf9JnkmcD0eaz9xfjO7NWpXn67hzv5Z4wWiJvm%2FDOMKitnpbIjxaBkmd2cHHY0EhUtVdpoEBXfXWA7CfOVDZxrMNUcY4DJpTy%2FJtKDNzvqsXj0OubPKtut6jlDpbUwFfW6lys1QXRudWigLZBYK4%2B3ITAjESSlP1RrBNxU9AClW2lOBhLTKCe6ZuQtBLz4X%2BtzSh8y8Hnz6YBf3WaFi99FpohCLQGpxno0od5%2BORP9O2e6egJDcZexnP2lWl1RGiSw%2FJqMM3zws0GOqUBDQ2Aw4ZJR9MvOxFQCI%2Bpoyn%2FqoSp5%2FQS9mwzUUSuN3gWaMB2ENBYN3cqb6iAqlgNIgku%2F1ZCeL2HSjoj3qxvdxKU9wP4oJP1q%2FMAHh0MWEhx9RTEwb6cVFY%2FeiyxUG2HHOTFHv2%2Fduf7uhsVTqMqPXwB%2B0rsja5ikNSURH0ebFXubEAhRVV5RpEHTW8aPKDC1%2F2tTYAnYJa4g73aoljo6HLWUD%2FX&X-Amz-Signature=a13aff7c0072dfd106c98ec0c72b5603764f0d2a4e12febe7f19af5a0cbe5fec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHA56Q6N%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBPuRyxeEC9xc3K%2BhY4SEcosyBF%2FtaOQOjfa0WLq5MBaAiEA3sJKuKquvlPOb17pKiFpoC8al5xuzaq%2FHgfqFP1wNuUq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDRBLJHzntFbqNICrSrcAyiNwMvD1k7iGGwpfGDVeSOZS0AOnxC4X8nZjNGWu3DPSd1EGABpIkhmxq8BS4qmohZrwoM9HmTA%2BkPKpBhBc6vK4AzLkAZFKMfgb1i9zT%2FarNxPRZ6P3PxefCIUrzYpJG0D839tph%2BpzTbYz5S7Cjcheg5kuVs37RLmEmzlEJVFm6gnxywbaOQff3DYzJzqWR9VYQCF1HiwI2vdNk79d6UODEM%2Bj%2B83Sxh7rpjuPs2wW2d9ZUWFrhWcBPt6r9syup4iaWsvsXZqThM5tByojUdRZo2nedCp1sFRX%2B0AfxdmKeiAovvP0XZAS1a2k0zt7db9osGDt1n2iha2%2BEuNzEbH8zC7MnDgy68r%2BJVWZfeX480QMUjy3D5Qf9JnkmcD0eaz9xfjO7NWpXn67hzv5Z4wWiJvm%2FDOMKitnpbIjxaBkmd2cHHY0EhUtVdpoEBXfXWA7CfOVDZxrMNUcY4DJpTy%2FJtKDNzvqsXj0OubPKtut6jlDpbUwFfW6lys1QXRudWigLZBYK4%2B3ITAjESSlP1RrBNxU9AClW2lOBhLTKCe6ZuQtBLz4X%2BtzSh8y8Hnz6YBf3WaFi99FpohCLQGpxno0od5%2BORP9O2e6egJDcZexnP2lWl1RGiSw%2FJqMM3zws0GOqUBDQ2Aw4ZJR9MvOxFQCI%2Bpoyn%2FqoSp5%2FQS9mwzUUSuN3gWaMB2ENBYN3cqb6iAqlgNIgku%2F1ZCeL2HSjoj3qxvdxKU9wP4oJP1q%2FMAHh0MWEhx9RTEwb6cVFY%2FeiyxUG2HHOTFHv2%2Fduf7uhsVTqMqPXwB%2B0rsja5ikNSURH0ebFXubEAhRVV5RpEHTW8aPKDC1%2F2tTYAnYJa4g73aoljo6HLWUD%2FX&X-Amz-Signature=56a4fb539b63054c9c26f2ef6aa618bd0df7448cd398783875a068c7dc7a6f22&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XS75FJ2T%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025141Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE2d8sEtThs1p8AE20Lu8m9SlF9CMNa9aerf4qUKxfKRAiEAu7Szl39MvNXhhI32FwqSR8OKiHCZZrQ6DO3peNotXg0q%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDKXv9fqjdvLgqk6FKCrcAwqtVsTKRM7D%2FvYRyUYYgrN2GdPLd8A37gNKoRPlmtwYGcheGQXzHDX10e9H4GXlDFoN%2FXl6dpC8tAktQQY%2FwcmR8weYTMsEMFfkPpc62q0mlHvU3xk%2BYYJ1y8TYiHk0qyLPCMxiCn2INkVDj26vdymqLS7FmwuU%2BfOLZUc3tYZsG%2FbnF0bQNXkaKanbOtrcmjvNhCoMZ2H8tsJdaiiFvjsg8Ny7PpCxW7lECNzvTqDCnNYv%2BTBEAYgkD1XASOwWoeBH6ooe85EfFWklYqvoEIaPOe9WY2xYybGMKej7mSEs51GsTHn6o03c8QDr3V4u07XgaidZk2wICt0TtGdrT6IeoqNKqwUZm85GgWEbz4uq8aVuiKQLI9BGRlx9EA%2BOpPrYHIExCZm6PAqsmjvqL9pYpLP2iioEqMS1pCNt6gc%2FbQvUiAPvSBADN4sd6zfB0z%2BwqZ3gesJ6igDE89QEfI%2B6ayrTPCR6%2BPl7NSZXG1CXwj%2FW4T3gR9KgAZXRXF6qeMm7HClJSGPwzkTe46znQbWcbmDY0seGTVt0ZckL%2BHRAAInmczxLd8dK04wIoBpYPd0l2ESphZr%2Fy%2FY1njMF3CDXFCe4F1A0o8ZbOiKTuBp3DKQCQ2WBwOZZlmojMN%2Fyws0GOqUBflbcXynFlFoffhnycCo%2BA38sxoIDYUY6o9cbXWKmjUwmc%2Fn98RMU2TKJRdYsvezHEqFBrZNKJQTeygql7YgWFaEj4kD%2Fu1Q%2BPT3ism4oxDyP5STN0p5lJC82VWsF3FaafwFx%2BVM3F8tPo3dY8vX1KTbNmKEOnsYnabVjLt5wEPdGe09JIoVvlWi8K90q92JItOjo44cmF1li3LjECCmT6YXuB2Cu&X-Amz-Signature=8bd4207dcb57944f5471c3175766a379bd42e6386306df31c55aacf44f06fcd7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XY6SJHXT%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDpyED0%2Fe1KTr5btwSIqNKuEPYdqt8zFKsUFfTDhfQS4QIhAMlTRqwUdPC9rOlay2ZmPOyTKR2WISH1%2Fe6vEdJpXhIjKv8DCFIQABoMNjM3NDIzMTgzODA1Igxil1liKP99SUuyGf4q3APIQfw9IX43iRWvYub3PMJ5yVAqZpI3gUns%2Bj67V1Mf9YiMkbS8Jv40iz4FXnUSmxvN2iR3B4i7fqACDBPajgUapGfOoXBLVz6klGMSxeosfvtoqHUT6P5Ync7y0%2FpPHH2AoVSsu53TBWDw4egSZfs%2Bn0WYFOuSqE4oVgp8dWfdpstDlYZBb0b0wTRtxE2l%2F1QOxXPsHCIq5RhqeqpIdyXC9RkdXAB9i5uj%2FHnxNv5vyp5G6bc3LKMpTuUeKyZVK0LNN8EAWteiEumXJjjJhsmid0iMtZvl%2B20MH04SQhZAoaX%2FgcAZg6sFagLzduKRP4SAl1%2FF%2FtKttcoOfwvdh%2FPCdNC%2BTDZZVjGxd0XXkqVYOyUSGHH8E6Kcer8%2BuJ%2Fkpg7RLKFiPVZ%2FE6MniPGbwVmOIgUvW6%2FhJhshR08359W%2BttJ7XEGG7q8ubLA%2FtTWigiim%2FbD7OEEAeglVkGLC1LZ7l07RHSh3cbOrV%2FDJvyE2scjYM9py0APkrJEfzpKZtCjRB3s%2BAbqGc3E1%2FAe6gUoAJXGixvAlscnDsHb5yL%2F5yQb3BBbwWefJkAgQKgVTZFTygGxAh2PjsKsQLWhZ14xfJ3ZvN3bxDu0pCFEsw%2BR7V0KFLxU6VwTjLqifbDDK88LNBjqkAYyeQtkreefAwgtUzw2eD1Kc%2F%2B26fU4mhlmmZu5Cjk7cc9lIBGnM%2B294kXmEgAxC2G1epFiotIwC0cdoN0UIayUlrdIYxEIaAUXyKtBDkTj6qonkWlRm5%2BCOw7FSggB9QCuKd7Ry3%2BmwOJfbqlYDp2ivLQv7esEXHgRMo25oVbv6w1O3rBdOSAG3ja5yjXzLGx%2F4PQtRyNxdulzGt%2By3gIqDVDYV&X-Amz-Signature=ca46a7e04bf850ee04ea33f337588ac88983d81f46ac10c618de490e8c4d4d83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RORNPSSR%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025146Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEgJEhzMgJJN1Fqo0ZRVvuBfHzEVzPkNeeQrCOgn%2F0psAiEA2hukJXel3qaHWWtz9zUv%2FrkvGSHgjQwTlwtWsgvHarUq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDAVt0rNMR06TDip%2F0yrcA7seY%2FGGnOQvY9MqgOSv6zUiNWbw786P0r4YHMmhnRAzzs51heAVTWASiNzU6lYv390B9H0SlFOQMiIrOkbPUwnGPrbGBfnBlarwDlCUvYDXmEaumUJcVnxx%2BNNSbmOS2nAEhU%2BSUfpedUC8i4y2F1gBNCSiLeRnKgxwBHA1d2g94pWs2Rfb0Ja3uU1aLWUdY98QDQx%2FYDB3SynBQMuqA7ZWMcnB6HjsnwI2Rq3ZqXzsGUGWwiUSqkjUeyZ8S%2FDoMB%2ByJ6p5Hg%2BuUQqVb8prmmfbj6GJasws4R2wzqUQUxwpsh7Ng74Qfvd7w3oYZwxm%2FHn4ixeS3kY%2BBCUeR%2F2pbA7nCIKEdtsklPYK%2BlCuQoCn3ImpLmKK4dEt5Izq1PDkzlPSwErhJCCnrMXKTQr67GTEMBqQmtHiLAzcvzEvJSIGGRw%2Fz7uxeqegTwkY4B%2Be30qt9x6v9LnmZi%2BiPCIPXfuyrlcUTwjg%2FMmsfakgy8mNX3ZtyObp71XwwKDC7NmVcl5tIArlRlb1fw97xo%2Br38RL3b48EFks2wDAuFCdpWgSVkUd%2FWkeu1VttAJDMCxMAzjtC9kQlkPpI9fRM69GRFCVbDnBRbUw%2BQIV53jODgMvtUbt0G78oRJcpmWhMOLxws0GOqUBTY%2Bt9%2FRlCK4D7%2F5HYgPVvrNL51SPuXasUjJaRyyLhc40fYxyesWsQn5IbhZKTM2AhcOHwnoiqMS5wVZHtX55%2FsnAOUczkyWl6d7s7sRjGJX3SdvOEh%2BJv565zgmTJD%2BPArSNtzAQDNxnBSVlukyqsW7fWhIG1TI3htUkoYWiBYr90A8oRHrIt5waEjYLexUiCb2JRQVuNpti6IJYAQPavpXKhjyf&X-Amz-Signature=191055c2d3634c956e5740903e1de91afacbdaba9a956e8bd3785b4b19b93d42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46677MNFEEP%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDBGTWIMEhzI0H96c5Gx6ckshwFufZLXryNyZfbF%2BU35AIgBAahSXObeNDUiYy5qUQUqkgxyCxjxyPnrPLFBAkQl6Iq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDIFe4%2BDFtdVyHzL9HCrcAyk%2BQSJn%2Bh2eauDE4c%2Bf0WdE6ktuC9alyrsnryKP%2FwuLkv6eOpXdw2LPfLAL%2FVVBUrY7NjxaIWcSRvTGrpdPb44SSrdA2%2FU4cjJRLfG1RjtCW3SHsZ6qNFdqbso%2Bee0l9lb%2FFI5TH4D1Jg%2FBTg0zd%2F2QcnYzOhAUNGoa2IqmCPXaqcY0nTxou4XQFXa1SWm%2FSTsYZ%2BWWIwp5yjO%2FwuCjj3Gm%2Fn8FaPbgsBGVXmrUfe1KZVu4ok2B4UxREn4JpcM6TcEiSqEBVDfKrYq4rKlbbcBf8iMYK%2F9y6ISs8mQYFGwbofyQ9%2FNgUbgWmzJwDhsUdinvDQkV72pG8BKz7O0bzJEL4tfrL34bw6t7KrQKgRf%2BJLLR%2BcgFRhw2dtQk4UQfPhUkKbZfSoRoYBYR99hWf7Wy7ha91YAna8X7txPCc%2FHnbZeT%2FquK7KlZGCtq9m1VHxDhbhOytOp3Ke%2FoE6VBpoxKHjcEAL%2FumXNCiihW9Dx9jwoAU116WB1Ox0SObYE8KWGpBoCsT7%2Ba3WjAJXYX19WdnGKPcrNimCVqrnu7y2H8kbXbDpopKYxySW4lM66StSbFdI0EcnGoWinlw960S3GhONqUxSQ1OZbmcYUs1h9wCDRbg2yEkUA5RFk9MI3zws0GOqUBAwu83WxxT78%2BZM2wdVl8Sg25X7fYg6z%2B91KSdoupG6LDKXqQ1i5gtVbcyDXD5rMhARbO8TSt9zXnMX2auCrSZb%2FKHJLyFz2PgbjJAdYTH%2BHoD1mtmnEnGeyH2IOWuELqH%2BzquCWOGgxgFkrl5GhJy838nr6OWqJtH9IA7ogqLSQlxqkCneUPmHDUJXB51a8XAEoEPLhmfun2xBgWMBGBRo%2FEgpsy&X-Amz-Signature=d132adb68ed6d8a865aac0de7bad1a4ec87fe0619a7d2e7c5f7f49f359e838bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q3YMJULJ%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDc%2FEdv1d%2Btz8syVcFeiaaFaSwOzWai8Sdk1ukIthyUvgIgXunUV34KwxlxUKNv%2BcJEzCqybOV%2FS6hhI6AqB7idD%2FAq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDHAugF2HjklMM%2FByPSrcA9SFMUPNHzEkgdCeUdCNQXAAuVBe0R8O5pMmSdhSu4MlwAGMu19MuREyfRXCkjpL7AKgHWpBoKBA%2FgLIt5GfXkKywWGJmLoqSIhaLiUr0CRD8Fu7%2FwZLWWGtTbOMW5d83d%2Ff25eKrrAKWktsqg%2FUDUOsdb1c8S16Ne5Uj7xSJvC70pHdqpPHxnQRLLlBjCjWFbkdAiYfmFQn7xUnd00Y%2FfbBYASFNNHl2a2NQDgazocpyMLTLldTq7awFUj6MelZqIWwJQ3Z%2BGlQdNMBBxsKHjDOyu9RtTJXxG6dd%2B69HPFRCIzlvgXKL7PIw3GReUyf%2FZHEYt6ApOC0VWgxn24gn2AqIsN2RtwoOKNWE9mLeYe%2BzUKRwqfaWJ2YRmDHsaXQVTgaG3HuunptvBMjll1Ehqi4QfJyhflyu%2BOTViLuGPSIPLodIwBzEozr4eCHEaR%2BThcvPE9bUJFz11%2Fa%2F1vkNE%2BkUZir4o0XhSEo3iSu9N3HuG7MX5f%2FYnujLynPCgovXq6koEfXA9N585fnrg880uNxevbmQaWYbLaUQ%2F6WGYwsrZ0NBas6f9rbLRCwQ0qTm1whyMdnIf%2FHx5Q%2BGZFkWTig3rjsR6AhXHv74u87Hodq9oWoO8idy6oUwEgfMJbyws0GOqUBa2k9xYiRmCjDEfht%2FiqjsVYlwYHRuiAJ1jQtPHVGC5G0bRVvqYqTglYltmUpzB59%2B33d6L7LoqeTKMsHIpC3nj0vS822yUGgC8fvS9iLcyhBgQsMRLzI7RkkxB0mxCCORyQ1RXHyXh5r5iyvC%2FSVZfMkv5L5pTgydr9cvo%2BwY6wZlWrTZduMfSWo40yFVYTd84TbuaW9gdlaGxaB3Kuw9tp8WWsq&X-Amz-Signature=ad9f933fc400934063d61a46107f5af0cc5b5b2ef99e3bac83fb84acf4491378&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHA56Q6N%2F20260311%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260311T025116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBPuRyxeEC9xc3K%2BhY4SEcosyBF%2FtaOQOjfa0WLq5MBaAiEA3sJKuKquvlPOb17pKiFpoC8al5xuzaq%2FHgfqFP1wNuUq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDRBLJHzntFbqNICrSrcAyiNwMvD1k7iGGwpfGDVeSOZS0AOnxC4X8nZjNGWu3DPSd1EGABpIkhmxq8BS4qmohZrwoM9HmTA%2BkPKpBhBc6vK4AzLkAZFKMfgb1i9zT%2FarNxPRZ6P3PxefCIUrzYpJG0D839tph%2BpzTbYz5S7Cjcheg5kuVs37RLmEmzlEJVFm6gnxywbaOQff3DYzJzqWR9VYQCF1HiwI2vdNk79d6UODEM%2Bj%2B83Sxh7rpjuPs2wW2d9ZUWFrhWcBPt6r9syup4iaWsvsXZqThM5tByojUdRZo2nedCp1sFRX%2B0AfxdmKeiAovvP0XZAS1a2k0zt7db9osGDt1n2iha2%2BEuNzEbH8zC7MnDgy68r%2BJVWZfeX480QMUjy3D5Qf9JnkmcD0eaz9xfjO7NWpXn67hzv5Z4wWiJvm%2FDOMKitnpbIjxaBkmd2cHHY0EhUtVdpoEBXfXWA7CfOVDZxrMNUcY4DJpTy%2FJtKDNzvqsXj0OubPKtut6jlDpbUwFfW6lys1QXRudWigLZBYK4%2B3ITAjESSlP1RrBNxU9AClW2lOBhLTKCe6ZuQtBLz4X%2BtzSh8y8Hnz6YBf3WaFi99FpohCLQGpxno0od5%2BORP9O2e6egJDcZexnP2lWl1RGiSw%2FJqMM3zws0GOqUBDQ2Aw4ZJR9MvOxFQCI%2Bpoyn%2FqoSp5%2FQS9mwzUUSuN3gWaMB2ENBYN3cqb6iAqlgNIgku%2F1ZCeL2HSjoj3qxvdxKU9wP4oJP1q%2FMAHh0MWEhx9RTEwb6cVFY%2FeiyxUG2HHOTFHv2%2Fduf7uhsVTqMqPXwB%2B0rsja5ikNSURH0ebFXubEAhRVV5RpEHTW8aPKDC1%2F2tTYAnYJa4g73aoljo6HLWUD%2FX&X-Amz-Signature=6faf91e4ef20073656787243fa4a13d7e7d8f9b4285e84797e014fc568353489&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
