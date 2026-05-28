---
title: "SpatialVLM: Endowing Vision-Language Models with Spatial Reasoning Capabilities"
date: 2026-04-27
categories: [paper-review, spatial-reasoning]
tags: [mllm, vision-language]
---

- google, mit

## Abstract


![spatial vlm은 vlm의 공간 추론 능력을 향상시키기 위한 데이터 생성 및 사전학습 방법 - 이렇게 학습한 모델은 이미지에서 실제 미터단위 거리를 추정할 수 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a45bd11e-d713-4104-8b83-eea1d0789f37/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46655AUG3T4%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043803Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDhB9vVzHvRWFd6%2BwKhzvL0n7k2a72g54S5w0e%2FYTXVkAiAx4m%2FhijDgKiCsNDCxUzCmvt529WxrwHra9mcPu48uuiqIBAim%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMengDAqEZwGMZBK7lKtwD8GGbMDtbtbyd06r9Hpi87g1bCejLvZOYy8GxuEgiSXZ7kvBAKkZm%2BJwcCyPsOBBwd5tQdmZ8XKSuiwYuVzQkGu2kTM9wqJT3D%2Bm3DqSPGXVmyDQrLPhDNelMLVGl2S9pgx4S0Y7yihC%2FIdwjmKK1pBhU0rpehPXrcj6BHyWEC1u%2FJws0WfCeDAWKi2%2FSxvcyS0w%2B1HcQMGyHTuF%2Fc18mJF%2B8L%2FQqivgCCiVpgKPasfkCl1eGCxGSjhRITBBQNp8oBuOpFo9M1IURt0M9U3SCYTryGyE2Q%2B7BiBQTc48VuKcHIdpjOvUEPZUKDwcjTH5NUbkYXCuGRP2XwAd3TLjRC7zv7j4Hxo%2BODOlUvWHjT35yHJwoAOJ9ImlflyQdu60%2FPMFP6eeqvCZd8vLU6lytHJSFpOQgQ6Ql1nkzdpRJiGbfQnDDItbUTeMxl%2B0yD3Px3v5nhAI%2Bwr8sM1VM0UynTgKQDSwIZzoXZi96pr2fD9UNfSVpqu%2F2bWdLW5LYjaBVl5A%2B4AesEGFEhWVfTdzt2eZhkyNKj6OYN%2F4ghyfHMR1CK6d7pHHpTIHBOzB%2BooP9qzVlFPRgIVDzh9b6D%2Bfr%2F4sfJPbdKRwY9i%2BXoTtXADMj8n5RmGFYbxVDhT4w4ovf0AY6pgGlLgUnB4Tf36CBRLpxQRsU5%2Bn4D9tjwOVu50M5lAfzd6XO7enSHQ9A70YVSLZwxhU%2FZ9jIrGKlcnF2oZ6J1j35LlWypLCuCXRXOERaJh%2F5KOnbRXG6QCG1REqYfjDaxLu2d%2FQbqIY8KMQ%2Be%2FzSOyGWIVLsbp%2BvApfBEZrPbDDSBY5GH%2B7D9qSBLDkE%2BZ1Mo0C0sGqdxykbgOs5gZpkyvXNczsBCyTt&X-Amz-Signature=5c139a5188f2b0f25e35c2fb886a88257c13fa4be24ecb6950bc82bf7e651939&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8fc0831a-7c57-4be4-b83d-28e4a468488e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46655AUG3T4%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043803Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDhB9vVzHvRWFd6%2BwKhzvL0n7k2a72g54S5w0e%2FYTXVkAiAx4m%2FhijDgKiCsNDCxUzCmvt529WxrwHra9mcPu48uuiqIBAim%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMengDAqEZwGMZBK7lKtwD8GGbMDtbtbyd06r9Hpi87g1bCejLvZOYy8GxuEgiSXZ7kvBAKkZm%2BJwcCyPsOBBwd5tQdmZ8XKSuiwYuVzQkGu2kTM9wqJT3D%2Bm3DqSPGXVmyDQrLPhDNelMLVGl2S9pgx4S0Y7yihC%2FIdwjmKK1pBhU0rpehPXrcj6BHyWEC1u%2FJws0WfCeDAWKi2%2FSxvcyS0w%2B1HcQMGyHTuF%2Fc18mJF%2B8L%2FQqivgCCiVpgKPasfkCl1eGCxGSjhRITBBQNp8oBuOpFo9M1IURt0M9U3SCYTryGyE2Q%2B7BiBQTc48VuKcHIdpjOvUEPZUKDwcjTH5NUbkYXCuGRP2XwAd3TLjRC7zv7j4Hxo%2BODOlUvWHjT35yHJwoAOJ9ImlflyQdu60%2FPMFP6eeqvCZd8vLU6lytHJSFpOQgQ6Ql1nkzdpRJiGbfQnDDItbUTeMxl%2B0yD3Px3v5nhAI%2Bwr8sM1VM0UynTgKQDSwIZzoXZi96pr2fD9UNfSVpqu%2F2bWdLW5LYjaBVl5A%2B4AesEGFEhWVfTdzt2eZhkyNKj6OYN%2F4ghyfHMR1CK6d7pHHpTIHBOzB%2BooP9qzVlFPRgIVDzh9b6D%2Bfr%2F4sfJPbdKRwY9i%2BXoTtXADMj8n5RmGFYbxVDhT4w4ovf0AY6pgGlLgUnB4Tf36CBRLpxQRsU5%2Bn4D9tjwOVu50M5lAfzd6XO7enSHQ9A70YVSLZwxhU%2FZ9jIrGKlcnF2oZ6J1j35LlWypLCuCXRXOERaJh%2F5KOnbRXG6QCG1REqYfjDaxLu2d%2FQbqIY8KMQ%2Be%2FzSOyGWIVLsbp%2BvApfBEZrPbDDSBY5GH%2B7D9qSBLDkE%2BZ1Mo0C0sGqdxykbgOs5gZpkyvXNczsBCyTt&X-Amz-Signature=b32a0082bda58a7e25a7cf309f275ea075b4e186574286934e5db32c7e33e011&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c8e71ac0-d3c2-43f4-b956-ab9eed565989/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46655AUG3T4%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043803Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDhB9vVzHvRWFd6%2BwKhzvL0n7k2a72g54S5w0e%2FYTXVkAiAx4m%2FhijDgKiCsNDCxUzCmvt529WxrwHra9mcPu48uuiqIBAim%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMengDAqEZwGMZBK7lKtwD8GGbMDtbtbyd06r9Hpi87g1bCejLvZOYy8GxuEgiSXZ7kvBAKkZm%2BJwcCyPsOBBwd5tQdmZ8XKSuiwYuVzQkGu2kTM9wqJT3D%2Bm3DqSPGXVmyDQrLPhDNelMLVGl2S9pgx4S0Y7yihC%2FIdwjmKK1pBhU0rpehPXrcj6BHyWEC1u%2FJws0WfCeDAWKi2%2FSxvcyS0w%2B1HcQMGyHTuF%2Fc18mJF%2B8L%2FQqivgCCiVpgKPasfkCl1eGCxGSjhRITBBQNp8oBuOpFo9M1IURt0M9U3SCYTryGyE2Q%2B7BiBQTc48VuKcHIdpjOvUEPZUKDwcjTH5NUbkYXCuGRP2XwAd3TLjRC7zv7j4Hxo%2BODOlUvWHjT35yHJwoAOJ9ImlflyQdu60%2FPMFP6eeqvCZd8vLU6lytHJSFpOQgQ6Ql1nkzdpRJiGbfQnDDItbUTeMxl%2B0yD3Px3v5nhAI%2Bwr8sM1VM0UynTgKQDSwIZzoXZi96pr2fD9UNfSVpqu%2F2bWdLW5LYjaBVl5A%2B4AesEGFEhWVfTdzt2eZhkyNKj6OYN%2F4ghyfHMR1CK6d7pHHpTIHBOzB%2BooP9qzVlFPRgIVDzh9b6D%2Bfr%2F4sfJPbdKRwY9i%2BXoTtXADMj8n5RmGFYbxVDhT4w4ovf0AY6pgGlLgUnB4Tf36CBRLpxQRsU5%2Bn4D9tjwOVu50M5lAfzd6XO7enSHQ9A70YVSLZwxhU%2FZ9jIrGKlcnF2oZ6J1j35LlWypLCuCXRXOERaJh%2F5KOnbRXG6QCG1REqYfjDaxLu2d%2FQbqIY8KMQ%2Be%2FzSOyGWIVLsbp%2BvApfBEZrPbDDSBY5GH%2B7D9qSBLDkE%2BZ1Mo0C0sGqdxykbgOs5gZpkyvXNczsBCyTt&X-Amz-Signature=83cce541098c8bea415657dc6f79c2fc8a278d57729b9290bab3666e4981c0a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/31f32f83-57ef-496e-9f8c-7f62cc586515/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QYMGQTQY%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043811Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIARq0I9ckzFpdW9ad%2FEIl6VTO4w%2FnyHJlyk5woDbFmbOAiEA%2FWft43E%2Bes2ZlHmlZwsw9JLqi7t7MBn9XHVRYmzR2tcqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDOO2r1%2Fn43nLiDhwMSrcAw28kLNOF3xA5j34WJ77sPodbJoskH%2Fgsg%2Fjr0GqbKE%2FtCzJ9VJ%2F66YuVH1I2Af8PHzlA9UXAPn8C7eBXDMHKl222bzF29V2wTACfX3P%2Bu03QuIe4JUcmv8AmljgwpBz0uImRY3Eew%2Bd3fCVjXZB9zFg3r%2BH2btgsn59EJBJ3fcyaV0KB6uGFtwt8yf1rPahWJ%2FwZ1mIxrJDQTh2HloX9Ugg0nNrh3E04P5xxHHa5wzymcmWd2jioiKGHejC8OHaZtwAP08wC2Tyj2I8mX%2FDi7n5Ph7jleMRQ7MXXdRgVcE%2BrZOPylIwx%2FueOdbsMTFvFzYBFDBRr3K6MkKJrEPssRY78e170itd8FGO0dRhGrULWU0dOQDg8iqT7MkuQzJpzkXta2Gms9hPJ9sv%2BmdKBJc1qsvoR1IyeeNqd5zodpfOXI7QeYBeJMiOZECD0o14T%2BolTeW%2F5kBebaI7DsM4dGbQ69jh96%2BFzdJKKvag1oEjPL%2F88gq1ZVuGRbxmDr1fpfh9tnRjxrh6gPii6ZyVbZZ6wDxo%2FAIUNyeNlaaxRskd3Uvx8G0aK0l71YAfhBjal7zmnw9vqKuWgea6698o61545BLoVMvHzMxP36gsO6NR%2FgnyVHKFHpasal5CMN7l3tAGOqUBgSRRgz90RoDhYhBSk53xJ%2B6zdksG4CbgpHFV1WJdYse%2FrqokCqZtKT2xN9QEAbSpjIqE6B3wfcjC8W9yPsdNzTkoqUFcBu4BbwICm%2FYunpYDgeuRYb%2FZiWKWfvEX9KncFTbJZxXPGRyxdmBvq3oIkOvC%2Bi449GUPXBDWSKgUQdSMbd9IZE%2BDC%2BHTENPssm9%2BW8L2m53F0WOWk7X%2B9Ducne%2FRKgru&X-Amz-Signature=693953060c366dc492864997cd1b86e155c4b4daaf3ce9c36694e527ad924f22&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9b83bc19-0f22-406d-a8a4-4fc8c7c7a25c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOYPRG3L%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043813Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEdUhPfUtAperzxFROBOab97d9vivFyljgwBm25xZ1swAiEAytn55X8TynPVZaxKRjDOxSWE6B7j7cXEZCUheLruNxQqiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMWpsAS8hA6CLqSxGSrcA6vbuitzUYZkXp42nYDjQbffFHLrzFWZegwqOdlXfm2UpYrEVipWOkMgjqn7a%2BD8ZQXzA2xiy9d5TVJhMd00dtmL2Ytv8bsYj%2FpbmbBd5plADNOWv37LYUFYVfo1%2BAJ1dN3f9wIrCEfJLJ6j3eUOt9R9ln01n4mw1VCGHNK4g50jRcfaXouxVFHtMQui74F9qiC0smXCOm6A9hGhSjJyKNadS%2BQaTe6Ph6gWoQskZtC3JT26wBR%2B9exxlQzhD%2Bc%2BWggR0wsU15%2BR4U9Y3eekqZqDV2w4kokDPzlUe7CJc5ihTOObSdTs6NOtlOPwGN8MRWPV%2Becbzy0nwFOTKkoBY5My2vnp4auMzyx5n447cEoYnIJt3f72wwnjXJHpGlwZPlBkTeGeTZkirR9HUXW6bU1hmP4WDe4lT0bsiR4cqmh280H9v0KpdeFiKL0hXJ3J6GXP86WrEvOHsAj2zbk7npSdGU0vVWF90U6MOy7CoYzMZ9VIdmGsbFRFbcW6LlXC5MBuGYrZbMVCaALcBLGIuV9O%2Bnv5Ex20eliWSkvy4FmLBoyMEQISEdshhsaZF5HxBPK9zvVSTvKF8lS4gr5eSLirPH8AQhgwx6ygx97Xs1UMKM5xFaC9SPNzvirYMIyM39AGOqUB8JwPUnPXffl0Oj1FkJFudjki4HVx7%2FvnyJ%2FFtQ8fMIJP%2BugG%2B705gO0zA3aQn2mWGnbN8YQ2L%2BfhYVLvMcM7eiNU4DU0oGJfjhZ3vyJ575OlcNGMy8yZRthiNQsZmSybaKTpVjWycn%2F2vikEUD9bvnut2EgwpX5ZpmFLJqhCXVGN2IFwcs%2FVmkkddNdV98AO5%2BGgtkP12zpR6YYnMmmKBOtkzANW&X-Amz-Signature=55bae29dcf7f95289eb10fa3c33c8dd8b6a456642448e561690370b48abe71c9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9cbfeede-0190-452b-908f-93ba6786811b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W3D4IUQO%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG2JO20%2FJGF8yQLjeff1kyVYCxc2rfiDtFtLAB75bXAaAiEAzS3jTdoZHQd5kmPU2yE8XZfhg7IyL8RTqh4wPWBB9JwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDD%2FztKJx7xSsb2tbVSrcA7d93UGEoMaiRYEbRNKejH0BmvmhqL8bvjzOQyZE55hwApjaEKbBgxAf4qtfBbsyGSl58PnIHNjnINeWuiHrX8kO5oiVdvt9c3SRVqhwZRlzR1kue73JE8Q%2Bw21W%2FaUPCfc0jGPe5%2ByDINAKtC2c6kHiVviPIh5dSgNUr0qLAX2iPvwIjmsSGoPVH9AZ43LerwpW9SGCdhHufk7Cvwzdf%2Bwpy3d8LZjDONo5%2FFixf8u1mCPPB0Ly59kPS5CKat5jQK8unu8AYUUn5HuZ95gmBT5CCVnad5cQckDXOvRsoHwV4ExDIBk0tgUxRHXa9dgw5ICh9zV69So60T72jfLnqrKOjgWAtPb8GqSL2RZVzeJSYThrBGKzW1o1eQxuRFKyxf0MFKCzI%2B4Dh5%2FhO9lMTY12UicmhVo%2FbMEUVaY0ceySBZ5mGYhONxyjpBj7acSVrwE1NXT41VcmrM3JZ9qxwTO%2FxFHEEy6Vn%2FTZGVPIwx9UQjcUbCFDYdpvCJ%2FeCHI3nn1yH76lQZHdKMKwtNgqmaFucD5BPH2sWgtAoK1fzmMirFt9jovHGuVOvUpXawMulV%2BaGWjS1FVi9iZ5ukr5NoUf4d7%2FQ61WNaFN%2BkuH7Woe25aIPMCPp4wm0KuyMLnl3tAGOqUBHYajjuvZ88GNzxEmMA603fW43i6PToGUyJ8MuBD8wXH5QK0FkzXnEfTv97ODj79pLlpNeZ%2B2%2Bp%2FCJC9ro%2FeaBLQJJLl5YjgJO3451fGTMAcn%2FURehseQXG%2BrzZWwxCksi%2BXV3ZT7iW%2BFtAI6gSsD7GX9VVjHf41ZIOu1K6f%2FXOJolugjJpSReSu3TtjtGlxZpZM%2BO2MkHa7xeDmv2FDtByLbMluM&X-Amz-Signature=874bea6336cd61fbb701bfc8b69fa8ed593b08d5e23f38fc7de5a74a65cdf5e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 우리 모델이 PALM과 거의 유사한 성능
    - 공간 추론 질문이 포함된 VQA v2에서는 오히려 더 좋은 성능
    - vlm들이 공간 추론과 관련된 task 분포에서 전반적으로 underfit 상태임
    - 그래서 공간 vqa 학습을 추가해도 일반 vqa 성능을 해치지 않으면서 오히려 도움이 될 수 있음을 의미함
- 4.3. 공간 추론에서 vision transformer의 역할

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/90aa2c9a-76d6-4a17-91b3-f6bf537cac16/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RM4UDYUS%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHLAyLWoGvIEkgb99r1XZV90AHJvoDXxMRC21gr8sT0cAiBX6MEyfOmmygrN9zGB%2Bz%2FxYl6d7%2Fh8JSIX5ic7QWoWfiqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMT3ZSlTqx24d2T4xbKtwDvpIH3jQloKRazmpEHZZelTNdP2HY9FpmpOzd1kyJU2uQOShr%2FB%2BMxlmTvPx1gpNkv6YzLbgY8dvaOJHx56EjAgbEu0A3XanyN48BKsH1esj8xSslc2rrpkbNQjRQ7ZX6acGGY9gy%2F7MMH8sq1jGbFRphN1B9btxFzRO3ZNrJ%2FzN1wTVmzgJbV8nGajR4SLlnY6X2giqx3dqYaCzdQGVgohWg7Bn4rOK5b6txshr7sbI3Mj479HZJJlrBiQjs%2ByeM%2Bqc9HDq8PZzzPzib7eYQtb0EarUh6y1pFEuV9j7NcOwcMdf%2BO4kx9JbZoYtvo56WEgFRLM7q8a7flOaoSGZjZqcudhqL8x%2Bmg2NGmRMJXK7fnQacehMYCoAWRzx3Bi5urHToL2pPis%2F7m1KAG%2FHUmQJXtwf0K8o%2BcUIp3Uv49bM7QAY%2FscBAQpdMV3sTPaVx%2F30w%2BxFjo1P9j%2FGRLOkSTbYS6QIjOSfX%2FdraNc2aCVzufz56HZPad6%2FzSJDFg6HK95LCU%2BO9WnzdGW8D%2FUPimI64nUQ7BRyGTbBE9t7hmor5X3qW3DLRb7X8MCxyrApH1kZdAxo7nd4hDA68zX7YqJdoqo5iWhOaBO10hC6GIfISVgg77aTpp7paY1Qw2OXe0AY6pgHGEl6bIIWGHw5FtY7hnfYBPomHBiK3khpuXc4Tv4vJtZxhUsRaSm90Rig%2FwIfUJ2wuAPsWBUeXahNJ8ZXlsj%2BflmsUIaWAq9LRsV%2F6UVBZqCa4Lsy1lSgzxcXQSmyaXZwtPTxboo%2F3xNgMuVMLzLhL8vQdGNgmJNfPSjoAd8qy98Hr4GvpnAoF0z2ELyb7is8FUHxN2yohhHXuuRPr8aj9E0mtTyLI&X-Amz-Signature=f24983081da84d1adac3f4b9ca882344d9079421aed36b431af57e9b03ff8dfd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ba2bdfe8-c9de-4cd4-8278-ad44e1f27aa3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XHKHBLJQ%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDRayTPd6VPAi8y7jNzrPc7imnrG3gwcKFnRsB3Vx83VAiEAyS6%2B2hJUHBG4NH3CstXkRQrKItichtFCniefHGbQnG4qiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDM1VnjtKonBEJFItDSrcAyQbyKetql2RlLCG1ju%2BvHSp%2Bjf%2BN8ByUfK3jtMPC%2FGDNekac5qcFQI2bJdxi4BT68fEpl%2FSIzSLrmRP7cwcqbjlnX3CeZ4%2BY8SVKhxb7otv6uwiQgjSpI1dzIzvkDpaEFXMaZQpLrTWVvdXKprK7NRN2mWA7Aphwxr%2FsDo8biJuo7%2BdmReCaM364qTu7YMjanp5zYB232eOq52qWN%2BY6r1Sgc%2B6%2BwlNw9SLx6t0FHiOki65ipwo7ue0aL%2FFcqcqplLjXFNNqbYSl%2FCXcsB322OewOBpBqMWUD7blJsSPrpXJiBmNiaN1TGbHfX10v6LyMpRe0RuI%2BGj99iZWfx20mZwg0spl8l2t0sG7bqqH6LV7URAulqooY7xR8TZMf93cup2WUlTHiFVoQ1c54iLux%2BUtlB2Lp%2B2Y9Fm9aK9ZWNkXxHE5iHPYrYJBgakdMN56C27IZZ%2BiXk8cQX57UIJ6yqLqtng5HYrkbjI5RTbUCoOX2joRGvQZF5J4I%2FjwCQXLnAWuFmBl61Khm2aHMRVjw02xCNlXAH5k0rkZNPwh2qq9M1TsOyX0thVAUSmQK2dEygDDnZChbUJVKk9MjVxy4idJCFSP1hXOfOevy6PPCG2ed%2F%2BZRSNjm9JkZDXMLrk3tAGOqUB4xkhJFjlqR%2B1F7BC3zts9PGsTh1OVVbUyE3%2FX%2Fb4e7Rc%2BbiR79pfxbSeAcTBeWEhtGZlOWOQaWnJgqMMIDsfGiJnFJ%2FBzvSmZA2vtQM6HEDC6gqGYl09kPKWQYXoNXZ7IaJDedSLDpfLf4DSfOdADylyyAU7beiRpQlIH32KHGiwVWaY%2BRqPrAMVi5AwKgvFY0uje6XU7frXOQTITYZ%2Fbo%2FJ7Flt&X-Amz-Signature=9ad9ba639a6d5b92d0a4d20374022d7e8486c02e246e6f1eb2e6508d751168a0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 정확한 데이터셋의 정량 답변에 가우시안 노이즈를 추가해서 다양한 수준의 노이즈 데이터셋을 생성

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/06cfaaec-8cfa-4cb0-96cb-d1bc646dc463/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663VACSOPW%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIEsxDHT7xSPfGUZIZf5qCcUm6Cl%2B8EAvd27AkUV8egC2AiEAoyjhPr8pyh9eeC7N1nfBnBEUKf5JAJZIsO5iuk8SQAsqiAQIpf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPCyIVeWM4qae2%2BPOyrcA1h60rfreN%2BJtMfpaJGaD8EWWA1W7aWxpq0R9dq0tWGotqMSKRCed2PQN9ETPniL8sEx1LqcMv9asPbeVtrVps5lXhPp6cQcj73Yc3gVe7dL73m%2B7fgddKNYedbEx6H9Wkb2bwqTvyzvkSuEHDH19bNyWg6vajNbcl1YDJi0Nkd8FECoLxTGnZzoX9VH94qNEgskevNHU4g7cs3xRWC04fX89it8%2BmfMAdfn17TRsIN7lLqrQqSu9KgDg0UPkCuVjTZWizhwOJTHemZczP332FdOj4%2Bxn0534Xzfr3gkCEMQZ8g82jH0Ci%2FJYIM%2FYjR8qt6SZyW2d4CPWep69NUnJQPRMRBCv%2FFLo56GPHFH532Ds6ou9QS%2Bh3Ftba5WMFD%2BUxIaE1874iQfEJq1RUAaTTVZb1no2ZLi5nOzh96qm%2BaisWbXXP5NbU50tNEiGJjplr0X7ckeewFNh%2F2DvDKTnKpm1EqZdYtz9zCqeNkP75QHlcBZyy%2BDbPhurQReckDpS5HZIx%2FWTc5qTOCgaDpJh%2Bwjgg5SQGMux3Ca2flXWDZFHZbbVH%2F7%2BPtChfVynz5nD4S5jboDBrxlbrW3w%2F54p67IOXfGsrHBISAogCAlob9FNQvASB3hEActPy16MMmF39AGOqUBcVb4LSWZfRE%2BCeYeBEp0p3LsjLp%2BeHT1MbX0NRqANkHVw6oBu5sQrPcNHhMJA1ZIp2%2Fdse8ykGsGarT2aZk2ay%2F%2FCwZqGjxM0BmSD7YRC5mqXLiw9sKD27Azcmvd%2FrRwxcJXDJNCatlpQnexXhxkFGDaTnvhkD%2F2qIPKqPCtodUyigVcj1bXmYJqLK4ikruXWFDmtMous56t7SOr5renpEkCqa3U&X-Amz-Signature=ec009d6fc9e9403590cd1e1864c629cae2e6ea92329a4a9c88a382e6e0c96777&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 서로 다른 노이즈 수준으로 학습된 vlm은 유사한 공간 추론 정확도를 보임
    - 학습 / 평가 데이터 모두에서 노이즈가 존재하기 때문이고, vlm이 노이즈 속에서도 공간 추론에 대한 일종의 상식을 학습하기 때문이라고 추정함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3a6059d1-d4c5-44f7-89d0-445ed9b5ed91/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SUS5PVAX%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043815Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCiq42xMANYIfg8XiqiCrgDbGz5sdGzN9%2FkxABtF9snDAIgFwoximhVWnASoQomdfxSsH59IgIbtp453JrPI4Vpr%2B4qiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGLOQiaL6ufjF7Vu5CrcAzbsL9RL%2F1UU8hmGN58nc6MnLLoK5l9h1nAIMzGFHKDtsKiQnUPAfHAfL5snIqcalv0XYHi737%2BpJGyjNiz87tGdyjkiZtbqzZRqZ5oA9Kz1%2BizSjUBgCs3U1KF9d5dlGiQbWJ8o9A9YHmMEJT3bUEwLUUxTSesq8cODokBUABeqOXY1aisRvsF4ilgf%2FqWmABe1YghWpRW8pQowDuitAZEK6EQyRHqA4RcXzmGxw0P6T4V8aH6AEYMIguiJhGtltM3AFAk2QldYt4pcrJQZEuEM%2F%2BNuIqN%2BK4QcnhJa16d4pwAFDjwqYyRyoaT5O3LvGvad4SDgI%2B9BGr4fEWUcW%2FUpEDvYFIZ9Ug78%2Bl%2FlZMn461BL%2F4NQIeaBe9GvXM%2Fy5E1BhMWPfjUKRU1Iwht5vuPwsv3edZcGoM%2B%2FIXAVpu5pwEsXzC0L6LwH0C7Y0CTf10Awl5pdvrddGNzZuJfKjWpffUEx0BVM4wSrq6xbjSuFznas1SBHH03kcZd0HEUvjnZu%2BlV2N66VbJpuNJRERkJdZcpsweiO9iXhteCXuO5aJOZA77rQdnOIwLIeaji33o6ezV9MAyr5H3XUrrczDa8fDKv%2FemAZ1RRTeKKxWk2YN9du8iBDR613GBwmMP2L39AGOqUBe1mV4ntQwU2rgOx1dbS9CHOruNpdmh8t0jNiu9sIZrHsN8WhkFU%2FA%2BldH83E8UpFygTJsODK9ZWnsYy9Jy9rIPHUx9n6m5615Z30kKd8ZNEkc%2BVXDoZe7jwj3kNlk37JzoytVVTU1hbfq1PT7i8bAgTokS9U4KCGVus%2FpyCf%2B6ZuiiibTQsugmJgGfdzSwl1slqwLg%2BSHb4o7sMEQPtCGZDybTQz&X-Amz-Signature=dcf7847ce748f1644e6c49edc21a9e9f8f92790bea10453a4c8a7106a7d9ed78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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
