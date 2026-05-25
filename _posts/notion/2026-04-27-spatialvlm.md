---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCZ2653X%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCPDUSsOfemQyr5iyFvvkvKhyAxKN1MZHiDrasGFLf1ggIgeWWSmJoi1nePH7R9webli%2FIbX90Vzr1hh9P7r%2BZ3HyEq%2FwMIWxAAGgw2Mzc0MjMxODM4MDUiDBlIRAC%2BWNCuLBmusircAzNg6R31RZf5rpyPGU9gOs%2FmwD7Y%2BKveVGhfiSQivavMd%2FPn0MIhQsgl9fSEkK7iPkiH4WNl1JtlJQ4N2JRcFvIbBHDTPEh5IN75ePtvdNG7KS9oFzGxz5LKgoQE%2FhZQy3apljVHBHoKnR9CJjdRj7GtNJAHX4jXwJVzNAKPxuaVw9ZJHt96NH2QAU5QAua1uU%2B4H63IZOtvJTreY76rpauQuoVDjhTI9E5iCxTB52b5Pe6vi95h0RcNXnGNtN1XDAI87%2FgG2Elc0YldQ8MGmpaYF%2BvLnSaGhXQV0zfdeQaOeOsUdro%2Bk2kV8y1LBjG4maxKOSfiM4bzK4s83hipyeV2CNWi%2BDQIbUSJw%2Fs30VR3e57OSBd%2F9%2FOJdZ8ws2EDZlvwpIlg80141PqfREKfr20mXPnG1xwjXoCXe0y5PJOtolir8yJUnb8W8wWZRCFqbvMQc%2BTD6yQ1nOnkYd35Nz2kQwT0f%2FQZH7FISxGSFrPUUF%2FrIi1vM0sUIFoI7PtMaaoZJGxuya4ZILGEvyzPwhcqb71sZAncpDyrIFiDCmaxOiDEEIOvQp%2BecSwx0a6c2yOgHkAOZMPcO%2BCS4KlFcVngBBH9j1%2F086xWdkkiS2oNvFdnKmo9cywdXFXIMKPlztAGOqUBmscX8RPPLWKWCgYGzYqv1%2BNCdrP0KeJegnzsDbFud2OLgWZYNh3ZJF3GQjKYI8fXntnUGEAWybfWur6NYRs5vXwQYGZyx5qBfbl1JJ8GYyraUyZxrgFQx%2BUiAAPjqVJHXeTIIg79CTdvJxYr2SD0QnufAPng6lcVOTojJWw43dDTTAIYH2oRKJTtUge1U825rB16UjkK1OipVWb1ycfWcP5zdScs&X-Amz-Signature=96da5fcb8d5e7e4cf4b41778ab49e80d5c2f53308d90aa06f5b0e8a9656a3878&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCZ2653X%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCPDUSsOfemQyr5iyFvvkvKhyAxKN1MZHiDrasGFLf1ggIgeWWSmJoi1nePH7R9webli%2FIbX90Vzr1hh9P7r%2BZ3HyEq%2FwMIWxAAGgw2Mzc0MjMxODM4MDUiDBlIRAC%2BWNCuLBmusircAzNg6R31RZf5rpyPGU9gOs%2FmwD7Y%2BKveVGhfiSQivavMd%2FPn0MIhQsgl9fSEkK7iPkiH4WNl1JtlJQ4N2JRcFvIbBHDTPEh5IN75ePtvdNG7KS9oFzGxz5LKgoQE%2FhZQy3apljVHBHoKnR9CJjdRj7GtNJAHX4jXwJVzNAKPxuaVw9ZJHt96NH2QAU5QAua1uU%2B4H63IZOtvJTreY76rpauQuoVDjhTI9E5iCxTB52b5Pe6vi95h0RcNXnGNtN1XDAI87%2FgG2Elc0YldQ8MGmpaYF%2BvLnSaGhXQV0zfdeQaOeOsUdro%2Bk2kV8y1LBjG4maxKOSfiM4bzK4s83hipyeV2CNWi%2BDQIbUSJw%2Fs30VR3e57OSBd%2F9%2FOJdZ8ws2EDZlvwpIlg80141PqfREKfr20mXPnG1xwjXoCXe0y5PJOtolir8yJUnb8W8wWZRCFqbvMQc%2BTD6yQ1nOnkYd35Nz2kQwT0f%2FQZH7FISxGSFrPUUF%2FrIi1vM0sUIFoI7PtMaaoZJGxuya4ZILGEvyzPwhcqb71sZAncpDyrIFiDCmaxOiDEEIOvQp%2BecSwx0a6c2yOgHkAOZMPcO%2BCS4KlFcVngBBH9j1%2F086xWdkkiS2oNvFdnKmo9cywdXFXIMKPlztAGOqUBmscX8RPPLWKWCgYGzYqv1%2BNCdrP0KeJegnzsDbFud2OLgWZYNh3ZJF3GQjKYI8fXntnUGEAWybfWur6NYRs5vXwQYGZyx5qBfbl1JJ8GYyraUyZxrgFQx%2BUiAAPjqVJHXeTIIg79CTdvJxYr2SD0QnufAPng6lcVOTojJWw43dDTTAIYH2oRKJTtUge1U825rB16UjkK1OipVWb1ycfWcP5zdScs&X-Amz-Signature=89e1b04a8e174a7a1dd0986a01c30489fdbd91269cc07ef0ac006274fd26834c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YCZ2653X%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCPDUSsOfemQyr5iyFvvkvKhyAxKN1MZHiDrasGFLf1ggIgeWWSmJoi1nePH7R9webli%2FIbX90Vzr1hh9P7r%2BZ3HyEq%2FwMIWxAAGgw2Mzc0MjMxODM4MDUiDBlIRAC%2BWNCuLBmusircAzNg6R31RZf5rpyPGU9gOs%2FmwD7Y%2BKveVGhfiSQivavMd%2FPn0MIhQsgl9fSEkK7iPkiH4WNl1JtlJQ4N2JRcFvIbBHDTPEh5IN75ePtvdNG7KS9oFzGxz5LKgoQE%2FhZQy3apljVHBHoKnR9CJjdRj7GtNJAHX4jXwJVzNAKPxuaVw9ZJHt96NH2QAU5QAua1uU%2B4H63IZOtvJTreY76rpauQuoVDjhTI9E5iCxTB52b5Pe6vi95h0RcNXnGNtN1XDAI87%2FgG2Elc0YldQ8MGmpaYF%2BvLnSaGhXQV0zfdeQaOeOsUdro%2Bk2kV8y1LBjG4maxKOSfiM4bzK4s83hipyeV2CNWi%2BDQIbUSJw%2Fs30VR3e57OSBd%2F9%2FOJdZ8ws2EDZlvwpIlg80141PqfREKfr20mXPnG1xwjXoCXe0y5PJOtolir8yJUnb8W8wWZRCFqbvMQc%2BTD6yQ1nOnkYd35Nz2kQwT0f%2FQZH7FISxGSFrPUUF%2FrIi1vM0sUIFoI7PtMaaoZJGxuya4ZILGEvyzPwhcqb71sZAncpDyrIFiDCmaxOiDEEIOvQp%2BecSwx0a6c2yOgHkAOZMPcO%2BCS4KlFcVngBBH9j1%2F086xWdkkiS2oNvFdnKmo9cywdXFXIMKPlztAGOqUBmscX8RPPLWKWCgYGzYqv1%2BNCdrP0KeJegnzsDbFud2OLgWZYNh3ZJF3GQjKYI8fXntnUGEAWybfWur6NYRs5vXwQYGZyx5qBfbl1JJ8GYyraUyZxrgFQx%2BUiAAPjqVJHXeTIIg79CTdvJxYr2SD0QnufAPng6lcVOTojJWw43dDTTAIYH2oRKJTtUge1U825rB16UjkK1OipVWb1ycfWcP5zdScs&X-Amz-Signature=580419e8e015c88ffb809574678e18f93ad56d28b8b716408e59fb838f84e214&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UQUL73V6%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC9RUuiTDZZsvxXZY4t0t2vAcp9upc41kLHMPGw48mkhwIhANzJw1KdFMIDMywnNskJRV1LV69170TL8VM7rzxulcRIKv8DCFoQABoMNjM3NDIzMTgzODA1Igz%2BnSe4OuskCAIwFr4q3AOKbUNAcqDrC7BxJ0ZiNSFTzvPK9pvi%2Fn8ERvgrRJ70%2FjxOFoZluZkTn4jlUckCa6F2Rczfi85LaZtnwuB5%2FKGkUJuJRvZwCLMD9x%2BXXk327SXxjQYmaL7BFQgz1LnCZiGv%2BDFILk%2Bu8hQMzVzhel8oYkvRhcpFgriANGBY%2BvserP0PC4O414xhRIyBYO%2B6ts1GCzkdXNGygMALtnUVAFNIaIln7AFgLZvt2ZbwXz9SfKZcHvU5iB32MwsMWBKOI4ihH2al97iNqF%2Fi4%2B0ADMvKtBo34nQl6f5sLTJuyY%2FH6xCm1Olue9WN38c%2BShM0K87gM6DcJtEmzCSfOehCB5XWC6YlmAaFNSqZJjDO4BTYuCfsG6vdzFr8OaP%2Fu2NrFMvSxdULK6UNZv8MstIZU48yYhH4Nja1CSacbsm2xFzeABTT3eMMHHWrr6K%2BpcP3FPEjhqGkaR3PjuvnEXDhMaXZsJvzralu82R66hNfBumqWd7zVZZHNuyt1ZR467BYx9dd1epp%2BO2TpLvmr2gAnuowF20%2FjIm2zXuDHbeRhIXpLRrpKS6M29e8kYqtegSnWrmwwJ%2F0ijV9zoiNqqSF0cfGKE%2FqKxmCTs8tqcxr%2B%2BlPeUWHbHM67TT%2FNw1vcDD4tM7QBjqkATQPEdR0XOCQvvajr0NgicGKvJTFd%2FxLw56KPqiBWl62OVdgH30qW7l%2FaccJpd%2FePEDwnBv4N9mcpnvfJAAEiG%2FsJALnjSFIH1bakHMlKPWM47LrjlbEgcbz31izWpTg01gMpedJkzSBP4WmzfhqrYa65xpZzRhkXkItTJlVF3uv3f7vCjLFljAJUJUZDVWjrGkei1EuQx9lw3HXHMEZcgDRt1Ix&X-Amz-Signature=5db4ffc971ed826f244ba2031db573db081b0c60e1b716192991cf59de88a81f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46642BJZIGC%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044956Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGWrHihyMpriAzxy9Opfm%2Fs1Lj5xlWRIG7hY7UfQYhTxAiEAiybi6quaMP3uvqrDSuZTfER5PXbo5m6%2F3v%2BmAtPjyHMq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDOin9iB6HbP0RS5dgyrcA%2BgnvMejHPRxiXsFN00g0IepHyxcf4rnDOYBMxwNoCUU1zPLI6vNs0LjUEIc%2FjKZyBT1aqqKpQ88VGZOF6%2B6hPh4Se%2BKeJ6z%2BZjhpIsY1Un4ChR%2BIIka3GoFlH18TcpIk7E%2F%2FSSWuFlHRC0RiuMfCh5iN%2FbDuLPzqs69eQnHpA%2FQVINvpK6J%2BH%2F8Qu7wx%2FlE2Njr2o6WcAWYHhMHV9%2BVpkb%2F2WcVfdClhj7wDUgkajF68vdWKQf5Xm4Iu%2BtCll%2FY%2BVENqyyH26YQ2aRkQWiGLvZ7hDnjmcmd9Rli6adFBgy9D3NWmnldrPmFoObi7%2Fvexkuwm5IwpyHCWf2HO5LlCVdbMeisKbcsS%2FvcVSUObD0vepSH6FM9sbUt99YRdbBYyV8%2Bjd%2FmGP86z9%2F7JS%2BZN8xZJ0vWHWXTye76V9Bz6zPQ5wLiffMSTcQjHMIi0eRNfT579817mFyXoks4exo82ymAVDtqDwxbpgpUMX9BW0T9vh4mHNt48klBQviDfboPcwpp%2FCgidi345eMKNCZg6mG67%2B%2FbQHOT5FUTfsPFwOg9mBZq0EQS8nR5%2F9QAPe2oyha0RNjR1jOmkUeKL8kW7jofUgZoO3QsnyGC2rWFFQUzI3aCwyRskgqeCRrpMMe1ztAGOqUB9NhF6XOiE%2FIrtIJ1xiWz093%2BNABDJFxH74Hs52zT%2BbShG7eOcfH%2FtzOJ%2BOVbfx6%2BdfBL2FORz7RnCO4deiB3fmvSE40K4yv7Ewy%2FScZscz8Pm4o3Ujq74vONapzbkwGgXoqmWoa5B05wev4ZUEyTeU%2FLF2%2BrKs0gaxSakSnTt9B2UWhzR54tBGckaywg0O8oLmfj0Tx%2BQbo%2B9BnkfndBTyYH3h2k&X-Amz-Signature=130ad168add5a8e75e604b8fa33fe0023f2972184610f4fc0524b62757b26f3b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667BXNWTXA%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIBDfDafj8hDA67MoO31S1wsctfD2wGnuCOhVbWZsn%2FsgAiBAJ5bEXCdApQCH6bziGo5m26vFgjwVLaiwshpuhomicSr%2FAwhaEAAaDDYzNzQyMzE4MzgwNSIM13Mt5O1O2v6Bo2kHKtwD8obC3ZkemlgWDShumsGnHelzuZA4xlIDjCq2gBEFsKwdxLr08nUxlSVZSHwN2G5kMQItYF7Pssg6xVn7KTSB6OPMExXLHfg%2BOujfpLsKT8Uh%2Blo3uD%2F9kxHTEAD%2By5%2FGhINIbBO3ECdvtsh7AGtd1xnL0tgMt4wkK78SHFa1ipQgHjhkX0tNXTt8K523xJa7605UVxrgVOdEArzS4rS4cv6GAsxkmJwv35LU0Vhm%2BZ82hDHgUBgUxB19jTb9GkDlydGubcH1S9aFxYiXcVCcIY8aGZLdXhmLXm%2Be5OYsZV%2FyNmy%2B%2FLfjX00nZ8SgVkOqrVwJz%2BlqufOD7bWeCuN6REMxX%2FP40xmXR%2BENiuKyyAdn0n4TPAp%2FmRa9NsVZzdMxg0bkUlSySkWjXwbIAxTfbhmLse%2F8x6u3HmigEiRnELHaIWy4b6lH6cUyWU5liiE80JJWIVWmpAPU4dFUTevFF1XJAa3xWeBnUnSvCWdMYIxO8wc%2FyTzYV17DvSXXft8YM6lc%2FbEec83uGWCvog84dGpVQ2WX1gs2mONYl4PFfYz81PQ7C4eXw88Xtv8RQXkUYILOzgH%2B7oYy6nsntI8xW46kmZQy01CL0EhL8bT2fcrTuwuoauPABjEzCwEwkLXO0AY6pgEkpwfzmv8DlfaNeRdbDe60x%2Foi5FbjJJav1PUjXP0hSv3nW4MLeFTKPkUwMw2VTAnTaC4wfvLTWbsoJUgdE2BTuWH3L4xeD5oONQ1PTn3G4HY7GbVqzrVUcUtCUBfM%2BdWtqVtHEwaWLF8sK38Lh7xsqT9ZCPkIXDXJ8dELIplcfjiepNXJ6Mgq1BJ6YfEExySLNHCMJg8e5jxxIV7%2BaC7Z8jyaiqbo&X-Amz-Signature=e46941df7d6f760f9d6523d982c71e9df22633a845c447847fd5b2b2554a0150&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RH33QICL%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD11HJkDTeIHpklP2hJME9Kpw6%2Fi1RWM2Wi8eG5bDe5LAIgE%2BhY60uu0FD7zA8rcjvgiPZjnZzuP0FpH%2B90V8D4IPIq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDEXlHoWnChbpdU49xSrcA68NmJchVTzMChQfn%2BrDXh1xgAO3zDRKS18ZP4Qu9fq%2F4lEwbbdA5AOvEQVHn%2BqZi2kL%2FU3lhLnpINRga2EJetS1VdFxEHydN6%2B8mA%2BEAp7gawzdvGGAOK0C1SHUyFNxverviBcTqNwQQmaM7yvjeNk7RRXd6svaU8hMDhxhll5biZ5yPeT57V%2BQwJsYCDS%2FgDs9lROIRFw4wuk4nlFSUKF9xN1E7Dp5MKE0isS0PX1Fhdg2cq30ofnLwYtXk0TywZ98AYtWuLofF3WpmW%2BpGYP2QLqd9wIaJd6cOT%2Bpde%2FlaRuVa0nAbsg%2BJpJWMXAbBjVqYQvA%2FXbY%2FhdL%2FaQ0PDL6JuoAhjaDteV9Bs9zeJ94tqPzK3GgHaZUWxxEbuRcE%2F%2BeHjLbjDdeDbgDqgI4mVq%2Bx4CZl8%2BeVIH%2BOIMSt7%2Bn%2FrdMQ4bv3P6rPTNX2Fg%2Bk8lWmBVCuIz45IaM9f25iAptRcG7A5rUWAWx8nDFvo4YQumCBMbcOOYpt4q0rPRCIE6Abp3ZUs%2BacL8VYmJv8kq75CwN4M4LqZ%2Fisub4xILk4kYFaVgNipm7zx48Vq%2F2mi1i2SABSbFMF%2Fo0kjCfHtKeh4H46Sk2UpB91rLl9v6%2BHinCS7AEmBTUXdqkMPiyztAGOqUBJc6Oq5WB5I%2FS%2BM2DH2AeOlfQ%2B%2FzGra%2BC3yjUUuBMh4LiaNcmEdF5iJvF5Jk5Y4Y9jkNKRJUJXP4u6oSO470VJIPe90w1B2whQe0BvmiZrVd7q2GpgSx%2FIxB%2FTVapyOdowzchK1mh5ymp%2BhbjxGE7qiZVkJZ4TBCVtiLRe4CfUCHVfj%2BQtcCVHnm6WsTGFz5gxrgehwSMMPWAZheUZqLlvBknTdy1&X-Amz-Signature=8d808c030a79794e17c83d91056a4fab83762f48ff6e2ba42aa035e04273836d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665KZITZ62%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC9u%2BP47vDuRrgvTpFbsUNUB4xYxznHcJNtfl1g19ijYAIgWBqtHK2HudzYjxDG52w9QnPnNFOTzIS2wdeUEiRcLZkq%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDLBC%2FJJaZWh4IRjDhircAzpkInTlBcQmboR5J3Suw4p6CW0xpr69LUxZvIaMkMkJGfaAUqwe1fzyrTFYqunAlMszedz0GhickwmgGRFC39t%2BaaE1oQyQWt9SNpYtVnOzvqKsXwz7Sl8pQmmMaxUtDeagP3aL5%2FV11JbxYbPXoFQR7Onj3WtVzwXUpXuKapFGDbPozSdf3dUS5op23cFrYwv5NKPGh6AjkmXvPa0ySTEJ6tl61l2coKLOL5kcoaE%2F3XGnnbwkHKhOWqlVYOWlzj3VGaE7ukheyLt%2FjAaoz4yEAUyoyO9twGL2G83mghisQ15i%2B7%2BJ1HUi%2BpGZu2oBatNHu7dDV80ki5B96y4bDMgptaN3wNMDl7QBnznwd5uWHfhNuTePS5MYdxhtjo1KSt9vJ1UtKDgy9%2B2bkMkoMbLGveiYx6vkC7mmbcqfkAmvSQ6psvGKmZooEIicurNUaJvvzyECx%2BIuk2z4%2FD%2FAv7%2B7mmANGDKk2sUBMFu%2BmstuceanTIixGv2hGDUIxhaUGDrHkQe3U8BsYpejJCJfkz83b5opqqnjrmikxfLUBMZHbM9eieYetdpD1Gx91NpP0SbjZJfRWpPeHg%2FLO98Cc6mFfHAxCYcVsJ3lW66NsmEGwCi5n5QUWAIUmZc%2BMPTDztAGOqUB482FD3EGZgjNsqD709mRDhPlZDj%2FTQY6x85jepj3r5iZM5O4xbP8PM7OTIF1mjOH3egsDphZe2Bz2RvBXUpCdKEzCeXuUG5EtbiY%2FnXGkGpvuBvAn0qJ%2FRWsSHUhKl3RhTzAqdihs0TxMIIb4sHWyxd47EQW%2Fih%2FQjA%2FvKNsDW%2ByQ4s5CiEBunXbi40HknomxlDSGu%2BC2SDyb3YkiioX25XnCHS5&X-Amz-Signature=2b2087c4cc3abb3d43bc4f57d011b1b17f1257875bbf8f7122958ac259ba6e63&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VKUTY5M4%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044958Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCYjNx7jW6bWU4CyxCRbjtvdjyQ6NhmeW56SH%2BhPZ3SbQIgCCNCU7xqCRWGzymiCJwzc9FrpTJCJTqpJL0y2ZJaEM4q%2FwMIWhAAGgw2Mzc0MjMxODM4MDUiDNfyV%2BCxpsE3RBp0TCrcA4b4fmMlwb06cetYJuy3nmeEqXq7mCF3io5eGkYLjd7H4rWXjOz2kH96Z9FBWwG891mjqmvUOoZn%2BCsF0M5%2BUQ2nVCFRaDYVAy2xGf4erCyGsZ4orrrBsXl%2FND2bh5To5%2FL27JO%2BhyE04EpykFlePqpJJ8Qasks0QHACp4HwBDgmbmT%2F0bpO9OA09RVIwRgsaBvn0MLZmgpPSZTRXsxbiv82TzJfuGNGhq6bA5r73efhYYacNwDsriq3ZMBwGOLvWnqfW7B%2B7pZmifG85TjbkMX9BXjkqa3sW3TsS6OG7htVU5Vx85oaJ7rqn%2B4c8UWbNtVbi5ICX5At6OHj3ZCFtQeOYksM7CjR2HHn8TZx56RTgV9DoRUhNwn9i5hiq2tIUVmtVQntIacVMfb9A4pWlm2ha5SEhr1yndbqOAavLWfHooUVlzjonGglCKBR9ojmRB9McrEzvvG1Bip7%2Fu0VCRtnWC%2BLsLlw%2BI3A%2FYUAurZ2a1yxV0IhVuIEHJjT2UfRM7YANgYyuPfadHevq5dYwCqUJYVb23K%2F0B%2BuOvDk%2BzaOEVZMxIthK%2Fuv7RoaqKkRfNOlBrb%2FVobtQr7vD4MFjDFraw91BAJZ2MiYYfBdWIS8YmfJe9It2L3NhCqVMI%2B1ztAGOqUB0PEaDPROOEMOvwth%2Fet5ROMKWbxeH7pHZAQJI%2F5jNfOU5rO84R4wtH3%2BjgorLueyln5rLtsgToRdtiNMEGtIpueWbm9qYhjQomTWd5rW2eY75C1nw0iwpDpex2UEH7Xr1%2FW9rzS0BZvDEUYIlk6vYXy%2B9w8soGftZp2JwvW61ac55olYjthuB9Sc%2FGNbYB4elDJeo3F%2F%2BX5E0Vnd9ieXPKYsknFX&X-Amz-Signature=bb36c9decef51f18a5e3f017faff32a0c9812ecb56911af4f6af459133be4574&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XBZMN4UF%2F20260525%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260525T044959Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCgcZDW3ENDMDB4Fs8BYvJMGEnTfQt5jTS0WfStRaHNtQIhANjBTrQDSCxtWNFPptGB4dFWeWp%2BnNCitfwc9VY2Ro5sKv8DCFoQABoMNjM3NDIzMTgzODA1IgyHQ9SbCrMuNV1zt10q3APNUJcX3mTuOkJmXXYD5eYZAyUIODB32E25l1LdJzqmL01pEvEsqIVM2h16JlIibHDS55Y6hr8b%2FDeNFGG%2BeCcRPQQvqgYCEO3N6ShTSh1hws50HEQVddhyiEkmYU3zslGMuuCcWAi%2BBAE%2B9n78T3ASjyfD8WjA%2B%2F4SWYTvUgXzhfM5dnuMrXYRa8bswKqgy9PJz24g8MH0qDOuej%2FYsIBZz2EbGjpoXFEeC6AsY5Uq01q9gQK5bg%2Fyx1%2FNzQhYJt7M672hiuWdGHmgECmd7whl1D%2FoWKgevj4ZO0VTFYZfI56GKca2TT0k04wI1a23gIiM0H0qCmHJWoCrtjOZF1nQ62Ezrwxly4e4UPNDa4XFGbTeHh6%2BrzTb%2FYDQybMFZcxK88lbcDmT2St4N0MOsZKfPlliN1rPkdK25TjZ7gEQD6LYYvfxbNiwRn34uh5REA%2F7fw9ezfGv%2Bi5%2Ba7Y8ey6ZgIdN%2Bkp9usWICyubUKVV1F%2FVP0oEe7DdyztpbJ4P0geX7TAfujy7rvkf3YKJwJDdhJ3%2B43bn4THTNLtEvAEHxPYVw5esKx9Ral1khtNP%2BXZ%2FNw57RoKm4YaMveCgyLixEPISV9H9SQz%2FNsuASkegemzohVHNgvLyCiIgYTDHs87QBjqkAX5hpay9iMOSFujDDKvFvx06bZsNOqhRSdC5CFdNPHgpJB6ACRUNg%2FTLQqfQPJuIL1euqImH2VGUV81LToetM2uYiDwT7bnfdPD6YCw5z4mlj%2FCDt8di9djsuZnUCful7lzKEkcEReiM5TlIO6ShVCu2QDfaAQv3yaV6phCdoR7st98XYVe6CVKm3gsYwkv4CRlkhWHc5vmuEyU%2FLDsMaRyC9rGG&X-Amz-Signature=0f5a09e6c749ae1e370bb2d21288ec23b8fe68fb6f2da90d443b88f46138cd80&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
