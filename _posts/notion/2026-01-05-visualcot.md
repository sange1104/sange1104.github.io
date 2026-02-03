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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YVSAM4RQ%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDBcR0JwkldClNKrEZ7NLrKLctf3DZOCPNsfLoh1Xtk7wIgTnI3jYI6OKOBnP8EJjpsQ3bJZHfpoe5LDihm2MzF%2BtkqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJRwG7F4sdzpPqcrqSrcA7VRCO0%2FVUM7L1OudlDoOulM%2Fba74AcjHi1Zg0U5vvIPt0BC2oRbNDSmCXktVO24X%2FVs2vV7sc8XvKvQh7Pxr8XoPfaF%2BCx2MPV3uF02st4scwD%2BeckNxZPkv4xK3dMOafipasRJl6O8F0sg8tsyDeKJM8To7JaHOYmukB3pqyHLPjaBCUES6e5632xY2K%2B5MExkShsRJCQBkL1w4OeTbwwTkF9n%2FG9rJf%2Fx8MuEAuKWPgWzG7t%2Bsj0IqOHtsiUDgce19Nf4%2BlXMnxMkUNS%2BXdYRSxofDhVQqU4Ydzd50bS6Dmwj07LYwbFjlP7GAo697SvVkl6OTxNQaFL0v%2BEn1dpu3Ig7SNaf%2BlN8rDhnQ78wfLxhAL7%2FM7YaYiLuE5qz4OnCET8umZ2XFGxyX3C9E9MoOVn%2B1wf7pYmRFE22r6a3wJ9zsFrr%2Bcuqe%2FFi8fpZP0ljY8IeirTtv83zjXzCe%2FQQ32XhiJMM8n4B1QMX%2FYki6%2Bj3HRbnDH6I%2FYnXtKss1DPlECy7d%2B1YAAuyomFpMtmTS%2Bk5hBNbA%2B4EDH7ygiV8q1aGonU7iolA0G1Tz8J6S%2Fm%2Fa%2BWMTYUImd6BA5L1IvEYYttae1lv%2Fchbyhv5XyQJG3mqM4CpNlZdpTidMI63hcwGOqUB7Fpb2rC14WD%2B5O2v%2Bfayf%2BKkhR8ZULdDSd9in6sUIA53em%2BdvPWMGe3IacpZeq4Ufv0N6kVA18zVaYeypd4UmU8Br4rQwv1JmWT%2FGLetjC3i118IQY40zj5y67%2Fjjzt1IBVGCBQoZZKSlWJVWVZiyjBbNeIDsXZ3UVwuwPsy2pEyi%2FGSehfVLs%2FhxowZW4QhhJqtGHv2Cu8meO8PtkUb61tkxlbt&X-Amz-Signature=8c5512e46e24e396caa3ef38794336e1c93232e4693cf1f080cd36f13ab251d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSH5YSE5%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQCMMlHYjmmCRTFcWllrG3%2BlcfCsEgj4M9B3%2FvAOzoNzwQIgMk%2F%2FT2JHMCNGGirzX%2B2l5VCJqbde6VyWWH884%2BFfeGoqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPt1KwLrWSDysnGyqSrcA%2Ftb7La0D6RkDDxtCFTEr%2FaTEOP%2B2BsBW2%2F3SaOVv%2Fm63pVOU8zlbUe%2BbrX34%2F4QXE72qH7FM%2BqtnYw2vXC2vJK0LGuyl6i7q6VCzzUN6amaCBoFcEDNhZfiGl2%2BJpVExqzdQkcQfj85MbX6iqvEwU6oRnV6POSZiSa89mor%2BJKb%2FkZi4x8rWiJiFJXaUfJn2JXRCPJfEMQlVOBAZ3GxXpHTPxWzEwaMpUk3jsPO1OtK5Sy3zLs1Q0Z56wgjkp24pTgq1BpMgLS8CxDqxsRRLsCiSsW8X5TzSdvb5R7iJjXWozJo6wtKRy0J7HL%2Bit%2Fa53CwJ%2Bmw6g9K3oLQBrULmYLlcpoEuUW4NePShAE4klQ5vbIVcM%2BfW9ijU6XaORyuaVOVKcDiLHZwQHMDjqQDyFgF0oGU3h%2FNcR6XSx3rdP0wwJ3lSbW9rN4YmB9GAX0mCCpVx3beg47UJ25Fs8c52I4XGpW%2FylTiLvD725jlfCLZ%2Fxb1qU3o62MAokGTEDdDudPy4onBQZHuGNVaVzInUwmvu3vdYVtoXrOmDnJBE5ZNs0QKlWapdtmHrD79RkYemATP3U1LQx37eCZ7bGi2rn7o20uFEHK0e9NMCQredGKz8sybIQTNLCQTKtX5MM%2B4hcwGOqUBz1qhsUEgIwO1z%2BLL9ZwN4NC%2BzHSev34yasWVc0cBKGK7g%2FeubkVeKbqqNz9VQwJ6OmpUSzYzXigigCdmrQOM5F1mpekxopRY4R09dCUiKb0DgKNcvxcBfdHJWJIBerYuH7qPyPGP%2BXL%2Bvb6iFMHUQjli%2FshkyZTlRKTApi0tfcLX7TNLfY9XRUq5JT8aKYRkIUqoihDThNsfUuCU8D5jDTDhv6bt&X-Amz-Signature=b01a9ecb0ca6b02e22bd291760dd72e28a162d4613c0b9bfd1834cfbd5208af3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMOVZ6GM%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCID2gMXLtODNvAaQ1KiJKylUm697k0NADrq%2F9Bx1aZk5EAiBLJMqCyP2mOpVLvyTej9nWPfojbRSHk2PI4pDPvz6ZaCqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMxTIaS3%2F3a7Et4h71KtwDZw%2FLY8aH%2F9%2Fsb%2BrrVGMsmoPGKITWiRVIoChCoLhP8jBwPx8r1xXOdIA2JvRXKkuLR2Z61rCPMQnXDo8GOU1%2BIOtla8RW9Ty%2Bm2y63XFBIp6ku7I52Vu4czXjKxwUaoRPE5ndUlN6zvHqA9xFzkBYbMnqHMskTTt71Po%2BQWJOEBvRSn2lOfvc%2FBHhsBaLorokp6TKC4WsR%2Bkw%2FNfwO84J7a1n3lgDksSuy6BXINKyoHBR%2B35GgaW4it2VK0fFGDnMMyK8o8fTN1YqBxYfiNCc7Vl8ahOCtEiqowfm8n4OPw%2BNfc8ZvQetV9TTJ6egp3vL4unzKD8Ekuz%2BI2A8Ylq34vceBiZ1vFZC86XwLdtnPhgyIP6cDddMIxpEauDC0JN5HKJEVqnp2kBILAmNsOvT16EbTXf953oQOP0OMwxbKZfeslXcFnYrGG7fTY%2BpDuwqC%2BghChrfQ9JxuJKtzDh%2FyvR4GxryQ36KPmQECzncgxEu%2Bi7pRnE6k%2ByIyTfp39UUET7F78omCydufV5mxQkCU4EHBYzQuw1p%2FS6H8eJTENGdJKkARyiTRJAaHpuNA8L43t%2FTk3hEekAwNP7W%2B9yNEnMlw7pc2K%2FFojBb8mzVKNwIocRDGdq8IV8%2F5%2B8wyLeFzAY6pgFk79KN9z9iYTRlihd0U45882Z1kbdiWcg6a4HW14D6tIgC9lCeao%2Bmx2xa3xAXmO7INiqxH1w4gzGOaemKtWfkb3G6Dlo4WqrjZFMk146usg5PwV1luGSFDWDfnt66bCG0OHQD7eio4mIzNxnAprW4t6lzoxujthqS3TTfCgL5EExpTQqqWOmZ1foqsw%2BSMMqQwj1v%2Fybt3WQViEf%2Fz%2Fm0atmsfDFD&X-Amz-Signature=a0c79811ef64fd24c589dbe07991c7e9b82eaf96eab5eb228fb03c71dccf8b00&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMOVZ6GM%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCID2gMXLtODNvAaQ1KiJKylUm697k0NADrq%2F9Bx1aZk5EAiBLJMqCyP2mOpVLvyTej9nWPfojbRSHk2PI4pDPvz6ZaCqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMxTIaS3%2F3a7Et4h71KtwDZw%2FLY8aH%2F9%2Fsb%2BrrVGMsmoPGKITWiRVIoChCoLhP8jBwPx8r1xXOdIA2JvRXKkuLR2Z61rCPMQnXDo8GOU1%2BIOtla8RW9Ty%2Bm2y63XFBIp6ku7I52Vu4czXjKxwUaoRPE5ndUlN6zvHqA9xFzkBYbMnqHMskTTt71Po%2BQWJOEBvRSn2lOfvc%2FBHhsBaLorokp6TKC4WsR%2Bkw%2FNfwO84J7a1n3lgDksSuy6BXINKyoHBR%2B35GgaW4it2VK0fFGDnMMyK8o8fTN1YqBxYfiNCc7Vl8ahOCtEiqowfm8n4OPw%2BNfc8ZvQetV9TTJ6egp3vL4unzKD8Ekuz%2BI2A8Ylq34vceBiZ1vFZC86XwLdtnPhgyIP6cDddMIxpEauDC0JN5HKJEVqnp2kBILAmNsOvT16EbTXf953oQOP0OMwxbKZfeslXcFnYrGG7fTY%2BpDuwqC%2BghChrfQ9JxuJKtzDh%2FyvR4GxryQ36KPmQECzncgxEu%2Bi7pRnE6k%2ByIyTfp39UUET7F78omCydufV5mxQkCU4EHBYzQuw1p%2FS6H8eJTENGdJKkARyiTRJAaHpuNA8L43t%2FTk3hEekAwNP7W%2B9yNEnMlw7pc2K%2FFojBb8mzVKNwIocRDGdq8IV8%2F5%2B8wyLeFzAY6pgFk79KN9z9iYTRlihd0U45882Z1kbdiWcg6a4HW14D6tIgC9lCeao%2Bmx2xa3xAXmO7INiqxH1w4gzGOaemKtWfkb3G6Dlo4WqrjZFMk146usg5PwV1luGSFDWDfnt66bCG0OHQD7eio4mIzNxnAprW4t6lzoxujthqS3TTfCgL5EExpTQqqWOmZ1foqsw%2BSMMqQwj1v%2Fybt3WQViEf%2Fz%2Fm0atmsfDFD&X-Amz-Signature=b013211d8183fa6a7b1fe07f924a7b3d287e8bad0330902adade5d5f84e40a66&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XBNXOYOJ%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031244Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIGTsWI8DhL1plyshFoLJkdhxYT1Yr9tf13FyM9lkYRntAiAWK0rI6BTAR%2B9felAkLsHbBKvPyuP6JFhr4Scevep62yqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHn8kUiAFeSuLvkDPKtwDtjx6jnSJOS6VvwrN1lH30HFF8YVaTkpzZBGtGEoPdNSMxHpInxyuwygz6nRyWfpYDxNg9IMKCk5dDHmKEAJYzhSRLCfZrrLJblRhdl7wl6GaCQP3jEfg6Nogpi0JsffqpNNNL4wsGBPioZg0PwxYozBpoN2nssS3qTpUJ0encVO0X0x7jcj9mnHIJIumT%2F5pm5uv%2BkLi9nu1A6HCmp%2BJjd2eku5ORIFwJIUSTrJlQAkQZXUEa06gFtd%2BWO5vwnWaPC8eR9ETFijU5lMs8qGyVoX%2FjP2HuJpkqztnM3hhSBxtueHbbUUyksFJziKv2nb5qeA%2BTTi6Xw50d%2F63hPIiiWe2wQ0QlLd2XeYOvGQe2xBh5DkvVLA98trebq6KckaEhqvp375Cn3PiLWmQkh6Hg3oYix5oYMQVTnnyAw3b1izvnykIOVkm95eYQx6x1PhkZc9m2%2FlENOVcqkhMIIhAszdp%2BVAFuDQLaoBiZaQTFlAaKSVcPncRZ%2Ftw1fbhkFOatgX5sSr0y%2FQIXYgNLmlmbBnw2Fv5zeNAgaEJsYiJPdBmU4%2BySIO5MXAHl2yQcPO98maeZcFc0Z81QP8aHDmvgyhi3jsZX%2B5jdyXEcSQCaLeySOIrSMWsD%2BupvhAwmreFzAY6pgEIwrxwd0E0NgEqOPsJGC%2B76ORZJftZ3JTVnL2KwyIC0qO7UwELEnHhb9120348JiobE2M2VD7zWo6L%2BJrxPpPPQN%2B%2BEr%2F7iizxJCyB%2FsfZMx5cwkZ3oG8KeAiN9N7EBdDpxmIZmRZ%2F5U6ID76QcIrh%2FvnYsxrb%2F7gB6YqMl%2BW6fkoWg4%2FkAO4JuIRgpqYji1G9JY0VGoHyus4mjCz024FfN8YAItfs&X-Amz-Signature=8889a7daf898b79fe2e030b3be991c82fd39331c6af4398072859c44f705da42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XZTEVMGB%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQCdYyHbkFSJcQRu7%2B41vzUlak7OwWcGJCjM0bw4DHtMPQIhAJVavAJOY6AF0exrGQtlqSrE5gT4JROK9yf55BHnrqNDKogECPP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzH0WdehfR9X2P2A78q3AN70X1sLlGmX8Os2sP6uOPhINr%2FnkycA7RdKMCini4zypSKN%2FRXwxiJlR6hWnLUPjbrYdvhCcRX5aomv8B87qDYyWLA3QwMXVdhVKDMejmq%2BcGTx%2FsgzlqQvc3%2F9yjD6fj5yWhJWkk5rZ2x4zTTt8Me%2BMGDasLwF7Zggrrz6blCV0fabdcTZXpiwV%2BmIYfo7c1uxfniIAWTqVgD3gwxlWuwnWw1R3Y1soASHN6SZSjcbpLbB0r5PWZvJtTCTOKfaXEh0oIrYEBMGC5LwdO1ENrpozcHIBSDQ26F6iqIIbpTk660xrF1SYG3WBdmGixbI%2FIbcfHaVbc9Qq8Fn2rzVai6HaEZUpTqOEo3x9Yvmt%2Bhxv1saT2a7ZxGyyDSUXWABQwNr6PzqVmw2NWKVKp4MTvAUcLpvOGOd%2Fe5%2Fh58u0RZpcAtgftcDBxE%2FSUX7OOYPOjo2t47j7iODDnRcTyZjpkIiM0MyDJpTMG79BouGQOFJtksyjW8LHu8dElo0T17CBzUi5QmaV6Vl2bX6vdfTA4Cj571yDhlRqZfGpIw6F1mDDmfZKUjqm6WlSBuKQJqw64TW7jZ1ACiEsiYumNzgicR%2BvD%2FYJQV%2BM0R%2FEkpiMXdWL7O73jvRG6i6zS%2FJTC2t4XMBjqkASdhvpIAlcofyjlyZrQGkT4TxpAmelYLyJOCKE3Wyk6xbmhRoU4ROwV2n4EmQ6J%2B315z%2BtNKvWIEj3KNmPPOTF3iCeimsGAP8bCFhz%2FxDJFV4fpTto%2B8Nt62jZxP%2B9mJbqsmxmjRsGVj8o3s7qUu61%2FaRdM%2BAz%2BJfGOQU3HTsDSZypz7OiCy4s3QjtyFEuA0ti5zQPL9dDZFY2xkXiTaCNB9OrkS&X-Amz-Signature=3eaac0f8ea2385cef417a361909076fdcc62212e8e092b5c4a6cb6c76d86f1e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZIKWMKNM%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIDO%2BGiSubNC%2FDBnVPX8c7z2rqWXpP8w99TFfFVzMGyrjAiB2au7pAzrW%2Bv%2BKqf60ceLcbx%2FsKFDwkWy4l4WmL3TC8yqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMksvAa2OzK0%2F38pcFKtwD1sU1gjiZPPXYNYBGn2u69%2FsHxvt9SCEziFh2kl4Dy05ewt4um0GwbvW7HQEpOWEtw1hoB0qJ%2BVv7FNpG9SeaccpBdh8q35j9CBQ7GmMHg0N3qVc5emvWw%2BIZYyVNejsMzNnYH1oUZ%2B87WIm3q9qDya%2BUOThxYXt%2BxZiOin0Pnti2H%2F5g9lD3VvUO3mZEkUTfOAlbfC2J%2BqEWL%2Fz%2Baq8dczxf3tefT%2BQySmvsjCBKEEMS0rZ5UeanR%2F%2FcWXPyz2AycOHcj4f0jkouhWbRQtI6wJKE0Fl1hOQ8ZQwgoh9U8gsK%2F1LCuvpJITwdwMAiFnZx%2F89AplPsClqsXEFLCORMFmr%2B%2FlAB0LTybN55vLLBLlnoRM%2BpsNAOxqRfA0DFZXNHxyQN47bfYAUSPsjxP7VnE4ROARDRmA%2FIhVomhVG4KGLBqx4RwJ6FZIIM4K349915aNPthdbx%2FVYxjbrRM6WYEFRgAAQKv8QNFacEtxYNbkbEGZhb576KEWlqMbukxwW5e9umgBj5tr8%2B0QLmWKJ9WfbDfxI%2B50nKdOzARoTvr5M2VQLPjfh5GRuP6%2Fj7Zgu9SH7xXZfsgCxMKy8jGG7VheXc1NANaK8FzIIV5392sVqqCvtvgamZCDLsV78wr7eFzAY6pgGgxsciJmSn7QYZaWd8QUzfmHDeP1r1owObfyn9YG894R7WXC57svlAJSlIlFohf%2Bw00dXjr22snwh28TXyy4r9IxqqE%2B5y1UDF%2BaaKc4EQizT6MnQSyWqHP7hMnZ3eG5PDWjjR08ifgf0b1GIZdzbyNywf8RhGPNdefX1zEr0IXweI3QTz4CNDwhsfgk9lgEdE6OZE1bcjfQ9aBxZQ7pwJsA4z05St&X-Amz-Signature=e493a0ab41391893e2b072204dc4f80c396cb6318705b2a1bf5aa94325522827&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663GD7WDZB%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIFoFWogw6%2BOIiw6MU%2B85TlnLQBrqnPkPa%2BKX5R%2BXMrDMAiEA%2BO%2FR20k%2FH4vh3Iji9R%2FvgCkM4GDWUgIxgn8WvePLCQMqiAQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBFhxqlt0A1Y0Noa%2FyrcA%2FWCJf%2F1KD0aclLc6IXbH6PVWrCnR390o2jxRhmfifyCIDLodwCLxCMoU0dKgSxQ5CobITz64K7TRq0USyN6LJnVnHSAPQQx8XJmctgmp9fiaeJRgnTRANifk3uIcA05xwZGMvpaLJ%2BoBeACQ4PLyXQHndMgddxyODJ23S%2FCp0ln4FqehSGq453fp8CTwsvv57sn1OMscadVvzKCwkUgXpOQyHBXUOiSBGa5csbekUExqvqeqo1Ixgb%2Bu%2FMFlmTeRyerDcXDdYHIK02VM7QePbAH%2FT7aEN7oMXE%2FdNiWahxqjKZ0mZS9G657xdAgpbIU6wARLKLbpimZCsxI0Wg8IHMAMdrWtru01JoiqsslpRvlYgKLirAlhLbULIptC2jR5XEzsUwVTgk1FY75CaxrjQPTE2mnQT9SlKg1QEpyMR7xpRxXRKEpEHfp5CBWxq9%2FXtl%2Bhe3AGdqRT0vd4dmm2fOeGlOqfAt1tZFBJV187bFt6SK9lYt7sbpxcoDDo%2FUhTKalZAdOJyl%2B66QynL%2Be3s37kJdCOrGyMMOsD7fj%2FyKVmgSmPrsIBM4ITXu%2BfOujlTK9BLzNhGbrUFM7mdGorLtAxpZNbrJecLlfXZcRdQW85HZmvbkjhw%2Fz5OGkMNq2hcwGOqUBIqCiWM6XQhBuch4ybz0PvrTgr91im4skU1MGhUXCqYp7xD1ftMlm57n6kCmNTuT6b9edXw2VQW1vtpw3uZ2ZIliqj%2FFsB1aywqbyoJtOausgb5MNtCdlsEMcObJ%2Br4SXhLeon5tBPVXEE1noT25oSrBZuUKFOT22shTU0zfIT0JudSEVjto3yYZevpsfZjXdIufoO0UOr0Y%2FUEmZ%2FPFvElBqtrN4&X-Amz-Signature=1fff386aeca24409028f513dcfaf2fd1893b920c1b9cd4d5dffd73fd3ffe0ffc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XYSGBKJI%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031250Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIGFlyA2BqoGBXXo%2BsxecLZf1wn2HZqDpSykUO12JMPm2AiAJ27PABLA8kGj7ANW6XKd3KBPPIZEXbcstF1TJ4FTTUiqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmrWkXwbWPorNgD0OKtwDhOO57N%2BDpH7hPu%2FwgVEp4eyiIh4BmDystylARiCfttpgvg74vYAcB5SxlSpTi6rGSQKWdpHiRF2RJ2zQrbIkzGAnDFfcVStwEqyHaXvfKS5BbHwNa8VCdFfAZlnLKwJH339l5HCfYyTqwS75%2BbPf6YCmKMIdTwpSW7WfM5QKJ6rYaVStKGOlWIpFyVCMS5NEGA3z9dn51CxapL9oJF1FOT%2FLCikoGhpyHK%2BlSDzy%2BbE10sSHPXau3tbrTdjT5TM3I%2BLqZNlG%2BAsgXd4mUTX470N1PgJt3wxcsTlkWdfZ6l1KPk2oq22DICFUSAI%2FehNyWHKA8%2BTnhw0pbBRFpsnP3kg9AkNaWdwHTkHd34WNEa5RiEGfPjd2RJg8QhBZ%2Fiuk478KQkvbc%2Bk6%2BJXi0jmkyLTvcoa53%2BzA0eInY2nqpRVt0kU9eoTXMSv9%2BKxQXM1uwcG1CezroTGIUjp604aUR9%2FDNc%2BG%2Fp3NanoCpFp3iu4Kt5rSRfRd5DsBOUzZZVlx4X9WXgO8TKf%2BqWXE%2Bz3Vs49fITLU59OS8SQps3B669HeXPQT40c87r%2Fma9k2P9Y7aUpgvz3zPzXi%2BrVNuw8GQc22c70HGeIV%2FFYUP%2BcrX9vwjACydx2LP9LBnoEworiFzAY6pgGgYb1tN%2BCLhz5Ew3ZddD32maov32Qn553ZtinbolhikTsD4SBp70cWTJ7L%2Bpb%2FBjeMnl94DPylzsJ1J0hZRRhiK6B26eijiCOLXysfGTWEWJppjeNu9rkPbk5ofiLjv5GVDyDZTkx17fVL8Wsc37IoI9w%2FJ5R8jApk1ejqrC%2FqEVPgk25skwCo1srdSG7gVauxR5o4LNJCujcWtkzIF%2BXYoZrqHtV9&X-Amz-Signature=f3bdb0bd73dc48a3b6241f66e4cbd9a19262dd32599a3c619e1db4bad21d781d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMOVZ6GM%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T031215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCID2gMXLtODNvAaQ1KiJKylUm697k0NADrq%2F9Bx1aZk5EAiBLJMqCyP2mOpVLvyTej9nWPfojbRSHk2PI4pDPvz6ZaCqIBAjz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMxTIaS3%2F3a7Et4h71KtwDZw%2FLY8aH%2F9%2Fsb%2BrrVGMsmoPGKITWiRVIoChCoLhP8jBwPx8r1xXOdIA2JvRXKkuLR2Z61rCPMQnXDo8GOU1%2BIOtla8RW9Ty%2Bm2y63XFBIp6ku7I52Vu4czXjKxwUaoRPE5ndUlN6zvHqA9xFzkBYbMnqHMskTTt71Po%2BQWJOEBvRSn2lOfvc%2FBHhsBaLorokp6TKC4WsR%2Bkw%2FNfwO84J7a1n3lgDksSuy6BXINKyoHBR%2B35GgaW4it2VK0fFGDnMMyK8o8fTN1YqBxYfiNCc7Vl8ahOCtEiqowfm8n4OPw%2BNfc8ZvQetV9TTJ6egp3vL4unzKD8Ekuz%2BI2A8Ylq34vceBiZ1vFZC86XwLdtnPhgyIP6cDddMIxpEauDC0JN5HKJEVqnp2kBILAmNsOvT16EbTXf953oQOP0OMwxbKZfeslXcFnYrGG7fTY%2BpDuwqC%2BghChrfQ9JxuJKtzDh%2FyvR4GxryQ36KPmQECzncgxEu%2Bi7pRnE6k%2ByIyTfp39UUET7F78omCydufV5mxQkCU4EHBYzQuw1p%2FS6H8eJTENGdJKkARyiTRJAaHpuNA8L43t%2FTk3hEekAwNP7W%2B9yNEnMlw7pc2K%2FFojBb8mzVKNwIocRDGdq8IV8%2F5%2B8wyLeFzAY6pgFk79KN9z9iYTRlihd0U45882Z1kbdiWcg6a4HW14D6tIgC9lCeao%2Bmx2xa3xAXmO7INiqxH1w4gzGOaemKtWfkb3G6Dlo4WqrjZFMk146usg5PwV1luGSFDWDfnt66bCG0OHQD7eio4mIzNxnAprW4t6lzoxujthqS3TTfCgL5EExpTQqqWOmZ1foqsw%2BSMMqQwj1v%2Fybt3WQViEf%2Fz%2Fm0atmsfDFD&X-Amz-Signature=92307c4dc8de05980115d33b3494353563a12047dad5b2fd43558e4731afbcee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
