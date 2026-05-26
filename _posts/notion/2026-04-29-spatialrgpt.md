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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V2DPOZXH%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043327Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD4feUgZ0j0pLNu4X0R3uJnn619O7IfMnQRw5anlNcx5wIgFwpJTmlH8EJycfyIfFvRO3egx%2BToYITq4bIkKA3I1Sgq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDDS%2Frpl85f02WlaPqyrcA37CBO4Lts7yK3zS1zpmSo%2BejqHDgPMPrVpFa8vmf9oJWRhf6K7MgCar7Di4hR1SuvOm1mSucvh%2B%2FcI%2FYCo3g9HeLcEFy%2FJDMudA%2BEx3SuhQ9kGGVHdlvtown%2FVlwLSScCcqNT2BBaCAiWv6TbJudkm2xhivgOLXcHYFZqiRdibfX6MLIm%2FWKtHDsr%2Fh1DGcwgl3u6O6N3SjiuseNtb%2BPad%2BTIGOAWvXXVelO8sYPhZmFiSn0QDY%2BjolcejG9TaLEn6%2FU%2FPB8JsdZ9XGNLL3Flawi3y7AwIBQmAWZ0sX4r5t4XElr56EKY4L31cnlpqjGxBjwlAu7HqAoWCiyD3rWnUYZGLc%2Bh%2FfC7zmcg%2FF38I%2FN02Hm2qxak4Wli2l4liyWgmQj7yze8n7Ofe6mpfba0BjxYgDIkL36Tt8vOXjq4TXig5U4UWss7seEmRjW%2Bf%2B6BJqprV%2B7RMP%2B5qcWg9mKbkPIoibT1K1sEeOHYFYC8uZTkAJcHqfYmSTQ5s1ySm50SDd1U6EeH0f8Wkp85spiCgoZgHojc0Ww5oHuU3qo%2Bsn8zMF8egYziS42vR7EE9V78me9Pxiv9ZP3%2BJkOvsRNtVz0E8f3axBEc4umYrGMl26eRJYPUctHp5kaQKRMOD409AGOqUBcxp3RXhb41iF3gcVjvad%2BlcwtptZfqyl1F6%2FSqdzUBG0E1jsBxVDxvjGtsKgXq3wGzc4elNoS4OpBZ15x1cg0fhx1ibiTnhBxU2zE8Jd3i0gMOVa2HJFWHeDvhMo%2BQl%2BMDjHfg5uV2uPxWbV7KXGjGTWRFRAFLkHIhMQwcOldEK7Mtp4%2Fuh5bVP%2B1%2Fq1dqG5mwqsGkA7WfCnqod4xvpMr%2BifpxYv&X-Amz-Signature=649e09aadb047ebd2fbfbd3ddd7eaeb9457bd0901962951f1d113b8c71951820&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YSHPK3F6%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043331Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGtTm4OGfORjq0LIKttGBbqqK%2BMbialeLwEuy99G6%2FYMAiBu3q5Ahbf6JzeGVKz8WKSGitlSiHWAGbkxep9Ug7fiayr%2FAwh0EAAaDDYzNzQyMzE4MzgwNSIMH%2FGZ2nJddeOCvc9jKtwDoSTfdami4BW%2B1f9Z7zyFknB3jAQhMSRKmA%2BvPbFw8umqWHL5djMgH7lJSriMRJsepsrMRU%2BDOea9A%2Bx0C4vYZucmmO5FSJfP2DuxsUQg1sQY1L2gUWqYTIw6W5y7%2F5Hvso8kO%2B8qa5Lr2mI2YVsptqprNwfYOhglO4ZnVearLdt3XmMtzJ6HDbwde35YIsInn8oFFIjlU0ixycwPgKQnpjMfgxpLvLLyxloIhFYjQ3uby%2BZ2F%2BvSa2isW4LPxaZrlCaE7pzZwClYqwPRcnG8tpNdMhwv2%2FMoNDKvoLAqV%2FZzt2k5lXmIjxoGTQDIynloRvnc1ZlsFwlVdOnVbBUTvP4jHuGvsnpb94YaNLg%2BJ21xkYG7Q2TNwb%2FYNEZoSRyjS5woUd46PXln4tjtYW1iD7xx7XXqrO3RhHkWWLFSyA9vsGigvSWwGQQZj7XyCKomxW5%2BPoz5hVJU3voX5Vo4qqffZqAqeTGd64YRXYOW0UapMxqnoV0uiqmRksigvLMvk%2F1DiJUgu6OwKdHIYW%2FnBRWx0y9EgJVvKjKEMpWEe4nFJS6RZxsApXwVoPZUzoztFE%2B3z9YdJzZ6KJSVjyBDSZUus6r2siE9WuwrWcQABY%2F9%2Bf%2FmBcnx2FINGbYw15vU0AY6pgGvHuJp0IPyHTOm4aDDQBc7SjiV%2FVUHS1qT3dB%2FihzR3yV0yxaf%2BwfWmqk8yea%2FNtshSQHUxabM94lvtRgWvCdJ0YoqdrgTVT1zE7vDI4on2S0vjXVS9bkgzKf%2FiXCYXo7gtwklnVB7ZDJYL7t99a9%2BKr%2FT%2BRipk%2Ff9Am29EcONPNUMrI2COYV1W0nYcn1afCIPPjOogyOGwehiqsmYsUF15PwsmAvB&X-Amz-Signature=81ff1b1727f83f26e3de381877762df7386c86ac71d25c2bf5937eab30f659e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SC7MPYLO%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043332Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBwzHLHrxdR52LmbLrQYAcMJcoIcFS3PjIK%2BwTvPP6XhAiEA1h9%2F1mJA18Y14Ep9DzTafSMmSjDV3blnIN7DtqD59D8q%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDAqt37PJ1LGVozLNJircA1awWFXvSccUmmreyyvfQseRnMFjd3%2F%2FBVt1vCAs%2FaLGjzwHMjKnPpB11cqKAVMkyWJxWhoEjepGyp7MzfIJl6gO7YpmTRZUi8%2BhB133lX3lh%2FqMwb5gkwRyCI3tEjtS1qGJncC%2Fskb6f1%2FoGhfNSWgWi1mvVPOGDeA6NvwEG%2B6LN5yYl%2FPr8B%2FcggJnaDGyCP1Z5JZTnGjUBFrmjWoE3hBzfUQov3hwa6PL5mmncoyZR5W1FcF4q9hWSPVBPfSv7vKBp4xbHje4qQ48ZZs4rsAnJsNtGMUDxMmxOyAiKg3I651do1J4RsCr1boS7JuwXN9h2sl3MI3u6WoRTbnGDfB6XzS%2FR9D0R5EUrbugxHbs1DXiEIKg4LCc1whmu8W%2BVTsoDl9p2VrPqyX5vE8apKQ7MuwFvi%2FXYVkxyhm3KZqEvQVzgfZiHZQcBl7weOYoLpPkuJKRUaed191UKK5nhRJ2hTsXIGiYKsiXavOU8S9iDwqN3jLCDU2XBTfncPiahHGgECGptCuYQSDNuEBB4PSJh4COO0m%2BtQ6evFUVcsSgOYkQrey6eb1ZnYTvo1RsW3c24J4gatgX3KaT7pmSy6eu5GzvEfWV1kb4eOpQB%2BDh3i5BEGekz3D8DLZMMLr409AGOqUBPlEYJxqi7Jk33pm%2F5UKFe2VKTi2qPbmcFtR5yB3mNv9qNrnDD2KOi3f%2BAN4GTso6Y7jJ8wNJ5DE5MiOxk%2Fe9IsXZQXl9zOjRX5OL1T5hY7J5k1FN4umuHElmZ30O%2FMTrNE122r9i%2FP8b%2Fwwfa1HUHLxoofK7d4hK882R44xRvmzOkBWqnqt4PGGy8e0K6qlQCOmlk9XgWK3mZESRrPmfpZ8Js2at&X-Amz-Signature=b61099fef8bd720ba59cdfece20c62e3989b4912fe51c97c59e55610f0e9570a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664F3IMR4H%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043333Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC8441yy6HV5LsPeWeqp1S5n9MWjRIwrRKwBPxBMdLboAIhAM8g7WMIaeu0%2BLYDmS%2BsPJhFZtuvTXjKhM1GRdXidqF0Kv8DCHMQABoMNjM3NDIzMTgzODA1IgwXWxNcZOSXgP%2BVwJ4q3APWZOoy7nA%2B9ieAZ4MJ43iAIr3z8gCdr9DRik7xIFgTTGnmuJSAu3fftw5%2FSNeS%2BL%2F6sa2%2FdsbUuXxDmFyp33XbnSZgZJgyya1SuzY4Stqiy0Do91WVoixJKIpDmDZisncJGOL%2FRcf%2BwZspnBjWR3ChUnxRpnQa06TUNljgWw3bcrNFfn0Q2RFQ0igxtuVNAwvvB7gt36wkfdXMzs7CZeCMTid5ubj9S%2FF6K%2BLd2M5hbEnCepSymhe4Oj9m%2Fi6Aq1RhmXwYT3scXDSN%2FHqOoZe1cxZ8H8duXzmlnRElhYbOy3574U55fnKD5IUMIWb6jTBhQ94ne51iR4x2KXgpdPhjl%2FE1Us87wSipq7G4Yi1QNiqWvcnMAQ8uIgzj16F5miDBSYeH7OD04AOJFL4d7aSVL2fi8T1YD1ueIa6bkbqD0%2FK%2FboDbQgsXNUa%2B%2BeeKYoiAVkIhvR8pI4af%2F7N4qFahkCb5FQ3LUe0IFJVOw%2BtLIimVoQNQ970vWtbEFVSvmHlYkQIGp9YMOWEQE1nnrpue8%2FcwriGzQdgxODmTVkSwOpWd2F0gO%2BS4wurye5u9ZZ2ZMHl%2FtuBDRgkGZdN%2Fpe4Mi4YPgx2%2FzdtK2yTixNamrEhDzjoLTAT3yngioTC199PQBjqkAWZQsuWwPcG%2BQOY5IC4VXvifWmhcFtuezdodvVOwLP0obNSLAd2YyQEQOuUteQs2jxZ5mjdXZG9srZ3iSkADKsCxL1KsnGOQTZQXWMXw5zrjwMUQl8IwvHnMPLiTTU28qvz3u%2FiYv1er3bBO6W24cmQbpj%2FV%2FvmS6n%2BrJI%2F9Dn8nENM5sSw3JKgOChW6QV4nOx6J804JIkTdj7he7VXi%2FTLxNMib&X-Amz-Signature=e8f4929b188ba7024ed10122e0c5b3598ab1a86d1e3572c6dac81870702dff1c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WUVZGWL4%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043337Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD7NEvZF7UeJUSB7SJN9pW7I8%2BXIRc52eABJFm3zNb4igIhANCzYSS89HwdosJjYKF5xEDT4lEbrQ%2BqcVJJvpUcQKakKv8DCHMQABoMNjM3NDIzMTgzODA1IgyuZdi97fjNJa15usIq3AOqaqIUr9hhSWpeBxvWKYuhz%2B4bn%2FJJ%2BTkdBcLubgGBB%2BUp8tsZzhBkP%2Fsdqqsn8TardIPLrTKY8Gc218CSdohlTYsxh5s7jHHF8O2Qd43NErmpz7MHPdhBWamyCrd6xAqAGwVEJUT%2F2YYZXU%2B%2BCF8fsr%2BDgjSOIqI52odla2f8%2FeyDWw2kCZC2sZdZRw4ZlglWlLb0dP5rtLshwLh05JGECz3d8mItZUo1oJ0xw25s2FML5uQgrELeBEBHhAyhI0F4Z%2BG3JHhwCuDddqaYf2rqcrFSS00iBA1%2B5T9k%2BgyOOHtnbDgEPFBj%2FiJ%2BNobnhrC3wwTWpgiBAhrWJSni%2BWozWfE97vcT%2Bms2%2FtcE8Viy0XYokEBFy9ECMq85bydJEpGOWmt1au7aFRyUb6IOFKvMAqbWDBg0V2iRB6vRSO6sCaOw5byoDy4NDLqkxIhqnpRlB%2B1DmUENIYC3m1M2g1XsfmZ0HoyccrTdaD%2BQ%2FHuriDD5l9WEu6OzLCuHfDSnY2n2ch6pZt9VO68uXA9%2FNQtjPUpEkT2M%2BIxnQbdCfSngeAsxp1jH9XbvCjWtCpk0mg0sfh4JtYfCz3qntRG7817DxuGJzxSZ0h2we7TY1O7Qn1B1jZ6lzoogy6R%2BSDCe%2BNPQBjqkAbITx%2FH0XrLYscId7rDNIX0RsbT8FMwMZPGBtastL%2FxNLhmtenzsYMOJSK%2BDFVvZWmQbokP45dx2BSUcKtsKJEkIDJVeOuorSuG9m6k0ZSYTKKtKBSFguSzhtqCwcTBlgwV9ATXaD7bOhFyJSAeG1tXXBJI6wG%2Fqrcocq3dn99pPVsVZwj9D2GxFvgIjcrFZb7gSkG50DYwJwaAzFUO65bRDe6nQ&X-Amz-Signature=e90bdad1ddbda930fa61a030676fb81c81fe0dcb87581bcc47f86caab19d98f8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665R22NTTJ%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGdJMhU42dhKHPmQognp1hCvQHrtjCIzpj8jryd0aYzpAiEA5A4waeLN4b7Mpb538mfDCIoRbrt7s9PDSbLEYefm92cq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDH1%2BfnxOohtGtKWhTSrcAye%2Fu%2BQr9P6C%2B0A6D7wAf%2F62jlqdHLerwgdRxGLqVp%2B79QK84mQ%2Fm0I5c1w1ysPRhF23yI4MulruDxkoS6EdTQPtjSrg0u6JB%2Bsf5mHjbIZbhEnqRDT9n8Wwxmh43%2BKBWzMVuA6IQ7AgKNjqPTo0s7NF%2FE2ETOJn8uU93R4g040ucgBP28WEnDMkdn9F2T1mSz%2Fh8%2FuLGJUK3g7%2FisHIEHk5mE1zP9JULC1ZbI37MXJE%2FJU2l6Q8HsVf9wVzORVMau9e%2BLRjxMgx%2BRgQtlC%2BTQLbvD%2By2CHuwzZoQ0wTVSCqtS%2FJr5rv3sxsES%2BJ1mnydCI8dk9fJmYRma1lGIYy8IvgdNrnSNvzKdIJJPopH8AjEVjd%2B5rJ9I9kNPIWpHOk4PGBsPdBMzDSuT6WQWxMcwWtIEuIa%2BRy3IOrT%2BFwUXKfWlxp7IijtPYP0noY70Yd9k0R8dsjmyG3Jmp3RzD%2F5QniuURr8kwSsiFispWJM0OzOepM%2FBWhtU745cK%2FZzbngCjJ1upGakK3sBpKKjwwSEK5g%2Bi7ZLICKAGWkKQvU95JKvAFwIOH8VmbimnNl9SAAyxinrvtQhLH4SGNu4e6ywBkXoJoXGzDn%2BFGvObk8jcHztaY%2BWNnabY4IesZMK7309AGOqUBw%2FyRqzmIicEMj0mQPtffhzuzOmXXorpEGd8t7d9%2FBbWDpERokb8aNxyWGQ%2FZCzUVXROAiSg6Ms2VTMk%2Fx6zAT4TlfzxPUUPUDptfcXYqyGwkFoRDMrxmBLW4XINx25VNSMP1pKDEaEDpF1yDpbd1yH1eDyHoUo4Gkl1oj2M6P13kRZ4gZuhh4XlwpntUi3o8aR6d0tKKi%2B21AW8zIbXJHwb9g4FP&X-Amz-Signature=d68df64c3fe017e067213d903be83b03b927c7886299f20ec4f46279bd609755&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ST273HFT%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGwqzkWBr%2FIxDUSwEs99l5WA0TCEyTxVgMhsbNqYEqT9AiEA1zWtF5QA0D3DaYbVrMLXdvVc3FEPJyDwygV8KHAyfnUq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDD2b%2FMNb3qvypl%2FQNircA5rwjLAHoXvEnBeKOtgZ4eSykWK%2Bn9oaAmk9rz827QxuRL77c16OPwUoCPDNggtgUluYVvvPxmVujmLbKP2pOk95Q0zliVPdUQenORHu8VAraAMeozq4nfX3hxomqripVUs9ZHGRN5So0hYRQjovJJaPZX%2BzzghKGtz9fzfFEZr9d%2BTo1ezlXpsIEPaBTtgA9YxiHVc2kSLoPrS8IjbpQfiq1ecZpuBG%2FsvCC2l9mXiH5XcMg033eDHEr%2FMwnl8ssEeI0Bp61gt1hHLW9s7aJbDZ3lD4X%2BeHXKt8DGZejy2XKPYeTTGlMx9I65qcF9kgJzu09jQo6A3CFaG4TZghbkk4JYaDfhUOTciczGG0FjOAKcCGBxzOF9V%2FxG%2BTdYU3soHYaNecpthOihYO6nGpaMwYo3oV8RUPlRcwStVlgxZf4ruBPI%2BJ99%2BDZve13L6%2FO3G6Y2QfylOXrbXtXLQBTbpKh5ChM0RgnLX0bH1QoP0LXjJCyrHwOXIncOWqFIg3ejyqVoXn%2FHJkxRANu1YUcEgJshCccuXRsIw9BgZvMxo9TAUZUBN%2FuV06I1toKXTSOCrRYYuVi06b%2FDUNSZh%2Bkn5UUhsfPKNfsZXb%2FxrRmJbu4ZupWM7tUTSNEyypMK%2F309AGOqUBl4fqcQxaDE%2B4N3ptceXJObd4JcnEgunJ%2F2O%2FqLgADWHYXK8SnyiCiK79TEGpQpQX8ms4sPOfk1XPkNwWgpGKLiiibcll97VuO4ez75enSNFJxgveYEjDoOTjHybkASJHluxG%2BL88wNcu8eV9zXkjhpdz6GVwsP3mhwyx8LG7l3Z%2B4et%2BQyFoEWOuFYrbakijmhG%2BxJ91KN5FKeKFAmq9n%2Bf8F3ec&X-Amz-Signature=36929aa3129ed11066440cd38e7cb2acd048a349dd414accf8eba8b218e46a75&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVHVVFAS%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043339Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBlllO%2BcRSeqngdpKbyqDujgViRna3bRmDpkjpiWHapOAiEAqzd9o55l5cmIgB9vPeaNk9UrGS7PQ9yVJrq8TwGQDDIq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDKEweeBCxVyR5d5KgSrcA%2BYIseeHRwdZOYiLjNC4Dcf44sh7eiJmV4js2RNdKEJSRO63i3PrbMvVGivy%2FtC%2BjUWaWXyOvbz%2B779QTe81pJaILV93REAaZCzOSYNSmg92QBahbXH5gv5exIVaXG5w1Z4KXX7tGHxTRr3yFY2uKH0Vxo1TzK87Z1fKhmJlcHnz30EArdBin5rtvF0bo2Td3Z9mWmB6evaDZQuqxqu4v%2BgER0QoVCoPHHmpe5f%2B%2Fc8n%2FpHCIkrTE9CGcVfMsA%2B7kt63uxutTzBWwHDg3SxiR0p%2FbVIduf4FZhl65%2Fsrry%2BAZeoPjCyOXFJrqVyL7qW2PKKhzjyMnmP4HeCBfw1pbXAT4emHPlUg0GOKMCI%2F%2FNNg%2BdkC3n7JKIo5h4HWauhOuOhco2LxGA6a5%2Fmy8U6pIogx6UUp4FqsHkqZ82qUw3mgzravb8S9lWoZ7z1%2BteL%2B4ZQ0oI2CpOaybGcjUEVwMeYwyP5Rhq3gdxD%2BXUx91Q5%2FA9Oq5xM%2FVDOwgP%2BE0drdY8%2FmZ4NDPrwYY7i3nBlhBohuoVrWYYQAdcwglDcvDn7qH9%2BcAPITAhZPei0J2xlztKswUZqZNRKpQmTojhAremROnlpY8y7zJce%2BKFhwB7FnDn1t1Ga34RtiQ%2FvZMJb509AGOqUBjfsax04Au4HOtDcwQrY2IDHXN6OKcoorxX4eYaggD0o1eQmPSqMb9GNkqiuRPqlD5FS%2BL7X292S5WSd7o8yDJcEFScOignvpYI569j6pI%2BAMYGSJdwFlkepLc%2BJY7E348haDvBBNfHy%2B0CcVO0HTrn4UzAfUwOr%2B06dEW2YJqqmxEZrP1T%2BPNE1FGJcYi8Ls%2FFUJslr%2BidpVcyNZZSBzN9bSu3Hm&X-Amz-Signature=d06367d13e29fab8953c429a41a2ed8104bed07e5d49bbc68e00487add3125e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666TNDVPXX%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDsHyfqKA87ow3Za%2BF8RV4tnpJ2WNGU%2B%2Fk3DDX%2FVJLMHgIgCwjX%2FTVuzt0tZbyjmL0LYjGtBfwxzpOFQh82y8GvHtoq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDDEfU1zsqRxiy8mAaircA8lyUgNvSEvWfSOuasaMScIE7xnze9Hf%2BWl%2BAQx80sbnr5cylQLP%2Bg9jQ4uT0Rj2pQ%2Fu8qhqRtG4XmbjF4%2FyeqGemySUnfVD76DgEIn1CZURztDDaZcDcBGNKFLC9PVundNZaqiWbwSS7xE87gBfH7H%2Bm77yA6z2d0W6nfO6PiKJYBVEUK8dKWsedGRb7xAQzpXdaEM3vvqZGngJWBZuSRVgxQbJgrtp33vX2T01VuaFDK9x%2FV5L8PXasJ5wfouvmaQkfCMRM0SQlMWQaGFLIK3xW79jApOcuoHx%2FToAN9jxTmqINHUqIX4kvnPdg2VRs8dRk1HFL2trtJVlblECWXunp5MUGtF74GkOcyhqV09GPsM6dXtSX835GCkZVNoRUNG8pU9llzEIPtP64I5wihk7oVV5Lh3IW5I7FCPtpeOSg4dlj%2FoVoVOo0eIFUOgbWr%2BsqFA3BcDY%2FLGT%2F%2BCL50ZVUh86SxfIJyuGmfSnptmNdB9y3ORBhBIzYUR1zyAQwbGur6A94IQKXdz08wTzpico708LJSktj4wXi7bRKJLj3Y%2FLmRJFgzQFMc%2BRPQdQOQvPP%2FKNRkGr9BdY%2BjewPhMrdeBtw0ZUjq4TujlRgwOpMWhyx8WJ%2B8RWq0IgMJj609AGOqUBmm4%2BBOg9ZezUhiNVPC%2FjqwmzP8VrKA4%2BjFb%2FcvHX7f9Fa90NMA5aarQQ82%2FVwYrd0%2F%2Fk7A4QU9dtR4C%2BNz5FXg1QeZoeimmJlOhx10GSWw2PXbUwbgeh3YqniYOF4zTld8%2BPQoX0d8cp81l6Jzp6ROz23UVfE8LoXP2Eg4vvsMgNvKo4BGYTy6oLWRXKWnJ0tMLfh4IG4pTSQF39Uf73YyBIPxiV&X-Amz-Signature=3f055d657056b389906fac1a8d2cd49878c317465e3dc0ae4481af79d37e2ac2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46665PYQPGO%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043341Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDEK%2FHuSD2SS0tsIf9mQw0YNlJHjc0yTeihlVLcWPVP5QIgWLvMZBeVVMoQlJejLEsHKqP4p8B8NOf82aXZ00jjCRkq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDGEYtR06N5bs47bMHyrcA2ShTTl%2Bh%2F7IIBKZyd1iMfzb%2FxaxT7S2FxqlwaMt02rG3EZI%2Fypzajx9qNW6UulUwvXQGn66wMJjnS26t%2BwqJDyhLulOKJFfrYuA1ofjuTy4RbRgLdjGhR2GTdRx6da0DB7yLV8D8en57HbAsZKuxhvN48KW1FVocKqeszYm9qO3CeDmjqmQ6W74KaS7pZZ3d3sjVEFlYdoJ1UqT5raTCg8%2B0U5er%2B8jc3hn6XRV1Rcl2ks5kAr3TD7%2Ba7xW%2FgmGBpkXTrHMIR8OrQ496SXespbBAUqLfSvcF%2Fa9ZwNmW0MJ0AnxwJnKUS19qAMXmKoXgEvmdu59tKkU5o30qX7rcbmmJ0R6kseLX%2Bc3z1PSHofo%2BSsN5SziO%2BUXHTDnvfmN5EJI5edqb8OE30AG1KdX46eIllSRlNQWK3LV1G5nxK%2BCeUZLILg%2FaIFRui6Br0dFhuI6HQvvJBzrBgRxS%2Fc%2FflaLy4WKmpg8x6fy%2Frv4nikHMH3%2BD91WlpSuSOJTfIX5%2F0V5yaQT6BBqMA2rJ1NiG7fm11I8gIfcSg7BfwStxtd%2F3u0vsWoCD50dThV78g7Fb4hMtwTNQNqs0NMxl45Pzw%2Ba0QVjQJg1%2FBwsoZGt%2FyES4woks56ecfJRYdVLMN3309AGOqUBg%2BHVAZFfS6Gx%2BodaBkeXS07xb2Iw%2B0lPxQX%2FH3aCgI5G0uC9baQqsg4%2FQTaFKsctnnrQoOHIaNCwZe%2BkTx7Pt0ni6kCSoCGtQ6xpo%2FU%2BD68KRcP4Qq1GB8j5puTCISNq1xlB7a%2Bmt3ltesyuXpdL5uQVhBwjm1AwBJwKrQ3YkV2PvWLSQ8aAgpm6lj%2BAJPUEoyNR9WJxpmB0R4SmPUdKCiJlFNPz&X-Amz-Signature=622c5469430ba3753db58b83ab464db9e1469ce9a283b0611e19606f7dbd3fa9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SIGKGQAJ%2F20260526%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260526T043342Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHX34JxaoUInST1Ypk6TZP4Hv%2BacAiinpMyIbDxe4l%2FnAiEA82bhv2lCa0bDSoo52awk697jQXZ287c0%2BNrtZyd2YYEq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDHCInbEsqYlLT7hK%2BCrcAxym%2B6uaz9jDGN4VgYvAgTt%2F5d4tPkVBsFtRHpCWUmUrcFZeirW7Mw9%2F0tc8c%2BVrTpqkDSPGLOWAgw9Z3%2Fgi0sq5tOMq6qPTSKES%2BMVMsbOtKeuJ6k%2Fv2kMwPz11wgsMPeRx%2BEf5%2FVFMxVMYXAZaURqCZaQJcP5Jv3vmTLWG5QouSuFaaGqVFU8%2BXFhI0XpoOT07Fwv3ZvftwWaAiwpSCYkvdwCpeQvGCT6zrWJWWWX3hV1uR6um1Fok5Gv3QUtgUgkjooMuZpWNjhBdgbLhLj7zq8CYCW8dt9TewHX3DGRHlD0yr9OFUF0jWdgH67QrcjLga1E00RYXcDQRpccgekNZznT17pQJrNy7YTT0IJvNPerB7ND1jbaV2dQbkg%2BAfns%2FKMPFgXP1%2FqvnX2wxdn5ic3AZEw821ZT0ofGCnRC5Hyotnuzc3XlBSk4cUbRlFkxsYuWxDAwK57tZ8QwpBx3UN%2FPnuk9%2F%2B9%2F0ycP0XUKXMxGvvlcC91SHJ1Mgk9IAM6htnyMi09%2FJwcjWqZY1iAPvPJlizdp0K9dUUeUi5oyVUfVuhD5LfANsgMu6g0rDP43s2rSTzBE%2BT4VO1y4AiAo65JnETT%2FyX%2B6viWLlX2QfbiWW%2FOBLqOzNkV7gMOL309AGOqUBl3s2OoYtdfy0rOySoR7RQdYMFrdGckCTcZ31ZWD8rpoALBh%2FQP534XRYGOW38NfWdPXhdSCs0azbdcwM%2Bl3%2BxL6fMELERwjr7VapK5ZRqmRW78B9h%2BS28G6ptq4%2FkDEWn2ZiV8OS3OK78QXcQMexBWF%2Fh5NKZxuYnak15ybPxzVh5QZ7raaGIdujTQX5xagxv2ZQzXQnBQYfQQeKdyVPpuPgF1co&X-Amz-Signature=fe14a80491ce7a04bfe175194529ebbd1ae0c30879e76cecefcbdd3b297deef4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

