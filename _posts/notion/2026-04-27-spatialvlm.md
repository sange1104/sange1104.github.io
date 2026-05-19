---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662DCXAJEA%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043301Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCIceyAioud9ZN3qCpxvT7%2FQIjid8No3KNFAaCoPCO3uQIhANbXHL%2BwPDtMqeiYXiriStduuNlr56%2BuMCTic%2BCPwo1kKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy62FPJayD9wdONWQYq3APgt%2FHKtgKg1gglhOmUUKKJPbNL73%2FAEeKTvAd3BKeboCDRovuHIkknv0eJ29bRUrmPQA3%2Fb177JV6HgrvXpVh2yghdTgwbMpcelXLPkj51tp46dCDwQXniCNqBids5MDNFv2nSA0fJ3DL%2FgxrsQl4HZbrYQ8mnEcLk5UEHHmDZoFZpmeYpQFfg7NX2F%2BV3dDHo0nAXyd7W1twraK7rYMtYR9L9InqpN8BU7wDHGmNgFHdDL4KRYMe8eiUSlqpqXeWXCysx30egOM5I4h2NBJtJflUZMpOfyFpMSwrRAO6JK3K9S23vB%2Fi0O9eOFIEx9itN1Y8jWvXAjyFy%2BX7kB4xZp5ypTkhcA%2FHtq%2B0DuhQklUxC2bKYerM8I3iwo0VB%2B8BLr3c4pyXIYuHIWXnPjtGTCnXugg9JZx%2BrPzk07q9f04h9yuvuki1OGVfqLE2nxN8TAI6hBU03PHUsxerzrpENZp8Kc1wYrSFSugSfgq3sARaXLECGvLvJV1ld3rH9VuKUBf91WPqNbWaT7GXE83voyUpshxfDCfZbVPtF5RJUjEdw3ykovQJjVzUgOCy85GNYHacZhe04tTDCRh2eHIHl%2FPV43ErjYXImuljjQi1Z8JkriNdC3r%2FbVM8%2FkjCUuK%2FQBjqkASZM8jtKLDn5x0tG%2FVUJZdJ33ACb4Ct0kueh7HgbwbFqz33YmYVEzKsp9WltfNz%2BUJISXpiazsJ7PA1BCc7BvHN1yV2MTeevnEgj7X7vODq4l2%2BbD0AOE%2BDr2SdnWKoQUN6T2O3MBr3betzb1fE%2Bxc%2FYXD0awpPWvz1t%2FeQ4mtmL7KuWrTbVH3MSshAzx9aTMpvm8aqHAti0tgPS1FEQzo4EIyb5&X-Amz-Signature=b2fa58c35974ac519679abb9e2ed5e8c6f912506d57a39abba5b1a0dc8f19217&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662DCXAJEA%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043301Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCIceyAioud9ZN3qCpxvT7%2FQIjid8No3KNFAaCoPCO3uQIhANbXHL%2BwPDtMqeiYXiriStduuNlr56%2BuMCTic%2BCPwo1kKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy62FPJayD9wdONWQYq3APgt%2FHKtgKg1gglhOmUUKKJPbNL73%2FAEeKTvAd3BKeboCDRovuHIkknv0eJ29bRUrmPQA3%2Fb177JV6HgrvXpVh2yghdTgwbMpcelXLPkj51tp46dCDwQXniCNqBids5MDNFv2nSA0fJ3DL%2FgxrsQl4HZbrYQ8mnEcLk5UEHHmDZoFZpmeYpQFfg7NX2F%2BV3dDHo0nAXyd7W1twraK7rYMtYR9L9InqpN8BU7wDHGmNgFHdDL4KRYMe8eiUSlqpqXeWXCysx30egOM5I4h2NBJtJflUZMpOfyFpMSwrRAO6JK3K9S23vB%2Fi0O9eOFIEx9itN1Y8jWvXAjyFy%2BX7kB4xZp5ypTkhcA%2FHtq%2B0DuhQklUxC2bKYerM8I3iwo0VB%2B8BLr3c4pyXIYuHIWXnPjtGTCnXugg9JZx%2BrPzk07q9f04h9yuvuki1OGVfqLE2nxN8TAI6hBU03PHUsxerzrpENZp8Kc1wYrSFSugSfgq3sARaXLECGvLvJV1ld3rH9VuKUBf91WPqNbWaT7GXE83voyUpshxfDCfZbVPtF5RJUjEdw3ykovQJjVzUgOCy85GNYHacZhe04tTDCRh2eHIHl%2FPV43ErjYXImuljjQi1Z8JkriNdC3r%2FbVM8%2FkjCUuK%2FQBjqkASZM8jtKLDn5x0tG%2FVUJZdJ33ACb4Ct0kueh7HgbwbFqz33YmYVEzKsp9WltfNz%2BUJISXpiazsJ7PA1BCc7BvHN1yV2MTeevnEgj7X7vODq4l2%2BbD0AOE%2BDr2SdnWKoQUN6T2O3MBr3betzb1fE%2Bxc%2FYXD0awpPWvz1t%2FeQ4mtmL7KuWrTbVH3MSshAzx9aTMpvm8aqHAti0tgPS1FEQzo4EIyb5&X-Amz-Signature=1400a28e836871f4b4e8d5d2cbf937a680f4c29d382dec8b05ca88c3cba86fc5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662DCXAJEA%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043301Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCIceyAioud9ZN3qCpxvT7%2FQIjid8No3KNFAaCoPCO3uQIhANbXHL%2BwPDtMqeiYXiriStduuNlr56%2BuMCTic%2BCPwo1kKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy62FPJayD9wdONWQYq3APgt%2FHKtgKg1gglhOmUUKKJPbNL73%2FAEeKTvAd3BKeboCDRovuHIkknv0eJ29bRUrmPQA3%2Fb177JV6HgrvXpVh2yghdTgwbMpcelXLPkj51tp46dCDwQXniCNqBids5MDNFv2nSA0fJ3DL%2FgxrsQl4HZbrYQ8mnEcLk5UEHHmDZoFZpmeYpQFfg7NX2F%2BV3dDHo0nAXyd7W1twraK7rYMtYR9L9InqpN8BU7wDHGmNgFHdDL4KRYMe8eiUSlqpqXeWXCysx30egOM5I4h2NBJtJflUZMpOfyFpMSwrRAO6JK3K9S23vB%2Fi0O9eOFIEx9itN1Y8jWvXAjyFy%2BX7kB4xZp5ypTkhcA%2FHtq%2B0DuhQklUxC2bKYerM8I3iwo0VB%2B8BLr3c4pyXIYuHIWXnPjtGTCnXugg9JZx%2BrPzk07q9f04h9yuvuki1OGVfqLE2nxN8TAI6hBU03PHUsxerzrpENZp8Kc1wYrSFSugSfgq3sARaXLECGvLvJV1ld3rH9VuKUBf91WPqNbWaT7GXE83voyUpshxfDCfZbVPtF5RJUjEdw3ykovQJjVzUgOCy85GNYHacZhe04tTDCRh2eHIHl%2FPV43ErjYXImuljjQi1Z8JkriNdC3r%2FbVM8%2FkjCUuK%2FQBjqkASZM8jtKLDn5x0tG%2FVUJZdJ33ACb4Ct0kueh7HgbwbFqz33YmYVEzKsp9WltfNz%2BUJISXpiazsJ7PA1BCc7BvHN1yV2MTeevnEgj7X7vODq4l2%2BbD0AOE%2BDr2SdnWKoQUN6T2O3MBr3betzb1fE%2Bxc%2FYXD0awpPWvz1t%2FeQ4mtmL7KuWrTbVH3MSshAzx9aTMpvm8aqHAti0tgPS1FEQzo4EIyb5&X-Amz-Signature=05edca88a220d6004ece5b1ffb22bab9e727522c0b03de3ad79f5bf936739b5a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46666746BYJ%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043307Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQDtG3Ygj4G3FISau5kqLy2oTf9BW7f6YTq0MAXIDgTs3QIgcjfF0xHYJJ8VFffN8u8SAxe%2BC86Wl6Q%2FgBEUTrmjUOUqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD6APpYDi71roFItOircA2v%2Fy6PZqdjLyri%2FZx5oUUuvrnEIr2PuyUB9mK7NE4fi05IGrALfw%2Bb57mN7giT6dM5CRzz6HNEbGYKVWp8X%2BqHlGay9dWH7NU3MugJ5UAP35%2FDtvxYcOS2ULIWslgARt8EbRZ4Gp3O6Xj9077Qq5%2B7hxNESxiQOMuQTp5TiPahkZFUaZlKCuS17efGZ%2FELUR00iMgvfA3GHbSfD5T8bi051kVIMfF7FTGfR%2FED6wIgZ%2B4QKlGANNVVzyGzEfPOgxLEH0ioDUgmvoqzVPjznqHVi20mdPU%2Bl9UtgYcZFz809fAOYD3Ov%2FAgxBhj1UG9osttw9VObGFY9ahREH6yqIkR4KP5YlLdN9VursrWwemFtoX8GQ1fTQsSAofBwNByEe3BjKWIu4TcLUSHHaViUgJ1KjrB9OBWkSYFeV8tTAm5cwRQ7kittwY%2FU6zpluLhffMUCi1qKa6%2B8arG1%2Fbqjyp1c95iHWTg%2Bn68RiO%2F05zDTTN2lV0slFvIGfIqfuIOVitzo5wrzpZcuq2OP0GhOmUPNJf9iGutLUKkuHdo1pxBzBVbqinFPbLspRupDGbnU63BqNI52hVXogFWGIee%2Bg%2Ff%2FzpydXxjEantGpcZxxUO99LJ4ewbKdD40%2B7RPMOO3r9AGOqUBhj%2FVVkl0AD9TTIx7XrF%2Fv0sBdteF%2F0SuPrEDbxOL%2FE1Hq3iwIHXK5GXz1tKRk%2FGDMSK8Qhng1Fjhzc8pfpfTgGrzVZ6IhLXFzWEKXTzlG%2Bm33OFoNspkUusedCmQMlEb9VZqgz4SmOYjCYCaBNInezSn%2BePvjld2YFB3is8kNTD8fFV2wYok%2BOZPAZxnWyH%2BPVAP8hK7AJ9UPHWElyhctqN0ajIm&X-Amz-Signature=9a41cf0946ea22e68ab11f6987dbd7c29b8fdb8acd102cbc372de22cfe4d96f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663E6GNDEE%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043308Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQDw3Trbn2aQHI%2BjVYJoYBJQE%2FWWTx8Pv78epm0gZPKDVQIhAKT%2FIFzq1KbWzsQRJQPspQcRmYKn8WdREWwt3lJFbk3aKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzvblst8cbxNfEDYMQq3AM%2B0j2sVJ%2Fe1wYXumbR2W%2ByeHrcB0xvmz7vhA3TW5NAsQS2hhYuN3VtmT%2FMkboyXlYFBucU6H%2Bz4SI6K8rzuhgrZ9sa5yISwVXl3GjAAl9hvyrEkh7rh0V5ZDVWZDbvkKU2OsYVUE6Ro2T%2BaI%2FFMx6OpUc37k%2FmraaDzVB2cV%2BfSAuHjKg1%2B3FeUMfMpk64Csc0UVFHBqiygXhcR5MJr0REBvecvks8XlBjmrTMz%2FWW4su5qTkzqwQcoMLk3TcN%2Ftv7NI2GUhn3MNElKYagrx9hjswAzjsE9iAaOLN4mlMPTGo68z8%2BYntmM%2FRDqy9JgRCcKsg2Xxb39d0sR20CHVnl4jKMMfajkeJBZFAEmlfFfyIFSFi7hayilEgyeK6RPX9rLs6DIIhg7t8V4kmvMsQu6y6RlqSwWTmmixTjjVIBe1IddpaHPJL5Zuf7%2FdvNfpdPzFVc5PEQlcBB6TrQ1ARHeQ33zdP%2FWabUFQdtLDIQs2xwla3zv1W%2BzxkPBFejtKG3d8XIw7%2BccH%2FReB7JHBtZG7jXC7sFWt%2B20cTZoK5NggQ3tTLhRd2TzcF89o76YgGdPo7vJwR0WoSsSN57E9eWyFEQUo2y5J%2FPUhlnjfh5a0G2QpBeidFX5hRL4TCmxq%2FQBjqkAV81WiQojVxE%2BND268CZ7irGALVpFhuJG%2BAxljoiQ8iWR1FyEQfHLgCCAnN0QOl0%2Bc73%2FKmaaG1X5%2BJFRwkd2s%2Bn%2BZCh4EhrYasWU9OzSh2%2B%2FfMvP8QMnsaonPusaXKJuduOfjVTej4MHGyXjzv7NWcKL4v350LdxxsIJlP8GaBlOsMpiJ1lY%2B1facnTamMxnmIfYrcsBBKp1LK2NBu3EYuMiyRN&X-Amz-Signature=c3673846a69ca4e3915cbfaa113977a3442cf704729b53203f852e4fecd3f399&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VP275SQR%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043310Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCk7OgEONJx49o264M895dru22cMBWRwqnpbsCPD74RdAIhAOw%2BBtDyRyHYN2Xj9GNjplZ%2BSEt9eOcE2p1hB67EdvdeKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxdYpCR8SCGHRLjhKUq3ANU6K9EM75mKP76Gx2fZ%2Ba4EvO9mxrQ02i%2Bu7HsbmFVu0tnW0EIK5dg%2BY79eG590oPKvMFNjQ1lIzD%2FIQaWUbYK3o4RVPASFSf2MtS6ioW3odqa4BJIT3ltAjgNbnhHmiz%2FYdE3j2NsigpSGNx9VUHiGMDrYLy1honGz1s6FEVZvy1MXRZPJZJuFdPcMJHmDrGJQ6i%2FBpHLCYKSPEEjg1Yl0na0ij3OV2Pz1EmmUkmuxxxEbz0qVCjt4iByQ3%2BcFnxPKuJXwyCEUCcjJrC2ycBrRSdRfXl%2FfDTZw4IBa6D8xEps3iAFU1iayvrljNv838ihMws%2BoUHDh1yRkdpaGmhzEPjJxLsAGXF%2Fm5tjEscHmAnT90saiWIOuM0FKXaCBdLeMTIiMVvt%2Bwm3z7fIWfzvlffjRiacYk9DsaaNAH7tLTb3jYiY%2BD3Gd64YMdP7jawMSdh8MYV2OA3A7fLnTSOR3jn%2F6VOsgr8vVgOf4nEEprbSgi1q32eso8Q8EAUuhiS%2FvdMjskH1jvtXLd0EWEECki%2FQK9MF1vIu2hdea%2BThinV7Qch9%2FTkLUByEBEK8RkRUY7Db9vXyoWqDOU2CJLRSuifEH35GBaL%2FBBiJSob%2BIfnGLrud4WG72FVJgTC0t6%2FQBjqkAQJlst1TzbZ5j2nAC47KwYiEbwQTtqUH%2F49GISUVuiST1EzQlK4NmE5WATrcfVnLciLdd4AoPQYz88DthbIIfvtdpatCPSdynIKGS7yQX7SBnyGCj0bO0sl2XC%2BLR1TWlivkCKPXY2rpJNjQriQEHmQKfzA2rLrYmz7fYUW5Wyc965Ja3%2F3HGdQvn3n0QKZeHwy9PrBgB9Qgmnf%2BtDxV8%2Fat1%2BQB&X-Amz-Signature=c4b8880fb7f04734e3936df2a3f468d124979941a65ac6d1a9138657540a2be3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662S7C5QRD%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043310Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIBxJA48JEz5B%2FIOZUAuib8RdXLrF0OWIqhYdxATz6vGPAiEAyZ5YYtKYkEu7hALdyiPrP50RZr5UMNPmEwgDKqVrAz4qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAOkFjTQdCXID8IlbyrcA07rZbcb6nZycfmYP1jBupIa%2BFNYQXRzY5GNP7X6rHG6aL658gfB6xuebC57wAE69l8stemO1x4IO%2FpktsEweSQNOP%2BzfxQ8vPdxtPgEzbOePBYa8HRpfFeLCIXtexsJx5NjYdlv7PUYlR88t2z9dnRr42DGULagVe58QVnG2ItrPy3G28njexKFRO84GOf2V9lN98MrhE4AnZguhR4DuqZ6ZLwZk5y9cYDmSKKqOHWxbQ1P6deKq%2BfRufFQ%2BUOjQzhLaXXX%2FLHtVxr9A660Su1aA%2BYOyF0zhWVvBZ4gYwJ3rHnX1YZy1RziynGZ%2Bc44Lg%2BGgd%2FfaL53W2t947QKUJu%2Ft6lT8WV%2FzDkl2siiVrVPoxn3Vjvhg4XbdpEL2UqEexI1dCVmjPdlxjegZSem%2FH72LCK9eBwRha%2F4kVzxMQMxJ5eMJ6%2F84hi52s%2FWbUWY5UpHE1yvToxZUlZ%2BoX6r8c4GR9oUTSEJwQXMBTlHJjizIAEFGJQmOG9BY3U5scUkOc6NMkfQGqPwtYH%2F8vzzwBZoCmRA05KCZJva%2Fh7Jtaq1YPqjWHPL5g%2BPF%2Bjz4kN%2F0TZxJHRNH8q7Xp1S5Z1u7Tjvd84jkQsee8GfjqXYJMYfXcskYrCxffP6x78TMIC5r9AGOqUBXynZYh0sefzIXm1bKdfkPZ%2F7GsKQ3oYdVN9tPVHy5x86DIgcLHXZ4%2B274GvSSsKn1kD43J%2BLb%2BSJHDIpNgXNNddMJlEqmwrCxez6Rvggr4BBeoYWeL5jt5V2LlapkH9nWGFX7aKcz%2F7oDHrPWwE7%2BWbc2qvigDVBPSbFMoJh5PiKw3IqRpLKeCS6IF1TFa%2BwT60kVYKlLFbkmoTcvMtMydE0Pn8p&X-Amz-Signature=779484f6c3008fada81f1b4bf556cea9da78701a696769cdb13f2d796f129250&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2S2CDCY%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043310Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIHAfXpZ%2FmEItMflfPB%2BIKzV5LLCRpRvqoT2nKw%2FDRSceAiEAqTSW1I7F%2FM1IW0lzOkX1e7dlWQfKcpKZQUsMDY0Dy8EqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOm1qSbsnnpkhsYgQSrcA3kfJmNR29%2Fg2Ts4hSCeIhdJXj%2Ffx2Ki4LXYMZjUfkLO3KsLV1IYLXorKfM58RIbRKIoB7IkQkemhZGuBtv2W1xu6I6i%2BD69ICw%2B6ikV%2F3tQV7vj8oXQ7jFgnYb8QcBtG%2BZZboa2i5uTon3FmsUBTkcN8vjtae1ZUU0qTSqIvWphIRuN75PpHmPudyBI3RCKkbO0oS266JR%2Fvy6bHSyY5VbcVpzOexJC9N3X0b5I96B%2B%2BIEvAqWbIkuW9MsYNbloQ4sPXsXF3ieeBzTznFb2b43kajnVLXo%2BAG45ojL2Z7s1MNNjJycH96pQ1U0R9HwAH%2BbSoara%2F6tntytvpBwzVG4enk%2BB9xhtzGg89L9zCjJ5Nc6F6EXtCxpWtDATUZDKJ78WVrUbyNqWj7BWgAV1RbYGyW3zEvY8Our%2FESS5PVnN4c1KSQAiRaSM9D6S3Z4W7cb4RKX7ufhG%2FCTKL1HOx9eJjV2cRn9bu1sivew2hUR4WZSdV1M0dt%2FW6uXdxLugSctCxbGTBHdn5WJgPx97bJuaOgf%2BrrV0zKg%2BuDBA6thGdOD%2Bjwj9T3jsN0SZiEUxA1wB%2F2OxqiA3m%2BB5DeDLCsZUQ%2FKIia2YNpyPf1taXAdl4P4RUWe%2BiYVg4UHVMJO5r9AGOqUBPvjKiGZj867Ixm%2Fn9ifAKViNEA8XeNkoZuX8gw1sCuZJOPv%2BgzU1q9%2Bc42W5AxYLgEhVQkk03NSsIVkiyiET1cEg6IRLxY4mDP6tre1eDHYsxIa49kWE2AV9HP7PaanW7dKZiXJhpu3u4tUbxlWCuNgUAEKsd4uOEvKOvJ9u509jNcM9LRq3ju%2BxF0IIR4Hgy5LBGuvDMU89qgj7nGjZVoO%2BA9Dp&X-Amz-Signature=8e4dc45e2d1f159fe6feb92e50a4e8e786e613f401fd5e68b4d0fae65abd6a0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667KPPAFLN%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043310Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIHjxD2NBVSmau%2BR6duYP2pyUxV7i0mY0IuccCIgrEvqoAiEAmW3cNGpmzTBtKfseAooRvRIKTYyb6OGal4aJhXXBv8EqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNXHm%2FI0xCzjTgxEFyrcA8DBLawN3beHUuwR2A5VzcQmX65HZpo2Zdv9hYGvEn86UZiFEq%2Fh%2FAUMa2ceFF3l3ZDo69N04jnRIdHO%2FSmNGOPOtkDjYJQCNrVyWc0YlSv%2FTMUQxtw4y%2FWql8DP70s%2BQn%2Blc5qX07D1gHVMYkNiytutQBau47xlSgobwf%2FqTQrUyJfnDVmNbKkfhTHunT6vCn%2Blcx%2Bk22y9vAXUWMxWiXrDliICKCV%2B7197AhmwKr%2FJwnmZ7%2F8LnvjbLzdmEPTseh6xu7uJwm8h5zHIIaCOJRBLOBqXSP8NpoovnwbSx0cBUB%2Fx95iExaUArSMuqwZsCkylYy1bUWlel4PPmbGt9trzwihQcV20Yw1D4FjsZc45HmY1Jq67P%2FnyrguDdk8v%2FzC9yGyHzksPYsMBVuEYE7SySu9%2FLkAOQ2w0967NG4kvyuNZhF9z01IBnydBUp4fErkb6GsMYtqw%2FJ1QfwlxVnKcrz4mbu5OKe%2B7Jb0QTuUEvV0zCu6vRCCnM2c8iGazjc5AB8GaMoGCgVPGRSgdZoi0hrki4vmHcjOhqetT1YJL%2FIEsZL43QJHL%2Fzm041ybnbz%2BdhgPrDKA5SgtWZPkKMUFoWNQ%2FRFMOE7ZgWJUrgJ814tagS9hLZjiSlt%2FMLu4r9AGOqUBKo4HLORSFxJSldNzxP160KWp%2Bw8fOCzCDtpH8fEE5TKHwKgtu06bf8m5iROXEtRM8cB4RerAprEiGRS1gbfKL83mmqXzumnPoN9aE2ouGwPNcu5LbecHic8oi152ixNmJbW%2Bbt45dHx%2BU8SnygJOt79jfT%2BlqSIm4a0zszzyu%2BD9oNi6ZSRiegjahCgHBPkdyRrnAdHBvv78wD3XhuLxxH8q8mq3&X-Amz-Signature=06c79840f1c62de20339b28e197ba3e0ce4c5a836c7cdc40e3a23d32684f2d72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPEBVDHZ%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043310Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQCHy1CSJ3k2ybNG7afQ9e8KoEVQ7Hp6PfThCpiUH%2FbZTgIgUwnnVf%2BCMdZ9itMLpGWfQXMRgKWTUG1YdihttR5zLJ4qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKUZg73YJDOqO8njHSrcA%2F1WhT2NuFWER5cWvNzKbgA4u2ZJTtoOFsmQ7R9RY36m6hZvutoJpLOlBE6UKiL6skhoYjSS%2FPWB%2BwssSycqebVLlmaVxZkQEGOV4bMHm6qLyPDELTd9ZOLqqOLlTRpx9QOf8%2FaJ2lGaAvjeH%2BmtJRLuoVxdZWw1rE5%2BQD2CCWOLqLBVwiqPdoZ98Qt5Qm53Qtxav7YZ9n6lTQD4r7C7pi9LFGsRe1DcJVuwQEN0pCGM4DzDbkksQymWxlICqGXlK901YfGDkN7nTXw3iCKsa3k4zvvTz1cd6oSYmKPIiuq3zq%2BAkU7SEHr5HIkRBiNupMmg6vXoeZSmrsASnmarEe80XSNW1Rnm%2FX%2FGq%2BkybgNDlgZ0XQiepA3foJnn%2BKUqPVgWBymIsUomyd43BXNxVvUMbBHf%2FYTc0gKtUOLjylyqRIP2244PreBF9nYlK3GQYr9xRuDUMKDSY0o%2FqJKDRRfLyk1pt0Dwh4I0%2FYfwQ2IAJXLb%2FbEPLc7viYaSsO7u2aXQ%2Bg3RG8IDP2aMlMtN6pHe4A%2BUqOgROq0RzIqatr%2B72JvAtZSwvP3OblrHYcJ9IN01tbQ%2BzC8TbHrZoXWMaHhy2oVff%2Fyb7TQiSVKIl2hiBYM2tUrr1xtMSfLYMK%2B5r9AGOqUB7klo%2ByH6JBqzcLx5Sct3oRVSqQ4LWYK9U6V3lbbWwSsVBLmb7xUPMTp6xGvsigl%2FcMMGzhqlx3AVeoopQyZQjJ5%2B5rm60aapAo3tj9HsH4Hg9WN%2BAOc%2Fe2btnnPVwYstjOjPfMH2f2kUYA8yErvJwTk4%2FXUHYVYe%2BA2NvWWW%2FWye4WEf92dZTqa2e74%2BOxBZseYj%2FmrUhpiCrlu8hceajPhWQEl4&X-Amz-Signature=e5223e2416be203d0c3f723307b9328c3dbc89d3c49ab787d733a5935e2bacb8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
