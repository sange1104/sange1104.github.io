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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YQQHXIIN%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035209Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICpoR%2B%2F08Qqneu5AzeXVZ5fxyf1PIHYdzPSewmAemgSPAiB%2FJ3ceVe7FRBnai0IHycEybAMpcb1%2B0bCSySYuJBikpSqIBAjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMv2qsNgO5GpT0R68HKtwDgAHrqNkhYkA5%2FvV62gRISh47E%2FDepauM9JdJYlho38Zx%2BM4ssotmS15MgszAXeFXJZoucvDwZqwYMaGMJxmvanyg0gVUJ%2Fy9486STyYBQaJ9t6Z5ljLLd%2F27ILhFCCLTSDRoiwfBKtN8vZ2IQfJw7%2F2I%2F0BZqiSWgf7l0EYuXuE0oiOTPgZMPmOf7fVGuUdw%2FBWaS5LOlx7XnDPT2f2taec7c3cggHpECHiV4JdDTeUTwOdm0AL5XiluB7AwQYUvOn4EXDnIEEF8s9QtW8hQwBWHgYI2AsP4Ooo9H%2BVTlwW9gM8FwN1klyV2PGftHM4JwN%2BvA0H1QUgwrsf3ZVRPHMqtkdOKUsc1qT20DgMxqeZerdm9k%2Fvi9k2%2BLG9JgPrmp5j0BTTid3iHIy2XJqAFvVnlxkFsbZaFCXiak5Jn272sthhtLYVNJ98EBDCA0h4EUjTuQmaXvV2nVhj%2Bo9gq%2FtvAwQl%2FRMvjmTUf7OpKixz1ZGIM%2FXwKBeHUghkN%2BZiWNYIukynXhahU1hmLRq6X8VMrPETnpSIEm7X66rbUj%2Bgm0KoyRb0JS0OxAl%2BM6%2B4q7u3Naa0U9YRAXfa5opHnZeHdEET2zfBBFMyAYI%2Fh%2F0Aei4%2BAxOVnVN%2FW7OUwkqP1zwY6pgELot8FPNc5Hd1gti7RgkRwd0yM1ZAswNOcChCYSb0ApzzjKhiqFk9PNIP4qA%2FaaP3oFiMbUhimtXKKDLdWOVhwr%2BRder2vBT90Mxz6IbZjnsaP96m9%2BJ1NA1Rq261xIfwAHVxqTekPwN3Vyfa56k4yFkXD1OmdUg5zs5sKX60CZGJeh2ecA4iJalfIlM7A6Y%2FtEHzKLkorxO6%2F6CjkIZQkdZUnBtmE&X-Amz-Signature=636139c795a4d3bdb6b276712fddc1882a1ed95edd66ca584765c6ad90ab37b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UV7XF2PM%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDZYQ0uWWYmv%2BvKErzEmL76eoNC427Qhg%2FfW8wrW0VFoAiEAi%2BKtuN908yCHaxZ9v7sAlhh1cI6bK%2BWh54KMEYJ71QQqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG6vB3pBuWmLJ0rBFyrcA1BNnjsqd8SBm%2BP8CDMdlEwYKeIW3Q%2F9tCPyzpR9wdH3nuthmNsmHnaTw%2Blj124ZSACw3gEvVzboPmwlIsXRXPDKerUuWXVp5OJz3uBOH6S2dfEL1%2F53yOxzumGS7zs%2BrtphTvTRC7DBxKdIJwZ2PvpLDEWz7HODHQbrh3eu88XqcXrWJMoiaAlpARr5RESfRs6H93Y54kQuZmzhcy68vy46tMZBNnvN5ZoisVfX8EtPiF2OCE27xCjMBSTVXtCV9S9MAMrvfTGjL5%2Fg%2Bgh0Dfcx4UHDnOTd1bXg8IV0F2IZwdcgpkppQKz9xPyO178AgaArxPzjrwzsDiaIbqJej%2FtzZh637ujPSWdcnl4h2qqcxun2AIjcUGJ6EfT5I86eDWJyW5mOZk9QAqPpt%2FGclmespek4gbCkPCJ0bioMm2DVnlMcxJBupNRqr5hov6ql9fzyHoEaVGSgi%2Fv5mX%2BH78W1HuNtS01euMzCmzf3HMDWTfH62LxFJTjeAxMFxJq6h1iyJdBp9HkKyZT2HWKenPdFb9etTB86%2F5NiQlcLehigic3s72I3PbrjNO3EWvsjER6HMxyrce76Ah6MdNTNn2M22BAL%2BjrTDvbRBTcFOLtFxOLbsYRJOvwwXO1pMJyb9c8GOqUBe1oTc4yi9ztH30bRwcNXp%2B3KldRbtkOlymGnsSu%2FkSR%2BtiNw9pVUrycORcuMXxPcVpS6csTNFE%2BaTxjz0%2ByOiYCon3oI9l1lB%2BLVBsXwBnC1ioF4e3kuKm4%2FuKi4dbzohYwhWKA3KVFVaq5OchHm%2BCsYbz%2B%2FLv9EnW9en%2BXOaz9Z60mR6KgInzbl8CZS92YPmq1r5%2BtQPCNruXnrhB3MH4in3FID&X-Amz-Signature=ab021a7f870b81825d5cbc999e871945a6e64bc6f21e5af37a6b536bb59c6db7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466634KIEFR%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035216Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCXdwMTAJLKM%2Bbmse6Yry%2F%2Flkd8YUIxP1NHV9YNes6rXQIhAKX%2BsaEAW1bos5LNgfrMwsBjdqtD9jOOwiEPY8dtbpMYKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzfv2kMAs8kOScqth0q3AMcLAzOPj0zLJe9DnAgsCQE1FIMDcGu42KqrzINL5iQf8pN68gcx2NcOi6%2BIlyOnCh%2FX3PZagXHQMdCQX5ZZgdjVajNaI4iDTxETvl2NoX1hxz5kDVbiPQkL1fgy8zJc3qckLVqHNPMv%2BpvTDYblWiCLu86m0qLYuxEeUjK3vH3WzBcx9TAjy7q7aEapi%2BITV1s%2Fl3pYVNuWlsIS2UBBfQtnu0gRZYBbIm%2FY2HcmqktW%2FKsk0NbwlQeiIv9vZcc0XbEKJz9d0CpjcS0C10cDlMwDj0hCql7nCB79vcrAhE8BpZmXG721bzbgJs9ZH1wGVtI2Ue6J8443NEkKP4AgxRCA0On1khHgAeeIKSe%2F%2FrK8gDtQP7P51o%2F0Teryfn0agMzjeXUotiKz%2BvlcKM6kDoZwaTlbGXBcaWxKZuoOadnxhpHgfvwVQ6dWtgkZwb6XxGB1DmbbM0i3WHT00ns5pmIkzvKplTHo2WraO8SOKHW39RAAnrH2IW50GRdwUP9CAR3fVRJlH3LHx3Pnc1TmVgwT%2FB%2FO3uoZpJu%2BcpoNVf8QJYYDZrC%2FSheeDpqd6Z8p5pcpat%2Fp4H7%2FyOh%2FxRjrIMcCxwQI8J2Tv4fOwhyFmXMGMM3lkNtVYBZKkmL%2BDChm%2FXPBjqkAWO5qiXHixN4ZT3btTLnxToaABtBNBGwYALjYQi0N07DDw26z7rJhVZOwucDaIGNWwyibr1oWbnW6UtMZZ5hiyhLgj69svb3hpKxJr8%2B8rF4xWMTyWPy7Jd9cSr%2FirEWCtm9%2FcGcoZsCan3v%2B7xBL6Y%2By6EqhKLpE89UsfxbITFXW718XQ47HOlU7%2Byyp8%2B%2BUnBT8Nm1e%2FPVe1dGZ9nGu91jCtWm&X-Amz-Signature=336b345a624a20ca467abc0c57681a085ecc328e15de657e72ef40fd1c2aa589&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TM4YSMRT%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035217Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGXOA0rQOkI0LudCylEzWwgJxT56bHqH3nDhR2KSZ7h4AiEA9KT9%2Ba92rCGJ7zqdv6XCWqDHgaYrrp58N1Hr2KAfK00qiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLDaug69h6g6kA5nzircA4ARog9fG9OisSw8e0MZIWKQxa4X6KJIt39ia7JEKSqt3Aro0e3b%2B2DlwAabUGgSEqt9wUyKfnEoKKZLdOHkIYtRCHqPdX0YyjjK%2FK%2BEaQu%2FYugApyl0I2CpZ3YuH11vny5t2qNRahwprWv7hBqeVozeUepOBQsT95hJ7jcfMdd4HKipMk3RwzbAUijALCi57bDUaN2QA1hQoySB7Hwgp1NNgesw8DJKmmtXEcJq8nNqrLy%2By3K4nP00il7Ri5qCW72tL%2BxejiIDFB6b02sloGM0MAMCmsjBABqrYYAcFGlVrwENxPiXclCUKZMpalm0YsvGoBNcjduSnRfn%2FsFSqlJftQ%2FkdMupbD9VE61uMN1QwedVTRC%2FM5FA7BsXLOoLOmDL6p9Y%2F%2BJ30Iq7IpcIgoSbUR2AQzMcagEAAu0VkNBvLLM96tvYxWVz%2F9D8r%2BhUjEMDeO0RfbY8kc9N5Com4JFaLxNJBLxy%2BCiUhtQcJWZWnq5KaENysFvnpa57VcZGCHTq02%2FGvMqTL%2B8%2FglFJ5I50r2BjUEk3qo%2FF6VQdtKeLz1hX0CQ7wxRLovOXz9fdflQrZwemWS48ZYssN8NY1K9L90OsuSXhNhu5p4apkSEDka5iuxgrWtF0HIYnMLOb9c8GOqUBKNN14n6d7xlqcYeYoHSnSsKhjorGJ%2BiPmrVKbfmJIUFr%2FNfoGB0YdkkvZ9B4hOcuzU9TU4KUiUyTfS%2BvPA1X7PUOx2iNKzVl%2Fxccuq%2BuA2dTtkOQpmy0lfsXoCxnuI2tNh447wIudqU9vjijJ2WOf5l%2BR7NbY%2BlhQnL%2FLT6E7WQbasAQHxlx1S%2Bc%2BosUjzyDqS0eNouQePAdLujzjJJ%2BItcenAvQ&X-Amz-Signature=85e0aee98ee869d5f26105cc8f05adc6de1c67eee2a358b1ff92b8bdd6410e12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MO34C2K%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035221Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDO9b4YIO8OuHc2L%2FKvgOjH4d8Che%2FdnyZ4k6%2FQRpzPVAiEAxZliOt8YXsyFQKHDRmbADsajSu6QRcD%2FkvnZtLLYVHYqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPc0KsmHpsWMHr4hhyrcAzgoyXR6Cx6FrzEKvPJNeNt8yDL6RIcyTmyAqf8ib9JrRKkMw9SX%2Be9opdmiKf12ypXGBsT%2FdBWA10f5pnbpta1gxA7hw8GSgqjYxvoWZK88fYAStuhOZ7ROQ%2Bt9XTaebnNck3XboR61bZyXbdT3JvCWqRf67CYj5qdFMVI%2FqsQ1hIwBVupaBaMXLkOTvxUFDZi4V4UBe2ZkwnKluQv73g%2FMag6A4yxtv2imqvXuePEU6f3qAiM5LCP27znW2cEoRLvn9CzvGd42JgcMUJywTSwcbu%2Fq%2FAHdMbglKaGSpBuU796NxPXSCzsL%2BA2ePOTSwva%2BTRPdKS9iasaUJ33m1chKixG6ft%2Fcki%2FsrJ6uwnb%2FOOKmUJQWab02tXxVv4xJGajwgdM4DXh2TsjebXSoUkbSUGDrC1fKpOxp8lfmoAw0yD69zidySyWO63arO7BLVCDtYIkh9q9LFGOQqLM6mY0zlcoo8zld2fl%2B3TzDKkK20cC%2BVcDW6LZLCCGtpODaTYFT59oP5u5AhFNln3DybqFaGq66KzYCG1%2FXWuTOr7jLG0bQCgtfJVtZcdf8bZ4BsSB3X4bdpeuVd5TTe3tsI%2FJxNbf1HTsD%2Fzb1ZFuboYK5DbRQ0TknUp7uEKgHMPao9c8GOqUBce1EePKLeXbkYuUUD%2F4xjM%2BFgbdfKQR%2B3JEoyWd38oup6OJyc6c5zwjZlVF4OD%2FK8H%2FMaLQlzqeqILE5OK9S5oiF38AuP%2B8VTIrEVPNbses43onSTnZ04JHcT42EX%2FoLZVcRc4NQGdClwywkNePzs7IbBPDFxjI3aE6Soa1vnT5CtMf%2BvTrsGDqCbGkF3K%2FIXFFD10yAoc4n%2BT%2BOmb80TQdIThrk&X-Amz-Signature=45e7db3ce39aec4d10b092a53dbad94198950c753a4dfb4b815cb529c3ec77b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YBSX7TWI%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHmcktuAfv5Ql%2FzzAvxtDJBwNUQqbSTQn4YjKA9vX4MkAiEAz1Jkt0WlIyq2Gw3FpoT8B%2F4rMzouqgvIBzOFPVQ2BrsqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKMK7AKHyGuuFs2w%2ByrcAzm%2BxzA0DVI5svmL%2FJ2xS1Uo7u5uYLAZaUqtBl43xn4SbacHngvyE9TOM4Q%2FHzsTdjnd81JgmDISXYfqe8Z4UJyA%2BngYHyx9CH1sA6d%2FbA14e4qb9sq7FzC4mj9locATGLLxYIPcZxDPDfiFhnUcVxdiLU6swfC0ILSmBrYgGqVyD5l5iF0BGsAVTpTuKHgKSIx10gJzRGBmnalmWurUIPHVjvygFbdnlnlkx%2FccghDVIveDV6tqRfd2XjnY08aTR8MkIOHy8g8GYf%2Fu08U2eB2x%2F42DxuIa9TsYHCLz%2BTnI%2FlHsr%2BEyMKxhO3f%2BFPlMou0NIN1qZq7%2Fv9dcbypqQilH5MWjFUxFBjdmsyiQ3mO%2FrI5uMYCBrOgpW%2BM42WH5aT6MXfM3nN38P1PxkPH9WV10mZT3R4jzbzfc%2FcXHEC7cLY3c%2BbceSV5p30%2BQc%2BgcYOOZD0vYj6D9FFihsI5V%2Fg2uvq8RiEyZXXJMb2gaGO56%2F40AR3TN2IkrxQVuKb0JyNq56wDfAKBEEAWbnwJKDdeeHBMMChBzfi6ABoH%2FKDWm7%2FqUzji7zepRiq0RotLWClooq%2BFJgTdHZ%2F9G8KdosiK8ekuIEOorpKMuJTIgcYBp6cxXR1D0lCC4%2FxiOMIia9c8GOqUBU85HuqXBMkwUNiAitYJaxn6Lr9kFE7%2BM9prCJEB4xvSEpUuxQjBAsnDILkrMFq7m8KCIoCKqR5IQQx4NcxAEJ6tZs6UF8kGWjvgULTpDhs3DMJ%2FtZor6jg0wkAObCfeg7LC4y7vNry7tqZauWOYUY9sYx7iW87012QXlsqEkyghzzzqWi90y3iRitOzT5IA4YnjToBbUK5RDbCT4sCmqDQLo3M4g&X-Amz-Signature=e64ed2ba3b97caca983fe22d6592f99f7d49b2d257efe9fb4a8da2b72a7c5772&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466USAHSFLT%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCGczr9ltcPP3SYGi%2BcR3nljRrnctboQzMyRdZqAiGrcQIhAJyGiPTFLTIM8UKIDAfCkF4ZX1iHIa5z%2BafbMM%2BN2zmiKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxfUCzIs2gN5qPD2wkq3ANKG2fr545rt3WY7ugsegPzikUYsDMfGl0dNeXGCEDARE1IYL0n4eKMiti41a1nMEozBvd4St6CzzZ94hXauKUwOP8KhKAANt0nbL8p2LBdNGy6RN%2BcTlLZbuh%2FiHoNVsY0aZtSypMv57y%2FnDi5omY%2FvGfIVH%2FPu2k6%2FIW5Wv835DtK6KJeKmcONuzCijAz547ylxI325y2gPtzcjvNJDfNHdlToemURv1zbkbRCxaMuZyLJ8eZTiiV3221QPBPS5hWZ7WNw0DqKxq1PN0qApU42qnDd9KhHxp5Ew4FIiAVzGrUvMabSGXSa2WFrnNOpxL%2Boj2TNo2gAd5b1WmL8FjYTVRO5ALRHZ3a9FsfPiet1tESIjt3nit5aCuMu5eRQYyRoJiPiWvviQdBOLhwZVodmRFPRM0bWMg7M86zsthA0gpaq3VO%2BMA26UrJqMlpNl2wwnidh2fqcHPJuzUAwbo9XngbRTeWx4wkq0M0Ic2MFBenv2FNuAtM8KiwQDofF70pb3Vo67HH8O%2F0Jb5QwoXrS4NQ1IooJiLdScHpmqIaSB%2FxtPIBicUg1JSu8N2ckOlPQJwQKk5Sbb8L0MxdG%2FsQfDqYn7iwWlDH1VmRVlXPEmabMS45791CsNnhrTC9mvXPBjqkAQUixlFslxAvc1vr5cvzYO3LqTQHhswJsnO7KOrVWYbtzk6pDkPl%2BObFELX7fYd6ExvPllPzpVrF%2FammJTy%2BKhG17AMGfalLu5BdaQvPpC9FKzwq3CV%2Fr%2BhCZ1uSszMeMt%2F1cl0l5AqX0r5GzJst2FIhYMDPQrv91zNdptiJ%2B820kLPeQi06bAtUY%2BebGDGounpoCuu%2FKmvPaifMmJ%2FrZ7Dhg2i0&X-Amz-Signature=1c733750ce962762a77dff144745c08e434f08991b11258cf8d452a431740a18&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662P6QDOBC%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035223Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDgNrUoVxhs9BIEXX%2BAAsCh3TYrd6CLqooNqCUr4uDEhAIgSOZ5vtnFYeJtqh5mWff44RaIe4XXAH%2B%2FODo4Wwe2pQwqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH15PWvsWohTOa85uyrcA7aoi3QErsoYoUP%2BPhwkTxvaAF%2BctUNnFJ4yfVLy1LB%2FSSyH%2BOzaDLjRpgRHoezkMdL8VaxE46yYFWn9IqkGCSk3asdKT0MCNR%2BYoptxhJXRe%2F48i8umwGTrwEEg1g5g0rdSzHawZsZwzXAZ0bBf5r08VEX%2BecyizVUobRgCrenBNQhXLsI%2FO4y%2BHyMuwv8rFOqTQWSMAFWgV8tIcq6vtbjCQf7ek8rIEyxdSmpPGCe2CMB3016i9NYvWl7t%2F1LrHOBCsl8bZ%2FmcLVNAVMfjVn1h%2FvMWpRxLMZSJIoDkJQfiXkFoNM9eKAFYwTuUFTyLM2nKUZoQiNHK%2Fiwm%2BfjtB0qnCgMwCzVTHgxXFJB8o%2F%2Fom27lMXjq4p7zZG6QFBvf67Zdk6fEXfkmo1NEKU59LQRZg4%2B5qTHsMllyYVSbJrcL%2B5i3VdZE%2Fznh8SqvvvoFA%2BvyqqN3IWO9%2Br1YHvzTyExljV6MpvmrEO2KZ78x6%2B9YsK4WX00xQmfjcudiixK3E7aY5ocsJLYlrrW46I1pROWop4M2LLd3gcbHCeNWYoAVQrmEbfdMXxJ6RbnPpPd%2F6slr3Zb%2B4AAz%2BRFGIg9fIQC1lOQtOfMrn9U91FPS7wSBG2LFI6tWOBLl8VoGMMab9c8GOqUBUHT%2FGdjhj9stwrv%2F2uq5GSjnvvIsOuQp1t5wF15mM8EIIa73PYZnNv6Fr4FC69uTRVcoR49FQ%2BrsVgxTIwHSQ0oX3mpy2H%2FkBdnnRKhSYo%2FK7HfRoi1Km7r2QZcSBctxCX7tt6Seu3S04lHPGz783DopJEOMQNdHb7tVXyG6s%2BjhgcwG%2B%2FcikJfuQ4MhzMBSnV51vk9OooKCItVxBbVoPjC6aRLv&X-Amz-Signature=879b9f502580081472bf351cd000c9651e56d259ed9f4499bbf789a7d2458448&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TIRDGSJD%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035224Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDjGiwPEsztMNNY%2FNONLKmmXTutkzW7RUaqO%2F5IYxaVRAIhAJV7UI7sleWX0Da9og%2FHzh8leUZ8ytA%2BlJ3D1FBjPZ0gKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzlaOdIf9VDS9exfTIq3AM%2FgKYvn276%2B8%2B9Uk5Mg1QS9RW38TOooPXSaq9XBJVLQNvq25Y%2BRYWqJ8w6OaAawJQ%2FA9LaVKVO9GRmdRxskwWYWjSefOLvU44URnYlCUjJjG9KKX9i4muQZtpl1mTh50PxvpDX0jxyLksBeXeWwrk84HKt33LNznQzYZF5XYPsRkeD4kQA8pd4XmCmU7gYc%2BIDBI7ka0azdxwdTZDODFDPxekBAOTYhMStG3UbBpOi49XF622v2jKOcX5n%2FLIDwW03vEsb6aKo68Whj%2FfC%2FNVsDlXhi9ubsphVb08G771hRIkFOc71HgRuj1OjOhzu1BliD3ujwbuLGhFZRwUVwlwaSNAvtcX1sLC19Au5PorGKdEgRZvQz9e%2B2eS71u4egZ14RWZZGoZ9PwNTtMhfSXPoQz0Fdl3%2BhuR2vSgPenFWlPRck8pXV4mF4zRuvYbkxHiLAeXxfjFatW2vp1h6fXoc1afTs%2FHjiMqbnu1Yi3SN20QGMsTAGXr83JiTGlHqlu83AkN%2F%2B2y8q%2FdNKEA9fQPmWDKlduIqO6jhq493cLM3p23vUNc%2FJphOyEBAC5eJDqPWhAAOR0gzj0dvhvbPeWOvu1SyFb0vEBxDAG0cjMcejOOfN04hdK0uxYWFMjDemvXPBjqkAYjHeIgZ%2B4pU4Nq254Yh0L4MviThpUYJyW2WTz%2BorGmX%2B6mIvx0WmEE16H%2FfOVcH6%2BFIv7BHQ1CwW5COJ3ggW%2FpuCf9BSZSPbPzZQPjJWxvYuMi5U9HjMFeWS2U5TLKRU6dso8iHABp%2Fb6l5AhXVfWRZ8CvxniVXD7QzU0%2BAmajG44M7naJU03yGfZ%2FTfcM9ZczSeA4ZxCDxB4gNmevmzSY9O1Lj&X-Amz-Signature=b90afbf2ef2ba2d86441036f27e1df09ddc768cb07c231b0bffeb7c4f58cca4b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666WJAT7DJ%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCNE0xYbhZN0%2BiKpSU9MfYf%2B%2FFYhA2kXFUo%2BE%2FIuArbTAIgdzd0%2F1COktoX3ti0CtUiGs%2FIpRnwcUS%2BnabUiqcZYqwqiAQIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP81EiizyW3Zdz0Z0ircA2UaHCLhxmXJ0X2GSbZUCvsNOsXagyZxdVO1g%2ByaoPabLYecN0ySAQj%2BdGsFavAQWVJpNpzK99TzN9Cw6bL%2B7KQy47k1CQ5woox9ZzwkqN4uBkXp4QwLNi2TPkjjUZDML9Rmo67RLH6B0%2Bd8%2BTKA8MRCLvaXBLWq3obQxyO%2FzuHgc7H5wSqt%2FIElZF3YcmzFrtetRVJd5EPjupxHHHA%2BUXOVFAiwOR%2BNbKhwSs34IovefGMUpSbMIULS8U7xAECRdP9ZUR6jtYZ7E3CRY6Gr%2BKagoK2eTTqtSP5%2Fi8k%2B4Bi0hIy7h3Rc1JG0r%2B3vA5sJF3xEcNnqkbsMH7FMkwikugEkNjf8OV5YpIaLOp%2Bz%2BngbRHLDQ9hhYMWNZKzX1OinWNlkcdntvY4ocIfv%2BJ2OumWhDE3ZTzQq2rkGoAZ9jCcLbCOe%2Ba9MMCSUpUYSkou44q6cfUCfirt0tJG1XAqNsRRtomFt5s8rfskKGyutYuPvnL4dG6xqNu9SeIC4fgk08NrMlpXfna7phrTyNj9e0BLCMsHUFthQv9wZQMNviUMDbP8Vf60P6CXwtG%2FAVVdE%2B3fGqKmsP8piCPERKSOS3p6ltUVH6%2FLjWYfvTzg7Ny1ZB06EGuOqyZweItDOMO%2BZ9c8GOqUBWIAlzDJUXnlfJAQ29J0Yg%2FtwJaxPBCAraYxGV3x9fSXMmwG87XNcKKMncnOxTmAaEo%2BKBkENxrQiMNhi0SWtgLCB8q%2Brb6W8HZbOwrr4FzSF4qM9r%2FlP9%2BYj7fynibxSH4qGxLstni%2F9agDeHhup9vOkrq6o260N2lpHhhOlDdWS28AXmD%2FSiSgO5aZZwj2w%2BQ2po5USp%2FTVgv32HGHyw4tCECW3&X-Amz-Signature=8241db2105ab38f297b7f42531cf88de602e90ed03b90a17a063c9c109f5e0e9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZUQXNLEW%2F20260508%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260508T035226Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDBKAe3firQfWqcGmy7%2FYuKpUDLo0az1ZgFKKsCVyho%2BwIhAPYFvfrBJZrnh1y51GwvIk5xeML2O7E8Eti2QF8dE%2FUBKogECMT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgywItDZI%2BpZtjKpgSQq3AOs7qYesNX653ztKI8iYZwlhSnGxLMMY7XrWiaZ8DY2cOd1feSNx%2BXcXIcqERvm6AAnorTWcavc62Ty%2BgTKJRgyI0Q2Atqz28MofUUezGLRJdG5exOLTBv8xRj1%2B8acqnwwnDa4npfG0DPd9%2Bfs06aIBHMVbFH1nC8jOT9uijFRk2lbze87lN3Zkv4OqQkRg3P77ei9WgiKumPZCLUl2jC89iO%2BbYVjT5SUNavUNssY6cVNMKfOGXP4VZDw8Gj26Q7FpBz2ZdvLVvCVEi4Uwy7%2FfpipzRj1QbiRVpiPY7Zv7f6cMiuN%2FjQP%2FyAhPcW9ah%2BvEK8APtELG3CaD%2B%2B9oR4cryEgpwiDGg8CVSzH2PZvBelEr2FBuEHWY%2FtuGkwd%2Fh3cLOtQnpgqYAyABshtNWigEIDBMFGIY%2FJAWid43qoeOnLqFCdfF52a%2FKI8rMOTLXiOTUThfNxV34e6pmWl7tSUocep8%2B9Einno8OXgNGXK1Vbw1C7HJy3BhWauj3vlajLCsQQZjxOvoUuv8NeM9kBYru2nqjIlx8z4LjgscCqCs7AgHoMPhyzY2pk5i%2BFRrcdpzGCeh0IZA%2Bo70UkzAHYs%2FabJx1gRqrhNzwd2Vr4M3teHo1n6vbMOWFie0DDEmvXPBjqkAcVavfXg%2FnbZnwU9QDsBD53GHPV3%2B9W0i3EmIx%2B0RJXaEyZb687mdJ5kWoZCNaettssdAk1%2FXMbxm6hq3TkUy9y4YCGTypJxXIPvFNJ8zoNOlJIFHAxODrfQ6TmxJsO108pQrBzyww946bF1J%2BL1PhsTU9CPKWjg%2FWTxvijm%2FozcZ6hFSKVaTHeNwbFAoVzDd4%2F0Y7zRqV4bDjIf%2FbNcT1E5w9ra&X-Amz-Signature=c89ad1099212b1da87b5b95f421935c5c0fc29ed5a5334e7a3ea7cd542926108&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

