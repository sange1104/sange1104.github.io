---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YR6P4PZU%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050353Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGDQFIBYwtS9dhUj01Tp4qyfGbncwqyqkhjM7GN0zIPAAiEA8PKwzwdRoqSzEPdrmLzY5Amimhnxi%2BVAOo%2FGnBPs2lQq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDBw5tY5IJqF2lp80oircAxGJTTrUQqUY6ynHYPhjYpfUNav%2F%2Bh7zetqmTC47x7GNPyQhRLz41WsnpDX1xH6bVyTZW0tV0NB0TeYwGbBi7IrxC0amRykLxxMwHVdGjRI3WPwtzP2uddcJji4wwRH16fyAAJGW%2F%2B8hVOz0uWNOQiF786pQmTb6Rx8PuybHBANeNmtstwmfm4cZpg1lClHEFvXT7sw2UKcitQCEFYuL13eb5NBFDYfvhWoCUZVW0tl%2FmxmxVyPnc0ZPa6dSgo0NUTwGOrIby14NsKpoLoxNzjOO9JsznRt9wbcYd0cK8GMdjoKF2bpXVstu%2BlJy%2Bh1J3qTYBvVIVY6AnocDyjgaEvwPsyaxGbybnMR32NiYhbzma15ZxyxAu%2BXu0twHbiU4WqbC%2BL%2BWDOGxESKmzZpe4KYTRxGRkD%2Br4gDMA9xaeDdoOoq%2BTtB%2F%2BO2r3VQie%2Fu2mVokHmoeZdzEQti3kv4g8eYmVQ0puZxHBBDPUD9bTYatu8vfeXhInQlRIf%2BYoOdJkSQ%2F9P09RQLnJMh9r6JWSdsKUTp9LfFSkgndntr0TZha2XzvlVWJmCYuzktd%2BsT5cg4JlvmrzqM6VE8zwZCBybQgseZPqmmGrmH96mnYRrKUzQVUrAt%2B%2FB9BU6fWMJqGhNEGOqUB86ZDOp9Oa9ewMZK8OI2qqnrvaYwvjgXWzO4Ubo2HJXEk6W2C3jT224F0GgWRzRNvkTqGZraiYLe0YfHO2cajACqXusy7IhAe5%2FFZ989%2Fv78LGjbnELWBvygijsgSUeKiIcY9Vr%2F3XhbvNmXIG5EZ17eXoMIgQEDO2Qct6LtP%2BNn%2Bzbh%2BdcP2P9sfn69Y8dFv75Yk9%2F8VjloY9mV%2F9Pq1ukuIBUEw&X-Amz-Signature=906202922a9da19fddca0e1c21ab15307c1062f374e0814102cf521ffb28a7a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YR6P4PZU%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050353Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGDQFIBYwtS9dhUj01Tp4qyfGbncwqyqkhjM7GN0zIPAAiEA8PKwzwdRoqSzEPdrmLzY5Amimhnxi%2BVAOo%2FGnBPs2lQq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDBw5tY5IJqF2lp80oircAxGJTTrUQqUY6ynHYPhjYpfUNav%2F%2Bh7zetqmTC47x7GNPyQhRLz41WsnpDX1xH6bVyTZW0tV0NB0TeYwGbBi7IrxC0amRykLxxMwHVdGjRI3WPwtzP2uddcJji4wwRH16fyAAJGW%2F%2B8hVOz0uWNOQiF786pQmTb6Rx8PuybHBANeNmtstwmfm4cZpg1lClHEFvXT7sw2UKcitQCEFYuL13eb5NBFDYfvhWoCUZVW0tl%2FmxmxVyPnc0ZPa6dSgo0NUTwGOrIby14NsKpoLoxNzjOO9JsznRt9wbcYd0cK8GMdjoKF2bpXVstu%2BlJy%2Bh1J3qTYBvVIVY6AnocDyjgaEvwPsyaxGbybnMR32NiYhbzma15ZxyxAu%2BXu0twHbiU4WqbC%2BL%2BWDOGxESKmzZpe4KYTRxGRkD%2Br4gDMA9xaeDdoOoq%2BTtB%2F%2BO2r3VQie%2Fu2mVokHmoeZdzEQti3kv4g8eYmVQ0puZxHBBDPUD9bTYatu8vfeXhInQlRIf%2BYoOdJkSQ%2F9P09RQLnJMh9r6JWSdsKUTp9LfFSkgndntr0TZha2XzvlVWJmCYuzktd%2BsT5cg4JlvmrzqM6VE8zwZCBybQgseZPqmmGrmH96mnYRrKUzQVUrAt%2B%2FB9BU6fWMJqGhNEGOqUB86ZDOp9Oa9ewMZK8OI2qqnrvaYwvjgXWzO4Ubo2HJXEk6W2C3jT224F0GgWRzRNvkTqGZraiYLe0YfHO2cajACqXusy7IhAe5%2FFZ989%2Fv78LGjbnELWBvygijsgSUeKiIcY9Vr%2F3XhbvNmXIG5EZ17eXoMIgQEDO2Qct6LtP%2BNn%2Bzbh%2BdcP2P9sfn69Y8dFv75Yk9%2F8VjloY9mV%2F9Pq1ukuIBUEw&X-Amz-Signature=9c0f17c46517e3c65fa55a6bd7809eb4c54fb2d531f0eb5338a88d6925a3e947&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YR6P4PZU%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050353Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGDQFIBYwtS9dhUj01Tp4qyfGbncwqyqkhjM7GN0zIPAAiEA8PKwzwdRoqSzEPdrmLzY5Amimhnxi%2BVAOo%2FGnBPs2lQq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDBw5tY5IJqF2lp80oircAxGJTTrUQqUY6ynHYPhjYpfUNav%2F%2Bh7zetqmTC47x7GNPyQhRLz41WsnpDX1xH6bVyTZW0tV0NB0TeYwGbBi7IrxC0amRykLxxMwHVdGjRI3WPwtzP2uddcJji4wwRH16fyAAJGW%2F%2B8hVOz0uWNOQiF786pQmTb6Rx8PuybHBANeNmtstwmfm4cZpg1lClHEFvXT7sw2UKcitQCEFYuL13eb5NBFDYfvhWoCUZVW0tl%2FmxmxVyPnc0ZPa6dSgo0NUTwGOrIby14NsKpoLoxNzjOO9JsznRt9wbcYd0cK8GMdjoKF2bpXVstu%2BlJy%2Bh1J3qTYBvVIVY6AnocDyjgaEvwPsyaxGbybnMR32NiYhbzma15ZxyxAu%2BXu0twHbiU4WqbC%2BL%2BWDOGxESKmzZpe4KYTRxGRkD%2Br4gDMA9xaeDdoOoq%2BTtB%2F%2BO2r3VQie%2Fu2mVokHmoeZdzEQti3kv4g8eYmVQ0puZxHBBDPUD9bTYatu8vfeXhInQlRIf%2BYoOdJkSQ%2F9P09RQLnJMh9r6JWSdsKUTp9LfFSkgndntr0TZha2XzvlVWJmCYuzktd%2BsT5cg4JlvmrzqM6VE8zwZCBybQgseZPqmmGrmH96mnYRrKUzQVUrAt%2B%2FB9BU6fWMJqGhNEGOqUB86ZDOp9Oa9ewMZK8OI2qqnrvaYwvjgXWzO4Ubo2HJXEk6W2C3jT224F0GgWRzRNvkTqGZraiYLe0YfHO2cajACqXusy7IhAe5%2FFZ989%2Fv78LGjbnELWBvygijsgSUeKiIcY9Vr%2F3XhbvNmXIG5EZ17eXoMIgQEDO2Qct6LtP%2BNn%2Bzbh%2BdcP2P9sfn69Y8dFv75Yk9%2F8VjloY9mV%2F9Pq1ukuIBUEw&X-Amz-Signature=0272eaa5a54d25f6ff336239dbc68d31df66f13de431bb58f9e461189a22dbe1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663BTRK5IV%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFdS3hlygJ02UtGNrSnazgYN0Jt6fWsdnCV6SP511qSJAiEA3yTSoda4SziLYCyEY7c16DWx9D4ueQoyxAdV%2BZetYc0q%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDFS2rqnIqLvWYGvFdCrcAx0j6zFFLPhj%2FEjuVtH7EimcgxK%2BUn8x5P%2FxE%2F8b9CzrkT8yUJ150ujD2aRwpEhGCAciGqeDVjS4pYvKX7hu11RUduEiDkPc%2ByORrFVBhmGsp9HRKx0az48K7zZOg0r7pamj72wc1jN1WNEa442soEciTRck5fGLkza7QMLaMERzLzkSEHudU5L03GMNRqcNxLR7VJHCBgqvFZgmZkJDhewtPfThm67J54zpE9kVjztwSUFXyDEfgGhAdYiq6WQlYVWE6Wz7Q3BdqEdzhLnAPTPv%2FFTKXgCN8TUwc99bvec0TgDo1yboPzkygmOOKSm%2Fz3UZgZoHLSy7wUGmLnOD9XWFpan9H5xheSNbyGEg8gkLWF4nZSwgYYM%2B1wo5u9976DHxwRrYsw5DtT1cdN2DjfStp0trXXjoF9J6EgnO4L8mEBLM6hkT4UDODiyCVC3Eqxh28x7TZsDgXRAiW5p8XZAW31R2nfs%2F1cWZkBBZ5D42CotyP63zPkTmrLW0sY5Z0ewSWWTWgJcim%2BqShPgcQ9UDzKgTijqXSqvHkkICWkmOVF3C6Vybz4Df2U8eNX3votZseQSSXVQ02mcsGlehJXDfiZEd1ALYm7qLJNtgnsz0ytl7T02%2FWYBzNw1lMLyDhNEGOqUBCYD5sv%2BtZGUEN9hyAIO%2B9Xm3L00ie03JagvfQDIhi3AdzwKTiq8Ut8TnrYl9G%2Fm6WcjNPvQN8QoAVEMRSca5DEwFOAKcfs%2FiuKBq4sM71AfbxZctM%2B4kSml7ThR1%2BfBRpbrpbloT%2BKeSP0OXeQPTZfDQ8H48HEXfUJ0BTjZy0v%2BDj8O0e9qoBJn%2FmyBTV6E75PymUBcV8oCevROEcjwCrwe3Z0Ct&X-Amz-Signature=ebd375746dd03fddb25d34f450e7de4b0fa40ae2d12d403bc5dcfdcfecfc6f5f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VAKZRDAI%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGAgaz4wXtvg6SdCUf4w63metj95%2FO7%2BEXhEHBth4vTlAiEAw5SqqOEfJBMgxU%2F%2BLOw2fiXvS4vrVhBJZiMjSHhjX3Iq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDFJS2Ps1fjIXlclZtCrcA9z2X2zMnEKkPXeP5vdEEQ6DE8b7qdPk%2FcZJ2eBIuAzG5y0xLAYk6iVCCcogFyJVnvp0skRNPDBSXIXUIOSAXLcB1iPYekU0RuTlzf2r6PduAecJIGrAQirFUjYRmFwI0s%2FLDDl%2BCrPtld9%2FOJOURiFzgPVXNpj1O3e0w98HYW2vdzKnsx2TcNutArbLgRPL1chib0LqvG3nQsSlhG35QCbio4cvFunBvQ1l2t7P7Y95y%2FB%2Bk8zTtaW6qV9rLSBz2KKBWSgIv6UuSl9zKwevG7fhOEKFKElTt8W4%2F6L%2FR5T4F9XtvJ2l%2Fr2FIggD2t3c0HKC3CfBLAqIfAiSl%2Fn%2FVRbbs%2Faps2CnQC1BgYoPT2D6S9VH13jxLPTyRrxAxLnebDRau5dppg%2BS%2F4VWnTKUyAR8Sb8NmqCjWCnrM8AUU%2B8EfUPEk7Gq1ysA%2FSbGNWNIZ%2BOgY2uv1yYoAKmSt4R6wXaU5P7DQzYZmEEYTmFEsn7yhYk8pZ7dFIAtLK0MdrvMh%2FoSuudTCqKk%2Bl1F7PNsHs3u34PIzPszK%2BCAlWWOAIjxgFsjZQF9WDEtuVnDgzv30HlWqHjC3bdzwsSuDAc5jTBZPuy5%2BYuHhm9BVU4UL%2BHUU78Hduitmoq9drU7MPuChNEGOqUBlC%2FX9sDDp22thY6DOire9YZSQJKojgOY62lAPh2s4W7VsUm0CmHkVBWhW0LQk79oBTWnGr9K%2F6GkJq%2FIkAYo%2FeLMJk5wdTnhpvgC3VVyyltymB%2Fdgx8jRZfavYOpDdBmJVFy8P8gi4M08vqynWtroMoJF0Kjj6MdIu4UlJDtoM3lYooKtfj5dJf%2B7aQVtv5qBv6i8vCwExrjILJh58%2BsM0I%2FAAdX&X-Amz-Signature=8bbf1444952bf894240c1d7aa92653e021f86bf46882705b79d22e45af8c0aca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WTXVAXU3%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCnr6AqJOpQvOgY7flHGR9HGUQsS%2FtDK6%2BbI3x1oHvWoAIgbSjcUeAMbL1Id1iidG6MhTMx3VphTXtAu6dLLzzwSX8q%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDBtLMhrZD68n3EYA3CrcA5Vnis1y%2FvNPN18trpis0bkzhYkEBgviRKtSBhi3NE2Vr3iQ1bEINUUdCZjqUgyZaEe8hFR83EUAKeZhNTjK84Q38WFceWWHb2%2BQvMkDkEowl739OUyaKMzbhEWRy02cRVeMr1hNSOOkHK7ap6ghOY1L8qgLcdwi23SD9%2BiE96KQ5F5OliILJFRFOXJRTXgxJQPreOGx9TkB7SENix6Na46f%2FgSwZ1Zmia5Q9h%2B6GxTyz54iJsTuh9pmT60OW43hmHDxNF%2BzC%2FPGLS5%2BGGoxVPHgnK%2FCj6jmTqvYaPwawXDT2ziuJruSPxZURLEYOVWE5Cb17Lyc4gJix9Q%2B3rd450u7XxO%2BQlrD0FDyvKWfZkUcUH2xowYTH2IVsElVa1l%2BKOSnQEc%2BUOuqtA4%2FTgNZv4qqVdqc8sHf%2FzypmPQQtr%2BLBmeTTjn0W9HpVOazYAmMPJ3acJPj6haM4tR75553MelJ9G06%2BSBANw%2BCoMPGOIaNF1XlG7bfu9nmHOAEODhlaGmJZ2AmUic9Ps9fD823HCaCjqF6taHbm6ZNrAVfG%2BMItBQjbuUPVUWQwtf%2BQ1%2FI28f1OPdmxMmqaHvCYBuGMe5FVMqI0EuxZJ5%2BGkCc7QbDIDDy5%2FXKLasx01MBMLKDhNEGOqUBW%2FVllSasBhj4zdrSJaI0WsB2N9XunOTvhhhHNQetkIY8Sop7QADPMejCInDRqLn1sUZ%2Bu6HW%2F%2BigKwd5G1McekuffGRiIqK0JI2nJhrlNkrq%2BW6mkbKyIw2LEOjgev0R3dSiHf7%2BAu8Eo577rtcvKIWKGdwBHjxjodE4KkPsZdRRkyF9Xyp8AlIMh7n4u0BhoJTLYglM4sNfkiKKhYAnBya7V8Xf&X-Amz-Signature=38f2c0ed371adce6262406ff34f6de0c44c652ab01f4f9bfdfce66a7b23b60f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XCE7WRBK%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCs6dJFaML1peWkBMpFrIndyyqxRLIADUJCzFqtp7%2B8iQIhAJyNsXcpwOsyhxKs7rO2By23Y6cmZo88Kfq0T3nILZ%2BdKv8DCE4QABoMNjM3NDIzMTgzODA1IgxQC8V9shOfzCjueSIq3APHftEkyLjwDnUodgO16eYjz%2B5NxTAFFA4q3jt936P%2BFMijMar7axzVVlMN4A%2BrIRa34nE6hJx1kOtkqk5I4868GfnG5zCxX8Qns8ACgg%2FSY0SMY7B7H5DiuBZxguV3Wd7FA0jKBmew5K3uibUN%2F%2FuvOEBbUFJ5GqvzvJjGnlVeLggnEzBfhLj6hoax3WyzdDqv5hiPEuDqjXzQeD5EEEXEkbvhqpbFtvnVRJF50ckrDKU0DXroKTLNByhfSijqPZni5yS44ARlv1w7mz9GEwA1G4vOpavWTMFJfh0cWFK%2BW0kvtgVROfsBvqJzkKX%2Bv%2Fh9fx2TGWAP%2BcSsnmOErW62FlUUUwTmboSOuO%2BNm%2FIojF6%2F0FEFQPZtMcEWSzTH5RepUKBHAkBfCUqh8TJenbdsnTmndkpguwo%2FycrqjwQprRteNbk5ao4pu7Zv2a1rDYNHZ2L4%2FKTYFndo%2FPQ2KdHommTMExfX5sbDPEhalYn9qIIf7kbsB9iRaqJbv9N%2BCekwkg9%2FOci3dYcjp1xc2oiRtVPxSfUCuQkYxs0iAYUwBDuyubIhTpnbR%2B0X%2BzBPWSQqZAQblafbfk0K%2F2I02m1B6ifuSVenvqKemvPxEhgc2tqfBT365pJL%2BT%2B1KjCbhITRBjqkAaaCiVOeMd3M38knv1jn%2FhHB0jTWsuV3DHrHCzk0kUR8Cv3MytQgahvLhlrU7DJEtHPevvyCVlDwIR%2FPCgTaFRwHgZZAy6tZg%2BfXgh%2BvI883str%2Bb9DPV46wPmZINvBk7vl%2BM8jyFiMxGDkjt8D8KR2n3vziFx%2BwXkzn3gXB7aJTHpEoVgxWQ2%2BOUTgXEeQxVw8NW0TtbDdLNyNUrVnObfsJ1kNh&X-Amz-Signature=ec4975b9f2ecc6c9df4aa37580fad66354e64a3865d00e52fe3b90851926afc4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRKXEUEM%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDPbF%2FXbFztUjJ6dIKJFXzXia172x9HswTXmPLIItWQ8gIgAvfOWPgqUEWIM%2FrqGeEPllET%2BXNctApUIG1wsngkQToq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDL%2FolfuiFKjOI5R76CrcA%2B9b193R8oFhnvbZwBKWSpDbbRgDJMPTVD87jQ7ILO8mNnsVDNGBaMCCghH7wtOgUCBZjD%2BOZrJ4RmpTMxXm9VFlU2ZW60o2kzmProcj9YGRGZJGqdY0Ol0ewkDTHN6%2BGLEDBQoLDQVMQn4tA1f8i6zrGy07kJ0RQwSLng4fUMwfaBYqUbFtFLcDbGXYhKp5fS8t0B%2FHyurPzOPAYtDHBmGguFi37eKO6qwFDrlRTjm7HLNSQkzHIjuJ8lquHsklVdfioKL6yEj9zb4Zu2tq1S2ARdsTUwk0IaHuOutT%2FmdIKH%2FlzA8Rx%2BMcobL88%2FFsYrT9LmcITzMUZdZ75Rbc70QyhFXPFyWOi%2FqEQXSPGBSwXgLG66r3a%2F%2FZyoMh0Z6URmxhXak7zaYGI0GTfoHG17kJJrWQPI3saU%2FLJ8Qc7t4r9hvltEDEI%2BwTIsY1pFshKaKUo9gwbCzM1%2FGrm4Hz%2BVmkBFdkrGrGpQbv%2FXfOoWAMeKkuTcJVSllVGARWCmiU0BGb01J7zOxcH20nCj2%2BoyIzv6XP7vwq4KSiDI8Dja8uxVKS1tVbe442cyBhDrY7y6VqqWY26%2FFuN01iRU76TPQJO3fM%2Bx8ccQN4zpqtFjTAR1D3MMMQnLRmVqc9MOGChNEGOqUBtALXbHmt95VEDKLXp7bp%2BLba2JGmdP7BtwVa5TXFoLCTfYGxiUGo3Q37S7NeVvJRP%2BHXifOrekLxMKovmRMnAwIp%2FDcec8jcMlaayUIkKsHslS%2BmzyJmbFHgZnlQoBY%2Bm6o5c26nfuqZLRq828l%2FbsxyNngKDnjrVPgKxV%2BTxa%2Fr55ghnmgmBD0wOaBS4Wa707fbep3UO8O5hWWV4dzRODiW3eOF&X-Amz-Signature=c961373aa02fdc015bb48b34c6eae07448a66a3be9e47b3eb2c168ff20c68732&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TFKR6KEE%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDJZslaUfSczndNJ1pepGRScjRE4dR1ig6GgkxxH4ERNwIhALnSxHvvC3CmHExcY%2BHfeAv0S8wA56vKfecm6d0fbiSfKv8DCE4QABoMNjM3NDIzMTgzODA1Igy8Zq1jsEANMuV47toq3APSV1FyRL%2FzFll5j%2B6PrF5QeQjvFOpi2i%2BsNCLgJO7fwrLc07%2B7hi0byh8Jb1ZoB%2BVj1z5s4iXp53VLfwi5wQo%2BTyEVRprkO5wGXb8SOwJRsQ9vGjecS98qD%2BGeHMxONHqzP3Pet3XBW03tkJGDC0706eLAki4N3QxAl3pWPhrQcUiS8dcg%2F%2FLcOAOQ8CQwFNWY9AlOckmg6VcmL7MzpR8F0JBpUBlh1jt37Gb73w2xTW%2B0wOPL1QX25PDcsWSE7wtsWo42EUcOZSCSucGiwDfRXJ82Fne5lv0Yyz4vrygoxkyaqZJekwnr5C0dOKqLVnwsbQf4boiwrBO%2Fz9980MEZCut2Yv6jRkQ3pW3ZTC4h%2BmogmMvimDXlqIUZ05KOdT5FQevywunjZy44%2FY5UBUfVQPg0WzGffGLrdCwDduVI%2FY0E6KtOldu5GxjcDrENrq2kC59r1gFq%2Bcdm65e%2BBGglHvI6yRvnN21UvI695KaabOLjlQLaaiQ8mMNO6Q7qF49rL3EVnQBnLA6dfVUA033dsF5GqCod0ls1%2Fu2BUkofpKxTCUvWIQbPc83A4F7Zf%2BBh3ZJCyATH2paXkU1rFA8W44nWh0uT2qxZPuzc19T2bgcmLk9MBCOwXEvM2TDCg4TRBjqkAfJAj6JtnfiTpPsrOhFdtdvrXQ3uKg79r9cs0dxzMRBukftwbfkGB6RUQ7YH650y8ruVcY6VhhI4EDljp2TU1q1JpT02UQcqSce8hYwyOD44IH6mqBFfgvrHuNTtuZP4%2FjePirDMQHY8yJNmBlWsquaBQ%2BD%2Fnyk%2B0TbXehbOL1PJzpFKefzIyRdDAeejKcX%2F2vJWHaeanzbROzKpv%2FSJlDerAQ2Y&X-Amz-Signature=fd0f2fdabcae0eb494eb0b0e9ba0e70f0ff60b0b6ae8e29b1b547410b842cb97&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WORE3HLY%2F20260604%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260604T050406Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCST%2BsSKkp1nVfZh%2BgMD6mp%2FRddnV5Z6DMs3qxtgXKiDQIgEfPAksshl%2FYOEdjVZR7W%2B34eXaLZUpJtJbiWEuliHXYq%2FwMIThAAGgw2Mzc0MjMxODM4MDUiDF4FSfxL8qIJMYG2IircA8f5NLQI3rc5iFRnSKJQUyk9iLEQC2NLirYS3lbq4Qoj7qepYcQFTQGCcxpvu7MclGR6dgVFICn%2BHRWfYDT4TESACaNW3Xo3kEgW39IgKBcFHrC2g2az%2FqO1AOrMM%2BFbqMkFxSgpDaZBmtkSzg%2F3xcYedkqoC9eP3V60M%2FPrYX2aVjdmQIo2TAh8eaeJtihJDi%2FsuYysX3NBab4D%2BF4yBumtsVzHtc8zsIkNKPKFhSUgGTukUU%2FWsqduYixH7wlufW1PoaUDRLxvzYnM9gAqC564VUHP73mjLuIripVkMxPsBdmskONCgqwIsMqZuiTvVjlw8G2s4DDsw%2FFZYMEBOYM3EHynserhVon6cc4YtqSv5MwThahTdRK0HNmOtynz%2Bak2jD1ChWk36BEVXNBeDoQmKrbKbvY9ZRkb9kwlkKAuLyBOweaFFsVFNxHxP4R9iQUxmP%2FiC9%2F2ePY7L5GC8KmpNBJaj7Z3%2B96M7moe59oA9397uc6hCLtgPXYmjzdN%2B7RSlg6xcG%2FQFcS8PXsJ8GP0IxkWeTfZ5hSeLeugi60fPFOGOEfdoaSO%2B7XDlX6IJcW9k5PQuKFjyAhtI7WAnwFQXBpKpXunM5P0nTVeeUb%2Bk39wdn1OC2IC4UNSMPKEhNEGOqUBReKZ%2F6qD3ZtNxvYBaXnnHi%2F42Bezo6hpCNM8n3GyKPygeQU10ivjhrOTAcJa73nkQUN17aLsvzWUXKrrNHpYnd1RvTsH%2BHRoKLWPaa7y%2BfJDmqi1CJOlUJ4jMn07cHvUTisQaTpl%2FTL2a9rwSx7mb4bClE7BNHsY7FliNskG6urBQVvYEwUCDbIp70bor5JdtyvrfkRBXaSHgayeIUAYCAInAjmj&X-Amz-Signature=6af43901c5d051e7e5313821cc9f08896da27904d7ff9f90aad65975f0e5de83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
