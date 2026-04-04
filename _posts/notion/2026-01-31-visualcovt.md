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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/dc8042be-afe3-4c44-82de-38ad00a55bac/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031754Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=af099eff9156f5c903f8172091585c4ba446c567e319d5c811b960949df5cefc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0a5b8b07-ffaf-49a2-a125-7e3db7a80c1a/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031754Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=3a70ce9044da52586d85e5ded86b470f8de50db6342f61ad3fd933c0b28e78d8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 이렇게 여러 perception-intensive한 task에 대해서 visual token을 생성할 수 잇고, 이는 추후 decoder를 통해 interpretable하게 시각화할 수도 있음

## Related work


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0c53ef2b-8bf8-476e-8fa9-4704b98357c9/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031754Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=a5423b72d290904ff9e479afd1300f97464a9c0bf2fe87797d522dcdb64bdaf2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/aa646576-0bdb-4365-b827-f8d099d58364/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031754Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=8eb8972dc418006532f385943a0a5af39df95cdf9f58ceda7d65061f6f9523ef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


### **3.2. CoVT overall pipeline**

- 💡vlm이 단순히 텍스트만 예측하는 것이 아니라, **연속적 시각 토큰을 생성하도록 훈련**시켜서, <u>**모델 내부에서 시각적 추론과 언어적 추론**</u>이 자연스럽게 이어지도록 만드는 것
- **next token prediction 확장**
    - 기존 vlm - 입력 : 이미지 V, 텍스트 T | 출력: 다음에 올 텍스트 토큰 y

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d1bc9a9b-9e43-4dd8-8ed1-08f9053f5c87/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666FAANCYK%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031805Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDnY%2BVPZL2qlxW9kU99Qi%2BKTqRT2q8aVwPXthywouc4UgIhAOcGa%2BddqI2EFFJ2OfgYpQnlyFe%2BJh8g%2FyZG23rJiv8eKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxpjPqySFwMLGf3KO8q3APRbsi%2B1yQhLnNCmoSrxh9Yf%2FWBZQ68xnD9Qg0%2BLAr6B635L%2B5JbyiuAM0I49jbk%2FMu3UEKUXkN2f2YPhtjtGNMLRbBX8G3HJu0RqydiHpkbLJeizCcUlQFwn5eZq4Ayw7XeVj1Ip%2FCeoWLAlG%2BVYI9dQy%2BxKtWrQBozarTUsNmfFqe7mttav1Ylv1DghD%2BVh%2BpD03Zo6HZnmuR5Mf9i3%2BBZx%2FgpESajrUFEvTocosfZWDhIm6Q3O1F31TAqQOU4KsqBm2Gq68QEbrFsofRIYluyjuS3WTfMKFFZ%2FAkq%2B23OyR9sylAPt%2BW8DfJp%2BPcnoWOp91TbDlHuBSwHkufjbmxFib%2FuLZ8FKu%2Flq%2B2KqIU2cC%2FVU1zbh1BpthvDvV5hp1px%2Be93%2B3B7tZPJqopQJrjQ6pqnC7QtszFTDIsBvxEV%2Fn8neUtlNbvDzca37oTEGkWwDoQiqvPNdz3YYaYoRjjmVZeF4SmmOY7cLpHc5kwlD6u6m6SVhIIse7FpAZh%2BmtDj9MEICsJFeTpmZK4MT75Ezunvpm98rps9amlXakbYkVNqx0bROJ44b4bHPqj4KWsZBpzujeATTiN4NVtr61%2Fb0xp83bcuGkr3trCl%2B0EZVJGkPmFqwWvizFrODDc5MHOBjqkAToUNynSC4ZzN3liUOx3xaYygcMmLh%2BgPnZXoK1eIl1F%2FTWcJO5E940EYMuf1yWHx4xB6LiMQJWzypIn%2BSccV5DmtW%2BYKlMCQ5eisP944B%2F%2FY3McE%2FNmj65ZyMjUeGhI7k6psSOe3PfHS%2FjsKsM4AyrFJs0OkA37Da5yANYYchO4uHdFE6MeFIfDNKeM%2BYoFxShZoofExy1oWragaURWixLKDsDw&X-Amz-Signature=34afca6ecdbf6cc9cb22afb02e3f2b56c90735c899a576cc3336af57652ca801&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8aba2074-0dce-45dc-9b8e-30a9e76bcee3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WAKF2BDM%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031811Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDwG4S7uCGb9mmzZRNf9sKY2Mii2riqysZaounh52HIfgIgBXJDFk8ZfNqJM7BJ%2FSHx0iVEeH2ir4M8xQbSZvXIIfcqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDLxBygXU6ylgIZP60yrcA08oMbVyVT3%2FbENw7ZeiBBPfQ30cadQCbJ5AtFC7WN1CtKzBNS%2BB%2FaSfFqRful4bX9EDGcTpwe5g5v06J6Zv9cZDd0nZZfg%2F3XRQ4U7MY1Q6q75ZGTOCB0E%2FqkJBZIMCz9mEZS750bloLHxpwhDHbHzBdZNGKzQqL6Gg5nSkk9W6bg4F%2F%2FncJrvKWvLM%2BuoVmtIk03y1MCaAhN92f6v8jK%2BBORHWOsQ8C7uwfwS74bBOlQ0N9UOf2wnE6wHlV3QcEVaUEdwOoO8iMkpQhV2SiZNLspaNlQmG5I9HvFwaHjFOXGyHpyTJq%2BoUPR4URjMd9gWDB%2F4Yf51etVlhjzMJcfBr73wQN5hVw1X6UyyV46IKy%2FUuvhQH8oerBG8yOPBsnsBLac3nSyFHl4SLJgcNZxWgYpvx3xYi%2BTg%2FP28euspkp9pss2wYFOutoM7imvkdPHBXoniUzaqcTKpz46%2BRLhZqhtWeu0p%2BlOrnMXGHOmXBFUywUUEaDPkyksaQB4c0gEmojfZyy%2BaeaZBMXgOXNT2yCl%2Fvz1Y5Nsl9BsvtX0hlQME0oTOloepmV9icnnogItY6a0W7m3RtyNWSWTRW6%2FRPOtrdRo5Wd3l%2BqcajVueR9%2BHEihH9XWHkXf3LMMLmwc4GOqUBmzWHk%2BLOUJ7ZBCEM17Ccb4s8Lquxysc8jGxPJrw2cMikehwQ6YWbB0cDtCHpy9CMTTUkQd22M3r%2BuwEs7r4lHvxKGzEV0GLUUpP3M%2FoqthevVhbFda9W%2Bhuq4%2BzwxKkOzV1wQCIZBejlS8nrpEu9KBLtsjOscVv%2FRHQ60iVY5WCJ24jeHgeZPPfJi9BdhA%2BCI%2F2U0IheoMnD%2F7rKVr82y7ht3LQP&X-Amz-Signature=da9c05ab5e2f64533e74deca4269bb083fdfa6955c49045f76bb404d1dc2d430&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ff2e3c31-d11f-467a-aed1-471f49cb061b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665LQLMBV7%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031812Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIDCz7jIEPNsw%2FDqYnwJ4diYm%2BqyncDOo7c9s1%2BWi1YxxAiATDZFFYoGMBFefkZosTlqzxoykYYsV7K%2BF0NPH6gN1byqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMzCLQytMs2VpyonI4KtwD5Ypyn0fOYqbDjkSAUSLTX5ab0sA0a%2FDSeKWi0wOhbWXSE4ax0rhEP%2FmngdZBGTKdOy8QRUIqj%2BNQJUZpwAomZuY2VkPqy7oJUZZM0vzJP%2BFF0UPCtpXqI1M6uhOmYQqx9%2B2TLysoGdvQWyHlOAgeGGXDFsrF%2Fd3mq6RsjK7EQgn4MAk1Anc%2BotWb8DxutimVAWL6ft6ksuL3YospRvfmfyiXNuJQNYRCZXICFt85G%2BhCSod6X4A1R6grhC6jvGl6FA64ns%2BTu6pMXkF8T9vhI5edNROSxQlKRXfGUQFii1Gbm6bgRMTvBCCMUytwQQDr80J3eKxtkvY6EEoTCWRykrzn3Lm2UeyrxeMCTNe7mXRhaB%2BHUZJAKcr7cAkHJuCFB2dgfd4OGFgXk5zEM2PTXaSJgpIBUgu0%2FF4pQ%2FGHg9rIKD2QATv%2Fv8fuk1LrNK2YArbHY6ig2P4GK%2FbCbtvs0vpBj75lRB0tG1XDKHUMIv6Hqvyt03GJwRaOU%2BOZ44IWd09P3SedwCnybLXeNsTyA%2FMBJ4PnP5YSxvj5g7NH12%2FoyvNiSfg686jtWG44sKPbfl8fXuf8KIm6PjfEwCYw64L5V89RE9ik0raVWSQ1TEFVo%2Bpfp8mB7D5PCxEwnuXBzgY6pgG9t%2BUWdrq6g2A6zbtYHB90WEpmbR%2BFXXiA7DpxUT0bgh3MtmPxjb9uDIF39adexp07G5PoIW8bb2%2FKipmCDKjGp1f6lHHoT3rtr9pWshwgxtoOxkqf9%2BBWcBlGhH5kerA4VstBzZSNS%2BUNg%2B0hlvMUYRvQhmWY%2FF92KpukLeAvixJXu1ViMtx6zj%2FdVtG9UvRmmubEAD9JmekXSv9wf%2F0hkOfbzRsw&X-Amz-Signature=31cf5835d94c0a6f15d0cfb04f6251bd0c398086f5649ed5826deb27cd305942&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 최종 예측 depth map은 4개의 예측값 평균

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c4b15ad1-f989-4eae-ada2-b638ce0725ad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466RLGMHZ36%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031812Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCRl%2BJIfMeGnw4g6xxm1sQ%2FH7pt9jc7o%2BBCmgRKDo8AGAIhAPi1pX9fTX5xzh8o1p74sd4NPYJNF81XtFuwTGWg6dswKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyU8rDE4Isrdzu1lAwq3AN8bS7V1%2BaStxZZ2T0gMHhICM%2BfGuJN7WZuVoPUpha6oYuapv5Tinpb5zHBl5pxtWWppvzx%2B2W5Qud3HA2SKZplfjfNT3lzMYmUBHe99no8vK%2F9xnQ3q1e7D72NdnuHg1p%2FOP6gU%2FpUcPIpU8ulYHB4cyMxi8Ba5k64Z9EHYScOZF2P1SQY%2FyPpy6QuKb5K8nwi549qjgs9MZbh%2BSubfkbmU1VPPm8Al42h4L5KkQU%2FtUKiFt3hAiDxYeVDkyl%2FToR6Tby4RypYwGOWyfYvok6jybUmVU9Yp3O3uv0a0nkGUE4Amycl2F4dledDC1U6JKEVKGDDEiFanTBlwMAa4Q4MoyQpFpnnuiJWjl%2BbKxcy1SpRulR6twTSY2cqYAVUzFLPV7WlDMoK1KRFiX6eqzL1PGfxkzXHUDq6HodRw95M5Rxn23WZRviFgJAJpnFhwlSOaiQO7eb1DqoHeC82MTtSgVoO4eqwmtXPOFdsI7JAOxuvQpjxrkT143p8cqKjtJ51Oqkeq%2B8znbGiOZ85IOSIqkD0Zzq%2BJ0wkniiOx30sEMCp7YDWTwyyehkf8gSemhEoHtCB0TN%2B5AesjMlnG51Mt9PGWTBC9PiebmRTu4dTU3%2BtaEim84GD2pueSDDe5MHOBjqkAcBVFSiJe5FBD5Mb2nvTwwiWQOF6cyAU7mOhjbbzvT77kEpjLK%2FMlhxO67p%2Bu9vlko5BjGLblR0aZfNHCPfJx4lGWRhT7ZYzNfmYQPJp4LJ7eWrRnQZrWnBl%2BPu4H3%2BlXexs%2Fq1KssIL7n4pXU5oddAipxc5qWO54ut3tgkMS4cA2wVOQbRXa%2Fq2fYmt5PWRpYMke63l9gyVmzrdaCT2y0KDskD0&X-Amz-Signature=d90a2caa9f00714b848862e7d0c964b5ad07d4922177546815a5637d14b189b9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/543a0d0d-89c9-4410-884d-3ebef59a3f12/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031754Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=3c55b57dcf3203597d683cff4e59bed94be4cfad23518e0206877c1441d00d3d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/c9c0cf03-164d-4a68-95b0-37925021299d/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031755Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=0ebbc36a30e155e488ea8ab39fd664c27a3abe51d6576345f2f196d9237c93db&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/8064f5d0-de27-42d0-b5e4-49f94448cfdd/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZCDHPTJF%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031821Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDtOjNx8NdcVrmmRRM1XBzCPCC5Rj39i8rIZYF9bKXwOwIhAMb6%2BUoEBOnJUiyru3qc5QrKc0DOFmYhdOAeVeWMlwAyKogECJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyzRD%2Bh%2F%2B%2BUW4PKPJkq3AOk89caca6BdzCjORbyAdlbZzGQ%2FeOyhOtpkGJ82M7F02FyyuGOH8wQmbahtXnkUW8xZzysu9Bj3uH8ulSSwZTeGy27oLH6%2FBgm4vgQYWrYlxt9ASiGUtn6572kzschS8sE6G0Iwum%2FZgKSHIRHIgOX9ok0Iaw0BQJJ%2B8l40ROq6KoAin%2BJIJ7Gn7xQ65oDG2jir28MdFXFdtfAAvD9fu8dbJq5x%2F%2FWY0h%2FWsJgLDuc8XIm%2FOan2KM88ig6l9ZH6r1TgSSff9hCUp7N7xW%2Fx7yVbcnrb0JP0huhRgqk9wTanrJqaYOyiNSmzBt8JNMWvN9CwEWE4VvdSh4YOlqs%2BIv5dHROGBQBSJ6tFjaJeid9yhyyNr%2BhanmNUU828OzbTCb48iQ%2B7phVATzattYqiObenrT3s71BPjtSNMjTdKJAZhV%2FazS3h6B1NaPigORNjE3Ze%2Bn1XoJCv%2BMqjt680mn%2BxBJ2BIJCewv1P%2F8ieoolwR%2BvNOXJ5Q%2BIh2Q6qotCdR5kSwsmlf8vvGRGKo%2B0rbsjFo%2BchGnJ643J0IMR208eclT2F%2FA4v8hfHSzsIrd8GZmdSAsr39qfXJv88Jw2edjvoXbumiPR8wz1Wy%2FSSdO%2B3j%2FysDxPOh77M%2FagZDDQ5cHOBjqkAZYQL7fARc2r0y2y6Fg5YzY7%2FrlYHjpajLEj3SjiUeLPBCEQunCfxFA1qzYgiYkq85WqT5CcjZH5GYVkl35VhFThhM3%2FNkU8em2mW3FXVGep3UNeQiDF3h%2BYr%2Bas6DGqkf%2BWrAOjV1xfPgx%2BIUAU6DBFmZl0K3%2BzbpIs%2F0cMZWGVxHDYL54niiRg19ahbq4%2FctiIRqazDHAnB7gYVYvI0Bb%2BjFcg&X-Amz-Signature=e5a6540016043842611664b9204caa080efd22750219cd57a31b54cd9c3af763&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - relative depth에서 aurora (다른 베이스라인 method) 보다 12.9% 우수함
    - counting task
    - 범용적으로 적용할 수 있는 방법론임

