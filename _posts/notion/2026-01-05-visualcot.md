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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWSHPI3F%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040055Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF81%2B4FIuYaPZ2LRb65u30INTe8KZskXDhSZCJmenGRVAiBbufXmxiCBQiJTMwtZQcKyvtKTOh4iv5RXF9mMY1sUXCqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMVU6MmV5qC%2Fm%2B723mKtwDyD8Qp7MQPjxz%2BDcWKSOwHZcjK4yEriz5FxrHVlEyzXyr5h8ojcg3xYLrHr2imHKmKaLVTMJWdsqWEXHP6Ia0o93E%2BQbuaczkC91tiV6ay5TP2D3HMuAskBMmvSKBk%2Fvmr6A%2Bya55C44zBZJYPeN36sGOzVL0%2BbHdelvyM1Bt7AOt0JmduqeCzeMiagXCTH6DqmKGGTfZppooSm1arf0S0SUY87nhFKxG9S6pRZbQDgCukzO217KQguIXlmLFhoa543tQsU9EBHre6DItYeQNn9sFu0ASpf%2FJcmSgFiudkojnWraFiNcPCTF4qcEtt%2FCPvXEwoXENODt0L1aWaDPBL%2Fg174rx%2FQJ9%2BajZEN0Tqv2qfPjXTCPFxp%2FdCKlHNSpXaUfy4dg5h84CY3ikO06rB0U%2Fyzs3I3ddEPhrgoV5ty2lE61EViq%2BBPk0YNYw95KECgMjSQDiVxAeCjGNLO1Eaj0xPur1aWazylNoACtLsPYg4OAZUQUMUZMkhQkxGwdMj6HR6DbRbSdr%2Fi6BIHiMDKe%2F%2BWpHmQNWS%2BPTrTVDKgGIlNINsiAZxQ1GZ867CSN81NoGEa7p3eFlJyDBni9smr0xHt14QsG6XPlqsXn2OFjGVaxDjMDf4bk6%2Fm8w07W7zwY6pgFyjbaH8ZPq9YuwVq7jM0JNVFwBJznG4mxOXme%2BrGRC3ZVE05dZqDSORQusSTwxVXKHI0vwVawgReIoujP2MMBAXwYrq%2FPHefV3DAlpr3Mzb1ZQq%2BYQtJnyv6uzIGE5b6qjR34oVnhlofO6%2FWxk8sRp2Oz6rylDK%2B%2B8LpCH5wHPDJC6OibJcwgnaCKH3G3F1lblkaZayyiXtrqaBcUQBfwcbAbNQdUD&X-Amz-Signature=4791958b55d1c612652af4b7047cc00201314cb0ef831bd7601147081cf2b9f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YJF4LF5D%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA2lo3n3oR9zOX0KPqZGcNNyr63Pgv%2FJmjyMHypCJ0qwAiBMeaNWeD1vgbTh40zwvnuKGo%2BWRDL2pTTYyzp56LoiwyqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMMwqo3YoIMjNUKoLYKtwDP4yqGILrFm%2BTVtcRHF8ZRe7zQFuDgaNr%2BsexyFFI83F5liKEbIaTykESPLOdkUfPGf22WRClckEGLn6fLFNefzsuOWvJcqR9xvbuc%2FcirFnCHlBt594038IF%2FTMz2HVcMkqe%2FT2YOlJ9c%2Bn8wBhhuOwtwawlrXQCDhI3ZVNF24xVpenOpuNuKwgRV5my0fqw60QqHAEYxzyxfWoCgXN1bqos8RBYI1XwJQGg%2FiZfGtDJ3%2F%2FGpxGEWF1XlwCcCBCTEoK4Mu2WuwtkvNsHjN6MlHiRotU6Ch33EY1POTKFZPQ1S4ia4VK2vBVWBqsKiljwzu7RZ2m10Y7gCdEVKL1Vyi6CQNrPRPxW31NvCm15OsfsmIz1v1%2BKg1gLHVz6W6P4ZcQHeakhTeCNiQV%2BOteo3Cv%2FPOE6SdyFTYLX8JBdZlcGtblIMddtQvsYOIkAsiC9aVFdsMVGl2gW%2FlBbwShpW%2FVU0tyvWq%2FveUsIomQzT5VfkMmElgBThqyvaO2SJ%2B2XDvXGfhS2fE7xB5U16EVu%2F56zFYgEJysA6rOnWhnmKfbEYctliQlOOjzAFuEC3q9imndzEK5JGyDSP8BG6culqfegMT4tKCHLm9FWrTfeZJQiO1jMvX%2F9td%2Bkw14w9bS7zwY6pgGPD6PeCoRUTuaJWpes7k8QkYhgLr%2B4BcIWNyIhfwoOvgJyVonaGgizQQQrcyTzB%2F1q7eHf1DBykQ6NG%2FgJMgjNmrtFhaHeS6Wr9tMCOgCOTPZhBIpTslddOOO6hTIeKhO6BINEeu7qvIv4%2BHdZEkGOfXksDG9lZLPZlLI6aYLEIS25Dwv82UOg2pjUrrxBkCOQOHTFUysa9OeyC6umtgCMbLeG9qGy&X-Amz-Signature=bb6253b18df5d905135dbf160d0d7d1e00aeef073ba1be8708787b27902e1851&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6WPOO7T%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDn7YzGhgTl1hNuTU%2FqeG3fKVam331Jh71OpDI8xGRyrAiA5MEfCIiItJs7a8L48vgEoTGPv2OdTqo%2BBXvhw5Is6ASqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMls8gdddv1QFopR2LKtwDYI2npCRmKV8P28ePru0Z8nGKNDxInvOoR9t5MbbxCi6wueWgsx7G2G8fiosgoba3f4iSed8yIqo70l8S6IVOkgUctOtTzDF6m8bvhTQmbXSqHJl%2FBFsoNRpcInZbx0JdC131amzEeHsGtJKCK0ysJ7jTAy7dIrJHWB5HFW55LhMi1QdRxQS%2Bfb4UnCxwKps1G%2FJFjD5ikdd7pEGhcvAVuvq0tFJRXqqjJDDw84s%2FqGhKF%2FyJWoRDO%2BGdpRiWrSIw4RhgaqWT%2Bd%2BoFOOTrpDpHesscu6S%2FoIQ3SI2Rn%2Bg2sqF7vniTsq%2BY0D1JKF641NJlI0qey0%2F0to0sEicQoxnRorjv9YCGYQc%2FIEeSFpFb32ymiF%2FUIpNOMaUDYI83MSmGPtTByi9F6xqywnqe4CYrWcX9zs9Sm%2F%2B3EfghkmS%2Bzu8v2ZHYhxmShYekXmYjOQZsFF9gRgNH7wNJDlGs6P1SWXIrHLU%2BX2m4L3BOdk9h2of8nC5hSVpMnX8EVOQk3EHdn50AeEPaXOOQDBxn110N6s0MI9z3IVQC%2FBmOxvyND6%2BgD%2FE2sYvQGAWnWSAiemegVP5hbjp6fuPIbjBUVih%2F64VFOpGNyNLq2oyodOxGDKob%2ByrPsNklKRuMoow57a7zwY6pgEx0KzNnk1KFMwuLeG2KHzpiU3lhlHdoX7BUNZvIDPx2XYKsPdm%2BMUWO64bfKcz76iKJYRd5BpgKdmMxRLqbS4xEo%2Bdy7EP7AktYzwDxvhv2S3yBAIbE4nVHu9N8qXvrztq2CvUWDkRIOnzR9Lj8Ovqa3sR%2BUkvWVm%2BizxhvgaRiyyb846ZmPxdXRN0T%2BJ3ciELSQwqq5zecbr60WcFOU5PemrHs880&X-Amz-Signature=529d87231d79dec72ad3b927c4354b9f0d79492ff8322372786444e8d0537d9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6WPOO7T%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDn7YzGhgTl1hNuTU%2FqeG3fKVam331Jh71OpDI8xGRyrAiA5MEfCIiItJs7a8L48vgEoTGPv2OdTqo%2BBXvhw5Is6ASqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMls8gdddv1QFopR2LKtwDYI2npCRmKV8P28ePru0Z8nGKNDxInvOoR9t5MbbxCi6wueWgsx7G2G8fiosgoba3f4iSed8yIqo70l8S6IVOkgUctOtTzDF6m8bvhTQmbXSqHJl%2FBFsoNRpcInZbx0JdC131amzEeHsGtJKCK0ysJ7jTAy7dIrJHWB5HFW55LhMi1QdRxQS%2Bfb4UnCxwKps1G%2FJFjD5ikdd7pEGhcvAVuvq0tFJRXqqjJDDw84s%2FqGhKF%2FyJWoRDO%2BGdpRiWrSIw4RhgaqWT%2Bd%2BoFOOTrpDpHesscu6S%2FoIQ3SI2Rn%2Bg2sqF7vniTsq%2BY0D1JKF641NJlI0qey0%2F0to0sEicQoxnRorjv9YCGYQc%2FIEeSFpFb32ymiF%2FUIpNOMaUDYI83MSmGPtTByi9F6xqywnqe4CYrWcX9zs9Sm%2F%2B3EfghkmS%2Bzu8v2ZHYhxmShYekXmYjOQZsFF9gRgNH7wNJDlGs6P1SWXIrHLU%2BX2m4L3BOdk9h2of8nC5hSVpMnX8EVOQk3EHdn50AeEPaXOOQDBxn110N6s0MI9z3IVQC%2FBmOxvyND6%2BgD%2FE2sYvQGAWnWSAiemegVP5hbjp6fuPIbjBUVih%2F64VFOpGNyNLq2oyodOxGDKob%2ByrPsNklKRuMoow57a7zwY6pgEx0KzNnk1KFMwuLeG2KHzpiU3lhlHdoX7BUNZvIDPx2XYKsPdm%2BMUWO64bfKcz76iKJYRd5BpgKdmMxRLqbS4xEo%2Bdy7EP7AktYzwDxvhv2S3yBAIbE4nVHu9N8qXvrztq2CvUWDkRIOnzR9Lj8Ovqa3sR%2BUkvWVm%2BizxhvgaRiyyb846ZmPxdXRN0T%2BJ3ciELSQwqq5zecbr60WcFOU5PemrHs880&X-Amz-Signature=0be5d409d8808a245b40725a1b5426bfadf528cce3b0f9f577306eb6d269d38f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664PKMWDOF%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040102Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKinsF1bPVzTqGpYmq4N5BnGnqmfhA%2ByxjunWGGScatQIgQbTXJMC9KbHLquQS9jmcQWD9%2FfrsjMrh0eC2sZhAQ0YqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFmqOPoYJ4wUQiX0bircA0rmFkeirbvkV%2F6igL6af9e0RjFlI2IltajH1XXXVjqUG0Ov8uDeOQs0Km2WyA8AfbtxqH9E7H%2F6Zu0LmeCaqjAfcCzGEush7JhI85UoCk8OSO1CF57uLmL2mEe8qO%2FyXF0eIODMdj7IqObW2NignATJYTHcsXfvtOnsJCG6Eoib2OHGCnDrBnQ6fgC5M3mvSXCKhgQZ%2Beu8EtkgwsC1qHfXYeUivh8WjOJ2hXJ8HLiPGYmsZcgeXeHaar4D1LK8cG6sJ9o5ytR%2B6FPyt3kEWhwJr9%2FogeVlvaC0ahZKzzbjYS%2Bf0sEONm2rru7ovkeB3KHXPJzZ7f5necf3XswDyhx3sV57luXb2%2FnxCJb9elw%2FicWNGzanVh2JFALOT7UiwDWHa1zOqB8560IXKIxFTUbFSY0zQufNz7EbJMNghAWKitEpDFOKqHMHCspYvpiYlb6xoY4cKxHnTIF9EBflPrHj8SEVDr52dQLSzeccKB7Ygoz9QtZFqNcQmphxjbT0mp03vzQ6g3HjhvFITp23%2BVVzffYxC7gfgzdhW6hATi2%2BWSCLisaxrHOunwBehGYxGahzHIcVJFn5lDNPVGBUpudT7Rws05l7Cpu23M8fu2ECZE%2B9E3nnr1AF1qQpMO61u88GOqUBGtF8mKT8z5rb%2B5B55pfet4W11YRN%2FXqbg2hXp%2BCkE5%2Bc1DNxgclZVg26rQDd5vEYdSGfkw7MCPyKQaMfab24ycCKRO43LfZLZl8U%2BQuQuKiCzBHEDC3oL9EYDgHzH%2BsNv8PBGykJcw1VCnFP%2F5htTqEW03gsKvNRCBMcCDvIZLK2q5pDSPtTYGp7KT8xgNkeaqmASwZX%2Fs9wtFPEogoRgQtIw4Bt&X-Amz-Signature=fbd154d2ae29acac34bbfb10a0bfdb2a6bdb84223aa82321da2fca2cf111580c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZOQ7EVDY%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKd%2BJjMBeyX9aKwMFCGE45L7wEGBZzQceYOVppJ6BFegIgWGWwsWFQ5cffRtURBOyDDjsuLdlwj7ghpsLu5n%2BXcs8qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEOl7Qbe%2Bu03SggI6SrcA56CodaEP09NdPq6CA06lGT2b2%2BcYFDmkOsanAwPCEub3wIsLq09EQBmdWZPwt7Xdp5oB8lGFaiCREDU2FesMeOlZ1M%2B%2B9luGVnMYnOdyQMdlGx9t0hjhNQVAG8Diatf4ZIUhztoQl%2FojRHccj4M1YvXOYX%2FHLUynI9GLDpI4EfNAVHFkZ9OWexHS4RpP%2F2d1goK1QeIxj8PkNXRGsAcbpF3CCDRMcl1KjwoaR2SDlfz9YA2Gq77qay%2BLyQYLw3JgI0Mh8Je2LlZJkcORw3k9SZXpnOUF%2FY2rGk7JkhUBh%2BbnOYY2IOwWvxsrjRmptmNFkFQQ%2FQ9clx9kLpAWPoAChB1IxUZ1isBu9mbKVYK2vGfWiFoYgAWVHv7E1PhYNuwfYxXyQgzNmv%2BdR2P0q5W1PJNRMniKoC7rWc3Md1cE55s4wQHSE3GkDQ%2Bkcm3n4%2FkwvVXLUw1QE0oWrjaWl3CO5Lt%2BzknfqQADZGgop9otHgizemxJNTaMUP9le0q0QcY0j%2BpGUZuWtt9RZ%2FXhLR4znQmlQ53NJuMKGrfYD%2BgNLLXfaHS%2FvIgRuFWscKzK388IEFE6VOMP%2BjdmBVQNofCr34wE2g46zQ2RRoWjb%2Bje4SivISAbziPR2R%2Fcu%2FlMNm0u88GOqUB9zU9X0OLM4MCycXvtttxO%2FDQbHu3WDm2xC40%2Ftz400J0NL0so%2FMhh7KFuldWhVS8BO1DtQ%2BQwv3BOp3cEN8djuz6OLhrz1RMCXBzX5lqGAYbOrm1rFKL%2F5pRsqy5HW0H%2BEp75ubWua53%2Fsf11eHUDFNijH2WjYSc9k%2B8H5v10gSALCvrhm1a39lwSEI2VCfO7Efk6dCorvR%2FbX9KAvy%2BOqyU4KyC&X-Amz-Signature=0a3ee625227752cc2165bf91159b56504ebe7ad3c9fc3a891b0f8dea50796a9d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673K6ASQG%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICXOqjMUM%2BQ75OmAeGGrqik%2FQCD9bq7ENYr7ntPQYGWpAiARYkCt2g1XOeVWoYHihSTj4HkoLe%2BoI3znhV%2BKp9di%2FCqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMjGBhQbtnpey14fPsKtwD2YxwErts4iY9JX1ynPwd%2FKYqPdrHO%2FPJnXME3OhIYR6mGhpuPUy5aX9OkHffXpjuNLXj796M09lPTQ44JDmqIInCEgx%2F67Us9iBCDb34fQCWf2WmgRAsMSkEDlTq9Fnsb%2FGzMpMhebIXfqt8gBqNoPHIeiuu%2FBl6jcGow4UNMQIyAkitgvtqHgrdQQjkut8naPg3chsXOOQfVbteEjrImj%2BMJVLnlLIlcKPHBCHwXi9v3h3FYuNhgSFfR6wocyxmK1Y0VBlfmG43cNJ%2BsTPh1WnhcJwfLXcojah%2FRYZ%2B0wFLTcVsmb5Z8MCWmPQglws%2BteDFBk7tgQE8RCPmD%2BFIOzJznOfFjUFFVPJpVZaDkMbJpq5Jcgq9ivEHAMPbeQPs92shyylA1R2ZSMoOF6yl7ywrpcDr17%2FYZyHrs0e9zUbYbMq1RPfGcEaWgbO86bkp%2B8%2B9EMaRZLQ3JiukYpcT4gAKqgbdEviwiXi5M%2BrLhI16HJaH17BOLutfaHUotl6RB%2FXfAnjxU3bkw7CDdM45yrA2rTfyXi8KIg%2B8B5iNI3iGV%2F%2BxdEgCsBkOSowBUHG5HgV57EKsQDcCnYR0IKrKlhQ2zQnfRIc3UPEHxSo%2FDhf1n5MjbZunIhcsXKwww7S7zwY6pgGhRflMEprT%2FNHk1hqiBnhW3IRqEqhs60O35wN%2FvvEECIp4MQXXfpV8ju4W3cmiioP9JaMhkHGMbNHnoT4iHw2Rz1my2hA7vc4JYTnotahFOmP3l4%2BcoCBTu%2B67KgjKkoHAWjqhmcKGJo3SOF%2Fn3rblrnaVm%2F7CEpSbk4R5RGKjVYMqEaHWX2piVNknVpYD%2F108MXPVMefvAJ1DlYPuqZ3RfRkzI50j&X-Amz-Signature=a37b98b313af2e2d542b144e0d054bffa0cf6830f05245b12ed752a4c183fd79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666YVFWO2S%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDV84iOvUApItEDKA4cGrqTHwVCY8T%2FnSQ4FbiQXBM5mAiBnRN0Buf9wd5yWTBLVKRLXFlDGCgKA5UltfKRVgriqcCqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMj0s18LvqPH21LpR%2FKtwD2%2BVoTjfp7xOim%2BGJOfCsgY4hVhP%2BXicy8ibfRCWcIgk%2B9wXg%2BC1cGb6VeREQJl%2FJj9fsFalq%2FYxhZke5I2TnFEePOvtgWwJpdpcPZk8eGtrRmrrH%2Bbub%2F0K0yR%2BjLsoDUPJv29wt5h9dP8jHG7gyFBE8dIu7wT%2BMRCGf5CGb3u5sOWTghhLIznl9CxmvLUszOFyZFY4gELTfnVmZ12N%2FpdO5Ion9RCY%2FtOWal5bgBrBL4A%2FkgpahRs6FdNaKGj2O9VFnjNGT11dDTLacbqwBzDtWSA9hYW3OyQh4alqScjTY6lmLGwG2XJSviVlgfWuQrLwAKDczB5lvMfHLKLHPqGUmsZLQhRrIpQBytEVGgSLesKRprc4r8Gix9QXlUKV8mU7ZLFza5snYXHGc9M5RJ8o0MPmmCkthffpiuvHOjHmBUoowEs3ciBbjb87D0qYMCCGDDswwySmMpaLfdavAEjARVsws7svfLB25rnaCIwa%2FbFKV7B2ThczmPSiKlt3wU5MyP98NIzSJ0PgizKxObw0%2FJ2XxqRzFu2AJDy5DKWOZUIsF%2B4lt8tUc%2BXQBggMu0okxStuFIZY6UGfq0KMFC7tBcc3b6x8PZKCQnCOt67m1%2FFoNmXPzkywlNFUwz7S7zwY6pgGceCnqfG6dxP%2FFmRX7gq1wD1FKtjb596NEBWi%2BsmaPrvT49x%2Bx60FKiixSEVbnPdRsJ1Rdq0OCekRDEYc1p2f87M8x3F1QqXo9U3DoMZ1cs65VO7Y6I9dpSsuHTrObbGuzvFUQwaw6ODdtCKRUTxdk3dFIKr%2B7dbfrMvePYiMvvRxLcMMtapfzlfwdlLyMQwrdCm6JAWuIYbhkAHgpPWbjFkV7ybsx&X-Amz-Signature=b30db23c9e41bf82d5b25b85b9827c3ce566d03ce9c7ce9e00f87abb3cf0c1f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QRPED7CS%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040105Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDoJKXCn1bJ4HBEW2PoFQ48hJufJUPuhuHpkLhvowhkcAiBv5AS3K4DkDDAEDa1biQ1zVCb%2F%2BAKggOrmkz2LudOw5iqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM1eNj63lmAwDd8in%2FKtwD2%2FiGp03XPnuoN2K4Wyv1maNHplWUtBo0rHelw5Lva1HknaKZdzAO5JyHfcocHYqkEjBt6VyJuounYDOszTiZY46vkWFCF5Zb7kYk%2BvCerZrBzPU%2BM5DNLl24yjtdxQKPydRq7Ae4rgJC02tIOu27l%2BYYtiQWMJ3ObIGBRRVdSfFr5%2F4dEIi7PFruHrhOZVgzmIS7WH5BlD25x3SRiNZOMtEpvxkAg%2FvwrOyzYBknikGwDoalyJMrJf5JFSjzUdFo5pjyYy9gCDVeKUKhda6vhv7nI6V9WQokvtkOmROKgrN5DX2gxJJ4ED7wVTncVuVKMuHr%2B0JKJz6yupjDup5a%2FLEvgcanwECkmUgX2FkVe41DmLt35hyLAJqZLSL9kBikxltaROKENvNipLAQJJtKT4HXNwwadC2dEknppTTnYlznRFVCfdA%2FYcE2RBl4YUuQxLHupbuJNHzl53v6f3oJGaRjlB7VLCvN254q%2Fim4H8uAzeWzJFYj7N9LhevH7H2abaiQbfIAdBCwiZU7b9MG%2BnH3F5oX3h7MfEgYggH5kPqE4RBe7l0m%2BIQ%2BGfFqC%2B2lFlbkEUE21zrnPd%2FL64QqBprkCHXJTMZcAFZEIrZcV7fs2dWfZ4yi1FQRPOAw57a7zwY6pgH4ylmHeOhNTVb%2F5O4Lk3OXVudV7pP0CldmhO18ItPP1mqPVnMjeYcXw0KyWZVUJT6MXuZeteS8Lpl3xiqIL2YiUy93an5bdilcmXVHusAKedoMNXiU0XiU%2FXQYIoMnbEia39wk6GEmwfbgzJrGWyNqIr1K1VrZaungXl6%2B%2BaK8gxq8801aactJpkEvkoPL2DVrV4qAakivQXef8NAOl1Lm5dNrs72q&X-Amz-Signature=315be6431f7bc0e11cfd9f664e3e872836e4edba94beafe58d4be3a006681433&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6WPOO7T%2F20260427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260427T040047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDn7YzGhgTl1hNuTU%2FqeG3fKVam331Jh71OpDI8xGRyrAiA5MEfCIiItJs7a8L48vgEoTGPv2OdTqo%2BBXvhw5Is6ASqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMls8gdddv1QFopR2LKtwDYI2npCRmKV8P28ePru0Z8nGKNDxInvOoR9t5MbbxCi6wueWgsx7G2G8fiosgoba3f4iSed8yIqo70l8S6IVOkgUctOtTzDF6m8bvhTQmbXSqHJl%2FBFsoNRpcInZbx0JdC131amzEeHsGtJKCK0ysJ7jTAy7dIrJHWB5HFW55LhMi1QdRxQS%2Bfb4UnCxwKps1G%2FJFjD5ikdd7pEGhcvAVuvq0tFJRXqqjJDDw84s%2FqGhKF%2FyJWoRDO%2BGdpRiWrSIw4RhgaqWT%2Bd%2BoFOOTrpDpHesscu6S%2FoIQ3SI2Rn%2Bg2sqF7vniTsq%2BY0D1JKF641NJlI0qey0%2F0to0sEicQoxnRorjv9YCGYQc%2FIEeSFpFb32ymiF%2FUIpNOMaUDYI83MSmGPtTByi9F6xqywnqe4CYrWcX9zs9Sm%2F%2B3EfghkmS%2Bzu8v2ZHYhxmShYekXmYjOQZsFF9gRgNH7wNJDlGs6P1SWXIrHLU%2BX2m4L3BOdk9h2of8nC5hSVpMnX8EVOQk3EHdn50AeEPaXOOQDBxn110N6s0MI9z3IVQC%2FBmOxvyND6%2BgD%2FE2sYvQGAWnWSAiemegVP5hbjp6fuPIbjBUVih%2F64VFOpGNyNLq2oyodOxGDKob%2ByrPsNklKRuMoow57a7zwY6pgEx0KzNnk1KFMwuLeG2KHzpiU3lhlHdoX7BUNZvIDPx2XYKsPdm%2BMUWO64bfKcz76iKJYRd5BpgKdmMxRLqbS4xEo%2Bdy7EP7AktYzwDxvhv2S3yBAIbE4nVHu9N8qXvrztq2CvUWDkRIOnzR9Lj8Ovqa3sR%2BUkvWVm%2BizxhvgaRiyyb846ZmPxdXRN0T%2BJ3ciELSQwqq5zecbr60WcFOU5PemrHs880&X-Amz-Signature=9d02478999ad5a7f4aec8feb60d2e911f5badc48a01f56527a8909b833f12914&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
