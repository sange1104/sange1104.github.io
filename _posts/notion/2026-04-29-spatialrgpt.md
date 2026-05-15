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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ZHQ7ZQ3%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041559Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCTwsloRQbgA%2FGOEoEio8tJEaJQwOJ%2BQBOx2Gz7bCr%2BRgIgTEtIVVh2JFPauy0MTABitUZW7Xz%2BUPQSkIZEkyiF6Hwq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJFcceabenuSKNc49SrcA2HEXLabcehziQvMnYWW7h0Z1Es%2F80PyeVEh1kSgwBY8tL%2BjP9LsuLp5kOAim9p39BjdZTWlJvD294O%2BxKFJZZUDO9mLh3dZfX6KyvgAV%2BtjFCey90aCbJ1hlEeleZsvr8vlWr4rzN1z2PIxHTqFoatrS2WnJqf1eN5mPIpERuG%2FDx4bb5hBwqi20mGQHDtgw7Vw320adA7Z6n4I0E0aN39%2Fq78n4Q%2FzWN%2Bar3fBmfAvdOj4UjvgyS6PYfqdhcfqPlHoarbrIhr60Rqn6z5teyCepoH4EGqonG3HioFwlXS%2FyRnw0syFcz9AldIvIu75CH8K8NXoYrn%2Fe5DJrDiV708MjPbh0azRFVGfXbqtkJvAoKto%2BbSJSfnaAubG614Ecu7iaUEt8fax3AnS0QLlz8mp%2Bz2g21lVtaL%2F%2FxN39Zts4%2BrrKyv8oHo1gu5MyGRC9CDrfNruDU1pT6u650nT2dZINk%2F%2FBM%2FliRG7ZxU0n1%2BaLD9ODG6GLQXog26fWdmLrAO7UTyfD4Ymu1yN1IbdUr9HfoQqP8u7LR2lCbRB9ppEYOecpeyiWAkRgYCi4Ip%2F4ylQmsyCZlw20%2B%2FeYkOdFj1cJ%2ByhJNa2FXW%2BIev1yHwW1ai%2BRIHBTkOUpqUeMMOVmtAGOqUBCNPQPwirR%2BFZ6COCXjKKMQOppGih4l3a%2Fdy0sznbJQyrhHNHyl%2F8X0LFeoTnl0%2B%2BgAPsa0vhPZOGEUHS2qmPmWA3946ezoyjLgYHfaheJSmgQ1AFmT1uzqAhzfeSEY0pYt7vEHlaQWnkJuayydalN9mnn6H8DVt%2FFXrrH7qTAvGrB4sG01XEamu3uHR7AAx6OqPDNwmkNgMOdQfIuOoNqOHAreJk&X-Amz-Signature=0fa08afe36c38d9db6df9c48232a6ee34f9dc52c3c51aa24d1cbf9266c32cb7b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665BCZPG6X%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041612Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDwFlZQRO%2BG7D8m%2FGk4V7k74K8kpLBniP8%2Fw3c40wou1AiA6DPZRKor1f%2FDaz5iw6VxL7xBDVAW5Co1maoO0feNYOSr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMBAkSU45WSsMfgwBxKtwDHjSGuF0n1b6VvyUtnbe8bHvehGtnS9NkxeqXNHVUoR83O5Cf9GoyudVcqim3sWXjv0YjdIjJPRE3%2BrDySdj5ODi9LjVTr23hoUTEHAymlgW1oiV1WcIePUIqUwL1D%2B8HkHEARI8uwY5rkqBkBDOu46zY2pjK8pCBOZd98c8plfv1rE8xf951y%2FyiVOgr82UHryKbF3psKMD4JUuW5kJEWgavQuA83RE8%2BzygLLGz%2FAEvRdSRi3OJaoMlXIJtA%2FuxMdiCyq2qeJD0uROWgsDagMemCqxCnh%2B2uZbiZp6Q4U%2Fw7CcJXhuUSS%2F%2F2c7UOGBPBIsaiOUBIKYkxlJauQabcaepizYQSiwsgpWLXD%2FHLqAxvOe96dLblZyY989nd7AUm0j85%2Fz2zCTi%2BWvkwrAgTITKyHQUy2f2DSD7UrX14fr%2FLsYeQR4ZRso4PW%2FNfj12lFa0DcFWTgqZrKA5x%2BKOoHsWiOMDDTE1yO1iAN80mh1t6UaLYf5NuAs7qksfPVfCw5eHw%2B7d1qGQSAtdSgB4RiaJ%2BXCUVCZlctICrs2bhk4IXD9Nu3Q3XpdgekObnm7sebhGAMnPVXDWYfTgDnx3%2BFxbp2payQh6qvw3133C3t%2BYJOOkJMVq%2FG81VyUw7JSa0AY6pgH7BJipdmIDG8oa9YZlGb5Y8BK3rMEMwtSapUZsAh6lTjQIFxUgN%2F7Pd%2FgQH3JmIig%2F5cgiXikIE%2FOyECJqmvfyCnPfpITfWFTfar0txSMdm%2BTPIiIhKHlQFwAUqQcrRF7b5dXbf9PaWw9ThgxN0ISwJ01%2FJR%2BdxeMGcINqXbxvkCIiq2lW6I9HJ0dl8oyoLa3puW%2FzlAiFjPg5Llke5t2BCAFcCqIE&X-Amz-Signature=df60afcf39bce2c4deb183d323a9bdf524646882bc515c49a6ead217cdeb320c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46663REBV4C%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041614Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDaArZnA9rfPei9bI%2Bl%2FuYAv8N4m4j73Pd41ScnKuXDFQIgUshyHnYovSRXaa40cAZpamO8ZoR7Ao580dazF5xUZ%2Fgq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDAFDW014mtrH35nHdyrcAyNCMaSL1EbLbQwJcZFLmOuAdyi41OziDq%2BFJ%2BgH4g7AMlNhhXDhbf2%2Fg2LwyCgP4WxXnnpkuoPqH9e1noJPzYUS%2BEOMSfaFJawC1X%2BisJcg7uUjhZkhqu4zxaRBDTWasQeSbnfcUXv%2BBeP33eGIEvrBR2W0%2BT5H36S0kLnMUNiS6PXKJgBuJwl7g3n4atqi8qFUK4Y5Rs92WgkZthZvoc7QbgSGTi94BUPsVRodDDRZWo2VYy%2Fw5fHl7dBuQbybVU4f1xNCkWX0xMbiYzwI%2BDztq2665%2F%2FRc%2FDso3T4boEKnFsxF7U%2FP%2FUcwqgNj%2BSrptxT57RdiA9%2BWPex7fnkBt9hvtqfRjJ4qa6GzypCqz0mh3G3bXv3l7QoB6Wyu9TvKL%2FA6KHzxq5mSEUBILfQE8FpxTEilamsuYm%2BAFN%2BvushB2Q7sLvy1hYwZdrLFK34N%2B19Au5woeXp2cKShHluAD7w4o7RVDQdZ2Cvq6It%2BCxXiOqNLehQ1dBlIJuLcp66AQJv%2FnDgGtV7kdDnxRcdMI%2FXvtH45kMXtAoEoAQ%2B6AUGCyspoqAE194jGzhdhaBQ3JaqjDTCPRZygRalxLJJsGGP6w8058YCUFmvDJBIjacmoqVofQ2qXIozZ%2BtIMICUmtAGOqUBLxDHiY53Bx6P595t0YHRFVPz2JP2LlAFSqrJwpwBlEK5Jhiv%2BiDi8D%2FfHAr4LAGWmsMAVOQz0zG7dbMliAAwi16YEAgCP%2Bxxta%2FhgiUTqNvdsG9ah25BDQSMisVJ73xqTSgDRTawbPYCDVBQQuyOd1BpErqtWl1MZf%2Fv8Rfox7CRR8Kpx63K0spDqxR1StdJr6TIATEKOnt%2F54%2FVruQA9ajW3NY7&X-Amz-Signature=8a205bb8ba036001a618c56b2747009a230e90e5c2763d79ecbd9222f385f2c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WIM5R3G6%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAiaTIQpn%2BwseRCUWC%2B5FFouAIQ%2F1zjV5WRcYwQtWfKpAiEA3K%2BWlOMBBhS2yBylvTHw5IaPx8bymN%2F4xHYv72zcaB0q%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDACo%2FxmYf7ZpdK2snyrcA%2F7ae7bm5SzafyC7AJNl%2BrupPaRnpTfol80xztNCcphrds11ed6VAq8HEs903dAwlPOic3QjM4vYjjuDavZNcacUWLIndz8l9OkpIz%2FlZV3vgyPoL0QYlQBrSIZUkhsnJdT5QjOoH%2F36ZPPjAK4xCP5Pu9x8%2Fe3EwEX0Ks%2BnBaty2SfM3IqeE39sOyN0zHphT9LUr%2FSDPLgRIPP%2BLw9jvAh3LkF%2F6bnAA16yPiUiIDmmvXO%2BXK43%2F4pemHz4xqw6tatZhavNLLrXkMD0%2FsJICjF4foU6FpKqwxNDJ381xAqDTgo1EE9FiADmvLSb9NMtSOX%2F1ckOROqgW0sx2LrLVbX0oIExGl7uiPMej1qomx1cgaTbkN01sUqQpZ1cMHNtys%2B%2B0l%2Bm7f8NrAK4WhZSJDI4hqn6zSrLmX%2BDuuV3zX0zYDI3IMtS9FFlQfbkCH%2FqKDk4foQSpLWPYMCnO31nxmISrjseP%2B%2FvhSTQW6DGWlaWrI0lVqRVh67VQpS%2Fy2%2FBdBVN8NlYydvuBLfskZmta4lF7ixwA1LsMk8Eb60QVlxgY0Jx%2BLtAXM01g0uccV2v6AZu6rPy0A6c8FrVzcEnlgbTs5SWf3OFrFfDpmFolxCqvwk70nomPk9TxAfOMM%2BTmtAGOqUBxEWDZuIdav%2FPxc7KrSJG%2BZP8K1crpELcOTlB2UfM8F8hPi270mML1LWTaNlJoDTYVyjNCIMrXigM3np1MSaZRHzZvVV%2Bw%2FMsEgyrdxALKbgZeUIOrIUpnmrL7odcUa0w3oOacr2XsCMv8tk%2FLzH0JD6AlBq9y82gq%2Fo1umBIVQZuipcssRu%2FWYq8PXdu7DymVHffQS8sOyrOc8%2BOTVvXYI5e4%2Bb%2B&X-Amz-Signature=97f865ca37f1a356736a1c03b6866bb0c6b5c72002a7b6b8287c26aafc1bd9b1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UNWF6YX%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041618Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGIqMjGYtNCNMMF5j31SZjCtVf%2FsQigFD1JONCyuwLWbAiBcVvf4kvgC1ZyeWcwbe1lIWVrB45wnBrFzUQiaaiJxQyr%2FAwhsEAAaDDYzNzQyMzE4MzgwNSIMorFsu8rYTlmmBqkoKtwDILlXoJqkjfiMIruJ0QedsZBGnzy3k15OOJN9FWM%2BvQIG7DMPmER%2FZ%2FiTsSHofhVrDqVQHDSjN0TN%2Bbo5UrCvI8d%2F2zmAG5PZFltKEMUewr2xhh%2FHQmfYTEeOku3wQ0twqEp12eVJX65l6iiMazBUCsJlJhscSPSTJmecthk1Xd4wXlrYcsvhm0H2HSSIdIfW4wajn4KHHbYzn0KBn8Ji3jcqu7pZIo9Cy0x8L1BYEKw6E7R1SlK3LYYf7K61XlXhIpWwVJPJTguE7DuEhi3aDX56kU3Mskxkp4fyrIsLKxTCdbEt%2BQ4rsUIYRfGZmoLwkPANijvCUxzTRAwnJOMb6udrXef73SgnBj43J%2B%2F3p0XxWa6%2FWsFY5KR%2FmOkN%2BpdVDlbtqb4wwLeR8LgPUOxE2DJp5gyOVpaQqsOabejfRG9xcdu62PYi8zMn%2FF1SEe0ss4lLO6nVOX2xZ3o59Xu%2Baq7nIc9PnDBlKl9O2xKyRCAwfijOc5NshzmB55meX5nVvNXyf6e6RAUEYYprNWwlgvpQftOuPkezRJ3OiZQaz3FJ7luVwMeME6eZ8Ruqc%2FmdVaiNP3tC0qeFOyDIdGV8o35JcpuJtFRojNyaeljF58FXULJe7ZJRPTu2OhYw0Zaa0AY6pgGpTpkBxFhKBbho6L7WeCdTFGfzwXkmLkG93DCuDvh4sPtmO7k9PSWRtgB%2FgfeRAKxJycCMagnTzoX3zf9Tz8ss3kweTVsH%2Bn7Fn31%2BGEuUhAJiuOthCxYhc1H1azyINntbBVA5ruE9ZRUaSVeuwMDRXue2G7O%2FCOY9aFdj8SoWVn43L4%2FBd%2FEIc98k%2B9gasHu56k%2FZvzykFFsqJA5JKNNdYaUN0CWg&X-Amz-Signature=feb0335aa4797c017e722e23d50de3c5c25912d5aca0695f73c980de7b76ab34&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WSH6GFDI%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCfEGdC1bDi1aSm1xr3sanGuFJMctffKlkxm0gcc8IygQIgM7L3KJxsc0Xo9x15XhjfWQ98%2Fy8QS1OHOfG3zuMdaRkq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDJdNfpsTL%2BAWDO50FyrcA4JBW1v0sY9hScT1noNAucAMlr9gDGkQ7LSSz%2Fgas4IcEFgy6yKcSiP%2Fwv%2FUp8E7M0ObAjgtit6bWQmJJs7FFSu5kDNPbY1ID%2Bw5b%2B8PuPlp9j8dlT8PQX2p4jhnRdhl%2FJNzRoW9kzNX4xpyTXcH2K6WBfwCXlkfP2vJYd7QO9vQTQp6kSnCUbU%2Ftw5GNj0GcVoaEgxZLc5pQB4qlBQLU3xlORT9AUR58mAof55oeIfZRThlvrI%2Bn4HE9lLJVUjNWsY2JulVJkUkvwPve4nnnrCr0ur5ZkFBcuD9OtszESDgdzCcts2g2sHMqdsmOa3s1lo4LxMWlx7To%2FoVQwy2MQFE4AJkgsS9Jrp1erfdQsN9A4RP1qvHnWC3PZzwUPIDszJT6HhxBS90HbsgxRsP51c%2BcX%2FLe6IOG%2F6AF6EGW5Hr0XnLil3589Vm%2FX0DSJfhP4QeOslnbcsZviX1Oi75gqqOh29O%2Bk12pfP1KwIwq0lokG6oDln48dYBzricsBJMLRl4kI7zbmDOHFTBd1cVvwkwPutTcmP6oYJsWNU3kKPnq5D4UdnqCxbpm6bdUvXyYJwdbs0dD1wHCU%2F7AehQoOqBKpHBxrJMNdIRRrQnsRckbZcQX9%2Bn7zDD4WHdMIKUmtAGOqUBsuYUKNNye1BCdjPf67xsGoBh2%2FT4WVw5GtHWA87oasq6a0JAuK3cDI0ZCcak82O0QPilb9vNh06gVTJRQa6AOz2%2B5cT6vBQa3chWSxQAkEvqeqC5EjS54MnDPV2G0AhjR2eCZ0umecY4maO9493wPGmGxhVdtQjeV2vP96IxsFORTbUrYgvosppDL4QmJaMKZWo72OuZ%2FK5HLpTHuslaDks68RWC&X-Amz-Signature=6ac0620b44828f7d29aa5746b74c12eae087e21b86657dca8fd674b4cbbb7fe4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T6N2ZFOO%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGjsoKXfBLDpfF5ehzKULp42PPd5SyC7LcWRUzSYet%2BRAiEAkUeAMqvAkMX%2FC7SzLWhu0EHcvAqmWe7QIysXN78YWYsq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDI251ovLj%2FU4SBTRnircA%2BfmuYxxe9qzOBfzMNHdUEsG0%2FIXnl6v0qIWqcPKupmwvQksJK4L%2FhuTiK63XRrXHYp1scq1Mf17fAljK19JIQxU2vW7ugDHJH66n%2BwQonoLbLdTT6RArATwaF%2BVgqv0R0KZq2jvajTuQN5CrXBLBe2JLo31bkpisPk8%2B0N8KSJP%2FOx95zzLAenKdi%2F8RlJE5xcqLEDRzQoOr0zPvq4kjX45fe%2B0SJ%2Bhy74EVSoeSHMKtjXnuJNAysJJ40gqPPeuzb%2BVfI8ZAPW%2Bulyzvtcqwz57%2BHB8nz8U8gWpw1KlvGlQBaSoPOe0sdoEM7EW%2BMTxI0C0OTxLsdktltSZCjyz1D5gDC0Zu3j1dBYCWHCnK9dFAPsd5bUJ13uW%2FMcts8Q60R0vzSdSZshpMM6z8bSlbXgHCp6br2%2FlBe3635nlsBqqZJwuy%2FW5HHFWQqnIruT5JLUD6mbZ1quGSxib7e7ygh7WB2s60Lo0pxyFjgcb8G%2BX4BoLxQuGTkcyTW3nZcMrFuMPxGKQTaxZf3%2BUe0lAz%2FDwMLdt2SLoQzQLN%2BNCyNVZ0rRDR%2Brm5Rw37hLokiGbrvaR3iIdHScwOoBUPE%2B7s9pfjkONB9tvPH4God49bENeV5DCoqTu75a%2F44VdMPKTmtAGOqUB4h1WYDi0x5w7RZlAI0DtoW3Pp7PdVGSoKOhnxuSqU6ohmX%2FHBh1%2B%2FvhE6i5WbOBjNuOwX94BPxEZNAFftlAqW5raT177xd8%2FUBUvkMq7%2BIQMBtpGrYHOQn3WLhYyaefVaWZYPV3VFH9oq6AdmlKc3AugwnX5uTT5r5yKAreVoQz0PdjxL6ZMBLhjwYAQuRBo4YPcNtIVhFEkXtHLxA6tIWQuNLxG&X-Amz-Signature=f57b066d18ec919e91deef793ea9c671c779ed5134f6a5236b394380c8cccc74&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662MIMPWTJ%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041620Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCpdJDseRPO65e90WA0YOFitVlK5xjdphImL1h6nNtlzwIgTH8%2BckK3WyVCza2Ka74ZkFvwK2kHE3227cPowsFJpuQq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDEx3O1l1o7Ik8C%2FqnyrcA3S6i2hrYPWJIiCJ7%2BQjKADFAcaiBWwwVoVMKe3BlD3CphwEe8Nfd%2FuRTYI1LwpHU%2BKv1m%2BxIGzmvgKorzyTD%2FASnUCGRb3U%2F33XiRyY15w6qYsRdsnpgTrv9kZqELjzTRFpRnpCBiM4thzBPEKy8NfVjcMdX86sPH1IoLY0KEcC8NgnyEmuPIztZLp48Q8B67xjGcf5v51M%2B5tC57BVpjWnU2y%2Bewc6Oyb%2Bk1vtZxe34GclOrEtHI%2BLd%2FLooxzxJNLC%2F4q1scdrfdrRXKlGsOVxKEo1JqtkppmilUDnxz9JivrX3boQmEg2%2BclAsROOJ1TVYiVcCf5yhIp2cm4AUCOQOKVxvxpsK3xM1sATIXAaJAVTqWFWdwe6qveGLtvgNkDIgJeNvkHB84BjkY9Qw489HARt9QmSZrOy%2FpvE2zqQQWwSnspD79eetYVophjrBBrLNxsXtqPI9hjmyjN6vy9X5aPukbp0Z6%2BsII6%2FDK8%2FA5J6l%2BVNcRqvBZiQz6YFMBETWwAIj23feQIKDAe9X9LIePLzgvuetFZDnBaTKpi1EYKP0I0uFLeAVurfk%2BAann9xTuAG7W86G923U9JgvSAlDjCtTQ%2BkeaEzHH%2BCSp09UuBXmcMOrtvLfx%2FRMMuVmtAGOqUB327vpJpbDipyxFKC%2Fzeza2Odpph1ltNoj08a1FB6LI%2B4TdX%2Bx4NQrv0253KZrKYgMnMP003RUR%2B6f860MtuqOysTVnwWoiDwWL9B3GHP%2FmcfXZbcpNWku8vzEJN9eOQuufOH7pGfh7mXxzmumtb4JLMrAY16vjxmD%2FZIiOcNcvVL0DJUZFuYWugnTh4d8%2Fo9fmzxIr3Bldg9Rbk6U9JxByIVt0wV&X-Amz-Signature=ea09c832b18df1c1635e41620af3cf64051c45eb8b6c679392bef0433f35caf6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIRWL3IP%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041621Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCA6ivqJEWcdHn2ozl4NuPzEr6mgOF%2FrYhRPPpAmyeFbgIhAODYQAFruGP10rlV3yGVcreh8wi28BfLQpC2CJGk1%2B0xKv8DCGwQABoMNjM3NDIzMTgzODA1IgwpePNgfLloT3tKkg4q3AMF71TVs8eyklxioEr09goRTJwsHrotdFBUmW520ro1dklQp6FJU6NHnPEuxZaAmfh2eUmp6u8RE%2BI7aKmvknudh1liNksvFTaUYSi6wu%2FTKC9S%2Ft4CRuhUiWHIm%2BqnXWCATV%2BeGwH7jIHZ7RrXXX5FbAgB3s2x0Wrd40y4DBpJ97fxOcV%2BVsZe8lTFQ%2BTQJkiQ5hRVoBgH%2FCz5QJqt9fiXF1EUbRsMx4HwHy2j9kq1snYuZOuIckDzoU07bO7a4GiJQ22h076ZFpC9UElSmtuPL%2B9NSSN15Ub8x1V8KNCdkLRq2htQYnu7BCFr%2BDZgT%2Fx0X7r7tRqPIO6JfyOSPZA8cZ0peLIVz1sh%2Fbj9%2FgMGUHb8pYFj7iPMTsHTlBdZR0uC09xeQ4r8mh5SCu9o2B2hDPG3vMAthR4w%2BccFVjwPF%2Fx4GbUaAKbG9Q%2FDocdZz2f6WD9mXLC6Fo7zn8613NLj0vI2iBf7unGlnuEl8hrGpG%2FOkFOsjJCu9JcwFRimKAaTnODlBL9ROZFu8FHaO3Df8xjg8XcQR6nsCA8JYXOsjTn1eeDH98yb%2BUenUw2C3FW45W6JypiJLSk0%2Bw0RtvqT%2FAv8UKPSmYCAwbv%2BuNwfMm38JcgAieFtap5FgDDrlJrQBjqkARAZlRMHMFpLWwfI2yj2dsrK3YV1ko4clG1yNPrFqr2ouiOI%2F0A34SkkZ27wNH0FOIj74WckRjBJ5bIBKDnHvCOa4u6DdYxe5NSzTeNgQou5RrCna%2BIcyMwgvansUMzo5x4ehBT32zKPcUPtF%2BdpcX77gjCWvkif1FN8aVESVKtwDFCxNj%2BqCJX1b5zeBdFmhFhDJ3wc0gS%2FTNYr125ifjzXtv83&X-Amz-Signature=a6ee2883be07f0c241fb20efe4a729541ac3b64c0b9ff001e5f56c7c04275e8c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MVVTM7H%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041621Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHWCUGOYtu3aRQNlriJ%2FQzl1bAlHytXM60DBFThSl9RFAiEAu16FaS%2Fh96ejw6m9vY7YzyucYGuyOR3ibIZjRaUGfdAq%2FwMIbBAAGgw2Mzc0MjMxODM4MDUiDBZVvCnvSkWzuxua9yrcA8DIg2ZCiMH9FU76ieK%2BjpeSUyxY1iF7qhhgScdg5S5%2Bz7%2BRj%2FqLvhMsqVwet2GcJ1Fr7cTA92M5IYDFVWlHeoR3D2%2Fb29oO8rCVErZnQW6PWDTI7MJD623l%2B4Ni8IUAqW%2BYDDvfaJ11S4ohta3kVXeucBmM8SB2GsPM0NRFQdensyX%2FfjzGWeMnn35M6xrF8gvncZhsui3SFMV0SzXEYRt1ntFz4LOV5jDfdhin2u6pzjZftHBAtd8zmps3O32WvMwXd47cDfXt5nE7ZNiCMzs2%2FGjEqB2luU8fSg7wxxJkv0LqbwYa2TQ%2Fi5HQaTVCwGIyVwNJOXtBwQlxGPqmKmY5sopMhzXPu9PkVxmGxAlzSDQRSXx4%2FNn3bRZB%2BQn03YYOZaHFkp3bhsLRcsRCsxGtXXfwftaIc3h3VwH90T0GerRMG%2BOb5kjVr%2BwFInBcNaJ83PZPrTBbwRkW1UOcxzJj5lgEYZgBdgEW9XXagX87wmdR9wMwd9uJeGnEPBAME%2FWXrj5uP1SzjTTKugSMvO3WMFbVJNfkfdrKJd44V68jQs3PmjX1fUzLhb3AfDlzcmPVOyC1RguFiVE3zqBtbqzKr4BVp8Gi4pB%2BJqENAQnVxaiuvRblAIAaN8iCMOaVmtAGOqUBiA%2FWkoj6vQZn%2FCiCPvsv%2BnBPjcXwVmHbGmGa1knoZjIApKp%2BU2n8tJY8yflkCcG2yyVPRN0lSGm%2BrxhsgqdyfdiBXuxKwYDsRhmPIZ8ETvKf28euGEW4f1g29yoWpGCnJk7aZDRQhN9feC8b6pDPqJX2Ash28wrTY%2FRir%2F4D%2B2Wy5xUGCOlD%2BFflWanxXmuIZMAsHfO6rumDFXLuqOKYeFJxLkN5&X-Amz-Signature=913b76a51bb4e13b38dbc7eb5a9a06b82660cabd2ffffbb241eb271e7733b987&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XKTCWFR2%2F20260515%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260515T041622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCHu17QnEcDYhrNY9tHUDbF6fgSqO0BcDv%2Brnx%2BTa3tiQIhAL6Zg8BW2hJfo5AqZJfgptO8%2F0cE%2BsE0AHttRzMc%2FQ0yKv8DCGwQABoMNjM3NDIzMTgzODA1IgxwJ9K%2BdqaoF9XZhkEq3AOjti9yg0zPDNtATIxXeX2mFBbfjJwjZ%2FZx3p17ogS1xKGCCFLAi1ep2%2BlP1bU5X8rjfxtXn3iloA89wKGJFfy0NM5LuYjK7%2B4%2Bn%2Fx3B2FCg6CFsRatTjABQTh%2BAEjstDHYZc2xeNyzKPep8hy5v%2FJ8Mo%2B8N8aTXiVupSPYos34pe86q5qTnOVOkqxTcpHKjdkrWjer3GXp6jsPgRXqBHdCBRHfH60LbTTn6v9125riydDpqW8gzFrJlqD8iXkigi3gwCTwnRsqC8AFGkPT6qsazKaAL0SZNiJg2e7rhVhIFTUir%2BDaJKcj5cvla2B8C2GebETamQRSj2AcdCUipuKCdG9PWi%2FGwpewx6bMhFfJ5fug2gsG1%2FVv9ov%2BxdofK7%2BnX0IeK4lLVApiwZQUuLfKxzh8CblMm%2FRjC1UlRICC1LME1%2FyaZ0X1MBcaiusFtt7FV8HhXFS90CwHgpb2hYM2%2BI%2BXHYYRVRVnB01ZQU3yZKryEbjXZigeiVJp5bqwLRtly4wB5Utvr675LneykwSVagjuD4%2FL6Zk%2F%2BJxAWyt3bLh02okEKAtE6il5V7xBTSA3hvEJ0KIpKvbSYSaSOQgSHwIl9GEWur18CISl3t0JogDvg9sLNLc45FlywzC3l5rQBjqkAdDiLbcAQIRq685PXhSJNNmg3QOQwf8%2FhF0W80SO%2FgMgmcT%2BarVpYeeyX7Wl7nig6EY5l8SpMAA4d%2BBwApwvOcTAIoQW7Sz9ws9NSACRGSB9zNwk1AA1%2F9dK4Fq6eGBxd3gVgDTrkQ53WekUBT1XcElSwQlJMtXc0Ch2O%2BkrfMjCjVCBKcAKZugWDpGkrb6XKHeNBq8CwyUypzqS7VK07oeGrb2m&X-Amz-Signature=f67113a57665b020341f235c2ae3b7a03a49b8154a82dac0b6fed1d32063d26d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

