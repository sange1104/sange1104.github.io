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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664FLZZIFP%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFn9Z4sIxkCJauz1x%2FGgKiKPP%2BWv7SBagreA2GX3Q5N5AiEA3BsN%2FLKTVNrs5W3xzelgjty%2BgfOGCU4dXjZ8iPdx%2BqUq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDLJsTE%2Fx7nbkFlri1SrcA2Nt6MErxEtePuweJ7f0kbrlQdg7mci8rRmP8AbAnKoKYeBv6LJOWXids0OFKhZ3AJLFfaflRCP4H%2BIuvLKULmoC5%2B8lKqRtDxbzubNlJ8AMs%2FKS0sIFykACKYBpsMcTCkn55gq3ICiT0d6zBY%2Fqo0ow2Uvx1BA1liP9ZJIskqEEUysT5Vmc0paWQOy9wQM1dEwipSOSZJzOzfeLgOe0q0SKI2bxgo2nGeawaSIPYUD0Wnw7gD2xwJuLyJrIbKbYlp4%2FK4fU3%2BtzbZPJwKzncRaWD6S1Bx7ycwOsSMLbzMR2uUTy3VafkQpPJ20kWZSF%2B88BAfgpZxM0dtt3QN60IljC3tf3%2BTH0lDr4y8poEpXrfh9YEFWb7JW8N9zPyKMOkfFfOw5eYAJjHdyVsm9h32M6IZjOOgnFMkl2oS1aWNGp8SqxvApuhJ1nBRA1%2Fp8fOspABcYjXPxVndHTHmTmMemwUuZ7yGIN3CymxEJxkY%2FR6h6WOWrOEL%2ByFrK2IO3xPchf5zyajsD6C6bJImw2RwVdKHkFdkan4ZxW49U%2FuAbsiey1fLl%2FyGZxBNtoySzOKilgHsDcHLY7M8KN%2FePPrdb%2FginR3FphqWTmhFvMbJ49h7ekYyoSGc4U%2BU3CMK7y2cwGOqUBXE7D717cOMMXQzPPDHTKQL2vNfo2b%2BB1hjyEXyfeABa1Ew%2FHPk6vOVyMIEO%2BYHcBf%2FAeiYIPjZrTBKThURXnhX5W1hTmjQHydiuuE2J87vf2Pv51EbjKx%2FdiambIKdQM75ragwmdDZFrFlDt%2FRsCAv0n6AF56mWV%2BK3RsyXlHQ2aSZxO5N2vewLykVWDRk5FFXlAQAKq7o%2FqpTC5w6Esozy%2B%2BYGm&X-Amz-Signature=965c4a582d0458aefb99b18aabc9c26fe23c4580dd72a047b90f088092373bc6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SP76OGGL%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBS3c7bkb1oxBoDKzV6yvXkwCx7xim%2B%2BU7ptmrQQps4nAiBLlqhmb3WhnxqOEFWFo9sASSKAAwPVM%2F3qhyv5cIcvGir%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMU3%2BkFecnrYylHPrSKtwDrC14vRlroWkXsAH3S6fdTk8gF43vU9JvBY%2Bnl3X0KV%2BNJYScHNWUE34A4Ax7fDV5onZGb4mtnDOPYLBFf5JIcEE6lDiVx%2FDYBpyb9xLHDYYI9nSEzv6V5vIPkTPnttcmGCAZ1X%2BZd7%2FyQJShPhbUV%2FS8mLGA4pU3L33QzJhmnWAmdXxgqKvb9QS56h3kSv6kdQiQqHivadknQkDWEJUQOhhHk4fI2EiL1YzRit%2BZ1gNC1SCuX9SO9WC8g0ulAakeiv%2BcglK3ts%2FCksYlnmuYmgEph9GFuLKpoCvlBDVojRz5fJizXW8mzfHnGdHuk8VZozXNrxlR9FsrHMLZaZNRrtDtGznahn8%2BfxGfm6pAeJN29GLW5g79GVvOndvoQ6yllpKhxZl%2FiuRfQ4twcMPpNoVlcyT1St0W4yXGuxntyedSzQkRYHXvFRHigiZABTXqCbfdUHwmKY1LMDXeI1aSPDv5JVpAPiU8vujn0VzwYP40g0PP%2ByMC%2Fpk%2BWgCcZC9BHAUMmm2MHDcIwIFxN5we%2F6KcBakwyGoWu43GZ%2FzLCh%2F5CGqdkC%2FFJ7sNyvZwIsOlr5AW0k5XQBVyHIYEjmbk%2BTJ9AAv7JJ6CAV2hR8zFqu22FK0G2VrxajEEUz8wtfHZzAY6pgE076qoVLQGDsi7x6GWGeBvIh3lVqma389wa3YwA2YQ%2FgGXLfMdYCAuW4ZVD%2BdrR1%2BgrjSmDZnur5dhHRUX6Ud%2Bm0vBVHK50LrrI5X17JqE8A2iW40%2FvhdGrX8bh30nRKoeRG5siIg2ZLfzplV2Ub8%2B9t6luAHbWDRvjWvPBLjPegM%2FXSg%2BL3RpAG%2BhDr55FeHg6HF6pFmYeyZrYgL%2BSlIvBdqL2266&X-Amz-Signature=c5d39ec2f058b529210f394d4212e889b3ab6bf1f75cefa07c2cdc6590eea691&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UX2FWDJQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031544Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDyQnQWwqbtrhSaaJYwnjaiHUNJ5qy7R7wHL5wAKEJ5GwIgek59MIo0YAqAVN8QU88VBpg%2BgQNaM7sTraxq8Ths7A4q%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDL482P6PgKMx%2BSxo4ircA1H3QQKGkDnfcoducshId26y8juw7dS3tFXIE%2FybLug02jbUJk0jRPZbxGz60fanb1qNouWxnOqWpVT3a5bWhUYqZP%2FZluDP09KXnvqRcBXaxWfhtfbG5PvcgQAKY5UVyOsAZqvBVey0drdor5ObYc6ZCSms9lRXMBp2ZYbpiB2ZrDaHo24UhMHS7YZBDbQzg91iH6Qv8hnQELwaYkqjRGoUTU4b1MOC45OIndKK4EJLirkrbmpRtf2LrYo4ycsQ4AMcMB5yeNllbS7Qxoi7X5frWWO9AvKzhvMjB5auuni%2BgjT8jQCRjNy9gOw76bC7nCQfDZfm5NUKhNaiKXgxMWwvJIOZcP7VguQUTrkB53gXs%2B9qfG0scbM72P2Ni6ZRg9Fw2IJmxiwXhLFkfo2hBLHkqtnWIWyF4BIX78LhNHi8qSGIO1uW1XmNj%2FWX1ZdpK8kbc17yO9tiy8%2BlqHwhr0ScsnW6Bt7gWtiX%2FfvDHmG%2BLP63vWn%2FQMSlTGNivnco9CPoVohyRUzjRS0BxYulBBXPDzauCN0NGVZ4q4A8bRCHGyNEQKPp3HPEJe0SpBCIIpudV7wI8WGJapWtjAPQeAYRyaOjZJ5sBON7P8EljuYo%2Bdu6v0B712YfQgkIMNbx2cwGOqUBluNdh97Hsk5azi8EgMxPRqqtS32FShWCRoJOzIELB1t9qXpnW2yzNvlgKPjl1%2F4c072blVQeYMG3asKJOqRViy1V8oDBv53%2Fp1GBygEKd%2F12EmbYSMGY4gASvc3b1jyDIbtX9Nv0tTaonuZhaSn60QYMbad4GkpFi2gTdfzk%2BAps1S%2BmlSiAVZONT8noDcUHo1iXkvkJKaIm9P2i1M2aaiV0BJBp&X-Amz-Signature=aabf659a47d03278a913de5df6920672bc7e8b8229cf52f8d3d7fc03a5fcea3d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UX2FWDJQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031544Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDyQnQWwqbtrhSaaJYwnjaiHUNJ5qy7R7wHL5wAKEJ5GwIgek59MIo0YAqAVN8QU88VBpg%2BgQNaM7sTraxq8Ths7A4q%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDL482P6PgKMx%2BSxo4ircA1H3QQKGkDnfcoducshId26y8juw7dS3tFXIE%2FybLug02jbUJk0jRPZbxGz60fanb1qNouWxnOqWpVT3a5bWhUYqZP%2FZluDP09KXnvqRcBXaxWfhtfbG5PvcgQAKY5UVyOsAZqvBVey0drdor5ObYc6ZCSms9lRXMBp2ZYbpiB2ZrDaHo24UhMHS7YZBDbQzg91iH6Qv8hnQELwaYkqjRGoUTU4b1MOC45OIndKK4EJLirkrbmpRtf2LrYo4ycsQ4AMcMB5yeNllbS7Qxoi7X5frWWO9AvKzhvMjB5auuni%2BgjT8jQCRjNy9gOw76bC7nCQfDZfm5NUKhNaiKXgxMWwvJIOZcP7VguQUTrkB53gXs%2B9qfG0scbM72P2Ni6ZRg9Fw2IJmxiwXhLFkfo2hBLHkqtnWIWyF4BIX78LhNHi8qSGIO1uW1XmNj%2FWX1ZdpK8kbc17yO9tiy8%2BlqHwhr0ScsnW6Bt7gWtiX%2FfvDHmG%2BLP63vWn%2FQMSlTGNivnco9CPoVohyRUzjRS0BxYulBBXPDzauCN0NGVZ4q4A8bRCHGyNEQKPp3HPEJe0SpBCIIpudV7wI8WGJapWtjAPQeAYRyaOjZJ5sBON7P8EljuYo%2Bdu6v0B712YfQgkIMNbx2cwGOqUBluNdh97Hsk5azi8EgMxPRqqtS32FShWCRoJOzIELB1t9qXpnW2yzNvlgKPjl1%2F4c072blVQeYMG3asKJOqRViy1V8oDBv53%2Fp1GBygEKd%2F12EmbYSMGY4gASvc3b1jyDIbtX9Nv0tTaonuZhaSn60QYMbad4GkpFi2gTdfzk%2BAps1S%2BmlSiAVZONT8noDcUHo1iXkvkJKaIm9P2i1M2aaiV0BJBp&X-Amz-Signature=705d14e2ed6b0188b8dac315ee59d6f99e7323d51f6e3010ded0793d4bf5a1af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46672FSDWKS%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFeK6IPIdO5hWnHR9oowgx5riayH844rxOpK2xhV%2Bo6GAiBdtoYVHqsapaiwWMWjoxY6bTMmg2aj4097tvZMW8E3aCr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMKA8hVHKnMdZ4iWS3KtwD8gxygtSX40BOZ%2B5FiTObEl8xxifZa4wBzrTEP2ZHBbiLanA8KXdqxr7KYvUxm9xLmf%2FQkXYbPJPpnXSmGMHPnyX8khP4%2BiySWIH%2BAWhHrVir4KqgTga477O71Jq4dIxyvIBgVggPnHfIV24SSbengwlbV9JOUlOGIfLEesAai0fKq2Giu46YE8Z635krWw6UgszkKc9zl3bzUC3nS%2BLPp47RiR6Q7oHaow%2FLgxOJR51lEVXdJPxxWPquEJ4VPN3KZeOFe%2BDnx1Dxm2zwHS4iE8WkZUJ%2B%2F5zU%2BZ8PWK0CMRzrCVNrtEw7KOmHqKkPUyT9HnRrTewsg%2B6rUYQ%2Ba9qD1GTrFb%2BzU5ZiP8gKNGaXhN1PDJl2cucwKiMSwC7a4VQMnN6yJSN8HtxEjQSDdurp0b8nz%2FjpOqTTmD5Zlmh16Nz4SWzibghqV8Y45tkVKRXmyt6XbhlVE4O7wEFFp7J8o0%2Fv2zYu8dPH78tc%2F28wPo0ZEM1XZV30p1HAPDLfectsA7FUSNDdh4fTpqi%2BqX4r41qcPsDVu%2FB%2By5jd0TfdR1g4xb32j%2Fnm2J3Y11EapMVigYFD81vb0fYZyYgNzVa8%2BSjY8KaXzJL4ASgM9Jrqt5akM9%2FK8ACzrP1AT4cwiPHZzAY6pgHDmX7r4W2bOZiGkxc37vXcHye6VrXLT62rnQM5VjbxW9BUfkKPnT3N4G4lVH1vWXddRuig%2Bl6s7NFCUmgQ7DnxHkWzEUDOHbepRfTAvamb6VB1VR4rGSS85OzlXSSwZoES%2BzPdoIxlVcTo67pqFOmbDXvdlOaCRm4SDJLX6NWqkLaPUKMYkJkhNooYGd%2BmWckmIQc6wYNdU76diTdQqNv%2BcBblOC0p&X-Amz-Signature=682b9e5a24c92d529316d0fdec3ca11600fa43378be03737630f1506c96311ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLRYY2GV%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCUC9cHHxSiD0RSM9YKnrwSymFNu96sKnpB0IsACrdUywIhAIIFzlN6yHduGReWjtYefk%2FKbKatCM9H0PKc%2BT%2Bt3X%2FSKv8DCHQQABoMNjM3NDIzMTgzODA1IgwI4kXqGg1MDi5cmloq3AO1Q0yr6yhgiDdxExSG0MqxprlT8XLWHe1nj1yZ5LSsNpbeezP8iRkNeIlJPJPYY%2FDQ5qApWZuYQwYYbZDSxKMrWIo950p99JxeEC7FCBrL2uEE0B%2Bu8ng8HYY6YXAGkbzOCoXEmcQ5pnGf54kj7waRqTFW%2BOvWvNbPgpKju5fCwKxju8l2bBkk0Hc8h2KX4wOPP1wS1qQCtz2bRIgID50m3r6CMh10ZaEVbRoX7txwUswAdxl1pZ3zcsRacNJAS%2BzD1LojybWWG801LBf6po9gJdEDu2iDMQmKdpA0ASLRIQfZJEfbY2Sgp1a47%2BLQZ77XUQPS1SMgRmyu%2Bik0OmX325vaObIc1iUo4%2B9OeXDuvnSlz66atvutSAd2ZME154qLqDtpJjbmxohSZLa4s3YTI8VGzlNABL6CIm6v9akfUFmJ9Zp6ktwuuRINeMOIhPiCxijHNZrwtE46pwIoq52PJLlDjl%2FDOSdzTJeEhGaLJH0ny41ouJ3QGOlkUSq6mWNtZXJLot5MatwmCVxE%2FuVtziOJsXZ1WtbRovAX%2BZ4lcxlxEuHjUcJa8xLPL2XolyBl7ZBU%2FtFF01y1hODs04q1dqZywA%2BM1uN3LeM4blPeDHbZ2uc2xJjMNfDFdjD78tnMBjqkAeAZTAXxqSWG6gtOd0BFF4bq30yxynm4%2BbhLybd67n1AJgC%2BPgNtawoESgsBZ29VrO8OIyIxmxu6wXFP2Ajmp257TO77X1nJaHLqXR3%2F0FD7%2FHQ6vsnykVcncYUOBVmX%2BSV0SU%2BCQ2iAz5XSUPkK51Wo4%2FsM%2BLIwsHvrtrywln%2F%2FiebO1xKkpGDFi9relTtqYKIul1x1PPgeajJYEhlskU%2FF9ET1&X-Amz-Signature=900029bb8d71296a3a1c128c2d8c4c4deaf2833a7eb1ae8b9788ab5482fbe27e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VH2ZD6PJ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCPadfZPro2Xp5wV5k4s1K25kdJuCgndPdcEP87Wn9IzgIgQZzyptEXxCqEh%2F0kq6VyyfZP2YKIjj%2BpuCen%2By0hKYEq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDBqpJxeugq5HR7aKRSrcA27yD464ZdtwF18LjsaOnaTvq38EY1DLNmOOwGbVUN8JWDX1U4Wfb8lOWrt84lJOPl8v6AOmqhfOJpNyZ7Hd5WJai3OOcu1Jedm2PcqEzPAYw%2BZ5r6RqCeUartfdoSGGMC4pp0wIVr3CnYxxOiUcZLsryAtQC9wAcuKorCiDuODBZ68zkMmPL6DX%2Fa2e95ZfqvUnQ%2BEiotxMz4G%2BgdSBIv1U1dbKqg5gp4uFsQkqP8OtBvX46IPIFEVao0WCN44J6eZD4QaIspWcfT2J7fdeylU0MttbAMTn%2BSXd9W2QtpwYZQFf310tPoHf3%2FmUaCGGNQBjKE4NTZYSoPHCohEC55Bd4xXT6MLVl6dsJxbtC1lG9fXpCwF2YKjorTWjn%2B2kwV6T%2B31UmzCd2oihqffE7SNceHDygvmXE2hC0CTUU2aYJW46cVhlUO6VyRYAY2OFbkaA4O2kk6x3geiOEQ5sfVC53wE551oApV55uiR2jOsZ%2BbpDIueDupWUhC9trsiF%2BPs8BsLJtbSM%2FUB6IN3vzQGR6c%2BcwdhKPKf9y8DndlJEg0H2yrqosDs1WzaW%2FXMpLuntOIM9k9Rgqohu75A7CPA25s%2Ftqlk%2Bm0V5bu1J9%2B1RZ3Fj09Uvc8SJ7fPBMP7x2cwGOqUBbGrEpcae1ZmTFjrDQ3U%2BHn0rPkqySDY8x35CHPt2Y1rT2VLB7o5vPNP%2FW2VA2NMvG2ILPeRt4iqjJa%2BQWtgghmueu8TZr39D7OLJiPLW01uQB6cOb0M0PBTdWsIEYapW7bUqTWC6Wn5M75YP6Frtf%2F2wiTLRV9tmImpzZ0Kp6VewNKBle6qF5yvFEmZvk1dVi3v%2FzKMwzNq2vcgWW%2BenW4RC53xB&X-Amz-Signature=c3d8fefd48b5f43dedbb2162c0269f2ef4c66502b10d0b8c05d34de3598af17d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRDTRFBV%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEoWQtKfC9fSnq8DIuxCU3fWn9Z9yp5B60Nv9jzkgQjcAiEAzidwwaFKHnriX2UjoKWDLU6VwBuQK4usduTthRQah5Eq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDBvQIM0PPzz76eHYsSrcA0FsVZ7%2BX4xD%2Be%2BDGtFwoyan%2FoszKA2cTme0gh33bcGSQJCw3OXOiNU7SYJaPbrgYi7JjljOja1MNNtDcs%2FTVERpJgOGPjvD6%2BU3GCz%2FVHFaUVnqaLfjzk6v2mVdwxQgS2oQBZ6C6v4b%2FprHm5j4ifSeyOhy5sPTIOWzZYD3jTZVG6hHkhrGIVCniz%2FL%2BjkskmuO34IIRBhTHAszZfEqMMtnWcxPCY06jIYuMTdInd9LfXvom%2FiAEJCINDjWWyJwo1MG5bBDguMxtppzb0JuGMYQctANHIMk3JSk5SWhS%2Fr0h2X3B2MxFhnQ1xhMV1hrjMsO7kQorVf5KrJSVZi1PpcfMEfuODjwn63K4bA%2FO6f9IZfgoGSY8Sl0QO5Bui%2BqjPxlOXpRi%2B8Ku6aLT33SJvdW%2FB9Fha19O00N%2BQDWTF%2FxfA2IwzVGxS96Ta%2B0PWVNzb%2FcYf9bcNhgLC6BEQHNnnYkVTApptZM%2FeKuGx6GtDcGA4WMSEQ%2F7NBAfDy8xQoMA6Z2y6zNweNPt6RvERwlDkU3w4rDHJHRdSFu%2FkPJGXqxCCocAfCwAtrL%2FIYKto%2FfwyPvr8TMVyK8NKqebcdThg4bl%2BsH13kkRPl%2B7Tf1Q1lwNwqCGfgDNHil9UiCMK%2Fx2cwGOqUB5%2FXSfzhsLccz10YdTrVgUXwC7wEEzcIwcuk7INQA1i299bACficqxsuHawkLqkUiGw7Tk4mmTYyOgBNezhVWH1dQRs5MfmO8Rfagp8RL4GrDVpqo13wHUay4nstdDhd4GyYiMplBH%2FWcmL7Mzsf8%2BD59KJHqvfoJXG8%2B4IX0JTh8ntWdTUkqDxgSlVeH4R0TzkIQGnVd23eyFK0%2BtTci9%2FZKS9j5&X-Amz-Signature=c0f9390d1754c4c9a7fb5a4aaaa865d44e0cf0a06b1c7eceed3e4d4e3c5d7825&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X37TOXKJ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD5asO1yYlSmV21u%2FL9Jw1W18KtAOugDdK9qzFqZ3t6iwIgLI3rt5RGqrsJ0eblQMjJJoev%2Fik7CkzDCaTTrp3tkpUq%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDN6bMJc%2BXzIUAH2VwircA5%2F9Wq77IN%2BTynCfvtu3gKmY8igw98sTvYZTmOZ33NWnvJHoAEzeqpn930SdxV76quZptUHv%2FwdF2%2B%2FmtWFm1lxz76jF1hefjicIXsR%2Bxhd38xN%2BD54Xu2uaagk9uLmj1OqYs2DHq9f7dPoFR%2Bkt6qAlkWNKwIw7PIvHFR2Svxz%2B4FGI7Xgu2LRwpZX4WAbtZot999y8pHT8L%2FfAAspxDrr8Gi4WMAf7vvCP1a%2BPXK%2BHogveMtUj4ZzIK7Lv7H%2B962nDhMpyX6XIFCCCR%2BdRlZ3Wq50v3uRXswI2tgQHVp7aAE3a6Pdou8kuMkqgA2nydw7gUariyjytgZPmyIRCIGUf4pG2K0FN7r8aRassncF8IzYeCgUj%2BJVWym1u0We517tqZskpMboeeLuHgRu3c1CMqwN6MaZKdM8Ttka926cdu8G2HXbnGbdwfVjU1AzUNtH2gq8wlUY8IVYdk2fi%2BFTos23b%2BNWphiRc1TBRJB2wU6RCVxoCXK2Ha2rAd9PO8VddZ5mmF1eqBQncNPc81mHJSMkUtj9j8XbLZZWglS2PnVacZHQcXCzVznzocnfj9vs%2F63EHcWI245qFM9SP2vGWSVYgeqC8PluUEOMYzK730zlB1E%2BBnnBganBcMOny2cwGOqUBgI8sDdZsMdQZMrIFdXvm%2BAmyLQgtYd1%2BzoUi8oWtZs6tjzraq2dNaC8oGvGbyVrHUGvxEYjKpndml01WiDNuEprqAwaDJ%2FCIqp5O9pUNc9oBGHZpBcCQ8gXnfo75bWfsRAAG3F02IkPlLtJA1zFQwvvx07fwSFS62vCPvMhS2VfovSRsVplrCIYzVkaqOAEYfj29zOUe%2Fa%2FZ%2BjAf8GKKR%2F2GOaua&X-Amz-Signature=f56dbd62f63f79a5ff4d83a47983ab4dac0773be0d1063f1eeead3f92a5ab9d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UX2FWDJQ%2F20260219%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260219T031546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDyQnQWwqbtrhSaaJYwnjaiHUNJ5qy7R7wHL5wAKEJ5GwIgek59MIo0YAqAVN8QU88VBpg%2BgQNaM7sTraxq8Ths7A4q%2FwMIdBAAGgw2Mzc0MjMxODM4MDUiDL482P6PgKMx%2BSxo4ircA1H3QQKGkDnfcoducshId26y8juw7dS3tFXIE%2FybLug02jbUJk0jRPZbxGz60fanb1qNouWxnOqWpVT3a5bWhUYqZP%2FZluDP09KXnvqRcBXaxWfhtfbG5PvcgQAKY5UVyOsAZqvBVey0drdor5ObYc6ZCSms9lRXMBp2ZYbpiB2ZrDaHo24UhMHS7YZBDbQzg91iH6Qv8hnQELwaYkqjRGoUTU4b1MOC45OIndKK4EJLirkrbmpRtf2LrYo4ycsQ4AMcMB5yeNllbS7Qxoi7X5frWWO9AvKzhvMjB5auuni%2BgjT8jQCRjNy9gOw76bC7nCQfDZfm5NUKhNaiKXgxMWwvJIOZcP7VguQUTrkB53gXs%2B9qfG0scbM72P2Ni6ZRg9Fw2IJmxiwXhLFkfo2hBLHkqtnWIWyF4BIX78LhNHi8qSGIO1uW1XmNj%2FWX1ZdpK8kbc17yO9tiy8%2BlqHwhr0ScsnW6Bt7gWtiX%2FfvDHmG%2BLP63vWn%2FQMSlTGNivnco9CPoVohyRUzjRS0BxYulBBXPDzauCN0NGVZ4q4A8bRCHGyNEQKPp3HPEJe0SpBCIIpudV7wI8WGJapWtjAPQeAYRyaOjZJ5sBON7P8EljuYo%2Bdu6v0B712YfQgkIMNbx2cwGOqUBluNdh97Hsk5azi8EgMxPRqqtS32FShWCRoJOzIELB1t9qXpnW2yzNvlgKPjl1%2F4c072blVQeYMG3asKJOqRViy1V8oDBv53%2Fp1GBygEKd%2F12EmbYSMGY4gASvc3b1jyDIbtX9Nv0tTaonuZhaSn60QYMbad4GkpFi2gTdfzk%2BAps1S%2BmlSiAVZONT8noDcUHo1iXkvkJKaIm9P2i1M2aaiV0BJBp&X-Amz-Signature=b32819671e65a4e8a90db712eb5bf55fb8b34e23d46e569cc3ad155dfa64853e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
