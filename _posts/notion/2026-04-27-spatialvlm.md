---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664HK4VOW7%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041648Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIAMsYxeLFSHDF2hF38pXgwKnO31RYPLC%2F3ReCvWI20oCAiEAzjtv66OYg2oh6fOjqv4OdTZfDr0XOz%2BbpzLLRwFDWVQqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPwUr%2FQBnCXgRE4YnyrcAxF1XN2TWwube3xbzkX3wX0KsYET8UrWAqU%2F5nP963AJ94b4Jy4ttA1ZCw6tABJHtcODcQEdO5pNEFYW%2B8xVGwjBTgHKOXVoNR9RSDDLm%2BtUDQZcNwDPm8uTbKbTsvI6xm2DekOLiVRwdWEaB78hh1ci988mfAtC3ieL%2F%2BXAB40%2FaOGCsk%2B4WnOfHa9EM8uzM4IScPWbo%2BGCRHQKk7qpZJ502adnRxz6TIOkeyuAV%2BuYWALtWz2moBX1RjNzsjpO8dGUOTR4QF2HaiHp%2BA70N2qrOatjYHAHzdlsZsrIBIbdiiOAoC0LuNKRCyS4UelMEiTwSGiDvin%2FLmb1RDkVrUJDMCqYuOFW7BJed13LtOTXoxQcgZdyCUsuceotBvsE8ZudFw%2F4eolD9EZ57XIOfOu7%2FpJnOvKPFFTdoWnjGkaDCiiTYDHd60Civ8jxDWnaOm6tY4gXQJxJD51j4ByRpnsg1W%2F%2FjRLsmerNH7PNfhCP8veog9ZDqupaOyVtlcQnQkkE5WKzrb1BaJeH1FcL522m17c9uCLGLsdF1DAw21HYVovYgaAvnk9AEDGCc2k2Ee%2F5xNJA%2BFyyTWtGomwtPnUJDiVDCufbeH1gt3quHm2GbEighrrQvr0ogFJeMP2m6dAGOqUBh0njpLUEOcMmdOJekLyGyj5raIf9SEPEZGJ%2FhW6ey9f7hKiubtzqSfS3XznMug0%2FVF9Yv4W0Ydhc6NJOKqR2WKZHYeSd4xXYCr4TXGOKAl3o6yGfu8FV%2FgyBi%2FSxwd9IBR9LY6EKX1HxYCVEUjDslYita9EgUypYg81wXF%2BCh90XoDdCJm9RP71ItVN6ys1npwsAVgPATImcVVwUM8GfmJEvyhvj&X-Amz-Signature=c9b9bc6726fce362afde5a4a9eb14736eb81045c478775faca91f6ca26ee054d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664HK4VOW7%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041648Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIAMsYxeLFSHDF2hF38pXgwKnO31RYPLC%2F3ReCvWI20oCAiEAzjtv66OYg2oh6fOjqv4OdTZfDr0XOz%2BbpzLLRwFDWVQqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPwUr%2FQBnCXgRE4YnyrcAxF1XN2TWwube3xbzkX3wX0KsYET8UrWAqU%2F5nP963AJ94b4Jy4ttA1ZCw6tABJHtcODcQEdO5pNEFYW%2B8xVGwjBTgHKOXVoNR9RSDDLm%2BtUDQZcNwDPm8uTbKbTsvI6xm2DekOLiVRwdWEaB78hh1ci988mfAtC3ieL%2F%2BXAB40%2FaOGCsk%2B4WnOfHa9EM8uzM4IScPWbo%2BGCRHQKk7qpZJ502adnRxz6TIOkeyuAV%2BuYWALtWz2moBX1RjNzsjpO8dGUOTR4QF2HaiHp%2BA70N2qrOatjYHAHzdlsZsrIBIbdiiOAoC0LuNKRCyS4UelMEiTwSGiDvin%2FLmb1RDkVrUJDMCqYuOFW7BJed13LtOTXoxQcgZdyCUsuceotBvsE8ZudFw%2F4eolD9EZ57XIOfOu7%2FpJnOvKPFFTdoWnjGkaDCiiTYDHd60Civ8jxDWnaOm6tY4gXQJxJD51j4ByRpnsg1W%2F%2FjRLsmerNH7PNfhCP8veog9ZDqupaOyVtlcQnQkkE5WKzrb1BaJeH1FcL522m17c9uCLGLsdF1DAw21HYVovYgaAvnk9AEDGCc2k2Ee%2F5xNJA%2BFyyTWtGomwtPnUJDiVDCufbeH1gt3quHm2GbEighrrQvr0ogFJeMP2m6dAGOqUBh0njpLUEOcMmdOJekLyGyj5raIf9SEPEZGJ%2FhW6ey9f7hKiubtzqSfS3XznMug0%2FVF9Yv4W0Ydhc6NJOKqR2WKZHYeSd4xXYCr4TXGOKAl3o6yGfu8FV%2FgyBi%2FSxwd9IBR9LY6EKX1HxYCVEUjDslYita9EgUypYg81wXF%2BCh90XoDdCJm9RP71ItVN6ys1npwsAVgPATImcVVwUM8GfmJEvyhvj&X-Amz-Signature=9ae2c50e639ec065b4d13fb7096ab0e2c7ea7967b7b23709a0720d0fc75c8734&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664HK4VOW7%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041648Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIAMsYxeLFSHDF2hF38pXgwKnO31RYPLC%2F3ReCvWI20oCAiEAzjtv66OYg2oh6fOjqv4OdTZfDr0XOz%2BbpzLLRwFDWVQqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPwUr%2FQBnCXgRE4YnyrcAxF1XN2TWwube3xbzkX3wX0KsYET8UrWAqU%2F5nP963AJ94b4Jy4ttA1ZCw6tABJHtcODcQEdO5pNEFYW%2B8xVGwjBTgHKOXVoNR9RSDDLm%2BtUDQZcNwDPm8uTbKbTsvI6xm2DekOLiVRwdWEaB78hh1ci988mfAtC3ieL%2F%2BXAB40%2FaOGCsk%2B4WnOfHa9EM8uzM4IScPWbo%2BGCRHQKk7qpZJ502adnRxz6TIOkeyuAV%2BuYWALtWz2moBX1RjNzsjpO8dGUOTR4QF2HaiHp%2BA70N2qrOatjYHAHzdlsZsrIBIbdiiOAoC0LuNKRCyS4UelMEiTwSGiDvin%2FLmb1RDkVrUJDMCqYuOFW7BJed13LtOTXoxQcgZdyCUsuceotBvsE8ZudFw%2F4eolD9EZ57XIOfOu7%2FpJnOvKPFFTdoWnjGkaDCiiTYDHd60Civ8jxDWnaOm6tY4gXQJxJD51j4ByRpnsg1W%2F%2FjRLsmerNH7PNfhCP8veog9ZDqupaOyVtlcQnQkkE5WKzrb1BaJeH1FcL522m17c9uCLGLsdF1DAw21HYVovYgaAvnk9AEDGCc2k2Ee%2F5xNJA%2BFyyTWtGomwtPnUJDiVDCufbeH1gt3quHm2GbEighrrQvr0ogFJeMP2m6dAGOqUBh0njpLUEOcMmdOJekLyGyj5raIf9SEPEZGJ%2FhW6ey9f7hKiubtzqSfS3XznMug0%2FVF9Yv4W0Ydhc6NJOKqR2WKZHYeSd4xXYCr4TXGOKAl3o6yGfu8FV%2FgyBi%2FSxwd9IBR9LY6EKX1HxYCVEUjDslYita9EgUypYg81wXF%2BCh90XoDdCJm9RP71ItVN6ys1npwsAVgPATImcVVwUM8GfmJEvyhvj&X-Amz-Signature=06150b8febbe2f55f7563b6dc91c76ae0d254dd999ab8708775ac598f8e1b965&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QEQSVNZ3%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDA7ws474uZKQx1ZfQeXckLPrFP6hUmSJc5rpF4CtejNgIgZQLVePZ0xN3ElSG5jCqWeoj0RcbrFAaqSp2RrUAOVyoqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDPKbO1K8Abv97eqDircA9%2Fr8%2FxSbs3uehDu2tREWYw7Uetw3vijXcOs0KW1bX%2F1krsVlVvdtkIpU4xRWexJTnYYyT%2BvK58sblDOsAOVaT9ePLx6p%2Bi2M52ZVxwJGgpqwaaxGPMHoB0wWipzyF42%2FLh8GTfeWf1qOugPIePmiSfomnbV4VaBOOz9Yhcpl%2BnwzoqVwk8F%2BT5lNht1WFTTGerrFtE4NK6OqRhpGYQnIPHr5oo%2BtHN1Ii4xiyKQbyi5O%2FBE%2FkgE%2Bp2nNAEiMSOh9Jfz5hQX%2B1AmRuMjHy1MS6Cr33BgvbP3Qxb2tKjbB%2BK5L8siDWQHA%2FoLwlzsDpnEkCmoiOWqJ%2FnrrOwfLGm0l6BHrg7w7yPOEvto6cEHbOYMGBxMz6p%2BFdaH%2B62QnGzvfhhEz%2BlPyKUNbaURMcvYfUqYZh6BV47kHigAlO261u%2FCVRrqgta0zNsI22n8UgGDM%2FRktqhyZzDkHH3%2BDeFryVS9LK8J5VLt0WoEb9RkFkwRJt2fruLpMU7itmiBVqf5pnHa9Tw1hdkL%2BBPsnXKsKdRarUx%2F0ypE%2F3Iu53onf803Lac8Igzc0bobl7z5Z4LSbY8goTCCx05Z31RmH8aEEhtJJFa3LPlKKBGXGtgTx5L4%2BrIfUxaFuowVm3N3MNGl6dAGOqUBC4p7pkehYLf57k95BN2E33PSZQhngGNLRiRX7bIMXkiVttUWL0swnW7T7qwZ2SpgXL8QOIvK5UkDIwXz8qjyv6zEG1hJDDuelHwI0%2BkBiTOKeRXWDVKPsWpn%2FR4V2JG4%2FniAyMYaqT7rNCfkV%2Fk3ApKV9qLImesbXDtiEU86%2Bq4rW7TW6hfzxZeBLgmO86JkbVJPo74Hn104WRZEY5Sf4AWzA8PI&X-Amz-Signature=f0ee771358fe9e6e4a381f631c368c797dbf37ff9af66d2e418d7babb04f61c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMOTNUYG%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041657Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDCa8P3yAG%2BpGivyKFcAJlzi8DgoUFfp9GcMQKnGSeT%2FwIhAMlw7o6W3oIm%2BVxuf58qvLV6NZNjq1py3DLFwfi0ZkguKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzHcz059Pegb00%2BHkcq3AOZz0BkDttq3Dga%2BW%2FNGxg9gi608DCs1%2F5pgaHbSWAuUikDhFiQiEg9kwTMYZ0mDTZmzVIP%2BGfrp1qz3bG3Zjpc94h3lT0q7ChJaPViohW2W%2BmcgyZqY5Y6JskHe57xETAopCIOfVnvtSf7gptqHbqMKZY7dZksqFPwTlhgY1XT%2Bzbq7z2bZxHH6M1twjUszt8eso2Yly32gVfk8qWYv8fGQr70RqMvLNOAF8slch4uzYt5XWiybG6WjeIasuM31C0VhsxoW8XhG8mQWCYEY0s%2Bl9FfaqJmOk4ODsVahdRmLf%2BgzYESztxPDRnDg8QMKt79y1Nl04vR%2FEtLQDLN4OjE%2FcJxjgaE%2BmxDl8DpFA0hf2gCN7vjqvps0u%2FZoF6Il3SJZIuOTr7vk49tEUg5ocLQKacHRL38Lt6Hd6ww4Hvr%2Bp%2Bg6JIVZbLWuqjsM7XazCNHeXaQVuo1bRgr4dC9fkuklZ9vuVnL0rKX%2Fis7sahi3SeHlKgBIejF3wVXJpPS4pp6rm95Vv8Oc6ABkqVMd87vZz2mfhb3IlD%2FoGmoAdpyxrJpZ2OCQH%2FlYAOQTOqh%2F8W5ljQwzFrXq%2FL3NhvH7wPBF%2B9zQyNNfmMXjRXQKT0qosRe6vDGaWZEeBTm6TDJqOnQBjqkAYxJFfrYd8pqvHMnEHEXZSXMFpVyd17njGqDB50nnEWuBHn1c%2FN1bnnq3CQ1B%2BdpOQAYn2OoZSASlj16cpnfhSSGkVz465ZIJ5uET5Q47e0RDIsafvaVLWTbsy4qFyuXycNGKBz48oDexqUn3nynVeUk3EZS%2F0VQJ8MRMetH9zulpgRy2HwSSYOyWsOTn1G6oFV9Su%2F7uHjukDf%2BPMcD1skPS6ru&X-Amz-Signature=769e9ea9b7e511a9ed5a9c3fde17f5aacea454681eaa8195e206ba5b6cf51056&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667OPFAAFR%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCID9NaC%2BERXWb1zeA0nbFw8yBIAxC08WRz1FXbOnBgEa8AiEAz55cETjokrzB4VUrTrhH6ewrO9RjSo8NWQ8oJ0SCoTMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCIvCqbAHKvDG%2FhbhCrcA%2F6CMpTAY9QXIEZ1PLUFCf9%2FNyoVBrXQi%2FEHZCpLtwanHNg%2Fk7UHppu0WXc1f%2B0nUrJBI497HyobP4qsrlq1I4Cy5fmPVKckBxezLqH1YddLiaYa7Qg3IyOe1lc4C18DtRBM%2FhGrnAfujl%2FV986XGAdC0pSL3k1rL%2BpLd65LCPL9d1SgRd0245IcKZEEzyJLtRK1oEFn3j2oS5lOzCcTxgLHxFlHs5ZPNEPfym97XDXf7k11StYPue7lfnb30EyBMHMftqYO5FhJEjguatfNAXq4zVoXfxq1GlSAJdf0uV%2FBwU2SM61ZcTJ6DiSYXdkw7mU8qGm3zLrkSMJwOP5fdLBdgb4sj0hkk69SVHmUiGPc3KecoDJqmJP3wwcu5waFjIeFAY39ciJ34sJ%2BvuEZMCE9Y6KICAuEL%2F5RkjLm3ke72in8oIkxpjzL3ssaUhbkFxjJABCed7idKr03BtYpN5WAk6V1dKQWXzcPRELZFv0TBdr85YadcI6caROajJDSTir0gygT8%2BPlyPogsxAqgBdc6UJpxIc6dFehoBJuRPca%2FpkovsGDkXCgi5NcMt8fh6ZtsgYd02Krtw5Xx2THkFqH9gm%2FjpjQIp1vDwKhVASStaJfucwfraOHoOoMMNyl6dAGOqUBy2wZSTWkwHNXQXfH2ue%2FB41Ou%2BgI0vhCfuKHqYaIG8kbUMv2qSAzvOTXmdKl5K536pPk0kCnPAlvu1%2B4u%2BENINT%2F5aNVN78cwSJ7Veu5etP%2Fz4t%2BRq1iHHWg0laCUTTjaKyJhCKrO%2B7lRCv9uwF2YcCazSax9mctceCK%2FTFp1DYaqzm%2BIfiUl%2Fb7QET%2FrJcDw9YsAuj2swTzQ%2FDrXzDVKbVdQA0R&X-Amz-Signature=d47378b12866e0f7720569da185d812fbad38cfea705058f2dadff42ad5f2a05&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QNFBSIAJ%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDAAbsNhJFyzSq6WN1kN8DQL5Fr71HtrH3h5oIURLRVFwIhAO0EwZZoeDPc%2FmcqTNVcPcgP6rLPwAwwC2Bcb%2B7ExWWiKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzrcEJSUzJx%2FycpoxMq3AOWCTAor5v%2FmSlLORyYodyJWtKNHdHFLNuxKBA%2Fste22j1lDPOyVFnheaAqWBHhkZPIzFKyzXicBdMXUTAEMVdSJ7C6oQjHpHix1LQUbFnx9r6kp2fIw3%2BAj%2FKIQfArPt2a8WWlprBEqQ7DNtFY4%2BVtTRVZUaGWwjg6qCn%2ByML87dgrtIjWAYttbXaqGSNs%2Br7wpQp7EjqY80w75rMnHFOmW3ZkbY8DkQqftbjMYGAsJKXaFzUMvVDIkyhFAdqXDYy7g1L17Kc%2FYH9%2FwlWfxcwtbRAKD2m%2FHm18n%2B5B%2F5Dg9OGxJUfr2bHxxhOXthGU2gHxw5aes%2BNVYhXqPx4QW2WLb0mpWM42%2BK7hBVzBtPBeHsoMNgMrQlAY6vjkxO4q9VdDnICg9Pj5eupImXPBMzHTEaX8Cz8mxHGbvwhK55%2Bkyf%2F7tTG3o7Kqag%2ByhBd9VG9s%2Bm3K5EReg7PMZ4y4BfVlGeu2l3bT96gpJ9FRBBLeYFjkXw8fbZfezgl9gNpTTlo3gPM1PHOEux6BNTQYHeBYXH8O70RJk8lXpRKVS4jkRHYA6wDhoohHR6ogwZ6JBWdsOxVc1N0ogTOXppsoxhx42LrGGtaHNDmBhutAyqBI02bpfc0M9kl3pr2yqTD%2FpenQBjqkAbrMjr5NC3Tr4U1lHQyobuMSzuPda31gXDetFl%2FsvN%2BXVL9Fqn59pwah%2FRC9UijsOi5bAkQQEcea%2BKnelbjA%2BSidYL1ruD4uZ2kh%2BK7xRtNK4QHqMG3lm9GkG2T24EuzyrLP4zkuwUnm3oLS1naE08FLEHysLzgs4iuimOUdSsUHJIcdTsa%2BsKP8rSlYiel0NVSuNsVQaWDQGaO4iRiEtrn2nvbL&X-Amz-Signature=4dfc39bda80ab144d58e35f262951ff4613ece179aa7e507b1c64bdfb6df32d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662EWPCQGL%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDmaJzAxI4Mqgq2bK2fWKG4vFIX8tDCO4lNktcY0vvsvAIgFX4W8o05GzrGXqtzpfN1K6D5g0KYqIj1VYLi1Tj4ct8qiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHjbkUELeSdOF87YjSrcA%2Fa3lPilbwUwa5C%2BEj5Wz5u%2FStiuYplX3ZKSJT78jdNKLoV%2BPytcvfKCdn1VNUQiBwbyEx9Edzxa0yuneE%2BfopWFG%2Fgjq4vcwrSrWs0vMM61VMYrnI75l6I9s98DTuDW0mRUhX3cPi7%2FEJiiNImXF1UmMuixM0CBdEN%2FpJnZOf5V%2BXDZcyFSkF1Wb8ziBqzTJMpD3v0%2FWDRhp9NyyLNzqMBYLb2h8sxB2nPfvzx4x%2FSiHAzlRK277eL%2BKQeNFoqGDarmvXZqUXDbbqI8rist%2Fd4yOXyOVf9xyRgkC8Wyr8rXITRX%2FJf1MiUA71AKnyWa0iRUs5kQurTmmdrfPJnSHMxnk0TCPKy3wYO4LynqudFlZrijmeGISYUOxxCW9RuiFzY4XTmgpcXKzTzOfuobOPHTNs0Lu434cCREFaw257l3klicyTjiIpbv3%2FcxxthK32bvuxX0DuPfMbgqTaSWomBnc0SeZOTffTtswCpvaU7hrap6EHaa80t46IDkQDXuOvWNz8XvXS6RWhLnpvfvVqH%2B7IyOhgafl4Gx8faB%2B9VLV5eOvvrs4Ly8CLp32iix4rf8fDzsd0%2BUw6E1q4qG%2BxYBWR427IFPdD1gS2%2BRWftqNwk9k5FxJwZms3A8MLao6dAGOqUB6tTnrksuPp5gHst8LoS3%2FnjGZeDqTGcakDEojg262YnAGrcchuwvGKd7VXEJxHD5Npl5JZKvlShm5tQbk9%2FaGoVvNMh0CIh%2B7DUxYh%2BgMEBtrW2GYvqxUStL%2B47PrW1tgEpnz7rLTv4IM4SQ67gqM6dwGqtwCmnULj8A%2Bmz7D1HPQxENRXeZR%2BPwwgJMF0fZWzkqEIcNn5LBCGz8ujDxP5aLmoOw&X-Amz-Signature=b37b4e492cfca3e6e6a7f44b018fda0a8e373dd69e1999eb14ab5f229db3df74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662R6LJIJV%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041700Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIGxrql3zeyilM%2FByJo2A46J19843ZLrE1SFtdlBiSPOWAiBb3nZf73zhheOvVjwmGApzQ9y71hOKtpTNsxfSTKo5FyqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMTeXl9F%2FCDlRzHjouKtwDMbFK5fQhmNLG%2FC7%2BP6zV4PQbJLBCUVTz%2FzZLmKPuP1A1gL1nQj7HaJSGWlluakmqn%2Bo7s6LHmmr089n%2B%2Fw9woYSYx5HivFwsMAUULabiTwXCf0BSXperu2ngv2YVj3sXEIHOqP51CkDNfLFLt1YVLIlzkI8ve%2BIQsJJtD2cr4hxFnHlAsCOK5jw6iUk%2BLkKTG7kLbVsK7wwegBX7OQa5Xvg9a2XJDTS2fNdyjCdtydo2w44mxcItScAQPnbqXP2QiK0gD%2BQjjs0i9u%2B34WnYyZAfCp1zAEvaiYGE2CDjHEKG9NkHCBOWlo3vzQNePDqExmXXqqjTiOpLNE3DJMgiAw9OB6gXfXS8x49j7kChE5XZZNTrL1oVUNmpUREHdyI4S6wXV8gvRow%2Be1dmUgGOjcZuYFNYb%2Felo%2BtCuAdaM34zNB1yMwpTuqCKV2n6N8zKUQ6p4CggC%2F%2FKsPVEH4jKPHHJDSdFC6UhADZvMs7erTJHHPCkfYSrH5j4BkLmSXh6wNy217tZ3gRfRiCOYYyLyowe%2FaAuhhnEA%2BPtFrPa3URVz9A5i8hBC0qotfjdNXTBDVLsdpk6NCYhnXvBBBrSBmVGh0W7Eaqu3XymMa%2F9ZBpRm0TPumJ%2BSU5Ih4Aw%2F6Xp0AY6pgEA3qF%2B7I%2F4GFsPEQn5Z6pTVhU99rDnBsAmj%2FpnJcDtjY33Gs4gJQVBm%2FO8ljj8gazOWuD2m9L%2FiVQAGMTM0IceVPQjf5twriPBD1Vwx2GCEpSVuuGc2x0o27TtQ4a6r6dZA9dqiYnFzDEQs4jNyZFMULn%2FtmEm12Of0W%2BjB3TItzEEYcQN6J6nouvwYmZy2C8qxxXTBdJrGsrs0sDWj%2Fw2iOn7O5XZ&X-Amz-Signature=70361e4c6eb7df53f576d71f9e311ca0dc925f7d3e875ed6fc52e084c03d0862&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHIIPRXL%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041705Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQC63nZ91C3ZeThiekJwgM%2BMxyRum9fwJ7KQqO%2F%2BUTE1bgIgZWrO%2BagfpBIcUH1aZjDfrnKZlEWWJ3O%2Fh0JiKdvQ%2FPMqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDnypy3VCBsiAt6UYircA9cO00wPfpVJf9JG1BwfJwjMWqPdjIV1lKE3AXwmVnA50JVxv4R7VWA5YIWL8V8j8pB87c7vMVGi376KJUKfEQ67rC722m3%2F%2F6KHf2B167pdESkTpjD40iD0UMijkC5bIsQshjja3f%2B6lMxu68sSaNuQW3z8ELvZj%2Bggu4l3rYKVEpArT5oF8gmcoOi2Ay6ux7m8v%2F4preQ51d5IFvVMGSm45gZj4cB4nFWOeVFzUKQO0Rviunr6HW26Fyq%2BHzYIazehVrEAXBAegIMozLmIZfEooDMm3z9j4joQ6HlAP6IUwQHYRhfz%2FuSi313T5Ql3NNboAATFBPHfBH47WLxEiZCA9gEDF3McwxgyyXy5u%2BTt6vN95piOAPHg0hdC89WVg5tsy0jaV928VNwlcbnQ3cJhrNMtnj8QqokRwny%2BQUWXBpyNfGM04pU3rb2uZPTVW%2Bkj73xBkUD011FLkP6yAaAa6F7%2BIToBdAHvPjpT9H5CEXPVn8dYBSBHS2aLJ3ol88aIz3xoOcEeSISOfb3NGrqhwE7QCd%2Fm5s5bMmPKWqy37xc2HEoRObXfzg%2Fa4XZwc%2BhqHn4wXMKyKDDj0fNstYw6JmX1U76UWCm0MCsU6EWe390MeYosnAY5LgEpMIun6dAGOqUBsdxVhMBlpXCEz2%2BIG%2FBawVGMXwrWMg8Qx7loRbv3EcoFvDsguNkZF7nyGYLekLxNnvIJUCWYHXw3AuXdSvlz9Pd%2BIlCpijL4vUxfgA%2Fw84LLK%2B1PiFL6NWN3HG2s2sBmsXDJIu2O4jpUFxFmXCIfpY%2BHa0ce0fQ8mk0uzLr5aqEtyM7hX7yWeYKMqjkOerbsqrHegCTaAknkJPC7LgsrG9CO4jX1&X-Amz-Signature=df89e59eef508850cefc7812617a4db4331edf0c4016c6d5f041fa0342821d31&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
