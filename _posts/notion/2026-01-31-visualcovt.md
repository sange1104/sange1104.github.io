---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [blog]
tags: [mllm, vision-language]
---


[bookmark](https://wakalsprojectpage.github.io/covt-website/)


## Abstract

- VLM의 한계를 극복하기 위한 Chain-of-visual-thought (COVT)라는 새로운 프레임워크를 제안함
- 문제점: 기존 VLM은 언어적 추론에는 뛰어나지만, **공간적 추론이나 기하학적 인식과 같이 밀도 높은** **시각적 지각이 필요한 작업에서는 어려움을 겪음**
    - 시각적 정보를 <u>제한적인 텍스트 토큰</u>으로만 처리하려 하기 때문임
- 해결책: VLM이 단순히 단어로만 추론하는 것이 아니라, **연속적인 시각 토큰**을 통해 **시각적으로 사고할 수 있게 하는 COVT 프레임워크**를 도입함
    - 이 시각 토큰들은 2D 외형, 3D 기하학, 공간 배치, 가장자리 구조 등 **풍부한 시각적 신호**를 압축하여담고 있음
    - 약 20개의 적은 토큰 예산으로 **가벼운 비전 전문가 모델의 지식을 distill**해서 학습함
    - 추론 시에는 이 **연속적인 시각 토큰 공간에서 직접 사고**하며, 필요에 따라 이를 시각화하여 모델이 무엇을 보고 있는지 **해석할** 수 있음
- 성과: qwen2.5-vl, llava와 같은 강력한 vlm에 covt를 적용했을 때, 10개 이상의 다양한 perception 벤치마크에서 성능이 향상됨

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=048f2e579b55557dd04c022455443067b9134c6109cbf1d697d71cf61cfb1446&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## Introduction

- VLM의 성공 - 시각적 입력을 **언어 중심의 토큰 공간**으로 projection함
    - llm이 가진 강력한 구성력과 논리적 추론 능력을 그대로 상속받아 **자연어를 통한 멀티모달 상호작용**이 가능해졌음
- 텍스트 기반 추론의 한계
    - 기존의 텍스트 기반 cot는 논리/수학 문제에서는 효과적이지만, 시각적 추론에서는 근본적인 한계가 있음
    - 연속적인 시각 정보를 discrete한 텍스트 토큰으로 변환하는 과정에서 <u>세밀한 지각 정보가 손실</u>되기 때문임 - boundaries, layout, depth, geometry …
        - 현재 VLM은 perception이 많은 counting 등의 task는 어려워함
    - 텍스트로만 시각적 관계를 설명하게 하면, 오히려 모델의 시각적 추론 성능이 저하되는 현상이 발생하기도 함
        - qwen3-vl-thinking < qwen3-vl-instruct

        ⇒ **시각적 정보는 내재적으로 연속적이고 고차원인데, 현재 모델들은 language token을 통해서 추론을 하기 때문에 복잡한 인지 추론 능력이 떨어짐** 

- 기존 해결책
    - **외부 비전 도구**를 사용하는 방식 - **계산 비용이 높고 도구의 성능에 결과가 제한된다**는 단점이 잇음
    - 또는 사고 과정에서 이미지를 생성하거나 cropping할 수 있음
        - 이것도 역시 이미지를 text space에 project하는 방법임
    - 본 연구는 이러한 한계를 극복하기 위해, ‘_**vlm이 모든 것을 단어로 번역하지 않고 인간처럼 시각적으로 사고할 수는 없을까?’**_라는 질문을 던짐

    → 외부 도구 없이 <u>모델 내부에서 시각적 신호를 직접 처리</u>하는 COVT를 제안함

- 동작 원리
    - **연속적 시각 토큰**을 도입하여 VLM이 **시각적 단서 - 2D 외형, 3D 기하학, 공간 배치 등 -를 직접 추론**에 활용하도록 함
    - 학습 과정에서 모델은 **가벼운 시각 전문가 모델들의 지식을 distill**해서, 추론 과정 중 이 **시각 토큰들을 예측하고 생성**하도록 훈련됨
    - 전문가 모델 통합
        - task-oriented experts
            - SAM(객체 분할), DepthAnything(깊이), PIDINet(윤곽선)
            - prompt level에서 정렬
        - representation-based expert
            - DINO(의미적 특징)
            - feature space에서 정렬됨
        - 이해, 생성, 추론, 효율적 추론의 4단계 점진적 학습을 통해 모델이 시각적 사고를 익히도록 함
    - 추론 과정
        - 추론 시 모델은 텍스트 / 시각 토큰이 섞인 covt를 형성함
            - 의미론적으로 일관되고 perceptually 근거가 있는 답변을 생성하게 됨
        - 모델 내부에서 이 과정이 처리되지만, 필요하다면 **생성된 시각토큰을 디코더에 넣어서 이미지로 (마스크, 깊이 맵 등) 변환**할 수 있음
        - 이를 통해 사용자는 모델이 무엇을 보고 어떻게 생각했는지 눈으로 직접 확인할 수 있음
- 다양한 벤치마크에서 뛰어난 성능을 보였음
    - cv-bench, depth 관련 task 등
    - 압축된 시각적 사고가 더 정밀하고 근거 있는 멀티모달 지능을 가능하게 함을 증명함
- contribution 요약
    1. **연속적 시각 토큰을 통한 추론 프레임워크 covt 제안**
    2. **효과적인 시각 토큰 정렬 전략 및 4단계 학습 파이프라인 제안**
    3. 다양한 벤치마크에서의 **성능 향상** 및 **모델의 해석 가능성** 입증

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=6b22857401ae730ef3c0b755b2f533c0469435486f6ebce3d5efd1e317f99d1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032117Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=b4c095487bc822856658409d59ab116b00f007a7adc94d7cd070ec0fc1e9a5d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

1. **Tool-augmented reasoning**
    - VLM이 외부의 전문 시각 도구를 호출하여 문제를 해결하는 방식
    - 모델이 스스로 해결하기 어려운 시각적 작업을 외부의 전문 모델에 위임하여 처리함
    - 한계점
        - 외부 모델 실행하는 계산 비용
        - 사용하는 외부 도구의 성능에 따라 최종 성능이 종속됨
2. **Text space reasoning**
    - llm에서 큰 성공을 거둔 cot를 시각적 모달리티로 확장하려는 시도들
    - 이미지 → **캡션**으로 변환하거나, **텍스트 논리**를 통해 이미지를 해석하려고 함
    - 한계점
        - 연속적인 시각 정보를 discrete한 텍스트로 변환하는 과정에서 본질적으로 정보 손실
        - visual cot : 이미지에 대한 텍스트 해석에 의존하여 추론이 텍스트 공간에 한정됨
        - MCoT: 보조 이미지를 생성하거나 편집하여 추론하지만, 계산 비용이 많이 들고 유연성이 부족함
        - VChain: 이미지/텍스트를 번갈아서 사용하지만, 여전히 이미지를 텍스트 공간으로 projection하여 시각 정보가 손실됨
    - covt는 연속적인 “시각 토큰”을 사용하여 3d 인식 / 밀도 높은 시각 정보를 직접 추론에 활용함
3. **Latent space reasoning**
    - 텍스트와 같은 명시적인 토큰 대신, **모델 내부의 잠재 표현**을 사용하여 추론하는 방식
    - 복잡한 다단계 작업 시, 연속적인 latent 임베딩이 명시적인 텍스트 cot보다 효율적일 수 있다는 점에서 착안
    - coconut & ccot: llm에서 추론 과정을 연속적인 토큰으로 압축하여 효율성을 높임
    - aurora: depth, detection 신호의 잠재 표현 (vq-vae latents)를 사용해서 시각적 추론을 강화함
    - mirage: 시각적 추론을 위해 latent imagination을 활용함
    - covt는 이러한 연구들을 확장하여, **tool-use의 개념을 잠재 공간에 직접 내재화**했음
        - perceptual experts와 <u>정렬된 시각적 사고 토큰을 모델 내부에서 생성</u>하며 마치 도구를 쓴 것처럼 정밀하게 사고함

## Method


### **3.1. Preamble**

- 기존 VLM의 한계점
    1. Text-only cot는 error를 누적함 → <u>**초기 단계에서 오류가 발생하면 뒤로 갈수록 오류가 누적되는 문제**</u>
        - 최종적으로 틀린 결과를 도출하게 됨
        - 오류가 퍼지기 전에 시각 정보를 정확하게 포착할 수 있는 **짧고 효율적인 추론 방식**이 필요함
    2. 텍스트 중심 학습 신호의 한계
        - <u>**모델을 학습할 때 정답 supervision이 주로 텍스트로만 주어지는 것에 대한 문제**</u>
        - 텍스트 형식의 정답만 맞추면 되기 때문에, 이미지 내의 edge, depth, region 같은 낮은 수준의 세밀한 시각적 단서를 깊게 파악할 동기가 부족함
        - vlm 자체가 이미지에서 **정밀한 시각 정보를 추출하는 능력**을 갖춰야 하며, 이 정보는 추후 vision decoder를 통해 시각화될 수 있어야 함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=28d8f3c9425ae3320557cd2331991e6d2795c96d790045c1332e06810cac7767&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665X6K7VE6%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032138Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDqzzxKFSs9YyxSD5Nv06zi8VoklUcHhnOivdF8WaTcJgIhANCc7urgMUuO3y1oCHnRg0sokSoh73JHUTO0Lf7FTpRwKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx3IovMmebiR%2Bqy5XYq3AN58CnvgXCyDYvtQSHmTjd9qBKbo31k8PdPYpXbse5uMB5SyO8BBhaIGkWpuKrznnkCX5JBVFbldFV5dEER%2FU1VoqqE0ATEsEBGZ8TltPORI62cXkS3Umyfh3XnBYepgl%2BCO6%2FKAaFOMtMrzxLt%2FzftiI3d1e3r8h8xonYdTE0Y0mjMqHUhL9OTlPPUmpiwBx0ynHs6ylWj1DY%2B4YlCikfOdb48K%2FR4xfY9jHVjZlScBgjC4h2ZoxTcKdgrblg1lIjTu91wy4vmyS5Vgvt9MfvkFN3qwJ%2Bmn1Cqul5CInPExnLdvSQh5O2xaVppxhPb9aof7lu9q8XIwrl6jfmF9FxxO8jBHJXx4x5ybm8h4qJDDo8nfGrHeegIa2BvyVZLHoqld3QC4L2QcW3fMCGmYjq%2BWUBABtfcv2wnyh5GBpqny46cdBL%2BSNAVgI1i6ji7S1ddyRMQh2x4xwetMTiQs8WO%2FS1LFSdW2svI1OEgvHeL5YOeBhJ0VP4GgAYzzP%2BLrEdz8FjAyTsL11%2B2DnS1G%2BLtEMFAn2%2FDiPSXHNGafbbiSPn8vxyWgA68IQ4SkeU%2BJ5mv%2BjBtThfHSTK2DCamitjYWz9cuehGVhOMuXVkfs5vpw9ZRaV%2F9K59JlYcqDCilLrMBjqkAdt41oPs6lmRlr3Pkw1AtfwXkyI%2FL%2Bo7f5oEDWdMiiGXwHXCFJboFJmZnLroX4ZIr9g5ABzJq5NSCHdE9lxQPmq%2FzE2VhfsFT8%2Bpmmdc5g%2BgPSRrd8nyMNKuAg7ce%2BQOC9Vj9dAMtxWK%2BZdO82u3Qzh0FSm52uEVlW5pjfAWAHAoAOhmOOmxcotcqBT9rqPYcW4WYVKXArU%2Bp4iA%2BJl%2F6ZxtOH5t&X-Amz-Signature=c63fd19cfbcdfe7c8a1606a871f2a425aaf5e40397ddeed135bc1ce1fadd638d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 예측해야 할 토큰 y_i의 범위가 텍스트 뿐만 아니라 시각 토큰까지 포함하도록 확장
    - 답변을 생성하기 전에 <think> 태그를 열고, 그 안에서 시각적 사고를 수행함
        - 여기서 ‘이미지의 깊이 정보는…’이라고 생각하며 텍스트 대신 **압축된 시각 토큰**을 생성함
- **vision experts를 통한 knowledge distillation**
    - vlm이 생성한 시각 토큰이 **실제로 유의미한 시각 정보를 담으려면** supervision이 필요함
    - 이를 위해 4가지 가벼운 vision expert의 지식을 distill하여 학습함
        1. <u>**segmentation tokens - 객체 분할**</u>
            - SAM (segment anything model)
            - VLM이 생성한 8개의 토큰을 SAM 디코더에 넣으면 마스크 이미지가 복원되도록 학습함
        2. <u>**depth tokens - 깊이 인식**</u>
            - 픽셀 수준의 깊이 정보 (3d 공간 관계) 파악
            - DepthAnything v2
            - vlm이 생성한 4개의 토큰을 사용하여 depth map을 재구성하도록 학습함
        3. <u>**edge tokens - 구조 인식**</u>
            - 객체의 경계선 및 기하학적 구조 파악
            - PIDINet
            - 4개의 토큰을 사용해서 edge map을 그려내도록 학습
        4. <u>**DINO tokens - 의미 인식 (semantic)**</u>
            - 이미지의 의미론적 특징 파악
            - DINO v2
            - 생성된 4개의 토큰이 DINOv2가 추출한 패치 특징과 일치하도록 학습
- **추론과 시각화**
    - latent space 추론
        - 실제 사용 시에는 매번 이미지를 생성 x
        - 연속적인 시각 토큰 상태에서 바로 사고를 진행함
        - 이를 통해 계산 비용을 줄임
    - 해석 가능성
        - 필요하다면, 생성된 시각 토큰을 디코더에 통과시켜 사람이 볼 수 있는 이미지로 변환하여 보여줄 수 있음

### **3.3. CoVT tokens**

- **Token selection based on core perception ability**
    - <u>**token selection**</u>: covt 프레임워크가 어떤 종류의 시각적 능력을 학습할 것인가?
    - vlm의 핵심적인 지각 능력을 4가지로 분류하고, 각 능력에 맞는 전문가 모델을 선정해서 시각 토큰을 학습시킴
    1. **instance recognition**
        - 객체의 위치와 모양 파악
        - <u>**SAM**</u> → segmentation tokens
    2. **2d and 3d spatial relationship**
        - 픽셀 수준의 깊이 정보 파악
        - <u>**depthAnything v2**</u> → depth tokens
    3. **structure detection**
        - geometry-level details
        - 객체의 구조적 단서 및 경계선 감지
        - <u>**PIDINet**</u> → edge tokens
    4. **deep mining of semantic information**
        - 이미지의 의미론적 패치 표현 학습
        - <u>**DINO v2**</u> → DINO tokens
- **Tokens alignment based on granularity of visual models**
    - token alignment: vision experts와 어떻게 연결할 것인가?
    - 모든 vision 모델이 동일한 방식으로 작동하지 않기 때문에, 모델의 성격에 따라 2가지 다른 정렬 방식을 사용함
        - <u>**fine-grained task-oriented**</u>: SAM, DepthAnything, PIDINet
            - vlm이 생성한 시각 토큰을 프롬프트 공간으로 project해서 전문가 모델의 decoder와 정렬함
        - <u>**representation-based**</u>: DINO v2
            - 덜 세밀하지만 전반적인 특징을 담고 있음
            - feature space에서 전문가 모델의 encoder 출력값과 직접 정렬함

    ### (1) Segmentation tokens

    - 8개의 토큰 사용 → linear layer → cross attention → T_sam
        - T_sam은 SAM 디코더가 이해할 수 있는 프롬프트 형태
            - sam 디코더의 마스크 프롬프트 역할을 함
        - 입력: 8개의 T_sam, 이미지를 sam encoder에 넣은 이미지 임베딩
        - 출력: 8개의 예측 마스크 생성

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XA7LIIBT%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032148Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIEQMdOGPw4CiaB7zIWNZ9Xjx4L3gfkZmfhopARtw2u5NAiEA%2B8HLqsK%2FMaIwjPwNaWREIVEGxxVsMrbITqrMZkZYsaAqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFRMIi5ADqb5zC0A2ircAwR%2BFouF1pYVBzPxldds3SMy4juqXHWXpXY2IzQr7juxmnhCLa9Igcj2EzgFgMiZaG61hSi%2FhZD9fOtjDScsRBrhWeEhut251LSJj3aTgDWUH5eroqAh30NBH%2BCIepBN5qDG22lB%2ByLQ3h3MfgHuWngp%2FqC6nL3ItqjeNwVE274GZOLJFDJuDpJFVT8ASKwuLX3Z%2FRQfPq4djdinukT8nFZd5t5sOTvckq%2Bo50D03Jf3MFVklo9XDy7ppEnP1tJ6pzPtU%2F27IJztOvFo8Zy4rxQrblDY39VonCqD%2BRqCkW8sgL3K3oNz2xvuDSZIokTfZ9qx6ORH%2FMxYibDSwDzrmFhBBVqhRMq8kCIlufi3dST7%2F%2B%2FYcY644hRlEQ8NtoU3OVgfW2SqVTD9nEpWR8YJ6KLiXWdOdsYmKdd7MAediz2IcifSnBG3z%2BGyEiQuD3h4gQsq0heBPGxN92lLQ8TQJjBuB6ZZrbO72E1o2QfNCFgHtU1jWKHCPzs8wJfpS8A6x6jPSTEsHEoERy3QSLplHPGmRXR%2BMk7WZSLFmKM0EnL8NQAkAE0oeCxMCOA1AbJHYgyBQRZwvgD7ah123bO5jRU9CAY2VJtOTqCuy0WgjO8uL72h0ZuCUT6KxoV1MICTuswGOqUBKTbGJTVPooONgEi%2B1HLp8SKqstDqoI2Nfr8tT0nZEOstQVqfyOY6JAf68yBTN2rZSDptKA8wjjKZPLfTwRzfDaVFXlcFtQI9UuRus41J0%2Bf9sS5Ri%2FjieDjWcGJ6YFiVmv%2Fr5E%2FxsJgUL7Q0TXblK6Lfg3Cd0hUZcuMix9wHoFBKKNigGQgqVuocSCZr1CzxgODQTrafbLkgzy4PvNkY88I1zShr&X-Amz-Signature=1ad401e52bb4e438015288ce9c29e3295b52c3844b95c08bb18c805c8e7f633f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 예측한 마스크와 gt 마스크를 매칭 - dice loss, focal loss
        - gt 마스크: 풀로 sam을 돌려서 여러개의 마스크를 얻은 다음, 품질 높은 8개를 gt로 선정
        - 8개의 pair가 순서가 다를 수 있기 때문에 헝가리안 매칭 알고리즘을 사용
            - 8개의 예측값과 8개의 정답 사이의 모든 조합에 대해 비용을 계산
            - 전체 비용이 가장 적게 드는 최적의 1:1 짝꿍(Pair)을 찾아줌
            - ex. "예측 1번은 정답 3번이랑 짝, 예측 2번은 정답 5번이랑 짝..." 이런 식으로 매칭을 확정
    - loss function
        - **dice loss**: 마스크의 겹치는 영역 (iou)를 최소화
        - **focal loss**: 픽셀 단위의 분류 오차를 최소

    ### (2) Depth tokens

    - 4개의 토큰 → 4개의 프롬프트로 작동
    - depthanything 인코더에서 추출한 dense 피처와 batch matrix multiplication을 통해 depth map D를 재구성함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662MSPEOJT%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032150Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDy2Cm7yuKnIKftMD2IWRGXX9b3lLSzXhrxQS5co%2Bi1XAIhAKSnXE7MSpZEKXTts6GcNOfZO7T0JmKMnpVg8ctz609QKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx2%2F1k9hpXYeHjA%2FXoq3AP1nzm5wFaOht3nfZNLRWdRqCex3a7sEjIdNOaB4zcsYnfXP8F2bSO8US6btu%2Bq%2F0ogV8fdkyqe79RwNxrCX1UeFBiO1BO0M2%2B%2BBVWoH4u2iqYC11yCLsublApAG3UqLi7MJBz%2BsutRd3Xmft4F%2BTLF63QPpbLnT88jUz%2BfXwDlnQNXXx6RVQbNZP8VbSGTQ%2BMr86EjxgWOhf1XxEnSiWMwWp6x6XJxh2l27on%2FRg6%2FkwYTJIJS775d782StyhhwnMaHeZZzY7PXUFaE9B4Rokhajb2HhxHpdgPl%2Ft2fHiJV4zHwcspb%2B6BwSnjckgSwte%2BOF5Mn0T95kledNTUKYj30d%2BdmN7Z%2BQ88%2FMK8nhECEz3gqPmgw%2F%2BFdbirYqeWJR86VblwkDqda3d4ULDqIxw5iqwu8dm9LedgPnMfNNoTihCb%2BSlPyj4L6B98LfNMjpbXCMbdlBft0v%2BpaFAVDcNwefnRqFqt0GwMyQzr91eAQlhfjIZFpbecTMgWUtlw9v%2Bgd%2Fpp25kA%2ByGCxa5v4bDfpwQ9B5sCrkfFYeIPrluA44tSIz3iC9nN8ybHHJJoOu3IqG4gshkTuKgzOjpoQDBhcGChQxoTp276J1pKIlJNctQQGV%2BnLjIciSNFzjDyk7rMBjqkAWEALnyKj6oZPjmyMXvI88IvMtfxTOW9EGI%2Fnh7pMLDPm0O%2BpoA1qKHAxRzY%2Bia3bwVdeHBN0pWSjxGBEVYOBxeJoryLYOwt3XJ%2F2aLV7SJiy7ETsP9wgqmzzkgkdZ3JBRMDQNffghd7JyTuT51iOUSN5sX8zN%2BrmVEFVekBP5%2BV%2BmAbBDy%2FCTHa3on9u%2BlcpEBpWConk9htgVNlhkarocbgFJVH&X-Amz-Signature=24deee40fbd2027ac8f2ce867cfb87a679110ab0145ac12e604523aa7cbdbbab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SGZSGJLG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032151Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJGMEQCIEDpMr0scA3b9EsWr39TDkRHv1zpNAZyzbi6OZ0OLRjwAiAGWxHPMYY0uW0SVvPXM%2FFocBlpKLlZkNUJ6ugvn6QCGiqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMIAEsh%2BVI1znw8kZDKtwDWl7J3oGtYCb8NrmgOsHnfjXkJmOgrd%2BrR4H1SblyMyKm%2FIlzAekP7A6fhgj6jl3nbZXOk%2B4oTUqXdQZMDcqbKCGp%2BgK%2Be5yfasRcsgu16D8VYKtLS%2FnZKjzUAgWQrMt4TXAeOsq58qjNY56bv92%2Fi45uEvZS3KKpzTzuFvrN8YoRTcOYTaH7RAOzAnfYwBAMH46rGR%2BIOy8MGTBNBmfP4lpM9o5Ug4jtfnl0o7YlxOhkgjUxpn01kdfZmdeU2srVCdoEX22NMY9DZLKFg4dfpZDc3ghx6BodOXTHwcKJHA%2F8pBXgaZePNYT6Si2z62GZse8JCQ2NEjCgLb9JT85nQCoAwdqOEpZ2hSNXOH0rok5eJrN%2B8IMaAHktvB%2FWDrt1JAm645MSK%2FkQgMYzefLp6KWUt5%2BCI0GLcWYOlhI0k05X1kFtp0hO0jJfrVaenl0Pgubo7ynXfPAOCy8tSUqPGE4S59RP7gJiYoqznhNsm6L34XTmmFJY5CwwFXb4npJvgKleFESB9BEhmPdP0qE3Y%2BYUXJXM7bDqt1vqOB7nKKpkHP9YkEZ3j2hxlOklRpkWamSMmiML%2FDW86lPibxDDzrfS454XKqY4vI8bWxuVRw4kK0TPSADyZhjP9YQwgJS6zAY6pgGzTwb2ut2oM2A3lj4I7gyX1SsVt9YDUqnrOjpCdkX%2Bz%2FiavnsSHI0KuPNAnw%2BerrKac0vRvtHhm5l0%2BUMFyTYpQAl0sXczSsekSH0GRP%2BKlHmAqKx7GnjrAE0NWarlGG26q6gIGOMd6pze0S70BvSpwlW4nZF3%2BPoD6fXpQs9ZmCQzRxtTw91XwkZhIyhIw9%2BBDe84jb0urXoFW81vkEF67ovGmRQh&X-Amz-Signature=68b370517e81643d35762d27451deb283a930278109683fa1b784365da186eb8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - **L1 reconstruction loss**를 통해서 최적화

    ### (3) Edge tokens

    - 생성된 4개의 토큰은 각각 PIDINet의 특징 맵에 적용되는 1x1 convolutional kernel로 활용됨
    - 토큰 자체가 필터 역할을 해서 edge map을 그려냄
    - 마찬가지로 4개의 edge map 평균을 예측 edge map으로 사용
    - 마찬가지로 **L1 reconstruction loss**를 통해서 최적화

    ### (4) DINO tokens

    - 4개의 토큰을 DINOv2가 추출한 patch level feature와 모양이 같아지도록 projection함
    - **mse loss**를 통해서 dino feature과 직접 같아지도록 학습함

### **3.4. CoVT Training**


**training loss**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032119Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=82275346c156aa04ae9431b47459e6c115c78dc8a076f63693171d4eb5af007f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- ce loss: vlm이 텍스트를 올바르게 생성했는지 측정하는 기본 손실
- γ,λ : visual loss에 대한 하이퍼파라미터, 실험에서는 모두 1로 설정함

→ text도 잘 생성하고, visual token도 잘 생성하게 됨


**training data**

- 시각 토큰을 점진적으로 익히도록 4단계 커리큘럼을 도입함
- 갑자기 어려운 task을 시키면 기존 언어 능력을 까먹거나 학습이 불안정해지는 것을 방지하기 위함임
1. **이해 - comprehension stage**
    - 모델에게 시각 토큰의 기본적인 의미를 가르침
    - <image> 태그 바로 뒤에 시각 토큰을 삽입하여, 모델이 이미지 입력과 시각 토큰을 연관짓도록 함
    - 입력에 정답 gt visual 토큰을 넣어서 visual token에 대해 이해하도록
2. **생성 - generation stage**
    - 모델이 시각 토큰을 “정확하게 생성”하도록 학습
    - 질문과 답변을 수정해서 모델이 명시적으로 시각 토큰을 출력하도록 유도함
    - 질문-"이미지의 깊이 맵은 무엇인가?", 답변-`<depth tokens>`
3. **추론 - reasoning stage**
    - 시각 토큰을 사용해서 복잡한 문제를 풀도록 함
    - <think> 안에서 시각 토큰을 생성하고, 이를 근거로 최종 <answer>를 출력하는 전체 사고과정을 학습함
4. **효율적 추론 - efficient reasoning stage**
    - 모델이 고정된 패턴에 얽매이지 않고 유연하게 사고하도록 함
    - <u>시각 토큰의 일부 유형을 무작위로 제거하여 학습함</u>
    - ex. 어떨 때는 깊이 token 없이 seg token으로만 추론하도록..
    - 주어진 정보만으로 효율적으로 답을 찾는 법을 학습함
- 데이터셋
    - vision-centric data: llava-onevision 데이터셋 중 시각 중심 서브셋
    - spatial perception data: 공간 지각 능력을 키우기 위한 tallyqa (숫자 세기), ade20k-depth (깊이 인식)

## Experiments


**Experiment Details**

- 메인 베이스라인: qwen2.5-vl-7b
    - lora 사용 adaptation
    - rank 16, alpha 32
- learning rate: lora 5e-5, projection modeul 1e-5
- 학습 step
    - 1단계 (Comprehension): 4,000 steps
    - 2단계 (Generation): 3,000 steps
    - 3단계 (Reasoning): 3,000 steps
    - 4단계 (Efficient Reasoning): 5,000 steps
- a100 1장 or a6000 4장
- 배치 크기 4

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=d41bcd3df7e3dd51564a3131c09071f65e39e4082eb79297a98381a7e3eadf9b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


**Model Evaluation**

- 모든 평가는 VLMEvalKit를 통해서 평가되었음
    - VLMEvalKit: 오픈소스 평가 툴킷
- vision-centric benchmark
    - main 평가를 CV-Bench로 하였음
    - 하위 항목 중 count, depth, distance task를 중점적으로 보았음
    - **BLINK, RealWorldQA, MME-RealWorld:** 현실 세계의 복잡한 이미지 이해 능력 평가
    - **MMStar:** 이 벤치마크에서는 '대략적 인식(Coarse)', '세밀한 인식(Fine-grained)', '인스턴스 추론'과 같은 서브셋만 골라서 평가함
- non-vision-centric benchmark
    - 시각 능력만 키우다가 기존의 일반적인 언어 능력이나 지식을 까먹지 않았는지 확인
        - ocrbench, mme, wemath, hallusionBench 등

**Quantitative Results**

- 베이스라인 모델과의 비교
    - covt를 적용하니까 일관되게 성능이 높아짐
    - cvbench의 경우 5.5% 성능 향상
    - subtask의 경우 depth task에서는 무려 14% 성능이 향상됨
- 토큰 수가 많아질 수록 성능이 올라감
    - 1가지 token: seg
    - 3가지 token: seg + depth + dino
    - 4가지 token: seg + depth + dino + edge
        - 특히 depth, distnace 추론 능력이 극대화 됨
        - 각 토큰들이 서로 겹치는 정보를 주는게 아니라 상호 보완적인 정보를 제공하여 시너지를 냄
- 다른 베이스라인에도 적용해서 결과 봄- llava-v1.5-13b

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YGQPLURK%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032200Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJHMEUCIQC4nPzr8XE35b%2F1FUDa6hgyX8Uo8ySPWiV4bwJ9YOCP2wIgHjxMQz6bYQNfvjDVDbV3HjRKX3w96LHZAsy6ccR7QEIqiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGBM8TXgdPI6PPeS5SrcA1RLs9Y7nBlCzLKnmRYj9ln5aZWyp2LqZXSu20lxS5TQnckIMVKkAxcLY%2BT8bHZJNHi1MjXy8WeOjK41ZzNQpu59sCDNv4ED%2BWvvcG9hAjwsPac5uufybfZ7MKtWr8kWSMP8RWr0tjElwh2pVVJ9PVzRubDpASf0nPR6nV1pHY4HMcEmLowDAGwyYsDu%2FMv3FBkwqhNvUdC4fA6KMCUHH3dAZG4gS5QvS84iMrUZ5sv7shJ7c7ywnWGDU2sMeLuNZcMAuS4r688651QJNvbAzFglYFSGljM3JENn5GdNjGH8s7VPmZLyqqSm3Ri79A8kREJOu84fjs%2FwCtWZEDdXX5%2B5bKYJvYfoA8fN5fPj27tvFEw7yToXmrKnY5wr8hGVBM%2BXbjjNMm4eRRrHMxIPl8w%2F1u4ixPcgM%2FnF6FYtKYrBzorzqS5bsUnP%2Bvnlu6uZtYgCoHfZn%2FIYYk1y%2BU5FHTDiKL9U3ky7yis%2FtGrvmGnkOCC7UVteHnqRZU3gkg2qvtBNl%2F5O%2FvljIH%2F2G0A5ZnyT9VIcBCaWJFm%2BG7wngmURjnMVB97y%2B2rMTUC37G6ONoHcIJD58J1umhaZSsa%2FvfhwibW1WJQFYAPEkddao4UBRDejnf0FvoX8Y20TML2TuswGOqUBeoTNTfY8zLWm%2BGYqLr65FjUQ7m3l6XoDgr1ZOScVkyd%2Bexi1vedf2ZzazivXGax6buxeBwhz7cFa0QnN2XwNr%2BEsc38ANEqxVQxfyLhWRCOvB8ARxetvnW0i28rzvoS9025i%2B15mu8LLQg9aLoRzZaIWsOHeWyFRrCwYNT3BJCE4yHuSFm4kgXXut9mOeh9kj6s7DgBuyUZnAq7DNoPPTW1qG2d1&X-Amz-Signature=339f6852e26c138470ca0369f858bc25bbac4740a11df2d1af0231971684cea9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=5d551204cbbd097d5f9c6f4033c53391f4fa96d488aec9c21d0ec9687c986cd5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SXVMRKT4%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032200Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJHMEUCIQD3QXOAxcD%2B%2B0%2FZo23Iz8k%2BUCVbgQJs2iOh9Jwe4cGwVQIgWlx2uTNCOHsYhfA8%2FL%2BbvFp3YGLR%2Bq7n8XSiluJ6DL4qiAQI4%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGe5oKtvH%2FIaOvExpCrcAyz6rjcRngN3YY6t%2Fq8PhPuKKD9dYSTtPNb%2BPw%2F8rAozIiyCPWl%2Fej4P6vkmxSsEyca%2BSkRIdFHu8mznwJNTCAkVKnnvBgP%2FLs%2BAyt6U3eXyPXLojdHAA%2FR2L7D8GYh7W%2BNvrEc5QnqxW7jm99gIaas%2BvWKAQ50xBV%2FT2y3KLrU%2BMYq61bg5rQME8VqWiceRv63ZOruvqFlLjio8nEqaNRX2lHJyGS6rdmY48LZKV3bJfA%2FHXmTEWft62EAts6MN%2B2ddzGQ%2Bxnw0eIlAU6HJB%2BUnGniirJU7O%2BhVy4Cx4niaH0kE%2FQl4rD%2BfrKDvFBB4P5iWDfXE4nkHknUGQ5y2wJgv5AtlDlLuGJHK3s7jjluMuxF14QQRWCArto5y7C%2BjqwyovIPYlzdCrxxWM26kwaSoX4ki8BahTuLDETiKM1iFqC%2FhW0ze6WgTdf%2F2JnFR90XxsXDZt0Q3WAqlALqnCNSmhADjNOqN%2B4xHl9hTIAtKkq4RbwiJa%2B8Y0QwKP5mcwamRg%2BOJmIQ3Rr%2BGq6ZhUjqbi5MKFoVVXGRv6HhJgtYqD6ZZSEDTSFJAEkSVVk8UjayDrGMg8DugE3S30B2nwjLHQF4sxp5wN7NFGdLNKK5MrZEV%2FRBlHLa4WRibMICUuswGOqUBXVRT%2BowJ9iibdAZ98GwtS9f4Jhd5t05Wrr4NAj9I6deFZs9m3O3HBcW8zkLmpViMnv3FCvOZ9dmS1VoqjYqHBqdg65EVX5EtSRNriWQnRA4Gjw3DTm2Bpu9z%2BMD1ZSPLi9XRsg%2BbniGCdpvQKHh2TmyHK2JTv9MZ3F03l4Ugg5RckNLkiWKwoCSvYNYfSG36%2Bei7s0yfu4N1J6UHrIZ8YNn0%2FL0m&X-Amz-Signature=43939b9ce3629a45312cba3ccacbe78f9959bbdd514f0d6a3bb44a8d8fadd867&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665LZGP5SC%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032201Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaCXVzLXdlc3QtMiJIMEYCIQDS0pzZQew73vh6%2FKt1NzAjhyiiGUTgmELphsMT1qynyQIhAPeSZ8y0gvpf4yb9AJ9Ws1kiwWgmiBduhadjm%2F%2B1MGeLKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwM8vnB9ASB4svS6SIq3APLDLEk1N%2FWsIJMkk3m388Gh0ItuOl03CfQ1H%2BwDfL3w1I5eFXgjxAQF6bJumgSXB6YqqHGibz5ryMOOnN1yErcefzCAg4ox%2FHPqw1A6Pk9Rypcks1slVpOC6AaAIGvvmS728EnzKu60jdQeC14f6vrD9tBgGmsCzfpyOkEg5C6mtOT7rVJSbaTc7nzeecABwTLi0a7iasCYKfYWdjruWPwAkhg%2Fn6nRAyksinS01d5O0Adxxn3%2B6oUX6QrIfXuwN6IeVS15tca4lL6owU9rSi1zFAEODsaUxe6o5ds0bx7xsNoO08oTUpG722COO1yGSl2tAZKGNwhNQzv6O1yONodfAC7TZM2KmtdYOr%2FtFtRBgtdhbAFehuCBiCo%2BkRgsSYIISGA6AB3nKFUCTH2jn66hhevfjRGiLnF6jSGFC65u9%2B2uNZbnp8PRrUe3sjgDAzTcI%2F25g5vqXe9eQSYteOniFDNwrZp6IVwfyxBqwG%2FoNfHHNA%2BQSq8%2BfkUitmGb4sslIjtZcp4XD6KzwqZvPwNtwXooTXS0injbii3%2FzbRYmOCHlKhZN4ZP5Lqw5eWk4%2BF70Cr4tWtrQeAe5LaImxSaDOAJcrGKGlz9NCVpv%2F7Rui32YDrTC7j0MQC4zClk7rMBjqkAat%2FhxhQN5My1eMNK%2FISjU02P7EX2IQ26%2B565%2FF93hCdh0B0dywlKdP1oCactlzfMH7x0eC5BAZE2qlctDrGVAwHGyv4UWo6GB1prqvKw%2BtQ0fg1ZXHdROqkN9FENJeAlFFuN1K4IfIiRzDXm92kCyi2Hc87c%2B1WaULFBO9Q9IcPxEXGs2Sg4A7Oj7lyNUwn6OzvvflQ7XaliesDyd3oT1R2h0Rr&X-Amz-Signature=8af4d688adda0a7d56f5841281c52463d46685d4d71f53181b93781881068b96&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665EOTEEUB%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032201Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJGMEQCIBrCsgR5dQsQ0FYki6Y0nY4QIQbq3h7wRUqSYt9qXWLIAiAZzeo9S3U2X7JTBny3MtejZVF7P7hWvS2ArTRNPcmmlCqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3LYcbAQFFAmF9oVNKtwDFFBXL6RpalV4xyo90uMdtT8mVqRSTPh6wj4rkccoqxe7qaA0ibcGG8ZVhZZPaZ8KFfUJ0%2BkBxqGo1QxZuhaFHia5xiPNKosxidB6f%2BOakBGzQeSKrmPi%2FykLLB5QpkHOy%2Bh4LYPUD8hogbHcaoOtGAUD%2BrBhFl3N4o7bMdNckEH5rBvc0UvM%2Ff8Y4Gv15vxEL1eBB4vjlank9qEnHEmejzrmcJC0FujcksusrrJndAl8rb6BP%2BJBQEyzpQXbAM7fvkZN9Ub9XGnI6fXnBu2Fep7Pbq%2FUJ2g2wO3JrQgBTuHnESScbldu%2BAXpdssBIm5URnp%2FOTtKXXUg1Criuzf5fyCLGWZXx5uE2pudTyT4DqFDkPKkzAnPDvP5zkhzletTk5jf4PlsWokKq1dKTYnIdkxXR7H8CMA8VXSgf%2FgljjQD2HBCB3k2B7tL1S2sdMeqTczcfU4Nk5GaWmtFAe40UDvQYpCW8%2BCN%2F5s0u449uZ2DzgTqBrH0V6gQmeesj1D4bcUrzaF2zmsCxZuLGJQxBFRfZ3SXn19P2On%2BWQNioWuMfCw3yDi2ehhXG3GXi7DlHK0RAMp68ax9PjbLGTfqSoOxgu1MCBSEe87%2FtWQiYssxr2gZyKdEjTmBHRYwgpS6zAY6pgG0ocSlx1ssD%2F%2FgJrlO4qDkqoBlg2I%2Fi3CFQKbAWEEQZ3BljphB3xTpQUlR5XD4KLWxMFrOoaPBzf2oNN2LFhKPnzhYaIeLhlRq1wlkDMzWDcbPI6FnOKo8t2YccgY%2FfKmptvS1kcPvwcDOw3mNDR28MbEsBHLQsbHZTSFETnOeYA0PpL5U9mOvnKdUwhbgoZOsOw0%2Bw%2BdzkJskUTPVVXZjVePJUegq&X-Amz-Signature=68b7ae4056921a6df37d47dc8fc2691ee8cc4fcfdaa5c540737d6bfdfe6d2cf4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ASCMGWY%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032201Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJGMEQCICp9AAilLnnRPs6bJ9lozTmKbw9n9jcrx%2F21xWusdOS8AiBeJd9CtlYMle%2FbS9WkHIe7BV6zBQ93P3qbZmaMGMrT8iqIBAjj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM1UFqQFo6cz9nXWq%2FKtwDVgVJzsXfYpQlkGtxChXfKryuypsNYY77DBSFPyWWA7Qp6N0mo0gFWZ3dmsnHmIXYMChZ3hurG6fq4BvJZAEsF6yicM8%2FIJ9NWO9iq1JxSDG4KqWgTJvp9PEqOkiba3P87lm4WxWlVApwPbRYe6d%2FotaaaZ4FF4E8ASlNB2QvDivo19Cew%2By3cqMUc3NMxJupBF8t8YXqZmu3pBkw0JXzAhqguoceQCnDkXT6QstMynaNVDRZlsrZO1sxYPKM1zRg5EeBLBlOeT0vwgeOazb0whBEaGMgc49hDCNuujn4jigKAjGu1oRuDeR3Su85rSalXkpMMclUqTD7H%2BmNvc6qqioTA%2BsYgW01Xp8jMFhzHSDKvJgpoHRwgznLbcgDG1YXYl2uXoUReSJHfkjDrTu1o4x7jY4cWc4ZYGcV9h7wo5IqApAVy8iotgYnPTSLIge229kcY03D8SoiPwvWqeVpJtZH2v57GB699f3kyATiIfqbv5VhqFNS46Z8k6DMCA7elbFu8b08VLj%2BpsM5d3aoaP1Kdlzv%2FLerfqQgwdjbygDiLHbVmPeQVgv8FBhGdd6baNND9OWStf94REHQ3Q2Yb5f90zR6oISd7zVZPvsym%2Bv8O2pnjGIWbA9z0CIwsZS6zAY6pgF%2FpEWwXeqxIVTO%2BqQksBDeL6sE%2F5abxGpitrxEExpq7Qch%2B2OWA97OPdN%2FhfIZTNdjIcFvQrjSi1Tr0BhN4L11ehQI54JLGAgaTXbHehH6TzyNHagSMcOPXlCZhgGPdpsFTow%2F2IfyDpCYpoupvJFk%2FlGhVWBPhJv2BQ%2FSogVau7Is2CLTpG6rxBJrizubZ%2BQfDCcYsChG%2FAD%2BXzuW6srTZpyy91an&X-Amz-Signature=396c0e55c86db62c1f0df3cce02de06ac8caeff499cf8bfea57199740b86a964&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=2543be91cd301c0b12098c946069707aeda9c24a2c52576bfcfd10787778e907&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XGG6UDCG%2F20260213%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260213T032120Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJIMEYCIQDA387XMNQP7UN1D83Xt5tO%2BWQ4errGazd3PVV2q%2FSe2AIhALHupiAELy%2FwhcoOT7iIzDp3HCNrubkEDeZgHLlbDGIkKogECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz3%2FfD4Uy4U4dsbVMsq3APWbnSbD4RPay%2BXjXHIB64bFNnzgTTnnRnOYXOWNxMsBjGEUVW22H7Ialixxi8khATBQapgPwU%2B7Vp4Yp8HBHMb3Lc0RMJLbxiWAdEI%2FeNiSFPuA%2BzCmx6oSg3l%2FaAI5O1YmPWlvW1WlSf2W%2FngZ7eE2n4Hci3v3upFhX39ML0x9uC52SyDAh7tkmVgrccv24OvRjmCOFeS2DY18WPDBK6%2Bvx4xwTeeBHwRxLz9yyjFH6DehGyz2WlOBmHU5RTT2%2FKHVjW0C5GlZijfiuHcXpOaki4jDH5N6bZoNGN%2F2sDVJyK8RRa9omZCXpa6VkFvVVA%2BcvRUs8U%2FrQAGvg231DrySlGap03YTNJ4JRqPoc24v%2BA5rvCUsoKagyYbLxfO8Epm%2BZ1KUzL4M5FhhMyVJG7dYIyJkpaQ62R6Ys1qTA9xBEjVfFbygCT06sWK61HL6uuSE%2FPBuZRqMJKNwyEh6%2FjkK2eWRYxY2QdwvEwMUTck0co0l6Zu%2FspczrFHZS7HR5LbwkCSmhdLYRRLZG4YlJHuVAcjQ%2B5yb6lHlDeAisXT4Fbo6G1DaThnlGCk9CqR2SWd7JXHoHa6AZeEmgbosGtwqkWiHCtppibKcX4%2FnANilq%2Bw2oCTBM58GE8sSTDck7rMBjqkAZtF2XCJq8S%2Fz2CdB%2F%2BkQFTZYPri8kjOLieLCevBi8ZBe6JpObco5POCnFf84ORl4sFADLY1ec0wDH8YoxwhHdtl9Ch1eVTRIW02eUy%2BWuUyz234xzfumNIQpW%2FviNJeHcxizBb1l8zG4OVgwveJYiPIYA2v96zJYbOpFu7ubB7nYzjwxuwjCJCL9e%2BUuPfp17bbTNvwe9klWHRqmWx7uhfC%2BV4o&X-Amz-Signature=b0da74d9d58059a9c04dce51cf306b676af725409311be1a9c37031869dd3408&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

