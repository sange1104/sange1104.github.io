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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667MBSZZZQ%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDqVtZvc%2BO1B8S2Im%2FjuduYzSx%2FGj8xRdMPesg3CpFumAiBm7lhwaNF4l%2FMUW9LGWctyqGYiRIGXiYvRAqDYSY8itCr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIMUHvZK11f6nm4O8l1KtwDAWEUJmw4P1PJgrqcCZUlfDPh1lfIOqpR94uM7uEJ77iEyxhrnXnjUxUxCWiRJc%2BNRqqh4tSRtlKshuCjQOM8%2FjX8pXA6tkUs8kOtfj1858DnHfYYjl5yOiXJfKWBdz2vMdEjhD5gdPk4r28io88Ciqkp7Uf%2Bakcn6bkboFvSPCc%2BdbTiw3Y4SaEmGvONsayPQC2E%2BafNZi7jig6tdE10sQJSn0bPUR0LW6tHKN8%2BOTnN%2Fx89MFIkfTFdTNILOzNEB6XpAqEcJeKJB1eFrFOXT%2F45OEPec3hP1G4zMaG2j9IyUHr8TavKgJWhDnGpuySej1RqBoiJZ%2B7r4F9trRAirOYyXYhlA8SNYA%2Bb57M3SZCbweXr4E%2FPQsutIXjlwwXhCNBu8qXuBNvOQNfjNxDVqMNfT9eYtUqmi0pTV8i90PD49rA6f8E4%2B7MQrdhdOpkLmb63PqGJYIIBmf0o9arTyX2xmj1VGClfPtV02xt9ZvaHl%2FcMIg5ybXNivQKETgeameY2kRrfvvJWb9E08odxAFq3VaC9wUouoMUrcdM12Zorc78BhvEkMBJurjvREcoAYkAtNopc480JAYkBtaVthrPldnKgAW8L3dhHryZgMRs5cRuth0tzEVVdlZgw6LPO0AY6pgGvp3Ns73Mhb20sUDjo1h8rHFsVPAsO61ANECJTGQprj82NfvIorwouSQXhlmgAUgIJxzKKX%2BTt2DNSpj0Iqha5P9uA3a0vSkhvU0gjkGipsnM6JO7FwrybOZ2PF%2F0EGj0qs5lQfj7U8LAX93Gzi4lie%2Bh0SAxjpBEuhZevQ0ILGGA7z7EoE9z6iW2RuXjpc9I5XJ46kDNDFf4eToWtq76bVOH7yZXJ&X-Amz-Signature=eb6f54d12304c94816eb953614925f8e5fd91b065ed7b13e0dc1d40305325e8f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V65VR7R6%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD7S3VxBJhLHuY19bNUP3UsVrxLaDHjjcV%2BQiBHs1QqXwIgXMMOJ34OZZlYkWoi0MkQ0THC3cpcjvMSjHs2OEHAb6sq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDKLxKvArZA79YNm5eCrcA4msezsEm2039d4KEgLzdaq%2FL8cWYCGP6ZPJA%2FOMHLPN%2Bf6sp%2Bx%2Fm3NVEU7%2BYNFl%2BG7CJ4rY0wszZTCmYUcd3FyGgVDQR2UYVKB6Nz3XeguIMwaylAML2b%2BT%2Fz%2FDX4Dzq%2BY0LX94fdC6ERt8FSbIt%2FZ8nPZPpbbfRAPDZyaFeW3R1N1mGdeNbvbW1a6ZBrdrkwzI%2FgPeLKKnDOUwrdPV%2BHOKf14Tlinf1j1hYj3elMbjDXt%2BLQv9S2bblX1wm6cjnA%2BLY8O4gU5vTgCjV4QG7wLwXG7EAPxNPdazkUbQ8qxwRhwD6pRYmuVKJB%2BEQFD5DJlUKA7P07Z2uVSd4W4IySbsy43kl5uTd9NYpEMgUT0JiVSOGHtf1Hc2FsS43brujX%2F4vNrZpd3iTDiUOTUKdFl9cGtiJ%2FyDhvIBmgF8R00bOIpSdoY92fRdKXYlmXS9B0sts0BjCy4nRTPS1k9ybPppc2kFe3DiRx9NTU%2FH4BLZwgL%2FrvWb0zwuJPpjDss9QTNC9KtEK%2FL2UEGoEQHsOEIPcUqEkpYJkLcHSCMUtknn4IXRzwtm6ZNoDT9vv329nuAehecAnqPfOug9eb0DdEkh4%2BNmE7NuXebCeW%2FB5dEi0n4IMwDFJbgAjrHkMImzztAGOqUBFZNDPWKyhqFTEbXSM5UvnDjMscYTm4qRbpULRjr3udp99o4VENXztlJGjmAVhcbqY7octKeK5aopj7vZz4r2gQMzgBLTy%2FBknzgB9rVbprbLwh1JtL2nXVt0xpqB39F4bgMYGQMqsKsMNXG1FLTRs8BMeHbY5xcPwFYg9w4c7icUnTITdP1GaxY7dzmsA%2BwHfbwLaEkhf%2BZGgRwx%2BrQ7RNxWJnq8&X-Amz-Signature=70255379be9b66fef47a4004b37170ff2fbdcdbfcb1c26b34091c05aab26414f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RAZVRB5W%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDDNngvRS2JOq%2FGzpXar62xksZeBwtZhBwoSqWJ34Kf8AiA6TkwcVfSvUhUwUAOM5KHKVxQgdWnM73l1kH2PMxhblir%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIM0eZbbZxqwMQlC8obKtwDm%2BtAQdxd5tmxlju5YCjVgJ3qaNwIKj7%2F1ZKTr12%2BdF5SKvd04liNorfQldjGyFSXj0QkCHKxK%2BPwq%2Fs4rCqT1fzFFMwMACmNrH4GMvQkPpcHy8PgCyCZO7cin8H36b4eF9iiNiaVKnVdeSyQBVIzKC2lS88nRqEhCmQ9EoNj9fXf0SoOuo8wZLIdXI2Vm%2FNAA5reRb9lTUIn6SROUMFzI8BGeXdEmtVvNIPOgQOfJpMCSlhQ7e%2FbLmmQt7%2FtPn1gXwWWaootYO8fiAnJ%2F78oee4i142gg2wGAeX%2B1%2Fpq2yBZhg3l8%2BIYOZewWWpDO2rOPMNSDXYSpDCSDDg42lchtJdZxdyec6tJ6DVTox8bgJ4VpzdE7GEwK%2FnE9thLjZAmhM4Ksbj2fPCf4XKb3lkAyMuUUijLlX7yXEkbhlTS%2FSJ2cws2hKlnLcko3nA0qH%2BU0lHlmdQ1ex6lMd79invJ7Lpp3ILw0h6VtVcbtVRGpQH79EWdvJUF7ronfL%2FACPSiWmaK%2FnIfHuNqTwPBmt0OGKhCo6vK5%2BV7i%2BeKnFkojl40WzrVTZwi7mFYS8%2F7hjoyh%2BrmHjuFEZ%2BvpCgIuNOAM98LyvSjlMv%2FE0M27lC0rMghXJ8VXmcjRLbET6QwwrPO0AY6pgGCIUSYCdTducUfGxA1FzKgh92%2BkPhrruvyz1Ujg98WH8ICSZT%2BQuDw%2FUHrqMTKHh5wtskjDhFqEqyC9Ds3O6v5vlyoZirGwsjU9aLh2qQQghwa2Bpgy%2BhYXRzkwuGkIcjpWiXJRtA14ll0CkIQWyOyUbr7fmlhc8tBmsn4%2BRdtCPwEZUfcb0i2v4GGJ8Nm6ia9kAPjvLMjSuRxiSjvOrqVe6hXvZW8&X-Amz-Signature=f894bf1f043ebf65388138aad7a63b7e8f5b42adefa06b254927eb93945ecd0f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663YP5E34V%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044928Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC%2FLj4sJER6n2hnHl90Dewlc7g3zp3UeQ69lYgKQWWA%2BQIhAN2O4%2FzTT6ulfax4abXAWCGT7MpdjGM2eJeEeAjgnlOOKv8DCFoQABoMNjM3NDIzMTgzODA1IgzjOjWA1%2F1wX6rMz9sq3APDq73XEyfpO8TyoHRKq7wAE3Nc0y%2FGVeAdu0GTyPLsGeQj5XpHw0f%2FCC6yb3FYVT9g4Xj5kGnDOvw7ru1ov0nPARZgWW0UMoaiou1GVSv6zL7MDbwExm7qDIbCwNABX7hnoBE%2BvMSvLFTj8Wpe5isv0if%2BOTQPqCV%2FlyTffiLkjHnEJvvgInykNPrgA2UrYb6DZzJn7zXgSqRSM1WCHGLiOUzrHfHwtgtaYzK%2B1rHk29RO1BPgIahD0qI64y8nd3quuI4rX9PJnsNUXEzBnyTABiWCUS4tMXn0GVfnEi0L6n7a5A2n%2FocUYjrwU5E4bXzL2dNxh9jChFEqDAHnmBbCzz0JyECScqKoNHvXuhW8LTG8dvPIpB7nPZG9Aw%2BGYYbIlG99%2FK7GX972%2BstwAp98d%2B2sYtl6lnTpMSB23U7NmyHxMUaKUeFoO4swAjKvbCLKIwxheX6izsTgpEpixv9aQ78JUSpLwzF98ayfTeY6KnWDB2mT57MsBwALhX5Zu95zD4pgBnkmKelxWFqPDYPLBCgpfuxhkz5UQDwuobMM%2BeP6jF90%2F4TNx8pAY5LzloIW2QWBAXAR2Gyqsx4MUu559AHjRA%2BD3MCjtq0CHr4V1Psk%2Fb%2Bm44MlkE7O0zDmtM7QBjqkAVAfcdZodlBpvgpAUwKDM7xy%2F3iF1M6VuexlbKMoXpUnf5NMs%2BeeiaDe8hcvzuEB%2BmCCEaJVpO3rKw7FCDSy4zmJqs%2F2f%2Fzu%2BObsttCN23irg1T7j1FL5HRdg5SbfbOQSQxDr2cd13lKq%2FBwnMeh9BiURjalDr9eHj%2Fzvb%2FrV0Tyobrjgow%2BUeK5K3zYQmXskku37l9zaIXqpkv18u%2FKVCr2K81R&X-Amz-Signature=75e7cc9eaceadb31cd5c457d68ffbdf7da100f101fe388a1fd34c463f9586efd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U4Y6W422%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044931Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBG%2Fn8a5xBYk9lcuiIeAx%2B9gmtZjFqODtVwAD10ZmdFtAiB4S%2BP%2B%2BjaetjMdpSr9ceE1B0WPBEWoylh%2Fi5oI%2BV1rHir%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIM5FWXX%2F09MiKb9FjYKtwDfuEQNYDZ%2Bh%2Fmy4uri9PlfEiwOIaFM9eNSaxcu2SkjDxYgoprBXXMQSuR8PnwnlySCgURLWPzflKOtlwSS0qoun0O17OFATMG9TUVbH3PJXTNjXtL%2BarsLPt9hZr0gBbrWDBH%2FLuUKeMkB8xvIpQ2N%2B1BpYj4u4M92GUBL8i9fXfMGxbmn038uxKsvBjuBfcjAOyLjQQvL%2FT1SCfENPHM%2BQVa%2FWgxjzShePCdsgclzU725Qw27hglJ1V4MapnJAiz2ffW0hI2b4OictYy5EY56mrgkjx0prF3rBpbMlYj6UXRd7gMsZxNcnqjVLIT96lUnHZHho8kfDlkep9SbhsmQqT7arihkLhYDY%2BKVz1WzGQeOgOekMztpNNGChOAyhcJBJS%2B3Y3QSSCXx5bGv9fSTd02xxqw%2Fl0cRNOi9shrHv743h7PJ50ez0lX1qosDmKAR8C9RwvGjW2FNlw4jAsVwOyyJlNiPhWrRWrxM9lOP8pnbZolTcRp9qN3N3GXd9O6q%2Bu%2FQkfdPyl8%2FbEX9Yxu%2F2AovN8soSNDogbtkJMg47CpmAVfV7eXoMXxWKrrfBG6fDsA3ZKho9lszirvl99NVEI1TzQjRkNKHmRtReY9kLGqJXCBwSA2pwcCoMMw2LPO0AY6pgGQIsJC%2BZs2y1P%2FbG%2BnADu4QAzLVEVt023owrRm0T83kYbk4BmormRO8K9voaRX4GtfJ5BvyN6VeuOQawP1pe6FZFx9fGwISwlM5wPwlBT02XJ71f2zmFVuGbpALBjzKCh9XgMyIOMRcCIcnjqKgVwXLIyjY0uLYHKSmCCRFEufL%2BmlYyJbsAIU3Nxw9hGtp1ABvUBl7WoCUfQQ7Sotvh67rSFLwsSW&X-Amz-Signature=e4bb6ddb4634754d60813d127dbae1a64691652b68cbe19387ceb59a3d29c8a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SFXS3VY2%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044932Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHUhzRD0j3wnr7bo%2BnfMaBcKnq%2FUbLq%2F6sEC1vI%2FeEOUAiBPl7MSI0N95b70QzZZFR6NRbESSK4WURshsDUztgvtRCr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIMQUmkmJOsf%2FyrzcVfKtwD15AY%2FxKTrFQCr4SwfvnedVqgqjzMp7U4p%2B9v390dMoWz5%2Fsv%2FYVoCXsI8gUp98JcWSqeNXUED6gmm1RRsP6nVKWwxlHbzUjQTzyHL%2BwsTY%2FlU2AJMqwvSSSVgTLz4H03G1%2Fe5jkjeRAn8HmWmJWv%2B%2BF7pBwmZA5MfOOVQgN2Vyy8Ox5gwYMGNm5xTKlks6RonrLX7R5ZSzIkMCqDy2r3FKrzSbcrB7IK1M9%2BR4ThKpU%2FyEV9RG8Wx%2Bg16zxcgIMbZFtBnpuTSZPouNMxejSdzNVPaWlLPAv%2BwaZ7hihWbNSkHapPjn5LYoqUT%2FFWZdIAK2JYiPztnG5mg1aVLorKfwJE43ZEDPi%2BiYqGZUf4l6X8sh1R6mnS6J%2Bwz0wMN%2FZ2ZAXxCN0NMtkrDD1564xdr2BDxEt5cyUrb6E6D0wpJOf%2BEkGu9TP8Y%2BX1XdkRueA0xQ9Kr%2FJnWRG4SxajaCd5e1fyrxTwvzt7JfQdAAhFPBknwh2vhh8VPf7dE2WoCN5spfwD9IiC5ouh6lotipyzbDr0sVcHUei9OMOGxGTezuqlCipstN2kQORRU6JkHx6Dz0HMcIwMm2CfnwEc06y4Khc7z4Lqsm8pEHkxXOVzAfMqdaCEK5KulkjF2KcwybXO0AY6pgGbnJj1XqBwQdCY3WFbSgcgwFLBhqaClytRjcbONAUrRcv2rwHuPr0U6jCtUROWmnMnYaArmOxbsz7M80tlW1e%2FiLupiuUBHtPb0p1MYAR7lOed6fH%2BVp7xTEgSDzhlkFF7NX3QS7wWu16m24YUuZ61gq11jjmwEy%2Fi6NcAHIQ02Uw652buF3EkvRSyB%2F9iHCcpiwmrYulbwD%2F4dOpiiu%2FB94DzfWku&X-Amz-Signature=28e5592600065f34d43434dee0662bedd8e7cccfc41fea054386ad7f290a4dc3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XSCKZ4MX%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoqXrNl5Lv8req%2B%2FEtWkCyjc%2FGwsCUOSU2aIxiUcTG3wIhAIXqG9ab70ePzCVQ4E%2FwuE0y%2FA0rHqkNPZFNz%2FeWiMswKv8DCFoQABoMNjM3NDIzMTgzODA1IgxeFvgJOfhL9%2BBAv6Mq3AOj1O8tO1EP2voWCuxGl%2BuAIrOCXN7QuIUlHjM%2FMR3PilzdPPs7cvTwBNz4wIK540UsY8hdbrcj%2BMwS17VsOyI9Vqoy0W8wr48YUdUvGiOz59WQSmK8rf%2FVT5j1K3VMhChMQuxp7WcnAIz3tUcdYj1UjygS7mfMohuv0MptSWhORDYme%2Bmdpesu6tyr%2BBHVjf%2F9P6WmNeqQUOgcNt5DZJ4EdgtatmRQtOV%2FFxRjcLP2O7EXZe8YAk58j89bjsmXP96VS0IVZFYaHEdN5fvSkKqBm%2Fo1xvwuOmNfcVdz4idmmzxuJFEFehdBqYXCwWqt2DMb6VxpGqvoNYPxXblyvyUxcgZ01sU%2FyqlNXjR0tSlZ5Snk%2FSsTAvsF3dRK%2F7yDQuZQD2V%2Fxk0xObYO2Kfk33rHAbTxQo1eI9lf7xcRWuurRy87NlKdjkvOS8UvxlHhgI%2FhnJSA%2FObWbthcBCL2HH1h%2BuRY6IPpuSnXR%2FdrYTooBIJoD0SJTbkd8LDDZgZ%2BsXeLRM%2F5DfUNE%2BnPrki9x2oMwRnTD8rjeYefe3%2Bn8YePRXgbTTkWO3STrS6x28048H3SoTwfGkrdDsgKxa2eIeoB%2BCV6i5IOD8HDiPEigFEYednMzFj2n%2Bwvk1VIITDktM7QBjqkAUb7%2BRl5Gy4aEEJq5TZAjZL2nLPB1u3y2Pq2sZ2oRzJgWNYDQC1zcPTEYrJAvlilOkHEaCCjQM5BYqIsXh8ud1BChD2RuFdOsuxl7XchhvtoyKY8i6eM98sw5iPFtxRNPsbLzyUDkSYTQfCnNM4wQyXpYXe92rxPLZA6x%2F9eswOlcNMRqGN2aC7%2FAaNEwcTfLMZkO4VMg3AYXpVj2JeM%2BBmE3Exf&X-Amz-Signature=69a6b21c462cfa9404176c0afe47df49cdb0541b73cca37e06aec854e0ae708a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W53QX2QD%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICww5xC0W%2ByGabR7Omoao1DLzQI86YF6CfAasuTfLO0KAiAE1PTkxLMS74IQipVQhVar9SJvSaQi8amNeS7ePqtUbCr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIMG7P5PYZela4wAYLiKtwDnxo89RwAfILWigYPhG5qk7jyJ%2FOeOZBZNeSMBl2M2lEtFzC6baAPO9SlSGTGf2uzWN4ZXXwfDm%2BPZEpOYxo9d%2BNNkVN7iJFqorO5LBb8rTwYeEP%2B8Iy0rN53oDANvYJVK%2BjOgCEeBYop0Yu6wrloYKvPnEa%2BdBQ3xbN1JXuD1tZjoyl%2FxyUaMrclkzXLoJxiNzOnSMaeITDNsLjHwOs1Orq8jtEHXuQHVWr8WPjRNs5%2B0%2B%2BmZFfvnyc%2F2NQufXNpa9qwsFo6lewKNsrwsxXnW5L8cJObFiORC3hBHRKetldSk9iONqUuKt3gVxin1hVUI0ryf%2Fctn9DY0TkN%2FRKhfNLELeGXOWETlR7s4nSUW7Ak7dUr5FHzCLsyMdTq7w47mCf6gF3b8%2FMOjvqcjuLmQlZbcFVjBMlhwEwMe6iSiAIPIZSLmuRXmpfxAogqUUU1ATf2W%2B8BCHAna9LJUo9juURL1ublZ7Jp%2Fs9VXHD%2Fc%2BE4LdErHHw%2FluuZFy2CJVfGsMLYmSZU3KAf2VEvwJaUXXktwL9u8759C%2FbcedEyKFgMh%2BDcmSmzEbAR4eelI7Uc5tCn4asfuLvilr%2Bs1HCgJxQJlyt9fBoEc5k5cIZ9ndsZWCZ13roTw33WFwsw4bTO0AY6pgHiMjAB8I%2F24Rq2KujJVuRTNZSe8buurXP7Fod5vxXq3sqJdou%2FEMGrQizVvOjMrecoTGfjA2Q1D05ymBhyezLkG7yRUKUGrbs5sHMoX0fa8%2Ff1O%2BXVBu45iNFwOIdxvWgkXZWqgUSVnFbafdZGcEoU%2FX70y%2Fumn3ikrvuRD%2BjvlFTW881NDhmrNdQ1mlNdkya5UAHOkAWn9o2Hq1YULpGvS88nHpmN&X-Amz-Signature=abffb0d5cd9a48e894b7a658cfe57055c03da801a1bf4d788fded734138637ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VB2B5BMS%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFT1jGXv%2Bq0Bc4%2FTc2p4APJ0W%2BQZ3VE11Wtt1b%2FGF6NPAiEA5WmCexSEBAXtH4cJofNVhfYf3jvtCBSPTzYftGLCQQAq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDBGWMhQaX9IhLqk5iyrcA5fOz9%2ByHj%2F8oVnGHS9eCCVd0ZZ6VsxBlbVtrtKGF1No5jHxtBByVnsehQ1Cq87iDymfmS88a%2BoTKT6U6yp5INhV1ap3IhhaLud06QsDgvcOX4qZ04sNp3ZVbj7ZD5jm1AcshvNrfpk56Z6uK1LSwscxD96%2BruGF4z3ZqM5nx%2FBHVHvxGfSFT58L7quR%2ByU4%2BSHrytkhuEV4tnmHrba3g8C%2BSk4%2BWze6U%2B2Vj11s47w2z1sP6EwimM3ZHiZUqS4GbP%2BDcL9FZryVOUpjsBjeNpcxhjCMa2zrVPK3uNerjvwof%2BLWdydx23xu1VXy0IueomgCQQKKAfK0dbskqRzfIVGcsAi8RTnl0u%2FMhvbaJocmKkc33dKIEnWrCFLwSg71kpsAjuZ9dpYv%2BTnp3NMGFnrd%2Bu%2FGm4HycSh0fqfwWg7gUGWTCSxxcbsK2pNmNmOLoLc%2B%2B748vQnz4XTYssHLZbDOvpiHhgTDsy4Z2WivcU4pSTDnLc8P0DkclFBSUkKgQREtwGA3tSLjYIYHM0Z6spT2suxbuWmvXxmpoCamOeHLNIL1h8fOTdk2aeyqIy0Hu%2BJh13Y%2FV2y7D47WE%2FnWoJ3kTrT10VGyeh72GOk0agPTfZp0yiL%2FJGwKlq%2BOMPW0ztAGOqUBv1rIq8x4hYE2w3TtdrfoChpuBK8IP9x0a7EWWPldPLyVrbcqJsIQ0rr0abtmuUzv7jArunLoSHij0IXhbqB1bNitZDAS9i8aReb5OhQZdrEMQGdcYyWGRGd8Q%2BwE7usCQkAeh94l8WzceBk5N%2BUqK5Dm%2FVZA4tIonKhLv%2FvirhpwG9TDNyXTIHOSFDfgL4kxusApd3f%2BWSgP19zxNXoCVm3TQFUF&X-Amz-Signature=1a461ed6287a09e9166b2b4263281b2b2fd29a347169958ab38ba123026f7d87&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJLT5FCH%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044934Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCOxlGOFmEuBF89h6bn%2BMMZUB5rxuwcJGea4EbB2XSHiAIhALCrGccsdfMlgfp60knHPuACP5MDUpJ9dqGJW6gMuGMRKv8DCFoQABoMNjM3NDIzMTgzODA1IgyPsEQV7JNDaCKW8Isq3ANwU0iWHnAE4drf0dB98bVPlgghjPAvPmVY4lp5jOadJG%2B5E9%2F%2FxFyGWWCafttaHBriK6bmJRjhZMpsNmRR%2FuK7sGYN8uSMIv%2BUjfRak1TV3THbYFx%2BuX6pjNVlThDC99LvjseXYJ7jmddr0YR2P%2BCFq1N%2F7ib8BAW18qI3dQ9xFnwMzhDqU%2FgMlGl8%2B1aHgtFiegxJXo%2BV581GB1EV2m1o1g3hXbWT0zihBC9C4w%2F8VaJKPcBm8olkHkMoH2SmxG4nsakDvSUsAUG3nmuma4vRKPPTM8rnTrjm7265%2BWEGuwqQGxnura8KznArKbDfTud1jgudu%2FDJx6UpoBWezzUhUcRwBeCLoe%2BUr3mZSLES4%2BnzxjfAkG02QtXUSoNVV4avUx5o2X6hHRHJnn6HzX8KqfzIGbq3Cvbq%2F5BndFDFdmVRASllZQiC7lziAVnunaxCqTT40Y1YXy8rNIi73ZcJYgd3jSuPiYhLTMB1yn9XF6A%2BOCOHYpDQfYWS8Og7GNaO%2BH%2FVbrODMTOQ3umZSpsWJJ8%2B4RkKTp79FsIFPAPG%2FmEt4MZ50efCVmFmx6%2FMOXjfRCvNSqxj45T55iECr09iT5%2BY%2Bp272EZCNkUMk0%2F528tEMSlxN%2FwonHUJAjDItc7QBjqkAcrfLSwWVmpDrxTcT6tsGPEptsa%2B2e%2FF%2BPia0MHn8klJmL5ZLXcVMfDZf54HFJci3jqVJFSZScp7sZKQb2qnTlRx4sD9mgzEHNCWB5K21yiu9OLPArlRN5JkeBS005jf5jAtaACbYNNNeQZMURQXv45Ob36LovzI03brZu%2BPGz8CL53K0D6I0RusOGsDVFgpULRaiF8ARoz0p9jxDZxWwdExSITb&X-Amz-Signature=623c5eafc14bb6d013d05cbbb241687b27b366f8fbf27a59b7bc7fe72bc701ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SDNJ3HTX%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044934Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD6p3%2BmqJK1WNyMJWNY2XFABUh62EDEhiFo0j2416VmcAIhALZy0lV0wW22gCohCODnl3tSNmtquLvx1VGh3100D2tGKv8DCFoQABoMNjM3NDIzMTgzODA1IgyyvPAUOtbLMeQbBf4q3APh%2B0yBbwv1lPWy2yEpUk43dWlLX%2FAUJVqAfF3J6rVaCioas3TWM8FYHdCuiSndbDggJ2pV6OcW2YJ%2FIHV64GdY5qWiB14bsgw11FgoApA2qK%2B%2BR93dF5QNAoXNwSDGFOpFI2fTU%2B%2BJDqfd%2FA6QOZfzZgIpwm28nc5SpKjqe5sG%2FC38w6Doc1F%2FDtVGde4xhEx06e1QomKzlUhxN1YbNwf1ZUnd1CtLITfsSPiLltu7QjxAZ8ZiKZF6IYgtnPbbYmCQPjlYqX6ELecvJEbhDQt18lRHlB5%2ByC%2Fmcp0Sl7uCl3%2FHgI0%2FnLUN5SaO%2BaPsmtNd9kXrbWgbU%2FV%2FyZ79SRk1b%2Bsdsiz5wrpP3rJs0SszxImunB2jAX84%2BDbtwzGpqjbjGp7MRATHQ9s4GepnmrzBAdCEKf%2BEBSWZB0YjjSNQSyUzZ0PR0sBsUjCzWAPyuhtBIn0Zd%2BvxU0G5VA6t7skOT2J%2BLQEZqosFKE2UCpQSoD4ft0xhERyMaJdghwQALqP9ett7yebQIcWDi3Wf%2F7f1QxswAMQlTgWH3VDKDc%2BQQRg3EpvjskN%2FwjqqubaqTMyPvGBzufUHcvPoe7lmWmg8neZaIAtAc3ULKlYl0XJ8h6Gk64piBlbiNeY2ijDjtM7QBjqkAfJAkaDiQkcqhVi7%2F0xWHSGsdvTrgJn2Pt6qjfvPMfNSzv%2FtprA0yk92bxtzxS%2BQqydtmFDS5sbsvEO%2FLEJc3RZgbkJLMWkyyrXImh8Ef5naKay%2Bn1TjH5IHzzMu9QeAlxGxqh%2BAyJ3LrSL3CCWvSoS0OwB5RUMS5cvNjOh4ZBwAE07onUIUS5SleiLFeqBKZsWqvBYN0ZZ2AiBLwZMUuJ%2BRfGfK&X-Amz-Signature=c681df53f5a3e9bd47b90aacc729f93a8307d07d3aa7709906aba9432fb6ecab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