**Qualitative Results**

- visual 토큰들을 실제로 볼 수 있는 이미지로 복원해서 모델이 정답을 맞히기 위해서 시각 정보를 어떻게 활용했는지 분석함

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/409be04a-8119-4fe2-a5b2-f98204c9a1b2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031755Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=333170663e7a3174d773377e082ebe3785a5cdc77549d6c6a378e13c3e9fb3e0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 얼굴 위 점 거리 비교 - relative depth
- 물체 간 거리 비교 - scene understanding
- 테니스 코트 라인 세기 - fine-grained details
- 실제로 모델이 판단한 시각적 근거를 시각화할 수 있음

**Ablation studies**

1. <u>**Text-only Chain-of-Thought vs Chain-of-Visual Thought**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/42f0f3f3-5030-4395-b65f-71ea44cc927b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466U26OTVP6%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031821Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDfUoGB6h%2FD4bmqc8qPHvEVriKwGL7BcOHy%2F%2FLVBzX4bwIgWm6zJCcL0yRs4w8dIjNRqNTCFRvR5FGj1YHppp%2FG0OEqiAQIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMlwGJh8x3pJJoPIVyrcA95XqaTu5Zbl2kQ9pu5cC5EhDwnMPU8FwIXqSPeTYjlzG%2BkKdNMCvxD3GhS5a3gTRlRmiU%2ByFGD6aZkRmU98kCg9QpMO1RMpr0rG%2FJGrLCJ5KO0zI3yiuhzoDOGF9%2BxmSjHbLscF5Cmko81zxYVjAq3SAGOPi7qQPqk1F0VNxQeUERPOJYGrXUT9HNdr9n7hMf0O5qLyNDHP%2FikTJphZjDSkaS6trjr3y%2Bl1zTp5zmSvcbqTOWaBp6Y8foi8Kz2Uea3bUrqqY62ho8WZqigdNlfGqHnswOyHB7FmJXy1aw8tUGM3HArfazVchRS%2FQEqRtdvmiquvYyYPCeBCvmOinSVFu4FIW9pbGmvqsA1ya3pZGNrHnOxtmCvBGjqB0dBEGVAMr2vhFESO369ygmfEkSbyRHg6FdcCWfcxaq9M9lgaG5LkEbd5vxh36jom1blTENQmxcTM6SfML%2FoO3DXvIATIQMsdSJW5%2BNiC9rhy34JJtpyZWEvncW2zhc%2F7fppOPmDzqW1hbFCZJ1ZCzOAJjeXTA%2BKen5ysXBMccIXdjYycQm3mjJxDIPRrJ%2BIGfgpAi5jNXBSWo2Fa01YL%2B2q%2BWzsQD3I9g9K%2Fj%2F9wjjp8xClMujutHVELPbWHajgeMMXmwc4GOqUBxZQjECLOG82Fd6h0R0wxm93%2BL4J5%2FuaO9%2BBDAU0uzeqZk89oW%2F3UBh3t01%2FwukqbXteYq%2FAY4GijhxUScFddi71vLoqZOzIvC4TqYOeU4b7zsDa53yu4W7uENqlLNg0HoFjiGrbaAYiiV1uPWhHNuP9pbyDhcp94zbWeEpoMPjsserlkT53dwXPh8Gi8ASMs0qnz8gp%2Fa2fwW10Y%2BkHtoLR7yff6&X-Amz-Signature=9c535fc8102f7e4a90bc72d89b4d74d98f0e9729cebb723533282882424c96f7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - covt > text-only cot
2. <u>**Token numbers**</u>
    - segmentation token 수 조절함

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/77801cb9-442b-4319-b8ac-60e338605a0c/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZD6YSYOK%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031823Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIClev%2FEW%2FSzz8Cd4gd19qpnnxmWEMSSClozRhwsb94sDAiB8VwmsYdg%2BNfpsaYdt5XCUSifnqSawQqcNZGIDJ8vlXiqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMWgHy0GCHqiKQiUpPKtwDqNhAFqkPb8DZi8vfz9JtRR4vByHGAmWWlpDys9TUqxRwtnpb7Wp2eYKgkOmMi1g8LJIKfSI%2BD3tiegkemWbgeDSqn1ttaL7WcqSka7jusjZqlSh0%2BYO9JoTKj3D8uGYH%2F7oh%2BIOPmmAuPIVN0yNhNGz7fteD3DEHoFE6iMEO6QJ3ruGExOPlg1M053XOfFhzXsI62rlowxjO0K7cl4fFkPcffDrOomjYIRjRfTQ0Qk256LkqetIP60%2Bkw37w5n7dGubbH2NBw4%2Bn3JiwB9xbKnobw4PLUZw37TMiP0QKwahTgfsGWDE9sbW5rRDxVdJupFYHNbBN7uundoXx5OLPPD4W6IxFeabdTIwUIJltjjX9RR%2F8nJjrjyRoT7YyOxaELQPH%2FQYznWr2iWDjmxrZTB8Pn0SU8ihnQhtBVXbrC%2FohRyenOgL3cQjOVLjuIdpiO6TA9zyURGrw4Mehc7ugPbGeKrjx03Ip1NJ3%2FY5xz%2FoPb7fEfG8lhCKsDZGRxcxwcL5tvQrj2TvQKkeP6T5MCqwzQoDKVfylocos7aqzt6L6XAyrmaG9IY8POVYhTRw9ktnq%2FHvRmL%2FicU6jrCXUOWnWHgq%2Fj2N%2BLz70pg5JyQejjrHCtMF9fBYrKDAw8%2BPBzgY6pgGGXde%2Bpqe%2BUOujW7ote3Irpmx47T7k5KCMIqn5MCunNZsxbe%2BAVNSPghTPjAck0tUwepXwFtH8TLZrACBEeEsZ%2BIf0%2Fy%2B1vnNg0CoTEVvrl14m%2BInX9oYeBVSrnyucDHO%2Fzt%2B26w1gXKL9zgcYE8km5a6tK1ZC6GGeRBKJpW6asENft1FnYNtLKEoRA3cVqX7K6bpuhktboqa%2BuxOEDbAl4g0cnLft&X-Amz-Signature=dcb3a6e0de4642f01f7b69bf93b50c54ebef56f4bfabfd920c488960dfdd4d52&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 0, 1, 8, 32 토큰으로 실험함
    - empty 16개를 사용함 → 성능이 매우 낮음
    - 32개를 사용하면 오히려 학습이 어려워져서 성능이 낮아짐
    - 8개가 가장 성능이 좋았음
