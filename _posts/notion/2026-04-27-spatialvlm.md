---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZDLEMIZ%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044940Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQD25vl0ovbsjN4%2Fz14FYiMTGRheBsbCZgr67XrQLvqPBQIhAOfSjVy5g5zrVyVZpQCVAenuovTxnVs3mBXRiBFMWgHaKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx5MIfIsOU1QCEvzRAq3ANNk6EiC00wfoFwRcTuDb%2Fct07LA5dGBvPMdRiC6mgF3Kyu4MF5JHgUVx%2BaqOsBqoVzBadisnEc6U61%2Bdb8lAXNP941qwcy%2Bnx9eMrycaXzzuua8u7jp95ATZm982fHCjM3MUG9PULXKkW9iKsWp4dv%2B5r9SVQSsEAdAhP237Y7mV69jmygvKD4SR2DByDT4vo8yw8ya9RwUAwMUe42Ta6T8FIYwb%2BTJPyL1V8eSicSlVCUquQOBt7axs1tDSPAILopy%2BzknzAchrn1YwAaVAEsaX2nTc0%2F%2B%2BU1Hea%2BFzUZlaBLHKiy3yn4bfAyS9fA22u4T0%2BMVtl7qTR7NGnNi2bowI5kTieUfzAu%2Blc6HL%2FeHv8OBZFZe9flCciWs0xVpHP%2BwDbYEl5uZ07Qjfki1suJYsSUEX4kQTc3MuODP1bpaZcWWssvRrEqO3zFAsoslDhXkCpVkUd8jJyUpeCzt7iJ3J5s%2Bkce5LMJCFR%2BnGDqwAG72KZLcRYSac5iqL9yQeIe7TzqdyiohZSYcams%2B%2BqrP3sdS3AvAWEtaM%2BONVVDPffoKjeMse440m92GPZr1Y%2FVY4QPnWsHSNTkCWCMA66nbFtJweTBoiK8D4inWba5JZYXk8Wb9f3s5K4%2FNjCL1e7QBjqkAdSrldrfH1HDH6lbUvBlHKI%2BuE3cjfXlvZXIaZJg4pBPUu1e%2FVr7lXPEeqorLuCSsjMP5LoGsPjY%2FPQA3sUGdizuA1r6M%2BbogdmaBrt%2BdhtYz5bQeqds%2FhVpuUhaV3TmQmt0B6ijw3Azig3mYcL11iEmSPQZg%2BsLa9pU8Ep4icr%2F4dU1LI5lZMrrJoQdvSif5QrSHjv82kJRRSCcwlHNDcvZzurW&X-Amz-Signature=bc4e29a4a5b089c31c6a50541f743e038ef39031e02d621ef5643333ad18dcde&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZDLEMIZ%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044940Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQD25vl0ovbsjN4%2Fz14FYiMTGRheBsbCZgr67XrQLvqPBQIhAOfSjVy5g5zrVyVZpQCVAenuovTxnVs3mBXRiBFMWgHaKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx5MIfIsOU1QCEvzRAq3ANNk6EiC00wfoFwRcTuDb%2Fct07LA5dGBvPMdRiC6mgF3Kyu4MF5JHgUVx%2BaqOsBqoVzBadisnEc6U61%2Bdb8lAXNP941qwcy%2Bnx9eMrycaXzzuua8u7jp95ATZm982fHCjM3MUG9PULXKkW9iKsWp4dv%2B5r9SVQSsEAdAhP237Y7mV69jmygvKD4SR2DByDT4vo8yw8ya9RwUAwMUe42Ta6T8FIYwb%2BTJPyL1V8eSicSlVCUquQOBt7axs1tDSPAILopy%2BzknzAchrn1YwAaVAEsaX2nTc0%2F%2B%2BU1Hea%2BFzUZlaBLHKiy3yn4bfAyS9fA22u4T0%2BMVtl7qTR7NGnNi2bowI5kTieUfzAu%2Blc6HL%2FeHv8OBZFZe9flCciWs0xVpHP%2BwDbYEl5uZ07Qjfki1suJYsSUEX4kQTc3MuODP1bpaZcWWssvRrEqO3zFAsoslDhXkCpVkUd8jJyUpeCzt7iJ3J5s%2Bkce5LMJCFR%2BnGDqwAG72KZLcRYSac5iqL9yQeIe7TzqdyiohZSYcams%2B%2BqrP3sdS3AvAWEtaM%2BONVVDPffoKjeMse440m92GPZr1Y%2FVY4QPnWsHSNTkCWCMA66nbFtJweTBoiK8D4inWba5JZYXk8Wb9f3s5K4%2FNjCL1e7QBjqkAdSrldrfH1HDH6lbUvBlHKI%2BuE3cjfXlvZXIaZJg4pBPUu1e%2FVr7lXPEeqorLuCSsjMP5LoGsPjY%2FPQA3sUGdizuA1r6M%2BbogdmaBrt%2BdhtYz5bQeqds%2FhVpuUhaV3TmQmt0B6ijw3Azig3mYcL11iEmSPQZg%2BsLa9pU8Ep4icr%2F4dU1LI5lZMrrJoQdvSif5QrSHjv82kJRRSCcwlHNDcvZzurW&X-Amz-Signature=b0911b9797ded71840a9d355f4e6228bb57f3932ac294e17eeddbe38fe68cfe2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UZDLEMIZ%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044940Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQD25vl0ovbsjN4%2Fz14FYiMTGRheBsbCZgr67XrQLvqPBQIhAOfSjVy5g5zrVyVZpQCVAenuovTxnVs3mBXRiBFMWgHaKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx5MIfIsOU1QCEvzRAq3ANNk6EiC00wfoFwRcTuDb%2Fct07LA5dGBvPMdRiC6mgF3Kyu4MF5JHgUVx%2BaqOsBqoVzBadisnEc6U61%2Bdb8lAXNP941qwcy%2Bnx9eMrycaXzzuua8u7jp95ATZm982fHCjM3MUG9PULXKkW9iKsWp4dv%2B5r9SVQSsEAdAhP237Y7mV69jmygvKD4SR2DByDT4vo8yw8ya9RwUAwMUe42Ta6T8FIYwb%2BTJPyL1V8eSicSlVCUquQOBt7axs1tDSPAILopy%2BzknzAchrn1YwAaVAEsaX2nTc0%2F%2B%2BU1Hea%2BFzUZlaBLHKiy3yn4bfAyS9fA22u4T0%2BMVtl7qTR7NGnNi2bowI5kTieUfzAu%2Blc6HL%2FeHv8OBZFZe9flCciWs0xVpHP%2BwDbYEl5uZ07Qjfki1suJYsSUEX4kQTc3MuODP1bpaZcWWssvRrEqO3zFAsoslDhXkCpVkUd8jJyUpeCzt7iJ3J5s%2Bkce5LMJCFR%2BnGDqwAG72KZLcRYSac5iqL9yQeIe7TzqdyiohZSYcams%2B%2BqrP3sdS3AvAWEtaM%2BONVVDPffoKjeMse440m92GPZr1Y%2FVY4QPnWsHSNTkCWCMA66nbFtJweTBoiK8D4inWba5JZYXk8Wb9f3s5K4%2FNjCL1e7QBjqkAdSrldrfH1HDH6lbUvBlHKI%2BuE3cjfXlvZXIaZJg4pBPUu1e%2FVr7lXPEeqorLuCSsjMP5LoGsPjY%2FPQA3sUGdizuA1r6M%2BbogdmaBrt%2BdhtYz5bQeqds%2FhVpuUhaV3TmQmt0B6ijw3Azig3mYcL11iEmSPQZg%2BsLa9pU8Ep4icr%2F4dU1LI5lZMrrJoQdvSif5QrSHjv82kJRRSCcwlHNDcvZzurW&X-Amz-Signature=d3d03eed3b96da933d7ff31751104283fb9547fdc9de4726c89bb134a5420a58&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5XEGMRX%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044946Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJIMEYCIQD149utgoJUorFIyOIKeXwR%2Bc7gusYXJnjXb%2FzXih7VkwIhAPBTqlOv63zOhHxeJTCYoJCGLsIV94PKwwqir2x4XBReKogECO3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyyEQ3INoaIk%2FrHRX0q3ANfHAPOyyxiPtRqXycUYgaGypslcXo%2FtuebnRwLrNC2QS%2BlvA4o6EalsOcxExl5QhxM%2Fknas4Tb3kujQRf5uNoUtR8kH3hZRvrr9HA8%2FPqyS%2BN9rb6CYYypYdhsdmO95oGFqsDooFvrKNvH6jlrNMP%2BYBIx6BISyWgcx5vwYVNU4CnAA5geUeW8xtM7vt25005xKoTqe8CKt6qRMin%2Fj80PZuwNtMyW%2B4yL8fBk1lioC%2FU3hyTw4e6vLqLWQnxR7fBt1RLJdpyA78IKapeIQfm7932Q28aGD%2BUQI%2BQB2TVVtkScm6cc4SyMkmcusnjnAWLwIQrE8CmYiSvWV3eHYdbwguLfvf1eWjKc2%2BbOOix9IgJQ0XAAQB12wQvsGgGg%2FYp6s39gxw%2FL4szJmprjV3nxsP%2FzpMCWOIe3hA4Mt%2BaTbUCKBc0crK1LPJFeLYiRB7UZT2rkdcLW67vjCz9okgq7uB77Vhs2bv1SlZy%2ByyW8gUUFpzRLiZer1qYT4%2FdACJpiJ%2FuRjJIcbDMMSlVXsfSKRTY%2BlZ6%2Frst6%2F%2Fp3dff5sadRAjMBdzrG%2F%2FtWzcJs0JesP6P5bWJMLRhDru4ux1Bu2yd15PseKslEJJ4pskvBqbysKlvR4D2jy8aHOTD91e7QBjqkAQg2rs%2BtFebMGbkXyFZgh6c%2FUotwsOP1aYrRbWhURDZzFEGnJuWWFY3kMPLBwO7SLX4SFiuL2uTPNRXLIr3r41JYcvJ8cMbhmhkAPRnMXepBsDgh%2FAvhNvFy%2BOwDtsg7iJt12JgxJkICClDw0L37Zp8PMWL1owGPQt8T5WRKu2j%2FLwy2mTsZkw74l0wsmJ%2F76QdiNtDZ8uuNJAtJpTIYMdQ0seT2&X-Amz-Signature=0d445b0bc7558c0417088cd11c54c7711700e5afe3b6d522ce90f0b5d228913c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TEZZN4HI%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044947Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIEXRYE6tP5RNkGGjFORf5e5oJoVplLwosmW0s4PGY2LbAiEAzP2hy5wrPc23zuehf27YUluVnX5CEuFDjMQ50mbLoBUqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNKTKUvwi1QPX5DVsCrcAx1pG5qP2NocR3D%2FiWXMwI%2BrwouGuHJNkLJbeIeurHs28sieQ1FxuvSo%2BJ%2BAGbn8fjNgDKkQ5GbWIo9iyv1V1wIwwtO4TInvKmO4DVE5rejqCyCzEhC77fKTzpJ8pcaSkDXuEegOUVhjIPIu8raS%2B07319CMd8ABXCCh4b4nkC6QLIyuAwJd0RSjGv3bLufY7ylXBk4x4TzYuCQOGJsYzIjgfqE9lDl%2BfQ1Tjhe2n70MBFBz%2BGdeIvyoQBYC8T5KelMSalPtk7niYpkBIiFjw7pWzdM%2B2CDFbW1V4JpAMTwzRsOxljmztFzBA5atX6xrCBEWJNa%2B2dfJxBgd2p%2BheWv2%2FkJwHlm7faCPyxAtLBOmzk%2F0%2FjXHaHwW7lg38UvWqRbK0PfKpUqjpaIOa3FnHek9ddphJhAampgic58sISYaySNjZ%2FM6RJTGE3h2xtC0Xl8N104LxVLeXftFiM83%2FAHDl%2FoYqcafP8Ad3Gs16CFbPYs%2FNvzGOpSjaY4n3IaNUrjGRVQOehpFyzRX1Lxe5QCOvcJSoivjmYRy6LmbKDVlQlVIgRtUsm5Qy1jtPnoFSXBm4kVOvDdscRijhjuKbS1r1fEw7WI1KyzaVqnH%2BY3%2BynLRVC9LkpY4%2FJFBMKbV7tAGOqUBtJXw61LESm9mN90cYi9UcN%2BqOZJ7Dt91n%2FgN07ywz6R1I8S6cttJLqNsOZrbDQ717lb2T2LE9fJVKooEpo3PvrEu2R55%2FnP3zp6mqezwDuanNQ1GbulbpqJkHmn7Tq3c3m0Cvo%2F2j66ml5H5tKw9b25AI%2FCg72TgpcQhwPE9s2RoDY4tUu2N51xjLh52gmsgYpKDN16kj3rbUHg1X2kC%2FmVM%2FU%2B5&X-Amz-Signature=9f523176c73e052b52c7fb998be3fc1a5db720e268b0d05d1c36bef3b7edcad2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VVXR2Y7Z%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCICiy7JWSQckplAXElQMGtjWhbNoU1iaPQcV7SxrCj8d6AiBpp6YkZhJD44XDOXXNQNLoWl9DWmm5GXhh9FPyPx3GPyqIBAjt%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGcLmqtz156wLNq69KtwDMTnT72atTWxLFDawyvCrOjpXkwBPnfo5QDwWe8HTiZ%2FEYnAqBFbJ7bFv5v2Tcbce28c2MyLaAiPHl%2BXRhxwXgv%2FcgofnWABvAXNbw5Rb%2FPjrea6yYuhN8vWnF%2F2aJuNkgRgchkQehl%2B403Yi9%2F8mXBX60mXLIPiGH8%2BxRHJOzccngq7AnWNw0L0xk3t3PxObj2wtHSX157eZ3Mf8CFeHmaIqjmTEjqPSh977eab%2BgcgQimBCmkqWa2JYCxtyn53Z0KgFAF6jkmW5YVHySlfFZRbG8RSPz%2F0MIn4iSjKehpGpZAs3w8mE7KtqHWXNu5ccKet7Fc%2B8NYX9tLJbZ6LImpT4N32S4pidsMCkmULd7i2apl2UvNZ1%2BDyDM3KhoAXBtfSU4PhDHpEda8%2F0tXnp9fjUn2DhlembIPBR5IIJJWPDWnzD74w64RcuWGZCg4fX4PjLCu51WMO6yJaJBXamXJlQd8WnKv0M5ZlPIgwbNJvYVqrz7v2lKtyzbjlEcUKBDyTilguA5HQQSedF%2B4WbtB9n5IK6z6vCfHdimGwQ25W2xsSmPOobtDIdyT8nU6JHse61bWX5%2BGqGkglIug19IhPuq%2FiMzESPXd9ysrI%2F%2BAARA4vy5JjOu3%2BwLv4wxNbu0AY6pgGCyuaYO5qRPyvvfvHbVgioveDYwvxGLGj%2BL0ODdkn2eJLcZebScdb46L0NJ80xJa%2F7iDnkt3edbPcYLlKwZuS4AEHPvrUmSkfle5Pb7QDal4%2B3Etr5QOTn4zaFXEO%2Fn6ZGkWK7sO9kkYUQHZq3vK3ILqF037uygxCWWGgvTHgzLNSHFZieCww%2BH3%2FYZEn0Vgp1rLht1nRQ0Ox6AuMTMaq9kBMk95fA&X-Amz-Signature=d8700eba589bc7cda102b9ee672db6ea5fa876244a71cf0ca01dace77d808c94&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46664ARI7BX%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCICUta7vVkKXTk37%2FeOXvqw7oaEBOpehdLNn3BtqhkdioAiEA59yKZjw2GcVtC9PDa0lMdSv9IDs6FlelaPxmgn0mP08qiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEFXo7aHBenAqZ%2B3iircA4kGnJRluORyJPojjfeuwMBX%2BzI7kk1lsPbfmnTFULoI1pZc2HklDmCSgxUrAM%2BCIMWUd17C63tOHFVU8a3TUPxeN3Pu9oPjsjEjeYUa3mqBUO%2BalhmlUPt1teOEKeoZ8HojC9x6LBzdQlbwSR6ONKIgApvGTPAsNs%2FrZGyfzaEkSjge5S1JD%2B1wxRLyepbAKNAQuQg3wLeMpiXFAXYSCgQ15SuMTEeOu8WMGaA2BgfK0b2RMWyqYiUGds1b%2FPM9EXpE9CuFnhlxSdv7%2BL%2B1iGbu%2BYUW67yhsc5xEjYu089sf64xMKNzzE795avkUcxM6tzzgeUk4oHOXS3R9wTf7W4AskMqdvotG2eU%2FlW94MQirR17BfH9CfAXIn2lEtpIFtSU4CFqig0g6MdWt%2F0VDWE9ROX%2FWhpXZniVd0TS3R9Ppv9IHhvDx7xy38IV3aEoCHGl0288OkgZAAXW5nxF2XBs4XUxNk0hCALRhXV7qw94WqNNmZO41IM7rTOoKbmxVOifd9aukqH3fL2MkHM%2BDnNSvaOEurIm8qC%2F72ZuPVrTbLv14L9uASuAzO5JTuVXVpKCojHPRN3UQIaSLi3wBJYKHw3iOrF32cvk7q82Y8pQn27yx%2BByBFsvqJCcMPLW7tAGOqUBGzJoALUUNBPcyx4MlaVuZKIHA9tiqO7B1%2F4G4No1%2Bt5WOmAoPRn6CFLxE%2FMDKpjSFUEC1i1kErfK%2BoWdvYOXxli%2F7T0E7Hwtefwew%2F%2B6mYuabsxdcoBI05XHvrCYji1%2FJ7oosEKk0WnBgQqy7Mwf%2BMxiPDLDcXoUS00Mw9CizzpLpFk4iGS%2Bvj9bS3Qv7DBmjC%2FI2lfE6nTHvRedQZ5kBVgV65Jb&X-Amz-Signature=a83c1dbdf09695eef6bf59e9096271fe0fcaf49ef4cb5b1a4dfb700553c54f9c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VUJ3NBR3%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJGMEQCICC3TsAOtKKLgnX%2BWXkcSwKLTmoqwPfJ6s3IcVJaZVBkAiAIZg5kLfnPG%2FgtdyZX%2FvISHB9wXRYZTzu63ImlDcLr1CqIBAjs%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMX%2FkSK5YS2U9tvfDaKtwDnQw%2BcNlc958M5v9X4HJK9n3TrSvn1xjiMdqKGwM6DQNQXJ%2FV71zkjS1S07wHDtWTCk4Or872Tw%2FRi4hlINArtw9sKsSEehmmSo5fW3o3H2Ls2HeK4PmM%2FrU0y3G14RNwXiT%2FbJnXae7oIILw0SBk9q6b6gCzUgQFC6fYtIX4OwFk50Mxnyy5iJBZ7K2eEWzbt%2FN0Ka0RoCSDNSFXrMYLSNSW4f5GVp%2Fl2Quj292WRpG27Cf41d7cbEgivqW4BrBupvSCvud7Z9dElVqqyiITNYfHGhLU8p4zbwf3pF56ZNKsn9WrMYBbNmnyfBQwIxpH4o7Y3DnjONLiAmIje1Iz%2BjNbQq4%2FDDupsq56jhrLK%2B2IoP08J1n6xAgfq%2FURxWwnQsY3vcZ%2FAma%2Fx20Eiab4BWgk61yGDMWT5kXEh%2Fq5M5M1ory5Uvze89wyqw23tryc5at3il2cNe0EScGa%2BQ0nNAycapilujLVbRpSdETukRm3N%2BNBA9F6LX%2BZW1G%2Bk2lEV2RW84%2B16DeqXWjOkLtuAWFH%2FRTESfFOrBmmnky6N4GXvksC%2BKOcwBfsJZCCkMZElaJt3ymxVipCANQMmKgAuEzqucXaI3cYHD4Ek20ev4XLdb7wyxeGwN7%2Bdrsww9Xu0AY6pgG1Jug79Cy6HSd5FwjfHrRbR0n56gxaZW25Ed2WqXvWkeu79ApAF%2B8JAb8AesIUnqxW%2BYYocO0UisNcebjpQqbNOPct8lctflQpyOEpNfNMbYxbNAb5PsJeKe8UmSmEqVoHQj1Hm%2FemjQ2XsvleS22RuUX2YEtxxZT%2B%2FXYSCMMhF%2FUOwlrVQoDQhEF7sct%2BWcY8M%2BjDkkh4uBPV6JcvMmKTfa015IKh&X-Amz-Signature=9c6f3e0aac3eb2e44f5abfad2584cd7aa5864f8aa7ea2c8a6f51046cf4364cdd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663RQWM7KR%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIQDLVqvE0gKi5xDYtFfE03%2FBSVkkWL88OciqADZazNFSFwIgKBQquDtVRPUdyBvFbURf8Kiq%2BAFtllcOlYJITKQvvgcqiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPZuz32rcK0pqU3GYircAxvSnPvay5PnJKuxyneRgwlLKhgpEpVYkkb%2BbrxsisbzSTepY0DQiiyRyPwJ57PnA4F2V84345M8qCe6cI5rqDdehGY1rZdrlzuojohykyt1nit%2FGzpk9P32yq%2FA6PRb5xSHW2reY%2F7Q3qQbee1lLSWd1wkOMmQHSHYYj%2BEke%2FfyJ4EGfauNbSUwAe4lSdu1wSwGbJ7rM801xafw7NKt7c5yzL6%2BL9JAk%2BR%2Fur5HqSbk4iuhl70GliqAfLB9L5xrWvqkm%2BYvz6epcU1E8VbpFheu2yUUndd9Spy%2FgmUQm8d75ipHJ2MsPAOdITuyK%2FQSJrWDnBZPsAO%2BGQ4dITkaEfvEH2vnbIM%2B0HXDafyUkuin9RmrhpoXOa8vVLLQlNNd5dSiwoYLqoP9K4xCudJ6RmALG1SrIHf2%2BnxJ6JUVktf%2Fqv0NcnVzbpw%2BV6w4au8bIG3OYdeUiIvROv5UraMjTLLy13rdkdUkQ9YBsmQd1PJQQpLsSnrZ1UlHdapikZu7VIwY%2BUUbac8HnWaBPFGyc%2BcfRQ%2F%2FAQwTnbIQjC6CXOo1uIeBl7gT%2BOmcjBAYCz9v9ZUSFcIJkEjWqmfQbdWNvULeczXJzkcR1a2G%2B4hXl%2BemcuAf7hkqhfd6xna3MMfX7tAGOqUB2fKxzIwKRu6OW1U7r0U3Vn9%2FFOV43%2Bh2i1%2BMoFQfmij0eOpgDAIGGwfKJDDGmJ6nv6D44UhGXSi%2Fi05W7FrctMQkvQTUYeYUNjxgF260M0QAYGPsE%2FfWayghyTGjboKiIzgIVDA4oL3oMuJFbMD6hZKCFnbSfI%2BL7iNADTALCMUNT6PxkTP1UVq9ACqkViORwh7uvDW%2FIYwnnOkynLp%2BjTygQ3Sd&X-Amz-Signature=88e2bc4cdc0aecfa4521d253844900465ad40fa92ad74eafae730ab6cf8b595d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UQKRCBE5%2F20260531%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260531T044950Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCXVzLXdlc3QtMiJHMEUCIHEsJGzDcsSUevaHEwdr2WgpGVRZv6A566p6k02xuiHLAiEA6bn1gIJHtbQgfZSnSwBZulyxh6B552lpyV0EFR31Z%2B8qiAQI7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLFIPCGLW6s1gp4W2CrcAyQQXyTLW1Ky0doXYDR834jr2TOM1marjqDbP6NhY597%2FGtG4R2TaQYtcReRLbW2Cpuc82tlGEioWG3U1ATLFPVcjkz5Oe1pm16LrxZ5Z3hZ7CfdOepuJlCFeoW5c%2FynX9nHrNDcUx1Z%2F3cv3S3b%2B88Df5MovvLoansgcMk0JcLSvLsF32m9aqx%2B5Qx2ioPE9Rl75Erg%2BCmrl%2BBzWZiUgfLnn1crY4wvXmvffSKebm2nGUd7EfKNwOMVEj2%2Bp6DjGzJv4gUrNbBuGmqNTS6wfompGdcE9ZHPFxQNQ1n1bQwYXrlNeXBOU8B%2FFdZrL9e%2FUKGqh4fb20Oz%2B9Vu5IK%2FAepY7qNZZGyY6Tf6LK1kJjLH9Mxktw%2FpPs4AquTloBzjuPseZXhoVRCFWp47paNj2fi9rYN5BB5FSrNHYGaVXnGaESULdMZi3PSpMG10zrvZLVgtf03vwPTFf2OA8qpR5jBvIr%2F6w34boCr9rsyoCcfC14AwYddBV8dhftFlSmg8%2FxzogmiK2Xqt%2BCo9h2FUi6InTO3cxitqq55wBoEBWNzQSmWSOYcXN3tAbeThZS9lh%2BR9ojb5DC45Ytf5Fy9dDkTL2%2F08d7Xbx9H%2Bzu9%2B%2FmS2JKfZ42JDvH7zGWe2MMXX7tAGOqUBOKebxvqCqsNkI5amJsJUnV0t5PTx4sFRtMK6cEj1kExZDvVhegzSnX%2BZRzGQacV4OLmlX%2FN1nVrq2ixmZ3g75XZ25kzZMtkDJALnHcE9R5g7j2vE2ao6W%2B9yVcc5hwrMTTsazN%2BOsBvtQ9HxooYaks%2FD13VsExWRuwkY76nHAEuYyapcwEmsUd4d7DxFIAl4Mxb7ONYpPqVH4GWYDa7gRXoelbbG&X-Amz-Signature=bdd87fe6866e71ac94e58ca368e0c481fc6186e4dc3422226c60702a16b87d73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
