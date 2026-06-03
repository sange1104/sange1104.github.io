---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PAPTG3H%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCKIyCTltVF%2FjI%2BEG1zES6LezoCtrRD%2BOTpSXYbg3DnrgIhALj1l06%2FIDCp1zBbSo91ZVi07eSuw8EKuMRUvI0t2jXoKv8DCDUQABoMNjM3NDIzMTgzODA1IgxdX2RYMzwex1TcWHQq3AOhCyzq8HSMrGifqRYqqBhLD9q25ksoSDvH1CcElLTkZwVWs%2BCZAhrk%2B8GahAo%2FzL3uAFCyRjOr9gI2UjL%2FJYA8j6TyFIfAFUFR7GD%2B1VW9kqzjUE9jwqGMOg%2B3mLTTHpNd3IRq%2BRh7%2BVFgJGiHrsI9s4VI6Ntfo4JkPRM4ngz2dEctZL4LWN5R%2BX8OecSahhncBEayVhwV%2FTeUqJ2s8hNrgJiEYrVokuPPULXl0pLiAFsy141XLPmtYM4y3yJW0D17x0sLDmedDOacZwGXyJR%2FLD9cO4m6H7jz%2F%2BkOk0o4A8sKauYmFCzAj9G9oIh6BRCUe9LaQDpDV2bBsiwQjln0lBb9CFX0M3ZPlz5uht7joKPuDKKwOHOpDYuDV4rjqksjWl%2BZsYCddwX2MkPlaBa6SEPGtzzlS6no0cpFaQ5XEBKzV42c16mRRw8Q6Pl%2B0%2BdDAVN%2B%2BCb5bNyxWlyFI7KqePhx24k7GD5z6wiWwCSeLcj6oukNRH1M4fMU79ehsyu5FmBd6OgzJHpdl8%2BujRdG01%2Fi3CVliW017iymaPGxuKX5AVCJ0DxJqTj2sYt0RAoU2IS9AtaNAfH%2FF7NOUGlNUiRE0IhlolKvzaUZKNZ2sd25wM1w85OS0s0DvDDKwv7QBjqkATxN1nR7fsMBNmXUNKJwjiQtYbVDv5TopQwwxDVacfx18goNHrbLkk4qFNhHgilWT4Fi7Nw9m3oUnGeh2D6%2FhYBWJjgvW%2BynERXkEkV8NVtQJ6XSDQLyPiwccVX%2BaufiPGDmCWaT369gU722w3tihDv7S%2Bpg%2BErMMBWApMb9WrYnHpznsXccznJwPqNeq2ZbKms%2F0ZM%2FPkH%2FiAn2hRuIr9e6HENc&X-Amz-Signature=e839f3109c9a8f0e7e1ba216c78f02ed921b50d6784645faa26ab0a968194c50&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 공간적 관계를 이해하고 추론하는 능력은 vqa와 로보틱스에서 핵심적인 역량
- VLM은 일부 VQA 벤치마크에서 뛰어난 성능
    - 거리와 크기 차이와 같은 <u>**물리적 객체 간의 정량적 관계를 이해하는 3D 공간 추론 능력**</u>은 여전히 부족함
- 본 연구는 이 문제가 데이터 부족에서 기인한다고 가정 → <u>**학습 데이터에 3D 공간 정보가 부족**</u>하기 때문
    - 인터넷 규모의 공간 추론 데이터를 활용해 이를 해결하고자 함
    - 본 연구에서는 이를 위해 대규모 학습을 가능하게 하는 시스템을 제안함
- 실제 이미지 천만장을 기반으로 최대 20억 개의 VQA 데이터를 생성할 수 있는 <u>**자동화된 3D 공간 VQA**</u> <u>**데이터 생성**</u> <u>**프레임워크**</u>를 개발
    - 이후 데이터 품질, 학습 파이프라인, 모델 구조 등 다양한 학습 요소들이 성능에 미치는 영향을 분석함
- 핵심 기여: metric space 기반의 인터넷 규모 3d 공간 추론 데이터셋을 최초로 구축한 것
    - 이 데이터로 vlm을 학습했더니 정성적/정량적 공간 vqa 모두에서 성능이 크게 향상
    - 이런 모델이 정량적 추정 능력을 기반으로 cot 기반 공간 추론과 로보틱스 응용 등 새로운 downstream task 가능성을 열 수 있음을 보임

## Introduction

- VLM은 여러 task에서 큰 발전을 이뤘지만, 공간 추론 task에서는 한계를 보임
    - ex. 3d 공간에서 객체의 위치나 객체 간 관계를 이해하는 작업 등
    - 여러 다운스트림 응용에서 필수적임
    - 공간 추론이 가능한 vlm은 더 나은 보상 평가기나 성공 판단기로 활용될 수 있음
- 인간은 신체 경험과 진화를 통해 선천적인 공간 추론 능력을 갖추고 있음
    - vlm은 이런 능력이 부족해 여러 단계의 공간 추론이 필요한 실제 문제를 해결하기 어려움
        - “vlm에 인간 수준의 공간 추론 능력을 부여할 수 있는가?”
- 본 연구는 이 원인이 **학습 데이터의 한계** 때문이라고 가정
    - 주로 학습하는 이미지-캡션 pair 데이터에 공간 정보가 부족하기 때문
    - 3d 정보를 포함한 데이터나 고품질 주석을 얻기 어렵기 때문
- **자동 데이터 생성**으로 이를 해결하고자 함
    - 기존 포토리얼리스틱한 접근보다는, <u>**실제 이미지에서 직접 공간 정보를 추출하는 방식으로 현실 세계의 복잡성을 반영하고자 함**</u>
