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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666Y7PKCXQ%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041112Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDbGKI6%2Fm0RCsAXfa2IcfqnE7ah4N2rwhVFmkbwlHMJ%2BQIgcWH5UmFzRTQOq9zxQ4z9sndQypD0g1h1EeRSWrZ5tGEq%2FwMIUBAAGgw2Mzc0MjMxODM4MDUiDFNECqEcHZD%2BShF%2FtyrcA9sq9KWXp%2FM%2FD6Eaz5L0vfHm1GOIQB3ndyLb%2F7vwf9Grox0oVAXy97MB7UPt7arPxBal1xtGxDFMd4JhB9esAw4wBaxs7XPhiKuTiTI%2Fm8hBqVnunw0IuYKED9Izjh5ipMQnCUAFFEcTF0KrAit3UyXvmSGTts2qiem%2Ba%2BAKiCK9eBBoNslgvCJDSQDg40gtTulGfci4PkXRm%2FqFjrj1ac7ga%2BKXSyUmUwDfmnL3VuZRZiCme62NTyzpIvuVuo6UO%2BFP2g8dIAhEGA%2FGqc0OTNWNQedBxTmOtcBqUijTknqpf1c5eVFawFK3iNvs4GwNwtLv1uXt7Tm%2BwfnpuR9Frr7dEU8uqPp4DPDSH%2B2NSmzHhOjdJDk%2BChv2dtKHlFTCrkEe3CaNOYu9kh348HTid%2B6ftTuRtIjlGfl%2BiuPeeQtCbpkCapS9xYqYpfAMGQgkLjN%2Bbq%2FjfwT5WyKXty4Q%2BkZVzaA4wi1zbqzqIKuSuaLym1uwcYTrGbiu7XnxVr4DrOYpfR9Lq5u1jXRKgq3kIeStJtTMmAHkKtzZPHuApCdXGTW3NMLrG9lDslwTdbKeRWm7uEQwy3oJOdgfKJqrbnZ%2BMXQsUn2Gl7QM%2BbaSlHFS3S54Z3SHKxQ29%2FyoMLj1k9AGOqUBn%2BWzmQXZUt4QO7kY6yxpQNTwkytiM%2FueZelEWIvqlDfuIu1bh9%2FocFpiGFHTp6Hs7iFC3tZiE2Vxp130yPocJHy0JdXzitnXCSg1cs52YAkiHxuuDhduqjo5oFmBz5t8aGnrh3%2FSvBxYE%2F7isu1BRcsir%2BinkM1re3F3JNj55DsKFLFt6ZpZp8xuLRtiNb7orwqzCi6OwqRlkXSwsTl6Ff6%2Fk9al&X-Amz-Signature=78be90a4d176c38e3920451f34f87828b639a043432844c81ea4391867d0bf9f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667Q7ZM26M%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041116Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD4L0JwLnmVwd%2BR4dib%2BghoadKMs9dhAgz1DhWajHmeowIgNtmuxyGL7hmev5HW42Nk7P0E0bdI5DAeQg98auzbKzAq%2FwMIVRAAGgw2Mzc0MjMxODM4MDUiDAmkTXvvw1b%2FAFq%2B%2BircA526oSvNQtztT9JIy%2FMM1w4dRiWtaIpyVvT%2FWak5JXVQ0uTCK0%2BTQ%2BpfjNlUJFZguay1eQ2UegRLigs62oMWZTv5k%2BgOuX8qJ4zvloC1qN0YydAe92Ng7YAIDw9CDF6Gn5H54eDJmh1bCa4n3cuHLQUG%2FN4sa2oBSBlTwWYdPyu3yoPs6EhWO9McHeE62F%2Bcbz7Y55zpDH%2FE4ENv%2BlMSTar2Acet9Hdh7Dz8v9qWJ0kScY%2FFtYCGNFoVma%2FJWL4oTuztibc0BfB%2FBHK5zlG5HSmo5HiCqqQKPqZVx8v5v2jr%2B0gTzOnptHjG%2B%2B5QhaNSVhvr0InutOJmKCVBEEqa2creVlNT7nBscEEOvLqWbRwfbYcxYSDRsWAv586xFJKC7NzE8g51a2QG5mAA6BgR0mz%2BQDQz7Oz2Z0T3iHmIhi7YrR8oQ0iVKbe0sXV%2Fz6pPm1zQtgs4ZwZxffYhnR84RO71gghKyyHdg5hzIuZ%2FMuT79JRkSQke2o6pflVkOoYJTAjFbymU%2BPuohkDz3SmityDYn4Zs4VV%2B9LPQkVz2sAGx%2F8OfxgYrW2t57wpmJ%2BBfIi5g35WKTTSNcgLm7lIizenNUkmooePnQe6%2BRr8nqMra4Y4la%2FRrksfTzZ5hMPOGldAGOqUBGnRhuZtTX%2BgbNHu03RYzVK3i%2BFIINTvOG2loLhcjmo8PoH9mGRDuZGetBVwsXO5JnPMr9AUyfFnHX6SnihSoaQFVQmPILft8T3Wsk%2BgroZtXUVt34JHxjk%2FZZIbNDP3w3PGIZ6Usd49WzsazebBsZnixy6L8yf4mGcLmWAZ%2Fxc%2BqshvA%2B6qff8xT1cxXQ0dF%2FOwlbDMi29NIERvFhdFSO4WZR5UI&X-Amz-Signature=270b1f230293ba9d99735cb58f5f8c94193a63cfc4a785686be0e4a58b9bc943&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663QDNFU64%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041124Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC8zrs2%2FiMwqOhYcCf1hK2EaRmIMUCW%2FHLdZnHbpbKshwIhAOVuvAhZHEj%2FF5aZW0v%2FNxEwLoHkbPC4%2FmfKOhnbZqeLKv8DCFQQABoMNjM3NDIzMTgzODA1IgxTtP60XZuHlZPr72Eq3APnP8KHD8ZWbc7w9mVYTi80c1DcQMBkeqrpmS%2BUXMmEKxEfi5te%2Ffk7qRzuyG9LnhtF8YjI2DWiXrQ2b%2F1PU%2Brog7jekQRGesvLtAnoBxmNg%2FJErwnughzxf0YLHnHCt0VCl%2BRtY4aXVrdARGc4ryDVwNg6dPgNLCkk%2FwDC6vO32NhJplTZuin88GIWqRdascxmnL1rkMDyyLsnn37pJK7JHRRsqE%2B%2BiZtvPLnp1ccg%2BGg%2B6fW4awfHl4R%2B3EAWGYPDDay6pVntMtj62PnDcIjM0lsHqLE4gZSw1S9WLp%2FUrzwIT3I6kzcp0RaxRsFy3s3M%2F1vOHIV%2FGqkkefQJwR%2FyTpEvP3sAS7Jp5S%2Ba3UmcO7sKvMZlNxeUkF8NyU2WdX2UE2JSC12YbU3ELmBOF3INLGo2zAkn9PADn6oobfLkNc4bt9Bz95I8IBNo0ZcqNQGq3rzW7nYXdwSk5gAT8Iv1nLzJ5Tc5mECRSnJlULz4fwqL%2FzlFvEM%2FFHJIXPPM%2BMlrBZBcYYKPvFwueTwlvT6qqvRqRQwkeN49NPK5Ds8a4PRChVxwrFKJTDckDT5Cz0ZYADrV8LqUqsJAk3KZy9pTiHc27Njg0cqkKuXOUUqkDuzDUaoU6jDuyxC6LjDA%2FpTQBjqkAZGEjfapq%2FW7lVwF6eaE9BZ4S5GUB29wzAiIBh8FQMnx%2FttG5FcVujXu1mcJZA3YJfv0Dx5cIWzAQ0FUSwpeksPzWxfxU2ySxR2a4TGM54pJmJsX3%2FWUnsv8bu9X%2BK5R6km0X7Z9WtlZtL0fS236v4Uk4xrPJ7uLOZdViiLmHLeSkuTb4eqn4UjgZ0b4CGGEYyJLnAGC%2FkCZ6q1hcjWwprEF3Rm%2B&X-Amz-Signature=ac0604627e320d916a8f8c41aaeaa459ac59e920cb04deeb7e48d3e023964939&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKIHOZXF%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041125Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHKs5%2BfGG7PkpSsWpn%2By%2BDRNBeGaleXSF2nNnK2M1XvaAiEA2cYOqnMp%2BEodyGIUERzLFOo7N8GBP0%2FigEnzEVTgzAQq%2FwMIUxAAGgw2Mzc0MjMxODM4MDUiDDsAktzQHTw5gxAOcSrcAy%2B8CLwKlDPW0p1GYymZMf9i%2FzVRBgrERDOcCVrMHvP3FK6%2BdHTuxRn6NwpIc1vk%2BQQBt%2Bz6eOE%2BNgYoXaulCfT8MDgkw9YVO1K6pDly6hulffyZQSmfGgxB7rjgHZjRsG6Owqyp1Imk2sVupsd%2FAVnqp6kCdMPHck8%2BAtDWRaQOEI9X7qKcdS%2BEy6O8FLj19WJtTbyGdI9mMx1F4a2rahJ8jWk409to6es%2Fik4nWlKBYA3X%2Flr7s4979PnptVCRFIjq9IS61%2Byw0DO0zIQgjg6Y4rQwadpSv6r%2FQD6kWiXiiNC0Yu0K0%2BYzPH%2FmPgAsbplz8Kzu5PSe6Rukhu%2F0%2FjKOsaXN0lHtTYMQaMuevQnMsP7BMx32W4xMEhz8z9v1kiTnK5rX%2FIs30HEf0uXr%2B3krAY%2B4UyR1ab1mRT%2BttbMZ1N%2B9wdA8S45V%2BRMMMxjyvykHglWhgz9dRG7rfD0OtPj8Atl5bBj%2FZs0UWEBOt6omKzLBN1aAsuvo9fNsOtusRizuhyqImR87oRleVuWZEY%2FUCYQeXMYnhy2hqfAWzZmqxV9QuQNNcmYIlBxO2sZfPD3pIkNPuGY3gY33yEwgvn%2BL3624JOkefmRbdMzXXWn00mbwi3FiS%2BRKZ70dMNzKlNAGOqUBrnWhpE0hGy7M%2BUUvevB5Swv%2F6H3UmIQSECjiIZtoniDOxB03P4RAam2nNF98VImXrq9elMO7Z6KNZtlaiTPK1zxWkyw7VzgpzW9BOuYEmllmqZxP0xb8mf6EskpfYFmMLPRaH1%2FQ%2FFF2vhUYywJ521gsJDQx1cch4I1EE3ZT%2FpmR8j9qfaSMeWO1WJqeUMZtYcKWtDpEss1Mt2tQXr3QBR97K5zk&X-Amz-Signature=f871f3339690241379c1ab3fb6615a9a0ac754d55e9c53bcefd6b1e03a822dac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TEXDYDL6%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041127Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAjXykyLzrpaL%2BNyWssjkK19Xw43studpzysNhLxfzzjAiEAhlJLjNCfMAfKCl8L7fEyNom77diOM2%2FNNdLjMazg554q%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDLBjJ1k818NtK3EaOyrcAzq4XW20dgaR8YbW%2BPHfnydVSQQiEY%2BjfQf2jgOj19QLV%2FODNRKzK4GHm5jEx7J5f1RdyfQHbWBRXQNa4fzft0vR%2F1R4J2kv%2FPs2bSXvuRCBkMeOlDuccueJ6VanQScm%2F4gXI4byxbYPvtXrQAkCZygZnlN44wQB0GmlQrM5U6DW4SkaU4sMLz7wMyjKezDNo9VYDIUaHp1F%2BotrxTBBUFqFyh9UEq92pmO0PV15X80uPjJz44WoI8pakM1%2FE%2FV6VDZrFQ9x1QUwSNXQ4KDOGFztYFbhXqKx3A33%2BHhF%2FPcdZVxguIWIHuEuqlcg1UMVh7bgvEtyddMYS%2FxU%2Fjey6vXPLaiA0dGrjNsl%2Bqn6LVBuouDXBdJ5rh%2FIZIB2egdEcHanfHTmH6QUCwYyKPoPbqJilf2ZqtLdpGvEuljm7YYazAQws8DXPr6lVodpbkpPURxkGe6a1Ue8GiE8sYDC5Mv5kyoyd1u5wAQp77ZnChVbjQiqOQ2zH2pZtVE8UfQdNMThOnKt7KEn1EbK%2FefaYuvmwPRadTpDwHIS4HiEZcbq3bY4IoJPP%2BKymJ8vwiFurAfAGL1gNE%2BbAxzf1em%2Bs75dDTjgkuWoWW5lr5FdhtbEZpGIesAMa5R11IPLMJv2lNAGOqUBTczFJdnA33NWLV161H1FmE1nJXqeLlFHTzH81B4Z5fU5d3EP3WkHY7o9%2FIBlke%2F%2BKNq%2FNd6ch1U%2BoXnofmVuxEzRFugpBGL7VE9bE4URY8joqPZZNcBrQbdEWEANmEOjJ9TL5bzwdNnBRyUt6tWAwkbF17qL3oVhZTlhm6mMDiCDwNzjCRYIemE8kT%2B8eOplpFx496aiNlGojacOBUv0ZQ6O6i8i&X-Amz-Signature=9ae8d402d38b768331d5d75f0ca0d451b7dba2ffe58db7516aab2160157923c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YGGBLLE2%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041129Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGP5eftCj9ilNG1caKn2KzGnWIYTsDaGODFabWRidCWdAiAyhA9mz7pjpPc4bno24OZP2rkM9qbROD3dOVxVUe0knyr%2FAwhQEAAaDDYzNzQyMzE4MzgwNSIMePvcfsYtV9%2F4pUKnKtwDI9Jhx%2BfDlH%2BxcyWS7A0hZHqJGE%2Bg1A8oSZJSM0qQVZYfXDdpicR1g11kxrLed7c89EMwWJ6c%2FbrRVdDrUDxifc2aMkCujyGnis1vduxuyU%2F4US2NZYB6%2BAn68cTRZU0c5Gu2RQRjiPHzgwDVd6MIu0zwXcgYkRhYB1413cJVFsQmzhdB%2F4TM1fz2wwee1VOKbLCSBL1BNv3yAOWOd8spIKHnhykdKs3CqQ7MMiMOBd0momyJbRKs1eIllMSBM4UVt4NbTC5Q28PaArl7KnBD4t2cckZA9fHTnFBumiAwAb7%2BCGWL82WvAPgyDnlDuKamMXqwdAnG3dV34FWLvgvVIH2wuoYswX5aiidCNlrkqjt2ek9gNjEZ%2FeSsU169r1WmZqKwsdU7WxDNmPrFXCgyOadHvCzsS5wwURqxoh1MW96rlVtc4NVmFmqUpUznJF9T3rlnQTaMMRlFKyfwEjkdsV2%2F21v2OY2fQngwgluuucKvOCi1WY0zZWL1ugAhrJysUKNRcA76bzbjWCRN3lsg9jxXkNnkIUlVTlBOgyXk9ya6%2F8bHOQxuJad3%2BR0HeOcytyaJdmB9xMVbO7jQFam4ob25NfxXXXXkmgHjgwmvKIH23iml6SDu1Eq03tIw%2F42U0AY6pgEXG8axc%2BckbXwFpOV%2FgOmpeu%2BKCXyolJM4ct3F3EwrJ2LCIdIovK6uKzriHmEQgLJF4cFswW1a5OI42dk%2Bei8A%2FYxuM2ohOq7fm2ww63Kk7anEGAd%2BjTTY698IUx7T0mcoY79%2Fhr5WwcpBFMyoH%2FcQfmHCvPXME8LRbPYf52rAC4lIz4o2WnO3a3O4tEPusuqiwBEZ9WgSHXW73UU8s5xDLG7DuLu5&X-Amz-Signature=45ad7a1864ad2a7073048659096badd82d85b5487424f0e30149fa52d3369560&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665CTB6QUK%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041129Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDRIlUw2injkWUPZArZAE1sFTpPHFByeLO60%2F%2FreT78qgIgTDBUu8seWvMQWiht2ArfPzJv4UT5MiuWPJXUx2EnDHQq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDOq3eQD%2B7oQCwXJURyrcAyPZpyC215X1%2BscoxuQHP6HXt8H5B7vajhFDU4Na29XYyugaIrJeRJIKQJRl4iNJF8fa3gQgXktEdomtjIN23ZWYjg5WF0YX%2FLeeW5BAjGV1KLmHEXWuGisKHPXMbM3fqMod1shid98FClu19z%2Fs2V77ahpcpQ6%2F5XkjeOziDNkrUWZZ0EyA4EQPtCcctZHREWFjXADTQjR%2B2wDhFTPjmGlZGVcE9vFlKCxcpDl1qnBBIfAUM0uCiwGLv85fzTv7WarmVYVk6CBf%2F1ExX4gucZH6%2FYaBYVPbArqrDb7vULgYGmeqwSwjui0VJHgTrcTPAVYGxCl52VuwgmK4JKUQmikG07lhfuHYP0t2xmph9RC5Zxm4SPwftey%2BaKALRMRYX7q12R9SeWnB84qRKN%2BvCuyXJw4bwsSJSStMc2Za%2FYP3Oevze7OuVXWoX4TcVFhUAmSir3M1oDcOTvNhsmXo2cIMGeO5W%2F9ea%2F%2BM4WyGsm6FflpPMAXCJ91fkY0y%2F0FApP2ZD4lMKPNmP9fA4idlF3zLakIuo9AE4w1VHgr8vJ0T6dgKR5nqQAPhpc0W8jGd5SV%2FjVBG5tfEcKPbMRaMnH5gECMMwHczA81R0mLfpHHoe02QysfPbskCZQC7MOb5lNAGOqUB6OyB4CG%2FVAzN9pLk4Ljql1jujAgF0QBzXRWjhXsy0DmLXa%2BOfzPSmL8KWDNjv07WatVBccWp4Hp7vB5xLRA%2Bn9pNyDMjggstOZJ5HxiTvcy9Brw1U0ZR2qzklibIO15yduchbYbqSg4Pfa60L3P7YHDI%2BJDmNPWYaABW%2BHGWDfWdJKTnOZOvZ5h1OOz%2FoYxIAaFY2o9Gs2u05mXycLACb02XvkD2&X-Amz-Signature=838f630782bb1b313d70df1aca87dd28d2469d31d366e0218db9c4bb448aaf8f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666LPL6YWR%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCaV8isxvdnt0c%2FGRHK26N5fUy4vVXPWKtHAXyMGP0%2FjgIgGWFVSMHfmA8yFs8GL47%2BdCDI%2BuWTVdLUUmV%2FYUPBUTYq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDEmUz5p0KgRBrZqraircA%2B1kaYwrtFacBujWkxZ7y17VZcYGFkh5X7tJp2yDwniDhgSv2HBkgeAMj5au4LBQ%2FM%2BmZyuXYws5xjkZA1Tk6PJN3H4aUiwwawWIAyCux6Fo7HF7D0qTL7F1wKRcwk8D%2FUzxnu0bhMLlJxOwQplhw9osmFzTZHZfWe%2FpC2kKHtU6qOsfxmrUDaFvnpUB5ZgBCMsI8AvsFjaEpivajufGWk7tiCD1CG8OG%2FCZytlvenGYTJB0s8dh0mMoT3EzumKxi%2Fq7ey8jSI7dVu%2BglVXuHEjHEQcU9hwZA3rNaYfzHltjJo1i49QbdiEVlxFPH%2FRtYoEAr%2BEQ4jyjj%2BOCMZvH61RHbZD5OuoMcxmCkNw1OPqkXhFZXPRQROSgLH1jXQYI9Phsu2PSMaYZXbgf0VNvG7sckHaJCBm2Gnw%2BIh91Mi%2B50b8T1vg%2FJh%2FMaVit7fXJj0YiiU9t3hMB7FK82rTS4btls2rS9wVhO%2BmAlp9T4Q7u4q%2F48ZVrR9z1ti41Pe4cwnaL%2FX2Vz52VcQR6qa4Js3dYUESNSTMTIXFktBAn%2BzQZ0kZx%2BE%2BgesTCLgkzjJhomJ5n3%2FGScqUuLIi7VT6VYKlrnh4bs338hArkMXtMasFQP%2FymC%2BARNJF%2B7rrWMNv8lNAGOqUBwBAeF97Mb%2BngN%2FEkdwWEH%2F%2B%2BQygf4gOC7pqXgT%2B5xLeGVAS5NwxbZyTiW6s%2F1q2tVhQdtfGw02c2Xc6kXwS37Asik%2FUJKKJmL6%2BvDVEbWINJy02sx1FL4DzTHCzUKBlHljIzj01OE9hnWwmmqy6U2g%2F5KJdD%2FVyukytc%2FRb74VHP0OtqgLGctLI%2B4f4EXSNa%2BKY8WsqQ3soB9TNpxe14i1fTm%2FVU&X-Amz-Signature=3ee2aa0d2f873c8c652d3a1f3da083ff8092104fbb6db18ff7e9ece5a4c3924c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TFV7PEQA%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHtBa8ZYCNHbvvRxJXijy%2FME0cpu1XSAZD3ou%2FFKuqbDAiA5nz5c6ayH9tBIl%2BLSi%2FHN%2FLWB8g0DH1MpIfpDCZRH5Cr%2FAwhREAAaDDYzNzQyMzE4MzgwNSIMFkdqoUMMV785cS5CKtwD8JWSj%2FSCCdssL4aLsdi6le1hCmIQJ1lhRwPrA%2BU3yamfQqJKytm%2Bulk%2FBkkMjVBdLI1V7TJ2MDBAG2wwtxeoAFlMtlRc1NNI4fRn%2Bvc7tFHBi%2BzpdRvNYtwoK52D%2FAZIOl%2Be7ji3XDPxeQQDngNDsw5u2N4%2F6Ut8UjHevdzKjeRI39B3dbkZ7Dneg%2BAedUDHTjNdowObgRlYy87XGVCjGGWaJFbfE%2Bv2etZd7fW2NT6T91nCRmAkBHgJAzQyS2bFFi9FzLkL9NXk6ghDC04i5lS0Ke2hRMsyVxQKy%2BDdWWbzkC7I0TnjDeAjZjb2YmipGX0Ljl%2BNZsN%2BuWRK7vWVv7RRrbT0t%2FoXK%2FuiGTkQKVhSnx25WC7mu9i1CQTy%2FdpF20Kla4BiQQeMOVLTdjc8VFv0ueAfbHRO%2BP4EOZBMhbp0Mqp15ywKVvpiuNDIMVWDMvq8TLrL9jBJk%2FnwDgnaQm33sLcd2vyVYsvNbO7iJLHj%2B%2BAcXIaQTLA8uOru8VeHCml49GfPJODpmQG%2FR5LygZ2Q94LnqqlayTMr95MFM%2FfmF1scpd5%2FcIUveYodXMXh9LQg%2B91JCEDFqJHAlbToHi9iiBzBnyG%2BbfXDd8A7um9glmxYgOggFpElsacwrpCU0AY6pgEq9Xa%2BAYkd36%2FyFOd0OXkBXzpX%2BYsNlQywK9g60UIQBY4ygKu1QAxS81GwVMyUdhq9La%2F4duIScaacJBqIP6muZrlqltIMjvJw8V0%2FPPxQ0Qasnw4bcnBDEsmRalhvxG25j4FQZ57hRCpdcVHswkgaxAYWSTQzRjQkp4VJ6xCndu4UNj5aYhnmvtMdcHQfotkSLZlzRFGWHXJONvjJWU0KKIKVmmRr&X-Amz-Signature=3438f399ad23b26c76d9d111d49121e4dd80c7778c7f9604cbfffe1d16535c84&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPLZHGCQ%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041132Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG2Zs%2BspiiGPpeE9d7dHb%2FXSNlcfc0VENyNQQ5gdHq0mAiEA82cKMfcAtBKQ1%2FbiMq3eqUywYal9%2BuMedAWVV1dYLZMq%2FwMIVBAAGgw2Mzc0MjMxODM4MDUiDPvvcLovRt9eOeT2jSrcA9A2mOrCsKaNnjk7ZcqsEKUofPqtKTNtZT1xQ4Ggz4j17eN5X7JL8a9SanjXUztC1G9tbtNd%2FdbOt0eStrQgGvw08R9RXixfv3AVI3oa6DQvYuR7C0RfjntuqgNdz7PzDN7bL27sfwwY8vwByNub8btTUExN39DPWDT1Tw%2FqGuvhkX3td1sNqZuaw8kVUlGRCNR%2FCL30ZAEDfbN%2FYQ7ZmEElq8VMC7OdT4%2FyeE4X5W1h1HYDNRydQ%2FREG7nl%2B%2FN7B%2BmZB4BB109277qM28w7A8Z%2BkNxXD7BpEcMc3VkhH1oX1Tj4R0BxTG%2BWtYp9K6YrHcjaevxPhX6c4iNkhBaWGaxcGGTVPtRWTbWrMfAM8tfi3Wb%2BNVhFQjwC7zLfB%2BFC1IY22ufIINgDAHhmmGPfFwbHNf2czUbIJfyd7vMGT43qQZfntdELyQ2Sgds9xKiIPgJUAOG%2BVa%2Fvbmi3DAy5s8K7pHF5%2Bvae7VEuD4FyNdgQn%2B76p2pAs1kI8Evojzm1JpGglukHkxXrwCteZky%2FutAI6sL%2FwsS4GlTW0JGlSURI3%2FtDat6vXVxj86r4lNXgPI04I%2FsRIRblHZ%2Bvk2%2F2rXNHuwPcpMUScB7%2FpEXlVq4noaRnNbaE9Z2wsOQqMOD%2BlNAGOqUB3B9UDbJX3ca9tn7hRN%2FQbBm7sy8DuGxcHmBErLMb98d1qogDU1OHerHiemzE9%2BN5yBiGcIrFmdvXjId6vDUGQiSGQ%2Fl%2BMjHjRU6wd4mYavyJR53GQ9m54ohu1Dl%2FyFRpYp6GKrrg%2F8g4IqRln8cnEslhLC9zUC3mVFXmoseX%2FSy6Vr8lgs8f7H8hR%2BFsjn7tB0FA3WVzW6FPStagjnLJOiczcX2q&X-Amz-Signature=17b2192dfec98b916a03464d0d7c247d03fab274a897091bf7e867c72eacff83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WN3G3ICB%2F20260514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260514T041133Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDFAjC3xd4V0r0rjDchAOhaU2HCeTxmmsKi23o%2BqlB3vgIhAPP%2BZyQEOfqLkW%2F5pWNLmReeycB5FlgPZc%2BxjQJzDVgMKv8DCFQQABoMNjM3NDIzMTgzODA1IgyyTH9VbDiiVKQt3S0q3AOKsWpdTV4k0U1QBt2ECMYrcsLO97bSrVxxTtduUlRhBDUZr5RU3L5J%2Bz%2FVNvXfQxvtNZEQ9N%2BcH21yGcLaFuYW9GMGiAbrlu3P%2BUx%2FS8gfP5rN%2B%2F4kqojkqMsnRpn5ANVbuUDt051PGKMYy%2FbL4xOXXjmTVs9sF0Y1UWM0ictj%2Bswl217OZcUSpKYu2oNefE%2BPxV0kFmEPyMU9rDyT6gbHEIJAcjgzhMnE8JR%2Bxkl4OCC%2FwhS762p0Xm13SvRsMxGuBPED7fRghGs9g4wuCXENNq02RwkyWhnTcWZOjEwGRlvOnx1sRphugTiWRV0YDNTVQkqpY2R0ROSyN3a00MMd%2BTB9jXT0MnV7HiaQdfCQ73V3xw%2BKoPZGZ3DHmqm1vXIFhNqk%2BSKtmW0bW25L3iqFqDNE0bs2RTRSQWDeuZCJJbOftzU3FFxikyOcx7%2B2gEmEUa1jzTCzhfzeJnetbGKi4ZzAxMxY4%2F5ev%2FYmcqLtoywY1wzMN%2F%2BcmogvGi4EpUDLt20KJVeNjqtKhwVY3gDaVhSmgysQ%2BqeFAAS%2B46IMCSmooz%2BIDAtcAiMclgicX9f9lr%2Fbh%2FXLEKYwzCeGf%2FQ9M%2F09RZ7nNcXiZJbsxIG5eUQLA0xdytctF2cqiTCX%2BZTQBjqkATIJ63Nlyh%2FAWwnFK3n7otKC2y4V%2BGlM5GRXTAOKsI4LR1mIAK5CVW3nEn7Br6t1ZLXQSspAcTcFgp6sbJXXbcP0arzjPft9sFhWr%2FnXfqZr6hN95mW78AfXvlqjgGBoYOKQo8wC0XpYsPqkOjyA5IZaxGjEpkoUrSzELZKmr7tkyq%2Bs6Y7gfMfHo9bW0FIyvUpfnG0WNZfqi%2FPIany09UoeRmka&X-Amz-Signature=6d9bbe38728f5d7a5b2922c83403e98d54a69786a22da6ea1a8fc844f513ce9e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

