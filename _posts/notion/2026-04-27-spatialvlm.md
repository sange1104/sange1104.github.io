---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T3M5ZNB3%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044305Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDQaCXVzLXdlc3QtMiJHMEUCIQCz7OaGpx%2B9%2FXG81Np36O5ojs00aX4TF4sv6Zv3w6k2TQIgJXoJPzy2JXkeK08hVW9Oe3tvNjIhoMV7gFGfbJWjA7MqiAQI%2Ff%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKnu%2FZQh25JVEqKYFyrcA223kgTqTbTLmWMzVdpQvpFEYGQTh7YWmEQwZ13XJFyzwwmXHq1XfuVF5xzBTkK6BZX9atXMCB48Q%2FjTjEJc9wvO64OKd0tD2r%2Fj2%2FGuVpM%2B2zL8usHtTBZj%2FyCtZPi1tV5IrH4INBwV7V0uU3N%2FZ89XkaF%2FTt9QobGJmEHTh4PGAZ7gK%2FpOOL3ObG9kdjhjY2OQvd9ac2YEEpho%2F6AO93iHicDsgUTec0aVrYkY3WIPIfRa23Sj4MTAj7MEdzV%2Bhn7dMIesCOGCK%2FoJwqWi%2B31L5LUEmucUCuoG2KmjXPh5VydBYcwDKjL0qRHGzNxq7bLpgPOc9XU1RxuUKV74rMM0iT1KDoyihXOEulJwblZJmVPB9pu2MEsM65JFUMgJafRv0jHBzVrpRUERHWbJs0pAtZCoSZ%2Fjns17K%2F5ypfWlslM0yFfWNXcz1GmPQrdMTp%2FzeuTfV371YZEW34gtfw7ADsvel%2FNYKiR2c6VdKgwha9WYIubrwoYAII8Snv7f3ZsP6Rtr9fcG6YO3qIJvEYQ6GF25vmJiRrLUoKmoqVQWgXUN2Wiqj3GX6X6PquAzrrzGFInI%2FvgPJzfxkL4Vc3TzO%2FdwePmMLfTtgCXcjzCmPuEAj1GQFQk6T8a%2BMJmKutAGOqUBCAkZ2icpq7AQBrAGcPJCvgXBq%2FYOY22YWVrL5tGCBV9CzPu6FSU2%2BAvTH%2BIC9gJ%2BjpGRHanw1QhBeM3a89DYCPqOG0hldJto0NCiN3eOfGMPEtLcjqI8g%2BdbosCy%2BB7C%2FfMpm0nSngCC6wxiJeIm0C4spGVtGTejD7EaG6%2FcfM0JSEZdk2SBKBiyXJ8vElUBXqFER9a8ciqK2esucJEIBdk1pm8b&X-Amz-Signature=328675cf30efe012b9f9e6dc693594dab8705bfe6236d413af7b844e1dae8504&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 공간적 관계를 이해하고 추론하는 능력은 vqa와 로보틱스에서 핵심적인 역량
- VLM은 일부 VQA 벤치마크에서 뛰어난 성능
    - 거리와 크기 차이와 같은 <u>**물리적 객체 간의 정량적 관계를 이해하는 3D 공간 추론 능력**</u>은 여전히 부족함
- 본 연구는 이 문제가 데이터 부족에서 기인한다고 가정 → <u>**학습 데이터에 3D 공간 정보가 부족**</u>하기 때문
    - 인터넷 규모의 공간 추론 데이터를 활용해 이를 해결하고자 함
    - 본 연구에서는 이를 위해 대규모 학습을 가능하게 하는 시스템을 제안함
- 실제 이미지 천만장을 기반으로 최대 20억 개의 VQA 데이터를 생성할 수 있는 <u>**자동화된 3D 공간 VQA**</u> <u>**데이터 생성**</u> <u>**프레임워크**</u>를 개발
    - 이후 데이터 품질, 학습 파이프라인, 모델 구조 등 다양한 학습 요소들이 성능에 미치는 영향을 분석함
- 핵심 기여: metric space 기반의 인터넷 규모 3d 공간 추론 데이터셋을 최초로 구축한 것
    - 이 데이터로 vlm을 학습했더니 정성적/정량적 공간 vqa 모두에서 성능이 크게 향상
    - 이런 모델이 정량적 추정 능력을 기반으로 cot 기반 공간 추론과 로보틱스 응용 등 새로운 downstream task 가능성을 열 수 있음을 보임

## Introduction

- VLM은 여러 task에서 큰 발전을 이뤘지만, 공간 추론 task에서는 한계를 보임
    - ex. 3d 공간에서 객체의 위치나 객체 간 관계를 이해하는 작업 등
    - 여러 다운스트림 응용에서 필수적임
    - 공간 추론이 가능한 vlm은 더 나은 보상 평가기나 성공 판단기로 활용될 수 있음
- 인간은 신체 경험과 진화를 통해 선천적인 공간 추론 능력을 갖추고 있음
    - vlm은 이런 능력이 부족해 여러 단계의 공간 추론이 필요한 실제 문제를 해결하기 어려움
        - “vlm에 인간 수준의 공간 추론 능력을 부여할 수 있는가?”
- 본 연구는 이 원인이 **학습 데이터의 한계** 때문이라고 가정
    - 주로 학습하는 이미지-캡션 pair 데이터에 공간 정보가 부족하기 때문
    - 3d 정보를 포함한 데이터나 고품질 주석을 얻기 어렵기 때문
