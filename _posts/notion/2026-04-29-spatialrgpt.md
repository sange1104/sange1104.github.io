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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VL5VKHCA%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045916Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIFetP302i54ByvuIc5MpG7Wpp1SYeeQe3I%2Bo%2FW3u0j2pAiEA3PngVSevzaGTCppYqlZymP%2BeVRHerYsJ3oMQeKZtwVEq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDAAHT9oACPySFsozsircAwQeP0ojqGerTOymPMN75buHR9TjKxN0Fg2WSgs0UlOZ%2B5lmCH2xkmsIYexDAv53PX8jca4q7RzswQaCNzs2vNGOB8vJPG2G1MP9xGQYcZQN6WIU61xZtmc1yOAEMAoGiH6RRelXm%2F4rwXC6aPu4zGpwMAvD0C50CH0Ack6CvmhRkjCYSsx4MJD1W2z5%2BOiJvtf%2FhQHCIcvvl1BYGmj2mYxpMQf8Oyxj5PTnIPtheP2aCHW2OWWHfOl3Zv1Dfr75Ue%2BCFUWs6jzLB36m2ZiJTx0Zp3iBKInTV8mHBb4NKYO%2FTdVfAVQOqaXDnSKDgcN%2FvCjrDw50tnQArVRjoHKvLkzcEvv%2B88CelOmG8sjOH%2BNdNVYcRTlq3CtCDhIRDVAPIhYl02OOrIpFv3fpC1g1NlLMZgODYMbIHCD%2BElSYuKTipbVuwXwkocW2YgBXk0aa3siVXuvflFcs8MbTbMrJFmBGpT0OORUtYVF0N9PhO8izQGVxBDAXLwZppBdTP661t8AMsP5hx76IS6KjD9Ooxq7nFslWYbqqzqUcds3M9b%2FBLdJmMhQtDQGaHx3uBSZSw24%2FIsUvYw7RHM%2B5bykkXnMkJ7bHHv716CTbKVzri6Xy3KnrOWlOqFFWd01fMPWr%2BdAGOqUB9sXQ8qj2tXOcSiUzJEdB4B6TNGKDgkN00bpfnYMJIoKRqlYevCYhfduRBC94LYkWrv1GQvvG09ooEu2obIO8j%2FpAKQgFWCjpNmqeS92fcGXQ4YwXhGrDvPtSidULywoO17I9U1h2I9eLYeP3YcJf0BlATON4s3EduheZpe%2BpQhROAQROVQoW9%2FZZpacaO5WPTAQ9pzqYYa9EdM7ZU8lDt3fcUanc&X-Amz-Signature=2bdecdb59dbc2737695f60f3f01e576b265900167111a9a539f46e76e4422521&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QRZJIFB2%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045919Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIF03y7EMo0wYPsFyPNXQ%2BQt%2BpCFL37m3a8qG9qRFP5jgAiBIPc5Si0QJY3b5%2BP4eghf1osLTP%2BIOki8knpvUlUfHHSr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMz%2BEEFjTWNbXrHg%2FjKtwDfnZZrih1iohIPQ%2F12GI%2F3ovKYRReC%2Fnb16aCf3CfV5%2B%2BxtKTy7Rk%2F2tvNarOvx1u00O3xtE%2BSYxM5AUtmwH1UaBZZTGpsW7iTxbOzqo0HklSsrBB31xLPjoZ8Z92wRUtG0R4r%2BAnK3S0qTFdtDu1S16X4t916F377jiVR5isviuSXweL06ZCV2ow322Lvv56L2Wi0KSLbXpXKY2JLNl%2B9QeRotjkcVd63tAVXO1d3%2FDpGVabpSLaR0R8XZNn8BpQRrtIcPDh4KJeAV%2BG9EwhogpYBPmVAYWVFXqn4a2vHEwPCa3cRq5iQ4LHzbVsxWjtJji2FYgLM%2BuQEWWigtMquY9viw1o%2BLjLNGuGr2v%2F6QZbzgACCCQeTi5ffmjpZPILLv%2Bh3fL7hMxMF3NizYGNQTK%2BiAV7WECpZFV2z0TlulFeE43Jdmkj77xPo3pj6vzATJqS2GP%2Bp8bxzK8yUdh5bFZo3hWgkJgdK3is3p33a0A%2Fb%2F0GCmUesmguI%2BUm3o32UgWt5WZPRsSC9vJBMCNfkzZNlr5ZcNLLYBCOF5AO2YQX6DApTvcQWEx3kxmLM2CY4U%2B3qcmz%2BKyGgSgETTMQ8CF2WxPQZ5vrA0XW7fTYvDY%2FILjaBtSYkV02YCIwh6b50AY6pgE6tFoY3W4%2FHDd4l0n4%2FrL8wJH6dLhQMCyMk%2BQzs6DCYqx4KdnJNpmiwuX%2BDXuBkOzD2SZmyujC2baqDqtvzj5%2Bymi%2FZMZyCwMsWTEV3vddHxl6vkPr8QE2UN1a9%2FuSp%2BD5oSBOr7ZpDw2cmHTrOkpQfBgbIsd0OWDVm%2FokUUf7ZD5nIu%2FtWtx22LX0N832QrorL9K6ZwS0JAL5bnGf3miHUgffVdvA&X-Amz-Signature=d8884bf685a6a667025cb2820a8d1f979c42b0bf0db02e92a302466b2aaca684&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4GKBML5%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDVT%2BeopCpWUX%2FVdlBe48vkqg%2FXn9Z%2B6IL%2BtCcl%2Bjcl1gIgGnwWzbVheu8DjswKZP%2BQQ307z82J4Cm6kq9qc08CNxcq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDNZ9aMr5hohIAdt%2BQircA4TqcKfB%2B5tOot4qbg2wiM3GMuzhI3JttsnoOEk6w4rcBgGHqvbJkJYybcpD%2FNeAFVTFeZ4KKB0%2B4wfzeA%2FZsMw%2FTkgrVnrhRS6tE2vbqgLp3sKkWf3%2BIuJSncecTNB7SJLJAfjh2v%2FuJveLMwgK5U7gukZcUnw6CnRy2p2aBHZNIqpPm0XwifU8EdGmB0TYcdOUXqY8r7NeWPY%2F5w96n%2FGR1uilpEo9JFM5cUWab7WG1dUq8IFJWWP%2BaWnZSmE%2FAAigOtFr5uR77g0p6TzL0LZxIRTQqLgEXXspA2gLz9AyIg%2FRaLefUp%2FoYo040uZfDdZktXAYfCLXN4qWF3F1vExoNHZH0k7ZgBbyDAVN48oNEx61xCP44Zf7IcvnZADHX2d9uXsBknBEkEv6fHWrsGH3YZ2%2BjZXlg%2Fmn3ul8eNiiThMSG8m%2Bh97ZBh7KWclRsxERcp9vy0f0H%2F%2Fxsbeq4zDuvXB8sxdNxT3Jvw1RND5AToAIPFrlZy%2BDyoC%2B9qyWsaeEujRVspzwRbWrdnk4kQBNnGQzPCo9g4hei1XxvfWOcBKTUUiFPZNw848JZE2A%2Fxo28xIdwdsam4xxtFuhOnO%2F2YiNL2c1XeHMmMdkQrAaoyEgJjYdkDEjioK0MOSk%2BdAGOqUBaA7wlCLM70mAQ4k29eC9O7aIrlPIzMNVBad1ldhUrciKmV5uRf2GxJj02Bj0NuKmBE9R%2BCeJQIvfNQX0KLgBZ6LrpHoiyMcWbMDtWhJ3XQ9tNxB50b9ve3yWvr8spI9o7l1ygorQGjK%2BFIgyGIRkMkjyf%2BRjB9WJRWbr9M2%2BPSMHuIRbxsnfNAfswgh0WJsW0n974EW%2FCKqhgaCt9KgzN3v6w144&X-Amz-Signature=1975558d3afa33561314b41db99f54296b024bc187917539fe54d8951a42b154&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SFT7UQ7B%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQDV8aXOJSoVKG73ws5VYrqavMM6g4KxlQi0b1quzjPc6wIgB46tMGR6AVBtrdRPuA%2BKam4bc4yzXrJ%2F9aucrnXJGSUq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKB0gklhdmaQzCzCRSrcAzo%2Fy%2FOaFBDTttV733ci97wIx3aT%2BYaZteaSlGY3OEqek%2FRObuxIIjYlYKq9yn7mdodLviz5CKbMsLw3JkMF4477D%2FXcWG439OcpIGFO79zbo6cLyir7e9vkuPV1eLxHhz6JnR%2BQzT2CifIsPOWG4e1FIGBltoAsfZocY7%2FfSFaDwda1kQRtuqAhFpxtp%2B%2BPmFKdLuDeszGCvC4KsItdxUfnOblHI0nUSUZj6c%2FLLTWuaPF6nj5ZJ5l1ZsLHA3YEuMH%2FvxaUOVC5%2FRJc5zQ2GgyDMb7re7olfH5%2BH6RppDvyz598JnsDgMlSPRV5Btw6xDFqR32PR12v2jidflAuKVbx1zjn3iU8EuiGrcoDnepKpRCVZE2k%2Fl%2FTppiea0Da2vzxiONcKDoU%2BdZ8FBGWYrRIWbwPr9SlMjbzgibtAqE75rol3Br7XeHYviyzjtlcOW%2FBDYXewjKA5jifjwocH%2Bukd2NGSe%2Ffr8QbrTk1ZhkOEZGfWxeCKN1tJYl6%2BzqCtFr69%2FNEMRw8bdKI3XHYicm5cVfe7Q1zG4AA8CI9dHbQWknncvLL6mDWSRILsYSpgZwf4xwdZrGSnvm19MpB8MfnlGJt3zOIPyHTk6UEHcJHwO9W9wzksiD58knjMIWm%2BdAGOqUBwCfs6Rmus%2Fac11Ht7QKgDcSjoHyMhA5N%2B2QtNbO8l45NDIhYBMMttdHvAQQcvBgrbNjCLIYPQy7LsrnKeGby3mpjo583ZyGQ8xG3H1yTi4o6GOL1%2BN8ybuCrZ%2FL9XFmkOOJIHqIc2wvlaEz9MHVyORm9pqWpPm5EAcUoMuvd5odyXk%2FJMfn7c2jGyGLgrcYvpdwb3BIm3w4Qsgl99NUgAse%2FtciB&X-Amz-Signature=42b860f35d8036f59f3eb43390d550f0113d0a8d44e3b86d0fe415726ac05b65&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667UUXHZXI%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045924Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFEaCXVzLXdlc3QtMiJIMEYCIQDp7ZoxU%2Bs0A0ZDF9MYOBQAfBOgyidpq8kMHjZW5qdoQAIhAL%2BhhB%2FHstmwV%2BVgtkRTCcJxRbjf0bAXFyHzzL4gr7ZSKv8DCBoQABoMNjM3NDIzMTgzODA1IgzSs2oR1vAo19UTEvMq3APdvK0%2B%2BdbCVIQxmph8v%2FpiE7MpLVv1mS4gjeGm9cOE2fKBZuqHxQas3gLGOUZwMX046f7wL7YoIgG5TfwPUQ25wN8cRMpeURua7JjN9MAws6rGlbQ4mU%2FiR%2FzXGzYi1pFHozmIEgF5qu0JlUEm5IGgeW3cJ1cwpb7ttAhO8yowTEqGX1aKYoZ0rZO0D2JE2VswRZ6QiTVuE75VHO0FbG4U%2FieMZEQLTjkFNLgU2GMb%2BDaxTMUtulZ4FwDN%2BLWaJRkupKXOS8Jkl4vk%2FTQF4ujxcJkLQF6iQi5%2F1c0jcS3LLNbnYpf1TY%2FynMKLKpVH9EHLC1v90K33Y8uI4dhMOxLlep%2BMOC8R0HgHVjEEyPN1BYbCqKNl1YPdMySC%2F8G9mIifzm2KUEODYornwTjX%2BLqPajUCwQwVSl5lBFD2pI9VaIU%2FwqRGrGEruQ%2FNMruIRrO%2Fa5DwdsVTr2tmnwuQtxjTA%2B%2BgiCnglHnuEtejS6a7dY34TdfAGZEiJsPkqySeFdHG7rJ%2BORl6tfn4Cv5I5mAYIh0C%2FxrK8RhJnQ8Wesh7NzVVBTd5Ze9Pdqfvzzc%2FJH1P3z5qjmBop1lIU8crSJpBZ3QMNe0zsbLaW5d7rlgJjNeguLhhbS%2Fyu2Ci7jCh2fjQBjqkAXqV4ZD3DT%2BR9Bde6B1JT%2Fzr0UprJ5sLXtKcB55F9oEP%2BiG%2B6hTmCtI84%2BzjLYcSbBxBcvXf8Tgj2cEIAO%2FJNhbl56buPwwWZzwmSbycEV%2B15o7t%2BXyw%2FOBxhkZ1pfUDLHwaZEODWKIJZXCqWuLfe8rPkNajI1eIVC1NJVF5P%2FzrKYPjXg7%2BiPeAuUTq6TJc40LWKuoPtdGGtZYvcchJg7ehbd4K&X-Amz-Signature=604928345c13961d2df32687f67ae70f77ac6e4aec6d2e95fa37710c0d3f1ce6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FZE45EC%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIC6GnrOxI5%2Br2Iz%2F3MLz0pjvA1sbXzMSa8vPgACti%2Fv%2FAiA7wFY0P0sdNOAnTCbGp0gS4EALvzsdPanunpTihjTkvCr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMsb4WnK2ZRVAo1CZQKtwDLjelRaowur%2FxPlfEGVLhS3359LeAU5bEuLcgEZCaoZGGzbFnJR4MMeTLxex%2Bs31a6MggU1yzxVhDqHxynSuId62U8T%2Fi3HeRcJ%2Bh4AISbWJhlCqRdEItA%2F6XwpaJmRL8G1qWzQuTPzdN7NHGRTEn01igCTlynjjXH2pS7w2PfbKKv6x%2FOl73tyy9IpFAT1qCDzzNo%2FleyemX2V77IPZdXionQrWFZBZIHHsQOjZPqIB0b1ipUI%2FTrVUcSntmRdWcIxAxZhcV%2BuZ5ZVMPI31aD5AGfWoruAcZyHX2RcgpUK4dPPQ2bTrnJfErJMCmXjITX7A45%2FSgwUrs8KmgyBJzVoWjF%2BiGyB0uM50U7Sf89qrMU1zG2IZN5PE7F48DrD8HGEBzHL4Sj0Dvi2kUXPo3qxnhWgxGWcfNjaAuA%2F1zhWOY8KvwdA4fM%2BuqBm9pvF%2FVfVMhAfFHdXeOrCqzUu3NB7JpwbRkciKgHptd7QhJs%2BFEOLb9RaOCTo%2BBLhMOMiNnkqts3LQn37Q2gaMoT7uHuiTnDVrs6hFWHCXB6yQnQ%2FzhlVm1%2BEPhif4HfpwkSo40SROvlkYBjyH7BBJNlB51C0Rnv8LnWOREgJPwhmaP6ehjF9AE2ik%2Bg3hz3Vgw6aT50AY6pgGlpQvfv5zMe7NqQ9xyvZS7pc29J0jCx%2Bsa3wIKmcB4k6ikyxdXUWH6Q71FdsFmVbu8k2A8ZP9ckgcJbp9g16BrcIn8pGwwNS7Q6oBE6kx58VFxWoPsjKfG69oj9ildL0uGAVcSJOjT77ESjI8gQ2EwXgLIZuvG5XqijBxBPwzXB8rR%2B8HTCpbmvD1bCSpSLlDDc3f3HUmyFIm1NsK2EXlxCtZBEU%2F9&X-Amz-Signature=97dea499e7892e8e49ab2439609da2a449b87102d2d861870cae2547d2bf5814&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667T7IRLOL%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIHnpbpD6vPYRK8hyWXRS%2FTKymOa9KwrqpTy66UoqBp3wAiBAfcizeJPtKvpG1uSR2PhYZrwo62BsoX06Ifz44IRJQir%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMMhGVXnx3DDTfvKr%2BKtwDH27yjeII8hWNT0xp5NKCZkQ4I0S3%2BH8OqLsTwcxm3CBwZrohmoajaEoFsDvYU872l5UHxvYB5mU%2FHa8vEauZTrtBaarXf3nCTeP%2FqCgyQNyctMc2pggGGwrz625qdIZdCs3nzykXt2dEF35AY0NYBJIR45vTZCFuX35y8LS3O4tXBCz63mUlhedcRX%2FUjgX9SDaKiVkY5Zq1Ng3F8PbBj7MVIUcVjNyVzbbjtI%2F2rjxdcY2uNsX1rGXohIN9TqvPrGaF1E43aa1bEzHvgoslAFZFBdILPz6B1kPN4JLu%2Bq97kr4G%2BRRkm9txLRnaUAXB1RpRfQqPucHAcALZdNCXtubewIwQ5P6PauWxCsq9pfpby%2FDl5fT3slDOT2aYJBhSGfoUXyDiiH6BuTaK%2FnBp2LsEmg9W3UHj%2Fdi65kIP2ciBeefYsBfot3IvOVBw3044HznHMeAQDji4Gdl0Kv2AUSfhyBmTTW8SCe0ajlaTAbheJHnIgUhikw3vjH4JN%2Fn5wqE7Nsbs9JNYW48BbZJGjlc8U3GS5lbGqJd2iMNae0OWRtozE2Lh0hsFfRY%2BbeEVH1QCBFm8ObdOc3FZdyNZoPsV5FeYE87ybSUPoO%2B3FMS7EtXO2zI%2BX12AbZkwnqv50AY6pgHJ%2BxgL%2FeQhlERcXU3s2EkAQUHYIHDJ2B%2Bhs%2BHKQh8QWJw2KxVJE79R6gQJnAh5KOppkDWdhK14vPse%2BrbkMHzxxfR9ebV952yWproLs79SkXAHyOE9Rtbb%2ByQAhZf%2FqL9h7zQCBKTEeJ2lyzCOPoM%2FZi65%2B8LWI0FNvP3xKvwxAH6YoBMdWzPekAIyur8gvuSvPzbrKLUiblV3cpzsWXn9vuQqXSkU&X-Amz-Signature=2c961e3848eeba1e3423093cc5e8a311eca4045f16423e13a7a23bbb38d13d38&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664MIWF4QG%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045927Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCaNwS42B85ZlmdpUL7%2BTvXG%2BTtuFnmIxOyratxoaHpXAIgFJVwCvZz5FrskRLxb%2FRrKG6FtH5ooYdjAzeuz1AjFNIq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDDa%2BNbGDZxU7FoUeNCrcA7d%2BsVHyvH9C3V7k0Ky%2F6Uw1knDsubqM9S%2Fh9vtwc2fKKBLMDUI%2Ft%2BmtsaRe9WzPn3veI9fhlLQKWAfudk3UnaYpXJRP3cv2v0ktpz1nNuRddHuigsn5gomwuHmMskX7UkVZInA9EFxj0rux3TUhHZprE%2B80bBm5ViQR6I8XkWOdqyJZk7%2FJDQdMCrAlkgjGbYplImxSzS6GgQQVUMyILPuw8KoxowCyHz2zG9hm9XNZRL1ng3hdSv1%2BmxipC3BY%2BGkXEpfsw%2ByuA3qUP2n1%2FIccf1ZzwhZ9oTNGm0WKA1FamEa7D3Oca3ATLVrnrEKv2WoNe3CJ0qyRKIwKfaT29%2BK7BL%2BOZIi5izxzvsvc0GvE0fXcAQwHwYYjw8LmLeelQ3W9wCVNPqy5%2B3W%2BhT1yYerg2BjaMK%2B3SiV0Q55qHzekrXPihi66DIy9MDbQ6qd1QJmJ5W0ylTIQHDl2u6ycpCuYl0tX3FZ4HtmmGZYBk%2F9nug8iyV0Mv5jqlyeAvOLOyujdz%2BiiIHP1g8hwbL4aj%2FfREHArnS9fNF5%2BlWk9BUA6aWONF94qTq4MwkIsrzadn7sfWhlnMmhhu5AvqgERJFZtAwAvQ96QWS8JlATkvBfEwEiTeZYX2YcbQlgQMJ6r%2BdAGOqUBWmitWQqHJRdiLzuo1UD1PMQUrKwYeYGGhbIAVPxSD%2Brmia%2BktRvHkdN%2F1pbvGB0Sq0g%2BHeGuRxmqncRsFI2xkK6rBd3BNitNphr2EIsWFtZdpiDHpgIMJ3cWQVFdI0dez3zIQM7sUdxv0AV6SX%2FlIKxJFoNllyngCwcNI5NKwsWe5v6jKbtf05wdtDWWV%2BmP6L5JlMOWphczPFBr5FmnM35ePqDR&X-Amz-Signature=eddf7d40610df539dde454f0094d7a5d2f8f06273fe9b694efea40a806078dff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z7UDALFT%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045929Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIC98gXN7xe%2BNGCyab9COi%2FENJ0%2BELO47ul7g91gPQXFYAiAiQ5w%2FeHpZS9oYbDeDF11Dl77QPw25vbaU6ahJAwLkQir%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMt1M874NNIwj4ghG%2FKtwDuEaAoc1keWLzUTYjJAvnUUj3VWGOK%2BPy%2BV4aiQRUoMBAUm9elukfb%2B4AYWRFQA5WU0SbUmM5zCVvHkSFJaN2W0lkeAYWOy%2BsHXKdqzjwNSzYW981lvBPGr08guOXkDkPsPikaIPO0opD14EQUpllLzkWbL9oHKmYwDUWIkzDqVaFKlCjnc0H%2ByDNEh6simZKsKUM%2BqfrhA%2F%2BJFmH317pBDRgoVzDvMXQQl1ogW17A6v7vXbA%2BFkw2mrYlzkb72PegJUG9FoNcHk%2B3KL6uC%2BZz3zOtxp2LywYyUwyKZlvXtiBXSn%2BqSe9B5o5RHky8q%2BEGoYdXHJ2ajHa9miXytjO%2BXQjKp0%2BwVOu3tgkwtV56lZx9KHAibmrroRqxTavDuHBGGxL%2FCX9CIg8qkX9dEKfAQj4qaUDGCqRoF44O11zgulSu117KE9e8fk9KJeP38c44Z4wAWDAS2kdelBlrz5Le10oe3IFiiNZOWmfCdix4ScOX%2BX2pxBtvDS0tm%2FyZHb%2FhpNS00r%2BF66t81SjTiODGGMUS2l2lElHTpMKxgrITnF%2FCaj6YkZp%2FRoujZaDuvwVtVT%2FZqiLiKIgqGSVhP12fTl0s8TKyyobZ94GF8ARH8%2FRctsYJ49N9166Wr4wjqX50AY6pgF3UTO%2FrxNnFEqak6fWsr367IjArYTcgISbixj%2BRxEKc9CKaV3H%2B1Gooc1qUdTtzgikmfbR0dfWRRh6%2BDALm7nQpGRqnrtYEp24K1jIDw7BWVSOgtc8IwOGj2ndiRCgoysWP4kEL1a%2BrAObGwFef2tb9gMyd22%2F5K9PW1bFcX1B0idt3SPHCf0O0v5vkS8L0cyjhFunAfS%2BeH7vXsIkOefhNI48PNlk&X-Amz-Signature=582d4469da3d22219fbb96a578e1403183935bea5d3eaddfbc9b13b2508c83cc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TFSKUK73%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045930Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQD0tjQDf0SkDxPrwlv7s3fzuO%2FqYnDiGqfTG%2BQwYQmFLwIhAJzjV%2Bs54qDWipi%2BToWgvVKxrzqtD1xRi5xPLS0lVm4wKv8DCB0QABoMNjM3NDIzMTgzODA1IgzOmfeX%2FcMxPFWWuWQq3AMKWWHhnV7J4tlV7WtmAjZq4BAxu%2Brtp8Ntxp%2FwEdBQvySKk5%2FKOoiDG0pNQfWLKmVSIIFqBYz1hLrQ7F4mdrRxfCLqY0MCnmRjkHcI9vawQE%2BzUQl%2Bn4YQADl%2BtJsxxwWzSTlthIetnf4cBrtXpFmzHEjnyvt9zIhv11cFG0S35lUgOa%2FkpFbPIYaX1NOvFFmhDHPOq7xFqTg3sB%2BEBMTSAt58JtwDsBYoBK5vrIisf92jJH7gEx8qHjlSFed5Hd5rqh7Iwun2HKXXt3im1QeUIi0g3x6YZTKCO8J9tS2U%2F5egyVPUB45pXaKD8%2B42o0ESsCYmN%2BS8vPO6t8e8eLzNB6Z3kwo5wi76rGdThQ7NAHB5lbhGPBvQapYP4oBeK%2BA%2FjhdVNqbzPZI6Z4oFLjL7sWmP07u0cY%2BXBA3oD8Xr9pxBRBQ%2FTloaQefzQ1vCfl1%2BGK9pGSC7ZLAV8IzUCiIBm75StykVuBbKUDtjoSuVDLLPQyI5rtshciYZR7O7%2Fn440yvV38Mf%2Fk0oOEiow1xUW0yT%2BPIop%2Bh53J772EZinbjGde8o7KxiPjOt9tXrct0XClVnW6JqIHz5k3UKESHkbzWp%2BSWa4SM%2BgJp6zEkM8lAnwRtSvpVBVmrhezDepfnQBjqkAWV88EtsmLbpno54%2BK10ouvQ7BG4UVnfe7NpYHekg45qlC85F0EIW61ZReaTG9LeE7e1MRklZ1F6pTcVkJhsfMMeq1kHkF%2BmqNUZfeAH%2B%2BKYrWU7YUkDAld%2FT98rWqkwkUATexmgOM%2BOwrfuXuEE4qx2ccM3LjkVEXEHCIB3C0w%2FZ0Wn1t%2FpUPZO3grFr6WUl4Qov4NQbqHPNMGjijWkZptUdh8%2F&X-Amz-Signature=2f9b752e0eff1d80838b0edfac476c8f2a067740b81af731bd0d5a46189c37de&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WVFMU3FF%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045933Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIAg0RIWC27T6bYUXdxollyIDP6DAvrp%2BYad5TrwY49qyAiAuhCLqgnuDqFRy42kwh3YCRk7x%2BdxzRJSZ0IzieTZK%2BCr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMKpIHJGMzYRzREgnyKtwDook%2BD7tea8JY8hjjUizQOunHbiz6fj%2BhIU7T6r0FV%2F%2B%2FhFclbq0uXauQnXguFBadsC%2FrtTlFHaGOPJDsiViY5Qe6P5CjUOhNOgl7%2BQccTjXL317U1%2BqRo3UmJeUL84%2FfeK2OCYOHx71vtyvhHFSJC4xbhcojlMZLSuy44we%2FpRCIBU0pCQ8osCMyXBdO5xSmGW9BtQwFKOyf8g1UhSYxgA%2FAxrQQyf7Zd0phO9TkhKFhSL0LYRG%2BNaugdPrG%2FA%2FgmOyd4aK8kfPMoUgbektQyteZMFoBAiQRIo6NqLYbmlFD%2FDjBa6xQQEh4iYpIUP2soyvXWGXMn94fpUQqyQcU%2BCUhx351F%2FqNjEcfMwd2Wa4A5CaQnTd68Q0KyS2LrShhJfV8Zch7gGwQNpD80CDaJYP78UcbJM%2FqtSUxVgzcl5JB7PYOIxNUt%2F0gN%2FdjMRRkDnQ93flEri3R22oX88iel4ySN%2B8HLhioahFsvAwTKaK4%2F6338g66DwSC%2BvzzVDe8K1Rt7TQVDdgz1QtS7nR00GYuTnWpNKu8CK%2FD1gepbxRCLVIEwzTDfh8P89kB6ZJHWDe76j2FoT9EfqZYaHnkUAagDAYYI0uaVW%2B9UqgP3LC2sw7Yr%2Bw%2BTn6Yk3Qw8qP50AY6pgF59cUN%2B20WRqXOzb9TRQQY1GK37qEKJQhImQXA0%2BafAWp0imWySeCRsof7VwnEqm2N%2BVvT5X92jmHKFxrw4%2B7sk%2B53ZFn%2BiH0%2FZGyj0P99zrGSRccu7nMxoZncFHJA4UVQiksjQEeFyScMg0DzJ3r0tz3uLTXWFWbdfqJfl9bzhteo78T3EdwvGMa59I2Bwzord%2BUiB7k61Y7MIMiqAILbFdJZaRkO&X-Amz-Signature=28d78f39f8fb1b4240dad20564de67d457cee2041e8eae81a07a6ffda80441b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

