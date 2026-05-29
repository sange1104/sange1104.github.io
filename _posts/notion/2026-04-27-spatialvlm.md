---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HVQOZ6J%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044130Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDitxgtw%2BXYu0%2FlcWmFK4KWsoTKMGF1kMqFH8%2B8mb9l8AIgUIlVvtErXtUwyHPR8Djkligy5QoBNrGQw4WIdERI1JgqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM4ajpsBV7dmWqrLESrcA3mZyGFgy94nSFbvZsG8p55wiOFzloprRbhEzPbmT2EKcS%2Fyd1ZGh5ZsfclTFvBjbGWrP%2Fd2NCG%2BMZB1hIMSdFThKb%2FZBs8tkildX9XuNfPWUrzE5MFlK9VghDu9CNh8FLK1iMCRcJ2X%2Bh%2FWn63Eh9y7DOAGnkqwX%2Bg%2F5nInz39NQcFHb9PbiaoHXh3nbebiXwOvdTXAbz3weff07r5W181sgoY9cRZ1lHPW60IPsLeV0k9WnNskmp7ZKFoPiTLsVLpDuFrjvq3WDyK77KLfF%2FpXFaclLoJreHHG0jQcAmMzwuRc5Fvs3N1RtnASxiUrkRjumc0eBIxU8k2VtpjK1US3WWOf%2F0JzLNI9aMioUsTWknSzZMIS4zlkLT%2Ba%2FdZ75CcUhS2goljyBZCaziX7yqSyB9BJFAwYYAEUjoDwc76r%2BPhPD2YC4PhJCu5a47V%2FKyDASJFq80LHfBSivVTUFtvQ1hUqCzuVTN7fF7TTVsYcL9NvMMDy0b4dji2tMv1htCQVIj3%2Fj6RUUHfRurl1CYOIxvEgxrdgKM50QTexmSenzvuh7qfCRy7smMvdDa%2Fd%2FAfPkSXg8SAals2jYo28DJIy76GLqrPa5WxKF6XvH1I3rHhdreXIc3gKAlN1MNaU5NAGOqUBrKeepQg%2FFY2qGe3JvmaQacvX8vpw9487w4%2BLPdKewXoQsIb2T1aNJYmAV7KoY9hXTCad14NmChlAqBwSaLZ8VuMebq5vdm%2BqJJUL2iFtc3Vy%2FUyZ70GuZB3ayl%2Ft7BlMLsYVJBaxi38jPxQd5UZfGwG7HhpYQIESDhZfta%2FJJkuR%2Fcx0doKpCznzon%2FlQBWMU5ZnkZYt50jniUx%2FaSZetf3D%2FPZa&X-Amz-Signature=a94f3e4ef43dc9c15e3bae8f67aaf4758b3f3c66542e647657d118d5f45942c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HVQOZ6J%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044130Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDitxgtw%2BXYu0%2FlcWmFK4KWsoTKMGF1kMqFH8%2B8mb9l8AIgUIlVvtErXtUwyHPR8Djkligy5QoBNrGQw4WIdERI1JgqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM4ajpsBV7dmWqrLESrcA3mZyGFgy94nSFbvZsG8p55wiOFzloprRbhEzPbmT2EKcS%2Fyd1ZGh5ZsfclTFvBjbGWrP%2Fd2NCG%2BMZB1hIMSdFThKb%2FZBs8tkildX9XuNfPWUrzE5MFlK9VghDu9CNh8FLK1iMCRcJ2X%2Bh%2FWn63Eh9y7DOAGnkqwX%2Bg%2F5nInz39NQcFHb9PbiaoHXh3nbebiXwOvdTXAbz3weff07r5W181sgoY9cRZ1lHPW60IPsLeV0k9WnNskmp7ZKFoPiTLsVLpDuFrjvq3WDyK77KLfF%2FpXFaclLoJreHHG0jQcAmMzwuRc5Fvs3N1RtnASxiUrkRjumc0eBIxU8k2VtpjK1US3WWOf%2F0JzLNI9aMioUsTWknSzZMIS4zlkLT%2Ba%2FdZ75CcUhS2goljyBZCaziX7yqSyB9BJFAwYYAEUjoDwc76r%2BPhPD2YC4PhJCu5a47V%2FKyDASJFq80LHfBSivVTUFtvQ1hUqCzuVTN7fF7TTVsYcL9NvMMDy0b4dji2tMv1htCQVIj3%2Fj6RUUHfRurl1CYOIxvEgxrdgKM50QTexmSenzvuh7qfCRy7smMvdDa%2Fd%2FAfPkSXg8SAals2jYo28DJIy76GLqrPa5WxKF6XvH1I3rHhdreXIc3gKAlN1MNaU5NAGOqUBrKeepQg%2FFY2qGe3JvmaQacvX8vpw9487w4%2BLPdKewXoQsIb2T1aNJYmAV7KoY9hXTCad14NmChlAqBwSaLZ8VuMebq5vdm%2BqJJUL2iFtc3Vy%2FUyZ70GuZB3ayl%2Ft7BlMLsYVJBaxi38jPxQd5UZfGwG7HhpYQIESDhZfta%2FJJkuR%2Fcx0doKpCznzon%2FlQBWMU5ZnkZYt50jniUx%2FaSZetf3D%2FPZa&X-Amz-Signature=c6620933af7da2d727c5cec883ad32d16dae7d7c2fb3bfdb64355d44bdd8d508&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663HVQOZ6J%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044130Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDitxgtw%2BXYu0%2FlcWmFK4KWsoTKMGF1kMqFH8%2B8mb9l8AIgUIlVvtErXtUwyHPR8Djkligy5QoBNrGQw4WIdERI1JgqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM4ajpsBV7dmWqrLESrcA3mZyGFgy94nSFbvZsG8p55wiOFzloprRbhEzPbmT2EKcS%2Fyd1ZGh5ZsfclTFvBjbGWrP%2Fd2NCG%2BMZB1hIMSdFThKb%2FZBs8tkildX9XuNfPWUrzE5MFlK9VghDu9CNh8FLK1iMCRcJ2X%2Bh%2FWn63Eh9y7DOAGnkqwX%2Bg%2F5nInz39NQcFHb9PbiaoHXh3nbebiXwOvdTXAbz3weff07r5W181sgoY9cRZ1lHPW60IPsLeV0k9WnNskmp7ZKFoPiTLsVLpDuFrjvq3WDyK77KLfF%2FpXFaclLoJreHHG0jQcAmMzwuRc5Fvs3N1RtnASxiUrkRjumc0eBIxU8k2VtpjK1US3WWOf%2F0JzLNI9aMioUsTWknSzZMIS4zlkLT%2Ba%2FdZ75CcUhS2goljyBZCaziX7yqSyB9BJFAwYYAEUjoDwc76r%2BPhPD2YC4PhJCu5a47V%2FKyDASJFq80LHfBSivVTUFtvQ1hUqCzuVTN7fF7TTVsYcL9NvMMDy0b4dji2tMv1htCQVIj3%2Fj6RUUHfRurl1CYOIxvEgxrdgKM50QTexmSenzvuh7qfCRy7smMvdDa%2Fd%2FAfPkSXg8SAals2jYo28DJIy76GLqrPa5WxKF6XvH1I3rHhdreXIc3gKAlN1MNaU5NAGOqUBrKeepQg%2FFY2qGe3JvmaQacvX8vpw9487w4%2BLPdKewXoQsIb2T1aNJYmAV7KoY9hXTCad14NmChlAqBwSaLZ8VuMebq5vdm%2BqJJUL2iFtc3Vy%2FUyZ70GuZB3ayl%2Ft7BlMLsYVJBaxi38jPxQd5UZfGwG7HhpYQIESDhZfta%2FJJkuR%2Fcx0doKpCznzon%2FlQBWMU5ZnkZYt50jniUx%2FaSZetf3D%2FPZa&X-Amz-Signature=d396afc877dc4867f164c66d09ff03cb0bc7dedd1d635c29e1b3380739b912ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46634PE3ACZ%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044137Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIAhUcmyHZRBKr4P%2FB%2FAZIUdTRzjhk%2BughvJZKLh4%2FnbvAiEAu9WaJjQNDW4NcgFnHIKeld3e92W4v6IiWeWN9XnlYEgqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDENDSNFpk2NqJUVY8CrcA7cKFJ%2Bdg7DFTokleXxozr0c2Vlju3jFO6dJKI0kbMZknU0c%2FEnqdbNu9FgL2y2K5dMt3dk2zr3riJSlWB1jBrhuMfypvgwREItYIVDE%2FCrLFTik3C7aSjlvnQvunBusRjZoM%2FGH0JX9ybwbQOv7%2FwoWXZuVPgqLypa3ycCVO6SXaUp6eFet05t%2BDQujQTNOZXfWAAqCI6pAZbkIr3J9k%2Bpo93pooYUcrFPe9Zg3xhbn40r5VQjTU2RG%2B5I94CDl3FhgfzEoET8yMBZvuJnlVtYYEipW0WobxVem7CtZxOdDHDg1KrS2DlBOi6hAOkNvIbUnLYu6uoajrWLDdbI%2BJXPxgvIiWZ%2BISJPbb6NjmWDsKCWk0NaaItMv4M67Nn8d2Enha7wyG6IPQDLcWfVMB7ED611VsmDZjJbsrfPJa2QOOBaW1S%2BV4wzOLdB6fN8dbLVLGFo43g0jydLoJgj2a61D3Nb%2FpkXvjh26r07D5Z%2BszfsaDhCHQ9DA23IncqD2Sk5X2jmZIJ7KljdYOF8JkNgmjzsrGXFe1oQ8R4E91o1eCy7BfsTjGZuLvRM6K%2Fs9RhAmbIKCqj4W96vaN3%2BGvH3u8DwSAJp3SWFS23bVvGvdZBSkZJ%2FJRnCLCmaBMIKW5NAGOqUBJIhRXaYCL1sb66j0pe5RmenbYbujbk1H11p9tJoTkUSTeUYs5lRcAqMbaSwmNyd2SC9nWR73jDOrEeY8b0Wwgc21OH0IBp1m%2Bru%2BGgcODNbj5ZQjlDxQUac0QO0e56Khqhpc%2BL2zfWXs%2BCs2oDAu5hnGjgxMazLA2nlyEDwCQIX8tet3IedypcyMeHMhctCSnrhT8N3SGDGmyyM9Rg3XjVE4pWxs&X-Amz-Signature=e2523d961904693f5716d4a5889bd1c111334df33dbcda9c72629ed34931cf93&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HK7ONKL%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044140Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCCfUeRGBanELUeyS4nnXlDoXCstycfcuTHLr7npgtySgIhAPEXBm9jVEdQqirzHVA0WgPEDkhxBeMnZx3oXoDqdg2KKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwHnRdmI05aQdZmPtoq3AOiaDCkvAagRZLhGW2lKLlDE8Hgad8ZpgY1VkIuva6S47rF%2BTR1rTB65wvRyE%2B2B%2F652TZl5zyXJj3QR4wwn3UsOf9J%2FTAp6BIPXiTltR3WSE5jQruwirk81BGeuI2fxYqjzMk%2B8X3dpFD8elIU1U4OlR47jUtD00aabpnAMopYGE2VX%2BNyAt9Bq4nMI4IQLOqCMP5%2BBNf4zAZXD1JjJyF9nTLPNSLA%2F9MfqeBJElPGkSck5PkgOibjik%2BojW7Xuz6l0kTADCTTrKZ0%2BWtlwPp7pW7q1s7RTRK7cUsowW2akBN8jKWNqyT3uEtROpRBcBB7m9yrTLIJGz4iNfOpqx62YJm1Qr3ApObXLRsA3FG3Z2vItdFn2RpF%2BLg7sovKgxLVZI6ZfZ%2BumZPXKaWVGo%2BHWF2a5XnOzy48zMHkEs7Ac3Lh%2B9L3mEYkFyhpKu4ZosmURf2lPdjvvMU3blrIcR1MuKVnov41HkDW3kqLnazc42RLwZY%2B6i34ib80YLO%2BXWj34NxGhgRmw6rNnIOM1Tt7nS0gfs8GDqcgJN4lgOSl7SXD9B758oErdEkzKHJCtJwfe%2BesJoxQd61O8bA9hOCdcMeCEfEy1jURaeLVB1Hrv75B8%2BG6nODwziM7%2FDDVleTQBjqkAVnfR18PQZEpFSbhTORCoYIJMcBOiFQTnVtJhhlrakQ2pSLkBEjJ8CyVL2pMw76Fr5y6jsdkACTj9yGTN3d5A9I5j8hRzMIAyWpQKpm%2Ff%2Fx%2FR6F1Xm7eWlvg4%2FnMBtzHQVvcIqzf%2Bqpo96vool6cy3xuAQ67yu5K7xa8G6pQEd%2F73LdZfgdimwVp29lXiVpv0AEqxL%2BALsLqptGKIsUowYuxzdRI&X-Amz-Signature=10c9030d4abd00e2f1d8e01a7271a3eaf207527d9913fc5522a2003fd53b99e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XXBTQAIF%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHsR0YOiDnSzzhGXjvdc55hi3ry9SbJHnjKy3kWjfy2FAiEAlGICz2dLZoxHrne3WN%2FemWThj1lXj%2BfS5FDEfwaLK8UqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJ1f%2BzLkwZxKazg9pyrcAwKnm1Nr%2B95nzlVMXt%2FlMlMhDrml%2BzqOJrrG9CDqI%2FsGI0Mh3BIM6z0SCMp25RmPerMTAb2Xf6DNvDYCoDatS9oPp5%2BiLs5M2o3bfXe5Ee%2BrEJ2Y538ZVyRLfjWm4jkbYZHEsFHaDv3Wr3yhI6qSuVvrbQa67Q27arVYd32zCFaZMH%2FQoTrkL2%2F1XZuolVpQ0Af%2BIp0VD%2FUOwjLYSq6nHkGIoiEeXMsLPgYPhTPiitUZrahSEVnXlTICVBNcLFjTPZjy6pAN5hJLHLszBmQOH3KQw9zvZw9p3Pxq9tEb1Siu2x%2FBBqOSGx47MVB44jAyN%2B6XEjIPfJdsboLnSCxKOEINKcH6PrAP8fqmkuuOO8nsJnU70lNv1DYTxZp2Qdxrj8MpgBh92oecbNVgmXe9ZjwlSgVhhnhC6xyoBM6TVkfzVHqeySXaN5EuxLBv1OJMvBbFndDrkHRQnA%2FFy%2BRHsxxf%2BWRGynhd2hJTwCVdFCRKxFjGtef5Zygt1TRwypfNO54%2BEtwXOJBuU45dl2NrIbpKHjRdG9mg21yEbmoKbo7RUxNmYRnkbBuo7j%2FciwwG4JphCffLQ%2Fs6wMJ2LfaBxsvh761vnb1Hbtcysq7U6qmX%2BVqRw9S4AsAfkOYSMOqV5NAGOqUBBlI1pRcRrlV9ioM8qQaPmYOlYLMrGyRibx%2F5UKlINYerIzVLRGQMbG2mHeeT2HYhJ3%2F32I3PraPFiAm%2B7%2BhLFDzpaimkBmXjMoRdDmCxREDWzYjKJYh5XEuy4cYJXv8VmJ6qB5xid0egtW0pBHLco6lQcpXXoj1zuPbBsuqo%2F1GkJ0%2BtRFhaKP2yh1Hf1c2pLN8mffLinHnBfqWoZTk42FYiEBOJ&X-Amz-Signature=c168375383bc65823b9a65e26ec52a9c14a0154bd7ac6cdbde8f51252b041613&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VI72N3EN%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBk3uREbSmqnWIgk8RiAx9vQZYudsnOpfsmrdzg4pdL3AiEA8CjFfCRSlnP9jEWmYhOpEq88s5xxOlTMkgGGsfBIT8QqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDG6CAlQIxjK22DAugSrcA40%2FzGkCb6a%2BpY6NgCnjRgzd0gp35P3AwA%2Ft87A%2FtB5gCJC4rn0r7Dh5c3DqusLx%2BH3F3jjyzMpzZxYZpvXwGwoNkigaGZlvlwmBE1VeXeq9fdrO%2BmWzOFx2WobFKUKwSu52Z70929Wdt5biuzZX1%2Fyv1Y6S5LJ4bwRJt4dC7wVJnZCjtbgVv90IhqLMqvJ1axMP6Ka38GFGmxHf9fnZixbBl2wX0V5U%2FBTZRZBJ7oQRL6kVwEdgAriHZEF%2BopNHLFvEAQXjWTNFTv%2B2Sxi7xTTq%2BNfEkrgrm4Akh3hWTwf%2BaDNv6syRFvczstEEzgTon199PJvFOtpTIqpEhe5C8a02%2BaDld5ycsYI0aD7my28RdHGqpjEgxmiwnqPUV1SYtEp2i8ZadI9Rz6%2B%2Baavq0wiPllE%2FjwBhc1AthgUAa9EvLWiRGQeoLzzAd6Bb2KkqpNS2iEOggP%2F2xYQ%2FX5FpJaclC2%2FHk3tKV%2Bu2L21H2gGknEW90y6LZYmVtLQjWdtkdv84g9XQBs01td1H6m1qaRq6cRZ58qDZZqilza66IsilawxoayI7oJz51rPv4%2By%2FCN2TpvNLtdp7guIKb3bB%2BwxzKv31VG7iLnkvwbBTlWgTMBZTRlEmc2WLLu%2FlMO6U5NAGOqUBUTRiMYBUZokf6lUtXlKckiWoFJllgG1VpCORUM5xDpkDNlDQIDKnmgridsSckcnJaqqYYtfPeDmgObuXM4bL9ZSa2A9B67EF6fGsBZScGqZYv80Uo4ZbkCubx%2B3iWcJuQTBZME3sZvM3eFbu%2FPAwZvR4LI8r3IevEBpd3KzaIgDNni80Aag71Z1ydtuNZzYLln9jAj1D2LEGTT%2BOqk9JgoT3Dsa3&X-Amz-Signature=efd3eda2f220ef46ce2654db963d9941cb78875268bb2abf216c61b019353656&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UXRVEMVN%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044142Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDJnTwZc%2BHGdhYCF1iHE6zYY6F%2F6tdz9AMZV8VdaLlmaQIhAMEDbPceUSO1wdT7WARPixJNDyLPAJtpAbEjrRDNSKjaKogECL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwqLdLJ1ORK3FfLMcwq3AM6y0tlY22lmfgZjFv8kQC1VE6MFrC6NGNZPSw%2FUnNIz4sROIdIoxHCklQzd%2BuWjOOwFvat6FBRUI2C8ihVfFm2%2FWRj9brai5WaOQraKQM4OXkt1oIKi888IFKIq9%2Bohkh7EYVvDlKMvUrw6PFccGsQJTCV4HLp7mkJHSGd2tn8rpN4%2FkRd0KJ%2FQM%2BjYk928ZpvVgHnxwxtldgl%2F0oesaBlK3%2B2ITpUaJBHtLprfFBNEUYn1AgjnMA2ajyLVY%2BJ7LPtAz9cNZdvWkyAAsO7UKw%2Fa%2FP8BsK49MTtHakfg4uZUYJZ%2BFgsjpdWU3LWxaR5vWYkrx4fXGyqXcGeAlyhskQIRlpQDvtkDYh%2BK1vQPx6dQ3PYPzs8OVzx2PHUjlI%2BSehCtzWXDhWw9PXVujLcE6wHuuKC1l62alp1y%2FKEaGiKxn99zKxluiVYQwFuEfTNmqFtBwfO6hLKNZGDK1NkPBg1AuJasYuE%2Bovy7rKj5IK4aXBxWvnSXho48KTGJ7GHw3Gyvm0IhVU1oJJqeOwt56TCpwh4bf4M88rwpA2UIPwcdt0%2FBfIAIaGioebSUY1L2g1OKPr%2FFm02GQqOxTKBrf7LnJ7Q0UhYl4kuE4EdmHNCX1Tvf%2Bp%2Ftm4odu1WJDCLleTQBjqkAQZcZS5WRZSst2gywFgvwNdqTc%2Bl7Y3BAkW%2B8t7%2FpjBmU6vM02a8Kq%2BTrPQEWON%2FIXRdNiSHducQwTgrUfT7zsTHR3HAXDDe21tPEVlvxyltQmtDus4hoG7cVIejExwFIRBeRgcZPzDXgJuO%2F1m9%2FeOwuC4Ur%2Fpt2gN520yVB%2FIchAwILu7fBxW896W35NQOIpATvQXYCc2Tm%2BDwU6lHvFmXv4uD&X-Amz-Signature=ea8992c6139deeb59a1c45ac4e0fa12d092c27034adf914121383ec6333f53f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WBCNHGPX%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC%2FIFQiexqO49odWxvMjm7GbXxPFR1IE7ssKbcMsWSwBAIgCEWMAx%2FvYh861QFjwSUJtmh6Q%2BEsPZIVRK98vUTz7P8qiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGT%2FiykxOTQ99l6%2FeCrcAwFMzFj4ztfdFyFIWGeqIIP8nETFV6lemgk1G2AsR9svxlLcta7qxg4E0revRqrkE6A%2F2jgVVl7dw87bMDBYs3f5%2BvIXz3jvmJ1VbgGO1nV8H6WSMUwLyKP%2F7GoS%2F9IWBE8c3dmwb156JmZn0BmIIx4Fwf34S3IAJCx1VvM7pVhQlbKiDomfv41ky8o0%2FkT1hBg4%2FqBK48UC6e2sMr8LVUtvw7wwZCK4uG2dxIYdZjsIPpACkiUf10alchV2KfbFl5xTsC8xGiMiD1fjacdEZVq24%2FzKIwwzJigx%2BmM%2FNoiQbzMVu7hu3jf1kyaXBvYhCKdNUFEUG8pR2ApK%2Fcfbw527gixKv6%2BoVSO35d2k%2B%2FSPW9iwCGJfcemUUg1TklUn8gwHn2nL%2F6mNZCM486EvUMmKdBbbIfr6Q%2Fw17uYQX1ogqikvPpMuHKdPeyzv98F4F9NlsyApdz%2F02A3utkJe6Q%2BQxL8skLWQv2FuCnY8puxbKyYMRJ6M6oqoblWHdOQG%2FyPveaMo5jk6QrA8ptKc98LF1Ybdyv5mTDtLrVX%2BwOIXOfujL8rPNwapU4JEfn4DHWRR2xX5O%2BOaJKX2diazgn1vQXUlZqRjlSu1TQ2AfJBZ%2FPMI9aKiDLELvqX%2BMIGW5NAGOqUBrdfRc2Mh6wPWvoGM5VGb3bHR64HolWmX1M0HUnNzUWxnrJ47tZUXbiE1gc0o3qAw%2B4m4QmySMwWdH%2FV2G%2Bo6%2FrQGPNAvAgEHYlVP16xTrAwrcCXert3sV4dinwzf75yJ%2B1W3xGyxq0ZpqBSb7gZabZDyCnSEmW%2B4sRmVNQk5ZaicMBpuCscQJER8%2B28PIf6X3cQo%2BtP3PFtXnAjL9%2FrThFyW5vPx&X-Amz-Signature=a47151df9edf7ccb48540a02d04c2afcd3ec39a967c2a6421745b3ce813039d3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466THTMXRYK%2F20260529%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260529T044143Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDp18YAPYs2VaQoLXLQwMre1Ine7qoLHQjdyR2y2f2E4wIgFW4PLkzBpNu7DuFrJtsjKGM3DboMH%2FafpJfyQvOm2MMqiAQIvf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOyUC%2Bjw0s2DkL2nWCrcA1H8l6X9o7z5u25CLdOCn9WpMWfmkbW%2FL2%2FABc1froYq0iCY1h8HGGP49h8euZO3PdbV4OkE6rgPr9rMk3Ca2TyKVuxxi%2B2J17aXmoYaQZ1nTy3AlXtdZAfxoH%2FB1XUD%2B2y%2BElEzglobwFLk0OPgTfBE0U%2FgqQmiJmzAmhaFD%2BMPWj93bv36hqWxqfYF4ftbSQL9fFu949FWLadPVkkqKoHZD2gmNrPdNWmKw%2F%2BhiJU6Hpx%2B68PMrqg1WhskFr2J50ZQL2zbnsHMaoTpQvo5yBKUKnpYCdeDtpna1J5ycozSnyALODrqNPu3lWXqybPBZT55JY5tbhySCL6cJR51T9uiV07J0fUmgKVHY1ubd0IjqiFIf1PhAEXDRe097B7MAunyViF26XjelhMd%2FZl6gM4CSzuxucGR1k5euDVlgjhj9SbG6aw6xL6xDvtUHh8%2FoDHV7Ui8dxwFpyi%2BOv%2FvOKrQpAJwvfzvcpd%2BZ3KwoHDUSnLIwBe3UX8R1X4TytJYTwzEPLldU1f%2F2zdeEUxYDZ6z63M5bqVJevRZkO%2Bm4bXKZ4w1Rn2P%2FZzTwm9nFg%2BSDT8CgwV2AWyrCKt31tA72t7JFjsPEbw3VUPy0jDOC9bMbvYlE0jt3o1qU%2FW5MJqX5NAGOqUB9AVr2cLghK8SV2thoZ6p7NA2j1qrCzYKcSXJlgsa%2B5PR%2FtFvWJkTmYn7XUmLJStrfs%2BW%2BgHrhVSH4lo7tDzFuawd0XyqqidKQipoDBtYiakqduIy6Ua7KtewZs6XcT4sw9iccXDJGQtM%2BsJxGpJg%2BHK0arWa%2BV8qFmuNKAw%2B0Rv69jx2AqjaSDp6Jaiemqc83u9xyEf%2FeKk4qk4PRXbND%2BpmJj4l&X-Amz-Signature=54efebf002aba0bd00e80ea18ce953edf97a5c079132ecbe83e11027a146abaa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
