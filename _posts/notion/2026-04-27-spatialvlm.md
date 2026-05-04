---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SCWAWSXM%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDuLvoUjltks3uUnvcSEJtUHPmtc22hb37bU9yZTjv%2FFwIhAN34IrMyb%2FICGFcJDLcc9zPclGOx8wz1IQg4O2%2F6ywseKv8DCGYQABoMNjM3NDIzMTgzODA1Igyyrt522O5HNOKo8toq3AN4%2FgJmM7cQKZeDCzMInMi%2F75kSilhvnaHVUMNuL%2FPK%2F4iub1qDhCfkqpKSaXLZ7wIFC5JjzWOMRncbslVpgptEfy1keYZ%2FNXaq6DoMKzOC7O6hood9vFxbrj3Q%2BkqOyp82tlwQSdSNBli3ydWd1m6uBlIZkAh3l7bwjsskPzOQ5Hmz0eYeZcNKgsXeBu8carvbaP3bTlRWkFKv3g%2BLobRbgQDf1uqSSHyAzQEhbIPj%2FD02Ep7KslC3s2ICvNjwzUuQJrWAN15kuGSJPhKE8IuIZ8CQplZhWBK1DsAlNcfhp9ZuXjqWsdP0dK7Y4sYVTIdqIryXq%2F%2BzqSGOa%2BAeSK1EV6VL%2BtczPdLmoRhTD4SgBiICOC3Xwxy%2BQ1eFwsetsAIJuSDF%2FZhZt9i0e9feJeLK59bA6N4gW8x73Siv8sixsxzjP1PM14jyogmdxEbOnI9e2q%2ByXzJ4dUlvm9S8zcq1wB1VaFKg%2BW20KObTgXxTHDltnJTEZuVqq8%2Ftn5mW0ku3z9I3TKb671w29Lj0%2BZixAJy9E86gYWk2nxHnUUjoyjyaXLUC0KHPrcxfAUehB9Q90vQl2qMmcw1RTRO7VdYpvn6%2Bm6rClN8R2rqXiPW%2BS0F2YkJgJ3M2sSNRHTC3xeDPBjqkAQ9BMX4mrqZgDMLS4lIayi2EW6VpEUm4iZuK8XvVrhYGfEOXN%2B8qeaAhlvgdiY79ewb0FXbXtuGcQ0Evi5xAsaIIFmQRtEPWsdv4S035tzI6Hn6ZkqqZTLXGmHT%2FyOQxUCPk4dPdoWs76%2BqbcJzQLymAEkrXIWENObghW%2B22KtQbihrJWr9N0uAHVtiSD3KHwdnCjiVNXLPXqOHBFQ9cjtr4YaWa&X-Amz-Signature=2a0a84cec769b78297df2869cd0d183c14a0ef675aa035d335cdc152243e3577&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SCWAWSXM%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDuLvoUjltks3uUnvcSEJtUHPmtc22hb37bU9yZTjv%2FFwIhAN34IrMyb%2FICGFcJDLcc9zPclGOx8wz1IQg4O2%2F6ywseKv8DCGYQABoMNjM3NDIzMTgzODA1Igyyrt522O5HNOKo8toq3AN4%2FgJmM7cQKZeDCzMInMi%2F75kSilhvnaHVUMNuL%2FPK%2F4iub1qDhCfkqpKSaXLZ7wIFC5JjzWOMRncbslVpgptEfy1keYZ%2FNXaq6DoMKzOC7O6hood9vFxbrj3Q%2BkqOyp82tlwQSdSNBli3ydWd1m6uBlIZkAh3l7bwjsskPzOQ5Hmz0eYeZcNKgsXeBu8carvbaP3bTlRWkFKv3g%2BLobRbgQDf1uqSSHyAzQEhbIPj%2FD02Ep7KslC3s2ICvNjwzUuQJrWAN15kuGSJPhKE8IuIZ8CQplZhWBK1DsAlNcfhp9ZuXjqWsdP0dK7Y4sYVTIdqIryXq%2F%2BzqSGOa%2BAeSK1EV6VL%2BtczPdLmoRhTD4SgBiICOC3Xwxy%2BQ1eFwsetsAIJuSDF%2FZhZt9i0e9feJeLK59bA6N4gW8x73Siv8sixsxzjP1PM14jyogmdxEbOnI9e2q%2ByXzJ4dUlvm9S8zcq1wB1VaFKg%2BW20KObTgXxTHDltnJTEZuVqq8%2Ftn5mW0ku3z9I3TKb671w29Lj0%2BZixAJy9E86gYWk2nxHnUUjoyjyaXLUC0KHPrcxfAUehB9Q90vQl2qMmcw1RTRO7VdYpvn6%2Bm6rClN8R2rqXiPW%2BS0F2YkJgJ3M2sSNRHTC3xeDPBjqkAQ9BMX4mrqZgDMLS4lIayi2EW6VpEUm4iZuK8XvVrhYGfEOXN%2B8qeaAhlvgdiY79ewb0FXbXtuGcQ0Evi5xAsaIIFmQRtEPWsdv4S035tzI6Hn6ZkqqZTLXGmHT%2FyOQxUCPk4dPdoWs76%2BqbcJzQLymAEkrXIWENObghW%2B22KtQbihrJWr9N0uAHVtiSD3KHwdnCjiVNXLPXqOHBFQ9cjtr4YaWa&X-Amz-Signature=77d945419f7a44da413a89fd1a1ebe6bdaf382ba183b2e94cabd5ea0158ae44d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SCWAWSXM%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050547Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDuLvoUjltks3uUnvcSEJtUHPmtc22hb37bU9yZTjv%2FFwIhAN34IrMyb%2FICGFcJDLcc9zPclGOx8wz1IQg4O2%2F6ywseKv8DCGYQABoMNjM3NDIzMTgzODA1Igyyrt522O5HNOKo8toq3AN4%2FgJmM7cQKZeDCzMInMi%2F75kSilhvnaHVUMNuL%2FPK%2F4iub1qDhCfkqpKSaXLZ7wIFC5JjzWOMRncbslVpgptEfy1keYZ%2FNXaq6DoMKzOC7O6hood9vFxbrj3Q%2BkqOyp82tlwQSdSNBli3ydWd1m6uBlIZkAh3l7bwjsskPzOQ5Hmz0eYeZcNKgsXeBu8carvbaP3bTlRWkFKv3g%2BLobRbgQDf1uqSSHyAzQEhbIPj%2FD02Ep7KslC3s2ICvNjwzUuQJrWAN15kuGSJPhKE8IuIZ8CQplZhWBK1DsAlNcfhp9ZuXjqWsdP0dK7Y4sYVTIdqIryXq%2F%2BzqSGOa%2BAeSK1EV6VL%2BtczPdLmoRhTD4SgBiICOC3Xwxy%2BQ1eFwsetsAIJuSDF%2FZhZt9i0e9feJeLK59bA6N4gW8x73Siv8sixsxzjP1PM14jyogmdxEbOnI9e2q%2ByXzJ4dUlvm9S8zcq1wB1VaFKg%2BW20KObTgXxTHDltnJTEZuVqq8%2Ftn5mW0ku3z9I3TKb671w29Lj0%2BZixAJy9E86gYWk2nxHnUUjoyjyaXLUC0KHPrcxfAUehB9Q90vQl2qMmcw1RTRO7VdYpvn6%2Bm6rClN8R2rqXiPW%2BS0F2YkJgJ3M2sSNRHTC3xeDPBjqkAQ9BMX4mrqZgDMLS4lIayi2EW6VpEUm4iZuK8XvVrhYGfEOXN%2B8qeaAhlvgdiY79ewb0FXbXtuGcQ0Evi5xAsaIIFmQRtEPWsdv4S035tzI6Hn6ZkqqZTLXGmHT%2FyOQxUCPk4dPdoWs76%2BqbcJzQLymAEkrXIWENObghW%2B22KtQbihrJWr9N0uAHVtiSD3KHwdnCjiVNXLPXqOHBFQ9cjtr4YaWa&X-Amz-Signature=2949c88fe78467bae1ebee9fb6c55fec274d64902ac6ac3cf6dfbeb4eee2f793&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YAYVQ33N%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050556Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEBuczfWEvh9ILAiSXHOqcO%2BdcgSYjErYJl38k%2Fc%2FahPAiEA9aNjC4Re1JQPIuip0uqKL7DHUIcicIjpsg9oy0Pxr8Eq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDNBQOLsK4oMudJ2EGyrcA3azlQysjW8tQB92gjdV7zMQ%2BqOW4F9DiP7vWtZmQISA1RvfEoZhE8cU6WMuAbGD%2FFqaOwXt85imMVXTR4CKeCE%2BfPs41SRSQG75KtoGQefSiWXENtRuP9g7PGi6kUAMYrOa5hs20s3D5iX%2FTQYWEiG8PjWOrYz4hMl8EuSl6HPwQEK22z89uK2%2BXEDmWEN%2B5WyRxbR1NgjIkMiOlkZevuDYhJifsEgyhmfAhfaYEufb5QJwCT196vuVtzxII4mmIyP3gVjIzd8VvfBRQ3VPuG7qt%2FRjinkvNaYA8sg7Sv17SLxaVSAjCV2diJnYsUG4g77IZlJywee5v0XFYHcgnbpnzdXQYLzf5q%2BhMkvamUUYB8BYx4ow2hJLOtGOdP2XUQUvlzx8PMCbn6KOHeK%2FkA4XDSt66fhOGZEG2p0TaG8uc5moapBbzXQTKuiW6NrkODxVajH29XXdHiLJcL7R9wnorneXnPoM7PsBWy8J5wlhv1WQgzN8EXg33sfUVAqGfVoTBORz%2BmqcTEpz3hvWaH0JfXDHnYjPOjbX3zVaAMXfs3v7sBB%2FtTxwrcrWCnxrLmX0CHFKGeAt2tKGqA7pdBEoXm0140BbSqo%2FRld%2FgmI3BJRchNB9JWZT43n1MNvH4M8GOqUBPHy5dCtWYFHiNHk19jqk8bumyF8y4BuFFoRZae5PB2K0rKUnwKGmGqcVXimTDNPDwiqxiADtB5%2Fyyzh8HywCjt3QXe%2BB864AD1Y7sn3YSbCXQ62oZM63rCqrQh%2F0NqIuC571Hdibb6ir9VHMvYQ47fHftbyIl%2B9xJc6Ow9t%2F83EPvSyFJ9ZaOT3JFBhqj4bSQ7RqDOYv6E3okLfMXz4Dq9ATq4%2BP&X-Amz-Signature=675e5a2a957716b648397c33543167e2ddc678dd9ddfd6e401543743b997219c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665JTGTHJ5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGe7%2FkyIpI6BTMTeVxFhfDmpucih8ctH4iRo9SJi2XX3AiA23u5qF%2FAZriiUy7Hp0nuON39z%2F%2BafaGT86TvDeJvqkir%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIMd%2FJjB1IufJoneSyoKtwDDGPMtAJv6ZFn1IIEDN14apaBeDJKDSH0w2%2FN6G8iyJI5AqQ6VE5nmPQMN%2FUixoEr%2FGJ8JLZPb6O%2B77w%2BuTRUzCjolYDDW4mlI7h9VsotEX3fR6n6qx1Vt3dWZqfsFqoUyVf0QToIT9TwbhpWFxxhDxVoI4qV0u7Rug7mdcEkJWFCFVnUJ5wuOsJY9viXi%2BNksqNwkD2Jt5Yuzrv4YRHIL7hn4Sz5JWPKv%2BRFyh0rLJFUax4zlf1NIKIXdRVK4Ol7LPKN6pICGe0H6ZVqzLebheJa6tTCmzo%2FEqjeQtIhguLu%2BSAIuXwrmumJTD5OCwuFJLt4y2rejeczSsq6Ec8S1XZtZHlqhwG2ZiiGPu0pqppdOi3c0rDnfFZd8IRIIXzyGu1QDETGpcZKLVY3YflJcqnrYHMh4RuHbs1wQpVT6ym9cEIxh5su2gHlROi300bMG6Sh5HI4tVdNXNrexED28qY3t3YmCuhhQxSgUkX3KZPL3hCUr%2FOteTEl3hjjel3K%2FRzfeFh0wtS%2FtZbNbWkAtTnHW%2FQDIlUYjI0JqpGO60jp6iJd8iZIpKbQG6tZiZGU55YNmlYLGP%2FqfLp6TSBwhj%2B3skGNrywugykJ4sTQ4EpXlW6AnZTwsGf2x5owpMXgzwY6pgFaquKoTjie0TdVj4Vxm51Op3O7CWhnTo9Vq%2F1yS1OnSCjo12HjVlEOekdoH%2FU0wDqT6SF%2FkET8q%2Bxpb3SWls2L2kX3i2wji8BZEGWoib1sVT2STsipUHjUqKoE1X1ZJN2UQ1KcvHXFl1EYhRb%2BJDiXtExEgU9ZXzbYDkIGOaEmPeXgLuiwbDFwRwSrT5sl%2FZTguCrqMvdLsNqlchZfq%2BFWq2IS1A0J&X-Amz-Signature=dc67c9c2669cae5eb954bfd65c2a6150fc4511a558ff1cd404c21836c55b84ed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663LS4QKER%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050602Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIBBqSqGNKrK9p4nFaB6cszdo%2BZNO7%2BReDg0s7tOJyNCbAiEA5LB9DH6ma9qhRUrdiiCiQ%2BjcCVDEJSVDPV92VYI%2FcYEq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDEzdJ1zLZl4X%2BAgxUCrcA%2FvZNDFH2hFONunW8BkqVFdjQGykbZNWDs78W88O6ok50OefavZauqIR%2BGEqGuydNkKcNTz1R0ub0P8dmPogqbgivBtRMvyMlv7l9EJxvd2j%2FlrYu1X0ixBOT35pWdDpeoMehq%2BqWlREKhvsjTSm%2B29KfPOfIhgF2SIiIS2mfz9cq9Nt4Xy8OE7Ky%2FRBW9qg%2FOM2dXNc5bMlgkA%2B0zB2kS4FGbd7M3GgdKeOVJWs%2Bn%2BTVBRmsUq7f%2B%2BeEgZUHORwWN8iDDI%2BbPd1yKBYb5AiuKLNQWvaItKVXLfBNjG2pAU%2Br3D9JjdOuRwSM0WZSWpc6cn8wG%2F4oVsnLmezDwhOsqVvVL7geKzbq1HFvCtolj494dIXvW7z%2BBo6jUyVsVBPJZon6tVvTWHekg2nwHf2X8WBhy%2FeNGjKfgtJa709vo5efgAADc3y7TcwcdGNndrWO9E6qSogq90i%2FWyN9csZRMckf91%2FOGxlUN6ibISUsfjE4dBQ%2BojQ9hL%2BcP%2BFNJFllVRIhG42sVFMn9Euy5VG9ZPxSMKY4RPbeKW%2FvYyfRyhcE2yySkBqPgAn9WEACSCjAzj3sMw%2F3Cz8Y1YkkKlc4uftgxZxyhJBoZhjosJ5llMeeqG4tf8N3jPYmEFaMMTF4M8GOqUB7ejiab9phja8e6UjAvZHOYiQIGoUxG9nj%2FHhgNK2WOs%2BvEtY5AOY8XOEPf0dwCqaGM4G7XF9m4sDkpKyC9pOd0ox49Z0YI7jW1T97tBra%2FzsCssYTjSO5KOzBRMsdVC%2F4EU4BsbpoJYpxn2hbE9%2BDIlGQufCLcI%2BJig92J%2BO%2B3GzmeNR3sICXJrtevDmSKR47O6%2B4OXgMry%2B%2BCXjwwVAcjCHZQFX&X-Amz-Signature=aed52244f5e10dfa2916acafdf662429f053ef2fc05825cd4413aa0952ee09c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TJZDDGIW%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDazOt0g%2F4jKkECcDxpjDRaBZZBIUU%2BCsyYW3M%2FRph4JAiAbretCU1Tf8X5SNFlhiEdyOxdYcuOB1DD%2BdWMvonqaHyr%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIMDmZFprBf57l3UdBiKtwDqLaA0dZlgRsxvE6fF3kVT7Bh09sPWU400TiYTcb%2F859FbhEIFJhv0BaIT57LLujU%2F5dgkpGUU%2FYxsrCuM1bl5S2JYNa3DiSouLRh2oxaDiD0THoMq8Dot3Qp%2BAXVyhhCSy2jbqQSvwJ7pmdE4hzknlU171Ghzz0R5mHr0juOAdXk20ndvFP8j7sv37mRT3BR57%2FFBr6NWdxq%2BQFPqCa1TijjyaahvpxyLY1nK64KfIVsoyHjHnKNmoPbG96oE59ti8LFhud%2BGlrXDNmmXsHYQuxZ3iXaSrk%2B22xP822acUGu%2FhUmcZjqLqfpH7WUKiWi8P%2FYJtr3pvPmjZjbU%2FQJa9TX%2FvT08zLh84RgLpJ9igr2zBb0sJ1%2BrxPcsyc39nXO9Sc0sP3qwM8vmNFy8Oo7jzNH0%2Fsz3EKB0ssS8IWILjrmJXUSeas9vzCzcZJeVCGb5jyQY8DNNLlKIMcOz4T59TgDGZ2ueTaxvBIotH4hxZqr6Pwqi6tebNbaeTcgXTRF26LO1UWY7sBMQEwDty6OXatSWVgbJzERziIplQeAZLsdUQSn1lwnXGPY3lfHQo1dTGHuTJL2dXILmt3qaU5q86SaJ5wrKCb8mYYiLoVH8beIi3LfKQKeIwFt8vcwg8jgzwY6pgEGJ0UGq0sTVAVwBmXYGNxwvmy5osh2koun%2BR%2BH7OpkuboNs0JjlyUzK41cGMJd15iXZQkySC6wsdvS3sgbnaffMsd%2BCrZqpHaltGLnx%2FZ5nlRU2h8Raymih%2B40LUcjrut4tqGHwzkIKcO8rmSQFX2QEOffsHiDvKOZmJOm9ExguejYF9hcDaqOY0%2Bri6hFDg%2B6D6qouDBXMrN4IY12ZGWfyomFXgFD&X-Amz-Signature=0df6d147492ea38f0f960a68373b8a0c19ea66a71c7d8003a14f4169acaec8e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666F6NI3OS%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050603Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDF7JvUoPxoKKWjD60%2FfyYOU%2FYUmfbIYa6wqpzEeC8tJQIgEQpDj00jLlVxaEfrZNdqh0ygLuzqKn3%2BQ3jizYgfnuMq%2FwMIZhAAGgw2Mzc0MjMxODM4MDUiDCVIMcYKGO7c9DRehircA17J8uurmCMTw2tE9PkVMRDxMbhbAzgvnTCjITZnT4VAZx5%2BVwZh%2FYW3s0CobzoxV%2FRhGKRqmokajpV%2B79ejkGATaMJeviBqpe0e0eNXmVXZnh5X6AuzZ4nRnXpwbjvjaztAYBNx7Ux9BcnO1MIGLw8p1EXvrQwf17eGEOycjv%2FMKhuF7ux%2FdjD3IRS7BsVWVzSYo%2BchjkK%2FYdD4x1X3Bpz%2B%2BiWtOGY0mbzZApwcUurgKMTOSt4rXguNQ84x6ofVb7vTcWFdZZY5ioLvV6fXs7BTi9PUo8ORXsVfxK0axhOktdkT5Yh3vUfD1BVD%2B0o5gdgMVPBbaT1NMOTMtHgOk97qr3B6VjrdQ8negvMMm8y2o1lXkHGj%2Flkh1AtUg0X4C2tdgyfE7jqYbgJew3dp7sxjWnZaG7H1UABAqcGNsyFIeA5eqkhBtzcRSXaXgHAxwfiDMSi0uxInS1P1oeAAq4EhmZySLLNkzOhORWP037idyxkYiLpGWLxoCcWFaruatslrwg9sa%2F47MbTjEHHgIVOW%2BO0MFjYiWEl%2B5r%2FxQcEmdxZOA9jZTw3zmOMCV4cVxGoZha1WIwjPEF%2B5dDJ6DhvfPHnrDHCaQXHbjPQTnUInqiaTlroUnd2DD1sxMMzG4M8GOqUBXMU4WfmvlbrvTfFcVdajRAvIAbr7dWkxSMAkrtCangfHYuL%2B4%2Ftc56aww6bjT9SmWzlrQUZdTRsIUXsIO2e4nnQDPcHpSt%2BBbC037tuHhVRkBnix%2FextLtIqk9IDj8yxTrJP42w2MQLgk4Bd5AO%2FFvo%2B5JQQEr2hFNxMjCZReY3g3e94m9CzoR8tTXZTNeBn2hfFPpGnJ2pmkwZsg3QuiEQ41tIc&X-Amz-Signature=3d53ecc1619fa9331976fac485d5ff8ea5eba38038bd37906ad2c9d1bba81404&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XRI5G4H5%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050604Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEwG9PVvqHcJU3h0oKJgY21370vX%2BFW5HwBgCzg%2FCKCcAiA3Y8PeCC%2BwtVT5otSSuEXOZlEGw%2F9NuUOssj3ePhoHUSr%2FAwhmEAAaDDYzNzQyMzE4MzgwNSIMsn1YxLoYHvp5pKJ8KtwDp3I0CLrvFI71htbkidYBXXDWNVG62iO2sbne9lt61P5t%2F6GQnLrUypLCHN3HrjgbtPDcrskWC97EwMI5mNm6j%2FeMobc3aMywFT6X9r1RwA%2BNT6bCdYl1vK%2FBCTbM3BeMZgllIqqkGxXu9kAeCFU983OAPQB0fWnCqI0SeMPlfBPMN2k79ae1lTWOdNlOTmsIUVzaUNYhs%2FuYHkYS9D8pZUn%2B5HNV8zQ%2FBFnrAb%2F7J15y7cIdDUoNSaMPel8cXxsNzcqqfRT1%2FB14Sav33FwQwH2Buvecz2XhC3TMOhoAzsgPFI6Lw%2BCh5a3igjplGQz1l2%2FnyofxtjuIVLYMjPPKuUR6%2Bu0X5VAPlfkLUbDaJj1nBs4qFTsOCHDZ%2BXVC3%2FK4pK4hJWd%2FU0Q6zUFViVker%2B68V9hal5X8LCOadPntH39s%2Bi%2FXqGujFYX1pSjJArplaUs3uXYYIdYX%2BtK4HiUmN3VCyXIy5lGgYhi6du6rF1GHQFUgz1QfspfR1jhHj4ASbuR5cbO2RsjV6NXPTmFp7A5PjOAygZtGOrUzczNXLnoGcc7dhyAG07i%2FBnSTYrHpZRfR9WaZp0oN1htNzZHHMh3BSMx%2BvMRJaNKElcodAXQCN1iCwG%2B%2FjJjXZd4wxcXgzwY6pgFiFm1Bs5STFYIGfMOwSBkvLJWfqn8GUuNWdToT%2BxGPlh2bGNwljcMs9wHx5KGbl0FRuUmWLDw68qAreuL1XIGWWnEH8fLoj5HN6nLLJELCC2yU58w%2FwQfrQ2yJjkjCQrIgtRRVQaFC5r4B59r9CHtkqHYyEhaCmsp%2FkNQCmwiOYYxylfsIHB3GA0oJ5GqeX%2BY8Zfu4%2BO8Ju%2B3OtJBsEGPz4cUffYAZ&X-Amz-Signature=53d5738ec636c68b34c9cec7a0044840422f0eb3b59275ebc826ba531dae7edc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMN5SDX6%2F20260504%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260504T050604Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCxk7yMrUbGfjxK1X4OnfrWjQFTer2U%2BAQ0zjsbWZD3jgIhAN5Oym%2FjaEBQRHwQB3tfNMzHSwvUITnJ6ASLo8RK6zwmKv8DCGYQABoMNjM3NDIzMTgzODA1Igyfy%2BwU05aURd9wlO8q3AMz5c6ck9%2FTsQJUr3Z5%2FGBg357pFsGuZ9bWNxBTgUyfG0NdBLZU1ckA71BW2vAQtilG4MD%2FEN0bLTo0eIUrPylXGNVxOahfwJ1OQCApCVZ0Xg%2FxTC9VRfZddpExLpdC3TwfYJAj7OwbOMi754bx2K%2FJm7MmJY4qzc581vNv0IRiiK%2FzexhB3XraT6TFbyTkNpWs4BO5%2Br41vT997KDNTy4xkjJhkWAfFGASgyPOkh2VvKtVGWONyJrdds6MZ2g77MY%2FyJS3Kil3pcFZMjCh5WWOKkyxa8zVpu%2FAZ04x95TmX%2FoZUAejcDw9Zvff6HdXpDQfT6eKHLzg%2Bn%2FHuLa3dNhvFrAD1yPjaxJCUFHQWi7lnqbP4JsJJroeO%2F0JZomPzQkAiW0iuPHNhaim%2FbW%2BAIA%2FN4xfV1I6SHX%2FNBbrvKXEBljicSSTH1MHR7vBfEHfqaIZtU9KZYlhgx9CAKeapZpuWJfqmCOEWLnPnoV5PnYP6OoI8C3dptLanYFFWHjzH2n6scaFbCPuxuhqGEDSyS3PGGyeaA0UlliPTrVYdulLxu6MnCXR%2BxVqiwzn%2Bi6gVeN%2F%2F2dwMih9aBnH6PQqem1ECCsifaBVbmHDzcNbOiFAJ%2BHNYQiXmBMp7US1MzDCxuDPBjqkAZPjAckYCEfQqwzX1xO5gDLydTaiHjRJikm0zFz75XwtbA%2Byd%2Bxq2qlWa2sBtkc9Av0c%2BL9qUaqy%2F%2BhWpVaPH0C22I4KRmPZ%2Bdy2bWeruVJlhDa4BeYukBQHwDPAkYWRvYLW2XWM6sC6ob6szoklZzyXz4r5gr%2FHB%2FLas9GxejQH%2FQHsuq5ZWVo4nSfjevUEswBghbSb6XQv5S%2B%2F5oEzNS5eIjpa&X-Amz-Signature=9ac14c4cf749b6dfc71baed645334e6ed3264c3cf49dd2613af03c56c33f87db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
