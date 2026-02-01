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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VTU3IFM6%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022416Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE9T9S3U1Tq0DcwbHpx7vkKd2npvJw%2FmSXR6sDcjUM26AiEAg6RktC3IEeerDYzLeBYB%2FmX6T6jauV%2BpYtf4Jc4EkwsqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNi5cG76YXXOrqTdpircAw%2FtTKIM%2BOUpFWIOO19vUIpnD2ZzWD3HUTzPiKNK%2BOmPRrPvtd5CoKdYo%2B2mHROrRWLsDC4sTrVwyNzVYAZNLZxe2CDGdIGEWDAQU9jYmZNClCkHrNr8PI2T6xPhoMO2Pdp%2FfEfZkFHUgybFUaA%2B1EhX3frUY%2FVQMBZ36Yn5wndPtrJGb2%2FE904MK0qgjqjh7zEx2z1phMF117cPsPARyuFBm8O2ohBYXOfrtXMr8bypHvEXYZIwLRfyqxUo79ks1tnH%2FqOykieyo0XhYhG%2FF%2B5XtwLJZX2fWW8%2FBJRdeCcn6La7XX1E4dWWYFY0ebzzlL2ClqtGfma1vn%2BZ0%2F41YIivelLF2A1tRuZJKRcDKX%2FsWoAai5mioj%2B1Sks1bz5BWp842DQkp%2Ftb1uThjZWj6gaxftoBZ8Jv2ex%2BaLnuRh0hSgxq5uhFDs0o2kPVZ0uhzSvugR%2FTAaJMa816ULTPtYrys9GcdefFWrTXl4nkWQNzmAD5CiuXVKa4qA7PAM3%2BIO5nzoGCO8yPScdAWTNClkF7tKhMNJdaAPwrLL6eUsoNpR5QlBzA1v4UzHbvVw0gbirgEtR5KHs6x4OqUdh7tvGN0vc2MgVebSk%2FtBsy%2Fa77WxlozzCRCYO6MtLoMIny%2BcsGOqUBWP18yHsWiOhi%2FRPDkjpYMbOnEk6861Ka9DY3w8gD1riXhKaCqsdi8F05cF4kxuD9eWvg2SekgPNiL%2FINZ1gVhzeKpS2wbcQBxko7rB9M6epp6TkQ37OiFEX5dlc1r5fg%2BaChEy00HWwPlmOmNdBo6Haw3xaOz51RWsPKra52%2FCqhHZEJIJsxZqnip28aaTxWm%2BncaxKu8%2BVZ%2FETqCjgfWDR09AEY&X-Amz-Signature=e1e485d8b4659c242146892ab57193239d1239a91db2b13ab6a17a509a13e6da&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W4QU3U5L%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022416Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFJyXsixp1goF6SXqD0O0UA2BLW%2FuZ7gwltcKw8xfRAbAiBZGkidveXIUioLg3SHfjycysbO3Rw9zNyxrEuhAIFNqiqIBAi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMoXFDQbeXQI7vXoJXKtwDXEQbc1rziL4R2Pr3HVe9F56ONP9i8bMoidRS6WkbFkrecKh8884CilJnvcAGYeOJ1mqJr%2Fh4Ims%2BH9aLYKcqHS9bVDrkWOkR%2F6QolQaKBzgf8XAjd0rCHf%2Fksl8BLnmpiXq3Y56qfeMptyXazw3j423O9C%2B0aiH%2FHT0DGk1Z%2FwnHlYR%2B1s9MQPYMnXS7yP7GwFFs%2B2bxqSxuMNnZYHcjCNjuTKKmkqhmLjorYkAnenECkAARnYmF8ndEw4G6g00oAWVq%2BLt7aCECmZIx3YatcjkyseysIHW%2FkpkcpZJO9XUP36FKh6Tx14dii%2FKs0POyKbvbavybkhSwkyZjvjv%2FfhNmW7twPzjMktkCNSzvqpOw7t2z7KxbnKH%2F7ymmoNjirK%2BKdjvHzezwRX8LwxoynLZwx8QXcx1JTM6dbWiQ8VrY52QTNJwnUzw6RDlxYsIT2Ab5NUzHifOJNLay8MmCP21M7%2FAUfJ%2B4GzHcZC0bzmdA0oLbtJ2Ix8vPWUCAMmFifTf9kgrJKPDwVrNDcOxhfLn7Jmrmcxq7j5s0%2FfkfqaE73NaaI6q6bbZWygW6dakWgvmQpL1d6wJd%2BVxSVbzr%2FoxYA4nlN%2BYGrFvpqi3Oe8B438DNHjzYNmdqQfownvL5ywY6pgGwPF7Aq1OkV32kUQNe3App2VyRm2NRaL900js%2BvMDKCw86R2AAXIQAF7K5%2BW5HJrkVMtxN40N1EqwWHVFNwUfc1nYHousV%2FNGTTg6oIZQ3MLEJqSo2QoH2JgmEIs7dP5oU8rCID%2FT1jcX5lGTAXg6oFE6g48eWk1iZUeDlx%2BIr6rFzQ%2FYVArH2O0Tt5cQLnZhHftk6csuCWrPPWsgVnmKf1WWdzYQW&X-Amz-Signature=d4613e7b5d893c7348d988b906e4ceb9f84223751db1acd01a4b6b0f059a11b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YNXT6LIJ%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDZ5iStnKvVW%2BF%2FClbevi64nDs8A1AR5CY%2B7wNo%2BkdJLgIhANAKtissh58irJtlOKvpB5rv4WnOgHuwwO7h4q2E%2BKAhKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzrCwahlFVmOuP3pcoq3AMmCrEOjpjIIsUsNFAQO7pvH%2FgHfeb3FiYU1li1iwvAZ2hqMz9zWJwNUf2y9i9%2FiaJciKFhPykXUQPtHCo8jBcxh7iWGclkA8BGEgWSpMAWBtRkzc1EMiChNuK8eXfO08nVkjckkXKF5OIyAZ7%2FQ%2FulloGBUQ5Ev2cMUk2ysVfox8viKVt%2BKbyLF5h8ImiZuShV5CWKrGPLcEnG3hqQMKG3TEOH6A2yxI5UzrbaONwsfq%2BQDiJ2q31uHUPRfe45XP74keS0Bkv2ulyo5y4GSdOdHDIJN5%2Fgj5jlehf7dQu3blOhDelT4m1TaFmUD%2Fr9coL4R97FTgeGYCwTjUz9ysYml%2Frj8gpRuGn8kUxWjHAtOWLYSHTY0EN%2BlnkxkC%2FVXMCcUfb1hJVgzRm6mNQzUW0kWTv1Rf9dl%2BPO0YoH2mBnVmdx5eiAdk6GWsuwAkD4p88ryK%2B%2BMaDQjc68%2FOOup5eIpXZ%2BGxoXbg3yeCWKjIWh9uxcPPOf3OYFEOENugTcSwDJsO2J%2FgtFDroFS5BZdXLFycQ3B1nlBeMmGey%2F%2BDaSi2idJuKNQbGNuL7Wi4kq%2FhapINSt9jFtzv69qeVgEThfsGl16YfPzRi8GvJFzRc1v3gBz6VoTs9sVPVhVzCl8vnLBjqkAWCx1M07vLWZ%2FIwLJg86O%2BdmjVO8VbbE%2FV5Lp1lCIvoAdBaKTZcw7CQaP2IVVQDIY2y%2Bo7rF5Qg1EKwImsck5Q63zdO9%2BjWgmFoLS1oKOEaihpn6fz%2BW8%2FRgRktAiBvFb%2FebzKh9w7dNKzYZBLLc92nUzgw5b7tIM8VvfESNFA7Y7%2BJ33koGVt6CDQkezpjFZJ%2BaHvuBqBKpkKcuyydr%2B9%2BcQrAU&X-Amz-Signature=67edb5d329a34c1fca3eebe1cf7748d921f6f0e3da2ed2e2883e756f00cfb12c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YNXT6LIJ%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDZ5iStnKvVW%2BF%2FClbevi64nDs8A1AR5CY%2B7wNo%2BkdJLgIhANAKtissh58irJtlOKvpB5rv4WnOgHuwwO7h4q2E%2BKAhKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzrCwahlFVmOuP3pcoq3AMmCrEOjpjIIsUsNFAQO7pvH%2FgHfeb3FiYU1li1iwvAZ2hqMz9zWJwNUf2y9i9%2FiaJciKFhPykXUQPtHCo8jBcxh7iWGclkA8BGEgWSpMAWBtRkzc1EMiChNuK8eXfO08nVkjckkXKF5OIyAZ7%2FQ%2FulloGBUQ5Ev2cMUk2ysVfox8viKVt%2BKbyLF5h8ImiZuShV5CWKrGPLcEnG3hqQMKG3TEOH6A2yxI5UzrbaONwsfq%2BQDiJ2q31uHUPRfe45XP74keS0Bkv2ulyo5y4GSdOdHDIJN5%2Fgj5jlehf7dQu3blOhDelT4m1TaFmUD%2Fr9coL4R97FTgeGYCwTjUz9ysYml%2Frj8gpRuGn8kUxWjHAtOWLYSHTY0EN%2BlnkxkC%2FVXMCcUfb1hJVgzRm6mNQzUW0kWTv1Rf9dl%2BPO0YoH2mBnVmdx5eiAdk6GWsuwAkD4p88ryK%2B%2BMaDQjc68%2FOOup5eIpXZ%2BGxoXbg3yeCWKjIWh9uxcPPOf3OYFEOENugTcSwDJsO2J%2FgtFDroFS5BZdXLFycQ3B1nlBeMmGey%2F%2BDaSi2idJuKNQbGNuL7Wi4kq%2FhapINSt9jFtzv69qeVgEThfsGl16YfPzRi8GvJFzRc1v3gBz6VoTs9sVPVhVzCl8vnLBjqkAWCx1M07vLWZ%2FIwLJg86O%2BdmjVO8VbbE%2FV5Lp1lCIvoAdBaKTZcw7CQaP2IVVQDIY2y%2Bo7rF5Qg1EKwImsck5Q63zdO9%2BjWgmFoLS1oKOEaihpn6fz%2BW8%2FRgRktAiBvFb%2FebzKh9w7dNKzYZBLLc92nUzgw5b7tIM8VvfESNFA7Y7%2BJ33koGVt6CDQkezpjFZJ%2BaHvuBqBKpkKcuyydr%2B9%2BcQrAU&X-Amz-Signature=d5c5bfa2599a0eab6a12f906bf849f85cfe0f4a5bbf6a4c2a2f409a9fdfda0ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V6SX7FMD%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022432Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBVY4kjW5znkrtJlsjdiLwSMgkB3y0iaClXpSzf7Hw9xAiEA3RyGHvmpoingRVWoFkrq%2BPHmSFx6idnUkpTL5nYWVD4qiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMN9tI6XcWr3EMGI%2BircA%2BIGuFQ0VjspMOWmC%2FAuXkk4DihlALlpL5lkJpUzD%2FDQNHxdz5K5MuC7tj1uEN0n6LMt9xPrAPgVrg%2Bo%2B%2F2GmZAf1a3xerYPsqMm5aRsXH5GxNLswhLKgZcvafgY8MJ%2B1NhfYIbQs4YIkMBgLudvkCu6xppcRqqaWpJBJ7xMDV0I%2FPRJ8Umbu%2Fc%2BFL5WoViN27yemTz5NyI2RuQFCeVl0C1oTNbNLzIcCL9LTVmS1QetpL4QCVWTRFchU3QwxNBgf1qjj0LFwLXX%2FKzX8Ym5R7ywAXo8Mr%2BmmGYBojjEyG0RA97kc%2FDHFNCB2o3Dov6Y67ghKZaRIh%2FFmMtjgn9R8Hf6gjYdrLs%2FkyXC0o33ysjAmGykrhmIqArtFy%2BerThQ%2B96ypu5i1eQE6wCY4wDlUUQZfPfnyMnZak537loDHeqYORWXr7SIGZ4UNmTvs034XjkgdLSsuHBrAoZsx0AHoV5UMOhip7uP3QCz4al5urd4TSmUsP9dxSFYvhow5SYV3Rzp%2FnLrLYw6EdH4oysFXnLZk%2FLknKkKKa4ursxxFA9UYzOABAwFA%2BovZbDe94r3Zv0AfwdQkC9bEuDnHbx73p%2F9Fn4y%2BXdwtXCYEjF%2FQ29%2FDD43AFV9rFxCnbIcMODx%2BcsGOqUBMijhnqNeBuhox9N85qhTXcsQ80p90QM7zikxpH7hqmamyhiYBayTcrxJDF1NiIM8%2FeU5bIlTlEHZcE%2BVuPWxVn8I%2FcY8RFuWo%2BOnOcbsLWRJj6%2FHnsv4gd3Q8GURkr4L6Oj6orXEcIq%2BEh9dllJ9UjCMbhpVwbaMt5xDIqxNiowAAp14OaraxPTcDII4XMlQ5A%2FwJsXD9bhE4OboSwAyZYx49cGY&X-Amz-Signature=67fda4ebab43e1ce6f3eca7fb6124f034877c748dcafa4c89f9d946312e18355&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZXQFRT45%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022435Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDaX4tO61sZzOzAqxvwhTew78xqLrOKsvhVwZKtLJCfRwIhAMCmon8qz7mUHekU%2B7rUWl%2BUdlLakCiDbVfdhSeuG5BYKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyA5iXN8yZ4f8AqtP8q3AMXCDmLYG9nudEGJidw7LoQg4kxHv1eHsXJ1e20PzpSckZm7A7sMEzXsj1NZm5k1VvBQOeeqi%2B9vDvVmvoA85X%2BpeenRTuaVPOuWgWAYf%2F0pQTTf6Ui1UIEHEoVQv7Mzb%2BktB7JygQUTdMY2Zh6LCeXqpDlrcPOGSstSkV0T1y%2B4egozzchGGqgGT77yliD65lnmTnSsZkhv2fAVq%2B%2BcqxuBKQ3h4aRaOfMjy3A%2BC%2FQF8hLcfLXi%2F%2FegrY3GKUHGwZWlBGkKaBkcSVyxzAJR00d6oQMea7CXW6AvZRq2To9escpg8my7HUsmAHmYKfo8nbw4SJCC7lOcKe8ggopuu5LsP0o6GjqmT9HcPTD8FboYK1WDGD11AAkLgT5xZZmdBWuNAO%2FR%2BbKn6rsbtvy5C4qY1saPGXv3UhPEwvuxPLBFr6cpYpDpEdDed1YXYb8ARF12%2Fj0a0lktLeqr3DKw%2FjQuHk7YXwg40hNPFAXx1X9xlbkIUANTbx%2BD6qVeIpHwwj0GB94MAyCW%2F5c0zaF6t8BC8fkor8D3ZB38V7XmpibDj5KlF2EpQoCLU1Zbcx5zmNOkYlh0GU%2FSiW1Lx38Hokg08mIkWC%2FAFU9rXRJeL2HbDiIM7z3jXa0uHkyuDCV8vnLBjqkAefPpIDVTbk6KBoURRNbAvfnhdiGc26n0fac822VrHeWCAMIs9bCVAfT23MgRzo8vP%2Bvgh1f43OZ9GXDlNYKtOgt0K1Qa2qNdFQT%2BtrwEmB9ayvoJ5egCMrgtEYJksSV%2FpLeB2UrYFyYbnoD2U3yFQfG9vXua5fZnTLb4mEjmQBYzdqNb%2Fc35UQH0OKmJUZQ77UrsYxynkH2cIgiP7FbHIh05BVL&X-Amz-Signature=d80911920cd5cc77fcbd8f0f4a42ae22221405cfed3cecfaaa51065162b4cb5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WFIYALGM%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022435Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDuMctYBwZ673IuZszwspSJSWuuDoctuS04TQUoXSFOlAIgFKmr80yZFe4sG84MxMML21c4%2FVCIrefWzbqQ6QTFY0wqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKEdhhppZPna4kwlKCrcAzqK14n6Hy%2BjSlgnbDew1UaEYD6O%2F%2B3czjT%2FCRkPwicOdx%2B9WhAlM8%2FZ0u2wINc1B5bQZGBfWR9oYjmRlqnVwwCsoCtFhQoNRMu8WMcsm9IpFgSlSi%2F9FmI2lrx7x6P39eVxloUAJyUlLwOliSEf9l2%2F7umq64HN7MdUEn8arH0Q%2B2eorRN3VITmJK4%2F%2B%2BiL5UaqEXx8uulyqE%2FPTwP1CRyP0fzADwIObawJjKAYJuwFKQj4FRmBbaWiyLcB4tBq9iELAu5Tvn3ab2EX2t7%2BX4BBEnOhxJZIOddmlG9PvubR8IjwoCNLxDLm%2BFiK3e%2F3oXHWyl%2BvtcAeH8c05OumFbZwzj68lErq%2FujdQ%2BHcCgc5oHoD%2Br1MWvQBYo31u6MTs8CeJWqgol%2F%2FNLF9sxqifvLLr3y%2FVoLqBFPLSOMwqE353w4bBlwgR4v4LjsYwxlPc1FnWiBUMD%2F2Z9X%2Bg814FNHgZHkLQRJqu3wSREp3zHjX7G3bUS80wS9VoPki8116ZPozkuXo3dvu2wV%2FhJNUVClmxTwnITmU7w3iXFTzp4kapVu7qDLpfMfDhPpUEW5Ub9zRh%2BLY8hb6eILdhAWwfSm7gTyQnZ2FPIQ9Cqj%2B0thTFmmWccdmZQ0LmRdWMNLx%2BcsGOqUBuup%2BmuED%2FbWXhgJrQUZZvvd5sYiZ68NAMzvPGfF9lTCSNyUJAmY2QUkM2EHvs%2BE33X8QAr%2BnB36GOj6mlYMWNGEdsd7wQqw5xeJ96oHUMA9uXMMCyXHG%2FZcxd2RDlW4lgQ6YVMDzzFADQGWRZ%2Bp67LUmSboUttLL6JyyBQuaN%2FvmbDZ76Nb1wTXGxbcxQX%2F%2FHu5Ks4pjJyj5%2BtCArEEKseQQPB33&X-Amz-Signature=95fb461bf878bcf7ac24138644a50bc02cbef50f3496eba7d692dda23321e142&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46646SH3OXD%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022436Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9hKXw1vmEake%2FMXSCbUnSYf9H3LL%2Btkcpu4CNqjteXAiEAoz11DZOCt2x9SDr740Hf0r1Hfy9YFOT0yqGBh8U4o%2FAqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGTZdzWnZB6C4BGOkCrcA4cWHwlIeuqpTL%2BaiF50Q6H4qdTxcD9A17QeXEsY%2FQGOmh8h7s%2FiD6e7Gb6OTKEr688jN0bXaXLOKEy8BPQdW%2BAAdnfiq20yEJnhe6OiKyd2vuJGwth77Bv4YML5hxysB5Y2%2BMetcQEKxTG%2FJY6e7%2B%2FCkoGsFqjMDBKMyZL9pOSDPLPcYHmZW6ybBcP7uBkvyn37fnzJ7v3q1G4nIz69GF8vM5UjvMsVsOP5kBOcY0%2BrdOjYRnqQO9wDpBG4ThNNwuPXC%2FPPl7inNvhqPiZOr9Fi9jKy23Kk8TuaCfIGFcd3Poth0fWqvR5nqqWAd%2F7aHCvL2d5%2FvJvDl2pG1%2BDXY6saWNZVSNzpfUox7cuIhd5NVMTlnP%2FkRL%2F7TKd%2F2qBWIL4ahlPPJwRGcXIaPBLzVbJzROMNlIeNyP9VMScjXz18pGO%2By2IhzOeJwqQOemUCjQ23mCpkgJnlOMh4ZGRte%2FouH1EKcvhJtucePNL%2BjN9ceaqKQBCOxenc%2FVsXQNMXLGYmUNenyLRW9OkY2Az5HfPXkkpNFLzQXP7IA8HuFmfokIcyIPhibEIOBjHJ63Qm9x6PiglPKUsLeuWQToKZEkPIeoAC%2BViRodIGvHW6Shr68uupAzFoPKPUbHAqMObx%2BcsGOqUByGFhCBE8dnTHcKgNtGK9kQ14bHaiUi17bfvadrqH8wKhgsxWDVQ9kNCLUSSUICFeZt%2BP4An1KI11GThcij9P9%2BplB4RA2wTDGzrS5Li0nWjE06ZNjF5QaCAfowh%2BRV48ivXqyfBEFRjAVksjJ18LviDqEBjYFZkNRzBxCP5E5b51kqR30U80vfd5YwsPtWcrXV1n%2BgSm4I6NiL00Un4us2RtDlUy&X-Amz-Signature=3e6de9f00695b68bdcef97965e0528d91b602c2566dc1c7cb413785651d9dff5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46673YG3E7E%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022436Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAiWenlfJ5KWY47tF38uVNwmWkrUTaANv3A7aPbn61rRAiEAquSW0C6wezeeZU9TlMup6IFBozIaY4WpUkdUh9b380gqiAQIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMY5j8S%2FJg6uPUhDbyrcA8mqM32LwZPE7gQhAbtLPsZBN5slqM7gUgs5EOtpUD70EhSKvzOgL%2F8%2BnrCwjdE4PijBS0BpsIGJcORrc0svxFxaGSsR2wCfAxsVudSElVP%2BYH8r%2BUPPL3q3ltipm4XQ4r%2BPo7UEtOp4CAf8E60T99cRjZdcNf8sYjNwEHCI%2FQcvBw6s3LVzfUaUUSRiFB4ZmNxK5hUFtnUMvr47jCITdlkurXYeJeKx%2Bn3CKDTSmcYtiM%2BWV0wyN3Eg2GYljPtPwG1GIXnehdMkzBdvy4LQxT4%2BGS9Pvt8ADy96UmkaltaMpL90uKvqYw3vKCNrKxn0XyDMF46MpAITT1TgetzMowV%2B%2FJb5TixSDGyqYLV7Cqab%2FyBo6u9OOyoWUNqnkbDy%2FLOXqX%2FuUmHivlGCvpzQkg37zoWzhIKKTKgGjoNg7zKEA6BpxUbOor2MgKOx0aDMZnShSEqcRnUfiLBHx929anMoCQP1km2srXK%2BRrf9e2cqdEA3bE381tszNLbaEW41R2rwzfQyiVk3yfzBNEluuxd1GeNhc8s8ioTfyt3N4UmvS4Xpf%2FqAxb5z3IxmsvGUFxOt1TWDVa%2BbHV9WUSKXKDroHDRI1ND1Pedo5mozeQVzgMY7ZHgK%2FVUT6FLrMLzx%2BcsGOqUBz5hAcdANzYlfKSwByg19JZCWNTfy7KqIPnte%2BEygNv5ChGfTMPvD9wjpDcRgLJXVAUp5SgO%2FSb4iW0Q0vNnqVSW82ydbIa2cyDp2t2Ww33ug%2F52nLW%2FFVh%2FuCGT1PkIljoKsfU7NG%2FULGoj0fK7klsCENvQvdYskwTspBfpFQg5%2BujXE5YVhj5k7RCtnRT4argNGXJ2gp9bQ5LsaRLOkmIjaNtoK&X-Amz-Signature=f6c8971a9c37e5b9635676ed4174216fe9d560899ac0dd37fc983a430c5c5290&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YNXT6LIJ%2F20260201%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260201T022402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDZ5iStnKvVW%2BF%2FClbevi64nDs8A1AR5CY%2B7wNo%2BkdJLgIhANAKtissh58irJtlOKvpB5rv4WnOgHuwwO7h4q2E%2BKAhKogECL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzrCwahlFVmOuP3pcoq3AMmCrEOjpjIIsUsNFAQO7pvH%2FgHfeb3FiYU1li1iwvAZ2hqMz9zWJwNUf2y9i9%2FiaJciKFhPykXUQPtHCo8jBcxh7iWGclkA8BGEgWSpMAWBtRkzc1EMiChNuK8eXfO08nVkjckkXKF5OIyAZ7%2FQ%2FulloGBUQ5Ev2cMUk2ysVfox8viKVt%2BKbyLF5h8ImiZuShV5CWKrGPLcEnG3hqQMKG3TEOH6A2yxI5UzrbaONwsfq%2BQDiJ2q31uHUPRfe45XP74keS0Bkv2ulyo5y4GSdOdHDIJN5%2Fgj5jlehf7dQu3blOhDelT4m1TaFmUD%2Fr9coL4R97FTgeGYCwTjUz9ysYml%2Frj8gpRuGn8kUxWjHAtOWLYSHTY0EN%2BlnkxkC%2FVXMCcUfb1hJVgzRm6mNQzUW0kWTv1Rf9dl%2BPO0YoH2mBnVmdx5eiAdk6GWsuwAkD4p88ryK%2B%2BMaDQjc68%2FOOup5eIpXZ%2BGxoXbg3yeCWKjIWh9uxcPPOf3OYFEOENugTcSwDJsO2J%2FgtFDroFS5BZdXLFycQ3B1nlBeMmGey%2F%2BDaSi2idJuKNQbGNuL7Wi4kq%2FhapINSt9jFtzv69qeVgEThfsGl16YfPzRi8GvJFzRc1v3gBz6VoTs9sVPVhVzCl8vnLBjqkAWCx1M07vLWZ%2FIwLJg86O%2BdmjVO8VbbE%2FV5Lp1lCIvoAdBaKTZcw7CQaP2IVVQDIY2y%2Bo7rF5Qg1EKwImsck5Q63zdO9%2BjWgmFoLS1oKOEaihpn6fz%2BW8%2FRgRktAiBvFb%2FebzKh9w7dNKzYZBLLc92nUzgw5b7tIM8VvfESNFA7Y7%2BJ33koGVt6CDQkezpjFZJ%2BaHvuBqBKpkKcuyydr%2B9%2BcQrAU&X-Amz-Signature=cec9bbf0dc9391eb78becc0efe4443597b18ab83dffea9c64c236894ce568c08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
