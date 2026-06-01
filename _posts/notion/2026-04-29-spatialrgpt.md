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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666YC7NVIB%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051431Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIGWtVAJtkhAZbtOx8GbhcbR3IuArKZvJTY5LfPMNmnt5AiEA72exoQTr%2F14zL8ThX4I%2BSE0G%2FviCwdlkVM0KXRUq6iQq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDFRCM2xws2ModN0QXSrcA2imwH97P5xHMVebgg20mJ2YdfO1YiMwMUUprAGYYHijsCdsGfhsxG8r9YMHNqGekuciuDhhpRwLwVJQIlHMk%2F3kTBem50qU88a0KoV%2FJylumkBpIQQRu%2FakOVOMSFApqeILPOW%2FdMEbWlnM7VgN8GaZ2dt%2BANB6LV2pFMNzjx77gJPfkKte4v43uArkIHQ0gVQ8yfYHd50qWAutnV2tquzG1jaZH6gSBMcADb2YypPIiyfTKejS0YxSYFRD8k900q3N80%2BVGSEyKnBEnFn4CKDeaMUk5x%2B12K%2BF19nHTgW2F6NSl3KFVZqr22nsfTouAy20e8toe3KX2mFftN%2FslstaUSXYnMBTuvo6tMdPYnwrX7aKuF0EtafO3IB8w5DMcafGCql7dNDkyCqt0qIb3y%2FM311roKCQtfYrwO85iqb%2B2o44rWGrc0sFNGmI3oFJigc5KIL4dEMH9rcFbzIzd%2F9vZfSMiwXSZql81kXFaPOLbkSWJD6i6GexkOxuflokTS1Wo0Gl0RIPed61NzUe33%2BICPlcGo%2FeKRPF%2B%2B4Pb%2BEC12EQntTABG%2FIm8gQv1tlUnG9MZ4aP3r8UFdVhQWtmOPvPoYeg%2FssJEnZK056eGIHS3wRdnC1odGsDmZSMJqn89AGOqUB2whA2T33p%2FEOxoTKqrRv0w8ap%2BhDyOyLxu6JdqAoZ4tsh%2Bjkjl%2F5mopNlx0JxKyr9qnFHPWM1HR0Y7FInafT4UUzUXY3N7K02s3fphk6TG3%2BAOwLxUhGah0hdAI6AQ2FIxyUWX%2BjSlMzcgmg9KPHadExSz65wL6X3wxYlTYBAIn8h73y1BK6nsGAN0fZDFr%2F9iSIxrh%2FaNM740q2QuIPzXbPpe0n&X-Amz-Signature=c4cb544a087d69c81f0609f4c43b19bd7564904d5ad8a3f818116592fc939529&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QKENCJEG%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051435Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQCx9nnTDTwkcaLouLat0F8LXFfK06a62FH0uF3KDaoGJwIhAP5ZYj28CJsnoI2LADL1DiuTdS9DjWjZ9%2F3OssDczYtoKv8DCAIQABoMNjM3NDIzMTgzODA1IgyeDOrovR7FqwqBxGYq3AMw%2Bp0bzSyus7QL4T%2FqF8gJJDuyhe%2BV9%2FDiqL9A7CZI%2BgvqJlewWxLiWS0%2FLts8R%2BbyCFdV3OlE7aTcsJAIRaojOv1Xuh%2BHWjRPooDxZIkDJm9Y5GVIlWfu0hYECXErvZn%2FZvhMF9%2FDV2iuTOk45neHeRCKS7NMxLa%2BooX3PEyM8M4R1mZm%2FNQglExoEcfCHAm3bmnTOWCw6%2FRrXgAacFPJ84qVdbARCO2alZPsXh4vuJyQNinvrUa3Yz7pWSc%2FFvDyE5ZvhvqC5YrNWnaFCsoAlT03OTP3uKzppPlgfoJ0Qtk3kbYg6HIZDgvsrwO05HMQIsBVh2JSgQcF32h3lhiEOFjq5vQXltTnqAAvOge6AcmNZbVELSieakNPNVzQRyEv977LJyiJr0GpNXsim5tinMGMZZEFIGsWMbQJWv0wT1IpH%2FfQYSxTiKp%2BB8w%2B4yci0uxUC6IyZdyogG5FSYnpAH5F5%2FLozt6pI%2FVYmJuxp3ncd57biCfFrStBeCD7DMKvPo3Aw3ENnDuX1QabxoNmAZAS%2Fthii5muy0HFCFmcHLNmpu7AbcCb6UQcEhcncFzTfizA3WXzu%2FijEzmdVB61Zl0gkkBl6xE1JF5lbrb0FgDJsMSztDgfQJR1bzDOpfPQBjqkAZdnKgNy%2BkXhrQSZSJIhHxJViXHb%2FbHtLpLAn0yk9kAvNlTHM8F9G7%2BaoxqzOBZkVQW8tuBV1mUXWH6M%2BMwkrwaORDonjByXJ1kjpwKRnteaAD4CY1aD32KjafZp0tM2XftaziiHHnsBrdi3N0QZTQuMe%2B7z%2FwfLksptW%2B91329xtvpjZCoxsFVdbam2UepFEMHEMezUOSrzKbXV%2FMy21nkq4QR5&X-Amz-Signature=b661136da7881810b43b9c0ae08c121fbcb9d5ef170ff46da8444cbceedea7e6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46633CKEW7O%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051438Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQCxtGCqSNcBsdTPBCxg0TKHeaFb92UMvf98EWCWxfuP2QIgaiFalI6aP7djUC9zeI%2FMq%2F9HfkbA8ebEOvQmWPeK7moq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDLzBfnLaMDMOLMg%2B%2ByrcA33eBzbChz2owm%2B8Y9PVkK0pRxQ5uAilBS4kGso0tSH6NnHTVETFBDdkZrN5Cy2M5%2FG10%2FFo%2Bi3Nghyhq%2FuCbupHzvzOYg1ixSZtgnFto9aX3us3OOicjyszRDLLBoAqQPkbgN4v3iFJY4PAhsFeLF6412HUtEdfPwAUQX6WJp%2FRUiadei03SBrCaDGMp9HNUJfIVOulmRkU3ha1mBKeHUof%2BcGHZZHB2y6O93kwtIHVkT3ud5KhagyaKHvRJ5Mq9lXRivM10j%2FPfixiMf03c4cyfy8YsUQVxoW%2BD6iVqniW7dTBvJoxNsqcchanV%2FfekaYY%2FohmX2f9kYUs%2Fl0EgZGNaJauWgJvU4tYG4geKw04e3G%2BR8QU79Ig7hIAVD7hwG2ClakHze%2FkPuygkKAlvcZuEBeozgAFAN9PLfCQ%2BtY4BDL4LA0KrcJLMQPt0GPheFitp1q8vhTPN4VcW39cfGxSL4lkhOMyoRrXSgk1LdRLcKr%2B1G47yFB6XTXFKlKPtdj2b5dIsik6H46R5fELwpJkhHHG33A%2FCuL8WZ7pbRl1ykpYnwWLd0fI53o8QXo5iDV7VA1QMlH2wTJxJ4owfmIaFIrqiRQmmx5C2jacFZcE56IEbl1GaPzRJvazMIWm89AGOqUBRnKCWWmqpxuKOvv9V7Vjo2WfVR13MsnipJxSBZXtfaiMJag86bs58MwhIuhFPJlv%2BaEGoKxEMcF99xUG9eL3aAKKdu2e%2Flqdo68osLVvA4yKyL3tM4t7ehwoBHnn3NNzztNvCa8AysV8e7r0cKAHQM7G%2BHfmKtP3Oh7N2Lt6E4ze1TFI4XJbYpKQy5O2LTAW5CVo1Rk3sGrA3rw8aR%2BoWJgOeKCp&X-Amz-Signature=126586ab911497496c1c2a912de5c1aab7466d98a2bfe606c6fb52db7deec0ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QTDMDUVB%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQC9P%2FwYUgv9tozvFAgYmlR73YvQ5YO5ec%2BycwIrTLifiQIgarAC55DpYYhqVGjyGATZ7AyE5KDf5xU7zghvTORaVBEq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBb1FT%2FBXl8pT6HVAyrcA4%2BTLkElz5y4jiX0F%2FqzDnwa8PyoDXh%2FXnyx69FO0Jiu9AkrTwbcmbdnp%2BCqor1H5vD2WGCXky70y2DOVe3AE9LXFtBLza1Ts2pr2uax6%2F2iAm3f4YSdMjr3XSyDmrvVmZwGU4%2BNokohGbR8rpATCd2UinSu1fcCABmhkKfjrFjDsZhwcK0jIroivn8Unmaavy8IGCZcKp3vbPj8iKeW8%2Bh9DQPt4zzvSbzCWbGLginVwcEL1hRnB0%2BzVWLZt%2Bi9A%2F0B6YRqTAVrhwEbqnKbL7I%2FwCVg0yrpbWYFlnAYZLn08UiUtKoVL0LkkOMbDLdh8sV%2B2tHjwSSBXjqOsSMRSL%2FBJvd86Hz9hzV4rpwxrQ3P31InuZwwxaCE9iEVIJWlreYRG6LkYgQf2q4xuAFs3r2kAG5HBr40odcGGlnWKCPh1bJ4xwppWQvpzs88%2B0BR7YByUnGyxgSGXaINoWFqYbVj%2BqygmSDh3m46zk%2BWHf22TSukc2mbm7TPpKuiKL%2BnBAUfdmKk4qrDBwfrGcVdrqLqdAJdVqiQnFvVWOajPikK9ELD%2FCxs1WmD0u9ifLB5I7tX8IJBi5JjP9FHwdBsaWfwyAnhOABcTFYuSp9UJ5A0feXon3l18ZFlk98iMPOl89AGOqUB2n4B3TXlSu4UenvTHfq4ol68zj1Rvoss4UGGPrAcsMVuPmW2fNRWuQtqWhB1Jc2PDukI1jQWcnNH%2BvzlOJhg5NS3nDktKgzccHU6h8ExMWJ5T3ylSZu3JW94XCe0lEkiVO9ZaByVqKtxj4w193sjCOpf7K%2BUkzVYkvGC0NSCTTR%2FrNE1jKl6I2fnfKqby6I9qCAi2cD5w8UUzR4lt7NXfFBtT0Fz&X-Amz-Signature=52049602384428a9e28e657feb3e0119190668d2f09005592a3106273118d136&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664YDRU4AV%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051442Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIFTThm0TojdX0L%2Bucn5%2FxeXggYOnvxrIlXUfjydo2J%2BJAiBjUqQz1M2Yl7mYS1QctG%2Be%2B6Putd9m%2FKffPh1Yoq2lQir%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIM6JHDCOsuIhotwvnyKtwDnajKf2hzIwqf5tIWglleardZGwTOz2orJZ0%2FlZqqYzfdyU5gqASXsQueo8M3%2F%2BXC%2BLebxQQkRxz3SfiZcKH8CwK1QSJquQ55qofpcke6MxNeGirJHivAhK98rBnD70gfJX9SITgn%2BDb436THzRDMQ%2BUZVU1EvR0T4tPxJJs1ONIQbX1UQ7cUSL5LrcrnBERmy71LMq28l5e9JrzF23zQQy8Bvf6HSxeEwWaEvrMGhJRcDckAcHCXyfx0WEh2n0PpD9RXNqO%2BwXhDvJc%2FrRLsFXdj6tYCBdi%2BkHdB%2Fu1%2BYh0ZvGaEPQ9JatbrU4Wlq8gMQCo02jnJgK9Mzpxx1sl7dQMMMEs90pxFuyjGoARUcf2O51RVtYg5XTxQhnnAWkWkvBHTA4aQWawwD4mdwEhuOzZcuk%2BE1QMM1ybHt4Rd7a7YnpPX73gvcDg7zN9JpJk36Znc%2BSepMEiu%2FPk5nV0H64xAxJvIC8sw5n%2FPc%2FRkpSXtpf4acT0OJBiL%2B2vrGa%2FkymGRJkE4vfSpbJOVDnhmHKQg3Wslr9RjhTKxe1nR15kLBzFbq4I3ukAaW2DbP%2FB6JLKxBG%2Brar%2BGF9Ie4A9fwrGDtWPlHpKhkuvWm9%2Fjuu5iENPpGqonwaP0EdIw%2FqTz0AY6pgEJC9lSZDQoMvO3tuhmSihfTaOl30SCxJTCJ0dONVUucDcPMgva3MBfC1EfheifTaioBevRGNsA0lecDl0Hb4bFaWYU6f34Ezxb2nMjnvjyzQIa8A6YzG41EKYL3Ql022de5LHimAxsiU57C1GAu2AZ%2BJp4wQGyttNjzVSAGm1zPvKx8Cq0zlpHCPVQd3UOibmK8c0jeiiBgstJEfnzb58XZN2X9ehf&X-Amz-Signature=4def86828d1307050bf3295d6db25e3b035216110d9026d4d7dbb2113801babf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TAAZFYEW%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIFFnt8wxoQBXepph%2FQVDoTgBjXFsZLvMjKMCSQMa9FTWAiEAtUSrcvEl%2BHQ5d5m7V49W%2Fh3eyImkj%2FWVsaRpg5QLNisq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDIkx%2BUPcuBNDP80tDyrcAy8C7xZO1Xo0xtc7%2B3bBBb8ZjUR%2FyCxil5QgWlHklf67ZvrYz5YvG%2FoqCn8Y4bU1I7AyGX6BAGeQ70ebLu%2B23NYKixK8FDGPELpnSuJsacd4E2%2FAolOkqjvbF6H3os9COP549MmKNvYMEVu9BKijKU452WJrJ9RvRj32DLSzkH5FvjsdKXos3sLPR01A%2B7yaQOBoWRrAsyy8hY%2F88EKCve0L1k6nnHWVPEYqLp2HAOSwaTII5s7ULqgQoIartS2wxZqlbYwuI3H1ZtjsJ3yrIFd2i28NKFQIXWUqB1RoFsxXt0MTiuA56ZOtUjCyBiMophFXClYrbfVlpv9efl8mwAlXi8kx0z63wY2obmqHEKD51aDLXBcPKTEeUg85LGZ0jVxzCqhECFyl3XiUnMZzC%2FA7BP0o%2F0BtzajkJ%2FOl%2BjrpEmK%2F5TkMAwDjGG7iJ%2FG3BlahS%2FdRTrnFh1jbXGwJu72N4b3rrBiU3zjOpYds1QAeY9MHWF8eg%2B6gkd60eqpraR%2F8kqOD2quxfMMeO0xLvv9xxEFYL0lkeV3%2B3GsrEtKyDWyE8DowF3gJg8qv4tnf9tmyrLPHZfeB8JN5dcS50IfHsrXn7liyv1%2BqeSxdHj%2BRsyeUMlfD5IjnjIcwMNWm89AGOqUBhgw5MJbk5LmOFUk4eTiRtmZgE%2BiwhjIqN9YBjstywaF%2Fngx3Q9UrGT2qCjs9Avgbp001JRAzPSoxI1LTRGKOvn4TxEPrb0fPjis05hgccS3JXwxoDDH1NoG7qUDSt71jCNtNwDCxwo%2F5ci%2FzmmhUbrJBcj5Mvbn3DOdeke2FcC88%2FNpJU%2FQnJ0sc2%2F7XFfphBAzLZkREkDT6NAurrH66UhYl0gnV&X-Amz-Signature=38f52f88f655499538c14f08b6023da6a98847dcece822743c1b81d649e065af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667DYHOJKB%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCICwzUNFXgPUiE8bwoyxw%2BwumhFuBL0Y23jpQY0W%2F%2BDMNAiBb4k0oHSjirEDH%2FpBx4x2%2BZAHdZMra6SCY3JzZ4sqEwCr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMhYWuuW4j96OtuczrKtwDsEhdzcaLQuISmYfHNhLOnZb%2BcNREKjMbnkpqfEbYiWzmvlBO4t3HOrxw8chx1XUXLCiLX5%2F9HNV1f0jYBDKcviA60UmDNex%2BuvzD9lmBFxTF4Y6vc%2BQR%2B2BcnbNgs4mNn6G%2B9gjulvqYJPHzqPNF8Qt%2F9lWC%2F4QsxmZgzuTU3qcQg90fAIbaX9zDH8dvarad94nFunvDeWOO3f%2BvKDr8IkwSGVm3Mbm4MuxjUTVt%2FhLazVbsvKqaI1%2B5bNWT6klL3bQ1tpvoCC1HaDYA6g%2Ft4eTE30msj5L53m0DnQVea7UW5z0td5T9Yyoyc%2FDg4FzVtuYX4nl3hYo6Ymif2FsjZ1A3BmmngVoGKQxzuIqi%2FxI6Cevea8pHnkZPrLUkOUFgJ5wrWE%2FG8XLNOWLy6NDjMsH40ombcP7KhDKPu93ci4ZcIavezX1DSYZtb%2BVQXBLKPAm8vTV%2BwodjLrnZWXpweowBfs5azZWZ1DTOL1cY%2FssE6UfiuiEYrgPy0te17Al7Hj5PUpkoNfIR2M2oqBOpXBKqJvF5pWsJ1fjsjyhsDmrOr3JEnOf2n07N3l1QbXqklmxj9sAvXSGsOv7846W82HH2DKYKRzOUnqSiNj8kKbMBeqpS%2B6utp0OOftUw9aXz0AY6pgH%2BTIcxwlF0IgMuV7Ffs7WAjHgYLhBDykQNvHNqoQsANv2UMtmlEIIPqJHbh9O2AtMY%2B%2BFa1LOegHB5dq7A3WnoZQOzbqm7%2BLImlJc2iA2p3la5odM7Sd%2F4o2%2FwCPwj1Hpqlv4gdcxsiKo1k1UpyXVti3bfCHDihe2Pz0ShPOPRA97yNjua4H9PXCDNrVf0Wzd5F%2Bl2mlZSA8wlOLQgz4xsc6f%2Be50s&X-Amz-Signature=9f5d339307bc42159be5412d607d7ff2aaace94e942db62079a2437a5609584b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663N5AQ4VA%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJIMEYCIQD8rrO3J%2FeKMjcbq%2BYSREwlAKxxO99twnsJfJuxnYCHFQIhAK3obonwS7wux%2BYsOsodOp7uxbd3ZP1Vkbd0MGCk8eJ6Kv8DCAIQABoMNjM3NDIzMTgzODA1Igw24YbgsJXJBMk3UO4q3ANY%2BaXpk7rz%2F%2FXe7T4y%2FDyojCN%2BKMewuxgeYE7qmJqHa0k2cZa0%2FYWaLdKSs7dixXp1KyRVnaV%2BplRTLcoKL%2B7OPonGbJOwNt6O0NiDQqzD%2BnffUo8YcSKw2GbjAnuc3j37PAxn%2BH042z%2BkFSROhnJGi9pAKu%2BeKxjKXMrCBUQea9y6afI%2B5g9D2Ep4gZZoTqxeRPcLvzvI0PR52R%2BSh%2BWhWc7yvAjebi75ozsuI6fxb2Y9bQiK0rrdYJMZR2vZT1EjIY%2FWF5e7L7uVt2IbtUd4ZbelVWFmrqoWSag14bgyyThYCbFYPx91%2FWknUMUaIwGX7iQTIaKn%2BTUYxHvDlnekQrcXD7xMHN8nakmaAgqFZa0F6EDGK%2FCG0oz6FjVbtfzPXRrpSVi3hCXI%2B4u%2FwmPLasuJverd9HQcZXcFZEsCgb1kuL9P6aoEyyTsffMIYrGtFZ0Amyv4pFqVvqqFO6jOXWcBVvMzdeNVoiJtQQk3M9BMb4SrH5zT0dtVMQlBtLBvFhA%2Fa%2Fmra9QJBWiuZLMv4XDkMV2F4Zc2fYnNQzMFlyWE%2BNjycFheX%2BW07rbX6%2FOq8WXwMOak1Qs4Kk7bevg9AWBrl3cN3unwQLn97EzRUmEgwt8%2B9K61GDNB2jCTpfPQBjqkAYmWp5XzCoOmnBtRqI%2BxyC5Utf%2BPdYZnuep8AoGRUKMUoY56D54RzI3rpP860G7z%2FS79oWZ16EJvNkvYc4tGaWzmzp9cplPuYWZAFDQxlYJsnbnv6NWjuPSsbc9sR2F%2FKFH%2FiMmPmfPnKiA7%2FEzEC%2FuCmqFsesa560VaaW27EitMKSA5YIbK1g0kr34aeShbwfBPLOXy0eACNvYpAQSBUczQHaza&X-Amz-Signature=5b025cb9b971bc20e58f65de2e9883616b49a9d2e5e6ab651e159bef939a8e78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAKACB2P%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIHClgDa5uHUu6J1xhYw441QJ%2FfKdcrmGO1rEXjmmD8liAiEA2bV%2Fh%2FZRLTnTderJZmeTjqKxdJk07mPaBKou9CW3hz8q%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDHmDTqyTGD0eXQj8ryrcA9G%2BvBo34KrMFrQmvlDSZMN4KGoWFgE7Jj0R09UvqO9Hl%2B5kTUHhRbKdfDmxy3m0qlmgoXmPtt%2B9YkQnf%2F1Hh%2FKLFSW7vV71GKICgvrymyMv7pVOVF6z7tkm9Dqq%2BY8kDmBmlTKcaYR1y8XJMJLfnkYMVSoQ0QJ3%2FMxy88QWp5xvlgFxLg1jrkWNX7AE5LXQf1k7LTWgyWbLjMddArsErQrCngNk9tIVBaxaKXV1jhBp%2Fqv6ej0qZzjCfl5tguR0LSLX7V3UEoP7mDUIEGAswAPXjoFhJbIeJVaGCz9Eg%2BM0ChxwGPJPcErI%2BsqaamkrYEd%2B6%2BrME9xGjxT1umVHt2FKB8sQMAdsUfFNTP7qjc26lmy%2FRJ7Wfu%2BGrovaH8HGeR%2FsVXNi6ZCqvxkjsVFxZIbNh4aDheBQs2xBLmhM41d0UVcqVKP6NdkhY7zb85Aemz5lt0ik3XtPPzhy1566YuDdJgtbD6bhFcWzLuAit5PcrA7pDq%2FsZf%2BfYQa9IYyVT2vj5nYSaA7MnEn%2F02nxcBy%2FLijGp20v2D8bassg05MYaq5iVON65SAaqdRnPd%2BVSrGDegs%2FXFFlFV9fmuQlcwdmnHZVXSl8gubMCb7sefMRxyomFIGS0p0aWVR8MJen89AGOqUBUddPWhnv2FC2N1IuhrCms%2Bhws%2BYmCaDKk1Jr5ox9wFxyM1lojCIFY6DEN6w2E1DUx6j4QX%2Fon6YHviOp4Ian3g5j3CJUz0A%2FIEmoSGAjAKDpZt%2FgG5E8Gz0rh0pw2%2B6GKqJZNoSU7ngPNCu9xjh3GoAg8%2FiKngHyQc0u0gZ%2B3Mb0Kcm3Dp3p523jqQzrCYsEjG%2BxuUkjLhLCDiOsHnuG920auvWY&X-Amz-Signature=857fa010e1737d11c711ce91199f7ef9b785157915e25dca7bc9cf24fa3e4136&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UOP7FVIN%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIBcqEvGvABEmJzEN04JalptfibFpmiOYCR2t9FG9gMsuAiBe%2BCLlu73hVzHGqH0xJloAW8HfCsyiPLbTu%2BL1yAoozSr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMKkmslDtgIFC7hMaKKtwD671fRf4l4plkhVbRyDeNZoTGXFg34BjPbep70edgfjvzhH%2BIK0a7SO2mMhZxJov81X1Z5nmSrc8iTQHrIoMSEt%2F3tQUGBXhhiruqL%2FZve9879GnSUAqeNoppZoh39W2mr1pv1OhXvt6tQXBN8YnoG4SOdQXuzHui%2Bs5tHMPUvjAIAQSUH0hmnwkjabDIRt1OmGiWvSHrzSgn%2BDvcDNDa3HA9TOvgX3AKzf3hdSKzWHO8YQcoQx3wGduKsRWBe8QkyUgo6nv9e06YZ83pTsTYkii9Y9pw7CHUY73kjQfKuX0eyTzGzbetDcTpldXHjhuSra0YuZ7gb9tC%2FiJq0CrPouExm5pRLILzmM8uxYDTYSeyNAO5ppOR6d%2FpL5u0LOK3J%2BW78zvd9vspnMJ68nBmKtoZN0hdrwtotoGl8rSe9SoB9XnYyWyUfs04LuQQdN7gn%2FeYzHkqIK9IKHYmeElH8xamalcZBTxC0dE4lNVYDh5PG%2BkAZJ0gzkasPgpfNCHxB2SM2uJ3ShmjWcBOw5YwQ%2Bb0r9Nkv6nEVQYJKYI2x1LmC3vflqraLKhxerYrMJeKnDBWeVW%2F%2FG%2BSN%2BEaW1KUblViwmhjbKu%2BrdkgSIqxYyZFk%2FgJoYPfI69RUkUwh6bz0AY6pgHeCSlZLvULRn1rl5YboIKvkKqrqOrO9QOyv3e2ZbGiXUGSnFJ3VhSeyK22h8NNJ8pPKsjmLS9hl0BHJQ7SKSAd3Pv5ZcWqQ%2F66NEZq6xvKEGQK4GiW%2Fz2C6pZvm%2BwwFomQofKTZtiibhIG8hqAmGogEh7pCu%2BNS6U76rdz8NXL%2FeFa9Wuc0vwS7QWQhPvIFLqpYNLH6yfod7xyqSOeaFV2yBNkH0Us&X-Amz-Signature=cce32b74ab2038fdc94f574ad1986c10f9c92779ffbde727eb1aa7c91ac0bc79&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WPK2WJHY%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIG5FEgGHAy0WCyQ5%2FalWY5E%2BLbDomcE0hd5MoqThcXcCAiEA85tNLo%2Fe80%2Fr92fdlb7MnICgBNiPC%2FFEJJpfhyxw8Scq%2FwMIARAAGgw2Mzc0MjMxODM4MDUiDD8AUPetVcjI2eKsUCrcAzErg5msAKpKySnH126eyaCEqoeXwBq58VjaAFkgrEkQ5lwq4hwueddaOm6FLX3DNeH%2BCWUSxkQwR7v%2FS9E6RdpY4%2Bts6JVSkt6Nwc2zJ7a4%2FqInVmIQYCmTOox%2BXuIbX%2Fw5j9Ez9069PUFZSawd8xubgsfNjE1EUG7oVt%2FO2irpMj0sG1eGdex%2FqlFPSSKVUIeQBXsz45svmqrA1js40vf9tSINsnSwqeN40uzk%2BXfC8SrVMfi3PF1VODhvTCL8fYSuad2e%2BW%2FA5ok61q74O2PL9AKt4lYX%2FFIjRyc9HSM0IZOdBtM6vipN5HqjYPb6c4r6CUkTOkFTOHGRVoPZaClvOmBt4icoj2hnOfgiER%2FV3MgQmXYW2geaZZhvCWvqh9okE2Y8eeFM0mnny1YY8zktX%2FDxt3ZItWeRXCh%2F1%2FctiX6tRQYDxQJ4zyZcXmLecfWUhG5wZr6Ly%2B7HP0lh4DfYtn06iTIuK5mx4HjSrMO0X5RA2BGiDVdvArWz0d%2BZhA3h2oIku7f5SQOMLFLkRV9oYdMxkNOIwii3YvpuBqb0b%2B4aRSN%2Bsge3UQWrCG09%2FIji6CenHEzSg7aK3%2BEZZii0OcIp5VixdZMQ7%2B3j04W4B8NGNTAFf%2FdIsxt9MNSk89AGOqUBPRD2DghUG5SXZ4q1vdWNZpAMGLIB%2BlWxKWFYDEJ%2BNrW1zkFcl6FjvcE3NqF9tlUwa7sK0A1dVvZ0rFfgQMzjf41JqYRxc8lNWIwF0JAz7vWBayTUZciGZQYHiq1mivX4Mv3QzZZac5Ssx3adHdAZpBRCibPKzTFeCxpiXuSX9YtB3KKgLIeiUQFCi%2FjoYGT5pUMPDrAkCabOP6gNOPLqedf3QJOz&X-Amz-Signature=be95f71039be1a85add00b2dcbf400f0bcde2a4e94e7b27cacfd8ecd76f90564&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