- 핵심 아이디어는 - **최신 비전 모델을 활용하면 2d 이미지로부터 3d 공간 정보를 자동으로 생성할 수 있다는 점**
    - spatialVLM: open-vocab 객체 탐지, metric depth 추정, semantic segmentation, 객체 중심 캡셔닝을 결합하여 **대규모 실제 이미지에 대해서 밀도 높은 3d 주석을 생성**함
    - 이렇게 생성된 데이터는 캡셔닝, vqa, 공간 추론 데이터가 혼합된 형태로 변환되어 vlm 학습에 사용됨
    - 이를 통해 모델은 3d 세계에 대한 지각적 기반을 학습하고, llm과 결합해 공간 추론을 수행함
- 효과
    - 정성적으로 공간에 대한 성능 향상, 노이즈가 잇는 데이터에 대해서도 정량적 추정이 가능 …
- 기여
    - **vlm에 정량적 공간 추론 능력 부영**
    - **실제 이미지 기반 인터넷 규모 3d 공간 vqa 데이터 자동 생성 프레임워크 제안**
    - 데이터 품질, 학습 방식, 비전 인코더 freeze 여부 등 학습 전략 분석
    - 복잡한 추론 및 로보틱스 응용에서 새로운 가능성 제시

## Related work

- spatial reasoning
    - slam이나 depth 추정과 같은 전통적인 문제들
    - 장면 메모리, 장면 그래프
    - vlm은 공간 정보를 암묵적으로 학습함
    - 본 연구는 장면 그래프 없이 vlm 내부에서 직접 공간 관계를 학습
    - 더 나아가 정성적 관계와 정량적 거리까지 다룸
- vlm의 grounding 문제
    - grounding 부족 문제: 사회적 추론, 물리 추론, 공간 추론 ..
    - 이를 해결하기 위해 vision-grounded 모델이 등장함
    - 본 연구는 별도의 구조 추가 없이 vqa 데이터로 vlm을 finetuning함
    - 기존 vlm의 일반성과 추론 능력을 유지하면서 공간 추론 + 보상 예측 같은 작업을 가능하게 함
- 기존 데이터셋의 한계
    - 보통 vqav2, coco, visual genome
    - segmentation, object detection 등 fine grained 이해에 집중
    - 공간 추론 데이터가 존재하긴 하지만, <u>**실제 데이터는 사람의 라벨링 한계가 있고, 합성 데이터는 표현력이 제한됨**</u>
    - 결과적으로 대규모 + 현실적 + 풍부한 3d 정보 데이터가 부족

## SpatialVLM

- vlm에 공간 추론 능력을 부여하기 위해, 대규모 공간 vqa 데이터셋을 생성하고 이를 기반으로 모델을 학습함
    1. 데이터 생성 프레임워크 설계 - 기존 비전 task 사용해서 객체 중심 정보를 구성
    2. vqa 데이터 생성 - 템플릿 기반
    3. vlm 학습
    4. llm과 결합

**3.1. Spatial Grounding from 2D Images**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PAPTG3H%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCKIyCTltVF%2FjI%2BEG1zES6LezoCtrRD%2BOTpSXYbg3DnrgIhALj1l06%2FIDCp1zBbSo91ZVi07eSuw8EKuMRUvI0t2jXoKv8DCDUQABoMNjM3NDIzMTgzODA1IgxdX2RYMzwex1TcWHQq3AOhCyzq8HSMrGifqRYqqBhLD9q25ksoSDvH1CcElLTkZwVWs%2BCZAhrk%2B8GahAo%2FzL3uAFCyRjOr9gI2UjL%2FJYA8j6TyFIfAFUFR7GD%2B1VW9kqzjUE9jwqGMOg%2B3mLTTHpNd3IRq%2BRh7%2BVFgJGiHrsI9s4VI6Ntfo4JkPRM4ngz2dEctZL4LWN5R%2BX8OecSahhncBEayVhwV%2FTeUqJ2s8hNrgJiEYrVokuPPULXl0pLiAFsy141XLPmtYM4y3yJW0D17x0sLDmedDOacZwGXyJR%2FLD9cO4m6H7jz%2F%2BkOk0o4A8sKauYmFCzAj9G9oIh6BRCUe9LaQDpDV2bBsiwQjln0lBb9CFX0M3ZPlz5uht7joKPuDKKwOHOpDYuDV4rjqksjWl%2BZsYCddwX2MkPlaBa6SEPGtzzlS6no0cpFaQ5XEBKzV42c16mRRw8Q6Pl%2B0%2BdDAVN%2B%2BCb5bNyxWlyFI7KqePhx24k7GD5z6wiWwCSeLcj6oukNRH1M4fMU79ehsyu5FmBd6OgzJHpdl8%2BujRdG01%2Fi3CVliW017iymaPGxuKX5AVCJ0DxJqTj2sYt0RAoU2IS9AtaNAfH%2FF7NOUGlNUiRE0IhlolKvzaUZKNZ2sd25wM1w85OS0s0DvDDKwv7QBjqkATxN1nR7fsMBNmXUNKJwjiQtYbVDv5TopQwwxDVacfx18goNHrbLkk4qFNhHgilWT4Fi7Nw9m3oUnGeh2D6%2FhYBWJjgvW%2BynERXkEkV8NVtQJ6XSDQLyPiwccVX%2BaufiPGDmCWaT369gU722w3tihDv7S%2Bpg%2BErMMBWApMb9WrYnHpznsXccznJwPqNeq2ZbKms%2F0ZM%2FPkH%2FiAn2hRuIr9e6HENc&X-Amz-Signature=ef9af76b848cd13643981129d9942717207f8e6825495c507a5767439ffa0c5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- **Semantic filtering**
    - 인터넷 이미지 중 많은 데이터는 공간 추론 task에 적합하지 않음
    - clip 기반 open-vocab 분류기로 공간 추론에 적합한 이미지만 선별