- **자동 데이터 생성**으로 이를 해결하고자 함
    - 기존 포토리얼리스틱한 접근보다는, <u>**실제 이미지에서 직접 공간 정보를 추출하는 방식으로 현실 세계의 복잡성을 반영하고자 함**</u>
- 핵심 아이디어는 - **최신 비전 모델을 활용하면 2d 이미지로부터 3d 공간 정보를 자동으로 생성할 수 있다는 점**
    - spatialVLM: open-vocab 객체 탐지, metric depth 추정, semantic segmentation, 객체 중심 캡셔닝을 결합하여 **대규모 실제 이미지에 대해서 밀도 높은 3d 주석을 생성**함
    - 이렇게 생성된 데이터는 캡셔닝, vqa, 공간 추론 데이터가 혼합된 형태로 변환되어 vlm 학습에 사용됨
    - 이를 통해 모델은 3d 세계에 대한 지각적 기반을 학습하고, llm과 결합해 공간 추론을 수행함
- 효과
    - 정성적으로 공간에 대한 성능 향상, 노이즈가 잇는 데이터에 대해서도 정량적 추정이 가능 …
- 기여
    - **vlm에 정량적 공간 추론 능력 부영**
    - **실제 이미지 기반 인터넷 규모 3d 공간 vqa 데이터 자동 생성 프레임워크 제안**
    - 데이터 품질, 학습 방식, 비전 인코더 freeze 여부 등 학습 전략 분석
    - 복잡한 추론 및 로보틱스 응용에서 새로운 가능성 제시

## Related work

- spatial reasoning
    - slam이나 depth 추정과 같은 전통적인 문제들
    - 장면 메모리, 장면 그래프
    - vlm은 공간 정보를 암묵적으로 학습함
    - 본 연구는 장면 그래프 없이 vlm 내부에서 직접 공간 관계를 학습
    - 더 나아가 정성적 관계와 정량적 거리까지 다룸
- vlm의 grounding 문제
    - grounding 부족 문제: 사회적 추론, 물리 추론, 공간 추론 ..
    - 이를 해결하기 위해 vision-grounded 모델이 등장함
    - 본 연구는 별도의 구조 추가 없이 vqa 데이터로 vlm을 finetuning함
    - 기존 vlm의 일반성과 추론 능력을 유지하면서 공간 추론 + 보상 예측 같은 작업을 가능하게 함
- 기존 데이터셋의 한계
    - 보통 vqav2, coco, visual genome
    - segmentation, object detection 등 fine grained 이해에 집중
    - 공간 추론 데이터가 존재하긴 하지만, <u>**실제 데이터는 사람의 라벨링 한계가 있고, 합성 데이터는 표현력이 제한됨**</u>
    - 결과적으로 대규모 + 현실적 + 풍부한 3d 정보 데이터가 부족

## SpatialVLM

- vlm에 공간 추론 능력을 부여하기 위해, 대규모 공간 vqa 데이터셋을 생성하고 이를 기반으로 모델을 학습함
    1. 데이터 생성 프레임워크 설계 - 기존 비전 task 사용해서 객체 중심 정보를 구성
    2. vqa 데이터 생성 - 템플릿 기반
    3. vlm 학습
    4. llm과 결합

**3.1. Spatial Grounding from 2D Images**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T3M5ZNB3%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044305Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDQaCXVzLXdlc3QtMiJHMEUCIQCz7OaGpx%2B9%2FXG81Np36O5ojs00aX4TF4sv6Zv3w6k2TQIgJXoJPzy2JXkeK08hVW9Oe3tvNjIhoMV7gFGfbJWjA7MqiAQI%2Ff%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKnu%2FZQh25JVEqKYFyrcA223kgTqTbTLmWMzVdpQvpFEYGQTh7YWmEQwZ13XJFyzwwmXHq1XfuVF5xzBTkK6BZX9atXMCB48Q%2FjTjEJc9wvO64OKd0tD2r%2Fj2%2FGuVpM%2B2zL8usHtTBZj%2FyCtZPi1tV5IrH4INBwV7V0uU3N%2FZ89XkaF%2FTt9QobGJmEHTh4PGAZ7gK%2FpOOL3ObG9kdjhjY2OQvd9ac2YEEpho%2F6AO93iHicDsgUTec0aVrYkY3WIPIfRa23Sj4MTAj7MEdzV%2Bhn7dMIesCOGCK%2FoJwqWi%2B31L5LUEmucUCuoG2KmjXPh5VydBYcwDKjL0qRHGzNxq7bLpgPOc9XU1RxuUKV74rMM0iT1KDoyihXOEulJwblZJmVPB9pu2MEsM65JFUMgJafRv0jHBzVrpRUERHWbJs0pAtZCoSZ%2Fjns17K%2F5ypfWlslM0yFfWNXcz1GmPQrdMTp%2FzeuTfV371YZEW34gtfw7ADsvel%2FNYKiR2c6VdKgwha9WYIubrwoYAII8Snv7f3ZsP6Rtr9fcG6YO3qIJvEYQ6GF25vmJiRrLUoKmoqVQWgXUN2Wiqj3GX6X6PquAzrrzGFInI%2FvgPJzfxkL4Vc3TzO%2FdwePmMLfTtgCXcjzCmPuEAj1GQFQk6T8a%2BMJmKutAGOqUBCAkZ2icpq7AQBrAGcPJCvgXBq%2FYOY22YWVrL5tGCBV9CzPu6FSU2%2BAvTH%2BIC9gJ%2BjpGRHanw1QhBeM3a89DYCPqOG0hldJto0NCiN3eOfGMPEtLcjqI8g%2BdbosCy%2BB7C%2FfMpm0nSngCC6wxiJeIm0C4spGVtGTejD7EaG6%2FcfM0JSEZdk2SBKBiyXJ8vElUBXqFER9a8ciqK2esucJEIBdk1pm8b&X-Amz-Signature=a53af230adb224619da1172cdb3661170488f8c00d7f1f29c3108b576009fc9d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- **Semantic filtering**
    - 인터넷 이미지 중 많은 데이터는 공간 추론 task에 적합하지 않음
    - clip 기반 open-vocab 분류기로 공간 추론에 적합한 이미지만 선별
