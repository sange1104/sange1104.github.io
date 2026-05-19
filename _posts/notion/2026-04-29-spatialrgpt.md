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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOQQDDVL%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043233Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCf%2BKHeuJy%2Bo9V2MxeDNhuxPUXPN8BiG97QEG4AXWdKJQIhAN75RBIjA%2F9FWcSpUW6MzNVk%2BJESC5yDIGBgxJKsOsrkKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxUceQhT%2BsgagQVj4Eq3ANwhKbbVH%2FHE0Ti9jOZq3kb0ncJ%2Be1SogzyUJaS1vMP7q%2BjL%2F6o20rC7fAwAWy8h3d3brqfsUkrHsHcCNJXHolhuhJOD3N6N75BBNCgmzVKmfQnG1wx%2FIOrWmvxgu5FA%2ButRl8y55tveXoPK90e6%2FOD7U6UBWbTSSrXcWWsclubKFtqu3bYPdqRUMK0cq%2FuCfnZ2z9xCVDvOhj%2FSdPXRbUL06xW30vwAxIkysDUFnRyNYPsdoJ2aYn9bCuScpXcvv%2B37nsAFC9flSVT6MTDT8aGlBOQUkxlIzAD6by5Y9tGgtwBBM%2FFWN4g6uAUJahPlm3ISjGsbtOTtjEKffHl9yigFCbPQ8%2FD3UNrWV5ZyqgLwOlt9sDzrL1kXqcMGfx%2F8f1QfgHfINGu%2B7JtRgwGKNlKkk7lhyHayXUHREjYQwjdECwpgLbmt3VNW%2FbudomIVE7dZ6ihLNT4KWIsdYFoWclpeKz134Ood96l5%2FqkcNHJTLCKV4Az%2BvpjjlqpuXeSjbXQeb9ewl3SDo%2F43mlsxtEM92b6ol7v9TyceqYJ0Je8ZglY%2BlPGQrwalIrx12UAuCZrqhTudueQemze3DtERzcdew2W3%2BvBWokefTvDFPReU1o7dOJRINrV8v3wZzCnuK%2FQBjqkAfzz4PHclR3RZBmOOOmBNw9cdc9HBUR62lvIcn29LCcJOrCC3J8vaJLjdxJHYverQ3RiZBptfmIB%2BSRBM47qq4lsGrRc%2BGKOxoGfitu75Eyo%2B0N4byaZj9Ihg33BVP1YwXhZxITDQunf6JZPS8osgJvyllpDYnkbGDoHgfeEOx2%2FMBgB6fep%2B%2B5f9nIEhPDBrSZYi6iQT8lrGlGWfLgxggGAfZD%2F&X-Amz-Signature=0a3c0b4bde11fae6e58b6756a1d031106a2181bf1b1deadde59f84195139cd0b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46665M2P22H%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043239Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQDsVDkljvy6%2FLHoA9QJdbiVFvokOpChEtuOWUkHGQ935wIgTei5wv70ChxmWfupDQRYDTH%2Be6pCu2LMgRtwivRLT70qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGRGSjA4Ad%2Bgp7yBpSrcA5rDFmPhqGE3TlX6%2BK%2Bg93dK76avwMeYJJkeQOlJU4YI5UCcpVNu9laAEXHnXrmwAMWfxSlWCDIu9DrENqdulB%2FrRo%2BzKBkPDLTiZwOBShARXwAxQkaVYkZ9NWlu%2F35jn1%2BawpYSHkh1ec2%2FVvFERPgFAnZPhmm5GhC1goG%2B%2BKcTHj4hS95ul0g9u8ujElKzftnlo1HPQEdITrEdYkWBr2eiqzJtkpbxIKgul1i944piy9hs4LmvzSi4BNr7XhVqi%2BJk2IL5ecSv%2FEABx7T5NHue8z7pYTWN3yMneIwSVl5hplNN8Q%2FYTqQdpPX2YWZY1C%2FhHgJxRR3nMH3nxgYhAbodRvHhvsR%2F5%2BHk1AwjT8nzl2xoEUX96EXPMdLz5WdQAgXRs99oRdDGgT7FN2TSoXzsfWAhDbs42TyPvLPe5RZp54sjEDzloydYkCgqoN9CTQHy%2Bb371BaC6HCe0J%2FsSLUa3QZZxVFCQXrir9X%2BX5jaqlsRXUQfkZOYpR4JDeyeKrxV%2BYQwcQOz1iVTsIWr5uup4GE1qaSfN%2FpqMqgv0BsIQ6sOdL%2F5tVtfOTPaRkmDrRJ%2BJm7TGKU1Mu3GMQnwQintunCmEGEbFkgrUxo4nE3qRFuLp29oMN8%2Bnlb8MIW4r9AGOqUBqYGr1RLQXiiozRh9zF6OxJwR2HfOAef4uIVXksFdiIsDUiit5s%2Bc1gpex9zVYba3wHKBvs6NVq8hfDKYSeBZN%2FuLzoCNqoViRI%2BUtM8NbzR%2FpP2tjEsmTFnEBbrNemHxDm9JigPvz3QWgoK9a93ntK3EIzB6refp1D4kT7M%2FU%2BmM2QwTuGs1im7MWCYSCA3YU7uAjAj10b8ecHB0%2FOle%2FZKfwSBW&X-Amz-Signature=d164b4a0c6f0fa973db4a27ea3d0d3dce8609540a886c405c41be607e7e00d51&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YPH6VQUR%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043241Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJIMEYCIQCpVORPlV1dXaNtSpfj4HbTxxL66UyptOoiOv3Kz5sjngIhAMSyhOa2ql0hQO5Wc0698CdhwEiIYYAWo%2BIUfTLuQrrqKogECM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzl%2F8U8qQ%2FICWKTEiIq3AOjl1Tkwbwjeiny3e2XTZtGnGLKOeqPVuCF%2BZa1OJl8lyYDy4sehS88W%2FF553QJ6N0f5nJ8vjsDHs7oUgtqjEoP9g6W0AVkvekg57vsJe3V0BtTR%2FezTSO3PhDAi8mwm3NK7C%2B5AFf5NtLCb4Mk7Z6wvF1oztUJbomqZjl7kxzzSd9MivZNM5%2BR3%2BwAEuEJYzszoGljSABpyjp5Z%2FBHWvy4lF%2FoHQTUsnXRP8S%2BSrjrnDzOSUO8db%2FS1aFcP1COsH36O3z10766kpr2yAw4c%2FlA2wMKaaHO0sZHqOLcxfxsmLdY8rAyktguY8bObw6kZg9181GCiJc25Jx7gsCMhK7SUbV0KEq3L2OaSLtxW9c7CU32xM10QtNSjqf1WRlrM2TQ0gpS%2B8cb3x0xpeGwrFcENAmMbEDdgKxpPkZowRqOBrU2LJU65feLH%2FSPOL9vnOV5fS%2FZTafnFwy7T%2BI81aloADSvrbG%2BJZT7fwIItwRqI1sBuPOExilLG1luBj2FDqArnegA6GOJSlh7%2BvwAciGDGyZ37xv%2F1sDDNHFkbRTga3wrFQ5V2s99Qy5mZt7b1J4ByWvtbq%2BNgfXaDLxHd76r462QdeoDJlMNafNDI2UkjTkJQjnos4N5oo0e%2BDCGuK%2FQBjqkATzniExKwl%2FIh1i5pIy2VVE1h0kO9utAfGe6jwCNKpnl0z2TXI4N14vDQ%2BEPEZ0lqfU2QcWEbqDxpKU5q9TIUa5JRS52K5ec%2FrNhndrM9QKE06va1hQivjmrWfvSfNxS5cDdIC1jKecPBswU200mRXRg5Qnq%2F0P%2B3AuQZyMPSIV3nT76Wi8g%2BcwE67A9jZq0w%2FNmrqxDxYd63uxT4SduBc%2Fd6MvA&X-Amz-Signature=a5bae6bfcbdc20ebaf95f95bd1141b53793b5fcb27ce0e25b57ae201a49be0ed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TX4HUXDZ%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043242Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIDU0w8VxphhdRWI35PnL4lbBb65Rq9ELIIoifakVLV0WAiEAmUosqAg6oALe6QeeZftUrVrFYjAllgykeaPLbOE%2Bx6sqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIJwsX656sJOTsxDjyrcA62yNMzDOJmLfA3XSXzKg3pkMFHzhQF6pvoug7yT5jz1cTFAuquWqSNjOvM660%2Bm7VHgVbrGcwdKxbysSbmiEjfP3Uo%2FgcxTr8WZHLBG6IbEbVi92ho%2BrBVDxSU5h0zrsyiBYfvKwX65eoKNkaWhT%2Fy%2BYZSTmWv4pxVULRvPVe%2Bncsc0i1uvrGJq32pU8%2BBuJuGVTBcJk%2FL6eD9kkBCnfe%2FbODrFRe6KONmgJlBkVTxk%2BsgcCwZrvAEh4BdWQ1vpdAz%2FmUr9tfWKhKb1K5H2OLbFwZ08uQLLcosSv7Ah0kkb3Lu4k4t742oAM5CdVwNfT4%2BzcpR0ZZx5X%2BPf2%2FA%2BaWsRMX%2FowEZCkOk58X%2BlEwI1u0CI334oeiMk7mquJpIVWhgeVc3VAV2x195gbZZ4uPCzgn%2Bfc5WzSzp2qobt%2FhmFMwP9MAXVy%2Bp6B5FZmHoiYVXkIS%2FI9bIB1sdsgn2N6byg1SdnqZ2YyCC4R7LiavoOcv3snjA5VVJyD6%2FQbTCmgvLk7MxmXxZj7vesC5AzjJxmF6jl3C1R0cCaPtOWY9r9mYYEP%2B7KgHkskkQo6%2BTliZIjMjazWginF%2FAfv4F4NXaT7BujGhIsUKJkJYvUEp0mmLPnHjnVM4a7hZ3JMNK3r9AGOqUBtj5bZ%2FjmZOloIRZ1DGS45tHqQh4mzksd0CLD0%2FgbmFanjyAUEtjN3YtHWFt%2BZUOf9XRmWiRE8KoBoBSjQ4jrdSDyEQ8mz2ZfX2Mg6C7L9PpICfQvZPNd%2FiUnfzOKbe7w9gLgEUjHb6AXOrnnExVecosjCxBb9TiiqDephZzhcu0q5LvzNv23ePcELMBUL8Xjk%2FLXquaYW1Vf2uW94oJpBGJUzdec&X-Amz-Signature=39925ffecc79ca66445875de9a941f888964251ba43f7a3073cf609548309f12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667NJRQJ54%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043245Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJGMEQCIEycaT%2F5USf5aV0PYuLKitnfIjbITKqXfvlK6%2FwIsY7NAiAdv%2F86Vi5TBKwR0%2Frt33DYOf0XjX%2BQ4%2Fab%2FzZyAk%2BnhSqIBAjN%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMePU7yLEBAoPfVOl7KtwDXeXIqDNSkoIuE56e37lypP5ZRHOBfzZ4Bq3qVHvb5Z3sf%2BOKX6gJmfHpNmrJ6zUpb%2FNU7MvSL1A4puv5tHneAt8xgb0646tHulAkZ0nVmsotqN0CVA%2BqBv1w9iCkFl2BZ1WTdW0rHHXCcV8Klw90pXD%2BIAIwjNoHsuZ3nRJ91qUqYMwIvctAYRyqSYzSOPz4%2B3%2B5MPucnmaFf3oWj0KtKjLDcI9bjiejqhxrcM6ZV1Cs4NRU74QSlGFzWKbfNeIN40pADaJAh3jL9XGGv84k33RVazavv25zFPSe4ngWZzCHKY4sYYjD6qaGSvaqVcIYu0H7w95MK0pZqywbnrplHcv8DhStkRYyAEbxD%2B4Zw3GCDSsGUFY5SxIXVQviyLcdur6lzlxdtv9kJ1K5DuuI8WMvzh3k0O5MstiPW5E%2BFqulTmGJJobFK2E%2BRpkhvXzwCvWmwIrfSxaw5m0ShtzsV8o0U24VvjMxFToZRRA42xTD4oJiZ6k%2B7ST%2BvkN3rN%2Fn031H7O6ajl%2BCRM0YMieUBrhywdxm8x7ozcY7%2BLAntvBtU%2BI4QZ8Kc5FHrmG9J73viGsVSYDB%2BiUQTRirWwT0bs%2BZqELC2IU4K2KF6ebCqPr%2BFXlxm%2ByCZQKovX8wirev0AY6pgF13qARd%2FQzclbIUV0K2KXlPD%2FGgDxBmDG1l6L0IdnJVRKFXXej98SGLGM9qnWrB1w4%2BjXPoFUVI%2B4gRkX1Ds6d9rpx9KwkjvtiniBbl8iioiYqgCm0k9yd%2Fl8QkbtAqoW91vksS7kYJzwhTUzBg%2BSX%2BKkpiB25eAWqPZdzpjb%2B5wgTgBTJ58lTqeOU1MRXg5QZhbTiyVa8mWlTMDcHI7VQT460xiF9&X-Amz-Signature=e069144f382ab3a85fa33aa6bd181e9c3923aa48ba01274a1b7e44cfc59b3173&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466453PIN4H%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIFU15N6Y8rOJdV6ZKBDcMggNSKWpZYjtPhT%2F2oF1nRXPAiEA2W3d0A%2B6Oe%2FrgDRoMfoV%2B7ytxyPS4pt96ZY2%2FuJuHB4qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDB085VGXMF4yMGvoqyrcA7YOQtOInMEkAGTEGyJ%2BZsWA0Ay7yIJaiqDoXt7Is5d0nPdkBAnnAW6yUj6dxyLhuFJ%2BWvJdf3r3FoqMs%2FNLtaFq59DywIC570wwuDOSqeyLVZY2u%2B2pF4TpqdrSWRZf6j3K9dl%2Fd5lpggl4T5lClDFd1mWZsx3QZlPLM1V4XoKj%2FF%2FMh37KkwR7W63NNIZUb1qrZ7De5G8KV5rbXNkXQUBcoPG5u0xPadHJhwGWSzqvKdFocc3SvAImyGXjZVfum4rdbRXfJhOw50jL9oXsR%2Bh4ZciS0BIjVZDv1y3RAN0yaAunz8kFiEfX3wfGm5eCvbagF6doum8nES7ve5qmY3waYmPzd8d1U517joEuTCuuv2i%2BoYqlYs67Pyff4%2BARjvaxvI%2BGKWJz7WpdvUPnb5A%2Bb8iGYEdkBLBM7nE448q11eg5odI0Y2nfv2puKyifbRRJ7xhsSkv5Lg0uHPjEov1B35KfOjBjCQALLGICO3PIXIdF5rgrWeiUt086uvPSOMlgoX4ETBOlZr%2F6GnwuFHy02KLKAjSpuO0mufmgpFejb5U%2BevEBRAn3Q6N2ZvET0LCwIfiSoYHrGX9wwFsmcJifBajaorQOuOJFBBfQ3fQrGBpqWQpDklO7%2FFi8MIa4r9AGOqUBT6GH1kH79G3THmDZjQSe%2FKdKQUAnQkWnCEtJ8R9aNw62zcJG7QVRdeL%2FDMwEkNcRCnYUW9RXJp0qKnHjEhe6pE9A%2FLKeR5c79UHhV7c0ljrDZz9Znu1OlOU87ugIcU4tORNAPkwS8eJPHmqp92Dw4ZBolGfwAJAIT4ZvYMiAbuE%2Bmz9SyTcNTuXYPLjPtvBMC9VGjfQh7eyQyOCJn%2FgLKXZauhf%2B&X-Amz-Signature=1a4a73f14925bb961b0313265c4a448df4d93c539c78f77550ac7e388510a4f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667O3GRQNE%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIFl%2FlXHrHnAyNHY2nt5q%2Fu5LPFge15oh8V0vDleYgdgWAiEA%2BL6hdFUrnalSTZXAyrfRRd37Z8wlEPcCS4bFbEbuoDkqiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGWhE7dKGnX96vSECircA4wyEOgh8YNlwmcF8FMfyARBphjNX3fBN06%2FjHnuDntxsfwVXFT%2FBm0KI9emacHPEb%2BR2QKXbLaZTSQAzcmB715v6XH9zXRlBeWfNk1FjhaQrPfNzhIhR5Gsaf%2F33M%2BQ6pnFCn5KpVBD8baKtLx7CRTkoP3y36oIAcOYFCbVJahi06ITKtB8ak7EqIdbVnYZDw6DB3w9vfezJaW1x2o99kDkBdvGqKrWy7SmxSXdEH7NECYOqol7harsaBtFN6TnMImWoWK2gLoFYX%2BiXbAN8n8y%2FqugKHsYCd27%2BDFndZeOYIRd0zg0Jam2PnSUQEfgUbCGPh9igitGWRk8fxUB9NXSOSXBdkNQRZVhRjNzDBE7g1LEoK7GwlhUiELyhijGm0CO6JfXr8cBiQhfMfhgbVu6TDVPDqcedYeoOCJpc5knPUFXZv98AhMDfUYijJyspmLCYap2zjYDRGyStWZ1xql3Sixy8kCoFG2xGpr3GfbJf%2FOjTX3DP18P9zcSMRJEe2JDyuRUKM%2Bm48J7GjY9GdSQr%2Bi2tG%2B8aMTrfmYCEd9hqEzkhkVZ1D00OlREljWyoE7FLiulOU6Q55%2FlyQfHSvvl3RuVuTVSd2dPOtpabA4rI07cCrf7392Ta4R4MKi4r9AGOqUBolq8BWC1FD8AFqVZN8PW9Ez3BmIpeb39QyJdxRCATEwxMhd08KDOUB%2F3YK5AHdjXfOTd%2FBVy63Gf22T%2BgD2HVM5RqUtQKLJWn2bLdd7z0ztclBR%2BPrI2ojQ9j%2BGMArx9csy3ccSvkgQBq4w9DdWgOC9E7Ukr6Mh55KOysP%2Fkg744R18UvGX%2FsWwl5pmk6iBKaGBU8eW5mkN8VXfiqxDjIY5jM%2FPX&X-Amz-Signature=45dfba05d164e3b4a8a61f9d0a11339bcbc134feefaa4e2215a9d2c2baf7bdef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXWMGCPT%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJGMEQCIGFGSRTDjbPbQwOVT3YVFAsJMp0EAklsydrTkd1HMbt8AiBfEDuWzvjBG6e1tu9YPHbQM9GUcTj5Em8Fn4Xe6qQG2iqIBAjN%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMfqF99ApwYVxYsryVKtwD0vmq%2FxdVNADAeqlfSM5r2Mz1HFrFYnLWSPcinS0bxMDxZJGfmcSfScZtdXrjFoMegiuO1qLLGwQunKLhJMww1u1fG9aYgZlIzl8P0dvQAa4DFG%2FMqHXr64yOvxGmAfUhXptJ0yCFPFFceqVJhd%2BNDUHFs0YJQHlAb7sttaK4tQDfrFFZwyNoeqgXtKkCcpRKJaUoXT4DDf8%2Bms3xoBQvEMQIt9Fnae2k2hcEI1RdI6eiW%2BV151Hgf6FHweZ3SK0iQQx9q755F0gz2kTgp4NZAmTtCcDugnyVJIS%2BtChMdyOOC22yDtmdtR0K5%2BrVtfG8aDPsBU6P5WmGWuR%2BwO8G2bHdib%2FM%2BoLoZ3v60KtAjMWX2i9vWrUKtruXRGPDw04KKLmNnL4RVm9u3czowRqHe5WJmRsjJ20FmxpCCWIvxxRcNuxKBcdlMWR6gxnutw6gbtHnmOJ6C0LzOIfKFqZMDDKAnvS12jJ%2BriPX1PDeMBKkv%2BgfA%2Fhegv4xnjKJ9X10pH%2F6Pu%2F4esC65uH8wS47QflK0a6b2PhlHifWyV6gNs47baN8zThG5niXR0E2Rtd%2BCywH%2B3WkT3w2xen3ZZVhDyWUf%2FZwz7LcDMbgepJPv1C1FmpkltUWFnShFaYwx7iv0AY6pgGKuE2I03%2FXhp94gKyor%2FTlsOz26%2BYLdBgA%2FI2J%2F75atIFILYW1urvlQ9VWX6TKmeeCg8zJP0jvh1rUL0qzFaCCODbg9H6gRPTsBNU%2Fa%2Ft9HSfIjPR%2FG3GjQ4MrJtbB%2FMjNSDOSCIXTG7a7nkUVj91mGsJFsEsUymk2kbblP0LIyee9HffHsu9SEbaM%2FYUEecMjniQ4yj5q0ARi6fm42bMymfGSKscO&X-Amz-Signature=5fd7ea8d4f082c5e411a77c5c9b0e442a7a78047792cdb700e8fc9376273df39&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666AOB4I46%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIDQwveZufIsnTVXK2MS7GtvLbXpoJz6ae3Zv%2F3McHvIfAiEA2AMNuagsyiJt30GI4Jbj9RUJN6p57vK4hUc6cOFAcg4qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD3EHJ7ZIhHRSHvRKircA8v0jq5AdLhzX85Ax3hSpdV5%2BZUVeB7R0ygfXb4f7Dy%2BA69hjfcIy1hYzjqRob6GZemuK%2FhlOZRd0%2BKPZBW97MBTJgCLXS%2FFpj3Xg1TFlEUk%2BwyR98GB%2B7f6HYDu5Mt1f%2BxZVZvg%2FjfXXbDcmJiGPSqlWZzHYwecDoTKaXf0vP0EWaZ7XdxAwNrh7I72wrm2%2F9fVKmd1e3Us43xskVqwivUGIR%2F62LBwP6rA5BiWQXMrdv0Sm0vg%2FJf%2BIfYnbHbxxzq1i3DkrHItoym2dMut7XWwIhFE%2BW%2FcNW2nPjxYHS%2FqxVcFRjc8d8DSZ2%2Fp1p0F0%2B7oRe87rNNWjq%2BRfXYWMNF0v1EazHtb5rBX9di%2FAKh%2Fak52juSMj%2BJI7WBmipEBLlinds624mYHS%2FGuhFmCyLoV8tpCISDZ02x1XN1QUPxfayF%2BhRDbGc6uo6zZ3AVwjH4PHgkQlWl6hEOoj3Qv2Dn1Nts6dgtxCo5b%2B4vRoo3Ul8nWkmDEMySKvAOn58CMLGGPdbW21m%2F2HrMBG1tJAYcDHwZqUOfT6ENQjIqUcYXEoM%2F6LAnErRp7QxkReflq7Ytkfeozt9Q%2BEUCkrNR%2BG%2B9aZ1WvKx8d7DsfUkSgGumd4KlT7uSmeqlk9%2BPYMIC6r9AGOqUBJnrhwJCfkwDkQDnA0ctK0bsRpMQX0UCry6NXsRWPMqVKZL9W7Me1dfnhxy1fg4uTGrljWoDPU9Fh%2BJdQhdo24YAUGojdrbxiV4VxnFdUdxxpkkBU%2BDX3YXhZoMzAhlW079chNVG3hUrTmxsOITPoUjlodnddl%2BfCbJQJOH3gsIMflr17fhosfZOwR3IYpEqNC9UpJcbIU03Whgh86uYZ8gPSFrfK&X-Amz-Signature=b5b405ef3868ccca37f6675b3a7b40cc701801d30f9d2a34ce8c886ee3c7a295&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664TAUAMKC%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043248Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJGMEQCIGLS92nBUn0qZLkuVtkEbmZoH%2BmU3H%2B0vAGQITxnVjMGAiA3Ov4N85otmV9LI6Hr%2BGmWTTWaWzucm3%2FpilDoHPLZYCqIBAjN%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGa7sRBj6GulUiIj%2FKtwDa9GNJEb9YyEkn1fEAIiX%2BAIOBpSJX4bDt2IgaYTZQAub3Nw1EI%2F%2BE%2BNiTaa8GrveWa2fo0n8GTaIc4xmvtqTx4wfGm1pc9%2FjAM1AMejsMlJw1Z0c9yVwwZrm1VnFieIrmVkZWAG85T59UVh3l7vKKpd4JM8E0aR9TkVMjmc4APeZ24pZyVDR1QJfBwmb061eF3wGPFyjMabuGf2NuTuZLCMLELxhvWoSM0T9cw63cEoOmXk7C3KBgKNIY3rPW3wAgFB%2F4QpfpKXKHh4NWGnuuXUZ0j2poNtpQE7DY0SmQxyWe0JHoq6O46UdyINUQZnSVzmOZctgloqFzlL%2BQgoLWkwfSAXYkZHlwJgvujvRP2qvaQ%2FaowXtgdsWC7pOkWlPEclgCL5ITb3u1G%2FZ71yNVfLwY17zVb8XEsyQuQ3VJ%2FMrqsNNzBYmvXKmUpw5tNeCyz7LneDomt4e7%2FsXgQ0om8MG6p8X5Y%2B78lSo59gvHOQS2qCb3TrRKiV9Gf11ZGBomIegFbWtbreIGXIdBts5CO1RtxP5Sr6%2Fi1RaXuNhNU23YGk9uES8JdJXtwpdAL0o1YeJzBYex%2BHNLoSErj1gj8pdOF6IaP1CII2io%2BIyLRqvQfx%2FTyn3KxnMoVEw%2Friv0AY6pgE%2B%2BAYHACct5n6tU8l2ybtkRIyJe79TI9zCNRi3gia6oA2t90kIb7zvSIv8dauaruufwZk%2Fno5hbbUSPfEgW2h%2B12OyY2K5MEczX%2FlHDynRqfRXk2phx%2FqwAftYf2SUaXpycVEMx0DqtZFK%2FECmdxGSi3RhcR57Nx78ojl6hk6mvIpjXW6xCCoGPECINe8d6zDo9p%2FO8rowl4o7et9SrzTPPKKHKFcn&X-Amz-Signature=54e46e3f9b847894ebbf1c8ff79d1fcdae2f8865ce8525508475b247f4966363&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WUQ34X5A%2F20260519%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260519T043248Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAQaCXVzLXdlc3QtMiJHMEUCIQCsZ6M3C0fdDf2lPAFdu9Tl%2BmfiXg5E%2FoB9HFz0njPukQIgFlgzeRrf8XBUEsCiZS%2F0Z1usKTelUem6QI6p2MSXJh4qiAQIzf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJXiQfE3XZar4%2BRIhyrcA5Dx%2FY1y%2FjQxatEnMGLkYV9QDkoGW%2FhLIZw3RqWo2rTBG4HgA7gIaOzCif4P0ZahVQcU4MTfcdqO4B3OseVKuuKMv4mfbwnze771e5yMKTHsttNdWWdw3a%2FciCBqaI%2FgJQfZLm6tXgAuUMNVK4An6lTPi02n7qe%2FQqOh0P1oNgZa7Lg31Igev6v7LEgYRGCsDMRsETMvnYssmEgPvhfg54c2pChWR5D6YCb69YcIeu%2BqGdfTfpKqagNm6%2B8a21uU4cfvBTouFnj0%2FYHrKg%2F0CWj1rycf7bAQTYELZbX3Esk%2BGWmmuTkOCv55JkUrShXRI7lMx5LaB7ALI6jjkZgM0B5yVlH%2BXAeMzdfqmDbcO4rd6XMEqqzEh9AKszXxeBZAy2YW2NaSDz2n06PsrWaRpZgRv7o7BvwEMNA3c87VaScY7w0rC5Pu3uNrjOqW1qF0ceVTVhPu8y0v11sAMQPBV794R8DOCtl9OwKugJ6LgtzWl9fB%2BF%2FWueFSHb7gDeOHZ1GvRnLMoUC2tlt4N332tFbVJ8RSQrMW3OCbpFpFK%2Fksdu66dlozTga4Ij%2FRupPGPGv3uJcG8wgIO%2F5hkInq3jP89FkwfTBUn1jRS02UqKA4%2B%2BCG36siLHBkD8iSMOy4r9AGOqUB3hAjIq8P4wWuoR3Rbui%2B5ZWEJNPMWDPZEWdFL%2BSNSkuBQ2IQoFrtZhhjf0qBZrd%2FhZlvdDRARujn8olws28UMgZTlYx9VtPBAj2KH6xqshlSUYsgPrN3TLGj6lGwlfK31z09CaRjvtxwlNDx%2F0q%2BE8ckU%2Fk%2FNGVc%2Fy8kVem%2FPUcrZStpKJLj2cCjcRXyG6jXV4XaWHkhkgP%2FxxNhBOVTZtDWOs%2BS&X-Amz-Signature=d8226f9e7938d4672f60c9b25c61c978226f1dc35c32cbb32ddba027cdf0d8af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

