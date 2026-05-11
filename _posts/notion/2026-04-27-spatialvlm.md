---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QKGRCX2I%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQCzn8lRuzpGlDsSySq%2BRrmWfgAdUpVHWnoftGiytGwsygIgI6oymJ1CMFf2VWkd8LgNAJH9jW5xAmc8PnBSob3lE7gq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDKqc326dPUM%2B9r7IiyrcA6pLNHjP84d1cxJhQsGV7gw16nc%2B%2BdApMES6rjql0pvHwKDcDW2HoIqsCJ9HhfGrKPm4Eu3xLRREHsdHv%2FiPdiGR3YLAaU1lGyILH99MYAvPgoM1Yqdv6lEbkY2GS8Kq8QwiG9f6bYsovxXfmT4aSR%2Fi%2BhYNnMqKlHCCRUA0NktLAv8B%2F3fNHrhcJdB%2Fo6j4qgM96TFoinLtKcjchFIlTm32Gri3oMsvjwCdPewceGtKA%2F26R7SiulLnw0OzGFHWwV360%2BkpsgItqtmWkKOIakB1YMoBb9t0OuJT7DSj8nuEbB8J6FvVyzNiqf34xIaCRauEUcXfjh%2Blu%2FhtQwoyExPEx5JHeehhoVOQfVmX0NKAq8ctK%2FoJeVpDYwyrO3gf3iOuN6WxNitANKvnW3XxVNn9db4uaaDVeWgJmgsgANaLVTAoq0298L759hEFP0V2ewv3J7GpF738ceUAr1mo5gdoG33oPPvrvHgozLVGCrCLAT3vnG8KXdhUAl%2FL0u%2Fr%2BemeYc1%2BPRZE8tfbDCnNGNz7L%2BpOcQ%2ByBEBAZdEii8EIEZfs8E49DhLGQqfw7%2Fiv%2BoG3pwALO2SwoIk5ufUNZHwFCqJm74nsdDbynxbpmwhOgi0grIbJSPpsql6oMIO4hdAGOqUB6BfKPjrCM9TZtmaO3KHg6d1tWn5zStXmEKhbGW1iiqX3OMOQoiW81vnpnjVRjzPAp0%2Fcj%2B1XPmd0nDVUn%2BxyuA5Ufw5jNnlEw%2BwohP7o3rc1HCO%2FsJkv1%2FvJlquuD0jpnDcd%2FAG5qVudLfz2BpFdoh67OHtGx9VRtKP6niPlclcTlby7TT3oQQztyZBTgfh9xjw48G1hI6KDh%2FadPI1xVd1ClWTl&X-Amz-Signature=659fe89dc09aa32e8a4214e5e7e4bd4095ca3e71a411c790c014485ae08cb16f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QKGRCX2I%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQCzn8lRuzpGlDsSySq%2BRrmWfgAdUpVHWnoftGiytGwsygIgI6oymJ1CMFf2VWkd8LgNAJH9jW5xAmc8PnBSob3lE7gq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDKqc326dPUM%2B9r7IiyrcA6pLNHjP84d1cxJhQsGV7gw16nc%2B%2BdApMES6rjql0pvHwKDcDW2HoIqsCJ9HhfGrKPm4Eu3xLRREHsdHv%2FiPdiGR3YLAaU1lGyILH99MYAvPgoM1Yqdv6lEbkY2GS8Kq8QwiG9f6bYsovxXfmT4aSR%2Fi%2BhYNnMqKlHCCRUA0NktLAv8B%2F3fNHrhcJdB%2Fo6j4qgM96TFoinLtKcjchFIlTm32Gri3oMsvjwCdPewceGtKA%2F26R7SiulLnw0OzGFHWwV360%2BkpsgItqtmWkKOIakB1YMoBb9t0OuJT7DSj8nuEbB8J6FvVyzNiqf34xIaCRauEUcXfjh%2Blu%2FhtQwoyExPEx5JHeehhoVOQfVmX0NKAq8ctK%2FoJeVpDYwyrO3gf3iOuN6WxNitANKvnW3XxVNn9db4uaaDVeWgJmgsgANaLVTAoq0298L759hEFP0V2ewv3J7GpF738ceUAr1mo5gdoG33oPPvrvHgozLVGCrCLAT3vnG8KXdhUAl%2FL0u%2Fr%2BemeYc1%2BPRZE8tfbDCnNGNz7L%2BpOcQ%2ByBEBAZdEii8EIEZfs8E49DhLGQqfw7%2Fiv%2BoG3pwALO2SwoIk5ufUNZHwFCqJm74nsdDbynxbpmwhOgi0grIbJSPpsql6oMIO4hdAGOqUB6BfKPjrCM9TZtmaO3KHg6d1tWn5zStXmEKhbGW1iiqX3OMOQoiW81vnpnjVRjzPAp0%2Fcj%2B1XPmd0nDVUn%2BxyuA5Ufw5jNnlEw%2BwohP7o3rc1HCO%2FsJkv1%2FvJlquuD0jpnDcd%2FAG5qVudLfz2BpFdoh67OHtGx9VRtKP6niPlclcTlby7TT3oQQztyZBTgfh9xjw48G1hI6KDh%2FadPI1xVd1ClWTl&X-Amz-Signature=d2496b0fb6c2a8c56952e6585bf91531e20295b8fae6d7b65d1851a36c85603e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QKGRCX2I%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQCzn8lRuzpGlDsSySq%2BRrmWfgAdUpVHWnoftGiytGwsygIgI6oymJ1CMFf2VWkd8LgNAJH9jW5xAmc8PnBSob3lE7gq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDKqc326dPUM%2B9r7IiyrcA6pLNHjP84d1cxJhQsGV7gw16nc%2B%2BdApMES6rjql0pvHwKDcDW2HoIqsCJ9HhfGrKPm4Eu3xLRREHsdHv%2FiPdiGR3YLAaU1lGyILH99MYAvPgoM1Yqdv6lEbkY2GS8Kq8QwiG9f6bYsovxXfmT4aSR%2Fi%2BhYNnMqKlHCCRUA0NktLAv8B%2F3fNHrhcJdB%2Fo6j4qgM96TFoinLtKcjchFIlTm32Gri3oMsvjwCdPewceGtKA%2F26R7SiulLnw0OzGFHWwV360%2BkpsgItqtmWkKOIakB1YMoBb9t0OuJT7DSj8nuEbB8J6FvVyzNiqf34xIaCRauEUcXfjh%2Blu%2FhtQwoyExPEx5JHeehhoVOQfVmX0NKAq8ctK%2FoJeVpDYwyrO3gf3iOuN6WxNitANKvnW3XxVNn9db4uaaDVeWgJmgsgANaLVTAoq0298L759hEFP0V2ewv3J7GpF738ceUAr1mo5gdoG33oPPvrvHgozLVGCrCLAT3vnG8KXdhUAl%2FL0u%2Fr%2BemeYc1%2BPRZE8tfbDCnNGNz7L%2BpOcQ%2ByBEBAZdEii8EIEZfs8E49DhLGQqfw7%2Fiv%2BoG3pwALO2SwoIk5ufUNZHwFCqJm74nsdDbynxbpmwhOgi0grIbJSPpsql6oMIO4hdAGOqUB6BfKPjrCM9TZtmaO3KHg6d1tWn5zStXmEKhbGW1iiqX3OMOQoiW81vnpnjVRjzPAp0%2Fcj%2B1XPmd0nDVUn%2BxyuA5Ufw5jNnlEw%2BwohP7o3rc1HCO%2FsJkv1%2FvJlquuD0jpnDcd%2FAG5qVudLfz2BpFdoh67OHtGx9VRtKP6niPlclcTlby7TT3oQQztyZBTgfh9xjw48G1hI6KDh%2FadPI1xVd1ClWTl&X-Amz-Signature=bd264045d0d2d4932a25ddd01738daef4b7267315a7408250a6948adf4030718&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WH4WMPUT%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQC94yOFGD%2BSCMv1SLsptIsMibldUawel1Wal84kBK%2Bl7gIgek%2FouRX14slbl2OdDs94J%2FIHrjYsALuLDVzDvjNHwOsq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDIjWukN5F0miluw9YCrcA8HZAG3pqQ0IT7qfDZarWlKEhgq7SJ7SHv1mbN9TYWeMCpE6VDKhgu1J3AIbPpCGszefR8W%2F24SAAQmSkchNyFXjQk5I%2F9uIkTcFqqYiVM4vXG9f1tRRkGUbhQNSw7to%2FU4D77dB9y4T2H7EKdAJg3NV53UqQhQCDBCpmI1Ekuj%2Fzc%2B0tfsuoJpV2pcWwAMeFdmZaj%2FTB7%2FVk8QiUMihqCNVmTl5ACEo3mB79sH4RtdrlZ2ALcJmrhzZvpenz1chHA4FTvJkO4EyQlW98jlB84xGaJbO%2BBaUSBODLDl0CMuOzCKjCv%2FkwLj5tImLIVVrYjw66boRrK0ufpTVDZSmQgGZ7lzMeFZAptmbzvUuepkAIpxvwgL2yY1Kd1q37%2B2IuTPa952n3Ect5SbZbkqqXS0N2VK4PBpn8fITmbOWuKCzI0eroXjO%2Fl%2FP%2F8iJuC%2Bm72Q28U%2FFjjfbEoJFgl0jVYbuwCyrIEDuhNdS5H3sclToWElSohSVaXLeel9Ww695%2BXWEd%2FdL0IzAD4vhVssr1fdIjvsEq%2F9QcNWGrB1HEEkn851NyNIc7zZ7MAtVXk11qw3CsY9A9ZJUtlJuQsaUqI5%2B4ulDFS3ZD6JlXpFY%2BAAjVn%2B8v8VA9nIn6h7gMI%2B2hdAGOqUBSVpkJoJDQhf5EBXTD5KhMqPKIeWfsOxHdwvT1ZT6Lw03AMB3q73hyFYkWk7aeXdfeoM%2FE%2FxKy6G7Pgi2%2FWkKP1SO0TwZpyg55X3PQiMl6KDwoCNCujyOyzASadLFMP8l5bRfFfKVPVPZ330X1RUudNVXybz14y6FMPxgm4U9cXnl784cjuP2HkyCwSX4uciuv7V2tSSWCgrNRSL06zTBy%2BsR44Wv&X-Amz-Signature=ac8d372374bd426b142bd923cbee258280ccb7e0aa571ddc8e2686f5b1dabef1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YBMZILEK%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043517Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQCjtik3tSKA9kxuAVcDC3UptfaQGIUygwUB3%2BqHrLcydgIhAOS0EBmSJ%2FB%2FR0jzdseEXMTrBV0d45PeSH46f3Z7a3OhKv8DCA4QABoMNjM3NDIzMTgzODA1IgzlK7RjpUdr2FChOBkq3AOuTD%2F3Jgziu7soPOu6Tw%2FCzR9uZRYhj71kpkw2zSxUxSs%2BwmeicFpQnH0AHN%2FIQ1KzL%2BTxWhGIiCknasylCi6LO2pIeBV6jjCN%2FnfCA%2FQp4E3U%2B%2FLpkFx5I4T7xJFah1wPE3pav68YoiRfZ0C0BTTZE4eMIhE7kXlOQ5Q1c0l0xdCD4VgD8gM6zFYQmXbESJ9%2B3gY2IyVVFnjxlFd3qRGihrsRZyHpXkcTei%2B9xc9G6bbw3%2Bs8hT8Gx%2BEOUws7MBUcfSpGCx057wQENfLIf16%2Bl77rKdpVWICsN6V1Q3F9WMiWI0QU8WB%2BaoCu6ZlYwjWLfeFrn5zPGgVnIftJnFjNfc%2BjKYhrlLWqktVcSvhwFpNoX9at%2FjYK8xYZQRI1MuGqs%2BH3w2byqrS6ZSyuAKM8k9lefTKraZcZNXZEpU7wws4wg2GT%2BVFpsmYTruHFA1po%2FXC09V9v4vMuY5zQ2f6vRNxIG%2B8a3Oxe%2Faxhym3UPf7Co47fUmFI0CYiSGIyk9PWiq4s6kSu2qJ8DrJXtu%2FTGgaW27GVSkUfcKxvh0%2FgwDM3C3Wjdyf5M2CYvQ82RKOZ0EUvVPdD2%2BzvCEiEE62C072bnzXQh1g5UrJJVXEdAeHR3DJQ0cDTb7OHxzDEtoXQBjqkARRDXom5gedtylA9M8mIws%2BpUljux6KcPN3vgvxvRS7sEShtW2iNUUgzL81VN6c4SIC7LHQerW4Fe49gBmw4nal2V%2BjsQnxEEPeFY0FPLRL9x3imQTylmtm9OTKWDp4xGHaxNZv6rV39uu%2F0EJBPW7bOkKCVtmXZVgISYGLlsH9%2B2B0VV%2F1E%2FZpbDr9khOWNkFQB4BWUEME%2BE%2B%2F7jVuQbi9W9Lfa&X-Amz-Signature=1fbed78fb8d32af8b1dd6eda342675c28ad47879ef59e80904af2ab03558cf86&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WX65SACV%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043521Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQC%2FR6Di6OdXKzH3WIuk5NV9noIs97sVF%2BtrDMIwjTDecAIgTSwOpoAH8nsWiLhPhYkbi4S6Gk3TnEFQHGCFLRybau0q%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDKvEr7S%2F3cliq%2FdPWSrcAwV6Wxh7YlV0Ukb7jaVHpNCqStwIjcDD1RxsbAV51NgOeeb7rjkbT9d06bNZAhnnS9YJkQB4J7miQx7AFcGSppqXh8MN9DUDUm8dCMZY7cMc4TbRc1vTXmibe7DjJxqGvsWZYAxLSeQjVge8SyBErb%2FepPQ%2FyE2jbSdg5wcgde5Lfq0DB8M4fv1VyFSButkoBw0BPXC71oOncxTgxSFtprmStK4S%2BdTHWI%2BPBRXINvdeiDbg2NiDwjiTG3U9uRRz9elhdZCFx1bIyvwIbcbx5bIfMXGdKKTXSYxXu7eMNr63ENmE0AI81hJFf0t4azCekEVGAJI%2BqFoBQ3nqvx4fKxpNzcx4bTrWfWdu5MAk%2BGKXSBx6WnQeO3sjKv90wAtb8Jn8oxTqKcp1VfJONWlvwrKH5FpNCH%2Fet4D9CKILIblkeGkMjl4PaxOSBpkrHmYj6IvWH%2BlBCgVi%2F0%2F5AJ%2Fc38ot%2FmURhnIBQ9pKqsiggANOA%2BOC03LhvUKZUMCNDBEYi0pIYBhFwEI4aQP1AM742DfSccqEGMrJJEwbhKcnqNHqj2dn5%2FlT5TacP68JtwMdvuXgBMkzW61oKd6oUqzPqfjl8L2BLglgU3xcG1iq1b4iaI0GLZboNUPSvlxRMIC4hdAGOqUBWJ0ocs60E1oNuP8jbGNiWLx5GF1eU8n9HnNWQaIDj1JpStXw%2BIIhVHVFU6xCIVUVt1VSJJ5YCPKpof6z%2FdMpqeJRvAyCJoyjUoy2DtcB%2F4X%2F8g2FByiQhqg%2BR1MiSassYKBv5bY7FB6nCGpzsXE5MnOfAz0Hy7NrNoNVvkeaB%2FLDrtIq%2BSckqbwE%2BIQ%2BcxL6vaK0t2fyw4QMFMUXEyKDfbZUnyYF&X-Amz-Signature=95c2490c7fa3c1fa1f1164b62a959d0a586660c70cfb190fbbc9afab8edf2f74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RCHL4QJD%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043521Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEMaCXVzLXdlc3QtMiJIMEYCIQDAZZW7ZrkSYefkRCKUnth24Ua9Q5dRLjPIfiWDsx%2BNzwIhANO70NemwotMdjNeOm53y3%2FFNtGxXpI%2BPBYaJ0ikWSoCKv8DCAwQABoMNjM3NDIzMTgzODA1IgySb%2BQSuh75gvcBaagq3AMRDy0%2B0zcFjiRmtslvCbf9AyfVgTiJTezV%2BSQqrqC1WgwKaFs8RQDnA5gLblmwM8BK%2Fioci3Iiw1aRw7pZGP8noUpIXjb4dN7jpTAtwJYoJC1BZ28zvPYZwFPBcO0PwzYNTe8%2Biaiuk%2Bk8SrwkwBWty%2FOEV%2FirGwKH4P1jGXpIq9qUTS5V9Su19lDH0oDIz3WBhw78%2FaZvEl6wTh66udHlcsK44Fd5ETVodAhalbUygmjSWkqA3x8UruElEbGaIBxboJtJBfdnpk34R%2F%2B32Fwkjk0GaaL3rZFSU1fbGcLdkSYk8Rv8uITmxPPDOP7sV47AcTYtE5NmjvXiBTgPu6BkcgiDA4RsbKXgF1w%2B%2BpJJ5djjI0NOCttwto9YkJxgoQyw9174Vsj7HK9zcEIcew1pmkib5j7TBAT8PidXyhvdP8Qqd1z%2BDLPWlFjshDQm5QZJIMMYvGbRquYnxReqGeRravvydGnFtIO3xaxmzaJhBc9F4d3SuriIksQu0kkKRRyU2Bg7cGv2qwYgyfyIs%2FsBG%2BinuwgXRoHvZoQtFBLwV%2FedKc1EVIYWsr3sc8UoqDhIBk59fjfX5xF367bOOSJYEN0p8y6scLJBriUsKM3puR6%2FQg%2FbNwddtQzGDzCAg4XQBjqkAaNLY%2FrSYl5m6KZ9g%2FGzLkCUCN9Q%2B%2FVEqvsDKxpYK%2Fkmii8zKTSX7z5LRYsi3gLUD8Pq93W5Huw9xTNBI2smBC460D4Q0pqfa1oYKy%2FgcjyJ1aTnnmjh243lBtZAaamg5fyYt8i5j1zPeHreIHwVjBaYUhjtbazuEPGkMLAj44Gs2e8rImYwOISXl9Zw5TBzOx2I4theSq6Bgf9bnO%2BzHxNO5hvJ&X-Amz-Signature=7d9df0f0e4e36c273cbb2c0e4cc4acffcb5da258d665325b04262ecdcd99d1dd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZMF2GLI%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIF2hWh6b0vFlmerMr3UwCJ4YB%2Fe9Bq%2FCCrLKgVK1yisyAiBRZKIytcQzGVOYFyJyuW1K817h04lH8aXrx8DV2WNewir%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIM9%2FH6rGsDajmqaB1tKtwD03r6u6qfU6V%2BAOTUhE5RqoPZBPxkb7sWyJuBrNBN3pfHL4mDwTPomrZtFC%2FwcdhCIT5hcGa9KYhls1ts%2F%2FwADMG6KLw9T9%2FIl0wFUYatWAgD80yb90bF2rt2KKP65iPbH2vRcVMZng73%2Beo7EZNl9BrVf0NbevQu3Ceg%2B9oYQzxjBs9jMqY%2BH%2ByVwbWorHS0lbx2FahfVmH6fQBNVGEkhca%2BOmZaWHPf0FQ3IQwQwBAPz2%2BiVhQRQo6ky59Jnk%2FHKYRADWPN%2F47Sv9AFbx6N5CV8CYvAfYc%2F4uMjnjrLot0hKXO9YQ3yed42AMK4DB8MLywv81j%2B5gLd7QBJQxfQDXZYpKt121gw7cJ9No0Jcr6GGfTm7wzeSyqzP8O5Wic%2F9gqzajrkTFbcVuo2pyKqzteoPli6sy4TKXdoa1hozdxxol6lNDfCSNgduDA4Ktj1iB4EYIjsDRgqyVHCRUQHL%2BBacDHqnDGxN7lteztfVfKR05EV32cqdtUOV6uClI0uSL%2BBzK0VDgsODRmJG7QK9HUIEwFfNq%2BnJT2Hg7Is4uTHx5vvzdfoMNft8zcDLaI0pA7LgM24v5pDlMfmE2O%2FhuDPRJ7jPrMLOAAaUajdQh8HM3Zm2bFA4OhKuccw%2BLeF0AY6pgEVpMKfdDK9u1NYXSpWo582RI7XIOCarMZCKjI3KrRb5nz2H1NK%2FiDNGXbCdmDrySXihFjP8dY%2BKxTfF7dbXFhxdad8UGyBjJmyl1NabgqB4DLLl9VBoGfj5OdssRUB9mX3qM3RdaXHc9%2BCUlAGETU4QZu1v%2BJRk3CVNgg%2B9Sb9uFlE0tKRA0ALLh9bYO45k46i%2FP3PVJY1jey5u4Ijnf%2Fg%2FInurKz1&X-Amz-Signature=0a5f34d35b809e152f8d2d8140fa8801f6b4c2462882ff485c88289d3423fc47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LW7ZZPI%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCICJ0pKy%2Fefnn1rBwWzjrdYFe21ghqdTZQiCJaq7TxLEhAiEA%2FoiEDJXNNWK1aIuD0GVo9e6ScwwJYLLOxQAi2aSEZx8q%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDKp5%2FzfPPFJL%2BWweASrcA5tLJ%2FPbRBP5r2MvLoVI6wz7eLR80eS%2BcWZTaNuUOeXbeSCM%2Fo57eA3aYGeN%2FyaXT92P51TG7sGHXqKAm2pifsaopb6HX5KLvOfnFmndmHbkYpto9nDRFgq7p2DrAh68fynXTiuhavZEBbzOayHWfqfV3hP6e4G%2Fe%2BS8HriqguNwCrjrjLwjMn1cvhBfj16J50Il8JniJ6rhHbgaGdUwiQvU%2FV4Saw1Yf9gAB7KfjMGns7Oyr6EJPWz1LcMQFcilUtXZHtE2opf53KmQQJ44hsKdlJp3zIr6zKoQpJt0PaqBwiUIA511ZNvB6XWawG78Z6ybyHU%2BJQt0LheaOIG5wCesCTMNH8bx%2BHct%2BdHDw5GmKVdWshoql31G0eHdmqgUzImaVb0V1GHN9pPGfSRD3doEtyKTYi%2BNncdildzLXJN0BnMmNueKxjvOiogwOHz91y9JOidQ9Bh7%2B0UDUtIMQXEu7ZGirgg9LGkce7fNb%2B%2F10Jees%2Bcah809ZdupSS2f1Vc3BqdXWtJMMH%2FeHGqaCxSZXCF4dCJ1mvBUpbteZajlPCaDcaqiah%2B7tZg7v%2FlKy5GW47p7h4ca%2BBYiJ1XngV00wT7jWHt4J4DVIv3JdX68m%2FR%2BdygSyKnIRz05MJa1hdAGOqUBJQHy1nFA%2BFt4GalVqYrqZ3HIAbXu1BBQpi2WfWckaK3Lv4R9x%2Fdj63RUmNH%2FmgRlkc7C3J1VI6z21GVmHTCzdxy1yEIv%2BrZaikVA%2BZtISUJHFJjj8uc7zxiedZNcDzwWYdRvP0TqGKRD%2FHiI4M5ft95Q5s4Vvr293VMdHY%2B%2Bu%2BTkjffEpG2I55%2FL5ChI8dsfreThdRnEoZy3d%2B4v4%2FFyqxfzTxGf&X-Amz-Signature=fe01036b5e260a5f3df931a0a7ba46028924d0ae293bf0f976510e98f5f99558&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJBV3W4D%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043522Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIFdD%2Frbtpy2a5FbDNEfbgO0LBh0atnAlVwanzHv5rMZQAiAMu9hDWZg%2FFTe4qXZnU6suRPmad8koV3oes3vgTpLU3ir%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMaOFUQABEV944dmRLKtwDJOt5ADgXmJnSr%2B14SFSJ%2FioFewAgFxZeh286hV%2BfxTCe7QYgzwPCl645rDh2cV1AZqyWQTvO755bHz53eV7Jn4SjrxX1sSjdpNjABUDOgnSDGbEqjFz%2FbuRqFpdaJ34GLKSVzREY%2FokEELOKBkB4VtFvzwHmXzS0c%2BhL9DrsJta6YYvUPYbB4Xm%2FGGBPjgw4FaDduUZwSVHiwnrY06eQmdv%2BW6D%2Fu8zNMtOonqOgq6ir0N6RQz3AcolqJ%2BNiHEW%2BJ2oIXU3VFeX9eMxXXTEwWw1YVwt%2B%2BmAIuiUaykbcjE%2BPyUOul%2FSbwjouDWdYlGlYE8XQLQhn7aPQAS8vTWOTuplHX8xOK86HJ16l1zVwvBk4jeGdleHGX7jOABLTEV9LiT25RMzefmEpGyMQGFyulIGvEfOHbjr%2F4Exrw7z6U3Euha2fZOwo8lyyj3SPnQZ82eG9fIxKi4dilJIsaMRMwMI5LjxdP6afMGin8Hk0pvRXSW2ncwOHWDpTwVZhalpVzxE2NaqOW6rpMwpV4gaqGMupJ9cJmzpd%2B0T3z1uCrlLpxLH9lebHj3OeGQ0I5L6h46xDyn1rxwPw3qbud7XdOVCCjPg2UDhasIcjoktbjPtNiPofg0xcSFytF2UwxLaF0AY6pgF7fTCuC7fdyDyqyb9HIVsul87r%2BDU1q%2BE8T8h3sn%2FNLuxeB%2BrGFtQaj09iYCDgZixKyYJMxIm2mf0HRe7m4AXIhxMgJrJL4doWnWECvGkqqwQM0k5VAU%2B2%2BOhqNyqaYkh1RZBjNPP0Z4rjsZmCq5MwR7WJD7KyoA3Q0%2B0VyTWsSE3ZieWSQDCM8HREC4j7Z1P8XcWlnOZyYa1mZez%2B9O%2BxvKkuTn2Z&X-Amz-Signature=bf88383edbff370c00d6786b63682b835b5a20cfb5dc34b452ac1c18a502060c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
