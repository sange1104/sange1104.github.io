---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [paper-review]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=bc0579dffec28912d2c65a1ba06e927fd6a5e39826d603adc1d366353dea43e2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=e79e3f36aa46836386614c2197f76b343d8fd36c76cdec6d210e0e3b9afe2b40&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=43ffa78f80764231c1e00aa9a58dc0fcb8feb275911fcfe5e07becd06e4cdcde&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=28ee5d2f37517b246019a767d0edd9060b96bf6e79f91ca10670e4e14ec6686c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZRMQNSLB%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025225Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHkuPUfvx48IS5%2FmWY0VAVIOudiZ0Kh7dBzQY4TOY2BvAiA7tweJwz2xt0zJc4hjBZQgYVbvBC1dZ6u2Oc8DG6NLgyqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM%2Fja%2F1swUWFVpFplCKtwDXVa1dKpLNeCllfa%2Fqii%2Bi2P2QvCKth5VypCTgF%2BMva%2BGLsSteOEOIW0sXFyquV3JaoOBKfIT6eAWXe6jOZs3AASR6u%2BCzxDOb7uYz4jXaDEEvs028FwHx2LTVhsQqEGNfKHSidg1uCdQqs%2BsHziY%2BpQGopcSiVSN1I%2BJ9Jjrjl7vLAExrCvkcN0fJdPzZgIeHat2YW530cdMhsub5XMu4m9p9dGAbPC6odIJ4Kda0dT8UgDaM2Mjp%2FzukpKD337IxVGYY3G39CdxBREuAEcFboTOYnMEQ1j78KObTN5RgOMokvWw6uR0OjHqlGoiSIkZpwuDZAQjvbZvY1oiMpmd0KI%2FsRmWBpjWDgwmqznz3%2BjXWuM5rPY8qMvzqBjLMDIybvLgeZYpGKGpsM0rhbDJHi1JOJFrDMZxFZ8rESs3TN2F9SSa%2FDLuqeETacS2DYVUYofNfDd%2F3KcVuVSjU%2F4va8pkt4jtKH8UBNic22fQ2tfEVYk30r4975EopQDI6L1JkCO1g6cuWPcHZZUDQ7%2BB%2FUHdKLhwkNKmu2g6D3lXmc1acMxYFjIBfgmiWn2MDXrRmRWvJfmnP8aLIC%2FuPYkGrf1Fo5njQSZ4KA1S850dBEhqDUceL8qoFG341Vkw9YHTzQY6pgF0CB5%2Bm2v32gmKHcN4pbhnYF2coBLuJhUfxTuXu%2Bz4jKGyWjJ%2FZrUPD2X8XHkPTfrV97XgCQYzColCoajMQJD4PjV8wlEmswb8gcYDASBN%2BWVG%2BADbFYrfXVTJ0qHDnm1%2FuZmKFXGPO%2FPdIn8EwbiWaezfOy2eMDaTXLCPAK218o3LJVKHfjIOmXGDHb6%2FqWgQFUHVWwxIWLv84nMP8L6uneKr7CUR&X-Amz-Signature=83e637572789ff91aaa6f35a6999b06f4a0124719cd95fa5ed50bf1dd397af40&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46624KQTNEE%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025236Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDcpX6%2BwaCjmfuMg7jwU3rHnjMBYEv5DWahO%2FOtey%2BXhgIgamST7YdLNDxeITyI1%2FWGIWlzXvFnIiA0%2BertvSsHNEYqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAlUG%2FWHW4i5GROgeSrcA1OnC%2FUgh81W3FUu0d1xAnRdRFijSFYGn0JDJ9gXGVHTDutK9OfRpYSP60JUyBmcJe4HiMtlAe5dRkMWdpqw%2B8y%2BeeTWntw8b8yjUCyYyG8Tkw2AzRggWaHfpGITWfbh%2FtbXa2kK%2B6WxqaxIJeUla6%2B%2FDaEvGscNrvVs1%2Bx264yYT%2FsLXP25%2BTXCr%2FOBq7%2Fe5y7A8riTDU4FOMOvrckTrotNNM7tts17rTeMCBeAwrKGf%2BSE50Oj9njf5UnUvHtWE3TIGADv1N7NJTZeTASwe4y3nLmN2wbPogkkI8T1K%2BCOZQD4BjPyRz2U%2F8TyBKbeJuJ9Zby%2Fye6odgjj%2Bo%2FAEudlYXtH0fB5ajoa4X8fFADSN7F28XSJv7Ac9VoqxakO1uDahYMymFCIASUJISnVOU%2BBN4rX1vz7%2Fl72e7cy9yr9ky0JpsCVS2rhXdRJ%2FYZs08hg%2FeZjoYjkAqnmdlkZFyjKoa3eg9xUgxxC2QrLnDuW%2Bd6cEYZ8LIcuf21KET%2BjhvrQ3MGVHnkVNxLIdwXQITkxt4ZOEAwBiZX8SMLFqVgQD0vgT9sZd8ik24b9DlEnjZt4i2n2im948k2UDhvh%2BfQI2UWgw%2FdQNuQs8z15S4QbCHWHCN31RdEdcMjKMMqC080GOqUBos49D%2F2vYQGjYzc7uUrJX447JiuqyGrcYwSjBjrj9KUC59CR2MqfME%2FSNSvmvwVjh4weWaAVhw7G5K%2BL8iQllPuAnfvFuy%2BKcU7uavER7xjGeoPJyZt9MASYDjLwImghBQX%2BBF4EpCvTlRoQAPbbkG0oz%2Ba2w1%2Fkh8Ogq%2B5X3X9ovDrtU1q1WDS1OgqHt8VS4vgL9F8hRGWoDPsMRytU41%2B8b6Dk&X-Amz-Signature=5a476e61ca95e4d3de66964a34bbce1461973e648f56d8ee0f558db4affd7f73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YIJEK2UN%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025238Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCTN0PKBp6re74oDd5On8UfA9HcwudEBKKyk%2Bro2J%2B9swIgGQCvI2vToP%2BaR37x5%2BfluJZPLVO3U5BrBivK3fJy6iUqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNRJscivASMg0%2Fgf%2FSrcA9O1U96UL4IHkIZWIstdIR31142JC8QzHGUa2VFjcbXcbuV8OsWBiLQIUO1oJpNtjAnzCMpk5%2FRT4UGRfPLQnnQBL5mmItO5jrHL8wPb%2Fv1bm6SNtS6VHzZQPLchQMV7p5%2BXRxBXjngXQ3dhM0%2B3EXVLjhqd5AUQxY%2F0xVj7GlS0ahxfsVkNUP5sc7OOcWIHzt47vK6fU1VJPMzBxCsxdVnhJYSvqWB1EFiAUTJKod7e7%2BOXqtqYCkXvyTdoTOo6qbbYoRD%2BJ3KlLXeGHnehNfYtT9ziuae4jGgKW%2FIjpMk%2FIpqDk7FZISO1HtvQJ59wuGqJ0q3BNoGYA7GKRmEZ%2B9CkuG3tyJcDJCYTcOuAOrLkzMwq21TWe8mrcFHOtwwwES3tSpS1lZDdHoB2W4g8NhXknEVMhKH17IRVLPVSkjDd9f1f26%2BdR%2BI1FsePX7gmt1VVYNoLNk%2FbEwmqlDmo3%2FghvsumMv0nx0DkKoRweft6SZ4L978m6MSVmAbm%2Bl%2FLTTqnoQ9HTwtSZK5JX5%2FXXe8My4CBvWj%2BIqalrZu8M6ghW3K9MfM6bbMp2Lzo4ylSFK%2B%2FWGNWs8PoibVnX37dNncl1H%2BgyUvN8uJNhsNsXYJ%2FvWBKGti9hdRSAuStMPWB080GOqUBn3nEwd5Ih0cvBnOpCzexNijnTq4A1s0geED0A%2FP%2BDaZNqrKwG1GE9zu8krpjFUXr1oKfEF077H02AufHx0eeQMmYqCS14LUlxcAbj57ealBG0%2BACCdavxQ2WU%2FD7c6e5l%2Flt4nJ95EJmmWwrOlwgy%2B4k4VMdKf%2BcoUg%2Be%2BB%2FdlNvXfs8j9nW1w3ycc2sDzZA5kGOJcBPRJbvPMy3Px3ImElDjFPb&X-Amz-Signature=3253aedec333e7073c1c47a6f601ec764157c6a6d5d56b313c8c8a22e6f909d5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SZP7HQM5%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025239Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCTxvmrG3lCcjEh6iv0ko9GPWcoRX4jdWJ4P0c10t9D5wIgNo%2BiV70hYCJngQXunxCc2PUUz8nsIjJa4M3e1f%2B0TIYqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPjDxi%2FbuC%2BCqx4BGSrcA9XI7rWQaIVyaGcJ%2FfvU9AoM1mwDte5Tu%2Fqoadn8YW%2BKSxRYnEG4CJdAhFV6Jy6HqNzkl1knAtZgwMvaiOBOMxCYya8I9r025ZUxIAMx6W%2FwTsOUo5UbZWI%2BjNSTojnA2UYiKrR2A1zUhv5ooqaU3a8bOw9b3UiduGUKYt9PMS%2Fq3RvYLURtV%2FR31a7h2qE4dRq1LGyapw9v4ZZgBHd44af8IbydLVfy4NRfOsHPQljXXAbcChWM8vOwD9%2F3qr8ahbfB%2FT4Z9CW%2B4cymBpy8srREb2fNkfIKK0sKs1s0iukwViRXdsZyQlaENlRoOmYp81pZyqOa9u07x0z33PCOFGCiygapjYzBTdlQoud0pl7Eb1NsmFb93VbZrpuhaYfU8%2FyrbeLiM2gUDHOtdqz6eop5GNulYndfM4yFBFdq8g5c2evceDQ3b504Ovoecucfiow34zJj1qxZxADCqCUlCfFrc%2F11rlZZBkVj3%2B0rtP%2FSS2uNMhmBwOCqSGJgxPZQyBBcLQa9tZasSkTBvWlyq1VPVTPkISNkOUtZTDGQAVeQq5qzkMhz8HX7FeZouYKF8fEYUbnGX8cotEOX6Bp8qdrpOMXpldKIExkmgfiMvsO97Bl0kMtCJtgWAFdFMIqC080GOqUBAgMOLzpZ7biMWfum8JPmQB85mV4ZfoYK9rydUnN2vBHIUFG1rWuu6Ls0xdolUZhM69RsxS%2FOfj6adHIHnacmUJYPVXyApBcZgkcHa4CenM5ty5uUQKlTuGe%2B2CXG3D9q67%2FMZSljMz2ieJh%2B5j7%2BsL7p3RnJqFJVnqUazT1USoJM7WhKNHsnVLkWjo9kKFutYzDmpdAUe3N7%2B94lP%2FsO4dSGDYUs&X-Amz-Signature=ef7457aa642a28c25ffd099e93a8e034fd7ec3f1b216fb7673302f29b7617b3c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=8c8244d4bdf91a7a967cb7092865c5f6307173a15bda6aa842005bcfc54d24b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025214Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=ea8613065ebd4e3ba24760b911e610162e50c8672fe70419426b8f0c83c486b3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665EMX42SP%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICfZ%2Fhv%2Bi3WUj6GXV4RfD1%2FmIivHNWGo%2BAtMaJxgUxBnAiEA8LE2u%2F%2FRNLsROaMZHvwSOqS57Zq82LetCfRNZ7wJXdsqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAwxwpnTHoogyaqN5SrcA%2BO%2FevSdDajU%2BDGIblg2wTMU1Ub5x%2FEuP4h49qkSvBSzAEAiYBpXXp9hIcjqRpNrZWxb%2BQmx03UkaV1mhFGy4ehXKvJ0Dx%2BiC57WRXFPHBA0lELhSoyE%2B%2BrmdSbZYKvQhqLlFeiZAjulZ5oNWapjFc5o1G232kUTsCK%2FCnOvrUUr0J2k7sD0KZ0QLX8CC9UnTAdCFUlW4BdzNsUR%2FYc0WQokymT%2B5Mcoqtkhxfdvl40axp54xUer7lNmApTK59FL7ecgNC2wK0rItDeX2bWhcNICuuBDa%2F5ww8PVVzvwnV%2BWCH8S7q%2F178%2FBzwvLyHtZw6i1CmhRyvUvtcFcHJUQzNHSKa3zpBtFi7o4%2BBzTvpqAnjXbNjHYnpQQd0tbEnVws%2Fwhqkm8cqhqH057OWHGFD%2FUNvT8yEPqGkAsCdiirTVHeU%2FmCylD3Z7fK7u%2F5yRBbmzxpO%2F3zcwuuPQ13q5dybR4rzH19jwiW4%2BSFWGHXPM6GCd%2BaDc1r1MzrjjsHIejRLw3QO79hGGutbPphTmhKK%2BQtHtr8H5esiBXN63HHH6%2BYtRX1965%2B%2B8KFDN8o1L7p8C%2F%2BVGtVS0h66JiglyuSEMfTJ13%2FjA7vf5uNGoOiRl1UlsuA1gQsIdzQmIuMJOD080GOqUBU%2FqIe3u8wjPeYKByP45pZKo1itfFd9KzsT5RqLCItaBDzZXAO4QwMTvmS0nQ181SBF%2F83g%2FNBGWCG0oS1Bc4nAsSv5vxWRhtY1vWWg6VvXAuyaI%2ByZHGmoe%2Bu8ctYqoJANvLroeo4Q%2FnKTEVTSsTYU1fUEOsjjGNhG2nG2GO9CyMQRH0sVlT6zt%2FZOpy6IZuGDitWE6BN%2Fe6QRf7PA0O50l4h82Y&X-Amz-Signature=8985dd7db6833d5377c954c9e28b8265b20e8dc248a3cba3d9f2704cccf41435&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=331bd7c41ce42956c7edba8d6080d26798212b19c75179c7d38690b54f4c48a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46666FOUPZJ%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025247Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIB6EB5gd3v%2BPYJWHTOzRyyyw%2FIXKFpEmdkCjU%2Fs8waKRAiAZ2o6bZm9RuFwh3JZnFpTOwxq9aP2gksNyI46qVbaqgyqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM1bHyN9l7B4hJMKTZKtwDhgMv7%2FYkCjbgCJbAE328YtYw9wNNLqYS8oTO4bC73PnVznymGGoDWBo7u3%2F%2FvPRYi6vYMLi4PXzR6C1AJLFKbTsG6P%2Bf2dYMqWs3lAJtsJzXG1MF40lcqisG7dZjOTwgWJOYXsaW0LLttCIjB64raqV%2FlULzGtCyeorFakO%2FR%2BwKohIqjUy%2F%2BOWnTZ7CUsjbSN2GJl9RsEH28YpkCUM55aJ3HNnIpuRdxdlXD6JB2sdL8cI2wxmnBGSfC61s0uYebWSEv071tdpYhPA98XcdVRH7t9Bnjh7aZjKuKNVRjW8xNVf6eYAjMlg4FCtzjbHAuBj5fSMkKcI%2FzzCcIIi2t3%2BDzZEZDMwY0G2hcXqbp2t0bFI4JQpfeQ0VHukUXx45iiPMR4iffZ6lgUeVepA97BgeC36xKpDZC97XWn9OVKGlju0INwL%2FaO5BzyMmNJylRCZcADR1IQB%2Fpu8rGuDMDu27rwVMUMZYCSxDCY%2FHSxqP%2FIsLkahkmZONY%2BDhl6Dxf%2FHeO08UKVp1JOcUI1OGUcgqZUWJILThc6YsqLSe8A3K10CRWpczLDXCPtLhNsFuCJ4v8cY0Bz7UbcpzYw25fPe7%2BjZRUgB75vr80zpEGR60MRBOCBoYw3ZDlF4wroLTzQY6pgGALa9xfX2bkd9uTGklStXVW8meyE2wjNGZqk8N8bbsb5Lp%2BYh9QRKaiOSfd97g77cKZyqL35Cdwel5Ims4TMbIJ2M40C7lhdkmq1pLr5BxBXJ9W0EUtPp%2Fpm5V93xYulGz9OUupgcmyu2pO%2BZ%2B%2FrsxhPYGS44CErwurCO1O7TTKAU9ITCdD%2BVmicgHpPpeccgKcg2poeVNeVSV5GwEFIpiCboBoKEW&X-Amz-Signature=e5dafbaafef42f523fbc14f1c724db58812d24a741a9db16f19a79323d30636a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QPBRNG6I%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025249Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQCS3NCeFEvFTbC7xs03GeVpEAXfWaE8bVDGqX2OldErBgIgY5zdWwz1M2kxMj8usw4IBAJsK73z8j%2BnjsjdieWccBkqiAQIm%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGNb8RviPCHLPJg%2FwyrcA%2F5sRcaUWZDEEjAgLuwPz3N9KJZdwpgE1ToyhkDhP8FqTStYHPGzBJxjPB%2BJh%2FhP04mxOZ3%2B2bhX2Gnmun3net%2B5UJZBk9l6vhHb6BtyNlMFlzSvMpZCkTen0zc7%2B8yoDru6n16DYzg%2FIrTtDeagV3Q2Wr5UHYocSeVHLTIhbP6Aj5gVKIZODZriFoRrSBXXR2e9FkAgYxDtV%2B3YiuxMdUby9T3ofD6HonDDTpyMUN%2FmNw%2FqbyndJ%2Ftp5FAqFHKCw9aB5movJFEFEiet5t8U9ASbCMJaDZ9NVtEsv9pow5hkV6GfsOnQjHU8qW2GgywUimU0qRhFLzYJYi2i5olueJDdEHZtwsiCA9Hye2dsMdS1Q267zjxoH062Yq%2BDxddP8kAOwufJ2GJmtXCqGl0P8CeItwsAMLkCl9CoL6z3UEYlpcJUterA37fE0ffYS99hVCkz0J%2B5lmzqz%2FVxIzAdSheRHIHKIfGdSt3p6%2BZzWgC5dyS9jcfpijp5d%2F6PvaI1Hmj%2FWHIgXSPgISAUdL7LuW3RPabPH6XC%2Be5cnN%2Biz%2BecaGCOVvL%2B19ShajZ0yzz2zMvA5AWeIosNvxavmPSPwE09ZT8cnPjrZzJQMgeMybp5pn04WGJG0YcDD7Y3MPaB080GOqUBTtnseyK6QezbwwReaFkbU2p3p12iBAChUD2Btx4Bc93U2t1wagR9vOayU9d60CQ6kgVhY5PcoCy%2F1kwv4RzpblqGupeNlWxc2jmJ4l7kA2BUY8Se0xrsEoMa9eZITaePG1Zg5pVEpOvxc58UjmTjY6VF%2BQCqg7C2aoNdCu5RnDv4yL4fmfyN4ovXSbMZcDTHwvtpLktRURppNc5kfe5kIqtYfgms&X-Amz-Signature=69101da6230ca29e1651f919f452846cfaeca26661fd2e24e0c851f3c022798f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RQTMAUAQ%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025249Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID%2BU7wh9RlNGkO8XfVPJc0leL02X3Hce2rzSZt60tDNIAiBCeZTpHiAtiKdxEuSOMvlwIY4MrWmizYRLYKqRFpQR1SqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMMv0PB81X6jMu5aKBKtwDYoBfjVJ1ynSsJT8SGb3Unb%2BLfYQwH82SB61XKHjpIe2AJuunbdo3y%2FVoXse5lEDSrsK2SmykeurEqgWWp3L3fCSEsQNOvKeCNEkc3KYO8hMiNf9ISOVYM5a37REaI1d48GFn%2BA%2FZDD8VDN8l1IXKUGLxqGLSbMkxhAAsqBqMxY11qwwXLg010aimCwLSto3TWPARQLO06jPllj3x63H6zUZahXagYG6FbSwff9QN%2FOodu8mVjQKDVaEUkgTsNL3LvtsIcFeFZSQSKueFYZaLkBvuzQPa6ptdNoPbVKgIHqrw0WFDrXpGQzkL0E4n%2FdxZthThp%2BIFvdxj285hUrYlPeos9B5qoxsj6wNHGJeIN2nxOdVos%2FLqvHucFIvdFnwpzOV1Ioj2%2FUxzAcFSr8OYbVqLC5hTmUIkml%2Fpd6Jl2lRUkdAj5b6DlNZeKV3skqCc5bmihMo0cAYSjHCqM8D5u%2Fs2joMn0YsFE4ifRAqXSOqmPX5WqX0JloJo2soqm5G3lnc10nNgcIK9%2FmfGvzoQGvmkw221d7TMgRr6mNn7O5b%2FnlFujaxCLeiag3Ty4Kh6COLCAHE9nYXAXRWN7nj%2FUURnGpVAW75wiLu%2FMAAhZT4BHKgxbDOlj5co5ZIw7YHTzQY6pgGL%2Bc7SsnQhxi6TVMPpJVv1ZM2BxTeU87WILqCOBEVgnEBkEyX8%2F58cuuW5n6dv%2FdR9PBnNsMIh66XiL9jGHzU9eX4nzngdELjGM9BLuXspK0xguBBRUc7B5eyTnXiN2gSvYO4jWbYzh33to4dXyrLolcIOETwBMhoAXnTsgUs50iFyfCe9pF%2B%2BdQlnucqPZVNXNp5%2Be9wfxl3oNlgonAA6AYM7wmcg&X-Amz-Signature=d08e59742fa89be0c07fd910428e24835e572170b8abcd457e4c3eba1d9e8a27&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663OP4MPAV%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025249Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFSXwfvnG%2Fk2uyqzl0yZ2IM%2BseuUZI61lPMMHaM14SH7AiBppqGOSa7VXu3eIh0hzNrEekFkMZhTT4ymoPJT%2B6pVICqIBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKrM4NUN9MZk6l1XTKtwD81RiIY9wYVV7SCw%2B8brCn6vVXUi6UHNsU65xXGBka2Pfk22N8PzmA8KSDev91P96CsHV3QCONY9RlmJDf17fH4gRKG6VW6Uqy50vG1JjDiIFyGOZ%2FyTpf5ORKlOjblzsAjbvOYuTcVIEwEs8zw4nx2KxEy7RJHL4dRihiSdAiClGctT6XIYhsNNhc%2BU%2FwGFJEfr8jzhvNDq067sZNekI%2Fcrs03CtQ48ptiNPZ%2FHqslXTaMxeq1L5CcxjoohNIFsiwVsE%2BTGeKuInlnJhW%2Bui0xeiPimtqEbrq76nndWJT%2BL5Vtgn37hHTeljgK1EVH%2BzCMWU1UgC3d%2BQFQOQyaIHezI94rxuN5C6RhuA3vaB71vrFF0uA%2F%2BQFr4vgrh9k9ou5FLv73eyy62NJjDJC8Rjg%2F2lVgzkXDKsHgBYBB%2BiBwVac3JeagibHsxbpuRsO8P2stj2oc6JuSHQ192D582%2Fd0vfH90jOE1AJh0vP4yoPiai%2FpwtjU2nUGL4VYBrIkSktlPpIzlGMIw8rZykpxEibbihuQdWMD91bl%2BR%2FL4Uw0uYxGoiMj4DNlF8O%2FhkZY4Wda3T%2BX6QvmPVn7x1BEJv2y4kHuJvYiQmssS93%2FLu0IH1bs5UXhzd%2BPB4fy0wj4LTzQY6pgFlw03mlrklg9Z0Ol1lNFZ9W7xlvxEEPX2tC1BHHnjQeJoS3QNOdi3Up%2FuuyL2Xib7rgv2a4z93nK6fcpY%2BY2gttLDLiLQUNLpqC8U%2Bv5kwadnV2PLVSd%2FR9foVcyAFdvWU1SfLFn1pp%2FkDB3%2FMMiD9lTumWKFo0KfV%2F%2FhSY6TAgZJa2xJqHIouq8WQcolmvCUDk5Qc8opQ%2BAbdhA7v6NASOa%2BFIUl5&X-Amz-Signature=b9728133a86ebc38d93b6d74566583a9d91de8183d5f9c02bd19916526037ec3&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=6306e3da0fc06ed122bb5fc08bc0e8c23902a3099959f549ccc7d50f867620aa&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664KM3DUWW%2F20260314%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260314T025215Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQC4bNoZ8a%2FD7W0jbJohTt0FurfhZHesFgN0z1rlXOGdQAIhAJ%2B0d%2FTgPyHFoXbnZfNUw%2F99sSYu4EppiLsChXcF1tdUKogECJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyIqwiOE3nC7Emvl1Eq3AMqf2mhNYGRFtI4hLrVKGvW7DrH81G%2FzbeLUW9RgsLfX85zALg%2FEWn5C3x27F74fQeESeO165P%2BQlKLG7RaAi4KnoxwMQYbCvzSY1vlHONo1dQgPeiNRbJptWZN16KN5B34ektaAiG6SsAefKgpsuzMle5gJKzUwybg%2FSxhoFtmbeatIbOFrRDEGuguaB%2F%2B3v6XaN1EfmjK4Z0tRnwWIuaKZDkeXPeB7fAV38R8F93dmrDD7VcVpkrf%2FgPd8tjvXe3Rm0ZSaJjiW1gHfWXhJa2bQyLYe0grCxEtcAoa8WaURJ%2B8rP9ZBtcbhUuznoyK4qVRZEaJebyUf6aqXfCMgj8jWniXiWqgqA%2BP8VTdRfkRgRltKIBe1b%2FJQLINVRRe2P6pLdKkbbmQ%2B7sAec4ZH7GfCn68ZpnbZaUR9pPveoEWRmT9DsxKIDi%2BPPp0%2BONIlwyP9jJJCgH0QXFgWHjNF3RfLchCcj48kHy4Q85xYJRBsVI9V73MBXDD0a%2F6aZXEOFbPQatrFak7o21GvDThdxsU4G6IcaTiCmro60mv02KzHPbzvAIYoFCvYmtUMnmldULdiwkPxZhfv0lLd8%2BmETfYTnIeAXadv91JKrWBvZ%2FB4Wgdhv1ZM0O9A0C2fzD0gtPNBjqkAVWbxyJeHB7JSoKkcJ1RvF5yubQ%2FktqHEzecrR6uERtGofAzvihoQpVMpSqx5EoTxFq5SL4bRmWtZtqMQ1prF9pS9VXCE89BlsSJ7Yka96cSnceHJoQYglaL2bqT3yQBLq9QZUIc2z9W%2FRnvSWrNBqQWZsD0pV%2BxaHWFsPxIRfZVi44GANwvYnc5sXj0govcZzXXY3HLT%2FiaDNXGz%2FvUMFD1D9y3&X-Amz-Signature=45f2183ae9339e78e662fc015ebb5fe342a818c532dd1ad86685650486f6326b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