- **Object-centric contexts extraction from images**
    - 이미지에서 객체 중심 정보를 추출하기 위해,
        - region proposal, region captioning, semantic segmentation
    - 객체 단위 픽셀 영역, 해당 객체의 텍스트 설명
    - **객체 단위의 representation 확보**
- **Lifting 2D contexts to 3D contexts**
    - 기존 이미지에는 거리/크기와 같은 metric 정보가 없음
    - depth estimation으로 2d → 3d point cloud로 변환
    - 좌표계를 실제 세계 기준으로 정렬
    - 객체 간 실제 거리/크기 정보 포함된 3d 구조 생성
    - **object 중심의 3d point cloud 생성해서 vqa 데이터에 활용했다는 것이 큰 기여**
- **Ambiguity 해결**
    - 같은 클래스 객체가 여러개 있을때 모호해짐
    - 더 세밀한 캡셔닝 사용
        - flexcap 사용
        - 한 객체에 대해서 길이 1~6의 단어를 랜덤하게 캡셔닝하도록 함
    - 후처리로 모호성 제거

**3.2. Large-Scale Spatial Reasoning VQA Dataset**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T3M5ZNB3%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044305Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDQaCXVzLXdlc3QtMiJHMEUCIQCz7OaGpx%2B9%2FXG81Np36O5ojs00aX4TF4sv6Zv3w6k2TQIgJXoJPzy2JXkeK08hVW9Oe3tvNjIhoMV7gFGfbJWjA7MqiAQI%2Ff%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKnu%2FZQh25JVEqKYFyrcA223kgTqTbTLmWMzVdpQvpFEYGQTh7YWmEQwZ13XJFyzwwmXHq1XfuVF5xzBTkK6BZX9atXMCB48Q%2FjTjEJc9wvO64OKd0tD2r%2Fj2%2FGuVpM%2B2zL8usHtTBZj%2FyCtZPi1tV5IrH4INBwV7V0uU3N%2FZ89XkaF%2FTt9QobGJmEHTh4PGAZ7gK%2FpOOL3ObG9kdjhjY2OQvd9ac2YEEpho%2F6AO93iHicDsgUTec0aVrYkY3WIPIfRa23Sj4MTAj7MEdzV%2Bhn7dMIesCOGCK%2FoJwqWi%2B31L5LUEmucUCuoG2KmjXPh5VydBYcwDKjL0qRHGzNxq7bLpgPOc9XU1RxuUKV74rMM0iT1KDoyihXOEulJwblZJmVPB9pu2MEsM65JFUMgJafRv0jHBzVrpRUERHWbJs0pAtZCoSZ%2Fjns17K%2F5ypfWlslM0yFfWNXcz1GmPQrdMTp%2FzeuTfV371YZEW34gtfw7ADsvel%2FNYKiR2c6VdKgwha9WYIubrwoYAII8Snv7f3ZsP6Rtr9fcG6YO3qIJvEYQ6GF25vmJiRrLUoKmoqVQWgXUN2Wiqj3GX6X6PquAzrrzGFInI%2FvgPJzfxkL4Vc3TzO%2FdwePmMLfTtgCXcjzCmPuEAj1GQFQk6T8a%2BMJmKutAGOqUBCAkZ2icpq7AQBrAGcPJCvgXBq%2FYOY22YWVrL5tGCBV9CzPu6FSU2%2BAvTH%2BIC9gJ%2BjpGRHanw1QhBeM3a89DYCPqOG0hldJto0NCiN3eOfGMPEtLcjqI8g%2BdbosCy%2BB7C%2FfMpm0nSngCC6wxiJeIm0C4spGVtGTejD7EaG6%2FcfM0JSEZdk2SBKBiyXJ8vElUBXqFER9a8ciqK2esucJEIBdk1pm8b&X-Amz-Signature=255126d14ab657de4001d38ce336cd271361b4cb13995868a50f89de9c8882ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- vlm에 직관적인 공간 추론 능력을 학습시키기 위해 합성 데이터를 사용해 사전학습 수행
- 문제 설정: 단순하게 이미지 내 두 객체 a, b만 고려
    - 복잡도 줄이고 학습 안정화
- 질문 유형
    1. 정성적 질문
        - **관계 판단 중심 - 비교 / 방향 / 상대적 관계**
        - a와 b중 더 왼쪽에 있는것, 더 위에 있는 것, 더 넓은 것
    2. 정량적 질문
        - **숫자 기반 추론 - 거리, 위치, 차이, 단위**
        - a와 b 사이 거리, 얼마나 뒤에 있는지 등
- 데이터 생성 방식
    - 템플릿 기반 생성
    - 객체 이름은 구체적인 캡션을 사용해서 이름 붙
    - <u>**정답은 3d point cloud, 3d bounding box 기반 함수로 계산**</u>
- 데이터 구성
    - 총 38개 질문 유형 - 20개 질문, 10개 답변 템플릿
    - 이미지: 1000만장, qa 쌍 20억개
    - 정성적 50%, 정량적 50%