- **Object-centric contexts extraction from images**
    - 이미지에서 객체 중심 정보를 추출하기 위해,
        - region proposal, region captioning, semantic segmentation
    - 객체 단위 픽셀 영역, 해당 객체의 텍스트 설명
    - **객체 단위의 representation 확보**
- **Lifting 2D contexts to 3D contexts**
    - 기존 이미지에는 거리/크기와 같은 metric 정보가 없음
    - depth estimation으로 2d → 3d point cloud로 변환
    - 좌표계를 실제 세계 기준으로 정렬
    - 객체 간 실제 거리/크기 정보 포함된 3d 구조 생성
    - **object 중심의 3d point cloud 생성해서 vqa 데이터에 활용했다는 것이 큰 기여**
- **Ambiguity 해결**
    - 같은 클래스 객체가 여러개 있을때 모호해짐
    - 더 세밀한 캡셔닝 사용
        - flexcap 사용
        - 한 객체에 대해서 길이 1~6의 단어를 랜덤하게 캡셔닝하도록 함
    - 후처리로 모호성 제거

**3.2. Large-Scale Spatial Reasoning VQA Dataset**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665PAPTG3H%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQCKIyCTltVF%2FjI%2BEG1zES6LezoCtrRD%2BOTpSXYbg3DnrgIhALj1l06%2FIDCp1zBbSo91ZVi07eSuw8EKuMRUvI0t2jXoKv8DCDUQABoMNjM3NDIzMTgzODA1IgxdX2RYMzwex1TcWHQq3AOhCyzq8HSMrGifqRYqqBhLD9q25ksoSDvH1CcElLTkZwVWs%2BCZAhrk%2B8GahAo%2FzL3uAFCyRjOr9gI2UjL%2FJYA8j6TyFIfAFUFR7GD%2B1VW9kqzjUE9jwqGMOg%2B3mLTTHpNd3IRq%2BRh7%2BVFgJGiHrsI9s4VI6Ntfo4JkPRM4ngz2dEctZL4LWN5R%2BX8OecSahhncBEayVhwV%2FTeUqJ2s8hNrgJiEYrVokuPPULXl0pLiAFsy141XLPmtYM4y3yJW0D17x0sLDmedDOacZwGXyJR%2FLD9cO4m6H7jz%2F%2BkOk0o4A8sKauYmFCzAj9G9oIh6BRCUe9LaQDpDV2bBsiwQjln0lBb9CFX0M3ZPlz5uht7joKPuDKKwOHOpDYuDV4rjqksjWl%2BZsYCddwX2MkPlaBa6SEPGtzzlS6no0cpFaQ5XEBKzV42c16mRRw8Q6Pl%2B0%2BdDAVN%2B%2BCb5bNyxWlyFI7KqePhx24k7GD5z6wiWwCSeLcj6oukNRH1M4fMU79ehsyu5FmBd6OgzJHpdl8%2BujRdG01%2Fi3CVliW017iymaPGxuKX5AVCJ0DxJqTj2sYt0RAoU2IS9AtaNAfH%2FF7NOUGlNUiRE0IhlolKvzaUZKNZ2sd25wM1w85OS0s0DvDDKwv7QBjqkATxN1nR7fsMBNmXUNKJwjiQtYbVDv5TopQwwxDVacfx18goNHrbLkk4qFNhHgilWT4Fi7Nw9m3oUnGeh2D6%2FhYBWJjgvW%2BynERXkEkV8NVtQJ6XSDQLyPiwccVX%2BaufiPGDmCWaT369gU722w3tihDv7S%2Bpg%2BErMMBWApMb9WrYnHpznsXccznJwPqNeq2ZbKms%2F0ZM%2FPkH%2FiAn2hRuIr9e6HENc&X-Amz-Signature=c076c0e7bdc36c1d9f89d67fef699c20f07f2e924c8acd18fb275da2b4537eb2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- vlm에 직관적인 공간 추론 능력을 학습시키기 위해 합성 데이터를 사용해 사전학습 수행
- 문제 설정: 단순하게 이미지 내 두 객체 a, b만 고려
    - 복잡도 줄이고 학습 안정화
- 질문 유형
    1. 정성적 질문
        - **관계 판단 중심 - 비교 / 방향 / 상대적 관계**
        - a와 b중 더 왼쪽에 있는것, 더 위에 있는 것, 더 넓은 것
    2. 정량적 질문
        - **숫자 기반 추론 - 거리, 위치, 차이, 단위**
        - a와 b 사이 거리, 얼마나 뒤에 있는지 등
- 데이터 생성 방식
    - 템플릿 기반 생성
    - 객체 이름은 구체적인 캡션을 사용해서 이름 붙
    - <u>**정답은 3d point cloud, 3d bounding box 기반 함수로 계산**</u>
- 데이터 구성
    - 총 38개 질문 유형 - 20개 질문, 10개 답변 템플릿
    - 이미지: 1000만장, qa 쌍 20억개
    - 정성적 50%, 정량적 50%

**3.3. Learning Spatial Reasoning**

