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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YWEYCSPB%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031334Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIFG%2Bd9g1Ob0v2mxYlvodaz2ZN9jR8MVtHra4CE3Df4ATAiEAlheWYSBthT3epNH84vPyo2YX4tl0pODmtG5nm5ZbkN0q%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDJmxYJ4e%2FD5FCaOXTyrcA%2B%2BZXfQ%2FwMtBku43nmwsa4NbTLQ4kE4RwL7nE%2FQHQlsUnmWWNra%2FF1tbxrQjO0ssFpDf5aFU5P6nZ0BTk9fHdrMyPktge6g3ANFdQlHN2o%2Fg6XAQ0%2BcDPzqpI82ms1TCbU1fiTn%2FDqpE%2FOvteMDxi4RpKJpxuSx1m3yC14LUpIeu%2BoEfAJvkIGKf%2B58vRvm%2BSx9KolebFhZT%2FiJEAFQo19rzX2UyHfNqYuKu5MSCpNgVB%2B4V%2FR6kEL0J5t7nst%2BReG7SGBfBFyYwSK4%2FCwAldwnQFPDgGkniekGrJ9%2B6UlNBJWVxCmYF9cWX2rwO1zYd7hePXmkdbtk2BwiIINdTlOAyf27%2BfnPIuBKBeLKhK%2Bo0R0i%2BhNl6Pp9uFxGJe%2B5jepRNVarmx5eYGu%2BcWyjah9cSzHzg%2FxpaUDoaCSIBI7kIUEgp6MS0kgnRHPv%2B5OG0KQXP97%2BMgT5keFi71EyblVfutuBtIpnrDJYkZmpGv5BMr8fHloedMkUJVB8y1jCN%2Fpm%2FMps6fvEguUbzT1Jk4En8SlSQqTx8ZxPRIpsyVHkX0DSNlrhN%2BJCCgOxEAWKNre0mEleW4ioqUmy%2FXkJiG5DYpNcu85rThlAn9lkVUirP1X0mlEsAg%2FVYx9OoMI7p%2FswGOqUB1goCLxs04SzdTUSCYWJXqkhR5DwdVcvGpON58cPWHJ5hdtgzOn7x4fxQdBxS4VmFb%2F%2FJmh%2F%2BCz4vJSMD8HZZB3OYdhAKvuGqIp7xwBPWA3vnUqR0Hsi1Njs%2BWH7pDrZ68nemQVjW00djI7GKQt1E81a7qo17I99pItEEmW%2BMbZGsaaqcpGYlktryEJYG0zS%2Fs%2Fy4tI5aWxj3Y7haDGzeIuaaixvK&X-Amz-Signature=f48ce38079f6b87fefdf3251b743957402a9e8cf4b65f6e08909cd3d0b732ace&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R3CSNEXN%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031334Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIECpo8omeUVDCIbqN9hHxYZy1OA2cdvZ7gxR%2FRKW0HddAiEAv7DFY8I32WLUxUxv2QqCq27mcrE4dxF36KuCIu3Nl4Aq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDJJFVkVmlmewBLRFmyrcA2Oqwk0%2F31M5S1e34OI2l0Mf18XOVI2xImqdSKlwjYAWemcCFbpbJKVFSDPQvJOjasp1qRCJWCoCS%2FLNUUMPQ3hx1u0GqKBPLmwmN4SpEZ0cN%2BP%2BvXxaVITTHycdiIfraIxL%2F%2BRJEeU%2BsqrQS47MhIZTZS4fF8zDAxZg7fq%2BQfbtS9QMP7cFFzKYQw3a6h4ptPTV4U7fC5uhKJe2R%2BMZh6aNaitzMd9OqWAcqo51HyB7czDc%2FRR70ZM8ITMfIMM%2F3%2BuqHlePIV18t5IYvztIBbzZD9n3p0NFgeobw715gywvZtMtW0%2BKD%2Bxm5OhuEwezvudFaQyv%2BdtB2ZkTW9uGQ38QCO5gj1BCXByOminqKsJm78WpTBUDS9agBrxOFvvLU6nQqVJUHs9c34nUgH0Sn9ajiYdhCTLhXelIlnpnkN9Ja4ACfoqWV5g%2BNgCavOBNOBT9b206jUQB%2F4f%2FPmHy30TzULtAQEOALtoy0IKpqDipga%2Bd31SDaa7wMcrFRkS1OIrCfG4nvQcZKHLVwTWPuDFJ15Y%2BAl9cH9wt50HWynMkFnDyjgnoyYle%2BTBumzNr6WZcG3XOp4Ch%2BTr74dRzknyJ5RmdboiN67kE%2B8gDjGhVCaDaKNk8Dh5r5Im9MLvp%2FswGOqUB6TwL9%2FehzSkax5jXko6Vv%2FM%2FXsSH0iCqhYp7KLD7IdrPfH7dTjIfLei6FK7DpnCWXq7X1gHnHujTCa3%2FjVh7MIptldbzjifpj%2BvFU9mXOHD7B9VT%2FMR%2BnOpQV0PJpR0qFQ6cnRR7eEV8Cq0u%2BDDX9NXtZ5ADG9zTXVrvJcXP5Z7qCYPXHv1FAwIasdBMHLk7yMeQsgzcnHHYam8GmAlf2QTUw%2F0%2B&X-Amz-Signature=f67ac8554062ce83b41735575b3052aa870ddc5b58e7d67de50f7a63f65560ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UI2CBRL%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQC2NMGU1PxJpBGRqCv63GzTRhRDiJTZ1bfrzxH0Uup5MQIhAPgCq78UdoljaIPakCred4xuMMO0ZAnRI56j0%2BIlWcmSKv8DCBwQABoMNjM3NDIzMTgzODA1IgyKmVJE0NMAUYypyHUq3AOwTUtsNW4mmSnrGbcQy%2FOkNoPLeHqAm7n3UjKkkcgiqk2ckNZhQjtdYhH9g5HSjw4w7s0yIGO3nTOMPdUNnx5vz3Y31bCgxwKixqAL2Utatr1s9koMai5hdL7pE%2BD4a2%2Fha5EBo0%2FFLKB3GwYMvkhaZdh44Oy%2BGd4ZS87O%2BxP9qDaBd%2F7Ow8Z9cHlr6tq9%2F5kKdb%2FznauqigB%2FJoid2S1TKgsc%2BC2VeNeo%2Fzgl9MjX5siywKUE%2FAUewgyGN6tXLCz7Mz%2F0ASWKbejNxI%2BXYj0WpqDQIWtdq3%2Bgc8T0NkfcXTxlzc3ZMS2z1%2BFXh0XWnhABvw4xqzL8pdJ0xHEFbftZaR6O1aBZsdCqjcUrrXCxldiUsgrXaqLkSveUUCKeUui%2B7jnItuqTj02FhNe6I7YFglY%2FDIfaZ1fSal8CGm6HCjbi0zntBULcbOQr1e6xNyELkjOs%2BLDUh0gkak4RWsVdOtkzsVoxIh%2F7%2BTG0siq5ay4FrlqvlvvCB52BMWX%2B8HRAzKijidWvc5uIhD0AlWF2EZDhmcZY7kpE9AJRTWzbL3prJyOu06t9J4bZkKJea63tPiTzPD6O6JeTzgl5sVeg%2BtZH0wTQUDJZN2q%2F63zfC1i%2B64qPyefYQ0WPMTDO6P7MBjqkATVRoWuGWxOe58dl6jm2uLRG0QinpliAj%2FQatZs194C3tFYvrzytQ5OSKW5ZJxHLg33XHByH3LjoVNgZOzJSuk1NaooPLAalEOTb403ItV3JLyMuUaSWWzS6Ctuvah7rVLz0wg7oUkggB6KSfb4SiGoVtvRdykwwcaKJGJlMK%2Bq3HZXiAPDu1ZNmAjcQdcaehWYYB1CXiPzuXquGJwevEcMo3N8g&X-Amz-Signature=5eb1d53320f237513d28a84cbcd3d078a30a6ce17ae4be2e87b82105655454d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UI2CBRL%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQC2NMGU1PxJpBGRqCv63GzTRhRDiJTZ1bfrzxH0Uup5MQIhAPgCq78UdoljaIPakCred4xuMMO0ZAnRI56j0%2BIlWcmSKv8DCBwQABoMNjM3NDIzMTgzODA1IgyKmVJE0NMAUYypyHUq3AOwTUtsNW4mmSnrGbcQy%2FOkNoPLeHqAm7n3UjKkkcgiqk2ckNZhQjtdYhH9g5HSjw4w7s0yIGO3nTOMPdUNnx5vz3Y31bCgxwKixqAL2Utatr1s9koMai5hdL7pE%2BD4a2%2Fha5EBo0%2FFLKB3GwYMvkhaZdh44Oy%2BGd4ZS87O%2BxP9qDaBd%2F7Ow8Z9cHlr6tq9%2F5kKdb%2FznauqigB%2FJoid2S1TKgsc%2BC2VeNeo%2Fzgl9MjX5siywKUE%2FAUewgyGN6tXLCz7Mz%2F0ASWKbejNxI%2BXYj0WpqDQIWtdq3%2Bgc8T0NkfcXTxlzc3ZMS2z1%2BFXh0XWnhABvw4xqzL8pdJ0xHEFbftZaR6O1aBZsdCqjcUrrXCxldiUsgrXaqLkSveUUCKeUui%2B7jnItuqTj02FhNe6I7YFglY%2FDIfaZ1fSal8CGm6HCjbi0zntBULcbOQr1e6xNyELkjOs%2BLDUh0gkak4RWsVdOtkzsVoxIh%2F7%2BTG0siq5ay4FrlqvlvvCB52BMWX%2B8HRAzKijidWvc5uIhD0AlWF2EZDhmcZY7kpE9AJRTWzbL3prJyOu06t9J4bZkKJea63tPiTzPD6O6JeTzgl5sVeg%2BtZH0wTQUDJZN2q%2F63zfC1i%2B64qPyefYQ0WPMTDO6P7MBjqkATVRoWuGWxOe58dl6jm2uLRG0QinpliAj%2FQatZs194C3tFYvrzytQ5OSKW5ZJxHLg33XHByH3LjoVNgZOzJSuk1NaooPLAalEOTb403ItV3JLyMuUaSWWzS6Ctuvah7rVLz0wg7oUkggB6KSfb4SiGoVtvRdykwwcaKJGJlMK%2Bq3HZXiAPDu1ZNmAjcQdcaehWYYB1CXiPzuXquGJwevEcMo3N8g&X-Amz-Signature=272fd12b5095940e25bbb80ba7e68017f2e59e681d9263ca97a3a63736412e2f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QDP5I3FH%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031350Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQD9CvhvrAgGCNfiT2hWJ5WOw5JJJ88aq9t8oHl9y2PrUwIhANiJitPhN%2F2UrSNJaA6jzgYLm6i1xCv7Gi%2FV4m9zTc5FKv8DCBwQABoMNjM3NDIzMTgzODA1IgwjLCxe9uVUkb%2FA3Ecq3APmML%2FT4kbV6weNPXqymIQj3Z%2FBZ4%2FOV%2BEssxLqdSQt0TRb%2FSqvqdzjJv%2FZ79nErhYKMV1NrnzDuF7wOiccZdGqXjrJKypsNa12D%2FekY%2FTo0jfUU%2FTqU8Q67h4i%2BIjHptdhKe1aKerbxpBhA8dEbN0VFM7mztoyuS0pAPbKVrQGGEtcthAv6YywSY4LWINr6h1JbBpYTuYvQaimcEiUqMnSfe%2F0I7CNFD0VG0ezlziRS9BxBs4eT1bYkpEon7UaXFHkI%2BWCJ3TcyDvIbDTFwyj53OYH7lAMLMWu4X8arFYP%2Faygw0G6tS2TkmtydjniAKys59dMQc4uwSw5RfXVzTE4GwqoRPbr5r2jVLdBDpZD4N1DXg%2FZ1BmjH5TQ95B4qC836SpMEqBaljtkUage445n4PUB5vKf2IMQCySPgX9b92rQ%2FGeBt5UWDKJ3ejfydBf6SK4Waqy4NLFyxK%2B04O7e23OS2MyTfsnaLCG4%2BZZCyTV%2B2yp4XXOsu9g1mfQ9kfyZgl%2BeNf0vURKlHTy05gCm%2FyYHq8l9QcLa%2BHjn9qLdW478h1KoQ4IQlHTcEH20JLsx2adoSvTdlWgvcRfPRmTtAmUcFBtKdcCI%2FOUB4s1NoLoZLngrfHkTvs1AhTCK6f7MBjqkAaZMU4cf0tVHxRQDYTvi7EFNGWByU8IcuTOxjinz3vnQi1K7jJ5Ob6umg%2Bubso24i3I83qc3k8%2FtZN2CloBgBqtp58ba4NF5NPmmJSON4z6HRjoLs1aykC98HhdxYjER%2FnRWAWc%2BwP4ocup63kAVaHQr5281PPGniAI9qwgpse83eHTJSVKw3uyaAgY5toOkNld4KgWGYa0jv34TuIqBCulYTYqi&X-Amz-Signature=dc9e3afde9f4c35c9890fcf692480c20d04156c45bb0891102b74d22483b9b2d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664I5F6V56%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQDoPYTcZHwuhZEvR7Np3x21Yg9qMcFnu%2Fo9x4V3%2FesJpgIhAN3Ytml8Z%2BpFtP7sjCK1%2F8Szh9QAjHXjuuMBOXGe59SxKv8DCBwQABoMNjM3NDIzMTgzODA1IgxxX3gN7D8QpKNa4VMq3ANPMMEdChz6a5gVQqTs7OZE4wfaB6mHerX4zyrjuQ1p8v%2BjXFebjSeOMff7NrONkyr88qPt4FIs3BuV2idqnKeos5DKn533VfdAQwg3s52%2F84B0CU6i9hW9yDcrdGdZAjoKqVbJiU8cbyN3l0YysL0dnSJFE6su8zW9QO40rQbnDEBY4wzypRCK%2Fz8W4h9JStRTpagGC58iRmtSXDPY%2FxC9%2F4e%2Fe2lZGw1AVkOx%2Ff44CMyD08OH1kl9y2FuURU4xip55efVpiP56slF860FM0snPZS3TDDy4pHP7i2%2FxOhfuGGDvIBIBhbXftYy8IopGqJoJJJnPdBuV0KCjM3N3mnkv83aQ5L%2FuT4cXHTPZYItZlW2O3lP0aRPHcr%2F9F4GLPh1uExLbwpxjiEGa4VqkHUvf6QXfOZMDyIYRZlWI1pja15PY9BtKocgeJN687erRBHDs%2BCy4K0fZpey8PV0K5nzfZNaCo1sJCHfQUKd580BFNo4iiN4uMlnafR0PdPMVovT2v%2FcF51RoKNhcixasVej%2F2N8%2F0xTjaDHDzTNzmoWAnunk8lZABPRIiq0R1xKbx9T8viJzdwKTatxRIzR9oG1R5SxyARviAyPeMoURFmed3Esq0EcNS0BTnVHvjDz6f7MBjqkAb3zXS59xKbmjpj6fl6W7TDwcH7%2FHLIXqVR9E5556ABBUcrqHAabtcSeqSANH38RE0X1NlzNRxETB1uYRJ6phPhQjQc2SrZozcCtzl9bjO4%2BIXWgZmMmFjaWPOv0yWUlpi85MMX66SCmI7CN1wVLneF1lC9NBiNkxeiMlmf6Oy9EUMlW5Dz2siMHIYFI2KIAf25OXCnCWSLrJcw7Vfu%2BFYmy3eZy&X-Amz-Signature=b118052934748a9a3a71da7769b43ddf570c99df9e7e3f2ebdd965b744223465&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666BFII5FQ%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031401Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQCm5jCrqWl0xC0gkvSBE0MK6thNAI7Z0GcJka3Gmp9VJAIhALb%2BhD7hFXPIeGj5L0Oav4R8UXrned5EMqEKLxVOkT6XKv8DCBwQABoMNjM3NDIzMTgzODA1IgxX%2FiAyn3P%2BJ9LppjAq3AOv4mO7sX2xd2ZW%2FoTGVnUb894r%2Bk38gIWZ64CR8S4RUhapdwB0Qhm%2BVUDCY8yrKd%2B%2BRbOQwRiJioYVX%2F7LQmyhNi7POl3AVtER2aSp7pINvZjARjNbnBs2anIooAYM5QVbTTBybwghQeHeA0hcEl5c2hEyj%2F6J1IODvRMtmVkxcCN7EOsTBOZMsecWwvw%2F%2BnVQfVs3O73sKCIfxnCTekD1oLGhtkYK9MPvADB8ZEPz%2BDT9RHHe9y%2FJfD21InNjMsrQbWM18rTa1PDnbCRgKSIvvWYEGMF6NlOkOl4dKcf2lhLcMS3dGR6n7OmXBDoppmFDDbxFPMutPXsKKO%2FTv8qk89mqXwCMH%2B0LpUIsnVasdwUhcaUQs%2FVfUm6aDdgtQQEUD3s6t2reETzUHocxdhSQ5v0WsK%2F0wI%2FvMjm4eIg%2FqQV01w8lr%2Be5JfTJOLCj8EJMK%2BuPfsGBG0EtcoP1GhtGs69B%2BlioAAC%2BLmL0oOWyuZj%2Fc2nIpZHX%2BMVuR9EjUQVcE%2BGkPXGkiQZJvN8XWAY9ZDpJKj1zkjdQ6ZqFqvflVrSykKp7zSlZgKDil7%2FT8GzRfKHQm%2FrWQYFX6sbX3pNqC%2FL73yJKCDk2EJCZCGt3dKJH1vF4GsuuhFTKYTDv6P7MBjqkAQoJTIk0EksKKYh6L0fE7QmvyNonauZN9oi3OYx%2BrzqOQTHA8EZPSnWASGFcN6JmTWNb%2BDxurW8s3DuoGPBFDd%2FPmEzFqStFJjyyGmWxTevbqBjlj1jg8rYQD9nor1NyVk%2FdRGOVFEfdwE054ZQwawrD%2BzeYQ5iCRePNO7RzuDIZdMFyZsEuE4LybRZafZpTeGI4dMDlhJA%2FS92sZ7FHXEZilxaI&X-Amz-Signature=04d18b97b0ec3cbeb51c5f2ab888d2ba7277120d474f6e264f61f37c1443b2a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPYSTSET%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031403Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIEoDFbYxNbre%2F%2FI%2FsB5L%2Fz%2FEtrrJO6qTwr648OU9Fmi%2BAiAKKNAVUFR7weNkmDjnCFWe0u%2Fj7jEkUvTJTAAGvimeFCr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMBM0EWTBFMImjiqjmKtwDdpNlx88rDQ%2FlYG1VgpqVew3spdcnp3AdpWlErEkGVEw8yg%2Fb6QDolvTGb86AtksbXbPOOjKyZM%2FyZEbjJ7BWpCLkMORctP8X6P84dPt%2FzT5IVQI2QIC7WTRZQ0jD4EBEzsFIv%2FtSgi2AR6dDEFcu2zTug81V0euGj5uk7Hrt%2BFwUuam5zOOQphqLM9hTcl8YM7xxO9%2B5TxGdRJ%2FlDDMdB18MBBpt%2BPFOwYACCNPuxVRiETtHqDg29cUH%2FWQe6je5eapS9bAwoUdm6DKyyzQEp26i0Yf1hf3nCswy8hTI2CCnAX%2BqTDiAosWcXGWisF9EBvcZbovghiVsYSi2uU3CSi%2FUi4vpmXAbeytv0SRYAmCLqnCzkvyiRT9DEeWCEb5PGs0UYfuAwJY1Yn5%2ByfzVcCiwCHsykblUVYtBCYoqigCcw598cl%2FMuiZbxrfAxKV12tNz1dhn4ODUMOjgceNsWDkykMqBeG1lai0iet2mUBxHffoyzf7Q%2FS%2BJqtnUdgDHynUVChBi2%2FyZo6AAg8Wtfc%2BlCyNRUdgXqLtKHtPiTtlpRgK54sjTRJJLPueTxSYA%2BcoyFi%2Bqr%2FHZ3it5RkRdaZM7rIXpOFyNBvvWxsWjb8vijO%2FYhe9v04%2FEXtEwj%2Br%2BzAY6pgEX3noNtOluXpMg6yjjxTGeNDw6N98Mcei8VPVPYsckG5xVk1kJ35Iqf1yBthYRhnbn5heCOyc0ecIh1z1N%2BXFVlOog%2FYD0%2BM8LYN0uLqqtHYZYan3x5%2FfRf9XdIcurPFQI3zmZNZjkPilXj1xJmDXXnPEuCmn4WyDy%2BvReh7Ls1qHjBSTM%2F8DHvkRxw%2B4ydx6jLoFLwdlBztzC2tbSaOmdKp49Qzj5&X-Amz-Signature=d00ffb1e7b85d09811286a6b6af83529dd495b8fa402531db7d999a5fe49c009&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667PKBRUUO%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031404Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJGMEQCIGe%2BNdB8mzTEPDRK6IaqOhF5yKMYWjbN3iM%2B56XowMg6AiB67yIWCTd02YEEB6Mzh6G5ryuEYeUiRYG77hJgGTsEsCr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIMCKGyRumc5SMSmEl6KtwDXCPAYkJ3DgabI5UaTBxlFTzKir3gkmui%2FYELYr7WZFkq7RsKRMgdbVHTsd4lngKSEA0uDtDGQZrRsk8EjNr4v44xKxdpSNYGm%2B6MVZfjS2cjL1%2BELnyTm9io0%2FRcP3fFre7UQvgCU3gfv%2BgXTE3oY105NXQiFR%2BaZq59Rz06VqUokofCj6NxD6XdsWzH5aWhlQFoUNaYqjqI3bAPudYd0i7paLagS6DFJOlcNw8qYUkyx2DIHBl94%2B2hXy%2BK5FeptQwsMPe7nr82rG6gxdqPDPithfDhHdFewHtXjcmJK1himBl4F0Yu%2FQ6Pl5f57etvr0KGUfffQIwcMKdvo4dKm7jbzcZ8m9K3KEk6l%2Btt8oSYkBrwYEpUtNiLx%2BJRX%2FLcvmHEDtcAkliPO05zdyvjc3SDGQ%2Bt7CFKR6WFsbtSvKv3ZcHekDQ1qGV4pOWr4YU6SpybEZzmorSw0rsq2fAdr9c3UTly0wfTYcvXQxcZ1kNhh6habv4AUQKbAMdFglLNSiB8AJo9r96rLjGsJfWxk0lKszyN%2FABvLOHlNYE%2FNpRuzjlxNKcBM0v7d%2FCQOafaG2UYS%2BzTvn0HLwxqgJtuGQx9mrp6sLXPxd%2B0%2FElfhPV56gzcerF6cirHnC8wmun%2BzAY6pgGpFerknYXqqXox8D0t2bVWK96M%2FcQekoc0e2WKecGCDmp8mPv3tFEqCo8tYFZ%2BYfxfdwUcUGkTane4%2Fy8Cl7x9T13NV1VpU7zDJZTreQLisU5Nf0OR%2FFizu8OuSpMejxe01WBXQFMsIkWWc8dWFJXXCrCPPktrQWE02owOZUIjaC%2FQohWspE6qD8ecFcNk7HLlJ%2B2VlbAXsd9Gu4rw6p67zgvtt5TE&X-Amz-Signature=52b1b5c39f126cf80d4eb83437859cd2f7aed41331ef257bd5e1ec93c77f69b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UI2CBRL%2F20260226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260226T031316Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJIMEYCIQC2NMGU1PxJpBGRqCv63GzTRhRDiJTZ1bfrzxH0Uup5MQIhAPgCq78UdoljaIPakCred4xuMMO0ZAnRI56j0%2BIlWcmSKv8DCBwQABoMNjM3NDIzMTgzODA1IgyKmVJE0NMAUYypyHUq3AOwTUtsNW4mmSnrGbcQy%2FOkNoPLeHqAm7n3UjKkkcgiqk2ckNZhQjtdYhH9g5HSjw4w7s0yIGO3nTOMPdUNnx5vz3Y31bCgxwKixqAL2Utatr1s9koMai5hdL7pE%2BD4a2%2Fha5EBo0%2FFLKB3GwYMvkhaZdh44Oy%2BGd4ZS87O%2BxP9qDaBd%2F7Ow8Z9cHlr6tq9%2F5kKdb%2FznauqigB%2FJoid2S1TKgsc%2BC2VeNeo%2Fzgl9MjX5siywKUE%2FAUewgyGN6tXLCz7Mz%2F0ASWKbejNxI%2BXYj0WpqDQIWtdq3%2Bgc8T0NkfcXTxlzc3ZMS2z1%2BFXh0XWnhABvw4xqzL8pdJ0xHEFbftZaR6O1aBZsdCqjcUrrXCxldiUsgrXaqLkSveUUCKeUui%2B7jnItuqTj02FhNe6I7YFglY%2FDIfaZ1fSal8CGm6HCjbi0zntBULcbOQr1e6xNyELkjOs%2BLDUh0gkak4RWsVdOtkzsVoxIh%2F7%2BTG0siq5ay4FrlqvlvvCB52BMWX%2B8HRAzKijidWvc5uIhD0AlWF2EZDhmcZY7kpE9AJRTWzbL3prJyOu06t9J4bZkKJea63tPiTzPD6O6JeTzgl5sVeg%2BtZH0wTQUDJZN2q%2F63zfC1i%2B64qPyefYQ0WPMTDO6P7MBjqkATVRoWuGWxOe58dl6jm2uLRG0QinpliAj%2FQatZs194C3tFYvrzytQ5OSKW5ZJxHLg33XHByH3LjoVNgZOzJSuk1NaooPLAalEOTb403ItV3JLyMuUaSWWzS6Ctuvah7rVLz0wg7oUkggB6KSfb4SiGoVtvRdykwwcaKJGJlMK%2Bq3HZXiAPDu1ZNmAjcQdcaehWYYB1CXiPzuXquGJwevEcMo3N8g&X-Amz-Signature=65a1e7530c51e109d71901d156cc6ced6e2bb64b9977860b55e8e20b598e77ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
