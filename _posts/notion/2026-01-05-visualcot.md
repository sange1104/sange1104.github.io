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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WG3PKFZN%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031753Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIG0S%2Bpl2wkKWO80DcVvGVLJ4XxG6W%2FVQBDX%2BV1kV%2BDL1AiEA4XKoPI1VryiONY0Lfay7hiMgy6N%2BojxByE1wgNIw4pEq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDCbakCOLH2FfWngTxSrcAwmOUosgSiqi1umohkHkuH5qjfgDnv9ZmPgZ%2FDEvNt6hZ%2FAtRrNzxKGHn3v4%2FTSMV%2FszZp%2FG6KGVhDgwk7r32ZZyrUXhHWqI%2FWcG2cTdU60g53h32Fp5zATIlBX%2BiSLlV57Fkhqo6qBNlXyMCnqIB2br21DtJPl0TVdPzWE3CddT%2BNpFHxJBwq%2Bcazxev9XUxDJeYioD0ISMtRR2hyCeGrzaXoOryOBwP1SZ8PH70%2Bg%2Fkl8YwrHRjm3an7sbGW7ljaPcFXZNqbIjna456k%2F2%2B8nbEMa%2FrvpYBzUOC1TY4by8PcBT17x0nlSDx2MnHWPNC5X%2FKDkUciNd1T%2FLVUR3iTO%2Bi9OL%2FER1CUYQP2liN0sOr5SUlb7%2FTf9ALOcTUzFXp%2BlajPUwONYHjUaaxBjNlS1sFAQbPVsIdPcBSqO%2FMJfJlNdNkuZaK7iA0rE%2FMr2JBkLv6nFyAdmxat6lvVsDgnd86C7DElAbPHVf3nWk8bzgvbhDqBBR3AtH4fdNhAsw8cQrWczFlWkX%2Fqqzp5AgSUsM9KIKttOKxGjsQAtpTbNnoMVlbkN%2FCXXK14Esr7ZbCDetVyXi2%2Fg7OfFWi8Z%2BbX5znnajk3VJFmeZT1Cy7YERjDRsAga05y4MMGKQMIGE%2BcwGOqUB8WeUkNHQGj20gCOeFBVJoVqV%2FwyoH%2F1pR3Z%2BFZ0HqgRqYbeTXD6zwnuYA4e2GqogDA%2ByxN92nvG6JY%2Bajn%2FdcZDtL7ByBwljsRtd2geRLMDoP4EN2IkOcjMBlPVkImZqbVA9cfCHTjPB9RNSk28JTqD2HIkrrhvAiO%2BROGEN6JeNGOfTG9QYwSmSCKWKE4Tt8MaeNFsDMGFmU%2FudEqZBBFcxp7Zl&X-Amz-Signature=49de06dabc8d32f2c6e71c6196d50be973427bb5cf938a98a2853889908b40c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z47NQC77%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031754Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIEUWqM0Beut09HuNHIRswn1K6wPSFq%2BFowqZGJEMsDSRAiBJuw0LU7qqHhzENfC95cqH9q8vx6YRrAe9704DsVI0tir%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMtoMJ4GvudsesAMsDKtwDo%2FvfTwWMV5Tnn20JQeNe0c31a2wTGfAWaFbjpPeFSsFo0Cj1dq07P%2BQQJrRQ1oZgEEmTiYP3vkwpEss8b9ir8hUeAxAOusQQJNtmM%2B8lIcReOHIxUUXcwgMDX87RHisGEZC93hgxQruelVVx0DYy9hotmKjwAwJJ1MJUxTqc7%2B3QJgx0ZRfwAEMK%2FKW%2FK%2BLI10nYDoerWn1wsBaPUfz0zKW98cKK7sbbyEDpC0TigSPG%2BEzVg0N%2FHWghTaIi9vTdiBbi1yO95D3PzLpKU8h1QuYbrtjDwi36i%2Blvent9EuH6QdpLiymG5pTXCsZjL3Zl4dgjwmhvMl7uT3Jx%2Bqyc4KNp3%2FHcZLv17rl5INAIZEz01KzNQ%2BKV2co9HCSnOycxvBWMCy5Bi1QzlGsTHo9QC59jCLTY4FrycMK%2BtRT44p8D3eHO8lqV6vW7F8JDXWGleSMujNj3qgSRJWLgKcXaZUeLyyjo2unhj3P06jGVGZ%2FR3NF%2BpjN55P8DZxzMTQgt5b6CL0CkFZ24wh7Tjo2b3LAmDIQe%2FUz7R0mWoFkgv9oFrJDFsxcOODAilwgobTDyhgf9Og%2FLNhQl1QsO0Lnngwy8wT75jV7Cb8yKiVUNCPv8uc9EHbFA9HsV8Ssw9IP5zAY6pgGrR1A9fvcHHBohWKO7QLwxOstdXsOuWqZh6ZlZ0Ffqw1AXepHBpkDBRUs3pTLzpZfc3ca1xBxQzxa34trJv9IKRxXYGfz7o9U4qhxDO9JVIDUh%2FpXYFxBNl1DUnrAwIH8GECtsVR6L9Qv7K2Ei6Vg1zDTCnufN%2BdDW1xQX6RY%2BwfsJhIo5D8DIhlBU1Ky3jmo7frUZsIwtUGKCqnODN3CE04WArY2c&X-Amz-Signature=1e9ca2da97dbf181ee64d39e93e1361d5290091cd56c9cfc58f02590561d0e31&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665LA6MWKE%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031732Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIFfobmvZ9krgCOIYYUC6mLyRpjyzd%2B5rNt%2BNnHctNEYEAiACvnOhNfKOz89oou2vy%2F2tvWlVdzLrQXNz0rlIXm%2F22Sr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMprsl1z0N3y7Otxn3KtwDzIV7xFeNFYC4eAQv5zXty%2BQWLVuzexLVnyp6cokT7pq5T5kkzkVMRadcE5bfSzlHtRlcJoTyFqhT6g2pUiN1vruHavnTw7%2B%2FAo9JCeGdLjYxXT0sfnLKBNJOqN%2BRL%2BoKusXL%2FBC7beXxMdc2OgBsUwvwddNzSUJpNchkZ9tsIR4gRbi6KO05mzm7tazVV32wxoY1RpL53nkRzO4p%2Bi5QkJ85D6And3d5%2BSDCQpRtuz4XmpaDeMDNGFv2RNWlyfz8Cm%2B1RDNqBDMRtm2w8sLiiOjgTHFqlF4nuS8FYaKOAZ%2Byfn42xNufahQRV2%2BAr3OqzoqHJ%2FU0cv%2BtfSCd4Oib47JKrGKBagEy%2FeIL1ZwP6VQpWAL1ylCEgXxZ9IFCb2t%2FafGXR7JmRSSTibk8bTvjKDdUnacOMaR9SPB1D0NsfXTXVwLtP8rMYm86jtfbxr79NvL3HxSYD7YWw1k24U5vGEbjIoEtaDI1kXECUEuCqPs0HLZT8o043VVoplS91rds26hnY8KPffxrWhxObourFzPU9R%2BSTSNKRb%2FPKW%2BfzXDUD2P%2B%2B3xvPXeT0T4l4v9Ynvdy1HGhtxDKotP33ZA6vIwBBh%2B0LRFIPLQhKt1BqfyQZSWrXf8G0NScjnYwyYT5zAY6pgHnMmeFPgBPkxKCV7I26Ai5aljW%2BVxhRDRXllaNwnY%2B0O0Cn2TA4SW%2FyiUQpsndWlBX3RSxZpIyWOcZuKhqmofp%2FwyfJwfuh7DMJm6Q8VlYSJQEMyfk5Tu001g84UH884wRfbFu%2FwNWmaABgrVzEK0cSXyTOjkVW0w1WEAfpoC2pXvEljZE%2B4eQ1nQa8aYq8aWQa0d9dJ9b4z%2BbrrGKZKTAFSu7wlM2&X-Amz-Signature=ca37dd5417978a4bcb6f3ff082edc7c6f77438d62651175c2895a3f1de806152&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665LA6MWKE%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031732Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIFfobmvZ9krgCOIYYUC6mLyRpjyzd%2B5rNt%2BNnHctNEYEAiACvnOhNfKOz89oou2vy%2F2tvWlVdzLrQXNz0rlIXm%2F22Sr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMprsl1z0N3y7Otxn3KtwDzIV7xFeNFYC4eAQv5zXty%2BQWLVuzexLVnyp6cokT7pq5T5kkzkVMRadcE5bfSzlHtRlcJoTyFqhT6g2pUiN1vruHavnTw7%2B%2FAo9JCeGdLjYxXT0sfnLKBNJOqN%2BRL%2BoKusXL%2FBC7beXxMdc2OgBsUwvwddNzSUJpNchkZ9tsIR4gRbi6KO05mzm7tazVV32wxoY1RpL53nkRzO4p%2Bi5QkJ85D6And3d5%2BSDCQpRtuz4XmpaDeMDNGFv2RNWlyfz8Cm%2B1RDNqBDMRtm2w8sLiiOjgTHFqlF4nuS8FYaKOAZ%2Byfn42xNufahQRV2%2BAr3OqzoqHJ%2FU0cv%2BtfSCd4Oib47JKrGKBagEy%2FeIL1ZwP6VQpWAL1ylCEgXxZ9IFCb2t%2FafGXR7JmRSSTibk8bTvjKDdUnacOMaR9SPB1D0NsfXTXVwLtP8rMYm86jtfbxr79NvL3HxSYD7YWw1k24U5vGEbjIoEtaDI1kXECUEuCqPs0HLZT8o043VVoplS91rds26hnY8KPffxrWhxObourFzPU9R%2BSTSNKRb%2FPKW%2BfzXDUD2P%2B%2B3xvPXeT0T4l4v9Ynvdy1HGhtxDKotP33ZA6vIwBBh%2B0LRFIPLQhKt1BqfyQZSWrXf8G0NScjnYwyYT5zAY6pgHnMmeFPgBPkxKCV7I26Ai5aljW%2BVxhRDRXllaNwnY%2B0O0Cn2TA4SW%2FyiUQpsndWlBX3RSxZpIyWOcZuKhqmofp%2FwyfJwfuh7DMJm6Q8VlYSJQEMyfk5Tu001g84UH884wRfbFu%2FwNWmaABgrVzEK0cSXyTOjkVW0w1WEAfpoC2pXvEljZE%2B4eQ1nQa8aYq8aWQa0d9dJ9b4z%2BbrrGKZKTAFSu7wlM2&X-Amz-Signature=b1f416ab32dfbf99d00e3de374e8af5bbbb085dba2affe8936b6f3d1c8f7aacc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664GPSTQIX%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031810Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQCyajy757ey%2F7z%2Fk6vC0XnMFq%2BOU2D0XVeDO7jr2kUqxAIgY0pNHiuiwUVhWCl4AAusFTd9RYfJqgp0dQgq6r3avFAq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBcHYiiYvNtvL4k%2FQSrcA7xcVn5JRRWa%2Faf6NGbzy0TLbnq%2FMutSX5Je60QKr3M5N17JpGfDNa7%2BO3tHTnrvbtL24gPzWrwQQGeCJUymOe7D1Ed0rAHLjCPufl0WUylGVPy7ahk2UDVadZsmSA5dEnjzEI%2FWUkI3ZpzSWR23zLnKVa4EtG5LcmHezEaGjZneVUR3gh8oOmWRfTqUnH499a82JqzmqRS9xg18RVNuopkMztAYKCgLbnTSgyMTQu6o%2BYzNzfzXX7%2FmhHk3GZe8upS4PS3Tolq6s9cfYyXHt67RtwbapYa6zopFtFvyIqRD6DCJV7R6Uh6GyTKkSl1Xq1wjoQykuoY6KgvgXKJefnQbxsT%2FP1LZIAdOmhx850XCiOaU2psb5V7299iLJPiUMQMLPDJvMOOf%2FmPDwWbRASfNIorfsB5bTByg59U2ygwNDAXmT18AXHA8jffKHZPUCt9SgNytFG5H6GOFtj4RzgvFI1FgsltmipBI8GSJG5Bx4o4H%2FkQx18k7F84I7Lx1BSgM5uMLcI%2FooW3YRF5HdDCbx%2Bz9%2FvLNzKjqHXIqTLwGBABLDkKIQM1KzyHcS9A73og3AE8wlzzrqH2wJOyJkYIpLgX5cp2bi7qR2Dg2a18z7TSrSZ0pMUNBPd%2FHMOSE%2BcwGOqUBaJEAYPRq2WjiR3%2FekMUHrUiO1gO9EnrTNYdnBZbmVQTwsPyb%2BFnPp2IInvQDg65JFrEbIRyOOB3HizMR0Jf0NnnmRvc%2B%2BNpae7E5Okhx8Cde%2Bf7OKsQuxFAR2VrQ1tl7sgQ6SzOsxhvXuA0sXxf%2Bbo4uyodr6ru5%2FG07IqcRrLZORsIfekKkC3s4En%2B2i%2FbDSttqZKu8MT8ZZ8xb2njFXFk4IRLQ&X-Amz-Signature=49cc330cacb31c5de9c4e2a7fc4e70a94e841a94db1e79f2712f03931ca28dfb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VTDCWCJD%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031816Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQC%2FtAvLNmmKU079yaiM%2BaMNymj5iRufsqCGmXqlbWYYMAIgEAyDJTBK4Si5aQTES2EW4VG3C%2BaErhMHtfrKUW16AY8q%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDPUUU54k%2Bodk6W0%2BryrcA2ygYpxzsfMjbxvbuixqMmk369tRg4dIJ9R1H8WQ7GRNR8wZ8K%2BWZZh9mcCA71%2Bb6RXNcp9KWKAfQ040wbyfEg4b4y2vmd2MD0IJhmW5E7whmyzN6WHdrkBmmamauHl%2BvW1dNFeIjugpq378l7RYZDhn8N9sYtywncmOYRam30yVvlt6a%2FGFf2WBUdev5qQqNKyd7OItC8kjzVrwmwROKMLzJltzAOTWLTrhPakCgvBQDiHLfJWjRT209j7Q8l6pfnD8MrEt6Bff3IZNt0bPU4fEs4UWUKomeXBYjpDSRxNIC%2B2yPTMHOS5%2Bi0AasD64OhoNhn2770cBDrAqcJoIznqomnUi7dhXo4Bolfi10U%2BknKI9Mr9I5tn0Q6LpgSOUi3CyXLIXhobB2sqcEfzaazskEaMU34ihBNC%2BD2ReqGL8%2BgRXWW0a9AsLXwH4F8FjANrlaYQSXRzYvBcC9Zc%2BAaZWS4AHn6dEpY5fZkON5Gf85BQ6Xw4Gm0aCqLMR6sgqtYXlDDZsvKh2cU5ska3AsSPIafraY0ve2PznYx4JOPwlkIwohNGmnbuanLHu1bctnNS1C95UMxOMKhirwFgQer%2FxU2DUAU5bY4WnGC5YqlyEupjWbzRKxFX%2Be5U%2FMKaE%2BcwGOqUBUiITd8yqZlu7bDKl7EgQ%2BZyVH%2B70Z7%2BzS1NQ8fVpq3jJawM8rJWQTyd6SLD3WwNhUyf5yAKNdn8rg4DbKNn6YNz1Y5ETkXGwzP%2FxONcekmORpUN%2FG9K4ILCr8Ca%2FoMYWFRs9FM4tF%2BC%2F4Tms5aC7vKQbW%2BoFVHrjkE5YBBzrQTqWtbIToxCWr7tt9FRksNzRRdBCATUosYy%2BYwnjM8puIKTh%2BaUd&X-Amz-Signature=bd54aced45c20b4a6d2089ca44efe3e43c358807809468b7502f46652f9c3206&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665RLZVVLG%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031817Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIAEp71zKsn0D%2FaltR6KuSP9LmG84uiDLsKWeHDcQ6hePAiEAylHheddfN44rVwpHHB%2Frmsq75nFDqWV3%2FuEIkbUuJtIq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDIm8c70%2FVRaVHRnQhircA3EWLgS%2BX412jyJuER2DUBebffA1K1ToZZqQCMQ5%2FodfyTIj8VYA%2BpMe6SSmNGT1R%2BZBpT%2BwRsU%2FZCQdtKEw%2FafXEJoSWsThI18HfFKVIXWE%2BhE5bSllcSvPK740X9%2B4vU8WZ%2FA0IbXzT3nGsat8SUxQt75T89aX1ldY7SlgVG5S5gkwSLriHgW%2BwwbE0pFPmiWqbM7qdpL0%2FwKqvLlvqMmpK0RcYQDdszAXgTJQdaQmq5WQrsR6xqEz86z0Y9cly2yOQLbPkVVjZXmEaTeNG%2FeUNYVijqMIKc6lcCec0XrVIopYKCIJu05NrCOkvexTXCyskZWcpHwHhaxxSrzX9yYvpzE1vecO6ZKeioLKVWxjPdsCZTPXbz2ueAQ4fR5K4CdSmKcAsIbObgcrXrRjNp7iPTwcSfKecv7LPBsD%2FNxI04ktAl7c%2FC4VjrsfFxSEDvuhP2iNYlrnoRR6ELEEiZnYTXYq54HQa88XfIILGgeh5ECkathcVBx3DoIY5bdR59rMxC8jo8tCspfmgj2ovqhGdj63bKQrzEFxfDUn4tBoeSyxWuv%2BpSn6JBkwgrM9mmjihxwyVGvX2G%2Fstmr7pkmbdtVKuQypgY3fymAj0QGKCFd0heakG9JJ5WXRMOWD%2BcwGOqUBOJFLu6VeilSHlKT%2BWrvbFoR6b5iXYmIoXGfp0g8PiS0zNqbxpGDqok81waKteP%2B%2FEsbGC2n7zNEBjq8CX2nWwSfk9UcSEc7GEqqtA835QAUsYiVNly8BZ08IaPzg%2BwWAYKz%2FQ9DNTdKBDO3WCq%2Fs%2BqHP6%2F09FWq%2FN73aNeU0gFmlk4Bvx8rYDIT2pH4bri1DfZYG8V%2FPFfL7AGcWvYZd1k8AOiXB&X-Amz-Signature=9237089674edc8fc4b76379b09d3af1edc529d81dcdbb92f2910ac1dfaa009f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662NWCZCIC%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031818Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIFbVn1LkYQTytk%2B2WZ00n7bLLU4sKhP6rXthEvYZeKeaAiEAympMPRHzmlTwCgfD52C3UgSQ7jiuoteuo9jssXDIkKsq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDE7T4pfTrV1eoHv1TircA2iPYGbKGlJ9b%2FojTCGJ60dE7Bsp9dUDhII6rCosF0%2BqEWlcKnqItBE08XXMO1fMgyvuzpAIwR7dD4ZSH0Xrm9eCOO5M57ChVXirrf1KPE7VWbB3kcvigaKb3aJHWVeXTGkaVTK14Dpb3lt9OJO%2FS9zXk6dqbCNdXxbszuYZ0ZUx09qbkihdhsphVmoz7WE6wnc7Hgh2ix3FK4fp4sxAlvOdzt59iD7K1CMKqkh4D2S%2FlUIGR551fesJ8YsZg4AAELlOgJ3JeNVzAia8a1976eXS%2FbBU6jZ5i1xXy5lh5NH%2FfAXVTvlmXdrLkWVjp1GwSraACYCw68Ri0J87QwtPsuJMEHm7VQzUCLZQwekka1%2BPX%2Bex%2Fn6d7IZ4YO6KxoWzAvYvzdu0TB8IaTqpQWmwgGIFA81NtT5UCF721aL6jkt0ZJYpfv21RQ4t0%2FVgzhIilx%2BFEfQn2gtvDLtf62jJagVIgMze9S%2FsrjJkPG0j%2BdMeqg%2BWpaVCg06dXSvSZ9RFl7sH0UEEMFWYAcNRVoe%2B9XBDxHyzzaseqA0eyTVZM6n6fF%2FV57Y%2Bew16yo1F4gEFeLysUJ%2FQ70dsXUebxwpKcW6Si82%2F53BdwWoyhSO3tlamj3hk6D1HXMJLYW2AMLyD%2BcwGOqUBo5YOEgJ%2Bi104NneHvFZDCny%2B4S3ubqog8wIEaTZANyrWj6fCSDSKmSN0%2B7EalAvHpge8nhQLUiHnh7fD97egQaabW4%2Ftq8BFGLJJipS5MM4o%2F%2FA2O0rHxim7aeWglue6CBkPaBNrQ66LZ2Yr8rJwZ516b7sK1K50Ec852OsFNX8PxUuxA%2FtWRiycQnb3SEgeWgpss8VZjaUtIVdiHk4TWDo1HX61&X-Amz-Signature=127aff3c4ac9f36de30d5cc756adcd4a8f185721a63ed73a8d0e47c21e741065&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XHRN3YHQ%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031819Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQDRFvQhvnqXEl2HGx7rFZCBnQYtJRNEOLt79y8xa0RYkQIhANac8ofTuPl4USNlOPHXqrtxfQzw5CtYR5nBLx%2FpqptFKv8DCAIQABoMNjM3NDIzMTgzODA1Igy%2Bk6BZPe3mUrV%2F9%2FIq3APmdWzPQddvuc6AUi12%2Fl3MdnFjfoWtRlionzcCdg5DRfN4dqnXCqbFBC4gmiXQGCpCwuCCHV%2F9X%2FWtvLyzzPa5PQWFM1C5llzhoz8BFr4%2BcXz5e66i92mhYmYi3rj8fKCr4TCcVLbQBQBek03R3HxY2AEHPj18ecIviXoQnQGLnMg4gUEVSND4eIG2lSBD46SJVS2N0IbuiM7F3hm6nd9V6J8zecChWsIjbqj7Yp%2BK0MuJArGzkR%2BeK0JwqwLBOe%2BwQG%2FUc%2FjR1C%2BIC6ZcCQZhlJYRQGg%2FeesxZzq5M3lBLacmn3G6mm5M2xMQ5sCFrThoU0aPNC0WKqXT0tiOHBnZFPpb%2F5z8lhsxEyCzwchoZ5Hq7DsEI6sE8rA5jKMwgJAkM29I0nZWMP3fq3w%2BbxJAhtD%2F8A5V7nAT66pDXKGQZVsb3FT8fZQIIbJrTDhy6OKFel3HgcHeSzJXQPwp0Oa3R4AI1XVNS6HRL6ZPgUoylMJAN1eRFOgZCKAKr1Oftx4U07WCMwrdZWCXBj4cRxLhfqgCNrPH2bdVojKQ7K1zeO9FFCEnQAFmmvQQEtk1p1YHgZDPIyH8fpAWqSC%2BRU9BCOtn1NsZW0CHccXugIqHDHUj9R0Dr0HPC4QKgjCjhPnMBjqkAaQM%2FEvVCA%2FsLhK69YH9hqN0%2FrGo6E3RUXuzcp6Olw9lbpuxXSGH%2Bb94uue7QHgSqaqNirLhhTp3bKCep86ihj6hzxu331%2Foj2GnQhvfohzCu53K%2FuH5Wcf2D00Q%2Biw5N8FQePTBddqjuAH1afAUDYoKUbwJkPayaPqThGMtvObrwnfe2Ic2WxlrIqhGPAI4i30SAlCdAmXmZrQGuQWePXBVxiPH&X-Amz-Signature=47c5491e8e1957478636f21ef6a6ac5de8b44918e15cad7665e333b49f57e04f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665LA6MWKE%2F20260225%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260225T031732Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIFfobmvZ9krgCOIYYUC6mLyRpjyzd%2B5rNt%2BNnHctNEYEAiACvnOhNfKOz89oou2vy%2F2tvWlVdzLrQXNz0rlIXm%2F22Sr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMprsl1z0N3y7Otxn3KtwDzIV7xFeNFYC4eAQv5zXty%2BQWLVuzexLVnyp6cokT7pq5T5kkzkVMRadcE5bfSzlHtRlcJoTyFqhT6g2pUiN1vruHavnTw7%2B%2FAo9JCeGdLjYxXT0sfnLKBNJOqN%2BRL%2BoKusXL%2FBC7beXxMdc2OgBsUwvwddNzSUJpNchkZ9tsIR4gRbi6KO05mzm7tazVV32wxoY1RpL53nkRzO4p%2Bi5QkJ85D6And3d5%2BSDCQpRtuz4XmpaDeMDNGFv2RNWlyfz8Cm%2B1RDNqBDMRtm2w8sLiiOjgTHFqlF4nuS8FYaKOAZ%2Byfn42xNufahQRV2%2BAr3OqzoqHJ%2FU0cv%2BtfSCd4Oib47JKrGKBagEy%2FeIL1ZwP6VQpWAL1ylCEgXxZ9IFCb2t%2FafGXR7JmRSSTibk8bTvjKDdUnacOMaR9SPB1D0NsfXTXVwLtP8rMYm86jtfbxr79NvL3HxSYD7YWw1k24U5vGEbjIoEtaDI1kXECUEuCqPs0HLZT8o043VVoplS91rds26hnY8KPffxrWhxObourFzPU9R%2BSTSNKRb%2FPKW%2BfzXDUD2P%2B%2B3xvPXeT0T4l4v9Ynvdy1HGhtxDKotP33ZA6vIwBBh%2B0LRFIPLQhKt1BqfyQZSWrXf8G0NScjnYwyYT5zAY6pgHnMmeFPgBPkxKCV7I26Ai5aljW%2BVxhRDRXllaNwnY%2B0O0Cn2TA4SW%2FyiUQpsndWlBX3RSxZpIyWOcZuKhqmofp%2FwyfJwfuh7DMJm6Q8VlYSJQEMyfk5Tu001g84UH884wRfbFu%2FwNWmaABgrVzEK0cSXyTOjkVW0w1WEAfpoC2pXvEljZE%2B4eQ1nQa8aYq8aWQa0d9dJ9b4z%2BbrrGKZKTAFSu7wlM2&X-Amz-Signature=a3df1d757b03fd24e980413ef0af699072505262164d71ac5286834eab2387bc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
