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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S6M5QFCJ%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050004Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDS9GKTGy%2F9MGBojCJnE3OVsUsEZB0UaKUgRnLlLsPDjQIhAPBD5WxZR5oG4EbLtaYdKEtpfwKndwjQlJ5bHERC136xKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igylr6yoSE%2FpqPTBDtYq3APy%2BBpQFmrKgKlh%2Fa4SWrDogTh6IHz0CjQv2Ztl0dGjkWTtz167ys6682LrMPuMSdkGGFLJRtvPq0SB8L7qQCr%2Bb6CRsqyZXhoYexC7tZUeeKGNuKoRscB91DLfg4Tv%2BPcl6VE%2Fm7qmJQ0qcTbtIYZjzUubxKJKiw0Ia2IqKPiAi25k36mS2VCihKenHw%2FyT1Fzkwe1lDDG3bdhXAsRRkBnJE3%2Bv8iyH6FsJB5X%2BtO2Y%2FpGo70RZMggdDM4Bdpso0XaAojrRrgTNyC6YhYYZzemxnM0fg%2F7%2F%2BZXTA2pFIZrHdJJnw7ZiSO4Cs39UKzVK2383TgnjP5Soel7Tt%2FCOMLeQ8MUvDSax3o0UxbQ08RAhZZ07NhsZJXWtVMJm4odEXG7gXsp%2FB5lCDX54t%2BsNdJ2YPuWMX2pPJz9ZFkAwI4KrL0fBz2x21sevUIVMD%2BWG5NS6cz1Y5UXNXizSNJXtnckFuxUyJggm1OMCISvxoPd1FZQveKpvv6iARS3lF0zWe5QiT32BZpV%2FWKT8%2FC1U57%2BE4elRVsuZceLEHIVTEqPYNQFsy6PyhGmvPkezpoRClq%2BIzwV1u89K8qbpRsPukKvyUCfe6xhaM3UX4UcmwuxwlR4DyOva%2FLpvM16hDDBipnRBjqkAWZ1MFxO%2BIc00xCGYAQVcEIi7A2WbRh1M%2F5RdN2jkLj%2B%2B%2FedyIYbsZGEKruKrpnvOSML5VRcg%2BKcVPEV%2FnFfymdnQPjWoz0K1ZZDQl8iGROoFQxiJcGF1w12k59NOjwVdC7%2FQL8%2FMdRrF3QQNsFEPTArOnQ5MsytnbAdbSmgW5Zr21DAxhOuN2EeCmJstAPO1%2B33vkC5yk5BAPJTJUMSW7k5ITTw&X-Amz-Signature=d14bffe8c6859ff67254a434a79d0abc41e88a954ee19f5b5942d7d3db8965cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TCB5DJNE%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050010Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDAghTmu8%2BzwfsAGJ7IfNNPnQOcVHptQnHrZ7PECdSJuwIhAJxgcz0uW9l3Gil0bi9Wv3SjLk4lgJV0iMeG2NVSyx%2BwKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwV5d3k4V5vcu306FQq3ANI6JaQTRfmhc6flqhm9eNtitVAeaLlcRJT8Cwwdb2YGvJ8y4lrJXAfkTEGDKABuCYiSbXCsFO0bYnmF9PS2xcD8gNwlvGXM11tRIoA%2FX79kMOXLIJFvbkzayErDBygS1%2Bxd1joCI1rljTFyFuBfwf2tjN95pDNBoGcu6o7WY0%2FvQE8zPjH%2FpR5kkjX1bUeT55jZXI8eWVmaz26bJOG9o6vvOtDF4V%2Bh3ICgrhoBDS8pp5QoPpjRrt8W3dm31WDyzztsh6avE4zpZibss%2FuZPmLOcQ7dTjMBjQKrQGHCpJR8yOpYqNNHO16A%2BWOkTSowWZW64bbCg%2Fvv09AzK2Pe7c62qeTY9Yq8UyubLIha0eCteiq4%2B3c5mCjD7m2ZtfzvbNvc8%2B%2FagcU6DPK%2FY1q5oUrtPJ1HDSXDtOFDttGWOQ14L7HYz%2FQIgm4HL6mrECS79kDzmXqzpZxCY0FIqgPJPBnz6yA1xJwkdFX2IE%2BeqCJL1SvDIL3J1KtLwnR3UxiTj2DuLp6tI1wd36PVh4CFaiexP4%2FFdPmUFJsP6TaXtWPPE5u7kko3lIM6%2FI3r3NqR7JPIZzwnMpNqnTdrwazJ6sBrQeEGMc5JuAwWa%2FeeEuWBPd3IOvx7Z%2FGf9vi%2FTDei5nRBjqkAWjBoL6FNBWsYhxdWMCSNmL1amwbzbLN8Dot7bhy5vWLhBoro8lpd%2BAEHB0z9rvInfKK4ngGfrzAuiNcfBiUvNlYqZJE0thuT6SfrHe6nv17W8IvQ9askL3hwcekbwp67CF%2Biicd2fJP5Lz8Tz%2BkOYKFslmExHqIP7P3kQ%2FsKowspPA3ncTnbIXsGTBPd5pFkDMta5zjVEClWGZ0f6MVSznhqOCZ&X-Amz-Signature=a2e28cccf486153b78ee8c18d83de9d0885a4fb333e31d7bfb06d17a48cc6185&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R3JGVSYN%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050014Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDYkuzfEW%2FpWTC5MrBKXszme3iazReK%2F2LdbbQRZtm2AgIhAPzokL3cG12kQ9fBlFf9A6Y9V4lF3kEvyTnhOdmy%2FJUVKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzLQmxWJ41NGbSRz64q3ANzdXtLkMbtn9ooeVZD5yaY%2FwczAMtN9p9WDlbpvw9daTu88Yvt9YYsBfm40HpyrKOuEH5A9TNrI4Z%2Fff0iOmRulwqvYJOaZuDy%2Ff6qcGA6FDU6p%2FEy8jMCbHKlZumdpP3dcoH%2FQJ%2FLvFEnkCDqz6CAdxIQchqazqE3BBNrCy%2BQQJfPz%2F8mOHGfx7PyVOt4V8jwFWuYPUtyw3iJq%2BAorA3fNR6xuxjOQJQC2Cyepeb2ro3n0JhEt8Stg2M3wFMz0SmeV7L8dRQcWTCpPdtMxPtVs%2Fp45HBxF%2BuqRibjXrlevm3SVt0At3cFGWN%2Fb%2BHMOSopYhMswQTdAAbFJ%2Bd%2FVHkzdlgyscIkdEKXm3BNU917rlxIhUWZBufOwbVTFjJm7x8lsOuGMDx8vNihUdVuLwMk9FV90YKQqNesWXULI2e2qQEzhlUuCWMSTy%2BXk0WDBtf1m5yrJewE%2FzicF21HJStQq1Y7ScEeydoJomZHSpmny%2B%2B%2Fg2YZulrB6hrW2H4RHBuBk1ZmGnu8%2FMoxmr01FTw6fUTeGJBHugnVwA%2FI%2Bwsoti4XSXGdrYS6DMWyzr%2FzgT%2BMsVlbjEP0YccZFbcQ5s2RAAqQCTedZc66TuU%2FUBHJybh9zw%2FJhaqxz0otrzDhipnRBjqkAQeVcNgaik%2BrABqsH8loSWnwu%2Bx5Q1qg82xzW%2FpErMQZpOc7e0K12f5kKlDjyRghngT6iVUbK3uir8f00uogHOvfQq0I1G4b0Uqx2IXkc9XEussO6NsU6eo3ePAXQPMO9p82%2Bbm9sXJ7ozMl6UycY3UC0R3P9T8Ogslf3UGBLEwgnGcREDjfMkXrjjxrcUUBe2mNOhFzxbw6Wdu%2FSd2VH7fvgqoN&X-Amz-Signature=c37a232b054ad539c4b338a421f56754ed2a6788e6cfa84d33ebaab645165be3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q7U557J%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050015Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDT6FBnzDJvzFq4t2SwKZTKFPhoV6MdcC%2FvlJujqFWetAiA8ZoATvZdqBQA61pRlcvqAaDHk3fDUxhNHl8r7ImnACSqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXsTh7wIJ9wm%2FJ8UfKtwDBkTP32RpgEe%2BEn1JTStT1va7%2F3pc%2FSaheeLUdLChpj%2BUF%2FVxoWEaj2fmSs7B%2BVA7ou%2BV4468Cerwxz%2Bv0yXCtaY6SveAabTiEzyaGKahKlAiA9YqEhDKVXewl0paobEidG4tOYH8wLUBRvAjcg%2B1F0tJW5pi9yMWroFffX9NY%2BYAIzSynlqppxhuAQ9L4ss1TdP5ucLP7ssKmDlrZ2CiEzexIw%2BBcAeOFib7CC3fDFJr1izhSY8KhomoxPeQ%2F5tV3bv%2Bza7GRgA1iUWcmcv963HHduyzZzw%2FY7i5MtGReGLRTTpvDomjomJYEZKgOqXVpdJzpRYv1YXKLJXkph2oTCQkoC9Vxw6hvit70P3NFCgzV%2BDF1N%2FP8gzhwIs%2BX0wt25bcewG9tUbA%2FKy4AD%2FZWIWYxYNCRqg96FhjuRG6sQD6BlGDR%2FMwQ5xRZ9e3t4X0n2NIjQT872XDyYzXV1h%2BgVvTQYkNylWWGqeQM0LEmfnqcji6o9k1MMMQ5cZwrj1fWjPPz6gueeObU8T%2BDA7zOuo4HRfVnk8jfT9%2B0yj8HFa8MP1p5Nl1Gnqumw6X1aAT9jPmzVz%2Fq9I1Ikk2QbTKmcPQ8FFYXuTJGlRDrXOIdVhfzk82z9OWexBwSUMwlY6Z0QY6pgHwlIix3YY31XsCemdbANEeGDYkWj5WqxPCGY160vtaHEE%2FAzSAQJBzthTTo6SzZjjP8lSbzUYfz40pxnz2qZztRzlGuc4wvEJYx4Is415teBAmtAIvJA3EWX0VemImrvkMqaiZGg1EaRAGSsSBq41gJ18M2l%2B4rosdYFNDCCK%2BxHw8RrP3ZEKrSAdhJqneZhl%2BwXtxuUSynKtC6wVfmanZgCt7CxlU&X-Amz-Signature=caaa172b0d7b39ae884fe1ca0146ee6dc1456332332f3efda74289aae25aa7df&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UV4BEFC7%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050018Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDxWM4UKJgHAkA3cnzIBdtyMbQx7E7CmSdsLIBh6MKSxgIgMxiM8btwl6sC4Wj%2FrAl6ujpOqafJFhKBCXWIiWYCMIcqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMnTVxtJZzJItLuDLSrcAyD%2FIhlP%2BbMXEcZH1CxwCJXx53LshWQDJlNcRWNYWxryf9wsWMsWFsXGbgtt5O6ta%2FNzkf%2FCmUjj7qH6I4clf04ZLdDCyckm5EByIpVrdJP8dQlDZN5J0N7qUqTj8edgSIfejLILbIhLlvNM8xnRqtRnhuGlgc1MwDleNtNKBfH6IHu0wwNdRAUpFjKUUAa98xk5cJVVbNfAAXFMnXzsVtBLT8l8MjRVf9J3S625Tv9cgLpkz31WdC3j4742iXysE%2BsOU%2FCjZ4r7XKTVHPn4U100Rxb8QUrsuQEpikzbdmIORQV0nuRiJaa2k2CaruJ2V%2BCuimN4oaM7FSK%2BGsFBRDaEouQz5Y5ZOaoEIdYJVfbku6CVdR%2FaWTZ6Ru%2F9kXuBtC20ub44MSNYil9bTS%2BS8AKN%2F%2BhknC2ooCwbRuDP0lWplly2k2EMHvoLicd1M4xXY0GXp6sGg0Kn6v0CTfRqLT%2F1NKhdyb4XSoGhYupfnjk3Bf20JIzHP2XeepXF3Wq4kLvRLrVrxtFkfcoZgdDAU7fYUG80xuZljoQvasNA55a6nYQKbZREHSSI8MBPyDbYlMo8kkF0NTfLv8B2ieOBOlOAUctffrwxn9uWpn4X4do5UlPhOumVTJtS6pOGMJiMmdEGOqUBcs4rAEzD6lCr0gcSZO6AhBo7N4eGBTOCj4U1dKCWkPQAl10mHVtt7PmGh5unQz9VIStO6nOjJDni7Ab1rVoDHmfe6d9sHqc0Dg7cp4cAUtmF38rtO2yfg6SSYvW72nHnHrEsGIWomUyjcFx0TOZfogS11jQZNH0SxdpIkTqbVWB3P1fnXS5rdu3P6TQt6B%2FHJYEayRYDt0kW%2FtxS4Kwc4m5DO8IO&X-Amz-Signature=2162c54831b8afb1aace7addbe76f092ac45d22038b159fee5d637156877e330&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46666DMXYY3%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050021Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID%2F5Eem8kVarBsKpUpPlnZf27OqF5oFMV%2FNa7etAiA33AiA9Bw27oNcsgmyu1YTyx%2FhwuvMb6iRFczxohjQH474obiqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMEW7uqdiGRUWpitLxKtwDAFp1OYiVG1Lpq5jU5gJl%2FdaO7uirFoZpn37W95yvaLFfYyaQmoirFPIjErurFGHltZ9c2uf7hMNaS1b01hpOyVD3%2FQ6Vpz%2Fpfx0mPJiwN1vSzriEkfPKkM7jrNU677jnWxtFvHSqwGk6hCJ185ubJR2eAOHab8hlFbLXTVmn1v%2FafY7yOfhbGwp%2BBcJtn3lCLcUGV3ls8e4eyp39KlkO%2B3chHecZNQ%2B4ATUI3s4J6vQxhXuc137G7jHMOeY7fIzHsVBmHoYo6pj8S8T0QYEkFusvMY%2B3cyu0CHDxI6ebCSxDHwbG6TRw%2BlXXTjFrkWzWn4XCAPuft5enT%2Bvdn1ddpaM4OFyBozIHrU1GGW%2FWUEWSflJjV0eQDR2KPm6F9BnMfL7MMLVeTae2yOI0my%2BHfKnxq61zadxpZ8OjeGlgd%2FTvcLSuFvdVllykuHrMQ9Kji2J5iX5jb8TBK1mIS0bOZmcLcOHg6ed2Zs2UeRP%2FQZFKqJCZqeq7f9KBp608HBE5CIJGAsoizf5NiTrsnx7oMx60C7QnukCQL4AKisjmpX1eJaVYwYpk6gxPPD23DQzHubCVnvdLDMG%2Fn0C4Bb6B3D4%2FcgYqzrVt5B%2B2KTXUX9do61GCXsjj1n932wkwpYuZ0QY6pgFGwGL9S0i%2F9YGuhlPrOAJvPfiI6GZBy9eiMxeNDkXKNVuqT%2Bc0bXDQofCFQf4H%2Fh8Nd2fGuGWb5M1E%2FF4Da62qxNq0f6JakTtMw5dEt2xVmiemuMXvTbWzrkndQxtrY5fD%2BvEWYpwaR52OY4dRwRVyV2AJrpy2CYRL7dJMBsBde5zKYpj6%2FiQdNm3SquJh%2B9iizAlSlxM8AL0%2FCZrlm%2BA4mzZ7cDrm&X-Amz-Signature=03a6dfdc98d6c8136f3953f5fe8ec83793ba60df42be0d4537018f9733e6eb66&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SR5KPQED%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050021Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDKTkdd5fnLsqk%2FH7rTgFmZUBcBB4bZCEpUUqL58UtJJwIgaz0IyqjUBE7%2FLWXiM5UuhmdMoXl3ukuTiSV0A2Zl8eUqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA%2BMRt%2B7yHeh%2BvdPKCrcA0MzAYzAgLU6Z1T3Q%2Btt3%2B0GGVrPzfmVHXmwfYUE0EAEhiIUEnB2OrUUNYEfvGCC68cZhzuvHavmNTBFi64UELjOIHHnQ%2Bohu6N0RcRXVUy0oE72YU991i7Elem34I8zSxM1eEWGBRqgW3NUxmUJe4scqnz1NvF9W%2FF%2F9g3rdnctIxjJTxmJ%2Fgih09xaX7U%2BQrl%2FiokrpHcEIeHEL%2FvpkZax0ZfJWnjH7ztUZmFiab5BGm5%2BmZ2IYUDrMW8hTaw5s9OgursiFdX1gq1M24UovTGaBKr6OWEL7OQlxnXVRvtN1edsDmtHAK0Rgz886dSunplcEgwjPIHQOvgu27H7Yt6BLeXidaLWBkRE5MrxzdxphMRXPrEUBsvBhJHR8geLEFha6%2FBsV5jPZ9okUg8oZoDb5rAr6FDklM5Wjfg7HF%2BzQwqLiC%2FypRMIY8TZd%2B5TvnJHba%2Fw%2BDhsKthdHvGF%2BHESJQIqm1YTtWPjX%2BAR14yYxqpFLSmDKC5EaMxnoeGjD3S3xzsp0XtD%2BmgPH7IMdlTse1dY9ENYrlmd9VAv9v7Cg%2Bxml2lJCX9DuiHrbkNC%2FpmaZD2cpwvcGWugMBJBPXEBjzqpPd2AfmzVENQHS2%2BflnbeeCn%2BFxThz3plMOGLmdEGOqUBzUZW4fULkl8h9jxlpVEOHObi0skvciZjDyqrwynY%2FjerfTqIxuDAGa9WMlWjf%2Bxxre%2BcHzx4z3ofODyP6PZuOm5XCdPsdT0tSGPNWwOjwQ2FYJ%2B9m8vUS2miEhwEpBrb4mNjdvTPZ1ftKQSQvEH%2BxmZyceNLZtJFzutd4Shg0sDt3pXuQS9GKKFi9Hh7Ei6OmPtx%2F1NBspYincn9eULOlaflG3Yg&X-Amz-Signature=f4dd54a10869c4f5ef2a92a312b84bb044213a55ec09085b17c922282de4aa32&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XT5K64WC%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050022Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD028qt6NFCwd2ujaBfLZTXyWf7jlJ8Vx4tKwHRQ53LJwIhANL4nrUmEsPWVU4kCPFbbNcvfEY7mqg81Cf0MJraNMq%2FKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyZy6m6iGqifQD9flIq3APSBSpf8MNr1H%2FkbNqBP6XmhC29jXSM3gD1mwNEdns5V9SNi6b0AGAa0DPv%2B0c0arGk8Uae8510LJtnjnkcKxCD%2BdwEQr9DrCKhSgutW8hT%2Fx1rZk%2BZUuZZ91l8othOhhv8JxgRQdYVx2TIrWbcUvfhyLbGixqH9SgtTd4exZ0LJWUpnqxxhs8bEmYOb98jVS0fV2spbFFSCNhySWya6dS8cLYDqj8Ac6JIRdC6mK4hUZGeypMPc9SEKqiIiIglN71LXRF5OKx%2F7QSqnrbBZyZm9U%2FByg5ids1PQwf8ZlDsGSGoneJC%2BJdqqi7U2HTV8ZVcJ2K6VHRtEi4J4JK1WGeW7mVz0UkPkmM%2FO%2FbNjzlv752HsRlqmyhYzdFYe6ab0nn7277%2B9oNKwdjpdhOfEEdBYmbSpsaaXZ5P%2BBQjsFUfqPY2UCwOZ6ei8%2BfMaXYq%2BumHnao5HZQhTwSFITo8fSxhovXLYmZ5qVIvT9YFilZWoJXtYhvubiK4Yn9mkudEcBmALkZ71GimMCUm3JAoS3cRZyoVF2UTo6oOsfcXTAJor8732IxpOvikpkOjHNnuJUqsJIc4ZTpQW3dbVtHSZteIwDlhLpiBsBWusDGSFDDRLCzZW5xD2WMdff%2BmsjCVipnRBjqkAcg3a9unQbcWyNnGIwgntK8qPhhNYI1K%2B4APUIfZ9R6neM8vNQpdA9NIN2NBKvtjZmACUTp37HFJLakNEI0w9yQaPDkRl3DiimWqqH0iffzJLWoUHSVtN4%2FEarNWU6x4%2FruFxxoPyi72GLt%2FnjcYddU%2F1sRofoP5i54E8FYZx6YH%2FwPeorhJLDKHBfucesUx9sJikfRg3Xz9W%2Blv0fEJf6ptCPUE&X-Amz-Signature=df7c19c7bb3f59e42a7dbec08784be2c8689b8ca113647c890818e8aa7a6508c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U5T77567%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050023Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCpgRoP%2BRXLy6Vc0uzkJ4%2B4NcYAKpadRpJCs8YmJPGYiQIgPmNhrCPNijsLyhIjhdJaA8JjzouJVxOfq3qbyv1lXvYqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPrpISiyI9nWeWv9cCrcA6kstfpRefj%2FQa0sf2dbhI9pMDm4Gwnp5gVMZsaZamLHey1paVR33UnVTmIE6R7TVkexllzwULYrS%2Fv6F0%2BJ728PeUnMhdrA2AVNwLHDAQu5Dgl0G5K5My3HVb4hBcY27dHR%2FlyvKbxJ2C0flY3wzThSLDOdR9Np339OKsT12p4AMYP0TaFNGMQ3xyx%2BcCHhek2fvPibW7CyDotYQbMWpa6FQhajApZ2hdBB70%2F68a2xmFa2Z3r21AXcVvqwV6AWsi96%2FKVkKofXEheJTv%2F8L%2FQ4kyTBEkFYFN10gUhPcpnjm0da9Q%2F3TcJ3LDzhu70oCPUHvKSRPagRC5%2FZNSUMoFC4wNiid%2BOfpj59TYh73%2BhNSZ%2BOaGU1Q0P%2FlcdfFuHGmxSkG50h%2BAv8d9XeHjwGm7XddcBiTlhsZTshE98ijXncWy%2F7eU85hS6lgUnqf%2BFv%2FYtmMftH1taTl3t3o7aelPmKtiApYI5DzV6r5nOZJsc25v%2FUFUHK%2BLIkSjkS6TAJYqCmPKzUCBLImKjLd5Mp92YlMy7ndQ2ORqR3aG7OUqvKe5fPIYJ55fL9i9FnDEbr5TE0S6d1Fk98qOVC4CgEVlPd8cF1MDw5hhvffc%2F9Bsgs%2BvnU5VZvQd8OSFpaMJKKmdEGOqUBJBWX6xXFme4suSkIEWlmFRq%2Fg4JMopSKu3pXySagF5gfW0Qy%2BgfnJWHcFkOqPqXyud59l%2F02%2BPKy7YAiOzrgfbJRQkDkdhSdRaODnZQ7%2FovFn47Yb4w8F%2F5ekH%2BZwd5NhO%2FRGvK6nG%2Biw9DAwav15%2FjoI5FdpR%2BIeO0e5Blh%2FkStsxZ3AGSCLs8LMw4E4e5XK73Ul3dh6zWL7LrSWc5gvZJ7KKGK&X-Amz-Signature=b1cb572097c8ae71e4aa238bc57f1cf5c4f6a5f5912a5b3d4b83dd2573559c40&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXUOUX75%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050023Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCqmVc43qMcTAS7lzEbsX0VEnF1sp7z7K9cCe1Ju3MIBQIhAI0XssDYVXEhvlZI1oZqN%2BMzWsgTjtFDR4WYuybYhJL%2BKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzCkRTK2oCxpdekrpcq3AM%2BEnhjvTAfc21By9gHYprRn7SXT0HiFLB8NjD4hVqb9TBhR6IwIYM8TfVWpChdXKRHins5CD9SPctM4Z%2FtP4HOsTBRQ3yA1X1j4YOvMvuKUcAumocEV4hleqFF29FCedXKSbZr7LFugIJ%2FVbI4MXY4FzZJWRYFTW7Ho9v9GTYVe21rL5nPNwR6WIVWkL6%2BVV6UhWg3rPCCP47NmGee%2FdF8%2FdXqvQRJplhwszgflBi7MT9IvQkFZ%2BPhgQISGcQRE3EmyWEhUwlWavtpeKXwVCJJmvC6a1QG5YRElpJjxmaoiTb1B75XSZwf9QVR0a%2FiC5Ys3PIEhcZ0y56checa9iRBnpgnG6F9IDel8AzuA3203mMOsdMrg4NnhqjsDqX8vXdCNezkZ1gg0ZMJcrx2kRzqxyDkVKr9k8Isfyfun3v0qvpmcseT6begQ2HvxfVXyGp8RlSowwCkBfWBklMwHpcN5FQyxz2Y2PCnWYnRxIvzDWZEw1PpYw0G1H4Tq%2BUXq137P%2FH%2FWP3jUCfhupRi7PVZil0qLv2soQK%2Fz0t2GQiKmwGIZ477%2BsBjcYQxC5qgRPEpnGy%2FdJCElc4zSoNYu0gJIVJ0inAn1c2bjNn0N569D1PUYLFPlccsYu4lLDCri5nRBjqkASMq7ZZszUBoD4G6eEyt5ax1tr0gwp5itZ%2FwgtxONImX7H3b8O1YU5SUQHNZJqvmHpMIwLgC1l3Ur1ovzQ06MCzjGfMGkhp0BG8VtpaH3kOgYniEFeh10o8Ti5n4ubfEdrafQdVufdXyFMaSmq7X99wXCcMRem8YqnaxwObdSIsQBsARXqK%2FshxXGVVGoMnJhvdS7bsiiZ2qzEwbrGp1tRCJLqLh&X-Amz-Signature=89d726a98d5935f957bd9d5e2e3e3e5132a893162d6070304f34d8b095349ef3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665CI4TAOD%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050024Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC9klWBUAy0HX9zjquU8UytUM6Tbo3UdqkjibUbzqiNGAiEAoYrkIv5AOBAhLb2vyjkLRgzzqd2h%2FmrdewYYmJS0pZgqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOSmckYicVATVn%2FxUCrcA3Q7UqBYR%2F%2BznQNHhF14g8TJHO9VaxDjtueW4oSSDnBjZ0arGucD4kfjKIPKi959LNxW8nSsGs2n%2FW00dTPASwVS4Xdb9yvtKWxCxWIGwhJMdZB40qHA8FUJ7Gtf5FpnqwA5IftqbViHqVo9yPcC0u4Y%2F0CGjnkZefvy5Tc5LQ7%2BU%2FgnbMkQaX9Q%2BCrOBSLnD6%2FVsJz9XUOEy7DKp8M8KcQaeMLAhWcQ%2BB%2BN8v%2Fp4zE89PQWi9Ns%2BBYQJHU1oheuq4LrR6IIGETYx8JO8ijig09agrEsOPpGYntaXbjIMWaDHEDp7XRioL5%2FS4OfH%2FzciEo%2BGxAC6lDtTJzQWWT1w21tfGce7XCmMb8Db3AaTN0r3zHW3wcSXOEOc7ZRGO6%2FgE534gomGhKpcS2%2FM9opng%2F7a%2FG73%2BYyp71Ei6jVe9vg%2BDGTEnS6fHg0pPQCLHHH6qhWwl1cA04o%2B4F854TcjXKQOtE9nT%2Bz509lX6A5XVdxHkz%2FMiE2k480N3SG10MfjcHq642ahS60lZpd2AzLzt4wtvHAzfvGvyS%2F4D%2FYkPEC0HH%2Bvrp55s6TuLesJ7sZaQRNWB2kHj%2BTC3KDskiNbd%2Fd2IRRKFl0VApg%2BASvlfDzMzdXqnGe5SwCYt%2FrMOuMmdEGOqUBbmoizoiFJFPpVoSnt4CsMjcqvxsDSgMye8Rp4ZWXeeUNjEAVaWhrCHV2%2BfWqYdtaiN%2FQa7UJTab27do0STodzyBPt2tXOqaMY10PBcvb218Rs5gizlU1If8FzOYaAhU5%2BArQpVsQF4dcYRDOn8TJafBeznxBh4xDWgu2Vn5PgRJRHf%2BjnK30Cv1Qtlgqv8nOcTcb6CMiJ0Laekste56C%2BykXPuAQ&X-Amz-Signature=a0efc8ee8c928a9874ed4c8fbe9c22851cfe84275c39de4d1ac75d275f6b9099&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

