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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZE75OB43%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043433Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIHLHfvExVDCAPVtr1E73grN9AvwPTgobB0UGnP12gT%2B0AiBa9fKVrxmXxVDWfVki9vuPZPtFu6NqDyXd9koCy47Rdyr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMGVyNXwGF47KxN0wnKtwDzWs4tTP%2FfkO4GmxLVKoAHwfEVb4GUyLV%2BzzL%2FzTKfcU3vTAB%2BqYOrpqz3rllwqU5hlr0NnZzbtzz6OUQLGy7CzkdJE%2FHfJqaxjbojnmZwJT4ktmYMzWVb2yA%2BtYg0QXMCwZPc9nQe5LFR1WpN8DuPcZpapEp5ikPqBOJL5uzi70zPeJwQ529owl1kf6wO8CrKBzbDJ3d1rId0czK3wy2UXedMQqEsMs0S1Ex3UuCz0i1h8yX8zA99NKjKohpdBFRp0yBIFXLfuyJ9sDvlWmE1KMg3ZVOAv5qTWzH67VbwTCYoACeQj3%2FDhGJMHx4gaIRjJ%2BYR6pUakG%2FOETAHhW8N2JLKLyI7Bac0MryO418txUchv6zA2%2BRlbpFNWWMfLsuD7EwAlKvsYYUwXS9tN%2F46aStq3j6H1S7ifJy6R3HswTHaSFAY3Qy4M9id%2BjcQW%2BzT4t9Jl29sDaBSdq7E4x4Bj3%2FbBfCx%2F4cTo2rIO1sdGl3SAQTG%2FHqUGdGxpaSycLvF1zOtXbdSXrUaFDW4ni%2FBBceywk3mvN6oQoAVJCERVfK8SoDAtv8OCfq9Muyom%2FMrc5NEl5sJl%2Buc8XXvRge7HfRegej78BH0l6ululFeISn%2F%2F7mGRUw%2B548Erkw07WF0AY6pgHrR8Qh0G%2F5vEXtvQy1FvFuGodgdDNRGrV%2Fse%2BiQVqKoTOxUme9Z2KN6wuA0c3ugv1o2mPPZfSY4OfOIaxWjo6gc7a0VZCnG1MDGrq0GmgNYbo20rAD5dqxNARWkJp61dAa677z5cZQqXxkomo3C%2BNGSGjOyvf3u%2B7GNsN723ACTz0AATE%2BZ%2BgnwrXY9eVR105M1C77HqZ0CrDOy%2BWluo2ThMnpSXwI&X-Amz-Signature=bc4fa13bddc9a74b3bffc9120fbde3460a4b392b20d33ccc69a1e66a63eb7059&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z5U2NIQW%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043439Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQCHuEAiCcQkYirALyytzqXYu7jAfobBKp5wemOszjR5ngIhALDizskwzQtFL4KXoPRhifMBtvR9bBI64SEDxfiDjRmEKv8DCA4QABoMNjM3NDIzMTgzODA1IgzN2l7Ay9IJpG0LtfIq3AMLO%2Bw0BF%2BjKtovl4oVzk7g3bjn%2FC%2FMwqi1QoMzL9ijaEUNd%2FXejCUNXcCH1jdSgPjjPeobb5C11nci9BjRHiGO0GV%2BS8S61n5lIPOE%2F7Ud3UQg5aezxEbEp0lZEtQll4akrUVdMD65Qv3%2BocSm2ETqPpCdtyf40l%2FkSGLD4xV9qUXSiaZ2kU3UNkb9XJayxoEL%2FANqcyfeZZx4k0oXxHV01KEKhETkAU7NRT5pMCu538DnYchsTDN7sqBppl5ukaE9ldv1ZBntyr8Ef4xaxyrPqNx7fCdFW%2BEpjLungbH5NIwET9mjspMHndKL0pcnqYaXZhUeJPcEEmsYUS1YN5zonhRI2qv0qjTIlVMhvBrZcI8pzssbfLZ4SJ6SXgCZOH15SPwK3kKGBmrDBt6kFaMVwUHz16pMko6G4uTl5XIqIPT9PNehdOz9UuLv9TrsfX9FQAu0UZEZn1yPzIUwG8hVh4bAfpcceEcNjg9zMzIJFGqprDPrJPcr9RFcfjwhBAG3vQyjU9%2BzKURUGl3tSP5vyBSmdzqsrDpcYkBvatTDtMG6Zmos804fCrAjOhXXnubIOjwhvnPQdTshiOLm%2FkaiPWSNfAaDJJb38Ox5wmt3XN%2FRREHHu4IQYdLDYzDutoXQBjqkAbE86AV0HuOc4hgGWBnCLCb8RbAk%2FWu7s5tvwhYQ2Ph6M5izzPyo5Xatt1MFEThwHeIIogiYe6ul4JygYY0RKZZewO7dHwcqz%2BBuqaHaIAozulS5QnpOF0YqjI%2F5Wm0%2F2mEDSqq2AT4VRZUkCKR%2FLsXB5GHDQLd%2FqXVwOL9jchkPiT0Y7qmku5XcFBDhqcLH7odBjyT%2ByIziviw%2BMS1MduUdM5Kq&X-Amz-Signature=444d0385a8ce5f916563fd91d359518ea30549b546f67fb842e9ffa132ef0cc2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPRI4C6L%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043441Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDi59A53V6PpKjJsePazuYUJcwK20kjihmP9BFXIp8a1QIhALJPqiLe1D8CM%2FlWli%2BrTKktWnKdV5OfjcAm6wlHo%2FM5Kv8DCA4QABoMNjM3NDIzMTgzODA1IgyMwVV17i7A3RZK0eYq3APO%2F7OjlP4EqcDVO4Zq0C3HpdDAgnJnqlv9tJEH7kyio3HOSOX6GfLmfijC%2BzPtSTKYjPin4w33AiDu6UyI4PjcXMWMC9yM9XVP1Vp%2B4MK6lQPeFuBOf1pw7hl%2FWoe0GGdsU9%2F5Vd6PaVyzMe%2BfsItwyQPCAvH84S0GYKUVz%2B3RVmrBfgXGiN5fKMalgo99FffIJ9jhxsUGEw3J9FrTc9egD1WU6vzk%2F9aB7N2T6CqzZF1JR73l5NkN9OJ6eD6HHv9LAmiasRqGMElVgKcDAmHYAtzpKI6rvWm85lLzoXI7Xnos%2Bawr6xDJdPhBvO%2BVRkO2CdFqUSuJYX9rnnWMV3hN2K5le0ICgOBwgKazHktJFFyfCsM7I3LwRIyUtKHEPJCCilMW%2BaQrWISNVsG5Jemhn6XdJqRX6DEmYwlrt09ngtmCEy8rflAKTH4IewRla0kvc2UMpPVvl6GipenDay7ITaX5fS%2BBJ5p5yvJDLo%2Fn9eC4mR3aWMxEDK3kltn1%2BTtj0vUkrKq0xdCarYtXUUHfZC4C2CvsbXSZICQmEkPZzLMJewn%2FAkeHeINmVcURdnObzB2ZTnn1JhmCfamMEUAa5BG%2Fxl4Y%2Fmf5N%2BieVcHid8NXN0h6%2BVqrUyEU8DDYtYXQBjqkAVt8aLjSlHqC5PYSGS5wFuTJJ6CZF5g9QiV0C9VA1FMUgnDm3v6ETnyjcSHgpczn6%2FdQ4X%2FKKWGUJsZ2HP%2FzGLbvDTi6w3jqhh%2Bsdpx7h70yFEbP4ICS7k98un0FDkaKwjskSZw1rzonbfppiV71sPwkVF6GnctkX3Rexb6CHi0Ej%2FViw70t41LWOWeWjCYKVgpuJrvSmgMSSV2JIroP8J8BpDKz&X-Amz-Signature=b1c6424210d8e089307c9d87c62fe3bac298fdb91b8fd2f02132a24e1ef3ff2d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663M2WI5PV%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQCwqpqZwByM%2BJIpF1P6UXmE2H45vVM8HEBpGXKXP05zYgIhAJpt8weih9%2FWfJkf3X7z7ex3blmDYUln2O1sCxGRhtggKv8DCA4QABoMNjM3NDIzMTgzODA1IgxBjkgNHNoehK51D4Eq3ANFHsBlKaCkn5do5pUHNZUdJ5klQksHYMvNdILo%2FriI0HHRu6qo9sKxRfkj1guSh81c16cB4veBRXF%2FRMnuWA%2B8rrQjRLeIBpn145rk8IQY25sCyMA%2BA5hi%2BclyrFqP04ViZiD8MUjvtKuZTacCEgJht3uCe6K9jbNA8Q6Scc9fjrRjqlh%2BFHALtq0irYckrD4yEefeUMRzI5pT0LOqwfUb2bbz6kX8fAAGZrh48zSaST8Fl7Ep5oqglwyWtlS7do%2FqFTL1HKl0fZq%2BpBefrHpOab9%2BXbbIdXPFpe1gM5v7%2BiE%2BN%2FCh5qKrB54iP3EBHF0HlieHXXJ87FVqO6Ne%2BTlZC29rpYh%2F%2Fqg9gyF0wnaRjqmfgGdj2VxJIfKwd5zMcCDLhqLpzpWMG0uww3h73q0ycvAKF5xNy5KML%2BICEKxc9B4cDflQ66lrntDvV%2F5Kxon8eHsIki%2Fa3BawQRO8W1HjfIQSxeNEPPr6WFGeUs8OhhjDHN6NR2gBXTLAYsQ9naK1EUxBP7IECiIHwuy6clKQy%2BuRElZF7lrlUznHrW7aMwKOguCzykMdg3MW%2FgzVj4fxihJ%2BbZGQaPzBK%2BUEHF9T%2Fg90mhuuwb3HWrofIJn4IpmtGjrJWN55VTlaPzC1tYXQBjqkATnyGOza%2BKFdVvULhjTcraEOOoMfDkfqd%2FRzQob4%2BwRuNmHqv9WT%2BtBsAYyN4kJ6SJc09H54yZw28tgt63e4w4LjBbm%2FwPHBuMbzPV%2BGZmBZg36w1IEt2z%2BotlkJmx81uAU4C9r8QOdUaeMdqnob71q4PHsJYCX3sYEzw%2F8HpZx%2F0Yjgegx7lP%2FLr3mhjIWH%2BpTd%2F1CLwzKOoUiMLdBDDpIBSJDd&X-Amz-Signature=50142e9fa5289e5aed0c728959c53d03dfada13de6c814153d9ae9a7977ca1b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662P6GFMPR%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIDLe8wAC4HEqrG%2FrarD30YPE0Dt1IlVVehxpuNIvPRpmAiBS%2FIPilxjB3W2N8wan9mFoS4bs4C9Ah5%2FxxZa1MmO61yr%2FAwgNEAAaDDYzNzQyMzE4MzgwNSIMVPrMPOQqsXqrsqJDKtwDHtx21OWuZWj%2Fv%2FwudmQBhGeZL7PfzbUwHc7LXbmOHIolgcVJL24HtO92y5hfQ%2FKSBR3hxIplCnnYpO4KPWR5pFpD7uZguatFqOGCFMWT7VZmOQTAGaa%2FAgzQuTzfyWWsK8QP73%2Bb%2BdR1ztXFT2AW9vRrukihCzTjIujdTUjwpMItJJN4DlRw%2BJbM56vNBidxOtg7meSCzXmOd6fmp3QzhCCnUwA%2B4y0V8UHH5hZ6zD1BgFeNzqDtGaHgHums2Hg%2FKE%2Bom8THa0Lx%2F75WxpzDq9Zpe92MBOEdhrHIU%2BETgdIdl7O1jPEneHClB%2BNYN6jRWhSRqM9LcjlAydTpL6p8CAG%2BxnBB%2F8JEfntDd6V5Gw%2BZb5tAq%2BjYV4bcjz73HejFxZRDz6aA8Ki4iOqdWcajji0Tav8A41antiaXVwQ9YCzYk%2FltpOczxCz9rhIBMMe312xmngkobw%2FMp1zC%2FlQTUu0nPx0XcDNR0UMpzk6YH4q9%2Biis1ah2bMvHZktLnlbINvn%2BQI3VO8tmfCZXvFDBC8D6kWdid4Co9dKRZy2gLo0z%2FVbiUAdLsjeJZVXkHWYei4fcVtSfeqfamRtGecCpERf2rpDG5jr20JzzQ8cNEtJtAEuvzSdgiV9YTuYwprWF0AY6pgFcs7p6weG1KKQAT9l%2B8gVJBLGlkIWimOd2SuCpMR%2BS1GUD4qBUY3aQZ8XsTYp%2F6uXebuXpe2GvqbNA9RZaYSODsk%2FEaM6%2F%2FmQSP0ixFRWvlEQURHW3duwG73MUxbCcBNYI1jQCMT2VQkkoysEDDIplBCbsqW3Gvhrb5TCuFLnTKrIs6jM2zUGrAHE5%2BrPocrbu%2Fhn88nArsyjH3%2BERN%2F%2FkNPWufKTS&X-Amz-Signature=24e6ad375488a047b1bc8fbce1b6a061105496f7f7495dab83caf18d1baaa34c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666HV5MVOY%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043446Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIBXu97r7mMYWCCjmkkBnvpPKlEMs%2BB6WHp2FpjIrpjOPAiBOcZzsw6WbfG7tLVvE5VL65UJegfDQYS01bfzGlR3sLCr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMTTbpUcthnuhCcy0bKtwDpI%2F0g3i%2FHjaxFkfLzPsMuH1bnztWT1hJ4k%2BZ5EM1p7AQLgKwqI0q71S%2Fy8g1HHGkJWruEEyYw3GTdGnk6GLXyqoFTOq5xvKBfjqUcyG5kogisLyNWAxRUmzeRvs4yNH%2BQh%2Fbt7JRKRIz6pjKz0AeCgMlBYDphZQLl68H3nvARFX9OHciekKiuvYXU1BhG6g7Ouhc5HVHswEdMqCD3t%2F9VwMflSMbqVfTLeTRp1cPUj9sU5KdXuAk0wSv1VUyJCF3HOjXfkm%2FoEIgJ%2F62NxAC72HoniYJsxlSW77D%2F3NLcY04LXiGd6NeWSvMxMRmEEludoTa8Y2zraXzcdmsuDyud4xjgToW4o%2FUj5gLctCkbMqHdMQtsG5MItamR4O16FYhnStmWK2i5yxsdD%2FFAJ10yacFDn%2BpdDTYsy2GYJkdAPB7Ow6w3KuiUYl8W2Mv9ECRNGoFO0SysEimSXPOemScveRkDu%2F4JcJyfuXy0OeXUaqxtk%2BIfmPp%2BtGYo%2BUl2TkwE4MD39I462ndZnuoJdZFMBUS6qsPiX9O2QIt%2BVYC6KEPI5hpIhOm9i9NLYAfw%2F9Ju3nUtB8S5PkBX6hJLqNnyr5VPSKVD9gMEO4pqmKNywN3RqhJ%2BqEfUE1U8m8w4baF0AY6pgGhPOCgSOdtdeXJcnoZJwewHgNdCCoSC%2BItAPsouJFIXVQSc4vk043MHKiVSakY%2BxyEMB9mJOF8HxvDBmBfYRJ2%2Fkv%2F5FjMDkFTOwp58F61%2BlbcaHwISZ1bPusdVp7u90Z4yfIiaJVMQ0dp0OcTowH%2BkRCITVGZOkAOdKsGou5JkM6Hv%2BTAMyyHoTBI6xWVv5jE5HNdnl29p4rL6dNMd%2BmIjK4oOQCZ&X-Amz-Signature=8f0a9712522a2a2071d2a4aa97fb0f966d49088336fcf6a1c4c63e3447085870&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UE4XDWMG%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJHMEUCIQCqfsjX4h7zLyxL50QNqUu%2FmIfKYdSQhCtHHV10OzTCKAIgEbA%2F00yS0GKcgcfZCVVM6bv9uzWEvwMGGNkSFg6ct3kq%2FwMIDhAAGgw2Mzc0MjMxODM4MDUiDD8nc7jaHgST1eARgircA3VDbh2G7HbWhussVzyAa10XZF1j8pZGU80hnpqhH2PDDrZ1LOMf0ZprWTaP%2FTQzirDN%2Bi6ljhbQO8zI1EZlzT2jwMozsCqupUxlQbV%2B881VDm6Iz8%2F55wceHnb2ejuOt8EgS7egB5b%2F%2F%2Basuor9X2%2F2TVQe1b%2FgAR434iMnudhWJK1p4owspL3tTRNIs376u7Ov%2BHF28NpfDRAHRG0UKR3693IKV4UTj5aif1FpTtAXlYcrA3geSNYnF%2F9QO8ue8bJzqpRl9hrhce8GR%2BCkPaapQ6jKiUmzZBYWBV3lJgw0Po6iyas%2FtwS3D57KmJ%2Fu1EpVDK7GXGwR9a5N01A6RNTduOfgoRwevgXam1iw%2B3IC4FTYKyiQ6xIF5K5fw6IQ0jSAOOGMX5pybC5w4VoleAi6E5s9ZC2FwWH8cSkqPbZ2gRRXpR8x%2FpdN9ScFdPJ1XElAxmj9LJdutjfaXQ%2FS3hpEcesPKYn9yCulGE2EYr3OqBJvkkvVQwDwhLKl8sA6Vncx1OXmqASRR4zr%2FUQX7xL3B9XWEs%2FQPpk%2FlP%2FgcKyX1F4W3D%2FdChZWl%2Ff8dCvPkaLE3pIoJ99LzMlXhP27udbLIT%2BSgzglqDvzZkliQnAE%2BHUR5PoYYulC0XqxMO%2B2hdAGOqUBL7kfVfCWjXE%2ByoTY4EP44TvSwjkCGLfDw9nxeUbLnxZUMUYFMA7pG8j9A1xItMTDiOQcNEIqOVoZ50136Uz9vEVs8DUQxuDlnF%2F0fzqginomgttqxxFG%2BpxDUnK%2BbmnDx%2B3Wqeht1R2ItXSbvQCBlynjcN7QDstEfTFOmoGE9HsC9730bcBmCHRP2ZSegHp45UEKHf6XeB5AageHxjCco9RJ1kqa&X-Amz-Signature=e0a1a92f3a9b32b105d31e15c6b077dc3fb2c2f42ecf41ee48995258542fb76e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JM2YFAZ%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043447Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJIMEYCIQDZb%2BJh%2BBaRlXZM1w58r8zY02NrM7qdloet6nZc7mdVVQIhAKS3pjcpSCbsfY%2FjmqDYDRiazggmLQKniDEpxWmQZAjiKv8DCA4QABoMNjM3NDIzMTgzODA1IgxLgNuZLvbi9LqLlTMq3ANmr2ZrF2nqp%2FybZSnOLb5%2BOWG2D%2Fww9PHzPtDULK0kzSzRCgw9ZffEK5OLjP2y4UlwWjWOXBR%2Ff1TLyF9GcWZPpuwHlsfWnrai33PI65BoF07QDy4HWRYMrOYSq8y4J8Gc449rc%2B2mQhikRpiDJpjjp9O8qiF3e8ciXbj9pjnsClsLhjDc5Ret3Vfx0pkWjxlkpywn9ft15T6pdVNRTqXEBcDiYLvC%2F9ulrwi%2Bajx1OtZBbLdJb2hSdLJPI3kHgjh50K7APOtAU9UXRaP6iKISg9XyRogewL7kD%2BBJBW8k1EKw65uuCp31QF7erOGVzhCTEQfgxcekX7KiQvupfKfW23JjESShwSx0ubs8Kn%2FRsnCr4k2jhHdE%2F0oRSm0YsMGF97oSn6Gg5GPxI1yunvwCauTsI0EkPzbEUjoqYUnLrYVe1N1A4tDGeLDG8u39rfRwl2rVn2OCTUBCPrVgesFcBmAxSINjqrVTJHrkyhOf62G8di8PcT02GqHHKDXR7DkxOXfD6%2FD0NgTeN3djmPj3SJf0bEERFXrW3wImjfuBXV04KD1XaV8rr8ieA8kO3XsyEV%2FPPWWdwX7LhqfubWjS6%2B%2BuRYm3cA3QKkEV96IMpbWIaM764G%2FKUKHF9DDZtoXQBjqkAca2jHl3xk1IoF16q1yZJlGeTM651AMCyuq3K2I5UYNgE2dsHN6JSeMjde7FWxlPXtc0RTn%2B4MU9Txigi26Yn6CE4bHw4eILiDqN98IeW5wQ77NZhYe5KRQYIUdQHeciibrZG1cMefrZc9ICdQhkXowIl%2FyJz%2BsezCx1jdKt6ZSvYMSQamEVDO%2BaPirJ4yAGcwewlcfq77%2FM3lgihb1DOhKu%2FXNw&X-Amz-Signature=91f3eaba9500641f2595f94551f85f3131a9a1ccd2c9f351c2105bfcba7920b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WD4PDZXR%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043448Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIAhZivmXzEESetnp5cs2EtyYGoHeKeBAEyHgqB7XZbUmAiB89X9HbGfHF42qJ3tL1bllZc6AbLqM6RCNyNsnUhbCzir%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMJRk2uJnEEYupX4fJKtwDwdYQWD%2FQwcOBl8G0J%2B2ROmyPwcjSYyxrjuBJCt%2B7GKSZjVPfTNtaIhwMLGT1ZY%2F51LR5Hp4ombtHLQnTejpXN4PVIfFZ8JHYXIOE%2FOGH1p2O5C2qZi%2BZhxveTRlm7g4r4TG2%2FFlBcmilmEK676pBmjMbcB8FPc6l0DbGqsAVHzqQ2apB7aqCPQYYPuGzRdR9CTd58KV5w09OmZQR3ZZKglpVnCThK1tuv0rZJuVQKJa6%2FFEYKTJQ1hyi2saAAad6m3pwMYfJjlKfJHolu1baW8r5W3zL%2FK2Y7o5%2B%2BYqdexwzdQ4K%2ByyOPzaF3fDI1boFhGNZhhBoPSnTndQYZhM3yrKwgC%2BiXt1jMDy2J0uaOXYEq2ZTikD7txCCvppTJbFOaHbLTs%2BKoXzIxrl%2BxUe4%2Bnl4fIhO%2BHTFOTIv4kS%2FHE8%2BvIbbpROOA2VKqInn%2FMOujWcDr9MKFThqOUeQzro3FVBt4qN4JlFj9xqnbX3WaOyHP7jjvdsxY9BJbolbEM6grp%2Ba7GDk9wffu5ac41Vfj0TdvjRBjLpGQbAYp14u73Rxqr2%2BsQLS3PHLhq1JfCOiLSKb9GuzevNMoCTiikcyzlCZL0D6Bo4I6eXCTqZrGWccU7Stoq%2FblnYOJJQwzLaF0AY6pgEG%2Ffupr777Ftq4zMyIFk1QI9ws8p2uuw3NY5Y010oV2yjnwOJf9AC%2FHdpVfxbeoH1CSA04zUiYDLWzCOh1dqNRrYQY2pULo7c4iHZOP8Me38ltSC0G431gSF8O0NoMajKqiFLyYWKjkHTXw7dfwj6aEq47b%2F3VdNmhqD%2FVyIC6sRLm5Y99NtBpEKQiPsBKYbqLXJmsgo%2F%2FBqv7DFuUCbHdvMxynMbq&X-Amz-Signature=f4b290feadef8a12598f7d9f9e48ee66ef18c6f61c226a38987ef0ed8219bf33&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667W3ZLDNO%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043448Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCICoooMTyxLrB6j5k%2BVDoTS87mg8WCFq9DtY7O2xICGdPAiAA0F6p1XdDlcDcnFiRxLCQE5OaXiuIGb6TlhjQ86SLQCr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMG7p5GsHYrvb97%2B8PKtwDwJjC3JWV7n598HblJI5n%2BIoNAbkLMQZL7Uz40ROIIqhKWr2RUPbHp%2BFZttLpM47IF%2BZYt3PWutTsQjVGSS7iQUQpnN3h1jSjLUN4Vrrbu8TiSJlh1M0yAjaaiH%2FAnMA9WZpUc0AtSYDlq1DSURjBxlEYupegwHHquY2t7g%2BI1s86U5BUcN3rQWYM3YAj3klkrdPruQmnBcyDXU%2BRVzyANCDkKhiY4vONhkYJbXYHVGjVC0eYeIlOCqskgJDWcWeg4SHp03ELzsBsukkY2VwtJKJ%2F4mE5nbzOZHlbLPv7cuW1DxMlvVR%2B%2FZa%2BP2fnctYHai2yUiieHAlGx3T8na%2FYHPczQIb80BzdiAsCyrU7kFlk7ig%2Foe5zoze0SqLZjNnfDiQsHw2F0Bv35PqujNcG2lJ6dOksGnc98qKQezyY1lgKy88reQtgrpMztLPHy%2Bpjqc4f0ZhBkgitsAqt1VPdIvt%2FQPDVZAiAy%2FeE3RxVKzBk7BErUDsIHmXLsRSaw8S1ODjx6DMtL7mR%2FKD3eRPNIAdCbTEZfkANAMhVkaR6%2FSbNLQqAxoQQsUslz7WtaAKK%2B2XmHuqT8UsSKk4k1tVvfk8sJouIZvrY%2Fmrf5e4JH9psCWzKx8KH9CqG6KIwxbWF0AY6pgHyRmSbL9hkt8S7E66We9dwIJcAepZ5nY7PVNQWszXpmA%2F3k80vFhOgp0lBqTqQFvHucy3TmZMcZKONjOaejq5Pgj6SHSA14qKPtHutqM0lrAOdyA1Say8gnpcqqgHWiO%2BPSQrp9YiYy7rpDgt4BskJHzEkKCg9qMzcyDI05BrIgOQNKAaw0fjnesXmAuld0VdYgGQoeLvxs3Qh9rz9M0OMAQ16i4cE&X-Amz-Signature=acf553d94529f60f47f2f16ffab5e5fd93b89130483889b0c093ef39a9375e46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZJWHWKUI%2F20260511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260511T043448Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEUaCXVzLXdlc3QtMiJGMEQCIAFT949c4TmP8MCnfYtZvfK%2BheO0ybmp6dzW4TeO05q3AiBS7xhFwxql5%2F3gRQy6w7TBgrzq4FFHbHOanXmZE8W%2Bqyr%2FAwgOEAAaDDYzNzQyMzE4MzgwNSIMdPfESAfZi4ZxxkReKtwDxWH1DJNOUJIoaca8ph09siFh8KcN1w5MjNSIYkE%2Bk2jfjrArsXNhoNQu4LvHNAOOeM9KgvPV6huCu0KtzGnP5TMZY3oc%2FmfPLfXXcXinyzpOtR3O1KKvFzwxuuSoI33fpgA8tIw%2BYKhgZH8gHz0P61kez1mLKChcgmBJOLltCnoOrjMzNekIkSBKpWd5yCXfiFEpKLdDHplayDddkZUO6ZRM%2BKqzPMLi6k2gDKSEW0wp9QZAQFhfXIS1NrqcOecwYUg5MLdy9cvy5QJAQ7O%2F0SdiP3YKPHygdllv1Tiu3zy9E2M6FxmlEpGyxU3EJekeCCIQbBXxV%2Bf6qWqBv2kGayLLgoYBAknOEfDDUzDwXz6YEAYbXq1MHvHCCJdkfZJ8kOYp%2BvU05AbDP%2Bd5coV0JaCz5w7tg2rd73gaoRsglWzjCFcZlMLIR2wnaulkBz%2BHqhKdbx9PUFe0jod%2BzojteC7387TDdLTfqzLyHo81unSmfP9ZSzhgky4lbeCmAVhMnmiz%2BxPakMs1%2F9I8wexK0POnzjJrtE0ly2yPVFyLp9rD5XqZ6wDGtfaSRvHkjXE%2BVCOB7FTrJ%2B155xrgoBtwVLPyyf7LLN7LdlIgdFmm0uwSAIrraSFo3rj92yEwjraF0AY6pgFgo3ZAFmYfbhlIhsgH7qVt9nw78pSElmhSCrud8EXV2srDsW8qGUdLJ726xusROdGA3Pz5SQfZUvvewmC09J31RgFIWnXHCltARiEUbBkwA%2BMaJDUgCqSYlzAaMFlwZxNWiUppoIDl2q5ydvH%2BTEEXEtylH9WIAKcBCZVe8QzRSBHtlpFgu3pVA0fQFh4zJL5zFgwHriGDQSsguOZCgnnh34tRdzn0&X-Amz-Signature=dc5b13ba7b475893abede48719c27bfe64760bcd1a5c7a3b8c4222405f352e44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