**3.3. Learning Spatial Reasoning**

- Direct spatial reasoning
    - 입력: 이미지 + 공간에 대한 질문
    - 출력: 답변
    - 외부 도구 없이 vlm이 혼자 바로 답함
    - 텍스트로 바로 답함
    - palm-e 구조를 거의 그대로 쓰고, backbone만 더 작은 palm 2-s로 바꿈
    - 원래 palm-e 데이터 + 본 논문에서 구축한 spatial 데이터 섞어서 학습함 (finetuning)
    - 전체 토큰 중 5% 정도를 spatial task에 사용함
    - 이 모델은 기존 모델처럼 일반 vqa도 하고 공간 추론 질문도 잘하게 됨
- Chain of thought spatial reasoning

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZASIAT2E%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044311Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCICDH81cSfepbEGqCFoZ11scp2A9VCbZlHFBvqXKXOnMeAiEAyPo9EqxfwuxYRmoMShtk5JElyrh1t1KumfgbLYy%2BnAIqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDABzjg4Jijy3VaTntCrcA%2FY%2F8Z6Z%2BjKTWLRGGJVfvfEzPX%2FdX%2FNHcn%2FrsGtEyjED6WTQpWSD8aAa1gKjx7muQ1x%2BltpElcYr2X6Ydg13eRntdrJjk673ph1tdOM1aBdDK%2B0MMLUnP%2BSExvX921sBXczhYVT0adzET42T5CySvPCnJ6hzrWw1%2Bdb61l%2FkwfPvyVc9I91xk2OmtbvaoyD1zid9B3qPgnYioS1w1h2Oqr%2Fv3QK4p2QIFMSlL6qBa55h1lVaVstOdoXf2DfIzR0sP7QGBkxcUtF50SEBGIqY49AptiHlFMVzi1vo62lohbGOpeTaS0LxXKCWypuLoLqPJ059orSkk7o0GffmTLmoYJ40uFCSLWh5YT3mmp%2BInjy2ICePwWTjYDz73g%2Bzu7pY4LrFpu6gTW6kCa0Lvrouw71P5xAA%2BeYHRL5fwCjhYfkQDKd8NS8jlNp2CexNwSiOUZa%2Fy31QVk7m%2F9X7mR70QyrEjIcSBDNmuAJPBp7NE89Ucpusb2UfQw2nu33e1gldIqdJCKh1DXXJplJMcsVgYEHUPdEe2%2F1eRgzMhtisYo00aPaVHT1Ldmfy9EORQ4HlYqurgHBbVQtWQd9y2yA%2FvkONdKPyFMqA7l25Kf6M7hzeJ0rubq36s2nZVKX9MKrkudAGOqUB6YVT0YXC0k%2B3RW8dzpUn%2F5DEc8hwaViPR6AD2X4GLdvvxWegKNIsBiG1U%2BEhEq3aRgQVO3934GGKNzM1bJwXg1Aog%2FF0%2FSfP35lcIsnIdYCo5%2BYPDVrF8LeU6hrYRzp0T3q2gJWjqOt%2FBRyNVsd5WwaM3uCM5Vv%2BWoGnRy6CV0AuAv0LjaolrpThgF1rhGzZU6ZJmjw3VI9m%2BBfAUEdHPBJ7Kt5A&X-Amz-Signature=0aab7fb3cced031173e7b35a277e3ac3b927c9876ca92f1d70f7ea21d877ed85&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 한 번에 못 풀고 중간 단계가 필요한 여러 단계 reasoning이 필요한 문제들
    - spatialVLM이 기초 공간 질문에 답하면, 강력한 llm이 복잡한 질문에 대답하는 구조
        - “이 상자에 저 물건이 들어가?”
        - LLM이 내부적으로
            1. 물건 폭은?
            2. 상자 입구 폭은?
            3. 물건 높이는?
            4. 상자 높이는?
            5. 비교해서 결론 내리기

        이렇게 **작은 질문들로 분해하고, 각 질문을 SpatialVLM에 물어본 뒤, 답을 모아서 최종 결론**을 냄


    ⇒ **Chain-of-thought Spatial Reasoning**

- 이 연구는 복잡한 multi-hop 문제를 직접 학습시키기보다는 직접적인 spatial QA만 학습시킴

## Experiments

- RQ
    1. 본 연구에서 구축한 **spatial VQA 데이터 생성 및 학습 파이프라인이 vlm의 전반적인 공간 추론 능력을 향상**시키는지? 성능은 어느정도인지?
    2. 노이즈가 있는 합성 spatial VQA 데이터와 다양한 학습 전략이 성능에 어떤 영향을 미치는지?
    3. 직접적인 공간 추론 능력을 갖춘 vlm이 cot 추론이나 embodied planning 같은 새로운 능력을 가능하게 하는가?
    - 모델은 palm-e training set과 자체 spatial vqa 데이터를 혼합해 학습함
    - 공간 추론 한계가 데이터 문제때문인지 확인하기 위해 **semantic captioning 비중이 높은** 데이터로 학습된 sota vlm을 베이스라인으로 사용함
- 비교 모델
    - gpt-4v, PaLI, PaLM-E, PaLM 2-E, llava-1.5, instructblip
