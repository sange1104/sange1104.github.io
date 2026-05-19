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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667RZZJXZG%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQDnd1%2BoalG5zA1H%2FfbRXK%2FHFquGV2l%2Bx5MH%2FSZnuP1LKAIgEdpLxxcA1lXGUGHQXYZBpLAygLuSkUoGfGh51jLD4qcqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKIounHttF4WHZ1H1ircA3H877wqjGViurZOxFnAVNCQ4LShus%2BJms9wTwPwy7N0upvr7xPpYC0%2B20MBOKgHerbMz1Bm8DDkNGBQhueTR8%2Bv14aco0Hf2c6NZV1inlVWHA5DMruu3HqLKQJlCSAVUNKX8npDqGNBPeWBEH%2BjE%2BFVB5QzBAeaNGESgKkK6x3nSnNJqDvB6KsJb0xxjTVW8yaSMY%2BxC7F5l8vS3I2dRegiQptEogELjYwl8%2FfInaKfFm60nga2%2B1fFkdm9TD0MCkPbxscLoP072Ilmu9efhavxpRZMaNkb1sE7Eep1%2FNGyVbtOsleivLdByukK6OMpVQMKcDqrmSl%2FQP%2BoOaIM909EJZWFhZw8Sq5sLEND4g4ivyvxG74cg7VNsI1KUVUIhTuKGJ2fVLBe93DO%2BXE%2B3mTKNhrw02k3wvxO2ndAKSpJacCgdK2xqSdxO5%2FWw42PMnQtDH%2BIQpnx9WW255gdjuJKUPt7J9YYTfbCBNyPqSpL%2BQ0WFdL1Nk6zayfq1tb1NJKyEeaYkCT01CZxWgLn4dK1AnZfoFk%2FTmRSEW1u2MtKDCrNpWwqT798ALjD0wbDlLsirjBmhQ5mfi7V%2Fj58YryuFJQA1dqQ2fbjQS4A2yg5GpRUwc0dOmds4wHZMIa5r9AGOqUBTs4K2zZYdCehgRwoJHKMWYkFU4q6025WRSLI6zUkRoYewxVu6bUW8UuRuAmoJ9igkvJtUvuTFKQn3atJ7LBGILvHRIhHZDYFgLegA%2BUkfc5GPBOlVO505YAYT1VnDkaCMx%2F2mhUunhzk4ZQ0ovKsNfNK6iAtVmZcRsgSd8ejJffbbeJNsaxL3NqrlqB6y1e2l2coqRXAjRr9Qwh%2Bj0%2BVCMxEYD0r&X-Amz-Signature=d523836ba944e194600f5bdb092f0c3a2dda5f5cb287987f94812c21368d9dea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y7XY7ZA2%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQDrltF%2FVT0D5cqEBZv5GMau3ZnH44jpSl3IHIGzjuNaSAIgW5Qlnufm5eA9qcmkeRjYeE25zcU6oG6ClQgrI750p2EqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDENpBYUKGX3O75c9tircA86jngppZ7KGRUHfbFOzA8sVo2IQLMIyRBCM5lPLeWNLYtVErD0efR2NojBhRQbNbJ45TQrZWBb4nEyurwJIOUrRQvmYY7LNU8L%2BGGqQPyDAPfshgqAOFM0vN%2BdGdQiMa9W2i1QGp8WvGigIVVfD93RSfu9Lmgfu2W%2FmCcdtTKpbhFu0t%2BXqHsTlMVoWzJAaayCdVKEsdmsj7bSolsJhAf0ZSTR4LYmd223r1dN8jXfzrwiIFOGP40Bfx8sIaEw797esXE9y%2BtJ5ipsMx9e5h2lbGL6cSOs97mZVsOnKnShXop9%2BUtqbntu97PcK95TK8X5fqStLdF%2BH%2Bzak4mY8l8%2F5U0I1wd7WuipBla7wFhDY9DXHlXz53XqlET2efAneo8qhtMmbSPf52AYuo%2FYKCwKEBEjsUOqHPv9NaJ8iBG4NXWrLUl19VDBvfl9xDVx0z3EFvsRsCkTpuyapJHGLTbBoR18MTxTY5LgLbXg3b8AzEc1a7HitOrTE3%2B9ooeQAQnXWL2ixRLAkGPA5pvS4XKmVxX0DFGLKzgcLxxVO0ctl5nHC%2FJLA6r5NvvNBK0ltCjhTC6xc7oHN8UqNaKqP0DNmroZ2J24jkK2U1V%2FcyAlk57l7pzcmuFdWF%2F2kMLy3r9AGOqUBBXeX7py6vqEtIrLEz4ptz4EI3aRJKWEZh4k%2FwZGubUlYupySn2wwOfK9FXw0KuFH%2F0qJIQT1IvYaKK6%2BcGkR3n96ga6gOdBcq17wzPYmkA3IurVcDESXk%2F%2Fs%2FgNb2cqFkaIDHGw0f%2FLoJTEloEOyvWsq2%2F9Y6aQSpoEzBw6wOrkDdPBSoHDL3lLupYJNWeH4Ryx0HRvGefGsrYhWL5KLdFAFoLOP&X-Amz-Signature=20593600cebcf7048c40ad1799f5caf822480ebd54f649e9a156fd554681cd53&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MYP6F5W%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIGW4tJwe51sU8DmbqTzGlja1ywlfmIDesGdQjvJ%2Bn1bmAiEApqtnhnvwzIOQhk0yYGnnLK4y4GGffK7HZs21c7NE4a8qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGd%2Ff2ykH8VTzLXSOyrcA78J9zEnXgsfN12M8UGabCRKyBCYKec001amOt9Fc%2FX3u7ewYkPzlnqSVNKVFeSTCF6mlGbkm5CL3XiTAN1Jx4vVs1iMFYWm4gzm0zSFSbFJns%2BWh4H9pyMw6pxMs2%2B4TldfYHMSySwGC9EP%2B9Cz1rrck6pjtooBapaUx3k3tj1bWuzhUBfTQZBLDXqSMtiKH18jJYM4d%2FClO1xBL3d9bud1JRTOPnaq23Wt5UFzgNeup90Q8M0uTThBch7sykYswW%2BxoeYlwdA03zD3D%2B2luONXqEduucqWuJza9mKJM%2F15j20z%2Fv0y4K2A5Me47acHdqh6MQe%2FFa5a2pq1bvwcSiJt7umXx64ZPiZQGL46lKkn3bshaUufU%2BvcYygogGoSxqm3I1FcS8O3LiyDOArAAt5dZZln3Nuws7FDQOCWuRewI4WnjX8mW0COqc%2FdFSg4QucskYwck2AYV0gynKVEatY5itWWhM6jnwv4G4dk%2Fi7oQrdhk1%2F6bW7IdBktzm7HwLYhUWG4sE5%2F39mjP2cFQ49VVIUuRBkRxD0dz%2FuxJ2KAGFfuzAKdJCsdVRE5MBQ9yVt3kgZVcQ4jCLcuP50ni%2BIeD6MfIJ1laLJYGy4PnTn9sNym%2FEzl6Hr%2FRBd0MNe3r9AGOqUBYAAO9Yl0GcSAC%2FIWL2UZ4Id2Vr3l%2FsimdzG3Pa7KltsHPbmAd%2BOxrjkrscM1aclvsr5XRvIc%2F6h%2BwyolIRwNqnc3qUOOGybtTL1Det8PRv6j%2BobKpUqHWXYMiSYL99WOxHSuMJBMM%2BrOFQW8wED9ER5Sazm6PeD%2B2x563%2BmuJrevzC6jiCQSLQqM%2FvughS0tbajjzp2GZTSYDAA0hsm6wv%2Bbir%2Bw&X-Amz-Signature=a71f81e56a772f1622c5e4cc61b38c5bfe608ac876edb2856631496494afbc85&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MYP6F5W%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIGW4tJwe51sU8DmbqTzGlja1ywlfmIDesGdQjvJ%2Bn1bmAiEApqtnhnvwzIOQhk0yYGnnLK4y4GGffK7HZs21c7NE4a8qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGd%2Ff2ykH8VTzLXSOyrcA78J9zEnXgsfN12M8UGabCRKyBCYKec001amOt9Fc%2FX3u7ewYkPzlnqSVNKVFeSTCF6mlGbkm5CL3XiTAN1Jx4vVs1iMFYWm4gzm0zSFSbFJns%2BWh4H9pyMw6pxMs2%2B4TldfYHMSySwGC9EP%2B9Cz1rrck6pjtooBapaUx3k3tj1bWuzhUBfTQZBLDXqSMtiKH18jJYM4d%2FClO1xBL3d9bud1JRTOPnaq23Wt5UFzgNeup90Q8M0uTThBch7sykYswW%2BxoeYlwdA03zD3D%2B2luONXqEduucqWuJza9mKJM%2F15j20z%2Fv0y4K2A5Me47acHdqh6MQe%2FFa5a2pq1bvwcSiJt7umXx64ZPiZQGL46lKkn3bshaUufU%2BvcYygogGoSxqm3I1FcS8O3LiyDOArAAt5dZZln3Nuws7FDQOCWuRewI4WnjX8mW0COqc%2FdFSg4QucskYwck2AYV0gynKVEatY5itWWhM6jnwv4G4dk%2Fi7oQrdhk1%2F6bW7IdBktzm7HwLYhUWG4sE5%2F39mjP2cFQ49VVIUuRBkRxD0dz%2FuxJ2KAGFfuzAKdJCsdVRE5MBQ9yVt3kgZVcQ4jCLcuP50ni%2BIeD6MfIJ1laLJYGy4PnTn9sNym%2FEzl6Hr%2FRBd0MNe3r9AGOqUBYAAO9Yl0GcSAC%2FIWL2UZ4Id2Vr3l%2FsimdzG3Pa7KltsHPbmAd%2BOxrjkrscM1aclvsr5XRvIc%2F6h%2BwyolIRwNqnc3qUOOGybtTL1Det8PRv6j%2BobKpUqHWXYMiSYL99WOxHSuMJBMM%2BrOFQW8wED9ER5Sazm6PeD%2B2x563%2BmuJrevzC6jiCQSLQqM%2FvughS0tbajjzp2GZTSYDAA0hsm6wv%2Bbir%2Bw&X-Amz-Signature=74b67e401666ea216d066f06913f5630b9ad38348e5ab8af5c39791dcfdc5f6d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T7KPLPGM%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043612Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQC62QRCEhkJg3b1FNCVMupu3WkaLQ6ZEr9B8wiIJMZ9IgIgQKVfYIQR3y%2ByQCnyQ1nOMMYpy5eqjcHZ5roguOoqSeEqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLuwxZbycZ58dO6D9SrcA40CP%2BJ0QhsOkvQ4KKzVEGHmlmKpkAU1FOV2Bnpeus0%2BfBTeqHOkAWSpOPYg5QZC0Th5YS9QsYnWfNxi4PaxEFCcX4OUOpwN9xIm40PYlkWL1ysLDyc377aikVF0FVtRZrBtYjzrhBK7fRKemfhCYnbvkIkeI0Kx6AL7cbm6%2B7h3b%2FN17kpl1WVLz5MfFHESHke3ZhH7abBR7kfaZO7qpVtjl4EoEb0jHL98jkWjweWYSmmyLHjcwLdCyKwNfMyV3qqxGgigoIagFN32p%2BjGI7Xn032FzQzM8nRno0TXfMPF8frpJpTCrvSnYikfBD6E0WzLOGjRavwRLwcmAx3vFAaz0AdmPM4d6CY40iATxWOlxpJCn1DdYkeWRgBjtR%2FL%2BvwU4G1wuIFNJgQMbju66sf0YUFTWadXGgVtlrgUWdUpePRweakAyZA3%2FHVLhGbrFrmIZ5v9CIbRHs5Q%2Bz8CT%2Fdgn4ssEUPohsGr%2F2pwiqqsqXNf8w0a%2FWtfRn3Ot%2BbkhWHnhFz4MXSC0WDEH6vIk8A0N0s5TwPTZklcTLeZp4jEUf3VOAZ9MBV2jXD1Uvn01feWLjNGbETdAY3bbTjr1ZIhcVnVvCYGT%2F6ml%2FQkA4g6MtYAEacMUWSZARLpMM%2B4r9AGOqUB0oDH%2BiwIEai3pxXF04eEwT4d%2B1O6xIaJIEEho%2Fb7gEuZZtS7D8iHoPfXpiBa6zRRqq8yvZWMRbdRDOJbzdd5vF3zHTLWbsxf4tscWE%2FPzaJJ2R%2BPxqpLlk2I9RaG8NSrjFRPxyef7ZkyT445yzzdYVxrn39yzMx8Wdzos1RgjBr8A91q0SeMBQbNK%2B4b2TUzyynVM%2FCP7LFBtS2Ni1mpwonQMSjy&X-Amz-Signature=df29f782f5e7f5e1c9d5457bbdf24f7a21a9a40944838bdc80ed38f241eee8d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFWYMEHR%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAUaCXVzLXdlc3QtMiJHMEUCIQD%2Bk86u33GtWfGW0%2BtmjaZEdfbU8IPKJyvKmpU2dn0F%2BQIgDCi9zNEyp0FH49H2oRDV8Hr3c2dHrYXcj77%2F1wwoQY8qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMZGjWJUj3oc76GQHircA%2Bd7JfxcW26plGv%2BbqMofLl7c%2B5CgjjmztpkLwqgIQh63GJD%2FvVPVau6kt7WlKNClyRojV3%2BaM4IgoEqqmNE2YgUPtMGBuWKM%2FRA33eyJXRP3Lt0hl9MbaJeL0I5mPW4Iyrv9%2FlSa9VwPm4eryV15pnJGHOlCBL1gwEiGekHY8gmBDhG8Y1i8Hol6iijC0Z9L%2BMUbPGIPnckjMAQ4x8qH2B2fAbGqsn5THP0gGAl%2BI%2FMawq4S2MnMG74zF3M%2FIteiiBvMvaNrZMV%2BhSrpwdLHMtuOnsvZAfG3At6LMvE7Obo041FWnZxygpC94yHeSTimk%2FfejYOFPEKXVLrhUO%2F%2BS3WWQ3Gmap5uwM1vehrSlzYDFNzCdvTsNAzeEzD%2F5Qa7h2UaLIMmRLeyc5nRtPF1JeqZjNX1AX63IJCRvN0sA8y9UxtzVJ9cymjMciOHPnHY5Cea7p6CrqOhFlIGbIl9CwotgQCkZ4sv6n9ydGCyNxQtzV3zYrYQPf80CBJ6JsP9qdV7WQE12JS6TXqTNzcSVVfpRoHuSncgKcxiwfMgS3OewpNpwIA%2FNXF5ah0%2BZuotNWOk1MzCYSAPW7Lrpgp6uGH2TbFSisQlT3UJe7ttBWwEEyxJam05lWm9El1MOXMr9AGOqUBb4PhNnSmWLRcqinvu2JuOuO3YND2Nm1n9%2FrDgQIrFWWQ0P8rFtv5x86fmoMdPZEtD%2Bny4MYb3UgdlQSyOQpLsbuYSUEpVgpr5df5jII0wwzZ%2BDAmobn9NIVqOBLC%2BUpMCoVu3YhFDZ%2F8qIGAbRLGSpeio%2BwFNJW5dNNKDEeLwKH%2B7plNrxWWS%2BooWbLgMwnStxdwTnstCx%2FwKg%2Bx8KZxdn7ycrBK&X-Amz-Signature=fb2e74c93fbf46f0e1809ca523713d0c6355b4422093f226466ac8a68a45219e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RYAGEL6I%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043617Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCFIn%2BbKUQN9miuEqyYmlScw1wVmCT%2BwgUV9VcZY%2FvLFwIhAOUBFdh2UDJRTaEyPBheoyfNci7w%2FJPBFHRJIjO3KwNSKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzlmCNLD5fw%2FWSXqEUq3AO%2F2gNvpzRPmIdzsG6y44RW4C%2F5fwAIdnJK71Jcr22nh3Z51cuKByf52iUdafES14larjS7uOqO%2FrY1LLrexQa%2FKdWnYd8tbWWH4oKDIyVmXbQa46pxKW%2BR7FLD34cEE75KIDpfLli6eJLsuB00FkTDSPUn8fCV1dC71kq7UlmFdCyj%2BRfLDX8bkYNfd9bAU8Bi%2BZMrbE74ksSmHnMGe8Aav1MUJ2ZRMRvJiFOmq4%2FyiINRdbScx2WYjgd5Ap62nAc1lNQtt3VvRBhA4uE41a1CKRUq4yVEdsvPiT3zc%2FDp7aRNLTjdgamfxlLTAYi8vnRy6nn4jvn0LL06Elzxrf11NmRVw436%2B2ycl%2BZVGWkqDiZdXw2%2F4SXL%2F8VueijGjURfHHzoGcjqeInJJnsYQOIMibaA%2BHWr%2FSIqeN747gZ317VmWNZiRiumYWQOzi4kVF4VZKNalQuwAe%2F7%2B537hDb9VOdJQ6Ut5ofYnuaLa%2FB0aXv6nCJHCHmQ0GRC3ADrDx9l34akwxihOgT1VoIS46dKBKDIZDFzDalh3RxEuBSEVjXENAPJegxDgIBweDFDqAHLMfNmCoqiYmlqSs6m%2FNiulJwsw6zJumLcvH5yvb9KsJK83Swa5mHkkAY7zTDMua%2FQBjqkAUM19884sJL8yq1L%2BbOX1%2B939WDtmyKKKtbkM6tf3rKHH5K9LF%2FRaZ318%2BMXS%2B2N9Sw6Ymbj%2F3Y1tfI8IzBrBIUyYqRQAg2hlOh7a7GAFw%2F74rQa6PE1KIgwlwDblDaG3BvD6tq59bF8gk7XbHj6EFw7rosaF9JuhWDCdFWnFDjYjEMfezenYsMqYHVQ5KOO5trZgL2J%2BWnaBaD29pbnZqWJKdUG&X-Amz-Signature=2205f2fb2e4d5af20a8dabb5d5f0f76c7f90b0e6f9a6725ffe4726ce58984b30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665OZVYDJR%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043617Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAUaCXVzLXdlc3QtMiJHMEUCIE6L9FKT5wiCo42sHsGNmA6EoWqZEwj4Hwu79W03aO2rAiEAp8wHxT8qp3tYiDD%2BrZ74LIP8CDMJ4XRJJaddrP30MmMqiAQIzv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC%2Bl6fqv1XGwahLqHCrcA%2B8U8H35Nlrw0wgUGLZ2j%2B4fmvTdexzg4DVtQAL%2FXHcj%2BTc17vS7RDkdLbIjQue0Xn%2FWDWhHiOpwi1TSVcR1RuZeTQWkbcOKWlZZG5UZr4u5%2FhLp0y95TLBs9FayZV6%2BPguxyvWVTe%2FmTA%2BPQ%2BEb%2FxpUMYquPg1fPjTiip%2BBUlIw6nkK7tZ7%2BjJuhyxiLNivTarygeKFVb8Tgzstzn8lA3bxq%2FIEzNBzzyWP%2BdeiBjsIO7IyxxcHCSILWfhV0xKPSwdB5e9XzuUafDULiwv72WJWaag%2FfWRMAQtkPS7xS0aZqb1opXv4ADYI1nl%2Btsmu%2FsQ%2Bh03W3M1KUf3jZqNWmaDBK%2BhiaOWC%2FZnfWOwHm%2FpYAOt89O%2Fp%2F2w4ufBrzvkMlMDNniH%2FL76X%2FcWk6bgugoyNCGsYopIBLa%2BbSDpwloNtUpyoaA5PIi%2BFYtodiIXtuR7I52MWaJg6R18Pr45r7gy3JTB1LGmjCXauf6yTaiTZX%2F75b3ILRfqM9jSs%2B53vUJqOa%2FyVZjnhSbh%2B15njhU6HP2dRYGR4FYbL5zEpdCwk9V2%2BQV5EEshIwN98NoXkuzBISdSMpeliKtd6ARitKm2CK40zOQ2xTcjSXpMddh%2BMDtAL3br8mToxmoO8MJTOr9AGOqUBfXtO7%2BLQhOeIMwyXMGSTJ5SzFtgA5ke4L%2Fv337HWNt7JXapOnqPGpuPHJLzhhyQTa2C7OyO3QLDC%2BE8DQjo08PrTVRE1oMylYMl6D8XJlttsCneCWLbZWym8WQmxMyqB0VIJYyUM%2BnVQxxUGS5%2FvdVRnEg4k1ysHm92coVaH3b2bh2473KLJnl0SofVG4nXSHlyJNfqKHYjsHWVRmYEvf0pvEBtZ&X-Amz-Signature=9dd63f5700b0876e903628e9c53f516bf2dd691919b05181664058284f10cc24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U7PBW42L%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043617Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJGMEQCIGA0dGn10fwdBwT7CZP6sHgQnRq6ZmW%2FrKS%2BZYP9yaRpAiBCij80l%2BwHWhHSabzMrqKStap0WT%2FOAgMdXEDcEnLiqyqIBAjN%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqhnIB1otzeJZhW6OKtwDcaYYVas%2FxcJovQPjej1Ub5izmPlpzJ%2FOUBekI%2FbivQ2Qc6jeDk1Z7k6cG4YiKgvpTavd06q3elcCHaqpUrdC2%2Fyf0L5S7AbF%2FqLrHrw%2FXeJ%2BhdiKx%2BcxSWWmq14CZrbxn9bLmjBsasvpFHb879GyCdPTg%2F97ONBjljR0Z2RaB%2FTCBcAXEBzvBOTELOFdqer%2FNM%2FHuaJ4kI3JgkGdHevxr3xKzgjIOfJsPYXGj9eXvrbuo8qYEEGSHFmALXD8id9nrGwNUE5V%2FkbwA5ZxbIfk7qqaRkROo3AyuczI8%2FmswDb5u5yKLmiyFWD04UavBuaVZBRu5dSoTU4j8V91mwRbeXYXz3pSAMVNqVPqm4eHncxWTUJK0kOo0ARzBi3k0tZijBgHMBpjM7nsqvBpWXSjho1Ug46OXtMCFOSiozD4BeQ1Zrw0qng33g%2Bs%2BuRiIEfZhiCzDG8pJFotdvtDzNoLKYf8DRqJHlkQD9HQTPbHTTmgCCxi8uPQs7W%2FbKTZ1Tdy3F4zBTKzPkIyDAvkLn37NqMwwv9YUO8RfwFnRzHRoBzoFnx68pMdXKKuplA9%2F3j3GXlYWbLM9CrXxUnXSO48llHOdZlLKiBN3nO8LY5yZT%2BdxDzYc%2Fk0PvjoVfowu7iv0AY6pgH0bsxXAVgAirFySmvW9P1EnS2SAikdAWh1ucWKi5TFKsx27%2BjihaUv0sHzdm7ojdt2nAD75I5P1T7jCeujp4WvYAdh0gLRpAEhfs%2FokdFrNv5rYF6qt3WV8aSCGONA91KiFt0dE0z%2Bk6Ynl96epQUhBzdZxXIDnHXoPsmwOD2uauAU01RwQPxKba%2FDdQfbH5YnsPG2gz0Hh9Pvh3pmeM1lp%2F0WGrgf&X-Amz-Signature=6127c9f748d45bcf3f9d894fa500bd62b9c5427d96fbd2a0301dc6a3f4f8f9cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MYP6F5W%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIGW4tJwe51sU8DmbqTzGlja1ywlfmIDesGdQjvJ%2Bn1bmAiEApqtnhnvwzIOQhk0yYGnnLK4y4GGffK7HZs21c7NE4a8qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGd%2Ff2ykH8VTzLXSOyrcA78J9zEnXgsfN12M8UGabCRKyBCYKec001amOt9Fc%2FX3u7ewYkPzlnqSVNKVFeSTCF6mlGbkm5CL3XiTAN1Jx4vVs1iMFYWm4gzm0zSFSbFJns%2BWh4H9pyMw6pxMs2%2B4TldfYHMSySwGC9EP%2B9Cz1rrck6pjtooBapaUx3k3tj1bWuzhUBfTQZBLDXqSMtiKH18jJYM4d%2FClO1xBL3d9bud1JRTOPnaq23Wt5UFzgNeup90Q8M0uTThBch7sykYswW%2BxoeYlwdA03zD3D%2B2luONXqEduucqWuJza9mKJM%2F15j20z%2Fv0y4K2A5Me47acHdqh6MQe%2FFa5a2pq1bvwcSiJt7umXx64ZPiZQGL46lKkn3bshaUufU%2BvcYygogGoSxqm3I1FcS8O3LiyDOArAAt5dZZln3Nuws7FDQOCWuRewI4WnjX8mW0COqc%2FdFSg4QucskYwck2AYV0gynKVEatY5itWWhM6jnwv4G4dk%2Fi7oQrdhk1%2F6bW7IdBktzm7HwLYhUWG4sE5%2F39mjP2cFQ49VVIUuRBkRxD0dz%2FuxJ2KAGFfuzAKdJCsdVRE5MBQ9yVt3kgZVcQ4jCLcuP50ni%2BIeD6MfIJ1laLJYGy4PnTn9sNym%2FEzl6Hr%2FRBd0MNe3r9AGOqUBYAAO9Yl0GcSAC%2FIWL2UZ4Id2Vr3l%2FsimdzG3Pa7KltsHPbmAd%2BOxrjkrscM1aclvsr5XRvIc%2F6h%2BwyolIRwNqnc3qUOOGybtTL1Det8PRv6j%2BobKpUqHWXYMiSYL99WOxHSuMJBMM%2BrOFQW8wED9ER5Sazm6PeD%2B2x563%2BmuJrevzC6jiCQSLQqM%2FvughS0tbajjzp2GZTSYDAA0hsm6wv%2Bbir%2Bw&X-Amz-Signature=e8b0e1ff4f3c5deb02f9023c8e334f0cb6a179094b8b41e279a2b4d792d94a6b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
