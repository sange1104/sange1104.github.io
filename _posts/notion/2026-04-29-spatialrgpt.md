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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XLRNGTL5%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034829Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD749Fb1oWGMJgGgXtRt%2FW1Ar7PD9Y2WFx3iL2dAYIiLQIgI5Gp3vKYwGSKhaQ2GuyYWX8fkao2ogwsLqCSxUvK3YQq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDEfLXxb1mTG3K%2FgefCrcA3HyCNzLVANCLoqeRRaLgSACtIDRSWzKKD3%2FbjDUam1S6C8zCD%2Ff%2FcUmP8OQ2605wCNIPt%2FCkYlKwCQvB6kFEQfiAvzOqtSfrOZLu6xKJclCsX8O0tl6YXhTzbhwwoO3NT4yW0oCh2mpdk6cC5WPjOMmsA1xurur4SZ3Kmuk%2BJi%2FLvnWWDrPKke27cs5XeeMM9qqLuojacc9%2BxBU9hzOvGCuMCSXDCIAK3SWG2bp9J0XIIk0rCCUoUNwVu%2FG8p5wRL68kyIbxri%2F9dmH6t08QlpXv7DaxItnyjA6SBTPVjxpfhwOU%2F5iD9au3GEhQpVj4KFfleoTVg8kH8%2FodIs0aXTmTF1Dab4OPz2peGSJmlwA1rzkifssNyM39TZgacKa2UiM0EmXjWXzl2NS41eXp5MQCHIqQO6IaDa5aSrSiqCmPrUUee2aVcuwXqW6COzdBtP%2FCwJSV7zzxKSj84VJ9ybXejQMJr0lLlByOyZA0hjG7D93ljp46JDYiW03NuF%2FaPNw10GGIO3224HvHrB9Q%2BqCQZrp9IvyxaYvTnmq1A7fwTjGTXDRW%2BIzHQxPYuA75Yj%2BTfVWccAci0NVq3mTmMg6rBsGM0gD77HuBOmWi5vbnozqGZRFus%2BPwPM2MM2n5c8GOqUBuSS%2BCXFtrpyUXQZ06jOPTHWyeEm4hKn49TiP4VpfSewVftrDSKlr4bpGfb4yn6Tmqa%2B%2BRXNUrAYpLV8g4uuKwjUdWo4YJH7mwC9FPdLZfxHB9kcq%2FZtT1hZZlDfk8V5NT2j9Zd5DGaXQx4TsaFgCk96e47xmBk2tsxTPh12ask%2Bcyi0iSq2omg31Hvp5sBVKb%2FBLLgQ9o42ye08AMYhkv%2BAEnx5v&X-Amz-Signature=85a33fde84240fd3bfa215a67a301e575939acb4ff6f571ed21ceb9079ad2fd2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SXDMX36J%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034832Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCYGcgPAnYLOVlndu3iBbVn7r7C4AJLyRn2om6kufw0sQIhAJ0ojY4o7dHPqbW5WHd19CJCux7DZ7rZeNxE8NG%2FHOgIKv8DCHsQABoMNjM3NDIzMTgzODA1Igz6qycOIe4ToQyET0Eq3AOAnpCkJFbQ15GjECNCah3PebNop0LadIjivO32%2Bncw%2F%2FmzBWAi%2BMjqiY1nUPdENnyVnQQTt95pBXfI2dvPI%2BgZFusVfPZoEKOmR9aBAgfCdotr7c3B%2BQXbg4AjKJgLhA0o95cwwCfgwQz30MO7RvXV8pVqkLLFw4PjpzluyyuzpV2KXoz5oDUl%2FtdWOz%2B2%2Bw4tguIpNc1lRb%2B%2F15hcmpi6AorYfmC5Mq7vj8fdaK0Og2V%2FROJyjIxC5Nic%2FZ0URxee3KeqJ1a%2BIBfNKPJzLQk105y%2B%2FWDOt%2Bu0K4jS3mKVprCIYgiyeD3cH5fF8KjJSHG09sgash2jW6tFsoFMCxEy0vFll%2FDntoXXsVMgdZUZnK2e7gNVM9rA5pWBWU%2FoDHvRgYDstHnORmwFIa3t3Q1HzvwNZ6h5v6nOah8luIKS4GC4CpbgfIiLD5SrPKhza4CO6VwcRiJ4PZUmg9w2UTqaclgDih781OO82k%2FEBlqhWtv7Rb6WaCdnhSZgbdz4PEVnIrCF3RhhvjG1WFiU7AXFlW3j2dqTKToOtHixQkTF9%2BmlLfx31AJkeaU%2B6jSeDoTFa2eh%2Fw7Lg4GSdy1SYzXTsQJqPZePnTlMlBkO5RPOKCtzfJvUuYvNAfQWuDCkqOXPBjqkAd1A6Tm97Ohj1luADkdCv530s5yqQqhtIlah0bHA%2FUfcSS6oe1IHEoJZSqurYByqeXnjYGgpyS0j1mkcJy9CGvxxhGJdb7EWwkf5BIF1T6cFvClY3hE8i2iLv2a9kh7YOOm26%2BcgJloJ4V%2FVoTHPPa8%2BUisG3c4fr0KDO7tsjZTLuENHn1kznU%2FWekiIRJ5fdiRACb5nlNkTSj%2B41bkY%2FUxFXaOU&X-Amz-Signature=1b327daac4a98654a12dfc11692f56240eed165184aa482a018e6c3a12f84ba2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VQSJT2AK%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034837Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDmnt1f3gvhROq088PJFmncHtUqgUgvTyrMp%2BQUAe9bzwIgbaIN8iB%2F%2BzTfoOpXq67aEoJ2cb4%2FU4GEotwSG5LYuqAq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDOVB1CPT2r6qIR0EByrcA3oD5NbTe00daXOzn8yTQI8IKuaDHAeZxnavG56Jim1uTqE60KCA6RuJv94xV5Pj9sAys7O1LCj5TcNmUJnwn%2BnVI5oTHRlTmB4fcfe4rdoh5ltnBUSGiHHmsYASHHPQB52qFVB%2BoSfPYDlZLIMS%2FTjQyqtaguZE7vhAP8zQqMcCsPKTktyxO%2F9cKsX0uc2W7wK14PPDqBsw3gTXj462ehflbCF57gSG5RlyNu9yQRqFW2NoUep5m3l2uw1gh7cJ9Vgj2ZsHyWe6EXbkFZea9dQWC%2BzyvnTn0x8kabBxkgxrbDcWaceHJI96I9v4JgXnLwwbS1qBf8EolLv9aehO0MBbiZBebdCRgVwoqSrSbVwgmZ1LPz4czO6Xb83OYclXwOU%2Fb6cAoSqc5Gp%2FaOqgLkOti0Pi%2BnBXHOC9c8%2F1Jbo3yYNmlmkN5vBShd2RLl2Xe0b67pyHmnKDPFkLqugGhVPZs5rDmWS0kRtBR6BK5n42zHrieSfvWHhqinUZYnK8%2BLucLqMfZJL%2B2pOV3QITv%2B%2BIJCFT3%2FhT9TBvwc3ck15ED8x5A9M5oOBZM43BM5vR%2Fk6cAVO4oIiN7pAXhJTsq5dGnM10B7zCjnGmMs5%2BwVp5HEvaI9%2Bp3j%2F%2BJz9RMKCn5c8GOqUBDzFv%2FJ8rM1t3FgbCE8gxLzGlTBRczdd1K9DoPI%2FjQOZlSAipzy%2FNaAcwSmbGbVwwm7jAmX6YjmUu0sqO6iEfdg8SKrjRYd%2BIxQdDXN2avKLK9WDNCV3T2vXfUrP5smKft8dBPXg8i6vh7kPJYR1VQb4LtV3bm%2BDWAZnfOIeKJuqGhbgvESUSjuwYbuvfaRB%2FaksBA4cVYhZz%2BKLDc3%2BLaPq1tX1i&X-Amz-Signature=4ebbe64de89d08d9a88d8e2b27efc9ae44a4c3d7a9425db3258cdb5480dc16f3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662C5FWDRI%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034838Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCF4jpqjvofYUWy3tK3%2Fj544NPPMpNzG0pSKMrirWcAugIgWmDf4DyODjBx9cr6U6tYfDxubTlslP%2BnbQ7KdNJc5R8q%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDCr8YKcoQ9YpRPYPASrcAwwvLjcc13%2BFilMZfP3cfqXKQPKt9KJJSXxYBHEXo%2BoiYpdnEW56hoA9SICOeJPrmM97Sp6pgZjS0TF0LzdpGejutr%2B9pyIxuNVmm6k5Cq8Jiv5jN%2BWCyQI8BrFoZUpSWMGxBmVR591yq0EgbkmbkWXk2GgN9yW6iBxbUr4CIC24gf%2BbSuTjy22XH7QOyFfy3qCXXZZqbQIzvOUCII8cxJ2UnAMMcamBDw6afS6MCzvK2DFnaZkprW%2FT49NAD8sKqo4a7oWnab7X0uLfDeDrScnYKybCmIT5EJU7pEp7ZMFycC1%2B2woxyZHMMNsqVkz56%2FKyVAwjb81daM%2BIO9J882JxqDxgVyQoljHR8IraPJFPT1nid45ee3Tola11QbsskHkwPyH1PFBTSdwCTn30HYsZtqGZSGU9zt1oW4lmTnstCRVY2EnWHNhCqCCS2xir%2F4qFV%2BXsJRg8%2B%2ByMBZEcJPpAI8X%2FDigspMWQ7VJv77nv7dH2DsUOVZScIQk%2FOU7ckZ2sbwKaBLzErQaiLcSCImLB5zrn%2BOzJmrsKKfyguYgBGsKfRmcY35sJB9BO7qMkloFDfBf0xTUkGmMikmXs4pPf%2BOqZtkhGV%2BVczr1zg2udEBgR8kyNZwuq%2FXphML2l5c8GOqUBGAvrXt4UQNBZe2PX32zzJ8BHU8vNHQYC32unFpJInySgM3bKInU6BwsQtX6eZuIH759UoSpIvLlToWi9HCf1WJ%2BH4a5bb76YYK%2Fp2verK0A9lxZBSpN12cfctRbUQvDmO3i%2BJFaT3JYnpB1%2BFEn0GhnES%2Fr0hadQ0SG7b7eGtSlaMmKTN3l4L5D253de566e2IDD0lx08sDF%2BzCxQg6KHH3yujUk&X-Amz-Signature=18e63e875a554da8d93d1696e854daceaaad48e3629ec0e604034e560bdc8488&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZBMRZLEK%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034840Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDtTQZ5IYgN0oYNm%2BlrAd5FKaUB5%2FlcsJGmheCg4Y5YlAIhAPRvNO1IgtDIWL5sPR13Z%2B3ptEmhhpTbGXkYpPODe0ILKv8DCHsQABoMNjM3NDIzMTgzODA1IgyyP0FYmPkXJFeWT%2Bsq3AN3X%2FxrWCBj5TlHjBs2LVwr5NtSiK9R35Yzyjz6X46WRn9lVMDVLQNqFC72qV4Icll6e%2F%2BJtzh8DpFIbNwKpM4jPN9ERODc2izyK%2BhCGVUaJy0WnnTzz17tr8sWFqpWAU0ivRGeMhVEkarir99iRpnOZ91eb0AfSGMB9GJs4C35ft%2BuIadDGahu1bUXy28EN8MKaqgV%2BKZbifTUumNZbpDTe7zqeIRy6mZ2TJnHnLMZL8RwLc%2Bkor7Ui2b3Dp2zL9yG6JE455xtMjhI5ITsfADtbL3dLjc0ODvjVr7Y%2BE%2FotpzXQjKOiUdgzBJsQtAHLmJhgMZ6A5ugEIkySip06RschRsOWeltl%2FzL%2BSUy6laWeGGwS40cQEFb6wGPAPPOsXVR5%2FMYmLM6pQZw9NWfmsPcYNpbYccA%2FdXuxcMAc3PAlzizQhWvmFRr2bzNPwZjfdkd5uJG%2FLWUsCi%2FsYE4W%2BAFz0Xkb%2BenaMsKVb%2Bo0MpJZ93yx%2FVWSGpf5aFj07DvS10107uABpxb0aQHv8k62TNdo%2FK0w18v%2BnJur%2BY9aHhnMZP%2B0YXh6Td7jG%2FmK%2Bfpblu92BBFZO%2ByLb2jr3i5GEPZ6pZm9UaMkNrO6%2F7OBHEeYShuU%2BSw23T3GiZEJTDSpuXPBjqkARBO5DXtXkawuKzM53J8rrecGHxwu0bJVyH2A4U26OG9AIAB25BBxtJtI3bsHHmEcgi6YVTOwTAYjyDO9xCi9SGK6oR4WqGCdknmILTUsfkWSdspXReq7LfvFDrS%2BdpgIMFkgLlwlZgMaXCqzDzOZmMjcqk7iOF4exXCsTX9r6mlNYdhX84f4zlnXRnsDoDN3SGiDhp07y4LAVnJQzHS%2B7rasSdC&X-Amz-Signature=c21bbecc1ad373b5414efcf30ee96ecf2ceb95c0f88105dd527dfad9c12bfc98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SSD7X6ES%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034842Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDKG9JtXpiZmqc%2FnJcJ0b5ZDEqI77l7deOj3L%2BB60%2B3qwIhAIyaFkRYH3cqDGGqUYmKccqpLZTgBuaEsfZ73EemePrkKv8DCHsQABoMNjM3NDIzMTgzODA1Igymp5kKgaY%2FpM0L2qMq3AOmjRYNEcKwNyONM3gewsCGuY7Oh8wcD9H1fmnVMG%2Bfz2xekjVSLOMW82NYITiyccQfIFjOvMEN2qeXkpkGmZ0iRRbIOqTqB9XZ3OQM6Zuw5%2BDc8sN0R%2BngwaUpxx1TrlVHk%2BmJ9wZG4W5TFo2FmNBo2837TFQuEulayr65e5PNfpLbd7LGPfHoJwhKaIDs8gWpOCU1qGH7%2FW34sZbeGYSq8i3HBg0%2FOGaqwXG2RoNNSaYev1vmllzfhJda%2FqrqvRTeBxmmvvJcX3K6W9UPI6MtpXUFOUfMsl%2FT4g4t9pSfAAhSocDFmGAT27pdPIbHU375eYGQOAg6XuW4GnYA20CLk6Z2lGBb7UXd4yBEm2Vsuj09Nj7EPP2yPsACvGNx%2Fv9hc%2F%2BgybjKT8peY3RVV032FH7PpztinadR99O0eMrWFJIdH42EWsEdRX2BResoP6n%2BJLuErXv9BuZ0rSEv1C%2BRmhm5FNFUASawG3gDyq6dVEmiIuABAjPU6cx6%2F3WRNOXOgyXMEi3pH0qhkH6Jr%2BtqL%2FwVr%2BPuOm8grH8tkvnUuNi4meCfW5z0Q2DAaWugUbSNju5vyayzSAxwrXPwYMRHFG1YPUSD5ZLVJrkEYAeU%2FEFyfp%2BggjmsGDxjbDDGpuXPBjqkAass4tPfosrqJuST53Ush6lBNLjWAunhNyUBVT0y18In5zgWeRtAAx3z3pPh3wKiGrskZYe8pVSbNTeMsekLrwknlxNNgdBNNlzGVqFGA24soo1yajV4nNvMfz2ta8FuXi2gT%2BqkKXRlsyz2wljlM2OiY3hS7iIv0ZnXTSITn4q2xb4OFuJNQdI%2BYACvG1yWCc2gpCuJwIzF72HYOt3SLvznBx00&X-Amz-Signature=c0793475f040e69a9e53b1abd735723180f07f947dcf5d742ddd32e17671e918&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665JZA2SSA%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034842Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBZlbsK1G%2BwByIMa64KPXJlS9RDIlsDNX%2BG2k13HivZ3AiBSbZs09DFESoA46hhqXYrlVL6pNO%2B2ZB5eQsfhV4uLkSr%2FAwh7EAAaDDYzNzQyMzE4MzgwNSIM2k5ERq7zvSheWgzjKtwDYocrswTmyChHE8%2BTE4WRaYklyPK0FaZYAlCI9Gu6B4zD3vjZrdyWBvr2LBOHvdxcjXpKaiO9NZprUQGSFyCF0LaFfaxdlY4NnVVOEsNAGUWKL5geqV4snh%2BKRt7CmPUwxpY1WEgHoOQizc4RY9bUdYSDS8Wz7THDFcQVtBosB59vlopZBq7ZdXBiz%2B%2FBaSLPV7VLg6%2BQrL9nNpCDoEh0tur4rYeMwXvCWaJPY0UZVoi%2BJeSx3SLcIqwsjO1rqIAReRXxC6gJQiiaCOh4qBxKWiDGCEPp3%2F9xH6WDPgj2QfIGG7NNyt%2Frx67pVubI3jK2PM%2F%2FleMjZMOYS0PdeODj3P5R760p%2FJqPESH%2By5F3wkd0jTu26LUR2VcooDjXMTChtZotdA30feLDNn2RMa5dFSr87eIQqD96X6PdPm%2FMFmA6My8TeTs0mtuX4NaayoSBf5AzhiSR%2BPjZ4mrYB5Xk0USEb6rzKlkZypLxpqrXThbS1ptLNJoEfKGf0gmwwHvvMUxiEPDt%2FW%2Ft37pK2nGrLCwxCdBcryZzhvcxyLJ9p6gDxA5U%2FJErg%2FnThzsiMSi0uACe2cKzvmnUOSoOEQmnTE7sIvBPidXj2rBlCUvfrhYW59m4eS4t4CdLOjUw9qblzwY6pgF927%2Bhd6j7HVhH%2BPB0Z8qtTCfW1EGbBnboJYnAcmWZ2jexNYPFKCXgrNSCq1cnckueuObjxfAal4zUtZz64Q0SZZuBB99ELQIPAwNW7x2Lla21ugFgdax%2BSXliyt1IHUlrv%2FTXtcmLUwcLmf9MeHeDC60lzgUu54c60uEDszfSdiGo40VP4gQHkLTT4XwWESMKWjPgOVJSf5toXaraBApBN5gu9FB5&X-Amz-Signature=715ed025f0029d14242efa62eda16c09a2c35fb96d7a38ef88f016418ba1a993&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZFRPQ5XR%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034842Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICGE1%2Fwxt6Z90PoPPmERUWUq7ku3T5Qvfz25qxE6lLwHAiEAqLQfmJpqrzzltluPWFu8c78LKt6eGPSKiuvklosA2foq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDP7mFrT3z6gRM8VoLSrcA3LgmFfyg4%2BUtj97qqVHjrpAvlR9w5gWntZsQrTeUqLWkEaEFjk79wdg8iM%2BffosXU24wriWYC1WmT5eOelouzlAPDH5drxIVjkuZGbuvCABtBfOzV3zytKt9yuB2VMtDoIr26ka8MvvK7mopXbvqhguvLKq7%2B6qByaPiRy3WNdzBCESr5RIO3Y43jp8HbRgOeS%2FS5MZWjnRznKXiXan3mezUvQkWMe99LbZT1n2wtt4YonVrno3OX8%2BVa5wbpViF8APBZnQeK9kWUbx7CUl4kmtHvNYyvUxwBqAM7QDMayZVopjkaNadQSib4r%2Fg1IBiiF%2FmWu7VyrtLRWzvcOR7b9HiXmQBDwdyL5%2FZKB2la4GvLVQVXMeiNL%2FHmikWh8SVMHW5id9Ziq4JCkaJH9D1yOi7kswmcXrWpdGCa4qZfD4eaULJYBP0wI0dGF%2F8z8vuZHGxDZHtLMwUffZDixCARjubJujhE7aOFFEwmWSROwJ680tJuS8x%2B7SMwRqMx%2FUpeV0xGkQ2DVQqblfQcUcneCkJZZ5q2wQ4JUHtz3nJJZB3dN3rjiVePMavWtfVNm4DV%2Bur0A6xCcw95qfZJOcGdCFU9sFaImeKVpwcxYjMUuMlCLQVdzAGE6GdvstMPWl5c8GOqUBzxsz0aUzDoO8PtY5G92A%2FSSLtinYjRPak6tA8XHxRA6%2FQYlZnE3ABNzAJVgWvZC6vlkc2qtbAXOQTA34kCfN8HjYKHHTtNixnHHo8JP%2BxzG3lJTruUI%2FDzYJ47WzU8OS%2Ft2CtqADUa6WtSR0eBwjVADv0xtszjRDyWpEc3dtGlmIUHd3aO3Gk5K1DwAGrsrdYvBl9l50oWL5J4XV3StRgRvT4ryc&X-Amz-Signature=cb83c0d04dcbddacf8500e3fd1a6b62cce6a3c986d2e6ee344864c83d7c831ec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46647W5AC3B%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034843Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEbwlPn5O8cqi7ySkqI2D87xyjC%2FHCYCM1XF63vSNpKvAiEA1WBlwoAyJv1cRkI39pOhagwOO54z5FevMrBAKiPMO2gq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDBHdxRqQpPWJVenQ7ircA0JWl8El%2BbrPd6rioVwJr4wg7m9m%2FTiMfZQXvv9W%2BTZqozjhqeQxbJt8z%2B%2BvkRSDbxdCI%2FNmoCygfkMr71RnCI%2FfpdpKjHeJdyZNuVnSXdk8gyWu8OhfJ5%2F4BpeSXZlccCVl8HBe7UCp9ZPQBh2xWUr1Gkwy1tAFk4GyaxT9BE1UIrEU4JUxexVULOivwF%2BxMVX3XPywDGuf0Pk55qYFnrU7V6PkxtXkxubXhIcnEKAyJAiHOEm9cQiS0BRZ156A71OA1isKgN5sh4LvkF3j2g7N1Ay4lWm7%2B1AR1hrk1YDNdtD471dZBONcZV7HvGWIzzXl5%2FfsS6amPTHVq8Ar0WvXuXwHhK3%2Brfn30RyHwPq2wcDGkJKw%2B56mu%2BE3zu%2FOLuOJo0ls0P6JnfAvzcV1bmEKO3tKJC1SNzX3aLlQrtd1Ijs5U3La%2F1ErF9CMrShH2cAc6KYmK3S8Zz4uFzsHL75IfjNeKuWYP9Yfdyehqnuee1zc1IFJbF17wSTjjFcvSZK%2BhEIpLYNuQiexIb5jEYfN1kJJvBW2WmWbZCQXyiNdND1b9Ihc3Ij7gqksV51Je9pKB1fCFMTyYu3AcmLiiyc8%2FBzUglV8JIF38%2FJWrslXkI65ZBVZF%2BKQIvgLMOSn5c8GOqUB5H1pcJgn4SCPII9JSL9ZaE0E1514P7e5qN7WV35S%2BfU03sowaP%2F5MNgrSn4NPZP46PnoyWgdzSuHMnglXEPeE2hCghU5OScLGJ2T5q35C8YD8OzRGe56JzjXYNgGXepnLtsYVFbwLheUYPkznA2kgwfULjUwf9%2F5t4I7JkUDVY3FV67jqhCjn6ASuKwaeH9O4uFrB7pkK67USykp1NocOEXgnnHD&X-Amz-Signature=93dcab23207d7c45314a3230e126a60376dafff43fe6bafd477b408137cfce46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466343LQ7PQ%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034843Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDvZ88Y1jvES3YayRz2D8Wtf0dX59Cn7ONCH%2FBZhhDdFwIhAKbCbYUWkZcUTngssNaBdX41p0jxWTeFIlu9kEMwcYX%2FKv8DCHwQABoMNjM3NDIzMTgzODA1IgyzR7ic1dHuKIn%2Fkqcq3APFDGEswpp%2FCl94d2LCVGSaNjxMcS2vN%2FJCqvqizu0CnxNHePuLobDgxFe4A0THMdSc0r1D2CvbeKOcDBwPuFpNtMgkvCO5p%2BIJ7kmvUfPbgDBAumvGxZvqbnHr8xqsQ8R%2F%2BsNkub9hxfFnehOyAX%2F%2FJgIOkUPTx%2B9IASxNO3kHo03kYrUmZBZBojex5XwsTmm1ogn0%2BNCvVQw%2F6i26utfldQWj5%2FLGX3f65iYV0Jvz4Sh0FLMMIQU0KMMJFYKvmPV%2FDuNgNbReHUwG05a37vXlyAKKl84Q8jaLqlOsxbG4sytA0og8y21T%2BdHYBEYf8wyBAb5wHnAoLoudcCa6S%2Bf%2F7g9BajT3BlYc0GFs08OI397FilK1aKJMJX48g76f%2FbYMPHx8EOLOY%2BpwK9Ifq0H7E6HY9fPZZ5iE7jlgOIU95ZqNQu4s1RPAIfOD5JRdoHWPLVq%2Fr4XVSqYS1MrH4l5tcMEpWHpMz9O0Rkmvs9HFwOJWKPMxmGLAoDMPWYUqFdJhLwLlKjihnVtNi0Zvp98%2BnPmn%2BMK1VxQxi3sIHs3EDbifCv7DGoLMswvbjXBEZ7IKcW6LZ26eWMTxQl51tDmu3a%2BAUBvCRvkqzHl4%2FIoQSHtSWgDt4RyYgfxRRzD4wuXPBjqkAT%2F235nrcyPntW2CroSlYF1I6e14Q%2F3kn5TqEluBBqeW1lmS2TL%2B%2B5TqAqJqTguOtSlIisH%2B1a7B6YuQ4KGfh97rH30gIwZmlWHvySI%2FHeL%2B%2BP13vhQHe9fW6qrhRdy%2B%2Fi5rzK1N1ufX7Gek6kyIXV3UeNHCDf47%2BaxHx738lij7QihThU0l88f9%2B6CE25aF4RxyAxAVSWaVoK9gAv3V4HZixUHR&X-Amz-Signature=d1a66bdb9de460c81b8083e10753673d5fb02202102d2eed0303799343b0f8e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U236KM5C%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034843Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC503T1CHRBjpTv4lQcrMSo7vAYcI0PsCgf8kKdU5I5lQIgfTC9Ec9hOs1UYVHj%2F4KlR4WttMhlYDTyqkiY9o0l2j8q%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDEieq1ff0gKRc8fppyrcAzS20%2BBbtXINkDqa5n7OqbgUkq97UadgmEn9TVIqappRRHvKam%2B1ENxiBMtHSh1u5tRjTSg5ln5Ke6JFoyHuvzYqWYxaoPfVKb2VMuzgu4r8jkqRwf6EiGbWcA0cPs%2FsX1Rk%2FL412nw%2BDtAbGDkxKUJO5iAf9SQAOdp0yJp57BXPH%2FdOAMuVgDDlwKpceZ92UefNrnX5qUzEeIN9VO2GB0Ssks%2BOvaFPtHjdihLbolLkCn9fpaT2vyJIY4ahY8UVr23EdG4ibihSX%2FAJ53KVaI1MbGMKp5GhbuBgBG2BB8SnPkmkN3R1etQLyp7RTPpmqd%2B8gvgssClJ7Bhq5kU8oxztmZqBVeDfDMGyaEfVYKuW1AIubU8JNlDNazCx20BZyByAvshZ9uQRB52RkBBAy7EKRRWRa3VkScJ2%2F7BrSJBAtbFYvxA1vP%2By498WM6GSeqfHMOPkWhvUotf%2B%2FVVVtEW53OsXqNEYwKSYxFWnnLK8IL44kEqfNSEywk3XgGBjb3bomKmp%2B4pFvxawzY%2B7l0H64IjMXcEf6EMmJTLqucGbgAKUs9WcFxXTAPuXu1P7aCifbVskexxsKiD92aOaC33t6Ixiv7WqHtSNNers7OnvsPRMrwBWEdxtPMEtMMGo5c8GOqUBHN%2Fg5HJR829HHl7zxxwQvh3O2dO34u0Ks3DOPQZ3Kel28Spw3WsUL2lGdTtcxj5OHNDYAqVnnlT0vB7N6GNyQyErEGrTnG1lTuLU9wkuLXUtd0Wl0DrOId%2BQ13e25ldDDWVJYYyNA4%2Be2pKnfwS6tM%2FRKBuQiffXvzH%2B80L%2Fzb8SdP2wzYBRo9EyVlmDEpPlGMoiGWARSrlY1Hx9xlbLFbEAb3Ul&X-Amz-Signature=db0001a0263d06132e901a2ef0cb762fdfee2290aa8f3b0ba001707fed5f29b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

