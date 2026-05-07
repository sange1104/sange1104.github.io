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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZBJSFNOT%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040303Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGXo5T98swIBt5DL2tpTkCT2gimEadLqfUypACOhon2MAiAjkTa4I7494gAHLeKwUx%2BXk1PlJpSZbrCPsmH5v%2FEoASqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGH1dYuGLo31KLjP8KtwD690L3mWbexsaWoRmmjGzpT2jviaznturS5%2BotrKV3%2FlzL4WLKjOljF1kZj6rhMAJTgdK0AMsEIEeZbywVpnciGMuaDHdRjGmdBsGrcxZ4i9RjQkqYS8XnYdlfmt4W8ma6V39AKntpGmUCa9xEm7jQV%2FpTBI3LVJpQDcVacddWtG1pflF7k2day1vCGMyFQzJaks7jmA5DTJEFNqwXhS90gV2hhJWNBdQuXK8rdFgKFWdM3%2BnwGL8pOybJrsDKVR%2F8eQc%2FUk9%2FV4Rmsam%2B7OasxenKNLumQvLpAF40CT43YgHdc%2FbeMK50Ay7TO97ygQCDxLUqL9Rtr%2BfysGQHk2jZ5doaiySMyVNxqMOA44JTCAPIw9Adeij9ZHnI76E%2Bq0o8zSIE6sH%2B%2FsraKdJ9XfstWAsGKxeYAugtjKv1NvqTXYnfgF3CWDw2OZRop%2FfTe0fjKqeXaHMvYqQWUHlhsMytmc%2FDj%2FN575uFiM5gMRytKXfa8LAScCk7Ezcr3TAC66%2BSmrNR%2F02wPFDVWPCg%2BpSMSE%2Fdu4e8%2FEr8JnypZOsR3dw41CLDJ8GOJTfpQ36e2Amyfz2uWrxfl8Zn9Prwkc9UO%2FiraRDwHl6v1R0rCfCg0ZAyAVDzceKwBuGPXcwgonwzwY6pgHzQ8K5VGu24bUf4GxR3Dbm33Irwn%2B189lzJFhmbns%2Fod6Cf5nFs27B68JreaSEe%2BZqvwIcrSXHd0jGCAj4aD7VVVgHJuvwpODEifE2kUZuOkJR0kYA138g5m2zJ4aGE71KBhB0VW2qzQY2xRGpOfPPDEqGROKNaRFZRvEGdh0XKRNLm3LZA%2BnanyBQvhujxKtBFIQU7aAyWB0GJa1uUEhgYtDkSlrH&X-Amz-Signature=fe643b1df0be0510c3afe3150730df0f2e8d047accb055fe3f0053ddd655092c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666QBAOQTX%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040309Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDREoryF3o6MRFbJ24JsGgX6pTonLJrTCJ1v8j9Zp4QTQIhAP7RE%2FUiKtYQhChmwnnAPgq6H0VgmlTWQl7i21QOyTg6KogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx%2BEQ3Qs692apkOCWYq3AOFME16n5AwUP%2Be%2Fz2rygYVKBWPSF7VCasF9mbVH4U4a1koCvxPORTyXTY7aMjpInKsd6i4igErvZ9b9nuCsESRf%2B4ui9M6e9LUt8x7%2FaNFF9KtQ2uk%2BUxUvLuzmY%2BrJwELnF69mkLDvllrZ9pxb2KLmdInQr7Gas9KaUcmuvJdbgl6i4I7fO8zppoI3syOgAa%2BHSMfJheiBNYtnBxb9puAtj9M4MZXnOsOrIa1YLo07BDwWCYf8ikxgY0DLLDLsyS9BtNAgR4qnSk1c%2F7TmVIVHsiO7ECtaNOroVyPZau5zAqm7P7nytBTT%2Fr3Apb1nPQWitpLSJkRYcNOmG6eYTL646yfkiopEPo5K95Ds%2Bwx4yfjDTmwd0s9sKJRxrXq4nfN9pXvS%2FKS5dHzO1xjYsQDIUFtV3yPT6JmumX95RzvcZ40zEm8n0jtnbRj5zapWuh63yqaPfqwaw2wHYHoTaoEQBrSRXJPXqfWAzEvbLZVSU0Qw4bBxoLp0monX9RJZNWeQ0oMEWM3kUVo28WopZPJY%2FfoSmkOGiQFx13ybtTZEe1KBGQTwb5h6Z%2BxHnzRiPDfwTV%2BIHmZtsr3N1VrCXJ7k64g2PsWOjAk9YAtaQCtFE%2FcCd8AGYom1Djb3DCXi%2FDPBjqkATvXUXWLG1a0XsHohNvcSaej1ULMMzxyf9ADePIF94O2rBF9W3fvv0L5KezvrADevBXoi62kffaYHdAgwP8qucp1v838FwmNLySRCorNwhr1hAJsYUsVqdQxQvKTkEKMc38OtcKR4%2BTWn4uIxp5KeEIXNwR6F09Dmbzo39Ys0xaD5CK9v9Uxf0m3c37scJvb2ZaXohLpaf%2FiQSNpmdYdNmXfWQsY&X-Amz-Signature=ff8a3849180ea9f484f1602b21aeefee4171391958721a227e2c7e23e4ad5717&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S6SJFXLS%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040312Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCXrrCyUsNGhG12y0YIYAZdHc3auGA%2FPsmdshURNA6z1gIgJ0tvFlAnDbuQrmug70uuPpbmrY8i%2BEFiPIlayv0q43UqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB2T3JloPjodSwotUSrcAwV3D%2FYzq4IDeGKDnVFKeASwGZJmIWQZHKFIAgkzMKlMu%2FYatHpAIpvxlSGg4IAtXKotvdHOS%2BFeW4UvTOvByBT4ascwQ6sgOpYFLKtiy9yDFprELiNEBapI7t7bkJJaWZz3Yr0jZEcC9d3bv9H4AnOAl9FQJzC5QITROvb51%2BnYqThKLp3Ppu01IE3kCob61Vxz4yPq58eoYkE9p25e65PoZha6qAvrGuxLJg9YxNCL20tvsBCzKe9tYyAAaB2AseaQuEJpyQ1I2PuFVDcqmSgD09lU51j1NIHUvywg91pD57pU4ZBYsSJKMi%2B7IxIDU2vPYHTvLUbPPKxkb%2F8wSv6D6FWT4KyCK3u1%2Ffq1bB2%2FPL2y3OZJ7iQgBg3CBWnEU%2BHfzykJx6y5GGJKa4gW2B75IhCTJvTDcS7ayh4b5UEZcM63f2DHPb83FzBPgpriw6h8fqU%2BPWznrpzhHnAUqKMGLk3HGbyv4%2BAN5YR4ofhybrX4uih4%2Bj0NFmznn2m1Td%2BOQPhLwKbIaN1l9i9YIQ4ZBTsynTXWKef%2FJXx9mJ%2Fj2GLhCyMWR967jj3Qi9sHx7JIRoiV4PhBqEQjDRP9NoQqtjfIpi3dXF0kUyNiPp7vqDveY7NCpCis8kJ5MJiL8M8GOqUBaRqs4u%2BaRB0wsJKkv9x7HNAObUSH7tRSpsBYUhTHnNwMpz1MoAhHc%2FB%2FqS1hbU30G210%2FeKxlKJ35PtAYZDNaLDN%2FOQD65ywtrOpVsT5nry%2FJhOW%2BD399dV3nIog8FASavtKhdWqdrAeflGAJ5pf8Bh4Nxxga9CD6v4b4OE7VE9a2dLbeEfv%2FR9yAcyo660TW87249BBgE7CHngxartJoKuw8wt3&X-Amz-Signature=402f8262f30d405dc7a859d02275741e5e77d476d0d9dfad025844f06df19c19&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZWY4IAJB%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040314Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBuKTF1ZvgrE%2FjLS3zYHzs1%2FmA6rjv4yIOujR%2B%2BHT%2BViAiBx1GT%2BbrlDmR7Et%2BX0X8NCzzidpnsRaL2t82QacukyQiqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMnz0JusJZQf94xJGPKtwDIDmWUZ%2FZVanCCUIolMw4A%2FcTOf0mMhIrKXFqkhOk2O9HMhWBIRtW0ynzxV2SRtqTDjSjmw%2F3r6HZ1xs4%2BtO3ZQNBG50%2Frr63j%2FZmU%2FzjBMCDX6c12W8HAY321Phq2vTYnsqzWlmtnnhZwdelZDaybbBiXukI%2BzWjtGRH1oDCWMFeKucAifxMDTxcwnARlH3i%2Fdh%2Fbjuhn7xo7bKkcjRUGe0Ct9OHbOJqKudxLaB4SM%2B6FVS7syNTC0gEtCJ%2FebjLK3%2Bp0K5qG7GMw5E%2Bg7WX7RXWFf2l3NbqXgZ5RRbBde%2BQz10jjwZ%2FBOiJXr%2Fz2mS6PI%2ByANmKZP8Q98kwA9VSifPGks8w28ghufRX%2FMiYCxCFu%2FgFZWThZcCa9%2BubL73BGwdOWRDBo86DWYaiSj21qC92Jy%2Br0p6mGYF9vhEMdmEYmumLuWmR5DzLc9ju8h696B4FMWYcHUk%2BY0COCGhdUNLA4yw2ZVsskxIq1thaoZoroz9JQj6fEvHgAnJ2IPBGoEkgueAcOuwTvnc2Cu5X2TH3j2XOpRLvqApUZtDuOdv%2B94XTvLyJ%2FrB%2BuDQk%2BDXytghNqfS6ZvZ2e9IEnnKPFBsN6lqAKbOilpcMWtMd6%2Bt%2F87XiZBqtwUjld94wkYrwzwY6pgFaxlxm%2FZo67liEr9xeJFZK0ctAQAK5mCkJeR8d3R3WAqH75vZd0LJFV%2BwvImG0XFq9Lo%2BNfucETKc9kyLiQB%2FH5CNWgnRL%2BX37%2FpcAZy3hUk948AP6i2v%2FEZFUFz7t8FZco47l%2BBaCwdbaG1J2yjnM5vr4vWBMw6jOLJ96ZuYYcfFf1NQBA8dhrZ3dikt%2F1%2FhQeCaqNX8VM0SV6yfTV27OYRPFsQxE&X-Amz-Signature=90f3be374e6ee9458fafbea613ccba7ff26c98cf73ea89477eb30a92bbb35ea0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZGSZKYRD%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040319Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBAKXVnepYJ%2Bcji4Lo1Gl3VDoDmWf%2Bc6gad15huJ%2B1P%2BAiBzIyDY%2BWQplvx5LFecPyhkVNtX0LHV%2FG8kb5ypN0HPfyqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMpzFDqo9LuL9VseLcKtwDFBmtlvM5WDbr1flLO7eDdMVz9Rur46f%2BD9cxE0hgOowlcFnmUy3dW5bT8DEDVqmC9CgXDNxgSD0mYSzWweTu3Ci2qH%2FBHDI%2Ba%2FxddnJmnt%2Bmy22zBeLpfQ8YM3w%2BvbMZsZHtJ9MM6kst2mNt5l30k8IybyRDUdAnovCMveJfCav2Sr8eqdl6TV8cUyi1cD6lgbRDdJiIQ1ibLaX4YwaFt%2B%2BKpEHFDmkQDRKtihxj1WeHTd716XbWegcF9DUdeOEmPoJXxxvUqhPlxKsqBQHjTYFdH92yzqusY9qLMtHj6tDH%2FyF8tx6F49NtE0nqTBR7FtSlUE8pSKa%2ByGoJIIwy0xQTQ9IQL6VbrccJohj713aOvlWtw%2FA4AFBlhjXmq3dx62G70t6ltyG0l2ZU91hRTYNRdtsoegMzwcgC7rSlPohEFO3y2u4861hjujEoxg%2BrYYH2Bhb4mQuYJjcJFmejEKhFFj%2BHuo1Jrpz0Zj2DObvXSLPoosZSAzDS80KHsGkL9GJaZo7Vo0VofalJwJn%2FIYTZ2cxMQBzugDBTle1JZhOsCymgueYeV6%2Bkiukku5UABrqpCIW8yRMnekv4DHLzXxFLoi4rmIcX5AqF%2B%2FTmKB242A%2BqvXFaukz14sIw7InwzwY6pgFVzj3uMZs1xX7IdKASRgV0aP53lQ0y7EouWM%2BSd%2BgWcBaSmQnuVyo5wZy83qQqFZVYV1DUJJdT9jcL6sPKoKAi9jodHtre6F%2FYWWPxEUukQCuxdlCPLRt0KwUGETvLhVonfDbttJ9qKYtU7W7E%2FFU0LfLRU%2B08mDyNvrG8gACwMTbSHrQCKhRPc3uma%2BhA9JFJejolfK5vXQy%2B5igwokoiS82CEvGs&X-Amz-Signature=1638b2bbf016cf69697e76d7a9e1df3607de62fb21285d3c929b16b741a67e07&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGBUINCO%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD6HIeKooyrts5XLytn0nOWAAHNoKY9xTa6F5%2Bt9iP5FAIhAP%2BQrtaVidkTFiI7M1yjenAGU1grIgvFSzWMIbpp1hThKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy%2FzalgVMeH4erI48Yq3AOtqLOnIdZVthLnSlFI5lOM9moPAQZ9Idfzibaz13HQJnCzVTC4WqWklluD1xhDqwsymwMF%2Bn26AilKxFGtiliKNsA9n%2FdA07Q2wjZsz43xjNyzwEQlZKoXfaxbmsdXVggHYphtuVZFIFgsezbBzxz8WUcqkDysLP%2F%2BHW2VRpZAbAET1leNBiD2%2FqKnhrJIGpqCcNP%2FhZpewSGiiuK36ewKRJSYWoLQO%2ByGdzfzGhVeqtxGh3iUqXHPT7vmu1Kugib5LvsxZtfEGWZW1osVeQGyRZRYL5ltnu5Xwcwk33m59CG%2BDh3JsNfXEvK5pAIL0mPa0QfsEtWwD3pEtvbZFwhu%2Bx722EYKPQyIfQEfeQJRrefo2erJCDBhytkRvfJMWFarjuOHkzroJfW9b9u3oWQWV0zkWiPlLio54MbmIW9tQrbzV7lZMOa68anFW7D8z3vemJ13fLk1P1cSb6Af3GqExhDfFbkT%2FUkFIkAMC2unFcJkpfR2lWRgGEMvEJU4nFfRx7O9hmSBydBFtFAFfbtTeFnJ%2FoxvYOoyp8Z4wFAT4gFP%2BdLVM8KDmIOuwGFYm%2BV%2BLwLXG5Ueo5BYvcNzqk9mdIHn2HfduVfFMWmBxnAdChUJO2U2cg8E7c9GrTDNifDPBjqkARQRV%2Ffb8vVKmdjBpXyHJePw2%2BP8TXpZ5NEYGmGjs631sNX38NAdC7s30XzgLdiqnbwLju6CRlRg27gWcM16SSwO%2BPem%2FcY9cfYqj6FP5HHi9WZqd9oXm1lABrUyhaNqqsiLMriFpBkP%2BDBB5pXuFrYU3OJy1bD2Lt1wycSR%2FpsFnsYaooVjrlMX9jhc3Jcw22QE%2BlkiiFRH2r23Po%2BcTIdvKjfO&X-Amz-Signature=6e30a3ae0a2f4ba6a5cdda6dfec54cbc19ff6018d708713c541ccd332474bc90&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TLDF55SF%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCZ8jKtOCYp8eOvkkvNP2WhUjHTkxHwEGe0geURsSoWeAIhANMjKsF3QObvhuR6aV4y3VLz68dqQQ30odtEphG%2FIZGCKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igxr5iwMl3fEKdtJHC0q3AO%2FPpNyfPKGYIG0%2Bu%2BHMRlKCOQd1LCzYlCJLij9%2FrWPsH4EScvOoQ7cQmNKsBqbE54PZskuYM8WF6W5ttmk5XtsKS0OCFNIo9GNA7yodl80PhLju5%2Fk%2BOGtR%2BDcuuNDdMAvKX6oG%2BctRiEXOPkjA0phAZ28eGcgywhgIH4ho6%2FuEcL4gthv87Y%2FyXl%2FYjQOpEPyxeJs7FgwWc501ZIpyFdVAJIHAZm6bIFVfaaTgVgcXf7nLr0q4DFn7kvJdACuhdz4vmM7QQXuISoMxT%2B6gfLpFZAb6y6BLDB2apIm%2FydXLSQo%2BPlYAVbzPyCSMiGRZNZZdtvxKgGV9uEZys3lNjhC2G2ienAcvHLkdeB1qKE4tz%2FZfyD6qfomflCEHkNP35zq4oKbmGK5cBjfhu3osOUOCgq8zLHdY6m%2FKmbFBa5XHEG53t4j8RNFC%2BJaX8a1wGNT9Wuo1Xx4Vobt7XfoYnoKNpRaI%2BjgeZr5bLYhCZDgCZFlL6zww5HGg25hOssKNzPS3mPO6kZ0INdbMH5%2BGIrdf5nSedWxO2fLxnLD3TEZM9NW9roCbgGohlqa7CwKVWytGs3SJatHs4Kbx9Wo%2FJthFa6ehEiHnqigjE%2FPONpH%2BQrdA2vS%2BeUSDcAQ7TC%2FivDPBjqkAYa%2FbfwyzgXIH54SXJdYZf%2Fqp9HNAzcMXGAn8xoEUCn4txLwjm%2BWo7zssGOmSDwME1FOjXfccoFX39AYYtYmqvFo12ohvlLfel2DCfFZXCcA5iV%2BIymGafuN9KIkMrEUK%2FFDgqYppcPlcBQG8oaH5n6QJrw14smtbqE7gHnrNsUxaum4U1vdB6ZAQIBeM31f79UYda5E8xBFpXKmGUNXdatfGZ4M&X-Amz-Signature=3493d0e4f5569575a1a7c48e6c2b68d58f93ac3f16e7b7f229b9641f2f883233&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SPT5X4FN%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040321Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF3uo8zn4KMNcf%2BFYltFAIsymsb3mKnSPEjTe2Qg7bVJAiBpD85FaPuGTCJjcAblR7c5SbjvqCJz3BuMhNw0ksN4PCqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYAQH6hkUptx7kbvpKtwDNf3lKwJ3XNcA0iHblYOBbJXb7%2FrbROxD4uU5dN%2BwEh%2BmPTR1PxiOSw2%2BId7%2Fn%2BoJ4NtF4TfVU5iPWC53V92AWyD%2BbYvSBnE0WVfeDvmXwMpFdBVX%2B6LF3ax0tqwWSJ6I8mmy3qxmiVguH%2FGgMT08TL4zkL0tWZIdQrWOvHPFSHgP60C5dqDB2c4fDXeVwh13XvDEPv6tD9QZ%2FcP82y9TLfxm%2BwJw%2FbJTvJUQqbXSP6Pl2AFumzCkGQmcbI5j5TCY8wky22vTMbbWDZKT6%2BsRWggAtGiaqfiN16EcNHGrBAQqNfDnAKvcH1FnRl8KjO3Gr2w30iwH9mwe%2BYOIqb%2Fvwe%2BDh7BcmnW5elSsJ1z4ONFGAq2ikMEk65yy0C0bGCMM531c%2FzVfOR3sr0x822tPBxUqrMnybC4Q3dd9Obz6GvpfKrWCJd308R5xoNm45NwRvrzgNT9uxg1sSPH10Z%2FqP71iu0QfghuZfwGZS5GSQI1iFZcloTuKHOzMsJFGJIGAnrqRqOnjnZvca8E2qR1uE4gYEeCEDdS3QhVhDcGZwzFqEzGWMhnxfZCQcAnoCs2B0VJZwo8NQ7edAAt7WFBaFxc%2B%2FAXG%2FkMXtaW0so3GvV3iQn%2FniTYwX2%2FZWbUw7YrwzwY6pgFQ6Q7kZQuflacfPrJWfrXJH0qZl21JMQKk4UgpcQyQ5Kqje0F3QB60T2ggzsBKA23XqcRqd1vCAb2ScfJC1B6MtqcmdtldXeWi%2Bc7GcpOgH6tXLeWCgEbp5nkAQ5uxBYK6kR1VuVGV11nwlI3oUONVXP7Y9%2FYFwpKkOm0pF2%2BDD%2BqpU6Mu1UVDp8CFygew9aZvLXJolZ3m%2BtPRd1BTwppJc%2B%2Bmrfu%2B&X-Amz-Signature=e6d2542c947ebb017804a765caadaacc33836aa35f96b1242211778907609a0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667DBY74CI%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGyX8wSVShQQAkcX2DZLEmae9Y9vUEvNB%2BCUrropghkIAiEAvS%2BQ2RVpuZ6%2FLu9wpaV01tDRmz%2BuuqMDPf5I4%2F%2BuCFIqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKXr3i%2BQbWAday7pfircAyPxAaOJCSgACL6BdUC1nsCMRN2qEB%2FGLNb41JwugH0x%2B2cAq%2FfntMJGGttfeVy2urQI7a5d59eJcrghO05ct7ZxezYme4wjHx8RcReLmMX3SkvJDvk%2BNwx9IjTAoO%2FC7%2BMEaSngPCeKdVpNVpkDQ00tI0Dt7DXNxBwN4VjteVsFMpbjGP%2FhYbxrA%2BO%2BvEhDLvVz7%2Bsj9oGguzw9F8qvUXsk1CwiXhWM%2Fa5HBZH5WTzu3CQuzU59444HHPWghJTcpu7QXS1MKNQno9nFU1X97K5OgBVrO%2BuQCX7MHctBdbjYtRRQVwPJSw1f%2FlOj49DPeZZvNkdqLq%2FPnzQNcJcUQPDZXF1ZMPsRDagpZbzIxvKQlvMllO70kyYoeGBK0oWR3lXSORH%2Fh1qWFzxZe5eyzZKSDf1JYzMIZjjEVQdATT1pbfERQmUdJyjZNo%2Fafhr0ZewDOivOTHVb5MIPh3KV9pFNmc1aZcBLejSu%2BCrLQsI7TPC96kxmXgw7p3myS8Wq6tbatyBioMHlUrz752fpM4WhNwi9SqNHopHL9gLpNk1oMPylRce2C5N%2BjjNLtHJmLdqqFd6ubAjM1Qe8buUcLy7AGOWC3vxcONJbAIsGVX40YPl2AvM6Y7tGwm6%2FMIqJ8M8GOqUBMZYarTSLKuKGhg74d%2FfFYecVKop0TdRW%2B23tszkOb5fo47HEJDhmByEPYw7PBgp8Cu%2BAFepzPXleDiiSaS453eD%2BPX5jE0z6f%2BWh5QX7vvp9rvc3ArncVPqLxSPGD1DMiHLb9uL6CkTWIy6x7JK%2B3bh%2FAlZFN2Im1mLn0%2FhN6LAjx0AkibWaPAKc6L4Mc2iDan9OZlZloGz7sdAkMbvkcvluFjVt&X-Amz-Signature=2654d570bd97ff4acd50dc0097e80efbdde78da173d54b5b53eb1744ab03feba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663DBC26M2%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040322Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC2Bjs2xEAmTn74myl2sH0Gt%2FKawSYdjhzI%2FTgRC0Cz%2FAiEAouJBvb%2Ft12VZrUtfU5129LEwO2ew1mYFEMNdrI6%2BvQYqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP7t7owGVrbTy3%2BndyrcA93gdY6XN3c43%2F9FQSWrh2h01zHjnhIHeMRti0RycAlkPRIx8Nl5tubFt4CxILqwxSQBJt%2FuLa9ROjHyQ2EQMbAE4b%2FnwTHvDdtU6tWi6icgdIWUDN9Tng8QBpWjlHz1jXqO6B4A1uGm8seEPao6q54qnSSdAovC4KEa38JusqQUu0GpD61IOtQJyubJNr2jh99hwiBfaRE%2BHYDXSRvxYzIFHg4%2F2LTey9UMZZ%2FrD3nVupOj7D%2BSHe%2Fo%2B9tsBw%2FioM07sg5ve7weoVEEQr35P%2FT3MbXZi7pRp9km5y5BUQ7ky3s9RY9xND4ZLmj5LdMnOZscrm5u5BCPaek62DoqL4jIaaGuxF1qpPUakskE3QEzU1PjrcawA%2FI7eXyJMgmjkQjJ9vGLbCqD5FDBI4QVRl7uTjOl5zfpwXwBogcliNd4KO4OeoS5Bjm1ypo19jdr9o%2FO%2FhjlILc%2Ble%2BR146AMPr%2BdwbXGdotT8ijJr3%2BvDFhqEQlUQJICiETOxqTbxFUCBvH8LO2WgKnFgwLnpFlayjjb6HFCFXMtououcwdJnXbyZuc3M8fxemQvSvaAgMsgGS0N8ptvYVnNjUI0xfaimsHIA5ujnlk8KgfZzfIHb0N58yO4aPRhxSMXkwKMPWI8M8GOqUBdtsqIrNM7DFld2BHAX43zKXwDz%2BD76gdaCVetuq%2FewArEP04SMtv9IDr%2BK%2BWSH%2FBDc%2FaHnw6EbHKx0UdDAGJKpvOPB%2Bc2yJKOSORWchqr1C8T7mRxKoQxfMuei3bPHjvGRM1OXq64B6aXZzfcxbi2O7PtWHJVxW%2BeqGUr43Aa82B96i%2FkjIL6Go2575csuiOiQ%2F7cbHp%2Fv2Di0uKT1dlkDr7hXst&X-Amz-Signature=73dba74c335ae42f8f19bb9431ab7855e2e7ae25885adf3ef524912384fd8952&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665R4JLBWO%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFAUcMV45sxBPpJpOpcLqwDFhjTljXhyhI7Nsni4EAl1AiEA%2FOdru%2BBBF%2B5fBpyIBLLvxdmQKplZs%2BuzKO%2BvAqPbRncqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNXBYwR3dJZFjZS2ryrcA81M%2BwOLVRcqqHbBRl9686uXp%2FjC4ED9SIapXK7JGfdXrdjcq1wS1V4%2FBbuPTmtfQc%2BfszE31GfsLjFvmG%2F3kT4bD9Nlaaj4s6GW%2FdZoWcNM%2BvkIhm29XuSuQu2XYlVk37GhHaf27l2LNYP8AgRgHZvQCJHaTVIugxuz%2BQr5LJmDpMWAUVBignHzAB%2BWKpkvBXlSQRhkI4YzzxBb0e%2Bl0AP2cHwn9YwrJ8qDT%2F3H4cToudTUqeuGMDVqQCydfutGc2WmMVb%2FFcbsEqvcQAvZpAuCpD42UBmu%2BtS9KxZ9tYGgCTPerJ4UPpzKz5I1fmUWuzwGuynA3tvvWcqs%2FymHDKmtOx4q6Z3w0CvUP5pBR9c41O3OF0qtgqJFIZsd8Zchlwgdik6IKYAj0zyTBNP7pQBeWtLM3TIOC9vaUDVjsZbvIXLpHETqtzH6r5T6NhWI%2Bj1kAUdIWbC0FDNjr34tnaTXkbUwW%2FsZ5vRJfQ7o23WOPs0FjfjqwTRxbkM99HaW2p%2F7BsQ9WYUCNkahmp3JQd49UN1XIG4MgzplOjfKWd%2F1TtKcwmjWgBodbKm%2FRuWh2zU9g%2FZwC85YHhgLv31x79Nhap9JebBs51%2BxQvBQVf2XybdGS4zqNNczYvakMI%2BK8M8GOqUB31ivPHGDYdHA0Q3wFWUuME7fKVHNjkDKINTtxQfBXwMyP8940AoTvmarsOCB%2FBFEP2S%2BHuO1K8etYWEh82iMq8w41nhte7cNpEvqTkmFGhUoI3NkHuMg4Ag3udLcLO6c%2B6L36Nu2%2BhFAE8pknoz8UuZn0od9nwwf%2BPUda1%2Fi9DMfLWBx34wwJ%2FmEI4sk8ekP%2F9m6UkIDTnxdHeJKQSKnx365hh%2Bn&X-Amz-Signature=01db59db361dceec2aa127a18d336de1741384ed09a786e11bdbbcde73f5acd3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

