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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKEWM5N5%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041305Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQD6Y2xICqM74aQbswIapxFDbIEs1voFWZty4N57GjglJAIhAM%2BY4rbMmtF%2BOQOf%2BuZiyfFH5v6W%2BzwuUZPMntf6ugqBKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx8vDxSsZ5frJEjmE8q3AMZ%2FzMWCYMji3%2F5EOjQhrDy%2B2yY7W7LnyPZmcYrFWTK1hCm47Brx3oBvw%2F57ZHRAoXZE2kNQpIPQpXrh2WiD%2FyImDGVt56mWegyZ2d60tnnOtRgs78jpmO9RIU50xlQEDeM1KVuUR6PcBPoyoE5vSd9a5adl9gL8zZHyzI5%2B3ebtlHkRmNqZiZ3ydZh%2BF%2F1Q74Fjv215FGt%2FUZH%2BrH5%2BAT0PBjeFUrT6IueSzZ%2BlHsnj8VKBfT8goLzMq4K2AxY%2BM59YhqUcIjORjbTcwwz4WsP6kHuWdAcCxs1egxlmY4nHbbPmB37r%2Fl14Ur9RhPFQrl9ztXorRT3FFTkmFO4hfoW8YYFIIqUl8bSBq9%2BdZeeOeL%2FNZvpv6aoHaIbyZmqgJ4XFON35IpDVKFWpJ0ChLFJ104A44mNXfI%2FdBr%2BHSt4cLdI6x3xd3ZZbcigmZ%2F7HL4PMlmB9DQo8WARV%2FEIY0CqKrRXcNIIjd3wFG5ljBnZ%2BBKkuJkiz7%2FARxoHwRZeItTw5xkwSf7W2VN8skeqLxWZYgRc8i49dq1hXHvcbB9KyR8BcYC16xctqdF0H3kdyKgwLfNbqNH%2BAK0iZF0QZK4sjf0OSR%2FISmlqIi7hSDuBseHAJiUn29UlrDjRdjDW3%2F%2FPBjqkAbbzIHQrAJ03LZuYq%2BcTESRvAfKbPsQBA%2FXWE%2BXiBtQ2vitI%2Bubes34Ol6YYPyViI0eOYNljIpFEEc42dq5NRATlE06OeuUjgRo2Hvjmhd80ftHzkaIzs6NxQTT894mwVr7KrXnUlWgzjwg3Md11UKlrFOQmhBMy36Ml98UCwcBRQOuH2QfkB9ltEMStToT9n86cWzngGpPytXBpgQLV6Oh0%2FGEZ&X-Amz-Signature=dd1a7931b89510dda8226de93ad143293b6739058566d30f5ff6cf2a89f11475&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q7BOZ63%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041311Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCICmNxzXuxsKpfL%2Ftf578p3EwUzmcjzqYGfBF0xHcA0jaAiEAkmsBa3jAJ3Wpa697sVbzaJbnbAqW9kk2WPN2Xy0queUqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKTXZpsiktNl%2BNJsfCrcA%2BAK9Ylljmfted5QGCnrZGhd33tfEZDg8PhglJ9di4a2mXr2CU8bl0LEp4PiYzKo5Rs%2B65VBTAXXRGnBboZwep8AlkHJQ3pMkkPZV0BDbwXsZRmXvbFB66kjXBsDo2B61mdBeXZ6mKHCDkxD6djqnlxGYX0pa9VhppUNc1L48ROkoxF%2BypOP7MLIkEjh3PQMmjaedqD%2Fk8yl6e0MmR9yTmucr%2BnMBBheIB5KsH2RjqeqbD4M8HqARXY2pQLBbg8dQojSTe3t1YHf79Liwt7W6U7GhZA0qmsKBr3KnrOFv17pp0VDTWoFOL1HGAqWduLPDsq2UVMsEqY4KcC4DBBuZPbMYqFhCMcsI2Q7Bt1WboCpL0cwD0jvDaQdZgPEhWSh2B1hzZWGu394hlAeXF1F%2FTbHaPOcBtaCkRHLsCKygcwjH5kIuno7bD%2Fd02vKKisJCppqo1Nw6cREDXMD45kILlZJUl2kNfboiNX%2Bm0n8JkSF8p%2F2UinXYVvEG4b01VtoVtj7XkMYt%2B0lwYa2extn6AL%2FQG8jDTAhQzS0whQ8q%2FU%2BrbDBqgYOqWG5nv0Fl9X0ZfGQ3sIp%2BBiMECbf2S%2B8DCkgj%2B%2BtWJ%2FPqaX%2FVVS3GspNZC4%2BxuyB8OYFVLMeMPrf%2F88GOqUBDb8cXEyX6zQnDgKYZUHywT2X9gKRIUeqGdeJfexk2f0bW359PZuonMkIVh7bPPOlNuCT7jC%2FJUHqi7emZkAgXbODw1zBP8fQ0SrgRjcdixJgTNKDxmN2kW%2BGqzw1RZCqa064SG6cO3mSw8%2Fdpz5TzdZx3vRXh%2Ba%2BLJzBARTgjK%2Be4A%2BgPhO747GZDU7OjdWxJcslf%2FShnPH1TH18p7z8W0odQC4C&X-Amz-Signature=2eeca2cfd47c78762d122d3980257bc7a1f4435e18074104c7542282c8ce26ee&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMALU2PE%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041313Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIBbNL5izweVWg8E6WXjz%2BkuS2amNUMsQpRlo5iuANcOLAiByNwvIUwzciCaNOPqtwzk6b2unIf2zrRCNMStCySvzeSqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMSU3S6kloqQEFikBcKtwDtigHcenuKoalZGkzg6RPgbtUBhfKoex9KkxcwhrZzLrpwBzocNLWf33%2BsA%2FDWzl5St2PmkpjhXMCwQU8G17oqyxJBAb85jt5CAa7jKjreUYR5hDh%2FCoIUu4UhtIYU4KBU78OcUG8fp4MoSKKsMpLvqM8AibUVVfV5yt8mWVrBEoYplUF6XUMilNrT3ItXQjD0%2BcsU39JC7idPmsi1QqBoPXbs8l323H3%2BCrT2maMhMP3%2B66bkGH%2F5hZnTpEzxzHf42XHGfSxoOu2yea4vu1erFa87Frbml8UEdyc6sWR%2BUqHbW4VGhuAnywVgNjZ%2Bosp3litjqw75c493RFVUz%2F8LwVrZBmU%2FJbDeQTfgXVhXYen9jmQN9KUQWn90aWx43raYA52QcoYwjA%2BWE4NYBg3yF63a5K6BhdoZ0j9%2Fxo62Q%2B2dx6kuQZ3Xi9api2sXh2EiQBwJkl1xFujmBj4sVtxCaP9DfQfP0ZJnAkGd9IwZWSFP%2F7pzUSokjsEFsEEd69KQBaYqnpsWQOfLfCKhbmcAnoK4RDtE1vjEeNZ0crmCqEQD%2BknwgKHxJbCx6b4iGXtebmLry9XQA0tMMpXQKgE5N6jHBODBLwKGnjD%2B2ntUs%2FYhRMafhu8GSM1L68wqN%2F%2FzwY6pgGnr43UoIiROetjR31GeTQh5BLQUSB11tiRFfkKU9OlWCVil83VbaAYKKAkZ0Vr7kC6mquBK2o7TRdRzv5faV1GDCD6W8zn9l5Yw7LY3CjtUQWYcZ0J57ZnFMFkoNVkq%2BTe1fLYpJ%2FkKsQO7J4G5dYP1XLmcswaceeiKYTlZIMEpAfZlINPNdPTJ9Tx0PpLt%2BQEvF0LGjdOUgHKr%2FSwYF65ZvK2n1%2BK&X-Amz-Signature=cb1a9e316b9c772622bc68dfea3d822de0c682700a7f0867f6c2d8573962faa7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UMYDJF75%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041314Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECwaCXVzLXdlc3QtMiJIMEYCIQDCY3pG93rlhltUCNIy138MRaUzoOMqSyNN3Y71IF33UgIhAJLz%2B34VDXfoPO%2FM6PwnSgF0tbUqyfg6EQ8tkC4Uy5sjKogECPX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzkdLUIsTakrUhwLbkq3AP5DJM6bHXVSBKWLMl0FyR4VUDXUDzRDpWiq7VYZqIpmbglrKndLRxD4SXTubdoDPwq0Qk%2FDxQdMFzd3OktTWbtarZ46mxhSf6B5d9pMWC7QZx12ATn6ZuDv51cVUPxBnMw2v6wEDvF91omDYkHLYiw5AMWRe%2B35KAkPigi4QJVWMWJz9lJVQqo3cJ1%2Fl38JaH5RGlFIrCYxMZawqfeggmZKgpXZJ81%2Fzf1ZM%2FsgYJ8QDNLDTH86t82hogoSulJkjzoTQPlUGSc87BIibx6U5KElLyAj8q0AcFPYW1cHdNJKZ2sdt6h2aGT3gisXaWmxdJJOQUGde%2FPcutC1OQxPKhilueRBFIJgiEs8VPcmlJ78qDPggB4ORY%2Fz3hveaxHZ%2FkGDBObisQoQLqkpFE97ZjbxA5wF05hg8Wv4rHyotOWp%2FCo4CDVFioAFqjPLHDk0VXi1pGSJt69Zpa2eUAjhydLwX%2FnJwFHK1guwggFQFugTBLMrNObCXSse0JfoLEVFmzu79UNFQW2CS4Yzdq5pgruAlqXVx5RtEUbpIHIMXEkmQyQ0gzg9wbKYhHP4zIg8xZjSNjRufb1QqqDLmuUBbeVD2E%2F527AeBv%2B8O7HsckElJyc6GqMKLa38NINYTCY%2BP%2FPBjqkAWjAs7XLV%2BXiCJGQTyLLuUMMTW%2BBBoZ%2BXio29j4l35wGsDo83RL2525SAfJP249YEdRxFBZgKXw1mDtMJo3%2BJN33u7XE7x9sAi3BUeX0H%2BU3SVf7HtPnHwzezDVvF7IgdMW72z4UAw5k7jGD5ZOuI6AB2sTydbvt9c4hNcMky8q9CGX6Hdg8KlPDDQ7MiIKggegyePWpjZMY6eouMv7gDrn%2BY6zn&X-Amz-Signature=a4dcf8022c7bf41a95aba60a6727c0fc68fbcd8c0d66366b64db86cf8fb81427&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VG7OURCE%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041316Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIHqzCmfoyBVznI2O5UgAC9iXadUAvWB2sYkBRscY4HfvAiEAkumf9AM34UrzMBmFcSLXsHTqMPQqwpme6vucTBpYYnsqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBbp%2Bet%2BDNqftjfgDSrcA4f%2BzURq%2BloFvcNJo7jeQ%2BgaUkOcXjjlpQxV2m%2BzE4DitsxNlwUSgWo%2BByY2J76VLnQeoc3crUXcnpx%2FDLzYLApW14XGtInmoNFaFvlkaoDD6OQL1G%2BV7sN%2FwMzhI3nGY9mqYyiQFjrpOi5WGjIHawcVyESTQM4Y5WUUvho%2FrA1y%2FW1if10KNW5xDRkHY9sZxGPnNslhkXRTpxMsrEM02JFIx3Qbsf8i%2BgpixSdAVmqejn80we1WOqX1lnEp9cdoPLYXY1p79zLw84nUrI11Fv93lxCCWJ5F5HfqRFa2ZGdABF2mkI8ZPr9uV7IV9X99JRkOHiGGDssbeNlPt25e7%2BOA81YMzON5YypvNa5I7%2FFkVLJWTSTdU72RDBVSRsKp3zSdxQdhq3vI2cVscnHASQ441rU6T7hwXJkS8I2qbxpoVdcl1RLLR6mv18g56RyIHThBM5v%2FaC3EnKFPQu0tWV7ri9AhWrAtg9NlF3xdDVahcv4%2BXRqn0kl9MqH3PbLFeVKzRk02aRdHDhCIBwfIClubKb5QAp8JbgjMAdTg7cEQgohbqTcjT2SOlsEkvkDJ%2FiK1rFwjoZ%2F1l4lPQ26l7VdaeOHTLsyBhSn4sWouQ5paw4c7ENkqjWvy5cGgMPzg%2F88GOqUB3GxDfm2sA6%2BkCcbnYwL%2BVYIx8YcOZJTxAVb9z0jPTmSHEtcAAAQnxulBYEgeQhvxXLdo3jrLsxaJFOKcG8vkcO8wNaBtw5T1RyPD9LatEVm1fK8Yr4fp5GGwnysTfyS5P8VUfimWYjKUtGW1ISiqCLl9A5QpeKyzxXIS5as5DtEi9rMCW18g9iIlOVDsuCR%2FnSXVS9ZRqnltaHpV1RK%2B6oVy1NS8&X-Amz-Signature=8bf45ece66cf5d5ae38f1362a969b6f3ca7e1a873806cde0703fa8fbcaaae724&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665QTGQRWT%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJIMEYCIQDDowQCnBLou2KQQE4mzHtojcjPZ4zrLIuMAWgvSoQVmQIhAKkDsN%2BdgcO4guoXVubfjso46EbyxnlGdpdk9gu5ZzsOKogECPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igytkc6aDfQZBALdASYq3AOmuVjqUKw5DYQXaCZak4KmtcSCIEvmUQrRK5A%2FmLqD%2FtAWAktz%2BDlH8FPVk3YWnOxF0T6BJ1tRI%2BW82RM12ITgOpEfTdMr1u0cHDFQFppzs3Rg401bYYDB%2F7sHV8tUYs%2FcBZ3bDljdAmYp6m32JoOZX419%2F8zhlByQ84ptdh1UhOGNRGsnStDgAhSJkUoEUKRei6qzyXi0gdKMnor1uTN298fL0e2Onh9%2FPcwwfAaw98P%2BkX3il%2Fk3WLhrE66rVPZjXqj%2BvpZl7s6bHR4bZzGP1rfHCFP0am%2B47KjVesKz9T4DM2NtkHRzjbSi5514i3q4iMTGCgT0O1Waa%2BPZ%2Bbgzj14SZrr8q9dvvLcOrkWPfhT5PCidhuOKBeX7FytoFykT8lg7NCmN0tr5EKWVliGHX8bKoqKWdbrhkgNbqHdaMnC0SZJkfsquYlEp%2FVfs8LrGPET6TX7woI11Fcx%2BPTM461eVSWPhVpm%2BzmEBvV7JZcVgAf1SosN5cKwh6TodXZxszuzzenU%2BOA8ea0Dd120QqmYBmGbI%2Byk7s%2BSq%2Bo4oYl21ABWGSitxOlx0GiSmIkO3hz93n3eAQsdmjqCG41AUqCTbJqPTwwn1bfdQzS%2BjNmMV5MPu0IZrXT6qoTDp3%2F%2FPBjqkAQXfsHVE%2Bq41trxQ18T9%2FZ9xIssyWHcsLJY95ygrUeqT8R3khymzyv9TrBWV7WzM1XQvVZdz0GdbX%2Fm1QbsWxkrSRtzux90g%2Fv6JyyFOwhPT3LcffuuImhAw0kzjYPQpSoknkRUMdWKbU%2BHS8Lht6u%2FODFNzbYLhPybHg6ssyQToZphG0E3aIPaemwp7kvdJQq39EE07s%2FQIGIqWCXWEk%2F8FuNSb&X-Amz-Signature=4fea9b1e77de0f48df7a09f8629f37a17565c6be4913dcc8557ab21bcec5554d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X26VFGIL%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIQDT86g61cBicvuI8%2FO8nIyTWSXIe1eVB%2FhWh7ybGK3sjwIgN35dOngc6SOu6GNAAvsDa7Oy%2B%2BVNnVGsF6D10mCKpxEqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIE8KMUdI%2B%2Bh7dUaECrcAzR7oneR%2FhX2K179gfLrgpH5aMJznrWXjiNNg2qqOpqT4vtvhD1JKZKbvT0RRnpWZlhjIhPy9mDBaO3jmrq7SdAwLkVTGNtT9Ly%2BtbdZSVeC5%2FX2awsoR40LS1BBm04fHakBWq0e%2FDNypktr3gxFYXCCdU64sPP4V%2Fm3Vp8DDjqCHWZ36P98oDVuRRJakF6wwRSl6mpnErpqB%2BsucIw0v7siEGA%2FCn6eBpBMcJc6EkRtwGCkDdkxDbuBcvBCiRk8e%2BiFiu3Yi0cA8SPnQUshVVZWWZ6D5Gv%2B0oZGsPLEUiVx5FJPrv7qYLlOY4mOchgRTWih2tq4XtTDVwt0DoqMFM%2F0HJD%2F2owmh71b6HEMdBcRh7ixzlQ1dbNhvkMxe9irs%2BeKCfZvyr0667WIlXFUOCfns4ZsFC%2FbjC2JPUj7XnOgl5yJqaem43FBa4DHhUxXOltSiqvM%2Bkhr1L5%2FLj567chEOuIL3VW2e%2BE3eQwy2t%2Fh2dpoiCpsvMNd6r%2F4yGMmHThFYhMtMEYK%2FF%2BFVdf0FKljYQRlISCB%2FzLz6e4YFcvwZWV8fYNdRoQIyV8N2MNnL4VoUFRHNu69DPcgLVBVU%2BOXneFNB3TRtR9v8M6sX2LxoTqHdjGnnaReIO2uMKzh%2F88GOqUBQQZNu1SmaqG7hKvQOvlVipEr6%2BRdCVjieaNQ5amWjQ6Vap1zV7O%2Bzsf0T%2BS0LfmuKv0OgO5EogivthlsV9EHQIcQ9qvp3Rn78KlYbO%2BSdgWeyUKV%2BqrGgtq5qKQmmYsAiF4jt7LUsSAFw%2F4T4OfNCZgu9joU5xoUysmkO%2BwU2r%2BXP6Nt0YJHCRt6iR9s1bqJYwwhnh%2FAlUGmWSrsU61v5T0oqc1%2B&X-Amz-Signature=c8371d12a432610cad97ec031681ec70dea1a252664d4626d8e9348d38e6b0e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UD2BF64%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJGMEQCIARas%2F5U0E7W8qJNfjs6dbH7hr7POUIqhree4P4FoqCqAiB6mO88rBg90vS%2BfPNalAbg13z%2B%2BDg3RHPDebNkfha%2BIiqIBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMyToa%2FiXDp3m4N7QIKtwD3jQOZIKaZeesPyDbxEjW2cpqH0fLGIYcHIWxIm1K0WhVIBQaRpQj4HLzooLUuS0qpEzrK2vRZ3a0HhqDjPNiiZGPakMlspgYxDrCETlfiGbbUvxLHiTi6BeTDsW6yN0LcrEChvgWrurJt3%2FMC37wfshhAWxdKRL0qKGCnhMROLd8IbVBr35uvhKOT72YN6f%2F1wplZJ87W2QdxljMhsGwA2iq7QyooOzDeY226B5PB2IUFGMZpq9S%2FkqwZuulj0753OAqLDkiBj73R2ZN4c7NmCuPZnIhFygI0tn3fcWjBbVJdVqRxpu83Kgq83o3xxlIG%2FRGh0inTphtrrpU3FIHFaTcJW4ccaY1dqtW2rZnqmbknJsilPhxjNDompkuVC%2BVcF26aKocOgg888VON67WVLJTDOeVqciZ2%2FU%2FIGg3q%2Bu3dYpS4550ISfmL1p3%2FRJLcTMClo2Gdd3zz8UHczPXgKc57tpPfxGG7WR7jGyoyooydJM36bAFeg6iAyQGNWo%2F1%2FkQBq6w9787nTZ%2FMVJ9aXK%2BowQ1fcyj7scGuuLVC4gOWVp2%2B9JA4Z6JDKnVEKwHxXMMWEuGPgUsz0aQw8yxRbKIoIV%2BhS50DU1r3MJQJZDvdhA5vXaoB9fBHdwwgN%2F%2FzwY6pgF%2B3mCLS18Axn%2FnV2%2Bk%2BBPTIH6CME9GTWpYLWpllvtDhoZe9bS43XrCzPIghUGFdl53SdmP90Ss6xZruoZQGPUeX%2FhHisTmeaph%2Ff3laiM375U8FSoHE7scOnB1WmytkJH7pO9bKVVtGtpx4F6RNEId6SSI672moZRFqkfhiGBwg1SoXGP2d1GEdKDp4I5rMidQUGNi1K1AcuJcvZQhKvZg7v17ExkX&X-Amz-Signature=8c2d39be2d4153dcd833605600fda9998f341455a3974729305b05b4bf2055cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W2PYBDHP%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041324Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIFnobN6lMr0KcoC3E3BSToEkQ8QHEDB0SE8pj94i4oRCAiEA6IiPTUoLD3WxWJCqgmZDkWi%2BNBlHUy%2F4TcYvL7gO1oMqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFzFf%2B15yCAKTbxHWSrcA4dofyHcAp%2BHh20OVn3mY7wba3Yu89uYD5xsJR0WdZlMiCmIkMTKK7gkoawYne1TFsMW3Nuq3cVlVPQf1i34hqY6A7YDVApMtHwMusTwuHiDzYtZ0R4JMV%2BzDP%2FLOhRb98jMDVnmNnGDW%2Fz8UBGHCU860dblJee1tTt9aSb31AD%2BhJgeud171q2BBiOjKFmvbzu8%2Bmu4I%2BI8aldExtTv1vDBrY687QCuziLZkfOuMCOvkEjA1SnxsmWzqeOnmG4Uw%2Fh1v4DBfwVHNYB%2FJfEdTQl5aBGwjtFok0Q0xxgDQ0v3cGkh0HpZ3vspmTdrPnCsEDknfjztwCOXq1u5TJg1w%2F24s3DCojZSBgJFbzpjtGKq9oZJhJ4IvCwuEsYJIqHX%2BxaKK%2B3vAFLWD5lD9BgPr8GymxlN62atsNX23RAhYkmVFfmNCdcs4kHUc%2F%2FpfFa8j8FCTjhoZbK7H00OD67Re9ZInVeFOCsLAtynUaOSg4FMTHznPYmI%2FHpSyYtI5jS%2BftcrWxDNRMcWMJv7z1zaUZ8UvZlrO1vt25eGCH4%2Fb6%2BrzZmtv8eAvY4MoXwq7ee8ZQIO50VJpWSue9RE05Q%2BWaECGIACZ00GG4cuciWWz9cwQsa2AaSCHZkqGPHoMJTh%2F88GOqUB9CJ%2FnqsNfEvHRhwbbzP3yhJnwH1c77yDo4oFtSLEttaCm3k4jlBcA0R99AmQrP9dkWBgiEPaq2Lpb6l2apeYlYurw%2B7zNOWSBc0YAK3iZhMespJ8Q%2FsbJuKfTK8g9hPguOyVuqCYTyf4DkZxDr8yIpJGhr0yNSD2y5JIMPzf2VP8gQe%2B9FPtOri%2Fg0GAibgb2IeS6QGMuOYe88rZMhzazHcQLXDx&X-Amz-Signature=e03c27b7c5d7244efc595d15ef6501c7fe7307fc0c342370b20041ee2d7f2639&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46677SHDMVS%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIDo4qw%2Bx4nTNIBapHlhnEq4%2BOT7At1LxaN1XB9Z%2BRrJiAiEAwHyHxacIlwrwBxhJoBMRgkooqkxDjRXYn8mq20hgDp0qiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKURJnNMSGa5nf5BtCrcA6r47FCwrnJ5bH1EW85X5dZRSERxONc6nq4de15bYt7i2D%2FoxOLRE7NQRN%2B3YytXEm9msTDFl07Bpd9mvs935%2FItDCHV37tO4Kk3ps2JxzFX0wnIDdrX5UzH4K6AefSzibW4iBDyDcBiM9qNFfzki15gRDn3C9RMXZHWQ%2BNOq9bTE3KEBZ0WfrUEn9t70ibn3dN6PXN3Gkq0CxO07xVjulohkrl6oVhGjQY33rnM9l2asKzMjbfB3FX2g9c%2BfMUtDqWdZA7P9nxdK%2FgjEUTSbtefw7WEIgl3g9JQTuGqy04Dz6jNzYTk3OlEjWN8KqKLorXMlESdXojaq4DohnTblZGx8vfR2GZA3WcJs9Tl16UBhdkVkRmAw611L6pdX9BuxTTq7xoaBEbSUyqjJYFLNr5jmLj8kX4VPfpxt%2FMlPu9nHe6cAkdo%2FWrwnuBSbekk3rgRibRl9%2FRHo10XanGSHmfKjovLoA8M%2F7zRI6DatWW4lq6cUs2CmdN43%2FKc8Lqb2bq20Oj9EYzM32fmrvQoUNdDMuG8IbZxgenhg5UK1k7aIN8LtenUt6JSuCzB4sudY0YbSdm%2FAPG6KfgK9j1n2F%2BLv2RfBASrGPicIQLmVulPbAW5FgDtxomSEvORMPXh%2F88GOqUBeVbxMCnCaNmo0YnBweSI%2FtZkkHGs0l2WISHsk6UU0WHl%2FipoVyDMaW%2FV3GsOA%2BFUdSaht4zxDI18Jc58WgPJ7ZKPtU2G8ElcJPdWF4SCZPFhrsQnsRIoUc%2BSMVVxfEwMRBKuerwWvA7r1HlkslgH%2BSt7xIcw8fT1Gdnoe987iuTv7Pg7ufw7haOKuCCJqgpLyRntR2o3KwoE6ejBerSo0W7RJ3uY&X-Amz-Signature=39d09a3c563cf5f97e4ed40b0a4ba4b7b76190f41efe0695b1f535e0454e3a72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QKPYI6KL%2F20260510%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260510T041328Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaCXVzLXdlc3QtMiJHMEUCIATH7IWzd5HGb0NY%2FBdyZu7p0tyznz0iCuz0Cf7MdoAhAiEAh7yWlCL1ULt4Yc5KrLd5WwdtlnjUopjKwFaH9KZgwIEqiAQI9P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDATPgn8WzFarrektBSrcA5fhIlH9FF5Jdz7LdboA%2BR7bhjl81Q6qL0QrWEgSY0NSxZkC37nzv4AGtQrvPEW4QNzMocg%2BMnp2TndcQwiDwetgfKTmsDySyGhu07xseR1Ma2c%2F1dKWSak%2BZEFT9IFrurn0nxrX8oNPpIGHwTaEXqChUvTIFJtIw1sC7fKGDk39oO7lXqirVcYKqRcS6xJ2p%2FsYmzjunAphRNIp%2FzTfiM2om5GVUHqUiSi3k43LK6bVx0DLa9w8qiH30omB7JVyGkw4OzLr8qoVlinAA4sGkP8JI%2BEwvOr66%2FVCUrUKPTrn4wn26T%2FgIsEaH69oQ5LdCKciWxB4GvGDUGtKOdQmfT%2Bi6JN7tUXCrUAQHmhkOSVsOxGDiZxiY%2Bo7yd4gnIQhtBUArB%2BhAPj%2BmoPRuFDil2oF6RxEDU9YTXw3wD5l3aUoF0aYfV1gH9Fl6RAOeXvtvHVgd6XswH5asGIZsOCxvc5CkpFqqt7fjZvIIssBgAB%2FwdhJS6P2gfZz%2FvMZGvSf4hm1yet7NQrpxmeXAQM2%2F4qoVYgOnqHm6f%2BqFxYKMAqebrjUaYjWb8HSVDBzxVRlXv02Z%2B%2FGD4chaDR1OMoEYdjFcEA082GJLsQkUAUx06911Yj9XhOrmyMMECtEMLnf%2F88GOqUBAY41ZSjqRGCOiSAOBFvGeUSjjcKFI59LUJ6ET1EfVjg24Q8W4%2BfiWyaSG6S0%2FV8%2BLc%2BeWON5iaMW7WPLGfdpSZN165fkOvlsmEWuz3slEtx%2B2sWFFbbjA8qo%2BfXOvQXqF%2BwP0DiWzjcXnWQk%2BibheE5Nvf%2BENxG8%2BZ7gj%2BungaeFAtHoLK5IEfCebs2708P7RuCAYLGQUG7Xmd53jVc4EccPd7kP&X-Amz-Signature=9abdd92cfae886781583b8990b027dc648ae833f07e4f3d4f894148b038256eb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

