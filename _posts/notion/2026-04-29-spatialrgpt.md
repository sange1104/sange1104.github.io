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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VW6WLCIQ%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044025Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICAItWziVvTXCIoAV%2FVLKc0QgKgtCUuenentGDyMK3CBAiEAhX00YOyqZioC77SEmkg1fFAK67GrliQa0nSqnuYGFD4qiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAy94CQKHZT2%2BdTYkyrcA9RuFRTrXHNRg0o8sKiqJ92tGpnvRfCQABWMMLOO9H%2B%2BU9%2FMGEVYwSHbBn6qQh7xhbjR%2FLWh8z1M7nEhQ0nvjQ6v84PwAyhwUP485HxMUKASu60fY92wLCKlmgTmyRD0hvU4ubzXhhWjcG%2BT%2BOIs0C5PpiSnM%2FtCLrAZs%2BRSo45oVpMl%2F5Sks5dadKQ42GYuueXw8FRwkrNqX9%2F%2BctrU6uCw8Ye1MpH5wcrGqZJnW1FMrzbwhPol4kwyyjyah3liTA%2B3qY750JpYrVSUPq%2FJB%2BV9lz7DfzbLHj7Xu097tG83FBJswesMfCfq53yFO8rLjgH2x4pkIi0ijbp1zpk7tMdM7C%2BNLVu30aiN%2FeQp%2Ff%2FEhSFxxbIj8dH00xvYpa3OBzDK11mZW4Ecgsofnz2Qj%2BKvDF%2FSbRGGbTw6y0ubg4FA8NTdz0oVNHAumuTIj9MZ8vccsrK1kr1bXfiLS7RIxvNHFcMcFF19hJV3QDjo5gnTWm12fsjfn33AZiEZHqu57Ic18hHuwasUTxIug%2BMaSkdPcIvyBaBRuR1dRif0jsK5XI0849W67tGhZ63lD3MQUslLVBk8WHGRDQ%2FU%2BJl1Osw%2FbJ8KwACgnQtDTwYDYXq%2BXemSRl8R3y13CADkMM%2BFqtAGOqUBMBYbODm45vIk0Xv%2FPqQ9Fd%2Fp5XK5xM%2BCPJMBla%2FoXfBGSjnZnUKMNmg%2FDX824SEXdF7yItP0E4nAeot4vmPBzr%2Bx5RYZwGSux0sJzjm%2Ff%2BO5SMuulUphftUmklIKOthN%2BM%2FK5M6vI3%2Baua4D%2BezbNwVDtjo8Z42tCmaJnv1HNwIDjrYKLhqZbD7OcZXeTc8nrcC3onLEKoZT0Rcl9X2Qw9EHEHhj&X-Amz-Signature=b71233218a50a259b712e22331f845a452e917db00258f7bfd9761cf0549f65d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SBEXLMPO%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044030Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEyRKUiGH7j2iHCXydVG8OdJ8z7Q7HbWmLSakzvf4DlHAiAxPG8lEGfhjgY1IcIGCW7%2Bh6CBq6dbO8jJxoM%2B9O1r4SqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMQwkVEynQsNPRJi3zKtwDOut1SgzUKlIz69deFQZAvCiy6kpcKB1W6cWvO%2FYq1eGCqf4a6WX7pDB8YGiHaDTaglR8qXTF4gVjh3%2Fhv9pHvbUiCIuCpKpQaVsUwcgHbmIXzzSQaNkwUKBBN3MGMMYuBpjWtk7ckKNKtyk%2BfrlZWSpcCedRzATvCt9mcXlZCWCnu%2FhjRn%2F5eGc3lR5faYzPa5pGu5JwgBrZjNuubp1pLl%2BlYp6cjm%2FV%2FVWSByQL1Hs1Shqv%2BpiuZCye8gaZJGWQz9xqgTNEHUjyyIFCr%2Bkqws3A3IaF4iFVELKwll1GMbG95j0wdCNqiPjiRBCs0t5kJyC4QGILse1V%2Bt%2FbJtlm08UzgdBDxDa8718HrmoPRjZq02UZakwKIXwb4wIP4iouAqD%2Bve91m9cx7hw0Fk10so9lLUXsxApZ3A3ymJijiqZKog2j3%2BzWDt7CQfH9I%2FD6yf3vNF2KQZOKQCZE1a6u1nEQBeT7hCKnnMtU6W5UAXqEkLdVtoHO9oMzVTuYSoCODQOMzFgrQIvZUYGmGw97GaBDxKcxL%2FT4hogg3iIDDgeHLvVWmbsczXIHsBXmFgN8vgx4XEWr2vtrPivYPKdRlyEy47fmwxxpgyZiRITR155Bac3s7mgd9ShBZ4Ew4Yaq0AY6pgFBnQ4qJ%2F4jJ5tvgu3TTc0zdR7kBwFDiC8XgPVceCs87jM4Dgb4lZwmftuCI%2FF3jEonO9vt3rDWYZmLDF7hsupaZBfSsenVtEnmelkmx8CoS%2BUkdHL9NGE8W7fZCEq14Ne1HIYF6RZdhtzpMg8%2FijKS1M5ST1FwG%2F2pa%2BN0i%2BbbmdSXEK24fvngpew%2FPHyUI4RLWtAkW2qSdmn8a3l1vDwfJmIcw6Pa&X-Amz-Signature=46c12e7120d0c6d17574fbdc27df8fe15d2f7d99a8dbf6c3cb3ede91e05d0f8e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667AST5G5X%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044034Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG2%2FMU%2FaxtXkHS5RqCH%2F8rt843%2Fd%2BjuYe%2FrX6jqSKbsMAiALKC5zm5CteGS75Zww5alG0f4Y%2BoJPb0oFvE9cNkejcSqIBAi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMV2JkT%2F2SboNBCTc1KtwDRmEvWCGY62ACEtNzqiEQ%2BgiFalxmzM0c1WT7%2FRdKOz%2FjkxvfEuzfYzLaOJNk91144KLnwOS5uUXJbQkbq9StHtlOj5KhO%2BOJNifmpbS3BqfiI1Nuvu0%2FlORywNkQwwjL8Yx%2FHU0Wvf%2FVnTsiIyWEipDuek6g5adjueaItPD7bLpuvmf34bX3yGtQOR7%2BSPzljSVLafg56SI9tZ54xvia5WrrhhwwSGEWJfFX4JW9xBriuBHxCpZdtoNQQgQ5PSlS%2BXVKOXbUaBRXP56Ti9B7s5g1mxwiVT0wJSe4EpHrD3xm%2B2pXbLwzFhOIy1j4sEjQHZ0XfqfZGTFiUkNXL7VMWSZTmRIZp7TNvtsbyVZuAJBYw9p6%2BKoCCq72i6y0gZPWyRjvwNcXladU%2BqKOxqQeIyixgxHWLlnYFo96VlV7c3jx%2BaIpsUa6a6BSQG%2FXih1s7Q9pSeVkZIVd5EJsburYNe3kijB3lQ7xkdK%2B1OLXrQ3JKmKJL4Xp82qs0rPyJxoX%2BjXARo7%2BBlijqErkzz3J5kidEp46C%2Fl4SxRy4a6XBZIjlk1sU1nMfNjbojcakwVjxDO3z575yXi5G4jEIKmTBZHWEcsCrYx%2BxrbYJ7AQARbMohg6dppq4dG6pN4w9qSq0AY6pgFsblVV1dQ2vEYEWDEA5X1Ww1RY9W8F5iU21RszOGS0m1Ag%2BL8IGIZIFCiiBItWzrwrzYj4xVYnCfWs0GWSRJoo0XTzU01%2BKJlU0aY3W3XL38ug5%2B4AuNABDCY2iSja5X2O%2F86qTrQkF7kMjhDVj4cph%2BAVQCVal069B903bmRyYtB%2FdVj5%2B2v8BFo%2FMhYizG2DAeClLo68OI8hFiT37l41680LBp6R&X-Amz-Signature=79bae16a9570f7e30b6f73e4255cdadfe727a7b183be8c725d94bca8d603c1a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663QT7NEFA%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044035Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDqsQWrUe%2BWiKvE%2BsgxE48H2xoJyatpal2WobL%2BkWvpOwIhAMEC%2Fy%2BWvj44qAf1NPvuf02o4PM04d0ibBL04nASOegHKogECLT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx6fKLR4I8URlumpy8q3ANGYeQC2iEcqJKRCrU3QMBJZn9iiDwSjH89kIxGEcLi4YiPqQUMA2QHxhQG%2FcWkSnUV2DCckWBNstQyFvS9cYzQ9dFn3gbZ5JOfIIKZXlQQeRDSXeSx9WUa15%2Fv8MeWTd%2Fm%2BBe7ifxA%2BDuf9wYffVobDRwTbHl5NSOSHE%2F2x0L3cKtMPcuXp7AiE6zhGIdmUsKA9A0fENf6qugz4ZnwBPBR%2FVFBpUGPcPfSoWOWBrwsIb3XAh8jD1Neehs5ewqOkK0Yu2p3G78gxZWp6f4HGkcHTUdpQMdtRVyMsjjm5BZPgIjj2L0ZpeAJYYit1ARb8qAfjnpfvsw3YjG3OcVzq%2BRDldhu71n06MkFErYp0UOjvKL0OWW4%2F0WEu1UmKix6MAg%2FfnjiI%2FjjhTFT0lu4Uj4%2BjdOTNdQuSDG8%2FxbcPiAL%2FX0796JxlqrCx58BvwNA4NXp7JftGWX8pV7zzVrO%2FT%2B7ITsCAHsrNLTQbpx53ejO14%2BehACVpKXRnM5bOS8X8B71A%2B4eQXxczeFvx5rf2WUHo%2Fp9IV53kovAWexB88Q9uqZqk0vMlGOB3gV8VpnZZP51oCMZsTkqBJQ8%2FYqTBcTknFQzPz4yY7Fm1907FcZ1SP9ehsfsWBIRXZRcsjDEhqrQBjqkAQ6PSfqtgsZ9r1dMY4%2FojrBLfnkJUlObBcw6rfIoXU7pPaqieNGtH2xAiphmliUplrWphZzE2Yh7rN0ihFA4J9Rnto0iTOzjS4eodZ4MPRF2EmR%2FqDs9MJuTsc7qMLgkDRMHlhvJ8zNDw7ICjdEQ6r%2FyrtbXaVkH%2BiSBgmF6WXu66xCzX3LJhJ1VrqGLw189pgW4qfHHYFUSGQU0z05fvUzVS41s&X-Amz-Signature=86d8017ead8e69de742eb858477b0ea0d4a744039f078ee0c19ee946ad1a3332&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663O5R7Q4F%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044037Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGeVmJ6qZI0GFvvGAGgNal%2FMCtHYmcmW8UfXYBdUTCqvAiBdJFS%2FSfpfv3rzfE3q1l%2FmRSwSEqHU%2BjNle8w20jYehCqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM4C8XKYumIiuWrerdKtwD6SYRB8FtJr5zajWRUH%2BHysvKvxMxO96YSpzowUSkD4HFW9tBwxZvwwMCeNuBKhMXA0%2BqCoaBQPOtQu46ZO28O8HsrmDTw%2Brp3DtyTAV3GI%2Faajlhjuc8I2ZJ0tJ6iKspr9o0Ok3dT1qzzr38oMuOloJNQ55%2BIDZKDu0t7EU9SH4a%2FYH7nHAcC0WrPJM5UrsDXo57u%2Fb%2BTtEqyPpiD7AR%2BMr9hJYDvufW%2B2D9yvo%2B7xeL3HU33Ox%2FMOCO%2BSCIFzN8Cm5QzFLJacz8DqWkVTGJxAcJJW8%2BTVMtuQ2QtmlBNFZs6a%2BHByqsFW7cXF8QAkzR8r%2F7lcTh9BhVlqcztXult0KOVZSVjw9YgSK2%2FubxXxep9DbmMn2KM89rRzzC1wNO1g6Mt55H4vcw%2BtTAGCYNhrUwvDwgCRhNvJRBTxW0VkSs5DRz9PkKEAJlmu4g7KKBWr0vCviWkhlI2UhUPyiUWRvsgj4J2tj33mITczntWNi%2FT6fyDWqLi9Ni2HH2B7SFf49kHzWAwjUco0W9bq1iCFgNhF%2FzrcOaxkbjz40bItVwR7qPGNRuB2EGIMhMl%2BnHoadu6GlhdN6vs6eKK3RqLyXKY2%2F7d7t1HGysbo%2FqUep%2BJFr2rSeVqHEi7%2F4w7Ieq0AY6pgGARgadjdM0KBiZwSz9lxGkkAk7ilvqMtQXXULRkzXI6EQco0e5fEhn5SHwEneMMgza9rtrpiYt3c39dghuW6zkWebJ4Kf53Bb8MIqW%2FWyLMzqI6g5oOWhuVGSKSbltBuPHGSelgBw0B%2Bu0L01Ji%2FnG0HZx9aYThQuM%2B6jTc9IR%2FNhnGtbm3lcUoMcouKI7KrtXuvEvilUYWyIbqc7a7czMpKHNwfRd&X-Amz-Signature=237748d016aaf71baa75012c80be4cb4a3dc158aca1beed8b67711122992a69e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z3ZBLHU7%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044040Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA%2FdsPI2V6CNfXBPS35n5BnsqyGZAzCIDFqqllOUpTMUAiAur2NQzBYT1KJM3939J0NE4B9y%2FCKr4NqKKyz4P131IiqIBAi1%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZZm%2BtMn1qVn%2BH1m7KtwDFXRxfmAApcHOSo0ZGGhU2AvKCnwZy85WFUnPU30T%2BteZyYkmKVF90u6V7yFF4%2BARALcIKPsEfRDLKco06re8BtF509FjKJQJELu0kjDICaFK8R6IElQ%2FgGrIQY9kvgtGysWf8M%2BN4CtWzdUUJdZDMMVgtFPdhVDR1Ag0RCwS4166Fgt4Z1O15Jyg6cjDpsAmlYg2PleoLELpqXuEZbKhPHyIN5IsKd33%2F8sTInvgazTXDQOeId7u8xedNxV%2BbM5tAnZ%2BYarnOwauqgcTZ0z%2F%2FvOhpYRG17uqeTlDWd1rQY37M6L5tGMQ2%2Blxef0RLtzWmo0zCxiJdXvFbrRP1KR6vZqDmBnLhasP9S%2Fx5Y4pdYl6sl7KucATvJOYREjRYNkjhWmIh3XYcTKVlNU9czZjtsTMGizfRsk1D5rJHWEjXBokxbF2SM2RUCX4DYO0%2BNYCO2nl3fTNYGvpekuqaLUe8BRNZfIQuYjfu5IlekU%2F3yiUDaA53SCUx6Z5nsOD3mpGTJvll%2FyhF8jG35r3tPBdCGSXLVvR0BGQfas1vuWBpNPT4H1FDrPYX4g%2FQMZi8D%2BhjbcpMc%2F4My7R%2F6NKeMJxWKShoQg176aDRiI3fHcP4XPXVb9x0WazxeSUfb8w%2FJyq0AY6pgF9xGz%2B%2FepSWFyAunRtdufrTlXqX%2FHzIvzWftB0WwaeCjoJRTpPv1VgUaxLj0G01Whfw4%2BZaYr3vP4IpEMmxfys%2FCu2vix4U%2B17tTuzfDPgIZ%2FKdKbVo%2FG2n7mGPR4wz%2FaxAV3wvz59qOx9gQo4lykScglF%2BiAKr7t1py6XklzyFOHUU72aUNxPvVxPzBL3I4pECvdajLfOTxUlX%2FoKMkwMA8ag7UhM&X-Amz-Signature=b777893947a57ba70cd2e4018066e8de7b01e451fdf5c60ee4c15a0ce85a5234&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QHE2MOM4%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044040Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFUN8ypx4%2BwNM9yLn1GyRWZB%2F69x8oEW%2B0IDfxriS4GwAiEA%2FNOgyfj3dnSKUwgK2ctEgaBxDZtj860w%2BdoDIEjsZX8qiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD5G3p1j4lEXgQjuXircA5pAO31cYeLGfEIxShq8SK9emtthkwmFN2UIhUXhV%2BEhqr73AwPlNjBHFFOOPT6ZCrM%2FRU7jGrl5wIEAODmVmFTAwXySptyaDJYh1fgvws4TVfYNfv9UEhG4A%2BPMp5A0upp%2FACSiT0lvwU1jMLU3zIssxLLA5dKRA%2FOOhFOjEbKl05l9iThFAXEZUDNhI7BoPg0fpLLTFJcVAQPgTeC3jmcmD8TJhgYNYLRX%2F6nqBAK3x4lQEf3Uk%2BBeD1d2RD9UO%2Bfoze0baZ18%2FSQADyJgc0cpGegOWDLZ%2B22U4DITALM0Rm3DU7gfoLbfymrocCc7jwFc6uSeWs763nxduxXiUyymihFWcTi8MjXOJQovtd%2BJhT0pEPoMPcjaNn8xxrROmh9hLAj1P75fW6lSke3LstVuEzw64Q35liurmcUp5gvH4UCSBJxnNUtvylNBJAJOgpwTayGVzwHwiPMEpVfji58xM4HVp0WFaqDH%2FWtQTKBMEHRBUsdtbrygzgxOkIAuAlrY4t%2FDx1NYiFruUI7WdNYLMO8TeUsrqDz%2Bq9Y5rgG8uZknGeZkM%2Fxu1GR91zEcr48gPwUI35s0zEHOQPI6L9oC8tb9WhrK5pLUkBTYRp2yHYRbgtwQLh4RydAkMPOFqtAGOqUBfpV56KmqKrFPwiO3Q%2BLm%2B1bcwLAE3iFH8LhF1%2Frluwpx6J%2BNTeRrsnrPjeFTmo8WyUGyDsM7b4q3%2B9fGS9j0O8LO3dOtvN%2B0%2FLUXlENqVVcOkkOCBETtCjKis1uXRvwG9TBc7msXIU%2F44NdOmO5ItiBVhZp%2BEp9TAn%2Ban4ikpb90ym7WHwWzamA2Egbxa1C2lSkAmOM%2BZCabO9ZW2%2Bu5hlQHUWe0&X-Amz-Signature=7dcc06f771edde7b79d32e331c9aa347b1a1f831fb3231c852f7a9543b5322b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RNTWOYR3%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044046Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCSLa7EXnlMhkSqu1BAZaIZd9nJMyOEb2piwZ6U%2FITaFAIgYC3skTVdjFKHs4P4n0q9Rx5gK8KcStkjD85TVUDrQlIqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGh%2FowRkpjmun76pMircAxtLlXHQzof%2Fv6cgIVOoPafZ%2FrF5ztH%2BgKVgIQsAXrpogA7bS3nGWwp72nF%2FpU%2BtbMTGMYqVwq0IewMbJOEEHDUO%2FljyJaOWSGG39OcWMGfZVq0uvJgXU0UtAxIh00usccvfhg8mxy9s0ee1flbSJs7o8mIQO6%2BFuJ4FVavLMdi3OS2FqGih8XVblInLqbQu%2FxxPvi2c2x58uk0G9JTK68l58RkpDsVeBDc2B7t08pLV3aAw0NL0m2WWfMEqLh%2FwTzyjNX%2B58gYLstR5z2JRQuDX8z9ahas%2FSd%2FIXAp690QOVxvajfej23POkeZaDdehO9UhaUS%2FLmD9v%2ByO64iX%2B14ZB6tJXobwLDLnPEDsjweycE3vTmFLInK6%2BPbvW%2BWswXuByICmrz4pRRPi5L2Fvv25%2F%2BEoJvYoD4jRC2bGSROY%2FyM15G%2Bnzc62w6469uTPLRqKsjjP0cZzkN9NRAprdu9ADP2EJ7GGHF6PHyChPbHJn2sb5o%2FZy1znuxRNObv4P5hs34%2FGtkQlvHZr5MJrQz%2Bl3vsewOyzQ6HBU2xj8NRxgdVhReK%2Bai5vUWdkGGrjIoQGX7XpmOGOgkDFBVjGaUnvo5g73hS%2FGnSWsBxyRyYOa3xylpDO9iW3NmreMJCEqtAGOqUBmY4ZMmfKBgtidd3amE0vFP9%2BvzMrJtclfjFbjB6D1AdnRncko3bIoBDfRI2mTnLOkyyh84h1vz72arGX5JBpm6l1iA5K3qhHCgdfnZPJp4qEhY%2F5S3jBBfYmfaNdbmG%2FEuG3yw1sq2%2F8CEI0l3wWoh47254s7twNdCpnOtkFOBfwtbzwZsR3cfAq8l7SngELRAcxJFjCvJcjINOih%2BB9FWZNRH2B&X-Amz-Signature=a424d3c6f3383783af24845301c4b95b819ed66930a4b841f918dcc5e4137479&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XK3LXCOZ%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFuxdAVdBis8VNU68wTVhEXnYvbdGwA0ZNuL%2BKYdXSKTAiA%2BCb9smniA5QP77j8NzJbj3PZFPxexfqwR%2BVcn7MJSvyqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGgnPv7cCI8X0kRrNKtwDlHc%2F2B2Gzx5A5slIGAP2Gs2J%2FgS9Bdcu0Ei%2FxoS1rXondageQ54ovAOI9afn92leQHgA0fAOWrkm3PM9K2vDFzGNuZ44jx6P11Kcfk5h7IkhP%2BhSyt2XPWp8uiuYCDC5TeTbG22wb5q2KcaEgtqhE%2FSICSypuSkTzNVDAKSE1JmP0AF8He7h%2BHcYW0bn8js7BuRgPyeUHLA1vrznJdCtCqNCcIDUQCQh6sZiVNgRo1GlvOIPv3j6tbJMZv%2FTJArqdF6iKYC2UQgWr5hZ9e8aCM%2Bsos%2BgmJFv1s9grVOppeuor9UMNBOmbvrkZ69sHPMw9fJ%2FWWtp7PKc7VgAGeEaAHn4g2%2FP9LnK9ItKjZgIK4pehxrpw5iWlPMaXCpis3tT1bNHpjJHke5CthMPBKSrJ6uMK%2B0uMLlLTiAhW%2FRHN%2BveNEfmdcAPQFbXEVO59pfUtQGP1OAMHXDTuG2T%2B7f%2F5IEAN7Rxli7RG1rW2u59gx2wOUDDvJbmGT6iLSsRKqzphESOj%2F2i%2FAlrFQvMxOWPd2PpCGBQV3%2Fv7n8aBZzExDObvWgf4bb6DyWMk2xq2q1YpnCYjCxrdKc1AwEqyeE0XoWvB08UiK%2BgVilbLtw7bI3N%2Bpbv7%2B%2FTqPbMYk4wxIaq0AY6pgEt%2F85n56x8T1zyee63PoQQuzoYLOWt5ckvDYzsBhDKaw%2FiqqLRWSDVRhcrO3%2FbpUdPnkNnYMyPUOQBYwTcEi8yddAOuLYxlZO%2BK%2BK1rrZUWuyjzIZ%2BOwSVeaJE%2BqYkYdcPrv0k7%2Fhog3T8HMvw9YoVcYznezO2XitxxBsGwI8ee7Oc2tIxctmAs%2BmkREYiQ8kzydUVPGkAe1Oa7%2BBMU225dwhk0Azh&X-Amz-Signature=eb75244671e0273b678b46224df6bfe8023b3697b565438083bae12c6a379ea4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664EOAPYWH%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044047Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLRCi5Bd8djXiVYhky6wHDvd9Nv81exPMhel0nV1ZeEQIhAMg6C9yTk9cg2EQTrRsluTAeY2IVANDuI3nxF%2FagLFQ1KogECLT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwzGJ%2BiCIChBPhKFO0q3AMvdRWNNsLmaFU6KoShxFr4rxts2s6XEAclaFdfvNADXEoVt1%2BSRtN%2BUIE2uU3r4u1mex1RTErTzz%2B5%2FDoMALt%2F4Amr18NuIXFH0iIVHDFsBWvNYIiLSZrO1DxcBT8lUz2OASe7fOOcK%2BmlqLsyvw72q04lQH%2Bn4%2FbpT0TP8%2FvjMj7O9ASCbSxHy5qgvxSpfeil%2BaenN1ujIBnyVmCa4myWdCokP2YKOBDxtjI2w%2BEEL%2BeYIXrhbbJNE06HfrBCzQO0K8KZ8y0GHcD%2FZGSRJKQQrDPCo1Q31FIu6MapbzR83CWH0z2Q4eVOLg6y4lHi1A8YshMtiwqezkY9Sn6kcZ0xmXfTzaJEallAYa0Q6dMVCPdMytLuSz9dTi%2BPW36sHixl9jqe1wOJHRRDzBC1SS86h0mvitA%2FwZUixh%2FxFjOH4Vk3LUzjZc9ClApKLh%2BFxTce64XWA5HLPnlTLFcDiYBJomDyafRi6pkFP2jd760tMpOUq9afO0c6g%2Fk8zbdTrWWZXns1RyMfr%2FyfPMMRR1M2t6IUniJmxZKrsjKH5RWnL84rjrftWPRJqov1MmeNC37dacR8z4a8bTa0oRMBhM0gyqcsk4prx7xvPHShUUwVO431ysdLHwldbx0YHDCiiKrQBjqkATby6hDNy8MwYA29UV79%2FzPvbnhImVS931fioIXHciA4wvyvIrsXOYYYein8U6bi2j6TTmzf7OqGGWk7TTaEt%2B2P13svIxQ5YQIQTUecu1dJuxu04U1mpDlprIM0B%2FIt4J89banwGZ%2BDNldTFQTm0FFLaUl%2BYlPKQc7mvL0rhUoA6gI8F9E8qhNlScv8KolgLRbCKADiSmfAsdg8pzKc3oA80fY1&X-Amz-Signature=9d4a247f786e571dc681cba5c212bf64e99a70c1fe8e4b89dc8efee056a409aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665NEVP6OX%2F20260518%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260518T044048Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCky2OG2dK%2BazawK%2B1vCX43k3dy2nYfvWI1RtsEWCoLJAIgAprYFMkWqOxX4mHujm6wOiSfegsHo0haKAPPyrJa4AwqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKnntyyZBzRrz1HNbyrcA%2F%2BwZBhzRLn8xjCA1rHIF6QKCa1w%2BbplfcdTDA1OLRiva1cqRvUIIbEUjA%2FNex3UJ%2FnVvZoHGrwiHsz9Xtn%2FUhnOe%2BE045pSPkcq9f5onl9W5%2BdPb93k4DZOdBOU%2BJCv%2BGBCbU3FmfzP7d%2Fm9AYyX9IkIx1kqm%2FeW3q1ItNIPikdmGFHxC7hvUdsssIe4H1NBQcCfPhRKghN30ypeVUgKLIdGpjBxKM%2FX%2Bgm0DOdr4wM4wN%2BfFSVVtW3Bs38cZY%2BvhNY6k%2FOyRymgqR%2BRO0VF96H1Oz3n8%2Bit2k9ewSurz78RgyuOTIRxKlNbGnZZQ4p2PNtnReyabOErG8IF0fpl7p7VEC1qg%2FF1asATYcF8bF9sJumpoi8eSieJrrnwRsPwfa38lx3tis0Ugo8DjiDJkNBiS%2FPkaedVAYXW3h%2FddN0oxB0jh6HqTsbzPvNxRx054d9Aw5Hc3qNTkoZNrCWPlG6RS6nqJ7HXNr2j1WWeywW2FKLxu2xSph11R%2BO0wzDAqHpy82ZJTIK7d5ZvI384TRD7%2F37XEb%2F%2B6AQyKTax7%2B6z1O2NquPf8aWp7yx73IfrXXIngZ7CYPHFad%2B2mcVdnJu1FLpBy8Mp%2BXdApERE1kkP3%2Bn67BQXGrmkUUBMNSGqtAGOqUBMimA%2F1Q8YA8ZPwbLARwoOH0%2Fv8Y2yJUkMUVTl3nDTCTY2BYOxhyYubj8sCrTvqrwEF7v2PFIxR6rc7lQg%2Fumbcbm%2Bqmf1vUv5cX2yMXI%2FZiqupXJZ%2FmEe9mLXu%2BhgDmdL6gbnV0fpHiRJembxUOxfNddbjxqOSRhgYSzpNYiWyoVO5xxlgb5ISrwm8hLyMsbtCprtRTqC9EmCmASKB9oeaSTMLgF&X-Amz-Signature=cd658d5023c8f6fc84fd3e2e899eb10767be0e8558f2f78ccc95f2946f01a5d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