- Direct spatial reasoning
    - 입력: 이미지 + 공간에 대한 질문
    - 출력: 답변
    - 외부 도구 없이 vlm이 혼자 바로 답함
    - 텍스트로 바로 답함
    - palm-e 구조를 거의 그대로 쓰고, backbone만 더 작은 palm 2-s로 바꿈
    - 원래 palm-e 데이터 + 본 논문에서 구축한 spatial 데이터 섞어서 학습함 (finetuning)
    - 전체 토큰 중 5% 정도를 spatial task에 사용함
    - 이 모델은 기존 모델처럼 일반 vqa도 하고 공간 추론 질문도 잘하게 됨
- Chain of thought spatial reasoning

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663C2USFUR%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJGMEQCIDn%2FFzhRbfG%2BKOXIRQnr90HrtBKnAxafmO3maF0ospMUAiBKq7laSJJdUH8Wcz5nYXpim72OKiubrnMSiOZP%2BPh9Eyr%2FAwg1EAAaDDYzNzQyMzE4MzgwNSIM9jZnZFwq8ssx%2Bu%2BVKtwDRLds5MnMl8FTflWMTUx6NB%2F9gCchIxKQtINyNSGAcAK42lPQwj85R11sy3eRoH4%2B6E9GVUGltmIgvSpvEBM5WPswjbs%2FGGoStdHaXPZtXwF0NBeil%2FmxeIx65gneHDP2YtYzUyIBwNONwfCo%2FgydzGb1W041OeSyQyfNO%2F%2Ffm%2FnRlIFQB6gPgvcb%2BiQ2yggHzUEYptDV9N5IWQNOw5B5R7jYOhm2laze%2FVqAvIC4%2F5FyoMCWUKw7CzYAC%2BsIBv9h4jZMShzfPEIsYgJmuROcdJJkNaZIyNCb5VW%2BLPGJLbnlWLQqrhvVy74P%2F5%2FAES5lFZweKwR6ZznaISghuCSYPXphejjm2UA0VXAZSbfLQqA0ZeJ7COKOs6CGhdcnllaXjn7lZRcjJlmKWO2ysVYWcovg3CrCHW6Ci6mHEYcvKkKIm64uA2Zd8kAiUSpqwJLENMbMPGhL3f2q0Di3yOWZNnCsdYY8I1wFilLeDFoAJL5pEqzIn67Et4RZNH%2BOETG8987JCQ7rqUEz2tFkgDhEPh0X0Fs9U3xTSTplTH27pBQSVgfjw1cEDK%2F4w8JAwb8AXAxo2PUhMecL%2BfJB1SMJ1f%2F2EF20hBwB7kXUxJGCZBy9vL22Nnw5fnkgv1sw6cL%2B0AY6pgHvCka8F0XT%2FcuWcyzkr9QDAsSILzENQ%2Bho2ML2Fm0SgqkwjjLtmi3A2yZLkLRDHpV81L2QIGTUxARZikNTjp8LnN9IzShjYkc0gs3pWEOg%2BXq9G11VoxJtJr%2BHfJaMNqX2vo%2BmoPZnDlQ7GrJ0tJwmzg4Hz4f8SVJ2%2FIqwUi3zHLS3Qvoq5RdgqG1Wjf5gFFtTGe%2FN2I7XAT0jAiphgnFZ5iUsVt8Q&X-Amz-Signature=072537d16ad3d9e4a82712636914ab0b2c7aebc3bd3c3eb47522b8a2cdb701d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 한 번에 못 풀고 중간 단계가 필요한 여러 단계 reasoning이 필요한 문제들
    - spatialVLM이 기초 공간 질문에 답하면, 강력한 llm이 복잡한 질문에 대답하는 구조
        - “이 상자에 저 물건이 들어가?”
        - LLM이 내부적으로
            1. 물건 폭은?
            2. 상자 입구 폭은?
            3. 물건 높이는?
            4. 상자 높이는?
            5. 비교해서 결론 내리기

        이렇게 **작은 질문들로 분해하고, 각 질문을 SpatialVLM에 물어본 뒤, 답을 모아서 최종 결론**을 냄


    ⇒ **Chain-of-thought Spatial Reasoning**

- 이 연구는 복잡한 multi-hop 문제를 직접 학습시키기보다는 직접적인 spatial QA만 학습시킴

## Experiments

- RQ
    1. 본 연구에서 구축한 **spatial VQA 데이터 생성 및 학습 파이프라인이 vlm의 전반적인 공간 추론 능력을 향상**시키는지? 성능은 어느정도인지?
    2. 노이즈가 있는 합성 spatial VQA 데이터와 다양한 학습 전략이 성능에 어떤 영향을 미치는지?
    3. 직접적인 공간 추론 능력을 갖춘 vlm이 cot 추론이나 embodied planning 같은 새로운 능력을 가능하게 하는가?
    - 모델은 palm-e training set과 자체 spatial vqa 데이터를 혼합해 학습함
    - 공간 추론 한계가 데이터 문제때문인지 확인하기 위해 **semantic captioning 비중이 높은** 데이터로 학습된 sota vlm을 베이스라인으로 사용함
- 비교 모델
    - gpt-4v, PaLI, PaLM-E, PaLM 2-E, llava-1.5, instructblip
