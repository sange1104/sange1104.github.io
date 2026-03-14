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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSB67FAR%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025313Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHsT7jzpkSAIZq%2BgjZsTTd%2BWpgx9EHTsI0A6LuFChnZdAiBAotmjtfZ7O4z5XS5RSHyDW3HdzF4gBjTXQaG26DLAGCqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM4Sh988eaNbwwChahKtwDjruH5wFv%2FpYtqV3sDClZnPID1o31tmgxCjeTZjUXXb8KRgPPdVVxuU%2FOqB2LpuYfV%2B1vpZROtIb9jn2eVk0%2BwdDXkNAdpRtrqquneNOmv0bAwUX1NLTvUarHpq8SsFu787lnESLZ%2B9Ztvk1MluQBO%2BOsQqDP23tLglAmylcnoPrMzQJBXC4d633kXmtf4GwD74EFfrIpiHpJZgaDak0ksWDkNhmpEFbY2VKt%2F6Hx2HvR7cFAL4I1AbUF4MbiCqxZmarY9fibxeIE0N1gzSpdIb%2BfLZyi5vqZWbEWjzguBq0RC64W4UsoUGYVbMd6OxoLUoRnWEX3idJ1fRdZ8oax1p3rnfIe%2Fp3untpuEFn9%2FDEMMbDLLrLqENpHvbW1g%2BKnUOkoL%2BCBaAU2%2BBBt6dtPP5LIWwiiahRqrl9ANhGr4djP%2FmwSCOUhyGWV4iUMvbE7qUbJCmqDN2giQU1I2plWfnszO8EJpgfYr7DryxZSaemG4XMOAPSxn2sZfR4tpt89xU%2FWGrJX9Yo%2FouoU0Z0AtayCvAaMCFkhGsxl2Ne79RWOWRduttyzqSVz1FBZxg6XZE6ZPuWkGYLUIi9ioCv7OfjTfZdWsHhCNqIyAZOotvG%2BiOskFXdiY99sLTYwk4PTzQY6pgHS2WBCAQ%2BbsgvG4Pg9eZ7HtgW%2BHsWWYCLh1rCSfCOvOOFCeHiI7XO6GSfqrtPv21TniCsRDzn0PgmvXqf4b6XZUEK4AkNgSP2eZqdsor2ioHJh5Cv1MfwdkB8r7Ilr1G%2ByNrgbMrrrjP5KZhN0EknJdQS84ek6aNZIZ1kkubav5cgdPBL6zDuvl%2FCH%2FqapszB25%2BvyvNIwAZQEKfY9rIDMVUuHOPFx&X-Amz-Signature=a7858ef61b143102be1a2ac3c0502f972cd4b8fa10b5826516e7700dadfb487f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RGQKIUSW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025314Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNdman1WzScLhQlleB%2FHebc3DvfNC%2F%2BIyc0CAoSa1x1gIhAMQ3Pn3uXazlqE6fSsP7DMC1DmpStgpzTNT3gZ6jR2K4KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxz%2FacE9JjOb7OCNHcq3AMUbZSZt64pZJ9p83tqnD%2BemTjKx7xZYy5fxQBQzfcAEHCo3cMRPJRMcc5Yxx3umyrHX1x4ek29Hnk8YW8YKNAvnw9oAd4KJiz3MRKknD2uneegZS2GSM7%2By0%2FvA100bmITuykuVr%2FYm8dyG1xKNMFqDXJb8y%2Fxp6rxo9XxSnKtCLU3yLlWECHdwcSV0%2FOcM%2FRqO48uEVaCBa5aY1VbUY966KrFZ%2FKQEZJnul59w9SRt4%2Bm%2FCUhSnQAOiHeTganGrY%2BceTJ3Zh7zLb1EaGX7IwpJcGjCw5EewYnMSXSos4XaM0K5hGNdUd%2Fx%2BAjqmUSqydBBxBKQmsMK24n8Jp5SFXtY6UswwEkI%2FstjnQJPoB0Qvk7W86tH8WBxLlLHnB5KNlWNE08HFcEZ75%2BeaedoEWKLVv2oAwwB6SgWq9ZjTN6Ccc6Dt0A029K2AhXZreorwXT2dVM0AS1gH%2FirB8d2Z%2FCCVXh3pxhwjmWjUXqH3EXteASJgF9WfZUvDCJybyVGoMQqa%2Fdb75%2BLxi9nunyr%2Fv43Obmc6OhhFif06slMkd2DJjFKm1W5uhAoeb4J6s66rbHVZNUdorENPUZ%2FMdyke8ysiWdmU8aZLM7CLFpVCWV8vAR1eIXIMsKjAuQRzDagdPNBjqkAScganFBXXKC4whSRlL5ljGE0VoVTAXUgXCUQ%2BCKn09ZcQR5tCITXpehqkhLvAIDsy%2B%2Bv6FKpBSQo%2BD%2Brg8q6vwRQVRlFTCxqxU6qfRM7%2B7r4Yc9HkMl5zf5ri2PdK0UrNIGaBdbYSOiLS0FbMdpZe7JKyKYZzSMWwODCM1%2Bld9aZB3u3Ar5JDcC6cd7V9h1I8X3FqeZlSzeA8TgZkF5J5UruNpv&X-Amz-Signature=96525148909da302458155714e8b90a4775a0ee495bb6695533d9091fcd79045&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OUB6PKI%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025251Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBvdWb6O6OCf4LDnHfrsHdrHHbbBcG11tcxLW7dYOKv%2BAiAwrKijrc%2FB%2BYknhRQucSY8cYjZzfsB4blP6cska7iRXSqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZCwWyK6WOCYk3MEQKtwD98ymw2SfF2veylN1bgTq%2BZEfHVBhSFu%2FvRp0FaD3QSWRrrsCWYt11U3Y9lJLwaVtdPhY5MltwHdeTFQ%2BkKedZ7WanSUums0cdrMuymMss79Va9GmRTN7ggHyrNfi%2FI5qZsFvYGrXupyu%2BoUQ9OzFiV9XCPEi01rKuf9FqM5kQTS%2F8VaDJ24u%2FM35jJACUupgUCnxhfnWB8c1JW0VbjUviKR7cMMpwKU82lEDrqpMqAaf4eahcnocH3VU%2BGebLfuGIxBAweSHQnLfwO%2FokZwM9gRs49W9z7Z5gp9FSKk2nBvBS67dlE%2FHWVbc7gfZufQJ2VnXB%2BCJ6KZ%2FqUFt%2FJkipNMnxFo23460%2Ff0qRuYMkyF4lc%2BDPYPRaii4asCVX3om8%2Bci%2Bu8evK6Pd21sFNP7KGQE%2BefNxX2rE6RcZGsjRE0Biu%2Fekacu7NV2VrZ0V0iCXVLHLylv7o6ZibBpC63TFMoZfDP3839wNZ7%2FBUWM9s9ZZSk00erRnpjVBZNOO4t0Qp70B1dMF3OYx0XXEpVwsjUaOkXZHpYQP22cLjlpg02g27jXjX%2FrFqEOfLgoUthJvZmfCQGR7xsoDz13cOtaSzp8q41DPrufmoacN9GL8U0in%2BVakrts%2F9SdamAwoIPTzQY6pgH1CF%2Fh%2F6KCn6kkdJH21q2u5pvjPODnVUFP0Si6ySbvcAK9wpYluyCEN4%2BTdBbs%2F2zdAGGD3mml55IuBcM0BLNxAAWTPhC5SMDSPiPE6Ow0jPWG9vftj3eSy%2BxnhU1NfPyUtd6KsSjXRr3U4gvjIKbacvUeDBTGK2IA50BXpd0dl%2FmYCUGTNNN7XgGP4Q9rWI6VpdPy66xAfg5jR0Gds%2FfRtCgw%2Bpad&X-Amz-Signature=80662b4da5d3f998fda6d2e89345c0d4e9ce1f837f2b792e0dc08ff8ff35bbb4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OUB6PKI%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025251Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBvdWb6O6OCf4LDnHfrsHdrHHbbBcG11tcxLW7dYOKv%2BAiAwrKijrc%2FB%2BYknhRQucSY8cYjZzfsB4blP6cska7iRXSqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZCwWyK6WOCYk3MEQKtwD98ymw2SfF2veylN1bgTq%2BZEfHVBhSFu%2FvRp0FaD3QSWRrrsCWYt11U3Y9lJLwaVtdPhY5MltwHdeTFQ%2BkKedZ7WanSUums0cdrMuymMss79Va9GmRTN7ggHyrNfi%2FI5qZsFvYGrXupyu%2BoUQ9OzFiV9XCPEi01rKuf9FqM5kQTS%2F8VaDJ24u%2FM35jJACUupgUCnxhfnWB8c1JW0VbjUviKR7cMMpwKU82lEDrqpMqAaf4eahcnocH3VU%2BGebLfuGIxBAweSHQnLfwO%2FokZwM9gRs49W9z7Z5gp9FSKk2nBvBS67dlE%2FHWVbc7gfZufQJ2VnXB%2BCJ6KZ%2FqUFt%2FJkipNMnxFo23460%2Ff0qRuYMkyF4lc%2BDPYPRaii4asCVX3om8%2Bci%2Bu8evK6Pd21sFNP7KGQE%2BefNxX2rE6RcZGsjRE0Biu%2Fekacu7NV2VrZ0V0iCXVLHLylv7o6ZibBpC63TFMoZfDP3839wNZ7%2FBUWM9s9ZZSk00erRnpjVBZNOO4t0Qp70B1dMF3OYx0XXEpVwsjUaOkXZHpYQP22cLjlpg02g27jXjX%2FrFqEOfLgoUthJvZmfCQGR7xsoDz13cOtaSzp8q41DPrufmoacN9GL8U0in%2BVakrts%2F9SdamAwoIPTzQY6pgH1CF%2Fh%2F6KCn6kkdJH21q2u5pvjPODnVUFP0Si6ySbvcAK9wpYluyCEN4%2BTdBbs%2F2zdAGGD3mml55IuBcM0BLNxAAWTPhC5SMDSPiPE6Ow0jPWG9vftj3eSy%2BxnhU1NfPyUtd6KsSjXRr3U4gvjIKbacvUeDBTGK2IA50BXpd0dl%2FmYCUGTNNN7XgGP4Q9rWI6VpdPy66xAfg5jR0Gds%2FfRtCgw%2Bpad&X-Amz-Signature=dd4261f02b9b991b9ce8c5ae73e650768e82a61c918238d1d3d23d4185e742dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBABBH45%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025320Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCd7liAwMBK41%2Fu9XyvrR0oN6RwHF0QUMBeHYVPQxaZIgIhAJV8DSSK4a6eejxaC8cbyHESFlB4klFBGqKYe8c1HM7ZKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgysUBXKFcobZ%2FEUPvcq3AM4tW2%2BQfztd%2BhVjz06gRWbXVQUirhigy3TIoYtrX6Y3QOxiPxFHZdIPyHUe4C6WJdsgHwyE2VnULGWd8ifaxPZcvGNCm5eaFEQmYoP8sdN4uQQ2FutM%2BgARlXKJuLTG3G0NleHEWpuerFupoN%2Fc2HIcN8FgsUECzOK8jipq5O8YCF7O3%2FMqOPPeFpHEgIlyeerYQ21%2BbnRCSUqLL4kTwcV9O%2FS31TR43P5lB0CPLfoWmSmwgmFu7ddHttdmA5sIY%2FyokACJYXyTt9HLsE3%2FginZ%2BmQXgDSp1iOaDR0pj6g3FZ9aHuOX6%2FhZizu6jpOqMnPjX1Ruekf5USuXq%2BLmAXxCbt0J4qldT%2BBowVTL7DasAu%2Fql5uDiD1wdrq7gxyI3N%2FnuaslRFRnVAalBclLZYsEF5YmfwSxR9TaoI4RlRluKb0jAHP6u1027Wg%2F7YYzEhzdG05lkf3m%2F2Qhl8IjBPWJg92Rz1hn%2FqAEPxPMFzwRKwaaizklsubaCUORRzB8w4sI8J9BnHnsEo6VBG%2FbeL60Iu9GAA2KjcFi92SpFD56A8OZpKc1B%2F4T3SG8JnOle8ejnqt4FKe70rDMpeak3t4caP439DQUJdZbp%2BdzxTTIyj%2BV6vOHD%2BA9VKGFDCYgtPNBjqkAc6yPihHvaCwrY3hCSYcqPPBBtxtc8ey2DRaysRdh8cwQKqCmPmSEdFB2qUazfbRbPKn3J9fGo8qWZjjs%2Bok6Los6HwU%2FMqYImj0l33Iy2nBxWwpa36loOSYEaDLDD4qqy6kcWwvCoGxMLm5qiiSBpnqE8ozST5XT1UnrS2BBtju0sHVlDZmc30Vn92jw9XmNIrU0Q9aQKS2KWaJYs50W83y7ipk&X-Amz-Signature=ae818c0f4e2543b93e591cadf15d14fc4a2c5ef588fe25a24e3c83e41e2843a3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665R44LTES%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICV0aKzacJM4P94OhtgaHSrEv%2FT6c%2FIr4ZCT4QLllSZ3AiEAyxnEAJnSPuE4zp4oUWzOETfDYO4mOTxVZBiTdxNUPDcqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDADnP378B8gU%2BseRMircAwaViUNrZRUFn3FoQxeGcYCnLfxijrsN9BMarhyQXpLKce0N4BqrbtDPLZzD2ZFdxCJS%2FGspKcnhTEjHYjnYoOCU3VafkNCEQ2U2p5xqsoOf%2BhgXr%2F85MdXPzJIOEm8eqNY5E3U7UAGz8oBbI1mhaqaRYYUuCwl5ZLAPeixMnPxtMCE3UXHQut7UPDrD0nArqP7ydyHNuBAITI2dMJN64g1lb%2BpFimMfUOlnEpIINJqlOA4f%2FBvs2fx20VOP66iOUbPp0fAzdapXUZDt7f7%2F3bx99HgmndQucZjU%2BKXSmuMYOFFHZ2W2PK8eYXeIFUcvkKnHeT6wHa5H5fO2g7oMJBY4zy3JXQpeXRFBHPrMb3n0KzQTxbe3sKiCzYEmrlmO7hdeSIDMbK%2B50vtpqy%2FXm82WnGaOIBJ0UsDetBUFLiKvVHrauAB6RZekI%2BpgDBO8KSfBRfny6QWwmMkZo16MXQeeW3Gm71lAEBMbb35O4HJ6YzW7tMoDx2rUw25M2iq0XqDUsupl5%2FG7UVDxCQXAAJX1jiYp%2BuINVhz5yEJBIJVSgpNOI24ECp2pKfoqc%2FK9uOV3VsRA%2F9u0SZ3HVREddNbPV3Jd1t7%2BqyGVJuaBMPIv16FajI1ilffnTIx0MOyB080GOqUBn5jSsVHZsHFUzE41mq1oP1nJz%2B3qgYp%2B0lELfbsNS%2BWuDXTDPIh0AK9EYa99kKz%2FMbnSLsDl2OMPm5weKBQyzsJY5uw%2FRKL%2BNFyVmNuMP7rSC4DZZ5YHsGr6CwOb4sdwbh5AM15NLreQKY3Ug3lQ0ezTIjOOuSb5cx9RBGys9%2BzsFVOQcDQSXcfG5p92ceclQoXcNuOSEWGSqt2SIKfV%2FFfBaTN8&X-Amz-Signature=559e1d3ebfc90bd79e374a119a61cb3677d3347e531a1e29383509536e1988e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QU746CDT%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD47diqKEsCORP84BBIgbWf3ck7AjqluHRtKRD6BnxVsgIhALxgnf2MHTReRhUHJnJ%2FdhluP%2B9qRx1LMg7WLlvLJEL3KogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwFDPKExAqWjrynDvkq3ANQyQos3di7ICAZwB1AUaTXcoTewVR4Ssi%2BvPyf0Iu%2FHDE1IJsGau0YwvIfEgDDeBoJ18cpaR2FXhssLA2E4KsVXkUylgpwtRiVYT6ZaaJyzZ7mStcxqdYn88NbfbUYI3dldKEQeFQZKBB8n3PClaGdADx17vqp4nJtw%2Bl4QrEHAY9I997tN2va%2F2NDZvdupCFTlDnL4tv1O0M%2Fu1DHjnjLQU0sNx7lXZJ%2B%2BfK3xnfKoI4NUqRgb6dMNzMsJWFqYL6aRPMcTwI7AwGSSsMXInYPyTAuKE%2BJt4w%2FcvbPLj8WMF4NhwMkMx8m%2F028VVOwmgienzIzbq8%2FUdtrBui%2F%2BWDyhi2xasM4uX8tR6N3NpmExuu0Qzpq5fLMvWYPDhS2MZnHB%2B3WxZEwvoVRM1N6HcbQ0y43lH6ELAkiTpU5%2BP1hrMwNVeFKCXOZvOURQTa%2B5E9v8dUpMimXx3sKhcjt3WPfqi2SWxsZk02%2BMcNUfO6TNYeIckSaGttCMTFAmT%2FSIywScW8TNL3Gpa9tnHc%2Fqu2GYiYkQJh6DC8atZe8vCqafZLbT2GxEje95XhwMP2uFVoys6jjtxEUEMTFqHvkB2s%2FgdsOq8jprRCS8bPwh8wNhx%2F19kQLiBPkhatYOTCbgtPNBjqkATgg5GBoS7002iwBwlS%2FX62j6OkqJ3x20lAXy1XsiloQPoyvsj769ooSs44caJSzgU68u6qP7oyCMwC5vpYby%2FL6LnAaMYxsB4Xbg0tGbXhiCTgek6Ab94cKnplcrAGGFpQ%2FED%2BW7Om5wxDQ%2Bx%2BZnVFx5q%2BdGrh%2BPC06uF5mCZq4b%2B3ND2%2FzVh2TWuC1WEm%2BmIkVRjIJv%2Foy0Xvkfn9CDd5%2F3QI3&X-Amz-Signature=e2ecb9734055e7aba34e8816e276407e3bec2a8dec446dc02412745639b4d1c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QE74H6XG%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025325Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICSKS9WLyZD36RLLJWIi8N0PJNixHLj8EC5MBHSrc0SwAiEAvG8dpuZ6DxsZjkGId8OBXmGtdo95IjxDzaDyDaG6dcgqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNCGILmwqqBXmg%2FENyrcA19NB7euoKLmo%2BtekZ236Vd6OOwCDnOBIwKcJSsJ2iUBqhFM14t9qICIPowxhYxwxxY8rFeon36ECd7VD22M7maqvu9cf%2Fq85ynGXgoiZrMw02DXjypF9C62xCws9Y62vbawqBI8zo2ZMaSJ1wJx%2Bd7uC%2BnwxVF2jXIzNMJfZhUSIn%2BGeDUSK%2BqtehjhJnLTOJvpquHZP7GKVetVn2%2BNBm%2FuXpZ2DWkS20geGQKNMbBAu8nm9I6yRRykKuyB4WGv%2BopYkNGUFicd1fNSOFUyZlqTJphKxfsZj4wd6MdTSpV447FMoIgREovi1XVdOE0Y8YVRJkSy9LIs77Ht6ghEHBk802TqG%2BtKhMDgydgKVY9mRSyWyiosJAR9Hq5gMIT92p9hX7H6SrGhxHb14HDydeHVMVNpj6Oju2ABGigmtbBmjlwAg1U9tlf3l2VynlDGMbiF5H%2Fc7yYrscAk3xs%2BC8FoOlzkLYWQGFAH0OQnDGW1pyOcpkluLO05kZgXBcqzcezmT806Ufehfh1g9qTDHHriIx5xJONgPn%2Be8%2Bedc8ZFLz5How3PpqOmnNWYhYi51mhfygefk2Kl3nJ90vXCu2I4a7OQYSY1arIrjBDSBpIazEZ5wvjC1tS5f4Q9MKCC080GOqUBkhpWmUG%2FyqOR0r3279lGiSV74K7i9D0lGtShJYpcdxYYXWLqFm46U7st6gIaw63eS2wQZBrHY3l8YuF62WlMGn%2F2opQaPz6wuYp7mc62if7HJlAHFf5Ap1UNe2vh%2BZAAOksrtplEE3SQhpgQGiHoOcM9s4ihLt%2FaUF%2B%2FlsRx7irTF18bEk02IGuX93PXn%2FcmMsCWEmImwGH5AAc7%2B1SZp8hoDnMb&X-Amz-Signature=67bc2f38f7cc5afb8174a3323ffb125c1030c50b88708f9562bb18c75192ea5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZ5ARNGU%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025325Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEML%2FUZZzeODmzfsCmUqO8xSE5tZmYowuGG6Vm%2BO2NTBAiBAA6yZcXgrPGa15DUQn71k9WANXTN01BNk60C%2BIqvlZiqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtw%2BlK8p%2BCzr%2BaD7EKtwD5fW75wWqibFTaRg95Ka9T1lwZY825VN7yFAMfCLJtK7o3SDabYyc1m07s015GKGfnBdje2aspglKsWJJB6Y46%2BFqym8hgTDcBSmDlDKf2bGi8XMTHDqQLFIZT7rHprT9ea4BatRjmDY3DD4d%2FKlC0K915ZcpYDBMJ%2Bns95N%2Bfsq6yOSfbzvMLrTiiVqQTlQGk2ZYagf9XIHlnuSI4JSqEYj86R2lcvRuhy4lDkLtSs2kEVhsjNX7sJxYvetZL2RSnuvlqokZy3iP8y7UBEmoKinFvbc3lXywe%2FeOYIQrtzqroKcFO3mv17a4M8zhgs6x8f%2F9eXtT9NnN2Y2IZzYfrxV8mpGG51bGh0F5FwwMBH%2B7ZACD0kGfVFiPcqhWhoN9aeTtWm1ceDerP7ro06GOWttaSpKMd%2F0sLNgfXjnmAqqOs1b4zQWM80H1ghm6H4J54pJoUu3LdCr5dZ41qbGXEeKgkkgUTJoyIYK%2F7Lw6ukoUC%2BYyZzgbRw8uFF45i4psLh%2FrKSQUxayffevKmwbbzS3bpMYNeL4i733kBsGs2t20N5CTTJhYNMGnlvO7IdlW43tkMFpRfTUY7Va4A%2BLGAYl1dgNp078BpPfFRAZ34n4dIR3M2sJvYZDabB0wv4LTzQY6pgFqyWdKLUt7a20URN99fb%2FmmB7hp22zbpfqw6%2BEA8imFrFBN%2BpJZRwVXVIDaq%2BH8HhwEZ%2FHRiaQNLLvocpUstXUJWku%2FDAQPk%2BlkgW5f96iCOnHmhb7IX6iIfGrPgB3dVJgrBqac5n8TbH0scx8cvx2DDPmIJOeYns%2F1lNCpsPO3uNwGfNgOkPsnnmgjA9y4kO5kONFnUPfxMvU68rON4M9btlgN9sZ&X-Amz-Signature=9ce063f76bf2cedff6d5e3aa8705d495b7318ee1862a1c8333181be4aea01699&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OUB6PKI%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025251Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBvdWb6O6OCf4LDnHfrsHdrHHbbBcG11tcxLW7dYOKv%2BAiAwrKijrc%2FB%2BYknhRQucSY8cYjZzfsB4blP6cska7iRXSqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZCwWyK6WOCYk3MEQKtwD98ymw2SfF2veylN1bgTq%2BZEfHVBhSFu%2FvRp0FaD3QSWRrrsCWYt11U3Y9lJLwaVtdPhY5MltwHdeTFQ%2BkKedZ7WanSUums0cdrMuymMss79Va9GmRTN7ggHyrNfi%2FI5qZsFvYGrXupyu%2BoUQ9OzFiV9XCPEi01rKuf9FqM5kQTS%2F8VaDJ24u%2FM35jJACUupgUCnxhfnWB8c1JW0VbjUviKR7cMMpwKU82lEDrqpMqAaf4eahcnocH3VU%2BGebLfuGIxBAweSHQnLfwO%2FokZwM9gRs49W9z7Z5gp9FSKk2nBvBS67dlE%2FHWVbc7gfZufQJ2VnXB%2BCJ6KZ%2FqUFt%2FJkipNMnxFo23460%2Ff0qRuYMkyF4lc%2BDPYPRaii4asCVX3om8%2Bci%2Bu8evK6Pd21sFNP7KGQE%2BefNxX2rE6RcZGsjRE0Biu%2Fekacu7NV2VrZ0V0iCXVLHLylv7o6ZibBpC63TFMoZfDP3839wNZ7%2FBUWM9s9ZZSk00erRnpjVBZNOO4t0Qp70B1dMF3OYx0XXEpVwsjUaOkXZHpYQP22cLjlpg02g27jXjX%2FrFqEOfLgoUthJvZmfCQGR7xsoDz13cOtaSzp8q41DPrufmoacN9GL8U0in%2BVakrts%2F9SdamAwoIPTzQY6pgH1CF%2Fh%2F6KCn6kkdJH21q2u5pvjPODnVUFP0Si6ySbvcAK9wpYluyCEN4%2BTdBbs%2F2zdAGGD3mml55IuBcM0BLNxAAWTPhC5SMDSPiPE6Ow0jPWG9vftj3eSy%2BxnhU1NfPyUtd6KsSjXRr3U4gvjIKbacvUeDBTGK2IA50BXpd0dl%2FmYCUGTNNN7XgGP4Q9rWI6VpdPy66xAfg5jR0Gds%2FfRtCgw%2Bpad&X-Amz-Signature=17f5c9757d933f2f0a89a02187862b8102f415c7ea22775784ffe39920166018&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
