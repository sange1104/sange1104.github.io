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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IRZUJRJ%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044536Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIGRtUkbAT6%2FcIpoTQbUrRdKz5nmE%2F5%2B%2Ftc4b0DHCDPYNAiEAmXBUkLcsdRdabQHgpIMkHX2pjDdfLadH6Ov8cIqfnIIqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOUH3WTYMROOL0Ci%2FCrcA38i7Bc41R1W8ve30MbJhvr9ABxTqptw%2F3%2Fj2IAFc4wZl%2Bgz0DqNxqwFhLeIW2jv3VXQlKOuR5XlpKLtP8JkHKZVH7AMhdg3Ty1xZagcbth5Pz7gzCZiymdbB7y1k5HYozXWwUEciDkqlHCT83TtdxvCxilBE9cdIAoHnd8Qc79Vi6vffnGIsStB1UTOa7baerOu3i72i%2Bjd5hN34ZPr4w9Fw2YcIEEGN92Drw2140scPew3a5GHZn8Cn2KI%2FzzgibQSHNVoUCSrDy00i0K3spyVk%2B%2BQDVXCVg%2BYo3EQi5gr9UyCk29nwO9nUO%2B2Lanei2FY1dv0PSnx2q7LX9Y2msqzkXH48lCISjnoqYS%2BRToRQpeYxUAKafYCCegiT%2FJJaw8%2FEsI8kDcPUb8kWkd1p5ifS%2B7PqdIJigoNvyhm22b3gvp6nxTrswqAMbsq%2FdAeVxKRzsnSS1lJ%2BQ6HiA69DV29%2FJKENQu1B4etG1chHwxbahkvl9c1YuFdf8Z3tFjAstI8VSVmxjb6o6Aju6mWIAadv6V1oiMIDi7EZFUxYYV8xBb%2B4csVwRproWv4quQWJQOy4jjWar%2BluSCin6jNAKKrLc2RyMZNiJssI76PJxvkLiHec7PqjO454vXnMNS6o9EGOqUBU5AslvLBl8bspMcaJVqYVLZwKBno1HWozWh0189jhIQdaZr6RCQa6nuefGDxxCsEzKeClFN5jQ68oomDf5Tu%2FKCDUcKaRzV5GTCgJbbTo0T%2BJCA86QGWz%2Bie3e2T7cz%2FQzk%2FJ7OQ6pTz1vR6xCNl0KJl%2B%2BmfK0t4E8lpmKepw4ObkIKBhij3lf9RM%2F7Qq2BHyRKKyX1yiVdq%2FLwZLHSjf81yHUM5&X-Amz-Signature=69264768d627938f374d8ae76c9f759e5022fca640ccb796e039eb9e28254ffd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUYIMPKA%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044541Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIF8lPOezFlxEP4B5ozT8wPps7tnxVZu7uINMN2O07nvwAiEA0khLZtq1tA%2B7UUzlxGOG4o51SM10nre%2F0sc7d16g1isqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB4%2BzZskRXlr3NfqhyrcA7iG%2BFYN1hOn9SGP%2FPGC1TwtFP930eCrlfmU9JXItBP6cTYjYw8N3Ti4HEwYmlkQTWZFJ5P9899%2BCCQ5vChdcYOq44nEFcap28%2BJSzYvASVKktcDfCCsaGHAYO5iLLRh5kgU1QLmvIAhr8YL8BehiXUdAzhlBR7v3b2v7%2F6kwdNSeQb4RcaUvhFQ6jD8mbB3ATCtbJ1w0FMJrlVz9xB51nnW6XhBobfreytl68IhG01Y6Bp%2B%2FFNo4bJ07nd6fXzvH8e0l4ajxYKeaxZ2UK69jqaoLrXYlfb0850WtHfjJslTSpRDCUWOCCNBv4KRGN4w23z0%2BXwTBug6HXyVv19fkEDczuQ9nX1zNAJGkWffqSpRGwpdgBeL%2BcG7oiUYDppKRpj7xLdOmTrr%2BIwIEK86%2FXIYwy03RmMYgiImPZOAUSz5wx9I0v82Q4eLLDdvcxKxgXN6dfgkYZhqmoR4OoUXL0p9a5spZCqH91bielI0ncznKv9efpEyuFI9y8E2svNf6fEYUBxmh6rgjBngbI0CuC1K2vFPlWnaT5ZWPikEddg2u1FRRgZTepEjpND%2FqQLtfYe6bZ2fBLQWofOcCNJmtgqB7lhmBOorlq4uhxqCe4etpreTYhbCv9JgbbO7MKG6o9EGOqUBYt6Hpm3yvNGrrrGyWT1fH2YWvq0%2B8N20d1wUM95YG72zRDEnd9pDG%2Bqt0NWgUV3lf5%2BcnoWVeKg3dPR1%2BC5WTc9Rr5XzfcKMpoXCc6sKcSUKzsL5ZH3D2gi1ig7uzpvFqXgDQCitWvxtFvSdw8LCCy33D9rxKE2mt9soT1%2FsGBE1NG%2FZiqLQdDsj76uXEIGTIAFCKbLl8ypIOviJQcFFfekeQLnY&X-Amz-Signature=91a9f7dce63767fbf727f199817ceaa5ef92b5474c6cb5bd35cb6ce010b9ed8c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WH275MEK%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044543Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJGMEQCID2Ue3BgLZnWYneQ%2BD%2FOmqQ00zuC9uR%2FYss3cUYkk9owAiAY6xAnnK9J94TOjR1%2FqGQIw46tZfg%2B5H7A%2B0ov5jF4ZCqIBAjd%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMfoRf9UjtPIjYmkMqKtwDU0j%2BH91W3x1qdrNJ3ySJhzYg2cKGoL3HoYB0486EsssYIEDwkUwKLMlgeQex%2BzlYcz0kLC3lz2wMBHdlAy0jJR2NUHySJCQLZwGovMutIproZIUbzxIBM1jiMPwla2J1VB5QbA841d0mczRFv3d50BPJ5yJ2ZnBmPo5MDisTbQGhbd%2BI%2B7KhGPz%2Ff1Sv%2BCFLyoxQBS4y%2BmBUvQ6nXXyUrmJp%2F6iRR%2FNR8M4Fyn810ViAqiCJJmAHDPejC8DeLvrAsTVHDaSdQSn8vnGzbK6Yjh7d4xKPJnDB15HKKWpK%2F7H%2FkWua3CMKiZpIcYaC83yLN7yfm%2FSEHkJ0yM4BDIlHVC4Mx1dIJ2l7UzopWyaY4OZOSNobL6LHbdqiThaJ9f5ts2IH%2FQxBDJiRelBIsTnd2k120hiYxbYMN9qIXbkhsYtGTuPTbalfiYfNyr5gIN2n1K0oVB82LrjbT1x4A8W%2BSQ%2BJPL2UeSm0iX%2Bu2qv67R1GFr2LaDxqqIj%2FC3N9pC7g1dm9TGmbZae37mO5Du6K110nFWhTNbNKPCOVmjFmTAJcsMjvmrW9lB8uxGbl6VNfni6s870Wt2a0CdscZCSuNdTCPu%2FFMYcYjoY%2BtJdvZhCoVrcvXuqThy8UaJAwgbuj0QY6pgHez54I2kf9to0eud6yN0GYFFtH10ebxlH%2FbzyZqTJo0Prq9XawqP86uxME%2FQ1Zq%2BIpaYNr1G%2BcAQ8UfCCcQ6VFEONB62yt1IYpINJ3qaIOt0w2NFA8lz1t9971kkJVOH7CE%2F7HDYd4RY3r8IhDA4YXYRRT4egwfW6PvDNi74NLynLFq8JPqOFAEsaeiGs%2Fe1P9X6SURxj0lRfV72Pb5XIZhDzzrcCF&X-Amz-Signature=5ae22f6c5bb4208e52087d66bb5edb51661f2a250e30eaa1e4c9eb20ae9a5344&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZD52ULQ5%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044544Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQCYJX%2FH8%2BlapBlRoqPy4ubbIcK91Sa%2ByqvWTvGzF8tFyQIgGVhcrvMC8w1w05fpxM8EneoQvuRuPVp2Rp3PILfdzHEqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK3b7TAYSdV8LVnGlSrcA6fe5tibDrE%2B%2BOLkPI4rtKX%2B1RUFO1VG2z2kE3l13guFsBbyYUDJQ%2B91ZQfdALM%2BP%2Bc68Q1tItbH7WLJ459kCeTIYudI9fOe%2BWD5H2hzjAgRUmId%2BrdoI9QplnTeoqAEP2EqWluv%2BPYlxBb8Id7SxaMCOP0YiZ2QnaEQNvP%2BQ98tbP9yfj495RkZsvpbAWtk7WoQmqM0wEJrI26%2FSOXp0cPMTsYZdK%2Bh3hl%2Ffdy0DYIpcSkqM%2FmK7MRZ5Kscws2%2BxPAl2JlAcZZIYux5AHRV8sv4L%2Bf%2FJPmpnoSEtVHMWBTjSQY53yDKX7ApKKMWbcfkC67MkXJzAHLyOiEwMInEg7PXKY6mwj3S326k1cS2dXXY%2BoZQAKTEY6Kz6vDqJIfshv5jMjbaJ3OvfyFowuGJjT%2F7BXot6F3MwPhxaVLvVrcIWcablulBYdb%2FFge1VuaBM9IEXiXfQGPk%2FYZPoTzFxx3GYnYW6oR77aimPjtoIUFQrSTQYCE%2FAv550q%2FUBsA4fX5aSjm3T7Rw39%2BObZvYh9FVbfT9I%2BwZeLaXt93FVE0O592S7Nheuzl%2BbAV37wWPQPGBhckFpkCLFE1xcxqfJ3xFri746N5p0f5RuDR5LgEeiEPmKblZO2nUVSC6ML%2B6o9EGOqUB7ccJr%2Fg08tr6CLa9QD5maHg908DKKdOUecDHvSSBbMLhVJkcNPGMbNiiALmjevcrA0SUQC3pSMu7RyTnx9YYWIYkqztxiQCiI%2FjU3dZck717gz4aYR7uMxgR%2FxM3eslb%2FVEkJlPfkA1QUhc4%2Bq2s6hog7Lwmp8Hq0bSeDSB0GZkcRUxejmTZVcVzyZzceLj39G%2FmV0SdLntQt3Hnfm7Z0rm27cQt&X-Amz-Signature=e8ad48ea1682daf2e1d33bb4927d725bcdf9ac81a1db3b594ea4fd90a6610f51&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46646SMEMCK%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJIMEYCIQCsXIC6XpCzSjLAxecznJDbbY0M5q2Cn8E7R%2Bho3uXmJwIhAP%2Fi5jXms4p2ODzCOXG1Ql4kspMGuPl8zrq8NA8ZJMncKogECN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwLL%2FB8PStpFH1wqVAq3AN9Hhvz1JztndS1xZej2oV0VqmrwuBom0FrTgmAyyFYiz9S9Ki%2B%2B2FjmgRRILu1sSNC4PdfVZpNNstEVLGAaiI%2Bgr6h1BF2Ailwo%2FkFUSLFKaG6xtOsoYFzNBGEtXdNKlIy3%2Fs9oLYNVE28NH60WYN%2BlgTKyugTWCK0eRYqE4tbxGXnMYd3XX%2Bfzwx3Tt8K1QiTnrcrjQLKGEizf1aMaVtlchtSPd3QhhgEYrSrwPm4XiQFA5Mz0OH0ry%2BC8Ldcnp3HwzX0BC73wHdXREB3aVmiz1uPuMy4SUDEqveTB69BwdZyVO37956PkxOu6Ibq63caF70uc%2BzaLDWbN3r18ErI65mhy84EUUz2JnqSGjMi2ZNTin9c6tLIeJ8cVD0s6fRt20y4c%2BCoRUwBzE9zGTCPetf55TdawTl6wJWbNul%2FXKxfW1Gg99IUPWzfIKUmAbxR0tHeBCH%2FZQHk0%2FQ7ZP7XM5bikaLZv4fOXzm40OXasRNTV7lZmsu4lz0ORLSq%2B%2Fl21XPC5KYPcUdv%2Bn3ZzdFi1fiYVrRj%2BXV8PfByBgW9CLsJqppZUZEIGbDZq1DAeycb1x7i3u0QVRwQtodFxssy8u7jfC3yoXPTVteLdziVxYqxnQFvy6NpuA2InzC7vKPRBjqkAZTUsqGlnzQK5970OHojtdmlHQrrp%2BgrBu0Uj6qii1TEYRi%2BbRGQ441MMXVFLeuuxJlPGIV8XLhB40KUYpBLjzoRjaEhlr2i%2Buw4jGrKbtPV%2Fy26pc4EAnS43QvWa5cCePAHZurtAy9LbuK3bnTWjczqUotwKd%2FoeKQtqsGqrYd0WDWa72MN%2B5KaNMTO3nYQv8d4NH05jOQ09wehdQn6tFftZ1CH&X-Amz-Signature=979870d54289473a5ef83a7a00baec59ab3326a0170063f0182f5d78fe66432b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TL6FYYUJ%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044550Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQC55hh54pLAdtgKymd79FlH0nlBoxZLgUtKt9knLamcpgIgQb1z%2B13askPVsllAhZxNTd%2BnCEQfhJZHdFkwQW7EF4cqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGCSmM23eBeyLTxxOyrcA6r3WJcCVu9daFqSRA6njT5nowp5oIjw4UkJG9yPk6hZilyKGUTiNrdZPFsmcVeH5dFuYVNiLI%2FakJ8zHcB2gsIGVNx1WHOOCHr%2Ba15%2Bbf38nqMWRzjEWNB551kigMnt2hPPtXEOaS8ZpqIX13ZGiJqdlP5%2BTqMC9W%2FdGb11tpwT1js0kXvTVWzyiB9%2FuBEGwO2WV0yIWYTD89zbgDkBueAGfSWnvu9eRLqrt2qhaEYwNXOaS0hC5n9kbrzkC8pnn3cQS0wMYFP9H5ewTkW9FXycK80FSU591eK%2Bzx5Qeq20UIGxwAosY3GXzhzQRmJODr3jfzmpfSl7jeqj%2BZePpxy55BmIwiWQ3%2FGXbDY0pMd7D9SK82VAQPPCzAA7b49d2E2rLeGWyGF6HHrTVOyLETRDr35OMHFOWccxi1OJOcqOYGfCku7tqMJbXXDDfYhkwx7sFGyVm7mlB6VJQZmr4t%2FnxfSHHiGufiHykcGRMrfa2%2B6HJzc0lHNnCa8LwNeFjAuLA2J1NrG77oajp4VREIrGLKP49kcwEyfb4gMrJkQl%2BHILIiDbs8NlmGBkvTO0Bct8DPuFADl2wQeK75OuskV7woAbtp4FbxH8SohNkCZKCIEXprT7p5d3g8ArMLO8o9EGOqUBcxUe4AQ4sPJsiCft047SSZvEnzaVld8hZ9GMm4JuFdk83jLs0CWPXZcNGQcv%2ByYRdDHr27TSOhXaHeW8jj3huGcYNWWM%2FN5prIyO1EeRyRQeIMSMKs14k4w%2Fp4827G7rXmkNyBJif%2FXjppD9JODYD5Nn4NepoO9mc05IWE7BtxYY%2FUnHtY5UMs3y%2BbLiU%2Fmqd1%2B6eHHun1ZYHzzHzZajVBphFX51&X-Amz-Signature=a97626ad2ab28eec193c43af75a79d6ac21dd2706343b45fe78af892218ee6f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VWRKAYY2%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044550Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQD%2FDFkvcdyqFSaUC3XBhx0sjGoY%2FsCO%2BamlsAyRe4U1cgIgXllLL64YLKH26ncH%2FX3RKkKERn%2FCEJ5fS%2FwoQi2L2ksqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFuXfiVg0%2FhpuuBP7yrcAyJvoI2Tpc9O6Q3o34yw9EAUHSd8D%2FQROQaPEFgQFeSI5BTkqwIpacDprdByo%2BB%2FumZQUQXoartH4GGNGC4OuhnDxIHYtEJGAvvqjCbe2n%2Bzy6igcw8bzVYKfoWLwXqbcEyOQgak%2Bx3jVSQVYdurClGuR%2FXxOLyAUdDETUKXVdxLKp79zjnJ5rJDfEFSACKRabjY4yAH2Zc3qVXcR0f%2B3R0V8aG%2FWwfAf6PzJv3WuRZ1lD%2BoQGwkdbv4RrJ1B%2Bwi%2BPnzDkitATZsAp6kvGiZ%2BRc1OPQMcmyYm1msOh6C921g01uaLeG0ujIL2h3HVbMGesJpaaW52aOfGbVQUmLIkfubRmnK15zle1V8h%2F9mRyIkXfUNFIOKUcV6OU44LREJ3Rb38f16UkXf%2BpfX%2B%2F9ZySnSbz2sr3kUlYTskvo0WxfbQE21qy84ZUfz6xUZS%2BgHWQLX7E07qMimfqiGKgEwqBSSm4L50XjG4A2tqKSa2clahUtO4souYXa0XqfZmncqoPYX2VuFZJRfAFdErVJaJPOgFWFk7x5yp7aB2f%2B13NVSXI6cXw6PMyG821et9nv92QJ8PxvOXdhQKnTE0sqZkWI2d6sxl0S5Yf8eTXMYWNZL0cd6ypIreQLwPbfbMPy7o9EGOqUBZjMEwLkC7rcow7fzMfhMkNCHx8%2F23Oq0lqzzs%2BVg%2Bqw9Plg02YDmV2Vh9uG%2FAQkFkvqYJA0uxpu0reoKKuK2uArhXQM5DAYbmGbKBFAxnJZl%2F17ifpAN33GXbUfQtsLO6j0Dvcn0DLgD%2BWNCbqqCaP7WJJ%2F7plCHdvazBTkyVARzO21p9jwJjWrD7PCn5f7hytBP%2BfINbw9oI3vtSTN8bssIAAHI&X-Amz-Signature=83458a8093a6576c42123e1af7fd802698caa272d9afa19cb501ed9f671c36fa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667C2RWUQF%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044550Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIQDBUHgtnKmIvRerHdGr5T7RXADgyK4Zx2AC%2BEy7vURE%2FgIgYnIaNqZNCGG%2FUa4v3nVGHX%2FRNWfUulJF2qZ2PLUjJjcqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAqw8I2arzVLXbZG2ircA81RbIWkc%2BUIp47rI1hZd335SBVW3y8umrCuyY5sLJkP3Pukn1yxEw%2Bg8ThZj7zLldQ%2B4KWC48z2aiSbOJkw5B%2BwAhoO%2F1b5JKrlZdk5XdAThzRjoT%2FpSAphiA5UaAqPn1KcDkW5v5T0NBOE5XhVJqwBQS7OJynRmgeR%2Fm6SSgDfxKXkm8BzyqkU6d44GKsfCLkWIrQqRqddcWNgJtUqg60yPgCMSkQvQg84PoAjjSTbaCf0e0ovYwb8%2FbA7Yx5Pvm%2B2pEcKZyTBaws%2BETPXk4uEXaDecFbCF3ZkAIZJCuwmQxqa6gAK9NXS8TScMsFbuk7TOyixC5eXJO5jnxusqDv5uPTK%2BEKIYCxRinl54NFVVa3EMIlkfMAwBwnSgR5xiiLmUkUcD%2FRDPIEYywA2%2F0OGdVN7nhsPZ93Lf9w8F5s9%2BlKK84GVHKknlnaVVak5s%2BPqSgTrybn42%2FLoa0a%2FBtci0mMTeHMJcAIuvt8vcUm0wZmWEknn8f4OYwHkNXY%2B3mrYoUrp25r7PT4n%2B%2B1hihmzSr36BLJ71cZ9L5k7V7avqvdf8xxNuTSvthXPahO1BZtATQrBLakFB32GMK4wRbgITORExGsp%2B4MlicFxtxxhDb%2B9YWkxU46jvogXMMi8o9EGOqUBOVGThwpnq9bRj5T7MsIYQ4qAhF3m2d4V%2FLVDc5XHaKQJY0yoywXlay5Kwh0ZHggig5Ik7FT23CMWmYmGoq4vyR94YIteL5rqqT83fUgaprlOsqMhF46l4hqgwCfixR9YWsGQ3oj5os9y2zblDyzsT61gBWJkyMW%2F9HuVc7vvN2Sf1CPE8cdoemBCM%2FWPMbbGVsPh0LLM5to9xkWHOiNCuLzR41L5&X-Amz-Signature=db5f885e9ea16b540eab339fc7e12327edeb681f29f574bbb277b48226f37e02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMNS4EDB%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIBI38UwhIRBQxhrZTHvLJTg9O8CLslHzo5HE%2FRcaPIawAiEA3KuIrfRt5hzkLz%2Fx7oBDDMo7SCa3yfsfgYiGNuPhqk4qiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEi2k%2FMLpNq2%2BiakpircA84g36ewHwJHcQ2qpWFqvKZkbo5OrtbJzoFHcNtgxAtNCnD0F9j9nqfRdDl3lq9dX7GjieQT3ECNeevD0AkPO1uqSpnCGqMWI2aoLeyybSQtOIqLyIy8Vu4Oj0SXKySYUbBwAmp9%2F1NjB8y4GkK24nhKGXvaZ0ekO8xbqrTNqnL4nkP%2BoN3Ok%2BH2uHiTEkHHpUEoPMe3CQAMB2cCjgWqHPVoMm7g1SFQt5L5UG%2FKXXPlExgd%2FCM4ez%2F3TG811z3UOtgZOURMuPbUmU6YKz0BZ6n5%2FdakkwlGqdLGKE0ixciR7MMVdNAkdQNLRLlzP34PGmE1sbLtYNjGDk1BSejgPL07C5lUgeC424ruq9cjdfCohMr%2Bp7fbb5XXxoc3qxanMbPLxa51eXM3veyQ6QIiuR8MPSxxoslKJ9vwsCV8YItbfSmzUY2OVonb%2FgnSuwB%2FMqI3fwx6%2FQz5yv%2BXo9n2vHxGEelAji8oaroqH1DF52bFAEH%2FA2manQHtZdK2aNzXcQrunW2ceawEMIKFSQT4z96assX7tEW1wG3YIbqcVReY1i0YSBdTmUmngQnXb97ht7usuZSDIqvWqSf91FLXq3QoJNHLgVKHztej7%2BeNa5%2BD3HXKJKnF9N9hec9gMK%2B6o9EGOqUBxiSjG5ZxwgwONydp6B6fqjkaRqIRNTtc49RKaeeWkDIqSvtBreDIYjuDCeoCaGnTt7%2FkVNI%2BR8KOBs8ffkwIY3Qa9Y82d6VF3GSAFRydK45%2F2eMpVplVFvTp3MGZ0k8v0X2CFQwZp0%2FGcn6INeQ3QQ063YsrbXR8vtfaVRBxBTenDofQvM2zu7BdInxRonnTmCbxojO%2BKJ9PSHAvbiGpSEY280kt&X-Amz-Signature=0f6da572a61b05e513f0c6df6f6cc202df1a53f321246c4500a2fd244c563192&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VT3FCMFY%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044551Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIC8dC2o0s43aRH1q9JCAApeXAvo4O%2FysxArjaiZgG1fgAiEAmMidEVo00qXVJIe22gwemThGW%2B29H2REoKBGaoD8a98qiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDArzwXjtNmWaBLZCzCrcA5sR4lMGYsQR5aorG2JtYcmKPtjl%2F02eva2DSZRoynMrDf7Cmjo4vyzAqcj07W8roKKDytWiJSmiy5EdH8ZkXuBAY%2BYcPvYabFcC75E9gVtZmcLEXn0yimMfmkQYppqdKlkEyy7MsRcWmUoCcQ6TIi282Rjdg4RGvU%2F8H7Z0lW1AIQXkZnamPT54DXEC3Xjgz3JL6xdkVaQSGX3FmsLWR12dy7kOCzm9WLW%2FxCijWB0VpY1kKdEoFsLP8mZA80doGpTh9akadbxXrrtsvjOQOiPQLPA6wzTPyoHWI76%2Fy0mNhEP1MCPoo%2BQA1rOJa2hPD0pSxpfBxq1f7ixfkqvV2L6jvdfifq3QgHluvKQ4KhTP0qHgSdIAqhaaM1%2FocSVv1%2BFke9BZ8VFGZ5YLS0DDtzPfWPrg6Th%2FVlK29I41YiUdt%2B26wInzxFqbBUswiQeMhaNl8GylkiW0OD31jF8CmfZ5HoV%2FFZDgVUJG0gd3GZ3PhjeAxWkwlyvN8JAsEW%2Fhl8VhgxJESqVmECrIae5ZH2I5is%2FSWPduJdJdoCaNcmzDpDkq4Si0dxt6agXqFDanpuLF1TgJhFy8cVRM3QmcH4ydBYJFk1dISp75PyiufF4E%2Fg5YOm%2BNf4%2FRNjIIMMG7o9EGOqUBlW4lyldtHlActnGbCf%2FiURG4rOzRnBbUP3G04j7RrQHDfD%2FlYXcun%2BtwgCTZGTs7j%2F0aCzgcCgdXIshLo0y2D54dqqHFiI%2FpJaumxg4LZkLwIqgcT2YMWcWa0zkp4NkXYNvW9DfA8CtmFHpU9YSraOg1j6ZQN9W4XFTDLkd0BKjYQ2oFktMPdd5z1%2BEiZ9Wrn1YNDVsFFtz%2FWIJ667byG6Wjnbny&X-Amz-Signature=f123c20b257742565f1a618775d95c91e87553f139588cb43e0a6408058553ac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46666HHXDM4%2F20260610%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260610T044552Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBQaCXVzLXdlc3QtMiJHMEUCIEapneaxgDJ2Yr7UTLtSDJfBhuxLp3TX9lIPcyYXvbkFAiEAvpsr4mYGzQO1qMOdlWF5D12THPX%2FeNh493LeRWD82iQqiAQI3f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJxIxmA%2FX9NkmCHuzSrcA3odobLvUHhL2BTrD%2FZ5hdhvMa%2FttBFz6KvxsyM%2Bry6G58mAK21ZRMGK%2FaEClTpGymA%2Bmf%2FPwm%2Bm2OlhZW%2B5WmNzdCeX47sGwPYcRi8cjJvGSzgYt4T9Drg2dtaE2eUySUZPBM9apLTI%2Fe6%2ByJc%2Bq4RTLIjUA4GrsdGHMSUuL%2B%2Fg38FlRjTKxC9zB0pKdPBhXY%2FAlvl%2FIgJ48ELHNPzIqHkw020uP5bu8zDgj6ADEEKLKuk%2FcWf2DDcZ%2FIa0bDC7%2FGWo1mqbBNVOgf%2FdNPgwZc0dZL1iQ5ShDLGsPCZtHhO%2BRXz2HvEm83RDU%2FEh7baVY%2FrcMZT19RegCpaJoGTH20Ztj0nm%2B8kWM5kS4JbyDJpOqS52OnVyOmprlplUEFHee4oukmf7XVxfJH6QYpjyINN0xYM%2F%2FxjYIHO5ISK%2BD7cpT3rpt2aySOU8QnGYQ1XXWVvyFFDt9v933HfoBl3i7p7tyv8QsyZV1lqeek87%2BOYV4MZt24g6PyjtaIQx0PkX0mwa6c0E8z%2BZN7AhV%2FKka6jB0cTXTuY5JkSbxBp6N4RLspnVQBDLi%2Br678iESZQ34GcAdQTD%2BA88x6uaXhZzdi%2FdihTDBA1YfJObtsFU68NNnYbOYvViUm%2FaQxGOMNO6o9EGOqUBjGpgR4OlTc0y3zkHFdaxNgTrCcpjgP%2BnHleOItagTjMOzuzg02ey21h3QN4QkIajbOrE2lU%2BUu3lceKHw4BEdhO7dP4VlThYKSGbTFQDlponfNrzNF0CbAzO8qV8G3tiVMo4y6ViQCa8QCJ4cl0L39Bl517WwkP7vSIF4kS58XU2%2BLJ%2FQVINWQwwAY74bC2MuJ9kz%2FWjFoDMh3uG31LYvLCRwOcx&X-Amz-Signature=e66002ea89b2de4f18c5975ec1a99696d1a6c2c17d1231570587741e54919879&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

