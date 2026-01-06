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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHUUU7DU%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC8XZb3DmvA8%2FT6je62iwVUqF37PRR0RoQXNvo8LODH5AiEA1FVkdKlmNRX%2BAs0KtjiR7rJSEyFsmm3oAq%2FysH1oL10q%2FwMIXxAAGgw2Mzc0MjMxODM4MDUiDABPAlRcSGk8xF54KircA9oKRm46nguTjIVZroREoxIUb6KxkbvmG0tUylzgWI9R0CXe9FFfT6%2BshQ8ql5jANdMsKHKSUGoa7pEk4VU9uVFEctES2qMknjV6xw3iMAZPQif%2FlMgnl9Ua8phWIl3BMhyLTtcPnx4xccgRvgAiWBo2LY6ekDMO9ekFo1MZbGgEU6kUZ2sDM%2FkOlHYQpEATOpLVN8uUlpVJAlXJhsQkeXY%2F8pj16BU521NgmoVBCopjpC3ouel5cThepnmuMi%2FrQwjn9GzlVFqQRDT6VEFV6sSJmi2Vv%2FeJiQoSFzgiy03dmK5zI86onggkAdKEBRHRwTzUAo7j6Osu9utH55QBaD%2BCEG%2F%2B3EItS3OqIO6QwJYv5L5mcRRnc6MAHLhqhAUGBelTv9%2B%2FQGnm3UVkMTNfq4R0dCAfntghNB5doGJK71Fm7%2Bcgy%2BS6x18LbGHm%2Fx%2F2Vq5PQFDsUC4d%2Bdvm3WtNhzkCcMPkCYqcHQkNbnbeAEOyhzgj26%2BLRSYNxg32%2Bczck2Mx04mt5zMbU1pUgBlOwWiU90K1bDwCC5N%2F25tZU%2BM602eiTuOGjVBHq3uBclNBxa9kbe7EoTkZHlnlbvu3PWEmmnA6W2jprPnE%2BXLnP4QC04lzj331Ui7v46MJMOib9MoGOqUBvCAjw6ewxEHIDptt%2FrdJjQr9nTGfU8EndMzQZ7ZX3w0LMM5nPwbCiFnY3YkoF4tr3Uo7f4YbiCztPsWs0CJdrGF6lYUeNsp89JyIdgLGpvIUcrc6j9%2B6k7pTkiQzf%2FGbdpuToJe4O6j9F4d9ln4Z65Vuxg%2BucIOmSpa3cQ%2BDddcTFFeKFWVY%2B%2F%2FmEbmrve%2FvvK%2Fot8SvjpPma%2FyYJlxXwVNMQ7s9&X-Amz-Signature=50115086e5c08f7955a97a9f022cbafa4b91dc55498a02d27bfe9a957d92544b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UAELTHRW%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCGhgU%2F90ZGOTFq59WUZlx3xNXbJUPF%2FgvCFoSAb0gqvwIgetoq9TxBMyfdvhXXfGzxrw%2BhA%2Fa76L3Mt7WBH%2B6sfSwq%2FwMIXxAAGgw2Mzc0MjMxODM4MDUiDG%2BpDlyRztEPgVs18CrcA06H1LNBV58B1Zi9yLNsOZAulIfKo5ufbYyJ1uajqFyjJuRpbURfZhTlg%2FalqClr6leU5aFMGUYuWjlvwe7SMc7pXVBbkGru866CeArC48BYTMJzD5hKIymghlrlvD29iDX2HEi9Xi0bhN2iAKQN6CQFekDepY6i2IgRE9yPBFForcHPpl%2FEkFUHyR%2B2JRiW0LVRVzj5md0jOAFtNrLEUnoGdic2gfR9BUC5id%2F2FUC5s5bbobLck8wfFbXwfOAtOLG0GF%2FW1bEGqxeyKEMdlv2iDqm9vj%2B4sk%2BcJkZsLo0boln3pAMq7Dob%2BP0ZG39T7SW5A0CONr23Ebzo%2BAnvisbteUYZEXgkUMbFJXsSb8rCaaKfgo0%2B2akLd80uX9oOM4EmO2REYK%2FwIo2BSZH8UquChApfDavNZzTvHonSZutolrk4uRudl%2BgsFVQysQnyhpjtugEJSJNjyx76RQ5EnaVQjHa3DpsupQcaII0WJnoC1Q%2BqKocUvn82r%2FJNe8%2Fzj11PjxLNazgBv48MiEHy5iZTVrL0Gi5gsIrD4bbX8xwb%2FmMfpQAdw%2FgVILeqMQv6AljINF9I6HAbE91pjpcH7XWIusYvmPFJ8cCl88BdRbR%2BYuoLuc10vl2FmbofMOKb9MoGOqUBdwW3f%2BXqWBcLZflV6fzMgM%2FSb1cciHADHhsHT4uTAAZ%2FOa1O60uqwBoD8d6y%2FO5MCgcVpVrsqyZCdRkPWI2DwuO%2FKxK4wbZ8FBjiuNoz8mtu5Co2vfSbj%2FdW2v0kKKjLJs2dXbrprptSXkWqSxAvnRPXfhaGmqgug9JVHwsE1fXpYrlBFA4Ky%2BYYM6OOOTlDpLNhR3CHAXKg713LE8gF4k0r3V8j&X-Amz-Signature=212672fdb2c60fbf4db56384783d953103c42acccaea4b386f07512f63081f71&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UI7UTTTI%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDqUNjkjmVROmb5jM1TKfY4vQOJn0ny7yfsmlhtHMykcQIhAKhseyWQDJl0Njid73s4HX%2BkApPBxBJj3CAg1LxrsFhoKv8DCF8QABoMNjM3NDIzMTgzODA1IgzgztK6tcC6ym6g3Z4q3AOowg43NZf0sUuSkd1zgGVOevWF5bjXXe6dMO6RYAEqbwl2uLOIt6eCOc3ZCpg7qoZxqI13zu1GQTiWMKOUN5byY%2BiKGr6YJVIwCtKUDMZHiOsmZGGq5PUxuYP63tVBFzUEzyr%2Bmtfj9m8vigOMOtYa7ulz7Ipmxs0JvhJEM%2B%2F%2Fcbnu2RHCANZ0BKBCnBfV%2FWrde%2B%2BOS0ULVeyGcQEnosakZNkzgcFtBDYpwUnEQAJFV6z2CX3A3aZJP7cHZdCRmG9oZ24KKgdDu%2BgQ6k05d%2FUWlkae7b%2Fsz%2FGAXkeCyXvoOeXkGLQdqZ%2BTAFQL0xVuQZjFqydN3o7R8wFLFPqhVngioOaEb%2FbiWkBBA7%2FxtKfW6nODXSMCbf6YGBQ5U2U%2BCZafI6o04GNPhipHK6WMs5PmMbC0R9FKUhU5CnuwdZCTBIEcikRcH6k%2FkkEFINj1U6MLoKSh4c1ncmsS%2BOSY1pqFajyGEK%2BlRpRj6mcQaPWb8ZFevOUa512S73gzgTwYFIRLHd5obdxMP%2Ff%2Btdm%2FQ2VIgJh3S2%2Bxqc0hJtzBRUIkj2yKVAlnws1Lu4eB6crD9MmblRzJM1nwHnrIGiQm8jAM6QTanimXEW7ioZRecbHbL1FARlJ7CjibRVbF%2BDCYnPTKBjqkAaph4CfNS%2F7NOrUygy1oRorrbLAB22Gr1T1%2BlipShYtQKu8rVqpEIsdGIkeO0e6MVrw7my4ewqlUjwltaHYF7jSMsEAmmqjAtHEDEJ61%2FRXqw6VAt7zMwTf6ZoTbBRrJjrgy8jToBbjJYHPElnTh8rZB3sYlvQCy7yh4yalVh0DsVOZfKUvN4v1VfkSywymcaG9G4HYU%2Byx00M1qXLvMe1XdVoFM&X-Amz-Signature=779053f8cacaef18d7748eca3e820755eca415d5cb788cade6a18c8775f17adc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UI7UTTTI%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDqUNjkjmVROmb5jM1TKfY4vQOJn0ny7yfsmlhtHMykcQIhAKhseyWQDJl0Njid73s4HX%2BkApPBxBJj3CAg1LxrsFhoKv8DCF8QABoMNjM3NDIzMTgzODA1IgzgztK6tcC6ym6g3Z4q3AOowg43NZf0sUuSkd1zgGVOevWF5bjXXe6dMO6RYAEqbwl2uLOIt6eCOc3ZCpg7qoZxqI13zu1GQTiWMKOUN5byY%2BiKGr6YJVIwCtKUDMZHiOsmZGGq5PUxuYP63tVBFzUEzyr%2Bmtfj9m8vigOMOtYa7ulz7Ipmxs0JvhJEM%2B%2F%2Fcbnu2RHCANZ0BKBCnBfV%2FWrde%2B%2BOS0ULVeyGcQEnosakZNkzgcFtBDYpwUnEQAJFV6z2CX3A3aZJP7cHZdCRmG9oZ24KKgdDu%2BgQ6k05d%2FUWlkae7b%2Fsz%2FGAXkeCyXvoOeXkGLQdqZ%2BTAFQL0xVuQZjFqydN3o7R8wFLFPqhVngioOaEb%2FbiWkBBA7%2FxtKfW6nODXSMCbf6YGBQ5U2U%2BCZafI6o04GNPhipHK6WMs5PmMbC0R9FKUhU5CnuwdZCTBIEcikRcH6k%2FkkEFINj1U6MLoKSh4c1ncmsS%2BOSY1pqFajyGEK%2BlRpRj6mcQaPWb8ZFevOUa512S73gzgTwYFIRLHd5obdxMP%2Ff%2Btdm%2FQ2VIgJh3S2%2Bxqc0hJtzBRUIkj2yKVAlnws1Lu4eB6crD9MmblRzJM1nwHnrIGiQm8jAM6QTanimXEW7ioZRecbHbL1FARlJ7CjibRVbF%2BDCYnPTKBjqkAaph4CfNS%2F7NOrUygy1oRorrbLAB22Gr1T1%2BlipShYtQKu8rVqpEIsdGIkeO0e6MVrw7my4ewqlUjwltaHYF7jSMsEAmmqjAtHEDEJ61%2FRXqw6VAt7zMwTf6ZoTbBRrJjrgy8jToBbjJYHPElnTh8rZB3sYlvQCy7yh4yalVh0DsVOZfKUvN4v1VfkSywymcaG9G4HYU%2Byx00M1qXLvMe1XdVoFM&X-Amz-Signature=151d698e4c41e34b1571bd1b32d2658240f7e84a3f63801b4ea24e06ae93aefb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RCNSBLH5%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDbNgtpLnwcbx8DEzKZmGMlV%2BPvdmwM51OmfV69RR2IiwIhALML4np94iH22gPZ9Rv8O7chgOmr4Zt60J8tGoyX3l0cKv8DCF4QABoMNjM3NDIzMTgzODA1IgxdMzgmavK4SREJR%2B8q3ANXcqTJLEoyq%2F4oQbqEO6zXO1XNXmjSnx%2FH2Ckz2H9keqNAacIgGa2fRu4qwmeEGQ7K1t5Gh6dvyCtZsOESyOxvyZW0TIEMELZ8kXslvMw91cMCeUIe3QTfQ%2FRucE5VSpyhAuLDg1UbF4hz8C7PtUpJzmkkGP%2B7tG8ki2lgVPcYKiKFlnoa%2BHBhahGX%2FienL5dM2BY4iVrPJk7Gn9Y%2B85HHIbcHjEjheipTTB6GsivMeFHRDDtsh3hLtLM61JGL81bFxHl44pPINM%2FL8wJeG3vE9eothDFMYkPAe1ZuPQPqY4bot2XY1QLff0LCQOne%2BakjK6t1JGLk1BJAm7e2P9QHJ8NHLdaIbzi%2BuPY3isRrXV4b4ytkWmVGmfeOhwuIhzKZa4HEZA7ZDCDQggIM4FLtCCqy4gB4BGJNBK7jJkEaQCDIJ%2Fead2XRwzNcoS%2FSPNjgmYWkwwK1x%2BtvyrQGt9Bo1e86PdXVh0OMR5lhg4vtiuyV5eCqYk8WUjDdTqIc3Gk30orj0Ssn69R9FqjQd%2BnRFoZJMd2q%2B0me%2Fj4j2n8tKTIFnvBlFWxmTN1QD9PyYi4LunrMUjwu0ZHVKBnzHn1L1KeHSyeHgitJWZb3Yw3TgeVhlZpjFC4hmCfY8TCim%2FTKBjqkAUXG2Qy4I8HFqlNQJjHKMSk4oSha%2FzCzVRQhzv%2BVftReR6lFM8wSWIJr2hC2kJq93%2FmfOFFvWExjosGeUOHrTDLPE5%2FjLdJNn732sVJL38K7YvzdO4VTO4yBvBzGDU8J6v6Q0w2IC5LG%2BP1ngRet2lOthIYNWN0o72QGnshJDBh39EGAqB6xIkD6ubN%2FyMY1O20THnp5uevNs6nH3GbxIkSKmThQ&X-Amz-Signature=aeed04c29a2a3756645d8b55074f38fbd90b0794092bef9e50eba79f66cfd14a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XM74AVNK%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141325Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIByOtghxffbjtM2AWpeSAYhQpuweHywjDVcEsoBHibZGAiEA0WQDHPGJtIoSgWCWHBMoI%2FSsJ0FHdtKH3dkfizKN9wgq%2FwMIXhAAGgw2Mzc0MjMxODM4MDUiDEowlOzMS7udzf8dJircA3IbbVRiD9VYUGXmDc4RW46vM3bus%2BMMFsGnfQbItpW0cs7LKVWHyOpdKZ%2BjFArxJLm6aXq2og7zN%2BfLwWeegNBNVSlPbEYfBcdUPUf8UYqciQ1O6g342uM2OyVzcKmtcDi3Ad7Yy%2FTYj%2BvVdMo%2FshECxxyMTBPAol%2BD0jEuD5UT5t2onfDnVG2FcptcrSIjBzxiNQYChQZaMrsqFojrb6uenBrDPGKTDuKr1NDF46VM5Kc2MqXF14qfwx%2FJlFPtFFbklwp6sC19JYLoDPt3QdfAFKe0EkkSwBcw8tssSUaQAzoc%2BOtGBp3spYo91aVRlZzUrFlpkaFqhRAdozRDoX4dzUvwQ29I94HuxkOsjK36V7%2BEhS2JOc4xvcqqeAoZct1SOTFUzWMecpLOj4PV%2Fabdc%2FYElSrgCEiAZLGSEeqNbSbP0s0ZeSHFnMHpt8BhWGf2T%2Bq5r6iFEBxNnNPH%2B%2FSnYxNVwlOOLE%2Fk9C%2B9QbbcQR2%2BHAyM5sYs3qhK16rJjPLe8Zq%2B%2FCqG9As%2BebDa8URLkognrHrOwcyVJHSWXODF1MrjOSSaH2W7t9zmFgifJ9kTI%2BB%2BLm2%2FATNqwuooKNNFQPyR4Zvg6%2BLaZ9TokXeYrJByv7OyIUVjyB3gMPqb9MoGOqUBQUP9PcINVqFDx0lGJKRdzQq4j18BdTFpZIyN%2FkU6jjavm3g%2FcZUAl%2BcZraNwJiT7mRg6Bi4O9wPNyIVsldMu4OPKfOLKWxSIrZ9o7v4PsB7n%2BDSV%2F9Eo4P%2FBAmxqvlhGxR8TH6NsKxN9zjnYVYwuS8tPA5zdsq3%2BLXRGzgvQxgIeOYucl338l8ji5ak5FC87rjk%2B7NtVHAtDWW86u2xuPGN9uIDJ&X-Amz-Signature=5c5fcac32c507556875beae60aa44d0e96f15cd4b3e5b9eec8f357f7fd2d9788&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZUKUKYNO%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141325Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSvdm71ZPXwZwJU%2BDnJrDz%2FGCNzX898nvQ6efBRyeQ6AiA9oeiieOC1MxwWUe4M3Ymk19f5yK1lt%2F8M4UbGf0NCPSr%2FAwhfEAAaDDYzNzQyMzE4MzgwNSIM9wY0BGgaBmrl95BAKtwDfZUYrLLB9ImAlFR7b8t1RDXpQIEvTdYHoAuJgzN2HBk%2BfyrQ%2BtlymayEhrJD0U7XitRz45QY4bOOifX3zu227UzWsGaf5imwRaDrK9OPDw22kd3%2FTviorX%2BfowtZwbUcSZZIVHWkKqG5E4deYm9uuCw%2BIzfrV%2FW9JhcOGglTAehBq%2BAc1GgU6%2FxfoNskNsHznwHxxoICJunZbtpirMaO3zFyOENRkmuLRT%2BWChrooHXy8KOHrk79iyVOrvCsbzzVBYkxmkF9NpiP9%2BGul2JcZEGz4MfPl%2FF7PXzNb9Dyoqkh3O0GiTanVC6ryDzNlIHsdxt8ZhfHrF8g8G9AeGfwIH8DJN0Cpj3SONqMpLfbvYc14Y0slkpT7Z2fnJrF%2FkArEi6gAZ7AUJcXhevPtSFHaiqfKe0Kvek319TeL3vEHA9BVWVZXX1z495wgHyiDYb%2Fd0K%2BNwVrgPrEIWIzGnCTedgIWeC0pgVawsl4pOvdjKSzrhatnPRTJn4i6M63sjaOkRo0SoSbRv%2BmSmdq9wLWxJclBkjy8BJkBh%2BaUfGT0rQOJ2NV%2FW8PKYUZ1Vfj9XrjL39Mm5%2FStQLTGFuGqt1YrAvHJtWIyxOdoHaAGZi9JRaVxox8fWrrBpAKAmEwkZv0ygY6pgH9zgMCRJn83ZLF%2Bn1JSE7Efcls6MuGlffXyRX8%2B%2FxVrqhsyqddINqXrtNMRM0NQ6j9q0J8qcC9QXIEnpUbi5DA6YDYAzcYn4ZypbUj0dvUzs6UxBYXvlwxML7SKsukygXV%2FOY9PWC8Qvld5UPqpXp4L6JwmuhxyZTRaHKCs94HpeW4T8VMEsSaFQg3MN3CD9%2B3kjQue7gNqSUjTONw88TwCKRJLT5c&X-Amz-Signature=b32b70d2d65eee4b04ac28fb41df85c47939a35c7aec870ab93f0f5012afb0e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZR6LMJ3S%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141325Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB61kXAGtkpCLX6xu7KnGFybrUCNiVEaNiGDtQPTJvQVAiEA113lgXGar%2BkB0Kr%2BXT1QBsqcfvbm3vmbHSWfDDx3ynQq%2FwMIXxAAGgw2Mzc0MjMxODM4MDUiDGhWvAbCYTWvH7%2B%2F4ircA5KfctSGdomg13J%2FA%2B6wHh8xM4r0bxctNo5hAcc64Sgj%2FYgEDts6u8jn%2BvEFDKx3P8mUPAnmHwQrBKbVY1q%2BhD2FgxPk8Xpml371uU4U9FbXCMxDCZ4U5oNceAeD%2BH5dQK10syh0kVkLVayJ39lzq%2Fpj1mBeIqDrtYJP1Lng7tGjjmwyuEJjpjHGcChLW5vpL9d2MX3Cosg4JckruyyWChNRTCyn%2F069e5lL9VgDw0XMtVjjVoa8k%2BpL%2B%2FVXXH2Xz4kfxf4XRejBXJgoKqzF%2FtHbBF786GXRPJmdoicSpnD6irMNCMPdFIjC%2BmNR2k64LJNfX37wHOg5zpvlYEA3i%2Fz6qnsPzj1WKJTnH6VLr%2BRzTkGa4Nch76HfrNi1ontKwQouylI72eUg0CHFQ3glQd8CNGkKKxvJYv2Z5OkfjPi4D6y9Jga7R5c3VuNwbicQ5h673xfcOdqFxIScIX4zF0yFDLU%2BXG5xzwsbPBzGTJzUj8JIxBMpNsL4mQW5mXF1I7q5%2BpOyyaHs3T%2FAeS5G8kb9Hf5HhE28jE0%2BsSATwUeOtJE0p31D5hQNPpAfAdRjBEMeei1IuFg6HS9L7CqZSOvDKFOlz9vvY5dQji4x3nVDU0nG9JcmGfKCokSIMLWb9MoGOqUBGF0hKlIja8kmGvEiP0xOyq9EbSCojAlmlEFax%2Fxg1DxCC3BU2vQ4VGtgL3BVPv597Fc4Km2juq3Xj%2F1HMVj3BCZ%2FmPXOsRcTriYNilEJZEfDUcK0wHQ7Lwdubju1f5405YHroGrQhgMipPGZ8wO4HFl37txAinRM6aUc%2FGhUmQwnVIica%2FQoBiFxwd%2BMpAbDPB8%2FjGGff%2FqiLIlEGZetQ9CkQhtA&X-Amz-Signature=88df36ca217ae50a13d98eccc601c93beb373398547c993546aa4c7f2fc57370&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMR5KJ7T%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141325Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCvUG6ebyyRcLCVM0uWA5F0j3nFZXWdxAAt0MUj6M4UvwIgBtAWNlwzX9H%2FVbn7W3Aox%2BiwFg00U4orXpZhvK%2FWPzsq%2FwMIXxAAGgw2Mzc0MjMxODM4MDUiDFvf6Ms5hYkIcNeBYSrcA2LNpz4EDt4tUc%2FaCPID1Iow5%2BwkgfGAhBfCmSamPlr3yzMIYR73ApjxLhZvaUaT1EUrltOof%2BGxf1WLNrz1A5kJL9d6bvpTq0rQSA%2Bm2Tx6M%2B8grRjSgBWi4p42hsbc%2FfheIv2QdRaVP7uYzs6jQYc2BVWltRgSO8YwnYB3PvlIxVvIVD6W0EiSxp9iJ2fh6plTYAFPEuSc1YW3Lno1rVra1nJNGKIlRcbGDlgFxlB9ZlBu%2Fk6oqPOFMYAHC%2BB4B8cdCKko28yD%2BBAnkY7xusLe4vhq6R5ueOt45Bb3Ny8Tq6nmvNxL0cR8Mi52bfAfZUkJq0lEzAKjNyfpY1P0775UZu8WknQJX%2BeGFtkdCp2mnEn5yL9upJNjulGnOKN3UlAKfx4j%2BJ4MktqSH4mxfLBLH79KLI2pv0HpeuiMkNAX2S%2BoqDR6%2B2hA1tBwr20jIpUefvyagb9ZuCudVBpM9ZhbJR4cmb7IjEQ2QJPU9gweRTo4SfEAIrzsdHql7MUfbQFbqsXlyrGn8GOfYeG8Poz4m6sou9QLGkG%2FwVQcAudzIzUmFk6TqUBdpx5BNkJ%2FHOb0rfhhtywGtA8w1%2BPSPGkSI66shZsPQo7VxDMCiWkHbkuJlbjnfJlnkQI8MLCb9MoGOqUBFgkeMADS4yU0tc0iA2eZOLcTcvgvg5T3mfXj9ditR%2FvKyZJhJ1ehj8tyq%2FYjzfkde02vgaAA9od%2BGwFmss0w6MD4WUuT8GT3Az7MtVp00nygyS8W2f7LkaAkJLHG94gnmVKme4M5q0megbQ1%2F901sg%2Bhi209CDnULTtKjlNO5OQInFLIhmjFQzOEDqzx6k%2FJivMqD2AFil5vZMFLsrZ6qSP5ANCA&X-Amz-Signature=d0bbedeed0babd78caa2f0c7a52de59290ac66f67e4b15bdb2c32148537a4ff8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UI7UTTTI%2F20260106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260106T141307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDqUNjkjmVROmb5jM1TKfY4vQOJn0ny7yfsmlhtHMykcQIhAKhseyWQDJl0Njid73s4HX%2BkApPBxBJj3CAg1LxrsFhoKv8DCF8QABoMNjM3NDIzMTgzODA1IgzgztK6tcC6ym6g3Z4q3AOowg43NZf0sUuSkd1zgGVOevWF5bjXXe6dMO6RYAEqbwl2uLOIt6eCOc3ZCpg7qoZxqI13zu1GQTiWMKOUN5byY%2BiKGr6YJVIwCtKUDMZHiOsmZGGq5PUxuYP63tVBFzUEzyr%2Bmtfj9m8vigOMOtYa7ulz7Ipmxs0JvhJEM%2B%2F%2Fcbnu2RHCANZ0BKBCnBfV%2FWrde%2B%2BOS0ULVeyGcQEnosakZNkzgcFtBDYpwUnEQAJFV6z2CX3A3aZJP7cHZdCRmG9oZ24KKgdDu%2BgQ6k05d%2FUWlkae7b%2Fsz%2FGAXkeCyXvoOeXkGLQdqZ%2BTAFQL0xVuQZjFqydN3o7R8wFLFPqhVngioOaEb%2FbiWkBBA7%2FxtKfW6nODXSMCbf6YGBQ5U2U%2BCZafI6o04GNPhipHK6WMs5PmMbC0R9FKUhU5CnuwdZCTBIEcikRcH6k%2FkkEFINj1U6MLoKSh4c1ncmsS%2BOSY1pqFajyGEK%2BlRpRj6mcQaPWb8ZFevOUa512S73gzgTwYFIRLHd5obdxMP%2Ff%2Btdm%2FQ2VIgJh3S2%2Bxqc0hJtzBRUIkj2yKVAlnws1Lu4eB6crD9MmblRzJM1nwHnrIGiQm8jAM6QTanimXEW7ioZRecbHbL1FARlJ7CjibRVbF%2BDCYnPTKBjqkAaph4CfNS%2F7NOrUygy1oRorrbLAB22Gr1T1%2BlipShYtQKu8rVqpEIsdGIkeO0e6MVrw7my4ewqlUjwltaHYF7jSMsEAmmqjAtHEDEJ61%2FRXqw6VAt7zMwTf6ZoTbBRrJjrgy8jToBbjJYHPElnTh8rZB3sYlvQCy7yh4yalVh0DsVOZfKUvN4v1VfkSywymcaG9G4HYU%2Byx00M1qXLvMe1XdVoFM&X-Amz-Signature=77579ecf00cf88b8d6ed86caa18ee4e55ce901c1e9f0e60f1a7c304bd54cf8b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
