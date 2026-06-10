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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKNV4EH3%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQC%2BULqI36neaaBkuVYBngAWj9WUjU%2FKcBiEZhOwX1f1xwIhAP5COsfUdS7i66TKGQebXqsItUzXvzIa3b5qc%2FBl1pdfKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyQhwf8uDIxOnXCy9Yq3APAsCaEVcaoZKU%2B6PGlJ%2FztmzAvSjxI6YeBAEFlu5oqxw0Y6b%2FdL6kzwxs5GI6ZC%2BvUKTF9IeGAj1JSdjjx2xWrXjrGILBGUR3qvlXW1nGq0VgRAGM67XUXoszReuiCByOe7ZbClNA6GdJiofcNamKeZ0wgbDnlnqnHEe5doLjBChwkW%2BDQgnbT3D0PiJO1MkUheSm2LK2D57rNl07zaOO244WxY12nqMUigoCQyAIXbaFjk7KG8%2FRG8XmYAkn04ZkdGBchssQw2pxP9e8mStL7xnp7W1Aush91FgDIXGk%2F%2B%2FWCdN%2FlfUvIS72Ax9dL25jmg9oqwEko7iyCUjXLx6uP4%2BR6myaij%2BMU91vRvPa0AMKCHQugnmbMbEmsBPnjRGTHTsHYiis5k7TmSCHuBALbnqTYLCZ97WKdiWjQfv96Tc2HTmk6s28DpM6%2BZRs2H3O1lEu60mS2rr6iFEPHPW8GtVlbdo2gZ1yGbKGJIs7sYlgFRDulxan7FUoiW%2FF0pJimM4hDyqKjpfAkVnQKeG4TXhTV7143O188a3%2FCBN%2Bk%2BUW7fCO%2FtqqTxZDF4eqNk%2FYIW6sOs5dRzUJiNBiL8DDD%2FUA6y2eIHsIrhxPGlCsTYEwmyCWnd%2FvvKw1iLjClvKPRBjqkAZy8JETNA7JjUFkp67tnaGzWajgeyzE5HG5yZWbVpASiZQFVOneeq12d2fV6l7F4wqTFtg%2F6ED%2F1b9uPvO%2FN9OLcJyNuXRkmOLWQkgAGAabBXzohdmLfnlDiWd1egeID2%2FEaapZ3vhOfIWmb9pvdyPoI3m1ErCQB1Kfz6b4t1eBrbu51Xw5U%2Fmg7TPlxMQmimLn7KYw9Kjw87juZJuyvc7yQ5xUi&X-Amz-Signature=b5eb5406166c2953d2a850d7be96ce515be87d9ba7b6ec877c3b731c290f49e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UF6UE77W%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIF0cR2ooUOLMdO0WDNDiiSRbsm8oL6MhwfNF%2FgqE9ByaAiEAwAUOOQIwU8Rs32AtRwstqVmSHmu6jX%2Bt9x4dzwuu1HAqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLPcNnLguO4WqNms4CrcAyRD%2FBB5j3PsNbssjef3P5NRIL9bVvGAP4HZh2cy1nuWx9AVUVyfhhEzvC0OpAqbbsMJabPl9v20yC3oXU1lS%2FF2VJ8p6QieoYzUL2a6BxgctkSOZKeZb7pUtuRWjKJKWJOMTPLvSDJBvTBTIslc42sY1Au2105%2FnYcRCr6i%2F6c0Ah3miGy1whk9lvJTdnjOqk7kPgdzlZqv2siM7JEDrvZ6S%2BrkGCtpaFXJGNHyMv9fI%2BcH9Pm4du7PwHB2IosrrD2GPsVLzEpfYDx3ribXkGy3vvUilOmKhVBw2LA8fOdz2%2BsZgPQrQeFH1RaZdwmVsnQJUxrYeA5wRw6mm2V0CCHvlJ5e%2BbccuNBmKHH7bNOOfAnPYihpa75jvPZzqVOYpGiVRjRGqUB1TrXND9%2B9wNuxddJB1TlL5LsNVTAxa72OB15pcMuH70v7cbyARB0yayV2uTI6kftQ%2BLfLFkPqofz4ZoVyE4Q3QTE7EXVxaL1hovM66ik%2FA%2B%2BokY3JHhUwJvHvGxaaM9QmAqbTEsDxKq3NxOPw8IUfZB9s2fVIAd8QjVSYkV6qAGAorD%2FQKcduKRw%2BblLz5KFjuFFhY69KP1YHHQR7%2FMLGFpRkD7cSzBMTx67B%2FjFncOomWJjJMK66o9EGOqUBLBxYmWYw4o%2BJyxhILkvsIUMFBETE%2Fu79uOD8P%2FHIIY6tCkB%2F1BQmEvJYBGQn%2BAIuQzxFh3DIJZLzUe439ICsfntkbgTFMvTzPJhSeuN8Gc9pQNN%2Fa25xZK3f1q2ExHTCtSvzntp5BEa7%2B5K07%2BAdpoD2nvQTQk4GeLQeRoLP%2BjuhN99wila0PYBlW2TkH2CYaacm0X2iDVLe%2F5owk1ZCC%2BlF2cpl&X-Amz-Signature=890394f271653fc2622b22eaceb879e0a3029346a4dc3b1cc7e3976627e5eb57&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXZXOXE%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCou2JmbgBdQHJwmDTE30Nt18wbnOsB73GUCWIl89rclgIhAIYiuwFfz97SBpENf85%2BC22cdSuPX7F%2Bckm68P990Bu5KogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxARTMHhIoBYEuxgYMq3AOmMlpudN%2FQhC4SlfitekZWZPlpffPz3p61NA%2FHep60ejWnFKxNH70kc2WT7OP6CkhUJSRs6BYG6c8tiiMtLasiywtcQ8wWErf%2BQ35kRB2bQUydO7yh4VM2YFifIvMGVqdJZftDBIrANDF0gxmPOoUiLHgQFPkAl3bTUfWKhnnZPCVs9YKZaG1gVju1ZeULrAGwQqC9PTuAoMv425T0B7%2B66BU3HvZSVdem0zvvKhT7q%2BNK9hdzQidxjkxYq6mSMI0NjPDnnzdqezqkHNGjFjyzud6EKTwULQc0va9DSguuJk6wRwS5%2FZwi14wJToXm4CRSHNj0iX2%2FA%2BNzBAv2QxLHDlOlZ7zZHxyuipSPgl%2Bk5cY82V%2Fo9kKJDTRvzaeHsTWdaibkO4CqQGYalYfM%2FDaB5gxpujZNQZxDnT%2FMYcXo8Xk4y6CBbNdExMsk8RFzPDl6ZdEK%2B5JSzhtjqwPD38Trf%2FreQvQHCgCGAQ4tDjzPs6HAMxVyP76f%2F%2Fcb27lb0xTztG1n1M32Y8oUPOi9ThGtE127pbnxRK62c%2BtHvusQ3A%2BuVSIycsT1AEawfIb8ETtZ5f9UoltIIlupizXLcrY7CUxwYzz3s0CSkqnxhMdz6Js%2FOYoaHZQKXKlxczCNuqPRBjqkAd%2BaF7wdFIQEuSTYDLbVczz4oH3h%2Fr6yQ7iMQ8DtjZ7mrqVEQwYFM0FM73rmp%2BkTUGU%2BXU50fVsaTp%2FIQeqyzvmtpNHa6Er18YsSI46OZoiCSXk6i067Y2%2B0cd8uQcnPzhbmIUhzkducOgIwD4w%2BLxpRS1Rzr839O8LdaoGZh0Wo6cwcfYCbi7w1LmVzC1jx%2F3i9Bx83sMKybKZT11C90oNmFFJL&X-Amz-Signature=a797f885d5aa2f0efd8b16c587d41b6b9b8316cf505b4cfc552be4131c8274b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXZXOXE%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCou2JmbgBdQHJwmDTE30Nt18wbnOsB73GUCWIl89rclgIhAIYiuwFfz97SBpENf85%2BC22cdSuPX7F%2Bckm68P990Bu5KogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxARTMHhIoBYEuxgYMq3AOmMlpudN%2FQhC4SlfitekZWZPlpffPz3p61NA%2FHep60ejWnFKxNH70kc2WT7OP6CkhUJSRs6BYG6c8tiiMtLasiywtcQ8wWErf%2BQ35kRB2bQUydO7yh4VM2YFifIvMGVqdJZftDBIrANDF0gxmPOoUiLHgQFPkAl3bTUfWKhnnZPCVs9YKZaG1gVju1ZeULrAGwQqC9PTuAoMv425T0B7%2B66BU3HvZSVdem0zvvKhT7q%2BNK9hdzQidxjkxYq6mSMI0NjPDnnzdqezqkHNGjFjyzud6EKTwULQc0va9DSguuJk6wRwS5%2FZwi14wJToXm4CRSHNj0iX2%2FA%2BNzBAv2QxLHDlOlZ7zZHxyuipSPgl%2Bk5cY82V%2Fo9kKJDTRvzaeHsTWdaibkO4CqQGYalYfM%2FDaB5gxpujZNQZxDnT%2FMYcXo8Xk4y6CBbNdExMsk8RFzPDl6ZdEK%2B5JSzhtjqwPD38Trf%2FreQvQHCgCGAQ4tDjzPs6HAMxVyP76f%2F%2Fcb27lb0xTztG1n1M32Y8oUPOi9ThGtE127pbnxRK62c%2BtHvusQ3A%2BuVSIycsT1AEawfIb8ETtZ5f9UoltIIlupizXLcrY7CUxwYzz3s0CSkqnxhMdz6Js%2FOYoaHZQKXKlxczCNuqPRBjqkAd%2BaF7wdFIQEuSTYDLbVczz4oH3h%2Fr6yQ7iMQ8DtjZ7mrqVEQwYFM0FM73rmp%2BkTUGU%2BXU50fVsaTp%2FIQeqyzvmtpNHa6Er18YsSI46OZoiCSXk6i067Y2%2B0cd8uQcnPzhbmIUhzkducOgIwD4w%2BLxpRS1Rzr839O8LdaoGZh0Wo6cwcfYCbi7w1LmVzC1jx%2F3i9Bx83sMKybKZT11C90oNmFFJL&X-Amz-Signature=74d67d18e6d4bdd98feb1c02084ae5bf9c283f96aeca43c2ecc0c8ccaccc2185&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RYTED47P%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044935Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCIAsUU37en31viob1YwXBjShiP6pK8DK5fShBTEi6YSZxAiAVNOhUDeKmGgqvjojoxYkFBkEvpg14DvKy%2FKzmMVVAUCqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb9%2FYoJnUoOOG%2FJCCKtwDO67yWsVkVG1gomVTwjyf5aR0%2Fa9Gpv0hYfSN5%2F4jw8%2FKPvOpwv6pSXpH4rQmCpKvgmJMSKuP0nfOxdrKwDkn6nVf34%2Fga%2FBPw0ciJe1kPURlYbikFC8hMBILhBs1thEWUqz22iht7MiPtl1HL89Fp7BdsdRHf3FGjJhdn5Z1H%2BFpgaLDF0XEh37krXCdTypNm1BFFxf5oUQs7FFPeSR1fRr%2Fc9yKiCSVFvaNvaBY2rxNCbIXHfDBZH20S1z20jB%2BJy10cjBCC6pMFVSNskL9b1UFmzbIoK1VlzcLY1JtI4VzLxevjIxE78ote3uNuO2oe20jyX%2BsvLTyEDY0HrujOnZqMjlilxxO5f0wbWcX8gfEaOFpiyg%2FRhntGaYbn69XiC%2BCe9RoIqOH%2BSQzz4BmIYPlqqQYbXoQj%2F7oSyNkFrAY4CowpqWGMT0OUySB2OKV5IjI5bgWcSjBp9AWC%2BNzTC2DMYBUDWx53mF8mnBdwfGYbNvKz3cN2lXI0q3UksvzLCTKrC6KlSOeafRXN7YV6Le2%2BeKwHrQKVwkQmsWcjxuGwzaSr0NwI0tDLR2P9%2FMODQghdy3WEpLELGi8XJrKQ4yRxzIsTgCANrnDIY%2FjFFKGbk2Gnto3kdy%2FHNQw1Lqj0QY6pgHU3jWIFZ5thkWgEfvb%2F%2F%2BA3ZTpRXWESmcVflGE%2B6Ubp%2BrnX%2Fq1hIzlbELLzrvvrT3ZD55LWQdf1y50Wlm6vNfZVSG35%2BYo9O7NxF7qp%2B9Cfw3t4IUjgEd1cs6w0WoZbSBz4OPzzCSVFggepg76c2TK%2Byzbw1sW8vt3BDyjU5BN7vLn0OhxsIqUtPy03xBsRaXOl4jrP5p5g%2BbCq77PWex6zxBn2gU1&X-Amz-Signature=c8e822133a7b81d7add32ce1ad6cc7916b5e922da3f2e744255b93e3aaecae6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z4D6JT3M%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044937Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQClGq2bTHeW2Pg6jYip4otzM54vbNithVC8rzjGRdZ%2FWQIhAKzzqD2C7fkXNjjDnA%2FC8Uz9JWn38YVSBRPIWgRqNeZtKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwHXIL7%2B7nTb1JF7HUq3AP74xgS5MfaJHszDdfVyVj7Fce8dOK9fh4fWpuz77hv5m6tNwUzu6O6N8onksK%2BcGvlMxf6%2FStoKwGxmyGupw9pjjAhYWZKyx7RaT8V%2B4GDpg%2F770WbfwN2c4RmA8UuLkIeqZYogJ%2FOuF1LfLFcU8jB9QxNXhsS86%2BAQ1mZbFN9gMnIroQb%2BVLoIIyPXYNLO0na3nwWocgrbhrqHxg%2BClLHaT9VhmtYE2FzcKt%2BTrGWmzn7OUCq2nOOq9z9CnDpYpdrC3r1%2BZIDz%2FzxAsNA3cbYxVWcb%2BXOF4kr8FEYdRhAMWtNzIhNa2qNpbGEMNYEukTPsOntdX8hsQpRa9gg5DcwsC68BtcZf3X%2BjfO%2BAJA0XKCoq6G6z6lTe22aSs9Z6ZY7I9b0u%2FzVqMTN%2FDbu4WwW526HmSt7FTTnFRsdqI2kgImqMohUOEu1mO2UE%2F7m1%2FjwMOVNUH2pBTj6o%2Fr%2F6eYxurs4SCHB9ng0urNEbcCNrVC4uyPVfnb2ayuJIYri4rzeTZ2VpFW0mME64%2BjJOc7aSuB7hWFDzbc1JuaOUZRHdfkenngli40r8rcxSxSNVegrQGlcuruRTkXrGdgjJOJS7A%2Fbc53A9dSIjnfOzXEPEuhXFFedmg2NNSIaajCfuqPRBjqkAUrY%2F6uwnUgWDcdqROzt0bIY9BTWxmrB%2BvSQEHC2Boiwy5UHmy1WoOt5WVRKOIydTwplcAwUGwLbyPL2Y1%2FSX6qdyYAebF6%2FNgWIBX8CodXz87Mc26vrJLbANCWn93nugMqsjlHs63kFuE1ZxyM%2BolUzIfe8djzdTn3YLrEBOd1Wb38DkUDkAkmarXyFP3CSVnnSD1rM0ihECgR88ZqznYni2%2Fj6&X-Amz-Signature=e8466b50794f93a29e3ef100bcc208326a28f73d4ea58c748710332162330e79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RYTED47P%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044938Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCIAsUU37en31viob1YwXBjShiP6pK8DK5fShBTEi6YSZxAiAVNOhUDeKmGgqvjojoxYkFBkEvpg14DvKy%2FKzmMVVAUCqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMb9%2FYoJnUoOOG%2FJCCKtwDO67yWsVkVG1gomVTwjyf5aR0%2Fa9Gpv0hYfSN5%2F4jw8%2FKPvOpwv6pSXpH4rQmCpKvgmJMSKuP0nfOxdrKwDkn6nVf34%2Fga%2FBPw0ciJe1kPURlYbikFC8hMBILhBs1thEWUqz22iht7MiPtl1HL89Fp7BdsdRHf3FGjJhdn5Z1H%2BFpgaLDF0XEh37krXCdTypNm1BFFxf5oUQs7FFPeSR1fRr%2Fc9yKiCSVFvaNvaBY2rxNCbIXHfDBZH20S1z20jB%2BJy10cjBCC6pMFVSNskL9b1UFmzbIoK1VlzcLY1JtI4VzLxevjIxE78ote3uNuO2oe20jyX%2BsvLTyEDY0HrujOnZqMjlilxxO5f0wbWcX8gfEaOFpiyg%2FRhntGaYbn69XiC%2BCe9RoIqOH%2BSQzz4BmIYPlqqQYbXoQj%2F7oSyNkFrAY4CowpqWGMT0OUySB2OKV5IjI5bgWcSjBp9AWC%2BNzTC2DMYBUDWx53mF8mnBdwfGYbNvKz3cN2lXI0q3UksvzLCTKrC6KlSOeafRXN7YV6Le2%2BeKwHrQKVwkQmsWcjxuGwzaSr0NwI0tDLR2P9%2FMODQghdy3WEpLELGi8XJrKQ4yRxzIsTgCANrnDIY%2FjFFKGbk2Gnto3kdy%2FHNQw1Lqj0QY6pgHU3jWIFZ5thkWgEfvb%2F%2F%2BA3ZTpRXWESmcVflGE%2B6Ubp%2BrnX%2Fq1hIzlbELLzrvvrT3ZD55LWQdf1y50Wlm6vNfZVSG35%2BYo9O7NxF7qp%2B9Cfw3t4IUjgEd1cs6w0WoZbSBz4OPzzCSVFggepg76c2TK%2Byzbw1sW8vt3BDyjU5BN7vLn0OhxsIqUtPy03xBsRaXOl4jrP5p5g%2BbCq77PWex6zxBn2gU1&X-Amz-Signature=8935b2f3a9db927fb65002ce4a480e979be23d2f3b492ca81e2c74e89730ffe7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XI5PHH5L%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQCxw1zy8joEgrv8EH2fXXSHc1o7RoAQvS8b4162LQc%2FnAIgf1zqZYpAqvMDtFQ9zw8wQ6eSBwshzxC9744o19POyEoqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNXEBP%2FcX05nLgCeSSrcA5qj62wxPsYuvy8GvgfbfCIS7OjKuWqQBi5pWlFDSxTPgdFTyk7Gzojz%2F6Tbr6efmzb5zxd7gJhprz3DBmKEgsJogzuM2%2BG4zs8bzGEuDyj8kra5IrGZtf%2FR3HoSCuALz5oSE1q5ejtkC1E2QuLjexFeLhn69yxWY0q5jOal%2Fu0gHmLmP5MGL3PMSSK3gEk5OsOjz5cx3aaIP4LmSQ50NP5KlUR4Ywt05MItDOkmU5%2B8QX73Kqoq8p0em6dh2HoyyBZQnaNlHw9X8xI8Yv0pScjTT0ufW52vs7uC59wiFKcfo6j6FwvCSz5t4DN%2FcW4IML7kqRQXDrctGPEh9wuNhwG2cQXxrqYz99cEMVX0Mu1UDhc56XwpTv0GWbKxVaKKcVGm0eQL9r9X4eZL4BZHsRH94itOpwXG8IJgP%2B1BwWBCNYout7krNyObBB3OrHSPTR2n4y4KYTxMx0EpJCPiZtTj%2BvYnQwFBjZBT3rhvSjVrlRnn7KpH0oXpoR96TPV5UOZXO5w3bO8FBOuuNQqv9T9jUep2J1ROcjadzNzbcFLHizrEENs4npEUWXfQAE1hOcFf%2B4QaC6SsP5V0DU4SdGgQqyr0qqWmWToIl1XRz0MwgHHwHfnGHqYczZD4MLq8o9EGOqUBw0ow83e1qI8lZ4A2pOY4fUHV6tcIprljT144gadfkMO67lJz4eT8peZB74Bz%2BNiovIGRnQY2VQERghtKqzh%2FODrOSlzHIt%2FPUwt51ru4iydLCmauGe3aMAEzuC17YNiWoT8edA1WOWGjeH8Wl3x%2Bjbm3LjR0vU%2Fc6XmVtRe%2F44Z9su98hMUkjsXBLf8zFM1dBmQR7nx7xfv8s6V4EdIVk%2FbonWu2&X-Amz-Signature=ca152b981138a483527584e2a9d012bd388e9aad6bbc02443b4b577a55eb8b1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663DMYIXQO%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044941Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCIGPwlSu1UkhSrn8f4ztNmYd661go3Qk1w4zSbg0ogR72AiAhQd5AlVUpT8e3sq265ugrcvDouJ5rJDS09PlV5mSkFSqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM5c5Nzhd16H%2BvxU2WKtwDvQkJy76ipsnpIKLebvXVNzA4QE%2FydoOa5t8qjqLnG3xJSvqsnnG%2BYSGejaWFFYesaP5BXmfYByavGvVfrxt8zBzFq4mcUVl1a66WnkYzpUMHbM5%2F8YBNK4rbMgqlLiD2LpTrqQ%2Bh%2Fh8vkBd%2BIWCJz3MWW0lur1obNpjmfFjB2C6T2UipfhXvrTbQZw56ccbTcafIbMx9g39aPGz5ocInKM7Uy2OzUxVXkHOgxjyy37ZURsDf61k0qngbScIzVaQQgh1OeH0V9hxsB92UZYwpEOZcslYSNqASgtzRHZGwhsvLSUIPHA91kr%2Bb6W9H4e0mI6KIgtz6EbaJ6SUqcvt1tcSZAuelZur%2FtSsgEHPfcm0dlZuYbq3gHc0rEyjbQabIJfDayn4eFvZ0t5vHsSs1tyukRJDsiV7WrH12svmQ%2FeUTMioglMrQs6jWxIz7ollen%2BlxV0ElctSO5jGLNMzd99Xee4%2BOB1K6dPFvgw96X9eh%2BXjEH5Q5xm6oCB%2FVoADiDLMw76%2FXJhhGkmtZhBinqSfUs2fgAFB4bKMsJlsPYd2fehVMBUiWXsJ2wDwrfynhD%2FzPIoshpYfeeRwCFjVtXsL0RKQoVVdd7v9HUtFbwGBqmMzAC%2BeSU%2F9vRpgwrbuj0QY6pgGXgaU82aeDv3Ub1zWhCppWtDo7w7aLuxb5RtBqO57YXEHr79E4%2BIRAZpyYV6doAg3E9frT%2FYJEc58U82IvBEjEsLGRaejoa%2FzhO%2BE%2F7Tefs7De6WhUjVEQortvepkAAj99aKFn7%2BeVuT%2BPLnF96eav5FrdApTlzkJmGt5xsAXirxvPtFgt12kftsqa9D7qbey8m8zflW2xRrOsBeIXdkaqiHi1RXnW&X-Amz-Signature=d33cfac3a8f36272a8a0d06490f006514891b723c56b574fe3b7089e3c50f60c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVXZXOXE%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCou2JmbgBdQHJwmDTE30Nt18wbnOsB73GUCWIl89rclgIhAIYiuwFfz97SBpENf85%2BC22cdSuPX7F%2Bckm68P990Bu5KogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxARTMHhIoBYEuxgYMq3AOmMlpudN%2FQhC4SlfitekZWZPlpffPz3p61NA%2FHep60ejWnFKxNH70kc2WT7OP6CkhUJSRs6BYG6c8tiiMtLasiywtcQ8wWErf%2BQ35kRB2bQUydO7yh4VM2YFifIvMGVqdJZftDBIrANDF0gxmPOoUiLHgQFPkAl3bTUfWKhnnZPCVs9YKZaG1gVju1ZeULrAGwQqC9PTuAoMv425T0B7%2B66BU3HvZSVdem0zvvKhT7q%2BNK9hdzQidxjkxYq6mSMI0NjPDnnzdqezqkHNGjFjyzud6EKTwULQc0va9DSguuJk6wRwS5%2FZwi14wJToXm4CRSHNj0iX2%2FA%2BNzBAv2QxLHDlOlZ7zZHxyuipSPgl%2Bk5cY82V%2Fo9kKJDTRvzaeHsTWdaibkO4CqQGYalYfM%2FDaB5gxpujZNQZxDnT%2FMYcXo8Xk4y6CBbNdExMsk8RFzPDl6ZdEK%2B5JSzhtjqwPD38Trf%2FreQvQHCgCGAQ4tDjzPs6HAMxVyP76f%2F%2Fcb27lb0xTztG1n1M32Y8oUPOi9ThGtE127pbnxRK62c%2BtHvusQ3A%2BuVSIycsT1AEawfIb8ETtZ5f9UoltIIlupizXLcrY7CUxwYzz3s0CSkqnxhMdz6Js%2FOYoaHZQKXKlxczCNuqPRBjqkAd%2BaF7wdFIQEuSTYDLbVczz4oH3h%2Fr6yQ7iMQ8DtjZ7mrqVEQwYFM0FM73rmp%2BkTUGU%2BXU50fVsaTp%2FIQeqyzvmtpNHa6Er18YsSI46OZoiCSXk6i067Y2%2B0cd8uQcnPzhbmIUhzkducOgIwD4w%2BLxpRS1Rzr839O8LdaoGZh0Wo6cwcfYCbi7w1LmVzC1jx%2F3i9Bx83sMKybKZT11C90oNmFFJL&X-Amz-Signature=1f27244d8436c75bf004d29b884f4f978b9f7347931e1d7a42a90acf4dfdea58&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