3. <u>**decoder align 방법**</u>

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/2c213c5e-48f7-4cca-9b10-30012d4b13f1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SOWS3FNY%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031823Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCICplWi%2FF4i9cTjc8%2FwSJwnMt%2FWlqXoLMcN4yuslhvc4kAiB23buk3jGDdzhHitkhJMJXPbXBO8BWY0lBn%2BDEGQ6pICqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM3NFtMCxWHDpXzH7gKtwDTssuSpxd0anvL%2B646cOLeN%2FuAuBourq3kCyvJozfOzpXWyA7LKsny%2F2H063T0KUwnu0qYRtjpO%2F1a51zXrppwY3uyDJT1QJBCqIJnSuAbAdsdSvwO48ESW%2BuA9RDVUBaAKARqbCSUJryzqG7voq810%2BHqvworBvY4Et3Xb3DoXzhjKoQ0tzt2I9MG9CiL3cOxd%2Fvmhnd9YS0y1uzDFWmSdsIlKU%2Bs6Qx0P2dCYw7IE0dKQlFsK%2BikBQGKs2UJ%2FRBccdyP5G7jL6V%2FIJoQVpWfGwu98XwyuMLQstWFgFz2%2B7CMbpQBDK%2BBaMDQgPIytGYgw5FIf15jDC2%2FNocG5Xa6DhKbvVWr%2FSoLdK3PrfuP5be87SsOpcUFyAIKtDz4CPnmCHvEsLzi%2Bcia6jtchrzqAp59kRJ3pi3wjzprJDtkC5E1KyAtwzwVozZuYlyg9jt9uzqOLcqq8oOtSiQXTa76JQSOqxjCw0xpjrYfN9hfKDV4Ki6Ok07ceTw25IXBWq1zVySTAoezCNdVrObX9d3y3BjruF3YgS6K21XntjzgAEXPn8BHNqxvKnonLaX4irZgcgY5X8acchylzpxLkyALRR50amuA6l0RSHAxRaBdgdno9hHzbppEVcSFKow0uPBzgY6pgGx%2BRoVERKoOV%2B9qI9%2F9Z20NFJABkeEYKE9E7NI6mOYCkuD38OAuvpEq1ISMJvtkPGfm4sZf9Fhu2pxfRwbSYBjf10pkX4RVhJrpXBcOhJLFnSE3oZDdwDl1BmZPNkgPxrTPJe9%2F%2FU0OqQp1Yj6WHgN3WETfnqwi%2BG3eVftbAc5BHfwQfBCx4jJnvfG39w0%2F68usJUt6tjAptxQYVoj9uAWdRqRJmpG&X-Amz-Signature=83e8cd1d312ff2d64d3a451a65ed3880c07bcc219b5b84461227c252e789b41d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 기존 방식 : 시각 토큰을 expert 모델의 인코더 feature와 단순히 mse loss로 정렬
    - covt: 시각 토큰을 decoder의 프롬프트로 사용해서 마스크, 깊이 맵을 복원하는 방식
