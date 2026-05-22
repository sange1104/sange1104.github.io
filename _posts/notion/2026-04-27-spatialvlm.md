---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666IID7FVD%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJGMEQCID1xV4Ajd3zTo6J%2FuOYxyb9C707brl206mrN0GioiX3JAiAzvh4xoT8sE1iHt8PXNfyc3S8BhZu46TONSoxJWt4sNir%2FAwgWEAAaDDYzNzQyMzE4MzgwNSIMpZjvcED3QtFUMJ6EKtwDIkhU6GEf2aiKBbY8MehSa3UhhXfM0970RDsEtmhzwB%2F5Gw3ynI7gZY0ZA%2BXvpJOnc%2BnThWN6rT2Flg%2F4Z2E3naHlOSt7q2By7PE28UDdnPviT5m9mQHLfc368UWI0K4nvVEaHf%2FDeHbNfqOiEn3tu%2BJoo8XRflT07nNPsMl0R7KKyj%2Br%2FSDbnYejPB%2B92hyzz881jqED8WOeha8TzK9H7Qofx5zpAwjNm6fXuYiJ94dXw7RCDm1%2B6gxS5WR9sINyVXnWRN5aJ91uQhc4%2FSlpXgRJ7dEKoKy1ZVJFLSl36BoTGHSQpAc0b3azqwzt1mtY6KTnB5gIX0t%2B2O2x2ADCtF8t0LD7AfdAEzyppvWrZD3SOXsbZx5lTC%2Bxo6ObJvGeYhQKUi3cnDZ9%2FWxBIEKs1UZ%2B0wTgBVZfwZe8eHm%2BgLmpo3NiGNULPMBGG6PaYZvz5gAjV4N9pHHx8iz4x5g7RkojVW0RsDhbFCd3Vao76BJ4I5F79VtFxLUoKE2I%2FwL3FWxXwzasEBsyoueWM3CxlLAU8NPZ2TTE8EGmdrqQcF%2BrDbWZL3ZoHmwFGHunHiSfQQ3PeBDbfF4e3RHqzaXllCgcht9Pd6WCqUg748FfWCcZvICatcw86t%2F5bNYw8bi%2F0AY6pgGKPQUOF6I5rR%2BolpseBhW%2BE7tcPjf3yGVLkgPZ97nSqjrYY0PFZpF%2F3tCA%2B0MByhpI16%2BJGlxtIc0VMWU8bpbYEbzkRkHuey1%2B80npUn%2FdWwcJ4NDiF0qWPSrCpfL24lxsK%2Baw1Kazt503yUKrAI1tux7oAK59gI%2Fc6XWEXGy3aOhtJ57Rz1NVCXKNPDUfh5m7%2FhHNTfRl3VgN8HmQqkhKfm9pq61w&X-Amz-Signature=55539694992ce4bf6f7edfe5d3420e02e87d8166b23ca10da1e84f7a1ea85a27&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666IID7FVD%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJGMEQCID1xV4Ajd3zTo6J%2FuOYxyb9C707brl206mrN0GioiX3JAiAzvh4xoT8sE1iHt8PXNfyc3S8BhZu46TONSoxJWt4sNir%2FAwgWEAAaDDYzNzQyMzE4MzgwNSIMpZjvcED3QtFUMJ6EKtwDIkhU6GEf2aiKBbY8MehSa3UhhXfM0970RDsEtmhzwB%2F5Gw3ynI7gZY0ZA%2BXvpJOnc%2BnThWN6rT2Flg%2F4Z2E3naHlOSt7q2By7PE28UDdnPviT5m9mQHLfc368UWI0K4nvVEaHf%2FDeHbNfqOiEn3tu%2BJoo8XRflT07nNPsMl0R7KKyj%2Br%2FSDbnYejPB%2B92hyzz881jqED8WOeha8TzK9H7Qofx5zpAwjNm6fXuYiJ94dXw7RCDm1%2B6gxS5WR9sINyVXnWRN5aJ91uQhc4%2FSlpXgRJ7dEKoKy1ZVJFLSl36BoTGHSQpAc0b3azqwzt1mtY6KTnB5gIX0t%2B2O2x2ADCtF8t0LD7AfdAEzyppvWrZD3SOXsbZx5lTC%2Bxo6ObJvGeYhQKUi3cnDZ9%2FWxBIEKs1UZ%2B0wTgBVZfwZe8eHm%2BgLmpo3NiGNULPMBGG6PaYZvz5gAjV4N9pHHx8iz4x5g7RkojVW0RsDhbFCd3Vao76BJ4I5F79VtFxLUoKE2I%2FwL3FWxXwzasEBsyoueWM3CxlLAU8NPZ2TTE8EGmdrqQcF%2BrDbWZL3ZoHmwFGHunHiSfQQ3PeBDbfF4e3RHqzaXllCgcht9Pd6WCqUg748FfWCcZvICatcw86t%2F5bNYw8bi%2F0AY6pgGKPQUOF6I5rR%2BolpseBhW%2BE7tcPjf3yGVLkgPZ97nSqjrYY0PFZpF%2F3tCA%2B0MByhpI16%2BJGlxtIc0VMWU8bpbYEbzkRkHuey1%2B80npUn%2FdWwcJ4NDiF0qWPSrCpfL24lxsK%2Baw1Kazt503yUKrAI1tux7oAK59gI%2Fc6XWEXGy3aOhtJ57Rz1NVCXKNPDUfh5m7%2FhHNTfRl3VgN8HmQqkhKfm9pq61w&X-Amz-Signature=f5d7e5b90ca835d3082c22e4969bc484c0a68fe43b1d042db383af61dc2ce9ad&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666IID7FVD%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043445Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJGMEQCID1xV4Ajd3zTo6J%2FuOYxyb9C707brl206mrN0GioiX3JAiAzvh4xoT8sE1iHt8PXNfyc3S8BhZu46TONSoxJWt4sNir%2FAwgWEAAaDDYzNzQyMzE4MzgwNSIMpZjvcED3QtFUMJ6EKtwDIkhU6GEf2aiKBbY8MehSa3UhhXfM0970RDsEtmhzwB%2F5Gw3ynI7gZY0ZA%2BXvpJOnc%2BnThWN6rT2Flg%2F4Z2E3naHlOSt7q2By7PE28UDdnPviT5m9mQHLfc368UWI0K4nvVEaHf%2FDeHbNfqOiEn3tu%2BJoo8XRflT07nNPsMl0R7KKyj%2Br%2FSDbnYejPB%2B92hyzz881jqED8WOeha8TzK9H7Qofx5zpAwjNm6fXuYiJ94dXw7RCDm1%2B6gxS5WR9sINyVXnWRN5aJ91uQhc4%2FSlpXgRJ7dEKoKy1ZVJFLSl36BoTGHSQpAc0b3azqwzt1mtY6KTnB5gIX0t%2B2O2x2ADCtF8t0LD7AfdAEzyppvWrZD3SOXsbZx5lTC%2Bxo6ObJvGeYhQKUi3cnDZ9%2FWxBIEKs1UZ%2B0wTgBVZfwZe8eHm%2BgLmpo3NiGNULPMBGG6PaYZvz5gAjV4N9pHHx8iz4x5g7RkojVW0RsDhbFCd3Vao76BJ4I5F79VtFxLUoKE2I%2FwL3FWxXwzasEBsyoueWM3CxlLAU8NPZ2TTE8EGmdrqQcF%2BrDbWZL3ZoHmwFGHunHiSfQQ3PeBDbfF4e3RHqzaXllCgcht9Pd6WCqUg748FfWCcZvICatcw86t%2F5bNYw8bi%2F0AY6pgGKPQUOF6I5rR%2BolpseBhW%2BE7tcPjf3yGVLkgPZ97nSqjrYY0PFZpF%2F3tCA%2B0MByhpI16%2BJGlxtIc0VMWU8bpbYEbzkRkHuey1%2B80npUn%2FdWwcJ4NDiF0qWPSrCpfL24lxsK%2Baw1Kazt503yUKrAI1tux7oAK59gI%2Fc6XWEXGy3aOhtJ57Rz1NVCXKNPDUfh5m7%2FhHNTfRl3VgN8HmQqkhKfm9pq61w&X-Amz-Signature=7db0e1fe4cc1dd44e94fb5410acccbfafe770870bb0924fc18495c8b15110027&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664CHMN7Z6%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043455Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIFzvBrX%2FEr9NbTJpJWHcfj265EDSikVrkxlJM9iq3xZvAiEAyAjp19sVyK6pIkRy2NBbp0FYF7GX7RdBGUIECbs5Cvsq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDHf1FGZ4t40xvQwh2ircA2xOcp5wrv5y7FUt%2BRSF6is%2F0ZIw1bcLfHza%2BCcy6To9KR%2FQPKSkJJIUdnYVRgTfjjZD7aIh3K%2FyUrUR7bjXJv0VWPvs3Xq6yCcTK4XL07KfjgvrNXC7LtKt1TGHihe1I3aFn%2FmlQ6pcq7PBQNG86eP2aLvWb%2Fe4nvDToxFMfatzxFwOGVrU9kmVJlxk1cXEikrIjDb99Vs%2BpTjDQKHda8ay6miOC1u4B70c4KJLrjYcD%2BCkgn%2B3BvN13Y4%2B97u1dIwluD3Uc%2BJcfJVbse%2Bs7kJUhh1W8qFMKZMDhnpq5His3aQU01b1DjhcyU7VsS1kaX9Jis6xrczn5fG0pz5hYcCecR6RV%2FVVmXXtujmHATCEkLyrvXXHSDlNQrmTmzvIy6XzgiaY81HgnBatSxGtR4tNWgGXwCnY72%2B0QkPbNRo7vw3QCHU3uwDD3oLq5QLRIXRGgHlZrNi1Hpr%2Bg5HKXS5D3L5vXbxUeDe8u57%2Fsy%2FW9NZbPbCqZ1vre5FFEv9hcllXLUoC64yj6rXShwK1EFF942yu6sgD2EVxPTRzNCbL8tZqcmTWjOPjNCOjnQP71LdbCuOL62Ef2GxkKOcWj%2By8HdjnX90JYxqgndsOhW%2FxjX0w%2FKAP%2BuzUlAPQMK2wv9AGOqUBDYpJQQMNl%2B0EXDY2kZOgIQ%2FzyJ7ESn9NahexbhFBZDE3BDfcLDVNYxGxpGOWnUIEXWB1OFEAAQBMCxBuaMAF1R5Fs7pGDlaFfg%2FNr2MYlg9MmFfuWA71OvmD%2BkUMdlLGt%2B78xd2EE%2Frb7a4KmemYVN1sIpR7qFtDkSPQt9cV7jvGWVRT8CFZmMBwcAJwGekneGwuyBVQqKHcAxyVGbrbCsl9U33n&X-Amz-Signature=5b3116968334e9a62e44e97a918212b3f6055eee71152b6bf003b1396d20eaa2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXHRSUOG%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043456Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCID%2FXDre8S00jfqN5LJyu2b0tcZviVp0jePvzRuBnEkmNAiB0ly99oaDwMQS%2BSTYwpZXd6WBVJXpKm5XezpfiycYzPir%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMzsOw2IDj1Smcl5%2F5KtwDihTB4%2B6iGnDWkwdRwI%2BYoDHjozKnxn4KUn1C9mt8ICTdSlJLR27s6uocioURSdsomY%2Fhq4x8toGq1fH1bskjddCpFYz09vJwvVp9KX0pH1fphqeQP6b7QIQt9u2UeuXRAS57tmncY%2F%2BQWI8O%2FcB6VrKDpbI0oQg9Lf40nqeK24X4EMsdHHN4HEJRYOQWJeWat3DpIr3o2O07qy%2BoLTcapXtUbFHFSWb792ADDKAVhV55qxZTGh2clf%2BeieCorlUBlJ40n0yj3Lk3sw6VuQKb1enSSqblFoOsls%2Bcrwsle5io59FVr8xIf0bILf8bfjR%2BRRFIBsvbePzmy9YJmVISprDUfEnAAB8YIWHtAahhtYchmDXPB5T33Xz0QeeYoFtkuvzDQsiTqj%2BWZXVyqRegZ0NaBu6W1Kg8seUW%2B0hFB7U86fWzfGi5lowg9WID00PKI29MBQyeyIdLSgSnwN%2FBRNsdZ52PPgtyxI9qLkR4vksc4RKv9KCGMBUPaxFKJg0Epxgx611E7JBsbH73Qf0R4Zaz1V3vgsbRk%2FAoMc5BcgjlH9fbChnMcuh7XMxwCO9pbOKBoEY2ynukAZMTXCUsnZJgw4NyrK14dLtSfUn8e%2FywqOLX%2BTwk0XohpykwkrG%2F0AY6pgF7qyVFe0XQPQrJ6CAdFY5ssbKUDVSi%2FiXxkQsJuhN91Y3NzVzBzMEPiGQinPEii95C1Gazx4QDaavHWee9W3dm1KnCLGF4k2lb1AKTotTF1VB515hXr1JoLhM5%2BycO6yJ%2FuWzkECJkqP%2BAfVFxL6fcZ%2BkzXurQL1csW7GKoiNZz0P8DZXbi9UpvdMmnj%2BcA%2BO4Pz%2BwgSCtmNmDKJ%2BUo5o3ySbFGlws&X-Amz-Signature=99052302317548259bf71e90bc28104454d0102f5878b4a4ef749b33e99eda64&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZV4FZLL%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043457Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCIEjom9C97lhs0D7o3uuPzGEq5IRWnL8VNOZusF2elCttAiApe4KELXhtl8evT%2FH7SvOWxXLY1PLpwsTYqtRwHFirnCr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMENZYIdTCRMt6w2ZIKtwDQT2UC4%2Frl4IdrAknhh8nyiFIbfLklvANLA5Q%2FLwjtHno3JIWyZ706YgTmhUIthKf2%2BkWBhNrJCORsf3YOMMi372%2BXr46uM9aTBsghdH4SErQMwVIF6t%2BlRVsMEEU%2Fi58zx4WHusXmSkLTfD27htB41kSERizsQBzzwXVJpo%2BnG0Sc%2FXawPnAOMycmjOCuLRKv4pCbyGugjTysGflaoccO5D9X8rgBtXbllFxr0O7ZOPK0E2gR0OzswXsB7MOTr2WYi9ABWfUTEWYCGcNYDDLTtZ1Xv0FzsyL%2FGjBaHaf7XgLdzOE3e7mRtwU0cgV1n98lhapuZzOOHlpL3e1oA5tbAmjH7B%2Br3HEFXrtfjYaqIz8%2FXdjM1k0%2ByKf6QsEiqxzcmrc0O%2BXL5aCSNsKV%2F0mTc%2FQBbUcWAPMOM5%2FLelAG3cPakc%2FbRxK6nD%2FjGiypUvnkH%2Bcjpu5m1Pfy9IE4iS0drrKqjvlSTjWxK%2BE1rTQVG6njnA%2BnR8FICPs8i6ewnZowKDKVbGC8%2FmlNxjDmtmM98sSDN3aoh7oD474fOC1ZbhU6Bf%2BQIFjM5quS8DWE1AXO7D8elu%2Fuc36OccrKriv1qwVUJLaGM8JxnE0ONFpaGaIlCA%2B5zWL1eyWopwwwrC%2F0AY6pgFIokvzqdOaUWWo9HvbmBJh7fmDZwgsoCHANF9TBqhXw3oEO2R3rG0e6oWQD7qIDBg%2Fi86kDf5ja0mfwF3ig4PTg7xlRsbgx9sFJRs92FMx3nOdhf7jplf92jwtCbN88sabgHmzG%2FuPQh9LOIVg1rU2r%2BmSxL9Kg7dPVB5FzhT9GXll8yzClq%2Ba3CLy9DGp7dHvVgFhJFeBVmLHegsU45zB8c0Eb7KO&X-Amz-Signature=e1c6958746d3fa7f97e606ebcac57200cb83a453ec2dfc9b4ddee9a9b0468b5d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UPHFVY6T%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLXdlc3QtMiJHMEUCIQDNzPZ2Zgfx8rqJQyMkPJ%2BpCE3vOW1AkWTytMkUZC1jpwIgEIxHetO7zHHUxhmJkYVppt0bFL%2FftYUx9pr%2BZ3lguZgq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDIqUxDaTALQcG8qDnyrcA3JfdE5T9Sp1JpmJIYSj0eRD8T0LR2DfTWo%2BvmGNoNcxkQwJSsV4EpU0iHxSZR1PlT0pEVIvE26fmg8PqKzBpl07TQDjOtipISTJSgEfTo%2Bw7%2FBEFYIAvpco6WLDIDisYREtdRvTElHYmsFbzBBkwqVsMyvarElv6Z4ur8ZRBiZNxZvz3DOANRlsUzGsabf7J5vG1BubWCU9mTshkU6U1gwBllu84CFkueLUYjVjnDiRpJBlfCJujHb1AKQ1q32Gp6Xmf3A2NoM5LTAzQ7qNl37PrzJSBgKqNcUNXsHL2UItZB4YNU%2BfHZ2yuyKwZa0i2qylLHigZ7rfayduY%2FsFb21mkzUAoWi8xUXsx0lXXZxrgL%2BiZX094ZxfRmqDmQV4zUXTBHJYtsQL3txnb8wtuBgI%2BNpBKx%2FsVVx7ShNQeA1o19Cc0WffJrC8GAyLTwDWF9lrI8Ompkps2gG5KRcMCLQwmzNi1ZYcC6tSMgepukjV%2B5llT1MPaTBdlv1DEYqCbMeAb2uGIyAlNzjD6Pca7%2FNGxJmWOoy6O6nYW5gOSp%2BuSRTTmOIhcjbZVT4nYZGBBXFbuoREfWreCE9VaGtV0b6iAUlI2OcHb3bdL6luIItsqqV%2FtgXt8JGVhHivMJmyv9AGOqUBh8a0PSsqEu%2FlSAZXQwEHXyl2arpZ8bGbtjulpKV47ujhgmnJUbUSjtFrbJR6SU%2FS%2FFn2GSnKJGA4w0kHgIyAOGpdqyFwn5P366uwRSAKfysjlVY5x7QXtUWpxl%2BtmSYH36GoqfIHbe5gAnS1chJ%2BuBQ9Jk3weghn9CqfEV3s2WMaHeUUSZNXdrP4XVl%2BRnXLvwEAfPOofqcsH18s%2BZM9mATTeueY&X-Amz-Signature=799178f1b79d0914c7277e28c60fd5b9530188bae7a3365e83988a2ab8671ca4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SRJVXEHB%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCIHeCLDQqKyVU3prjoST6win9GZma4xBtlzMe0R4eicaGAiBUxHRaTjR%2BI7JoLE4Mbmi2wNo%2FkmWHJxlqwT8%2BhSd%2B0Cr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMNgOG6IZW6Y%2FW09pQKtwD1UuYfd95mM%2BgxEO00uNTxsRxVYabXwb0wtjbf%2BKfipnIPqbDGjvwwjdnEwIBD2gXCe8ZyAVKuyqm%2BQd37U1jMS06QF02KSGBYspKY2ITHqrJKUloaB3t3BVjPvrcZL1nhbvdgZ2E65uNGLkt3RzIl71mfBjMXxecdlFVGluAZGkyzBYvU9dj7G%2FfxoXQblx%2B1y9y1hwIWS5rfJjFcEFdjJQuOgT3T8SSBmqje%2F5O%2BHXRg04qaKmSA1HIk0dg6w9nHg%2FUV%2FfRgWnYTDjsBxbXUWvdm64Cr7xPYmH%2B1jnYV5%2FAZO3MQJRir0LvSbzrHtgJOWtMK0dFru%2B8ZKsHDH0EzwUtuRIRQTmzH2mt%2Bb91Ic8uH6g3cL0aJQ6cIb1Gp34TR24OoydYoAx7ktnRGikTooCkvy6EUuG744qostIw5KIhljCTeck9m122RM7qM19%2F%2BFtHMlwlEg%2F%2BzkHdaKiSKruTfAa6P5m%2Bkb1AiIT%2FK6Op6Z3SQ4cYa3m5hV9Gp1FuYZDhvoLA5V97c3kssgN9x7ZCRm4b%2B%2ByTE%2Bj2qhDuCR6wZbwoQhqbc3AEzQy5cI3GQm5D5h2x6YNvj85bcy5%2Bo0xHcAz5pd78X4kuCtODwla23LZi8m%2FTGucx5d4wxbG%2F0AY6pgGP0ypMcFduoabCDuH%2BVsswFJZPUadCYLmS4Ztsp0Ce8hNiscS9AnsgXghDSFkeTiXPq9OLP1n4XS%2BSXO%2BpSqTyccEl5Bav9vOMXp98AueRIumZKVDrEfbsXWNcUT%2FsYAwCQXD9seco9Fz8OiEKVk7YircSJmw%2FROPkmxeSp7jJb0%2Bl3JATA%2BAfZ%2B1c%2BMcqNnRpN8B4H6h1Zy%2F7LF%2FKnF2KFMqXDRKF&X-Amz-Signature=d70e010c03257e15979fb66a6d284c5d8653634e746a9f330df92716e5ccd663&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X7DT6P72%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJHMEUCIHvNryMKnrqo2GlrMk0kdfZBoPLFkNG8Ve%2BLIMgAFuToAiEAqft7k9a1AxUBKJ%2BP0ERt3RATVhH8xb8e1Go12dR%2Ff8Iq%2FwMIFRAAGgw2Mzc0MjMxODM4MDUiDEqAUTw89lf8rJDbvSrcA6xqbIq%2FLIRQV9XkfTcfVzIuyE1CCt6IG2JwxSwj8Lzn3pcl7weeI4OFpeM825m8T2rFAKWjLtP8l1mEaZMLVSUgeaK1R2yeauJBkUvBjX2BKGB3FJ2IFgHBrXa5ZEdrXYsk37Xx9XcQB5VtbmI3iHyR183AdGBOrglR%2BQMGYoxTzXEU2CiYH7BM%2BYPks1FXImNDATbSI12rAIujs7pKmHEDuRn4rBDIZN2WpDX%2B2cUAuP78jwSklNw3yAi%2BbUwYZTGgulCpRSjoW0T1oMxBKEp6spgnVCB1oSBSFhaMNnVTMB1Bq9k3ycWbvknUvHKuExBCM7X6CM1ca6Hq24WXe1clYDB1fcqAORPu9tLxQVD%2BrZ%2F7GI8Aqq4Vq7nKM9spYIleAmiUOcKosVKJ%2FjNahzJBpUJwPD9FNBwNh1MgdkyEsSYjCgL1E0%2BfhTt7MDauUo54RQJqbBZcO7JQFGU4qseHp68J3ViXqTHQTjoF1RneZHxyShmh1apb0gw5geCf9PrjF3MpJ7RV%2BSOVtr1lACRlWXW1aCVwJbAD24SbVrWDxuuAgNztXmZgfHl6wJBUZzfAbIz%2FBrk6J5oOb64GFdvFB6gdl%2F7q7aXELjSHSLCooK7m2KJmnFi7ygLXMJSxv9AGOqUBZr8ql1BsdBA%2BGI70r6O%2Fvbcp0JFtX%2BPmKuGX%2BkJEo1kxbdDnztpcvpbQmV7bD7%2F4fu69w9bnzUCSTKZoPMMvyJi4a8b0Tzpum93ZAcvPbDnSjAKI8c1I232tWI1FOBqy9FI0gDpBlyDN3c0LYz3%2F34m6hbFph%2Bz%2FUHgl5vSmCblPWHJW1sYM%2BA%2FLXtbWAnK81am8nYgE3H3l1LjElHO9zCiHrSnH&X-Amz-Signature=da6e8b7777c9c571fa3b77bbeec93b0c7e4cd639be2a5e58b6f0d8052d0bdedd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666HV4P5UI%2F20260522%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260522T043458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEwaCXVzLXdlc3QtMiJGMEQCIG4apJh1sei9s%2FIZZckafMathfvLb4qP0AjUHWdhjqGjAiAVfCi%2BTZzik3pEtyY%2F88asHps5l1F6ygC5TRs7PWPjyCr%2FAwgVEAAaDDYzNzQyMzE4MzgwNSIMTKRskcWiEBkp2EPjKtwDjjSgPUNJ82iwoF0R51cURtmg%2BIQQ%2FxfkRDjfx%2BqujFQMBStCK47YvzkiPFDZ7SEkaW%2B9lkhWRi0mOHzVBu3xuIIuMHhPv4pugbQL1hzLhJYHF9x1akzQQniUqRxj3iRKVd0gqTxbpH8e33ZeqogeXun8USQQeCikuIWwoSLGwJCETeNiFYTTzhELY8ahUuP%2BoFNtssBjuUZJmTy0yVusb1AU%2FhCik%2FYLmnokvmglC6oKpAgDU%2BDScUIXAigaDqJMvBz6X78BvYJ8215hDY2tHx6yRt%2Fj06g%2FYiZaduDFtGPVhnrJyZ5Ua31JW4J98PbCXbu4wbjWM94x43LV6f2pxTaJlqPZDf6pp2Owcw3e2nN2v%2Fu2t5K%2BLn9Ddx4496t%2F%2Fm%2FNgs0OypsZSR2bFfa60DJOzIUhZLBAUO7KwBc42xNJx%2BhXiqpGk0K10TIZ%2Be%2FclvC78fzigy36V2MjzxqYqDax%2FHrXVFpNNzYvi9HB9gf4nIYVbzHrj3oBw7%2FXIGg%2BOcX55C1lCVPbKZJnNhrGvklB3rUT9fbJelVzYe8IaVEoX%2F92%2BDYiA5tSjPfx5pQtRnqVj7PUM%2FOepjYa5eN92sc6R5F%2FdttasrziRHTpC4BbTBdEQm1GfRehppkw96%2B%2F0AY6pgGMUCYcj0rw1VS5COqdaCofzgNz90XKb1J7ohHUdk8Nya%2B5SuBnd9tii6k8HSj8qHxcguU8ZgZzxF00DRXQPcZNmSAiiCFlWPkONnTADaiMw8XZKVXiFTjCxX%2FNvyhi74gGUCuhoP5wIJOLeKqEkanx%2BQkFbaQNPxpUU%2FUiLNHdrvcNU8HqK99zwQmSwtQUDKucezwxySbYXJEyZgG0idSKzVn5FnI5&X-Amz-Signature=73944c004a64d1593e2db0e7c0b1d6f70a844fc8fa83984565e7b5bb1d5893b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
