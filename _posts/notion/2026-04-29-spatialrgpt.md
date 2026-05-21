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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QC3RSZN2%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044227Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIF3wSqYa3JJl1D%2F5JTXgj2kgLa9X2PH6sbYeacbflNuuAiA0nQsxHF5uHc3JlM6D72qq2cP6We7Lfzr%2BiQum1xnoqiqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKt08Kgy3X%2BAFj4YkKtwDsyHmqxxi15kFLrZCdiDJFJQCOCd9jcV0Rj02h3MfFAX0A5y6ISQ4LgFXaFIuYHXdTAL6KgNs%2F8ADnkWJrlempanenZbEntaVzs7gd9t51DCkTVpnjJoJjCRbC5pIX7ctSJjt1P2cHtlhgLNSaPab%2FZTiEevmP%2BOMyXrsX11pscR2xgBnGJGM4mI52qWc3OiBLCD1QO9BecvulZAEhL%2FY%2FNSE4WRUJ%2FUJwpvnWMOAi14aY9pxrJYrAsuo55QIIRAmb1lFagGx49rkKTynM%2FMOfQuOLwvF7vo%2FI49owPdnlAy96zsoIUV1CO1JWBnGCURHdk7gVvBg74NPoo1LXQ5E9az7YV6S0SfELtPNzxb076Iii0HGbyWNLcXFrh%2FfNfczqaZHwHlXWKgWYcw28PtMch7nLFRRUesJ99NA9tvVKyXV4NrbWY7SupfrFsCkHGmxREtUOaaTCyKHIwAPsSNl7%2FZrBlKIQ3ruZ26iBiIUKIjyEXnsTHmsolLyFkHkcwvoTVh1p4QuFLjKEPoFMOSkqeEtvq9v0pU26ffntENXu8Pmz3%2F3rI3PIt9hr7LUD7EwK6E%2FVu9SrjXlAZuzP0y2V6l9IIl0mhcLirb%2BnYr7%2BxHmnJrSoBNhiNo5ZZww5OK50AY6pgGJc7bR9c5m%2FyDH4Ty1o%2B2lr55IRshW%2B1Gt3K840vAp%2FcE5ZthK2JcNit7wseweq3OjnVopcd6kfB%2B3dy5t%2BmqBuzGK5VwCGfrwUCKEYyq6wDk4pfHPgIu4SAwadW5eo9B6udplCgziUqA59hWxpugBbeTYC8CuacqNc1Hq%2Ftb7PFM060Qy8%2BIoBiMEb0N1%2FMM1j9UGUZFFCBoq9bDfAhfv1qV3kozR&X-Amz-Signature=42dd06a4e03e85a111208252bb22c3a5f1e4def21d3d122825f47269fa8394b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YQAPWTOF%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044231Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDQaCXVzLXdlc3QtMiJIMEYCIQC0iC2uZqloJH1E2DgZWH4X2Ir0c58cDCEayTXm78GywQIhAI339qZaV9NLGxmIy%2Fx9kRMMeW6h3%2FpTG86VHTcLsoTEKogECP3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxl2V72e04qGzbHwCIq3ANJXAZH9jOzx47rZm0acQ00AMoWxj2cuZxz4YLe1BVxpnBbNkeqFXx7K13hVt81Tv%2FMkcumOrUEsUduu%2BPTSEHp08xZI%2FPtHCh%2FEAckEGip%2B6n%2BtFEq%2FyUv26q1HbaimdcgG%2BSKKd6uiCvDtrjwZmEO69ja%2BnKJuXjCa2Mv%2FnNBTw9grLAE2%2BKmnyXOoqxahzZUm6geBIw9MkMuhudJX4HA%2BJhG%2BqXu0VwEeChmRxmRoeemUAsOzNZpzUUtT9jE4MONAqP5XBT%2FqXB3MP%2BeTHmme3ybs7riMxBm3X886fyOzXoo5Z%2BLUvgPZVic7U5KEaSBayFUe%2BUdqhOVUn8Nyu1GQbo70VgfsPqUcuwZ%2BbUqgMnerPHOuMgQDIlt5igbnKefbeJNlrcS4Advt%2B8mxsLnBkWJzo7K3CWDCxlkC1YI%2FEMpSJ7BL8N5U%2FwOHIXS16ut4g8J2SjgZfOEDiJoLSaZHV7n83ZE9HurOoMggmiCgGb5GwHysJ6yxTPU45WeuEEE8wlBZf45Bg3MgTm02IhB6i0uWTHyJiHp8K5Ybu9d0dLDRO2MTMmNTuq8LvhyyC6tkdjPQC5N%2BXHpHBtp8L8xefaLCE96fI7XeK%2BVto02jURxD1tlKd6R%2FRoLlDD1i7rQBjqkAb22lTa2Y2TPGeX%2BNNOPYsJD079pZ7VMJcOjVIWIZr6oWgl7HNGMNEC1OSR6r99%2Byo1%2BBD14iyrF0tYJqZlziRpj6PfGwqQGKImL6ln55EXVrjEEJui1BNEIJKy8fPSeS0LQXrytDg0moO3hV4w2aZfWMrFSnwG%2B0GkTbx9cJDMBe4%2BZBd4JoCSIYp0%2BhRyZiKUVN8nRfLClHVJYwGnjF3iQ%2B3Tj&X-Amz-Signature=db051eea2a03a6bff184bac97302ca19c0753f180029c1b61fd23fab6866e0bf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4RP2NKZ%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044234Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIFVzKcLow6IMPDzWgTbWdO5uWmYPVXTvr6a%2FzOHuE8gUAiEAk3rrMoTueAWtDq4uDUOtVltdhwiC3umIraZDo%2FwG8YcqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEDWBl1qEAYyyw96wSrcA%2F80hKYTf3cCMTmIyprNj2Mgx4Sy89YNTo0nsiYKoiWm41uTXgz3trrg98jJplmpUHf4a2xJvSAV%2BvA09PjGM48EknPfdVKEvFYAibNsci17Oe%2B13iwGNEQOhtOLuhfTYg8CKOhnpkj9nU%2BlKfLMxm35f%2BuvmTtXBahxVlhr82t%2B6O4QvHRWp9dRxLr79zDpQdB%2BrUw2MvIHYmxx7FHCw7yVk%2Bfx4MTHRt142ffGN4dOF1OTuCqSLob8aVpBHgdlFKuMrSIxLm7syYOrdQTuLQfM1ak7JheiTZM%2BF1N0g2N%2BHWiljLoD2LfHKaoDPkSE%2FUwd2kPUwkB14IZM5ziZBq7CNHpgJUA2FyZ4QG82l%2BVcMLnRJ%2FdJwf9bLJadQlwW53APwcRbvxOxT0OT0BVdd1CkhzLtwQmF%2F%2FVPjSZK6%2Fe0sUNvVGuCqz0cjBQsb78rH6RKDGGR3UmoU5Pa%2F2tIIR%2FuMtXwAvOqAg2vhak187nxsCkTCu69tL6sP9UGVNPzLSG1CVAUSq7u1%2FqlrpQijw8ORO%2FEn5iBaUZ1FreccjaoXjgj4GMqvD3k9d8V3qBXnk7FlLVrX8tqO40GKf2L7o72D7D21m%2FSzMo2ozUayaEmAyA%2F%2B1hkIBGHj%2FcpMIviudAGOqUBv1%2Fx3bDKHR6BdYILPLMiFepA3%2FhzYvwItlFPltRIgZSPrjBuotZ2aB5HE5CxDk%2B3ylbo0nXcooicB1WVjlgPawp443w%2F5KqcDZTuUpLmtR0MTFK%2FCMxskWZS6dBCE8YJNYVfvIM3jMJvtRM0H5NiwtvilKMVJT0STgge41RuQHl8nS8VEwzE8XyKAu7I3CWhGfjaSOsyQRw2HOcrhHrcAQaiSSzE&X-Amz-Signature=fec4c04baf24e2db0b4b33ae8e62da8b704f236a047c34bf7ba45e55caec9024&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YFUHGLII%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044235Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQCCmTx2bdW81OqGvbvCHOQa%2BerenP%2BiQcPrHFgqJPdXFgIgVQZTDJn4h%2BlfVg%2BEX4JAOoXVl9fQH8EgQA4DzfFTsS8qiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNLqSuOQcQDbHyEuTCrcA6abhSLLzDTgdPgvBSFQNuRzSdtlo%2FHULa9TRaH9v6ZjIPJEuLlYebpuLpD%2FMqxOpKWhI7Mkl9paIDGN%2FFcOfPpYRKNPgsE0rOzl0V%2B%2BRdHZ6QwhUs5N4VDMHUkrntIdloCwJD%2BhwP%2FyNp43twXjP170uypk1RpIPvZR7iLvZpBEIL3mJ5d1n%2FMq1vt4AmUBgUAM%2Fy1hJKORingsmvk8LVmCjTx7KKneHGUZewMKUpLJ%2FsUE6PHOwGDREOv4T2DliW3ipG0tpPG7OI3Sslk5dc%2ByuPnDhofuSLuUQ23m2pxBEzK9q%2BuvjcgW1ZiFIQPGTWc4enzCnUTjZYOGM7bp%2BI4NLoH%2BzBkKO4y8Ijb380FQ0ByHlP1pHSi5K%2FjrNG2m3NxH2aVTbVzUx2MP55CStmxqUp0nG7dmV7zfGMJxMX7hv%2BfD2q4hK5vtQ%2FztXvZhdY%2FrNzfv1s9Ne7A7%2Fvf9L49uppTUXQ3fTiGUe%2FQqyZl3T712djveeyvj8j7%2FbDwVDqbGewhGzVvOXirncrucidW%2FmNduby0%2FwG3A44oyLmm%2F6FRVo9RrrlpbKMS7mb0v52QpCUH%2BZojdKRGja8T3TeqPakHPAobfFCShEOyVET8jRSso0nJJuqBZENNgMNzhudAGOqUBXvWYETQ4HAMULt402q%2ByWV0CrDEwpcCuaw10w8TaoSDwbLzzUu3lIxNIF39bMF0BaNcIK2shzxood0dm8UEDUAGnt2%2F4Us%2BUtF25B0Rnkr22Mdv5RLlyOvV3s8JLH3kpcCqyd1q3FjRtIjCn%2BLfrjKktFV3e9gbQ103QhA%2Fm2f8SGbn1JvVB8i4JzxeaNd4tHNlt6Z19eS%2F0ZFd347%2F8ot9kfsvp&X-Amz-Signature=7faa6ae0bdd26177bc172833f4d096046db70c031b507beea0818419fb399b25&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S3EMB6MQ%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044239Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIBvRu%2FqB9QKq8ofhbzzeZ8U7wNXsi5SQgEXLbq36tDO0AiAQ0X5o60rhxmga4b8hnB1Vk53loGq4YmOsZ01HpQrixCqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMyQLUk5rER5pFIhD8KtwDCF%2F3pheuwpPc0lajHyTL2TVKcecVWLwRLd2S2eW8b5btGlhK64FcX%2Fh2itxabx1Kgtwio1KFNAhaVt9MknWRYW3LhULLwBLhABNzaIxm2IWBVhkiZJNGqk2a2%2BlIoIerV%2F40SltAGv6cijHUTNwwCpUmaBATY6CBc2HzFo803BlIreW%2BSAMl8Gl0Lgmwp1cdy9t7FuSIjVLbDAykuhtMjKn8WuTb2y7LXi0ITPq8GbLU343d7AR9%2BADR4yP%2FqH57N0%2Bm%2Fz70HHcp61R6EPePoYbyceFhJb8U5yuMW63OzS9d4rKoE1QMCw5GSf65WcMBySQkZzGBvUjZ%2Bnxndylyu%2FijK%2BiinMBSDd1MgAjwycRFHTHZf8aZM8Ht3uTAlnVWu7rnWFkf8nlZosYOZ9Q5EHflfd4eg%2BPykV1TURqdF65yvGZHdYSZNkUFX9pE440l%2FPjdGfb%2FUggxorh2uS79MFm2gAj0fFjhnNdVGDUjhvv8e4gBeM5DR5sxW899DKD91UBn9t9RANuKcm3pNpQyK3PLlcaJjN7rLlHAD98FSoACwNELRI4g6MHsA5YmRgWXwZB%2F7Argw6yuRY%2BajXrw%2Bg5b7w4zPYxA9UsVdYG0CFytosIcEnwnqEhLaz4wteG50AY6pgF%2BgfugqVg8Oa%2BUyf0LW6QaDEIEJyeHrqtIoPYh8WW9bV89EyTXW2sTQwCeagDol4EFMFSV4sqJHK8Tr%2B3Q3zwLaQcvOXDDppwi0MVaM9%2B8WoERRrJg%2F9h6U6dj4JVpd0ov0XYxprcMOyIfR45%2FM4WfkgrRx9b2%2FS%2FaA7C1iyu9R9n5km09D5SV4SY456%2Fp8wm24XjBKQ1qVZ3NDhRnWZaXk7Sg9py8&X-Amz-Signature=7dc9fab8f534ca587f322caae3163fdda0bb6716be5ab270d00a2ef32897823a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QGCCZFFK%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDUaCXVzLXdlc3QtMiJGMEQCIB4lZzUBgjBAU4AEAo3HZWTcBsP8VmPuaDrI9RWJaNysAiAYrkvGItTjcydvgEUHo5jSZ9xribsA5%2BijzR%2BkLHuv7CqIBAj9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMqocYMlOx%2BEUlj24bKtwDIFcB9HSK%2FhAw%2Bjbb0UwjiiLLPS9%2FK0qjMwDBqLAycqQ22E0qS7Ols2gXhWgzewVdLEGJs9ZPxh6RsUlj21ZFKJ%2BXYKRbbW2uIR3y4KyyDUAyzkHY2DbBYqYJcZXYMhw2c%2Bpk%2Fhgv%2BdBV5OfhQw%2BoHOcccQq10cnGZyypXWI3q9ua5ZJkC880TViBQUrvGOXV1a57e%2Bnkh3E9mYKPu5J1Zqv59Il0OB5nPfK59zPgJcXHm1mZB2mMuf5mZuvZ5FGMJ6oaQhTeQixo0JQZ5aehzJ1V6IZCLvVqBzTahMFAlwqMVQvQrYCooUENFcvbjezRVLOtpKhBpaqyjaYeERgFaGMaDg6h0lcgOzNLDzvNfawvKQgmviNSGPF5YDLdCaWP9%2F1a5QuZsyDGNEJSBVeBjLoVrN7OgoenlBgOYlt%2Bd8qL08vljXQ5fzjuzqJ14T3lSznon5ChZ1bIPK5ntX%2Bmw53G4ETaJ7fu2DbPCoehChuCFjW0uvNGeRtklYnF82H3qSlym7bKFVvj3eHJ0pk9ak7CCmzlnB%2BOPhmz8x8taEJBSCWj4j93q96YCndYrNwoXXJdiL1dcX24yDbxEFGTXk0ZflzbFW1tPP0pQzyTtKgYCAGcDN%2BVPP69grIw85C60AY6pgEoEisrwXCnalKinO1FDG9AvW02o2dYNI1VCrU4osIFhlyGH1tls1yQep9RtuZKjkwkqURTAZ9vljslDlbDuY7gfohrupH3gd9xNwNOkiQlIlDBWPGvpAhUUWxM7MxWx1OTouW%2F7AIHiU8auwB4%2FcMLNL5uUGo2jTs5U9nXpKGGNaAtFp%2BMQ3lLfN0Zz6jehE0sUWv3sLp%2F2aUTK6BZboMwirRpXyzD&X-Amz-Signature=458ae6f2f2cda409cfba80d01027a638422ee2a3549d2c6377e8c1611026aa74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VCFAAPCL%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIEVnxdiRuRrRaX4SH9uNEvLEK9am0QP3cvtL3G0qRsCJAiAmJJD7ByeOXksG1z9fBmxKH3uz%2FC%2B9jBe10vDhGpOpuSqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMV4VeEu6j0B1I1xJoKtwDtjvMmV8m%2FOeSbP7zbptdRT4Z0jVXTWSv6ZsdtzGq5fOjj4RpB5q3SqmuUbAEfhLaiqkJ1qW%2BnnYEKgmvpmR82F3GBCCmdjDdz2VR9AuFnh%2F9jliWsGb3uWBt%2F3FM0jgPV2EFQYQxVtBMEo2iJ1IwCUDerhUr%2BggnOeIaLCS5ZrxfTol0CjdCernU%2FUP1wVFDk7Zi%2FZ6w0qKu7NQpuz6Zf6slOUwmwnh8MX64a8p5i7F0aJ1rk650D5LMd2oOT6k8JlOSwnsx9qBm2KzazBeFP3Z0sIvxamdKmDz0HiAne%2BI8pr0YdTX2gSmInIeetwq%2BvcibFqO3UnR%2BSOg68maZBJUL%2F6CAYhOTwgEkCq14JKz%2F63UgEbx2u%2Bkvy7z7SWeJ%2BVpsKbQU028iYiJY4LCf4qUaD17E6FxdBSnH2QTXY%2B44aiXbs7ck8n4Js9%2BW3uY0LOqHnvmnVLB4jcWeVAmyq5BjbWC7bJ3hEsjfrE2PSqX7hdxga2AYxNWKNepILhMCI4GdqOnbMB8KMlDaFDkFOy76duRkXyEflfFVC%2BgxaSsHbyeud3IaUubXluOFBBIQAUhYMKBSjXDyw6b3Opcw3LtPh33rNRBZ8KjJjFC2YrRLdr2HrGsiKTr4vl0w2%2BG50AY6pgHuH6BiXT4pjjPxwR8MowWaaCgpIfOYN1SyulEipyhYgGjJnTPdmh1a4ywinH%2F%2FLpj5hCZ5gehNJvhpPB475gaglH8qNU7bGwGwZ7BVJDP0WA4OfPeaaZ59E%2BwWReBBWZlZZjHxxW9F6dqSCVeFPchzVGtP%2B%2Bd%2BVyK5GfMq6BRlcEqf8QVzJOL%2BZTzzCVIVqCzrHvQeKm8uV%2BIa7XySzSNbd%2BG2RUM6&X-Amz-Signature=d05691292c55b3cec123025a874623c611d1c370d0efdf9411f41d97407da92b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4YOMYUS%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIEHjdBbrfOaVWCLdGLUSwr0TSZSeCZIZTMfoGEYoHdLFAiAN7gBZc9h9SeuufEyzMgJscj%2F%2FNlK4PhBZan402DfFuiqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMuy15zyorEMHQmNY2KtwDYIx5vRtCfqU8%2Bd7nQc%2BvuHtv9jahrAYUvySzi%2FmUR1eBJkqXc70EuWo%2FWuEuepE1H2KoWHPIVL%2FkpNDJzqgA%2FD3qiQ%2BC4RiDncdORO1guKQ7V1qR1fWmVgZgrcb5DNll7LwRYMOSlQbff4nizRcIJrbvLyL5fSn2MYM6C3OGhxR1oOJrmUPxN%2Bs0k5eUU1pzD9ZxzwY0JKP32pa2SDtaO2tHsDExanX9t0JMXePg2eFmQ2HONSZf5cbEW9ywrFK9OfjXuZSLUV7B7IL85Nw8fIn8rnSVjs5dpJtSdljB%2FYW15eS%2FJUgHmdU6NRTs0IYiqqucF%2F4N5TSs37Q2MFWn6SrVTweMPzq9LPcaz4Kg%2B0orVFnIR7q3LJpjbQjvrMw4xJ9IDV62wjiZj%2Brcdve8qFP5iWn4tAoX7nZj2RzfPxAibEiyvgB5IiSPstJZ2Am5SwPO%2FqN4gIB3WkaH29loUGUi2SeKiadYEfAQRzqnJYJGcmIBvWx0TBOdRyl1be4FDUA7iF%2BZhpOCeYe0egYbSXrkIjfbzl5viezz5U4UOOllWWNKVvJCPXHyscF01vZ9HK07A72lS8cuIdjcAwUXJHDqH%2Fjp58qPUu1uJCqsJ2SLW1gkkXmXfrF19Zgw8u%2B50AY6pgFX9Bpv7l03cRfBGfB1nDrVPtEGherIkTtYi85wL%2FCS75b5qq%2BV0aPYp%2BLqaT3vDfjcoULkN94EWuKK6QmjZZv75Aubqm9cQn1AVgqswEtYOdT2ZFYDWd2l3b%2B3qI0OqikNy9QHY4ZQLKRxIple22ANocRfh5b7D5d6aE%2F2CitjlW7AC1VbbfBNoIyngRlwsY6oym7eVxjbMCxPsaEtmL5%2By2BRLQtp&X-Amz-Signature=6a83d975238b77e6d327075f58d2f251b7d006158b4bd2c061664f8b34315efd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWY3KPA3%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDUaCXVzLXdlc3QtMiJGMEQCIGgKAJE%2BRiQbU2CJewM7g5aMsen7bBzcm%2FEIwCECaTVfAiAzIWyoMr6hR3th1DYwhbFSvZalDGddIhoWVLWHGCC75yqIBAj%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMVQ7e%2BXbVdBNPPRGaKtwDSjf8o06m%2FieiG31A%2BqkSRiwZCgygO7tNiY%2F2OLWXddI6ZHWFn%2F6IIJ%2FjYFmS1JYq8EBdBVvKRkZT3KQ6x%2B%2BGZcakHa4ivlBUQ0u0XPpclr%2FvapSniChQ9R7XVftDchnKFBRdsbwmL0hvOY%2FxhT%2FEIE8Yi5lv3bEuV%2F87PbSu%2FF4OY7f2TlKwuOiMADI97sofgZVeVohhNlyp9LHkWcHW%2Bs0ZIDj7PHwTvrx6CUnuLB83m12k9PiWPlRH873sHd1JoIeyNph5h1zDPBm%2B1jlIg7YnZHYQ1i445xORXsONjU%2FPAvHKMtojlEfu6MoUq85RFrgtuvp3FVQtBRWElJM9V2q4QzvERNmXwmIEY0vUO5Fo5Ag0iMjakkSWZYU0xddViVbvbshqrHocHUS3VqPL9jjBaAZY9h83tXXoUCwcoRFGsEJ5UjxYfHBIy8s325O1a0zMGHiqJhY2B%2BB5w%2FOVtHc7CuXit%2BxU0GmxaiA%2FwpHDn3e4Lz2gI7h4e7zX4lrc6QmPfQP8cJq1OivS8yZ415XXpopsckCC35Zj9AV09NTWTXWIAGKEkLTDdyzdDxMkMHmmD6UA5kfvJjuBKle2Ga9IWAjUw5%2BvEjc0BDkC2W4OoHJ%2FiGEX%2Fg%2BrmUwwv5W60AY6pgEOwsN8LKt2riciSfMvD4PI%2BaUQg4cpRxFff0JAz2b9bzXBHW%2BSbozMgl0cOwlptdo%2FwbbPE8HcyEwRsufVffSu11pjGdfq963WFQSIywqmfWvzgZl7sro1IMDdPaxs%2F80IsCTPzFjjH%2FjQbvVRD0H9VJtJTWBBIZKRDX5%2BvaUdcs%2BLvFHLi4RoTpmni%2FK%2FtUGTxtWwq1I0jirD930Yk4BY8TtI8ikb&X-Amz-Signature=a95dab3604785e2c8e23dab2cc9d9e348877a8d7a5f527e75e8d8fe33450e9d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C3L2C5V%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044243Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJIMEYCIQCbyMxTbYy5HcQvEMmZBQJn60Dw6njZTITKwKhrO5XIxQIhAKboN8NTWaqvE09BRfhqEtgYxU51OE3eICXfIBv0LEBxKogECPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igznc3a%2BDBS2Hg%2FuTUgq3AMIWweM7k%2FOzySHJq%2BVFD92pCZB5QxvHS0NSkrTGnwe1FAp%2BmvryYFJdqu89AegJrciI7v9a7Onn7RLC6mXAKZd2WqBuJKNOetx5HdiXzxuHEqXzRtTauC4a%2BeK6Mo1HuhH907ulLw9bK2RpCWYqmIMQruczadHAgh2C%2F1nAqM0sCiyoyIXh4D0DKdvil48jClgBiLiJZf1UGuWWJOXnBoBJcpdJq1RFlu2AQnIATakprI2V7IlSFYppYhdnnjfUsQL8PzMys5z6LIYEHqbQhbhWuSNQw4PxGPVEQcxMTMjYBHvf%2BoUJ6qjrcRQyHckQzr4o0Ir2X5GLqWT1xUJGYI0QfPSvhc%2FWj0FnVaGqFXI5hVvAFGPLgAKEKb2hEvOuUD6Gau6lA9DwzIqrhOD9H7nhnrDE3B345fuE8%2BmG%2BBCCZQFRyzQoU7%2B2HO7enReUwdDuHuiK4DUGIxKNUs%2B1dwbroMPQKJWmvHC1WsEhHUoQ9y9JBkv7IFXZ9x5Hocv%2FM9p9ljqQMFpFlxCfPlqgfhGsSxjUT68Q7EE9UvvXQCP0PL9Q7hKJEuBIz8mNisR0oV85dRcgAJoR2vg0PBO%2FBmoJ8wCYXJ%2F%2F%2BH5NP97FBqiLgQ3jMTpcjtKZDsLVTCq47nQBjqkAYP032Vm39E826zpP%2Fmw3HRsmRRMloQzfNizsW99g%2B2nn8CHeyY4poZHz3sQVq6YXtAjN8zBPkyMYCro6H12zSKIfFgt0TWVGOU6T2mUSWDIMMd5aLfRE7mATj1xYdxFHLmdgpq5zmTZJzgC53zPM4%2F8ic1s0WMdcFzSR65%2BhrlHjJl4v5blTebJlzcPce1n%2BYhlY7xS4%2F4amCVdGh88g17l%2BzPh&X-Amz-Signature=26c9b3b6eafc84c603b36850abac35eeb314c13dded6851d35fbc03323dce47b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QI7RRWEO%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044243Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJIMEYCIQC0Z5lMXBq8ryLYR1mdbXmWN77g5G5W9j%2BaxWTyEQr1GAIhAJs%2Fr5d4jFYHi9OXjM4%2FWR%2BysUqjAAKr3wE7XCPsm5O7KogECPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzUv%2BNdQk5K3eqKG%2F4q3AOGMhLRntxPhz2Ij9uFF9%2FSluS1wcivB9MoUv9kuvT51KwcRlNGVILc38wYhLikxNASfoowr84hKWG3CX5LdZ523rWJWKcX%2FXtWb%2FkULkU%2FKhaT6hzeP8cL90gh9QhSp%2FsFT7CZgdBKYir5fnCXaR%2FjaZWRRa75PqSGGgj4NstImWqZ9TI0DuEs%2FNjb%2BPUedKJsrBTIKwAN2LlfoRKcjRVh2IDImIc7rS3ddbE1Hk7Vp4zNF%2B0UGaXmJRs5q2vZUA9sAlIWIx2pzhXfn03cdE%2BuI5iSVWf6mx5slaIzkPrQ0aAnHRuPUjAa9hARqTbA9FwMkPq7L8F%2Bye5eXh41jA%2B1LJv1IaVyPodBlpriDh%2B392onGr6ASI350e3%2FZY5SQjW5Ow7rdK77izGrPvEBDhonvVz%2BeWkT%2FrwAxVhmayOEACy%2BvwkIVKSJtDG3APBjZILABRRxZxTLfKx7fR66zAFF8vMXq%2ByObmlxLjrZ5M%2FZvyFDYBe5i6pCS7%2Bdb4%2FNJvZNkzU73SKnIQcLPOMx2nqMLlInxyhflpqbT6OtBI6LFSZ0ApVOoOC0Qgf6XuF6aT1LRmOB0mhZlUeQe9XynIJ2dX9bVxCc9J4mFHXHFAb3ClU0KEUq%2BEL2qe3z%2BjD%2F47nQBjqkAXrEDok2T0OE9fJ3rmPoQMlGyxL732qruF871cSZcu8g3eH9xQBBXfTyrFNnq6LEAnPeXIN8Xu9pN3MxSOdhc0XsmmxmsyXlqhloA4n%2BIOkUdoFOb9PkX%2B3ndJGrS98ek9vltehCrvnttAwrHgQ6PRTuCBPXXRl9pekRtbQlCosSHrhGEGwGG5e68L0RLzJJzh%2B63OfRamkOBLIobKkuIL3pFbpj&X-Amz-Signature=37e60fe85a175a03c85d717894bf4930f927e695bd833a74d9e195a38feebc48&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

