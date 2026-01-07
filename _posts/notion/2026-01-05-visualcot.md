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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WB7YDRDE%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003541Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC6sLDyeMI2YHo4kQtXve04e21eWLdQVNw69DGbsdEb%2BQIhANRi0N7ThIfM3fDcJ22D%2FXi5LC%2By7RHPf2nFpc0xPqaPKv8DCGkQABoMNjM3NDIzMTgzODA1Igx38PLYaYtNbKDBWTkq3APRsHjqJ8vVIz3cxTIvGEZOBjURRsP91ze59DKXtTMz5kGGeZwhx%2Bdkr%2F9wMiDR%2B2XLKdgWc50jfWkPfWw5kbEPWoGC4Uvootnh56nmlXqw93MQ3sDUx4bOwNz32YzolekAMR%2BTy1%2B32A7CYEMYJ6gqjfnV4Ou%2BBN16zve4WFg6DtZG8lpFsd2i4XDh1Lf8BpSv%2BFIvcZ2y31W%2BEF1f1h1MzgxIvqoQIp8ZGvxWEXGDajGH2d8OHGqBknD2XEQBxsQNz6JlBgkYmwWNW6yeyppxQugpyzKIuCANZIAHYFvueT15UM8UUKn6RqGqgp4sP7ENfteVcP7h%2FuIKoW5busRgkyN4hCbkdsMEzhtdKbJYiq4Apj6tAV0bO5cJ2v3gwHXLW3VVacvryyAeeNnQzoaIBJFazOvjEFTs7sthcSEVj0%2FAWd9jbBBP00bffUDtgGvdCoEiH36J41RsP7zCFyT5UUoZM6QhYU90XAg%2BlUoPhUHzkWwz4S8OBJuaNqdsNMYDvRnlVXLP48JbM8eUqfBNL4e0gpHn4gZ528KDTYCoQWnwrSXpwyy9pUiQHzlXzBZwc3pXtqJn2Nlcm3%2FyHrYXej6iicjlTY7qcy08oLfHDXqUTIIulVv92X%2By0zDMuvbKBjqkAemaw3Qv%2Fa518jWEkw5SrRy09cL5ue5q2eQNdlPrdgoPodb3BBak4E9lSgPS6fK8TJ0Gz9BjBSXVB3x2f3DI1MVrXoV5JPpH7z3OPIDY6OzcopwwGiyh4EyTy3dSC47l5rSuS7BE9wbbKwP10fPUUX9ccous7rIAxTpktFEQaC%2FrIa4dk63rOf%2F%2BfZBxYIggZszXq8bW%2FETvj2iBlTa4dcRib6M3&X-Amz-Signature=85bb6bd4c3a7c70f58825ee6bc1b9af09195527975944f015e7e752e458020b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V6RJGS7B%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDpALhtKMFziqZzCyUR9qwefiAiR8YRzlmU2YYo8zSFDAIgWtct9M8ArAxuUlPy7Y2yPFAUm2bmxMGXTqwtl0eZYDwq%2FwMIaRAAGgw2Mzc0MjMxODM4MDUiDPccwW3HiVDZEZtJnCrcAyBoHGaHDS1s12La3%2Fsi8rRuUuks9R%2BCluW6T26I2LiSElea84Pb04yNdQzIsFDxpofCGwb2X95ddnLwF%2BKSvDqqfJab4VuTLv2Vx7aykE67aRBbhNodlNQUzQOD0x6IwEqy52Tphw5igexj0y1nQbqkRYkcYR2eit%2FnS5YqaXtI9R4SikdsEhlym%2F7%2B0wFieMpSMC3FG3XQcXVNEhUsxrTRPxixD%2FDgwWE8IpS7cuJFlyCBVNPfiw7Y2QSWaTAN%2Fz1wevLc0UtoxMmTM%2B7WFks6ll%2FXh7l7NEBwJmTFf%2Bn%2FDtkEFnnzaX12lP2YM43rmxTDX76xL4Oy8RVb81SOyUaCQFOaEqNl4DCKdxVZ1YiMjlcdaT2VlZdQtuelvsJTH1DuZWG3Evhk6jGSpmtI1aJ95agMK%2FMWew220oQF6gUcb8Ni5G5PlrphiimHEAbtbbSiXXwYwhnv8CJdgfDodKWijNKwSApnboGYoXCWTmhjRpw8L9gDtfdATP4QgaAIRIuwxJHmviklIExqTd3uOgLftk0aTZrgKlNi3aBr7%2FAO4Jh7y5GP%2FmtWYADTWmM9ea0rZ13MVPZQHRuW4iJP%2BXbhdsu53Zd7dNfYFrUq18eUZ%2BTtjYySU6AIy3UPMLC69soGOqUBWn6SLMvV%2FuPqhr2FPT5L63x6zA5Fs73UttHa14O%2BqSzGacdG8EFqs%2FKaOu3nkf7jV6dDnGpaJfvodJe8sP472P1GpJfifzDbSIwXaCDlzXePQ8YxAw%2B8IzPGKb6tpazzgU2QXeEyuKRm7KVB4tAzPjRsTa4kctdOPoOao7JDqlZxpMEGlCH8ZO5JHlcKYPGpkf%2BU642%2B7lKT9ftNieDc4Im%2ByNEF&X-Amz-Signature=eabab8fd179b90fdb2eb1eda6d52bbb4bde9f7877e55d28dad20d8e170a577ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SYS4GO6R%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003532Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDTtOGWi2u8EQP00yb70jqovowJ4nxfwsZiqNvzWaPs6AiBKvyu3ZW3HnTlHIvvUUfpMuigxm6GQrThEBNAQrXLpryr%2FAwhpEAAaDDYzNzQyMzE4MzgwNSIMRQHdmEIpNUUpU6H4KtwDQ%2By%2FEIJ9WRdB7vduw4eMZg5pB%2FUwAF1WOId1Sa2XL8RRp8XLGR722MbvvjMbyq6Z9R1t0PiGMIuug1mlQwBKXDCdR5u6E9yItTaPfqSY8jH8Q9DUMLWMrslihh96RsIyx4B7SL1Q6FWhSLmyLW10doaRm0FHDqn%2F1nZ8vW0qF3oq1Rm0iGnlCjeNTKKDIo2uDps6dsDWak88yuu5V%2Fs6WdUO8h1hD2saq4zKaYYJs5%2FEDjSf3I28jiDLyYLPd%2Fj8sJ6sykxq5NakIY66Z0A31Od2v%2FH0juVFtXgckUp0FN3Wm4v4hOYppqt94liR7hakSpdWtKuUoHAhcuuRevaWpIQNdHUd8GvdFwtMCVwcx1xsYabpXUkVoropAicf%2BYPdNXDm0XBHoA5bKE9s1A%2BuPxsUQRjIMnrSl3wdxOxTG9w9pgB%2BlxQk%2B1%2F2RnPHIIfN6SdjTE%2BqRBXIqvQBfCIIcvIGC%2BAdRtkRD0s3QgEn8cgLqMx6jIj6z6gHeCs94I%2FdhPS%2FyZwBm0mcQmpnDjoqn7eDobk0TbyLZUQylW%2BijXwoYAAPj1hmjLAq6SMWNwO%2Bqu2ho6ryercyct5RwAJSfp8AWW2q5pNDOIfyIiXjrlj6usf44rFnswiZw68wvbr2ygY6pgENjUn0O24hgrqkrVaxm4EjpFSibGiQWmNMv57oJgHzp4paXi7zQG3JsfuqmJeXjcyZDKpr2QBUSuh6pHwG3%2BAOHqr440I8l32DYcSNZcPSoS4lnVp8I11SUJVI3fBtYMgY6ZYqBq9yGIOWOzQu%2BcxUuz6dvoLsPp9DHZgmv4bCGBBpTk9vdwMqBZcXw%2BhQBfJxeRs6gMI6jrhhbcA%2B4RQ10naZyDVH&X-Amz-Signature=de78594e4ea2b6f6bf0bc3a68ee276b11337209009eaf8d3449697859a07d7f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SYS4GO6R%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003532Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDTtOGWi2u8EQP00yb70jqovowJ4nxfwsZiqNvzWaPs6AiBKvyu3ZW3HnTlHIvvUUfpMuigxm6GQrThEBNAQrXLpryr%2FAwhpEAAaDDYzNzQyMzE4MzgwNSIMRQHdmEIpNUUpU6H4KtwDQ%2By%2FEIJ9WRdB7vduw4eMZg5pB%2FUwAF1WOId1Sa2XL8RRp8XLGR722MbvvjMbyq6Z9R1t0PiGMIuug1mlQwBKXDCdR5u6E9yItTaPfqSY8jH8Q9DUMLWMrslihh96RsIyx4B7SL1Q6FWhSLmyLW10doaRm0FHDqn%2F1nZ8vW0qF3oq1Rm0iGnlCjeNTKKDIo2uDps6dsDWak88yuu5V%2Fs6WdUO8h1hD2saq4zKaYYJs5%2FEDjSf3I28jiDLyYLPd%2Fj8sJ6sykxq5NakIY66Z0A31Od2v%2FH0juVFtXgckUp0FN3Wm4v4hOYppqt94liR7hakSpdWtKuUoHAhcuuRevaWpIQNdHUd8GvdFwtMCVwcx1xsYabpXUkVoropAicf%2BYPdNXDm0XBHoA5bKE9s1A%2BuPxsUQRjIMnrSl3wdxOxTG9w9pgB%2BlxQk%2B1%2F2RnPHIIfN6SdjTE%2BqRBXIqvQBfCIIcvIGC%2BAdRtkRD0s3QgEn8cgLqMx6jIj6z6gHeCs94I%2FdhPS%2FyZwBm0mcQmpnDjoqn7eDobk0TbyLZUQylW%2BijXwoYAAPj1hmjLAq6SMWNwO%2Bqu2ho6ryercyct5RwAJSfp8AWW2q5pNDOIfyIiXjrlj6usf44rFnswiZw68wvbr2ygY6pgENjUn0O24hgrqkrVaxm4EjpFSibGiQWmNMv57oJgHzp4paXi7zQG3JsfuqmJeXjcyZDKpr2QBUSuh6pHwG3%2BAOHqr440I8l32DYcSNZcPSoS4lnVp8I11SUJVI3fBtYMgY6ZYqBq9yGIOWOzQu%2BcxUuz6dvoLsPp9DHZgmv4bCGBBpTk9vdwMqBZcXw%2BhQBfJxeRs6gMI6jrhhbcA%2B4RQ10naZyDVH&X-Amz-Signature=e5778ce8cd0d37bca67bfaebfd41b4baa0ac64dcf2533c358a7bac8a5d307a00&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RE7F5WEF%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDTSNgy7teLhCJ%2BT3ujzKg7rE%2F4XOfW3uz1IAnpCbt22QIhAMbXvY7ixHMwjBezYcQez%2Bfs%2FeCNhrIXal07NcD69ZRhKv8DCGkQABoMNjM3NDIzMTgzODA1IgwQoXNEVsOwjhA0rskq3ANabjE1sIJJOV2qboXJFj04QcmF16VzTzvxDFbLzTkehBCjDx5l5dYwHG6b80TDkqfFBWETJARlhcatOS%2BDqYhhzgbrCohg6sAnPw5GBEhXT9LEhJLhWWMwyUGk3TkpPkH49hokAo2FJrN55m82LuYVm%2Bxdr64c7URxa4V1d9b1Qy0OGaIEfTgA%2FW0%2BnCPVhahjgaWGFuLzyq85F05SV2IxPkZav9eAeQS7Yd5NDcqSth9y84CNWDXvwZRlvcsba7LPFaZ1YkurUlCX2HVM0bJ4sy2EET%2Blnf0gPOYBeWkxqarJs3JNoL9fzG7EVkutZjmgnPmSAsMforbjvL1aS%2FRDK3%2FnB3rZMfNp3BM%2Fn0lo9PgTtMxSDI6jTQZ3ld7%2Bc2I1%2BnPnkLo8yrG%2BaO6WfgbTU%2FnW3FKxkYNT%2FtTbP3EDIIsYWTda49%2BisdYU9T0LDsCCgzZWksG3rdwp7h21faz5CFpMIERtijOZDm6t%2F3mnOPr5WLxEo7HrkcKBNj%2F2CWuUBURXqFlUcGue1mXrdYqbod3U1LusXACVlT3kaA2%2FYl1KQ7UkbV9WuN%2Fg5ftd4laCxh1Femim4qq65kfOHd99HAp2y%2BnPZUfphIedgPrN%2FBj2kWjaEoAa0EK2wzCtuvbKBjqkAdll3OpuqQml4Zhqp9aA%2FjbDFPT%2FhwsvjPVKXk7jpol3%2B20hkHbgx1BTJYTbBOFqbEAWUX5L6zxGoXQDt5kTtkeGC%2BvzaT1Ay89Gajv9RvtNbqbEeVxtZhOYPCNyN9gNMB9iyBdPWWYVn6zstCoLs57kBQpuj9S1Mg3rJ%2BfFHaGumSFtq6XGT7%2FAgvQOkpSyKaOeDkXyxHJQETftWYp%2BC6CGcy2L&X-Amz-Signature=6f865eab017121dfa9df7d8ce2d5945f1209fbbaf8407b3472caad3c4de6b8b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKTXADJK%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEq1TB06lkm1yQ9YJZ381yjs0I%2FeueQ0%2B9D2%2Fdy4kjPtAiEA8Mz82bi1piynv8OzlPzksJ%2B1abvzWdjJB0t6V1Kvj%2BAq%2FwMIaRAAGgw2Mzc0MjMxODM4MDUiDKt3fapbkRdzz6ioLSrcA4L1%2BWUFdFZHQ1HwiJxUeISgWtSafBjVMjqdcPwL4psjXz41ml8sjDfhtLqcM9koECI%2BPQ%2Fkwry%2FYiadaSgPW2Lp%2Fc64oKIzt5%2Fib1LvVx4VW1iByhhExR99I4aoz%2BW8Q1gxqa1WB%2FsxwdhOEsu0lZznJ6lmI%2FyecMXdk4k%2Fp0J%2FNfJas73KWbv7ZWt1uyjCZbx%2FVfUw5V%2FtFgk%2Fem6Szyl3Z8pln2WpDRAN%2BmnPMHAUl%2F9xge9nyhenNxiCI1hWENQ2%2FHWI02xdMg7RLOwYbL5dhzx32iofAomFX6H%2FQwuPvCsZ3kN8krSCUFJbj%2BsSw83N%2FtyWP1QtezW0sKCppApDpaZz0gYt94cZHL9GVrkAvUFxoel0rsOwtjyEAuMenGPreKhvwB1kcKhEGUzUZPnTD%2FGN4Jqt5PGrZMnnzY4Vt9kNmG7QdSpO8UTfOXk6fHEJWVCyJel0eMgrNtd1KYt9yDvX1iWknl2KDfgfjz%2FuTSb%2Bkpwty5YGLgAZSSbVkDi0TNtHNt0YX5z1ksPbissmHTYA977tA%2BeRWWWXNV0PV4yq0IVHcI%2FChNupV7rqgt9WzcFp8EH7G%2B%2B4fkbLgY3DbQx%2BqCj3FJ%2B8JH0UAl11tWBhfhYZFzCOviskMMu79soGOqUB5aCN0BIhHC5QgfjxDf41z6qbEul810TFi9NT06MpzVYKtKMrH5lCdxLEvT53IuKZv6%2FxTcq6GOoLpImmdWlspSKsNbKOLgSDLxU1w9DwJ5YN%2BZbUbiyXgguMkMup90tIzrIjV5ghGVYVaJjj%2BKwHx%2FwRTlmmR8BJBN4%2BSZcOi%2FyjjVe49MhmSoDDomkswC69m7LgflD7I8zl292q37wqgRNjcSaE&X-Amz-Signature=478de2fefb1e7d8c7032c53eb39b44b0287ad33b36965ee9bc75a93a1b014103&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46623G77BND%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003606Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCtRd9kXeD4W0dIIhSjMYkVU12h%2BL%2BYot4m1PwduM3EUgIhAJmHZthvrLUdQ1VBNAMfSaVbobn3UNHVxuUGfnRBvpDaKv8DCGkQABoMNjM3NDIzMTgzODA1Igw9VdyVFGWj%2F33u%2F90q3AOYx%2FiL%2BFptTtJbQLMP4qXVhYw1Hju5LP3RHMP3YQD3Qed10n%2FtOKbYWv1uDFv69vjvVZS5LLjTFODs3iu9deeRWxNR6W6a3yC1pY%2B%2FYmMKAYJaR507Uzg9h5x4cxkeLXtqLAlURosq5ld1mVPT22zz70jwOQPaBMPWkLf7z%2FzzsFOLkG2FWYhWpfexxAlJa1Gqyeeir3QJFYql7xHbxdZ3K9Xv03rC99Bc%2BXLBVtgdEeL8LpD0WLm1IsC9Yxbv0cCawyQpli2kLosrj6BSIN2EToYyDn9UgIrjw5UqnU9gBJ2WyaWPPdGGcGAQgofKVTeihbU3Kf3JDq8o4BEOh779Z4eMIfQaf8JoBQ9FDIl7MsQlfeZJwIFGEMFRCSXpKP8qcBxVO6qUzBy6T47gLtIKeksuR0OD1tIWJ3%2B9ufUCUSH1ZW4gtkkNFCfFDLBQjjoK1tqWx%2Bzv%2B1LEPNvisLuiydmmrchXJCKnFmbpDJB7rBGgwYP4IweJAvrH3KM3HURfUkfNZZ1V7XYRxpMafQtxQoVNbm828C1oEXg2%2FsTriaMjzFxNyEY1BRvbkdd6LtBlW%2ByOfVj%2BGj6%2BpshQwz7oP0yyeXCBvkQE3C49CwXDq3UHSCS4OUYDqJk5uzDXuvbKBjqkAVlMvUA5auLgIx7uedNiX6Ht0lVk11B5UGbr%2F4utJgihtF3qeKaoDtqvepsMmoFdikk2bhvFjomzdcd2fcoN6EvjJVKl4oBEDdXW%2B%2FiVyHC%2BTTWHdEBA3wXM7dE%2FnllxcXnh3h7Ti9ZwkGzwwSzunhEfzDjAR6IXSKNs5Vk83xe5uojVKnAQcBy3pSWmcLP1Oc%2FvOF0vkqGt7mMrKvsBxyfjgFmQ&X-Amz-Signature=3f6fc54c9b431c2b05c357f0ae4d14efe939d25a6eb33585268f14de9b9a96f0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XII56NBL%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003606Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDS%2FscjqsZrlr3ubAJTUDP%2BrcvspsCxkh3YtcDKQYvpAgIhAJiRe2iTKkGsKq4PvG8G7qND%2F3v6zhYdlIaysfCKDFYFKv8DCGkQABoMNjM3NDIzMTgzODA1IgxICzmlsH8ilkXS2xUq3ANG6x9ru8a4Oc6K3n9snEY6Q49g9N7WiKc%2FN%2Ff4MUmv0xbY%2B%2BDiY7t90LheowpPdxp37SpCYBe%2BYFcwFPMKcpYkmWAMqKY9C1y2N5BFKCq%2F7CPsY8yqI%2Boi9udFzIxcn2ucgEIW1G1pe2MTGDaHC5xiR7i%2FTYXOjvvVHoz2cvIx4TwAkVEH8I3xrooqsxVURlu2yUHlxaxXvtB%2BQJVq8YubGQmudPOPlaVKdcFkJLAyz%2FuVrWiVUjYlTC%2FDVX29Mj3n0AG%2FicyDIa1b4Vu3UKHoQq93tduEFGrI%2BPaALMSwankSnW5DGrHHKiRHwKWzW2vc6QS3R6POfrNPelRpCBWOFraVeglCNRdK5RfxwrhbTDI%2Bdod0X5BZRqj5nWgDZTC4VHC2YFwDkIb%2FDOFeGC2UbcFfZ7jSL9%2BIBXc2K5FqpLCJadFzQjIdbcFOzt1oDdNrQCC9z80LkK7nbDKSZmcIqYCw4yIp8OB7Fneuo5clx0fbcgjkMUCwgDnnYhlokK5N3f1ayAEzNyOgbTBdh4pdeKvtro96auk5qrrTexhYTCXyuWiI0IQpc%2BuWiO0EhquiAvvTylMcFp3ozt7SvWi0Jul3g4mPlFIEdz7dWgZnNKuYRoQij4E%2FJ01WBDDMuvbKBjqkAVMofORRCSLbCk9mGFsLBRr06mQPwvhPeE5Kzwxm%2B0gqZ7a93IQkUzY62UVFyCm7nYnl7IsUGwvv6hs5MuUwrbrH4Cl7JeIjarKtmyJQlMppu4EuA6WG2dn514fe30fNQVW%2F4pkhBo91tfvbcW60inxculCHKd7g%2FK%2BkDHoX7kvs7ChibtFK0qmoCFJ%2FtcQhOFzyZvf2MOrL8sp0yZ7ZKvdgjq4Q&X-Amz-Signature=fc3e0912487e4e4a4d2dcbfc7e26ae9959f314c464136477703c93d1ddf78ff2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RDVXXUEP%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003606Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDElR6bF1yDD2AU54m8ZrQ25Bz4e0hkZgsRU92BscFaaAIhALFsWMdKpLUzc4%2BDJB4phGN55STypp%2B1ZbdgETu7YjpKKv8DCGkQABoMNjM3NDIzMTgzODA1IgwEtpVBaIIsYKPo%2Fv0q3AMPErJOSzFz%2B1LKVYTOvyGp17y6pMVBAmpDEXY8jupl3evwfDQGJQme9ufk3PR5YWhP7D7%2FSgnapKOJd5ATCQbe8U8i5W%2FhCAfQyEyGUgsBvktb0KY%2FOExcM35AvxaoU3AGCGJR%2Bk2DcwhpTwSkp8Q%2B97IHwbco4EJiZOEiaThPMG%2FUPWOvSHdoEXM%2BsQA%2BE9I7b3%2FinexXId2R6xVNtUe5e%2BVeZ0uwYCPcYbI%2B%2Fde4TlTqj8M7CdppmUSGf1hvE0SYl8xFRxkcLk%2BDHBhWaaqKyKqwaobSey2kWDKrPyP7luIqFVI7nqQd2br1LhTNfw5fp8snpb71ng0gP4SCd3CoL0biLUWC3oWOEfKIx0s%2BI5uoBV03XawGYzGrwi4qpa6yPdI%2FOYtXKPaTdcex6g3XjkbOpi5nYELuHwTbKIwRr2LMrSlNAa2ozho8Yx1N0cyX%2BC09QXuNxdh5kRK5Q7ijF71IwE9%2FWZbDdsb5DMS7AfjbIr%2FCPytwT9ZiPupR0CssqpzhTM38Rt5V%2FQbz%2FCQRJkLlKzaQVJuAhoWsVulDg0lbdCsq00KE3tnWyo2PhGWhoBcEZAli6U2mhhGYMP6VhfphANhSMCAiFYN8i4E1qviWaxmdgRuprMgd%2BjDMuvbKBjqkAatEGcJpH9VwG1hfcTEe%2B3OGHnauKMyncBSAdYkh1Z9oBJ3P7ZgiUM0SZMYcz7CZEjwK8u55Xu9fKPBO0bzHJOMals9f2I%2FVdimLZnSsoi%2Fx%2B0TX3gsStZ%2FRVNkzPP1yup8j8BfvzLqdNg5jptFpSKuCvGfm7h09igH7QGR1zEGflF5SwxXMfEYPYFclNmy6I5Neu9X2jKUVMSLuUK1Y8YL%2FfkE5&X-Amz-Signature=7c129ff92b977b5e292e24a94e01d2d692517de4921fa452ee42137df2a0f012&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SYS4GO6R%2F20260107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260107T003532Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDTtOGWi2u8EQP00yb70jqovowJ4nxfwsZiqNvzWaPs6AiBKvyu3ZW3HnTlHIvvUUfpMuigxm6GQrThEBNAQrXLpryr%2FAwhpEAAaDDYzNzQyMzE4MzgwNSIMRQHdmEIpNUUpU6H4KtwDQ%2By%2FEIJ9WRdB7vduw4eMZg5pB%2FUwAF1WOId1Sa2XL8RRp8XLGR722MbvvjMbyq6Z9R1t0PiGMIuug1mlQwBKXDCdR5u6E9yItTaPfqSY8jH8Q9DUMLWMrslihh96RsIyx4B7SL1Q6FWhSLmyLW10doaRm0FHDqn%2F1nZ8vW0qF3oq1Rm0iGnlCjeNTKKDIo2uDps6dsDWak88yuu5V%2Fs6WdUO8h1hD2saq4zKaYYJs5%2FEDjSf3I28jiDLyYLPd%2Fj8sJ6sykxq5NakIY66Z0A31Od2v%2FH0juVFtXgckUp0FN3Wm4v4hOYppqt94liR7hakSpdWtKuUoHAhcuuRevaWpIQNdHUd8GvdFwtMCVwcx1xsYabpXUkVoropAicf%2BYPdNXDm0XBHoA5bKE9s1A%2BuPxsUQRjIMnrSl3wdxOxTG9w9pgB%2BlxQk%2B1%2F2RnPHIIfN6SdjTE%2BqRBXIqvQBfCIIcvIGC%2BAdRtkRD0s3QgEn8cgLqMx6jIj6z6gHeCs94I%2FdhPS%2FyZwBm0mcQmpnDjoqn7eDobk0TbyLZUQylW%2BijXwoYAAPj1hmjLAq6SMWNwO%2Bqu2ho6ryercyct5RwAJSfp8AWW2q5pNDOIfyIiXjrlj6usf44rFnswiZw68wvbr2ygY6pgENjUn0O24hgrqkrVaxm4EjpFSibGiQWmNMv57oJgHzp4paXi7zQG3JsfuqmJeXjcyZDKpr2QBUSuh6pHwG3%2BAOHqr440I8l32DYcSNZcPSoS4lnVp8I11SUJVI3fBtYMgY6ZYqBq9yGIOWOzQu%2BcxUuz6dvoLsPp9DHZgmv4bCGBBpTk9vdwMqBZcXw%2BhQBfJxeRs6gMI6jrhhbcA%2B4RQ10naZyDVH&X-Amz-Signature=cc656e15196606c85aaf4b222fbbe34613c59ba12eaef7b98d3f3520e4ed23fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