- 4.1. Spatial VQA 성능
    - vlm의 공간 추론 능력을 제대로 평가하기 위한 spatial VQA 벤치마크가 없음
    - 직접 구축
        - WebLI 이미지 일부 사용 (학습 X)
        - 사람이 직접 정량적 정성적 질문/답변 생성
            - 정성적: 331개
            - 정량적: 215개
        - 3.2. 합성 데이터 생성 방식으로 생성함

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VFYXSD4F%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044312Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQCPXZA3hT097%2FEtQSJVyDw3DDcx1YxTPJEkUQtKm%2BLVagIgW0Cpe6Y1xtC4OvBshpFYEQ2ykyAilCVWZYE7lnSxkIYqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDESZcDaZo99zZ5rVaSrcA5riokOTkGJkEJgjRnHprOQN29Kaha5rZNjG5unSUwvsA3pxhKa5UeT%2BDpvVvYyJcSIN5W1wd0HDIPp8Tom4Gd0EC80SKn4lkGT2VYsHxgimokUJrnbCMWtXFqZwW0pOed4P4mOXkKZilSU2woKf27bNKZQxuVY%2FobFEB9GLz2yKNJ0l7qtiQ9sO%2Bvx%2Fnru0RK1bqvVX7Tukdk4D1iYGj3bFZz4gJdCulKFKxQ%2Fc7zDtXu0Qhyp%2FjbYw%2FfBvzuGjKdVWRDqQpUj%2BccveJWwxT9w1SHPIx%2FarziVLm6si97tycWGirILpYyRE0aIQNBa%2BNDHuj89CbWmZlm3f1N301Kubm8buU7lgpCgEmWacY%2FS6XnE4yMdPcce6tAQdqEbGxNhWg1ptA7kiLUh420n5nkm77E5j91OyFDEbDbdUGGeQzrIOF6jh8cMkB2KXiRpBO1qrxfCNIdamhS1JmnQlFTXJ5L9EeeJAQJiIchU%2BMu%2BBZH1J0NfFXnxE%2BqPQrV%2FH2nlMtnRnPR5tB35Ax6PLaUP4lArvQu4To4ZgyGxnOJR8Vo%2B1i8demhNOAbhNnHP7MHInoajJakpbpMMuq5uwZGwtG6HXdNvh50zyWE8WxTl2svJD6aD0vb8tOfFwMKfjudAGOqUBG5PVS1QZMmGqCmxKqml%2B8HCiBvEM63s7Oyff1V7XoRLC4pJNzasDwmL14FhX0G6XdPEKJQEO6kPtkOS6OioRVOuPAi%2B0n69xM1qO7xKBChrD26Nub8Lu2U4U0oSl5iNAnCjsw%2FpxxZy82f9ecbSNGI%2B20fx3eK1ja7clKAFdj%2FbMD81KTY%2BTBWpcyINtCHsKk4DghZCs4XjMWefPWzmQfauUhUmw&X-Amz-Signature=f520cb3d53ae687c5e05cf7962279848b078f824ba03a567354da7df842cf35f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정성적 분석
        - 정답과 모델 출력이 자연어라서 자동 평가 어려움
        - 사람 평가자가 직접 평가함 : 정확도로 평가함
        - Spatial vlm이 모든 베이스라인 대비 최고 성능, 특히 gpt-4v보다 성능 우수함
        - 베이스라인 중 최고는 llava 1.5 - bbox + caption 기반 instruction tuning 영향으로 추정
        - llava 1.5는 2d 공간 추론은 잘하는데 3d 공간 추론에는 약함
        - → **대용량 + 고품질 공간 추론 데이터가 공간 추론 능력에 핵심**임
    - 정량적 분석
        - vlm 평가를 위한 2가지 메트릭 설계
            1. <u>**vlm이 숫자를 생성하는 성공률**</u>
                - 정량적 공간 추론 질문을 이해했는가
            2. <u>**답의 기준 범위 분포가 다양하기 때문에, 답이 실제 값의 0.5~2배 범위에 들어가는 비율로 정확도를 평가**</u>
        - 두 지표에서 모두 베이스라인보다 큰 차이로 우수한 성능을 보임
        - 베이스라인 vlm은 숫자로된 답변을 꺼리는 경향이 있음
            - 아마도 학습 데이터의 분포 때문일 가능성
            - spatialvlm은 카메라로부터 1~10m 거리의 중간 범위 장면에서 성능이 좋음
            - 이는 사용된 monocular depth estimator가 정확한 깊이 추정을 제공하는 범위와 일치함

            **→ 데이터 생성 과정에서 사용한 비전 모델의 bias와 한계를 그대로 물려받았음을 의미함**

