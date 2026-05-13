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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662KB745NS%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041108Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIAR9PSkw6M5iHZqVSsMMzbarRDytAxEqxP1p6o4jRyyqAiEAwv1n%2FIpoKTdHIJgwggWmpJ7sJfaNCVOCZJ1zlIY8EZ8q%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDGT6SKOy4Kxz9cy9TCrcA2mSw%2FFnFvOF%2FBafyclqdYNvulvcsKbAPA5bQPJIjvNpn4d75eHOKpSoKwqyR0zefHcnSVNkR3pCjJZjfV18mTm%2BqnhUvDlz1F3JFLH07e6b8Wbj4keY8UeuLE0h2je0T0uxrbD2s3hML73SX6TtRw4FGg%2F0Gw1VAdGJDuZ4yGDOYqmSBOvJ9XDqFISKzKQIu3WtxNK9zFVMGYvD89IkhDYMIDPQDBjJ166fICAQUEMrib07B0vlZ%2B07KzJJ925L4ZXWt6n88bSEnsJapKS5FNNs1b%2BFoxIxQ77v1hjAQiFCSf349AzunANmj4%2Bz0Khe5o6QtolobekgdgJ9yOBSQDSfyiKIUZeoWme9bQGcf3SeP1Jb%2B8DezuwcxlroYtnmkX%2Brp8OWnzZXXieLAHbOWqm2Gzf32fZnoCVebYZMnpreKH%2FwdYKZhxV0g%2FHbwQ1McQ40fBVa4KCVsp9TUNgnBUSVr2zCA8%2FbBNywYRwQPtGDrF1aNdAOjzcD1V33v7RFJ4qa%2FdYAsloaRVake8F92fpuTiwBKaN3PmifxrLhzVIX8s%2BXMHL0tb1mbXiPC4Q7ct7io7QNgHLyiY0F8PEbY4zgrHGwWUJvS28LVpX0VSTzmSEblFC%2Bm7txKl%2BJMMzej9AGOqUBlZg7ceIvTytLQPm%2B8hPdt%2FlhYrHwsZ6CpiyHyetKF2hV9rJq9ysYaqS1VDkKCzGAQ%2BkQTNL1Ahu9sSBAeVTSwGYXFbucdppRYogwEzzCkn58MaA5gugAHvhucs1%2BuRnpFrlgAIcaDd1Af6%2BfC4FAytyQ%2BXpORHyZv5PP8g34LX6S7Fb1gLCv0cMkExKkRlzyRsEYwZrGQj6x3slO2XcBUktBNWXZ&X-Amz-Signature=11c57b005ad71e010abc01f8cae69314d8481400cb90fca0da318cb252ddd80b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VWY4R6IV%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQC%2FMGCin8DjxOVGC9HyMUhaxtZb2pPm9uLKv%2FS4VJP0qQIhAIjs%2Bs5BrjPosGaf%2B%2BC97Mg1vbaJHSwrhSriBFDW4GeYKv8DCD0QABoMNjM3NDIzMTgzODA1IgyJMigfpcADZovk0vAq3APAKrqwQUs%2BOeB9IxeW5djLXBTxGtFC03f8gorxPwtRMeguKM2vIdqDUyZWm8yBnWw2m4egMtcJgp4izebuoup98uXYGIFBKZbGjYO2QH7otKhbAGgKLvUZx8INO7qOiSuFLB%2FQcIkT9VZMcwuLGKwGHRoBkbhcNXIfuLkE3D5lCza8xrLKPJoUDDdMlkKx8ae4QaVmLo30D%2FAxsb0q5oAR%2BDExie3oE%2FwmQ7egOZx077UqWks%2F0R2nN8Xi%2Fqgxk%2BCsx05u%2BMPGdtySoSym4bOXuSnz9qh6aBgPR%2Fkckp25NrHc7wLzZb8u5Iptu7v%2F%2BSgiPb83P3j5OMJkgrcUMSd8uvwzQLw3bPyCFxTMuogNeOeOXVdxtUCxxqH2raUNUEVIyzg6b9z%2BQjf3wOiRTUbITkzS6mi9UoBdU2bjEtYcGApBvci%2BGC0Sh8APWSTDVSRVmq3UU4GJBrtLRexOly1vvIdZZia6aZgj49YLfRxUnq7qUBiQCPjcQwQLbmHrvdQtlvc4T8diqjxVA0rp4UkGMIyUlyIyggzozkKzPTc9wu4p4PeQtzbtqGFCbD4tHxR%2BHXMfEpHOI%2Fq9nhEa4KZBDOAqmpGXeAY4SGMR5ZswUivDG5iSJNWRZIq%2B3jCF4I%2FQBjqkAYj4rVi6TkTy0RxWnsgCIUuGu8WOH7BRS%2FMTthbP7JpZvXEm0W6CHxuHnii0VobmRP7%2BLKtvIlgL%2FIYytub%2Br7GfZNc65MGcBNOy47ou8Nl6hreFq%2B1poJ21Zqt9W8yVoy1HP4lEZqzF98wX5FJUE4br7n3ushhNpVRoWC7y2FIdwNVSZVeytVIc4Fe%2Fg9oXAHtpA%2FiBRke%2BvVLtDx2lG2AgZ2YB&X-Amz-Signature=b62304b339624520741f6b6fbae0c62e06ec7aff08b1f7655448b199cab7d6f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z7MY4Z2I%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041114Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQCLm2odFLm7sCHPYyc0i1of2lHoUbkWPlNmZpPgfiDkOAIhAMcJSJivMm3W%2Fa%2FIG49pQZgAg%2FuBdLmvGkcj0BBitGFbKv8DCD0QABoMNjM3NDIzMTgzODA1IgyUW4hx1%2FhkoVOfmhYq3AOYpYI%2BBqRFK66kVC1Wdau8K5QEMl6CJkRyAzOdbUYK10Uk%2FaLgjkOPVDiyZDVbRl6P%2FOOucbw9RmVxBF1QfKoQwYQpeoWs7KvGxcUHAhGfWCuD1jyrZMQN3T8sIes3X1btosrrH8DjGIQa7584x892IsfFW6%2FTBpFEJkyyeVh5F5VHjnOX%2B2z37uZ0eB1pcZEHP7Ox%2F49sFAQly%2FxsFm13dsBeCFS%2FoqwCOgtrE4FwVmjwb5i4bVYYWhb4xIIoUUIJkBQcVUPnW5IO4M%2BWFfLwLLCfZsnNYMhyatSDIrm7Tz42V9Isu7xucUbfcoc2N7aA94F6AcPtV2cOrVPg7pCOZKqlsLh7qKSjXH7KGjCV7hVQKsVAP3Yw7kpLjenW81eFqF8nEl0oKDPUEmEJA9IViKobXqLhQBr5AsJAqqxr7nRLoyKFo04kjUeE6XQVdEt%2FiOFt3GcBGHYtJfN%2B%2B3i8p5xvsIReXDhvvtD25hhG3m6IPFZ2CqmTITZvvJBYqN%2Bw%2FOZ%2BLFX02TFRa2orCc3Up3U81DwOBEYr%2FyShIza7QmxXWcBm6oYChtPTej0wQAK%2BMTzkHs%2FaEphCM6QFYrVIKl3QceuAd9WFuESxIzY2GNR3St6Kb3TUPrAlCTDs6I%2FQBjqkAbZYC5CYlL30sOLAAz17G6%2Fu0mU0jTPATvC3e%2B18dLTHS3864XnY3rCXWZ9P1LXq4%2BEKOfwuM8mgHNue0l7q%2FSZmg6sxoV0yom%2B4xsJ7ivTc09IIN8XxIYMzwDlQwcZchnn3%2FiCQnSxcSN07p0mREuZdVgpkjdPXgWqyXIhVJS%2F37ELi%2BApnyv4O2KB7Piy8wDOSr%2FEjf5U4oiqTbz6sdFkQN83J&X-Amz-Signature=d10b40cf52c08cb8e6c25cbbadd27d5817d940322e57ac2fc7c378ea72d33bd7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46635ORSVVL%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041115Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIBFOjZeQUOP%2BblSeOTDuEyB5fus9gNg0kOZdeC5V4qDcAiAYfEk6nkoCYt98PL3dRDa%2B%2BeKEYTkPrJtEqnWW1RbHTir%2FAwg8EAAaDDYzNzQyMzE4MzgwNSIMANPdvJbNWGzE9IDWKtwDaKcDEux0qWo2HbltMagg3ozL28klUY1q8wd9gk1n5aKtAgEo3s%2BxC9Lf9DRvKjwB8k88myxJSSdN5B9pDT09VE63eKlxawwsSdH9e7ah7bWVMDREhcATggcYrJHfAfezSBWq0Mnj48m4jAWTy%2BuvbrVd8x2MCg94sl1iUIuAGcSxU9ExpcQFKetBjJ%2BPmSj%2B%2FeYY1xjd6Y%2FGVIPj8gtOO355Bz0T%2Fbs7z2N0RLpz9Wm%2B9%2BL1Gw5gJDESAFsI%2BYn0fTeOKq8C25kpUd3SHVZ5CdD1HpwpFNECEXCKqFBmyWS%2B%2F3%2BWFRFr%2FhuL6sq2H2XFwhg%2B40H8rAtHCN3Cyirj9MJQ3f%2B7rTj6CDJgEIe0QQjgTVSbgbhuhbuKtXPCk4x5FfKoNCCU5PgJ2fMYauUoA7Xzj%2BFc8UbsoWY0NUV1KpPzyxubftigjcaN5X0l6y0Tj%2FcxStUO52k2QzHfAz2q%2FVcOVNx9JVu12bTCgqwDzJ8IBIHjYxu0BoKZTT9VnM37OKGfgHGLYbjFzQjdtVg98JuI5x3VptR95NpcxY1nmEazopWDY9JgQHrRzSYO1hwH%2BY6A7MZyQ%2B1LkUt5fZUw8S%2B%2BT3581xJiQTLjtkI9f%2BWLmP1jX%2BeVxxKPy6Qwkd6P0AY6pgGXSI9MrlFGgFaYFq518aHCfqppaWw19MFLZQuqtTSAjEG2UuypkAc6CppJT15bWdhrtt%2Bsyjh3A61o0EnT2tCB0A4YJ5RnGjDAqoJZarnJdc6RDIltRc81DJ0YH%2Bm9Q0X6cG0sRFYF3ziu6v0XlF4bRbdXD2Peqgqy1IoDG0FG%2F4uPLJLKtBPWhMu85%2FoGzM0mQ8mCjTEKfyYnAycocUvNsk5OCStu&X-Amz-Signature=12a224a162e09478d044705e1a98d2a2f4eb5da2e0d52bcb18367d0162982bce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QI6LNYV4%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041118Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQCuv4V1QUM%2BTcytPU0yK25DR%2FN56CAJH%2Fd0A9R9yc0B1wIhAKefJQXdS%2BCiMVEfDFwI53GKUJ6uta11ywuvCqAmNs33Kv8DCD0QABoMNjM3NDIzMTgzODA1IgyFPhyQXmT9XJ5BB5Yq3AOVg7PYdn6LeROxiKfqt%2BnzQSsUvxgRDx%2FviolC9PRoVnjjzWGfyma6KEBnPvQgMOQ5NnDSxL6x5wcor6oqoR6CyfqWTNZy4h5nq2SzRMRZ0Sv7LGgr%2BBbzhsdF1pzL%2FyNMX90e2myxfar0%2F4peHlLC3qS2%2Fwb7i0XzhsMpRLG4g%2BbhVmrJDF8x2NoaWsn4yXnjcwl9dTZaU6kTZpGyi7TQGVLMdBPPfhBTs36KvQUvSMNs4gySVgZCRyCEAs1lHI8HPNXeU0Wj4xuE7Mhxby9KuYk0PkfpJ%2FV2OWnDNzxeED3f%2BYKZHlNxt%2FRvszsOGDkVCnZIgSWbljDyJ8du6ghSwTFbOxQgdDLmCtitDrLW%2FGXzjbbWRE%2FOeBnQ24HjyzriC35EbfPSrWzlRCz0HgFOM0X%2FoqStWWWrud8Vm9PapbajEvHLJGcw3oGSSMbn30edOa1UZ4R5YTPnaRmwJs43UQAfVQs2uBBytSf%2BENISRWCEDVAA2s7c1uauMuaH5JKEcm%2BTAfxugdlgmmgMbMVZzg6OCKpterLb7HYeMXEbkMuSTihMhRUBbDHSkTrx3iaUafKjiGw5P4OEM2EeAl%2BVwQPz9%2BSOMkW7gunUteavje6dVRNeGYUj%2BqUMtDDa34%2FQBjqkAZYqJliA%2BXqobxihOkFVlud7iCIFTna6lNm5gfYGZCr7LuBo7Qh3o6TIaKLcClq%2BguMLpaizkQKwGPHUcCC%2F6TDa%2Bctl6YJFjR%2FPZhkWo7dTlhkImZGiiSnc4R2L%2F%2FukXCDPPfChLanhb5esq1eGfSGLX5%2FyyzP17VdTeQxWFp5UKCLnQkXIGIURsrRfHiwZ9B6hEwPJm3t7ZMSsT2h%2FAIKMET%2B1&X-Amz-Signature=ba7d463d631f4ae34f283876b927659eaec91f38a927198ae5020141573b1397&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662YTGYU23%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJGMEQCIEIHnCiXMC%2B9XmtjKSp9B8JoQM5EtafRhLQvSK7CSFJSAiA%2FI5%2Fxra2XNwVFtXwbBkrirr2hrlyGMnqoU7nqOwxlWir%2FAwg8EAAaDDYzNzQyMzE4MzgwNSIMYo75fYoGe2OUkPh5KtwDj1C8qwh4ZsgFqs%2BWOskxvFmGxIcXxo41hb6iQUEufRbV5Q8oQEl6f2VM9Aoi5dAmkuk9tOS%2B72Kpfm1hQwERbnZg%2BpTRMbRMLNJ%2B4CyikCI2TZMOCZzLH0663MQBUnJnxdonSmDykZCOA8HKJZhanGvPMqzyJgHImS5xJ%2BuEZCw3OCtAuCrRNsUFM2YulYa7PyH4Gxirgi5NXbNwqs5PSagqG1Oayw5BNWez1N9xLn%2FJEwTHjioBxUv2d8j4fTfpRzcQvGzOlkdaQzOgcRi%2BXKI7hWCjMPqpZtwHUfdsxnrfXMuONGZao47a7cA2ljmvmBzYLMgDdR%2FGNwdZTBBaWybvB2TpLlemnizw%2FnySgoj%2F4X1gljC1Fdu0ow6%2Fk%2BXljBs%2FG1eg0Z0l%2F7v1snyZvD%2B5BH4C67C8u2rxNBFmzXuJPJh2QlxP5R2hJxFiHJKiFjrE7lKHMllv%2Fx95UJi77zppuUIjXJ2sbP0TbqpfEb6DDub%2BrCnTizS4Df5wsTFft505QpXpW4%2Fv3YMjS%2BRFbmDdroukvFyCSLi6D53x4M7ZUYFrWq%2FEEhJPmoC7JeX7N%2BiIc2gX9WXBoDJeonPtUmWmEehuy%2FzV6mGHL%2Fj0GkYfzy3MeYrSP152bQQwx92P0AY6pgFbu5QPt1RB15ix6XknDQRIwxvE4M7fCjQziv1ssROQkIQAlMBlTpywWS6D9QKA3n25%2FbsbJhdvlnbYvsMDa0onhHeEO2lcREUl2kF1dPvlnrKVqybwpqyfldCXCSUW0PYlklKZqPDs2bmCLxPITrqTSJSX6dvHrycWgnlcn9M8cpSCDsXlAtqG1s9EH%2F0BfHKEM9wX8B%2FkinuwxAMUf5iPT24sbIWd&X-Amz-Signature=cefbc221343660467326db393416e85f0454e6be34e36d620f48289718b754c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YHGHA2UH%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQCKL353oP5a%2BxB0ooIBtkqO4xbG8DBD4WkMEE3kxh2xpAIhAL1XvnwS8%2BittaaMbfWwJ%2FxEJWZM%2F%2FH0EDS0eokWk%2BZxKv8DCD0QABoMNjM3NDIzMTgzODA1IgzmPzl%2FeqA%2FS0Gyuhcq3AN3ByqHz%2BXTkXeiFKLUk0NRRAHkQI5zhSWmoUKVB%2BNLlddIPUHW9zTQokhxXh%2BV%2BQC5RJLQ0RBQZZgJ3n2cy2JoWzoJPtKiZg9H19sCjq8MIKjn%2B6MKtHNTADqOVw41AOLc%2BUBPQilYoEn9qviBy5eidnFPtkg55Eb5oBne61ubX12WraNy742cW5TbQyKyM8uvzvW90xwjl7YAVewG%2FoS776E4Qn8sdtRalyfREFT9y3nD7ZO60RbnwgAS6Oyg9L4RqfJt72%2FBtAG%2BAMO0255fJPfFqu9ZiO3ynqqBUbiWCIAFzqp6hQ1D3d50Epleo2VIZ37AnhUICVoEN8NBxYuTUb7Byhia%2BEW177pW0ygvGsqOcMAV3g%2BUnDCNmSvuvCsNVHIkV9MPwLwVFbhJc%2BclbtbE78M2i4Gj%2F3afWXqKKh%2FvEs1GISWgYlRsPzcsiTNZE0wZiTxQHosuqT7dkF%2FxMoqhsH2HpuBqrBGLb4dMSNcmmaGfSJytCi8L7WuJIEqPsAO9VfDla6b%2BdjUivyMLCuyFz2PpmMTFY4cptPksmDewNQCJiLDYUTCw72WYI65bncgvtBk1r3kV%2BzFb%2F0vuTHi%2BqoVsjVnnJNJ1NmELcgUK2mZoTMGZ6oNPBjCy3o%2FQBjqkAbbI1x2%2BRadXKB%2FcRSxmgzxWTWtHgXhVa4KeKQDfRZTp%2BCfQkoMJ%2FfRGmsVtv883L3JDrhEKTHKt1Sky8kusFXNnr84KZBqKh0%2FL%2BNoBNQHl4wYF2%2BhJr1HfMX%2BUVRLnvTA8d4SXPvLOlEZUv6OMpnjvtrYvE%2Bd%2BXT33w%2B83VV7WE5jtO04lx5iPpFDKb3ts487%2FYNjt6q058UUlwWX7JJbxRmZL&X-Amz-Signature=7472f865eaeefce9fa8097698f1b6533b0088c8df2fcd9fc5b253277999ff3ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XMZPC6NW%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041121Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIA9nMu89JmTGo3bkf0NPhYDyGmBEOUOk%2FwwT6ALN7KjCAiEA8R5bZo4YkLKMUygB0ldEt6TM0%2BGR4TffS%2FPtKdYL4qEq%2FwMIPRAAGgw2Mzc0MjMxODM4MDUiDNYJpJ7YXSPy77kENyrcA1PccWi13lxRweIOS4iUtlbmFM7BzkuvKI4aRQtbGlBjKO6g0QOcBBAjnmPqmmzfriGBjvEHpHyCXcydGAu9ji3ZhxUdlZqbqyar0PEdk37hb1dVQFuy9QQhdhritk1c%2FnYkzmhGUznh77lCusJtV%2BIgcpk5xtZIkL52SErvIXAcusKbMC51gQu%2FqPS2PzXy14mi7cFftlOTNZNdjf2ZxbE9HbHvBLJJdLwpcjJhcEs%2FwW6sHfbY%2Fz5CGdQACP%2BwH%2BOG3hxOKeRH%2B6Sotb8LPEOJ4coVHDjaA4blLZZOAm5eM5Zq8UKyDm1wD69J9PA2%2B6rEf%2FKNBgc0MThDU3rLZTOJwJa%2F0ZU6Vd7s8eKGuNKdDS8fqtQDZddNMD9LDNMbSy62RqSdVajs1pZQoN3FMYtlQPinK32V121WhQpd0WVWmaIMvMkj3n0CpWk%2BlZoIfCAjF%2FUX54MmtQowliq2I9O3pr7IlnnstuUor%2FjqQEt03DvczZcTa5GUQOAqgiEi3Yhb%2FqImeWGMqNEn9S7kj2%2FF7%2BO41dLkVRYgNIhQqjFZ8ztgSjDKi6xtZqlfZE3aVftZ5H4Rx%2Fa2qjalbrK51f6KPwfOdHAzJsAFawlNM4Lm5YLZQFXqE2x6gGD8MK7fj9AGOqUBCZgXsMN8oSkPrzSbg4bgYDE4eXOeXMCYNZZl9w9gkmanJCEwIkV9lHwIS%2Fp0TV7vbwK%2F1NiDCygTZIkOlqLz8NfX4l7Wo8XqMjqBHB94g55VUgN6iyj7%2FGV3FJcWK1HxNVAf3ZNRotIBXrO1tWPvhBlai%2FfWrVsMc1LWWvlaVjlOtpQ683q7a4UuwxJXx2BbWMrUfrLkW3MQIw%2FuETxyTl6z5yhY&X-Amz-Signature=a5928798e7024621053333033a4859fd6db4cfcb4d77027459a64d48635ff784&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667WDL3CTA%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041121Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJHMEUCIFEwtADj4HPEUs%2FwxMKSBSmKXrm51ecziI15orVzdWLMAiEAmBDYn1voZkWv0ieqVx2jNjudeDDRMKpzd8WSpuHnDdoq%2FwMIPBAAGgw2Mzc0MjMxODM4MDUiDC5lNP6%2BTAHlbh04AyrcA4Y4tayMiQFnjC8OJ6%2BmjWEAi%2Bgvm3I94ygYz%2F%2F7h9kblbovzPIyeX6SpjFTUAfqW4PZYksKJwvFqPDg3JP5pWpLBvWBV535sOMVTVKoH19tJSCwtFF52MEv1Wraoj3aO06nrtTB7snYJ6QM%2FI5lhxy3iqxKaT6M23lb6YFoBE%2FL9vNa5QV0YfmWoU3Wpzl1Z1%2FN2ptW76Cnvt85vdI4%2FPIeQ%2BMXiBnPgDgqYl7iR1mvqnUTRgPQw1XIe0kRFZdUIwyg2Oo9qZlsvdb2eaOkk6VKmjyAtqWUghcfBbl13hKyr6vSp6QLCV%2FGpCirGgF981kM4shiaKT3oMhxEreypa6Ojm3Q38J%2BN29%2FZevyWIt7wVmq9aJVKFYDIUbZI%2FjEWT4owPJeVCYjDIq%2BXQDJntixO30qYmuvbANGY9cyLkUOIEFSbi5X1RsfEzkqqpfY14e0lEzdKPt3yqKfsfKza6XOq1QZ60YTpRPIF4egcnSGQ%2BGCX8o4%2FFz36W8aGpIvS%2Bl9Wi0NzonfD%2F6vfRHqO46uVte%2FvA19KJ%2FZTWOraiKR%2Fvi9LWVPCAgcGv%2FKrnr2GScO747%2FuAKjn3R7HEepEJ%2FEzx%2BHQ22GhetgyZ8efK0jZmcgON3YsglgZHD%2FMMjdj9AGOqUBJ6fObMASKNu6764ee83N4ic6JBN7d9Sf1vG%2FTJBrZUo7ZiBmFCc22OGL93zaQf8wGWTcbvdJnanA7MvwVUU%2BD3Mk2osGsw5w2V1rAgiKM%2FU%2Bh2xKYRQ1HGj6gzQNe6c41fAWdhWGPv4GW1I15eMuBS7Q%2FBrE6pt4NaqvjUUPqNR%2BbuXJWT54jFUB68P5U20xUWYM5AivbAWj50laJU2TN96pprty&X-Amz-Signature=c0ad4d71c4c5b7ad78d057b9724f5c67741a4dfbd8000a5bcd757ce545f57490&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663KAO22IK%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041121Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQCcbDMz7IGilBc7MgC3Kyfyp0S0OMjx9HrqsH6meX90%2FQIhAO4phgTm4vOUJut1vexikpFpQvzYR2WBSsynYs7wozj2Kv8DCDwQABoMNjM3NDIzMTgzODA1IgwPjoepikP3%2B8DUfS4q3AOTGjJYOBFyw6Lk8gA5qz58MuUjSBU2q27cOszTpcUHyslCadLCFd5b1NfpN9UUmBxz%2FZXK5B4lNReGi3izJnJbjIADgqZl6EFs0BhKI3%2FgNe5GcjRM2mqmirYu5taoj3nJG0sLhsOSRKIksfCFF2JePX3vqaADuzQDi71YriRbNQG6OF8a8sCc%2FsfRGHcrGK48Ta0lMT22O1Vn2%2FQirnuTl%2FZ0RNWtvA3Ho7jybLZOFnCLXy4yzRQD8jgGiYWDKsvXUsO4sJ8dKh6qGBsC%2FXHNST8uDqtIw7IDhg0%2Bh2BkFP3SD8cQDTF9qerjUKR6q58S2mRP1%2BxFa8lcejdSH3OOqRzKZIIVtH9p6GrQUeJM%2FM3kioZ3JPlwoJE1WzPrW1mW%2FbHmFDl5BTwCWB1xwbBv51UB8YPMkpGiQajhxpyi3ao%2FMxn%2B4m6Xzc0zqLJMfGSzk%2BE4wG%2FcNybAPVVdjCtpc%2FmvSBZB4yI7rDDSGOwWWzGicE6WH2Qvm%2BY2OtczptZ8zR0WExCYIXq8cszzlM2gQ%2B5sZVrpn043LvvxoIB9bLA54jdMgYKNwZt2nqPw68hTdgObTCEQuJSL3u8zTcm%2B8jwBe5KFyuEzHqiR5O8sUY369%2BY2VIA8S5bykjCW4I%2FQBjqkAWsl6XBubUgoAdW%2F87LZGTevaYllTlSL82BPegVE%2Bx5e%2Bee52qhEfzJOD72yMLHK%2Bjl%2BxXTr%2FEWA7CIrPGI%2Fq%2FM%2FH53KC9XpwG%2BRSiEAU9mesHTn8RDduC6f4f0rXzhaSW3cYaSEeAanVNIIzCHxhM2UfwBpG9BSwsjxfciWKgSfThdrsp5HhOymSuVQZT8fdz%2BgKJe4KW%2BYQKnPAlWL%2FH%2BJKFX2&X-Amz-Signature=ec0041b37120948741f40f606f3dc33ea7b9fe5578e399b7a350dc320d7a06b4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667SSGZJGU%2F20260513%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260513T041122Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHQaCXVzLXdlc3QtMiJIMEYCIQDl7wijqFxhSIfyxWZoMeE4u4yOl3PpcwohQYDJvIb4vQIhAMCZgxSlS9IxMV%2BGE5X%2FBoMXGPlCblgYMEUXVhhsi%2F2ZKv8DCD0QABoMNjM3NDIzMTgzODA1IgxBC4lakBQkNMXbQJsq3AMxA66TdE4jg9ZotBiEVxE%2FdvjztXp30fm0TfLIR3Y4nPspP2boOdUSUJqUqo%2Fi5T%2FC83brfyK%2Fu37y6AV1aTnWd82jIMuN1NqolPWrOoyFUGvUcU76IlgAkYkwXv3oH%2F7YhVXuzRbDnLCXzusXbk6tP12NMBrzg6G9QvP8CZoGzFMz4IkZsdacudQTqweyz8gHPwTNB94jDfvjY19WKKaw4mkRQbGfGNz1FNVugcyTdhjqMqJwUjl0o%2F4QsKL%2B3XtbzLHuqDc6E%2Ft%2BfXeOxZfeZ3y6r%2F5fFOSkLerXycyMOk6dY776qy1Y%2B%2BZ%2BuESJ94O971s6CelhjUl%2Fxx%2FxZl%2BHesrPKVC3ubnUouoa3TIhmXRVH7MJL9Y5xb9Gg9UZdmIzJu8I%2FUDE9Vahu3eFoOnxgYSOYsck%2FAM7LKk4MS%2BAJ0LTQ16MabCMUDBpCXrKXTnWvQQhkdS4zAC0ebLuRlE%2Bh%2F0OYkXd5Elu7BxxAkY93kTfz5iafVCdhos8B96pHecf51xaxRmlIVUS8NV3bq3Rtb%2FLeGGpj3GYeM%2Fotj1CmxXxJF4v%2Ffli2xRRnDKI74mm5vRVOR1vG5qGfVho5xELjPwqqKYvLaFi%2FizOun0NBYbcYe%2FSRSjNjKE%2FvDC36o%2FQBjqkAd2KIc88Wh2hXG%2BxuV8ov0gMECkq%2FrelTCmScuGTxm2JkxE5YgoHXIJFl7LasjFmJpSRRRtS1FaFOZVqwio5VmS8H2yDieWAXUPJBNMOPkYEFzF0%2BkfLW22GBIwPohs4FMUaNKxDK9OFCw5HPM%2BLSurtZVY6qxjjE7ltPnlFoU49wXuhKKkOVMiHJVBczkGdjHZnhQzIAwUEC2iLT%2FACC3bOESS3&X-Amz-Signature=361f7ba2afccc5057191096f496511844c147f8b6b39837e5091fdfb9e88a38e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

