---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWLH22UA%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXxWX2lKNyI0fNrzjx%2FyZ04PZYY%2BR%2FPym3NLOcHT6qwAiEA0UZSKfDuM5G7XZQ7cQesWPqeewOgG9qZ7Y5OJGYGzSMqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNJlv3BJ%2BZvNl30azyrcA%2BqrcLT6y60gfaYB3VKN2teKIe5uVPhyzrdjvLSLJfOBF4CKrYLnkGEvWgVnSWm6UfZqzN%2B2dMu1ZkADS40pPkfH7FLdsF%2FHCijhUqrrsgd41pVbnT6%2F90TEmdPDTt3RTCc5MO973fhPzeSWlt9OKzgXBgjKPU7TqmeMyStJ6wy%2F1xBDV7j8Ecu7hoAtj5P5IfAy%2FNRGz8t8xNHjAJ%2FGV%2FhNy4hqNBmHWeZLanCy8wPC%2BKmTE8RNrhp9LSqDoFmGegsdeE52hvuKPDE6N6uqMeqsNPGdfLu0P5lvpCZ3QhDqk88S%2BswcWVo%2BNc6KuXfsXIryNA1LDQjiqUdfvhUPPOzTLdicrCn7vfAU07lUEawPE%2BQzi7GwOkKKvS9tmCTkooKcNz8Wm%2FkKQ1kNhli5Kr3kIjnDr9je%2B8mTStLis%2BcQpnUW60Bd3mWcM6mwfXdnIBJD5i1OpZWTRalyIy3r2jyuxqsr%2BXX3rpOHUKdF6HRc3r%2BmzXx6u%2FxjSfrLIigPuzxpaRUafETP%2B1kwshpsU7ledjqJTpjEfiZzolm9Z%2FqUW9Z4HorkvlZKni4cuS7zI83dlsExAB5fJtU1gG91SOjG6I2yHHQlw3Greezo7eab4%2BK0EOOS0h7fHgZCMLGGqtAGOqUBR%2Fzcbr1NNo3TCMADHE9ghviXEUtlHubXZfBbaws9EIwSSu5S1Bf6xLzLdecUFZ7x8SQ9TVp5GLz%2BPCBRsmWXz6xNO3K4fg%2BOt1PYHbVed4R1shGX6vxRDmDj3W%2FAhOJ%2FAOLamU%2FZK%2Bdll0jcCsIUVoLzDt4V7D7cz9vT%2Bdm7mg%2FY64Zn7L5XJ0%2F4i7y2dSMQja4dsmYrnjYit7iZ%2BJzsAXIdnHZy&X-Amz-Signature=e0ce3d6904e6e65b99b6f6d41d8ed6e9c60916fec5284d865723506c7c3fdef3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWLH22UA%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXxWX2lKNyI0fNrzjx%2FyZ04PZYY%2BR%2FPym3NLOcHT6qwAiEA0UZSKfDuM5G7XZQ7cQesWPqeewOgG9qZ7Y5OJGYGzSMqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNJlv3BJ%2BZvNl30azyrcA%2BqrcLT6y60gfaYB3VKN2teKIe5uVPhyzrdjvLSLJfOBF4CKrYLnkGEvWgVnSWm6UfZqzN%2B2dMu1ZkADS40pPkfH7FLdsF%2FHCijhUqrrsgd41pVbnT6%2F90TEmdPDTt3RTCc5MO973fhPzeSWlt9OKzgXBgjKPU7TqmeMyStJ6wy%2F1xBDV7j8Ecu7hoAtj5P5IfAy%2FNRGz8t8xNHjAJ%2FGV%2FhNy4hqNBmHWeZLanCy8wPC%2BKmTE8RNrhp9LSqDoFmGegsdeE52hvuKPDE6N6uqMeqsNPGdfLu0P5lvpCZ3QhDqk88S%2BswcWVo%2BNc6KuXfsXIryNA1LDQjiqUdfvhUPPOzTLdicrCn7vfAU07lUEawPE%2BQzi7GwOkKKvS9tmCTkooKcNz8Wm%2FkKQ1kNhli5Kr3kIjnDr9je%2B8mTStLis%2BcQpnUW60Bd3mWcM6mwfXdnIBJD5i1OpZWTRalyIy3r2jyuxqsr%2BXX3rpOHUKdF6HRc3r%2BmzXx6u%2FxjSfrLIigPuzxpaRUafETP%2B1kwshpsU7ledjqJTpjEfiZzolm9Z%2FqUW9Z4HorkvlZKni4cuS7zI83dlsExAB5fJtU1gG91SOjG6I2yHHQlw3Greezo7eab4%2BK0EOOS0h7fHgZCMLGGqtAGOqUBR%2Fzcbr1NNo3TCMADHE9ghviXEUtlHubXZfBbaws9EIwSSu5S1Bf6xLzLdecUFZ7x8SQ9TVp5GLz%2BPCBRsmWXz6xNO3K4fg%2BOt1PYHbVed4R1shGX6vxRDmDj3W%2FAhOJ%2FAOLamU%2FZK%2Bdll0jcCsIUVoLzDt4V7D7cz9vT%2Bdm7mg%2FY64Zn7L5XJ0%2F4i7y2dSMQja4dsmYrnjYit7iZ%2BJzsAXIdnHZy&X-Amz-Signature=d7fd595064b3b18551c48e57a06a345b87bc26fbc91b30efcbab2681cd98025b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWLH22UA%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXxWX2lKNyI0fNrzjx%2FyZ04PZYY%2BR%2FPym3NLOcHT6qwAiEA0UZSKfDuM5G7XZQ7cQesWPqeewOgG9qZ7Y5OJGYGzSMqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNJlv3BJ%2BZvNl30azyrcA%2BqrcLT6y60gfaYB3VKN2teKIe5uVPhyzrdjvLSLJfOBF4CKrYLnkGEvWgVnSWm6UfZqzN%2B2dMu1ZkADS40pPkfH7FLdsF%2FHCijhUqrrsgd41pVbnT6%2F90TEmdPDTt3RTCc5MO973fhPzeSWlt9OKzgXBgjKPU7TqmeMyStJ6wy%2F1xBDV7j8Ecu7hoAtj5P5IfAy%2FNRGz8t8xNHjAJ%2FGV%2FhNy4hqNBmHWeZLanCy8wPC%2BKmTE8RNrhp9LSqDoFmGegsdeE52hvuKPDE6N6uqMeqsNPGdfLu0P5lvpCZ3QhDqk88S%2BswcWVo%2BNc6KuXfsXIryNA1LDQjiqUdfvhUPPOzTLdicrCn7vfAU07lUEawPE%2BQzi7GwOkKKvS9tmCTkooKcNz8Wm%2FkKQ1kNhli5Kr3kIjnDr9je%2B8mTStLis%2BcQpnUW60Bd3mWcM6mwfXdnIBJD5i1OpZWTRalyIy3r2jyuxqsr%2BXX3rpOHUKdF6HRc3r%2BmzXx6u%2FxjSfrLIigPuzxpaRUafETP%2B1kwshpsU7ledjqJTpjEfiZzolm9Z%2FqUW9Z4HorkvlZKni4cuS7zI83dlsExAB5fJtU1gG91SOjG6I2yHHQlw3Greezo7eab4%2BK0EOOS0h7fHgZCMLGGqtAGOqUBR%2Fzcbr1NNo3TCMADHE9ghviXEUtlHubXZfBbaws9EIwSSu5S1Bf6xLzLdecUFZ7x8SQ9TVp5GLz%2BPCBRsmWXz6xNO3K4fg%2BOt1PYHbVed4R1shGX6vxRDmDj3W%2FAhOJ%2FAOLamU%2FZK%2Bdll0jcCsIUVoLzDt4V7D7cz9vT%2Bdm7mg%2FY64Zn7L5XJ0%2F4i7y2dSMQja4dsmYrnjYit7iZ%2BJzsAXIdnHZy&X-Amz-Signature=d42af5f02695037d343f74d180a6f00389d82475745bc45c7d389e38845c89ea&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WUZNACEP%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCfIpiOnySmMvjr6h8FMrYS61sdnCQxrLXCODKppgFxiAIgOqmI7GPomYxBE307mpNGQ%2F3rcEHe9lW0vivFpnRqiboqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOzRBlqOjkvRb8oeSyrcA%2BMbzxPgACVB8SfDsjpAOtyenn09H99CgZQynAloy8cjcIQfujkQodCObpVV1arRXXApYatOktVNb0pM4iwY5EUr%2FxsVd0OuAQpNiCftThe%2Bf7s48UHmklbk44sq0b7Np7WSAX8e4HTWiIRc%2F29LiuQ55ASY2qz8bjioxU4Z5I0YJBC5FfDnLcbcdoQjet4CoMur07xZ3cvrQFczFwuxNav%2FkA1Z8bxR5Iq0kyno5%2B0UgvCiZURjNWs8lneZZfFV2W11PIy8JlSptbrZE06k5J6nXrxHwhQPY49BDNqsz3mWFE0mxnoBls%2BEZ3%2FE9DXo%2F%2FsEPTKFe6klq8Z%2BdKxRzuCr5G4vpC9q3kRDVAGoRuFKzFavuU1uv%2BXs0i9RZ68bFnmgTEmjEBSf5FflWu4qihgGx0b8hdE5fLqskUprXK0FkTRqRbP43o3Q12W4fFhmCSo9Vha%2BjvzwxlizPOfAjFSlMGCxsp33Xh7fDNTlZmNIBvNfUIZ7LPGGx0s9xiy4ddgreb1GeWCm4hjqnMQMPCdoReUgZ3WCXyKv6hkigN9%2BD%2BYB5JnyrZUCZ0R%2FzloZlqwD3IUTf3X%2BinaLiHgtMCQTezGrPvJiD1DJKU9uIApT4Ws3olWQ%2FM9%2F92EyMKmHqtAGOqUBC9l4F0KZOfICTDQBt8U65PdjiH5NWEPQX9XEJzFnVHi8btVnyg9BBInFq33pmPR%2BQicpqkIY%2Bkn3Wc3nH7uQ98XL2XrCJhRjxGmnuN2ZhDf976fDQwa%2F%2F6FZDktiJiBOastQiTsdYBTs8ODnS5KcNzilyVrGT0DN6pw1tPrMe3EtBUwLyeJxctJC9%2Bq8zdTDCuTdSaDzUZzRIyGJmDsmHQY8EhnK&X-Amz-Signature=961b26909983f3c80141c374965778851472e9ac4d2646026c3c228a7455f17d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V7JWN7RH%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044153Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDO2CnKsLyMdzB%2BsVWURyR9r8SRGwD8hqPW1cOslFB21AiBMQlfOD65VF%2BzTyfZe2XIyjIcOkjqpiuri1P6k%2BIWWbyqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMEwyytI5OuD4g4UxEKtwDwdcrDSHCvAbVUcYQAzKrt1KAQGqSINUAJNeusYoVoe%2BhnhMgtz5LYTA52nl2W5%2B7wZFa10INAe2WcYdZnH9NCro%2FN6onQnN732rQ%2BLY%2Fpn8a7USy%2Fuwm7x90chHRY%2BRDXMm07OyY7Q73yi8UR9wWMTbzY3BqDWrtfiDJieHPBlxQQxZiXx36pCKholfg8Da59P6lanG6rdAsrxzpdN8DxLZ66EIwx2Fcw3Y%2BPzMp5GqiPzIShCp%2B9Fc3A6php9Ah18V6kTKR6KIJ2Q%2FlI%2F%2B8m6jQ%2Fd%2BsrqiDwOZ2XEq8LOxIswuezzvtjCjNoYT73O077Pm7YBCE2eswy4TxgZy6jMQKpnQ3JbI3QrvExZ%2Feu2FwIPCmEg5STwgec0TQLlVguvHvFbKU2IOg0ThTM%2BQIE%2FXE9S8MolgzjflgJUnEr3KwoiHPqObW3s7a%2BlODyOueimsQcn%2BHw%2FQD5d3LZhiLBsOTq%2BBCuTtc0UfdrR1xuBs3A%2BobzBhVRLzPVoabePNlcDEm2uDk3DbH72mR10bUfwoC8BA7Ty7VkYQwit%2BPHMs1rfL0zfvM5q2C2bQZRZ37lxtIlyL7M1PUfF4P1y5%2FDconjHMnfey7gCeL4GogVCjWZ07FDzul3TZQXDEw14aq0AY6pgEs3LTvyX9NdZ1%2FXn2SZ8BFAG9R7ITUM3eP2eDdeXGX%2FOa9UPic2ka6Nd2R5x1jPnCbE4vy308iXFfCK5FV8tYoTFK8HGg5RVBTwmp6XhUn0VroJ1ZY%2By18Z%2F7ejvkhzIpro7oAOungQnj7dWAV08DCX6FYq8155edM5J4Rjt18neQJXIC%2B4WJgrHmV2HqUUGkAogxMOXOidxEXbhX%2FH0RjtHSIP7gQ&X-Amz-Signature=9cb6369608ae8523f6019558425dd8abd85b5bc1a2916119820369f07e97846f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y5XXEWPS%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044156Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID%2Bt3W0%2B42gRHjVZKnPuDHWrjUI6L0Uhg%2BnAsFmVl5sCAiBpJCp5LsSXE2UHUzyx38d4yDNpMzR8WQJqaAUeLQzLJCqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMBqDiXkuFomGvKpeJKtwDrnS0VxlLpjn5%2FK1gKmS%2Bs7r82PqCnAzjYKZ6igGUjKr08UVrnleCb0LNaNlerRiW2whVdf0vrGu1sI8w6vlUpt33LNEwwCZ78c2luriftU%2FoVsUpZC1jSdfOW9FCpjcoAsBmqvl%2B62%2FC5Z3Vv%2FulwzHKB13z9OsrifWbbHFKeXzJEMQ8YL2u8zsqU4hccUo%2FmiLaOD2KqVAIc3GNLQuLFt4k%2FGimZEMT0bg6WaYZQAvO2rGW7Zm4CLxlEUBX4cOHqoKGKZ9ZETMDT3s2SJrFG6vVsolqo4GCscgu7FIwqnp0vt2rKBc%2F67OCA2mLU3M1X1V0ElDqT1FQOaJz995%2BMyWyxj6plVQRTLXpItcYGNeOrwRAh9dJwQyaCpvk3dfCCNyInk7Cwwd8n08q0gKVdt9dsI4v4qQMJNa9FZaVj8R%2FSrthCs4QUq86n2bKSsSs%2FcZfOslD6tXkVYBzZxG%2BCEzN%2Bs4p3X97ofLlybQr%2Beqpry%2FXPVxuTo58jb4pT%2FLtmR%2BfDgbl1nJhqylv3Cf%2BZ2oFyNIh%2FSyAC26oqA4GxOzsCH2RcX6HKf8VonmtNTNUUpknWf39XY02kOmXQEw%2B0CjPdmqLTJzJJVfstSlvtjigsew5SwY%2BcdO6KSEwi4Sq0AY6pgGqJaNqHJF41jQw3hG1sNn4O1Azk801wZByOEkbWHVwqT70E7PpZYCpk5OU6I9bfh9Nst4MkjmqK%2FTwIK9vmPzVeTjOney%2FHAAHyXph9sQMr92FhXd0%2FppyOaqJO6olw2c6kc5QFs3XQLhbdXsP8WKtH1AIoX%2Fp1ASKB%2B0QUuhgKBynOzTcImYFyJjc7LiFivEEvnlcRy2ZIgO1EvdTwHBi9tWhJJk0&X-Amz-Signature=34392cca28d42f0a3eddb7a95f0bf82ad56196f5c25744f53bbd73a57a8c8f88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T5VHH655%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044156Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICase2dLDPIhOhUJ7xy9oZjV8PVYe0kBfbPBoh5jDpQpAiAafyx%2FCW%2BkgxI911K3%2BPbqLNNfDhsPUTXHOCgOpAsBgiqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMUAzMUdH8bfskXHo0KtwDRZRHEPdy6ctYBnfRbAL%2BepmP9wxeaMpfs85Sk%2BPM1k6AIcgmzWbD849%2FtvEDjaSS0dTWunbXpV8pQpo%2BEpNHdhbg0qNqhxwsx8EChyGoztuOf84KzTHY1RAuYIa2e7bFS0W4NQ2I7yFf%2FqhDu58b5nqpzlX6AGcfPwAZ3NttiLsPDGG4NB4OEpB59kOczsl3KNl%2B5SZHwsA05Z%2BtWvJ6WFU2YcoRGgrXjjAGrcMoLphrW4tmo6XsfTDzctfFkjut6GnXoo0kKCDa%2Bu4Bj3q5H%2F0Ft631yucilEOEipXeXzIUwLYWmWU9%2BQSXlw6c6tDb%2FLQiHqHozRvGrdSPtVcEjZgJttjh11jg3sM5gv%2FsZ3wtoGQM6wl3%2BHm3AJc9PRdLh3OaQeCKQaxUteWJl%2FFra7OtiQdG5PwzC52sjspLKjaq9HLMPOc7kuHAJnwND0y1madclcGISH%2Bv8nT1mtMe%2BWid5sTZPXPjSC7Ai8iPQKa1NJ5mlpa%2BV7mAjNyESRoPZ%2BkMBJW1eNWLRR5CuNZVS6cxq77R5uBKrt%2Bzv3d%2FsX3nbX4UqltaiaHY8YHOQ8dW92PBbnGOoo5iDNdE6E55B9vEjVFqK%2FVLEf3SrcRDTR29C3Hjdn0mVlx2xLgwiIeq0AY6pgHOnags9mQVL5jTuvV6nYnhIBnw%2FOnsmXFFMuhvtT1C9SRd1M2CjMekdnNwuWjFDHs4Q1jEJxiqPy08xEDEKtEpHO1O5N2kW%2BeUWYXlCKBKTNopxzLTkfEb6D%2BbTS8N9OyP5dgfJ%2BLpBuj6RWcM0BhSeZEveVdBd5WVytXzkTaF12ETaaQqEvmkNXUH3Uem99eldT%2FrXtN%2BR1hc55VGvWA9BLSzhuZ7&X-Amz-Signature=2e53bc472860ed1a3b89215c0fc129984ef4e60274c3c6d104b112fc057001ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466THDOJF2V%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDdqzoZKun%2BSj0xbGLAVmcFUNK7P580NIJxL4048lOFVQIhAOdaDLLImr%2FMDPEQ8xKfa5KV6P8zTb8mqlRsRVnwgVmXKogECLT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyM%2F7qpPztRKUGMJYwq3APmBlYOcRWyeu1m8xe5bte4zeugL8FCSVLTeAW3AjSnAY3QpZ1%2BCqFY4Q70XqP4adU3G6QjwVRA3cc6SEZ0uMUnrXovQBJFdyRwlryw8uRDkvuEQcWjgPH6uURujP%2BEKGG6xmmVVlPBk%2FnpEyrhapFVRUtaMUD33ZBbv0ih3VPWq%2F%2B3Btd06gVXRrDg6U%2B%2FgcwTAwQf8JOwetaWnedqAeVWpRsOs%2BGBcy9K%2Bg3IyFdWUQC1phLTIQYin9VFtPYjJF6YhtouA8H5FgGhs%2FUDkxB6qObrBXGxXmCU5O2edmZTvm9n9gnveMaTi44ArJzdwCOaESOOVK2HLs8Re3PUT%2FjhyBWFu%2FVGH%2B6VEzOCwbsAG83PqTMOd4iXKmH6WqynVZrq2BiUxDhCUQ01EztuxkYyywaGaw47w9HIUmVzVqsyRdugTQw1c5qmBL0TXsxG%2Bi8yAIg8wGMDN0w5QCeNvvNo4lJcRxWpc4OYflOVAbRctR4PN6o22EHaLgl9OlhTG%2BgjyG5xlBh30f1PjaWJm8d3Nts%2BlqmCPu5BjridpPHSq6IzrXmvIrkQak%2BwpZ%2FwtpzvUI5mmhSAcuatQB5vYihTeAVXcDXYDJLE9hWyiLbGeaDoRgeRB1r0k7lH%2BDDfh6rQBjqkAZlJQ9c9EyT4T2KspQrDAX0m9jHlLeQpF%2BQ1LcYGdj64LyO2tez%2BHU15dTsJh64jxo%2FIJL2Jmy44pVXZo6JzNKtiY56A4%2B4QFntkE7kWKHG8qUiajl9pBT7US2srVQGQAnYROTg9nqPoM3sUd2ZPHC3sxl7QKuq8ypJuKZKyPb1fRPSmkbzkWQkEUNwpqAU0KomJ5zejRHlwTidXAlu9unvkElYL&X-Amz-Signature=fa5755646f1e1411eb0ec4673bbc80a00caf11910d2ebb0d7baaa295a96bbb3a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FGXCWWY%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCcor17X7NDruRs9Z23frNJ4ejT2JlDRYpDbkYOpWwJaAIhAJ9%2B%2FBjoNJzaSDBnsMD8PuVgwic9mjisI%2Fy9BjR38rOTKogECLT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igyo6R0mEHPTD5AtG6gq3AOw4Q905IeCpi8Dx1bpo7HDnV9CnLLWiE1LdjOMpIfP7IS9GfzdzG2Os%2FH0hcCq4jxkhErwGpMhwTGy0D7%2FasCCxguOyL98pHN2f%2BawPakjEWfbEmcMX8AVDMbGFqjDF4a3rHKmQ3tr0p056ypZm45ZmOZjjBYlxhU6ZeBzkL42NpuTA3bD0zouepape1%2F8ZLo1XQHSztUL8v3UenWkbS67VUB4ZsbeGza8RKMkXZznp1nbO3p5qJ3q8fNxyE28cD%2FPlWuRlIyJtiMqq5xKXgpqNzcIsw72DH5ZCknEYCvo0InCmszajx%2FdQ80ELUBDfUgTeyoUyv%2FRbaJU9MvJ3dagah6GQ%2BDVoKFmBhQUdEDcgkQnL%2BCFayTzblEiV2qs%2FLxlZah2R2n36T4AOWl2uSmHYqWUpCatH5DV0UD0pJWcgfGP9fDJ492ZcojThQIrjcmnX26DaEO8YvDcmrnso2Afhv20Ut3UrvMk0klUEvyWGt89cHcaVVy4l8ozGFTwVG85jrLzTS7cG%2FdGFX4Rrc7nM7fY2ZrJjv%2BBkKNXyUFBXarHlLy665ZpCaHTYeZrsvAqri58fMr711x8xQWoo2d1UxkkQhEFaZb5a%2FJaavfamlqsLucyI0nF1ed%2FEzCeh6rQBjqkAVvMBnRiBjvHKea%2Bbl9%2F%2FUeaOUPCrZ5yjycPVrkZzcghhi1%2F4nN6YyB756tSXj8H4ApAg5YJ3OclHlk4v8juoA3GyQ6NNmasUy8%2Bekw%2F%2FE3KaExmuKiasrhKvJ1NMLGn%2Bo%2BKUFBT1lBBNHymyZ9WXh6EPqBudUYh%2FgJu5bYcWjcrG2AdcjWMjSo5VYrHXq0t6pUDAdkW3mZiHMzuWhIccPtz%2Flk3&X-Amz-Signature=dc03749351f391b78da17a444a87274e04b990dc4bb87311af7d69b948443301&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664LCMUXQK%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044157Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICVHUmw4DU1IJUmCvpg8SBVY0wenapFwwSKktNw4gCcvAiEAt0%2BtIYT8xn0W1kEtjsZRXK4ECsUhdBW7iNvVjPt2%2FLIqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJTGE4PI6pmKberrYCrcAxpmLeoT2256yVXgbo5d69Oq%2FWduaIaM0co7HVVre%2BXNeab3oco8U3XUOQXeoo8BqgVdoSPICetE7LqP5Rs7HtT%2BHhCr2JINCdpfByzlenagCYIvgbfZGOlsdSIv1uaqAQ6r4WJlOMU4DkLgkUfg3%2BqDWUZMhH18iHTPxhxgRAJMbdCxzVTYjTB5UkNtJ%2B94UM9JXwHWqioekdMesDi5yshQsT3e7sTZ7F7gzFdVmqLaRm5rROoH3LNgqvwwH3aY0oMAzpVmWXg667xHrLxoo2imZoT16EmNikMvNgvTNjgOIJMNwDOXUKYRKrYszA7lNric%2BH0zxPxxOuk4GzFViIHHaTwPVGDFAZGYQzN3IFsI5RffekpF7%2BKnq3jCDFbkPKsWO0smQZKnCr9AqgvkY3cKg62mxslWnH17sxdablETK8N3WLmhwBfpTDppdMgfiuiAcK2m%2F9hvOuLR99FZKXFfgMJRuupmaSHvZ2gUxVD7wiyl5SlsXbC45yzHt2E705HL5iEToEH%2BZ0rnbw%2BYv5VGMirXWSIJsA%2FgrTOtKeEnvuyXeGQiXRNp8v04a8Q4QZ6rqhVr%2Fo5kjEt1trpdOYGSocBC2dlrSHO1xRVEoU2fIsgs1yWGMnxefeauMKmHqtAGOqUBowrpZs383FLx0wIsf8fjmL3CHbX%2BMjYsAo3XiZPu19C32esOHhQXZZ5nBTMC4iDma0BYMxWCARd29zZ38RcMjs9XUt1GtyF4Yj5wsldce3Zowxzuf%2BjAtWCQtAVNYYAL8LvXsbaYZvF%2F6IVOZ7vY4yoT9hbkb0x2%2BadtuGphkRxNT85Yqz3DOBgI%2B3YEXZ7pgI%2F%2BWbTEATTy%2B7P9XW17jZY9QqyD&X-Amz-Signature=70696a50deaf47b822d1274cefed0af950240628a88d66006e72003d24853670&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
