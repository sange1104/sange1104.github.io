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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=faa157c0423a66f86dbb7c75e11a587250b571e98d44e6a127f076ddedeaaa2f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=e2bfca0f96c0bdaa54102404becd4c465135bfb37f9b1202a583888487528e65&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=e15c2f7a7a228b5723b880e2bc6d1e9db08f32481cd108a678871edb04c15f4a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=be4be430b413195b56d8c684d0c1b1317af070dae879024fb0cbeab5235ffca8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YUUX7RAP%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044000Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDlfgHIk%2BeeZsJKvCAhQIobZtYH%2FS3Ew5SnHVLepznuYAiASJO0I2J8j%2B8JWcEEorrutpKDvJuMhnhjFbqZvB81DYiqIBAim%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMEJ6TEYkpqNcV4Tr%2BKtwDRIsoDMxRqM9Vp%2BngfSrTYwjNKuo6z8AKkHfbvx6bLHM7j8LPhiARgEtK1zkWhWqEi6RkSHJEGGA%2BZv7XpPjXhV9cT3lTByk7Jw1%2BIDkBRuxYM5cbbdAoCNH4Iv4vkmmhRvq7n9625u%2BfeNx8ER4MiuVuoa76icWsa3MBKBuy1J%2FJQiBGsTagXzw%2FQHL1cLYmRA52c8H%2Fqe0ELKbT2e2D8KJdfKStntLSeAuXX0E4S6f9N7vuKLqQe34%2FbWykbwFqwJx9lmkVKckiP%2BmKRhQUFbir4bc0D0h9lc7uE%2FfjPwElwIId5WHdXvxlhHFOStVxDAYE1vY5x71srN0FlUvQl%2BnPaqQjvEyVYPE9QSG%2FNIGlJCm4GQjGBLZVNONKP7fO8sHlAQdqVzuuxi7jQNEYiFdZXv5PmU6yu%2Fwt7VgeVCIcdYSXJIXvE4TJjvYmmnUu6wQv20m%2Fa27kjdlm9DR8pbGPNKrVJsFYuXqJjoI%2F4VxuM3PXTnMBr%2Fr%2Fntv%2FO3jI3xkpXFWD44NCYqBSGvM5e4mSvoi4r0FQT1sPN7YZ4lXEjwkXQUlFre2UyxhPrwS84%2FsZxVqPaDupty9jxoJ66VE3c8yWWZs81VfcUQGTKXwVLiLPfZmcnsMY3ykwyIzf0AY6pgGcIPB6lGYMBAN3IVkZrpg0Pv9X7UL9UHSDQjCQDy6STWlPmogIyiCISeCtPxpkMhh8n%2F9F%2BecciJwl7MWNBC97lrHBZOfa4hITN%2FjV%2BLr0%2BHK0aHgEpkI6CbBoAHI72Um383WORVzNJ5rGGTfLquh3%2Fr2X4f%2BHupRcLdxIZZAHJvAryQ2d%2FzeFjkXq%2BY80kheA8u8GPrFIZ8Mc7e0GsLFf5uLUcda6&X-Amz-Signature=4660173903d012425571f0bb2255478b0d0570314f75c575c5dc465c795eecc7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RMVIVPTW%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044005Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHSPn%2Btbpyq3KLL7BZBgnG79VJuU4OhXCE17K5%2FiZPMbAiBoC%2Fzo368LgrIGO1NbFJIrKsfXp1FmuJ9bPxEwpangKyqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMGfearfMyE5JDCHLKKtwD%2ByPo%2FEjpy3WlTZK9wLQ%2FAMXTRx5blqCBJuMI1ESkZRux8vIfuDoshmgN4VRPIcuyHUgWTecRbCsn9SiLbfQRfrzD3Eg8i1G54WvwIosgzku5vsLLqIuKKeqHDJUa1QjIXwvv0ulO1SSY25SYB0o5xryTKv6AEyV9qOF53Ot5V86KLL9x%2BkGF8PJdDkJShBcPPto9TYFXF9hBQW7EDE1YohFwEYPRHTF0ShqWc0XieEQZtQG5WoJNnRKGc6WGpvisYvzgQKwi3XacWLDBm4D74j%2BgjITKvfc5V5wDoD9kTLLtsSLHy2HNpuYwcgGrCkTRnXnp0vakUTjZWenwknaZ3nJ2qnpEcVRFkmJvB0fCNmOMC4swLY8OVCLmhoZijoCohQfYF7JqCXMzkNM5Hn2wgPRSbVD9FOvX7rwMJVxvUE0%2FKx7L3IYLu44r2kprJ%2FblqLDnwJyWI1NgBUDZ%2FErtcm5EaBBKzCP9py3Q57nZtQ1%2BPXmxgCcJxtQIz3OUpO7h36wcxYlFVwFDgcp%2F7PF8eT%2Bz8NYqHYS68Vmty0rehPGlJz8it4WHfHD42oylav0aDDQGM6k2sGpIRi4z%2Bddb1gFDJk4mPazMGIPsaVeRfLKEJZ3dDiNDFwjk860wleTe0AY6pgFOqGMn8Xr0qVzcL1gpbWES8EJi5KEYUfAKUuA8hlnQiadSQ5CpmRybT895%2Bg%2ByUDZTNlnr%2BZfolyVy9YVziyxhQ1KLXF50a%2FTuuSFY0mu0gqr2vvLwoSLalVtF4KCNiU8N7cI86Ot0JPBBlgy6%2BmaB76sZTbRO4pJebc2xSEAcC823fIEMY077%2BmdNgWtBlHGr3ngWOa3Hj82naGCuagmSw1ua6GW8&X-Amz-Signature=33727a55848fe2ae4c60d35529eff5e8e6ecb06911a470ea4536a8ee3195d688&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665MLHDHMA%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044006Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIDOLa10PY9t47W3UIO0S0Hi0WWAlfU35i9Ge%2BicPIj4%2BAiEA%2BJvxZiR5wHZdx4NBNfVOirCVIMsufzX3un2tSKQlWGEqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDFMsnzrxQ9xDQ841CCrcAy5FKQTxQSzgcMg%2Fip4xcz%2F766X5MnUT5FuLRM4tzG1gIE5OnvyoNzlJXGTj4gq0Er%2FjfAbxGrsizvw0pyicn1Oq5%2FTjhXexieP8Y7%2BZy1Dy5%2BCbupWqm%2BN0YxU7HOskUB0hS9kYZj7iYYckM3jo5syKYl4ovMs4T9kpyMFhAK7Rh4CMOvfhfou%2F1vgemL2l3Y1KY21Gpd8NxJeUECstpQ2Ik0qoIeLRqjZeKfLbozYGvdK270XtyCVBouL8ZaNDM64VvOsiZZKEGYu9PoudwcoV4xdQmBBGkXmKApWec%2FA2XIDzUjOjnglI7WU0VpJtOFUDEik3mkutVc1AgmiwfD94Mj3cUgsa4uNRTjkgmAv125HfY0bEc24pnYOqLvWslJMxygRclyR4NftLi%2BHdiZKHwHGZ0H4pKPJ5PUYZ6y%2BCTT7ymDhe%2Fv2jsrBa64IddlggIS6pdCGmrB8%2BNVeW2HnaTxxDFd1iY9NAJO8s0jX9KtpepZ2e5%2Br9c8es9Fg%2FR2g2wdzrFfZAHEt946v4DolIr5oArxgr3fvGY5pV97KPK9OnNjFm%2BevJV%2BVk%2Fwm7SjdCWO3FBZ44itP3v1Ge6FHSmI7D1J5w4ALYHwaCVQKHlTooYedRMtad78KdMJjk3tAGOqUBiNOSpwKYeOb4ZrHEDcr9M0A8tyS%2BWkOzIy7LzjjmuIBhgJvydSYy7JhX5NIf57ectCPXqt2pJZn4W6omSuqSJ8mDAyxlsA4WEoboV63P8G%2B9dMTEl%2BkL%2F2FUNE2mfvOsoW0Cde2TAC1Ub%2BI0Ns23wwCX%2FOfZ%2F5ZiZqXvnigyKyO9LQ2lQGMGbpVyYHxs22k1iB80mz57uBpyWFbDCYi%2BvtkABq6P&X-Amz-Signature=2ccd586ff39a7645e06a440200f136ba84fa07abdda608ff3d67df460e43da0c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QFHKWRWW%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044006Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIHGrVamqM5vRcZNyo5zj6cNsEsX%2B2uTvLdp8ihrFrJljAiBGmV21dE%2BkGXQuCWRf20yU7p%2FQARYEAA2jLMUZXXqFQCqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMF80CQf3y3XBNMlxqKtwDtSk7gRTfb3nns4T3w6UzQMjPuY3J1xvBuBpbIjkxVhvtqaEMoSFVqhW%2BviA%2B%2FHMB3yoKOkEBMmRDjslewoxn7N66L%2B5BQgJdcq5hrc9Ir3Fgqm3k%2FBzkuBCkAcR%2FABxKL3iP2aj1cjQDY7Zb4HAagAw60yrY4UGeY9N2aY6yERVfH%2BkIBO1Vz%2FjdAWSo4078lnBj8A0yPZpAiULXzlnajmTkiYg2LFjnzcsSKCzJZGiDZPevCQG8wBMIfcL57OOGZ65MelWGns2XwjXIPit21XJWWgmgFv1vCSKH%2FcYsX8rEDf5PZvnr6hAAukkz5wGuKDo1lFlMC75iB1UpIQSlBm%2Fp82qRn2e1i%2Fmt%2BPveDLFvpfynQJ%2FYKIkUPbsr9fJe93uBMRqBDLdfAPBmZImb87sDptJb9%2BeaGv54NXYIWzA%2B3Z%2F4jArlbv41F4RQZIaWWCCO6w8ntFaxtRfXlOUgx9y4eIrNX4yf8GfVCwufCnDBNmcYtua1DPtYmoCXnc5s5dzU0nB3NC3La%2F8yTBOju6WAKqGHcXZeGekZ6zlgAysn4kRoUg794Vfq0W%2Fw5soyzaMZrGurL4LUJIzMaI3601IpRwyrBq0k5hPg8UI6QL5tSn%2B4idEj8MUaNWgwoOfe0AY6pgHeg%2FUvJJce9HXxCj%2FmYpbfxcKP3epfiVmIomICLpFT%2Bgbk0E4YLVt8GlxzJAAd9ffxxXNdkth4Fbs%2FDsAS6FaQojUUs3DRvkBE9eE5gDvg9XwBnRfS5T%2By%2FEA7tqYlKWbItQXUDkpr%2F%2FydiVNxFadljhhGM6GG%2FooHpJqLcEDpv2ObtNXeM1tE%2BbDs8J0SjFfSaSCy6KPteegI%2FMm1x0p2Q6sWG6bU&X-Amz-Signature=602c117c0ef639e57af182324d846c0185a3825f3b6c12b490e1007d40f04559&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=cf24b7f75265b6bd9918fe604dae05ac4504e1d739abd5c417ef7bcc6f206ddc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=8e4b34d28b2cb6aff98d41ec872d6d976d17314fd4b3b9d0ea2a34e2ba5598ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QET4MSW7%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044010Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDkfJqK6Em73qyyllonT58bBAn3Vxd%2F8wh0F41qGvpr%2BQIhAMN32Dl%2FyV%2B5blGHvYQiHJjKzEQjnyEHHouflYIwzzVxKogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igy7Nush4XJivd993SYq3AP7YAbOeFj2%2FouWHJuSaXp7C14buDwL2Q%2FFs7Z0cmEfSF7w2gYiuTzWUNUIpATlDB9b6Xb6OCdiRTugtVx1BIZNQSVD885lmrIUQj%2BHJN%2FxzH%2FexsNVLle4N1IyD%2FuYdNnvCg%2Bbo9%2F7IcRPk6e%2FniQPLjoBBAx7fIUck4O0uNZHu3qYXOUTENbDk0dLKSIFDx8TQ63VYIIlkNY9Gi7GizQEBng3ZGp4FHSsazhoVS42mgEH2o19KH5mxDxqG%2BjKTe%2FyqpC6hOiubuuBLN2HlzfFc27Fe3zgmkl3cT8caxE6KVxD%2BDvWchOfaMcgAWVUH%2BzleSfF7gNGHOQIGgsSg9EBQJJC9gOLM9I4o%2BHFNMjc5avXNDtr4qZLKuY3HA7xa2aFvtFXzCkHIF7dm85eoQRgnKao1EDkWQEDgiYm7J5eUFkfPCB9aQb8IRUEQ8uK3Pg2dzAFEoe%2Fxz6Rpct8T1iCegH%2Fwf3WrliERRcCBSMMdM%2FPN2MPRqqvLyFytljKxlFSF8PXaT8RrD7XYZr3rSnrHMVd%2FIN5qrwYZ94g3eYX02%2FYR4TJ5Op6Fd7ofoe3Hv6Ej%2BKkXRbmkwk%2BZelz85Q1ylesLt5%2BPBnv5FlQR3ADJBGk%2BtK9z3EMPgxtjTCzjN%2FQBjqkAaohCakHFxGjxFTCLMtJI4yRCQO4R3etKz2bacbDYqvTqLennkKTmHpV7Wzny5zlgswrQEj4qP13rbDuOJjxi0ZP5j4zbisMZ4gKarQhNbKFd1RXHCeaol%2FoNcbRckwbt5jZHYz77vdArVtSTyPUf5%2FrVZ298YltZtlZPPMAldC3bG4autN45B13k2u7Smk%2B1S050BsALPBiTxWeKsR6vIs2hC7g&X-Amz-Signature=6a5b1cff3b5fe10b69a8286f118e0c82a12eec0dae6e5e55b438ef38107e5774&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=b6d0e83202c2185240a294e44a3759bcc3a89fe1ecaa10538b7ab8809950e15e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662R46UM7H%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044010Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCk%2BHlsJsvJ9n%2F%2F3JuEoDPV4MvBv3qA%2FUHpaHP5IBP6iQIhAMKHi8%2BDiTevdGglwktAfzDyNZ9lJIKmHaJKXl48fiLzKogECKb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzslmOw4DZeSXXmPw8q3AOzWCZFJ0P4GOdOZxB9Sm619pixmGznFzecJOjf3IWhnV3E6DvFxQxV3T7WD4WPxZLWQK6zy8gz%2BY%2B%2FtPeomuxXAj1iGnMhOp5IUsVZ%2FwKxmGFJT%2BmSE32n04XOq2cj888h0hK0YKDrMS0o%2BERYCZMnS%2BfF7TQ5V7LgzuIp7bcn58mpzkVzAWNM89Z%2BX9B0ddX68G9R10P9tGGsVKTwcbigtmO03Vnx0KV7Zi6vfcRorLDvwIGFBERWAuiNOv%2BeQKfUm4i8VXA3gv5brcHq81SmhysZMfmFfspuBPxh%2BaFtP0UmqMiKeLk6BNL3SHzy4nQyTUsjxrFQb5w44sCTXQfaIi1IIPYeovZEk7XEwVAfc1fw%2Fur2dKwSBw2OKXz5RvD1DodL4n3uTKe7yb%2Bt4XbMOsgupYRuXlCYqjiSF8Lqbo2C1FsOfjXvh6sH5jzbtDe%2BQNZKdYM393zPYHPia4xz%2B%2Bwd%2FpTMex8GiTow1QA2gLlt116SZs%2BQm80DSFuASj4M%2B2nc1Pw5wiLbjIrgFK2DrSYjlxoQsZ838%2BtJ5mX38iuBTysC1Tq%2BS1LhWPY5apXaXhmMTYxjE%2B%2F%2BPP5%2Bp86HtjkBD8EWBhBJZZ0bXbU93xiPl%2Bj7E6PBzyFuVjDQjd%2FQBjqkAU9Qn6Q8IAw0eOMJJe4YoaKGoIFyqY9lXUhfT9m7uWSZ9cXJwAfow0k7MH9ZqeKeDyQXzGYH9rLSRVhNp9ODVUeLuK8zPnI3mHtol18yC4lRdr5NClEqOThwLio8g0NsQtl3ay9lTpCjkFgX%2F7Ey15Nl3spnRBTR%2FANx1Tu%2BhMiZ6rKqULM5mDLHEvx7a0keig4MAkzhVAQUCIcUHSuib7cc7Tbn&X-Amz-Signature=a0331e12d96be9b2f3c3ac0e20212e8f8b804a1aa2cecd0cb110ce23d79a6172&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TW7GUHLI%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044011Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCjhCzC2h30pCmwPz2X7uatYAil%2Bc4pyFYH5iJFI1TRBAIhAMHNio%2FMp9lb7Atcl0SPVgat8zTEQ62E776ImqipjLHFKogECKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgwOr3LkP%2FrBDjIIoXgq3AMAiCE5W9kB1YfwdapXPN7oTanIKil45JtQDR7q20s20E%2B4Lb%2FepX8xd8cnRmnqrJDzGcMq6FR1dbzOksgt9tTjOTTDzARXxrrKkQynyAQDMeZ2A2OJN9SZeLQcmfCP9beMBSsi52eiYn4I39UVVDQMd5UhrHZnjZN6oSPpIIijOaVs0vwu6NzFXcWkZ%2BHEmWmcjfl4RqKrw04sa7auNoi0lWMoV2ewRNh%2F2ky3KgUhqDjivalBEiLWBLSuj20VF78vIzIH%2BJhGIm2zGKGZ3FplLILOAWsIBK4WJ0FVod6M%2BN8BK83Q00KY46mAhrr2GTPRneYUKTLOsyuqTF3fNRmLKs7%2FVyHSb09Edb9IJZ1OJkXuVLpc49FXbP8LgoB1xbU5QorRMXfFtsh7bhsTmti9wsagkeUKRN%2BHKjvL0keFyZnQQ2cXWEyzjLq4iqtYs%2B21yqzGMa1p0L4xsGHM1pNKG9F8LHv43tcbTKpb2%2Ba2FJD%2FvM0vpits%2BaRWpEvVULtRvuihdRP9dYPFImRUlevNbgUwL9SWWA4%2B6Emy%2BtiL478%2BRX%2FILz5%2BwAzBn%2BRuPM7R7W87rSvURtZKiu1o5kP8%2Fpvb%2FL9GPnuGjxbXlJTLZQv1%2FGKqObSkjgm3zDDW5t7QBjqkAcH41LUfmz%2BWY8enY8ioIYVXQYIti%2FQwOi72TD2nmAZ35UJu9rXJihzUUNBbZnB91b6PduC2hYuxj3nAdba%2BaHw2hsI6xppzhfpvxSI9ksU2AtTqK1OpGzf%2By9I1qz9i98x4HW%2FP2SxdqLiKuApI9jPSxse1zXNv6aLG1aEYVFpV2zYH4gol68tHwgPA7N16QzPtb91W3UUlyfxiPqKhsOhNjV6c&X-Amz-Signature=a0b79687129a28951132266f4643a9cfa66eed1633af5657d384a94cfc0ee3c2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662HZLYMSD%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044011Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEN3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD4Sxni1t3PfS9a4Q3ui399hD5N8YnhATA0OmEZ98RZGgIgE%2B5167C0k4mm4zRl2uL1FHZIgrpNfJraVqkAuAxvahMqiAQIpv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNM00TnPcYPvESy2WircAyt0QiFmDupRzd1CUeK5lTfteEhVZfAjQ7USyOL7XgpMjEG0UfDQhybTiAHZCXZiW2scKTkRi38rze2eJYv9u4BI2EdZROcXT5d7SmE47PqVLbeIngOwTz2JdcAbILLKmZGuKmtN8ltK0og7yk%2FvVf5WRUL83W21wPVj6c9MIwFqUCBFUife4ony1S6GXpeVUBvd0htcQ1ZuMB0UrfyoSRrushd%2F9OqW90kO0d6UEhw24lQ833A4iBCwkHhTuCpnOAi6vo8Heqk5ie%2Fii3wQK8V5A4n0UV9qvT%2Fdho8FU72O7K7D%2BgAxvskn9krZMUaDQe%2BgmTAHYDROY%2FY5kOSn6oDtzEzilUcQvpGo57LADpCA7Y2pfpTzmJekoJKUgRzuuVCcKwWv0YRZchsFpWHHg9zcSQ3ymX8DcecmtSxmAfxMm11eQU01PSivXHW8oDLP4CsKsyPhDotHBVGNWBeN9AK58aXKFtKGaelMPYsQCoUQ46EF2AMmnGjdoP8PtcC0yp0sBdANHNRKe0GErt2uZmjYfaw2Ua7FP72yM22Fj3tsNGeXP57Z5VzIRs9F4Dm%2FuS7lQzay6vOQfUVPhx4iiqUE2yoJkasUU%2BGRAKLaZhEQFHWt2A0dZ4Qz%2B0YRMIGN39AGOqUBdIEQrrmQUnfBnIqiuc2Pj4Fa%2FsEXIWSMFjfLwcslISP%2FcQhZ4%2BG7uin5c5IkFYtExyJ2YNs0oHrsqcoGLq%2BiPQfqhQXcJ8jUbhAtUcfKYiN6K%2FhwyJzlBYj5A%2FQdoiE3AUhFH1ZgJBwVARrO3%2FhZuh3BswdzWiyH9qZD7kMcIWlmeFp%2BUBh2jFBpa2sUGC1pBYdLp5Mozf%2B%2B36VC1OovjYD%2FDeeH&X-Amz-Signature=881d2b62e4a50c6bb99f74b6fc8b99cca3c3dc28a6abd25b40a6d3ef0b725b6f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466W6QLCD7B%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T044011Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIA6ygG6jLmzdfCiz9iRSBh58k4Of%2Bc23YZyPoYo85xKlAiBhHeHV682XhdwM57kGy2XrS1mJODwji4jlP280K7NityqIBAik%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMwECRr4JHt192NIGNKtwDcYw8IMKb9h%2FvOn%2FeVdrU%2FP8hxo1v3FDfZ4qnzVE6WNPR2AnOxvxj2APGZ2yRMrNkwJjZ4wcjkuiI4ARi0%2BFZmi1G4%2FmMelTEQQ2neDGig1aQo9ak3tVX4yCyW%2FJjGCq2rQxM6VdtBSXHJ1HEvHyk9Bb7nYY3NTJXSqho%2BlnGmyjCD0qdSYi9eMOJ0pE04uii0knQ2hPHKFgtBTv0PF68PitPdCax2XCpe1xJG9PZMa9MFsUx7nBJJZ0nkKAhLAyfFamnq1mAT%2BUxjQGJW6c8Xuf%2BNiDgtEsCq38XYi7X5ZttE%2FIyLGHL1dy2x41U7gUyHnmBQg4i%2B1zTzyX83drJQySC%2Frn1VBk%2BuIbwKoh4BFwFm4byOHEhr1n6Up15ir%2BqKkhrlMtwxyXgJAYU%2FhZ1LSmkOlneywUmEzuWdh5qaV9a8a%2Fbnxv5w4f2oXjIzyolac%2FUMdWMlWKeNjkwu2M01jdY4g83%2FP1UE3NtT3%2BmqpEffCLZA1HR%2FlgS6F%2B7cugzLnd1GYeex3Hp9ZMTkI3VgQMl%2FZhShiIepWVy41RJIZt6cqXVcO2PFj8Dub%2Bip8aM6%2FiAmUq0iVbQ%2BgkzfYnkg%2B7rLVVB%2BkNml6DUH1MPdx4DSoNseZE%2FXeoIaxcw7eXe0AY6pgFHy0GQziBXYFxXPus6YODf8T9Wj1pWZzpW7opD8A0XSApkBH6xAoiaI1lEecmCNwi1QQ9Etwf4lapHlDtZoS7egbRGHsEyTzcaYjUBNPLjKkUZ79dz6dnK0YYnGxJ7PdNagk02kbhgXcUU03sx2yCIzaxe23fG0ITDt5CzfGtQ%2BeEeoQH5ZkD8WxDVJDELv9V6btdPwTfSj%2BrTPUKOVHHo0TvsQXRa&X-Amz-Signature=b72cfb358e23b78715d4f6426ab62eb57810f9ab14c1da4263c3da8954bad6ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=bdb934cd86de110e9596664ba08b597d91eba429bcdc5839ac1c4ae9c3adc4c6&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WQUX32DF%2F20260528%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260528T043955Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQC8l%2FDjMM0b9IUFtS7ySnONCmzvqW5yyJ766HJuLNkYPwIgf3xwld%2F2G1HqewNQfACM92WhljdIGa7BGFgF6M2xbzwqiAQIpP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDHycNer%2Fm65MU9qo8SrcAxlbA%2BBaIn2yMkWhhmwFmZGFZyOBbi%2FiEmn5wQn85q0Pn6%2FLdFAy493lj2JOfmd9P7LSLYAYcFYg4hSdcbPZ0gtMrWk9wIRkXDYHwEeWEjCi%2BLKEulf9ICHAiqv94a4GzkI30DRfQnxfuIETWcR69n6PUuU76WgI37k0TtdfvkC%2BbHlWsK8E13TvU06pRp2MblRdKvsM5ybF%2BpQKxQyH75Tqbz55QxDIYv9s1gXmPx946oMn7SrE7T2SEUUFWaD9ckR68fptzHw2Ug70eLR7vu5IfGx3ln71zID7JapgxTNiuts4jWb2alf1AZmBFdcuOSrGqCp6C5ltI%2B7B6HP9qAf11hEm9NMXsRIUJwj3TUCn0UxaNsJOmH9FqquCBrjGCqzI0ztsnyPWeF5t5OfP%2Fdlp%2Fcyzeza%2Be4sC7aeAejT5CtT789JFP8LGIeBYaFGauYtXjoLlAfn3DSPupklhgMpX9ZXO5ml7d1s2IvDa19TA5jEOs%2FCEeu2aYkLoLDQZonHHwQwAJVjaTUh3mxBBQTkAt9%2FpD2Ou37o7NTQvLFsv8nAFeq7tZ81goCVqjHQhp%2FzQnDRDH8HEoCHmbyUJ7HDqYOy9GSfJl6tjIPoHx1ruEFYd86kHMhuL9dS6ML7k3tAGOqUBcdR1VjwMZP%2FkhkOKmBm8Z1szyPIqMEzrYWnTcR55bOEsO3wYvJjO6VCGM%2FC0euF3YUgmtNlG2m0MWa9nNvrV%2BuhRMxHLh7PSm02%2Fv8NllNx1TVXCjHSa6V92saO69hEMnBmiZwtgukXn8ZxdQh6Uok6r5fhPRfNrI0%2BcOxw%2FcUGN7BvPIYCGpiWsoCMCHe6J21q4PFcfKuVFzaddtMq%2FuuMqUNtk&X-Amz-Signature=3610ae959565480246dca66c31e1cfe277cd3e2a26e792b1339095c48a13dd73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

