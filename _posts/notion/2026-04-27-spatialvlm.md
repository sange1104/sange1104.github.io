---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U6ECURA7%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQClBc91KYB36604m1At%2FmPySIVJQx9hcMZg97Pzl3Mi%2BwIgFWtcJmX8hlL2WjRUYS7ac2suRdS%2F0iXpIXIkl72XGEkq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDA5BgcqDIdzUmkvn8SrcA4FZ5uTifA%2Fe49SbI86lN4%2BFAiSWkWsqaM5rtSvZ%2B5C1SVjVkT1L%2BGjjqg3bE3ximEPnV9uJu5fdoFnggL1fDAdw598P5X71Rja%2FMm7oozzRdJnHmWhbt%2BL%2BIH3qQ38f9y4QF3Hogs4nIxzkpSNkiGVEm6PSLZWR2UcSL7C9%2FO7gE2Ekma9DlvTniJPaW4um%2FZS6tLZkh6wBVVQDZdS1qsVaMjNgTCAN%2FLOMSslf0swOpWrCvkidvKm04fUB1Ik9iWMW3eFet5xGQsRc5FOgcMLQzEnGDn9ANUEug6tQwGjURYnq%2BENvM%2F2v%2BDZP7FEjXNUuSyJTXeqK65GPQjXqqL8QwjMBfWlXNMjl8cvjxwR7n%2BrxZtjkvKTdy3uJpBnGlGJi%2Bdaih8%2B1A6YRYcpl4enNb4x2qOdSmm7Nzyiin%2FEF%2B9bspdHgW%2Fx54t1H461PCsghn8sB0VMW9x77rA9Mn8bcvaPdWVvUa11zug51hc9%2Br3IW8fwT7qU77s7gpcgJJFRUTEREOWJ0U73r6h%2Buk0k4WlzsYkOmEoRn1kTAtyWq4M7ITCjjIXSToevNbFQi%2Ff%2F2SuEJzmCWEE%2BE1qGuWLVy3XRhERkNOLDyai1wtRYvKa077bUMDeIk9SgjMPXKxNAGOqUBHCEpa932TgXSd1MgHRqI6gIUjvosf4Gd1N1wq34t2ys66t3QHVAM%2F8RZSAiKr1qgsGBVeTepLzrWRNlqmXDh%2BOdxucW5%2BS6Q%2F%2FrIACuRGMrKY%2BpOUhW8YUg3w0l79XA8ASOTCL4%2Fz31TFtAAm13vJppEoM75CMZWMCW30GtClSnWL6LkY0AA7O7zeA2QdhSJADsdVEt7mhaFXeze4EcRkqCN8rEf&X-Amz-Signature=65ce511e9dfd598113e318219d1134eeeff5cc91b1995d2b9116ea8025543d54&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U6ECURA7%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQClBc91KYB36604m1At%2FmPySIVJQx9hcMZg97Pzl3Mi%2BwIgFWtcJmX8hlL2WjRUYS7ac2suRdS%2F0iXpIXIkl72XGEkq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDA5BgcqDIdzUmkvn8SrcA4FZ5uTifA%2Fe49SbI86lN4%2BFAiSWkWsqaM5rtSvZ%2B5C1SVjVkT1L%2BGjjqg3bE3ximEPnV9uJu5fdoFnggL1fDAdw598P5X71Rja%2FMm7oozzRdJnHmWhbt%2BL%2BIH3qQ38f9y4QF3Hogs4nIxzkpSNkiGVEm6PSLZWR2UcSL7C9%2FO7gE2Ekma9DlvTniJPaW4um%2FZS6tLZkh6wBVVQDZdS1qsVaMjNgTCAN%2FLOMSslf0swOpWrCvkidvKm04fUB1Ik9iWMW3eFet5xGQsRc5FOgcMLQzEnGDn9ANUEug6tQwGjURYnq%2BENvM%2F2v%2BDZP7FEjXNUuSyJTXeqK65GPQjXqqL8QwjMBfWlXNMjl8cvjxwR7n%2BrxZtjkvKTdy3uJpBnGlGJi%2Bdaih8%2B1A6YRYcpl4enNb4x2qOdSmm7Nzyiin%2FEF%2B9bspdHgW%2Fx54t1H461PCsghn8sB0VMW9x77rA9Mn8bcvaPdWVvUa11zug51hc9%2Br3IW8fwT7qU77s7gpcgJJFRUTEREOWJ0U73r6h%2Buk0k4WlzsYkOmEoRn1kTAtyWq4M7ITCjjIXSToevNbFQi%2Ff%2F2SuEJzmCWEE%2BE1qGuWLVy3XRhERkNOLDyai1wtRYvKa077bUMDeIk9SgjMPXKxNAGOqUBHCEpa932TgXSd1MgHRqI6gIUjvosf4Gd1N1wq34t2ys66t3QHVAM%2F8RZSAiKr1qgsGBVeTepLzrWRNlqmXDh%2BOdxucW5%2BS6Q%2F%2FrIACuRGMrKY%2BpOUhW8YUg3w0l79XA8ASOTCL4%2Fz31TFtAAm13vJppEoM75CMZWMCW30GtClSnWL6LkY0AA7O7zeA2QdhSJADsdVEt7mhaFXeze4EcRkqCN8rEf&X-Amz-Signature=d4cb43722cc707dd8d3a8189e036a20df559d05b7399c92573572c9d59b2ffff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U6ECURA7%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040704Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQClBc91KYB36604m1At%2FmPySIVJQx9hcMZg97Pzl3Mi%2BwIgFWtcJmX8hlL2WjRUYS7ac2suRdS%2F0iXpIXIkl72XGEkq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDA5BgcqDIdzUmkvn8SrcA4FZ5uTifA%2Fe49SbI86lN4%2BFAiSWkWsqaM5rtSvZ%2B5C1SVjVkT1L%2BGjjqg3bE3ximEPnV9uJu5fdoFnggL1fDAdw598P5X71Rja%2FMm7oozzRdJnHmWhbt%2BL%2BIH3qQ38f9y4QF3Hogs4nIxzkpSNkiGVEm6PSLZWR2UcSL7C9%2FO7gE2Ekma9DlvTniJPaW4um%2FZS6tLZkh6wBVVQDZdS1qsVaMjNgTCAN%2FLOMSslf0swOpWrCvkidvKm04fUB1Ik9iWMW3eFet5xGQsRc5FOgcMLQzEnGDn9ANUEug6tQwGjURYnq%2BENvM%2F2v%2BDZP7FEjXNUuSyJTXeqK65GPQjXqqL8QwjMBfWlXNMjl8cvjxwR7n%2BrxZtjkvKTdy3uJpBnGlGJi%2Bdaih8%2B1A6YRYcpl4enNb4x2qOdSmm7Nzyiin%2FEF%2B9bspdHgW%2Fx54t1H461PCsghn8sB0VMW9x77rA9Mn8bcvaPdWVvUa11zug51hc9%2Br3IW8fwT7qU77s7gpcgJJFRUTEREOWJ0U73r6h%2Buk0k4WlzsYkOmEoRn1kTAtyWq4M7ITCjjIXSToevNbFQi%2Ff%2F2SuEJzmCWEE%2BE1qGuWLVy3XRhERkNOLDyai1wtRYvKa077bUMDeIk9SgjMPXKxNAGOqUBHCEpa932TgXSd1MgHRqI6gIUjvosf4Gd1N1wq34t2ys66t3QHVAM%2F8RZSAiKr1qgsGBVeTepLzrWRNlqmXDh%2BOdxucW5%2BS6Q%2F%2FrIACuRGMrKY%2BpOUhW8YUg3w0l79XA8ASOTCL4%2Fz31TFtAAm13vJppEoM75CMZWMCW30GtClSnWL6LkY0AA7O7zeA2QdhSJADsdVEt7mhaFXeze4EcRkqCN8rEf&X-Amz-Signature=e195dc96ec4516468e279a58372c2f643a0d276b36b45b68297861f64ec55113&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QHGKY3AD%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040709Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQC8aULwgXkGt39PjgLFS%2Bdhiw5dQtUDFitjcCIJIRAwJQIgcdPAFDSgJfChz77N8%2BggVy9NFYuENaJYdfySo1KAEx8q%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDDRq0gLhv4kHclup4yrcA44Kp23YKE3iTD9m5c8ypVVdGpUtIO8oMk0vc%2FzjJxxGLKxlkCFDBfKE5cNoOW30w2CVWoUmTs6CogGRgC6Nz3%2BCH8KK2rBu%2B612TCnmh8xm46GKPRW9J15uG8rvFXqm1VPCWccvWYYIpQisd2Q%2FLRkGMBXi7lRjDqgVjtfRUaw0cZxvK9EkCjDFpp4Ub2ksLXaCHI9kisWz6QO4NV2ziHqSsKnl3kdStuBMuRVQkSjy9IhdKt7Ia5rxkIJtgm0HloReUjhtD9csqeJRIj6UB2Rzh6YKonvJmLgZqzdPdGAmix5Ab2K6V6cxKoFhwJnWnfoWVDJUHNcqrqoYbH9wKVWIaTbrJD%2Fxk7321%2BUjXKx19O%2BxbcQqEo0NG%2FZbC3OyMIi4oPMiIlk8KUzI7CQaAEN%2B1wM3yvs6jDoNDmgF8AzLpVGYthKv2U6lis2TIV7EQ9flReoWRMVC3Thbt%2BuMW3n4YM6D375bFpGBhXcxmc%2FFp8DsFNVJ3BPEn6egZ6Kw6adCTf%2FZVq%2BcalN0GP5IiB4UVjezqDZpr7d8Ve4I2Nlj4g46xDpO0bJbSirNmrd9StNQJZM1xOFYY7%2F7Ep7vrN2QJumyZGTTSL5RrSHjrMQ0m4UAdua7eB1y1j36MPHLxNAGOqUB5GVGKg7JhgHv0WXwtzqGKfYaG319oxiK3AsDqAK04npSeopeslDX%2BQYbSnUa8jmUE%2FgWlemy9riVQVpqEneYUJKUI795XcJm6A92GFUEdSir9IcOTvtsMQ3q%2B7XwThQ%2FmBKysUgJ3daKaDUfcSzLZJ5LT8VaMHMY3JOqBqGijlnDZqE0eFakcKAq%2BUjRlM9cL6mzYujDjv6VYDp7UsjUhWsWzvqR&X-Amz-Signature=0ffcf8016d2c41fabab82caf4a837fc6a9ca2ef7639a0868f1bae0119e489c15&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOBTLMTG%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040710Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQCCS2n5GzLHFEq1vi6PDz13FhAfIcIQ9bbqTHSYHTJY8wIgPRIlFj8fX6XEdJqFB6V%2Bt6wMmsQscxpGnuaV2WNwrUsq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDBjfB6lZSPQTcoGPsircA7H4P%2BlcQXRZmiy5mDvQi9hfWgcMx3C79HoxcbeCgQXn%2FaxaldH1zkNnAkBpNm0MUo0T9JAPY04hIG%2FPVAoty2nzehBV%2B%2BfH2073Lt5BPl1V%2B0OdCm%2BqzJksJC%2BDCecn2T6fpJZ4d3wOwPxBlF8dcPhL8LFmY3wgvbDc%2FefBhIK48AAePoTvsVOqCAsjBEIRhBGhBSZECoAnZnRhw8EYbtCk2HRP4xbVbYE9eL4sqiNd6%2FswO%2FkGHQR6nLo0rkX3SyPTEHnBKw%2ByUIx%2FDZQLLOSWvg37NUpZ6pt8DiOsuAp3HR4Xdu1X2eMPoNtLYky3GmS8XdkeDCt4lPiQIC1fSctnTIZwTmYtZ6daqjwFpp9JBKz4AKX1qjRBB6sPxjNCaWD8L4Pkq9iZy6lSlyCtLt0RhPmnxuCawmtjDPwzBSlzGfqTdf3xgOz53iDsA2Kz4NxJ0h9vHPi9wcP9TvQ1bHwSQ9mZhW9xNsct0hrzEpbsprmAoGGqvsw8QXLZW%2Fjza9tsy9%2FX6IlPt37GccVkHAjh%2FqWojxlT3KDQFAlhBC2%2Ba03LtoKq1AO5y50PFFMcb8%2Bj9szsZTaXaUqQsH7HNLToVXGL39SRVikFG3qG9i5oI5N6YvwMOYrURz5sMKLMxNAGOqUBBaHZHKse1kF%2FfT%2FSD%2FPMFOKMGc3OAQB9KmFqz8UiwGqFGtF6yAu1oaND72ArWth9qgeFXbmJYr9rtsD71dtGba7iVnre2EUfksj1mauti26ZT1LuNyq3WorGFxTby8tXjBQQspgcc0ZG%2F8HshhslyBe0lBbeaD9kYtrw3qUA178hle65cfNPR%2BWPxm9FhoZus%2FOC9wdNlsIW50TeY4kUpvViRlln&X-Amz-Signature=65a5f26bbee8412671b0f63e73f6915ee51f7c74c5cbade357dae316ca61819f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RT5I5AIF%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJGMEQCIHjCcfW2peFFd6gr1wY4BtAN7Wd0r7%2BJoLGiQG%2FxpIBhAiBs63v8t3rJrb5bXmCe7KAIjJqXbCBwuFTqB8QrN8uBxCr%2FAwgtEAAaDDYzNzQyMzE4MzgwNSIMDMIM9CSXAov2KG%2BsKtwDvUleJXPJBMLkvRvKmmTctliOdYW%2FYsfDKURI%2F3IGIF%2B5oDkTu6oDY5kT7qyEyIDulU6uASic12QQdB1bUHhTQxyCbVc0hFhVHd1DmYvqYIlwIYm0yWFR8lI9s9M4BEldmWeogHCWNhavk9kDMfxyPo8G059%2FcQ3tXVQ8Iyk02JXrCEARnkYUGnBKsHaPGpZdElscpPxA6vk%2FTfxj0n4cyjSYThN9%2Fft7igKG8C3yRtedXEYCtMVWW4%2BscNRoxsNoqborLCGp8FHBv2MFfRvUiJ9CxEcOZ5vPfx5xtXt1W8Gar38japZcs%2FMqA%2BLK1K236GytJp%2By1VJu%2Fr2SnrmQXtPMq8QHT%2FwB3j2AXT9pqv9VCm8anbI3a3U6DJpeRU9qItHqyb4YWRw%2FrokOVV1Fvy8XtuEvg41SLhZriITsZT1XNi3POQNuViynCj3DnRlv6Cn4CP%2FeUXFZCdVvzDQ1iVkpNdqb53%2Br9ch0EvlaazEZCBeTM1gKaK23sGfn1IIo651kYCKbiLxc44rUsP2H4uhuVBLt1SXYB2Ldl3Xk6BFHd6YmVpJqpku3b2thPGLryMy9eE2YVMdCUxzp1RwjNq%2FU0K5O33uoVZzur9OZy7VY8CmVTxoOiBH5TEEw1czE0AY6pgH9DXmkOVj2BMhrGExCzE%2B%2FHu7aEqgUVTyK%2BFYoVqdNuW7hZf0rAEtbN33YM8g%2B4dc2YX0lIttG8KrIf2owyljcui3qwcMszEKvoyVUtR9qz%2B89z6D7zQ5degCr0hXvmzT3eAkIjmC%2Bw2DF8r8b77CU2W9Zds%2FAF3IbHNbHxbgIa8317bRLXX9rfWrX0qKMyyTq2hQYqYUGz4S8C%2BqOtNblD4CC29EK&X-Amz-Signature=07e8edd5e0983bd5f005b4534f528ff5e3292d3c463f31579aa387c6a7ed5a16&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z74UQSRP%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040711Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIDau%2F12OBDX9dbLH%2FTTb%2Fb5fv%2FxA2IjD2lQKjJXwc%2FQ6AiEA2suOmktgQLqtITVT6fLJR7lugGq5dUeFG%2B7wbhEPWa8q%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDOuxotMAzXnucXbO9SrcAy%2F3JAciImz23X7lhPXTv7K4pj9gU%2F70dlFaQEgWU8Cjg%2FG1dn36gEnwvb2TurQnK0Rys2qH0rx%2F0M08a86OHN9HXzCNVMV5YDk6O6BUktm3KKIigDpw4h6TZHxatqHv51EX72vxJv03ZRPtNWC2ZXSU3DC4KES%2F6fUsCaDumFf7Sl1p0%2FBBsYdrbiCtZuqag%2FQSG4dYQKJRGf52ZN2QnlmkV17genyVurM4Uc8nMZj7eVF3O2y2%2FoMalX%2FoOI98QzsvzY3ttQVroXCb4ZJ5S35M4QQbbdoty8FjdEC6jeTaYqi5bp0npvaP%2F3VHaMShVZdBqgp7QraB3APxigk5%2Bvdl5OmkGppZKQ4x8KAAjE7Yj%2BRxQsGYasw%2FF3cLPzKxj33SO3dC%2FiRvDYnti9uY36FkjuIF6BRZWrDzEHfnMJTXb02CDGFnG4XSYlgeImrn1j4oDTIDuupjGftnwbwDWFMWIC%2FCBI%2FdHW1GLhYUe%2BWls2o%2F9eSNR7vUxpDBrNqxQT69WjM%2BoZguL%2Fx3pL7BCPlDBqsiGk32Az2cEYAId5FM7uKHuIb4pJyYyOYJNvlCUOwWvZLqL7w53mP3j%2FjFzIcvsqaRa6eoP%2BypfanX46RF3ggDYojipzjSFXXvML7MxNAGOqUBR4eiS9HvXPo64z3T%2F7UOUPrPL5ME2MMW2oqAs0CAkOL9JZH3d1qZiRZ%2F7M1hbrLSVLajbe8WFp5%2F9fG1A5yajxkwXxVfEMwk%2BxTTS7OIs78%2FPMtpM8FzXbWE3yOGiJW8hpta%2BX20WD9ZSjwku%2BIE%2FQxan9%2FfhdUUy2qGiFN%2BZ71DfhKo2igcDV33qqLVSpiwp0Wk%2BJG%2F9db9vPWghapLKW0Nb%2BMO&X-Amz-Signature=7d18d9611d70a02fa683b3d8b39a20f379299c803f5451ac853689dd928b9f47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZK5PLMPN%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJIMEYCIQC6MqOHcOm9ZPq62%2BFo%2F%2B8rWs0awh56jBD%2BvOxxSD4AdQIhAMFUcnM90n9meHL10lsWF7tzfhjqpy3jAitOIaHFXP4FKv8DCC0QABoMNjM3NDIzMTgzODA1IgxE915qlZlb4r51mAIq3AOYmqLTFmaG%2FbWU1mRerwZ83%2BVyiaqcklBOOW4MHN%2FMwf1BHnFCpx%2Bpeov9O4DsiZCIgRFv9Ndh539SgwE10eCoXT8qaQ8kmmSvnnoi4qYI7ZG457vmGtdbH%2BoNtTUzCqAz%2FbykkG6Nxa0fRoAvO%2FzKOVyFPBSnLzjeRlDo8WikYL5lBnuZ5wBzRRU%2FBTjph%2FKstrf0k4f6Z83lwgVfKMzTJPKytMLaKK6Ky00z0y9sUkovPmSSmiIINplQUD8537h1g9N1UiIZ9eQ212IS8rbdrxkiCF34uvvHkwYMV2WOQvNRqZ3fhnOqshMPVVkTv86ocfAqI%2F3gGaYU9qRSXCh0%2BhWhon7KdMEI6mFicCMEfME6R83u4PBeu1HRJB8e4j5PpduskVLUDwjwl4%2FdHKu5R8xRxckAmFc6lDJwRRWsaAKHb6ijdrKziLlX7lU9lODJlMLOflcVXUh74O0TWMEz2gZxv%2BxmraSrSX0lYoTdDir1Ewh%2F%2BaJU3B3vtQfHRGNcaeji%2B7Hw1ocQLxUR9WkGtSLwo4YTCJAYX9JOF%2FyuzCPpNWwFX%2BzS5Nu3Npf3lfdf%2BCa%2FzWZ3TyCckXJGC21tIepPRCpAgQQGkB%2BAyBAjrXAvTdiHanx9PeWtbzDWysTQBjqkAbREGPyjSLQY%2FSCZ7W3s1zb9Hzxm5u6vB0RFN%2BV3NxnOvFFWdYeIdd%2BHdbC%2FthUei9FwLanq9dGZTZtLp9qbWwARHSatC38zarf4RvhlZKEijGw4HPaxeJgcEcz9pQZYeWcYkYkV2ypQ7xTf%2FenyL7%2BP7jd6G4R59c8tzJATDobDXX0X9KgH45c7l6eckzICon4RQXP6FVfstiC4EQUw2IKNxmtc&X-Amz-Signature=eba5f18a0354c20b0af49960924557f6ff320b9eafccf56b034f7dfd2bc79ed6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T3JVFKN6%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040712Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIA%2F5L4UuE7u2mKpoe0IlglM8%2BgOPt%2BincKaaGUYOZrXTAiEA%2F25tdlfG8DINX3bsGbmwS8jfAGYJBwNmQvR%2B6gj4xucq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDAZg4dghO9VGzZHPryrcA6AdRxAwnSaoxrs81YshXVB7MgQvDse6AhFF5hQb8B0ELavOuQ9nmqscc%2B6mbm0ny%2Bn9WLslZZLAU%2FuVYvKMmfndMkOmHYyKoJbkOLquOAvaY0%2BmOSz9P0t%2BqWjj1XCCYkgXpMbRrDG%2B0nlXYLscD9O2TRMd%2FnTFu1zzZ4qbCCzu0IeqC7zC%2B%2BiL8ZsVHy2REx%2FUt8%2BGusse59USctH%2BBqy%2BGFPhpdsjDQQ9lU1NqqBXalq5FdLxT%2BGtTqoPQUdO5DLshLVmF8%2F%2B2X%2FzpJ%2FZl69Uog82xcaKDhNoOXEX%2BFJ3y4eALgQpbN8EscOj%2B43iP6svvZ1kBoYy4zryMrRVYTBEsnuFU6khFvJpCFgoJLu0XjEbK3O%2FFr6Pwk9ZvZbufrH%2BvQQQi3soqJlnhFz%2FY6LOwDva2v0lGF2LyFMsiZXznuzu4NvV7w%2BmhbFSTSCNqHayQH29VCVxDhLPnI48D7ObeLYsDefiSVnNmKrZyHaF1o4Pr3ASw7%2Fe9zi3IRY74%2BgWTqAPB9DmImQ7XudbK23S9LGh3sJTUd2EnHZ9T5la9uu0%2BrOI7cp2EyoUR4BkNEsswN%2F07W9hl0qFQKzOKyONC3X%2BeE2VS4sI1piUG850V4fIA91j5aqHXC7%2FMPPKxNAGOqUByaUm%2F5NOZ%2FapJT51aeVSUQHxkl2hzu1kTe67V15JwmVhBawhF4OZsTJ6oELaby%2F7m%2FBhHePGP3JTjtFe0qzpfaac2Hz85%2Bb88%2B251VeFMapX9sFrybKYzRSOIxyME8d2nIBsOF0cs5aRgYQ3XGfjGXjVCHIz8LamGAgLW6eiqoxmzUbpngzDCvq1KSDs4C8cv997UEQPuWhrAhZZFrqombsrwH5X&X-Amz-Signature=663287870f416638a83223b6e961caee3d0b5486041076a3df90222639cde124&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667YRYYYTI%2F20260523%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260523T040714Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGQaCXVzLXdlc3QtMiJHMEUCIQDHw1OitmLaZsqtPXsYvC6FgAuR0II%2FeQOda5LN2IJ42QIgXOqMojyHANOcJovB1mIqSVIwmPNiHgbQ23%2Bvi%2FhCCaQq%2FwMILRAAGgw2Mzc0MjMxODM4MDUiDOdA%2FmM9C5%2BM9QTQIircAwHV%2FYZg%2BkHjsz0rR7PXdKGRRxmBFD7X3utLHZ0mI2%2FxRwVQCI8gkzdziWbQzusVJbRgRaPqrJJPSDM4bKro52V9PymzCn5PI6jtRRABWNP90OcQRt70L5PEUYGxUGUTU4vCwDAgg7Qy3hicUs1h7FDSlnG%2F0HUATYmU9v8005UWUjse8tQMNIrxLOoEzkpREI8iV5EDJeQ6Qja0HHZdmarr9B%2B1kwY8aD6K%2Fsp4bTt6SFHPF0CgkxsoAcS9Zzhs%2BpzAJWTQSQI%2FaW3B2b8Whe83%2FnuH03UNJrdJtXtuFj1O%2Fl3eCHc0I431dMBc0uGv38iTX5sek9AeEvcTSjk5GautV5J9XHysHJWgA7wNefvUybQkVWxKIqCdHGiNjsztM7yNlRRUC%2FFPrjhng0NWbZOZr1ql0c0rQQrNwtiRoQBekitFFYUKUdeJrAVYACS0m%2F6E0fO6W%2Bbq0rT9ueGeH%2FpS5yYYnvOxAdoxSBmrwHYBOlN4PkItss6XPi82xuWbA2VgXcvO6b8SgExEOZkrQmfNTsjEg2lNB%2FozsvT5hrbWeF86HH%2FqbIeR%2B%2ByFqd2WJx1mwu1qo8v%2BOZRCj%2BIUt50BDU3w4URLjOQObygWVko9zhNakw0NCxDm0%2B6HML%2FMxNAGOqUBPXHafGO85%2B0f%2B7zY%2FAtSlUVdxqPmJch1jJjIbITPRPE%2FwaNMKuryQU6dXqWl94TXC9siOoi2Dsf4jZqt6ONZldc%2Fp1i%2Bft%2BDj9K05FzNdgZmik56aj4T%2FhjG1jlEzpVHSWCRMwTzd6%2FwZLrgBJiCn9Ttclu01ADbz%2Bs4EgWGO26Q8qftY9KYTQsqMddjyGM0PqfedRrjkUbrfTK7CDaF%2BEHXJhlN&X-Amz-Signature=0451dca142909071067bd1e767712e6fd9723e8fde6832a54f122c951e0a691f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