- 4.2. 일반적인 VQA에 Spatial VQA 데이터의 효과
    - 상당한 양의 spatial VQA 데이터를 함께 학습할 때 <u>**다른 작업에서 VLM의 성능이 저하되는지**</u>의 여부
    - PaLM 2-E와 우리 모델을 일반 vqa 벤치마크에서 비교함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TZA34726%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044313Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCIHFUKz3K1n2bdjvqwB3lyp0X5SgbM7oTgOVIIyipzRwEAiBj2xZKjkgjMHybJVblOqzdiftFnljG9ZZeX8%2FJ6flhViqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHrWTSlMA7OVzhY8dKtwDRtvQjHgr6%2FTMBpItZpTaFesafcOABFkK6Q0bAcDUxkpsu0tIt3bLb3xWzIhyGDMzUhBeswzo6IvqWsC9y09AVniIGVzppr%2FbvYViAeuCRuVTo95dxLcYjfuP%2BG%2F3gm6pCQYrZvqCZS4T6yt%2BmTu5yoOQS1BBzc5DYb%2BXKSlJUVGq%2FdaJ6dX3hSpwxCNUiulWODlUbzOMZv96BBsm2r7F777Y%2FwMs06zk%2B%2BzozXM3N6c%2FqtYDUKAnHkQ3ODl%2BH9h04SpLeD0aHy6nxOqCwySjgwEIEVrRKgVUW8BWuCHYfFFKAujpmTZsNLVIYSlX3vdXuxYb80xaDf6KsgZq%2Fy5mEjLDWm50DsjdEDJY6lJ3PBQOHzriFIsYtG%2BlJcnE7FZs56mzeFf6P9lTxBdlaM5%2F%2BtKC2LqBkqFWUj8rZXv14FcrflnY1pjVaDXPv%2B%2FN7%2F3zwriYnhehe8varMXeM%2FvqBDbtL0C1j4P4PXVLVKBChBytGI3T9X6h4QhZwqdDIbLtw3r8qfc8tDebv781YU7apix40qUg3RJEEi9q%2Fj8ybCcT29GwG5CRhd0CJJMaMOKrt12h8OICBPPhYZvUrmOXWdayOsGfCZ0d0pheU%2FuolOGzvPUkhZjAamF0Gbcw%2FOG50AY6pgFZseWPmooI5el8SLmWP114ZFexRC32cS2xQfY9jjczgbK6yR9pC7r7gLlnkRiJDOnw4LjQzfJ9i63sapZTv0ssz8s8noPK9CaW7tDgYavxho8CzxwbPXhhdpNhdQjvNvZ%2FvxccIE%2FB7LOCK1t%2FS4F8JbQ8t7rJbCEJkABZBo6MCVPjDiPZ%2FQUYbozcVKVQDZxxuMLjXxPw14gnjMM8ROZ9bU2sN5ws&X-Amz-Signature=f7a812106d2026591fc4346958ed6129fb7ea443df1d59529297568f5aaf6b46&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2MQUA2E%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044313Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIE7jpQOkOYLAhZbvSNeKH1eMhFFloPyGnePGCRpZT1HyAiEAmlU6kl2VwV96lXmFstPXtTlNza5n%2BRnhNRMcgNpvT30qiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDKNjZsBEmOI%2B3qIAryrcA79mIUgCEeg9x7GZE3zgmZgsooxIcAcvIL5tKY%2FZ8%2BFQpOzcmEzxbIX%2FXoHUcvZ71M0oVUDqDETHJOHkZPeSPXi3bOizEbXejzgyThXs%2Fsr87kmf8fGFBsHSgjyUrDLiAf1UFiMXYsZgFKydkY3yjnHFi6y%2FFxDXZeVzN9gyuCdF3TNUJ6%2FZnqtU%2FrwTsMdRn5OwwGpmwl1CZ9CZU%2BdTFkB72QALbgM4P8jVHcvfjSde1Crg07wQpZXsfTcys%2FZGZCP7wMA1%2B2V753vSmCQto3qaR7Wplk%2FAlSOA23WPDJwYGZGQlOVRbPb5oLcviVsP97gNYn%2BmjJ5sTai35IOVg0%2FST7BfMjPJJNmSQhmD8bXp90r7Wx4cLzuU8MsNid3N5bcSbqFZdr30G7SgxYnDAzcUSoswDL8p%2FeTeGtsub2DtWY9ECz1yzkt1gUVCsoDLFFdZXBP6ZonY2DCKh8pbZ2VyJZzPwNJoJSdRPLHIiGXa%2B8TqM%2FlX5J5rOSKMi8lHoer7m%2B5ichozqGzeN5MhrS3yCwzw%2F5B6R0YXHD01wFUnN9EiRqLbFoQrc8%2FHKKv8l1IYAEM1wtrsVfZZaHBfcN9E4H%2F8%2F22tyIrCFT7OzPEpebtDmEYe7fFI82gaMPzhudAGOqUByZyAVoSu0eNRWnwDzXvWBRqRwioj6gnVsrkBBjPgptgrZeMDKta2WJUnxYwCjMPcfk8dwV8iQrxqV2B9Q%2FKcVjtVGIp7imqXThAfgVphFr2JSRNoziCPUXH5VeWeRhhQJgniaMFm6u9SK%2FQA9DYO3CFgHcql0Fa0UwXK%2FnsSPD3msHpjgp9WuV55YLJ6KYpvbNeQxYWUP2Fphh%2B36jeT9ZcR00lk&X-Amz-Signature=80163c8d26161e432fdda99cc406f35ab325d182da120c6c301c70523ebdf457&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - contrastive objective로 학습된 frozen vit가 공간 추론을 수행하기에 충분한 정보를 담고 있는가
    - 이를 분석하기 위해서 110k 학습 스텝에서 출발해서 vit를 freeze/unfreeze해서 각각 학습
    - 두 모델을 각각 70k 스텝동안 학습하고, 각 모델의 답이 실제 값의 다양한 범위에 속하는 비율을 평가함
    - 정답의 50~200% 거리 추정에서는 vit를 freeze한 것이 unfreeze와 거의 유사함
    - 더 정밀한 거리 추정에서는 vit를 학습하는 것이 더 성능이 좋음
    - **사전학습한 vit가 세밀한 공간 정보를 일부 손실하고 있다고 가정함**
    - 0.9~1.1배 범위에 들어가는 정확도에서 8.4%를 달성함
    - 인간 annotation이 노이즈가 잇음에도 불구하고 의미있는 결과임 (사람은 노이즈가 있는 추정을 하는 경향이 있음)
    - 다양한 도메인에서 vlm의 정량적 공간 추론 능력을 평가하는 것은 여전히 어려운 문제로 남아있음
