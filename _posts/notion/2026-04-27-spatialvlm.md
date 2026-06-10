---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W32LKHPR%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQDgHP3IOUdGplR6iIW8f1GZyiklGRQcWZmj%2FPQFl6Yn5QIhAIfzlzQUfVFqLR9Qu%2FCkgY%2FnjmOH%2BtssUGalHq2eBSZ%2BKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOSXloAKqhnEcZuVEq3AOI2%2B1G%2BR3U1GhTrsx9bBd3KWqiL3ooo3hQa%2F%2BQDcIafa%2Fm9fn3QMvlz6MpT2KLR2MPtBd3SpIEzEC0O3%2BFb9bXhoj4w24RIp8uBJ%2BpTVhzjcVxxOcdW5T4Os0rycb7boH181NB8Vqtif%2Fsj5qvPULQ6ub6ARmmppr8GP1gypgwbIYHTdIet1%2BVjrKQ0RRFtD9z%2BZzm%2BkFt9HM%2F2iN3TVMrJPUBLr4tO2UxYLqowiCNATCCuLSyAeLNXCOjZND2Q1bfoR1FBlEPrZB%2BvpPThNfW%2FE9njAtOKEt1jYifQDhBJdLMB%2F57ZeZhkzQueN4GGssOdtLternK8hp4nqdMSwnR0oG6ixXNQQsVc4dahAFmB%2Bi10XhlKln1dkuAZcLstYQRmipBByMhuejE7hwHCkM4vDfN1GCLb%2BG%2FxoV3toAWvrKANk5%2BXXDUP12G55ivPQqPm4HdkQTMXy0zW797iR5tB3AyVqWeg9767sSxX04XWScP0DyEEDDrYbW%2FOTgt46cpmND0l%2FTp7Pjo3rkn2J4tleH1qOVzTkv6UsgqYfXZm2enXRqZzgB1FbZmiVU78FTnQlnA9RRLNPLLYzEuGryrcKJsDnyMLLX%2FTtvC%2BSJspdRF5n1pwL13e4PmGDDRuaPRBjqkAYnhcNyc52QvR0lG7Du85F6voWQEpip7cndc1%2FNMRO%2B82h%2BuvN56ehiI8gTz5Ff1WjF0s5spT3ZHUH5qSwazPv3FdcUknpIuRE0aD3jfaN9mVhQ6iR3ppoF6FFnHwHG1g5ind1UvmyVs3Ht7yvSqQkGA6l0OidJjQsJ4qYZquuntUghAPHlAuLTYn1lgUl%2BAmzgh0CxlzGL7jm%2FhI%2BJC%2B0zlpMN0&X-Amz-Signature=ff7ccf40160d2e69fe556df6b938d3649f813e60e9b4b01f813f61dc99473b2c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W32LKHPR%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQDgHP3IOUdGplR6iIW8f1GZyiklGRQcWZmj%2FPQFl6Yn5QIhAIfzlzQUfVFqLR9Qu%2FCkgY%2FnjmOH%2BtssUGalHq2eBSZ%2BKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOSXloAKqhnEcZuVEq3AOI2%2B1G%2BR3U1GhTrsx9bBd3KWqiL3ooo3hQa%2F%2BQDcIafa%2Fm9fn3QMvlz6MpT2KLR2MPtBd3SpIEzEC0O3%2BFb9bXhoj4w24RIp8uBJ%2BpTVhzjcVxxOcdW5T4Os0rycb7boH181NB8Vqtif%2Fsj5qvPULQ6ub6ARmmppr8GP1gypgwbIYHTdIet1%2BVjrKQ0RRFtD9z%2BZzm%2BkFt9HM%2F2iN3TVMrJPUBLr4tO2UxYLqowiCNATCCuLSyAeLNXCOjZND2Q1bfoR1FBlEPrZB%2BvpPThNfW%2FE9njAtOKEt1jYifQDhBJdLMB%2F57ZeZhkzQueN4GGssOdtLternK8hp4nqdMSwnR0oG6ixXNQQsVc4dahAFmB%2Bi10XhlKln1dkuAZcLstYQRmipBByMhuejE7hwHCkM4vDfN1GCLb%2BG%2FxoV3toAWvrKANk5%2BXXDUP12G55ivPQqPm4HdkQTMXy0zW797iR5tB3AyVqWeg9767sSxX04XWScP0DyEEDDrYbW%2FOTgt46cpmND0l%2FTp7Pjo3rkn2J4tleH1qOVzTkv6UsgqYfXZm2enXRqZzgB1FbZmiVU78FTnQlnA9RRLNPLLYzEuGryrcKJsDnyMLLX%2FTtvC%2BSJspdRF5n1pwL13e4PmGDDRuaPRBjqkAYnhcNyc52QvR0lG7Du85F6voWQEpip7cndc1%2FNMRO%2B82h%2BuvN56ehiI8gTz5Ff1WjF0s5spT3ZHUH5qSwazPv3FdcUknpIuRE0aD3jfaN9mVhQ6iR3ppoF6FFnHwHG1g5ind1UvmyVs3Ht7yvSqQkGA6l0OidJjQsJ4qYZquuntUghAPHlAuLTYn1lgUl%2BAmzgh0CxlzGL7jm%2FhI%2BJC%2B0zlpMN0&X-Amz-Signature=e3715cf00aa39dba4a0208506284f167f597bf38fda70f3d3d973185801dc53f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W32LKHPR%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQDgHP3IOUdGplR6iIW8f1GZyiklGRQcWZmj%2FPQFl6Yn5QIhAIfzlzQUfVFqLR9Qu%2FCkgY%2FnjmOH%2BtssUGalHq2eBSZ%2BKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOSXloAKqhnEcZuVEq3AOI2%2B1G%2BR3U1GhTrsx9bBd3KWqiL3ooo3hQa%2F%2BQDcIafa%2Fm9fn3QMvlz6MpT2KLR2MPtBd3SpIEzEC0O3%2BFb9bXhoj4w24RIp8uBJ%2BpTVhzjcVxxOcdW5T4Os0rycb7boH181NB8Vqtif%2Fsj5qvPULQ6ub6ARmmppr8GP1gypgwbIYHTdIet1%2BVjrKQ0RRFtD9z%2BZzm%2BkFt9HM%2F2iN3TVMrJPUBLr4tO2UxYLqowiCNATCCuLSyAeLNXCOjZND2Q1bfoR1FBlEPrZB%2BvpPThNfW%2FE9njAtOKEt1jYifQDhBJdLMB%2F57ZeZhkzQueN4GGssOdtLternK8hp4nqdMSwnR0oG6ixXNQQsVc4dahAFmB%2Bi10XhlKln1dkuAZcLstYQRmipBByMhuejE7hwHCkM4vDfN1GCLb%2BG%2FxoV3toAWvrKANk5%2BXXDUP12G55ivPQqPm4HdkQTMXy0zW797iR5tB3AyVqWeg9767sSxX04XWScP0DyEEDDrYbW%2FOTgt46cpmND0l%2FTp7Pjo3rkn2J4tleH1qOVzTkv6UsgqYfXZm2enXRqZzgB1FbZmiVU78FTnQlnA9RRLNPLLYzEuGryrcKJsDnyMLLX%2FTtvC%2BSJspdRF5n1pwL13e4PmGDDRuaPRBjqkAYnhcNyc52QvR0lG7Du85F6voWQEpip7cndc1%2FNMRO%2B82h%2BuvN56ehiI8gTz5Ff1WjF0s5spT3ZHUH5qSwazPv3FdcUknpIuRE0aD3jfaN9mVhQ6iR3ppoF6FFnHwHG1g5ind1UvmyVs3Ht7yvSqQkGA6l0OidJjQsJ4qYZquuntUghAPHlAuLTYn1lgUl%2BAmzgh0CxlzGL7jm%2FhI%2BJC%2B0zlpMN0&X-Amz-Signature=5be7c76b29f08c7eb188c6ded2b3951905c40ca06c61abefe0fbb58dcb78f281&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SXDWOEY%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044617Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQCeBAPBdHIbok0JqbYKwveneaI9ee6O6AfxMhE7OEnjSwIgOYQ5R%2F7hu4xYkmL10j9ELG2KDGl%2BE%2BlFlxXh4mpVqzQqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBeJkpV4FIKS4d%2FB4CrcA3acNH%2FwInEoaW3K9cqAu8d5rptrHtGB1iMwM7ORvw4J7kuZUl5JECHiUuIFKQhTkNcqyGXz85EyqsHd0s6%2BXFoKsk3Jzp7S0EvueFUs%2F1iQkLNcUomCI4FHmoLycGpyJJ8pJirf0AdIR3iqeyZRWeV2EYCq%2FFR7wXD%2FOZNZW460ofrBW5xOrUpRQA5d%2BjaL87BO0FZvxPvua3ehEY6x8kCy3FKTh13zDDTcL2dFSx2oFJMPBvMF90tcl6nR%2F6zTIhNZXfzqcreb%2BZHYBxpLovzirzYSbEuIncV9KxfxUUCU1vs6ha1KXJEimEjh%2FsLS0gUfr7dV94mOf2Rf4SuAXnqk%2BOMXtV9gRlLf8mSPjWFc8L5Ub%2BDkmFYO%2BAeAs9u9RjoJ%2FYvh%2By7Z45dcU75f%2BQ2fM56gF%2FBPrakxrEUFguVKX7Gs21EH6E1CbnXhzGh3cYAdypvXd40cDiOzUhq2DWwc36oxSc%2BPsmCKhuCIccZG0yl8CrPrcLlVvQwTDSaxIxuNPNeBsu5IkdQOMnqaOtE7t%2BZkatJSpAiK3jEsObRUi4VfH7gClb0ioSxmxhIB4Ywyj72lWM%2BCV3%2F%2BwEd5Us3FxQrzEGkcb6gvHQHYNhjGUnIkYX7Gy%2FscQhcgMKe8o9EGOqUB%2F8Z94Acoulq2eXhweEorlwL3HYcBUWiahb7na8%2BYh5Heiu17yvvXJjsoX8%2FRNd%2B48xon8qmk1vMbLy5k1SDfQm3gx8AcAV0ISJ%2BpVyCM6KEmhBQg3YGgLOgmo%2Bo52TETRp9gEPbGBN7isbbksCn15K070HfIHXe9JYBuvexzWpaMcv4%2BTFcxpi7O7KH8bJdHmQ7a1luB9lxYG0%2BfMtxF4DVZHYEE&X-Amz-Signature=55f2b9cb6ad77a33caeba3c78b5d5ed50224b6228f1abad2f8b29895479d1063&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XQAUKQWB%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044618Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQD17%2B8%2BRW7lVOzHMsTx0EjEyGL0BRkVn8B14WhzLUBIjwIgBfbjhcQB6JVzu5G8dd%2FCs1fjEdMCDoa1gWZvTyfJI5YqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIwEtXH5M8bHj6O6xCrcA6kPHmo4EvALza3NtNq67kfZLed9TMRY8ReJDoirZapGYm9oN5zoZTCVzUHxcTdnaodcEVpee74QFCAC9ChGQwDvaSMfKSrNjwaR1isjQmxyMcS3b%2B8KjQpY8xFlmMPQS23f6weILJ898B84MF5zx6G%2B4Q0dl84Akwek%2FePGwKzTzw6wXXh%2B0CWqir%2Bv82TKamKGY22X0qeQDVBV%2B9hUJx8OdiR89PSBozbrUAlal3biM%2FWMKsU4IkoWoMg6re4mGTTretSA017FvGa%2BpTqDg4pw7T6LP0CCRXsNL8ZWa2nk9TgVvAC8sUbtD7xvxFTWbrGmggQ0Rf7ZF4O%2F3VmpcMjdZ3XiGx3kuTTMCAofiPbUItFyE2b40T77QUPh3XiL%2F4bJxArZ0QCO%2FkoWXPDZlAoGfdNCaZIoIV4XfVC4b5iJlGL0ELx3ITVdwIRixq8H9ZT9keq6j4aFzfRhwSNKwPRKNVzqSVBhWA5R%2BxJYikLiJJKC3ykiQ3y9CYABjUKAHaRpC0313Z9h5G5w9O%2FIShiE6QBpphOLoFDZXkC1%2FSdeHy4A9kj7YOK%2BbuWQLs9Kjh5AF5V89Lb2KUIECPPiFRWMjZu8sp%2BWvoxyygA0wp4PN%2FF%2FkzR9vhteCSPIMMK7o9EGOqUBrbQQJj9JabjO2zKguUkR8JoK0M8VNV6YbuAPG%2Fnx9Ad10JBMASY3JZXnfK4v6GVHlul2dmgI3Sx5aBPTqYHl6s6hWe%2Fq6UossjubxaiW36Er%2FrHBuGhw6rKOxMfnK36CHBpmnWar1G2bFQ1AU2IvC3Ws%2BQNQoIeclHuACexgCZ3AUJ8PgphzApf1kAlJvXumyzZ3Ur9kjdQiE3NkjaK8Brdy1ikF&X-Amz-Signature=e1c0762537abffa1beaa0eefb8dabb0b4d08fd5dd8ae98083c91aa7f05e83c9f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46675XWGEUH%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQDrZrav%2B7TawvsgXW3Ky%2FyymplUUuZ9U87qqDFwpdyo8QIgXgKxN3UcEhsiiozbVwD8nxIUaM2OjIG9JhsSygiZetwqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGPVom3cTl1kelFjYircA4Cg2GDeNjqkJKsIbbulOTRtLOSgMQog6dADFJaygTunXlwuvF9CGD%2BNkafdE0izQXuoB46CdpTigtAZUgDQpu5Wefvv6NeHZO%2F7oD52A9z%2B5sbBwGcxFM4KXtst2FmrOJuqBPkve19q9g4g%2BKAte%2BY6yM8%2BB3nA3UCdc%2FrYdNHRJg%2BSTEaYxH9I9%2FaSy2%2B7nibvVHXnPU12Y3UfBfqTH4YvZlbYFe0%2FMgS76INzT02r68WcVwAeZAe11iSloPM7F%2BtLgOxlSR5gQ%2FKA7wFTJhuZ7t6sro0WebaciGWTkQHo9vRTvQr23uByIQ4POF6gevsiomGlNImf05QLOUuAC2lIL7a3VgWV0avFTWpeGcQnoQ7dfz4x1YcBURMTaJQodaihXOiHcVORa02sfkDuuSrIgWWLiINjZkmYxaTu5o5fR%2BF11r4aYX%2FabW6I2Sui95nR0CpiqgsDxuixmAhFPrtjyKxkdriJ3BeMjhjjVZ9RmCzE%2FBi6ftmrikpKNJ6YgPYqS1kqnkPux6dEMx6amO7ABgnlXOL4MfJVyqPQ%2FPrpIJWuP2L2ZbaHlDcWT2qNCjfNTaBtOc0nrCEjFDBuE41Q9dj3jyd4CgDW0xKn7wpc77w7Qk8aq6IrIvykMMO7o9EGOqUBipnNv0bDvjqTUCUn6JsUexggDDd5rmqaTlkGAKodMMT0EtTcq0cv4FyyhwZ%2F9gu0aVTDFSlZ4j2OBKd1sICB1wv5FSX4P7Z4JurYydNbmwyB%2B1ONfB6iPD2HhS4n%2FyTDEqSl8KytB7vqrT4zz%2BbpXyq08BDKMP%2Fealjem%2FXLj2XwYZ6mEXOzuMitHOWqlUmvrwZVq75pKUhXfPA5UAxO6rj9ah37&X-Amz-Signature=4b1d0219d3b1439f0edcd99160791dd7fb2089e22e11a1d2369594c18078fb6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4XT5JVD%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044623Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCVajRsXxttwwgWyjrsi%2BgtwZ2He96Bc%2BXB2%2BgLDXNDIAIhANRJj52Ly0N3hvPDRpVftqqUAfSwIedGa3pWOETS3bWwKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwLEx8p5HCYfuhYng0q3ANLPbi18YTBNFmZjQU93cQz%2BuvtNjn6b%2Fr83%2BC5AmAeDD14qI86zXvVzg76XJecoxGa2U7F28iKfj4aJiRn5sVZ3BJFOV0SsNQ%2Ff0Y0BUVghoFb7NzIqHMZQ18hvSgQPP7AXWgAhlaRqDd5swIuDdq08UWL%2FFXH4eFQHs89FD79IE9CzDENK3nggiQmdkI2xUiMhwaKgyK63se6ah26cHYPk5g%2FC8B6J%2FUjpRFmWWDnQya2ZlNADioeSGzKg9irPJzb%2BAGI3nLJ4ICgvuV9stlhPI0HEW6NsLYELKfVHEHnvqEgTa%2BJVSCNZUPqz5NalbeAFxDPHoEUMrQutHctp0ISb0k6byWXDYBMndw8nTZ2AON164GulGhdJhm6EVY6GlT9F05y0ZNKBga%2Fjkt4XPXbUipV84o69%2BdTSGds3FDejc4hAG267H7C79ejpYO4zKyWc4Q71ilaC805FtQKY1Zn8zwQ81n%2FgYVpADqfgItbQhYOIBz%2F2gKPk2FC2LHX7PtbmnZOzj%2FTLi9X3vTb5jIaqH0yJ8%2FSBEDDMs4p2biYdzTysfPuuwFkGAaPKrWskBAfVDLXCZ66BjEZkZk%2Bov94UzDNDp8NfajqtWEbrO1kFdPs58Ip%2BX%2F%2BZ8st6TDSuaPRBjqkAaOmLyrSq2RHOMROfCt0rFA5k%2BRMfiopUqp69CY05rfLFvY2vYSHgv6dAN12iVwMhBQ9oz77IbVITts16jRGpnnOpvqz2qzh2lut2T70C4X2Dqz8Y7WLFLefZQDphBaAfYt0qYFEyLYpPFdCPUG5iE4ZeWRosFCTwQLMiPV98G3jus6KbmkFy9OyqMuGm6IoOCb%2B8VHRwoYa%2BScBtQJYf8z3tGrQ&X-Amz-Signature=22562dd0bd3be441025db52c74abfc1c5d593a151fca9aa2f65b124ed6b874dc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466325VTBVQ%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQDtOcivBVqYcSW6swYPHuTT2unW5rLRDVldIei9%2BqOsWwIgIJ6%2FJNj%2FERLkahhumfjnV5gUJ0ObRAdl1u7h3axt%2FMYqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKAIazLttIzjuQSnjyrcA02eFl%2FC%2BD3ai2qKQ%2FgD0A%2BRemYXvazgXwhsWMWhm0oubxKnLYbx4wU5wwX0zB6%2F7Az58E0JvgEcnqiuIb95MB3b4G0dTo5R3GTCJ0gyOn8rms8TrKZFZIfgYs6o1n7riVLcwsUq8DiFUGLrVFv5xM70CoKwiZwpO8QCnoSqFC8WDmJ0RqZ1WRRC%2Fox9JqAZbXq1NsG94AngxbOzFSjd48ZxinlHYRoMYObVCa0MaN8rnGPrmgBj6eozx7M2RH9ychQ6D9dIb0GEYL0s1V8n3KjzYFp5vbIUALQUfDWCVNNXUJ1kwoyQer4VDfaG%2BqgNoftiIuzeIya7YpJKBW2XnSrfMJmcbNOUbANOmYpjlRvtpp%2B5vknR1sotWKai2Ut7RWbsJkDVu2N31NwbMRQdZZYBzpIr4l1LjCatu2VJKlTuW4W2XXr%2BHr7xLSbpFNeS6I7yYH3aEOkuuxDAn2UiWpCyFtRCoOK66FyH0V6QlEoYoroOb6oP124IuiQ%2B8P7wwO9ZtK%2BuUCk13gUclX2Md3C80C1HvOJWOUu%2F%2FSByQi7afexVBQTiIcUXlQNoznjUpP4RfMPV5ExMXf78aYeZcjpccHldgCbT7pzAczvW14G8itOWEZvATI%2F0VUKmMJC6o9EGOqUB4fO7w5c3KeFbbZwtauet46Yc6jxcOOs%2FDPoNHyTlNQ94IN7YbObV1MBDbl4WdYABNQizheR%2BHaDafuTng%2Fvw5TfZ5goGjU2TEWuRqZwpVNqEqC3XxnUislw1QDfSuyYbSLduMZFr9yugeMW9%2BRNqb6C%2BLK6KQSxhyQU36IUJp%2Fejz5rE%2B6U%2FOvFWxPBO7uVSSNa%2FNj2In9cZkR3qFnliREGVCDpI&X-Amz-Signature=9bd6c0bb12719d2460430e119d099fe5ddad8bc26a96019ef50c4b053d2d2ce5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V6KO5MAN%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQDdwY4fBeBDZhV4roUDkkjfC96VrWEd8lhzxbuxoxigwAIhAKzPEgIEEJxS0v8pDqFD7mJigWfcIlWjyEVVw0ppy1yCKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwaZdtmmDctjBn0F2Uq3ANajK%2FP0x88zt1u78GklHvEkEYbsa%2BtsYD0YGr%2FZ1I0IOmy9qlxlcauLvZ9Alr6rl9z8CzclVf5Pb5NQQ7CL51Pg7yaNstyHJW9gTbG1PWRFQUg1shwJyAGHaJvUuKTcURlLquKjzKZYPQe8ThJlFPX%2FKk2vc5lJ7Ei2BVGaT%2Bv6%2BXszsrEpeOx9oG%2BgpLbZSy9YKKUqPnLHA1B0YHP1eSRGOEVhEzE846nSCUcycMU6D4bmIIATHiUhN6pyHeTneRx9ts8stsVzcJ%2FaKmfYgJJkJXGayn7E3Nq3OW4rnP0h3iIw4M4uooUvZTOu17tt0594Ag08pvkEcEHpFCPOrmElmlZFl%2BgdvFlCFyus%2FIHBYsABejb0%2Fr%2BNLoCRPFFk%2BFKE3FngwvMSLn5sdVE%2Bc60mVMNboEXuNYzqKhBoux0AgTbveM%2BDdmbR4I0tb0wKFnWwHgXQtRq4b0sWQNsdYqe9DNqP%2BWaFAV2krOXS%2FCSB7X%2ByQ6ovUMosruKTE3SnZpC9FAnBl75EiIUTTqDeyVro5BaKyOKYiXrpgyesT0LQC4XfEcjCH8YixByR5DXWoUCIuF90qO8idlezYXXHRy%2F88IBR%2F%2F88g9t4gFV8Zo%2B%2BsrEOoyp6MABTNe0dzDIvKPRBjqkAXz7%2B%2BnSaB5RYbaJjQ9WWqo86OSJPV5JvsMxCDnziI%2Fnz87q92tsR0hHiqkZtQyMotT%2FD92p7xETNXv%2Fn8DHMrZr%2F7Bg1sWk95qG1pg5RRJ30SYM%2BZJvKb0cNpghkBSHCGqIsMIu77o%2FbLOrIj6D8fZeOEKPd%2F0864frC%2BeC04lVQCur%2FIdtCfGb7v9EyVu07hkglVhA%2FMZ4J0JV%2F%2FQKjunWuogC&X-Amz-Signature=77b67890f95ff7c3b191f5a61364fc8ed948b977072878a5923e9dd1270ee529&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XINHOOKV%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCIGfEEFl0QI%2FgG1F9XJ91%2FRd3J1OC7B7k4ncUvHSw7yVRAiAlpwMopsvJyHwKyx88IFx4EMlOH%2BGQi8%2FomKMLvS9q3CqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtPmoYWUXh8L3DX1WKtwDDDgzRI5Fc3tkDHvYYIb6I1ORm4yZEDX1Ev7F%2F%2BWgckX8mjHis2gU1p8L5BfCRE%2BOUWv22QGI664opTfMZkV%2FIZpvRwMeQB5kQ9pLc7%2FhiLTVnWW3vI%2Fj1lWn5NHFLNdQgjiIm%2B8mucGviIJLeDhV0W6%2B7eWeRlxpO%2BZMvm4kQ00MIAGOZo%2FUw%2FNVSwyCyQ5fYtI%2B0jADR%2BdDOxSwWwrhYG6VVoCRI7753w0%2FXTux3b7pT8B0HypOZSiMoqLwS2YooeG7k572MObNxUQwKqxGhr10SdQQrN1L75OxaNiWkFDGuxkSTFul72KYyH7UQkYZEd5xOtS533dmVd2NjuMqs3j1g56NLYMXFmGLHcrXChDCw0poJNUwmo2sMp8upbYsqNiKOYvFlFylzzgquNtskE1SmNfrIgTutBcpEe0UCHfRPbnRVS%2BAKqqwl%2FY%2FnvCz%2BGqiZQ4BgkXcBMM8x2us4CZ8MNNuGofAAnrk%2BxLcLRyWnWM8zgV9zPTLLfbB3P96%2BGdeNmrCyJmkU4IyTKFNX7zz1ZB8%2BzrfDYw5%2FqNhQLEh7%2FXk21Gv5xfwcX0RLrsKJqXTmZQhSd7EqxCztC7nM9Z35CX4eaxlJnTTI7mwIjw%2B%2FpPD57q9GYP43TcwjLyj0QY6pgFxBP0yD4xC%2BB%2FWnflUWDn029otjnqI4z7L%2BnYOwpmUPpg9OANzwxIJctgl%2BtJ1nVw8tRW3eQlI9BxB2Lo8ys26mHCnF2FrAXaVIoXnIZRGhwV3MkSgRZrmwWVrWOnQTD%2FPn%2FJWrFydYCtbMLwJzXZpUTTGV%2BKbR8axFoG8uAWBbQXipcw1H9L%2BonKBemjJOT7ExLVinJGcD9jB2bk7cZP57Rfgnf5m&X-Amz-Signature=aa03a8d4489821c51a5f99f2eff1b5148845aecdfd1afa7467d2c26286be735d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
