---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T676TAAM%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045951Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDHH41U%2Bsy8owtp8RxBop6ZHtjo76MMrX76izWqH9M%2BFgIhAKcSaXzk19fCZ%2BXAEdjKJ93Lv%2F0TcVLNS2eC942S3gsVKv8DCB0QABoMNjM3NDIzMTgzODA1IgxzA26BC6lKMkQl8PMq3AMkJToGS8fFitjC%2FT5f0BGxEhHVfLIPEtl9c6eUZvxxbZdjrEt4EVqtCKa7TgOcE8j350PpW9pAHC2G%2BKjDWK%2Bp738tsF6u7HWoNwQDfg%2BNtnrzNmyfnwTajPrCnT3wNvFWo%2BBelRNzFPuMOls3RZ9a91EP6dmQBiYFmVq4iShPPZbx1z%2FkozkQ%2Bxm1Mo52%2Fwl6FN2WhZ26qj0f%2Fgj5hJMQ64pPyHfwgz76yNtGdFHyURhXAgy3KMPRIEmL5Ee9t3CaifeAQCT6diyEEkSG5EVwPAwqGFus5TxrYTBoM90Aa9q7R5nbcbhuqCNOBrNJSw%2Bn8YUcY0gjbufB7qOmjGtn5eY8SC%2Ba%2FjAFWOh1R%2Bj54cgvTCpakP3hQtxXSEygQRj9ahxpQykJQRHZ4qeL4%2F8V7dXMiGB9P%2B63ldMXydUVZawyEc%2B5HgONc5kttYJFLLT8I7WqEGrMT%2B6Nm42i%2Fph6ihYLXnTo3eQyZhuBSsmuOQL1uBh%2BtTDhL438FcNIPpoiGoyRj2NelQqRWutj9QZohGlgMreDahcNiQosq4O8buHc7ua0VASlfQ1LQc9O0kDEqREJXZBdItNZpcQLPaKFlxsp1UI22hKPmMpD0ohX8HRIxm9s1LUESLV8NzCEq%2FnQBjqkAa0pc6N3NWxCKlgM244TvHIjnF7n7%2FPpmDRFiyEj8pvGZest8tRtXADClM4g%2FcAp9kZcsTcu%2FnNkaUWCoYgEakqR3AZNGuwaLBgZ6yh2rVfOlQiAJeGpw9dPwSlgBCQaXzONO8wUXuzvW7qjnmX%2BoO53tbaRFNmMb0dMfn55IMEaFaXqvr9XqOu6DRYNXDZi5NiyJ9Lp8LuBYhIEbLqTZBmqs0ei&X-Amz-Signature=6a829726c88500e0cf38e41a66825235e5da32cc4b23e53bcce94a9da7f74ebe&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T676TAAM%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045951Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDHH41U%2Bsy8owtp8RxBop6ZHtjo76MMrX76izWqH9M%2BFgIhAKcSaXzk19fCZ%2BXAEdjKJ93Lv%2F0TcVLNS2eC942S3gsVKv8DCB0QABoMNjM3NDIzMTgzODA1IgxzA26BC6lKMkQl8PMq3AMkJToGS8fFitjC%2FT5f0BGxEhHVfLIPEtl9c6eUZvxxbZdjrEt4EVqtCKa7TgOcE8j350PpW9pAHC2G%2BKjDWK%2Bp738tsF6u7HWoNwQDfg%2BNtnrzNmyfnwTajPrCnT3wNvFWo%2BBelRNzFPuMOls3RZ9a91EP6dmQBiYFmVq4iShPPZbx1z%2FkozkQ%2Bxm1Mo52%2Fwl6FN2WhZ26qj0f%2Fgj5hJMQ64pPyHfwgz76yNtGdFHyURhXAgy3KMPRIEmL5Ee9t3CaifeAQCT6diyEEkSG5EVwPAwqGFus5TxrYTBoM90Aa9q7R5nbcbhuqCNOBrNJSw%2Bn8YUcY0gjbufB7qOmjGtn5eY8SC%2Ba%2FjAFWOh1R%2Bj54cgvTCpakP3hQtxXSEygQRj9ahxpQykJQRHZ4qeL4%2F8V7dXMiGB9P%2B63ldMXydUVZawyEc%2B5HgONc5kttYJFLLT8I7WqEGrMT%2B6Nm42i%2Fph6ihYLXnTo3eQyZhuBSsmuOQL1uBh%2BtTDhL438FcNIPpoiGoyRj2NelQqRWutj9QZohGlgMreDahcNiQosq4O8buHc7ua0VASlfQ1LQc9O0kDEqREJXZBdItNZpcQLPaKFlxsp1UI22hKPmMpD0ohX8HRIxm9s1LUESLV8NzCEq%2FnQBjqkAa0pc6N3NWxCKlgM244TvHIjnF7n7%2FPpmDRFiyEj8pvGZest8tRtXADClM4g%2FcAp9kZcsTcu%2FnNkaUWCoYgEakqR3AZNGuwaLBgZ6yh2rVfOlQiAJeGpw9dPwSlgBCQaXzONO8wUXuzvW7qjnmX%2BoO53tbaRFNmMb0dMfn55IMEaFaXqvr9XqOu6DRYNXDZi5NiyJ9Lp8LuBYhIEbLqTZBmqs0ei&X-Amz-Signature=2dc0d334497ba26a94c0a7d65c99ed6ab1719e4e59bd0bf1ac5d52c78be16ba8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T676TAAM%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045951Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQDHH41U%2Bsy8owtp8RxBop6ZHtjo76MMrX76izWqH9M%2BFgIhAKcSaXzk19fCZ%2BXAEdjKJ93Lv%2F0TcVLNS2eC942S3gsVKv8DCB0QABoMNjM3NDIzMTgzODA1IgxzA26BC6lKMkQl8PMq3AMkJToGS8fFitjC%2FT5f0BGxEhHVfLIPEtl9c6eUZvxxbZdjrEt4EVqtCKa7TgOcE8j350PpW9pAHC2G%2BKjDWK%2Bp738tsF6u7HWoNwQDfg%2BNtnrzNmyfnwTajPrCnT3wNvFWo%2BBelRNzFPuMOls3RZ9a91EP6dmQBiYFmVq4iShPPZbx1z%2FkozkQ%2Bxm1Mo52%2Fwl6FN2WhZ26qj0f%2Fgj5hJMQ64pPyHfwgz76yNtGdFHyURhXAgy3KMPRIEmL5Ee9t3CaifeAQCT6diyEEkSG5EVwPAwqGFus5TxrYTBoM90Aa9q7R5nbcbhuqCNOBrNJSw%2Bn8YUcY0gjbufB7qOmjGtn5eY8SC%2Ba%2FjAFWOh1R%2Bj54cgvTCpakP3hQtxXSEygQRj9ahxpQykJQRHZ4qeL4%2F8V7dXMiGB9P%2B63ldMXydUVZawyEc%2B5HgONc5kttYJFLLT8I7WqEGrMT%2B6Nm42i%2Fph6ihYLXnTo3eQyZhuBSsmuOQL1uBh%2BtTDhL438FcNIPpoiGoyRj2NelQqRWutj9QZohGlgMreDahcNiQosq4O8buHc7ua0VASlfQ1LQc9O0kDEqREJXZBdItNZpcQLPaKFlxsp1UI22hKPmMpD0ohX8HRIxm9s1LUESLV8NzCEq%2FnQBjqkAa0pc6N3NWxCKlgM244TvHIjnF7n7%2FPpmDRFiyEj8pvGZest8tRtXADClM4g%2FcAp9kZcsTcu%2FnNkaUWCoYgEakqR3AZNGuwaLBgZ6yh2rVfOlQiAJeGpw9dPwSlgBCQaXzONO8wUXuzvW7qjnmX%2BoO53tbaRFNmMb0dMfn55IMEaFaXqvr9XqOu6DRYNXDZi5NiyJ9Lp8LuBYhIEbLqTZBmqs0ei&X-Amz-Signature=f2d38e6c632efd73af4d851c28767d128fe92f9aad6738f903fc39380448e1f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y3535JDU%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T045959Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCvYFEhvaTVWTuXbRkQglJoZ2hv%2BsatmJ77Zjyr5XWZfAIhAILAtzWM5WcsO0AJjSQgpTkSM9D%2FXYVZgWPJ5dJMlTG4Kv8DCB0QABoMNjM3NDIzMTgzODA1Igx0l01OotphNT%2FfsfQq3AP9qAOJ1%2B%2FoYgJYlJtsegvMSmoRH1DsmAbNXR2BHYJ%2BrD6NO1gvyYkZSwzXWBFudpPLIjtFNp4J7Xv7uZx5FeCCq%2FEDjRJVirOVkOb0%2FLOAJGc0cpvnXBGvbvoDMw7AYe7f2A0ysMcgbWqqtmWuJjVUj1OCefP2%2B%2BK%2BgGhOKVXtATkz9cHocIMv0vzRzoKkq7YScHUJF9mBJP7plqD56QVnFL7mTF%2BsAKd8ylD5oPOF43rdQ73%2BJR3yI6SM5tAJf3ndV3PSbq%2FAZyhqPGzaB8Gg%2F%2B4RKS%2Fv%2BHd9J%2B2f7BEY3P3FzjVPebXhMht0FXIzVN9CnO3EloMA68Fhr%2Fobw9jWrEuuPqI9BOs8yGsqUx%2FfDG7vDdozM6sXmZKmIehCDJGD8pvmCxxhGreOGw%2BvZ%2BXFT%2FGxOuq6g82hx6T4SNldpl3G%2FQjPZS7CUJSAhAmuGT%2F70G2N5xWfN68gy%2F0Fxo2n3Fc3vPlXViSr6zwEjQnZJwxjVZLauxbeDspKkXdiYVUdeQuqc%2F4E0ZJhLLvyeanGRMCtLnBj8S91Gd468nz%2BjT0wq7rwoUGUivncjsgdCC41zS1zjCJBKN4lz5m5Oz7kxPKnbNRgrAaGEsTp%2B%2Bg5FvNJns6kAq14VlYdxTCKo%2FnQBjqkAfNW53qyApis2Cd5zSnpqfW%2FJ%2FU4J43R4yxb9V83qbqN8X%2BDlt7JujGo%2BuonHwHC6eu08xTMDjJ00%2BKGr1YofIBRe0X%2BTEuRCDgDRZY2OqPo7bopWjEDJih%2FuzmVhYbPYxAEVoH6b%2BkDMSSxQfJR7EdinKbA%2BFpYGCnBQAyThnl0Jamkg3RbjaWe7h8XJLnDbfq8DHUAOpISIbmPr25COpNY5mA1&X-Amz-Signature=8f71d4faef20f2881bbf6867527d51e2f3284a7dad0bbfdada881796eb1d4797&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666WANADED%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050000Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCjyzDr0mCz13BpGhvQsIdfoqMZqU28BvcK5vETUI0cKAIhAK%2F12SIPqkcbZIWYe9eJcTVpwodVj5%2FtMEXHi3ruuT1JKv8DCB0QABoMNjM3NDIzMTgzODA1IgyPRh6nfvlYpXoU5lAq3APWDklr4TySXFy8Xs0bT7Jejkr4p%2FKDMwlTQrh%2Fa1A4icb99e3Fiha9rWIXskdrQov3M2yD2gPpi9ql5SEyTxZRYZ91cFga4a%2B1jYzVi8F12WMmAlK5b4OZePyQQJ3gTg03Zm0czVtMU95MFT3qUxkbubIjtlpxfKlhljpQ9abQ7U0xOeqxvaYH%2FjFz3%2Bw1HwPMRa0chEBIUWIjhhf5LDrIDtOthh5xChluSQ7xSV8w2AervqSqioKyZFEhk3gKHoghnZHkmc944GSPFWp2uUxudeuwp1a9uI%2FIw22tyI9YyCscnFgI3uC6Ew%2FpaMhJQv1IqwZ9WyaH7Dyf7stw%2FSWYb%2BsIiJUSRcwH1R1vDtZfMVrTSexqoz0D1Kj594crEDO1dlMrSxKPhZEYiWezkxhJNMlXdz4lxrQta8ZUTBFWyefK5P50MPsheGKo6m3pIeFeErTjP8EUm0F%2Bbn74NCVcUOcIkdyo5EunYPFz80gGHXXzNlDfLu8WB9g9yst8UJ4mHamnOUporw0zP%2BDLglpbyj8JOg1eC0%2Fm%2BoROMO24NqHxLfE8YJtvrqZfEEkLp6nrObkK9CdbY5POV6BEsuIkGSbfvkuRrl5hvBba94G9Wc6jPJuzxtCP87R5eDCYpfnQBjqkAUbDDyovR5HrnJbeAQJoahlksS%2BJ20BWJpDr1AIy%2BphE%2BPG%2Bb9U6I7CpU3pCR4vh8asuJ8KINteQHLmO8CMFdRgqjcZat3HF4G7QgeY6IkxWR0X2UYiFpv%2BFHk48Kc%2FI4f9Ya3YuBzNQbiHMMdVoYEblabhO3Z9CiXuu1ZzlDaUaxM1uWx8oR4lomT0m%2F5tJElfhJc7EfLEmNOXba25y8R9bqlmX&X-Amz-Signature=0f7ab5c3f81756bb1546782a3a2ad3b2f7348d8cedd8810ff6decce655b2575b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZDC3PHGQ%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050002Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIB3HUaX1XVBRJWzBygYes5YO%2B8JYp78X%2FWJiw4IcFTMNAiEAzB8OsDl3HIe7tzhRoaN8rVP4%2BjyNElA%2FdmWFX7onhvAq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDJMCla%2F71rCU5DA8HSrcA9z8ibVBuN8jIi%2Boj7UALoanJlF%2BTYe4uUyrEAx%2BfFE3kHj1%2BWz%2Bl16U%2FHYozGeRL26pIx6BiJO%2BSQF5YHN8MCSjvo4bIW4ivITen9w66VJVx1hPVg1loiethqL6EmStzDrW4WCT5NnsBBQkXbJ8ceT5ag%2BLPCqplPAocZPbHGPJhZ%2F70RmRVJ8DZCSk9%2Bv6sUUuZYyKgOl5%2F5yIC7p1ofd9aqYXAi6rMKp5%2BiiCfYaIET20XGYC5E1151U0S4iXagynZXrFMDMECDI0iFtG08jrrkqjTuJhc70vn5D77MfgM3PU9a%2BPS64%2BwLLjYHFQYI007rUJNDsYqiA3%2FT%2Bc1fh6VOMxrPngSMiekGhafdzuVwxx7PeVP3pG9D0g%2BjfoRIK%2Bb74qNSvUsHkFOMcIBX1fcrWurnSVyeXlVJsOWV%2BIL9XahYy8Cpbsdv%2ByzoktvMKVEfkKS6R9qKGftAZCLOFO66pPbQdO2hWYewM3xctccGD9BugfCwKniKt1qqaT0rqkZnJ4s75I%2FMeOfMNVO%2F2H7WSrRh5jiPx%2FyAOiIl1XPYQd1qjZqRr5z3MCa9NnGWiYbavOcO8sDfg38rdisn7Mz%2FfLaFtiprQGZgaYcKA15a4bSCvR8s0z%2Fl5NMJ6q%2BdAGOqUBwgqNW%2BBnyiRr6oe19z3KWbvSC3iFJSdYcTw1Mcnox7bjjH0XBepbw4ptGRBd%2FJmiQ6aFsbPfNRKvvm5Lm%2Fkud54cqaUZicGK3TX2HVnfdplr%2BJWGBCVlDLIu0VHmc7TqsXaQj1dwsTr1xsl%2F6NTbnljrnhyyNOIdeqje7V9ZfZbCFC5%2BuCGR1hAKsmYYQazTWrdwmF7nSn6UdOmkkwrel7jMVl0d&X-Amz-Signature=24a5e6586bb5283f6e6305f7bfe1e6d8f918af83b4aaa29bb2b709511c03900b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QMUGIIIL%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050002Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIETmtHY3P0JTA%2B%2BbDstB%2FvkQuQG%2BfcrcJW7pkyOSM34gAiB0qx1w5arlBMucjCc1J0WyM3WgO7kxPQIMpb8LmbSwkSr%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMxkq92ecHl8bQpzAPKtwDyqKEd1mSGEXJqF7xGzexbCVIC6cgqFjWXHgh8O6Nvvfh78%2F5U9axrP8OoiKtj1A2SgZJjDr4Oj%2BU89M2zqRBXv6sfJzxvbH6TuLEwe33nOVhoVqGWCPyuVJgfTyNTAFt1bCP9qXd8vG0l2SYyNVom%2BYesrwvIUBmK5QzutuLBgV4IkGFwzS9GCocUNJdJe6ttkzISnlkD%2FLAmFtN3AR2k%2F7mwh2t2pGhn8hk8cvXnQkOOEw1txegJSRDmKb0VOumJY9JAzpNcfzw0p31hxPUXNo9FzaUwboWG0OfF2QQncry7eovDxWAgmtvKXQ9d5kP8i8lHIxVbaxVAdsUGnbNptsegUNY3aQz1D8gSy7ILRT8E64rD%2BnqJEM9Nxde%2B97EDVIiD0X2KXbodO8cwruFHqXJRavN6Gq%2BgDSPlpaMahPDQmkIxHxcEgc2vo1Uo1dxeMgFfO4BNDFLqIzCnlvZLXTKvAMgAmppB9n%2FBUDJRRSNN27RVtsCdBwFfvlZhy1XE1eXL7EYLy19Kgx8Rzf4ybqR9GsaCpZPaxlzMQaIeFBwLbYBx4RHoV4VCuzun%2FIm9672gRs8MbHEHdbV5KYezX2qkGV1KCSEW3wAsMr25RHFNqsN%2F30%2BtnWP%2FWkw6aT50AY6pgEd282KBoxC2SCbIam14bZx8a2iyRJWEtG3tHqexJxESH75L3cbh964iDIcR6QnG6zCK9FX8thyOpWNa4PwUeyAVl9v21DttHeSAgRsEbxgHFwQXGVv2bbVRU8FDHjS6ACNhfODjm5WWqx5K5wi2TJcptQCvSz40FrVmRcD8n9%2BBaOqNEdF1adYwldK3U1A0D08ozOxeeJh2jkVQMhokIZAQri1HESf&X-Amz-Signature=e607138f790a95b2a23b803dd534c161c9c41aa8c424123dde2e2f4ec021126c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TR3GIZXY%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050003Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIQCVOIA2ghK9DrW6pFsEiBnBybuWtgKGrTe6IacAWeWWNAIgH78%2F8Sa74o9rSTEWhALv0zcFJmw%2BBxFB3Kvcuh72Uckq%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDKgjTE8TUigohusFbyrcA4vQzvgL6fhrJlcDYo8APAwdkzc2Wc1bHZnUWrJJzwBLCs4pAOB%2FShPDR0gl5kHZBI%2BcxJj%2F7BNYQL5S0dcvlk1a1EoIGlxq0yg6V3KGKyQnScQLS1CZYfAx2PJtK1sCxxa1Io6Xtb8xkCB4kWLFppFND08PJgF%2BF5UW45iXDvICyTctK4G6QTewsVHFMboIIJuHZPhGx4J85WeBgXZyXQ90b2xtEKTLsjnil928s7biGooPfUhvqxx5W8iBFspniZle%2FafGK4%2FrIYMmm8%2B6Rh%2Bk4nxrjmDC0%2FQ6kDZQsx2K33Z%2BN%2B5tLGGsaPFmKnLrGzJfpliTwya%2B3khGdAI%2FsWHH0beJZLbZDapGeDPX4vsOJhMeaE1bK%2BA%2FWpjT%2F9sedx4P2jzLr3RCJhAm6BilhUMtgHSK0vAEKogDNvT6Fv6ItTymYu5TS8yMyxpNrfSilvknS72x7AjwbdTjp8q3dUpKuR9EZImoj9WUns26RiOZ7egXtpyOJX7cvlnXiI1ekj8%2FEovSd0INmoAQfdOLcVb89d6HeWvYduR3r7v5XBN4INZ2LPzBPQYThh2HAftpr1lz8YU0EkO7HXJEYOTaj9G5U1uUTboKJfGRRdx%2BctjrnmJF2POCQ0or5pbPMJ2n%2BdAGOqUBb2pqA3cxDtzl3To51u5Z%2BUMFubrvzSbmviOC5mgTeOfwrXn%2B8GmZlUxp1%2BHRTpq8C1o7FQ%2FS9asyjkhEG%2F5UiCzIKNHc0qpmXCA28ZRWebQOzZVasjy0QmbKOfMARakZ9jHHHFxJdStNLMHVi0tIfAVXHlvr7QJSttm%2BRjUlpGPGJ4JBPURYcb%2BQSZcPUIBiz%2FHs68T5EmauPTrtRJP9yYsO46kK&X-Amz-Signature=bcbe6edc9965c7ed7edf3886c9897ec3dda976622ebd213394f5b235f65c3c5b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MQQONRF%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050003Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIFw%2FuTw9Xvi7uGzyZGwcp3jUSTmgRehPmcKfQJafpti8AiEA0S%2BXLB4QlG7Z7yeKwRCgCwgKTlMYzdbAD3EKonru6E8q%2FwMIHRAAGgw2Mzc0MjMxODM4MDUiDHxIUWk6lubXpAwyuSrcA%2BdAm6nM2VbQWJGXOTHV77BUTGIRV2I22t31XJH%2FKSdnPEEKL%2FR5HxFFYBvWVeGKXVnLqpg9t%2BDxZ%2FqgqI0aAbNsaPQjDAW6VKmMb6y45uVdw%2F7htFyyYYW5TQWAVXHWMDGoA589hS6X3gjI0%2FyJjawdnBTqplxcy02rX6l1JeyPdyPYayZ2YmMXRVkfFx1v1pVhhMrGLas%2B85HOCeKfKFCdydTzR9lldNfWEf%2FO5HXlKJgzaybnPZFuN3AZLh3jjcKUlSjdogqpmhmSlJFoTd5GII07kJ0FQUMVy96r3SLa6I6KFS7UUm1pLM5lgFx0vK2QTVCGkyGnJTpO1KP2FTI%2Bg4gTp32busyd9p0IW0FY3YMK9bk1%2BMjAmFEvsDoW9AgN37CWZkhUe%2FsesNvU%2F3wX74w0mALNr0eItrh6OFN3ZbWWvxj1K5xZvEzKSGy8XqW4f22i%2FAascjCkGD2UsYaIs06zBEMzgOOVVKk5MvRIG8cu6v8b1VTB2jlaEvGF8%2BfLdX3GrDg%2F1sW9Y52fRATmPgyefPc0%2BuPNiq01n9Nhd8v2qm%2FsrYvBBpzR4lJCwQpPJ1N7nk3w6vCTsSGqtaRqNJwExyKcKLEOdaijClvKAKw%2FYY4MkfU4vNyZMPSo%2BdAGOqUB%2Bh7rKhQwtpsRoaZgTl7j%2FlQwKBAgy9fnOAgSv7zM27QBeOHtvkzJFdJUo0vbFWRkoT4fGawcx9DcxCx4VAgisULnQTMlB7rUCvwaofqrIUKrsizmGVyGrkl1Ts3PPDqRnY4ruWWccBGhf55U9ezjAkyJPUcGDjZsATlPggQd%2FL4sfrYxcP1bHyCFh%2BITXAzJMQMGlOhE8iGbpfrgr5VnViDLHLvi&X-Amz-Signature=ea451b2504040229a20a3f7dd2be5f6d525c62d72a5224a54063b6f497c9dadd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665MZO2LO7%2F20260602%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260602T050003Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIG2EGJY00YkJlmV%2B52R61vNrUKVV1M1jmjahnQuDIGvNAiAYHE2s8zzzFNUqnaNQS2EfzIqvV6HhnflHxt29XuwLoir%2FAwgdEAAaDDYzNzQyMzE4MzgwNSIMkjI%2B7Yi1RktAHNerKtwDqv7Je%2FqtFvCHJw7I6%2FGNeNtSMHBbVlhnNjvoyaXb9WIXA6NqXRhnY97pEsy4n6JHWIh0lWegLQtdT8p8kM46XFoSIhIz6i2U6jlppv0TF3wbz5DT4XvNTZQXk70QaePCXjmLVnsiTLZMNuYg9xWm%2BfxOg9JhPNKAklrT0gHYaZ8Di%2BE6pd55q0kCSZbUPiHPNblIHZdVM5V2lp9kSMOpempbNKL%2BoB3QUrJLXEHlOMGY4Z6ziuuj16s0zq%2FK6GPtlUal2mhZNWn49D4kcnuAMGNC0jS2YF%2FlIdVVzC5fRucmPpcaW7EfRNZNfgHg58KIhguy%2FOW72N58Zt%2F6WBtkB9SFlkp5cUdfufXGBM0I%2BOwh19NoFhtmQFUPHt2kUj7oTN9ZNtWqKvo19MV4Q5nG4ddWSQfBXJOjxdB0l4TXVQO5XMc%2FDP0rYIMdaAkDtUpJFAIB83qa%2FOlxS7U4JU4i%2FifDGWOAuZUAOWQKwLoGPVKzR9EvZqZLUTBlJcrTeJUsudIQpGZBTtTfBw6EFV8BshHHQc%2Fudfkd5CIEW8z%2FwOgEfbvNwJctlAvxhEcNl3fpYpaCgJFxyf3G5cw25JtPxzdXg5PsxHUaJtzZUQnftH%2F5QV28fxQ7VkCZbaIww6j50AY6pgEwFS2iaAt3c6D4K7NDAd%2FyoBAVaD3auFLWqo9OpMWNQZrbZa2rknSTaZq%2FVQVdFnJzPv%2Fgtxwo%2FPwKgyajp9PltBdocjYe8Rg6%2BO0sdja7LM%2F%2FQjq47Mu6cM8OtEI0xLCrOVYqQHNwV9qEiOYkcnC8iLoNy4ynRUwDe8zkiu3%2BsTgH64m%2BopBSQZM53lYGp6KHYG%2FXljk32i%2FpJFY7QV5KFs%2FZ%2BSq5&X-Amz-Signature=1d745cb3856ec789095ed499e854998ccecbde9fa885e76f8b3e69e4a0db4852&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
