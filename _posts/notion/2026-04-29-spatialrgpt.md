---
title: "SpatialRGPT: Grounded Spatial Reasoning in Vision-Language Models"
date: 2026-04-29
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- NIPS 2024
- UC San Diego, Nvidia

## Abstract

- VLM의 공간 추론 능력을 향상시키기 위해 spatial region GPT를 제안함
- 2가지의 핵심 기여를 통해 vlm 공간 이해 능력을 향상시킴
    1. **3d 장면 그래프로**부터 **영역 단위 표현**을 효과적으로 학습할 수 있도록 하는 **데이터 구축 파이프라인**
    2. 기존 vlm 비전 인코더에 **depth 정보****를 통합**할 수 잇는 유연한 플러그인 모듈
- 추론 단계에서 사용자로부터 **특정 영역이 주어지면** spatialRGPT는 해당 영역들 간의 상대적인 방향과 거리 관계를 정확하게 인식할 수 있음
- **SpatialRGBT-bench**라는 벤치마크를 제안 - vlm의 3d 공간 인지 능력을 평가할 수 있도록 함
- SpatialRGPT는 지역 정보가 주어지는 경우/아닌경우 모두 공간 추론 성능을 크게 향상시킴
    - 복잡한 공간 관계에 대해서도 강한 일반화 성능을 보임
    - 로보틱스 작업에서 region-aware dense reward annotator로도 활용될 수 있음을 확인함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662BTPBEMM%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGdtf1uSvrwifFKzEmWb7iaCfDm3EWCz6rUQYG0Ah1OJAiEA4OAwZA4LFFSMXSEcyIEKOpw6OvMBNJ4K7FiwAaqfBGQq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDFMA5I8mvEgxsZWb0CrcA9ZSBqGNcO%2BwW0WcQYUH24SqCV7fmWcGYFVK6fySLYn6xkZkL6aMnEHqXLKBZ0cD%2F272HpNQcvPpBUVD4TEYlGETSswAG6ptIq85ih4EM9o5SE%2BdyAVdutpuM9bXZG%2BvveE6Wpx9TbQ%2BmKCUlUleYQaHNfXTJ3YwRmUgjRFwli6YjDuxq%2FYxzXBq3wGaepwiW4WaZgZS%2FDVDtoqjps%2FGGfpJiRaYPsnaIrHYWT4CGXFMQtt7azU01CBMDEO6MRb0%2FKSqlTlONEnLLzYCIq8xcia8lx35APTLmODTZJ5lXgdcaN6T0YZpd7M8%2Fl8%2FQ%2FmsanZUdHIZ1%2FfQ1I3%2BBFbA6gtX49rsKMdoh0lDxR5ZjxKIxh47f%2BiJMjC19XcCstHZqxuCtUp4UGMveW2L5dWwcwmBx2f8Cb5m%2Fw2o6CWtoDa29Bk0NR0oir1Q0EgyWCsnJSxIUFwzVTMZbBLlMt6Y6nER%2B%2BX8JQcVMjMDN9wUwJpjJBwNtafkorgsDtL2yPyf6LB2XU6TGhgT6tRXRQ9scJpKzQiR9pG0p9FLTEL2wYqWbwsD3eRZqzvLQzeZ8nnjMYOd8hYYhxedMuz8U1i8SZesVsdTI64e3HjsGrAGg7cdx%2BerKr5hoqodN%2FhrMIiFhNEGOqUBZyr6k85N67XIRTgcb9RkF56M22SsjHt7VOoD2t268MBNpr3rLnu4MAF4rSsTz0qP0mIow%2FNqdo3ibPBN9bqN38rpph5g21kQwLyG7aJF6gUthX83jeUnOFXzmc0RkYw4NNtQP7XKCH8EcFH0fvkdUHPt%2FarnI3d6QsMQyKDzLoI0KsAbo5Jw75l4qU%2Bx6yV54jSN%2BB7YMFTvW37AdhOsp7gbRaQK&X-Amz-Signature=da58156e2902cf66643c5f3bf15ab5cf6fa18023133701350bdc5166cfc8807d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Introduction

- 2d, 3d에서의 공간적 배치를 이해하는 것의 중요성
- 선행연구들
    - **공간 정보를 반영한 vqa** **데이터셋****을 대규모로 생성**할 수 있는 데이터 파이프라인 도입
    - 이는 기존 vlm이 학습한 데이터에 2d/3d 공간 지식이 부족하기 때문이라는 가설에 기반
    - 문제점은…
- (1) 공간 추론을 위해서는 **객체 인스턴스 수준의 지역 정보를 파악**해야 하지만, 기존 vlm은 주로 이미지의 전역적 맥락을 이해하도록 설계
- (2) 공간 관계를 정확하게 인식하기 위해서는 **depth와 같은 3d 정보가 모델 구조에 포함되어야 함**
- <u>데이터 구축 파이프라인</u>과 <u>region/3d 정보를 반영한 비전 인코더</u>를 활용하는 SpatialRGPT를 제안
- 데이터 구축 파이프라인
    - 각 이미지에 대해 **3D 장면 그래프**를 구성 - 이미지로부터 3D 기반 region-aware annotation 대규모로 자동생성
    - 노드: 객체, 엣지: 공간 관계
    1. open-vocab 객체 탐지 및 segmentation을 통한 객체 추출
    2. metric depth 추정
    3. 객체를 3d 공간으로 투영하기 위한 카메라 보정