- 4.1. Spatial VQA 성능
    - vlm의 공간 추론 능력을 제대로 평가하기 위한 spatial VQA 벤치마크가 없음
    - 직접 구축
        - WebLI 이미지 일부 사용 (학습 X)
        - 사람이 직접 정량적 정성적 질문/답변 생성
            - 정성적: 331개
            - 정량적: 215개
        - 3.2. 합성 데이터 생성 방식으로 생성함

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZZVV67QK%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051512Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIFUSoYfYMKtneP%2BbQXQxqMUG4WArYOhMpQFKwuVykSCnAiEAxz73mjaGDLGYUXSku2DrS31ZOIJbRJKo4Drpab2fokIq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDKfR5ODnE8FvmcwxsircA5LbzPE5ScfX6Q2g%2BlmmjUEx68TM6kRYUkVcGDO3%2B2SP2N27q5CCz8MT04K3%2FCWJugcdlD2WZ3W2z8kpyfDUePTUr6Hb0%2Fj3bzSWR7inmc8%2FQvrJN%2BuDpGDuvcwtGRL7xiw0RTkf86DijHBvy7JFO%2FPT%2FElSCMIACSqkfzkTF6D1cm%2BAK33aK9GZHD2LymsSW0ur0XCWBQWegSOERZUb3wCIIZ4y5xUVwvEnt%2FqSLphCPfsvGiYXrFw%2BM58ZXH0iPRsSgDHFwsGE6QMNMIKYRTMhs2u%2F%2FLdPho3v1ip3nc7U%2B1QQO6Qwqde79Cn1Cd5hq7S1LWkK3C0JXr6l6VihNZWA7cBB5i9CrGa6oEMV9KiaN5I3d4Sg7RB9Z40GBgNtPEKkgk2MdE6gCW8Gfp2arfVOlQ9pdLLHOhCRYaNuB6HwxNuQ14LYgZbrk6UVkkdFJ%2BYqIVu3DlNwnHNMdmjsHTK9NJwiN5OOf9zgdkY7GfIkAXlp%2FRKsmaFtlPK1NU1AG7O8ktFA4HBBVum77M14lieX47aeiJg2B1pzTcJL%2Fo2cLeLjxSlxthZt3JcHoi2B%2BU29SHBLqLcFZ8DS2%2BIpxrU094BEaV%2Bq8nVuFu1cP0KhYICjnHj6BjmgPI0gMOTC%2FtAGOqUBydKyAD%2B5yrId4xBB5tzWwyn2m8z3isUHQHNf9YGqAUDPz8R177Q8nToO6xzyPHaPopwNydQqrqwwY4cHy0D9E5O5cqdZX2%2Bs9OJZHZzwYesXOPBPXvEr1V27wyn%2F9kMN5PhljQiEtbGIFJsYOIoarHmx0zHprbFlRWJUCoOAK0EzyW%2BC0rydLrz8PcYak4f6M1cxypdifPPkOP5kooMuaqBxE8K2&X-Amz-Signature=38f8b154979f9c9f8a405be8d371ce6dc7c398bc15a4f55fda5a0be82be530ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정성적 분석
        - 정답과 모델 출력이 자연어라서 자동 평가 어려움
        - 사람 평가자가 직접 평가함 : 정확도로 평가함
        - Spatial vlm이 모든 베이스라인 대비 최고 성능, 특히 gpt-4v보다 성능 우수함
        - 베이스라인 중 최고는 llava 1.5 - bbox + caption 기반 instruction tuning 영향으로 추정
        - llava 1.5는 2d 공간 추론은 잘하는데 3d 공간 추론에는 약함
        - → **대용량 + 고품질 공간 추론 데이터가 공간 추론 능력에 핵심**임
    - 정량적 분석
        - vlm 평가를 위한 2가지 메트릭 설계
            1. <u>**vlm이 숫자를 생성하는 성공률**</u>
                - 정량적 공간 추론 질문을 이해했는가
            2. <u>**답의 기준 범위 분포가 다양하기 때문에, 답이 실제 값의 0.5~2배 범위에 들어가는 비율로 정확도를 평가**</u>
        - 두 지표에서 모두 베이스라인보다 큰 차이로 우수한 성능을 보임
        - 베이스라인 vlm은 숫자로된 답변을 꺼리는 경향이 있음
            - 아마도 학습 데이터의 분포 때문일 가능성
            - spatialvlm은 카메라로부터 1~10m 거리의 중간 범위 장면에서 성능이 좋음
            - 이는 사용된 monocular depth estimator가 정확한 깊이 추정을 제공하는 범위와 일치함

            **→ 데이터 생성 과정에서 사용한 비전 모델의 bias와 한계를 그대로 물려받았음을 의미함**

