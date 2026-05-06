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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHWCNIYZ%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040257Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDGsZqXfX2tX6K8r3LeZiiE5777%2BmPdWcY2f%2BQo6DX8SwIhAPnbhYkZ48PywVlYzOizJ5FXpjFn0ozrXR1yfxvS1qf3KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz396BDc6c3u619PEQq3AMVGSQ28p0DYMKO3qzl68Uf93Od6CgTwNhkgKa3sI4NP4oOghv0fTJxLNzWXF1MaI42nh%2F7O4ztsiigSR6LUevWhQarckCIVWkhSnqj7krEFOZcqHV0Z%2FKXs1dF78qx8WSAEqtH7fblPfCAkIQreas9Jp%2FL%2F2XPOaftm9TH%2Fh%2B50wBMDhwLVGKFV6KvA2Lk7ty6SWa1b3M9Dl7R3B2MBiX9Z5%2B69I%2FLvjqQsKX1usKGDF9FSm78%2FugdvDbI4gzaEZ0dpyj4takOYrd4NunNpeCjYj8rsDRa5gQW9w%2FGzB9BOwIepBCxqN4OCrDrfnLILUf1m5AfDrCrPw7fNSL90M8izi4gBGisbVLyLZwmaVp8lruywCllURrey4nZf%2BFSjCBNK4XQHt%2F5yry5jleHo7qv8WdLk5y3SEd9DItoQPi%2FaOU853XAEDyMkRj5AB3Vd9rdhxAzCV6SmthEB7QyQWOuHxj%2B%2BfGXiqsCU%2FSdctiMelXwthjY6dVJi0uUe7B4wtKgtnS7gATUdyHsI05pGiyqpo%2BAPyyy1yqYUU7bGMm3UQxyPEN08Wn6xEugNQATZCYFrlEiGirgi3ANElQPGjadE5ZpWmklkQmp3b3qZIvC8qKKB%2FQ1ZM7o3PhssDCN9%2BrPBjqkAaAYjgKcR9yu4wDiwjG%2BVr8e6SCYZZIaRcxQ9ZXTOrNXFCiBFxKTpVCRlYnAlaMlaUagp%2B%2Bd%2FPLLrLzU1Eqodn58HyijeGo0EPMDzp6uWxFYVjD6SDR%2BqS7BgAMF1DwfjQVnngJ8PEDSWG185Osk0xWsx8rMsuUGDS6nRpqyO5RcqeRBHsU8hQsOJDR1iI%2Fz8L3qNgCnFwkqFHNn5bjOnspe3%2Fsu&X-Amz-Signature=0661f35a3ba708ba7c939c356d69678078a92c2efefc5ffea8abd579cfe7c0c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q4VWKYM%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040305Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICSxaG7Q9p4%2BDqOCcFvVzNrX1X8XeqLXoeRstqCCHJCdAiBPZcL%2BYxQKPVZUYYY4NoHXnQpTAa63vKv5Wccptb5YRyqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM2MurbWb1NsAv0TIOKtwD4aE1MzSuFhj6a4nizleOF6qwoeU0SLOyXa%2BeJNcq2A2yEKSKqIpO32qc0fQnV63L4OLlfwaQe3xoFBfjZV6SWdxPlNB0fueC4Jw47kod8stfNLK0%2FQDDiIUoyIMfpCag0juBweoT%2F%2Fu6DFnZHbZaYlUXM17g0lBaMeTRCSVLm8AFyDcr4mmWffa7kbiuLlMZMyBzUxo6O2KL%2BhaDPhZC%2FvWVLuJuVjsM36ZLRvNHqnNJPS8RPby%2Fr8il1FSSDpTlmnmHQZZcLOQQVcN0nNFeaWu%2B%2FFjG5pjMuW7s7eguaA3dEVuX3tjcnLFFNwnnrCQ%2BremK3bSSCpS8mKLbKMvwNjCOW2k3QBIN7GNcj%2F7sYnng1e3pOrfv0tFH9y7RpOzAzulYA6ZyPDtyxsrYXEgFvfHOSlmfv0Kd8Dpkqfc8G%2FYrS%2Fbml6atLdtPUqsf%2BUDV7ktq95zNv2SNpSZ5VzkW7%2B6wHHT2viWD%2FOsUkP6BInua78cRBM2a1fV%2BMcp40I14mCaWFx2gUb4Z0wZe9jAn204HhbRLfIQie7FCdwPrf7KTEuVo6Vhoyibhw9JurPEDkvWyRGxhxgXcV8XGvkLB%2BRAZzGqn%2BxK1xmCmJB0jhr%2FsUVGVuqAGLs6I324wivfqzwY6pgF4VMDOa%2FcSSV0s0pSrAOpS%2FGisvQxXxWP%2FcYYmzi8cH8ojMti1LqwTXqZ6DTvqu872xk2spBdhgOrfMsqS2Ky%2BSPL4heCN1BQkyZ1E4cSxCEx7IeaOx%2Bh7cPfzkFjgszA%2FSVnUpoLHiMj7fwNe7bqx8udeSqCSjh%2Bo1hz1THs2Ftljq81hhQbQ00MeQyX0kI5031V3XlR6IYUv%2BzxBLDcYb8XpGwEV&X-Amz-Signature=655ffb1cfff57ed66b96c9ed30707775d4c66f7cf5196bf3e02b6f4a6525c723&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665Z47ABYH%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040308Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCQlgIqH61eW6sVGAdL%2FV4c1IiYAd3tCBxus3ti8LeAAgIhAOmm%2Fqb2IG1G9qDqyA80zxjObR0vSun07hRjQb1msSVSKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igypaz0iDFZ3JRJHrt4q3AMEs51Jt4%2BorvZDEKm5pvdQdSHhcR8bQPKvjbhcqMijujOqkOEybamtxcfhCM0BYJiXmpdxe70JXllxD%2FbU0kqrU1mz5JAd4FO5BOdxYb2KIQK50M6DnFQBNLGIS61aUWGq2f2wPtb4m4cBHC6rjkDaEF6jqhyv5fPCKOmKpfqMk68vq9jCf%2BFaERTF%2FXFRGv%2BOS1xFj3%2BGXGOouSA2zcQiswryHFlIzqknYc9GWdoVa8wFjuAdYN4iiI7W%2B6kFltt8fZV%2Flmoc9liV%2FTRgWnxeGKvT7agcoGhlhJqfCRHxTHzmHho9FHMvVIwloaBhmsqUG%2FN9pGGmI7tq1r32vT%2B8ZehjsfN5DmK44XHHSgid%2F3nBk%2FFvz%2FUcUqdILAwFnsnWCclDNYPyprtqlbCuqy9KrA%2BgQjdI9avqpf2IVUGBI9dT7QpX46kf9P4in5f%2BN70MtWPscN%2BIo6hsHjxBDZvRRnNPTQu25grXs8XsOvp%2BPW8FJ67la8tzDrhwvLOhL9n84gDpXLmUlOpiVCz63X4%2F0rVZOmZaoYYfT1kpypvZJQBnf35mRSu5k7%2BDimkYcZWOutvzTutwccO75u3BnH%2B3Gx7oUNgw5aR2oysbKi6mYG8nSN%2FTeSIISRzpATDT9urPBjqkARcFjLJrAILkTe3jUim%2FSrB4o7evFPmt0W3CZWc8r5qlPIiUVyFhKid%2B1P0rspqUX5Cbkd%2Bgf4kEzSwiCkKy8Fz7p7BhvKgAouYmL6Uyf%2FVKG18n0qDq9IY7SX%2Fz0yx%2BUlyYcS8wb6aVMR7%2FX4%2FKD7Ub%2BJWBfygS3Wx44wb%2B03aw%2B8xUa9h1MY8ngqL%2Bl3KqFimCjcpEfGLf%2BR5d3%2FNvOWHr2K8Z&X-Amz-Signature=d4b0abf0bf73f4eaae546af132b21bd9bc6b036b76091a6ee8d576f934bc419d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666AQZECMS%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040309Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDUBQ0a5%2FeRQfEYCqlDykQW5AhPeXbQNS1s61xIRqp9LwIhAOriGICqBKRmeQKAMSrbBTn1iOAIW7QKdpRvzekFYbXWKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyYN0Zo9TQfifR1yUgq3AM9tyT5mlkGyRqxLW3T9Sj2dDXQuvEDn5j40hLnYljnFi65f6CLkfNJiLwrpakjeOrTJpTOKH4cXXfP81qNTXBbh3DPOGFDRIYYCuGWDzb1Hn0LZx%2FAylfrvxAdh%2By5ikrBizO8cJkMPKz8mOQ3wgTbOlfWGNBP204YriZAps0BWSXXt9Q3Uv%2BTlqdVVbWVP9Z95nP1TU1pMBtMC%2FBeXGAVePLF9B1wPzh6%2F9knp%2FgUQk5UXXdOxyPFpkluSWvzXaUFEphGCVOy8twzB9VEfkKttCgl7Z%2BGYUVJsH7hVrJZVfyYNepAIeTsNeQf7PK0vD3pSHTcgQzt9%2BXOHR1WJtydcAor6IyVDa2NI1eeTVPYCi2gOb9sHJZoMMTyJWg8PuREU3ZcTVVtGJwz4Bsfg4BTjiX6bhdNV01YjN%2B1VUpx7dcuiXQO1hONmufLFfNaLvFhXJ4XMHkn7h9v6%2Frvp1peN2v%2BUrRSS%2FBUz0zQgFcwaFiE6OLruJqv6omUJmoARvA27N0cmbcZQgtbVaZJO93YBvJKbYquvHJF2BjKyt22Jmm8wzhWrlzEUvOWRO4iGGmmVJhQrUJV9KM6Wt188bdXzAdZg5GbD5gXNyHKoYRW3190vG4P1HYsrlSz0zDv9%2BrPBjqkAXBDmiNALcVWrFU6oug5RB17NShSVssmkUREsbgafk0%2BVws5JrZfwY%2FSvdrUOZeEMWe1cgCSavhASU6%2B9SXTcHvRMMw9mTOWyeuau3gQdNvynUDDTTlrIPlg%2FY3oimVOiuJshbDcxKuWzkrFsW35Ov4B0JcKy9C6YQ5c0FPmyx5U9hS12VxpW0lYDPa%2FYdyXqBnvlzGmpkjOo6GrYB3HczCwK8N9&X-Amz-Signature=2bf6f6693adeee83b58eb2135a5abe539ffacac18c950eb10b51f793f9f04e18&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAO3VGPG%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040313Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBIDOZMDCI3ObJQMwN6wrcFSX8s5dVXCw2T1YaYGU%2BQ2AiEAqXbsTl%2Bg74nc1KXEdbkv84h4M3zt49I6OITd%2BVRxqgAqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDL8OpA1%2BmLzGTwFEwSrcA3Tk8Mp%2F5jWAbbzQ1AG61PqA0lMsZF9AALx9YIT1Q5hViXRgnvObjgZ54AM8JXuWaDqbmikYOfHelXXfxHsMCOuu9iuAK040O8IoOq7wQvgXFzs2d2qRcD%2Bb6zVRiB9rru%2FhA8cRWdu4A65QANTZuR0BIkUZJy8pARoeB%2FfLmMa0mOSbb2Ifjjar9qf95CZK4oosLKK7JhEPBqqpQKLvwq7LhvK%2Ft5KsvDq1Y%2BS00ssVQXp%2FHsjCVLhRrxiJ5yfqFoW6Rh4pDfVSZpSveuMekdJloxUhE6OcttaOHqYAmfo1YmPZYanHwi7%2BFC8RLgZEJK36L8Z0xhdXgn3Kh1MqH6i6ct6iTXq2cFIWVeobSOf5JFrxwrqNeDsGUfw7qlgDRh8dhMwoSg5gqFRvkgWOAMTqfOgJZdxDxRPMLLsuYwdt05d4mD1jTp4BWbwxInhgdqZJQN2quGHsYiyRMNmScmcUmelA57kVZpakaRVQd92e5vFwpOAa6ft0PFGvXMjJQiwvbEb3NoQA1PMLZRNR3uBUsXyEYtp55wEQ7tihuj1yd8%2F%2Fnjpa4cb3j11N49fbx6%2FFkI%2FKxmQQTexMtGPnnSEybRQGbAHdwTXqvNeL%2BOYOcet6wk0vlfUdQkTMMIr56s8GOqUB6yTedjRijxWrGZ1Oi%2F3oYql%2Fw5aLS4xZKUWW67xA9SNvw91EkgtQW1aHSwlii5Pe1bxfAlaJmPOgAB6rjQSywvkkYOf5KnHhoHnCymNnRhF%2BE3VlrXp9vSjFXkl7s1fE04kWD5%2BTfEq7oIe5fOfPlJr4iWNZbEAB6GwcZnjdIpAfGJWq9yXup%2Fu2GY8pMeegSFhkc7JtTIMfSOU26K21iFZiSMDF&X-Amz-Signature=dc46074ae14dba1ec2a9df30e5d7c90acd65d30d087b5c4ada40d902020365c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q5XO763I%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDY9Q5bu2zp6tBBWdQcSC2OeXxvwKTT0c4GZfnp8tiuSAIgDs%2BVL9s7LasjFSP8E1C8P2qMVbQRmTGern83WKynai0qiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIicCO8%2FfXo6%2Bv5hAircA%2Bz%2BS4A%2FD3xIYLu%2Fh1sZF80bzpQRVD09aFiqgg%2FyREtpLYD2AbzlHtZu8LNBs%2FZnj9tj0oYNTNq2%2B6q3wGDj82SlAohQFNSwSVBdhsM8V9wwGIaEbeLS4OryclQ%2BhjhzO5wUsbPr1pd9eaEkEfM63XcqsjA9aZ95iQfMNPDb%2Frpbv2H7rt6hIlgdDgXURzMYul1g28HlHTxNY47M%2FIHvgJ8XPmY0sryTyJINmnjvFuy61Rs2nlI8tebR5MsMVAPXTFPpoOT8tP5eYDQIHHKTnBBcMqkvlnQFReAB7hOa%2F8VbsR4NncXXtuh%2BGEfPGNEH4LKKKlhAJklYq65z6SqbTH6dR4qgL3Z5MV8rOGkktt9g0J4iZoxtAoIeN4Y7%2BEq6RhKeb1vlGbGotadJwS4e3%2BvlvU%2B994gXFQJHigqNpCYn7twqd5hEC8UOQOHSlk%2FgXxDCuWiV97VjJj2c44gdlsgClgC1IU4pP%2F5u2dq72YnC%2FU2pNftvmmAu6uha7IppuNQ%2FHAXWpETLLnlJ5J93Q14C2Iw8EFqkLilMGY57wQmwXWgKz0b8EKWWDTCt7pD9HJvy7zwZ1078vhFqG1VFGytf%2Fdm%2B5znFgysXFGSphlVCuSLXgGv7SmjPo5UeMOf56s8GOqUBgC1%2FgGoezBUjyAEx1GXTI1gyJERvD1BcivVYC1yPtcxuM3cHbSUzC2ZEGp7CV6l7AfmFSk9%2FiVTsm5Hs%2BIyXZ%2BJF1cq3hYUcgsmzLJPdkX%2BOpjqMXRuIuxXYuxrF%2B6Ng0nVt7WyolxJEy9K4ELqHEcuQyBHgnukZIK2d40BaHB%2Blt3YcrtoAdzusEeYC8xdk17x%2Bec0eWStvkQVSbYJDzVeimuc%2F&X-Amz-Signature=1ab8da634b076a846dd9840f230eb384ca4a8101c062b4bfcf8ffc32e240e693&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SF5LOMAO%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD3iyu5nj7bQDQlgNHblzlmnoLYVRl93nce3P6EBT9YcwIhAMF3G6g%2BfpmT%2BJT4SIAqVkIKUpKXi3hxXvOTa6NjTFFDKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwVSIrvRH2lHc1Gzi4q3ANDZWjv91S2%2BMPJZsvsrUTDKcMw9kDsNygC%2F9gYBtl5TehUmEIP%2B7HtsAra1ZXiygLB4mql0s0kI8HNq90Blxxscmr5qAMxIFTf35k5JjrGzqMSR0UyLu54GhqWTIbzOHHG%2BpEbW828wYDFebrZrId4RtpY8KJKNuqRCoevd7R7%2BPt7GRbsWCck9IVlp9w%2BUYCQ5PFzRXEWci12HIUIiDC4Ay%2FlbrYrdAE9snT3DHT6Mpk6LRDiTv5pOdk0b6Xn%2BS7YoWbvUJxJIjPimru4imJU3Qv%2FFHAyoY8zDNyyKgUi%2Bp9YnRtMQZQG0CQKR3qAZDOdAGclIYCCqOsqbF0vJfMT9pf6bA7oBXttcAKSDTa7qGnQq3bn%2BQZuBg%2B%2BggAdT42okVRl0yugapHME9Xq4q%2F%2BeRmaAx3AJZ4JLiIbA9FZO2L%2Bq8a%2BrE%2FuejGUR05a4wnjnY8e0E0jnpTwXiuW09JP%2FW1C5fh2nXWR9w02Sj3kah61AUN%2BncIwb%2BBb6axgyk2AQGW2lbPi0JsFd5NQvFOxu8K52EPD1Ayr22OHMetiVC0vwnjJZGKiDp5xZaAKawEKh%2F0tHhEvQHP8nE4DcjutNjWicXq%2FBnAGLCMJMqugTHBRtyglyci7ZE9JXDDs9%2BrPBjqkAe8lfWg59ciMS0c4Ctd44L77vbVKoDFPeuedfNZuoj1nL%2BSDpLUV1EYivJ142fNO66mhlXBikm%2BswFp3XlAnrvu2KMQo2ERZ3nNg1juYCS%2BAUQ1aOrZ%2FzkDPYsNwp14V1jVK7FkZ4%2BhuhnN8XdAhg1QCUlYiTvtmrWOXueWKLcOGpif3baOvgHCxSQMVv4Kw11Mkai66OPwj4xxBcPVqkg1%2Fsmdz&X-Amz-Signature=7af75d7f379f863c3228d308e2b14efebe01e1c40b2c7babdccf16b3b31ffa2f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMA5STZA%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAsJKfDBhhM4GZUbI0tnVWTW648l2aKO2SiVl01XYoG5AiEAoe7VAjDgdU6qIKFeaOCMQ0Y2xcoqnIylR2SojlBKS2sqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDATlgtkGs%2FbD5reZwyrcAy%2BsIZ1kwc8FK%2BC%2BUbc0kXHV04TOQVzMClfND6rFqk9WAn55NWw0mc%2BJZKCLV9UONy05wyLCNpCY8KU%2Fvu0Xz87L3QT9AdYtLMfK3acAOYO%2FpdiyrlRwNT%2BEmTx7jIsR4p2KKNxS0mI%2ByEO9%2B8eT7TFya03KuWezAIvztk4P2bOXnEOZB0lhDmeXZ5nMJipwRRydvm74TxSnCgQlBlZJ4B5sSPF3CYtP4DVrVWuL7g9Z8iTBPsvm1rBVQsknCAL0PVjGbD%2BURdX%2BOele%2FoH8aPNLPr%2FSm6rJOi3QimicVLnxCUV4u4aoucR51hId4aP8tICBdDWl%2B6vfbesJSpWy1b68ls0s%2Fr8iPrXuPu5YjH9zalSoGblx7yjbgKJlhTLvCavSXqESiv4AOFweFwLJNBjYuwKEHVg3egHxFX6KBcOjWe97d63cGuII9ZZ9zeknm4%2FAN%2Bbb%2FiAdzAYtkb7LcGU%2BAgW%2BMkgfpCxdoXRFvcjJ37C%2FasnGXO%2B0Lgzml0s3UXkf2H0yOKC0QDU48%2B4z7qzxtbcjchwU4WmUI5fdmk5nwYFd6fVbBw0X1lxbzjsIAgVqiEesq4n1jgS3AuhS5PBkB8l%2FE4XoDWdHo05zHO%2FhIZKP%2FYJnUCf1Le4XMIr36s8GOqUBit1LNPL6TKuOakiRPT2GO1uqbTD4wr7vCZqHRQoXn8RYUlJAtmHkDYxH9YYKvLf3AG9l7xEFdKc0PW8jR%2BtGXbkmy8d0PSSCFPRXPG2tOYYCpspv9SXwANDS%2BRFNKcqWrdoMPYBSda1DWtpIQ%2FTbfX8receul08G2y3G7YIPuTwwo7UeFt%2ByVx%2B6tmlBFCcn%2FcYIybOnS1mh15Pio5fwLrzorM6m&X-Amz-Signature=17fa59d5d4220e0a0dbd0ecf44c6f398ea95f192cae955e493059167ba9f676e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C4N3G76%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040317Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB4P5SVqG%2FJDPQmgr9L%2FFx%2FNwgwSaJGREUzUpO5ogafEAiAqtAgoRqwI8Klf2yGXq8kCZ9IWVq9WPDuBeaQOVyujBCqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMCn7if817%2BwFPCs9YKtwD%2BrMEZddAwM65Ff6TiCQ0wgbEE94m%2Bv2ag5rP%2FPj3KpkCWbY4cgdILdLqDMLLJ8f5a%2FxVPHej5kNz0%2F9ZCipyzt0bdmLHMpmv9ZxtUo35SbtvvEXJWG7bh03Ely6ln0pyKlpoAMYivHGyOzStIYYBzaI9K3C9LpUeLzFXytEwkaZzUS2w2uDWBn0oue6yr0i%2FpFjiIJrdFjoIIfSSUu6Ng7NnFHILbNM%2FIyUiQe7d8vd%2FUpoP%2F9zfDX1KBAr5X95hwqg2hP4zFl76FLuUXGRRXbih6DyEQ6a%2ByjPgFc6Z%2B6AVoQxDg%2F1O%2BabhHFW3bnCToXSggX%2FtvPuMqW77S6vXXeiJglNimXcxcQvh5%2FlpGmUrGhPv0H3isaGjoLgOnrEEFdabEXMFsB5K9OMpKyRSG2eXakyvxIfdhlC2OjKhdnffVtUX9Gi431ZOaW06uoLUWbuWtO2AbfsN22G76Cj0BTDSJ%2FDyHOXtGZ1xvMrTB863VIVesTmXPfbQjXKvE309VIET91VaG2Bgfw5mbiTS97CxthVueie83vIPxL3LNDNmZSfVDFxvNUgPPD9SS2VAw%2B3GZxla00%2F88xIV5UTFuMLBGRrn6MMSsxwHushZv6nhIyZT9aMXNgmdkLIw8vbqzwY6pgEs3GbrF88jSVUSnWdrrfCxnn5sa%2BYAxz7shRPiJHTnZbVn223JfXzKBZXTctBhtAa07kM6GThrQ9n15GxKnNx8QKMuYhOYF%2F3h3R%2B5K0EFVPbbDE9n1%2FB8ess5jpjXqzKI3Ra9QDqIYYOwkr9NZ%2Fwno4p%2BCuLtSfEM1dDOO8tHUQnBA7qIk19ln%2BBf3B7PcYA7O%2BpH7E%2F8y%2BaWFiD3qCgGx9XJk7%2BM&X-Amz-Signature=dc3eff67969e97c19cd8ad7874d7ec480a510e36c08636fc650ecbf145efeb79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q6UEF6HB%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCEPvszdjeeCgkSIFx2%2BeA1w52bNyW%2BjTFcP71%2B9RiRHQIhALWy141VOrKv5ssNhTonzRU5f%2Fm6753lTYegE83fUuQPKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwnRHuFa4ocSYZA%2B%2FIq3AO4QyPC%2FLwW2OjDT6e7tAoBIy0QdDdY7cJYUOp4jk1OPtTX0PudXCN4No%2FTV8it1ihTDwmRGr8wnB9JR8GLUY8rBNfhtD03Pjd70P1VfaXfmv4FdLmJUbMH69U6gHz1y7Ych9KuaT2U4gbpPFtknDgudgJK1gjUFAXghoPEFhh72NDd%2Fd94mtribYG6tISOJD2Qg3nDHBnfEEZp1gNJg2g8vWNO%2FKBtYhtK7LL8%2F3i%2FqhXOxwCTSEyh%2FDJ77g0M4%2BGomunt8nigG5UwCptxrZ%2B613ry0a7JTm%2F3eMYdDJbQkpgOZ8Y6N93XwCtzTtrfi8sduxjCK8DhYmYKvthtyIa91ckawfvvAJRWT3PqjwJ776XhPXuDEQu4ahPh5sv79%2FMMKWvxc83VmzrFm4r0hPErVsjtYk5FgjSxLSAPmRLiIL8jRcpm9h8METla7LHh%2F7qgP3CdnP%2BLkf%2BrK1%2Fv7mnqpapP430F8MotL3rCnufiW%2BrmEdsAKPJ98PMzggPyO7%2FfzouQ%2BmA3pV%2BjeIFhSI73vz7tmLSmRRkKBAj5GlqWofFvGrXUSsSqJl8gnxFHma9lhDZD2Z9K1q0O6jhDRv2GQSppIoeojFWDmFDR8Dfp7j95DcrY8LFHkwUvDTCA9%2BrPBjqkAYZrmuAlGMmI2Nvf%2FepCEONNFsSZ3qKtQNYo5iQWi8I8JATgER7sf3Rsx2Qr%2FXXN5gPlhZWBe6s1wcoZqHWOqKXPywMhrtHlDvjDtMim8ufiahcdLKsV6oXFvz4Q5A0QpLBH9HzmWeLBzBUyHAK9o1GJtQ4W4SRop%2Fo7E384LOwGK%2BHJwMnlUTS0uyWgDs8qNzfauFqbzqCTSl%2BUq04L1RLKZPfZ&X-Amz-Signature=d31854d3eac1aa038a6be1a34c2ea80636113d58fbf1c74dd91c6fd3e3ce7803&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662KQRZY3N%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040318Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDFT8AzKg5nzQaA3CH9J4SCJ%2FhziM5TmUbqO8OgKIpv%2BgIgYkoNksoV1gzK2RrjL6gBMJHLfi8vIWmfQHrP6hhoS2IqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDF0H8%2BKUETJOlEBzaircA2aHhnMDi3JvZT50CFjfKvQPoglV2uwlQvI3lv5K06yTDY%2FnSNTZccuUW7Exp%2B8dGSNc%2FVPxujreP4E2rFn8Tq8AvwjEoMpVQuHMep2qow%2Fz29PxGiApqo%2FRdfVywu3y9EmjiC7t%2BZFc0WKhR2ck9XEaNANc1klUzwH7ifgOfBmdx8kSClG8ME7WwlPYQFJkesS901Cm6ivvEDglXvKLlmKATZ2DUVUZCLcS4gKSP4a42ciGoFrqDG0Ycw8%2BoR7eL3GDgbj6SydrIQso58HrBp95pH85Kf01B6FBUd1xD1oZjEbBDmeBuWgR%2BirWUbmSuUyO31Tp9Oj%2BHBKs29GcGPCOxtbzbgTxgGRmvQJ3Q%2BoBYvFFzeGiMSbfZADg2HWkV9jdbvSQwiIOAj7RtIk5pj4i%2B1Iug6foWQmBuKa8JcuPSdFOzGouXOxMGMtoT2J1iSPXvhQUKuH40tlMLHFsUK3kr%2Fs675pAQ9me5MpH9cQ67YDSq81fNw4dEWnEgO%2F7pr9kaPdxpCDFmeE0SFsxhYh3L0WlIiZgK0pFm6iiHmGsPGaVudeVsUO2bDGb%2FuaASLnw8n%2Fis72ipnVIi%2FRnmEoE%2FZwfz0MPp1zA2IdlJteDgf7jvTUEirzHxdT%2FMI746s8GOqUBlUT75yqGNQNd3serLU17BCIsB8ViAiWW4lo2Cy5HyTq%2FU2rDII3%2BSTk1dMVd2P8XMR8g%2FXi%2BdXiKpedHapbYHqdQqnp3Ve37VjsbzVSgPiisf10sqn6isV7WzXa26ziqCmV%2BzTLOiFhhYf05ja%2BVa54MTy7CHzsQ7UH1N2awHaubqe2u4k2n16DpC3a46kmmtbSx%2B1AX4syysId16kevKzM1OLNV&X-Amz-Signature=ff897aa341caba23639722dfb06679fac2a819a659421312049d0bc596e0e861&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

