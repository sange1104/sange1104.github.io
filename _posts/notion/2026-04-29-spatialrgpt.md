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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SQ3ETCB4%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042230Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDtjC9m1TNYxNVmYzEFVSmH4%2F076KKfgXrsyLJVn7sjsQIhAILHPa7l1DbtfJvCmI2HQypVDeavpBIuDqPo5jzsbVE9KogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyU8MtF8SFG1YBRqfcq3APsh0ta6XBH9mmdJ1%2FOgLllzLP59pGcZf8MXd12yRS4KD6%2BBcTol37nT5EpSnw4IziW4%2BCyvz3ZxaoI5NqD83CfwKJ%2B9sQTOoakk8%2BJ70tucH5u77%2Fk4Tc%2BTZUuOn5rjYAcsx7qvni3tQuHIyNS9yVP1f4giYwmHRhSA13RoX4iquLA2GXaKbYhu%2FVnCB%2Ffh01mdz7JoyCA9sdQ0dhZijfnk9W%2BHo4oPgMFciqSrwnXMuz6F%2F4BS%2FtlEXLdmtgwq%2FfQ1VPMQDzLShlPulhKuraaS%2B4k9uGX3A05GkX8RLogxq7daj1u8AmGUZH9rLBXXK%2Bejsd600YGd%2Fb%2FXeSO0jldBFbF7J%2FWtu6d%2BS9tzgMrcZV1t4XTZfSm8cADTkfQbfpC%2BZfV1g0Mqbd0%2BBi1wmjFB1dnsmD%2FsQX%2Fe6WNCVph70q2TpjJfRrrEzsRMiEQBRaIkRwZlD3xqxnHDvAqHpYkOXtjesj6HCXRyDcTH3R1QF7zcp9wN4Nwt%2BVkYlaFKySe%2FSQwQ6ryDngVYsDbKfqmVZFDa6ur1syRbJyOCa6jFI%2BCJxUbys8TAlfZOMRuG4SHc8gou85L%2Bl0pRP1cssD6F2dn0J63PUbiuaa0dDz7VFEHUIA62PgpKiwHoTDOhZ7RBjqkARTsXHEEOKWf%2BmJwlfu4XMtsIOPsB4kZZ9TRInc7Z8Du49ltWYx7kTsyOoDt4eDm9p8ipV6Y5wBIszi2%2BofjikHv%2FgaU65I0BDmBS0VX2UzpXR17BFFvrb20IrQBrSqJ0EW%2FzWdi%2BKyg8%2FXc8ylkXqf%2BRSfvDWQIwBMaOwDB1y0LoxmUwg2JgaPApbxx93KN1Vr6nYDABX72h3Jh7xu7%2FGswnu9Q&X-Amz-Signature=7f914646bdb0789d6fbbf6ff3fafff8775c7cbcec8524447da6f4de89e50f552&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SFUC3WZC%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042237Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC%2FnQD78uDP5SNKKq1DgBg%2BABI6WDZsR1hAWSstihEwiwIgSF%2B%2ByYH1CdbwXMEukmn6F3%2BRefmfVXtkRe9zxKCNoKcqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDImN6IYcE2fvIGKYwCrcA7QUoHIybk67EVPhLGcedchNqR4TudSVdas7MDZl48uFmkbIK72VJ3E5vpR6yePyZZ2Os%2FzdQX3YBJJmTZc6FyjZ7TGxuovlI9pviGXQ%2BTfIo5OSUEcmrI3qBpOpGeBjvyCsYRYnGgxuXTpwLaf968BaB9gyVwJIR3aD0BYao8SOGDNY8lOXLB2ae2JY5VyjLrSrOe62BAdo60GlseDltfcDHBFAV18H5yvveV3Xoaqxd2O1f3r3wRxbWNrlRlPeHwlFaS%2FVNzaPRRZZiu51QzAVFRakkIBFyXGt%2FUmcJRbVHiCmLEpUNdFNDzWePdT74Ve%2BE0FZjojoKRsrQyi6Q1aabLbtTcnC2jzJ9lkB4SDUE%2Bc0klkF1ZhQ9PZvDCa%2FByOhLeUzN1d5em%2Fu3b27vWMIgmrZxTIBBTb0fzPf54ymqAXhkdPRUudha30yGGGklSoQ%2F5Ol0Exm6cQ%2B0jtIZJg2ifyn1Ut5jP3iN1eXzzvlckZ2ym95rTLB5fib1Q0Uh8%2BfcMGUocs5z2p%2FaqV0OXJPp6BOLztmlgrcpt1MKJYZAeQHFIY5NqEhWaEwa%2BHQg13OgGypkeLZgmMMkNmvHSuMKCZvFD79gT59ILEWVXykAsXBLpNYZ97YdJOZMKGFntEGOqUBGJnY37FQgSHq%2FS2TEhH%2FwJ9Kf6nzZFnZypa1XkOzT9SH6fOFVjjQPgTro8MUJVjckOSdaxyYLP0vwCgoX3C6w3aQCqtTKUQx8WQaACvl1oMZDd3UGvFGq80k8jDnwz%2FvJfj9Oht7tVslgoBC%2F9dOvsM5k%2Bx%2F8NGkROfD%2B59PkkMUSlDcot4J3AM6dqEvD4UOYLM%2Fo2Xb3YDiGS6bSUtVN94MEXM%2F&X-Amz-Signature=c4dfe2a82f9ad6721c7a90680beb70c878e5a455086b33f16af6f91265998e02&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663IY7HSJD%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042239Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDZUl4G4vO6d69UElNhAvp%2BoiL0LJWVoyAHezxms9HuxAiArRL8%2F0zYkZEnv6a6IYde1qsbWB%2Ba3seaEJc9sGHLWviqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMeAftlcjkQnVZvFnKKtwDgMA0bMeTFlZFJnrUsCsIFpBCort9xr9bkyiFlE1XmiIN1D9QVBeHbvd5zdHRPch7OyipK9VKGwaecEuyN5sbv0Nscu7VW2yxZTS09FX1jiVhNum4V%2Fs1asz0La7iahjIy2Kxl%2F51NCSby%2BjEqZtf4VvROVBuWLP%2F7dZECVG%2FtPvfvUzKu9EJWHBbB4NEavVDatWhtayF3zG6EztMUFg1uhclwXIDbhjThHP9bwjGgnvhujx%2FGDtfdvEugW9mqFvYkbi6Z1EFyQpAYA3uQIDk0iLYJTxKt5GDI5QwaTr1Bp4DrHejVWVbqkwcZBsiVprxiy4amFxnp4aneUDL%2Fjj8vGQtFFaXbFIP2DvAqB6d3U%2B8YBhURWFsjQy8VsZfpBBnpVCX93JlM8E%2FQuM8WssWWuk%2Bw0e9CCyskN7wKj9PWg6BSVJHxJF8dbT14aYVs%2FB3B%2Bt7biLytnkTIi9C2NhM8%2Fd5nz5CCjyw%2BZnUb6prIb%2Faw9ZJlUxy7NamSZ3WmChtwSeTsFzaWIDnnwkbPuw7uD0ZcZDgYrM3xApnVyy740xFlmrOELoGP6LzNQBqkjk3Cr9OMcrt35RgdZAf%2FWsSWDTpijEXaj6quKYuAPopIdna3pgh0t2ykk7ykT4wnIae0QY6pgEz6I7xOqI69M4RL68YZFELF2OyBDMWfR8M0uqDZp%2FbIOD1NzOCUr2XirkzZpnhJsEMeGjQS4Y12zDiI%2FbITnJ%2BkCgcKD9GDV8WXV8zNGlryCQgmEyCSagpcp3BvcsTIoslWsrlUFcWBE17JqWBAzffO0hweS7rhE92oZwM0pHXG3GTw%2FKUrcobYH2NpNxbizU%2Bcz1iZVmRccYN6HZNNWXpw42XqGRO&X-Amz-Signature=1f12272cb8785ca11259d04fd93c22035965ca1c6a7e893216982aad0307ac2d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZVNNBNYY%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042240Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDkTX804m9w6hs%2BtTiP4IX1qfTSkXnJHTqJGd%2B3KvgqvQIgWZN4v%2BIX%2F7sONsqHOvKy8nZTv%2F5CvelBPWIAPCsWW38qiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBoetSQV4tnYxKApoCrcA6tno4PJAPxGjmzmVO%2FYrRo0MfTZhyD7UAfThkPIrFrbasZO88lct3Yi4edLEObhUstmcGcNWP%2Fbjv%2BsUA2%2FpmORvhZHccIkzEeuB77ymWUzsg81ZL2d6SOyUpi1WK%2BZrCyU5NqJj7vxW2SNDOGkddOUZjdNi2%2BOCsl6zcXLKsZtd9Mu0OGIQ26exW3zMcHYBP1Tt8RlwTmZxd1bwbO5VqOVViuC4TxTSg55Iu9uH9fJKJf7NNfTB330yMKPRv%2F7nWLKUoba225ziRRidbTGMUO60G5CGoq36tsAnDqEvW6JUFS4Y0M0Uax0QL2oC%2FEaFL3Pwe8bj0fI7O8kDQ%2B2F0XtOZF4%2B8fQ5ic0MpuVF3%2FdzeHvB2sOV8nof1LYc5dtulEgqoXz7jc7yBf8LazO3N2D2hMTrnBU%2Bm8PbbCrc3YoxSdbRynxFcinoyTIkd%2B3OgQ919UtULLLuAesgAXeraSYKkLRZOyhVTsDJnmrFob08o8kPKoLbKcLQl1%2FlT8t9RIWsUjVRJc7w92t2SvLo4QmrvN84kRImxnR3F%2BPF9z0LpZBgsw2ViCBJgBwhEh1%2FwdVR2hArZHoTTGnbhAO6oT1L9z%2FsILFq7hW%2Be2rC6pbbKJFQbkqlHks5LmuML6FntEGOqUBvAvpCGnqfIplTOpZFpOmEnTA3hKbgZY2%2BePng9M0UvV6D%2BfuW8clBcj3fK8h7umeqX1jofP9TcbZToxjMB6kAQlUJgrQslBHkbF13l%2F2mP8GJ321fujwlr%2F9AFGz05gOOwXhAoavm4oXaEx8ky5mPzGB8Kvdmu36e1D%2BL2wyIlfGZh2Xpf%2B6r8rpNG%2FNXTjfni2wxgWcGyuE54rJq9rJbSpNHk8M&X-Amz-Signature=fcf845dc7eceb43ee4fdc8eaa45c782c42bddefb7be1f89ea404e5b352988b61&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46624ZD4JNQ%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDHQ%2BNaQeFrl5Gd3RYo%2FFLetgK14zC88DXDB1EGh6KRMgIhANFdQBhBCJqyl%2FXFRjfM05oqZh0KfINSEbCO4ZKiBsViKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyFlgX4GSG6VPWl8hQq3AO869SUrlew8H0BQ5b6IXbI3iAkIWHQJ3CLQAtlDiiF0kOrDOhXeWs9MCI1co1MPnVnNtQXCzySPFe2UOVrDbfai%2FYcPJSjl6TA1uV2Fhufh1%2BeXvNKxO2zmMzWfHSKuoa9FagjqaJ1%2FqHNFko92OKZNn127tIQpaDVCH3FLgw1vP7xrh3sIlyxs04eUgWK7ZSVBiMQrNsrIdrCHKx0s%2BbUvuiUH6yu0bDXK0YzFGOvZFPA8kgvrJCDbfrDNlMtCb7e60X3Fp5HwODUHI17FB1%2FTqs9I8o0TMPgBx%2FSk27KBAwKalR2Ri6RQLHHs9vW%2BKHhoqx4ursKUkHxXhBG%2BnYPvKc5cK82VOJV3Jxbwpav0grMmqGdUwvdMzxqR4tMJiBoBrjPZIxufIi3FycybizV%2FXBSJ24hsF3Zhyds3YPw9%2BvoMz3nIQhnCzxKtYg5BkNliQfzdeCkNyvX%2B7P3s3wYUWFSNYD9y1jUVd8pp9DPxYsC4LEmpIe2cvQRvIGA8CeTvh6JHkW7NJv%2Bihfq8UyOHD0l2x2IDbSrLYJ%2Fd9C7b59vaXwymLMNuUH4EkhMKhqLCuxCHMnOQNsMh5B4UHhGCK5Fo53j6AXaatVmrgfHZrPYb8mEKxkPOsy5ITDchZ7RBjqkATlg3%2FZTnT%2Bv1Iw%2Bz7%2BalTORVZMWJjyr0ym7iMWvB0Kqqz6syhrRueAlRLLZN2yXa1nT%2B5U%2BBtS8NQ6IYgy7giGzgX1AGqoDIco9GZw5d%2FWJn2gzkJQ5V7Zvh2xqt1F2DoWsOKqAKSz%2BDH2%2BoOtIc6%2FH1ZyKTx%2FqAI9xYgtoX6GaR6xyyrS7FflNjywmAXfCR891NF6%2FqOTl970iQDa1aV%2FYIhX6&X-Amz-Signature=c8b4fa2ed9a8fb5caa80e99383106ef40d7e682d11269f6c94329824d90b5152&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663UCTC6SL%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042244Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIA9ghrvS20CJb3Qzl0xk5wXHuLxGevscn%2F19dEThLeXHAiEAhbAQvtGJCvs6j6Cy%2BJtFgUPmktAHqZlHoVkBYvwRZkUqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH6s4ZZALXWWp%2FxGnircA5%2FRTf6%2F0wwCoQ7wWrKk2WkZHktyNS5IFKwrbXWZ463RjlgZbq%2BqtQtxSGx1Ws2mL6Muju9r7oAkpcPldhn8%2Fmo%2FfscHQ4QiCY3r3q05LUQlD%2BaXmWbJOrYt%2FdIIjj0TDYBrnAuFvUPm2Sh0rbvDLoYtf3oApnHXQ9qTHh5F5ftFUaTS5VhzIVUQuvhEglwVQ2%2B40M1gPUEufRF0XK%2FNtXZSmlwMQEjqCNRGv2mvsPFJKGYuF3piqo9c2LF%2FuOPwB00w4QDVLNAiX9hQj4npxatxH7NkhrTxRUjxlUUTuoBxaPZisfzLmea0mQN2j7w9X1Wr4ug10CcSOSEyVMgFafJ7DhQ1OIzB%2BtbXbcKP1DhWDSO5YJLPz8wUV3cUR%2B3qTcnsIXifrsIDMBUiEFyzyh8X2ELI5aACHf2hNwxsfp75encGINZKZAHFlxMIGxmmkdQ3SCKFMZzc8I2r%2BQ3toWIaqoFnTK2B4YgnMVExBH%2FIO56QIbz65uFVxnBvpkCOlsvKKjorhLO%2BeZeLx5hpKLGtkYaZOK1jNJNwJIRyZHDMLygy7V5y3CMLD07BIFCRnEZt6xIyT2R84megmUZtPnniOiBY8VgJY9BTt4QKStTi1uytISSMiiyVp%2BigMLeHntEGOqUBroPewT1AB2X2R4rQKvf5V7xXtHgyDOOLz5nyrF%2FyJB1JWccmzWh5JjVtTScIFg1YauUJq9R%2BdctlcBX3g4JMVIw4pHPMWJiQd7Pr%2FowAcQ5%2Fcr8fHnRWpKuwm5SNDjSe74Khl7MmimmrZBluEPA3SAj4Wj46K02P6ghbaXz4SqaQb0xNEroIVNgRyflaidYGjq8BVKxEly2efBEfcvrpUdul%2FVT2&X-Amz-Signature=26e3f1bb7f43774372eeace5f5c2fb9adb1cc2c817a16018f0a86dc2faca88f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TAI7AHET%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042244Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB%2FpMCjMQGQCkOkl5wWtmO7BRjwR%2BcKbjSGwdvsu81eHAiBus983XHdnDsMm%2FJH4anbmq74GdzEDcqJZ0a9cpfzY7CqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMT3i2dfixWe6ZMhHoKtwDsPQV9Q4cSXC7aTEe0oweW1s6zKx9agWq0sdQqYWFiGIoJonWKCyzEfgiUv2w9tQlhEtLYqb8wwJaHBspH3b5uQYTbHYuZad8KaR2ceeSZoQ0zM8%2BlOc%2Fb3zM2uq%2FM9hKaNO2T8sSlc8RjlYAVMgFN7kj%2BBvnb%2FR%2F0jkYy7TYO4HoChHPOGMeuDDV4M7PK2uoyK7HKcY6N3UrkHoJXU0Z2erx%2FLEml5se9UlRE0SQcDDHVWyPl0O1GQJoKN8K4P6ulwpLJHIzFYZeXAgX9ddUiWLliZL8foY1MTel1ecwyixiO62G1RQ0naDxUTtyJvjxaAcxQm5bz5lCMx%2BlJq3ZhWXWsjpjT7LPxzbYdFu%2Fa6Pd6FIt1UjnfpkQPVeInLMjVXXIBp1pHNg4NL8%2FQfsRKBdAbAq2tpwLFSziIV%2BdYdD5ov2e1bz0na3JjB9wiQjkYeNEXJPVSRxkTig4HC%2FU1p7HEs68IsLjeMXUARpEilYZhCThpa7o%2B5t9ZCJD5a8JJnnSm2O897e4Z83mycaeO5NS0%2BEPQfwLm5PwcsY0LgjUPqwtFn8u8g1nr0tFaLOgbYcks63Wx4UmfSiA5MuZf2s6JlcFwA8Z%2F4f%2BnHVhhgN%2BgBA%2BjHWS9ChsNBUwmYee0QY6pgHMhceY0cL9Tc%2Fu7Obrg%2FbQdA%2F91ljLMhWK3rcLehGmPW9D%2Fo2D5Ye%2BOqlWVfIoWYA1WIWcLxpvizo%2FzbTpACO%2BX3WQYDI%2FsGpcxHF6h5funrwjwqqkMyfPA1inBP2SpTyYrvAicJHm5JnLQzzt%2FsssI000OaS9mMK9P%2Fyj7oeHxf2TKkAhrXZxOEhyIxEA4cllHRXwyzrPorMvxoKx1zlmzWQM5yeY&X-Amz-Signature=c4d4a5c710acf909062f970c49133528e29de8469439f77bd47bd97484bd094b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZYDASEVZ%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIH0%2FZxUWRlLvrJr8jh7IxyT%2Fx2p%2FNVOwHlS2%2BU3TAtt0AiByPE5Gx5cqq3qUpigK8lXKltGQ57vmNw53YdGBjsPVoiqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMthIdeqz%2Fjb%2FRPmy%2FKtwDJAD4mMWQOzsV786C0IqQvz2cb5vJT4ZfgaBgIpzUaYiXYwSJ9d6v%2BWMrNQ0UBTXmDpw605%2BSHLuMJS%2FqCM1Xio7cHvD%2FW%2Bqn0Y92W4uRm7iQ7Agco%2BPFwapD2Ork981aWCMspMH45c%2Fa0ixN12wg8Yrc5vxX48hBAHVzQemF0tQkKs6gqf53tzra%2BTNc0sFw7xKYnZfDr5BRE4rHb8mS%2FitdrH4rNB0DfIoZSJrwBFakznX7gYWyAW8spPsxLX2nYrel7J3%2FhJC7u6aneoIS%2FqwBGllcJCpBqGNJUr0oqtZbnbKmxNDCOz5JR27yutQJ%2FB7c96JSLFIfNo9Hh%2FYqx0Ut%2Bd2cwo7eRCgPAjrfoOz8eie6afAnLOeuzpGjw0Rp70xH0UgGZekpRHzWBOIyZ4gAKb34n7RDO7XajbW8liyo9qg59TTqihq4KyPxtWmJY9rn7eMa3ZZzg3xb8%2F%2FP2pB1IzKE1GS6cHiRNcJEpeRGh2pu0p5feZPt53O46MMQBney3bybyGq%2FA3FE0yT9OAhHKzscvS3FhbHix%2BsR4%2FbgzApiuKA2axQkEEaAHDIdPqKG4CtYV8qbeZ7%2FOceprbrlwIF3NDF6HnNfJf48Vbc7lHv42sV1prsXCF8woYWe0QY6pgFbLBHHlkylYnJRos1OvzJiUTPm2g25F4N37SpHyen35BwPqrGMy4ftoyZe51hsi0YoxF5jYZYHE3VitwBrVXtHC8YSOHxZ45dIgmwXIfoNtmjR32QyO0VIDvJl8AniNWgHQgAUhWoRIb%2FsEMtgxDaxQgXKSZXLEW%2BuGaSQY6XKTPBCtbokMKogDDWv1DRLAG8ly8fjDL3GP5C7uAFB%2F%2FjPAbjYhPXR&X-Amz-Signature=5419ebca95da45b28868f111fb5bf94161ae5bc55068a0bcd8b90952aac7d6e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YPBWINOQ%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDsHlUa9lIjL92o%2FLcT3G%2BUEz0KoR%2Frb9BIFNsYAljEhwIhAI6pIk4Gd%2BCaNjq%2Br%2FeokWaRDW4auV%2BFat8WpQgCLPM9KogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwoRWbB54jBOHNqazEq3AM6KwrMKAUyfwlx3AXMr7rwvDReZnylU8pAbjfd6Pnm9yMlAaYggNJCOMPha9TnKJtTbfQheMJWCADdlZG1lywtEqxFBaNqgm%2FMT9J3pSn%2BMaZ2JzGJvn%2Buhcc9RM3IKPL9iuCxGyTN0sFP6XKDIpK5Icpk%2BRgdDXX%2Bg4y4T4uxRwyadkwzHtfYAuHnMyf0ZdOQd2CjDskGpNLIZp64uPQ86koqAbsmn5wHVmoay8XcjON3nkAqkgD7VPuCw12RyXWVo3rY56jHHUZOk48kTrRY8xzu1mIWViPWcG7Sq1ILAsKAnT3LpE1VcZiYzeQfZyEIqL8YITpdjEgRBWUJvro0rW6HpwajhfYMNtvbTRGMOGGPgxZN8IJhf1b29Woqa7bLIvObU94h7hdbfXo8s0xv3nhqnMBAz5ADCWzsrg092lQoEtnF2R%2FItX6HHfn%2Bzitv5BUinspoc3ygr37FX43lm%2FGPbnK1cR3Qg5gJ0R0mFAbOx7ujE2Sja%2FJqpcsj77D15BSuqr3IRC409dUhGNAa91DeJakFF%2FtoIGySfBbQUgCJI6kevSxI8EgRJi%2BGFMlM6GE8LDOs9esC4Pd6rK5PQUoOKsDe5OOBMHNoZQ3EI0oH9%2Bk0xhUDjOKbCTChhZ7RBjqkAaXQZkqITGRSuHIQs0gjRI8JGADxjznGOYX1BeOOSPCMnllNXsJVaauZUadfAX%2B4YWNYTPJeMtmliOCT9X9eD30wRUF5Cpu8RuKEN%2BHtvCdYlu7VXgH1gBbjWEtg5ESB4rW%2B9NAxitQPfYPW9QCaGiwnnioYPFI%2FAstmQ2AUZQSZt2Ji8Pp%2FtBhM3RyTCnVR1ChpOLK2zVlz6v0nlNqqHZTYjVu7&X-Amz-Signature=2715f023bd1eb277c8f8fd78d48a9252ec21487dbfc5e7e353da526a8c929a9a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPNSZMIZ%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCgxVwgW1lN66TQ%2F8WQ1WIi%2Fg68jsaoTf8er5ALkPTrmgIgMG%2FmrQ3R7FsFwufFqGy9%2F9UyoFYtM4W63YxExx84GXIqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDI7F6vBVIuQQpkCXCSrcA1Bdw4MUlTmNPvPOjvBM0tQBn2SVCBRfXtApSbCW%2Bv8ISMs64B42ynqrkd4%2Bfaw%2Fgm0pNAXzKDcRvPRiBBxtTWuAUtDSqhWwKp4AoVbvgNAzr7JdNYPhNiIjQeiZZdMD8tdJAN0YEwc4w6uWugpBvJ4r4Iy5xxGO9cp%2FCoXIash0RYcP%2FndvtZg5dDQhLNjXLi494xLDFWdk0Cr4TPpUROn9DXaobhUxEROkJl3a%2FMuWtzKR1L5xAd9x9pnUiDqIMujJzf%2FXnO3MXOlP%2BjTVBxGK16BlFBEc0HemjkQnxF3OQIwxoQhuyGTU9T4rqZx4vUfWLBVV4Wwsd%2Bxvl1ECiY6OOCGnJqDoTx1Um7mMvYlu1CjMZRllSBsLwZQOtKGXBTXhk99qdWlaWpob%2FU3G4wdbNaTdBeWAf5KU5EzXZTpm9aeBzFJS4xYHK6oaYqQgO2vIeB4SJJtjFwae3%2BJp2sEuOfQM5OtxindHXvKKLj%2B9Z69R%2ByXHxcNNWKF7sEh1XZvpYUVrDhyfbYmEtuwwEVmxxO5Hkh96udx1L08qR0hnHzymAuHbBa5ij60r5%2BYh11ulw%2BX7zIIJNQOwLKxvK7MZsUsh6sEDxTdjbQcZrIFj3XxWMiuXOttvm5JpMPyGntEGOqUBth6DOtzCj7MIn2DhYObXb%2BYxaV8Jne2jLk8eC5dLEpd5nOwaUnDDboEUv%2BTJWm%2BU21Dx%2BRZc6GNf8f6PC7Eh2TvisWSjdFagKioozBunUSnfg35XeIG9B3d3%2BPVV%2ByfdEpKUAr8kfi%2Fr3nPea2emZMgNi7eiNiV3nBExm%2FQGht%2B9zm2TcBtj8RkJTPqLG7BBFH9RvXm2eSp9jS96FZXTHELCmxiG&X-Amz-Signature=f56ff8eff34041684a51b160ad36a6df0c1c3defb3f2d9cbec81fc7f18a5afd9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XYUVIUQW%2F20260609%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260609T042246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCljU%2Fgn7yzDMbx8oPBU9PlFL1HsNNnLUDSE5dR75GAwQIhAIlA2yURwRFYZNwkZMBkhRFOSopbRJZD5EkzLlkZpOn2KogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3xalD9i1d2MWCohYq3AMVz5Kn671v8eXllGrWc5hJp6IpEimvA3mbmk%2F8f4pMh6Ma%2Bde3KRS%2FAuNMvn4H1VetqkTtD9iM2KmwjFhdLRNFb09%2FyVJuaM%2F%2Fxt9ofkWRsSBvy%2BpWlkf4IwcHJDvmKFM4C7711B8QHeuyXuV9lAoVO9wE15F9vuTeq1gWX82g%2FHoteuiljbkMj4KwGbido%2FRQgBxLyveD36RyfSG%2Fzo6Hux%2BSAx6Fs8uAZyrkzjkJGOSjei1HDA3yP%2BNgcUJJLcKspsZTLZcy3%2Bxxtx9gt3FYc9kIdKoZ%2Bticb4xNZwYDvMlD1ZrDZd2qSVwP1Hw3KKbECJM5cLK3cpJBSYWcBNbrpOPe0dtGXM%2F7OTC5hb6b99DofqY0xxb00DlnsEXxdEHyJyLGwkGwuiQSV%2FUH8sB6NZAncBNpRHa3hHBMkrCNyTBOI%2FeaCg2BXiNJg195D5L%2Bw%2FxakLasGOvgwjR%2BohO7p5xXANMfzv7hYhodSm0FTcfLq%2B%2FVeGA9N43ptMceRtQvUdjNLOz4eRnM%2F97DSbKSZpCcTjaMApMxJahkLU8yJftoXGA9HbLyd4dqttsKqtKbhbObWT1YStW9hT60pd%2B%2BrsYBP3UinZJlmP72e2gUPb8GRxY8svwqAdIA7zDdhZ7RBjqkAVHMcTZ07aYw5a6cpu9QDPiUpMAl1GAeh9Rm1ZzT2tstdtR6GAR5XCRr7KE1j8RdksLyfpx1G%2Fc%2BxRG8RFZwI7TIztVzgDInkErmhmwx0k0icpjv4NJqVUAd777krgW4emiXnnTUaYKaiO8OJ%2FMSOhWA0dYAJbdgEyiGkjVYOnUQ27t2WHjEzX8owDyIxTAJa%2BVRDC9STVNeD09aZ%2FQntxrADq1x&X-Amz-Signature=23a3bf4f9ad31e337accd9beed3faf4879228146c04264f67c5c73924a9e2762&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

