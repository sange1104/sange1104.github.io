---
title: "Vision-Flan: Scaling Human-Labeled Tasks in Visual Instruction Tuning"
date: 2026-03-30
categories: [paper-review]
tags: [mllm, vision-language]
---

- ACL Findings, 2024
- Virginia Tech, Washington U, Michigan U, 홍콩과기대, meta

[https://github.com/VT-NLP/Vision-Flan](https://github.com/VT-NLP/Vision-Flan)


### Abstract

- VLM 발전, 여전히 두가지 큰 문제가 있음
    1. **task 다양성 부족** - pretraining, instruction tuning 모두 특정 task에 치우침
    2. **gpt-4 synthetic data의 오류/편향**
        - 자동 생성 데이터라서 noisy, bias 존재

    → 일반화 약함, hallucination 발생, catastrophic forgetting (기존 능력 망가짐)

- 해결방법
    1. **데이터셋: vision-flan 데이터셋 구축**
        - 약 187개 task, 166만 샘플, human-curated instruction
    2. **학습방식 - 두 단계 학습**
        - stage 1: vision-flan으로 학습 → capability learning / 개념 이해
        - stage 2: gpt-4 데이터로 추가학습 → format alignment / 표현을 다듬기
- gpt 데이터는 vlm 능력을 키우기 보다는 출력 스타일을 사람처럼 맞춤 → alignment 용도
- gpt 데이터는 많이 필요 없음, 1000개 정도면 충분
- instruction tuning의 핵심은 llm이 이미지 피처를 이해하게 만드는 것

### Introduction

- 기존 VLM 구성 요소
    - bridging module (이미지 인코더 ↔ llm 연결)
    - 대규모 이미지-텍스트 데이터 → 사전학습용
    - GPT-4 기반 instruction 데이터 → instruction tuning용
        - 사람이 원하는 스타일로 답하도록 alignment
    - 구조
        - 입력 → encoder → bridging → llm → 답변
- <u>**문제 1: pretraining 데이터가 너무 단순함**</u>
    - 이미지 캡셔닝 중심 - 다양성 부족
    - → 다른 task에 대한 일반화가 약함
    - ex. llava의 경우 ocr 성능이 낮은데, text detection 학습 안함
    - 이 문제를 해결하기 위해서 instruction tuning으로 task의 다양성을 개선하려고 시도한 연구들
        - 하지만 여전히 task의 coverage가 부족함..
- <u>**문제 2: gpt 기반 데이터의 구조적 한계**</u>
    - 합성 데이터라서 생기는 문제점
    - gpt 데이터 만드는 방식은 주로
        - 기존 캡션을 gpt로 변형 (대화, vqa, 설명..)
    - 문제점
        - task의 다양성이 부족함 → 결국 같은 source에서 변형한 것들
        - spurious pattern * object들이 함께 나오는 패턴이 있음
            - cup - 테이블이 항상 같이 나오는 패턴
        - long-form output 문제
            - 쓸데없이 길고 비슷한 패턴

        → hallucination 증가, catastrophic forgetting 발생 (기본 task 성능 감소)

- 해결방법

    _**“GPT로 데이터 만들지 말고 진짜 task를 모아라”**_

    - **Vision-FLAN이라는 데이터 제시함**
        - 가장 다양한 유형을 포함한 academic dataset 기반 visual instruction dataset임
        - 187개 task
        - 여러 유형 포함
            - perception
            - domain-specific
            - reasoning

            → 진짜 task 다양성 확보하기 위함

        - 기존 데이터셋은 caption을 gpt로 변형한것에 그쳤다면, vision-flan은 처음부터 다양한 task를 고려함 + expert-written instruction임
    - 2단계 학습 구조
        - <u>**stage 1: 능력 학습**</u>
            - LLaVA 모델을 vision-flan으로 finetuning함 → **Vision-FLAN Base**
            - 정확하지만 답이 짧고 딱딱함
        - <u>**stage 2: 스타일 정렬**</u>
            - Vision-FLAN Base를 gpt-4로 만든 소량의 데이터를 사용해서 **Vision-FLAN Chat**을 만듦
            - 사람처럼 자연스럽게 답하도록 조정
    - 결과
        - hallucination, catastrophic forgetting 위험은 적고 성능은 높임
    - key insights
        1. **human-labeled task 수가 올라갈 수록 성능은 높아짐**
        2. **gpt 데이터는 성능을 거의 올리지 않음 → 능력 향상에는 별 도움 안됌**
        3. **gpt 데이터는 조금만 필요함 (약 1000개), 너무 많으면 hallucination랑 bias 증가함**
        4. **instruction tuning의 본질은 llm이 visual feature를 이해하게 만드는 것**
            - bridging 모듈은 거의 사전학습 단계에서 다 학습 → instruction tuning은 이해 능력을 강화하는 것이 목적임

### Vision-FLAN


2.1. Collection pipeline

- annotator 선정: 21명 중 2번의 training-test 과정을 거쳐 7명의 컴퓨터공학 대학원생이 선정됨
1. **기존 데이터셋 수집 및 전처리**
    - 두 연구자가 고품질 vision-language 데이터셋 선정
<details>
<summary>예시</summary>

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3057eedf-c946-4268-b349-58e0ea6d3db2/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WOPOB76F%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034449Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCTcvrxF3ul9lkYCb42spUZifNHODmMvf%2F5Y742sQwATQIgUjeVyiYemCtGnwk7ORSqj0ml0YUDbrCzLURlv%2BFCwUoq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDHiz243qBroJrBd0NyrcAznrCSIKw8mc%2FuweFiPqAvg0CvvHwSFFYG%2B3CTkbmassB92DcPFUiTxpV57n%2B7oPdl5U9YmRd9oXsqdqgzNvo8D75uGUjKJ7ovIb36czFQ3RTrn6N5IXAh2QvRys74bmWcJPBhVx7z2wz54WiM8qt8M%2BPBS30DKXYFMT8ab13bUWATWMC3CFhfeU358AC7xIwqj5JvFRcAGm5py9ssBqc4kmM3AsmTJSaHvK6lSxG45kPH44qUMCovpMG%2BPnV6XUcaMIVLyqVtMjm0aiLGKmpeUgOEEnX4zVP6Vi3gam1W8aGlaHE9eLYlHnZskgLYXUmu%2FC0UU%2FAI%2BGrfV1YP8cFcOQnEerLy2C%2B9vcXZMzQkQnwzZKs7FWSfAxjOpSXNjI2tD0D%2F45BdlsnhaYhU0Z6wfZfHi0WA1MiNsNNnc89QaeKOEY4roXwDdxdHOpXSfVF8PilJWRqAVH5st8fMt0HnVImXv3pclG5JVdzrN3lKdf%2Bspj%2B2aa0StKgMXQ7W5nFrytsFXXMoO1cYYpdy79An3AA6aRQUz1SnhG09GelVV6GQW5obUN1mhV9NOKs%2BzE8nqFjxKdf97WZfBqqOYiInH%2FY2GBwEqDHvmne%2F3I9GVqKvHAhyzbKy26hTDGMNHUm88GOqUB6KtZh2pFTdapwy7lVR6XrirxSuz1oSjH8dXU00OIck7Ls3Bk5NIlCHwz7pvoQKZkiia4%2FvWnjKiUI8ZKBHLvAa%2FgGOPTmDvswoRwwJZ1yVPWrbcTOvB38vfuCoxW6WD6r60BkKw5saRBLQNc5uVdbJhN8cjB3%2BEqs5cAIiPrx9cxlTvqdXdDyz2m7S3DfW8wA0nUvP%2BsfEj1xTQlcTPJuHELqgRE&X-Amz-Signature=056fbeac7a0d5aecb1056e382580b8f9f97931ffe0f7cc5c2819b60284b8e2a8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


</details>

    - 7명의 annotator들에게 분배해서 각각 다운로드하고 전처리함
    - 각 데이터 샘플 구조: image, instruction, text input (필요시), target output
2. **새로운 task 생성**
    - 여러 annotation 결합: 캡션 + 지식 → 합친 output
    - task 단순화: object detection → 이 이미지에 나타난 object 선택 문제
    - 새로운 task에 대해서 20개의 샘플을 사람이 직접 풀어보고, 정답과 일치하면 taks를 유효하다고 판단함
3. **instruction 및 output template 개선**
    - 기존에 있던 task는 annotator가 instruction 작성
    - 새로운 task는 annotator와 연구자가 함께 작성함
    - 연구자가 랜덤으로 할당되어 검토, 피드백 후 반복 수정
4. **task 품질 검증**
    - 두 명의 연구자가 instruction이 자연스럽고 명확한지, 다른 task와 중복되지 않는지 품질 검증함
- 결과적으로,
    - 총 187개의 task
    - 각 task 당 최대 10,000개의 샘플
    - <u>_총 1,664,261개 데이터 구성_</u>

2.2. Comparison with Existing Datasets

- _Vision-FLAN이 기존 데이터 대비 무엇이 더 나은가?_

    ![→ 기존 데이터셋보다 vision-flan은 task 종류도 더 많고, 세분화도 더 잘 되어 있음](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7a58af2e-e825-4263-bce5-b9fa894fdc01/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TB2H5BNH%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034451Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCbZCTzFf6BqLdyCACRo5E8YDJhZyCFW35bj1iPvuMLCwIgdhPiIxfZqldTQDRkkP7iU2WfUw6Y6v67j0v%2BUHbwToYq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDGK%2F9oay4LSnpdXj%2FSrcAwb2Pu0hWlhf%2FqjQc5OZhXHSG4RnZJRyPJFaDYL6PxCqNxfBDUbu85UBuMDHwlzHU8uBDfVHjQI6UAi99fKSYzeQxlEAV8iC8jvLn5maXh1xemhAE8J04gz3S0ZAultR7%2ByXnvjKHwDoJnkNhg1HobC6uHmmHwccFEh%2B8aN8zfSpxBzfy3VuFfREV%2Bs%2F61dOQbHHHBeKvQP1WKlL8pMhSS0F9JjxhSjSTm85eNPq6YgscrykCXiz8QC0r7eBG%2Bq9%2FFLMCOqvC2gFoUKfKc7fr1eo1WHGtu4m2Ylmgh3Um9468nkxslhOxiBlGqwUPoN4j3ZSt1fDTZ%2F7oxYBKu64yq9K3a1%2F6u%2FEekRUldAvz28R7uHexJXTwsCQXryBl5zHlG%2FNUwuHlEciR8ScKRaTnqtrHmSBeSpdLSWxK2cEHt3wdB2mYwkTIMSAhJtO1j2UB4QsneRB8JJQyKH%2BV32%2BXVmEbDqKAg4yoMImv6yzWmQ08zUZlyAQr%2FNAw%2BEf2wwx2YB9a9P0KyAwAoiofucYiqGxLTqOwopkmnLHLLEdk5BPWt6bAnJaB8nKfxA1wYeOyp2rqcbN1%2F0fS9zjD1Bxy9Mb90OP9D0a2QIqBarWAMKpnpHMsPt%2FhsesubO1MIfUm88GOqUB9qpOCybX7yX39EIpvYVDzmYCmpV%2BrTnU2251NhUi5p3FckmRegVCXA4SbtlXX%2BweaVICZbgTQ2OXBR0GO%2Fk1KQKsUDc2twLXLbLdzAcbe4mF3Whre1B39dRdlX%2FDfOFukzfpYk5yimImDEu19LTfADVfE83Kapq7YHQwprS7u3EgRRhn9Cp%2B3m6UyKWmmA3GLAj%2FxvL6%2Fg71mxnMDnE04uKe8%2Bye&X-Amz-Signature=22b6c86b2589bf077a430795f95894f6b12d09030b7075723b17c1fdf35208a9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 기존 데이터 (대부분 GPT 기반 생성 데이터)
    - task의 다양성이 좁고, 대부분 합성 데이터 중심
    - VL-Qwen: 사람이 만든 데이터셋, 하지만 **비공개**
    - MultiInstruct: 공개 데이터기반, task 수가 29개고 특정 task에 치우침
        - visual grounding 중심임
        - 일부 정보가 부족 - region-specific 정보 없음
- 하지만 Vision-FLAN은,
    - task 수가 엄청 많음- multiinstruct 대비 약 3배
    - task 종류가 다양함
    - figure 2를 보면..
        - 우선 vision-flan은 크게 3가지 종류로 나뉘어짐
            - question-answering, generation, classification
        - classification의 경우 general / vehicle model… → 단순 vs 세밀함 모두 있음

### Vision-FLAN Finetuning


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/3433c8bc-dce7-48ce-bd9f-77189b91201b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664RD4TNZT%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034440Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQD4Ki%2FzbFnJRpOqjNllFGEndv7h8MRk1SqJoqDy3PDQzgIgQ8mHobNNbE%2B%2Fu54wVN8QSQwAtknZNd1M6jcwGiTFsa8q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDPZU8ncrBVzXeCxf0ircA01ws%2BgfV9DpJDhrlPl%2FI0rntp8fhKUM9UN3iFD2%2BbJ%2B8apf6QSoh8Aw6uz7XuVghLNbmIdIECqYwH6UnYIp%2Fn5LNz3YFGYzJUSLfqrji29x%2FY%2FW5bNzoBSbwlR0GLoca3%2BrMzG2a%2FXope6WI4Eu0xQjrPslIVWLz%2FXRzUeh6OTBUE5PnKra4ABbSB%2BlgX2Z55MU9P3hPemKDe7IEA9P%2BU4qIUue%2B8qEQ0ZilOmIJnKOZ8DgScNwvTzGLOJiCAmebyvADSluvYzv8FrSySfeRFrVaG0KNpoRvdk54H5A4N6eVTcRVMlzOH2xsh%2FmQUmNwfAsjuMoWgSXhIidshQipATXfAc2WB7UXI55CJKMr5jK4cxqzqO8U8LPfgECMl21weZJaIMC%2FBPHxamRAT8e3WRyaoUj%2FygVeHfvlHHL9DNKWgjCNGXBvYbD1JswGIvSqarz1%2FvKUX9%2FC%2Fe9%2BX1QjF5zvQ3LstOuHG1WFVhaLFJLS6gQUGuL%2Flmi%2BIJuPuwXvLFe3zs36hTa6UWnoNyWh4vkH9LzBaiGjCrQB9w2W5keuFODTa67d7z3nTDqmhBt0FJ7CwHurJNvc0wkMRI83wuGIIdF6FecatcqrMXcIj%2BwAXiC3KCsLnBcDLbLMLHVm88GOqUBUGbg%2BsLQAICEKvsKRtOwZfcMW1aYouc8VvqKgGyJIlvVtJpC%2Bf6ST8mg2U3gjSq06qdkBVhtcNfMo0vFZl3lBbq%2Fm1p1jkCxY6us8iZO%2Bxq4gt0DV0jLDIgLRVmPUQSbEBKpGswVsNlblYqCVF0Synd2Bx%2Boy961k%2FMgptC6YOFQzEvSjaGXqXM1nfmSDijT%2FolMxz9Rbxkt%2FGum%2BArALR6%2F%2FPyU&X-Amz-Signature=fde7d9b23a69b63e735cb7ffaf43e88f814dc3a2b28eaa1ef8b94e8041a33cc8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

- 모델 구조
    - llava와 동일한 구조 사용
    - vision encoder, llm, 2개의 mlp
- 두 단계 visual instruction tuning
    - **stage 1: 능력 학습**
        - 데이터: vision-flan (187개 task 전체)
        - 학습 대상 모듈: mlps, llm
        - instruction tuning 안 된 LLaVA 모델을 initial 모델로 사용함
        - 학습 결과 모델: Vision-FLAN-Base
        - 목적: 다양한 task 수행 능력 확보
        - academic dataset이라서 출력이 짧고 단순함
    - **stage 2: 출력 정렬**
        - 데이터: 소량의 gpt-4 생성 데이터
        - 학습 대상 모듈: mlps, llm
        - Vision-FLAN-Base에서 finetuning
        - 목적: 사람 선호 형태로 답변 생성
- implementation details
    - 구조: llava
        - vicuna-13b v1.5, clip vit-l (336px), mlp 2 layers
    - stage 1: lr 2e-5, bs 16, epoch 1
    - stage 2: lr 1e-5, bs 8, steps 128
        - <u>**llava dataset에서 1000개 랜덤 샘플링함**</u>

### Experimental Setup

- 평가 데이터셋
    - 객관식 - MMbench, MME, MMMU
    - 자유 생성 - MM-Vet, LLaVA-Bench
    - hallucination 평가 - POPE
    - catastrophic forgetting 평가 - CIFAR-10, CIFAR-100, MNIST, miniImageNet
- 평가 방식
    - 공식 벤치마크인 MMbench, MME, MM-Vet, LLaVA-Bench, POPE, MMMU
        - 공식 평가 코드 사용
    - 아닌 경우
        - CIFAR-10, CIFAR-100, MNIST, miniImageNet
        - Vicuna 1.5 13B를 사용해 평가 수행
        - 4개 데이터셋 평균 성능을 **CF 컬럼**으로 보고
- 베이스라인 모델
    - BLIP-2, InstructBLIP, Shikra, LLaVA, Qwen-VL, Qwen-VL-Chat, LLaVA 1.5

### Results and Analysis

- 메인 실험 결과

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/25770ce1-f9ee-4c13-af82-536420f540d3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWCT75K7%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034458Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIBCOeJ4yRBbMw0EwqCm3n66DhDdVZoFDS4e%2B2mhmwbfmAiA1uvzc%2BbXgxntCyzzXjjJrQLPDzy%2Behbli8qL%2FYsl8uyr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMwgheAsmO%2Fina94%2BJKtwDr1AJXWFjgv7LjuF9gJyBk4zLX89uMyF8UhiUj8W%2BXZ0NSyCuVS2q0j4pzX9ceyvquSxe6e2yROty7QDV91AIyy5qqI9ilvCD0xdZ5CUYgzQuicEUsyVj4hV3Z8AIT%2FHeTVu5KmaZG7c7Bt1kzhL0BHwdptGTQAIsQX2Yu7yKZY%2F97MG6H8n1oqfjrO4wbBvwyT0fQPe3rTfut2OZhGhw1f5yo4p7dEg%2FtNwLFD7vclr4XWxN49T2jh0ZGkbJwnJue29gy867ALJ8I6sMXtxKTGzdzWtxT%2B%2FEPpAg7UDtYHjBz4UQilvqHlnTQwdNpF%2Fbj%2FZn47yr0OpqBvhsUi5i%2Buuqf%2Bn9paxTmmFWVqcmYVwt4anannMjaaoVM8eB02fKbSzfPYrU41PdkmiOA281eJRAGSXniiE32PNT7YPuKaZGTTG76wodg1IkKYQVGSrqhXdVdCpXerjHD1S%2FYj7rR3S9LZty9hTSHxIkNfHo2aJQLBlTLb2dUxct%2FkGG2KKGXFzlSBsiGCXQCtCVeKY5%2BteAogUjhbWOMDaFaJ0pyGg8He63rQEb8MjYOLfqU%2FV%2BB3zdmUbXSYWih2KMyey3oTDlj9wYz%2BDciCmwN42o8WY4n0lYiIzq7FgEeBswhNSbzwY6pgGUPnPdkTPwkJv7%2FqjS1vRAj0dLQqBXh%2BhqzEBkdcQQNjxGeZaUs2wyMbav9mv8YgCE4nil1V5%2BKhx6zI%2Ft1kFr%2BMrKYjH0Al7gEoTbftvbnK6Nf2vn7636mFxdtJLMpMLEPf7bDmUjLALXw8tfmPlLvZO3yfP2T%2F0839BZNpZAPgrhTjzMF7hGCnad5USbT1jSd0z4VeM%2BPOBACWXWI%2FWkPq%2FvaBPL&X-Amz-Signature=0628caee997bdb10a09434975200419b7fa99b5456185f97a94f73d71d108e6e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - VISION-FLAN BASE 성능
        - mm-bench 등에서 sota 달성
        - llava-bench에서 성능이 낮음 → **academic 데이터로 학습해서 모델이 짧게 답하는 경향을 학습, 사람 선호 스타일과 불일치**
    - VISION-FLAN CHAT 성능
        - llava-bench에서 성능 크게 향상
        - 동시에 hallucination, forgetting 낮음
        - chat 데이터에서는 성능이 향상되었지만 일부 벤치마크 성능은 떨어짐
            - gpt 데이터가 bias를 유입하고, hallucination이 증가해서 그렇다고 함… 이후 study에서 보여줄 것
- **Human-labeled and GPT-4 합성 데이터의 효과**
    - task 수 증가 vs 성능
        - task 수가 증가할 수록 모든 벤치마크에서 성능이 증가함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/4e200768-0371-488d-802d-4edfa4bff3f0/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XIKFCJUD%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQCDAzqjPx4GhNPePnSj%2FJtLNNAomFvAlcGgjLO9ZOFNEAIhALLHOLyQCAKshDhvbletcdQamKkNc%2Bu0SseUATWUxPIiKv8DCCwQABoMNjM3NDIzMTgzODA1IgytUl5sdpO9jGeyt8Mq3AMX2JpUUGqaH9FcxclyBaKDGCxc7qYX9bK9jicsgPdyxnREAv1lJ37VoVeLJAKd1IxFKvK8M6HW05ZlFvw%2FSR%2FL2akDRg4Tnceg7m%2FGRdNiNUFZEFGFFisvV3IMKSJf%2BdQ4TBpNza%2FGUDF80fcNv7IJ8cEKdFs3TJzVTah3eGGuUdVJXHYMJVcvuWfw8xVS%2F7IW08JmeXM1%2FRRMKKX4aysC1%2Bej4%2BlkNXBz2tyJM0QFA87EYTTgXDWwkVMN3oQR1%2Fm9%2F%2BVN5w5fjwP9sasfNrSLZaNwjDFQdYcZiqgfxgrdl5MbnpQnH2ul%2BvfgOXexRfrRg%2BmNuu3fP7b%2BY8mPcNuL8hJfl%2F%2FHw0T%2FjQl75Q7rdD7conyu60wHo6wZVFvf2ekvW%2BcBBMuc9n6NOAU41clJ9%2BEulxhtotTUiw60uC6eTUvd21bspkleFn%2Bk93aShMSquwutjw4WR8A%2FFKW4SmfRn2eUeghqDeE2%2Fql8PpQ3dMlcWtUs36CL5m0PoMl9VjM8EUu7s%2BLQ3UM1diAJCOPA41SiMdxAPTiuewzjtbt%2BH6BQrnRL46z2SYTsWOc52doHeQVbeA1uwzyYbsZ4UX1ks2zbNxUsg8hzeSsC2qwPIXL3OMHpkKLWYy2GZDCv1ZvPBjqkAe9EUPm7Enc%2BGzPzIm5x7I4ns2Yz8IdYUcB7gCnRbyK5UMcORBCMPPgCRb1O1TXAmo%2BmcsuXYRQUldx7oUIT0N%2BAmkdHocQrN159q8JR5XImkawNDd3I3M%2BWGJVJ%2Flo%2Ff516Hu2aNPwDtKpBAsZUGeWOGwLDKqLSaQkFy9iljp6kB%2BFXLMmb5r26CZ5g3GHvpjZxXbw2KpuHZI8BXXxmi%2BjJKBBk&X-Amz-Signature=e0a3a3e3e89426751b4bbc9bac8805f5063a7a83fc6871b1a02ecfdeb5cbb116&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instance 수 고정, task 수만 변화
        - 총 데이터 수는 고정을 하고, 적은 종류의 task에 많이 할당하는 것 vs 많은 종류의 데이터셋에 적게 할당하는 것

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/88327061-766a-4984-b803-900b02eaa01b/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4662UYBSQC5%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034500Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQDMJ%2B2hMgldhoLKLsaNm3o2DQrr40mKJdHQEuUWCpSICgIgfHojXXeKPLo3cyt%2FCx%2FqQS82kLH%2BJB4eCgO5LCMrGbgq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDGuSkAAHwSGNymFF%2FCrcA%2BrgcQucOZmtA%2F37BG8iSSDH3CvIDj%2Bk0PdBZkNTVv9zGuLdRl1c9z1cfYBrlun3SA1DiuOO%2FaCaWdIGzSI210Jy4kzCRYbv39NHBxd76Ojb3QewdieZbbbiF6d62PVEX%2F0VueZwMHO7%2BolpUd88s6d%2FYvk5j5Qzfb3ctYkRfhHvRIzkwCPjk1aj%2Fsf0VqZD1AFOqJWcO6MylGDBtGgzvrrcdwQSuN%2FiwHuVNqsOjidcF6EwD04TcDNgP7coK8Hrv96tU%2BP3%2FjvkUM6akJ0RqCBUBirWwkxIgRLh2GCY%2Fea6AlvQsyq4OZTmblr%2FVBUQgWhL%2FghpzR7xGhzFI9JDJYN2h%2FSH7BOjtDv7fwKo6L0cBscUYRqwFX121y4XbOljRKQAVK85op6arKKaheOQZ4cu0z9U6MctvLanNtzc3XkxitwJmHjqTxMlOus8pHa8w1mW4VyNzQaQZTjGvRTXz4QFJpAM53IjHvKQqx%2BUEOGnjIRnI8Z3NaRWYuh9ZK1t6zQ5PArLd0KoSZkfepQSz703JmO4vYEEAa1UXoDX9OV1S86SImEao6PKJNd2tmywpVRHCykxm6UWdNDsb7x8%2FBSZ9qW6XdwpAXo0FgtlvRc9oNINgsTHFE4DKJ%2BKMJnUm88GOqUBhupGendJKitQKOs4UmvpDSnFO4wnjHIoM17Gh4DMZ5aQrZy1LzgJwSRwmiUuZoMnL9sfOXW5Q4nBJX35cXOWOVNYLKZy86V0QJ1lMAd7yEs81HitEV0TJbiNOS%2FO6hm%2FnIk%2FRogdEGk8Y5wwcqaelEjLtysippl8bwgSlLOxLjMWYDGYd7nU3bq4bgGHmW545OcOQQeY7f0ReW0%2FMTpux6Yvthbt&X-Amz-Signature=22eddb378f3c73785c7212d6778eede72875a4ef9ed4c4f696ebd32c1eef301a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

            - task 수가 많은 것이 더 좋은 성능

        **⇒ 데이터 양 < task 다양성이 더 중요함**

    - **gpt-4 생성 데이터가 성능을 올리는지 분석**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/ea111f46-998e-46b1-8dec-4ec13b423247/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466VEMUMCGZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034501Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIAXjB9TFz7%2FSMdbYoYwHbx9ku51l%2B0cTNQnQaJfhEJLMAiB5a8fw0D0SVGlQzpOOsbL3sdBrbb4%2FI4XPba9ikqn%2BZCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMOcngCArRq3loWZa0KtwDyJO9%2BEFPpr0%2BxU5L2ip9v6SSsFvKyoNxDnw%2FzvTQvYP%2BJa8KHTJypoHhIpb3svOq4jEczL%2B87uDFGtgqlnBJdE7nfza%2BTZqwhVhmwZ9PJtNtlLdiJPnsMe9l%2FfYa2HoioJylWt8KjPHWUZmo0KH8zBIiiFNbmTZId5HOjSFtYuIzZIxq8zxd%2F3bVeu4A7kEwfzJc5BWdtrzSSVCYAoLruQGRM69UzvDzTzcc6fy6614J8pkd9nb8wNl%2BEEeFxwh2QTlr9DDWFqwoJt%2Bn2tcbT5IDiIaA0qFkEPlEWpMA00ILBGmUltneEK5Aka0bGPwe%2FO%2FwxHhB4sroQgRUqlo9Rlpj9u6%2BDsVxlNjDWarnztWRF8Dnzoi88Xoc9kr2olnAbCFN7fAN5SlvNoBRxGiXUriRVWD762yzuzbmfVDHqjAHWcJqv0yr4mI5Wrp86j254fKUxjVdjE2BvkHERjLXACCKcQ0TYNXGireDouq%2Fg84SQfUrLvesidQZK1WNtqyzRXQ4aTHMuzQiCHzrLh9SzDjyWJPC0SjXHGUDSQuPT03hY4SmJKwv%2BFbeLbGwxU3D5aTHgRu0su0UK7o%2Fy060YuGghb94Uk7o1EYwH960hu%2F8cKeE1EVUTlS%2FjkAw1NabzwY6pgHXWN8DoGczIJ%2BJAvoldgDsLcaaBkBPbyDMN1e7HeCfxNExpVwXw%2FL1ZHWctShVMZZY%2B2KE5stHkAdYvJMBIfOYcckuIzDW7EPBQvQwYsZ4AtCzr2yUicimM%2FHHI22E81Ii5XMi2TWfyV1wLttc%2BglFbYPkHcCjoE%2Bp%2BHcc%2BSozgMyzsN9xcF4Z0GGYWxPcje4zF9flKAVvhiKJ0wlVceltwqSmmkoL&X-Amz-Signature=dfccf7337ff526ad01342e50d2fd9a8439ac5ee0cf3c1a04ed550e6c510ee9d9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - mme, mm-bench와 같은 comprehensive benchmark 점수 비교
            - vision-flan base는 gpt 데이터를 추가 학습했더니 조금 떨어짐
            - llava는 초기 성능은 좀 상승하나 추가 성능 향상 없음

        → gpt4는 모델의 능력을 향상시키지는 않음 / 답변 형식만 바꿈


     

    - **gpt-4 생성 데이터의 양이 human preference에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/f9857712-4b1d-4b5b-b97c-4db8b78a96b6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666P5JUZIY%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034501Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIGky0CIQVqosF8ato51UqLdH5w9UW1VKR0Ju6BKlH%2FawAiEAu5%2BtYnRkIooVoKCZkTG6tsNKwOor87sp5avHSn8dxOUq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDCBaq%2BxL%2BozUbvBrGCrcA9uBY8kbBXSd4Ac2fGF%2B%2B9AhZhbuv0nBr%2FBNLrrIESf30iN4ZLdioTNy0A3k433VAVpoYEh0NyDIyDoyFi72R5%2F6EBTMoibtcpC%2FErBH07dUQPdX8ERIb%2BH3j%2B%2BNQzUte58wxMM8OxNsRoxecMYXQZUv6rIa3WOI9VASddskQN%2Be%2FT7FuOd0XRzVI71H3rR%2FeNYPtsgI1ZCH2K3%2BA8EQ73h0ylrXr6V7j9sUaEEj31jiABl4%2Fus5KgOM6KcyyduXt902jFk%2B5lOl%2Fac%2F9BXh%2BRuDzuJhR2qBkio4iChLDX4ZbwJGeXzr9%2Fdf17sJLPol4%2B1TibCELOAXYl1dL%2BaZ51CBkmeifeHmcDwS6Al3qz7PAc8uP0DTLMyVKk9clUheqZLGGCNJACkLpIctnovfeH3MDyDO5aYuAVdjGoXQ4OkxaD6PzwZmyIGp2PGqr0EqWLvXROnQITP2ha5N97wdLPhdJAVpVNy6h%2FYJCfqRb7sw%2F1l3fKNDnoUT98AkhA3zn%2Fb5vQ%2FUH8OyIGwOXHyfeOscqRkQAgnrn0Bso3vImGGksXHirGYvIgMSFDT%2F0ZeCnSioODk5o1MGTWkcyrXqGEVuhrxmbrYPmEoS8XWo0mO3XzHjH6RYxdeBYzbaMM%2FUm88GOqUB6nFolIzk%2BJzWp3ODKx%2FxSUd4Bs2lpZinhiX158p4kZm8SNr7yZqommjs7qi8uc1V0p6GfP032iLPSHwTrDBGzsnNbIP3ryAlXH9dJ1rHSiavbp8RpaHjo3I5KvQT1vcJk%2B4nyehs%2BKnP21moEYzNJcYJN5cLWly%2BWT4P2k20Nlu7fF3FmJ6n%2FdPAHDKNw33A3My6OnvkkyEDLRS3OWeE2Q4TmVvz&X-Amz-Signature=f295c040b3ae85497a3b658c362ee6ab3f2bfd2b623e4a6deb8bda59ae75baec&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - llava-bench에 대해서 평가
        - 1000개 만으로도 큰 향상

        → 소량 gpt 데이터만으로도 사람 선호 alignment 충분히 가능함

        - 오히려 양이 너무 많아지면 성능 감소
    - **gpt 데이터 양이 hallucination과 bias에 미치는 영향**

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/0f3ea1ba-d536-435d-881f-722da5825afe/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466625UAHNZ%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034502Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIQCIQ7a6jj%2F81TjkmzANk2hNzYhS%2F7JER3BcNuFhLHLlCwIgLbiZNmpv3L2b7h05o4XNOGNMnH7HwMPjDfHqfl5beckq%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDP2dMinCQ2FK1jIG5CrcA1E6K4h8Cxfo9xj54tOFf9SCNwhfbnUbyDrVHN1S44q5HhnZKH5CA%2BnNIS0lEBWsYPPMHX3Uh%2BvKoieAVeomvBduggMQdK508mnwBtSi0Wcv7A5HBr27%2BOHw0XyjVcO3BVKntYRQqRYNFQP5%2BurU8VupVs2I4jLL0MpifwApA8XuHvfF%2BTuOavVn%2BhwcnOqgLKyWvi3W%2FghIuiMSbehQHVjZCXhtXpGw7vXQImdWz3GBapXG1qvI%2Bk1fLq6ijCWVE%2B4O8syffS9CaXgV2yWqVagpU8DnRy3b3lhVglZq3iSgND7Cry%2FRIxW0DD6q1Nja0TXXlatpuB98RvJTIrIzotY7m%2Bpn9zI6zaK7Q59nXw81tkqPWiILggaqSpgN3REPgcDBnCwg%2B3VoAA60KfTdiD4%2F44%2FMOSwdgGMfL2iiUWBOcHAtNgiOn1YR4yoOz614ORHlMDudp9IZ30DslnOyXn2iSydQbV%2B4VEcQtW6ilw3zKPCGGPWirEoBiWkFjbhtqhmEvfJz3pTtEMGrRWbUdCRQXvnvYDlY7IbRbg%2Fzt0y9CRYPIK7LQVucwHXaATfV8ZAFZkaV2s03udvn97LzpTYNuDCr9zlY%2Bhh3QWn2uU9KSEbXZ%2Fc8DyjWom8pMLvWm88GOqUBS3pF%2Fv0Dj1kSTLG018uVWKp9G2kTMLCHz4oWAB7rnEhDy82KpqPT8xkWf37a7aAC1aYwPxTJwljJW6fbSjkuswz%2B9i%2FhfVUmc9r7%2BzGD8ePrkGQErqgqghBwzdNj%2Fw95slyc%2BLCDL%2BsRqIMJv%2BmhQvY7yZz0lajLskCsODmySdS7oRn7qIbMe6%2Bi8m2r9ktBFBHceCZ9Hpx8DGcjgdua2CFm9AGq&X-Amz-Signature=ac529a08979310c9f50aefd4e749c5bb3b668460cc6d5b67cbf0e7e04871ddfd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - gpt 데이터가 많아질수록 모델이 yes를 더 자주 선택함
        - hallucination도 높아짐

        → gpt 데이터가 많아질수록 bias와 hallucination을 증가시킴

- **단일 stage를 mixed 데이터로 학습 vs two-stage 학습**
    - 단일 stage
        - vision-flan + gpt 데이터 한번에 섞어서 학습
    - two stage
        - stage 1은 vision flan
        - stage 2는 gpt 데이터 1000개

        ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7ab50784-d4d1-4351-9df9-1c455e9e6bad/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SJ4CKWDC%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034503Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJIMEYCIQCM%2BT9IY1N4ZbaaVI61JUvRaO5UiLNlsbzzg4SgCIV0kAIhAOavzz2U9jiry9WAoVVFh24XgUqfapwoIZ5Q8J77yiRAKv8DCCwQABoMNjM3NDIzMTgzODA1IgxSpsunsYFqjz8eMokq3AP9Wqeweii12jtnyvdZiQ7Bqa0oha6oIzIXRX%2Bbt7NFptUF3B6mkocLeRfD5n3HVd%2FaWGXTV9Mu1rDikOrYuzBzOm9f%2BaVEqbRwAYy3ZUERgnQV0d2o8Kan%2BQn0UW4OYY%2F3qz%2BILz%2FaZc5XYqhxpunTGbPyh%2F6uc0pCynK%2BDBAtgTNQyCUAR1aFqw4VwmSt1hgPwtQcWmH4IgiifHEboTcqg%2BwigciN8FGZjhKv8mJEaJYQY6qzrVkNk6JdHv%2FlWXwI3XiFIo3JYzMJ1y2qakyQJpVpDVOE7%2BOLTAHlM9zZFj%2BzDtsUpsSiSVXrw6OBp%2BuL9Mn2RH3yh%2F2ufqC9fouBkBm%2B27LLAOp4wNouh6ofVEKMfyCkBIoLECAIWDpS%2FRREmRmTvih7egv1lJXJz2rrqd%2FcJ8dOTmYGTU7ZOFEG0aaGQxAVStW%2BGCz8JebzwJGgN5lYiveShKoSMaEL8aK2AvKD3O2k7jpK5YKJOsrXkQiAlw%2B8%2F3rRahop8W4aY81PG8A%2FwIovDOscF2IRjbmLAiGiIG2Mtb0kk9OnTwp2YCBzQ7BDcmlNqM0qQ3XhgSZVjSof1BAQNR%2B2fXKydsuSjpIJTXlEH3EjlA2iFfiq8VUWUkQcnbNsBrFRIDDP1pvPBjqkAVU0SeBxWkHxAlum71X1du06jZd%2FmDpHlQ0oloJaepTMkMNidrb4p3GWa3XOOvW%2BRdsbyAYFNFNKfEB5EQygdfYj8R%2Bm0R%2FsqdLLssZ1VHbBLVVI%2FdxIHNsmai8R%2F6v0phjDpNKM1QL%2BF6IJ1aBxo3hp1DDJSenEGy3WK6R9e0Yosim5ef%2FLO2ADPj10TzU8RnskLc8Wpib458xDQOoR9czlqbeR&X-Amz-Signature=c7b3abe35c613a0412ba5a5058576502db57e7a820a527ea43ddb6a762680ddb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mixed 데이터 방식은 성능이 낮음
        - gpt 데이터 많이 써도 성능 오히려 떨어짐
        - two-stage가 좋음
            - 단계적으로 학습하는 것이 각 단계의 역할이 분리되고 더욱 효과적임
- **새로 만든 task의 효과 분석**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/a29b88df-c5e0-458d-ad37-f1d415fa49d1/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46667KCY3FS%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034505Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIHf6wsaqHF7El8mZ3RgYPgIty5baSH5mvyxl%2BsVDTEU%2FAiAy4tG2d%2BJrGWnTq5M%2Fpg%2Fflc1Xw%2B9rvvuJFk1hOsSKSCr%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMvt5vofK76eP9WvUJKtwDwot8ql49iMu91M7Zcn%2FE00wg0%2FFvquzvlD6sbtR1rqLRlRJGdxE4baJviH5C%2BBARDZKH%2FCb1RSYnw2JqHpYP4oRIMGiweOa6Bpud%2Bab8sBErjDaFW3v8k1BZDMH7Yel%2F0JsTh8kIqHpgnwz3ZQ56D%2F4Lstr25Hv0tc1esr4h83qY7214WPW5wxxl98wjV%2BNXw%2Fa4R%2BZtOneoqNBROC2gS%2F4rmDhZXhtPI3AjL3C7Y97R1iux6wj0x6WMySl6KTEV7TdjmXgqsqDva5pPlDCSnvFkvCw4HuWmu60SDz4O7RmzOrdW0mk8iEBd5CTGCfg%2FSSDaUKPEpsoTyZgwlvEyZPJNQ03Zef4RQATtqI2v8ToGEqXUAxq%2BZbjMYtVBhKVkeoD%2FKz2XnofEcpwpxG9Gv2sseduTrRRlpp18a%2FDLaOqAUUrZm0nNwKMLCcvmWjft3%2FyAvjItXYVPFgz%2BJjw%2Bo9xvcbD9H4yvx8IMMLZoNlY1j8zAEhpJgE0mivxJH9WuGOQDAYW93uU44nwLLYwtwkbTYX61vElNjPNT9fddE4%2Fk34LBln4jSHhfA57db2hdE6imEMOZCdnWdoh1wY%2Flk2hkQ%2B2%2B9CHGQiFXlD%2B%2BBw3aoljQiU94uv8p3vsw89WbzwY6pgHkuUY0xS4ceI86LhZLK4jWNhN20R0cYij7MiH7dsrIgJAgAbU6SxuAgKAbQd1sasI6Z1UF8fqnA0WsXJsZzNXEixzXtccaBirfj1r36c2tPgoJ0N37iIc9r314xIedrEE%2FKEhcfi0bxxs7kKISzggwbnnsHM1VuGJLRB5ZpBmeyP779rFX%2B7ADpx7hXJacP7AuNMkPyupwyumV4OweQzthhOTF%2F8yi&X-Amz-Signature=393d17378ffec2d73c1b8cb83b077af4e85743d8f8af0604bb60bbac5b8036a7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - 전체 task 사용 vs 기존 task 사용
    - 전체 task 사용하는 것이 (즉 새로운 task 포함하는 것이) 더 좋음
- **각기 다른 task group에서 온 task들의 기여**
    - vision-flan은 크게 3가지의 큰 그룹으로 나뉨
        - qa, classification, generation
        - 각 그룹을 하나씩 제거한 모델을 학습해서 성능 비교함

            ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/7dd4e12c-d88d-4732-987f-1d4e5ab21080/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WKRLUEC7%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034507Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJGMEQCIFCpq%2FhjG1XqQbgpF2d6cyoE2h5O6exTM%2B38aM5GmI5rAiBG2%2FITgdPatJH%2BqLY5vbjV%2FPN21GOQYz%2FnyC1VscY1qir%2FAwgsEAAaDDYzNzQyMzE4MzgwNSIMm4m5e0J%2BczxWaKgMKtwD1Xomph5fI5BAbp9Fah1IJJBuSfSn1%2FZLTHlmG8Jz3ucGirxkdY4tHSKpNgveA2jmhTMt5jCvIzbg0%2BitjCHMyMV7oOSdVme54dmQnhKm5wqImlKBspny83hCJVYs774RXc1cM7Fc%2BiOH1DPkoY%2FeqEv7TzYhKEhtvrKqfg2fqIAhyYZwsCgc2n9lRpn83njcZ3TqPaVwNXAbd4giye%2B1ueoTwgh9Wmpzn7sDBa0RXjqRo%2B9WbHkAbcF4ZKZYDFSrsj%2F1RNJDDmngnFjxcioWOmg%2BvfUcbo%2F1IPA5VPU9%2FGvLrJKdcMK7gLL7xlvBn9hM3oRt5COfO8U4AAjtPt1roi9J9MhjN8nYNqeFMGjmsOY5fmgg6UeqO67oK9N6kMyFBsMb1A0gzoG1MxAJD8N3SCgKgwWQa8OALRdVQgDp2DZAAVUUP8Sd8bc4tjIIKYAsYJyM6ktpz4Xb%2FM949bBKi0huFqy%2B959eBkEF0WrEIdlNAu5R0b3KQhm5V%2BjOoz8rSEkLEVXx%2BSwQo0aRBapmhJlQUvGO%2BCbvllDdlOmIb2GmCqdea3Biy%2FCQdT1X4WfdRZ4CI3%2BCDGy%2BFov2lohO8kS6m8wIzXGedFBPRpLVeA1Z0oD6bmXNZfrGwVswvtSbzwY6pgG1%2BziRcBCyppb8YNFUzAtujjuKfkN1hpbNP20Q1USaygmOaGpi%2FpHapC7KTLBfLlsC%2B314s8KaCel6lctOsHJJMEkPP3FyufVbto21%2FMn6us561fcby%2BQ9%2FcSFEQsGuEc5Z88gCHBKoU%2B6Lg%2Baap8T8z1aoFqSMQ06T3wbMZvo9Qs%2BRVYURiiDg3uVAfmD7sDQFQu0d3pi38BtILIS1RaRVXw95qQ5&X-Amz-Signature=66247e01967ad2b7c75eac4b497bacdb96f6139e91aa3359ef0344daf8977d08&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

        - generation 제거 시 llava-bench가 크게 하락
            - 자유 생성 능력에 중요
        - qa + classification은 제거하니까 mme가 감소
            - 종합적인 성능에 중요함

    ⇒ 3가지 task는 각각 다른 능력을 담당하며, 모두 함께 있어야 최상의 성능이 나옴

- **visual instruction tuning이 adapter와 llm 중 어떤 성능을 올리는가**

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/d420f158-af67-4ec6-b7f4-f4d56f9ff85e/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XE6HZMDM%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIBP62HQDaSHvNbCqb4FKQVeWXYXuNW4mHw9mO9FYZNdSAiEAidJxl57DCQMyC95xgE%2B1LXLzHRZ%2B2BFwc%2BnksqICAs4q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDA2aAjL74qaSSkyt8CrcA7Wqn3tqBmL2ojhyhQ5QENU8hpd576yzXROmCIjyUzbM7pIF7Mqu0GTHvEFF2%2FDqOo%2B70P7Yq0Ok7m3DNDXOMiTnA%2FSw8ySAm3xzNcdOPgV9hV9Zt2efteSC7SNh5BCmgRX9UYnRePOARPMIuRPec0almwCGWVr54EgXatAE5FgBeMHFDpiXcxqUiwa4ssp5%2BN4r1JBRANBt5sTEXZs3d9Nn6yNKmRy9of18LvJK5qHBi3utxoQgO3wNs2zJzLFGmtpLdwjlv57sOdf0TdUZSXSlNOkBNHoXB6ROHSOm1D40DaKe%2Fqwkjos%2BgFCP%2BQzCh8zB%2BNDDhAXgo1peL9NXTthBbpTBi69kgabf1tIvSp5sJCFZ%2FfrxC4knRXWTHYyeW3U1lJdN7K1tHhb8Y8l7f2sYoovI14Oig5jniTNRBT6QGAHU7irwJ%2FWhT0%2BJ8Ii6BwNpMTi4FfdVvF5gONPOMAPB41xpLpPlYG8dhpxNaiyaHufKb0iJDw1grfwjKk94UuEfm1Ko1UyNIwpAiteP4eSVHEAKRwp8epek8yrUmjpikDRvcy5PwmLExxIAyVVrJTtulN2stdDl%2Be9%2BVFVbTT3eV%2B%2FM1u8rNr0BiB%2Bwa%2FHVLRvUF%2BWjflqsdonvMI%2FXm88GOqUBy5ZfqkCx7KvehyuZjtI99IeU8b%2BHXV8u%2F8cjADst026qV13t1u1QAcupgjZEtmJ0gkQ9CJ4cbV5MY%2FH%2FqD1hNB0OVzM6wG0ON49kI7xtJvKeoFh2J99neVuzAb0mEXOKqHBnN0xj%2FrOhnnL3x3lMdZyqJuS0CSFl2HxH6Ghnk5NcwdN2g%2FVnJGuWUy%2FLQbQI7g7juCc5r0%2B4QE9VBx1QWnq9SIBP&X-Amz-Signature=1b02f2b258cdb867184820044297fa7c16ff66f3dbb99b8c675bb64b8fb1565d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - mlp만 학습 → 성능 낮음
    - llm만 학습 → 성능 많이 개선
    - mlp & llm 학습 → 최고 성능
    - llm만 학습해도 거의 최고 성능에 근접하게 나옴
        - mlp의 역할: pretraining 단게에서 이미 충분히 학습됨

        → instruction tuning 단계는 llm이 visual feature를 충분히 잘 “이해하도록” 만드는 과정임


    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/8937ab66-9873-42b9-a0ea-ddc3bff7d2bd/9692c56d-b6b9-4f17-a8e0-95eed7eee469/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XE6HZMDM%2F20260421%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260421T034509Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGMaCXVzLXdlc3QtMiJHMEUCIBP62HQDaSHvNbCqb4FKQVeWXYXuNW4mHw9mO9FYZNdSAiEAidJxl57DCQMyC95xgE%2B1LXLzHRZ%2B2BFwc%2BnksqICAs4q%2FwMILBAAGgw2Mzc0MjMxODM4MDUiDA2aAjL74qaSSkyt8CrcA7Wqn3tqBmL2ojhyhQ5QENU8hpd576yzXROmCIjyUzbM7pIF7Mqu0GTHvEFF2%2FDqOo%2B70P7Yq0Ok7m3DNDXOMiTnA%2FSw8ySAm3xzNcdOPgV9hV9Zt2efteSC7SNh5BCmgRX9UYnRePOARPMIuRPec0almwCGWVr54EgXatAE5FgBeMHFDpiXcxqUiwa4ssp5%2BN4r1JBRANBt5sTEXZs3d9Nn6yNKmRy9of18LvJK5qHBi3utxoQgO3wNs2zJzLFGmtpLdwjlv57sOdf0TdUZSXSlNOkBNHoXB6ROHSOm1D40DaKe%2Fqwkjos%2BgFCP%2BQzCh8zB%2BNDDhAXgo1peL9NXTthBbpTBi69kgabf1tIvSp5sJCFZ%2FfrxC4knRXWTHYyeW3U1lJdN7K1tHhb8Y8l7f2sYoovI14Oig5jniTNRBT6QGAHU7irwJ%2FWhT0%2BJ8Ii6BwNpMTi4FfdVvF5gONPOMAPB41xpLpPlYG8dhpxNaiyaHufKb0iJDw1grfwjKk94UuEfm1Ko1UyNIwpAiteP4eSVHEAKRwp8epek8yrUmjpikDRvcy5PwmLExxIAyVVrJTtulN2stdDl%2Be9%2BVFVbTT3eV%2B%2FM1u8rNr0BiB%2Bwa%2FHVLRvUF%2BWjflqsdonvMI%2FXm88GOqUBy5ZfqkCx7KvehyuZjtI99IeU8b%2BHXV8u%2F8cjADst026qV13t1u1QAcupgjZEtmJ0gkQ9CJ4cbV5MY%2FH%2FqD1hNB0OVzM6wG0ON49kI7xtJvKeoFh2J99neVuzAb0mEXOKqHBnN0xj%2FrOhnnL3x3lMdZyqJuS0CSFl2HxH6Ghnk5NcwdN2g%2FVnJGuWUy%2FLQbQI7g7juCc5r0%2B4QE9VBx1QWnq9SIBP&X-Amz-Signature=a20024976cb25d11b7ee110082a59df1ee1a585f7107541bc277abc3e3f62f3b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

    - instruction tuning된 mlp를 제거하고 pretraining mlp로 교체함
    - 성능이 90% 이상 유지됨 → 큰 차이는 아님

    → visual instruction tuning의 본질은 mlp가 아니라 llm이 visual feature를 이해하게 만드는 것임 


### Related Work

- instruction tuning
    - nlp에서 시작 → vision-language로 확장
    - multiInstruct
        - 최초의 human-labeled 멀티모달 instruction 데이터
    - llava
    - 이후 확장 연구 - 3d, multi-image, video로 확장
    - 혼합 데이터 방식
- 성능 개선을 위한 여러 시도들
    - 데이터 생성 다양화
    - bias/robustness 개선
    - visual grounding 강화
    - ocr 관련 개선
    - scaling 연구
    - gpt-4”v” 활용
- 본 연구의 차별점: human-labeled task 확장에 집중 / task 다양성을 늘림

### Conclusion

- VISION-FLAN 구축
    - 187개 task, 166만개 데이터, 모두 academic 기반 + expert instruction
- two-stage 적용 시 여러 벤치마크에서 sota 달성함
- human-labeled data vs gpt 데이터의 역할을 분석함

### Limitations

- 모든 task가 영어
- 모든 task가 단일 이미지 기반
- gpt-4 기반 데이터하고만 비교하고, 더 최신 gpt-4v 데이터는 고려 안함
- 모델 구조 제한 - llava만 사용해 봄
