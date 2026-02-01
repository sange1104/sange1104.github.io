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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666OFBLWJE%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032849Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDAENW4jmZy%2Fosg8kWHNEy7ckNhjcW6M3vcfeSqRD2kvwIgeFIQUIp28NBV6hfeQ%2FXckeOHTtMiWcy%2BNwUcbS0hZVUqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLukgAOWAaHRers%2BJCrcAyiC83tlnf2Y4Y8g7KiNYfQ%2FGjBizTvGD%2B2Kf%2FymyrG28NiX4yo769Ws73PWBpMNmh6TwY65FzGMSdUmkx%2BziGU5lH49vAKqi2i1eMmplDvM%2BFIzxmyrGEPWs3zrsp9IEEaIFP%2BrS0hIGThzOjpwcSQB6jVHA9K%2Btkgb7KBICkwQZZ6u5%2BcJL9FbmmCsy6U6E%2FgLG%2BsOM0UC6UIEvyUs6dC%2FhjFPBQwgluTKWXlZJiSchFPAdOWqcen3x5UYyo0681LuWI9I4MEkBmhanpMHHHcqPV8eEZhl7ssY%2F5XQfsZZyHc9zjUhtkOztS1zKDSeYmOVREBOQt5Ebof37SR7nY6qG6Oi5ysp14zNQ4mfdat8RKMLNpEerky7qV0Pme3xhSQ%2BcqXRLplUTtnfM6khvLUj0q%2FJZghO2cd5c4GVFQGKsHwQI4bdEpbfjf1CiL%2B6yX9yd4NkTQQHFaxlDDWdwchZNEJDVPxxXHlUO90JDjVgmiZew6TDvskImf25rLEXd0eIWpRJWloC%2B4WwmGlDad46SZoigmlo2lM5IOcJu6HvjODRdLKRByVKFEVw%2FVj6ie5kNFSW60ina0Rpt9omhqPym9MZ99pRZdIRbY8xvz2k9TcGs6m8ta9R4MiXMObx%2BcsGOqUBjuJW5yWyq4VqXdFjwrnmIBi7FZ1%2FC6eN1c5EqY1zkuWGrLDFf7GuXfvDjTehwHRhgp5wDryfLEjGyFIA9bgbmUPkMpLCkwcrTUW0CHXeAfctI9Mn9GJ4TkLYrjXglgD%2F8sR2CE6EEgOM3mPI%2Brp9kva3uVi2sjphNJ0AqvevCo0wuQVrV7a7Az%2FBKJpvcHVFI6lg0ftUshx63LShGcy86NFfDM%2Bv&X-Amz-Signature=9172fb90b267e6aa1ac476b38974e4a6a4c37ef5295b3b76728d46459076a020&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U623CHTD%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032850Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDjDhbvT0QlXeNTx744UQnTZY5nMKFCMYjzGBmKg%2FHESAIhAPSyYoo6Fw9nwCGlPNx3oYzTOBg0C7m%2FFefEaNpOf%2B2aKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxyXuiVHTSTPQwqVnQq3AOX%2F6x1NX8FuY6voznXXRR5Idts5Tfmby9iK2X35qDopM%2BHMihoddXEYFqdAFfoZsTthg5haNION%2F5zUP6hRUQc%2B48Db6DjbaWDVW24JK1Ub2MU88bEK3q3vL7KPJd0DfgElZsE4P%2BRGZC6k%2FL64FuD1Wy3feHweh4FXq%2B4A3yev%2F2z8VMWA2mPwQqrV89MFLB7FHFy3b2atPFMqpT%2FwQIPi6armVfLq1egiEiyKD8ENMWH29KmFksKbw4AtjGMCMn3La4znQfV17zQcONpcnzYm5yG2rws9RbWRV1jFzLvAqm1FODLEPvlSXvsXoRvhWvcMRdVLsqx6lTIha59PuFroYgt4KzBqtlRlZHUBUXFT1OYLvrOhyLbH%2B6Nq2kHRJnVzopu0O5Hg3Nu72Dw0H6FQNivMyDQb%2BU2Bu3G4Ipa9Mk8THWpC7yTAixHejo%2BwAPJ5644u1Qht8aJG97HettPNxLxILoIcbDHKq8RDIC%2B9nAp3YVGHKx2A6pmCuKmNMzp2tUk3VyOUJ8U%2FTC7gyD7F3fC8nX8AMeXIbGuWAust70886l0P5uThzH5d0jJO52b25Atu6U1Q7KNEhePG2cMH30eBO11RsgLEg0j3fEDgAzt7Nr17VKgNGQvpTDP8fnLBjqkAWoJWfk9cTM99paaCi0dq2RuOpfJmKH2RCrCfJgB8y52JsYw8%2FLS%2BfWtPYoSgJx4JND2J0w2cmJOt5qUCPM1DarPM06W3i%2FOMS76tWuYNuQwzgS8XVnyu2HYBwZ4gdV%2BZTP%2FzJPXw3sRceKUEQccEguamuLYj3uiQyviDBDeTdY3zNNrwWWfNeH0q9sbHLhmsc32zyySsJPklyESk6krnIP0%2FW%2Fg&X-Amz-Signature=ae19b0cb6bd2d4904d827a844fff36d30def0af51d468589492c8cf6903c0d56&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YAUFNALZ%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCZ1WrZi82hhKs4jP0NI2%2B64Is6CnZGaVWt0p%2BlSf%2F8rQIhAPZdZByl5NhwoDDLtDRdnvdYyiPeC4cCImwfrkE8ViY4KogECMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxJmSxYERuC34W4bocq3ANC2SwLZlNAPPSbHKZC1HuKe1aA45UkJdnrNbaQvnRO01qMCOSx%2FVwPJH5mUNA9JqW2MrBB%2FeegFZ82qxuIToqDbSwyikHzQp64KXYCBXn8U1OPUrPAIt8XBWXrcTv9gDPVmOTny7%2B9pfW%2F9yX21Clm0aAIT%2BWYWEOMDF49W3UYn0D0bLXjGZDPQJeZkeL87FcsjrGHQmNgNPp8os4rHCkIMMDu5mVyhNVjUI2%2B3C7%2BqdQqDY7hKMBC2pcZfypdfCksm9J2cDmUzAYqsIBNqpc7LDjWpTaIJgE1PFiyT9ojxWpiZXG6M7w9S2r4BpBVB4y%2FNw2PoRGH4hzPytClTqRfZLwYKcXto%2FVcaaCcJuC2JBRqWkpTl%2BVt%2FJVKtvAueL8mcmWxu%2BeZll59di1et74qNuNQxvajoxMF%2BT4AdXj2luE1KlnPinY85vy8ytmr6HkWw6Whgy3smk5cLHhHLTFXj71LhLMe6ELca9fC86q6z%2BrLzRVfAFDzvgUkF1spDfRluJu%2BQFQvFd5vUaH3NpXHB1lddcf3POAA7Vuhy%2FN5PNtokTbUi7F5LVvd4TxH8WLQvi3on9TfbqpTd5OdU%2BpvbzkcpRqnLFfIUYBgvmGJCeXQfcIsm%2FQcJLNS%2FTDGsfrLBjqkAU%2B5NZwqH%2Bz2v%2BeqjhidpYRE7iJNx20dZO1c3vSbDdRvhpiYsSly3%2F%2FyZ34G1v3KLDbypf1F5qhrX2kUJERIxX2A4C6q96CSgkm95ARpjOGqXg3fxRdZn7Dx6w69t0CmHukjrJl7S%2B7GZkGkyQVTBggfKj4rQxUjiCyhp8fEH9dOW4DD991kw0Mz%2BCKDV2mDY9pcUn2V9DpZQoEBLbma4YWy%2F0I%2F&X-Amz-Signature=3480dccf0834a29b50f636737042c50551564ee4f8a9560e5a486ade6e181092&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YAUFNALZ%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCZ1WrZi82hhKs4jP0NI2%2B64Is6CnZGaVWt0p%2BlSf%2F8rQIhAPZdZByl5NhwoDDLtDRdnvdYyiPeC4cCImwfrkE8ViY4KogECMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxJmSxYERuC34W4bocq3ANC2SwLZlNAPPSbHKZC1HuKe1aA45UkJdnrNbaQvnRO01qMCOSx%2FVwPJH5mUNA9JqW2MrBB%2FeegFZ82qxuIToqDbSwyikHzQp64KXYCBXn8U1OPUrPAIt8XBWXrcTv9gDPVmOTny7%2B9pfW%2F9yX21Clm0aAIT%2BWYWEOMDF49W3UYn0D0bLXjGZDPQJeZkeL87FcsjrGHQmNgNPp8os4rHCkIMMDu5mVyhNVjUI2%2B3C7%2BqdQqDY7hKMBC2pcZfypdfCksm9J2cDmUzAYqsIBNqpc7LDjWpTaIJgE1PFiyT9ojxWpiZXG6M7w9S2r4BpBVB4y%2FNw2PoRGH4hzPytClTqRfZLwYKcXto%2FVcaaCcJuC2JBRqWkpTl%2BVt%2FJVKtvAueL8mcmWxu%2BeZll59di1et74qNuNQxvajoxMF%2BT4AdXj2luE1KlnPinY85vy8ytmr6HkWw6Whgy3smk5cLHhHLTFXj71LhLMe6ELca9fC86q6z%2BrLzRVfAFDzvgUkF1spDfRluJu%2BQFQvFd5vUaH3NpXHB1lddcf3POAA7Vuhy%2FN5PNtokTbUi7F5LVvd4TxH8WLQvi3on9TfbqpTd5OdU%2BpvbzkcpRqnLFfIUYBgvmGJCeXQfcIsm%2FQcJLNS%2FTDGsfrLBjqkAU%2B5NZwqH%2Bz2v%2BeqjhidpYRE7iJNx20dZO1c3vSbDdRvhpiYsSly3%2F%2FyZ34G1v3KLDbypf1F5qhrX2kUJERIxX2A4C6q96CSgkm95ARpjOGqXg3fxRdZn7Dx6w69t0CmHukjrJl7S%2B7GZkGkyQVTBggfKj4rQxUjiCyhp8fEH9dOW4DD991kw0Mz%2BCKDV2mDY9pcUn2V9DpZQoEBLbma4YWy%2F0I%2F&X-Amz-Signature=c38a3a24efff71326ccbb9f85f062de70b5abf90c0ac846202c20e0f560105fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WGIONSKW%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIApzJV6vX6AMMicdS5YcKyt4bBK%2BDhNsG9OJA8mX4q9rAiA5u0fc77hnr2CCnXwbcbYg01B%2Bza3SvwE50xtyEtJVLSqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMT3KzcBnERQAr3ZMSKtwDZK0HyleKm0c3HzIdS0%2FnNjpfOFDDUFPDjejAng39vloWSdX4FGmkPHK%2BpFns7VpzcS4WQF9M5P7F1yyRqB7F0YmRslGqq9c4GCxEDwejLDFbQaLx838EMAwWP3QGnbFAfSYq4CP3v8jlXbRXCgvDy3yEjpmzfSJhKAhe4vVc8Suhl5dhDIvRZk80%2Fdo0cI25zvMiJv6pDqnsTq0%2FwK60Q7M3fmDRLEGYGAvRWYsAOhRiwqjEy2Y8o9oVe%2B1bOwbk8u6HCkJvWmHWp%2BiEP6reCKg5OWNlxokhoTpxFejQgRBtvXcyY4fgVFY9Pn0s2Olgjk2rJRB1FmVNF9%2Ba16Cxl4QswBubpwSlcl1op15hyqIbDcYtWxtAkWQNWY2dEUbffYdZcoZetXrvGMRsDKqgRgzqb7uUtOguESTqzsQ5JLHVRDfAUMdOwyefxCTUjX3t3Xo4ofwOrdB2sfS9TnsQnZFIa4LBhj9q9PWTQEksjpuwe%2B8agc%2F4PMLZXR50iS15hiP%2BG6%2FaUf3Vxw9MqjXE%2FHO%2B9pchN8LCs7LGa5n2QJOyyApJ%2FYokDivenADxqo9UdHH%2BFccQzPwrK8iAImZVN2zl9SWZk1DUomBgtLOC2swtZz030GYAjlF99yYw0vH5ywY6pgG9KJai8NLF99Ypldt4rNr6VYvhOu3nosM5MRER2YLRiIjEX8CTF1CmZt9jzPGq0VNqQiHT2qaVJA0yz6YT1TVXqcBbhCk%2Fni%2FlOjcTmVsi5c8nx8jNZOAqhcXclhkU%2FZEjGBMLXytn4G5K8NIulM0Bnh6cj4F%2BxRHQoluy%2F1UvQ2qYuy1MglDQHSFQgL8N91DGvTVog6XBBOYaUePWfWhnNiTikVbk&X-Amz-Signature=4209f15c8740396f21faae5f8029743a1452a6993d579d9be047de1881467323&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ZLIRGTQ%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEh3LKC%2Fu7knlqD7I5gy2BHZmp3aFTa1Pb7TGQbk7%2FmnAiEA%2FdgtApO6Qwxm0sR6mibSd%2FAZtcizxM%2FjIMmCqUC53bAqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGuuyFVNTQRFV921ACrcA%2F77L%2BWfqa%2Bl5cqO7A4YJDIx3A5Jd0hTJ0d4wz5SZ8a%2FKXGB5XNgjPCbV5r2EAF8pU%2BeC4itMOW%2FtbYt%2BCzRqiogXHPAJxf7SGWRslZrU1HToue1SHpX76tTODky8VI3Q9hVAvQZv0U78YrTCrp2T4XIYQbnLysgRZA0eYivK98mG%2FLViUFY6NciA5fv7xSOb4%2FHvJcTJKPqw9eXMs2RXueotY4DKvuOD8%2BRr74bjUsit7wXCyFwGkbF3XQJ%2BHQd9biZvcRIWlWFVatszBro%2FFbp%2BXZqkbgDvXq14%2BcPhvxgZwlNMzHITTwNyxJsz8%2F5wSfgkLLj8ukopFD61P3Za%2BgoGfUO%2FO1rHOFRM1IrZhqDX7H37AncltLE%2FwI5Y%2FnGM72t6pXWOhce9pJenPYwpf3uO5YjnGljiO8khT%2F%2BD4REoaXiYiof4u1US7yS2VLk4cRKqOlNJTtFjRRQmVYxKUVqlIuYMN68x%2FQEKI%2B59RIPiS%2BUvFl4IGcf3XfuAiMc9BYQsycmTINgye8iTvafm8%2F4FXEgTS9XUQjCDT7nsa%2BOSn5A%2FECHPF22BGF7x9pzalEWMng%2Fh3rf%2BWa%2FJsoUXcKn%2Bg%2FG7oodrNM%2BUvlC7dGpe20mj%2B7v9vgsyISVMIjy%2BcsGOqUBuUvp0sBy5Jo2l8TZQ29%2B0d90k7Ke9K4IMvLm7XkXPY5eR3E41nNZcV4UO8GVB312dSy2lFKTRrlhUW9Wfu%2FDf2TZXWHXwFgroTb8fan87RJaVKSMTT0gsj378yE6iOc0gTXuMaq8XykrB%2FPmkNJJsH0i432I%2BM%2FYA9lvy6N3tLIb9yo2Mo45%2Bpbx%2Bv86FbwRSi8KcNWGUtJ6UQHx5OuVlgMgNYin&X-Amz-Signature=bdd5b12d80f2c98b4b9774219fd7c6634e4e04e43fd906a8a7e9f4af752586fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XC4V6VWD%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4G0Ko9XM%2FH7sj34bjy1GQ8eanFEQmlATMUvr4jHXAAQIgPI3Buxi4A9Y8wksS3jWAQ%2FO03mqAIZR4n5PnQRzqPDYqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBshXd0lOqlzLDirTSrcAxIN%2Fx9itlsoSDwykT2VEIbrDF1ik6g7aXlacjJsIrVp0eEibNlA1NNd0ccYAMmhb0fQagq1Peivld0YNXT5JcjbkESLGuuF03PQFBruMJcq5Z8O3WMbX071hXIaNjRJptiWevdRB01XaSu990NQXECDRbt4g%2FjKGn1wIeZQA6PeWVfgXuIpKtYgEU4kwvXb0H7fvJFzn%2BRRbjp1JEiIh9g103%2BRV12aU7Bne2ZTmEVDDX4balA46Gm4p9eRi7XjG%2Bj6UIUHyKOqPkNCADr83LHjAzW%2FFH8tnbPLbCIxc%2FcoVxy%2BgVRawG%2FPPJBQrcKoaxqYxp9JAjWQ6%2B%2BTlpU0hGIjh411MYxLqu6cWsawb6JhRU2XB9%2FJHwnkk9Y6J9Z4Z1ZtvK7m4kZ3PXXs5s7kDeNipx%2FKnz4DHxlcf2AUt2d%2F4U2h34k%2FclkSDo%2Bm9U1d3c6JeqdMC1ZqzVWC5f3f6IRrBNtQZ6iHBEt%2BXuqQPCwfvFuDWjIKkJV1Yqy%2BcR2TSjCA%2Fu4N1QVK5bw22ohuuGylfUpUL0D35zhV37VdJGd050IXcxAUo4X3R6Qqoc5QkU4EDYpeY3OJblv5WQhl5YZRh0Z21gD%2F9Kdh%2BsayhTgXyeoFyr246YXvamnqMMXy%2BcsGOqUBIm%2FgsbZbWUMAs5eLFdEPhHhvhhnPpiGNUy2g7dHC4cNBSwURlX9%2BpAPoUWbhYqUEsPE0r9MGWe2WKJc3c75pt7VlanTgm1fWZhkR13W5Q6G5EzQfQJbfgwuJXw8cbyr%2BGgvS9OCiaW0l%2FLO40ELBUjVLQAT25LhPikMIZTKDxha53Mi1G7kQQhQ%2B%2BLg5w1lE6gijK3SBQIXhbXq%2F2RcVQfRx5Cq%2F&X-Amz-Signature=944d302149b5831e8d5e0e0eb3a150668cd236c0afe02b909ca99acec3c83240&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665K3JCTPY%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC8eyOmKIzjTWqhs8NoXHPQJ6npcEBlC0jsCKupEezx3AIhAMu%2BIwplKpcLKKfPBTGtMgja70nQWNnUNKCPpwTiwr4kKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxpnB0%2BDCaA3bRlEuoq3ANhurgljwOkAtzf0ERW9%2FGX3wiVCPN1aLUQ8CXi7U8zfJGrb%2BZInRuenys2L%2BXizcIqFAPonBHa6MHOYmWzYkPdRLwBPKNgqwEeX4yxko2PHIgXyjM3dUI09OteAdUgP7G5VsiR9K2JaVOYHgxFMFFKDNWxfSXfF1Sclmz7PMv5Zl6kKc1fNI3MSxcYDBZg%2Bxv5IQ3x8VdxrEIb8ittCQ5N5kc%2BgML5iNZFkN2HDuUTDuCRp%2B0nA%2BI0axz5Q4StPNv%2BSVctQUFGtsevL085wenAlQc4QEUxpHQWMsRZpTCygckyfxIpjVuNQYy42x9Dx8HQu0yHQ%2BZbz1Xadwnts%2FTLhcSNdV5yOfAqk3V2OeTH7dtM4QvFy5bxG03ie4FkfenWXO%2BSB030gk8n8VXN5RPcBZGSfn4ZI9xvKykU7eyUBwyL9TCQYJi5qBAs2VTsFGSx6GLUwGT3tW4AQpXUUrKjYM0mtwU0T15WXAYq3enQE2CWaPCnvH2AabCe5odPQZSJEPArHcWHkVsJPNvPeXenA%2B4AdxPUltK%2Bt3Vr%2FdvMLBjyhZW7Om9OXWVEVdk4XBREjb0QTHvad9VZdpoH%2FZS06zHemRMDKFPPPAQSZAl4zvrAJAnaaTYn6JjcPTDD8vnLBjqkAeXlpHpsRPTu0N9NobGNS%2BOAPEshzqNqu99%2FilTWWFgv83Jfce6P96vgLBFRypoFx%2BTvy60LEjaf12qU4Bvrnib9EzgEbPiNBYQAPCDrCoE7StBzo0CF1ArKYGhqze%2BhGylbZBeEROWIOmFbqr%2B5hV9hsIc2XypRN15LXmrQxCvuID42pGcHGeh3KbRuqBgy4bpbt8jQ5k0MLqTAWvNi%2BhvXvok3&X-Amz-Signature=a42a0e579fccf4fe022caa958758bbb36b1fcea309773dc651c881f2c66c7890&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662EQJHHTF%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGZLqwHUBLdrEp2MVuJrMBlCefy4qTWrAoQ0NnH4RfbHAiB9sezkR4U3TvDnRvTlmcIWwd4h84hhSqahKIrSYZCKHyqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYCY8zA%2B%2Fh0sTJ8saKtwDLo0cZyD0ENPuRFQHhiV1gh4WywPEup%2BNomhk2enkfMlKsH7F85ySEINcVv6N8f%2FuXDwj2wJwX18y3TWoS507TCwxxF0sAky32I2cLHdbaRHM%2BfWhpISPquTCs7iFbSFykK7ssdagqTAYFCUViRKRTps7zlKH0MurwPoZKeqgllMxBccl0hCR3O84ZqaBlMFx8JXIo%2FpxeehbvVoTyGVsNrjq03PEF2Q%2BLU0NotoT5OSQbjvVgx2eqfgiRGSgqN4TtpUKmOJXW7BArZA%2FnSjvhxGo8pvxW2QIj5RHZHnynvCJwG7aUQKsAMj%2BalO8P3YIWUgb4RfVUHkTsS80JaskutMX0ZDMD9xH6czOeSj5PQpZPE9x5igapyHGZbgDfYca5WEGe69Z7jZ1EzSCuCtY61oKmFPILC07QSU%2FTBzP38ryza79GOJXRW49Uel89VSmu91i%2FAM8GJBDxSXyHW4rG%2BqgN%2B580Qkh8N8fQ8He9%2BSHd1a1LJlDx7wtn4%2FaoGs5fcxj%2F9IH0pABiDCDAodkQxJ%2BRFPWa3VdYPgucR%2F8I0bZbMYL8g9k%2BTmMbfpXkImV9o0vpLgkmLMWh9eYwmsrpd%2BqDV3rL6AuUstot8Uwi%2FpNaVRKC5W%2BefWxGaMwv%2FH5ywY6pgHziDnanSFna6%2Bi98%2Bn90MxNKbx08GR3InFk4QAeVLh99GC0x5YNSO646MgDOrZNnvSrjQpucKSfjUzUfarzX6PfHMoRGzLozbFEGXfehko84D7JTwMRhD5OTDwOFKEwC4O5OGCAi4KWAGnAH%2BX3Tydfjt1DfRTrZZurG0fX7uh%2B%2BUZlMW1j1B%2BBqLcKoDJECtNg9y8ooWvhfs1En7OPMapavJdnUh3&X-Amz-Signature=f1eb01b9d9319672ec7e612397a5af4340171cfcb066b538c2f1da8afd45cecc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YAUFNALZ%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T032841Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCZ1WrZi82hhKs4jP0NI2%2B64Is6CnZGaVWt0p%2BlSf%2F8rQIhAPZdZByl5NhwoDDLtDRdnvdYyiPeC4cCImwfrkE8ViY4KogECMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxJmSxYERuC34W4bocq3ANC2SwLZlNAPPSbHKZC1HuKe1aA45UkJdnrNbaQvnRO01qMCOSx%2FVwPJH5mUNA9JqW2MrBB%2FeegFZ82qxuIToqDbSwyikHzQp64KXYCBXn8U1OPUrPAIt8XBWXrcTv9gDPVmOTny7%2B9pfW%2F9yX21Clm0aAIT%2BWYWEOMDF49W3UYn0D0bLXjGZDPQJeZkeL87FcsjrGHQmNgNPp8os4rHCkIMMDu5mVyhNVjUI2%2B3C7%2BqdQqDY7hKMBC2pcZfypdfCksm9J2cDmUzAYqsIBNqpc7LDjWpTaIJgE1PFiyT9ojxWpiZXG6M7w9S2r4BpBVB4y%2FNw2PoRGH4hzPytClTqRfZLwYKcXto%2FVcaaCcJuC2JBRqWkpTl%2BVt%2FJVKtvAueL8mcmWxu%2BeZll59di1et74qNuNQxvajoxMF%2BT4AdXj2luE1KlnPinY85vy8ytmr6HkWw6Whgy3smk5cLHhHLTFXj71LhLMe6ELca9fC86q6z%2BrLzRVfAFDzvgUkF1spDfRluJu%2BQFQvFd5vUaH3NpXHB1lddcf3POAA7Vuhy%2FN5PNtokTbUi7F5LVvd4TxH8WLQvi3on9TfbqpTd5OdU%2BpvbzkcpRqnLFfIUYBgvmGJCeXQfcIsm%2FQcJLNS%2FTDGsfrLBjqkAU%2B5NZwqH%2Bz2v%2BeqjhidpYRE7iJNx20dZO1c3vSbDdRvhpiYsSly3%2F%2FyZ34G1v3KLDbypf1F5qhrX2kUJERIxX2A4C6q96CSgkm95ARpjOGqXg3fxRdZn7Dx6w69t0CmHukjrJl7S%2B7GZkGkyQVTBggfKj4rQxUjiCyhp8fEH9dOW4DD991kw0Mz%2BCKDV2mDY9pcUn2V9DpZQoEBLbma4YWy%2F0I%2F&X-Amz-Signature=fe5baea53f9967bea3d437d4e0d132a948d7b3e40dcfddeca451df8fcadc828f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
