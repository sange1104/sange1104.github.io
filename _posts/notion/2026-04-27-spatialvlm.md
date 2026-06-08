---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHHFQAZB%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAC3trG%2B%2FmQ5Je41MF%2Bp%2BtFVvvbo0dIh8E10sVBPl90rAiADJnL8ow5C0606ZGR8YEwfmxcb%2B%2FZq67wd5atcIng85iqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMxkC4hSxyaPrQvaFeKtwDD01ATmb1cfX9JjtfWXYoKoaW09gdfu39ExtcyMw6yjMqgfrjhCy4WT9CKOHjWnfn9eBanqd4tGc8Z62J3pDhHnMtCbCbqgu62b7TdblnPAkTtQueAaFAu%2FndRmtLdM7Y9njmEIjGSp9P7nwTRt1DSpzc0btgiMenwbKxMihplX3mkjVAf%2FsQTENwqHnGn2WSDjO%2FWjg%2BWlMRH%2FD9bIH8i074eDDRdbi3XHRWTgpc3%2F24nMh6t2kydDcDTbZRtjCAzED3fzc%2BNM93iriOZ2YOtChLHvC7RqTC8e7u4yBLybKjFrx0q5MxMOd%2BfLlkCDZxMXdICLZnxgejvVbvhuo00MKUGx1%2FWn5JdXoc7qua3gWtnIjgPjhG7z14Aaa0Ia8JKBQmLo8xJMzZONGRuVxC%2FX56w%2Fc33RcKTTFfAyEtJ0L8VZ72dlsltoowLm%2BrFYofgp5gbc1X4H065sOTKrFu6U%2FgvhxpXs4iyAWsWuu8%2FLibixGI%2FmHlpESKomtuRVK%2BC9%2BxFzxOyJbAYxCjvHW1J5R7BpmctXoOQrdnd%2FFZrZmeRTU8rQ7uTHvOfGj62C2RyHH2AR1tddo%2B8UYrhsiwHUEtT7n3W2CEjcJweEcrxP16a%2FaNrgN8OMyrY4kw%2BIqZ0QY6pgEd2QX7Ag%2FmlvA813%2FmAjAV9qzdvGo85%2FnlSnFF0MypXwBJ1IZ1uLVYI9QKOvmvsOZQSa8LRxJ7KUB4SsEWaOnan6xZxn1R8Rwt2G7iPipTU%2FImH89PqPNm0zkTsgcQjWBos7FFbu%2FZJbk091MSzxUaTe4xipyoPkkGKOSR7PI%2FZe2qbMvQedVGhzNHKaZzRyLiTVras%2FOH7FYFXhom2lzhc9pRtzHI&X-Amz-Signature=d84f21909f308a98e397c2d8af29fc77a313a5e10c899e7b5c4118f521470655&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHHFQAZB%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAC3trG%2B%2FmQ5Je41MF%2Bp%2BtFVvvbo0dIh8E10sVBPl90rAiADJnL8ow5C0606ZGR8YEwfmxcb%2B%2FZq67wd5atcIng85iqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMxkC4hSxyaPrQvaFeKtwDD01ATmb1cfX9JjtfWXYoKoaW09gdfu39ExtcyMw6yjMqgfrjhCy4WT9CKOHjWnfn9eBanqd4tGc8Z62J3pDhHnMtCbCbqgu62b7TdblnPAkTtQueAaFAu%2FndRmtLdM7Y9njmEIjGSp9P7nwTRt1DSpzc0btgiMenwbKxMihplX3mkjVAf%2FsQTENwqHnGn2WSDjO%2FWjg%2BWlMRH%2FD9bIH8i074eDDRdbi3XHRWTgpc3%2F24nMh6t2kydDcDTbZRtjCAzED3fzc%2BNM93iriOZ2YOtChLHvC7RqTC8e7u4yBLybKjFrx0q5MxMOd%2BfLlkCDZxMXdICLZnxgejvVbvhuo00MKUGx1%2FWn5JdXoc7qua3gWtnIjgPjhG7z14Aaa0Ia8JKBQmLo8xJMzZONGRuVxC%2FX56w%2Fc33RcKTTFfAyEtJ0L8VZ72dlsltoowLm%2BrFYofgp5gbc1X4H065sOTKrFu6U%2FgvhxpXs4iyAWsWuu8%2FLibixGI%2FmHlpESKomtuRVK%2BC9%2BxFzxOyJbAYxCjvHW1J5R7BpmctXoOQrdnd%2FFZrZmeRTU8rQ7uTHvOfGj62C2RyHH2AR1tddo%2B8UYrhsiwHUEtT7n3W2CEjcJweEcrxP16a%2FaNrgN8OMyrY4kw%2BIqZ0QY6pgEd2QX7Ag%2FmlvA813%2FmAjAV9qzdvGo85%2FnlSnFF0MypXwBJ1IZ1uLVYI9QKOvmvsOZQSa8LRxJ7KUB4SsEWaOnan6xZxn1R8Rwt2G7iPipTU%2FImH89PqPNm0zkTsgcQjWBos7FFbu%2FZJbk091MSzxUaTe4xipyoPkkGKOSR7PI%2FZe2qbMvQedVGhzNHKaZzRyLiTVras%2FOH7FYFXhom2lzhc9pRtzHI&X-Amz-Signature=21efb6ba0220e941390989363df81c950bce194692e6c911edd9cad9db1b3d0a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZHHFQAZB%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050044Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAC3trG%2B%2FmQ5Je41MF%2Bp%2BtFVvvbo0dIh8E10sVBPl90rAiADJnL8ow5C0606ZGR8YEwfmxcb%2B%2FZq67wd5atcIng85iqIBAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMxkC4hSxyaPrQvaFeKtwDD01ATmb1cfX9JjtfWXYoKoaW09gdfu39ExtcyMw6yjMqgfrjhCy4WT9CKOHjWnfn9eBanqd4tGc8Z62J3pDhHnMtCbCbqgu62b7TdblnPAkTtQueAaFAu%2FndRmtLdM7Y9njmEIjGSp9P7nwTRt1DSpzc0btgiMenwbKxMihplX3mkjVAf%2FsQTENwqHnGn2WSDjO%2FWjg%2BWlMRH%2FD9bIH8i074eDDRdbi3XHRWTgpc3%2F24nMh6t2kydDcDTbZRtjCAzED3fzc%2BNM93iriOZ2YOtChLHvC7RqTC8e7u4yBLybKjFrx0q5MxMOd%2BfLlkCDZxMXdICLZnxgejvVbvhuo00MKUGx1%2FWn5JdXoc7qua3gWtnIjgPjhG7z14Aaa0Ia8JKBQmLo8xJMzZONGRuVxC%2FX56w%2Fc33RcKTTFfAyEtJ0L8VZ72dlsltoowLm%2BrFYofgp5gbc1X4H065sOTKrFu6U%2FgvhxpXs4iyAWsWuu8%2FLibixGI%2FmHlpESKomtuRVK%2BC9%2BxFzxOyJbAYxCjvHW1J5R7BpmctXoOQrdnd%2FFZrZmeRTU8rQ7uTHvOfGj62C2RyHH2AR1tddo%2B8UYrhsiwHUEtT7n3W2CEjcJweEcrxP16a%2FaNrgN8OMyrY4kw%2BIqZ0QY6pgEd2QX7Ag%2FmlvA813%2FmAjAV9qzdvGo85%2FnlSnFF0MypXwBJ1IZ1uLVYI9QKOvmvsOZQSa8LRxJ7KUB4SsEWaOnan6xZxn1R8Rwt2G7iPipTU%2FImH89PqPNm0zkTsgcQjWBos7FFbu%2FZJbk091MSzxUaTe4xipyoPkkGKOSR7PI%2FZe2qbMvQedVGhzNHKaZzRyLiTVras%2FOH7FYFXhom2lzhc9pRtzHI&X-Amz-Signature=fbf29824943a3e1d37e328d3ee1875f99f15b806b19f74bfb616ea0813402288&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665RYABEVP%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050052Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDmaZTgWIJdtC6ZAkXY1SJaAiZ2mQVTDHCEcxVs31UpcQIhAK9lFS4D2U8y3vjvsb2ZHVlnxaUdl2GdrSMKU9PzkFy0KogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgykO7VaUNWvzNSTNEEq3AOy7o8dudaBL9T9DLzoaOp5qL6%2FJMZvduVNn8RxYRUyogXdjZvJ8E0hjX9tNHYCvi7JxfjtL6lWaa1NfPKFJCrA9I9tfZ%2FYeS3s%2BJ1j%2FU%2FAmO5yHvs0SGVVN0ytWms8PrbgneGN58pHhR3gHlUBfTmvZ9nzCZ9zGikibMNwrE4NGLH5n9ezLR9%2BwDnYzOdqB0iG%2BSTMn8zyrTfwswdSY1TS5wBdK6HvkRJ3fgUTqto%2FJ4fRbcCrbJjlwdIoz9HJONj%2BPanc%2FgH7UTqX32hDWsg%2Fg9ePOTtngM8fB7S1MKl88t8DOP8a4Tgaq4LvKbrJgp%2B57mGrgA6Y%2FnazId0I7LDvPyNA7sub6mpB1rUa2Got8d6d%2F%2FZIRJ5Mz9mD8%2FOMiNA4p%2BNvCYIpPbCpGJXYr58X3GpyjY9GmsxnCI9e88XXHep3nTbgKLDbC1wbj713Tx2hYX2b3be491UJBkW6fQQsVlDCGWmbHyY%2BsKhyUcQX3jaRFPAOF4i4ai7pXLoxLiz1D8T7TthYd%2Fm5UQFBtYfMFnbr8CrKIumw9xvkymUjxfeCxxstEPxH%2Bj5nhtvSntcNiSH8yv4fzSdRim0fYuJk3IvBLS4%2BoyOJxB%2BalbD6nwd7oQghk%2BuMPRwlLzDSjJnRBjqkAVLUhanp5irBdMRA3dRA5JapzOXlpkpWVIca6P%2FXh0DGkp65soOAwt%2BbfpAZZSAWCYONdu1ovDLF33kx%2F393EXLZsX8DCZCcdG8zpWURQqhu8%2F1CqiFWSnvB9fcOXALbbJ0Sn3iXpxu3PG083dQzI70QoiZVkBts8SUI8aMnJTqlxDFA9O7fh7di1GPm6o6SBiUWTxM92Q0VRAsNrccedVIbBHyU&X-Amz-Signature=1846fc5bfb65096babf59b3337ca01bdd55039fbf06cea7b781259f622135d48&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UU4UT4TK%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050054Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDT8B7foJFksX9lImQe%2BZltUWmrFTLy1K%2BrCjP4b8LHigIgHN3fCzHx5KcrLVDK%2FBKirdAsMOGVWc376G%2FAl3NCJc8qiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBY6EHrU8TLmBaP8LCrcAxQ1OziT4mLBHb17OG482I1nII4X2kkstGXPf46fYH3g%2F3h1qtJH0RzZbcU3L5960UOioqaD4lQnhhxVG7Zkad%2Bht4fw2dyTF6dnpghip3agmPXEXLu54Vs6%2F5uHp%2F%2FpRGRmojR6Akc919fhqWaU8yvOLwrUYn%2BuzEclYkb2uZUlKtkyFlxZMlQep2OuXH%2BTmTvbwK5%2FEfumJ0boGzqJORooEtlBQpyA5n1q8CQiXzr42ViUryG6%2F69dfGEh73tAHwYcRlsSMZbxgY9B%2F1J8yiqbWqZsCl5wIbahAz21Og7uuzMPFUEn07wzHC4AkTL5Sl%2B%2BqK%2FKKkedzh89Nh%2BZbsP1uqxgUz1zaawtEVUAfcXWhcvshGGHhdMrXU2coxT1U9X94x%2B0HluJ8%2FS6zAakTBUag1Kv%2B%2FALRStaMowhJN42fiKiwbDypUrrMB5o68xdL1YbMBW%2F6mLzwua8YecXe294czNa0W0mvF%2FUF%2Fv1N6I9JDNGaUTEPQDtkvF%2BY3jhQDBZL7tW6hAsLw9%2BgCzckCKH%2FcnRxQhMSBuvsch%2BQbxsS3%2FKH2mX%2BHAoYY0WAFZ8vBFcLPWKpxSuv2Sm1TpalV0FLT6%2Fi%2BosSQe3l6lTNo%2BOlcXOADQQ31ezga1VMKmMmdEGOqUBn5ncETMFNoIiAes9LNAt3ltbPtWZec%2FSX0ebCwgfuOQf7WO%2Ber0yRKUKVAoZmPMVvx2FohYHs0JYv39e2rcidS5hHD7VolDgL1G%2BC6lU1%2FTK7y1GmluE%2BwbFx6C3jIVoqxnx6sXuTQ5MXgD%2F0W%2FSVPneCj6Lm3M2A4QYfZNVdHNJYAkT9OYqAF9V9RMMcBcUKS6UwVUbtG1DRYOQcfR%2BSoeNVuON&X-Amz-Signature=48967765e8a51a96e4e6934103070f508f7e8c3b5ad8b6193cd1defd0dd618f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UWNRXTV3%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCXxJemphDVgt%2BeF%2F9IcbfwlpwnLRzRA8CmNuc4Bm6yNwIgZA3zn2Vu6So5mFHDZ0%2FjHjNo5pgpWoySwNJPh6qpjdcqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNucCJ97NVynFYY%2BDyrcAxpMVhQ%2BmwJMI4skX0jAa82vfWYyMGbscjJXnBWothfZa07c4aVLK0SxARuMa8uejWUK76nlab5Dw39iSmg7Es7mYnmPEYbPUbD0IuhzKODqAho31CBbZP7eRVcb%2F0hu0g1Yg95vuNVeKkjBRXWf2VxmO4dfcDQEfsoNfErHFvHszJA56pFUSGZqZP1ciHV7olW9ErhFENtndSqsgfB5MhegQHiZZa%2BjRKIKB2KIX7rsQc9MpHdsrMaAUfg6Bi2D3KBU%2BpFYgxIu%2FLNs86wqFagIWEAWSBX1RdMAf73DQWGXzAnFGa1%2BhAnQG4TN5uRKblFsFjpOUjrfFrec08iu2nj0zxq1%2F2UjQJAt2kJKYtql%2BeJ3pHoKT8OtxBTEE7CbvDBABBkGZnjHBhuT9z16XHxTFuwMbZ32m5fA0eY4F4TnQut7PwUODo5OJ8%2BBhsqCBIUQAVcBzBI0ww0eE5Oxuk1X8FeT4mJq1EEaoUl%2BjBXjnyBRp9N4tRVfJTvxNg4oEgWaydF4tsnlbiNLGMCFdwX3FW1nJf9ABUSAqWKaDVy6iBXOt4Uh3FV0akUx%2FleQSrioIAgFZyMx%2BBlEiHBgaGrv4YXAuHeHNusenfet4ZKtFK6rXoTMtfbD6%2FmkMJWKmdEGOqUBSDI79mOyyV0PObWazGRN5nA7PBXfuyyLU46GegNTpxzS6W%2B6fUYNVyPEP9GtgRecS3YDbhKifvEmY9thBuI01Un8w0owwohRLSW5QsT3GRbTWyQSDvTgGJUZu0t5w%2FIPkKyUfYT7gWJ1dP8ix6ejnRyivsLaPKnMbjVKrZRoiGfFitEdIhYg0bk%2BYpFliMVZtMmBKJgSL3uI1TNDpnDgmYex4yB7&X-Amz-Signature=2066f74cdd3e73f28e7b5d648edf2147c1590a161d26732acd4977641c8e19e7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGRTZRYW%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050056Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIESnpwn2A47c5CrR%2FMXqappmwHmkIZhA7iJyqLqg7nxyAiEA6js4zqkqr9f6i4K0HWrnWvt4jlRqUoQrgrc1y0viLCAqiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIgK%2BoWTQTxmxI2r5SrcA2Di%2FeAxc1J66QM5jKPgtguJGLhMhn9KHZ9oKbL74CCIXOcQ%2BsX6v83eguTIpBnAC3Tp%2FxghK6BX1SXAA0koKQx5lZ5orRyNJLfNpEPnRLOVF65oEMliRHpECiqeQs8BaLOQWVarDmWRn8LhxA966xApvBeSACt7f%2BqfrRCOq%2BNYuFoQerzQwNwcRG32RpxlP4JQyo7IFPc3XtYQentTBW6IEwClGPnkCrqYSOMqSlvIMlxMaq%2BrQBIjOdfg11bcLCVuGKq5Yll%2F60On286jftyxD8K55IaHPv9Mj1gIYodO01te09MK%2BHR7EAUIwkP1GvuvX9l9A78BpPlR%2Fuze3kStxs1a3esT8oUDRZcSRo%2FTct6OUqXzta%2Feju4TNMTqkOdAdK9T5QOJaHYhVUgDDKfJXLuCHP8VgM124Tz2k1wGWj4is41FJmKHYdmCYEjPf2hx%2FSldkpN7t%2FWofe3MjOdw9gUIT7hqKyxSkLZf%2FIcPP8lDuLZ8NvtWHAPp9KeWLj2KnrYPeN4EL5yJKmZk02Bq4GQja131u3sod9y3L4y%2Fp%2FOobQe3it7fB%2B3kV62NIzjabPKvr0iP5enoneuDz2manllqiboKKVIB6lXoP6a2bODF8CkD2KpG%2BOe9MI2LmdEGOqUB6%2FTUJ8mChfoKbKfSm9n8g%2B7gP2xnaAkvjPCnj%2Fb9xJ4RFYQUTa9zmkWp1ck0Ci5JPK30HcMfnTSNBwaSlkjeVMDQ4zQrLXIWxw05%2BuocLgTpetMicVYL83WCz2FxaIvfFG7udWPCo43V0ESEfD%2Fe9r6Kp8gNBiE2%2B4X02Fdeo1MzJjgNLZzW22ptLANS7puebuOfrRA2%2BliHAIF5hJQ%2FIRWn6LSW&X-Amz-Signature=b5de9a1763915da1ac9af5fc0b487c07a5040f17c940e9e3ca30c28827c76b1a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T3QK3PD7%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQClCtSBSJcJ6GTiKkDACO6OVj0WlNDerzGRMi2JJ4d6DgIhANTG2qZhZUp0iqkwnYzjQr8%2Bkndl59bfKrLWitx%2B8g8fKogECK7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyOYKzUqikKh7dfRn4q3AMJjPETTte0j7JbFNvA5wBmA0JJ8Nj0Yz5sybhkqGgKWWxLDjPabqVvha5eeYKNHWO1EAiU1PEq5lH%2FF0YFFJAFH%2FBUDmbyqQCz7TtPapfTDJsdYi3XYwg0hhi2lQIrxarXjZHrsQqAg69MZtz7v0oFt5X7ICavugUZARIXl8FUZzQKDpo297djZaQqFPRhWyUZ4OS1y%2BBkKMi2ydbg2t0Ox5sWVV0CBDmbTMey5j%2FzOqj2AvKRSbr0im7oAXZcCwjyQbhouNoDvPNlJ1HXvs3%2FPjkh5wjFu5TPWua0xrj0okmvj4CyXUavKDk3rh6oSXpUD1F42Lp8CLryEzT5gxEvNAG7qsZwYTMzidCHWitWXqZWBpQUodeziYJh32EPfFKgAsr8lrDon4S%2BOxIE%2BYcStPdF4cO%2FnN6pkkoByZ%2Fl0pm9I57nJQa7xNoOdvo3s%2F%2FZ1wCunXYgEJvpxn0Y7o4xrmBf%2BCBVYx5gILsu5oVWhjCk%2FhuFaU8QLn%2F1trZNQUh9EXJzwcgwhUEyevrHv10Cc29TAEKhD%2BgJMgF4LWvkofRk%2FlwhkGWEg%2FtTd3PgrpzcRLGd7iK5wNKDNGrCaoa%2FlWqJdDMHMKG4Uoz2nkjd6KJGlP6lBAvDavun3jDjipnRBjqkAZltM4chWSGMBK3yuByv4S47%2FrBi9eiMXoeOkVbIrV9NSLBxt%2Fyzz4p425%2BOFcgwMnolIZ5I9J8ES4LYrKe1nnWbHVx4pXlDUIDsnHdYdxyArvP85Ovm7lrhwgGr5t3nc4cxJebbrLZIFQ%2B%2B7kSSsjghIh5TSOR%2FqRMwZWR00ib2DReNWORJU5Xcj9ftEU78JMJErqE06oSg%2FfjX99MuNgPdZceZ&X-Amz-Signature=dd002b5d3e0ac8804e0d21a7bff7ebdd9091faeb62066af45891c0227326228a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466234QCTAP%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG8fiacRWt3p9BcOOjmWEyrETK1D8iitOxjkq2sQGqxlAiA5GzJJkk2D7LVXzpPwMe0eQlG%2BUIITU0aBIW6lBvnfDyqIBAit%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMTIiLURb5IwOfvejEKtwDP%2BgDYUNWnpWLBfWmmVEFfHjaVQCeZdd9gciOmoX9oGQYLilydafqidPdk2UmuGPWuBu5BHc94LXdtKZh1og%2F3T0IacbNSnjju4l9cwNccgZ15pu%2B2V6bQ2VxPD3Sgu%2BYYaRacg%2FQv9IR1T0TRzYwRKf4wGW7rROWUapPL0qkKOIEYHxz0HbJSbYOfIxfkRLFWXSKCddGiisE2xJ5xQbRktgmyJvaqdx8xAAdG3Mj9u2oOfWQTJrjKTZdy5lJK2BPaAnXCgMoLiWcVln2cjCsVcLIAQb%2BgkzJH3zZdXFa0R5DPNCtrWpDb2nlbaLWFRWi%2FlwNGhkKPL2GxTqp0co3wa%2BM6pEJXxMk%2FRRkxwYSl4Ge09CQm3N9frLgHpAuCeheHh5IZRqe%2FvBNaBPNaPkeuBv51a%2F7s2nVLSW988fb1OqVV1tnVhGdLQmkBD7cNeM%2BEgCtlPJsTAo%2BbSvLdPa2%2B%2FLoUfO1WbYs4QkwxM%2Fdlv8U81yrtYojqQnenL1IAYsIEIMykCHPNZKtGKj9Y15kNBxSLNOE9HLLNmqzlYZarZoWYtEkGnGMpMZo8LWlAl3hOzl8xjOX%2FyvbKVOAq%2FVFhfl%2BYmjP09jCZZrKm1FbGtAROyGMqdHFiJ5vEusw94mZ0QY6pgF2TfzXECtCImxb1HNE0Tu%2FwLaqlJnQMmZgpUb1gjWqqPr3Zgp1bHHsALdBQ%2FY2U3pOueH64z07zyQNVo9RHG2w%2FAB%2BVZgaQAmM5KBpsidCdNvJYw3BlkHQM9TT6%2BIqxZH8ZAjZ%2B%2F%2BhIAsg5BNzMtJFIQnA5rwkoPG0CzGeKMtj2ujzqlB86cuSDs12dtL8nO0M017wNSEgzryZ4nmJZsgQTCtEAlKV&X-Amz-Signature=1c0f3fd6da9a5a99dbe7939760d6a9e61a2d0dc594a578828b3d18ca8763fa88&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XZ55RA25%2F20260608%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260608T050058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDFVvNhzzWcLvyxUXfeAmA9LBdRbBn6A%2FL4%2F1IZa8FEOAIgJpH2pjiNOd5oDeHBTEk8dNNSjDnLZEpJcNcwy6MPY00qiAQIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDN%2F1XuU8XFpLmTfUKyrcA8bHvp7c2thO7532V%2Bac5CcKKhly7OdUaQ3gVxksSAHmLX66b%2BDk3JwVL6qM84YhNtpvlNYJKEXCN6%2BFUykZUSkcohO2vUnT0ZF%2B7Zpj1hOdVd8FohO%2B3Atc0eN4bx%2BeCpTwaRMQlXbnafIX5ciKwFv8d3XNwb4hL%2BRpXJzWQvtJz095Ib5lzhJuHkJ1uG5U6eTav3LR%2BXG4O8abihMlRa9cOVld81pmL21XP4lhpaUTUqB45bSB3LTnk7c%2FlkRTUWgBg434gGywuHnxASMzg%2FU1zea8HNSOETi4OvdSCgdomld7%2FOmHXk04h79MJbJKFAXe7NL3EdplvFNcQXXZhoLGeqxbHfZnp%2F4kD%2BUIOym5oxcbT71Lk6U4GdWdYH%2FcqbIa6jeiDwQiVku3vJCpdxewjsHK14MNbUIaUFgTVuYnvT9hpsqAwDYuxvU18ZYwJFELpSU%2FwE4QI2iRQ7H%2BRhZMwCjuuQYq8Z53aoHjOLFfP%2F3D5tedEE%2BNeRAV3Z8eYr6X8FiswnhTDK4l5i5RSZkNTpnns6YpbdTuUn0nBMB2w8cEXkxlzOtXEbs%2BQuLhVgkwmuIcIBjOUCatJlw4BNJsjD%2BMD%2BypkQf4uImfdwnPAzONaRBgFVIs61rjMKSKmdEGOqUBhxOTFO53czVz48hfTDD%2B%2Fa6c%2Fwb9rJblW%2FVIsNRGcnKCw66jfhH%2Bx6gQPUezAnlTykyUR49xUf2m8yeqOlvg5Ycg4eZr8M0D%2FGP%2BLQszzH32urMWV25DNmD4zClK7PWL9MSATKxFekG%2FP16qRR%2BT8xP8avC7fPc91%2FFjG0Xp4wkbEyphTh2IvpocqBSD8VkzLbx%2FLS1q57hX4A45Yc5aM5P0nNOP&X-Amz-Signature=6740ea90bab2d00c5e44fb499261869c4943bd3fa32f5acb898fbd42736fae0a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
