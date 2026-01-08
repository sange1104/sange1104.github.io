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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YP6SBTT%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005544Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDxEQfPYKiy29GQb0gQwsZ7FQLnofIogZUH%2FYej%2B7AWkQIhANbPMr56uBr1GWi9OQH2ID%2BUovNQjgzElV9%2FdCTQOJ7FKogECIH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igym3orir7CkaMsCzjAq3APQ1WCPRdCdyEil7L9uec958aAm3J5WUgVYVzu1kYLvl2f%2B9SDEBAgpngID%2BcuxRPZ37YVrTGiIodrMgXt%2Fa%2FgmuSZpboICr3TofFhcJ3EudJW6vJxHZXNHXL9rp%2Bf0%2FfKbeAHRNz%2B5P%2BAJcrkFxE%2BgPJfGPSjymoY8zqrULoNXXf5lmXxbs1d3ZvDPqRAd6zN2HI7hRJ4b3%2B8LW5KADonsQRl%2BwNFJvstIztU%2FL6IicDWwMfKJwx%2BWn%2F7TyyLwuuoor3YuBWNe7g5uMsVHTR1RgIfmcI9yrHXAC28E8dEBnItCNPxNd6OHL8mLiazDWoscegpvBdWucFnvUUIl8V1AtKueL40OvlfPGcwX6bzaIJ39iQgVqZYRX7NLhRoFiXPoG8k%2BIaKoPfLP%2BBRU3i76rdhcDUQKEI22vf7D6z0CKstQu1mh0BjBbKi2Qt%2BLPIq1w56y2JePYTbgdKxsOYgs6BUl1FWLi4ftP%2BHMrEpcFdv%2F%2FDKpUHsg%2FY5XX4dtGhlH%2BJurCw%2FKn5DVEfB3wl01AdflXgj9n41GemRXDWCx7DxLDpGKdHmXGItCCQyTwyxn%2FlIV4cxfZR%2B3lvdJRaNUfu2FEmbeMk3y3Gf4HZ%2ByuUpc8%2FcZlMbIPADVfDDj8PvKBjqkAYiT2wzJ1fMKroeWefLJIexQi52yUMO6gmJkw6g8RvQcdExo4Eot2rwWhPWEEHbqVyv4O5ln0OfZUa4MJ7HdLAASFKEkRxua%2Bjc0LGl66x%2FHdSfdCstDumWtJrI7yol8p8nW6vo3aJDVOParQvpGmz8tGxt2YME1JyJpYk2wdWM1zlG2ZXXjALRhaTBCdYaf4vzRQSkYqo10Pd%2BxoOD6V%2F%2FvV6Ji&X-Amz-Signature=71b18823bdbb1d063c58e591bd10728fbe047a167011ecacd2350c5849190f5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665HLPD2LL%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID4kelT6sPBIr%2BLBQJZN9Xtm0rxjVKqrrZN9YxpBBP%2F4AiAk2slXU0uzC63EvSP8%2F2NRP5XJhvGrtNy4LDq9dxTgUiqIBAiB%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM11Fa8kM%2BjW6j1URdKtwDItxcpBMT%2FkS1n87HrBDXhGV64gstzmoMiLnaPzDEFXI0Rjye5ePum66O7x4SMvOoaxYH6Uty2PdaLzV%2BQzSn4F97tngmUGnsp3rkHWap4Jc%2BX0OnBmN%2BrEN0VIMH4cszcGYB9HhZgQNECoVAaWO61Yl0SBxcfZz0dH7wi9HOBJwgv9bUpFBOFbbISvFoEhbxojRueOPbCPoRPrkU3w2pfJHeYJUmK3V6OEvt7W7emWH9tnnX3%2BQlCdSjHSQDTa0jKNcmPFBFB0fmAMqd%2F7PGSJunaKZW35JeIuuMhOxdNicwkRZgyKNeOJQrLkNZPicR6xcRXBdTLsweA2Cugo%2FX0HSUpsjZuKpbSH0aCllmOwEwrYBNC7ILZdw1ZHnsbggx9YjIDHWbBMqkQ2KYRzbj%2FDlUJwZsA3r%2FveDuVRazv6fd96Dg23GZjJlEpw3R0B2P39bNURBvnz69i%2Bryn3tiZQEqM5x4INI8LqDHaB15OtHDt%2Fp73LRwoeld8AEWyAK7b4UDaXdPPGAyhgLvPq00gLY60TZNQIpA5BY3Kaxl7HG9U8yKxsN5xuFjlctFgNzqozZkK1U9hlAO7IPESCAemflOXbXuL98tEsJahDT2NJNVtfLrLcVgRxGpaeIw4vH7ygY6pgHrju1DUayLx1f2cL%2FbXnmrj3boBFPIdN%2FNqumuctkMmQA9mgwTy4eXphUa0goVdYydzOwEVCufBLFY4q4QORF7TM4zk6pIvfelxxdjiiZ99hbK4T%2FRpB2a%2FmRDdiRogtnYlyBVqNVSLD0xv9SwNNsAoK5Ltw6NZ9F%2FKaAv2sXEcl0Z%2F5QnvoLOIlKTxIM0qcpC%2FZ6Wk%2Bs1jqxbcCNaqrwbvu%2BWT054&X-Amz-Signature=e1a55d9e1369444be574f115337bf8364a0642a4dbc056aa137ed2a56a51df49&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YMG3DGE%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDTutXvIdwEBtfVg7cRVzN2i37i2BnhkHubeeS0jnM1IQIgDjMLkNum%2FsyMDU7AUcCZIMccefpgm0WDUsmcCTqIoU0qiAQIgf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM7i%2FLz6KQtST6aRMCrcA6nNtDZ3fJ8HLM4o8sTWa1BMvvW0WT5VZwbWFY%2FV4K%2Fq84sBoyMtVaGbuiXfEL4Z78wIn%2FjMSgYJ%2FxX%2BSj1Hox1OQJUO%2Fc%2FCoZvsfeBtPdIaXzyO4Xk3CINtH6%2BRoWMlIzt4QdQj1RQzIJ728D8GXwPDVzhZNBc7yz7w0ddxHTRe8o1ajl8ZxrYipkqTWT%2Bj%2BR6UKpqnN6K94NloHf8D8%2BVHrUVBh2FcJMzfx%2B7xsiQNi8LI6%2BqG5bOU4%2F6DtTb%2BD9GRQfGoNKqBfcUEcTosuyP5lnVGfNuVqF33hwIA0mynVQWmnwY73s6ZjHTpw8752%2FkqL2gFyGVh6u61kJoNInYloah7Xe%2B3NFDy5HMFhss9nQvnLAIfMnEWqmrwSvhbqH9Tfm7B%2BCe9Bsl3gknzszMYnC0zzRfVzTu%2BBHcnfQYg5qm7hLc8BTLntmzeX5agWmwrhnNw2HSg%2BDHStV%2BqR3WrDX4S8MjDeI8uaPCc0UcmnYbS1ty7joKsMFp%2BgVQOK0w792BuS5JZmB9%2BEbsLXzF%2BZyBQzKFzE48vVNuRf6zoR89JON4aECJFAP1HJKyIAPveE4YBZ0r8EBWKA9NkWdwBNNi4v4r8aYT2RsdUp%2BuWOoizr2RPQ%2FzGj%2B%2F9MIbx%2B8oGOqUBnCVU6lMfYlYXu20R4T78InLVfH8zi%2BoeykZrxEHHeaxoK6Tf5%2FNHHCkHNEDZK%2FDoQF6NABzfdgvHuzzjz4Jp8sVERleCDI6Nff%2F%2BU%2Fkv1OF8OddrXHdCmEe43wTgN7qxJtgc9RU9evRMx%2FzGLwIqhQ2Q5uu%2FaC354mf9v6BpSClc9XWGEVZDav0zWDoVyKWsk5tGr1DEok3wCvFGYSfJHvjr0cmK&X-Amz-Signature=97a6d86a559d0b7c07235e6109ef838e65cea35992ba4cbad543a32b4faaf7a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YMG3DGE%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDTutXvIdwEBtfVg7cRVzN2i37i2BnhkHubeeS0jnM1IQIgDjMLkNum%2FsyMDU7AUcCZIMccefpgm0WDUsmcCTqIoU0qiAQIgf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM7i%2FLz6KQtST6aRMCrcA6nNtDZ3fJ8HLM4o8sTWa1BMvvW0WT5VZwbWFY%2FV4K%2Fq84sBoyMtVaGbuiXfEL4Z78wIn%2FjMSgYJ%2FxX%2BSj1Hox1OQJUO%2Fc%2FCoZvsfeBtPdIaXzyO4Xk3CINtH6%2BRoWMlIzt4QdQj1RQzIJ728D8GXwPDVzhZNBc7yz7w0ddxHTRe8o1ajl8ZxrYipkqTWT%2Bj%2BR6UKpqnN6K94NloHf8D8%2BVHrUVBh2FcJMzfx%2B7xsiQNi8LI6%2BqG5bOU4%2F6DtTb%2BD9GRQfGoNKqBfcUEcTosuyP5lnVGfNuVqF33hwIA0mynVQWmnwY73s6ZjHTpw8752%2FkqL2gFyGVh6u61kJoNInYloah7Xe%2B3NFDy5HMFhss9nQvnLAIfMnEWqmrwSvhbqH9Tfm7B%2BCe9Bsl3gknzszMYnC0zzRfVzTu%2BBHcnfQYg5qm7hLc8BTLntmzeX5agWmwrhnNw2HSg%2BDHStV%2BqR3WrDX4S8MjDeI8uaPCc0UcmnYbS1ty7joKsMFp%2BgVQOK0w792BuS5JZmB9%2BEbsLXzF%2BZyBQzKFzE48vVNuRf6zoR89JON4aECJFAP1HJKyIAPveE4YBZ0r8EBWKA9NkWdwBNNi4v4r8aYT2RsdUp%2BuWOoizr2RPQ%2FzGj%2B%2F9MIbx%2B8oGOqUBnCVU6lMfYlYXu20R4T78InLVfH8zi%2BoeykZrxEHHeaxoK6Tf5%2FNHHCkHNEDZK%2FDoQF6NABzfdgvHuzzjz4Jp8sVERleCDI6Nff%2F%2BU%2Fkv1OF8OddrXHdCmEe43wTgN7qxJtgc9RU9evRMx%2FzGLwIqhQ2Q5uu%2FaC354mf9v6BpSClc9XWGEVZDav0zWDoVyKWsk5tGr1DEok3wCvFGYSfJHvjr0cmK&X-Amz-Signature=61403a875d0d1c523f0d662d3f86c724e2853cb606a15491bb7c3a2796ac7d26&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XDDXNFXO%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005550Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDBCB6FjTNAy3EyBK7V9L%2B1bXs%2BZy6keZw1vdIZsFORJAIgfytEPp4kP9nvgvgpy6%2F%2B2l1rF2CEu9cGHEGvrKhk7fMqiAQIgf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK39n31mc7smttGWrCrcAxS5%2BS7b1we8Hz%2BOBkfeEM%2FB4myogW%2Bqj9blkfO2LHVxEAoc%2B%2FzUZznM5tzJVspvlKBKWmxRmHmbRvqD%2BwRdYNSlwYG%2BIH8U%2BY3KSbzVumLSRZO%2F7bE1bNF%2B%2FSJTMRQ88Gpm2GvlwftCxPOoAHhzSeb5axMwFhxq2ZCLkNzXj2af90d770CdkUh2ZF4sT6DmSEImitHuwC95oO%2FXqPGZumrzCA07Ot8wbiBeax%2FgTphSraKiumzDvUxb7bV2%2BxwmTMyOBrPjlSwAdBhgKeMxXOOUWUJsnYTB5%2BP8AhNNy0yvqcEA0MO1lehRLWIt%2Fg7aBPVSgJm83dWXtRdiC6sShJUDDT5oOU5oT%2FierhhW%2Fv1%2B9z36r3%2Bo%2B0yW35lRe0b6KN6JdZfTSCXqdt%2BUXRON%2BNCu%2BBVDn%2FG6GBmn6PGVySUVbbEKRGNBwyTuoFW%2FUlRSGwICD%2FLKxx6uiAtXr%2FF8C9sa%2Fk4eCL8v6cqu1J%2FfVT5cK855G5QTn%2FAIt8UG2Qc7VAdHu6XTlSUYZsD%2Fl969TynPTSmn2QAvmyFI%2F0HwqRli4rpl6nUid3l5JPY%2FS%2BRUBxqP9nwNbuHvvCpGFFId7C%2BzrfatL6F3uyQEu994cQyQZfAbD018771R3MakMMrx%2B8oGOqUBkuUsYgMpUFa%2Bea0zwuov6P7skGZ2ZFjhZTwv7BU81iAYW1C3dRbNSDypza%2BHJ%2FbbyHTnJU%2BumpHdMOLIalwmPFLIBMy1Rr3QNOUWBpkdNVxq8JDmjb91%2FsQ2Xw%2F10WDf48YiwhizugeE6X7UoLDctmloLnuePwgBrbh8LjfGUCqxXN7OiKxRWxbsjJTDB1osU44MKWHKahbSVGFKinMBaG4yECXw&X-Amz-Signature=adf8e814a2d089ee7499556fdfa3e6eb52ad9a680f2d7b954e421fac8f6889da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WDFMIJFN%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCQOK0dyJp9dPvqdn8gVEbANyKUmbjVS%2F36h8FgKZrxNQIgKiU0RFEEZkfaDkHUax75VCfVV6y3uMYUhRB8iivkjwQqiAQIgf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPRjCioUSXVGfMd8qCrcAzdeP8Ezm0JkHIfcxZ1Vz8eUhhRSM%2Bf0z7xR5OXHs0Z2Ym1dIZQipCOcjZcUrcCRLjY0SEtuCZvzKCMDxqQHkgZgasT4WIk1br62HBmpfkJjftJmZMRSKPCMhPb3KWtbS0wWIsxhRZbhv51lu0jadI4Ph0YcoZk1jORNt0cnM4cLSd7REGsB9wpWl6skuFkwbkJyq9jBJECk6YDkpIuVXMNBwDjJUycrhPZ%2B6rLtm5eqDx9ok71FiAQa3C4O5rrDMo%2B3RFE55tPO48CO3%2F3CtjnuxfXHK1DgdE9U7m5EIaY5%2BCOoBHaWro7mP80EotV9yuFzj15zCpWkuaPYtHoT3IjCrmOXtywx%2BBwKI%2FtBz04xl%2Bl3bXj78498XWZHMrBor4VQBxtEGrMXuEv55lvPp1hys8FkZfTKmI0ADmJit4JPX6dRINubWAgK5b1igcpoqNS1M4PmKxwlu2YLVUOXtrX%2BH7guNVPKErJT2ontveVEhEJUqI%2FNs%2FLmvLUWzEu2ywqr39zaNCFqSW%2BNHkbN%2FHBlWB3B2lyQEaLeh9PPBaBsRFd51MhAE0Q2JptIPGIL9maPcN3RkLLYIv6trQn14F3oXJpVOfBap6Z%2FuhX5f2baGG7pDbwnVIz%2BoLsfMPnw%2B8oGOqUB94%2FkaPbKWATtddf58vKXiRy6aD4arihayw%2BLUpV7U11G%2FY%2B7QrSaXmwEYv7NYcenWuTcPHCo%2B8foCeNTGXL%2FHumrqgIO25CtXDvllYkUDKFeGbwYyFOaTQMENuK01vDzAJB8wKPUguN0E%2B%2Fdc52razKi6aw9CgcGsGM8mgkSG9ZQ4prh0cZyHKcjKhJ4jetUfZ7EGYAwdSexD%2BR0t8skJYrPK1NN&X-Amz-Signature=dba0d3fa6ba8a0dfd1eb6f3e1c0e224e261ad3459357c396467adad36604d485&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QTOLJ4QA%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHAeiZxmbdaRVQo3H1pfRCfrTZY6IJwc4IJn5H6gHSsvAiB0menlp3nnYx9GDcfw5CQgXOqOZA8DqL3wTI0XfB3LwCqIBAiB%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGy2ir%2FpK0Jg9cvQWKtwDskHRn4D2Deh6cfI22RcSwJhi1J2QnYsCyOj6oMNkwNlFCgIK2yM8cuxSEoXaWdYt4COAfNM066HzuFkg39CZFvidyFoQ3Ze6CFLD%2BwDgOnKOnXIFy%2FBlbcI4CCF6j8YJGUPuUIdDR3u0saInpI%2BNx8usdj%2BX%2BJmjWamrHZE0JTVGTUjNiBGp0KmHvLOtY44F21B5Em8K9R8r9%2B3LkMvYSNwwrk2UyHhKPQZIbaIa18HvWF16CHx2RD5B5dgjscu0vyG9W20iFiT8XzXjRu9lZv8gUe5c7FfnLOgny1DKHTUcAvbm7R5B6vs9ruEZ7CFiW75YaBEiJyfTbnBYJHwODDczX62j6W7Wt75SRkYXg2ZsEuesCLyq3Bf6A1VWBL3HSB%2FmQ3PIZbgAiIplqzRaSYejyepHO8ZMEkYVi%2BbBmSoAzj1W86ah19zp7IrVeTqQdu6JbagAqIoVQiMzRC2tnr3SjIZmAafotsYygl1e%2BkrTfDJLc8ONTV79QwiwwK%2FaJmaL54EojF6wsUkJS%2BYFfXKz8fCTbucAn4bgpxyq%2F5vH5VdUklOOzc%2Fnt3IKqTfPxk1bDm3YMEGmDOW9%2BwklkC38Ry9jXGuAfDSD2xJFKQcYbigKq8MvqrMJ8fAw%2BfH7ygY6pgGRZMPbCCTycYDGlXJGG36fBa1YpqkWzi0c%2BHIAV68Vbo%2BLx3Ss5XLeHzgJjDG4Epub9JjndcPpftp7jl9JJzWn71rjuGlVtp7Nt9AqUetnyrgmfEdmfbYHu62dPVtPultXVKYOSvkUkbzPEXrLw%2B0igCIrAtfAVe5D8Z%2Ftk8qCzC036JratwALMB7CxcvufL9Dh%2F%2F23SNTpgaPvUGVWYR6rOd4%2BNfG&X-Amz-Signature=93a0b1228ea056c060bf2ae9ae91446b58688e16bdfb19f5f9776d62c8cb6876&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664NWPF55C%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAIBd8PpUboz3uA7KYUTZ6uEOIdC3JCNkpinWwZ2K1aqAiEAso8SBmCQ%2FpULSFcqF10yrpkdnqmhJaEovqZ3UOmmQQ8qiAQIgf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCcojIEffaKqa4W8oircA%2FeCLRSoCXOtsOpWmO0NeiXZAN2B60CNNIPiLDxrHf4DHOL1C7FMZpV7eYz86snfSrCMJLzsjMSGJB74KIrl8EnsabqBq8RczVC%2BCoxYDguGmEnTcwuXt03Hbwina6ZmNN1VIgr1T19SK0o9WsfvYICcgObfHgTWdTHIoflhye2DXDNUgBZcFZ9aoaWc5XKNou8%2Ft30OJuzgDJu6ErDd%2FPJDXTowDBRtSCqOLZ5fP15upD9jYoIxpypT4kFBeg05VJzQd8moFgHnwrPiXOTpM3N6hLHFUkv%2BSnmMpc9yx0gipIQhQE54Yz1lbCrk5abpRmiHpMMH3KZ7vB%2F7R%2Bk3e6ZVBEUjOWGEopbj0Kqq4o6AhWqM5BS8ky8cYOuJGIfWtcoEXscUuzSW3GfzfsZYoTt92eaTZEeI%2FTtjR53ziei%2BpJi5Zv2W9xVG0ufa2dasjHtE6a56gjS26PpZsC47GAtjhnH%2FpIsp3riRsDLdhnt88wzRJrKkn1%2FGhTLKSh0RQiAXY5Yuqd5iOK8PbDjqN1S2n2L95Gmq4EXdtct6LeF2PI%2F%2B%2FmzZacBXCRNAerub0QwdFUQq%2FTeQTohEhbGKn10K1crKkmWlE2uIpnSofhyGtH6ZxToogyAJlhDUMKvx%2B8oGOqUBqDzyEJEqiRH3b0%2FolGT4oR0ERlmjwlQPgAYmCFCrKiLZvW9mogK%2Fv2M%2FUkUOZnTXJbo02%2BXJUsl6zZTLS4VwLe2BMCdWy9i1eRsIEykMd839iXBkEAPo7me4oXG841mbzg2LgQAvQuwVpcJehpJKSlPNRHOlqFlcLA5PF7eUJf%2FWHiX6TDFyVyk1u3YXfErn%2BEZM%2BWSP2uY1JXyMTFAqNaTC7UoF&X-Amz-Signature=562572ec22773e3cb6b6f1e00bdd4a2a55cc5726bad058ce5ac676b56d175fe8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634KZCMI4%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDa9EYkynWgLQk%2F6km%2Bimi09uS8xW8XImMw0rGyDXdYPQIhAKIEbSk3AVTZIoqAYASvgbWRZRnwop04MTnmL%2BpDM%2FwhKogECIH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyn9VsXLa3wYnFTDvUq3AMH%2BNA%2F16Gvmrjby2mEufoqA9BNQF3gqHAvxkZgxcggvaE046012egBLN7IUDrleM3iXeAkmbcWQKHII0uUZvNx5zsUevm7uqH7V6n%2FEwIQ5PXym1Pj89ALQpFrslAZtx%2FySN1wHfltZxfCubcMIw%2FZ%2FdTk6nL2XmMEk0q7Q3hHEYMxwKodYsQGMVXEa78EKkjiL%2BuAe56jc4dHQFQP07K7wvlyt8GDunUtUavE6zfS%2Bv9frtFFJdBU7kLtYy0pRq%2B5elu60VgRvAEapoEfjP9DeDVi3WAdqXNXLNMewmZ7WtJ3hpZCeT%2Fcff96Ihx7KAJwZTP%2FJs7ZJQaAdvK3VOOrP4nNeD1MIDMSI25Ih98KXf61qrJb%2BNx%2Bi7PBA6C9JaQJ03H18aa695SnAE6Mp%2BV27%2BNhH4q%2F4bJT9%2FYvJDFqVXzy9QYoBysvWDntWgOjo6t32XtQWmRT0R0R2PcAwK%2FVy2SsDwdS3OpqaaNyC8ZFLfZzg%2BvYnELWJnmCfbg0FcHtaQo6sdGuC6%2Bw0%2FD3Qi9IOmJLPFOPzi%2BUlBsDW6ykps7g0ncyCdPdFa0dEaUNKPRHp2fmrNe%2BgNTI%2FF2pkmt5xvei%2FdIg1Dwamq043uMhDmhIFDe%2FZqxgfIS3%2FDD68PvKBjqkAaIHL0br1Nl%2FM3pMQgMhB%2FuSTUUvITYTkyep4M1wz%2FzGqtVMlQCnmf1EZoO39botpoZopwjA6omwEQ6Z0XV9pHVqXzrDsleOKZPU7o%2FLKPVKReM%2B%2BOYkY1Nz4VlqfgFVvYSIhS6kUbUYKjjwutRfS7kwqa5y7dMG5%2BpPLzQrDVZ6%2BCXocKI%2BuIOiObwXqAoRfKP58Nm2i5iiLk2aWlI5AQZmm9P7&X-Amz-Signature=282f319e1d2a56cd3dc7074b0afd3f42976daf0748507f532f734a1ed278c785&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YMG3DGE%2F20260108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260108T005533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDTutXvIdwEBtfVg7cRVzN2i37i2BnhkHubeeS0jnM1IQIgDjMLkNum%2FsyMDU7AUcCZIMccefpgm0WDUsmcCTqIoU0qiAQIgf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM7i%2FLz6KQtST6aRMCrcA6nNtDZ3fJ8HLM4o8sTWa1BMvvW0WT5VZwbWFY%2FV4K%2Fq84sBoyMtVaGbuiXfEL4Z78wIn%2FjMSgYJ%2FxX%2BSj1Hox1OQJUO%2Fc%2FCoZvsfeBtPdIaXzyO4Xk3CINtH6%2BRoWMlIzt4QdQj1RQzIJ728D8GXwPDVzhZNBc7yz7w0ddxHTRe8o1ajl8ZxrYipkqTWT%2Bj%2BR6UKpqnN6K94NloHf8D8%2BVHrUVBh2FcJMzfx%2B7xsiQNi8LI6%2BqG5bOU4%2F6DtTb%2BD9GRQfGoNKqBfcUEcTosuyP5lnVGfNuVqF33hwIA0mynVQWmnwY73s6ZjHTpw8752%2FkqL2gFyGVh6u61kJoNInYloah7Xe%2B3NFDy5HMFhss9nQvnLAIfMnEWqmrwSvhbqH9Tfm7B%2BCe9Bsl3gknzszMYnC0zzRfVzTu%2BBHcnfQYg5qm7hLc8BTLntmzeX5agWmwrhnNw2HSg%2BDHStV%2BqR3WrDX4S8MjDeI8uaPCc0UcmnYbS1ty7joKsMFp%2BgVQOK0w792BuS5JZmB9%2BEbsLXzF%2BZyBQzKFzE48vVNuRf6zoR89JON4aECJFAP1HJKyIAPveE4YBZ0r8EBWKA9NkWdwBNNi4v4r8aYT2RsdUp%2BuWOoizr2RPQ%2FzGj%2B%2F9MIbx%2B8oGOqUBnCVU6lMfYlYXu20R4T78InLVfH8zi%2BoeykZrxEHHeaxoK6Tf5%2FNHHCkHNEDZK%2FDoQF6NABzfdgvHuzzjz4Jp8sVERleCDI6Nff%2F%2BU%2Fkv1OF8OddrXHdCmEe43wTgN7qxJtgc9RU9evRMx%2FzGLwIqhQ2Q5uu%2FaC354mf9v6BpSClc9XWGEVZDav0zWDoVyKWsk5tGr1DEok3wCvFGYSfJHvjr0cmK&X-Amz-Signature=4786a08059092972b43982c519cc460a8620da2336a8d557a3cae76ece20c9b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
