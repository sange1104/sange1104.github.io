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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032000Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=7d9b0a817a6b3c0433e5b37dbaa648b16c8986f2570f3a10ec3dc230a115dad4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032000Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=57b0080b228637e5033ab9b83c08fd994565923359669868d47b9ab30bd5857c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032000Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=0feb5106fecc408346c8677fc17353f5636f440ef11750a5aa385b90d4027490&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032001Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=7d18d475188f171c06902dc06b098a58464dc134eed623b0b4e31dfa1cf776dd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664YUD44K3%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032026Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDufJ86oDXBbQrWzlDD6zx%2F7QdTdaIDvgtlRPVHY65rtAIgGjX%2FLgKh04Da7JFMfoOJX6WHcEj1Cghyy3%2Bu1mLlSpMqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDE5%2BFyfhpBn5h%2FKRACrcAxJpotcqdJWHu%2BruMzQc1hoGt830MeeDTXAdoIpdpJJYeoOKiWzdLmC6SnMTvc4V5%2FjKTx7OhJS0liWDSxVPiJD8NjJFHs81gQ4XBVqB6v00L%2FdXQqm2VpGDsDFMwp%2FQSXlcLXBijMKvM2%2F3v05acgcOAJspZQJnFO4%2Fm0wavyLpX8xUEvFjmNx9a%2BCqivWqax87%2FYdh19BE0oO62AyG2p%2BWSTjgd%2FHBE7VDaNhmWGXQxlJC1Kxpqfsvw9Nsu7qsmDdnJMQLQFSWLWyJrWkhPEVw4%2F1qJjPbSGjR%2B2iQPJsGuR5BHBSxkqKuvh34CPtDpYoxRz7fQDF8woASCf61UEVjFv9koV68wsU61tVEJA3o1KGwd0J3Tf%2FZbli%2FVuA1gskZnEnfZ%2BN2vVpus6Gb%2BkEZbn3G0S9bY5%2FSh7Mzcu4zNNChrcLyNUj0dU9wFmLkAByFO5DXAMNpysAtUObaXvtHcnZkVYBCghTN9i1L3w%2B4BIqg71EP9ZndDNNWWUZaoh4atJSH0Z%2F8wnzjRFBcuO5rf1f8K6KUreRORFjq6XYiiKW2XB%2Bq5dsihdka8NE%2BH6iv2cp0YcenMvSEqGkYxwKrG0MNMHEeD%2FL%2FdarMRF%2B%2FcgGC3SverZ5mZunGMK2WpcwGOqUByCsfEurW9crkcf%2FKBLr9yEfYDFMljqAAAccDq0dyP6poKwgZSG2K8tn2Gu3vW54XsJfJapLZdUx3w446g8cWqtEr0IC%2Btn8coF7Ru5SUPfD7K8ugAhGOqu82%2FrTYXZHLGFxd5FR82My%2FrTUz9CIDurhFZLfItA656KCMhrYyW4kKuh3%2FwPdTzTV07a0eSVeMFYrGFL1atxSfZ6hJ%2F7XOj7RDN9my&X-Amz-Signature=acee7291ab945284e2e472f8cae22dcdcb828ce32596fa7cd4a0076a5a9e9df2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QMYOQL6P%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032033Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCbYBZEbRcJfVarnqSpavqkmS3t8o7gt5cOufpTqxlM7AIhAPERYPdnFxPL7hRrUluvBSbBInEDFD8kT9oZ%2BiRS1BbHKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igww05Y1m06Rz79GohQq3APDyQP3WbdorIBaFLSMlb7MZMqypdZ0YsJjJGXdF96iVgaZ9kcRrZSO9BsDSIbDZPoiRbRg3RXIzM8eJy6CFLL06AqVTlx4LyYJdXpUi5kZnES5euWfVq8s%2B6w1sZUuuYVaCQbcwPsYb3ZbJeJmOWoOWrNt5UYBYxWUG7xmwVeX5tORIy7z7a3%2FHWMetp4dM8wXsaeVKarhLXkemH9W7QNbl%2Fu211HySc3C8QfIb6Eymz8IEsEH4WTZCp1fgp8gYkFSBvqYnT7fo9GseP3rzL3vcIineIRVYdC%2FjB%2F6Xi2R7oAOdqgtnAV0Ak3q2Bty15E2NbAzIhkH5ssIRd3uFQggYMu7rIfeoGsdZkoGMC4UCCc%2FQpKsB7pzeaW8Ptn%2BGlg%2FabiQXZb5Lw0Yeu3ZzisQ6zIjiKmquxxXNDohevo6ETo0H8cZj3iKQhMxtZjAdKY9Tpvl9axU70wb6T2JMbUvyGSooKOlgM%2FEoXvWT1SI4pXx59U5OxFn%2FOgPiDV5WvM8n2wxLIoojCaaloqWwrtpoLk8csjNYOOoj9befoGRv3Wtv5tIQTcxzLn%2BzboQchEqFZqiVns9eKi74o6Vkr%2FnXEjNv66c0uNbLI%2FjW3kEt8QSCUT70OTQEQjyrTCbl6XMBjqkAQVZ5DBO%2FsgOfGdzlT9D5EpfB2hWFxZxAxWrNUeixrYFlG0W21zfCeAWgWXsmAL1gAc7l%2BspFnsON4txbA62HCLA2rYUjTLaBvfamnP%2FPZTVRVZjWgW4FdErR8w%2BOeNugTv%2BSfmnJ32noY%2B2vkE03AgpPNzx%2B%2Bf4GFnNLDcbsmui8tRA3pkuGO1KIO9nRBY5FdXovTk6n%2F9FRf3foROZGYA5JKjx&X-Amz-Signature=62348d9a2f16cbcfcd6e0909a709546b41fddc5afb91feeeea137776fd834c69&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VPLSSWHX%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032035Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIF4%2FDPDS1fXu35xmB4qh4o6BM0Y%2FSvUjUeaIJf6yOtkRAiBEsPfLGMCBPaXs2POOGgY3qJJHf7pmVFElzR4%2FytegEyqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMmc1TPpNI7WXDQRRuKtwDOW5UU%2FjEK%2F46PNgSm%2BL2YxRpHuqVs1T17sjeEFMPpZMlH9VQr3vs0yoN45fC7whCr3NW1v2k%2FUBC80UlxnIDsCFpe9e%2Fqkrk5uRj99fmR0Q5k0d80ze17ZHvFEsg3iP3X7W01dtGKFAW8oZKSm4zURRwspDs1s6l9SfAaC%2Bg2Lw0HLa5R9CHr82T1UMubHjawt8W2quxoL%2BJcAyMTEOBcpfHsvA7dntX%2FsVTfSVCyEs6cNaEPDyjwL%2BFMVyWKqFieWtJDazNz6%2BzA%2FbaGe9n1aa299ftN3FoiH9cH7dQSjDgibl9E23GOcx6UFnoboExxdVuFXuI6LwqqCNZB6315Beky4IQf17GsX6T%2BMyaKADlux8qRRUCdRwqkCs2tkxKqR0S9m8f9Cc9GQqVGp2XpNK8RBCJBfz5Ci9H88iuEtIdN8fy4cHmYXviLQWdcF17b4SjrgxBclSn9dnIbNVxbK%2FA0AY6vkQHpt9vdCNNiXeORveM03hMiD7V6MlZTI1dvZpSueDTlYkEnjezxJH1c1rv0KP4rPhD7m2yTauP1MNBfTJspB8SBzwHFAQf%2BWPPU8b2d1ddjJ76IYiXB1UZfEtwKOW40rVaDiUYW1W4cp%2F38PoS0WK30w1gdyow3JelzAY6pgGZMK9UTRgiID8WhD670IDo2xGdC%2FLNLVqD4xWdgBTM%2B6beLkfvyu8AO1kP62Zzfah0tavIJ8O3uvd84%2FO8NQOcG%2BVUBPOHw8rlkg8A2eHMpmDPTbXvHSsBj45iP8VcdO70%2BFI%2Fp7HoHDMSGI%2FKwa4yqmAM6d%2BVuP7z%2BaqdRKs4MIHq4PplBuUp0oflYNj%2FqCLI9adg6i7zKQjYUmYDLV2SMnEJmu1I&X-Amz-Signature=62a543f4adf3dd6cd205aabaa682b754479c79d25c947027fb20486dc40ba9f4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RWU37AIJ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032035Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDut1gdAkC3HFvOdK9CYnI%2FV2VJl9VFCtPuHqEMB238ewIgPJyyNm3PjmbRxJhZ9lFeAL8OdrYEmA%2Fcudwr4gTVPc4qiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHuzq5DnLDqYjsPCuyrcA1Sq62Av%2BISe%2FDe%2FEd6yYE3veWeJFCLnpFxYgzEfrkQv5v9sUrKqaLk6aako%2FKWXXdLOZVrsQvAskIH5X8PZWzxZCJ2X0ulhhz0msFhMRI3BrTpIihOJ%2FPMJxOZoJ6CUmTNp5Q%2Bh9eme6P8ttVGh%2BOI8NE5wzPw169hhxr%2FqepiqQ11KFRxKoOiiF7ZeTlth1vpfCoYcAIF4vg%2F6Y9GJc6E85Zk%2B6VTC8EsRqHYsCJ3CucJM0hCaddPY6BTSK1FB3jpY7nOSRERcd0c47GSqJUp1ilZHFXUAgffa98W0orWeaDHVU60cCv0eV30nwyg184KI0bCw%2FfcjfwTrFcdjzzM%2Fd3mJDVswsir%2FcqhvzI%2BvZfuG%2FgwK%2Fw9%2BKk4uavkVFSFgG1wiQViByaxPfUKCeTrfR44hpkA4tw2fXVQmc4x4F6w8P9pgGkufU9lAWj2UIzzmLJzYmOyvE5xM5zXFClljkgvbPODG4CrMTNQ%2FNEcTGhCTL3%2FjolnnLv7OYyDf%2BnqBQ4y0CincWhZX2LmjuFq7Iq%2FRSI9TZZfJssmr6w2f6qxDK4BPXKAWoaAwNPcjGpPqqSYt8g7leiowT7Pbvs4%2FjwdYmb4AmIz%2BlObbTG318G5uPNshy2ykN6crMJSWpcwGOqUBpTEiT9ok8GFfG0Q1C5OW%2BvNQ%2FjeXhr4UZexRM0BE0Sq5KmfqCYe%2BSDoZHMyLEtGXTWsjGgUOWJsL%2FaC8hTfoeeosGxMUJflKI7amcznSSZgwI2C4jxaclOxGQqi0VNuxe7h8cORsREMsHj%2BZ6aqiExV5lymXxXc4N0M%2FsYJkpKL6rdhbNl%2Bz2RNye82fuMV8pMxjDzQ6RtyTp1BtJrjHFLvHC4hP&X-Amz-Signature=f5e0f01735e5b869d0d14c7cb2f34b9f18f2e868a67f7839aefbdcf7278a0ce1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032001Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=506260b256066cf5e61ec045795306a2eae7ad45b986207d6a08e5195d195352&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032001Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=f382832670e827ab365900f1d8c736fca97c51a66e0c999efb0c0c0d141a6e10&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QDU64QZR%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIEochNNh7TWF2koRYV27%2Bpnnemt5HYNQNHLuBqAm6cd1AiAl9ZMyzedCXWVOtZBgREWNa%2B8oexlFeJVEd81YFRCDGCqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMOfvxuvvmPgMSNy6vKtwDkZUyVukCxGxIAX5wCqc9fMxyulvpM4FazVwCs7dM3XSv1EH2GHRO0VVUYEazQReNS6IT4QvaTfSgmq5Re6UDPSMpKx66mrac10GwwHstMEXfm3DC5eOi1lpQ4xOqNYsC9%2Bloe8p1189UBbWg2%2FI5bj5HE01sLGDPVAlAmMpE%2B34iW0Duqyz6UOdxCg6EMgRmU1T3es9grOW2Yh1idmMkh4LWknf2YBiisJo5Ca5VgpRIYBXQgmmkHSa%2BD1bJpOM0EE5tWiYtbZtEO%2FTdMNfurn3p2Eld%2Fy4roxmpqDJelIme6%2FKlLUUEjSFZ3YJkrPflpHvqHFJKYD%2BPIw3DfXgPKSMQhIWT7%2B2xb1PTR2djXO8l1r2VXHPg6heUwsn6Q6U9PE7e%2FrPYqKSvn1HsdakqDzzSk%2BcXjjLF3Oz9EMF%2BP%2BbCH2DbF4GwdOFFRzPX3BhAH2engDWTLDF8Ov32OvtqTDTj2V%2FH7IlBxIATitnzF0wMY2MCmRe21EsgrUpPOJddfTAh7%2BimrF5o4EG0liE2VXThqy%2BU5t1sJO%2FRijpJrmUok%2FHEycFgwOsM0Q%2Bo%2FeOpeOYiXaNNSG9F4gbC60WJOWtbSdwA%2F%2BvX9ZqbHlWLbcTU%2FndPcBuFJ56alc4wqpelzAY6pgGhkEdTEDexwDjFNuG7om0QDoY94lyggybfu%2FKI2ezz6BaFhCztwbMJ0saV0%2FErrNyas5Ui5M34PdaLBZrGZVgFmiHfA6dKi%2BxKNxUN0JIrDRV0h1hRwczBR6OH2QfBReQTWs%2BKvj04Wg7F9k%2BePxOuSkBXrgWZwRJ8GjL1hDRpj0wkVEMxU0au0pqqyD88SXUjW6u5%2B6KFeNAmxhVbFhBVRbpqx6aw&X-Amz-Signature=ec038d037e81e90b16b4a0c7c2d3d11afe1f2c170dd394c71bbd51f5b94e1262&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032001Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=a6494837791522e350180e57a44753ad38c143f7080d02e2f8f2543adf22d518&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Q2NRTQAA%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032057Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCFV8OUvZx5mEJLtVD69aWDpIfotK9IuJe0V1o%2BmIQaaQIhAJ21jwXXKXGtV0zqaqsi6eX8vLVrJkLEv4Wi6KEzTKI4KogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyAWxYPd1mnd3msEC0q3AMnOET0lHTiosaViPSspIvYnRM%2F3t7DL6ZfcTyRrwa%2BCbO5em9UjSXur%2FNl3qAicbzmknueoV6ltbZpR9FPDQMNG2AwIHB%2Fm366WAxAnwxsbIBVTOmN8GWDHYGNJEuxEF3lxz%2FD4uhFSEPQeCaginNveyL%2BpzKPD8Ds0F3ytT4AUVl3S7X1N9AtIlFDvBbJETcPf1j19v23RxQoy7zyrg2GZCUQKKJuQHr20vAHSmDlBBaro38qD9P1gAypcr0f6Gwr0AL3qTxCoh6t4Rgv%2Bc4%2BQ57m3%2Bz8LZls1pCJUAvzr9lD5L2iLS51m2hldQGQk6ABxhxRz8CCtVTtAPSlbvaDJWg5xpa1i58lbT90oO4UAi%2BoOTj24Tz%2B%2BHdGQVrVCuTwbD08LAW%2BY%2FLtxZ%2BbW6uEZFsMN4ietIT7EjbNqzknygJFbOTLE2BuN%2Fre0Ndr70aOtEK2DkW4kFV09vyyxSUUA%2BjIKTpi2lRT3G8xVlLfvl5ek0O5T1Dq8DfcROb%2FSNhIRa0vOjP0dt35I0LXHJEViTwUMP3pwqn6FaNMCFqCpHk47ZFlZ3z6vwMCDKFetiLStsSEcC604yf0VxsDsHa9daWfzRWsU2q6nNkUEWc1rP0APs2aWnQl%2Bkp1hTCmlqXMBjqkAQFRMlXsz1je3r3bOOqbNhg6y%2BNrttRfPjSY8%2B0JDShpjrKOBFuMv3%2FDp5fcWAcP%2Bz6cRBYJnGaSPrMOoxcZeTA79%2BRNLPCGcAUtc7y5sMW3rlrhILuKR9rRt3kq5EWOB065ZJRvAUQR9EltKvIGRF%2FOlypVCXZPxjALFN0u6H7RxIMtC%2FGnis6J3yW%2FpW3B9JJAHAMl25xO%2FDzam5X1dV1ZR2%2F5&X-Amz-Signature=d7b4569045b7ae89d53c085799ad1f0d0f06c9abd1da28f9761282d1590da9ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Z6QYYZSZ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCBcVT4RpKyysYzDZtGRhZkd2lTiTpz9EzbusciYbjI5QIhAO9BfmYeX4Lf1RFI9aoBnpGpGuC7K%2BbANjijYEO0jfG2KogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzfHZ8hYQ3DTf%2BWz7sq3APlnzjkNkzTe2shND6EFIdphzl4BWTo%2B2EdGc2ngWGBQO7kje9GLT12g3hJuh0gwU0urB3kcXUBX2MefdR3OXDNKG%2Bgo4lgQtcfGHlX3x1WjrPYmKqpAKgxuCXmy1AaH56AtlyS%2BTYeQ8zn7JvfFiW86vtPQgI4VPPKvuYqb%2FBsoBZ0zvC953zRcA4xxDkqqTIW8MO8wddS%2FiaS0uWDZnIEtHmPQUJZrVF7HeONeZJXXkxx82F7Bp0dBWffczSYKrU0%2FKJlKcOmaf9mXsJeS0sLYCy2NOXJc0FZZnDSgBy3Yg%2FIh4Z1gg6TIQlqegkuKBUYEnbuZWkVyIV9aMj8d2kGC5j4kbeub3V4cX7ZzKXOfU66z8uOtgAzOvghaR9OjXggDrxyvMB%2BBGZiPB8kso0aujWLLyJznqGTE1Ui%2FbXh1uHfTYIT1Z88vQy1q%2F3UQfdXvStJhNHOZBlMx5V5QyAlSYfI1OurnFDTM8N18DkTj%2FT%2FQXtsnIufoWt4U2qYcdBcavqVjiYZAlsVhUmgJtWmGZAbqMOHJG%2FMDn9htZZdPoF6ZOV%2F3hjGKMHct9uaA5DqwXo6ZrvxzTKsYe6%2F%2BYGvcLQwG3Ai6H%2BDlOIcFl3Tt4dEYT%2FmvwvgTaHy%2BDDel6XMBjqkAW7RtHGuXvou3i4933no839iQOCNjnVGkz8wzq3UpTfk2pPMflI2Iz9DOkTpxFkWDwBIyhm5CxK2lewOtddQT%2FDBJwnlEUQ%2FH0RRkn58G2zrr1x6Y0A2hEiJ%2F%2B%2FjCran8VWaHDBQXoJ2gPyyGTGHXFJVhP%2BI3pcCn66EFIZR3V5Eglq8L4vr8OhAJ3ZLVWnQ83QmPptA2w6lf2umlvK6hra7%2FD1a&X-Amz-Signature=c4fa672350c93fdcbf1bc505266b5c2bab296a6331ee05b40b184699b23ef1b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YXINYM5V%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIFm6dwustkElTYHR5oS3N8sNRgl3TDJgO7%2FDZc1sw%2BvpAiAEwBKahV68aZGejgih5RqowFmt5MsHJpBZ2VVXFMZ%2BsCqIBAiE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMHjppi8TrRP3aX6s5KtwDZb0YCXAebyKI4tYgpZKrYAWby2yiiIlYSZWGTmjAAH0fs%2BsBj%2FOQDGsZ83N%2ByY8a5jwafX%2BXAFbyJiIw%2B8rWQ0OHT%2Bm7IjZcz5hppIvr0p72DGxfzGlpgMWGrZ3PomBQPhkDTQO6bvkmcf7Psg6GDdC6RH2by%2FiitsutIVTH5fL6UNj%2BUIFUANyjayGdFNMQWK0VcesXTEdFEjpCMnB05%2FYOVs%2BVdCpIPbllbGRU6RglAMXQaCptcAxPXNYafnFXZbo056RDd3Zdaqbn2UE9qmMA11pttSgzAO9D5olZCVYXJs3HWscq%2B0%2FJEGIA63dgQ4%2B0oNoJrHD57t35L1JnB25mcmjCYInOy99uSo3%2Bf5n8mFsaLlyvHiw8JTmBl3GzdxfjjXIHz%2BZ0PIOjl4k7EsZXABJGTL4FSFZAbXfM4XYXHumoyQwrAsBVuETUUWT8Lp5ot1IAr52o0G0aSRdmEPJ%2B7TFumViIWyho8POgMP5yzgBePSQZSfze8ik%2Bi9W90F8vr8fMzGDp%2B0qR58%2BrxH5bpeVofrv%2BfgvSzO1LCR8zBf6v0zVmWSvr9HxTDp1moPjbwRIC3cmEctHAzUe8QThGRPE1o2RFfP0%2BDOzNVrqncRm%2BZL5SmIxmZzkwp5elzAY6pgGXMI6wjvcio84oESsldN5xUeAJVzQzsT1Duf1zPHlD2vEk8kEi8rBCXEIVtzF2o%2B%2Fyq6bE6ixag4D1DnomC52ieujOi%2Ftob5L7%2BEz2qcXHPgQoW4RzQe6Axf4jRa1dIEtRdOP0xYKmloePF3La1rxled79TrM%2Fy6W1bmTo7J5qvvmLi3U0M4S47JHtMjMz7%2BO7bM8zbupaBnbFE9aWkLTFRc7QWEK1&X-Amz-Signature=535166fb470f5b1e73c050ad5d05f0b4f6d3fcac997890ee17d2abd511be67c0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RWDP3OU4%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032058Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIHYMOlyKEeZ%2BgaghykVgDzakRkzzPtDntqFTHHAVdJn6AiEA5r43OMRIImNlLrBAJts%2FlCFKcvL9L9Lk4pEkLUrxg%2FIqiAQIhP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMMXifrSu2YJnYKO7yrcA%2FXzP%2FFobIi0hL%2Bx54mUcfLgoLlb3ylt4F5vCH70PqpxBAlpKE36FWcNmv0%2Fe1QZqs26LkFsjn83eeDiFdDK4%2BZyI8uZQEmo9SBHYokpDuBrgHPlI%2FGIkVKGD%2FNcupEj5qK0t12J4VLPN2po4nJ%2FIBv6aQgXXGJ3TQ3IlIHO5voQUCKiWynFbgZbDCHSItH4AfvzyY8HUphR8y%2B2dF%2F1Rs15N2XbuHzf6lNzFldOZ6jwSaytLkIorkPuqdERfyZarlgDNwW2FMdydzNXWWuhpQbSWlAQbzWv0YvN8JUySU2AZ4rntfNud0SLGINyLxxciX6P%2FbvyYJNAaf8K9W%2Fg7ki%2B7nsContqN9iGklTRZHv2Zpw4jKvHMHvvkLUWKA3ACAzzx%2BVmOZaRsJ5yAZM4TgEIFqtE%2BOQOvXxe%2Bq25WmzK1WDkZqnyi3CgREjD1%2FRR0K1M0VBrB%2BuqoWRYkhsRh4FUMBV72tnhLhA6j2veMTgNi%2FuQbvuV5cSkXb8iForsnqqBgypJUR86Vpt7K6bBsYkY7eD5PdZLiHhCaxW8bJje08vZoBkOVq3GW6t0hu9W30X4FvALHu%2BC%2FQ7cXSheVpX8sGN%2BQTgnAckFYQy1aVnH3Geu8tO%2FvDqT107cMNKXpcwGOqUBc5EbfvLcO0wnY1%2BVGt5jzxdhmfqydV%2FnMPLq4Zix2gzzMKhwUpZfKzLt77nsfLmkbjO4FdQFGaYpBHs42fdESMJuUsODkGeru4CrBU7qUoacFpy4qx1G7MBzLcoWfapxxjFT1OP86IE3wBm1OIiyJJYrXyc9hU3gZ4GOpPc2NYk3iMk9DQJPrLWCeRXwhIFWsRM6YCS0lZaQn6Q7Jyjmm%2BnLNHFh&X-Amz-Signature=791b6ce005a608c2f862a53396463f9c99ebaa260afc469e4f3826c9b0c1b03f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032001Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=99e74d4ad1c3592f5daef118ae1c29715ad8505417830ba4b2ae9525b7c4ccd7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZC7OBVEQ%2F20260209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260209T032001Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCLaJCGDFcXqwK09xU1qG%2F7JjqQzBXfbzuonQ0GXLR%2F%2FwIhAOEj4lF29BbRGv4TDr%2F60NJqQmRxRDaTshc4wUJOOsbhKogECIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxxFB%2Bilnw4dj%2FGiYgq3AO7gTG3nVSPDLtLoTFemBcpROJa%2B8B9qx%2FNxCqp3edR7s63ACh6GC2xi%2FGpG0AkuJZKi9V9IVgFQHa3UsYruopuvfft4lUFd850eZrtMU%2FpYgdKeHr1hv%2BFVgzCdqiXqz9PeN681zjSJYktZA0nP%2BOaL7k6fixJz3KCJvFyw9881k1ry1mr%2BnPpwyw5aGzeMSaUtjrMFxJApwT7ihWYkxv6Qnpj5q6K9SaJ5%2B9K79vl2ilRqK%2FapoLpPGN%2FPu1EvAak3sndkrSRcmcZxDEIDIr7wqpAaF39YSPQ7TRg55vOBETN%2Bza67X8sInE8CUhbLZFmZNSda58jQKB3sYYeBQ5hwx8S10nD8vXCGCWp1Ofs0NkRCdQ4dyQgQyv9pkwxe0nEEdjUqSpbnilbuNpnKNw05bHKncZiRD9Y4DN4fb%2BtlQCuaiNb%2B5TsgrRZ3ZagZ%2FdAjZPxhRPYoTCeRSx0APdJx%2BqXGEPNLlkpESJFEVSNEpb4znUSkiyyDv7VBtbkTvSQF8ERrC9UMn2uq8M4fr7ZmxeAej18ICsAvko%2B76pmbRxatjOYF%2BgozJus5TUO4RtAKnHXXOYat9QZwqKMlZoK%2BNgtrvts43cs5D3G54TWptoOQgg5nSZHAomqljCMlqXMBjqkAXzqHjhODzIrnTqOL1Cu6smHrDQRunO1M38pnOkIzG%2FSUbELlr5eZPsJ34z54wm37RyODTtLH632UEFnkYI2V%2BDAst2d8v%2FZueWOkbV%2FwmUeVcWbExRs65%2FRqMCPqXgCbtxmtRyAy5vffQmdvHHfDUgypPwnAPMAkp9F4cXqknw8RkuhEZk888RZCPePNidQejwjnSWywbxYFUFuwjBEzXSOB88i&X-Amz-Signature=3143564fb0c315679a63a12e63783031627681de524a8fa79bb03710a71afa97&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

