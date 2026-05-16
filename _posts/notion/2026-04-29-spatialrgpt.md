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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WITOMPK7%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035943Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFn47x5QsYakLmfFT35OcXGyXGIJ2KLuIZuhWA%2Fxy9syAiEA6w4iPKf67OLjT7XZq6VRNDLWhEhLgTyOIqhCqhnIm1YqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCnikExARnUckWx0FSrcAwjnjlqEEqRkxDgwMudVNVxZF0SnxU8fxT8S56EhfooCgRDHY2fXZIAKBMWrAOMb7yTV90dfQPnBzhVpT01FHJUeYdCYH0Csr9kTlF3QSv6oadZ4FcZiC1xKqwu%2FKGsNmHXblE8qJZAorkpGjqqyyinjWxvFxtkJtIgSPyPtsytWU1OENInfw8Jajqdahzln%2FYotMakuvcgu9LYg9AgI2FilmxvThZK0FviRhfMIvYmYT4VHgcBJGDD45213J9LKPgrcYq87NNhvp1OLVsnfYrvbQlKid4FwsX6Pp11yk7cxL%2FTiBlDLOPXLlOgUMY98MPp5L6oKc5xa3SebxL1hO2yrBUDD4DdKZ0zL0MXrVc70zlT9NLmciPyVr1SClfUfbv%2Fk888AvIy%2BJzu5OwHWegunO0%2FrOOx4M4Qo%2FfapBWd8ubv0xFhqz9t13FPNH8FGXCNJO4rbI9VuHV9GCEdbJPDVp311tfTycpOo4UOitqouELb7Fc9GjrsdRpgQwZRKOf4IXZG51ncpkoAtwsSNuTn4OVGJ07G%2BaH93S%2FjdLZrKI0zkhqpjyHXV87IzvPlSdT7g0vyjIWTRq9rsB8Gu%2FB3a9ZmAFcZpuEM5g6tHwPzPXH%2BzlxxI%2BxWFUu29MNPEn9AGOqUBNOt4j0%2Bl7VOOW8g%2F8hudWt9CgT8I0MBSBYVRd8FNRkHgZhZ0ubSUeOsBptL9PjTwmgjfLEt%2F1TUesf%2BkIYV%2FEWsDL9nSF47%2BM0FpdzgGYjFjMhZkC6V5QKC6gmHkfmqwxedXeetSYR18Sx4FmjgftTg6nrd0DtvLk13W%2B6qcxbFEeFz9Jk5WuHUTVEDeiRo6BkT%2BwPvR0o8z%2B0B88KK7Q%2B%2BGdcE9&X-Amz-Signature=25ed023930d0ff2c46a7c0caf43659d70ca2be28acc9b72e1cebdcfa3ccc362d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMX234OG%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035948Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDmPRSm4nSLCT%2FJXY3cy43t7N20q7zd7ZADa8mx37mpxgIgfBofMvLwEphmGuS%2B48Ep6HwgwaOzZmW1D%2BbidyV0W0AqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG%2F0%2FaJLCFxm64QmHyrcA0m%2FcKLh2prUDdCN99IxKpoRVnNgPzX0s30dHN8%2BG%2BmhqmzBYN24CHmJUYvAGEbmFaDuIq5GnLz4KIT2zBjDlKAz5Oj2G3kvfyOB1qQchMH1zKQ89Fu3YbcZPUbgN2PGiP0uOr8G4yfKSySMrxYnKu78WEcYjGao398U2cyoI5uDnYwaAqYDNV8bNkRWF%2FQ2T6%2FAF%2FmIVnHFDG4kN59jLKyc3IQNeJdBun1vZL0SR8g39zKlTKMPKTqQv2Suk713F4jj%2F2%2FqSvzDeV2FUN8Yzg%2B9lLCmb2ORR0oAe29Qc%2F7UuQLepV%2BX70J7N9Ulz%2FRM00OZnf9ArylDDgMiBSXCPtsiSxXgzRB%2FWD%2BAHgI%2BQM2j38GCFuQg0NPRZbiMK6j4nZSBlPnN5jFnJUi7izvYyQR1Sg12Gvkby1uCJZws8tcKUUNu%2FNai%2ByqmnxQu%2FkN%2BAwDt%2B4M3TKDmixugbBr2TdDolwQBFV63cLTkFcP8BNnQbrKtK36cv2ehXkvQDHyYfRg5cbzMgYGoODhXLuqYXz%2FcfG5ICWuet6ctkcBCwWLj%2BuQJSAJVic0perJwvrFm3bHgwP2f%2BCt5upHerT6VHu1kdk%2FGelbjruwnNFNVioYxzbFAWNEf5jRlixPjMP3Fn9AGOqUBa64GRhvvgAZIoaeVhhCmq6I8QxYI5cQL7vX3xYHWGU3nX5lyUV0K019Pgni3ZpvnIhyyIz8M2sL36OPnqk4v%2BRYKoK5IZIRZpcIDHqJYOAPKrQsq9HRACBsl4X6mf2J%2Bvvmgq%2BvxIYM5PKc07LHLNhDu2D7j%2FDDDxy2wO62RrcvISe6fb9spUiaLsBtnhE7Ft0mlAqfXwjEw2GAwcI1Pc5WEKVkR&X-Amz-Signature=4d3640c4e98529c80dc794b2cf01d3d62e53406880e786b66110c3b138db15c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TRO7J7JM%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAYi1jDTeB5PEGoFGneWklPNf2d5MJ%2B1dvaNyyRd6QmIAiEAhqvVSX1gDVNCAgU6HsyfiDLIABbKzaNZbvB02I%2Fu%2B%2BAqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA%2FMPyGL1%2BBkn79U3CrcA5lR65vcoMojubc2Es60oKuQw1nMAtm9X3KIZBvJ6uKXwVQ5cO8N%2FWaXCxDolzyrH7XdDblVC1Cs43iDaF9xyJsT5FqFI%2FcfwCXLtMUtEmhfjWokV8jZSfWrqL%2B6dXJnG83I2jVj%2BJl%2BJF6GoqQibFk25aD8MO8XGhkS%2BhaDy3Omt2u5mWItRlUY0CE16HhoNN9A4czpbJYNbGPmX%2BCxQGtOBNouXM1atUJM6mxX57GGxevTnQgeiPWHuV%2BUPIoaMSM5tryJSuVtOx5a40EbtY3I74w9Qxcj%2FaO5OcNPqiWVtr8bapJYeajmqqbj%2BK1i9qwiYGE0ikwnrhzWVrjqHpjD4su4tnMgwVpjOsEymNVsQaQQRQS3WhOK5LHWxBaiPwIq7j9NS84Chn%2FdKVBqINB24I6h%2BVDfdxZF1ykw8ZRaFSdOZdnQC6geIvJh6xmKstrFevrvVEgysz7U3Hsd%2F%2BKYCSPbneQ5o%2FqPg9FPvvi3q%2FOtdmGEdvBKmtf%2FrETM9Vhr797QGA1zGA8pBjK7uT67c6LmkSF4s2l6bX6boUMi%2BUEGxFPejedMXwpyVBVcK5wgQhgc4Yy2Cf5TOdWbVvkQnEZ%2BsrS7oAxOxevgaQ6QkBqFFecBqrh5BSr5MMnEn9AGOqUBcDaKRh53tKhfEzJP8%2FrDopkuGGdXL5%2FoS%2BSpAjqekQ9EFYP%2FKl2N8ArbyATr0noy8WpFoPrI57jsXPbFvUroIEdXp%2FZrckM2Hwv0%2BeXx%2BRvTs9CRgByFAnigNEHT04tCFf%2FGzYgqrT66IwgFhDz%2BbVMbtEehyqPJaRasb2Pqj%2FbiJ%2F3biowac5si3QTD6HuplG3kxohOIcWAgsaF3EM1jbVplP52&X-Amz-Signature=85e8cdc4cecd272e72129de896d40e9ee569528ee38a0ef850e05da81bf59c99&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVYOEQNA%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCn1JQ4uyq%2BLX4veH%2FJSsUSz7MiLus1iyw8V2A9F5HiZgIgCWVubUGuBEGP1vyioKKU8wCS41JZA0MEGZUhVeeikckqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOn%2FRGa0m2VxROkiUCrcAwl%2FgoH5TqGPuh9dGQsSDFIlKZi4DFm5yoqJiTjYHEmMKkGZYgtTXl3JlSsxcyTxU6xxUEKh3zGDhZRp7iEbOaJJQ50Fq6tDsnlLVmOFXG6z37dRd8imOQI6QvD25fy7G0GgO1P%2FrA5dSXj9b5NL8%2B7aHy9QPVqHc8XT4uFI8SeQd7MYHla0T8gCiXa%2B2krcObVE1V9QEr9XL9w%2BlhNU7Aq87uAwiHrpsBw6Tys0fVG44d1lsEZrW8k2zD0xlhvTXB4OQos4QjJKBb%2BZ2HtZg1A8ilpjWINw4EEQB8TGm%2B2ikJTi2P2zTwqaoBHecj8ageYaVxX7B2Gd8ypYe7oJZ1d98O098S6TmXWRbmnjf2N%2B6t46Cf8nrmvUJhdnfE0Fs2hxU0P3eQ5ZfN9uKq%2B3ptKBuKp9%2BZ6ShUbhA6cJXEyi2GN%2FITWkIUL%2B3eD4AXkj32i7veLspwm%2BakMeY0tvFbsGoFJT%2FveF7BmoAqHfJPDgFz5iUoUgnWc3NcixtwRR%2F2XbievyoJBKVufgGnPC0tivVheHscxy%2BG5PWizvvtG8c972VlPfWnjNB4X7Ac2nI03XnAvz3aKI2zO4QWBQPvqmVBo9kv6jG5jk%2FwW4Ol%2BTIebxZHIyH0U%2Fda8dMKrEn9AGOqUBaW7%2B8YKmFCNZX6XW7SA1n3u6jZoGJxhLwbe1R%2FcNi9AAddzcqFzeiEyU32NnGytah4IEBy4RotN0oXnXNCnYp%2BinYmMRy3FDoGFHYBdxPJXT597X7FZzkih9ayohaC%2BVf3b%2FTqnn5wXXYlWFtgkqWonU%2FrY0WdPyC%2Bbl1T91%2BOxeWWy4BJuaneZseFL884Zu0a%2B6NeY6wi5qUQFwXImKJPpXYtiZ&X-Amz-Signature=92319c2d2d421a7b7f9a45d2fc7a2b253df85fa061bd7c044704bce75162fbd9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZW23KZZK%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035952Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAq7bPP1siDtVUJTqTaHcNrA%2F%2FNJD21rDFS6%2FGm%2FiEF%2BAiArO35ETiHVPqW9a%2FaW%2B3ZTyqLtmPxo7DHyyg%2FzUj8O9SqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMsUMQxJxnZLZ1b0gKKtwDfWuRjAwFhZT0nFk4CRjDLPs%2F9T6FMSqzgIWNvdLlpy3Bc8F1A3eypc7wPRn6Bbb2CxtY7Wo8LHZ4klrrw1IUEBV9Z3tJCBIL8khmHN32saRz4fL%2FaXXuMm3Nob6ROgXxDXHeoUcr935NyZKUu0LFCGVnvoPmQOvn6nP8ZU8o5qHtstAQmARrddx9Q2%2F3a2IvPGfuEVnv2xJ%2Fi7ECpVuJF%2FhfLK8SUysy4FXusVJ7U9BpK%2FKJ6ZFsc%2FM1sVaTrnKaRrQ16Td6h%2FLZDvWgIVbNEauQbxYuvOTz%2BlbBQbMrsQ4vdy1EhBBeV8lUQSCEaAuis7hSSVbjX2GhMJbnA%2BRpijqVGKDplLwG5VEmpW%2BfEhNczYwGH9xUuXvnFLEohMVXCJjKr20gi%2BKTSIa6qgYEuluRwVFgiz2AbyCn0WoWwhQeHkfP%2BO%2B32tWweeGm8mO0BX%2FBsupQJ%2Fmio%2F1oBZ5o1hLGYWtHZ5PN7mApJ50IlHgvEnJvTyzH8Gyu4lyGtnMYTRl8TlQICo3%2FKTx%2FrDhngZo3jtqDe%2BKh8I3BtDmiAYZrEemA6PPd8aN4srL2VW6gc2B%2BkMvFVxMi6js1JW6q%2F8QThzdgPRf2QwF1U0mHVYw4PGx5q9J%2BTZV056YwnMOf0AY6pgEKcepv39xaNeOcF8zFsciQuLySISQE709uowRL5JhBhX7rSXEVZSF%2FFNkvVxUClqwaWM%2FunM4RIpmlLNsEP2OiRTk3auagJfIB48aekpGemKoH3zxNRT8xQxn3sLNMgv8Q3kvhai86AbNmMIljeUMjcLIx2LcxNVTQ7H2Nh3GPOwmKskNm96Q7n6puzP0OjjwkTivH0KeDHolXsQRe2xi73JSrn9vt&X-Amz-Signature=cb02f00587547c89fcf3cfa56aa3186c3fa65596cc6c08376df119bf4804eae4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ULCKZYXZ%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCVASbCfTyVx5JdlsIrSKSLqoyfDovukNJK4CGFODAlnQIhANXJgNLwbJqQlkPx5zjoftJ9sehlNU%2Fb6m3Qei1ylddSKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx6f8Mvx0NqPjnf2MQq3AMsYd3Z%2B4VrXFMoSdi3ZhDrmeRMbAp%2BdYW9glYxrg2f2pc2kwTtCgG4DDot%2Bi8jEMhkqh6mt%2BSubI%2FxIFaAG45B0Y4v1Br9cgVkng9SrhX6UA3jPAVAV6rgI1HvwZpFEcS29pJLdrd3NgeMb3zxWjxfgp3WC5zkRE3bpy%2FKaaT11Xh%2FqDKMld4rZKkz0qeuKprE0UTUHJYYe0d7kXsxQmo71HEwHpGOjryrn9RL1mTMh0GjjILb7beyOB6B3wr93axJqB0K9aCLgy3bw9yB3yxoWVyxVmFaNSxlgMKQ0f2ojIjpGe9by9o8DSykc0T5KZ6JHE7HCWAEsHRSkmjF0atzjU6WVItO0sFP4rRdWbHP%2BpjJ9f50psJCELlJQQNoEnTYRRdJvNhE4DbNOouokimJtuPWpNo0JlN7ORSYa61POXxlyZjDIo9RUpVwbAwW4qUHP%2FZ3Rn%2F3j23MhfNX%2Fd54S%2FO%2F676vzTwZlRI56Svonkd8GZhStp0jfkLOfKN6PYI1MfZnJTKpcyN1PpOkfR6rdgK%2BNkw7poJpt5HR2cTBvOjR9Veraje5UpPhXlDgpPvFPCY%2FlFP%2F%2B7YXsuvD%2F%2Bd1TPBh%2Fdz3TpSvsJDKr0D7jQNMcth1EBNg%2FDrRpjDQw5%2FQBjqkAWB6%2BlQue6O1rnpS0bcc1ncqnKUtf2jGgjyqy42h2i0GNwd2b1IfqVOIbBi7aqWzX%2FEN3XY4amZk2FQExVAP3%2Bm7iOtzNCNgizelEaR4ebD9X8E49%2BJPAPLxwMogM83MIT1ha6911C3pdcdGNrrFiKANF3mLckLrK%2BP2v2wjPxW0kmde7FScHgEXelfbsgr9R2U9LESTN%2FYiWnrLXt4149WL0Gtz&X-Amz-Signature=7da86822b0dd473adebb49bc40d0d55dd95d8bdbc7a39c581ffd50933527eddc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664VP4KX2P%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHgUyvNZSOuTjtdHOKYPI5YsG%2BSg407kWYYGOE6aVI2cAiEA%2BTvJx5bBU3Ocgry7BtBUaZaTliSD%2FbgaU8%2FQpCaOqPwqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBhM6x2ZKsSV24NzaSrcA%2By1Dl8KihMG1NWjLWgoIAF%2F6BKvg2j77c3Nu1H%2FLTEk6IbT%2FiF1coFuqIHC6gb%2F8Sq6QSh%2Bkpsesofbv6G%2B0fe2tr1dwWRJ879arCz8mmph5ZtAEUAH5BSAlOo2ZMGGhWZlPn%2FsoAjGg4SoyKyURMmGGJ3G6bhqJ%2BPwERfX3AkbezlQdu7HR6UKOmiD82x5qbo7DweTdWpI7PjUYgRmDDbsM%2BhkRr53D5t67swBoyY0EfsKboeREIqNeSFS%2FMhCVWOQ5aBZGUPaxtao8GJPfB%2Bjx4hN%2B6%2BfncF9dv3nC%2BrHO%2Fc%2BDVPLut6BWUWEd6R4VQYydnOCHL4YTU6YHNYbAjPhj6MoJ%2BnhJMrzgWFNZITymjvYa9%2B2hJ485Y84fCjgejNjp91gyFDMr7uQSD0he%2FoMmOdBxhlIBRUrgM1oKdWgiwMxJ9MqRh%2F5LEdT6mxcjG0A%2FIiuDMie5mTDfbaWvlUcuyjdFYVZisOOushsI6uxPjpyPVaf4GnXvD%2Foa5cFt0%2FYgDLAxX3wWJOaASaedfFbQSaUOjF8ARW5ccpycau3yJU5q%2F92bpXE7hEo9Fom9vYrkT0SH3Rnf%2BWQxJ0JsVxPc%2BiPfmpRJrQQVzJqiJEIG%2F1JW%2FOiqDmbpghZMLnDn9AGOqUBgSFg61Yo6YAlS%2FdNZvB%2FELU8GxUV6L0E%2FpZPufMjRrzSCvwU3tz6ZEABvSXTgCXf9d3EiteO9xuEZaXKtpSU0YOg5aqHq%2BZQO9%2FCJi2CaZjSXpTpfU2yNhCP5I5HrhedMZmYXwjXV18TZJJ6rfAc%2Ba%2BDvyvgbrCLOWyYIjjCdglozDWx1Q%2BcyThXGQUkTav2mPKZujAINqO5g2wE6b4ERNsI0xQ2&X-Amz-Signature=de2a3469804fa9f8fe81704bcaa4f121485bb0fb6dd1236d67fb7d6c7d854162&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YSTL6JHD%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035954Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCPPmP9DBSZPtjkhoplwtWdlq9qNxaz%2BJWV%2Bjl27vVJPwIgEgsY4QiiWNvhuKn3DyPmMoMds8t%2BWbuNncfR%2BB%2FJc%2F0qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEO4%2FN%2FOsZgz2ARchircA%2F%2F9jpRABlqaNfPbhtshxWrv9cYxWUFAEmvGQlMVJ5r75zFZweM2Jv1NWBGYXUMRko6SZKOWM8OnC%2BI4rzMD4xyW5k4FGcutP8gbMwDAJambCfFIDyAKUPrPGrThEklsUjESucvKVxbPr%2FNjDvPDEdkyONka2rXsB0HTPaSw9YUNTN%2BJKEPcdxZ%2FwgWp2L7lasxUt%2BR1a4Rbb%2B%2BHdXSOxk4%2Bf6kMZYDA%2FRlBHSvdaSIgbxAlLcP%2FQPoSBc9rt01mspS4RUzFpILGpBf%2B8x67mQH7V7a8Ro1AL1FELCLyxyn3Qx9kjqJAfdNUmrIbendb4mckCgdHGL502ETLMS8PQGHr4wiKpYrbBZenNcUMp%2Fag3RyXNxV7QQps2xXnfaG5PJgQUvnt6pAwey6eOk0kSg4kxvnV1WMQ4FVT2MIm0ftuUc5Go0HNZ0lQVGUGi9TLM1xn3xGkuDYGVqn1Hc368bbGd7Wp876ljRuQEzYmDZXq45VZ9xziTMB0hR0lFsCyqxFagQJqiZ5l6qsNtksaQ7LZA%2BNA0hTDJjWoNiH2QGf7hoOma4oY%2FBravS6hbzl6ZwOiZRVCxUPPMX07XVFsuS5A8PMosDUofOZqajlT7GHycLq25WWw1vok3OlCMM%2FDn9AGOqUBMaUSIqBdtUtomR0clDjCT%2Bl5Sa39UXQeMY%2BAL0sh0weD6%2Btvztkxq2hsTHQhBxbKW%2Fbl1I45A81qt75nD4PbF2PJF35TYqABoqKCCDytSfRwhSu7vLhEjVtNMqBMeyKsc%2BBZQwHKsoNHfFloLM71qezDPILz7%2BDETeORNe%2F8%2BsJCXcvPTi9UItcsEB2lE0bGsx5UTmxurJqTGbH3ZEzsxq0gS%2FaD&X-Amz-Signature=599759ee710c37dcc89bc88b58457fbf508698458bec19ae13b77578137d8d03&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVYOEQNA%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCn1JQ4uyq%2BLX4veH%2FJSsUSz7MiLus1iyw8V2A9F5HiZgIgCWVubUGuBEGP1vyioKKU8wCS41JZA0MEGZUhVeeikckqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOn%2FRGa0m2VxROkiUCrcAwl%2FgoH5TqGPuh9dGQsSDFIlKZi4DFm5yoqJiTjYHEmMKkGZYgtTXl3JlSsxcyTxU6xxUEKh3zGDhZRp7iEbOaJJQ50Fq6tDsnlLVmOFXG6z37dRd8imOQI6QvD25fy7G0GgO1P%2FrA5dSXj9b5NL8%2B7aHy9QPVqHc8XT4uFI8SeQd7MYHla0T8gCiXa%2B2krcObVE1V9QEr9XL9w%2BlhNU7Aq87uAwiHrpsBw6Tys0fVG44d1lsEZrW8k2zD0xlhvTXB4OQos4QjJKBb%2BZ2HtZg1A8ilpjWINw4EEQB8TGm%2B2ikJTi2P2zTwqaoBHecj8ageYaVxX7B2Gd8ypYe7oJZ1d98O098S6TmXWRbmnjf2N%2B6t46Cf8nrmvUJhdnfE0Fs2hxU0P3eQ5ZfN9uKq%2B3ptKBuKp9%2BZ6ShUbhA6cJXEyi2GN%2FITWkIUL%2B3eD4AXkj32i7veLspwm%2BakMeY0tvFbsGoFJT%2FveF7BmoAqHfJPDgFz5iUoUgnWc3NcixtwRR%2F2XbievyoJBKVufgGnPC0tivVheHscxy%2BG5PWizvvtG8c972VlPfWnjNB4X7Ac2nI03XnAvz3aKI2zO4QWBQPvqmVBo9kv6jG5jk%2FwW4Ol%2BTIebxZHIyH0U%2Fda8dMKrEn9AGOqUBaW7%2B8YKmFCNZX6XW7SA1n3u6jZoGJxhLwbe1R%2FcNi9AAddzcqFzeiEyU32NnGytah4IEBy4RotN0oXnXNCnYp%2BinYmMRy3FDoGFHYBdxPJXT597X7FZzkih9ayohaC%2BVf3b%2FTqnn5wXXYlWFtgkqWonU%2FrY0WdPyC%2Bbl1T91%2BOxeWWy4BJuaneZseFL884Zu0a%2B6NeY6wi5qUQFwXImKJPpXYtiZ&X-Amz-Signature=154a69ec9559a07113bf1b1e6502249a878eb319dc833fc130c32ea70f6e361d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QHSSOUX5%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDvt%2BGODW5%2B5Y39PkxPyVPR%2BXEU7gS3UdOCYOTR2oQbtQIgD7uRP2zGpUul7BN1GHAZ%2BZZV3HxD2%2FjW6pfe4GKNm3oqiAQIhf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKTVc2q0VP7G%2FTp0mircA52qNNA%2BU5XU%2FxjYLHQs%2FD%2BHfPROkeSMTZWEf5L1vJLOvhxsfCzh7IfVMLLV80kTovrahiGutXqTc2qCpFjU2CqF%2FlxHvmWdBu2NEX3drCWGk34Sr2Wl6sGAwO%2BKvf0xsVPXnzeT%2FQVhIPln5w8M28n%2FkFN2L53fMc08hHf100iZYbl0Abmm6IFwlrkqLFrjHDZ4FhHlTXJw2%2F0As5TSRPFF4%2FDd2zFOwlco%2BanZr4uIJdWiLJMx%2FtDAP3sHypO8uSB4nS6c%2BlSDL1HarJ4bTvxuStAh1tksIHKvOB5bqRFiFxNtDOcI%2FGwUjRtMryJbmYlsmRWgXOQvmfjdZd5wQmFpz8UNVHRaYGn%2BQH9Woizn484wb%2Bj9JvphqmWUXwu%2B0jdc1BoGzw3b7%2BoUvdQbuOPQzWfKFlbYgBvJ89aNwvECyl4x%2FoF3YreIf8Wvp7M%2BpBUjMN0KoqxYnFOyk3Fr6LByG%2BqFbLZQKiRNCxhEogI2GaR%2BbBN62UpTp2IPxIIhO6jakpSEzT%2FARM1LALQ2sTuj5fm9bQQQt0mQctAU4n5UX9e3yZMw6So4z1RwcjrQ3hQvxk8ar2gaxK%2F%2Fc%2FHNNofGJHaT%2FMw%2B33UCTo0DJRtBseNcv2hspbZhXl82MLrQn9AGOqUBKKD6%2BZllta7U%2BEQRG2b2ujmR265zBXfw0p0EN8H3jIxNqWq7FghVASg1gpgPQqVwcFMYqhdT59W5ghb5vuv4c2PYpBq4ao2q3DGtWLJKPYkj2bYoEooF%2BxTW%2BwlrULhsqCt7s6v5RtADWmyQ%2BXpORuM3%2FmVMp1p6awP9qy69Vavva9B%2B7CGEOR2X1JF%2BRsHPxr0smM4%2Bpw58vkXUBpYQLOnTK3ON&X-Amz-Signature=3393477ba4c64d9485cd7cbf8db8f36a326a54062710d95d7cd0949b368f436a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666G4EKW36%2F20260516%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T035955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEp%2FBVkUz23KcfWgaFhzFJqpPBFKLVhvo4VmEpEcys5WAiAZQa2ePN8ri9YDRrVvIM43Raw5h0Z9C%2BW4VMQfl2uE9SqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMtLZD5Qn03HrIOAF6KtwD02bW8fQnrVYjyJJyFS0Bf%2FjpHDsILmrDuCoMPOkezPkfR5mY2STFV3xViOsA%2B6IjZxIbFMP3Vj%2B41O%2FGr5%2FAFejIoDX%2FPLoA%2F03uYTn8tV1WsJ2qDk%2FQDOi32VkpPFOT0ND%2BSa%2BQlrraNMdKCs2nvUS%2FpVB9iUO0s%2B3XXr3ujFJyGk25c8wM25b91yeV8WWQsILVqtVkViWpJXxK4BH3uXB3qO6SbYER8kRtdGOm3xAM5x2tMT0%2BjXfOISmIVK7rPcutrUV9sP1pvf4I1eKBSrlXm0pVb7GDOOTFBiXImb05uMSgqeiTiDiGKliOcxcTmhNWVJNrKCKzfpcMEP5CPNQKLXD1zCWwIWdGZoRbeImkTU2399HsrR2ZqiJK9dMG1uGokSznMnFeoiaxRXsYZ28KjIKUf%2FCE0gdS2jQsZyo1Oi%2FcUGbwC46ArI2WeWWAmLL81mLv%2BdM8%2BClVcPxxiuW5CelZcmDvefYtngg7spiF%2B%2Bn8SIecLILSAii63Ih9VYGnVh26lUlMeBSIY3GI%2B4BGAOhml7d9RCVMRfMz3W8TxgZOHeeh%2FRzoa0mnWKGCkKOeu1myKVwYmO3XbP2KXHHCJSdUlMlghGwo92ruWlVq4HszkKupx1vma20w68Kf0AY6pgHVAUVA%2ByTNETL98Iqg3LhQQAUGtUydIKoQmwQ06qChLGx4m%2FDy7Qb3cShm0ajKmm3VWAndsxF5a8YjBQOJOfjpq1qIXHnV9%2BnDO1lNB296rqq9Vd5JDUwHWZiC0seTKaZN3rohKcwwwQUW235WAb7L1qYgY%2Fz2soabzXC3r5GznUT6vO8XVhZK0%2FQ0j6zUuX8XDkM4hNlYwf2L4dWwwl7na2WbnWkF&X-Amz-Signature=e764c739b3b5364ac1d367ae5d464886ae3488a03d5290af148360bf529cb2d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

