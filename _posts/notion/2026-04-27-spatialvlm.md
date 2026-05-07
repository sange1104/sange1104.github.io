---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2HVAI57%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICFfLpKlCQbWCxvjwqfmo7V9zM6hMnLOLeHv0GUPzUx%2FAiEAxM7k3LXySZrXB2%2FFHfXrV6OoATUfKDReg5eh4CK7w%2FcqiAQIrf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDONRR6JyMVXAE8%2FHqCrcA7pGbuPcHs%2B0Ok%2BCZV3mXLvTSJEIlDfZC4S4p2veMJqaE%2BsdpmpIEnUPohVwZtE%2FZqpzaRh16Zhvy5kbAUo%2BCrGmoJnPYNS4ZQhBJ8cfHd8r4fUzShjuTUMfUoSjj7T4Xga%2BxMvPW08GxTXNqOzp1LuaWFjD5SzFaP8Dp48MiFKKUhwYRSNKGAL%2BbP5b3ArFWP4RTs5FQBtJAOY1mDkbpOmMymiwuIh55r0j7LqiyYKaQ4GuhOkcJvfNYP%2BlKU7wl8Pwz4p%2Fknl0IBELd6rzjgtjp2GhGazvfXmX0TFIpOw8A3Wnhl4bQvQ%2F5DjulTmzcHXJFfdDJq%2BXX8fP5OdtvQGJBFxQxWl%2FtGvQC469gAsFrC9skmOoc3GBnqSDlhaHqDN%2FmSrIo7m%2FcbJOWcRznl29YyzsZabaVrKxifhiDCTMrBrQM9mPJHhf3T4ZJdo%2BMBHjeZwU8h4mPgXKJ0EbK8hyd49noqcHGls5LHRPmtbdLasCKrPBasfaxzQ6RtM2RUy74zE0YhYzF8EFTQwEU2Vi%2F6y%2BUV%2BaTjYZMdEdl3djFtTTFv6MKnCwvO8%2FQLrE3uZfncz9qqDHEwhT%2BK9kpXX6j15v%2B%2BovfiwQclqZjlboRLNmcUJLQx7Qs0hPMJaL8M8GOqUBWNSrWJQT8Bj%2F692diY%2B%2B1HFev5qhCBEkCe1VJqJWwZliLMQXpub8VE4KIZ5%2FZyKim6knct7K5Anz0y8aDS8SGMUVstNjLuEcnHtiM6nWTnmQoUWtvCbFaHq%2FyXEThDDJ1c3X7yVMw6IfdZAuKl8IouyFkTjMhqzFE5gUuiPITVtRD6yr%2FifgXgCRqJwGymaeU%2Fx5rWvwwNaboMG8yWNGL3iFQfO0&X-Amz-Signature=32e6099a78b4b29e41622a0cb6ce880b265e9ce3b7b0c40372c970da7ea363ba&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2HVAI57%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICFfLpKlCQbWCxvjwqfmo7V9zM6hMnLOLeHv0GUPzUx%2FAiEAxM7k3LXySZrXB2%2FFHfXrV6OoATUfKDReg5eh4CK7w%2FcqiAQIrf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDONRR6JyMVXAE8%2FHqCrcA7pGbuPcHs%2B0Ok%2BCZV3mXLvTSJEIlDfZC4S4p2veMJqaE%2BsdpmpIEnUPohVwZtE%2FZqpzaRh16Zhvy5kbAUo%2BCrGmoJnPYNS4ZQhBJ8cfHd8r4fUzShjuTUMfUoSjj7T4Xga%2BxMvPW08GxTXNqOzp1LuaWFjD5SzFaP8Dp48MiFKKUhwYRSNKGAL%2BbP5b3ArFWP4RTs5FQBtJAOY1mDkbpOmMymiwuIh55r0j7LqiyYKaQ4GuhOkcJvfNYP%2BlKU7wl8Pwz4p%2Fknl0IBELd6rzjgtjp2GhGazvfXmX0TFIpOw8A3Wnhl4bQvQ%2F5DjulTmzcHXJFfdDJq%2BXX8fP5OdtvQGJBFxQxWl%2FtGvQC469gAsFrC9skmOoc3GBnqSDlhaHqDN%2FmSrIo7m%2FcbJOWcRznl29YyzsZabaVrKxifhiDCTMrBrQM9mPJHhf3T4ZJdo%2BMBHjeZwU8h4mPgXKJ0EbK8hyd49noqcHGls5LHRPmtbdLasCKrPBasfaxzQ6RtM2RUy74zE0YhYzF8EFTQwEU2Vi%2F6y%2BUV%2BaTjYZMdEdl3djFtTTFv6MKnCwvO8%2FQLrE3uZfncz9qqDHEwhT%2BK9kpXX6j15v%2B%2BovfiwQclqZjlboRLNmcUJLQx7Qs0hPMJaL8M8GOqUBWNSrWJQT8Bj%2F692diY%2B%2B1HFev5qhCBEkCe1VJqJWwZliLMQXpub8VE4KIZ5%2FZyKim6knct7K5Anz0y8aDS8SGMUVstNjLuEcnHtiM6nWTnmQoUWtvCbFaHq%2FyXEThDDJ1c3X7yVMw6IfdZAuKl8IouyFkTjMhqzFE5gUuiPITVtRD6yr%2FifgXgCRqJwGymaeU%2Fx5rWvwwNaboMG8yWNGL3iFQfO0&X-Amz-Signature=efe5bdb4b2f6e5103568c23917072418e5fae87d7048ec9570cf8fe1fdb95a75&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466S2HVAI57%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICFfLpKlCQbWCxvjwqfmo7V9zM6hMnLOLeHv0GUPzUx%2FAiEAxM7k3LXySZrXB2%2FFHfXrV6OoATUfKDReg5eh4CK7w%2FcqiAQIrf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDONRR6JyMVXAE8%2FHqCrcA7pGbuPcHs%2B0Ok%2BCZV3mXLvTSJEIlDfZC4S4p2veMJqaE%2BsdpmpIEnUPohVwZtE%2FZqpzaRh16Zhvy5kbAUo%2BCrGmoJnPYNS4ZQhBJ8cfHd8r4fUzShjuTUMfUoSjj7T4Xga%2BxMvPW08GxTXNqOzp1LuaWFjD5SzFaP8Dp48MiFKKUhwYRSNKGAL%2BbP5b3ArFWP4RTs5FQBtJAOY1mDkbpOmMymiwuIh55r0j7LqiyYKaQ4GuhOkcJvfNYP%2BlKU7wl8Pwz4p%2Fknl0IBELd6rzjgtjp2GhGazvfXmX0TFIpOw8A3Wnhl4bQvQ%2F5DjulTmzcHXJFfdDJq%2BXX8fP5OdtvQGJBFxQxWl%2FtGvQC469gAsFrC9skmOoc3GBnqSDlhaHqDN%2FmSrIo7m%2FcbJOWcRznl29YyzsZabaVrKxifhiDCTMrBrQM9mPJHhf3T4ZJdo%2BMBHjeZwU8h4mPgXKJ0EbK8hyd49noqcHGls5LHRPmtbdLasCKrPBasfaxzQ6RtM2RUy74zE0YhYzF8EFTQwEU2Vi%2F6y%2BUV%2BaTjYZMdEdl3djFtTTFv6MKnCwvO8%2FQLrE3uZfncz9qqDHEwhT%2BK9kpXX6j15v%2B%2BovfiwQclqZjlboRLNmcUJLQx7Qs0hPMJaL8M8GOqUBWNSrWJQT8Bj%2F692diY%2B%2B1HFev5qhCBEkCe1VJqJWwZliLMQXpub8VE4KIZ5%2FZyKim6knct7K5Anz0y8aDS8SGMUVstNjLuEcnHtiM6nWTnmQoUWtvCbFaHq%2FyXEThDDJ1c3X7yVMw6IfdZAuKl8IouyFkTjMhqzFE5gUuiPITVtRD6yr%2FifgXgCRqJwGymaeU%2Fx5rWvwwNaboMG8yWNGL3iFQfO0&X-Amz-Signature=d4247b67b95982354d4651ed7d41f1cb7ddf40c5d7205b1ee1a474bb97d91218&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664ZELIA5R%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040400Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHT4FenUQ7uAgfML4H0guzvbw8MSG70nDlHa7tqPmaj3AiEAlZurQKCGqZWwdJQlfvoCowvpwKI80sNMEBkIHgzWPgQqiAQIrf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOXVaX3qdE8sIg3KzSrcA4KR9vwW1qwlJSLXufcnqoAFk2kHDDV4inmZwoSpHwsIqmIwJn%2FKU1AGkzKy8DvibMQkYQiOziX1VOSw8odRBK%2BmANQHmrOCThU6uF3lGwbtPDKUK1jETLGhZpiT7lIjUIr4bltpbgt7nUrc2eoEpCKOflpMW169tU3tOt3QZZJ28pq%2FmLSK1tdSYjpzLqhBtp904nhMF8zs5DMxpWyl9WQdTogVrgr5clkOMO9uLtHucTfacK%2BBPbUHD8mCcex%2BqxZDHrxsOYHR2wcORXpRxsQ8sFCSFoDZ6FMSr8h9anXfkaEsVm0aHWIBqCpIQrzjVeLhf2ry9vwyfTJd%2BqOAW9sxecQerw95fA0%2B6mKkEE2Y9%2FZO%2B7%2FYHmYUhU1j%2FIgLEoBSYAs4z6WrkxumQmVyaz9UQpPQmcRSsR8Ye5hJ0%2BGawGBsXX1fnv1q7b%2BfhMw%2BL9hFgtervPBcEFvV%2BPvWexCc3mTVPCtPSNNRSQU8qVqn52msQCL1PSc6rZYBZLDhNXTpE7bF2oB1O4EZJ7tyB0PvgSm41rbv%2BQ5mGHQvq1din1tNrlEX41C2yl%2F9saM2UORbZ6fARsCVV1BN7ChbZsOg%2FpzTS5IZsO1XR4NsEyjNOQuVNc1oUT0aFYBXMKWR8M8GOqUBpDIx2z0YSuQA77gN%2B5HrjZUjje5nr3qBl0bQrOtlRY0t3nV8A1%2FO2UR0AxcU7B8h0GYr9oRdZcRSTsyb3gGyIPukX0JxLkJRZzSC2gGzqUCbXAkpQP%2BPlHyVuOIcrhFKMu8YzsnCj5ZF797VOnzQe4G6C3HZGVIYCYFKCSYj%2FNZijownWp%2BnJ3C%2BybQVtJU6f3t%2BNC%2FlSE2ui9zSHoX15pEIHvz9&X-Amz-Signature=a6c8929b3480c11aa793fe62b5e1e1841fb20fecc95ba07749831887cbc4d42c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46625ZQYVKX%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040402Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDCwRlenespX0Jvv74l1hTXoBEqM1vgvOqf1jUhXmy%2BxgIhAMJ8vE7xDW8vcWlvRNywU1fzK1feUgNZ2PzSpt6GjPMKKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxUQhmL2zDZN9ia48gq3ANL%2BRp4qcSJB%2B1sGpekT%2Fcu%2BtA3bhjTkb%2BC1xNc4%2F1ts3rpoQ%2B%2F1nSFH7KLtgyDHk9s4HJRViX3g2W2qS%2BC9ZxvPB4JSRw62KERhLp%2FnoO%2BwoNchNqffTEDhdt9715VSZy8EgyyB0lbNwXhGtGPnsZYF1YH7d2Vg%2FNKuXm25uxACFUR%2F6rUwN2lqLbmK4UQVbB0W%2FALYNqb99XHFbD8fSG0bZ095oA1%2FyPJj4b1A%2F9a6YKOKm64djzTBnb4vSEZZwk9c%2Faw8GiSsrwphYWeM25AxiSgrFdjJJtVxYvNfMQHwbklDP6H%2B3KdOenbaRwXOah4%2BJQM1AK%2FK%2F6YUGFyJ4EFScMj2lnkHWAFBndpsXUVVvolO5aZHc0XOnEx1kjZfp5CrjVcy601fV9nPpgr%2Fz9joIYG4brImOAxEssbBc6ZgolgT44C9vIWt2nFt8XEKPZ70X0S%2FNHtOrNGRHGy9gf7dGc9FRQFQwJZlvzV9fuLmJp9VvN52U5rgf%2FucQS5TIK8UwOq5q0i76FBfisguGCXMQTg0Bq3WbefF4CWyGIduhqhmf9Liaw030bpsnZ%2BhoHF3%2FP4UCmefqy2STY%2BqqbWKcy9p4XEZm8y11WR0iY9Xs3Tt5S4yra0yMmQMTCKifDPBjqkAbbtucX33sjbHq2jW5fNG%2BiD1hiK5Yw%2B%2BRFSAP9Fnq4MekzUTrerG3wnPgKcREKq9f4s6byF%2FiJZSQUF4ZpDvAc%2F59Se9BOHr5a9vbu8RBKNmtH%2F%2F2wlYRDBymbc2XlbF%2FEvCWSnnsYAxJBK8zXsjCEerBSsqPB7ie%2B8lf1uu52zhNKx6pvkCmrEAwWKe8dnkb0seol1U0pkhC8G%2Fuv%2FWm6%2Fjvaa&X-Amz-Signature=81d1b8f4ca4d42c8cc4e79498ac922695eecf1d22753fc7d7394026c2b4f677a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W4SMXMHC%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040404Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDLkJ3tSHAWO7lTEK8exQCJOvptPXrkRhL%2Bj1k0LCtrDwIhAIws%2BzD%2FMIgaBTffmLHDfbDuD7ApsO0jvYuWdj1MtOALKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwMrcCnYB8OIe26AYYq3AMO91k4ZNJyrz3xNXznFlnfqLZ3lqBgTTZv9nJasrJLy%2FDW9NXPfiwZm%2BGxrr7YLPJ5UdjTwdQSQXA0tufhub0FLPASKjcSrfGqm25PZpCz4LYA4TLGWXwtlHCrOe2T36EKQ1JWCFKls1OWLdJ5cF242yo1vAW%2FLLiGzqTabxPny8j1KqFtMaIMeBEDKADmibB8UJQorgmlc2lLX03h4c3Dilo7ORD13NWgKVmJiGzts8%2BJrmI2v85Jg8Yq6I%2BHhFBqRkKYORZWQjUUKKnIt5fLaRZwh5hvJ6thlaRVREYyDyoTkkra%2FgiseMj0BJs7uvMKy3kQyp14Y%2BbXmnWHRd96J0ya20YY1ClicHCom8w0paqW6y84Q4vUfI%2BucssUREdaAZ25tARfFxyJ6LrX3ryQGqtMYhxPp0cO7Bu0gjrHcHFmPchXGXpQaEO8m171xpIkKD3AOR7NVCjoj49CqvufSwXmOjWhZqZcpTwCJKZ2twjo5qD7cYaOZkAYQoVbu%2F0UFqQbjp7SmE999vKYNF7nS600%2Fnbd1z%2FnQeCL9028RHpzIKSHgxC63IyT6DrGs%2FKEh6%2BgeYywbernZNyBBb9f9k17iC5WIQFPT7NuG4G5jkZjXgJ2eJy1FpM86zCcifDPBjqkAQTQvXjDvQwYkyVVioTVPH77M1rPIU27WAuBqTqrq%2B4T2iFwiJS2faacmWWJDW6cURxWMdgvyRwcdV5jqbPDlUrfV%2FRhwYJGYNDe7nEtus0zOowDuo2ChAuDN9G%2F75XWh%2BJmc0xUKAkQTG9bVgYwsTOhglN73FlmvqCdqnfA0fIKA%2B0kG%2FbRWG5TERMX0Tx2lz4QFLbIqIJEeSInbN6LWxzw6m9W&X-Amz-Signature=465caa2003093f6c865a17a01578eba80c6ca3ef8364fbb1dea8e0f2568d29cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664OS5WCA2%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040404Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDC1jgBsJOsOUGdYUrNfvU2xO0nSnFKStlwh6RQWiKPMAiEA0JrAWz%2FXez3sAPRKs736%2FUEnURFTK3hjdPLwUCSBpwEqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGoVGlpP%2BFmIglvnKSrcAy0YhEDXA4vqQ5jHxn%2BJq3geiyOupen9GIZI9iAkizOe4Ds9FyeZbEfWkKCmY%2B4%2FnmpyDX9V2x7z%2BdSTzqSNLZAne1tWM6EWptlN4tS2sU%2B6WU2ZP4PwT0KeTitBTBKBC3Ikc8NR1B%2F43Z%2F6lPK6KdLu2c0cKTLDUmqk2TV%2FMVyk9FKNSOidc%2BN6k6Ht%2Bn2Ue6b7gK1IRIyZq4GJCa7MzIxTuaOgjNho%2FlBuqaih2vF6GDJpWEAkVc0KK0DIDimVX6G1NYMyt%2BOa1MOuAn2gXDdm%2F6O7K5tA9O2%2B3wfttugW%2FxQmh9YNlgLngy6mH9s%2B8hmELZ8IVkPPQT%2FGt8t7TdEVljOKLcscq9Q%2BJUiaJ%2BirC7rv%2FJ2X7AhfA0178lg%2Fpcz0ecTog5c90yE%2BXPBy6AFGMc4ZRIYVX1DOdbbb07qcq3fj9crwZfbOBl5Jhmy5dANCJMF7OciU2tkORKyVNjF7hz3E0HakSy7t9u2Qmvpu1xJ4upitbItrxOCCRBP2lmFSE%2BMOF94umFX6sgbLx8P3aiVXqdO6wSJQNgr%2FsEjdKwnRbiqj60C%2BtcrLodHoYao2njZq3kG4%2FD9NWqZ7yn7QYh%2FNTnJcF0sCtD4nRKYkSKxkKes1idnwnMJqMKSK8M8GOqUBmZ1Ye2ZwrLwmRelgiIDirUblEs3QCEPyHKU4g7mK3X0zPaQtoWa6bGa9At4N1XUMBg2X%2BkaHGBiIpGk%2BbvrGpZWycZfP22aDvCd%2FWn%2FKnLUNuJV31cxMUGmzMZRlGwWYIWOXxlGqPo5osjk5t1yBYjoOeQJ1gBWezvT%2FjYUYv4DjYMY3ww%2Bs32oqYbw6mbtJXt5x%2BD4j%2FE8LNtBQMVqXUUV9om70&X-Amz-Signature=be18d19ae16a8942fcc5bf805a043a9c6ec351587c3a124b1f28ccb729243787&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46662T5HUF6%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD3kBexwwS%2FkG%2BvZx0vKBTkeJM0hq%2B7gOupL1bI4og%2FMQIhAIlk5MadAxQQj7C49XTI0wclUDIkoL28J8VYu6fydqkRKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwdITEBbtHaoiXe2Zgq3AOKGLzuDWlMylP7VNBn8rhsiblb1o1fMXgZbDQ%2BO26Fa3e%2BU%2F1gL53e5Jr5JV%2FcJS1ciVgRP%2B9WduEwu1VJ2OxULBu9OKO44xsjXCEUXFUC9xPfvU7Mug20k39qHFiu7J2EiMygOgvlxMpy7C%2B5Ylv%2FRvW4UtXTZrUXhdGZd2CZE58PxF1VTIUvVO0WnJvnNkS9Rn3Dqsvo7a8ZxD46kbwUNqw5blPp4bSEewh0ZnP5M9BNtM1P47ieFoZKaCrIQw3yN0Mc1qlbwrdwzTN72VaTE4dbYm9MQ8%2FmeoEql9YHHOVnRKx5rcDRuvy7OCR1vxEzAcufu0gxJXfSalw2ONARp%2B1ycyaHUV7PIaf3oLkOwDPuCjdul2pbqRGs6JzcMkNCBOo7ub6VaL%2FubknCGJDJt6w91PYBArET%2FUjw4o%2BXUknRZ38mQ9m%2B4D5yaaT13UeyrspFTeLqm1ZOtw8RDGPAMcDOQ2Wb3YBjq4jxI2dZTCO%2F%2BWocmJPq6XipLJCamJayUoKyxRNnTUZ5a30w1fsR9VFnWlxNaAY%2BqE%2ByhZsJnCPCe9DF8MrRP%2Fgrvx03NN0TRkCeT6OwI19raoMRXo8X5vuWpYk0LZDBC%2B6pjAXJje1eUxoxPvtinukjyzCDifDPBjqkAZNV9rXaFbXYCfpTgMtRC0mDYMhVPNmByu6HMBM3x5hXaYe%2B3KbWETL1qlNtlP1%2BeIjwt9tchWndSHEa7mJK0gma1sppC%2FDO5VEl%2FiFDg2ZTjrWHKyE5rUErs5ssdI1G8DZ9duUYkB8nByXFpgCeRue9p7oAGQq3QmdH%2Fj%2FDzBmlDlo9CjTz6K3gRjHWRyAzg2%2B0ny%2B79jyu6z2iiHEUN6LoG8Wk&X-Amz-Signature=9ce26d22567439c73ebba8f04393972e6b0cc1aa81204cfb5c7aba88f9fba768&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V7B3CQKQ%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCewTAkCZoon4a2nB%2BCSFPG33Z41Z7dvZoqva2e6BhRigIhAIo8yHQlQf2Wkxr4XqWXT7H5BjW8iExWnHf2OpWmswdnKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwsN6VAEPSh4sroEp0q3APpo%2Bynhkjf7ow40JlVXwShZUeMD%2Fh5ofwFLAkSY%2Bqub3OY%2BPzorH6H9p8kf%2F155CiUlDlR3PYiQZxzhfhUKBYqTcD78ptpx18FauOXCJiuLwjSnC%2BZ5o3VFC%2F7m8UO%2FNXAjM1H2q7B8cGVoHLgKsgMCwryoYycDtfjuUp0aGY39npaWo%2BBnWiDnuKEB3Yu8DsTFx8jduFWcerwDobI%2BDri9JjFTXuDkvg9K1KAWqzyuFCg7ywaGNVj3f0clNFZfQ90WDcmQri09BMR5nI%2Bih5xl4soMrlNkoBI4colufx%2BuCNs5tHoj22UIi2Vj3pZCAzz8c%2BSEkJXL3xfV4s4eAIryd5D19xNwtVfmajfN35EsWYzYpGZ7ZMku%2BAw8m3fmMLVlihOGWrRHlkKSneBmT8%2BwQL8pa7NpeNWCAetStxCSCy9tMRTmHpxO1gc3XV8k8141aYXS7P9YnIErqjY0mC0GPVcmVAOYY5zoLkJIIo771sw6NO7E7qCwvpTh3rPZMB4sMoSwarhUDzDXWzgiXgEZM%2Fbi6Nt%2Fptn3yWoqGmEtTKMac7PcP8uAHYQJnkQGzhRHpx%2BrTV%2B2SHJi2pkbcQyTOtHZVhSLR4e%2FeuyBNwUKHGe5UJFcT0uJ2VWJTDBifDPBjqkAXg1tXDmWQ0nVE0Hj3OKzGk9CjaPMIcWYQKD9J5OhlXnFwx4JzIty34xtt0f5EvbZHOPtPqIO1GiNukrZAyVdK4mKh2gg9ihohCIvFQRF1vrZqIaTWyNhcF4XKSxib9qVid0SeOACKUOSki0QKrSfclkqwxJ8rwhTFd7fZdch1YgGXyZC0QkzsXeStZAfyygKgUampvpT312UlWBQKDP5kdGMK8G&X-Amz-Signature=89f8ba1f60f1ee70ad54bddb62a70f746aa44e25d542aafab52b937542289db5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TKMCMM75%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040405Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDCByNtj%2B%2Fno8H3jf05JohGt8ylLahgP2b%2FwxJhD2drrAIhAI%2Fi6Gb0KY22fA025vw2ebWDJEktZ2d0jzvgNo6GGM%2FiKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igzc1TiLqcbxlzdy1CYq3AP0mVXiuHn6QIZhizFD%2Bt5DJpcwNZoHKqIki2qoZT1lZ3dZWP7EQk0WGA%2FSaZo3Ehe4lz%2BDdvpszYrFxGJJsUtoYELdqxxvG6U39na2DQmnzsENGl1GN8kL%2BqvW1FmLus%2BOsLSSFT2LGDznRv%2B1bnkfXsxE59A4ibAnoUb4qY%2BLqcwxRTOEmVgXexZjn5i%2FkrEgVy0wvImzeWuqOBmzxrxLLNVW1265dh%2F9pocWY4%2B1SI0uzrDrf8rrZKIysMBc22Vt47TCgU9PL9QXFJju2ckzlPXQQhA4xT26FYCo4Dv3m01my5cUGk8pyI98Z7XDDDbPs53HfczIEIMEuYHlC1EmnRY65A13GWd7N0QoDwdqW%2B0oE7wLQnU9pKN4%2FXFHSMPc1z6Yf773Fl7PkXwH2cxzYCC102aL45lE%2FKeRoIzKNRNqBEzwBVHwHtJcBA%2FCfE%2FkYcYSNG8c50ZVzQsPa15H%2BqB2k3SIf%2BncxMJbiM0zjoPBH4wEfONL5ZHH9KyqVYzrEoEBCHOSyLOl6BQTczRtBu7Rw8cS0qOGE982DBJhT9xwA16y36GETabeswBPLzW96ffGiQujdlVtdXQXmIDc%2FyI9y4H5xIoUy%2Bz497aLCAj44%2BXflWw%2BnyAk%2FDDQifDPBjqkAZ%2BnYdUEluWuSDQ0Jvn7qPQVY7P6OeQ2j4Yh9eBatYv%2BwHW0NtpZm5lDXwjE%2BGx3rUFh%2BS0zd1t17K31yAr1%2FVYpVmD6PPJxytZbzGQNhgMVgK7jZ9OgwfB2rmkAjHMs%2BfjpzoLM0U1NZ7bJcVywo75L3U0zKAJ7ySgaxr%2FLc6Xf5fEeC9EdLtNFUJwNvDwczx1lFTjzMzdMFhPSFaG7ZyodR62w&X-Amz-Signature=b91c220845f83cc4dcd2223f958db7776674c12726609d79af1431de440a590d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
