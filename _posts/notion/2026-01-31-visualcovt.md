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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=544caf7e47996c8a94a5dc00dd566d4ae5af755865fc6b062e049735bb39ae1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=5a28fa7ca6688d6c2f44b61b41025821341079bac586d803b4053970d1398f92&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=514e3a2010a39b57cb58d8cb42b7839923361af86b92efc61085ff6e6f15e997&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=77b6c12955e0945e5bf2d5f42e064ed2a18baa7fb36b256080fb6568755dbcf4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VN5VAIUV%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031546Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIQDCsnDzoki10cJYk6mqs0gt8inTEkBh7U6ByptfGjqgbwIgXo%2BcX6c62LQ0Nbm2lfgSFkYCn%2FGeSqHyQG0no3UujBYqiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEnNZceGx%2BBDsNhWtSrcA2YqXJtx7DFVQ9gCOJC3CZ6tEVS7siYIX51OBG4aqlwrLf4Qw%2B%2FrBi4xC8ajBC6fbG33%2FufFpaolkEK40OlDOFdxRfmQUkSRmpYzKs04iqImMwscqcGbugJH9cOlSpfAEAiaBinBlBpQk0%2FZwIp8qzViA6uaTMiDcKEIolbB1VBJLjR8qUsAYwBTDA4ZHLydQK4%2BtbqW7237FiaotQmVTu%2B93Wi583eJsa48OtdTgC%2Fu%2F%2Fm9S5SPIi%2FCE1ogwPaHOp4eIjotSKmyNwCqoovBcu0i1jrIW3RKsF9bAt45NBRf4dZho3MkfM%2BTEl6DpeZAeExpv3cLQwCw18GrXtpu0rfus5qmPDz2xHszOQ4%2BtgOIBh5e68x3Nzv%2Fn%2Fov1mfQhgSk49mOzn3PQKXMVeTpat9ZILaH%2FTfJOJ%2BjYJoH09NhqEHHbImBxlxrNeTAqD%2BRIgRbb%2FSflT83sYzMwWjfviIDq7uetON3dfRCPHv9qnclK6WMXK3tjuXgLCKUI4cv477lWAzX3q7811P0aujUOEg%2FrUuTMoDqU3O26LbgDw2w6yEgmzQZvUXcZVrdkUB4gvV63ndUoQCVJaABOS4dEC8fMBu5FkAtih6N94ghc3f7MEgjtlXIZqIB4J5wMNaJ9MwGOqUBNWdn8GJVX5G1OX%2FYuW9uCtZ3yw42yzTg0My9kY1shKpsKUT4M%2FfFvWydxTzKY3xohzURL5ZpXfjxJiTmnkFyXY2jsBr1z6U%2FEtxDBBQAhC3IfzHPdn9jPIATq5qKKrz8pEMcTaB2vPC%2FBge%2BQHSr8%2FHtcF5CIiGWKJWjL%2F4I3HzVKP8D%2B7vMO%2FRO2l9njV9Kp%2BGGqJl%2B8n1UNLQ6weKIeIrz5fIj&X-Amz-Signature=e37ff19217602f46e0702341da2f857a08980e599ae972a148db8c811cad34e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RU4RHLNM%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031559Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJGMEQCIGigDE18Rh8jdv3zwzxDldvfHukUub91ULEWFUROPNyZAiBt4Gx4i5dZ55M8hD6%2Fch6g3963zCtfyPprBuzswOICpCqIBAjr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMfckcfibvWZGJFqbpKtwD%2FwCdoYowM6qcIUm8LnEyxubl0oGai2FLGCZENIRX8%2Fp4Nm3pTFUcmF3eZC3tySpGz2tSlGvxQW%2FJEvfuH1tgfm1De0%2BUDlR59Fpy2rWsRPxBvoU4Keig%2F4mTcaO%2FgmVKzC0lnsrsghDYwhH2t%2F0vM6nMpoRM%2Bh%2F2y0zPy%2BurrfRxLQbf7uUZY7KSKVlxTUb3laldgoSouPLFbJJoMkaNOqb%2BhvXuxJpHCGbruKRpGi40mhADopNrAStql75XkI%2Bc2NQv2qmNMb2g7BPYjM7a8oiu2LaYnCwbGjNEqCOA9LsaZsXd9jxY%2BgL5ZrA06EF88%2F8I8TrVXQvHSXTMBYXKEzWT9uyGVwsvMheqAS7D9TS2LP%2FGtH7CjKY0eVv642vRQ5FoyhU8seSktb7rRBRRM25XpXykRFG%2B0Q5Qnhz3ZfZSHyoz%2F22YrJemC5ZUnCXRy%2FEupETgUjoiWKkFTodzRoWOeYG3myDQeoJ5hb8BcU%2Fs1B6czxVJ42O12XCKCeYP3wVLofXnkMwnZ38zXTOV%2F6SYku5d3SlkJM7NRE049WzK3CnNhSbsgsCOHFt%2BtqBqTE15BDFobZMhWc1PNq0EsmR6bnrof2b0Py%2B1XjDtVIZW2TJwSP8yaWPyFwAwhIr0zAY6pgGkFonZrT3XPZeKPX7vAYAKoEG4hCsJNKqT1IvmUXqMgUYQk8oYvk%2FlEeIuPTlRKKuYe2tTveUo4glWN1diGbaezd%2FafEk0z3nRcVWQyjBCJtbR58Bv7yFHRM6HJ%2FgKw%2BIIxCvJKzve4KPvqXrnjjmM%2B0ohkgHj1GtjFzXDwuHw%2FoEHuECNYiG3G2gmT%2B%2BB199ZErfFeNfbIx1Jos6CNqNB9fF%2BkoUT&X-Amz-Signature=b834ba6c9c123160a6ca8e8d33d292045bece2f60211255b3060dc501207929b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YOKZMT7N%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIQCK2QQKHi8DcEcMPRFR1sjTlOr%2Brr9OJnlywt9qrfpq3wIgcgxa6PlagOlRBbDB9JZY88hENvvfJOUSWdsrGeJZiO8qiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNM%2B6DddiYapcBwQpircA3KWeXC2vsPzVxS0kzIm7nhUp2mSgxsScLc49MXcJIAZoT6sum38JOudnyT%2BGDI7Bk%2FN1L%2BFF0SiAE0ajzwlNqGaBc86BhsmhGAv4pAjUbv46IB8CXRUVGo7uWMzAYv0OpM3nbYO2DGEmog50gEtVRnYPVqjMuFFtW42qai70KRHWs0y%2F0x9f24%2BD0ygv5cVzK%2FdMg%2Btjmy221B7kCiGHb6ZGIg1tClYn6MS2dKHtw2sXy3CwAcaqyUduChNJWEg2COlKMie52Gfoe8xed3x31T1IUhLv4OdVn8uH4wZX8BRUqwRxfw6MX57pJOQAE%2FCdxxZuNLP8wCkOO290hZTqE%2B%2FdsMwuedJMJYFK7yOUV6VE26h3yWx1bvYpjACpfKP1GGuvfx1ZFgK80HOD%2BBuS8x6r%2BosgeUor8rjh6il6YJZXHEloY660w1DkGW5YvIyWMEuFWh6qUVQVeLuCFRrV92PfyHsOM3HKnonfpO8Q1hTypGhvEOQEwN6jj%2BdicDaQAvKVkKQs6g3wTeFPwuDh4Wawx3ngxLJgv3dVSD1ShjfmYfhQEZey0ypz7LqmwOPVmiGFhkuOyJEP%2FvGfvxTM6y%2FW%2B%2BdYUNxwiBpvVnvzgnIkSWK5rSIYu7RBocTMJCI9MwGOqUBidSuqoYEVPdvyTwHOP%2Bmqdvx0PZO8pvJ5wNg7L3zBmNpSslnrX0mp7Ujl6pLRP2gxHfj74VFvdBLjtRVScL86U55q6vPE%2Fx7Ok1OQFjyk417DubBrc5o7O0MWxI%2B00flJZ0srI8Y4TyiuG2fVqI4bYnB%2BEDEn%2FyTOmgtvEIkzkpqG3B2YNVWqZxUCcXFq9ee5OyokSREqiyHBpAYmQHNAaSNDP83&X-Amz-Signature=cca0866beaad2fae83e6563cd9556bd943c2c17127e381a17f81a3f7d883c6a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666BMW3NMR%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031601Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDno6zviPilIJc46Upu37o4%2BvkFYu1pLmRGz%2FpfiKBz8AIhANFcSuuIAj10%2Fs5P1Yxgs80kBNfLbJP7%2BUN%2FhqsiDRlHKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxR7hvXCrJGoIxkJB4q3AN1cNdI%2BmEzNHMaZv63fPcGZn%2B4CCuYtWdxzd74f8SLANmyDCHoPmMkvShgxqej3pE%2BlUWbfF%2BVg9N9iV4jM8x27u759QHAYrZijRJ1jmBtpuf5fUVe6txss%2BffCotBQwv%2BY0IUg5Bvifo0tgil06G8e5JfY6Vnn677q%2BQ84L%2FMUtNGH3NClNHHZ6xAKRW7%2B3UmpoQ3l90nTXCBKu7kn1MlYHxbflc2AmeuxTBQGgQm%2BYww%2BOQajyuAfaNWoanpNI3amYMXf3QOAMdhjptUn7R9jPZKPD0tyXG51KogwUaKhLk9yuDLcMKtjXdygxakebA8rbkALLHEKfcY6sPzpFpWixT%2BrhGD7yY1RZGjiM1dCE5g1KiDDVGGPwvH0vwCBMjcWNNRfDTZtDk0UDtZiBuC2cQvFiziK8mCYXpAaSIlzikOB16evUkwQAKtK4olH1852DsEX%2FD7I9xqOk%2BHOsNGyreoOons%2FkInvDBvLrORAXCVc%2BiJT5BdoV%2BOTkPAQ9DobxJz0vs%2BYs3kEqmTl4rIianHj5bNaW7FjAJNYlq1vhtzgI1tfyFVFzSB6WmLMeB%2BtaFqOGK6rX%2B77JEA3bkk1S0rmMvrw6HS0Qa%2FBA%2FrO228Tb0IU6TWbE2Q9TDuiPTMBjqkAYa0uIcGIQgTQCmAhsuWM6GM%2F9GHuJOIRtDw0DnAU%2FfXpKhOk5PjGx4v64nuJvxQsiFVklyOrFFSY3TFKf42vU9kWLN4LUlvodQoIiwP4IIR2wBBWfiqHCaPDfcRpksGkKMeJEWT8MvDWesRwkLooSLVboMqCpW8RCYVBpu2o9S%2BJNzCJ5sd3tavvvGkzvssMBLk%2Fk%2B3XtYY4wptCqmn7LKZ2hQB&X-Amz-Signature=1bd4c3809e2e4171c7d1b42e5d2e9ce852b7488dab1104a6db4ef9c765183ea5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=1def8e157f317c9c190b3cdc81cc5e5be0af826d2a3d1b0c2aaba3fe1a62ac94&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031533Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=9cb26d3639a288a28047472fd381211ca1fc571b7932969a3f5c04b81d32f337&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VGYNBMWD%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031607Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJGMEQCIBgG6ulaEAU4a5%2FoI%2F6JUQHdYgwOi3tcVLK0dnKnDwRnAiBu3JqiG0mm5TSbF3yakHWtLrRHHBrS8bvg7DzxF1KmxiqIBAjr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMWUjfsGWULH%2BKPt%2BNKtwDNbWl1ofJOjJc3i2%2Bo92KQmA19rpxcUszMXoBQb3KRJ507MF4ZQRsLI7cHoumVQl9kbN0kDE6x9tDhGGAfmR81LrGotLJOw5y3b4AFPCYGXumQneHFB8sbeSk8VYCsGaQV1%2FfVT3U4ghA1Dlb65o9rQRLllKAOas76a%2FU5PR%2F5Y%2FXErqAxz7SQl%2BRMiwjB4t%2BvtnCWcyLPRguT3sikT%2FkVdGYDLKoxB%2FfG%2BEydX3nftBZsIUTT3bT1Yf6P0xkEXlsh8%2BfyzLN6VmdOOeXL%2Ffm%2BWo3m9G7ENbIrmZO9qEnOP8hsijAuEBGLkVO0y3bh64FHPulopZpT54ogXbMRAZ0rnbroupc9fohZmBSXG4y%2Bj0FLRLcOI7byfP5XvE8FxuDmvZ8v04np7LRhgtpBwTaYWKYklWKfBbbqLVJUwyADNPaAQGE0V1gaYSx892gvHFRgsi8C%2F7Bew7rCWzA9xKfDuoYja05gXMcCTskn%2BHxzL0Ds4FF3aS137AsQ%2B349o4uAxCyhPf4LQOqMkMZefVIVysdiF48AtrE6YceNR6kninGeEjJO0zqpe8VxWTRRvOn6Ea9n0IFnIXnefXoBuX%2BnwvL6QBtMGrDu8lohHLekFgGtD6Zf3kEh17ptAUw%2BYj0zAY6pgE709ffqGwu1sLNG3ynHFLJbq3w7PH8FtMr0Vai57cVePgJssqIscwR9l2X2KlWtINgClZaKvYxCgABswAp4LifTV5NOji2pWVTx9Yr45YuAoRvUpms82bDFQU%2FTbgXMD59RDNTrr%2FTRHaelQ3wnouy3Eg54j7ulW%2F13FJ1icXxjoBVQ4GFFgrwnslrXan36boZfEINKILLU9juCUtxONiswgwoFRXV&X-Amz-Signature=f6bfffb607dc9d12189cde4a9a745270db7dea88cfda3ab027452d2e311b4076&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031534Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=6b459a649d95fdd58a03e6b06fb1a51535ffff1de5a12dc43e525d8963aa786d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46626VWDFZF%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031609Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQD9DAQGx3rwGVeRMtT91z%2FA90QZwJByvHNxiJy49agVQQIhALAF%2BTzt0MaDwzN%2FUvm8m57oDkEz3sJG8KSYGEfFn43uKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxAhUJCpiKfgW6CWfMq3ANpAAznAxQ%2FOGoWo8BLM%2F3Gh6wX7C6Bwuazd2wvqkaWfKuMNBbn17Q8q%2FkeW7Ba791i%2Fdf3fhkTztAKtYQWtPpPCMBeAKbcBqMiWj8kuvADbTCf44dCaA43puHT9iK%2FL8uivkXl5n8hRN5ngRD91OnK5Q4Cjj0ZYXa4CUjxBX47t3CEKavQvDqNPUOT9tUudVnvs%2BRIJZUqdpZPO0Xmwv%2F8qpFIg%2FNE2dwJFhXwr2%2BatYbwgeMnVkNifOzgtO7rlknq56m5JjCrjgo%2BjTTgPpI93zabZjUF9b2bL67PZn3BbTfz4TdwbjmQzIoe5ImwnHOPh%2FUpMpFKPxWsTeNi2QyjC4ql3q2dQa61SIf4Ee9WPPDfLG9Jf%2F7UzGib%2Bg976qv2kzXQQg71PHl5Trq8CRXmaDdYo0p8ywbP8Nl3%2FNE2oQrIMmol25vO%2BkO95cCiEBnAJ088IpNMcDJxOACY%2BP8pSU4l4SVmB4lJR4fu%2B1t4LLFXIO7rCPfaKIWklZgMq9KwCj5toj9K2iMAGVsMhc%2FLvsp%2FR50wshbXuqPk%2F9%2BEPLTBzzjPsyvxYzj6xHcE2%2B7UoJ9xvRFm2if%2FNAKFpTZD%2BsVETd8JdxAf6igJRYW3n8s1UQAGTJsAYhVDkzCWiPTMBjqkAeRcuZr9wuHlHiBJ0b4euHQ3lciG%2FM279DdquOwfG9kZrUvUw1RdB9mH0yzCYd3JGbP2KhwL3Chtvopuo1ecQ%2BHHi%2B5APZIVj2WUxPscu1LPX1UBIWddAN%2FvpKx4Jc6TMKylQ0lNbfb%2FSfGZctXXSuA9k9W4iP2LlNOnQXquzWzwqbuDsvG9S3m1nxvoDP5iVaskFDtZe%2B%2BTxhfjDbTQ7yF9oVzp&X-Amz-Signature=aa2c7f27a5b22d7295449d3ce3d05b8a3329b6159e0eaa4848ff5e5b14775fd0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666N7CXAWZ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDVHVweP9SJ%2BiM%2BpdmHSzQpH%2FT9G9AlPIekiHEjNYoI0gIhAORp%2F7T%2FirXmSVnxS8lyfkLadONRBl25wi64yFxiACmVKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igz%2FLaobPeGqcPGnk3sq3AMI0D%2B%2Bazv8xiC1YZP7dV1tO8ZI46TXrIJeeGG2%2BC0JDG5EfBSrLd2S1B1BG3xkkVJ60kWg6wuD4k57lsev5z21XBE1PIx2NsMb8rhoDvFZtnbXvJtFrKxOEQEmcneUfDTkE5VsZJZBqKdT9xTmqOdw2%2FUMGT2OxuYZ47ck0slP1wbvwFJ7qZIbu7IEEzGPg98wGaDI%2FHj1duoOXS0EiSYHpC5nYKu2o1UhVyyWiKL%2FJXfeg%2BflEmeopOIF%2B4Vf01aT2%2FhAUAO0pCKTV1lB%2Bz1x38Bqf1f%2BrCsalPLBK6uHZBMzj9NNRjDXmpaDfO%2BdqbpnLz%2FtAbA2B4fjAdMq%2FR64twhLg6eqwpgfVGoEW8z5HU%2BAzfFLxIBz%2BaqtLddELoT%2FPRPg81FvXVRH5tMDF7yfK8HLh8Y38RkKkI%2FXU6QYbjeIuXwZUIynKyezxgQqdqU4vGogrSzzuOmxcaoNhSjHK%2B4xVssXR7vEapWdyejqCfvBFiCvTf1I2Eds%2FYwAv4brpUANFPpD2TM7GTWOdYf8LOOmnBS6AwIwbbodw7Fay%2FGF5kf%2BdNNfpMnTi6wMCHr43DaVT47XNEQScri21RO6CLtEgZORkY6J2OsG%2BG%2BpH3%2FTiX7QrwJgSyIdODDniPTMBjqkAaihMM6C6Il9luihk%2BDkJ%2FpRSz5qKOKDCRWmUcHv7yvoKxnRiDX9omo22qNhUPGhtoTfcxhl1%2BqDMRXq4tSu%2Bgr4aGZMuYZkfxT6SSVzbmzaGAlIcHfO8VP2KfKUNc6y%2FPpcak4Su371jEPiLN%2FxiY0sNYx0QeiWjdjaMHGPuDot3WH%2FknuC%2FfUYm2o2bKdpXKFPtoIp%2BYyyDS7DtixmD%2FpsSXCM&X-Amz-Signature=1ded766f0b9589bdd7df6b9c2848ad61a058926d88c40a12d5579cfe254a48b7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662YUZQJ7P%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIQCpxJhq5JnAs0Mb1e3YPcA8opYO%2BPgcrR5sWRLXmPRkVQIgbm014swFz0XcY8cuagumuzhEmRZksgTb7Of6UwLiKSMqiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDPH%2Fxf%2FGHH3mQ1vpmyrcAziRNnTff%2B4lwyzr1HTfWhSF29x1MVeIlCNxM%2FbqDBkxwnLwLa8Oj%2FkJJjxKGQSZiQIGn7u8VVjoVFjRdqZkV5XwgYwyLcugvnWPx23%2B%2FkiamvXqXywGZUzR5dxwqSLmLJZVsU3pESB2grd0EiotIJ%2FZ4Ms0TYcwOfcO66u8UzqyefexBGkjvtcujK8hH07Yg7kHhxH1ApN10CDH8MGuJzn3sbWmGBLY2CGYzTH%2B56xDSvBWcSjKHzBb2IEl9yFKBsQDLovXO4ltu%2FX3J%2FBNs45ZadVsx06MJbfM%2FaAAzKEQHNBpEqWGQ9nR9Rr3YwTPz3Naq2SPW88J%2BGvf9o0hi%2FlyO4e5aZBjfR8WSmaBxzX1OjgwFX388Wxn5UMt70HvrZuylgY5WV2fkoC2W8rilVIKnUpABRSbhcMkt0WXnCmAitdvgl14KK6aHet74uR7yDAppsDkSjwsJLZWmyE2Y%2BkE2rOu6VQ%2BpI6LnHAU%2BpRkJrAcLYD4c6SP0%2Fobqf9UGpgX3pHu3h7s%2BMKOkAm9A9ezls3AtV8o%2BZQfSqsKlpYCJpFT0bDJiwfjLu2Gs6we4OapgRTEYynINTliB83CJDCAJtvez2LzX3ZRd1r%2FglxkF95h%2FyRqRTjMmEBEMOKI9MwGOqUBRF4NqURvpgHaPX1faB1%2BmCA2htrjHu4JYRTqtaklaCAdipVGRVoAJWShT9LN5rB%2FmIsH7N1UgDb5HCiSM42QOWhg%2BnGvRyu%2B2t3MMRkovUxaC7w3Q24I9cGblrz5ensf1Wu2xb4KG%2FG2nmVFnPTNw9vtbp9uLhRpd5n%2BG%2Ft3Ww0mVKv%2FspEwsF9fV8J147KA1HGSl8x4BjgtW2nK6PlxikJzzzeu&X-Amz-Signature=d048e61942654a32be9acdb89de44b45caf0aad28afeb81609ea7b65251bd9a6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YRYIAQIJ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031610Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJHMEUCIQCnbm10gOuYlmwzcqGzze0TCTOYkFvTMgwlFXa9mvQanAIgHCPCm%2BFv1mbP89NnxJ3zWzkqNOuiumKFjR4wjCjWxcYqiAQI6%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDP9XjLsImMLkSIz2jCrcA39hhEm8hKnYqFdVDkD2vONcid9V%2FtRy6QusUkHHPmoz8BA8YfLceH2%2FYFFJOQr4qL7hb3xbyAh6RPGwQcPc2Axy7LL2HCFswuF2EYdY410Jv87lsaqhKbYLt3TojQRp8VCC%2FeSLPUNlx%2Ffwec1TaKuTKytD%2FeXDDXRHbxG%2Btv3TFaxtJ0iDMuPl6DaZVnwUSVGYerZbyymU2X0TrPqN4E%2F6c3Ey9vr23stdPj79fHXTWKlOw1x4MO7QYGkwPXZUrlhVqvCNW4vBc8l0K89NkVJEwI3jkAf50rPDn82CryRWXPzCdkCHohhuwng1LgTzEKEvcV7RqCdgomacHJQBk81zUyysX4AXIN8imt9kVrF1BBOTGdPDp1Kzx4xO1%2BBC5AgarApt6pCnxU%2FOPaX7efoVsWYaVT7SGsDNHJz7RZMAp32QBXqLXQjBYqX2K8NWZkBfod7sWbq8fgr%2FNyQ9oGuiX0uIoth%2F1t2VSZ1acIYoUZTvKI53LQOFM89helkrpv7XABsbvEcsLzUwMHKrixgZryAr2eSgwp%2FX%2FNrXGmdmEaQB0qWo7hNPIh4aDTyzLWOj3Knw%2BxXcVWiFCgSjVd89%2FWQioZMojhbuQmerOcI1fkYdov%2B2csQ9E9VhMOSI9MwGOqUB1QDPH3KI0C08prmP3bAxHg1U80GFUkR9QJ9gzqgJ5SnMOJJ81EDFUO%2FYB2qOy9oqLx0%2FVTXO114iKQitdpf7JIhpYFap5i47iQf3k3W6MYeeYWR6F4a%2F1%2Bjv83qVXFSZo9rLVeANSmdHsytTOqBP09KySmVixHOmQLKd9kV77CMTzLMIV5KH6jm4ZVjLbYhEwxvgF%2FoY%2FtYs5dnW6VNZ%2BK8NJJhi&X-Amz-Signature=cbb08768689253ccad6c9ffb2db81d9d29f69422bcf9e83d2a478f76fb519ddc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031534Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=5bc7366d480dae1c7e547f5cef38fe3a80037e431709ff58a7c5d23ce91abd47&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466T4U2ZTZQ%2F20260224%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260224T031534Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECIaCXVzLXdlc3QtMiJIMEYCIQDzyj0yRlch3uv0EF2IQogyLXRGha%2BS7qIsU1QdCf%2FdnAIhAJphvX71WX5vbZHkvsQPXiOz2yTqzIYWK%2FgA%2FHIXJeMJKogECOv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzEGXev4NoB3nWAqMYq3AMRM2CY5ykeCs%2BwyXq9B3ZC68p6tFkVkQvHQfDC2aheU8B8vT4wE4YP04QRz46zZIrxzGZy%2Fn%2BMHC9JNR9yv%2B6eTp7pNAvioev%2BRDsCWXHS85uwN5wJFwCmPgfI8caHyNASi2ec4K9lNvjBcFdaAA%2BHpJStuZwR6szggAcXi4PgXfzU%2BqfYIJyRdl38%2F5nrqxNZ2FS1hIe2EVVQNaWrcF9yx8zXHFxFvPSN4LxiBHniAENR4KCKBhwTXs92hVaaAidBGoLAYg%2FfDSekmdYq%2BBi%2FQfbu9Z63sonVNQgo%2BhNwQVyDXPZEncalRjohIj4SWU1iW0eP5vxlrawNiGNQP9%2BcD%2Bxo0a%2FPZkC0dPQUbt0%2BLQuEImyBMbzvhDBnagndiNSKxBoyKb3BIhx%2FMtDbDI7BwD57eWLzdIzcUByloucKnnbfvZQUA5jthamG0boR7z2su4RPXONtaR%2B7DLkwllgOy3Ijr64i%2BekoAbbcueO2E54cKEwX3ERfcVlpq%2B02JYITeW0l7VbTNBMG4%2FXfoS7oHT6Jb8q2EmllOTM4ZHtUEaksCdNxCy5yFfP73BOYaAxsNqbSUubGXlKUWdEjt%2FkdQpD2D4AoVNaH1lF%2FmGwvLKn%2BAZi%2BzFtIzPZIPTDrh%2FTMBjqkAcr4vKoVNaiYc91nKqp2ZQdamcBi0Tnh%2F3you6BogBQxSpdacxjcrJW4IDm%2FNLRmPh6GqyeDHsQMCIp1dHm2%2BZjlUdNcO5vPo8xUmup%2BAEmF57Bun0cojJiuQcl09F24%2BWPuZ64UBPqI4RU0dkUAgssu04XbJgWMAbNTwSavnv8bC%2Ff8u7JNFmsV%2Bd7hwAyFuprk83Q%2BLW6VrD2EaIeHCPyvfwsg&X-Amz-Signature=f0b28deebb1e498c14e6b66d40f23d31b9fbff730c5f81352863850d85907b21&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