4. 부작용은 없는가? non-vision-centric task에 대해서

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d55dc8f6-efef-4846-ae97-331bc71e6c38/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SG5XW762%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031824Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0caTav0CqjfeJAEWHT6JtvN3pOBdZby0Xa%2Fng8f4leAiAmMXKtqg1wK8uRWVhXiek0y0MH%2F9qT4DlVvuk4dK9iTCqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM14VGKQc2KZAULnb%2BKtwDwel5MYS2%2F6IUYnqXEEVlWz3inP0fYm8D5rW%2Bn%2F0YUZUHqR9%2B7xz5ZUIQVIABMy3O3UjFf6dhY60A99FjC5cDV8h8iK678WvyIg1lRYanSGcmq%2Btt0328zGmB5ST0dc2Il6bnsNL9cw4pb0f9ukTOcxQFmYGE1xR7p0x4%2BxqS9YIYPrKkZA%2B7hmFaDtiiFbiNYQ5ogJBHlyoPTgAYfhHcmJKys8vTgoZjszaELV5NyQhWpoyvQMYA3TMh94EI0cY4R11n9mjxwNqXN8TTOyZhNMm9S0mZ8%2FjDRNrf4k2irDEwUFnDpq4EY1MOCtl9VOu%2FTueGvw3Tyc2MC%2FLa1ArcasnvoH%2Bu1DNQKcQW56f9X70h%2FdJjfSv%2FAV%2Fgg%2FsifZvq5Kv%2BQGJLfcjKNAoawsBm0wlPXgSNns%2FIZyF9zzCl1Fjm27Qk%2B99O1fInvynfLyE2dacOGPAvLPrdvcX4XQpJnWanRqYuTLwqnKH1QmkhbiE5txoCBkj2ZbkZXDij4Kd5yAENQO4FTi%2F5iH5yKC9KpvcbHZpqB8QrIK%2FMX2x8nsUbrbBPZtrfg8VSAqen2nplGyvoMJsQBW1n5fjF1hiIUVRkpFEpr0mTezWYsvRz8o3yN7p7USJxQQoaa8MwmubBzgY6pgHFkfGjSFPMi792%2FDr%2FbhxK1S1lJmZPu7JmOxksxf%2BCToidNsj9c9xodrijnqhTT16nwcqS6Xth2SbS7lUG7GXIul8ZT4OgitqXYHupM0WGaj3R9Kqw5KR6dAI9Zdg10dborGdLDDgpm1baha%2BCgzsZRbKY2LURjQ4oOAj4jKCbMEWs%2FbxfmMRQPncu6bPuPIXLHOE%2Bp%2F%2B3e5EgxiJ1wxiEFmtO2cey&X-Amz-Signature=d0ca8f0288a9cfaae407121b510d5eea16306b35bc1d7944bc0fdcd9f929d62c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 평균 1.2%의 성능 개선을 보임

