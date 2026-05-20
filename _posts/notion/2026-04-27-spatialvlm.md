---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q6HEDC75%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC%2BF4HLtfmDG%2B4GgY8dSTJhpMFIVw7ws9CVH4fV%2FyM7fAIgeALItCMPKhzzxEn64yGAOzW21qIFrt3k8XdnnLjiI9gqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMOrDyramSYqLMTreSrcA8YL34QzFCNqn0xsGw%2BYKRSwYyK1o39yuQdw0xscPftWhX57UaJhyh7HzZMj%2F9OEX%2FcAJDVh7UB9Y%2FWeqlgUiarXG4GQByp1ackrHneTLUMYLruDrXmm7JCU3elKAUMm4WtrkzFAHpc4FrKyEfGjbPtE5nwVGajBZHWrMmaIq21%2Beb5IvdSLNT%2BWIrvyazC1AZSZ1ChtpEy1CzANz%2F5Ne9%2FjXgrEHn75cW94tdbu35GILYS8Kcp3EafWRKQTesr7w3HGpCpTBwkt2X1ApdH1w%2BbNocg%2BuStorSE9rEZ8%2FDuk7Hag%2FlPJpDNKfsRxRAYd%2FlM85OdncbqGk6yk2Wste9X9Dt7IgdqbNtSgWdyqAGKqiTrz%2BOh8we6zkNkPpUXdUgRvXpCAdA1dasEYTBWZDZH%2BrxKf1FTAhbBDxWXB88yURD%2BhcaXh0ii4Yl6Gji6M4V0l3Hk6WKPvVXMeJhsny5UBKtSfCxTC5z6lV6dpnOn77Vz9oH3XH0rczhz%2BtjUNdG8p409qR%2BVwMKaByCCSd2gl7Pyopq96AqtU4YuE1yHjLdrrH%2F6S1jCjTKgbyQq4CGnLNoyP8UTq2DRpFFX7Dh7rQ0ls%2Fi3aDFRx4usm%2BPYmmugfLFqP5t29kSK9MJvatNAGOqUB9OG8payA8pU4afItxGTQilx3eCzdkcT88gzs1DydtTs1Q2Ky8Ht5gYymU%2BSS3MKRcDYdC08ECr%2FVLdo%2FixjuP0W%2BR8UbQYgdbdHVhm3gyOVMEmQviwG%2FTOE4XOvt%2Fdd8QIbvmD35MKCb76nmXGq%2F95f5wbeoz%2BrME9uQaTD4g0OIC9ed7%2FzULmozhh3STdkyYpNeurMLKMTsEr3EDSnBkkl%2FbDQo&X-Amz-Signature=077e10ef2f25abe310fc0e8a2ebe2b2de364515a4241349914f76e17c895bc20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q6HEDC75%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC%2BF4HLtfmDG%2B4GgY8dSTJhpMFIVw7ws9CVH4fV%2FyM7fAIgeALItCMPKhzzxEn64yGAOzW21qIFrt3k8XdnnLjiI9gqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMOrDyramSYqLMTreSrcA8YL34QzFCNqn0xsGw%2BYKRSwYyK1o39yuQdw0xscPftWhX57UaJhyh7HzZMj%2F9OEX%2FcAJDVh7UB9Y%2FWeqlgUiarXG4GQByp1ackrHneTLUMYLruDrXmm7JCU3elKAUMm4WtrkzFAHpc4FrKyEfGjbPtE5nwVGajBZHWrMmaIq21%2Beb5IvdSLNT%2BWIrvyazC1AZSZ1ChtpEy1CzANz%2F5Ne9%2FjXgrEHn75cW94tdbu35GILYS8Kcp3EafWRKQTesr7w3HGpCpTBwkt2X1ApdH1w%2BbNocg%2BuStorSE9rEZ8%2FDuk7Hag%2FlPJpDNKfsRxRAYd%2FlM85OdncbqGk6yk2Wste9X9Dt7IgdqbNtSgWdyqAGKqiTrz%2BOh8we6zkNkPpUXdUgRvXpCAdA1dasEYTBWZDZH%2BrxKf1FTAhbBDxWXB88yURD%2BhcaXh0ii4Yl6Gji6M4V0l3Hk6WKPvVXMeJhsny5UBKtSfCxTC5z6lV6dpnOn77Vz9oH3XH0rczhz%2BtjUNdG8p409qR%2BVwMKaByCCSd2gl7Pyopq96AqtU4YuE1yHjLdrrH%2F6S1jCjTKgbyQq4CGnLNoyP8UTq2DRpFFX7Dh7rQ0ls%2Fi3aDFRx4usm%2BPYmmugfLFqP5t29kSK9MJvatNAGOqUB9OG8payA8pU4afItxGTQilx3eCzdkcT88gzs1DydtTs1Q2Ky8Ht5gYymU%2BSS3MKRcDYdC08ECr%2FVLdo%2FixjuP0W%2BR8UbQYgdbdHVhm3gyOVMEmQviwG%2FTOE4XOvt%2Fdd8QIbvmD35MKCb76nmXGq%2F95f5wbeoz%2BrME9uQaTD4g0OIC9ed7%2FzULmozhh3STdkyYpNeurMLKMTsEr3EDSnBkkl%2FbDQo&X-Amz-Signature=4e54a0c4bbd42e5a820faca467f2090b26876eab2b8c3180c1cd41fe8a4ec1f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q6HEDC75%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043531Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQC%2BF4HLtfmDG%2B4GgY8dSTJhpMFIVw7ws9CVH4fV%2FyM7fAIgeALItCMPKhzzxEn64yGAOzW21qIFrt3k8XdnnLjiI9gqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMOrDyramSYqLMTreSrcA8YL34QzFCNqn0xsGw%2BYKRSwYyK1o39yuQdw0xscPftWhX57UaJhyh7HzZMj%2F9OEX%2FcAJDVh7UB9Y%2FWeqlgUiarXG4GQByp1ackrHneTLUMYLruDrXmm7JCU3elKAUMm4WtrkzFAHpc4FrKyEfGjbPtE5nwVGajBZHWrMmaIq21%2Beb5IvdSLNT%2BWIrvyazC1AZSZ1ChtpEy1CzANz%2F5Ne9%2FjXgrEHn75cW94tdbu35GILYS8Kcp3EafWRKQTesr7w3HGpCpTBwkt2X1ApdH1w%2BbNocg%2BuStorSE9rEZ8%2FDuk7Hag%2FlPJpDNKfsRxRAYd%2FlM85OdncbqGk6yk2Wste9X9Dt7IgdqbNtSgWdyqAGKqiTrz%2BOh8we6zkNkPpUXdUgRvXpCAdA1dasEYTBWZDZH%2BrxKf1FTAhbBDxWXB88yURD%2BhcaXh0ii4Yl6Gji6M4V0l3Hk6WKPvVXMeJhsny5UBKtSfCxTC5z6lV6dpnOn77Vz9oH3XH0rczhz%2BtjUNdG8p409qR%2BVwMKaByCCSd2gl7Pyopq96AqtU4YuE1yHjLdrrH%2F6S1jCjTKgbyQq4CGnLNoyP8UTq2DRpFFX7Dh7rQ0ls%2Fi3aDFRx4usm%2BPYmmugfLFqP5t29kSK9MJvatNAGOqUB9OG8payA8pU4afItxGTQilx3eCzdkcT88gzs1DydtTs1Q2Ky8Ht5gYymU%2BSS3MKRcDYdC08ECr%2FVLdo%2FixjuP0W%2BR8UbQYgdbdHVhm3gyOVMEmQviwG%2FTOE4XOvt%2Fdd8QIbvmD35MKCb76nmXGq%2F95f5wbeoz%2BrME9uQaTD4g0OIC9ed7%2FzULmozhh3STdkyYpNeurMLKMTsEr3EDSnBkkl%2FbDQo&X-Amz-Signature=96a3d1e8d040d9ec02547f1cf10b1ced96ae0e0e357c9af456df648bf7c385a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666PTEBTGG%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIFQJzRqlpeG07nDwvuEDQ0cBBP2QDYMLmZ%2BCpONzYR8ZAiBFQev3%2B9KdkWW05lNZazuzuOkjYMB2B4sbbVWtaFsRtiqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMiQITn5w2pwK9s9pLKtwDLwNORyI20AOryCs6nQIui9qOSQ8YEtZ6CHdhqS%2BLIOjkBvre3xTw%2B4%2B3JpCwDJZTsyQNuI3VfHzjWNZwKlJ12WcwbaOZNxWC%2Fk17U5H%2FdKONWazTvo5dcmBMdXR3o4BQnKutPsv7HrOa3sxFJJXHJN9q6BpZSa85SG38Kfr08BArrRt1xOFOTtR9YPN0ttSnE0G0dRy%2FLL01cVu8F9c9D8ssUoqmyX99X54XcJNUVvmbIczhEvCLYU%2FQZWiTQQgWqA6mE7PVEZyXW%2BY2wMrGW3iiyp7RGsaX22JXJ3MM30sNOqxG7MnsMX7Cf0lTgXk0fJWRCnt2%2BUIUpLGSNZHv%2F0XjQOfK2TmQGahMX8gwjfMByfKWxH6P7p0EIIcRTaHi%2BKFKB6xmolas05%2FNpry%2FfsQC9gLKaEYLBI%2BbWfG7fx135ZATDLM2SdInmpUiIegrvE9afKHg7uV10%2BVJLGTV8WvdZmyN%2FJDW4%2F9eR5mAbLCJgLIg9%2BwGXsIgGjS5H%2F%2FXjd6nCiroHacFbAIC4hglENiPMfCIPxxDm%2FGj4tuPeXTh8sFar30FzydHRDOUUxVSdkqbHlRY2e%2FT1Z4qB5MM98TePtcvZsn70X%2Fygc5mcUGu%2FxFd5N4nVHqOCNswntq00AY6pgHP3tgzz695pehf8yb57Lh3B1EmyioaSilREFntn33BgRQw3%2FDlHlsbvWXKukHszLB0RV7Fl7ABPBgCEMqUKmVZmceQyi%2FYtT4xPtJOw24l0WaW14i%2B1j949DZc5pDCLMgWPxg1h%2FQXfziwg%2BVwdXjCozASo4Y40gzI8MaoGXzi%2BZ37XC0h6AEMVDhKPyPWTFWO2eOCfXgwo1T9DqFORLuz3BvPXpt%2B&X-Amz-Signature=1e75c99712edcdaeed43f58d736b464a721197a30f8e8df5e5be1e6bb321e1af&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RZYAT32R%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043537Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQDIJyyK5vYp4AZeDAeZEn7bgpAJRcLgfWnACqQbb5bJAwIhAJR57Dn79EPPf608PAPL0R2UPWc9xkyGZI%2B4YF%2FfqswDKogECOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwngptpZTYG0agJQZEq3ANTtJe9MUbggcMQm67OVu4Jwuseo43a3lzkIi21lr26TAQkCDwKg7v80MDR7jnsGdaUhE00cUpGY1QURsh9NVRgajcBWZeof5NgQFX8xBQZfaZAJzgGs%2BKfL0rgVY%2BKk2j79E0SIroDnz2DmR%2FWodwuGaWHLS8o8yu7eljJ8BhQfHIbOw8547RWP6iReMZUZewsWoet2P17MqSNhYp14yCidjdIiDzT17eF%2FD66hBPwKbPYYHTFxINEw3IscDte81r96btWEIZcQ1kR%2BqASh0K7fS3QWeXf6918BHhemgFq008vrUy86MCX%2B6MekTzsVDnXwFiifq2MqyTT%2BR9yaVtN2VQCl646%2FheRCx0PCdLYJvSj2ss6YiW1L0WjhcbiPx%2B8MgBGIgh7Mhg3heA7Wdq6BAs36cvqRzMH%2BybZXB44xKsEsP2GnDCLhhSy0bstv6JrVKdOTIn7xTydZWblcF%2Bj8ofQYFe3MCqVE1d5IZjELv6T0kv43nI4ZMYCU5CUGQQhc7CBBbv%2BXeLM4qHa0tqJftdj1F9N1UpCyzn7vB1Taam9MuZmEzo5w7u92CdH9w37vaTXUvg4AhNAj%2FtJfI7fD4IA%2B7KqBw%2F7nd8ZtrRtS8%2FMeFuSVE4w8IrmDzDG27TQBjqkAc7fMPu8TI7ti3elNWQOpMtR69zQPNPDem%2BULNFBq0KKCT5rx1pA%2BazYt74l%2BYUlbiicePlxIlIhtC3P8zmXJ5P6zp7o6yu9GA3Cfa5QS3Y8EdGTfrrcwhnNFwFKG7mXB8447AFawi3x3K%2FleuSv8UJHsWeBMMNFeFdm905XTqHSpnEvo3bBA7Ba8atrz2UdWZ0bdG39A3mK8vNgvRgefyaZImhs&X-Amz-Signature=3bf6043d77fe2fdbd96bd196ba0121e1a5d01ec7de9963c198a4ea3dd0e93bb4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SNDK662Q%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043538Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIGIgAbAyHk1i2Df%2Bbmtvyiu91%2FsQ97fby54fXatltfygAiA0C%2BWwWE%2F4Xv6HYqn5oITplsCsWYlayQmWcr%2FDWY9jfCqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMuuzji5%2BDzloQCGZWKtwDsYNRjGA9te%2BLb67pSchV17So7zAf1Kic%2FBvsvRV%2FtxS60QFgvPh9%2BP6Sp18KzXB%2B56xycf5X8oNp160W%2FfvfVCdYxyR%2B9ZyZeAwiO58rCHdU3fi4B7y06Lhbxc2Sf8T0AJcooTCWZtZxU3%2BVSB6ylugke%2BMdRpI5iR9avdnNHNJIpDIsKMmo0slBHWLN6jhtHSOtg8bJZ3NDMSf8aD7ES0mxNxA6Innfea8V%2FWk4SsGb88zuQhzl05LdbKv9K3UAqg9heMi5xUqe9a5u9S1WUfzV4TTGOvcyJFRYPSiVsm4hvFsFmwc61jstu0DXr4sFfAPMhb3dA8LEZO2u8TZKfTlK07g3Kkit9OM7O0hQaqMcsKdFubcg2qhzUcF8jO6MoqbUvlaHVO2PPjUJvwC3FSDCBqNcHjRfQy7TKts%2BcwJCus1yr45o7DzKtiG8v0vy5lc%2BnOdGa4GcG9A4u1H8xfyTiuWKD%2Fo6KdeG6LUZogQ4J%2FPl7aTcT3nIF5%2FMcLtFMK7KaAoIAq6yRDuqkQvfcgJUyZ045hmCCkeDvxexNZSB%2BUlwYErKXbeQMMjhUw7h0SMxBHjNduih%2F1O%2BVknFxNQmbpMS1dCD6tmgyEaA4TxXuUnzc5OGZw%2BKBuQw99m00AY6pgETsFonx5j2%2BFoPkEvwMlIb5hqWmSvUQItdvy7AK1sCNtmfxwsPgFftizjbTE68HAcNuhR8HzMUSrRfPvf7YoF1oXi4qpJBYVs3UYfpXR1ROAimmbEiWoJArpIvyIBssJ%2FyzoOCTtEdEhnAqAks5lJM7%2FC2ysulAJx4Wv0ygfBCTi5gXUPqGo0xwKwiUZm5oCiF32%2BWUYN1bGw1aCPnoJEm%2BzuXU4BU&X-Amz-Signature=5dbe8b6e2a6869b0f70486ff6158b694666fc99db7ddea06fb5f17c646ba4d03&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665ML3HCMG%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQCKOBmm3k%2BQipofs6fHHunpohOpt%2Foa5xcN%2FTN4uBL10QIgWv3wo5TyNgdApzFYAad79rSMshDVAdmUx2RdKGr8kDkqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM%2BvZxHa8ds3wLPhvSrcA0praSNzIOB9NQ2Ch8V2Tsg63fmauzclNGrul35czoP55zuv%2FRjKKDxue5UrY1Sxei5%2F8gtrwWS8yxwNCZXjLaeOerGhqskfIhtGD%2B6EqUGzMEywg3UrJXuQ0R9IqDE69HuDlQ%2F9%2F%2BRz%2F5lvzKhd5eln9z6VZOs0fJvVqBLia6LQkK1OV0ptRbuufNdfN%2BC1cv6P8gLqeDfFTQ4A3GFcYz3tEwlveB34K4wNNgrFz16evzBkXAwaQRialawDgYgQM5oJi%2Fk4T1mn4%2FtKfjcnFO%2FT%2BB11sfj4Dcz1C3zbCQg0XLV%2FcIRgUF%2F5%2FqFcLo2y1gCfRvpzuq%2FBCJ8l%2BLacvqFl6Iu%2B65uSGY05uXEG389kdQOu4xcVL4%2Fz3xnQDwYMqQ7C9UhADAzbPew7ZYzb72ypQp1vXYV6OevPj%2BywcRT0iF4s40CfbuyM%2B9y%2FgxfXF4%2B8G85B3a%2FzelmtsMU%2FH4O%2B3KI7a5i6vIAsVTFfFo5jBo%2BuGXAc7%2Fw1RmkSoJ7HvnWqdXyvQSSkjfRuDJ9MozarKe2vlgc7yDFUjUBXJehMTdlH1grnuTDq74g8Bgl3SE1tKuJ0zyGuuxjnmY%2FpGblxeystieqC8cRt6cW%2BHwuodSv14QH7bEQmx58sMPPbtNAGOqUBSHq5sRykLIC3JclT752zGk1%2BInP2m4ju1ZY739Lh8r9fvChvewspc6P6CT%2F%2FPDOuDKtSP%2FAfPkmBzUKWGSv9P0iwcS3CGuitV8wRmdcPAtbd5E7Nk947UT9WWZlM%2BiK1w5q9KQF1jf%2FpXUOByZl4pSXIJh%2FzGb3ga3jaTooZSaVixO5b3Co2SCIkfCfV0WrxGEKVE2vZ8Sl2bUA5gQ2MfhDUf%2Fq2&X-Amz-Signature=d0a9387e074904cb9f2fe1a779ce3dd26200c37f0da25aadc616bfdf2a06e61d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667XIO4FOU%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIFEd0S7sTRcBdJfF9YiFWXQtmvCjE8KBCrQZJtTph2DuAiB2V%2BkWgs8X7Uf48KheEYEFxW1Ah1REAfvzkM2Of%2FJXYyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMATNELYuAX9oPvNI%2BKtwDlsirSk%2B%2B3QHXR%2FI0SQynFO2RErze6WzTY8uH0B6JIyCfqVTymWC6%2Fe1aqrcuV5cd2Asaqn5ITX1YDbCxS71IHSZeUgAgdPKBLaiZyegpskjbZrphRAmY1LcTox2lzrYjC7U6A1%2Bc9mVyEIYehaQ1mJ%2BuHSujAwjOeg2CkiKfP2%2B8FrB4ThGTomNV%2FkLeyVmGJuolXBLMGc7ZHcBWORKHLEwIlxqLMTE%2BEisQt2lHbEiXijQ7H79jijlWQ%2BpvPJm0L0oJIEX5oq09Wrk2yiu1G2I%2BlXfD61cH1M%2BFiMM96Peb9nyCgvmMqzu50ZlwhBpGNxzT3HlTbp0inK0fXE9GJDuORH2j32pA%2B9Xf3LNKZvYeAw39%2FJBiAv19TFCZTM7bfhc4nG6QIGoDNyVbX9FlXaQ3HBXybl4iXIWPA3CIsckbAEt%2BGhX9RP84gCm34MwGPKTaMX0tPONfhd9TdJ6MUB5ZCPQO3dEBUyJ61W26Jl0xBn8KhPP1APOxf7MVwjdYK%2FyMRUdA6MvUJAZZJqEh7oXACUXVrkVYk6OS0IqnYa2FhvwsX%2BmWY3wG8K2GgLaJOuzQ8ki9Yue0R6uggcaM%2BK5hJu3H5pd%2B28RI%2F3crFPsVdBF7jTKvznYIRMEwqtq00AY6pgEyH0NJYqOe4CplCps19ds20hIewJLUX%2B0wBqN18cux1CrYBXErAN2g6tqv6j3DIrQ%2BctiUvwhy%2B73qx%2FMTElct4dBDRZepWXgJ4NRl8kuBQkzG0wC%2F3gjipAQeC36Bg2bYaI%2Bg1iszEnPCz9v0M0QOKB%2BY9anx2GOo7FQvvAh92ca%2FPgz%2BIdGW3YYlTC54e5TXbyMbUusv%2BXGlkIVDBQN7tZGZ3NBk&X-Amz-Signature=99bf4bc68beb213ade19cd1271174dfb3a04280116578691d5b4036df08cb72b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QDXX5PI3%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJHMEUCIQDl2Idj9KwEkw7hIsdDEcg20c7y7aTGEXnrg5%2Bp3tHspwIgVXkR%2BCUXkT5BMdwTbgGflTpRKicY3LKcR%2BKrHXQ41RgqiAQI5f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGMr1d2cYbat9IIrJircAzWU12Bb0%2BB98ANlACL1nrHZqNg0bIEO%2Fi1IS8Iu13cuF4GgtOmrP2p7C0KhZKiqKz6tPZdLy8OMprq2qHJa0tTiOT8l3no1vB3miMVeCOInB2%2BpV9%2FGiIFvxntXbXRgKwefuzkxncStzLSIqDDINRpIvafOfxv5HdWaD0rMjcLxehygrqCxqt5D3s4komPPgFms%2F9DOjP3Suvbj%2FUgZuD%2BY4zr1H%2F6irauzdioq8xwnM%2B3h5k%2FukqocsVH5xydWzO0%2FAJfcn5DpNFI50ur6f%2FuBp3%2FkH2hbK5wHyjY7Gqm%2Fn49TJPIPPViqnQpo4PUbC2WS9zRlLXh2bywnq3Rp1Zj6JDRhaxz9nkyjmM6UbbHF8kcUMFbqC7fhUJRIy9M7yE9xTCZs%2BhPz2Ww7PsfvFK5z%2FWT0sMSYDF1F3IxCMOmjc7CN3qh1XKZTpTuquzyHdaiLsT9iapY10KZztZergdd7KW03rkXBUXiKs3YmCvSiVLyiwSR55mw8cB5D2qU7pOOD2yoZm1l%2BvzvTsoThoN8jcjFbl4t2pg%2F05EUyPIql%2Bw1HT9Fy7%2B8xczJQBnkQF0MhSR8zkql8vUaFlJz8c6YpwMGT%2FMJK8fguw8466cpj9A0vEFBXEnj9n5sCMMLctNAGOqUBajPoLK2dou4EscF4SKYNz915nnR%2B%2BJj28t30gURvRvYX6MjG%2FbxjbGmyfRrQhoGGGZifa4BwB4%2Frxv0W%2BU43zbF9KcQWMaarC%2BA5kxi7mL1%2B35l2YnDPO3O5nmQk1%2Bao7RFN9GujVlrrk%2FYpoxUnyOxTFvKGgiPVuo3P8KQXKBxN4vB1C6VL8S93DBo3sj%2Fh4ZUvlwIPCGRVlZjuECCmrTy%2Bs4CJ&X-Amz-Signature=a81450d12c3b5410f5005a50878c5c768acc3dc1944ef19464b3e5bd66cd9246&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662MV5ZXQY%2F20260520%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260520T043539Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIBnwnER5QSvBxxkke%2F0hHNaUCg%2BPRrhFUnOx5CIGr4Z3AiAPwCo1ADXjLeM3edodFd3kFl1ZqE%2BgLCzG260s6%2FiQxyqIBAjl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMhREKoO12RADwOZRvKtwDG9lMAIGuohOlbnWBpPYxXdi%2BiH%2B3kh6F%2BV1u6%2BbK1pDS25KFG3dAO7Rew8xlEm9eWphBeLY1cwd8XG2HxJh4TgYjGPPIC95WrKb8jg4ePwz7AU3iMg%2BjMUmqxPTsKR04dNvrkjf1UcN9Dy7tBGHT13a3c7ANvKEQPTo0Y4ZfqEpWaBEyvlipi9qzWDhXTYYNgweCYEjs3WJu3%2FY4J1B6uXZGy5CErWiRWpXV98KCrg6Swd%2FKy9is8%2BnfiF1oEoOfKmUItu338GhHIkM2Gg3G8R3LfOg2ZMeVKROu0nWDfTJxjpB0sTKRBQE3KMcKPoAtoqA%2FPFHCtODMPvzqMTlV5MHYEPhvj4C5u6DNvzGF9sNx9barn%2Ba5iXhAiHVwzaNVf45OUBz0y3rLaFzgB4F8nLM8XIcEcqP89JjmmrYM1LefxHYT%2F683h6T65%2B%2BO0tgxVHrJ8Uvkw5sQCwQjj9VObZG7b43Tu7QmHlD7lH2kCTyhFizYt%2FDXbDQ2opvwlM5Mbb5conIp%2FK8n87Q%2BAF5PAjEl%2FnKLeNZQoP5M%2BexPaf8ddji1gmFSKbWSj2zeqzMHrIwk6e4kkZ7zmlRWGNB9eiEV0PUfecu7YxSaqalaClXFWsN33dvT4%2Fzg4Uowqtq00AY6pgHJUg1lyfE6%2FKmJhHMA%2FLDo1vBUciQKMXCuY%2Fh0IK07qXQHYDgg2OZg9BMb0x%2Bo0G07yyhVBin%2BFbmQBLw7THop%2BsdiXOkzvfpzo77gTEGBytACGEogu1jDpeDtuNUwitp%2BA43zgwONliOyTUWmZVBwwpBql37dJU0Ube502LNiewVFAfzcJHTwWPN1X%2B705ll9FMjQOTskpfEYGNr0msTdJPwRxtSJ&X-Amz-Signature=524be96896da270b113b82214b5cfb0bdee8ca207bd1c7cc69628bdc75932b26&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