- 이렇게 생성된 데이터 → **템플릿/llm 기반 방법** → region-aware spatial QA
    - vlm이 복잡한 환경을 이해하는데 필요한 공간 지식과 고급 추론 능력을 학습 가능하게 함
    - spatialrgpt를 이 데이터로 학습함
    - region prompt를 지원해서 spatialVLM에서 생기는 모호성 문제를 해결함
        - 유사한 객체가 있을 경우 캡션이 혼동되는 문제
    - region proposal을 이미지와 함께 입력으로 사용하는 region representation 모듈을 도입
        - 이를 통해 llm은 전역과 지역 정보를 동시에 활용 가능
        - 전체 장면을 이해하면서 특정 영역 간 관계를 추론할 수 있음
- 비전 인코더에 **상대적 depth 정보를 통합할 수 있는 플러그인 구조**를 제안함
    - depth 입력이 있을 때 없을 때 모두 동작함
    - depth 입력이 존재하면 이를 활용해 추가적인 표현을 학습 → 공간 추론 성능을 크게 향상
- spatialRGPT는 region-aware dense reward annotator로 활용, 독립적인 복잡한 공간 추론 모델로 사용될 수 있음을 보임
- 본 연구의 기여점
    1. **SpatialRGPT**를 제안 - 지역 수준의 공간 추론을 강화, 지역 정보 표현과 공간 지식 학습을 효과적으로 가능하게 함
        - depth 정보를 유연하게 통합해서 3d 인지 성능을 크게 향상시킴
    2. 기존 데이터셋으로부터 **region-aware spatial qa를 생성하는 확장 가능한 데이터 파이프라인**을 제안함
        - 500만 개 이상의 영역에서 870만개의 공간 개념을 포함하는 **open spatial dataset** 구축
    3. 벤치마크 **spatialRGPT-Bench** 제안
    4. SpatialRGPT의 실제 활용 가능성 제시 - 로보틱스를 위한 region-aware dense reward annotator로서의 활용과, 독립적인 복잡한 공간 추론 모델 및 multi-hop reasoning 능력 보여줌

## Related Work

- llm을 통한 공간 추론
    - 3d 피처 + llm: 정확하지만 무겁고 모달리티 갭 있음
    - conceptgraph: 3d 피처를 바로 llm에 입력 x, 장면 그래프를 만든 뒤 이를 llm과 결합
        - 구조는 좋지만 llm이 좌표 이해 못함
    - spatialVLM : 가볍지만 실제로는 언어 prior에 의존
- region-level VLM
    - KOSMOS-2 [24], Shikra [25], MiniGPT-2 [26], CogVLM [27], SPHINX [28], LLaVA [29]
    - bbox 사용 - 배경 포함 - noisy
    - 좌표 텍스트는 llm이 제대로 못 씀
- **본 연구는 regionGPT 기반으로 region-level + 실제 공간 추론 강화**

## Method

- SpatialRGPT는 region을 입력 받아서 공간 추론을 수행함
- 본 연구에서는
    1. <u>**단일 이미지로부터 3d 장면 그래프를 구축하는 방법**</u>
    2. <u>**이러한 장면 그래프로부터 시각적 표현 학습을 수행하는 방법**</u>
    3. <u>**2d vlm에 depth를 통합할 수 있는 비전 인코더 구조**</u>
