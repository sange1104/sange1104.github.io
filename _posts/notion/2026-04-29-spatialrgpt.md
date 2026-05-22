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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UKELGSNO%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043415Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJIMEYCIQCkwLhQZ3jB0eeXdqRwY0uLmIO%2BkaKjeh%2BsFAc42Muz1wIhAN203GTruMs3e%2FX%2FWBI2gpGkLiMVTlWm5D881JdSoOlEKv8DCBUQABoMNjM3NDIzMTgzODA1IgzAM1nl9EV%2BFpRYpC4q3AMqcj6%2FNDk9wtLMKqciPk3Jhg2q1wuJKCSSYZHAB22xu%2FqiJdPtyyhghH9OqD71wwaXOYgXXy2oDDmCFSgk7IckDjCUsRppR6wX5cH4vdFyfDQjFzqs6%2B7ibGy4bjL%2BySlD3e5pkC3OS4iNqYjYFlH9DEDiB3tZ5IVfbxk%2FUKd2SrbIf30SSm9gUO6r2o0Fu3zI9Y70UQjlNmfRPFhzEDlLd0wZ9aL8Ew8XJV6JhMpFhc3kYyQ%2FSTdOq4f66U77itgjRONj0x6g5xqI%2FxozG1jpGvZyC3MQ7nxkavjQFJs1bzGUI7Xk7TwXxP6cfSb20MRzhLQxowZgrvK9cGlNuFQVzoUo5Pk%2BYD92Bm3VBsPH8RqzIlijU1DW%2FdHAChRGkwE0ONDol7qMlhHjLh0l74E9YbcxBT5xrsQn3apnDvV8vYSuKRW78rUY8DncdBLgj6GAVTJSpHNkj0NwqvNoId89uLesoWIAx8dcwl7l6TZ4jZ6gVSvbUT1Wh9Oie2u6X90HSsITc8mKAjr9ea1wAj7KQhc%2BOwL9MiqojhkmhIDyPVnvxyHN%2BlvHWJehDrBPNSRdHc8mdUmco4BzddAjA5YpgtAsdSRClUTdt9Pd0TI6UMqv1SHQliYxFOEI0zDxsb%2FQBjqkAUYekL%2FcljzjRmLRuwcUJOHDJq6QknZ1McF%2FR4za08mc3C0mQ9ApBqDqLLZI4gMdvInDH9uWmzcOGD1J1ObMJN1UJqdnFMHhjFYO5yC8iXgKB7fBJ7DBEu4jvMfpO2kC77DPSkAbns6pfREz%2FK0b9EWMH0TgOuCy5fZ4ZQbx5KskQJs2mrvZRCU%2F1N1YIh7JGSjnHn%2FufGOjB5bPTHdOcja7af2e&X-Amz-Signature=d7b5ab499056ce8112c81a1a575d2c89a9efe795e787b5d511dcc877ec82456d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZABBRZPN%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043418Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCICfA0hn7dX%2BX3Ui1ftUA8T8ZNvzjX36bPjSqVyGpPma2AiB1iGlpR8h%2FXjAKmHgoVP7UJf%2BaKe751kI6NtAV1hlo5yr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMfter1catgRzJPVyQKtwDRcRSpuWiXmYM17%2FChcX32Z%2BPidsDjYPrgLEbGQ9n7iGSROae%2BZU%2Fs9h3RmwUyVtjxjFT52EEckLuee19leVce7qx%2FdV4Fx9oU3G%2BcAD2VeL1prUHbkJx0Muse0EtDe%2BiVduBk0bdP5g%2Bjeex4lzDIJBEXnisjjLLJoTRb0NulBEPMkKkuLmGYtVOKPajRaCmvoeOgSt1kT820IL7WzTCUKd9euFSVM%2BlbmNvgu4n9tUYZFc3lvNo13%2BDx6cYOcq%2FCOXshm9WHr5hbQ17uPF8mjEf6pQ7zm3vHQnXguQeMlD8IHgejuZR9BalCLsUsWsAhp3IIBhF5gjGEhrjPw0RWSPe5GcDoZ%2FclJfMOWQX3LLmXTSSX%2FqcWINCyPla76gnEkqefX2ZjjYVjmURf6XmLSchMpB9aLd2dhTNcPx8X2IXnkD6qeUY%2FfTOs%2FqooTsis%2F2dv89W1qFy93f7Dg%2F13kkfxZYW1yEtfXGUBP5TLNVe6mFh0YUp4%2B%2FaapcOKnkxtgsYCR1bbheGTiaJetUiwP8ubS6mdoDrhhv6PtzUOy0dMeO1THxPQ%2BLJ%2FbggZKDYt5S%2BL1bsSE6kFpRMjj6nHniaATbAVpjIb4ZAZ3Hofiqh%2FzcI4UE1VJxkbbIwybG%2F0AY6pgHawBY9nzEOl7tDW0%2FMaqa%2BUXJEcsN7ZZuM6N%2FZXi6pO58ujQmbnuRzDIYawhqqcVl07EJdWkYoMFOXQca2JcrivXezKfTIhfOEviW8XGsLmw2k11O7HBEqBVtHQ%2FPoShvPWwPumF42zNWS1cktO%2F2GLnj1GbaCz%2F0NLGH%2Fh2K7pyQdwsrbz5Ptj1blB7WRu%2BdV7EEGwfSodtQ62tsQ0nH8yPNtRTAv&X-Amz-Signature=0b3ab3bdc095aafe2e95a91d743d1915faec55476513732d5514f228062f1e88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WHPCISNL%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043420Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJGMEQCIFzp83ivf%2BimW5%2BqDBm0E4frFdi1xwZ6UJwDCwezRQICAiACX%2Frl1luFJUWgwQD8fCexf7WSbf5VZY6s1U3QED4fECr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMv%2BNBLMFLL4Eo04VuKtwDPxVMvXsBTGRdki2Grjnc4bUX8%2FWicU00dZhRzk3D6WP6ZjlbcN1UiW2c8go%2BKAU%2FM9ngwYmeHN4WozXvyC0vEMqsncZkcoJYpKtFiqIEQK2EiUkMLWReciz8GVANajX1Rhv0BeMoJ8svRHI5QZ4cwGeFep9ErakFj7i%2Fkk334QDiVilJjcPtqv9IlAyHqMUR5JS%2BJ3VPH7WGCkH9tQDASWZFEXlndLWXwnuhL8WwaUdm1HxC5m0msL%2Fv%2B6Issd3mIc4YOhT0RsqZWKiV252n6jgEZlyWtOWQIus%2FNa9cwjnvs2%2B0kJLtGjoE3RhWOdEXd%2B8WycUcstqzTrON5riDRMSXJ2UIah4Y0a29YBKymi%2FL5mozI4%2BF2dqcYbphEXHse%2F132EJEByoVslffxHYxSgNVVcGy9KXY2F7zgKHvlrQ5hbO4Fl%2BNggH63FNlKVv7yImegFqlvO3aAFjK2GJ92E0XG2qnOgLDXUoHxQNGZUgFpx3puPr8PwHPvR8BCx9ZCyVmCdBV9%2FAQNPUZEW1kqisweW0IPFztA0%2FajGu%2FwvKAPi3TEVFGv3lUWSTc7Vv4MjISCQTZnwrqs1sxv7Jy7uGHuYylfhOZTkhbsq6L0zgbzflzdv7djL438WQwmrK%2F0AY6pgGbLKPeMHjz0Bly36%2FvPRmCCIjLhPsDOcX7oFD2leyQI0oj5%2FHXH0VBV8jMmPaXV01AlxqhAJO4ETDJdhq6aVNyODCwpXn%2FajprY3C205S57Ne9TGe13doOVQgsvpRkHSNMllR%2FzfG4VOUG99S9cBsd1mhNP2a5BUziAq11paEVB6gG5KoLPYR6kDGof9xYuxIdCGG4Sl3PtqScTAC26p0EEUirNQdn&X-Amz-Signature=24734535f6bfd81878bc86042d1c5f8be728eb5bf018060d2f8e547d77c55000&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662YP4BU6C%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043422Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIQDLb9q8HkigvHqK5CgtBcIqchr7V2uuzQi4ch1lN3ky0QIgPdpOpvIUrylo2FoGG4yahYUjHIHp7fOe6g78be1guQEq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDCjtBu1x7xPBxySMqyrcA5tWEID0oAID4ea83YMrkurTtY1qDp3kR9vnpaXOaK%2F1WOOY1mUKIGqG9O60IUJwCq%2B9%2FvnQagC5u%2F80hj42XitLdNz5%2Fhy14tKoAobwjW6YVJNtFjWgr5%2Bb7D3WxBPa2EpvqrLNorZUZMP4RXq3yQAY5Z6c%2FzGn0RdFSrSPnoNnVeQ2oFAXOabBbzgKPcMgdbiJnfmRDqr3AIjRXlbIKnR2fiRPyaFo2oD3uzUsMGbm9ajFzy%2Fk19IElnvwKqyHLA5l1fFgPCJ32%2F43llrUgEOn%2B4KgK7eiofi9zk9G8QZaHGXZu37kJxoHViuCCqVW0Vvq3NiZsNEZOKtRMiX53DZg8xdyqgI4S6AMCeF38bYnVQfjzB1jlSM%2FVcXi31yiYHWDhURbGgwkSXcwS1w3Kk5NezKiZnf8ShxiEHfIBhA6%2BaaDSJAvrWr2JFFyk7F7z4BkHVRRQZdrUHUSYlK8kiHHyV4oGCfSGGR0I5PpAZ%2B6AagcE41GXSYu4YHCLcXPKa9ce39AbGyHw6vOSiDukMG7Z3CAIE1mWcQqxlmQakwv5NIJFt15CJYUbsZ1ra3POGJO9DgI0xkn3a3mKaqH%2FrJVKvJFQwenT4LS6KCGmBVvqZQON1xkEVAzcvnNMPivv9AGOqUBXz8pSYTugQZRcXtsKyh6NvjqEVOOEBg4UtiMFmrnAseTSfyIr1rClgW3wrePQdxbMSS8WotKumsmiXbHQbpAcWo0MidnTbVQe6vt%2BWUYxVM4kKdhPDND9JI1u%2BACk%2BmWteQDI81XgMhhWjNe8D2aCljvU2YmXCNJFDw9n0hsJCxy7HIaPOUWUmmfYB7fnWtQkD34OfNsHVV1yX%2FNysn5n4SPFiIU&X-Amz-Signature=d63d5d372b3c774d1e8c34bdb79c6c45642d10389d412544806825485096f9a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZKXHX5TY%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043424Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCIALoC%2BujlGBjJy20EvGqp%2BrqGiTIyqpcYg0Cd9ONoO80AiAw7BAADmR0VnFZ2ZVoKS%2BJT3XVKpKcabxb%2B61gpjyXZyr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMgeQK%2F7ku81zIlsnKKtwD902MuiXdwRSNQjfCa2fLdpELqzDFEvXsHKhLFapAkeCR7rJ7PvqTRx11cwiSf%2BD7sRrrkp4MUmPSwTAGVu3fDwy8FIyxkvir9QDLdF4G1newTFxMwr0In5GuBJ51UanmYcUXE0148FJwezHrupYIMjXNMgRFOP7sTWHhbGB32cPWz5T7BG1wbzQHWR4PNDLbEDAOA0GefjQQEJ6etCIMU%2FQw65aYbqNioeS3whxJMbbF3bsDMjDtdATJxqVq8c81PWConwkHXG6deu1BdYI%2FcYfW2iFbvsNkEqWWqrcOE2%2FLO4cd0f1fiL2U0sR5Y71GUTfgCv1FEzxiARFydvjFMbKgL%2FA5eyw1QNwGi8jBlXmtsvE96JxDf07dn2Cs21xEuGRNYGKemB29LWzQOtOzl%2BWsMu0RQRkRFeGkDpj8nV9Fd%2FQQLXvRAqnxXTsHv7vrdsxxw7tAcz4h78r8YIGGGhxyhEzj7dc%2FS7NjfQSuu5u70aTDWckm9AcplpU2OiLjfsaZHz6v68exDqIcVfb%2BElCztuuEzz2pz06YZSBBniFs1HEvztpr%2FRLFfPgq6h8nN4EUsB%2BEqeEiIEh%2FTJcSUqjaa5yGBineqAS4HucuoQjuVmVMW%2BEpbQzBc3EwnLC%2F0AY6pgHH6oC1S%2BNZaGY3ZuKOz6PjUrukvevDbutXAEcxmceT4uQD9Yco9HNGBiL88Ch31OTuJRcgU2r7f7GKkK1koBTfrnAC94MP2CX%2Baffq%2F6fYc7Hc6dxuZeUPduYME%2FqacYD4V35xEKJ8UjwqZP3ZXID4QBtysO5rwHs7rNw6JpRbyM%2Fi6dVp7dj5%2BaB2%2FWQnWHCBd4B0G5ZCgOo7Xcqfq%2FVDJY5f1QgP&X-Amz-Signature=c8a54dcffb38dcdbfaa27b87c5e7d04e89a6b9148c226df4ee8f93b1d60d4a5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667K6ECU75%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJIMEYCIQDLrHkK%2BKXBWfxPagi%2BLO1vhdhTVnAlNNI67xw0UGaQUgIhAOZMK7pz3fPhUrTmjf3KTcA6wYLMcHv7Ns2Y%2F9p1l60YKv8DCBUQABoMNjM3NDIzMTgzODA1IgwuuiWnqxIj0Xfn7rIq3APqViyc8wxiTeIqD5%2B1HD7lluWkqOCLHr%2FsnbeKr58ZEdIc7UtqoAuGZnzwttGPHAkB9Oa34xs9ErMdSN4ixOR9ITJTDQdfLQUaD6a9PPqgas2ACL3xMWjZ5zjHoGXWxpaRrX8LXU1zymh%2FZVnmUc0QYaiq5uvumqJeqfKQWti080x%2Fb7ZsGR8d5xQtq38MLP3EtiTj6pMS%2BhRun2JNgluzOGW6FpxyXtGgkwGLpWIIoWg4LU4waWoh%2BbU4UbXCa4FDgrucCIcFrSKnDjF%2FOK0uQaFmSgSnTBKrsVkWCtqKbKH4TDHLXfa%2BjOApvFxoJBa3pCnfQ6Z5NSO1WVO8%2BZcw3cQQ3KzwrjgJrX4YNwtIszem0VmityLQny%2BZ%2FLW8Q680YdXfeQcHs8bRSyKsJHShNxcBEkXCJyzmVP%2FC3XuIZiq%2Bp7wd25F4jFv2bS7eeuP70%2BeyyBo%2FcmQt3tfOx8i3MLQQtqRNtcZrIObTw%2FJgOjq6zEHYKBhBX0Oz3XO03sivJ8JmFogNHlRPYEsO%2Bj%2FdRNxAbkeEgLok5rzufI4JlvO6UDwZOP10NIp%2FaWE7ddwP6HAirlCWtLSLMHmDnD0LwH2rFRy%2FC2eY%2Bwlb3Vh5yIwB3370sO6Ii404ijCXsr%2FQBjqkASMOV5Bf%2B7WXe16E8N01OBkjtWrZ2qKPyyBsymvqTITcwV%2Fwl3ez6weGxmcx83mtx%2FNulzpIuQufjnXpTITumsc4Fme5X9iCOuPURKMyJ4Ie2c9%2F3ereBZj7k6WVz3C%2FmUjCZhdOIv8NUSBBYS10vU7YLH9P2VC5UZoCz3KqkgyQP3P4kQkPFPUNt5FLv%2Bt572i7SgnlbWDHKmvDWBjVTb02Ep4y&X-Amz-Signature=6bd233099d0acb46c028423da8963ace698101d3a1cdf9a11b3d9e7b0e81f6f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QVDMZ5B4%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043426Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJIMEYCIQCEak0xF%2BpalrsgTCz%2BhiFoidYFje00jRqF9lbCVCkDxQIhANRJTfIrPMSgbrGZ9%2B9dOntYh9hrZ1wx1dzbRa95%2BrvFKv8DCBUQABoMNjM3NDIzMTgzODA1IgxvCyRG35onxMYlmL4q3APg5z4CPlxbj%2FfsQuXxJto%2FZO2y4BFw6amm7O%2BlKZlusiaSSfZmVgEuWYjkVysSLmID3%2B7fV6686oz2hPZ%2BGBpYKKT5%2FBDFXVRZFIYConT6%2F9RM4AryN%2B6kLuCC70agA2wkRZhrxrh%2BI5TMImriWendbL1OBuZCJvGiPjlmpdlOd9beJipCzIalcX7ajoKnfKiT%2BGtuBm5sPSSAjWtUcxihhgnTOp%2FuPVxEXsFsL5kcq8%2F5jkhds7ZUXwXH7cFvJDZu01Oxq2%2Fyv79%2FnID0cxPPPsUAxS9hguirywFkRiOW7xCsXLDJkp2h%2BnHcKWqAA55mCWh%2Fm9yjIvf%2B4yXbGJ5f7SZy4PPVBtw3u4R1t3oQYfQrI4ai7WreF9iEJvJ5DrIePD6At0RrZBZymzmyfQLmzAjoCK1Xmdc5RZo04KblBy3BNfDPSLaR%2FN7wOJfjAWsfFWBIieha0FF9hKS1uVSDZhiAiJp7RUyKkyWaMBozLN1TV3uvr3o5qs1jbN33K1iqi20sucPJ4hjF%2FvgCRuSE7Iw3FW5KvP9BxGX5TYWzfI%2B3GWucCJLTwjOR5xZDg1KEGsoasgfemzYZHs44SMAUwblQRetRi%2BYCdhC8grVxWHbgICAVdc5hMGazdDDBsr%2FQBjqkATTGlu7J7DpW6o0uQnCJG8%2Bgp7Qb10wo2IFcLsrthb%2BcoL1A1uQTL1938XuSKN5MaCVGRnX93nVva0DtTIPcsy5jY2uxZ13y1QU6JqSBB1xFzIvZchJfbP4Pf8WrqRsBINtgovoygDheZC8GKDz8S8npo7ZBJUm9uGmiNgc2TkVHoa6XHa8MP7h6eYasV3%2Fx0069NYFrbZQyLjMXwUb8uHFT7C8P&X-Amz-Signature=d03778e54c47aa2963cb752cfc65a26bcaeb419c59c101bedf343f77fa90bdd0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZEX4VTGI%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043427Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCIFAhukyBWlVMvF%2FNYL8M2GjTlmlGRC9HXYlQRBftQ6SnAiBFySzDtH4Y4BiwTVGyCqzLe2SQjG90cTJ6JWFJxwU4fSr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMeb7RKI0Mw0U%2BL6MRKtwDuNixjJ4MRQN%2BvpHZDlUWrNTa3gG1gWX6fvVHiHxzUu6CvrdORLyCzQ1b%2ByJw%2B3qieEBFn0GC4LNXZTcG%2Ffs7hj6BMHFVeYXmWb1Lc0vMrvVhSZ2PBpaq1ZTsRZQk2mX7EfAnfXUohK%2F0E2fZamkkv2xZUmObpnC218l9LSsIaZnJHk1QwxGkdzo00RN85rh8I0V%2Bi3T0a9BH%2BNuTzw6c0MEJxu4WAq%2FlR1CbeRVv7Uh2SSWnW7nCRnul2mEMisZ9p5mvaX8hrJtcCsZ09Q4%2B4Xcvxf2U7Tfj5jJCvoqbREWf7D4VFxMJKXfeN0ZDXeQ3xbCeZm%2B5UtQqsPNEh%2FforTTmgvSH3KBDO1GuiLv0PQfkOwMMs7zrwX14cevTaDfsPg5DFZoB%2FKyQwffNiixan5gTw2tfPHHr0YW3ptnC5a%2B9A9n1bPul5w2Q6T0dLf%2BuyhJoJ1vJmdC%2Bz5yCNY%2FYHrPYbgDAzn8g5gktp4zfpKtu5t%2BDNRDNI0jus14rMeuhGAu%2FQJqMJTSPZqrgUiSqsNA8HdLLd%2BUUue9NgVSJj9o9tpIsFFOVr0RkU66nYm5OZMQfax8QPIwStLb%2F6N0ZDlmHuKVGr001wsmFDu784HcdD8RYJan0jautRqow77G%2F0AY6pgEQQuhDz2Dk540s1y2ITAEjV3bbzRM8sZyzWLeD3w%2FA2yKYwutvmZ0e322HG%2B%2F2G6frR%2FbxnshM070rsmNTP%2B0YE0oK5xFEU1WFqvZgGUxFJZfrRTpsEuNrbgapx7anA1ehIKiBLocrGaBfALUe%2B5If5PaHdK%2Byjf5cCiJILAbfZ2UhlukKz1Szftnsc5vqurnmBuuF%2BMYwFpXAzPQg8iIjSvAeHajj&X-Amz-Signature=f15211b31e3c4947f9638d0914741767509e447235c767ef547f7c7b0d949f1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663VCSI3OB%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJIMEYCIQD%2BF22AzENVn%2Bj6F%2F1EI1OKogaMewg27F0mSTVmmaOpHgIhAPRSfE2320EzCF1pdLw3LVIATHVCjqt%2Fx5uxwyR3BnGgKv8DCBUQABoMNjM3NDIzMTgzODA1IgyJwbOHrBY8KJHapKoq3AMQayhLpD9pvO6vDLA%2FiYnNfQBnO0xPVOUbDktfDIX7HYOCLigUmZmLlL%2BqJ3h3I9BM%2Bz9x7%2BifPmYqlNwMTIkJ2yqln2Pwr2FVEYhGdRxv3eVbpwJSBUppKkuzi5N1up%2FgmyWpQR9yKfH4hqvCMdlX38l42AqTXZGN%2FuZ4CBa4%2BoXw9uITPZ8fwK1hNOcVFUk%2BEqsYHlVzfDtvuFiHmPfl8DIc3sPp1qzevHlHfV%2BiztJH1yE5l9RpT%2FjzUlXQW5wuSfgjzrmDEaC3652CjjhckaT7aD7u2uZcCA%2BIpUkfyRJE3Cxy5VylXtd%2BXxx67UQSfYCZN96hppWZMBnlaWl49aJFbGvyU5b3JRVE6MLqCWJOGQ2%2FD1SK2Y8aPCjj6xFKkeqeLCYdtDUy5rbolcZDY1WcFfX8Gs5wNG6INyLYFhBvs98450Vn%2B52RJ6bHkhEaqrNdBdp9St0kIMLt4%2B3Bso7n7raPXqUEEyrksauREKlnt2Pvo63qqwqCKzNj%2Bya4Jyh3Zja8bNP22h6KL1LedC0YXwf5jqzrFUSauZ0HgzHT%2Bb9ohHKzjMgr%2BeS2SPDzewXz4J8Aso4cEp15EMUMZma8Agxnhf4OcRCnUPTNj8nYUKZeMEB0cL5TojCCsb%2FQBjqkAfda69wpnvdtkJyM4VS5p9m6eUrLPZ7%2BSDpxGnxkb9zCXpGEPWMBGo9tHO4xHRTc8GXQU7x%2BSHmRE1F%2BAhsiTD4mV7lpgOpAhO5D4WOal4i2VKlXs9MGa1rC00qv5udVxyNrO448A%2BM5uZmClIlrVA2CoXiCyAZ6ROyKWB8nldhHziKhLWCciE2YKooqCDN1UBimMZ6dpDVaD9a6neka4k3zWP6M&X-Amz-Signature=e038482f955f66d71685a908ce387867893477b52c2bc4b61c4d35e6a8491944&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UTNQZ2WA%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCIBo9W29qiS%2BlfrVobYtFkqA1w59GNPfy%2B9S7YNEF%2BLYsAiBmH2nsF9pWRhjZMpKuqEm4P9ipj%2F%2BntRCVAzL0nXZ3eSr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMpJBbEMDg5mjpXX5RKtwDihV2QltbasBJZ2FFPmrjzVvaMJNHGHh2MV03qR75u19Z43J6ZhWNva8DAJ8QRFWMb98pxGfZAYhw4c1hND%2FLBAOgv0SJuvLtwYwu9zf1zI7WW68Wkoylr8zITMY9Y%2BxwgfcW%2FvGPvg344Zsz5XpQCYJnUiDkUO5rWm853vdaNSIyqE41a6zHflBPutDmipBP%2Bb2uKprP2TOq2W54Qz36pGe5byuPsPnVVcQn1mWLE4FDpZ7DbKZ5XRtp%2Bi0jP4meVo3pjfpJpy5ymIR3fAdptt2FnVaezcG1cBBrIYs%2BqpS%2FBr7xErbUZ2QdLos3enVErBgEDaI%2BfXkq34LgJ%2FBiUzel%2BpKhUhgNKOCD%2FCeZ9Ri0mpJssxO1QOgljSYCYp3eesJweJHbPJ%2FFfRPNIprJJZFt4tajIL9QWRJfypQnIHR9DQGCMtqhoZJZEKUIZaBaJLj4v9EPbpQXs7iNbyerIf6aIMtbjZ05OnXTfFOVjkuDie03O8KNPfx8PM8kZMtTs6vk14sc84Nc%2BxioC9icDEcqsEgA4Idms5zQKkrUajDvkZ24KanuS8obFYUNbxhCTs38zax3QbaKwjNJ5Ty%2Bguj5wiWwLzPLnkbERd1GDWAyXLVXuLtrF%2BKloyYw27G%2F0AY6pgF%2FizgF4DOmbW68L1hK0olzv0eLgfV%2BiXvALgAe9mZXhAyJtQVWr8iq%2BwoCht4c2fGJ%2FPfMdFxoPUbJr45zeQ2yktOYL%2B6LrL8UINtcN6%2FQCXcSTKySbGw1f11nPJe6c1rtFAIdfuLl73gzQgGeIKrX1FPQF%2Bku7ZdIzphFWl9vOn4Ik%2FokZTCHZf9CQAPCOmgcRkn2jdAcwwAuvXM7dJdfluqfeN4m&X-Amz-Signature=f414af604012c73209ad7da483e78fcfec9658c3ba8118c8b8c2e3d38ff1f054&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RSB4XHLJ%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043429Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIA2lJkrwl0%2FT89YJYil8GuQmf8TNOs1Ogyv51XwJt8OlAiEAzWdgjmfDft4DLTzz%2FF%2FgTo56IVL3mMhq4sKPasrna2oq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDMMyWBCGqToJlFfWNCrcA67RipsQErU%2BdIl2r5yBkhH5WNIr1WUKBT0ToUUe3%2B84D01f6VqBDKMkJotYqEcNAe5exvxSfTvXSXhvHLM8MpcU0VzrQHdkDNu6QDACyIZP7lzxLYRs45RvyoZ8vB%2Fpd2ZK6qimqBL7SfA4ZJ8UqqqUs9PiPgHLqVL8Dz4bZW9jzp07%2Bp6gbQlp06q0E8jYDWzVOeXHNgqfRRICBgDnk%2BJLVbL5HnR7do0T4epP7T6e0oqF7rz1MjzdvWIH5xVf4UzPcdE9zbAGUEu0u3w2jVKuXjn9jZTeypFjJlFGpWzPkCfiD8M5vXW8BI9LNtN0D2tl9prERJi%2BcdTEBZz5IFw8sxdsHuJJW8csTxaybCBRiXTZ%2FjA%2F%2B049Yp9B0wyxTQnwUwzHyjbJGCctLE8iLaF1zHc2SnrXXMFXp3ABS2Gjva4O4cQSU22AC4m%2BTMfgHpjZwz14OxG9iPxVwjbNXC4gjvxJMvcN1Bn4BJ%2FIwXHfZLKgbP9naXdJKqkjrLmv2FxLHvYjW9SM7RWrJ61cV2CILGSXRYJhR%2FRDmTQc1Vc4NEbVWL4yq8PdNrXXlgTzlyxS3JGZxcIykkwHkF%2FPCKc6uiQgp%2BNRfvkWhxgmY%2BBLm%2FT1GL4BPGa9CqGnMNyxv9AGOqUBcwFAsO1pifW0NzBLfB4NQWDYfol8YVqyawOxHhD8ZHqJwsD7hmtKunMEteRT1MlegUoTw3LPxYwmaqewlYu10b%2Fw0mkuODr4DekJV%2F0Kgxtm4BeLdFbuF9FQTqYx7mqxVXYZRO87hHz89iMfnCi4r2fMef%2B7BfzL555i4p0QuI8i6YNSo38PbF6YBGvcfj%2BQNI8Yg%2BT7XF4KZ9NiqWh3iQGqgKg1&X-Amz-Signature=54c3b34f46048ebfa813ba28b1a2ddf825dca7384a18746e0545b31ecc1200b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

