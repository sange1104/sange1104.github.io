---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWBJKZOT%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042033Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNr3YWunZhYd96f9qBtL9codaju4XhbeMPV33WHbucuAiEA1c%2FZPgKPsagVRsKAp%2BklzyI%2Be%2FIHQiIeRbiV2Vdktg8qiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPz2d%2F0KAiXFy3XJ8CrcA1IsNIN4Wrjb8I5i9XKfqhgrNhFkeLmCkw3rflYzHAj%2B1bcMKgkkXKLuBRnQEltrmeW5lwVbcU%2BIMNUpbqiiMWtmcS%2BMwLp2zOJkB3KTceZ8u594GZKW371cvJ0FpUl%2FgWb9a53i%2BYVA%2FFNBtTuhxaUEOmTNPVU0IJDoUi6r89NzcphvuMLx2ZpYMeS7sl3IUzgWCEmnlRTrVOBOS490tpmk%2B0aYXgOdNtaNxdIY5F55t%2BS13atpa9caqdTsEOp3FU30mj6uOxY2foLxE9iuv9usWrfd57yq40%2BgBIUCbLP3AVk9iPG3WdIc9rxl3%2FlaXCkpLchAGl%2FIPwBdSdJDgz0262KPKOb797d5E0p5axIkSnsaSFLLgY2NP8Q9EEhHfg5TZ3s%2BxRaFec0qHaiNGZYEWVs%2BycIrK4jb3SuITcWLFJm%2FqtE9x%2B463mujMGaBe%2FQpnIwSpLSrFsU7hGHQoZln%2FRJitVffYz2fynr0D7wu6KIsMcGVBgkCvu3FaD47juHo%2FDsucZ7FU6nhYfkEaSEINoLCTbYyf7MhlDhWla9W%2Be4IDOvyL6rUsXoYKjrlHCmi62Tr33SFU6t1Z9qPNfcAQg1Xzy%2BGA7a5c%2FaBQGkbPDh3CY5czTDachuPMPzspNAGOqUB0nHoO63zPwbSSDrGODxPSNc4MdVJitSSh3b6KozsDbyNFI4WM65AJs%2FcjNUPIQ29QEl1YuySvCYnzWoUd2kIFP9yJJWfeCnu1Dg5iLth1%2FULWidr55DWvVGN12ff5GjiegY%2BOaD1Zj1BIyiIVyxRWlLBYR8PKMhBBcps8ayEocLClwfLvt%2Fju4LInSGHRxMN6n6tvXYrlai3phO9S2f7bCgOCPH%2F&X-Amz-Signature=6a87a1aa7806d7611e39242075cfc1ee3deb0851b3293b9c5c93c6ccd47ab16d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWBJKZOT%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042034Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNr3YWunZhYd96f9qBtL9codaju4XhbeMPV33WHbucuAiEA1c%2FZPgKPsagVRsKAp%2BklzyI%2Be%2FIHQiIeRbiV2Vdktg8qiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPz2d%2F0KAiXFy3XJ8CrcA1IsNIN4Wrjb8I5i9XKfqhgrNhFkeLmCkw3rflYzHAj%2B1bcMKgkkXKLuBRnQEltrmeW5lwVbcU%2BIMNUpbqiiMWtmcS%2BMwLp2zOJkB3KTceZ8u594GZKW371cvJ0FpUl%2FgWb9a53i%2BYVA%2FFNBtTuhxaUEOmTNPVU0IJDoUi6r89NzcphvuMLx2ZpYMeS7sl3IUzgWCEmnlRTrVOBOS490tpmk%2B0aYXgOdNtaNxdIY5F55t%2BS13atpa9caqdTsEOp3FU30mj6uOxY2foLxE9iuv9usWrfd57yq40%2BgBIUCbLP3AVk9iPG3WdIc9rxl3%2FlaXCkpLchAGl%2FIPwBdSdJDgz0262KPKOb797d5E0p5axIkSnsaSFLLgY2NP8Q9EEhHfg5TZ3s%2BxRaFec0qHaiNGZYEWVs%2BycIrK4jb3SuITcWLFJm%2FqtE9x%2B463mujMGaBe%2FQpnIwSpLSrFsU7hGHQoZln%2FRJitVffYz2fynr0D7wu6KIsMcGVBgkCvu3FaD47juHo%2FDsucZ7FU6nhYfkEaSEINoLCTbYyf7MhlDhWla9W%2Be4IDOvyL6rUsXoYKjrlHCmi62Tr33SFU6t1Z9qPNfcAQg1Xzy%2BGA7a5c%2FaBQGkbPDh3CY5czTDachuPMPzspNAGOqUB0nHoO63zPwbSSDrGODxPSNc4MdVJitSSh3b6KozsDbyNFI4WM65AJs%2FcjNUPIQ29QEl1YuySvCYnzWoUd2kIFP9yJJWfeCnu1Dg5iLth1%2FULWidr55DWvVGN12ff5GjiegY%2BOaD1Zj1BIyiIVyxRWlLBYR8PKMhBBcps8ayEocLClwfLvt%2Fju4LInSGHRxMN6n6tvXYrlai3phO9S2f7bCgOCPH%2F&X-Amz-Signature=cefb84d65fa92e00d4567bce80bfd795ea8ff220d5727b03fcc57a91fae5c629&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWBJKZOT%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042034Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDNr3YWunZhYd96f9qBtL9codaju4XhbeMPV33WHbucuAiEA1c%2FZPgKPsagVRsKAp%2BklzyI%2Be%2FIHQiIeRbiV2Vdktg8qiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPz2d%2F0KAiXFy3XJ8CrcA1IsNIN4Wrjb8I5i9XKfqhgrNhFkeLmCkw3rflYzHAj%2B1bcMKgkkXKLuBRnQEltrmeW5lwVbcU%2BIMNUpbqiiMWtmcS%2BMwLp2zOJkB3KTceZ8u594GZKW371cvJ0FpUl%2FgWb9a53i%2BYVA%2FFNBtTuhxaUEOmTNPVU0IJDoUi6r89NzcphvuMLx2ZpYMeS7sl3IUzgWCEmnlRTrVOBOS490tpmk%2B0aYXgOdNtaNxdIY5F55t%2BS13atpa9caqdTsEOp3FU30mj6uOxY2foLxE9iuv9usWrfd57yq40%2BgBIUCbLP3AVk9iPG3WdIc9rxl3%2FlaXCkpLchAGl%2FIPwBdSdJDgz0262KPKOb797d5E0p5axIkSnsaSFLLgY2NP8Q9EEhHfg5TZ3s%2BxRaFec0qHaiNGZYEWVs%2BycIrK4jb3SuITcWLFJm%2FqtE9x%2B463mujMGaBe%2FQpnIwSpLSrFsU7hGHQoZln%2FRJitVffYz2fynr0D7wu6KIsMcGVBgkCvu3FaD47juHo%2FDsucZ7FU6nhYfkEaSEINoLCTbYyf7MhlDhWla9W%2Be4IDOvyL6rUsXoYKjrlHCmi62Tr33SFU6t1Z9qPNfcAQg1Xzy%2BGA7a5c%2FaBQGkbPDh3CY5czTDachuPMPzspNAGOqUB0nHoO63zPwbSSDrGODxPSNc4MdVJitSSh3b6KozsDbyNFI4WM65AJs%2FcjNUPIQ29QEl1YuySvCYnzWoUd2kIFP9yJJWfeCnu1Dg5iLth1%2FULWidr55DWvVGN12ff5GjiegY%2BOaD1Zj1BIyiIVyxRWlLBYR8PKMhBBcps8ayEocLClwfLvt%2Fju4LInSGHRxMN6n6tvXYrlai3phO9S2f7bCgOCPH%2F&X-Amz-Signature=e896aecaf2f1a6beb73e90f4234750e1618ccf3470d12cca64a15215d74b6a73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YKB2SLUV%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042040Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAWyxpSyTdhImzhVlYYAGlAkIVSpReEQgh3uo07UCahJAiEA5kD9ivDEcfGrWbGVjwYDliBWyXDLgHufNXY5TUPbB1MqiAQInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEpXMJevq6i%2FM%2B5NEyrcA1dE0mDvIGRBOwMuuw3ak1X2ORuCKwCgdcIpg6M21EO1rebRcR%2BL1M%2FpeMN4%2B7o0jpLnfm6If6cXl9O92z9BNsFOJ05LXA3imGBMkUAbhu90gla8TaUWH60dH3Lyb9k%2BSgGSZg4mB0vc1lbb7LeAvAt6WJtS2OHrg%2FSn%2FyrNewaDzHqPEk6%2B%2BAMYktMFD0RlyzUZgowVi2I%2BT6sqwZo5JxAM6tFA92AqUkHThhivW8Fglo7sEZzme9sVWw3qzqZFv1%2FVK9H82xrgh9uM4Edxoj8FAWJ%2B%2BbUtdFOI9vXTJvI%2BvaAdA6lxkjP%2FsSuJ0QkIxNBZDY2X6qvWr3Fl0a6ND3ESt4RM7qkjwMRAZHcz4gl70MXqKds7xKz5ZV2vl1GZrdsiSZdVXLIH7YuMxM77%2BXj7Zm5fcC4CcW0a7iwM1Q9B7UTZP4aVJf6%2FbV%2B5cEIN7bIU8M6WzdJ86HqSkhxiXLEJvx%2BHKKtXnQHTHd6Rf5OFvM3Z2l3UccVYctTblFAEdB5%2F4dC3olyYqgOpUD6agsQKEoZg9S2G2E4uQ4mvemxNEr16favCO%2FGmvHG%2B%2F5uog4N%2Bkvz0u7lJNPGZQ7d3ct1K9DlzCj3Tt9f13z8bY3J7jRqUvChtey5zLL6tMO3upNAGOqUBJHJ3yH6Z%2FLMp0NLYp%2BINUZXC%2F9cChvPLXL0tTwpHkyakojh5xj%2BPbRJ8c48fHmTDeul0za1%2FpA1c%2B%2F1k8AzQFI1HAC4Wj4mfgctwUH47C3u3sA1DkfhjjmbxsuOSR1HbLnwFfhc0zN1th01UY00av3ltoFKHkqcKDjLKdtj%2BlKa2ai5LYZBd%2BU%2FPE0cg%2BpEyKkaq%2FedHG9EPndLtHtO16kPuMjQM&X-Amz-Signature=feac64428eb4f6fb5dfe59ce0c85793c8235d7b1a78e8c397419c32f9beb1f3d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662NYWCPVK%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042041Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEqozZpoY1kBNKIkgaanSyO5uDm%2FGfLSquVVV1zvxaFhAiEAnqvGRV%2FhpZac%2Fkoz%2Fpp09L2PH8uq%2BtWO8IwinxP9aBoqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDX0B9T1L2qADxZPMyrcA4C3QqTDS6UYqde5GaToYCD1C9MEX0ERxY6WfQjifeg6A%2BrBuNzhEZgxVNKrjbPKOM2b9SU%2FCMqbX%2F%2BJIphemGyJb6civiDWqtJDZ73cZLolauSeZ4P7y3ON1cr4jE%2Fp7BqGaKoC0cQ6q3Bug%2F5ZwLgXn7nnrev%2BdwGum%2FC5gJWLl%2BTLZhnPI6NzOHEZSDMczs5p%2BhaAWSdRqQhsjvefHYajBgmxie7GaEbesOU%2Ft0bouPVN%2BcrMRO%2Fe5b5qSpblZ95r4BV1%2BpkDQyWXBLWqBYev6rALXYMb9hOs3TC7H1er2NAmD0XiF%2BREFhAu01mNYlADNKMiKBsKgZeg8HxTy3%2BrSV4Ac4GIzwESOtmdidX6FumY%2F0rO4tUa82Rowk%2F6wJyeuKcCqb5Xkzqj7TL941tndKS%2FK3odltMj%2FW4QUjjU%2B2Dnk3%2BmlDUGbauRBbxLHFM3pyO8zTwpYso9Hwn9yWxyHPoTXEaemHlMVuZ2FpI0nMwtWZahuL35FHDw8mGQvUBj56XA%2BPC8u7JtVeyBOq4CUcYe8gvWWq0MWFQ0exktHX0JbpuXT9FoMPnUzDgIBOrxh1NwFAxAD0jRyv55hQu6RARhtptCxCdvZKgxKgrIltrHxx%2FYbuKXe8wBMMvvpNAGOqUBvWPnnuP%2FICKlMDgda5OP3Hye1KY4fi6LKd5TYZnL6ckcaxlaID1T7cKPCoW6yHsL%2FMW8vBinfIYMDuGzdWDEFstuadev%2Bi%2Fv8VC3KOCoFVpi%2Fvkm8mqlK5rTFPOoSuENtb5tpJWdQvaly5Wa6r7XfXbt3jtmq8qj58cQZOEk0laOpbqCeMl%2FGi9oWp4N%2FK3B8PShW4h1i2m0dNVkITDaveUWpCBY&X-Amz-Signature=d4bf019826753ea7c79f4c3c02d561f32312d46b3bb27fe99a21fea71cfbd72a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667PXXERQW%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042043Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD0jGNQPYhstNeBbZGbXFhJmmOYt5DdNSwJlbbt0eiVjwIhAJiPhyi%2FAIXfszi6ZirIspg58aOsir5JIGb4kKIpJYbcKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzpcdf6OQZj1Hu618cq3AN7pyJvXzH%2BqkKA4pUjR5vx5mMz%2BNV29JPhLPCir8so0AzU3KqjOJ1pXk1M9Gla1Aa32upIkx1rY2a26AMg%2BCcAmrGGM61hg4Q6hvCumit3ntlfwJ1u9rUEjs8KsD4RI%2BZWIT7IqNgIgvGbqx0NNfzViszfpfT1u%2F2SDgn6pjfmtysZK%2F5tk2nTF7ALwt0e3%2Fd3HdaWd9pm1pr%2Bld5ZDrKsfWAJoU2fGX6gwXymnWmXNS91bgZY2TDdZz8SZrwHtnmow8m0HZC6DwGDskJFQzIwscpY66%2FwAr5XZO6Wn4StWs6ASVDRXcjdLElGtNVSH446Nh1jY7l305Z5P9ubTQvzTNHo52892JQULVOztAy46jjtkExJc9hEI475KruBxs3iiUlbNJxPnoRO8Y%2Flj%2BLrtBN5OvV%2FH5Rx%2B9rTmsfbVY%2FF2KK1BfIMEPo82QCDvx69JhqxLbcKHo4PEYxAiwmWCYna99JPDA9dasSNP4cZFosVrDlC5T72UY4MrkW9yd%2Fkji4ghvG1G5AJw4if%2B7qpM9R45lk43ZhyAAUeIsROazfzURWpquQtE9HKFPcI8yGLVV52w4qCBCYNwQpjA%2F7gUtF%2BTPetxmdc%2FbaaJRp8OAk1A3XzmlF2DO6aKDDM%2BqTQBjqkAV5QsjGupMELLM8%2BnBJGGPCEv8i8ID4pOnw2e7bs0vCmaL4gf9BS4TWrtprGJ1Knxoye5GehAAC93L40IBonZeQUl2g1o9468DKz5d48FKrCVdsUGYw0l%2F7wceywjFgOjhuVpoiM72VlCjLkSAY2cje5m9Bkmht6RvwsaqdqeD3F1ifcdFr9Cn1m%2FTtdCDpZrLulFonz3tLJQofTNNsfG%2FtxVWqn&X-Amz-Signature=e47f339ce5bf71560684d1206985a81f7e8b3f3679a1dba07a0237ea1ea90092&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664DD2B72Z%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCK8XSHaJDTtnb2bO33HYTTAmn9DenEhjIe6HTmLkDEyAIgcMmo1ACvHKG9wThDRqpSg7ISR3%2BC2s8pzz4nwaoDm0YqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKPWuFfy2BlSH8TKVCrcA0O4a7AR%2BWkCnl6BAwelM9I20aUOeT5a8w6gHo2Ja32YHHLbyfOoa3YPxod9DgJTp%2BaYMumsXO9T1zwH71lvLkHjUZ79VXL8egg%2F9zUixrqC3KGe8pos%2BF54Gska3Xx4K%2F%2F2Hk4%2FRRNLUa3xCqA%2BxFQ87GqFvsMdWaWmoi2nZE4xHg7fiTE7eJqfz93xmgkZsnRRH0SeqxgXC6SXFfwFv4LKqy2GdGggwYKRvRfbS9xybz2MWi5Ybp9%2BcusZ%2F5JwMArP13hKn9%2FU4h9G%2B%2Fg%2FAlZBk4o%2FjLeJkaH9wsovmh6GeDte3CzgrROs8v131ow9H9aEyPbpW5VaXZLi%2FvKGDu7LyRDQGIRlgBnavkyIj9yhw%2BvD7NAk9pjz8auiMk%2FQoqHd6cmwzDTY7oo%2BdH2zvD%2BPcyveBWN6tzWHQqJMYj3%2B4ikF24R7E6sp5K3clK%2B23tqmHZpRjU6QhdawhrFounEeIpnfLiPUZjf7M5WMz6yz3m5Xlgd1yUqFeO1TjGQ7fSRbJZ2Jo5JmkbHnmtlfOM6XLcPISiAAqalX36mdcQGs0dnpPANxONFCJErBUf6t5ZP20DDS2inuus5PelzahEpFaeE6aperqDgSTljE1UecvOVJRPKEwjUir9wSMN7vpNAGOqUBSnUxs%2BUQGjvJFLUm0dkCNa8xvZtWByO61Ju4Kz6PwdZe8pOToDo7InY3VOicuIEy9eokw9QmTEaFJGnoW6VhbomcS1UbUhU%2FD2KUsZX0nO4PuYtxJAY4BKLyZtYejoGuOkjmT5et5yU6YLq6E2lTwk5UYjlvMf%2F38VZFXS4FkuHF54MRWBDfvWrO6iLJJyx23Ln7L8Hwn30zZw1o3adh1iecWM4G&X-Amz-Signature=4b0082c8e5e635de1786ca254d2a7789c2b8576391164ba945774a68bb72fe86&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q4C5LUPB%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDcKZtypboqrzIHaDGwqCWVdDNTKAELYAeHjV%2BfqzNQpgIgDBdYw02HMD3Mje%2FflPlqDKn2JWhR9TY3MmwgZw19EkwqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG9GVgWF32jh8kIxpircA%2BwdRk2sn1uYTmFm9XvZ7jHNRIg8CD1pUQNRpMUL730xLRYX%2F50qJX0F2fO9SN5DYqsCMvCQAu%2BLcEom3HRxymAp4%2BnOX%2FxNsR4lc8ZOSUX7W0tcMSIXFvro5zDmnFSXULZviArIWET3WzWe03eZvou%2BskFbuzyvRvQnXfF3bTK2VnBiR1SLycINqOLd%2FUFaz0ExsT0CY3%2BPKECAMdrcTruekvQQwX%2FTjI0lBq65aS6k%2FHZ5qb8WfSoHefxIY5038P2%2BbUkBeZo2bC1Fj37HOGdlJT6nFg4J3e3mDl5YVoL8YRUpOdDtPK5wZqolkEbTm5edwn2bkhC5E2YRQxhfmZZhbKd3B1UrnZu2968TrmRT%2Bzr51w4EcbM6FsY9c4J19nj%2FHA%2F5yzr0f8XASd926wZ5J4HamKOxlXm6L5mMtkqfbJIQD04WsQyH2J91elNlfROyicbMYt4fXQebvYTbr4EANo2PMvYQDLQ3ITqN7BCa0zZ7ZEiNTnHq9gBcNWSqAu5bxD8nUj%2B6W6fWaFegS2rqhJyzKVT0Z38VBhTAfE4Wf%2Bex6tW0ioy6KLLDf%2Bw3M98mJPo4vtckVTcdSe9UwjxlfJPuU7GdC8oeuhoe7puvv0FaDvyhjxTrA6PiMJvupNAGOqUBJeJNxCuxcEjtlxpUWEcz%2FGvot1WYYOI6NA2ql0usseizzGqHnTEYDsFHO0W1c2Iuf%2FUPZgRi0mdh%2FrkG3clvnHPPOG9ESwj9T0ee78wwHqQOCyRCHRFU8tW5sYXVQY7cfKRsKXshJOmUhKXJVcdA4pyUOtIyjE0PDQAJ3PthrFCBM%2Fj%2BlRI8HCrhY0Ayaj9JGM3g4yUD5o%2BqgKPLHhB%2B%2BD2%2BhSAl&X-Amz-Signature=ea010ca5aaa190884dd6a358f3b1e1f777ad669734d9fb66a4323d7235642a84&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666E4R2KOF%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDmRzjlpvjpr6mU6O%2FF9%2F0LNKcuK%2FtED%2F7AnzRrxpWXYAiAgdjZM4P0FpvzPw6%2FUG5%2BJkKcbDrLaAaZj8TPYJUPrvyqIBAic%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM0rfsDq7%2FRc5c0ER6KtwDt5wEtVVfRVTL4CBIetvi0UGH6mKMgCgrkyxwaNjuDc6mlPX1I7ziHm5ChuwO8y7BFjptF%2BOu29izv%2BHZZwMYjqXMB2fB8ulGSudhVdQ9XRw%2B%2FKp7TYIuCc0dsLYXxtL8ZaHZuS2CQ%2BVpN%2FZuVPZ8jwSd%2FRqXhXXmGwv33hSiOcmTvwQ7udj2KRS8eXtiYFsP%2Bq%2F1N%2FYqkaAtbaeJuvz25U%2FVbebYXpAguApDXY5v02VWM4rn6bV3Xpd00BXLMDPC0I9gV88fcFW3NjdiCuptWh%2FF3alVH%2FnmwCHNgOMpXRUW%2FD0hxiw1uXmOngjA0eBCkVjLCrqCovprjU6P6qEfFIIXCa9qCablMUhUdHAa6WjubH6Ph6Y32IxaCvwoht%2F134hhLx6nCxXS1FIPnSEjxiDOvPQN4i7%2F8W9EA2oG5L0EKbbZ7QgI0NuTvyKyUG8UCtkfeYpu%2FpX%2Fx2guyP0xUfWUJKUtVbkYSwZDWPnWFCj3%2Bhg5Nptd9C0C%2BDZfnaWNrMyd5Rt3YmhETUS%2FkY%2FBBAetbWC2fCZrX6vGuuVeeNi%2Fe6uzJbAe7TyKJIzH40y%2FQOtRO9pFG8FP%2F0I0AB8URXWh9ixRqszZeMduwPnJOhlGOPm7DGdSIGEknuAwle2k0AY6pgGGQUYcfKPJMvbniTNfiuSO7WuH1cPWyfB0I9xE%2F6M%2B1mENh%2FUPT6c4LybRzqqcYVVkkefNJxFPtVKZGZD1xrqwHHMCBYYwMUs0BMSpogdvVZLnHjiuFDv9mrfKD44rm4oBP3Zhcykt74I4lJzcsqrpvtCiHCRaXUUU6ZLwbPAGlmM848Jq120dMbHK%2FRR0069SQTcOoMutCU5nTz1h47jATQtGiR5v&X-Amz-Signature=f421645f69bc213ffd956f9feb52e598fde93235b636af9f0f7882e6fc60e309&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YAJKUJO7%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDI9uy%2BhF6PWg3ablZ6QVPbEjl0X5Ve12oVzlmo0X4U2AIgZ0y9%2FzpOG3nWIIVWEckbNDoQ5Tl1Ih%2FN4kyp6scBioAqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGtZIJ9hQv%2BD0u6k8SrcA4yfwbKl%2Fz8cI085hzcFyaCXEDEIBSR9kHcxKCdILQ4YlbcUUsjtRuTCKax%2B9hNQ3J%2BEuO11D4QO0GDeHdx0jDKOivIEOf6SuVYBR1PoZSn1CUMivCDJOzYQvOl15S8psri4v1opa8v9s8Q81Ix6an91d3lcHpgXFtrN5wVxHHfFa5TQMUc1yU9EpCH%2Fm8YwqPGonRZgqMM74PwikJBqFO7a6TRR7MWIxyNNTJNph3DVv7r4zbmHVSAQcNQPG3woBkz5uFBFhKTDXKb5KMLH48sOcD904FmfQOVl8DvGAeAbgRkrvNZLDF5tbfWR%2BRC2tfeKQuF5eCulinC3kv6B9Qbvp2W%2FqN%2Bfq5mwf14uNBpMG4c8ZQWTOpFPwDaHwnli6t%2FBPsXpBYfoJVpEVg2yagW9ByAxxaxh7pxZD9NLEiXOX31YUQ3HevNtFwcehtB4bQZ1vzEE2ajx0gB1WtNgg%2FfQPCXVJKf8TkqhhL%2BceAVyN89G07lxAV8G6hCR%2B809H1LnYoG8LzoKtqHm4%2FLQA2it8E1nwd2M3goFJVrfV0PnJ1hvLCW9E%2FmjobJxzaF5IVRAOQ4bbE%2F8D0gPvf0rPKqdaVPAL4vyhiAwNwYRc52VtLzgoS7a7v9lPCORML%2BBpdAGOqUBappx31jK1as3ubkw66HyLNr7eT94u3OMDR8oV7nr0817%2Bz9iPFEjC6KcEQOysZORJhxu5uNnJRvYMaBMTvCsPl06TQaoySdlVPQiSpC%2BUsBeotZMRxQMOkVD4fZTXZLJIN1UaUR2EP4EdNqqj6CFqBFUxIG0qhN5d%2Bya7tUJTCL32qwWeiXjFFx8UBR%2F5QZAb7nCWzR42Mpe%2Bl5TEIolmMsTXgAP&X-Amz-Signature=d197fe408aad6b82e9876f45a9a07a3ba12657add00258703c66fe16b5a289bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