- 3.1. 3D scene graph from single 2d images

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZXAJYDP%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCszTmVGs3ZrrJszvM8JXGEKOJA9pid4GLDJIxqnEvyiAIhAKUhoc6LVwsikE7QPG8w6p5ga6R73RwX%2FeDjXxz21Zs5Kv8DCE4QABoMNjM3NDIzMTgzODA1Igw2%2BTiZvl8ycN%2BAkdAq3AOMZCM7tYamrLYNGtOVeUWN4b6fepivyLQEeokV%2BAaF2BRI3frZzn%2B4dRbQ7dXFX0n071fbYxJqrhLp3NsX7FMiaPNyxFX0JoDU0YP0UATch%2BJmkZHx0w1zuZZssrdQlL7ZKQQFxusrNx81zEHeXr%2BtxHXJzHX82U6%2Byv2ySGlt2r2lOOp8ZMESdNC90zrIzjU8XeW51ORX%2Bk%2BiWEXoC0hXnuM5cE8Bpspq1HltITV%2BN5Ty8owvqn1tOlhX13CLqpPBuA8LeU%2BvAa2lMmUnRoKjmwJ7Yc1YNnfiRD7SZzs6TVpaXl3AFNu3x1pI15BOZBnp7ofwNaUHOkf55jfKQepObjeTyZNnf3e%2FeDPaoHsVTV7jGw5fGnGBIoO%2FU%2FZRaPjowWmdlseUKvQufAVtlimOPI%2FqRIEnZtrbZ8YbWCqmwTl0cY4Lmt9naGXMYrdLkx6jG03GCWDysNg8FRQxcTx%2BjwSfkOohnYmoue5rm%2B8IaVwMr8YVXSr4m4hsR6Da%2FsFqpCrlxNY9z6MEcdgwFQ9YGRKwJO0OeurLLZ4QaEjwkI%2BL2KUDm5Pv74BsO%2BSAftiD7Mz2cKsKrn9GMtwJTFw51ESRt2Nu84Q1xxcwx%2FLQ9Zrl3K9MEUGDmxZUqzD0goTRBjqkAR1O%2BN6XnEsS0zdUiDHX4jWAAkMAnpLqoZI092O9Ao0WX32GL1hzYhmSujAeE6386p5%2BoZBlCkhqlu7oKTQas8O3%2FA9GnSLGIiDaajySOLYXimHJs8%2F1WtifIzYszmz8L39R%2BTjfRu8%2B4Pq0XDVN83IPjiEppN7xlF3MnbQ5DFNFAqfXjfvobCOOmpAGUL%2FbVogZi2lJtp%2FxNc%2Bbh0UGiB1hWzTx&X-Amz-Signature=c38761bc49dabad90505b86451208cac33cb217c0273d75767593f913c6f2463&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - **Open-vocab detection & segmentation**
        - open-vocab 이미지 태깅 모델로 이미지 내 객체 클래스를 식별함
        - groundingDINO를 사용해 객체의 bounding box를 얻음
        - segmentation 모델을 통해 정밀한 mask로 변환함
    - **Metric depth estimation**
        - Metric3Dv2는 focal length를 입력으로 사용하며 다양한 환경에서 학습
        - metric3dv2와 wildCamera의 카메라 intrinsic을 함께 사용해서 실제 환경 이미지에서도 robust한 depth를 얻음
        - depth랑 normal을 함께 학습하기 때문에 객체 경계에서 기하 구조가 개선됨
    - **Camera Calibration**
        1. depth map을 3d point cloud로 변환하기 위한 intrinsic 추정
            - WildCamera
        2. scene을 공통 좌표계로 정렬하는 canonicalization
            - PerspectiveFields
            - 사진 찍힌 각도 차이를 보정해서, 모든 장면을 비슷한 기준축 위에서 비교 가능하게 만드는 과정
    - **3D 장면 그래프 생성**
        - 노드는 객체 클래스, 엣지는 관계로 구성
        - 노드 생성 과정
            - instance mask로 depth에서 객체 포인트 추출
            - 픽셀을 3d 공간의 포인트로 올리기
            - canonicalization 및 노이즈 제거
            - 3d axis-aligned bounding box 생성
            - 실제 크기 계산 - width, height 등
        - 엣지
            - 상대 관계 : 왼쪽, 오른쪽, wide, thin…
            - metric 관계 : 방향, 직선 거리, 수평 거리, 수직 거리 등 **“수치”**
- 3.2. Learning Spatial-aware VLMs from 3D scene graph
    - 생성된 3d 장면 그래프를 vlm 학습을 위한 텍스트 표현으로 변환하는 방법
    - 미리 정의된 템플릿 방법은 질문 다양성이 제한되고 모델의 추론 능력을 저하시킬 수 있음

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VRIE375I%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050326Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGj%2FIVQlL6hRgLT%2Fw9lCHppkyk8spIU2N0Lw2j%2Bp7PE8AiACF0Ev7zQM2YXhbz8%2B7uuaTVvbejaLmMTPqoudVGDOLCr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIMEllWzAMh8QUD1M6LKtwDNBJHY3QJtASGiL3JZdzr%2F9u3WHJt9sjQuJIkqGL7BBvsBFCdvo6cv127QdM9RJHGyIY0lGgvW6fH91s%2FvTtgnzJrJe4jHm6njQaBfUIKCZ2L3Vphqw2mcg1aEFieuLhUf9HD72Gt4%2FZZmVy9K80iqeMsvWuWx3afPKyRMj0kYV6O4JUtWlHXz1AQ5rrqTIG%2BAKPs5DPFLWqfOGUA6yFR7CIA%2FNPkMkUcG1TetUtHrnwNuVV%2BxrUKYaKaqCOqYKM%2FyPcHHCH5qF%2BjpLRG4HNJUQMlZObqRuElxMvL6cc90F3PLHN4cfZhdrLcq1NSVx1020Hgx1o2EvnaoeNMHzsmm09cp6j0YREaXzjcuy0TWjcowDH%2Bl87i36A6JfJpTNp8qvnAjw4lO0wkYUqGXnTkHjco5H4tRONiwM13LA3l9IPCzRveuzrIksaQvaPxVTrtXv3msjrB1zAg0g2dBE%2BBPQL3l%2Be88N4oS9piVja33A9kZIfZqRfSmUHhX0TItErWYlw1jv5tV9mTkpiPswS8yNayMyHVErAivDJhi6kOSnZM4iEigyNN8dNm%2BFUbzOfZS7%2B4E3vEZQjcvClNldlREcXNIDvigNHSas%2F0a4PyfNBxc7wEcZd%2B2xc3%2FoswzoKE0QY6pgHXPaGlQkaAiPw3L2CBAeglJh8D3hGCQl7guxm5QM9BiEL4DAqE6AeR6fkjKiojMH8OdgJzNrQyQQoUtf0VYVmlPlH3hsjhJZacd0Y5AuxEgbzBZaSrBJiXUVVByDGifekVCdGr338K8kvYif8VZ1Hi3gxx8OKdeyGsvANG6JyJl5yP5Y%2BPBMScUN%2B30Qi4k046HYvzEfE89LVCdhjaMQur8AAjbfEn&X-Amz-Signature=953daa3493b4bd3b455b1ca5e0afd45f0860e1557e2064e9a12008d1a68d6caa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    1. **템플릿 기반 qa**
        - 기본적인 공간 지식을 학습하기 위한 기반 역할
        - 노드의 속성과 엣지의 속성을 추출
        - 각 속성에 대해 정성적, 정량적 템플릿을 만들어 질문/답 생성
        - 객체는 region [X] 형태로 표현
    2. **llm 기반 복잡 추론 qa**
        - llama3-70b를 사용해서 복잡한 공간 추론 질문을 생성함
        - 장면 그래프를 그대로 llm에 넣으면 3d 좌표를 잘 활용 x
        - **장면 그래프에서 속성을 추출해서 템플릿 기반으로 자연어 형태의 spatial description을 생성함**
        - 이 설명과 region 태그를 llm의 입력으로 넣음 → 이를 기반으로 llm이 복잡한 추론 질문과 답을 생성
    - OpenImages 데이터셋을 사용해 자동 annotation 파이프라인 사용
    - 결과적으로,
        - Open Spatial Dataset (OSD)를 구축
            - <u>_**100만 이미지**_</u>
            - <u>_**500만개 region**_</u>
            - <u>_**800만개 템플릿 기반 qa**_</u>
            - <u>_**70만개 llm 기반 qa**_</u>
