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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TIQIHIRC%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043740Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCUrP3Oa5OQbGveVpaXeDANco4b9wI%2B22dmWAWfTHaMuwIhAL9WLwT5ayfVxu9WvAbh6vzU5W2w2GWga8AoCKG13TeaKogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxu8zc39izfTp%2FIfPkq3AM%2F8XbZGzGIfatueebJB0m5%2BdGuW%2FrO%2Fx6AQz3nmeEGbZIbj%2BKlKzVYaRFQuqUH3UOxr0IybnKtpvkM4h5NYW59VoHXZp%2BirVcnVlSjF9NL%2BJ3C2yvgxKf1hsmAjGaOgA1ScmeOgB707v52bQYwAlU90Ob5J9D1iRF4ekHE14KcUidEnD3sT%2BXsJO9%2FQuUUoR9xGZvFxKcDhx2mQsGTP4tGpli2PrSQeZmWYSy6qXy50P3asnwXaZqulFWB0%2B5Ayllvfkrd%2FCwxL6x41PynCdU1dFKF9BjbUedUmVgAOuHhk5J1bBOQDAtclju3GREqQdLchuD7iUGx3CcTPv%2FZRbroNuuMC6gJFSEDaxa3tA399Dgn7DBjRjDtjm4eg5y9mhHHIMHEpkQWA7bAv%2BD9f0lM8sE0hRtJmoFrq303QxHfA3X19eLkNwj2u%2FLxOUUTm78SnNN8MRk6LOUK3ZDwQ211Wq0TqnCCkNX5mpQXibRdL2%2F%2BeWbLky1Im97hhkemYYW4TFXcYqC0%2FbCY6s3ayIcN2wdGDWRLyGYgEl6ADG%2F0e8uQP6DJPxJDacbsDHFdXC2m5avLDhhqSdpGiPn4xscMNtTv3zW9iv2wVJayvEuG0Cktzm0l6WW05deI5zCvjN%2FQBjqkAaCywKlsfAutkMeM6Ai%2B96pQfoNv2DOcnPmY7FSQxsjwLTxVtMwtTpykJcuS8%2FydbSZm8oTNwqVxecgizHubi%2BnbPrL2N%2FJdUeWrKOV8Ugt60XRRk61huSFyRQzDIw7NeNX%2FecmoxIJlefZ2%2F5goalAH8FiZ%2F8z3LgGjR8h0XcohcyD4iddr%2BOTh5kaq%2Fe50%2FJYOjv595xLDgdM%2B5hjUbMbbqds3&X-Amz-Signature=cfc6cd5790d55bbe663294898b2ff7764f8ae6315d952e2361a3f5068bce6aef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466653MJSKC%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043743Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGEZYaRlVHqfyx9l%2F1xv%2BIbrvJGMOaUlrhBZCqRcfdjxAiAco0KZCNN0p7WcAA55StAfMrxybCYMnCzxLIRB68BN9SqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM53AhBEtdwm3TbiuqKtwD%2FrRft%2BvPJ4kpcdPRxWIohTy%2BnwgsjE8VZIp8mDJKROXEZeNUpHPIUPNuxApwZ0xcQD7E70be3Hdtc9NarmZLIwum9fB0iKqPu7mFSp0ffNcytPJ%2FvNIluNa6KauoLtWo%2BNEK8MnqliYe3hBo1VJxPMVWcZ%2Fn4UzeCDe3ApiSJCgWCa7rDIinf58y4qksVh7uIIAL4VDa1zQK4wpfKsYWiJKPwZNrckyjBfvf3%2BwTsP3h5J10nQpyA4hBQj3x9UOMOGvL%2FgCYn84yBZYSHaJH8foL6xutFlt3PR2R7vVp2Ci2gLXusyWuVUeiilZiiBVtOUHQOAfAjPf0PqGNgV2VN1ad5Ndzcjp2Ffh4wtrqgVU1FYD5CPV6DDfPAfg9fSv9BM3%2BBxN%2F0F3IFrK3Ndal3CTc9ZdMoclxkgiXW%2Bm1A3clKUYe0kxhM7PxxKxt%2BS7dJRSclIhx0xmpuX%2BZC%2B8HZHMZqSa3jdt1JuRRs2PcJmoPOv5n35W2aOkSo8AjcpwuO%2FINKdL9xhWNRCa5PssGeUjMqzgSq%2BVP1%2Bs739JkQ%2F%2FUozjPclV2vjl02S1rRdxdOSfkuwJrgA2PXHicqamwNsmx9KPr1p7XdvP5vVYwrJn6045tIJe0Q8eJ7GAw%2BObe0AY6pgFiRZjeKURk%2FTV5jlwjwBy%2FANSU3ygCCMeXSspraXJF1i0OxFlmKnVRFYfNChLSArZhVmIbM2buXzcAAtQrH0hpsxses5QS%2ByUx5tS4djO3pQp4wYBJiAGmv9ZkQss4tX3i3iKt1%2F9BwgPrtPfD7POUvjLzTKDIoTJVxsLZaU85XPsV8akMR24W2uFk068j5fBovKcEkrZtgYMuIS1ZCixWR4V4TpYg&X-Amz-Signature=32ea403665a66aee8b2836ccfa9a3e87ce715315fc8c6a2bcda5b08d05c8f4fd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TWLWIMU4%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043744Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAM%2BaeiJtzuiOnAwwS4hjn8aA6Myql5BpyP4bNP7i9FPAiEA6o5A792PYkmwNjocg1Drc6ILXGQFKb9mDcu6Fu0Ai20qiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI12HFe0zgw6XdePAircA7nTPi6W1OTYeuo%2BaQqyDtbb7lJUr7jdeN%2B2eRjkDZIOctJySJz6kQh4dYUmU%2FofjiG%2BMeh8qcmSdv42lRiimQNaV00p03op8Ua68Qme4yPfZwgp1nMpn4qwnuHXiudPuj3lOmGrW4SywdTUctXAs%2Fn%2BYqZLm4vubWZlweNoPNJsz6B4NO5BAsYhZh2zH1MPV5YfavF4diBcNTqk7bu%2BsNVp802aK3hh1ozD5niWMxNR4tApvUPIYnUXQDOY%2B2jWhY66rm1cIcLg5HumKQlbs9zrvgtqf1%2FpsYAQo%2FkpkMPOgEinJW3SwoCFYJO2DdEDO4d025gIY9p1HCk1lB3zWwqMFhebR7yRT7PvkwMg2V7VCCj15js6j%2F6J43Gh20bYQG74QatiBKRQRirFo8xC%2FTiFEPoodat%2FgpiX9pGbMQoDgt5A%2FwMj%2FR4%2FKWigqCTb4GYqfR4C2%2F%2FTu1w3IwPb%2BgOxeKTPboINMro%2Fouho5Hwql43z1lS1tJSulSpJk6U3lrvyQbnZhYUrvH4wQPd7XXYCH5l9lbgx0MdCvRBXPeMz3vEdlHIH%2B7tb7h09Hifdvqr13Dl3WQR%2FDKXMxYwo88LndTdkJwsByEGmeREGsSsKXJFfddm%2BBsoGU%2FTTMNvm3tAGOqUBrRZqZ6cEDX2yZsIkD2RXFmu4guhfkg0qMS2i9%2FZRTrxpchVk14y4mbgnA9E8i9yPTS2sBAAdJzbBkF%2FYMyFVz9RwWbD%2BtSHuCb4RVCkdNDlQQU3eJI58lX8HvdwIQrm5peipJK%2FChbh8C2CFv%2FHzjvIgSCQJxEWBlnBNejzbgDeyvb53LknpIsv6KgUdzjntGJvDtmM7f6t8QShFmMIs8tWVvvLR&X-Amz-Signature=961606fe9da630f236ecdccb00e6f3da17df874964c96178efe8def2f3417830&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T777HMGH%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043745Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCvgQ2KU1ylrmwnAuvpHZUPzTsowHENTcPludWK%2FH0D1AIgIqZ9%2Brr%2BEy6VGsnfK3UeMl%2FWJNY2PK%2BTDKnYCmYaOYgqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLFf2lBbO7mfw17qjCrcA0RIJ8iwm9wYNoqc18nNoS8W%2B3%2FHOeNXOU%2BOA4%2Ff%2BMob0wiLdpf%2BugajQB8f3dqIQ4L8khFkjzCQGCcfYN8SlhKXj09vZjVkpGd5XdQIXyXjIvXy3FhnAT4KWUcGCOtygabYMySYN90NhfGqrwexiu5F4iZpuSreQ5cifq2gjeoP1m10xnFCzhj8YMWt%2BGtYzWhwRxG8oHEutnbuFMLfzmhtQMG5LBRaaEpo2tu%2F0yQmSPBw5nckdWoJu7kRBvPU6ETLcsIJKUfWc%2FzEvSayMqp4UhWlNGwhOoKAuTRZK2%2BKF7CG8jcmRLnh8JsR7cvTdwEtekE8J64iTfU%2BgyCWzFLbnfV%2FJ7K6%2FF9R%2Bz2dSnJB2OWbShQRrjxda2phTcxAs27k7SCKeQPxFEK4Xqd5kKaDAr%2BiMUUrLjdIPiZFYwvoEP1b8RGOltzihaCHh%2Ff7ISU1x9FppT4HaX0A1MmAX626gS2ZnBLgecuGuJ7Wsk7QGbGuJGPLv8MnYc3VBMrVD6386vncAvYUh7m1LECfnQNa9VqNCxgKnEAHXHtras0sYelstMJ%2Fdv7udVA6oNgRlqvL5nF%2FGZo8ijrS9n%2F99gd8Nop5uXbxBhXRV3GjKtTgWuxarEwFE0DIRr1QMOjl3tAGOqUByodi2FK%2FUgbOXfzZs45Xva4AxyLxUX%2B7Rc5XW%2FaNdb8%2Fmym88%2FONRrdoQtePcQow8ZAe%2B7mUP9L%2FWo2ZjqOc7E3%2FtKQg2jwjdgWwa9HmwPV2HEPxl5eU6sxgT1ojdKBtcHoVlS9X24O4hG%2B9BfotT6xTFAlQ5no3pM0ajPVE%2FZSVeSjFYir8dVIf%2BMac5jZ7gl3mGqQM1btZTRM%2BW3lNYozKLT6x&X-Amz-Signature=aa3fbd4485cadafc5b50e17d41c57f8d71d1f54be7795a6e1495a7c7f7976f77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TINIE5HJ%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043747Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHEqnCOoa8nuUkRzPal7%2FGDNb2AHRPebwfDQkJ0gYRD9AiEArJSXvvRZ%2FOHKf7K5ZhGykUNqDYN%2Bvqcoh3YUy%2FK%2B70cqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD9F5O%2FrQeGDvgbAhSrcAwjkxAZ8i4oYb3QohrYoLr0dcR9hfIBb2mT5Xdg2zepktJ5%2FY3oR6fZFziIGrkn%2BX7oQ4cm%2FMQ6Rt7utrFE%2B10VU2x8u5bMmF9Jc6ZeomcckJ06PT%2BbgFY9CpXSHYaDImzPMwM1nGW3j%2FeilogbzGfQ%2BNwAwWCJOJKHp4G0y0tW9Rzw9f5BHcLundPKHeWmcc%2BetQWo66YtVTEhmz1%2BHLJFgKhMlF%2Ba5rJG6huU3M39sSWl%2BZUbWfFH489onSoeuy%2FtclYpwEOtUSLuZ3qj%2FNgcu00fTj9pszjYC8X7hScLSoLy84EROcjLQT%2BwGNBJpIZLaePwi1hhYLhldZa439XU%2Bs9G%2BoS%2FW7X7dEocQuj%2B%2BsAws%2FRUNcuK3xlPv6xFEPba82QS8nkBbo1Kg9U%2B3AnXN1svnP3FMCcJDTd9ILfmbZp%2FzNqYvyRP6N3334V21PfzSKut2%2BClCXtxup6dAVqjsOyfsNyyRGvKKWLXEnSTsRmuE%2Bd6wmXNeK5YOIx%2F5XX8uacDzAjHkH3h%2FkstT4Pn%2FEd34RL9O%2BPGKdOCA3ZsNol1ykeEWVaDtMDjfFcuSr9AeLa%2FWztKFaezPgdTIYh4FgNqL3wV4SwtNRHmIBBg28caNN%2Fxb8EJ02lBfMKfy3tAGOqUBTf5NFVg3V7s6dou8fTjz9JfInddHxjyoEWXV0X%2BZzI4kmb0hsZDw2%2FZda6lfaJTHqjf5mf0DfYx4MAX84pDHV8jinK%2Bw%2FygI9Tz%2BJTvD9urnv6Ed16szGcmBRVwtsX1nzbxjvcVpuQxqAEsde4cu1rFGEFfwoI%2FwQP5amGNrQS982vojo5eedVYi%2BTUj1wwpaAGwKqrnRgJ6QaXHDQ3nTirqbE%2B8&X-Amz-Signature=92cd37880935ea33f36e1dc399ac5c4ed29fb517d7fb350098d772199604c4b5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WL4GIOSJ%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCIkOG7g%2BqbvGmdNssEXI7gKCzZKUjiERUiLjnPpVG8BgIhAN1qAb6lkENl0SrOXop%2BZmSxV1wEmnWp5akerXdJctOOKogECKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxVa2ghCoaZTuv36aEq3AOXVEAOYMJvcokJ%2B0lQJ8xgkHAUwQni8yFlsMfPUUAe46dtyJu6gZkxd4ruNfEn0IuGyV12Iz6y0R2Rz9v3gsCKie1R7t6hEhQqIw9gO56L%2Fbb6vJSeG5ouZAP%2FliffMHX1tFaBkAQeygQYgQvaSi58NNrlDXBvFCqRe70KMbE%2BMHQMJ2uPEiuMBBmidP7SIEYopF4Dy72rqmjTGHchtknQOGduSZ%2BsGlqzNEIlwEl%2FT0XRfJWG16FQE9tGiOvBEtP93x4Cjon4bE4Qh40lzczBI9VQW0gyINMl%2Fxg%2FWzjfB1rNJzMmEeAbR2cWXb6SpmFhTAMfiIRETYh8DhlpAfqyRTvZEG7gcJckyGG8%2FkgR1M3LIqhZvL5MJKP3v9a4dy%2FWUEHJf%2FUjXbiqrJGWVw0rfc6i7p1jeKsckMUPLr%2FkwblC3a10I5TrYqjv76ZcLpPky7khbQR8VSqSji5G5JtiYPoSsasOpK9zTi6iEr0pDgNUGP8HBIBVNmUpimTdgiTlQ%2BzplbqehKyFQMz2OHt9sE1KX0NqnGkr0W9Pbdl7ht01wodNMKkviDLxvoeL%2BvDr3vMoBP%2FJMrbPOfByHiLP%2FQCuD3cqYuRCVR1LpclpiLopFTIKR2k1%2BDQJwDCG5N7QBjqkAfrIxZkWxKXFaDXMwLs1Zd4dBjrf4ivZUHpvTPm5IkGL8CmoJBBASTSzVUjWL8ZUrMYKk5vCpqd3jjpAEieheTPVnJ3w30La%2BPPoUUFCUX7WIhSNfeTWXBk9X1%2Bwhal%2B3vcRiZAFZTnFVHUWF%2Fz472tX%2Bjh3PL2tnJvY%2BDlRC%2Bfl3IOrpLnaLl97uTEY6ISDKdq4dycEBT5iFxDod7KHH8rNoX%2F6&X-Amz-Signature=cec59d0a2f296c9f8c05dc6ad139f4a7f0137201de772d4910204f68cbe362a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WHUVQF5K%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043748Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD687qXElIT%2FheKPWtt2I6vTpTcJdoTlACAIZRckaSIHwIgYcF1w6LhV6xjmrOcEUTfP%2BA57x6ghLii%2BasoMjaBIQAqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNW4t2Rzs3Nzda9zlSrcA1KBH1o9MzIITzkJeAqu2YDVnXDtL7ovqAQSnDmssndyO6kqmx5roAJ3HdXwoboKhqEq3j4LIY9s753%2BnWP4o6kMOmdLB4wTNJ1nvEA2Et63mBVeEKzsFpQ475sVufBtflJ4T51uhcRosg7Ntn2nmAc0ef7u6BoNfgDWBVJ2t61mymuSK9%2BOY6qy8aru1pL8t39Voo9kiFnQKhCQZ4%2B2zOav3B69lTZcmgyKq7nyrzHHxPXwIYToTmhcFkpFxfb3Pc2ov353BOTzZHanWkv%2BK%2FoOaOsRPM1Kxf1xAAIMiNm6uXYLAyoaD6%2Fga4PVhtCbRMTgduSSuArdJ6u9mU%2FdiTB5OycMOby0tU8INn15XlBRvi0vaFZjRCpd%2BCqD3mR7MjXrGfr6ZES2pEdKvwrHRlNZEACRfcyp9fl0aPHiwdGAlZFsMwiDxyllC0MW1WjfR5tPT2p3HhHZRkPEoyMLsT0zGYxnpRgT4i13gYB9K65HMD66%2BQ%2FLf1szxWmGDobdA21uhk4mot0%2Fp5lpddwu1Fnsb7cBtvJequ%2BH%2BbFtel35A4T7xNdveI3wQ8%2FuYEfvNUt%2BK3mTL11sx5rPbHkRKUeGMjd7EnN8Ki6PqQroiBnYbEW9LbFL%2FUsnmUWNMPfl3tAGOqUBs9vZMWXwKkptrHFcO3lv404PmV6BuaJZNfwgZt5Mb3VZyLSR4wpvPSWThe82AQPGCGVwvvHOubU0UX0Uv3Vs0kl%2B%2BAWLAVYwJ%2FtZphe%2BIhD4j%2B3iBtl1agkNgjnwcgq9BPTo4DvmbmuD8KQrBIQoFrKM8nx7whPtY5lmJwfWqHkCeHagYBpk%2BDP1qQedMyxWVRpp9dAEmPEGV7ekZPPCyktiT4UK&X-Amz-Signature=4e4365b9781722e4d0c2d4afa6e41b6f05abec4de57e4394ebff713a0ea0c04d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RXIUQGZK%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043749Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDAyKJTtqzR7NYpcE5mFTsjHz8B%2FN%2FmlCmGAgGob%2B8nXgIgBewq4I%2ByF%2BmKalKgxTk5yoOyeYjHSBnglHwoWrQbaQcqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNyL1UDggYSM47eZjyrcA4d53H3JtwO%2BTJ5VMBpIEIugVp%2F2TD1oRuEW%2Ft0Zuz270xRKG9VEuIxf%2BYkmJkA3q4iySTUqnzoEAkut95FCq%2BNlI7VbzHc0lbAeJY5oGI%2FgDPgMWaRTSc2YstxKuGgEAJtlCKiRL95LKP1gG%2FaEw%2BtJch9XWMlXKBCeGtKCRE7xYcSijWG8ppLl8IMEJD%2BDDyKa02551rrEeLjx9H8d7qsvbCdnHSBNo2%2FnHVIk4ig4QXQITwJrZpfNinnf0KUgnQyWwa4CbEFfjUYpFSwwz0VcVw4URLIBgaEm5gWeFg6E3uheGHbGfoWvP11%2BOpJ%2FYOxcC2EPUHIvJxrEXvRiR2%2FHVs2zDgMd060MOdhHTQqj%2Bs0ogAsNjxIrk%2FP9Oh%2FycEmgJHUHYUOoBv78XnwVW7Cz5feoWdWzmSUBRwAaB5a%2FL2GaJJA7LhrryUShIRXj5DTJzznB1xUKyvQW%2FTwJVq%2B7uSfFK%2FI1wErRsommftVV%2F13r5kQv3kg5aX2WBVboVcOglDdiekp8MQLzZeYp%2BniTrDmsYPWef0j4C8Qpay%2FOEiri3TV66rd5M0dA4XOvG4uVoqkHK50mUyOFwcTMDpPnHqZGl%2FiPZFSzSCToJOZrqEvqCqh8xCcpymgrMMfk3tAGOqUBQwWI16pmsZq%2FiYZ%2B6GCYAFI%2Bo6eDUaVRUgZgyFJIBDH6ZWTI839aXRFOrpQFNnIchC%2BLFN3%2F3RwT0dPsDSoSwGDOoXRwHM5G7hbmG1JJKA2CZj%2FFe1qlqW416rPpcUaZhRrBeB%2FWuSsMnjTPMMPuzDVGLtbzzyEj3W27PNcg0q4B3jEniA8h5mlhY9z%2Bc65NRhtylNi4XUW0d78TTL3Jp4i%2BWeil&X-Amz-Signature=e9d8ad8dbadc0f227cc6e99685551ae79aa476bafd0d0519a529f29d41e59e18&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XZCIIMGW%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043749Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDNo4Sier0wmuNkvKwk1JJc2eEvrHPdISgReMPt8ObtXQIgcZr1L84WCUEEvX3xs0tG6Etq4UHgH9q%2ByVzLMjUHoQgqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMphpGev1B0c%2B4J26yrcAyEpyaf%2FNjCyXAYdxVIhh%2Fhzx8tGcX9o5qN1M4d%2BbjJ%2FO2N0Reec9ti0r29Y6DCuvhKwRH6WBwotS32gI7MdFz4I0T%2BqOUZeVH5RCe9iwsQlCItrWnL4AL5vvHWmd4DwdR%2FSrUqjRSUciYuqbYzRzoF7bSxfz2qDNyyz7QRaYkmRTmskES%2BESsijYvjIazMt2edjHthxLe7KrMdsraPgvi655dk3r3sUL2dl7dsnFJgaSSE806NUk6gi6nw%2B6l%2Bf%2BCWemopnOUFGK7VSE1XITsvpU8uzGFjSXwz4PmkqGSnEgHK6ArE0WcOofnwJXq2bFwq9XlfMbAKxBlGLqalCPbKOxzuEfY7NsunLqnfDoOGQV5z8t3bC87CploJKl9ar%2FTXrd7ZsnI064IIL1NAWSd26xu%2FUaz2tnvkMmRX05typhov1lteNFlHqhCC8jqupswNt10ZpemenlUu5OVTsaOFFZtd8%2FZhGQE8S2Cjp26NZSjqeQ93mtz17bxDjWJLC2lSe8vwlrhGDDnPo58po762jFsX7XyFtGVdO5M%2FoqJCQTj39P2mYj9xqNHeVXeghHdtu2VNmNP6ViwPjf80ltNEVMR7Yjt8ykh2nDcqeDuWmsV902r%2BoiejMZEIcMO%2Fl3tAGOqUBY1kt%2FePgXiBn3NYLx0nO9HoK6Jfmn%2BGOVcMsMbPfA8vCUvASavdmynlUKdmb2RbLZyI7TzN9cJVMdQCp7A3CvpM13%2BseD9ohb1GhutiBcAyc%2BXNdEtwE349hNOJtWK%2BxrZCC%2BtFRyAkbocxmFN60296DqUvQrF%2B7rnIdB4hF4HCSLJlRQ10eu538cHzTNhY%2FTd07up%2BBmGD2tW%2BZdRG%2Bi%2BjaCj0%2B&X-Amz-Signature=3464899ded3429f09996cac90cc1d3ecebd3e1908254d5e392d665510c0c7d6c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466REPYAMWD%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043749Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH1eU1kGwXrv0SvtRloSgzQcHX8FKFSAumZjBkoBZjFjAiBGQOm6bhy2Veafccj8noJiKyPNJRuCY2eIVpIw7oXIZiqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmNPXMLUJsgf%2BEKg5KtwDN5vSXl7pxe5BLIjHis2As7BTubQFz33HlQR25ynfnNDT5ORGqQQdJXxQCzB%2BH9VtqlDhZrvLR99l691tIqSAmyyxARQ1sxBXG4eO1SyVKcpSFdBza7We0JHniFnLGsQPQ%2FFPveFmN5BTPvJjEefF9kqRLCUESN8xtKGEJPm9rkX0IwSo9sccwpQ2%2F1dVvAMxGnSveLzM3m7%2B9mb7%2FVEXMQDF%2B6ZDT0xCj5ZmQa%2FIsIKgtkB0Qa6Yk7%2BqtgOTO0%2BNXGyP4ype8m7wng%2BAPv7XvSYJSmdEXBnJhMzsvcVGi1S6F0UDidrK30m8jOEIbgysuKDfyXXuqz47PT3%2FXZ51Gj2L9k3JmXUTOYPRI0qCw3rJCFzwTAB%2BAZOVuO9EGHh6SIuooarPpSwX1kTGdE9diwjXJSd4jeCj5Rxigk15zKmIO9uRpN8tsKLs%2BJMzrIERvRo6DNejqlSEvBHP5VemgRPRzeZhitTk%2FhQpKXljWdmnN%2BqeTOwX6xpxHBu3ooY3%2BFzqAr6P%2F4hFaScoxlpohp5mqcwFJphtXYN1yTY5JjsOP2anCaQ%2BroTS7tbS7AUpimvUF8LSAqYjKimzD8Wgq7axfp2aCiYpnsd1%2BUAYt0nqd1%2B4dtN43A6%2BhrcwoObe0AY6pgG1CmDETlGgQpIbNRgtuLxOkiVPOuJ8u36xfu%2FUWes4Cfgc6xfN%2FZcmSDNLFGksNoV1S05ju3l0s%2B%2FHYa%2BEjsNawaJmUdaPP7qzx%2BmSYNOQ6m7ycG7%2Bqg1qkgGPbeQEhn%2B0uZDrnQgXZFMPvpWySwkNiWY4swymopnzx%2FfXjWiY0bRzshFbu6vsERPAKb4xKGXJ3Dqr2ZTiss2QTsHv42z178IS6cgv&X-Amz-Signature=02e9263bf199da990727c8aff07b0aa6e7a550f91d85acb02af77b2d11abc616&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663XCYVFO3%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043749Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmInglvmF9MJmQQWTjGKGXAkwFFhVkTPXmsmYQRCzIRgIhAIZuxFM6N7ZftX1KBfXgoVFk%2FI6gWTt9R0YAiNvlk6ubKogECKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgykEtDX0nXec4aqY5wq3ANzpDZxsMfhQVI0%2BgYRhMoNY5O43A4eG5Sfy%2B87BRQYdV%2Fc9pRMn9XGFs%2F6ZG0INuFPtcaVNrm17G4zsPPYdcvC%2BgveGf8gUoLpYvpd6QwacY6oO%2BLjYAPs%2BbSowaAJUhuG3cF4vJY3Sr42wfKlzmkRsWGplsu1JUyAPITXmbzuusuQIF%2BW0gQ%2FF0DhPRRXcjGizX5vO%2BbN%2B%2FdI2r5j6YB5I2RIg7DtmGRjCaqyKMEIkGL6e0RKvN%2FCfUgVlByK1xftgK4WdHTFoAl5G2C6N9Fb8k%2B2rTp5HvmOMVBXLvLEvcgRA1iuYq0PYSEYzymvKGcp3RBs9aM%2FRvPbGzgkrMNdRsJ%2B8dqrk6tn%2FCAc%2Fk%2FzJPi8hthhze0rgKI9CbUk61uAO1XA0JTdZePpi5rZJjTBEM9JMDXxl4KPvzBYOMuRzUQ%2FEf2YArjN8xbjGAxRJNl7yQGufkOezz5gVlKwrTUp4vL4UFcJZBsdgJE718TBIy1nuUphs11xK1C5bt8FHLuvvFJBxDWpx0C9cc9f%2Fe8EmeCJRJLuOcbbrvjPdDZRwH5lPHTi2FwPjmE7r9ZkVmkqwmaCJ3Qt3TBNwVps%2BnnMqdV6xmatzuJmnkfPFyKlBYFMH5QtxInW8an4pzCW5N7QBjqkAVIoYogoyBbobx5TWx3AvBsjWXaFzRfY6mcGXjVzT%2FLRnjrU%2FDT%2B25V6Y2PXJDJbqlnUMGFxjHX2WgD6%2BYPXGiHgqVSYIG%2FAx%2BL6cZYfg4nMgdD65aqyszDUU3BrS%2Fo3jFHMryDLo2VBgLCuV5N8iE4nrkigU5c9O9CwHZHH4coV0eHxq%2Fmy1A40dxnYpZiU6zFBzNIWwuAwmT5a4RNU3htC3gUH&X-Amz-Signature=7b74d22067c9dc347166bdbb754feefffc662ce61195768d493527d513125395&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

