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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663BIDRM3M%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041847Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDL44uQQVAFgm8qi1yR%2Fy2foua4ANrXIqBxp7h7xCXazAIgBakLJUsOnn6%2BZdC21u3Xe4D6PlDk%2FMpeWy8ACmlO0lAq%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDITw4kKmVsZfKaGqBCrcA%2FN7rXakJJCEDShx5YxEuYJqWmvK6fPXc8m3u1wXnAau%2BUiWjgWg4cGl8eJw5IVqikrOqUnYzoL4F5DC2Jw5RhMX0iMF92pERK6B%2BGNVo5XxgOlulZj4QvoqV7V4f0P0mqwZI8qpOOaB93mD0qLYUcc7Ng6eVEnPbWXa2KVIfLNewwO9d2j1y%2F5mEW77w4Mr%2Ft3m2FliEn0Xon4uhm2IzuT8T64a4JzXbR396zUtScoZyUtX6m%2BzonwNID7CEN2ZL%2FKDtfAnuupGRNHLiuKi%2F5BOJH6JBv%2Fc0sc7E5t0RbDt141FlprE0n2E8GB6gwP%2ByCOOK44Od7gEHO%2ByJHWy0rbOIonLTz6n3gHR0sdW28L%2B8G9j3ZhISmKY6bfEjCtHZ3ABqjQNZGG%2BwDApmF%2FvLJgRfFXU080dRN4Kn6gL4ZhbIH0nOCTGyh0HfBXl1iMgHfmt9cl2AfCZtkVp8CTAZDHCPB8t%2FWIwPcB1TdOTuS%2BRNUfMY8%2FVHO7qKgvojuN8ttH9q3BiT1AHbITbhgVWCH0Mi%2BkzCD%2FN2ZZ3kDrc4mWyh6ETNEZm9v5VjxwfV5lHrYXILsiveWnpoQgqLKYXsFQIbqcAcCPCCP3RdXTUW%2BUywaj%2BS10BBU6yd2aEMLmljtEGOqUB3TxG1XlxSsIjo83IcK3EaU1EZvJ%2FFpO33ENkbX%2FnBXpwaDKwyWTEdAYGxlvJHnnNhsI49%2FJjLJ8JUwUbfZcf06OJXc%2BQFM95LSaomc7FSTr1W3GCijPuKum%2FoyP6yZ3fUCwOPAD1i8R4bQqj%2F46bEEQNMqCD2DilszhwkXG%2F3YJFii71bnL9d%2FgJgyfmwS9So4TTsitND%2FBYe7Iq3EQqosC9scR6&X-Amz-Signature=c4e0c82a406793125bf59b7d29e217e4564cd0dbcf6fae6cd783cdab348b1991&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663BQEZCV7%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041853Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDPOMx6Xda4vKyY%2FxJBQpkJZUMHOmzPQPOEY2qWZ9Gp3wIgDqN%2BNYH0crbIVKEzrPoVknLqyfLBQ0XI8NjiO%2BL%2BWnIq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDEYCjfJ89LcoXJVn0ircAwxWul2H4jEdxgA7cLTIIf%2Bzr7Jl%2FJF%2BoymuLh7MzJ%2BTGgi0JWVUgSiOT2BJJtPwFX1%2FWfK0rasoztbpXd3vxPImY3mxnsE1gTn%2BhHjjnB4ReRJ2HUK2vchUxtJ4fAi9PcLcajk51cUveIFtbAhN8YZX0eN2KKUrcYxAfGj%2FSRi6k8p6HtByqY0QtwQplEemp3r1D6a6VQLHN1XhNnjARLBGUnwFGdLrds%2Fw2DNWqXqWr6ecbv7RAZzmiBNptjzwAJkKxqqkbArGQNQHWo8qgUUSj%2BEPzjAizooSbaa1Hjxh6I1ePz8dMYdaeWH77AeJsGPWejBRKBWIGQ8960M9P4%2Be%2F6L3u%2FR430xiVkoNqYSMzhhJ%2F4RDx%2BgkLVSXLde3CLp4H5A4fz3Jspf1ABOkR4D2nbXkntwVhPTcJREfqf6NEKDRIS%2Blkj%2BWxxhQXZPWQhNFlx4ClxSh%2BYFlj4%2FRApM36vaFIuaiypj6oARXVOgUF%2BlyVbiVVpPX6B%2FHD4HhIQXAXs1%2B%2FBn%2BcrdLuk%2B9UXqs1w6f40FGe1hD0w5kDgIlXMzNlO2QetS0eHFdJ2cO00WsziyTjjnJ3LA%2BmSOjZuPUIh3KT10wYupLWKN1g5bylHsuNOYASdHulP7xMJmkjtEGOqUBvByDLczPNipqkBW1lFXdWblaTEyKeiemtnqCflbga8OgbGLN6kt6Qsce0kXHHC9XLmHMCd5LNx9QMCeRndTTt%2FjoHLjaU05HZbCncOa83pPJEmVTj%2B3c68qqRbiKP0M2JNLyIXlBVuGWW%2FGENU8gfWOhkFss3fZ8hrEFg25hP1UTb87UezG23RdHczb7WxYb5gsU8Od181fsBovnqjC99C%2F8JHX4&X-Amz-Signature=fd70edefeb1f3298773dc191ee5654a8327625ab76817ef93bacfe96807821f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XEIHPJ3Q%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041855Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICY%2F%2Byb0Qk6NxZoTWY3XQ%2BkClrqjBnv3BXSXkMwAGs3DAiA5znAfdCNXpkVt%2BXW%2FaIDMk42yK%2B70JHF59EszC3gHGCr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMP4ODfS9TqVTAzGgEKtwD%2BNniIpmjyVFTQnU%2FoFxKWx0srf8r9qIW%2Bc41hi8IqSBb8Vimlu2zPr67KyKFz1FmqIX6nwPKkL6uLvOt2%2FnaZYMeOQ2mZpOzYmvv7GFtCeRgOIpkEchhMcK4y5gAB7Tfw1V%2BoBC2vob2gWg%2BqCxaE6RFDc8ap17qCe5ZiegtmXgEHV3H1VSPSCm1wgKUQP%2FNw14O1FPPPBEI6r6%2BCOLkIEH6fP65iVc1CIwSoGCr0VLgvXpU%2FumDm7Gc9IQe5U1qAnciP9tCiCgNS05AQr7pA7gvBxOqarH5Pu0jBct%2F7TdGLdHhNhzXqDn1CRJrBMNAo%2FsqIC1j3xlkLZbRchyHtvz%2F%2FvuYvRB8GPYL4L6QtWBkXxTYg6jrhff%2BlHb52vA%2FDPa6uahXs%2FimqxPh3wfTv6d2tfVxH3YmNOvfvPDjY5sWB%2BDBPU4r%2FB8joT3gJoHpXpBBToVuDQhzngZGoEQp443EBuUIqr7rgnt5K9o6RpS7UFDpq6t5YWXOY3DXav17fBV9f02rE6NpiXgSFCq%2BD9LezXw44n7urX0ur42Grv44lxVd%2Balqq9E4J1YxbU25bcwgnlQlQP%2FdmzPjQEUY22q5UNrXvyIKsFizxwwuiSeixSvHFOeX8S5nbnkw76OO0QY6pgH%2BbeUvCqCTiniMkLmV86RAmXR0iC6OlxXORPgc0Z0vL2%2B1X6kZz7M2bxhtsLhnOD7%2B1szU4d7odhTm0TqMJ577bD3jn4pB%2FNRqoxReipkJRauNPlLD%2BhCXC92p6lZHqtewiHKP1OTb5OhdRreneqndB%2FNw8mF5BQL4TGqWg7EZEG6mzZdhnFRbmBbUJiA01aX0fYC%2Fa1Q6l4GrJueHBtTC1W8Qo%2FoD&X-Amz-Signature=e90e7f332e7e520dc0a2b44206097387b347edf1722e667f5aa655985b30ea24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666WLJAQ4V%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041856Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCxfsh01mpJfuyiiIdwWq9tD0DwgBzUDfaj226fmuGmIwIgfuqIltEgVTB7rKwH9fP0kbrQ5ik51bC1foZ%2B0sO1iLsq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDJVwdw3NJe90dt3GrCrcA0AQi3cZAgr0UHo059qTJZh7iN2phWJ9fMH5%2BHAyjyE0VopV03MsgTSXNKoprw9mv7ZXfd%2F5KikL1%2FmEudzSx4zDNswEtfe0VCCWkiX47uCNMHD9U736e0I5NRO2evIIfMHYmfPt8Injx1EgUD36gXeVN6jQGZZZPwG1nUv0SL5%2Bg6ZZmAJEYvshj5CMc6pysuMiyO%2BoQk%2F0d4S8C%2Fv0kLBDm%2F4nGaIQsgjvfhPxEJPrWNlZOvhwPESHf%2BURwGUahthn1IfNOaK6cPJ%2BvgzveDqT7akKtZrxFPTmd23BqedtlXV9H6lAM9RnIYftU2ryUunIjYDNvCqu4QSIGmNDSyLz8F8U0u6W04oa2tJPltDh88XqeawHONDVjGY7%2FjKJzasDjJDKCQRC8mnu2J6RKjm9zcPj7P3pGcftW1OnNiZ9F6zp1wO5OvqW1LfTqeXDYvkuz6QC5Sp7Nds4oLnSTuBD%2BIkm6s%2Fvn3aVlr5DwZpIONiNsOFJ0Z5xx6xgRb%2FMTQv7AxBxlZmW2yKGdlwQ%2Fs3pKDRvDLVMfJRTvQNG21RbFlRgdW4FE%2FuKJFMRQ2VQkqPY24NLeP1dPvuggjsw%2BDrY%2BSgnfP4d2bM32JdfqoFTMygH6QBzGLkvCNfCMKCjjtEGOqUB%2FTa0IwkEC6pvo9vZTDOrqU0Y8zGZBgEpVERtWJ3b%2BjerLn08tvQJIhjSE8nqAFCQYr3iEzwfU867rQPYzoVRwQ6g69JL3UC3p9eAfOB8SFNbkc3i%2B8pAGt99uN1MFuy09TxuIssH5YI%2FwaJyJGliSgM4aWJfS8fn6CVpk22PfCya8yK2GpcTRiriSiuXR6ywWWoi97nFlMNfSjC1AlRsdVbfh9xy&X-Amz-Signature=d503af684ac0ceed3b63eab2408386c086f4aead0cabf3f0290558014b30e66b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665J22JTOX%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA6aE6cPAEIJ6tMIuFFzS0tcd3M9krykDYQemsJgwPe%2BAiBjYXyrYp%2F9PG7%2FQCwgEPiVIkCtpsXHzAEPZp%2FIwDCjSir%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMdCieS9NGcaRaIrtMKtwDCr98lBgA1qan9d3Y64%2FuBOqdNTGchioCXTalzEOQ6mwm3MQyz8cHfrFSfGryyHji9yYr6C7bO6zYxHO6K4cRwjFirW87Unr4k5uVlHbPbTSi0%2FIbXgYSnsaE2naF0I6yuz2EVdKxje3L7VQFpJd0drXQDStixFW6LQuItZLtVsOPF7BZ%2FPnpcpbB52fIJKCQebR4IQ9kR3v5QVRLMSEqcGf08v8M5jync%2BBYON6DarhjHM7T3NTYdXxh0%2BDyJVIHeIydYBNHXb7Qv94yB3ujv4qz9QvAEdboAQN5eLuU1AdKUwohc0AE%2F%2BgCXuZO%2FaVMkfuel3dNVcP7gNu5rj2ipKEeVZjJx63DW8FOa%2FKucKvzK8IkujqYej4pSIRwm9bcj%2BIXQZG4f7YYIX5wUmT3XuZ39YeWKVXNykBMrNuCYzePTcElxNxpMbW53xXIywr6t7kXHxmC61IckRL0ymfJ4lKhgweJ2LcpE3wTJiVZHV3af3itPYk5nF6zdpj1kHDNC8bDcWofa83D8wtjUiz53Ly8gXcB9Q5rW3Y38IquXffkrdTfLygHvO74Xx2lzzUnf4iBNm3dDOFhxfucGvtmqhOtdr54G5bUnVLd4nN9qY9%2BNmBYNfah15c%2BfX4wyqOO0QY6pgFa9X8MQ%2BvmTaBVwRXa18GEGV5wEt95DGT1Nsuei5sKYnkimOMmUMFI8C03dtYoOtWTP0yOWJWc4J7kbAVwFo4T8Y06LC2MOzgfOOJhZnr38qLwrFzh9xjBVwCeUnTfOWGi%2FwH0q6q4d9Yovk9s3umWkxeiuYZR5bbjD%2BiEVV2IGeRLP%2BEvInIMv%2BNgK5ftFrOJf4DcuCkP7G830UdKmh73Tw1wHhbs&X-Amz-Signature=3dd808b9e7bbeb5eb6034e2ee6db82f55451835624021ff9f71a31a577bead87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ST6VBON6%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCqqMBZQtMyrfat2%2BRBySx2NCX4IVXE4pm2PdXyvobmvwIhAOkh59E5EbMmVtQtMQMzhg4BTmNbDaPDdlFVkq%2BIGTUdKv8DCHwQABoMNjM3NDIzMTgzODA1IgzgWayfDQaY1Wd95goq3ANn4EUZXbOCA7wvadCYHfA45YLwAY5V7wV89A0baKHlfPqGWvAdEvtkmA7SBPyFMjBOlbTZ029KnFmQqSZyz01y%2FFrh12q%2BwFrjcgEGTyF0BybneRk%2BumNvbodh%2BMQSIMuR1lPskN4vG7O6Sz4inmuBei8IL9gppPPw4%2BesARaqTgHIC%2FqXEXX7m1FCoy7qgRZhVV9eTbz64dQzIHiHfFausAMm8avnkzYmUPnbaeDELsVtEE%2BrrdkcXkUt2uedUtZ0dmBbRRn71CL2HusKs%2BnTSbTvsYwAFSuuYs7xVGdX1mRhwUxzo4B2RtbbHS%2FKMILFYXy72ZgAAzuqQZ1742vJ8%2BfVnpUpyM1x9A1x1diZxrz8fXAWEzJobyR4dr8jwhf9YxxNNoXOD%2FdNmmdRX80TftAtssinKFNr1%2B9aNzhBXC7X6YjMtj%2BwRTL3rJzi4EG%2BHnWB8NW%2FjDiHcEgCI9rsJxmGC%2BK%2FvENtIGGiH9Lx0zt1eZAoE5RBI26LnVXMTrUVf2MRTRDbFXHnJgI6A1iQe3pPkSqYPwsm29LAiq2UA%2FJSLduhYDq48w9UV11ODQ9%2B0ZbuMatq55JHW%2FN28OdsBrjiwTVSvgUQrhO0WMz64hQtxXXerfDEzcx83zCKo47RBjqkAYusGlSzRhrIBxDsh1Vy62De42HwT3thhay3kadad7swj%2F355QMCXDteGg8c7EnWkQPlXT0Um1hy0sIWM45HpRi1emzcaRAn1hJbdsc7Wj27n%2F5EyBusYEH8ECjmkjCGdH3pXbgncal9fkDAZ1XqX3AoZsQj0eYHqvqefUV5OrJlxYrdgo%2FvuhhvxMrG%2BeYH5K2sacBU1PwL7hUSSiVDNjFkRrQT&X-Amz-Signature=9e9ef52878829d177be01ffa9a2d1476927cafed8f7ef95eda7ed1d4b7df96f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U3GN7IGN%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041901Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF5HHop9bphp7rr9VQxQeMijW%2FT9TMSiNs6%2FTkNO8e43AiBRqk50XK5F4u0XlfjQiU4X3489gHS5FVX0Dm7%2FwCEVuCr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMqkay%2FmPIJOMWahU8KtwDqs7oCeR7NzcB0Hz9sGv7LF5ZqGloW%2B%2BnXPRXse1KBhqWgjgXYo%2B0T3hnuLP0%2BWNkbkMhhMl%2BPDn2PHeASo4Ge7aZ5aLzPdW%2Bop5rHJjrl0f%2FhqYCT5wrjPA6Tbgu4AoEpELVoic7nO68%2Fl6EEUr0DF%2BYpdyUf48nxMyqSqt%2BlhzVvlIMe8IyhgBgdxB%2F12uJAiSHL7PJ4YSHH%2B5wubamSQlggeHzek6PVbrfmai7ZYXUHHVGdi7O7qlKOSrhr%2BloIqO9zFM33ATZCxga6dCNHuoXHowm0S8jYbVR1t57lU6YZyUSsA4SIzYz9a2%2F7WtYo10qgHX2pKEsmtGD7E3CgEer9r4uKG1Wvhp1rW8r6HubzjYLdBLHaDrQT7yqiFLsHjNuXSUDK9vApf3Jq2XRlbSNEZ9wj2pAwKRjp0lgoBy7z069Yz62vBpQQtRae3sonXVojoED34yJs%2F2z5jPAZMI7U3dfJxpeTtJvLhKgeao9ywJi%2BrdF%2B6E1doIKxf0WbqWP9adcSU2JUahGLW5z2iEvYVZlvKcQeq0KKyL51JZot%2FBC55jR5U1bfxocap9BsDmJS50IgPieG%2BhtMPLBrBdpmKOFIwDTn3lxBZui0nidTWVrF%2Fwysa626D4wxqOO0QY6pgHoHaQBPeTR7IrsUuIJgIeDwDAruzYAyC%2Fo2Nfh80imRdh%2FT15shP7K6qR9Mqm%2FMko4L6ZcJDyVjh5Lh95tYRuBN7zuIwFJ2l3tFu69xGqI0W83ijMDAj45rn0n0ff2SDpGMMctP5rrLvur1S4PNSKh6%2BGFlAxkdNEpJTBcu4kAgIdHr07UNko1oCtXTaH3v5e7JxChnXiX%2FZrDUEuAc0g7hygtI4P9&X-Amz-Signature=4037c386fcfc9eeb273593c27b854174e6d23cc0abf2166feba6b55f62556649&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665QFJPLJU%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDnCmxS%2FnlEV0v8GYJ6ailcJ2TU%2FvKOhOq3hwc6AFI%2FGgIgG84ltGwEE1f%2FzbkjiGFYZEGj3i9ZEip6VNEym0UfzWMq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDLQxCCzX2vNE0ItFHyrcA2KVE2o2OIZ5bqxJq7TwlXRgz4PHC7pNU1QgVtKDRS4TIzpW%2Bd9HzCaqP1v%2BCGDDGdkUBUwcyaXRULHbpsVI2Y5gkBU%2FQWkvEEw3UD%2BRwO%2BJuL0zvTuyJCOe1EAlvLkeQVXcXMSaTY2BE7KjfomcP6QuxXap0J1R1G%2FZOe82cWJESWHIsO1QXSbeATReo2CNghNOKJMCG21%2FUKWY8nHkiPH1AGNwhJ9aiGxU7YxabzhK2RZXNgnikyBtMAU%2F65TDWT5ErmTAMGiXhgyrY7F0Osqh2kO%2FpzfQCbTgN36fKacnQP5%2FsexdlNHXc%2B%2FmmSaTa9inkXifDZZImbpxIWtjYSZ7KyQuyyQjIfya%2FJ9SRB6VFWrh0e95ShciTNiE8H%2FjVUhojKnoDJkQuz%2BZTz8mQvOMq0zq5%2BbjW6Fy32DltK1LUWEHsEhg9avOYznxJpxUX1P3jJunMuTyMVHiiRAdsqmTWx5zS5UyX%2FfS%2B9cwlpPpj3yaXItLZNkQfwb3KJHZM3qSdWyYjktg%2FRa1b88Yrf%2FqZSfl96x6SVXrEueZKXLOQuppWwHKd9tvK09SozATdCllOwa5Cb4gS1BfTXQQ9Pq3TuRIf%2BoW0jfvONajRAxfZHIvuFfCnxN%2FD3RHMIqjjtEGOqUBee1CYsWqs1tKEpGBNvll8H9b6LcDqoI9Maobc103J6GAcG9MmB6jwytNoMmLBbNh2zlzqT5I%2F9u3iISyAiLFhDaCOJYG5HO7nwpatfShgPmoXWu1FL2bcJyd6iwMLB%2B1kdBk%2Fy7Q4dz8M3lOo%2F7UI0kQRVW8gHoXVd4pBFAYLhIlHJS%2FNkLtqeWiTtRKCrr8up7aXrcN0DoqdQzCrvDzw51uGmrb&X-Amz-Signature=529c2f34cc5e1c8ebe0bc5db76ff38fb856170df14d05277357ef5d58b9402ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W273GKKX%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHsb9xZLaBWZB8zhW8U6A17IJ6DhsvxWjMyRyNWDi0i%2BAiAxYcVW9IaEff84kMxa6a5MOJRCSb8cY%2BI83%2FBB6aJDPSr%2FAwh8EAAaDDYzNzQyMzE4MzgwNSIMa%2BCsOpnuxGEHnmK1KtwD32bpxiNWFaMRae3RMMIsA3UnNUZH0QHkW68zRGMMBkn7B%2BI2CbAX1io%2FTNW4ZPUvjEctfs8u9ZGSDDUg8%2FHo8RuFkoaZNS63bxc7CAPvF3JFkIINZN%2Ff3IkN4GdalpRdXqjGLKEyY2K6sBL1Lfm8rKoQ%2B35uQd%2BH6oZw7a0H7Rg3Ls9KiEDvwqaolmCouxxb0%2BYGRd9Mk6U2B7adFmYShArBxrFadukOHaMFQSWxSri4i%2FlpeL6CsdkHwLFmFd18UtCpkchBNy4Z9wBzh%2Fbd1Gz4RcI9qDK5KAxhBnj6r5MN7xlDvnkKQ6dCtvcM31X%2FPCP%2FJelXbXzIk4UW1kIRzclA3v3UYB5Qqfhy9J5y4RukSaUNa0r9Ob1WniKAqvEaEsTxOKwj8HxzXoFqbGCi%2Fp0%2FzkQtxCRllrHrr8Fvk1ucA%2BDp94J%2BQoXmG1eJjQ%2BAWD4JKatY23ENULDxj43kxTsznigXU8ihDFT3onApqarOrmf3%2FV%2B%2BFRPUn5%2Bhf7pLeEUF0bGDsGVtd2X38WPOfyfoqKLsKpjkGKW8EgbdFQvgqW1Lsn532k5KMVFtHDgWiXzbBySUZKOHZPU237B8onqJzkOTWVobIrJxG46PZUCSteAYhU1pV7XaqwYw8KKO0QY6pgF%2FclORet8rMQEmb6gNJalIz5sRG%2FYXgbztLC%2BWCTrjArpT%2FFttbcvznadLcDtRBxIto0GVXEReHUptnZ9yzirdnj9mKVHXfDLsl7e9eauTISRN4uthB%2FcC%2BciuUVxD9EMG7yohFNkUypJoEt%2BHcm%2BSPhKMdvg%2F7xi9s5JkAuuzuu%2FpgGCvMZtiixhB4BrthFpA0YHMj3SOtvwp6He2oBONehj73JVB&X-Amz-Signature=216292d56e8ea910dbc6542e287d79c73c94cc2f9ee237519cc19d4d3dea0f50&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MEG5ASU%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041903Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIH8th4S33zTHh8HEBaqyuoAMThHpA%2FkpjzVnl0OEHghEAiEAsH5b8PM9IR%2BcPGZYYLwjCGBCv%2FUhiJUX5feJUAoKM2Aq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDNC8%2BcNvF6uoh4XVpCrcAy8CvLxTSLM%2FoTGuybQbBgYVBdr%2BhCu9ftw1kN4npOOqDAw%2B241g0fmlgakKw%2BHRAbyxwUsRYyR91T7pfF%2FTQMp%2BSc%2FUMsI0ZP20hdJ84BjeoBx4bPW6194QSUyNk2xtgDX9NhxwfSuYskxRmcvHeiNFut%2F9LFthAjIUH9s%2BbTQOqbJO4TLrURmqHBwOz1D4RTIAsKRcJAmEBui%2FycNnVqMjmpuaf4ZIMRbzH7ETSzhq5dxaceFhJ04nUN80oBG44S0JKg6OPuBnIzHNF7jLqVP7pxHJDdqKUNQR2meTxc6TkFe7YcBE2p9vbCaYie6Jp4Z9idy9Q%2B453QrarcGHWBuxLemV%2FRXLkPD7xNOGlKiNW914%2FbsfzNTsF8IxbxSfO71y%2BlOCaPaGdt4xBSWZ3uTzEE%2BrVLXz%2FJcnjgkXQYO0VYpjvbPt%2Bj9cPzEVFtzxyqngLr71iAhdS5j5wc254HkimneNdCfk0bXZRDaYPrxxpBdasU%2B1%2BlxFcPydI4bqAG8%2BaxvF%2Fs3UgyJbi0Ll5PdbdyLTY1LZRv0a2lxvAyfrMihuBBRRNvCt5K69cUr%2Fd1ZN3YSSTTV2%2B6cc6gURxEGeGhF8FQGrdkTOtaRcOX0Kckv0bVtPRQvWAH72MOWljtEGOqUBQPBRgE8ErZbRJc2Hl85imjF0dGNyrcBqmec2Ec2W3KtyWLt5U6sqMceawV9d81avkWwwTmeXy8eqAO52W6k49mIraSzrCw4b7%2BUhyo%2FG4yV%2FYzotuzdhyiKamuRJo%2FNqnS33XyoYJAxe2hOKKRhpTqJOwrUVqm3Eaf0T%2FF7sn8eIGpI%2FxX8n9K33G7ya8C8Mf99aVlqxm3YHo3N%2FIG8TkBgXzBMp&X-Amz-Signature=33a5be30879058d6e343be1c07eef6493edf42d37c01e7cf881349223eebba8c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ULM6SB6T%2F20260606%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260606T041904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDnd2mRPyVEwK0BkveMYz3oUK%2BH7njlq8pPqv3DHbMWxAiEApnBv893D%2BlpDH9InNusSuJbOJxtVdDfRuRLtm5eUA5sq%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDA5J7STbOWGVyRaiQCrcA5KFStgEeiH66sCcyLmofTOQPoDSA9KWjr6Z3h%2Bcm9vc0tQdkL6duF8xYjHzCXCeTY9%2FKJA4vAJb3mOCyXRwNRdTIQW9S7DrYfgLsfAo5Zpv3OlrPcKH3WUcn4p5OuP03ANk1zMSg5ILJVwU3RDYSym4f1gFki110opXRdfxGoLd6IEejtEtCtalU4iVnCPnyNg%2ByEqe5tLBP0gmEl25hLOCcBpgRdNuOmCi5oFYnPAZaF2WVhgV2zpiwAwLsffvmwlJVY7A9vw%2FWCi9v2tUepeE7koigciLH9paOXUlQdRrw6336Vey4Q4dwGtRKqbu24ptqGPL3XVy1VsqE3XHgYwLp7AddHR7F0VoxON%2F2FBBu%2BWFwHB9GIPZRlAI8KZKIxNkCt6ycGgb%2FY8gGiCbWG2dR4D6LR1lzbk18i%2F3MxmBSNmVAk6Bip1Thi7%2Bzt85pZO%2FYBEzYxI1YjJqStCzH%2BfGY1z7lShjjGx%2FnCUoHfAznwSbDMqVdKIcZz4iQduvDf1LvlQSnpVrndGRhu750Q69dsglgKADp24NNNKoynyD26BWrAUta1Ix9NGm5nmgW31St2avOJF0KxzjqX9sLm%2FP0%2Fq%2Fuuy2YAwumYvAm%2FXxmUwQPMZ0Vgwy9peeMJejjtEGOqUB51ypJ7TQ8tDQVcyOPe0melZrGW0uPkIuT%2BFbhSCdIzxifXgzTnxJDx2wJX2JAMQWpTtH%2Bm3PQnYmd1%2Fidds%2Bk4Ae1uX3AmKeXzQ%2BmqrKEgTJ%2F9Ji24%2BQ8ZqFX%2FTJqyCE68UcrLVpoCeAC5FD%2BpgxqdT%2Fji32DHt3sajJRm34IFDM%2FRKwMF6AH4UxQROp9DrWvwqp7WjIDeURto4TWJdcggiq%2BJME&X-Amz-Signature=e47acf762af9e148f41e573ddd3f787470aef93e1eadd132452fad90e65ff976&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