- 3.3. VLM 아키텍쳐

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6C64YP2%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIC1Y1hmncmg55AyJr9czKH5ZRJpfrqciO2VDJERkEOqvAiBdVTwINWLYRQ6Hfxo0um9rOdwOzC9M1AvoA%2BIA1Lesgyr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIM7Ne0i1FlpCMeyOqVKtwDxnVx0%2BtvX1tIbB%2B4o1zvps5yuTQE%2FeCPTAeCZpEbT5VF0AUlgAq2PXdTeCJuOu%2FWUBEAsn8DRS9iaBYbsoyX8IoFqK67a%2Bh0BYWpUy8Cf8APQGa9AJ05sbKuNgjn06hAYGRH9SkQNyalCqalohJ2uBJAMakxl7gmIa%2BnP99KZ51pbxHc0alGY2jJFs9w6Xu%2Fnf60JGH0T0NlmlZrW4raKLHP43sdLxFl%2FeNjqGTkIjePl7sY8cnYkH7YDd333lLspt5rQcuIrcVq1C%2FAKgJqj2bX8RL7Q1udJ2am6ZeGYfgUsZNmlWn%2BIdiFYqQRrhQGwbss563dG651H4ElMxsCtPG77Ut0N2rTxBV1%2Fqq4arQx61rEPyTVSywprf4wq5oWSUexiismEEhhjSIhIaf7f%2FfC76RIUosecUDSwsp8sxyI%2BkaDPWc2Hct9AckVL04B1FM8NCU33j26qcpDdrkt7Y4DTvH4eFT3%2F7HXgjrSQ03UHp2g3KIgxydtE3votvcD38yyZiiFlQ1lsN6R65AF9dniUnkxwtssw4gZO9Id0X6Ve0w6INjxXNgOI0h0vTqHjFnLmIUqpiyT3eo9FlEtBnJbyfSiflPSs%2B9JQuPaNa2u6iuCed41FCmK0wYwvYSE0QY6pgGmXWPcsgwmG58QwtwTMvibJykRO9Hlr%2FknEAWFvoShZve78tMQ64aS1HrVJvBOo4DsnPNfZ2nkXFJ8wyrw9UzKCOU%2FYbjpOaDx7MXaYtRAZBSCjXhHa2MzDTA%2Fx5JzVA6YCbZAXF6szcF15ZmpNL7yPnxsPoROqvuz%2FssGIR6IvdIr56QraGCoEszQhCSANXzyvXx4An6ShgHjybsmSX%2FDGUvqipY%2F&X-Amz-Signature=f44c24079a9bcaa92e3daa847f4908dbe815051c168571df89594ec2de2536f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 구성
        - visual encoder
        - region-feature extractor: region-level 임베딩
        - linear connector: 멀티모달 임베딩 → 단어 임베딩 projection
        - LLM: llama2-7b 기반
    - **상대적인 depth 입력을 위한 플러그인 모듈**
        - rgb만 사용하는 vlm은 3d 인지 작업에 한계가 있고, 3d 데이터를 직접 사용하는건 스케일 및 데이터 다양성 문제로 어려움
        - 이를 해결하기 위해 기존 모델로부터 얻을 수 있는 relative depth를 rgb와 함께 입력으로 사용함
        - 목적은 <u>_**depth를 통해 기하학적 추론 능력을 유도**_</u>하는 것
        - depth 정보를 자연스럽게 통합하는 추가 모듈 설계
            1. depth map도 동일한 이미지 인코더로 피처 맵 생성
            2. depth 전용 connector를 통해 언어 공간으로 projcetion
            - 이 connector는 spatial QA에 대해서만 학습
        - Depth 정보 유/무 모든 케이스에 동작 (없어도 동작, 있으면 성능 향상)
    - 토큰화 및 프롬프트 구조
        - 멀티턴 대화형태 데이터
        - 입력: <image> + text + <region> + <depth>
- 3.4. 학습 및 추론
    - 학습은 3단계
        1. coonector feature 정렬
            - CC3M 이미지-캡션 데이터
            - RGB connector
        2. visual language 사전학습
            - MMC4, COYO - 대규모 비전언어 데이터, region 이해 데이터, OSD (본문) 데이터
            - llm, connector
        3. visual instruction tuning (최종 추론 학습)
            - vlm 전체 finetuning
            - instruction tuning 데이터, region-level instruction 데이터, OSD 데이터
    - region-level 데이터와 OSD를 학습할때는 각 샘플마다 box, mask 등 서로 다른 입력 형태를 랜덤으로 선택 → 모델이 다양한 입력 형태에 대응할 수 있도록 함
    - 추론 시 spatialRGPT는 box, mask 입력을 모두 사용할 수 있음
    - 본 연구의 실험에서는 seg가 존재하면 mask, 아니면 bbox를 입력으로 받아 SAM을 사용해 마스크를 생성한 뒤 사용함

