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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667R6N6ZC7%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043723Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJGMEQCIFT77tgOheUFv6JTrsJHA4b7FTlXOTw5u4ZZVkciAL58AiB3dJESJStVQIqsOXeIrfoxLOyBzcIrbs6cZsIBBOQN7Sr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMg3t8HByMdNejCX8bKtwDJD9NHGMv5fqy%2F%2BRoL6NRho%2BRkyHfigxPwTZ6%2FhrtoQCFCBhazT50mNUBQVDiOYDnlEI9ZJsYevGgOADwGvlstBjcXIbmSTL1SVZWc6nuN%2FVnDMW%2FgGMvzWFeAUHx6UUElbG6M3KAlf34mpAsMML2qKC%2B2YjmKcvQrU%2B5tpxI1%2B4jFKxpLswHZ%2FiaoLCw8S7qQUYENGn28SDpTOXzdRe57LxQ5Uj89RWacxIB5QAOfY4Qj3%2FaViz2uzNh%2Bns%2Bjyhpo8URlDfT7UEv%2FfGIctlt4itK%2F5L4c3P7FVgkM7PnSYzjLU8GdwhGN5S6D7hg3zRLpJiGRtmvGrSq3v2KrMkHbd5f8YYNhN%2BOSCbj6x1pr7e94X7DqK3LagdV4vUQfDs1u7Auc%2F%2FWeTpGN4WDWOtlMeap4WZemoIjXAftsKe4o%2BuyuqwOOl%2Bv%2BkjzoVVuet98p8OGr9YyCkTieAkgTi6EYJdC7LYWeiDpK%2F%2F%2BOsyEJHMtBdh94BWOD50wv7wiyKZpvKSHZ4lcWScQ1MozZll8DZMIcp%2F6GIhS66nNXLWb%2FRpEBfjXjwSPRVacM%2FFWKPg%2BiuG7%2BV8mtVClORlKR2euADCLmuNzd3sDMsFf6%2F9wZLOElfqqTVW3gEzq8TgwhLK%2F0AY6pgE5SIUU015mTGunAyleAR9cRM3jPd5ItP33NF7HKzZitDDHB2hXtymQExmd209SDD5j5XALS0M6%2F8SIkrk5qQWQOuctUqxhDAuwbLdGDudK%2FIGInFsEMBLybfKuX%2FQ%2Bx5GbmgtAXo8%2F0%2F%2BRT33V1Nt8vV4k3AeMpRoJ2OrFdulAwME1w1JWRRaQ8cGf4FYnFISV%2FdPCjT6ynunwZ7kI%2B%2FQFPEo9T0LE&X-Amz-Signature=b8b39dbd7b3707bd33e36334a88363145fbe9c2ac657809d171659844738533c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T5X3K4VH%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCIF9fBlUGKXw1Fvri4McX%2BFQ5KOoJw4heqtzmDpSAY21nAiBik1GStkP6ZT0SgWedXYZ9Mohip15A9G1LFHqLNb%2BUJCr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMAa0dthXuu0r%2F6A81KtwD9ZdaS2opg6CdqC4g8ciSfpJvBJ4%2BAnaA96nUdc%2FaaMrboA9v8deWvvjKY7rR0n4BvZJz6fJkrANeTX0n7ldc9j%2BIPm2pN0yx%2Bl28yH2GYDU5ZydFu9m%2B0%2FJfEgdq%2BGSipF7QzRvxGvpoMp1ETibIkTUj2vQrB73VP7kc%2FG0U%2FcnG%2BVFhD4Sj2D%2BP1aQKZiP7qviEyeg%2FPQ0XHTDICslKJTRcQqFO8un1uhgyVbYMxB7KAigvW9dI1DRwSAsbsyeYkHceY1DeZ29Yr7H%2FZVzQwyC3gNX5%2Bg5YwC67bD3Tl8xisrht8gXqKuNplwkyEts%2F9wbvHRgP7A52NIgISPK8f9lvBNiRt9LPGM4GaGp3Svqza9hO3U94JqTvWfls%2BW2FAyxaU7D4hZCO8Qnr0kVJul9z1gv18jeYslucPsiy1IbN4JEP8KiuEbr3GPbj76%2Ft9sN%2BnCwzVlcNX6uoQjqsRN0V4l9%2B0WDCHfT%2BzX3PLTjIbzeXiGwcQ7%2FEl65Rk%2BQ%2BM7OlH7R0wZO%2FOrU4Kofno0Y3uLhIw6t5NshEm4nN3E1NZUKW7U6YMA3yB8FjubRACRmGigehozp7cJw8go%2FyCWxs4u0YhPrtYLz1hXLRdUm2Hrixx12uzIak1kYw%2Fq%2B%2F0AY6pgH3p3mbcM%2FO8Oe74Dbb%2FhTQQcVRaWefKZUpxPk%2FP%2Bb%2FxJ1wl%2B12bpH8FlUmuT13OyMvyRe1l%2BF4EYcu2wuqYSM6jph7rcbnQM1EbldJeQxFl66fskDYg8ufccS9SQxS8ZcvExR8O9JN8O0F6gEDKzgjmg27GSVznByCgaOQ3nm%2FwWT38REFWPlUmp46%2B5zAkktuHdfcCH3PJ%2FOUGmIVC8XmR3SHgztU&X-Amz-Signature=2fd683dddc97b5bbddfe6afe5cf0035476d12660f81c95d3e5f2bc058b85dae7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UCXSLOXA%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIAhIX6rjLi20Mr9cCtzy4oJzG0veSzhXclLd8GV1likCAiEA%2F2XnDgZWAHFTUjb9RBMWqK5XVSD05rm45s21d2JwBg8q%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDLNEY6rfYWC43dOkkircAw55zwO65YjOYQAxlqbLVcQVN0veIACK1fH%2FHrWfJP2i4d5tmZa3wmjrFJ0l3q44LTVFq9JBdDkZxiMaYcMFq77lAsBTCdoRBwUvrlcuumrwNXR%2F4x%2FBwzajEAqze5H4DJs7VrjfNJpgk%2F5Hpp01voeXWWhNiOt7xwG093JyFrNp6iR%2BaeBJ0cKVciL04mUU2b7V5xP3I5kOOGOmquaRoR2jwY9KVrllT9y6XfLhsuUAPOJ%2BvemHerHn8Lup%2BOpmugSqS53H23Z8nyrmN1O2UYHU2aBHprqzgNaFlbxmoQSOnn%2FRPdG1LUqDs9B5g0Jild0OTBorMtauXf3%2BtN%2F%2FDLVfpjWXPNlWAu6gNbtMD2Xkv63bhYIb9g0skyVapfqYEudzSpA1pX53bynELr2UrYaCNMycRqr6bQg7fhLndRdOup5mrl%2FF%2B1HveJfHLG7z93fp7bGOyHzZgvlw2cQPsUd%2FICsJbXjSe4AZuX%2Fon9BpJCsV81X1s2Reqe15ANC0FpXVMbNGteMrkLR5DA3n%2BTPNHCFNL7UT9kMsivt%2B9rZiAdm2N0SziDE%2BFwydeOsuWNe17lBq8R39BVknLrtykxDArcXwt43BYGH%2FLRDRYk4EbN1GX%2BFgL%2FhkBaLXMKOxv9AGOqUBq8AX2u2mge4kahBFPZRJkLMrv8j4P1BNqXEc4BV073NN5vGYDe%2BVGmq4r8MyCMwI9xy4SVvnIpMFEeU%2Bh7ZCxbCK5N8tb%2BCWRBUyBZ0%2B1gjZEesNdgmXnBiDIhsfmwNDFsDzMeNTgminj234hohPL4T1hZo9LCLUUn4Y9HJWGvivVRgmfbYkteB%2FIIFIEyrrPAm%2BRedwmcSN2dXD69ZrhhPqGWcA&X-Amz-Signature=7ab70118a8dfd8c9f3be2bee45f8fce41e66e14bd9d1806493c4caff5a959263&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UCXSLOXA%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIAhIX6rjLi20Mr9cCtzy4oJzG0veSzhXclLd8GV1likCAiEA%2F2XnDgZWAHFTUjb9RBMWqK5XVSD05rm45s21d2JwBg8q%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDLNEY6rfYWC43dOkkircAw55zwO65YjOYQAxlqbLVcQVN0veIACK1fH%2FHrWfJP2i4d5tmZa3wmjrFJ0l3q44LTVFq9JBdDkZxiMaYcMFq77lAsBTCdoRBwUvrlcuumrwNXR%2F4x%2FBwzajEAqze5H4DJs7VrjfNJpgk%2F5Hpp01voeXWWhNiOt7xwG093JyFrNp6iR%2BaeBJ0cKVciL04mUU2b7V5xP3I5kOOGOmquaRoR2jwY9KVrllT9y6XfLhsuUAPOJ%2BvemHerHn8Lup%2BOpmugSqS53H23Z8nyrmN1O2UYHU2aBHprqzgNaFlbxmoQSOnn%2FRPdG1LUqDs9B5g0Jild0OTBorMtauXf3%2BtN%2F%2FDLVfpjWXPNlWAu6gNbtMD2Xkv63bhYIb9g0skyVapfqYEudzSpA1pX53bynELr2UrYaCNMycRqr6bQg7fhLndRdOup5mrl%2FF%2B1HveJfHLG7z93fp7bGOyHzZgvlw2cQPsUd%2FICsJbXjSe4AZuX%2Fon9BpJCsV81X1s2Reqe15ANC0FpXVMbNGteMrkLR5DA3n%2BTPNHCFNL7UT9kMsivt%2B9rZiAdm2N0SziDE%2BFwydeOsuWNe17lBq8R39BVknLrtykxDArcXwt43BYGH%2FLRDRYk4EbN1GX%2BFgL%2FhkBaLXMKOxv9AGOqUBq8AX2u2mge4kahBFPZRJkLMrv8j4P1BNqXEc4BV073NN5vGYDe%2BVGmq4r8MyCMwI9xy4SVvnIpMFEeU%2Bh7ZCxbCK5N8tb%2BCWRBUyBZ0%2B1gjZEesNdgmXnBiDIhsfmwNDFsDzMeNTgminj234hohPL4T1hZo9LCLUUn4Y9HJWGvivVRgmfbYkteB%2FIIFIEyrrPAm%2BRedwmcSN2dXD69ZrhhPqGWcA&X-Amz-Signature=50999676ae82d9fefa248676396deb7fa0b2fcf0a80bd4fb6cf54da93b37596a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TYH5DVME%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043729Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCIA%2BgBZPknOAISmPz3nD8ec%2FDXtgDgVyHBtx8UrGVU8jFAiB8VJkhvg%2Fvib23Mv0yYkGiBb205VB9fPqtzS1ZSkrbDSr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMvhUPHbjdjvUB5x2bKtwD6uxeHK6qT0vhT3JS%2FkrikGz5TY6YHLZX4eaCCjLdnuaq%2BIro9azWu%2Fiy4CxlJv1e%2FdZmUrwOm3eUx0NB4Fh4QlsX9Nieags2Y7FsEtMI0v8ODIDHMl9SV2y16kQ5mu6Kqw3RfR2nxeNkW43mDsxJ42mvvpIMjprcbcwF2w5RaoN1niFtcKbHZK1H3CKsChYg2Z92FvsXAjviD9MjaQzteEcOYK2X0QL19FbX%2Bz6P115fQeQWFFNmUqeENLybV%2FY5bsOlooBNx1KtOxin57t1n1JDk8bBHF6qNahmlOoTk6ZU%2FJMALuj9xJVuDjfQrPmg%2BY0xSmr0nOJiOYIpbjz7Srov%2Bm98rVxPADvgWu8JZ44LF9rdbiuO0cajXpwwjwnDOzON8%2FHiWeiCp8jokQPj1HxzzAWEFrRsOGIn7NcZzsA5qa4prhzwqsbFJzod9VE0F0iwWgKCvHtx7vutzhHFgNPpZTHIsVvQQZrE6FH3O6pr9Lib9bcfzG2gwfzfqhOIeUp6dsoYNh2RdPvqWnt3Jy79aw92zIKzMaLkwABHEtk5wZMHjeQccIsyWPm1Z2jlHutBcLv%2FT2lAEO3YpT49aMbOVARplNQnJOFl69Ud857N1ES1TvtSUpSEKz8wurG%2F0AY6pgF2KrZnNvkECEPpGQFvlMdB9SNmESM2vXd67bZrJBUVOquyPRnr9HjgRmfiGULbWWOIsKa7WDTF25Rw0pzPw1NDOoEBgFIJhcWKi%2BGlCW3md%2B%2BE%2BN%2B01N1ScxmHbMARFMg4Z%2FfrKKNinnSA7Ru%2F4MFk4zc%2BV6ctTOWI2gMCASa0FN2XBz3TdGmrgVCoa2AEgAIthwX94nJqrPirdwS3EMHYwc8zjBk7&X-Amz-Signature=2493566b86bdf579e7113cca1bf01d8e49b3093c4b0eb83cd0ef559ba051f54a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R2TTHGHG%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043733Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIFM1ZvN4qxgerdjYoIr3VW4sQJMNjUAnKaQlL4Yk8OlYAiEAiClHkLJS%2FcFex353hpKuSyoqn4u1mKBnUjGkK1yiOQ0q%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDPSZJVgVROMtaIXMVyrcAwIiMnRH%2BZ1YhfKfPna%2F%2FhAbGbe9H%2BzVCSl3fTxOsUABsF70NajqjILE6Saef5lXwkHL7iGqgH33x1xrv%2BNuiVIgxoBneA079apSvRYc%2Fpi2UOYBhTNrAOQNUwzbc5%2FTHxefiBRoM%2Bg8lxFfa3ue0oD5igkivO4a0du7a2MvWTGUDLJpLqIEl4bfW4j2cAskWRl4WAuK0kfyV37lAqQKHpt7X2BFZ%2BOYCRxfZtfFbWFvdx183%2FBRTNuYtURDLt48BHFtw%2F1GJU4TUdUYgdlgS2SmxTpowT%2BQ3Ve%2F7vxPHXfBsUxS0fBRT6t9su6I1D7uDSot5w40waOWgRJugbV5uccuQwTaMrqVNjkN9cDLlw%2Fv8a1hOO%2B2Cnof3s%2F93K%2FA896g6gGbrpWtGP0ppzj5W6HgMHKH25%2FCI%2FxqVVJI3P1q%2B2377LH3whV2ugXlYMKxv%2FIJOePxsBYvFLNJdfHDDrSDAMb3b0tpFOn9ApE1SsSt9lG%2FSEZXPYEG%2BIKtUhbFEOYgnAu%2FEKJ2AyWpb5xRiscr71lNFiOWKxs6Ej%2B05JzMx16XlEsrJ6VxhURAP5uwcRVQd6WFJ5tI1ozVbOwBMSKwmXu1WmITR8f8jfmqcHUrWhXTZS8ctcSJpbBDMI6wv9AGOqUBEq%2FkXdrU1wfgCqqJuQinrAIvw%2Fc2%2FwsOET1wdBUph2O5YVLfx%2FCQbRTUm%2B530NVxPtot81uS8O873erW5iCGLf3M4kLFzLa6TzHe03R%2FRF0bhJuebLxnZ0fVaw%2FnzctwyL%2BGAbL9LtSL2BrkFWOwLaShYiqF5X2tyeVPp2dvmZsDu0P2OcbJ2xWPg1IqHj%2BpiM596Bhiarw8otRyRlas7Ac6y12A&X-Amz-Signature=d955e728540a056cb35cfc073c5d36024da6b8b83d3fd71958e2c2c30c840570&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW6MKPI6%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043734Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIQDi89Nle0OVHXLsHvVmZMbkbQveuMcpk8kSs%2FNxlwvqXAIgNvsiWGiYKA330ofVwkTwhzXhNMY0QhYsyYsJsEqED9sq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDIMi69gsrNdWDbcgNyrcA8nqEasVLBiXjmXgxXL%2FdfBniyZCraDkDe3vcaNsKDgcfocxBzkKsErcleukeTHg%2FLOnrlFM67yYsUVjPcCFaX3un%2FZxE%2Fi9Mn4WAmbsv3yY4L8s27%2BRgTfU%2B1k%2BrYSEeNeCiTgds7f0m26vuVWUdFfOW7ZX8dYOexEIL1AfjxKVNj2x0k0zJuDLBnE%2FPitHQOxD8Pg%2BX4euEkjnMTCVwnMQge%2FAIjacGgBHMQFCOGNPOz9KITVBQJn916KEjSsn%2B20sV7zjj7IhFE5k4pR446ZRP8htCHcPGY4jZyKTvfZWOdrUJeAeuUxWiJuJX%2F3oOv1otrZVLNLCVTdqcyTuE82hfAUQy8BNOkFk5MzKQIv989IYSPKBoHgONhOpGH0rqIucP2NDiukD51RzTguA13Pd2a75JShcd%2BwxFRUqdCstAp4Mw5rXPJvTqROn5camdp2x6Cruoj5gTmmh5MUkENx0hB81bHFxXzDASYSxHfL4YmpCSuIOWSmpr%2FHZ1h5RfKNgK%2BU%2FT2u9GYvibUZaWvQH4YC4Z28UaTKThVRKoXxfWg1%2F3poReGqBch12HUeCALl2Geql%2B3yT9ntBDHldlE%2BTikNUeP9a4CQM46tETXdbABERTY1a%2Fsz2mobMMKSxv9AGOqUBBH%2By%2BqGFYnGt77vjI9ir6E2BntWncyx4m7Us6D5NP33jGu217skppX2bGEYc8RSA4YRTEotLWPx0CHsPYp1RUIJ7fMnKnejQvP2rycfgyGJmQCy3iH4Godl7cNovk9pzs1WMBuLAj76HG%2FIRNotgFxobkP2%2FMC2yD3AB4a5LksIm%2Bt0AtV3TFau8bZQg3TcwaANSJo53O8HXn3unWOusxbkiY%2BMY&X-Amz-Signature=72a2d72266ba154ba2db2f7c39ab70bf00829aa26b743d705492c06590c9afdb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7UOSBPO%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043734Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJIMEYCIQCy83bm5lGT5FQERy1lrWiy2kihuwAxV0tleUFWmamZGAIhAMjHYfye1IvfitYjZ%2B1D%2FfBqfup93i2WEeLBi29R1wAGKv8DCBUQABoMNjM3NDIzMTgzODA1IgwrJ3R7yPhZO7Y5FSEq3AMoe6OCicfneFCunrPG65%2FcPWNiKYsBz0LwhkNta90odBZjTcQuNisXw8%2FyzsYP6Pb648ksF3MBda8nCCYiuYHIbEAehDcVAECx5CuHySHb3KPyxvK0O2cYClOTCiD75pvCfCiCFxZukhYwZ3e7gjgFBgIMyx9DxNDivayxrPXm%2BKMZTKMBZPaKy6wMHlHFexUXr1DXHHGgnGAoACkDi7hcOel7npHMVg1he%2Bn9JHJf8QuEB8ymWQkBW%2BYYrDD2Ymkp3kKIvmaD2NdQvQZWRXfA0Zg%2BpproRDZlZVKhtPVeodbsl3zA2PsMCgbImHiZRETp4tTgn16redCJqUvDRIyURxVZ164YuERX%2F0x7QQro5ds3db0SxerCKPIJ2PpxqYp91JgbF15Naqb%2FEm7jbvYrzHRuMmDdQK%2Bz%2F%2FskuSEC06%2F3Q6stKUOt3Lsmlca%2B7g3YhLEt2elfzPdVKHvKDs6Sb5KqjDQcFh7VM8cZn5vBdkmru3BbBFsCaKuQ0V%2BsHkM2D8140Hyoq78FoaAaSggC4XrYXHyMp6GQBnRDitP%2Fv%2BGEtqUAXXbkcer6cjTmskJsEGzhU3X87fnN0XvZv6PCczlOf%2BZYXPdEwu8hdXUNcS4dLxOW1e33fl7nATDCsr%2FQBjqkAcGI61Gw2qP8oYqfsT%2BLXdXMRUA6ArJv3vSRssj4ZJazTchG4ICXshdha483kNHmf4UtSSHN9AMcKZfZgqezh5Sq6hIVOwJT2dNsuMcqce2nmDutofxe0wFyPr%2BKg%2BnjARTcqyxPm0RfClT4GlCCiU9JtZMifX%2FFxQ9CGYN2HNwn%2FpZTAwZjyo9gma95PP%2BfOQsHMTusi7oU51MOVTp2vyJoo4Ci&X-Amz-Signature=686a5c1c7195156be49c9e819d753ba10381b16129ae31929c633225351ec1f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YMSGJKCL%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043735Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIGqOGMksuNrXiOf6zx8ngLiXkdG7jqpLhov2nMUt1VdWAiEAnsFLdMRRiTfjhqci9JSQPneVmhhNFdrMkJyFdVAjNToq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDNeraJ%2B6V%2BOxLvfATCrcAwY2rkFQOyZjONgbYXi3DaWy7XHPn3rD%2BdkdPArBmlUZCVvaLqaTLnYeRZ56%2FVxR5608SFRIuQOvZF%2BZgoie69CtquQAAsf20Z0PgruX%2BxkQzoTKVD8iakLVoWmPEus1vuE2uzXSLqPyq1rpVP5yPv0Siwrf3GcO5nHx%2FgApGvdeZvAsXjh6ehcHCQi%2BRbK3x%2Fx5HVXgF8jGYAUoacMUrdxDmGTwe2V%2BaAfbwBFF6S7en%2FDV5UwDTHj5Ta5nplSNoXf1PZo1VAg9dhDXckSxtDZU4H9Gfr1h9%2Bo5tt%2BvXHrZRPiwVNQgHUyfEAuTB3HkMGpPKLIkFsp1M074vkV4Z9mjlG%2FpghO%2B9W7Is7kRStGtEmr%2B0hReJMxMIxJ%2FxABSaYGIqrBPg3Xrt0DsRSD16zS4BF71lpV7hyy4V6l5BwYdWxR%2BZvwwvZ0TcZzLpqqG2wP4OuwPe%2BRT8a3uP%2Fye9Cp5Z0SVn74gKBbpnx1KHCGPXF2RHXdI4y7N8Wt%2F2nM78QzjMr%2Bo6lz0Rtfcj7Jsij3nVNoOD9aH1FSAWwKM9%2FnfG47Pyv8CuWKuAqGnb36Jjoa%2BrAQovB4pSu9t1Yv3x2XJC%2BPhoN5sNdGH8ZAoH3WSom4jXhvCM%2FTME7%2F4MIOxv9AGOqUBVzXE%2FDq9bY8G0WqUh2b0hOe2q2NG72KFdxLVdNV36csa%2BbYe4Zrn8AVER74NMqDppy8j9JdU%2BO8Qa8mcfauHbonPK32SlR804CwP34sdew9mU5Luv9wD3x%2Bgb8%2BUrGMX24GsqUTnZY7CcfUOIqPYLwDwYt3JiIwjUY3pFUb%2BsY1t31kKEQIH%2BoNoEDUP%2BQx0xmfL9H%2FyuSlGDHGtfzd5Gb2%2F34EU&X-Amz-Signature=f4943c308e8eb24b7cd5abcb4618edded8abcea8e9b857c41285e8a7d657ec5c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UCXSLOXA%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043717Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIAhIX6rjLi20Mr9cCtzy4oJzG0veSzhXclLd8GV1likCAiEA%2F2XnDgZWAHFTUjb9RBMWqK5XVSD05rm45s21d2JwBg8q%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDLNEY6rfYWC43dOkkircAw55zwO65YjOYQAxlqbLVcQVN0veIACK1fH%2FHrWfJP2i4d5tmZa3wmjrFJ0l3q44LTVFq9JBdDkZxiMaYcMFq77lAsBTCdoRBwUvrlcuumrwNXR%2F4x%2FBwzajEAqze5H4DJs7VrjfNJpgk%2F5Hpp01voeXWWhNiOt7xwG093JyFrNp6iR%2BaeBJ0cKVciL04mUU2b7V5xP3I5kOOGOmquaRoR2jwY9KVrllT9y6XfLhsuUAPOJ%2BvemHerHn8Lup%2BOpmugSqS53H23Z8nyrmN1O2UYHU2aBHprqzgNaFlbxmoQSOnn%2FRPdG1LUqDs9B5g0Jild0OTBorMtauXf3%2BtN%2F%2FDLVfpjWXPNlWAu6gNbtMD2Xkv63bhYIb9g0skyVapfqYEudzSpA1pX53bynELr2UrYaCNMycRqr6bQg7fhLndRdOup5mrl%2FF%2B1HveJfHLG7z93fp7bGOyHzZgvlw2cQPsUd%2FICsJbXjSe4AZuX%2Fon9BpJCsV81X1s2Reqe15ANC0FpXVMbNGteMrkLR5DA3n%2BTPNHCFNL7UT9kMsivt%2B9rZiAdm2N0SziDE%2BFwydeOsuWNe17lBq8R39BVknLrtykxDArcXwt43BYGH%2FLRDRYk4EbN1GX%2BFgL%2FhkBaLXMKOxv9AGOqUBq8AX2u2mge4kahBFPZRJkLMrv8j4P1BNqXEc4BV073NN5vGYDe%2BVGmq4r8MyCMwI9xy4SVvnIpMFEeU%2Bh7ZCxbCK5N8tb%2BCWRBUyBZ0%2B1gjZEesNdgmXnBiDIhsfmwNDFsDzMeNTgminj234hohPL4T1hZo9LCLUUn4Y9HJWGvivVRgmfbYkteB%2FIIFIEyrrPAm%2BRedwmcSN2dXD69ZrhhPqGWcA&X-Amz-Signature=cd55fca9f30ea2cbbe7467ed1713fec3463fa8f4ba7bc8d834a57365eda2b5e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
