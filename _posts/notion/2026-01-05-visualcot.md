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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QPFGB63%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEYt7DoVsbCbbm%2FDa%2B3yjxa6AOlhN19AQdGqQf08CPr%2BAiAI8ub0kdIeAQ10k0VpZC80ShPApotQs8AuaClsvqiATyqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSKniMAvWg%2BqM8jpbKtwDW4BrLAQUpuM0oKRMWMe5Y7rr59XxkEz7vXY68zoqDpoJxIQg21ytyeVVoyABit7qp1UVBN5RBENLXEHHG3ii8IIvXQtEqDBxbx6vM4b%2BAjHjwJncMDprUil6GEIm8XdAshrWIsg2OUpvAC7wApSL5W9rLfwvSUDduxdlLVUrhyPI98tJY%2FsiDKVgj33sG3ARstsk%2FghgxbIOpy1ShOBzE0WLpTq6haI7oGSBeNGGwNDHZjr5uEQALnLHIfeoRfSaqEfgyk7DGmLDti%2FjqL6WJBTWugUx8U6uAb3n1W4NSrkhxh9QvZtl5RvGnTnAM3poQ9hGPvu%2F3RxCHZ6HmNa3fAIuK1OZ5HyKBqycKJpN4JP%2BZCwp53hNwlvscC9T4%2F0YMNhZwFnfmHmXBs8ZIqXKFnaqp1J49%2FBQyAfYlYfW11uBvB%2FhkBkWWlQS45qbs6%2BnMJnwiMPOOV7LH8tmov4e89EVfmDxJJzvvavTX7he9E%2BSGW3gHFxCfTZ8lL50xYIQ1c3CXGMwYGp0A4dY4KhK5CUvcGxZowvHc54ztFnZnM5qqNw8qHbnrwITGulAarW1R%2BZ7Vfm8iFeeMSPlOgE0etwqKMII1%2BYOCkqyc%2B6xxmfY53WRAPeNUXvnV24wnJHfzAY6pgE0cI%2FV4qdCCestQImf4FDsAnjeLrtF0PJw2xhNN%2BXgOfDVC46iKp%2Fx6pntTIXsYtBoOIyHJSNJnPC1Ewl8flmGg196W90nuR2Ncmeml99CD9VjttPMaQm%2B1k65JTeSXGziRRpq7RyEpAzrCv%2BomlnfQCRTKWREPXKEaPqI%2BacqKb4ofUiL3qGqkJKfgmjfMGei14SkosMQu7y2c29H6%2Fpkae9eoQiL&X-Amz-Signature=a4f72115e8ae6e20516b7341be396c466f6438a7b7b57fab35597c689aad29fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URKECKDT%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDgjULEVQM2InAfv0UL3H89kFR67pvKRKSdexqaiqDy%2FwIhANLhRhppFYjlPfSmj6i1cy8hk8UG2Dqh8VXGAvnOcnxRKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzJDI18h1q3nYhIK38q3AN%2BQZGAVuaD0xpJzfxxwDnvMUtlT%2Fky2nvJi12mgKi%2FRZd0vnHCDAxORteV8ScZGHmK4GnhaTbgO1K1yQsjz1X36Mr0DRd3sl3jinvCNlwQs%2F742dcgfly2bVNI9Kgrr7H8nEEwTKldjiz64Qjtl9c1KhmYd6wk4tFgjIgY6xK%2FtJfbwh1EflVHklAfJqaKh509H87c6LPcKAbv2CByxNnN98duF9si%2Bncy1QqiOq4d0xbNbbRY6q1YJSRsekcWEbHOxEVWLl0XRX5QO9AfR%2F1HHsVQj%2FKBc2C%2FPP2l1%2BXG2G8V9zAHwW0%2F0fUizK%2FFighqdBppn6fdAvnBLZllRYOxgbPTBcvCUD9VzTI1ZAIf4UsCZuJDRudy9DJchs04dFWLxmGzI1yOTYVm4cjWv1A%2FDKeFgGW7Q20CtuLipC9EMzBRRngUFqgPdf7YEnRLfYVnCETFBFiGcOjvdiyXqUBPlBf2nv3FDLXz8Ep4ubXaNPOheAW%2BpnsLFTsjlCcb6R83iQzxNDJRwUoRx%2BAvZXFc8g53qauHCv0VyCSXYTHmaysi%2FlTOPZwp4i4Wgc4l9g2qjMfGKj3bCtfhuvF7B2sjAo1rmNJsOPjfftacv%2B3X6Roxiq15f1bSbfcDxTD%2BkN%2FMBjqkAUkxT%2BGJ7aGmviYTs1hjnB9JKQxqKRNrPpLe%2B%2FucP9HvHoSy1oyIfHjRABofTSnPmhmDtpThH65ko3Ap%2Br9R4gQWYNcNBMRmjcpF%2FuMBkYrA0A4KLlM4Ie1I8oSyThh2ht65khoHKOsWx9Lfr%2B%2FBsfnf3Llj26waDMNSRgTBLs6CQ5OphUzP4ZihrHksgoXciieRI1f5nTqm%2BaI3ROdXpUwMkU9i&X-Amz-Signature=c1f878dad30813fe5c34253945f082c0c9d66fdef638c6a7ec9deffe21a5b19f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665VFCM2DW%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAKPC2C3bL4DQUHLyuykWOWic%2F99yu6MbRS%2FtXsShN%2B0AiEAlyfk%2BqbUkhe%2Bu%2FRWREHb6aKr6qvA2KfwizvBx9h8gG8qiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGleIWzo0shYTaZT3ircA1a6s3jBkG6ie7R02gUzySqAQLovXWvvNZWVxvw5J3uGFQhH1w6bvpAxf4gCVnVlgs7H32fFtjUN3R8tfxoM5xm5ByjyxUZmncz8WNE24QK8TuwMpXbO2Gg8Zts3QUk6WR77WE8kFoiMmlIGvalcIrZdlgwDlnj%2BFJbrrrO1ScRKFjxDU3GxKomxAjWUsowIpcOf9TIyEDh9Rsn8StAtkXMeaKmL0MSJbanuWN4tTb1rbZ1%2BXnxdesGmUv1vZVZTJYC2UmoDoibcc0TOXoGP%2BtvYnyAOqFZYvo3SHM%2BFgxnMVDHG9kFaEGtcyF96AZTijI0qOzPUzP%2Bb5M8aKwPD7vf85GvqyVKJ%2FeF6HqYo8u06qp0iwYpKvpYFas2NDxSMrv4gkzDssJyR9qMsaZQJdiDgSlpwDpRBqQdP3e4gTlT1xgrJH1LSWkG%2BoQA09B676PRMSeCgQpy%2B7CpR6%2F1xQbOdoF6CPA8vb%2BfRbSLIfk3eZHSMMcku3XvPE7uFZpN%2BYN09IjzCkujZzlXHFDDV8DXqSICoQs%2FLi3Hhp%2B41wcjb1dvwFSQXUVyjFERpp3DS4%2F5gLMXaSuL8Z5JubAU7PPV5umvdqZthPtj9yV4TSq4GXL5AGzliA0jVB%2BYxMP%2BQ38wGOqUBEL6LVM3dUPanznssGMa8lwhXfQ5m7zM4POS8kS1xVCOSMHBgg44h7n%2F0xujUUguaF0frMAH0Mo8jMKyAOmBY6ag%2FRseOZthkWATZW%2F%2FRfyXzccxgdKm%2FOieZ4oe3lsIF92ddoC87HXvKHzZRTINhajjICYeEjH6FuWRMKFKhSsv4Gxo0i0DaXsdZ9JOnO0OC%2B4BByv%2FhiP6r0jhrk1l3wYQz60jV&X-Amz-Signature=5a7e957cc1c71b3ad32bda99d83d336278a7ceac4c882d5d63edac3a21b0d7be&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665VFCM2DW%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAKPC2C3bL4DQUHLyuykWOWic%2F99yu6MbRS%2FtXsShN%2B0AiEAlyfk%2BqbUkhe%2Bu%2FRWREHb6aKr6qvA2KfwizvBx9h8gG8qiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGleIWzo0shYTaZT3ircA1a6s3jBkG6ie7R02gUzySqAQLovXWvvNZWVxvw5J3uGFQhH1w6bvpAxf4gCVnVlgs7H32fFtjUN3R8tfxoM5xm5ByjyxUZmncz8WNE24QK8TuwMpXbO2Gg8Zts3QUk6WR77WE8kFoiMmlIGvalcIrZdlgwDlnj%2BFJbrrrO1ScRKFjxDU3GxKomxAjWUsowIpcOf9TIyEDh9Rsn8StAtkXMeaKmL0MSJbanuWN4tTb1rbZ1%2BXnxdesGmUv1vZVZTJYC2UmoDoibcc0TOXoGP%2BtvYnyAOqFZYvo3SHM%2BFgxnMVDHG9kFaEGtcyF96AZTijI0qOzPUzP%2Bb5M8aKwPD7vf85GvqyVKJ%2FeF6HqYo8u06qp0iwYpKvpYFas2NDxSMrv4gkzDssJyR9qMsaZQJdiDgSlpwDpRBqQdP3e4gTlT1xgrJH1LSWkG%2BoQA09B676PRMSeCgQpy%2B7CpR6%2F1xQbOdoF6CPA8vb%2BfRbSLIfk3eZHSMMcku3XvPE7uFZpN%2BYN09IjzCkujZzlXHFDDV8DXqSICoQs%2FLi3Hhp%2B41wcjb1dvwFSQXUVyjFERpp3DS4%2F5gLMXaSuL8Z5JubAU7PPV5umvdqZthPtj9yV4TSq4GXL5AGzliA0jVB%2BYxMP%2BQ38wGOqUBEL6LVM3dUPanznssGMa8lwhXfQ5m7zM4POS8kS1xVCOSMHBgg44h7n%2F0xujUUguaF0frMAH0Mo8jMKyAOmBY6ag%2FRseOZthkWATZW%2F%2FRfyXzccxgdKm%2FOieZ4oe3lsIF92ddoC87HXvKHzZRTINhajjICYeEjH6FuWRMKFKhSsv4Gxo0i0DaXsdZ9JOnO0OC%2B4BByv%2FhiP6r0jhrk1l3wYQz60jV&X-Amz-Signature=2ca5de9c932c1d5e44b59e3c6c6f478c03c674bd8237062244943dafaee09cdc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZYQFUHH%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031138Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaIQyXDrKLuwUumGRUloEjFwDks90MHt5qFe9q6qotwIhAJjrSOTTpCJOkRp75XBbbBLL5seFomQYOLS5cVlMQoLBKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzn9nZaKo8uZ6Htdm8q3AN123l1YATPxyt4YJDZL7soyWROPV2sq0%2F9X4XUMyjDRFMuTXZ9q%2BVHrunaopwsHTpN1yG%2F9boKzlmtDpovBcjvvGJdPPyDbtaqc2lpoom7GT5QWx03oX92hW1hKs4PgxqtcfvO35OEi0NEkTEa%2FLWDWU%2F30%2B%2FX%2BU4Hu78Pe6lSXGwTX5zUSTdngXv%2BNVOgmS6F3OZNVyztz4YojOrqm5K%2B26wc0F0fBBEJkFbjjbObSbUTxo57Voe15d%2FmESgAPXh7e%2FNX%2FeS8nccHV1tR%2BFTPm0HC9Oi2YiRvBuiknhXPjYQ21kNc500OD9dOgNUkP8jF5blVhtyKupYh1dOACDs3q9n3KGfMYES7RYl2nDtN0g2wdS%2BTTqLuJejpd7U7MRHPnAe4jFydVWB6SFrkYwBDQXCDZBKYZ486GHgB%2FL1MriQhxgJrkfCQ9Z8XIVPyw0v43oPGgE6r1GNjGLxco5De90u6v%2F7ieMrYinHHE0b3DCDx%2FPmF2COc4qatOqx88WEvwZsmMHyGrSdPjt0HqCA5JdFFJvyJ9Hqx%2BQsBF3csItlKseuRrowH2su%2BOQxJD76syv%2FPHTBLyganRwAyy8laGrKtQJe1LOtcH2A4OFH%2FFE7ZUnIzSN7GjahyoDCmkN%2FMBjqkAYL6s02ujt5%2Fjab5wZsRBFm0xGmRfPrSnFnANI3e9MHlRVs869Rs%2BJpKL4piDsAbr1amnuSYwr63aBgwOQmD3miZhLuwoo06DmBtCzaT%2FPFMJrq703fxojKJNYfN36vOK4J3uPR%2BOzK9qh%2B6ha7LJCv769h5YtDtHF5qhsdyK2G7hmhDa4qTMBq5c4smfWG%2BvHmsnE33FVC%2BXCpnMoOwo5sSybwk&X-Amz-Signature=ad4ca21f132d130f678943f42457ffe5daad7ff4048c94d36854d7d39b5b47a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TXDQKN7U%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCqfvw%2F%2ByvTvMM%2FMKZJCVLloKAI9eZfxNc2tfT0S23gJgIgAv4JHlScVAwPpV%2FjYs2BzNVzaGlzAjMhVRHxTRQVoTEqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNDB5ISVQ0Mv9ZZfiCrcA%2FJoLa%2BYjBB1p6VzTKV07djHKq8hIKTlbOXmixIPvBWa3paNtJAV%2FTz6w3Z2aeUzr4XPYBspQavJAUvGTU8Y0tz5%2FleAaoPNI11GURCt%2FiOgXqOd4AhxzY4KuF6JU7NgSeEf5ZS1qHe3oaVFlzjvWRozvAtKY4PJvXKMcdYRq3QNtRIw5UB3EvL8vErk52mSHK%2Fcyx8ic%2BJL2THnpcfSIt0QmRmrKIdJF2tnH43iKkskXjSivoBbUqwFU2HUede66z0%2FjuAab0zcEsOfWrUCQRfJhK%2FEXzM0agbpsTl3ZV1lSvufYjPdAkkZLabG%2BDbaGopzAyFdFPlGdxN%2FyFTZ2PaKJRRBibnSnrKsl%2BdNlBJPChJwbkoATLlKZDPelCoMshh%2FZOUvNCYcGxKUgNXeGhsufLQ92Nzw9camifusjaefBkV5dNq1Fl2CcOYRNev5Cqsb80oftXppkYKkhxRgmoCv49waODENogxwyEtxCiG8a6jOKTGjOPGmU3CXlC6JxisOoSCURT%2Fz%2B2GZfmTUsAYasNnNCJiBOhez5mmAyBYLjp3mfld2Br6MbONfg3suM98ps%2BguCrQG2Pl8JFj1c%2FVWG%2BHUi8TT4l6hbO2wh4TfInEFT%2BbOLhsTJjqGMImR38wGOqUBpf55rL7bMdoLjPBycNTmN%2BCQldGfrW9MQvj5UEFBQ1tOmh3qz%2FcSgaGotbXaR7AWgunNcKJcTn%2F0Bptczi56CwbwkIwUuVItRr0sAlup9%2FKZFqISZZRUkTKQG2v4jvOmwcXaDnfuF0pKbPMj3p4tjh75lBsacE8uaN6fwQ3EE8bSwp0WBmPAxJc8emfXUtQybR2tsgN%2B3yJuSogKCDFK%2B21TduWJ&X-Amz-Signature=aa9e956abbec8df40e285724f38dafc11741a44c243f286c4873b723eb079dc5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XHEI225S%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAdR8QRuTXMs6v9Ad13PS%2B%2FLcCOSZVvqQvaTpQ5MlAfkAiBW2Ui9RBnvjdLKxNoCuOv5%2FtfhPQkgsMzr%2FVJZjR0pVSqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIML%2BInREGwwBsnxsZzKtwDP%2BvjKlG5eIrkxxFX%2FOqNjKLRb6ceEJgw52HbDV%2F9U1VD4MqAyBsQNaEFgC5KCN0xPhQ4bV9LgAoiFV4lOb9AOzUQDvE9THSsskq2z8xqW2%2FH3M25ob7tTO45ux5eClt2Mk82tAyKJuI2SsCa9mrP4ch4Jm74XvLNQ%2F6p1e6n0ZRA0h%2FBczUXUb0GOpfa1y6xNJj%2FtcKQITZMoSXSuUcSelJOaxIxP1YeaZAxd9JWjiCm4W7htpKAMkMQUrq%2Fq8r4oL0UviVSSlZpvr%2BsgLUsGQC8QvmimVM0I1uva%2FY3f6ZtDoNQHpaeqqpXrYzerGT7Kha7LrlhPRzxusqbgfL7YN3OUiJZJFoL4SCIugIiB9hzeap7yAH4mPXMmoL%2BtC3qBnS0NayfTBtpxJaZMrEa%2FtvQmu0RTJ%2BecuD0aUXd4w9pDutS0yHRRkx%2BXPEucx2YOH%2BBfgVhZbX7pFfSJkJgrt6uriUUDo41vnG8NWF%2F7iyq1WeJhv9OCjCjdXSvG%2BQMkDXlE9sLHzULHRP8Ycxt2OosqjcCFa%2FDpE%2FEIdRroAEsqbu2blEGnz3ha7fjv9Rana9XxCDZDTf6hsN2IqM%2FDWWHqDbpgTu1f0HQOAKcbDo46q7TYGgWw2vfRdsw2JDfzAY6pgEmbpk8OxOI9oW9WXXHwoOU7mhjvMreNIxcCoMmkZWhpLQCZP9J9UsdHoqQGiDFLaWSM9Hpijvw1aMNkSYU4jGgKMmS%2B7vSaR8JgOkPvR3NjvPlwrZH%2FbOjk8kP6pT8deghxpy9Ks7cNM0eFNZUIeoAvkGhVxRxlVA%2BwrjQVPxsqeo6tDtgyXAMu%2B3u7g6rjPxOmBjDDxXHy4K2%2B68DagIGdEWwej7I&X-Amz-Signature=a5594e1349f24f18b9d1061b5e18d80903c92dfde88cdb8c1ebfeb979b49ccbc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YN5RX7S6%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCYYslyNQWBLtGdKxsZAGAkpe0zc66gbq16FiZ1tYzTxQIhAJsA8dHdNWeBwn6Wnb8F3p8Frj1Yi9P1kNG8q5uNQuGtKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxfjZ%2F8ArgQbBWCx1Iq3APyVBfCLT4TpvUZOp%2Ba%2FVXv5g5aBbSdWRx5xF5%2FAnB5CoPQ6UG%2FP5GuuLLfRj6gJFKAgZSBN4Sixe4qbWmAW7s1YyNKSH8ud6RJeyHPyJh8Tz3%2FmUHPbb9g6V%2B5l2H77nCKcnkQExkC%2FmlTcaafjm0rpARlERWQOnMENV6CPaVu7FZhYBV7iDyN4Xzou37j5os8tnQckS18Bc8NA%2FxLwUP6VdS40ww5X3bQX0U4M6ym5GYE5HBS73ifBtXkFDoPR7iGDhO39o0jgpg%2F5pW03LgXff60zb51GgQMa4r12yeX9F74AceMsq2VaqYHdRFYpdi3UJSjsenu9gcilJnFaAKIOMxPT9wFk8XKOA14JQl0Hd9toM7%2BQacKmzvEaMYEZjfhmtsIUJgYccNM%2B3vmZbJqK5oqKDhfZdlUdJGkI4bgwVzpucLkBXR%2Fc43%2FQsYOKAk81a4z4h37GYZlQu3VGdldBkDSSQCRVmPcIso0cm9dv4E8SV01tvkXmx2x3GJmHtSOYDfufwBSDcJOWWczCAmG0i00zzb7fAG7DwJZwKZEzHYgblfcVrpAk56cPTLClUjwl1WkZ5yLpUv92b4HToKOkLM0C2i%2FBC9kT7waqSQVsOTnYHL8k6a7q6pkPzD7kN%2FMBjqkATcX6u26r6QMyC873F6StLfpzDn%2FqHOD%2Ban5r1vqRTcbD5fOLh%2FI%2FfjThbRr537BQZ62fj0gbQSiQ4un3OQ2N2sRDvH1aBcaWCN1nb8%2FuZQDMkjftGbqTabqF%2Bzs7hiz2ct8fC%2FcCLW9O3auwjJ39Vq8DLOP2zUJu8wsa3%2BtpvzmZ70WvBBg549GcrlmEqpUXnNS5KH%2F%2Fqp2rNrWBmJjRzUwg5En&X-Amz-Signature=43a60708781bf7cd37a94e85b04ef00fea62d1c1cd9afa82d64472a7b0f59d52&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q2LF2HAW%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031144Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCCWggpiSnyH6OcVHYLlMTQ14AKh%2BG1beuMq06b6Y8ZTQIgNanYYZx6CDN40XnPqw9K94L98IsZqVtWV8vC1U3hG%2BAqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFqdtn7Lu8Q9lLg%2FbSrcA6lu%2B38IUiLDmvf9DXJWgjYOwPSAF5Xz8S9Uy81VCpf2gER2tegBky%2BNSoGt4IEz7yRiMiKTnLr50b1%2FmKOQ1l8Q%2BTO0sPoyK84Qv0u1qwj045jj%2B962hATDhu4SRK8jx20sRVKx%2FlHhjnIwZED%2BmUM%2F7gx8znvudcbscXwUJWpU7gXppMFuYWuZqZcIfuTAjZ7RAYYshj23Mk51HADAF8Oy0KIPt737L6VaPqwl5XruIItrjdt40eJEJU3J3vHkKOv4ofk%2B8mib8XNpm4axzpeUfTOQTXLNSWOW%2BrO3UigxUZa78LW5LblHL7XB4n%2BNeFj8odSbAUbUwUQrOuSyWLnFoy%2FOtjWiq5%2BuZ3gfV5zFJWq%2BIs0kwb0mOYgugHbxmYlh%2BDI9az%2Bt%2BJBayetw9M%2F%2F0kQ1pS%2Bu9QwGW5Ldgl2qn9abq3VzFB9DWKlRpsfakk3JqtrKbV3lnwSXwxKkETKfh1z0%2FLPgrxmkRjiVyIsdDkhONNk7YspQOLpXJg3T0klQfC9LZ8PED9qdEQ%2FcrznBjdWAi2k682ojVCAcnsvqBA%2FkcQEZi81RQ3TomktgcSZZWMADzEgfj4e6x3Q5nX5%2BfW8VgidnPRF33OMq87EsQqf%2BjTPyXzQu0O7EMMmR38wGOqUB9mJzO394ELJmzOwhnEQ6YDXLJojMBwDQAUtBQE%2B32MHwj7bSMf7ekEaluMQMooc8FfOa49vbT1ee%2FGHlKHBQYNu7U6v5OFjYaLUAnObKUMN4mfldLkyw5FoMR3fyg6yuTW55MxAMMib3tsB1COTkCK0Z0Z%2FxbOp8CuluE8rV9zyuaHNooPBEhRBJ5ro2yQPIFSm5XgK1ZoJPPHLRaHpgfKCY1zwe&X-Amz-Signature=3578d08a019d3ca13be18797e16978f5d30bd5eac69016c88c7672b26936ad22&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665VFCM2DW%2F20260220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260220T031109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAKPC2C3bL4DQUHLyuykWOWic%2F99yu6MbRS%2FtXsShN%2B0AiEAlyfk%2BqbUkhe%2Bu%2FRWREHb6aKr6qvA2KfwizvBx9h8gG8qiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGleIWzo0shYTaZT3ircA1a6s3jBkG6ie7R02gUzySqAQLovXWvvNZWVxvw5J3uGFQhH1w6bvpAxf4gCVnVlgs7H32fFtjUN3R8tfxoM5xm5ByjyxUZmncz8WNE24QK8TuwMpXbO2Gg8Zts3QUk6WR77WE8kFoiMmlIGvalcIrZdlgwDlnj%2BFJbrrrO1ScRKFjxDU3GxKomxAjWUsowIpcOf9TIyEDh9Rsn8StAtkXMeaKmL0MSJbanuWN4tTb1rbZ1%2BXnxdesGmUv1vZVZTJYC2UmoDoibcc0TOXoGP%2BtvYnyAOqFZYvo3SHM%2BFgxnMVDHG9kFaEGtcyF96AZTijI0qOzPUzP%2Bb5M8aKwPD7vf85GvqyVKJ%2FeF6HqYo8u06qp0iwYpKvpYFas2NDxSMrv4gkzDssJyR9qMsaZQJdiDgSlpwDpRBqQdP3e4gTlT1xgrJH1LSWkG%2BoQA09B676PRMSeCgQpy%2B7CpR6%2F1xQbOdoF6CPA8vb%2BfRbSLIfk3eZHSMMcku3XvPE7uFZpN%2BYN09IjzCkujZzlXHFDDV8DXqSICoQs%2FLi3Hhp%2B41wcjb1dvwFSQXUVyjFERpp3DS4%2F5gLMXaSuL8Z5JubAU7PPV5umvdqZthPtj9yV4TSq4GXL5AGzliA0jVB%2BYxMP%2BQ38wGOqUBEL6LVM3dUPanznssGMa8lwhXfQ5m7zM4POS8kS1xVCOSMHBgg44h7n%2F0xujUUguaF0frMAH0Mo8jMKyAOmBY6ag%2FRseOZthkWATZW%2F%2FRfyXzccxgdKm%2FOieZ4oe3lsIF92ddoC87HXvKHzZRTINhajjICYeEjH6FuWRMKFKhSsv4Gxo0i0DaXsdZ9JOnO0OC%2B4BByv%2FhiP6r0jhrk1l3wYQz60jV&X-Amz-Signature=add3a8e134eaf160b3ee37c6b7085d3e8dba920887aaf8e16bd6392f671bee92&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
