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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663TCMHQL5%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAjuMbpUECVbwvBZYBATvH4w1N54wCP7Hizu33jaUl2tAiB5M2rspotbWBGr480F7lBr6HPKGNRnrdjmsYfg2rCL1yqIBAiM%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtoSQZqHQ5dK808WCKtwDZ1EwG%2B6O%2FCw%2BjZsPimhru7bbUQEjnAWR8HbYPv0ZBIm7jO6xtWXG3%2F7hmzHW7jyMVp2kUPURpQdtmCrtBdAhV%2FqwEttbtKzaVK7bZT2mQDvRFhefF%2FD64Hyus6FfvuRjw0dV2gVUhJwstcTLlGF71zUyyJ3dnt68ptY5ugmpg4lmKxGrcAcWirX4E4NxP35QAM%2FlHEf6X62yHHEZaDrCEr3BWzmewTIGevgSEcdvA2MqVPsx3b%2F12rSfVd0xu3dSw%2FAVRpt7pT001hrYdtGHaaG4zYio7Aasui0xTApUCCBYy7c%2BcTzbdRbAqzrNK7uCzE%2FNO%2FvXpERjcMn8GIcn6wLly%2FIXVIwJHnaxqpt9HRbmCuG68kGEjY7Ce4vIz4%2BHpk5Iq%2BvO0A1Z4EL0ZXsF0ptLjfpWFyT0tgcHyaurmflXsGnNdr%2FjpSqlnXf%2F95UN8cnRTXtN0JXy7YjUG1lRRhNUNsXLxQgGjqVLb7hpzSwziGRIIs0ncm7Z5FQLH4QYcmDy3ybEH51uCNtzvPFcyGoBHVvCHv6KNDWgbaFJymiyOvAZVwHi8DaZww3Jwj2P2JJdo6g3xwMATSXhNqtgnLbeqkD9%2FiKiw8K5ucAiorptXFZdIYIGC%2BP3%2B7gw7dSwzwY6pgGPDZ7zKTB8Hpg8FBK7VUM5zdLjRffmN%2BVR9js2DDjlQDlh2CslBmsvCIXI7iE6jBEkolSpopYLZtN%2BzIQShSz4imvx5eYHMv%2BXmvG1uW491DTXgsrvzullaQ7U7q2VFq6hBg6ivZVa2O0szJKVx7%2BNzawbMYjfbd1q83oTWVVj8soLUrY3Znel7ucotLi%2BV3FOdVP4LEhD4rAI10Ai4kyKV8pN8P9T&X-Amz-Signature=981cad15512c97927c99a4b20002b6f7588905a743a2e3a241ede6e7059b6521&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WL7MEXXU%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033302Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDQKcqN38e24Sa%2Bh3UUMbd5fE7YX2hP4TCwOpvyinY1%2BAiEAp9XLb4dulz3JR9yPrHw2PQ%2FuU%2Bqm2mtjA%2BEQ3Nwb%2FN0qiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDt76T8PUShBFe5K2ircA3ItgvmFMNk94%2BThON3tgFwlPj6w6pH9LrbJBa44xSXT5aC4WrGj2jyn5wPpL79PFq9R54k1CBxRpXi0qHPsOmoFic0gS5YPf3yW5XbRLBmIyjBmpmAtzuKP5TVaABf2C0fhFiPK35eo1PuMjUBn7CSHN1L1Nc3jEBRX1OE0tbrIQa401VaKwiPv79vZ0xZI47LuARH5X3bK4aGH5o0iturF1SBPgLJ8K5SxoXXDfRap9zOGxgH7eRyBlHf22TJy9jTFizYLefgxRJ3vBFXOyOGUowuNN3v%2FWr8i1wMUFecF7rK%2F1l87viiFQx5eArRMJHpKygeYEkbmsW7otmqWhTtqvxVEon3GooV5ztuAKDxb59gteXghZ%2BOYiawlrVFS2%2FKdkp%2BQLqUbwI%2BavKPprP%2B8kPyuzYJBPRhEaOiCY%2Flv1wLA4iC6EiKuf%2FzXpSpYLlU%2FsZAUbNUQ%2FdPFMG4MNkAkA7pYkRzc2kHdckHR%2FLnwgXn1Q8Oa2Wxn%2BL9i%2Fs3kzPhjmTh9RG9m2YLz2uVyGTvr8K2utYmSBGZkbaR1VVVt9tArTSorxNATm%2FAi29btcSvCYlYylnnncX1tO9p1TYM07vCw8qNnmDXqj0NdnpA3LAquFpcYvZD7uVHEMIPSsM8GOqUB1Xym29Lx1Ax9SvkgRh9KTeDAwCyKIIO7TlDWlo90xYt0vRqtzlO7GXa2KNPN%2Bz9ytC6D0x6Fa%2FP0dzujPbyomgV4QclQGvkpdk6cWphpZpY2wQuzBLWgFgcBtheJa5O4zg0yThfXC1zFc1KfHTJmBQz7zAlti5C%2FHX91%2FJY3O%2FW4%2Fy0WDWNBZNxqbdUp%2FJWWlhHaIU%2FOAbflymROd3E%2F7DPgAern&X-Amz-Signature=8cb90744c07c60c0d4ed69cb42cbce3d474b8597a9c6f4b73cc928d5b34aaf65&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGSATYSV%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbdxt4zWU9FipAsl71yUUTe%2Bt%2BRVNbmWewsXXXMRV9jQIgAOKeL%2B3I283Sdrqcs0xyYy7vt2UUn%2FEiTycm3DnRuQMqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCfZDcivX7s0pDmuMSrcA8d%2B0NgsbU%2BjyV%2F%2Fqr9waV2%2BtdJrHDV9ahoHbwTpcUixnQAhyphGtJArlLD3w%2FF8EVig2uuWHWf%2F2EbnocfZXFvlEGtn2TwQVCsfuE15SvAFcDPqhjpZPZw4nopqUWxfgrok60ib6OsJzr2yivJoPix9J27hXUykvqgZ7wAFqFGc9Cm9VKBnfrhnHiky9cR6lWHef25T7pH9cnDlAUknreWHPTkEKQ%2BRbFuCyiDFhEAn6JtWmhKy6XkrZKlWakn8Y294eD7zDxo9cCTkRK2xKaZd7%2F2%2Fb1ArXdR8jLFD4nLG%2BVrHAgtiBWCX4mnXrle0Ko0wUYzEu42qRnmSpykNmEX%2BzUix2L8Fz2%2Fx2s1%2BMMd7Rf%2F0bwpwbzX%2F4yloWjRnxBlPUE6x368%2FXjWrSguDpel%2FsrytRXU09D6cISbe%2FckipYhqJ%2BkGCTxYtxhWFl4lQruxg3yjPAreRzBjIqwQ8Cxz68boilbUJhUoGvPVTG8tYywFwr38e61BK9%2FuBA7dYp616uVaasiv1f%2FucsnDMgaxGFj8kUMIPGtmLRXnmH4sogiCh9PPX3XH7uHIwMC6uto9pyzJ1VA2yuyyqq42uc6BfaIuQPXoUUMccebDVkaY4G9imEja4oL2HMRZMIPSsM8GOqUB%2FJbsoeWW2qmKWVQja4V3VmVp2j92XLCFVKRzN8hWMrlPyBkYCRzmfYm2YujGbVjzBWB%2BNE%2Bjst2b%2FNz%2FDn7bonDTK0sQdxyyu51HycxPdE6XseUZGHsirCPmrbfhqVBmHfYnDxt8RczGCydPVsxhoIkM%2FaKyZaEhxWjVH4Uo6O4qX79xCpaGfFVJqvMePOlrFrum0fJnJp87oYZ7fQLyXXigO%2FbY&X-Amz-Signature=7191b7c8dee0a0e5e40b94cd9696eb3676171f8a948074274fac151cf63b9424&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGSATYSV%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbdxt4zWU9FipAsl71yUUTe%2Bt%2BRVNbmWewsXXXMRV9jQIgAOKeL%2B3I283Sdrqcs0xyYy7vt2UUn%2FEiTycm3DnRuQMqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCfZDcivX7s0pDmuMSrcA8d%2B0NgsbU%2BjyV%2F%2Fqr9waV2%2BtdJrHDV9ahoHbwTpcUixnQAhyphGtJArlLD3w%2FF8EVig2uuWHWf%2F2EbnocfZXFvlEGtn2TwQVCsfuE15SvAFcDPqhjpZPZw4nopqUWxfgrok60ib6OsJzr2yivJoPix9J27hXUykvqgZ7wAFqFGc9Cm9VKBnfrhnHiky9cR6lWHef25T7pH9cnDlAUknreWHPTkEKQ%2BRbFuCyiDFhEAn6JtWmhKy6XkrZKlWakn8Y294eD7zDxo9cCTkRK2xKaZd7%2F2%2Fb1ArXdR8jLFD4nLG%2BVrHAgtiBWCX4mnXrle0Ko0wUYzEu42qRnmSpykNmEX%2BzUix2L8Fz2%2Fx2s1%2BMMd7Rf%2F0bwpwbzX%2F4yloWjRnxBlPUE6x368%2FXjWrSguDpel%2FsrytRXU09D6cISbe%2FckipYhqJ%2BkGCTxYtxhWFl4lQruxg3yjPAreRzBjIqwQ8Cxz68boilbUJhUoGvPVTG8tYywFwr38e61BK9%2FuBA7dYp616uVaasiv1f%2FucsnDMgaxGFj8kUMIPGtmLRXnmH4sogiCh9PPX3XH7uHIwMC6uto9pyzJ1VA2yuyyqq42uc6BfaIuQPXoUUMccebDVkaY4G9imEja4oL2HMRZMIPSsM8GOqUB%2FJbsoeWW2qmKWVQja4V3VmVp2j92XLCFVKRzN8hWMrlPyBkYCRzmfYm2YujGbVjzBWB%2BNE%2Bjst2b%2FNz%2FDn7bonDTK0sQdxyyu51HycxPdE6XseUZGHsirCPmrbfhqVBmHfYnDxt8RczGCydPVsxhoIkM%2FaKyZaEhxWjVH4Uo6O4qX79xCpaGfFVJqvMePOlrFrum0fJnJp87oYZ7fQLyXXigO%2FbY&X-Amz-Signature=2989d7b5129dee609b7b45af205f7e81f42de736cb564e65eca99a7b927448b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLUUR47E%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033306Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDjLxD3ELA3p0nE%2BFRBvTMHuJNWafRXvzcnkf2H1eI5swIhAOIf%2Bt8AvR28NToCydWLldik6hXRYnlhUiFCrxAAED5SKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxGhauw7E2GUshBrXsq3AOanXdevxuZuo8CpHtCaio1F2gaX8087N8K5aThtLDXdOirOkfUjxkBzsCsOPu%2Fc%2FhBt%2ByYFAgwkk%2BMSV1Sf2vx8lYEz9JIL0Ff3K6fXR4Bdn%2BZvdoQCo6J5%2Bx%2F21aoP%2F4MJ2qIB5axFosbWXGwybC7Mnimv45ilMS0mDLNXMdFvV6uJ%2BCuHSCS2QpJ6S2FCdZ98V0T8q%2FCzl4GjWNDTZ6UohBXvaemr8oHvXVWiduhpJI%2BeKB5GbU7UHvVxjRl6X8bqEny%2BpzZnm5DiwvsX5x4ATFktO9JSar1JoMpkU6o9KsbZigLvzgewrod9sOhsrYxXOMa955OYxb8rtl0oYEfrZtB9qxW4r%2BInOxQU%2BB4QksxL3a2bxhx%2Brx9YgOlWmZqBJQHvhphAEXubpDHeaEZDS1dT%2FG1H6xApnSHUHmLnBwSwpU14U3lNCH41GTypF9EgfEruENN3deyTdPSxU6vDKcleKCYLwlSdF3MSoTAIR9f4fI6tWj%2FN%2FoKxtXiFaHVF0so0l3k8g27KIGpvhZ4%2Basx5cwPAU8IfXLv5jJujXvQ2BFU9pc5hYkVOoOKAgQyBnj4fZK3pBPf9eMiURyxONtmnu5XaOIHkWOOVxOxdijRoKKlRUIACl64uzDW0rDPBjqkAXr5Wd%2FtzDkrJ1sd8IZGPBAOHnoHWLXRJbAIFhixPb0HpwJY%2BmVQ5KIh2iUeJSXIqIn2MZeM2HFt6XD0ZEAgLW5lAJ916KYDhSWtXoluE3XbZ5wHOeeLDS5UHid9TvRJi22zEKxeadFYAR%2BdgGfXbZYh%2BdtNQxnK1%2BS2ss5DmvszlCcvxxcUyaUQ1y8T8oIOYGwQ4BmOiBBD6ogaxskdq2ctj5b2&X-Amz-Signature=33ff4449d02de0b38aacf7dccfb4627a9575294200d2868b3ed9d18ad1381d5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664WKF5FGM%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033308Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC3n03SrCtcy%2BI6xv5mCZZfw7RasEHKT17dkubJwrYtQQIgcDs6pIMeMIPiHO88iWqEaBLEVFIvfV58x01xjXCZLWUqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycxIbJA6grmmN5QSrcA09x7zCIZZxSdFSnQaHN5m7ydOFxsSYi%2FUtPB4WOutruaWcz2%2ByWGZtQLhQlMLeA9eQVpyLcrCUK3qSgVLY5BbSJaWWyeAOsr36fe8LRL39%2B5OTgtbUURVnUKz%2B2qKpgIqfbcxB5UagwO%2FgypOqrGKAnF6JRHGEurHi0vHuFttB9ul%2BRxfkZkZjSEMUlB7FoGNnhKKoEvLPfsYY0qLCJ4Ou5FOIhJLW5Z3%2FxHkaY2eu2N38yGy9Pbw26ckHLliCTSlbI%2BEwYfsNcAFe3mC1A0VFtcVTU9gkLYxFWRkMld8t1A%2FK5V7tdFfJyB0kqURGd5zUr%2BWnsK64LcmErWDvNv3%2BRo5bfPY3XE%2BXVFuR0o2c4M73BhcZIEpXoWyOXgkApAyBgU4A74sj%2Bypy7bZVytFodTF9qfdO3q8WiJGg4h1tLBxSG0QbS0KNa0rRdgpYqblMz%2FA%2B5h3lhknR4E8yLpz%2Bqj89wI0slGLqzn3MyRQ14Q3Ij0vkj3FLGJrYnE%2FQGJcK7exmFj2eue1ntKXC6bXzdtq3F4zw%2FqtNDtkht9k2bQUAuePUxyWNsHcq20ABC2hjTzz3QvmiAjUotuLrvxUuRLqn8NM9Q2CxRZNzUZ8P2qQtXDHlSBPTqryezMMHUsM8GOqUBae04IcswjuM9X7Sn6%2FX7GaXgrh6U5OznbG3k1fQpD5qzX4h%2BfyiozOcF7Vrop2DppCfsbhZ6iptE5vfb8i2GAIJpgkLVNopMLiPWFx4650H8OCGQPEWcMgeMsvuYFuvdJQYnWp8clnWiEJyFlJFly1eA0wuea4ZqViKs6yeWG5Eka25NT1n8ju3cBYNEj%2BfMJ3ny%2FLOan9NuFpRRVSXgevWjdn3U&X-Amz-Signature=36e507694c0e40219fef80b5cb6cb441731356f52dbf1b7ef998a67e323fdf59&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TI3E45XH%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033308Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCwNFqNHr79jA3fcu2AUzc9ggCijckgWR7npsg8rcW4IwIhAPe1YD%2Ba9Gd%2BowrnPXu7dCRAR6tGwUWE7VMdgSiJbwWDKogECIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEAOOy4043oAvm5o4q3AM5mhUXuso8qV9tGF3HXz8QTr%2FdkdvayPOUE6C6CWHaC7J7PXYWKtGZHHcCz8LRQ%2FdpAtD3RUvrGJ692mSe32V9k2%2BrojHfM%2BGo%2B2UudLjG6o%2BY6mnK0DW7ZSryiyhxcZxBJn36kH8HVUNOXT28JRYHYSe9TJG6Tf%2FThnvqFuvZGRqSW04uWsUu7U1iY2SdC49C7arwXecXzNZ4Uh3rSTASfWWIWp7z9yjiDH8sAtBvhFI1M6CDX25B%2F3UIrLVrUZc1UOW71kgqWI1HPEbfuYHCzXPBx%2FX%2FBvLC0rvawPHUwBoQQyi5YN22%2BWnWfp53WyVUkiVkI%2FGdLXdeyWlpiCxHrSTxTk5mfhOAQsWbwhIhLYVBcJSj7umBxHxSuABEvZQeKAwNKv%2F0lJQxHE9%2FMBaV2O7LDjMdJSvCj8irW9bEPu6009NrGt5IgnhjyIfRSjqKcrOin16Co%2Fsil%2Bakj1fL74johbLDRjzNPr0qLZNM8d4g%2FyHGOFq62UbrMTHoT%2BDYppFvbE7g2mDYu8KM7zyhDNFQ5MsU4rP3DX%2FmKFFRZh59%2BWkDW1onepJm7FaZDCNEt8V1586P%2Frc0N9Os0hEVsvW1RD5VlKUaCkPeWAw3UurxzZJTJWgc7Ip9azCg0rDPBjqkAclmDajTi3ppk9%2BgsTmjW5x2Ioy9jziEJ7LQa54hgKkskHs8%2FtxawBiScs0RgXHzIvCA7LXHKcpvnlbj624a81TvqsuJ%2Bb0TrT98qKRAUjYzeLhH9bcAYg7ed3JkNoA5jYBIqxmDVs425FQL1hiNaDD%2FW8eS2jThIWrNslarOrFP%2FvRQa7msLazb38qDkWlWuA8wCvYaMZCELgsZCzpSmzxa7UKw&X-Amz-Signature=f732c8a74e56bceebba3717ccd3d419cf97e961ad20c2dce3dcee61e3bf06347&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V77PWFOC%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033308Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCILZ1a75xznAF%2BWfzFNY0nd1aKDMHQTb0J%2FeKLaZQoPAIgRz24viwDJWmI5O%2F7RXkDNIO5%2FsrtrLdHOseeUkvWDkUqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOUm4ximsiIMw2G6hircA9fNaVjaZ%2FaXLIB2uChZMRliU9sDlEasaMDVXYdv00TTpRg1I72DLsf8X1daY2%2BSht%2FA2izwOqw28e6iuYa6ZbRSwhA1d5tf4GDlkxDfPItcBJXGGibKtogmhbxlKyCKiC6noWN1I7lc9tbKkjNCsQ9xo1PT3PlMozSNkC0CKYAyNLCXwEKmwN%2FBsD1O3U%2Fthgg98quvYxxj9sXEUukLbKWWmdBHJ3MCd3LBfxQ9BZsPrjPq9ZEgdCQYMtt9boxhEqRuVfo9v0bBW1mLOZPWayVF5G0eEQpw0%2BF%2FDT1tyWB89qhWBQeWCcA8oQKyWgZruEl4MEiP89OCDNheyc8YndDsh7u0YTVVOI4nGFwZuksP%2F%2Be89K3FEnG2ynfwtNQUPTaI5SRIAIH4JbICUbDYrf1aNiTnJrjhdfkzK4e%2F7Zv7hCOFdb3sgQI%2Fst3ejeOEW4AbPFLqcb0jqm00yJRnqWY%2FdWobiTILqzIh6UHE2JJyt63pceBwOZlKiIaycIASOwf6HxlEaUFX5xU89rKdPBdbzSECOod6gUI%2FmkcdKu7em1kB939BN2grDrQxx5314TDO9%2FDwtic%2FrW9NX1kxaPtQcbKQaFeZrvvwa8G9XYR7Kws9d6R4HUR6QkzTML7SsM8GOqUBAi2u3cCp8gZ5HYt%2FRpukIYnHqDoP9d%2BZEpkEbY4s4A11MPZqRm4B%2FPTd62njEUzEyGbnU02iQlr2rGCU43GzTYUH%2Fu3lK2RjtTM9%2Bj86uEhLdaSGnV16U6PfIPe5kQ5cohbCjDD%2BC%2FeH1Qv9%2Bz3g2ZhUcX87SEstsrJslk2UXtagNjyYkDBUV1QracbfSFM%2FOAjCfGbPEvlWnjz3i8ux%2F9%2FCfJfy&X-Amz-Signature=f47ec79d8a8b6c6d0a2852bf015ef4dbf6a9c0da905cf84123fe24daf4066e2d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667LKISYO3%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033309Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC4qBF%2Bn839uCe6SHZsoZsB%2FVxX36UyLlSMqVtAdtP2JAiEA90co5u39turtud3bVwGtG1Xr6SKg%2F24EeZMzkw9WXCsqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLQvkSEi43SkSZ1dMCrcA9rCokgmMe1aQgKwAek0QSgcfPZr%2FqUVjksBep7Z%2FPS4C9a581A68MKBsXhXf%2FB3y4ZxSWuWAc4jLLrrYxCbyroDmkrjpPHeD4ELsv5Ox33bTS9YjdSylTmm%2Blnc2JerpVZuVV16hfZbfhaBW4KXlL%2F8xYOWwx%2FfQt%2F0xXD%2BTrTZkV7AMOw7cw8zcCfenV13%2F4QK3jQuyFM4uAuxNK4sZ3l4u2DZ7QiRJN6YeI4eLiT0gRS5Y2v7Za42HDsEMWtSWgh%2BTs2z2DpTREOkpQqH3P%2BQDv2dJKZIo0Rm2x1b86Fr8SKpWxg4hCTJFByVbnVwkurWaMTqsRRF4oZjij%2BAp62Zx3CNdlXjCli1lu0t72GxKp7OVvmLtoY2OLYVkifmg4LvkDKEh5aNzjsuHM47vAp7nJj5RESyv4RGVlM0BjGtlRndLN0OO%2FuKw1zt%2F2ZTOEtskhffYBytGDL2xknEyVvzI6PHTUgkuCv9xd7C42NA2mMODe%2Fp1gEL9HUS0flSqG9E4Ue6UVXG2GUJpbEAk3LezgKGqV9KQ1BCUAN8n8%2F9CohplFbwyXBIzbIO6o%2F4DpAvIsoRo0fxSDxM5ZlP5Af1k6iDyyVWMKjctCVpvMs9Q8t3Xq6qSi%2BzCchkMOHSsM8GOqUBoGrPWdHz8fCtrmnZYMLNQTDgJrH31C6UCtTKRnTMeOAT2d0etfk55%2Bq%2FhxyusyBTvoYsfKw0DIq3jEbiKtWJu2%2BTGOKKrYBOO0sG7OQsSnp0XTiT%2F7mL%2FqsowxSkLSw%2BRXJdrSGVOMtOrZW2AepDmgZBGtTLQxQChuM7jR%2BsPFd%2F4u2gCChuRZ%2F%2Bq3955pjznptzmfAPO8x1F%2B26TZqBqVIDnou6&X-Amz-Signature=fa0e81ad1ae74ef7545619837429ead86bca60d3ec3ffc14aee53db335f98ace&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGSATYSV%2F20260425%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260425T033254Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbdxt4zWU9FipAsl71yUUTe%2Bt%2BRVNbmWewsXXXMRV9jQIgAOKeL%2B3I283Sdrqcs0xyYy7vt2UUn%2FEiTycm3DnRuQMqiAQIjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCfZDcivX7s0pDmuMSrcA8d%2B0NgsbU%2BjyV%2F%2Fqr9waV2%2BtdJrHDV9ahoHbwTpcUixnQAhyphGtJArlLD3w%2FF8EVig2uuWHWf%2F2EbnocfZXFvlEGtn2TwQVCsfuE15SvAFcDPqhjpZPZw4nopqUWxfgrok60ib6OsJzr2yivJoPix9J27hXUykvqgZ7wAFqFGc9Cm9VKBnfrhnHiky9cR6lWHef25T7pH9cnDlAUknreWHPTkEKQ%2BRbFuCyiDFhEAn6JtWmhKy6XkrZKlWakn8Y294eD7zDxo9cCTkRK2xKaZd7%2F2%2Fb1ArXdR8jLFD4nLG%2BVrHAgtiBWCX4mnXrle0Ko0wUYzEu42qRnmSpykNmEX%2BzUix2L8Fz2%2Fx2s1%2BMMd7Rf%2F0bwpwbzX%2F4yloWjRnxBlPUE6x368%2FXjWrSguDpel%2FsrytRXU09D6cISbe%2FckipYhqJ%2BkGCTxYtxhWFl4lQruxg3yjPAreRzBjIqwQ8Cxz68boilbUJhUoGvPVTG8tYywFwr38e61BK9%2FuBA7dYp616uVaasiv1f%2FucsnDMgaxGFj8kUMIPGtmLRXnmH4sogiCh9PPX3XH7uHIwMC6uto9pyzJ1VA2yuyyqq42uc6BfaIuQPXoUUMccebDVkaY4G9imEja4oL2HMRZMIPSsM8GOqUB%2FJbsoeWW2qmKWVQja4V3VmVp2j92XLCFVKRzN8hWMrlPyBkYCRzmfYm2YujGbVjzBWB%2BNE%2Bjst2b%2FNz%2FDn7bonDTK0sQdxyyu51HycxPdE6XseUZGHsirCPmrbfhqVBmHfYnDxt8RczGCydPVsxhoIkM%2FaKyZaEhxWjVH4Uo6O4qX79xCpaGfFVJqvMePOlrFrum0fJnJp87oYZ7fQLyXXigO%2FbY&X-Amz-Signature=ec8cbade33e06095edd5219473b98458aff26122a7132c3b1e44d73199e2cced&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
