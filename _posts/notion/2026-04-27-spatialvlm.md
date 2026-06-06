---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YTZMCNSR%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbC7nIGdqGnBysh02yCK%2BKvN6w2i7D5tAHKWcUAxxXyAIgCkRYXbXMBaTdfFpKB0PDtgM%2B9v4EZXc1xWE7%2B%2FQKpswq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDJJYrQRUAtdqLpUj0yrcAwiUx0ntBL8PNjI8SNn9yrOmcE2r5DPDJxtNIrTC6TbDaL6812nwCx%2FIjq%2FjeNkUR5meHN87k9F2jtMu0rH9Fix5cLxvuCLMUN96NCHVf13jFEWbde7NdJ17cKduZzSQewI94EOmBouNO3Wj5%2FNByJs1Xte9aaO25urucxdVNx7fr2I9QXONhlC6FBIGgMmdnIDzMKSvCgocNnmiBxit9GCjKIPvZYFKwUhqxLX%2FjbxaEa0H6FzdrmeVE2sJQ%2B%2F2Tjdt1PlBdslG%2B2SeJiWd%2B7FYTI8%2B0Dauwx9URuqVG02TYXyDYt6BTyMiCGd6PK%2FJDcMSHIfRCwUsSdLLKixJ2w86S%2BOF%2Bb5i7z5F6imcdQGNghfioeSGw%2BffKcrjRhDAaHnusvWDtJBPhzizNCUXJtsBUwYJIOA5OIUkTwpWLNbTqeRqOICAOrYhMzPknMrrMvIvUSWkOD7s9KOAJtJVGuHGMyFgvM93ikFYSOq8aHjoj2ish2IUi7Y6W0o1l0%2BfJfIxDXmNHjZOn2YccRwtI0UO79mbeRrA2%2FUIxAfFyYj2FinI%2Fs7akf3JLFrm8Mk88OYAjxhmTxKLNDj4UAuGwfPmskyjpcvDBatSXxwSASW41lx17T98gCfmQj4EMMOkjtEGOqUBd0FzfWcvhGJgSPCtBcxQ4mpgIUe9Tu6p8zXjw9t%2Fzec7%2BtRxiljSA49949WxwyvTZFD1czYrHdMsSE0o%2BIkAPHqYL8QIdYWv1jzmZ4ZR6mkBVrjW2yar43QPNTuZiHVWLYNVKRqVebCXknv%2F2W16EWPpF0Vidt6ZMjH77M0h2M0xyy%2F%2FeZbgr%2B75ayWzysSLCJXEj6b4v%2BXRiBxHhv%2FjZIkDO8Gn&X-Amz-Signature=e9c3e114c57fa5ecbf9de27e3e80d66070f51a8e661bb982920df99f69a12e63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YTZMCNSR%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbC7nIGdqGnBysh02yCK%2BKvN6w2i7D5tAHKWcUAxxXyAIgCkRYXbXMBaTdfFpKB0PDtgM%2B9v4EZXc1xWE7%2B%2FQKpswq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDJJYrQRUAtdqLpUj0yrcAwiUx0ntBL8PNjI8SNn9yrOmcE2r5DPDJxtNIrTC6TbDaL6812nwCx%2FIjq%2FjeNkUR5meHN87k9F2jtMu0rH9Fix5cLxvuCLMUN96NCHVf13jFEWbde7NdJ17cKduZzSQewI94EOmBouNO3Wj5%2FNByJs1Xte9aaO25urucxdVNx7fr2I9QXONhlC6FBIGgMmdnIDzMKSvCgocNnmiBxit9GCjKIPvZYFKwUhqxLX%2FjbxaEa0H6FzdrmeVE2sJQ%2B%2F2Tjdt1PlBdslG%2B2SeJiWd%2B7FYTI8%2B0Dauwx9URuqVG02TYXyDYt6BTyMiCGd6PK%2FJDcMSHIfRCwUsSdLLKixJ2w86S%2BOF%2Bb5i7z5F6imcdQGNghfioeSGw%2BffKcrjRhDAaHnusvWDtJBPhzizNCUXJtsBUwYJIOA5OIUkTwpWLNbTqeRqOICAOrYhMzPknMrrMvIvUSWkOD7s9KOAJtJVGuHGMyFgvM93ikFYSOq8aHjoj2ish2IUi7Y6W0o1l0%2BfJfIxDXmNHjZOn2YccRwtI0UO79mbeRrA2%2FUIxAfFyYj2FinI%2Fs7akf3JLFrm8Mk88OYAjxhmTxKLNDj4UAuGwfPmskyjpcvDBatSXxwSASW41lx17T98gCfmQj4EMMOkjtEGOqUBd0FzfWcvhGJgSPCtBcxQ4mpgIUe9Tu6p8zXjw9t%2Fzec7%2BtRxiljSA49949WxwyvTZFD1czYrHdMsSE0o%2BIkAPHqYL8QIdYWv1jzmZ4ZR6mkBVrjW2yar43QPNTuZiHVWLYNVKRqVebCXknv%2F2W16EWPpF0Vidt6ZMjH77M0h2M0xyy%2F%2FeZbgr%2B75ayWzysSLCJXEj6b4v%2BXRiBxHhv%2FjZIkDO8Gn&X-Amz-Signature=d0536698a8a2bea7c6ab88dd16f8f01b2fc2bd7005db2dd6e6625a8a75be0359&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YTZMCNSR%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbC7nIGdqGnBysh02yCK%2BKvN6w2i7D5tAHKWcUAxxXyAIgCkRYXbXMBaTdfFpKB0PDtgM%2B9v4EZXc1xWE7%2B%2FQKpswq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDJJYrQRUAtdqLpUj0yrcAwiUx0ntBL8PNjI8SNn9yrOmcE2r5DPDJxtNIrTC6TbDaL6812nwCx%2FIjq%2FjeNkUR5meHN87k9F2jtMu0rH9Fix5cLxvuCLMUN96NCHVf13jFEWbde7NdJ17cKduZzSQewI94EOmBouNO3Wj5%2FNByJs1Xte9aaO25urucxdVNx7fr2I9QXONhlC6FBIGgMmdnIDzMKSvCgocNnmiBxit9GCjKIPvZYFKwUhqxLX%2FjbxaEa0H6FzdrmeVE2sJQ%2B%2F2Tjdt1PlBdslG%2B2SeJiWd%2B7FYTI8%2B0Dauwx9URuqVG02TYXyDYt6BTyMiCGd6PK%2FJDcMSHIfRCwUsSdLLKixJ2w86S%2BOF%2Bb5i7z5F6imcdQGNghfioeSGw%2BffKcrjRhDAaHnusvWDtJBPhzizNCUXJtsBUwYJIOA5OIUkTwpWLNbTqeRqOICAOrYhMzPknMrrMvIvUSWkOD7s9KOAJtJVGuHGMyFgvM93ikFYSOq8aHjoj2ish2IUi7Y6W0o1l0%2BfJfIxDXmNHjZOn2YccRwtI0UO79mbeRrA2%2FUIxAfFyYj2FinI%2Fs7akf3JLFrm8Mk88OYAjxhmTxKLNDj4UAuGwfPmskyjpcvDBatSXxwSASW41lx17T98gCfmQj4EMMOkjtEGOqUBd0FzfWcvhGJgSPCtBcxQ4mpgIUe9Tu6p8zXjw9t%2Fzec7%2BtRxiljSA49949WxwyvTZFD1czYrHdMsSE0o%2BIkAPHqYL8QIdYWv1jzmZ4ZR6mkBVrjW2yar43QPNTuZiHVWLYNVKRqVebCXknv%2F2W16EWPpF0Vidt6ZMjH77M0h2M0xyy%2F%2FeZbgr%2B75ayWzysSLCJXEj6b4v%2BXRiBxHhv%2FjZIkDO8Gn&X-Amz-Signature=ca92889d7b3ed4c1fd730c804149bcbe38bbc402301e12079859d42196eea95a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W6EQDNIC%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041930Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHdO2Rr4MqljVGKOUu8OVFK8ctYtuRQvGRliIA%2BxhI8TAiA6UmWeWWa%2BvUGhMlJGxsypRy15vfRwQODOQ0MlNSVULyr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMZH4G6iUEFCJqJmL3KtwD2Ki8bIOo%2BBR7kXB30gjF%2FHe2CepNH2b9bF7U9YZg9%2FhrYSRcfOKZ86nl46yZfTSDJgKB44DmqWqQ5c5cdWr7XE%2FXZXy3J8Niqo%2FPsozVpkt%2BJcSaAI5gO37bLFjd64Ok%2BB6vBUVC%2Fg62%2FNbLLPZBnAdUKw%2BihFg2b7om0YyHFq7AvUNZHW3UrNKSmSqUDUBAVqWm2O%2Fz2ahn7z6w36iuZA0CQXENp74V3CzF%2FXQQRC5kPnJPX6s%2BNL2SR23H2BOnrzQ0pzTL%2B2hg8iexN1KcvrR5haF32fnh1xatvbyXHWFJsoRXJFcrM9fg73yK0lG3VVr2O9NPHbsCVMXV2IZgQ8DXivdB7GQu3R7Vp8nizVB%2F%2BY1FLg5HtHNAr099kpaJsdwihla7Mp5xNTE3%2FXXWEIWJ6xK%2Fl%2B7qr0Z0uBJG9c9IYhphAKINfZPjyBnly3NHaUladmtomBXqCX2d61%2BmlNko0aM1wjhSKERBzxUGc0OC1x1XlLUzdikSqszWvZtxJhRxMpB0SUFN30D1G4FCkuD5SBnaayG4Phyl6%2BvLUsiG73xkFkYmvi4UOLVYOzEWlNQxq9aqZYNEq6ThW27jUlMBkiqdy9QFsVEonYMI36T5eZ3uGg4ip%2Fm96CQwo6OO0QY6pgFpXS7FpCtmjTGyCYYnEsH1s1yRb1TsdMcTyw2SikG9U8LYWKVrJB9CcbU2GQ5tL5OvaIz6IEI6z9nNTWN5IERq8MirDQEvQyU98dPPapNF7yQ771dvtzTsGKdfg2Ac8289oMaHu3wGQVLzoEfspGXKJATEJdslFIOjhAg7k94qYAFntZp0BYMj2RtlaaxGPsX6UAB%2FiYee5FhRgIvDAMaT1VRFWx%2FQ&X-Amz-Signature=fb813173d60a1952396f87a4184bff5b3b714f29205a38eba13b3421ce64184c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662QOJBZE4%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4eSyWfXeSqrqE1oNXW1rnTaAng%2F0jlHSGTxSkeeLH3gIhAIDCYBmVtRM3ZS9Jy0Tuu%2BSG3z5yCTrESs8h%2FJflsR4GKv8DCHwQABoMNjM3NDIzMTgzODA1IgzLEZjBa7VsbrT%2Bsooq3AMQxK7nukM3xrt2YlUHHOTOsmDaHiLOH1XL6oxwOCC31o0bg1M9v%2BRjvL1LvKwWC2u0qEzGzNUAwKboJU3PYKY6Eqqjn83FwfB8gbPFaL6YoguUYN5kdCRDdTXujBI5qmSfzq4VoHzelbMVLV28VsvWT5BvPK5wbQx7cdgHt2x%2Bne3fUQGyHPbrsy7Es0czG8OTirleUwgzk8Ii8gVluMOIWkzuJ714rbltbbFQ6Jxfe744c5%2FM%2BFFO1HfeVrGPm%2BrzT9wUmXwP8mVoSi1Mz14bB0VF62aNNrDM%2BtEgwg1dBNxrVs1KxzpBZEioR5TBC2KCFwkYmXv2LcWsBKogYgmeS2OAOuKHRMJ80bu%2BLY6pHpr7lwdcNa%2FLbGmesk0noUyBtPG%2Fq4vgqYbJWFKH5laUP2iE7xCOgePGJkkD5kV%2FpeOk6Ec9voiT6Yye4%2FQkZx5o21Yc%2BT3%2FPl9%2FJhh%2FPX8lFdyuyS51v0zM2Vafxe%2BYaNoCembyQkuyP9ed4r0USneDGeLDdBsvfu0EkgyZn5Fs3brR89r556WbUIr9plbMm4tCbqJRE89bdtaRciim%2BgGaXZuK7J%2FMrTwUzsqeu8Z%2FoF862MpsSqrDtaWJyoY2A6K8c%2BheFgQyr44r6jC4pY7RBjqkASjo%2FITgptfdCEvCX6PHiU7RIRRhuso54XPBTzDVrU%2FEDtH6VF4fBgMoT23%2FakuM%2BstTViISK8GldkTmpdejDJ6HYckIBvOqYc3CTBgYQO1%2BvIU%2FPPgVGOZRk2BHnMyRiNZHFtY%2BjPOSf%2BDomsY5tECqvnjd2WZSlPV7jWcBgXVvwOVVFPrsatDI%2BLcM2F8RdF7YLYkNMiOHifV%2FiT1IbTKpP4t0&X-Amz-Signature=7c44acb0a6afea7a4b5aa8de29f6d08bd67563b56f32a1c0be0e1e1eb49af677&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666EZJJAYM%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041934Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBHfspHvJeWshA4DVawbu5QKG%2FDSOHDo4jf9123O%2BJx3AiARXMm4bwTARjbrAT%2F6jRuLpMVdrxwbowDkbKTcoSf5sCr%2FAwh9EAAaDDYzNzQyMzE4MzgwNSIMJ2dv3%2BuJ79cCRSAEKtwDM2wBXcqdX5Vr%2FEYXzzNQYbkKguEG3E1qtv6%2FxHe032U4aw%2BTlZql0JDfCgn2Gv4PH0aVuJ%2B2py2DraJ%2BM1E57K1egn1icZMlLDArIlntRKHGGiOo7ExDx9jdZMa995i%2Bluop2il0%2BpVZrqgqA8OT%2F%2B5%2Fq5zaXX4ODnJUSFLbiEI63vJ7uxU48PVVrsr2dgrCWASkzaDKIaHxp%2BJW3d9E87btveg1jSaSsfQXwJ3A2KTK947jFkFjYh2CD3IsPsc%2FVBBieO3prqgXT3TMqZxdAVqAMO6w3ovn%2BV%2FJa699h%2BgsSMFvXQDDYrJMqs7IYE1aAExRd7u8tSPeZsc4nSABndLBkVZWZ9DqChapfYD8R8vgryGo4dRgJrs4tazyBPDl2J5Z%2FCD0vQYFNXrWCEgEQYx94gXxv46cHKmBMpLkcUpYpmF1mcsX3vPi%2FhE4odvO86iXqtpdJPDQ4HCaCtKMG1odGDJHXxvxBPTKDQfOggyIgB4%2BpOovPGiCk06soLlEiBFBJcs%2FbAZDs%2FXMXzOuAS1Srv68PGE5C65rv311TU3hdsh8TkxfDf12jSfKi%2BU01DiFlzkBQebgil2c2TDgW61VI5GVXpFbQhHdSCvqnNCvePwgkURusjtPTfAw0qWO0QY6pgHkbmmSPmQ4ce39ZAbBjIRJybjyQJExZdY2j1iEprH0j2tjHGiQbLzdtVbWFpoP%2B481cOaTRwTx%2F0Xx388bZkVlid%2Fpx4VbZqpbg5PtHBX%2Bkjzu4QRYItrTWT9%2B2VdTJE2qcmiaZ7YQ9J98KZ4GhP1lMMJg%2BBc%2BH5PhoT4du%2BsDXZGefXS%2BX%2F5ol%2BvXcYh83EbLskZYoVSF81S6WE77kNT6joPokFMe&X-Amz-Signature=068d79f1dd5b2421c9b009fea0ed9b2fe5dbdf31558c60d58a92a15eabba6c09&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZNXRKB23%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041934Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCrGMDN95PguB9LhAlRqLQnW94qAjWFg7dMtah9BpTHBgIgHvXoYpBAgPrkMcxtISMqQriZJJDBvWM%2B6ZtdzU%2B69Dcq%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDAJN77SDCpeUlqh%2BhyrcAz02KSo9wtNzhlWwH%2BcEhaI%2Fn0BBZPU%2Fh%2BcPztHXMhnmDbV2CvPSF8aycY3AyW8tgI0SaKn6PsgDe3PSO1B76S%2Bcxg%2BWE%2BxwfZOzDnbfklKAk4lZtX1qRe5w9WScsAV%2BWEds0hrx0RQAEawlNcH17g6qulRcwyp1PtFH58phjzUJ5%2BEsdZ37qve78usJBWeoVRnmmI52%2F78v02dedsx16y1oohPecYpAiOBaGSUxKPyTCLiwClxLvS8qGA%2BKCohO1yUUu4hpojCMldv1EIn%2BywDpfT2lMfhKaUcBQDe%2BKP8c5o2IgRXT%2BTvmfNXBetXaLoh3t3hNGUGQsUq28tQ3n%2Fl4ut5ud3XRuu4dlAJGHEvNn2fQIySaKWMMGBiPKABiRxTPU1Jd7BRupmv568F%2FIcrpTpGZkSE96yurQR0xdSv1XxyVn1DMlKNQn4Q0BW0q1v3QJ3TdRSqHo%2BAZGddnahvSPV8f2nLJ0CjpDRWaRzj02sMEsEyNDfS7qIQfLaM%2FV5L6%2BLtl9X9NVD6H1bPUYhfdrJxN%2BMiVhBkGevbqGRCb2z8BuARDCTyw2RYcFIIvwamm1QOVcpjFTO5sIUsoB59%2F0dep0U5i%2F3xFu3BE4zBreDq%2B%2BgLCrJQPBgm1MPqljtEGOqUBOVEjuNK9VccfwdMpbX1NjtLvx5eah6a%2FEh1kxwAlNtVzbt%2BtBzpNMEEPKnxvpYyjTR0lO6SpanSP4c8WV%2F0f3MJ%2FeVKYoW1ArE%2BUP1AWO9DiWQLj%2FtL3UdzF%2Bv4jS6in6hvPSm0577IfuV%2B3iT8U2ZNurN6Mmo4ZOOsufhIYcSfWwoJF6OHoh2Irc5Rtd7xOqK3H%2FtHNEFEBLyMrOABU2GJd%2BdJa&X-Amz-Signature=5293adfdd63854056b8b209f6ac6fbc74a61d2217370a6f73c87b596e8b8d497&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RFFCC3UF%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041934Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC0aAYb0KAWNlBiyq2UPDcBZRrm2Ov%2FZadmnXOxd6vQaAiAdnxCe0aBOKsWlTrIb3JUsTuM5rmJVQc59uPdzuQ7p3yr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMaZ7Y6kF1uDSvp%2FzMKtwDHAcV7jY3vSWmvXDtfPuysoq75Z0Wzi7G%2BDqvwCcOVJzC4EICmJ4Ni5%2FObKzt%2FjP7yy3jer6YES1Jvcs3TJri7wsmdUaYLt6bIvAagtwaqEf2F0gwG8FosaBN1X4%2BaBQrzvjPhKDJhjd7kOg6Fif5o%2FysD4CXsw%2B%2BjP9P6ziLwY7cXfH8OY9j830jrv6tPghjDErzLJv5%2BQhGAO0dH6ObfNXhra9DtA8sZVhFHHLSSW0lwc5M%2BAtlnOJ0l0YhSCkYuVXQ1OZr2rdDsycj%2BjpeqWIBh4kLw5%2B9zABpv5AGc881x3MqXsdLzuqwYajzpW6xmaKveeu4QZPTQMK8gwoRrbNV7PhUiY2p9Vi5PEDM4aSiTO0Et%2Bxl%2BmjdROy%2BOK1TdeLAmNihbhjVcltZ4UsE4HP7hM442Yur89bhvOsCOuglTWv4NHCWFsKYRLCALs%2FofX5J2ZoulSdWdUeAs%2FJnD7JChSzZ4j86NUzgc7TUMfSHpcNAwHN%2FMFxW3EApnqbGA6JdiC14cxwkrDEFQA4bDxBWa5cLqWueU4lYIeuKH%2FNNboInQqiGkuScD98jt9fgdRob5Aug57kzHLr7Jm%2F%2FfK8cPtQrqFADDnqoK4duTzFlncucWGUYTK43FDIw%2BqWO0QY6pgHygnJxUbR0tk9fHBaciGhnygKh3ZY0mftiPLvOoKHvOiBjCotFsHJCJmTpgrDt8hJkMVFVQy3FVTfKwJEpGmQ%2FVUkyM8dwkGwPB6WFeUqEbQJIJyvW8m%2FENIoxTki00oCAW%2B9TJ8I0k47I0Bx6uFf3ovcAu3OqHvckHg22pqqrvNVFnMUMTwi5P4KS86ejSQgcGxBhsHsdSQbmXINpK4Xbhp0HJiU5&X-Amz-Signature=bae0dac39be690b7f4440f23e9b1f77c42a7155a5ccbbc6114ab388634a8cebf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ROMWUK7R%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041935Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC5zoee%2F7RED6g%2Be6T3qX%2BAyPLH0hKBFTPR7ZwUbyIrKwIhAOQq7JLiP3kXFA%2BWpHOw1irYheOL9UWFinVgMI4CiVnlKv8DCHwQABoMNjM3NDIzMTgzODA1IgzCNtJhLj9NwUVSvjkq3AOGS%2BqmEAi0fvGVmielCtJDjgUHSaIlyhDHS3gUhu96s%2FjIhKRCCvWQdj31T%2FM%2BWutxTgvA%2FrAdf3wo2xJsdEBtbftxyXY13mCk3ZaACqW12pvTBb6f5Npqf3hBKI6AZ%2FcC4xduSLch3X8raweuW%2FAtIKZAIR9zG1n1iiLpPg%2FUgQRgvdZ1HQq3YvgWWbFZlbCRpwLV%2BGDrX3UemZ0mj0Mlki1uOj8TglvYxw%2F%2FGJWjVR1fnbI2O4o%2Fg%2BK5vG7o0FG9qc4mC%2BGBwCa2NDYcIm9LK0F5iDOjU4zP0oNIueFxTQBSGsEE1odiE%2F2ptsi9s9DIhHs4gA%2BGWJbv18TNuukrCxzXF3shRiFGRTn8R3WgxWsps46sh6K%2BHubNFdRaomFvdY9kyAmtTZ%2FDwZYd3gRQlK6jVO7tPiK%2BZOR3kbDkQDd%2FaS63ddCQ1dPwM63A2ZH%2FO0DOvzW%2FDFxvFYKGA4Q4efMP5gQm38h79kQ%2B4WY8gwJ%2FzvVbrrILNN5uUIQel71mymJI80hTeCAuAVdMn0lsCly9%2BI0wxVV8hREuQQ%2BkxYge7FCIVCUkgxdLHZSLnNOU5yHuXi7%2B7BuvYFFEPGZIwcLaH%2BJtuLkVY4MD7O6Dnc6%2BqPdLRIKPashtrzDrpI7RBjqkAUlN86Aa0RNOWQW0JQMelMnZU8%2BflSdoqfPyAr1LhutfdI2DamzMb9RsDeDJ6sNK771Kg5QOuGQl2vh9s71qEXGmPpIe4zn%2BOEyLfV64yxiYk2gLxRMupEM3MnxUmYT3UjZOqHTI4CgRteSy7fLL0mKVQnh6EKWnR2VUD8i649d8si9snXKsZl3K0PxEEK%2BSh%2BfRc7G8uCL8%2F0yvNK3PidzjqJWa&X-Amz-Signature=232ab191ce5bc93dc8ea3f4ba986564c7b48b01ea498b0deb03007ff4972327b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WU42SZH5%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041936Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBpCgq1XU6kHJZxc9cbfzcLxfMJvgOP0KgYw4R5ycW%2FvAiEAtkNrj%2B%2FU%2F1CKJnp4MbGik4ABxlIUAJK3D8jedw%2FstK8q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDNgVCShz887tn4u5OircAwlrQ86NWvjwsqSiuPpjcgmL43phQHj533qLLb3nAwc%2BWb6XPeeS9Fy%2FFWCXTNqmtdFJAKG6THDEOZGOyFQqsadPBzl4NF%2BcdfghTKffs2MKaag7xgi2m7o8tFC8Dk2tBtEBinqzJt9HZL9hClRw71R6w3xGmJzbxx%2FdtIgvQus4sEeny081uU%2FT0xLKa28RDZlZxPwJzD84OrPe6WEiq5dG78VQlJs4X0awWssfYsi4mzL%2FrSmdJExFqSNGgI6FHn5GKRnGvTw75OkCU244PohHeUOwG6LJ1RjDKdCjQbQ2LPOW%2BKZDXLXRhhKTvvzXBh0xN%2FIBNvp%2FV%2BaIIY0kYPRdz5c34BLj3OukKvE36bb2GYxjmDbVfCS%2FHWH7hwqpsz3bIyeODC7H4U5WAewszHd6c8pSQtoyzdMaMkkksA1Z4PxIm2l8luDsnMYoyQiUXYc8GE7%2FKV3%2BqbkMH1xfyhTHY1b2oY21ub1OQl1h2nA2lNG0j4MIv0CNRoS00%2FEILQAQdV6McX1D50JpLYCxeO50uv4Kr%2Fmq2hfpa7NW5XnT9NlgGQfMTi8%2Fnj8MUkkKlpasVnET2M2qxGBaf4AORQm%2Fee0AV1PPRNA16mxusTeph6xu%2BlZXYykAQJr2MO6jjtEGOqUBy1fDSi110NzEmmgwbRfS7AZGEFFBjn8YNbms0FkuYYlk1z2lEPCW%2FrQz5rf18r1gZPtFZkB%2BR8Q1eadnjRvKbmN1OcaCzHazQhaS8f%2BfkMZcio%2B1hCXfvsD%2FQqgW%2BERWxTVTQewlhQz8qhWKFmtttLqB5CCazdU7TmrRwKtDdulizXcjTWCNZ%2BppAcXVkLC6eQHCtp8g3LAGVAlff6ssVgsW6JgI&X-Amz-Signature=bddd4baedbcbb8ac26fe97f3d34fe07b0e06624dba33b3ca378f13d826e610a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