- 4.2. 일반적인 VQA에 Spatial VQA 데이터의 효과
    - 상당한 양의 spatial VQA 데이터를 함께 학습할 때 <u>**다른 작업에서 VLM의 성능이 저하되는지**</u>의 여부
    - PaLM 2-E와 우리 모델을 일반 vqa 벤치마크에서 비교함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRQ66XEV%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051514Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQC%2FH1%2BDzwLL%2BcODWQMG1c32LKjI9Hgn7FTFVret05ohqwIgIbPM4gBjAOKxFQPbqQ%2Bwje1lYp3qn%2F%2BSWXAs98ULNTsq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDAicHBNhE%2FhU6sr%2BUSrcA4FfilWEAlyan9%2BKeW42odDP3pGzeF4F%2BNkXGKKqfi4szNdJydCeAZQeVRZAFiADIWnTXX0nnch7VN5iJ1lfeoRMzdWayDsCnXK%2FG%2FL4OpeyAlUIIxbioFeZeFu33tM%2Fn1%2B2I1Su0jhVld6QZg%2BkVTQScYChxvYPtuHLVcdb%2Bxm5zOIU%2B%2BdWrk9Br02FQgUHs6GiCA5JheH8rdBMYW9bRTASxPXWMHQycwgZfdUr93bwh3dZdSbgMJRkJEkNUatlctKMDVl6eHu4mgbKgAh2BjW2DBC%2B6kBSxo5SAxWIzrr1%2B2%2B5Jn0GWKPAiuunP4mSSQCqEC0652P6YomWqoJvAdJ%2B1ZWrqQAYCfwphPQvSmT%2F5ckfOM1mt8NHla66tzgWyrSBFRwiqXjLud0eYsUSxqoIh3YT2ovx5its8sr3AJW0XwTKD%2BWRoYogiut%2FeulHbxsC6KH8NoZYgu1v35AFOboA0Aq4e1DDfwISv18gDluRO7EoRIE%2FRb%2Bme9VwRDKbAZiP0Ym2kSU8koRzckUlaL18CVyY6r7tbWqpPCOKAf%2Be9XviCfFnTlK%2FDWcHUlsawU3FT%2BTd1Zll2pPxwKibYW5mPyBY1QixldsH49VSQ7lpXdxAgRT%2BGSjKxlxoMKnD%2FtAGOqUB0x6tfhp98yzOyAqe9RKA8ITFsBPLIVpCUspgnj9Lea6VWXKvOLRN8HAlW7uV1BDJ3qDRaR5VNU%2BCIpEpMh%2B7i7ZwELuibUWJ%2FPaTRSoypOtmXw4SkJOhtpCsC%2B6C2HkCPMH7H5DB%2FdFPfa62zcDUwgxLbWuLxh4ihzPyKJGmg72dBJ861ryLQC2dtiiCR5SzyzvLj2XE3yXmRp16RgE2Rs4m%2FyPa&X-Amz-Signature=656d9ca8ca720704c1176cc849d7c248a49c19a83584ba4845e450748408db55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4627AOE%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051514Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCf%2FTd%2FI5kVprZ8hHrr475ZyiCfSyaQIPIYSX4Fwm%2F0egIgO58uveSZ4KJ9PeurnKAlZLkZRj6iggd7%2BA6N%2FQcokHMq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDCGJnmcnZavsp0vhIyrcA2sphZ4WVP3dsQ4YWwPjD8HK2lLDPUlmQqhwlZ8T5m5X2Qwm0a5lz8AfsSWsHYqp0q39Ku4v9NjFXNPekESJyPFTFdpaa8VRN2BwZmy8P2LeoeMxL9%2FuAhTgoHRekOUHz4ZZH3LDJhFAhfAGQ1%2FrBsvzGShV2HB%2Bwc%2FNWpv6fVf%2BvY%2BsoPFQjX4uHp27mdHeBeiVZGR1eD6E%2B%2Fsu5WovSfSKcFAOm%2FlcfPG0vqpb%2Fb2pB5rdSXs7te%2FKzAme%2B9mKUwMIrrTuWIjvqoI2sA%2B7Nv03g5dPVoBobIB5zbACyTui6ajyqpAtq9zowdvwKBj2CSSjg2uPltTv6hRbg5o0lrpSe4tk%2F9nw%2BlNoeOqBxNZ%2FNOQp6qF%2BJT5dku8v%2BLd%2B6g%2Fk2v0Zg5WA1%2FKtUY0TE%2BpI5gZULEj76ShxdgwzRWXrC%2Fmb8roMK2lFZlxJtd%2FEMd7rKOF3YDYaSUhdXIKfogkq4poIhtATfsNlhknHyYkJgeB3hwhLWhUfkaATjXQ2Q7hFgpxg8Xw%2FdMM3lsBQS2dqodnq5GCLbbtovq9ZUXLmqyRAwkgG9uuVPW0drdXioPfpUIJi6ox7%2BMKt1Tm88BlcteboSbN24%2Fnzfjn4gkiz9oSOhSE9zzvyN8YGMPzD%2FtAGOqUByPlO%2BRNs2uALUByRhi%2FQOaLvQj%2FyOUgKjNrO4jPLMNLuANhcF3C%2FP71w8n0qi6qt%2FoeAoNvE6vnwgXEqRXJY4EdnBl655Ypn6qsCr8q9%2FpermWOkYXO7lvNh0ALZ8kcFErNh9tbdUaE%2F7MwaIR9o0zRc%2FDxmQpuCIF3ZgJwV2JZcUE0d8%2Fjx1X%2F%2FvNFgBkL6wJMGHVklom10yHjbiQ5mFuxUsQX9&X-Amz-Signature=d58996933e4307251de1f2cb9accf636bd7a655a8a9ef33f0793d69e7bbea8ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - contrastive objective로 학습된 frozen vit가 공간 추론을 수행하기에 충분한 정보를 담고 있는가
    - 이를 분석하기 위해서 110k 학습 스텝에서 출발해서 vit를 freeze/unfreeze해서 각각 학습
    - 두 모델을 각각 70k 스텝동안 학습하고, 각 모델의 답이 실제 값의 다양한 범위에 속하는 비율을 평가함
    - 정답의 50~200% 거리 추정에서는 vit를 freeze한 것이 unfreeze와 거의 유사함
    - 더 정밀한 거리 추정에서는 vit를 학습하는 것이 더 성능이 좋음
    - **사전학습한 vit가 세밀한 공간 정보를 일부 손실하고 있다고 가정함**
    - 0.9~1.1배 범위에 들어가는 정확도에서 8.4%를 달성함
    - 인간 annotation이 노이즈가 잇음에도 불구하고 의미있는 결과임 (사람은 노이즈가 있는 추정을 하는 경향이 있음)
    - 다양한 도메인에서 vlm의 정량적 공간 추론 능력을 평가하는 것은 여전히 어려운 문제로 남아있음
