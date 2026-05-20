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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46676TPH2VW%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIHFFCK%2FUuarb7cH5EPMPDOzYNMo3hNfF3UcVvsAcx%2F%2FcAiEA1XhPo3q6KyWRzT3pWkIyGZWPkphLZ5x9NpJbl2Sz%2Fz8qiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ9dh6%2FjFcXZPC%2Fv5yrcA%2F36MMmbGvUgdciFW8KC6PwzdfRKnBQx50a7yeBsA%2FXipvUTpTiAjuwUbpNtcyOh5m2K770EtWzifK2KZU6U9F%2BezIREo%2FXngM56pYe5XcFLMD8URolwUM7%2B9WA0Vw5vgdyTsPoPIC7BQJvmzn3sOU9LjFzqzZsXZGqmpda3oUX8NJOJtDTfU%2BTUW76gu4WwFuMkOAfyB3Jj%2FON2gJxqoTr%2BSpz4O7O%2B%2BrRlwR6j8SYU8xmnTaAMCPLJ76bwzKU16gfmbcnyhChjoD6h6Bwzit39oWuMzy6KALI7%2Fnf4CW3I1gptq3kuTFuSdkL%2B5Qf%2B7zlsUi2SPKK%2FyX%2BkiegxK1%2FS0FS5BtzvxQClRJjWnDWYBHUkiUqiBcRLGTMDkGcftq1ejudN0NOX4N0OETfxr8ZPvzI3KlIl%2FTBoCFw1JuFVyo3wsxtdkpnbcmcRzKPRNDGXUG4E4oGYmTVNHFON9Qqi4OTIECMyZ%2BaYoEtY336fHNqJqTjzEk0WryJKMAmML4ODU5BftLdK5WPeB16GKDTTNLZ%2BoeyzvPoHNM%2FbDatJV7Zb%2F9Uh1dBLrrGTEmwczn6b0SS6uS7F5j%2FX61L9AAM9JQkmYhU%2FepJlQVsf4a77P1qZKi9akSM4wFtrMIratNAGOqUBo1yhfAAb%2B4MXu0fXkp5NmDhfVZUEvGyq0nqx6jvTKGVztRR1hPT0nFnPJbHLWwZwiExAlc6lxlXXISH0%2Fal%2Fc1%2BoE0S1Sg4HFg%2FwwLKIPdeNmX0SoOHajiNbM%2BNDAJBlzXe1QQpbys7ttK3qN6pHiHeOL3yKoigSdeb8TGIvsCwductD9vA3ETUuP4eSc2x2HHbp2Buioh%2BNOccHwzurshUZmhz7&X-Amz-Signature=a411213cf24a69bdcd2c13419c4c3579dcb48146e29329925481cae0c53fd4ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6IOVNLA%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043507Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCICy4%2BPUAemfK0Y8hBeo4K8UOSgjTN%2BmUDS%2FJTeKa%2FThSAiEA1vcoPmdyc8%2FY7zLy5lk7jR8QMcmFmNZ%2F%2BUVjex7NKDkqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNO9%2BOvmxyLVXJ8kGCrcA8Xboz4kZXVT4SarbCqCIqGgmVzq5Ev8Tgjl4CsTMu8fNjUW6YtNmze1lrz9VCf02TAv57FQ7QQMuTVxpgjm2vf7ymLcn82Zvr3KIEJf0LIUTEbRDb8bx%2B1fnL29yKBE3Nyjyv2FWey7UebkaRH8iZHJEH60OA%2BdO7mbBmeTVvul%2FzvMBq6Sgygn18TLZcpoYV2cGbQBAXJ5VmnFAB6lbIZH4UOwp2g%2FwvEeJfH4hNbjp7JO1bQ%2B93Rw3AQ6IzI9SOb3O4g8h0hFzv4c4MTC37ux0GLjIBTzqRyMnT9KEU7XV29GE%2F0Hw9cefPxN8%2BW2I69O59rNvDeseTYkvPSa0wLp%2BBN%2Fz4bjDHkY5AxHx6zvvnR2v%2F%2Fjlr2pkkYLHTWkkdY67BmTdHONjCATDFquLmomkffYRMPqMFscagZMCpIq2t3X1bHgL4q4wVorZEBI1heKvoP6QDNh9VFlYxuHy4Zz4%2FQMVi8TPk%2BD4iIYk4g7pLhWc3GnpIgmUq%2B0sGUWuokfXTMIeHjEi1NokAYUxY9SadMHQuKufiiXv4qX1dIhzGhIW78DOueBxeEF9zCggnNnegakCdk8tTbe6Rk2eCteYfDtOMWGbMR0QMAAjSExvIroYf9Wp0pDK1lDMOvatNAGOqUBD8bT2zTmWARUmgcwecTRxh8uunJPQP6iVax1%2BdJJWK16k7eCvAlppa%2FthMqHUbyQ95iqRiovzjrTiiwyZs2ESdT4HgCIO5yLaleIWuKoMB1L74ca6s0UUNYm4W9vY28ztxwknMFn5bJoKhH4hgzbG7rO9uKWd6ZZ3buXT1UJigfPVpDGFSL7uGblC%2FrzrtVSSA5Rqzj6Njx8f5yA7sVS4pCBBibL&X-Amz-Signature=1ad94e90b7b2d910160954ce99d740a5741e37e52b708d0ef4b2e839453c0f24&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XPDC7JGR%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIBf1qJca8iRB1vn4CjtYNfAfvPc%2FuXsVpF8WPcfOsTbmAiA%2FaAUqtX2Nc%2FHEsZFsh80SN%2BhotyAXNgw8I8u30sn%2FTCqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMZaeDGYHdxM5yRRShKtwDhURA%2BEQF0%2FXcbtrJ02cuv%2FpSgOKQ%2F5cjs%2Bbu%2BwACQr0uYz7A8z3x%2FdKHtgwCM3Ilqz52HClm68bPsV5m%2FU6KKT%2Bwo0HwFNfpXKnYVAEAq1oGqF9G7m4NGcDRerJ%2FsB%2Bj4nPSVVYJBg8FKsxSNSnXglP09kWoTk4xkvgXsCLgSf3hNSs2MBO1T8S4tbWfIA2rIOEq08PkCbUf%2BI3cOGteCQLOYR56Xuv%2BUiSouFNpl7iskuscSWbrcralVEp4ARhxF8JEBjN1h2Zg8SwPmlJyjyxv75%2FGLhzN9SMzq1011I%2B6i3AYcCuQHTp0zzPd0gdoUPrixic1Pq2pTuYz2X9P%2Bv71RMkhcZ22ESnRzUbi0x8pnX1%2FLCTZuo6bESVCb9fVW%2FyTxFmxz3En8Tv%2BPGFH6bAzYiRJEcYyyYCHgZmE0igkXf9Qny2pkzQM36zEGVVg%2FjrYe40%2B3CqldG8p4qEkUcS1wtd%2B9K7fEzXV9cAJ841GrO%2FMp6lM8e0pMDxdbEmjQ1%2Fr7GM%2Bam1W1gq6TKlhS1bx3ZUOGyEIe%2FNxJzyJcE5bqkvDu%2Fz7UHqjF3TgwJRrRKUOM2teCkpG%2By6Tws7wDhay0GlyLkbRGBDZSmgWAKKlHENjqY3Y0EwNv2ow3dq00AY6pgENnubuz2RR6nFANKJFsmoNaM69yHW4U1uLwruRzZKqbLb70pS1S8WXVRmB%2BkpEHt8qz7L7u%2BudDEbDZznxmCMRnXOENHARt9xVpPnIzQ4T%2FqXb4lqQUTKbWxi9cAH%2B2AuX8JaifeyQkmuaE5HYYH4WlS3ESo51U%2BLQde2nAi3agQMBRQ4OomKuO0Xjosojy3FKSCEqgpnxqmqlrI7UYHNnaS2xTHr8&X-Amz-Signature=a3547730767d8d59f78059d577e61f18e241ca4b1ae178893c2d74307acc1740&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S4RZVEVU%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIBzu1WFtpFFTEllz7ZhfIJ0Sz%2Bdl0oIX83Ls2qbBtcUMAiBvFruPRnM08c5FGjm44DnIhFa9VgbmCz0C4hUFTVgcXCqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMO3ojfNL6DKvdUNWcKtwDJ8k8qjgtT408UIrJOv%2BQxQeAuwFC1Rjtz0UJvto8gkcGUrzZZ2JflkQ0l12Mmb3rKlUWAlytxgMWIbHM9lHncXwXcXXOEfM6F70ee6G%2BfLUgbgDXfCb1S8EsSJ432avjHTuCwy0x6fEgSvOYnOcY6P84YgbWUT6cITu9ye%2B%2BcMR34T25E2bHghpBNV4zdLq1FhgcedOHChNv6OB1pQCpDezLyDJTZTDqn2gNiBdkXqk%2B5se%2FZ%2FmgH7mtPeuLy5Q8DhzNp5m0%2FhehcVPUhu4UMAnjoZviPuQ6mUNHVacA0giX8RqFbDZm49Qeg1W2O4%2B9Picy6XEnSPVu2d%2FfKjP%2BWN7o9jnVx%2BuRCfVfiRVOOzcvQbmkGmNwEBn607oWj59QFpUcsKVcMBasmtjmxqaApeRchBQjgk9%2FCycxW1Md7YKQs7r56uh%2BhAU%2Fi420YqhuZkqdVJ%2FhTi8blcFuFkIPbRVz3cATekeNx5PJ5G9oc3dKr8xJXIP4mtXN91KB%2Fldq0hk2s7NbJzHsb5q6EJqN%2BNfEaTjdb2CxBJb4UhjqEhG1CgKooOPeWpWt3gqnaKeH%2BN%2BnYiKJeg6CZsg4jTrD9RH%2B5aeTwrTvira4HgFooPONQ8w4XnaaiYs8MkMw8dq00AY6pgE5MbozX%2BxMuwdlX2qmrofglOktZCin29bZlcjZKELlOyb7by8yj8XCbi5v3JVm2MaBLXS96tAcJ47dyaYY8HaNKA9Se2EV8Nwv9sv9xveLAfbnNlYyiuHs%2Fj9VEQZdgJtNt1Jt1ZuK3iYtvKh870eDXa%2F9Jca%2BbEY77isCy0%2FZJAt201M6CZVkXp%2F3P1Vwg9atIwQNFA4WJ5wXCeREewDCc0dBrHTe&X-Amz-Signature=e9a413a2aa232aedc696c6592ff84a767decc79db6330545db697368606454b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UCYOFJAZ%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043512Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIFded3Na9NyGGGAw4h8tsGyb4svwEy7qqs8n0u9oToMlAiBOw0lx1rWGzdRmSJ28MErjdFy3MAhDLQMpVY%2BEsffu4CqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM9nisZ5PPyz6FOX6GKtwDdTQ5aYesHgVlsXjsyqUcEpx6TUeFH%2Bl4abNVHF7Iz0TtxEjC9Mpw%2BWvbW4Z3uERO5QCuLQltPnkEdFt%2FFGSEEk495GCaRKVxtznZ7LE40g90sQtaxw7pLJQ0ZAOx%2BFLv7PbMLIQRv58SvcsVoCzl1WDppqs7FrnVGFJw7orEHBZh%2BwdtjeA4ru13WOdPdM1zuVyCyq%2Brdy89aJ7gfJcheaEH%2Fk%2FWSWb%2FYDPFK8Yi5ZVw2I3285QOxNwO6jwXK3LLYvpx0KmLwPP7eyFVShNQDCUfRExuODfNNSriefVJfTyfFM2MEyluGgwiE1abRD1CaklAo3JHyU37dFkn46VkBqAS2qM4uK0Fb2ef7ENlDcGJdVaiLkvFTB6DruuDZ5mmGcdTxJUySxU1mLM50Zr0gY%2FxVCkuxBunRJ6kMvZrKTV%2FLUhhw1OAYJjAVhOjK1sO0myUf%2FBCtFdwoJ1UOEUjFcZfnPAYsO9Y5kxlRJ0AcmEDIvsXSvyjBsgxcU2bkghYXf1%2BrXxKWfyOIZydLD57%2FtZRIrlJyDBQYQo1smPoQmWRj89FvIcWaal38R4%2Fi5jLI8VFxBjKpyuQcUNup8PIaHSDKJYHaId1XovHUqhzrXcTBCUE6pqi5PmpN0kw99m00AY6pgHAyeHKrKf20S5Z%2BrqgM4U3qu%2BMqsixnh612ypZLMOeMHCLrCDKK31Xab%2FhtnXKRyvtbRubkoIe4zmEMF1FWQTxOq3g7WbhRjmGSs%2BtU2okpsRGjbzCWaaVWKui86RNTN%2BggsI478A0NiHPqUbakOny6bzReWZKLvUww0h75UXux%2B5Np%2BCvVa1J0sswyFkPwucgIFBP1M0mIRWjYytpkbV5Snkoy%2FlN&X-Amz-Signature=77b5897c69c955e68700bcb55e93f12e689091a773f00b9c3f02b1195070ecce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UEHK44ZW%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043516Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIHvkkpY82ySjqv4TaNgsiUSojWVbIKf4LN%2FIxRn2cgKPAiEAtdg%2B%2BXRlyJzXMLDw4l7dS91DMvwPm6ASMz3kfQMqPXMqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMsNqM3Z9dITF5q%2FtCrcA%2BaEkAwWFR6S11%2B%2FPcruZcHA2LFLs1PxwwreisYn4aZFUEHZZtm0x8kTeN4AhrO5%2BZmTpcMwGnbx0uO%2FQwb3lNECXmDsDz2lcD%2B%2BOU59RJGc1TzhN2x8HYJg%2FteLVUpon5LfSQuil8Um4DfQ%2FdQyDPDxOFlN7kDDchvkbb7e4Cu4laZl3fOtGFbCt7kT3lO8EK2bqgk4%2BbFBJhKAM7ooWnhE5pzldpEVaErGXUO%2BZPlbac%2BmgsM%2BmBnbvv3W5jpSVP6ggdr%2BmuSvXwvJ8h4RngYEXpBlS6mAQ26DQAH%2F0EMndxFINQJ0MGrDB3u4kgdXR9oN5Nf%2Bm7zgyQT3rIEQqQg0aCxamQxiUITTZtNLePoApigQthXhKSu1%2BotXHdoUQoHTo6H%2F9y83Rm8mTfTcQSIRHhge1VtEUgD%2BHQCMzwhgwpNT0MnajmoY7qfyJHMjkH6amlAMxrVXUQ8K4r22f9KqiKG2ZMhB%2FmTELd7aAtSo0RPTjUn%2BfOspu4K9sPLGBCGq%2B0YtruRuRjZBB%2FyA4VvaI%2BavdMQdicy64oxqEho81v5GgsBwL4gpVslcyj7k8nMPB8gd9J0RHowz0QGehS%2Fp2eezIVX56bYxQmd2mOi7Pv1cUE2oCFo%2BViUzMKPbtNAGOqUBz9l4kU%2FO%2FfFalOq%2Fo4Vsk0Yphyd2AbGkOrJ9TaNJ9treQ9XZ7ILj4giyhcfYjWjY8bZwnmKbc%2BA3yekFUeNsEMqAcUCy1RybwQ6vv1mjETD37%2F0GmZ1hXxwMVJWZn5r7ZBveMVuD11z%2Fluw88IPbDxF6gdW2lWjVQ9rXQ8veTOIBGxPrFFTdg5vUym7Z2tckRznzvdcOzJZEfoKDHWkGyy0ISJ9f&X-Amz-Signature=935b7a494f5b36447889c2a41ab758912d5d63d838025670b6e5dd499782a5ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666XXSYENV%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIH6OnslIXnqMMrNNdUWdGGk6lmS5p8l4m74%2BcQ7thAlOAiEAhtrkj5aNxGZhm5EionzyReejPxQ2qTVluLF51zsvaYwqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP1fnE7Dy03JZ5rG%2FircAzCcnIOpCyMDDzCVDGUNwhLeMh00%2BhMhHxT5S%2BeDPSdDJJ1L0smjqJG%2B12eCluLTrik0dBZsL1U8XD%2F%2FMeipDLpxc5Q9lZ8zEKC259NeUos2KHceL%2FyYsKo1sdgSbFwjC%2B1OLxUCsyWt3wqNJTst%2B6tmU1Et%2BSzGCmuJpTdjhgnmI1oKu0QGhWbldMxlBAFvFxlfh66xLINIJeZkkV4r8FC66rLpCtAfuKcsZ5A7OUc%2FawJM1FiDwSqOHk4w5uMkzWDgAwWyqpqS7dGwdlosSIl72o5H8QuNuf5X9bhvWLbpbKc0vwk4sG12klByyZd96vM08HGc0Qu3NQ%2BHjZIw%2BxpKhNIIQJWJ%2Fwg3%2BJ43BFS%2BKdivi2krsK1EYWJO4zXETAZnoWpOs3xzeHDxa%2Blz4hCqfsGY2vkUbM1Xm9%2B0GoDd%2BJF2A3ebry6Cp5aOuhW042oeZHCb2BD2p0xUU%2F%2Bb9OUzB9kUeARL4XbOA%2B0Nen8r9xwQ8ShHQNtui%2F%2B%2BWV042YPtvGYPrK%2FXYIXSnnRbIFFdqFIJ8pFrtmLvTQWRUNWB9IgXjXKlJX6WLiTRO9s9I1t8QCH0LI%2BbcJ9HxcHh%2FZIhpM86MVALKOjjZ6vFpSf9o1HcYHokTuikFgLdMODbtNAGOqUBdF7UoYwY3c7AmiCMuNH3hcG00MiEfm%2B57uXtXfIwJl1qcYJ9gaK%2FGzf3Q3EizcyDDT1LNiPv%2FeFr3P6KeLzJufXotQTOBuK8jhFnM0bV7wE5yL27QvfL9x077PB5PWh9DiCEWauAyaCsNx%2BjISij8Yp%2FhTb1z3BnoathE7GxZHP6EOj1pnksl9AAKcCHRW24EfkQQ3rozTYK1JsWjikyL6MobnpP&X-Amz-Signature=cd0efc29e47544746ce6de59e3d16c2c60ff8a7a22e2f206b762deb24a53ccb0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46663UWQHNH%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQD8BduE1Fc6rAEg4RUSgiYV13VNMpzZ2DM2i%2FpvZYGi%2FAIhANS3HOpp0JjfJvf0ncTRHJbwfvEvFavxnXTYEUyEYIwnKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwPmbbqWXtGTk9%2BHC0q3AP3tMiYUfoNIsJN6foQhbKs3hA7awpo0n9MyDrezmpQ11aPXrP1yglDqKgGtl8yAmsVLxN29DtpmTNht8mwL3yoeTOYPBnOypvmXka1Be4DXRw1LtPciGskwrHKNUAxHahZAZO9wb1aGaPD3fGEiXdC504EjGJm4lXLyykC%2FaE2sWojHwyr7146APkY8Q11pcg%2FC2%2BiwQtY3mhg0f2iS3hw9p%2FiFGnAV3H2nE85ufutRL9r7TYOd1p8uUgn11PQGD2eT6Z%2B7%2B0nSDHFwJ%2F23dpltM%2F8t75Ete4sAmIR6wdAtyY6wAZQhki5qbPL%2FGNZHZSIMJENrE3IeRDEdElEx%2F%2FAT5Z%2FrfRTYTcuEjT2b%2FpFG6tz%2F9a98SAgOvwJyCdlNrDB8wzB83BqOoFYDeRMga9o%2FCKofKhLRyx3DCI2OtHvCTB9e0D5JCYbFmSPMbtDBJ%2F%2FIVT62lm5cfaZgpsTIRNX151VCjpDT4K8J5dBSjGpr62w1a%2BikWS7aMb5bDU0uU%2F%2BrTKKwWweZwu%2Ft%2BLgObGGSUbAa72p2aDtclwZCCIZfHa0Dsf%2B3oZ%2BULUHjBYgvFRFjZw74m98UBPHYX%2BOyjo0RRZHjrPMt11E9E9g0s%2FsWPpOkgd%2FMo09YmmrlzCs2rTQBjqkAYqIKBKKU1fPHFH6tWoMvxcxqO6tvs6bi%2B8RA0hpTRIT1xqDbVUnaWMGaZChRBAdZtSPK7DsXiqN2BY1WsLXLykpK4meZ2vBVGFZMHL3zDGuqwy5JzQriuYsE%2BANFZ7BNd4IJ%2B8OFp%2F2h%2Fk4FuxwhJS0RSa1tmjGuD2SjX%2BwNzxtr4Ba5bCYM6jUrsLUJ53C3rzOImVOZiENsMGu92cDqB5K4bys&X-Amz-Signature=49d2c6df44b601823b3a7af0e35233ed33cb06748f4f2ac32f1aabea5ca3e828&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663ML277ZO%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043518Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIEJUjdunVUIBuU2RB6uD3n78enFOn8QfwdZQhqe2dcQoAiBL26kokq0rp7KD7VEPpOkUHMQ3fz8GsCGFeRpZM7UdnCqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYfSTuesW7T0lUl4kKtwD35vCyX6coWNU6Fv4CM5zPTPJZtysIcMgEjCbDgUZCIGT94HrcQLjL%2BjMDHItF%2BPK753zH3ZX%2BoY8cG40X4NRrx1QfpD6cFReimuXF40eDXbME7LQVQrmmuoXrissy%2Bnuic80oz%2FwZVsvYrKYLSv982svKGhVtf9FI0wHT%2BRpQEyt54ufb5ry%2FJrIAb9wLfKMzR6oJvT1%2F1aZacL1EbEkRf8gDcqviWmwNRWDGkWLZb56fFm1InTQrg1WpzKY8clJXCBUPT49YphTNzAm%2FOEhzw9BGZ%2FZys30X8k5aD6Y9XAyRXDKKt67JBFQqOmMCCQ1cHa98qBcnrHJEJJe9M7DHUVwX2BkO55o1VgMYcF7AekXztD7rgCVSqJHFR6hJK5YT2CtkAq1scs2naDp9GNlPZlmW6UTjtqoWhu%2B68TMQWZRbufPo%2FEfrTK9eZQ63hpP5Z%2FuyIzuzXivCcHUkB8zQNUaqYe%2Bg5j%2B0Hgjj96z72SxuXExRm7BsJf%2Ft7nxW1QUs%2F%2FXigVuJfoO%2FYnekuUmG8cILASEXu2eUXV41O59SS3vp%2B6%2B%2Bp0EFr2%2BNeAyRAIKBhiwWiMVci4MBTnqeA3rwSSf2I9Vnv9ee31SCeWotp%2BZG8wBUA5%2FnPO%2BbHswqtu00AY6pgE%2BXtuzmlrYblZaqkzTNwyGQCLnThSp3uSIQcc6V%2BsjdbB6CHECkCaA6U1nSRnKomFwoxShNBgvKq6aN3hgG6P%2B3m%2FrW0asHf7MS%2FK6Tl24i80UBnZMLNEwl%2B%2FY4XW4tPJSVF4jQUUZHcykvZPDkJSIdi%2FAIIhBswxuIAOmfcFa6jYfoNouZfybRDEMBSHGk360IPP75LxsIvHso3vO9eADLS4fiBYn&X-Amz-Signature=25379c5a4d1e1d0cdc64a646d551bfbc8da560bafedd8ba7998c892209260b5e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TGD7JL7I%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQCV9UFHbHsdYER4paDnGbcz7ooyKwx%2BgNcIoJCj3g9gsgIhAIUjQQzBBmFdIDT0veCMewWfxwMozaqruaOX17G0K0XVKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyQ8awDfxUw%2F7xAa%2BAq3ANTqdpxZMHeZuqYIiKY6bLA2ms4bOcvlFcRdYPMcX74yVUZ%2BxYu9zLOwrvq8ezydjBJLiiMS7dg60zRWESi1dH8pNairhhCPsLaAjKuUpqYnYZpeNkckVfksgvS0JpqUQiy4m7HcoHHHloe558kt93sQksLzbJqZ9RDVfjlEDHIpzEhG6y8I8cGel%2BIbd58Nq0kONcCkr9FcQyuf%2Fk%2BO2vZ%2FdZJ%2FISpObC3fxu3y8JprKORkpbRSJ2rwb2tyObUcKA1ajlGuxO%2BS5wfFYqzXKQfRHBhulm4o27p1hxoediCOKQUvk4H8B1FlGnCnIzfoSvqsBe%2F%2FaqTX9%2FYacTN%2BQ3VwkcIrBp0Zl1EYfVQbTqsNFmGrpSBElQk0SobufN9IUqEmr2d1PDIXSHDIYquV19mMgCDVxbE%2FYkGlL7czP6SBbipQWhmTlHB8V4sPB1dqXpGHmLXhlzeskuWJb2Zb72FtAKoymWcJ%2BSZ%2FkZ2QvrC%2FxfVWJ4HiZUJthr7zqXKrZm8A8JdjW4MSMf2A2W%2BvpDzOvqHZQw45fjN4BdFmCo4WvbJGIyGwcXJm15yJB8xzgJ2h76NzFFowgfQXoeuuQZ4NU87gNCblOGxwIhz3mJQONC%2FGn0Fysxpz65EljDb2rTQBjqkAZD%2FjAmmUlYFQzzQRKaUyEKJVefw2pBKT6sm6fpDPlWng7Xx%2B6WZREpbvJP002gxtdL0WNK3AoqsrOWU7jnwRcUY4pise%2BMcBJms6KlYD%2BDjDcViu4skvOrFbEU5v4Sdik72S%2Bh7gAd4iypFCAzrFqeHJFNBRIwFnu7oWdw9%2BMZ10L3Wj%2BkS0vPxtsGCX8WAN6fURcniV%2BJVZ3g5xKS96gGipiuh&X-Amz-Signature=4d2e817103ff28c247d12b3d7dd4d5ee7c26e943e45535299b6c562a9ef3df75&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466436ZHE3T%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043519Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQCBdaB4DFWQW5hWHwBs4GfW4jTreiP5%2FryKXQfpgZulMwIhAOpjFZJCYmpTQLqJdfU2y%2BEvqfkXApD6%2F1wnD6klMcKaKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyBBm5D%2B9%2FfO7iW454q3APGj9hH4Z70uk0wwrKQbfXWPTGQhJ7HUEZV8ufjy7xTT10gOB12PzGQUFABb%2Bgwp62TzrqK4uNGhbk8vWSuIR1%2BkjmqfH6IVk1AuwzpFogDkJw%2BAkUoTvRxLZ0f4j78C8b6UrjOrpWPLzKFAMViMYMOXgROB3ATz%2FbZ%2FRmEKR2L9r%2Ft%2FfCpP9jLyXbkgNWQXhEInsx7p5AoyNsP1wxXYAS1C7HF%2FOvOx5%2Bc4EHUXmXkhETyKAEqDPp38vf2urqCIsCSJWcZfUHn98rf82HyPoyPdrdtD2%2BNFG1UFT20cRtY6aLA8WdUqh%2Fv32io7CA7dRy6u6nxz4mhVu%2FKNCrvpct0%2FnSKWiy2mbB8pVDjn4bIqruq26B8Ky0bWlTHTP0KqTq8Nv6q06LCqHhXsrHrjGAJxMsWXMNs%2Fr04KpYszklTj4QPBy7I9sYE4iol7aXwM02mW62MAuiI8InYFWk%2Fub9PkRnthlRw5pHquQZrtsE3Jjm5KCQOk4FvzcBKRwge9pDCMLQbdvuOP72rHJ0v6sxvmmmL5Xfhr5mE8RyoCZvqX3j0plg4eudKonWKe7Izp%2Fcp4jjduqqH%2FOoaNa8ttqm3p%2Bo67oN3vbNge%2BYm9wedmJJPXD2j%2BhcUQjUI4DD52bTQBjqkAd5e6I71MVxl7u%2FB0XCYyv6Fuyr0vqWtu0W6Ez35lUUjZ5MXj8LouHPBj%2BzWZ2Y1%2BEorbe4MD0CKyOaXK4AvBl350EHdfMr4dgNyiDfEsLUxYNGUDxvnfdpCTwepo%2F8WZDvKYc4qtYWapc6cYyW8JxZXxmDe5twB9JZNMwWTrn0nGDAIxwzryDXSggPp%2BpiCvFemfz99bhBAH5dtvjY9TJSM%2FbLE&X-Amz-Signature=b8deb0a1b4bb83399e3899eb1e19c91caadbd28f9668ee679a433acacb6ff392&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