## Conclusion

- CoVT가 기존 VLM의 한계를 극복하고 향후 멀티모달 추론 시스템의 기초가 될 수 있음
    1. 연속적인 시각 토큰을 통해서 모델이 언어 공간의 제약을 넘어 밀도 높은 시각적 표현을 활용해 추론할 수 있음
    2. 서로 다른 종류의 시각 토큰이 합쳐질 때 더 강력한 성능을 발휘할 수 있음
    3. 한계: 아직 탐구하지 않은 더 효율적이거나 강력한 시각 전문가 모델 조합이 있을 수 있음
        - 완전한 interleaved한 추론이 부재함
            - 현재는 시각적 생각 → 텍스트 답변
            - 추후에는 텍스트와 시각적 생각이 자유롭게 섞여서 물흐르듯 이어지는 진짜 멀티모달 사고과정을 구현하는 것이 목표

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/50dfba32-adbb-40e4-8d97-998473c2cfcc/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031755Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=9591186aed5a8ace815f764dd1202e296d2cb80ca76d0611cfbfa362322627c4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d8b61974-c4e4-4777-b0ef-dfd68fa35133/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666MNDJT62%2F20260404%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260404T031755Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCID0YEpLi%2B0FNeXR%2FbHVjdigM6xsZexEsXhJyTlcYcBmCAiBDFq2e0yatVZtexirj1xLodifaUhkEOVY2tP69UYPtaSqIBAiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIM8eUmfz%2FA6DkOaI43KtwDrXWfg7I1PclCVDYtl6hbbh3w2zHkr%2BUBXljk6fgHY2GrpJqBrkbN1RrzZx%2BUIA4Dxo2dyifkhp9SMsUU21Kl8S7OBSpEsoLR3uqVDS9AWX4OUdnkc2QKYFrdn2jaDZWnsNj1oPeoI89hySY%2F7bx2fzqh0IoYxynFu52hdPsmDIVYLAoUR212nSw7hv7CdbR2EukBxLQu1juE3nvwUa5kCQNdCa2mj6eqx8U%2F0M3VpkxS3eh7SKH3QjX6QdXr%2BRExIKqFc8I9LQ5PBW1mGO%2FT2B7jGqhobfTVpy%2BEnEjYqo%2FS1CUY70BmYbk9PfJS5iaH%2FOLwoG09ZRRbhIJ8iWmwewpL3ujEfdFMHBGgrv9AP9kQLTA4ulDE7P%2BLXAjhKzVBeqMQMj6%2FR0GHnvYuu85jLQkmNDVH87TX2YTl7TxkBalWj7Z0jjusRWPoI99HgIPmrC61a42AyHZdrAES1Qf6I6uNY77IZonj5tF1Ip8aGkdHneLnB5Y5VCEeNBHd%2B1K%2FIDQnz5Ko%2BgxDfBq3EdQZE%2FqPnJl7lPxN6TtECcWM2D7uEDAtWsKckDHFCIgO3LqK%2BeJY3CXCMzNKfNXeN96gKDGWdkccAm2zTB%2FcWUnpc%2FhjOUo%2BJYW3lXItkKgw2%2BbBzgY6pgHaxi3usw9dItFI96oymjZ4UnTAAZOZa%2FkB3vMzcEjV6fO0OmYpTNG4fJLO7CcgPReC1uS3jilW4H%2FiTSZ%2FRQSteWjW5SlpMsHkz24iZx%2F8%2FZAgXT5tgUbbpBp4tEXhZWonhXKw2LVwGIZFya1Hy%2B8CmhfyImRrYyeNFVoJ3TdWXQ8hOzun6yrWwJ7TAnRZB1JkL%2F%2FqrTqLQ7GAzjtalY9MtZttB8D4&X-Amz-Signature=835108ffad5cadaa4ce1120c32fe6103a2d1fe529c01f537b9263dca77669c8e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

