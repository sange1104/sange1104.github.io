---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46623C5CTRS%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034858Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGEw6MowKyav9z9U65xhNsHYqBeDO%2FdMqJaqOcBhN7PyAiEA%2FbzuTpBjQ9cetbud1r6tRd2K5QISjVQiR0IHu6y%2B8A4q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDNeug6W4OfaftM0NJSrcAycXbax84WQtBPpL4q4QKHmQfjWI%2F%2BV0ANQJ75XJo3NRl5FNwoZ62k9nCjdEDH3vOqdpkNdoLA87K%2FmAnMX%2FdKPR7YEMNUcnLwWC4R89EHFMrh7XEuqoIXxgXPYEaPu2HmMz%2FpvBmgjHIROQTrv79LE0Ap34vaTGeFr6LhIBZ3UiSrgqENQv3uUiEhubDU0Yl%2BooHchXZptN36Ngvp8eM%2FqSwoZjGq0S0dPtUBgDkm419Q4C4hFFY66wejYj2sgOg3XF79FgYLRnBstDFPOutmVF3%2BRXGkO%2FP%2BAFKJ99CGXmq7J9zne9946576bpukTHNP170h%2B4LPEB5Qos4h4ts95I0ESVGu9vV8tBccLaMnNShm0EHClw3zFISygOF2FmjsvGjXdnuPhhf%2BD0vAI%2FPiRFnas27nW%2FFK%2BVsmMcpg0GlRU5YXILthgaIDkgblnX1cycnWxMLLX9xaFs%2Bn8NPUTkVjqPrwCeudvJtTJfrQ%2BmJDPBhvVUxUIOUV3a20BJcY5XVKxIH2TJ2Y%2B3M%2FH3wQqmrzYoVMRVl%2Fm%2FmIMAXSQwkO8EPMJY1XBqAtPX%2BWlHqETvkFxGax0xTSCnWQAyYUeMN0xW3vHPyV2Xr4Zwdofh9fTIqBixctNkrikXMIXD5c8GOqUBX7ivvkcPJuijC7U3RQYkRHt72SgslG17TPvHnhfygKh3fWkd5tUQk0Lg1ACh9bwdLZhp5teVaUtUD0385MvaVfaypTSz5v8peQCUGJRzahlgU%2BZEdFtjCslX4CPLQmMpdYUo3ztxOYIfUBVyJSFotOik12guKE1rryY3nqjPcTQxh%2BW4ilI0sWV5B2ZiXNuKpVoAPB6yIszR2OZxHadg6RU7BOPd&X-Amz-Signature=f6c2ef409474a859e45ee1a585f329c26419bf91d4d46ee422c35930907ab7f5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46623C5CTRS%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGEw6MowKyav9z9U65xhNsHYqBeDO%2FdMqJaqOcBhN7PyAiEA%2FbzuTpBjQ9cetbud1r6tRd2K5QISjVQiR0IHu6y%2B8A4q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDNeug6W4OfaftM0NJSrcAycXbax84WQtBPpL4q4QKHmQfjWI%2F%2BV0ANQJ75XJo3NRl5FNwoZ62k9nCjdEDH3vOqdpkNdoLA87K%2FmAnMX%2FdKPR7YEMNUcnLwWC4R89EHFMrh7XEuqoIXxgXPYEaPu2HmMz%2FpvBmgjHIROQTrv79LE0Ap34vaTGeFr6LhIBZ3UiSrgqENQv3uUiEhubDU0Yl%2BooHchXZptN36Ngvp8eM%2FqSwoZjGq0S0dPtUBgDkm419Q4C4hFFY66wejYj2sgOg3XF79FgYLRnBstDFPOutmVF3%2BRXGkO%2FP%2BAFKJ99CGXmq7J9zne9946576bpukTHNP170h%2B4LPEB5Qos4h4ts95I0ESVGu9vV8tBccLaMnNShm0EHClw3zFISygOF2FmjsvGjXdnuPhhf%2BD0vAI%2FPiRFnas27nW%2FFK%2BVsmMcpg0GlRU5YXILthgaIDkgblnX1cycnWxMLLX9xaFs%2Bn8NPUTkVjqPrwCeudvJtTJfrQ%2BmJDPBhvVUxUIOUV3a20BJcY5XVKxIH2TJ2Y%2B3M%2FH3wQqmrzYoVMRVl%2Fm%2FmIMAXSQwkO8EPMJY1XBqAtPX%2BWlHqETvkFxGax0xTSCnWQAyYUeMN0xW3vHPyV2Xr4Zwdofh9fTIqBixctNkrikXMIXD5c8GOqUBX7ivvkcPJuijC7U3RQYkRHt72SgslG17TPvHnhfygKh3fWkd5tUQk0Lg1ACh9bwdLZhp5teVaUtUD0385MvaVfaypTSz5v8peQCUGJRzahlgU%2BZEdFtjCslX4CPLQmMpdYUo3ztxOYIfUBVyJSFotOik12guKE1rryY3nqjPcTQxh%2BW4ilI0sWV5B2ZiXNuKpVoAPB6yIszR2OZxHadg6RU7BOPd&X-Amz-Signature=a5e0d535117a481623241d71d6c99f3f9ae2469095ddf2b63f88c7c578f6ef55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46623C5CTRS%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034859Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGEw6MowKyav9z9U65xhNsHYqBeDO%2FdMqJaqOcBhN7PyAiEA%2FbzuTpBjQ9cetbud1r6tRd2K5QISjVQiR0IHu6y%2B8A4q%2FwMIfBAAGgw2Mzc0MjMxODM4MDUiDNeug6W4OfaftM0NJSrcAycXbax84WQtBPpL4q4QKHmQfjWI%2F%2BV0ANQJ75XJo3NRl5FNwoZ62k9nCjdEDH3vOqdpkNdoLA87K%2FmAnMX%2FdKPR7YEMNUcnLwWC4R89EHFMrh7XEuqoIXxgXPYEaPu2HmMz%2FpvBmgjHIROQTrv79LE0Ap34vaTGeFr6LhIBZ3UiSrgqENQv3uUiEhubDU0Yl%2BooHchXZptN36Ngvp8eM%2FqSwoZjGq0S0dPtUBgDkm419Q4C4hFFY66wejYj2sgOg3XF79FgYLRnBstDFPOutmVF3%2BRXGkO%2FP%2BAFKJ99CGXmq7J9zne9946576bpukTHNP170h%2B4LPEB5Qos4h4ts95I0ESVGu9vV8tBccLaMnNShm0EHClw3zFISygOF2FmjsvGjXdnuPhhf%2BD0vAI%2FPiRFnas27nW%2FFK%2BVsmMcpg0GlRU5YXILthgaIDkgblnX1cycnWxMLLX9xaFs%2Bn8NPUTkVjqPrwCeudvJtTJfrQ%2BmJDPBhvVUxUIOUV3a20BJcY5XVKxIH2TJ2Y%2B3M%2FH3wQqmrzYoVMRVl%2Fm%2FmIMAXSQwkO8EPMJY1XBqAtPX%2BWlHqETvkFxGax0xTSCnWQAyYUeMN0xW3vHPyV2Xr4Zwdofh9fTIqBixctNkrikXMIXD5c8GOqUBX7ivvkcPJuijC7U3RQYkRHt72SgslG17TPvHnhfygKh3fWkd5tUQk0Lg1ACh9bwdLZhp5teVaUtUD0385MvaVfaypTSz5v8peQCUGJRzahlgU%2BZEdFtjCslX4CPLQmMpdYUo3ztxOYIfUBVyJSFotOik12guKE1rryY3nqjPcTQxh%2BW4ilI0sWV5B2ZiXNuKpVoAPB6yIszR2OZxHadg6RU7BOPd&X-Amz-Signature=17678860ea9ea47277d18bfd371cbe021fa7d97d8c6bcf83aa6b64cb355ceb6d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R7LPXBSH%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034907Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIE%2Fm28on283Bk5k37rrcetfFMyTznmOvOFP4B5UmWQhxAiEAv0Hv5nD5F4WvC%2BenhOUWD39oEfe1CYckuUsNbGIebDwq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDL%2Bfs23uOUbKl74iFyrcA%2FVlGy1ivyVFD4acU5PM7fWKLfgvNlp%2Bnp7VUswa%2FW1Vp79CCpSoqKtpAcHBwR7rnq%2BKaIch8trWMUVU2JqpU%2F%2ByixK2tDJzXJw0dUykHzqLDyWE9HU58rZ3hTsKxt2Dwg9dP9UH69OynMiXaXnzOQXCoy6QPGfUN24bw2%2F7nabewWXf3NPd1tQd7rpRVXciQcV9RO8wwojzgSxYxhsLD5%2BDrT5RGl3bU4K%2FxiJ2ugAqS%2BqLsAtspixQVfVfT6IEjuwAb0PWHeyGQvSk1hfIhfJ2%2F%2B%2FuuMy7m0m09xaI5z64kQWPnJyR8eoUUHjSknJgo5ynt9I4JU8kK21NvnLiricBYqhcOoRQGS3iO7dRrhjNv8SY2K9jphbLWAGS8N14f3NC2X2E9%2Bqjb4455DKecd519TlH2E2ptE4tFdfxSE%2BBqhk7tYXqTE2aC40PYHmRpzkiUhK0FGEImaV0K61CI6KHYvAD%2FgehMhyHKqGxNNO9BhxhVg4wZ8CR8y0tNnCNQ4nSCBcepP3rWDcuOQ0ThPpHUtzmR22GvCDft2ihY8MetuyfyZMuWTu5yXoqNJH2JraEfLrWM0B0Y7ieby2wBYr4rOqjUgZEnE3TL3E0Ep%2Ba00D%2F4eI4YOTkqBSTMPil5c8GOqUBIsfKqy5sLO7U2lYoefX7r%2BckCyYje6KPHVoS48S6dBEiAcIbOe4HJXKd67b1p7J4tv2%2F36v56zH3EAvlb%2FNnmQCjcXd6haZDGPNVMvVmE5QK1QOoKtTgvSmr8owpuZFSnAOFjAcxeS3KNYWCGdZ4u5n016m4RhllB%2FkFMnFaPJCpW3nXIkBr9y5AfnJGFNQhAnftUBG4NI396hW7BkA7e6mzJ5l8&X-Amz-Signature=29ec5141ceabf9c35bf46933f9ff0e6211cd9f982c3835493e352c4057bcfef6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664PBN5XXL%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034909Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDfyM74naS%2F1OoCabAommt95nLhMrJdDYAMSTYxEEQD%2FQIhAMuoMDutAp828l4Iu6rTm06U%2BiY6RtwXuMorGCK9zkW5Kv8DCHsQABoMNjM3NDIzMTgzODA1IgzO8%2BgL9NXc6vPryHAq3AP9pw87bClfRzx6w6w1iYLYFD2ASx52sn3u0ilTgZYgmQqfAG%2Fubq2crcMHum%2F2HhH25H09ZLLtVIzn7yVJ8KvasR9f1Np4c%2FfiZBAMOQ1ZGzyy%2F9rtNm6Sm9tbFtffWDzq5IxrOmFrD%2BynyWMVh9DkUzuFkOx%2FyoRf48y6F46jdxR%2B42vL4j4QRVJVKrV5XUH%2BS1sXFeffVaIgB1rb%2B3%2FdjZuWTA1JUSn7IJCM5qqoey3J3K52zJNFHSuojK7mu9u39e9%2BP1UTbIKaa2fsCItmx1fYBYDoX%2FRJes47QBLs2xovCrAhdxADGlGJYE2Jw4eAhD%2BzWvHHnoLfmCGrixXvpnwMuCAX6%2ByttO%2FNUtmnS3yLKUmoJBRuuDBKcDAx928ZdsvYFuSYrv8WiIwxikFHpHoY%2FWeq3EObfKzpNfs3tdcZbDHyD8A0kpLp7JlN1gbSTST0PYzRe7bPnqD99PCxp%2FVQx%2B%2FlU6bTglIq%2F46lkqbzy2fYJzB6R%2FYcQ1dXrNHx2zC4x%2Brx13x43B8IPK3%2BqiaM9B5PDQCLkN6jcLLMk1ohVXPDQjAaYUU7iXmymt6oQ8kivqBlVaF9m215eiC6XNSScIvjj1rnjSPqbdw%2Bi8M7o1VR%2BWVdDNfV0jCvpeXPBjqkATi2Ol8%2BSOaRd4%2FSn3eUO68A6VK60Ixzt2tZLC3sBa7uJ%2BYewVslJDA4mDiVIi9rGwe5gI0guvHllNma7LOyogbqe6hstyVkWm0UyRmlU7NQbawwnO00cRzFHz4ZgCRuAaetyKTM3FNmouP5J8BFfgNVM9MBWix%2BU%2FnSgdshtb22B2mXuAhIGvSIK%2FgyzfGLVFSVPL6mshn3QvFfvrkvBExLzjAO&X-Amz-Signature=42e6931a60fa7a308eed008c6d136e46b261678178e61bb432c941c68dd0c559&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466V3ESNXD5%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034910Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCOWmB3vHqo9HTH752KRQtpCcAz7ROh87gIMqxoSHQsLAIhALzoFpc9UwPK%2BPzhWU5FUCkh7ROtoLyqgDHs%2B31iOht0Kv8DCHsQABoMNjM3NDIzMTgzODA1Igy4Wkz23TG3DdveS8cq3AMutseMBI8%2FlHwoxIfDfVBR2hnKKEFTof0AQp%2FN%2F1W0oHOh9of62uw1ILMdiyRMqXipq4g8AL7VkoDH47mafivtaJvqKVwKw9YvxNc3f3OW1TlT6ZmJoU5MlL0lJz4NfgHm%2F%2BwStK%2B%2FdROScJOvkq7WZQIx1Be7zVMxvENMiMPmFZ%2BBgJ6uvb5E7medLCnvJDbYSHnSlDXMSwG%2Blxzk%2F1XqTnFF89QJBT521ZU9Fl8taFBPCzbPTM9g%2BiHVd9d9UkDuoCVrGuoEYNMB70zABpp1opnaoZu6sCxBU%2BrZqwh8T7qh%2FQSumuiU7ioZBRpT3mTIYSs5NJcVQaNKmaZH%2F%2FmRv%2FBeykXqkSPd%2FwFF5WydxvRh6APra%2BqEcN35wGzBITbCIaBGwnEKzknKxtTieF2AGxeay2PZrgyivxAa%2FaDM8iwUz57PGxlVyrartqJq4Phrwk5gPdXB6jLvjDvF%2BMRDsCCTSgsb%2BIC3NmXhnzaPJZ%2BO2PuxU5LyMwagrPVFr7oIwo9vXvvoyGEfhlJmv6FSeZsht4NWO0%2Bw%2Fkw3bL%2Bbuc00sAcQL%2B9zC9C1jEPQCROWZ9h2xeARyvgXPkaoZDpdpRI9CejKU5K%2BgT4CyWZecmPba966UIBmMbo%2FhjDypeXPBjqkATU1DqCnhEUHgiH8wJPEIvup7kGPbr9DlapLxxVVenQ3%2FWjNarAFHA4kNYnItxLKouzCo99JeE0dDlX9c%2Bz3mRiETqfRu3wDKjc8RJ4ag7pfTnVrMVVkn9BsNbAOQ0JLqE5JmG4Ks3EC7VdgqI1wsHmszMZ%2BOu1D6JR%2BX66po2NXzFrPUN7iGvItOb%2BYyKGm%2FPffiW5xdquKs6BcjyErQjekE0Ka&X-Amz-Signature=392c08d788f13bc3b636f1a64bd67f4a5845b96b5b4a0ff5c83590bcfe5f585b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SN3LM363%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC%2Bhg9no2Oud3KHLbh5Cd2H2nsxRW9sw%2BO33sEcF6iPfQIgHdrKHBIVeL2pElTTO5taipd1sXZ%2FjoSEsRC8g8PJm8Eq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDDmwy%2BdGjRu3QfviGCrcAxTzCbB9cCCaNznAx11dJ6PbD0wcysDJ9CWbk7ml9RGjVxH1a587nyAGlUBEO6Owwc9M4XIB7fz02%2BCSZddm36pzfIyRlSY6nAb3%2F4rsGCxSFlK3%2FAq37vl0SP3xCIq8d8p0p49M3Wi4wpgpA9ikhmVU5df32yPC7iz5s3NPeffjR%2FyIhI8cJxPcCgFafGHvL2NBuuhqTu4u8pfQ5mLsaCxUpedzmMbwMISU2qz2YGlns%2FZ6tn6MNUra%2Fy6OnLPS4OtteYeMnVSXgsOMyjFvrgIargsxT9Ym5geBPtkUs6i%2BSfnWtQfo1xvYEpn6yf7Eivgd59H9OJuob4jhgZTEKJR7KurNwAMNh5scUR8fBGb7KGyl9a%2F%2BBLzQ4tF3vzkvmDiWKA6Y2mfK2RCLAYExUcxyhge47hO%2BrutLyvP2DEF2uB8dHcEe9ikg%2F9TX6541n7K1IifE0E0fM2HahvEyDyd86MOSAmbj1oDnu6nPPkFMSWcMYBy0nIS1gZ4yWxwoyV5%2FFfNGaYbnJYieMe7%2B3Hv9gJFoaiVBf0nAJ1dYdJZg5GC95FcrlgFQ5QyVtT2vS71OTMGgkjlvT4IrluZqnw2wvsyWQJ8C0%2FwonHAG1xSbTfPyLiS7mHotoSkNMPam5c8GOqUBRXlPPi8kpQSpIzu041WzhD7rz%2B17TbmLeaPn7HYjOF9lbXM0Ls6kL5QJKzNqdMQ5kNPvak12pWVhFjU1yNPVq79%2F5Iwh2ST03LF8OPNlSnM3QW7M3DSGLsleB4%2F3glwxvOih%2FdW%2FwhnwfB5LqP3jLWmpFrWWBQirvoHHRIs1ong%2B5FUcQahk6WMVv9DMASi4wy73p0vqQjm8EYiyfi5UGoQ9y7Dl&X-Amz-Signature=0c09411b14efe5c0ce8e6618557546228db843e8c4e93071cd12ae4c8f589341&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SYHK2SP%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCOfpoTYXhVHQuWMUyWoxsJvym53lVSeyUOY6r5kk%2FZIgIgOZbXAQRjWBb3vBPwEl52C1vbZRz84kd1jwq8G4bzSZ4q%2FwMIfRAAGgw2Mzc0MjMxODM4MDUiDEDbOcfaeNoESx9xgSrcA%2FWuXc22yPVnFMFNGWMjXlMb62LpTPSWAaoLsa9a5ksEiXzKGEiQ0nq%2F69IhAp2RwboL56wRFwVfGNi5TNd8rdOQeKZRtcBH7HbzucpUoN0S7j%2BC0zHtEJdDM5w5WDn3mKZi02%2F5LxxH8Spysr2m4kCm1kClG7DS2eZelQiszuJ5VxiR%2FnRDJLIHDu1HersC0OE6ROmgm78kZmli5IQzJGScp3W9WXwSpARfEOjvnIjuxdL4o2q24C2bmzSTrYIEmAKqHbYGnl7puU1VHO0z%2FBUwiUXOqiYEXSZ%2F52H0QANuQ0qCvg3MV%2BuZvc%2FxPPtQnhefHFxdZc6whv80Q8HB0Rzr1yu6zuIqMY1uX%2FI7LFV6F8V99bqjp7MaLeqUzvVvvJSFtkXuRcFggFtqQFnB5Ci6WjgTJQeix%2FO855izW2QUEQOg5%2BDWoWf9TEJC0n2XdSJChj0KdT%2BjMUHcXRiYaAfGBWzyafOIEqGAAPSrYW19c0OpEUQKZMX9dlExDLyFyU8E1EbfpIsqXg9giUZsRbRpMgBTxtasWT2ABJN0%2FzdDGwAxIgBnmd3xFrjx2dRqt3EfjiI%2FYiTRWuEu5Kn67XKPSQre7%2BifInBq30BBEFQ61l%2FSD%2FuKD8xUenTeMPTG5c8GOqUBw3lmV3%2B%2FBhiaDNg%2FvgLuxjJLNmuaC0ePc8X73dg7QMCdyD9%2BKXoZI29bRsWgnm%2Fs2Y7ZfORlfVNM6m8rKj0mTsH7cMh5F96UJR%2FgLCr%2BXBK1ldNNiTka4KonTV%2BjMPhbOZb2RV%2Bp6zA4y7Bj5AjLDtz7P6E6lKS%2BgfeEe1dUNRLsIt1c4vzcLhb7v7CcGkr0D5V%2FezpLTNDKHwZygI2R2b20PrcJ&X-Amz-Signature=b86c34e194686bc7f04c4de85688d2b18ad9f75772c87ca99d02727b196faa3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UHACW2Q7%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034911Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCoX7u1GnGbAre9R9fMgCyluQ2X6NHg%2BpH9%2FwM6ei2zUAIhAInEg3THD%2FDBxmV3p9WOmgzfo%2BtD5LfnGHf4nmKYDHqpKv8DCHsQABoMNjM3NDIzMTgzODA1IgyUOWEVzBCK1WYkqBkq3AN2iKeGPOK8XNgV66hczxVwhed8Yx0eKIROlwe77p%2FLQEGboCy6dcjHinbI9xDg1gRdgpJbuuNrBQPvoNofw3x0ei2RtXSXcn1SlLhWMInWFjBoMPDpCR0Y1JvNmRup4tiuuSQHCHIObJIYuI5AQav9egFRjgWORdpqL0WPCZVUbr%2FJAszS%2FastUwpMUFPvS%2F0IwGfFwFNv5MgvYtbq8KTaoDUrSSgF6S6IS2QKDEqbDYiNfUlXIcMT9kI4AGEMbw8EY%2FMBF1PJxJS98lXQTRtrqpyhfZ6K29LYp2lVszEXcNJMDYjlzKP7sb6ZGE6hLWZPP%2FK1J5V48GNGu3VVRs%2B63CnEs7xalYhjZ1hyC%2BrLUlwepm3ziKGdLmenVRE9R77%2BDx8LoP5rqzDqI4vDuCrpLZAwfLz%2BUQROXIn4CXkH1terBrfSdgZZuXlYkJpEsPBznjpQVZaFr3JWs5y18M9f9bOpZemx%2BJlqhQFkHcF1iCTN49cJXZ7PKBl4s5M0nfs6%2B7ZhRYJMu4bHu%2FhNu6a5N%2B0qdcjCEdKXjKuJpvZxoCM5oiDOdKhWzOpd6p1v3mLysIVoGuwTfg%2FTfMBDQd7%2F1fTGr7SawSHVYr9fWdsHeLFCz8gS87MgChobADDQpeXPBjqkAU774ZyAb%2F5NXOviWDcVcMEuwtjK1MawXwfk3KIPePkdrHkkNwwDhMjueLFpjttt1ZUtAHpTvPqL6NiNLtRclihX60%2FuGu7R%2FZOfIYTonQYYYi2CbjE0reVx6k6JnL8Fj5rqCUvi%2Fs86waZ%2Fp%2FbA5MDat4Qgan7BxM%2BbufNzr2lKHT18pZ0Tk1NskZ1urn9547gATonL%2BdyTQqGFJ0QMPV9ORp4R&X-Amz-Signature=50c2e51b2daca5e5c0918d26baebd80b1dcfefd2b6422f3703d2aab5a649e73a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X2E436BN%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T034912Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDEJ%2BFDeUwsE3p5bhDdfwrWhoR3GRBEKF4WVxKud2xYrwIgBJ1xtkMgL4prVQfQkjsUHiqrAs%2BSknu2Xlh1zj4%2FfNQq%2FwMIexAAGgw2Mzc0MjMxODM4MDUiDKVhdF1YOVOVS%2BbanCrcA06QpiMCCrlV82mDjMSzUWOoFH%2FXNz%2BMrDiylltJqMoORqjD2a9VI6HpryiVQPECTBimJYcxKE46Wa0VMvLV4wJr5LRMoHKEYhydjyH2SLr6pE9XJ1ylPI%2BFYnjIVbkJQDS%2F%2F2oUJ%2BvbwQk9GKGQ14jHXjCEoSXvXbBLHto%2FC2PEbHKVX63kI%2FneehEjVFd%2FQYG0zu8%2B3KwgugHmfPCv1q%2BNJecfOZes%2FiEbT2eR51108QaqVuq1wyIfGSer56PzuzP6qDABjatj8bx4g7FcliEtY8jcWOh%2B8U2cvL8%2Fp1ND58HTOMvml12EQ2%2B4rRUkfjdzotk8EegIxPfO%2FEMga4ijbwWVG8yGWm3rNMbQ0pEP%2FXouIpg6U40xSKTZZQHexa9J%2B3U2%2FnD3NnaK3ZrtFwNpA%2FEQXZWSOw3bNZPsQeXbgd1tQKOdR2L2tt9uiJwg%2FIfn7N7SoZuB4YqSwofUtlQlu%2FjbxgzT2KeFKj8VtdehKkuIHAQPJp7gD9AT7D3JRxZhkZMduLZjt%2Bl5402O2zk0Ac0svDlXIcAQHQMdVxndz%2BJJx%2B9c%2Bz8Un814G0NTvcwgR1iGZJa8tq3aj%2FFPgYj%2B3o27izjmmQuMjgpN6cW8zj0AeI7TD7ak6UexMNOm5c8GOqUBvYnqA37vvguz6I0iBlcPC5R7dnuwip%2Fx0S7tcjbQ2KurC2OpBtl6lC02RPtEvVETtd27re3Y8GN5KvRNaPeuU%2B7N%2BJZvEj9biPWR4CalT01whUs6Qyxi5nhyvPUPNBPk9BnDkp8fRFQTAmDPBqnG587F%2BG7ZW9vFWkih23KirbnON01oR2%2BPjANnPsPC1h9pVIJeoNAZPb4pZaV5zdxse87yj98n&X-Amz-Signature=40a4c3c5828b1cec707dd961c97c53820d1f0556140d0b99cb1a8b019124eeff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
