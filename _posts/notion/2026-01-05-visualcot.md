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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4682c796-6319-41b0-bb37-82d08366204f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWTLEKR4%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDTb4H5q672etC0N5tiZIJGN0GzJ7SHYTh6WnQeWpHjzwIgNzOOEMgmcnRm%2Fx8Jv9KZf0IAZJ8iFfsBTtQk9hOgOz0qiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF9xcMtrDK3e69kkJSrcA59xDAiYIVgIKnUR4y2aDCDSzIf37Tq9C4JSzfCx2YuEqkFVIC4XzC6lAaKMUnCRGDoWE5euEEv0M5BI1ZKpRjdYzV285tob%2BbsTEe%2FHAxbl4w1136bJyA54TS6tC8PS2w5lwSMUOFuv5prYd66oEBypyFQHIzWgovoMotkUfG9cO7NXx9je8V%2B1IWSTvK2CQAbSnIAVCj%2FG59v4HI%2FWXuYgqa62ISQArgRQ%2Fva0AQfSPCeMeNabCoNrgAjwv8XFvr38nmyCr696atXYlGNfEP5o2RJQ7xF%2BWrEcUCRVz%2BqUdQ8l1vRvuQz2gv5d2R65oBVVYW%2BByOiBIPltlvD23OQEzoJO1IcIz3iPe%2FMs%2Bp2j%2FKMWqekLOjZ%2BMQkPl9FpL5rw81DJYKaN3nIzFvW3GpqiTxMkFbwApXVUFaUTF6XatfaMHOuNNCpneQd6C82s9vfBP8oJlU3OTihBtM8mJEivMQgpRCO9qTZomlgnX%2BU7%2F5hTGRwBILB229eMdqreKtheIWqcTpEXMerTVPhqB1%2FB8OT1SzFthjjV8ShqZXLzPH6euFVpdhXKD2yGyifh4JjU8c6jRK31HCRzQcb%2B9Ej2fBoS4uu68Is0JKgLvhPWrhUFo7Ef%2B29qC2fbMMPLr8wGOqUBWTlNnM0TdeRu1NFUt76HV3nS2UhsOQXtPuIC8kXKNfT%2BT8aBy43x9zlY4U3ZQ4IYnm%2F8wbHPgWtAJOiRGbOYRHtOVXbYLl9jVHZvqWCtBSNN7%2B%2F1bcob%2FIV3G%2FYjfFnZrze2j7SL57h%2BjA9GnUV%2BWOhVMa5dKTnnjNayM5vzclKp3bGskW3Qffc3NWPXIVWlfoHs9MuMeci%2F18juUEp01peudBZV&X-Amz-Signature=1520d8a9192a3b82169618e00a6370a1710222ec246a6b4da2da28c9a858022e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 5가지 핵심 도메인
    - 텍스트/문서 - ocr / 문맥 이해 능력을 향상 시킴
    - fine-grained understanding: 시각적 외형과 패턴의 미세한 차이를 식별하는 능력
    - 차트: 비즈니스/과학 분야에 필수적인 그래픽 데이터 해석 능력
    - general vqa: 일반적인 시각 qa
    - relation reasoning: 관계 추론, 공간적/맥락적 인식을 발달시킴

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8ce325a0-67e7-48f5-9354-93729b35b7ca/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46644BQ4EES%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDBoX%2BMUeLiyk7dSQAqiC562FOVzZLVKLTWeB3WOx3thAiEA2swOENR5GZ8kj7EKOizyPB0LgwYq7qcPjSYPDaX7iagqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJg%2F5ya%2FDnVve2M0%2FSrcA%2FIr9xI5yMn%2FvRwH1eIbeLw6NE%2Bw%2FkatvdQdNt5m3%2F6FDzrCbyN1EH0oymbZ%2BB4saxXw%2B6LPpeRVZSaFqgaYshI1BHmk3YiVFKlvwGd0%2BY2LkTgrKkWXH2faJLg83PSddU0ahxY0ej25yz2HPNRdX7Y5a3dTlgNd2flSNCFnhHWnLU1IV%2Bb5ui7EqbI%2FlLlbC0VypoDoheiwP9HXoxwaFiX9c9UdQRSTDCc1Ci4CXqcus2AeaPp0ovTlFRsU1uSNT5sE4XivTySe089fUaqzvcPacVzpWwdiwnX4WrVfQ%2FR4LTacorC6t7g6gXsZxboaG9ceOG3vaamXa%2BortthWPOQs%2FHxbMr2eo%2Fs8bcxBtL3pZbml0KkE%2BvoOOn3BpVCQVtj1oChwGJIvhSrLvDweunrbphEoEpxeEcXtD54ZogA9Z%2BjKtkktKIWC6poA3QHS8%2FBJIp526885S7BnyNB0wqDttgRfkcsWiEwCGs7rK1oFR4v4D6jCWbRCVTUyg07xd%2BZE90%2BtNVaUbhmnUvewB5LB0g6q%2FTfopK%2FiwHfoSc2RL1qAtPpmpfjyI8BKh0EjNT4V5OjkxShL94Rkj%2BPM10qzfGy4GP%2BupQiVWtOPM7UdaaXxeX7FQGPq982BMNrLr8wGOqUBFrvjIor2XiwCwAhch9U%2FzTpRF9uRQmy5QWIKUUpy8MPMdga9RUDlG7K4uWOJ%2Fw%2F6sipYW4BNn%2B2gSHDBd0SmYzSkZPTGyIvqXygPbPxH5qhp0BXwXnwZji6rVRM1UrtJwVq9SwlaGz5%2Fop9XjdlXd29eJLYZfD9ypHVZzcqZH%2BdKG6SFhGL44up6znjc2nUNmzkxxRdS8omvUCF8S4cZ9LjuBsUp&X-Amz-Signature=211ba26a7c732d662e90e3203ced0415d486be6bc3822b0bd36e712985b655b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7bd0a9dd-f572-4212-a5be-8f348ea78f4a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663GL6FLP7%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHwROhn1zi1jpSDXaPpPpu9p%2FlUHl26XvKVuQNTkG3JZAiBcw4TMv3cY4zFGrS6va9%2Fb9GDNOuxcW0PcJz39FRlF8CqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqcV0zRaNVKrunj5cKtwDWkqR2a1seZr1f%2FXzN4OuTtUJFn%2Fny%2FT7dy5p5QRdxT74HVrmDtS4%2FWLWgLhSe1t7HYTQpD0uA%2Fn30j%2F9PiACQEEkfoiitRbiykrhzNRzB8Tv6abg%2BTEmLsVvtqm8cXpROirjObKhQcbnP2kS3yedODdsFW6cqjhYcMGVt%2Bm2mQfzSC8z8nCPxWD6yC6p4RvuNY7Zao7tUJNonPHeV6FU%2BZQMDX3aVXmbdmP%2BO5xAG8XrXSAMwq4u5RBx7uPVXfnkpyW%2B2%2BvPj10NPRa1oKRuh9jELmcOL9NsYn8sH3wFHAhKTG1ctzStIMiPb4bfC8hsjwakKtO9dHD4SSmp2HxRxbZG%2F3DJosmMFQTPAKs2Rr7XoCOPi8LfOq1jcm%2BxZ42kRTCEF2opNKgto%2FIEfXV5Uih4xlUrJNlt1W2Ws8twWdCNSCI78hSRwOks02etUA70BgXazh9zs%2F%2B2TCVd%2B2TgPEutD5sj%2BewxKrKqi2t0d6k%2BDhEmV41YkMXg6vbBtpjL4rwip2EBX2Dmw18wl4uB7JkVuaw9E32YTzokuP93wADsBAtUKyrE8imCM3UYjBs5HCnQui7xJAPSHj277oZ3%2F%2Fs4U70w9rHBXoyusOA0ce2dcusHOLmKfi4qCiIwrsuvzAY6pgFk7IUeHE5Jolph3Ksr7JZVOXvUIYr5wfSFSbYRYNJTujhhqtrmMDxhBT8lJMeMT8jh6EQZlWtnFLTN94YMF3XujMUDkQdbTRSEgDl%2FK6HQElK46WqLqePbvU7%2Fv6vsar%2BX2v%2FMk9sOhKiAOl%2BhE%2FH5u2dGwWCoqREGtIXy0x8KADCQbPlQ9pZKULpDrKeo2IIjZ4vrUFW4UUVqiBrdEjCDfDGiZD2j&X-Amz-Signature=151d85b304c26a2dff5e68e0879f2f59c7aca7f59d7263bd1aa488541aa1ccb4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c1d9b55-748c-4e9c-9932-4066e0b7d0f6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663GL6FLP7%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHwROhn1zi1jpSDXaPpPpu9p%2FlUHl26XvKVuQNTkG3JZAiBcw4TMv3cY4zFGrS6va9%2Fb9GDNOuxcW0PcJz39FRlF8CqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqcV0zRaNVKrunj5cKtwDWkqR2a1seZr1f%2FXzN4OuTtUJFn%2Fny%2FT7dy5p5QRdxT74HVrmDtS4%2FWLWgLhSe1t7HYTQpD0uA%2Fn30j%2F9PiACQEEkfoiitRbiykrhzNRzB8Tv6abg%2BTEmLsVvtqm8cXpROirjObKhQcbnP2kS3yedODdsFW6cqjhYcMGVt%2Bm2mQfzSC8z8nCPxWD6yC6p4RvuNY7Zao7tUJNonPHeV6FU%2BZQMDX3aVXmbdmP%2BO5xAG8XrXSAMwq4u5RBx7uPVXfnkpyW%2B2%2BvPj10NPRa1oKRuh9jELmcOL9NsYn8sH3wFHAhKTG1ctzStIMiPb4bfC8hsjwakKtO9dHD4SSmp2HxRxbZG%2F3DJosmMFQTPAKs2Rr7XoCOPi8LfOq1jcm%2BxZ42kRTCEF2opNKgto%2FIEfXV5Uih4xlUrJNlt1W2Ws8twWdCNSCI78hSRwOks02etUA70BgXazh9zs%2F%2B2TCVd%2B2TgPEutD5sj%2BewxKrKqi2t0d6k%2BDhEmV41YkMXg6vbBtpjL4rwip2EBX2Dmw18wl4uB7JkVuaw9E32YTzokuP93wADsBAtUKyrE8imCM3UYjBs5HCnQui7xJAPSHj277oZ3%2F%2Fs4U70w9rHBXoyusOA0ce2dcusHOLmKfi4qCiIwrsuvzAY6pgFk7IUeHE5Jolph3Ksr7JZVOXvUIYr5wfSFSbYRYNJTujhhqtrmMDxhBT8lJMeMT8jh6EQZlWtnFLTN94YMF3XujMUDkQdbTRSEgDl%2FK6HQElK46WqLqePbvU7%2Fv6vsar%2BX2v%2FMk9sOhKiAOl%2BhE%2FH5u2dGwWCoqREGtIXy0x8KADCQbPlQ9pZKULpDrKeo2IIjZ4vrUFW4UUVqiBrdEjCDfDGiZD2j&X-Amz-Signature=5b7d6e65ec53a14aea7723a07aa42083356928f29e1a6934f064a01c3065f47f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/188e0137-951e-4a58-807a-296794454b71/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHOTMHBV%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032559Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDVieQpYimyvsM%2FKyozEacSitd2JxrdBF1U5l20Z0wziwIhAJi4p%2FUqp9LifpuGZGz2tbx72NgQYZK74IArluZ5RcgUKogECLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzczA9ybiDsnX1dlTgq3AMsdLOm8SXdln6lvZeqVO9Ziax%2FZQryl6k8QSjBNkxrhrHgnXhihMUlwluLqrYWUb2UV8dShUlzEOowR306bSlFfLS2an1NYmdRHB3i%2F%2FAJ3X61U8W5stoeGHwHwOmYxB4spGjuiGDVPlD1NFQlgjqGzroARehKO6Su9dmGHYwPdmYlg2ktgAQ368kIdonGVFWrquR2J5gTPqRPpNmKEyHtLKYluC5lGXhWAMbSuaXOyWNqK6oFK0PkkilpredYNJGDeaOSNewTAjtbhsCi1iZtEHJnbrgBkQhiW7ReCTq3FoQNzuGW5ScPpsA1w4csotSzA4eGqCqpXq%2Fi9DErF%2BUTbyS%2Bo1hXT4vE6802kMUy%2BpYckIhv57XSdTjxUpzwFWOH6q%2BlOmNIU%2FgDk9V17gNydH0RUG%2Bze34sGaFHapdOeZDN0cEh9S4k%2BGyqQQyMJpk1eZODCQoDlL0tEtCyhJV7dpH51Yy%2BcoOppup79K2R%2BiQbfSzGLCpHyxYNN37LHAMBdpfjRy7GrI3BanthCVyHEgTmfpBTWKe2I%2F%2B0LqEHgaRpfM8OUtrAiaMLsqwcR35xEbq5GycX30vOqN9QZ1ZsPbDkdMkXduOykTgtlNyiLY4yKi6%2F8TAaTAJGKjCjy6%2FMBjqkAV7ZFRx2bEhxhONkm%2BAT1X3kLCO5dljWOQBL8w9VaVUFDx5dRQu9T32jkJTVoyXdT6nxQeotiCeQvWluZSO%2B5GSdBp9GGK1r9Ep9e22hNEhGQgeg0WL%2B3hK%2BJ0%2FVB84GWhlKZ0ePhM4aHfKMW26Vqu3Tly6%2FvfoszRirH7xrgS580b8cI3shyNsYYMCu5OuD4YYtGtZSHGLvT7zkzH4PwmCMKTaq&X-Amz-Signature=c77d7e2324acccc8054182a0ad598731dd584f3a9c549a10d0dadb8e9fee940f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3806c9b7-fee0-4fcd-b826-834164e6148b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666WHAFQSW%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032605Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBoM8RVItewtjeas%2BsxIgIiP6CpU15U7s0Vz1bSDFES1AiEA%2B4czCJZPbGa29Yb0bxxoxao8JnO7SL%2B5tQkfMBKkwtgqiAQIs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH6gY81JS4lYbDxJCyrcA7Ke%2F9D965CKvu7fRiR5GVNU3EbgAUypYkqbDSjaay%2FBXvOPX7ya32W4AC0%2F5xiHU5Xmr%2Bz9Cbk1tx8vdjhihjb7cl3ACqB%2BbxrAamN3USIKgvsoY6t9CFS3vMLanEG9f1qO2%2Fwph93ZdQSom7oDFJ2WZXOCylM8gLZAl6M8m9diQKGqwG4OIxe%2FwDTK51yUhwMQgvNnpJWA26qi2SoOYgH1rRti%2B1jtyyB8SDJUidrLzmx3%2BTIssG8MR4PlicEOabeeqPaEfJ7Ck4Rg%2BEFpbcgQA4CtL09mz6yLUaUmx9VFjAba%2B1NlwWnPsLSCdQLwR4%2F2kYfaq4p5DMQQAKlitgeuXcxtQyzRDALTsCPiemyRElEdJ9WfyR%2ByfT8myQx%2BXVJtR2kmBrpgg%2FESEfPyB%2F%2BEu8KFAOLmf4DcJGOaM3NJ3mDkjTGMh09OWi6%2FIdu4%2FWK02Kv3JVdWGKeZlg1Ia%2B%2FMisBwjdPqlPut36Xidn1Zy0%2Fr0%2FrpIfdQwlAqY5oDlu4UYWk768MyL6pBX42QluB1TkwoSvhRBt9bKXCLIDmv59LsYJfLwRCqEL8KjrSyNGLl1LwQMCrP0MX%2FpSroZCLqSV6%2Ffh6hpFxK%2B6uAd2TRiElEV6hIv1Z35RAUMInLr8wGOqUB%2F0tLItv%2FYk9B%2B56b91ATq14SWusr4YXK7d8v4jdyuV2DieldFcb6AUVuaeX6zYHkWJip90hyko3MX%2Fav8Z43XLIhkVrGKKwKjp9qu%2FP49gnzdgvy9u5hsuLhMm3XFFLLAkm%2BvwyfzzOMZdB8gExjq1gTl4xNbjWopfGuFDIRj%2BEtAx1dmx46rSM%2BFeqDYemSsOdPycnWY2w96ytjpt%2F%2BvGW%2BAHyJ&X-Amz-Signature=67b5ea74b0ef58720c5ff565e8227bfaa6eff5ed330d2aed4bc010953853e701&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - text/문서 관련 task, 고해상도 이미지 처리가 필요한 영역에서 큰 차이를 보임
    - 영수증에서 정보를 추출하는 sroie 데이터셋의 경우 cot 과정을 거치지 않은 일반 파이프라인 대비 약 8배나 높은 성능을 보임
