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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U2YL5G77%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034926Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD19xPhG0iWuZ9KRDzqDGvXAmhac%2FdcvYQtDyclIDwpcgIgLmSB9BDnUW4tieHd8iUQJWS5vM6a%2BXgMkAtxKyiBO4gq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDKn6Qm2ri3kcMRIeHSrcAzdqIQ8ENA3nnWtDTRkPvhsKTiUTsAy%2FH7ImW1PGpl9QoSPIa7g6RkuhI1Buv5F2bj8pCq0Ewuw6NLoFgHnQryNzwH6Z9e3E3YuysgYFFqHZEqxAEZaJxOOJQfkyPKTLRSrCuHGwtry%2Fbpm%2FMk0sNFm7BSc9%2BJFPoJ17skVzi3jek4OqzHVAMrJfqYDfx0%2B845hIeRcafc0kh%2Beq54cEVBkhx%2FVmos%2F2DFD50lOIFyqf1fXA7drA%2BtJb7biIMmtxga7lC7x8yyC2FFi5mC6ndB17Nd%2FCkG7I5ivCdQEJCt09ssGOTaDllXb2tqXvklPM4vPtHFMEEsQsnfcErMlg5YtErTYgSqezhCb4NOx3t03AtiSx4zWjc3UJpuTZxrma%2F9kGsT%2B1yN6kGhgYxhwYkHe5xUL8i9TR5j3bObssMvYT4gcFameuB1OPAoxMOiwg9Pj1u3SsqihnwuRfDzdRq1EUneKAUobvxfUXCEyt%2B5p0D4pdhAxQ1OYm0I4ALQ0D%2BLVGOE1ZsgqE4fxyNvdCdMQew3BE79prrV0%2FK5iWbZb9zwgAqbl%2B4ejTigu9RdeSsT68xaLGdcHuI2pyt5NtoLNgCO1LBBerc54TdlSShl76KSsGXc2jEpS1Hj6%2BMMmiss4GOqUBkoFJrct37nVBxTWuFGHRt94DOH2bWISBMw6sI0FmZPV5yApM%2BNxm8oBC9S0Up4NLHBrUq3%2BAd0gbd6kGc%2BckminpoYpAwdcKl3I7pvLgYH33QszfsZcfxrkDKYxaq3n0HyHtI4JKIv2MrkLh5vaO8akVOc32qrfBrg0N%2B%2FtcAWHGkXZRtDX8UTK7jKIfjAs35Iud%2ByuNE6jkT5g6NBJPlV4PhIFg&X-Amz-Signature=513089dee14aa529f53c5e05dee0da784e0b988178072f5f4c9626d3e47e98b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZB6DXTKG%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034926Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrHv5BhkMSnQNoaVeHsXELqayjiTOL9f7XIkL%2FQNV0ZQIgQCUCWSa1CZqDyoiSFklPhb3t6rHZKlME1bMbD%2BSLriEq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDPG%2FfVkd7g8bsz8uACrcA%2BOWn19mNCISRdQb2bu5XMbnaUeEDajyntPf6ywS45k3ekCzjrVZODJgpfwDeHWFEUAU2UK5X5Uv5fqVXC7tqG%2BBSw6gKmJS6aT198H6LgmwaYcTprLKfKJq8OymkkvRIhIwj1%2B5upBHJDEGc2V9b5i59SG82r3c8UqW5e9z0NhbBuKWHkDD%2FkE3a567aCOomZiTQT4S7Iqlt5ZLTqXHjls2pvHGuxDg5PTUJxG8CHvUYkGYYkPkIf3xkkercnYQXZIqySesqSlkLN2vPVnXOWKdqLdBwyUPJq3zN8GWzTgbBarlDFOZjEyeswAubkqXbPe6k7BX0%2FEGz55%2BZSJkwmjRzZ5IAyRNGzVfFyfEnDHwwnwsMOcjKQSPOOgXvv7WAVff2ILoih9rZ5f0j2cpCQC%2F8d1VSj6VOz4mVj76OhDyKgvC0n6R%2FkB65131CJjvGtbadZHbD5Q1NtVcxnXN%2FGhXAOi%2BBKxfrDYryhZiXNwTn9Uw%2FCgdbVgkfHWONrHUZ8m6s8zWzDIjhSoxG480rXXxDKwPuJbkJBfd9fq24AMQvbIelDqWG3sV%2FZv5VQ5J%2Bn%2Fo4nphjGSfPrZdAlrJuwvaXep2rnRPPXskNcF8MbKfyjmInrQ4fjRkj1wJMPqgss4GOqUBstRCf4JOw9GWgj897Kv1qnAXad1lvVZcOe%2Bw2b83OhfXBqJOE%2FMuK%2BTtP6FRuiIWUxichFt2ApPB3jcOTiiAH021pcIyx%2BS%2FGux229RkuYq4F6AIRAOcgv7EGOJWrsPXjv5fmRj2Q%2FB1YTE9G4xuf%2Fpq8M%2FyicoL3mAo4dgXKyrlpMDVcoxKvdZZb93FDRZaCASZRSZNQ8vgCjE2hf3JuigNv5qt&X-Amz-Signature=5eb8c71498b46b944b28e75154fbf00e645ec64ff040c57303d381dca3fecb06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOFWJXWL%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034915Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIExjEw3%2F6T%2BBtqV6LCcZeyP8V8MaNn1i6gnJcS9K5Fe%2BAiB8BaYrMFtrtxZ3QWDXuCipOl6TLYuo9vjKx7aY7XCrxir%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMKf7lNx4Gn1%2Bg%2BaXQKtwDPU07KErPA6Sbvqre5nNtIaSzgNRpyj5rLwtAPF2gnd8T1OG6K7tC0KKlO86Zy3WfwiCWvOd7FEFgIABil7nKK4hCPsaFa1qow17s1EK7xuPKmyUuob18VPo8%2F4L6bbyV8zdFKyW6ct8S4dBXIN4QGrrFPbzsRuH9aFUJ1HXNY1%2Fq9LRJeXktbpbFdArCVbSCFIJEyOIhzXM%2BUt0Dc4xO1fBIy8OD3MdTNct%2Fv5eXNwINnM%2F8jzMr5w3%2FzN1OHgxre%2FEkacAba1GK3rKqZRuBhzcaUa56M59nKl4ofq%2BUBsHSxXR%2BP5it93z7BAvD3HwNHHqHf3Pcw7bVneJT4HeuVnoHH%2FTGqG1mR04RV1qrLrfNW7sJW433A4uPu7rHId6TmtQQOc4H9oXNblgJ%2Bq67uzCZlL%2F9ixroMTUFVhVh9Nj%2BgAYPDTIn9ek4ExtxYY6feMdAtrLpqiuFbf4fO7ZfVKzI8FhbsmBH7S05XLT3DN3FYLP6tHIv1lyBJUoHLeJ3jq3y6LTa%2B4XKagHqSVguvdVKJrxlX5d8TsKs4Mfevr6Hj4oMGfDQms8CAhPIm6YqqSY7y0cofRGUUoU1jNzc3c4F%2BBJnsv8rg6kMTBUTB1CC1b%2FyzJZFBV0ejl4wh6CyzgY6pgFQpLsG%2F5we4FaHXCKhy6M6RrVE4t7JZbLYJ0sg%2FPxuMQ0hAdu3HCM66x6smFe%2F8sZZW8%2F1Ds%2FWNRFRT6vt9q0yJtxzNooETJdrE9CezI4DZ6e3e0uG7pa7xMRImGNwCVulxo3uVy3%2BecrHJxSkEeJj3RcKKqozWhH5k28UBu908xctJnh0TOknajmH%2F31Qb72cpQtUFhL3rPuluKZTQZiHB7nleW%2B3&X-Amz-Signature=9f7a063d4d0123b838d91da6d87112ced323c68c55b3746188deba59e71e0d39&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOFWJXWL%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034915Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIExjEw3%2F6T%2BBtqV6LCcZeyP8V8MaNn1i6gnJcS9K5Fe%2BAiB8BaYrMFtrtxZ3QWDXuCipOl6TLYuo9vjKx7aY7XCrxir%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMKf7lNx4Gn1%2Bg%2BaXQKtwDPU07KErPA6Sbvqre5nNtIaSzgNRpyj5rLwtAPF2gnd8T1OG6K7tC0KKlO86Zy3WfwiCWvOd7FEFgIABil7nKK4hCPsaFa1qow17s1EK7xuPKmyUuob18VPo8%2F4L6bbyV8zdFKyW6ct8S4dBXIN4QGrrFPbzsRuH9aFUJ1HXNY1%2Fq9LRJeXktbpbFdArCVbSCFIJEyOIhzXM%2BUt0Dc4xO1fBIy8OD3MdTNct%2Fv5eXNwINnM%2F8jzMr5w3%2FzN1OHgxre%2FEkacAba1GK3rKqZRuBhzcaUa56M59nKl4ofq%2BUBsHSxXR%2BP5it93z7BAvD3HwNHHqHf3Pcw7bVneJT4HeuVnoHH%2FTGqG1mR04RV1qrLrfNW7sJW433A4uPu7rHId6TmtQQOc4H9oXNblgJ%2Bq67uzCZlL%2F9ixroMTUFVhVh9Nj%2BgAYPDTIn9ek4ExtxYY6feMdAtrLpqiuFbf4fO7ZfVKzI8FhbsmBH7S05XLT3DN3FYLP6tHIv1lyBJUoHLeJ3jq3y6LTa%2B4XKagHqSVguvdVKJrxlX5d8TsKs4Mfevr6Hj4oMGfDQms8CAhPIm6YqqSY7y0cofRGUUoU1jNzc3c4F%2BBJnsv8rg6kMTBUTB1CC1b%2FyzJZFBV0ejl4wh6CyzgY6pgFQpLsG%2F5we4FaHXCKhy6M6RrVE4t7JZbLYJ0sg%2FPxuMQ0hAdu3HCM66x6smFe%2F8sZZW8%2F1Ds%2FWNRFRT6vt9q0yJtxzNooETJdrE9CezI4DZ6e3e0uG7pa7xMRImGNwCVulxo3uVy3%2BecrHJxSkEeJj3RcKKqozWhH5k28UBu908xctJnh0TOknajmH%2F31Qb72cpQtUFhL3rPuluKZTQZiHB7nleW%2B3&X-Amz-Signature=38b9c2c91f087c1bc5c5b55f2440617592747ee41f44a0ae9b3a9af28cab4fe4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VWXZT65%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034937Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDbpvPQuoSRAoMuVQpIJX5MqXp0Ml%2B27caPfOwWxmmJTwIhAN%2BC7WQ1xNntn1VdxlYSipTlh5ukso7e3AOpJ1UmUXThKv8DCE0QABoMNjM3NDIzMTgzODA1IgwRFoma7a7ZDBvso%2FUq3AO4lz3KrTCjzFd02ri%2BoMr7umPnT4mER2LXY2s9rMSyMCHr9ZHBwrCBdkCFxgIBwt1keC5nF0SFk%2Bst9eNzC%2BcUPtN4UZPTkzkurafTzJ%2FekVCHLv1hIvn7kNs1yVLYgYtnL%2FXmTUF5ZnvY9CNzF%2B%2BqkZCTW%2B1oa0yxKVEROs98%2FQNZsjeLe8IzTkCXzgxtGolWEGQ1p7v1PSZt64qlt8tyQSg4jQ0Is2YoTPYreGSWxsv4xQ7gRLyOtfP47YEu44kYdac93qtIJ1vD6ludmBGUkDnMcH%2FwQGP7T0aV9XvKjlOnwzSSzWaZIsdmcASeOktqMRQhlt7C7eFM0AJ7XTwIN1%2F2SW195rmScEu7n2LbrCBf5tXiVALv7hoVOvhnJ18T68o%2BUDISD%2B5x9TYOHKv%2F5qWrlbJWnStcA0J8aqzmMN3lbW8kNXvnzSTjA%2BxVgydH1s%2Bjt0AIEWtsxPj%2BXT4oFcY3HibPG8g7aUqzZT4ypLtUxP%2BpxF%2BxWvmiiNXoloN7XFiy9ZgNhW0koBWWWWlyFk25tNU8jHYFvzyRSiOHgdVMkUOSF9tO1ajbtVuhQRTN1CabiX1HWVMqnXKY6UTdLf245AzsTu1qQzzkdEzFjf3UcNg4Al9O0D1KSzCiobLOBjqkAaBZqz3ROo2o55Y11DSjWQL%2Foh%2FfXCfcO7pDLvuzjyqGtxW0ieAZFf36XSNAXIy%2ByDFvNmCUsQ6TYuWr3r6Qxit9Thk9ug%2BIRXg8VovJzHxPGQSbqxriLAGDx9LTVypfsru5Xqll%2FRpdp%2BBSsw7AY%2BLrfEOvUl6SEHfcvORVG%2BmyIANdBKRKvrs2q9qjIkOUpNCxkOzMMDDFh%2Fg%2BylBO12jw3tIC&X-Amz-Signature=d777b6403f62b311a9e3b1dfa73a33cbca0744275f3989d462cb9659dcbc9f52&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662JWWP2TK%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034941Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC8KrR6dXtZBm6axhUxhNRrGlytNYpKY22hELc3J7MmfwIhAOHuRKFPkDIyS%2FfXEv5JsVSgV3Lh3NL9Leown7tGrxQyKv8DCEwQABoMNjM3NDIzMTgzODA1IgyXtKImBsbY%2Fg30Kc0q3AN996Y4kf5b3VhWZ0KGyviV1hk375zkA7sBOGsrDQHBcW%2FcZQOWhLYsDexv5xB7ld2NYOnal83j4BZzvIyfXoGMyt5B4MwPbWjRSVmduzSVsgBq4mo5XYMKMnE%2Fi2gWlX6gfOlvXNu4L4qWITMCI%2BODFAjzJ3LlmZj3gLLo%2BCyzr7MJec8yfxwjzANqllUgHbgrKzC%2Fp13b%2FGkBaZmF%2FhOPo9u1i0XYBdmFBXABm2SwahI4eHRj%2FuF5iFa2zMznu5lPEaRlFt0KUD9VoWcmX3RJG6zfrTrVpfff49wbUYiv5ICJafTq01kOAZDm4mAE47Tcakq34iF78po3bNAwgHGATTfKnta2INLHSE2EHoVENvONk3u5zl4ITb5wJKkU67RpaevlZdPW%2FIbHwg4sYjl5%2FzdKq6ZXQmFPVilMnvD%2Bl6aRK0sumU%2BT1kNT5HHWbtE0NznVKasT9uDUHcT%2FOcEeY9cXTA8iRbgbfhiXoMO4%2BYmJIbcLhgg6UdpPFmtHS8tGs2XVv6AleM7hLReThoy44WbuA4QB8NfQx3EqA3mmKrPt2ER8Rd3OXhRwYQKOC4JlVrni3dJ92dDXQUS61bRgOWiiFUMsoLTk3qD2wUIopSSGV4mjii%2B7yw3imDCtoLLOBjqkAZ%2FwIBtGcOdSL3wAoA3C%2FOAjZ%2BLfNdMxSuyy71xD6pdzqQlCQzD0kMswmIM83CANN6ib%2FfWjuu6PSzp8xm22I2j4aglO1MHhi6HOi7JSYFwuK1Lh0oyaWFZ7V1GrVed9LpCwMxyLuabII%2F7MWsN2A1kXKwTbsx0u%2B8FZU61EJBXbL5g%2FEXAQrv0a0KZCTPOc1gJPmd8EUM7uewfpazurc9zwFqNB&X-Amz-Signature=c29353c2536799052888aef7e4e9068e2d79394d74010c7d4bc1bd394638fcd4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WZKWBLU6%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCAFhZ3TuKeRo61iNGYPEk8psRD%2B%2BR8AS01JjzWhVBqnQIhAI8R%2Bk0%2F%2B3f1ndb3BX8JwTsHA4E4ZyDXchQiEeWfiiAQKv8DCE0QABoMNjM3NDIzMTgzODA1IgzLk%2BLqXxr1kAn17lIq3APdOL8QMYdyVauwA9EUnWSSLKNeKECPHYXqmXYLGmzuz0qWXHeJcQjy3ThbgNKuuwSp5JTDLZszVHNVCoSh5GGxxGm9HmJ9jh%2B3rR37lozuRLikERGe%2F6Iy1Ybrpj9VMy9rRkK5lBmfGfLxZQp%2BsBmJhl4tsQOPhZfaPbw0w2ceDT2nDkwLYJJyQ9C43xvpVEqdE%2Bz4aWClsMipc7J88hRFelJ0OH%2Bf1sEgEMgPHQyOo4i6lb2XJN%2BbuyKlS1%2FSbLiW%2FG0fgLU2ajC6g%2FiqtleAuqgEd18o%2F9Qt%2Bxc5schlUdQ%2FgRamGZAlJO36OzHcDK%2B8YPZg%2BvJ3cThOX3djbBvya9s%2FDJYFEyNaK7IrEO4DrTxpUBazFwvV3DWynyYQxqC6jA%2B96izMlUexxUT7FjA4vqDLONIvzrXAChjcShvBNi08rdSxTclhEkOi1sNy94uosseLRNSTn9OAlOrlE5nE2e3Yr0h2TKMcNOlx%2BLRR36HmXahQbrL7f%2FoyYva73U%2BQFwQxPSP8drLQQwTAeFWM%2F%2BLFpBb30P4TIghRP1ykBsyAvRc18euYhwzTNanOLWXR9DAGdja9%2F7P8kK5IgIlzkmwnujhVznBEdKYW2L%2FijC557TP8ygKkmZ9z4TDhoLLOBjqkAavzs%2FMcaTTmono8AyyWXHvzP5IvX8fQNcpTFwa0EYnaoVLmTAWopmgJyj3J1KKg%2Fd%2FlHd3CZ1AMmNjeiBUCLeauRKPvdjS8%2FReYgI7rJXflt%2BTGZJ85680Rpowc9CAMY5znfJp0psIgrCzj%2Fpn1zHxVI1%2Brw41ygyqlMTFUvT5tpPa9VwmDWOAp0c3zjJC5t%2Ba4OuYetYLux%2F32Kb%2FXs8gNVCU5&X-Amz-Signature=fa275d3d908fa9cf863d1091b937a6a07f4cce11b5de0cb72740a7cef29a6fce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YY2JMEWD%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034943Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB9jQhaMHsPV9529kn%2BWXLJai3YHvN0q6Z62F9McOX5HAiEAnrAwtcOssPvrj7VvgvVGrv2czHm8Jp3O0W%2BH2qDSqyEq%2FwMITRAAGgw2Mzc0MjMxODM4MDUiDJvXLAEcX%2Bh6Ui5nOCrcAyNTVt6WwVLqh5k%2B9VF%2Bf7SGUtqFwoksAYwqmj49HVchkTJyqhn6vPEQI8ANpde3AYasnUml%2Ft8RDJ9zu%2Fpkoi7qwaCGugf6CZje%2BlMaQc3ckq1bU%2BEd1Peum0f5t2gwf3efUe1ShUsdGfnhrfYST%2FVy50e8nqPtldb0JHzx4rI3kCnSkylKM6UuM9ZEdcqhJ9OdyVpLykzjyzroS3ZNEZjxr2PYt8d5bvhiGdP06G53B2%2B4uavcKYRAu91Mf1cjUVPXK2790DBPNpxzPclCWGBJHKnnqx4fKxk4qQZAl5%2B%2BhxdbKDiAuF1ZyHbV7HPffoD8dQ231ZehZ%2BZ9GM9QrqTUYaAyRIrkHRVrUBg2saeg2rG0Qn2vNDBDStFKjn3grAa9RKDKf8Y0Oqno1ZKHciod1nb4RtZdYxY545059ciy%2F%2FiSoRq63erBLfwLELydetBni4O0uRKdu4ZNqigrHbcmiN%2Fc0oOHS%2B9O7C6GKZOU7duQNw%2FToB9Ei%2BAAhx8YpUJDq9u77ObKUy03Cb%2BSzbffcHLIEmg4LUACbpS1%2Fvanu1MOu%2FdpXo7ia0I5Picso0b%2FjqUOseFd4FGh2nwJQ%2FwYrHNFNd%2FgYUefZMTORbAtvFsreyV8UU1xlfnLMIGiss4GOqUBPB0GaWvbEKRl5U1LtaVjB4TEqvjyxS3Zh%2Fp8%2Fv60XUNHj39w2GqKN98yfS5zF%2FyS8%2BfWD9G3KazC85EwSA8OioJna3Hl%2FcpAvarFqW34HactZd9upOFoEcHPmcD4EyPVDILYI3K4k%2B1g52iC%2BlLOL2NNW2VRbzsaK6%2Bj8Pa%2FXUCYCmNTfxO2%2FbFOieYlUwjLWqvDSHQiAXNcjUIIDs6HsPKuTmvr&X-Amz-Signature=67e874e0ded61cee533fd7a94884b08e8fec2be18b65e11931fa0fe83a859b7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6F2IQ2K%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034943Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBVes8K1PcAEQ4osCl7NUlsE0%2Fh3JOL%2FhGWUC98HEBE1AiAWuUciKb8O3GhgnSYzSprdSY%2BrNflHu3uGAQ6PSGv4Sir%2FAwhNEAAaDDYzNzQyMzE4MzgwNSIMxqonh1ZxHQroPX57KtwDU4aNI6AvxZ72wReNLbXusg9%2BvlZeZP8od00XEdx3ABXssZiUXISerMYXunqjmECw%2BSRfPFatec%2F9%2FPgzSRConptIrwDGjnPfPhgPLpNsofliFGtMge8wPKqasPb7GcyQrV9Q5KF01hCtHUQXO%2F2UJ%2Bx4oIgYp10nhe1YHfPooKSB100LMMnnvM8dkAwMQpiOyX0Yo61E5BsyHf1CyXb8BXhBfF%2F1rIRETjdS7KozuQ8fiPbwxui9Cm4aG2dbpGnN%2BHT9huN0FiWy6W82SRLqKZIgSE%2FSI6Uvbgmu2zumkskWuUv6CIZsUXdGLvBRvs96s7Beg2Yjyb%2FAOdqhi2VmxPayoVBDni97LBydN5YQ6U9dJP1zrUq4ZP5RuSGZXuQ3jJ0X3C3AbgDXZjR2AeBHpna7HKYPOvwPeUjv7lj9fep2tKe9Lk7o0Ba7OVMhrVQS7jdMToSAH%2BTV87KTjxfhai90XHMu0n2ubmQdb6DFVHt21iGg%2Bc4%2FHrrJnPUHKZ%2FanZO05uY3JEzeJvL3JsfBOL6y0Qs0AdCREnRfdlyptTecVlOZE54mNeAiIcOjRhheaDX25Cavrvb7mEMJwkCvFkqbuipuygELUWvTPy5XAUGRU68at8PQSAQAWrww36KyzgY6pgE9o0AN4cEAjXb2c6Xzyg9jGW%2B3aANiljdAAQBjco9%2FvTeFO9KTrHiP0%2BVGVwt4BL6QEjXy1B4Q67dDaVRRWwSlKkfzNGyjKVxn3WYrxtWbjjbOFFGsXJsLX%2Fa8HQLcMdexEHhZsFRrW3or02c08Gf2ZRPwU2%2BRhFt8F80vQUpj7RklDJuNoKC8ej40jLdlnxJnMa5E8yJxG%2BHnzxEQ0I%2FwA5FlcOyg&X-Amz-Signature=2f64a4667c1645939f75e8598ccde899506b1bb5f6f7844a628ee712cb5e6cfb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOFWJXWL%2F20260401%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260401T034915Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIExjEw3%2F6T%2BBtqV6LCcZeyP8V8MaNn1i6gnJcS9K5Fe%2BAiB8BaYrMFtrtxZ3QWDXuCipOl6TLYuo9vjKx7aY7XCrxir%2FAwhMEAAaDDYzNzQyMzE4MzgwNSIMKf7lNx4Gn1%2Bg%2BaXQKtwDPU07KErPA6Sbvqre5nNtIaSzgNRpyj5rLwtAPF2gnd8T1OG6K7tC0KKlO86Zy3WfwiCWvOd7FEFgIABil7nKK4hCPsaFa1qow17s1EK7xuPKmyUuob18VPo8%2F4L6bbyV8zdFKyW6ct8S4dBXIN4QGrrFPbzsRuH9aFUJ1HXNY1%2Fq9LRJeXktbpbFdArCVbSCFIJEyOIhzXM%2BUt0Dc4xO1fBIy8OD3MdTNct%2Fv5eXNwINnM%2F8jzMr5w3%2FzN1OHgxre%2FEkacAba1GK3rKqZRuBhzcaUa56M59nKl4ofq%2BUBsHSxXR%2BP5it93z7BAvD3HwNHHqHf3Pcw7bVneJT4HeuVnoHH%2FTGqG1mR04RV1qrLrfNW7sJW433A4uPu7rHId6TmtQQOc4H9oXNblgJ%2Bq67uzCZlL%2F9ixroMTUFVhVh9Nj%2BgAYPDTIn9ek4ExtxYY6feMdAtrLpqiuFbf4fO7ZfVKzI8FhbsmBH7S05XLT3DN3FYLP6tHIv1lyBJUoHLeJ3jq3y6LTa%2B4XKagHqSVguvdVKJrxlX5d8TsKs4Mfevr6Hj4oMGfDQms8CAhPIm6YqqSY7y0cofRGUUoU1jNzc3c4F%2BBJnsv8rg6kMTBUTB1CC1b%2FyzJZFBV0ejl4wh6CyzgY6pgFQpLsG%2F5we4FaHXCKhy6M6RrVE4t7JZbLYJ0sg%2FPxuMQ0hAdu3HCM66x6smFe%2F8sZZW8%2F1Ds%2FWNRFRT6vt9q0yJtxzNooETJdrE9CezI4DZ6e3e0uG7pa7xMRImGNwCVulxo3uVy3%2BecrHJxSkEeJj3RcKKqozWhH5k28UBu908xctJnh0TOknajmH%2F31Qb72cpQtUFhL3rPuluKZTQZiHB7nleW%2B3&X-Amz-Signature=ff8730dc717743e77bf7e57acb33988acd77adde9149d504bcbe268e68024074&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
