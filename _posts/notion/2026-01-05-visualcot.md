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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ZERZNJT%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDkDkFg2fJ5xSnlTo7Kc9I2lIm8wRR7%2FYErx5vVsdzVMwIgDMrxg2qMUtn%2BMyNigglkvFI2H%2FaZkvK%2BGByOVrC2cXoqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJNJ6e3s%2FO%2Byh50JtyrcA3IIhOyZwXIa2vI3Dygbg%2FoN6aDUaJ7fWi25FbdGw7a03ClFOLbq5pJBdXGHVrkD9PFjodsCU6WYL%2BrMrth7xd9e3b2w%2FacO5VS2febencZ1Mc0SVm%2FqofNBXN%2FABLcp0pn69dboWrRwVEYzsvhgpVYNPyxWWX1ChIZacrOi6FuoxNXZvZBm2YgOCwcaE2uwLQj3LU9qAKx8JuDvMnHY9kJIpiMFkIlKEf%2Flw8pTAwSbWqDweEJ4SyJBLEXzWuSbZvdQNyC79znDJBmJVhTxOCbYrwzbAKML%2FDA6h21pyVUfreWZUCVD7mxWjKt8IaRAMUZnVJAoNfv8L7B7L1NM1TKvOFM7ZJFpAcllOjPB55%2FL124l842GmIk9bYBQKHKJJKI0Qih9UOpEn130cO1zXnKcAPJWfTYN79tTV%2FcvNOHaRuq3czpcTwkEMa0nTttzh4af03%2B6SZTUCZmpmECRz2svlOtkqfIl9MZRjM2bh4mNb9U6FIyt%2FuTBMZu86kBBIPkBmN%2BVGniv5rPtFY3MYjs1OGc%2F8KT2vNQMS43PG9CbDgnz0Akdj5Z%2B9LzsggDNJgtX8S41GHr2UX8w9CYM78VUw9oYPCEzb4%2FaKQUpRPa8V4m89W8hlodSd1%2BcMIrtpNAGOqUBXA03tRJ8LUWozntdpmqSqLg0ifVgVc5aN2XF1PsDe8MCpBmc7opOz6pYLeTbxj5gNeIzCgyOzxYKAtIfcN3fmeIOcAP7hrxGHHV4FlBoEn3K2IsgZdkX9HIObV5755OzfISI0z6c1sQyIRbjBGjQU3rOqh%2F%2B1kk3BKznaOVaukObZ62esAI%2FdIVT3PyZX5vzjSuZO3lsl6FP0CRcB9QvunviFwJN&X-Amz-Signature=0b0cb719d88a5595b2b57b5fbd0ff7dac5a6e68748546c1436f489011568f56a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YD6KEHLG%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDKzHXxTbdj%2FCjXzLa0R%2FMJ0NshP%2F%2BsNNyGLNcnsq9TcQIhALrURDyvjiNChpmDMAxq2c42DXR0KGGct2ZP7B6oL80rKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzZirHLB7vpdGgqWwcq3ANpZpC3Ti%2BQvcryKoo5ou%2BSld8fkCtSuz%2Bu9CUE8o1scHwWgzG4Ft9fGA4zksjvVwOsqsu97jklbYb6PBaX%2BSt%2BzAafLvOOY%2FYSgMOo8QdNOlaWAXv6zzO7jqUBTUVJYHwmiu3cwDViFPCGkR2Grg26vZ83EaYqJd32WA5YbDNzUsFOEHXNlvKx3yec8WO0Xc8JZDgt8OajeaxJaaw3ynqojAP%2Btjj%2BkIan48w9W8zpDoNG8ZoJiRpskVhdL5M%2BrAToU3aHYTCHqqVk1grpNFpWcVpWYUfdlxnIF3mgaGCXphJ9ypBt3LYNzuW3glPzmNFQz9BHL3lMg2%2FErYfM2Z3v9EuP5cdQirTN8NGNltAxH%2BCXPML1jLkdKa%2B4BxKZ4B4uE4JJcwenl2mSqQxbtKySP94O8qe9B9SsWsE6JtmzpEzyJSbif7h50M%2FRZs1oHbkmOfuJUu2Xczga8Hd1NLQYRhOl4MXqGOfxgk4w4N%2B%2B%2B0I9y4n8b%2BbsO%2FhrydWXcMjUUJo46O3wHWCt3Wf4qhizLhukugo1ciqzXFnZ1%2BFk45Ygb%2BGutDKojLJ6Wy5uFdLGB6ET6RmrYISQHrwDzk4Iwi%2B%2FUJHSJnRFcOuRePDW%2F90rfccayKX1L%2BaNMjDw7aTQBjqkAZh8iS1FdUAPFvaMFCl8%2BNbk3Jpgey4FU28vVtDxb1CAAAqFXVAVnFd9rYVZS1Nk07L0lCpGLS380In9EX2wgVkZg05bPZZh2pn6%2FprfR%2F0lSAktazns%2B5rGUCm%2Bwq31lQBf7dmwlt092fpMwPiY6r3cVciS7VTN7zb6CajOiYxniXXigMlgr0YZvHHq7jtUt4IAeqPGVKLxmXmUgbyewLEDTcqR&X-Amz-Signature=f3447f1d87c2f4b97e94df46afce7d74bc37367c45702a3db68ab4ff9b36f46c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMWHBG6H%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCVAG86eAzNFc%2FCw5dSBTDv3svV%2B6aseNAjgM9A9THnZwIhAPNGlslyJc4H9v4wqztKcdfzWkKAL6oa97z1NUviAs6XKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzKHt7%2FX9LqgujXJ20q3APKATDKY5T0kacCgG1RbPkm4%2B71VZRvoVjmjrfklmGadnpdI5tU%2FAY6ScqI7rGhN0Bk0rvZH8OrVNRXv%2FotZ1fGht43ZhDVUf43tvwvbN%2B%2F733yEhKmg2zmi4Wk62DM1Ru%2Bcyki44gyuDWWBJbgkCvhHaEQluE1RYQXcps3sPqwI4brYVggL5%2BDeN7PooHpCtkTX1OFcsW2JlSyhSsFkqBsbeHk4tKpU22bA3AH%2FIDiuxWF4EzLsVZOlY6UVsKuaFGpecW8RcGnrxydvy1HSAO%2B%2F9VPwlWypNx3yRYtQzwgS%2B0MUDHyCkWr%2BneQ8MuFqCNr5XYHGYcdJzdnxzcy5rlf%2B1wlBCEcAQaTcTcOlFXtLv4UOzZqAIyRVGI4YoGf1JeqDBXEiTGyhzHRixz%2FzGUCGJNf8wSbrgxAPGnelEEoYK%2FynlJN6KPpZg%2FY7yd%2FVhtQ6mUAdhTSvVFEwVQinub8XtqAHeF9ExcjFf5O1Ot6ClAJ%2BsfjVEw%2BPMTwHHCxSY%2B9Y9Fu1DlDbKHh0Twf995kx6wxnL6Yqby8E0O%2BrU%2BKgQDIkbFAVelLQkPfyuwNNB1hvb8AAk3eM0WLFPOXeLiDDZvqYBTGDl29d9R7WbeFJ%2F%2FIacFs%2F%2FK5Two7aTCI7qTQBjqkAbHEn3l%2FSDWlhMGaQ8YS0YJGkLjJ4UbPrCpL8tQ6c3qlr6t2S0pEI6hqW7Kfoj9XZ7QqW1F8i2EECtYCoZuV0MzSExUhn94yunusTO1hJaTkeGOMQR68jQ2KzmhI5U0nyWzphBsTfsrPjKwEfelGBdW1lwWBSXYh9QQvXsz01HJZd0srL7KMXypz5IKenIRUzt8X9htbOUgf7csEO%2FzczW%2Fr6uqX&X-Amz-Signature=c6cafc7708fb92318e7f111e0a94dcc3bb25edebac3ca1d1f3f9dcd2c31f4333&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMWHBG6H%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCVAG86eAzNFc%2FCw5dSBTDv3svV%2B6aseNAjgM9A9THnZwIhAPNGlslyJc4H9v4wqztKcdfzWkKAL6oa97z1NUviAs6XKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzKHt7%2FX9LqgujXJ20q3APKATDKY5T0kacCgG1RbPkm4%2B71VZRvoVjmjrfklmGadnpdI5tU%2FAY6ScqI7rGhN0Bk0rvZH8OrVNRXv%2FotZ1fGht43ZhDVUf43tvwvbN%2B%2F733yEhKmg2zmi4Wk62DM1Ru%2Bcyki44gyuDWWBJbgkCvhHaEQluE1RYQXcps3sPqwI4brYVggL5%2BDeN7PooHpCtkTX1OFcsW2JlSyhSsFkqBsbeHk4tKpU22bA3AH%2FIDiuxWF4EzLsVZOlY6UVsKuaFGpecW8RcGnrxydvy1HSAO%2B%2F9VPwlWypNx3yRYtQzwgS%2B0MUDHyCkWr%2BneQ8MuFqCNr5XYHGYcdJzdnxzcy5rlf%2B1wlBCEcAQaTcTcOlFXtLv4UOzZqAIyRVGI4YoGf1JeqDBXEiTGyhzHRixz%2FzGUCGJNf8wSbrgxAPGnelEEoYK%2FynlJN6KPpZg%2FY7yd%2FVhtQ6mUAdhTSvVFEwVQinub8XtqAHeF9ExcjFf5O1Ot6ClAJ%2BsfjVEw%2BPMTwHHCxSY%2B9Y9Fu1DlDbKHh0Twf995kx6wxnL6Yqby8E0O%2BrU%2BKgQDIkbFAVelLQkPfyuwNNB1hvb8AAk3eM0WLFPOXeLiDDZvqYBTGDl29d9R7WbeFJ%2F%2FIacFs%2F%2FK5Two7aTCI7qTQBjqkAbHEn3l%2FSDWlhMGaQ8YS0YJGkLjJ4UbPrCpL8tQ6c3qlr6t2S0pEI6hqW7Kfoj9XZ7QqW1F8i2EECtYCoZuV0MzSExUhn94yunusTO1hJaTkeGOMQR68jQ2KzmhI5U0nyWzphBsTfsrPjKwEfelGBdW1lwWBSXYh9QQvXsz01HJZd0srL7KMXypz5IKenIRUzt8X9htbOUgf7csEO%2FzczW%2Fr6uqX&X-Amz-Signature=08de56e9588447543b61c267e2ba3d04bd5000023d26d2618238b9e8e32a632f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UWES5IM%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042259Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCkS9kXz%2BxoSwObNm0QWBa3mftxCA6l8RfeoYX%2Fq5zogwIhAP0aHTdD89JnFxUopmg0JyjbKGWmZr53hpdbbQ4n4yPsKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxHlR4GllqSmQ92Rsoq3APOimRj0UjcMdBRwOwj7oJ66doi6bctW6curd2DL8ziTmzWDQoevOQLJ95%2F38wfho76rVXdnRfAZyt7kSwwrTm6vouzPGPWmKT5%2BYjBkjkYfmhOEOwA3tcKPSxZyZE%2BDQKZvvyPRzglmrWFiAZh08jFBQefykDpd7dgFd9ijf9Fl6LWurmkXpdcZoj5GSCL9B2Ul4t4inpRsIWG4fV9myXY3VA7fY%2BwEXQoln0OHuIV7WZcGhP443ipw5I9mbh4ejk%2BDTKvttXSQnGpoZjAIg74RUes0wWhSrYeE1ooonKo0EkMf72%2BXc47lXDGyqwEflolsqOWonevU6cMKqge2IPySmDOTUfEaeeAyy91d%2BYirOCONUVooipQF1%2By9HHaRKZ98oI2OYgDBvi2B2mYLOIZ3aWTT8Ep3Wzo51gpL0fvlSaVEwHexBEbwYStFQn6bkp2Rk4OZIkZQcyiYI%2BpFFFTsDB8nA9Pau5R4ThGfWoZZ0LuXI%2Ftny2vNVoYsuh9IzkoooUSDGjq3lTQY4%2BqFe5x6lnPB%2Bg9jEfbqh0sqtrzarXBzZgt%2Fij9bDnL%2F%2BsGl7lBSy4CcJA%2FAoLtLwA4l%2BOf59eJBcFVcZ%2BN%2BwrXrOCN%2FAJIOtuMNk7kma1NOTDc76TQBjqkAfKYd4h8nnljdBE5QHR0D7mX2b1u02WdTNKl83VMFThEbvQd0ORR%2BGAasnwBDw3MVjiI3jS%2Bl8M2rBUYjqlr6GZEBqfSqSXKUsNnZOOE9vtW1LoRD%2FFegy7ZLwBzVNNJsUggEz04Jyj4aEhgGK5E53agHowYWmkbQm0VP9PlkeLqoJ2mYbqPuNLOISa1lwK2SaHZ%2F%2BoKhzVjQ02JhmI%2Ft6XhGaNj&X-Amz-Signature=f31867bd1077014d4432f23aa9da70077e97b0e282c7f282a7cc8c0509461aa4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YQFZJHEV%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042301Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCTxHKJG9hKRCcCyJGtA%2Bj76nj1DU4Zq6S6EngXrTwHUwIhAOrrHooC0dRvQLrftHCOdlsJcmGfhpEDU%2FXCv6QVszfNKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyLENxVPQWKLw%2FgcpEq3AODRyqigFTtudWVDQqtpDWDmuXwrCKqbrKSyriRRf0RCcTw2ZOnbLioJA6uYRRKJSE4aARc0z8npEuzT785A7ipp%2FiKgnKFkh2Ceu%2B7TQtWen%2BZ%2BbtP2faDeJUzF1zZIVNARBKncfs0Tp7Ondtnz7ZcIQUuQeI5jQM6plu2FVwPILumaNFxx1CYVgK35HHFHRjrBwy4C80EhZm3WG8JjIg0oM7chYpPd2hHdJbyrTP6dAtRgb%2F6nPEmx5NOm5rVSLcFwpgFckAVMv51Ksz%2Brt9NhyQ3M1CPl7FJFZbpUVFKhaFuP%2BTvzy2Se8fiAEoWWbr6of1GED0OHLA9f22YngYQ5KzKIw3l97FXQvi4iPjf3dRIqiRBAq2qvT1skb88b6o9TTnc11o0lQpHzK87z1eDz1ouySMgg8189giVqn07brGTOWGpzDWKeNOYD%2Bu5l%2F3zrx%2F8tWvpBlCNPhllDm70I%2FPiWxPkGDVUt8aqlOnxgZMEYiBPaPOG00nlJMMau4lS6lLWZkWhNpSdfmLhv8nuMlJwv93wqJpBt9sCHw6ZWJkmfzHv0OCtuCjl6s8KVpjku8akldn8w4GuWqLHl3Q9RE8lrN3iAl0DwzANTVMugCW6sfNPMFvkzGneCTDj76TQBjqkAU0XpGiaEC1w5LJVaZMa%2FmACaCqPh6J%2BKEUj01dClHc8UVMUlU3gjDRxk%2FxuDAJaKhXkZge4G5JtDyEaApXR%2FA6IU0iFa0XTY918rU%2FnJNON%2FWW%2FPVP7ZesanYODJoELRuVIoB5WhjGnQyYqH9%2BLW0%2BnNmz28o5eET2VU2V54kNbIJNPtNxhJsOWkB235Q1FUkfScsFQkzZBMO5RDVwH7IplE1oE&X-Amz-Signature=f3dc1ef5b07452f40512ffd5a8c11d66eaa789a419dfb5750deb29dac77e1552&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QMJASEUF%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCO3rFBTQ1YU%2F9G210obcpGfL9fOBwlBt90mhgVMylU4gIgMn0ar9F5%2FR4MGBqrGV%2BCYiikbPXu2fHWpR1G%2Fju8VmwqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGHS9SApknkl6rPuyyrcA0WJYwpujDEYIvD7VfSMpE1%2F0FqfM5lI47OedSOvcq1qPjpAl5W%2Flt7APc9gBSe%2BPn8J5gv%2FZrOkOj0ODK2J%2F12gmOMzkSHFzAg0%2FNvSnMeP%2F0X6%2BNSVqUZxAOoIdnlQleEafI5fRbo1WecKShktOio0t%2BNOhyXCavXKqBd2aion8cO2cE%2Bk7%2FrdrddzHvKee5Q%2BeR9ktRKAlJz0A5Wte7ayIPuZ6H3LKIbYQiDq5eWCXr8q80Yz%2FdugZ4bRGDjRScyCgkq5So2ExUSb9vcD7Xc0i8Y%2B8dXbhzBR8cl%2BBegtdp1zKuHtz5QxomSUZVPfv1OPKdV5Ru5566jS1YpOK2dP8m2BunCvd3RtPZYupGkQAbTL9HcT5OQbcX8ZHAUUjqd8fkuGVG0CWiIBkfps%2B3Ggui4RSrGTjt2bZIEqb2zMloK8r%2B3XswxZ3fLwCQuI1i9LqT9mryC47Epmf%2BeQgkF%2BU%2FMJWk%2BIyT9GQFbdJIGlx%2B8NMNNMV7xj39m62Rfh7d4TFqm2d6QnzF9ojikmA9AC6L5e98inlGdbXyKJbYBp81NkFQEUNO7rabjpCUQAEg6YLo2HSyxY8ANWdMBdJatJtDrkAASg80rEw7cIlW1U5sid1pOC%2FElTjRT%2FMO%2FupNAGOqUBBDDeYfqTlRMmDgRNby89FgQN3wfhMPgp%2FJAg2Ggibih5tjbUpDuxa8knu7eEJd1VHxupdOqqnyX6A26CLvNkvhmhTL0wdZJdJiJmToLJJ4lW9J9TfbNhNmuItEj2FNMMFD9RY83Uyzk82LmTYewMyMh46p2mf%2B2683wHreBJ59wTZSIvekYhGt7vBeNb8%2FpGA6XTQbMcPjme5Y2qs%2F9nl82Cx0HP&X-Amz-Signature=92aebd877a1dea1d48ae40da7837327fa082dfccec5e41b7f54dca91a74edc07&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXAF3EKG%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICxtSqsPL%2FWRgu6JtxsQkpWeByNhqtLlYJUJp6EBGIPbAiEAuUU9Xud0oCVZRmw5rJvkX3JZ9lKkbBROXBbn4JnNEhMqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDWjryZVLs%2BMjQt2JyrcAzlWQul5l94cgZBm8%2BUpiI0Gt7ktWlZWfOLTEx8wR8wEPLm2WiBQEJDsqGWh63ZbWnBqGFeV5HH7C%2BGvot%2FfZsLFytKRVyITLnLAfhu4c9SDQBqroaGxz%2FayEWusyaKK3Fhd2vaz2SjdH0wIO9%2FVL8jl4Qz6Bq%2FVePn1LAGi0gqPzTVbpngzligwCVXdAeCNTtgwMS3FB4c%2FFvRWkgqxfWE7GteHTZ0%2BMYpECvBHzj3I%2BBZ9O2w5S%2BBAZbewPYIh7Uixf20Cvx5ZQTfZSC7ptWrkSVcPXOe9a4NLvkx%2F6DtzjVO9CabgbMXEhlnfK%2By2IHBVoI0I7ULXJjCYBdi%2BlqjwtlpfNozeixjOoER7TV7ce027fBAEScBVJrz24pSrh0Ha5wrnLrPAgqMYH0xeEeV4vZzc6yCBFIE6A%2FcX1H9YrSyLGu93g7VtVc9UZEU1uFrRWBPaJd0FaK5gv%2BMZZicZMGN5tO2pFO1TZEqDrmKO%2F7GyCN7PCkedTsyuzaeowEV%2B8yTvdFzTTTUsMYk%2B%2Fp38U1aIlmh0e0N%2BNLX3BWfR05oYotDh5KkBVpeHQ1AytjAJ4AmUJ95CXx3EG2YdqqzEAuYIo1jvVHlqJ159TlKi5tcUKUQr100EskefMLntpNAGOqUBPNLWhsjvHWdcdENlWud%2BoZAwFToIG0J9dK%2FxRximhgwZlosd2tix0AsaSZ8QqN4lM0vTbOV1ehOWa6vWwl2Pu0cJdrtbQ57vVUdrCXZCgyEesxS3PhVVSSOYhMB2lgHQDOLrDCng%2BdY7kQAT2QJKz2durkfd9khFfYdTSQDcElF68rwzrtHilYzVdRUR2ZGotHihci9tvjKyqAEQcipoqzx20h0i&X-Amz-Signature=64f7287d8cd37c5312dbcbc31e46af48e44f93ad9bd78bb1bebc2c3fb864f64a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U6EMUVM3%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC8AXCD3KoByU5wMLb%2Fzv2NVWZwCtBJJH32T24wHoRusAiEA4cuCs3KK1RXf1u6t84hVW5TtZxahAyLUkc1IyFQPcCsqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGkcJ1xjaLEZFfMSqSrcA7Mjdh6UNN8JZTnIuOGsynagahbdyleghnpqXVCalkeaDYd56vS4I7oA8JNdFBfxd52ziYB6TCNdeMznCCwG6xGnfG0HzeZ3piLbz%2FvVyawze2Tee751UHxkl4VQpPX5m02EWbArrRTq10y5gqgHHM9wzgZJrzxOAPD1csLzjKwMyAheYuT7TfVjnsoC2scx395rBu3jSpGOgcXb6Z14oePYJKPJ8H7%2BNtsBy9UF5xsfWYL0fY431Kbd6cn3zCNeupATulYznlLpI1QgHjMEqYpzKYMH2v7VO9%2BD%2BKc%2BeNjf8qIV1cpw%2F%2FQ%2BS00UStEUQibZSDmPZCQVaOdBaSetaEWRw8Ma3Cnrva3Of9lIEqONujdNNcbpPY1aMRzA8ndzjJo5PZyKOUQx%2FNUXcjlwtBBZISt%2FKgPAYZNo0NHAbDsQEEG5%2BWtKAmzVdIQlxNOUQCEmpvdeI7M3x0x%2B%2FbbSjqzE1MR3JKvH9y82wa%2Flg890vJypeocr0C%2B3q5YnEnvEQYcH4P0MMskUmDN%2BjURP9%2FgPJilWjwRilPO3xRDJ99sAJNO2MKS6POpjuWmd0dJz6Kymxq5eR%2Fu05exx4%2BSsjGRjoBWltZcFZoN90K0mHoRSmVO6GrTb586IeqN7MPLspNAGOqUBSDxD4GayGveOkFLJWIx2tqxqYXrcu22Q0ukVX5xlPnqKrRvMDPfQ1piFwXDNwAE78MC%2FJFYcQ8yL6UXd3Z9CwCavzjxdHy0eqqQg6HCO3BKCwV18Q9U%2F%2F6dlM%2B2nxhQeAYFuGf6DqQUnf7F1qJUVtq6Ut4zHnLvxAiGeKuD8sJNnaVL4JzqPiZzb%2B244puKHP6lHWj4dYuexkfqpLow%2FHg2tyGbT&X-Amz-Signature=1d83c9de2b4ff9e6a67b39086d6490de6a4d2251a52ea58548562d87cbb615e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMWHBG6H%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042248Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCVAG86eAzNFc%2FCw5dSBTDv3svV%2B6aseNAjgM9A9THnZwIhAPNGlslyJc4H9v4wqztKcdfzWkKAL6oa97z1NUviAs6XKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzKHt7%2FX9LqgujXJ20q3APKATDKY5T0kacCgG1RbPkm4%2B71VZRvoVjmjrfklmGadnpdI5tU%2FAY6ScqI7rGhN0Bk0rvZH8OrVNRXv%2FotZ1fGht43ZhDVUf43tvwvbN%2B%2F733yEhKmg2zmi4Wk62DM1Ru%2Bcyki44gyuDWWBJbgkCvhHaEQluE1RYQXcps3sPqwI4brYVggL5%2BDeN7PooHpCtkTX1OFcsW2JlSyhSsFkqBsbeHk4tKpU22bA3AH%2FIDiuxWF4EzLsVZOlY6UVsKuaFGpecW8RcGnrxydvy1HSAO%2B%2F9VPwlWypNx3yRYtQzwgS%2B0MUDHyCkWr%2BneQ8MuFqCNr5XYHGYcdJzdnxzcy5rlf%2B1wlBCEcAQaTcTcOlFXtLv4UOzZqAIyRVGI4YoGf1JeqDBXEiTGyhzHRixz%2FzGUCGJNf8wSbrgxAPGnelEEoYK%2FynlJN6KPpZg%2FY7yd%2FVhtQ6mUAdhTSvVFEwVQinub8XtqAHeF9ExcjFf5O1Ot6ClAJ%2BsfjVEw%2BPMTwHHCxSY%2B9Y9Fu1DlDbKHh0Twf995kx6wxnL6Yqby8E0O%2BrU%2BKgQDIkbFAVelLQkPfyuwNNB1hvb8AAk3eM0WLFPOXeLiDDZvqYBTGDl29d9R7WbeFJ%2F%2FIacFs%2F%2FK5Two7aTCI7qTQBjqkAbHEn3l%2FSDWlhMGaQ8YS0YJGkLjJ4UbPrCpL8tQ6c3qlr6t2S0pEI6hqW7Kfoj9XZ7QqW1F8i2EECtYCoZuV0MzSExUhn94yunusTO1hJaTkeGOMQR68jQ2KzmhI5U0nyWzphBsTfsrPjKwEfelGBdW1lwWBSXYh9QQvXsz01HJZd0srL7KMXypz5IKenIRUzt8X9htbOUgf7csEO%2FzczW%2Fr6uqX&X-Amz-Signature=1994fa373343b7c7eb50eca60a9ee7b7b56233ca08a1700a08f09ca095a4267a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
