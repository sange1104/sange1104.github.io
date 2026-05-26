---
title: "Visual CoT: Advancing Multi-Modal Language Models with a Comprehensive Dataset and Benchmark for Chain-of-Thought Reasoning"
date: 2026-01-05
categories: [paper-review, vision-language]
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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDJCJ3LH%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDAA6BoxEn64eLyIQhPULRtp7Ns5AdfGNnmvZzYatVDvgIgTeC7l5pCoWEWGuxEMcycMu3bew7c5XzaIMjmqALez9wq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDJK6sFmi1daTm7fk%2FSrcA7lLVvy90yVU%2FTmpNtV1FptSVAgXJtbHslIy2LqkHULiM%2BD1jTaiSBIh%2FAVUh%2F8DvPQz7nVCqr62U%2B7fuxB%2BR4czocvP1vilyMXdYc3qIJ%2F0pc9GPiHJUvhfoKWh3K4FT%2FYGXxt%2BZZVBYDN9%2B50MS5%2FWZT639Av4qAHdTpQ2qfjVVEddz3grpplC1ggXDEiveznGTeIpNRw52lUEraxuVRm%2B8taOYhCjQCLO0yh5ZDK6IYkxa2suWDHxRtalbb%2Bf9nBd6nxUI2Ss1ZE6bnoI6IX%2BNJaeOZZUHsv62WNWNCjTNhy144vPFSmpXpFbVfwB6AMLfkE004dMVhSDoY2HUdBZ2DvqRQ7ZZGbcBro7Ds%2FYkUwMC6gTniOlY3r01ORJbbmGQWK5PBcd0%2BxrPh1x6MZWUb847h8TQ7N97RaxbG12KmBqIS3BtYmoGEx9MZf2O118CoMy2czc%2FZji4AHwFjLhz%2BeCU2eJu2w9KL3GCymfRwmCGMBaB3OmZUDEe4v5GURlpvAEA6CQCvRj8Vcm6rLuUMQDGCDSV1rf1M%2BDn6V3ykJyisq2RbCzk1ob2WHmokLYo828Qes15hhs0h3AoK8fqrrvJPTE0Sj6yjoCCtZVTJsI8ZsrGNb%2FT93sMMj309AGOqUBTD8ZpZKCMdKSdDKs42ogMJPTF9jc2fkHALpfsBcOS3CU3vTsX397NbfQu5i%2BbPQw%2FYilOzuPaMsHvlGSyt1xSNBgEgbKUDGvk5NOqblCFZX5ZeNFPJ1jUMJYO5%2BYkNitmES7%2FH1bLKRJSqpAKHLPcX3H4cnrTJv%2Fd9rMBRvBCCzcJKoVALvX9wS1PGqfSxGfF4ia7OyKMNSt%2FUDuW%2FvM5I%2FJgk3D&X-Amz-Signature=2e408773003d47792ec3fd4795285799b081e6314e800d8a6417e06288fcac99&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WK42NO7A%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGgDtpMju36L4pTcy0jBMcSHXmpb4idR96LkdVTKralDAiB%2BFHRIeclA5XwtTa5n8ZCrV6zftbnd2npYsbka0PXesyr%2FAwhzEAAaDDYzNzQyMzE4MzgwNSIMYIdaPJpJOgHjxuJLKtwDBoNND6%2FcQU9dnePImnTZWXVJX1xeoFD7e5d1ji6zr1clnvrSppyLh4KUPlZQSP2lwWr%2FC4RBALZz4s%2BwB8uiDMAcXGBzS26ran%2B7Om3WYdrrrWeWjlr%2B6d5qYVcZJyyVJ%2FB8ahvhXIeK7m7QJaiaGdSLIpfQgDRvqR%2BVAw8p5hYH%2BIcY14qrLMWJQzWg0%2Bjd%2BWmfw6MoMr3paKL%2FX2%2FENp690YVY6jrfSUH2zub37ms6YC3s%2FFlLN590bNIb0GMIEwUa%2FkrNL55VGcaBQf0%2BY72h4gZA%2BHYbftOk%2BbPDZP6c%2BWHwmc%2F3iv2%2Bm03uYBNHZX9%2BVoeydKVPO6rvWx0wMdSRGdZAcQSRkuZEUiOiSePccFRA1p9j2g3hafah7Xjmh9dK6g39yPxAioJlcDzI1wV%2BrDtWrL8VSa8vvKmemHBWOCUctRNFBCb602TdRR6GNnwAWqAqEXBKChTm5Em8aaMCLeo%2FuWqqhZaeStzvp71RIMbfEJ%2F674E%2FcQNYmz0Du6IfG%2FmB2K%2Bj5RAfVxAsob%2B3pYXLoGeuj747RKZVJ1AH3vBANdNp9lvvgX0BTIGFzM%2FZ3Sb%2FcoQKZZR0G1ZmLFckTzTETTdPHbHlkntlNaRJAtYlFffftVuUqVgwufjT0AY6pgHR%2F4S7%2B6QlJSoTuDGTodPbS423yq%2FHpdJo0SZRUcv8NE2LAe7Ko5mrsbPE%2B8z18utlJbGo%2FFvhCgiczFgLeNuIiZdBWTtYNKtRwuWhk83cC8aI9OBTK44EDaNntP8MkXDKXJsaaQs49yOosAz4JjBo2%2FrMvoD6gzkDNjCXD4Pk785xaGio7IA0O704ojWmHw5aQ4mhcBaND9tORcURsyLpGO9mMj%2BD&X-Amz-Signature=c2d776a354609938eca17f27b29b2d784f477d25136a2d427d6d985b4f8f392b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5YVKEMF%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043613Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCxMo7FA5AzaJ5EShEyab00PykLBGVXix5CFJM8sYlz6AIhAIrfxUK33QAT4Du9FTRcm8bLSpG2NsRRKoxodf01VWfuKv8DCHMQABoMNjM3NDIzMTgzODA1IgxO2zbiCQFXbLWwiQoq3APC3Iu5GMAJGvDqDOf0%2Fm8j852aQWm22%2FHieYWloCP9zOZ7OhNiEb49PkYjsaKYrY3LlXdSBkiLg%2BQjDwYhz1gMIYxUUkUeegCVCE1JNrpR87tvS53ZJ5FC8X0vWbnrx6gPHznMIc7yj0sGt10T8LM1j4vtRodNDY5hDvKJRc%2FBmP9UseMi4bvuk5KHgqaBJ3zPKhR7bKPU8ROHiBW5jYWu3HF%2B3I5m%2FtqdYVlW3MA4sVB6%2Biw29Zm%2B%2BxfRuNGocwqc3cMnQeHKtXMmrMAnbkzMVYlf%2BddENw5sYkSkm3e0a%2BiBFIbdZQN9ab91I27Tgnr0YAevknF5iSOECibx%2FLpN7vGMG1nuAerUu3HKE%2BBPG6frdehFmsIWFT0BpRLb%2By6N6n%2BwycF1dSWEvMeE%2BTiYNLo68t%2Bgzp%2FjN4dAHoKJRfebP%2FgUwW5O3zSbcWvt7Us2Fscp9hEqMT4O4Ugg9eXaLk2DnkRZ29QGSWswbR6bJRNGTmne17VMoYQpK82Nhm2UAXaDP4mXwUVdEY2ehYeYGPszT8ZwCWF5LZWxdCjVnN9Cec%2BNT4uhL1Zht433BauVk31CI1UR5roOqQEMZKKMbou0jbWy9RRzrtqyqX53aADZq9%2F8Tfdke6lUSjCr%2BNPQBjqkARFC%2FAd4Tn4hh4EW6ia%2Fw2xWqejZUjY6miInNj3kI9JvDZ7uaJ9Hx12YHhAnIwo73%2Blshet0LBRwKTqbmoazFqxR0nKOrF301f3KY9Jd7JNy9wJbn7gBGZMzmohdZOUowE0v8%2F0WJ7iBAFYtKi%2BCMlufWsGw7LAfVdGMrnN%2BuHXG7rKpBoAZE5ATTlZI%2FFbFlzGGDPPl0RHf4enC2IIkr6t0itN%2F&X-Amz-Signature=1d356bb3a622287c212807c8bf89ed6c4a77d6c1b28c93c6846a6473f900ad30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5YVKEMF%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043613Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCxMo7FA5AzaJ5EShEyab00PykLBGVXix5CFJM8sYlz6AIhAIrfxUK33QAT4Du9FTRcm8bLSpG2NsRRKoxodf01VWfuKv8DCHMQABoMNjM3NDIzMTgzODA1IgxO2zbiCQFXbLWwiQoq3APC3Iu5GMAJGvDqDOf0%2Fm8j852aQWm22%2FHieYWloCP9zOZ7OhNiEb49PkYjsaKYrY3LlXdSBkiLg%2BQjDwYhz1gMIYxUUkUeegCVCE1JNrpR87tvS53ZJ5FC8X0vWbnrx6gPHznMIc7yj0sGt10T8LM1j4vtRodNDY5hDvKJRc%2FBmP9UseMi4bvuk5KHgqaBJ3zPKhR7bKPU8ROHiBW5jYWu3HF%2B3I5m%2FtqdYVlW3MA4sVB6%2Biw29Zm%2B%2BxfRuNGocwqc3cMnQeHKtXMmrMAnbkzMVYlf%2BddENw5sYkSkm3e0a%2BiBFIbdZQN9ab91I27Tgnr0YAevknF5iSOECibx%2FLpN7vGMG1nuAerUu3HKE%2BBPG6frdehFmsIWFT0BpRLb%2By6N6n%2BwycF1dSWEvMeE%2BTiYNLo68t%2Bgzp%2FjN4dAHoKJRfebP%2FgUwW5O3zSbcWvt7Us2Fscp9hEqMT4O4Ugg9eXaLk2DnkRZ29QGSWswbR6bJRNGTmne17VMoYQpK82Nhm2UAXaDP4mXwUVdEY2ehYeYGPszT8ZwCWF5LZWxdCjVnN9Cec%2BNT4uhL1Zht433BauVk31CI1UR5roOqQEMZKKMbou0jbWy9RRzrtqyqX53aADZq9%2F8Tfdke6lUSjCr%2BNPQBjqkARFC%2FAd4Tn4hh4EW6ia%2Fw2xWqejZUjY6miInNj3kI9JvDZ7uaJ9Hx12YHhAnIwo73%2Blshet0LBRwKTqbmoazFqxR0nKOrF301f3KY9Jd7JNy9wJbn7gBGZMzmohdZOUowE0v8%2F0WJ7iBAFYtKi%2BCMlufWsGw7LAfVdGMrnN%2BuHXG7rKpBoAZE5ATTlZI%2FFbFlzGGDPPl0RHf4enC2IIkr6t0itN%2F&X-Amz-Signature=db5869628002ee6c8e4de02740bb7697dbedd41443b80abe9fd2e0d498b158b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664COL7MPP%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043625Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB1Ygnz9urRcsXv%2FKNbRv0E8t3uVIZSdcfvjdCrZbicRAiBf4zFFJSrTl498jf%2BuH30TdhXkQBioBhQp5KYzNYhsGCr%2FAwhzEAAaDDYzNzQyMzE4MzgwNSIM8JGE0c1oKIb3lAQ9KtwDKnLaiAGOPNC4m8uDG53lTIQlC2TgXcJpuBVP723HQJvtcjXtylfHXTFarU56DQuC6kJFfbO9qO%2F9CYfKVdNBVNXusnoCcn5UrPw4NtalG8v3WCRtiO1gfbT8GhDhJjuImGVNXJt8ckyoaKhVfYHB8yNb4rWfIK7nHVkaCRo9gbSR3UC5qxkHy16nM9iYqtfreEppvpd2%2F%2Fg7K6b%2BdZkkppIWbmnZsiUTJoivHi2m0trH4mri7jp3czEgeNSaWwCV4rzPiH4Q9ibYPfMRhfYYjYjtrGwfFqnUUgUNzqvvmUboIIO2Q3CyGTvDxdwSxanUmcZAi3adGuV583Dr9ZqnqlMRcHAWhmtcOppr%2Fd8jh6UHhMj7L7CY3gXQvmzBhYvH6Bk2TDiLyWBMGKwn7aJoFOy1w4Uu1ddADeAycqEzEkKEjo4vQdSWCYfs%2F8T3Z6E4y%2F9kVDe4NB01uTFoDURKZOVITsa%2FO%2BapgKoi%2F1kzCqRZeqrqvEQMNByS%2BOWsJybP0VJE6Xuxp%2BjqbFRx1UZh0%2BDEIOAgN%2ByEa3WQOzGp%2FNk8A0qIEBHjSmJB0nkDhxKRR3ruwcM6ecEkJ7OsuWZiqQFoKzYIvrPzOgj0En2JCge2dMPLcSTCL3nbSUwwq%2FjT0AY6pgFx1DmMHy2OZyVqCF0eU3Jz3VpHlk0Wg6TVTAABNS98ohRUTTvLmPeF%2FKeMDhkav2vMF6TWZfDjNUIbZ2Tu2U5t2beAy9b0y7QH%2BBkmGkhV9ae%2FpMEC6bZtmMJBnmS94rAzbRv15IBMgnAeZBnPPiK1TAa1OD72XCZnTeIYxosCFCl7eSgEaGWdCIkOT7D8lPyeKYShb243kzVeLmIF6poo9%2Bfyp8kU&X-Amz-Signature=dbfb74946f4d571d738daa9e57aaaa454dec73637680ee7a082ae3518d33a6fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664IPPONAK%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDrvsg3bmfPFnkIchbYrkVAvFOoIF6J3u%2FKqbGqbUNgHgIgfJALQfTOUNaZlkKu3G5sWIQ4Y%2FnBBC8j260Sr0duiwIq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDFp1Swp25T%2Bpm%2BBiOyrcAx8Aq%2B8VMP%2BxKp1NW5Lnr6jQuysNugMEZH759X%2B5E9WdKckvtly7rAAoSbd8V1q9ot2nK7cQAAtycVkLgrHZ7f%2BFP6P7Ws4BPb9Kcpw6mbz98JwY1lMHW34VU1OitbywvnNkPN%2FYq%2FvAulHm7hl9SDdRF17nceDTHN0CPWatOXCF2twh3aCG%2F491%2F5%2FFBYrKx69BhqrubDzLHTlRJe6HYl1sJK6tAe28jJdarnTFYemsDtsZt6fFvaD8b%2FHbo4SfnYRuQwua4kOXdd6zuScueY85V%2Fe%2BWivVqkZayw5uflJggGX3mFGQMik5p6Q7JOLjvdzLWLTzM2zQ9PhJ7UEOpXn0YHoy14uk8sZyykYqPgYPJmXrayfsMtyN7aCDyDokOYo6GTBG57HyJZ18RT20ALw%2BsluU9MJB4JJYdMiolcA9ZhQArRdaUrJDJl6DAf51rgDQGF3WGkIfQ7QH1z7h380o224z3H%2FjrXB4vR4moprhAJc3wAsGbbArQu7GJiDh0%2BsYQW5tQtqDsVSqVsmk4Ix6vTHmvlSBn4Gvpy%2Fjhr6eEyMBC7PgT2WUTrkZ0X0y0%2FfiPdWSYGsCRZ3T7A1gd83BbRDG0m1PZ78RIiCinLI7Wd70gMITb64Js2MhMPj409AGOqUBTqO7m0vnW6qYawSreev2qdT5phI3AYas0x%2FKkSBKVp7plVP9UyvIISCgoEhbmpt5VexvjqM04yX4tnzY%2FqTtWEOfe0mSx8EcYiFsGJqAOAS6JynWgSqrp81i7lJFPnh8TJycbLZrtE1og3oc5TmdRMv5NBa6tW212T85JIb5ZN5TsaMcxGc85AVpkIC3CD6TB4Yav88dMflpVCQi59ZxSIgA2%2Fek&X-Amz-Signature=03b604e13535d5d137e5f63c8e96703cf8d0790ce68ea5af5cd9ec070be650e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIC74EOD%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCUtFrfqc3EvAy2YujzwJiWtW0U3gJ9gTHp6Os9j5FvmQIgRoGEbWLzBjpraA%2BsPx9RkN9OjT4PCqwRAmqF3O8Q1msq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDJDcSJMEZuVTHVG%2FlyrcA6kiKmtJclmKsuRThMPS7jFGJgaKhD7WBRBgd2Z0jC89YE%2FoLbq2dTOwIn5BJs%2ByWtISqnEhgSRTiwsyhtzmOoZoBnzTwWWjnpG1GX7vQXoCrEz4jyjeeaA3Tybmy0ePDHjD8RFzksdmLzRh%2BRQVfOLrFbSmrSsu8%2B8wqYHe7ODvvPSCiWLpJkZgW5uYGGAenCbbyQZX2Q8Lek%2FJpR0TgAno2%2B%2FOuTmC6eX5Ust6gYFnCK25MGBsK%2BlEcXSLahhUWfWSA6hsU3Zes99op18dcho5GkA2nhywITPHxYRT4g5ZbZv5jFJJTaqIVIADFSufER5lfY1ZHFulT799yDJI84FjkR%2F6nmC%2BnXy1PT0pHVfrZICB4RYyf70aL3Wcghz%2B74KFyuofH4%2ByYva%2FTu9qubQfQI9UMoTCbiKdzRuAPsnU%2BDqFezXS823n2Ljzmh0cz9MiZpOwo2pA0YAW%2BRcgItzM1LkW4a%2BFj0CM6tbJUigKaRe5Or9Dq0%2BrOw%2FTgtw478UlMxsELnC5vlkrTDOABfL6rJI5t79ybHVf%2FB3xwV2BV3zaB5LZyrYPZnsUC6qmX1J3TzUA8pF5qfYfuB2m1PvdgKb1u7Xw7JRta4PqctNvB58iibQdzbC1k3JrMLz409AGOqUBkSkVm4aN2VErm7i%2B2DwK3HufQNFF2rAvLkw%2FHW67S2Ss6EORPbHrUJ62CFT4X146%2F9%2FXQZZllW4K5AafOJxetg4Eoppg0QS1sa6z4O8%2FYfLFPo7EgRDQ4DJG7u9kUY3zFAVIlXOGs%2BwKYGwl66s8hksHONQvgFsOvl27A%2BoBGe0LhDYe7ifN9HMGSAzlVF%2BKbJLb%2FJe0ly7apepzkYn23VzeuTB0&X-Amz-Signature=ea7d02fee63450d25acddb95dfad2c2390a5ae08411b0443c717d450d276138b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XKNUVIHT%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043627Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHCJB594kBKhH6krxqlLbCgsABTrX3TF9tXeo%2FUfmJC2AiEAj0Bi%2BMbiK2yushySt2190dkKbPhZaC87%2B2ZLUayvZF4q%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDCLXI4kkzN6fqnXzOCrcA86XrX8WB1Iq2qWPYvN%2BB0Hz4pz8Kf4sOyLAstt6T3Y4eAuthQFJqBkRmK9wcX17J4MtAN2schRDeAsm3r18jQqohsi73SmFfG4jCAux7Zx0cD8KgF5eCs1C%2BpIf0oWuhO1ozbi6tfeHeNv8sq5KdxhoUSLTNuQySyV3xysroD6UbRdicwXY%2FQr%2BF1mvkqpDaj6RxvztX2%2Bq4vf1B934pJ%2FjexsJuZdAM1%2Brhcv4QA9SBiWsUjDvqRd9GdRtm708hd%2BauQ8BP6iN8vNxKSlOfCYsZk8fO11h0fDbdpLOS9OHdWq%2BXKmj%2FHNHsGfDq8P4SWgQSVe3FshpoyTntAYeq%2B4EjsHdD5EdYGqTWeM4umjQq6i3mIrkIQ1gFVVurNoE962mqHXrRbC1JgK2KQu%2F3%2F2bgJtwBLUZSPQLu6uuLR5dlFSdPYbGcp0WBU1za1%2FOVgua%2BRBJAhW87vbnDYvFnqhN4F3L9BNuG76eASMlvEeepalNsMiTGN5Xxxr2jiVMgtZV2HGI8HFeMgGOQTeqoidOEh%2BHfnPURLZSnyyXIiuA4YhknqkVmaj%2B9y95UM%2BwGSf5xtJgMNjX7c%2BaykHoXLkie7bNsHIdnmE07uvvcUU3U%2BAcRWweADpDaO7HMMv409AGOqUBUlkdLzysAkfz9BISyIEDUCUdblN2BE94o2Q8HIpMIxrlnP2Z8eAQT2LyDSVvUiX6mKkBpe1H3FY3Dxj08bwqo%2Ft18lP1AQeDIQsd2HzZgYaU689TVANMdx5sAMthamWr3Ns5fUWMGpf33wQgvXzHNaAhZjyAJsNrDruHTeZfBca3GMoRz52hID3D73JpLjh9qP9ycmdG06v52I1WkkGwkdhY2pnA&X-Amz-Signature=7dac3028baace063cced156de2eb16aad30e879ff73955e6020746e686640c0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YTTUO2BO%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043628Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCxRltjDgO3bVfFzNJI0PzhHaRvt0nW%2BWrCg3Ooh8xSRwIhAIr2rMegQxhPnwF8qAIO3u2VSR1Catb142m6v%2BFUVDOQKv8DCHMQABoMNjM3NDIzMTgzODA1Igz5sxhuT%2B%2BkWZKdtiwq3APkHipe%2B5U2AZLJYhk30r49%2Fvppj5wKNTve%2FF2dw2ItspxeSuyZ7X6cqNbU0Qkda%2FWiky0ftNzhaKHe40YsSayUoWxSWhifKC01KYvGCRfSxc9%2BEob6V15pKbV9cL1%2F0unkbAlreLg6HjlWMOZsZceCBxtBFerIQ%2BElnrpHhLaA5tQuA79Yma8cIGyxT%2Fs%2FitsvWR04AEL6psPXNwt7yG3oaSZbtTf7Jd7abMW8pKEnStwy0kgZG%2ByHTgjkftfmEDt8xbARXR%2B3cMSXLgukPGR1RzLUqYQRyYMlduhHHR29P%2FPu7aNngobDz5jNbA5GP6HmdZU%2BS9Xdowx5%2BOJvh5RLLIC7VUsliBRMcgOvMp%2BY9njOV4Yf11vAFVnVY7fYlX5D8MZNKk2ewvB61hF23vYMZ0UyCKXRyoOwTAM6MCrLVOXyC0zzq0cpnx%2Bm8M%2Bc7KBq%2FDjhyTS17lbt6ev6Z8XfInFSyhUruEmhgp2E6nP1z2Gk6lnoV%2FGOeYkEaQB6pDr4th%2Bk9%2F%2B3%2F%2BG0IiHW7tX9NYFlQjeSAsnx050lSPLqT71sknQHl5HQMFK7JD%2BVcIDNTZtnJ2xqkqA2RDwMcULrMJ9B2az%2BanQ7EvbMcsaE%2FDCC%2FN8yeAA%2FPrrU%2FDDI99PQBjqkARQTSh6mYflvFvNgjDoeJ8CmWlZ%2Fx06p0PvbmjcZrnlCJIeLqyoWtb7PPZEqwHUTivzYVHTXl8gvcO4BlTDCUTgwKuzOxOWaktc%2BLGsoGv9tYKWmaWxhTcdNcOlgcoyKaDdQVqhOUfVCSkAWa32Tp72yokuJbNP2pDW72fUCG%2BsNzWYidzd68Sc9KICaY9k9MeL8SnMsSlW1Tisv3ZduNZPkyJeg&X-Amz-Signature=1ed4f1f32edfebfc5d67ff4248fdcbd13cd54406eec3c45a2e9b9c8431161c0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5YVKEMF%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043613Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCxMo7FA5AzaJ5EShEyab00PykLBGVXix5CFJM8sYlz6AIhAIrfxUK33QAT4Du9FTRcm8bLSpG2NsRRKoxodf01VWfuKv8DCHMQABoMNjM3NDIzMTgzODA1IgxO2zbiCQFXbLWwiQoq3APC3Iu5GMAJGvDqDOf0%2Fm8j852aQWm22%2FHieYWloCP9zOZ7OhNiEb49PkYjsaKYrY3LlXdSBkiLg%2BQjDwYhz1gMIYxUUkUeegCVCE1JNrpR87tvS53ZJ5FC8X0vWbnrx6gPHznMIc7yj0sGt10T8LM1j4vtRodNDY5hDvKJRc%2FBmP9UseMi4bvuk5KHgqaBJ3zPKhR7bKPU8ROHiBW5jYWu3HF%2B3I5m%2FtqdYVlW3MA4sVB6%2Biw29Zm%2B%2BxfRuNGocwqc3cMnQeHKtXMmrMAnbkzMVYlf%2BddENw5sYkSkm3e0a%2BiBFIbdZQN9ab91I27Tgnr0YAevknF5iSOECibx%2FLpN7vGMG1nuAerUu3HKE%2BBPG6frdehFmsIWFT0BpRLb%2By6N6n%2BwycF1dSWEvMeE%2BTiYNLo68t%2Bgzp%2FjN4dAHoKJRfebP%2FgUwW5O3zSbcWvt7Us2Fscp9hEqMT4O4Ugg9eXaLk2DnkRZ29QGSWswbR6bJRNGTmne17VMoYQpK82Nhm2UAXaDP4mXwUVdEY2ehYeYGPszT8ZwCWF5LZWxdCjVnN9Cec%2BNT4uhL1Zht433BauVk31CI1UR5roOqQEMZKKMbou0jbWy9RRzrtqyqX53aADZq9%2F8Tfdke6lUSjCr%2BNPQBjqkARFC%2FAd4Tn4hh4EW6ia%2Fw2xWqejZUjY6miInNj3kI9JvDZ7uaJ9Hx12YHhAnIwo73%2Blshet0LBRwKTqbmoazFqxR0nKOrF301f3KY9Jd7JNy9wJbn7gBGZMzmohdZOUowE0v8%2F0WJ7iBAFYtKi%2BCMlufWsGw7LAfVdGMrnN%2BuHXG7rKpBoAZE5ATTlZI%2FFbFlzGGDPPl0RHf4enC2IIkr6t0itN%2F&X-Amz-Signature=6766d81047dec538d45314c831019bf2916305937e0427ea89c4b4029b9aea2f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