- 4.4. 노이즈가 있는 정량적 공간 답변의 영향
    - spatial vqa 데이터셋의 정량적 답변에 노이즈가 존재하기 때문에, 많은 양의 노이즈 데이터를 통해 vlm이 일반화 가능한 정량적 추정을 학습할 수 있는지를 봄
    - depth camera로 측정된 거의 gt 수준의 깊이 정보를 제공하는 로봇 조작 데이터셋을 활용함
    - 그 결과 생성된 정량적 답변은 더 정확해짐
    - 이 데이터셋으로 vlm을 학습했더니 그 도메인에서 정밀한 거리 추정이 가능했음

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RLCV4LVU%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQCj9G4aCyDA0nB1aFmaqVIemXb%2FQFDHFZr4RDD1AAqxpwIgMo6X141QE7ymUU6ffAkMdEQEotJX164jw3MELExWrccqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBi1u1z0ZnG6I%2FzdHyrcA24%2B62jCkA9oVPYXCRl2pGtMC2RSuOkUbMLhTmlBDKamYOP8OcywKkxew4Yz0wl8oklJ5oeXy0N%2B6m9L6cFeMxp9Dnk6askWwPE57sPgF2ZpH6WN%2B2uahl0P7aqekbng%2F7MwA3jYNvqqS0jGpP%2FFqQWK10zHIYC4NfRh713RQ3%2BoRXqi2EgqF9uFsXwmY%2FJwtTs9E9koUy7OcI1i0LiBXTExpEVHUBtRP%2FIxVWXffOnhBS1JDrbxVlmT1ogw%2BJM%2BFHC6GQTmvpE48ZLTf2igqLS5D4IyevXknw4x2YM18%2BvkO1iJ0vRrlq6x3Tduy9D3DiH2SJAvz2SX%2Bs0aR4vYKQNYe9qfJbbv8EN7A67MPy2wxXoHUlXXYZwHpfd1aXIGDBhfcHR6akSUat7IDGOZ%2BBGFuxljKylgYGH10wq8ThLRdb3Hbv05rPrg08s6bK3B297HG4kqxtw4QIwB7YzyYKmQcpJcdu9v%2FQoD4NXDGl58zXM1QRSLF%2BhAZHEdCBVYIk4axJ4%2F63A0Edma9WsBSrNrUsGjfNm%2F9AcH%2F%2BBtbFyZY7NU0X4ogXfGHcKFsSwYqQkvXXtKTCNBJVeJ57UJo6zH0r6ZsQzvAayINs5Dv%2BtRZnL7%2BQA20m4dlU7rMNbjudAGOqUB%2Bb3rKznR345xICn1u9ztjtGSHWlAgrrjcxbiSt7wWZMv8M%2BeZcjLiJpNG9RUNeEHxV2bDXucc3vhk3hTVsyBochkSDZQbkDaQBpmJKHhpV8wpCuXSVQPqHv9nWP2MVOFvhLdxbiVlh6XXF3Xupi68fzvatL0hSaf64ONeiyBxrsEjFDvJSZgSHFBCRuED7X5r4f%2FQeV6Yj41TuMz6iQGaLWDP1hk&X-Amz-Signature=cd780ccb0cf2d30072f63ace014ec885310cc449b65ff43062b33d5b48b9d159&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WTZL7VDY%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIBD2pLttQKNGrxCz%2FgFm9jX%2FRgCPZHRh5Z2%2FoFheA1n3AiEA%2FqvXXN6ZHtVb%2BXnV9yIAPnw6LoJz3TFSxkcAfcPwHPMqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLYpr7%2FAeDPbzdJ2xSrcA4yImaOvo9xx%2BI%2BsWvslnrqUX5HHeKOiOeeOhetoOyMzzwZZYZyI1DQ4qU%2BU3TiL87ivpX77CE36W2PWMaXu83USCsxxetPbyTB4TOwElkM2pdKOmk47fyuc9luMsv7%2B81bZjHAdvPD3TXnEIzn0EdrVaoNO2XCH7gzjE%2FnupHtFaf7%2FM0kjz%2BHHYzI9yWHAR7icK07KN1txDcoigL5rjsLJjGLwECTaXgjR%2FTKngjkKr7NIvIw%2B4CbY5SgVV66dkFWnd1yOdYqfN7B7UX%2BBH6XUMwjvm7fM1AtAccCQJUorKQXpqnZaE7CtaO4ExDGOAqgjf7%2Fg2%2FIsTNi7l%2FRAfG%2BpqEtyJiF9hLxg2csoIwQCZFSGmsUM%2Fp9FsY9XKPoJpwlTw8coddC%2FMcvXeRtGaJQ0eDIbdcD5PC5hERhe%2BVyogoDFrgYKZvkE9FbbJiEDjTpSaPcdazjhG1fpvqyT7v3BmhCR4Mqed7MxguMi4i073N2WtoGk%2FYt7eBseOOunSnJDzdYDSSWvqyjyJcMmAs3y%2BwInlGOYbbFD%2BrRrHoHDVn%2FyoSkPh%2Bz%2FuA1uHRDz3ChW604K%2FqY8CG2Xhoo8hcPqoIcpcNClJlPJOWxZfO%2FbXzrw91EtIJ808w%2BCMK7xudAGOqUBfqdZJRcdcIVhLnEKNfkzWhyRS75zEE%2BHyfAsev8xEHONskO04K%2B4r9YBSXM7F%2B5C6lM%2FgZ1uCLSbNcybxUUi79s6qt5Onl1qfZswN%2BsDXxeQ0amxkgZCg6UqsPDqRYrgqx96wmT5dOa5OzYgcd5MpIwMTqbijstDPRQKRQaCj4G1lUFCz3egMqhKm1tqm0yM71IWkhOt6BgqY%2Fk86sdYI0%2FpRUnf&X-Amz-Signature=d89c9bab2668ee7773b6c3f22602629aeda1f369f048597a29976f41ce1e912b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIHWLCZE%2F20260521%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260521T044315Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJGMEQCICZSNFzrl2OQkjTwe7fbgmbcnciDjoMqejxICHUHCfygAiB72pBouy53J%2Bh4%2FwVaXzxL1J3dBqIXZGeHaOTJnVMiHiqIBAj8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM6SaztrDss%2FZ%2BordZKtwDmsfs87rZ9cmOqci%2FjFRHCVCNTe6eTXfjOANUycDjjuDj8uGc3JucPmLpWN8Hp6apj3IhW3zTRChRcmCRJc4gY5Vn%2Fnh241bVr6URONfV6UJ0s7evgPIHl6KWUlzLUnLaig4hwERT1Vs9%2BufKOsEd4xClkI5BMfRXYW5f52Uedldix4%2FKZ8e%2Fn6KXPWuA2B%2FFSPefQ6pxmkVzrk%2BL47p8fYl1qEAdRop%2B%2BaNRduOTytCXF0fJqMyz0emTSGiWBFhRpysfZm5Bgf%2FepxoJ5dlqPuwtMEtyHXG1HS7PPzGev3AYvFWlKXLHTbgAQWTs74essqtZvq59%2BhYZk8piCcmb2nCxG0P7CwvrqGUM%2FFlFq7SM0z%2BegL0wKEYA%2BTGjneJNgJFFPuJme3tY34CyFCnCEBIiuuffc30dI%2BRiGVlJB0V%2BY1zxCpt2MMmNAv7bPr9x2pB8B2IhJJ8qwlLj9P3h8DfYPQNsuMkF%2F%2Fj97w2dgb6ZZLW30MNYt0LjBWZoIUERmXK3PeQv94s5astcTqSYNOmhB23ZY9wuDiYZk3eXV%2FVAgyBcoi2%2F51HhxXA2AHfSBx0MLbOoYFGJB8NaBW9vOrNegfkPhe3KZ%2FS6BiAiVOmHFewXeIoLgz6EMJYwvuO50AY6pgHUOCfYCxoaLwlfbtGMeGZCOJ52oRBa8TGuZ1qf3H39VLEDBo5GFM3sJnNcyWdAhCu4f6a46KTIGRP%2BX2%2BQ0gn03g51EHdbCqhdj69wLo5fBYzxRZ8i3j0iAegXTGa3HmGhxh1pSocAtoy3L0uDmn9sl8QPdcU5kYGabayfd8x4vSCFiVHy8JnFDFLfRQEPWlt8J5SQOJOj%2FZCHUAWmWGZd2tRCTXgO&X-Amz-Signature=22045094751a227439af479a157e6896bb0b0818a3bd379503fee4ac8b718d78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 거리 추정을 통해 로봇 작업에 reward/cost를 줄 수 있음
    - 다양한 그리퍼의 위치를 샘플링하고 그에 따른 cost 함수를 scatter plot으로 나타냄
    - 모델이 강하게 정규화되어 있기 때문에 거리 추정이 평균값 쪽으로 치우치는 경향이 있음
