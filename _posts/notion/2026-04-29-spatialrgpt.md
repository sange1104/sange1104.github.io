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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TL47CWHO%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T041959Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHLH2rB8nYsYJXgWunaqiFpXB6WXVuw6jx4u3%2Fy8DCWAAiEAmAh5fosMdSm0kv3h6m0AG3f0B0tLh2yUMmRGVmZKbqgqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPExLzXjdHTOmCt4%2FircA5sG6XELBjbdoM%2FBmONrDG9yf8WDliorneR3jBfg0muyIxId6iLkOsfIODB5PNHsbXWR%2FjZr%2Ffz8q7s9%2B1Rqn8E%2Fd7MLHIcVPmdkDjDWTWcVQAiU5nk%2Fj23r2kXdsGpCqn9v0lT%2F4kE%2FfQ3cElPrUK2L0Mwz1BsU%2BFEjiaIbB3cVi5UvZEuML3kGD8k4Gw0K8WEAGwgyfTzTUWIXKGpGH6%2BWdRnPBhX%2Bwb8z%2BU7yTA1ilRsCW5Qd34Wvna9HpZrEB96XuuDKSZNaMdnCh%2B9%2B8poYu5psYy5Wpqk9PJWMoXETXjiMnK93g%2F4z%2ByUk56BXFKqB7FCQXbqNr9NNKMkSj8J6s0SesHqcZA8Q0lmyd0kurkFulREhR064pNCLFVeDO13tM%2B%2B56LEiMolEkzQlPCO%2FYzPVu9qN003bpQ9CY56%2BvS8JFI0zJVxXaDh9Rcs6%2FxKtbOGEFlWMQ%2BxLYKUpVoZs3UuGYP8bn0YDIBHyixJTE%2F6L381vFgx5cToTH6aoK8DOTU2TACsq91MC6ylr2H4W8v1Jcq9Ll084CJCXiAvvqId6KXR53pmus8mSka%2BRmaF6rMeMO0T9x1Jv6m1pIGrxbEzAl2jDc6yfiDp6lFj2mqk14o4q%2FVrSBsVmMN3upNAGOqUB2CYFmdLpHxbJt62s9jAC%2BBd03zvrCeEmzwMTgW98RyAMbORUfXxeYRuS0oNcbMcr5AWp1Hl23HkjVJQGKtHjmIho1QcwcnGdM2YxmEqiR4xbMTy1fdYMPgVQcaPH85d3bjVbZ3r5Y4Crwrprc05NwuqPQfvXfU1sVvrYwBu%2BE141MbC0lbFi7%2F3qrS4NowUkFO%2Fo33VHZGg%2Ff%2FxoI3LCLNU9Ub83&X-Amz-Signature=6b55dafbefc599ba4c9da43377a564da80cbe9050273a370e1f62c73f0b04ee3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SKA753HH%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042003Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDfzlpM62GOroOfsZPpny37EMoZuGip6H4C6R6hB983HAIgYTVYb%2BtQaZYovnuqgzOa7JiZnl9nO32E%2BXOZwPqoKZ4qiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGCp8FTT1Tp3LhjbjCrcA4wnMMrGG%2FeP%2Fv5WX%2BA%2Frn%2B4Ox%2Bd3SLOlR2XfYcL5fZCbqIx4vi9coe50o3Zn9ELKxrc3quLqNKXzgPlyiOoShx8HQX2oB41Crld%2BqolVWewiTik%2FPzEsoUrEqxmbs3HDQ6a68271Hqs4YctHqsn6c7WPiF6t%2FFKnrojmLhixpni8duhHcyIH%2Bk%2Fzqmya9XhRheE7TkdVq6Gb9igmcvVGMomBGGWFdiW8kjT2sNqzNgyFh5RIjcPTTnNqRCs9Gijp0Rdj22B%2FOVn0MYkZTlhsLhEAre5sUthiWP%2FIT%2FpdUqWSdwgtM%2BVEL%2BboOD3mTWMXQPFwLYdJX9D8bNfIm2tlml3Q4WNvB7S%2B7vk2YCC1Byj%2FNggDRixfGhxgT4c4PU%2Bua%2Fb1iNGQeKRl1pONYs8jkS6BDtXXNgJPvbbm2gXDmy421kBuqaHcMp5e1cduDPr4QXBRYszkjlhJ1F9qLc6ZsRoS%2BMTfWvsNB6I8L3%2BMY1LVXuZ%2BrI52XKVfMWNH3W2y5iENAuqxZD885Jlgx2PKj7SV43fYz6BdW%2BHw4MqdMDZHpM%2B6H4x2kmP1D4DNnuj%2BOAS3ke06f9gzwgy8qrhixy9b0cJZo58XFJ%2BjRjn%2B6AmcYhqYlkGizAHhyK4MIntpNAGOqUBzK3gxmXBsQvd90%2FwT6ZLBlNej%2FdrxXR5jV9f8nsOBxUyYryTz2ei%2F%2BfUcCx6fuzDsAjLkFkoOZzHXUVkqQZzNBRtlbYDdxKLaZN7kEyv0qmwpeurnf%2FxvyRcxouKCA%2BuBtkTzTPJnLXKBfllHovoAAvTSTtJJ1XXIdOcS9Rqs5JAWswtqbi0%2FvbUt904WwBUIQQb8u5XLNLVJ95Era1VAgz6dMJo&X-Amz-Signature=6bcc6a4793e15eadba8e0554b3af3e9b09d5a1e1a2b04aaa932663344d53b414&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RFLXHRDL%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042006Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCp8R1nAraBmwet1%2FP52wcrubTk3kivKJhbPA0BmpOOGwIhAKSiSsGCbcyAnG%2B4LxyGHFLrM%2FoXFSHjTU8n4CCHoEOnKogECJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwcZ5134rz0SR5isrwq3ANHRcYysPCAaOqocJZafrXG91qLj83XlSC%2BJRnXApv1Z4c7lBzwZFJIHpZayiR48w7PNUIyqm7Xm4rb0%2ByTdrXPjwFaE%2B9W4StAEyDxlpwaXuZLRsCpvZRVcaQUYxDHE8A2KFbSOSwsw80rfqgsipeTrBMPo3uH4IkTh8eMYq0c1alZEqmilM5b3Eh42xK6eWxE377%2FSIK%2FpdNScSNxjvMKo%2F9F5JV8Lxy1s3Bg19XYU5%2Fqe2ly%2Fq%2Bc6lJvRel1bGKCVxVsggsOSve%2FaImLgKQc%2BYIBYKaAsM4qUnLz8Pldbau3%2BiNLn9eoESEYXSCsxMiMhVYoImocXiRRHZD5vKfaBexRkWKHBCtAmKsMg3dd%2Fo23TDPhodOivXjtFD2d3d%2FCVIimffB5n74bcyXjzUKq15EVEr%2Bq5C3BDKMxWPRGlwpTqbUR6BGkIKeaNyHhTpsYGYt%2FsdEuJhKxBoKkph49NAobbsy47b%2F5ui%2BczcKQWsMj18Tjs5zbc6BXul4MjMCKHQY0dTSmn7LpZK7azrajFMhI0oxSiMX9a9TDTOBXX1xMxbVsZRirYeFFYFB9w0Dj6jiIM5Z8FhJxyKs8eh1O1MJQKh0lDF25XWuBpbIQ4cA7bssaKy%2B%2Fpfyy8TDw7aTQBjqkAahHsksnjhbIugiWYznFDz0KheS1Pya5V7wXvj5Dm%2FZ%2Bs6FrS%2BJCMB08fd7f9STwVPfcScDrap6G7%2F1vUPDrWB7OcyPrvxt7Hk89Yuy9iSxbvKqmuvPCJIeVevCUFN6x164%2BK4%2FJg91rggqjHAXZJeih9%2F9VX%2FvR9BG4BLXGnWDXyoWacKeo07fPWpnwUBGKRkuINDtR%2F%2FrJJ7VejHWUvkQw0Dcd&X-Amz-Signature=24a2439ded340cd40852831fdb111825932510fd7265d7bbee7e6f7be3b71821&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RAHROTXY%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042009Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBJjOYSM3Ov6BqGyfuBQl2jB%2FckNBhck7MQwvdfWu%2FP1AiEAlt1PGFlOXBYCTCzGGbg0TOUqVLfzmdJrL5orPMDA1BYqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBdF207pAdjMYzOtlSrcAzvLG2XqS0VQoA7nJYY2%2FlczLIadHahF7qs9VCtABBivGbzNhWiqymIyro9WJD7aBdkh0MUKmDjDmXCcIgOKkqlmI2GPagozvw%2BP5TnkH38gCZVXv1ih%2Fh%2FQ3kiuRulAVTcUZsG31v1kd8pEvudjumDm4YYr8dDt3zLukxMU8v6e2UA6YHLxnsjpyqlzErpMeqV0JZNIv%2BS5o%2F9b6QCEa8x7cZogLxMmAnBt9%2FY6vyycn%2BIYwTvmv2Bt%2FRJ9U7lLmn5Tv8tQVxXO650PlVI07RxyXIHuMg0FuycW4xyIvhmjSkf3XlY6Uq783ozE6ZcVvzMbxAz2ff5CwGLy%2FUxJR3gjbK2kol0C63hle68qY59E5laoKKCQVJb%2Fc7o73J%2FO8v4fewQ2d5vWRwABqSj7LDFgLjhmYOkWz8xD6fBfbSAicbSgyg3z3Q9mq8dA2hWl4H%2F4vi3UrAL%2Fh5iofZq9LUwBmEC1MgFpnU%2BYWKUMUtFfBcfrhQD%2FjL7mPxlhGmEubTaK7HClhOaK904sQJrx7FQqJqZyBnrkq5wAe8vn4nOXJsl8wY8n2ByJt9pkopeM5UC0%2B98WQHSxXznr1r0B560ynVT%2BCpA3mfzprcIg1XymTSnU7XM4lwr6ss%2B8MJvupNAGOqUBzEW1ge7D0JtdSyV%2BjaHx5ekeXMd1fQvL3Amf9OAfYvAuCiEiPezeKqtee59eom%2F%2Ffaa2C0E43OL%2F9q%2F%2FCzoN0faC9L1J6E%2FcYd36ycuuzD4HvM%2BvzHMkDR2bDzOHpSNK42OsXo5UxnwHLhstfYzWK5zPmCwPBrZbGQzda5rP%2BvarNRufYsEEbIxI1Mria5ipevy3V1ykTwD7wvc3FRO0MRfbeDr4&X-Amz-Signature=15672b5f009023403321aeb5238743af70794c00f99b26adaaa2436d3b4a7aac&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X432ASFL%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGYAkYQsAqIrqZVSS%2FVPkj4UpRbXOkMdKCUedtS1bVuoAiBYF%2Fmo8GeFLUWD0BDBSHiz71cuc3FdFNJp4pvnJucqEiqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMJzudqufR18aHEZR1KtwDtilE2CJmFzvV0QBf%2BXPJHYxoEhB7MlGQa1xUxmNcj6S57SnA3tU1VvlztFTlw6oRZ2xs%2BLSiGWC4xkofxzZOa%2FuFrt3eGATjQYqxTITEJfqvVA6TGfLVjOgkv0Sg1zTl8%2BmsJSwe2u%2F1aXM5IH5gwmMth%2FohsEsiWi10dRgEEtildcwCxZTVWIfxHRMi8OtH8Rpp%2F1UgT94vzqr0A1ratoOa22tIO%2FJCw8Aveo6kTUXIjA%2BpzfygJ59am%2FQRD1DCwUeo0Xm3Sl%2FWdTGB5XraT2doYoNEhx5tTbc%2FYqdB68kw1aL8M9Fr9knnVDGCd9TMeJDI7cUyQNRsH%2Fivvk6nLw5dP94hZQ3Sl6wo%2B4mUrRwhD98nAdC%2Fh5HichS%2FRQ3Wf0IU2knPWdmk18MK69nVegd5PjsQ1kFIiPjAj4yblR5hGHPZCk2dR3J7KiwMqay5qCRz24DJwHKRLDP1kQhmofR3zCS7D5vDIiHlgY0Ugtwn5IzFnBfe%2FrnvgksFml4MzHz8rgoRNiGIQjq1kt6%2BmfBDsjSNoz6Le7KddfbSX7Z2Hjj63t5xL99aAqp%2BASoezoYXEK7MqjqMyXEnuJwD5yONhafkZSekoabz89fVzqPFzIn%2Buxh6yc8LWQQwle2k0AY6pgF2xljjbfBlQFjgXgKATWL1WtQiN1fgIzEr8HmJaUq8p6Nq5Wvd4EtbLOAVuyoyMJ9iw2JcKP3ks9omw3uJrgI18EEezxC%2BbSWC45XgsS%2Fi3eUKjpktCNpNK3Ysg6QRNC8RIqTK71nEHH%2FZOcUpCsHhTVU2tohwCbAhcF0vjX0%2BqNnEa8nDKVlG6a1nBktAtrX3C2wwQFCPskyNMt8jRPyJ%2FKvhL8ev&X-Amz-Signature=18daafce253904169beeae62606aa3f1a715ceb33111e0516ed1660127b56e4e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZO3HLE6M%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042015Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFEg2EpsA88X5rMeqpBlH%2B8PEuvfNtO5bSjiEKbzu%2BDoAiBWryBRrWtdO12zvnA8ekP5WW3qMfsGUOcL90o6wD8vxiqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMIBHrvlZarDX4ZgAMKtwDWa1JToYe11QqeOan%2F%2F0DqG0o3Lvyw1bzEmCf9AaHJRsR9ih6QWvCkcOGQ1jatzvBvZKf9ca1Dc5JAsDI7%2FVLRTnRaT%2FUhSbdLX%2Fw2AC%2F8mNWgvGhAEH1xc16a0KPPKisiQJHUAFBjv87pRDSD1%2BniLJgUJULvri41Vo42%2Fr7exZG9ausM6tMdIfugsXJPFk3c6otm4x7UPf2PLRB8nA3jGHpSmEp7KmRBV%2FGHPnXZJY7%2BYns0ndFJDnWefG7bsevC8DU4OHO5u22cQQD8UTzB3V6kw8Lz%2BIgogjSspYyfvUU86VmGBK7fhbz97aJv0rHNeFUdSOukIfsQnMuSrWLNZCJMM8UYPLOe7LKFgu%2BsaL3rayLsR%2FAsFCD1LgWDcrmwMDMT66YkrKUJDefO%2BtE%2BslR%2FtKkEaz5lbOZiwT%2BmXQc5l%2BFQtSUn83sxC3tLkpXqQGKQdacCg5Mq3y5d%2F54vXHqtrF%2Bl5U4qZ6XSfFGI00zjM3gG1Hsr%2F3FTQmW71hjRr0cXdL%2BOrXE5Lj5xdGhfz0UbLJZ6BbhTDzV77jabv23KkGidLnwu7CMf830UGQ07dqyUOMs0taNfXElnOz2PTg%2By06wksb8zvOmIRyNvA5ZX6L3QsDoq8fJ8zcwi%2B2k0AY6pgGMqYAnk4Ec%2B1p13vMMqd0SF7smUhhCBrY1uIOsIXWiC4%2FvUma%2BcSO0vvdVS73pWAfcfu%2Fomdi0ArFFTzGhHDol6QZq5%2BuQmAzlVMWEqVryzWpB4OtNjEjBoyz9ko878z3YJ%2BC3%2B7tJiZ89d70kxZtUHoUGXHAcJzlM%2BulcPPlkc%2BKaZuvcZTlfb5zhV7%2B6EIgzL9v3xiS99GKLRZ%2Fv96ekRZc36lp0&X-Amz-Signature=d852e55954e4ffe6e6539e79766159d4adb8d4367f21b0a310d0e1e3651ad453&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XHRT2FFL%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042015Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDfrwcDQx6olAfrDoZfmOyCL9P8eE3k85yFNOTjzb5NTAiB%2BAddxInCubfeRpAfORbH9KGfyO34cl4X7sFJ1ons3qCqIBAid%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMBtAes1cyIxv0qINYKtwDSHSUmuGD5vMK5sIOF2NzAqy6%2Bcp4Z1nhjzM%2FlF7HEnG%2BZ73uuz6ccFW4aUlf5Jng2tMRFy%2BDkWOBPWmyc7rWUy7bPsLkWruGfOSmEck6gP3yxvA5lgX6mcnTwWXbn%2BYjOoeqs7ZZ73wjuMsRg69l8iOwk9LIcCsfol8m1gdBtiEbcfNbMG8L15XPlGrBiZzdKOG5Muq8QSpBvMnGXDWwt%2BYNaEXOuCptlpXZ6UHtWMAxnqIpG2IEuMGya2%2BinEbXxoLOoUmwjY8lshHXB09%2Fhki97pWkCDzZbCdzcfCv5yonAn5PV7oS1u%2BiZPePq8GIJFWJr4pArNaI58dEvOJ%2FnK73o1hktMotQ1QSBPiHMpdw01XoIVB5gt2ldmRu2Qe08vW4S6qtsrzO6JfOinzlRmYLaQiYSc22Y2D35Egb0HTqJZaDogQktorUJxfXwJVBcvV1iffCT%2Fm2%2F8cj5hss%2BrAtleiybfL9FAmn99UZ8bUlSYWWbCLINfk8zQkLR%2BwTfYa%2Fe%2B12q6mdKPVfcYxJ7Z1C4tToQw2c%2BCtaQ2rVF1uZkxh%2BOo32lf9ahytNGViU9Lz4P6TfiTEIvJwO79%2B9DaWx%2FENTndsIoj%2BKhzK8xaoYWNmgl1OpIPfc%2BfYwtu%2Bk0AY6pgFVr0D0x%2F5iGnJCuscB4dDGSPVp8HhDM%2BzCqNfiUFn61tAel1xcNpNf%2FulQ%2B7izY%2BnT6kpo%2B6JDI2mB96lvJ%2FK2pDcuszWGE2TCSKVzwL0P53QCWk5vE3%2Bt92n14KBpb%2F%2BWFxUUcsEtr45FEoB%2F0bQLq07zvE4TdmHf0BbQ0II3WzvqH88oEUj0C%2BjMXLSsGrDjIysIK2%2BIHzswc5uZ4TI1Jq7v0zb3&X-Amz-Signature=7ac461e3e0ee725c90e799a200b11181337899bfb4c6e92abae5b09625ceca1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OPGPYFQ%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042016Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIByvccWj1OGz%2F9fFFMz%2B%2BS4h20MUVlVzAIrqc05bbD7XAiEAn8mG8oCEYZpQC%2BaZ9rSV6nlhzyiGNJYZc86PlC7xEXQqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG%2Fdo7Qt0QF6xa17DSrcA5urKG2LzJGckWTf1sVE65wFmdv4c9s9vMV%2BCrCRiUUY07%2BWt%2BYvgGd7ppY1YqZAaWNiNocIQKo2S%2Byvu1yw1tZ28GhI%2BRp0ir0cmAtuuVs5j5KJ7vKrE%2FKerirYiIHGYfWMFFWak%2F6gbC%2Fft8nRR7c%2BozQljehIHPrO9Emw1IS3LyWR9UiDYYYqORjA1U6ck4qtHggxwXQ4yHFm%2B%2F5NSj8pVQfyrJEGMKZBmQoe3lQB3CTHP6HZFcH1uiJXYh6DBdySwDBhK%2B3%2FxusUwWLU0sXymZErwLdeFbIJeeiFYJU0kq%2B%2Bymd4qJWYc1Hu2%2Bk0fGUmy%2B6y6y%2BvRq1y8qUGEET%2Fcxs%2BhyDZm7KyWqqnuI1mVjX6fkcYzQc4FWtXe0qqEhx2%2BGbqnuK56i%2BXOg7X53cEZ5klOzninX9UQx5MA4rWdSPC1gk6lifr%2BZuPedczpFbwoUc2Y%2BXM60vfTKsXyeAKrYgoT3xmbV33begf4BfTAK%2BxW8LatE%2FPZFq%2FjOBsuFdqlTynoFyTDoV9Y6pFXDh0GN5SU5zEZhu9pkqtb5Jlu4V0UNh%2F43CKZjSZJHHAdkrxSABKNxeV1jOvzbBSe5Q9EXkyopIhG%2F8YmvX3fRONvYyJ7%2FWgg1yR0YaDMLDupNAGOqUBnd79m3Wo3Q2k%2BXJte7%2F32jGBJV0xWN4ntAJREDDmfWUQwtQkA8k4MFQ9HXzPtdTZ2REQcQ1hNQgQ%2BasyXLu4l%2FBpdIlqtpxKCGUV4G8qnNs4RH74NS0WrCFRZHuVWZ7ZY5whxTjfneIb4SCguf%2Fh5SYVxRI8apPTbChBf2va6vuKTGDcBeEDVC6eI1f4kKOKBn7OPJf5kQquzVlKLgrc88WLCd1M&X-Amz-Signature=f69304661adb9797d8171c97bd35d58bc40b4d2e12f4591891aeb23f8b5e12ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663MDBJCWK%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042016Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDPKXk1KkiiallQ%2BVc4FxhnfafcGwCbOPHoomBJxsXKsAIgH%2FtrCtR4%2FP2Q%2BT8L7%2FGkwJoMn%2BwCORDlPxLw3n6O9BoqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE7phPSv2a95DyMrCCrcA9pSH%2FAka7CPVdiTdd8%2F%2Fh%2Bgb6lDDkqLz6sd5cyHy%2Fcqzz0cRj7GNJtWJzLyXidrFyUVXO2%2FNy1Q8HBe2%2FSh%2Fv0Sgbw6ky0g84T0AG%2Bdc%2BsLbuX7XzdZOFW%2B6f4kvq%2BFuGiojFnGxq2mnoECh2tgDKY4uNYYfdTo2BGo%2F9klBzu4zUardR2d%2FHmQESthoNXG%2B0LGwY4ohXpWg3HvJQsq0Qa80eE2Z%2BtymOcg5oE2vNAuDoXs0EykL33zbeX0iqxFtRNfKDNjtMdzUq0n8WRoNVRHhrXIgqS2bjxZZR4x0G8fYwo%2FGxGyBgpFxtRFV8n7gzWEEsg%2FyXSDRiVfL0C1iy%2BC%2F6aZrsreuy6DjqFxSOYq7cNyVflhjxuYt0cNmGyVTThIri8%2FUCvcxYT7x4II7ewXC7Wla1SKuzogj92WE0uaTlRTmI8UWAqiu6nQDoJd%2Fk4wPoNprCmycXhswoeSEDGhRSO5g%2FuOYYM%2B0TUnXkQ%2FV2%2FQAlsFfbXVxEoIk8qdaoPkyGyYzWnQMNO9tKFMCaBNtAymT6IMNeExZOjlMH9CPQJgS2Ajjy9O%2FO%2BjkteJkdnikRH5R8%2FmrfRU6tau5277AQLndy8gDCMiR5dtShiRm7gzeOmq67ji1kCpMKPtpNAGOqUBwERs3ohQf8QvWduCSgpivaCZe1LvOjbcbSYBEExplbwXoxvs7QC4ijtkM9FUqmr2rxLYxffFHjTT%2BU0QF3lcQaEqj5joU9V9FgDuq7RnK0om93mqnDp5PHJ44FTTXnR9QjzJQAD9%2B8B7C6BLdQdAmyXN5N8Alx9t3gF3zBILTM8sYmdT8MMZ6bnwi2zgVzu0ca4t%2FYgVnsBXoArHAlmq%2FXW1DYPg&X-Amz-Signature=61a0c8d95f9f1deb7c4b894abf32ee1533e8a6990d04e315bfe9970c166322f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y34NHR6U%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042016Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDXZi%2FImw9N24oOofaA66Yl8l7Y3HH8strT3IK1KCPvzAiEA0OoDorz8Dlczd6YrPRkqBFaDMstelcJ1SwVowpmu%2BJMqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA8JM8wwi%2F1Xck23pCrcAwkZpMYiNdbCbOFiBnK2GJ6CTaiNqib%2F26%2F7GQaA9ZvFavMewNhV4zG%2FMUQ7tXFWwVwTych47Bx2XZLW9CS8x0MljPYBBnzP0pQXDb94zTzJRgWKvNJwrUl%2FVKBrU%2BVs%2FbPNRDF5aGC4xYDJ34RTxMQjp4LzIM%2F%2Bd%2FUN7fc%2BmaKqnESwLTH%2FqFXZLEUKQJ%2BBmEW4bHXkg8i31ene7wf%2BcW5impe9dlgX7ktoAGqyJewGsMyn843dBC0ycpJK1ykqTfKfrm%2BBkOprYgmNuTLaRFosu4TAs5PhoDCL%2FF9wXFgElSX6wieK9kB30A1jfMy7vMSZEsXZYWoKZYUaxxsC9Nhi2ln0Qzvn0qXy8pEgxFj3RsaHjGQV6e63cp06tYU6U7%2FPA85XYuaIZ%2B19DUkD4T4kM7MnmKpPN4LEcNsrba43D3VOziFTNWI1uJh2GwBKxucUBx13ZC2Hw%2BCW%2FEQJriyB4T0Q1g%2BMqTVbrbspvUvwAdfUN7JU6RqXeAcQzjU3IArLOshQuh363Cw%2BllWlsbOKLEY1ro5g5AV80ityL%2FhufI1bVW1qDquS79gPuie1w5BxPRcLObgOKt9XKy5sn4ws9%2B4PTDWkHBbEGJxArxzZrckAl6dWB24Q0TIwMOzspNAGOqUB6kEYayINHdJJung%2Fm7nQ4cnIfpnfj4L3o%2Fla1K2PCGIBG8eh9mCSfewmxSVlbGXz0emm3xmjWaSmNbZWYFg4KUuXVnPKm6uxdkBc2qGztyGsnyQQeYBnQN3ARaXzeHKoaa4IK5EjuqEUbEDatkw9f9ztakONkgadVzGRQEEM%2BTAUwv2oesqr6O9NlV%2BDsN8cBo9MSWGVIxF4TQSn5s%2BuQFAJdReh&X-Amz-Signature=1bb6ee184589efb9639c6cdd1e4031634b7e579f6d09461324974f2626372076&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SFVQS2G6%2F20260517%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260517T042017Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFgcKY0d7RdixC607S3%2FX%2BREPAJEvoUsMg7x6DFXfNSvAiEAgDEmodu%2FkYlAXlU2Y3ohNrIIP2Fpg7EhleLKdOdbZzIqiAQInf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGNKXhUqMFlhnahacircAx2KMIV%2FASOKIy1s5EbNCUaQ3ze9dSC5C%2F58Yxlmtcx%2Bq%2FjtXhnMWoGL2bZ695HKr%2FyvOzRhVgEptBu8aDYS5u17FTmUb2yr1lk9x8W1VASrsouIqRa%2F2A2pk3zjZAFGG268kuKqVEOkxmQXMxn8sueeAG6jpSWUNnhuFEKmC7zXmJIdJPAx9sHNBAKDLqtvS0tv5jxj9dFRVkOvgUPh0RTyZD0c4abkpmwBokJEHD3CKsX4kdwj5FWmzoqckWp2RCy%2B%2BI%2B31VjJiM5FBeOaadbOF3MPZp2md%2FPQm7VnQAwgJDO%2B22MB7cNYZx2tW9Bs9xN3JQCxRTm%2F2v383QBAxQLZqb8d7pN8rA89R5DmBac3LnocomOIxtkQACB621yrHeMPVdcuby9U5GFAYyciAL1A8s1SGTdebsA59LRjny859XpJtuDGEEuk2rbWhXPccML8F4sClPAk%2B9yfvkmZga9XFMMt4C0mXvJz8urk5EI7A8emnU4awkMyBSgxxqNV2CBktj1Li3y0%2FZHmBphiM3cdv1dQA4%2BVJ2NZFqsafcgWIL9S1%2BQDd9rXZF5snfSGtiTeH3DklpM2359ktUrmYXkGqR8f%2FSFj4gnSRgeSeiZ6gz1E53isSzT2In7hMMnvpNAGOqUBcBEkIouTUYUVjwFB%2FT1gzDr6oaTFvdxuZurnU78NvQ88j88xVodpZBfukPhCCmYvqN8xI%2BH5Zn%2FxkG57YpHSoLjzapVCL6SaoFScLmeQEM9nngtrkajjkTdzsM0NH2%2FQNf5D3E9Mxus20A%2FDMTi9JLDH2mVYXMmIKc1too5MRaHIIb6WFewL8xbVLRWjpwWc2iw8MIo0g%2FNfVfko8UcUsAJtzNvr&X-Amz-Signature=4615158b9891502e8588dbf086157fd22f00af8c707d2e4401793e4d72ee736f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