- 4.4. 노이즈가 있는 정량적 공간 답변의 영향
    - spatial vqa 데이터셋의 정량적 답변에 노이즈가 존재하기 때문에, 많은 양의 노이즈 데이터를 통해 vlm이 일반화 가능한 정량적 추정을 학습할 수 있는지를 봄
    - depth camera로 측정된 거의 gt 수준의 깊이 정보를 제공하는 로봇 조작 데이터셋을 활용함
    - 그 결과 생성된 정량적 답변은 더 정확해짐
    - 이 데이터셋으로 vlm을 학습했더니 그 도메인에서 정밀한 거리 추정이 가능했음

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662ZSGEN7B%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQDgn%2FF3P6iHnIS0Cuku0UKALTrIHhp0%2Fhdry4hCxwK9DgIgYrUH%2B2lPN%2BVvdbWpzpiOFet8trXhRkvSi6eeC%2BfYwJ0q%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDFLwLTMmvMc78NyKCCrcA7hPGKJ5fWxU9%2F6vfoavO3z1BK4ae3XSVHFoQRqdCimtCfRb8N5tOHhAPRs9j%2B1ZKttkklTMOqsO8oigHrk5N%2BFFYI7ZTPkOMCY6YJFq27XDx3%2F7HSBKTZkkemOSXsh9r4WugywK80Y5%2FCLwjEP0t7ACWHwou%2B5I%2FhMkiOmBKRScMHp4dN2%2FbOftpAdQr1mXkfvsZQmWXgn%2BDWRbAOoIqUWs%2BrsL2xdyeou%2Fq8kAl%2BbALrmOXQrvI6y4mWSQzFcZoOhgA9ld5BjTWuZzbUnyAOTuxeFrDTu57aYSfH115C%2BNHNTv1TWbJ80birIJexffkulY7x9OHtyGFyjPlM%2Bq%2FCv4%2BRufOzo7ybCqnQ1ZrysDoZZYwdGng%2Bq2Z3LrETfgAfOuWIbcp5uGrXJuWkPj20FLrGaGcrg9WpaFSBLb5aUJvbVol%2BI12U0KvomxFzDy4jS4wb5VbCB49RUZP8z%2BK7gv6gYqnK%2B1dWwDA4JrvYYrZRFxyN1d%2BPiI9CBoSIKRNDUWjMu4f0ZjNIcQx7tfkKDRDTqylEDv9UiQCSfpv3WLPR0hj74Gigb1oFj75zp%2BMjEOHEUKN%2FhR2R3I24nMQqwJkCBY7ADTDpyiNVXIx4Z%2FBKu2fhftNH29OBaOMMzE%2FtAGOqUBqqLAr8DAt2tx4tPrO20DkgGaxsets5Y4WuVMdPKAd7qW6%2BBqd%2FZ3qkusbSZOdI0g7RF6laS5CGnEEnQuUR4lGsB%2BQY5D17SUfsMwTroRLWaivyXIp6SmHCImZaFux%2FP6uDLWBo6zVvTAvPX6U7kT94VbVpmYY9J1dYjyUy0HzZg%2FE%2BEdvczMDX3zn3p3fMlOhb38gekKeCD3hZS38%2BswTjW1idYv&X-Amz-Signature=05a31dd26234c29dba5cf5cee527b998ca7ab7b2bbeba3821cb847941c76bd25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TBQXPFAG%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQC60hjAEW5UkHXw7YoEos1cIR%2FxKR5QpCFKv3BiD9EpNwIgEaBp6RtfLdH8CDJroPB32tIKlEfkouHjwyhf9pHOmXUq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDEs9SAPsb3ytRpFxHCrcA5vh0rnZw0V51AqSXvbleKDhoZTfdlRNiqjhW4I%2BagX9Ya4u%2FOeGaCkTMGTv9SIjAi0laPM%2BAY7men1TC1VU8q5B%2FQ0lfdrfAN5%2F0kbE9xxiB%2FftE%2BLoOPsV6zBo7BNtYv8cIMpcmdatg%2FuEF83ObaAr0VrvI9M8tqty1Iz%2BLBHuj8waRCuxQ6WjInmJMOYPxFDaLVcCo2BKBJmuwNAA3myz3Hcez8qUIXf1DpQdGDryrUDz1QWzf75w%2FnRtjCy8dIRD2D1WqLUj8ilkmtnazQZOlG0KtjLkjM42drxu8YElmkEEz28ISvQy09dG1oaUcnUlI%2FW2%2Fl5l1Op%2FZ%2BtHqeacyeS5%2BLWib7CvB454dFP%2BamxmReweqAHgK1jYebwsc8nAgBiH1MuNqUFbgJJonWrwLCuSZWY19aN%2BBFtMkZU2Otc7v76TA6uP2OWz1VmSBcAR2RknC%2BLw8X3hw2kPqaIdyW6GzeRMytkP7hKbGJSJK3fnkwG1ALZeUQ6UffUaQtamDbAghzaq1SeNU70DldNUTl4dNLVgxjLfeSylGt%2BcRj%2BQw6cXvWkhY%2BjUGXksN7EcKqsi1%2Bad6K9OJKybEMW0pJdW%2B1m%2FdNDSGyRaX43F%2FyT7f9NRC5fdfgVGMJjD%2FtAGOqUBVFwVK0fhbsp9S39bVpROMPoCw8b4SQXazI%2BtSRXJ6BYACiD9TPcgv67Q827r0vH4T%2BmcUGTjF1yWr%2F1lJ7Qq%2BnWhH5P5u8hJRnJ%2FrRcousbVLey7kBk%2FAPw%2F76qV4MDuBExfrCETW6Uot5nryodhUprAretYaJfdotfkryEUm8zj0llA%2FJQRIqi4VajmbWgzs3z0nJWxCYRi3%2FNUmcpHTz4oZSfi&X-Amz-Signature=64418bb4ed2bc3fe83ccd3473941edba5736313d0598672c3fe5323e36d03303&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q3L56Q2V%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051515Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQDp4jIhApAY2OMVJPL6KlgO8AjA2I0iQABB16WeMy9DdQIhAPSKQ4J7GQY1P2ixbffAXziPCDWbLOeCohhNJnCqx2ZdKv8DCDUQABoMNjM3NDIzMTgzODA1IgxhHnLFDjeCE6vOl4Eq3ANFnlVsjTqPJGItFTrjvUgxFRzrb%2FaI8tIhpXasOfX%2F4T%2FnW9YWUhOA09lqtwChlIG%2B7b3JRc4hCk%2F0BPI4L4%2FFuMFztZ%2F8iKiKkumnrdVGOY4xgCzEF4FqDvu9cB4oNDrucWW9NJzN5yOsys9Uh%2Fq%2BJxjXmbmzdtbPe2UuS4PL1wbrxMRWDeW59jLw7QCZvtqqWZ%2FdnoUsBAwRfZGnXAaW8oE%2F7dentTz6twrXYyHyPgEkNuTfpQJcpP%2BYmm%2BXyjstDiULks8yMFA3wSZqLJnNqxxOQ9TllqUqMU9SDFq6fWdwdGk%2Bl81DcBcrOnmcqhH9Dtw5ExMdP%2BixOcFlelSWKK3M4yysJi3eys%2BhwGcENYVLAk1APPrtYbMW2BfIEbyTYK5L87rqcbGyHnZr7dKaT1MTyKwS%2BM2l3q1%2BYmSWs0QPOssgjPuJWAmBy7TBwuhFqkVoYqw%2FapxlueCHpTaBM383w3qt88xGsTr4ByEfTQfADVsnadMUtVsBFZeDcWVS%2B556qgvjRvVAqtVJ7I1k%2FGzk%2FlBk2D6JjLyatVO9c5Wk9AJm9dcghfrmzJpUq3tldxbd8oq5ch6x%2Fxcy0FLASlGybkCE%2BRY9ijSdI39Mij41WphzVCqb%2FaoHRzC2w%2F7QBjqkASjcszZdFvnP%2FPfEc7J1G4hnnJ8VXLaO%2FdHT74Wgq40XcqFm3%2FF6OwmPWRITm3m4tzLvEyFduR2T5CEq%2Bhb5U%2BGvPhB%2BTyMNKJbKSXircxnq903pmksSnT6T%2FRF3Ezv06VwZU2x1Xhv1zqQ7eK2BDInmvppiDVsBrDmR%2FLNefLVmASW1rz7Vgx4PpMSMwaw8CN9K5e%2BK6AAs10AfNtvegaKi3292&X-Amz-Signature=9acdd951cf7eb2aba3d14165f565d8d406762fa0f4ad3480ec773083c0055dd3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 거리 추정을 통해 로봇 작업에 reward/cost를 줄 수 있음
    - 다양한 그리퍼의 위치를 샘플링하고 그에 따른 cost 함수를 scatter plot으로 나타냄
    - 모델이 강하게 정규화되어 있기 때문에 거리 추정이 평균값 쪽으로 치우치는 경향이 있음