## Experiments

- spatialRGPT를 3 측면에서 평가함: 공간 추론 벤치마크, 일반 vl 벤치마크, 실시간 응용
- 4.1.  3D 공간 추론 벤치마크
    - 현재 공간 추론에 대한 벤치마크 X
    - spatialVLM이 벤치마크 만들었는데 공개 x
    - **SpatialRGPT-Bench**라는 자체 벤치마크 제안
        - 도시 환경, 실내 환경, 시뮬레이션 환경의 데이터 포함
        - 다양한 객체, 환경 포함
        - Omni3D에서 제공하는 3d cuboid annotation 활용해서 동일한 카메라 좌표계로 정렬
        - 이 정보를 바탕으로 대화 형태의 spatial VQA 벤치마크를 구성함
    - 벤치마크
        - 정성적 QA 657개
        - 정량적 QA 749개
        - 클래스 88개
    - 베이스라인 모델
        - Blind llm (언어만 사용): 질문 텍스트만으로 답변, gpt-4
        - vlm + language 참조: gpt4v, llama-v1.6-34b
        - region-aware vlm: gpt-4v + SoM, LLaVA + SoM, KOSMOS-2, RegionVILA
    - 평가방식
        - 정성적 QA: GPT-4가 정답과 일치 여부를 0/1로 평가
        - 정량적 QA: 미터로 단위를 통일해서 정확도를 +- 25%이내의 오차를 두고 계산
            - absolute relative error 계산

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WFO7NZ4A%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBLOzWJb56JwAv%2FunZMA0CJugA%2BTB5Rjg8GmaIRNv%2FWUAiBxzxp1OyZcPxYwAAk46YO7P2tAYx2b1n6TnVU3UVb8yyr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIMi2S1xBekLCHZrP%2BlKtwDoH2xbW%2FyVd2IRz2X9dShx6FSph0XAdEf6y22HRWKWmQ8Z8YeEXavrN%2FP93fh4SL9Bl5LRLQToS%2FJHAWgEt70S6PiqnjbwdfEp3u2dM5lKN%2Bq6okqA8QnsEKeldR4vLooSgFD5l1GBrKLfYRbyInVIaBK2WryJ6eq7vMnPPX9FfbZUtkODEUv8nyJ1tau5VyDdqSdlPmC1OlfR5RAId66IOEoudPM0WX96HflB9jDQCfJ1ArBi036SZirAOXoP%2Fn6enFp3u0D8mEMXhKE8vSmStiIpoZXBsB%2BfhktDRkawVFfJjtF%2FwQ2TsE76f9minPHo99O4UX9ndg491MeCNHLW%2FxPDIs0tfNbNxUJYHn%2BCMtQRxi%2FQVnc%2BPFkgDSSa61iDrwq%2BPUvpOdM3MI1XLRb6jVG6g6zJPe2AOwp7UlTRl5U9uTzdApI1LPmQDav6F5vtEfaXO4yaD8l74GtqFTuqTaVkdwA73D1VxV2sADrrRu4vMJO0SpN8KCVbk0QGb7lwd8Hbd8xVvNqE4MNwMuZ%2F%2Fz6lRID3ze3tykKFiNvxvH%2FY19YeX8CGd66OYClghRNuu0TPPHA9B%2BCiuv6V9x4QBamsR4%2FJ5tajF7aphRft7DVZTmQOc8UnU4QoQEw54KE0QY6pgFOFBfO06EvhiRiKZxgXIYDjuxOL%2FgcmJzQ6rxk0mwdRjFkNOn6dvxFqen2uoRTDEVcl1SKnYMtC6B57wY8uRBbqptaiJv%2FVLRX4qe4C7iW3KdjWXjmA%2FzReudTSZzSTdwCp3d5D0JE0iN1WPuIhz0NHT%2BGq4rI9lYLVgJCfQ%2FuRPCeTY%2FysIN1GcxVPV5tam%2BXxD6weD1fdjo%2BY1Lz1v0UBBbGTA1d&X-Amz-Signature=9d0f16853fbddba0fdd0d4419fb5cb8d789a8188b36c81c682cab4732f032537&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665LEDMSNS%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGes3TI2fisodJPXk8ImCSyOpTsq7IaQFn9ZnkrlaTU9AiAs98uuQgfeBlROEiNWpbE412RSgJErI8I202QX1SAUkSr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIM3JKdDyrEWQf8D%2BAaKtwDgL6PCoA7o5odyLdLaVBrzxb6eI5UtcDGJEINy4pbfLC34fI7%2FxqTRp6fiZ%2BNgPDJ26dJBSfhjt0apFEy4mjbd7DvWQA5IaVqTE0c2Pe8dFxM2QhdFkZwefguU9OvenhoAyYBO%2BfsptT68upEJQ9W0pl0kmkuJQl5SZ8mG%2BE0W6DHdKlw7dOKMQzEtRrnTgo%2B698cRsC7NJd8CFDBY%2FLLDrHuDVMPgilEFdFvhDLIn7YNteHxXzGlBng3eYkD%2BsDqIkKJgyps7x2diiCADgxXIJDfns9nqTmHAb2N3Q3JSof5N4XaY4DmjXRgSftOZJOFnbJBk5JbJNej1XmVrhMT9BJzlacKcf5HXILeetBH4CBY3dr%2FJ5xAehgm2HbmhGk7uXf6cXTq3Vjk23MPeIMitIOE5Ko%2BpLBnd3iruVVTl4MqkI5dbV7leZxnqsjI6sei%2FHr6xi3o%2BcLhX30H3YmzMJqRQCxL4Web5qZNKDfwtaR%2BdReqwNVLX5iP4xyE460yRzthUWXdMJBqkc%2B7I9ibkD9lYe8NW%2BQf6mcl9nJ2%2BwRX2IF1w3g2pCXAMpE6CdKrfN9T6zEAcK7kxaJsAbR1wkF5P4q%2BYx2KhBS9Iu%2Be7eTw5jLqHwoYdXY4Zqswu4OE0QY6pgH8Q%2BflrCYJnE3vh1U%2F8BlMsgPViNoBQ3JhUhdYm5Jsp%2BlZrmDZ3cTMCs1Pq0O%2BFZsO2ed7w2acqqrboDtXPgFUQTItlz0%2FtoDn0k6anSUgEVd90p77F9AVq%2BFmqbs7BTdUBM7OhSX0%2BCfnFDjtnd45rK7rzvk30M4vTqc3VgWMaX%2FByKLdTUE6NJnJeexNCyXu%2FV3hotmfl%2FufWKhID3ceJ0SP%2FiTD&X-Amz-Signature=70be148ad89c0fd7c5104100edc87b52d67c60020055467ca67132fcb6ac2db0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665WJKCJKF%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD07C8CHPF7s8%2FMIQdz2qUBBh%2FCTGt%2Fp%2FGIOERLoNQaoQIgFdgOeIm9VswR9v6059JyzbK1CwqZgLsfGWGXiIOnDRkq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDCvOcg1iH7MP01E%2FzyrcA6SLi7WbDa147IK5qiR6tAQF46cdFf%2Fd7TqiPIQuN%2BFhGtJsqF4pCR7n5G7iuYRovMK0FylJpOpguraNpudZzSLYnp21IkHbd14fdIEh5exU8Z40F8In6n2SR6%2FdGsnkt%2Fp%2FadKCOAKlPwJ52GFfFVijzSu0tzA1yZQffRGgHGi2FSa7x170gltNoYO%2FqNqO7Q%2FAEi1GPgN8TUmO8tAIOH%2FP1z9vy8Q0E0JyY8Bfi0ZOg4kfk6avgqHbDQJvBTrC99Dn2K%2BnQA0f6jgnNVj7%2Fxl2sJtxtVom1XaiivyAYW2tctWi1F1QEGlhkMhA8ZC1I4MAsPyCwxccP7Ip67rExJOuhTP6dgeR6UPZnPPANNiI6yEh2GlFM3KOnG4RvQDLPKAA0oeui4ZgB48HPkoVFE5%2BR6bfGCEbJQA%2F1%2BVzNVlUwiyggealEW1nonzkc1G5sRmFMp7srNv4CDip1V%2F%2FogapUtROKRLiM%2BdyblVFYgDTkA8BvBzhfYHWdkXsRg4fXLt8OuOkyaUyJQMTN6gRINE95bsmb0rlz5LC8O%2FgB7aWB0GwGewxy1RG4KU4Jqpc6KvkvEAP4bw%2BOwNdMwzfnJ77M5DGVvAlS7EbQ6bd7TEvw6WYtR9ySaOt5xIQMNODhNEGOqUB38ADcN7wXk3tcGsT%2BfntPzpPC0ZEvo4BELe3aLfSVYy6nsvnb4cZfwB676i45OsX0LOZcr5cx9RX5yIuz6MyFteIvkOwQlu1SF3e74IlcbPScTO4UBkkU0yu03SIkjN6%2BrEZgenhf6OELfW%2F5CnRGFpP2oG8DoohJedLf%2BHVJHTO%2Fx%2FxG9f2AU7Vm4DiZCwB%2F6FzHr3wHt%2Fcsk1BS7iOLk%2B%2Bk%2FDD&X-Amz-Signature=512c40a9ce1bbef35c7a6f00171ace9b42b9565cc8628ed55d9da308da7a3f53&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWJCXKMG%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050334Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBB0KEM4mrRtDjfPkc7f5KHAmbBs5eJhBmvYmrxShsEYAiEAqvrxas9O%2BtQ9X2j91%2BgHlZKFWyUxubqZHF13OjkVsngq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDJC0pCNtPPbwmAJS3CrcA62nsOk2k%2Be1yX0iKXFySo9qWe%2BvDB%2BglVZilzwSHMG44byp5ZedP99meQKa%2FVvHZS8N%2BZeF1npd7JVp%2BQMyYJeJoawMnh%2F751Ci3ruJOQqlgOpONbpu%2Bfto0NoxwF1rdrTzPvHC9YZGRgz8w8lCAhhmYimghpOlZiGTlOCFv%2FL%2B%2FrZuS6hYSKEeUTEj%2BaSYmPmqHaGy8tlwEai9RZuiSrDddUXm9DOcSuYvVh%2FvWI%2BDzSngVXxr%2Fk%2FTwb5mU9DRGsm3e%2BMaqRm%2FGZupWUz53ky%2BgjkQqQaME9sqW9c4GdXJkMo%2B%2B9Vscu7prmLF0nuGZEKHFc%2FFhYt6essl8QctN6JEj10k2uQNEwHljTa2mt8vSZTgT7aPW3PGdnGfUzUFI120r4tZQvwznHx9cZ24U3%2FJUByXq92jnyz0vmm5RTFygLFcaZPS3l3k72eK7kSNK1iHJLhWNZpcz%2B6Asn%2FbxXL1I7pedEVNprefjCOBI9%2FSFJs6OgJ2aBZ4pEcUK86CFvH4ArfxlNRBR8ROSvgG9IOEzw30FKFr3cZmRsuWFAZrfb6TPAd8PBF97HhRnVAoBmMWCK9imBzUZp8ur0adF8tZv5TYvAXpPEN7t1O3taAaPd7NGgA3tFduJj8uMNiChNEGOqUB2EZNgrIdXlzauL1Ai2SFa5Nl5k%2BXQllijJAL0DlWebu0bFAw67USJjOaqfEYWhdGcDWY3WA%2FBBupJJcQBo%2BNYS1E48qjUKr4%2BnS4S%2FHJM0VLHH3EAhqm4n9ifKfq6yjWHT1eoTIKV4Aj1BsomrrDH%2FxuYDMlKYHPx7y6ymMpA3nK4fGfSaSTNW1VeW3SvpCBrRpOEchpRZ7lEPN7XhLRn95kdpzn&X-Amz-Signature=7bb5774c3608e7c8c33513b433a2a8d28c0194e2c47f5d3b27b5b6446f72dcc4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5KTV55V%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050334Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDW5TNPY5wRF5fqfZHmjtpYsRR7nodhlDDx3jGfKhbO0gIhAOxmmDFT6tJuOEPFA%2Bz53GAV47v9ycSzmhdgKH%2B2ANz%2FKv8DCE4QABoMNjM3NDIzMTgzODA1IgwZw4X9OnaUT4ALHEwq3APbG0mpKHT7KY6L01%2B7XdAxAnqYXnrjg8AP9xwDD6IhUaUsyybImRUz%2FrXVDt2hviwaJc02L9AkK1Y%2F3h2HP81hNvDr5vg43OoCdVEWPTuM3C%2F73WlbQaGtgwgfmopqRj8zQRPZIef713KziiT%2BUG6SzxBYTkeOQDD4ABZEZBjlofTtz1VfEw5uMtE1G77iAJ1sSjuGNqrU8dMJXvg9eIizupE7vZXX83nUa9bvbkGgpPCvptMOUgFjC6DQLqYp490HDvOGN%2F1G%2FyznYgYM3xOhevzk5TX9%2BwSlhcBCgCxkSsKwHDQnGFaI92xqnJ0XUIQiWhIFvTiNqxZN3ghSQubmM5KC3nlMEWskSYmwFuQOpkMRXKy82b85BRmHtxkh8L81Uh4xkdmTvH3hXC5Q6Uh8p4Ty0S2AhMbpEI%2Fog%2BBxUDGoPH3Nftvc8IuxK9JH7HjktLFmOjavesL3iJncIBVVE1tIOtnqUi%2FfqqY0vsj3viWS0begbyeVLPlxYq6%2B1XVmJaQIJuhhWWouZ0Si0%2FgqbRmgrPs%2Bh%2FhS6lYCYIvrYIprt5SL6Kk9P%2FbBTd3BEhZ3jda5RGGVnE9Y%2Bho31dHUnvIoWFbWw%2FsWb2IVL3gcdQIMyhseB3xgUVOkGjC2goTRBjqkARLEk57DgE4bnWDlF4Mm2zA9MLrplbbyjUQbFhe%2BkzO1HMDawO0xuOY63y6LmpGQsjcMFsF8RqOfnVdRoSVuKlZd11K60bBlvPQFXvWD9bSAQtDmASD3x9GHTHXJl5llljV3qGEPG8J6wPyAh%2FLaqt4TI0gxzTAOlmSms9%2BaWyYNzhplDP8i5ssrawMI5ZdPHBRsQJRkMxp34UisEKdUwCqBMOJx&X-Amz-Signature=208a4d54b79a2fd90fb7f10862f720706ec9d5fa7230b8a28633288bff7cf098&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667FOJAUQ5%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHlhbszUgUQvUtNml29maaC5Hvn1LYys%2BRXZN67BZyetAiBQ5C2CBG74roOnlp89L5V3dmK4mIAUmURHY7jHfHHtNyr%2FAwhOEAAaDDYzNzQyMzE4MzgwNSIMT5Ixtz9C6A4fXNlKKtwD%2BobBwddZNkmMQTiB240p06DyqLR08fHNR2CuthM9P3EnZWmR8eI2fXG8lK%2BNziAQlkp4n%2B%2Fg43Sl2GETp042VVRE1DV%2BOgFg20u8OGAW5pSId7AAP7BDZ4CYTQEqrZZGC5xyR1xafypck4AaQWFs3qDv0VlXWOgDyyv0km4L4HTElWmWSQfevwdW%2FDcNYdJfEpe7v5JNnWWvZ5Rw17VRWW7NlNgG%2FJ68toNY2k5xksPXtT5iuTjNn4Tj2PcEZP2sJ7dBjKwZMfVKPYUSlWvYMPUdbMklhn5rU7MYspkr0OI5gFbrPeKsRnP%2FWPw0s9uO4l1Dz1XAZbABSTPyeWkv69afWM8X8bxMxmhWXJYf1YWM5LIGEHtCpt%2FwmhnBV8tabE4YmrSS7m71QQMNlQrQZKfMGNsfKRQIk%2BHbrPaLxMeUqIr2DtfGrF%2Fy35cQC6kYU8UvhOw%2BquVD6TiOyZfORH%2FNT%2BTdNGs2jTgZgn2VzxihWeOH8s2y25eQafr7864hlCoD9D8R6ZCCmIBFHQ%2B1qxPwLPhSIOzT95cfZapCV5ViZz27C9E%2Fo829pEQRJdZB9%2BHFxWXivaoXLfHdiVqLeBQO6GuMTnu0uTkN0yMjIXE0SiqacRah3iYXnbcw5oOE0QY6pgEmjYhxPh1fxL919RpVs8c81wKmq82I5TsCuMKr6JT2SMkIj0u69UAP3cgA39xeJ9WHkJXPL47kT5L74Gsaq9q%2BHKfya%2BL6LGt79wjzvnODWiPi2rQpmgovJnNuNqLsYNlt3QwQpYr69Xz1hcHqOVgzVsY87aXtG9F5H%2FvjCH937nsNPUDjkoqQdtGRBJVUs1HNrTfI5yFNrYzVQGH5abOs1RTRtOXy&X-Amz-Signature=3ccc2043192ae96212ccf27ce0873b04d28b5a4ba1772982b1deeeacd93996a4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666VBKC5L4%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050335Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC0c5msqwTBQaQMiOKRaSihDpOYPmtuSwG8TpERIrPw0QIgFKWEQYN%2FW4954Ttfcv5fC5USydACjenux8BBGsAHBd8q%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDJbY6a3QyQoiVKglaircA9TCNw7zecMR%2BovDluMVoMDou5ROUKN7ti7LQ7g4PYjZNeGNQcZ%2FmJgR%2BEUPBFbcKJ4MroAOQ1fJ0uhImWCGni37hhfs77d91gkmof0%2BBUx374IWoohlzF6r7JCxXi9fuOGRxdSHU1%2B0DkpE8DFp8jCWe%2Bn%2Bwea16LAMiaC%2FbPKgrmaav8bUqpFutmKWofQBt26pBplI0bCBW2v9rcUcanD585EmzuUmDkn8XoKCQgHEGFPi8wsaNZ3I8MyTiWRo1YwcHZ0rLIWleTT8qSV%2BjfzonwER4uArl%2F%2FLznRfBPEpMd1oHQAkIE%2BKgMasH6ThOmif%2FGxM7VdPNW44hH0Rf1yK7atafeVQ0GKkEy0SRihnMyHNBoRk2a75C1HrP0lfexqBLGIKENQpZYu4bIdIR9Vd279bp2EGh8kBXTR%2B%2FJRmy8m1YXrCG733lNhuMBrIZ8qjVXT86HcCrdUgL5k90XKKoJJzgsDmXuRNe5uwOxKFJmylp4jkOut%2BIjqWcDKapaYyzdG4PjGyO%2FJkvj4VYSzCz68C9cVL4uIaW4u%2Br0lwst1BtJUgKNkw6%2BPfKMTcUXIDonqiBUix7ZeM%2FERVDpx2QiJV9vjsei7bT3NtXWiOwKQxJAi2Am1k%2FpadMOiDhNEGOqUBtat62zoo%2FtoQVB0TxUIkUY1z18a6sKVrOFgFuRRdGGrL7TxteEJ9zu6AcllNXl7hdWBEAjzLVMjTbxbErXukLcyEbMQ91acnH5MCGZe1Hq9gyIG0iH4xMBjKWKmF5KLVXz8jL7xmtNpN5AmJ7uFmyHAISGDn0PsOjlzlCKRmUaUMBhFMp9aJWP6RYQuyDRHgqtTNMfs7rtVZu3vPuBS2rv%2FYHG6S&X-Amz-Signature=effb65c079025183be0efa6e2fbb95a88e153eb94b737c31fffd952f97109ef9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT가 region 기반으로 정밀한 reward를 생성할 수 있으며, 언어 기반 방식보다 더 정확하고 효율적인 접근임을 보여줌

    ## Discussion

    - 결론
        - VLM의 공간 추론 능력을 향상시키기 위한 새로운 프레임워크인 SpatialRGPT를 제안함
        - **region representation 모듈**과 **depth 정보를 위한 유연한 플러그인** 통합 → SpatialRGPT는 <u>**vlm이 지역 수준과 전역 수준 모두에서 공간 구조를 효과적으로 인식 가능하게 함**</u>
        - 데이터 구축 파이프라인을 통해 **장면 그래프로부터 3d 공간 지식을 학습 가능하게 함**
        - SpatialRGPT-Bench를 통해 다양한 환경에서 공간 인지 능력을 평가할 수 잇는 종합적인 벤치마크를 제공
    - 한계
        - AABB를 사용한다는 점 → Axis aligned bounding box
            - 객체 실제 형태를 정확하게 반영하지 못해 라벨 정확도가 떨어질 수 있음
        - 정확한 대안은 oriented bounding box (OBB)
            - 이는 정밀한 자세 추정이 필요하고, open world에서는 여전히 어려운 문제임
        - 또는 사람이 직접 라벨링 → 많은 비용이 필요함
        - future work로 남음

         