- 4.5. Spatial reasoning이 가능하게 하는 새로운 응용
    - dense reward annotator로서의 vlm
        - vlm의 중요한 응용 분야 중 하나인 로보틱스
        - 최근 연구들은 vlm과 llm이 로봇 작업에서 open-vocab 기반 범용 reward annotator 및 성공 판별기로 활용될 수 있고, 이로 인해 유용한 제어 정책을 학습할 수 잇음을 보여줌
        - 하지만 vlm의 reward annotation 능력은 공간 인식 능력 부족으로 아직 제한됨
        - spatialVLM은 정량적으로 거리나 크기를 예측할 수 있기 때문에 dense reward annotator로서 적합함
        - 자연어로 작업을 정의하고, trajectory의 각 프레임에 대해 spatialvlm이 reward를 부여하도록 하는 실제 로봇 실험을 수행함
    - cot 기반 공간 추론
        - spatialvlm이 multi-step reasoning이 필요한 작업에 활용될 수 있는지 분석
        - 대형 언어 모델인 gpt-4에 spatialVLM을 공간 추론 서브모듈로 결합하면 환경 내 3개의 객체가 이등변 삼각형을 이루는지 판단하는 등의 복잡한 공간 추론 작업을 수행할 수 있음

## Conclusion

- 본 연구는 vlm에 공간 추론을 주입하는 문제를 다루며, 인터넷 규모의 실제 이미지 기반으로 3d 공간 추론 vqa 데이터를 자동 생성하는 프레임워크를 구축하는 방식으로 접근
- 대량의 노이즈 데이터로 학습하는 것과 vit를 unfreeze하는 것 등 다양한 학습 설계 요소를 분석함
- 학습한 직접적인 공간에 대한 질문은 제한된 템플릿 기반이지만, spatialVLM이 공간 추론에 필요한 더 복잡한 COT 문제로 확장될 수 있음을 보였음
- SpatialVLM은 로봇 작업에서도 유용하고, 3D 공간 인식을 갖춘 VLM이 로봇 작업의 reward annotator로 활용될 수 있음을 보임
- 더 정교한 기하학적 요소들에 대한 추가 연구는 spatial reasoning을 3d 기하 구조에 완전히 정착시키는데 도움이 될 수 있음
