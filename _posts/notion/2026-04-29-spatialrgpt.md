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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y7H5VIJS%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044540Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFgL9Pn6LkaK5GpYhdoGXG9vnIkhGnx%2B96QQGSJD2L5EAiBQZgf9ZrXnHbMAD94hxIKNGS2efLGFIOUQPi2aXc7Z1yr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMeGLR%2Fe755J%2BW9mpPKtwD4Y3jR6R6N0ifh5Bfx3DlHAxUqQ%2Fn4rflz4sfDDbbzVanBy9WVaHhfcTEqKV8nJ%2BfqBUbjGG6bRCcKfdgkpjMRUM3loDj2bnNcqZBdpkX4VhzgX31f6g6lh4WXbZuIZEtKqKOrUAxa1tHcItXP4%2F20DxZL2jzT%2FyC8XWV0VJHZSDivXQJ4fLxBXYpPAff4DfdKc05aKa%2F2BkYtt5OhZEDNJFrxlmPY31fQ2TprvgDMVEAqake2TR2%2Fe9QJ%2B6%2FExsAZ%2Bvl6QQZmvrFHelNvusTG9bjn9dkQYNZDFdzrMcERsx7Mc%2B7BcngyttmIypy%2F50mRt3byd0vmYGBKGm6r92g3cTJfef7uzSPxKB5XqjPoysuIFLv2K%2B1e5LMFSCS8fk9Qso0FeTGi1oaARtSRS%2FfH2zf3aayHKtfoZ%2BzbODDeSdah4n%2FmLnfL%2BAJMuNFghzKz6TSQRysHsacT1NruXBc1cIluvsW5KzFi01DDie3hXRFdk0fCwSZb9thrbXJYhPoQtYqtE%2B0w0CkVXE%2FXCZIJZW86B%2FuPQ2qDkL7gvJEiuhvyJv847reb0lmjVE0lRZxIBsviYuqY7w1weWhNLZeRNzHj%2B6GL%2BjlIAF5ij7iQWCZtM8b1N3Q39hBTnIwpP%2BI0QY6pgHVTnqCIbGgg1HMjVRqCb9gjlplihglSxO8TQgWbral0ICQLs4Ktz7epfth3lYKKLMkVAQbYr8GXlqomoVh5fw%2BwlJEo2cTbNAFr7pyfsFA%2Bb178%2Fe354EzabYUTeEeAGyivJ8rB4X8tD2untc5mTJ0Nf3zKB6VyIFhBmTscBlICfOe5L1n4Qq63nnkkt9Z93zgYbHgXQGxSepTDesch6COx%2BB5w250&X-Amz-Signature=8bd70a5351b44fcfa16b2d5961994fdb1904fdfb28cc3c50c31c368ef8eef033&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466454UUAKX%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044544Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFRG2wL4JXya74g5nDq8eRnHbceEwyDngs3dcT6yJgCkAiEAsz%2B9Zm9LaxDrLUWPxW88HMkO8Gdphc5sC0D6Xgf8fy0q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDJ2k6bj6lcX5IS171yrcA5CSgxG6EBigTNeMUErTO3SXqcYAyzad0EmlSPMfU2EP7ibXLi4ujyIdkz6eNNkYOWl%2F%2FHVHKGmcfLaQ420BEMiM738LyYrXad0BycYZlb0BlaijaxKtSn2DPii1J8BobvvUDwZN1qDuOumFdtnbJrBWfhkhScZugzxkL3hMUNKlQiN2icKu%2BmzgaZ%2BvrbnQ37ALITp6FOcSmuyuiUdDGW9QT2K5DdlN9AzsJUetkSKl0P%2Bu8ELNxFhhgo5CqPag1AHRPFZBOXVeA7yVZGBFolV7aqLf8X3kkDUtzJm44OSmf8KQqULLrM%2FVRTuTzv5lFGrUrsv3lrsG1Aht62JWHHiVyvQq%2FbaVn1pGJWbmxUUp3ChkuLYHxbqExeftKIc6Jixrsr66l8voxqbe65SfEGzarecuElfSuYLhrFizZqYQLHBYzc0PBvoBgjSj82X3vjOLMgPC0t8Xas0fVCLUQZ%2B09iS19m2J6c8mgeCS%2BhA8oEXPuTpl2COp0D%2FHgQr7typ4jfHschHLKkYluYrfETGHZzpiQpjmTbLwR6JCJFWmtaIv8q5cZKfm%2FWsA6Egr1kst8fGQ5iFXIiFmO4RKwUVa6QaKkT4kdIWaXbHvcKRoenJOhx%2Fb%2Ff3dtKYjMKf%2FiNEGOqUBQ3beyavSWv6gjDZzJnpbPCeJmMlDsxPphiFswCs9vXPm0GE0qBtPty046Jr07gbDEMJpHw05ORgNHuPxB%2F1E7hiqKj8Km8onvmB4uUMkEEWQGlArVeZBXp2QaK%2BGZvFcLuGcmT5wxauXaTVe3txgWUR1BHXKVm6PAo%2BABJsOTrGVNP6G3ckh1QOjNKBV6HYx35H5xYMEMjqMD%2FXLgE9u9MDO4YWS&X-Amz-Signature=3757bc387832411644f6b6634f07516f502a58b4e5428fb15f53fa9bb21bbe2b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQTWWIV7%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBh7lX5%2BSSHjUFNxM%2FkJsT3qJo8dZ14A9gl%2FeEzNGqGLAiEAjaAofHtrgd0j9q5Lwxq1kMt5RD4LWF2Gv%2FVJK8txc7cq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDNTvF8VgnGBhOCGZGCrcA3VKIeS15EDAdicSTzqJ3De4vEhBIP8wwmjRPE0vN84NVzU5KQOFZdg6fVWCuK0%2F%2BcZ86x4eXQ0N%2B7SlNMHWCRWsDSdCXsl8rwiI3MwtsySL7W6c7AI6%2BiRHUF8Lk%2B2tgj5Q%2FvIaaUC8iAIlP1nCOml%2BT8POIw5423FsMCqJD8lOCHW5CxQV9vTtVM4QIgHOv%2FZy4SW%2Fqi6PtKQdrOWxRPM7e%2BrYk1uFDUwn794P%2Bm3NpRshzH0bFfefOS%2FvxQftIp8DthyLHonW3Ry4OG1RaET%2FlHQhGyXru5jO5d0sz1lKeD5Mlj2wB2ubfUsOKZDPzq%2Fc197G9lf%2FuLI0U12SF3WJtKunT9TJhp%2F3pGIMElai4fhgAScO4sJ8nH4G1e4I8NATLQ%2FDSEI%2F5G1xqrzx0qNVbPtvtrCAIlf1t%2B6VLkDqA9CTWzbqD4TeblogyufpcAVt21n%2B3TuaT3joLAFo15Z52y4ehJUSIa%2FjKJP7PHY0mYXYNngG%2FVnu%2F4ThHemQYZsQ9bxHyG1vnzhRPkXXeYSXC%2BpxI5TijDbSCknnHxNoIWPb%2BamGMjmBTR6jrt2eTL3VOw9gsSxOVEfhdc2oViwFxZHNJRfJ9hnnpmPWrr3FKeUcFiBPK9%2F8WXlwMLv9iNEGOqUB5%2FAocH9MtOfZzTzfY3aW%2FRL22rc5joUCggqccCmnlQbEhijExE4bOgBBDHRIxd3I2K%2FUWFD7XmC9FHXjVhtn2BVI81Nmms%2FJSzbRVTfDD0jbu9r9rK7sVoNOHAz92fqZ5iAqep0CSzpBHjDfonxYiMTZvkWlTUqthF2XEq2vbPuT3uw%2BESeUvkYUOB4s6H8cwci7lJSJG%2F6ibmeZVm0A1Marlxy1&X-Amz-Signature=f1c497af9832538ae17b0204934aefd38a9a453cec0f32809dd966221f98bcf6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46624Y6ENZA%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044548Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBNM6YnFIxf2fMqoWxmeMcZ9zzqXLdRhLqm72CQXUaCyAiBjBUIjAcnzQeq%2F3glRM5WbjTWbRPcmfZwBi3RBIaJIGCr%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIMvs1S%2F%2BZj4GFsMdo9KtwDinOiz7FFLWWP9kUAmNv%2BzHgrkUr0cmvxLjYHtKcrLToSTnSJYGCQqB%2Bi0xJl38voElPYrx9UtPboI%2BkU2CCNUTN3Mx10FSpKexY5z4JUSYosVTVAK8XMgQ17GISZ%2BWmxbZDSXdv0iWZQ%2B%2B6ImJGZ%2FA%2BFW8o5S5CM4g3O8pMCHR%2FdQS5%2FgALloSmwKcLLx83lFUFycAk40jzVsH8u80LIGQ16Puwc%2BwIScuRUxow4Fh%2FLZvJes1dPZBE%2F6%2B%2F7A3MZ9i360GchiRvUOyAfiuU%2BK260h22Shc1BVT2cjNhTOmwdrwswFk1hO%2BWpoijZZTvxUrEiyr1p2nnEyqqrPghynazCl0Fg35m8XCHjMH0kYrzwUnkXEKM8HIXynzdPCwDI2HzO4zBzCDHyiRXEvwWKNjsnvbXvWPfjxLyjTD%2BYJj5LGQbZO0nGio1ySsxkkB6igozSHeF5pA4gHMw7kVpJDRWfob4dMUIEFsKgTXsIAjyunQfs25urvIU6rIkkgCQTKn6rGt%2B3DR9wGjsWPd3PT8NmCf1yfDV%2Fk2K9a1bQnhHQwCbAQ%2ByrpehFqJT2wWfe71Q5pTzlQrufNXsaj5Kvx6kmF%2Bc5nrKGfHDEL4th82oFe1gyFwP85xSryrYwyoCJ0QY6pgEkkChmej%2ByOLxAmapVvtJsLCYPIStUj68CxfW2wZiU8GyxvLORq2DbVS6OAirISKTSalApxy0PWR8nMbSJT8koj3Yy%2Fx2JN3yq3MFtqzv8virE79c8J%2BdEMrpmdYws9bgzsWQkKrB14yx63lC2OZhDQ671jOSouPblG6LxIIseKQ8zyMu3PiLbyAucI0Rsk3dxT4dmCeYi2vj32h7OH4J6L8avH0W3&X-Amz-Signature=1eb65714b96fb402e15e8f9a6cab240a399f526f634223ee80015bb490bd868f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QRQMATWT%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044550Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCiyQhC8vFnhf%2F5VUEMyYOhk8OWGMh5nHGM5atmmjl%2FhwIgLrbHh4c6ZV9Zde5M8EiERE079465A0WAlMTIBvkqUTMq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDA0nxDZbF0h0tqe2ZyrcA63y8mubNV3jUXqKdhIm9Jz57fmLN4eGvhNHkArs51BY%2BCIz35bUUjghQnR5%2BZ61KEpKSt3AaBXKnlyMetviBWTr74xzRDgIZQlRPqLeaWJPYCl4V8uLWQDFY6c4jofpcBdbNsONBxtIi9YnYJfBTg8SonEFVZjwXdP4TKVZE8Or7t87FVOXiY%2F7ylluzGlM0BWBdx1xzkTzBpQ76wIRtVRqP3UwWlxsH2%2Fy3Ds0d%2FpmzLBcREuBHzdOGBVGrZkRjezIW2uOwBiTmY9z0%2B0cMiQZEQkV%2BMSXiXFx2k0goQMpKgdPwE%2FvEEoAi3dlvaDT8K46Ejh8pzgRQg1u%2BEYus8GBzPSGvLVtLU4VDPHSiDWLKuau14vkKygGvekmoI6hw8CD5Wo8%2BzdztVcCNeRvrFF%2FSFsTfcgpDewpQhjAYowdzAadIpbipS1XBDi5L3SluKIA74LYPes06NXOC5hyZkKNuepSoFS0ijWoz%2BsqYgR%2FhXuRCgrUmgR3Nv24Wr08CYPGfW%2F9%2BWNPGC9sXOilg%2FfVuO7RDJpYyYx%2B%2FQtgzJ73Q%2BmSt%2B4NOosE2noxf76A1pqBGCjdBsWHixbH0uzkZJXYZenuHwX9YCTwdnJ5bj414gYzgROvr2puZaRkMJL%2FiNEGOqUBM0nRu0GuS5F09HfKFfzkKM0eeKfILbSlwaG4PqvniOVvdl3BPyGauhaztka9V9G5yfFmfDNwvOmglym2sMcy9ug8W7MDGLF81hilgKRYP%2FlaDBwR4PzWNhzbyDOAd3m%2FCD5KW5RPpjcC%2Bpk9ec6TsIaK9PXYF3MHGr1pb%2B%2FvBhyn3hDMuY8fjazTOF2AvO%2B2FInjae6Yx8%2Bq7HHPFO0EeXJyzkDN&X-Amz-Signature=ebbd0871bfaacef556b5beaf6f25f210ba8c1eabd73b9d90b5075c17adeec237&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZBQMXSQU%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044553Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBlQa72mGrbLKF7Wro9VnMIf68PEp96umxzRr9aFBRWhAiEAytu%2F0pGcCmRj9Zkvuki%2BdNMOinTsyAiFbP399BUHga0q%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDPIxBuqTH0LSD0w5mircA9WnMXMaaAJmRYqhZf%2B3qLlewGKuSn9cvqfRvytJ28KYCUR6aV3Wx3FK8sAC0z6HIGFqpczvp%2Bgpk8ucOugf%2FKYupyIchRHZm26EeEtro5mdMYguzOWdpinysqOtPSn%2B8mHNgiuPTV5x60CyC3KyMQyCIJ5HtPUaJor39jPR2ySXZcuEQTnEObqPC2AcfCxZdRELqhsuMPX8a58TSV35IujdiMaK2ZINfMuYhEen19YjHDVuCUVm7h4Bd5uwvLf0Qyt3JmtLE8eW%2FQpj%2BuKJp2wPI2%2BssFXqC%2B%2F5zRTuGck48aCf7vgGZfy9TDHOZHaglStBFez1wJK9B8N%2BhWrIiMMfMFkHzmUNCxvN4m4aLJYevubsnIjU2vO5kzRH%2Ff3PBXJMI4WO59DHkr%2B38s1XybGUvXAUP7%2BTzfxv2juux20LDsWW%2F8eMmIYjMGsUrbUVtlxKrhkrC7Lx%2F3fsy3qkGKxEA%2BUpvK%2F8yiLjrK8J8pVvnLwA9PjYkXRye337nejxRgcAfXy%2BY0OHWXdKtR0JxgSSj7y0rrHhhUSTS5qf68wxpVq5XTX8Tp2yoCxBUePyOLbXqAgDx0lP9N%2BYOORr%2BnBTcRF%2BD9Dmk3j9frwwM8%2Bj1f%2Bhc%2BCOS6jgWgA%2BMLb%2BiNEGOqUBqDvfgULXN%2BKv0ReKNIBUdNHDT46DLFOhcM4ZKY9uESTSd4moPdiJ%2FBr%2F6mB7Jy98SQ2CSGet%2Ft6tUkOPahyIgwbvauC0IubbYe5d%2BaFI5oxcqsfBcVSSWkJZ0oevPrDrPkFirce8JJIpztegqd78tOvHx4fWPZOBdw6udY5XfF2JKnqrYGmKdF6O9IOf8HLieMZAWtyOEbzjF4ItjbAFhyO4vhpo&X-Amz-Signature=28be19632938ffa755235fd6f8dac700079f7ad18dfd98f0177a4f47ed5fdeff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RBER2HG%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4lr5JCpeOO7NB3tjjs%2FyuHL8vD6WqGa3xKWsfKlA21QIhAJHnBODIwa7BOZucADrQUoHYsyQ6wJVmhi03Ybh1vk9bKv8DCGQQABoMNjM3NDIzMTgzODA1Igz2QxoNGi9i%2FhFvn%2FMq3AMLTWEyha%2FS%2FdT173SZVn3lxt6tNKlhNKWjf8H2wTRoOVD2gQ%2F7fy3yGBQ9YB1hF8TLyikLPgGi5chPiZYLqLDnbJo3cYVuFpuam%2FBx4%2BVij4GQ%2Bo%2BVMe%2BBhtIkQF%2BFGt8vVX0X%2FNMNmP5XMUBL7pvoWVSFLM%2F6xtSdUNzqWfyJKR9BUpkP%2Fnc%2Bm1kOR%2B6%2Byh%2Bd%2BQiY9okF4CNHKp8sGusvz3fseT5%2Foou%2FLhUUjGQG3i5lyW78P3%2B3eX24%2F4Vyo6lzVtlDasd2B5MTJW4J10%2Bjt1d3IfPXm8ljW0jM5w5NkG%2Bi6gJizbvpiRr4F%2Fvo14a%2Bwml3Tu1YDaOGaFFSwT1JaY0GQqW4JiWx2MV5F7PXGhDymZfzF9GILf%2FIbGvQmyy9DZQX9EVh0BnkJM1itdn3s4DTsZV9H9GFubEJx025RFDBQ2B1d%2BH%2FGJnouZTTbWKYXOoydTYmCK3lsFTpVr0LZZxQCrAz0Tx%2B5T6EcZUL1NYDSRHWep0vE5gir%2FT%2FZ8f5bE6Tr6wawT4mev6Kd7hL5IM%2BA%2FRrSE8Jr8%2BO%2B7VwQL2NuECNuSye4hHb%2FfQVseudv%2BagP9uxAUvYdRFgifIEweVLhfD7FrHKhi9cAfTvTIHPVCtVW0E32ssDlTCN%2FojRBjqkAfcdC1%2FWHISi1wCUhYwKqa%2Bp2KBTdFY4iU0WXSIe3CvFEq7z0F78jJLWrYRHMd917gN9fzrpiQ2m0nybKJN4LCfQSQYD3SBGqrfiX%2FD7eCqE46PpB0%2FGmphB6UmbdavYUwofm5lPXacCC%2FEE1cIYGMd0WQjhdOIgtupSbvJvNzr6YAaoTlulwRWPE%2BhAk6CtyN7fXtZCTEo82Fz5z92smqIhD%2Bqd&X-Amz-Signature=851ed916d5405699d57f191fedd54788833cce5f4a6374892caa43d12df07b79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665SW2CNMN%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBU1PBCwV2sUcUpVcmQimsSBg1d%2BzoNgYaxrr%2FY0t6XFAiBeaokw32hNHJhav6cSlPJSCOLfmUlhNOsjLUjLlJ%2FAfir%2FAwhkEAAaDDYzNzQyMzE4MzgwNSIM6RUT%2BlsQsj1F%2B1ReKtwDIekv3KqOUW%2BJ%2FuZfSpxivUo3jAHgloRMWIbfhEuGmshQdZRKC%2FlSBR6zub8Od9eT4zr%2BF15O9iXg4IImBzbdsk3tzMJCyDzMlJiM%2B%2F1hkphg1utD1aacPY0OqZukVRm5Uvh1%2FzJWSTdH%2FKPerAVKVQFjQ%2Fzvj1h64FXcDk%2Bxw5x1I70ln7gg0wTkH5mItypyAIN%2BeMz3iBzFm%2FvezrOOywNKVXtR1OKippeimHfFh8F5d29P3BQ3hnBvSa5wo%2BJfJowNA7zHCeI4vuimIOy%2BXoqaEi5OPzt8EYP4e3c%2Fm3VyNP36kKRUdul8bxShTimdFWDEV8Otze8pOB9GpbR0h8eVop%2Bzd0vA2I%2B8IcNM3B9kg3EYl%2FfFfiRh0b2TgXeD%2BCsVsnbF0h%2FDQqP8c8VYJPA2J5Lc%2BbQvjJ%2FQkdF5q4Bc3ozT8GXVbrGf5B9UE5wROc9MZMvwU63b8ysbb1UkkKOeVKXxPyX0OymgR2I9uQ3QuwZh5%2Fs2ntVUIiOFCvyPU4DzF8SWZySYEjh37EjuuxwgBAXqEf9592Z%2Fd8YC4B%2F3lRCOoDjwKyrt3J2%2BiFTwF%2B3kzXDHUPd5DYNeDftIKFzKmVs%2Bl3XEYWdqq3qeJoqBiKjpRD29sDMvhVgwxv%2BI0QY6pgEjZ5OjFOT%2BB1C9WsNgtyUuokf75%2B1%2FoFb8nleHQHuUEH2gKjzYYE7oE%2Bdul7OXZTKtzb2xuf0Se7eRsTeQme7PnBxR%2FGQaMZRXY%2Bh5chm4fhi13dYpaf7aZk1T7QZWng2e%2FyG9PAmF7wBVAgb8QseE%2FjKxIPY%2F7rvdldTHh9Nr%2Bo9RjuAkSAClZ690aUK9l4NkWZDgL6Xk3bX03UVeulPc3MuscX4v&X-Amz-Signature=abd4805200bdeba5c68efef1354af020ece681f921aeeed959aa110054e9ceff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R4UFHXYN%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDfBUuv%2Bryl4TL5RTbtdrPpauBQm5Y72UGYrEMwt8qGFAIhAP4eEN6LZKtCJq52hsVUSVu4F5HZEkhNj0OU4Uxm2SlQKv8DCGQQABoMNjM3NDIzMTgzODA1IgycDYTLi3SlQAAx2z0q3AMIiRrgr6nTDJwNeCbJl3%2BWKOR8gV5b0wnjDWsxCzUY9ChGxs7bs0k2zmkUieXZJAvEivbbocuQZzMRcetzs81Qq%2BIUtp20SeducTQU81AmuCVik7r%2BV24KW5uLAibGo9%2FUdgO%2B%2B%2Brta3mMHDgxWEs1bjLeeT8oV06bn%2Bh4X15TCZh4BKoj0A%2FAPyQD%2BdhMq89j8NZ0yhZ0TTO2WYamAARaxGrIH8MO2JJECg%2BiADWVStvpG%2FLOMxJ0TDNCqsmUCbOa0O7qdzxGRJf3qd%2FMyWnCjC6NZBtFOou0EiBzmKFIUWfKXMF74W5xg2gL7Yoz7uCfHWePMB2VvfrVLiFhp8EDQOrX2m0etNn%2FaN0etisfTsGUNK%2FEBiZtVPfgTipeFSDvPKdCZ1juLxnaSO6Q81c1Z4BFNse0FDm0bgw6SceyueCV%2BVTFAt3fVxQNruSrM0t6f%2BvRpZipIbR825vd9F%2B0Wdt2ejP7wcFBNSz9hAlZXkZGUlt5CPg8iMmIbFLYzECE2I756HRL52qc2Hy1X6A%2F0oWp5Hx7VWf0BogaqnFt5xO561ZJooRPDeKsvc5f%2FLc%2FgVMKhb1GXwWiLWB0%2Fq4faI3DjYwI3NLOD2P5Kh0Y5P5%2B9JthMd09mVXt3DDr%2FYjRBjqkAbK60FjXafVX7n%2Fu2lFkKzfpgdkLJ0mBIoEJntRyK1KYyTJIOIIpmxlwjXwisuJF5NvbTbr%2FENjajWzb%2FkEmHEt9Q6tx%2FDmIcu6hnkFjnxAZBSnloTKEWsV2N9MrarpnMzFDFK%2B%2BQFixFU0LmwyOkMP7WbvgeMn7rBKKtvG8gr7V6u35AAY84nGtO%2B8%2BBSI2nyHd9%2FrsVDbF9tvkepThsLG9GR%2BQ&X-Amz-Signature=da6116bc11ce851118d7fbbb26c0faba19d7ccdb24f7e8e31eb9d581ff382005&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466THQQLMYF%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDftgLEWn1JlXlxHcz3hs%2FV2BCyohDaA2TPcnwmdAwr9AIhAONW3ccCHPLWQJMg33Q0Vttw9m9%2F1077ptgb%2BXH1tWMwKv8DCGQQABoMNjM3NDIzMTgzODA1IgylC8k6dK%2Fb5omDQwwq3AOmT5d2yeSkdFYQGfXDa997nwb4QZpaX8qo0VwWXkUJiZhQcURkPeqDgb%2BIDuSYK2qbSnpWPWW1gjbAKylPZ%2BkXnc3JJV6esjOgGs4YPrQcJ2YFhkMZd6q9a05%2FhYAdDeXrtXtxGSzAoG9IOnwC8JZmt9a1Ee7muKYk471LjLCcXjQAs%2BKe9CI9SObRRKMw45nwVVaYoaNYq7J%2BJqD%2FSlNkNzHMbh4CZoE0d1G7n0zRJfpNlS8vXH%2FAlftWl%2BG0isN1OxLa1eIb6akXz7LnQSp849FABlJUa5iVzCOGhNwLtPRQsWLSWwF58u5pN6D2VFLTcS8cL8pMkrhEVABkreBmByMc3WfVii5xqxrl41OFJoL2g25j%2F78d4XWV7JImvtMsjObGXxWGts%2BQTQxv8zHCkAnAKAMvzsvt9FnKD8hypk8%2FLqp%2BCCXsSBOTH5RSyEYhHM8b%2B3Pc%2Bxp9TbORYycXgD8OxBgRmRVR%2BUDyG6Bk7iiB7aX4SM2nliRqie8g7ceW7WjfvTCiFug1XZQSVgRu157hqeCNKPQIiZNV1ZllHrKMwzWuO1ZMP%2FoXFuA5PnmQBGdP66I%2FvCEW2DWNLgp0W4ZFNemvVn499GPA%2Fs2ARq4aiFc%2FDM8Be3mArTCj%2FojRBjqkAaxNprt6yjwQyTMzsX4vKdRE5hMSWTGMvAac5eXwqnFk9y8cvRdLRmZnbrkFLf5OaL9Z9NK0CRpJxpsVGBPwBkdcIJpipyE%2FT0hfDEHj%2BR5fvtmHVB0GoQRaqvICN%2FWuz9pFeqNwiZLuw9oUX32G0YZ8TXJbTXVr38d8Pv2%2FP%2FEV3cT4SolhIpz5kGXnAXX3oD3F7LS7HPSMmEmsnoo8XXYc42K9&X-Amz-Signature=1727067591de4a29c386fc49b22c0e22102d1cf2dc044a63d10df6289f19a7c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QUL6QNKP%2F20260605%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260605T044555Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGVvnxDiPVBTa09hkA79eyZfxMBe%2B53aUsAZE%2BzhTElJAiEApw3umvvy%2BhwooiKgYV1hd9oJbCai2O2iUyef1tFBbzsq%2FwMIZBAAGgw2Mzc0MjMxODM4MDUiDNd4qHcyPIb4vVuUiCrcA9RXoxdlKk%2FfmrpmJgpE8Kz8iG2yQfPpufoSFBJlJlMtWDIpQscG%2BH%2FjEPDt0Bm0qXrQs8YyML1HoYgZyAzpf4tbOx6gOHVwkrxEN%2FtaCQ3tPPvcabyQjRTgkEeqmMx1Vr4QGQL4ZPEmCOueQQW0U%2Bwb3svCuPJkiPHGH2UwLmwvVKbrMnuZ%2FWsMeJ4KyQI%2Bt%2FMYjF84YbekkB99d1lrJr%2BMsWt2Le3VUrHv8sExMut6zUyZGz7FpTDdtQ5CYotnZqYkOsdjTKusOSXGCnP5%2BJi1IL6TJXo2NmIk972UbiSOsouCdgdRC%2BBVM6y434VzOHcjFIINSjKUXGxG8ANlQlO8zgMOidMtTUmubPFdOG%2Bw46NOGEkGkkAKkYfHel1tz8LHpQxrQj1sIUBmMGrArb4NsZvPVbB%2BNixSkovBP8sE6pLUfIPcUER8ojkZYNXcYByQcR4xRaR%2BcPJp4uQnblDufJm4pE2cGTNpFj6kPesHx46Rs9TZ35ULKGvPXZP1PsOz4iO6sSgdS26QKmxUWAKzpOnreJAoeqoldxcOooCmIYlsxIMmzQpBTacyXKAgEWktPeSnckLt82RdAXs0JEf8IaDlFfnRVcUWpnc7XyHerou9EyGkl2SOtENhMMqAidEGOqUBfdWZGRvLHugLRAyT7kU1Y01JUuGPsHRU5GJrMrtsX3p56MBtbyJvUUHON5q3e0Fvf87RLeNYGVkxr6NX0B0M8QJnogxtSRvmFzT3IMZjzEIyQoz%2FIwg%2BjiM4orjgXamfoU%2FV4u%2FXxuLA5yGS7zWB%2BA4a6RiYqGBz5A1mKX6F6W7SdUqaTX%2FBQLrCTIlannVdo1tfF7l04TVhhNPfpvu8atQ7Xe2K&X-Amz-Signature=bb3d60f67db3072e55c7303ec17e8fc43477f44ae72f4ac41fec7baff13457c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

