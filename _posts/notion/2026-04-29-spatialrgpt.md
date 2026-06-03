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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XJCLCZI7%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051430Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIH7WL3dr%2Bm6yxcv3PUR1XtLEKPyps5PDurUMbkYajvGFAiEA2gzPuZ07ai1bSrA6SoX81lhvniRoFvIIYYvrxCFQqmUq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDC8BXnvNbjNcqRdV2CrcAzoY1qLYT573bYXjV8NSA%2BIChh1m6QD3OvjFRASFxoOapvJDUO1u5%2Fp%2FGf7W1oWjpbIxxqfecw7Kx%2BbGWLHdm3F1dRowuv%2FLvvh32WoaKG30F%2B8wyNkHgIgAyDBpb7H9GciuT%2BiG5Hp2G4y%2Bu%2B4W8OwFLnBhBdF68JlZG79t8cCyyxdRJTskWbGCdR%2BpNc4kfdFC86o5%2Fn3Kpk8X%2Fqq7Ev8FQ2xWbROKYUOK7Hnn4GJUexxoiVwFngvzVl383tdLONyrD1yk4t5NRNUDYerbrXVaGx2HSm9obI3xdtVGZzBeGsQrENqyZSkP1m7fIW7%2Fl0HSioYevbol1LddixmJSy9%2F6WI0qa%2FTr9cj5oLw4WV8UWkGazTYj0xoAlsM8o4Ji614PC8CCjUzk5QtPkdZ5pw7VgywfWPIDrjTZ5vGzVNolqGJHRs2ZHBkm9eymoDpDKEIayomKcpVi2%2FYQWSqNGaBfX7JEB3b9Qu0U%2BD18SGRYjybAj%2Be3dXVF6WiKotcIXa1LOXTe3q2aW0VaLA8pB1NCaB9Hj6OdO7Rez4Vmmd0p6bidBm%2FIPCilH46AqBI6sUE5GUUnNvqvJx8Y74cWnp%2FuZk78AzDJyk8c1SXuSVSlkX5RCyPbZDGIE9kMKfE%2FtAGOqUBz7lrOuTF9jAHhLpgb%2BVTt9CxAcXxnbo7lNy2Z10Of90cBnewQt0bRtDll0aK8SHrRd2%2Bm2ERB1mx0OWDxU6IIv0XTVNVs9uwiaVjDDOff28dJptEuqSKk4YGLPOm8XdNjZI0uOps2S7%2FV5QYuWRa2PPsWwAkY%2FCw1VnoJoX0unRxKZ4PkRT4xnUSAGKzlu7DltojSsowizEFBMrUnFbZ7sdhKsEV&X-Amz-Signature=c3f2cec00c63859bc5661406b8a1bdf8f3f79cd88059044fa1da57118afac9a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664QGOHDYM%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051434Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIAWpA%2FZW6djl9EjuxeIeaIDWvmU1jJtFGkYGixNo3YsdAiEAm5zfwjNb68D94NmVnwCu2ep%2FknW6RcZd5Y815nwvSYYq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDAGfLEXz8CuTLeTPISrcA0MQHG%2BazRncGBagwkx09BOLPsGWx0%2F4yUkYk0F7RrFHAY9dZww7bmdoDPKlTirsihqKs%2FiE869%2Fx1IsiCMwxaavECcEJlMhUVyBCp85fUbYPfhBmUmU1PUVtA1VRbjHR6AF1pp8Y448vfLA%2B4JX%2B%2B%2BWsMRLBkLKNRlBpqmRglC7u%2Fg0TbToPokJZ%2FeFt0gtifIBGesIVtSbZfiGEpL%2FmjChtzVDFEwtc5DKMVrNesRwdkJz7cD3lc%2BHlDuCzj9rcAwIQWGnRgh%2FYvpRSwbXjuBJVjtrqcA4eXMWS8aVrkQ3ggF%2Fz22uNdd3zw7116xEIg8xAChKyFtVYyruFc4xifKA9Zau3KGCtL4Ej6mpZ2dx1jijCYISqVWu%2FpRI19myjTpylwUNIWIqq1w82HRHdSpzcttaLsigWUjRb52C1rwahXakYSlfR1a%2BEG7iLXwybDt256gOvNOvgmEaEQvT5%2FXb0VjOTWWQ9T3QZ8yd2XicTATcbPODuvUQYBjNn3CpcnjNCClKiRLcdOh18nFymF%2FYNFAlAhq%2Bxh%2F0rpvQFbvSHqErtUQvzzDrPfZWRTX8aTgYgf%2FzSe6dNUMHHvwFHFVvRlEGoLHi1deNUgclXb3Q591Q0gBbTCWTk4LIMP7D%2FtAGOqUBiX874WFeB8Sk3tNs%2Fz1kLbs6DaCiEUBFFeah68iKpQaDFO2knIhSmuCnwKKA5e2hxg6h3Ss8heS1KECjq876ES14FkiCPeVPm0ho8SReZI3r%2Fcc6QboDBhl8aVqANLZT0StlN28JA%2FPl3tL3z%2BDu%2Be0JoRfWpejtOpqoUlgTfHu87NOaRQkkLi5GNYLU51vbQHKYEeNjrVjvSBjoqHAqX4Lf%2BuFP&X-Amz-Signature=6a333b219646afed45abefc5b7050fc655e2c690d3ed1ad0113d38ca630d95c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666VB3TTCL%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051437Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQDODHjABP2fFq5sViHq%2Fj6uaFe0F5DZIjSP%2FCMjQpOJoAIhAKljdYB5DaVH%2FgZXv51%2BN4ukO2z4erbw%2FJyUgLDG8kQZKv8DCDUQABoMNjM3NDIzMTgzODA1Igya%2BVFVhXhycDiU0hAq3ANJbcxz1HkV1p7IfNzqpqIMAZjXXn8%2Bw34xhvj%2B6K6D8R%2BVLjltZxhkNvCph7dFlFuRBgFkrLaSNpIlwhXkzqgl56diYphGQS1roKdar%2BD7DTXcCmYUCJW8Rb5AVYA1OPaliU6gJ9gNa%2BfWEdnHXc2IBUFyZ2ltDdfRPnZiICSyUXMHqWDuj9b%2F3OyQaVe3X0gk9SK%2Ff%2FI%2Byyqx6UlrH3odrrjCoWdl0gW%2BrEqHEJ63WxjUIWzQxooXpL9NaEM7vZAoLXtdK2wWnLsXIz24fogShGnwxVN1I4e8i9yG3J0ZTltwtE%2FpGXVO7hmeqp18ScxRUwTP7Zo4DLU5yIsk00tXkrQM9WpUAxjXC%2BL6Zg9i0GyI7DlNJ%2F0Guhhwa8N0n8GMC7aJMKdSl3JN3o9JNOeSbTwVhLKCb1pfJv1f8dBd6eBmrlYAICyztEJbVYA5NVZaDBfHndfiRZtCgFDMfgytyI49KmkTx2CDkbIg1cBgvH9ZUZR5daGnCz7mxwX3OvtBDgpbNdN6T2v2gyZTib3y2udG%2BLxsSGbJPGDbxjZgSXbaCYeQYCJRjZVgACpXw8vQP%2Fk9r9WY1Tdwv3Sh4eXlFy23Es5bJDS2UypwOqWgm%2BHesnoZ2S%2Frqll2AjCnxP7QBjqkAYM2MIdK6R%2F7lIa7kbY18F58x5zgKKZjjeT9L41s0Bohfnm%2BRah4tdFmC5ax%2FgDRMzP66BsX2qTpGAGyBblQI22Rucv3NiZXHNZDKs5aq%2BK0LNGCmZiR6X%2BziF3TtxnT%2FWg5LdfkBfUS9aDuEPMKH1VcRwbPgJmRqNoi2ZZqalWDHvULnqovzYRFioTIKqTH4G2O116zps%2BBZi8HP8E3Pzm3bbkH&X-Amz-Signature=e38b272a39209c0040e25017270bde97c675c423020a138f9fa1db19354b5831&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663AGWIDSU%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051438Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCki7K%2FVCxHpcHJlKaR36zXStXH1H%2BI9UmRgRZ5l16kvgIgBAOKEf%2BRRu7%2FG9GRZ%2BK8AzZoEWpM8ym6eeA%2BWAhRU4sq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDNKehM%2FBI6xPH51kryrcA1w5uSeKDZhXnejwZxvNjEcSfjZdw4Rt5JiFPDad7NdiQWVGyxcDzZ5lQLVtDELJMBc6%2FI2iDynUjl1dsZLTN6UNYXxaNFxQCbuP4PtHJrNANg2XqW79tPVgdFwE5C04P4VF0ge8uyQjjesropG7gAyPgTlGdWbkzncb02hou0CupAb2ZDPmsuCC7LeA4Phax0NX7mRIRgTpO5DZteUWXQFCce9EexOdEGSqdEaFK%2BTVOzBWJYJwv%2FhZ5OZhG5ucQ0YdTEZgYYjIjjuTKuU47HCuhDdfJXLcwbBb0AJcyvkHe27pXA5Rs4cYyJdGWHydXGK8oaN3kkiwCUH%2FmXPfqFZtN0%2F7fY88UwMRTkkf%2F0xJYr5WhrlsXJXYx%2BtlkU%2BovkPujpV0ucW4TBDOkYr7eOsRqxCfRrbVDk28SdOl8D%2BpS0p4SM9%2Fi65Jv2ahBtXGkzeTY0GUNMGHnv7SN%2BL0Gi2%2B4kz%2BbaGEcfVBmV3oarsZDE1W9uv9skkKkp%2FkUqcv4jK0Im%2Fg0XcdQfAZ7o%2FfBgpJ37muoEaqIDBsAVw14qt9eEb2z6A9ldqNPEhGxNs1DpXl3tQ25r2lI2MbnpCZnOLkB5%2BrtNIYvbRx7WSdMaXRzRSwFAxR2QOIMpesMOvD%2FtAGOqUBPuGq40KBTyiUveH2UsneLNuurDHY9bQ5fg5GtiC9CmTzeJ8Zx%2FMlFz1TNop3EJJN86gwIeBRcWsLXbv1Ibk9uH2Tg%2BZDjopR5umf%2BAtPfEFq9sdFmq%2F%2B5EgKwB91Odat1ALAsiUBA8OYqVmTP%2FBpFVzVqbva1OFahaZeGov%2F0vE6XUzZIGaE7WuUUN6ml3X9TDOf2qbWv7pEQ0R%2FjSkscbfLZuel&X-Amz-Signature=a5f73ceeafcfc2b5fe03eb6f71f3d6a805e2fad7e299ee66c8b751fcba96867d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UBEJJKDE%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051441Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIFeFn1JSpck9NQD1r232MT9hDJ6R17wfkoyfnmropX%2FcAiEArAjCLvB5ClSO%2Beeje5Hf3VWe6iZYv%2BadH7czL%2FOX80Yq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDE6XfaA7eIC7rg1ncircA4JTX99zXGfvU%2FE9cOcw7kztrZQ%2FaMnRTw9cnflznlyj1IkclPTSVJgiG2xUwan0%2FgjTbP5kl0t3Un9doiWkV6Z%2BU50WAmy15MEqNAj1v2DZXPNfgg0GJKFR6dJ1I%2BoASzfANpLoOuBxUsaSc5h%2BNlMDpOV3ScjE%2BOMAtrrf0lzhpmZbUkqqIjX3%2BzYvy3cuSJ3c7tGEw67%2BONBSTTMOmDuzFISiTaHK85ZDwdryR0AgH%2BHjYydOQKrQw2QwGl6DC1n%2Bas1xQoSAu9T2mn76k%2Fx6faASNRvK2qY3YZqTyGb1w1z0LtJEswC4R4O6USUnT4Bua87sQH2oWzEpZ4fWfUn2OvcudqmV3xH4GoRyQijIq2ec1NDDRHHkjKN3stdDxoQeGKyZ8k7iADQ%2B7Z3pLStW2NmEj4vugTbVNsiF9gxE%2Bc7z2xiAO0a5d32CPXK1M8eNfT6kdvfeYJVIF45xjV1iWuBymB8%2FF19i%2F3ZynCCd7mKkE2hI94E9w3ITiV69CrAaN1lLEhIkELS8LC5PUkY2UT7o8XffrkYPJlOeXAcZiGLxKIRgir6bUKbikcVGAisCLoAsjHWcJGrYWjCaSfrO%2Bzquv%2B2Q9AV1T3qXuYu6f7LXFIbBASEvFqnfMJHD%2FtAGOqUBirIIuxG1DpsTgAHcFDZezRvgG8f0enWBrDw%2BJAlg1Bktfk%2Fi%2FvDjCjvqGj0ksYD3xtlW9mOyF%2BR%2FKW%2FMwx%2FvaF69R5GDJt6zy6VLjYhbUvs5S7ZmPGpCZdumBbNQIUBsiHLAqyuNYHZq9LuwvYobtuUZNtya3Nq%2FbO6QIyFsWu%2Fb9Uk12eofsBzcPpiDjwIcoEmTckHOTehxQqM5ber9bQEe0C1w&X-Amz-Signature=02b80884dbd6f56167eea385c11fe12d8f3a4be19794db1de13a490cd82ca699&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RWXVF76K%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIGeI0W4gyZrUF4BI1vo17arQs2NlffdfMTkB%2Bh8KkaKbAiEAl82tYykQpUPTCaNPQlvTxZ4jkPOxj5s6bHIMXLzfYtIq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDH3T6vhTsG%2BdrsUjMSrcAx1MDId%2BWecqRg%2BAlGLHbTY%2F5o5MrqPRNb5gngGgY%2BZ5t%2FDGsMZFMQcRHS4xbrk3L5XhU%2BUsnnXL7IaRwvjAvju79vvNmRV%2BCPxP5XBcwrx0NW0tldnExnS%2FgVVsfyGNoueNt2wJcbE3Dbs4ITAC4py39j2ZI0S0TP6Tz%2FoduN02Y58hauiU0%2Fbj41tmwnS2CEEgSNJN2FivLxxzUld3w7VS9X3WQR2wokhMx%2B%2FfRnU9pm0dlq9%2FmBNrB%2F1Mnc5a1YQF5PGydq9kXh7doJege3v3YxhfAjOhHulpfwzjZl3ba3npzCRzuZhMGT8dhC7xEoLWXSAqm206LDq3ZObv36EJEqlo5%2BxVHwcCh8dl%2FmXa57TWLXKoI5EqeG6F56RuNgIzy%2FTwzAHQfgM%2BBMeGunt9PWlZzisXSbC6d2tgUNXJO6A2hGsmr9wJ1DN4Eg4Jmmzp0eNbpNas6txiPHlC9dTHh3PHBPRK92P0xfqmQhsLDpva7YTczILzPZdG%2B96TUN4Lxjntss%2Fl8XQb91BvdTqv5kEs7zSWP0hjf0OBCq%2FIZYO29KO3pPhENp%2FquTtqTEQ3%2FCLRTpux19QkA5ppH3gaBVFR8nfqo7D9tF%2FNRjxmcNHtiaVpCQtqgMS%2BMKXD%2FtAGOqUBZgj2aJXAm2fu3gR1NSMYeFYRJlkP8d5bLzNk8dE7ApZzztmpf7d6DLHIIdMZZl%2BcCFHiS2ZVhFPtf4LvuB19ll5f0gpNYy8AAGh0LBtitZ7zOaXNHMHDqUun8WLtPK8clxOofnzxksa42C6Qk517pCf9r4Eh4Nb5lKg59%2FEUslAnwqqvERcI0HQm4pY5%2Fj%2B2GBMlIIXAtvMxGJd9JXqxSgVvn1Gi&X-Amz-Signature=8a87cd87123d0ae003b7562acbed70f1171b041dc824d659de8e63315d56e33f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZEQJA2K6%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQDUP1OcKHzK2OL%2BbTGSbGgzcSWsXCa0H7%2BHXXdo%2B0HELQIgaOwrS3LZgJ1nY%2FjBPxg%2FoO%2BWh9%2FyMyyLkzb1N61OXXgq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDAf4pfBkzfoakf%2B2VSrcA7vbPk0i5bRHQj0MLw1yQhIwz6xr2JmvN%2BejTF0%2FyaLW9E9eIRNoEkkNRFhK9DcKZ3oD3GQw7Ew5O3oxolpNcJU1HhZWxdEhjpZfSoujSdjV1HPowHTDlj%2BgkycapbgGYPcaH3peSb1M01egxjHi590TmDjvJbJDzC0r7bBIQ7eeYEuPCmUnnJlNEhjG2iaSDpWomURRFvepGZWD%2Fx0Msu9i%2B8XbpRoJNKz0cQLCjNRkZefH9bF%2B2C2kcu16beh%2FJ%2BCQocrPIaw47e609HGPMmyigcQfM5dv5%2Fmo2s8%2FIzHdKcY0mM6HFT6r2dz86aTyEOFkRQp%2FpNExxCLE0Q9etlwvSxGnmJJbLZ9s6XP3WWW2oALp7VvjnlA6M4f5OL9C2DMwRgJz7aXOXjr9FYgWNfc7ZVZD20FRePFYQBPC2iIv91jxUOJS14rWy%2BbStnszT1LMJ%2F9bq%2BgVKWn4KRW9y4bBOXqtVrkTCja9KF45qacwGsnRPS41xeD4g3VqLzT%2FASqmoq7T8pY3T0qZqc69xjixAuNVvoWa1FTw3IOOEjJ3G1DkhPORo4hUDmH16psfZz5eDG8k5zuiU8Ur9T%2B6KARBiAo%2FNyghqIbIBGfUleQXEuJ5bMNiGirbB09FMJrE%2FtAGOqUB2%2B12HKQcl4fTTxeaFwZ9vNytsevNStTLovooOxzBqLCxL%2FybcGNgvfSNuM8870zgbiAZaRzjdiyTw6%2B%2FEGb%2FOyiIwPc0Vnkhx8zVDoLNXjmSfEw%2B5KCNIZZI6EE30sQK5TFyPVv7zt3FF0JHrNakdkpszQ0k9V1GipMRFmcnMBuZGKuqS2%2FsziVo4VQ0gXJnGWDQk3dUm9ttWVXgdeoWaF9o6YxS&X-Amz-Signature=34716728cec9298cc66cf5ae9f2bd24b0adb424e209dd3344c404efd79540c09&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665LRRFRGL%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051443Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQCSo8ncnV2jevVugEKOsUWJtsW4Oz8pHYrAfjoALYv71AIgDOJ%2F5CA%2BSZzlqh%2BfFOvDscFyMINomW9vIrp4wqTEkwgq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDM%2BtF5UBZmhol1KPwCrcAzpnilThoaHIrJioiM%2By8HfOBE0UGMtbXECbrgZtQNNNu%2BJ9Fa9Lzc8ogbV%2BDOeXy8MGb91Ls44MHNHKMAI1AeVGmHv%2Fezf4CUaGdDmtlY17sP6aaGbKSTKMCXLqVsAXTUt6Y1V6sH8WxLUB88bsSnq25zabMx8dDmP6NQTRaHGwVFIFpOQ6I7rwkTyCLRy9FBwqx52KQt523mOYgCDhAvCyXbXqyuhmrEzdJ%2F98WDP0J4sK1PTxkAqNWsSSJ8oXNXTqFllG6cUDZ8u4l1%2Fk%2BLEPr36moyvwbGlaFmOKfZzFn2I68ZpLY7PEwxzp8OTsjerwMFMQpAmv2jJxYlA8qwJvuprpCBojK7iyKH31T8hdxYj0%2BzcxjzaNkc5XTzOEYsAgArQTlDGuF0DFPnvNoNIN0zE5c38kzmHGPemyNo%2BP3M9a%2B2pOOY%2FZJUp0UA7A9859FJHDibqNAqANvAKnAK0iMObEtjZ2FzXMFcsGZ5lETTXNWJnKQp2q6VN16yQjdVeyGwwepTULEgvAlF775MTwdJkxdGjPxAmMzzMrEuOpcX9DD6ygkKrkMrOY0UHqYnCbve%2FEv15PYXNFr4NWmhVWCxroKBRb%2Fzf5pduMhWwwPunoXbyWtX%2BDC2nPMNrD%2FtAGOqUBD8Cb981DOQWFFtliJ%2FhaJHwMWo5GttyOJUaj7Yhaek1lpS8MixdYt2sGE%2BAkvcFxwdAdvhjQkQ7eUa%2FNM6Gqz2tG1Ukmv5bleel7lDTpOz%2FLycLzEDyZM%2BwuzmwobGrOzwW6Y%2F5KPDlheQCuA%2BAqQihhQJGWyZ%2BCr4AiSqj2qM10WqLTgXKvSWoWWkxOUJFHYYeMWgo5yfpacLNL%2FU5MQmbG5UV8&X-Amz-Signature=a2140f4b7610753cdf5c1bc809d3e1903c750ad93005e11a5a66d4a1fcfcc498&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XVWATIML%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQDlXQYq40kmf%2Bmg0YkWtTsTcMKCkHYi%2FyIrEpX%2BCZiiWAIgfvR%2Fl3vwRt5HU9oT7C5Y%2FpS5Fme%2B4Si2meQEckdlrBQq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDOCFrhCBsTRk80pGzSrcA6mdwA%2B2RsVzWu46vRxgXiTw86ZWufIkQ13NakG2yV1cYgJ8jvVOpY84V0%2B8kZRVkTr8UL4wmM%2Blqok8EV%2BoKZiL2o%2FTNzT1ef6e%2BJwPZ5PpvpZdRppHiaGxz33DZTrgTeRFwZjRPvnCEtT%2BDXFFpRqX2Hr5zcBWsccKsA8zhRch4fi4UNWCyA08RfKBTRzHZCuWMfTARNhXSKeK4RsgMgYzCZp1dddcwdfmx3mPXW4Q0MSmNSL%2FOHK2nmmADNDo2OB7LTfbNs44VK44N4ZER7ZPRJU0XcSC4DlfbeuaBlWXXd2V0DT1p9NkEfJL%2FIL%2FehoFzTuH1LEVi5lBBRvQay9ENmdYzE71HxWFHaPtxGQo1LngCw8zkVMkXparm9soERgtfGT6DCInTShsnnU3fdeIYE2fozwfZmtpZouJ9foVHebAGzqh4fqFN2xRGhk%2BN%2FH5HWRqgjXaed9kwTq5cMceBGNoqypqI5BVKjJq9z8qY%2Fj49wa4zP2bugaMgV3I3HY1TnO1PAD8zzFSJRRlIlmBXfC%2FbdtS8yRIHSzIHGZoj9slPP3nTab4lxA92sv5fg2RCmUoB%2BWfeU45yIZ1kFM8%2BrKvkMjMxlHl69jkSJaPJM43MZY6qpc%2BgAQ2MIrE%2FtAGOqUBPh1YrMw01SNImqTTPt%2FccjM3DLIyu9FPjnTBRxasrlvrnf0U8EIWXA%2BjDPANtua717D4T3mhKR0mMvMLWqFuSlNYuddLEre%2B1e3%2FiIC5mcCC6qm4nFn4Tjo%2FzMGZaeOzMEgB2bxiHE785ryrDcbLZzG%2B2oloUDhMFmYofTX%2BlNXmvYcYbJSwwdSszDtEYw70R4UQo9fL7R3OzXnlu3wt3UaVHsNH&X-Amz-Signature=c4d517b54911cdcf126620946328fcb517cde05c302e9bdb2c58f5f8ce939c68&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XAMA25VP%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJHMEUCIQDA%2Bu4AzRNQc3Mw7kqlTC1MxuaGTamg9ggviJTCzAJaRgIgZXVLD7DneOqSm0Ksp%2BxuB8Y9d7QFo10uXZnp4ifof%2Fgq%2FwMINRAAGgw2Mzc0MjMxODM4MDUiDHHoQqklNuhkOARIxSrcAzCdNj5chPUkQC1WMDey3evw5Sj3SygokHmONzq%2B8%2BIL841oDOl8y67d7yAA%2FbQLGorCsYc%2Fmryf%2BXu7epZez%2Fe6yZcxAC0Gm%2F1LcslSuyx0y0YiNfF21VsRqZ8sW%2BT4O1G4PRKVm9Rc1wzEYCkR0ViuxjaquYhiqHYPYxxf%2FockkHY7mGXtdvSiF2YqjpLglvT1pyQVXzSyg5%2F%2FNkz%2BxfjlZL4fknCAMbMHxUeNxMNQgSp9MhR5kS6H2JNhebo8REoGwrPPPHD1bHmqmJVFFR%2F8A9EnLVa2x0mH8pYZDf%2B52H6Fl0DjGYC3n8dRY9T9jr2t37L22XTQiWF9scICrygIu0te8gQhHzq28MTHp1iX4VVrocjmL%2BtJlB3OKh3DEW6z8aAbvj1Y4B81Uxse2HMn%2FK0LJyM3toT85mMh7VKnjURaM7aau7H7RxteGx3AjsuYgYFlne6pNpPUJSAK8fnOKZF69aRYOWZqtORmyWpIi1IqUKpoVhP7bCIvC7opolFIY7vEcZf6BWQ6HvOJeCQ4tRVsx0RODxmKawiwoXfieI3ycZtGoQplxhhIKyQ4soYgKm2jeK1wpOT%2B4dWFcBYWfXx3gi3iIyFw7IByJiHUcfewpJwj1uKqfvKnMKPD%2FtAGOqUBJLGE7RZFsqQ33LEgKRLuzYKzRv3ACJOVi1bjM6rSKvbIRPuxvOIz%2BPoVWFpKPBwOa%2BjF0QGBDT3RCs3PYvkfCZedqi%2F72Sh8O%2BpJ8x3ZjLPSmo19zAcZQGHGeH2Zk9pUG5iR1DozYzcIB7sa3Rb1y%2FGLEwECr1I%2FutZRU5DY8YL73UX6EZ8EVdKEpuS2RYmwcNG4JAfhl7rpOizplDEGQmCRWrtr&X-Amz-Signature=0104eb9a7feed5b8c4dcfa6e9ae98d89f5a671406783ddf15a25ab60cbfe7382&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZV4KMVT3%2F20260603%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260603T051444Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLXdlc3QtMiJIMEYCIQDpUjnKo34D43SCpzhBNUoCExluiXlWt%2BnoSuO0nAcNeQIhANOpop6K5LU3lYlWlrK9JqG7C7D%2FTJ3o%2BqFV3Of8DUJKKv8DCDUQABoMNjM3NDIzMTgzODA1Igx3l1m7rYvztNjmuJYq3AMG0c8eRJ%2ByLr4OLqd6xTR%2BzA9qkNzyYCqHBJ58xcOMWSZwoyc3fXLetsJ%2B7WMQMo9lxgI38HoSiTi8%2BQuIojf7ixiHgr3zIufblEUl9%2BF9xR3IwCZeoUERQYDPHf6Wtz9WLKNGFfZkfzUp38ZBiyHOyrUBoJUT44hXRtkt2oS4d9BoKG%2BAFSMqrWY98c8hbUuooDtVwHRzIQqLchgI%2BuewPf8hnS9c4%2FfRywFXeeJOQ4AYX58a14AgOt4GgJqF0DGK3wV8bu7VQodMsjwK7h75khZDBLplw%2BY%2BvKvqDfhatt7jpI%2BF6E%2BxGYqhclZxC4N2%2Bd%2F3quswdogcEqFZHUIxD3uxVImV5B1jNfbCBkyOUpqL6MUsyV0ALI5tQgBJvMVSKQ6%2BWY%2BZvGLQ5rIcblFOFQRWcRfJ9U%2BFo0Nkol3HaVf96mQoZL8Y%2FLBwwrRW7J1%2FXNAu1OlPoQLvqnt7AXSdKA%2FvpENYNC%2FRk4tXumhgQ9NBgJ1pb6c4Y7y0GDC2Dcx1ZJ8PRiwO1%2FJvE27Xy6RftW6Y%2BdtdU5cYBA70Dc3uVKlLxmkWjJSvtnhqtr7Z7UzOAt02YWtAi5i%2BTCpGcYmTcBlDGdpyuZ1M42KaN66p7lr8zEXZI1O%2Fs2rHezCNxf7QBjqkASqRSoj%2B3Nea7%2F%2B7qPpMOlAHQzay5Q93Hd0VrR32EmGjpshf9s8KVXWaGlogXkknxDxOl9JIJzmwn%2F95DVEuPfksN1IAq4Y6zpNssv8ghdm%2Bqf9D%2ByNnH0Mb%2FkhOdDiH8WqQurZuPLMg6t9PE7cwZtHvC7R68hhwUJax6QBbHiwUhnafIyjFEFIsVPaAf7UIokwfZN16iNs4avLeCgQeX94LEN7t&X-Amz-Signature=69d7326300cb5d105c5bb796af3eb7a6824b33dcf73d91d9211a92cbcce9fd89&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