- **ablation study**
    - bbox 선택 방법

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42c22f9c-539a-4716-8664-ffaf8cd596cd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46654FZJ6VA%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCKkijiOAx44foCLEbtDPkZtRQ599fHj%2F17WyIBdZqePwIhAI8H5AdsLBJxCXHW8GbpbjcExX01CPgFSvjMQBgq%2F91SKogECLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwCZGSwpibaiVFBCCIq3ANbkFjglb%2FSBKgj0xXYW%2FpqcGIjHqC0dp0rosRTZe8NIucOZZgu8BTAJCUBH6VXCmb6cPqV4tTkgtWsAQ01%2BpbI7yAGwJ8iGdAo22hEXB97KNCRran5mGduCtsNkr%2FWwQIUTK4IlOvHlAdB7mtR5l3np92hkIWMAUx6%2BOgQuJQqcbnjt4PP82nyOgceZfxKoz6lp1YW0l%2FQFqP6lMuspBzuREoVlSPHyFRiz1q1nm%2BZPy8brExkhyU2OgkVS6tDTVzXBglDzGnFmRiyrtuauztGmVlOd62ADhdB6AzzKp6tt7T4z3QXhV7CVZeV8KwmgMNQOEQA6jt6dNDkHzF76j%2FmzHfPpxQEfoClakKxgCj3WIHplcFQuKPU7Jqx%2F6jb7PZ3xKWfkdFHOba4TWPdDMetRsQxqwfHoZHMBtSMg6wWxcWbTuwZUVhxeOYCBW8JMm6W9lh%2FtoUWe4HqMtlDW5OnqmfvjAkWtWSfpBkEpPBp8DLcDquLdvaqSHUJ%2BCrGzQhi53MJd1aza5OPfas3fsMVURXDJaUAeR%2Bt6piKYbnQPtpcYr2OYo%2FLwDLKQXUTEtBoVi26j1WyMbbgvmw9qtJQkuShDK73cd88LOWuzHLr6qVYJxcKUr0%2BRpMnkTCBzK%2FMBjqkAWfbGIpLkTK184cwyzmZ2%2FdvMnrIGFXEMvWsxDljtW3%2FtCZhOdXc5LXrH4ffnLiPXELHOKW%2FYvaoGl70tVZi5qWk0sppAsSqFJp9xRvqpe9dN8r769neuyeiI8HSX4n%2BlC%2BFRLmzg6xgzdwF%2B6PPXJfsjoWF2lNm1diQoxryp0fQdRVUs0AJGj%2FRSyuY%2BqDz9TQ7ZI96WyUuTDT8VmYGHZATC8bt&X-Amz-Signature=b3fa55836fcc09b14bdacc0ea43e91b1cd3ced150cf8b17721ef76cdfffe29c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gt bbox / random / 중앙 박스
        - gt bbox를 강제로 주입했을 때 성능이 가장 좋았음
        - → 모델이 어디를 봐야할지 알면 정답을 훨씬 잘 맞춤
    - token efficiency

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e212dd87-f2a0-446f-b870-3b4577a62168/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZX6K6RO%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDhwoGQTF67VlaYDdwsX2zbsGsu325G4UlaF%2Fs8jQaPUQIhAMmCpPmAWRpYnUsVCfWz9rz9QB1Jc%2BmP4ud8wseYqSCLKogECLP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwfOgUgPuJQJhqhWNcq3AP1bpedOAjXVnsTlvj%2B4%2BJwFBUsDEpnCycH9UR96%2Bpzr1kXhVm%2BQeQ0sUMTipB6B4ILJc8RByKRyUN34VGF7PFdf86XePBLbBVmmKlTXyWB4n06VlzIa2GMHiBC9tl7uHnGIwDNme49bwdY107vhcsraHbxi5VSAj9zY0evSwsMyP3%2FA93REVdYEIYQu8QHc%2FdQvLroNa77OJQvsUffe3j1vf8C9dz4tTYxPqPjNR%2FgEIXlSbMJYMxFiPEItl2RPynlnRAuP9nqqdW18TlmnZKaE78uF1PvLXmEvG7wBnMJSSg9RMj5hfVYWHxLndzAoBiKyoiinYIl%2F2uhIy5lXbGQu0M4s2TdnBhMh%2Ff%2BAj0MbN89%2B4z6rk6J6Zuss16qsp3%2BENeiz5D8ewA55EDvrdqO%2FvX8LkA5kOi3uMJFtxr9UilwIToO8bIUO6iqv%2BnCO9XUpiUT2xKhrCB7ZdkV3jWJtKathl85LVtcNqT%2BPVgZ9Ikm6senPARsH7y4wSOmLGWuvVQrSzzOLpQlilKY5HKrCs71H9aYdjxED%2F9doId2cuD6eWay6Vcma4Yc76L%2BYuMD7BcPueB59kYKhD5qZIkIamOsg4LT5ZSNwmN1YenysQp3PDVpLS87KvLkQTDCy6%2FMBjqkAZqiEpEH0e3rG8WBa1wMEGJzWckvxFS3cybW3TJid%2BII%2Fv2lJG8ZKtq1RnGV9a1atc420JCtS8BcgucsqNDny%2FkThA57D%2BSFSpqOWYjNkym5GyMwU10D7Ti23MvQ%2FYC%2FEvR0%2Bw0iLb%2BkgULKrW6q4BecMzkokd%2F2rz5a2YRerZh5VoKxf%2BJdbdpkzSHQkJ%2F0NndHaP4Lww10lp4rs2PU4gRm5kqB&X-Amz-Signature=ef2787fc096e44c2af0c6a2eae9ccd2d657888bd5ac74101a5519509baa10a80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 224 해상도의 visual cot가 448 해상도의 일반 모델보다 더 높은 정확도를 보이면서도 사용한 시각적 토큰의 양은 절반이었음
    - visual sampler 디자인

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/e4f176ef-8bf5-47f4-b9f0-05ebef4ff799/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TDBLZYYQ%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB3hFcknt4MmGVwqMQM18xWderJ5KhEQ0rxAUwJf%2FPKoAiBtuWfX0EToAQ2jA9%2BEbbwtLoK1uDFzEEaAfR1PYWzBOSqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMRC2cRf2j5ljc723wKtwDwqGGoBzS08cRkhygKn%2Byb234ZlmAQGcCy3RD9QS%2FsufHklISyzcKPYV3chvEsocJ5CwmaIpYQGaYnYtyStnPJiKzu6Www%2FwPHpBL%2FrxZjE%2B2ZnvY%2Bp0tO6PfNzrEHomSp7UoAy3obBKDierrLpfTHR5WNi4VOVWhwxZwgBbfkyVXY8R73ZAaQe3nLMgR5L6zOnDt9UJe2yehOOsOWKH3etnYhyEU3nV9XZkvviJdZ7LiluEITqe6n6%2Bo9qEUk2%2FAz%2FK7n4aOTufKyCDErKTD1DPJIrQYkef5JT2fH%2FABxSMyhHR9zh60%2F8lBwF%2B1bED8rgP%2Fk5vOfX5u0VDrWetkhWbyZ8t4%2BgSJc1wfnEz55OETA8tGxiJk6cr%2FlMuEy75OCfnq458nuzQPz1wE%2BzAvV5VsObhyAP3SDL09AhfEz4NDRgRSaPK5cq3QM%2BkqMYsO459q9GhZTnVr4J52iXFxmvakxRAJugw45WTDsh97c6N83u444OTsP0qlq2w3otzQKuLQpLduPSFh%2FeBlHsxWJysCYVqI7pI4ownyOUP96UGAS7AsJN2kvxJxFEYhjmvo8gRlOCIohRXLL%2BrMvVQoFRWSGiS1OpAIR9mA0fh5N3zdSJXYAjBJbBWfOLwwzsuvzAY6pgFPUcCWeOOSDKea1yezsEm7X7D3x33TaWiCEOVJCTSlz6t7hNPhQTgRAZzlHGZhcxImm40c8bQ06FBsid1jBpRS5%2BkAN96v%2BB8M8EKcJrZ7ce%2Bb5H85O7WDt2OS%2FfdwfsikhiIIqpJWcPVxmQTu6kpwCWOzFn46EEB3LvRCup9cza0YANi5qZ4kql%2BsIrabuDM7eS14RgDQhwZTDp5Ff3A5wrfjMa%2Bw&X-Amz-Signature=aa739fb1a904ddec672c1eadb29630ce47f95c69b86c8f62f027eb3f433cd55e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - expanded cropping (주변 문맥 포함), centered cropping (중심 보정)을 적용했을 때 성능이 향상됨
- **visualization**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/fa5da83e-1807-436c-b872-c402505b976a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663GL6FLP7%2F20260211%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260211T032542Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHwROhn1zi1jpSDXaPpPpu9p%2FlUHl26XvKVuQNTkG3JZAiBcw4TMv3cY4zFGrS6va9%2Fb9GDNOuxcW0PcJz39FRlF8CqIBAiz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqcV0zRaNVKrunj5cKtwDWkqR2a1seZr1f%2FXzN4OuTtUJFn%2Fny%2FT7dy5p5QRdxT74HVrmDtS4%2FWLWgLhSe1t7HYTQpD0uA%2Fn30j%2F9PiACQEEkfoiitRbiykrhzNRzB8Tv6abg%2BTEmLsVvtqm8cXpROirjObKhQcbnP2kS3yedODdsFW6cqjhYcMGVt%2Bm2mQfzSC8z8nCPxWD6yC6p4RvuNY7Zao7tUJNonPHeV6FU%2BZQMDX3aVXmbdmP%2BO5xAG8XrXSAMwq4u5RBx7uPVXfnkpyW%2B2%2BvPj10NPRa1oKRuh9jELmcOL9NsYn8sH3wFHAhKTG1ctzStIMiPb4bfC8hsjwakKtO9dHD4SSmp2HxRxbZG%2F3DJosmMFQTPAKs2Rr7XoCOPi8LfOq1jcm%2BxZ42kRTCEF2opNKgto%2FIEfXV5Uih4xlUrJNlt1W2Ws8twWdCNSCI78hSRwOks02etUA70BgXazh9zs%2F%2B2TCVd%2B2TgPEutD5sj%2BewxKrKqi2t0d6k%2BDhEmV41YkMXg6vbBtpjL4rwip2EBX2Dmw18wl4uB7JkVuaw9E32YTzokuP93wADsBAtUKyrE8imCM3UYjBs5HCnQui7xJAPSHj277oZ3%2F%2Fs4U70w9rHBXoyusOA0ce2dcusHOLmKfi4qCiIwrsuvzAY6pgFk7IUeHE5Jolph3Ksr7JZVOXvUIYr5wfSFSbYRYNJTujhhqtrmMDxhBT8lJMeMT8jh6EQZlWtnFLTN94YMF3XujMUDkQdbTRSEgDl%2FK6HQElK46WqLqePbvU7%2Fv6vsar%2BX2v%2FMk9sOhKiAOl%2BhE%2FH5u2dGwWCoqREGtIXy0x8KADCQbPlQ9pZKULpDrKeo2IIjZ4vrUFW4UUVqiBrdEjCDfDGiZD2j&X-Amz-Signature=6e5636536d56840431a01e2b6b54887da997de2c8c569493b480da79fe172513&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Conclusion

- mllm에 visual chain-of-thought 추론 능력을 부여하는 선구적인 접근법 viscot를 소개함
- 이 연구는 기존 mllm이 가지고 있는 결정적인 문제들 - 해석 가능성이 부족하고, 고정된 해상도로 인해 dynamic한 시각 입력을 처리하지 못한다는 점 - 을 해결함
- 438k의 visual cot 데이터셋 제공
- 인간의 인지 과정을 모방한 multi-turn 파이프라인 구축
- 모델이 특정 이미지 부분에 얼마나 잘 집중할 수 있는지 평가할 수 있는 visual cot 벤치마크를 도입함
- 광범위한 실험을 통해 프레임워크의 유효성을 입증하였고, 향후 visual cot 분야의 탐구를 위한 유망한 출발점이 될 것이라고 강조
