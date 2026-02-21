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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z342QLLN%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024838Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBd4yirQ4TtsLiiAg30Jn3WYtQxuZ3bMTIkyeQKQdm5fAiASg%2B%2FNvQo%2BIg9ZHTmtJCVt0b%2BJNfDhYO1AUhKE510nbCqIBAig%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMwS5TN%2FBUvXE0GE6zKtwDCwe2B4yZuLs2%2F9wko4%2BLCc3fFfTxwshvfqANhpriaFufdHEqv2c3dmo8NNjEXtzXE2Yo8VAnT2ynMZ1C3EiXqkRsNmj%2BurvuuUNgsUSs858lUP4zdEx%2FocImKVsqzXmopdlN7%2F3diIBt%2FJN%2BG8GUMNeZxkWdljwD4twRL2WWnuAMzJiUgeQTqrWwiTm2qyfFzzV%2B70C4DpxRDVv4vYT7KdWdSm%2F%2B%2BOsP31fPpl6t02%2FeLXIGulwQ%2FvRClb6xSFzHU1QVL2cv%2B%2Bu%2FSv1a8K%2FifCGF9CpfZKVBaE25FG66gPD%2FEjmetkLJV65ERaf6IApktW%2FzfQHVm6zSOig8AV7DU5z3k1nogy7xoh9Ri2UOG1ZVVMf6BJaEmptgxwOkl2xMHLmvSPjLGE9LvXH8Tn1Ijk%2F9610VBQWEco%2F1QXaN1i2VNuoFnM2SsFgRx1hJzCikEPJCO9kXiygyYrdZ3D4xOOLi9XQ1EFck5xgHcjdGjKelebQe0PbeyLqlpOCtha9kr1947kld5%2BeCpt%2FMbrwBql8QOXkeQQrenkSNFgD0xS1UmU1%2BAnKy4lAC9Sq%2F%2Bj3ySSrnAML95nfnzQnX2OF8DATZAc9VmzOI28i8c%2FGyx6d5HOB0xY59GLWRpRQw7r7jzAY6pgEdViBXng89r8g0vogX5a%2FP%2Fdx7gpneUSKgkBF%2BYopDPliTc4z4VBdoHjEYljfHVI01h9y7uoX9nhI6FHxkhFCgTBBcAKyrLr8w734iNcdlmgG2OYwmjrm2S%2FmewgISpe0tamPffpkNfeG4vG1Hh1aiETeCwczy0rmjmmAxydI9slaLpF%2B6n3SxpUSMIdXgSLbaaglOatYP7baucenRtkpJLp99jBdB&X-Amz-Signature=6aa4e7f01b80a8f336bba57e685008c60f6cc2d0e02d95c7343352b10b43d8fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HMPIPPF%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024840Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDzSHPy813fcCq%2BE5pevJnZ5uZWjrvNjoFOPV6fkUKtlAiEAg6nlpLLGtEuMYg4fJJ9NDbocoAWLCQytYC6W9I45TGAqiAQIoP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDObwZ4ZnnKuFOG0vwircA4bcMWsACBUR%2Bdh3%2FdRyjpGBP%2FotT4oQHI91dfU%2B3DBZVM2FOF4oAfDYdptz5jGU4eKGggpnnIecJAdMN%2BNc2rVyvY9UawM6pr912tdMX6jMzBcVq3plh2t718RRCgGQLTrGqVhkCIJ777kQb5a4ukDNG3UrClf7N9EwrrsOZpgCprMbre8kyl0dIox3hMOIp%2B1FpelzRjuJMCPUp8pKebojqFrptZG1NyUoOQc7EtmccXu5Z01bVyMv%2B4rOpxPY2hjWAMyFxYDgNBiWlvwVMhndmnq0BUwbtwoJqKarq7yQL7Iw7Map5kk4XkqH%2BiUVSBc8p2h3NDLrg3bZY0rK0AmFZIOh0nhWSh9JEkZ7Ke6gQ2Dc2Id%2Bm7uGCGP99wwYVX%2Fmjg6W%2BSKuErHWD1nsP2DloEc%2F09sGLCTJKOg9xzxQ4FLCG83Lfskx1%2F%2F7O1dCPzma7YrLOXrlaXI%2BstbKyPEHpoBWm%2F4HlJBadfa9dHzcHGaT3QBovFrCNVgXs88L87tXYNaAA%2FlM%2Fv0akqo062GYw7WyuFiWMCTZl9Cyyp%2BC78GHM5H01cMd30XZxBpGbWax6j3f1l4OzMKfQn6KOHV9H7SQFqRkT1TD%2B2p4wE9A06EQ7C3cFIUvsCxYMNnC48wGOqUBD9iydedCH75e%2Bt2SevcJwoVbkEbYDdfDVHNmOFo4IYVnYD5A7Ip8tA2E4IMURTsYiwnwrJn4MSU1imByq22%2BXIEFP7FeWvjuYOUvbiia2RJonGKFgsN24CUW%2BbsmrpE2B9yMaZ24DHqDOC6IicF%2BVtDEeIhK2v2SiYTgo9zdQ8D2uRi0Kh43GT8Ow44qHIlgEokkQSqm7caOTFZU9%2FZXJBZot%2F0C&X-Amz-Signature=050f2c30e031e6ff4b0560de9caa704c30fbc78341f85b7f4227d65abbf58f87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WDTIDP2F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024822Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCzYxP7mCCuT6QdiFhjkyOGOqf18X3IMLI6vlSFg4oCwwIgfrcVANbUPQl2cjolAQcxG2tuK3gtKeeHoms3H%2B4RNkEqiAQIoP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOzxdtiVnE8LmcBkISrcA1vq1OzqJMPri1XMKUrllMh05uyAnB5nHxV35U62riPX1J%2BFCmkk1Ng8CwXJXD4Uhzm5Ynaq8cKZbCsWkYJMepQmfvduuo1BRRbj4Ni3ckzibt9SemU6U%2BzDvL4DzxkyrNQ66rla9Ibzn5AaKo8JYY5LQAiS1y%2BYBEu%2BUqcEhm69brznX5BvJ6xxzxzm3v69Ox4xkmH6xWKkxRvOtcupjWDmFhH6EiMKVplT0egNDVpMtU7VsXUku%2FkrdttflwZtSEyuW57oFzDqtAUSxhwti20OF1J8sK%2B9g6afRESdyVu4%2FLtAGSNLqe1WIlLq9knrRD5NMvZeQ1EO7BZ7AKAfLTnaCe76RsXgnS930Cq6Bc%2F%2FO4JYWTSoowQBYGsOTFJCq61eOfA9D4pt2HdLdez1GpB3ZmFt3oJyaO2CkaktwDUDzmRQtktozLGgfUkBzS%2F2l39ttg0ZjDcSXKh%2F10JB6yLYywcybbZO7r%2B1pN%2B96sWH09dxGjj7FOMdgHJzUTiluSeQU5hNmMox%2BSRhmu2UNoX2AMHopMf0ssYom2jemtczN3YaL72QWz%2F7xINHHNVLLBDANUrMJ7UahAXEUl7nhle284FY0oSOIblKh3TTQUvwBZxGmkBvgVKQhttDMJa%2B48wGOqUBmcMNcYdYVJXYzjqftzzbb9urqN7QWc%2FFa5IiQE%2Bz13h6iqL3SVFYO9W65C8iCmIFpezsKqow2LbyVjKJ9%2B9vbRHaEM2SPFLLVyTjulxT9W5D8vVRjw5BWecJggztQ9zddapH1fFpEfT5DLIql0jdhbe6%2BMX5BoT%2FpqIcM%2FVavlcAQSLfnWKi5FfDaz4UPNhBs%2FRYYIKNnfN50MZbKbc82v6%2Bi1OO&X-Amz-Signature=be360df0280781718fc887906ef30227e26baf9a180457037426ffd123d5bd77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WDTIDP2F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024822Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCzYxP7mCCuT6QdiFhjkyOGOqf18X3IMLI6vlSFg4oCwwIgfrcVANbUPQl2cjolAQcxG2tuK3gtKeeHoms3H%2B4RNkEqiAQIoP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOzxdtiVnE8LmcBkISrcA1vq1OzqJMPri1XMKUrllMh05uyAnB5nHxV35U62riPX1J%2BFCmkk1Ng8CwXJXD4Uhzm5Ynaq8cKZbCsWkYJMepQmfvduuo1BRRbj4Ni3ckzibt9SemU6U%2BzDvL4DzxkyrNQ66rla9Ibzn5AaKo8JYY5LQAiS1y%2BYBEu%2BUqcEhm69brznX5BvJ6xxzxzm3v69Ox4xkmH6xWKkxRvOtcupjWDmFhH6EiMKVplT0egNDVpMtU7VsXUku%2FkrdttflwZtSEyuW57oFzDqtAUSxhwti20OF1J8sK%2B9g6afRESdyVu4%2FLtAGSNLqe1WIlLq9knrRD5NMvZeQ1EO7BZ7AKAfLTnaCe76RsXgnS930Cq6Bc%2F%2FO4JYWTSoowQBYGsOTFJCq61eOfA9D4pt2HdLdez1GpB3ZmFt3oJyaO2CkaktwDUDzmRQtktozLGgfUkBzS%2F2l39ttg0ZjDcSXKh%2F10JB6yLYywcybbZO7r%2B1pN%2B96sWH09dxGjj7FOMdgHJzUTiluSeQU5hNmMox%2BSRhmu2UNoX2AMHopMf0ssYom2jemtczN3YaL72QWz%2F7xINHHNVLLBDANUrMJ7UahAXEUl7nhle284FY0oSOIblKh3TTQUvwBZxGmkBvgVKQhttDMJa%2B48wGOqUBmcMNcYdYVJXYzjqftzzbb9urqN7QWc%2FFa5IiQE%2Bz13h6iqL3SVFYO9W65C8iCmIFpezsKqow2LbyVjKJ9%2B9vbRHaEM2SPFLLVyTjulxT9W5D8vVRjw5BWecJggztQ9zddapH1fFpEfT5DLIql0jdhbe6%2BMX5BoT%2FpqIcM%2FVavlcAQSLfnWKi5FfDaz4UPNhBs%2FRYYIKNnfN50MZbKbc82v6%2Bi1OO&X-Amz-Signature=13c20b582b4353f140b7d3e05c7b01fcd73beab29eb20179bacb445ab35e896f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663K4KF5RF%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024845Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCmF%2BNbmKrvHGWl0qaM5yHBsvZdQrB%2BchCbOKx4BvRmdwIgVclk12O7RdJUDWDxbE5EpHH9PvpNPPujEiCiGDNi4nwqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHFXvKZ%2BL1j1cHrnTyrcAyvjX7py%2FK%2BsBoE6Grkk%2B7%2FcI6G1sqIgOl8545e1E8qwAP198PWvAQE9v9elc3KNJy6ZVWzxOrC9wnT1tmFhYWTNzPFp0%2BWxoGwo8xZpgabxko5k8TZPn3Mmm86m8BSdG1s9s2xDlfKQ4mYn74X9dKn7vT6cE5gsEboc8L7ZAkNVZLLeuHyV7zJxRI1PgKELpTUWNhFIKStO4h%2BEKXFHGfIpy7R%2FY5kbbdCYyVfRCvYghGLl86WRVzxebF5pHivnzfarwQhfA%2Fd8C1Eb3zOOlVrmzIdR1RKJgpQsAqNWyEwUor%2F5VaqiShzsVHGbRo5AMVwP5CBhAarZetst6fpdvfjmkFFMCCiIze6X9moUdqrN%2FzVTWb%2FQUDa%2FBajLADn8sS6JLA5wJWW71qh6DWw1AoO79%2FtP4OZYmnMHfZ32VhyYX4YwtM5snxVcymZ4SLH4C3QQXs7JiVfU4FHADB2H1iYWegEgM1cDXcA1XZZYhQo2GBLffXFa1NlL9INXK910bjP4y0klbjftfv9QipcL5iRzn%2FAAxO6ia2fYkDBURycxxgKVWeZ7bb8tlarpA9NlkPKGqKN1rbaqWH%2BBdVHRuHAgxU83jul7SrFp26I%2FxsjbhNyd%2B0pyeBlaPxQIMIm848wGOqUBsCnf%2BTd%2B2tJLdL%2BmsS2aCovLziPIr3kI%2FR4%2FM5ittBhYJq%2F7DL8i6%2FG%2FNiJDEQ9R7vxqtAE59nBtPyiQFwUv6nwoeoFEpCHbgVGM1n%2FeD8aIS8xWB5AQMeOGb4%2B3oNCn%2BFskJnXAQvzicrrN4aMB6Qgxvrgi55FihkDJshbii%2FS3lcJzrhcJNjMbk1qUV3jq8EEyYuasMpSHWik5lKuGmO%2BOO9zt&X-Amz-Signature=06ea82cfe95c3f5ef46b62ec82da84b42577b8645101e448e800d4e9597f752c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RFRUQNG5%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDfTQZwQF%2BmipzIxS3o8oSNubqJQzWnGkh7pyIZHGc8QgIgGUoTJ0TdshojkYM8XFeDcF11%2FK9%2BGxHRZswxAcXP%2B9gqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE%2Bg4K3S9TyIpfUcTyrcA16YbcUxv%2Bzuxl9UkKw0Ed5IxzqjIX%2FqMDvApxdljZexLj%2BeETawa%2FeuNPWoxtkppT9F9MMA9SQa56t1ejkscTCsEnrL8E%2BUV0xXhFpsH4StGg2FeiE4rzYmD7hLeMtd4TRNU737ArS0aTUpl%2F1GOfIW4J%2B5Fk5hv3OFbiMoY%2FYM1jpnO0ChAbTwOMzoRVTU4caSQbdMcZhfNKa6itQPyloECuTj95Uzijxy8ZkmfLSsXsSXyJbDTJT996TUvkzl8UPK%2Bfvs2%2BUvUAWoio9QD1uvcHItKha0%2BAJlkRREUqVLds6PnXYogA6ZdrnxTtUP8RHIbW%2Ba8Gd9kCpdBvS%2F8r9GR5GE%2BFdYX9bHe9Jkgf4S5u%2F5xF78IemYN5LHJLsWaCBpeT8jCMW5JoeALQJDY1HAWE6gBKrz%2F9SXbXReBzAuKvdZGKAlCRS9Zxc47GTxaHq6k65qjL9UgD1V6fnaOlB8GOjQmySwInWb%2ByZLqgKl0bit8GGVo6PpmJawdZP5NShqXSWGjFPjCeh%2BSZBlYRxb2xr80FFBiZ9q%2F6A3SsqMDXCB6PJw1OwpZ612fPN7JWh3lALR0pzhQkcvOKHDfrZLb4avAGOk%2BwgSpcM8usqi%2Bcv8sTDnSdVkb2PFMOS648wGOqUB%2BGnqMnRhpyInpG8uQNgQaRsWwrOHB6RdryiV%2FclKZ28Cl2bTDx7nymzEL6graU5xYdZjXWKOr1NjIIVjEF0LTz%2BiPkHEEgYsCyKDVHmrFKREglsTSGVe8Zm5VXg6HdqkVL6Huw4B6dcjBGvhpAt%2BsF9jAR9zPxOMc5pEUVtq4t9MYY9uiiAeV8PlKVH8RQUaoE3jHWAK2ZCCriPtRL1eyo9IxVHV&X-Amz-Signature=b0bbbb46e92d6fdf7db154b8226bc1e579d7357c7c91649f7801b6df84c4f80d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RL76MVZA%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024848Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDcKYm%2B5%2F2pZCwmXepdNpYf1T50TMsU2%2FuoYy2SD2VXOwIgD6HHsWECRsFAQSoD7l5lMg4MaL7uT4IqpLdIMJq7kFIqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAKuwTorGvA5TWhrpircA9%2F%2Fr79OVGGvvxDoeYTdUM8KYmOjcedcA%2F3XCws35LIGIqn7qPgmmNhKxCQ9B35xSXNEI5K%2B2ytcH%2FPD7nU98p602OqQXWDTdUkZ4pnco0h5yKAYKWo8KUaqfbtZGgyPLVljtgf8VgEySAPBleS2oZ%2FU6kaFQBEbwxjBR4Io8OT7x4Ez5Ej4EkgwSjqsKQCMu9baKMs%2BQCCGdHHO9xlNtM49UMG7qdqCBo3rVQMnQmd6jP1zWAJULDTjwP%2FoEpkOore0S48oHkONwFR7miSEzlA5WatZZ78urdPeKr%2BiycFTS42aGTUX1axfX%2FMqd2A0ZKIyxIOwohGau5eF6xFQpqxg6XA9UP3LxAEYXRQfYij1%2Bz5K6p2ajFClyOL0MiR6wXlbhEN4xUHSzZawf08rOVCmhrq%2B5cajMKhNiCE5iz1uon1lHl2QMCRz6AtmwLc8I4eK%2BP3ldtlFG%2BZFytdvlFNQREIUhkhD%2BkGd3xYdsJ%2BYNq5pkIrXKxyAcxg2qoafSpscJnDHNI5Qxu19uUJCTmwoyJ2KRdzX6tNCDPuFuyhgVPHMksENzJyDc5OEC9LjMl%2FZ5YQYSUuFNqmJmsWDgpacZ162SBy%2BZSMoV2FMHvpVNozwFtFC7WSCSoq4MIC748wGOqUBs10jzrJ%2F8ziq9TRFYLs3ARbaEoJwTAn1x4x%2FzmNKIBQs%2B24WaosH4pzoJDrZ6ZBGjm8IasSW2vRjBOHwCr%2FxUYiV9ApKNg63R3blI%2BzOP2T%2BRqiTmYIfFJHSDdj26H%2BUgSBkLf%2BJrVkDZ0WF21a4gnpOaOmmK1hwPKlX2N63%2Fr1USmFTF7IsHA61ZbXKfvoTcasj6rnNYIysaLpEePcTEiODL5ud&X-Amz-Signature=d1966295454e1584989acca38c5913875c1a9db38706410e84bb4aecce4f6445&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQJYLNVJ%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024850Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCjCwCTLmpMgfZ8Xk0dcWfLMcPNFRRRwT9orRQfXXn%2FJQIgIoZrVuaJZPruRsQBKRiygUrUXomq2WZJxfXMnquAM1IqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCgnB9jUw%2BlfFV0BxCrcAw9zrMuWsBp2xOS08rciAiiKy%2BbCiK2M%2Fgb28%2FideX%2F15JSufoiTuTHcqCSr%2Bp%2FLRRb1Gi0z7ChfxAiyTHowjaCNn5gklgSEdswbILBTOiFx1kx%2BoGY%2FkAVUne%2Bcd34tRp2wAi2O4MGvKKyzK9e5mWJZLz2tDNwZpxiN3zUEP0tflknag8F5wFp1DL62J%2FAO2F0P58fJjkjDq%2FsDfnW2LfK%2BCAyBm9vIb1uiqwkWEJA8EZ5aD7cpx1iBSKWt0XudihSQx%2FEef%2FPVRdmcxCaOUJcEU4ILL8Eqwch0cYF50MuyIBS5VGjoJeESIIXTQpn9HOXxuVpO%2BBp6xAmjMTecOwx0VDFC94bid7q1IuRr2V%2FBHnyJtwbALNAIq%2BAi6dL4ftKufmQ5mWIUOMNRxs2SAb5Yd11EDEyFPH2j7WDcJqMoTHKGqT0BAvHyB6%2BlzXS68HS6r4wNpUmZHu5T8sxLmFR3m%2B%2F4P26IlQIYaAkEqMZBC8Pzi6uZgfgoeb0qEeBP8qvKlyjKTwMb0%2FpcHErsGRilErdiuhbRXdWN0st5SSoSyB7k2er3YUo7Iari16q8FNb9uwAa7VFtEquwMybr%2Bub%2BsApqtkriFZ8jYc0E2oxMVIS%2FeX4O8FAX3J9QMMm948wGOqUBtcrnV78i559BtE8ByVXXCHtucTOjwh8Kz8PypLvdtypH5pcz7vlXAS9kQPIKnyeALOKD5Dn%2FtlcQKQldtSEjN8cCZKDM%2FBxqZdbluMyyVsDd%2FV4XF1TD%2FD2LjBFlOo%2FM0MShbVTlH%2F29u9CunRUKy9FntuJjpwy2XYkfNXjP63Pc2M%2FV1SsKanMA7V4IR63cCtdlwgCmvmJapyMwJdGeqpIuUBOG&X-Amz-Signature=44997b6695e3f7f51f3d7063451544360224825b90931451a406345a067ba0ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S7RDDU3Z%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024852Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAjN8KkTDp57H0Pdwf36HMCvwv4ZRzsSPkEmxBKjbu57AiEAweMioUZUqJoCMNM%2BLABu%2Fd8DRg7aEXlicfKWpV7u1EgqiAQIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCTwTy3yQIGoRifKFyrcA7C0mAqttKUY%2B1RFysbFPum33xxns75RGz7ViFB5PKtI4n974kJ7sMB4LrDtUuC0yj%2BvyAeMvcx%2B3a1jgiiGR%2BrBrngciNo5pRKAd6jXavNevIAKkrhBOykOIzo7clpfdnjSw7AjIeSZEwXDfLWlSAyTuwzmctP2ZdMrwoGpZdET1anKPWjU2DI2Euq686sDJTRpjta20nGG%2BQGGiSEb%2BaWHcidNgY2zOHmAYtf5RgJxuEExovk0M%2Bj5PlWYImcxuQwkg7SlS1TsI2OzvdSqclX44tDatPutBvIh3ZrvDNdanrwAvdVub9rINiMJzF2P7M76gcWsEpCenlTkZxgC85DnAS%2BHfJAUpcUCErx%2B%2FeLIO5LvbymqNBbGygBmMRlV46IiDUX10FTx4EQnIZKBzEW99RvEJ1WLO1TNfFJKnt3T76GqpOGP352HCCqic7tuDfqzezoqYIzA8DEj3eBlojQJcmy1cZB4yIWQWhtVqTpdkTl0JXJTPnZiYXPITcFib%2FoqxNDw3p%2FY5uKtCIhz9ZpGFImEaNno4tui8D6k2I1GL1YfBc2YZQZGc3926oeZqlYjC8zbYUZII0iGv8f38nBFlUEGdy6i4rC8garKQKjLugS%2BL5%2F8S%2BCFk%2BbsMKG848wGOqUBHKx8%2FTT2q%2BhdrrkfGeIgrSIre%2Bh3VNS9MCtf9sKAycScJvPgGQQ6g5HhIEshkgQxjwAd5ez6hFrZz57189LUNAitO9Jl6wGfAhOnlZdG3G8qLylCknj49uKnpeWxfzvZPUOi%2FjwV1Wd6gfZTALaA8W5sA70ebLAL1eDfYYz1yhW3b3zoN8EOSGCBvzwuMqZ625pG1dFYnAh67TJjzg8Lz9T6anvV&X-Amz-Signature=b1901a487db0d55ce1083f87912679128f1151505c8360ee152809b58a1f67b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WDTIDP2F%2F20260221%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260221T024823Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCzYxP7mCCuT6QdiFhjkyOGOqf18X3IMLI6vlSFg4oCwwIgfrcVANbUPQl2cjolAQcxG2tuK3gtKeeHoms3H%2B4RNkEqiAQIoP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOzxdtiVnE8LmcBkISrcA1vq1OzqJMPri1XMKUrllMh05uyAnB5nHxV35U62riPX1J%2BFCmkk1Ng8CwXJXD4Uhzm5Ynaq8cKZbCsWkYJMepQmfvduuo1BRRbj4Ni3ckzibt9SemU6U%2BzDvL4DzxkyrNQ66rla9Ibzn5AaKo8JYY5LQAiS1y%2BYBEu%2BUqcEhm69brznX5BvJ6xxzxzm3v69Ox4xkmH6xWKkxRvOtcupjWDmFhH6EiMKVplT0egNDVpMtU7VsXUku%2FkrdttflwZtSEyuW57oFzDqtAUSxhwti20OF1J8sK%2B9g6afRESdyVu4%2FLtAGSNLqe1WIlLq9knrRD5NMvZeQ1EO7BZ7AKAfLTnaCe76RsXgnS930Cq6Bc%2F%2FO4JYWTSoowQBYGsOTFJCq61eOfA9D4pt2HdLdez1GpB3ZmFt3oJyaO2CkaktwDUDzmRQtktozLGgfUkBzS%2F2l39ttg0ZjDcSXKh%2F10JB6yLYywcybbZO7r%2B1pN%2B96sWH09dxGjj7FOMdgHJzUTiluSeQU5hNmMox%2BSRhmu2UNoX2AMHopMf0ssYom2jemtczN3YaL72QWz%2F7xINHHNVLLBDANUrMJ7UahAXEUl7nhle284FY0oSOIblKh3TTQUvwBZxGmkBvgVKQhttDMJa%2B48wGOqUBmcMNcYdYVJXYzjqftzzbb9urqN7QWc%2FFa5IiQE%2Bz13h6iqL3SVFYO9W65C8iCmIFpezsKqow2LbyVjKJ9%2B9vbRHaEM2SPFLLVyTjulxT9W5D8vVRjw5BWecJggztQ9zddapH1fFpEfT5DLIql0jdhbe6%2BMX5BoT%2FpqIcM%2FVavlcAQSLfnWKi5FfDaz4UPNhBs%2FRYYIKNnfN50MZbKbc82v6%2Bi1OO&X-Amz-Signature=e92fc9f7f31127d0f79593cb7c752139af783ea7f91a55b3ded348da250555bb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
