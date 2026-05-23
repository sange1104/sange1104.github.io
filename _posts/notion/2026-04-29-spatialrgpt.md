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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662UFC3QUG%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040643Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQDvJxjK5Dn0%2F3Ye8rFjlsJ%2BlPXzFPuAzOIOMtyiDsq6HAIhAOhSFHQ8EPj%2FAPRI0G8%2Bdeyxgbk1iijopHQA0GZYCEXQKv8DCC0QABoMNjM3NDIzMTgzODA1IgzdqtohB74XEtnduGkq3APPWTFQEOkOk6XeVzcxaxbPknv2yvkPpnVmSzB7vtgPUd%2BNSNwDZP8q3Px0eMiEZxklcvWLelvNQmYDRGVDO%2Bw4B7AtkUbsQmaWKqaKZIgu6pAW8KdKA2mPW%2FIMF%2FB6Ct4JqzeyUauuKQsrdruaeF5uWTdOpMEO%2BPK5sjPF5impsqVDhfswDhMPOKtKtqnCZcIZEhA7I2EnwmEs3%2B75pvBaV64v%2FaOsOyJIFqPhLSJXe1DgGGT63q0EQl%2FQk2HwG8LC8g0qA1AuziAjM1vyrfSyfF2kDtmZr5z6mrfWtvScVnPOD0QLc8G9X0QpnrgCpnQejCO80gQ5V2eehysvQPqbaTto9iaYkBvXU4WEYTNQphpu6M%2B3DaPoEYqB2%2FoImJc6fS6lju3TkqTFQbDbR1JUIdcK8tqTh1J%2FZI0iq1Qwb4FtPUHREI6K1D2OekFh8yOr8PfoxYaiEJbkcMcXt%2F%2Bf1BdL6uD1027aARtJgwn32V68KxNZRC5s74Ues3zn%2F%2FLRELAY6zeJUlJMV%2FchtMdBZM2nOZIhoHZnmmT18ydACg84hxrsUkm4SW%2BJtRDL5gpuWzHBTV2SyxsfKTIvDHNuXFno%2FDLOEwPu%2BPq1A%2FgEMJ%2F6Z%2BDcqtmpweS2NTC3y8TQBjqkAfZtFlgecdXzpvwBBalSxKXboqVViQPvI3wuNaIleF75B28%2FqdJcDdycM0mv%2Fy4SaVACoNdic4mU9c%2Bs8b8Xsu4L2%2BMMZidW%2FpnnpSG7zqQ0OVWC8%2Fw8UVLS%2BkBpxlc3rjAEOjKfFS2seAtzisyWpmif4Dp%2BA3%2BpsH0zejZCgVfNvIbWiQrdVAzoWkRriz1q6irlJxZSReQwC%2BXpJgzdN%2BzPJrH2&X-Amz-Signature=43691d7512189e6edefbf5e6da2b7fda29f78968003c1fd1e329ca1a12fcbcf4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWWUIKA5%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040645Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQDO2CkuIOsXpnEppmZaPW0Lv9w3ONzgdx5sfAB5xZ1pUQIgLaA6FJVfoHfGLenvSFvb1HgHPQjMLB2%2FttevNqnUVj4q%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDKzl0Ie7NWNfkGSumircA79qoBjpK3XG%2FkH7EzakXNIm4cdw7LopXsccD9y8bQc5KmOZH0v99qtuii%2B2ioLweUJc03eeIecAQaqdf6IKZrwlzSZiqMOh5kMcbzcvfISTwRdViOZSuwOj1uqCwedv%2BXyqwuroMJXrqPR%2BRRaqDSNnPSV3swk4qYsb8idPR98NDurAuI7RBZFpQDGAnqT%2FyROSDUgtsSF%2FTOWCQQ%2FCpSxSh2qHe3KPV4zjHdTPaDFXOlrxHqwHw%2FtRyD1hnuK6%2FQk8wX2MB%2Bjf0qgknXIrUL7GZRhyLB8uwGQXsV%2FPyRbdh3k2NHSHErUrzcF7WpnIVDPsuOJfqH8sUi8wPkXlHhFVf3vK50rnf9u7ygTTyBc1t63m2MYEu4QBFRwDrvAel7ocgvt%2B%2FO%2BAXm4jXa2D7Cz3JXaeoFiA3r0jUsdMIWmkVorgEm7%2F1Xl43dSiyuVg4DP293J4%2Bmz2wSoUQwcGW87FfGXzwdatebsrrHzgTfR2f2T9DLRjSAXhRuQvJmT3KuDaUxop9cjZESdTLiLrw2sejMaFdqXPalNWFLiiHSfQoqyPWZkirb4DVJkkUm7pcocaE4DXjVGiKSRvghFwJepIAGVpUZu1Q4p8vBSmAI0YykyKDCh0TqTaDKo9MLDMxNAGOqUB8NYTMk0hUUgED2gPl1YOrNVaVqs89i465dARt54Nr50Kd%2BQ0NuRZqy52UXslWv2ATR8MOJRupGxJ2TrQOaMTeM9VoFJr8RwlBTmb05P5bg1Tldvh0NiLEkwncYXhrz0lUcMRL44NGvDA2Oi550u6mz70I3eYlHeXUgx2%2FlKVYma6dtxhaxv3IK4FPWLA4hvkVT%2Fkh%2BoFWnM01poTGh%2F1AWbYeJfL&X-Amz-Signature=f3f966271bfec3da2577560974941a2668e8da8ebab24a71b54f15cb86afb743&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667D37HTOW%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040647Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQClebn41GBSw3FfduGCYLVc1y4IB%2F%2FqmMPqu0VrNHnWCQIhAJwluV7xGiPIvXOf4cQ5UPM6jyIULiD7cPMRwY57D8%2BwKv8DCC0QABoMNjM3NDIzMTgzODA1Igwt5T4pdHP9HjDIlVgq3APGawxEjz6HKwRNP7i7W8bCjWvn2ueoEj4fsLy55i7MqhP3S2ONwFbbfibm%2Fw3cgpRivB0ep97XPnz9X8hNnrqER86UFjL20OSPWrYy4VV%2Fj8BtsB%2F5rX83zAAtCyIqMFNzk2iiHQpTeyT65TYdiv%2FYxsZvgaqDUua5UQ%2Beng2JDpo3PRGruClN%2BZr64Nz8AX5kcp6GXIG8%2FAHgkGRAaWBDXNYq%2FS3HMODAGQoPOv9A2GzbAH6pVK6JC1ku39eFrGFuj8mvW1K5Sh0fA%2FjoDsDzYfIUPde1sB6B%2FCOBw3rL5Om4oMT5veU3NrEWrgB7ixhqrfpxLTZ6G885jDu9jGh3XIGUxe6yXh2tad2TIW8EjY2xtpN75x%2FEFwlIoia4Kpq0yqcDwfzKhx62EJq6t4Z1zUjv5sgA9HkR4AZy538LNpWdpRxshYb9IawwahWvmhIMsniNthCVonwirVi%2FAzyD%2BG%2FZCPqACx2%2F41gsrzqOCEKlOeQvHF7lREBUeGkHCId%2FmvKmxZAsPTuo89cPa2%2BBvMwiCY8TGdUYaBDjnviOlPy9O2vAR%2Fn7aCaJWjee07Twse%2BqtM0%2FRllV6DQ%2Ft2MBdih3q16gCDizp9Q%2B7qGD9TbM0Rj6x2GUXO0E3TDJysTQBjqkAbARqyxQz8YwwUZcyCugH0ligOBpvVfdyEsg5qHfI4QG1VwMNdXPAb9KbzgzUCOz2dFo7dtvmvOoEs5neQNc9uR%2FqxEw7VQ7qdBUfpbm0U95%2BS1VoeIkowhDxUfm1FxVmkM5j%2FE3d1KSgC6DqvPDmeT8qDaog2LUoWYsa%2FXC7cwRJx6dKeMdDOQKFd3JgghnogUMfQq3934xs9ZPGEi9iT4n1%2BnJ&X-Amz-Signature=78ff993cafa03e025898718e1c6a0dd5913305fb61a3159198d6e42d359f3c66&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UX7SER7Q%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040648Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIG9LhLNerNSrgeVmh6mOcl0aWiSJXSNP39r8YCGBhSmWAiEA%2B7%2F%2F5WKlrQFntmYoXwqtK9Qdb66dPCfdwmut1qAMZyIq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDOYjCelPT9%2BNr7q73CrcAziUq20aJYjzYk6b5itfFIHklLerlZ5l4GM8911pOzSozwV3Zwh0fBdeFuV1cUlyWWOTctSwuRYUStmwVlOBcpDITnytCB%2B0bvyby461qd5aTWGQmUr%2FLK6uuNnvpkfXL7X14oI2%2FuyGeUDqFTMeYzH%2FRXKwpM90JzfuQEG2DBla9vawXBAUxxdQuy6gPg4fZFS5HnjeU7ff41gy%2FVZwI96nlG3RG9Dn0R4N9ikQq1ZPfX2AGXyACKG%2BtteTSmZUkFtZGJ9niQ%2FG6RMa1mgY%2FCM%2F6%2BRvmSNJovumIA756ZomQcHCXgL2hITOP3cUGmZrPfMgAocVkVAJw7FKI%2F1THNcgkAZhaOZs036x0hWeOa3nmsEJjPWi6cvz1QlktOaJHZsp%2BBDRmA6HRAhammvGNByKzQNbO8b70rjTeREdk%2F5%2BXaoHqmu5yWzdOTNX8TOxd73OGazWb2vQM%2BK35AwmhsOlgZ3RDEn8AusUiDAQsNQN14dEWBhJuNWB42ThtphwLo6jzWFHKMjCMphmhPn2MtvUuuTlU7%2FvhRemO9ozyqh7EHmxkkAjhhtm%2B0JCf9A229PNhLZs6Z65J6HXsLhcBOqMT3GoBxKG9GvBk%2BcuLCwtY6c6Dk67p%2BQyY2wEMILLxNAGOqUBOmxI2FQE9mXIbaLSFo4UDEQ0EnQhFmGFpdtBYvZeMMWxQ0UGyZSJ0Dm2Oj1wTeRTcUWFES81EaFfn5Znh7YjWjixK63zKQjU%2BlknUQE2fm4BIbIrS3xI%2FyXR1nI0g%2FAJkznGK493ZqcWV71Vc8282a6wmU0wsw4Qlcxn9ulodtRpRzUA3%2BuzEHeUVc0C3JWog90ay1q2XA5OVS9536fvDJwaeZ%2Fj&X-Amz-Signature=95a335b527e9284930b17552c35c230a31a957c5acd3727a57517347ed05227d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAALXCXT%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040651Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQDGCvgMWgq3JpQ62Up6dnX%2FR%2B2fcEctTtVR0pPA8BACyAIgaY%2Bqil8XZ12g7YJWRRT%2FhCRjgCOp2tGjx%2Fy0E1uSNBYq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDNGHs2grfunnS6NJtCrcAxlTyVMIl8r9VgDaqcOWPPBCs0aK1OBMx6G9kY8WtVnRMPba7wzHBAvLhIMs4zDcAO0A%2F2EkHeM9lxuKCy5BxC89mabWxjgyj2viV4hipJJ%2B13IIjZeBe3JqN%2BBYFHutcI0amyJla78RvV0IBKJSRB589xV%2FZ%2FTL79GwZ9k2qqDTkyt7FwIObwy07Id6HmQE2z8WjcdcosmrLzVtt9meoPtzowcPFucIlQVkW%2Fp3fmWc8ZNZ%2FoYZh2AQ2h1WYPW27Q7Z9JtD2pq2enWHPUCf92TQjcTJ8XQfQQb6HS5KXLPl2eXKVUlt8RXZgkgKfd2pWIE3kbchh0VCPMvRBB1Vn160q58gMo7PEejyQFzPhiVQvCR3xzHr8SSMMLrfTO%2F%2FGGP7mIBEp8FOri32AlBdK6MvhMvbOybbjPD9aRI4%2B56DCSs6oQk7Zd3EFMLSDU7pNs9PvVtk9smiHhgxxEMix4FBT%2FiYEW%2FzeQZ6Z8LvIOLdjEWfUqeptGkuKr2SVTu%2FwETwzE6AyR2ZZwbpnc%2FeTLq9cDRQLEzpmWPEFVIT8zEJ07DVvDnRrBKjq5cQXBeBiQfsHzjSKXSZHxprm%2FFxeLhQ8PE4PD5KVkC4xqM%2FJGfoteB7EjpXdFsFw1FjMKjMxNAGOqUB9I91DoQpfLpdVm8e6idz1xFAslPiSSy22qyRnjvcJcVU%2F9K8cvD3C7lDvQaQwmgcTD4hkw9n8C1CIpmpUAakWE9EoiT3vxIphp9hfEJuIwuZzSuprBAlGQ0Bii83b7%2FSK8oL487aPFy9QVdo6y0oS96E9uoLbm2XD6QTg2tdr%2FFikJixDn0jmKWxa5vRzbkRRao7RbRcO3YrRs82wrl8LKpitV9k&X-Amz-Signature=7d7f9ed8dfbd2772ea0b791297bb2790f8724f606cc6141217b784c4dabcf102&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RHBZRO54%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQDh4AXrWTrkspDKbfPRevZY4qHO3vS5byV2sE%2FnvnPVmQIhAM0A%2F5Rgf8idpxIyKeooyp0DoqBSoyhBBimsF2oEyE2eKv8DCC0QABoMNjM3NDIzMTgzODA1IgzVLiO0caD1I5yX5Nkq3AP1MamEpnF7u7ridUNvR4Hik%2BaaRsFckjeGwFF9bLYGVw%2Ba%2FxY1h6m%2B1Qla%2F9qPXxypqbeC3QLpEqQ05aAIruYZbwC82TDZ%2B%2BafmkG7JmbaFQJ2RJJDGQMjGU5E1Xg%2FKeIaqZTB4Zfagq2EnjQbDN1k3LxiC23B6lhS1%2BQGCO%2Fdw8efg9eREMWVMd94wvRiQdedNGq0I%2FYVi5aqBpmOHR4eZnf2UIjZOPNWYiGDg1sS1zhwzcL%2FALxbEnv6D%2FCB%2BvyO6g1l1Ior60VVazKhLY5oWoMyawyjShrkIAVKQytptQ742jbMqvMkodAMSQBZi57yQGPu%2FmeBCyCBUc1LHSC3jZLZa%2FU6wK2q%2BUtg4SHdqO5DeJY5Azf6axNibGvoEY48kWRSS3RZkUen4l8FvgB5GBXARD0XDvWOSCMmgFCo4mYSrxYONwAZHwXhwliaozrp06SW6BQFyw%2B2mZEbjA4gb0sas5ay%2F7iV0KQd59%2BeoUTJ%2BjhPPvj5GOt6utieBkTWqIgPUn7icurOm6EC%2BnqbCo90l2CRp36bdc%2F%2B7Tt2zCA%2BkfrniF%2BJI%2FwofLr2pJ%2B82jTrI3DjDsEPssw%2FKqxl%2BLSAdnLnpik%2F4fYiJDQ8SSEnXETkv0pfn%2FUx1TDSzcTQBjqkAVnwxo7tYVaE7AZ3MXUZQx46VTNFpl0VNWahyFAlPrWjXIrPy0qTf5Iz3Y9Bibaji7SMhiv2Gt%2FLpO7i6uiWeQmh9Pku4awMHoh%2FB9TpnbYPDosSvHD246mfFZyE0BJe9rXuEdVR8EicVYsn37s0YRadwWeoYZD4%2BXtASLMFNpbJDw911vBVc0uYZhfY5EY8235W1U2MO1PoLxlZdbQeqZCSFNVn&X-Amz-Signature=f7662926aed47420b99780462cfd6aa5acec1f6d46dc029be87a963f12faba89&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TUQHG3TB%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQDOLUm03jxL%2Fcgj7lJ8sCb%2FOhKr8GsS%2BxXBZT0Z0QAYigIhAII4txQR4w8Aq4t8R9V4cP5iA4om7dD0ZxBv67VfjEB0Kv8DCC0QABoMNjM3NDIzMTgzODA1IgzANsSmnCSLVyg1wVwq3AP2pRul9G%2Fde7lqmOQ9uO3oZIZa9hb0%2BZCG%2FNzhFky5Qv%2BA6PEV9jViZBDHWeuZNbLNF%2FjH4%2B9cN1Vco2600FXAmvUR60BK4BDe2Du2jd%2B9g1%2FcrN9UJmlfuTKu5cmN5tdYPUGZI0epFp1pYEgDjqohhXX%2Bzl96b9Vbyb6oSS%2BhmEE2bIVl0CW8hVJEfWFNtOUWs%2FAs1xF1gf0Ygv6o3ruDTaR82gr8fn5IvklGQVb0JSHX4r%2BEQqQh1bKwGvCCQOSHGl%2BzF%2F%2BczpsluYMfswJ9xXVaR7bjrqtLzJjHHqiXJIJ1fPD3dIDYDKfsDyLr7RtK5cunv2Zp%2BUBxz%2Bl0M78bRWxXjgelyXUlQpZEn1uprbAe81iHBTc1VBb1GMc8gHEVz1FBI8DLUtlfQEsaU2BuqiWOxLdiXcvI5THeyhTNJ7EiSgl6x98KjSSIKvDpu0djjhQmlrHECwFScAwLgRxwid4NLiUrwdf8rWjvXZzRARFleq%2FdNmL6twFeATVtMQ39ZxwXE6VZs%2FYabVIi4VRiCZZkbi87SXZM440JiswlO3h6sUgQyjNTIkrjNSr91Yln7kHUYrWrk1ZcsB1sFyHFs1Y72rrO2MAKYdJZ3RiwEOsO2Gqj0OqBggR3pzDkzcTQBjqkAdEpSgGfZ8hubF9epiIiewTpx6p3BWNDWsfSC0vDJD7SQQGUctkKyo1U22EN3PzkLcLtZIK9VIUpE8qk8ng4044sN%2FUa0IvToWvzgDXusON%2BMoy5dJCn%2FHwjud7hwwuEXEXiD2nI41mGL55jT6a%2FiCp3kMlVKeDPW3ibpwC7QKkqjviGkWaKE002Z5w7SIHxG93%2BISwAz3oAvbCnxkYf4dcG47uB&X-Amz-Signature=8ee3d61ef2d932981f20bc8c1e740074ba64584c73342aa3195fc136e4b48f9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SQRQ7XQ5%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040653Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQC8uMl17BCr0W8FlogRwJrgz%2FU3NAHdk9I9x28zn9eRSQIgMhgQEjRU1pJvBR%2B9Ncc4f9ZKdoOehg9Cmt6s3ew85Hsq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDNq1BOIovD5p2hHBXSrcA11zResB9kXF070tFSpQILsnBh2xyJ7AMYjDhr66mqU07kjIQ9GEXz3%2BCFCjzugrhRXjVqVD5K8bUZ8Kv3HNVNeVzuu%2Br5fPEwnF7NTTZ5cKsZgykgUh0r5VpMRz1sKc2Ed3jNuy361d6D47abl3uemBzQVwgQ8NXD1PoKPAmu3cAjHiXOsh8dI%2FfIZDFIe2WPWXn%2BekdqK3SCefln%2BLFcQoQGmt0%2Bt2lPf4mQwghwxuWUbMn9bC%2FDn2u0EsjPVd4dq9YGLpjBk4z%2B9bPi8vDStCLuQvxfs%2BFHa9Ke0EN%2FDocyNzSyLfnEyGoVFV9XiWJKc2H9LrHVib5WvfAe1wACyGCHcGXrwgooJBRAQa2RlcXKP%2FqTEzbYAJN%2FydITbdoT3CU2Oq8MycpDR62ory9Xk7A3mrO7%2BGATX1wG1YLdDhPbUSHJ093v7h5x7Odmq%2FCH6IaJn80dQ65vzOr8Kx4GXNJheUdSbE3jFy7GWG8lRw8ffRTYRanKKc7bt6BEiLX7QJj1ScOJVZ95rAyQqP2eLgpEVlh6r73qv%2BiV64zbbAxuV40nYHoZJaviHkC%2F9dj9NLJE6X%2Fp1D4oz%2Bqv0O%2FM4jMRtpISo3EYN6LxjA0jhuZal%2BAW%2B9I8zHCvmHMM7LxNAGOqUBcVbou3wl01OfcNOUmYfrMJ%2FxQ3hhScQCfG3D2mNQZiW2tNbT7Q346%2Fqmr6vbNoJNdr3GDMseghxsQyiM9wNz5J3eR5UdZjF%2BGtjA4Rcsd9UypGjeusCu9MdNaBbrUiBwsWlL3SIsQwOpMXNEwwwvKWvnieRl8amb%2B0A15b6pwYlMSXrt3zRl3gusR8%2FCENncF3lKk2x62Mrtv2h%2B1KU5gijKueSX&X-Amz-Signature=a44b01a8d450d39c17c05acc4126cd11a708ea51de02782bc7d6e4fd979d0301&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WFGL2F6%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040653Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQDHU5FkPxVYJOz8bNrZK9HpBz6HJzIjYdjiKFLIEDJvygIhAN9sR4NXv8UWYhWjrvkXuhbEfehuX2TdZnas4UAkk4%2F%2BKv8DCC0QABoMNjM3NDIzMTgzODA1IgyoDGDnEUZ9CmSqo30q3AMSVPqperT3Nj25LbsSD46ZL%2BGgwq6wsmdRKOBtr85PZgKxiFAaCsXhq8RHYn01RBUtG0sGaefkraf6NIwGDmagci44ncUAaS9Wzd5u1hJXOGSWxQDO%2FIEpyEh5ISFd9mmtQV8PXZdkbolcNC1u2f1wCe4MHWQ4tFKryQ3stdcM4JJvZ61xxW%2FF6cbnzxVSoMFbXWjSLEdrrCZwl3JuaPeNkxOtrkqkyvnMHIEqLxXahzzwOTTj%2B30bN8iOY9q%2BSqPQTd%2Bo3NmCE0k3h0jGZwSIHaWliI6C2I%2Bh9FF%2Foa9dHrBKZBnE%2F%2FVz3LHG5%2BnufFf%2FVpP1HrEwZZ%2FQOMkOBqG27e%2B3AnlPe08EW2O9z034w2frWDgsvkEyWlB3ZTcQaJORmBLGWGieUPsKR%2FM8JakQ1d2S6bg2CDWD5gK4XTpk89UDHwO%2FcuYElrsdWKcB2xDXCJjY5KpdiNVajOYIGthkidbq3rV8lgTgByD8TLpB7HKRPLGDs2K%2Fo9ERiL8S0zu6Rtn68Hk98DQAttKEpbQXd2fajAxdbeN%2F1o9SAn3fV%2FNCr5%2BrUM9Sc%2B7XbqFXg9geORUJ68br%2FLyBRh22XJ%2BNyKMoW4g9C7n1Dnk5UfWy%2Bz7inNounuA90o3DsTChzcTQBjqkASFUPlrVkeg17PZ0lW%2BIUuOqgWQaSmnuMjsC0DPCbVxwNqL6OpC35t1xCySRyXDfXIU%2Bn0Dcc5GEl4lsPa2ibuSpRrzWXqaO%2BA7%2BZ82eDAV03Ot%2FJ1ijQQ5KuJ2JjIqx%2FL35j%2FQ61bBD2eOllKqz73E13nWvYeoyoVTQdCaPGSGUb5NgmZX0cphRVMFWP%2FTcVyXE4UTRLukZILNNXNVzRg3Bbsil&X-Amz-Signature=b0b317b03e603e9273f5b334a4eee4f1a13e465978cf056735337f61aef1636d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664C2JUE2%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040653Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIENJU5YGB5WLqApYfWRWSxYTOL9TBmm7bMFw%2FHhzIX3jAiEApO9K5sf2MD48D2bh%2BUvmPDL0nj0W1nYWbqbntiSSUL0q%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDL2bgCuCb5S%2Bf3UgMCrcA%2BKQamcjbnIIBJAXTcjNLKwbR97FTLu78HIrbmJg1TeK%2FMhZnKycOAwJvsiCzDfiv9bCEjIoc0DBnO0Wl%2BxplK0l%2FWQLXDi3sM7qizmVjtnKtr2iFWfJIFXGPMJM8iSv5YD5VuwPGCBzOIZHcXAyTaFUUX5MEnBR2%2FZYQBVbPIjP1UVFIAUiN7%2BpJJEikbEpi8XttPPtRggR8y6WvckWsmD1CEEZjV%2BaHNEWDalBuLZ3LinA1qPCiUXSs%2FQpfXVxYqbBQYgxQZLpDae35vBJtmg70ylgjZItR8aILyoksXlFLnXkslj1qOarI1I7rrQd5wcaaTKim%2Fe0C6%2FtLVo6nsy6c0dfNKVlS4kQ7KfITOzTLr%2FbpTMhvdkyP4WJ1qscAPpP%2BBGQAM4bpkSaluYUoJcoCjOBQ%2FS1iLlc6J0GbG%2BPmqojGIZ%2BnV7N7g5JyyC2DNB3jhoq%2FxvtIbn7G%2FXxneJpQfXNxuBhkKc65z47qKY4pG04ds0VNogs8Dr4IkZxDY5Q08wES0xCVAQXzGP3FeLMU9zv2HJ2Q9n2sATyeTAol3luG9SL7yArpZNWEfnFuuqM4ftP%2FOuKX4lrGdUGYq6eNDLsIeD1TJskKQEzme067DO%2FgpNhb4N5gs8FMMrLxNAGOqUBa%2BCFQTYXEn8RZQoulalj8Xd4GBbSHL3w%2BHyeyVPQeR%2BKXFMZ%2FWyv8XFlhQS754l1mGNZSciUdQ0jQmD7syfK0o%2BIeSiX3EH2jAh3LaV%2B4nDlBlusaCkKXoPfHn2SH1EVUY2Th1rAT5xIPxl9AeZFw%2BefwuPY3rCP3%2F%2B7TQUAZhKouHRS89Xkd6aEvclKvr2j5J9MX6qOxlTNqs991R5C88OhQqT6&X-Amz-Signature=75c96ec33700e0c42360259b962d093bd32675c1e9859c1e29867edd90d86c7f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665WVPC7Q2%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040653Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQCVGR2ym4JQKmvfVKT5mPVedTvFnUuUfynQjpXdFxM4OwIgEkZ58%2FDuO8rSdYmT8IHGMXYGqiOU%2FVr1ssomO4k2A1wq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDOVJaXyTq6bIdWbMnyrcA9CbfV113oC7S9lpU2ecx28JF6kfPG3JmaPfWK12Be3uAZUqJIJk%2BWSzad3l6ZCofsff48TeIXFoyj7e%2FY9RU4r0dZoS5xLjaUrHlJLJc9q9UVQeDwfaF7%2BZlPx9%2B1Gfuzc8%2B3ZBa4YD%2BBdQPtwW0mAEY6pMe3Zmqx1KY3%2FykcM74OFrvEMm8s93954yG7S3IYiW4mwCKYtUR47kEsRrZyG%2F3xQQPoGiZZSt%2FGFFBfJpm7qfJcCTrPhsm7EsbUq%2F3flUwzHAnh5MEnAHNgaTkVSTkTdX91T7rbDparb1UvSUuxA059c4LJa1TyU5eSG8QYHQY7LsUPsRSB2sBu%2FTaowPHWZ%2FlFP8RFoadoXEnaMFX3wKQLVr883DNO2D%2Bcp9yikdrXDGfQiv1V4fa%2FRjUAb7HFqDsg3rcB19%2FVnZStAqMiUbKw8ezkmfZpYqfvGf2iW%2F8p%2FbA6kLoy4%2FZyHYT9buHcihfR1OYVtNKhX2OACQ6FqgZEMARuAM%2FZ5Bccob4JVWxt7eOYVV8MlkM9Y8NP64QNH9vMq0ikdliqotmxkGfdfTvsgnMEBaJHrtriHa2jONegleQDVKcAm6Yc2qIwmbDRodtRhylKEmCCEozOCoJT8oj8j1sk5ullh6MO7KxNAGOqUBA0kKKFkxUhDgLqfIEQORHcTOZSHnAjGecmHP21AW2N0FNhNk3TSREMG9hO44OUlPJSI1cyfUKqh7Jncf9jsAVUFwdHb5CYIkLk24UgZxR%2BiMjnJbj5CLsKEHduLszsdV5yWo5OFPcIFzOlNS2nbwJDNlsgHlSb9s6c5sR8pOnWqEkidOfadw9FaBbQOCpnNbKe7Soz6l%2FbHSicSBx5XOC1bmPAUm&X-Amz-Signature=aad881715b1fe5614721d855e917c93d1250f53b46f55cafb9d6c933835031b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

