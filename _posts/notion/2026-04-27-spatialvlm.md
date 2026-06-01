---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YTAMLHGO%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051501Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIB4pilPeewJhJq8W7EzW%2Bis1KXJU9PFaZH3ehjVKC6%2BRAiB2BI61rIOuBcLqnIfx73Ib2Je3dTJww6pYluWFRipV7Cr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMAvvnhgO2vpXNXa02KtwDzPmX8QcywzBiP517i85EagJ0NP%2FGHi7dglF2bZSZklJ8PgKBM1%2B6YFsj58MtzNS02UcYc%2BkKUDlZb1DIDgKJ9PRP1O1w66JdOvdswZ7hqzJlHb%2FvkBMOx%2BdqGVqUQ1X9XFIx8DSA7aeLXy44aPbZwZgMavtWeYE%2FeS6vrHar1rk4j9WeFHAyHbMq93b%2BVsEgyVjZ18vKtYs7X92CJfWxePspwKyjB0Q1UJFMs%2Fu5fqsPKllAtm3II4DYZrTYkOyMmn8EJGuys%2FEFNzUcBr%2BgE%2F2cidUgmctCOkw%2BKFWNwpOrac4SbmpoAdB7z8TaT9i8xMNwbgL%2BhItOKDvtzE1Wbxu%2FSr%2BQ42DiMl1dghrTK3i3BCZmK6%2BlQ9UiuJPLf01AhNH6UJlQ%2BiegLIZaTMsv6mgLkFTNMCVT0EEwVnsNPL2TxAQXtc95mjq0WlnplrTIfXHvcYsrut%2FXUFatD5LrGaNFqrsp85wPRrfzlRPMhfiVtXJpYYTkd0doLEteVRwnD%2B9tcJHQPl7lOKAhUIFZpEgSeL0MHrGDj4vUyb21vc6v%2Fk9lO2Xq5aec69BSdo5dsZLm8EmuF%2BXXMb0jk%2Bs9kb9DYIhf5TL1ihJ51dDmtI5fU2XIFTOysnztZDQw4KTz0AY6pgHtj6rROX7vTqtwnQjx3uTTn0yynRZyuMne7yGHZgLIiwenXZvA9JKPczj3ujKBD69bjYmMP437t%2BbZynMd5iR4aeIRpXMrisHZB%2F1pF86zxKlLV8zCKlBpMTgn2M7nzAnSdc6EuWD2HqVkjbddjdbEOs91yf27x4q52cCxCgnsk9ezyUZO4LsRuX9hqAT%2BTJs%2B5HBc%2BJyctp%2BWe%2Fw6oyIa95afFtaq&X-Amz-Signature=a1c816b4db7b02221c0dda4e284285673a88c11754e78154e30ab5cb759935c8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YTAMLHGO%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051501Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIB4pilPeewJhJq8W7EzW%2Bis1KXJU9PFaZH3ehjVKC6%2BRAiB2BI61rIOuBcLqnIfx73Ib2Je3dTJww6pYluWFRipV7Cr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMAvvnhgO2vpXNXa02KtwDzPmX8QcywzBiP517i85EagJ0NP%2FGHi7dglF2bZSZklJ8PgKBM1%2B6YFsj58MtzNS02UcYc%2BkKUDlZb1DIDgKJ9PRP1O1w66JdOvdswZ7hqzJlHb%2FvkBMOx%2BdqGVqUQ1X9XFIx8DSA7aeLXy44aPbZwZgMavtWeYE%2FeS6vrHar1rk4j9WeFHAyHbMq93b%2BVsEgyVjZ18vKtYs7X92CJfWxePspwKyjB0Q1UJFMs%2Fu5fqsPKllAtm3II4DYZrTYkOyMmn8EJGuys%2FEFNzUcBr%2BgE%2F2cidUgmctCOkw%2BKFWNwpOrac4SbmpoAdB7z8TaT9i8xMNwbgL%2BhItOKDvtzE1Wbxu%2FSr%2BQ42DiMl1dghrTK3i3BCZmK6%2BlQ9UiuJPLf01AhNH6UJlQ%2BiegLIZaTMsv6mgLkFTNMCVT0EEwVnsNPL2TxAQXtc95mjq0WlnplrTIfXHvcYsrut%2FXUFatD5LrGaNFqrsp85wPRrfzlRPMhfiVtXJpYYTkd0doLEteVRwnD%2B9tcJHQPl7lOKAhUIFZpEgSeL0MHrGDj4vUyb21vc6v%2Fk9lO2Xq5aec69BSdo5dsZLm8EmuF%2BXXMb0jk%2Bs9kb9DYIhf5TL1ihJ51dDmtI5fU2XIFTOysnztZDQw4KTz0AY6pgHtj6rROX7vTqtwnQjx3uTTn0yynRZyuMne7yGHZgLIiwenXZvA9JKPczj3ujKBD69bjYmMP437t%2BbZynMd5iR4aeIRpXMrisHZB%2F1pF86zxKlLV8zCKlBpMTgn2M7nzAnSdc6EuWD2HqVkjbddjdbEOs91yf27x4q52cCxCgnsk9ezyUZO4LsRuX9hqAT%2BTJs%2B5HBc%2BJyctp%2BWe%2Fw6oyIa95afFtaq&X-Amz-Signature=fba3fb823c9a7429d5db40b494e339a391f39f30e70b223347ed784a2186924f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YTAMLHGO%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051501Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIB4pilPeewJhJq8W7EzW%2Bis1KXJU9PFaZH3ehjVKC6%2BRAiB2BI61rIOuBcLqnIfx73Ib2Je3dTJww6pYluWFRipV7Cr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMAvvnhgO2vpXNXa02KtwDzPmX8QcywzBiP517i85EagJ0NP%2FGHi7dglF2bZSZklJ8PgKBM1%2B6YFsj58MtzNS02UcYc%2BkKUDlZb1DIDgKJ9PRP1O1w66JdOvdswZ7hqzJlHb%2FvkBMOx%2BdqGVqUQ1X9XFIx8DSA7aeLXy44aPbZwZgMavtWeYE%2FeS6vrHar1rk4j9WeFHAyHbMq93b%2BVsEgyVjZ18vKtYs7X92CJfWxePspwKyjB0Q1UJFMs%2Fu5fqsPKllAtm3II4DYZrTYkOyMmn8EJGuys%2FEFNzUcBr%2BgE%2F2cidUgmctCOkw%2BKFWNwpOrac4SbmpoAdB7z8TaT9i8xMNwbgL%2BhItOKDvtzE1Wbxu%2FSr%2BQ42DiMl1dghrTK3i3BCZmK6%2BlQ9UiuJPLf01AhNH6UJlQ%2BiegLIZaTMsv6mgLkFTNMCVT0EEwVnsNPL2TxAQXtc95mjq0WlnplrTIfXHvcYsrut%2FXUFatD5LrGaNFqrsp85wPRrfzlRPMhfiVtXJpYYTkd0doLEteVRwnD%2B9tcJHQPl7lOKAhUIFZpEgSeL0MHrGDj4vUyb21vc6v%2Fk9lO2Xq5aec69BSdo5dsZLm8EmuF%2BXXMb0jk%2Bs9kb9DYIhf5TL1ihJ51dDmtI5fU2XIFTOysnztZDQw4KTz0AY6pgHtj6rROX7vTqtwnQjx3uTTn0yynRZyuMne7yGHZgLIiwenXZvA9JKPczj3ujKBD69bjYmMP437t%2BbZynMd5iR4aeIRpXMrisHZB%2F1pF86zxKlLV8zCKlBpMTgn2M7nzAnSdc6EuWD2HqVkjbddjdbEOs91yf27x4q52cCxCgnsk9ezyUZO4LsRuX9hqAT%2BTJs%2B5HBc%2BJyctp%2BWe%2Fw6oyIa95afFtaq&X-Amz-Signature=48a417d64f43039f11e532f8093db7328e7a774deffc285debefd978e92f4032&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46652VHV6TT%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051508Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIAbO7yuWmAn8Y%2BxgZp8CHM1ioZ%2FdUxXEB8yAjo%2BHO1ysAiAmTJMKNHVxFhgwRPGMT6KvSwkOuqOxbpx1USVt2QgdtSr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMCFhS1rhxm%2BQKIiiaKtwDFq%2BErRIfeICQ3PJdpORiRplHDPm8rVoIzl86PgrSi3HGB4%2B%2BKvJ4zol%2FL8A%2BTQuEVfn38sDkrBhQAkgtqi%2BIsJTih9ula9sakuyGvtyhtfG%2BSPasZOUfxSWb3noU%2Fc598MvKZon9jUsnYkh4WIzCO%2F%2FXOk%2BY01SStPkOMgzCSIpXmF%2FzQ7i%2FEAL17XEhSQrYeVrqMz9A2tlnmydwc2rRFrxLaB8Y93%2B1jxT1XTje6BCyJRp6eGkBcMVxYx1nqiQRHSCyQkM23NI5Q6418NnxejCT1CNAqZsfBmGpPrwrcmKvj4cWj68ay6YaQWdn0FlMrx0K9UFkiHQbq635p4aiNEek7rtuBGZ489EHJSVn0u%2BHasC%2BMiFlUekteOE4%2BKfGVdieA0dW3wwILa28KkgRFnREqMuxXCXwtyTLf14VEQOA8Q5UFjNm0bkjiqu8mhu3TgIng3RtHiAC4CVe5OG1i5eUWG9VLf38SM2r7XgISEnl9TF2sgZNfpBsetvPpt70nn983vr9G5DeZqupEDixQZVeFEd5X%2Fg3p4B9ouqqvJdkqiGSj4fgc09C9hq4oDZ2oQYKxJBs6EWtNNjn6hxkKIx80%2FOu6VYfFeDxJoIg2ovmugaleYWPPDpx%2Bmgw9Kfz0AY6pgGlx53ycs1hXI7%2FgnAvqYuikPP5CCc6s8Z032%2FEK45ABxOeLpzkCusrX6RaZwtxwVuK6bA5%2FZcgIAWOZ3rhfu6vou%2BgyQvIEKOeZRznbMTnt1CXSbXZIXOr3MIRTSsPPEc5YO11FLcKT3d9AeVniEPVv%2Bgajuo9k7t0xy3DYajWt1%2FNJAzSdOufGH5WrkihUFHckNcsTTCa%2FIKG0IUkkfRCrrjVh9f2&X-Amz-Signature=940219f9012befc5f93a0e249ceeada698ec9a2a97734e6a39f6654b83676e54&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QXA647JT%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED0aCXVzLXdlc3QtMiJHMEUCIFXG%2BGk5yO3%2Fi55f%2FN4LBPVTJM0EBcnpjNXNCQ2qCSdnAiEAgUZ%2BE95hyb7zWP%2BwHJZ85U4bJSywgtIbaQJ%2F%2F%2FBPGVMq%2FwMIBhAAGgw2Mzc0MjMxODM4MDUiDGGuzfxtMAE%2FxeALIyrcA%2Bcl9GS7mqYgMxSgImvv08RtNPxCByW8VIEsci3Ld%2Fr8zRvFGzxf5u6KZCz390X%2FSZgYuiIv7GlHYEgoaJUtE1xnDMslh4fWKTSLdArBo64sr3u5YQR1%2FVn0oGhP%2BUEp96lpjymEHBLzPocAtf8JbeXdaULWD8DnToEh1u%2FrKnvdJxalaeO1huhs6TQpzaRaA3W32WzQkenx2JGFkq6OMulGe4wPR5hbq59Hr3Cvvse9E2l%2FZany2%2BlMUaNBvWIjk1F7fy9j3V7kjetLEfefF0kJvkrq7OdE5NMOxRoidk%2FlpMLZwTCEu%2FvDrQv%2FXjq3SdUeaFKjzEuNEteh54ZcvqT8RMCVEpa6ZnZWPn1tBSqlwACuBz8qe%2Flkmn4J7Iil0a9d1A8YuybkgGS6hw9DTP4jQcBcr%2FGQ4wD%2FhpM%2B8JZpbHDwGUqKNW5C3S8MlaSFVGfEtBqp91MxgaFyzpY5sygMPYMUxvY1QuGqoMHkFZzpBalYcjZB%2B7Qg2DIix37F62mdY0oMmExXbfaH%2BO8CY0ixkxMcX2P4bk8p0BsSo9hpff9n3xTKsjbg7jHfV%2F67aWt6mNCQNDl1E9tn3IRHqtHLj3hUVY38PGvG4WUkX160ywMYNFGK2Be1VyEPMLec9NAGOqUBUnv69ugkeP0AH8Jyh5MvbctP2%2B1A6QoFSE8m1YVmz1l0sDkPzhKmrKBpYuMU%2FbNMbGXIoiKPiNVj%2FdCizxjN3Ih0VvJdaZBca%2BiRZ6c516A9yrlZ02%2FpLDMoyeS2as3xyVmJzSd9r%2FgjVPKL9L%2Bs%2FuyR15rFgVAaGrKQsUFLpvP15iPe8%2BUWRO8FD38DOFmsueD%2BuYbW%2FuidgiOC9EyGLXAB3VAC&X-Amz-Signature=90e833d60297f9b476c7787bc4a3c3c93efe8fd34e11275d6e4774c0c9902c3d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T3THM4B4%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051512Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIG45PZsQMOKPWpPTDP0A5Lb%2Bh6XiGONbwWbtsHx4EOy7AiEAxtocMPe69DbwUP6HYjgEWTG8jcryg6wi8f4aozvF8bsq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDH%2BYu4q%2FkcI%2BkJWMpCrcA8qjqrUTY%2F%2FoR2FJ6HCHPoSiE6cdmnhtIWHKAelcFGpY7hHLEnLRvV%2BMc5jNBVLsGWsS%2BQa0X5JqBFxyrVpkGJyK%2FGx2IJm9nQjr9CMdO%2FyexDJRWzPiVZUXJdygFbYugtfEgm3tLHq7phIT4tEZw5V4YL5EZuItmkyr12HYzaSFExS5lp6uwHzl6haYUnB30E1KGqgKTJpsmZSda13e6NPRur3ninE1DF1cj8Bpix%2FCrH5sLXArEeFtxG0uUCAHaEgf8lYJeVG01shqaXolOCT0JFRlHDLWnkgVC87SIkV3jjId73w8BqlxBYOWu5MEzsAltf6cLPnO9eJI0FicZKYqbydUPjm7Fz7VqmjiS6jTV0NCyfCLEl5U13BqSe5ISPBK91Sb9unAkENHZ9GdrF4se%2BTMhWth9auI89uJMxZNTSa1HI63e1bMao%2BxP%2B0i%2FxCowJX9GcmERlDf5IbuOzcxT3cmiK4J37w1V1PSHRByyAnpw%2BKnetHVk1EcUWWtC42gsLoUD8mdDKKyGYItnpe95Ef0KwMyeTGf3lSouZmfhLKNPPCjx6totFPUSL%2BKYkHgocqMfyVh0UA0NfzRP9F23rcyEzLm6zSUf8xdtiGL2BaEBUJpk6BG8YyWMP6m89AGOqUBBYvkl1QCkzsRitdDMRtaHhYgUIH5rL7NuTkN%2FYjaPJ%2BEliEzWMV%2BAXmX6pDYp9Gohp69rZcPp0K12tWolDjOufMo7TTZXvHbWgRdzilG%2FK9QOquJtTentH3eq4RgTsaT1YOTtsJKxwC9eZFr3Jl08oHlNpcxxflZVKSjKgviL%2BUlGIlJFGhWP2hs1Q9tsb%2BjYnZYqj02hbf5sUVG7%2FaawpA6u7CH&X-Amz-Signature=80e406d6036a215ef36819e04be05256c297f7e9e80e38970ff2e655aa0e4829&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOMIQ233%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051512Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIQCvnsW2xgzpbGYnDcD%2Bo57hwQ5yk203Gh6R6q44Mn3Y6QIgPlEEbm74QSMoqgD9qKgChpZ6HCkIkup7aLr856HIHfgq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDA1EoJkUSiIvbybYXyrcA7mqBlNRNI6i5AdFDAOGTlu%2BUlJZyhdQjx%2FtcUHUGt%2ByKxrF8chBin29zxR1vyVID9Q4uVAiJeR%2B3QV9FxjNgjF3Q94bZUgr7Jg0oG6JVShPmJFyVW5LARvbB1MIyUNeAjnQ8X%2B%2BnGQjMNersMRhkSO1gje%2FFKdARRtkcX7BfjiBKvDakYB%2BzseyMPPXvsxLNvYHJgFIgDnKH5bWVcXNWfAkRfpjve%2BUVxr6cBQXmkC4HkjIFEZ7wQCFliSWxyNmBYOw7FYBkwo80ekdxjcMvfIz1Bx31tvVu%2BCdCXWWuVCqN%2BDjQhnEIhHJ5hYT0odY4Fdv6uVJFU0edMwaMmjMHh6UP%2Fho%2BVNeiO5idA7emnmlZGOXN6%2FltpEQ4gC47Zu0Yh1uf%2BwCri4LPFoPpsm28nI0N1K%2B7WhWJQ%2BH52Jl9Us2TZsw2ei2Js7oyrttqKAzFhf2DJwWX9T7%2BpWRfEbLdCuYGoT%2BQi2%2BLLBrDFm41bCYsLXWP9HiZi3Ye4jnz6u09370By0wIbslhl3mIDi0yponCJ7WdlmQ720%2F77xv7DUPrpNztdUE0O8FkpvztB2dl5I%2FY2ynXckjMkjj9b2QqVNCJn%2F4m%2BBiYpm5CpbrDzcT9liQSw9cqvvjpES6MKqn89AGOqUBfZNFvUNVPABB2nP4sxK9iJXkXncpxAS4bXFXYMNctYn8pI0b9Hc23pBdoRY9TU%2F8f0sgh1GuS9bmqBr4OkLs%2FffgwOipyuLrbkdPDqVc3gA0%2Bs5j%2F%2FTbz2k6b8IkR7PyCZoOO4RPdWHH7kY7%2FIOJXiTuGCVxN0%2B6IqC3Jwe93K7WE4aK1Gkj175K7bshvv9Wv%2FzYJFIcowA0ejl1HuSgkNzhEI8T&X-Amz-Signature=3c92eb8ab384afa1a509074b187723a9400b4b49a19beaee6f25afcf88362061&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SP6WQAFY%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051513Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDoaCXVzLXdlc3QtMiJHMEUCIQDA6RycJQ8Osl69fPXuoPVy85cJBDtgBrJjwaNvJQrCHgIgBWl%2FOr69%2B3Vdj%2FHohtqpIzRTFDKoxirAkIP69pihVWQq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDGuJSqyqIx10BhIJ2SrcA9CvmBd9b0u%2FTpc%2FcpvI4rewv4hUP8SkwMVnIkR%2B%2FOk781zC%2B%2Fu4%2BV9EEr6Le6cjid2vOYnZOMzo%2FWYN7%2BxZ9EAIYov9zOAQ%2FxAwwWCsNnv66QMly9oL14w8GnPHT99zIEQVJ3ZgfzSW64CeVpHesPokOOafkInN2rdLybX0yrfsLxdSP%2FkI9LhRh22IRzfsCZI2fDqNoGqvf1%2B%2BMNY%2FXsNjbIwZ6m%2BmYLabqEndstfCkuBD%2FC8h3c4KahXdBH5GjWMJjFmvIq9g95dXRDJKg2%2BrKz66R6%2FPPI%2BH6ef9yBXU2dN%2Fn5qI6%2BMvt7iKEul8fpnJP0UxLbbr%2BQ1dwyy1jYV3UScsdwqKD%2FX2JD3j2s7RJnRqg1LnZsLmBh%2Fj5e0GwTJEY75QFv0cDh9BSLqSE4z65YWs2RNam7N8XWHzh9RzOEljLSgxNeEcNlw5EIF0ANbnY8eI6roDPXkx7zCJwhodo1Oo9OIZKX2AhboVThTRPtPfn9AxKR3ia8Go6vGMA4d68oUnmcmcApy9QyQJUbOAVJFykdjeBRGj6wVE0I34OXyAJreXyNvpxUQ7fwXbMruqGfbVI4M8J%2FI8SHFb3EvATUu9rJvPcNT7%2BmaefSskHwPETMvIgru9oeZDMIu989AGOqUBdXeBjoH5NDRxTBDNOARuZGbCaPKwN7kEm5B2zzpOGOXnS4NysC%2B9SBOZTU5F7mcU9ihb90eGw%2BdoaKxKmIEnCe1UJv1WLUhHUsGiJh6pg%2FkGThWeiP0jHH8a5B1x%2FPLg%2B%2BXaLALGYsrIdtSdq57AMwpyl%2F1Mb3ZMj03xKyLW8xqMn%2BMHDV0NG9oeJCBUDETwrArzaKKhnYxorMFrC8omEtqLVOjW&X-Amz-Signature=6b967ea0c1fd922f5ff7c590a4f402f02b8b55752b169a28c063e76f15eb6891&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RI2VJAE%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051513Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJGMEQCIDu7IS5%2FIClwl84gKn5vjfvOsxh9q5B4mZsJhSE%2FYfVHAiAnL2C2FXSmHVhRafyLD0yIb%2BPm%2BtP3WJQeLF45KkGiRCr%2FAwgCEAAaDDYzNzQyMzE4MzgwNSIMOtD3FkzgYEXRohVGKtwDT%2B2jDr7Diq99NMX3gTY2cgYIt%2FC0C869jtFPc1Aa09NDDaN1foLb9ZGSr5fF6bu%2FmKCOZSk8sTXFjhrQzR1vGayf4kyeQbiEAdQHAb6urcivTHILyBjT58aCn0TLgFxINXdmICc3KQW1JxZ6HK%2FouikC%2FBk02qjG3Uanmwsnh4FtYnppbxY%2BsZjA%2Fn9quzB4R4If6zuHC2ql7Z7VDA%2BGYhvTHryjfWIHXRZi3POAaqzLzqnIJT6u1XGhIWWMBSY85pmMw2O645vYPbAYkP4LSG0Tw%2B8toBhV537Y6TBv2r5MjPFrRsQM%2BX61CE2g6cETZbScl%2FCQC1jNv5jFO5sRmzJ2VjmIcFnq8zYisZPd9DEobthGKA0vSOGcOb73PUfZ3DYMegP93ax6AZRZq40cHc59wqKYoQnfVY2geiBino3Q3%2BIs5VkoJXbR5faarLmNDi37chh%2F5TdQaDAOGafMQEQy8j8pa5y4k7SF5677XXVMitDHkSvC1fePlGgZGAMSOCsoL5zfS3YVKf3RLT%2Fq8YALGv3otg8AshZm4QveHvUDIYCPY4PuQZnLUa7Ta6WGn1dtw8CdToEv6XWW3ON7wmy9klNI02%2F144uOiPkWMvtpZ6xfCnPs%2FVtx8bwwz6bz0AY6pgHfV5syL6ljnGaVUE0D34YRa%2B%2ByNzRCgoHU7qhzfkhMtQnU%2Bc3O2ngNJTdq6Yx3ok7PjK7ZBtUy6cDJQXZ5HTRh9EHJ7WSEE7NyilwR1s5EMZuOBd0l1NEi0M1cGI4tDo9uEJxYSihsFZAqwkzbv7Sa7FDO8oSo8MIgsCq0wNKSYp1EB%2BsuvcMsDhy6AIzoR6jk4jK7LDFVhxw7uRotKCjLOFiqC2Y7&X-Amz-Signature=ddb3e2edf5b70deaebb7178c1b9740bce1fd3d4fd6d69635a79a6d79f7b64d7b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46622A63X2P%2F20260601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260601T051514Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDkaCXVzLXdlc3QtMiJHMEUCIGQq34QY91XRnmOOG%2B562ZBRkLGGJi3yarIjW2yHL9aKAiEA%2FXxtY4g05Esj%2BJGjjubIrmrDhJAcQAYreGPs7E4iEJMq%2FwMIAhAAGgw2Mzc0MjMxODM4MDUiDBMgvRMQFue1xlGD%2FircA3cN23cfO4TaBb2V23agWLvBfMKqfBGrttP3oDic7L0ym2U54znHg7LZyZ0uWcfMFks8Dfrns18pL4tRgyWdQ62dlCLTkVS3rY%2B%2FS0e6tmJtkhk%2FfkhMIR7TPAFia9AIKWmTu7%2BNKS6%2Fl78JJAzES86dWrMnJU1C%2FAcfdeEuXiDgUqmA1Gm%2F1%2BuM%2BF%2Brs9o7GOzkDmk1KZrj1cC8TURFfk2zotsqkR9ae4LU3Ivtoxx2tUPm4ESW6j%2B7OzCHotv7hyJBK8Gi2iJoxKMbCXRY1F0gbovZdVDA13zHc1VkPNFCZjeTfH5EzridcBVltHhczpMDGYyxWE16zNJsBEk%2FihvMhlL00YYUZfaIOGM79MTzAZpQON3kr8D5H9uW%2Fp64XVqQFwze6lwLI6IupuDIafnSDoLOiO0NBLPQ3%2FndvGVJlss0IQz82TMcySOFXfFhRI1z9lIN8F4ous5NGOjKY1%2BCN0LdmWEzf6HGxMkOTle4heyejy3z0hfBFbps0Ux3liEFPDSkVffQaR5m2fHh1yu0LcoxsDQFkCdwhHPrmL1qCsmI994kukcQVynOgRqX0Hd5G5dhz48eqSgCW7n%2F1Igwr1i%2FnLMhtjz1vBpt4IP0S2sFxaQdXtsGuSvXMLSk89AGOqUBInR5fOBfH2ti%2FuJQ%2B%2BywkDJoAriTCBBTBxejj3xAt8%2FHZLUML3VOHaE7FqanoB3rpzKj1wf34BwfkpAGUvf3ytCQG%2FopeTjFeS1d39HLm4qDnVhZBQh1CjkVEo8c6jxTPMxOR%2FOGko5GKDE7srvrUSkeRmEJYhivG54SalydcFshsvTuW7OQMVHKwe6ZRXS811LhaspZCQ5rxaC6JHiD%2FKKD2oqo&X-Amz-Signature=0ada57848fcfed83237184dc6f26995e13c962cc3f987a94130eb1c676df4885&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
