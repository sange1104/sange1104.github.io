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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667AWMQIVW%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIEBbteGjSFkiEMwR8PUYSSWMUGrXuGPacZMhsw9%2Bn3acAiEAzGn1Ga1i%2BsiN6x%2F7%2FWmHPMyJvdlBdTaOuINoMoCN1d4q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDNH7HKWXYI9FEIVQjCrcAxrBOf1MXR5MsrlihttD4MJXrX7JpwiANeLTb7%2FqxU7VHAmTeCQ7B0DoEHImowJO%2BHPVbHhPKq5IXcLb4bHL04bXEXnxD%2FuxYTWtcquiMQ0Cb3i7CD2ZBXoYVorFn0yERyStME2GhPl2I9IHgh0pFJMu9ktGyb6Y%2Fra3CxbPNtRIt7nyqst4rV8%2BD5NrZeybF6jEm2J7SxHBMdt8cS7qK%2BqKs2terM7uM2kwq%2BQi1wx0ixYgcMxQYgf4XX7KHaG47l1LEWaRv23N%2FeQLdeg0sI0kx8aOulWyjrag079mrdA5UGoqql0rf20nLdBHN8%2FfEmqLbr%2Fhp0PX56JMnlHuMG26yiDWfLgidNt6viBuxzY9AR1V4%2BzCfzrcf3vqWYjclzcc5i4x%2F6qERpvt9bkjZ%2F7Na4VLtm1PAY4WvlWP2Py6hrXTGo9M1t01nKp7gp9zTiMvnSn5RaGM99t2r0nHg3d%2BKbE1u0%2BH5XXX4dggaaR6q1XH197E2iARUd9q7j%2FrUkPShV6yFmiRbYQfg88wmqhpvaXntMOVpcb3gqZL07TFrkU1v%2FwimyY9NoI4FgkKMyskcfje%2Byd9fRYUVz5NsAwKrHFSPQzolpyX34ZGOAPMA%2B8LyWt%2Fsm2ATLV%2FMJyUyswGOqUBKvVSdH4rEsRNrb6otJLiwUHC7f2RYM34ZHLj%2FlkobCa4iH08B%2BIB%2FR2e8NjGP%2BDnTm2VKFAsMz7ucXRT9z%2FCPUjtOjy%2FpQ9ZSYwAuyeDtucfxsxINGMuVe9lBv%2BA36tKTLPDaNMbvigrwTRcozrHRxoeSD5i%2Bvzr3wlAatTkAkxSKqDyf5fTzEVqKenEio93t44FfTTvldJsLBPj0HUq4sq%2FGIW5&X-Amz-Signature=73571f657129fdf2e90f2ff25fbd6864f35c33d1bfa1308a083fc9e92af64f2a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XKM7TTU7%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIHdYh9QshQ6dhh8HUp9EKFYdzc79X6qhSjMV7Tv9BsUYAiEArA6kMkghIa8RS1s%2BQl9dCmHemaersr588d8wzlrGIIQq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDL8Dkj0DL2wN1JvBRyrcA9unR8p%2FVEKSvG4MPpqH0B0%2FgAFQHT3Ug5YzrMYlHt3%2BuS6%2F8T2aG4WANSf%2BGlbS%2Bwugvi5369RzdpteOK9E7q38c0FD%2FR6rfxfc0%2Bc7zTlc7gfCBt7ZTk7oSd6lgF1iDLzqjg3Ioos3K98QggdZ8Zju1B1LoXkIIELrjWksY3QTQQ%2F3finHLmdyL%2BpVzw8GrYFBYs8Qxs0hxX8SOkeSWAEGVO%2BIfow35F%2BH9ImbRhhgUc9IcyPEuBU8cjII%2FuxLBNpPdPJUCsO%2Fcy66tAVX3BS98Ad3PLcGXp8SE1xQ73QWJYqN%2BpHVIF0uXkATMnrkPWgE29xRMMB4ZBKKGbgWpRr0Nq1i%2B5bvl97CGQ%2FzmFquqYnAJFqnGHiTj6Rhu2tFswtCOMLYYwFvdcNrkotFeFtuUUpXafMazGbJu0E7GszV37ZPTvfTwLTyaD2jqHJ%2FPf81ov0dG1%2FNnxBqM5dKumNN709738OLWsSt2yNNhphjSoBwzExXEM8CHXunGmFxgPJwKv5QNU1QJX9plR5Db4rjI5fL3R7aiRDyxrfZ4zGwlnOX7MBXXJSFFGDMZhcWm9YqhsjZ3J%2FqNz52R7jCvEAHnlfl2hidAYQX%2BvLm3F8p5OaeiZ5xsVV11f1OMPuUyswGOqUBDqqdN5j0ifoNTHIB8VlK340%2FYa0QZgd4D4dUcx6ZKN64aWcl2MqJyYdCZnMv5wEFMjAI8C9gLc7eA8HuMgrnLhfuhrFARUVBYZtS0zUcIVUv6IXN8vjWzFyU0wEbP1lpo4Jc%2Bcq6XTbk1mhfpABOkQtGgTV0K9gyejPrefDB2%2FICWnzrR0cpsCGfuOESG%2FVKQT7kkE43TwzXZ3pMqDFPmc7rRnBt&X-Amz-Signature=140e1b57a0392d4c7b1cdacc53c84e304f04e50760aa4c473bb88b0f0e2e8cec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662FRV27K4%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQDeqFWAQQeW2h8aeWdgK0lTqg%2FTOycBTJWjijEo2HE%2FjgIhAPguoMNNarMCIG3o5hmXl3I0cwVSb8x6R9UglOvPckxGKv8DCCwQABoMNjM3NDIzMTgzODA1IgxE%2BGn81hdoysw0luoq3AO91aAJUrcanT2h38bya6EnqQVHrngC%2BstOZhDVoFj1J8Su2ROuqYD41vTYwLs4tQ0UAPeLcF52pcqZGo%2BrM%2F5OQveneEXZAa5ZcjypqGZAA5W9GaNGzvO%2FAm714QdolJsZWD3R%2BoahtPEnvD37PK8nASxyCexQBghz860Ysmw5JztePb2XDjsU6Yn8HEvH%2F%2FP7I21PmErbIPWWIGj4FSFEHowQj2pYJRzf8PRVGMsG31ca5RIIiIR5W7h94jaXVljzXHx6gRCIVUZFGSKgBYxrQkiWz3k6hR9%2F2CKx5YWxoyHsi99lvlG%2F2gMDUufLwANss7XaM06n6vH9Zn0ukjxDtfqYuNoReBDXoWhFd1DeA9ZCZ9ZbTkhRz6eo1mouH65ugA44KXq%2FL0DM9NhLXGfkXgN%2FOpUHC25Ip6bpeITG5Nlg0Wm%2Bsxrw0YifZqGah8nyqse76YhjJOiRiFwcu%2BjfVB2YPrkJWGChJ8gCgvddpJhsXhD%2BsEc8qBYDMeLmcqwyE7sMlwDpxK9yBBBv%2F526HWGyPdUn1p2ue1aF3jskfelZAqNe0NF9%2FykoRwCIyDhwJ5SeMCWS15xq51JtUCil6JpNOg3DZU3nHlwes%2FnhIRieXB4IyDB92Na5sTDolMrMBjqkAUDRCCqfDcxp1WeESEhzoPyVxc3Zh0b6bzfZjZ4hetVqWy9XQmxcGFQtcgLc1wr%2FEJaKY1i%2FCQWUOs%2FBvXRGvxR8zrzzjEJdg%2F%2BCeF9tcEsZdjun2OkPJGDFRkzeB5RYju92aZEqEwAADp1pcppH2n8XpuyoaqNiNb%2BWNUIVmmqSW4caqOlejavXNDAa4GQkHJ598MAPMMcLDZ0iURLrttgHH2vj&X-Amz-Signature=4eea7d164d1880a30e5d0efdde48d6327e4d97cdcfadaa15c0042fd0fa028dd7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662FRV27K4%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQDeqFWAQQeW2h8aeWdgK0lTqg%2FTOycBTJWjijEo2HE%2FjgIhAPguoMNNarMCIG3o5hmXl3I0cwVSb8x6R9UglOvPckxGKv8DCCwQABoMNjM3NDIzMTgzODA1IgxE%2BGn81hdoysw0luoq3AO91aAJUrcanT2h38bya6EnqQVHrngC%2BstOZhDVoFj1J8Su2ROuqYD41vTYwLs4tQ0UAPeLcF52pcqZGo%2BrM%2F5OQveneEXZAa5ZcjypqGZAA5W9GaNGzvO%2FAm714QdolJsZWD3R%2BoahtPEnvD37PK8nASxyCexQBghz860Ysmw5JztePb2XDjsU6Yn8HEvH%2F%2FP7I21PmErbIPWWIGj4FSFEHowQj2pYJRzf8PRVGMsG31ca5RIIiIR5W7h94jaXVljzXHx6gRCIVUZFGSKgBYxrQkiWz3k6hR9%2F2CKx5YWxoyHsi99lvlG%2F2gMDUufLwANss7XaM06n6vH9Zn0ukjxDtfqYuNoReBDXoWhFd1DeA9ZCZ9ZbTkhRz6eo1mouH65ugA44KXq%2FL0DM9NhLXGfkXgN%2FOpUHC25Ip6bpeITG5Nlg0Wm%2Bsxrw0YifZqGah8nyqse76YhjJOiRiFwcu%2BjfVB2YPrkJWGChJ8gCgvddpJhsXhD%2BsEc8qBYDMeLmcqwyE7sMlwDpxK9yBBBv%2F526HWGyPdUn1p2ue1aF3jskfelZAqNe0NF9%2FykoRwCIyDhwJ5SeMCWS15xq51JtUCil6JpNOg3DZU3nHlwes%2FnhIRieXB4IyDB92Na5sTDolMrMBjqkAUDRCCqfDcxp1WeESEhzoPyVxc3Zh0b6bzfZjZ4hetVqWy9XQmxcGFQtcgLc1wr%2FEJaKY1i%2FCQWUOs%2FBvXRGvxR8zrzzjEJdg%2F%2BCeF9tcEsZdjun2OkPJGDFRkzeB5RYju92aZEqEwAADp1pcppH2n8XpuyoaqNiNb%2BWNUIVmmqSW4caqOlejavXNDAa4GQkHJ598MAPMMcLDZ0iURLrttgHH2vj&X-Amz-Signature=bc62acecbdb97bb49164d7a6ce67133bda1c3eeb6a5bca970f59427732f34cd5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RZSZD7A%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031939Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIHpyLUwRegy%2B25X7vO%2Fom%2BU0a13po%2FjOhD1Twuz0P2IgAiAIIbVCENgqqs9plUJfQkQTqDX082QnfFvE2igOmKSvNSr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIM2h3DW8zrn20RY6epKtwD%2Fya9XVfoz7CMQQYJXZjDRGiuGuVRJgdl6wc%2Fzm%2BLv3VupGEiKBEyH%2B5PqxgYb72XjOmjp%2BKj1w%2BulY5J72nFEP4XLWmRri17gC6RB2jzgeLj0O%2F%2F%2FgM9ziSk%2Br4YBnP2rgZtN5y3UiXH57CeKt3BNa5R15jSuzQRcU26uLBno99v8JbNdejjFqZ%2BHYHaFxQsEfxsH0T5I7pBZ%2FTh6bTCLvfVAKmxqGtffBVtp6fRlRrCOfr3VhxpxOID2cg0bxOLNPAha1dsJTs81PKmvfLyAIDoFPa6YivJ958H7DnqDhhDWa0BcAn3pSKa6nfZ8XGftTASHtm%2BwAP7RoELfhzRgCyabJWLSQXeOUXoa6vv7TN7Ojc%2FrlslOObqptaFnT0Aq7RLjIdqEDSIX4oOcb7s5gINHnXfkdZ0%2BBSXCYPKzZqK6MwDHLys%2F94Dj9t50nrtiXyzgO7Tw6xIpz3KgEkS3AxEK1jKzJ16PIPuwVJCpOeOJm83Ygs1hDymOahBbT6%2B21MEWo5QM66m46tmAQBOFhLfzujLLoXpY3mMDf%2BwnxQmDJX%2FRqK85Wa3Ajd3Y4PJths3yXmq%2F%2BfR6e8JFLU3PQEoamDuartnKjJqE7ClRpPEfj90tVwjebxyivcwzZTKzAY6pgEhAqO3dMmCgffMX8JaF1yhO9x%2BEmPN7j4Akma2nLMSC%2BfuBuhB8nTs%2BhiyjoBZxYt15Q7RmMo%2BE0T8ridphCHBGvktvR6zno6hGf851mibBJ36aIzx7na5avaIeFBgcGtncIlkG8W067umg8YRPqHoWVf%2BUvgbP%2Fd%2FLuDa0S2%2Fmk0FwB7qvd4bftNxoJkjUsq7USAWvPNV0tPhMoEKkGh%2FJqkUvnlm&X-Amz-Signature=b2592d786c4c1278bb2a78515af6b6a3bab976472da6c7b5ced961cf3f0dddf3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YLVBCR27%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031941Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCICUH2VCajMWmo88PsmoUIjJpds4Qf0hk%2FKKs1QiVpUqLAiBry8tjQZnWlN5KsQm%2BTmIED%2FjyZQFsFSJhNlhdVrAJ%2BCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMsF8%2BI%2Bi9Cf73cVICKtwDFVudIc%2Bwx2Yp%2BjtG9wW4Awvif6RIprHDgENlvBRTP3H4rI7j6CxIXOezdb%2BTevuMszvo48Gvry23Q%2FWr03ExZI9lpdrfNxrQmDqtZa8qcObhWxXwo%2FhW3GvXgSDyA8O5lY3uLXbQ3TNd0gt28BBaHjhT8Ovem5%2FTmMqEHvnOohCn%2BLO4XdyCXmkkqGJjPpj1PyWm%2FEh6Y9rowaxH0ga%2FKExKdARm%2FuG9eKnlhmxSY5BkvVf%2BMcYlLWd73KlvTa7d%2Bx6XbMlCBkRrJMtS6edBifzqfUh4ql6LBZEUOPXG4fdAJc0D%2BwGjtMFkVmBFq%2FbZqBcJEu8eEXzI2Y9LHdgTxCPmDLCLDCTdlGVk2KJ%2FLqT3g0uTwkOdp0NyXXBHq6YQH3yS1dXCNG%2BZfW7LkBLQRnU8%2FAO4YIYFfieeR%2BskHSYlBJGZHGNNDCJ4X%2BDE%2B7R10dLSfOBjXToa%2B1iCYvk217daQ32iCYqL%2FpRBzNV9hxz74RWWnTViOcIpjOsUPpM%2FGl%2B5pH7KIG%2Bs7FAzp4lhgFAQcfrH6ZS6wbvPgpD%2F71VMECdQRGIrbcI1yC4czFjQd13GCo%2BS0Hb3OCJpRglbN8lv%2BlAN13IDBnl%2BMZdvV%2FkkTc%2BhFIZ5JHhNeBswg5TKzAY6pgFfd2ueqAsX%2F4WZng9f%2B5lZLCpDzOGBWLK216p%2FVN1H41k%2BU9XrQdRS9J8LmLBj45kGEUDn31xPUHTcrNlaE9dVskIzgwupPP5DPpc3H7HmKiDayydBcEMqqhbTUHNZ4gYCUVivi4mDbmzPg7TPRHRZDXtmsg2ZQI3Qat%2BbXKdhW4VTL8aps2joaCJE9jr0QO7KjcSRCKh482vZ9aVONP%2BJoXniCID%2B&X-Amz-Signature=45bf22345de31f2a5d826fd18a44aad92bd0f61a40692d91ab3279485c2cf7de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MFYFWDH%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCwhvgfR0LIHE%2FkKRe6g9980QApO4nPLf1T%2FiRA4QC3%2BgIgT4Xev6QNyFRl7SA3hSZSKFjElUcxpKTlZWEItrtTRUEq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDM7IR89iOg02xR3R%2FSrcA8Mk48WAlosXJb%2BKo3mRmLaehmZBfswWrxgPdP9uhOsh1bG5EejX9IvytX76tuJpxUdzTbdSq2K49%2BwwlxzJdEcoKrG7UkiKMAYs9%2F33KAW4T%2B4qQKAle7LTQ6K5onq1YLDwu8Qq4q1M4tUis1lPvC%2FaQWz%2FM9PZ1IWrzcLv6YPR%2FNUE%2F3xjWoCJaFXaiKZS%2FYaFtVN6Tug%2BJzWXPc14Ep%2BrjbiT4kKzigtaSgyWnvVeDt4srSgyn644S6oq0r%2BOqlyJFMdSq2BWksygwUGVdK1Neh7dmpUFaj%2F1r458jaOXDGHN9MSfmjaOEKpxN4JCBxrqNninxaSLMiTcfpCf9LFCt1kihHoRITAIjCpObsroz4XZx%2B9sCFH2jFTjLOxq%2FGYbOXYy1Z4l8eJYpgrjd0ZmfbThK2hAC%2BFQNs6KLz8yAOVxPXKdv3fkiI8Xh55wT29UzZBTPUposiXAQbU2CzSyL7Dxl5xYbgP515s%2B60fHPwhiFibm%2Ft2V1ECImIcC0l19x4vnWHkqjvKYGoUZnCExeDzni36ZPF73K0uvTsKBKoDt6rrVZddRRcnYNj6z163oSeffPHZEgndsp%2FACy2HMyrkOrrtxgZpRZuFTHCgy%2FQMrJ2bec%2BuWJ4KzMMyUyswGOqUBzm22WrjEwtN%2FnmSLEc8%2BfJHwfyfibAJAXgFQoujahRE%2FEQmBu19zpiNvehEDUvr9v2cePS0kVEBv0uG%2FKSdTH0ws8otCKIr4cD0ZaRAViifeePG637eIPhyREN8qaW2pRA0uy%2BdeKNX6zauMBNsEw6t4Fc5JOfaZVCo6wUnP0xDel1PW3nqnY1xmYNb8zhO0RFc2%2FUgihVT10w5jbYmeM6cmRhFq&X-Amz-Signature=db1d6d916b3c3d16858973b52dcf2f999bc8396d5cf2182d389d2caa0d0681f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZODLI6SN%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIDHexK1LJpTCPBXwXRRniGIVIxTq7VndfJxLu8rWpMWmAiEA8sTNt9YvV4RNjPe9hr5wUddjj4cW9OsY6SNmc%2FHGWe8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDM0BJvEdscppa6WRfyrcA5V2CL4TnCdaEgNoXTaBenU793Tf5y8%2F9qqL2vpGnFIDcNRRyJDUuJvDAvdUXKlPJpiPobiAsQEkiNz6U%2F5wolFmOEVkIv9qJLl7IzKnne3N%2FcN6mh5NVhwMabLGOYut6KcXS6Elgo1c6blvlKR4eIJlvXRs6fpQckuleL0yS6wphBpAGfGjVoy6PD8ohjIP7PWHl4I19IChPTqB52k4D121POPQy7WSc5JDGwZCWiqh6Nu1sYMdKHP3ZvQZScKbNIU0%2FxlA2W9OPbP1pUosXGmjRh9Cs7Lz1voJ2eZNcqLAyfjwQpUQtSe6x9UpALQxFJclsg1KVIIi75FXwxXe7aGBMcnlv8PGj%2BlMsHKkrsyCglLyvRsVtx37maHIey%2FFp4tRlkwMFy3bS3ZEaW%2BcuxMbIOU%2BdOQbwu8jWSDPF6shkWQSotC7tLu1RdcXcVzRf7Qw1WMMMV%2FB73TFcBek%2FpzfO6g0Ty2w7jQxTxngz785wrwxWZeL93umHZjRu9oYo9jF0x6tVTPmEURLzmo1nlces1IL9HjvJYBLOGa%2FlibqYivm4KetFLAAT43OmSiOau1qjFk0nZXGvjKhvw8GVR8giuR4NcJzgyWmmx%2FDTYRiX%2Btg4JXclDn66b1gMLaUyswGOqUBOKp2bEBtrkD5LCfurJ1DIzg4W3YtoxOEYU18Mf42MIB6Hptd1wSqOVyjlT0UnvozOGLlU6RTNpUIHoibXVzS3Y5SkfkZU60p5hiyFxv%2BnUl%2FEKupWg6GyW5cS77xYLqNxaiWmLipSQwkSuZnlE4mRhtJz4EGzVn3YkT7qKPf68zfg9BSHNhWWbXsktWULexaMXWTRqeeUYJTUBQZvEXtk3OWaJpV&X-Amz-Signature=966c7be57b8162ef82cb1d45fb83e4527979bbd8303076f1339dd1e4f73b9026&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WV7F2V3H%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031942Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIBTomTBUQdNRIV4IZD%2BmrVWO4k3e7LmXYTSC%2F1Qsny2nAiEAt%2BMnUGzbCWY%2B8ar4kBGZhMDd6OrkXFvHi%2FJkv4Art8cq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDOetpB4S1lzjy9AsrircA4hbTuC5RjNbhi7%2BfQK3jgLqUwTLKzT9yvd3huSa1mtW%2FRQY%2BvTM3BAkQI6stOHSw9nRAiCY8PswfQGY%2BjIS6TqVHyLWH0umqKZX5Cnmy07Yh72Dfrm%2Bylhjb1vtmnZagb107a%2B1PYzuzY6yZnOVqHHzZBmTRk7hUJAfkm7AyUGb61TQH71o49uvW4i1y0VixU9jSpH5LsgyTf%2FPMkZvOR24Tqp5UUuuPREAFrJfP3g4wKpeCr3qdo%2F9u4I4666H5kp0e6m3lf7Q4BF1yw8%2FXWfo%2B0sIFQaEmVi7EGIsXFQ4rt7R7BCRR34S9Ypvm%2FdcIAXlKVadwOXFw5BZf6Nho3XOsE5TxCsWtdMh%2FwnxEQYemzhg%2B%2Fx2cYgWjivhJrLS2g0X5zU0Za2LVLieW%2BnwUlFE54qiYJS%2FoI9P81yuyFTlnMSZiqoQTxRVY7baW0Q7DpH0wnbeBae8D3eeq2VOd4BzTyzo3iyryUUxRc%2FsFMdEdS3u6h%2BpoKPG6IMmiP0Km8P0Eh00bZ%2Fc6EIaNB0z0sKNvWknPCe0Rw837jWqlufNRIMGymYItMA28oW6Pq%2BnPxYM7T7hTkpA3ImL8lbcCkiSxcHclJ10xaLk3MobmX6Blrt34nzSh9N4aoDsMJqUyswGOqUBsCS1bHmn%2BPh5%2BZU91XkasfbuvdE6cxRPamiNzglS%2FgxcKQARhydA%2FsMi0WXesNwQoQKYWkfuo716%2BTujWqlZpThTNKU4%2FoAZDUhyU0yIWCFA4Sw6acPWefq9v6dRJzEmIsDC%2FgA%2FdEb8pGXHL%2F0%2Br%2FldePKgAuy%2Bc8yehm3MgCyysE%2FstE0AT%2F8L4SAZDxQK%2BFR0YpU2r9GWezbkDVbmLkAgFbxt&X-Amz-Signature=b90f5d5c9b0efdb9b7e4195dde1c467dd11447d88cea7959b82a965320aec6f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662FRV27K4%2F20260216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260216T031920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQDeqFWAQQeW2h8aeWdgK0lTqg%2FTOycBTJWjijEo2HE%2FjgIhAPguoMNNarMCIG3o5hmXl3I0cwVSb8x6R9UglOvPckxGKv8DCCwQABoMNjM3NDIzMTgzODA1IgxE%2BGn81hdoysw0luoq3AO91aAJUrcanT2h38bya6EnqQVHrngC%2BstOZhDVoFj1J8Su2ROuqYD41vTYwLs4tQ0UAPeLcF52pcqZGo%2BrM%2F5OQveneEXZAa5ZcjypqGZAA5W9GaNGzvO%2FAm714QdolJsZWD3R%2BoahtPEnvD37PK8nASxyCexQBghz860Ysmw5JztePb2XDjsU6Yn8HEvH%2F%2FP7I21PmErbIPWWIGj4FSFEHowQj2pYJRzf8PRVGMsG31ca5RIIiIR5W7h94jaXVljzXHx6gRCIVUZFGSKgBYxrQkiWz3k6hR9%2F2CKx5YWxoyHsi99lvlG%2F2gMDUufLwANss7XaM06n6vH9Zn0ukjxDtfqYuNoReBDXoWhFd1DeA9ZCZ9ZbTkhRz6eo1mouH65ugA44KXq%2FL0DM9NhLXGfkXgN%2FOpUHC25Ip6bpeITG5Nlg0Wm%2Bsxrw0YifZqGah8nyqse76YhjJOiRiFwcu%2BjfVB2YPrkJWGChJ8gCgvddpJhsXhD%2BsEc8qBYDMeLmcqwyE7sMlwDpxK9yBBBv%2F526HWGyPdUn1p2ue1aF3jskfelZAqNe0NF9%2FykoRwCIyDhwJ5SeMCWS15xq51JtUCil6JpNOg3DZU3nHlwes%2FnhIRieXB4IyDB92Na5sTDolMrMBjqkAUDRCCqfDcxp1WeESEhzoPyVxc3Zh0b6bzfZjZ4hetVqWy9XQmxcGFQtcgLc1wr%2FEJaKY1i%2FCQWUOs%2FBvXRGvxR8zrzzjEJdg%2F%2BCeF9tcEsZdjun2OkPJGDFRkzeB5RYju92aZEqEwAADp1pcppH2n8XpuyoaqNiNb%2BWNUIVmmqSW4caqOlejavXNDAa4GQkHJ598MAPMMcLDZ0iURLrttgHH2vj&X-Amz-Signature=1880cf728e1c6eedb07dbc95aa2042f1885473ab57b977166a0dfb9bff24d568&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
