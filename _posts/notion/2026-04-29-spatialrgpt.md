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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWQSNN4B%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045457Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCenkRNrTI79m3S%2FYctUj0YEbTdQIT354fm6ivY2YOQPAIgaHBkNLNIvt2bG73CaR7VHo26JRutitp%2BoT%2FzV31ro0AqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNgPIOETLbkzo7wg5CrcA7GBGa046bUwZR%2FKgVCBsi4xqvzwoX6015DF4qd037ywZXmjv0oORJ5p%2BoNCcWkmLRIhI7aHybK6SQAV9Xh7UzEosqBnjTMWPsSZbcnxRDLTfoQSoUTzS2050JZ0gFKJudZVZ2fgCQy0CNPLC%2B%2Bkx2kPlvNSjAlgQXyaSND2bjRUtGTO%2BrH%2FkvxO0hmsE7W600agXtKDjNvRjMC0CGL1mAQuGFiE%2BH8sVMoqKRg5B4iNmRIKB2YjUpTAGkomzRI7nMKcDSziI%2F2lAa5gYgz0y6R9ntxFU1wnEZKKQReTsrrMLDMDCudLGyFKxXtM1qmNRCEAhzpJoH8Bt5YUmtB3Z9a5igV%2F09Macj1y%2FC873SUtlrldB620%2Bn%2BPFRklFLsBhkfjJIRcRWa2Wq%2By%2BK5ASWIfKaqNeXndmm4KonR2WpqaI5FL1DQ3hu2%2BRUJBiFhyGlro%2FlgxQbZH6NQ8RslJ8rQA7fe86H2lmJHLEIlRj6I7elH2tw66JBmK%2BeHpFGC68fKgkN40ZP5YZ4%2BQtestbxjb2PqX8lYrhJdZ330Gk3fja1q%2BEPLLJ%2FObNOTtN151JbIazdR0V%2FzA7ZwiakKice%2FVGqp%2Fc7iwtqKVvAnugjvi8wgGLQdlyTWKWnsZMMnRk9EGOqUBVuIPkPDnxRb3eVivzfD6dwL58XJu06FtCxgchmnAUyFm%2BVweXGt37dSy8SpaoY15MfFbs%2Ff51kgRBc%2Fc%2F1eYSn%2B2z6UAqwrwjH%2BSjc6g4G5ht9sykC4CAHupwAPXS4vwY%2FboyrOee9NghM4Ol60aU6D5vDnlYLF4%2F9A%2Fug2LvrepAQ5Qi2fBHlqB92osjZ0yrZ005zL5RqwWWi8T%2FnCFW2McMmUE&X-Amz-Signature=6f990f47e056eefc9a749bf3efc4b732ab2735af55ea9dff62c042a76b93908f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBM7GCCY%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045501Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoyoW4UM9TN91OE9luklIe0jhhPdcyL%2B28KxzWT8jTMgIhAMeYmgy75J2Ej29XC9YQ%2FwmKfozNA1DjLLLic2sR%2BhY0KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyoLgy7mCmvyI1yPnYq3APpMhyR2V1qzaSRc%2BPOw7ZMcKriwa3%2BW4UTjdD7FVxN2IZ7rYvl7TFMQXRQUwEBw0deyskTPfZmcWxviLRdwjjS%2BFOfTCXBb0bGLeKsQUErVBJmpvXk6Uoq2%2BHm2k7pf%2F%2FppfSSS8dhPNWOpxkWChbFNPsmmljRV8XMS6rV7f1NqJ%2B74rKlM%2F3icU5xW4%2BIk60MYSFjZSsvS7VBdYQm1%2B0bPWbpl2ZRThv8UOvKktjxTYWAE7W%2Fd5My35cu%2F5otOxQyAIBPZDmx0gRCVmd%2FCRl21IFMPmYQfJ21CsgRaLLKk6JXBlrJA8ozN7SN9CR7qB7wr1BaVqmTmUCKDZdDxcSe6AxaoY3IMfigq%2FObsQCETxhWJMYggcTNUVGVSgMw5lJK9Ti%2BClmn3qvh54cTf3pR9zaqVxq8%2BCjnQqverxBUNGNU1c4KWrvXDFSvBrY9rSGYI2SCltqDkTLw9mtkdNZIhgl8Kd%2FtozPNBsXfWpt3EVP0QGss0ghSAiXGFgxW1B5V3iw6FBHcobUUmD18E2RG6oNp9KLpi57Q7t8mwcwYTuSpUjdT%2Fh%2FpaQg39vXc9Xti8wkN8sjjBu8JxQteGRRvttMRlTcwu65ANrdWKKU01gWLe7784RzqVYQ4NDCg0pPRBjqkAYGei2fp1CImrj9YSNPgRe1dEq2PjOxZLODryEUQFfsgbm0pMf0Jb3ZqdGg4A4dWB3aVDaktcYpzSHBWFFHBC8%2Bcsz6DAmFc0UTAg3vhsblVqkbh%2BvfKqiu77eHnSeg9JoEkNycpJ1xjCeBKQ2a6jkaz7Cg2S%2F32%2FxrFK6slktbrTLoFaLZK34T1e2POlfAEdkbJXc7ria17NQMHDLtHVeYidXnn&X-Amz-Signature=d08bd52e6d0eeb389204ec1c01190e769d8053c53f322b3383f6551e4d0759e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664XNBOHE2%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045503Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIApiHdmLZ0458CT9HbCOS%2FPm2PQnvqAZpmBke1X8gLaVAiA2ApBCVSTsTI%2BJtYkqmMsrVgiTpTA9SQ665Lmn9olkKyqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMw3hSP8lVmkGEBQoVKtwDEl9zBem6l5SvclchtYMoBWBigryklcUUmplWWkh3gQqfVuML8gWpsaXo4COASs2UHymgivzv0rURHFKcmUEj%2FtzBnrE%2BfhrJ7n6ovYzCtYxQjYIMAGmP%2BYbtQd05zgbonhZxpnfdZzHuvQYYWzz8LLscYeEHS1%2BJbxG8Zd8jT739Ugx4tPyxhEUqMU1kFWUJbmCIsn4FuH9or%2FTtJ99N8a6qTR0vZJ8NjixxRZCfta34ZJZQRhZt7coYYmoWcxT6Yr8bzyn6cqWKPZSqozXzDbhZ3Vfpt5zlOvmbO639fh92aWwcmVoUhUpRWdeyHDjihV42QadyWy2HDClSqPYMPFTXhu3s5B%2BJiGLGbOZUyNe%2FaCS%2B3m9l6cYdjnBt8kuAr3qUprVOp7RDqw4fdlFxpFNVbzgecPYCnBUv7qlsNmPN3c8z8R5qdzA%2BEY%2Fq18LnhBT7qa%2BYtPPsmE34Lqq%2FaxMe3C18%2B0NnfQmEcJF9jhRiJMN%2BVvf%2B1P4pJGSnZh86AneoHxKMXGEdFNPnKah0cL1TePKcqk08ZU3NMHeflsiPEedJ1bEdBBoIcgybkCsXMp1FybckBrD4cFw6aidmfyfJpsqxNXsLQK2naFbHCCX5lpFWiE2JeZfSn4wwgtKT0QY6pgG18%2BzxJYwDUojAUxLNTeHrHS09Y9F%2FqRgnE%2FzzqriJIBSfWDX9FtX%2BAKjKWQ7aa0IOR%2FNIUBG18NBRBBfdJGLfE7lJEBslwGL71xPmqzALnye34p4YtLqVmkIHWo8YaG70Ky%2FBEFQiCbkjLaIdPO1V1MRDqQ6ipAiGvxEKEm7lTrN8Htxprm18qMF6BaSpI9C2O1W7ZJHLVxaIauv6EG0G0eL18Rd0&X-Amz-Signature=4207eaabd3a960d52265a6d868ae714b1f7dbe91f38371d4b13d577cf2b5e896&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YTTWIAVT%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045504Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHlu3QjQ%2Bca%2F7Bus3JsYxIwgrZXQ9OjAjks7BngjlkihAiBVqlpH8Y8HBWeP1lA2BWrtqDWWT%2BHvbAfjVtD5cn4yMCqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMuLBEJTv89%2F%2By0SgpKtwDfFCgLIR0DQ60v4xE5kKnZNZsOtNGL0msHNOUryJrRg8cx2o8zmyLgohBo43cqsbbZgjhe6lnTZ37GGBHpuuZG3jjkxEQKH0hjh6n66JCTZRoSbcAjK5xxE107Tc131ErdOHgdOUwSHx7BcR%2FBMR%2B6AlG7fLp6jqwnnQd0B818Y34sQIdjTTOvC%2BbnBF0gG9DOkUPEF8GGXC6EalTxAzP%2FJeShgysc1e7KEW4IQnIbPqb1RK5LLV%2BiJfoRq0f7JvG1G2Y4TsBQJ%2BJZJcgUT5gKxlknHzedD4FO8Vx%2FwrgaTfXDm96x5AS1g05Uisefjua%2FqtbZHCgwmT%2B7J9ir0kd8LJC6S1oozgNU95SgAEZ3w4zil%2BQDpkkcUEq%2BOqWDIehJPwacyK3wqClkqYzxdcgBlC9Caxp8mokyfDxXY0AUjX4Nn4mZJlCKF3cSq4Ib9uMmYcQorVZgwULlxLZFl3anxmWLEn4rtlGENW89Wjk3xogg8keyWnpDRIcT%2B9UaTVKtxO3J5MvP0ij47HwENiaCKIme669XAEchBmigkdmCWmEfkdOvk6rBsYLU6dk7Hw8DsHTkRBtSRDX0JfYPY60fNDCe%2FY%2FDW9DfoU5IJPqn0yN0k5iXmm4NbP5DJ8w19CT0QY6pgFc9Ng47fUvZGQAjVJot6nluST7DOxXbsS6iQ2kg6dln3enuD%2BYSiOfM1efOxHvJ3CC6VhowSevGBtoecBBQUPpq2CqGoYjfZIFJ4FjKJYEe2VaeZrqf4Rt5mrfijdAil44%2F6imdHDf53IrWwWhDHuBWcq0uI1cZrserRL6U1iIK8lr0lXIoLGrA6Q5dl2lQX9OiU2FgFPslRGOliLkYifX8fve1Kq9&X-Amz-Signature=a02381336c7e59486f84a23746f2f38f487d92d05db1569e772cd9db28597adc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V7Z4G4CR%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045506Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCgc%2F5L0lRLCb1kXA0YJCeyrkJIt1sLyuApri75Qsw6mQIhAKXLKm%2F77Jgvm9yNEynob1fmOjJXdCiR2umulejsqQijKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyMUXATO78Zf8pyNCgq3AM4svFRN3ukKD6wplF6LW7Sv8Y3HlmM1PIT2Omv50ikdxHVdY1nf7dK3ey8gaW%2B7qhwlHsH2TsGnDHkQBibik9esA2OG9ppbl8SU9HlN9gmV4vA%2Fq0fvXNu8JK2Z9b5VODfii5xDF0%2BkBvTQRozZGpoJ07FXMwCP5fpc1SZoETMEfxpRMD2P7aIxSks%2Ft246IlizLJ0dDG9wuF782tN0iQAI5nIXJyNt64Hx6unohjZiVAB2dDFhi0Ot6Gvfb7GlLpANXeToN4Ngt5X6dHYNbc%2FteKm0F06TgA2AuwcZKiDmpQCFvTcLk%2FNpj%2B6sucTIM46uQ1635LqVbX6OxbGXZqRsRSkPbDpPlvNuFxuJh9mfdUD2IRETA2QQMCpBpLne0qMK1Mnob0lCYENMF06y4vJsaANbswfyyu92r4uN9nXT01fkJD1vhpwXfWvnns6193vs3ew0BM09DrvInu6x2Z6mX8t6BcoxALs70Nr1WKAAQ2HbFpaU5gjjLY24%2BG38Xx%2BspnO4F9cgr1LTrDZVFqvKlDxGcAbq0IM2F9smUNVAOkA4Gmqm1s0fInLEsIJI5tFRWG2av5PNiQUHE2Jep6Bs2tu5TlrhJILjf6gkIKDtD2XlBaBeEPc%2Fj71TTCa05PRBjqkAYkuVHfNQS4QnLX%2F%2FToPMxDusm1ZykR1vPQOZSvIep4om5wIeXuWrsCOGGEkIOaDVUU%2F8vLBxiTRZvJdEhQ%2FWeVEqh0f8ngtgQqAJMtaLdO0VlOSdvvIk%2FR%2B3IVT9GHzlRTSifmKiq2yOyYxtmBQfEiIUJggS4tveQmDOpuyvzf3CJYQdv%2Fd9N64clSNCPFsDtVvthI5BZS3XMkuAFdJtXkodi%2Bk&X-Amz-Signature=fbdf54e28834c8064bc2d8daf53a559ddb7a38afacbbef5ed9803321d425ab5b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665WRO6TJI%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIB7pL7dSnM35GM9%2F4dM9Srchuf4ivC8U0z65j9FH0AKOAiEAwtx0sTuckTvAO19n%2F1O2wH3ASlgwPSYgbFYOfr%2ByrQ4qiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMlgqRz7Hv5iPkI43CrcAzMIokjs4dn2Vz2nsj%2FmCES%2B5vjatu%2BvvlsJovqP%2BbqZdcWPkA9%2FjM%2BEbqBoU6ZP2sVylVic32aZoJGNn5WTBInFSMGnl2%2BrpFtkJnUaLu8abUCZ4NV%2Fu2UpDmqGRQym%2BDkQ0NpN8yXpTLe7jt1o%2FrVpNIVtEDK20l16bUQx598LxV5TXN2kbVtX2hvdhh7AXmjM1VJKyoCrxfNu61dK7%2FoGQLK0mVKTq6%2F%2FvFyFXHvjRESJd0U3D2HECyDEGMmDCPQrCndEhFjGewb5r9THLwtSFWPJklwpf5w0%2BQS8qANwEsaWJrl5G5IA39oC8yoSaKWFyAQsQs%2B1bJdCD6zGsjy5rBv5yGaosAbJTUsX%2BIMFjpatKp74Pck6%2FBrpSrbsoG07nwTxED9fJuIciYuwAjrAtB4bf%2BCJeYf5i4llGytapfba2rUB1BrdrIeJteSEWc6vG%2FwGSzefPpTFrn9H1qUdhDwKiviRuNvh7XuLGAQ%2BzTaeS2YN7h%2Bk78PH5xyc98andy8d5A149fKOAVZ6u6iT2uIJoBL1tnvoalsCZ8n1Z6b%2B7Q4%2BoYteiyfUuUwikEllLmEomhNY0OdxOdpU9VyhfN7Ta5YBmjSy59XIYevY6lXqMQtuQx3tWWakMLbSk9EGOqUBfKASY9RaibT1nr8heUJwAEwMnuRsC9Vaq%2BaeZ3WGnmTUTd%2B%2BiTUghzF3PzMdcsPVUhyY8aC62rnEEoMLnnuD8e8dVUgONBuHbyXDK5o6ChvI895NkBWiSrC4CgAda9iwTfXe5w27FaSeCosucHtI7AGFrXXcYS9DTu6UzNVvoVAjHXxgN0fI3tGLIXZNgF7VXXbHwvrKozDLqosTqjz2kGSNRAh2&X-Amz-Signature=815808dfc77bb6c57517ac3d4e343ed681ddcee5704c7f4a5853dbb67a3ce466&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZX5DLBY%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDWY6GvADdfcP%2BQiIi73XdnGwWG4H2e7Bi%2FOxNg9IcKzAiB3G4G%2B7G20rNWgftrWICe49pypFKnsIdjnLAAMJxvaoCqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM29bwoqKvhpKXgAnfKtwDXJAxUm5hnV6kef%2BomJbE%2BMIJ%2FsX11MKzCt6CEjSKIN8Xx8WDaVOpY89dow0pdzJAlqHqam03Fxq6s3XgR3Z0cVPfgNeEdT5q%2BakBW6G4dhgqIhMorq%2FsoO9hrg1tzsnELmlfJtZjwjaWiE6MD8jkoZMAxmJiCKb8KNc60zsFFlhN7ZdbYpQr51pRoOcvR%2FuVRvsjqDW2klx3Qm2kLs3GfWkTCCV04p76emha0YJOPMGfQH58tqY66rQadBlneMlI8Rm1k5J6JEQyrpNz%2Byr4y4QCvMvkp%2FWVDFwY%2Fb4PMssjGIeKt5ot96wEx8VAuDNR9%2FfrpifPGHY6heQIdqjnrdUaiNCnPpBCpheTTKq3ZnqNICLpYvmE2LiT00hsNE7i9iwSLRztgatiwM4cdBk3k5TNDUYrNiDQNfCuaI1L3cNjU0cdAZmDjapfE1bEexB3WZaz3qSzKgovnjUppoRVqWbwWw5CuAhF1%2BnA%2Fyvy2TdI6sz%2BUfe4FRQu4OPVl8SlBJni2nBkeD71KihPnaI%2B5lO0mIF0hi9IfzJfy28LtRGjx4Gy6gO5yMq8RtHZgzPcmfs4JojoksQvLNOqT9HktfpTiUh4oxb6T2mGDGNf90ntd6%2FVkBXtWhtMzvsw1dCT0QY6pgGElAutzYdHAeBUEnjQNzRTXQv16d0sFvtiTiV6BgKLS1sHtQl6EKrSti0s6xdPSnEvgwQlDC2FKc5noCiG4fhXXDefepjMFvsvU%2Bkt2oKxPZ2eOl18cZQ1KK7crZnc4G3Dt9O3BnxriS2qTdi%2B3UGriCOTd8%2Bq6xWZkTHPFQ0pR6WjYsvhBDIVXIlK0kJVpggfJXIBmZOpFkT8h%2FuKyFsLEzI7hSC5&X-Amz-Signature=c72b8e2a8f6b12fe7ca5af4f435f21f362774f2fbfd0803aa6770a9fbdd3700d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VKACDWB4%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD69nEey9p9%2Bh8jOrPt1qs%2FUH8GYS1O5yVtcI4qJzsHwAIhAJ7ZoHG4fmQ%2FwZERrgbpyspWOTucE5CrJ6QqY95%2F5aKxKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxDTHan%2BWbOzhHnK0oq3AOcNvX0vev2YcAN5NuyMxytkQ8xueCvSbe6sYEsg9auUWNpK9ijJT1q%2FWnngcfmYtJP6C5G%2BK%2BVTJDAeYvNyLm%2FQi%2F3mncDEuBRXNMkm8je9HkmyhMCHOn6WAu314muh7bByh%2BqU8Rn8O1UopbZp35g3oxtG1nBtVcm3V08BZBHPcwXB%2FbZ%2Bpri6wmmHGEXQf%2B8Q0O9%2BAbgnoANbhF36TVDsk97eRkZWWd9SIToEn1M1aQfdJ0G8qWmVSRa8lsR%2BJajn5EDdISSq5AP9fAiM9wSe%2Bf4fiylzhDKQ%2Bzny9dacmTA4J4oT8r085nirU%2Bq6Dtt8HUfuDVgyOsSPfYVGyXumZCTREpYfHUaw2fXCHhZrCueaWua%2Bfhva9baB%2BBqgdlb4OFAe2CNu7pxp3YKYG6%2B4GpkrcqufMSgPjE7P8yaxCblXewCA9ZBet8851PO%2BNEqnGSX4rY9VbSvwYKkkPxLSH%2FKfmeBCC1MniDDOrS6N%2Fzd8q3RwF5Vv%2FvgMtyNUY8LxMNISegJfaKoee75zVtVT8qHG27iW7QaPdX60dAdolf4IDtTdRY8v36qD0RkcuCXVNHfgFzgRu9LicNWPLMwqWz%2B%2FXhm8sAUhRRxF9AWgY0hK6PXFXt6dI26VDDX0JPRBjqkAfPK0%2B8MIETp9X65SwbTo1WMPgLLOvoECJQIaYpWW5b3pgzrO8rGTP0EnUSZzjpS5PnvIkfpGF3CTR9UC3E7u7pcFIxf2WXYR%2B1g7oBPIdJ43lMafpAUtCKRbfVoRTPSO7cNI4qTGiiCA7veyr%2F%2FiWeNF3kdp18Lhsw%2FgzglGS8xGreet8tTPImPq1Fca3HZNUJHe7qqiE%2FykZa%2BsobdoMx1kT9d&X-Amz-Signature=a7c568eb328517692015465d39640583b90c95ff25e9b27155bb1c6897e8905e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664SMNHIOE%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045511Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGgL7VxVN3TZw2rZX9pSJ28GCWFPs7nrT%2BdeAWXNB91zAiEAkhy8H3p7wsK1o7NA0V8qW8Ig4GrgHHC3eG5YSPSZDXcqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMh86MK6FSXhcNKHKCrcA4LwtN%2FKU83v%2BLlG6aZ4tERqOKnpl4DKAuE3p0W2t9EnUucdCuWzVt%2Fl%2BjFnmjJqS3ggiHjKCpFGFj5ZP4IFyM0bVOPImT%2FsZUrKfiECOIZDL%2FqeMPViJT53KULFnIzsKmVEabZ81f5WAZ2X5WD%2BTJwoeEQZg4mr2Z0URwGQY7pv5BryfEd%2B2LsrEBVTHpg6dVw7KrFLbxP%2FS3D0nAIHbj%2B5hiqeGNQeVfTJwP10uTlI86J5MHsPiAaGSphR%2BeYvfypZRT%2BVBQUI5no6mVc4Mipnx%2Fx4bb49UygmpOCSeRhqet7VZiiWN%2BevrPI7igrVdFT61aSpPs9j%2FwMipgDM4x2%2F9xuJNDOoJopRQl8orE5Kr3X1Kof9WoIA8cbc%2FHHerBxiHXKKcAqAd0qA%2FGLA%2FVtEhKr682biKi28zwAvBKQQJGh2b9f%2FILGPXpU9E8EjHy5IhbZv5T7V4uUmwBt5Tu9sZeBipHwNLD8FAnC%2Bs3kIR9M167fw9agTbZSMswRa1PYpkS6SLoAe7SvM34ixe1H2aKG7NJw2KiWzTdjlFU2VUq1HreHw8FtuqZOOqFCl3sAPjhK1jgfKEQAIRmO60CLOz7EZGVPO0lTlVPrXMFz1RQMGHtsgx%2BrAzEMSMLvRk9EGOqUBw0FFvRTzzbVVS%2FRWZJIDN3g0%2F%2FpOupfLP%2B%2FWOmLeEg6JBKtVS439tdgk89y4DhSe0KHdwa40Y23Tpon9NG82j9yrIJUpvXQeSbGgGBNXicbxM%2FkUJo1chxajqBDZ7HFSiiBG%2BBGZrRAj%2FeWejx109Rsci0GMqjCiBfDgvbjBk6hKbkODN%2Bt8rSxcCpHrqJ3%2F1bBaa6JKBYhamMx7F8i2CgWYCdZw&X-Amz-Signature=61e48eef8fb01bf4d8324d98c6832451f2ea434a595311bee970d76896207b3c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662ZYPFGKE%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045511Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDpTuvgh7RzU5pT5WHLsXFjmzohZCOM%2BbnzbMAEqqoeQQIgJx8kZOPkRh1KUcicwHVhyyZMEtlz5LdEm4AKi3lAz%2F4qiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC%2FEkm1tLTymKkYRlyrcA3Mwex1RB9KuTYUZXyaaMcT%2BPKN8PJ4oWaDrIijyhIaoYS3fpf0NGvjbrbIMALkzmDO0nM0Hu6kgSTnQOt%2BxpOGvgEqpOM58PvZy%2Bu7Yn%2FyZz8WRedur6ZsFf69m8r5T9uiTFVGSi2kgyutJG39aLF8BeWA7iZcc8%2Fo3REBzaEaxuW%2FjhW5Tl9i3bReYHNbfF3hxnnEvINWi7HtvvPz9ogufXzMOTETa%2BF37HjXUz%2FW0IdjPXVV%2F38GVJeRtEHiegtxay1qZr3X0iO2dtiLsmrrzTr5za6rkvnAzg57e54f9JpzH%2Fj8Jl1fDpk00WUV310x77VRSIkvH8dddkUMK%2Bmtf7S4gksA13IzzyxqgZTsqkkdQ5gQD2OLOXEKq12Ph5g19q8QKdQzyMMpN%2Fe10AkJv7q53Sb67JGtVAc3chB2FC0qz83hRIcCftqWyJTcswV5wsrJYg3ualBD2qu0q3Sb3vUwktQAsIbV%2B5FeMGpbFgam4SM9t9a9vM%2Figh8NumNncw83UXTeRUBJD6NZaRO8gSuW0oKARt42%2BmysLoMD5xmgq68NczmpN58KQI1c5LzKk4b6NjRPTXGAxgSFCEguDNLq%2FpzidEh3bx%2Be5gF1v0CzCVh4WQTMa3b%2B%2BMOXQk9EGOqUB%2F4WsKC07Hoc52k5710YdRSTerP%2BC9%2BYjOMbioDbnp1buqArd3VOJBSnzbTN3%2F%2Bf3vvfLtPbLOIgnrFH0HLesnJ9RcbI8r1ATmgQMLPm30f3prRKUINrvHxrAlAtdoyD4L7hbqY%2BOTleKmrKiz1H9SCjTAwSwspdw2CaqS54PINSHkUWQfvw1KaLEcprQmIDRE4nlJhuz6kKw5PB8YKkSB5NutqfB&X-Amz-Signature=e8047f90368b7877b7ab800d2f1ed33648d56485de37e6ca4618f18a6c1a33b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46646JZ4NKD%2F20260607%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260607T045511Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA6laqaxoc%2FEeWCvdndXbNQT7W6j9wQFlK1Ow8IETdfCAiEAptCeA0qrUTMgSdXoRJpgYBjD5P4ynHIp5us6%2Fsh20UAqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKyGRG%2FOdbS4Doqd9CrcAxJX59TvLGwgmj3UjPBKZlIRpQWIUnQ2t5jIRCwXg2HC42DGFLKEFIyz7c%2FpvTg81BkRzKRlQEk0P%2BbUpJMMW0y3Ws9ZMbZBJgbl%2Blu7pHCT9LApVONfLwLj2nsnJu2THr6CGiFCBpg9eFLYwvf6UVokomzP8SREKUjbsz%2FJ0nKZGTrT0rKMAWk9NKLbI%2BiNDgd0yjuBhvDcLYnwCVj3BZ7EU6JEwX2NSAIqBxe4XjyQgRLO6iymWvNIz8uSAEEctQcLxuDxefWL0tc157VD7%2FxpanEkW3g7vIwwb7RU5d7S6AUcg%2BK4NLhkhoWFy5n08Dw3PDHlHOkSW%2FtB%2Fo97dlgKDqg3WG6I6DgMzrgh46RRSx8ycNoxNV5slEkaDUUIC9PzwhAHnHQ3WBubs60H0tLO%2BLxKbrS6eDUKKMOAGTxmdErxJ8Qrg87P2EeyZcQVs%2F0K3HzaT8jMOoUVftolnfrRrJHmQ3qC8lYn%2FSFAUwTfkf4NX6Ve9%2FIr9%2B%2FRuMpBbXUABcIRPMmwl04IuQqFvw3kzrgylZ183Y52V2yP20iw%2FF%2Fr8w4pLcxQwIFEgHKdq6gyWaMMi1VjXYyiRP%2BUfuM6D6FWJG%2FqyFwFkHb7A3m6X05AbakvyH9C717eMMrRk9EGOqUBjAOOhUODzTo3zkExpxOAGv1%2FiRyZBUHADq%2BGMFQJjIjEWdJdsJK9FOAGBibsCuapPRVq8MhHirnpdAHh9HWBeqqhd4l3UUqIcMDmoLtm3AsJXHLn8%2FNzQx5zQvncd67RJMcRLxnDxgHYb6j3Zn9ThRqykyoYv6R7NRpzo2hxSnqKl3PbHnJbsUCYQM%2FS%2Bk5h%2BPvjn0ysTu15KwzuaBqvM9rCM8DP&X-Amz-Signature=595a31f15219721eb80d62f1442bf3fab748ce3813bc40015a54ab2ac35ab0d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

