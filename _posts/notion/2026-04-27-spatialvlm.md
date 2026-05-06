---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4TYCQR2%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD6YUbtE5hCcrE8HhCNWD97X5PhhY%2BZSiQN3Wc6ICN4EwIhAPnIez6sp3Svnn9Srk71L8nWQ2dAvqscE1VF5DOgGtG9KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwYpyrN5Ff721xkiuoq3AOiM07lwNIF5LOjNOwcp3TNmYnjpj%2BdV0Oh0IFkuW4opFVE%2BE%2BhQGJJa30B0VPW4bSzl8eheK95Ng8tA69L3iZmgesjdxN576fEen9GZ1GBNwEYUCt3NsPeFbcjY2lLgtIXUfagsO9mLj6JJFVKY0mfc87kygp13wRIsTSj07r04j%2Bf9VtiLL9mD35NOIps4XQ2s4eUt3PpKCd1hgwTK68SjPJ%2FhG6QJ2nE5a%2BWuO8XjyIOK9bHM9k0F5UwVhEacAa%2BNYbbUYlySCUqK%2BMCoI6pvcOxy07myjkmaUooGtngxU4yYPhZAiP0rIA9ZCrnh6GFYXiJoIfHMLOZdI5q%2FZBpiz8aBNPa9X1I%2FzuQGySLVNHmXyEloaA%2B%2Fffu0e82OSFj4unh%2FuUeTS28US4R%2BiN%2BePgEcpQn7MOikXGwUOzW3hGJytWTU4Q38glZ1bYimTEHUyoDtw7sNnl%2Bqkso6e7Uy5ScUXRX%2FxyAm9AgsaUDNmYZNRidPtIowlgBw0BzvOnjlxPczNUmf2hlrZYOGy8ZhuThZnva1qFZmu66ly%2B0F0%2FsYz6iG0D6Lzv4riWtqbYZQlX9BP6WCJQeGCF93u0Bt2I9xJwL1Zhgxdavtwb9evno7g%2FGJgKcYGlUwzCv9%2BrPBjqkAbJCoP1QAyBqp5u4hH7xO47oNw8rQXIfaUUrOlexJ4u8L7dBFetJtUNQHSa4iaxO51a4OIgF401tV0irVKwdAJECpbhDI0tHqCG2Gz3B22CFQmE9PYWUhdJ00aJRnGindm9%2BJ9WTIV9hCJKT3xIg5X3OTWYrPcrAWtw2NNygUnnrPufrF%2FJIprKamme0FF86eFbsHRmEVwb9pwX4KBZCBuBFAbM%2B&X-Amz-Signature=562a60b206289a8844a7200a151d7a5ab2f71b90f87942de311a5f06efcb07c5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4TYCQR2%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD6YUbtE5hCcrE8HhCNWD97X5PhhY%2BZSiQN3Wc6ICN4EwIhAPnIez6sp3Svnn9Srk71L8nWQ2dAvqscE1VF5DOgGtG9KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwYpyrN5Ff721xkiuoq3AOiM07lwNIF5LOjNOwcp3TNmYnjpj%2BdV0Oh0IFkuW4opFVE%2BE%2BhQGJJa30B0VPW4bSzl8eheK95Ng8tA69L3iZmgesjdxN576fEen9GZ1GBNwEYUCt3NsPeFbcjY2lLgtIXUfagsO9mLj6JJFVKY0mfc87kygp13wRIsTSj07r04j%2Bf9VtiLL9mD35NOIps4XQ2s4eUt3PpKCd1hgwTK68SjPJ%2FhG6QJ2nE5a%2BWuO8XjyIOK9bHM9k0F5UwVhEacAa%2BNYbbUYlySCUqK%2BMCoI6pvcOxy07myjkmaUooGtngxU4yYPhZAiP0rIA9ZCrnh6GFYXiJoIfHMLOZdI5q%2FZBpiz8aBNPa9X1I%2FzuQGySLVNHmXyEloaA%2B%2Fffu0e82OSFj4unh%2FuUeTS28US4R%2BiN%2BePgEcpQn7MOikXGwUOzW3hGJytWTU4Q38glZ1bYimTEHUyoDtw7sNnl%2Bqkso6e7Uy5ScUXRX%2FxyAm9AgsaUDNmYZNRidPtIowlgBw0BzvOnjlxPczNUmf2hlrZYOGy8ZhuThZnva1qFZmu66ly%2B0F0%2FsYz6iG0D6Lzv4riWtqbYZQlX9BP6WCJQeGCF93u0Bt2I9xJwL1Zhgxdavtwb9evno7g%2FGJgKcYGlUwzCv9%2BrPBjqkAbJCoP1QAyBqp5u4hH7xO47oNw8rQXIfaUUrOlexJ4u8L7dBFetJtUNQHSa4iaxO51a4OIgF401tV0irVKwdAJECpbhDI0tHqCG2Gz3B22CFQmE9PYWUhdJ00aJRnGindm9%2BJ9WTIV9hCJKT3xIg5X3OTWYrPcrAWtw2NNygUnnrPufrF%2FJIprKamme0FF86eFbsHRmEVwb9pwX4KBZCBuBFAbM%2B&X-Amz-Signature=b8b828a63cf62b0d7518f4a2fb5d5153f4a837d4737f223d5b55497dd35b88a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X4TYCQR2%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040330Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQD6YUbtE5hCcrE8HhCNWD97X5PhhY%2BZSiQN3Wc6ICN4EwIhAPnIez6sp3Svnn9Srk71L8nWQ2dAvqscE1VF5DOgGtG9KogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwYpyrN5Ff721xkiuoq3AOiM07lwNIF5LOjNOwcp3TNmYnjpj%2BdV0Oh0IFkuW4opFVE%2BE%2BhQGJJa30B0VPW4bSzl8eheK95Ng8tA69L3iZmgesjdxN576fEen9GZ1GBNwEYUCt3NsPeFbcjY2lLgtIXUfagsO9mLj6JJFVKY0mfc87kygp13wRIsTSj07r04j%2Bf9VtiLL9mD35NOIps4XQ2s4eUt3PpKCd1hgwTK68SjPJ%2FhG6QJ2nE5a%2BWuO8XjyIOK9bHM9k0F5UwVhEacAa%2BNYbbUYlySCUqK%2BMCoI6pvcOxy07myjkmaUooGtngxU4yYPhZAiP0rIA9ZCrnh6GFYXiJoIfHMLOZdI5q%2FZBpiz8aBNPa9X1I%2FzuQGySLVNHmXyEloaA%2B%2Fffu0e82OSFj4unh%2FuUeTS28US4R%2BiN%2BePgEcpQn7MOikXGwUOzW3hGJytWTU4Q38glZ1bYimTEHUyoDtw7sNnl%2Bqkso6e7Uy5ScUXRX%2FxyAm9AgsaUDNmYZNRidPtIowlgBw0BzvOnjlxPczNUmf2hlrZYOGy8ZhuThZnva1qFZmu66ly%2B0F0%2FsYz6iG0D6Lzv4riWtqbYZQlX9BP6WCJQeGCF93u0Bt2I9xJwL1Zhgxdavtwb9evno7g%2FGJgKcYGlUwzCv9%2BrPBjqkAbJCoP1QAyBqp5u4hH7xO47oNw8rQXIfaUUrOlexJ4u8L7dBFetJtUNQHSa4iaxO51a4OIgF401tV0irVKwdAJECpbhDI0tHqCG2Gz3B22CFQmE9PYWUhdJ00aJRnGindm9%2BJ9WTIV9hCJKT3xIg5X3OTWYrPcrAWtw2NNygUnnrPufrF%2FJIprKamme0FF86eFbsHRmEVwb9pwX4KBZCBuBFAbM%2B&X-Amz-Signature=f9e805e0d394836e0d5144a6b89ae1f602ddfc2f25f8d55e5f75b138f280885c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664UWDP5IP%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040336Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDIZHPHXqhvPPy6hzgAbUYhxkn%2F94klO%2FYt336mKoJzdAiEA%2B8EttkYR1pLgQa83tMBy6UqMlLH4lO3%2BxG1QV%2FvfvZMqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPT5Tfio5CR0MmXEfSrcA2Grul4%2FAEFz5tt0No3ZRm96bklVj31BAi59EhqClefPjPKavxMbMqLDEzEFgd164XGEuhKcWrNUX0HQS9vze7jNBtGsuFea%2BANwr%2BiDdRNGO6NVaq6PSmdkt8WRAgvzkqeIETj%2BrIVdthe0GdrWwT5CdUftmggzx3ROXRK8VM22fEtcAaXEtkBNLWZYV%2BmJVZqSJNetnRxdXHCEFsGdUjeq1pXY%2BVf7JLcP8trXBCoCij9yL4o0lbhzFnsklFtay7q1%2BJmIhd25QsqvW7rO2rQphn2qdc3zzUkSpPwENJ%2FY%2BtiwNMyImygKAgTEJMz9PpnOPfkjFPoImLcfsn8gnh%2FJjcT1VKH6e3ai5nK1Kq%2F2TQOuYs%2BNtaIefhlkdnT9l%2F%2Ban8weL15Y9OCaWsztzSbCbQUSIxQKbwAu5H1aIXcKyogSC%2FIREPYRiDJRxPmf7eIDlRuwHhrMfEmEO1ufJ7UO0rp8qnfWnzQCumPBYuykX%2FeIBG8McDe6M%2BAK3c%2BlACIsmRWHTI2IuIIkacgC3Rby1Q9zD4G8x%2BFKfStsZo9desfFBSdKSsqhCqB4T%2Fx%2FzP6jLHE%2BpMTPXZ%2FBNcWSOqWc%2B7U9DWAcTbB0T3FmJSaModBrSX7SrPke6H2SMPH46s8GOqUBYSmQO2H1xWqEpk8rKCgBYi%2FjWfY%2BAm1rOLIujXRQO8Q1vZ4T%2B8N4%2FZD7753M%2BKBGOuGRrEST9Yfw%2BiaRBtU7eHAl1Qzn4%2FdqJ8roOPpiqHNR3J7MXQne943lA91HU1RFqqUOhwuGvY5iH4KNDUIPCojJ9wU0t6ED9M5zSSthdESoesaF%2Fvy0e4hmJbs5nXfLGIMwDi%2FfLY5zuLEJIMXAHsimGQLX&X-Amz-Signature=e77e23b6246c09a194532e144bd5815306d40cdf7d97e4a0d4c16a29950ee0c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WYXRUE4A%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040337Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAbqyuhwO0lEEGHzbpUB1RTTTBBtdW5L4wm3zVSeoA%2FDAiBDvBh21Lq6GMRgXXKob%2Fl4dTdnZXck1L%2FeYnwDHyDj1yqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM0zCqvfJyhWkKgk1sKtwDFKOrDyUkx6aJxyX%2BdRiWevrDDEVOPkUpFu2NLTovVMD6ayUmB7CXDJjmU5z%2BhqaijT3Yg3GDXN7vJzABKShEhfsm3ea8iCwoZYwJaxSFZLDRyG5Xe1tXYVt3DAKr2e3%2Fe9fXomqt7ZvBSqR%2FLjZGoSSy9PuYKOAwNFX32umgOe6ACAZRonCELdcxcpYM8m9L2BQD3hEnltebbgadIqiQuhD4mUgZQj5dY9r3IW7WZqYCayG29%2F5zxtztkjCQJwIaiCxxnhiSbqhl9%2FXCr8kLUhTy%2BsMMiAwhx5ZYxs45X%2BMDVvCFN0iI4dPtC4XnIJciHNSvtH0ewQVSK4dQDruPnGMDfsEcETQCTju%2B3Ktk2dzkOQBsMjNzmL5mR2aPswSV96leSjBXgr%2FIFtQeBibrvHjbquZVyWz6%2B0iKWfKYrwweiIDLfvBgRvpROaBgsaAzbtRiJsUUVxXUuABbH0OnID3N82tx0QGNm%2BROneqaTnQo%2Bo8i0pSciL1eRV%2BtbgkUqTGlRSyC5DWEIRFjf2F1Ht6BhUtz%2Bnlw%2B1FOugCI0izYZN7bK7MXHNDaKX7nqo3wkIMOsu%2FWcbC3UMfxg3TGuGAkxtSXoAKpDVLhNC0YgmQc9M5MPbnqOulmFUcwrffqzwY6pgEVhir%2B5PS7Mc%2FG2OrC1t1nMh6hpJ1pkXmxZt9%2BkGORYuZ6fHU3T%2BTDh13Z%2B0bnnu1uI%2FIzMrrR9CAbSbGFj9PK%2FsIMPulsA0L9Z8euuge47XgRSV3Q%2BbVRjqLzzAimCf0e2ABEsRxIrFKYPPseJxQstG2%2FCWBcU6xfHN%2BN5r%2Fjb87zrW1JMIilFloNSvc9Jxo7K%2B5Av97B51O5dUiU1goiSwOeLejH&X-Amz-Signature=14c4594ca886f4656e950f0d3d8678fdb37417a8f6d57f787c80fd33f682e169&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QIXC3SF2%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCG7sS3LjBnrt59anX27%2BM8sb1OaPhgQ6dhpnSnSHYT%2FwIgLAKhodKoiMsBLKREKrAcAmwOa7pjG8SxDnJHElCxggAqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDA4yhn9HuzxA7MkFByrcA9BowrKpL7BqSaxRnVSYAjRfsJEnlmu2Wklbo2OJQEA%2BUOVWAR%2Btq9FY1KIo%2BNrCb5ScOssOZJcEnh56ZWBv3nfGGbqFVb8xMnoGsV1sNIORwh8pioI2B%2F%2FMS2yJAMNlnj5a13YeO0aPDIzX2guTB%2F5D%2BmUcUEeFIKDOqIM2fEYDqRqDhn6Mg2lPnYNR0lWeTFjYmSjuaSt90gjnO7snHCDFCh%2FfhKUV8dqqwBxT05ma5Nyoqj%2FzYPaoafk0VJF6qA9FF5S52aO1xgdtcb%2FiOVTLSyWprhjXOYFmR3bjLxIXa%2BTa8n359VAvKY199177RGcCGCG0Sjfl%2Fh80UHghFTaKCoh0w7MWGczcJIKr%2B4hLhNz%2B3Pv9Yqi0Kt%2FXOeWsbTpuz%2B3%2B5Bma8yYBIeaja1X8xPgB2jgVC4qJYtPeuD4Hx6zTwX%2F05sOVV90FrK9KXAf22qfzb8BX0ao9GrAopg2NTcxcAToTVfDjIJmG24zBxNsBuEaUQQojSf8OT3EEO3tw%2BTEfn6dlGISvgjapou4LjEcbR9X4F4YJQysF%2Bp%2B4A3EvKrxvw%2F%2FZqzKbvAdWNzQBcm19aqNhyTb62SLUv8HWUhI94y8mfVbfOvKACUpw5k9%2BW8VtgeLJ15u8MI336s8GOqUBJOtb8VVEErnrAYWS3xNH5a3v6vGhYUcRD8H3OeRtb5vskckp6NGKln47u0ZuVMAY9xQ2RuC6fXzXgfoYTYDBiWohqt9P6EFfjwuZOSpbELWvIaMsPKC9TkgDoGxQ0S0XXjqDui6OZyNtg12pfZif5S%2B8dtgKqGvMNGoABcb5OQxtfjyQsWV0FyFY4tLHgs7U%2B2zQrhAiKT9QGHcbmIda%2FjL4tpEL&X-Amz-Signature=236d7c892a4104b22104cedacae572d898bd76c5f20d19201d20412d36e6d7ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WMQOPMNM%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCvC02cEwlOAtk817VkQ9tDGiLBOYwpTXsfxa7xfwILIQIhAPIHYOKhIs6ycFKPVoUO4jCoGQUqv78DWAaTbxV6dY4KKogECJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyZMFfDxLZz022YM80q3AP0YCESY3d%2BbnFVyp84KnSSnX3BiSE3zl8ONXz5NoVJvO2mzbG4aNCsgxTf%2BAZdUBjyXsE0%2B%2BNChy5vjcaMZ9YeIc6oOT%2F6a2iJjWst3Y21cm0ytMvg4bc3cYREQ%2BsizJ60G%2Fzs27tzbYxD9pFvONhIFBRtdE8FRe4hUtT26DXZJTTXH3LW4a5qwl9XmDWZw%2FZ7Blc3UXue%2BhUN8e6sq8cVmTD1v4%2Fwmcb0wGoY0OWVFH%2FuU%2FqORFtdKLdg7tPM2yaiMS%2FCuiDosUr5ozXTU16neqfvtSeKMkWSI2Uyj%2FIt39QMed3HY6j4K8YnBUCCwM%2BpRLKqKJKDoX2l4Eq2cL3M6wnQn7aJ9tTuR8hDiWfL2kZcpNNzqRhia1FsHBalWx3%2FaenLlzi9AFpjMWa%2BPmdO%2FNLjMlYWuUuNMg3FjgX0RAuwaI1x5sXzVFSB0F7TbXQkIxItz3JSLT6oP4mHNUVO29sNCo5iJ0KR857d%2B5EPOaG1MqKBljUp8hQB2sUpWWdelNoupyeOBoWowep5xdgwzJ7a%2BxN2D9HiJHUA%2FBrXxPLQUlOf4lbao%2FWbbmN45Nko%2BBt%2BesYeNrZIK4BpKNuDXgu%2BWXwvSAJM99RkRhfjXhN0wlId3vmlRu7JGDCw9%2BrPBjqkAeh3DrJ3cgn4BHeH0ODTvnZ0Ma2mDT%2Bd35YuobPmmC68habH6AJbuaerrhKilYUoCydR8hs0aDLL7FzA0MoJN3uQId%2BFdpCTop35C1GejpdnIaac53cXTxiaMZDi5UDnI7SYfWA1alq2vvbIFc74WELr5WWhm7Oy6uycu7fE16XenL9S6IoM23aNCrHWHBZyARhOnfXsiufARIpigNglhWDbCA0B&X-Amz-Signature=5e127b130c5459c95a29a98a6512a7d279308f897d417e70efed370409662634&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XYGK5MBQ%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEv0ldst12uvNBJiZqQcHbl5CWiEqemqOx3wk%2BBAKTClAiB17nrRLNuY0fO4x7hr4depkY4jgNrHwszr7Q%2Frsk0TzCqIBAiV%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMMC%2Bhp6jYwBuRrP23KtwDav089kk1C390%2FyOjRa9q%2BSWrwn0fqW0C7UJu5QlXiha%2Fmikme6lWHqg5bKCu28OgP3B%2FAVBaeb2L4sz%2Bs9EAIbhjMJkpERgfq9pYcEx3FX7xW4OSi8oKei6KfDq9X1rRJj97liTBYK4Q6tt3k%2B8Z%2FVtFyx3aRNg1Ce4%2Buc%2FSUr60x1JSkoPK3vgYg22ntYek4bGfSK%2BL6%2BDP7Vwar2%2BcKbjqYjB3xKN4wXuZ29p0jeOhlpRAAVcWEm3iYA5giri9PUvCpmSnJJ62H5I8wsqhIWFvP8EHC1Iz5ozQnFaLjWP4PjzBd1tf%2BZ9%2FlscGIc3mnWk%2F%2BTtbOhUQF9h6fObBREuhbKImG868mWEyYkQboAjq0Wt1zPch9t3tWgFDujWS9Zpoub8JyoDXzBd%2BWdsKmq2iDmHqdlUygDA4Ydj%2Fw2dfPRQZhMV2di%2Bt8GQb3hLsgOu1KK1RL8obwHPYhvbKv7f7j%2F%2F58kiouHthrYcMXMufUAyy6Bl14kUnmcISZEiwnXgch79Vttt%2BC7O%2FEgsM%2BszBL1KnUhEXYDJFXGF6kzbT%2BEghqPeCrt8f90AerobBP1k%2BmHz4SfvNK3N%2FgV%2F%2F80hnJh83Y6I2JCaAe%2BjkrjP56xkGO07GhPjuBNYw2vfqzwY6pgF8hZprP56esazG7qMkbJsQ9k%2BMkgB8hP%2FWtXPKROqQQ0V00RV6CMcfcZLWdu71j1jB1fSMhjf4VILtoXZ01U7nEz0tyrH5%2B1y3rCdmLk2REZOVwG2aysEvnW5TpwlG7lpQEgFcrbhLXNnaVAFYZUTs2KqsRyKCFZbiHwrfhEXBorB5T6nG9XH7qugYP7TGS1NxpWiryXu3vXhmIXyR7%2FdSe1n9WnrF&X-Amz-Signature=398da0d629019d4c166793edd4f0cecd633d2014b584d62c1a724a1c96491a70&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZLGBANAF%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGsxis0nX9qDV3M3gdniW2OYNU3EN6sr3WsH%2BBBwi%2FoEAiEA1EOvGBQQWsnTyN1V%2BIkSvVcTzM3jxykE2DhC30EHB2QqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOuEgOgLvLJMO3fwFyrcAzH1ZZ9nU4yyQugtZSnk83XBHslRGdQVd0JYbMt7halL%2F1bN9BSoovyvXtdARAnoyLuT2OQnyuvs7ODSnf43dtDo%2F7CDUw8jzdBK7YFBF%2Ft1OulvY3BHSK4MEdRE3zFQ%2FU9iG4suc8%2FZBp2ousUWawHlqkBGB3sXE3RNBlu%2B2z6HzWQ3w6gAuQfnoHj6tfQiB3ehJ%2BvMmsvN6Sa2Ian8GSXvz1nHI8l83Q0D2RrlroUussl5TX3x7BsHvpsSVeUOHWspmXClZlT9wDz%2BJfHGXtvPPpoxN%2F6IT9Di95NgrDkxulljMBItjgaSquTBgfoZHvuFoOGEcqzOo5cABM32wM52UmTd2leNSdwF%2BL3p2rB4OiEW6c0Mvp3IQWvFZhWh9o8CDvN48GLLtWdHoSVrg8QjrhpEm6x0aOO8dujG8n4oXMOtKrw8mrPlA689rXl%2B0Kh%2FSudUJeyVV9JjiDRARSWpMHwHn5SGgLvo2230rKxDVedhVDlZnSRV5D1s3Tb2MAWtVhjnmp2AXgqkIuuguFWrCPR3NMwFzV9prDGNRCsUERp5Y5D0XUu7KtbabJKYE23WvXJPPIrkSR1AljdtPUEZZ4vCBuqOW5nr8GX45JVlXpiPlZdZnR6g%2F59IMKX56s8GOqUBHn8eIMk24Nbr366cNaZcodaKrXFrqjgKoxBgJ1hm5B33oNvHbgU0ILwMFYeCBhX8VtaD2wEYIBk7rR86QrjnVrW4%2BNbI783IHLCtMMV7dYxbWzDTDf%2FJT8H2O9%2BaaSwHM7Qh6LxbhgqHJoKlAMYPoERbCzFBdCBFrfkU0yqp5cJDZlHi594XKk9pb2%2BSJ%2B5b8hBvj8zYNiiLvleg07pPDGTFsiA7&X-Amz-Signature=8ee35b3c9b90dbaf2f4b52172139ebef9e1fc5dcae5759876d1429848f5884f6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665GHPZMGI%2F20260506%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260506T040346Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBFysL6D8i7%2BrijfgQt6BhicMTij%2FYyHa4zYTAvlHJV2AiEAzd9BVqzsXtKgrIJSWMJqfND8za8D6L4NFVOxu%2BGhkfkqiAQIlf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAmC2GWDlriQGFX5IyrcA08IyOKTdX5gs6COy1eQ%2F6kXr3oo2nXyV6fxYpkPnNzG2U7k7eLf33zBQj1wYx8yF3gUk02tsicSbmT4M8ANy64JN1OZSWpw7DasKVkHKBXUJPt26osXyWnl5uKb3WS2Ewdby4KFQNWbRrNSt4NfgfW1OnjIICe1kvfg8RZhXTVWr%2FHUGD9DxItXK7a1zmN1mFziN6XzQcR7VbR03tnsVImPjNzOq%2F85j4bjExlpg7D4rp2IFbhnZPJihBX8w1S6DJykSrfOdqLKvK4YPKmvPborOuKQZyJ2EtbAP0S%2FcMx4HXXZw%2FSSsmrrQ%2B0ks0nwZWEK6K%2FzrSHbz%2B2f6s5g3DnoCmQrr4OPmMGu00lkt1lt5Bsg6X1RKdEaCKcdMeLVaiuywgKFrzX1Lrt028BlxYB6Aqh8u01pqwYVsAuDuA14OJYPiHebxwqCjBrYw%2BKhjLOpF28IHwxbYj45OuyWCoxVGNfzKWGOXoSyAaP0MYD%2F9sjqbjjoH%2F8EBRkuAbMjGfvzeXPOffY%2FSu%2Fet07tpmRTQ9cDdCQGPgSB0ebZZYHyKhY%2B5a8ZnFJNV4BcEiafRzgHG3myJO4xlJJ873T5im90ICGdEO2PyVQl2uaPpcFuVz77DMxoC1UinGEQMKH46s8GOqUBrmLG6GjoZPwrcbukOEQbQiArZWxOzPoNR5E7Vuml7SWH2esQbMRmT%2FXWORrQRLfspLtAltWWbKqASM6FnjifvrlUGtNRImujXciKOpsiPF8ZtH58TzBli103me%2Fcp0tdKQbT1ipunwy8081RLmXZ5x2LtDXYjaqZqsfzWkyNCUGGkbg%2BjyYnw3C4LaJHDfdlYGlmDN3DRF9%2B8vKCjdKF8yHuJxfc&X-Amz-Signature=9d7a022097baeed99feb397f515d49a65eb08b4d7226b042d8baeb3e530e7301&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
