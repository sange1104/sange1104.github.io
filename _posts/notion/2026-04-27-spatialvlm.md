---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPK5D7EM%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCHMKSx9i6DadbGVMOw%2BiSNeqg5sBsAABUWhFmPaTmE4QIgTy%2BRofZNir6ILIHIDmVWENboaI%2FsglPV6y8sV4XQntoq%2FwMIURAAGgw2Mzc0MjMxODM4MDUiDKhuf0RPy8NDhYlE%2BSrcAy%2FDpTosSsEa%2FeznFZc7%2BHLBrvMuMW%2BPIvUvw3v8tziRR5QOBVn8PSte3w2NByAXaa4%2BSRP0ktsdw9%2BqBpAOZUYbU8welJf6mKmkDRIe2bIKX5h3B5Xm0%2BX7fDlBn6vicoLEfeOLH1vQGLbF51fLMJsRCkF9J8VBr3%2B2rMDPv6oahaGT44SEayZpxb83Y%2FN4nvT2tU9ihhPm39EZZIaHjFqMBi9d4pJa6DMOVABvGcMsKQcLHhWmWPm6WpbzHMUmuBe7wAxgsVsuyrDFgx99L5Rw2mokB1SXYN5iCqTgw%2FySaepNtnxQloM7WaLZqz3CNdgmJ%2FGby4T5PEt7%2FvFb2D3gait%2BD4Zhbj8QoQ95cYwURH21rLLlojlrQ1RNX6GoThfpn03TX%2FBG5wZVqBtCScFlg%2BtRCgHWIML69pbAecuHY2ZVenvlwaYRzR2MFFt7z%2Fi3oFzMrHYxLL41xtv%2FSXWKP74mUs9HCYKrqHYSOQ3E62g2eNWiRGSPlhpCv9eL3YeZQkHQ1OvTV%2F8x3rYdfiiPjdmunuAbQxwMjmK8AmHLMLRXhHj2BwEeD%2BOO6XPMVYZXFSFpqHaxNX0aefECiYFlAdKJf2JtoF7%2BpV0gpJ73KBF4pdsaZPQC3RNjMIKnlNAGOqUBh9kvhkYSmBzR2Q6%2B8Pcwho%2FliJU0%2FdkDeFQE6UruqJ%2B7ALTtLIcl1wH%2BPXhcOkIRWI%2FZ7D95w7QKytoQuBcCG%2B35HxGWw6cJJVSnhHJ4CtuEkRjPhY9K0BeK3UaQOMPgnS%2FE7Mankr4Igmbi2a%2B2c62BraY9gocLbdQvmhFM7%2B9AHbeuRq5Im7xmdhs08JasA8nqX25Mbl57RlEm4l4cf3KdIYvO&X-Amz-Signature=94f9aa60d7be2844b503e75b7017f6f230aac88bf420a3ec9e7eeb5ba5f24350&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPK5D7EM%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCHMKSx9i6DadbGVMOw%2BiSNeqg5sBsAABUWhFmPaTmE4QIgTy%2BRofZNir6ILIHIDmVWENboaI%2FsglPV6y8sV4XQntoq%2FwMIURAAGgw2Mzc0MjMxODM4MDUiDKhuf0RPy8NDhYlE%2BSrcAy%2FDpTosSsEa%2FeznFZc7%2BHLBrvMuMW%2BPIvUvw3v8tziRR5QOBVn8PSte3w2NByAXaa4%2BSRP0ktsdw9%2BqBpAOZUYbU8welJf6mKmkDRIe2bIKX5h3B5Xm0%2BX7fDlBn6vicoLEfeOLH1vQGLbF51fLMJsRCkF9J8VBr3%2B2rMDPv6oahaGT44SEayZpxb83Y%2FN4nvT2tU9ihhPm39EZZIaHjFqMBi9d4pJa6DMOVABvGcMsKQcLHhWmWPm6WpbzHMUmuBe7wAxgsVsuyrDFgx99L5Rw2mokB1SXYN5iCqTgw%2FySaepNtnxQloM7WaLZqz3CNdgmJ%2FGby4T5PEt7%2FvFb2D3gait%2BD4Zhbj8QoQ95cYwURH21rLLlojlrQ1RNX6GoThfpn03TX%2FBG5wZVqBtCScFlg%2BtRCgHWIML69pbAecuHY2ZVenvlwaYRzR2MFFt7z%2Fi3oFzMrHYxLL41xtv%2FSXWKP74mUs9HCYKrqHYSOQ3E62g2eNWiRGSPlhpCv9eL3YeZQkHQ1OvTV%2F8x3rYdfiiPjdmunuAbQxwMjmK8AmHLMLRXhHj2BwEeD%2BOO6XPMVYZXFSFpqHaxNX0aefECiYFlAdKJf2JtoF7%2BpV0gpJ73KBF4pdsaZPQC3RNjMIKnlNAGOqUBh9kvhkYSmBzR2Q6%2B8Pcwho%2FliJU0%2FdkDeFQE6UruqJ%2B7ALTtLIcl1wH%2BPXhcOkIRWI%2FZ7D95w7QKytoQuBcCG%2B35HxGWw6cJJVSnhHJ4CtuEkRjPhY9K0BeK3UaQOMPgnS%2FE7Mankr4Igmbi2a%2B2c62BraY9gocLbdQvmhFM7%2B9AHbeuRq5Im7xmdhs08JasA8nqX25Mbl57RlEm4l4cf3KdIYvO&X-Amz-Signature=03579b531e719707fdfb37f6884d6d030c450cda2a435ce112c9b198962704c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPK5D7EM%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041154Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCHMKSx9i6DadbGVMOw%2BiSNeqg5sBsAABUWhFmPaTmE4QIgTy%2BRofZNir6ILIHIDmVWENboaI%2FsglPV6y8sV4XQntoq%2FwMIURAAGgw2Mzc0MjMxODM4MDUiDKhuf0RPy8NDhYlE%2BSrcAy%2FDpTosSsEa%2FeznFZc7%2BHLBrvMuMW%2BPIvUvw3v8tziRR5QOBVn8PSte3w2NByAXaa4%2BSRP0ktsdw9%2BqBpAOZUYbU8welJf6mKmkDRIe2bIKX5h3B5Xm0%2BX7fDlBn6vicoLEfeOLH1vQGLbF51fLMJsRCkF9J8VBr3%2B2rMDPv6oahaGT44SEayZpxb83Y%2FN4nvT2tU9ihhPm39EZZIaHjFqMBi9d4pJa6DMOVABvGcMsKQcLHhWmWPm6WpbzHMUmuBe7wAxgsVsuyrDFgx99L5Rw2mokB1SXYN5iCqTgw%2FySaepNtnxQloM7WaLZqz3CNdgmJ%2FGby4T5PEt7%2FvFb2D3gait%2BD4Zhbj8QoQ95cYwURH21rLLlojlrQ1RNX6GoThfpn03TX%2FBG5wZVqBtCScFlg%2BtRCgHWIML69pbAecuHY2ZVenvlwaYRzR2MFFt7z%2Fi3oFzMrHYxLL41xtv%2FSXWKP74mUs9HCYKrqHYSOQ3E62g2eNWiRGSPlhpCv9eL3YeZQkHQ1OvTV%2F8x3rYdfiiPjdmunuAbQxwMjmK8AmHLMLRXhHj2BwEeD%2BOO6XPMVYZXFSFpqHaxNX0aefECiYFlAdKJf2JtoF7%2BpV0gpJ73KBF4pdsaZPQC3RNjMIKnlNAGOqUBh9kvhkYSmBzR2Q6%2B8Pcwho%2FliJU0%2FdkDeFQE6UruqJ%2B7ALTtLIcl1wH%2BPXhcOkIRWI%2FZ7D95w7QKytoQuBcCG%2B35HxGWw6cJJVSnhHJ4CtuEkRjPhY9K0BeK3UaQOMPgnS%2FE7Mankr4Igmbi2a%2B2c62BraY9gocLbdQvmhFM7%2B9AHbeuRq5Im7xmdhs08JasA8nqX25Mbl57RlEm4l4cf3KdIYvO&X-Amz-Signature=79ea9be019476b2f54cbcee968f8d7593a952b984c4d5bcee03d1d6f90d7f1d1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46665BKCAJS%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041204Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBjOG7tTB8357s6ETI%2BCcP446I%2BB3N4wCC0I%2FrszrXxmAiBFCdG8V%2F9GEprmsCyjezc47JlOHFOd%2F1RBjHyw2KLZPSr%2FAwhUEAAaDDYzNzQyMzE4MzgwNSIMc71l6qYHcuxP9aCXKtwDYkg2Wic7grBNDpDULcEFNn3h8pNWr%2BM%2FmTh3JnXgxYgWwl8cb8XN41vkJGwEqgx6tvCSVWnn2UbSgUTfcALmBFZGs0O7UKNNd3zd%2B1mhWGP0HNA9BIuJcymtCdjU%2FuLlpKQuLDPfaFMjIq8BK7S1aKWgpp0qTioXLC1TtT0O6Ev6FxgvjPf%2B%2FXyFRDsMBffnQS%2FMp38sQLhwW5p%2FohiwCDIdo2n%2F7zTRnkQar3VwTEJE4byFYRKxp3GnYf%2FEuKJ%2Bw4bi6QajJpgEj9wlmWTW8W1rHcF38zxgHh6r34PRaR2LAtZWInyiTAObrKBWd22SQ2JwMj0dNajlrPdus6xH%2FKGvAR25jjhQMi7EzLltD2kaCzLl4cYiYNiyp7K8Cl2AUEjB5PkLFk%2FgaodSCmby%2Fiuc%2BZJ0%2FZNDx%2FX%2BfBV5e09QrHU9Hwa1RvxE11jo4dgbTSSifQfLt44CSz6N3ntjFGI%2FKYAC5jAWc3bSVlRHNs2vi4kcB5W8%2FvmOG3ghceUwgiJppbrn1mXCSusMIjvJ2F0648W1ur9ETxBp9cq9NL8FUnYI6Q1POW8VqaK0WGGCkuYgC4XMCwMizoPKTLFA0ENG25VYLK8azSSeYHFG%2F1O3WJE0q7S4qovvic8wx%2FeU0AY6pgF3OGHihArh1d2cTy48PUjHzDNwrNHSpkMLkGRVfzIHMEd2GsYPMm%2BjlAdrF21n7SteLga4MHwNordcqu2gF9jvw2hwakyvW%2BkaFGUDP7YvcXQELBIlh8AGHwBTkE0UNpPzN50lWIokSxw36E%2Fka0GTcWIqQxSXC3OuyVClTguyKiZm%2BKwXU0vdO4V58u9X8uF6qgfyI5BKy%2BK8jZgYWcaClNix22Em&X-Amz-Signature=88e39abe61939facb0346428a2bc450c21a14aac28d29b085078f442df66a477&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V33GCBQG%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041205Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBKUXkVAQGPsoSe5fdhVR3uZK5Qa95dN18y%2FIYUxPz9VAiEA03dsq%2Br2D6wjyRCSaRqFSYv0tHPmFq%2BCJQg6Zemw574q%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDDkc15fWYE7GN5cKmircA42u6rdsJA0iuKk1QwQTZYFqigIvwDhPUPOFdxBXCikpWFdjrjqFRhlcTQ8aYjAt3k2HF2fok9%2FbBz7rEeQhgGLt%2BOImXIfL3EMKkRtqPlcxSPqZ8aLzaKKhhkL5E0bL6CCrjNJ4H2GO5gTVytSuX8EIDTasN8%2BAaKkwaWQ8ASmT0SNlus3bFv%2BzlWH%2FVGT8BFTsROt9%2Fe37b3a%2FtF8p%2BPRKckHZ2fJ0Gv86Eam3%2BL6J%2BqQAa4EytDFeybxb2FmeQdieZtz3MGMzQ8z0%2BbEqd9yvfy1pCXHChc72GuOUvCqmzGnDsRzbi5tawYg87MwfWen970PaU01JZFbXm%2FOERg0pYKh2odXrblRN5Uua%2FcBMr1qndCCxsQ3tBzbUqSoktqXJHHs9FPSvu%2BQOouGA6BCoburvSQUDWjqNcIZ6ETSUHx9BvzlrglKt8tOQ8pNeYeze3aHhEkMUY%2F33cG26r2zDT9LqH%2FZ3d0s6vSGK8RjTZv0il%2BilwoRoiDMAdfVlAnIj32bLJxNzahp61oXGZDTWISgKq1tUcChg9l%2BGjuIYYWAPConv7dGSBpkqo%2BsKBpuMdVyMoU9kIT229VyTkTC5daZICmGbg5A1GFKv1%2FJ7787lJ%2F%2B%2BGP1xldi4MPCxlNAGOqUBNpV%2FQxPtON8GoVD6F97I%2BiGpvhFEVpVgDzCEDUrlhPk7HePqEmeawZ9IVV6VHBMuinxmUtKVurDtw8DVI78nP8yUszz9rhlodXTubHDQrxWpy4yqGV7rojj0l18lLd3dMsYHJvUqcIzAEJkaq1w0Ie%2B3CKCtuUr2zNVFDlzwn%2B6te6oeAqHTk2cRVs03L9gZ9EbJHIkXgZbSpLbsCwBxb79dF9dN&X-Amz-Signature=a52645ee66cc54e3e471582f4ead65502e5105abbc23cf6e03ca0e2bc4e079e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662FLZHRP2%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041208Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGBgG4QkswAijF76insjwqWszFphuaQ6q83aBh2MXAC3AiEAl0iIyjnU%2FKqYu76anx7YtYL6oZenP0VeDITYZRpvc0Uq%2FwMIVRAAGgw2Mzc0MjMxODM4MDUiDA0ac2RKzYPv2OuLCSrcAxeQBQmc2FrZATJfifeF6LZO6xL%2FfWi7xWKJ6MrbSvukSDM9lwe86Li1BoVGZsrdnjNghYD0LiJPjD47OGyRx%2BvE%2Fu1O5E1FyOnjH0102IZ3TrZuNjW39yLcgfDkPpjQBM6TXAemwp3BN7M23LR0Zoju5AILMPpSRU%2FOofrpGyE2Do4%2BJOZwsfC4PfV3vt8SfR7ilzLbRNuQA32DsxV0wcXXzsgQu1qXmVPsOA%2F9B4UgAD91g%2FKtH%2FHXgvzy44R4ErO4jVp3QUQBLnBVFlK7dkelAm4q4U%2FHr94yVMZPPeXqXTyXTS7iUvnD4LDh1yLh23FoAse7pv%2FC%2F3zdspO2awmNu92AadqOVSYTrD8JaeKQbax0XgmgJxuXr0KtT1E0pJuBYRhgox3oc4coOstHu6Aj6%2BpyI4lcjcFvMv0BeHL%2FhOLeTdONkz4Zbi20wQUIP0PQPDGaYq2eyN5lTuZ9%2FBTFT2%2ByXQ%2BO1mcUnx2Dyj%2BtTgZVfHUhB4ia%2BGBgZJDEc0Jfzg2FdSSqIknMgG6nWSNOFYTafTW7rBldBvYB0uMWvpEQHpqvRif7oNXF2kEUlxVzRrfnmtakOqhuD60%2FCuW%2FWgwdLArxYfUcF12INCPtF6SEw4JZbHuev6ADMKqSldAGOqUBAg3q9%2F5PUDiMsOBE0uLNWTti03GpxClltjsolvbGef%2F7U5GF2D0wm%2B3hfdm%2BDv6ZgkuZzfE3ehPAQgNh1F9SnSdcq9I7x%2Bn6ULYHxDOx7fpvAM56ruhpndn7xEMPWtOsPnZYQPM6YmhSMHFEjGNA8EB2BwMXLj90k92P3qqgF7QiGUXIINivgoskfQkq6MpPZZPjlgzW1e%2B27NLodU6Fm9lbAHp5&X-Amz-Signature=681a692b6e21072808ad47ad32ce98d0447b661048f481d147cc137051c27bfb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YSD5L3BP%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDl7sCE3ZXtHCQBacFuQtZ34R2%2Bm%2FPdL0ymLucv4VWiewIgXFi%2BlRInQaaWOuw01xEpvFA6%2FFmYW7FYLXSOF3v4OpQq%2FwMIUBAAGgw2Mzc0MjMxODM4MDUiDGTdtnDN0jsXG%2BoiGircAyvLFNsCbRu7H3VPFZd89V9Mw7wUacxgZ7Xdxs80KTEx7suEfRBAs2xFrLbTfh%2BlnWhJm2wkpK1CT3gsBsr2fzHT4A5nn19T7oWK6BlBOezFbXNbZRWlrNLPjNsDz0osu5Gt9yvYCMlQjzDraiFK8GfAE28EhAGWIfD4NoTSDfztWyGEsZJkbPFWr2HWZTGo2XYjYwLaLzHJvlZtq4RmBhm%2FDE68GJ2qed105Y8hNE27uAXpqnlccHCtA2QaVrtazI%2BUwTUeKp1IdGAJmZlNTv5xWnWnT1Oj6%2F0BoCT7DmeLOgdozFohVERkK%2BxXPKJmNUh5nHofctnB%2FJ%2FehgO1WZ2DmpXFy7KsRC4jf54EP0tYkIivhQ8g%2FykEExjVgT%2B90risygiVFuIpQdylbG2gAC%2BVlcy8SQLH5ezebpmUKh7siovOcA1uoBQGa05Is8aMf0yEPcmUs9HKmhyYAtoSA87b1xaKjALl6PMEyL79rgg2z38Kix6MEyuPTJeKK5eitpT1Cd2iWonkoROCcBTCu7qlALjWb4gaGy1zXJGAke5Zsvx4Ugp2v5hGxg2IqZln47WYVGxfrYeAGBkiimnCk%2Fbp%2BEKGaP70zfRNGjLUrOWTJuzfbA4QwPGgFmphMKz7k9AGOqUB%2BrRKS3OP%2BXwyKaPD9OKiRotfzSl4rBmjgu1VPVTRE%2BSMXrqErPfmUHwcWFR3m0D5dhda9BbpAjk1hktdgQ14UFGlPetI%2FMIQEbT1R2B8AjvTZFiiye6IKJmIi56jHCfchEKyURYhqsme0HPgBoTBhC2Iunh%2FB8ngQpU50dfy1Xyw64MIritR3bAxSRawXWr09C3wL2unZlp012sHOBH8mUl9E711&X-Amz-Signature=92906338bee3b4fb29cdc81d8abcfa32511bc677d7d4433b7d1200d716961c5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TJX6AEUS%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIE4UoUlVfT%2B3vHINFuICERXLMTOUUDfh6%2FvWruHyiN7HAiA2tMcHvNvPXGVyxPd7%2FH8VTOklZN%2FQNyED6lero89ZXir%2FAwhVEAAaDDYzNzQyMzE4MzgwNSIMfmvd6U4v0S3oRS9YKtwD2Oxq9OAKa1ypN7ZLi8DfLX5O9ipVMUwZuMRyHrnRWnj40TiO%2FEW2tbOygurPsM%2BtF%2B7FI2OR%2BEIcAGhGTEnDlzssK4WU%2Fph9VciEjX7uRBSBOS2712fkUzFTRzjYV8ZzZEVcOJ9rjjn6e7mA9dtJ09AGvhokUjMUm5aQjLqyykrA1DgrVJjHgrf3jFhbEySp4nSdeBeF6PmcROG3d2rue8kLwlj9O4A4ZBTIdXX7LGXki3yFphy5NbKubEcYepNxAuTHnAZhAKSde0%2Fp8qV0idcU%2B8K4fq0hhyJY7QKE%2B9uokqffJXDdbAr9AEMPwW2DYXTaAgjhXzwDhkIvVou8Ih1YcOYfn9jvtLZlEzqJLZ3v0oKADZl3X86OBrdO1Rmz9afhOR%2BZWm8j53kFSNm%2FM3N5%2FFimmjs1qXHF2BUBrmmidxiLTWsbUkB5WFJiJeWaO2eaxNTxUNWxpB3qhhlUTWSF%2BVl8TPElVdsV7aem74E34%2Fk%2F51W7uqRx4PFuwYkfnVCH%2B%2FFN43eETDR2b%2BLTi%2BJRHfF146ZhGoiaGuqzvMJMCzn8qVhFdXctB985kb%2FFby1NKg%2FvkSTFAaZay9HBv2DJwmVIIiegP%2FtFviB%2B5ytzKBKJP6uGfn%2F%2FtNgwjJKV0AY6pgG%2BToBqg2geepGIa%2Bk5CiA%2BseIh%2B1TWjDx1faL0%2BYmQFNxNt4h%2B1Chg0nbfCbaebL7Eu69TWs43mcZLQgXYyGD%2FudI3MZomH%2BohcCiZ4Jyaz8oyuMkC2shsbxtoh4ZNSqfyCyxMqq1QsH%2FSknVhpmfLV9YpXpHBhdhh5T2DvHTPRsHNiNCtUZtSWy9K1%2FV%2BaQuh6UTbKfpkjrmXXQJmp4ELikm6VLkB&X-Amz-Signature=d3564966dcd5e3a80ed395518f94ccf5b7f3ae244961c3b7a4d90cc83359dca7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XYBS25NM%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFoEPosGzqUCOJ9PE6sxLrqnsIeIsLdKrRxoO1nLEd%2FMAiEA5YbYz3M6UwFHP4ob9CBB2lTZiOmMqsP3QG0fC5Gngckq%2FwMIUhAAGgw2Mzc0MjMxODM4MDUiDO6MBo48LFDvoiVyXircA1BUxJUviifnyksKiV09BAdPiAsbjLEFOerQv0DOAYPvJCD7iRSf%2B8L4EdBeSWMae6OTtWIYTTJVMTj0YRGXsYTvcVmNLj6OxLrm13asUekI6TmZuC%2FXVVsNUqQH4bRQwz9yrZD%2FdEKK1sm%2BP%2FJ6WXyQ6CHV34kW3dAIgLRAty3IM5gNZfW6BCsrKnFLz9k9eAdntLEJONyNfDSKulr2nvEyknzUzrGJrXLi3IZd78zYYE5lUcU6yxAszc6HD98Ee5UYTb3i4MDGyEijjgmYt79D%2F%2BkczdJL3mVMbMMZRDfcliDnC3%2BNiN8jZ3D2slfeq7Juz%2FCk8%2FD1ydix4A9SkULMrwlH%2F%2FBPzcGC%2F1exUT6jIbSiFOOkbeQfRbg0EulIuP0BCAiQl%2Fx%2Bkw886Eqf90v74JwDmCyuS4Pht0opfT89hzVtUBmSznIbC60A10nUbSxYxfwU6GBj1qp7bn%2BNXm6W%2Fhr8hYhAaWmvjaw3ztU4Z41dgprDVqpNdrJZ5BVTQA1PLFWV7O9Tk3WfqQEA9axJE%2F1pJlqvmhHmuW%2BuMhKvw6P6eN8hKFXkvjgQxyColGvUrekjTt9E6lpucIscqHaPCR5KYaHwHckoDWH0F6o5BAOuqhWRJOzvA9TfMPrDlNAGOqUBV876c6T1KTZhvaj7cPm0zHaz7sImRUJuJSwShgsR6a3klxDwAlKykYnKOgFrXQyui%2Fm3cWA8hGhDPvPfXvpEoYlzumKauPvYqR6Ig8JpfUAJQp9vxX2evl2hj3ln%2BjkYNEPyU%2F3RLzmoDIVB5pFoqI1pTPdgHvjGgBcGWlNuuG3PHcLeZ%2FVK15NpYFzLZ3XDDVua49m1aEYcvIt9gNMoOiIbBFF%2F&X-Amz-Signature=b5b360106cfc7a5ab88b1aa078cfb0332baebafe1ff2b8dbd87de2b0b0c56eb1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RFF62EWW%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDYK4hJ6Maz0Y5jSZ%2Bo%2B3sbgTXNoLXj0b0tp299QEs%2BHgIhANPqD5SQMh4XOGZEEnXxINdxwPDpuMYsPO5BSbZmA5spKv8DCFQQABoMNjM3NDIzMTgzODA1Igxjclrc%2FemdIlgWI0wq3AM98XlXHQ%2BBOefKHljHxoS48tantWzraYBjDWBEOc%2BYHCrxAh4pygGBFSTEQmjaWPrJy4RptGDCPwbQIxU5K2QfRkzqb7fVPu8qS6%2Fk8d0CzxA01vJuVoZ5Qf91BSPhgwtZOl9euBRYRTEJpy8i%2BXVA%2BPi0QVy0WkzAMVj9EAHs5SuZLjyjhP38vlWOROtOqNsxXzvvvqISmaxdH%2F9JKFg9c7aOz2j%2B8hcekJaLtmaZ%2FmsWrDQoU3FdqJUywzKjH484bDhv%2FcL%2Bhz14AUa5EQ6ILs3VcYUpmqjkodFDiII84YPCPqOKRwzSioNaWo0ug2ZMxED0xd%2BFIFXoMx2jOEMpj37DQAwPTGaN9LKty4e6BRY9G%2BPrFCpc9BRSSojrnwG%2FWxnu9K2joULAH4tlsKSZ1TtyRdwAqcDU5ae7QDA%2Box4h%2BOx4lgQQRjfjydSLxyY6cDWOtw2vPSqvvc%2FMS1xR2%2BfdsA5agc%2BQrqwKJUy8XPKsaN0iQ2JjQ1GDB0qv5BNlrr4o3%2B7uTm9AAVC0RIGUaoSMJ81ZEG4OtOdyIQYzfbSJGntK2aQZAMkhCyFip%2FHdvzX8sDW7aLXb2oaKB7t7gwWfgyUdTU5q8vGIc7UTJWPpNfRjgCoLEkJ0pDCP9pTQBjqkAXyL1gPa9cRKKIWy8cSYjMjj5mA7AfDoKXDbjmWqigz2Hf1IMBRZbegyiyFcqnliwi5pQZk7Z%2FG%2BuUAhPhJY2dKivc4poxTHzHws12%2BlDYQMIPFi%2BqEwYV7Wx2WRuWh6l31CrAp66Lk2EtCuf%2FWAGqKqvcrygtP3RDxYrt4fhkiKVrlYqpBA2izFHytBQErwgBJ5zGbOylp%2BguAmeLk94KyPh2hO&X-Amz-Signature=5b2ed7323c01545e6ce1bf4834807cecef0524badfd1475151949d2cf36a22e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
