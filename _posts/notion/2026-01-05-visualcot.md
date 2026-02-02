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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TOGOPDS3%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIEXdpMqe%2ByO4jFfvDOz5Hzp6cc3zfvhxEe3mfEdxL6BTAiBjzK5H3%2Fw8kDXqE4Gt%2FUPs0OYSPNzhQcFSgJuhErTXXiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMnyU548xwTx80GHBrKtwDCZxrjwnF%2B3KrFp0CjYCGzf03O99z7fOgUEw2b%2B%2BJ2MORSk7Rt0ofaFRKtxjZ9uKI1tdjA1Hqz6T7gX1GgdkaLQyUeJubJuSqMJ5YSeZsHLP%2FL07JjruHcnRzNDScil%2FutlkZ64b%2FmvplafttQggK47m%2BNvPUJEkUvyNP02cg4CPciVE1tiJL0j%2FXxdZ5QdJsSpD%2FYx6dlkST%2BUhDzf4Y%2FvFWkRE7lP8v4GzfkD5Gx9tIvT0SMn9a7SCTyvjOxURvat0d0PHm%2BIcD8GZ%2FkMVDmvzobqXpLti7sXJ5qBy7PQWWzkufKbcWH%2FFi8G0TkPawhouC0jmUSQnQBDp2cZvp4b4BzpwzHN4u4%2F3QXX4maJ86h7bitrUqxhiVNONljMwRXXm3p0lbK60toaw6nFaG380sMoAcSW7ml7FP4Qiv2AhMZYGDtyCUZ8gSPJJ4VHhd79LcXJkOKgqGaWOejkShU2b0oL43lKsvVJJcVG6sR%2F40kBlC%2FMCHnXnnsrVmHLBNZXG%2FAAzoZC%2F80feTfKWwmDWERS1XbYYu77zRBy6kyv6W05c505mjsx8FHf5JBbnOuc0zOyY58gyia5n974%2FFYDe8tQWjldigrKCUMdQdMkCPiNYhE1aZ3a7nOMowkIeAzAY6pgG6CD1f2NIPO%2FS0jID3NukqFk4xyNT5TN9HPXMC%2BjhzvDaVmFgWAOodE7abfNSL8vuD6euqWpIY2%2FrA%2F%2B9zdaBPkqbJkdKp54h7uS2L7lJ1WQpZ8zD7gOasqcQ2z8%2FfBqAIpSQMNaRAEdvCepOtSbs7J1CniA8e8Dhe4j84T0s5wDO5waq5w4bSVXHODCBJh6z5cz1YY0DcuuQsbip5wBX3mGAZsilu&X-Amz-Signature=3e2dd8958e2cec8575a9c48fecfabd83ec6b1d00e9d9c8843a221386ec2db28d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UTXEVRNG%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJIMEYCIQCR2golHfI%2FVXqZPF7CmFgOFcvJ4c8vp1vTAbsd75OTvQIhAKA4Shqb%2FIhal8RggCyzgCmu1oY7J30yKL7b%2BUTts%2B5HKogECNv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwaMtSN7%2BzyIA1IGYsq3APUAzxZlQiQYKoC%2BEC0XgJ4SBRtZmUwhl6mQC7ZyTFIIC54vafqX8%2FqXTTZJcUQGMNC3tMmt0%2F1P1eidgQCDMrVgSQ4a2wuidv65ZVhMevvPY%2BgCjoVfDw5I1mRn5XR%2Bwu%2BXnJJ3GKpRlj9jeSSPAFANYQ3ue94aJmX5P%2FGMiGDkLwIDw%2FC5Nu3%2F11xSzHjZq5oa%2BVos38%2B2mQfB4uros6n735%2FpPxAkOY0X8G9A8eABX2xKmoiSh9LePCT8HatuzV%2FWEQ9jYHEK29jLfA9UvNMBUayzWjxdf5fG1Id9eCu9lKhvxSfvddpRy8itVlCNvw%2FxK3YgAyxv1yAJ5IwWK7Qc2Kq1b%2FtkDOMJsvFG4vN7ZCYgfB0RKtYHS446tHDeA4YZLEUCb7a932UrzbEKKza%2Bik04Ayo%2BEGhKX0d1Nhp03sxVAQ6dUgl0cOvTJQwfnDYuWUMbbsOg0j5TFLRPiOM8ULNTbskgpnqC8R3Vf191ZfSPeI3vO%2Bb2v87P0zuaxi3yd1rPX905zkhpWO%2Fn0mi28COuwJn9PObMPu2u2LqcfBsC0unjvlz%2FqJvm0OYR64jTmRXkSHxioEuGGSyUXSXNwIRZn1q%2BSRj6p2D%2BaSZ3S558AdbuQqont7H%2BjCfh4DMBjqkAb7KDkdKQh%2FTUuzXfReMtAQ3SwwcWs8R3UYX3cSHY%2B7OffsHGnzQcbSj0FS5gUjx%2BQfEVTWS9vwPG3%2B10S%2BeppDep6pxZNi%2FYQzNxO7dnMIr7tmbrHJqLTzQay9JH0ksbc1VO0EHcMXVIHg1iciGF66YzN%2BQFupQuR1jLjGJf1x6VzCxWwm0Td54sRdknybjbzAE6WJLXgNQwNP7z%2FLlBKHCJF35&X-Amz-Signature=a84dfac2f8292038c75aede31a78f8101ee117eaee126d67ca7ed4cacae121b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z4BOSSAV%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031856Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIAdjjw3y%2FN6S35HnrrnO7h8UN3KJschwglLRmG4hRwdtAiAZx3ayQlR5H79iQdtIEmQNI0ZvG8O8QiTZQysNTJ%2FPEiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5yJn0RfNxe%2BnYhAeKtwD%2BsBZZQpKXD5pbFdUz1rJ2Ew4llj4KfCu%2BZeXCzNRzTgdPDs5FOmk2cxg8wO7rCgCKCtHGYIK6bB6NL275V8%2FGgvKMiKGnwWOCJpQNdVwUkhDWpt7hBEv9XC5fcuh%2BxNdXq1mYMk8oJcIWv7%2FU0wkxicPfgRpHzIWaDVwIl1yMHWh3ufHjQveGxD3S4JW%2F8wONUOCgzEZlvAJT9HRV%2BgSiYYnyhTy9mw%2FrqeMjzYGFPwyIOGzfBuqDcDbH%2FUQ%2BEK6bzLPVqYNL1yuHxJ40qrpY2VJsFnbUHZSFwm%2BW5PeoyybLDvKmEy22MunhEzXCrAYTXJiOa1QtMKHVLO%2BuoUHSZNyaEQ8FSEouu5FidhqwbV3CjUvRpz9Nen9yPuyB1qOZs02T%2BL2eeIFll99F18J0iK4%2FHN92uJkCA%2BJqTHqt9OJd%2F8gMUKvMAGLR%2BhHalZdBSGKl9FgQVnwU4UWuaXWlmdaZfAYfeTMbgsXxDNUARoxaDQSgDC28iWumVAWuIVMG0gsOZe0KHJ%2F%2BedWH1pzGGCj2mDvAZZZVxFXOviaMYJCF8IPtl7sOUbzGOtjzwHXeFOGO72ms3ubYc7%2FFWzbKbWDmkNVopmurX7BqqVOkbsGW5xanTT1O7cMqTEw44aAzAY6pgGQH7IwW9GhCZJy4xDwSYES5hctqC4Ji6nt7VsXGBdTvxwoHBPenJhi6YHKAi090txe0Jo6EIUOYleyqjE2IktIuk6BP6XnxcszsHtaXb%2FPOakc1Y6X9Yy3%2Bf2WELAhULKagPlFiSJqRujP2Eg%2FJexmCyaTc5QXx4i7B%2BzhOM7JdBxOIEON0%2BezsnvquOI9Sr0rmKv8gakSNgKDFXrGMAjxmzJiCp6V&X-Amz-Signature=dad5b2292799fb613d0ab81578547bd0b7dea1f9004bfb8473f4ce42be8e5ac9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z4BOSSAV%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031856Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIAdjjw3y%2FN6S35HnrrnO7h8UN3KJschwglLRmG4hRwdtAiAZx3ayQlR5H79iQdtIEmQNI0ZvG8O8QiTZQysNTJ%2FPEiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5yJn0RfNxe%2BnYhAeKtwD%2BsBZZQpKXD5pbFdUz1rJ2Ew4llj4KfCu%2BZeXCzNRzTgdPDs5FOmk2cxg8wO7rCgCKCtHGYIK6bB6NL275V8%2FGgvKMiKGnwWOCJpQNdVwUkhDWpt7hBEv9XC5fcuh%2BxNdXq1mYMk8oJcIWv7%2FU0wkxicPfgRpHzIWaDVwIl1yMHWh3ufHjQveGxD3S4JW%2F8wONUOCgzEZlvAJT9HRV%2BgSiYYnyhTy9mw%2FrqeMjzYGFPwyIOGzfBuqDcDbH%2FUQ%2BEK6bzLPVqYNL1yuHxJ40qrpY2VJsFnbUHZSFwm%2BW5PeoyybLDvKmEy22MunhEzXCrAYTXJiOa1QtMKHVLO%2BuoUHSZNyaEQ8FSEouu5FidhqwbV3CjUvRpz9Nen9yPuyB1qOZs02T%2BL2eeIFll99F18J0iK4%2FHN92uJkCA%2BJqTHqt9OJd%2F8gMUKvMAGLR%2BhHalZdBSGKl9FgQVnwU4UWuaXWlmdaZfAYfeTMbgsXxDNUARoxaDQSgDC28iWumVAWuIVMG0gsOZe0KHJ%2F%2BedWH1pzGGCj2mDvAZZZVxFXOviaMYJCF8IPtl7sOUbzGOtjzwHXeFOGO72ms3ubYc7%2FFWzbKbWDmkNVopmurX7BqqVOkbsGW5xanTT1O7cMqTEw44aAzAY6pgGQH7IwW9GhCZJy4xDwSYES5hctqC4Ji6nt7VsXGBdTvxwoHBPenJhi6YHKAi090txe0Jo6EIUOYleyqjE2IktIuk6BP6XnxcszsHtaXb%2FPOakc1Y6X9Yy3%2Bf2WELAhULKagPlFiSJqRujP2Eg%2FJexmCyaTc5QXx4i7B%2BzhOM7JdBxOIEON0%2BezsnvquOI9Sr0rmKv8gakSNgKDFXrGMAjxmzJiCp6V&X-Amz-Signature=0fa0137f6f07c8a739fa2bbc3a2f6b7a07a579159d4d5071152bb756a721afe5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HUZ4R7M%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031916Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQDOM4ZMIbNtcHn%2FwCu%2F%2FaTQlcT4fAYgdgN145BEEkXhHwIgZnU8vgCxuUTqMaYWIbLCppIZUF9TSJT1LChqiyVbMSsqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEh5%2BYf0HctyaSkhACrcA8a%2F%2B0dSxpcbtAuAe9xonfCTVU4Wg4pSCqkazUh2b1Kr0Xlv77y3jcV0jizRfScbOTfOZ82%2FvyFQCzKXWjPyim%2FC604vGkS81GbTn9lQqFRcEQlUeStEosTpNWTN%2BQEPtgoW8%2FO9dnqgd24Tojzp1caX6XKddUgk0ruKiUtf48irE8%2BSPPFOHPlkPCFrYsATiLpL5Xr%2BfLMn7FLzZE01fVrvwySaHBe0DRqs5weRWPY0MgEBvdpxcUy2mPOg3Da4ympm64D1CAAh9Nwf7F3KfGGGcCdQ3MLNUGfdoQLm2lX86WfEGnK3qM%2BBzzZvmtsA6IARXDYJpvPHDqxfUMj7e%2FSrIUIxYWkJwlmk0MXAT%2Bgw3Wwqw5vOZHp1fTEeuClXcsGx1AQ4ndMzTW%2B0Gx7SJpic%2BGUfUgm2wAEfK%2FPhCuImcM2kIWIJYSVbauSAm8P7VUDZYZbtI4nn%2B9d5ElALwu0qixcEis4ikDGwY7hTGBk%2F5%2B%2Bp6KoM8%2Fi1S3RxcrsOkJHeArRRLHyLGU42C%2BdKuxRknbgJxCn%2FNs33vzbhdgd4lt8rHzJNgyvqO8ecuRvTc%2BYdLtZxS0s2QvyEP9dQc8XKQTGc2Leyb3utMCOSZM2ZP5wuvsZLBRnHPHILMN6HgMwGOqUBaAQQGXTmskmTFEJChhXpzP8cGwv2LQmxtmEymw6g38l9P7KExhCdKNbwysQzdkvFnNtHIPGtognzIEl%2F3N25kZINYP07pCcUW%2BadY9NNL8oLFz6v%2BnxLyruBCAZUyEZHMw5AjViNWdBqeuJapswC%2Bg2c%2B%2F2ZehhTaw%2BYXaG1YGUOMOXbRpdFhHfSwVrRvJB4RjhWyGJ7kuu5BEcDALSTQ04LYWBo&X-Amz-Signature=7a8b0456e1bbb00233f1f867520c10b6210014a4ffd28305e250b97c068b07af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466URRLRJK2%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQCWmUoGoCrDhzAUqIkJIjFRczMVKtPQVTfXqd4N0MvY%2FwIgUUSE8bkKksYyb2MBiuHcS55cF3R8J4eXyWYe2X4%2B%2Fe4qiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCe%2FnPPpitPzBkFFeircA37wWEczNLoxTgoZw%2F1tbojrZi4xF%2B%2BpyGBEFWdaBg38ZLIlxmESuqUh3q4kXdrIqahxGfXMkNHfOq%2FPLjBKVlVIM6PNGStGNm00B3e6TgIePY69IL%2B2rLqbqvsg5JJdLlJYu3HFRP3su04nmW83N%2FfYMnxKMged3plz%2FGvAj1T2ZXCcYWpT8qQDMQQZQm1lV3qVvDxWT0czITGzt1NsngjJQzAAaJoE2SKlh9xIbS8WOk0YjYAbUEluF4sECC4iLWx%2FJ4aXMxZmAHrngqpA7KjnNAEL3OJzh0shW8lPiDuBLTy5MCqy8a4Fc4TvgKOqqgPZBsEl0YgqEugXQSyxRXnWYJkbuYSZ0YiStsKfNzcOmfz4t%2B7MrpNTxRwKZsuE9l3vmCSl08ChupQsIlbehSi6%2FxYvTIGJMpSee%2BnyB9aJlvb4ZRdf7LjWQQIa4wW6ltwjrdgyrt4tOcGjIbE3YnhCgXp%2FKMy0usY125vhjPjz6%2FXalCwLoc9Zpxbs04Hod%2B5eT04rn0lnlo7d1ecXWE9VpjEGSx5PbURS3JhcD7RGwOws3NVg27UtlZ%2B1u7WNESHSX28UOBp6037pnteynehwPqt7I7FBBLXLLqzyoqtv7FwSqyWz%2B%2BPG6J4CMMSGgMwGOqUBYrQtFfsJeAW0jSRW5l6Eaxzh1uXUwdK1iBnbelFgPwr2bHlcaOnJhfyANMAN56j%2F%2FUzzecgn1QAcAKxi9rK1TzHza%2F%2B%2FO7wdYUOmAE7dZFNiM%2BYTYC7H7lli6j9FtoIw0QpIsr9c9xRuiKm3WeauWExCCgsnEfBdJ8%2FHBcl9kyY2z2JUa%2FyPU%2FQea9Q0hQxe7IejApP58Vb8nj9bomWWgBN4IcWY&X-Amz-Signature=33951723eb998babd9353862f496c43ce0dbae4ae2e4b708fb568aff2c1a70d0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666TMR4M5W%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031923Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQCdTx%2FBCX66weBjB%2F7S%2F2VUZiMCf5%2BN1W%2F5lLUPOdiNPwIgeRW6gViVpaXOmbExK4Yk02qRzwfS8dDkJtRw7dXWwwoqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMnl%2Fozo9TCxg1u94ircA%2B%2FQ19BSk3zXTh2bNh4AOI0BjXCgSadOzcBY0gpUR86qOwFOFMaxl%2F2vMRyLsOfrzUHmjnlPlukyZ1QdPWYYBZXAw%2BLDtCjLu%2BeAHj4GTmbBMbKiNgwO5Iaj02ndPSG5ZgMIoqMgQDk7IZ6D6Ou5nwi0OaLoXOV%2F5%2BgFr9TTjQc9BhTcOsYMmQKF%2FIJscmlgijV3bxs9FNIOmgmAthFjBxfFDEXU4E5VK8whQctjXEeittpHfuFFVNJ0pZQfSale%2BYFovUAICmfN5jkmJL80KSxldHuDqTudTTqedRE%2FqbiO43piqyGSQPg10Vl%2FfveTx6IVwH7kSUnAIh3yT88OT%2Fa1d8o2q%2FwatvuqjBNjsrOpO4%2BOJLwo5nZiY%2B6jHErDh5YM1SWN%2Fa2oTQ7MRdozF3NPyU8hY6N9lQ3hLC9RN2pBf%2BXfPNPe7iZtEF%2FbtO2WEDImXPTRd6M3f4ljztXoS2BX55gDYfvR2%2FD2TGv1sYemE8WAcnBlwur07LtBzlI3dZpWhbzk%2FQg%2FKBqy9xrndFwCzKpOrpmD3yRvSzQCniUSMCKxo1d9mmNI0yQuk5pCOVAceaBhJRf2N1hAloFqsY0XVhHJLp2vx1oILq4w%2BsQ%2FNqRxCv33lggJ9B5gMMeGgMwGOqUBrdxDB7ygFHLDSoT1o8wwxb3lhl2fj3ovRns2yfNYzukdjQkLvWfzfqI40ycBmY8bGmR9JSOyC5N9gsYeJzOO4TE2xsbcxYOfxxBmztHvAQXgnDTfNCUIEQbEK2fFqTkixoGpM4rNgw4kEU4mAaJlCMp2b1PBO7x9KFlkxegVH3NaoLeLtNNaGz1IU7wiasZUvVBqGC%2BT%2FtxIg95ZxeXtZ1saq18d&X-Amz-Signature=6fa23a7c0230dd4f9dd4941dc33a821d610ca11bd5876fd7bbbcd9e1216f939c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662GI5OXKC%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031923Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIHYOQiXwxsuYiDkk8SmojiSc8U15F4fFawCYEUhSzRGDAiBUdpiNQxj2DRFuIm5Sd5ugRbcehmpo89hdcrOft8hV8iqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8C3D7Ljth1bLM644KtwD0f0MMYAIrj9sNqSmLnIxn7Hhv7TuEJ9BcxDMEGMqKh7WV4fWhli7l37U7jGlwKZgwj0tojFUMOvcTikucORTegoz0gozQnMB8spU2CDQDE2fHCwMhQ8Nx1BTcjWdI20L664aAN%2Fv%2FC3cPdOkgmHYBxiHIWfpWJr5BTIMKB4uPgULtbrWatIeYi4dkRpG%2BXuMWOrFEs%2FLK7RmsMe1rCl0HocdICX3Dqb5Xuwf3Bvl4ZSrdLWgas20T%2BCtmsF498kl%2BW4RBSi%2BqvR7ICF3nMAeGGHP8KHK963%2B7VmSsIyR9FXBuoIzLNhscM%2BllClkq%2FpoCtoSUzuoeK7eGWUSbalYMMaT85MAogyQsMZQ97iImcLEFEkQHnGXwLth%2FEdS0ifsxIe1SwHc0sES8PwUDmYH93tFKRXJjHWZdWKnwnIRzjDqVa7maQujAaAYwVip1FpU9Muvp2VL2oOKRnO4Hw4XpgZXLsesR7By07h%2BVcBcJK6rZHyFviEqxVs0y2caSwm5NComjVS4EtHk6L0MNUhVvFKuFaHVodPMcaG4a0rYu1TmTYewIhuvdNiCOkwOFgbFus1XzQ99AMtmkWxBcnBb9H8WQWbhvYXiFEXbUGefmWo1trKpvjc4UEyo0Uwww4aAzAY6pgHtubLTr7SVtjIb%2FVtY3lUajOMU31niz%2BRg8Z375QGjZaWCVGCuX4bl%2FKbsJfsVLo8r2tOtzpIsxhvDMnZ906nqILA2YcJAlfXINgoeGnt%2BcG1sXfjHYY2FEfg07XGq0FqEUv3IKw9c5disYTmzsqwGhL9L7NPPrxru5bWlfGTNESx6XP4GWvul1Vb%2FeXGBxGnGoQco0ZW%2BRsTDN0z2%2F0NYFHfU7fsG&X-Amz-Signature=b06e76dcbc058530e7d7ae4b27df42070627939e204483cced3b9f20f4234c82&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VLVWTBQK%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031924Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJHMEUCIQDsQpYG12J%2FYDPaDburTcebcC8%2BbCKPpz95dd4ZDiHwpQIgFnqGhHaPwQNG%2F2XbhwxqZezQdU3GGKEqmdyFtSHDOLcqiAQI2%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPzHvpRCc50lblsxTircA3l9Bdj4yMpWwvoS7IkuaWj6al6nucBXAPkk%2Fbd%2Fa3LglH%2BEIkmlP0u7ZpfeS%2B09ju6PEYn5GZAHUBkTG2avRXaB9iS24lFjMmdC%2BArXcwDRHEl9Jun6YH5BkpYx6Wy8QWdWTb1UpW9vRLLSGSiq6Fy9YLjWqqqSBr3Avq1F55Geb53jrQbIWgncTUIY3t66rosy48jVAj4NKf0fCyeFYv6FWMwsdQgBMW0UxDmEbVy6l9MVjfLpygzDB1GL0dKMZBEKdYBpPjAgb5TUgGpnScnLt6sg2L1G82OzDACf6lWJUWAjG5Pt72HVsBb%2F%2Fc%2B80ImdV9ved7INHyO%2BbcwOaDQ6xrTBImQgOjG9qKrwmMKrwawBKGF6bO4HjotE9VVfxmttf18Y1lvF%2B9KEQQwWpPqMqtnwAv%2BNoczX2C89b1wJIzWDuS6xSMbTMAOaP5%2F968K9V8hV%2Bh14a7sj52A18SHYhQsOUVoj4uHAae%2FwfzGERGPkYJj4m%2Bvn%2FRZuRhOsU%2BXboK%2B0q1r4Lz5RapfK8HEJVXJyMMeWLrIlVQke1qMGv2mpDAwXzbbLwOciqRk0w%2B8t%2BAUmL%2F%2BajwEIZLyBzNZkTX1bu6uYYTEPKPs7mvrEHtyAmqAbm44qp1L6MIeIgMwGOqUBhF8hY4dLxy0gtEJCVQIsnODxjPg20MQUWfq6TW5wb2i%2F%2Fhzt0f1FrumK39IG3HxRC%2FrDr7%2Byu5zWxozxNaFgFu%2BkEQp1Qa%2BjIhyiu8Y9MauxooHDqNavvqqQtm7eVUAMx2QGWU%2FqbtiesR%2FjG6ssbQGjCdyT83cBpGMWsyJbzUz%2B69ooCniw3RDO5RC4L5KAPVPm2IqidibxjKBRP5u4CLlqGPjK&X-Amz-Signature=be507a74d1c0bfb936121b123a553adbab852c9df14ef2389ac9e96414f91fec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z4BOSSAV%2F20260202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260202T031857Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLXdlc3QtMiJGMEQCIAdjjw3y%2FN6S35HnrrnO7h8UN3KJschwglLRmG4hRwdtAiAZx3ayQlR5H79iQdtIEmQNI0ZvG8O8QiTZQysNTJ%2FPEiqIBAjb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5yJn0RfNxe%2BnYhAeKtwD%2BsBZZQpKXD5pbFdUz1rJ2Ew4llj4KfCu%2BZeXCzNRzTgdPDs5FOmk2cxg8wO7rCgCKCtHGYIK6bB6NL275V8%2FGgvKMiKGnwWOCJpQNdVwUkhDWpt7hBEv9XC5fcuh%2BxNdXq1mYMk8oJcIWv7%2FU0wkxicPfgRpHzIWaDVwIl1yMHWh3ufHjQveGxD3S4JW%2F8wONUOCgzEZlvAJT9HRV%2BgSiYYnyhTy9mw%2FrqeMjzYGFPwyIOGzfBuqDcDbH%2FUQ%2BEK6bzLPVqYNL1yuHxJ40qrpY2VJsFnbUHZSFwm%2BW5PeoyybLDvKmEy22MunhEzXCrAYTXJiOa1QtMKHVLO%2BuoUHSZNyaEQ8FSEouu5FidhqwbV3CjUvRpz9Nen9yPuyB1qOZs02T%2BL2eeIFll99F18J0iK4%2FHN92uJkCA%2BJqTHqt9OJd%2F8gMUKvMAGLR%2BhHalZdBSGKl9FgQVnwU4UWuaXWlmdaZfAYfeTMbgsXxDNUARoxaDQSgDC28iWumVAWuIVMG0gsOZe0KHJ%2F%2BedWH1pzGGCj2mDvAZZZVxFXOviaMYJCF8IPtl7sOUbzGOtjzwHXeFOGO72ms3ubYc7%2FFWzbKbWDmkNVopmurX7BqqVOkbsGW5xanTT1O7cMqTEw44aAzAY6pgGQH7IwW9GhCZJy4xDwSYES5hctqC4Ji6nt7VsXGBdTvxwoHBPenJhi6YHKAi090txe0Jo6EIUOYleyqjE2IktIuk6BP6XnxcszsHtaXb%2FPOakc1Y6X9Yy3%2Bf2WELAhULKagPlFiSJqRujP2Eg%2FJexmCyaTc5QXx4i7B%2BzhOM7JdBxOIEON0%2BezsnvquOI9Sr0rmKv8gakSNgKDFXrGMAjxmzJiCp6V&X-Amz-Signature=91cff91fe6a6a07220ef1a02a6b5101d5865af675d3c589247b30365a0c64a36&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
