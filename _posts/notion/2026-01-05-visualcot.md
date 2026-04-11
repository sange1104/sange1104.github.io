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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZMZDZKNB%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQDghdMyuez3gX2nNvGi0FLw0GnYY3E71tAk3JXz1yjOxAIgH6DXqUb%2F7Gp33s6D4%2Fu7hfJ4I9LX6z7SIPFtwXj7D7wq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDIwQ5qGciK6UA5DsDSrcA38DNsxbTbC9t57g1LbX29uMHoP7f56UK%2FyhQr1pj%2Fj3K%2BRWeGEFWHTKX1t119kzGwr9ygnYiCy1ydzXhstBq9oAU32YjFH671DQ1hQiL20YuoKBbphMRqcBBL5EFjkNqoLawDdzo1dKUImkGUI%2F3UdkJZ4TeVQT7DZ18P%2B2NVAbKa5ygUZ2QOi6qOe3w4IPzHEWn9b0%2FGMY53B9SjAXFvY7ma6kXoamCKRlqdGG48gcTVZWIj9UxDtFAN5SYcyOwt%2B7hEoFNnKkZBKYYvM4AWMkNp4%2B99hwjBxqgd%2FlS2ojqtlV2oWv5H4SbDb7QhaLEwy%2FZuQN6U0ywi8aFvKmqttJEHORCBbBL3i432pylXyxjKsuw5Q94%2F0ulQLRb3u1a%2FmKl3fxM64w7bCneO3Vbn6n8hcYoaRYPMQrPFY6DMXwQ0tp%2BtRGrF19NLszfmOjoMh%2Fq%2F33%2BPViaB5O39M8n%2BtaynxC%2BmgBf9KyGbBwevLDs1finYzgxZfN%2BCqcafDUSSlz2gQb5NzhlqiYoiemrkYYkSq0PWwOOQfYnhD8SAYZSCLDMgdkF9eoemo4FuQiYhMoOP8SDE0TNCxQvC2MwJLmWo6YSI4aHHGplS9whf7Pwllo8RvHq1sxd097MJ%2Fr5s4GOqUB9k4UqcL20Ig1DdVAq%2Fagn7QdyIJVMlZDikAEd9cO67%2FO1KMBeCvNqNXpyh1omxRIP8qsHlaIE6g1TduVPRNTtgm0ERLHRg4dpTUXBe7%2FfhbIpSh%2BHIZWxiUe156yDuIBG1%2BgcQskzmGgFtnXd3wnAncJJNQVbsOciHZbo%2FIuPfOrLHLK9aa1110PuWTYjTLm55qWvHxyNBjIy0IGxqMXZyqRJilX&X-Amz-Signature=a5c677f0815d6d8bb0f4576b18df8d6037acf3c62214486d6947ddf9d1032eec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664V7ZPCP2%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032138Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCICQVLSKsK%2F8%2BNbXjB9ludsxPqg2tSSKnUUAguQc%2BYngHAiEAsScr%2FtuJ2sa18mflZmMtLl87PJKxdcu4rWwlqZ2T1uQq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDL9Usll0CAXx61oQpCrcA4JdnxyqreCOXDBXN5kXY%2FIc%2B0tu2IykeG%2Fm6UwA5AmoeDSLJalQgHJLwEOkJydi5kxE4uTAMnlj1YOOHFoo%2BDYZytu6jk%2F1MkOBIB%2B%2Bf4RpOj20Ha9KZvC6bghjw6wOuJeSBuWtyD6kSYmFuKQr7Xbquqs3EEZn9fJNm5OMBUIWdmaUb%2BflS9kJhPfFIe4F4GHb%2FjotQVMFJyFst6Zlf1VVoiFIecFnqCSxiD5AOwzFT0fgwqLqNG0k0Qcmewam%2F0pgC4ai3tSEUTfQRR%2Bw7ogrzTPpxj91ugPNE0q0NEwhR11TDBYazTgxgMIYZvz15mpe9u%2FFvVoD3IrwPpz8MRhDm0zxLQnluBhodZv9KycqAcWar%2FN7JH4%2BKhaVshCuBXj28okK4Uzf7ROVFhTLOn%2BT%2FSInyGCXSIZ6POt6K%2FLCvjGOE7ZQZqI9cud6DmyMf5V2ubfFjQsAwTC1igs4qeMn2FKMZpLCDLBmoo4fREb7NMDdQsBVeHmHgwdBVXo24DFB8b9ey1GMya5wL38UGfchGnAp%2B97lfJrukj3wi3qBsr7E0PoBX9FNZG9BQDdD3tqrHvmsB98%2B6moQHS22y5EL0oFG4kSuiy7pUNTF3%2B7rvP89H5PTvBRRMbcHMJ7p5s4GOqUBtdkVZb19xtXTQKiJnG7ysU1%2Bx5AC7gOQ%2F8BqojQaFuedtcpnt39tvFsTOVm20Y77rmhvkw3ylWTFy9EKMYcgCf0qMxnDCeSshcifJ6vKXEXh2qVT0I2USSsb0rsAJrlJIe%2FUd5Xrl1HUNWi1vDYtviEx1ZhrJKWVismAj4zL7dGmRPp6FwZ8oofQVzYLrkARYpuHY79BRtkNiH8xVjcngb%2Fdwq2p&X-Amz-Signature=adf306b49be35884a35a8bdf266edc3c36481f0d216957bd59afe8c4a7ae5956&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZS322REW%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQCIDs4f0IL0X9qkLaR%2BVRs4EUzn6Ji1tFoH9%2FE5rKdrZQIgU6bTnj2smhojqJfQeERzDNlzRWuV5YWNNLGm7wKpT0Qq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDJweajnUJYV5Z696tSrcA4puYj7joZII%2FCB3zOe3f1EF%2FlnJfxS%2B%2FbfqLscBxYP9PpTES2%2FzkSn9uGeWVPzsUGFBY46MP%2FSx0Td1NvmRS00mARl2mBBTWwgLajozCZOtQebYvTzS8HBO4z%2FBApbAsSjoIH7UWSjxsusInET92nQSxCmvvgLy8kSVpXEZi2VfjCKEwBsxa3nihfTQeYyC2a3LTh25c89XqDZlN4DDQHQIhw4YqfwTdx%2F1ZW7f9vLPVPlzTzyJL7ozgowSS1QcCLMLMRWzZFAhIy09KFlFlPZaQOVAzURgOUhQfu71p2NNYQiYpVdBoZGg7a9xRJKGC87i0EGWlAIkAGn%2BHBpgZqWywdZ7NI3g53SgsYjOGHATTI6Di4V0J2VKYitsccStCeD%2BAWroQuWznbL7pdZ2PRN4hXqT7%2B6KtFqizliCIpv0sVFoiH%2FXPTivha8U29utYDe%2B45sjQbIRQsVs9SbA3D5wpeMcSwonWE0aYm8wTMhSHYzyeG0FyHjHc7hA99geMAQ7JfPGuGhNWLCA15LcVXEAMK195owcUEEBER18zo%2FTG0qEsxNeqDHebMtTDPbHsUBD2cpWdcvaTpbe1F%2FVEhBVoJaarUkJOp5YE7fIaaT173%2BBKBylUijJlgRpMLbp5s4GOqUBsWcmILoSDk0ADhp0Y5P0YvCGEhoZEqAIwUgqgvvsgJvO5hdSNor3ncHYUOoxCuJvBRpJpJVpUF733Ycpxz2%2FjU6qKrFWumOvcu%2F9MAfdknhb%2F23vR5sw7PmHESsNOqf6R2Aei9%2BuB82Zoi%2BYgProbBO8f2iJUqh6QsBLzC9N2NWUcGmk%2Bf8iM4MgdIA8e2vriyC9C1e025wjRZQkfCs7pRhMLPEj&X-Amz-Signature=034cabc0d8a94c3141a04bd62e8e6f10382f6d07c033b1f40459914dd544b5a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZS322REW%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQCIDs4f0IL0X9qkLaR%2BVRs4EUzn6Ji1tFoH9%2FE5rKdrZQIgU6bTnj2smhojqJfQeERzDNlzRWuV5YWNNLGm7wKpT0Qq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDJweajnUJYV5Z696tSrcA4puYj7joZII%2FCB3zOe3f1EF%2FlnJfxS%2B%2FbfqLscBxYP9PpTES2%2FzkSn9uGeWVPzsUGFBY46MP%2FSx0Td1NvmRS00mARl2mBBTWwgLajozCZOtQebYvTzS8HBO4z%2FBApbAsSjoIH7UWSjxsusInET92nQSxCmvvgLy8kSVpXEZi2VfjCKEwBsxa3nihfTQeYyC2a3LTh25c89XqDZlN4DDQHQIhw4YqfwTdx%2F1ZW7f9vLPVPlzTzyJL7ozgowSS1QcCLMLMRWzZFAhIy09KFlFlPZaQOVAzURgOUhQfu71p2NNYQiYpVdBoZGg7a9xRJKGC87i0EGWlAIkAGn%2BHBpgZqWywdZ7NI3g53SgsYjOGHATTI6Di4V0J2VKYitsccStCeD%2BAWroQuWznbL7pdZ2PRN4hXqT7%2B6KtFqizliCIpv0sVFoiH%2FXPTivha8U29utYDe%2B45sjQbIRQsVs9SbA3D5wpeMcSwonWE0aYm8wTMhSHYzyeG0FyHjHc7hA99geMAQ7JfPGuGhNWLCA15LcVXEAMK195owcUEEBER18zo%2FTG0qEsxNeqDHebMtTDPbHsUBD2cpWdcvaTpbe1F%2FVEhBVoJaarUkJOp5YE7fIaaT173%2BBKBylUijJlgRpMLbp5s4GOqUBsWcmILoSDk0ADhp0Y5P0YvCGEhoZEqAIwUgqgvvsgJvO5hdSNor3ncHYUOoxCuJvBRpJpJVpUF733Ycpxz2%2FjU6qKrFWumOvcu%2F9MAfdknhb%2F23vR5sw7PmHESsNOqf6R2Aei9%2BuB82Zoi%2BYgProbBO8f2iJUqh6QsBLzC9N2NWUcGmk%2Bf8iM4MgdIA8e2vriyC9C1e025wjRZQkfCs7pRhMLPEj&X-Amz-Signature=1782772a907fa13aa6848cf4a8ac6ed1bc71d5121ddb88db0d16abc975523ba6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RAMUW3K4%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQDZlYtTHhUXfv9SS2dhZ6fsaDTBTGAGaRui58Jg%2Fa0JDwIgT2BjmLISZkoEBIPVqHr%2BfxgjLBwmXbUQe2afZQd64CUq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDHJoTaHJnG4Gqc0vvyrcAz96je1U6ujmRtYpAo1iQF73dIvc%2BLYQyGpJYovSfKlvN3QUM38y8A0sNFVB5xP5mPf8dxJPTIQhAfbYUKZuy5AaOrb0BXKo7H%2BcB7olX5COsbStdZHkSZOykLU%2FIt5Yp4ZjuCeNbcjjZD7M9rF0d5OUM80rbrT5dAEgpFRc73N5aYbxpm2857ealXZwehwAxntaLqtxjzi9NrGhGRu%2BnNYJv3KvZP06ZS7i0hhR6KB%2BG%2BddWOD5w%2Bj6vCgf0YBIhMCP589ECFaLM6MENxL6NgLXxwytgcU6vrRsN32TzWU7OWH3YW0ibPGmF%2FYfaXzGYV6pC6ndGKxtL1i4yAlnQAyP2hQ0g1J%2BVrIaVBbwlJ0qsgbF6nTV7l16oE61FTMwPqIaGffXUBNlp9p02x%2BuabbsGcwR5t4QImK4cQCir%2B5AiP6LW7d2xT5Nhlk9eTGjZDqHTIJVIGYjFA8W0fcQE8CWKK%2F%2FVpB0xWn7C4i5VmhkzwX5VT4Pr2GJha4S8In%2Bcw4dMm4kskRTlwz%2Fac%2BcM9q0qSDLiW8sEj1myANMZ11SIvJitZJ8VBEFhTUs4Srnq2c73ob875%2F95Z18FN1Pm418Wep616JmTlRGVQMRhd5FkKWSGeuGGBA3RQE3ML3q5s4GOqUBhcIMR3eHefmiSSFpycPYvo3SanWA0e0oHIb0xd2GzY33nS3YhtyP859NEC5PhY2AbpaRykhxi3OGpNrkQqRZoC%2FRNxrK3wRhgrBJL2ddUCqTqkbBN%2FxZQR%2F3il7wQ1PjxnW2fZE53jWXAVxqbGY8O0bdVYUuWcMs21IfHhhDGwxVZNmUyDCbZa1IV5vuvRub0GDKZPk9l0nyUtxKwADbV6tzE8yB&X-Amz-Signature=b60cce7e3f2a9d885b6f4841b55533887eff1b89d12f8b16fb33d7df491a21ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XCZZYRIJ%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQC7aEEN%2FnBPIxrG6rm1ViJsedSUyc8QS%2F5DQC5RdWlHmAIgAYso1AKfyWc6FpGABgZLsMPX0szGU4i6szhRkEj69B4q%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDMYtjIbQKeex%2BWPvzircA%2BBELCgO4yL1uxmzamGvVQgZ4IVRL5hHZEOppZR9RuLuR1KCgP7FUtY10tyXO8%2FJvr%2BaXJ4GPtkvFbkMjZQYb%2F9jHuoS1hOokzFTMke1KAO5886lvyOZhbfLDHZF39BlMVy98Qhces9ar1zgtqlcNsIO8dc%2FRpCqlzuFTGcC0cbKJQQq0TfMUZaKq%2FA4oPTP3SiRdW4PxhK2PsORu0glklKIv5Gq6HvLLWa3eszKUJtwwlGtKSLzxvQ1aHuTiJAWLQqxjGPqPpNgSnADG1rAsIWAcKhcc4tBW1OmSRH8A%2Bd36xuQ3G%2FogAlfUzH6rqWZyf9orTD9d4PmMICdEQv%2B9zpurpGMOqW5HquW74rXmu82lWWA1ZAoJTOO4CLZvL1CycDyncAzaNqY%2FQObKgfE%2BGkHcQ1KCHGGy9JU1LPhNYzzsOxGqAm1GZ%2BNnwn12URUGdnP4WJJtZZsjceu%2BQYO%2B61hfXNdhuN5frgg7Ewkq7Yfl1RBn47j5hm8B6O1njRqgfJEco3PLMwBeV8e038ViCc6N8AmfYmcx1LN2Qk%2BtF2iAT3omzsg0SbaEpwCsBJqCYVWjhohg%2BQrF6b60Divg39VuRYTH5%2FaqG26lFfEfATgB%2BqetSzeGHiBInDIMO7p5s4GOqUB3Fd4DPqpcjhzeKoo2EQfDkg2A7ml4ciojZlORp1WN5QpvOcdGS4faoPJEy4WZaFRpXz6OBM2NW5B9HWVcag94fdU2m7zA22tCnBDPTuDA1er7zVepVFNnrRLavu0dUT6%2BJOKPS5EJxuksZwktCgNENTnxBzljINBryOOGS6SBRa%2FxQbnheWgQnblcKzXTPiGmpu468EQCn266FXstQLnO%2B%2Fb8eJ0&X-Amz-Signature=97a17540f7c30d1b5ddac4f791f43eeb750ced15e96fd57a01ad50fdbcb8a978&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKDIWH4B%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQDeN746Eb3DvJ%2BZtdwUtAkwr37vyAV6ami9VmuPWiH10wIgKYUtlfOPcIt5a6p0IfYNPfW6sJextffNDpUPUj3x14Eq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDMU9N8E2cFXOlMv80CrcA4B5PGFY4q5lvpoeM5uK6b8GbeoPoqVUQhEXDtqLqMnKmoWdtP4%2Fl%2BtHjVn2V1l1j4Jg8Z7xcmr%2BRys9nZBcR7Bqf32iRE1UmAE9EIattk3tA7l2QWfpWEL4EO0N1M5Ck%2BlCqAieT42nlPWRxQhJeexEoq%2FnsY5v6ddBsRIZVVrru3%2F36GyZMNQRGwWxrmRgLgzgq%2F9fold%2BKy3oa4kW6C1pJoeniKtRaAk0tQRVPWUL7ai6L69fKUR4whjl%2F0%2Bxfuj4EpInIIMV1Zm6aAd0xT1gmYaa7g1VFgk8ir7nz31hF9SrgEsBeHCzLP48JNM4yWwwlXO4kAkMq5DStOPD5CQzBSKyBzzvGAtN7NLDtUMn2ol9nrWG2ycK7VzmZ6aC%2BDIXW5W4Iptarip8If1rITbsJGbRMznUGvk4yymuxmEvPOkmGaL4nQYcgr6%2FU%2Bt62Fnpz%2FxRjSldJ%2FHYPP3gNnuc2lXR1P96cKgZGhOPFIAxe%2FQqAJmtEFIWEST2RhKjAKx6WFIZxt2gVi5ban%2FO5hCBuWj51%2FTSiPrwzQVZfFZklOwdzp9UHftEAr%2Fp9NglWrNGzhEAKrVACJRybvKpQceZAXUoeGkd9T1mN%2B9zWwVQCQzlgMh1inmGXutwMLvq5s4GOqUBnYT8taSPIW2629LD24PqOXN3I8wil9PZrjqAO31pPzXPZQDv1pQpJIC57kJPfreh2prFKWEjFi4u2StRpVwaQxrPjBrS0QMzM2T8NfifejskRE4xKxOzN7LKq3UKv0E2KFFNEVUdctkYclzBBg%2FMy%2FtVGSoOdKmXReDLqDonoyFuyoSYxk%2BPmBCfTJe0664ypkJtWI9ok5Tf2rg5Xv8gkR9HxRlT&X-Amz-Signature=3bf9a62701fdb33548f0568658d4a10dbf51241af5b422f36186bdd3bb0b2468&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664R6L26TQ%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIEFyojgkDNNIxXKoThjn4mQQNTNiM3K5VhR7eRgNztL%2FAiEAqzxyRsn%2FhaRmP7lyN8wxurRdcIjqGXzlSeF1HGxCaJ8q%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDJNepGzz2XJX7FX6KCrcAxSivWNTdYx%2BfgAAa1FgBy5Cf9yZ%2BFWlGowRNCcYQIWQtgQRGUVZzSTUlitubCH%2BxraFPkLVDydDFpg3w5z3dbNtpyQ6lvRbWLah%2BedhZWKMVX0S1ahmIZAV3jlU1gOaTEygBvbQ5IT6wU8%2FVsC2tKezlq8kVPL%2FWXX7H3fUnUTK%2B0Xa7pRY7mWkC9E4aN4fAJfXQ6QEk%2FNO02yoVsKzrZJUH1QSByg7lJKZEWifSoES6J%2FoSQc8VHw7BUlHdodmkIz4QmMqs84%2FlpWSI%2FvthpmuU2fyRWooTGkmeaLXiKHrAzrjdFr1NnoFC342nUHkZ4w7biR079F35gSCZuJYni8aU6qipFqXKM65l16%2BDru%2F1jpmTd6SG7tsyCWDjY42P%2FqGoMfQt940kvTi9XwxWH%2Bzp%2FZtHupqCeHpdCPEdMS6r7wgreXghMxuNPbQ30gRMNPhv8wewc1A95ABF4EWUftWiqM2SUA%2Fbs3A9RzNCKDpsZATQFul8ztgEZrK%2BjqhXw76j%2BoNQKCEa41p9BbQyIiYYeH9uN2ZUjjB9VXYz5zcUDu9XEksIlXtR7eecRxzFy6gMyKWTtTdc4LBXLxk0MxF1mBAfRWEhED0XdCcGP7bpdHGD7MKCBIRoh6oMNDp5s4GOqUBAJLk8Lt27WJvMJOUp%2FjmVHC6b5FqPuO6r6z3gL4FPYYtzoeAFpBLbfVjkE%2B9ekQNvP5gDaQS%2F0EIvD4rkTNQmd4ihJmWS3OkMtc8hAhrdjk2nU4s1PWK0nrLktGnpbL%2Bkr2yxD5MYNWa1nKsk1XUa%2B8HS8Lm8yZwsJV4zZTAOs6xzKgAW4Qv4sYKIgkIz6ZKgQy22iLrcyZTnYh5MfOGfAFCOTVi&X-Amz-Signature=8f888f7fdcef52b406644e14a8b5c7be00e8b08b6d4f3e9626ea7404791f05c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667QPDL2BZ%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIDnA8pYwDZIS7jflRBssqK96D8pP7JPEPGhVQicCeFhyAiEAwDfEOu4XGY35egCAPfJSysY8oParXm%2ButoGbHC2fQVYq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDKcIA8FNwWgHhfS%2FNCrcA7qPIZDBzHA3pAdvb814l%2BZXmeN0P05N2aBzJ8QDt7tFChFiBZPzZUUfsztK3YqSa9AZt5%2FzDEZ0AuxDqQaz3r5epT6QU2S%2BzmGCSt03mQZUiPeSEeO64KiNJ4Or9L4JqoYP9gLGNZ1A2nxa0QBM85wdZjIw4bHtGz8phoerpCBvWMxtmx7REATgV3wOn4alsATGsvk4VQknE9rZla%2B1cRyY3H90avklBcdG0NS1XB02UKqGm%2BC6%2BPCrYCQd7eohxxO1JiXj%2FeQsXM9%2BI28vkAsn2IJ43cEkjFmFs%2Bws9%2FWWzTPqhNeHYkX35dWaukVD5vV%2BUnZEv50Z5f5GxGEJUbhv0L8T3y8VV8xT8eRE5oOFHBhhxBhK%2FcJ0BGSQf9VXM5KGDT%2B8hTijDs%2BbthvI5Hrwg9b9rTuk0kf9%2Bl7iYJlFW9gVuBBfeqkmYf5OpTy13tASTlgZ95uQDdDCgyCgufIOPe8CXYtPWWZ9tXv9UqyMvPiSy9oi3kxi65f1H5D%2BtgLGNGE8GefxrLnuQgbl55ir6ZNBRHDwhmz5FZsJ%2BgTfW3hXScZV0zs4DEx2EbTs0yf9biWEIrUswGL9cisRXSs2UxudVEEx9Ls7jS0CVJFhCw%2FLljpeNK2kuwc4MOjp5s4GOqUBcdDLq5qCgubrKsNHQbt82CR7rjMv6xlLBoo7ywZ6u%2BE1y9wV2E5V%2FT5AIoYvSESfNnW%2FK5aul3gDCtCyQEa2e%2FsrYM%2FFFIim1GUswtXEpqhxd1C1Q5wz0SKnXsT1Qo2nLfOaGEpmHHbMmwmBW9bq2BGHtc1OsPFKVOw%2BIr2qOqcaaEhnFYsbEtr9zr2UL%2FZr0GaYGstB6ZT5lvVOz5YyafFlDEDK&X-Amz-Signature=16c2fe3a9862c9c46cacf8e257c127c21d3ca3bb503bdb2c19274c41e5a6c133&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZS322REW%2F20260411%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260411T032131Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHMaCXVzLXdlc3QtMiJHMEUCIQCIDs4f0IL0X9qkLaR%2BVRs4EUzn6Ji1tFoH9%2FE5rKdrZQIgU6bTnj2smhojqJfQeERzDNlzRWuV5YWNNLGm7wKpT0Qq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDJweajnUJYV5Z696tSrcA4puYj7joZII%2FCB3zOe3f1EF%2FlnJfxS%2B%2FbfqLscBxYP9PpTES2%2FzkSn9uGeWVPzsUGFBY46MP%2FSx0Td1NvmRS00mARl2mBBTWwgLajozCZOtQebYvTzS8HBO4z%2FBApbAsSjoIH7UWSjxsusInET92nQSxCmvvgLy8kSVpXEZi2VfjCKEwBsxa3nihfTQeYyC2a3LTh25c89XqDZlN4DDQHQIhw4YqfwTdx%2F1ZW7f9vLPVPlzTzyJL7ozgowSS1QcCLMLMRWzZFAhIy09KFlFlPZaQOVAzURgOUhQfu71p2NNYQiYpVdBoZGg7a9xRJKGC87i0EGWlAIkAGn%2BHBpgZqWywdZ7NI3g53SgsYjOGHATTI6Di4V0J2VKYitsccStCeD%2BAWroQuWznbL7pdZ2PRN4hXqT7%2B6KtFqizliCIpv0sVFoiH%2FXPTivha8U29utYDe%2B45sjQbIRQsVs9SbA3D5wpeMcSwonWE0aYm8wTMhSHYzyeG0FyHjHc7hA99geMAQ7JfPGuGhNWLCA15LcVXEAMK195owcUEEBER18zo%2FTG0qEsxNeqDHebMtTDPbHsUBD2cpWdcvaTpbe1F%2FVEhBVoJaarUkJOp5YE7fIaaT173%2BBKBylUijJlgRpMLbp5s4GOqUBsWcmILoSDk0ADhp0Y5P0YvCGEhoZEqAIwUgqgvvsgJvO5hdSNor3ncHYUOoxCuJvBRpJpJVpUF733Ycpxz2%2FjU6qKrFWumOvcu%2F9MAfdknhb%2F23vR5sw7PmHESsNOqf6R2Aei9%2BuB82Zoi%2BYgProbBO8f2iJUqh6QsBLzC9N2NWUcGmk%2Bf8iM4MgdIA8e2vriyC9C1e025wjRZQkfCs7pRhMLPEj&X-Amz-Signature=aef682a1b6e1860230bbfda9d6cc7b9111c9e807f4dea42d4d8b42a4eb846595&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
