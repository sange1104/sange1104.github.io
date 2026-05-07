---
title: "Chain-of-Visual-Thought: Teaching VLMs to See and Think Better with Continuous Visual Tokens"
date: 2026-01-31
categories: [paper-review, vision-language]
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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=f318e5962b42de8abac4c8aaf3e4755fcc4faf742d397ed1061cd2d5abed6b28&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=b1eec5c465df21eb57b2a8ff03882a85a6332392abb5a6e4792541ed9b6f727f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040629Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=b15411cca257d526db262ae035d8859550f03452c3f3dc9e140b6a3f08df23e4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=77c9675a1a8734e39fc0d5f13a3509483e5b463ce7fbaa60851d975f6f9b255f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466Y47TTNOY%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040637Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDfEz9R4uY%2FDkBgiKHzUYWkc%2Fl6zy4DGCg4KuI5%2BeXwrgIgB6pzTTCCkETIb8TvBD5%2FJvgrBNY%2FZqi7PgVM%2FJCKAlYqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDBwS2xd5%2FAPXxFAoACrcA%2B6cy4cqiwvMZYiaaSm6o3Vf05K%2F132uvmpgefOOxpnpq4%2FwvXR5qBsoErB3KaEwacMupS9%2BFJdfJGp9KKz8HLFDIpEY6uGtr9%2FQw3qu12WBC5JduOjbuQPaZxzUBSI2z5wrP23SjutggqNa7AJHK5Y4ZxNwlyAilwmRKvGQHF8VJN36r9g4awMcss9tF65JXVyR0GtgV2fd4ZmctHvEegkYtJRhssS81jpdB9YxeMaTG2EmD2ueCJIWaGs1Qbtn8R4qEm6809XAgINKOA1R%2FLqH1cdd2NEPNLffNCR6E60qBim%2BpCxtrXFQtrBgSgrbX1D49WMACZLBjVgSEM5IMVbySDK53AvJsKwGSFhPOdIquv91ZIVYYn9We5VQWiDt1FOGhfI56f%2BIlKWL25%2FheJRmUtUc%2B%2F3Y5XHducLm%2FN07QUtOXUMpEfwV8qTra7L491kGjHqnM5OGh1wnStoDvB1EWmN6q0kqvkYr3VuWDR7fj%2BNN3eywBkfzSySG%2BO%2FY%2BBmMszBfn0yET74cRMMcovoI63GfqfVQFGZaAPLjJe1ZX6YcFcEx%2Fh9F6amf34%2F0GESnZEhmSk5eaKzjpUHzdAK3TTP0%2BGnXK0UmSeaUIdS630fjN73Zdc%2Feu%2FdpMPKI8M8GOqUBfTy5mKK1vhyQQsYcEfKLkeDCDcm1nCQ88Opysr3fjapNqrC%2Fv5lknsuYkKFAM46mlVKDzDEmB8Eo6G4RniLAUVL9XsM979A6OHZ3MQvksgIQnDk8%2BaBcSiIl18HrTOqalgH3o8PBvTx4Lc4%2BtRFsBlwzHGe0s3gfdY3TuqEOnTiYtcHqU8AcGqF70NAYXdr2PrIH8xUbHYbekzu1Da421qa6rb%2F5&X-Amz-Signature=e1053f8c3492903a6cb2bd26283a9eed1c66a6aa68589d09fe67aef02838e4d7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665BFIIP4H%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040645Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCH7vWTy9DnAOsunQfFW5OopOYDvDPoUd0%2B1iM7MvIFygIhAIVEZI5kpol2BYlPOpexnfjFqK0hO%2B8RUK1KqbalEwI8KogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyjpDlWCJLdsoTL10wq3ANb5qX3eam5r15szb0pbReag5fXT2jiKlLSSNg3N130IGIvKwaDXJhdinPboVlRuggy6WyxZN0SPwoZ90DxNnbMOac%2F32hm%2BmWoX7ZZATPW52v05vzPfs3w4H4VDd%2BMQeXjLhVFbUNQ%2FAxAPHGXOmggKwwDa2S2V8bAcjuNNE5k2PtPS6s%2B4baa7SXI6usDR%2B07qGO9bPnSH3ToAO6q8%2FYqcCDyxNS%2Bdf8lZTlouRCOKaOkgWGqbBoJMyvctTM3aQVx1nJVC%2BG4rAQlhFAGoJAGz%2ByN9CQQ%2FIhhUTBV095SoLwkbjTax9Sz4%2BLCCvLBWprUXNl80JUAbw%2Fx8rVoc7uy7cGnqq%2FX2tFkkZ%2FaWcKlqUjhpi0UgK1dD796wfHj8P5B9%2FG2TkNzBAy76Vm33uRJc%2BxXrOVDMRPxo7r0t6Vf9wvx7r2Cj%2FmpN3NkbUy74SNugpgcIY5wYeydevX6aqowMKrb7SfP4GCdabZQMICfUmKCvcuCS49HVpq6c4TW8Z%2BO1%2FhLkYHEpPwbKKGpTgt8bBlugwTtCszlkj3GX58PvFrM3ahzrCPPas8RBEqv8sU5l9z8mu7JDIhobz1C3p7qNmNvn126QHMla2ch8NYBZprWq0kHGKXLFD3FNTC%2BivDPBjqkAS6ZDXouUMZsRfNFKy73%2Fk8J4tWTJWEIqpci9aEdw%2FFe0CIxE4IQ2xaOiK7YZl0jBxZwNHPerTLr35Upx1AlwGXmZD0t04mvbOShmUae%2BnJepPd5jfdiWW1gnwsp8XhaIWULXVDk608Yw%2FeWoXW6bNZyDEtKaldvv4O5YZpv3zvJ73rabJYbw6%2Fdj5amxOgqVRHEQkKWfFFM3f2VWIhzQeFJHNrn&X-Amz-Signature=599af3ba335601fda2fe2799c1669a962f7a40b523718ca6352def3c2cb40999&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZQ4IQFI7%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040646Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGqX5KYho3CqLWPKevOqTO%2FKrGo%2FAT64lmGPW2efPERaAiBnkjnk6TR9IRzmroFV9Xd88Q%2FJobCbYd%2BnZRn4v4UHQyqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMK8afu0RCqVI0FD5IKtwDrAQ0uT7tog6wjmuwlGGizIPdLCMNk%2BY2VaFgwpK7FcCB%2BvuPyn%2Bw1ec%2F3lQGy4JRuLZujzEX26TYlT5qT%2BM2wN63dhYyr4GdRnaBDdzNL8sYHQ5Hk%2BO2tq3TaWWU1szDn3RbiKmU4XpQ%2B02la9GoaI2miaWxSn9L1Qe1AWUu5q2VLEZMsFiAmTzXU55EGZjf6n3G9zD0wvhZZtdgUAvog8QMpcIzwuFfMjxeWGuDvimB1LooK0ZdSGbMmlqiQoFXpVA8GzW1S6oqQHMK7mKSLgsDkp3%2BEzka5lCpjOr18HLISco8xMmVtlgWAjXTQmNZyu1JSLhXHMo35w2tViZpKADXp1546REdwMw5rWvw1ZRnYmyJwhr20A3tAeQsi7zl8Plct9rLHmZ6wGRPLAjLTfe75Svy7N%2B6yoKvAzcD53U0TdwMPHX8AOf6LColo3lQ9qFbfgikzoToOw1YYo9%2BlrXiQt30P10e3aRzsAG9rREX78BZP1SXX4JTNlTfNCWePrc3ZBkTjKMv7DeT2mG%2F8m6i4Fr7RPe%2F5wVSkd44RpftQVzvefNKA5ApQ7EhSaEEAzU9%2F%2FuqMwKBExnu2pwycnjZu1yd75%2FKKsM1vO%2BXsr4%2FH6nY5aZhHcWAuI4w14jwzwY6pgFQnB6yS0MwUUvAYSp70m3vrXqZxNMDQwEkMRAAeo32nhCvVHRMnXsfq6ZrWlq1COqWg49vnYyfvteSWdAmdSLr4ylngqQzU24nwwLLgvltnXCjgb8sNP2N6PIqR7B8w5py7Z6AqMKEar%2FRVQExWhsI1tP73BwH%2BjW7qVmrWXlzTS2uRefSL8QBWGRc8evWA%2BJNszN5W47BrMO7ut8LCaTTfnrx9bAg&X-Amz-Signature=41f2be5891e5a9bd7841066357468a13f4fc958bd420adb1ec04289aa1f7ae20&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VBLTUEW5%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040646Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFXFzUvrlCCdfVYqEc011YomzTffl3mmeE2HJknDTldMAiEArgCHtctja6YMLT%2BUHCSEL%2Fsw3LmhIDDqxwLYNEVRDdcqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDC2Sh%2BpmkHWzaaLeSyrcA7MwT%2BGhAHyEg8SE2lmgUoS5JoDfUJqw2RM%2FHEbYXWbC7OdP0CfpR%2Fy91%2B646bUj665LUpv2NN44ver5sb%2FTYdH3dhQ%2FX8zjwaxCny0YmroysyLOhiiNhhmnseUJ9EF4YRieEWg0BqUepgPhiYIVvsfDg3%2Fqy8WOTZz6gxPJ1Aw%2BbWIE6xVnAh9aQIBDu02fEXUbKEU0xxPalNBmVfRotycVb5QSN2Gw%2BsS%2FL17eu%2F%2B6dZTk3mEKRvFAs67o63uEF6aMgPogWjBrt4s2PXMfnLbLcfhzZ2UHrSmB9DDrtU5RrieidY5g42K5uft6G6lLg9LlvwXQ2hekKL%2Bmo73k6isnIS62OO3MLL9B8y4XQKOqlQXa7AfvgGvHmhrBhh2p6SXdPntIwFfRdxE4r7Jjvq7Ten4r3u27S1Fd6xQzVeBqpgHUfc7oHrPV1IyJ0Nt3xS65naZxbK319ocrbxHNUaYkU4XxwQZQnVxo%2Bgotc9VKHcRbCm4JWBxDpkcNaWBhz5kYdZPEgeXWURQlmghRCR5xJh6imhbwno5jKmxQ2IIWONtjgUsGsXMkHJdVTTUjMNfz1HHtmBLH7PWlmDiDPRM%2F%2BOzd8a4jKWSkz%2B3icxp0WiyQ2APBPcid3xw1MPmI8M8GOqUB16bHvI6xeEc8COizdl8JZHwjtD%2F9Nn1LeC5Nc%2BFjYCE3gYZEjQlyeD8Sap7tX5vZ7BufXtM7pzwbjj6b0BuUyZZr3dUOYIWHUZpX%2B889CE7pVwgCDyHFhPPoMCIVYJ%2Be6It%2FQ%2BIYh7csUET5GFJfrp3Kh0BjKWPUmNO1QaBk7qDHV%2Bv3YJ9p6Q8wbivyfw1am0NKHsXlHunXMocLhSojl2gBtsv1&X-Amz-Signature=ea0283ba76637fc2d014f3671fe053e636537391e5853273fd25bbe24b06fed5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=834087e2286c21e1428f872f793f71db7fa8358ca20f7545ed8c63fe8e146e4c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=de6073770cbe977d7ffb5e2914a7bac24c1100e98711fc10da58143cd3e703ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZDESSZDI%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040651Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIGSBgoR2sTpEwf8pxL59SqUqsR4L6%2F1BSSjLOg2FU1ZIAiAJ%2BNL4icIVR4nZuheXT%2FnDvUrh%2FtFDIUrZoQrzNrhr%2FSqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMKa%2F9ErjLP%2FsMl5gtKtwDKSl6nzO3WD01PBR8mgXBCdNZyXEm13bHjfjj8Wey%2FlOAf1p9r5lKqc%2BKV3JzUl6m8MVeToE9J2y0FZi7SGpOrIt%2Bz2M8LGBXar9KXa4iZtKN4WSGqz%2B3XqtGtrHYX%2Fn1A%2Bh%2Bhc9AbPfG3bzduexyoguC8lc%2Bqo%2FNOCH42%2FJrkEIYLZF7QvPFBIIIcXsybDT3jl5TiIvXJoewDvxKCeWY0AhFaH7GMoAIEzRWSjDJZgtaOVrV5ooqY0uhk%2BNDnGUrmEraV3slnYK8jSNSo2V1nWJbeRQdLEkZh%2BUo0UcUDvqvMEOmemqmq85QyWPzDyx9bzELewowld21gD9YHq53PiBjSfdYEkRX%2Fl9VB14OpF4I84%2FE%2FkAkl%2BChRfWZX3SHHBfo0umo0zLqHqOOiLG3Vk51Hk2%2BV94uCUmEK0f4R5z6u84A8caqJULOvLpd1SHrf6pFXseB90kkt6Eq%2F8Yui%2BEGrtMNIae4Yer46jLJ1QWdYgkChe0xZ9tNyejribgQIDM3mOpZ0P0s0HDZ9JWN6LlpWdNb6rJQ%2BPEy%2F8AD9EiHe2A6UAXDlSs2zvnVKuGurQQUkgzShWGxovIMZXpztXBsJ1ydtFhkdYDYb2Ztuy68dLwRyNMUnq2ye1Yw3IrwzwY6pgE%2BgOS6xvpKZhUlfrX%2BUFWVoJGz5fEYl%2BAUlGztJ625BNkGvCKJCsKkED528%2Bbd56SRe88R3wpN1MaktGof1I1z1kSLffO8kuSYc4rVw6EQg3fue7aE0mYbICGH1bqJFom4cky3qY95joQSuaUfKaRoW0uCEesjtVP0U4CSViB0nSro1sApEZIULpxiZ6JnWCtg9AJk9165cbrMaRZVNZ74GsG6JuPq&X-Amz-Signature=e6095216e66c92131af22d4d0116c198d590d96d8eed37f7375a3d9a16e172c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=a210fbbe7a94ee47fbc71c53b0befce30bf579dc17025eefdaba47e999638d3e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QPN2W4LM%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICslxclkPsNTBQ%2B6Q%2BrIif1IIkUrktodWMxkH6TjohSCAiEAvGwwFI7jpAwmhYPDW%2Bz1Ez2cMjA6M11XZVK5upD2DvQqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDIx5CydY4PI66AyF2ircA1odgGsVtxKhPqXdgHxBGLf%2BN%2FPPiChSpR779o8LVLnLUL%2BMz9Py8KWkh0StgusH7jbLSvz06PMaWr7z2bSZkRGEjd7C3T6GH44HLovISY1DjpFNRjPHycfFWSk3UeeWkYZk%2Fk1sHRrqkTMZ4IdnWxGy6WkCe%2Fe1UX3w5uv06C%2BTa0iZC0BVdHiiyVnup5danIZ%2B9Cnntxl6fqqZYnKz%2B3fQ3TN0gzndWOUvQRwQG8KDwE6wgYxSLHV9OpMqZIVEnfaE82MmdQqiQT17CxfuQR3TwvWuLIY4Ccp4sklfVEgFRFOvynIK%2BblExPuif6RFuAKl%2Boo2Hwh6OppZllCvLPPSASsWBoKpNPgcGijRaw7NKIEj0xD1fiaa3m4biscINtvDKHTyccEsKqjZl%2BtZm34v8mNRoPPLJTro%2FTZ0yMGMtHM%2BSzJIMNGp4uqv6mu%2BBksNgkdMQ36OsLIC85wtRf2Psuf4169sFvcetN1I3Wxmv7IxyFBS9s95SCscp6xbstKCSfK9ivN12i8ih7fm1L09b%2BlgQn3I7%2F%2BORiSPqv1A%2BwfIOhLyzT2a2QwYVmjQLn3IR2lFQ5egUEk2Q%2BO5fDbAi9keC7Mo26oNlIw9mEM46b1LDKIITSlZCx8oMLSK8M8GOqUBdSK%2BsnL%2Bagp6dbz8KuKh1oq2xh9Xg5yoKKTXg2iJxfJ5H6ZOYxOY%2FZCCgedVAvo4gq17J6TKpAHdJII9zMJNH4hHQD6nAIu5YciiRHyIkoFgjjaqgXx1SWzXix2zHnoB9KOjq2l1TB6%2BH1AASFPneBs%2FCwaWGxbEypNrwOA9yrF0EKzdkum%2BJnK7IlDMe%2F%2BzDEYP2THGRe3At60LOmG5cadxe9g3&X-Amz-Signature=cea4f81dd7642238391c30b039a7a317bfa27e0d3c702ccf9a2cf14dbb436b01&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YA2DT3ED%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCx1U1af%2FWjFYKrmXMYmjWxx%2BSQjv6TluuHk4Sul6akUQIhAMGutO40yoPEtR2gbbqX4Wi7bQneni2Ny%2FeXO1cgRAvMKogECKz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzJ1JaEbsL%2B%2BGQFxIYq3APgXatHveD%2BSwF6CGDrgzVAgg8aJX8cIS5wFyY8MCqwbflawdyVp4cxg2p9qatu7nzSvag7Xu1D7H2oqXGgLfhyj%2BTfWXHcE%2B%2BunAFE8e1gkIMo7arPaEcUVU7BSEU6JCMlEFUXpUFkOLUbAPGyICXT8g4ZCL2DtfTH9ItE0KrhbdWzdcEUYgVodn0tPAsXLoE1MC3vDjp9r7%2BuEYmgqk9%2Fm2KtBCl4flmhWGZ7byTegQwzYfoHSiTe4GQOZRp2dAw0olMCd9r50wFLHEyYx%2B%2ByBmvQmif9K349JpkLYjFdROrfwdhAeyMgxUwl7LHy8hQP7TpGkJBjy8ej7IQGBQgJx2XVhrgUjSvwyB09Ffr7c1jIbfVSxpFiKu2jG1bWH9nYtkw%2FLygHZPLggIFV0ogYHHnYuk0z%2FgcTkgWPorotOX1%2BoxygZ0iHSqgVvz1Oj11FpNykp4w086OUVn7oVa1ymC99y3VIyibxRKSBJJPLsOaRWCiwXt%2FB0lSXSVf5zbLo9kNET%2FxRACfMivj6Vv6R%2Fhnq1bdzQ%2F0iyb4j1QVVqAOYBMrxCmJKkWUzbpZR6hYAqD894IBGCB67QsDSSJnB3Qtw6YVZ7uUH3De7TrKSLAt1nnvP8fyQgK4QzjCPivDPBjqkAfz1kkhOue9eUSiRtE73s4ZuX5HKHldmGUTX%2FVq%2FmW7n7zbNxV1fpSLvTPf6XgFFiPXOmceFsD2IcB%2FQv2oHHD1kmt884UAXt0KBFvHxRgW8tI1U7ZkQxGB%2FWp%2BMOIjJJe0eaDrLMMZQdE5HzHsfK4W3W06qEyFO3olW4OlTXSASI4XPvZrU3hyLVTNgm9hcFYkHlAEXfEqg2oyKOQM1LZMa9C7Y&X-Amz-Signature=348b4452cf02bd955b02e55ee0b444356c41c2410e2b57f6851c3ef65868b9bd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666HUSZX5C%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040652Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIArk%2FG%2FsJJJyurzCfIO1YAgbJ4IBMmlI4jV2uRM5G2e4AiEAjw8JKEaA47J%2FcNfHUqk1NO2yMbG759Ytgr2NtKsBZpMqiAQIrf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEecQeR080lFt3MvDCrcA%2BIPCIdWv%2Bynu%2B%2Bz%2Fu%2Fcz6DuUWQBqR2QZMYhs0LHY85Cl3RLEiWjnM%2BWLI7F0fIXOZw5jxPRh94mSp1TgljojyN%2FWifU49Nu%2FM4Nqa5QbZFeUCFue30noFW0vCo6oe%2ByAHjgdrUOVRXGG3msS5B5IqpQgaNmT7nkli%2BA9PsDtqdjEte2d%2B%2BMGATWMP%2BRo714%2BQfCcNwobqddjV9p1wfayfehDLNJXowUASAQQJ1t4pp%2Bjmyvd6zSGS%2FtIboQF9KUzWZ3FJq7o8RW1fB87%2BL%2FJstvZnNPvKI6e%2BJdKhyh5nPFh4fFg6rOJd40%2B%2BGd1xr5wS1gMxij7Mv5HJdX9OyBDWQGHSeAyk5ppBjZYtoCd5aDeMiY0rkS%2BkS%2FbySyMrU%2F9HHRfYDFnVfxkaUqy8TIHEAo%2Fvr5L2UdtW364uzvmca4qzrzgcV7SXsgQd6AECEJvjBesJyiBDP90GyauCnidqMSwfJ0WgLpT2aYVh8iZIAyKS87EedFZa345hci6aRmW2gvNo4ZNUwjx5AlLhXM1jwV1l%2F6W06fjyU6LXgQNccxYSi8Qyso8B579C0sB4EWP6a%2BXcXoYMJwAJ4p%2FuFWC07DsSfChQKQYj9wouPobrIbuwHK5Y9IcdUkMe%2BCMKKQ8M8GOqUBV7k3B15PFIjMO5UlRvO%2B6nj2loCzeMSoHVZV1Csg4clqQCyhOzu9Dnw2lwfSaj6TbnGJ8BFjX2XejIgPPeb2LG7a07T16W0DmU3JMVS3mLh83dJWoUDKOT%2B50DmC49SfyhZ9dqC%2BiUS0HCsT9Yf0XXdkUvwwFizZvkFoRFZbNbRG%2BFvH9%2BmtKMv%2FTlg6%2BglP9w1PbGF1qrsyc%2Ffn3eeQ%2B%2FDDLl06&X-Amz-Signature=5d8b5ddb452cc5d6d8315b3fbd41fc155bbcff54c6bc9a8b3414a63c8a9a3bed&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QZWAKQZU%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040656Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIFxuw0UMSnEg5VNlJqOhK8%2Fpqy1qrma9%2BkTwuZdUZRmLAiEA%2FUNPRGYKux3ced0gbiCvWncceA6HANRlVx17Ur7AuOAqiAQIrP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNWU3Pg1TCSDWIVECyrcA3Y2uHBHB3RY0yYvsQWFXjOim7ZZ7IPFp%2BO7m84pIGjfTpyVCMKQoShl%2BsCchea9t%2F3B7pBmPfyU3MAx1hVuS8g3r5%2B%2FTd52TMh3VMn2gRzkmPPYezz3LdCbZLU4ShdjJKs0hFXlDulcZhIpTFLWwk%2B4mDYIm7bSyVA2HAGs%2F68jWGlM8otHfnR28RVPDBH%2F3s4rMB0VpNLRH2OxlFzdNNs3qCIk0AevYwV2T2ZodMRxVAEWA4YdUW9YV6Z%2FDtS4rXX2DzAsQAxDPtVIHpptF511uliplJnNrp0acnPxt1%2FOpg1YoJxGcKU8ediRXSdJZZxIzMV9HpcR%2Ffhj8%2F5d62yfnb7GfB3jzg2RC1%2FLaA0sTRjjhDoTXsOICtIX8qdZepY40BdYzyfJJBc4%2FePeErMw0GEGdane0%2B9zQdzub58apvd%2B%2BYIHXNd%2FvODO3emCWYCmWufjhBFvdUzTn%2B4nqJ0SJf4CE9CGfMAUFxInSGpAFq2lDpgb%2FXezXWn5%2BerFU%2F1fYHbPObrqjYblz100gUatTDWEDl0B6rCoI4kH9OweH5PThXxiROaNqAh0NOT9%2Fv5PCPGmX92BfTPxt%2BM7yD6X8N42vEo2k%2FTv5%2FXgW5UfRRnTJ%2BasuEbQQmlAMJyK8M8GOqUBNSZTpfpFbPNBxz9uENX5E9eeIZ%2BZ4rHOJatQMcwHtSUUo92EwiLtjJttdkDDSU%2FqD1jCYlW16Kf1%2Fdy7gO3KinDclw23pdm8zIHIo%2BhVvUINJt51QFrdiKLVi10%2Bqtvj8lJulHW9mATxVd5OrBFUCaY2PxbWWB9YR5M%2BbxyLpMlkeSGAbxFHQoIuEziQLedp8R5nnQl5KiyUn%2FAdNBxBHMGzUnHk&X-Amz-Signature=ea40e6430a645c4ef43d48b35973dd572526b9767997f276549f6b854f3244f2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=1ee9a40310a2a4df812a5572d58020922968d87ed349987874bf357bdcaee872&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667THWW77L%2F20260507%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260507T040630Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA1Jq61zTgOanl22yTGiGLaCdzDI%2B2nYeRJCIvoh8RwkAiBjCpf5SDHAXWCci3s8qurj1KLrl5TH8lF5pJBDKXMpviqIBAis%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM73NDnBzLBP3wIawbKtwDxMwIf8aR1GeCJDjZXWq0ntz49964Il63xSCvcFpSVgyqdSce5B0m4Cd2461gN6WR6iO9NNPRCClnCRCP4gRDGqCh7yQQ8efqnDVtXvzXUYbJUSMGYGdBY9KO9PDNS2t%2BgFaxmth20jKMQH6TMQLoquMuKqj4qCAsRgrW2hrTNRHBG0qIR9OJ6xiHcG%2Fdd3AmzSSGjFDyQA40Q3mbz2YDEokF8JfwPU8uJwalmpQ4%2BfL8rxl6oP9AuRMfZOQZ8oQfrk7QRhh8dxPVAMGcB3sTY3r%2BR5I4JM7jN0UXHS5zH%2BTAJ3uIERnTT5w0kDqzmZp7CRPCIOjI5EbYDATdgWeoJIsogOnJTHJftqQWVc6Ste3cV018lKSz%2BAj86C%2BnVEvvDgLNdztLqz71UTC%2BmECoo353Qcp%2B8l%2BhVh1SOLl0qQ1lqwvCcw02fI5XgNXy5w2Ff54CpWiiW%2FL6SiKytOujy6bcjBhC1f2YZydcOL%2FeoxOA0QOZEXhwKOosqvKIgSr2ZE8kbfqBkrJsdEKBO1gxZJ2vAYDpMey2btWFHD4%2BR8TYkaxlaYAkVxv%2F9AyuJuPemVbpJAlWleD54vUXs4XLZ2e5QXtM4N2W4LOi0ovg%2FutdmTUVTIRF6vrPGPIw0YrwzwY6pgFSK7ruTXQM44At80tAAeA4cBkgOwVBklqss9Tg7imNNpdowFPvzkcSEgYcx3zhH2I49GDTtvOCz6Xo2BONtGi867%2FSVO8D7ijskGfjz669OcFpPYFQPRQNo3%2BLpLHpObgOx8NryZ1k6nfy4kKYnj7eZRvLCi2Edii47V3p8kOUIaAEPz3hmffp3MCtH%2FPt51ikltpgWSOa5HFI7Wk8BwKTNc7kodML&X-Amz-Signature=9edaf7bdc82796a42acfdd96c89f2b934571a0c18d2162a412f3e0934243f025&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

