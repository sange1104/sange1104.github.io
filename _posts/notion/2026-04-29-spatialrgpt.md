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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V4EW3VFA%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040354Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIDrq4LdXIgIRT0wX4TvgRdbx%2BpMrProgCJbRrmffPVXMAiA8VLD5jR9zwR3KPTZrMMCKiUZ0%2F%2F3rKOYCm4REeFiisyr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMV%2Bd2cfsvB1ziTxfSKtwDHQb%2FjWHBQI0X6ACbzQmxfuSWdoHLouLkPXVhkeBkL0w3g4CnTRLXPbGBGUMTdyNo1EGqssluwN574chPZmbLVDQKL6T5bb7ydDsvT7zS824Y2pe3LbavXrwLh%2BZM6S2CFTpbHqBBYCP%2FdCpa%2BNBL7L13ZEhBAbNVC%2F6K19u1nausQ%2FP0d8sagufwpl51QdX0Nv6lArlzsi44gYylUQ8o2%2BiHmZahjUgzAYv6WUAgUwH4LFLGTGk%2FSkrsffyBgryfeUNaGCJhnzZx2JZxVnzlz1qlYsmLZyVD3lj%2BZj0VX6gj1AA5PKfVE7lRq0f9R4wBPOD0itUO0L3VtiyBY3NGPBjjB0rLiicsisn9ND2yKLNzqrpkcf9GdJmqM6xNr8IenmUUSVhJeGMQiZbpK1StfexMAklOCP7xjvVZCpe1GJtvpKEnc19baIeag5KL5%2BKmHYV7YJTa3XyEQBkCM5Vy4VSKCT%2FL35AtslfH36m%2FXDMkEU4ssVrEuLWj%2F89SRO1BqKtZzFjfipFs0ZXouRvrzc8IyShYplRpXuqvQUdpu348dL6%2Bvchc%2Fc%2F6WqULmnhORGcDkafj7p7inQlCQg9Kg7Y0PL4gTiYSBgBag26f2vUyhk0nHg3Yqwa%2Bu6Aw5qOK0AY6pgFSBVjsly%2B0uwXmkuStPaIKCX8gH97V6EYFNuQlhDer7iq4uqVG%2FJZNST1oMZST%2B1JzRg7%2BFknOZLPD%2F%2F4wGtWEg6r7u%2BuX5T6%2BSPJLhshw7NpkKEmLTcVPaX2xbH0uLZsQHfUYbIMFl9ZVSQfgVT5iLrihTUlcKsbMm4rAukaL8ygnHtLPrB3gHYkb%2FkUm11h%2F8oC%2Bgp0kldJgAJeUuDpPM10lPauF&X-Amz-Signature=307cf5103c130c0bed16b441cf670be3c2c12a1413a7eb45a0665a55c71440aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZM4EMIC7%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040359Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIAIz8SsIQRkesQs8ouwPHIWZGx%2Farl6lWWMNW9WC6KmSAiA8GM0nOVFsKB922iqDYhfaddDIcS2rq27L4fGuiHAsUir%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMyKJqQ3c585UYwhQuKtwDst70CHu9eHBAXE68oJTsCIw6OY0e%2Buc8Jb5BRh%2Fz%2FvORHCCetMw0SKZvo3iEjAoAxgb0GR5O1Cest%2FCpfSidmVkpc%2FDKLt9028oiK30HXrB9TPT8HTmDTN7ot%2BUdNmNp%2BgTScXe4AxudHZzOOAfCp5UJ3xRj%2FnJBjP5yibWqHXAKGIfQA3OIkMNcmD0XMIqEa40Yj2ivaXJ37Vv65i9zdXQT94bOUNcqN6au0CAJXnk%2FYOgxyTo52%2FoqzbhKbKR4tdLVeE8YhULIO6%2BdWz8Z2UKr5h9RLq1IlI4Y1qucESARMjteASa0uS8eufs0URYM1SVrIwFOpKn5qy9LN15qTNtjdm45B1wgaQQpaAQVmZ0zYxrn6qhZI%2FGRds4ihlFJIV4HVoa8izSZ%2BAM9PGvbrp5Rrjfki3UP7%2F%2FJULWMAyGTEI%2F15cjQ7CExpgOHcQEXT8eXAOuKjxmhohrdaGHglc3fUFTFTGvIZADcxUVSKQ9bAv%2BmBgm4toEMbMNoTYgrAFKv6BbGIytrbvhcGpEu1HjQCVnZZfRCo0figEe%2BcHyW7PBlzXGvgPSCFt0vgpSyr%2F6KU3mXBRHrwvaXie%2Bun8aBIjE5x3l6bbDwGQ%2F7IVCZiozJcugNmpRrWEEw%2FKGK0AY6pgGwK1j7XPCkJV3lf3Ru0a82FFmuSpid31SiF3ZNF4tiZxQ1ZeOGVy4xjrL2BGUfeVMFV%2FEjJbdqxKqVk6OmZgWxjt9N3FlVREnGLVEdOo7cIDH%2F9hYoUez4o7%2BYCnF7fo5fcw8BAd9IcOzXLoEQq%2BjIaE%2BE1Ak6j3M8nYb41XXPkQdemlWoUNye%2FPwizHKre3WDOl%2F3XywzmitpcS7AHU%2BCAGd0Nl1O&X-Amz-Signature=7e385aa425c937b0d0f466cdfc87ee37cdb01ea1b39475a6edb6236dcebd8287&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466THBMVOEP%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040401Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCDMnCGwjMk40d8Ab165yq6KlKVs8EyA2YXyXtAR2PLeAIgdj4ZG7a8JP%2FxvvHLvydZjeOgEybN54hlwyphhiqDcCQq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDAPCE2KXF08%2B36H4rircA1DF7Hb2XfT1PsqK8fvX9FzN3LYPnwDzZrH3PD6nguaxMp2yxw9dqWYUYuyrhgshKx9uyh6hIETxHYzKlfOCU8TDlNrDO2rYfDF65r1vtKlgLKbW91EslnUeZDSxsItgUM11UA3Ijx%2F2VTJS2w44fs7p6%2Fwm18FLWjfHrgdc4ZTFuJ6IP3dViqOOPEcR8fViZylN8DK9bev8zFiQxKRsjLeDo8Jtm4CCWJzO6XsJCbgVUMCC%2FX%2FZXoNct0eoo2GJB7gKZleTkegLMaQu%2B%2BQlbvbXB3mK9pmAxVOmOo3IoddU0IOiC1P8lCt42v42n2dse5RJOshCtBZ%2BfGUmQ4vfN7DpbIEtuLGCAhF0Ed4lizH2NoAdeACabrz8mRHlf%2FzFEt%2BipI%2FOEUzOXXSeGFM1ArZ112TRFzSZi47oQoArk6Ry8kyrY828CWh0jKYy8%2F2bSKNm%2FYs9k1OZg3wVuC7VBXYry4wCbZgabe8Hw4NjZWFqfPdaEMPVA%2Fev4y5dH82OdnRDeic9W0ZPIr1zZAQBV5eoJvmo%2FKDkR9Ayi%2BCEDoLW3ERijqElR5hr2uflAoxPwyXGgRE1QH0nazwsKNaGJSXngH%2B7jZQdaJlkAIZI8bS1XG7E6fAy1QLym7CDMJGgitAGOqUBqmj2wwhm42ptCiENQ1OdeIKtE0tef0O%2Bo18ahLH%2BUM5rvS8Fxt7BUppfo92vxejZGu3qQ9aEIlzeLsHd6TPJMDgDYrEb34cVx7IZfGE%2F5kSDiOQ2rFBOfhzSXBOvxjxCe28ypADfTgXB7ByrTEPx9H8bV7BPioupzdXl7LUbBtxhuuzlo1FHlMNgNSg%2FgoXlm8TddbSBIZOMyx1TXxAL8xVU%2B5sq&X-Amz-Signature=175801c9dc7f9dff7c78e6e6ed6cec7ec44bc07d05d3891383ef4d79e3c75ca6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46674ZTI4YF%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFwaCXVzLXdlc3QtMiJGMEQCIA5tGUV%2Fuj8ibuVCtEPK1UEy1y0t%2BnNr2B%2F%2B81PDolhUAiBlP2saxk5IoMkr8tEsYOe9mL5J1KcOD%2BJpBsEcFNQrayr%2FAwglEAAaDDYzNzQyMzE4MzgwNSIMlPTeFdSwQPOuiJ3YKtwDRsOnlkhFivT4foKhd4w6FOJ745SmKpR5XRa9%2FEYU%2BaW5nbiY%2FgbuZeUazrrVGalB7rZxpT%2BTVnpp8dIRAQGlAmuWe1LZxUYksR%2Ffdy1HR1VwFr4cI82PsWQahlB5zgSVYFbBNt8E%2BV8bydJ6eBHAZ%2FapeoFi9JpUO92qsCO2DxSu%2FUSv33dftD61mrjMESbdxDPDVNXZzp61vS9NddediStZY1Wu0jjYjVsMxp7%2BfePBYKSwN3e7Pe7LWmH619WLfA5XhVH5oOV58kTX%2BtXQz7RgdfX9OAARk%2BNrWQaMG4T4Qx1usoVHjlugEqtATbk2CY5dofiqvXllyTNPfdbN6opCrFnUKUAO4WtL76MjBhA4XzZ5lqlySemG5p5YhwTMpRYs5cU17i2w%2FKTN0JSv29unmEA%2BBZ%2Bvobclh1F1rxI8UEBYH5kcojPhix4203phSnBEXytXx%2FlRhXwDVHFp%2BlStyCQVse30UeYdOwB4wEk%2BPO05Llzr31n6Q3iAf6V6h0Ii1E9slZbXsEqv0ySOzO0DZXQUXKqMpTcFt7sT8bXgiSz6OhBLReYVQXPv0qHSmZBWrnMAMDocfWxzAZbUlMJSv1GHKEIJoqpMel%2BH0pieErIkMS1LKgGW%2BBIw1cWK0AY6pgFkOA6YlQYXbl4IUjhxG7A6rQCdZXQwir1C5ZEM0rAyGloevLHrjlL0wUL2Gc2M8cLTqS3%2FqQSCiLdIEO0PBrr5PPJg8uVONElbZN9EuKZ%2FG2TSDV2JLS8rZxJwGqXGvUX4C6s2b8YyRPbZ1UPhZKtW8tVESFFIiIUzjPk6E%2FGOGM1BY15XXBys8SiBqogWxMnS6u2EwELipIWTccYgm40Gu0BR16Q5&X-Amz-Signature=004e4b55b10667d27a39a459a66c691e9ddd22a2c075c93535f6f7ba44147309&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZSK4MJIN%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040404Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCICcnu7BT0zsJG%2FDTI7Qb8CknxwqBnZ6iC%2B0dM%2BPsX%2BAQAiEA91YLZRZTYPOdktchv%2BhiFvolr9YJXcf6xQvwCNgwzroq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDFZoVE9ypojUK7uW8yrcAyEEEobmJsY%2B6nsCn9yxv2m%2FsrdU3X6wntdJBUEPFYvIxxh74vw%2Fwueu8qniR%2BEu1SwOGSjP4rP0UTcnaf3jmhnu5hKSWRpTA7VT%2Fh0fIv2E1J%2B6Gr9OQ7qJxYOixCkCdmVGGpSpyz%2BAkoZNsedGY0gGYYcq8ImClavgomEAigzQVQleau6C8AQcITKBMFgqolAfye3%2BC3qy06ec7g%2BkGSw0sMuF581BbXaBs7B8YNzWsqPaWNSIAwrk53FhSO7c9AufL3cLqMJxcAdCDHbTsMvNNlbCcOpyLxWVF7jugfz0Q%2Fr88h24kN1EYf%2FezTkxjzxnPgfDB4S1LLiRlFO9S452V%2B8nNtvyrUi6hEOC5joHz10OQuMvzzOUW1uI3C6RgUApe75Y4y%2BksdEPGDM3jqJ%2B%2FszrgO1skD6C0SfuUOvgSTA8I62qXgQvj4EfpJy5IWbsZK2WyIvlL333L3Bpn5gbt7cImzvWrz0h5QvYXv9Qkkecp7YhsheP%2B8Fq3uEyLKBnkuUjoWFWNkXIXKOcDRavVQbLoKPxmvmV1xVfVQTuYiqluadc1XUmExvJ5GThjvADf9AmDKItMMtPvbXnxvD3AUrhvmrLGgFZRtjM9qWW3BmJ%2BgDKNoHLkyuJMOSkitAGOqUBogw1nkJ%2FRILN%2BFVtNPyqaD3sV%2BICuzSQzSi8aERTFDhqLATvPmUIwVDDrh%2FmA8k%2FgEOKoz438HnsvfitdLFGOF%2FjhHGQPMCNduWGukOs1ZuYl9pjm6HN0vvQcFKAamGOpTBEuztu9yR1kjda5Ab1965oDFmTQQFJavuvYuh9j5u9bMFLZhhVuxJed92pxsDLIyiZmgjXKwib4riMsYcfjE7SiHQU&X-Amz-Signature=8cbb1735c937584afe05823da43a047280f9902dbb91167e3a74aa38f0a2c653&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y34FFCCU%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040406Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIHjrWXA6dn2j%2B7oHP4HSa1fGGRif8eNSex2u03qZLPwjAiEAkBfoj%2BP31qnPeD%2F5BXKgvJsP5QEtjwhkjKzVq9rmLLQq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDHCqnA4XmoEUaIqOCCrcA%2B1czlJCOY9NUPcqzanfMkIvRuakXXNBHY1gi%2Bp7pRUU8Gdbzb5Xn93zIhYzTqua70cwtaEzzJ7FIg3772jfJSVPwZEgY8ayTKDxrUZCNXoqLNCnBeKBdID6YQKXh98K6apOVJBuVr%2Bt9uhOsK%2FSMX8ZwBrReK5lBf03XZgOeNCRORss21InYZpM8x8aVFPNJMaPx11i%2FM2srJcS8ZR1wn2El%2BfRVADTAQBzrBBove0DuLaGuDEC6kWviKkkPzLvy%2BinH8hg2MCmLkhUfTz3WfogX0FLecpKL7O0qi37%2BJvbyJJ6%2FVxohjqLuXQXM6UfxZvwBpFBtxLFJ8zINPGLRxsBo1otiqUjEfV%2BrPiAFcTKHlGJtD4dsDFG9aE1vLAK0dvCXtuwPdEDxdJHW8AV1e6DKedifeJTCllIafTw8ExcO6BqS6ZtigyMKn10ZRkIGJiL5OpqcNo7t6pXt4sSdftuJiX8ZxFbKofJ%2BZRivdyVxCryE2YyCQ3ISSRKLkb2O2iCLtXWoq1ukXBVBRkVZtLv1VlCiN8UUx7k3XHoUWXV0Ve6y8zxsRoBv4ljcq28RHYFnpaeweOq1J05sL47sVvdBSlGcE7bkV2ombIomFcT7EkXspgZOuYfjnisMOejitAGOqUBPoCrozyMThhTFRz5lKLmDbtRW%2BNVfrMZffiwtF9P3T%2BvQx3kfRx7gR0iYFaUlBmuq8yS%2BfUgLfr2oPaxo2yWWOXNyqkyU4sBX51563els4xcAayg6GPVCN9GUysQYtSsO6pXRl6I3VSHsqGfnA8EewB9a8SMdv0ZO1sJ%2Fnu9uR6aQ1SukmmGGXUbs3KVvTiGSArCUY3rIOofMFxzp6%2BvTWfKarMs&X-Amz-Signature=319200a90d15011e7bdc55c665559a3e774686226c955ed3add764e6a75ef509&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46656LCDYNW%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040406Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQCADmB0SrP495ModPOIUkm7z4mC%2BM3xiKMv5%2Be1Dr145AIgeEwMNhj3v1Fa45l7c36rWx0eqWQRNbH9kkNsOaSnia0q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDOHFHSLzr2glQPJvXyrcA%2BBzO21U0q7lQEIti7KQSjfjgvBfUi%2BoD56NNFGgf7V2jeU2jDtEzrRY2xtl%2FhgDp8mD51Jejmmval22oGi2ntn4%2FpIBDD8EJYCP4pSsUGHFwEa6AxOfbWxqcRr6vQxJYYwHeiMC7JKbXrudwIGN1IWRS5aBmT8WllYDNWcc0NQt6NRKuo1YxsJHaf57vQZGUUkqHKkKiYfHbYlzq7pb5NFmKmna6qhettBe9jgoQJdo3e6lIB8ad7zmwNg5z3z%2FI1KkIzar3lbI1W1xg792BX9CVcMZBjC%2BJiE8dXqOFRw9RfY%2BEuRxZlGJlnxBZLgRVQBQ8%2B7n6Xt7rpYsOkvuXIFDx5%2F5MjcYwAwcvNKYoQWY2xurCt38RuyYSuRh%2B4afYOPn8waRLglldDIB1KM%2BzB4nj8DQcIse1iFnueB%2BRIyiW2PhW%2B9TLmRd0z74%2F6Ji0WS6gu86rFQYvGE2Z43AsqaaaUkL2QuCHxYGsj3teSVv36lgPQBrExJG379GmLs2PG5cw%2Fw2hfRP%2B5hvZ2ZQ%2F4Yaa6o1tF3cFAs%2FxiExYTJ9ytNGvg6bIEBgUPzv8MGhz3cTXkAZ4uCSC9ZWwTYDnR1Y%2BDkGoRteR4O%2FZLIEh2WM5MsC7r%2Fy4ExhBx%2BPMOeiitAGOqUBEuqymQ6aOpkm9dzOUmzfA%2F2NMCrIkYF57FlYBZ06FT46IhrXaoS8fTd%2Buzj07G32MFyGUXpsEkctExAJoaCfN9O0YG1qnAdJQU7IU12F4%2BTi9zBLSKBPVDu8D1xJH%2BZUpsXv%2F4gmemUmGYJzaHd73OxcxGstHMie8FQZLd42h1RTFyZxSySuVq52Hdhy3ZshhsosayXka7cCxCDAnHlKUdHQk7uE&X-Amz-Signature=74490a53a2733f0a8eb42f6b300c740147a18e46f36a4b42c58f7eb9dba83173&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XHY334YH%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040406Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIEI3qykn3Ebe8vUPWxR2n0QykbD2YDfBlRfw7xhwWJvCAiBjOhEkGSFOe2HrFROGNTmAbSoaYSGG1UTMhXwqeln%2FhSr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMvwWs%2BixljCs4JmI6KtwDU0kVRYWKhd2cFMUJ%2BIGPQDU3rbM%2FfgLJRLqKepbIH%2Bb%2Fe%2Ba1nSoEnzhn5hR1z%2BqnOzyRiWEHXZ5SjdLwbuoI2mcBsyiY%2Bwfde44st1UBqiYB89BVbodwoQnsUht%2B76uzi7yK1dwm2InXHoFz3uro2TDKfcckNDUULeuT%2Fc%2BXBMjQB%2FyM1acTUqX1Vv8b%2F%2BSgFVzQveLj7w439EHjyC2wqDrouBq47TS2V8Fi0UVgQKeyFz%2BqGFlvXS%2BH%2B6S109KaW3dFjVFA8mWTdlH4O6I7DRtbclxGQdh2uFKD7FVNeQL8SNa%2FzP4MPBZrtNhEdSOclpW%2FmuE%2FEiqg5nPSUqB4tZ75jIc%2BBKwTCUGCfno%2BZPmhtvzoGNEp246JC4JYS6ckn2YViSMKkczhtcUo6UuiMYDNadG9MJSrIRSgeffHZ%2BudmipOM14sTnc6y0Z8MVesrALL7XLnme8apjIKYUCCprTrh1rdpnaUWHHeHxDGGuaavp5D3NQeNpq2Es%2FaqhalH0f2WqfDUDvvBktEXSprG28hFUrFw5arXJfvXCv7AfFodbn5XTgssK8Gom6I7nUdeGdElvFzjI6E0MmD18bOHnnA78nJW%2FkZcKwyXYKZvazOn%2B0AwlkrleoSbiIwx6uK0AY6pgEvAh%2BpHyFu85Lsa3%2BeytanQr9Q%2Fx43tU0a9eI4j%2FNKLViGSZ%2BU%2FMoxoEBtTUgHV%2B5lH6j7pql6IBHVkmho0UBhKaTDwmBNEEzBL%2BzycnQTxhIV21jNAgGhu8p%2BED419EtlF428yKbny%2B6nKP7JX9of7Dd009u1BBx28fefPbXtPSS6vQwI6s0krJjKiKB0yzCfW7xJxx2TUnibsY9vRqSTMhBZpr5P&X-Amz-Signature=da72a089480b97258ebbf991f03be2775f2da9595152f4a511121a3bced9ef4d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QW73X74Y%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040407Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDTyvlOvLL3I80jkscrNC%2Fcb58NYKMRFX1sg7Vfslqo0AIgUOopehUiSARLZs%2B0r3%2FOhg8Qb2Co6SEGHgPnjkyxVA8q%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDMlfJ8UuTk6DsitTuCrcA7h5%2BxifwOaUcX%2FgmXdm77YVeAWl4uSdr101BAVfh5wwNnw32%2BJwCFQLApda0IKImnN8pmSZuTJ7rAAzohPuuR9MOXzodGM8TRZyYS2WES7%2BcANtH%2BIIm%2FPUr2Gcwh6tpgdGoLA%2FOmWhClhH60HEqOH6FCbW9ISHaq3YJdI7ipKM7C5dIEo65%2BQ0RdAJExFKDRiiKESXTBb4DkI3R9iEtx3WxS3m%2FOkGPTDFgiuCqVe5aC%2F6Rw1efvqeFtd0BHYJe3FgB1ksncvdtZC4eih8jUJpVdfe3MMIF4dk5iwRoWPGGSqlaCdtnzm2%2BYx7kqw%2BoyuwrTxfJMD1XLt0iS1rzVQr3%2BAX9%2Fc1GALwfhYsUP%2Fl55TBdOtXLUfN%2BAXoGuALuPOGolXoT09etr86oSJslQYra%2F6qAhiAca8EONpBNjTMdsZA7R86mEQmWGsqallL1D%2BdtCQ5DRWD0x4m3Im%2BJiajlq1Ne8VvF3mIQhp9YbgvvAM1nBNGj%2BMZLYn9x9Xa6p74FCAnzxevEgiEcjm7oHZu6fcLR7iG0iSE0h4%2BTM7EWKo6GvkBe%2FBQ9v%2FRlelueM94L0Kwez5UgezyG3QeF5p1Br3rzpjS4hv5EdVaES%2B8%2Fxaw2H2E3lAzjZpEMNWkitAGOqUBqV51QQ1uhWhnkY3cGft1r0EPcRmnXzJcrQHkibScKwmLD%2FNLFouv4L0cxiqBvptmKqHFbtkM417na0c5hSoTaIPbEQrrToF%2FQZK9Yiq18g1FYU%2FTgceTmBy%2Bes6WWvkNdGCDetOvZyQvpez6qsUn8GMgqSFygxSCkQaj0Gh6mclw79iAUKYbakuhMHJ95WCV6OiobhwtAmzDSMYa8VDekzTPnRoD&X-Amz-Signature=6b2f77acb5ccce8ab83d22e5da66da204b3fa9cda251fc6df06f703dc477bf77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WYOZLN7D%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040407Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJGMEQCIFz4CRjpz8teSnXr59IFdPXz5tk1sGSb%2Fm%2Fz77WT8FfeAiBwMlRnSgPGqEvRFNrh%2F3DiUMamZ324PUuRDVK0dccaMSr%2FAwgkEAAaDDYzNzQyMzE4MzgwNSIMs%2BJihz%2FG3C436XC8KtwDWtYs1ueCyoGwKNXQv3Q%2B%2BhSNEurBFZNN9ZB3U%2FB%2BhlcDnuR07Q2PbuC3ybGZ5wEogFw%2Bc7kfrGZkNVr%2FEZECwRRKPnvMCOQORm4DNtahK%2BA9drT0xxUQ6MpbPxOUowMfW5OtY2I%2B8SQTz9zXvEJxqNIZnF7McNTJP7y%2BT6tK%2F1WGlX5eVlXtfefiJE5QCVUQKe7bGlEosrJxn3cRdSUqhhSIErsnGbZIQhOLvWyBlAzabXsvvywx3LwCnKalAoOMD66PXVkh69SrjXRnSgmVAKj3m%2FER%2Fjj6G2tSJowdeTc4qg4nziHyDhHHG3Vxqhue9UX%2BIPI5w5efyMW0h85WgB0MFzImCSRNRDm6WQ7QczXa6Tgu0RH0nrn2pWn9IsroWMbfwO6%2FfR%2B%2FPsmG6vvFpinKNCTNzlZecCdtW1eYY8DTfKWo2XBSaigJCsoGxf6RjbkV0D09WvniE0JvrM5xXnJ4ZiJjSx3QLIRPk62R%2Fi3rDzl7XTHU4I%2FTLAsetKIWH35qerMvLZRQdV5MONWb8nQO29pYB%2Fhy9f3ZPZ2ypB5d5SgJtfk2XtQnmFb3qL8vQb7HiD7GviaF1LqDBCZlAniDglJAl1Silq7qhbmfT0QSwJCIS9%2FIy286hFswiqWK0AY6pgFS2TPZ%2BG3ytb2MTzO87b3IU7LLO1YDZnJ6D2Fzfx1mPharhnG6fWIAdBxfjZ4nMVwoa7PxvQpmMtDesLg9fC7Au834sSmC9L06xG9G%2FAspfvOir%2B0qSpAzDgzctt9foWUpJ6fcolxWq5bQR4W919cAXg8OE4sR1ES6an2RMAHvCtC8au46PwIoiOThkxzLT9bF3xPZ0D5wHnNpqNoFQEYTu6v%2BK4rq&X-Amz-Signature=b1e9b81b7bfe32583941a9c9e5aba0d9dfd9bd027710a8a54681b67a9bd2b565&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667TVVE34K%2F20260512%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260512T040408Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLXdlc3QtMiJHMEUCIQDLuV%2BwxiriZsrKhwqm%2F0cSxuJh%2BzUV%2BDwjXw%2FK%2FNJwfAIgU%2FMQ8iYAuUMeQf9SV6RSVCQZJE37G7o%2FVH3QCf2vcMEq%2FwMIJBAAGgw2Mzc0MjMxODM4MDUiDJ0yIrnoGvFoc1cqWyrcA5m6o%2BftHkEM9ZYBl2dqFojjlJMjipxeGWwm9jRXihNu0cry75ToSLCmQtqKdwLHpg8JcDI9TvftzBWhIPKGhh9U05KFisj5omKN3bqNI1wGukQqKwsQP3pytiuDIRUzbm9qMiSW4tYwP7lMoOx5Z6RW%2BzAoQ57Pk61mUHdCOsFnJ%2BIdxpqU6n3i53C5zxr1ZT3bAxtOwuPz%2BGXmoS5eH333IlhfPhMog45EUmDW%2BeanObmYuf4TxrdzfFX%2F2btoAVcXBvrbACdx85qjaaZAnQzU2pmqTeVDFUMufEwXyswwELFkvrryoy%2FeP687rdBFCPTuMW2aPghDL%2FtKBAaoQDXPh%2B3OD0lbsKYuw3wofu7k45RC%2FGVrba3f1kvyyuqLhGynmpV8kMvMIb2fiZNUItpFM3MriuRfMlVDDj%2BkMrgl%2FmfhIj6iCcb%2B5abRCNDk8Eea6lQtu61xnbccG6DmrCT4zZYx2R9DMDo06IG61l9AIYvH%2FyxKRFHza0uGETOz3k8erFudB2sbdfVqQiRUuoNley36EsqslzYZTr6fSKjJg0PSIe3bPVjSZHsh7CO%2BU7Jp%2BS5W6rvohG1XRfz%2BzWVpmeN1XpVJwit1IwBsSwNlEQw6m5zDFO%2B3V21qMJ2mitAGOqUBwgieMmCHEFw9n7g5qpYtLZcDl%2Fql4E8eJK5xd3J%2FQPhyM2EvFhT1g7qBTJGDmYiAbcmMp7oMzZUriixvKLWpwH5wZzOTZUcLh2l55pJQjwuDsg6gPNcUM5BWK3aoxid2QHXBIHrAeqxT5raUYNOcnT8otj0QLw1PpoocnaoMvhluIED3T%2Fm6TrXXFs7JDF9Ua6VBIHDJIXAjRakY2fvj%2BsXHv92%2B&X-Amz-Signature=7f83a1b6a861af6665861d89ac6dc777a0dc71e374cdf56fc4bad8ca93e567bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