- 4.5. Spatial reasoning이 가능하게 하는 새로운 응용
    - dense reward annotator로서의 vlm
        - vlm의 중요한 응용 분야 중 하나인 로보틱스
        - 최근 연구들은 vlm과 llm이 로봇 작업에서 open-vocab 기반 범용 reward annotator 및 성공 판별기로 활용될 수 있고, 이로 인해 유용한 제어 정책을 학습할 수 잇음을 보여줌
        - 하지만 vlm의 reward annotation 능력은 공간 인식 능력 부족으로 아직 제한됨
        - spatialVLM은 정량적으로 거리나 크기를 예측할 수 있기 때문에 dense reward annotator로서 적합함
        - 자연어로 작업을 정의하고, trajectory의 각 프레임에 대해 spatialvlm이 reward를 부여하도록 하는 실제 로봇 실험을 수행함
    - cot 기반 공간 추론
        - spatialvlm이 multi-step reasoning이 필요한 작업에 활용될 수 있는지 분석
        - 대형 언어 모델인 gpt-4에 spatialVLM을 공간 추론 서브모듈로 결합하면 환경 내 3개의 객체가 이등변 삼각형을 이루는지 판단하는 등의 복잡한 공간 추론 작업을 수행할 수 있음

## Conclusion

- 본 연구는 vlm에 공간 추론을 주입하는 문제를 다루며, 인터넷 규모의 실제 이미지 기반으로 3d 공간 추론 vqa 데이터를 자동 생성하는 프레임워크를 구축하는 방식으로 접근
- 대량의 노이즈 데이터로 학습하는 것과 vit를 unfreeze하는 것 등 다양한 학습 설계 요소를 분석함
- 학습한 직접적인 공간에 대한 질문은 제한된 템플릿 기반이지만, spatialVLM이 공간 추론에 필요한 더 복잡한 COT 문제로 확장될 수 있음을 보였음
- SpatialVLM은 로봇 작업에서도 유용하고, 3D 공간 인식을 갖춘 VLM이 로봇 작업의 reward annotator로 활용될 수 있음을 보임
- 더 정교한 기하학적 요소들에 대한 추가 연구는 spatial reasoning을 3d 기하 구조에 완전히 정착시키는데 도움이 될 수 있음
