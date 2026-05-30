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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WOAUCS72%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041615Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIE1vkE9kc9buNFfDtQXubMWSzjnibxbPuZjYHueZ6oZxAiEA7U0ag9g6dRZYBfOGE6NZ1hUha5sGtGOVsG1KmQLsd1oqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGc8qoO5nZxU5cLUsyrcA11zOTqL07UnrsZDopO1fIfcBCANqsZLdnEl0SC8OGZwEuG%2BUz5tujKaBuq%2FxnhVJhHAk3dIaU%2BAGogWRgAlOnWQuKAicZ24Lx08kbBd7%2BMQsFuxn67rJlwoxyK1MBsipGez8Be3vCXIBPwjrumVeYB6ZLjiguuVlZbWizoAK96aazCDiKcXquNoQ0I%2F%2BqHfTm6KakHdrxDgf6KAdzJNyoCzqj4lLitF2FdAchrBm%2FVMEA1wR%2FqDbwXuvjbSGWnPkxgG5eeTVp3bw85vit7mE%2Bv18%2Bz%2FuvdVcrsFA%2F73frAPZyPyMsejehdyJRpivp0jAPWLCqDSI84UyLMFgSAwinC%2F%2FR9sXB2NjmmgI0vmAgi5FGkd7pLadJNNV49m7Cbc6LvEbdbLEsKPolCSBN%2B7bkl9RBqjyI0jceHQcSpqAvXgbQGJbQY0LX2B4nc8%2BQ2yrZfg962UYE%2B9FsS%2BSlVhFOxxeGnIwdPRQC1pguC%2Fh3ywtz2J1Hxo9U60kMvuZfMxXnL7x0AESYkHehnlFZjzvv%2FM9rStz66sP%2FypN9oyY99MxjJk3fuiG1%2FIq03ZGfiabWBnzuFUTqEwBAfPjbFIMqHcDKqNrKrDiQU8YvCbUwVjs30LfjJZzfD2rbSqMM6n6dAGOqUBOgSlbqtIM6pxDoUoN7nW%2FvS8otbpOvgUz1T4sZa8ugrsFGPX3WmI77KnxF%2BsPwVr%2FmtYzG8v%2BjCdKQPOWtEWj9ifnA2cUT91zCmz1ZJSjSezpJ6XSGAVR96azhmCXjOUucsc3C52jJqLyYBmSaOV0VS0IYShwGoqx4MndWtfeOP2A7QanXvIvBLRGnf%2F2cGiICZwkwyCtUvnt%2FUifekP5V2WCsvD&X-Amz-Signature=ddd2233fd9399641e6ccb0b9e4fc6d44074fce9b49d49d5b399c8bae5bcdf1aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TQWW6IZ5%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041619Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDYrbOFACld9G2zbjDMZvEzMgRzeFXy2L9omKEUriZvPAIhAK6aKj4Pz4zBnooZN2mu8naXxM4bzuhbKX8h%2BY7Enmq8KogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxE2rickOpdq576qmUq3AOUrS7DhCzw2itwzbYvUPj0wNFsNiYNylDWtq%2BHCyePh5kSmcN6SHF%2FulgNt61ARhfa5THABQ2khXsgIUm2y2xgHZdycfOQUdLntqLzeogfTFQe1qrIaKBaIYrNPRofVCzmic9hCOAE5qLHlG%2FeptAed51wghW0gx6F1UluAb4IE5oMGD7hN5%2FuPqP4l5ZMXdXcuiLeTkgPj47uuT2pAt8PQqGITOjm38mqCRWx7fQ%2FxoezCSXztdiTSyfxqWVBMqUPhSp77d3rGhcU8CXMkbCETsCJOoVyqiWHHbjNkeKIe5DrrPWkwx7eDwMEHMPZyHNKWKZ9GoBw26vflCbuSBgu56mA8UfzZYAqSY0oqS7NtyMOYNt8wvr5ZYFxeeCvSmrB4uhTe6y%2BJ8j8MNNf%2B1bPzgKauO%2FDbcfKLJlRwyijxo2UUXeOMnZ1uszD0hG4NpvZb89X%2F3Lt%2BcSR4YU%2ByMFPiags%2BLQx6JrSfGxa7TPXhNdpXFO6BrK3%2BoEjDXk4owQjpXkayhzB%2BrXoAwr4tgX5fLY8aRtxkXz4BeOyYdP5TCUiI1%2FW0yQMuFLml3ur2kK7DlUubfpqAuHY5NNcwfijhQMFAMN2GNT7SNrFzY67xx4%2BS5AZ7QvnZLe%2BaDDLp%2BnQBjqkAZTZ%2Bd8qlSVEHLzCcEyb96rjMrEz4xQcFsTq7vGv%2FoztNrysbUlVLaCerOqhhQ819JJxDB1eS98WaTDYR%2FDRMez%2FhwIZgr%2FMgLmML5%2FlToowhCbCTuUrXREsSLtGh01Qc%2F0ljfv%2Ff5MZS0l%2FtdpFu66Ny7MjCIEYrphKStllv5h3HVINkW7MBlA3q8xF5MINxqD6mDgEO8K5SwoNbYRRmsvLqxfF&X-Amz-Signature=a1f5f874039754844ec5691604b032cd878840d0d65c81b7706f1561ee92bed0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4PDSZJE%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041621Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDtf1g9GX9ObT527iOaUsrvn%2FQuBqlwzEbK9u4IKLWKiAIhAPOmJZ7ju5E25zHHtibOu1fxFxKnZyvd51POKVf3wHRbKogECNT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwbKWssqsP37PmVq38q3AP7IYYonKWbt2dzqkgVgwgsYuM%2BFIKTDxLdlN%2BdM6aA8zUaTKeotKGTqKqYYy2Or7%2FdUUvw37b4Vo7JJ3hirnas21rX3TXFppChHZWNuql9vitwUIdywy6WXE5iQ0JG5ABCZGnTi5dwY6KCXP%2Fu9tcZvYuz10n5pxPqzt7FR2VtZs%2FMm7aCoINOu4KmrH6Sk%2FdQPoJMnGHnyGs0A1Rw4VJVz6SGRdq5RduBRx38dVvm0SYCF54SmvSh10iwK%2FqQ8ls60WDZCXTfE%2B%2FqzuL3dNZaSp8ZZ%2FANw1J%2BFiwMD7H9TymsgEiKM7znjzQAzuiiRvDfTadEC89yqUabpFnVs6QU2bViEga8%2FbOyJwZwFnWnlWJjqdW%2BhHP3xkRcp5tZjQCPHfeGFneZEZQ8YJLEMD5h8i4h9YfuRLtUg2bXVQwNoG%2BFV1SMhbEQDenU1JBUIzSTAGzT6wI1486FVrrDh4gxUuHHvhBOyKzn%2BHltCQ4hfu3KobEY1BUqM6GK3BPbJl13WxzRsNdENeBpybmfeu6Kx1NWrzNw37qawSEosUAV7kIFHd8296h9Z7OUE89E7UMSJ8QLEf0oDOx4QLSuUcAw13ASNFapCKd2ELFazx3jxMeaFwEaY3HS%2B9eZnDDmp%2BnQBjqkAR9wJMyRbmDf9rHHCIrgh2K4EoyakTzCNsNaHB4wndlYzs4iJjgvff0rlUv%2Bb%2BikReff89yZGevZuHdU4rr2JP407odgEAqtI1yPv%2BCsE9jHCh98j%2BlPaYJbvioRstcqMut%2Fn8cS%2FR%2BtDtn6wM6%2Fw%2B9NhB41tb7Q6kOTJAm0UXq1Pi82pqTbZC1mhhBAdYqTywNGvFVMdjLwwKxPUW6gZXHqycXK&X-Amz-Signature=52b032724faab2fcdecfe981ba22048dcc117c95110a27c67f95aa23dc10a630&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3V54HPL%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041622Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDNBE0kGiQmLSyQrWeK8rZhuG%2F56GzQGg6OcyTQ8YpLVAIgBICIB%2Bzfa15t8YDuh5sLyyCY39CqbDb7UP6vTpPnOKAqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDK8y71Wr6Ak3zeznXircA4r2lh4SZOZ7klyaS3nerHJCnj94mZsNBeS0R8snpGeE31MP42C5ncGM4fTmvPiZn3d7CC1J6gG%2FqJWs%2BQeIBu2EOFB0jr5HP98q4rPOCsd0s0rxvRhqlpYSa%2FTabT6SgAoi2SwC7%2FS9J4IESjC60XtYQW75mrMyRXKOJPEEVQChDMPK%2BxZ8wVlk%2B8nx8fdXtF4DjB%2BEypjfUt%2Bpkhp59ErKyFBa0ay4ZcFE8R3JFDkHDlJ4NV6HsBgoKx1HmBAReOxAlIUA7%2FoHvD0X9DcLHglYP8TZ%2BEbWIqkMUDoW82%2B7omQhCE0S8qsQqktURb8rFSV05SMIxU%2BIeCjksAW9j5gYW4pjkjD1qL79o0sjSo8HE6Yj2KPCmKIdP9Przq%2FGY3mcblD8Jc%2BFJOhtGestGh1BrxGbkm8riKw2ZqIdsujqJffODmQs1XhrOqBEA%2FfAarvPJ1smN6WmkJOj2YFOzi1%2FJnsY0WF2VHotZbUU40LEEGxljdJV5uA7Ho7S9ClCGaOxdSNTOM1TwhNUN8RRYmz3zOSHYTrLWFq%2Bkl5E3aS%2BY4x8tJL31iU7Hns4Az0Wgfm0kNXTdOlyEEGJ77Rch4QEOWJ1Gz7skB%2B3zDvaHly72J56MycdFGYhkJSwMIun6dAGOqUBjogH1lRTIYHUWjt%2FiXJXlpON%2Fpy1PDH8rI0kcQpM5waQCg6szSlnv1wQJELmPXOhsYN%2FHrghX7e5iu3OLL0Khjq%2FwWuLLan%2FXtC3co55ebNMWPoL90CRTe2ZJVWngSUvfvLFyhCgWhIAAVi7NbdE1%2FKh5ZDrnfZkGExKZnSwCeAOacaojLiyLPui4H1%2FXbijGBtq9cPmWqsRd252DdTryRfs5Eng&X-Amz-Signature=c488bfe133a6758f797f2bdc5b89cd5605b3a3e26953f2a41ce8441d6d747a72&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WEWLPDUO%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041624Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIHx9VafA34PTrAWXcYKwhHdE%2Bu27PdY4n64dHZqfroiVAiA84zURyOHmQiy6ua9hFwsRPllx1hUvE8E9XLIolW39piqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8qnWQOtkTVMXuAWTKtwDS6Y95RWOCDYyh4Xqs1yJdnNRyZmEkzxaNmFi5nFyUS%2FNcliLvH4JbKKBpA9cotaSRgsWWx8s4wMkKrd2NZcZG%2FrKQ%2FoYseKDZse0XFKfXJpzA2aEp27XJdGkvNZY7Y6szjujeQpxklAQN5L7mbEKg4ZaadF%2BFG%2Bt573UvRMff7pGWF8i%2B5LZgIU4o5vPIPSx%2FYFBPNmQSPD6VEvIufsaAYvqO2WPNAvtcr92OHdIWmO0MtMKC5dB0wcztvRFPDUehMUEfi9HkY6MvrgFlFnRCKZB1bpDJEmrwqaZwYjrUOn0bi2xStgwVi1HWDKwcMBwn%2BXa3JFPHU9Aa5Jc5F8sygDwEk04ZKCSfcvKOiyRFcJmMWnFRL9%2BoCyykjsohfbzTBuhGrGEolBj6TAoTpuTr5ohB270Sq9sD4BuqNPrtvB9lcJs%2BV09nLluwG8HSIPAIz%2FxAvupZlD4%2FeA1qlWJujmseHHXAKSmlSEYJg0o2KCpyYhBvuvVy8XaT2ek9Pl9V4tT3rFKwbLeys1p6YFb7IA%2F7rBwaq3Xsu7oegQ8JcwE4Lv3J%2F7nN0y3RLD2OxLvGJRwEqZ%2F5Q1QFS45D27GIx0dqwMTe44C9x0EvTwMkAFzCX7Gece3PLn%2F%2FsowsKjp0AY6pgEkGNTfQ4%2BPEGQ58uptOj%2BQQKlCNkat61Xc2AI%2F6lVcZVZDo%2FW133MVVt%2BQC3g65RaGMZP%2BThLraM792Dxail7I451mqpXi4e2SvH%2BDswDjcgMI4uT9KK%2B08aaPiKVV4yfZK9YVSH%2BvHbJoBFQaLVT8VqnMOEgaXt2EIQZOaY8VkUuHlKIONRxLHzkelxf8vs4VOJu%2FIO8oK5vlCtpawEn2oyQ5q7vA&X-Amz-Signature=44c8aac9f185a1e5d602ff51b5cc24b21ad69320ff80d6fba0951355c563f833&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667VSX4TB4%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041626Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDaBm9cMsT4IGVeC5ujX0aBq7QNLeDdN%2Bysgwv6O17HEAIgLiWJch9DZNmVfiRqizwWgiZb45XtALxZbhSX8p8DDIkqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEVfijl%2Bqx3N%2B5E18CrcA%2Bzk92YU6qnU2ilzSR3D6mvdeNTXCBXE2kRbWKiuKKDNlzrIsdBNQFt4yRxCVu0e7FknI7y%2FoMvsw%2FMxcAZJYbd2fy2bzbHtsFHlm%2FK7TvO%2BsR4Dr8loogNQi5Rs9D3ZcS2SjcWfqc0xRmZY%2BR8VG0JBK83RClOvVl9PxWWMu%2Ftv4SkUssHrLqFA%2BKa9trQ3uT1re3BWbIZQAPa0Dx611DcDCQb%2B9%2FhhJj7TApbfk0ceVqILKiT1lrf%2FHsGnoyj8OkxWUURi9DrzXhYUJ%2F2AUc5hpX7f4ExeGN8fab6shUYPj16V5LihFBChI6Vt4mY2Kzu8KG%2B0cacYiPdQmpDdS96MhoUqlljOll5QiV6zpaLyG8S2puduy%2FWKAcQeo1q7Z3tlP6shUcVeQC8ZxIWUuvv4D%2FJWHWbNKdHgYb5zi8PDwqpO29aBMWgFjQEdCAnEvHfi98BYRQHg08iP3f%2Fc4FeQB9SWek1C7MBELx%2B%2BVSoXIQ5fzsKzX3LwSyYY9kiOicMrEkcOSLBdAC05PMJXaqqC%2Feh88gkBLAN%2FxMDPs%2Fwdpg%2Bv3ZZWgRI2ASRPdP7r2Ntv%2FVFQ%2FQghvUWoxI2Z1%2BVG8%2B577%2BTdBBFaG3aEWPsYkSHhhMizaoD9VgQ5MLKn6dAGOqUBY7naGq%2FlhvKmPl44Z7qCuQh%2FMa%2Bt6PN3E5DQx36Iu7gtLyFDVx8wRCGw2EFtJh1%2BFPby5aFhf9A78ZtG224d08oaUOTBtGrgCTRbFNrqDNa3jeqaYYEFRRe6MS%2BuPfiNTFUSKOwT4xLjyJVdQRFrOlDWgYCaVstgNNJaknI7qH5Xw4cZf4dPqyT3ki2la5N%2Bwp4%2FoR6h3frqXbo8WRJTNRWnC1RX&X-Amz-Signature=bdaa9baaf9a9c8666e372b8f1a57a724bea6a24f5a5671e28839884b2ac13132&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663USXXODV%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIGyc3AgMGSzl2WIMRqisk5TS2NysFiwLsAxsBVxy2Z0jAiBTvthuVIxdgODcQFdCMaRee54lv37TSwOJR9whn%2FIHnSqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMXWnEy1dfagKW1n1RKtwDM2bt1ESCPtbVdA4gQwCV1R9EuFVXlxXsDMz73OsOKZGd1YaffcK0t1TT6NLQuaBi42kZY8pzpJLd3lGYEHiPrbdhkafAw9LepOfjke1n%2Bai3KZaLw6FHQZfEQLTGcrx2ewhzgQAHpkOSXLHW%2BU6csYTVrnupuRqSoWtoTKdR0wTTJQWOLeczIGMS6ooI7vct4Ya%2FpRneUfUldsiCH6XzcK0y7DHVP1zDANNPtJaYPhJHmkRYsaTVQJ1QhL8xoSSg5k8G0TPW%2FHqAVAup%2FkyeglhUC5Z%2FfDsD6nY%2FNY6OnkYw%2Fgze0IIe9wSbc5kUo3%2BPEFdKyUWhHmF%2FmoCH%2Bzq2cL9ACtOB6iBm9PfToyvpiTJHU91JY3CgTITDjwocLU0qztwnxHq9FWkL4yjkLTtOJCNrc3%2Fm8vpEQ03SrWjyG6V1gh%2BIPbi8NHvn8DUalViAhP7Y9%2B37fP1RpneF1WuGc19MEPl1qDN1ReR77NgKCad%2F4E%2FRSos98FUskAqsnu9mBSD%2FgL7PX%2FxLKcGOHmz5d0D0aJ0PANNqsw0qawA%2F0qYAn%2BSicoYFCOrmyngSIp6L4m8rhk1kwuPCV2PfP4iMe94WE6PtV0%2BMR9hDe9oThDc09kgDB6ygsz9iEdMwuqfp0AY6pgGrp86MMJv9Gm4jZISAOx3VwxeWgwpgjtpB%2B0geog3CkK8kyLWWCo7lCtIHUXy2s0rA5O62FNzajT6XRKTpIYNqQD2YB%2FMIWnBNj08RdW%2BnLkS7hKMe9QZKq3LR1LFBx4FMiNvTU9cU08cSgtnGETbfS52PjAY4hbZqa%2B7yczZOlBROHVA8VnV4ab%2BzpzEKkO%2FEWHdXqzYonqP%2FST070rr8Ca62HC8S&X-Amz-Signature=8be903ddc64c60037c2ba6016d036810d360d5e87731083e2cc7a786d5c72e45&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634OUMZTY%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIGDst%2BmMJG0wtGzWeGbjYA%2FHOvmZW5BGwjBFNU6vH%2BefAiEAzWoKx6Fz1Dr%2B7dL9zpr8M7RzNMJFFWIUK7KHclbQ62AqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOzI1uqZxQTlX%2BKaeSrcA5Pg8IWVKbXWqx6SPhH5sfj83FIk8N8WWcwT9Npc00s9dQlqzehiigFoiShdcFykz3GPhji9l1d7AyQvQ8MzE%2BM4XE%2BkxDeY6y7hSB6YBwJExqQXVDJW7%2BSJaAICd3dgmXXM3w5APlQqMug0Kv1ZDa%2BdiJKSnCTGvB9nIugHylaj5%2FtcHx25KHrujtaxyEbfKJvtzbtnDfdeo36HtdYgu124A0HPiaDaXXwkqpQr4XKMj3yoGQ%2BzrdhpriGIk%2BMbOWyUN8qnzDvaAPY1VMtq1i9Xzv%2Bp7NAk1ElS1fC%2BAWak8xQnZfCLH%2Fa74qJ41rDARv75vC%2FfUpzFPl8eN1QgeOm7EOaCG3rN4EJdHcpgFE1MJH9WA7O9gr911LshMgHu6SIOpCOyVnEhWhY%2FYpsYigrSQvTsBNe3jisBbqRStnWv8nFhk%2B%2BONOZYRpOT6Qfv%2F%2FjJpJkhX5OoHaHn0tVb6veOpIWk460hXjU7EHCoIceFUX139SW4qmKNzr5QnZJUzgEb7H4Azqn4X9H9mI2DqmIgVWTPihNObBubjfNAmz26hrWKHuEwgxZlry3RnMaFI44IfEUt8AGhhukreINdV9ZBhge3hfLyblHcQjhpyCZHcAVatQUdb4Zs4eTmMN6l6dAGOqUBQbIdD7Dsu8gTmPy7UHGvYK008exUQQtJTiGi7tMtQvPvk3Bjl7BzTS4b7Wj2lKcwJX0DUaZ%2F8SKsYSMkui3dOGUe9BzdA7vun%2B%2B7WPONdIgsUAoQz7EB2J%2BwZ%2BwawKYrHrWWNxaTuQ3%2FZSilmVeBF1%2FophpSQh%2Fm2jNyLOHvTUkTk71CxK8hWVR8s7uFmIKhK9r4A5B6DhGy6o1JHzngrxLBTi1H&X-Amz-Signature=f34d759d7594ae873ff3b2741d508f4a57bf52a5783d4d8d324dc241467e45d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YGZBOW7J%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIFf59fyCf9XDqT2mIDhGYt0AQKo39lSo5eCk9Ez8BJ50AiAxqVwK6PhF%2B6AFJHGbYiVXYZnpfu2LnGKiy3FYCoVpCSqIBAjU%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMISx7sGEV5oForRquKtwDeaqVUChGIMg1NMVvWmTNLqi4MOegjxPQsk6%2FvSzhrOvdetU42BvcN3Zgd5LI9xIKhrfwmo0rkw8G7AwXSrCmhGAoTqHgawO5S4O6qrswnXubMqOSOF9qaXod3eNEz3dnXL985kwcecCM%2FyS40jd3QRus1OOUKS6M3kWnqiUBrjI4qLI6Fhw%2BeGnYyibx8xtf4F1rs3JyiUg2f1tp8RUi1r5qFF7h%2FdgS0AR3ZC%2BDTIplJ%2BM4%2BQxrU10VhNWJCrQclUhP25IYs3fXmy8FpkFHx6xfsNlWc0posnltwRnhEuCr2DtBZBqQ6IcrWBz8F6E7m%2Fe6mHltO3egURDXGJ4FRd4NQUgiSF7lsJtmqPERdntzY0Iv8fBOD98uncdDzau288VOm5wMXUjQojvVL7KyOtHlFz688t%2BHV6%2F%2Bp4h%2Bs%2BxUN%2Bm2B8ppKEtGHcMl8SR9mKf2Eln%2BLyz1IYdSfKDd1MNEcrzakNFZLXDGRxKEsved2W3cwdovKuARy8P9bHavSjH8CR2kfWoDripW5uGgcfpESCzG0aLSlpX8TfhqO8qxZ3KA7VdbWOetVUbBkDkU0Z0sIjwSlyM4SFd2h9kzTf6KOezKfj4RH7VMAvYyai2yohR3b8T4ant28fIwi6bp0AY6pgEA3675Z7fINDkyhfU%2FVwpqrhhgDgF0irmOYqUjbpPjYpLkQ81%2BzV8nGtmlX0ohDwmHW%2BFmoX7kN4hiTdnnRroOaOLZR5iX0dL17ZbIV3KDX6BTAHcZOnI6GbGNIphOGnQWLNEtGJiSpb1v3n0%2F0jV0TbJBIettVYhAGSK25S7n2eDD4LXA7S1gLTFXdVy9U3WYxFLyccOdLwuikVBVeuG1nXP2hKzp&X-Amz-Signature=e48ddebad52630261fae77c198516a4410da07c7115968cb30f5350d4910a979&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWRBQT74%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDP6DImVCBPS1LCGs%2FZbqW3J0cA0D66PTg7M4xnp7luegIgXjkld4TfX4vcx1EwrhTvOfSjzDHWtAgL2X9GwgTfV%2F4qiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDDtZzf2%2BwnZBgXK6TSrcA1Jqt2h%2FbDoJQeVjy2HkoIH%2FxkLc1%2Bypa%2Bfr03fvJnUDoM%2F6pEsvMrC3OENegmYmU2PRV3BY%2BPDW4xAmufid6fsgD%2BPDuEOzran4BQVHIOfZtcg2S8poIk7hpwgcFq2LsouYd3ZXNIbVWYv1kItrXvx0XMbi41Y28gOM3i%2FM%2FQ%2FsbbxZxtzefkiGvnPRKVm6YrlSdgHEeZJ1RPCICwj7HhPq2nk0mnv5d8iK8f%2BEsba0r1SZvrYFqLhu6u9rA1g8Id9mj9OVzt9xn0DRHLLklwR1LxU6aTthFDCeuTCOeWONB6OiQZmsKUlqJWrTa4Q6zphrGnoKGQv7F0NXp%2Bm%2FAg%2F50MCEelXOYob1lUO%2BPxEAvZ0UmJcJgaO2FsgbDErAMgsCBxSmkUMsvZ3tlNvKP4%2Fccf3DUprDcCVwVhQK8MNDsiOCKzl05guOND02Snwa4ECdLUXvOuwQ5mycetZczIqrFvBowTUD6xod%2FFLFsC49WtYL8mLiPQIxXZjkfdQ86GNvmFN1E1FFKl%2FeYPo5FSWmxAQFcGWR0xTd7r%2FpHxLUWvnTByxJ8Er%2ByYVvfdNtuEYtJnKJzl7j3uHVV4EzTCDkTxyKhV656Kp3GLtSXaEDQ2ciKldCFtDmNft8MI%2Bn6dAGOqUBVMkoVaUsICes7QyVlU1wNMwCcK3Uq6%2Fl17%2FlVpmnsmVqG%2FHew6ilqliThS2GgmyS1SpXkG%2FL%2BBgi4CThfKDTPdYhMVL6hUrGFepKPwR5KllGXFaTsWlwQMJXnqjt%2FoiemffFi0mqKAOnTNMzlVtnIDvmZQhQ5%2BCxDWo9MKUHIVbToo0p9yky%2FiKxnGFt%2Fjvk9y83ORXPJXAaWbK3RyowW3ag1fAn&X-Amz-Signature=ae5a18812b38a7c17ded8c07570e629c50e6a42f5a063612358cf984b4743e20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TUKUUL3U%2F20260530%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260530T041631Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDFnJhHrIPZQmDVDFTZFc1orSNisTTlQrHcL3996kH3zgIgSJzrNaL4sA%2FD7j8Kyc6zqp0yFdJKVRh4hbwKX6uh3psqiAQI1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBoZDlDIH%2F7EM37uCyrcAy6L1ZcM%2Fo08kAciJ0F6WF13MktKDuNlV08H%2BlOstjGhDgTAvExNgVRB%2FJmGE4%2BkK04oPQRbfw751xADBsyWlUlDfndVsB6ssow8UXxxoMABuSh5eRnhlc6R%2B21rcv76BBW2zpwhTGGXb3paClUNvyc4hl0r2g8JQ7gBYjIZiXqnpWGLYnQHYe2sv3JtViNTLamWO1fpWTWC4bUIyv%2BdO7HV9%2F3OtoZT265hEMBh6qMSvMLPhzSvPcbOb9YxzG5npBDWkpAG8RZALf%2FKQh83PzFLGWVSLSecmqKwi92gBHMczU4xxWTqSe2GOR%2F04nlxnAKDCMw28L%2BbRB3lal6ds0ysiG3eRs8pwbfJCypYhgg02%2FNHUpbE5XyRVCu%2BhFNcpG7CjSdHr3Z0gQBeAUmt9JlhnPgdEt8oPUCQVFHl2iQLSagpb6BEyeC8PdWj%2BcIsEdi0qdsTpc9HqT9LR6LfmAeQXEmAWA%2FUP72U1d9%2BzZP94d6wUF7fg6tFY11Z2m5QbCN8bLuMmqNic3h4LkwTVkEOnRsU0qjH4Ps%2FAYaAM3gX5Lv%2B6m%2FQtLIGaLf8LnunYmAYE4hqHZQwwHRnzkey55eOnZLG5%2FiFHPIo%2B7zd3ZwNXVPBUI7AytjppMslMOmm6dAGOqUBbzcAFwD2s36cRZ5tujxEDlBRArDbJVRiPPmPlv6Sr9L%2BFvGxOITogzMyFXeNauxqQrwPp3vLWoyA%2Bhs4rv7ofrC5uNVrg6a6%2F8cYw4GOMgTpoYg%2B2AcVLRn2R3HIlXeX5SXIX83Bhf0a8FPM1O9FRSU3T4tUR3esXdqpL5QcPh%2FhyOuP%2F1cyC6RX5i7w%2B4Bk%2FKWkVOrDmza9UA52oEMSEaK2C9fy&X-Amz-Signature=c5dde6f7e73760fa8882aebcb6e424a64d151c2e546fc48f8f20a76fb574b56e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

