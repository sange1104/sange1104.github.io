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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca70e17c-ec88-4a1d-b3ee-85a8e1838c2f/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665K43HBB3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044902Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQCXSCeXsXpBIcQYf8B50eqYKcHNWOq3c4WMBsBazwszUwIhAM6zFeQfy2R2Al4WwRH1%2BBlYb%2BI67T7BuU0i4AY1Jh3kKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxfLj%2FIQYRloCibnGoq3AONh7Ta2RTWgwXSks%2BR5EYsH2aZPSDFdbP4zYzSkj1YOPm1NPDBBnKHRoOO9NpUg2835XAaWMvIHhyplkG6H%2BzUz78%2BMyaEhd0kAYgLlAA7ry0Cow5gnxGXmMNiuk0T7KYeHsvITlwGD7%2BDGX%2BGQ6g1ujAKLde6lzKu9WXqt6DgajhZx6RA4V5zrNE4wNmFsQSOQrzwIL%2BGpPcbcy3ZMMz0nbWMgZdgLgF333ZKSS%2FYmaTHq1iVrkO%2BMpe1P%2FJeG%2FUybNOxzSdS642bI%2BJf%2Fu%2BToEbaYBSvJLDZ0KZBLugvmmUImvd7HuZlJobK9kJ2zDL54LLQpzDQG6nRFrIxYEw4SYQVH8LgzIpm9J8tDsHELkWPaaMC%2F0%2F0lQybuO53BKeFPKnkTlZ4k9gShGoX7eZvZtI8g4R4YVzkhsSSyrZ0L72kdSX1I9bVVZuyANjcHyp0TizLd63dqmrqTDtnxREjI3HRfKbFwNkmPl6V4opJ6PdVNzoiSSulof0i%2FPZCIxOlVFHqh3NM0xOLUy8GG2DYQcwQ2xgBYUKd7mmZ6L6Y7HptR3PgeHoivKNVvT7z48aRbr%2F37G3xCE0jA8%2FCLOg7sko76ojEuCXx9PjWnWgAUwkBq3%2FDTbvrpCkFUjDJ1%2B7QBjqkAZgDiK1ujfzlXykkXB2cnePOH7s0VygM5D116EiSOpXRroq2yVlkXOG4C8kjvxYXzeRaehQWbCprMdezVxZ20wqu%2FWo4I1SHQZP6gVYfsZHd429Om1LmP8tyn6dFU0Z42U6RLOPp4LS7FJvPfMOMJzWcMHiPodl0REV19QEiAHWZblOzEBDcNhdzc9PCVvWbaxnoaX%2BJKq8j%2FlKAs0dwE0ElYk2f&X-Amz-Signature=cd4237b5d3a40551d7ca2b86f73c3a113be7af91b0b59c594961a31878ca805b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![단일 이미지 → 객체 분리 → depth 복원 → 카메라 보정 → 객체별 3D 박스 생성 → 객체 간 관계 그래프 생성](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2a82251d-a4cf-4fdd-8386-c7403d4d8af0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VBEBLF2V%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044908Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQD%2FtLGODA6HJYhcLwmTRKkj76HCqr4vqEa3%2FkM096R5wAIgXnf2fRv1rlsmbcnFe7C5wo29LBiFG7Lv0aUBnJGu%2F8cqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCGM184bDnH7OtpH%2BircAwnWRDnPFngjKb8O3SjGrF1VN76aN5MijJ6y1x8clFR%2FLcKj10SP%2BLeUFD%2FqowjUB8RxoM83gqMGXv0R%2Bb%2B39%2FaHQI08mb2Bs47Q7vAPmJfkUqYoyFWxpSeTa27MDIVohikgejUStl2QNYXmEeNKcVOykNoPJcIutHjrkzMly%2BaqF0V5jhkA4b63oeYctWuSLA85sFDAl5i2NAk5OEyWiEKRnCK4kW08I6dNeD75wlk08ZTRqkSx%2FOiic4bmj497HhPTIlU7rBkNZDTGWlCnWYfju6qlqWf352AGAVrG2lum1YLBjnCbd1k5FjRFF7ipZ2vCcRsbcKjgclltWA3j%2B%2B%2BcsDdgFqmGOKYqa44sbJL3Ge2hM%2FKgs0JhqxpekKmdqpG8KnJMAFYMcj4AXpG7owU13K4h%2FiXq4ydyUhBA0UGg3nS04%2FavMIqVPO1Uv3hXwcl62FVOhn60EJO6IR6Gjbb%2B%2Bjv6tQmJBssbGgKy56%2FhmbqYg%2FzvhFLaSYjJrQ1NgjwWSYwqPtEaugTlPI3dcc%2F2x%2Fh9%2FIDFWwHPHuoO%2BBS5caI3f6PQ1ulb8tCcgCLvMQWj2TSSIy4UYpXF%2BPC83RxMqbcxO6P14uD4D448YNM2Rm1ks0dVf4BidZ8cMLbW7tAGOqUBcsfjrIF9lVLoHugos7W5Ol2EUsMu9CHh5YArZKT3NnFNNNjhzZjVuguCLgZjAhEGZU3R4GHh2ZehUh9MSZ8acnowpI%2BZvIOcVK5JYHl9Kxr82V7q%2FcPB08AhbHc46ktXYIzZtqWT5gNJ5OG1f1EaCDHb5kZ%2BznwmxTBTYUQFP5VRSbouXNgZjENWgTHmgJ%2BCRjx8WpX1mNvJlv4Y03zx%2BnIkj7%2FG&X-Amz-Signature=f6613f9e05153cce9259a5b29e74696682303d543f3e31e874f6c7faf6ba6154&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8db355a-896d-454a-b0a5-60d8566feef5/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46672RJE2EI%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044915Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQD4vwi%2FoIXFNhQ%2FnsTdHVeg9pySps3SVlwJDjrrFdaA0wIgMAYwSOizc9bmp58eLobm0vz62bTlAiBAXJQdl2hTuDMqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLINq6vmSZ1w%2FaqOOircA9xFM4Ua6xZG4plREAZLlYon%2B%2FKOYKUatv2JKswwTsfu%2FSc2EXHs84f03UhgFnmnINDLkL0CCGsiX15gTiZ%2FCrpyZ%2BOaK8ySKnG0D%2FbPxChWT%2Fbg74fK%2BFuQ209iORGAR4bsUwwqvXAUJ8tSuKe1Y9sDbWe8QbCqEuukRJX7oK3CkhsCLc6w0lHVNaECVnt6bXbfeMBkSIM9P1AYPZke7rKbgbiqQ251gk3gF2eQAmYSH1bqXP1a5L%2BEiQNAhkwEAXqOMBJigbMI%2Fr29ngt2jEFaUVCxsuko19P2ro5ZhYpyAfvWSvMidjzFIuy12IehPtN9sZJPXoW0DD%2FJzBR4f3Qm9d%2FZykWVI%2BZmrCMFSjmSs9WDCh7NnxlwWqMCosvZY33p5z5SuwpoJlKBTx3g3NYl4LS9If7eJvSX28y%2BMGaCxFjA8a3gIayZXnJckesladFiPqV%2BtAs22uq6JnQ6jic44BnKo3xZsd3%2F1nRl2NipCMe6bVyJw4pCLcIGxjbmtseYaI0Vm%2BahvQQQnSv2rEAKo9lFv66hf9KnGeraoSh0pEiKQ%2F2bXZCm3Gp8%2BILZSkdxU%2Bzjc2K1XQkFmJv%2F76TVd7tYAJQRKgWOIqANqDhyucxF8WymF3nj96vsMJLX7tAGOqUBDHKMaj8tgoFlS%2BR1BQnbfHt3GGYWuxKUi5P7I6N7%2F06CuoovbQJUxHtBmJcV6ztnnRE3sLKPf6XipqT9qZcfpq0h1zAmS4d5zVAiYIXqRQT0Vyioc%2BKWxj244HFxxqkpArwyxaJo37NaORbYY4L9OtEaAB36NZQI0CauhUwSDQFDDQmiCJz2GaocDrbtj2CGIef0XkPzzzuQf6vK2s%2FPwyX60OQB&X-Amz-Signature=96396440d5756543b2f74c715f19b04720bc86d27d2ce719aea3b9c8cf51dc78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/82d40e19-f950-4a9f-8d0d-a019a7226269/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VQMFG22N%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044916Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQDt0ZAJGbQIW823rUsyB6E5%2Btz8h7zRobwtOFJiC37YkAIhALZ7bRbP45M4suY12YC%2BstkqiCjW5W2E%2BeE2c3oiphq3KogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz%2FLsqViXC6%2FTVtNnQq3AMgoQAn2pNWfFj0ndES3QLfMOjHkXjB29P4AAq5Jb7BSafSc4U9o%2BORpG3bCPLBIJonS0SDIWasM8j%2BqG4Ebh3vUFK9Ix3%2BvJ520fcPAauiqV7JJAYf7pJnnN6zNUOjkCgt4HmI30yt3RUCx6Sci3xz5zX4apbilj76XFzsxncW7ZHQv%2FOWAAhD%2FizNFkf51JgTR5jWnVhvKLwxXbJVM1z%2FYXIllHbtLJSbCQff%2BqPITp%2BtAaHz69UhCMMcBSyaTTKEokbHjyQ1fL3uiBmzyoV77DlEALGcLRBbmcSFPRBwUXwr5Y8KWwrW1tcZl95wMIiek7jQC3FursNn75jvkFZDhLvd5NoN2DJtDW7eX4AKBI0BPjkiZGwYEc4ros6qyTrvgGlxH5MdcZOKpaxMHuKFYLkM00%2FaQVx34j7xuwlJwaCABkvCW7joa%2B2Zmskee3iQXF%2FGyp%2B92XgIHvtjCJCBPePNy3P5odF2AiecV%2BQfgqqgsg%2B2kggFWZXOEmhT%2BZuFE7vYQvACTgg5Rf2g47pCi1SpnEWPoJxescAC%2B7HeSpFSwJbIKRcIvmh6FHqpChUFXUwD%2FvWhJhY4onHb6Yy95GwsuHDtCU3I8vUk0yHmGgxhtO8GmfR85BGwKDDv1u7QBjqkARK3SeKB11GAN9urQMNJ3AMkVxbVm%2FPLaDwasiLYjNbeQAAY6CYDAg5YYPO9KTT2mz9%2Fnk41ZTo34duBDFHziyHz21N08OKOTQagk8WRh6TPbhvPTm%2F1SrRY4v9ApWqGPfH%2B9MQNBPVbh2ibPxWv7hbo%2Bb7UHqOjLLsgVdmF9hfOSvPZwLEgSEI4fjgWcq2qT3LVmAExD7jDrCkkYuCW%2BH%2BzKUqk&X-Amz-Signature=1329ee2aaa68ab77fad40c88b9e7cdc575921b4699f28350b1c37826b4d3f8f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/5cba392e-c837-47f4-919f-a6fdcedfc1f8/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666HD6SVWU%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044918Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIBL%2Fjwp1OtoDA%2Bqd6tDYxIu%2BrBCOqKHiWYMpGfDRav98AiEAiyHpXo4E00ivbdCLZg4gvXrlacr3z1LKOL4W%2F8xlnK0qiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPpy1in57X5o29bMfircA8ghPNdw7Vq24KrxWAURzHx3KIZIjRxFD0fgtun8psgBJ%2F7x32XXg%2Fkwz3hm1CYvjy7ynOCu1lTt7w9RFb7F2b9akf2LCbt6RSIFiAwEYqMRB3jT6VR%2FwGfSge3f0KgM7RexubNeYkDETEzPxKeWVI3a0J6tDH3H7UUYyhCyQbp0QcDHe%2FJaGgH%2FD8%2FEnkTxaYhFfu4ehMVn9gQb2F0LsqZUwGzTY4iZixM2SSWZ4ONQqI0xmcrIx6fc3jxOnCZY4F2tbfOFu%2Bzj6NACptutM3nuVeKRZduCtVpzoIPYBcCmwv0SR0IeTeTza7j%2B9rq66DqY5do8GwO%2B1dFbZmrP0B2OeYTHZLgwlTObDNbj2GGeENCDgx%2B8N3hKB95rpslnhmIEttPv%2BfU8LUPhpgxr2V2CW0MhaMsGL6RqU%2Fs8NmpIQR4QptKnapPe4VMGcmlNmQeH9DvNkB%2Fnm6o2VHvp3T1CjLwc5pkC0dbU0kmMYgCc9Qk11kkhMrIChotmO7BV8oe3S1bbQ2Q18bwIBkoP4FugxagdsSsvS4e9MgmD0pSSwRNJ3W9f%2FlgdBBsltqP2oWcavxQxOD4%2F6xd70hnxurmc%2BfXX%2B4T1R4VMjXNPcQvxrVtMVWIV%2BYht2YR0MIrW7tAGOqUBfF3AzOPTlYEu9W%2F44Xrnz6J3c%2B9pBiUE3bSs2XvF5C1jTDhwnavzK8GAaVAqpHF22X0iETJmvuF96wnjoy8gDEtL55r4asrQVI0T2pSW4tfeoh8RU4TL%2BYksa0uTE%2FeGRG9l8%2FXx8UdenTERQiah5DezBMm5buYKIMIVHzxAM%2B1jlsib7BN4gtt2kykf%2BDNdSAV4WomPQqEUvIy1O49CdYOjBCqo&X-Amz-Signature=828d16ff75ceaef7c0208c25be662b972999be1acc050927b940c7162615833d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 결과
        - spatial RGPT가 정성적 QA에서 가장 높은 정확도, 정량적에서는 가장 낮은 에러
        - 흥미로운것은 blind llm도 너비 높이 같은 질문은 꽤 잘 맞춤 → world knowledge를 활용하기 때문
        - depth의 효과 있음 7b > rgb only
- 4.2. 일반 vision-language 벤치마크
    - 일반 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d649125d-44e5-435c-b25f-cac39cae3fb4/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YWOWDEED%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIFsaiBcvaQbJDPOgzQuCa4W3v69D%2FFFPvoRG99QorrEZAiEAloXKjnZ69%2FxrrZvn47nEoONJSgccta3XH0rzfijAjnIqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDCTmmOZi9uXqPcINPyrcA29eRNQHza3oj5hchh2dL5jW6xbySoTuG2HIh94SYKHNnIDLmC8E5q3pLavESkTIUgWxX5F7jaFiR%2Bmv4tNCORLF4%2FVoxohIQjdD6hZZJO5n1Ee3Z4Q4CqR5DytIcRad10eclRg2RlmV%2F7If2WIQCDNOECWFgmRfAE9Whsp%2BEmC%2BelQuCrC5Gtm4V%2B07Ife2luprWvpHw5A9Oc%2BU84DlBEsV%2Bhv2OeQj0qzzAzEeKLuUFyUBp1jWOVjX5nYBfEksLtK7%2B%2Flpe%2B8XSaOBv0vNeyLwSEiOm5JhOdL2PHmWv11H8VZGbwNwkg3EZjs%2BM8F%2BI0AauyBg5RflBezvkzwYzJo4dHKh%2B6VylXamBxN28SmCRAuoPqqy4k4za75R4MvZ4IPzEjte6iFe8NlN7uFC7FuNiLQ53y%2FYGaBWrMcX939300LYoVCexlYP8%2F3jmpywKtUtIRL5ilp4K69ju7UczpyP7I8j1%2FUz1C3iOUHd8yadqoDlPeX3Sfx9%2FyjYz5F%2B7arsJnQh2BOkBzfHm5fXTZj%2F3vdtkVGj0pDhhRaQSbK%2BFQCQw1TlGlXfdL4inuNnnQyAp%2BcN7jBSI0TCvTdqtjSNtjfnkGk%2BL6%2FYp4ISxvnTW%2BvzCrmMRiQq6yEhMKHW7tAGOqUByV4J2hy9CZTEi9Jm%2FNpl23oYUQF5t8OkrvWJ39M7O%2B9RcFf6z8z8g%2FKhjX82Oft2koaniij3rDJPdHa6j5Q0G6a3Qb2g3jmwcC76JyHIQCzj0mTZ550F%2Bm%2FNpo4QeYHVVIYxxqiKEYO0Kq%2FPfeTiDkDRgKeZqQH05ehUrx7DDULu3gDeiqvsgbt5SUbe6RCf6Rj3cqkbArG5F4PPjttJXwyzWsg8&X-Amz-Signature=6c55a95b7160d28b5ea9f752e96aac3244bd4372c8f7a7555d02338bf16ab1cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatial VQA 데이터와 depth 정보를 추가하는 것이 다른 vqa task에 도움이 되는지를 평가
        - 동일한 일반 vqa 데이터로 학습된 VILA-1.5-3B와 비교
        - SpatialRGPT는 베이스라인과 유사한 성능을 보이고, 약간 더 높은 성능을 보이는 경우도 있음
        - <u>**→ 일반적으로 vlm은 공간 추론에 약하지만, spatial VQA 학습을 추가하면 일반 VQA 성능을 유지하면서 공간 추론 능력을 개선할 수 있음을 보여줌**</u>
    - Region 및 Spatial 벤치마크

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ca2d3e49-19e5-48a2-add5-8552c5c8c343/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WRCRIVZN%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCIAKWGTivVyx%2FsK32Mvu1jkWturIsiuBmBqawRi0GvY1LAiArbXqdNu4P86QNro7kNv3z6QZYHx%2B56oFwWB9wjJx2IiqIBAjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMp%2B%2BLDutiK13c133ZKtwDT1ENzm7lcmPrv31leu8fr34XBsqk52Mst%2F9BNUcDe1HPX4AwettndEI6IT8fg%2B8TTECbZiCtqKYEFEXbM1HktrKiyymq1lLyp3%2FiyOha500MRjKsuj3gcNAt%2F9yO9T61o%2FFMOvFkb%2F4Gc%2FWW8X4UxiCAXE7MUdJIMvDfaaQTWkvwcVzsd9VpLCZvsa7YuIuFspLA%2BpoIhJF6AS64eNxsQi2ND2w%2FRYaRNZLnIlCfIDAnNZl%2FOfwC2uedFEyt0uJCWLoPvQRHEMYi8GEzJDRC08f81hOLjsgeC9SbWT2hCs89R%2B8jjG%2F8ub%2FInd%2FlpYE9dTvk%2BvRKxPH2T9kED0orYQfxeq5VBXyWerIdXPkwj6fbZHrJWOFP6WL9CtWsfGRo%2FMjKpVqqL0WK1hGklf1k79I7zwqNcAFiahDn%2FHzEUDG4WMOHDbu2nI5GVKRgpXnnvVerjdqdP51UiK%2BY5shfbfvdj3An70oDsqjCPXifo2F1OOjA13sjdNmri7u26JSH2x1nFGAHW35tJHFSA%2FAk4Z0pyp%2B%2BC0vfzjJSc%2BHbgbTeO53CRjEp%2FgXl7P72BDr3lD7R%2FeDFpICnYWwTV0q7SrA6KhJCgv4MA%2FNuhL4kffN4z%2FwsTGvecibVNuEwxNXu0AY6pgE%2F0TbBXOuDmH8x%2FmidKkpTzMYwD270AEXshZuxuMICYSla20DYp0jIt%2FyqkGmMH9YW76V3rO%2F6VU%2FPWbts0tTYZCBktJGRp6L%2BExHfF%2FLD579kdzf8iwL9e0OcgBQ9nCJ9yhcWRDNV6bpfxqoRUjAiIah70bHl0YVTSIv%2BDjB4ExCVNwz%2Bsg7Ja2icEoS%2Fr%2F91eDLG%2Btcz6FVcE07N%2F97OncWn4l2R&X-Amz-Signature=e6e74945d4f320cd1555992bfde6f5199d8b3984403f887d9d7ef2a4ffb91c1b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - regionGPT의 평가 프로토콜을 따라 coco-2017 벤치마크에서 gt bbox를 사용해 객체 분류 성능을 평가함
        - spatialRGPT는 베이스라인 모델보다 더 높은 성능을 보임 → 강한 region 이해 능력
        - BLINK의 relative depth 벤치마크에서 평가를 수행
            - 이 벤치마크는 point-level depth를 평가하는 어려운 task
            - spatialRGPT는 point level 입력으로 학습 x, bbox를 사용해 해당 포인트를 지정해서 평가함

                ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/b4fd82ce-369c-4ce8-bd4d-308e142cc589/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666XBVT5HL%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044920Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCIDJWNC4OqaueePsqnh3RKrnCSwgprfhLKs61W8S9uFC2AiA6i%2B3VoxDjM6LIkY6YZCpq2QjI9efM8xd%2F7KiVhW2yfiqIBAjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8CpOy5WuN5VGpMUJKtwDyLpRipIIhMvY%2BtQT56HXxuHzD7ehZIBBwHjJxcAIvDGQuMnHhDJMhbCqzpaYoD5EkX3QOuu%2BTWF9uJ764fr4P77yGSLrr4QLwns%2BJvyWlmtGYdopAqwnWwHxyMzvwBSX%2FowzLoWAzxN3bMSP2sjCrMJCvS4RvbG2tGEumvDh5mHFWikZhttjb3dXuwSYQupMdD8wFlXwRJdhDCEnOxgyFqHZ0%2FIlQpN8wWP33gjJ4KB6h%2FUUit0IvXMsluGSk49hW5AsfZOaY2vMWevTJUYZt5z7lLpR%2B9cJ7M8Fpy2YV1urvPAhr9dBSGre0miqZoe8FMX2M40JeYOuNc6gmIJ1hes%2BLTGPmKHTjiPek8r3592Zh%2BQytFe6IUwfRwMhrSX4rtetbvZM65ssIOfDQ%2BbUqIA5eciHq2G6IJk3JCmBgXmdkv75i8zQ%2B2rFibTj3CU2v8xSe0vHqr5YOasntL8fxcv3ZMpOxgJpahdmMfAVYt4M18i6fD%2Fd4XLfzmOYwOytjfhsX8Br3kAyymwOOVLvLqFlHYXkPiceOCQaCPDIjYs8qovv82vwweOU3pvj1d2TA%2F7w%2FAa3bPTHIkrEzYUOGiYan54NQHccNCa%2BckcbcZnSRRSSLWYBjZSCrLMw%2FtXu0AY6pgHXkuMyd8e25kFlIxGcgaR0cgb%2BNEiATnWzj06KTHImBxKUUr4R%2FhB7ueyYuXN7psJLOL6sutZK76b2UvgCNKdOSiK6TrPE9rqFVjihkD1z08oLXis8mpc0B7HB%2FthoH7FuAOsFZW3nngIhsF5TTSoy29pSjAgJ7%2B7sBsZuwYTFpYdhZ5MoMiezxmLeogd%2F7GpietaUN00Q7D%2BkxFXHdKV8Sh%2FUMiOA&X-Amz-Signature=a1cf9c234ce71a0e0041ce0f760b68c4a830820919c3ea7c5e54a1d4223ea310&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - spatialRGPT는 기존 SOTA 대비 20% 이상의 정확도 향상
            - 특히 GPT-4V-Turbo 대비 큰 성능 개선을 이룸
            - <u>_**이는 별도의 학습 없이도 새로운 작업에 대한 일반화 능력이 뛰어남을 보여줌**_</u>
- 4.3. Real-world applications
    - 복잡한 공간 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/17138b36-3069-4433-81fd-e7a044943fcd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RHEZK3SC%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIHhkdoagsDUA%2FZWuZJr8NNj0FvBFVNimPkUZI2lnqdkFAiEAjXxaGds8aFqWWWrRyWFqhVqquH4JfqsxQjimxhM14uQqiAQI7P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLd%2FBTBbf01VIX4Y6CrcA3omLpxi%2FVP%2F%2BmgOkhwYUXcbBIAJ21O1dsQCijNrmz6NqIjsjQpjnbJKyXmefIMYxqYg%2FvCELCKwkTxJranLOiGOgCqjLSGqW7%2FPJqRXDLfjOduzN273BwpLrKuUdAc9Jr5g8aBtbCxYnp1zOBWaZCtMa33DrDppQZNMdDRS1CvjYYxLvVdeCDmhb9v6LGicVOHwsfEKulctCarEU%2FfwxLAuxtpQBjtonzO0A0oaAFJqNoRlFXnhwSmtB8U2or01lPUXL3MT0QZRQEVs5pO4szdIgwqnBiCppzNYos%2Bo9%2B%2BagWkVrjiItOjG6TaK2cwRwxv8na4WlGaRhICeG1N1kNIMIpbDKxM%2B0eCqzuZkGm%2FHlTtxbKWp0JagUxOW8b6ZfDSUs4Q4Dzbd080baqIvwTNEJYRZWHs6EBpWCxTTfiolv8cc8oPSQpckETIsJGkYFDzP92neBZWirgkJlD5vGnwlno3yX3CNOl1slxnJFkXHpogMCm8EdPUL1UTWmA728s4g20CR9hAcKGt5fKfhMf2o1%2BWIVgLECFZOSW31kkByfbL%2Bq8XGvuMLo%2FeGbIRQz7LykawwzWfwyRY88908d2WAPUTMWntyS4%2FqIY2iY2cRgnzd49N9vGtT1RdbMLHW7tAGOqUBReP3MVgjkX3QSN4ZbExHyZu7OKQXhgdBsHQbilw1kIXdDR%2F%2FULgWtT5CpU8L72ocYo9bzBTX3TrVJETt7y%2Frzo4Er4P6fFWuj%2Bsi4LQCciU0r8lkCKus%2FfGkJwuQiWeBRf1SFYoqscQjXBqpEK4Ek%2BDST1ipCCkCjg9NtR2PjGAqE6iomB2RlBb8k8n2hlx7B0hAchb0n68tDKLO2JfDR145KmzH&X-Amz-Signature=c2232075e1f3ad36cba93f49b73f356a50302dea3fcd1c3e2d4008d02bb1b7b6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - spatialRGPT는 GPT4V와 비교했을 때, 자체적인 공간 지식을 기반으로 복잡한 공간 질문을 해결하는 능력을 보임
        - _**모델이 공간 정보를 잘 학습했을 뿐만 아니라 그 지식이 언어 추론 능력까지 확장되었음을 보여줌**_
    - Multi-hop 추론

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f368a1c5-0a55-448c-b875-7a785853df1e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SZ7Q2IL%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQC96GEbEh3IgVOEx46vgpxLMWgWX1kNrW0HmUVOKcE7wgIhAMUFkSRnZi%2BBes08u9AmNpoXT4d2pfhGeokkSKAnhyBMKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz7Wr%2BuqKffVSxgyRMq3AOThhBHYiSZeEa85SAZIM4LLSWGTAOM4tE2x%2BSpl5v2XROUlLodgpxlIk%2BKcOSndk75tq1ZpiofCE%2BC9R2Jykt7q9KXk0g8Fg7zTjlGbLbTdjRobUkpQdQF6siaCclQclaWfyaobOFyFcwZDT0ZONTb9rNDGTPlT3lFMznla6Oyvo%2F5ggK%2Bl4Xyfi8BTC4BiDDJP6eumFIWeXheykuW9lppdyGLo46t8qAvCQqaMr2g5ygSnEFdVLlwXXdEBX9SkiglyRBi5%2B4pzJxSZG0afbhlFR4RqH7khAlmfLMyCRccz4k1g8mMAIRfpWclPosKA8zlwH%2Bz6oTaSRzyP4aWIhOnx6T18B8Fx%2BuUTvcSSVMxPJkFUU9JQiilR8lS86FXAa94xH2pxCk8TR9FtF2IPKFbIMgL9jiZ1PqN6Il5gQ8UDBeFSZjAexlQFFSEIJos7UonC8J%2Fo9LFhSCZDiZ5USsm0Wm5D7potKByk1uqQ4uKEf6%2BO73TLf0Vr0e%2FJiG28aBeC%2FCLznFO1Vs3CW%2BxbT3gzYhsolR2gWiDIaxTlKPYUUfq9%2BEIWXoJ7H19C7Ia3dbrL4tNVx%2BYe0S70xueedG%2F6lvHN79SdtJWEDz%2BgcHm6elA4wO8tkss%2BNJpGjDz1u7QBjqkAbebv0U6UVXqmdpe5qfRpsdi2uukV8%2FHZBB%2FPjzLcrqXXCuKREuZL500ktryLxWdXwLHWNVGjfjWUz%2BdS1yyl3yIQFIz8qJ%2BJS054rn%2FwkPqchRLJdI2wKhfD6Npl0USIwYbeKoDR7bT4FcvI%2B702165wDDID8GCd5c4IT66g9XMHz1l14w3xnp4daZzYZi%2BcR%2BUB3mLJ9myRAloe1BNllkvFr0s&X-Amz-Signature=8365f421b8f5249a9c423009fa09104e1a1cb66a1873e5755caf879413d01050&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - 한번에 여러 단계를 거치면서 추론하는 질문들
        - 이런 멀티 스텝 추론은 학습 데이터에 포함 x, spatialRGPT가 공간 관계를 구조적으로 이해하고 있음을 시사함
    - Region-aware dense reward annotator
        - spatial RGPT는 region-aware 기능을 통해 관심 영역을 지정 가능
        - 실제 로봇 실험에서 2개의 BBOX를 정의하고, 두 영역 거리 기반으로 reward를 계산하도록 함
        - 손가락이 목표 큐브로 이동할 수록 거리 값이 점진적으로 감소

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8481a76-4c13-4207-ba37-96fad9407102/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665M2GYTUY%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCIHZaU4g9l0VPWbPMadwwQiEU5LYIxHfRrliRbwEHYXjpAiAaqm1iLE8HnV0kYg3LToT4bfmTrHmkaMCE2ucc07CZhiqIBAjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMMOqea5FLdM9hT4WiKtwDKSzMI6UH3GnHY83OOwQit8A7Xrfun%2Byb6QPgdJwZc1fdwhsVfjTn2L0d7KzfeMZRjjVNauaylA4MuEeICHfaQJg6ThV09DOBkVhxetZ9J2TssG6VBjn%2Fhy7YGTz26d0CwvI5kudOup7%2B6pfZAQgxEw2bETBkzRkn2WVKtpbH6FORKJ0OwcLCgDWHn2V79Md8m7HauIH5wc%2FLDhyUrIG7ZPWyWgCyxLzsgGFPLxHyq2AYsAYce9C%2FrvDF5m1WtCRtziH708YyulTMEJNlQzgpnhPpceSJe1YoWqifPnzdI9710BdvydYDodH4ipFtoJ85LKC6jS17mGRTdeaN6kP0XhySh1u5AzCcd2bCPeb78YfmhNevPtwPfEUyRNZ%2FI%2BbQlfk0kxWzxnA%2FpDmI8r3VrggOP5ve048NCN6sxYnjHq86nd9JVNcIEvSYlFPw%2BzmKChFW2R0AAnFmW3uWcSYJ8U5UFzwgc9Jg0cAnsjBSjUabmSWnyHj1G6tmqpKX7Kc8pZS9Wk7ny%2BzufMwqUJkdW944e%2BsKxSxke22m45OWLwOB1IV8f5hz0KKUEX5grWkKTEDQhkXwaOprPR4n%2BZvi7Sp%2FhR6amKJIAg5LgPWoHSSiYYxT2WfYtpCVYdIw8tbu0AY6pgF5NtJYb0x2pbwLOwIORQ11aQxn0%2FEkAf5bC9EPC07IMwEPIAIxVYmPszDeShNueTNYjxJv1OKmgTpsmFBABtbK9QKMk964iO%2BFQ9ISoW9lSftCL7YxJ1PcFooc9LdxZHDsLzR9ZJ%2Fi4otcxdZgJi0Obx3zzHdSX6kIZg%2FiLQMYTZgNnWm3k6s6fzUemSWRYDBiSjCVpOHLXuU4kz9GHkEjF4z9TU%2B%2B&X-Amz-Signature=e401fd9a4ad3e841f761ff5f513d9862f58abbe80557d52ae510e9db399d3e1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

         

