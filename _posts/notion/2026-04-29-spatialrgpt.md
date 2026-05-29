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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666YJEG6KJ%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDCFwMj1icv9l8PxxJz9ji1Dg6iYr9tklExArY6BLim9QIhAOIIdQ4qWDa02MT8k28h2EOJGsCJrD%2BCbuYiOEzY8btkKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgybBJWZzr5pF%2F6GzFIq3APprAB2X8lGqLhADopGvhY4R%2BxtxWIvtsglAB%2FwErgzSSLRCpjeK4y83c%2BlyEUsrAUoWor8OqpuGWbrQfxKZKrvi0Sq1GBYnQPG8VlrNI0xnUFigUVRDRewDwJiQSpbeZsaNBTVMWh6TmMVdNZRuwpVAJy8ov%2BQ4NEwxFyCJTMmn4zG%2Ba74WGSv6sw%2F4jcs5wS6BVnQnfIbai7cNz8xDfm7onQjZakjFT1dP%2Fbd2TZIUgJ6%2F%2F1ThGVy0nBrAVFSQn1tjS9QURDKzcYSf9RuH%2F0%2BPtVXTcmVZZ7H5vyeyi%2BSmj3cF4dJ9YDfn%2BXfppnDLFM%2Bhq8RxKuy0PSpeF4wKop2nW2gsxnMFoFaZvGs7JPsCPjv60F%2B%2BYhJoV2iiLIZWJqldj2wexHUwWxBE6sXyiC0IK0kZvKQZTJeuoZHeFhc7HQHpuOsodlaxJ2Wd3Z2igTHkt3q02zWkMYoWGU4K5vZVk5yxgA68A3QzVseQZyR%2F87a6Kxn%2FeoxGaI6ynCza7LPbmGyjRySgTOBscvwUMZHODetBLk%2BMKtvspR0rF9F%2FgLUedsy7P1nIa4%2Fx1eUrh1Gd%2FLEwZG%2FE5OBTGaU3nFl1qVPM7Rk2ubwyK9vvVzFgWoc8Cx8ULYMx07KkTDsleTQBjqkAQaan3NwW54hgxeksKvADUw2HfO9iwndg%2FaekqdwBEbsB8KrlMhvzEp9Mab2%2BVjGzaPSCvDwLcCOT3yLdkdfRXz0gxxdxubyqOX%2BcFd23A6ocxRrEYhGOoZPhHMdXVuPaRsPrMsvBzXQwbfMQSrMRyJY5%2F5MXs%2Fq8bmzWpw8Pt9EePD7RCRtrs%2BypXhCxHBfC3AJQbjmw5V1iz8uPqPd1g249wZ1&X-Amz-Signature=392747dc054a3259bdcea91237fbbd509324a9cb2bdc570b279c3ac2f4495c3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z52GQLMX%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044059Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDXz2jpvK5dlMRVXKgxDBHYZtDaZLVCz0lRua3YZxwWAgIhAP4t4pI4MfQoewWDP%2BU%2FToHHePyUjxu%2BqlfUmrs8HWWoKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxsrnd%2BdWl49GH1HS0q3APErJ%2BhUQCXOskXR1meZU1M7%2FBZZB%2FhqaHGXDLou62YFsVK8VaeZpzSPW9N%2F6TPFDH8U%2F%2FbSG2O4Ht8HMNzcUVXMl4e6l%2BUao0fHPX4zodc9j%2BGBzEcXSp8cqRjEfOzUaCWey2vttnLzprxbQYyLer7G4zGugNzZ25W7t%2B1SPDnMpYl%2BAIYggNYaneZ2k75lqGndgA0BytwttS6PQ01D5hGlfMFdCSVqm%2BU%2B0H0k9JgofHEtQlzgDJw3HftVX%2FXGCNS0gSIdReepRm7KX5QhG9TOOkKfKm%2F0Wry9WGKxeNdH2k%2BX%2BAouBPrzVlXhlmnbUQtDsIwLHlGObLgnJnJiJsC2ngGYa67ywjbm1F4lY271gIBpeamAB3JhMSHX%2BAtRgp7qypmMhJzsD8PrniGExV8Hv81gu7Kg5H6abrehdmBmDf8zYESuW4047%2BGDmpfGF%2Bc7R2qS74YaeSrFChv6u2HodRQ%2B2yMesu8aegyicboFe8y%2FO0guHcbd3QAlSh3yzqqbxd8NP%2BkD13xQYcHJ%2BtKZo0oFhPBUc96YRl1mXexxeoPwTNILP7rI7El8svlDP5HXVUQ4v6n7xb3L7NH7efF5yyMC04f9cnNFJ7SP3a3BER8uedmGEWkFf6NjzDclOTQBjqkAX5KTce3aQfoDx74NCWterFv9M%2FcwaWue7sp7qZjXZsbUCAFxLbG7b9wmurkYTiJg5HsfMXK%2FF4orMLQIzOeqEalYvnHMd3Zf2T3DAGsj9jrmEbI6AvFS44QXtv%2FVFQdV95K28vAzmOGPCigpu1XSjAVGNt6%2FaSWtg%2BRJma%2B19IpJvqEzaTDtrFi9qKYzCVhdp2P0F00D7368M7N5VzlBp4urj9Z&X-Amz-Signature=698760f90091b05dab6d5dbae421e81c33afa42e031cddf3a6b3157812dea924&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XYLHBZEU%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044101Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIESIoJSxExW1tWjDwAefJIwSYOtj2hXkL%2FS%2F77AS%2FCsrAiBq6YJK7yuIv8N2LVGl9Gcu%2FfRTq%2BAmrbah9vqVGiQ5%2BCqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMMObotrAYJCza1V6bKtwDXaO25l1pHGJQbmXrcSnuwsTYCwP6yGws8GXYQ9gbzVh%2Fk9v3ZZhOPaKZBhFgPG2A%2FijL8dohsNfMqLhyFWuJZTVNwZfd2QumiFmcsOj7hUUbHq6okqPl5cMXtnjk0faDG7K55%2FBT0YFfDTvFAVuMTnzz4kKPzgQ%2BwQm3kE28ywdnC1moh%2BwbN%2Fu8h%2FsNN8apKoXkiWiWwghChpACTdKnpb8RvOVrSP012n%2BgPV5NDlEuDnNUrUpz7MtJqxac2UU6eGDP%2Fw7Ffay5twhSPDktLQ2%2FTVkQyhHrdHjerKLLCeCYg7nKPq0OFuXwmsGs6DDFi6EO9J6OwwaupwMdLWsdl4ce6jGzogUwPJ0ukop0t52mTg%2BfEOkeSyjmai9bnGsU9Rja2i5YQEaz7nPfNUemffFjkl7iGzCF9TN5kvb63BjUwd9jN%2F32zXscsw2lF6bZnpQ6lxuJRpznEksKCNYwqXgSV0MNKzrtj41PRnkkB4B9EUBgUSEwAMcBFF27PLaahMrAI1l%2Fj0TuXakxTcbGmu0koKJc94VkGltsILPoqSxO1CybjRzRnIKVqVkL%2F33l976jlysz3CAJLxk1%2FUC79Zmfqow2px12KYidjgR7Pb1RfwEmn%2B7F7dwUi2ow6Jrk0AY6pgGIrBr0Z7AxSMiPwSRH1OBSDehTEn%2FkgWAWzC3v0YqFGLM9B4Mo%2B5u0lAtaHA3q87fJZW4oazm%2B4SEWfsD3ofy1ySvTXRLZDdj%2FdRJw5fxGfy1e309eL8gw%2BVksj0gurCpv5sydjaTtqSmUrwzXprkcf4jGDqIr98mFfJMOLzwJ13EC7Lx7RiOyG2b%2B388d6LJFmx0%2BQoWCY2gMuSIV66Sr%2FugFrp1g&X-Amz-Signature=6c4e91df44ba95e2a50a18caab9dadb1e3079b903518c85f836f6c376624e66c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667P6LRJOH%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044102Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGFVZoFxphyhMFXjuWr6mgYe4mmEULKAwbs%2BU6giFm0jAiEA6nFblaqJC54hRKOj9PimFgWrysIUapCC%2Fjjf2fHwFAIqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCAPEB5sarEOXV6W0yrcA0JyAxlPMngofyeYbKk5NX0JOft7%2Fi%2BGs%2BsoJWDlHpgRID6u%2FP%2Fd374FWjiKhBH6PNyKqUqP1IKPQvUbnawtz7P24h7g%2FjkOh87EbQq3alW3t1%2Fkgkn%2BaFh8ee9F%2F8xAGWjpN2Ay4w8p%2Fd6NnU7Vv6VcZ3B3DpA3fK11%2Bqi46dpPuJwlKgt%2FUFWYWR9rZmXrxHx17gedxBRJqfN50ENp7CoSstkHp4W2Ds%2BAxAS5F48CINdQF%2BNYoRevBxDmvLOmVi3CQ0rRojU%2BqH5AwmtqN1FhOJZY%2Fc%2Blf9MmB0pfYmcuMQSd5GGz3DjIOO3KsGrPb75q1YAjH8bl5O7Hd17HmDBg%2Bem9jqYvnxBDbTKUziLU%2BUngzTBaWG5KXpj74IUmqi%2FOCBMWRUgHCIEiws8NAU%2FA92yb5cu4KYiKL9eCdLgBd7qudNsnJbkMxZI8Kv%2BdScCgz6qxkDqQDD1EJ7FE5rjOSbypzsn5jxoeo6Md6BGzeGPySH0d6uOnDurSBm7bAfCYfE92R%2B78pRVe9XD4aWxI7eGHN8Zi5wyqZqX8os6K%2FVoHbGao1UIT5h3JKsPnlzRt3S0m7iWnQzusVdlBfsJ976meyU%2BZvBZRH5CAAHCQyfgRR5US%2BocWMDLOMMSW5NAGOqUBOXUJ8z38mwVx8qHNl1T1Ng1Z%2FaTd2KXzHLoII8y2NQ9FDIZimKy5Qs%2BDn7yh3Y8dyWr1bqT71tt6CTCyi801xnRE8%2BKv4wzrF4yoNh96bV67SIQ62UJjbjWgw2CtI%2FyWe6U3OkMzvgzT9d%2BYGVFavwALxlrTe1mVWDhBlyJoKs14eGBoLmTGJhkP9UUVf%2F3A0DpUpiuoE4KSFcyRPbYpvCz6erA3&X-Amz-Signature=679acb625fc89e14fe934fcec968db12437705e98030bf60287cc66c602609a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z2QNGYEL%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044104Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC4auU1qhE5UL0PbUWsKsq6I6LSz3HLmaB8ql6GiSeEpwIgZub%2FBPetiC2LI6aZWwWilA9Ho%2B1wpX4%2FJHMRtgMtZm8qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHSXpVHPymp7XYjtyircA8IdZfs2JnSTb86mEfhwYT1LW5n%2BsMsqpCRQKTDOp465l1vOQtJSMvlXo77NRi%2FXZBDIWIOmgJ4BW1nvVUNBwIEJ6%2BO3Fqdv3%2B%2FBhuXQOr%2B%2BkgdaZyTUj1s9Y%2FWRDiBzXZTdqct4GcNeOJ5BkxqHVRWv5f7J2fx5IzWAdyOK%2Fah7V8m2TN2UvSORRBa0DSpntzW9aT8UIfIA%2BjFUBhwodlO%2FZRJGIO7gFCSGNb9Om7YgR67axTVXyyvezHcV17XmFmw27Finsvecd3bFwZvgv%2BzJ2UsG2zmSISNIAGA9WGU26rAS5qYr27fksAOkm7MGU4XZBsXLqtUxBlc8M6RGG5oxmEFxbgpKqctk6MJL3h3pK%2Be6lIGWweyarkz1fsbzVZiq%2FpqxOfF2ZRVoQ1uk3KmRnMlpjTirF3vqcT1CjytRrCigti%2FgqtsEMVTUJj%2BrSSZi6FfRQz%2Bsu7mBqw%2BbszaCKfXwvXxPEF8VJ4jHqYwv5G23a68kbjKdoIWh8s6eq1TED3tHMX06pTnuLFOwqwDi%2FwVOWUKNeRC7DArb2VcMjyjIEySYhQNQzc%2FOSgN4CCp09YcAGysAGIy0b2KhPKAr24KysTX2DUoTBhRwNqnLgJ2FfuCGgjNOxfQGMOuV5NAGOqUBfg8wL3zwabblxWtE0KyTXxF7ckZBY7RsuAf21D%2BOcdwkGW0CkKlLCRWBzyCf7MESf3A21XBEgUtCilt1oqItNCdJm74q2M5g1L%2Fk6exkz69wbwzKOpJoXX%2B78OJNKoHbOEV%2BSL4UDV0Cxzm5bPGIVarX9YyORQE4wNq44LY8efsx6OqjA2kWjPlFkAC5XACFp3b%2BIyQHY3YPL5qcsvf4YTRqXkaz&X-Amz-Signature=563ad3d23d6ce413c80560879895ecd0b828233e618000e70f0f4ee286b270b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QRXEYXDP%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHbgwUCxzi3byr0s%2BME6E0i7y3hWZXAMOdFNyl7caSUdAiEA71ZVcrVi8aOeKN4aoMTX1flmeCXhSyJAM01Ine72CVoqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEdCoQyqvMSrHRxuOircA8UWEgXYXPoQ9jpBpUPmw1d3Wx0gWXikwh8cBvSSxh99AFl3BzyGh2ffsuiGYG4eaHiynrfrTUPVgnQRt8GigD2ajqsF24l%2FuZ2GEA2Q2v8CpgDBTc26BumIzo2%2FR2IafTZKSZay6gnkV%2FHI9EeTM96DVCxqI%2F9KAjMqX0vuUXd6QZCbp2SogkFhEjl7DnMH8ABvS7nlk8%2FQqYuGjBkhW29Ub8a64sUT0JslhpoStojiloPFFRFpZTEhnbBe6KsX6pD9mg%2FtKVaOFwlLBUqC3DbJXw7%2BKM7HdNUgFcTi3KsburlYRr05ZP4cRyzZjccUb3OddURF%2Br8LDMxsJdAzphf4FxzL6gRx9RZJcq9PRGu1WHC7SWCVYy%2BhICwPNFGtcV16QWj0WUmyDmTw0ScznXRc34Iq8P6OCRTZksjO%2BDhGbuqjK6s0LH9OspcCS2R9RyMVJRKVjgXEeHmQfwwzxONlXfgX%2FQPlZorBTpaA4Z2TybOT39%2FpeoVvYGR6FU5OjuLZhO0bWJLOWAKomCji%2FP4KQc5vOooQT9c6UiiXtY26432axxZukOcs7M2qivguQLIVuFObiq5cVDfLEi0VXKAaT54%2B2GpwXdS7fZoNvjdfUAor1MWRITEciOV8MMeU5NAGOqUBjm9t6%2B8WRUPysf%2BupCz6LJKCLqwu8RllKYrjZ6r4rXzpIpJop3GEgmqAfiIj4ncnik58eCrINaJfOnKdUrBQAb83dadgC6DoFgzc9YV5i2QcHTtJ0Np6YmajtI4POcAc7TXzjBpRCt8t55MonXjvGZe%2FAorZY6d%2FyPGRqoFfnJETiBSEP8RG97jtrvvXgI9h66W0XtJNIsLKqh8p5FzPcED6we67&X-Amz-Signature=d7838882c26804b249ee20a171c2700f368c96eccad1c0fa71819810526e64d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RUS2MJVW%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFF0Wh%2F3SZXpbDpH7JOGmtJOgRYzOajExHeNNl3nIwYBAiBN%2BxW%2B6TOIhah00gHH6bkF%2BEOpKKX63dE2p70BuVoUbSqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKbFCUQGwRG74abgMKtwDNBWjNu1xktxBSu1IRMgDhzcfENy%2BAQvy5AhQGg28MlUwnsxkmCdyvMy62tc9rGCqPwnQli%2BlqAQmSxvJVTGX066cU9Fj9IHAQwbB6gk0%2Bzm4lsFghfeGa1zi7Fa5CFlzNI0ypFOiNB%2B5q%2Be9GEzrJOoe25aEQvF6NNpdAg1cVD1Of5W6odwPwO6A%2FEkGCC2Kd982%2FbpWote75Q4%2BdaJa5pFPM38WpBPvBnm%2FsdopBHoDhi85%2BEnHe6G4Gjjxwp%2B0OhZc5zL6H%2BxgQcQmW6SZQkeZahqA2TlJAhuKuNoKZy6hTcXtz1R17g344381E32ZcQL7%2BiKSUhhAzIQDQ4%2B8EuXU2g8N8G7THurWgngE2WpQQFNknYsDyX8B3vXrijsSrcg6WQ5cJ81H3W5Ri4nBQi1J4dZDOmiZ2cvzDN66ZmtNdpKhSElZjPBS1K%2BfsO0A2Z2jtcWuBuDAD48lx949etwwxVFbVR0x%2BRq5gn5aOlcWojQsHrr4lyvdWoetoKxauZdSnz%2FBufoOPiXfyvOZ7VYt17PDbOeC8%2FCoQN%2BFZiZ3dsMT3BKP%2BSxWu5U19Yqrt9iI5NBBqUKXTGaGY7mNDM6K2pEgXfS%2B7IXeLlthpqXJMPgskU0%2Bp0CHkeEw%2FZTk0AY6pgF0Ufz9quYTAgtMtUiSPpZTzRweAESKhEODD4k4HUIAqUGpdJqf1AZrvUiU60a4kTWi4Z7%2Bzh5v%2BVdw%2Bjdbg6i6QRUmohiYPPsIr%2BJvDzJylsiFEnNC1l53sER2Ae5WU8uFk4d8GL1qPWGRHbwpxMA3Ugo4kWiR59M3joJBCro4dvfl%2B3pxJIrABpK2DAToroW%2BeQmJ5FZ%2B5ta1KNsSCMwWf06hYo6U&X-Amz-Signature=ecff5a6fb9d651a4f76c6d317cd56418ba6a9ffaff0310c634d889b29030ddcf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46667Y6DORL%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044106Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDn%2FJvKW0X8pGRgbq5%2BhpCpkfb7%2Bp0ln83m%2FKzXvHt3RwIgDyEdvbZ%2B2aObdCOTaFWCGfk3tQzTyZqF77ihlwIjb6wqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLF9S9hk53P42MBi5CrcAwxEydtheBYFOf8lAbfurb1avjI73zXG6WGfbaz6SRR0xiloGOfSqjaQqyee4Umb2SI89EvUss3bYi8I4fz%2BqVh5lFWzd%2FGMwwaAniUsR%2FxzIIBelfLVmgHVP1BjZXFtH%2F932jXJ4XZsACEItF2qeazAh70azuekeyWsrVePOg%2BUQ85DELYD5lJh8Nn1lvi4GlqAtMrBFm5KsC2yLsz16Os44qdeiCqK%2BL4yUdpuUmsbPfuaHTsBvi8il2QxsqWSfUOinX7W%2FQzs%2BlyFXPoNQIqfgrcAj29VzHBO2%2F%2FZqg70Ll7aabCnB%2Fi2ZFtanuG9rLU4ZCR04fSLr%2FBFFD7CpGMdf9SxPpULRD8YZOB%2FSbYao4ufsoicP8pF07ESfxZ%2BVnLoNII5ibqb04OJU%2BIDwO5Lyj%2FXoZKnauiA6b7EPCsiHiV%2FFTBM1hq98JrLk2c%2Bv5xt7rZD4b103zuskiScjobRkvuBd35pigA14Z2ndy%2F8C4puIfZ99x0zDtedh7LC8hLGOTwbDfG1kltbbvqpITuLfCdbD7ptz104YTfvHIq6DuEGB8iQU8OjlPgJyjAEnlYhwS%2FE2%2BbX%2B51tNSy7BRI2q6%2FBAp98E352ORxf%2F3i2G2vRf1nzRkH3JnzPMMaW5NAGOqUBe321UWBIxNcPpQGz8ZnaznQFUeYPBGWM4BfrVVuUJB8rTd3DekYLErqlRYAyAsG%2BMC4QFHNgWKzHxZoKZq9tQX8FPcoLsbUYmaJ7BaWSF8qQWOxFO0UfuOznUpfjEkVKCyKxgPQds0Q8a3dF8sp%2Fq8oIzC9%2FCkbbqAexTHKP2nOpL5%2FtEnFagQgpzxax%2BgN7CunZIl4r5vee3OPYmfaTl4i4QMsJ&X-Amz-Signature=51b81a92169fdeefb6b9dff3e01b314f9fadf18546b3508736c0789012b4f34e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRBRRKPA%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044107Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICpQILsnY7jxgQPwmZMWANY2DYf6Z3MRifw%2FGpthyUlJAiBVczxR9SyxQ5hJdf0WTv86KxFIbMMscOqIzeT%2BuBV60iqIBAi9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMntZ8ssLwxu9qLyNyKtwDqR5trcaMQMYU2WS4owGh4eEq%2B2vynJ5RHbpV3yD9Gjb7Xe%2BmEiAq3zTUK5Fdq6mSl6XAs1DbZRKEpxMOygIa7ahWhvktiv5wBQc14W5RxIXTPBOq%2BWVqTZAXCMrqQjwRcEh%2Ftv0G7BduRxmVYVjU8Jbj5gP3nHXVR50CKzi6o4J7FVOdsugPErY9N%2BELpBZhVoy1ZKi%2B%2BHDVo%2FmGQxoaheenuvigYAPbhE%2FGZaDDOCRlqmygewhLf9OUlkQyI2ncj6Zoa5j15djcV%2BA6i2hov%2BgqaPgbf3aNvR1PzNnb7UatTWb%2FL01c%2FhZZ%2BLNxpA2Q17enDBUjVW5jY67Up6vy%2FjQ9pzIMJ85IshR3BP5ffoAEd8Y5pPPOBtpYoUpt4GtVJkn72augVq3Bm3XioEDjExwU1mVmhR8yzDh%2BZLRFLndHUEtHppU2sCsDgk9ciOS3o3mjMtICujfM3qA3CTRVLExo4x4o03Z9qqa3Ph%2F1okGXzBiZXOe%2Bjf2sg3q%2Fk5RXNUNnefeI6OBJowV917Hp6hY4a1u0qO0TgkgNI3wzzCqbqFWj2LLyR9C5C%2BhoSEvl3zZ7olVuTnpvO8c0iHMIdWoA7gOM7XbO91aAicqa6cKylQMQQU3FtZ1jIzwwupTk0AY6pgFFvszRErOZn0cKjBLV2olV4Q4DBjmyAhoygI30OfFPXsj%2Bpr4Nji7mCX3I%2FN5NLoEVVYEO5VR3bmdYXGXYSpU2v5AR3a%2BLHkiJPoxZB0XcQcLGwwuiKeCm4jo2md5dPJJMn%2F5qjcb%2FbzRniABpMmzAo3EocRumPvh8X7vOwPH8eQwbMNMotdENxHjelmyaKLruefxEhGI46i71QH%2BtGv4fsBZRJmK6&X-Amz-Signature=02c57a261c2611103587f4fde6c9dc0c7d2f7570053194331b799b794616a49c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HXLBBOC%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044107Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDcMdVC%2FJSqE39qaTk3EKui3qj3yzpGZFLqoNOPdOQbrAIgeg4t%2FxTagvb7bCjN8ffGNDV8HwYVl7s4y9K0MUSG1G0qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJD1limzq6roYGJN4yrcAzJ%2Fkm559OHWR%2FZe2y%2FiNenasxJokJcMkHPFclFqTCY7YDTvzBZfJt%2BOo6mqCcgQ3s%2BYOWPcaOEtPuwEOHAqLN%2Bx0IbXI3Tc3fbNPUwA6eP%2FrIbrXmTGOCLmwMI1Cs6%2F8MnLfIP5KhGnK28J%2F1DskFGLG7%2Butn3PBJuNZTyL%2Bp5DpzuvBDSHDr7%2Fjnf%2BNcHzcrdA2wLfgGrVUroK2scPEp6Q%2F%2FgCSIttuAKI7UCBGQZ76a0qEIVu%2Fy3oXIfUw31fZCfazvsXdhSWfgbwWiIKsYhd1AspyfWjY79VtZXlkNb2OBTmrWceBXM%2FqeLLOcZkNAjplLxNj%2BBck7pDjPdxB8rZOKuopXN6eVONkfI5HrY4rKMVU6dnj14%2B3sv3W%2FMPhHOXGwB3mCeRXq92PKhS1OkBfXTxIluu7KlKYxgyoj7w5WNRYime2lZPLLubuG9UiCYha%2BTKCVOe8OsZQzubWEkC%2F8cX0NGsOnuelnKXODCBO91pEWUkPABVTMNOVtJs8%2BvCh5ouR2uB72nzcXHZ8JRvOublrysMOxh1%2BBTRFAXa4Sg6Atg1LOu1cpQrGXIPRj5%2F9I%2Fge2Fl0dUzcKF2ME01y648D%2BoHklznYaPMYbkGHsldKXadMX3Hwg7aMP6V5NAGOqUB4l2tK1XtxwaB13gU6eejUFbaYdOE%2F5aOOcZCPpvpbEwN9O9yI4F8oscchxYW7BmEU5LNgXk6EMejYpd4YnKusF5BcUjSMmRt7FQUJqYISIf3by7OTissjxZX2m5cKWRJefXoB19liRtGFK04tHMtjJZJUwb7Qmr2wzXNj8%2FYpGus2T8%2F6gI4%2FrLuu7%2FSnIgYW9t5QscZUDOZVqGRcgkjDSUFkXct&X-Amz-Signature=cf16fc9a06592ec48192deec6866d8cc9384b4948a886d8e9388347f127077e3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RJXZI2WA%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbUyMMLDCPsy2ezck1iPWMLeO70%2FyjlSUwHnNkTYbC5QIgJ%2FV69%2Fkky4IQWqVvIvORI8JM3BhdC0Cn%2B%2FFi9rq%2BnlgqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI9lK7OJvS19VGpNXCrcA6taPw2xMANKH7Fl275CICpgz8s474dt5C%2B5IhjHvVrXwhFseVzyffyUcTeyco47X3b8NCqEr6mXzz8y3MoZPJCgaERug1y3Ynab0NqTjzxfio2AcS5HlU80Obfd09OI%2F%2Bn3qZzoi7VIgPgCaN7TDp0djfMlqrgiqK%2F9VY66cQ6ChR63v0Eo%2B%2BIaYMnvxG38OEiENun0gcmD5sn5X5C3Gd1kSY2NOdZWsE5z4AcpHkcSyAf63TjJcfl4JOGCo0tGY7bh9dilC%2FQpMIpDdEPppLLYbWBXI1IOHmN8i%2FJ6%2BGXVkcoKP80XaO1LUCmyRdXr%2BMF8r2TwKHuLKZlPpSTWveMv1PlPs1svG6Nky0huV%2FON97qz1lVkengikYdca2eEl%2B3ieir%2Becy8MxdLqF0mx4NMnOWKR4%2FuZpkoXtmIt58SaOk%2BblqTogTk42DitBhj3oGfcJ86KcYj%2BJGhnAHZifxEBQ%2FT4Mj4lod4V3Uc5VeGkjVK2KJErF9jFTkIKe2mjFDDGLDGQ%2F8rPP4k13r9JQWLsbXiHkNCBcHcFqysdytemtRQAenEBapW%2BGhXVIAQGFnUlrDNGfCqspG82SnJBLsTZjatEkcxxFQBchSi%2FhdrCmlBlPCOrgnpxmYXMOmV5NAGOqUBs6jY31MXjKBDXfqKKd8RjAmajfqYW6%2Be94Gm6xgzK28iMTP75bby9ZmnTbzr716omyUqRJDCqjPICn6CNqe1kEE8swuPn%2FBsS3QqAlL%2FP%2FAniIsGZSwfIRYO1SEDZVdyJVsPVpp0qKmkuJZyi1sLSwCd9dzRxVvfgD1QlSCssqOKcmLty0hZ0nnSzoYziR%2Bz%2FS3Gv0xBnN9Iot0Hh%2BKIPl6EgkSq&X-Amz-Signature=bc3abc6b2097f043bd6bb4003028efb7cac3dc2b44e48306fc8c9a9fb3db24c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

